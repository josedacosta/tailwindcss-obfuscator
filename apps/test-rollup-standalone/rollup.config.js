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
      title: "Rollup + Tailwind v4 obfuscation test",
      template: ({ files, title }) => {
        const cssLink = (files.css || [])
          .map((c) => `<link rel="stylesheet" href="./${c.fileName}">`)
          .join("\n    ");
        const jsScripts = (files.js || [])
          .map((c) => `<script type="module" src="./${c.fileName}"></script>`)
          .join("\n    ");
        return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${title}</title>
    ${cssLink}
  </head>
  <body>
    <div id="app"></div>
    ${jsScripts}
  </body>
</html>`;
      },
    }),
    tailwindcssObfuscator({
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
  ],
};
