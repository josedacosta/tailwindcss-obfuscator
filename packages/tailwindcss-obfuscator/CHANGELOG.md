# tailwindcss-obfuscator

## 3.1.2

### Patch Changes

- [#108](https://github.com/josedacosta/tailwindcss-obfuscator/pull/108) [`4096738`](https://github.com/josedacosta/tailwindcss-obfuscator/commit/409673816904189601026a494b70a513c03c431d) Thanks [@josedacosta](https://github.com/josedacosta)! - Close 5 more `js/polynomial-redos` (CodeQL CWE-1333) findings in the package source :
  - `src/extractors/jsx.ts:346` (cva `compoundVariants` — `[\s\S]*?` lazy match before `]`)
  - `src/extractors/jsx.ts:361` (cva `defaultVariants` — `[\s\S]*?` lazy match before `}`)
  - `src/transformers/jsx.ts:20` `CLASSNAME_STRING_PATTERN` (`[^"']*?` lazy non-greedy with backref)
  - `src/transformers/jsx.ts:235` `compiledPattern` (same shape, with backtick variant)
  - `src/transformers/jsx.ts:258` `classAttrPattern` (same shape, with escape variant)

  The cva fixes use the same balanced-block traversal as the tv() fix in PR #106. The transformer fixes drop the redundant lazy `?` from `[^"']*?\1` — the negated character class already excludes the quote chars that could end the match, so the backreference has zero ambiguity ; non-greedy was never needed and was the source of CodeQL's polynomial-redos signature.

  Behaviour is bit-identical for valid input. Combined with PR #106, this closes 6/6 polynomial-redos findings in shipped src/ code (issue #50). The remaining CodeQL warnings of the same family live in dev-only test apps and scripts, which are not shipped to consumers.

## 3.1.1

### Patch Changes

- [#106](https://github.com/josedacosta/tailwindcss-obfuscator/pull/106) [`c24cd06`](https://github.com/josedacosta/tailwindcss-obfuscator/commit/c24cd06127d28f4fbe1ac20f5be2c592aa134a81) Thanks [@josedacosta](https://github.com/josedacosta)! - Fix `js/polynomial-redos` (CodeQL CWE-1333) in the `tv()` (tailwind-variants) extractor at `src/extractors/jsx.ts:396`. The previous regex `/tv\s*\(\s*\{[\s\S]*?base\s*:\s*["'\`]([^"'\`]+)["'\`]/g` had a polynomial-backtracking shape (`[\s\S]_?`lazy match before a literal`base`) that could be weaponised with crafted source code containing many `bas`runs without an`e`. The new flow extracts the balanced `tv({ ... })`block once, then runs a SAFE regex anchored at`\bbase`inside that bounded block — no`_?`over arbitrary characters before the keyword. Behaviour is unchanged ; the`base:`extraction still picks up the same string literals as before, verified by the existing`tv()` test cases.

  Refs #50 (the actionable polynomial-redos finding ; the rest of the issue's count was made up of CodeQL warnings on dev-only test apps and tests — those don't ship to consumers).

## 3.1.0

### Minor Changes

- [#103](https://github.com/josedacosta/tailwindcss-obfuscator/pull/103) [`27c5bd0`](https://github.com/josedacosta/tailwindcss-obfuscator/commit/27c5bd077cd35b0504a934d7086a0312c7d2e38b) Thanks [@josedacosta](https://github.com/josedacosta)! - Ship a SPDX 2.3 Software Bill of Materials inside the npm tarball at `dist/sbom.spdx.json`. The file lists every production dependency (currently 50 packages including the package itself) with its name, resolved version, download URL and `purl`. Consumers can read it via `cat node_modules/tailwindcss-obfuscator/dist/sbom.spdx.json` or feed it to GitHub Dependency Graph, OSSF Scorecard, FOSSA, GitLab Dependency Scanning or Anchore Grype — all of which consume SPDX 2.3 natively.

  Why ship the SBOM inside the tarball rather than as a GitHub release asset : npm publish-with-provenance signs the tarball via Sigstore, which freezes the resulting release as immutable. Post-publish asset uploads (the previous SBOM workflow) now fail with « Cannot upload assets to an immutable release. » Putting the SBOM inside the tarball makes it covered by the npm provenance attestation chain itself — strictly stronger than a post-release asset.

  Closes #101.

## 3.0.0

### Major Changes

- [#83](https://github.com/josedacosta/tailwindcss-obfuscator/pull/83) [`4b3d58d`](https://github.com/josedacosta/tailwindcss-obfuscator/commit/4b3d58d1961e229529ee4c6ad8192871dcf6f9fd) Thanks [@renovate](https://github.com/apps/renovate)! - **BREAKING** : drop support for `rollup` v3. The minimum supported peer is now `rollup >=4.60.2`. Consumers on rollup v3 should either pin `tailwindcss-obfuscator@<3.0.0` or upgrade to rollup v4 — see the [rollup v4 migration guide](https://rollupjs.org/migration/#changes-when-using-the-javascript-api).

- [#82](https://github.com/josedacosta/tailwindcss-obfuscator/pull/82) [`f2af5c7`](https://github.com/josedacosta/tailwindcss-obfuscator/commit/f2af5c7bf8098ee33ef418a3bccc76b26ae31d4f) Thanks [@renovate](https://github.com/apps/renovate)! - **BREAKING** : drop support for `@rspack/core` v1. The minimum supported peer is now `@rspack/core >=2.0.1`. Consumers on rspack v1 should either pin `tailwindcss-obfuscator@<3.0.0` or upgrade to rspack v2 — see the [rspack v2 migration guide](https://rspack.dev/blog/announcing-2-0).

- [#88](https://github.com/josedacosta/tailwindcss-obfuscator/pull/88) [`30ca037`](https://github.com/josedacosta/tailwindcss-obfuscator/commit/30ca03745d9cc9859cffe35dd7878c9448a6f1bc) Thanks [@renovate](https://github.com/apps/renovate)! - **BREAKING** : drop support for `vite` v4 / v5 / v6 / v7 in the declared peer range. The minimum supported peer is now `vite >=8.0.10`. The plugin core has not changed (the unplugin hooks `transform()` and `generateBundle()` are stable across vite v4–v8) ; the bump is for consistency with the apps under `apps/test-vite-*` which exercise vite v8 in CI.

  Consumers on vite v4–v7 may continue to use `tailwindcss-obfuscator@<3.0.0` ; the underlying behaviour should still work on a vite v4–v7 install but is no longer regression-tested by us.

### Patch Changes

- [#97](https://github.com/josedacosta/tailwindcss-obfuscator/pull/97) [`b8ede56`](https://github.com/josedacosta/tailwindcss-obfuscator/commit/b8ede56c1b4d6366c097089395ba5e04e69a497b) Thanks [@josedacosta](https://github.com/josedacosta)! - Bump `commander` from v12 to v14 (internal CLI parsing dependency, landed in #89). The CLI surface (`tw-obfuscator --help`, `tw-obfuscator run`, flags) is unchanged ; the bump is covered by the tarball-smoke gate that runs `tw-obfuscator --version` after `npm install` of the freshly-packed tarball. Note : commander 14 requires Node.js v20+ which is already the package's documented minimum.

- [#97](https://github.com/josedacosta/tailwindcss-obfuscator/pull/97) [`b8ede56`](https://github.com/josedacosta/tailwindcss-obfuscator/commit/b8ede56c1b4d6366c097089395ba5e04e69a497b) Thanks [@josedacosta](https://github.com/josedacosta)! - Bump the internal `unplugin` core from v2 to v3 (landed in #93). The package's public API surface is unchanged ; all 10 plugin entries (`./vite`, `./webpack`, `./rollup`, `./esbuild`, `./rspack`, `./farm`, `./nuxt`, `./cli`, `./internals`, root) continue to resolve and import cleanly via both ESM and CJS — verified end-to-end by the tarball-smoke gate. Internal-only refresh.

## 2.1.0

### Minor Changes

- [#64](https://github.com/josedacosta/tailwindcss-obfuscator/pull/64) [`3f82df5`](https://github.com/josedacosta/tailwindcss-obfuscator/commit/3f82df59c0cda966bd7b00e5ee2b89418641b06b) Thanks [@josedacosta](https://github.com/josedacosta)! - Recognize 33 new Tailwind CSS v4.x utility families that were previously
  unrecognised by the class extractor (so any class using them shipped raw,
  un-obfuscated, in production bundles). Audit performed against the upstream
  `tailwindlabs/tailwindcss` v4.2.4 source.

  Newly recognised:
  - **Logical-axis utilities (v4.2.0)** — `pbs-*`, `pbe-*`, `mbs-*`, `mbe-*`,
    `scroll-pbs-*`, `scroll-pbe-*`, `scroll-mbs-*`, `scroll-mbe-*`,
    `border-bs-*`, `border-be-*`, `inset-bs-*`, `inset-be-*`, `inset-s-*`,
    `inset-e-*`, `inline-*`, `block-*`, `min-inline-*`, `max-inline-*`,
    `min-block-*`, `max-block-*`.
  - **Font features (v4.2.0)** — `font-features-*`.
  - **New gradient families (v4)** — `bg-linear-*`, `bg-radial-*`,
    `bg-conic-*`, plus the static `via-none`.
  - **3D transforms (v4)** — `rotate-x-*`, `rotate-y-*`, `rotate-z-*`,
    `translate-z-*`, `scale-z-*`, `perspective-*`, `perspective-origin-*`,
    plus the static `transform-3d`.
  - **New utility families (v4)** — `inset-shadow-*`, `inset-ring-*`,
    `field-sizing-*`, `color-scheme-*`, `font-stretch-*`.

  Bumped to `minor` because consumers using any of these utilities in a
  codebase that builds with the obfuscator will now see them obfuscated
  where they were silently passed through before — observable behaviour
  change.

### Patch Changes

- [#63](https://github.com/josedacosta/tailwindcss-obfuscator/pull/63) [`4b198c5`](https://github.com/josedacosta/tailwindcss-obfuscator/commit/4b198c5cc4800b279dacb6997cbdbda99dfe6c28) Thanks [@josedacosta](https://github.com/josedacosta)! - Fix #61 — `tv()` (tailwind-variants) extractor was silently broken: classes inside `tv({ base, variants, compoundVariants, slots })` were not being extracted, leaving them un-obfuscated in production bundles. Two root causes :
  1. **Registry routing**: `extractors/index.ts` mapped `js/jsx/ts/tsx/vue/svelte/astro` to `extractFromJsxWithCva` (which only handles `cva()`), bypassing `extractAllFromJsx` which composes the cn/cva/tv extractors. Now every JS-family extension uses `extractAllFromJsx`.
  2. **Nested-object regex**: the `tv()` variants regex used `[\s\S]*?\}` which closes on the first inner `}` (e.g. `intent: { primary }` truncates after `primary`). Refactored `extractFromTailwindVariants` to use `extractBalancedBlock` for `variants`, `slots`, `compoundVariants`, `compoundSlots`, and `defaultVariants` — the same balanced-brace approach `cva()` already used.

  The README claim "Recognises `tv()` out of the box" now holds end-to-end. New `apps/test-tailwind-variants/` regression test asserts that all 33 expected tv() classes (base + variants + compoundVariants across 2 tv() instances) appear in the post-build mapping.

## 2.0.3

### Patch Changes

- Internal release pipeline validation — no consumer-visible code change.

  This patch is published to validate that the npm OIDC trusted-publishing
  pipeline now succeeds end-to-end via GitHub Actions, after the npm-side
  Trusted Publisher binding was rebound to `publish.yml` and the workflow
  itself was hardened (PRs #44, #47, #49). It also implicitly ships the
  internal CI improvements accumulated since 2.0.2 :
  - npm runner upgraded to latest (11.5.1+) for stable OIDC support
  - `NPM_CONFIG_PROVENANCE` env var dropped (redundant with OIDC trusted publishing)
  - `NPM_TOKEN` removed from publish workflow (forces clean OIDC-only auth)
  - `release.yml` renamed to `publish.yml` (bypasses the deployment-throttling lock)

  Library API and behaviour are unchanged. Upgrading from 2.0.2 → 2.0.3
  requires no action on the consumer side.

## 2.0.2

### Patch Changes

- [#45](https://github.com/josedacosta/tailwindcss-obfuscator/pull/45) [`0f7bdd0`](https://github.com/josedacosta/tailwindcss-obfuscator/commit/0f7bdd04bd1fed44d626020dd173173221a08a7f) Thanks [@josedacosta](https://github.com/josedacosta)! - Fix CodeQL `js/redos` (catastrophic-backtracking ReDoS, severity error) in the
  two Vue `:class` / `v-bind:class` extraction patterns. The previous patterns
  used a nested-quantifier shape (`[^"]*(?:'[^']*'[^"]*)*`) that allowed
  exponential backtracking on pathological input. Replaced by a flat
  `[^"]*` (and `[^']*`) negated character class. Loses support for nested
  quotes inside Vue class bindings — an extreme edge case never covered by
  existing tests; all 395 unit tests still pass.

## 2.0.1

### Patch Changes

- [#18](https://github.com/josedacosta/tailwindcss-obfuscator/pull/18) [`2776c6e`](https://github.com/josedacosta/tailwindcss-obfuscator/commit/2776c6e71c2284b42d4c7b48badcd9c47e765668) Thanks [@josedacosta](https://github.com/josedacosta)! - Cross-package-manager parity (npm / yarn / pnpm) — fixes 2 silent bugs that broke downstream tooling on every PM equally.

  **`./package.json` is now exported.** Previously, downstream tools that read the package metadata via `require("tailwindcss-obfuscator/package.json")` (Vite, Webpack, esbuild bundle analysis, Next.js framework probes, IDE TS plugins) crashed with `ERR_PACKAGE_PATH_NOT_EXPORTED` on Node 20+. The `exports` map now declares `"./package.json": "./package.json"`.

  **`engines` no longer pins pnpm.** The published package previously declared `engines.pnpm: ">=9.0.0"`, which leaked the maintainer's local toolchain to consumers and triggered `EBADENGINE` warnings on `npm install` / `yarn add`. Only `engines.node: ">=18.0.0"` remains (and is the only legit constraint for a published library).

  **CLI version is now read from `package.json` at runtime.** `tw-obfuscator --version` was hardcoded to `1.0.0` and never updated. It now resolves the live version via `createRequire(import.meta.url)("../../package.json").version`, so it always matches the installed package.

  A new test file `tests/package-exports.test.ts` adds 19 regression guards (every plugin entry has ESM + CJS + types, every optional bundler peerDep is marked optional, `./package.json` is exported, `engines` contains only `node`) so these bugs cannot silently re-appear.

- [#21](https://github.com/josedacosta/tailwindcss-obfuscator/pull/21) [`9a6e215`](https://github.com/josedacosta/tailwindcss-obfuscator/commit/9a6e2153103fc6f697eab57ef15ef6688cc3170e) Thanks [@josedacosta](https://github.com/josedacosta)! - Docs homepage SEO + GEO overhaul (no package code change).

  The live homepage at https://josedacosta.github.io/tailwindcss-obfuscator/ now ships :

  **Three JSON-LD structured-data blocks** in the page head, picked up by Google Knowledge Panels, Google AI Overviews, Perplexity, ChatGPT search, Claude search, and Bing :
  - `SoftwareApplication` — name, alternateName, applicationCategory, operatingSystem, version, license, $0 offer, author, code repository, programming language. Drives Knowledge Panel cards.
  - `FAQPage` with 7 questions — written verbatim in user voice (real Google search intents), each Q&A 2-4 sentences, optimised so an LLM can quote them back.
  - `BreadcrumbList` — Home → Get Started.

  **Stronger hero copy** — more keyword-dense, names every supported bundler and meta-framework on the first paint, leads with the value prop ("30–60 % bundle reduction") instead of a vague tagline.

  **Three-CTA hierarchy** — Get Started (brand), Compare with mangle (alt, points to /research/comparison), View on GitHub (alt). Replaces the previous two-CTA layout that under-promoted the comparison page.

  **On-page FAQ section** at the bottom of the homepage that mirrors the FAQPage JSON-LD — same 7 questions, same answers, fully crawlable Markdown so the schema has on-page text backing it (Google requires the schema content to also appear visibly on the page).

  Verified via local `pnpm docs:build` — all three `<script type="application/ld+json">` blocks are emitted into the rendered `dist/index.html`. After this lands and Pages redeploys, validate via Google's [Rich Results Test](https://search.google.com/test/rich-results) and Schema.org's [Schema Markup Validator](https://validator.schema.org/).

- [#19](https://github.com/josedacosta/tailwindcss-obfuscator/pull/19) [`6562bcc`](https://github.com/josedacosta/tailwindcss-obfuscator/commit/6562bcc2128fd70db3ac344916fd3feea49a34fe) Thanks [@josedacosta](https://github.com/josedacosta)! - HTML unquoted attribute support + compatibility-matrix accuracy refresh.

  **Unquoted HTML attributes are now supported.** The HTML5 spec allows `class=foo-bar` (unquoted, no whitespace in value), and static templates in the wild routinely use this form. Previously, the extractor and the transformer only matched `class="..."` and `class='...'`, silently skipping every unquoted occurrence. Both now match the three forms the spec defines:
  - double-quoted `class="foo bar"`
  - single-quoted `class='foo bar'`
  - unquoted `class=foo-bar`

  The pattern also tightens the leading boundary from `\b` to `(?:^|[\s<])` so that `data-class="..."` no longer accidentally matches the `class=` substring inside it (this was a latent false-positive that affected `transformHtml` and the data-attr transformer).

  **Compatibility doc refresh — arbitrary values are fully supported, not partial.** The `/reference/compatibility` page previously marked `[color:red]`, `bg-[url('/img.png')]`, `w-[calc(100%-20px)]`, `bg-[var(--my-color)]`, and `bg-blue-500/[.25]` as ⚠️ partial-obfuscation. They are in fact fully supported end-to-end (`splitClassString` respects `[...]` and `(...)` so the values survive intact, and `isTailwindClass` recognises every arbitrary-property pattern). The compatibility table now reads ✅ for all of them, matching reality.

  Adds `tests/html-unquoted-attrs.test.ts` (8 new regression guards covering the three quote forms in extraction, transformation, arbitrary-value preservation, and the fixed `data-*` boundary). Updates two existing `transformHtmlWithDataAttrs` tests that were relying on the broken `data-class` false-positive to instead assert the correct opt-in behaviour via `dataAttributes: ["data-class"]`.

- [#20](https://github.com/josedacosta/tailwindcss-obfuscator/pull/20) [`b7dae87`](https://github.com/josedacosta/tailwindcss-obfuscator/commit/b7dae875f71804188b14c98a8c2ddb5026c2ecc6) Thanks [@josedacosta](https://github.com/josedacosta)! - Turbopack support via post-build CLI — now officially documented and tested.

  Turbopack does not expose a plugin API (no `processAssets` hook, no third-party loader chain, no public plugin SDK as of April 2026), so the Webpack plugin cannot attach to it directly. The supported workaround is the `tw-obfuscator` CLI run as a post-build step:

  ```jsonc
  // package.json
  {
    "scripts": {
      "build": "next build && tw-obfuscator run --build-dir .next --content 'app/**/*.{js,jsx,ts,tsx,mdx}' --content 'components/**/*.{js,jsx,ts,tsx,mdx}' --css 'app/**/*.css'",
    },
  }
  ```

  What lands :
  - **`docs/guide/nextjs.md` Turbopack section flipped from `❌ not supported` to `✅ supported via post-build CLI`.** Two patterns documented side by side: Pattern A (post-build CLI, Turbopack-friendly) and Pattern B (opt-out with `--webpack`). Both produce the same final output.
  - **`apps/test-nextjs/package.json` gains a `build:turbopack` script** demonstrating Pattern A end-to-end. Run `pnpm --filter test-nextjs build:turbopack` to reproduce.
  - **New `tests/turbopack-postbuild.test.ts`** — 2 integration tests that simulate a minimal `.next/` output (CSS chunk + HTML pre-render + JS chunk) and verify the full extract → map → transform pipeline rewrites every reference consistently. Catches the "obfuscation silently skipped after the build" case.
  - **Updated "Path forward" section** in the docs — Path 1 (post-build CLI) is now ✅ shipped; Paths 2 (`unplugin-turbopack`) and 3 (native Rust) remain speculative until upstream work lands.

  No package code change — the CLI already supported `--build-dir .next` (default value). What changes is the official positioning + the regression test + the documentation.

- [#17](https://github.com/josedacosta/tailwindcss-obfuscator/pull/17) [`843455b`](https://github.com/josedacosta/tailwindcss-obfuscator/commit/843455bc921f1de4514fe788e5a514a0f9683ffd) Thanks [@josedacosta](https://github.com/josedacosta)! - Documentation, CI, and contribution-workflow overhaul. No runtime change to the published package.

  **Documentation**
  - New dedicated framework guides for Vue 3, Solid.js, Qwik, esbuild, Rspack, Farm.
  - New "Full comparison" page benchmarking `tailwindcss-obfuscator` against `tailwindcss-mangle`, Obfustail, and PostCSS minifiers.
  - VitePress site now ships a Mermaid plugin (real diagrams replace ASCII art in `research/ecosystem`).
  - Sidebar gets a cross-section navigation block on every page; homepage "Get Started" CTA is visually scaled up.
  - Root README revamped: live-doc links instead of source paths, FAQ split into a search-intent section + a general/technical section, much-larger Contributing section, npm badges adapted for fresh-package state.
  - New `docs/public/llms.txt` for GEO (Generative Engine Optimization).
  - SEO `head:` meta block on the docs homepage (description, keywords, Open Graph, Twitter card, canonical).

  **CI / supply chain**
  - New `.github/workflows/scorecard.yml` — OpenSSF Scorecard analysis (weekly + on push).
  - New `.github/workflows/sbom.yml` — SPDX-JSON SBOM generated and attached to every GitHub release via anchore/sbom-action.
  - New `.github/workflows/labeler.yml` + `.github/labeler.yml` — auto-tags PRs with `area: …` / `framework: …` labels.
  - New `.github/workflows/welcome.yml` — first-time contributor greeting via actions/first-interaction.
  - New `.github/release.yml` — auto-categorised GitHub release notes from PR labels.
  - 31 standardised triage labels created via `gh label create`.
  - Default workflow GITHUB_TOKEN permissions tightened to `read` (was `write`); workflows can no longer self-approve PRs.
  - CodeQL default setup extended from `actions` only → `actions` + `javascript-typescript`.
  - Fork PR workflow approval set to "Require approval for ALL external contributors" (most strict).
  - Actions allowlist updated to include `ossf/scorecard-action@*` and `anchore/sbom-action@*`.

  **Automated review (informational only — never approves a PR)**
  - CodeRabbit GitHub App installed under the free Open Source plan, scoped to this repo only, configured via `.coderabbit.yaml` with security-paranoid review instructions.
  - GitHub Copilot Code Review enabled via a repository ruleset on the default branch, configured via `.github/copilot-instructions.md` with matching security-paranoid instructions.

  **Contribution workflow**
  - `CONTRIBUTING.md` made explicit about the dual standard (owner-streamlined vs external-strict), realistic review/release cadence, and the automated review tooling.
  - `.github/PULL_REQUEST_TEMPLATE.md` opens with a banner reminding contributors that only the maintainer can merge and that opening a PR doesn't trigger an npm publish.

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
