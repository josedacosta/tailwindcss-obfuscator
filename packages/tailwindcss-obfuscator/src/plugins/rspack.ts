/**
 * Rspack plugin entry. Delegates to the shared `unplugin` core, exactly like
 * the Webpack adapter — the two compilers share the same plugin API surface.
 */

import type { RspackPluginInstance } from "@rspack/core";
import type { ObfuscatorOptions } from "../core/types.js";
import { obfuscatorUnplugin } from "./core.js";

/**
 * Rspack plugin that obfuscates Tailwind CSS class names during the build.
 */
export function tailwindCssObfuscatorRspack(options: ObfuscatorOptions = {}): RspackPluginInstance {
  return obfuscatorUnplugin.rspack(options);
}

export default tailwindCssObfuscatorRspack;
