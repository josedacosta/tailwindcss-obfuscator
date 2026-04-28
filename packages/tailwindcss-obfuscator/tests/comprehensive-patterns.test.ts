/**
 * Comprehensive tests for all Tailwind CSS patterns
 *
 * Tests for:
 * - Arbitrary values: bg-[#1da1f2], p-[13px], w-[calc(100%-2rem)]
 * - CSS variable shorthand: bg-(--my-color)
 * - Container queries: @container, @lg:
 * - Data attributes: data-[state=open]:
 * - ARIA variants: aria-pressed:, aria-[current=page]:
 * - Supports queries: supports-[display:grid]:
 * - Group/peer variants: group-hover:, peer-focus:, named groups
 * - Vue :class binding: object and array syntax
 * - Svelte/Astro class:list directive
 * - tailwind-variants (tv) and CVA patterns
 * - Complex variants stacking
 */

import { describe, it, expect } from "vitest";
import {
  isTailwindClass,
  extractClassesFromString,
  deduplicateClasses,
} from "../src/extractors/base.js";
import {
  extractFromJsx,
  extractFromJsxWithCva,
  extractFromTailwindVariants,
  extractAllFromJsx,
} from "../src/extractors/jsx.js";
import {
  extractFromCss,
  extractFromTailwindV4Css,
  extractFromApplyDirectives,
  extractAllFromCss,
  extractFromComplexSelector,
  escapeCssClassName,
} from "../src/extractors/css.js";
import { extractFromHtml } from "../src/extractors/html.js";

// ============================================================================
// ARBITRARY VALUES
// ============================================================================

describe("Arbitrary Values", () => {
  describe("isTailwindClass", () => {
    it("should recognize color arbitrary values", () => {
      expect(isTailwindClass("bg-[#1da1f2]")).toBe(true);
      expect(isTailwindClass("text-[#ff0000]")).toBe(true);
      expect(isTailwindClass("border-[rgb(255,0,0)]")).toBe(true);
      expect(isTailwindClass("bg-[rgba(0,0,0,0.5)]")).toBe(true);
      expect(isTailwindClass("text-[hsl(200,100%,50%)]")).toBe(true);
    });

    it("should recognize size arbitrary values", () => {
      expect(isTailwindClass("w-[100px]")).toBe(true);
      expect(isTailwindClass("h-[50vh]")).toBe(true);
      expect(isTailwindClass("p-[13px]")).toBe(true);
      expect(isTailwindClass("m-[2rem]")).toBe(true);
      expect(isTailwindClass("gap-[1.5em]")).toBe(true);
    });

    it("should recognize calc() arbitrary values", () => {
      expect(isTailwindClass("w-[calc(100%-2rem)]")).toBe(true);
      expect(isTailwindClass("h-[calc(100vh-80px)]")).toBe(true);
      expect(isTailwindClass("max-w-[calc(50%+1rem)]")).toBe(true);
    });

    it("should recognize URL arbitrary values", () => {
      expect(isTailwindClass("bg-[url('/images/hero.png')]")).toBe(true);
      expect(isTailwindClass("bg-[url('/path/to/image.svg')]")).toBe(true);
    });

    it("should recognize arbitrary properties", () => {
      expect(isTailwindClass("[mask-type:alpha]")).toBe(true);
      expect(isTailwindClass("[--my-var:100px]")).toBe(true);
      expect(isTailwindClass("[clip-path:circle(50%)]")).toBe(true);
    });

    it("should recognize arbitrary values with variants", () => {
      expect(isTailwindClass("hover:bg-[#1da1f2]")).toBe(true);
      expect(isTailwindClass("md:w-[500px]")).toBe(true);
      expect(isTailwindClass("dark:text-[#f0f0f0]")).toBe(true);
      expect(isTailwindClass("sm:hover:bg-[#ff0000]")).toBe(true);
    });
  });

  describe("extractClassesFromString", () => {
    it("should extract arbitrary value classes", () => {
      const result = extractClassesFromString("flex bg-[#1da1f2] w-[100px] p-[calc(1rem+10px)]");
      expect(result).toContain("flex");
      expect(result).toContain("bg-[#1da1f2]");
      expect(result).toContain("w-[100px]");
      expect(result).toContain("p-[calc(1rem+10px)]");
    });

    it("should handle nested brackets in calc()", () => {
      const result = extractClassesFromString("w-[calc(100%-(2rem+10px))]");
      expect(result).toContain("w-[calc(100%-(2rem+10px))]");
    });
  });
});

// ============================================================================
// CSS VARIABLE SHORTHAND (Tailwind v4)
// ============================================================================

describe("CSS Variable Shorthand", () => {
  describe("isTailwindClass", () => {
    it("should recognize CSS variable shorthand", () => {
      expect(isTailwindClass("bg-(--my-color)")).toBe(true);
      expect(isTailwindClass("text-(--brand-color)")).toBe(true);
      expect(isTailwindClass("border-(--border-color)")).toBe(true);
    });

    it("should recognize CSS variable shorthand with variants", () => {
      expect(isTailwindClass("hover:bg-(--my-color)")).toBe(true);
      expect(isTailwindClass("dark:text-(--light-text)")).toBe(true);
    });
  });
});

// ============================================================================
// CONTAINER QUERIES (Tailwind v4)
// ============================================================================

describe("Container Queries", () => {
  describe("isTailwindClass", () => {
    it("should recognize @container class", () => {
      expect(isTailwindClass("@container")).toBe(true);
      expect(isTailwindClass("@container/sidebar")).toBe(true);
    });

    it("should recognize container query variants", () => {
      expect(isTailwindClass("@sm:flex")).toBe(true);
      expect(isTailwindClass("@md:grid")).toBe(true);
      expect(isTailwindClass("@lg:hidden")).toBe(true);
      expect(isTailwindClass("@xl:block")).toBe(true);
    });

    it("should recognize named container queries", () => {
      expect(isTailwindClass("@sm/sidebar:flex")).toBe(true);
      expect(isTailwindClass("@lg/main:grid-cols-3")).toBe(true);
    });

    it("should recognize container query with arbitrary values", () => {
      expect(isTailwindClass("@[500px]:flex")).toBe(true);
      expect(isTailwindClass("@[min-width:300px]:hidden")).toBe(true);
    });
  });

  describe("extractFromHtml", () => {
    it("should extract container query classes", () => {
      const html = `<div class="@container @lg:flex @sm:hidden">Content</div>`;
      const classes = extractFromHtml(html);
      expect(classes).toContain("@container");
      expect(classes).toContain("@lg:flex");
      expect(classes).toContain("@sm:hidden");
    });
  });
});

// ============================================================================
// DATA ATTRIBUTES
// ============================================================================

describe("Data Attribute Variants", () => {
  describe("isTailwindClass", () => {
    it("should recognize data-* variants", () => {
      expect(isTailwindClass("data-[state=open]:bg-green-500")).toBe(true);
      expect(isTailwindClass("data-[selected]:bg-blue-500")).toBe(true);
      expect(isTailwindClass("data-[disabled]:opacity-50")).toBe(true);
    });

    it("should recognize data-* with complex values", () => {
      expect(isTailwindClass("data-[orientation=vertical]:flex-col")).toBe(true);
      expect(isTailwindClass("data-[size=lg]:text-xl")).toBe(true);
    });

    it("should recognize data-* with other variants", () => {
      expect(isTailwindClass("hover:data-[state=open]:bg-green-600")).toBe(true);
      expect(isTailwindClass("group-data-[state=open]:block")).toBe(true);
      expect(isTailwindClass("peer-data-[checked]:bg-blue-500")).toBe(true);
    });
  });

  describe("extractFromJsx", () => {
    it("should extract data attribute classes", () => {
      const jsx = `<div className="data-[state=open]:bg-green-500 data-[disabled]:opacity-50">Content</div>`;
      const classes = extractFromJsx(jsx, "test.tsx");
      expect(classes).toContain("data-[state=open]:bg-green-500");
      expect(classes).toContain("data-[disabled]:opacity-50");
    });
  });
});

// ============================================================================
// ARIA VARIANTS
// ============================================================================

describe("ARIA Variants", () => {
  describe("isTailwindClass", () => {
    it("should recognize aria-* variants", () => {
      expect(isTailwindClass("aria-pressed:bg-blue-500")).toBe(true);
      expect(isTailwindClass("aria-selected:bg-gray-100")).toBe(true);
      expect(isTailwindClass("aria-expanded:rotate-180")).toBe(true);
      expect(isTailwindClass("aria-hidden:hidden")).toBe(true);
      expect(isTailwindClass("aria-disabled:opacity-50")).toBe(true);
    });

    it("should recognize aria-* with arbitrary values", () => {
      expect(isTailwindClass("aria-[current=page]:font-bold")).toBe(true);
      expect(isTailwindClass("aria-[sort=ascending]:bg-gray-100")).toBe(true);
    });

    it("should recognize group/peer aria variants", () => {
      expect(isTailwindClass("group-aria-expanded:block")).toBe(true);
      expect(isTailwindClass("peer-aria-checked:bg-blue-500")).toBe(true);
    });
  });

  describe("extractFromHtml", () => {
    it("should extract ARIA variant classes", () => {
      const html = `<button class="aria-pressed:bg-blue-500 aria-disabled:opacity-50">Toggle</button>`;
      const classes = extractFromHtml(html);
      expect(classes).toContain("aria-pressed:bg-blue-500");
      expect(classes).toContain("aria-disabled:opacity-50");
    });
  });
});

// ============================================================================
// SUPPORTS QUERIES
// ============================================================================

describe("Supports Queries", () => {
  describe("isTailwindClass", () => {
    it("should recognize supports-* variants", () => {
      expect(isTailwindClass("supports-[display:grid]:grid")).toBe(true);
      expect(isTailwindClass("supports-[backdrop-filter]:backdrop-blur")).toBe(true);
      expect(isTailwindClass("supports-[gap]:gap-4")).toBe(true);
    });

    it("should recognize supports with shorthand", () => {
      expect(isTailwindClass("supports-grid:grid")).toBe(true);
      expect(isTailwindClass("supports-flex:flex")).toBe(true);
    });
  });
});

// ============================================================================
// GROUP AND PEER VARIANTS
// ============================================================================

describe("Group and Peer Variants", () => {
  describe("isTailwindClass", () => {
    it("should recognize group variants", () => {
      expect(isTailwindClass("group-hover:bg-blue-500")).toBe(true);
      expect(isTailwindClass("group-focus:ring-2")).toBe(true);
      expect(isTailwindClass("group-active:scale-95")).toBe(true);
    });

    it("should recognize peer variants", () => {
      expect(isTailwindClass("peer-hover:text-blue-500")).toBe(true);
      expect(isTailwindClass("peer-focus:ring-2")).toBe(true);
      expect(isTailwindClass("peer-checked:bg-blue-500")).toBe(true);
      expect(isTailwindClass("peer-invalid:border-red-500")).toBe(true);
    });

    it("should recognize named group variants", () => {
      expect(isTailwindClass("group/sidebar:hover:bg-gray-100")).toBe(true);
      expect(isTailwindClass("group-hover/item:text-blue-500")).toBe(true);
    });

    it("should recognize named peer variants", () => {
      expect(isTailwindClass("peer/input:focus:ring-2")).toBe(true);
      expect(isTailwindClass("peer-checked/checkbox:bg-blue-500")).toBe(true);
    });

    it("should recognize group/peer with data and aria", () => {
      expect(isTailwindClass("group-data-[state=open]:block")).toBe(true);
      expect(isTailwindClass("group-aria-expanded:rotate-180")).toBe(true);
      expect(isTailwindClass("peer-data-[checked]:bg-blue-500")).toBe(true);
    });
  });
});

// ============================================================================
// HAS AND NOT VARIANTS
// ============================================================================

describe("Has and Not Variants", () => {
  describe("isTailwindClass", () => {
    it("should recognize has-* variants", () => {
      expect(isTailwindClass("has-[:checked]:bg-blue-500")).toBe(true);
      expect(isTailwindClass("has-[input]:border")).toBe(true);
      expect(isTailwindClass("has-[img]:p-0")).toBe(true);
    });

    it("should recognize not-* variants", () => {
      expect(isTailwindClass("not-first:mt-4")).toBe(true);
      expect(isTailwindClass("not-last:mb-4")).toBe(true);
    });
  });
});

// ============================================================================
// IMPORTANT MODIFIER
// ============================================================================

describe("Important Modifier", () => {
  describe("isTailwindClass", () => {
    it("should recognize important prefix", () => {
      expect(isTailwindClass("!bg-red-500")).toBe(true);
      expect(isTailwindClass("!flex")).toBe(true);
      expect(isTailwindClass("!p-4")).toBe(true);
    });

    it("should recognize important with variants", () => {
      expect(isTailwindClass("hover:!bg-red-500")).toBe(true);
      expect(isTailwindClass("md:!flex")).toBe(true);
    });

    it("should recognize important suffix (legacy)", () => {
      expect(isTailwindClass("bg-red-500!")).toBe(true);
      expect(isTailwindClass("flex!")).toBe(true);
    });
  });
});

// ============================================================================
// NEGATIVE VALUES
// ============================================================================

describe("Negative Values", () => {
  describe("isTailwindClass", () => {
    it("should recognize negative spacing", () => {
      expect(isTailwindClass("-m-4")).toBe(true);
      expect(isTailwindClass("-mt-8")).toBe(true);
      expect(isTailwindClass("-p-2")).toBe(true);
    });

    it("should recognize negative transforms", () => {
      expect(isTailwindClass("-translate-x-4")).toBe(true);
      expect(isTailwindClass("-rotate-45")).toBe(true);
      expect(isTailwindClass("-skew-x-12")).toBe(true);
    });

    it("should recognize negative with variants", () => {
      expect(isTailwindClass("hover:-translate-y-1")).toBe(true);
      expect(isTailwindClass("md:-mt-4")).toBe(true);
    });
  });
});

// ============================================================================
// OPACITY MODIFIER
// ============================================================================

describe("Opacity Modifier", () => {
  describe("isTailwindClass", () => {
    it("should recognize opacity modifiers", () => {
      expect(isTailwindClass("bg-blue-500/50")).toBe(true);
      expect(isTailwindClass("text-red-600/75")).toBe(true);
      expect(isTailwindClass("border-gray-300/25")).toBe(true);
    });

    it("should recognize arbitrary opacity", () => {
      expect(isTailwindClass("bg-black/[0.08]")).toBe(true);
      expect(isTailwindClass("text-white/[.85]")).toBe(true);
    });

    it("should recognize opacity with CSS variables", () => {
      expect(isTailwindClass("bg-blue-500/(--my-opacity)")).toBe(true);
    });
  });
});

// ============================================================================
// RESPONSIVE VARIANTS
// ============================================================================

describe("Responsive Variants", () => {
  describe("isTailwindClass", () => {
    it("should recognize all breakpoint variants", () => {
      expect(isTailwindClass("sm:flex")).toBe(true);
      expect(isTailwindClass("md:grid")).toBe(true);
      expect(isTailwindClass("lg:hidden")).toBe(true);
      expect(isTailwindClass("xl:block")).toBe(true);
      expect(isTailwindClass("2xl:flex")).toBe(true);
    });

    it("should recognize max-* variants", () => {
      expect(isTailwindClass("max-sm:hidden")).toBe(true);
      expect(isTailwindClass("max-md:flex")).toBe(true);
      expect(isTailwindClass("max-lg:grid")).toBe(true);
    });

    it("should recognize min-* variants", () => {
      expect(isTailwindClass("min-[320px]:flex")).toBe(true);
      expect(isTailwindClass("max-[768px]:hidden")).toBe(true);
    });
  });
});

// ============================================================================
// STATE VARIANTS
// ============================================================================

describe("State Variants", () => {
  describe("isTailwindClass", () => {
    it("should recognize hover/focus/active", () => {
      expect(isTailwindClass("hover:bg-blue-500")).toBe(true);
      expect(isTailwindClass("focus:ring-2")).toBe(true);
      expect(isTailwindClass("active:scale-95")).toBe(true);
    });

    it("should recognize focus variants", () => {
      expect(isTailwindClass("focus-within:ring-2")).toBe(true);
      expect(isTailwindClass("focus-visible:outline-2")).toBe(true);
    });

    it("should recognize form state variants", () => {
      expect(isTailwindClass("disabled:opacity-50")).toBe(true);
      expect(isTailwindClass("enabled:cursor-pointer")).toBe(true);
      expect(isTailwindClass("checked:bg-blue-500")).toBe(true);
      expect(isTailwindClass("indeterminate:bg-gray-300")).toBe(true);
      expect(isTailwindClass("invalid:border-red-500")).toBe(true);
      expect(isTailwindClass("valid:border-green-500")).toBe(true);
      expect(isTailwindClass("required:after:content-['*']")).toBe(true);
      expect(isTailwindClass("placeholder-shown:border-gray-300")).toBe(true);
      expect(isTailwindClass("autofill:bg-yellow-100")).toBe(true);
      expect(isTailwindClass("read-only:bg-gray-100")).toBe(true);
    });

    it("should recognize first/last/odd/even variants", () => {
      expect(isTailwindClass("first:mt-0")).toBe(true);
      expect(isTailwindClass("last:mb-0")).toBe(true);
      expect(isTailwindClass("odd:bg-gray-100")).toBe(true);
      expect(isTailwindClass("even:bg-white")).toBe(true);
      expect(isTailwindClass("first-of-type:mt-0")).toBe(true);
      expect(isTailwindClass("last-of-type:mb-0")).toBe(true);
      expect(isTailwindClass("only:py-4")).toBe(true);
    });

    it("should recognize empty variant", () => {
      expect(isTailwindClass("empty:hidden")).toBe(true);
    });

    it("should recognize target variant", () => {
      expect(isTailwindClass("target:bg-yellow-100")).toBe(true);
    });
  });
});

// ============================================================================
// DARK MODE
// ============================================================================

describe("Dark Mode", () => {
  describe("isTailwindClass", () => {
    it("should recognize dark mode variants", () => {
      expect(isTailwindClass("dark:bg-gray-800")).toBe(true);
      expect(isTailwindClass("dark:text-white")).toBe(true);
      expect(isTailwindClass("dark:hover:bg-gray-700")).toBe(true);
    });
  });
});

// ============================================================================
// PRINT VARIANT
// ============================================================================

describe("Print Variant", () => {
  describe("isTailwindClass", () => {
    it("should recognize print variant", () => {
      expect(isTailwindClass("print:hidden")).toBe(true);
      expect(isTailwindClass("print:bg-white")).toBe(true);
      expect(isTailwindClass("print:text-black")).toBe(true);
    });
  });
});

// ============================================================================
// MOTION VARIANTS
// ============================================================================

describe("Motion Variants", () => {
  describe("isTailwindClass", () => {
    it("should recognize motion-safe/reduce variants", () => {
      expect(isTailwindClass("motion-safe:animate-spin")).toBe(true);
      expect(isTailwindClass("motion-reduce:animate-none")).toBe(true);
    });
  });
});

// ============================================================================
// PORTRAIT/LANDSCAPE
// ============================================================================

describe("Orientation Variants", () => {
  describe("isTailwindClass", () => {
    it("should recognize orientation variants", () => {
      expect(isTailwindClass("portrait:flex-col")).toBe(true);
      expect(isTailwindClass("landscape:flex-row")).toBe(true);
    });
  });
});

// ============================================================================
// CONTRAST VARIANTS
// ============================================================================

describe("Contrast Variants", () => {
  describe("isTailwindClass", () => {
    it("should recognize contrast variants", () => {
      expect(isTailwindClass("contrast-more:border-2")).toBe(true);
      expect(isTailwindClass("contrast-less:border")).toBe(true);
    });
  });
});

// ============================================================================
// RTL/LTR VARIANTS
// ============================================================================

describe("Direction Variants", () => {
  describe("isTailwindClass", () => {
    it("should recognize RTL/LTR variants", () => {
      expect(isTailwindClass("rtl:text-right")).toBe(true);
      expect(isTailwindClass("ltr:text-left")).toBe(true);
    });
  });
});

// ============================================================================
// OPEN VARIANT
// ============================================================================

describe("Open Variant", () => {
  describe("isTailwindClass", () => {
    it("should recognize open variant", () => {
      expect(isTailwindClass("open:bg-white")).toBe(true);
      expect(isTailwindClass("open:rotate-180")).toBe(true);
    });
  });
});

// ============================================================================
// STACKING VARIANTS
// ============================================================================

describe("Variant Stacking", () => {
  describe("isTailwindClass", () => {
    it("should recognize multiple stacked variants", () => {
      expect(isTailwindClass("sm:hover:bg-blue-500")).toBe(true);
      expect(isTailwindClass("dark:md:hover:bg-gray-700")).toBe(true);
      expect(isTailwindClass("lg:focus:first:bg-red-500")).toBe(true);
      expect(isTailwindClass("group-hover:dark:text-white")).toBe(true);
    });

    it("should recognize complex variant stacking", () => {
      expect(isTailwindClass("sm:dark:hover:focus:bg-blue-500")).toBe(true);
      expect(isTailwindClass("md:aria-pressed:data-[state=open]:bg-green-500")).toBe(true);
    });
  });
});

// ============================================================================
// VUE :CLASS BINDING
// ============================================================================

describe("Vue :class Binding", () => {
  describe("extractFromJsx (for Vue)", () => {
    it("should extract classes from Vue object syntax", () => {
      const vue = `:class="{ 'bg-blue-500': isActive, hidden: !show }"`;
      const classes = extractFromJsx(vue, "test.vue");
      expect(classes).toContain("bg-blue-500");
      expect(classes).toContain("hidden");
    });

    it("should extract classes from Vue array syntax", () => {
      const vue = `:class="['flex', isActive ? 'bg-blue-500' : 'bg-gray-500']"`;
      const classes = extractFromJsx(vue, "test.vue");
      expect(classes).toContain("flex");
      expect(classes).toContain("bg-blue-500");
      expect(classes).toContain("bg-gray-500");
    });

    it("should extract classes from v-bind:class", () => {
      const vue = `v-bind:class="{ 'text-red-500': hasError }"`;
      const classes = extractFromJsx(vue, "test.vue");
      expect(classes).toContain("text-red-500");
    });
  });
});

// ============================================================================
// SVELTE/ASTRO CLASS:LIST
// ============================================================================

describe("Svelte/Astro class:list", () => {
  describe("extractFromJsx", () => {
    it("should extract classes from Svelte class: directive", () => {
      const svelte = `<div class:bg-red-500={hasError} class:flex>Content</div>`;
      const classes = extractFromJsx(svelte, "test.svelte");
      expect(classes).toContain("bg-red-500");
      expect(classes).toContain("flex");
    });

    it("should extract classes from class:list directive", () => {
      const astro = `class:list={["flex", "items-center", { "bg-red-500": isActive }]}`;
      const classes = extractFromJsx(astro, "test.astro");
      expect(classes).toContain("flex");
      expect(classes).toContain("items-center");
      expect(classes).toContain("bg-red-500");
    });
  });
});

// ============================================================================
// QWIK CLASS$ PATTERN
// ============================================================================

describe("Qwik class$ Pattern", () => {
  describe("extractFromJsx", () => {
    it("should extract classes from Qwik class$ binding", () => {
      const qwik = `class$={"flex items-center bg-blue-500"}`;
      const classes = extractFromJsx(qwik, "test.tsx");
      expect(classes).toContain("flex");
      expect(classes).toContain("items-center");
      expect(classes).toContain("bg-blue-500");
    });
  });
});

// ============================================================================
// CVA (CLASS VARIANCE AUTHORITY)
// ============================================================================

describe("CVA Patterns", () => {
  describe("extractFromJsxWithCva", () => {
    it("should extract base classes from cva", () => {
      const jsx = `const button = cva("flex items-center justify-center rounded-lg");`;
      const classes = extractFromJsxWithCva(jsx, "test.tsx");
      expect(classes).toContain("flex");
      expect(classes).toContain("items-center");
      expect(classes).toContain("justify-center");
      expect(classes).toContain("rounded-lg");
    });

    it("should extract variant classes from cva", () => {
      const jsx = `
const button = cva("flex", {
  variants: {
    intent: {
      primary: "bg-blue-500 text-white",
      secondary: "bg-gray-200 text-gray-800",
    },
    size: {
      sm: "text-sm px-2 py-1",
      md: "text-base px-4 py-2",
    },
  },
});`;
      const classes = extractFromJsxWithCva(jsx, "test.tsx");
      expect(classes).toContain("flex");
      expect(classes).toContain("bg-blue-500");
      expect(classes).toContain("text-white");
      expect(classes).toContain("bg-gray-200");
      expect(classes).toContain("text-gray-800");
      expect(classes).toContain("text-sm");
      expect(classes).toContain("px-2");
      expect(classes).toContain("py-1");
      expect(classes).toContain("text-base");
      expect(classes).toContain("px-4");
      expect(classes).toContain("py-2");
    });

    it("should extract compound variant classes", () => {
      const jsx = `
const button = cva("flex", {
  compoundVariants: [
    {
      intent: "primary",
      size: "sm",
      class: "uppercase font-bold",
    },
  ],
});`;
      const classes = extractFromJsxWithCva(jsx, "test.tsx");
      expect(classes).toContain("uppercase");
      expect(classes).toContain("font-bold");
    });
  });
});

// ============================================================================
// TAILWIND-VARIANTS (TV)
// ============================================================================

describe("tailwind-variants (tv) Patterns", () => {
  describe("extractFromTailwindVariants", () => {
    it("should extract base classes from tv", () => {
      const jsx = `const button = tv({ base: "flex items-center justify-center" });`;
      const classes = extractFromTailwindVariants(jsx, "test.tsx");
      expect(classes).toContain("flex");
      expect(classes).toContain("items-center");
      expect(classes).toContain("justify-center");
    });

    it("should extract variant classes from tv", () => {
      const jsx = `
const button = tv({
  base: "flex",
  variants: {
    color: {
      primary: "bg-blue-500",
      secondary: "bg-gray-500",
    },
  },
});`;
      const classes = extractFromTailwindVariants(jsx, "test.tsx");
      expect(classes).toContain("flex");
      expect(classes).toContain("bg-blue-500");
      expect(classes).toContain("bg-gray-500");
    });

    it("should extract slot classes from tv", () => {
      const jsx = `
const card = tv({
  slots: {
    base: "rounded-lg shadow-md",
    header: "p-4 border-b",
    body: "p-4",
    footer: "p-4 border-t",
  },
});`;
      const classes = extractFromTailwindVariants(jsx, "test.tsx");
      expect(classes).toContain("rounded-lg");
      expect(classes).toContain("shadow-md");
      expect(classes).toContain("p-4");
      expect(classes).toContain("border-b");
      expect(classes).toContain("border-t");
    });
  });
});

// ============================================================================
// CSS EXTRACTORS
// ============================================================================

describe("CSS Extractors", () => {
  describe("extractFromCss", () => {
    it("should extract escaped Tailwind classes", () => {
      const css = `
.hover\\:bg-blue-500:hover { background-color: blue; }
.focus\\:ring-2:focus { ring-width: 2px; }
.md\\:flex { display: flex; }
`;
      const classes = extractFromCss(css, "test.css");
      expect(classes).toContain("hover:bg-blue-500");
      expect(classes).toContain("focus:ring-2");
      expect(classes).toContain("md:flex");
    });

    it("should extract arbitrary value classes from CSS", () => {
      const css = `
.bg-\\[\\#1da1f2\\] { background-color: #1da1f2; }
.w-\\[100px\\] { width: 100px; }
`;
      const classes = extractFromCss(css, "test.css");
      expect(classes).toContain("bg-[#1da1f2]");
      expect(classes).toContain("w-[100px]");
    });
  });

  describe("extractFromApplyDirectives", () => {
    it("should extract classes from @apply", () => {
      const css = `
.btn {
  @apply flex items-center justify-center px-4 py-2 rounded-lg;
}
`;
      const classes = extractFromApplyDirectives(css, "test.css");
      expect(classes).toContain("flex");
      expect(classes).toContain("items-center");
      expect(classes).toContain("justify-center");
      expect(classes).toContain("px-4");
      expect(classes).toContain("py-2");
      expect(classes).toContain("rounded-lg");
    });

    it("should extract arbitrary value classes from @apply", () => {
      const css = `
.custom {
  @apply bg-[#1da1f2] w-[calc(100%-2rem)];
}
`;
      const classes = extractFromApplyDirectives(css, "test.css");
      expect(classes).toContain("bg-[#1da1f2]");
      expect(classes).toContain("w-[calc(100%-2rem)]");
    });
  });

  describe("extractFromComplexSelector", () => {
    it("should extract classes from complex selectors", () => {
      const selector = ".flex.items-center > .bg-blue-500:hover";
      const classes = extractFromComplexSelector(selector);
      expect(classes).toContain("flex");
      expect(classes).toContain("items-center");
      expect(classes).toContain("bg-blue-500");
    });
  });

  describe("escapeCssClassName", () => {
    it("should escape special characters for CSS", () => {
      expect(escapeCssClassName("hover:bg-blue-500")).toBe("hover\\:bg-blue-500");
      expect(escapeCssClassName("bg-[#1da1f2]")).toBe("bg-\\[\\#1da1f2\\]");
      expect(escapeCssClassName("@container")).toBe("\\@container");
      expect(escapeCssClassName("w-1/2")).toBe("w-1\\/2");
    });
  });
});

// ============================================================================
// TAILWIND V4 CSS
// ============================================================================

describe("Tailwind v4 CSS", () => {
  describe("extractFromTailwindV4Css", () => {
    it("should extract classes from Tailwind v4 CSS", () => {
      const css = `
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
}

@layer utilities {
  .flex { display: flex; }
  .grid { display: grid; }
}
`;
      const classes = extractFromTailwindV4Css(css, "test.css");
      expect(classes).toContain("flex");
      expect(classes).toContain("grid");
      expect(classes).not.toContain("--color-primary");
    });

    it("should skip CSS variables", () => {
      const css = `
.--custom-color { color: red; }
.flex { display: flex; }
`;
      const classes = extractFromTailwindV4Css(css, "test.css");
      expect(classes).toContain("flex");
      expect(classes).not.toContain("--custom-color");
    });
  });
});

// ============================================================================
// COMPLETE EXTRACTION
// ============================================================================

describe("Complete Extraction (extractAllFromJsx)", () => {
  it("should extract all patterns from complex JSX", () => {
    const jsx = `
import { cn } from "~/utils";
import { cva } from "class-variance-authority";
import { tv } from "tailwind-variants";

const buttonVariants = cva("flex items-center justify-center", {
  variants: {
    intent: {
      primary: "bg-blue-500 text-white hover:bg-blue-600",
    },
  },
});

const cardStyles = tv({
  base: "rounded-lg shadow-md p-4",
});

export function Button({ className }) {
  return (
    <button
      className={cn(
        buttonVariants({ intent: "primary" }),
        "px-4 py-2",
        className
      )}
    >
      Click me
    </button>
  );
}

export function Card() {
  return (
    <div className="@container">
      <div className="@lg:flex @sm:hidden">
        <span className="data-[state=open]:bg-green-500 aria-pressed:font-bold">
          Content
        </span>
      </div>
    </div>
  );
}
`;
    const classes = extractAllFromJsx(jsx, "test.tsx");

    // CVA classes
    expect(classes).toContain("flex");
    expect(classes).toContain("items-center");
    expect(classes).toContain("justify-center");
    expect(classes).toContain("bg-blue-500");
    expect(classes).toContain("text-white");
    expect(classes).toContain("hover:bg-blue-600");

    // TV classes
    expect(classes).toContain("rounded-lg");
    expect(classes).toContain("shadow-md");
    expect(classes).toContain("p-4");

    // cn() classes
    expect(classes).toContain("px-4");
    expect(classes).toContain("py-2");

    // Container queries
    expect(classes).toContain("@container");
    expect(classes).toContain("@lg:flex");
    expect(classes).toContain("@sm:hidden");

    // Data attributes
    expect(classes).toContain("data-[state=open]:bg-green-500");

    // ARIA variants
    expect(classes).toContain("aria-pressed:font-bold");
  });
});

// ============================================================================
// EDGE CASES
// ============================================================================

describe("Edge Cases", () => {
  describe("isTailwindClass", () => {
    it("should reject invalid patterns", () => {
      expect(isTailwindClass("")).toBe(false);
      expect(isTailwindClass("123")).toBe(false);
      expect(isTailwindClass("#ff0000")).toBe(false);
      expect(isTailwindClass("http://example.com")).toBe(false);
      expect(isTailwindClass("/path/to/file")).toBe(false);
      expect(isTailwindClass("--custom-prop")).toBe(false);
    });

    it("should handle very long class names", () => {
      expect(isTailwindClass("sm:md:lg:xl:2xl:dark:hover:focus:active:bg-blue-500")).toBe(true);
    });

    it("should handle classes with special characters in arbitrary values", () => {
      expect(isTailwindClass("bg-[url('/images/hero.png')]")).toBe(true);
      expect(isTailwindClass("content-['Hello_World']")).toBe(true);
      expect(isTailwindClass("before:content-['→']")).toBe(true);
    });
  });

  describe("extractClassesFromString", () => {
    it("should handle empty string", () => {
      expect(extractClassesFromString("")).toEqual([]);
    });

    it("should handle string with only whitespace", () => {
      expect(extractClassesFromString("   \n\t  ")).toEqual([]);
    });

    it("should handle mixed content", () => {
      const result = extractClassesFromString("flex items-center ${someVar} bg-blue-500");
      expect(result).toContain("flex");
      expect(result).toContain("items-center");
      expect(result).toContain("bg-blue-500");
    });
  });
});
