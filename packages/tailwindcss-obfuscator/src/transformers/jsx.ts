/**
 * JSX/TSX class transformer (regex-based, legacy).
 *
 * @deprecated Prefer the AST-based transformer from `./jsx-ast.js`. The
 * regex strategy is retained as a fallback when the AST transformer cannot
 * parse the file (e.g. minified post-build JS that crashes the Babel parser),
 * and as the implementation behind `useAst: false`. New consumers should
 * leave `useAst: true` (the default) so transformations route through the
 * AST path.
 */

import MagicString from "magic-string";
import type { TransformResult } from "../core/types.js";

/**
 * Pattern to match className or class with string literal
 * Captures: prop name, quote, class values
 * Supports: className="...", class="..." (for Qwik, Svelte, Astro)
 */
const CLASSNAME_STRING_PATTERN = /\b(?:className|class)\s*=\s*(["'])([^"']*?)\1/g;

/**
 * Pattern to match className or class with template literal (no expressions)
 */
const CLASSNAME_SIMPLE_TEMPLATE_PATTERN = /\b(?:className|class)\s*=\s*\{?\s*`([^`$]*)`\s*\}?/g;

/**
 * Pattern to match Svelte class: directive
 * e.g., class:active={isActive}, class:bg-red-500={hasError}, class:flex
 */
const SVELTE_CLASS_DIRECTIVE_PATTERN = /\bclass:([\w-]+)(?=\s*=|\s*>|\s*\/|\s+|$)/g;

/**
 * Pattern to match class utility function calls with string arguments
 * Handles: cn("...", "..."), clsx("..."), classnames("...")
 */
const CLASS_UTIL_CALL_PATTERN = /\b(cn|clsx|classnames|classNames|twMerge)\s*\(\s*/g;

/**
 * Transform a space-separated class string
 */
function transformClassString(
  classValue: string,
  mapping: Map<string, string>
): { transformed: string; replacements: string[]; hasChanges: boolean } {
  const replacements: string[] = [];
  let hasChanges = false;

  const classes = classValue.split(/\s+/);
  const transformedClasses: string[] = [];

  for (const cls of classes) {
    if (!cls) continue;

    // Skip template expressions
    if (cls.includes("${")) {
      transformedClasses.push(cls);
      continue;
    }

    const obfuscated = mapping.get(cls);
    if (obfuscated) {
      transformedClasses.push(obfuscated);
      replacements.push(cls);
      hasChanges = true;
    } else {
      transformedClasses.push(cls);
    }
  }

  return {
    transformed: transformedClasses.join(" "),
    replacements,
    hasChanges,
  };
}

/**
 * Transform JSX content by replacing className values
 */
export function transformJsx(
  content: string,
  filePath: string,
  mapping: Map<string, string>,
  options: {
    sourcemap?: boolean;
  } = {}
): TransformResult {
  const s = new MagicString(content);
  const allReplacements: string[] = [];
  let replacementCount = 0;

  // Transform className="..." and className='...'
  let match;
  while ((match = CLASSNAME_STRING_PATTERN.exec(content)) !== null) {
    const quote = match[1];
    const classValue = match[2];
    const classStart = match.index + match[0].indexOf(quote) + 1;

    const { transformed, replacements, hasChanges } = transformClassString(classValue, mapping);

    if (hasChanges) {
      s.overwrite(classStart, classStart + classValue.length, transformed);
      allReplacements.push(...replacements);
      replacementCount++;
    }
  }
  CLASSNAME_STRING_PATTERN.lastIndex = 0;

  // Transform className={`...`} (simple template literals without expressions)
  while ((match = CLASSNAME_SIMPLE_TEMPLATE_PATTERN.exec(content)) !== null) {
    const classValue = match[1];
    // Find the actual backtick position
    const backtickIndex = content.indexOf("`", match.index);
    if (backtickIndex === -1) continue;
    const classStart = backtickIndex + 1;

    const { transformed, replacements, hasChanges } = transformClassString(classValue, mapping);

    if (hasChanges) {
      s.overwrite(classStart, classStart + classValue.length, transformed);
      allReplacements.push(...replacements);
      replacementCount++;
    }
  }
  CLASSNAME_SIMPLE_TEMPLATE_PATTERN.lastIndex = 0;

  // Transform string arguments in class utility function calls
  while ((match = CLASS_UTIL_CALL_PATTERN.exec(content)) !== null) {
    const fnCallStart = match.index + match[0].length;

    // Find string literals within this function call
    // We need to be careful to only transform strings, not variable names
    let depth = 1;
    let i = fnCallStart;
    let inString = false;
    let stringChar = "";
    let stringStart = -1;

    while (i < content.length && depth > 0) {
      const char = content[i];

      if (!inString) {
        if (char === "(") depth++;
        else if (char === ")") depth--;
        else if (char === '"' || char === "'" || char === "`") {
          inString = true;
          stringChar = char;
          stringStart = i + 1;
        }
      } else {
        if (char === stringChar && content[i - 1] !== "\\") {
          // End of string literal
          const stringContent = content.slice(stringStart, i);

          // Only transform if it looks like class names (no JS code)
          if (!stringContent.includes("${") || stringChar !== "`") {
            const { transformed, replacements, hasChanges } = transformClassString(
              stringContent,
              mapping
            );

            if (hasChanges) {
              s.overwrite(stringStart, i, transformed);
              allReplacements.push(...replacements);
              replacementCount++;
            }
          }

          inString = false;
          stringChar = "";
          stringStart = -1;
        }
      }

      i++;
    }
  }
  CLASS_UTIL_CALL_PATTERN.lastIndex = 0;

  // Transform Svelte class: directives
  while ((match = SVELTE_CLASS_DIRECTIVE_PATTERN.exec(content)) !== null) {
    const className = match[1];
    const obfuscated = mapping.get(className);

    if (obfuscated) {
      // Calculate position after "class:"
      const classStart = match.index + 6; // "class:".length
      s.overwrite(classStart, classStart + className.length, obfuscated);
      allReplacements.push(className);
      replacementCount++;
    }
  }
  SVELTE_CLASS_DIRECTIVE_PATTERN.lastIndex = 0;

  const result: TransformResult = {
    original: content,
    transformed: s.toString(),
    replacements: replacementCount,
    replacedClasses: [...new Set(allReplacements)],
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
 * Transform compiled JSX output (like Next.js build output)
 * This is trickier because the className prop becomes regular JS
 */
export function transformCompiledJsx(
  content: string,
  filePath: string,
  mapping: Map<string, string>,
  options: {
    sourcemap?: boolean;
  } = {}
): TransformResult {
  const s = new MagicString(content);
  const allReplacements: string[] = [];
  let replacementCount = 0;

  // Pattern for compiled className in JSX
  // React.createElement("div", { className: "..." })
  // or: { className: "..." }
  const compiledPattern = /\bclassName\s*:\s*(["'`])([^"'`]*?)\1/g;

  let match;
  while ((match = compiledPattern.exec(content)) !== null) {
    const quote = match[1];
    const classValue = match[2];

    // Calculate start position of the class value
    const quotePos = content.indexOf(quote, match.index + "className".length);
    if (quotePos === -1) continue;
    const classStart = quotePos + 1;

    const { transformed, replacements, hasChanges } = transformClassString(classValue, mapping);

    if (hasChanges) {
      s.overwrite(classStart, classStart + classValue.length, transformed);
      allReplacements.push(...replacements);
      replacementCount++;
    }
  }
  compiledPattern.lastIndex = 0;

  // Also match class attribute in template strings (for SSR HTML output)
  const classAttrPattern = /\bclass\s*=\s*\\?(["'`])([^"'`]*?)\\?\1/g;
  while ((match = classAttrPattern.exec(content)) !== null) {
    const quote = match[1];
    const classValue = match[2];

    // Skip if it looks like it's in an object key context
    const beforeMatch = content.slice(Math.max(0, match.index - 20), match.index);
    if (beforeMatch.includes("{") && !beforeMatch.includes(">")) {
      continue;
    }

    const quotePos = content.indexOf(quote, match.index + "class".length);
    if (quotePos === -1) continue;
    const classStart = quotePos + 1;

    const { transformed, replacements, hasChanges } = transformClassString(classValue, mapping);

    if (hasChanges) {
      s.overwrite(classStart, classStart + classValue.length, transformed);
      allReplacements.push(...replacements);
      replacementCount++;
    }
  }
  classAttrPattern.lastIndex = 0;

  const result: TransformResult = {
    original: content,
    transformed: s.toString(),
    replacements: replacementCount,
    replacedClasses: [...new Set(allReplacements)],
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
 * Check if file is source JSX or compiled output
 */
export function isCompiledOutput(content: string): boolean {
  // Compiled output typically has certain patterns
  return (
    content.includes("__webpack") ||
    content.includes("_jsx(") ||
    content.includes("React.createElement") ||
    content.includes("$RefreshReg$")
  );
}
