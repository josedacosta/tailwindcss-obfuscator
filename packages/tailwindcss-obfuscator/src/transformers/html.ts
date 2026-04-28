/**
 * HTML class transformer
 *
 * Transforms HTML files by replacing class attribute values with obfuscated names.
 * Uses magic-string for source map generation.
 */

import MagicString from "magic-string";
import type { TransformResult } from "../core/types.js";

/**
 * Pattern to match class attribute in HTML
 * Captures: attribute name, quote character, class values
 */
const HTML_CLASS_ATTR_PATTERN = /\bclass\s*=\s*(["'])([^"']*)\1/gi;

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
    const quote = match[1];
    const classValue = match[2];
    const classStart = match.index + match[0].indexOf(quote) + 1;

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

  // Transform standard class attribute
  let match;
  while ((match = HTML_CLASS_ATTR_PATTERN.exec(content)) !== null) {
    const quote = match[1];
    const classValue = match[2];
    const classStart = match.index + match[0].indexOf(quote) + 1;

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
