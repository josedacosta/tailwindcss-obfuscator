<p align="center">
  <a href="https://josedacosta.github.io/tailwindcss-obfuscator/">
    <img src="https://raw.githubusercontent.com/josedacosta/tailwindcss-obfuscator/main/docs/public/images/tailwindcss-obfuscator/logo-horizontal.svg" alt="tailwindcss-obfuscator" width="500">
  </a>
</p>

<h1 align="center">tailwindcss-obfuscator</h1>

<p align="center">
  Obfuscate Tailwind CSS class names at build time —<br/>
  Vite · Webpack · Rollup · esbuild · Next.js · Nuxt · SvelteKit · Astro · Solid · Qwik · React Router 7 · TanStack Router.<br/>
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

## Author

Built and maintained by **José DA COSTA**.

- 🌐 Website — <https://www.josedacosta.info>
- 🐙 GitHub — [@josedacosta](https://github.com/josedacosta)
- ✉️ Email — <contact@josedacosta.info>

Sponsor on [GitHub Sponsors](https://github.com/sponsors/josedacosta) if this saves you bandwidth or protects your design system.

## License

[MIT](https://github.com/josedacosta/tailwindcss-obfuscator/blob/main/LICENSE) © José DA COSTA.
