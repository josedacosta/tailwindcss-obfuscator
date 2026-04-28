/**
 * tailwindcss-obfuscator — internal API.
 *
 * Imported as `tailwindcss-obfuscator/internals`. Stability is **not**
 * guaranteed across minor versions. Consumers should rely on the main
 * entry (`tailwindcss-obfuscator`) whenever possible. This subpath exists for
 * advanced use cases:
 *   - building custom extractors or transformers,
 *   - integrating the pipeline into a non-supported bundler,
 *   - inspecting the token-position report,
 *   - extending the static-utility / functional-prefix registries.
 */

// Context internals
export {
  createContext,
  resolveOptions,
  initializeContext,
  saveMapping,
  loadMapping,
  addClass,
  addClasses,
  updateMappingMetadata,
  shouldObfuscateClass,
  getObfuscatedClass,
  getOriginalClass,
  getSharedContext,
  setSharedContext,
  clearSharedContext,
  exportSimpleMapping,
  clearUsedNames,
} from "./core/context.js";

export type { PluginContext } from "./core/types.js";

// Cache system
export { CacheStore, createCacheStore, initializeCache, saveCache } from "./core/cache.js";

// Configuration loaders (defineConfig is on the main entry)
export { loadConfig, loadConfigFile, findConfigFile } from "./core/config.js";

// Token extraction with positions
export {
  extractWithPositions,
  extractTokensFromFile,
  extractTokensFromFiles,
  groupTokensByFile,
  collectTokens,
  getTokenLocations,
} from "./core/tokens.js";

export type { TokenLocation, TokenReport } from "./core/types.js";

// Tailwind config validator
export {
  createTailwindValidator,
  loadResolvedTailwindConfig,
  noopTailwindValidator,
  tryCreateTailwindValidator,
} from "./core/tailwind-validator.js";
export type { ResolvedTailwindConfig, TailwindValidator } from "./core/tailwind-validator.js";

// Pattern primitives (regex constants, variant detection, validators)
export * from "./core/patterns/index.js";

// CSS escape helpers
export { escapeCssClassName, unescapeCssClassName } from "./core/css-escape.js";

// Extractors
export {
  extractFromHtml,
  extractFromHtmlAggressive,
  extractFromJsx,
  extractFromJsxWithCva,
  extractFromCss,
  extractFromTailwindV4Css,
  extractFromFile,
  extractFromGlob,
  extractClasses,
  extractFromCssFiles,
  getAllClasses,
  getExtractionStats,
  getExtractor,
  detectTailwindVersion,
} from "./extractors/index.js";

export type { ExtractorFn } from "./core/types.js";

// Transformers
export {
  transformCss,
  transformTailwindV4Css,
  transformHtml,
  transformHtmlWithDataAttrs,
  transformJsx,
  transformCompiledJsx,
  transformContent,
  transformFile,
  transformDirectory,
  getTransformer,
  isCompiledOutput,
  isCssContent,
  noopTransformer,
  transformJsxAst,
  createAstTransformer,
  transformCssPostcss,
  transformTailwindV4CssPostcss,
  createPostcssTransformer,
} from "./transformers/index.js";

export type { TransformerFn } from "./core/types.js";

// Logger
export {
  createLogger,
  formatNumber,
  formatFileSize,
  formatDuration,
  logSummary,
} from "./utils/logger.js";

// Unplugin core (for users who want raw access)
export { obfuscatorUnplugin } from "./plugins/core.js";
