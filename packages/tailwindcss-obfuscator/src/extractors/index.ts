/**
 * Class extractors for tailwindcss-obfuscator
 */

import * as fs from "fs";
import * as path from "path";
import fg from "fast-glob";
import type { ExtractionResult, ExtractorFn, PluginContext, Logger } from "../core/types.js";
import { addClasses } from "../core/context.js";
import { extractFromHtml } from "./html.js";
import { extractAllFromJsx, extractClassListLikeStrings } from "./jsx.js";
import { extractFromCss, extractFromTailwindV4Css, detectTailwindVersion } from "./css.js";
import { deduplicateClasses } from "./base.js";

export { extractFromHtml, extractFromHtmlAggressive } from "./html.js";
export {
  extractFromJsx,
  extractFromJsxWithCva,
  extractAllFromJsx,
  extractFromTailwindVariants,
  extractClassListLikeStrings,
} from "./jsx.js";
export { extractFromCss, extractFromTailwindV4Css, detectTailwindVersion } from "./css.js";
export * from "./base.js";

/**
 * Map file extensions to extractors. Every JS-family extension uses
 * `extractAllFromJsx` (which composes `extractFromJsx` + `extractFromJsxWithCva`
 * + `extractFromTailwindVariants`) so that classes inside `cn()`, `clsx()`,
 * `cva()`, AND `tv()` are picked up uniformly. Before fix #61, `tv()` was
 * registered as a separate extractor that was never invoked, leaving
 * `tailwind-variants` users with un-obfuscated bundles.
 */
const EXTRACTOR_MAP: Record<string, ExtractorFn> = {
  html: extractFromHtml,
  htm: extractFromHtml,
  css: extractFromCss,
  js: extractAllFromJsx,
  jsx: extractAllFromJsx,
  ts: extractAllFromJsx,
  tsx: extractAllFromJsx,
  vue: extractAllFromJsx, // Vue uses similar syntax
  svelte: extractAllFromJsx, // Svelte uses class:
  astro: extractAllFromJsx, // Astro uses className
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
 *
 * `opts.scanObjectStrings` opts into the lookup-table-string extractor
 * (`extractClassListLikeStrings`), which catches Tailwind class strings
 * stored in object-property values that the standard JSX walker doesn't
 * reach. Default off — see `scanObjectStrings` in `ObfuscatorOptions`.
 */
export async function extractFromFile(
  filePath: string,
  opts: { scanObjectStrings?: boolean } = {}
): Promise<ExtractionResult> {
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

      // Optional second pass: scan ALL string literals for class-list-like
      // contents (handles class strings stored in object property values).
      // Only relevant for JS-family files where the primary extractor is
      // `extractAllFromJsx` — for HTML / CSS files, classes inside string
      // literals are already handled by their dedicated extractors.
      if (opts.scanObjectStrings && JS_FAMILY_EXTENSIONS.has(getExtension(filePath))) {
        const extra = extractClassListLikeStrings(content, filePath);
        if (extra.length > 0) {
          result.classes = [...new Set([...result.classes, ...extra])];
        }
      }
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

const JS_FAMILY_EXTENSIONS = new Set(["js", "jsx", "ts", "tsx", "vue", "svelte", "astro"]);

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
 * Test a path against a list of patterns. RegExp entries use `.test()`;
 * string entries fall back to substring matching on the absolute path so that
 * users can write `"jose"` or `"node_modules"` without thinking in globs.
 */
function pathMatchesAny(filePath: string, patterns: ReadonlyArray<string | RegExp>): boolean {
  for (const pattern of patterns) {
    if (pattern instanceof RegExp) {
      if (pattern.test(filePath)) return true;
    } else if (filePath.includes(pattern)) {
      return true;
    }
  }
  return false;
}

/**
 * Apply `sources.include` (whitelist) and `sources.exclude` (blacklist) to a
 * file list. Earlier versions accepted these options in the config schema but
 * never enforced them — leading to bug reports where archived HTML/CSS under
 * gitignored personal directories ended up in the class mapping anyway and
 * corrupted SSR chunks (e.g. `require('util')` rewritten because a `class="util"`
 * appeared in some `*.html` snippet outside the source tree).
 *
 * Patterns are matched against the **relative** path (relative to `basePath`),
 * never the absolute path — otherwise an exclude like `/[\\/]jose[\\/]/` would
 * silently match every file under `/Users/jose/...` on the maintainer's machine.
 */
function applySourcesFilter(
  files: string[],
  sources: PluginContext["options"]["sources"] | undefined,
  basePath: string
): string[] {
  if (!sources) return files;
  const include = sources.include;
  const exclude = sources.exclude;
  if ((!include || include.length === 0) && (!exclude || exclude.length === 0)) return files;

  return files.filter((file) => {
    // Always test against POSIX-style relative paths so users can write
    // `'jose/'` regardless of the host OS.
    const relative = path.relative(basePath, file).split(path.sep).join("/");
    if (include && include.length > 0 && !pathMatchesAny(relative, include)) return false;
    if (exclude && exclude.length > 0 && pathMatchesAny(relative, exclude)) return false;
    return true;
  });
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
  const matchedFiles = await fg(ctx.options.content, {
    cwd: basePath,
    ignore: ["**/node_modules/**", "**/dist/**", "**/.next/**", "**/build/**", "**/.git/**"],
    absolute: true,
  });
  const filteredFiles = applySourcesFilter(matchedFiles, ctx.options.sources, basePath);

  const scanObjectStrings = ctx.options.scanObjectStrings === true;
  const contentResults = await Promise.all(
    filteredFiles.map((file) => extractFromFile(file, { scanObjectStrings }))
  );

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
  const filteredCssFiles = applySourcesFilter(cssFiles, ctx.options.sources, basePath);

  for (const file of filteredCssFiles) {
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
