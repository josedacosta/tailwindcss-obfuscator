/**
 * Webpack plugin entry. Delegates to the shared `unplugin` core.
 *
 * The class form `TailwindCssObfuscatorPlugin` is preserved for backward
 * compatibility with users that wired the original class-based plugin into
 * their `webpack.config.js`.
 */

import type { Compiler } from "webpack";
import type { ObfuscatorOptions } from "../core/types.js";
import { obfuscatorUnplugin } from "./core.js";

/**
 * Webpack plugin class that obfuscates Tailwind CSS class names.
 *
 * Internally instantiates the shared `unplugin` adapter on `apply`.
 */
export class TailwindCssObfuscatorPlugin {
  private readonly options: ObfuscatorOptions;

  constructor(options: ObfuscatorOptions = {}) {
    this.options = options;
  }

  apply(compiler: Compiler): void {
    const plugin = obfuscatorUnplugin.webpack(this.options) as unknown as {
      apply: (c: Compiler) => void;
    };
    plugin.apply(compiler);
  }
}

/**
 * Factory equivalent of {@link TailwindCssObfuscatorPlugin}.
 */
export function tailwindCssObfuscatorWebpack(
  options: ObfuscatorOptions = {}
): TailwindCssObfuscatorPlugin {
  return new TailwindCssObfuscatorPlugin(options);
}

export default tailwindCssObfuscatorWebpack;
