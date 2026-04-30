---
"tailwindcss-obfuscator": patch
---

Close 5 more `js/polynomial-redos` (CodeQL CWE-1333) findings in the package source :

- `src/extractors/jsx.ts:346` (cva `compoundVariants` — `[\s\S]*?` lazy match before `]`)
- `src/extractors/jsx.ts:361` (cva `defaultVariants` — `[\s\S]*?` lazy match before `}`)
- `src/transformers/jsx.ts:20` `CLASSNAME_STRING_PATTERN` (`[^"']*?` lazy non-greedy with backref)
- `src/transformers/jsx.ts:235` `compiledPattern` (same shape, with backtick variant)
- `src/transformers/jsx.ts:258` `classAttrPattern` (same shape, with escape variant)

The cva fixes use the same balanced-block traversal as the tv() fix in PR #106. The transformer fixes drop the redundant lazy `?` from `[^"']*?\1` — the negated character class already excludes the quote chars that could end the match, so the backreference has zero ambiguity ; non-greedy was never needed and was the source of CodeQL's polynomial-redos signature.

Behaviour is bit-identical for valid input. Combined with PR #106, this closes 6/6 polynomial-redos findings in shipped src/ code (issue #50). The remaining CodeQL warnings of the same family live in dev-only test apps and scripts, which are not shipped to consumers.
