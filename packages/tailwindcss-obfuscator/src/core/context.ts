/**
 * Obfuscation context management.
 *
 * The context owns all mutable state for an obfuscation run: option resolution,
 * the class mapping, the registry of used obfuscated names, and persistence
 * helpers. State that used to live at module scope (notably the
 * `usedNames` set) now belongs to the context, so concurrent builds — e.g.
 * multiple Vite/Turborepo workers — never share or clobber each other.
 */

import * as fs from "fs";
import * as path from "path";
import type {
  ObfuscatorOptions,
  ResolvedObfuscatorOptions,
  ClassMapping,
  ClassMappingEntry,
  PluginContext,
  Logger,
  BuildMode,
} from "./types.js";
import { MappingPersistenceError } from "./errors.js";

/**
 * Lowercase letters used to seed the first character of every generated name
 * (CSS class names cannot start with a digit).
 */
const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

/**
 * Lowercase letters + digits used for the remaining characters.
 */
const EXTENDED_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

/**
 * Cryptographically secure random number in [0, 1). Falls back to
 * `Math.random` only when no Web Crypto API is available (very old runtimes).
 */
function secureRandom(): number {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] / (0xffffffff + 1);
  }
  return Math.random();
}

/**
 * Generate a random alphanumeric string. The first character is always a
 * letter so the result is a valid CSS class identifier on its own.
 */
function generateRandomString(length: number): string {
  let result = ALPHABET[Math.floor(secureRandom() * ALPHABET.length)];

  for (let i = 1; i < length; i++) {
    result += EXTENDED_ALPHABET[Math.floor(secureRandom() * EXTENDED_ALPHABET.length)];
  }

  return result;
}

/**
 * Generate a unique random class name, recording it in the supplied set so
 * future calls cannot collide with it. After many failed attempts (>1000) we
 * fall back to a timestamp-based name to guarantee progress.
 */
function generateUniqueRandomName(used: Set<string>, prefix: string, minLength: number): string {
  let attempts = 0;
  const maxAttempts = 1000;

  while (attempts < maxAttempts) {
    const length = minLength + Math.floor(attempts / 100);
    const name = prefix + generateRandomString(length);

    if (!used.has(name)) {
      used.add(name);
      return name;
    }
    attempts++;
  }

  const fallback = prefix + Date.now().toString(36) + generateRandomString(4);
  used.add(fallback);
  return fallback;
}

/**
 * Sequential generator that emits "tw-a", "tw-b", ..., "tw-aa", ..., reading
 * the supplied set to skip any names already taken.
 */
function defaultClassGenerator(index: number, prefix: string): string {
  let name = "";
  let num = index;

  do {
    name = ALPHABET[num % ALPHABET.length] + name;
    num = Math.floor(num / ALPHABET.length) - 1;
  } while (num >= 0);

  return prefix + name;
}

/**
 * Module-level fallback set used only by the legacy `clearUsedNames` export.
 * Exists for backward compatibility — every active context now owns its own
 * `usedNames` set on `PluginContext`.
 *
 * @deprecated `usedNames` lives on the context now; see `createContext`.
 */
const legacyUsedNames = new Set<string>();

/**
 * Clear the legacy module-level used-names set.
 *
 * @deprecated Each `PluginContext` now owns its own `usedNames` set; clear it
 * directly with `ctx.usedNames.clear()` if you need a fresh randomization.
 */
export function clearUsedNames(): void {
  legacyUsedNames.clear();
}

/**
 * Default options for the obfuscator. The class generator is replaced by
 * `createContext` with one bound to the context's own `usedNames` set.
 */
const DEFAULT_OPTIONS: ResolvedObfuscatorOptions = {
  prefix: "tw-",
  content: ["**/*.html", "**/*.jsx", "**/*.tsx", "**/*.vue", "**/*.svelte", "**/*.astro"],
  css: ["**/*.css"],
  exclude: [],
  include: [],
  outputDir: ".tw-obfuscation",
  verbose: false,
  tailwindVersion: "auto",
  sourcemap: true,
  classGenerator: (_index: number, _originalClass: string) => {
    throw new Error(
      "classGenerator placeholder invoked. Did you bypass createContext()? " +
        "Bind a generator via createContext or supply options.classGenerator."
    );
  },
  randomize: true,
  randomLength: 4,
  refresh: true,
  mappingPath: ".tw-obfuscation/class-mapping.json",
  debug: false,
  preserve: {
    functions: [],
    classes: [],
  },
  sources: {
    include: [],
    exclude: [],
  },
  filter: null,
  ignoreVueScoped: true,
  useAst: true,
  usePostcss: true,
  mapping: {
    enabled: true,
    file: ".tw-obfuscation/class-mapping.json",
    pretty: true,
    format: "json",
  },
  cache: {
    enabled: true,
    directory: ".tw-obfuscation/cache",
    strategy: "merge",
  },
  trackPositions: false,
  scanObjectStrings: false,
};

/**
 * Resolve user options, applying defaults. The returned `classGenerator` is
 * a placeholder; `createContext` rebinds it to a real generator that owns a
 * per-context `usedNames` set.
 */
export function resolveOptions(options: ObfuscatorOptions = {}): ResolvedObfuscatorOptions {
  const prefix = options.prefix ?? DEFAULT_OPTIONS.prefix;
  const randomize = options.randomize ?? DEFAULT_OPTIONS.randomize;
  const randomLength = options.randomLength ?? DEFAULT_OPTIONS.randomLength;

  return {
    prefix,
    content: options.content ?? DEFAULT_OPTIONS.content,
    css: options.css ?? DEFAULT_OPTIONS.css,
    exclude: options.exclude ?? DEFAULT_OPTIONS.exclude,
    include: options.include ?? DEFAULT_OPTIONS.include,
    outputDir: options.outputDir ?? DEFAULT_OPTIONS.outputDir,
    verbose: options.verbose ?? DEFAULT_OPTIONS.verbose,
    tailwindVersion: options.tailwindVersion ?? DEFAULT_OPTIONS.tailwindVersion,
    sourcemap: options.sourcemap ?? DEFAULT_OPTIONS.sourcemap,
    // Placeholder; createContext rebinds this with a generator that captures
    // the context's per-build usedNames set.
    classGenerator:
      options.classGenerator ?? ((index: number) => defaultClassGenerator(index, prefix)),
    randomize,
    randomLength,
    refresh: options.refresh ?? DEFAULT_OPTIONS.refresh,
    mappingPath: options.mappingPath ?? DEFAULT_OPTIONS.mappingPath,
    debug: options.debug ?? DEFAULT_OPTIONS.debug,
    preserve: {
      functions: options.preserve?.functions ?? DEFAULT_OPTIONS.preserve.functions,
      classes: options.preserve?.classes ?? DEFAULT_OPTIONS.preserve.classes,
    },
    sources: {
      include: options.sources?.include ?? DEFAULT_OPTIONS.sources.include,
      exclude: options.sources?.exclude ?? DEFAULT_OPTIONS.sources.exclude,
    },
    filter: options.filter ?? DEFAULT_OPTIONS.filter,
    ignoreVueScoped: options.ignoreVueScoped ?? DEFAULT_OPTIONS.ignoreVueScoped,
    useAst: options.useAst ?? DEFAULT_OPTIONS.useAst,
    usePostcss: options.usePostcss ?? DEFAULT_OPTIONS.usePostcss,
    mapping: {
      enabled: options.mapping?.enabled ?? DEFAULT_OPTIONS.mapping.enabled,
      file: options.mapping?.file ?? DEFAULT_OPTIONS.mapping.file,
      pretty: options.mapping?.pretty ?? DEFAULT_OPTIONS.mapping.pretty,
      format: options.mapping?.format ?? DEFAULT_OPTIONS.mapping.format,
    },
    cache: {
      enabled: options.cache?.enabled ?? DEFAULT_OPTIONS.cache.enabled,
      directory: options.cache?.directory ?? DEFAULT_OPTIONS.cache.directory,
      strategy: options.cache?.strategy ?? DEFAULT_OPTIONS.cache.strategy,
    },
    trackPositions: options.trackPositions ?? DEFAULT_OPTIONS.trackPositions,
    scanObjectStrings: options.scanObjectStrings ?? DEFAULT_OPTIONS.scanObjectStrings,
  };
}

/**
 * Create an empty class mapping with the current timestamp.
 */
function createEmptyMapping(): ClassMapping {
  return {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    tailwindVersion: "unknown",
    totalClasses: 0,
    obfuscatedClasses: 0,
    classes: {},
  };
}

/**
 * Create the obfuscation context. Owns the `usedNames` set used to avoid
 * collisions during obfuscated-name generation, so two contexts running in
 * parallel cannot interfere with each other.
 */
export function createContext(
  options: ObfuscatorOptions = {},
  mode: BuildMode = "production"
): PluginContext {
  const resolvedOptions = resolveOptions(options);

  if (options.refresh === undefined) {
    resolvedOptions.refresh = mode === "development";
  }

  const usedNames = new Set<string>();
  const prefix = resolvedOptions.prefix;
  const randomize = resolvedOptions.randomize;
  const randomLength = resolvedOptions.randomLength;

  // If the user did not supply their own generator, bind one that captures
  // *this* context's usedNames set (rather than a module global).
  if (!options.classGenerator) {
    if (randomize) {
      resolvedOptions.classGenerator = () =>
        generateUniqueRandomName(usedNames, prefix, randomLength);
    } else {
      resolvedOptions.classGenerator = (index: number) => {
        const name = defaultClassGenerator(index, prefix);
        usedNames.add(name);
        return name;
      };
    }
  }

  return {
    options: resolvedOptions,
    classMap: new Map(),
    reverseMap: new Map(),
    classMapping: createEmptyMapping(),
    processedFiles: new Set(),
    initialized: false,
    detectedTailwindVersion: null,
    usedNames,
  };
}

/**
 * Decide whether a class should be obfuscated based on context configuration.
 *
 * Filters in order: blank/short/CSS-variable, JS-style hooks (`js-`, `is-`,
 * `data-`, ...), the `preserve.classes` list, the user `filter` callback,
 * `exclude` patterns, and finally `include` patterns (whitelist mode).
 */
export function shouldObfuscateClass(
  className: string,
  options: ResolvedObfuscatorOptions
): boolean {
  if (!className.trim()) return false;
  if (className.startsWith("--")) return false;
  if (className.length <= 2) return false;
  if (/^(js-|no-|is-|has-|data-)/.test(className)) return false;

  if (options.preserve.classes.includes(className)) {
    return false;
  }

  if (options.filter !== null) {
    if (!options.filter(className)) {
      return false;
    }
  }

  for (const pattern of options.exclude) {
    if (typeof pattern === "string") {
      if (className === pattern) return false;
    } else if (pattern instanceof RegExp) {
      if (pattern.test(className)) return false;
    }
  }

  if (options.include.length > 0) {
    let included = false;
    for (const pattern of options.include) {
      if (typeof pattern === "string") {
        if (className === pattern) {
          included = true;
          break;
        }
      } else if (pattern instanceof RegExp) {
        if (pattern.test(className)) {
          included = true;
          break;
        }
      }
    }
    if (!included) return false;
  }

  return true;
}

/**
 * Add a single class to the context's mapping. Increments the occurrence
 * counter when the class is already known.
 */
export function addClass(ctx: PluginContext, className: string, filePath: string): void {
  if (!shouldObfuscateClass(className, ctx.options)) {
    return;
  }

  if (ctx.tailwindValidator?.enabled && !ctx.tailwindValidator.isValid(className)) {
    return;
  }

  const existingEntry = ctx.classMapping.classes[className];

  if (existingEntry) {
    existingEntry.occurrences++;
    if (!existingEntry.usedIn.includes(filePath)) {
      existingEntry.usedIn.push(filePath);
    }
  } else {
    const index = Object.keys(ctx.classMapping.classes).length;
    const obfuscated = ctx.options.classGenerator(index, className);

    const entry: ClassMappingEntry = {
      original: className,
      obfuscated,
      usedIn: [filePath],
      occurrences: 1,
    };

    ctx.classMapping.classes[className] = entry;
    ctx.classMap.set(className, obfuscated);
    ctx.reverseMap.set(obfuscated, className);
  }
}

/**
 * Add many classes to the context.
 */
export function addClasses(ctx: PluginContext, classes: string[], filePath: string): void {
  for (const className of classes) {
    addClass(ctx, className, filePath);
  }
}

/**
 * Refresh the metadata block on the class mapping (timestamp + counts).
 */
export function updateMappingMetadata(ctx: PluginContext, tailwindVersion: string): void {
  ctx.classMapping.generatedAt = new Date().toISOString();
  ctx.classMapping.tailwindVersion = tailwindVersion;
  ctx.classMapping.totalClasses = Object.keys(ctx.classMapping.classes).length;
  ctx.classMapping.obfuscatedClasses = ctx.classMap.size;
}

/**
 * Persist the class mapping to disk in the configured format (`json` or
 * `text`). Throws {@link MappingPersistenceError} on I/O failure so callers
 * can react instead of silently losing the mapping.
 */
export function saveMapping(ctx: PluginContext, basePath: string): void {
  const mappingOptions = ctx.options.mapping;
  if (!mappingOptions.enabled) {
    return;
  }

  const mappingPath = path.resolve(basePath, mappingOptions.file);
  const dir = path.dirname(mappingPath);

  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (mappingOptions.format === "text") {
      const lines: string[] = [];
      for (const [original, entry] of Object.entries(ctx.classMapping.classes)) {
        lines.push(`${original} -> ${entry.obfuscated}`);
      }
      fs.writeFileSync(mappingPath.replace(/\.json$/, ".txt"), lines.join("\n"));
    } else {
      const indent =
        mappingOptions.pretty === true
          ? 2
          : typeof mappingOptions.pretty === "number"
            ? mappingOptions.pretty
            : 0;

      fs.writeFileSync(mappingPath, JSON.stringify(ctx.classMapping, null, indent));
    }
  } catch (cause) {
    throw new MappingPersistenceError(`Failed to write mapping file at ${mappingPath}`, {
      mappingPath,
      cause,
    });
  }
}

/**
 * Export a flat `original -> obfuscated` JSON mapping (no metadata) for
 * external tooling that just needs the rename table.
 */
export function exportSimpleMapping(
  ctx: PluginContext,
  basePath: string,
  filename: string = "class-map.json"
): void {
  const outputPath = path.resolve(basePath, ctx.options.outputDir, filename);
  const dir = path.dirname(outputPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const simpleMapping: Record<string, string> = {};
  for (const [original, obfuscated] of ctx.classMap.entries()) {
    simpleMapping[original] = obfuscated;
  }

  fs.writeFileSync(outputPath, JSON.stringify(simpleMapping, null, 2));
}

/**
 * Load an existing class mapping from disk. Returns `false` when the file is
 * absent or unparseable; throws {@link MappingPersistenceError} on read I/O
 * errors that are not "file not found".
 */
export function loadMapping(ctx: PluginContext, basePath: string): boolean {
  const mappingPath = path.resolve(basePath, ctx.options.mappingPath);

  if (!fs.existsSync(mappingPath)) {
    return false;
  }

  let content: string;
  try {
    content = fs.readFileSync(mappingPath, "utf-8");
  } catch (cause) {
    throw new MappingPersistenceError(`Failed to read mapping file at ${mappingPath}`, {
      mappingPath,
      cause,
    });
  }

  let mapping: ClassMapping;
  try {
    mapping = JSON.parse(content);
  } catch {
    return false;
  }

  ctx.classMapping = mapping;
  ctx.classMap.clear();
  ctx.reverseMap.clear();
  ctx.usedNames.clear();

  for (const [className, entry] of Object.entries(mapping.classes)) {
    ctx.classMap.set(className, entry.obfuscated);
    ctx.reverseMap.set(entry.obfuscated, className);
    ctx.usedNames.add(entry.obfuscated);
  }

  return true;
}

/**
 * Initialize the context: ensure the output directory exists and load an
 * existing mapping when refresh mode is off.
 */
export function initializeContext(ctx: PluginContext, basePath: string, logger: Logger): void {
  if (ctx.initialized) {
    return;
  }

  const outputDir = path.resolve(basePath, ctx.options.outputDir);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (!ctx.options.refresh) {
    const loaded = loadMapping(ctx, basePath);
    if (loaded) {
      logger.info(`Loaded existing class mapping with ${ctx.classMap.size} classes`);
    }
  }

  ctx.initialized = true;
}

export function getObfuscatedClass(ctx: PluginContext, originalClass: string): string | undefined {
  return ctx.classMap.get(originalClass);
}

export function getOriginalClass(ctx: PluginContext, obfuscatedClass: string): string | undefined {
  return ctx.reverseMap.get(obfuscatedClass);
}

/**
 * Module-scoped pointer used by build plugins to share a single context
 * across hook callbacks (e.g. when a CSS-in-JS loader needs to access the
 * context outside of the main Vite/Webpack hook chain).
 */
let sharedContext: PluginContext | null = null;

export function getSharedContext(): PluginContext | null {
  return sharedContext;
}

export function setSharedContext(ctx: PluginContext): void {
  sharedContext = ctx;
}

export function clearSharedContext(): void {
  sharedContext = null;
}
