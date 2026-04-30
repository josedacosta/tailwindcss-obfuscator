---
"tailwindcss-obfuscator": patch
---

Fix `js/polynomial-redos` (CodeQL CWE-1333) in the `tv()` (tailwind-variants) extractor at `src/extractors/jsx.ts:396`. The previous regex `/tv\s*\(\s*\{[\s\S]*?base\s*:\s*["'\`]([^"'\`]+)["'\`]/g` had a polynomial-backtracking shape (`[\s\S]_?`lazy match before a literal`base`) that could be weaponised with crafted source code containing many `bas`runs without an`e`. The new flow extracts the balanced `tv({ ... })`block once, then runs a SAFE regex anchored at`\bbase`inside that bounded block — no`_?`over arbitrary characters before the keyword. Behaviour is unchanged ; the`base:`extraction still picks up the same string literals as before, verified by the existing`tv()` test cases.

Refs #50 (the actionable polynomial-redos finding ; the rest of the issue's count was made up of CodeQL warnings on dev-only test apps and tests — those don't ship to consumers).
