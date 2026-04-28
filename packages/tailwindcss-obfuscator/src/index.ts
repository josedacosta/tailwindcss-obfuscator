/**
 * tailwindcss-obfuscator — public API.
 *
 * The package historically exported every helper from a single entry point,
 * which made the surface large and the boundary between "supported public
 * API" and "internal helper" blurry. This entry now exposes only the small
 * set of types and functions a typical consumer needs:
 *   - `obfuscate()` and `defineConfig()` for one-shot or programmatic use,
 *   - the option / mapping / result types,
 *   - a logger factory,
 *   - typed errors so consumers can `instanceof`-check failures.
 *
 * Power users that need extractor/transformer internals can import them from
 * `tailwindcss-obfuscator/internals` (see `./internals.ts`).
 *
 * Build-tool plugins live at their own subpath exports:
 *   - `tailwindcss-obfuscator/vite`
 *   - `tailwindcss-obfuscator/webpack`
 *   - `tailwindcss-obfuscator/rollup`
 *   - `tailwindcss-obfuscator/esbuild`
 *   - `tailwindcss-obfuscator/nuxt`
 */

// Public types
export type {
  ObfuscatorOptions,
  ResolvedObfuscatorOptions,
  ClassMapping,
  ClassMappingEntry,
  ExtractionResult,
  TransformResult,
  SupportedFileType,
  Logger,
  BuildMode,
  MappingOutputOptions,
  ResolvedMappingOutputOptions,
  CacheOptions,
  ResolvedCacheOptions,
  PreserveOptions,
  SourceOptions,
} from "./core/types.js";

// Configuration helper
export { defineConfig } from "./core/config.js";

// Logger factory
export { createLogger, createSilentLogger } from "./utils/logger.js";
export type { LogLevel, LogSink, CreateLoggerOptions } from "./utils/logger.js";

// Typed error hierarchy
export {
  ObfuscatorError,
  ExtractionError,
  TransformError,
  MappingPersistenceError,
  ConfigError,
} from "./core/errors.js";

// One-shot orchestrator
import {
  createContext,
  initializeContext,
  saveMapping,
  updateMappingMetadata,
} from "./core/context.js";
import { extractClasses, extractFromCssFiles } from "./extractors/index.js";
import { transformDirectory } from "./transformers/index.js";
import { createLogger, logSummary } from "./utils/logger.js";
import type { ObfuscatorOptions } from "./core/types.js";

/**
 * Run extraction + transformation in a single call. Suitable for scripts or
 * post-build steps that don't run inside a bundler plugin.
 *
 * @param options Obfuscator options.
 * @param basePath Project root (defaults to `process.cwd()`).
 * @param buildDir Build output directory to transform (defaults to `.next`).
 */
export async function obfuscate(
  options: ObfuscatorOptions = {},
  basePath: string = process.cwd(),
  buildDir: string = ".next"
): Promise<{
  totalClasses: number;
  obfuscatedClasses: number;
  filesProcessed: number;
  duration: number;
}> {
  const logger = createLogger(options.verbose, options.debug);
  const ctx = createContext(options, "production");
  initializeContext(ctx, basePath, logger);

  const startTime = Date.now();

  await extractClasses(ctx, basePath, logger);
  await extractFromCssFiles(ctx, basePath, logger);
  updateMappingMetadata(ctx, ctx.detectedTailwindVersion || "unknown");
  saveMapping(ctx, basePath);

  const result = await transformDirectory(`${basePath}/${buildDir}`, ctx, logger, [
    "css",
    "js",
    "html",
  ]);

  const duration = Date.now() - startTime;

  const stats = {
    totalClasses: Object.keys(ctx.classMapping.classes).length,
    obfuscatedClasses: ctx.classMap.size,
    filesProcessed: result.filesProcessed,
    duration,
  };

  logSummary(logger, stats);

  return stats;
}

export default obfuscate;
