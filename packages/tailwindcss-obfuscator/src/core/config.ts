/**
 * Configuration file loading support
 */

import * as fs from "fs";
import * as path from "path";
import { pathToFileURL } from "url";
import type { ObfuscatorOptions } from "./types.js";

/**
 * Supported configuration file names
 */
const CONFIG_FILES = [
  "tailwindcss-obfuscator.config.ts",
  "tailwindcss-obfuscator.config.mts",
  "tailwindcss-obfuscator.config.js",
  "tailwindcss-obfuscator.config.mjs",
  "tailwindcss-obfuscator.config.cjs",
  "tw-obfuscator.config.ts",
  "tw-obfuscator.config.js",
];

/**
 * Result of config file search
 */
export interface ConfigFileResult {
  path: string;
  config: ObfuscatorOptions;
}

/**
 * Find configuration file in project directory
 */
export function findConfigFile(projectRoot: string): string | null {
  for (const filename of CONFIG_FILES) {
    const configPath = path.join(projectRoot, filename);
    if (fs.existsSync(configPath)) {
      return configPath;
    }
  }
  return null;
}

/**
 * Load configuration from a file
 */
export async function loadConfigFile(configPath: string): Promise<ObfuscatorOptions> {
  const ext = path.extname(configPath);

  // For TypeScript files, we need to use a transpiler or assume they're pre-compiled
  if (ext === ".ts" || ext === ".mts") {
    // Try to use tsx or ts-node to load TypeScript files
    try {
      // Dynamic import with tsx/ts-node registration
      const fileUrl = pathToFileURL(configPath).href;
      const module = await import(fileUrl);
      return normalizeConfigModule(module);
    } catch {
      // Fallback: try to load as JSON if TypeScript fails
      throw new Error(
        `Cannot load TypeScript config file: ${configPath}. ` +
          `Make sure tsx or ts-node is available, or use a .js/.mjs config file.`
      );
    }
  }

  // For JavaScript files
  if (ext === ".js" || ext === ".mjs" || ext === ".cjs") {
    try {
      const fileUrl = pathToFileURL(configPath).href;
      const module = await import(fileUrl);
      return normalizeConfigModule(module);
    } catch (error) {
      throw new Error(`Cannot load config file: ${configPath}. Error: ${error}`);
    }
  }

  // For JSON files
  if (ext === ".json") {
    try {
      const raw = fs.readFileSync(configPath, "utf-8");
      return JSON.parse(raw) as ObfuscatorOptions;
    } catch (error) {
      throw new Error(`Cannot parse JSON config file: ${configPath}. Error: ${error}`);
    }
  }

  throw new Error(`Unsupported config file extension: ${ext}`);
}

/**
 * Normalize the config module export
 */
function normalizeConfigModule(module: unknown): ObfuscatorOptions {
  if (!module || typeof module !== "object") {
    return {};
  }

  const mod = module as Record<string, unknown>;

  // Check for default export
  if ("default" in mod) {
    const defaultExport = mod.default;
    if (typeof defaultExport === "function") {
      // Config factory function
      return defaultExport() as ObfuscatorOptions;
    }
    return (defaultExport as ObfuscatorOptions) ?? {};
  }

  // Direct export
  return mod as ObfuscatorOptions;
}

/**
 * Load configuration from project root
 */
export async function loadConfig(projectRoot: string): Promise<ConfigFileResult | null> {
  const configPath = findConfigFile(projectRoot);

  if (!configPath) {
    return null;
  }

  const config = await loadConfigFile(configPath);

  return {
    path: configPath,
    config,
  };
}

/**
 * Define configuration helper for type safety
 */
export function defineConfig(
  config: ObfuscatorOptions | (() => ObfuscatorOptions)
): ObfuscatorOptions {
  if (typeof config === "function") {
    return config();
  }
  return config;
}
