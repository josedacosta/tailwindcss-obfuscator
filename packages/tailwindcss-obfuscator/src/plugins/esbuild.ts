/**
 * esbuild plugin entry. Delegates to the shared `unplugin` core.
 */

import type { Plugin } from "esbuild";
import type { ObfuscatorOptions } from "../core/types.js";
import { obfuscatorUnplugin } from "./core.js";

/**
 * esbuild plugin that obfuscates Tailwind CSS class names during the build.
 */
export function tailwindCssObfuscatorEsbuild(options: ObfuscatorOptions = {}): Plugin {
  return obfuscatorUnplugin.esbuild(options) as unknown as Plugin;
}

export default tailwindCssObfuscatorEsbuild;
