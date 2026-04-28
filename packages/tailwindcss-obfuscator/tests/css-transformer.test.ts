/**
 * Tests for CSS transformers (regex and PostCSS)
 */

import { describe, it, expect } from "vitest";
import { transformCss, transformTailwindV4Css, isCssContent } from "../src/transformers/css.js";
import {
  transformCssPostcss,
  transformTailwindV4CssPostcss,
} from "../src/transformers/css-postcss.js";

describe("transformCss (regex-based)", () => {
  const mapping = new Map([
    ["flex", "tw-a"],
    ["items-center", "tw-b"],
    ["justify-between", "tw-c"],
    ["bg-red-500", "tw-d"],
    ["hover:bg-red-600", "tw-e"],
    ["text-white", "tw-f"],
  ]);

  it("should transform simple class selectors", () => {
    const css = `.flex { display: flex; }`;
    const result = transformCss(css, "test.css", mapping);

    expect(result.transformed).toBe(`.tw-a { display: flex; }`);
    expect(result.replacements).toBe(1);
    expect(result.replacedClasses).toContain("flex");
  });

  it("should transform multiple class selectors", () => {
    const css = `.flex { display: flex; }
.items-center { align-items: center; }`;
    const result = transformCss(css, "test.css", mapping);

    expect(result.transformed).toContain(".tw-a");
    expect(result.transformed).toContain(".tw-b");
    expect(result.replacements).toBe(2);
  });

  it("should transform combined selectors", () => {
    const css = `.flex.items-center { display: flex; align-items: center; }`;
    const result = transformCss(css, "test.css", mapping);

    expect(result.transformed).toContain(".tw-a");
    expect(result.transformed).toContain(".tw-b");
  });

  it("should transform escaped selectors (Tailwind variants)", () => {
    const css = `.hover\\:bg-red-600:hover { background-color: red; }`;
    const result = transformCss(css, "test.css", mapping);

    expect(result.transformed).toContain("tw-e");
    expect(result.replacedClasses).toContain("hover:bg-red-600");
  });

  it("should not transform classes not in mapping", () => {
    const css = `.unknown-class { color: blue; }`;
    const result = transformCss(css, "test.css", mapping);

    expect(result.transformed).toBe(css);
    expect(result.replacements).toBe(0);
  });

  it("should generate source map when enabled", () => {
    const css = `.flex { display: flex; }`;
    const result = transformCss(css, "test.css", mapping, { sourcemap: true });

    expect(result.map).toBeDefined();
  });

  it("should not generate source map when disabled", () => {
    const css = `.flex { display: flex; }`;
    const result = transformCss(css, "test.css", mapping, { sourcemap: false });

    expect(result.map).toBeUndefined();
  });
});

describe("transformTailwindV4Css (regex-based)", () => {
  const mapping = new Map([
    ["flex", "tw-a"],
    ["items-center", "tw-b"],
    ["p-4", "tw-c"],
  ]);

  it("should transform Tailwind v4 CSS with @layer", () => {
    const css = `@layer utilities {
  .flex { display: flex; }
  .p-4 { padding: 1rem; }
}`;
    const result = transformTailwindV4Css(css, "test.css", mapping);

    expect(result.transformed).toContain(".tw-a");
    expect(result.transformed).toContain(".tw-c");
  });

  it("should handle @theme blocks", () => {
    const css = `@theme {
  --color-primary: #3490dc;
}
.flex { display: flex; }`;
    const result = transformTailwindV4Css(css, "test.css", mapping);

    expect(result.transformed).toContain("--color-primary");
    expect(result.transformed).toContain(".tw-a");
  });

  it("should skip CSS variables", () => {
    const css = `.--custom-var { color: var(--custom-var); }`;
    const result = transformTailwindV4Css(css, "test.css", mapping);

    expect(result.transformed).toBe(css);
    expect(result.replacements).toBe(0);
  });
});

describe("transformCssPostcss (PostCSS-based)", () => {
  const mapping = new Map([
    ["flex", "tw-a"],
    ["items-center", "tw-b"],
    ["justify-between", "tw-c"],
    ["bg-red-500", "tw-d"],
    ["hover:bg-red-600", "tw-e"],
    ["p-4", "tw-f"],
  ]);

  it("should transform simple class selectors", () => {
    const css = `.flex { display: flex; }`;
    const result = transformCssPostcss(css, "test.css", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.replacements).toBe(1);
  });

  it("should transform nested selectors", () => {
    const css = `.flex .items-center { color: red; }`;
    const result = transformCssPostcss(css, "test.css", mapping);

    expect(result.transformed).toContain(".tw-a .tw-b");
  });

  it("should transform child selectors", () => {
    const css = `.flex > .items-center { color: red; }`;
    const result = transformCssPostcss(css, "test.css", mapping);

    expect(result.transformed).toContain(".tw-a > .tw-b");
  });

  it("should transform sibling selectors", () => {
    const css = `.flex + .items-center { color: red; }`;
    const result = transformCssPostcss(css, "test.css", mapping);

    expect(result.transformed).toContain(".tw-a + .tw-b");
  });

  it("should handle pseudo-classes", () => {
    const css = `.flex:hover { color: red; }`;
    const result = transformCssPostcss(css, "test.css", mapping);

    expect(result.transformed).toContain(".tw-a:hover");
  });

  it("should handle pseudo-elements", () => {
    const css = `.flex::before { content: ""; }`;
    const result = transformCssPostcss(css, "test.css", mapping);

    expect(result.transformed).toContain(".tw-a::before");
  });

  it("should handle attribute selectors", () => {
    const css = `.flex[data-active] { color: red; }`;
    const result = transformCssPostcss(css, "test.css", mapping);

    expect(result.transformed).toContain(".tw-a[data-active]");
  });

  it("should preserve classes in preserveClasses option", () => {
    const css = `.flex { display: flex; }`;
    const result = transformCssPostcss(css, "test.css", mapping, {
      preserveClasses: ["flex"],
    });

    expect(result.transformed).toBe(css);
    expect(result.replacements).toBe(0);
  });

  it("should ignore Vue scoped selectors when ignoreVueScoped is true", () => {
    const css = `.flex[data-v-abc123] { display: flex; }`;
    const result = transformCssPostcss(css, "test.css", mapping, {
      ignoreVueScoped: true,
    });

    expect(result.transformed).toBe(css);
  });

  it("should transform Vue scoped selectors when ignoreVueScoped is false", () => {
    const css = `.flex[data-v-abc123] { display: flex; }`;
    const result = transformCssPostcss(css, "test.css", mapping, {
      ignoreVueScoped: false,
    });

    expect(result.transformed).toContain("tw-a");
  });

  it("should handle media queries", () => {
    const css = `@media (min-width: 768px) {
  .flex { display: flex; }
}`;
    const result = transformCssPostcss(css, "test.css", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.transformed).toContain("@media");
  });

  it("should return original content on parse error", () => {
    const invalidCss = `.flex { display: flex`;
    const result = transformCssPostcss(invalidCss, "test.css", mapping);

    expect(result.replacements).toBe(0);
  });
});

describe("transformTailwindV4CssPostcss", () => {
  const mapping = new Map([
    ["flex", "tw-a"],
    ["p-4", "tw-b"],
  ]);

  it("should transform Tailwind v4 CSS", () => {
    const css = `@layer utilities {
  .flex { display: flex; }
}`;
    const result = transformTailwindV4CssPostcss(css, "test.css", mapping);

    expect(result.transformed).toContain("tw-a");
  });
});

describe("isCssContent", () => {
  it("should return true for CSS content", () => {
    expect(isCssContent(`.flex { display: flex; }`)).toBe(true);
    expect(isCssContent(`body { margin: 0; }`)).toBe(true);
  });

  it("should return false for JavaScript content", () => {
    expect(isCssContent(`const x = 1;`)).toBe(false);
    expect(isCssContent(`import { Component } from 'react';`)).toBe(false);
    expect(isCssContent(`export default function() {}`)).toBe(false);
  });

  it("should return false for mixed content", () => {
    const jsWithTemplate = `const css = \`.flex { display: flex; }\`;`;
    expect(isCssContent(jsWithTemplate)).toBe(false);
  });
});
