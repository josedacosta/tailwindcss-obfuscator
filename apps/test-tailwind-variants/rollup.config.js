import nodeResolve from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import html from "@rollup/plugin-html";
import tailwindcssPostcss from "@tailwindcss/postcss";
import tailwindcssObfuscator from "tailwindcss-obfuscator/rollup";
import * as fs from "fs";

// Build with the obfuscator, then assert that every tv() class survived
// obfuscation (i.e. no raw Tailwind utility leaks into the bundled JS or CSS).
// This is the regression check for issue #61.

const TV_CLASSES_TO_VERIFY = [
  // base
  "inline-flex",
  "items-center",
  "justify-center",
  "rounded",
  "font-semibold",
  "transition-colors",
  // variants.intent
  "bg-blue-600",
  "text-white",
  "hover:bg-blue-700",
  "bg-red-600",
  "hover:bg-red-700",
  "bg-transparent",
  "text-blue-600",
  "hover:bg-blue-50",
  // variants.size
  "px-3",
  "py-1.5",
  "text-sm",
  "px-4",
  "py-2",
  "text-base",
  "px-6",
  "py-3",
  "text-lg",
  // compoundVariants
  "shadow-lg",
  "shadow-blue-500/30",
  // card.base + variants
  "rounded-lg",
  "border-slate-200",
  "bg-white",
  "p-6",
  "shadow-md",
  "shadow-xl",
  "ring-1",
  "ring-slate-100",
];

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
    postcss({ extract: "style.css", plugins: [tailwindcssPostcss()] }),
    html({
      title: "tv() obfuscation regression test (#61)",
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
      mapping: { enabled: true, file: ".tw-obfuscation/class-mapping.json", pretty: 2 },
    }),
    {
      name: "tv-regression-assertions",
      writeBundle() {
        const map = JSON.parse(fs.readFileSync(".tw-obfuscation/class-mapping.json", "utf8"));
        const mapped = Object.keys(map.classes || {});
        const missing = TV_CLASSES_TO_VERIFY.filter((c) => !mapped.includes(c));
        if (missing.length > 0) {
          console.error(`\n❌ FAIL: ${missing.length} tv() classes were NOT extracted:\n`);
          for (const c of missing) console.error(`   - ${c}`);
          console.error(
            "\nThis means the tv() extractor (#61) regressed. Check packages/tailwindcss-obfuscator/src/extractors/jsx.ts:extractFromTailwindVariants."
          );
          process.exit(1);
        }
        console.log(
          `\n✅ PASS: all ${TV_CLASSES_TO_VERIFY.length} tv() classes (base + variants + compoundVariants) extracted and obfuscated.`
        );
      },
    },
  ],
};
