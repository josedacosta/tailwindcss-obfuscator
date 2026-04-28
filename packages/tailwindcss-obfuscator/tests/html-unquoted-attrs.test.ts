/**
 * HTML unquoted-attribute support (HTML5 spec).
 *
 * The HTML5 spec allows attribute values to be written without quotes when
 * the value contains no whitespace, `>`, `=`, `<`, `"`, `'`, or backtick.
 * Static templates in the wild routinely use this form (`class=text-center`).
 * Both the extractor and the transformer must round-trip these correctly,
 * otherwise unquoted classes silently survive the obfuscation pass.
 */

import { describe, it, expect } from "vitest";
import { extractFromHtml, extractFromHtmlAggressive } from "../src/extractors/html.js";
import { transformHtml } from "../src/transformers/html.js";

describe("HTML extractor — unquoted attributes", () => {
  it("extracts a single unquoted class value (HTML5 form)", () => {
    const html = `<div class=text-center>hello</div>`;
    expect(extractFromHtml(html, "file.html")).toEqual(["text-center"]);
  });

  it("extracts the same unquoted class via the aggressive extractor", () => {
    const html = `<span class=bg-blue-500>x</span>`;
    expect(extractFromHtmlAggressive(html, "file.html")).toEqual(["bg-blue-500"]);
  });

  it("handles all three quote forms in the same document", () => {
    const html = `
      <div class="flex items-center"></div>
      <div class='gap-4 p-2'></div>
      <div class=text-lg></div>
    `;
    const result = extractFromHtml(html, "file.html").sort();
    expect(result).toEqual(["flex", "gap-4", "items-center", "p-2", "text-lg"].sort());
  });

  it("extracts arbitrary-value classes (already worked, regression guard)", () => {
    const html = `<div class="bg-[var(--brand)] w-[calc(100%-20px)] [color:red]"></div>`;
    const result = extractFromHtml(html, "file.html").sort();
    expect(result).toEqual(["[color:red]", "bg-[var(--brand)]", "w-[calc(100%-20px)]"]);
  });

  it("does not falsely match `class` substrings inside other attributes", () => {
    const html = `<div data-myclass="foo" data-class="bar"><span class=text-center></span></div>`;
    const result = extractFromHtml(html, "file.html");
    expect(result).toEqual(["text-center"]);
  });
});

describe("HTML transformer — unquoted attributes", () => {
  it("rewrites an unquoted class value in place", () => {
    const html = `<div class=text-center>hi</div>`;
    const mapping = new Map([["text-center", "tw-a"]]);
    const out = transformHtml(html, "file.html", mapping);
    expect(out.transformed).toBe(`<div class=tw-a>hi</div>`);
    expect(out.replacements).toBe(1);
    expect(out.replacedClasses).toEqual(["text-center"]);
  });

  it("rewrites unquoted alongside quoted in the same document", () => {
    const html = `
      <div class="flex p-4"></div>
      <div class=text-center></div>
    `;
    const mapping = new Map([
      ["flex", "tw-a"],
      ["p-4", "tw-b"],
      ["text-center", "tw-c"],
    ]);
    const out = transformHtml(html, "file.html", mapping);
    expect(out.transformed).toContain(`class="tw-a tw-b"`);
    expect(out.transformed).toContain(`class=tw-c`);
    expect(out.replacements).toBe(2);
  });

  it("leaves unquoted values untouched when no class is in the mapping", () => {
    const html = `<div class=foo-bar></div>`;
    const out = transformHtml(html, "file.html", new Map([["other", "tw-a"]]));
    expect(out.transformed).toBe(html);
    expect(out.replacements).toBe(0);
  });

  it("preserves the unquoted form (does not re-add quotes around the new value)", () => {
    const html = `<a class=hover:underline>x</a>`;
    const mapping = new Map([["hover:underline", "tw-z"]]);
    const out = transformHtml(html, "file.html", mapping);
    expect(out.transformed).toBe(`<a class=tw-z>x</a>`);
  });
});
