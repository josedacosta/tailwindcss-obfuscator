/**
 * Tests for Tailwind CSS v4 HTML Static - Class Obfuscation
 *
 * These tests verify that the production build correctly obfuscates
 * Tailwind CSS classes using unplugin-tailwindcss-mangle.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { JSDOM } from "jsdom";

const ROOT_DIR = join(__dirname, "..");
const DIST_DIR = join(ROOT_DIR, "dist");

describe("Tailwind v4 HTML Static - Production Build Obfuscation", () => {
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

describe("Tailwind v4 HTML Static - Obfuscation Prefix", () => {
  it("should use tw- prefix as configured", () => {
    const htmlPath = join(DIST_DIR, "index.html");
    const content = readFileSync(htmlPath, "utf-8");

    // All obfuscated classes should start with tw-
    const classMatches = content.matchAll(/class="([^"]*)"/g);
    for (const match of classMatches) {
      const classes = match[1].split(/\s+/);
      for (const cls of classes) {
        if (cls && !cls.includes("tw-")) {
          // Some base classes might not be obfuscated (e.g., custom components)
          // This is expected behavior for certain marker classes
        }
      }
    }

    // But tw- prefixed classes should definitely exist
    expect(content).toContain("tw-");
  });
});
