---
"tailwindcss-obfuscator": patch
---

Test apps: added `apps/test-vite-react-v5/` to close the « claimed but untested Vite v5 » gap. The README advertises the supported Vite range as v4 → v8, but until now CI only exercised v6, v7, v8. The new app pins Vite v5.4 as the floor of the matrix. 105 classes extracted at 100 % obfuscation, no code change to the package needed.
