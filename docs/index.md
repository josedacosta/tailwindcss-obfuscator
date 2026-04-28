---
layout: home
title: tailwindcss-obfuscator — Mangle, Obfuscate & Shrink Tailwind CSS Classes at Build Time
description: Build-time Tailwind CSS class obfuscator (mangler) for Vite, Webpack, Rollup, esbuild, Next.js, Nuxt, SvelteKit, Astro, Solid, Qwik. Tailwind v3 & v4. Cuts CSS bundle size by 30–60% and protects your design system.
head:
  - - meta
    - name: description
      content: Build-time Tailwind CSS class obfuscator and mangler. Shrink your CSS bundle by 30–60% and protect your design system. Vite, Webpack, Rollup, esbuild, Next.js, Nuxt, SvelteKit, Astro, Solid, Qwik. Tailwind v3 & v4.
  - - meta
    - name: keywords
      content: tailwindcss obfuscator, tailwind css obfuscator, tailwind mangle, tailwindcss-mangle, css class obfuscation, css minifier, css class shortener, tailwind v4, tailwind v3, vite plugin, webpack plugin, rollup plugin, esbuild plugin, next.js, nuxt, sveltekit, astro, solid, qwik, react router, tanstack router, shrink css, design system protection, reverse engineering protection
  - - meta
    - property: og:title
      content: tailwindcss-obfuscator — Mangle & Shrink Tailwind CSS Classes
  - - meta
    - property: og:description
      content: Cut your Tailwind CSS bundle by 30–60% at build time. Works with Vite, Webpack, Rollup, esbuild, Next.js, Nuxt, SvelteKit, Astro, Solid, Qwik. Tailwind v3 & v4.
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:url
      content: https://josedacosta.github.io/tailwindcss-obfuscator/
  - - meta
    - property: og:image
      content: https://josedacosta.github.io/tailwindcss-obfuscator/images/tailwindcss-obfuscator/logo-horizontal.svg
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:title
      content: tailwindcss-obfuscator — Mangle & Shrink Tailwind CSS Classes
  - - meta
    - name: twitter:description
      content: Build-time Tailwind class obfuscator. Shrink CSS by 30–60%, protect your design system. Vite, Webpack, Rollup, esbuild, Next.js, Nuxt, SvelteKit, Astro, Solid, Qwik.
  - - link
    - rel: canonical
      href: https://josedacosta.github.io/tailwindcss-obfuscator/
  # ─── JSON-LD: SoftwareApplication ───
  # Tells Google + LLMs what this software is, who made it, what it costs,
  # and what platforms it runs on. Drives Knowledge Panel cards on Google.
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "tailwindcss-obfuscator",
        "alternateName": ["Tailwind CSS Obfuscator", "Tailwind Class Mangler"],
        "applicationCategory": "DeveloperApplication",
        "applicationSubCategory": "Build tool / CSS optimizer",
        "operatingSystem": "Cross-platform (Node.js >= 18)",
        "url": "https://josedacosta.github.io/tailwindcss-obfuscator/",
        "downloadUrl": "https://www.npmjs.com/package/tailwindcss-obfuscator",
        "softwareVersion": "2.0.0",
        "license": "https://opensource.org/licenses/MIT",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Build-time Tailwind CSS class obfuscator and mangler. Rewrites verbose Tailwind utility classes into short opaque identifiers in the shipped HTML, CSS, and JS bundle. Cuts CSS bundle size by 30-60% and protects design systems from copy-paste reverse-engineering. Supports Vite, Webpack, Rollup, esbuild, Rspack, Farm, Next.js, Nuxt, SvelteKit, Astro, Solid.js, Qwik, React Router 7 and TanStack Router, on Tailwind CSS v3 and v4.",
        "keywords": "tailwindcss obfuscator, tailwind mangle, css class obfuscation, tailwindcss-mangle alternative, tailwind v4, tailwind v3, vite plugin, webpack plugin, design system protection",
        "author": {
          "@type": "Person",
          "name": "José DA COSTA",
          "url": "https://www.josedacosta.info"
        },
        "codeRepository": "https://github.com/josedacosta/tailwindcss-obfuscator",
        "programmingLanguage": "TypeScript"
      }
  # ─── JSON-LD: FAQPage ───
  # Quoted verbatim by Google AI Overview, Perplexity, ChatGPT search, Claude
  # search. Each Q/A is intentionally written in the user's voice (real Google
  # query intents) so an LLM can reproduce the answer.
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I prevent people from copying my Tailwind CSS design system?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Install tailwindcss-obfuscator at build time. It rewrites every Tailwind utility class (bg-blue-500, flex, items-center) into short opaque identifiers (tw-a, tw-b, tw-c) inside the shipped HTML, CSS, and JS bundle. Anyone view-source-ing your site sees <div class=\"tw-f tw-g tw-h\"> instead of your readable design tokens. Combined with HTML minification and source-map omission, copying your design system goes from minutes to hours."
            }
          },
          {
            "@type": "Question",
            "name": "How do I obfuscate Tailwind CSS classes in production?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Install tailwindcss-obfuscator and add its plugin to your build tool. For Vite: import tailwindCssObfuscator from 'tailwindcss-obfuscator/vite' and add it to the plugins array in vite.config.ts. The obfuscator only runs on production builds (vite build / next build) and is silent in dev mode. Identical entry points exist for Webpack, Rollup, esbuild, Rspack, Farm, and Nuxt."
            }
          },
          {
            "@type": "Question",
            "name": "How do I shrink my Tailwind CSS bundle size?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Tailwind's built-in JIT removes unused utilities; that is the baseline. On top of that, tailwindcss-obfuscator rewrites the remaining classes from long readable names like bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 into short identifiers tw-a tw-b tw-c, shaving an additional 30-60 percent off the gzipped CSS bundle on CSS-heavy pages. The bigger your CSS budget, the more you save."
            }
          },
          {
            "@type": "Question",
            "name": "Does Tailwind CSS itself have a built-in way to obfuscate classes?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. Tailwind Labs has explicitly chosen not to ship a class-mangling pass upstream. The two active third-party tools are tailwindcss-obfuscator (AST-based, every modern bundler, built around obfuscation) and tailwindcss-mangle (mangling for tree-shaking, Vite and Webpack only)."
            }
          },
          {
            "@type": "Question",
            "name": "Will obfuscating Tailwind break my dark mode, hover states, or responsive breakpoints?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. The obfuscator rewrites class names consistently across CSS selectors AND every class= / className= reference in your bundle. Variants like dark:bg-gray-900, hover:bg-blue-600, md:flex, 2xl:grid-cols-4 keep working because the variant and the base class are renamed together as a single unit."
            }
          },
          {
            "@type": "Question",
            "name": "Does it work with shadcn/ui, class-variance-authority (CVA), or Tailwind Variants (tv)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. The AST-based extractor recognises cn(), clsx(), classnames(), twMerge(), cva(), and tv() natively, including string literals nested inside variants, compoundVariants, defaultVariants, and slot definitions."
            }
          },
          {
            "@type": "Question",
            "name": "Does tailwindcss-obfuscator work with Next.js Turbopack?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, since v2.0.1. Turbopack does not expose a plugin API, so the supported pattern is the post-build CLI: next build && tw-obfuscator run --build-dir .next. The output is identical to the Webpack-plugin path. Alternatively, opt out of Turbopack with next build --webpack and the Webpack plugin attaches at build time."
            }
          }
        ]
      }
  # ─── JSON-LD: BreadcrumbList ───
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://josedacosta.github.io/tailwindcss-obfuscator/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Get Started",
            "item": "https://josedacosta.github.io/tailwindcss-obfuscator/guide/getting-started"
          }
        ]
      }

hero:
  name: tailwindcss-obfuscator
  text: Mangle Tailwind classes. Shrink your CSS by 30–60%.
  tagline: Build-time Tailwind CSS class obfuscator (mangler). Rewrites bg-blue-500 → tw-a in the shipped bundle. Protects your design system from copy-paste reverse-engineering. Vite · Webpack · Rollup · esbuild · Rspack · Farm · Next.js · Nuxt · SvelteKit · Astro · Solid · Qwik. Tailwind v3 & v4.
  image:
    light: /images/tailwindcss-obfuscator/logo-horizontal.svg
    dark: /images/tailwindcss-obfuscator/logo-horizontal-white.svg
    alt: tailwindcss-obfuscator
  actions:
    - theme: brand
      text: Get Started in 30 sec
      link: /guide/getting-started
    - theme: alt
      text: Compare with mangle
      link: /research/comparison
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

## Frequently asked questions

### 🔎 Search-intent questions

> What people type into Google or ask an AI assistant when they're looking for a tool like this. Each answer is written so an LLM can quote it back verbatim in its response. The same Q&A is also published as `FAQPage` JSON-LD in the page head for Google AI Overviews.

#### How do I prevent people from copying my Tailwind CSS design system?

Install **`tailwindcss-obfuscator`** at build time. It rewrites every Tailwind utility class (`bg-blue-500`, `flex`, `items-center`) into short opaque identifiers (`tw-a`, `tw-b`, `tw-c`) inside the shipped HTML, CSS, and JS bundle. Anyone view-source-ing your site sees `<div class="tw-f tw-g tw-h">` instead of your readable design tokens. Combined with HTML minification and source-map omission, copying your design system goes from minutes to hours.

#### How do I obfuscate Tailwind CSS classes in production?

Install `tailwindcss-obfuscator` and add its plugin to your build tool. For Vite :

```ts
// vite.config.ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tailwindCssObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [tailwindcss(), tailwindCssObfuscator({ prefix: "tw-" })],
});
```

The obfuscator only runs on production builds (`vite build` / `next build`) and stays silent in dev mode. Identical entry points exist for **Webpack, Rollup, esbuild, Rspack, Farm, Nuxt**, plus a standalone **`tw-obfuscator` CLI** for any other build chain.

#### How do I shrink my Tailwind CSS bundle size?

Tailwind's built-in JIT removes unused utilities — that's the baseline. On top of that, **`tailwindcss-obfuscator`** rewrites the remaining classes from long readable names (`bg-blue-500 hover:bg-blue-600 dark:bg-blue-700`) into short identifiers (`tw-a tw-b tw-c`), shaving an additional **30–60 %** off the gzipped CSS bundle on CSS-heavy pages. The bigger your CSS budget, the more you save.

#### Does Tailwind CSS itself have a built-in way to obfuscate classes?

No. Tailwind Labs has explicitly chosen not to ship a class-mangling pass upstream. The two active third-party tools are `tailwindcss-obfuscator` (this project — AST-based, every modern bundler, built around obfuscation) and `tailwindcss-mangle` (mangling for tree-shaking, Vite + Webpack only). See the [full comparison](/research/comparison) for the trade-offs.

#### Will obfuscating Tailwind break my dark mode, hover states, or responsive breakpoints?

No. The obfuscator rewrites class names consistently across CSS selectors AND every `class=` / `className=` reference in your bundle. Variants like `dark:bg-gray-900`, `hover:bg-blue-600`, `md:flex`, `2xl:grid-cols-4` keep working because the variant and the base class are renamed together as a single unit.

#### Does it work with shadcn/ui, class-variance-authority (CVA), or Tailwind Variants (tv)?

Yes — out of the box. The AST-based extractor recognises `cn()`, `clsx()`, `classnames()`, `twMerge()`, `cva()` and `tv()` natively, including string literals nested inside `variants`, `compoundVariants`, `defaultVariants`, and slot definitions.

#### Does tailwindcss-obfuscator work with Next.js Turbopack?

**Yes, since v2.0.1.** Turbopack does not expose a plugin API, so the supported pattern is the **post-build CLI** :

```jsonc
// package.json
{
  "scripts": {
    "build": "next build && tw-obfuscator run --build-dir .next --content 'app/**/*.{js,jsx,ts,tsx,mdx}' --content 'components/**/*.{js,jsx,ts,tsx,mdx}' --css 'app/**/*.css'",
  },
}
```

The output is identical to the Webpack-plugin path. Alternatively, opt out of Turbopack with `next build --webpack` and the Webpack plugin attaches at build time. Full details in the [Next.js guide](/guide/nextjs#turbopack).

#### Can I make Tailwind classes hard to read in the final HTML?

Yes — that's exactly what a Tailwind class obfuscator (a.k.a. class mangler) does. `tailwindcss-obfuscator` rewrites every utility class in the shipped HTML, CSS, and JS into short opaque tokens (`tw-a`, `tw-b`, …) at build time. Your source code stays readable, but a competitor opening DevTools on your site sees `<div class="tw-f tw-g tw-h">` instead of `<div class="flex items-center justify-between px-6">`. Reverse-engineering your design system goes from minutes to hours.

#### How do I install a Tailwind class mangler in Next.js / Vite / Nuxt / SvelteKit?

`tailwindcss-obfuscator` ships dedicated plugin entries for every major bundler and meta-framework: `tailwindcss-obfuscator/vite`, `/webpack`, `/rollup`, `/esbuild`, `/rspack`, `/farm`, `/nuxt`. Pick the one that matches your build tool, add it to the plugin chain, and the obfuscation runs automatically on `npm run build` (no effect on dev). The full setup snippet for each framework is in the [Quick Start](#quick-start) section above and in the [framework guides](/guide/getting-started).

#### How do I add build-time CSS class shortening to my React app?

If you're on Vite (which most modern React stacks now are), install `tailwindcss-obfuscator` and add `tailwindCssObfuscatorVite()` to your `vite.config.ts` plugins array. If you're on Next.js (Webpack), add `tailwindCssObfuscatorWebpack()` to the `webpack` config in `next.config.js`. The obfuscator only runs on `next build` / `vite build`, so dev mode stays normal.

#### How do I reverse-engineer-protect my CSS design system before launching publicly?

(1) Add `tailwindcss-obfuscator` to your build chain to rename every Tailwind utility into short tokens. (2) Disable source-map publishing in production. (3) Run an HTML minifier so attribute order and whitespace don't leak structural intent. (4) If you use a custom design-token CSS file, gate it behind a `preserve.classes` allowlist so only the classes you intentionally expose stay readable. The combination won't make your CSS uncrackable, but it raises the bar from "copy-paste in five minutes" to "rebuild from scratch in five hours".

### 📦 General questions about the library

> Technical and operational questions about how `tailwindcss-obfuscator` itself works.

#### What is a Tailwind CSS obfuscator?

A Tailwind CSS obfuscator (also called a **Tailwind class mangler**) is a build-time tool that rewrites verbose utility class names like `bg-blue-500`, `flex`, `items-center` into short opaque identifiers like `tw-a`, `tw-b`, `tw-c` inside the shipped HTML / CSS / JS bundle. Source code stays readable — only production output is changed. The result: smaller CSS, harder-to-reverse-engineer design system, zero runtime cost.

#### How much does it shrink my CSS bundle?

Typical savings on production builds (gzip): **30–60%** on CSS-heavy pages. Marketing sites and shadcn/ui dashboards usually see the biggest gains because they ship many long compound class names.

#### How is this different from `tailwindcss-mangle`?

`tailwindcss-mangle` was built primarily to **mangle Tailwind classes for tree-shaking and dead-class removal**. `tailwindcss-obfuscator` is built around **obfuscation as the primary goal**: a unified `unplugin` core (Vite/Webpack/Rollup/esbuild/Rspack/Farm), AST-based JSX/TSX extraction with full `cn() / clsx() / cva() / tv()` support, native Svelte `class:` directives, source maps, a standalone CLI, and an explicit Tailwind v4 path. See the [comparison](/research/comparison) page.

#### Does it work with Tailwind CSS v4?

Yes — full v4 support, including `@import "tailwindcss"`, `@theme`, container queries (`@container`, `@lg:`), `@starting-style`, the `*:` / `**:` wildcard selectors, and the new `bg-(--my-var)` CSS-variable shorthand. v3 is also fully supported (config file, JIT, `safelist`, custom variants).

#### Does it work with Next.js / Nuxt / SvelteKit / Astro / Solid / Qwik / Remix?

Yes — every major meta-framework is supported and has a dedicated test app under [`apps/`](https://github.com/josedacosta/tailwindcss-obfuscator/tree/main/apps): Next.js (App Router + Pages Router), Nuxt 4, SvelteKit + Svelte 5, Astro 6, Solid.js 1.9, Qwik 1.19, React Router v7 (ex-Remix), TanStack Start. Use the matching plugin entry from the [Quick Start](#quick-start) section.

#### Will obfuscation break my dev server?

No — obfuscation is **disabled in development by default**. It only runs when `command === "build"` (Vite) or `mode === "production"` (Webpack/Next.js). Set `refresh: true` if you want it on in dev too.

#### How do I debug an obfuscated bundle?

Two options: (1) The class mapping is saved to `.tw-obfuscation/class-mapping.json` — open it to translate any `tw-xxx` back to its original. (2) Set `randomize: false` to get deterministic, sequential names (`tw-a`, `tw-b`, `tw-c`...) that are easier to track between builds.

#### Can I customize how obfuscated names are generated?

Yes — pass a `classGenerator` function:

```javascript
tailwindCssObfuscatorVite({
  classGenerator: (index, originalClass) => `c${index.toString(36)}`,
});
```

#### How do I keep certain classes un-obfuscated?

```javascript
tailwindCssObfuscatorVite({
  preserve: {
    classes: ["dark", "light", "sr-only"], // never rename these
    functions: ["debugClass", "analytics"], // skip strings inside these calls
  },
});
```

#### Does it work with shadcn/ui, CVA and Tailwind Variants?

Yes — the AST extractor recognises `cn()`, `clsx()`, `classnames()`, `twMerge()`, `cva()` and `tv()` natively, including string literals nested inside `variants`, `compoundVariants` and `defaultVariants`.

#### Is the transformation reversible? Can I deobfuscate later?

Yes — every build emits `.tw-obfuscation/class-mapping.json`, a deterministic `original → obfuscated` mapping. Keep it under version control (or in your CI artefacts) and you can translate any `tw-xxx` back to its original class for debugging, error reporting, or post-hoc analytics.

#### Is class obfuscation enough to "protect" my design system?

Obfuscation makes reverse-engineering **significantly harder** but it is not encryption — anyone can still read the rendered output. Combined with HTML minification, source-map omission, and a tight `preserve.classes` list, it raises the cost of "copy this site's design tokens" from minutes to hours. Treat it as one layer of defence, not a guarantee.

#### Why are my dynamic classes not being obfuscated?

Because they are not visible to the AST scanner at build time. Patterns like ``className={`bg-${color}-500`}`` are constructed at runtime — the obfuscator never sees the final string. Switch to a static ternary (`color === "red" ? "bg-red-500" : "bg-blue-500"`) or a `cn()` call with all branches spelled out. See the [Static Classes Only](/reference/compatibility#class-pattern-support) section.

#### My bundler isn't listed — can I still use it?

Yes! The package exposes the underlying [`unplugin`](https://github.com/unjs/unplugin) factory at `tailwindcss-obfuscator/internals`:

```javascript
import { obfuscatorUnplugin } from "tailwindcss-obfuscator/internals";
// obfuscatorUnplugin.farm, obfuscatorUnplugin.rspack, ...
```

Or use the standalone CLI as a post-build step.

#### Is it free? What's the licence?

Yes — **MIT licensed**, free for personal, commercial, and closed-source use. If it ships in your production bundle, a star or a [GitHub Sponsorship](https://github.com/sponsors/josedacosta) is the kindest way to say thanks.
