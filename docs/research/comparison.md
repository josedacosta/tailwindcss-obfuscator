---
outline: deep
title: Tailwind CSS class manglers — full comparison
description: A side-by-side, evidence-based comparison of every active Tailwind CSS class obfuscator and mangler — tailwindcss-obfuscator vs tailwindcss-mangle vs Obfustail vs PostCSS minifiers.
---

# Tailwind CSS class manglers — full comparison

> A side-by-side, evidence-based comparison of every active tool that rewrites Tailwind CSS class names at build time. Updated against the latest releases as of April 2026.

## Tools covered

| Tool                                                                                        | Latest version | Approach                                        | Maintainer                                                    |
| ------------------------------------------------------------------------------------------- | -------------- | ----------------------------------------------- | ------------------------------------------------------------- |
| 🛡️ **tailwindcss-obfuscator** _(this project)_                                              | latest         | AST-based per-utility obfuscation               | [@josedacosta](https://github.com/josedacosta)                |
| 🔧 **tailwindcss-mangle** (`unplugin-tailwindcss-mangle` + `tailwindcss-patch`)             | 5.1.2 / 9.0.0  | Class extraction + per-utility mangling         | [@sonofmagic](https://github.com/sonofmagic)                  |
| 🌐 **Obfustail** (`ui-layouts/Obfuscated-tailwindcss`)                                      | 0.1.0          | Per-string regex rewrite + `@apply` re-emission | [ui-layouts](https://github.com/ui-layouts)                   |
| ⚙️ **PostCSS minifiers** (`cssnano`, `lightningcss`)                                        | varies         | CSS-only compression, no JS / HTML rewrite      | [cssnano-team](https://github.com/cssnano) / Mozilla / Parcel |
| 🅒 **Tailwind CSS itself** (`@tailwindcss/cli`, `@tailwindcss/postcss`, `@tailwindcss/vite`) | 4.x            | No native class obfuscation — out of scope      | [Tailwind Labs](https://github.com/tailwindlabs)              |

::: info Why include the last two?
PostCSS minifiers and Tailwind itself are routinely confused with class manglers ("doesn't Tailwind already shorten my classes?"). They do not — but they are the natural baseline a reader expects in the table.
:::

## Quick-glance matrix

| Capability                                                 | 🛡️ tailwindcss-obfuscator |  🔧 tailwindcss-mangle   |         🌐 Obfustail         | ⚙️ PostCSS minifiers | 🅒 Tailwind CSS |
| ---------------------------------------------------------- | :-----------------------: | :----------------------: | :--------------------------: | :------------------: | :------------: |
| Renames classes in HTML / JS / CSS                         |            ✅             |            ✅            |              ✅              |          ❌          |       ❌       |
| Tailwind v3 support                                        |            ✅             |            ✅            |              ❌              |         n/a          |      n/a       |
| Tailwind v4 support                                        |         ✅ Native         | ✅ via CSS scan (v9.0.0) |              ✅              |         n/a          |      n/a       |
| Doesn't modify your source files                           |            ✅             |            ✅            |     ❌ rewrites in place     |          ✅          |       ✅       |
| Per-utility obfuscation (smaller output)                   |            ✅             |            ✅            |  ❌ per-string (less reuse)  |          ❌          |       ❌       |
| AST-based JSX/TSX extraction                               |         ✅ Babel          |         ⚠️ Regex         |           ❌ Regex           |         n/a          |      n/a       |
| Vue SFC + Svelte `class:` directive                        |            ✅             |        ⚠️ Partial        |              ❌              |         n/a          |      n/a       |
| `cn()` / `clsx()` / `cva()` / `tv()` extraction            |        ✅ All six         |          ⚠️ Two          |          ❌ Manual           |          ❌          |       ❌       |
| Unified `unplugin` core (Vite/Webpack/Rollup/...)          |            ✅             |      ⚠️ Per-bundler      |       ❌ Build script        |          ❌          |       ❌       |
| Bundlers shipped (Vite/Webpack/Rollup/esbuild/Rspack/Farm) |           6 / 6           |          2 / 6           |            0 / 6             |         n/a          |      n/a       |
| Standalone CLI                                             |    ✅ `tw-obfuscator`     |      ✅ `tw-patch`       |    ❌ inline node script     |          ✅          |       ✅       |
| Source maps for transformed files                          |            ✅             |            ⚠️            |              ❌              |          ✅          |       ✅       |
| Reversible mapping file emitted                            |            ✅             |            ✅            |              ✅              |          ❌          |       ❌       |
| Per-build randomisation (no global state)                  |            ✅             |            ❌            |              ✅              |         n/a          |      n/a       |
| Type-safe config (strict TypeScript)                       |            ✅             |         ⚠️ Loose         |          ❌ Pure JS          |         n/a          |      n/a       |
| Active framework coverage (sample apps)                    |       **20+ apps**        |            ~5            |         1 (Next.js)          |         n/a          |      n/a       |
| **Unquoted HTML attributes** (HTML5 `class=foo`)           |      ✅ since v2.0.1      |            ❌            |              ❌              |         n/a          |      n/a       |
| **Next.js Turbopack** (post-build CLI, tested)             |      ✅ since v2.0.1      |            ❌            | ⚠️ accidental (Next + Turbo) |         n/a          |      n/a       |
| **npm publish with provenance** (Sigstore / OIDC)          |            ✅             |            ❌            |              ❌              |        varies        |      n/a       |
| **OpenSSF Scorecard** published weekly                     |            ✅             |            ❌            |              ❌              |         n/a          |      n/a       |
| **SBOM (SPDX-JSON)** attached to every GitHub release      |            ✅             |            ❌            |              ❌              |         n/a          |      n/a       |
| Licence                                                    |            MIT            |           MIT            |             MIT              |         MIT          |      MIT       |

## Per-tool deep-dive

### 🛡️ tailwindcss-obfuscator

The project these docs ship with. Built around obfuscation as the primary goal.

- **Pipeline** — [Babel](https://babeljs.io) for JSX/TSX, [PostCSS](https://postcss.org) for CSS, dedicated parsers for Vue SFC, Svelte, Astro, HTML.
- **Bundlers** — six adapters built on a shared [`unplugin`](https://github.com/unjs/unplugin) factory: Vite, Webpack, Rollup, esbuild, Rspack, Farm. Plus a Nuxt module and a `tw-obfuscator` CLI binary.
- **Tailwind versions** — v3 (config file, JIT, `safelist`) and v4 (CSS-first, `@theme`, container queries, `@starting-style`, `*:` / `**:` wildcards, `bg-(--my-var)` shorthand).
- **Helpers recognised** — `cn()`, `clsx()`, `classnames()`, `twMerge()`, `cva()`, `tv()`, plus any custom helper added via `preserve.functions`.
- **Reversibility** — emits `.tw-obfuscation/class-mapping.json` on every build.
- **Source code** — never modified. Only the shipped HTML / CSS / JS bundles change.

When to pick it: you want a single drop-in plugin that works across every modern bundler and meta-framework, with strict TypeScript types and source-map output, and you don't want your source files rewritten.

### 🔧 tailwindcss-mangle (`@sonofmagic`)

The historical reference for Tailwind class mangling. Composed of two packages plus a CLI:

- **`tailwindcss-patch` (v9.0.0)** — patches the Tailwind compiler to expose its internal class context. Until v9 it required Tailwind v3; v9 adds a CSS-scanning fallback that also covers Tailwind v4 (the new Rust-based Oxide engine doesn't expose the same hooks, so the v4 path scans the produced CSS instead of hooking into the JIT).
- **`unplugin-tailwindcss-mangle` (v5.1.2)** — the actual mangler. Ships Vite + Webpack adapters; relies on the per-bundler implementation (not a fully shared core).
- **CLI binary** — `tw-patch` for one-off extraction.

Strengths:

- Mature, battle-tested across many production projects.
- Mangling can drive tree-shaking when wired into a CSS-aware build (it removes unused declarations after rename).
- Active maintenance, regular releases.

Trade-offs vs `tailwindcss-obfuscator`:

- Class extraction is regex-based, not AST-based — dynamic JSX edge cases (nested `cn(cva(...))`, `tv()` slots, class-variance-authority `compoundVariants`) require manual `safelist` work.
- Only Vite + Webpack are official targets; Rollup / esbuild / Rspack / Farm need community adapters.
- Vue SFC `:class` and Svelte `class:directive` are partially supported — you have to verify per project.
- Loose TypeScript surface; `any` shows up in public types.

When to pick it: you specifically want **mangling for tree-shaking** rather than obfuscation as such, you're already on Vite or Webpack, and you trust the project to keep tracking Tailwind v4 compiler changes.

See the deeper analysis in [tailwindcss-patch vs tailwindcss-obfuscator](./tailwindcss-patch.md) and [Mangle Tailwind v4 issues](./v4-issues.md).

### 🌐 Obfustail (`ui-layouts/Obfuscated-tailwindcss`)

A demo Next.js project shipped by [ui-layouts](https://www.ui-layouts.com) with a live playground at <https://obfustail.ui-layouts.com>. It is **not packaged for npm** — it ships as a single 403-line build script (`scripts/obfuscate-tailwind.js`) you copy into your project and run before `next build`.

How it works:

1. The script greps for `className="..."` and `class="..."` strings via two regex patterns.
2. Each **full utility string** (e.g. `"flex items-center gap-2 rounded bg-blue-500 px-4"`) is hashed to a single random 8-character class name.
3. The script **rewrites your source files in place** with the new class strings.
4. It emits `app/obfuscated-styles.css` containing one `@apply` rule per generated selector that re-applies the original Tailwind utilities.
5. It saves `.obfuscation-map.json` for inspection.

Strengths:

- No build-tool integration to wire — it's a Node script you run before `next build`.
- The live playground is a great way to _see_ the rename happen.
- Tailwind v4 friendly out of the gate (it generates `@apply` rules and a `@theme inline` token block).

Trade-offs vs `tailwindcss-obfuscator`:

- **Per-string, not per-utility** — every distinct combination of utilities becomes a brand-new class. Reuse is poor: `"flex items-center"` and `"flex items-center gap-2"` produce two unrelated selectors. The CSS budget grows with the number of unique combinations, not with the number of utilities used.
- **Modifies your source files in place** — the script overwrites your `.tsx` / `.jsx` files. You need a clean git tree before each build, and `git diff` after the build is enormous and noisy.
- **Regex-only extraction** — anything inside `cn()`, `clsx()`, `cva()`, `tv()`, template literals, or non-React syntaxes is invisible.
- **Next.js / Tailwind v4 only** — no Vite, Webpack, Rollup, esbuild, Rspack, Farm; no Vue / Svelte / Astro / Solid / Qwik path.
- Single-file script with no test suite, no published npm package, no plugin API.

When to pick it: you have a small Next.js + Tailwind v4 site, you only use static `className=""` strings, and you want a one-file "drop and run" solution rather than a plugin.

### ⚙️ PostCSS minifiers (cssnano, lightningcss)

These tools do CSS-level compression — they shorten colours, fold whitespace, drop empty rules, dedupe selectors. They **do not rename classes**, because they can't safely correlate a `.bg-blue-500` selector with every JS / HTML reference to `"bg-blue-500"`.

You should still ship a CSS minifier alongside `tailwindcss-obfuscator` (they compose), but a minifier alone will not deliver the bundle-size or design-system protection a class mangler provides.

### 🅒 Tailwind CSS itself

Tailwind's first-party tooling (`@tailwindcss/cli`, `@tailwindcss/postcss`, `@tailwindcss/vite`) does not include a class-rename pass. The Tailwind Labs team [explicitly rejected](https://github.com/tailwindlabs/tailwindcss/discussions/7956) building one upstream — see [Why no native obfuscation?](./why-no-native.md). All four tools above exist because that gap is real.

## Decision tree

```
Are you on Tailwind v3 or v4?
├── v3 → tailwindcss-obfuscator   (full v3 support, drop-in)
│        OR tailwindcss-mangle     (mature on v3, less framework coverage)
└── v4 → Are you on Next.js + Tailwind v4 only and OK with source rewrites?
         ├── Yes → Obfustail        (one-script demo, fastest to try)
         └── No  → tailwindcss-obfuscator   (every bundler + framework, no source rewrite)
                   OR tailwindcss-mangle 9.0.0+   (CSS-scanning path; Vite/Webpack only)
```

If you only need CSS compression, ship `cssnano` or `lightningcss` regardless.

## Methodology

| Source                                                              | What we read                                                                                                                                          |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `github.com/sonofmagic/tailwindcss-mangle` (`main`, April 2026)     | `packages/tailwindcss-patch/package.json` (v9.0.0), `packages/unplugin-tailwindcss-mangle/package.json` (v5.1.2), README, `core/`, `packages/*/src/`. |
| `github.com/ui-layouts/Obfuscated-tailwindcss` (`main`, April 2026) | `package.json` (v0.1.0), `README.md`, `scripts/obfuscate-tailwind.js` (the entire 403-line script).                                                   |
| Tailwind Labs upstream                                              | Discussion [#7956](https://github.com/tailwindlabs/tailwindcss/discussions/7956), `@tailwindcss/postcss` v4 source.                                   |
| `cssnano`, `lightningcss`                                           | Public docs — neither documents a class-rename pass.                                                                                                  |
| `tailwindcss-obfuscator`                                            | This repository, current `main`.                                                                                                                      |

All competitor source code is downloaded locally via the `github/download_github_repositories.ts` script in this monorepo (see `github/README.md`) so claims here are reproducible — `pnpm dlx tsx github/download_github_repositories.ts` to refresh.

## See also

- [tailwindcss-patch vs tailwindcss-obfuscator](./tailwindcss-patch.md) — deep-dive on the v9.0.0 CSS-scanning approach
- [Mangle Tailwind v4 issues](./v4-issues.md) — historical record of v4 incompatibilities (now mostly resolved by v9.0.0)
- [Mangle ecosystem map](./ecosystem.md) — full package inventory of `sonofmagic/tailwindcss-mangle`
- [Why no native obfuscation?](./why-no-native.md) — why Tailwind Labs decided not to ship this upstream
