<p align="center">
  <a href="https://josedacosta.github.io/tailwindcss-obfuscator/">
    <img src="https://raw.githubusercontent.com/josedacosta/tailwindcss-obfuscator/main/docs/public/images/tailwindcss-obfuscator/logo-horizontal.svg" alt="tailwindcss-obfuscator" width="500">
  </a>
</p>

<h1 align="center">tailwindcss-obfuscator</h1>

<p align="center">
  <strong>Obfuscate, mangle and shrink Tailwind CSS class names at build time.</strong><br/>
  Cuts your CSS bundle by <strong>30–60%</strong> and protects your design system from copy-paste reverse-engineering.<br/>
  Vite · Webpack · Rollup · esbuild · Rspack · Farm · Next.js · Nuxt · SvelteKit · Astro · Solid · Qwik · React Router 7 · TanStack Router.<br/>
  Tailwind <strong>v3</strong> &amp; <strong>v4</strong>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/tailwindcss-obfuscator"><img src="https://img.shields.io/npm/v/tailwindcss-obfuscator.svg?style=flat-square" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/tailwindcss-obfuscator"><img src="https://img.shields.io/npm/dm/tailwindcss-obfuscator.svg?style=flat-square" alt="npm downloads"></a>
  <a href="https://github.com/josedacosta/tailwindcss-obfuscator/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/tailwindcss-obfuscator.svg?style=flat-square" alt="license"></a>
  <a href="https://josedacosta.github.io/tailwindcss-obfuscator/"><img src="https://img.shields.io/badge/docs-online-brightgreen?style=flat-square" alt="docs"></a>
</p>

---

## 📖 Full documentation

> ### 👉 **[josedacosta.github.io/tailwindcss-obfuscator](https://josedacosta.github.io/tailwindcss-obfuscator/)**
>
> Setup guides for every framework, the complete options reference, the patterns that obfuscate (and the ones that don't), the comparison with `tailwindcss-mangle`, and more.

---

## Why

`tailwindcss-obfuscator` rewrites verbose Tailwind utility classes (`bg-blue-500`, `flex`) into short opaque identifiers (`tw-a`, `tw-b`) at build time. The shipped HTML / CSS / JS bundles get **30–60 % smaller** on CSS-heavy pages and your design system becomes much harder to reverse-engineer. Source code stays readable.

## Install

```bash
pnpm add -D tailwindcss-obfuscator
# or: npm install --save-dev tailwindcss-obfuscator
# or: yarn add --dev tailwindcss-obfuscator
```

You also need `tailwindcss` (v3 or v4) installed in the project.

## Quick start — Vite

```ts
// vite.config.ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tailwindCssObfuscator from "tailwindcss-obfuscator/vite";

export default defineConfig({
  plugins: [tailwindcss(), tailwindCssObfuscator()],
});
```

That's it. Run `vite build` and your bundle is obfuscated. `vite dev` is left untouched so the dev experience stays normal.

For Webpack / Rollup / esbuild / Next.js / Nuxt / SvelteKit / Astro / Solid / Qwik / React Router 7 / TanStack Router setups, see the **[full documentation](https://josedacosta.github.io/tailwindcss-obfuscator/)**.

## Plugin entry points

| Bundler / framework | Import path                        |
| ------------------- | ---------------------------------- |
| Vite                | `tailwindcss-obfuscator/vite`      |
| Webpack             | `tailwindcss-obfuscator/webpack`   |
| Rollup              | `tailwindcss-obfuscator/rollup`    |
| esbuild             | `tailwindcss-obfuscator/esbuild`   |
| Nuxt module         | `tailwindcss-obfuscator/nuxt`      |
| CLI binary          | `tw-obfuscator` (after install)    |
| Internal pipeline   | `tailwindcss-obfuscator/internals` |

## Compatibility

| Dependency          | Versions      |
| ------------------- | ------------- |
| **Tailwind CSS**    | v3.x · v4.x   |
| **Vite**            | v4 → v8       |
| **Webpack**         | v5            |
| **Rollup**          | v3 → v4       |
| **esbuild**         | ≥ 0.17        |
| **Next.js**         | v13 → v16     |
| **Nuxt**            | v3 · v4       |
| **SvelteKit**       | v2            |
| **Svelte**          | v4 · v5       |
| **Astro**           | v4 → v6       |
| **Vue**             | v3.5+         |
| **Solid**           | v1.9+         |
| **Qwik**            | v1.x          |
| **React Router**    | v7 (ex-Remix) |
| **TanStack Router** | v1.168+       |
| **Node.js**         | ≥ 18          |

## FAQ

<details>
<summary><strong>What is a Tailwind CSS obfuscator (a.k.a. Tailwind class mangler)?</strong></summary>

A build-time tool that rewrites verbose Tailwind classes (`bg-blue-500`, `flex`, `items-center`) into short opaque identifiers (`tw-a`, `tw-b`, `tw-c`) inside the shipped HTML / CSS / JS bundle. Source code stays readable; only production output is changed. Net effect: **30–60% smaller CSS** and a **much harder-to-reverse-engineer** design system, with zero runtime cost.

</details>

<details>
<summary><strong>How is it different from <code>tailwindcss-mangle</code>?</strong></summary>

`tailwindcss-mangle` was built primarily to mangle classes for tree-shaking. `tailwindcss-obfuscator` is built around obfuscation as the primary goal: a unified `unplugin` core (Vite/Webpack/Rollup/esbuild/Rspack/Farm), AST extraction with full `cn() / clsx() / cva() / tv()` support, native Svelte `class:` directives, source maps, a standalone CLI (`tw-obfuscator`) and explicit Tailwind v4 support.

</details>

<details>
<summary><strong>Does it work with Tailwind CSS v4?</strong></summary>

Yes — full v4 support, including `@import "tailwindcss"`, `@theme`, container queries, `@starting-style`, the `*:` / `**:` wildcards, and the new `bg-(--my-var)` shorthand. v3 (config file, JIT, `safelist`) is also fully supported.

</details>

<details>
<summary><strong>Does it work with Next.js / Nuxt / SvelteKit / Astro / Solid / Qwik / Remix?</strong></summary>

Yes — every major meta-framework has a dedicated test app and a documented setup recipe. Use the matching plugin entry from the table above, or read the [framework guides](https://josedacosta.github.io/tailwindcss-obfuscator/).

</details>

<details>
<summary><strong>Will it break my dev server?</strong></summary>

No — obfuscation only runs on production builds (`vite build` / `next build` / `webpack --mode=production`). Dev servers stay untouched.

</details>

<details>
<summary><strong>Is the transformation reversible?</strong></summary>

Yes — every build emits `.tw-obfuscation/class-mapping.json`, a deterministic mapping you can keep around to translate any `tw-xxx` back to its original class.

</details>

<details>
<summary><strong>Does it support shadcn/ui, CVA, Tailwind Variants?</strong></summary>

Yes — `cn()`, `clsx()`, `classnames()`, `twMerge()`, `cva()` and `tv()` are recognised natively, including string literals nested inside `variants`, `compoundVariants` and `defaultVariants`.

</details>

<details>
<summary><strong>What's the licence?</strong></summary>

MIT — free for personal, commercial, and closed-source use.

</details>

## Keywords

<details>
<summary><strong>Search terms this project answers</strong></summary>

`tailwindcss obfuscator` · `tailwind css obfuscator` · `tailwind mangle` · `tailwindcss-mangle alternative` · `obfuscate tailwind classes` · `tailwind class shortener` · `shrink tailwind css bundle` · `tailwind v4 obfuscator` · `tailwind v3 obfuscator` · `tailwind vite plugin obfuscate` · `tailwind webpack plugin obfuscate` · `tailwind rollup plugin obfuscate` · `tailwind esbuild plugin obfuscate` · `tailwind rspack plugin` · `tailwind farm plugin` · `next.js tailwind obfuscator` · `nuxt tailwindcss obfuscator` · `sveltekit tailwind obfuscator` · `astro tailwind obfuscator` · `solid.js tailwind obfuscator` · `qwik tailwind obfuscator` · `react router tailwind obfuscator` · `tanstack router tailwind obfuscator` · `remix tailwind obfuscator` · `shadcn ui obfuscate` · `cva obfuscate` · `protect tailwind design system` · `hide tailwind classes` · `tailwind reverse engineering protection`

</details>

## Author

Built and maintained by **José DA COSTA**.

- 🌐 Website — <https://www.josedacosta.info>
- 🐙 GitHub — [@josedacosta](https://github.com/josedacosta)
- ✉️ Email — <contact@josedacosta.info>

Sponsor on [GitHub Sponsors](https://github.com/sponsors/josedacosta) if this saves you bandwidth or protects your design system.

## License

[MIT](https://github.com/josedacosta/tailwindcss-obfuscator/blob/main/LICENSE) © José DA COSTA.
