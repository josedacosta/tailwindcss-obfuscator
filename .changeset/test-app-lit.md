---
"tailwindcss-obfuscator": patch
---

Test apps: added `apps/test-lit/` exercising Lit (web components) v3 + Vite + Tailwind v4. Confirms the JSX/AST extractor handles `class="..."` attributes embedded inside Lit's `html\`\``tagged template literals (Babel parses the template's quasis and the existing JSXAttribute/HTML regex catches the class strings). 52 classes extracted at 100 % obfuscation, 0 % residual. No package code change needed; the only app-specific config was extending the`content`glob to include`\*_/_.ts` (Lit lives in .ts files, not .tsx).
