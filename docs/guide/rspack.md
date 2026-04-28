---
outline: deep
---

# Rspack (standalone)

Use `tailwindcss-obfuscator/rspack` directly in any [Rspack](https://rspack.dev) project. The plugin shares the same `unplugin` core as the Vite/Webpack adapters, so options behave identically.

## Quick start

::: code-group

```bash [npm]
npm install -D tailwindcss-obfuscator @rspack/core
```

```bash [pnpm]
pnpm add -D tailwindcss-obfuscator @rspack/core
```

```bash [yarn]
yarn add -D tailwindcss-obfuscator @rspack/core
```

```bash [bun]
bun add -D tailwindcss-obfuscator @rspack/core
```

:::

```ts
// rspack.config.ts
import { defineConfig } from "@rspack/cli";
import TailwindObfuscator from "tailwindcss-obfuscator/rspack";

export default defineConfig({
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          "@rspack/plugin-css",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: { plugins: ["@tailwindcss/postcss"] },
            },
          },
        ],
      },
    ],
  },
  plugins: [TailwindObfuscator({ prefix: "tw-" })],
});
```

::: tip
The plugin only runs for production builds (`rspack build`). Pass `refresh: true` if you need it active during `rspack serve` too.
:::

## Production configuration

```ts
TailwindObfuscator({
  prefix: "tw-",
  content: ["src/**/*.{html,js,jsx,ts,tsx}"],
  css: ["src/**/*.css"],
  preserve: { classes: ["no-obfuscate", "sr-only"] },
  mapping: {
    enabled: true,
    file: ".tw-obfuscation/class-mapping.json",
    pretty: 2,
  },
});
```

## Patterns the plugin handles

| Pattern                                               | Status                            |
| ----------------------------------------------------- | --------------------------------- |
| `className="..."` in JSX/TSX                          | ✅ Babel AST extractor            |
| `class="..."` in HTML / Vue / Svelte / Astro emitters | ✅ via the relevant loader        |
| `cn() / clsx() / cva() / tv()`                        | ✅                                |
| `class:directive` in `.svelte` files                  | ✅                                |
| Dynamic interpolation (`` `bg-${color}-500` ``)       | ❌ left as-is — switch to ternary |

## Migrating from Webpack

`@rspack/core` aims for Webpack 5 compatibility, so the migration from `tailwindcss-obfuscator/webpack` is a one-line change:

```diff
- import TailwindObfuscator from "tailwindcss-obfuscator/webpack";
+ import TailwindObfuscator from "tailwindcss-obfuscator/rspack";
```

All options (`prefix`, `preserve`, `mapping`, `randomize`, `classGenerator`) carry over unchanged.

## Troubleshooting

::: warning Loader order
Like with Webpack, the obfuscator's CSS loader needs to run **after** the Tailwind PostCSS pass — otherwise it scans un-emitted classes. Place the obfuscator's plugin entry at the end of the plugin array.
:::

## See also

- [Webpack standalone guide](./webpack-standalone.md) — same options surface
- [Options reference](./options.md)
- [Class utilities](./class-utilities.md)
