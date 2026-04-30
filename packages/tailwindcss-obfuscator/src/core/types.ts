/**
 * Core type definitions for tailwindcss-obfuscator
 */

/**
 * Preserve options to keep certain classes or functions from being obfuscated
 */
export interface PreserveOptions {
  /**
   * Function names whose string arguments should not be obfuscated
   * Useful for debug utilities, analytics, etc.
   * @example ["debugClass", "trackClass"]
   */
  functions?: string[];

  /**
   * Class names that should never be obfuscated
   * @example ["dark", "light", "active"]
   */
  classes?: string[];
}

/**
 * Source filtering options using glob patterns
 */
export interface SourceOptions {
  /**
   * Glob patterns for files to include in transformation
   */
  include?: (string | RegExp)[];

  /**
   * Glob patterns for files to exclude from transformation
   */
  exclude?: (string | RegExp)[];
}

/**
 * Mapping output options
 */
export interface MappingOutputOptions {
  /**
   * Enable mapping file output
   * @default true
   */
  enabled?: boolean;

  /**
   * Path to save the mapping file
   * @default ".tw-obfuscation/class-mapping.json"
   */
  file?: string;

  /**
   * Pretty print JSON output
   * @default true
   */
  pretty?: boolean | number;

  /**
   * Output format
   * @default "json"
   */
  format?: "json" | "text";
}

/**
 * Cache options for persistent mappings
 */
export interface CacheOptions {
  /**
   * Enable caching
   * @default true
   */
  enabled?: boolean;

  /**
   * Cache directory
   * @default ".tw-obfuscation/cache"
   */
  directory?: string;

  /**
   * Cache strategy when loading existing cache
   * - "merge": Merge with existing mappings (default)
   * - "overwrite": Overwrite existing mappings
   */
  strategy?: "merge" | "overwrite";
}

/**
 * Token location in source file
 */
export interface TokenLocation {
  /**
   * The raw class candidate
   */
  rawCandidate: string;

  /**
   * File path where the token was found
   */
  file: string;

  /**
   * Line number (1-indexed)
   */
  line: number;

  /**
   * Column number (1-indexed)
   */
  column: number;

  /**
   * The full line text where the token appears
   */
  lineText?: string;
}

/**
 * Token extraction report
 */
export interface TokenReport {
  /**
   * All extracted tokens with their locations
   */
  tokens: TokenLocation[];

  /**
   * Number of files scanned
   */
  fileCount: number;

  /**
   * Source patterns used
   */
  sources: string[];

  /**
   * Files that were skipped with reasons
   */
  skipped?: Array<{ file: string; reason: string }>;
}

/**
 * Configuration options for the obfuscator
 */
export interface ObfuscatorOptions {
  /**
   * Prefix for obfuscated class names
   * @default "tw-"
   */
  prefix?: string;

  /**
   * Glob patterns for files to scan for class extraction
   * @default ["**\/*.{html,jsx,tsx,vue,svelte}"]
   */
  content?: string[];

  /**
   * Glob patterns for CSS files to transform
   * @default ["**\/*.css"]
   */
  css?: string[];

  /**
   * Classes to exclude from obfuscation
   * Supports strings and RegExp patterns
   */
  exclude?: (string | RegExp)[];

  /**
   * Classes to include in obfuscation (whitelist)
   * If specified, only these classes will be obfuscated
   */
  include?: (string | RegExp)[];

  /**
   * Output directory for the class mapping file
   * @default ".tw-obfuscation"
   */
  outputDir?: string;

  /**
   * Enable verbose logging
   * @default false
   */
  verbose?: boolean;

  /**
   * Tailwind version to target
   * @default "auto" (auto-detect)
   */
  tailwindVersion?: "3" | "4" | "auto";

  /**
   * Enable source maps for transformed files
   * @default true
   */
  sourcemap?: boolean;

  /**
   * Custom class name generator function
   * @param index - The index of the class in the mapping
   * @param originalClass - The original class name
   * @returns The obfuscated class name
   */
  classGenerator?: (index: number, originalClass: string) => string;

  /**
   * Use random class name generation for maximum protection
   * When enabled, generates cryptographically random class names
   * that are different on every build
   * @default true
   */
  randomize?: boolean;

  /**
   * Minimum length for randomly generated class names
   * Longer names = more security, shorter names = smaller bundle
   * 4 = 1.2M combinations (sufficient for ~5000 classes)
   * @default 4
   */
  randomLength?: number;

  /**
   * Refresh the class list on each build
   * @default true in development, false in production
   */
  refresh?: boolean;

  /**
   * Path to save/load the class mapping
   * @default ".tw-obfuscation/class-mapping.json"
   */
  mappingPath?: string;

  /**
   * Enable debug mode with additional logging
   * @default false
   */
  debug?: boolean;

  /**
   * Preserve certain classes and functions from obfuscation
   */
  preserve?: PreserveOptions;

  /**
   * Source file filtering options
   */
  sources?: SourceOptions;

  /**
   * Custom filter function to determine if a class should be obfuscated
   * Return true to obfuscate, false to skip
   * @param className - The class name to check
   * @returns Whether to obfuscate this class
   */
  filter?: (className: string) => boolean;

  /**
   * Ignore Vue scoped styles (data-v-* attributes)
   * @default true
   */
  ignoreVueScoped?: boolean;

  /**
   * Use AST-based parsing for JavaScript/TypeScript files
   * More accurate but slightly slower
   * @default true
   */
  useAst?: boolean;

  /**
   * Use PostCSS for CSS transformation
   * More accurate but slightly slower
   * @default true
   */
  usePostcss?: boolean;

  /**
   * Mapping file output options
   */
  mapping?: MappingOutputOptions;

  /**
   * Cache options for persistent mappings
   */
  cache?: CacheOptions;

  /**
   * Track token positions in source files
   * Enables detailed reports with line/column information
   * @default false
   */
  trackPositions?: boolean;

  /**
   * Also extract Tailwind classes from string literals stored in object
   * properties / factory args / lookup tables that the standard JSX /
   * `cn()` / `cva()` / `tv()` walkers don't reach.
   *
   * Heuristic-gated to avoid false positives : a string is picked up only
   * if it contains ≥2 whitespace-separated tokens AND every token validates
   * as a Tailwind class. Single-word utility strings (`"flex"`, `"red"`)
   * are NEVER auto-extracted — wrap them in `cn(…)` or add them to
   * `safelist` instead.
   *
   * Default `false` to preserve historical behavior, but recommended `true`
   * for any project that stores className strings in lookup tables (e.g.
   * status-color tables, badge variants by level).
   *
   * @default false
   */
  scanObjectStrings?: boolean;
}

/**
 * Resolved mapping output options
 */
export interface ResolvedMappingOutputOptions {
  enabled: boolean;
  file: string;
  pretty: boolean | number;
  format: "json" | "text";
}

/**
 * Resolved cache options
 */
export interface ResolvedCacheOptions {
  enabled: boolean;
  directory: string;
  strategy: "merge" | "overwrite";
}

/**
 * Resolved configuration with all defaults applied
 */
export interface ResolvedObfuscatorOptions {
  prefix: string;
  content: string[];
  css: string[];
  exclude: (string | RegExp)[];
  include: (string | RegExp)[];
  outputDir: string;
  verbose: boolean;
  tailwindVersion: "3" | "4" | "auto";
  sourcemap: boolean;
  classGenerator: (index: number, originalClass: string) => string;
  randomize: boolean;
  randomLength: number;
  refresh: boolean;
  mappingPath: string;
  debug: boolean;
  preserve: Required<PreserveOptions>;
  sources: Required<SourceOptions>;
  filter: ((className: string) => boolean) | null;
  ignoreVueScoped: boolean;
  useAst: boolean;
  usePostcss: boolean;
  mapping: ResolvedMappingOutputOptions;
  cache: ResolvedCacheOptions;
  trackPositions: boolean;
  scanObjectStrings: boolean;
}

/**
 * Class mapping entry with metadata
 */
export interface ClassMappingEntry {
  /**
   * Original class name
   */
  original: string;

  /**
   * Obfuscated class name
   */
  obfuscated: string;

  /**
   * Files where this class was found
   */
  usedIn: string[];

  /**
   * Number of occurrences across all files
   */
  occurrences: number;
}

/**
 * Complete class mapping with metadata
 */
export interface ClassMapping {
  /**
   * Version of the mapping format
   */
  version: string;

  /**
   * Timestamp when the mapping was generated
   */
  generatedAt: string;

  /**
   * Tailwind CSS version detected
   */
  tailwindVersion: string;

  /**
   * Total number of classes extracted
   */
  totalClasses: number;

  /**
   * Number of classes obfuscated
   */
  obfuscatedClasses: number;

  /**
   * The class mappings
   */
  classes: Record<string, ClassMappingEntry>;
}

/**
 * Result of class extraction from a file
 */
export interface ExtractionResult {
  /**
   * File path that was scanned
   */
  file: string;

  /**
   * Classes found in the file
   */
  classes: string[];

  /**
   * Any errors encountered during extraction
   */
  errors?: string[];
}

/**
 * Result of file transformation
 */
export interface TransformResult {
  /**
   * Original file content
   */
  original: string;

  /**
   * Transformed file content
   */
  transformed: string;

  /**
   * Source map (if enabled)
   */
  map?: string;

  /**
   * Number of replacements made
   */
  replacements: number;

  /**
   * Classes that were replaced
   */
  replacedClasses: string[];
}

/**
 * File types supported by the obfuscator
 */
export type SupportedFileType =
  | "html"
  | "css"
  | "js"
  | "jsx"
  | "ts"
  | "tsx"
  | "vue"
  | "svelte"
  | "astro";

/**
 * Extractor function signature
 */
export type ExtractorFn = (content: string, filePath: string) => Promise<string[]> | string[];

/**
 * Transformer function signature
 */
export type TransformerFn = (
  content: string,
  filePath: string,
  mapping: Map<string, string>
) => Promise<TransformResult> | TransformResult;

/**
 * Plugin context shared across the build lifecycle
 */
export interface PluginContext {
  /**
   * Resolved options
   */
  options: ResolvedObfuscatorOptions;

  /**
   * Class mapping (original -> obfuscated)
   */
  classMap: Map<string, string>;

  /**
   * Reverse mapping (obfuscated -> original) for debugging
   */
  reverseMap: Map<string, string>;

  /**
   * All extracted classes with metadata
   */
  classMapping: ClassMapping;

  /**
   * Files that have been processed
   */
  processedFiles: Set<string>;

  /**
   * Whether the context is initialized
   */
  initialized: boolean;

  /**
   * Detected Tailwind version
   */
  detectedTailwindVersion: "3" | "4" | null;

  /**
   * Token positions report (when trackPositions is enabled)
   */
  tokenReport?: TokenReport;

  /**
   * Per-context registry of obfuscated names already handed out. Owned by
   * the context (not module-global) so that concurrent builds — e.g. multiple
   * Vite instances under Turborepo — never collide on the same Set.
   */
  usedNames: Set<string>;

  /**
   * Optional validator backed by the project's `tailwind.config.*`. When set
   * and `enabled`, classes that the validator rejects are skipped during
   * obfuscation. Wired by build plugins; ignored when absent.
   */
  tailwindValidator?: {
    enabled: boolean;
    isValid(className: string): boolean;
  };
}

/**
 * Logger interface for the obfuscator
 */
export interface Logger {
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void;
  success: (message: string, ...args: unknown[]) => void;
}

/**
 * Build mode
 */
export type BuildMode = "development" | "production";
