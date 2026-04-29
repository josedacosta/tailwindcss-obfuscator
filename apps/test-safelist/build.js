// Build the test-safelist app and verify the obfuscator's `exclude` option
// (a.k.a. safelist behaviour) keeps the listed class names unchanged in the
// emitted HTML and CSS.
//
// Mirrors the structure of apps/test-static-html/build.js and adds the
// `exclude` config block. After build, runs an in-process assertion that
// every preserved class is still present verbatim in dist/index.html and
// dist/styles.css, and that no `tw-*` substitution leaked onto them.

import * as esbuild from "esbuild";
import * as fs from "fs";
import {
  createContext,
  initializeContext,
  saveMapping,
  updateMappingMetadata,
  extractClasses,
  extractFromCssFiles,
  transformContent,
  createLogger,
} from "tailwindcss-obfuscator/internals";

if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist", { recursive: true });
}

await esbuild.build({
  entryPoints: ["src/main.js"],
  bundle: true,
  outfile: "dist/main.js",
  format: "esm",
});

// Real Tailwind utilities that we list in `exclude` to test the option for real.
// Tailwind WILL generate CSS for these (so the post-build CSS check is meaningful)
// and the obfuscator MUST keep them verbatim despite their being eligible.
const PRESERVED_LITERALS = ["bg-red-500", "text-yellow-300", "font-bold"];
const REGEX_PATTERN_PRESERVED = ["text-emerald-700", "text-emerald-900"]; // matched by /^text-emerald-/

const ctx = createContext(
  {
    prefix: "tw-",
    verbose: true,
    debug: true,
    content: ["src/**/*.html"],
    css: ["dist/styles.css"],
    mapping: { enabled: true, file: ".tw-obfuscation/class-mapping.json" },
    // The behaviour under test : both literal-string entries and a regex
    // pattern entry must be honoured. Anything matched here MUST appear
    // verbatim in the post-build HTML/CSS.
    exclude: [...PRESERVED_LITERALS, /^text-emerald-/],
  },
  "production"
);

const logger = createLogger(true, true);
const basePath = process.cwd();

initializeContext(ctx, basePath, logger);
await extractClasses(ctx, basePath, logger);
await extractFromCssFiles(ctx, basePath, logger);
updateMappingMetadata(ctx, ctx.detectedTailwindVersion || "unknown");

const htmlSrc = fs.readFileSync("src/index.html", "utf-8");
const htmlOut = transformContent(htmlSrc, "src/index.html", ctx);
fs.writeFileSync("dist/index.html", htmlOut.transformed);
console.log(`HTML: ${htmlOut.replacements} replacements`);

const cssPath = "dist/styles.css";
if (fs.existsSync(cssPath)) {
  const cssSrc = fs.readFileSync(cssPath, "utf-8");
  const cssOut = transformContent(cssSrc, cssPath, ctx);
  fs.writeFileSync(cssPath, cssOut.transformed);
  console.log(`CSS:  ${cssOut.replacements} replacements`);
}

saveMapping(ctx, basePath);

// === Assertions: the safelist behaviour MUST hold post-build ===
const builtHtml = fs.readFileSync("dist/index.html", "utf-8");
const builtCss = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, "utf-8") : "";
const allClassesToCheck = [...PRESERVED_LITERALS, ...REGEX_PATTERN_PRESERVED];

let failed = 0;
for (const cls of allClassesToCheck) {
  if (!builtHtml.includes(cls)) {
    console.error(
      `❌ FAIL: "${cls}" missing from dist/index.html (was obfuscated against the exclude rule)`
    );
    failed++;
  }
  // CSS check: same class must still produce a `.<cls>` selector in the
  // emitted stylesheet (not rewritten to `.tw-XXX`).
  if (builtCss && !builtCss.includes(`.${cls}`)) {
    console.error(
      `❌ FAIL: ".${cls}" CSS selector missing from dist/styles.css (rule was obfuscated against the exclude)`
    );
    failed++;
  }
}

// And the mapping file must NOT contain any of the preserved classes.
const mapPath = ".tw-obfuscation/class-mapping.json";
if (fs.existsSync(mapPath)) {
  const mapping = JSON.parse(fs.readFileSync(mapPath, "utf-8"));
  const mappedClasses = Object.keys(mapping.mapping || mapping);
  for (const cls of allClassesToCheck) {
    if (mappedClasses.includes(cls)) {
      console.error(`❌ FAIL: "${cls}" present in class-mapping.json — should have been excluded`);
      failed++;
    }
  }
}

if (failed > 0) {
  console.error(`\n${failed} assertion(s) failed — exclude / safelist option is BROKEN.`);
  process.exit(1);
}

console.log(
  `✅ All ${allClassesToCheck.length} excluded classes preserved verbatim — safelist works.`
);
console.log("Build complete!");
