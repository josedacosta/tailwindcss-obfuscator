/**
 * HTML class extractor
 */

import { extractClassesFromString, deduplicateClasses, isTailwindClass } from "./base.js";

/**
 * Pattern to match class attribute in HTML
 */
const HTML_CLASS_PATTERN = /class\s*=\s*["']([^"']*)["']/gi;

/**
 * Extract classes from HTML content
 */
export function extractFromHtml(content: string, _filePath: string): string[] {
  const classes: string[] = [];

  // Match all class attributes
  let match;
  while ((match = HTML_CLASS_PATTERN.exec(content)) !== null) {
    const classValue = match[1];
    const extracted = extractClassesFromString(classValue);
    classes.push(...extracted);
  }

  // Reset regex lastIndex
  HTML_CLASS_PATTERN.lastIndex = 0;

  // Filter to likely Tailwind classes and deduplicate
  return deduplicateClasses(classes.filter((cls) => isTailwindClass(cls)));
}

/**
 * Extract classes from HTML with more aggressive pattern matching
 * Used for Tailwind v4 where classes might be in different formats
 */
export function extractFromHtmlAggressive(content: string, _filePath: string): string[] {
  const classes: string[] = [];

  // Standard class attribute
  const classPattern = /class\s*=\s*["']([^"']*)["']/gi;
  let match;

  while ((match = classPattern.exec(content)) !== null) {
    const classValue = match[1];
    const extracted = extractClassesFromString(classValue);
    classes.push(...extracted);
  }

  // Also check for data-* attributes that might contain classes
  const dataPattern = /data-[\w-]+\s*=\s*["']([^"']*)["']/gi;
  while ((match = dataPattern.exec(content)) !== null) {
    const value = match[1];
    // Only extract if it looks like classes
    if (value.includes(" ") || isTailwindClass(value)) {
      const extracted = extractClassesFromString(value);
      classes.push(...extracted.filter((cls) => isTailwindClass(cls)));
    }
  }

  return deduplicateClasses(classes);
}
