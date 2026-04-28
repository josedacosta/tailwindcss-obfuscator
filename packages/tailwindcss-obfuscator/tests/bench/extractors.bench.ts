/**
 * Performance benchmarks for the extractor and transformer hot paths.
 *
 * Run with: `pnpm --filter tailwindcss-obfuscator vitest bench`
 *
 * The benchmarks construct synthetic but realistic inputs (a 5 kB JSX file,
 * a 10 kB CSS file) and report ops/sec on the public extractor and
 * transformer entry points. Keeping them here lets us catch perf
 * regressions before they ship.
 */

import { bench, describe } from "vitest";
import { extractFromJsx, extractFromCss } from "../../src/extractors/index.js";
import { transformCss } from "../../src/transformers/css.js";
import { transformJsxAst } from "../../src/transformers/jsx-ast.js";
import { isTailwindClass } from "../../src/core/patterns/index.js";

const JSX_SAMPLE = Array.from(
  { length: 80 },
  (_, i) => `
function Card${i}() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md hover:bg-gray-50 dark:bg-gray-800">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Title ${i}</h2>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
        Lorem ipsum dolor sit amet.
      </p>
      <button className={cn("mt-4 px-4 py-2 rounded", "bg-blue-500 text-white", isActive && "ring-2 ring-blue-300")}>
        Click ${i}
      </button>
    </div>
  );
}`
).join("\n");

const CSS_SAMPLE = Array.from(
  { length: 200 },
  (_, i) => `
.bg-color-${i} { background: hsl(${i * 2}deg 60% 50%); }
.text-size-${i} { font-size: ${i + 10}px; }
.hover\\:bg-color-${i}:hover { background: hsl(${i * 2}deg 80% 60%); }`
).join("\n");

const SAMPLE_MAPPING = new Map<string, string>(
  ["bg-white", "rounded-lg", "p-6", "shadow-md", "text-xl", "font-bold"].map((c, i) => [
    c,
    `tw-${i}`,
  ])
);

describe("extractor benchmarks", () => {
  bench("extractFromJsx (80 cards)", () => {
    extractFromJsx(JSX_SAMPLE, "/sample.tsx");
  });

  bench("extractFromCss (200 rules)", () => {
    extractFromCss(CSS_SAMPLE, "/sample.css");
  });

  bench("isTailwindClass (1k tokens)", () => {
    for (let i = 0; i < 1000; i++) {
      isTailwindClass("hover:bg-red-500");
      isTailwindClass("not-a-tailwind-class");
      isTailwindClass("md:flex");
      isTailwindClass("dark:hover:bg-blue-700");
    }
  });
});

describe("transformer benchmarks", () => {
  bench("transformCss (200 rules)", () => {
    transformCss(CSS_SAMPLE, "/sample.css", SAMPLE_MAPPING, { sourcemap: false });
  });

  bench("transformJsxAst (80 cards)", () => {
    transformJsxAst(JSX_SAMPLE, "/sample.tsx", SAMPLE_MAPPING, {
      sourcemap: false,
    });
  });
});
