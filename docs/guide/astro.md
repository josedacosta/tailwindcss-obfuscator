# Astro

## Installation

::: code-group

```bash [pnpm]
pnpm add -D tailwindcss-obfuscator
```

```bash [npm]
npm install -D tailwindcss-obfuscator
```

```bash [yarn]
yarn add -D tailwindcss-obfuscator
```

:::

## Configuration

Astro uses Vite, so use the Vite plugin:

```ts
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import TailwindObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  integrations: [tailwind()],
  vite: {
    plugins: [
      TailwindObfuscator({
        prefix: "tw-",
        verbose: true,
      }),
    ],
  },
});
```

## Astro syntax

The plugin supports Astro-specific syntax:

### `class` attribute

```astro
---
const title = 'Hello'
---

<div class="flex items-center bg-blue-500">
  <h1 class="text-xl font-bold">{title}</h1>
</div>
```

### `class:list` directive

```astro
---
const isActive = true
---

<div class:list={[
  'flex items-center',
  { 'bg-blue-500': isActive },
  { 'bg-gray-500': !isActive }
]}>
  Content
</div>
```

### With React / Vue / Svelte components

```astro
---
import ReactComponent from './ReactComponent.tsx'
import VueComponent from './VueComponent.vue'
---

<ReactComponent className="bg-blue-500 p-4" />
<VueComponent class="bg-red-500 p-4" />
```

## Compatibility

| Astro | Status |
| ----- | ------ |
| 5.x   | Stable |
| 4.x   | Stable |

## Full example

```ts
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import TailwindObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  integrations: [tailwind(), react()],
  vite: {
    plugins: [
      TailwindObfuscator({
        prefix: "tw-",
        verbose: true,
        exclude: ["dark", "light", /^prose/],
        mapping: {
          enabled: true,
          file: ".tw-obfuscation/class-mapping.json",
        },
      }),
    ],
  },
});
```
