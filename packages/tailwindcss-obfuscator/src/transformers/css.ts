/**
 * CSS class transformer
 *
 * Transforms CSS files by replacing class selectors with obfuscated names.
 * Uses magic-string for source map generation.
 */

import MagicString from "magic-string";
import type { TransformResult } from "../core/types.js";
import { escapeCssClassName, unescapeCssClassName } from "../core/css-escape.js";

/**
 * Pattern to match CSS class selectors
 * Handles escaped characters for Tailwind variants (e.g., .hover\:bg-red-500)
 */
const CSS_SELECTOR_PATTERN = /\.((?:(?:\\[^\s{},+>~])|[-_a-zA-Z0-9])+)(?=[^}]*\{)/g;

/**
 * @deprecated use `escapeCssClassName` from `core/css-escape.js`
 */
export const escapeForCss = escapeCssClassName;

/**
 * @deprecated use `unescapeCssClassName` from `core/css-escape.js`
 */
export const unescapeFromCss = unescapeCssClassName;

/**
 * Transform CSS content by replacing class selectors
 */
export function transformCss(
  content: string,
  filePath: string,
  mapping: Map<string, string>,
  options: {
    sourcemap?: boolean;
  } = {}
): TransformResult {
  const s = new MagicString(content);
  const replacements: string[] = [];
  let replacementCount = 0;

  // Find and replace class selectors
  let match;
  while ((match = CSS_SELECTOR_PATTERN.exec(content)) !== null) {
    const rawClassName = match[1];
    const className = unescapeCssClassName(rawClassName);

    // Check if we have a mapping for this class
    const obfuscated = mapping.get(className);
    if (obfuscated) {
      // Calculate positions
      const start = match.index + 1; // +1 to skip the dot
      const end = start + rawClassName.length;

      // Escape the obfuscated name for CSS
      const escapedObfuscated = escapeCssClassName(obfuscated);

      // Replace the class name
      s.overwrite(start, end, escapedObfuscated);
      replacements.push(className);
      replacementCount++;
    }
  }
  CSS_SELECTOR_PATTERN.lastIndex = 0;

  const result: TransformResult = {
    original: content,
    transformed: s.toString(),
    replacements: replacementCount,
    replacedClasses: [...new Set(replacements)],
  };

  if (options.sourcemap !== false) {
    result.map = s
      .generateMap({
        source: filePath,
        file: filePath + ".map",
        includeContent: true,
      })
      .toString();
  }

  return result;
}

/**
 * Transform CSS with support for Tailwind v4 @theme and @layer blocks
 */
export function transformTailwindV4Css(
  content: string,
  filePath: string,
  mapping: Map<string, string>,
  options: {
    sourcemap?: boolean;
  } = {}
): TransformResult {
  const s = new MagicString(content);
  const replacements: string[] = [];
  let replacementCount = 0;

  // More comprehensive pattern for Tailwind v4 CSS
  // Matches class selectors in various contexts
  const selectorPattern = /\.((?:(?:\\[^\s{},+>~:[\]])|[-_a-zA-Z0-9])+)(?=\s*[,{:[]|$)/gm;

  let match;
  while ((match = selectorPattern.exec(content)) !== null) {
    const rawClassName = match[1];
    const className = unescapeCssClassName(rawClassName);

    // Skip CSS variables and special selectors
    if (className.startsWith("--")) continue;

    const obfuscated = mapping.get(className);
    if (obfuscated) {
      const start = match.index + 1;
      const end = start + rawClassName.length;

      const escapedObfuscated = escapeCssClassName(obfuscated);
      s.overwrite(start, end, escapedObfuscated);
      replacements.push(className);
      replacementCount++;
    }
  }
  selectorPattern.lastIndex = 0;

  const result: TransformResult = {
    original: content,
    transformed: s.toString(),
    replacements: replacementCount,
    replacedClasses: [...new Set(replacements)],
  };

  if (options.sourcemap !== false) {
    result.map = s
      .generateMap({
        source: filePath,
        file: filePath + ".map",
        includeContent: true,
      })
      .toString();
  }

  return result;
}

/**
 * Check if content is CSS (not JS with CSS-in-JS)
 */
export function isCssContent(content: string): boolean {
  // CSS files typically have rule sets with { }
  // and don't have JS-specific patterns
  const hasRuleSets = /\{[^}]*\}/.test(content);
  const hasJsPatterns = /\b(const|let|var|function|import|export|=>)\b/.test(content);

  return hasRuleSets && !hasJsPatterns;
}

/**
 * Transform inline styles in CSS (if needed)
 */
export function transformInlineStyles(
  content: string,
  _filePath: string,
  _mapping: Map<string, string>
): TransformResult {
  // Inline styles don't use class selectors, so no transformation needed
  return {
    original: content,
    transformed: content,
    replacements: 0,
    replacedClasses: [],
  };
}
