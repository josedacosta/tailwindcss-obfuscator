/**
 * HTML class extractor
 */

import { extractClassesFromString, deduplicateClasses, isTailwindClass } from "./base.js";

/**
 * Pattern to match `class` attribute in HTML.
 *
 * Captures three syntactic forms in order of preference:
 *   1. double-quoted   `class="foo bar"`   → group 1
 *   2. single-quoted   `class='foo bar'`   → group 2
 *   3. unquoted (HTML5 spec) `class=foo`   → group 3
 *
 * The HTML5 spec allows unquoted attribute values that contain no whitespace,
 * `>`, `=`, `<`, `"`, `'`, or backtick. Older / sloppy templates rely on this
 * (e.g. `class=text-center` in static HTML). Without group 3, the extractor
 * silently misses every such occurrence.
 */
const HTML_CLASS_PATTERN = /(?:^|[\s<])class\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi;

/**
 * Pattern to match `data-*` attribute, supporting the same three quoting forms.
 */
const HTML_DATA_PATTERN = /(?:^|[\s<])data-[\w-]+\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi;

/**
 * Extract classes from HTML content
 */
export function extractFromHtml(content: string, _filePath: string): string[] {
  const classes: string[] = [];

  // Match all class attributes
  let match;
  while ((match = HTML_CLASS_PATTERN.exec(content)) !== null) {
    const classValue = match[1] ?? match[2] ?? match[3] ?? "";
    if (!classValue) continue;
    const extracted = extractClassesFromString(classValue);
    classes.push(...extracted);
  }

  // Reset regex lastIndex
  HTML_CLASS_PATTERN.lastIndex = 0;

  // Filter to likely Tailwind classes and deduplicate
  return deduplicateClasses(classes.filter((cls) => isTailwindClass(cls)));
}

/**
 * Extract classes from HTML with more aggressive pattern matching.
 * Used for Tailwind v4 where classes might be in different formats.
 *
 * Same three-form quote handling as the standard extractor + opportunistic
 * scanning of `data-*` attributes (some libraries stash class lists in
 * `data-classes` etc.).
 */
export function extractFromHtmlAggressive(content: string, _filePath: string): string[] {
  const classes: string[] = [];

  // Standard class attribute (all three quote forms)
  let match;
  while ((match = HTML_CLASS_PATTERN.exec(content)) !== null) {
    const classValue = match[1] ?? match[2] ?? match[3] ?? "";
    if (!classValue) continue;
    const extracted = extractClassesFromString(classValue);
    classes.push(...extracted);
  }
  HTML_CLASS_PATTERN.lastIndex = 0;

  // data-* attributes that might contain classes (all three quote forms)
  while ((match = HTML_DATA_PATTERN.exec(content)) !== null) {
    const value = match[1] ?? match[2] ?? match[3] ?? "";
    if (!value) continue;
    // Only extract if it looks like classes
    if (value.includes(" ") || isTailwindClass(value)) {
      const extracted = extractClassesFromString(value);
      classes.push(...extracted.filter((cls) => isTailwindClass(cls)));
    }
  }
  HTML_DATA_PATTERN.lastIndex = 0;

  return deduplicateClasses(classes);
}
