/**
 * Tests for Tailwind CSS v4 HTML Static - Class Extraction
 *
 * These tests verify that the custom extraction script correctly
 * extracts all Tailwind CSS classes from HTML and CSS files.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const ROOT_DIR = join(__dirname, "..");
const SRC_DIR = join(ROOT_DIR, "src");
const CLASS_LIST_PATH = join(ROOT_DIR, ".tw-obfuscation", "class-list.json");

describe("Tailwind v4 HTML Static - Class Extraction", () => {
  beforeAll(() => {
    // Run the extraction script before tests
    execSync("pnpm extract-classes", { cwd: ROOT_DIR, stdio: "pipe" });
  });

  it("should generate class-list.json file", () => {
    expect(existsSync(CLASS_LIST_PATH)).toBe(true);
  });

  it("should extract classes as a valid JSON array", () => {
    const content = readFileSync(CLASS_LIST_PATH, "utf-8");
    const classes = JSON.parse(content);

    expect(Array.isArray(classes)).toBe(true);
    expect(classes.length).toBeGreaterThan(0);
  });

  describe("HTML class extraction", () => {
    it("should extract basic color classes", () => {
      const classes = JSON.parse(readFileSync(CLASS_LIST_PATH, "utf-8"));

      expect(classes).toContain("bg-red-500");
      expect(classes).toContain("bg-blue-500");
      expect(classes).toContain("bg-green-500");
      expect(classes).toContain("text-white");
    });

    it("should extract responsive variant classes", () => {
      const classes = JSON.parse(readFileSync(CLASS_LIST_PATH, "utf-8"));

      expect(classes).toContain("sm:text-base");
      expect(classes).toContain("md:text-lg");
      expect(classes).toContain("lg:text-xl");
      expect(classes).toContain("xl:text-2xl");
    });

    it("should extract dark mode classes", () => {
      const classes = JSON.parse(readFileSync(CLASS_LIST_PATH, "utf-8"));

      expect(classes).toContain("dark:bg-gray-800");
      expect(classes).toContain("dark:bg-gray-900");
      expect(classes).toContain("dark:text-white");
    });

    it("should extract hover/focus state classes", () => {
      const classes = JSON.parse(readFileSync(CLASS_LIST_PATH, "utf-8"));

      expect(classes).toContain("hover:bg-blue-700");
      expect(classes).toContain("hover:text-blue-500");
      expect(classes).toContain("focus:border-blue-500");
    });

    it("should extract group/peer variant classes", () => {
      const classes = JSON.parse(readFileSync(CLASS_LIST_PATH, "utf-8"));

      expect(classes).toContain("group");
      expect(classes).toContain("group-hover:text-blue-500");
      expect(classes).toContain("group-hover:opacity-100");
      expect(classes).toContain("peer");
      expect(classes).toContain("peer-checked:block");
    });
  });

  describe("Tailwind v4 specific features", () => {
    it("should extract container query classes", () => {
      const classes = JSON.parse(readFileSync(CLASS_LIST_PATH, "utf-8"));

      expect(classes).toContain("@container");
      expect(classes).toContain("@sm:flex");
      expect(classes).toContain("@md:grid");
      expect(classes).toContain("@lg:block");
    });

    it("should extract named container classes", () => {
      const classes = JSON.parse(readFileSync(CLASS_LIST_PATH, "utf-8"));

      expect(classes).toContain("@container/card");
      expect(classes.some((c: string) => c.includes("@sm/card:"))).toBe(true);
      expect(classes.some((c: string) => c.includes("@md/card:"))).toBe(true);
    });

    it("should extract arbitrary value classes", () => {
      const classes = JSON.parse(readFileSync(CLASS_LIST_PATH, "utf-8"));

      expect(classes.some((c: string) => c.includes("["))).toBe(true);
    });

    it("should extract data attribute variant classes", () => {
      const classes = JSON.parse(readFileSync(CLASS_LIST_PATH, "utf-8"));

      expect(classes.some((c: string) => c.startsWith("data-["))).toBe(true);
    });

    it("should extract aria attribute variant classes", () => {
      const classes = JSON.parse(readFileSync(CLASS_LIST_PATH, "utf-8"));

      expect(classes.some((c: string) => c.startsWith("aria-"))).toBe(true);
    });
  });

  describe("CSS @apply extraction", () => {
    it("should extract classes from @apply directives", () => {
      const classes = JSON.parse(readFileSync(CLASS_LIST_PATH, "utf-8"));

      // Classes used in @apply in styles.css
      expect(classes).toContain("px-4");
      expect(classes).toContain("py-2");
      expect(classes).toContain("rounded-lg");
      expect(classes).toContain("font-medium");
      expect(classes).toContain("transition-colors");
    });
  });
});

describe("Tailwind v4 HTML Static - Source Files Validation", () => {
  it("should have index.html with Tailwind classes", () => {
    const indexPath = join(SRC_DIR, "index.html");
    expect(existsSync(indexPath)).toBe(true);

    const content = readFileSync(indexPath, "utf-8");
    expect(content).toContain('class="');
    expect(content).toContain("bg-");
    expect(content).toContain("text-");
  });

  it("should have styles.css with @import tailwindcss (v4 syntax)", () => {
    const cssPath = join(SRC_DIR, "styles.css");
    expect(existsSync(cssPath)).toBe(true);

    const content = readFileSync(cssPath, "utf-8");
    expect(content).toContain('@import "tailwindcss"');
    expect(content).toContain("@theme");
    expect(content).toContain("@layer components");
  });

  it("should use CSS-first configuration with @theme", () => {
    const cssPath = join(SRC_DIR, "styles.css");
    const content = readFileSync(cssPath, "utf-8");

    expect(content).toContain("--color-primary");
    expect(content).toContain("--color-secondary");
  });
});
