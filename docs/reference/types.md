# Type Definitions

## ObfuscatorOptions

Main configuration options for the obfuscator.

```ts
interface ObfuscatorOptions {
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
   */
  classGenerator?: (index: number, originalClass: string) => string;

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
   */
  filter?: (className: string) => boolean;

  /**
   * Mapping file output options
   */
  mapping?: MappingOutputOptions;

  /**
   * Cache options for persistent mappings
   */
  cache?: CacheOptions;
}
```

## PreserveOptions

Options to preserve certain classes or functions from obfuscation.

```ts
interface PreserveOptions {
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
```

## MappingOutputOptions

Options for the class mapping output file.

```ts
interface MappingOutputOptions {
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
```

## CacheOptions

Options for persistent class mappings.

```ts
interface CacheOptions {
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
```

## ClassMapping

The structure of the generated class mapping file.

```ts
interface ClassMapping {
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

interface ClassMappingEntry {
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
```
