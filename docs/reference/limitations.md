---
outline: deep
title: Known limitations
description: Every feature that is not fully supported by tailwindcss-obfuscator, with the exact technical reason and the recommended workaround.
---

# Known limitations

Every cell marked `❌` or `⚠️` in our [compatibility matrix](./compatibility) and [comparison table](../research/comparison) is documented here with the **technical reason**, the **workaround** when one exists, and the **tracking issue** when the situation may change.

If you hit a limitation that is not on this page, please [open an issue](https://github.com/josedacosta/tailwindcss-obfuscator/issues/new/choose) so we can either fix it or document it here.

---

## Class extraction limitations

### Dynamic template literals (`` `bg-${color}-500` ``)

Marked **❌ Not extracted** in the [Compatibility](./compatibility#class-pattern-support) reference (§ JSX/React Patterns).

::: warning Why dynamic template literals are not extracted
**Root cause** : the obfuscator extracts class names by **statically analysing source code at build time**. A template literal whose value depends on a runtime variable (e.g. `` `bg-${color}-500` ``) is not knowable until the user's app actually runs — by which point the build has long finished.

**Workaround** : enumerate every possible value at build time so the obfuscator can see them all as static strings :

```jsx
// ❌ Won't extract
<div className={`bg-${color}-500`} />

// ✅ Will extract
<div className={color === "red" ? "bg-red-500" : "bg-blue-500"} />

// ✅ Or via a lookup map
const COLORS = { red: "bg-red-500", blue: "bg-blue-500" };
<div className={COLORS[color]} />

// ✅ Or via the safelist (`exclude` option)
//    in your obfuscator config:
//      exclude: [/^bg-(red|blue|green)-500$/]
```

**Tracked in** : intentional design decision. Static-only extraction is the only way to guarantee a deterministic mapping that a downstream consumer can reverse without running the application.
:::

### Variable-bound `className={styles}`

Marked **❌ Not extracted** in the [Compatibility](./compatibility#class-pattern-support) reference (§ JSX/React Patterns).

::: warning Why variable-bound className is not extracted
**Root cause** : same as the template-literal case — the obfuscator does not execute your code, so it cannot know what `styles` resolves to at runtime. Even with sophisticated dataflow analysis, the variable could come from props, a fetch, or a JSON blob — all unknowable at build time.

**Workaround** :

- If `styles` is a constant inside the same file, the AST extractor _will_ follow simple references — write `const styles = "bg-blue-500 text-white"` instead of importing `styles` from another module.
- For props-driven styling, prefer one of the [supported class utilities](./compatibility#class-pattern-support) (`cn()`, `clsx()`, `cva()`) which the extractor knows how to inspect.

**Tracked in** : intentional, see above.
:::

### Vue `:class` bindings with literal nested quotes

Marked **⚠️ Partial** in some scenarios.

::: warning Why some nested-quote Vue bindings extract differently
**Root cause** : in [PR #45](https://github.com/josedacosta/tailwindcss-obfuscator/pull/45) the regex was simplified from `[^"]*(?:'[^']*'[^"]*)*` to a flat `[^"]*` to fix a critical [`js/redos`](https://cwe.mitre.org/data/definitions/1333.html) catastrophic-backtracking vulnerability (CodeQL severity: error). The trade-off is that Vue `:class` attribute values containing nested quotes (e.g. `:class="aria-label='hi' bg-blue-500"`) are now truncated at the first `'`.

**Workaround** : structure your `:class` bindings as object/array syntax (which is the canonical Vue pattern anyway) :

```vue
<!-- ⚠️ Partial extraction — only "aria-label=" is captured -->
<div :class="aria-label='hi' bg-blue-500"></div>

<!-- ✅ Full extraction -->
<div :class="{ 'bg-blue-500': isActive }"></div>
<div :class="['flex', isActive && 'bg-blue-500']"></div>
```

**Tracked in** : the security trade-off is intentional. The pre-PR-#45 form would freeze a downstream user's build with a malformed Vue file.
:::

### `tv()` (tailwind-variants) base + variants + compoundVariants

::: danger Currently broken — fix in flight
**Root cause** : the regex in `packages/tailwindcss-obfuscator/src/extractors/jsx.ts:386-409` matches the surface form `tv({ base: "..." })` but in practice does not pick up the variant strings. Discovered while building [`apps/test-tailwind-variants/`](https://github.com/josedacosta/tailwindcss-obfuscator/issues/61) — only inline template-literal classes get obfuscated, the entire `base` / `variants` / `compoundVariants` content is left as raw `bg-blue-600` / `text-white` etc.

**Workaround until fixed** : either

- inline the variant strings as constants and reference them (the AST extractor _can_ follow same-file constants),
- or use [`cva()`](https://cva.style/) instead of `tv()` — `cva()` works correctly today and is exercised end-to-end in [`apps/test-shadcn-ui/`](https://github.com/josedacosta/tailwindcss-obfuscator/tree/main/apps/test-shadcn-ui).

**Tracked in** : [issue #61](https://github.com/josedacosta/tailwindcss-obfuscator/issues/61). README claim "`tv()` recognised out of the box" is currently misleading — will be re-honored once #61 ships.
:::

---

## Framework version coverage

The README advertises a wide design-intent range for several frameworks. The actual versions tested in CI on every release are narrower — see the [Compatibility](./compatibility#version-range-claims-vs-tested-baselines) reference (§ Version-range claims vs. tested baselines) for the exact matrix.

### Next.js v13 / v14 / v15 — not in the test matrix

::: info Why v13 / v14 / v15 are advertised but not tested
**Root cause** : the package's plugin core is bundler-agnostic (built on `unplugin`) and does not depend on Next.js internals — every version since v13 should work in principle. We simply don't have CI test apps for v13–v15 yet, only v16.

**Workaround** : if you ship Next.js v13–v15 in production, please confirm by running `node scripts/verify-obfuscation.mjs` against your own build. If anything breaks, [open an issue](https://github.com/josedacosta/tailwindcss-obfuscator/issues/new/choose) and we'll add a regression test app for your version.

**Tracked in** : [issue #55](https://github.com/josedacosta/tailwindcss-obfuscator/issues/55) — phase-2 test apps coverage.
:::

### Nuxt v3 — not in the test matrix

::: info Why Nuxt v3 is advertised but not tested
**Root cause** : the Nuxt v3 ESM-only bundling differs in a few subtle ways from v4 (different module-graph hooks, slightly different config surface). v4.4 is what we exercise on CI ; v3 should still work because the plugin uses the public `@nuxt/kit` module hooks, but it's not regression-tested.

**Workaround** : same as Next.js — verify locally and report any regression.

**Tracked in** : [issue #55](https://github.com/josedacosta/tailwindcss-obfuscator/issues/55).
:::

### Astro v4 / v5 — not in the test matrix

::: info Why Astro v4–v5 are advertised but not tested
**Root cause** : Astro v4 introduced the integration system the plugin relies on, and v5 + v6 are incremental additions. The plugin uses the same Astro hooks across all three versions and should work.

**Workaround** : same as above.

**Tracked in** : [issue #55](https://github.com/josedacosta/tailwindcss-obfuscator/issues/55).
:::

### Vite v4 / v5 / v6 / v7 — not in the test matrix

::: info Why Vite v4–v7 are advertised but only v8 is tested
**Root cause** : Vite's plugin API is stable across v4–v8. The plugin uses `transform()` and `generateBundle()` hooks which haven't changed. v8 is what we test ; older versions should work but are not regression-tested.

**Workaround** : same as above.

**Tracked in** : [issue #55](https://github.com/josedacosta/tailwindcss-obfuscator/issues/55).
:::

### Svelte v4 (pre-runes) — not in the test matrix

::: info Why pre-runes Svelte 4 is advertised but not tested
**Root cause** : Svelte 5 introduced runes (the `$state` / `$derived` reactivity primitives). The class extractor handles **`class:directive`** syntax (which exists in both v4 and v5), but the test suite uses Svelte 5.55 with runes. A Svelte 4 codebase using `class:directive` should obfuscate fine.

**Workaround** : same as above.

**Tracked in** : [issue #55](https://github.com/josedacosta/tailwindcss-obfuscator/issues/55).
:::

---

## Tailwind v4 features known to be incomplete

A handful of Tailwind v4 features have less-than-complete support today. The big-picture v4 audit lives in the [v4 Quick Reference](../research/tailwind-v4-summary) page. Each individual gap below has its own card.

### Wildcard variants `*:` and `**:` — fully supported as of v2.0.x

Marked `✅` in the [Compatibility](./compatibility#tailwind-feature-support) reference. No card needed.

### Logical-axis utilities (`pbs-*`, `mbs-*`, `inset-bs-*`)

::: tip Status: supported and obfuscated since v2.0.x
The Tailwind v4 logical-axis utilities (`pbs-4` for padding-block-start, `mbs-2` for margin-block-start, etc.) are recognised by the same regex that handles directional utilities. No special handling needed.
:::

### `not-*` / `in-*` / `nth-*` variants — supported, edge cases possible

Marked **⚠️ Partial** in the [v4 Features Analysis](../research/tailwind-v4-features-analysis) page.

::: warning Why some uncommon `not-*` / `in-*` / `nth-*` patterns may not extract
**Root cause** : the basic shapes (`not-hover:bg-blue-500`, `in-data-[state=open]:block`, `nth-2:bg-gray-100`) are all in the test matrix and obfuscate correctly. Combinations with deeply-nested arbitrary values (e.g. `not-[*[data-foo='bar baz']]:flex`) may not extract because the regex doesn't unfold every nesting depth.

**Workaround** : if your build emits a class whose CSS is generated by Tailwind but the class itself is not in `.tw-obfuscation/class-mapping.json`, list it in your obfuscator config under `exclude` so it survives unchanged. Alternatively, add a regression test case to the project — we'll widen the regex.

**Tracked in** : the `js/polynomial-redos` audit ([issue #50](https://github.com/josedacosta/tailwindcss-obfuscator/issues/50)) is the place where these regex patterns get reviewed for both ReDoS safety and depth-of-nesting coverage.
:::

### CSS variable shorthand `bg-(--my-var)` — supported as of v2.0.x

Marked `✅` in the [Compatibility](./compatibility#tailwind-feature-support) reference. Tailwind v4's `bg-(--brand-color)` parentheses shorthand is recognised. No card needed.

### `@plugin` and `@utility` directives in user-authored CSS

::: warning Why classes registered via `@plugin` / `@utility` may not obfuscate
**Root cause** : if a user defines a custom utility via `@utility my-thing { … }` in their own CSS, that utility is generated by Tailwind at build time and appears in the final stylesheet. The obfuscator's CSS extractor (`packages/tailwindcss-obfuscator/src/extractors/css.ts`) reads the **emitted CSS** and picks them up. However, the **HTML/JSX extractor** doesn't know about user-defined utilities until it sees them used as class names — if they're used in the same way as Tailwind utilities (just `<div class="my-thing">`), they will be obfuscated too. If they're applied via `@apply` from another component-utility CSS layer, the situation is more complex and may not round-trip cleanly.

**Workaround** : prefer using `@apply` inside `@layer components { … }` so the rendered class names appear directly in the HTML and are obfuscated like any other utility. Avoid chained `@apply` from inside `@plugin` definitions.

**Tracked in** : no current issue ; please open one with a repro if this affects you.
:::

---

## Comparison-with-others scoring justifications

Cells in [`docs/research/comparison.md`](../research/comparison) marked `❌` for the competitor (`tailwindcss-mangle`, `Obfustail`) reflect what is true about those projects today. We don't claim the competitors will _never_ implement these — we claim they don't today. Each `❌` in that table corresponds to a specific verifiable absence:

- **AST-based JSX/TSX extraction (Babel)** : `tailwindcss-mangle` uses regex string-matching, `Obfustail` uses per-string regex replace. Neither parses the AST. Verifiable by reading their source.
- **Tailwind v4 support without config file** : `Obfustail` requires `tailwind.config.js` which v4 deprecated. Verifiable by attempting to use it on a v4 project.
- **Per-utility obfuscation** : `Obfustail` rewrites whole strings, not individual utilities, so two strings sharing 90% of their utilities still get fully different obfuscated forms (no reuse). Verifiable by inspecting their output.
- **Provenance / OpenSSF / SBOM** : verifiable by checking each competitor's npm metadata and GitHub repo. As of 2026-04, neither competitor publishes with provenance attestations or has an OpenSSF Scorecard score.

If any of these claims becomes outdated (e.g. a competitor ships v4 support tomorrow), the comparison table — and this page — must be updated in the same PR.

---

## Things we will not implement

Some absences are by design, not by oversight. They live here so you don't waste time opening an issue for them.

### Runtime obfuscation

::: danger By-design : the obfuscator is build-time only
**Why** : a runtime obfuscator would need to ship a JavaScript class-mapping table to every visitor, defeating the entire bundle-shrink benefit (the table grows with the design system). It would also defeat reverse-engineering protection — the mapping is right there in the bundle.

**Alternative** : if you need per-request randomisation (e.g. to defeat scrapers that scrape your CSS class names today and your obfuscated names tomorrow), use a CDN-side rewrite layer instead of a runtime obfuscator. Several edge platforms can do this in 10 lines of Cloudflare Worker / Vercel Middleware.
:::

### Deobfuscation in the browser DevTools

::: danger By-design : we don't ship a DevTools extension
**Why** : the `.tw-obfuscation/class-mapping.json` file emitted at build time _is_ the deobfuscation. Open it in any text editor or pipe it through `jq` to reverse a `tw-XXX` to its original utility name.

**Alternative** : if you want a browser overlay that decodes classes live (e.g. for debugging in production), build it on top of the mapping JSON — it's a 50-line userscript. We'd happily link to a community extension if one exists.
:::

### Obfuscation that survives a downstream `tailwind-merge` call at runtime

::: warning By-design : tailwind-merge runs after the bundle is produced, so it can't be obfuscated retroactively
**Why** : `twMerge()` (from the `tailwind-merge` library) is a _runtime_ function that resolves Tailwind utility conflicts (e.g. `twMerge("p-4 p-2")` → `"p-2"`). The obfuscator runs at build time and produces a final mapping ; if `twMerge` then receives obfuscated strings at runtime, it cannot resolve their conflicts because it doesn't know what each `tw-XXX` originally meant.

**Workaround** : use `twMerge` BEFORE the obfuscator sees the final string. The standard pattern is to wrap `twMerge` inside `cn()` (the shadcn convention) which the obfuscator's AST extractor knows how to inspect — it sees the Tailwind utility string at build time, before `twMerge` is even invoked at runtime.

```jsx
// ✅ Recommended — twMerge runs at runtime on already-obfuscated strings,
//    but the AST extractor saw the original utilities through cn() at build time
import { cn } from "@/lib/utils";
<div className={cn("p-2 p-4", isActive && "p-6")} />;
```

**Tracked in** : intentional, see [test-shadcn-ui](https://github.com/josedacosta/tailwindcss-obfuscator/tree/main/apps/test-shadcn-ui) for the canonical pattern.
:::

---

## How to keep this page honest

Whenever a `❌` / `⚠️` / "Not supported" / "Partial" lands in the documentation, the project's documentation rule requires it to be paired with a card on this page (or a one-line link to the existing card). If you find a bare `❌` anywhere on the docs site without a card or link explaining it, please [open a doc bug](https://github.com/josedacosta/tailwindcss-obfuscator/issues/new/choose).
