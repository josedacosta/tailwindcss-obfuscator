/**
 * Tests for class extractors
 */

import { describe, it, expect } from "vitest";
import {
  extractFromHtml,
  extractFromHtmlAggressive,
  extractFromJsx,
  extractFromJsxWithCva,
  extractFromCss,
  extractFromTailwindV4Css,
  isTailwindClass,
  deduplicateClasses,
  detectTailwindVersion,
} from "../src/extractors/index.js";

describe("extractFromHtml", () => {
  it("should extract classes from class attribute", () => {
    const html = `<div class="flex items-center justify-between">Hello</div>`;
    const classes = extractFromHtml(html);

    expect(classes).toContain("flex");
    expect(classes).toContain("items-center");
    expect(classes).toContain("justify-between");
  });

  it("should extract classes from multiple elements", () => {
    const html = `
<div class="flex">
  <span class="text-red-500">Hello</span>
  <button class="bg-blue-500 text-white">Click</button>
</div>`;
    const classes = extractFromHtml(html);

    expect(classes).toContain("flex");
    expect(classes).toContain("text-red-500");
    expect(classes).toContain("bg-blue-500");
    expect(classes).toContain("text-white");
  });

  it("should handle single quotes", () => {
    const html = `<div class='flex items-center'>Hello</div>`;
    const classes = extractFromHtml(html);

    expect(classes).toContain("flex");
    expect(classes).toContain("items-center");
  });

  it("should handle empty class attribute", () => {
    const html = `<div class="">Hello</div>`;
    const classes = extractFromHtml(html);

    expect(classes).toEqual([]);
  });

  it("should handle Tailwind variants", () => {
    const html = `<div class="hover:bg-red-500 focus:ring-2 md:flex">Hello</div>`;
    const classes = extractFromHtml(html);

    expect(classes).toContain("hover:bg-red-500");
    expect(classes).toContain("focus:ring-2");
    expect(classes).toContain("md:flex");
  });

  it("should handle negative values", () => {
    const html = `<div class="mt-4 translate-x-1/2">Hello</div>`;
    const classes = extractFromHtml(html);

    expect(classes).toContain("mt-4");
    expect(classes).toContain("translate-x-1/2");
  });
});

describe("extractFromHtmlAggressive", () => {
  it("should extract all potential class-like strings", () => {
    const html = `
<div class="flex" data-class="items-center">
  <span style="color: red">Hello</span>
</div>`;
    const classes = extractFromHtmlAggressive(html);

    expect(classes).toContain("flex");
    expect(classes).toContain("items-center");
  });

  it("should filter out non-class strings", () => {
    const html = `<div class="flex" style="display: none">Hello</div>`;
    const classes = extractFromHtmlAggressive(html);

    expect(classes).toContain("flex");
    expect(classes).not.toContain("display");
    expect(classes).not.toContain("none");
  });
});

describe("extractFromJsx", () => {
  it("should extract classes from className prop", () => {
    const jsx = `<div className="flex items-center">Hello</div>`;
    const classes = extractFromJsx(jsx);

    expect(classes).toContain("flex");
    expect(classes).toContain("items-center");
  });

  it("should extract classes from template literals", () => {
    const jsx = "<div className={`flex items-center`}>Hello</div>";
    const classes = extractFromJsx(jsx);

    expect(classes).toContain("flex");
    expect(classes).toContain("items-center");
  });

  it("should extract classes from cn() calls", () => {
    const jsx = `const cls = cn("flex", "items-center");`;
    const classes = extractFromJsx(jsx);

    expect(classes).toContain("flex");
    expect(classes).toContain("items-center");
  });

  it("should extract classes from clsx() calls", () => {
    const jsx = `const cls = clsx("flex", "items-center");`;
    const classes = extractFromJsx(jsx);

    expect(classes).toContain("flex");
    expect(classes).toContain("items-center");
  });

  it("should extract classes from twMerge() calls", () => {
    const jsx = `const cls = twMerge("flex", "items-center");`;
    const classes = extractFromJsx(jsx);

    expect(classes).toContain("flex");
    expect(classes).toContain("items-center");
  });

  it("should handle complex React components", () => {
    const jsx = `
function Button() {
  return (
    <button className="flex items-center justify-center">
      Click me
    </button>
  );
}`;
    const classes = extractFromJsx(jsx);

    expect(classes).toContain("flex");
    expect(classes).toContain("items-center");
    expect(classes).toContain("justify-center");
  });
});

describe("extractFromJsxWithCva", () => {
  it("should extract classes from cva() definitions", () => {
    const jsx = `
const buttonVariants = cva("flex items-center", {});`;
    const classes = extractFromJsxWithCva(jsx);

    expect(classes).toContain("flex");
    expect(classes).toContain("items-center");
  });

  it("should extract classes from string literals in cva", () => {
    const jsx = `const btn = cva("bg-blue-500 text-white");`;
    const classes = extractFromJsxWithCva(jsx);

    expect(classes).toContain("bg-blue-500");
    expect(classes).toContain("text-white");
  });
});

describe("extractFromCss", () => {
  it("should extract class names from CSS selectors", () => {
    const css = `
.flex { display: flex; }
.items-center { align-items: center; }
.bg-red-500 { background-color: red; }`;
    const classes = extractFromCss(css);

    expect(classes).toContain("flex");
    expect(classes).toContain("items-center");
    expect(classes).toContain("bg-red-500");
  });

  it("should handle escaped selectors", () => {
    const css = `.hover\\:bg-red-500:hover { background-color: red; }`;
    const classes = extractFromCss(css);

    expect(classes).toContain("hover:bg-red-500");
  });

  it("should handle combined selectors", () => {
    const css = `.flex.items-center { display: flex; align-items: center; }`;
    const classes = extractFromCss(css);

    expect(classes).toContain("flex");
    expect(classes).toContain("items-center");
  });

  it("should skip ID selectors", () => {
    const css = `#container { display: flex; }`;
    const classes = extractFromCss(css);

    expect(classes).not.toContain("container");
  });

  it("should skip element selectors", () => {
    const css = `div { display: flex; }`;
    const classes = extractFromCss(css);

    expect(classes).toEqual([]);
  });
});

describe("extractFromTailwindV4Css", () => {
  it("should extract classes from @layer utilities", () => {
    const css = `
@layer utilities {
  .flex { display: flex; }
  .grid { display: grid; }
}`;
    const classes = extractFromTailwindV4Css(css);

    expect(classes).toContain("flex");
    expect(classes).toContain("grid");
  });

  it("should handle @theme blocks", () => {
    const css = `
@theme {
  --color-primary: #3490dc;
}
.flex { display: flex; }`;
    const classes = extractFromTailwindV4Css(css);

    expect(classes).toContain("flex");
    expect(classes).not.toContain("--color-primary");
  });
});

describe("isTailwindClass", () => {
  it("should return true for Tailwind utility classes", () => {
    expect(isTailwindClass("flex")).toBe(true);
    expect(isTailwindClass("grid")).toBe(true);
    expect(isTailwindClass("block")).toBe(true);
    expect(isTailwindClass("hidden")).toBe(true);
  });

  it("should return true for Tailwind spacing classes", () => {
    expect(isTailwindClass("p-4")).toBe(true);
    expect(isTailwindClass("m-2")).toBe(true);
    expect(isTailwindClass("px-4")).toBe(true);
    expect(isTailwindClass("mt-8")).toBe(true);
  });

  it("should return true for Tailwind color classes", () => {
    expect(isTailwindClass("bg-red-500")).toBe(true);
    expect(isTailwindClass("text-blue-600")).toBe(true);
    expect(isTailwindClass("border-gray-300")).toBe(true);
  });

  it("should return true for Tailwind variants", () => {
    expect(isTailwindClass("hover:bg-red-500")).toBe(true);
    expect(isTailwindClass("focus:ring-2")).toBe(true);
    expect(isTailwindClass("md:flex")).toBe(true);
    expect(isTailwindClass("dark:bg-gray-800")).toBe(true);
  });

  it("should return false for URLs and paths", () => {
    expect(isTailwindClass("/path/to/file")).toBe(false);
    expect(isTailwindClass("https://example.com")).toBe(false);
  });

  it("should return false for numbers and hex colors", () => {
    expect(isTailwindClass("123")).toBe(false);
    expect(isTailwindClass("#ff0000")).toBe(false);
  });
});

describe("deduplicateClasses", () => {
  it("should remove duplicate classes and sort", () => {
    const classes = ["flex", "items-center", "flex", "bg-red-500", "items-center"];
    const deduplicated = deduplicateClasses(classes);

    expect(deduplicated).toHaveLength(3);
    expect(deduplicated).toContain("flex");
    expect(deduplicated).toContain("items-center");
    expect(deduplicated).toContain("bg-red-500");
  });

  it("should sort the result alphabetically", () => {
    const classes = ["c", "a", "b"];
    const deduplicated = deduplicateClasses(classes);

    expect(deduplicated).toEqual(["a", "b", "c"]);
  });

  it("should handle empty array", () => {
    expect(deduplicateClasses([])).toEqual([]);
  });

  it("should handle array with no duplicates", () => {
    const classes = ["flex", "grid", "block"];
    const deduplicated = deduplicateClasses(classes);

    expect(deduplicated).toHaveLength(3);
    expect(deduplicated).toContain("flex");
    expect(deduplicated).toContain("grid");
    expect(deduplicated).toContain("block");
  });
});

describe("detectTailwindVersion", () => {
  it("should detect Tailwind v3 from @tailwind directives", () => {
    const css = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

    expect(detectTailwindVersion(css)).toBe("3");
  });

  it("should detect Tailwind v4 from @import", () => {
    const css = `@import "tailwindcss";`;

    expect(detectTailwindVersion(css)).toBe("4");
  });

  it("should detect Tailwind v4 from @theme", () => {
    const css = `@theme {
  --color-primary: #3490dc;
}`;

    expect(detectTailwindVersion(css)).toBe("4");
  });

  it("should return null for unknown CSS", () => {
    const css = `.custom { color: red; }`;

    expect(detectTailwindVersion(css)).toBeNull();
  });
});
