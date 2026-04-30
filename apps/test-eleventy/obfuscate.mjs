/**
 * Post-build obfuscation pass for the Eleventy site.
 *
 * Runs the tailwindcss-obfuscator pipeline against:
 *   - every .html file under _site/ (HTML extractor walks each one)
 *   - the bundled _site/styles.css (CSS extractor + selector rewriter)
 *
 * Produces the obfuscated dist in-place by overwriting _site/*.html
 * and _site/styles.css with the transformed output.
 */

import * as fs from "node:fs";
import * as path from "node:path";
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

function listHtml(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listHtml(full));
    else if (entry.isFile() && entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

const ctx = createContext(
  {
    prefix: "tw-",
    verbose: true,
    debug: true,
    content: ["_site/**/*.html"],
    css: ["_site/styles.css"],
    mapping: { enabled: true, file: ".tw-obfuscation/class-mapping.json" },
  },
  "production"
);

const logger = createLogger(true, true);
const basePath = process.cwd();

initializeContext(ctx, basePath, logger);
await extractClasses(ctx, basePath, logger);
await extractFromCssFiles(ctx, basePath, logger);
updateMappingMetadata(ctx, ctx.detectedTailwindVersion || "unknown");

let totalReplacements = 0;

for (const htmlPath of listHtml("_site")) {
  const src = fs.readFileSync(htmlPath, "utf-8");
  const out = transformContent(src, htmlPath, ctx);
  fs.writeFileSync(htmlPath, out.transformed);
  totalReplacements += out.replacements;
  console.log(`[html] ${path.relative(basePath, htmlPath)}: ${out.replacements} replacements`);
}

const cssPath = "_site/styles.css";
if (fs.existsSync(cssPath)) {
  const src = fs.readFileSync(cssPath, "utf-8");
  const out = transformContent(src, cssPath, ctx);
  fs.writeFileSync(cssPath, out.transformed);
  totalReplacements += out.replacements;
  console.log(`[css]  ${cssPath}: ${out.replacements} replacements`);
}

saveMapping(ctx, basePath);
console.log(`\n✅ Obfuscation complete (${totalReplacements} total replacements).`);
