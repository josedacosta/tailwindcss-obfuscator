---
outline: deep
---

# Vue 3 (Vite)

Setup for a standard **Vite + Vue 3** project. The plugin handles every class-bearing syntax Vue offers — `class="..."`, `:class="{ … }"`, `:class="[ … ]"`, dynamic ternaries, and computed strings — through the shared AST transformer.

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
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import TailwindObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [vue(), tailwindcss(), TailwindObfuscator({ prefix: "tw-" })],
});
```

That's it. `vite build` produces an obfuscated bundle; `vite dev` is left untouched so the dev experience stays normal.

## Production configuration

```ts
TailwindObfuscator({
  prefix: "tw-",
  // Vue 3 only — see "Scoped styles" below
  ignoreVueScoped: true,
  preserve: {
    // Classes you reference outside `<template>` (e.g. injected by directives)
    classes: ["v-enter-active", "v-leave-active"],
  },
  mapping: { enabled: true, pretty: 2 },
});
```

## Vue patterns the plugin handles

| Pattern                                                   | Status                             |
| --------------------------------------------------------- | ---------------------------------- |
| `class="flex items-center gap-2"`                         | ✅ Static string                   |
| `:class="{ 'bg-red-500': hasError, 'opacity-50': busy }"` | ✅ Object syntax (keys obfuscated) |
| `:class="[base, isActive && 'ring-2 ring-blue-500']"`     | ✅ Array syntax (each item)        |
| `:class="[base, { 'opacity-50': busy }]"`                 | ✅ Mixed array + object            |
| `:class="computedClasses"` (computed string)              | ✅ Resolved at AST time            |
| `class="bg-${color}-500"` (string interpolation)          | ❌ Dynamic — kept as-is            |

::: tip
For dynamic class construction, switch to the static ternary form:

```vue
<!-- breaks obfuscation -->
<div :class="`bg-${color}-500`" />

<!-- works -->
<div :class="color === 'red' ? 'bg-red-500' : 'bg-blue-500'" />
```

:::

## Scoped styles

Vue's `<style scoped>` adds `[data-v-xxxxxxxx]` attribute selectors to each rule. By default `ignoreVueScoped: true` keeps those scoped selectors intact (only the **class** part is obfuscated, not the `data-v-*` attribute):

```css
/* before */
.button[data-v-7ba5bd90] {
  /* … */
}

/* after */
.tw-a[data-v-7ba5bd90] {
  /* … */
}
```

If you set `ignoreVueScoped: false`, the PostCSS pass strips the data-v selector entirely — only do this if you know your scoped styles aren't relied on.

## Troubleshooting

::: warning Class showing up unobfuscated in the runtime
Vue keeps a copy of `class` and `:class` on the root vnode, then merges them. If you set both `class="…"` and `:class="…"` on the same element, both go through the obfuscator independently — no special handling needed.
:::

::: danger Vuetify / element-plus / shadcn-vue components
Component libraries inject classes from their own runtime. Add their prefixes to `preserve.classes` (or use a regex in `exclude`):

```ts
TailwindObfuscator({
  exclude: [/^v-/, /^el-/, /^ant-/],
});
```

:::

## See also

- Sample app — [`apps/test-vite-vue`](https://github.com/josedacosta/tailwindcss-obfuscator/tree/main/apps/test-vite-vue)
- [Vite guide](./vite.md) for shared options
- [Class utilities](./class-utilities.md) — `cn()`, `clsx()`, `cva()` patterns
- [Options reference](./options.md)
