/**
 * Regex patterns for matching Tailwind classes in source files.
 *
 * Supports v3 and v4 syntax: variants, arbitrary values, CSS variables,
 * container queries, modifiers, important and negative prefixes.
 */

/**
 * Master pattern for capturing a candidate Tailwind class token in arbitrary text.
 * Captures: variants (sm:, hover:, @container:), negatives (-mb-4),
 * arbitrary values ([#fff]), CSS variables ((--var)), modifiers (/50), important (!).
 */
export const TAILWIND_CLASS_PATTERN =
  /(?:^|[\s"'`])(!?-?(?:@[\w/-]*)?(?:[\w-]+(?:\[[^\]]+\])?:)*(?:[\w-]+(?:\[[^\]]*\])?|\[[^\]]+\])(?:\/[\w.[\]()-]+)?!?)/g;

/**
 * Pattern matching `class="..."` / `className="..."` attributes.
 */
export const CLASS_ATTRIBUTE_PATTERN =
  /(?:class|className)\s*=\s*(?:\{[^}]*\}|"[^"]*"|'[^']*'|`[^`]*`)/g;

/**
 * Template literal pattern (backtick-delimited).
 */
export const TEMPLATE_LITERAL_PATTERN = /`[^`]*`/g;

/**
 * Class utility function calls: cn(), clsx(), classnames(), classNames(),
 * twMerge(), cva(), tv().
 */
export const CLASS_FUNCTION_PATTERN =
  /(?:cn|clsx|classnames|classNames|twMerge|cva|tv)\s*\(\s*([^)]+)\)/g;

/**
 * Arbitrary value pattern: `[anything]`.
 */
export const ARBITRARY_VALUE_PATTERN = /\[([^\]]+)\]/g;

/**
 * CSS variable shorthand pattern: `(--var)` or `(prop:--var)`.
 */
export const CSS_VARIABLE_SHORTHAND_PATTERN = /\((?:[\w-]+:)?--[\w-]+\)/g;

/**
 * Escape special regex characters so a string can be embedded into a regex literal.
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Build a regex that matches a class name exactly with whitespace/quote boundaries.
 */
export function createExactClassRegex(className: string): RegExp {
  const escaped = escapeRegex(className);
  return new RegExp(`(?<=^|[\\s"'\`])${escaped}(?=$|[\\s"'\`])`, "g");
}
