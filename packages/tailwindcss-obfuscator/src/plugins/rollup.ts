/**
 * Rollup plugin entry. Delegates to the shared `unplugin` core.
 */

import type { Plugin } from "rollup";
import type { ObfuscatorOptions } from "../core/types.js";
import { obfuscatorUnplugin } from "./core.js";

/**
 * Rollup plugin that obfuscates Tailwind CSS class names during the build.
 */
export function tailwindCssObfuscatorRollup(options: ObfuscatorOptions = {}): Plugin {
  return obfuscatorUnplugin.rollup(options) as Plugin;
}

export default tailwindCssObfuscatorRollup;
