/**
 * Tests for JSX transformers (regex and AST-based)
 */

import { describe, it, expect } from "vitest";
import { transformJsx, transformCompiledJsx, isCompiledOutput } from "../src/transformers/jsx.js";
import { transformJsxAst } from "../src/transformers/jsx-ast.js";

describe("transformJsx (regex-based)", () => {
  const mapping = new Map([
    ["flex", "tw-a"],
    ["items-center", "tw-b"],
    ["justify-between", "tw-c"],
    ["bg-red-500", "tw-d"],
    ["text-white", "tw-e"],
    ["p-4", "tw-f"],
  ]);

  it("should transform className with double quotes", () => {
    const jsx = `<div className="flex items-center">Hello</div>`;
    const result = transformJsx(jsx, "test.tsx", mapping);

    expect(result.transformed).toBe(`<div className="tw-a tw-b">Hello</div>`);
    expect(result.replacements).toBe(1);
    expect(result.replacedClasses).toContain("flex");
    expect(result.replacedClasses).toContain("items-center");
  });

  it("should transform className with single quotes", () => {
    const jsx = `<div className='flex items-center'>Hello</div>`;
    const result = transformJsx(jsx, "test.tsx", mapping);

    expect(result.transformed).toBe(`<div className='tw-a tw-b'>Hello</div>`);
  });

  it("should transform simple template literals", () => {
    const jsx = "<div className={`flex items-center`}>Hello</div>";
    const result = transformJsx(jsx, "test.tsx", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.transformed).toContain("tw-b");
  });

  it("should transform cn() function calls", () => {
    const jsx = `const cls = cn("flex", "items-center");`;
    const result = transformJsx(jsx, "test.tsx", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.transformed).toContain("tw-b");
  });

  it("should transform clsx() function calls", () => {
    const jsx = `const cls = clsx("flex", "items-center");`;
    const result = transformJsx(jsx, "test.tsx", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.transformed).toContain("tw-b");
  });

  it("should transform classnames() function calls", () => {
    const jsx = `const cls = classnames("flex", isActive && "bg-red-500");`;
    const result = transformJsx(jsx, "test.tsx", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.transformed).toContain("tw-d");
  });

  it("should transform twMerge() function calls", () => {
    const jsx = `const cls = twMerge("flex", "items-center");`;
    const result = transformJsx(jsx, "test.tsx", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.transformed).toContain("tw-b");
  });

  it("should not transform classes not in mapping", () => {
    const jsx = `<div className="unknown-class">Hello</div>`;
    const result = transformJsx(jsx, "test.tsx", mapping);

    expect(result.transformed).toBe(jsx);
    expect(result.replacements).toBe(0);
  });

  it("should handle mixed known and unknown classes", () => {
    const jsx = `<div className="flex unknown-class items-center">Hello</div>`;
    const result = transformJsx(jsx, "test.tsx", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.transformed).toContain("unknown-class");
    expect(result.transformed).toContain("tw-b");
  });

  it("should generate source map when enabled", () => {
    const jsx = `<div className="flex">Hello</div>`;
    const result = transformJsx(jsx, "test.tsx", mapping, { sourcemap: true });

    expect(result.map).toBeDefined();
  });

  // Tests for Qwik/Svelte/Astro support (class instead of className)
  it("should transform class attribute with double quotes (Qwik/Svelte/Astro)", () => {
    const jsx = `<div class="flex items-center">Hello</div>`;
    const result = transformJsx(jsx, "test.tsx", mapping);

    expect(result.transformed).toBe(`<div class="tw-a tw-b">Hello</div>`);
    expect(result.replacements).toBe(1);
    expect(result.replacedClasses).toContain("flex");
    expect(result.replacedClasses).toContain("items-center");
  });

  it("should transform class attribute with single quotes", () => {
    const jsx = `<div class='flex items-center'>Hello</div>`;
    const result = transformJsx(jsx, "test.tsx", mapping);

    expect(result.transformed).toBe(`<div class='tw-a tw-b'>Hello</div>`);
  });

  it("should transform class attribute with template literal", () => {
    const jsx = "<div class={`flex items-center`}>Hello</div>";
    const result = transformJsx(jsx, "test.tsx", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.transformed).toContain("tw-b");
  });

  // Tests for Svelte class: directive
  it("should transform Svelte class: directive", () => {
    const svelte = `<div class:bg-red-500={isActive}>Hello</div>`;
    const result = transformJsx(svelte, "test.svelte", mapping);

    expect(result.transformed).toBe(`<div class:tw-d={isActive}>Hello</div>`);
    expect(result.replacements).toBe(1);
    expect(result.replacedClasses).toContain("bg-red-500");
  });

  it("should transform multiple Svelte class: directives", () => {
    const svelte = `<div class:flex class:bg-red-500={isActive}>Hello</div>`;
    const result = transformJsx(svelte, "test.svelte", mapping);

    expect(result.transformed).toContain("class:tw-a");
    expect(result.transformed).toContain("class:tw-d");
  });
});

describe("transformJsxAst (Babel AST-based)", () => {
  const mapping = new Map([
    ["flex", "tw-a"],
    ["items-center", "tw-b"],
    ["justify-between", "tw-c"],
    ["bg-red-500", "tw-d"],
    ["text-white", "tw-e"],
    ["p-4", "tw-f"],
    ["hover:bg-red-600", "tw-g"],
  ]);

  it("should transform className with double quotes", () => {
    const jsx = `<div className="flex items-center">Hello</div>`;
    const result = transformJsxAst(jsx, "test.tsx", mapping);

    expect(result.transformed).toBe(`<div className="tw-a tw-b">Hello</div>`);
    expect(result.replacements).toBe(1);
  });

  it("should transform className with single quotes", () => {
    const jsx = `<div className='flex items-center'>Hello</div>`;
    const result = transformJsxAst(jsx, "test.tsx", mapping);

    expect(result.transformed).toBe(`<div className='tw-a tw-b'>Hello</div>`);
  });

  it("should transform simple template literals", () => {
    const jsx = "<div className={`flex items-center`}>Hello</div>";
    const result = transformJsxAst(jsx, "test.tsx", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.transformed).toContain("tw-b");
  });

  it("should transform cn() function calls", () => {
    const jsx = `const cls = cn("flex", "items-center");`;
    const result = transformJsxAst(jsx, "test.tsx", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.transformed).toContain("tw-b");
  });

  it("should transform clsx() function calls", () => {
    const jsx = `const cls = clsx("flex", "items-center");`;
    const result = transformJsxAst(jsx, "test.tsx", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.transformed).toContain("tw-b");
  });

  it("should transform twMerge() function calls", () => {
    const jsx = `const cls = twMerge("flex", "items-center");`;
    const result = transformJsxAst(jsx, "test.tsx", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.transformed).toContain("tw-b");
  });

  it("should transform cva() function calls", () => {
    const jsx = `const buttonVariants = cva("flex items-center", {});`;
    const result = transformJsxAst(jsx, "test.tsx", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.transformed).toContain("tw-b");
  });

  it("should transform tv() function calls with string arguments", () => {
    // Note: tv() typically uses object arguments, but the AST transformer
    // currently only handles direct string literal arguments in function calls
    const jsx = `const cls = tv("flex items-center");`;
    const result = transformJsxAst(jsx, "test.tsx", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.transformed).toContain("tw-b");
  });

  it("should respect preserveFunctions option", () => {
    const jsx = `const cls = cn("flex", "items-center");`;
    const result = transformJsxAst(jsx, "test.tsx", mapping, {
      preserveFunctions: ["cn"],
    });

    expect(result.transformed).toBe(jsx);
    expect(result.replacements).toBe(0);
  });

  it("should respect preserveClasses option", () => {
    const jsx = `<div className="flex items-center">Hello</div>`;
    const result = transformJsxAst(jsx, "test.tsx", mapping, {
      preserveClasses: ["flex"],
    });

    expect(result.transformed).toContain("flex");
    expect(result.transformed).toContain("tw-b");
  });

  it("should handle TypeScript syntax", () => {
    const tsx = `
interface Props {
  children: React.ReactNode;
}

const Component: React.FC<Props> = ({ children }) => (
  <div className="flex items-center">{children}</div>
);
`;
    const result = transformJsxAst(tsx, "test.tsx", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.transformed).toContain("tw-b");
    expect(result.transformed).toContain("interface Props");
  });

  it("should handle object property className (compiled JSX)", () => {
    const jsx = `const el = { className: "flex items-center" };`;
    const result = transformJsxAst(jsx, "test.tsx", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.transformed).toContain("tw-b");
  });

  it("should fall back to the regex transformer on parse error", () => {
    // When the Babel parser cannot handle the input (minified post-build
    // chunks, unclosed tags, esoteric syntax), the AST transformer must not
    // silently emit unobfuscated output. It now delegates to the regex-based
    // transformer so simple `className="..."` attributes still get rewritten.
    const invalidJsx = `<div className="flex"`;
    const result = transformJsxAst(invalidJsx, "test.tsx", mapping);

    expect(result.transformed).toBe(`<div className="tw-a"`);
    expect(result.replacements).toBe(1);
  });

  it("should handle complex nested JSX", () => {
    const jsx = `
function App() {
  return (
    <div className="flex">
      <span className="items-center">
        <button className="bg-red-500 text-white">Click</button>
      </span>
    </div>
  );
}
`;
    const result = transformJsxAst(jsx, "test.tsx", mapping);

    expect(result.transformed).toContain("tw-a"); // flex
    expect(result.transformed).toContain("tw-b"); // items-center
    expect(result.transformed).toContain("tw-d"); // bg-red-500
    expect(result.transformed).toContain("tw-e"); // text-white
  });

  it("should handle class attribute (HTML-style)", () => {
    const jsx = `<div class="flex items-center">Hello</div>`;
    const result = transformJsxAst(jsx, "test.tsx", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.transformed).toContain("tw-b");
  });
});

describe("transformCompiledJsx", () => {
  const mapping = new Map([
    ["flex", "tw-a"],
    ["items-center", "tw-b"],
    ["bg-red-500", "tw-c"],
  ]);

  it("should transform className in compiled output", () => {
    const compiled = `React.createElement("div", { className: "flex items-center" })`;
    const result = transformCompiledJsx(compiled, "test.js", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.transformed).toContain("tw-b");
  });

  it("should transform class attribute in SSR output", () => {
    const ssr = `<div class="flex items-center">Hello</div>`;
    const result = transformCompiledJsx(ssr, "test.js", mapping);

    expect(result.transformed).toContain("tw-a");
    expect(result.transformed).toContain("tw-b");
  });

  it("should handle _jsx() calls", () => {
    const compiled = `_jsx("div", { className: "flex" })`;
    const result = transformCompiledJsx(compiled, "test.js", mapping);

    expect(result.transformed).toContain("tw-a");
  });
});

describe("isCompiledOutput", () => {
  it("should detect webpack output", () => {
    expect(isCompiledOutput(`__webpack_require__(1)`)).toBe(true);
  });

  it("should detect React _jsx calls", () => {
    expect(isCompiledOutput(`_jsx("div", {})`)).toBe(true);
  });

  it("should detect React.createElement calls", () => {
    expect(isCompiledOutput(`React.createElement("div")`)).toBe(true);
  });

  it("should detect React refresh", () => {
    expect(isCompiledOutput(`$RefreshReg$(Component, "Component")`)).toBe(true);
  });

  it("should return false for source JSX", () => {
    expect(isCompiledOutput(`<div className="flex">Hello</div>`)).toBe(false);
  });
});
