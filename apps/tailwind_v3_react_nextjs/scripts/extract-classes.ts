#!/usr/bin/env tsx
/**
 * Tailwind CSS Class Extraction Script for React/Next.js + shadcn/ui
 *
 * This script extracts all Tailwind CSS classes from source files including:
 * - JSX className attributes (all variations)
 * - cva() patterns from class-variance-authority
 * - cn(), clsx(), classnames() utility function calls
 * - Ternary and conditional class expressions
 * - CSS @apply directives
 * - Template literals with static content
 * - Object patterns in utility functions
 *
 * Compatible with:
 * - Tailwind CSS v3 and v4
 * - React/Next.js
 * - shadcn/ui components
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, dirname, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, "..");
const SRC_DIR = join(ROOT_DIR, "src");

// Output configuration
const OUTPUT_DIR = join(ROOT_DIR, ".tw-obfuscation");
const OUTPUT_FILE = join(OUTPUT_DIR, "class-list.json");
const OUTPUT_DETAILED = join(OUTPUT_DIR, "class-list-detailed.json");

interface ExtractedClass {
  class: string;
  source: string;
  pattern: string;
}

interface ExtractionStats {
  totalFiles: number;
  jsFiles: number;
  cssFiles: number;
  totalClasses: number;
  uniqueClasses: number;
  byPattern: Record<string, number>;
  byCategory: Record<string, number>;
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
    // Skip node_modules and hidden directories
    if (entry.startsWith(".") || entry === "node_modules") {
      continue;
    }

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
 * Extract classes from a string value, handling special characters
 */
function extractClassesFromString(value: string): string[] {
  // Remove newlines and normalize whitespace
  const normalized = value.replace(/\n/g, " ").replace(/\s+/g, " ").trim();

  // Split by whitespace and filter valid class names
  return normalized
    .split(/\s+/)
    .filter(Boolean)
    .filter((cls) => {
      // Valid Tailwind class patterns
      return (
        cls.length > 0 &&
        !cls.startsWith("${") && // Skip template interpolations
        !cls.includes("${") &&
        !/^[0-9]/.test(cls) && // Don't start with number (unless arbitrary)
        !/^(true|false|null|undefined)$/.test(cls) // Skip JS keywords
      );
    });
}

/**
 * Extract classes from JSX className attributes
 * Handles: className="..." className='...' className={`...`} className={"..."}
 */
function extractFromClassName(content: string, sourcePath: string): ExtractedClass[] {
  const results: ExtractedClass[] = [];

  // Pattern 1: className="..." (double quotes)
  const doubleQuoteRegex = /className\s*=\s*"([^"]*)"/gs;
  let match: RegExpExecArray | null;

  while ((match = doubleQuoteRegex.exec(content)) !== null) {
    const classes = extractClassesFromString(match[1]);
    classes.forEach((cls) =>
      results.push({ class: cls, source: sourcePath, pattern: 'className="..."' })
    );
  }

  // Pattern 2: className='...' (single quotes)
  const singleQuoteRegex = /className\s*=\s*'([^']*)'/gs;
  while ((match = singleQuoteRegex.exec(content)) !== null) {
    const classes = extractClassesFromString(match[1]);
    classes.forEach((cls) =>
      results.push({ class: cls, source: sourcePath, pattern: "className='...'" })
    );
  }

  // Pattern 3: className={`...`} (template literals - extract static parts)
  const templateLiteralRegex = /className\s*=\s*\{`([^`]*)`\}/gs;
  while ((match = templateLiteralRegex.exec(content)) !== null) {
    // Remove ${...} interpolations and extract remaining static parts
    const staticParts = match[1].replace(/\$\{[^}]*\}/g, " ");
    const classes = extractClassesFromString(staticParts);
    classes.forEach((cls) =>
      results.push({ class: cls, source: sourcePath, pattern: "className={`...`}" })
    );
  }

  // Pattern 4: className={"..."} (string in braces)
  const braceStringRegex = /className\s*=\s*\{\s*"([^"]*)"\s*\}/gs;
  while ((match = braceStringRegex.exec(content)) !== null) {
    const classes = extractClassesFromString(match[1]);
    classes.forEach((cls) =>
      results.push({
        class: cls,
        source: sourcePath,
        pattern: 'className={"..."}',
      })
    );
  }

  // Pattern 5: className={'...'} (single quotes in braces)
  const braceSingleQuoteRegex = /className\s*=\s*\{\s*'([^']*)'\s*\}/gs;
  while ((match = braceSingleQuoteRegex.exec(content)) !== null) {
    const classes = extractClassesFromString(match[1]);
    classes.forEach((cls) =>
      results.push({
        class: cls,
        source: sourcePath,
        pattern: "className={'...'}",
      })
    );
  }

  return results;
}

/**
 * Extract classes from ternary expressions in className
 * Handles: className={condition ? "class1" : "class2"}
 */
function extractFromTernary(content: string, sourcePath: string): ExtractedClass[] {
  const results: ExtractedClass[] = [];

  // Match ternary expressions with string literals
  // className={something ? "classes" : "other-classes"}
  const ternaryRegex =
    /className\s*=\s*\{[^}]*\?\s*["'`]([^"'`]*)["'`]\s*:\s*["'`]([^"'`]*)["'`]/gs;
  let match: RegExpExecArray | null;

  while ((match = ternaryRegex.exec(content)) !== null) {
    // Extract from both branches
    const trueClasses = extractClassesFromString(match[1]);
    const falseClasses = extractClassesFromString(match[2]);

    trueClasses.forEach((cls) =>
      results.push({
        class: cls,
        source: sourcePath,
        pattern: "ternary (true)",
      })
    );
    falseClasses.forEach((cls) =>
      results.push({
        class: cls,
        source: sourcePath,
        pattern: "ternary (false)",
      })
    );
  }

  // Also match ternary that's only on true side: condition && "classes"
  const andRegex = /className\s*=\s*\{[^}]*&&\s*["'`]([^"'`]*)["'`]/gs;
  while ((match = andRegex.exec(content)) !== null) {
    const classes = extractClassesFromString(match[1]);
    classes.forEach((cls) =>
      results.push({ class: cls, source: sourcePath, pattern: "&& expression" })
    );
  }

  return results;
}

/**
 * Extract classes from cva() calls (class-variance-authority)
 * Used extensively by shadcn/ui components
 */
function extractFromCva(content: string, sourcePath: string): ExtractedClass[] {
  const results: ExtractedClass[] = [];

  // Match cva() function calls with their full content
  // cva("base classes", { variants: { ... } })
  const cvaRegex = /cva\s*\(\s*["'`]([^"'`]*)["'`]/gs;
  let match: RegExpExecArray | null;

  while ((match = cvaRegex.exec(content)) !== null) {
    const classes = extractClassesFromString(match[1]);
    classes.forEach((cls) =>
      results.push({ class: cls, source: sourcePath, pattern: "cva() base" })
    );
  }

  // Extract from variant values inside cva
  // variant: "classes here"
  // Matches strings inside objects that follow variant keys
  const variantValueRegex =
    /(?:variant|size|default|primary|secondary|destructive|outline|ghost|link|sm|md|lg|xl|icon|filled|elevated)["']?\s*:\s*["'`]([^"'`]+)["'`]/gs;

  while ((match = variantValueRegex.exec(content)) !== null) {
    const classes = extractClassesFromString(match[1]);
    classes.forEach((cls) =>
      results.push({ class: cls, source: sourcePath, pattern: "cva() variant" })
    );
  }

  // More generic approach: find all string values that look like Tailwind classes
  // inside cva() blocks
  const cvaBlockRegex = /cva\s*\([^)]*\{[\s\S]*?\}\s*\)/gs;
  const cvaBlocks = content.match(cvaBlockRegex) || [];

  for (const block of cvaBlocks) {
    // Extract all quoted strings from the block
    const stringRegex = /["'`]([^"'`]+)["'`]/g;
    while ((match = stringRegex.exec(block)) !== null) {
      const value = match[1];
      // Only process if it looks like Tailwind classes
      if (
        value.includes("-") ||
        value.includes(":") ||
        value.includes("[") ||
        /^(flex|grid|block|inline|hidden|relative|absolute|fixed|sticky)/.test(value)
      ) {
        const classes = extractClassesFromString(value);
        classes.forEach((cls) =>
          results.push({ class: cls, source: sourcePath, pattern: "cva() block" })
        );
      }
    }
  }

  return results;
}

/**
 * Extract classes from cn(), clsx(), classnames(), twMerge() function calls
 */
function extractFromUtilityFunctions(content: string, sourcePath: string): ExtractedClass[] {
  const results: ExtractedClass[] = [];

  // Match cn(), clsx(), classnames(), twMerge() calls
  const utilityFunctions = ["cn", "clsx", "classnames", "twMerge", "classNames"];
  const functionPattern = utilityFunctions.join("|");

  // Pattern: cn("classes", "more classes", ...)
  const utilityCallRegex = new RegExp(`(?:${functionPattern})\\s*\\(([^)]+)\\)`, "gs");
  let match: RegExpExecArray | null;

  while ((match = utilityCallRegex.exec(content)) !== null) {
    const argsContent = match[1];

    // Extract string arguments
    const stringArgRegex = /["'`]([^"'`]+)["'`]/g;
    let stringMatch: RegExpExecArray | null;

    while ((stringMatch = stringArgRegex.exec(argsContent)) !== null) {
      const value = stringMatch[1];
      // Filter out non-class strings (like error messages, etc.)
      if (!value.includes("Error") && !value.includes("error") && value.length < 500) {
        const classes = extractClassesFromString(value);
        classes.forEach((cls) =>
          results.push({
            class: cls,
            source: sourcePath,
            pattern: "cn()/clsx()",
          })
        );
      }
    }

    // Extract object keys that look like classes
    // cn({ "bg-blue-500": condition })
    const objectKeyRegex = /["']([a-z][a-z0-9-:[\]/]+)["']\s*:/gi;
    while ((stringMatch = objectKeyRegex.exec(argsContent)) !== null) {
      const classes = extractClassesFromString(stringMatch[1]);
      classes.forEach((cls) =>
        results.push({
          class: cls,
          source: sourcePath,
          pattern: "cn() object key",
        })
      );
    }
  }

  return results;
}

/**
 * Extract classes from CSS @apply directives
 */
function extractFromCssApply(content: string, sourcePath: string): ExtractedClass[] {
  const results: ExtractedClass[] = [];

  // @apply followed by classes
  const applyRegex = /@apply\s+([^;]+);/gs;
  let match: RegExpExecArray | null;

  while ((match = applyRegex.exec(content)) !== null) {
    const classes = extractClassesFromString(match[1]);
    classes.forEach((cls) => results.push({ class: cls, source: sourcePath, pattern: "@apply" }));
  }

  return results;
}

/**
 * Extract classes from HTML class="" attributes (for any HTML in JSX)
 */
function extractFromHtmlClass(content: string, sourcePath: string): ExtractedClass[] {
  const results: ExtractedClass[] = [];

  // class="..." in HTML
  const htmlClassRegex = /\bclass\s*=\s*"([^"]*)"/gs;
  let match: RegExpExecArray | null;

  while ((match = htmlClassRegex.exec(content)) !== null) {
    const classes = extractClassesFromString(match[1]);
    classes.forEach((cls) =>
      results.push({ class: cls, source: sourcePath, pattern: 'class="..."' })
    );
  }

  // class='...' in HTML
  const htmlClassSingleRegex = /\bclass\s*=\s*'([^']*)'/gs;
  while ((match = htmlClassSingleRegex.exec(content)) !== null) {
    const classes = extractClassesFromString(match[1]);
    classes.forEach((cls) =>
      results.push({ class: cls, source: sourcePath, pattern: "class='...'" })
    );
  }

  return results;
}

/**
 * Extract classes from data-* and aria-* variant patterns
 * These are commonly used with Tailwind's data-[state=...]: and aria-*: variants
 */
function extractDataAriaPatterns(content: string, sourcePath: string): ExtractedClass[] {
  const results: ExtractedClass[] = [];

  // Look for data-[...]: and aria-*: patterns in strings
  const dataAriaRegex = /["'`]([^"'`]*(?:data-\[|aria-)[^"'`]*)["'`]/gs;
  let match: RegExpExecArray | null;

  while ((match = dataAriaRegex.exec(content)) !== null) {
    const classes = extractClassesFromString(match[1]);
    classes
      .filter((cls) => cls.includes("data-[") || cls.includes("aria-"))
      .forEach((cls) =>
        results.push({
          class: cls,
          source: sourcePath,
          pattern: "data/aria variant",
        })
      );
  }

  return results;
}

/**
 * Extract all classes from a single file
 */
function extractFromFile(filePath: string, isJsFile: boolean): ExtractedClass[] {
  const content = readFileSync(filePath, "utf-8");
  const relativePath = relative(ROOT_DIR, filePath);
  const results: ExtractedClass[] = [];

  if (isJsFile) {
    // JavaScript/TypeScript/JSX/TSX files
    results.push(...extractFromClassName(content, relativePath));
    results.push(...extractFromTernary(content, relativePath));
    results.push(...extractFromCva(content, relativePath));
    results.push(...extractFromUtilityFunctions(content, relativePath));
    results.push(...extractFromHtmlClass(content, relativePath));
    results.push(...extractDataAriaPatterns(content, relativePath));
  } else {
    // CSS files
    results.push(...extractFromCssApply(content, relativePath));
  }

  return results;
}

/**
 * Categorize a Tailwind class
 */
function categorizeClass(cls: string): string {
  if (cls.startsWith("@")) return "Container queries";
  if (cls.startsWith("dark:")) return "Dark mode";
  if (/^(sm|md|lg|xl|2xl):/.test(cls)) return "Responsive";
  if (/^(hover|focus|active|focus-visible|focus-within):/.test(cls))
    return "States (hover/focus/active)";
  if (/^(group|peer)/.test(cls)) return "Group/Peer";
  if (/^(first|last|odd|even|only):/.test(cls)) return "First/Last/Odd/Even";
  if (/^(before|after):/.test(cls)) return "Before/After";
  if (cls.includes("[") && cls.includes("]")) return "Arbitrary values";
  if (cls.startsWith("!")) return "Important (!)";
  if (cls.startsWith("-")) return "Negative values";
  if (/^data-\[/.test(cls)) return "Data attributes";
  if (/^aria-/.test(cls)) return "ARIA states";
  if (/^(motion-safe|motion-reduce):/.test(cls)) return "Motion preferences";
  if (/^(print):/.test(cls)) return "Print media";
  if (/^(portrait|landscape):/.test(cls)) return "Orientation";
  if (/^supports-/.test(cls)) return "Supports queries";
  if (/^has-/.test(cls)) return "Has selector";
  if (/^(bg|text|border|ring|outline|shadow|from|via|to)-/.test(cls)) return "Colors & Effects";
  if (/^(p|m|gap|space|w|h|min|max|inset|top|right|bottom|left)-/.test(cls))
    return "Spacing & Sizing";
  if (/^(flex|grid|justify|items|content|self|place|order)-/.test(cls)) return "Flexbox & Grid";
  if (/^(font|text|tracking|leading|truncate|line-clamp)/.test(cls)) return "Typography";
  if (/^(rounded|border|ring|outline|divide)/.test(cls)) return "Borders & Rings";
  if (/^(opacity|transition|duration|ease|delay|animate)/.test(cls))
    return "Transitions & Animation";
  if (/^(scale|rotate|translate|skew|origin|transform)/.test(cls)) return "Transforms";
  if (/^(filter|blur|brightness|contrast|grayscale|backdrop)/.test(cls)) return "Filters";
  if (/^(z|relative|absolute|fixed|sticky|static|inset|overflow|object)/.test(cls))
    return "Layout & Positioning";
  return "Other utilities";
}

/**
 * Main extraction function
 */
function extractAllClasses(): {
  classes: ExtractedClass[];
  stats: ExtractionStats;
} {
  const allClasses: ExtractedClass[] = [];

  // Find all source files
  const jsExtensions = [".tsx", ".ts", ".jsx", ".js"];
  const cssExtensions = [".css"];

  const jsFiles = findFiles(SRC_DIR, jsExtensions);
  const cssFiles = findFiles(SRC_DIR, cssExtensions);

  console.log(`\n📁 Found ${jsFiles.length} JS/TS files and ${cssFiles.length} CSS files\n`);

  // Process JS/TS files
  for (const filePath of jsFiles) {
    const classes = extractFromFile(filePath, true);
    if (classes.length > 0) {
      console.log(`  📄 ${relative(ROOT_DIR, filePath)}: ${classes.length} classes`);
    }
    allClasses.push(...classes);
  }

  // Process CSS files
  for (const filePath of cssFiles) {
    const classes = extractFromFile(filePath, false);
    if (classes.length > 0) {
      console.log(`  🎨 ${relative(ROOT_DIR, filePath)}: ${classes.length} classes`);
    }
    allClasses.push(...classes);
  }

  // Calculate statistics
  const uniqueClasses = new Set(allClasses.map((c) => c.class));
  const byPattern: Record<string, number> = {};
  const byCategory: Record<string, number> = {};

  for (const item of allClasses) {
    byPattern[item.pattern] = (byPattern[item.pattern] || 0) + 1;
  }

  for (const cls of uniqueClasses) {
    const category = categorizeClass(cls);
    byCategory[category] = (byCategory[category] || 0) + 1;
  }

  const stats: ExtractionStats = {
    totalFiles: jsFiles.length + cssFiles.length,
    jsFiles: jsFiles.length,
    cssFiles: cssFiles.length,
    totalClasses: allClasses.length,
    uniqueClasses: uniqueClasses.size,
    byPattern,
    byCategory,
  };

  return { classes: allClasses, stats };
}

/**
 * Write results to output files
 */
function writeResults(classes: ExtractedClass[], stats: ExtractionStats): string[] {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Get unique sorted classes
  const uniqueClasses = Array.from(new Set(classes.map((c) => c.class))).sort();

  // Write simple class list
  writeFileSync(OUTPUT_FILE, JSON.stringify(uniqueClasses, null, 2));
  console.log(`\n✅ Written ${uniqueClasses.length} unique classes to ${OUTPUT_FILE}`);

  // Write detailed output with sources
  const detailedOutput = {
    extractedAt: new Date().toISOString(),
    stats,
    classes: uniqueClasses,
    detailed: classes,
  };
  writeFileSync(OUTPUT_DETAILED, JSON.stringify(detailedOutput, null, 2));
  console.log(`📊 Written detailed report to ${OUTPUT_DETAILED}`);

  return uniqueClasses;
}

/**
 * Print summary
 */
function printSummary(stats: ExtractionStats): void {
  console.log("\n" + "=".repeat(60));
  console.log("📊 EXTRACTION SUMMARY");
  console.log("=".repeat(60));

  console.log(`\n📁 Files processed: ${stats.totalFiles}`);
  console.log(`   - JS/TS files: ${stats.jsFiles}`);
  console.log(`   - CSS files: ${stats.cssFiles}`);

  console.log(`\n🎯 Classes found: ${stats.totalClasses} total, ${stats.uniqueClasses} unique`);

  console.log("\n📌 By extraction pattern:");
  const sortedPatterns = Object.entries(stats.byPattern).sort(([, a], [, b]) => b - a);
  for (const [pattern, count] of sortedPatterns) {
    console.log(`   ${pattern}: ${count}`);
  }

  console.log("\n📂 By category:");
  const sortedCategories = Object.entries(stats.byCategory).sort(([, a], [, b]) => b - a);
  for (const [category, count] of sortedCategories) {
    console.log(`   ${category}: ${count}`);
  }

  console.log("\n" + "=".repeat(60));
}

// Main execution
console.log("🔍 Tailwind CSS Class Extraction for React/Next.js + shadcn/ui");
console.log("=".repeat(60));

const { classes, stats } = extractAllClasses();
writeResults(classes, stats);
printSummary(stats);
