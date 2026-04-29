---
"tailwindcss-obfuscator": patch
---

Fix CodeQL `js/redos` (catastrophic-backtracking ReDoS, severity error) in the
two Vue `:class` / `v-bind:class` extraction patterns. The previous patterns
used a nested-quantifier shape (`[^"]*(?:'[^']*'[^"]*)*`) that allowed
exponential backtracking on pathological input. Replaced by a flat
`[^"]*` (and `[^']*`) negated character class. Loses support for nested
quotes inside Vue class bindings — an extreme edge case never covered by
existing tests; all 395 unit tests still pass.
