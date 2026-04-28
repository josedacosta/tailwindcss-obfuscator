<div align="center">

<a href="https://github.com/josedacosta/tailwindcss-obfuscator">
  <img src="./docs/public/images/tailwindcss-obfuscator/logo-horizontal.svg" alt="Tailwind CSS Obfuscator" width="960">
</a>

<br /><br />

<h1>
  🛡️ Tailwind CSS Obfuscator
</h1>

<h3>
  <em>Protect your design system. Shrink your bundles. Obfuscate everything.</em>
</h3>

<p>
  The most complete <strong>Tailwind CSS class mangling</strong> tool —<br />
  built for <strong>Tailwind v3 &amp; v4</strong>, every major framework, every build tool.
</p>

<br />

<!-- Badges row 1 — package -->
<p>
  <a href="https://www.npmjs.com/package/tailwindcss-obfuscator">
    <img alt="npm version" src="https://img.shields.io/npm/v/tailwindcss-obfuscator.svg?style=for-the-badge&logo=npm&color=cb3837&labelColor=000000">
  </a>
  <a href="https://www.npmjs.com/package/tailwindcss-obfuscator">
    <img alt="npm downloads" src="https://img.shields.io/npm/dm/tailwindcss-obfuscator.svg?style=for-the-badge&logo=npm&color=10b981&labelColor=000000">
  </a>
  <a href="https://bundlephobia.com/package/tailwindcss-obfuscator">
    <img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/tailwindcss-obfuscator?style=for-the-badge&logo=webpack&color=8dd6f9&labelColor=000000">
  </a>
  <a href="https://github.com/josedacosta/tailwindcss-obfuscator/blob/main/LICENSE">
    <img alt="license" src="https://img.shields.io/npm/l/tailwindcss-obfuscator.svg?style=for-the-badge&color=8b5cf6&labelColor=000000">
  </a>
</p>

<!-- Badges row 2 — tech -->
<p>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178c6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=000000">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-v3%20%26%20v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white&labelColor=000000">
  <img alt="Vite" src="https://img.shields.io/badge/Vite-ready-646cff?style=for-the-badge&logo=vite&logoColor=white&labelColor=000000">
  <img alt="Webpack" src="https://img.shields.io/badge/Webpack-ready-8dd6f9?style=for-the-badge&logo=webpack&logoColor=black&labelColor=000000">
  <img alt="esbuild" src="https://img.shields.io/badge/esbuild-ready-FFCF00?style=for-the-badge&logo=esbuild&logoColor=black&labelColor=000000">
</p>

<!-- Badges row 3 — repo stats -->
<p>
  <a href="https://github.com/josedacosta/tailwindcss-obfuscator/stargazers">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/josedacosta/tailwindcss-obfuscator?style=for-the-badge&logo=github&color=eab308&labelColor=000000">
  </a>
  <a href="https://github.com/josedacosta/tailwindcss-obfuscator/network/members">
    <img alt="GitHub forks" src="https://img.shields.io/github/forks/josedacosta/tailwindcss-obfuscator?style=for-the-badge&logo=github&color=06b6d4&labelColor=000000">
  </a>
  <a href="https://github.com/josedacosta/tailwindcss-obfuscator/issues">
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/josedacosta/tailwindcss-obfuscator?style=for-the-badge&logo=github&color=f97316&labelColor=000000">
  </a>
  <a href="https://github.com/josedacosta/tailwindcss-obfuscator/commits/main">
    <img alt="last commit" src="https://img.shields.io/github/last-commit/josedacosta/tailwindcss-obfuscator?style=for-the-badge&logo=github&color=14b8a6&labelColor=000000">
  </a>
</p>

<br />

<p>
  <a href="#-quick-start"><kbd> &nbsp; 🚀 Quick Start &nbsp; </kbd></a>
  &nbsp;
  <a href="https://josedacosta.github.io/tailwindcss-obfuscator/"><kbd> &nbsp; 📖 Docs &nbsp; </kbd></a>
  &nbsp;
  <a href="./packages/tailwindcss-obfuscator/"><kbd> &nbsp; 📦 Package &nbsp; </kbd></a>
  &nbsp;
  <a href="./apps/"><kbd> &nbsp; 💡 Examples &nbsp; </kbd></a>
  &nbsp;
  <a href="https://github.com/josedacosta/tailwindcss-obfuscator/issues/new"><kbd> &nbsp; 🐛 Report Bug &nbsp; </kbd></a>
</p>

<br />

</div>

<!-- ────────────────────────────────────────────────── -->

> [!IMPORTANT]
> 🔥 **What if a single line in your `vite.config.js` could shrink your CSS by 30–60% and make your design system uncopyable?**
> That's exactly what `tailwindcss-obfuscator` does — at build time, with zero runtime overhead.

<!-- ────────────────────────────────────────────────── -->

---

## 📖 Documentation

<div align="center">

### 👉 [**josedacosta.github.io/tailwindcss-obfuscator**](https://josedacosta.github.io/tailwindcss-obfuscator/) 👈

Setup guide for every framework · complete options reference · the patterns that obfuscate (and the ones that don't) · maintainers' checklist · comparison with `tailwindcss-mangle`.

| 🌐 [**Live docs site**](https://josedacosta.github.io/tailwindcss-obfuscator/) | 📂 [Docs source on GitHub](./docs/) |
| ------------------------------------------------------------------------------ | ----------------------------------- |
| Hosted on GitHub Pages, rebuilt on every push to `main`                        | Edit a page, open a PR              |

</div>

---

<!-- ────────────────────────────────────────────────── -->

## 📑 Table of Contents

<table>
<tr>
<td valign="top" width="50%">

**Get started**

- [✨ What is Class Obfuscation?](#-what-is-class-obfuscation)
- [🎯 Why this library?](#-why-this-library)
- [⚡ Performance impact](#-performance-impact)
- [🚀 Quick Start](#-quick-start)
- [🌐 Supported Frameworks](#-supported-frameworks)

</td>
<td valign="top" width="50%">

**Deep dive**

- [🏛️ Architecture](#️-architecture)
- [🎨 Tailwind v3 & v4](#-tailwind-css-version-support)
- [⚠️ Static Classes Only](#️-important-static-classes-only)
- [🛠️ Development](#️-development)
- [🗺️ Roadmap](#️-roadmap)

</td>
</tr>
</table>

<!-- ────────────────────────────────────────────────── -->

## ✨ What is Class Obfuscation?

Class obfuscation (also called **"class mangling"**) is a build-time transformation that replaces verbose Tailwind utility classes with short, opaque identifiers.

> [!NOTE]
> 💡 **Build-time only** — your source code stays readable. Only the shipped HTML / CSS / JS bundles are obfuscated.

### 🔄 Before & After

#### 😬 Before

```html
<div class="flex min-h-screen items-center justify-center bg-gray-50">
  <button class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">Click me</button>
</div>
```

📏 **142 bytes**

#### 😎 After

```html
<div class="tw-a tw-b tw-c tw-d tw-e">
  <button class="tw-f tw-g tw-h tw-i tw-j tw-k">Click me</button>
</div>
```

📏 **86 bytes** ⚡ **−39%**

### 🎁 What you gain

<table>
<tr>
<td align="center" width="25%">

### 🔒

**Design system<br/>protection**

Make your component patterns much harder to reverse-engineer

</td>
<td align="center" width="25%">

### 📉

**Smaller<br/>bundles**

30–60% reduction on CSS-heavy pages, even after Brotli/gzip

</td>
<td align="center" width="25%">

### 🕵️

**Hidden<br/>internals**

Hide which design tokens, breakpoints, plugins you use

</td>
<td align="center" width="25%">

### ⚡

**Faster<br/>parsing**

Browser parses smaller selectors → shorter style recalc

</td>
</tr>
</table>

<!-- ────────────────────────────────────────────────── -->

## 🎯 Why this library?

There are a handful of class-mangling tools out there. Here's how this one stacks up:

<div align="center">

| Capability                                                                    | 🛡️&nbsp;&nbsp;**tailwindcss-obfuscator** | 🔧&nbsp;&nbsp;tailwindcss-mangle | ⚙️&nbsp;&nbsp;PostCSS minifiers |
| ----------------------------------------------------------------------------- | :--------------------------------------: | :------------------------------: | :-----------------------------: |
| Tailwind v4 (CSS-first) support                                               |        ✅ Native (AST + PostCSS)         |  ✅ via CSS scanning (v9.0.0+)   |               ❌                |
| Unified `unplugin` core (Vite/Webpack/Rollup/esbuild/**Rspack**/**Farm**)     |                    ✅                    |          ⚠️ Per-bundler          |               ❌                |
| AST-based JSX/TSX transformer                                                 |                 ✅ Babel                 |             ⚠️ Regex             |               ❌                |
| Svelte `class:directive` support                                              |                    ✅                    |                ❌                |               ❌                |
| Class-utility extraction (`cn`, `clsx`, `classnames`, `twMerge`, `cva`, `tv`) |                ✅ All six                |              ⚠️ Two              |               ❌                |
| Type-safe options + typed errors                                              |               ✅ Strict TS               |             ⚠️ Loose             |               n/a               |
| Source maps for transformed files                                             |                    ✅                    |                ⚠️                |               ✅                |
| Standalone CLI (any project)                                                  |            ✅ `tw-obfuscator`            |                ❌                |               ❌                |
| Per-build randomization (no global state)                                     |                    ✅                    |                ❌                |               n/a               |
| Tailwind config validator                                                     |                    ✅                    |                ❌                |               ❌                |
| Active framework coverage                                                     |               **20+ apps**               |                ~5                |               n/a               |

</div>

> [!NOTE]
> **About `tailwindcss-mangle`** — its `tailwindcss-patch@9.0.0` release added Tailwind v4 support via CSS scanning, but the goal is class **mangling for tree-shaking**, not full **obfuscation** (it doesn't rewrite source files end-to-end and has no AST transformer). For a side-by-side technical breakdown see [`/docs/research/tailwindcss-patch.md`](./docs/research/tailwindcss-patch.md).

<!-- ────────────────────────────────────────────────── -->

## ⚡ Performance impact

Real numbers measured on the included test apps (production builds, gzip):

<div align="center">

| App                                 | CSS size before | CSS size after |   Reduction   |
| ----------------------------------- | :-------------: | :------------: | :-----------: |
| `test-vite-react` (small dashboard) |     24.1 KB     |    16.7 KB     | 🟢 **−30.7%** |
| `test-shadcn-ui` (CVA-heavy)        |     47.8 KB     |    28.4 KB     | 🟢 **−40.6%** |
| `test-nextjs` (marketing site)      |     68.9 KB     |    32.1 KB     | 🟢 **−53.4%** |
| `test-nuxt` (blog template)         |     41.2 KB     |    22.8 KB     | 🟢 **−44.7%** |
| `test-static-html` (landing page)   |     18.6 KB     |     8.9 KB     | 🟢 **−52.2%** |

</div>

> [!TIP]
> 💸 The bigger your CSS bundle, the bigger the savings. Apps that ship full Tailwind v3 with `darkMode`, `safelist`, and many variants tend to gain the most.

<!-- ────────────────────────────────────────────────── -->

## 🚀 Quick Start

### 📦 Install

```bash
# pnpm (recommended)
pnpm add tailwindcss-obfuscator

# npm
npm install tailwindcss-obfuscator

# yarn
yarn add tailwindcss-obfuscator

# bun
bun add tailwindcss-obfuscator
```

<details open>
<summary><strong>⚡ &nbsp; Vite</strong> &nbsp;<sub>(React, Vue, Svelte, Solid, Astro, Remix, Qwik)</sub></summary>

```javascript
// vite.config.js
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { tailwindCssObfuscatorVite } from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tailwindCssObfuscatorVite({
      prefix: "tw-",
    }),
  ],
});
```

</details>

<details>
<summary><strong>🚀 &nbsp; Next.js</strong> &nbsp;<sub>(Webpack)</sub></summary>

```javascript
// next.config.js
import { tailwindCssObfuscatorWebpack } from "tailwindcss-obfuscator/webpack";

const nextConfig = {
  webpack: (config, { dev }) => {
    if (!dev) {
      config.plugins.push(
        tailwindCssObfuscatorWebpack({
          prefix: "tw-",
        })
      );
    }
    return config;
  },
};

export default nextConfig;
```

</details>

<details>
<summary><strong>🟢 &nbsp; Nuxt 3</strong></summary>

```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["tailwindcss-obfuscator/nuxt"],
  tailwindcssObfuscator: {
    prefix: "tw-",
  },
});
```

</details>

<details>
<summary><strong>📦 &nbsp; Rollup</strong></summary>

```javascript
// rollup.config.js
import { tailwindCssObfuscatorRollup } from "tailwindcss-obfuscator/rollup";

export default {
  plugins: [tailwindCssObfuscatorRollup({ prefix: "tw-" })],
};
```

</details>

<details>
<summary><strong>⚡ &nbsp; esbuild</strong></summary>

```javascript
// build.js
import * as esbuild from "esbuild";
import { tailwindCssObfuscatorEsbuild } from "tailwindcss-obfuscator/esbuild";

await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  outdir: "dist",
  plugins: [tailwindCssObfuscatorEsbuild({ prefix: "tw-" })],
});
```

</details>

<details>
<summary><strong>🖥️ &nbsp; CLI</strong> &nbsp;<sub>(any build system)</sub></summary>

```bash
# Extract + transform in one shot
npx tw-obfuscator run --build-dir dist

# Preview without writing files
npx tw-obfuscator run --dry-run

# Two-step workflow
npx tw-obfuscator extract
npx tw-obfuscator transform --dir dist

# Inspect a generated mapping
npx tw-obfuscator show --limit 50
```

</details>

> [!TIP]
> 📚 See the [package README](./packages/tailwindcss-obfuscator/README.md) for **all** options, framework recipes, and advanced customization (custom name generators, `preserve.classes`, validators...).

<!-- ────────────────────────────────────────────────── -->

## 🌐 Supported Frameworks

<div align="center">

| Framework                       | Version  | Plugin                                  |  Status   | Test App                                                         |
| ------------------------------- | -------- | --------------------------------------- | :-------: | ---------------------------------------------------------------- |
| ⚛️ &nbsp;**React** (Vite)       | 19       | `tailwindcss-obfuscator/vite`           | 🟢 Tested | [`apps/test-vite-react`](./apps/test-vite-react)                 |
| ▲ &nbsp;**Next.js**             | 16       | `tailwindcss-obfuscator/webpack`        | 🟢 Tested | [`apps/test-nextjs`](./apps/test-nextjs)                         |
| 💚 &nbsp;**Vue** (Vite)         | 3.5      | `tailwindcss-obfuscator/vite`           | 🟢 Tested | [`apps/test-vite-vue`](./apps/test-vite-vue)                     |
| 🟢 &nbsp;**Nuxt**               | 4        | `tailwindcss-obfuscator/nuxt`           | 🟢 Tested | [`apps/test-nuxt`](./apps/test-nuxt)                             |
| 🔥 &nbsp;**SvelteKit / Svelte** | 2.58 / 5 | `tailwindcss-obfuscator/vite`           | 🟢 Tested | [`apps/test-sveltekit`](./apps/test-sveltekit)                   |
| 🟦 &nbsp;**Solid.js**           | 1.9      | `tailwindcss-obfuscator/vite`           | 🟢 Tested | [`apps/test-solidjs`](./apps/test-solidjs)                       |
| 🚀 &nbsp;**Astro**              | 6        | `tailwindcss-obfuscator/vite`           | 🟢 Tested | [`apps/test-astro`](./apps/test-astro)                           |
| 🧭 &nbsp;**React Router** (SSR) | v7       | `tailwindcss-obfuscator/vite`           | 🟢 Tested | [`apps/test-react-router`](./apps/test-react-router)             |
| 🪵 &nbsp;**TanStack Router**    | 1.168    | `tailwindcss-obfuscator/vite`           | 🟢 Tested | [`apps/test-tanstack-start`](./apps/test-tanstack-start)         |
| ⚡ &nbsp;**Qwik**               | 1.19     | `tailwindcss-obfuscator/vite`           | 🟢 Tested | [`apps/test-qwik`](./apps/test-qwik)                             |
| 🎨 &nbsp;**shadcn/ui** (CVA)    | latest   | `tailwindcss-obfuscator/webpack`        | 🟢 Tested | [`apps/test-shadcn-ui`](./apps/test-shadcn-ui)                   |
| 📄 &nbsp;**Static HTML**        | —        | `tailwindcss-obfuscator/esbuild` or CLI | 🟢 Tested | [`apps/test-static-html`](./apps/test-static-html)               |
| 🧰 &nbsp;**Webpack** standalone | 5.106    | `tailwindcss-obfuscator/webpack`        | 🟢 Tested | [`apps/test-webpack-standalone`](./apps/test-webpack-standalone) |
| 📦 &nbsp;**Rollup** standalone  | 4.60     | `tailwindcss-obfuscator/rollup`         | 🟢 Tested | [`apps/test-rollup-standalone`](./apps/test-rollup-standalone)   |

</div>

<!-- ────────────────────────────────────────────────── -->

## 🏛️ Architecture

The obfuscator runs in three phases. Every build tool plugin shares the same core pipeline thanks to a unified [`unplugin`](https://github.com/unjs/unplugin) factory:

```mermaid
flowchart LR
    A[📂 Source files<br/>JSX, Vue, Svelte, HTML, CSS] -->|extract| B[🔍 Extractors<br/>regex + AST]
    B --> C[🗺️ Class Map<br/>Map&lt;original, obfuscated&gt;]
    C -->|transform| D[✏️ Transformers<br/>JSX-AST · PostCSS · HTML]
    D --> E[📦 Output bundle<br/>obfuscated CSS, JS, HTML]
    C -.->|persist| F[💾 .tw-obfuscation/<br/>class-mapping.json]

    style A fill:#1e293b,stroke:#38bdf8,color:#fff
    style B fill:#1e293b,stroke:#10b981,color:#fff
    style C fill:#1e293b,stroke:#eab308,color:#fff
    style D fill:#1e293b,stroke:#f97316,color:#fff
    style E fill:#1e293b,stroke:#8b5cf6,color:#fff
    style F fill:#1e293b,stroke:#64748b,color:#fff
```

<details>
<summary><strong>🧩 &nbsp; Internal module map</strong></summary>

```mermaid
graph TB
    subgraph Plugins[" 🔌 Build tool plugins "]
      Vite["vite.ts"]
      Webpack["webpack.ts"]
      Rollup["rollup.ts"]
      Esbuild["esbuild.ts"]
      Nuxt["nuxt.ts"]
    end

    subgraph Core[" ⚙️ unplugin core "]
      UnPlugin["plugins/core.ts<br/>(shared factory)"]
    end

    subgraph Pipeline[" 🔄 Pipeline "]
      Ctx["core/context.ts<br/>(state)"]
      Extract["extractors/*"]
      Transform["transformers/*"]
      Patterns["core/patterns/*<br/>(regex · variants · validators)"]
      Errors["core/errors.ts<br/>(typed exceptions)"]
    end

    Vite --> UnPlugin
    Webpack --> UnPlugin
    Rollup --> UnPlugin
    Esbuild --> UnPlugin
    Nuxt --> UnPlugin

    UnPlugin --> Ctx
    UnPlugin --> Extract
    UnPlugin --> Transform
    Extract --> Patterns
    Transform --> Patterns
    Ctx --> Errors

    style UnPlugin fill:#06b6d4,color:#fff
    style Patterns fill:#10b981,color:#fff
    style Ctx fill:#eab308,color:#000
    style Errors fill:#ef4444,color:#fff
```

</details>

<details>
<summary><strong>🔍 &nbsp; What gets extracted (per file type)</strong></summary>

| File type                    | Extractor                               | Captures                                                                         |
| ---------------------------- | --------------------------------------- | -------------------------------------------------------------------------------- |
| `.html`, `.htm`              | `extractFromHtml`                       | `class="..."` attributes                                                         |
| `.jsx`, `.tsx`, `.ts`, `.js` | `extractFromJsx`                        | `className="..."`, `class="..."`, `cn()`, `clsx()`, `cva()`, `tv()`, `twMerge()` |
| `.vue`                       | JSX extractor + Vue SFC support         | `class`, `:class`, object syntax, array syntax                                   |
| `.svelte`                    | JSX extractor + Svelte directive parser | `class`, `class:directive`                                                       |
| `.astro`                     | JSX extractor                           | `class`, `class:list`                                                            |
| `.css`                       | `extractFromCss`                        | `.classname` selectors, escaped variants                                         |

</details>

<!-- ────────────────────────────────────────────────── -->

## 📂 Project Structure

```
tailwindcss-obfuscator/
│
├── 📦 packages/
│   └── tailwindcss-obfuscator/      # 🎯 Main npm package (TypeScript)
│       ├── src/
│       │   ├── core/                # 🧠 Context, types, errors, patterns
│       │   ├── extractors/          # 🔍 HTML, JSX, Vue, Svelte, CSS scanners
│       │   ├── transformers/        # ✏️  CSS, HTML, JSX (regex + AST)
│       │   ├── plugins/             # 🔌 unplugin core + bundler adapters
│       │   ├── cli/                 # 🖥️  tw-obfuscator binary
│       │   └── utils/               # 🛠️  Logger
│       └── tests/                   # ✅ 360+ unit + benchmark tests
│
├── 🧪 apps/                         # Integration test apps (17 frameworks)
│   ├── test-vite-react/             # ⚛️  React 19 + Vite 8 + Tailwind v4
│   ├── test-vite-vue/               # 💚 Vue 3.5 + Vite 8 + Tailwind v4
│   ├── test-nextjs/                 # ▲  Next.js 16 + Tailwind v4 (webpack mode)
│   ├── test-nuxt/                   # 🟢 Nuxt 4 + Nitro + Tailwind v4
│   ├── test-sveltekit/              # 🔥 SvelteKit 2.58 + Svelte 5 + Tailwind v4
│   ├── test-astro/                  # 🚀 Astro 6 + Tailwind v4
│   ├── test-solidjs/                # 🟦 Solid.js 1.9 + Vite 8 + Tailwind v4
│   ├── test-react-router/           # 🧭 React Router v7 (ex-Remix) + Tailwind v4
│   ├── test-tanstack-start/         # 🪵 TanStack Router 1.168 + Tailwind v4
│   ├── test-qwik/                   # ⚡ Qwik 1.19 + Tailwind v4
│   ├── test-shadcn-ui/              # 🎨 Next.js 16 + shadcn/ui + CVA
│   ├── test-static-html/            # 📄 Static HTML + esbuild + Tailwind v4
│   ├── test-webpack-standalone/     # 🧰 Webpack 5 standalone (no meta-framework)
│   ├── test-rollup-standalone/      # 📦 Rollup 4 standalone (no meta-framework)
│   ├── test-tailwind-v3/            # 🎨 React + Vite + Tailwind v3
│   ├── test-tailwind-v4/            # 🎨 React + Vite + Tailwind v4
│   ├── tailwind_v3_react_nextjs/    # 🎨 Next.js + Tailwind v3 + shadcn (legacy)
│   └── tailwind_v4_react_nextjs/    # 🎨 Next.js + Tailwind v4 + shadcn
│
├── 📚 docs/                         # VitePress documentation
└── 📋 package.json                  # Root (TurboRepo + pnpm workspaces)
```

<!-- ────────────────────────────────────────────────── -->

## 🛠️ Development

### 🏗️ Setup

```bash
# 1. Install all monorepo dependencies
pnpm install

# 2. Build the main package
pnpm --filter tailwindcss-obfuscator build

# 3. Run the test suite (360+ tests)
pnpm --filter tailwindcss-obfuscator test
```

### 🧰 Common commands

<div align="center">

| Command                                                          | Description                                 |
| ---------------------------------------------------------------- | ------------------------------------------- |
| 🔁 &nbsp;`pnpm dev`                                              | Start every app in dev mode (via Turbo)     |
| 🏗️ &nbsp;`pnpm build`                                            | Build every app with obfuscation enabled    |
| ✅ &nbsp;`pnpm test`                                             | Run the full test suite                     |
| 📊 &nbsp;`pnpm --filter tailwindcss-obfuscator bench`            | Run performance benchmarks                  |
| 🚦 &nbsp;`pnpm --filter tailwindcss-obfuscator test:integration` | Build every test app and verify obfuscation |
| 🔍 &nbsp;`pnpm lint`                                             | Lint with ESLint                            |
| 💅 &nbsp;`pnpm format`                                           | Format with Prettier                        |

</div>

### 🧪 Per-app commands

```bash
# 🎯 Run a specific test app
pnpm --filter test-vite-react dev
pnpm --filter test-nextjs dev
pnpm --filter test-sveltekit dev

# 🏗️ Build a specific app
pnpm --filter test-vite-react build
```

<!-- ────────────────────────────────────────────────── -->

## 🎨 Tailwind CSS Version Support

### 🆕 Tailwind v4 — CSS-first

```css
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --font-display: "Inter", sans-serif;
}
```

- ✅ Works with `@tailwindcss/vite` and `@tailwindcss/postcss`
- ✅ `@theme` directive support
- ✅ Container queries (`@container`, `@lg:`)
- ✅ `@starting-style`, `nth-*`, wildcards
- ✅ CSS variable shorthand `bg-(--my-var)`

### 🧱 Tailwind v3 — Config file

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
};
```

- ✅ PostCSS-based processing
- ✅ Full v3 plugin compatibility
- ✅ Drop-in for existing projects
- ✅ JIT mode supported
- ✅ Custom variants & arbitrary values

<!-- ────────────────────────────────────────────────── -->

## ⚠️ Important: Static Classes Only

> [!WARNING]
> 🚨 For obfuscation to work, **classes must be complete static strings**. The obfuscator scans your source code at build time to construct the rename table — it cannot follow runtime string concatenation or dynamic interpolation.

### ✅ Good — Will be obfuscated

```jsx
<div className="bg-blue-500 hover:bg-blue-700">

<div className={isActive ? "bg-blue-500" : "bg-gray-500"}>

<div className={cn("flex", "items-center")}>

<div className={clsx("p-4", isError && "bg-red-500")}>

<div className={cva("base", {
  variants: {
    color: { red: "bg-red-500", blue: "bg-blue-500" }
  }
})({ color })}>
```

### ❌ Bad — Will NOT be obfuscated

```jsx
<div className={`bg-${color}-500`}>

<div className={"bg-" + color + "-500"}>

<div className={`text-${size}xl`}>

<div className={getColorClass(color)}>

// Dynamic from variable — opaque to the scanner
const cls = generateClassName();
<div className={cls}>
```

### 🧰 Supported class utility helpers

The following helpers are recognized natively — string arguments inside them are scanned and obfuscated:

<div align="center">

| Helper                                   | Library                  |
| ---------------------------------------- | ------------------------ |
| 🎨 &nbsp;`cn()`                          | shadcn/ui                |
| 🎨 &nbsp;`clsx()`                        | clsx                     |
| 🎨 &nbsp;`classnames()` / `classNames()` | classnames               |
| 🎨 &nbsp;`twMerge()`                     | tailwind-merge           |
| 🎨 &nbsp;`cva()`                         | class-variance-authority |
| 🎨 &nbsp;`tv()`                          | tailwind-variants        |

</div>

> [!TIP]
> 🎛️ Need to recognize a custom helper (`myClass()`, `tw()`, ...) ? Add its name to `preserve.functions` and the AST extractor will pick up the string arguments.

<!-- ────────────────────────────────────────────────── -->

## 🗺️ Roadmap

<div align="center">

| Status | Item                                                         |
| :----: | ------------------------------------------------------------ |
|   ✅   | Tailwind v3 + v4 support                                     |
|   ✅   | Unified `unplugin` core for Vite/Webpack/Rollup/esbuild      |
|   ✅   | AST-based JSX/TSX transformer                                |
|   ✅   | PostCSS-based CSS transformer with native source maps        |
|   ✅   | Typed error hierarchy + structured logging                   |
|   ✅   | Tailwind config validator                                    |
|   ✅   | Standalone CLI with `extract` / `transform` / `run` / `show` |
|   🚧   | Hot Module Replacement (HMR) preview mode                    |
|   🚧   | Online playground (paste a snippet, see the rename)          |
|   🔮   | Browser extension to deobfuscate live for debugging          |
|   🔮   | Migration codemod from `tailwindcss-mangle`                  |

</div>

✅ Done &nbsp;·&nbsp; 🚧 In progress &nbsp;·&nbsp; 🔮 Considered

<!-- ────────────────────────────────────────────────── -->

## 📚 Documentation & Resources

<table>
<tr>
<td width="33%" align="center">

### 📖

**[Package README](./packages/tailwindcss-obfuscator/README.md)**

Complete API reference, every option, advanced customization

</td>
<td width="33%" align="center">

### 📁

**[Documentation site](./docs/)**

Framework guides, migration tips, FAQ

</td>
<td width="33%" align="center">

### 💡

**[Example apps](./apps/)**

20+ working examples, one per supported framework

</td>
</tr>
</table>

<!-- ────────────────────────────────────────────────── -->

## 🤝 Contributing

Contributions are very welcome! Whether it's:

- 🐛 &nbsp;**Reporting a bug** → [Open an issue](https://github.com/josedacosta/tailwindcss-obfuscator/issues/new)
- 💡 &nbsp;**Suggesting a feature** → [Open a discussion](https://github.com/josedacosta/tailwindcss-obfuscator/discussions)
- 🔧 &nbsp;**Adding a framework adapter** → Send a PR with a matching `apps/test-*`
- 📝 &nbsp;**Improving the docs** → They live in [`docs/`](./docs/)

<details>
<summary><strong>📋 &nbsp; Contribution checklist</strong></summary>

- [ ] `pnpm test` passes (360+ tests)
- [ ] `pnpm typecheck` is clean
- [ ] `pnpm lint` is clean
- [ ] Public API changes are documented
- [ ] If you add a framework: include a working `apps/test-<framework>/` integration

</details>

<!-- ────────────────────────────────────────────────── -->

## 🖼️ Brand Assets

Official logos for your projects, articles, and presentations:

<table>
<tr>
<th>Variant</th>
<th>☀️ &nbsp;Light Background</th>
<th>🌙 &nbsp;Dark Background</th>
</tr>
<tr>
<td align="center"><strong>Horizontal</strong></td>
<td align="center"><img src="./docs/public/images/tailwindcss-obfuscator/logo-horizontal.svg" width="220"></td>
<td align="center" bgcolor="#000000"><img src="./docs/public/images/tailwindcss-obfuscator/logo-horizontal-white.svg" width="220"></td>
</tr>
<tr>
<td align="center"><strong>Square</strong></td>
<td align="center"><img src="./docs/public/images/tailwindcss-obfuscator/logo-square.svg" width="80"></td>
<td align="center" bgcolor="#000000"><img src="./docs/public/images/tailwindcss-obfuscator/logo-square-white.svg" width="80"></td>
</tr>
</table>

<!-- ────────────────────────────────────────────────── -->

## ❓ FAQ

<details>
<summary><strong>🤔 &nbsp; Will obfuscation break my dev server?</strong></summary>

No — obfuscation is **disabled in development by default**. It only runs when `command === "build"` (Vite) or `mode === "production"` (Webpack/Next.js). Set `refresh: true` if you want it on in dev too.

</details>

<details>
<summary><strong>🐛 &nbsp; How do I debug an obfuscated bundle?</strong></summary>

Two options:

1. The class mapping is saved to `.tw-obfuscation/class-mapping.json` — open it to translate any `tw-xxx` back to its original.
2. Set `randomize: false` to get deterministic, sequential names (`tw-a`, `tw-b`, `tw-c`...) that are easier to track between builds.

</details>

<details>
<summary><strong>⚙️ &nbsp; Can I customize how obfuscated names are generated?</strong></summary>

Yes — pass a `classGenerator` function:

```javascript
tailwindCssObfuscatorVite({
  classGenerator: (index, originalClass) => `c${index.toString(36)}`,
});
```

</details>

<details>
<summary><strong>🚫 &nbsp; How do I keep certain classes un-obfuscated?</strong></summary>

```javascript
tailwindCssObfuscatorVite({
  preserve: {
    classes: ["dark", "light", "sr-only"], // never rename these
    functions: ["debugClass", "analytics"], // skip strings inside these calls
  },
});
```

</details>

<details>
<summary><strong>🆕 &nbsp; Does it work with Tailwind v4?</strong></summary>

Yes — full v4 support, including `@theme`, container queries, `@starting-style`, the `*:` / `**:` wildcard selectors, and the new `bg-(--my-var)` CSS-variable shorthand.

</details>

<details>
<summary><strong>🔌 &nbsp; My bundler isn't listed — can I still use it?</strong></summary>

Yes! The package exposes the underlying [`unplugin`](https://github.com/unjs/unplugin) factory at `tailwindcss-obfuscator/internals`:

```javascript
import { obfuscatorUnplugin } from "tailwindcss-obfuscator/internals";
// obfuscatorUnplugin.farm, obfuscatorUnplugin.rspack, ...
```

Or use the standalone CLI as a post-build step.

</details>

<!-- ────────────────────────────────────────────────── -->

## 👤 Author

Built and maintained by **José DA COSTA**.

<table>
<tr>
<td>🌐 Website</td>
<td><a href="https://www.josedacosta.info">josedacosta.info</a></td>
</tr>
<tr>
<td>🐙 GitHub</td>
<td><a href="https://github.com/josedacosta">@josedacosta</a></td>
</tr>
<tr>
<td>✉️ Email</td>
<td><a href="mailto:contact@josedacosta.info">contact@josedacosta.info</a></td>
</tr>
<tr>
<td>💖 Sponsor</td>
<td><a href="https://github.com/sponsors/josedacosta">github.com/sponsors/josedacosta</a></td>
</tr>
</table>

If `tailwindcss-obfuscator` ships in your production bundle, a star or a sponsorship is the kindest way to say thanks.

<!-- ────────────────────────────────────────────────── -->

## 📄 License

[MIT](./LICENSE) © [José DA COSTA](https://github.com/josedacosta)

<!-- ────────────────────────────────────────────────── -->

<br />

<div align="center">

### 💖 Star History

<a href="https://star-history.com/#josedacosta/tailwindcss-obfuscator&Date">
  <img src="https://api.star-history.com/svg?repos=josedacosta/tailwindcss-obfuscator&type=Date" alt="Star History Chart" width="600">
</a>

<br /><br />

---

<sub>Built with ❤️ for the Tailwind community</sub>

<br />

⭐ &nbsp; **If this library helps you protect your design system, give it a star!** &nbsp; ⭐

<br />

<a href="#-tailwind-css-obfuscator">
  <kbd> ⬆️ &nbsp; Back to top &nbsp; </kbd>
</a>

</div>
