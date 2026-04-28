/**
 * Tests for core context management functions
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  createContext,
  resolveOptions,
  shouldObfuscateClass,
  addClass,
  addClasses,
  getObfuscatedClass,
  getOriginalClass,
  updateMappingMetadata,
  getSharedContext,
  setSharedContext,
  clearSharedContext,
} from "../src/core/context.js";
import type { PluginContext } from "../src/core/types.js";

describe("resolveOptions", () => {
  it("should return default options when no options provided", () => {
    const options = resolveOptions();

    expect(options.prefix).toBe("tw-");
    expect(options.verbose).toBe(false);
    expect(options.debug).toBe(false);
    expect(options.sourcemap).toBe(true);
    expect(options.tailwindVersion).toBe("auto");
    expect(options.useAst).toBe(true);
    expect(options.usePostcss).toBe(true);
    expect(options.ignoreVueScoped).toBe(true);
    expect(options.preserve.functions).toEqual([]);
    expect(options.preserve.classes).toEqual([]);
    expect(options.filter).toBeNull();
  });

  it("should merge user options with defaults", () => {
    const options = resolveOptions({
      prefix: "x-",
      verbose: true,
      useAst: false,
      preserve: {
        functions: ["debugClass"],
        classes: ["dark", "light"],
      },
    });

    expect(options.prefix).toBe("x-");
    expect(options.verbose).toBe(true);
    expect(options.useAst).toBe(false);
    expect(options.preserve.functions).toEqual(["debugClass"]);
    expect(options.preserve.classes).toEqual(["dark", "light"]);
    // Defaults should remain
    expect(options.usePostcss).toBe(true);
    expect(options.ignoreVueScoped).toBe(true);
  });

  it("should use custom class generator when provided", () => {
    const customGenerator = (index: number, original: string) => `custom-${index}-${original}`;

    const options = resolveOptions({
      classGenerator: customGenerator,
    });

    expect(options.classGenerator(0, "test")).toBe("custom-0-test");
  });

  it("should handle custom filter function", () => {
    const filter = (className: string) => className.startsWith("tw-");

    const options = resolveOptions({ filter });

    expect(options.filter).toBe(filter);
    expect(options.filter!("tw-class")).toBe(true);
    expect(options.filter!("other-class")).toBe(false);
  });
});

describe("createContext", () => {
  it("should create a context with resolved options", () => {
    const ctx = createContext({ prefix: "test-" }, "production");

    expect(ctx.options.prefix).toBe("test-");
    expect(ctx.classMap).toBeInstanceOf(Map);
    expect(ctx.reverseMap).toBeInstanceOf(Map);
    expect(ctx.processedFiles).toBeInstanceOf(Set);
    expect(ctx.initialized).toBe(false);
    expect(ctx.detectedTailwindVersion).toBeNull();
  });

  it("should set refresh based on mode", () => {
    const devCtx = createContext({}, "development");
    const prodCtx = createContext({}, "production");

    expect(devCtx.options.refresh).toBe(true);
    expect(prodCtx.options.refresh).toBe(false);
  });

  it("should respect explicit refresh option", () => {
    const ctx = createContext({ refresh: true }, "production");
    expect(ctx.options.refresh).toBe(true);
  });
});

describe("shouldObfuscateClass", () => {
  const defaultOptions = resolveOptions();

  it("should return false for empty classes", () => {
    expect(shouldObfuscateClass("", defaultOptions)).toBe(false);
    expect(shouldObfuscateClass("  ", defaultOptions)).toBe(false);
  });

  it("should return false for CSS variables", () => {
    expect(shouldObfuscateClass("--custom-var", defaultOptions)).toBe(false);
  });

  it("should return false for very short classes", () => {
    expect(shouldObfuscateClass("a", defaultOptions)).toBe(false);
    expect(shouldObfuscateClass("ab", defaultOptions)).toBe(false);
    expect(shouldObfuscateClass("abc", defaultOptions)).toBe(true);
  });

  it("should return false for JavaScript hook classes", () => {
    expect(shouldObfuscateClass("js-hook", defaultOptions)).toBe(false);
    expect(shouldObfuscateClass("no-scroll", defaultOptions)).toBe(false);
    expect(shouldObfuscateClass("is-active", defaultOptions)).toBe(false);
    expect(shouldObfuscateClass("has-error", defaultOptions)).toBe(false);
    expect(shouldObfuscateClass("data-testid", defaultOptions)).toBe(false);
  });

  it("should return false for preserved classes", () => {
    const options = resolveOptions({
      preserve: { classes: ["dark", "light"] },
    });

    expect(shouldObfuscateClass("dark", options)).toBe(false);
    expect(shouldObfuscateClass("light", options)).toBe(false);
    expect(shouldObfuscateClass("other", options)).toBe(true);
  });

  it("should return false for excluded patterns", () => {
    const options = resolveOptions({
      exclude: ["flex", /^bg-/],
    });

    expect(shouldObfuscateClass("flex", options)).toBe(false);
    expect(shouldObfuscateClass("bg-red-500", options)).toBe(false);
    expect(shouldObfuscateClass("text-red-500", options)).toBe(true);
  });

  it("should respect include whitelist", () => {
    const options = resolveOptions({
      include: ["flex", /^text-/],
    });

    expect(shouldObfuscateClass("flex", options)).toBe(true);
    expect(shouldObfuscateClass("text-lg", options)).toBe(true);
    expect(shouldObfuscateClass("bg-red-500", options)).toBe(false);
  });

  it("should respect custom filter function", () => {
    const options = resolveOptions({
      filter: (className) => className.length > 5,
    });

    expect(shouldObfuscateClass("flex", options)).toBe(false);
    expect(shouldObfuscateClass("justify-center", options)).toBe(true);
  });
});

describe("addClass and addClasses", () => {
  let ctx: PluginContext;

  beforeEach(() => {
    ctx = createContext({}, "production");
  });

  it("should add a class to the mapping", () => {
    addClass(ctx, "flex", "test.tsx");

    expect(ctx.classMap.has("flex")).toBe(true);
    expect(ctx.classMapping.classes["flex"]).toBeDefined();
    expect(ctx.classMapping.classes["flex"].original).toBe("flex");
    expect(ctx.classMapping.classes["flex"].usedIn).toContain("test.tsx");
    expect(ctx.classMapping.classes["flex"].occurrences).toBe(1);
  });

  it("should increment occurrences for duplicate classes", () => {
    addClass(ctx, "flex", "file1.tsx");
    addClass(ctx, "flex", "file2.tsx");

    expect(ctx.classMapping.classes["flex"].occurrences).toBe(2);
    expect(ctx.classMapping.classes["flex"].usedIn).toContain("file1.tsx");
    expect(ctx.classMapping.classes["flex"].usedIn).toContain("file2.tsx");
  });

  it("should not add classes that should not be obfuscated", () => {
    addClass(ctx, "", "test.tsx");
    addClass(ctx, "a", "test.tsx");
    addClass(ctx, "--var", "test.tsx");

    expect(ctx.classMap.size).toBe(0);
  });

  it("should add multiple classes at once", () => {
    addClasses(ctx, ["flex", "items-center", "justify-between"], "test.tsx");

    expect(ctx.classMap.size).toBe(3);
    expect(ctx.classMap.has("flex")).toBe(true);
    expect(ctx.classMap.has("items-center")).toBe(true);
    expect(ctx.classMap.has("justify-between")).toBe(true);
  });

  it("should use custom class generator", () => {
    const customCtx = createContext(
      {
        classGenerator: (index, original) => `c${index}`,
      },
      "production"
    );

    addClass(customCtx, "flex", "test.tsx");
    addClass(customCtx, "grid", "test.tsx");

    expect(customCtx.classMap.get("flex")).toBe("c0");
    expect(customCtx.classMap.get("grid")).toBe("c1");
  });
});

describe("getObfuscatedClass and getOriginalClass", () => {
  let ctx: PluginContext;

  beforeEach(() => {
    ctx = createContext({}, "production");
    addClass(ctx, "flex", "test.tsx");
  });

  it("should return obfuscated class name", () => {
    const obfuscated = getObfuscatedClass(ctx, "flex");
    expect(obfuscated).toBeDefined();
    expect(obfuscated).toMatch(/^tw-/);
  });

  it("should return original class name from obfuscated", () => {
    const obfuscated = getObfuscatedClass(ctx, "flex")!;
    const original = getOriginalClass(ctx, obfuscated);
    expect(original).toBe("flex");
  });

  it("should return undefined for unknown classes", () => {
    expect(getObfuscatedClass(ctx, "unknown")).toBeUndefined();
    expect(getOriginalClass(ctx, "unknown")).toBeUndefined();
  });
});

describe("updateMappingMetadata", () => {
  it("should update mapping metadata", () => {
    const ctx = createContext({}, "production");
    addClass(ctx, "flex", "test.tsx");
    addClass(ctx, "grid", "test.tsx");

    updateMappingMetadata(ctx, "4");

    expect(ctx.classMapping.tailwindVersion).toBe("4");
    expect(ctx.classMapping.totalClasses).toBe(2);
    expect(ctx.classMapping.obfuscatedClasses).toBe(2);
    expect(ctx.classMapping.generatedAt).toBeDefined();
  });
});

describe("shared context", () => {
  beforeEach(() => {
    clearSharedContext();
  });

  it("should set and get shared context", () => {
    const ctx = createContext({}, "production");
    setSharedContext(ctx);

    expect(getSharedContext()).toBe(ctx);
  });

  it("should clear shared context", () => {
    const ctx = createContext({}, "production");
    setSharedContext(ctx);
    clearSharedContext();

    expect(getSharedContext()).toBeNull();
  });
});

describe("randomization", () => {
  it("should generate random class names by default", () => {
    const ctx1 = createContext({}, "production");
    const ctx2 = createContext({}, "production");

    addClass(ctx1, "flex", "test.tsx");
    addClass(ctx2, "flex", "test.tsx");

    const obfuscated1 = getObfuscatedClass(ctx1, "flex");
    const obfuscated2 = getObfuscatedClass(ctx2, "flex");

    // Both should have the prefix
    expect(obfuscated1).toMatch(/^tw-/);
    expect(obfuscated2).toMatch(/^tw-/);

    // They should be DIFFERENT (random)
    expect(obfuscated1).not.toBe(obfuscated2);
  });

  it("should generate different names on successive builds", () => {
    const generatedNames: string[] = [];

    // Simulate 10 different builds
    for (let i = 0; i < 10; i++) {
      const ctx = createContext({}, "production");
      addClass(ctx, "bg-blue-500", "test.tsx");
      generatedNames.push(getObfuscatedClass(ctx, "bg-blue-500")!);
    }

    // All names should be unique
    const uniqueNames = new Set(generatedNames);
    expect(uniqueNames.size).toBe(10);
  });

  it("should use sequential generator when randomize is false", () => {
    const ctx1 = createContext({ randomize: false }, "production");
    const ctx2 = createContext({ randomize: false }, "production");

    addClass(ctx1, "flex", "test.tsx");
    addClass(ctx2, "flex", "test.tsx");

    const obfuscated1 = getObfuscatedClass(ctx1, "flex");
    const obfuscated2 = getObfuscatedClass(ctx2, "flex");

    // Sequential generator should produce the same result
    expect(obfuscated1).toBe(obfuscated2);
    expect(obfuscated1).toBe("tw-a"); // First class = 'a'
  });

  it("should use default randomLength of 4", () => {
    const ctx = createContext({}, "production");
    addClass(ctx, "flex", "test.tsx");

    const obfuscated = getObfuscatedClass(ctx, "flex")!;
    // prefix (3) + random (4) = 7 characters minimum
    expect(obfuscated.length).toBeGreaterThanOrEqual(7);
  });

  it("should respect custom randomLength option", () => {
    const ctx = createContext({ randomLength: 8 }, "production");
    addClass(ctx, "flex", "test.tsx");

    const obfuscated = getObfuscatedClass(ctx, "flex")!;
    // prefix (3) + random (8) = 11 characters minimum
    expect(obfuscated.length).toBeGreaterThanOrEqual(11);
  });

  it("should generate valid CSS class names", () => {
    const ctx = createContext({}, "production");

    // Add many classes to test uniqueness
    const classes = [
      "flex",
      "grid",
      "block",
      "hidden",
      "p-4",
      "m-2",
      "bg-blue-500",
      "text-white",
      "rounded-lg",
      "shadow-md",
    ];

    for (const cls of classes) {
      addClass(ctx, cls, "test.tsx");
    }

    // All obfuscated names should be valid CSS class names
    for (const cls of classes) {
      const obfuscated = getObfuscatedClass(ctx, cls)!;
      // Must start with a letter (after prefix)
      expect(obfuscated).toMatch(/^tw-[a-z]/);
      // Must only contain valid characters
      expect(obfuscated).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("should ensure no collisions in generated names", () => {
    const ctx = createContext({}, "production");

    // Add 1000 classes
    for (let i = 0; i < 1000; i++) {
      addClass(ctx, `class-${i}`, "test.tsx");
    }

    // All should have unique obfuscated names
    const obfuscatedNames = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      const obfuscated = getObfuscatedClass(ctx, `class-${i}`)!;
      expect(obfuscatedNames.has(obfuscated)).toBe(false);
      obfuscatedNames.add(obfuscated);
    }

    expect(obfuscatedNames.size).toBe(1000);
  });
});
