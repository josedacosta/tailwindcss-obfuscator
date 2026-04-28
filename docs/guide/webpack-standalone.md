# Webpack 5 (standalone)

Use the `tailwindcss-obfuscator/webpack` plugin directly in any Webpack 5 project (no meta-framework needed).

## Install

```bash
pnpm add -D tailwindcss-obfuscator @tailwindcss/postcss css-loader mini-css-extract-plugin postcss postcss-loader
```

## Configure Webpack

`webpack.config.js`:

```js
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TailwindCssObfuscator from "tailwindcss-obfuscator/webpack";

export default {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: { plugins: ["@tailwindcss/postcss"] },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "main.[contenthash].css" }),
    TailwindCssObfuscator({
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

> [!IMPORTANT]
> The plugin only runs in **production** by default (`webpack --mode production`). Pass `refresh: true` in the plugin options if you want it active in `webpack serve` too.

## webpack-dev-server

The plugin honours the in-memory FS of `webpack-dev-server`. You don't need a separate config for dev — the same `webpack.config.js` works for both `webpack` and `webpack serve`.

## Avoiding html-webpack-plugin

`html-webpack-plugin` runs HTML templates through a child compilation that conflicts with the obfuscator's transform loader. Either:

1. **Skip `html-webpack-plugin`** — emit the HTML manually via a tiny `processAssets:REPORT` plugin (see [`apps/test-webpack-standalone/webpack.config.js`](https://github.com/josedacosta/tailwindcss-obfuscator/blob/main/apps/test-webpack-standalone/webpack.config.js) for a 12-line example).
2. **Or upgrade html-webpack-plugin** when an upstream fix lands — track the issue at [unjs/unplugin#…](https://github.com/unjs/unplugin/issues).

## See also

- Sample app: [`apps/test-webpack-standalone`](https://github.com/josedacosta/tailwindcss-obfuscator/tree/main/apps/test-webpack-standalone)
- Next.js (Webpack-mode) guide: [`/guide/nextjs`](./nextjs.md)
