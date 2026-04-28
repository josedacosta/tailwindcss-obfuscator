/**
 * Nuxt.js module for TailwindCSS obfuscation
 * Supports Nuxt 3 with defineNuxtModule pattern
 */

import type { ObfuscatorOptions, PluginContext } from "../core/types.js";
import {
  createContext,
  addClasses,
  updateMappingMetadata,
  saveMapping,
  initializeContext,
  setSharedContext,
} from "../core/context.js";
import { saveCache, initializeCache } from "../core/cache.js";
import { loadConfig } from "../core/config.js";
import { transformContent } from "../transformers/index.js";
import { createLogger } from "../utils/logger.js";
import { extractFromJsx, detectTailwindVersion } from "../extractors/index.js";

/**
 * Nuxt module options
 */
export interface NuxtModuleOptions extends ObfuscatorOptions {
  /**
   * Enable the module
   * @default true in production, false in development
   */
  enabled?: boolean;
}

/**
 * Nuxt 3 module definition using proper module pattern
 */
function nuxtModule(moduleOptions: NuxtModuleOptions, nuxt: any) {
  // Determine if we should enable the module
  const isProduction = process.env.NODE_ENV === "production";
  const enabled = moduleOptions.enabled ?? isProduction;

  if (!enabled) {
    return;
  }

  const logger = createLogger(moduleOptions.verbose ?? false, moduleOptions.debug ?? false);

  logger.info("TailwindCSS Obfuscator: Initializing Nuxt module...");

  // Get project root
  const projectRoot = nuxt.options?.rootDir || process.cwd();

  // Setup function to run async operations
  const setup = async () => {
    // Load configuration from file if available
    const configResult = await loadConfig(projectRoot);

    // Merge configurations: module options take precedence
    const mergedOptions: ObfuscatorOptions = {
      ...configResult?.config,
      ...moduleOptions,
    };

    // Create context
    const mode = isProduction ? "production" : "development";
    const ctx = createContext(mergedOptions, mode);

    // Initialize context
    initializeContext(ctx, projectRoot, logger);

    // Initialize cache
    initializeCache(ctx, projectRoot);

    // Set as shared context
    setSharedContext(ctx);

    // Hook into Nuxt's build process
    nuxt.hook("build:before", () => {
      logger.info("TailwindCSS Obfuscator: Build started");
    });

    // Hook into Vite configuration
    nuxt.hook("vite:extend", ({ config }: { config: any }) => {
      // Add our plugin to Vite's plugin array
      if (!config.plugins) {
        config.plugins = [];
      }

      config.plugins.push(createNuxtVitePlugin(ctx, projectRoot, logger));
    });

    // Hook into Webpack configuration
    nuxt.hook("webpack:config", (webpackConfigs: any[]) => {
      for (const webpackConfig of webpackConfigs) {
        if (!webpackConfig.plugins) {
          webpackConfig.plugins = [];
        }

        webpackConfig.plugins.push(createNuxtWebpackPlugin(ctx, projectRoot, logger));
      }
    });

    // Hook into build completion
    nuxt.hook("build:done", () => {
      // Update metadata
      updateMappingMetadata(ctx, ctx.detectedTailwindVersion ?? "unknown");

      // Save mapping
      saveMapping(ctx, projectRoot);

      // Save cache
      saveCache(ctx, projectRoot);

      logger.success(`TailwindCSS Obfuscator: Obfuscated ${ctx.classMap.size} classes`);
    });

    // Hook into close
    nuxt.hook("close", () => {
      // Final save
      saveMapping(ctx, projectRoot);
      saveCache(ctx, projectRoot);
    });
  };

  // Run setup
  setup().catch((err) => {
    logger.error(`TailwindCSS Obfuscator setup failed: ${err.message}`);
  });
}

/**
 * Create Vite plugin for Nuxt
 */
function createNuxtVitePlugin(
  ctx: PluginContext,
  projectRoot: string,
  logger: ReturnType<typeof createLogger>
) {
  return {
    name: "tailwindcss-obfuscator:nuxt",
    enforce: "post" as const,

    transform(code: string, id: string) {
      // Skip node_modules
      if (id.includes("node_modules")) {
        return null;
      }

      // Extract classes from source files
      if (/\.(vue|tsx?|jsx?)$/.test(id)) {
        const classes = extractFromJsx(code, id);
        addClasses(ctx, classes, id);
      }

      // Detect Tailwind version from CSS
      if (id.endsWith(".css")) {
        const version = detectTailwindVersion(code);
        if (version) {
          ctx.detectedTailwindVersion = version;
        }
      }

      // Transform the content
      const result = transformContent(code, id, ctx);

      if (result.replacements > 0) {
        logger.debug(`Transformed ${result.replacements} classes in ${id}`);
        return {
          code: result.transformed,
          map: result.map ? JSON.parse(result.map) : null,
        };
      }

      return null;
    },
  };
}

/**
 * Create Webpack plugin for Nuxt
 */
function createNuxtWebpackPlugin(
  ctx: PluginContext,
  projectRoot: string,
  logger: ReturnType<typeof createLogger>
) {
  return {
    apply(compiler: any) {
      const pluginName = "TailwindCssObfuscatorNuxtPlugin";

      compiler.hooks.compilation.tap(pluginName, (compilation: any) => {
        // Hook into the normal module loader
        compilation.hooks.succeedModule.tap(pluginName, (module: any) => {
          if (!module.resource) return;

          const id = module.resource;

          // Skip node_modules
          if (id.includes("node_modules")) {
            return;
          }

          // Extract classes from source files
          if (/\.(vue|tsx?|jsx?)$/.test(id)) {
            try {
              const source = module._source?.source() || "";
              const classes = extractFromJsx(source, id);
              addClasses(ctx, classes, id);
            } catch {
              // Ignore extraction errors
            }
          }
        });
      });

      // Transform assets at the end
      compiler.hooks.emit.tapAsync(pluginName, (compilation: any, callback: () => void) => {
        for (const filename of Object.keys(compilation.assets)) {
          if (!/\.(js|css|html)$/.test(filename)) {
            continue;
          }

          const asset = compilation.assets[filename];
          const source = asset.source();

          const result = transformContent(source, filename, ctx);

          if (result.replacements > 0) {
            logger.debug(`Transformed ${result.replacements} classes in ${filename}`);

            compilation.assets[filename] = {
              source: () => result.transformed,
              size: () => result.transformed.length,
            };
          }
        }

        callback();
      });
    },
  };
}

/**
 * Module meta for Nuxt
 */
nuxtModule.meta = {
  name: "tailwindcss-obfuscator",
  configKey: "tailwindcssObfuscator",
  compatibility: {
    nuxt: "^2.0.0 || ^3.0.0",
  },
};

// Named export for direct import
export { nuxtModule, nuxtModule as tailwindcssObfuscatorNuxt };

// Default export for Nuxt module system
export default nuxtModule;
