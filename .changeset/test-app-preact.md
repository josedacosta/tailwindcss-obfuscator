---
"tailwindcss-obfuscator": patch
---

Test apps: added `apps/test-preact/` exercising Preact + Vite + Tailwind v4. Verifies the JSX extractor correctly handles Preact's `class` attribute (vs React's `className`) and signal-based reactive class bindings. 50 classes extracted at 100 % obfuscation coverage with 0 % residual on first build, no code change to the package needed.
