/**
 * Tests for HTML transformer
 */

import { describe, it, expect } from "vitest";
import { transformHtml, transformHtmlWithDataAttrs } from "../src/transformers/html.js";

describe("transformHtml", () => {
  const mapping = new Map([
    ["flex", "tw-a"],
    ["items-center", "tw-b"],
    ["justify-between", "tw-c"],
    ["bg-red-500", "tw-d"],
    ["text-white", "tw-e"],
    ["hover:bg-red-600", "tw-f"],
    ["p-4", "tw-g"],
  ]);

  it("should transform class attribute with double quotes", () => {
    const html = `<div class="flex items-center">Hello</div>`;
    const result = transformHtml(html, "index.html", mapping);

    expect(result.transformed).toBe(`<div class="tw-a tw-b">Hello</div>`);
    expect(result.replacements).toBe(1);
  });

  it("should transform class attribute with single quotes", () => {
    const html = `<div class='flex items-center'>Hello</div>`;
    const result = transformHtml(html, "index.html", mapping);

    expect(result.transformed).toBe(`<div class='tw-a tw-b'>Hello</div>`);
  });

  it("should transform multiple elements", () => {
    const html = `
<div class="flex">
  <span class="items-center">
    <button class="bg-red-500 text-white">Click</button>
  </span>
</div>`;
    const result = transformHtml(html, "index.html", mapping);

    expect(result.transformed).toContain('class="tw-a"');
    expect(result.transformed).toContain('class="tw-b"');
    expect(result.transformed).toContain('class="tw-d tw-e"');
  });

  it("should handle mixed known and unknown classes", () => {
    const html = `<div class="flex custom-class items-center">Hello</div>`;
    const result = transformHtml(html, "index.html", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.transformed).toContain("custom-class");
    expect(result.transformed).toContain("tw-b");
  });

  it("should not transform classes not in mapping", () => {
    const html = `<div class="unknown-class another-unknown">Hello</div>`;
    const result = transformHtml(html, "index.html", mapping);

    expect(result.transformed).toBe(html);
    expect(result.replacements).toBe(0);
  });

  it("should handle empty class attribute", () => {
    const html = `<div class="">Hello</div>`;
    const result = transformHtml(html, "index.html", mapping);

    expect(result.transformed).toBe(html);
    expect(result.replacements).toBe(0);
  });

  it("should handle elements without class attribute", () => {
    const html = `<div id="test">Hello</div>`;
    const result = transformHtml(html, "index.html", mapping);

    expect(result.transformed).toBe(html);
    expect(result.replacements).toBe(0);
  });

  it("should preserve other attributes", () => {
    const html = `<div id="container" class="flex" data-testid="main">Hello</div>`;
    const result = transformHtml(html, "index.html", mapping);

    expect(result.transformed).toContain('id="container"');
    expect(result.transformed).toContain('class="tw-a"');
    expect(result.transformed).toContain('data-testid="main"');
  });

  it("should handle self-closing tags", () => {
    const html = `<input class="flex p-4" type="text" />`;
    const result = transformHtml(html, "index.html", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.transformed).toContain("tw-g");
  });

  it("should handle complete HTML document", () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>Test</title>
</head>
<body class="flex">
  <div class="items-center p-4">Hello World</div>
</body>
</html>`;
    const result = transformHtml(html, "index.html", mapping);

    expect(result.transformed).toContain('class="tw-a"');
    expect(result.transformed).toContain('class="tw-b tw-g"');
    expect(result.transformed).toContain("<!DOCTYPE html>");
  });

  it("should generate source map when enabled", () => {
    const html = `<div class="flex">Hello</div>`;
    const result = transformHtml(html, "index.html", mapping, { sourcemap: true });

    expect(result.map).toBeDefined();
  });

  it("should not generate source map when disabled", () => {
    const html = `<div class="flex">Hello</div>`;
    const result = transformHtml(html, "index.html", mapping, { sourcemap: false });

    expect(result.map).toBeUndefined();
  });

  it("should handle Tailwind variants with colons", () => {
    const html = `<div class="hover:bg-red-600">Hover me</div>`;
    const result = transformHtml(html, "index.html", mapping);

    expect(result.transformed).toContain("tw-f");
  });

  it("should handle multiple classes with variants", () => {
    const html = `<div class="flex hover:bg-red-600 text-white">Test</div>`;
    const result = transformHtml(html, "index.html", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.transformed).toContain("tw-f");
    expect(result.transformed).toContain("tw-e");
  });
});

describe("transformHtmlWithDataAttrs", () => {
  const mapping = new Map([
    ["flex", "tw-a"],
    ["items-center", "tw-b"],
    ["bg-red-500", "tw-c"],
  ]);

  it("should transform both class and data attributes when data-class is opted in", () => {
    const html = `<div class="flex" data-class="items-center">Hello</div>`;
    const result = transformHtmlWithDataAttrs(html, "index.html", mapping, {
      dataAttributes: ["data-class"],
    });

    expect(result.transformed).toContain('class="tw-a"');
    expect(result.transformed).toContain('data-class="tw-b"');
  });

  it("does NOT transform data-class when not opted in (regression: tightened class boundary)", () => {
    // Previously, the loose `\bclass\s*=` regex incorrectly matched the
    // `class=` substring inside `data-class=`. The tightened pattern
    // `(?:^|[\s<])class\s*=` correctly skips it. Users who *want* the
    // data-* attribute transformed must opt in via `dataAttributes`.
    const html = `<div class="flex" data-class="items-center">Hello</div>`;
    const result = transformHtmlWithDataAttrs(html, "index.html", mapping);

    expect(result.transformed).toContain('class="tw-a"');
    expect(result.transformed).toContain('data-class="items-center"');
  });

  it("should handle elements with class attribute", () => {
    const html = `<div class="flex items-center bg-red-500">Hello</div>`;
    const result = transformHtmlWithDataAttrs(html, "index.html", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.transformed).toContain("tw-b");
    expect(result.transformed).toContain("tw-c");
  });

  it("should handle elements with only class attribute", () => {
    const html = `<div class="flex items-center">Hello</div>`;
    const result = transformHtmlWithDataAttrs(html, "index.html", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.transformed).toContain("tw-b");
  });

  it("should handle elements with only data attributes when opted in", () => {
    const html = `<div data-class="flex">Hello</div>`;
    const result = transformHtmlWithDataAttrs(html, "index.html", mapping, {
      dataAttributes: ["data-class"],
    });

    expect(result.transformed).toContain('data-class="tw-a"');
  });
});
