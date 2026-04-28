/**
 * Class extractors for tailwindcss-obfuscator
 */

import * as fs from "fs";
import * as path from "path";
import fg from "fast-glob";
import type { ExtractionResult, ExtractorFn, PluginContext, Logger } from "../core/types.js";
import { addClasses } from "../core/context.js";
import { extractFromHtml } from "./html.js";
import { extractFromJsx, extractFromJsxWithCva } from "./jsx.js";
import { extractFromCss, extractFromTailwindV4Css, detectTailwindVersion } from "./css.js";
import { deduplicateClasses } from "./base.js";

export { extractFromHtml, extractFromHtmlAggressive } from "./html.js";
export { extractFromJsx, extractFromJsxWithCva } from "./jsx.js";
export { extractFromCss, extractFromTailwindV4Css, detectTailwindVersion } from "./css.js";
export * from "./base.js";

/**
 * Map file extensions to extractors
 */
const EXTRACTOR_MAP: Record<string, ExtractorFn> = {
  html: extractFromHtml,
  htm: extractFromHtml,
  css: extractFromCss,
  js: extractFromJsx,
  jsx: extractFromJsxWithCva,
  ts: extractFromJsx,
  tsx: extractFromJsxWithCva,
  vue: extractFromJsx, // Vue uses similar syntax
  svelte: extractFromJsx, // Svelte uses class:
  astro: extractFromJsx, // Astro uses className
};

/**
 * Get file extension without the dot
 */
function getExtension(filePath: string): string {
  return path.extname(filePath).toLowerCase().slice(1);
}

/**
 * Get the appropriate extractor for a file type
 */
export function getExtractor(filePath: string): ExtractorFn | null {
  const ext = getExtension(filePath);
  return EXTRACTOR_MAP[ext] || null;
}

/**
 * Extract classes from a single file
 */
export async function extractFromFile(filePath: string): Promise<ExtractionResult> {
  const result: ExtractionResult = {
    file: filePath,
    classes: [],
    errors: [],
  };

  try {
    const content = await fs.promises.readFile(filePath, "utf-8");
    const extractor = getExtractor(filePath);

    if (extractor) {
      const classes = await extractor(content, filePath);
      result.classes = classes;
    } else {
      result.errors = [`No extractor available for file type: ${filePath}`];
    }
  } catch (error) {
    result.errors = [
      `Error reading file: ${error instanceof Error ? error.message : String(error)}`,
    ];
  }

  return result;
}

/**
 * Extract classes from multiple files using glob patterns
 */
export async function extractFromGlob(
  patterns: string[],
  options: {
    cwd?: string;
    ignore?: string[];
  } = {}
): Promise<ExtractionResult[]> {
  const files = await fg(patterns, {
    cwd: options.cwd || process.cwd(),
    ignore: options.ignore || [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/build/**",
      "**/.git/**",
    ],
    absolute: true,
  });

  const results = await Promise.all(files.map((file) => extractFromFile(file)));
  return results;
}

/**
 * Extract all classes from files and add to context
 */
export async function extractClasses(
  ctx: PluginContext,
  basePath: string,
  logger: Logger
): Promise<void> {
  const startTime = Date.now();
  let totalClasses = 0;
  let filesProcessed = 0;

  logger.info("Extracting Tailwind classes...");

  // Extract from content files (HTML, JSX, TSX, etc.)
  const contentResults = await extractFromGlob(ctx.options.content, {
    cwd: basePath,
  });

  for (const result of contentResults) {
    if (result.errors && result.errors.length > 0) {
      for (const error of result.errors) {
        logger.warn(`${result.file}: ${error}`);
      }
    }

    if (result.classes.length > 0) {
      addClasses(ctx, result.classes, result.file);
      totalClasses += result.classes.length;
      filesProcessed++;

      logger.debug(`  ${path.relative(basePath, result.file)}: ${result.classes.length} classes`);
    }
  }

  const duration = Date.now() - startTime;

  logger.info(`Extracted ${totalClasses} classes from ${filesProcessed} files in ${duration}ms`);
}

/**
 * Extract classes from CSS and detect Tailwind version
 */
export async function extractFromCssFiles(
  ctx: PluginContext,
  basePath: string,
  logger: Logger
): Promise<void> {
  const cssFiles = await fg(ctx.options.css, {
    cwd: basePath,
    ignore: ["**/node_modules/**", "**/dist/**", "**/.next/**", "**/build/**"],
    absolute: true,
  });

  for (const file of cssFiles) {
    try {
      const content = await fs.promises.readFile(file, "utf-8");

      // Detect Tailwind version if not already set
      if (!ctx.detectedTailwindVersion) {
        const version = detectTailwindVersion(content);
        if (version) {
          ctx.detectedTailwindVersion = version;
          logger.info(`Detected Tailwind CSS v${version}`);
        }
      }

      // Extract classes based on detected version
      const classes =
        ctx.detectedTailwindVersion === "4"
          ? extractFromTailwindV4Css(content, file)
          : extractFromCss(content, file);

      addClasses(ctx, classes, file);

      logger.debug(`  ${path.relative(basePath, file)}: ${classes.length} CSS classes`);
    } catch (error) {
      logger.warn(
        `Error processing CSS file ${file}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}

/**
 * Get all unique classes from context
 */
export function getAllClasses(ctx: PluginContext): string[] {
  return deduplicateClasses(Array.from(ctx.classMap.keys()));
}

/**
 * Get extraction statistics
 */
export function getExtractionStats(ctx: PluginContext): {
  totalClasses: number;
  obfuscatedClasses: number;
  filesWithClasses: number;
} {
  const filesWithClasses = new Set<string>();

  for (const entry of Object.values(ctx.classMapping.classes)) {
    for (const file of entry.usedIn) {
      filesWithClasses.add(file);
    }
  }

  return {
    totalClasses: Object.keys(ctx.classMapping.classes).length,
    obfuscatedClasses: ctx.classMap.size,
    filesWithClasses: filesWithClasses.size,
  };
}
