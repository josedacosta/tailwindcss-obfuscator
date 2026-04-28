/**
 * Command-line interface for tailwindcss-obfuscator.
 *
 * Five sub-commands:
 *   - `extract`   — scan sources and write the class mapping
 *   - `transform` — apply an existing mapping to a build directory
 *   - `run`       — extract + transform in one step (preferred)
 *   - `obfuscate` — alias of `run`, kept for backward compatibility
 *   - `show`      — pretty-print the contents of a mapping file
 *
 * The `--config <path>` flag accepts both JSON and TypeScript/JS config files
 * (delegated to `core/config.ts`), the `--dry-run` flag on `transform` is now
 * honored end-to-end (no files are written when set).
 */

import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import pc from "picocolors";
import type { ObfuscatorOptions } from "../core/types.js";
import {
  createContext,
  initializeContext,
  saveMapping,
  updateMappingMetadata,
  loadMapping,
} from "../core/context.js";
import { loadConfigFile } from "../core/config.js";
import { ConfigError } from "../core/errors.js";
import { createLogger, logSummary } from "../utils/logger.js";
import { extractClasses, extractFromCssFiles, getExtractionStats } from "../extractors/index.js";
import { transformDirectory, transformFile } from "../transformers/index.js";

const VERSION = "1.0.0";

/**
 * Resolve options from CLI flags + an optional `--config` file.
 *
 * Throws {@link ConfigError} if `--config` is provided but the file cannot be
 * loaded or parsed; that lets the calling action surface a clean message
 * instead of a stack trace.
 */
async function resolveCliOptions(
  basePath: string,
  configPath: string | undefined,
  cliOptions: ObfuscatorOptions
): Promise<ObfuscatorOptions> {
  if (!configPath) return cliOptions;

  const absolute = path.resolve(basePath, configPath);
  try {
    const fromFile = await loadConfigFile(absolute);
    return { ...fromFile, ...cliOptions };
  } catch (cause) {
    throw new ConfigError(`Failed to load config: ${absolute}`, {
      configPath: absolute,
      cause,
    });
  }
}

/**
 * Walk a directory and report what `transform` *would* change without
 * touching the filesystem. Used by the `--dry-run` flag.
 */
async function dryRunTransform(
  dir: string,
  ctx: ReturnType<typeof createContext>,
  logger: ReturnType<typeof createLogger>,
  extensions: string[]
): Promise<{ filesProcessed: number; totalReplacements: number }> {
  let filesProcessed = 0;
  let totalReplacements = 0;

  async function walk(currentDir: string) {
    const entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".git") continue;
        await walk(full);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase().slice(1);
        if (!extensions.includes(ext)) continue;
        const result = await transformFile(full, ctx, logger);
        if (result && result.replacements > 0) {
          filesProcessed++;
          totalReplacements += result.replacements;
          logger.info(`[dry-run] ${path.relative(dir, full)}: ${result.replacements} replacements`);
        }
      }
    }
  }

  await walk(dir);
  return { filesProcessed, totalReplacements };
}

/**
 * Build the commander program. Exposed for unit tests; `run()` is the
 * production entry point.
 */
export function createProgram(): Command {
  const program = new Command();

  program.name("tw-obfuscator").description("Tailwind CSS class obfuscation tool").version(VERSION);

  program
    .command("extract")
    .description("Extract Tailwind classes from source files")
    .option("-c, --config <path>", "Path to config file (.json/.ts/.mjs/.cjs)")
    .option("-o, --output <path>", "Output directory", ".tw-obfuscation")
    .option("-p, --pattern <patterns...>", "Glob patterns for files to scan", [
      "**/*.{html,jsx,tsx,vue,svelte}",
    ])
    .option("-v, --verbose", "Enable verbose output")
    .option("--debug", "Enable debug output")
    .action(async (opts) => {
      const logger = createLogger(opts.verbose, opts.debug);
      const basePath = process.cwd();

      console.log(pc.bold("\nTailwind CSS Class Extraction\n"));

      let options: ObfuscatorOptions;
      try {
        options = await resolveCliOptions(basePath, opts.config, {
          content: opts.pattern,
          outputDir: opts.output,
          verbose: opts.verbose,
          debug: opts.debug,
        });
      } catch (err) {
        logger.error(err instanceof Error ? err.message : String(err));
        process.exit(1);
      }

      const ctx = createContext(options, "production");
      initializeContext(ctx, basePath, logger);

      const startTime = Date.now();
      await extractClasses(ctx, basePath, logger);
      await extractFromCssFiles(ctx, basePath, logger);
      updateMappingMetadata(ctx, ctx.detectedTailwindVersion || "unknown");
      saveMapping(ctx, basePath);

      const duration = Date.now() - startTime;
      const stats = getExtractionStats(ctx);

      console.log(pc.green("\nExtraction complete!\n"));
      console.log(`   Classes found: ${pc.bold(String(stats.totalClasses))}`);
      console.log(`   Files scanned: ${pc.bold(String(stats.filesWithClasses))}`);
      console.log(`   Duration: ${pc.bold(`${duration}ms`)}`);
      console.log(`   Output: ${pc.bold(ctx.options.mappingPath)}\n`);
    });

  program
    .command("transform")
    .description("Transform files using existing class mapping")
    .option("-m, --mapping <path>", "Path to class mapping file")
    .option("-d, --dir <path>", "Directory to transform (e.g., .next/static)", ".next")
    .option("-e, --ext <extensions...>", "File extensions to transform", ["css", "js", "html"])
    .option("-v, --verbose", "Enable verbose output")
    .option("--debug", "Enable debug output")
    .option("--dry-run", "Preview changes without modifying files")
    .action(async (opts) => {
      const logger = createLogger(opts.verbose, opts.debug);
      const basePath = process.cwd();

      console.log(pc.bold("\nTailwind CSS Class Transformation\n"));

      const options: ObfuscatorOptions = {
        mappingPath: opts.mapping || ".tw-obfuscation/class-mapping.json",
        verbose: opts.verbose,
        debug: opts.debug,
        refresh: false,
      };

      const ctx = createContext(options, "production");
      const loaded = loadMapping(ctx, basePath);
      if (!loaded) {
        logger.error(
          `Mapping file not found: ${options.mappingPath}\nRun 'tw-obfuscator extract' first.`
        );
        process.exit(1);
      }

      logger.info(`Loaded ${ctx.classMap.size} class mappings`);

      const targetDir = path.resolve(basePath, opts.dir);
      if (!fs.existsSync(targetDir)) {
        logger.error(`Target directory not found: ${targetDir}`);
        process.exit(1);
      }

      const startTime = Date.now();

      if (opts.dryRun) {
        console.log(pc.yellow("  [DRY RUN] No files will be modified\n"));
        const result = await dryRunTransform(targetDir, ctx, logger, opts.ext);
        const duration = Date.now() - startTime;
        console.log(pc.green("\nDry run complete\n"));
        console.log(`   Would process: ${pc.bold(String(result.filesProcessed))} files`);
        console.log(`   Would replace: ${pc.bold(String(result.totalReplacements))} classes`);
        console.log(`   Duration: ${pc.bold(`${duration}ms`)}\n`);
        return;
      }

      const result = await transformDirectory(targetDir, ctx, logger, opts.ext);
      const duration = Date.now() - startTime;

      console.log(pc.green("\nTransformation complete!\n"));
      console.log(`   Files processed: ${pc.bold(String(result.filesProcessed))}`);
      console.log(`   Replacements: ${pc.bold(String(result.totalReplacements))}`);
      console.log(`   Duration: ${pc.bold(`${duration}ms`)}\n`);

      if (result.errors.length > 0) {
        console.log(pc.yellow(`   Warnings: ${result.errors.length}`));
      }
    });

  // The unified `run` command — extract then transform in one step. Replaces
  // the previous split workflow. `obfuscate` is kept as a hidden alias.
  const runAction = async (opts: {
    config?: string;
    buildDir: string;
    pattern: string[];
    verbose?: boolean;
    debug?: boolean;
    dryRun?: boolean;
  }) => {
    const logger = createLogger(opts.verbose, opts.debug);
    const basePath = process.cwd();

    console.log(pc.bold("\nTailwind CSS Class Obfuscation\n"));

    let options: ObfuscatorOptions;
    try {
      options = await resolveCliOptions(basePath, opts.config, {
        content: opts.pattern,
        verbose: opts.verbose,
        debug: opts.debug,
      });
    } catch (err) {
      logger.error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }

    const ctx = createContext(options, "production");
    initializeContext(ctx, basePath, logger);

    const startTime = Date.now();

    console.log(pc.blue("Step 1: Extracting classes...\n"));
    await extractClasses(ctx, basePath, logger);
    await extractFromCssFiles(ctx, basePath, logger);
    updateMappingMetadata(ctx, ctx.detectedTailwindVersion || "unknown");
    if (!opts.dryRun) saveMapping(ctx, basePath);

    const stats = getExtractionStats(ctx);
    console.log(`   Found ${stats.totalClasses} classes\n`);

    const buildDir = path.resolve(basePath, opts.buildDir);
    if (!fs.existsSync(buildDir)) {
      logger.warn(`Build directory not found: ${buildDir}`);
      logger.warn("Run your build command first, then run this command.");
      process.exit(1);
    }

    console.log(pc.blue("Step 2: Transforming build output...\n"));
    let filesProcessed: number;
    if (opts.dryRun) {
      console.log(pc.yellow("  [DRY RUN] No files will be modified\n"));
      const r = await dryRunTransform(buildDir, ctx, logger, ["css", "js", "html"]);
      filesProcessed = r.filesProcessed;
    } else {
      const r = await transformDirectory(buildDir, ctx, logger, ["css", "js", "html"]);
      filesProcessed = r.filesProcessed;
    }

    const duration = Date.now() - startTime;
    logSummary(logger, {
      totalClasses: stats.totalClasses,
      obfuscatedClasses: stats.obfuscatedClasses,
      filesProcessed,
      duration,
    });
  };

  program
    .command("run")
    .description("Extract classes and transform build output (preferred)")
    .option("-c, --config <path>", "Path to config file")
    .option("-b, --build-dir <path>", "Build output directory", ".next")
    .option("-p, --pattern <patterns...>", "Glob patterns for source files", [
      "**/*.{html,jsx,tsx,vue,svelte}",
    ])
    .option("-v, --verbose", "Enable verbose output")
    .option("--debug", "Enable debug output")
    .option("--dry-run", "Preview changes without modifying files")
    .action(runAction);

  program
    .command("obfuscate", { hidden: true })
    .description("Alias of `run` (deprecated)")
    .option("-c, --config <path>", "Path to config file")
    .option("-b, --build-dir <path>", "Build output directory", ".next")
    .option("-p, --pattern <patterns...>", "Glob patterns for source files", [
      "**/*.{html,jsx,tsx,vue,svelte}",
    ])
    .option("-v, --verbose", "Enable verbose output")
    .option("--debug", "Enable debug output")
    .option("--dry-run", "Preview changes without modifying files")
    .action(runAction);

  program
    .command("show")
    .description("Display the class mapping")
    .option("-m, --mapping <path>", "Path to class mapping file")
    .option("-n, --limit <number>", "Number of mappings to show", "20")
    .action((opts) => {
      const basePath = process.cwd();
      const mappingPath = path.resolve(
        basePath,
        opts.mapping || ".tw-obfuscation/class-mapping.json"
      );

      if (!fs.existsSync(mappingPath)) {
        console.error(pc.red(`Mapping file not found: ${mappingPath}`));
        process.exit(1);
      }

      const content = fs.readFileSync(mappingPath, "utf-8");
      const mapping = JSON.parse(content);

      console.log(pc.bold("\nClass Mapping\n"));
      console.log(`   Version: ${mapping.version}`);
      console.log(`   Generated: ${mapping.generatedAt}`);
      console.log(`   Tailwind: v${mapping.tailwindVersion}`);
      console.log(`   Total classes: ${mapping.totalClasses}`);
      console.log(`   Obfuscated: ${mapping.obfuscatedClasses}\n`);

      console.log(pc.bold("   Mappings:\n"));

      const limit = parseInt(opts.limit, 10);
      const entries = Object.entries(mapping.classes).slice(0, limit);

      for (const [original, entry] of entries) {
        const e = entry as { obfuscated: string; occurrences: number };
        console.log(`   ${pc.gray(original)} -> ${pc.green(e.obfuscated)} (${e.occurrences} uses)`);
      }

      if (Object.keys(mapping.classes).length > limit) {
        console.log(pc.gray(`\n   ... and ${Object.keys(mapping.classes).length - limit} more`));
      }

      console.log();
    });

  return program;
}

/**
 * Production CLI entry point. Parses argv and dispatches to a sub-command.
 */
export function run(): void {
  createProgram().parse();
}

export default run;
