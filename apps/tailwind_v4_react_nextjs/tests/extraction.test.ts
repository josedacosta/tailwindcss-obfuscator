/**
 * Tests for Tailwind CSS v4 React/Next.js - Class Extraction
 *
 * These tests verify that the custom extraction script correctly
 * extracts all Tailwind CSS classes from React components and CSS files.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { execSync } from "node:child_process";

const ROOT_DIR = join(__dirname, "..");
const SRC_DIR = join(ROOT_DIR, "src");
const CLASS_LIST_PATH = join(ROOT_DIR, ".tw-obfuscation", "class-list.json");

describe("Tailwind v4 React/Next.js - Custom Class Extraction", () => {
  beforeAll(() => {
    // Run the extraction script
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

  it("should have extraction script for v4 (no tailwindcss-patch)", () => {
    const scriptPath = join(ROOT_DIR, "scripts", "extract-classes.ts");
    expect(existsSync(scriptPath)).toBe(true);

    const content = readFileSync(scriptPath, "utf-8");
    // The script delegates extraction to `tailwindcss-obfuscator/internals`;
    // assert the expected entry points are referenced.
    expect(content).toMatch(/extractFromClassName|extractFromJsx/);
    expect(content).toMatch(/extractFromCssApply|extractFromCss/);
    expect(content).toContain("className");
  });
});

describe("Tailwind v4 React/Next.js - JSX className Extraction", () => {
  it("should extract basic color classes from components", () => {
    const classes = JSON.parse(readFileSync(CLASS_LIST_PATH, "utf-8"));

    expect(classes).toContain("bg-red-500");
    expect(classes).toContain("bg-blue-500");
    expect(classes).toContain("bg-green-500");
    expect(classes).toContain("text-white");
  });

  it("should extract responsive variant classes", () => {
    const classes = JSON.parse(readFileSync(CLASS_LIST_PATH, "utf-8"));

    expect(classes.some((c: string) => c.startsWith("sm:"))).toBe(true);
    expect(classes.some((c: string) => c.startsWith("md:"))).toBe(true);
    expect(classes.some((c: string) => c.startsWith("lg:"))).toBe(true);
  });

  it("should extract dark mode classes", () => {
    const classes = JSON.parse(readFileSync(CLASS_LIST_PATH, "utf-8"));

    expect(classes.some((c: string) => c.startsWith("dark:"))).toBe(true);
  });

  it("should extract hover/focus state classes", () => {
    const classes = JSON.parse(readFileSync(CLASS_LIST_PATH, "utf-8"));

    expect(classes.some((c: string) => c.startsWith("hover:"))).toBe(true);
    expect(classes.some((c: string) => c.startsWith("focus:"))).toBe(true);
  });

  it("should extract group/peer variant classes", () => {
    const classes = JSON.parse(readFileSync(CLASS_LIST_PATH, "utf-8"));

    expect(classes).toContain("group");
    expect(classes.some((c: string) => c.startsWith("group-hover:"))).toBe(true);
  });
});

describe("Tailwind v4 React/Next.js - Container Queries (v4 Feature)", () => {
  it("should extract @container classes", () => {
    const classes = JSON.parse(readFileSync(CLASS_LIST_PATH, "utf-8"));

    expect(classes).toContain("@container");
  });

  it("should extract basic container query variants", () => {
    const classes = JSON.parse(readFileSync(CLASS_LIST_PATH, "utf-8"));

    expect(classes.some((c: string) => c.startsWith("@sm:"))).toBe(true);
    expect(classes.some((c: string) => c.startsWith("@md:"))).toBe(true);
    expect(classes.some((c: string) => c.startsWith("@lg:"))).toBe(true);
  });

  it("should extract named container classes", () => {
    const classes = JSON.parse(readFileSync(CLASS_LIST_PATH, "utf-8"));

    expect(classes).toContain("@container/card");
    expect(classes.some((c: string) => c.includes("@sm/card:"))).toBe(true);
    expect(classes.some((c: string) => c.includes("@md/card:"))).toBe(true);
  });

  it("should have ContainerQueries component with v4 features", () => {
    const componentPath = join(SRC_DIR, "components", "ContainerQueries.tsx");
    expect(existsSync(componentPath)).toBe(true);

    const content = readFileSync(componentPath, "utf-8");
    expect(content).toContain("@container");
    expect(content).toContain("@sm:");
    expect(content).toContain("@md:");
    expect(content).toContain("@lg:");
  });
});

describe("Tailwind v4 React/Next.js - CSS @apply Extraction", () => {
  it("should extract classes from @apply directives", () => {
    const classes = JSON.parse(readFileSync(CLASS_LIST_PATH, "utf-8"));

    // Classes used in @apply in globals.css
    expect(classes).toContain("px-4");
    expect(classes).toContain("py-2");
    expect(classes).toContain("rounded-lg");
    expect(classes).toContain("font-medium");
    expect(classes).toContain("transition-colors");
  });
});

describe("Tailwind v4 React/Next.js - Source Component Validation", () => {
  function findReactFiles(dir: string): string[] {
    const files: string[] = [];
    if (!existsSync(dir)) return files;

    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...findReactFiles(fullPath));
      } else if ([".tsx", ".jsx"].includes(extname(entry).toLowerCase())) {
        files.push(fullPath);
      }
    }
    return files;
  }

  it("should have React components with Tailwind className", () => {
    const componentFiles = findReactFiles(join(SRC_DIR, "components"));
    expect(componentFiles.length).toBeGreaterThan(0);

    // Check that at least some components have className (not all do, e.g., wrapper re-exports)
    let hasClassName = false;
    for (const file of componentFiles) {
      const content = readFileSync(file, "utf-8");
      if (content.includes("className=")) {
        hasClassName = true;
        break;
      }
    }
    expect(hasClassName).toBe(true);
  });

  it("should have globals.css with @import tailwindcss (v4 syntax)", () => {
    const cssPath = join(SRC_DIR, "app", "globals.css");
    expect(existsSync(cssPath)).toBe(true);

    const content = readFileSync(cssPath, "utf-8");
    expect(content).toContain('@import "tailwindcss"');
    expect(content).toContain("@theme");
    expect(content).toContain("@layer components");
  });

  it("should use CSS-first configuration with @theme", () => {
    const cssPath = join(SRC_DIR, "app", "globals.css");
    const content = readFileSync(cssPath, "utf-8");

    expect(content).toContain("--color-primary");
    expect(content).toContain("--color-secondary");
  });
});

describe("Tailwind v4 React/Next.js - Extraction Script Features", () => {
  it("should support double quote className", () => {
    const scriptPath = join(ROOT_DIR, "scripts", "extract-classes.ts");
    const content = readFileSync(scriptPath, "utf-8");

    expect(content).toContain('className="');
  });

  it("should support single quote className", () => {
    const scriptPath = join(ROOT_DIR, "scripts", "extract-classes.ts");
    const content = readFileSync(scriptPath, "utf-8");

    expect(content).toContain("className='");
  });

  it("should support template literal className", () => {
    const scriptPath = join(ROOT_DIR, "scripts", "extract-classes.ts");
    const content = readFileSync(scriptPath, "utf-8");

    expect(content).toContain("className={`");
  });

  it("should support brace string className", () => {
    const scriptPath = join(ROOT_DIR, "scripts", "extract-classes.ts");
    const content = readFileSync(scriptPath, "utf-8");

    expect(content).toContain('className={"');
  });
});
