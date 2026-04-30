---
"tailwindcss-obfuscator": patch
---

Test apps: added `apps/test-eleventy/` exercising Eleventy (11ty) v3 + Tailwind v4 + the `tailwindcss-obfuscator/internals` CLI-mode pipeline. Eleventy emits multi-page HTML output from Nunjucks templates; the post-build pass walks every `_site/**/*.html` page and rewrites `_site/styles.css` in lockstep. 78 classes extracted at 100 % CSS obfuscation, 0 % residual. Adds `_site` to the `verify-obfuscation.mjs` build-dir search list so the new app (and any future Eleventy/Jekyll app) is auto-detected.
