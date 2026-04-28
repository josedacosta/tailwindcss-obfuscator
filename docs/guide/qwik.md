---
outline: deep
---

# Qwik (Vite)

Setup for a standard **Qwik + Vite** project. Qwik uses `class` (not `className`) and has its own `class$` reactive primitive — both go through the JSX transformer.

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
import { qwikVite } from "@builder.io/qwik/optimizer";
import tailwindcss from "@tailwindcss/vite";
import TailwindObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [qwikVite(), tailwindcss(), TailwindObfuscator({ prefix: "tw-" })],
});
```

## Qwik City

For a full Qwik City app (the meta-framework), wire the obfuscator after `qwikCity()`:

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { qwikCity } from "@builder.io/qwik-city/vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import tailwindcss from "@tailwindcss/vite";
import TailwindObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [qwikCity(), qwikVite(), tailwindcss(), TailwindObfuscator({ prefix: "tw-" })],
});
```

## Qwik patterns the plugin handles

| Pattern                                                | Status                                                |
| ------------------------------------------------------ | ----------------------------------------------------- |
| `<div class="flex items-center gap-2" />`              | ✅ Static string                                      |
| `<div class={["flex", "items-center"]} />`             | ✅ Array of strings                                   |
| `<div class={{ "bg-red-500": hasError.value }} />`     | ✅ Object syntax                                      |
| `<div class$={() => useSignal().value && "ring-2"} />` | ✅ Reactive — string literals inside still obfuscated |
| `<div class={\`bg-\${color}-500\`} />`                 | ❌ Dynamic interpolation — kept as-is                 |

::: tip
`class$()` is Qwik's lazy reactive class binding (the `$` suffix marks it as a serialised closure). The plugin reads the **string literals** inside the closure body at AST time and rewrites them; the reactivity at runtime is preserved.
:::

## Troubleshooting

::: warning Pre-rendered SSR output
Qwik produces server-rendered HTML at build time. If you see un-obfuscated classes in the rendered HTML, check that the plugin runs **after** `qwikVite()` and `qwikCity()` in the plugin array. Order matters because Qwik rewrites JSX into its own format first.
:::

## See also

- Sample app — [`apps/test-qwik`](https://github.com/josedacosta/tailwindcss-obfuscator/tree/main/apps/test-qwik)
- [Vite guide](./vite.md) for shared options
- [Class utilities](./class-utilities.md)
- [Options reference](./options.md)
