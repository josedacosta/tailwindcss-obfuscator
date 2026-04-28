# Rollup (standalone)

Use the `tailwindcss-obfuscator/rollup` plugin in any Rollup project (no Vite needed).

## Install

```bash
pnpm add -D tailwindcss-obfuscator @tailwindcss/postcss postcss rollup rollup-plugin-postcss @rollup/plugin-node-resolve @rollup/plugin-html
```

## Configure Rollup

`rollup.config.js`:

```js
import nodeResolve from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import html from "@rollup/plugin-html";
import tailwindcssPostcss from "@tailwindcss/postcss";
import tailwindcssObfuscator from "tailwindcss-obfuscator/rollup";

export default {
  input: "src/main.js",
  output: {
    dir: "dist",
    format: "es",
    entryFileNames: "[name]-[hash].js",
    assetFileNames: "[name]-[hash][extname]",
  },
  plugins: [
    nodeResolve(),
    postcss({
      extract: "style.css",
      plugins: [tailwindcssPostcss()],
    }),
    html({
      title: "My App",
      template: ({ files }) => {
        const cssLink = (files.css || [])
          .map((c) => `<link rel="stylesheet" href="./${c.fileName}">`)
          .join("\n");
        const jsScripts = (files.js || [])
          .map((c) => `<script type="module" src="./${c.fileName}"></script>`)
          .join("\n");
        return `<!doctype html><html><head>${cssLink}</head><body><div id="app"></div>${jsScripts}</body></html>`;
      },
    }),
    tailwindcssObfuscator({
      prefix: "tw-",
      content: ["src/**/*.{html,js,jsx,ts,tsx}"],
      css: ["src/**/*.css"],
      preserve: { classes: ["no-obfuscate"] },
      mapping: {
        enabled: true,
        file: ".tw-obfuscation/class-mapping.json",
        pretty: 2,
      },
    }),
  ],
};
```

## Why pass `content` and `css` explicitly

The default extractor globs (`**/*.{html,jsx,tsx,vue,svelte,astro}`) match meta-framework conventions but a plain Rollup project usually keeps everything under `src/`. Setting `content` and `css` explicitly avoids picking up `node_modules` files and matches your actual entrypoints.

## Buffer-emitted CSS

`rollup-plugin-postcss` writes the extracted CSS as a `Uint8Array` asset, not a string. The obfuscator's Rollup adapter handles both transparently — no extra config needed.

## See also

- Sample app: [`apps/test-rollup-standalone`](https://github.com/josedacosta/tailwindcss-obfuscator/tree/main/apps/test-rollup-standalone)
- Vite plugin guide (Vite uses Rollup under the hood for builds): [`/guide/vite`](./vite.md)
