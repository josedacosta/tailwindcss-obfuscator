---
outline: deep
---

# Solid.js (Vite)

Setup for a standard **Vite + Solid** project. Solid uses JSX with `class` (not `className`); the plugin's JSX transformer handles both.

## Quick start

::: code-group

```bash [npm]
npm install -D tailwindcss-obfuscator
```

```bash [pnpm]
pnpm add -D tailwindcss-obfuscator
```

```bash [yarn]
yarn add -D tailwindcss-obfuscator
```

```bash [bun]
bun add -D tailwindcss-obfuscator
```

:::

```ts
// vite.config.ts
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import TailwindObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [solid(), tailwindcss(), TailwindObfuscator({ prefix: "tw-" })],
});
```

## Solid patterns the plugin handles

| Pattern                                                         | Status                  |
| --------------------------------------------------------------- | ----------------------- |
| `<div class="flex items-center gap-2" />`                       | ✅ Static string        |
| `<div classList={{ 'bg-red-500': hasError() }} />`              | ✅ `classList` object   |
| `<Dynamic class={isError() ? 'bg-red-500' : 'bg-green-500'} />` | ✅ Static ternary       |
| `<div class={cn('flex', active() && 'ring-2')} />`              | ✅ via `cn()`           |
| `<div class={\`bg-\${color}-500\`} />`                          | ❌ Dynamic — kept as-is |

::: tip
Solid's reactivity model means class strings are recomputed on signal change, but they're still **string literals at AST time** — the plugin sees and rewrites them at build time, not runtime. No special configuration needed.
:::

## SolidStart

If you're using SolidStart (Solid's meta-framework), the same Vite plugin applies:

```ts
// app.config.ts
import { defineConfig } from "@solidjs/start/config";
import TailwindObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  vite: {
    plugins: [TailwindObfuscator({ prefix: "tw-" })],
  },
});
```

The plugin only activates for the production build (`vinxi build`), not for `vinxi dev`.

## Troubleshooting

::: warning `classList` keys
The keys of a `classList` object are **string literals** in the JSX — they get obfuscated. The values (truthy/falsy expressions) are left alone.

```tsx
// Source
<div classList={{ "bg-red-500": hasError(), "p-4": true }} />

// After obfuscation
<div classList={{ "tw-a": hasError(), "tw-b": true }} />
```

:::

## See also

- Sample app — [`apps/test-solidjs`](https://github.com/josedacosta/tailwindcss-obfuscator/tree/main/apps/test-solidjs)
- [Vite guide](./vite.md) for shared options
- [Class utilities](./class-utilities.md)
- [Options reference](./options.md)
