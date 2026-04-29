<div align="center">

<br /><br />

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
<!-- Downloads badge intentionally omitted while npm aggregates stats for the fresh v2.0.0
     publish (~24-48h). Re-add `npm/dm` here once https://api.npmjs.org/downloads returns
     non-zero. Until then, the install-command badge below carries the same call-to-action. -->
<p>
  <a href="https://www.npmjs.com/package/tailwindcss-obfuscator">
    <img alt="npm version" src="https://img.shields.io/npm/v/tailwindcss-obfuscator.svg?style=for-the-badge&logo=npm&color=cb3837&labelColor=000000">
  </a>
  <a href="https://www.npmjs.com/package/tailwindcss-obfuscator">
    <img alt="npm install" src="https://img.shields.io/badge/npm%20i-tailwindcss--obfuscator-cb3837?style=for-the-badge&logo=npm&logoColor=white&labelColor=000000">
  </a>
  <a href="https://www.npmjs.com/package/tailwindcss-obfuscator">
    <img alt="TypeScript types" src="https://img.shields.io/npm/types/tailwindcss-obfuscator?style=for-the-badge&logo=typescript&logoColor=white&color=3178c6&labelColor=000000">
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

<!-- Badges row 4 — security & supply chain -->
<p>
  <a href="https://www.bestpractices.dev/projects/12705">
    <img alt="OpenSSF Best Practices" src="https://www.bestpractices.dev/projects/12705/badge">
  </a>
  <a href="https://scorecard.dev/viewer/?uri=github.com/josedacosta/tailwindcss-obfuscator">
    <img alt="OpenSSF Scorecard" src="https://img.shields.io/ossf-scorecard/github.com/josedacosta/tailwindcss-obfuscator?style=for-the-badge&label=OpenSSF%20Scorecard&color=10b981&labelColor=000000">
  </a>
  <a href="https://github.com/josedacosta/tailwindcss-obfuscator/security">
    <img alt="CodeQL" src="https://img.shields.io/badge/CodeQL-active-10b981?style=for-the-badge&logo=github&logoColor=white&labelColor=000000">
  </a>
  <a href="https://www.npmjs.com/package/tailwindcss-obfuscator">
    <img alt="npm provenance" src="https://img.shields.io/badge/npm-provenance-cb3837?style=for-the-badge&logo=npm&logoColor=white&labelColor=000000">
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

## 📖 Documentation

<div align="center">

### 👉 [**josedacosta.github.io/tailwindcss-obfuscator**](https://josedacosta.github.io/tailwindcss-obfuscator/) 👈

Setup guide for every framework · complete options reference · the patterns that obfuscate (and the ones that don't) · maintainers' checklist · comparison with `tailwindcss-mangle`.

| 🌐 [**Live docs site**](https://josedacosta.github.io/tailwindcss-obfuscator/) | 📂 [Docs source on GitHub](./docs/) |
| ------------------------------------------------------------------------------ | ----------------------------------- |
| Hosted on GitHub Pages, rebuilt on every push to `main`                        | Edit a page, open a PR              |

</div>

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

There are a handful of class-mangling tools out there. Here's how this one stacks up against every active competitor — `tailwindcss-mangle`, `Obfustail`, PostCSS minifiers, and Tailwind itself:

<div align="center">

| Capability                                                            | 🛡️&nbsp;**tailwindcss-obfuscator** | 🔧&nbsp;tailwindcss-mangle |        🌐&nbsp;Obfustail        | ⚙️&nbsp;PostCSS minifiers | 🅒&nbsp;Tailwind CSS itself |
| --------------------------------------------------------------------- | :--------------------------------: | :------------------------: | :-----------------------------: | :-----------------------: | :------------------------: |
| Tailwind v4 (CSS-first) support                                       |             ✅ Native              |    ✅ via CSS scan (v9)    |           ✅ v4 only            |            n/a            |             ✅             |
| Tailwind v3 (config-file) support                                     |                 ✅                 |             ✅             |               ❌                |            n/a            |             ✅             |
| Renames classes (HTML / JS / CSS)                                     |                 ✅                 |             ✅             |               ✅                |            ❌             |             ❌             |
| Doesn't modify your source files                                      |                 ✅                 |             ✅             |      ❌ rewrites in place       |            ✅             |             ✅             |
| Per-utility obfuscation (vs. per-string)                              |                 ✅                 |             ✅             |       ❌ per-full-string        |            n/a            |            n/a             |
| Unified `unplugin` core (Vite/Webpack/Rollup/esbuild/Rspack/Farm)     |             ✅ All six             |   ⚠️ Vite + Webpack only   |      ❌ build-time script       |            ❌             |             ❌             |
| AST-based JSX/TSX transformer                                         |              ✅ Babel              |          ⚠️ Regex          |            ❌ Regex             |            n/a            |            n/a             |
| Vue SFC + Svelte `class:` directive                                   |                 ✅                 |         ⚠️ Partial         |               ❌                |            n/a            |            n/a             |
| `cn()` / `clsx()` / `classnames()` / `twMerge()` / `cva()` / `tv()`   |             ✅ All six             |           ⚠️ Two           |      ❌ Manual `safelist`       |            ❌             |             ❌             |
| Type-safe options + typed errors                                      |            ✅ Strict TS            |          ⚠️ Loose          |           ❌ Pure JS            |            n/a            |            n/a             |
| Source maps for transformed files                                     |                 ✅                 |             ⚠️             |               ❌                |            ✅             |             ✅             |
| Reversible mapping file emitted                                       |                 ✅                 |             ✅             |               ✅                |            ❌             |             ❌             |
| Standalone CLI (any project)                                          |         ✅ `tw-obfuscator`         |       ✅ `tw-patch`        |      ❌ inline node script      |            ✅             |             ✅             |
| Per-build randomization (no global state)                             |                 ✅                 |             ❌             |               ✅                |            n/a            |            n/a             |
| Tailwind config validator                                             |                 ✅                 |             ❌             |               ❌                |            ❌             |             ❌             |
| Active framework coverage                                             |            **20+ apps**            |             ~5             |           1 (Next.js)           |            n/a            |            n/a             |
| **Unquoted HTML attributes** (`class=foo`, HTML5 spec)                |          ✅ since v2.0.1           |             ❌             |               ❌                |            n/a            |            n/a             |
| **Next.js Turbopack** (post-build CLI workaround documented + tested) |          ✅ since v2.0.1           |             ❌             | ⚠️ accidental (Next.js + Turbo) |            n/a            |            n/a             |
| **npm publish with provenance** (Sigstore / OIDC attestation)         |                 ✅                 |             ❌             |               ❌                |          varies           |            n/a             |
| **OpenSSF Scorecard published**                                       |             ✅ weekly              |             ❌             |               ❌                |            n/a            |            n/a             |
| **SBOM (SPDX-JSON) attached to every GitHub release**                 |                 ✅                 |             ❌             |               ❌                |            n/a            |            n/a             |

</div>

> [!NOTE]
> 📊 **Want the methodology, version numbers, and per-tool deep-dive?** See the [full comparison page](https://josedacosta.github.io/tailwindcss-obfuscator/research/comparison) — every cell above is sourced from the latest release of each project (April 2026).

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

# 3. Run the test suite (395 tests at v2.0.1, growing)
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

**[Documentation site](https://josedacosta.github.io/tailwindcss-obfuscator/)**

Framework guides, migration tips, FAQ

</td>
<td width="33%" align="center">

### 💡

**[Example apps](./apps/)**

13+ working examples, one per supported framework

</td>
</tr>
</table>

<!-- ────────────────────────────────────────────────── -->

<div align="center">

## 🤝 Contribute to this project — every PR is read

[![Good first issues](https://img.shields.io/github/issues/josedacosta/tailwindcss-obfuscator/good%20first%20issue?style=for-the-badge&label=good%20first%20issues&color=7057ff&labelColor=000000)](https://github.com/josedacosta/tailwindcss-obfuscator/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
[![Help wanted](https://img.shields.io/github/issues/josedacosta/tailwindcss-obfuscator/help%20wanted?style=for-the-badge&label=help%20wanted&color=008672&labelColor=000000)](https://github.com/josedacosta/tailwindcss-obfuscator/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
[![Discussions](https://img.shields.io/github/discussions/josedacosta/tailwindcss-obfuscator?style=for-the-badge&logo=github&color=ec4899&labelColor=000000)](https://github.com/josedacosta/tailwindcss-obfuscator/discussions)
[![Contributors](https://img.shields.io/github/contributors/josedacosta/tailwindcss-obfuscator?style=for-the-badge&logo=github&color=10b981&labelColor=000000)](https://github.com/josedacosta/tailwindcss-obfuscator/graphs/contributors)

</div>

> **Open-source, community-driven, MIT-licensed.** This library exists because every PR — bug fix, framework adapter, doc tweak, typo correction — moves it forward. The maintainer reviews every contribution personally and aims for a first response within a week.

### How you can help (pick what fits your time)

<table>
<tr>
<td valign="top" width="33%" align="center">

### 🐛

**Report a bug**

15-30 minutes

[Open a bug report](https://github.com/josedacosta/tailwindcss-obfuscator/issues/new?template=bug_report.yml) with a minimal repro (CodeSandbox or a tiny GitHub repo). Repros are gold.

</td>
<td valign="top" width="33%" align="center">

### 💡

**Suggest a feature**

10 minutes

[Start a discussion](https://github.com/josedacosta/tailwindcss-obfuscator/discussions/new?category=ideas) before sending a big PR. Small features can go straight to a [feature request](https://github.com/josedacosta/tailwindcss-obfuscator/issues/new?template=feature_request.yml).

</td>
<td valign="top" width="33%" align="center">

### 📝

**Polish the docs**

15 minutes

Spotted a typo, an unclear sentence, an outdated framework version? Edit any page on [the live docs site](https://josedacosta.github.io/tailwindcss-obfuscator/) — every page has an "Edit on GitHub" link.

</td>
</tr>
<tr>
<td valign="top" width="33%" align="center">

### 🧩

**Add a framework adapter**

2-4 hours

The shared `unplugin` core makes new bundlers cheap to add. See the [framework-adapter guide](https://github.com/josedacosta/tailwindcss-obfuscator/blob/main/CONTRIBUTING.md#-adding-a-new-framework-adapter).

</td>
<td valign="top" width="33%" align="center">

### 🔧

**Fix a `good first issue`**

30 min – 2 hours

[Browse issues tagged `good first issue`](https://github.com/josedacosta/tailwindcss-obfuscator/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) — they come with a clear description and an estimated complexity.

</td>
<td valign="top" width="33%" align="center">

### 🌐

**Translate the docs**

ongoing

The site supports i18n via VitePress. Open a discussion if you'd like to lead a locale (FR, ES, DE, JA, ZH, …).

</td>
</tr>
</table>

### What to expect when you open a PR

1. **Branch protection forces every change through a PR.** No direct push to `main`, even for the maintainer.
2. **Five layers of automated review** run on your PR (CI, CodeQL, CodeRabbit AI, GitHub Copilot Code Review, auto-labels) — they post comments only, none of them can approve or merge.
3. **The maintainer reads your PR personally.** First response within ~a week. Reviews focus on: public-API stability, test coverage, docs updates. Cosmetics come last.
4. **Squash-merge once approved + CI green.** Your contribution is credited in the next release's CHANGELOG via the Changesets entry you added with `pnpm changeset`.
5. **Releases are batched.** Your change ships on `main` immediately (and to the docs site), but the npm version bump waits until the maintainer cuts a release — usually within days, sometimes weeks. This keeps version numbers meaningful.

> 📖 **Full guide for contributors → [`CONTRIBUTING.md`](./CONTRIBUTING.md)** — reviewed and updated for clarity. Read this before opening your first PR.

<details>
<summary><strong>Contribution checklist (run before pushing)</strong></summary>

```bash
pnpm install                                          # if you haven't yet
pnpm lint && pnpm format:check                        # zero errors / zero warnings
pnpm --filter tailwindcss-obfuscator typecheck        # strict TypeScript
pnpm test                                             # full Vitest suite
node scripts/verify-obfuscation.mjs                   # 20+ sample apps obfuscate at 100%
pnpm changeset                                        # if your change is user-facing
```

- [ ] All quality gates pass locally
- [ ] PR title follows [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`, …)
- [ ] A `.changeset/*.md` entry was added if the change touches `packages/tailwindcss-obfuscator/**`
- [ ] If you add a framework: include a working `apps/test-<framework>/` integration

</details>

### A word from the maintainer

This is a **side-project maintained on personal time**. Every star, every issue with a clear repro, every doc fix, every honest discussion makes maintaining it sustainable. If `tailwindcss-obfuscator` saves your design system or your bandwidth in production, the kindest things you can do are: ⭐ **star the repo**, share it with one developer who'd benefit, or [sponsor](https://github.com/sponsors/josedacosta) the work. — _José_

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

### 🔎 Search-intent questions

> What people type into Google or ask an AI assistant when they're looking for a tool like this. Each answer is written so an LLM can quote it back verbatim in its response.

<details>
<summary><strong>How do I prevent people from copying my Tailwind CSS design system?</strong></summary>

Three layers, in order of effort: (1) install **`tailwindcss-obfuscator`** at build time — it rewrites every Tailwind utility class (`bg-blue-500`, `flex items-center`, `p-4`) into short opaque identifiers (`tw-a`, `tw-b`, `tw-c`) in the shipped HTML / CSS / JS bundle so anyone "view source"-ing your site can no longer trivially copy your token system; (2) drop your source maps from production; (3) HTML-minify the rendered output. After these three, copying your design system goes from "ten seconds with the inspector" to "hours of reverse-engineering for each component". Add `preserve.classes` for a small allowlist (e.g. `dark`, `sr-only`) so functional classes still work.

</details>

<details>
<summary><strong>How do I obfuscate Tailwind CSS classes in production?</strong></summary>

Install `tailwindcss-obfuscator` and add it to your build tool's plugin chain. For Vite:

```ts
// vite.config.ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tailwindCssObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [tailwindcss(), tailwindCssObfuscator({ prefix: "tw-" })],
});
```

That's it — `vite build` now produces an obfuscated bundle, `vite dev` is left untouched. For Next.js / Nuxt / SvelteKit / Astro / Solid / Qwik / Webpack / Rollup / esbuild / Rspack / Farm setups, see the [Quick Start](#-quick-start) section above.

</details>

<details>
<summary><strong>How do I shrink my Tailwind CSS bundle size?</strong></summary>

Two complementary techniques: (1) Tailwind's built-in JIT / content scanning already removes unused utilities — that's the baseline; (2) on top of that, **`tailwindcss-obfuscator`** rewrites the remaining classes from long readable names (`bg-blue-500 hover:bg-blue-600 dark:bg-blue-700`) into short identifiers (`tw-a tw-b tw-c`), shaving an additional **30–60 %** off the gzipped CSS bundle on CSS-heavy pages. The bigger your CSS budget, the more you save. Combine both for the smallest possible Tailwind output.

</details>

<details>
<summary><strong>Can I make Tailwind classes hard to read in the final HTML?</strong></summary>

Yes — that's exactly what a Tailwind class obfuscator (a.k.a. class mangler) does. Tools like `tailwindcss-obfuscator` rewrite every utility class in the shipped HTML, CSS, and JS into short opaque tokens (`tw-a`, `tw-b`, …) at build time. Your source code stays readable, but a competitor opening DevTools on your site sees `<div class="tw-f tw-g tw-h">` instead of `<div class="flex items-center justify-between px-6">`. Reverse-engineering your design system goes from minutes to hours.

</details>

<details>
<summary><strong>How do I install a Tailwind class mangler in Next.js / Vite / Nuxt / SvelteKit?</strong></summary>

`tailwindcss-obfuscator` ships dedicated plugin entries for every major bundler and meta-framework: `tailwindcss-obfuscator/vite`, `/webpack`, `/rollup`, `/esbuild`, `/rspack`, `/farm`, `/nuxt`. Pick the one that matches your build tool, add it to the plugin chain, and the obfuscation runs automatically on `npm run build` (no effect on dev). The full setup snippet for each framework is in the [Quick Start](#-quick-start) section above and in the [framework guides](https://josedacosta.github.io/tailwindcss-obfuscator/guide/getting-started).

</details>

<details>
<summary><strong>Does Tailwind CSS itself have a built-in way to obfuscate classes?</strong></summary>

No — Tailwind Labs has explicitly chosen not to ship a class-mangling pass upstream (see [discussion #7956](https://github.com/tailwindlabs/tailwindcss/discussions/7956)). You need a third-party tool for it. The two active options are `tailwindcss-obfuscator` (this project — AST-based, every modern bundler, built around obfuscation) and `tailwindcss-mangle` (mangling for tree-shaking, Vite + Webpack only). See the [full comparison](https://josedacosta.github.io/tailwindcss-obfuscator/research/comparison) for the trade-offs.

</details>

<details>
<summary><strong>Will obfuscating Tailwind break my dark mode, hover states, or responsive breakpoints?</strong></summary>

No. The obfuscator rewrites the **class names** consistently across CSS selectors AND every `class=` / `className=` reference in your bundle — so `dark:bg-gray-900`, `hover:bg-blue-600`, `md:flex`, `2xl:grid-cols-4` all keep working: the variant and the base class are renamed together as a single unit. Your site behaves exactly the same in production, just with shorter class names.

</details>

<details>
<summary><strong>Does it work with shadcn/ui, class-variance-authority (CVA), or Tailwind Variants (tv)?</strong></summary>

Yes — out of the box. The AST-based extractor recognises `cn()`, `clsx()`, `classnames()`, `twMerge()`, `cva()`, and `tv()` natively, including string literals nested inside `variants`, `compoundVariants`, `defaultVariants`, and slot definitions. The included `apps/test-shadcn-ui` sample app exercises the full shadcn/ui + CVA pattern under a production build to prove it.

</details>

<details>
<summary><strong>How do I add build-time CSS class shortening to my React app?</strong></summary>

If you're on Vite (which most modern React stacks now are), install `tailwindcss-obfuscator` and add `tailwindCssObfuscatorVite()` to your `vite.config.ts` plugins array. If you're on Next.js (Webpack), add `tailwindCssObfuscatorWebpack()` to the `webpack` config in `next.config.js`. The full snippets for both are in the [Quick Start](#-quick-start) section above. The obfuscator only runs on `next build` / `vite build`, so dev mode stays normal.

</details>

<details>
<summary><strong>How do I reverse-engineer-protect my CSS design system before launching publicly?</strong></summary>

(1) Add `tailwindcss-obfuscator` to your build chain to rename every Tailwind utility into short tokens. (2) Disable source-map publishing in production. (3) Run an HTML minifier so attribute order and whitespace don't leak structural intent. (4) If you use a custom design-token CSS file, gate it behind a `preserve.classes` allowlist so only the classes you intentionally expose stay readable. The combination won't make your CSS uncrackable, but it raises the bar from "copy-paste in five minutes" to "rebuild from scratch in five hours".

</details>

### 📦 General questions about the library

> Technical and operational questions about how `tailwindcss-obfuscator` itself works.

<details>
<summary><strong>What is a Tailwind CSS obfuscator?</strong></summary>

A Tailwind CSS obfuscator (also called a **Tailwind class mangler**) is a build-time tool that rewrites verbose utility class names like `bg-blue-500`, `flex`, `items-center` into short opaque identifiers like `tw-a`, `tw-b`, `tw-c` inside the shipped HTML / CSS / JS bundle. Source code stays readable — only production output is changed. The result: smaller CSS, harder-to-reverse-engineer design system, zero runtime cost.

</details>

<details>
<summary><strong>How much does it shrink my CSS bundle?</strong></summary>

Typical savings on production builds (gzip): **30–60%** on CSS-heavy pages. Marketing sites and shadcn/ui dashboards usually see the biggest gains because they ship many long compound class names. See the [Performance impact](#-performance-impact) table above for measurements on the 14 included test apps.

</details>

<details>
<summary><strong>How is this different from <code>tailwindcss-mangle</code>?</strong></summary>

`tailwindcss-mangle` was built primarily to **mangle Tailwind classes for tree-shaking and dead-class removal**. `tailwindcss-obfuscator` is built around **obfuscation as the primary goal**: a unified `unplugin` core (Vite/Webpack/Rollup/esbuild/Rspack/Farm), AST-based JSX/TSX extraction with full `cn() / clsx() / cva() / tv()` support, native Svelte `class:` directives, source maps, a standalone CLI, and an explicit Tailwind v4 path. See the [comparison](#-why-this-library) table.

</details>

<details>
<summary><strong>Does it work with Tailwind CSS v4?</strong></summary>

Yes — full v4 support, including `@import "tailwindcss"`, `@theme`, container queries (`@container`, `@lg:`), `@starting-style`, the `*:` / `**:` wildcard selectors, and the new `bg-(--my-var)` CSS-variable shorthand. v3 is also fully supported (config file, JIT, `safelist`, custom variants).

</details>

<details>
<summary><strong>Does it work with Next.js / Nuxt / SvelteKit / Astro / Solid / Qwik / Remix?</strong></summary>

Yes — every major meta-framework is supported and has a dedicated test app under [`apps/`](./apps/): Next.js (App Router + Pages Router), Nuxt 4, SvelteKit + Svelte 5, Astro 6, Solid.js 1.9, Qwik 1.19, React Router v7 (ex-Remix), TanStack Start. Use the matching plugin entry from the [Quick Start](#-quick-start) section.

</details>

<details>
<summary><strong>Will obfuscation break my dev server?</strong></summary>

No — obfuscation is **disabled in development by default**. It only runs when `command === "build"` (Vite) or `mode === "production"` (Webpack/Next.js). Set `refresh: true` if you want it on in dev too.

</details>

<details>
<summary><strong>How do I debug an obfuscated bundle?</strong></summary>

Two options:

1. The class mapping is saved to `.tw-obfuscation/class-mapping.json` — open it to translate any `tw-xxx` back to its original.
2. Set `randomize: false` to get deterministic, sequential names (`tw-a`, `tw-b`, `tw-c`...) that are easier to track between builds.

</details>

<details>
<summary><strong>Can I customize how obfuscated names are generated?</strong></summary>

Yes — pass a `classGenerator` function:

```javascript
tailwindCssObfuscatorVite({
  classGenerator: (index, originalClass) => `c${index.toString(36)}`,
});
```

</details>

<details>
<summary><strong>How do I keep certain classes un-obfuscated?</strong></summary>

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
<summary><strong>Does it work with shadcn/ui, CVA and Tailwind Variants?</strong></summary>

Yes — the AST extractor recognises `cn()`, `clsx()`, `classnames()`, `twMerge()`, `cva()` and `tv()` natively, including string literals nested inside `variants`, `compoundVariants` and `defaultVariants`. The dedicated [`apps/test-shadcn-ui`](./apps/test-shadcn-ui) sample app exercises the full shadcn/ui + CVA pattern under production build.

</details>

<details>
<summary><strong>Is the transformation reversible? Can I deobfuscate later?</strong></summary>

Yes — every build emits `.tw-obfuscation/class-mapping.json`, a deterministic `original → obfuscated` mapping. Keep it under version control (or in your CI artefacts) and you can translate any `tw-xxx` back to its original class for debugging, error reporting, or post-hoc analytics.

</details>

<details>
<summary><strong>Is class obfuscation enough to "protect" my design system?</strong></summary>

Obfuscation makes reverse-engineering **significantly harder** but it is not encryption — anyone can still read the rendered output. Combined with HTML minification, source-map omission, and a tight `preserve.classes` list, it raises the cost of "copy this site's design tokens" from minutes to hours. Treat it as one layer of defence, not a guarantee.

</details>

<details>
<summary><strong>Why are my dynamic classes not being obfuscated?</strong></summary>

Because they are not visible to the AST scanner at build time. Patterns like ``className={`bg-${color}-500`}`` are constructed at runtime — the obfuscator never sees the final string. Switch to a static ternary (`color === "red" ? "bg-red-500" : "bg-blue-500"`) or a `cn()` call with all branches spelled out. See the [Static Classes Only](#️-important-static-classes-only) section.

</details>

<details>
<summary><strong>My bundler isn't listed — can I still use it?</strong></summary>

Yes! The package exposes the underlying [`unplugin`](https://github.com/unjs/unplugin) factory at `tailwindcss-obfuscator/internals`:

```javascript
import { obfuscatorUnplugin } from "tailwindcss-obfuscator/internals";
// obfuscatorUnplugin.farm, obfuscatorUnplugin.rspack, ...
```

Or use the standalone CLI as a post-build step.

</details>

<details>
<summary><strong>Is it free? What's the licence?</strong></summary>

Yes — **MIT licensed**, free for personal, commercial, and closed-source use. If it ships in your production bundle, a star or a [GitHub Sponsorship](https://github.com/sponsors/josedacosta) is the kindest way to say thanks.

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

## 🔎 Keywords & search terms

<details>
<summary><strong>🔍 &nbsp; What people search for when they need this library</strong></summary>

<br />

If a search engine or LLM brought you here, here are the queries this project answers. Use them to verify it fits your use case — and to help others find it.

**Core intent**

`tailwindcss obfuscator` · `tailwind css obfuscator` · `tailwind obfuscator` · `obfuscate tailwind classes` · `obfuscate tailwind css` · `tailwind class obfuscation` · `obfuscate tailwind utility classes` · `hide tailwind classes` · `protect tailwind design system` · `tailwind reverse engineering protection` · `make tailwind classes unreadable`

**Mangling alternatives**

`tailwind mangle` · `tailwindcss mangle` · `tailwind class mangler` · `tailwindcss-mangle alternative` · `unplugin-tailwindcss-mangle alternative` · `tailwindcss-patch alternative` · `tailwindcss-mangle vs obfuscator` · `tailwindcss-mangle tailwind v4`

**Bundle size**

`shrink tailwind css bundle` · `reduce tailwind css size` · `tailwind css minifier` · `tailwind class shortener` · `smaller tailwind bundle` · `tailwind css bundle 30%` · `tailwind css bundle 50%` · `optimize tailwind css production`

**Bundlers**

`tailwind vite plugin obfuscate` · `tailwind webpack plugin obfuscate` · `tailwind rollup plugin obfuscate` · `tailwind esbuild plugin obfuscate` · `tailwind rspack plugin` · `tailwind farm plugin` · `unplugin tailwind obfuscator`

**Frameworks**

`next.js tailwind obfuscator` · `next.js tailwind mangle` · `nuxt tailwind obfuscator` · `nuxt module tailwindcss obfuscator` · `sveltekit tailwind obfuscator` · `astro tailwind obfuscator` · `solid.js tailwind obfuscator` · `qwik tailwind obfuscator` · `react router tailwind obfuscator` · `tanstack router tailwind obfuscator` · `remix tailwind obfuscator` · `shadcn ui obfuscate` · `cva obfuscate` · `tailwind variants obfuscate`

**Tailwind versions**

`tailwind v3 obfuscator` · `tailwind v4 obfuscator` · `tailwind v4 mangle` · `tailwind v4 class shortener` · `tailwind v4 class obfuscation oxide` · `@tailwindcss/vite obfuscator` · `@tailwindcss/postcss obfuscator`

**Use cases**

`hide design tokens from competitors` · `obscure tailwind theme` · `prevent tailwind copy paste` · `protect css ip` · `tailwind class names production only` · `class mangling source maps`

</details>

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
