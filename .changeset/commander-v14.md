---
"tailwindcss-obfuscator": patch
---

Bump `commander` from v12 to v14 (internal CLI parsing dependency, landed in #89). The CLI surface (`tw-obfuscator --help`, `tw-obfuscator run`, flags) is unchanged ; the bump is covered by the tarball-smoke gate that runs `tw-obfuscator --version` after `npm install` of the freshly-packed tarball. Note : commander 14 requires Node.js v20+ which is already the package's documented minimum.
