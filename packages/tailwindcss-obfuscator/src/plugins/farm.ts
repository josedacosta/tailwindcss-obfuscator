/**
 * Farm plugin entry. Delegates to the shared `unplugin` core. Farm uses the
 * Rust-based bundler from farmfe; the JS plugin contract is exposed through
 * `@farmfe/core`'s `JsPlugin` type.
 */

import type { JsPlugin } from "@farmfe/core";
import type { ObfuscatorOptions } from "../core/types.js";
import { obfuscatorUnplugin } from "./core.js";

/**
 * Farm plugin that obfuscates Tailwind CSS class names during the build.
 */
export function tailwindCssObfuscatorFarm(options: ObfuscatorOptions = {}): JsPlugin {
  return obfuscatorUnplugin.farm(options);
}

export default tailwindCssObfuscatorFarm;
