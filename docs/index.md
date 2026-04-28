---
layout: home

hero:
  name: tailwindcss-obfuscator
  text: Protect Your CSS Intellectual Property
  tagline: A powerful Tailwind CSS class obfuscation tool that transforms readable classes into cryptic identifiers while maintaining full functionality.
  image:
    light: /images/tailwindcss-obfuscator/logo-horizontal.svg
    dark: /images/tailwindcss-obfuscator/logo-horizontal-white.svg
    alt: tailwindcss-obfuscator
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/josedacosta/tailwindcss-obfuscator

features:
  - icon:
      src: /icons/shield.svg
    title: CSS Protection
    details: Transform readable Tailwind classes like `bg-blue-500` into obfuscated versions like `tw-a` to protect your design system.

  - icon:
      src: /icons/zap.svg
    title: Zero Runtime Cost
    details: All obfuscation happens at build time. No JavaScript overhead, no performance penalty in production.

  - icon:
      src: /icons/puzzle.svg
    title: Framework Agnostic
    details: Works with Vite, Next.js, Nuxt, SvelteKit, Astro, Remix, Qwik, and more through unplugin.

  - icon:
      src: /images/tailwindcss/logo-square.svg
    title: Tailwind v3 & v4
    details: Full support for both Tailwind CSS v3 and the new CSS-first v4 architecture.

  - icon:
      src: /icons/code.svg
    title: Smart Class Detection
    details: Automatically detects classes in cn(), clsx(), cva(), twMerge() and other utility functions.

  - icon:
      src: /icons/settings.svg
    title: Highly Configurable
    details: Customize prefix, exclusions, output mapping, and more to fit your project needs.
---

## Quick Start

Install the package:

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

Add to your build configuration:

### Vite-based Frameworks

::: code-group

```ts [Vite + React]
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import TailwindObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [
    react(),
    TailwindObfuscator({
      prefix: "tw-",
    }),
  ],
});
```

```ts [Vite + Vue]
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import TailwindObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [
    vue(),
    TailwindObfuscator({
      prefix: "tw-",
    }),
  ],
});
```

```ts [Vite + Svelte]
// vite.config.ts
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import TailwindObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [
    svelte(),
    TailwindObfuscator({
      prefix: "tw-",
    }),
  ],
});
```

```ts [Vite + Solid]
// vite.config.ts
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import TailwindObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [
    solid(),
    TailwindObfuscator({
      prefix: "tw-",
    }),
  ],
});
```

```ts [Vite + Preact]
// vite.config.ts
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import TailwindObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [
    preact(),
    TailwindObfuscator({
      prefix: "tw-",
    }),
  ],
});
```

:::

### Meta-Frameworks

::: code-group

```ts [Next.js 15+ (Turbopack)]
// next.config.ts
// Next.js 15+ uses Turbopack for development by default
// Production builds still use webpack - obfuscation works in prod
import type { NextConfig } from "next";
import TailwindObfuscator from "tailwindcss-obfuscator/webpack";

const config: NextConfig = {
  webpack: (config, { dev }) => {
    if (!dev) {
      config.plugins = config.plugins || [];
      config.plugins.push(
        TailwindObfuscator({
          prefix: "tw-",
        })
      );
    }
    return config;
  },
};

export default config;
```

```ts [Nuxt]
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["tailwindcss-obfuscator/nuxt"],

  tailwindcssObfuscator: {
    prefix: "tw-",
  },
});
```

```ts [Astro]
// astro.config.mjs
import { defineConfig } from "astro/config";
import TailwindObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  vite: {
    plugins: [
      TailwindObfuscator({
        prefix: "tw-",
      }),
    ],
  },
});
```

```ts [SvelteKit]
// vite.config.ts
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import TailwindObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [
    sveltekit(),
    TailwindObfuscator({
      prefix: "tw-",
    }),
  ],
});
```

```ts [Remix]
// vite.config.ts
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import TailwindObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [
    remix(),
    TailwindObfuscator({
      prefix: "tw-",
    }),
  ],
});
```

```ts [Next.js 14 (Webpack)]
// next.config.ts
// Next.js 14 and earlier use webpack for both dev and prod
import type { NextConfig } from "next";
import TailwindObfuscator from "tailwindcss-obfuscator/webpack";

const config: NextConfig = {
  webpack: (config, { dev }) => {
    if (!dev) {
      config.plugins = config.plugins || [];
      config.plugins.push(
        TailwindObfuscator({
          prefix: "tw-",
        })
      );
    }
    return config;
  },
};

export default config;
```

```ts [SolidStart]
// vite.config.ts
import { defineConfig } from "vite";
import solid from "solid-start/vite";
import TailwindObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [
    solid(),
    TailwindObfuscator({
      prefix: "tw-",
    }),
  ],
});
```

```ts [Qwik City]
// vite.config.ts
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import { defineConfig } from "vite";
import TailwindObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [
    qwikCity(),
    qwikVite(),
    TailwindObfuscator({
      prefix: "tw-",
    }),
  ],
});
```

:::

### Other Build Tools

::: code-group

```ts [Webpack]
// webpack.config.js
const TailwindObfuscator = require("tailwindcss-obfuscator/webpack");

module.exports = {
  plugins: [
    TailwindObfuscator({
      prefix: "tw-",
    }),
  ],
};
```

```ts [esbuild]
// build.js
import * as esbuild from "esbuild";
import TailwindObfuscator from "tailwindcss-obfuscator/esbuild";

await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outfile: "dist/bundle.js",
  plugins: [
    TailwindObfuscator({
      prefix: "tw-",
    }),
  ],
});
```

```ts [Rollup]
// rollup.config.js
import TailwindObfuscator from "tailwindcss-obfuscator/rollup";

export default {
  plugins: [
    TailwindObfuscator({
      prefix: "tw-",
    }),
  ],
};
```

```ts [Rspack]
// rspack.config.js
const TailwindObfuscator = require("tailwindcss-obfuscator/rspack");

module.exports = {
  plugins: [
    TailwindObfuscator({
      prefix: "tw-",
    }),
  ],
};
```

```ts [Farm]
// farm.config.ts
import { defineConfig } from "@farmfe/core";
import TailwindObfuscator from "tailwindcss-obfuscator/farm";

export default defineConfig({
  plugins: [
    TailwindObfuscator({
      prefix: "tw-",
    }),
  ],
});
```

:::

## Before & After

```html
<!-- Before obfuscation -->
<div class="flex items-center justify-between rounded-lg bg-white p-4 shadow-md">
  <h1 class="text-xl font-bold text-gray-900">Hello World</h1>
</div>

<!-- After obfuscation -->
<div class="tw-a tw-b tw-c tw-d tw-e tw-f tw-g">
  <h1 class="tw-h tw-i tw-j">Hello World</h1>
</div>
```

## Supported Frameworks & Build Tools

### Vite-based

| Framework     | Plugin                        | Status    |
| ------------- | ----------------------------- | --------- |
| Vite + React  | `tailwindcss-obfuscator/vite` | ✅ Stable |
| Vite + Vue    | `tailwindcss-obfuscator/vite` | ✅ Stable |
| Vite + Svelte | `tailwindcss-obfuscator/vite` | ✅ Stable |
| Vite + Solid  | `tailwindcss-obfuscator/vite` | ✅ Stable |
| Vite + Preact | `tailwindcss-obfuscator/vite` | ✅ Stable |

### Meta-Frameworks

| Framework               | Plugin                           | Status    | Notes                       |
| ----------------------- | -------------------------------- | --------- | --------------------------- |
| Next.js 15+ (Turbopack) | `tailwindcss-obfuscator/webpack` | ✅ Stable | Turbopack dev, webpack prod |
| Nuxt                    | `tailwindcss-obfuscator/nuxt`    | ✅ Stable | Native module               |
| Astro                   | `tailwindcss-obfuscator/vite`    | ✅ Stable | Vite-based                  |
| SvelteKit               | `tailwindcss-obfuscator/vite`    | ✅ Stable | Vite-based                  |
| Remix                   | `tailwindcss-obfuscator/vite`    | ✅ Stable | Vite-based                  |
| Next.js 14 (Webpack)    | `tailwindcss-obfuscator/webpack` | ✅ Stable | Full webpack                |
| SolidStart              | `tailwindcss-obfuscator/vite`    | ✅ Stable | Vite-based                  |
| Qwik City               | `tailwindcss-obfuscator/vite`    | ✅ Stable | Vite-based                  |

### Build Tools

| Tool    | Plugin                           | Status    |
| ------- | -------------------------------- | --------- |
| Webpack | `tailwindcss-obfuscator/webpack` | ✅ Stable |
| esbuild | `tailwindcss-obfuscator/esbuild` | ✅ Stable |
| Rollup  | `tailwindcss-obfuscator/rollup`  | ✅ Stable |
| Rspack  | `tailwindcss-obfuscator/rspack`  | ✅ Stable |
| Farm    | `tailwindcss-obfuscator/farm`    | ✅ Stable |
