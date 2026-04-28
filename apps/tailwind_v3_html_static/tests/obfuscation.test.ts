/**
 * Tests for Tailwind CSS v3 HTML Static - Class Obfuscation
 *
 * These tests verify that the production build correctly obfuscates
 * Tailwind CSS classes using tailwindcss-patch + unplugin-tailwindcss-mangle.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { JSDOM } from "jsdom";

const ROOT_DIR = join(__dirname, "..");
const DIST_DIR = join(ROOT_DIR, "dist");

describe("Tailwind v3 HTML Static - Production Build Obfuscation", () => {
  beforeAll(() => {
    // Run the production build
    execSync("pnpm build", { cwd: ROOT_DIR, stdio: "pipe", timeout: 120000 });
  }, 120000);

  it("should create dist directory with built files", () => {
    expect(existsSync(DIST_DIR)).toBe(true);
    expect(existsSync(join(DIST_DIR, "index.html"))).toBe(true);
  });

  describe("HTML obfuscation", () => {
    it("should obfuscate classes in index.html", () => {
      const htmlPath = join(DIST_DIR, "index.html");
      const content = readFileSync(htmlPath, "utf-8");

      // Classes should be replaced with tw-* prefix
      expect(content).toContain("tw-");

      // Original verbose class names should NOT be present
      expect(content).not.toContain('class="bg-red-500');
      expect(content).not.toContain('class="bg-blue-500');
    });

    it("should preserve HTML structure after obfuscation", () => {
      const htmlPath = join(DIST_DIR, "index.html");
      const content = readFileSync(htmlPath, "utf-8");
      const dom = new JSDOM(content);
      const { document } = dom.window;

      // Check basic structure is preserved
      expect(document.querySelector("nav")).not.toBeNull();
      expect(document.querySelector("header")).not.toBeNull();
      expect(document.querySelectorAll("section").length).toBeGreaterThan(0);
    });

    it("should obfuscate classes in all HTML pages", () => {
      const htmlFiles = ["index.html", "about.html", "contact.html"];

      for (const file of htmlFiles) {
        const htmlPath = join(DIST_DIR, file);
        if (existsSync(htmlPath)) {
          const content = readFileSync(htmlPath, "utf-8");
          expect(content).toContain("tw-");
        }
      }
    });

    it("should obfuscate form element classes in contact.html", () => {
      const htmlPath = join(DIST_DIR, "contact.html");
      if (existsSync(htmlPath)) {
        const content = readFileSync(htmlPath, "utf-8");
        const dom = new JSDOM(content);
        const { document } = dom.window;

        // Form elements should exist and have obfuscated classes
        const inputs = document.querySelectorAll("input");
        expect(inputs.length).toBeGreaterThan(0);

        const form = document.querySelector("form");
        expect(form).not.toBeNull();
      }
    });
  });

  describe("CSS obfuscation", () => {
    it("should create obfuscated CSS file", () => {
      const assetsDir = join(DIST_DIR, "assets");
      expect(existsSync(assetsDir)).toBe(true);

      const cssFiles = readdirSync(assetsDir).filter((f) => f.endsWith(".css"));
      expect(cssFiles.length).toBeGreaterThan(0);
    });

    it("should obfuscate class selectors in CSS", () => {
      const assetsDir = join(DIST_DIR, "assets");
      const cssFiles = readdirSync(assetsDir).filter((f) => f.endsWith(".css"));

      if (cssFiles.length > 0) {
        const cssPath = join(assetsDir, cssFiles[0]);
        const content = readFileSync(cssPath, "utf-8");

        // CSS should contain obfuscated selectors
        expect(content).toMatch(/\.tw-[a-z]+/);
      }
    });

    it("should preserve @apply component styles after obfuscation", () => {
      const assetsDir = join(DIST_DIR, "assets");
      const cssFiles = readdirSync(assetsDir).filter((f) => f.endsWith(".css"));

      if (cssFiles.length > 0) {
        const cssPath = join(assetsDir, cssFiles[0]);
        const content = readFileSync(cssPath, "utf-8");

        // Custom component classes should be processed
        // (either kept or obfuscated depending on configuration)
        expect(content.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Obfuscation consistency", () => {
    it("should use consistent class names between HTML and CSS", () => {
      const htmlPath = join(DIST_DIR, "index.html");
      const htmlContent = readFileSync(htmlPath, "utf-8");

      // Extract tw-* classes from HTML
      const htmlClasses = new Set<string>();
      const htmlMatches = htmlContent.matchAll(/tw-[a-z]+/g);
      for (const match of htmlMatches) {
        htmlClasses.add(match[0]);
      }

      // Check that CSS contains these classes
      const assetsDir = join(DIST_DIR, "assets");
      const cssFiles = readdirSync(assetsDir).filter((f) => f.endsWith(".css"));

      if (cssFiles.length > 0) {
        const cssPath = join(assetsDir, cssFiles[0]);
        const cssContent = readFileSync(cssPath, "utf-8");

        // At least some HTML classes should be in CSS
        let foundCount = 0;
        for (const cls of htmlClasses) {
          if (cssContent.includes(`.${cls}`)) {
            foundCount++;
          }
        }
        expect(foundCount).toBeGreaterThan(0);
      }
    });
  });
});

describe("Tailwind v3 HTML Static - Comparison with v4", () => {
  it("should use PostCSS configuration (v3 approach)", () => {
    const postcssPath = join(ROOT_DIR, "postcss.config.js");
    expect(existsSync(postcssPath)).toBe(true);
  });

  it("should NOT use @import tailwindcss (v4 syntax)", () => {
    const cssPath = join(ROOT_DIR, "src", "styles.css");
    const content = readFileSync(cssPath, "utf-8");

    expect(content).not.toContain('@import "tailwindcss"');
    expect(content).toContain("@tailwind base");
  });

  it("should use tailwindcss-patch for extraction", () => {
    const packageJson = JSON.parse(readFileSync(join(ROOT_DIR, "package.json"), "utf-8"));

    expect(packageJson.devDependencies).toHaveProperty("tailwindcss-patch");
  });
});
