/**
 * Single source of truth for CSS class-name escaping/unescaping.
 *
 * Tailwind class names contain characters with meaning in CSS selectors
 * (`:`, `[`, `]`, `/`, `(`, `)`, ...). They must be backslash-escaped before
 * being emitted as a selector.
 */

const SPECIAL_CHARS = /([!@#$%^&*()+=[\]{}|\\;:'",.<>/?`~])/g;

/**
 * Escape a class name so it can be safely written as a CSS selector
 * (i.e. `.hover\:bg-red-500`).
 */
export function escapeCssClassName(className: string): string {
  return className.replace(SPECIAL_CHARS, "\\$1");
}

/**
 * Reverse of {@link escapeCssClassName}: drop a single backslash before any
 * escaped character. Pairs with how Tailwind emits selectors.
 */
export function unescapeCssClassName(className: string): string {
  return className.replace(/\\(.)/g, "$1");
}
