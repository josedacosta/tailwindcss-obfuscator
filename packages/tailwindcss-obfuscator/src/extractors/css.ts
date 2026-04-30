/**
 * CSS class extractor
 *
 * Extracts class names from CSS selectors in:
 * - Standard CSS files
 * - Tailwind v3 generated CSS
 * - Tailwind v4 generated CSS
 *
 * Supports:
 * - Standard class selectors: .classname
 * - Escaped selectors: .hover\:bg-red-500
 * - Arbitrary values: .bg-\[#1da1f2\], .p-\[13px\]
 * - Container queries: .\@container, .\@lg\:text-xl
 * - Data attributes: .data-\[state=open\]\:bg-green-500
 * - ARIA variants: .aria-pressed\:bg-blue-500
 * - Complex selectors with combinators
 */

import { deduplicateClasses, isTailwindClass } from "./base.js";

/**
 * Pattern to match class selectors in CSS
 * Matches: .classname, .class-name, .class_name
 * Updated to handle arbitrary values in brackets
 */
const CSS_CLASS_PATTERN = /\.(-?[_a-zA-Z][_a-zA-Z0-9-]*)/g;

/**
 * Pattern to match escaped characters in class names (for Tailwind's responsive/state prefixes)
 * e.g., .sm\:grid, .hover\:bg-red-500, .\!important, .bg-\[#1da1f2\]
 * Updated to handle arbitrary values, container queries, and complex escaping
 */
const ESCAPED_CLASS_PATTERN = /\.((?:(?:\\[^\s])|[-_a-zA-Z0-9@/])+)/g;

/**
 * Pattern to match Tailwind classes with arbitrary values in CSS
 * e.g., .bg-\[\#1da1f2\], .p-\[13px\], .w-\[calc\(100\%-2rem\)\]
 */
const _ARBITRARY_VALUE_CSS_PATTERN = /\.([\w-]+(?:-\\\[[^\]\\]+\\\])?)/g;

/**
 * Extract classes from CSS content
 */
export function extractFromCss(content: string, _filePath: string): string[] {
  const classes: string[] = [];
  const seen = new Set<string>();

  // Match standard class selectors
  let match;
  while ((match = CSS_CLASS_PATTERN.exec(content)) !== null) {
    const className = match[1];
    if (!seen.has(className)) {
      seen.add(className);
      classes.push(className);
    }
  }
  CSS_CLASS_PATTERN.lastIndex = 0;

  // Match escaped class selectors (Tailwind prefixes and arbitrary values)
  while ((match = ESCAPED_CLASS_PATTERN.exec(content)) !== null) {
    // Unescape the class name
    const rawClassName = match[1];
    const className = unescapeCssClassName(rawClassName);

    if (!seen.has(className)) {
      seen.add(className);
      classes.push(className);
    }
  }
  ESCAPED_CLASS_PATTERN.lastIndex = 0;

  return deduplicateClasses(classes);
}

/**
 * Unescape CSS class name
 * Handles: \: -> :, \[ -> [, \] -> ], \@ -> @, \/ -> /, etc.
 */
function unescapeCssClassName(escaped: string): string {
  return escaped.replace(/\\(.)/g, "$1");
}

/**
 * Escape a class name for use in CSS selectors
 * Handles: : -> \:, [ -> \[, ] -> \], @ -> \@, / -> \/, etc.
 */
export function escapeCssClassName(className: string): string {
  // Characters that need escaping in CSS selectors
  return className.replace(/([:[\]@/!#%&()=+*,.])/g, "\\$1");
}

/**
 * Extract classes from Tailwind v4 CSS (which may use CSS layers and @theme)
 */
export function extractFromTailwindV4Css(content: string, _filePath: string): string[] {
  const classes: string[] = [];
  const seen = new Set<string>();

  // Remove @theme blocks and other directives
  // Strip Tailwind v4 directives we don't extract from. Each directive
  // body is non-nested (no inner `{` `}` inside @theme / @keyframes /
  // @property in valid Tailwind v4 CSS), so `[^}]*` is sufficient and
  // strictly safer than the previous `[\s\S]*?` lazy quantifier — that
  // shape was flagged by CodeQL `js/polynomial-redos` (CWE-1333) for
  // quadratic backtracking on input with many opening braces and one
  // closing one. The bounded char class avoids the ambiguity entirely.
  const cleanedContent = content
    .replace(/@theme\s*\{[^}]*\}/g, "")
    .replace(/@layer\s+[\w-]+\s*\{/g, "")
    .replace(/@keyframes[^}]*\}/g, "")
    .replace(/@property[^}]*\}/g, "")
    .replace(/@container[^{]*\{/g, "");

  // Extract class selectors
  let match;
  while ((match = ESCAPED_CLASS_PATTERN.exec(cleanedContent)) !== null) {
    const rawClassName = match[1];
    const className = unescapeCssClassName(rawClassName);

    // Skip CSS variables
    if (className.startsWith("--")) continue;

    // Skip Tailwind internal classes
    if (className.startsWith("*")) continue;

    if (!seen.has(className)) {
      seen.add(className);
      classes.push(className);
    }
  }
  ESCAPED_CLASS_PATTERN.lastIndex = 0;

  return deduplicateClasses(classes);
}

/**
 * Extract only Tailwind-like classes from CSS
 */
export function extractTailwindClassesFromCss(content: string, _filePath: string): string[] {
  const allClasses = extractFromCss(content, _filePath);
  return allClasses.filter((cls) => isTailwindClass(cls));
}

/**
 * Detect if CSS content is from Tailwind v4
 */
export function isTailwindV4Css(content: string): boolean {
  // Tailwind v4 uses @theme directive
  if (content.includes("@theme")) return true;

  // Tailwind v4 uses @import "tailwindcss"
  if (content.includes('@import "tailwindcss"')) return true;
  if (content.includes("@import 'tailwindcss'")) return true;

  // Tailwind v4 uses @tailwind without semicolons in some cases
  if (content.includes("@layer theme")) return true;

  // Tailwind v4 uses @property for CSS custom properties
  if (content.includes("@property --tw-")) return true;

  return false;
}

/**
 * Detect Tailwind version from CSS content
 */
export function detectTailwindVersion(content: string): "3" | "4" | null {
  if (isTailwindV4Css(content)) {
    return "4";
  }

  // Tailwind v3 indicators
  if (
    content.includes("@tailwind base") ||
    content.includes("@tailwind components") ||
    content.includes("@tailwind utilities")
  ) {
    return "3";
  }

  return null;
}

/**
 * Extract classes from @apply directives
 */
export function extractFromApplyDirectives(content: string, _filePath: string): string[] {
  const classes: string[] = [];
  const applyPattern = /@apply\s+([^;]+);/g;

  let match;
  while ((match = applyPattern.exec(content)) !== null) {
    const applyContent = match[1].trim();
    // Split by whitespace, handling arbitrary values
    const applyClasses = splitClassesFromApply(applyContent);
    classes.push(...applyClasses);
  }
  applyPattern.lastIndex = 0;

  return deduplicateClasses(classes.filter((cls) => isTailwindClass(cls)));
}

/**
 * Split classes from @apply content, handling arbitrary values with spaces
 */
function splitClassesFromApply(content: string): string[] {
  const classes: string[] = [];
  let current = "";
  let bracketDepth = 0;
  let parenDepth = 0;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];

    if (char === "[") {
      bracketDepth++;
      current += char;
    } else if (char === "]") {
      bracketDepth--;
      current += char;
    } else if (char === "(") {
      parenDepth++;
      current += char;
    } else if (char === ")") {
      parenDepth--;
      current += char;
    } else if (/\s/.test(char) && bracketDepth === 0 && parenDepth === 0) {
      if (current) {
        classes.push(current.trim());
        current = "";
      }
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    classes.push(current.trim());
  }

  return classes;
}

/**
 * Extract all classes from CSS content including @apply directives
 */
export function extractAllFromCss(content: string, filePath: string): string[] {
  const classes: string[] = [];

  // Check Tailwind version
  const version = detectTailwindVersion(content);

  if (version === "4") {
    classes.push(...extractFromTailwindV4Css(content, filePath));
  } else {
    classes.push(...extractFromCss(content, filePath));
  }

  // Also extract from @apply directives
  classes.push(...extractFromApplyDirectives(content, filePath));

  return deduplicateClasses(classes);
}

/**
 * Extract class names from complex CSS selectors
 * Handles: .flex.items-center, .flex > .items-center, .flex:hover
 */
export function extractFromComplexSelector(selector: string): string[] {
  const classes: string[] = [];
  const seen = new Set<string>();

  // Match all class selectors in the selector string
  let match;
  while ((match = ESCAPED_CLASS_PATTERN.exec(selector)) !== null) {
    const rawClassName = match[1];
    const className = unescapeCssClassName(rawClassName);

    if (!seen.has(className) && className.length > 0) {
      seen.add(className);
      classes.push(className);
    }
  }
  ESCAPED_CLASS_PATTERN.lastIndex = 0;

  return classes;
}

/**
 * Check if a CSS rule contains Tailwind classes
 */
export function containsTailwindClasses(selector: string): boolean {
  const classes = extractFromComplexSelector(selector);
  return classes.some((cls) => isTailwindClass(cls));
}
