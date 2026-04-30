---
"tailwindcss-obfuscator": major
---

**BREAKING** : drop support for `vite` v4 / v5 / v6 / v7 in the declared peer range. The minimum supported peer is now `vite >=8.0.10`. The plugin core has not changed (the unplugin hooks `transform()` and `generateBundle()` are stable across vite v4–v8) ; the bump is for consistency with the apps under `apps/test-vite-*` which exercise vite v8 in CI.

Consumers on vite v4–v7 may continue to use `tailwindcss-obfuscator@<3.0.0` ; the underlying behaviour should still work on a vite v4–v7 install but is no longer regression-tested by us.
