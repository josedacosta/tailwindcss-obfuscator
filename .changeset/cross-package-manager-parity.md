---
"tailwindcss-obfuscator": patch
---

Cross-package-manager parity (npm / yarn / pnpm) — fixes 2 silent bugs that broke downstream tooling on every PM equally.

**`./package.json` is now exported.** Previously, downstream tools that read the package metadata via `require("tailwindcss-obfuscator/package.json")` (Vite, Webpack, esbuild bundle analysis, Next.js framework probes, IDE TS plugins) crashed with `ERR_PACKAGE_PATH_NOT_EXPORTED` on Node 20+. The `exports` map now declares `"./package.json": "./package.json"`.

**`engines` no longer pins pnpm.** The published package previously declared `engines.pnpm: ">=9.0.0"`, which leaked the maintainer's local toolchain to consumers and triggered `EBADENGINE` warnings on `npm install` / `yarn add`. Only `engines.node: ">=18.0.0"` remains (and is the only legit constraint for a published library).

**CLI version is now read from `package.json` at runtime.** `tw-obfuscator --version` was hardcoded to `1.0.0` and never updated. It now resolves the live version via `createRequire(import.meta.url)("../../package.json").version`, so it always matches the installed package.

A new test file `tests/package-exports.test.ts` adds 19 regression guards (every plugin entry has ESM + CJS + types, every optional bundler peerDep is marked optional, `./package.json` is exported, `engines` contains only `node`) so these bugs cannot silently re-appear.
