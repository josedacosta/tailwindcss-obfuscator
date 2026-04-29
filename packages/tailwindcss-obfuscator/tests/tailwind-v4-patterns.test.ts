/**
 * Tailwind CSS v4 Advanced Patterns Tests
 *
 * Tests for patterns that are new or enhanced in Tailwind CSS v4:
 * - Arbitrary variants: [@media(...)]:, [&_p]:
 * - Wildcard selectors: *:, **:
 * - In variants: in-hover:, in-focus:
 * - nth variants: nth-2:, nth-[2n+1]:
 * - Starting style: starting:
 * - Forced colors: forced-colors:
 * - Enhanced container queries
 * - Trailing important: flex!
 */

import { describe, it, expect } from "vitest";
import { isTailwindClass, extractClassesFromString } from "../src/extractors/base.js";
import { extractFromJsx } from "../src/extractors/jsx.js";
import { extractFromHtml } from "../src/extractors/html.js";

// ============================================================================
// ARBITRARY VARIANTS (v4)
// ============================================================================

describe("Arbitrary Variants (v4)", () => {
  describe("isTailwindClass", () => {
    it("should recognize arbitrary CSS selectors as variants", () => {
      expect(isTailwindClass("[&_p]:text-blue-500")).toBe(true);
      expect(isTailwindClass("[&>img]:rounded-lg")).toBe(true);
      expect(isTailwindClass("[&:hover]:bg-red-500")).toBe(true);
    });

    it("should recognize arbitrary media queries as variants", () => {
      expect(isTailwindClass("[@media(min-width:640px)]:flex")).toBe(true);
      expect(isTailwindClass("[@media(prefers-color-scheme:dark)]:bg-gray-900")).toBe(true);
    });

    it("should recognize arbitrary supports queries as variants", () => {
      expect(isTailwindClass("[@supports(display:grid)]:grid")).toBe(true);
      expect(isTailwindClass("[@supports(backdrop-filter:blur(1px))]:backdrop-blur")).toBe(true);
    });

    it("should recognize arbitrary container queries as variants", () => {
      expect(isTailwindClass("[@container(min-width:640px)]:flex")).toBe(true);
    });
  });

  describe("extractFromJsx", () => {
    it("should extract arbitrary variant classes from JSX", () => {
      const jsx = `<div className="[&_p]:text-blue-500 [&>img]:rounded-lg">Content</div>`;
      const classes = extractFromJsx(jsx, "test.tsx");
      expect(classes).toContain("[&_p]:text-blue-500");
      expect(classes).toContain("[&>img]:rounded-lg");
    });
  });
});

// ============================================================================
// WILDCARD SELECTORS (v4)
// ============================================================================

describe("Wildcard Selectors (v4)", () => {
  describe("isTailwindClass", () => {
    it("should recognize single wildcard selector", () => {
      expect(isTailwindClass("*:flex")).toBe(true);
      expect(isTailwindClass("*:p-4")).toBe(true);
      expect(isTailwindClass("*:bg-blue-500")).toBe(true);
    });

    it("should recognize double wildcard selector", () => {
      expect(isTailwindClass("**:flex")).toBe(true);
      expect(isTailwindClass("**:text-sm")).toBe(true);
      expect(isTailwindClass("**:hover:bg-gray-100")).toBe(true);
    });

    it("should recognize wildcards with other variants", () => {
      expect(isTailwindClass("hover:*:opacity-100")).toBe(true);
      expect(isTailwindClass("group-hover:*:visible")).toBe(true);
    });
  });

  describe("extractFromHtml", () => {
    it("should extract wildcard classes from HTML", () => {
      const html = `<div class="*:flex *:items-center">Content</div>`;
      const classes = extractFromHtml(html);
      expect(classes).toContain("*:flex");
      expect(classes).toContain("*:items-center");
    });
  });
});

// ============================================================================
// IN VARIANTS (v4)
// ============================================================================

describe("In Variants (v4)", () => {
  describe("isTailwindClass", () => {
    it("should recognize in-* variants", () => {
      expect(isTailwindClass("in-hover:bg-blue-500")).toBe(true);
      expect(isTailwindClass("in-focus:ring-2")).toBe(true);
      expect(isTailwindClass("in-data-[state=open]:block")).toBe(true);
    });

    it("should recognize in-* with arbitrary selectors", () => {
      expect(isTailwindClass("in-[.sidebar]:bg-gray-100")).toBe(true);
      expect(isTailwindClass("in-[[data-active]]:font-bold")).toBe(true);
    });
  });
});

// ============================================================================
// NTH VARIANTS (v4)
// ============================================================================

describe("nth Variants (v4)", () => {
  describe("isTailwindClass", () => {
    it("should recognize nth-* variants with numbers", () => {
      expect(isTailwindClass("nth-2:bg-gray-100")).toBe(true);
      expect(isTailwindClass("nth-3:mt-4")).toBe(true);
      expect(isTailwindClass("nth-5:border-t")).toBe(true);
    });

    it("should recognize nth-* with arbitrary values", () => {
      expect(isTailwindClass("nth-[2n+1]:bg-gray-50")).toBe(true);
      expect(isTailwindClass("nth-[3n]:bg-blue-50")).toBe(true);
      expect(isTailwindClass("nth-[odd]:bg-gray-100")).toBe(true);
      expect(isTailwindClass("nth-[even]:bg-white")).toBe(true);
    });

    it("should recognize nth-last-* variants", () => {
      expect(isTailwindClass("nth-last-2:mb-0")).toBe(true);
      expect(isTailwindClass("nth-last-[2n]:border-b")).toBe(true);
    });

    it("should recognize nth-of-type-* variants", () => {
      expect(isTailwindClass("nth-of-type-2:text-lg")).toBe(true);
      expect(isTailwindClass("nth-of-type-[3n+1]:font-bold")).toBe(true);
    });

    it("should recognize nth-last-of-type-* variants", () => {
      expect(isTailwindClass("nth-last-of-type-2:opacity-50")).toBe(true);
      expect(isTailwindClass("nth-last-of-type-[2n]:hidden")).toBe(true);
    });
  });

  describe("extractFromJsx", () => {
    it("should extract nth variant classes from JSX", () => {
      const jsx = `<ul className="nth-2:bg-gray-100 nth-[2n+1]:bg-gray-50">Items</ul>`;
      const classes = extractFromJsx(jsx, "test.tsx");
      expect(classes).toContain("nth-2:bg-gray-100");
      expect(classes).toContain("nth-[2n+1]:bg-gray-50");
    });
  });
});

// ============================================================================
// STARTING STYLE (v4)
// ============================================================================

describe("Starting Style (v4)", () => {
  describe("isTailwindClass", () => {
    it("should recognize starting: variant", () => {
      expect(isTailwindClass("starting:opacity-0")).toBe(true);
      expect(isTailwindClass("starting:scale-95")).toBe(true);
      expect(isTailwindClass("starting:translate-y-4")).toBe(true);
    });

    it("should recognize starting with other variants", () => {
      expect(isTailwindClass("open:starting:opacity-0")).toBe(true);
      expect(isTailwindClass("group-open:starting:scale-100")).toBe(true);
    });
  });
});

// ============================================================================
// FORCED COLORS (v4)
// ============================================================================

describe("Forced Colors (v4)", () => {
  describe("isTailwindClass", () => {
    it("should recognize forced-colors: variant", () => {
      expect(isTailwindClass("forced-colors:outline")).toBe(true);
      expect(isTailwindClass("forced-colors:border-2")).toBe(true);
      expect(isTailwindClass("forced-colors:text-[ButtonText]")).toBe(true);
    });
  });
});

// ============================================================================
// TRAILING IMPORTANT (v4)
// ============================================================================

describe("Trailing Important Modifier (v4)", () => {
  describe("isTailwindClass", () => {
    it("should recognize trailing ! for important", () => {
      expect(isTailwindClass("flex!")).toBe(true);
      expect(isTailwindClass("bg-red-500!")).toBe(true);
      expect(isTailwindClass("p-4!")).toBe(true);
    });

    it("should recognize trailing ! with variants", () => {
      expect(isTailwindClass("hover:bg-blue-500!")).toBe(true);
      expect(isTailwindClass("md:flex!")).toBe(true);
      expect(isTailwindClass("dark:text-white!")).toBe(true);
    });

    it("should recognize both leading and trailing !", () => {
      expect(isTailwindClass("!flex")).toBe(true);
      expect(isTailwindClass("flex!")).toBe(true);
      expect(isTailwindClass("hover:!bg-red-500")).toBe(true);
      expect(isTailwindClass("hover:bg-red-500!")).toBe(true);
    });
  });
});

// ============================================================================
// ENHANCED CONTAINER QUERIES (v4)
// ============================================================================

describe("Enhanced Container Queries (v4)", () => {
  describe("isTailwindClass", () => {
    it("should recognize @min and @max variants", () => {
      expect(isTailwindClass("@min-sm:flex")).toBe(true);
      expect(isTailwindClass("@max-lg:hidden")).toBe(true);
      expect(isTailwindClass("@min-[400px]:grid")).toBe(true);
      expect(isTailwindClass("@max-[800px]:block")).toBe(true);
    });

    it("should recognize extended container sizes", () => {
      expect(isTailwindClass("@3xl:text-xl")).toBe(true);
      expect(isTailwindClass("@4xl:grid-cols-4")).toBe(true);
      expect(isTailwindClass("@5xl:gap-8")).toBe(true);
      expect(isTailwindClass("@6xl:p-12")).toBe(true);
      expect(isTailwindClass("@7xl:max-w-screen")).toBe(true);
    });

    it("should recognize named containers with size variants", () => {
      expect(isTailwindClass("@lg/sidebar:flex")).toBe(true);
      expect(isTailwindClass("@xl/main:grid-cols-3")).toBe(true);
      expect(isTailwindClass("@[500px]/card:p-8")).toBe(true);
    });
  });
});

// ============================================================================
// ENHANCED BREAKPOINTS (v4)
// ============================================================================

describe("Enhanced Breakpoints (v4)", () => {
  describe("isTailwindClass", () => {
    it("should recognize extended breakpoints", () => {
      expect(isTailwindClass("3xl:flex")).toBe(true);
      expect(isTailwindClass("4xl:grid")).toBe(true);
      expect(isTailwindClass("5xl:hidden")).toBe(true);
      expect(isTailwindClass("6xl:block")).toBe(true);
      expect(isTailwindClass("7xl:flex")).toBe(true);
    });

    it("should recognize min/max breakpoints", () => {
      expect(isTailwindClass("min-sm:flex")).toBe(true);
      expect(isTailwindClass("max-md:hidden")).toBe(true);
      expect(isTailwindClass("min-[400px]:block")).toBe(true);
      expect(isTailwindClass("max-[1024px]:grid")).toBe(true);
    });
  });
});

// ============================================================================
// STACKED VARIANTS WITH NEW v4 FEATURES
// ============================================================================

describe("Stacked Variants with v4 Features", () => {
  describe("isTailwindClass", () => {
    it("should recognize complex variant stacking with v4 features", () => {
      expect(isTailwindClass("*:hover:opacity-100")).toBe(true);
      expect(isTailwindClass("**:first:mt-0")).toBe(true);
      expect(isTailwindClass("in-hover:*:visible")).toBe(true);
      expect(isTailwindClass("nth-2:hover:bg-blue-500")).toBe(true);
      expect(isTailwindClass("starting:open:opacity-100")).toBe(true);
    });

    it("should recognize container + state + utility combinations", () => {
      expect(isTailwindClass("@lg:hover:bg-blue-600")).toBe(true);
      expect(isTailwindClass("@[500px]:dark:text-white")).toBe(true);
      expect(isTailwindClass("@md/sidebar:group-hover:visible")).toBe(true);
    });
  });

  describe("extractFromJsx", () => {
    it("should extract complex stacked variants", () => {
      const jsx = `
        <div className="*:hover:opacity-100 @lg:dark:bg-gray-800 nth-[2n]:first:mt-0">
          Content
        </div>
      `;
      const classes = extractFromJsx(jsx, "test.tsx");
      expect(classes).toContain("*:hover:opacity-100");
      expect(classes).toContain("@lg:dark:bg-gray-800");
      expect(classes).toContain("nth-[2n]:first:mt-0");
    });
  });
});

// ============================================================================
// CSS VARIABLE SHORTHAND EXTENDED (v4)
// ============================================================================

describe("CSS Variable Shorthand Extended (v4)", () => {
  describe("isTailwindClass", () => {
    it("should recognize CSS variable shorthand with type hints", () => {
      expect(isTailwindClass("bg-(color:--my-bg)")).toBe(true);
      expect(isTailwindClass("text-(length:--heading-size)")).toBe(true);
    });

    it("should recognize CSS variable with opacity", () => {
      expect(isTailwindClass("bg-(--primary)/50")).toBe(true);
      expect(isTailwindClass("text-(--accent)/75")).toBe(true);
    });
  });
});

// ============================================================================
// ENHANCED DATA AND ARIA PATTERNS (v4)
// ============================================================================

describe("Enhanced Data and ARIA Patterns (v4)", () => {
  describe("isTailwindClass", () => {
    it("should recognize complex data attribute patterns", () => {
      expect(isTailwindClass("data-[orientation=horizontal]:flex-row")).toBe(true);
      expect(isTailwindClass("data-[size=lg]:text-xl")).toBe(true);
      expect(isTailwindClass("group-data-[collapsible=icon]:hidden")).toBe(true);
    });

    it("should recognize complex ARIA patterns", () => {
      expect(isTailwindClass("aria-[sort=ascending]:rotate-0")).toBe(true);
      expect(isTailwindClass("aria-[sort=descending]:rotate-180")).toBe(true);
      expect(isTailwindClass("group-aria-[expanded=true]:block")).toBe(true);
      expect(isTailwindClass("peer-aria-[invalid=true]:border-red-500")).toBe(true);
    });
  });
});

// ============================================================================
// COMPLETE CLASS STRING EXTRACTION
// ============================================================================

describe("Complete v4 Pattern Extraction", () => {
  it("should extract all v4 patterns from a complex class string", () => {
    const classString = `
      flex *:p-4 **:text-sm
      @container @lg:flex @[500px]:grid
      nth-2:bg-gray-100 nth-[2n+1]:bg-gray-50
      [&_p]:text-blue-500 [@media(min-width:640px)]:hidden
      starting:opacity-0 forced-colors:outline
      in-hover:visible bg-red-500!
    `;

    const classes = extractClassesFromString(classString.trim());

    // Basic
    expect(classes).toContain("flex");

    // Wildcards
    expect(classes).toContain("*:p-4");
    expect(classes).toContain("**:text-sm");

    // Container queries
    expect(classes).toContain("@container");
    expect(classes).toContain("@lg:flex");
    expect(classes).toContain("@[500px]:grid");

    // nth variants
    expect(classes).toContain("nth-2:bg-gray-100");
    expect(classes).toContain("nth-[2n+1]:bg-gray-50");

    // Arbitrary variants
    expect(classes).toContain("[&_p]:text-blue-500");
    expect(classes).toContain("[@media(min-width:640px)]:hidden");

    // v4 specific
    expect(classes).toContain("starting:opacity-0");
    expect(classes).toContain("forced-colors:outline");
    expect(classes).toContain("in-hover:visible");

    // Trailing important
    expect(classes).toContain("bg-red-500!");
  });
});

// ============================================================================
// v4.2.0 LOGICAL-AXIS UTILITIES + 3D TRANSFORMS + NEW GRADIENTS
// ============================================================================

describe("v4.2.0+ utility families recognised by isTailwindClass", () => {
  it("recognises logical-axis padding/margin (pbs, pbe, mbs, mbe + scroll-* family)", () => {
    expect(isTailwindClass("pbs-4")).toBe(true);
    expect(isTailwindClass("pbe-2")).toBe(true);
    expect(isTailwindClass("mbs-8")).toBe(true);
    expect(isTailwindClass("mbe-1")).toBe(true);
    expect(isTailwindClass("scroll-pbs-4")).toBe(true);
    expect(isTailwindClass("scroll-pbe-2")).toBe(true);
    expect(isTailwindClass("scroll-mbs-8")).toBe(true);
    expect(isTailwindClass("scroll-mbe-1")).toBe(true);
  });

  it("recognises logical-axis borders (border-bs, border-be)", () => {
    expect(isTailwindClass("border-bs-1")).toBe(true);
    expect(isTailwindClass("border-be-2")).toBe(true);
  });

  it("recognises logical-axis inset (inset-bs/be/s/e)", () => {
    expect(isTailwindClass("inset-bs-4")).toBe(true);
    expect(isTailwindClass("inset-be-0")).toBe(true);
    expect(isTailwindClass("inset-s-2")).toBe(true);
    expect(isTailwindClass("inset-e-1")).toBe(true);
  });

  it("recognises inline-axis / block-axis sizing (inline-*, block-*, min/max-*)", () => {
    expect(isTailwindClass("inline-32")).toBe(true);
    expect(isTailwindClass("block-16")).toBe(true);
    expect(isTailwindClass("min-inline-0")).toBe(true);
    expect(isTailwindClass("max-inline-screen")).toBe(true);
    expect(isTailwindClass("min-block-0")).toBe(true);
    expect(isTailwindClass("max-block-full")).toBe(true);
  });

  it("recognises font-features-* (v4.2.0)", () => {
    expect(isTailwindClass("font-features-tabular")).toBe(true);
    expect(isTailwindClass("font-features-[liga]")).toBe(true);
  });

  it("recognises new gradient families (bg-linear, bg-radial, bg-conic + via-none)", () => {
    expect(isTailwindClass("bg-linear-to-r")).toBe(true);
    expect(isTailwindClass("bg-radial")).toBe(true);
    expect(isTailwindClass("bg-conic-from-blue-500")).toBe(true);
    expect(isTailwindClass("via-none")).toBe(true);
  });

  it("recognises 3D transforms (rotate-x/y/z, translate-z, scale-z, perspective)", () => {
    expect(isTailwindClass("rotate-x-45")).toBe(true);
    expect(isTailwindClass("rotate-y-90")).toBe(true);
    expect(isTailwindClass("rotate-z-180")).toBe(true);
    expect(isTailwindClass("translate-z-4")).toBe(true);
    expect(isTailwindClass("scale-z-110")).toBe(true);
    expect(isTailwindClass("perspective-1000")).toBe(true);
    expect(isTailwindClass("perspective-origin-top")).toBe(true);
    expect(isTailwindClass("transform-3d")).toBe(true);
  });

  it("recognises new utility families (inset-shadow, inset-ring, field-sizing, color-scheme, font-stretch)", () => {
    expect(isTailwindClass("inset-shadow-lg")).toBe(true);
    expect(isTailwindClass("inset-ring-2")).toBe(true);
    expect(isTailwindClass("field-sizing-content")).toBe(true);
    expect(isTailwindClass("color-scheme-dark")).toBe(true);
    expect(isTailwindClass("font-stretch-condensed")).toBe(true);
  });
});
