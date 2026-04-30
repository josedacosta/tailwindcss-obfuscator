---
"tailwindcss-obfuscator": patch
---

Documentation: removed the stale « tv() currently broken » card on the Limitations page. The fix shipped in PR #63 (issue #61 closed) on 2026-04-29 and is verified end-to-end on every release by `apps/test-tailwind-variants/`. The card now correctly says supported, with a single noted caveat (multi-element `slot` API not yet in test matrix).
