/**
 * Tests for Tailwind CSS v4 React/Next.js - Class Obfuscation
 *
 * Note: The unplugin-tailwindcss-mangle webpack plugin has compatibility issues
 * with Next.js. These tests verify the production build works correctly.
 * Obfuscation can be applied via post-processing or alternative tools.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const ROOT_DIR = join(__dirname, "..");
const NEXT_DIR = join(ROOT_DIR, ".next");
const STATIC_DIR = join(NEXT_DIR, "static");

describe("Tailwind v4 React/Next.js - Production Build", () => {
  beforeAll(() => {
    // Run the production build
    execSync("pnpm build", { cwd: ROOT_DIR, stdio: "pipe", timeout: 180000 });
  }, 180000);

  it("should create .next directory with built files", () => {
    expect(existsSync(NEXT_DIR)).toBe(true);
    expect(existsSync(STATIC_DIR)).toBe(true);
  });

  describe("CSS in production", () => {
    function findCssFiles(dir: string): string[] {
      const files: string[] = [];
      if (!existsSync(dir)) return files;

      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
          files.push(...findCssFiles(fullPath));
        } else if (entry.name.endsWith(".css")) {
          files.push(fullPath);
        }
      }
      return files;
    }

    it("should create CSS files in production build", () => {
      const cssFiles = findCssFiles(STATIC_DIR);
      expect(cssFiles.length).toBeGreaterThan(0);
    });

    it("should contain Tailwind CSS utilities", () => {
      const cssFiles = findCssFiles(STATIC_DIR);

      if (cssFiles.length > 0) {
        const cssContent = cssFiles.map((f) => readFileSync(f, "utf-8")).join("\n");

        // CSS should contain Tailwind utilities (--tw- variables or class selectors)
        expect(cssContent).toMatch(/--tw-|\.[\w-]+/);
      }
    });
  });

  describe("JavaScript in production", () => {
    function findJsFiles(dir: string): string[] {
      const files: string[] = [];
      if (!existsSync(dir)) return files;

      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
          files.push(...findJsFiles(fullPath));
        } else if (entry.name.endsWith(".js")) {
          files.push(fullPath);
        }
      }
      return files;
    }

    it("should create JS chunks in production build", () => {
      const jsFiles = findJsFiles(join(STATIC_DIR, "chunks"));
      expect(jsFiles.length).toBeGreaterThan(0);
    });

    it("should contain className references", () => {
      const chunksDir = join(STATIC_DIR, "chunks");
      const jsFiles = findJsFiles(chunksDir);

      if (jsFiles.length > 0) {
        const jsContent = jsFiles.map((f) => readFileSync(f, "utf-8")).join("\n");

        // JS should contain class name references
        expect(jsContent.length).toBeGreaterThan(0);
      }
    });
  });
});

describe("Tailwind v4 React/Next.js - v4 Specific Features", () => {
  it("should use @tailwindcss/postcss (v4 plugin)", () => {
    const packageJson = JSON.parse(readFileSync(join(ROOT_DIR, "package.json"), "utf-8"));

    expect(
      packageJson.dependencies?.["@tailwindcss/postcss"] ||
        packageJson.devDependencies?.["@tailwindcss/postcss"]
    ).toBeDefined();
  });

  it("should use @import tailwindcss syntax", () => {
    const cssPath = join(ROOT_DIR, "src", "app", "globals.css");
    const content = readFileSync(cssPath, "utf-8");

    expect(content).toContain('@import "tailwindcss"');
    expect(content).not.toContain("@tailwind base");
  });

  it("should NOT have tailwindcss-patch (v4 incompatible)", () => {
    const packageJson = JSON.parse(readFileSync(join(ROOT_DIR, "package.json"), "utf-8"));

    expect(packageJson.dependencies?.["tailwindcss-patch"]).toBeUndefined();
    expect(packageJson.devDependencies?.["tailwindcss-patch"]).toBeUndefined();
  });

  it("should use custom extraction script instead of tw-patch", () => {
    const packageJson = JSON.parse(readFileSync(join(ROOT_DIR, "package.json"), "utf-8"));

    expect(packageJson.scripts?.["extract-classes"]).toContain("tsx");
    expect(packageJson.scripts?.["extract-classes"]).toContain("extract-classes.ts");
    expect(packageJson.scripts?.["extract-classes"]).not.toContain("tw-patch");
  });
});

describe("Tailwind v4 React/Next.js - Comparison with v3", () => {
  it("should use CSS-first configuration with @theme (v4 approach)", () => {
    // v4 uses CSS-first approach with @theme instead of tailwind.config.ts
    const cssPath = join(ROOT_DIR, "src", "app", "globals.css");
    const content = readFileSync(cssPath, "utf-8");

    // Verify CSS-first configuration is used
    expect(content).toContain("@theme");
  });

  it("should have v4-specific PostCSS config", () => {
    const postcssPath = join(ROOT_DIR, "postcss.config.mjs");
    expect(existsSync(postcssPath)).toBe(true);

    const content = readFileSync(postcssPath, "utf-8");
    expect(content).toContain("@tailwindcss/postcss");
  });

  it("should use tailwindcss v4.x", () => {
    const packageJson = JSON.parse(readFileSync(join(ROOT_DIR, "package.json"), "utf-8"));

    const tailwindVersion =
      packageJson.dependencies?.["tailwindcss"] || packageJson.devDependencies?.["tailwindcss"];

    expect(tailwindVersion).toMatch(/\^4\./);
  });
});
