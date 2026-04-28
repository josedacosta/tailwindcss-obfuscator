#!/usr/bin/env tsx
/**
 * Script to extract all CSS classes from source files
 * This ensures all classes are captured for obfuscation
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, "..");
const SRC_DIR = join(ROOT_DIR, "src");

// Output configuration
const OUTPUT_DIR = join(ROOT_DIR, ".tw-obfuscation");
const OUTPUT_FILE = join(OUTPUT_DIR, "class-list.json");

type ClassPredicate = (cls: string) => boolean;

interface CategoryMap {
  [key: string]: ClassPredicate;
}

/**
 * Recursively find all files with given extensions in a directory
 */
function findFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = [];

  if (!existsSync(dir)) {
    return files;
  }

  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findFiles(fullPath, extensions));
    } else if (extensions.includes(extname(entry).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Extract classes from HTML class attributes
 * Supports both double quotes and single quotes
 */
function extractClassesFromHtml(content: string): Set<string> {
  const classes = new Set<string>();

  // Match class="..." (double quotes)
  const doubleQuoteRegex = /class="([^"]*)"/g;
  let match: RegExpExecArray | null;

  while ((match = doubleQuoteRegex.exec(content)) !== null) {
    const classNames = match[1].split(/\s+/).filter(Boolean);
    classNames.forEach((cls) => classes.add(cls));
  }

  // Match class='...' (single quotes)
  const singleQuoteRegex = /class='([^']*)'/g;

  while ((match = singleQuoteRegex.exec(content)) !== null) {
    const classNames = match[1].split(/\s+/).filter(Boolean);
    classNames.forEach((cls) => classes.add(cls));
  }

  return classes;
}

/**
 * Extract classes from CSS @apply directives
 */
function extractClassesFromCss(content: string): Set<string> {
  const applyRegex = /@apply\s+([^;]+);/g;
  const classes = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = applyRegex.exec(content)) !== null) {
    const classNames = match[1].split(/\s+/).filter(Boolean);
    classNames.forEach((cls) => classes.add(cls));
  }

  return classes;
}

/**
 * Extract all classes from source files
 */
function extractAllClasses(): Set<string> {
  const allClasses = new Set<string>();

  // Find all HTML files in src/
  const htmlFiles = findFiles(SRC_DIR, [".html"]);
  console.log(`Found ${htmlFiles.length} HTML file(s) in src/`);

  for (const filePath of htmlFiles) {
    const content = readFileSync(filePath, "utf-8");
    const classes = extractClassesFromHtml(content);
    classes.forEach((cls) => allClasses.add(cls));
    console.log(`  - Extracted ${classes.size} classes from ${filePath}`);
  }

  // Find all CSS files in src/
  const cssFiles = findFiles(SRC_DIR, [".css"]);
  console.log(`Found ${cssFiles.length} CSS file(s) in src/`);

  for (const filePath of cssFiles) {
    const content = readFileSync(filePath, "utf-8");
    const classes = extractClassesFromCss(content);
    classes.forEach((cls) => allClasses.add(cls));
    console.log(`  - Extracted ${classes.size} classes from ${filePath}`);
  }

  return allClasses;
}

/**
 * Write extracted classes to JSON file
 */
function writeClassList(classes: Set<string>): string[] {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const sortedClasses = Array.from(classes).sort();
  writeFileSync(OUTPUT_FILE, JSON.stringify(sortedClasses, null, 2));
  console.log(`\nWritten ${sortedClasses.length} classes to ${OUTPUT_FILE}`);

  return sortedClasses;
}

/**
 * Print summary by category
 */
function printSummary(classes: string[]): void {
  console.log("\nClass categories:");

  const categories: CategoryMap = {
    "Basic colors (bg-*, text-*)": (cls) => /^(bg|text)-[a-z]/.test(cls),
    "Responsive (sm:, md:, lg:, etc)": (cls) => /^(sm|md|lg|xl|2xl):/.test(cls),
    "Dark mode (dark:)": (cls) => cls.startsWith("dark:"),
    "Hover/Focus states": (cls) => /^(hover|focus|active):/.test(cls),
    "Group/Peer variants": (cls) => /^(group|peer)/.test(cls),
    "Arbitrary values ([...])": (cls) => cls.includes("["),
    "Container queries (@)": (cls) => cls.startsWith("@"),
    "Before/After": (cls) => /^(before|after):/.test(cls),
    "First/Last/Odd/Even": (cls) => /^(first|last|odd|even):/.test(cls),
    "Custom components": (cls) => /^(btn|card|badge)/.test(cls),
  };

  for (const [name, predicate] of Object.entries(categories)) {
    const count = classes.filter(predicate).length;
    console.log(`  ${name}: ${count}`);
  }

  console.log(`\nTotal unique classes: ${classes.length}`);
}

// Main execution
console.log("Extracting CSS classes from source files...\n");
const classes = extractAllClasses();
const sortedClasses = writeClassList(classes);
printSummary(sortedClasses);
