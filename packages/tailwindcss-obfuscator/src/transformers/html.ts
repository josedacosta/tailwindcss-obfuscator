/**
 * HTML class transformer
 *
 * Transforms HTML files by replacing class attribute values with obfuscated names.
 * Uses magic-string for source map generation.
 */

import MagicString from "magic-string";
import type { TransformResult } from "../core/types.js";

/**
 * Pattern to match `class` attribute in HTML in any of the three syntactic
 * forms allowed by HTML5 :
 *   - double-quoted   `class="foo bar"`     → quote = `"`,  value via group 2
 *   - single-quoted   `class='foo bar'`     → quote = `'`,  value via group 2
 *   - unquoted        `class=foo`           → quote = `''`, value via group 3
 *
 * Group layout:
 *   1. The opening quote (`"` or `'`) when present, empty for unquoted.
 *   2. The attribute value when quoted (single class string).
 *   3. The attribute value when unquoted (single token, no whitespace).
 *
 * Without the unquoted branch, `class=foo` in static HTML silently goes
 * un-obfuscated even though the extractor finds the class.
 */
const HTML_CLASS_ATTR_PATTERN = /(?:^|[\s<])class\s*=\s*(?:(["'])([^"']*)\1|()([^\s"'=<>`]+))/gi;

/**
 * Transform HTML content by replacing class values
 */
export function transformHtml(
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

  let match;
  while ((match = HTML_CLASS_ATTR_PATTERN.exec(content)) !== null) {
    // Two branches: quoted (groups 1+2) or unquoted (groups 3+4).
    const isQuoted = match[1] !== undefined;
    const classValue = isQuoted ? match[2] : (match[4] ?? "");
    if (!classValue) continue;

    // For quoted values, the value starts AFTER the opening quote.
    // For unquoted values, the value starts at match[0].lastIndexOf(value).
    const classStart = isQuoted
      ? match.index + match[0].indexOf(match[1]!) + 1
      : match.index + match[0].lastIndexOf(classValue);

    // Split classes and transform each one
    const classes = classValue.split(/\s+/);
    const transformedClasses: string[] = [];
    let hasChanges = false;

    for (const cls of classes) {
      if (!cls) continue;

      const obfuscated = mapping.get(cls);
      if (obfuscated) {
        transformedClasses.push(obfuscated);
        replacements.push(cls);
        hasChanges = true;
      } else {
        transformedClasses.push(cls);
      }
    }

    if (hasChanges) {
      const newValue = transformedClasses.join(" ");
      s.overwrite(classStart, classStart + classValue.length, newValue);
      replacementCount++;
    }
  }
  HTML_CLASS_ATTR_PATTERN.lastIndex = 0;

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
 * Transform HTML with data-* attributes that might contain classes
 */
export function transformHtmlWithDataAttrs(
  content: string,
  filePath: string,
  mapping: Map<string, string>,
  options: {
    sourcemap?: boolean;
    dataAttributes?: string[];
  } = {}
): TransformResult {
  const s = new MagicString(content);
  const replacements: string[] = [];
  let replacementCount = 0;

  // Transform standard class attribute (all 3 quote forms — same logic as transformHtml).
  let match;
  while ((match = HTML_CLASS_ATTR_PATTERN.exec(content)) !== null) {
    const isQuoted = match[1] !== undefined;
    const classValue = isQuoted ? match[2] : (match[4] ?? "");
    if (!classValue) continue;
    const classStart = isQuoted
      ? match.index + match[0].indexOf(match[1]!) + 1
      : match.index + match[0].lastIndexOf(classValue);

    const classes = classValue.split(/\s+/);
    const transformedClasses: string[] = [];
    let hasChanges = false;

    for (const cls of classes) {
      if (!cls) continue;

      const obfuscated = mapping.get(cls);
      if (obfuscated) {
        transformedClasses.push(obfuscated);
        replacements.push(cls);
        hasChanges = true;
      } else {
        transformedClasses.push(cls);
      }
    }

    if (hasChanges) {
      const newValue = transformedClasses.join(" ");
      s.overwrite(classStart, classStart + classValue.length, newValue);
      replacementCount++;
    }
  }
  HTML_CLASS_ATTR_PATTERN.lastIndex = 0;

  // Transform specified data-* attributes
  const dataAttrs = options.dataAttributes || [];
  for (const attr of dataAttrs) {
    const pattern = new RegExp(`\\b${attr}\\s*=\\s*(["'])([^"']*?)\\1`, "gi");

    while ((match = pattern.exec(content)) !== null) {
      const quote = match[1];
      const value = match[2];
      const valueStart = match.index + match[0].indexOf(quote) + 1;

      const classes = value.split(/\s+/);
      const transformedClasses: string[] = [];
      let hasChanges = false;

      for (const cls of classes) {
        if (!cls) continue;

        const obfuscated = mapping.get(cls);
        if (obfuscated) {
          transformedClasses.push(obfuscated);
          replacements.push(cls);
          hasChanges = true;
        } else {
          transformedClasses.push(cls);
        }
      }

      if (hasChanges) {
        const newValue = transformedClasses.join(" ");
        s.overwrite(valueStart, valueStart + value.length, newValue);
        replacementCount++;
      }
    }
  }

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
