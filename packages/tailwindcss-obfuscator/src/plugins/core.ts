/**
 * Shared `unplugin` factory.
 *
 * Replaces the five separate plugin implementations (Vite/Webpack/Rollup/
 * esbuild/Nuxt) with one factory that owns the lifecycle: create context →
 * extract on `buildStart` → transform per module → save on `buildEnd`.
 *
 * Each per-bundler entry point in `src/plugins/{vite,webpack,rollup,esbuild}.ts`
 * is now a one-line wrapper around `obfuscatorUnplugin.<bundler>`. The Nuxt
 * module remains a separate file because Nuxt has its own module convention.
 */

import * as path from "path";
import { createUnplugin } from "unplugin";
import type { UnpluginFactory } from "unplugin";
import type { ObfuscatorOptions, PluginContext, Logger } from "../core/types.js";
import {
  createContext,
  initializeContext,
  saveMapping,
  updateMappingMetadata,
  setSharedContext,
} from "../core/context.js";
import { createLogger } from "../utils/logger.js";
import { extractClasses, extractFromCssFiles } from "../extractors/index.js";
import { transformContent } from "../transformers/index.js";
import { TransformError } from "../core/errors.js";

/**
 * File extensions whose content should be considered for transformation.
 */
const RELEVANT_EXTENSIONS = new Set<string>([
  ".css",
  ".js",
  ".mjs",
  ".cjs",
  ".jsx",
  ".ts",
  ".tsx",
  ".vue",
  ".svelte",
  ".astro",
  ".html",
]);

/**
 * Internal state machine shared by all `unplugin` adapter instances.
 *
 * `unplugin` instantiates the same hook callbacks for each bundler, so we
 * keep the state in a closure that all hooks share.
 */
function createState(options: ObfuscatorOptions) {
  let ctx: PluginContext | null = null;
  let logger: Logger;
  let basePath = process.cwd();
  let initialized = false;
  let activated = false;
  // Set by bundler hooks that have explicit knowledge of the run mode (so far,
  // only Vite's `configResolved`). When `true`, generic hooks like `buildStart`
  // refuse to activate so a Vite dev server can run untouched (the obfuscator
  // is opt-in for dev via `refresh: true`).
  let disabledByHost = false;

  const ensureLogger = () => {
    if (!logger) {
      logger = createLogger(options.verbose, options.debug);
    }
    return logger;
  };

  const activate = (mode: "production" | "development") => {
    if (activated || disabledByHost) return;
    activated = true;
    ctx = createContext(options, mode);
    setSharedContext(ctx);
    ensureLogger();
  };

  const disable = () => {
    disabledByHost = true;
  };

  const enable = () => {
    disabledByHost = false;
  };

  const initialize = async () => {
    if (!ctx || initialized) return;
    ensureLogger().info("Initializing Tailwind CSS obfuscator...");
    initializeContext(ctx, basePath, logger);
    await extractClasses(ctx, basePath, logger);
    await extractFromCssFiles(ctx, basePath, logger);
    updateMappingMetadata(ctx, ctx.detectedTailwindVersion || "unknown");
    logger.info(`Found ${ctx.classMap.size} classes to obfuscate`);
    initialized = true;
  };

  const transformIfRelevant = (code: string, id: string) => {
    if (!ctx || ctx.classMap.size === 0) return null;
    if (id.includes("node_modules") || id.startsWith("\0")) return null;

    // Strip Vite virtual-module query strings (e.g. `app.vue?vue&type=template`)
    // before resolving the extension — otherwise `path.extname` returns the
    // query-suffixed string and the module is wrongly excluded.
    const cleanId = id.split("?")[0];
    const ext = path.extname(cleanId).toLowerCase();
    if (!RELEVANT_EXTENSIONS.has(ext)) return null;

    try {
      const result = transformContent(code, id, ctx);
      if (result.replacements <= 0) return null;
      ensureLogger().debug(`  ${path.relative(basePath, id)}: ${result.replacements} replacements`);
      return {
        code: result.transformed,
        map: result.map ? JSON.parse(result.map) : null,
      };
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause);
      ensureLogger().warn(`Error transforming ${id}: ${message}`);
      // Surface a typed error to host build systems if they propagate it.
      // We don't throw — a single bad file shouldn't fail the whole build.
      void new TransformError(message, { filePath: id, cause });
      return null;
    }
  };

  const finalize = () => {
    if (!ctx) return;
    saveMapping(ctx, basePath);
    ensureLogger().success(`Obfuscation complete! Mapping saved to ${ctx.options.mappingPath}`);
  };

  return {
    get ctx() {
      return ctx;
    },
    get logger() {
      return ensureLogger();
    },
    setBasePath(p: string) {
      basePath = p;
    },
    activate,
    disable,
    enable,
    initialize,
    transformIfRelevant,
    finalize,
    options,
  };
}

/**
 * The single `unplugin` factory used to derive Vite/Webpack/Rollup/esbuild
 * plugins. Per-bundler hooks (`vite`, `webpack`, ...) layer in bundler-specific
 * setup like reading `configResolved` to learn the project root.
 */
const factory: UnpluginFactory<ObfuscatorOptions | undefined> = (rawOptions = {}) => {
  const state = createState(rawOptions);

  return {
    name: "tailwindcss-obfuscator",
    enforce: "post",

    buildStart() {
      // Bundlers without a `configResolved`-style hook (Rollup, esbuild) reach
      // here without `state.activate` having been called yet.
      state.activate("production");
      return state.initialize();
    },

    transformInclude(id: string) {
      if (id.includes("node_modules") || id.startsWith("\0")) return false;
      // html-webpack-plugin runs HTML templates through a child compilation
      // whose loader emits raw HTML; webpack then re-parses it as JS and
      // crashes with "Unexpected token". Detect that loader chain and skip.
      if (id.includes("html-webpack-plugin/lib/loader")) return false;
      const ext = path.extname(id.split("?")[0]).toLowerCase();
      return RELEVANT_EXTENSIONS.has(ext);
    },

    transform(code: string, id: string) {
      return state.transformIfRelevant(code, id);
    },

    buildEnd() {
      state.finalize();
    },

    vite: {
      configResolved(config) {
        const isProduction = config.command === "build";
        state.setBasePath(config.root || process.cwd());
        if (!isProduction && !rawOptions.refresh) {
          // Vite dev server: leave classes untouched so Tailwind's CSS
          // selectors keep matching the className values in source. Mark
          // the state as host-disabled so `buildStart` (called by Vite even
          // in dev) does not turn the obfuscator back on.
          state.disable();
          return;
        }
        // Some hosts call `configResolved` more than once during a single
        // build (Astro 6 calls it once with `command: serve` to bootstrap
        // the module graph, then several times with `command: build` for the
        // SSR / client / collections phases). Make sure a later "build" call
        // overrides an earlier "serve"-driven `disable()`.
        state.enable();
        state.activate(isProduction ? "production" : "development");
      },
      transformIndexHtml(html: string) {
        const ctx = state.ctx;
        if (!ctx || ctx.classMap.size === 0) return html;
        try {
          const result = transformContent(html, "index.html", ctx);
          return result.replacements > 0 ? result.transformed : html;
        } catch {
          return html;
        }
      },
      generateBundle(_opts: unknown, bundle: Record<string, unknown>) {
        const ctx = state.ctx;
        if (!ctx || ctx.classMap.size === 0) return;

        for (const [fileName, chunk] of Object.entries(bundle)) {
          const c = chunk as {
            type?: string;
            code?: string;
            source?: string | Uint8Array;
          };
          if (c.type !== "asset" && c.type !== "chunk") continue;

          const ext = path.extname(fileName).toLowerCase();
          if (![".css", ".js", ".mjs", ".html"].includes(ext)) continue;

          let code: string | undefined;
          if (c.type === "chunk") {
            code = c.code;
          } else if (typeof c.source === "string") {
            code = c.source;
          } else if (c.source instanceof Uint8Array) {
            code = Buffer.from(c.source).toString("utf-8");
          }
          if (code === undefined) continue;

          try {
            const result = transformContent(code, fileName, ctx);
            if (result.replacements <= 0) continue;
            if (c.type === "chunk") {
              c.code = result.transformed;
            } else {
              (c as { source: string }).source = result.transformed;
            }
          } catch (cause) {
            const message = cause instanceof Error ? cause.message : String(cause);
            state.logger.warn(`Error processing bundle ${fileName}: ${message}`);
          }
        }
      },
    },

    webpack(compiler) {
      const isProduction = compiler.options.mode === "production";
      state.setBasePath(compiler.context || process.cwd());
      if (!isProduction && !rawOptions.refresh) {
        // Webpack dev: same reasoning as Vite — leave the source alone so the
        // generated CSS keeps matching `className` values, and ensure the
        // generic `buildStart` hook does not silently re-enable the plugin.
        state.disable();
        return;
      }
      state.enable();
      state.activate(isProduction ? "production" : "development");

      // Re-transform final assets (post-Tailwind compilation) inside webpack's
      // processAssets hook. The unplugin universal `transform` hook only sees
      // pre-bundle modules — generated CSS/JS bundles need a second pass.
      compiler.hooks.compilation.tap("tailwindcss-obfuscator", (compilation) => {
        compilation.hooks.processAssets.tapPromise(
          {
            name: "tailwindcss-obfuscator",
            stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
          },
          async (assets) => {
            const ctx = state.ctx;
            if (!ctx || ctx.classMap.size === 0) return;

            for (const [assetName, asset] of Object.entries(assets)) {
              const ext = path.extname(assetName).toLowerCase();
              if (![".css", ".js", ".mjs", ".html"].includes(ext)) continue;

              try {
                const content = asset.source().toString();
                const result = transformContent(content, assetName, ctx);
                if (result.replacements <= 0) continue;
                compilation.updateAsset(
                  assetName,
                  new compiler.webpack.sources.RawSource(result.transformed)
                );
              } catch (cause) {
                const message = cause instanceof Error ? cause.message : String(cause);
                state.logger.warn(`Error processing ${assetName}: ${message}`);
              }
            }
          }
        );
      });
    },

    rollup: {
      // Re-transform Rollup's emitted bundle. For CSS specifically, postcss
      // extract plugins (rollup-plugin-postcss) write a separate `.css` asset
      // that the unplugin universal `transform` hook never sees, so we have to
      // catch it here. We also handle assets emitted as Buffer (Uint8Array).
      generateBundle(_opts: unknown, bundle: Record<string, unknown>) {
        const ctx = state.ctx;
        if (!ctx || ctx.classMap.size === 0) return;

        for (const [fileName, chunk] of Object.entries(bundle)) {
          const c = chunk as {
            type?: string;
            code?: string;
            source?: string | Uint8Array;
          };
          if (c.type !== "asset" && c.type !== "chunk") continue;

          const ext = path.extname(fileName).toLowerCase();
          if (![".css", ".js", ".mjs", ".html"].includes(ext)) continue;

          let code: string | undefined;
          if (c.type === "chunk") {
            code = c.code;
          } else if (typeof c.source === "string") {
            code = c.source;
          } else if (c.source instanceof Uint8Array) {
            code = Buffer.from(c.source).toString("utf-8");
          }
          if (code === undefined) continue;

          try {
            const result = transformContent(code, fileName, ctx);
            if (result.replacements <= 0) continue;
            if (c.type === "chunk") {
              c.code = result.transformed;
            } else {
              (c as { source: string }).source = result.transformed;
            }
          } catch {
            // Already logged in the universal transform hook path.
          }
        }
      },
    },

    esbuild: {
      // esbuild hooks already covered by the universal handlers above.
    },
  };
};

/**
 * The compiled `unplugin` instance. Use `obfuscatorUnplugin.vite()`,
 * `.webpack()`, `.rollup()`, `.esbuild()` to obtain a bundler-specific plugin.
 */
export const obfuscatorUnplugin = /* @__PURE__ */ createUnplugin(factory);
