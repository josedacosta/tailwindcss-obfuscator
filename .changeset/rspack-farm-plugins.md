---
"tailwindcss-obfuscator": minor
---

feat(plugins): add Rspack and Farm bundler adapters

Two new entry points complete the bundler matrix:

- `tailwindcss-obfuscator/rspack` — for Rspack 1.x users (the Rust-based Webpack-compatible bundler).
- `tailwindcss-obfuscator/farm` — for Farm 1.x users (the Rust-based all-in-one bundler).

Both delegate to the same shared `unplugin` core that powers Vite/Webpack/Rollup/esbuild, so feature parity is automatic — same options, same lifecycle, same caching. Both peer dependencies (`@rspack/core`, `@farmfe/core`) are optional.

```ts
// rspack.config.js
import TailwindObfuscator from "tailwindcss-obfuscator/rspack";
export default { plugins: [TailwindObfuscator()] };

// farm.config.ts
import TailwindObfuscator from "tailwindcss-obfuscator/farm";
export default { plugins: [TailwindObfuscator()] };
```
