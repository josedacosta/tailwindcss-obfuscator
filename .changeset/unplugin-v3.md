---
"tailwindcss-obfuscator": patch
---

Bump the internal `unplugin` core from v2 to v3 (landed in #93). The package's public API surface is unchanged ; all 10 plugin entries (`./vite`, `./webpack`, `./rollup`, `./esbuild`, `./rspack`, `./farm`, `./nuxt`, `./cli`, `./internals`, root) continue to resolve and import cleanly via both ESM and CJS — verified end-to-end by the tarball-smoke gate. Internal-only refresh.
