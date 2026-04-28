#!/usr/bin/env tsx
/**
 * Post-build Tailwind CSS Class Obfuscation Script
 *
 * This script runs after `next build` to obfuscate Tailwind CSS class names
 * in the production build. It's a Tailwind v4 compatible alternative to
 * unplugin-tailwindcss-mangle which doesn't work with Tailwind v4.
 *
 * How it works:
 * 1. Reads the extracted class list from .tw-obfuscation/class-list.json
 * 2. Generates a mapping of original class names to obfuscated names
 * 3. Replaces all occurrences in .next/static CSS and JS files
 */

import * as fs from "fs";
import * as path from "path";

// Configuration
const CLASS_PREFIX = "tw-";
const STATIC_DIR = ".next/static";
const SERVER_DIR = ".next/server";
const CLASS_LIST_PATH = ".tw-obfuscation/class-list.json";
const MAPPING_OUTPUT_PATH = ".tw-obfuscation/class-mapping.json";

// Characters for generating short class names
const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Generate a short obfuscated class name from an index
 */
function generateClassName(index: number): string {
  let name = "";
  let num = index;

  do {
    name = CHARS[num % CHARS.length] + name;
    num = Math.floor(num / CHARS.length) - 1;
  } while (num >= 0);

  return CLASS_PREFIX + name;
}

/**
 * Check if a class should be obfuscated
 */
function shouldObfuscate(className: string): boolean {
  // Skip empty or whitespace-only
  if (!className.trim()) return false;

  // Skip classes that might be dynamically used
  if (/^(js-|no-|is-|has-)/.test(className)) return false;

  // Skip CSS variables and special syntax
  if (className.startsWith("--")) return false;

  // Skip single-character classes (too short to benefit from obfuscation)
  if (className.length <= 2) return false;

  return true;
}

/**
 * Create a regex pattern that matches a class name in various contexts
 */
function createClassPattern(className: string): RegExp {
  // Escape special regex characters
  const escaped = className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Match the class name in various contexts:
  // - In class="" or className=""
  // - In CSS selectors (.classname)
  // - As a standalone word in JS strings
  return new RegExp(
    // CSS selector context: .classname followed by non-word char
    `(\\.)(${escaped})(?=[^a-zA-Z0-9_-]|$)` +
      "|" +
      // HTML/JSX class attribute context: space or " followed by classname
      `(["'\\s])(${escaped})(?=["'\\s]|$)`,
    "g"
  );
}

/**
 * Replace classes in file content
 */
function replaceClasses(
  content: string,
  mapping: Map<string, string>
): { newContent: string; replacements: number } {
  let newContent = content;
  let replacements = 0;

  // Sort by length (longest first) to avoid partial replacements
  const sortedClasses = Array.from(mapping.entries()).sort((a, b) => b[0].length - a[0].length);

  for (const [original, obfuscated] of sortedClasses) {
    const pattern = createClassPattern(original);
    const before = newContent;

    newContent = newContent.replace(pattern, (match, p1, p2, p3, _p4) => {
      if (p1 === ".") {
        // CSS selector context
        return p1 + obfuscated;
      } else if (p3) {
        // HTML/JSX class context
        return p3 + obfuscated;
      }
      return match;
    });

    if (newContent !== before) {
      replacements++;
    }
  }

  return { newContent, replacements };
}

/**
 * Process all files in a directory recursively
 */
function processDirectory(
  dir: string,
  mapping: Map<string, string>,
  extensions: string[]
): { filesProcessed: number; totalReplacements: number } {
  let filesProcessed = 0;
  let totalReplacements = 0;

  function processDir(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        processDir(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (extensions.includes(ext)) {
          const content = fs.readFileSync(fullPath, "utf-8");
          const { newContent, replacements } = replaceClasses(content, mapping);

          if (replacements > 0) {
            fs.writeFileSync(fullPath, newContent);
            filesProcessed++;
            totalReplacements += replacements;
            console.log(`  📄 ${path.relative(dir, fullPath)}: ${replacements} classes`);
          }
        }
      }
    }
  }

  processDir(dir);
  return { filesProcessed, totalReplacements };
}

/**
 * Main function
 */
async function main() {
  console.log("\n🔒 Tailwind CSS Class Obfuscation");
  console.log("=".repeat(60) + "\n");

  // Check if build directory exists
  if (!fs.existsSync(STATIC_DIR)) {
    console.error("❌ Build directory not found. Run 'next build' first.");
    process.exit(1);
  }

  // Read class list
  if (!fs.existsSync(CLASS_LIST_PATH)) {
    console.error("❌ Class list not found. Run 'extract-classes' first.");
    process.exit(1);
  }

  const classList: string[] = JSON.parse(fs.readFileSync(CLASS_LIST_PATH, "utf-8"));
  console.log(`📋 Loaded ${classList.length} classes from ${CLASS_LIST_PATH}\n`);

  // Generate mapping
  const mapping = new Map<string, string>();
  let index = 0;

  for (const className of classList) {
    if (shouldObfuscate(className)) {
      mapping.set(className, generateClassName(index));
      index++;
    }
  }

  console.log(`🔄 Generated mapping for ${mapping.size} classes\n`);

  // Save mapping for debugging/verification
  const mappingObj = Object.fromEntries(mapping);
  fs.writeFileSync(MAPPING_OUTPUT_PATH, JSON.stringify(mappingObj, null, 2));
  console.log(`💾 Saved mapping to ${MAPPING_OUTPUT_PATH}\n`);

  // Process CSS files in static directory
  console.log("📝 Processing static CSS files:");
  const cssDir = path.join(STATIC_DIR, "css");
  if (fs.existsSync(cssDir)) {
    const cssResult = processDirectory(cssDir, mapping, [".css"]);
    console.log(
      `   ✅ ${cssResult.filesProcessed} CSS files, ${cssResult.totalReplacements} replacements\n`
    );
  }

  // Process JS chunks in static directory
  console.log("📝 Processing static JS chunks:");
  const chunksDir = path.join(STATIC_DIR, "chunks");
  if (fs.existsSync(chunksDir)) {
    const jsResult = processDirectory(chunksDir, mapping, [".js"]);
    console.log(
      `   ✅ ${jsResult.filesProcessed} JS files, ${jsResult.totalReplacements} replacements\n`
    );
  }

  // Also check for files in the static/media folder
  const mediaDir = path.join(STATIC_DIR, "media");
  if (fs.existsSync(mediaDir)) {
    console.log("📝 Processing media files:");
    processDirectory(mediaDir, mapping, [".js", ".css"]);
  }

  // Process pre-rendered HTML pages in server directory
  console.log("📝 Processing server-rendered HTML pages:");
  const serverAppDir = path.join(SERVER_DIR, "app");
  if (fs.existsSync(serverAppDir)) {
    const htmlResult = processDirectory(serverAppDir, mapping, [".html", ".rsc"]);
    console.log(
      `   ✅ ${htmlResult.filesProcessed} files, ${htmlResult.totalReplacements} replacements\n`
    );
  }

  // Process server-side JS files
  console.log("📝 Processing server JS files:");
  if (fs.existsSync(serverAppDir)) {
    const serverJsResult = processDirectory(serverAppDir, mapping, [".js"]);
    console.log(
      `   ✅ ${serverJsResult.filesProcessed} JS files, ${serverJsResult.totalReplacements} replacements\n`
    );
  }

  console.log("=".repeat(60));
  console.log("✅ Obfuscation complete!\n");

  // Show sample mappings
  console.log("📊 Sample mappings:");
  const samples = Array.from(mapping.entries()).slice(0, 10);
  for (const [original, obfuscated] of samples) {
    console.log(`   ${original} → ${obfuscated}`);
  }
  console.log("   ...\n");
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
