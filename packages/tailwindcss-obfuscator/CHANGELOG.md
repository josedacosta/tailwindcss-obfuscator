# tailwindcss-obfuscator

## 2.0.0

### Major Changes

- [`0f8bab3`](https://github.com/josedacosta/tailwindcss-obfuscator/commit/0f8bab3870ce25c7d3e0a963ca12ea9b68a99c74) Thanks [@josedacosta](https://github.com/josedacosta)! - Initial public release.

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

### Minor Changes

- [#4](https://github.com/josedacosta/tailwindcss-obfuscator/pull/4) [`49cf2a0`](https://github.com/josedacosta/tailwindcss-obfuscator/commit/49cf2a0ee0b03c459de6f3c3c0ab3ff9eeedaf99) Thanks [@josedacosta](https://github.com/josedacosta)! - feat(plugins): add Rspack and Farm bundler adapters

  Two new entry points complete the bundler matrix:
  - `tailwindcss-obfuscator/rspack` — for Rspack 1.x users (the Rust-based Webpack-compatible bundler).
  - `tailwindcss-obfuscator/farm` — for Farm 1.x users (the Rust-based all-in-one bundler).

  Both delegate to the same shared `unplugin` core that powers Vite/Webpack/Rollup/esbuild, so feature parity is automatic — same options, same lifecycle, same caching. Both peer dependencies (`@rspack/core`, `@farmfe/core`) are optional.

  ```ts
  // rspack.config.js
  import TailwindObfuscator from "tailwindcss-obfuscator/rspack";
  export default { plugins: [TailwindObfuscator()] };

  // farm.config.ts
  import TailwindObfuscator from "tailwindcss-obfuscator/farm";
  export default { plugins: [TailwindObfuscator()] };
  ```
