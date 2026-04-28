---
"tailwindcss-obfuscator": major
---

Initial public release.

`tailwindcss-obfuscator` rewrites Tailwind CSS class names to short opaque
identifiers (`tw-a`, `tw-b`, …) at build time, in both the generated CSS and
every `class=` / `className=` attribute that references them. It supports
Tailwind v3 and v4, ships first-party plugins for Vite, Webpack, Rollup,
esbuild, and Nuxt, and is verified against 17 sample apps covering React /
Next.js / Vue / Nuxt / SvelteKit / Astro / Solid / Qwik / React Router v7 /
TanStack Router / static HTML and the standalone Webpack and Rollup
configurations.

### Public API

- Plugins: `tailwindcss-obfuscator/{vite,webpack,rollup,esbuild,nuxt}`
- CLI: `tw-obfuscator run|extract|transform`
- `defineConfig`, `ObfuscatorOptions` types
- Internal pipeline (`tailwindcss-obfuscator/internals`) for custom integrations

### Highlights

- AST-based JSX/TSX/Vue transformer with a generic `StringLiteral` and
  `TemplateElement` catch-all, covering shadcn `cva` variant tables and
  SSR-rendered HTML embedded in JS strings.
- PostCSS selector rewriter with a regex safety net for CSS chunks PostCSS
  fails to parse.
- Bundler-specific hooks for Vite (`generateBundle`, `transformIndexHtml`),
  Webpack (`processAssets`), Rollup (`generateBundle`), and Nitro (close hook).
- Zero-config defaults; opt-in `preserve.classes`, `preserve.functions`,
  `cache`, `mapping`, and source-map generation.
