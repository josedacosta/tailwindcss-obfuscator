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

// Build JS first (no obfuscation needed: main.js holds no static class strings).
await esbuild.build({
  entryPoints: ["src/main.js"],
  bundle: true,
  outfile: "dist/main.js",
  format: "esm",
});

// Run the obfuscator pipeline against the built CSS and the source HTML.
const ctx = createContext(
  {
    prefix: "tw-",
    verbose: true,
    debug: true,
    content: ["src/**/*.html"],
    css: ["dist/styles.css"],
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

// Transform HTML and CSS, write to dist/.
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
console.log("Build complete!");
