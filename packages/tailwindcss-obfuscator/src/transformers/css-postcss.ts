/**
 * PostCSS-based CSS class transformer
 *
 * Uses PostCSS and postcss-selector-parser for more accurate
 * CSS selector transformation. This handles complex selectors,
 * pseudo-classes, and attribute selectors correctly.
 */

import postcss, { Root, AtRule, Rule } from "postcss";
import selectorParser from "postcss-selector-parser";
import type { TransformResult, ResolvedObfuscatorOptions } from "../core/types.js";
import { escapeCssClassName, unescapeCssClassName } from "../core/css-escape.js";

/**
 * Comment directive to ignore the next rule
 */
const IGNORE_DIRECTIVE = "tw-obfuscate-ignore";

/**
 * Check if the previous node is an ignore comment
 */
function hasIgnoreComment(node: Rule | AtRule): boolean {
  const prev = node.prev();
  if (!prev) return false;

  // Check if previous node is a comment containing the ignore directive
  if (prev.type === "comment" && "text" in prev) {
    return (prev as { text: string }).text.includes(IGNORE_DIRECTIVE);
  }

  return false;
}

/**
 * Check if selector contains Vue scoped data attribute
 */
function isVueScopedSelector(selector: string): boolean {
  return /\[data-v-[a-f0-9]+\]/.test(selector);
}

/**
 * Transform CSS content using PostCSS
 */
export function transformCssPostcss(
  content: string,
  filePath: string,
  mapping: Map<string, string>,
  options: {
    sourcemap?: boolean;
    ignoreVueScoped?: boolean;
    preserveClasses?: string[];
  } = {}
): TransformResult {
  const replacements: string[] = [];
  let replacementCount = 0;
  const preserveClasses = new Set(options.preserveClasses || []);
  const ignoreVueScoped = options.ignoreVueScoped ?? true;

  // Sort classes by length (descending) to avoid partial replacements
  const sortedMapping = new Map([...mapping.entries()].sort((a, b) => b[0].length - a[0].length));

  const selectorTransformer = selectorParser((selectors) => {
    selectors.walk((selector) => {
      if (selector.type === "class") {
        const originalClass = unescapeCssClassName(selector.value);

        // Skip preserved classes
        if (preserveClasses.has(originalClass)) {
          return;
        }

        const obfuscated = sortedMapping.get(originalClass);
        if (obfuscated) {
          selector.value = escapeCssClassName(obfuscated);
          replacements.push(originalClass);
          replacementCount++;
        }
      }
    });
  });

  let root: Root;
  try {
    root = postcss.parse(content, { from: filePath });
  } catch {
    // If parsing fails, return unchanged content
    return {
      original: content,
      transformed: content,
      replacements: 0,
      replacedClasses: [],
    };
  }

  // Process all rules
  root.walkRules((rule) => {
    // Check for ignore comment
    if (hasIgnoreComment(rule)) {
      return;
    }

    // Check for Vue scoped styles
    if (ignoreVueScoped && isVueScopedSelector(rule.selector)) {
      return;
    }

    try {
      rule.selector = selectorTransformer.processSync(rule.selector);
    } catch {
      // If selector parsing fails, skip this rule
    }
  });

  let transformed: string;
  let map: string | undefined;

  if (options.sourcemap !== false) {
    // PostCSS owns the rewrites; let it generate an accurate inline map that
    // reflects the actual selector edits, instead of a no-op MagicString map
    // over the original content.
    const out = root.toResult({
      map: { inline: false, annotation: false, sourcesContent: true },
      from: filePath,
      to: filePath,
    });
    transformed = out.css;
    map = out.map?.toString();
  } else {
    transformed = root.toString();
  }

  // Belt-and-suspenders: PostCSS occasionally drops rule blocks emitted by
  // meta-frameworks (notably some Next.js CSS chunks where `@layer base { *
  // {...} body {...} .container {...} }` has irregular indentation). The
  // tree-walk above never sees those `.container` rules so they survive
  // unobfuscated. Run a regex-based safety net over the serialized output
  // for any selector still in the mapping. Honours the same preserve and
  // Vue-scoped rules as the PostCSS pass.
  for (const [original, obfuscated] of sortedMapping) {
    if (preserveClasses.has(original)) continue;
    const safe = original.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const safeRe = new RegExp(`(\\.)(${safe})(?=[\\s,{:>~+\\[\\.])([^{}]*\\{)?`, "g");
    let mutated = false;
    transformed = transformed.replace(safeRe, (full, dot, name, _trailing) => {
      // Skip Vue scoped selectors if requested.
      if (ignoreVueScoped && full.includes("[data-v-")) return full;
      mutated = true;
      replacements.push(name);
      replacementCount++;
      return full.replace(`${dot}${name}`, `${dot}${escapeCssClassName(obfuscated)}`);
    });
    if (mutated && map) {
      // Map invalidated by post-hoc regex edits — drop it rather than emit
      // misleading positions. Source maps for fully PostCSS-handled files
      // remain accurate.
      map = undefined;
    }
  }

  const result: TransformResult = {
    original: content,
    transformed,
    replacements: replacementCount,
    replacedClasses: [...new Set(replacements)],
  };

  if (map !== undefined) {
    result.map = map;
  }

  return result;
}

/**
 * Transform CSS with support for Tailwind v4 features using PostCSS
 */
export function transformTailwindV4CssPostcss(
  content: string,
  filePath: string,
  mapping: Map<string, string>,
  options: {
    sourcemap?: boolean;
    ignoreVueScoped?: boolean;
    preserveClasses?: string[];
  } = {}
): TransformResult {
  // Same implementation as regular CSS transformer
  // Tailwind v4 CSS is valid CSS that PostCSS can parse
  return transformCssPostcss(content, filePath, mapping, options);
}

/**
 * Create a PostCSS transformer with resolved options
 */
export function createPostcssTransformer(resolvedOptions: ResolvedObfuscatorOptions) {
  return (content: string, filePath: string, mapping: Map<string, string>): TransformResult => {
    return transformCssPostcss(content, filePath, mapping, {
      sourcemap: resolvedOptions.sourcemap,
      ignoreVueScoped: resolvedOptions.ignoreVueScoped,
      preserveClasses: resolvedOptions.preserve.classes,
    });
  };
}

/**
 * Transform a CSS file in-place, handling @import and @layer
 */
export async function transformCssFile(
  content: string,
  filePath: string,
  mapping: Map<string, string>,
  options: {
    sourcemap?: boolean;
    ignoreVueScoped?: boolean;
    preserveClasses?: string[];
  } = {}
): Promise<TransformResult> {
  return transformCssPostcss(content, filePath, mapping, options);
}
