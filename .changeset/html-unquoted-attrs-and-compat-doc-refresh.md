---
"tailwindcss-obfuscator": patch
---

HTML unquoted attribute support + compatibility-matrix accuracy refresh.

**Unquoted HTML attributes are now supported.** The HTML5 spec allows `class=foo-bar` (unquoted, no whitespace in value), and static templates in the wild routinely use this form. Previously, the extractor and the transformer only matched `class="..."` and `class='...'`, silently skipping every unquoted occurrence. Both now match the three forms the spec defines:

- double-quoted `class="foo bar"`
- single-quoted `class='foo bar'`
- unquoted `class=foo-bar`

The pattern also tightens the leading boundary from `\b` to `(?:^|[\s<])` so that `data-class="..."` no longer accidentally matches the `class=` substring inside it (this was a latent false-positive that affected `transformHtml` and the data-attr transformer).

**Compatibility doc refresh — arbitrary values are fully supported, not partial.** The `/reference/compatibility` page previously marked `[color:red]`, `bg-[url('/img.png')]`, `w-[calc(100%-20px)]`, `bg-[var(--my-color)]`, and `bg-blue-500/[.25]` as ⚠️ partial-obfuscation. They are in fact fully supported end-to-end (`splitClassString` respects `[...]` and `(...)` so the values survive intact, and `isTailwindClass` recognises every arbitrary-property pattern). The compatibility table now reads ✅ for all of them, matching reality.

Adds `tests/html-unquoted-attrs.test.ts` (8 new regression guards covering the three quote forms in extraction, transformation, arbitrary-value preservation, and the fixed `data-*` boundary). Updates two existing `transformHtmlWithDataAttrs` tests that were relying on the broken `data-class` false-positive to instead assert the correct opt-in behaviour via `dataAttributes: ["data-class"]`.
