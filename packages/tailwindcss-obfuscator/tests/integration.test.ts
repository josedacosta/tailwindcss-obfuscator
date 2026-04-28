/**
 * Integration tests for the complete obfuscation workflow
 */

import { describe, it, expect, beforeEach } from "vitest";
import { createContext, addClass, addClasses, updateMappingMetadata } from "../src/core/context.js";
import { getTransformer, transformContent, noopTransformer } from "../src/transformers/index.js";
import type { PluginContext } from "../src/core/types.js";

describe("getTransformer", () => {
  let ctx: PluginContext;

  beforeEach(() => {
    ctx = createContext({}, "production");
    addClasses(ctx, ["flex", "items-center", "bg-red-500", "text-white", "p-4"], "test.tsx");
  });

  it("should return CSS transformer for .css files", () => {
    const transformer = getTransformer("style.css", ".flex {}", ctx);
    expect(transformer).not.toBeNull();

    const result = transformer!(".flex { display: flex; }", "style.css", ctx.classMap);
    expect(result.transformed).toContain(ctx.classMap.get("flex"));
  });

  it("should return HTML transformer for .html files", () => {
    const transformer = getTransformer("index.html", "<div></div>", ctx);
    expect(transformer).not.toBeNull();

    const result = transformer!('<div class="flex">Hello</div>', "index.html", ctx.classMap);
    expect(result.transformed).toContain(ctx.classMap.get("flex"));
  });

  it("should return JSX transformer for .jsx files", () => {
    const transformer = getTransformer("component.jsx", "<div/>", ctx);
    expect(transformer).not.toBeNull();
  });

  it("should return JSX transformer for .tsx files", () => {
    const transformer = getTransformer("component.tsx", "<div/>", ctx);
    expect(transformer).not.toBeNull();
  });

  it("should return JSX transformer for .ts files", () => {
    const transformer = getTransformer("utils.ts", "const x = 1;", ctx);
    expect(transformer).not.toBeNull();
  });

  it("should return JSX transformer for .vue files", () => {
    const transformer = getTransformer("component.vue", "<template></template>", ctx);
    expect(transformer).not.toBeNull();
  });

  it("should return JSX transformer for .svelte files", () => {
    const transformer = getTransformer("component.svelte", "<script></script>", ctx);
    expect(transformer).not.toBeNull();
  });

  it("should return JSX transformer for .astro files", () => {
    const transformer = getTransformer("page.astro", "---\n---", ctx);
    expect(transformer).not.toBeNull();
  });

  it("should return null for unsupported file types", () => {
    const transformer = getTransformer("image.png", "", ctx);
    expect(transformer).toBeNull();
  });

  it("should use PostCSS transformer when usePostcss is true", () => {
    const postcssCtx = createContext({ usePostcss: true }, "production");
    addClasses(postcssCtx, ["flex"], "test.tsx");

    const transformer = getTransformer("style.css", ".flex {}", postcssCtx);
    expect(transformer).not.toBeNull();

    const result = transformer!(".flex { display: flex; }", "style.css", postcssCtx.classMap);
    expect(result.transformed).toContain(postcssCtx.classMap.get("flex"));
  });

  it("should use AST transformer when useAst is true", () => {
    const astCtx = createContext({ useAst: true }, "production");
    addClasses(astCtx, ["flex"], "test.tsx");

    const transformer = getTransformer("component.tsx", "<div/>", astCtx);
    expect(transformer).not.toBeNull();

    const result = transformer!(
      '<div className="flex">Hello</div>',
      "component.tsx",
      astCtx.classMap
    );
    expect(result.transformed).toContain(astCtx.classMap.get("flex"));
  });

  it("should respect preserve.classes option", () => {
    const preserveCtx = createContext(
      {
        useAst: true,
        preserve: { classes: ["flex"] },
      },
      "production"
    );
    addClasses(preserveCtx, ["flex", "items-center"], "test.tsx");

    const transformer = getTransformer("component.tsx", "<div/>", preserveCtx);
    const result = transformer!(
      '<div className="flex items-center">Hello</div>',
      "component.tsx",
      preserveCtx.classMap
    );

    expect(result.transformed).toContain("flex");
    expect(result.transformed).toContain(preserveCtx.classMap.get("items-center"));
  });
});

describe("transformContent", () => {
  let ctx: PluginContext;

  beforeEach(() => {
    ctx = createContext({}, "production");
    addClasses(
      ctx,
      ["flex", "items-center", "justify-between", "bg-red-500", "text-white"],
      "test.tsx"
    );
  });

  it("should transform CSS content", () => {
    const css = `.flex { display: flex; }
.items-center { align-items: center; }`;

    const result = transformContent(css, "style.css", ctx);

    expect(result.transformed).toContain(ctx.classMap.get("flex"));
    expect(result.transformed).toContain(ctx.classMap.get("items-center"));
    expect(result.replacements).toBeGreaterThan(0);
  });

  it("should transform HTML content", () => {
    const html = '<div class="flex items-center">Hello</div>';

    const result = transformContent(html, "index.html", ctx);

    expect(result.transformed).toContain(ctx.classMap.get("flex"));
    expect(result.transformed).toContain(ctx.classMap.get("items-center"));
  });

  it("should transform JSX content", () => {
    const jsx = '<div className="flex items-center">Hello</div>';

    const result = transformContent(jsx, "component.tsx", ctx);

    expect(result.transformed).toContain(ctx.classMap.get("flex"));
    expect(result.transformed).toContain(ctx.classMap.get("items-center"));
  });

  it("should return original content for unsupported files", () => {
    const content = "binary content";

    const result = transformContent(content, "image.png", ctx);

    expect(result.transformed).toBe(content);
    expect(result.replacements).toBe(0);
  });
});

describe("noopTransformer", () => {
  it("should return content unchanged", () => {
    const content = "some content";
    const result = noopTransformer(content, "file.txt", new Map());

    expect(result.original).toBe(content);
    expect(result.transformed).toBe(content);
    expect(result.replacements).toBe(0);
    expect(result.replacedClasses).toEqual([]);
  });
});

describe("Complete Workflow", () => {
  it("should obfuscate a complete component", () => {
    const ctx = createContext({ prefix: "o-" }, "production");

    // Simulate class extraction
    addClasses(
      ctx,
      [
        "container",
        "mx-auto",
        "px-4",
        "flex",
        "items-center",
        "justify-between",
        "bg-white",
        "shadow-lg",
        "rounded-xl",
        "hover:shadow-xl",
        "transition-shadow",
      ],
      "Header.tsx"
    );

    updateMappingMetadata(ctx, "3");

    // Verify mapping
    expect(ctx.classMap.size).toBe(11);
    expect(ctx.classMapping.totalClasses).toBe(11);

    // Transform TSX
    const tsx = `
function Header() {
  return (
    <header className="container mx-auto px-4">
      <nav className="flex items-center justify-between bg-white shadow-lg rounded-xl hover:shadow-xl transition-shadow">
        <Logo />
        <Menu />
      </nav>
    </header>
  );
}`;

    const result = transformContent(tsx, "Header.tsx", ctx);

    // Verify all classes were transformed
    expect(result.transformed).not.toContain('"container');
    expect(result.transformed).not.toContain("mx-auto");
    expect(result.transformed).not.toContain("px-4");
    expect(result.transformed).toContain("o-"); // Should have obfuscated prefix
    expect(result.replacements).toBe(2); // Two className attributes
  });

  it("should preserve specified classes while obfuscating others", () => {
    const ctx = createContext(
      {
        prefix: "x-",
        preserve: {
          classes: ["dark", "light"],
        },
      },
      "production"
    );

    addClasses(ctx, ["flex", "dark", "light", "bg-white", "bg-gray-900"], "ThemeProvider.tsx");

    const tsx = `<div className="flex dark:bg-gray-900 light:bg-white">Theme</div>`;
    const result = transformContent(tsx, "ThemeProvider.tsx", ctx);

    // dark and light should NOT be obfuscated
    expect(result.transformed).toContain("dark:");
    expect(result.transformed).toContain("light:");
    // flex should be obfuscated
    expect(result.transformed).toContain("x-");
  });

  it("should handle shadcn/ui component pattern", () => {
    const ctx = createContext({ useAst: true }, "production");

    addClasses(
      ctx,
      [
        "inline-flex",
        "items-center",
        "justify-center",
        "whitespace-nowrap",
        "rounded-md",
        "text-sm",
        "font-medium",
        "ring-offset-background",
        "transition-colors",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring",
        "focus-visible:ring-offset-2",
        "disabled:pointer-events-none",
        "disabled:opacity-50",
        "bg-primary",
        "text-primary-foreground",
        "hover:bg-primary/90",
        "h-10",
        "px-4",
        "py-2",
      ],
      "button.tsx"
    );

    const tsx = `
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
      },
      size: {
        default: "h-10 px-4 py-2",
      },
    },
  }
);
`;

    const result = transformContent(tsx, "button.tsx", ctx);

    // Should have transformed classes
    expect(result.replacements).toBeGreaterThan(0);
    expect(result.transformed).toContain("tw-");
  });

  it("should handle CSS in Tailwind v4 format", () => {
    const ctx = createContext({ usePostcss: true }, "production");
    ctx.detectedTailwindVersion = "4";

    addClasses(ctx, ["flex", "grid", "items-center"], "app.css");

    const css = `
@layer utilities {
  .flex { display: flex; }
  .grid { display: grid; }
  .items-center { align-items: center; }
}
`;

    const result = transformContent(css, "app.css", ctx);

    expect(result.transformed).toContain(ctx.classMap.get("flex"));
    expect(result.transformed).toContain(ctx.classMap.get("grid"));
    expect(result.transformed).toContain(ctx.classMap.get("items-center"));
  });
});
