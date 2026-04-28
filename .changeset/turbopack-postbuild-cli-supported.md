---
"tailwindcss-obfuscator": patch
---

Turbopack support via post-build CLI — now officially documented and tested.

Turbopack does not expose a plugin API (no `processAssets` hook, no third-party loader chain, no public plugin SDK as of April 2026), so the Webpack plugin cannot attach to it directly. The supported workaround is the `tw-obfuscator` CLI run as a post-build step:

```jsonc
// package.json
{
  "scripts": {
    "build": "next build && tw-obfuscator run --build-dir .next --content 'app/**/*.{js,jsx,ts,tsx,mdx}' --content 'components/**/*.{js,jsx,ts,tsx,mdx}' --css 'app/**/*.css'",
  },
}
```

What lands :

- **`docs/guide/nextjs.md` Turbopack section flipped from `❌ not supported` to `✅ supported via post-build CLI`.** Two patterns documented side by side: Pattern A (post-build CLI, Turbopack-friendly) and Pattern B (opt-out with `--webpack`). Both produce the same final output.
- **`apps/test-nextjs/package.json` gains a `build:turbopack` script** demonstrating Pattern A end-to-end. Run `pnpm --filter test-nextjs build:turbopack` to reproduce.
- **New `tests/turbopack-postbuild.test.ts`** — 2 integration tests that simulate a minimal `.next/` output (CSS chunk + HTML pre-render + JS chunk) and verify the full extract → map → transform pipeline rewrites every reference consistently. Catches the "obfuscation silently skipped after the build" case.
- **Updated "Path forward" section** in the docs — Path 1 (post-build CLI) is now ✅ shipped; Paths 2 (`unplugin-turbopack`) and 3 (native Rust) remain speculative until upstream work lands.

No package code change — the CLI already supported `--build-dir .next` (default value). What changes is the official positioning + the regression test + the documentation.
