---
"tailwindcss-obfuscator": patch
---

Fix #61 — `tv()` (tailwind-variants) extractor was silently broken: classes inside `tv({ base, variants, compoundVariants, slots })` were not being extracted, leaving them un-obfuscated in production bundles. Two root causes :

1. **Registry routing**: `extractors/index.ts` mapped `js/jsx/ts/tsx/vue/svelte/astro` to `extractFromJsxWithCva` (which only handles `cva()`), bypassing `extractAllFromJsx` which composes the cn/cva/tv extractors. Now every JS-family extension uses `extractAllFromJsx`.

2. **Nested-object regex**: the `tv()` variants regex used `[\s\S]*?\}` which closes on the first inner `}` (e.g. `intent: { primary }` truncates after `primary`). Refactored `extractFromTailwindVariants` to use `extractBalancedBlock` for `variants`, `slots`, `compoundVariants`, `compoundSlots`, and `defaultVariants` — the same balanced-brace approach `cva()` already used.

The README claim "Recognises `tv()` out of the box" now holds end-to-end. New `apps/test-tailwind-variants/` regression test asserts that all 33 expected tv() classes (base + variants + compoundVariants across 2 tv() instances) appear in the post-build mapping.
