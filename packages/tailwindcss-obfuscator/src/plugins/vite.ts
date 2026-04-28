/**
 * Vite plugin entry. The actual logic lives in `core.ts` so it is shared
 * with the Webpack/Rollup/esbuild adapters.
 */

import type { Plugin } from "vite";
import type { ObfuscatorOptions } from "../core/types.js";
import { obfuscatorUnplugin } from "./core.js";

/**
 * Vite plugin that obfuscates Tailwind CSS class names during the build.
 */
export function tailwindCssObfuscatorVite(options: ObfuscatorOptions = {}): Plugin {
  return obfuscatorUnplugin.vite(options) as Plugin;
}

export default tailwindCssObfuscatorVite;
