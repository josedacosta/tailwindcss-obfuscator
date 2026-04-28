/**
 * Cache system for persistent class mappings between builds
 */

import * as fs from "fs";
import * as path from "path";
import type { PluginContext } from "./types.js";

/**
 * Cache file structure
 */
interface CacheFile {
  version: string;
  timestamp: string;
  mapping: Record<string, string>;
  metadata?: {
    tailwindVersion?: string;
    totalClasses?: number;
  };
}

/**
 * Cache store for managing persistent class mappings
 */
export class CacheStore {
  private cacheDir: string;
  private cacheFile: string;
  private strategy: "merge" | "overwrite";

  constructor(cacheDir: string, strategy: "merge" | "overwrite" = "merge") {
    this.cacheDir = cacheDir;
    this.cacheFile = path.join(cacheDir, "class-cache.json");
    this.strategy = strategy;
  }

  /**
   * Ensure cache directory exists
   */
  private ensureDir(): void {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  /**
   * Check if cache exists
   */
  exists(): boolean {
    return fs.existsSync(this.cacheFile);
  }

  /**
   * Read cache from disk
   */
  read(): CacheFile | null {
    if (!this.exists()) {
      return null;
    }

    try {
      const content = fs.readFileSync(this.cacheFile, "utf-8");
      return JSON.parse(content) as CacheFile;
    } catch {
      return null;
    }
  }

  /**
   * Write cache to disk
   */
  write(mapping: Map<string, string>, metadata?: CacheFile["metadata"]): void {
    this.ensureDir();

    const cache: CacheFile = {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      mapping: Object.fromEntries(mapping),
      metadata,
    };

    fs.writeFileSync(this.cacheFile, JSON.stringify(cache, null, 2));
  }

  /**
   * Load cache into context
   */
  loadIntoContext(ctx: PluginContext): boolean {
    const cache = this.read();
    if (!cache) {
      return false;
    }

    if (this.strategy === "overwrite") {
      // Clear existing mappings
      ctx.classMap.clear();
      ctx.reverseMap.clear();
    }

    // Load cached mappings
    for (const [original, obfuscated] of Object.entries(cache.mapping)) {
      if (!ctx.classMap.has(original)) {
        ctx.classMap.set(original, obfuscated);
        ctx.reverseMap.set(obfuscated, original);
      }
    }

    return true;
  }

  /**
   * Save context to cache
   */
  saveFromContext(ctx: PluginContext): void {
    this.write(ctx.classMap, {
      tailwindVersion: ctx.detectedTailwindVersion ?? undefined,
      totalClasses: ctx.classMap.size,
    });
  }

  /**
   * Clear the cache
   */
  clear(): void {
    if (this.exists()) {
      fs.unlinkSync(this.cacheFile);
    }
  }

  /**
   * Get cache file path
   */
  getPath(): string {
    return this.cacheFile;
  }
}

/**
 * Create a cache store from context options
 */
export function createCacheStore(ctx: PluginContext): CacheStore | null {
  if (!ctx.options.cache.enabled) {
    return null;
  }

  return new CacheStore(ctx.options.cache.directory, ctx.options.cache.strategy);
}

/**
 * Initialize cache for context
 */
export function initializeCache(ctx: PluginContext, basePath: string): CacheStore | null {
  if (!ctx.options.cache.enabled) {
    return null;
  }

  const cacheDir = path.resolve(basePath, ctx.options.cache.directory);
  const store = new CacheStore(cacheDir, ctx.options.cache.strategy);

  // Load existing cache if available
  if (store.exists()) {
    store.loadIntoContext(ctx);
  }

  return store;
}

/**
 * Save context to cache
 */
export function saveCache(ctx: PluginContext, basePath: string): void {
  if (!ctx.options.cache.enabled) {
    return;
  }

  const cacheDir = path.resolve(basePath, ctx.options.cache.directory);
  const store = new CacheStore(cacheDir, ctx.options.cache.strategy);
  store.saveFromContext(ctx);
}
