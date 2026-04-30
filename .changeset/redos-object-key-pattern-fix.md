---
"tailwindcss-obfuscator": patch
---

Fix `js/polynomial-redos` (CodeQL CWE-1333) in `OBJECT_KEY_PATTERN` (`src/extractors/jsx.ts:80`). The previous char class `[\w\-[\]#%.():/\s]+` included `\s` ; combined with the surrounding optional `['"]?` and trailing `\s*:` it allowed multiple ways to partition whitespace at the end of the capture group, with polynomial backtracking on crafted input like `{   :`. Dropping `\s` from the char class removes the ambiguity without changing real-world coverage — class names cannot contain whitespace, and multi-class keys are still handled by the caller via `extractClassesFromString(keyValue)`. Closes 4 CodeQL alerts (the 4 `OBJECT_KEY_PATTERN.exec()` use-sites at jsx.ts:172, 243, 266, 285).
