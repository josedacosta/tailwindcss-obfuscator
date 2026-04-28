import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import TailwindCssObfuscator from "tailwindcss-obfuscator/webpack";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = resolve(__dirname, "dist");

// Inline HTML emitter that works in both `webpack` and `webpack serve` modes.
// We use the `processAssets` hook (REPORT stage, after MiniCssExtractPlugin)
// so the file is added to the compilation rather than written straight to
// disk — that way `webpack-dev-server` serves it from its in-memory FS.
class WriteHtmlPlugin {
  apply(compiler) {
    const PLUGIN_NAME = "WriteHtmlPlugin";
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: PLUGIN_NAME,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
        },
        (assets) => {
          const names = Object.keys(assets);
          const css = names.find((f) => f.endsWith(".css"));
          const js = names.find((f) => f.endsWith(".js"));
          const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Webpack + Tailwind v4 obfuscation test</title>
    ${css ? `<link rel="stylesheet" href="./${css}" />` : ""}
  </head>
  <body>
    <div id="app"></div>
    ${js ? `<script src="./${js}" defer></script>` : ""}
  </body>
</html>
`;
          compilation.emitAsset("index.html", new compiler.webpack.sources.RawSource(html));
        }
      );
    });
  }
}

export default {
  entry: "./src/main.js",
  output: {
    path: dist,
    filename: "main.[contenthash].js",
    clean: true,
  },
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
              postcssOptions: {
                plugins: ["@tailwindcss/postcss"],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "main.[contenthash].css",
    }),
    TailwindCssObfuscator({
      prefix: "tw-",
      verbose: true,
      debug: true,
      content: ["src/**/*.{html,js,jsx,ts,tsx}"],
      css: ["src/**/*.css"],
      preserve: { classes: ["no-obfuscate"] },
      mapping: {
        enabled: true,
        file: ".tw-obfuscation/class-mapping.json",
        pretty: 2,
      },
    }),
    new WriteHtmlPlugin(),
  ],
};
