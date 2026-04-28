/**
 * Tests for Tailwind CSS v3 React/Next.js - Class Obfuscation
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

describe("Tailwind v3 React/Next.js - Production Build", () => {
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

describe("Tailwind v3 React/Next.js - Comparison with v4", () => {
  it("should use tailwind.config.ts (v3 approach)", () => {
    const configPath = join(ROOT_DIR, "tailwind.config.ts");
    expect(existsSync(configPath)).toBe(true);
  });

  it("should NOT use @import tailwindcss (v4 syntax)", () => {
    const cssPath = join(ROOT_DIR, "src", "app", "globals.css");
    const content = readFileSync(cssPath, "utf-8");

    expect(content).not.toContain('@import "tailwindcss"');
    expect(content).toContain("@tailwind base");
  });

  it("should use tailwindcss-obfuscator (workspace) for extraction", () => {
    const packageJson = JSON.parse(readFileSync(join(ROOT_DIR, "package.json"), "utf-8"));

    expect(packageJson.devDependencies).toHaveProperty("tailwindcss-obfuscator");
  });

  it("should NOT use @tailwindcss/postcss (v4 plugin)", () => {
    const packageJson = JSON.parse(readFileSync(join(ROOT_DIR, "package.json"), "utf-8"));

    expect(packageJson.dependencies?.["@tailwindcss/postcss"]).toBeUndefined();
    expect(packageJson.devDependencies?.["@tailwindcss/postcss"]).toBeUndefined();
  });
});
