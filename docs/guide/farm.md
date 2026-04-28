---
outline: deep
---

# Farm

Use `tailwindcss-obfuscator/farm` in any [Farm](https://www.farmfe.org) project. Farm is a Rust-powered build tool with a Vite-compatible plugin system, so the configuration mirrors the Vite guide.

## Quick start

::: code-group

```bash [npm]
npm install -D tailwindcss-obfuscator @farmfe/core
```

```bash [pnpm]
pnpm add -D tailwindcss-obfuscator @farmfe/core
```

```bash [yarn]
yarn add -D tailwindcss-obfuscator @farmfe/core
```

```bash [bun]
bun add -D tailwindcss-obfuscator @farmfe/core
```

:::

```ts
// farm.config.ts
import { defineConfig } from "@farmfe/core";
import TailwindObfuscator from "tailwindcss-obfuscator/farm";

export default defineConfig({
  plugins: [TailwindObfuscator({ prefix: "tw-" })],
});
```

::: tip
Like the Vite plugin, the obfuscator only runs for production builds (`farm build`). The dev server (`farm`) is left untouched so the dev experience stays normal.
:::

## Production configuration

Same options surface as the [Vite guide](./vite.md):

```ts
TailwindObfuscator({
  prefix: "tw-",
  content: ["src/**/*.{html,js,jsx,ts,tsx,vue,svelte}"],
  css: ["src/**/*.css"],
  preserve: { classes: ["dark", "light", "sr-only"] },
  mapping: {
    enabled: true,
    file: ".tw-obfuscation/class-mapping.json",
    pretty: 2,
  },
});
```

## Patterns the plugin handles

Identical to Vite — see the [Vite guide](./vite.md) for the full table. The shared `unplugin` core means JSX/TSX, Vue, Svelte, Astro and HTML extractors all work the same way.

## Troubleshooting

::: info Farm-specific behaviour
Farm's persistent cache may keep a stale obfuscation mapping between dev runs. If you start seeing inconsistent class names during development, delete `node_modules/.farm` (or run `farm --clean`) and rebuild.
:::

::: warning JS plugin overhead
Farm distinguishes between Rust plugins and JavaScript plugins. `tailwindcss-obfuscator/farm` is a JS plugin (it builds on `unplugin`), so it runs in Node, not in the Rust core. This is a few milliseconds slower than a pure-Rust plugin per file but doesn't change the build output.
:::

## See also

- [Vite guide](./vite.md) — shared options + behaviour
- [Options reference](./options.md)
- [Class utilities](./class-utilities.md)
