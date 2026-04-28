/**
 * Tailwind variant prefix registry and detection helpers.
 */

import { escapeRegex } from "./regex.js";

/**
 * All known Tailwind variant prefixes (v3 + v4).
 * Includes responsive, state, pseudo-element, container queries, etc.
 */
export const VARIANT_PREFIXES: readonly string[] = [
  // Responsive variants
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  // Min/Max breakpoints
  "min",
  "max",
  // Dark mode
  "dark",
  "light",
  // State variants
  "hover",
  "focus",
  "focus-within",
  "focus-visible",
  "active",
  "visited",
  "target",
  "first",
  "last",
  "only",
  "odd",
  "even",
  "first-of-type",
  "last-of-type",
  "only-of-type",
  "empty",
  "disabled",
  "enabled",
  "checked",
  "indeterminate",
  "default",
  "required",
  "optional",
  "valid",
  "invalid",
  "user-valid",
  "user-invalid",
  "in-range",
  "out-of-range",
  "placeholder-shown",
  "autofill",
  "read-only",
  "inert",
  // Group/Peer variants
  "group",
  "group-hover",
  "group-focus",
  "group-active",
  "group-visited",
  "group-focus-within",
  "group-focus-visible",
  "group-disabled",
  "group-first",
  "group-last",
  "group-odd",
  "group-even",
  "group-open",
  "peer",
  "peer-hover",
  "peer-focus",
  "peer-active",
  "peer-checked",
  "peer-invalid",
  "peer-disabled",
  "peer-placeholder-shown",
  "peer-focus-within",
  "peer-focus-visible",
  "peer-required",
  "peer-valid",
  "peer-first",
  "peer-last",
  "peer-odd",
  "peer-even",
  "peer-open",
  "has",
  "not",
  "in",
  "nth",
  "nth-last",
  "nth-of-type",
  "nth-last-of-type",
  // Pseudo-elements
  "before",
  "after",
  "first-letter",
  "first-line",
  "marker",
  "selection",
  "file",
  "backdrop",
  "placeholder",
  // Wildcard selectors (v4)
  "*",
  "**",
  // Print & media
  "print",
  "portrait",
  "landscape",
  "motion-safe",
  "motion-reduce",
  "contrast-more",
  "contrast-less",
  "forced-colors",
  "not-forced-colors",
  "inverted-colors",
  "pointer-fine",
  "pointer-coarse",
  "pointer-none",
  "any-pointer-fine",
  "any-pointer-coarse",
  "any-pointer-none",
  "noscript",
  "rtl",
  "ltr",
  "open",
  "starting",
  // Container queries (v4)
  "@container",
  "@3xs",
  "@2xs",
  "@xs",
  "@sm",
  "@md",
  "@lg",
  "@xl",
  "@2xl",
  "@3xl",
  "@4xl",
  "@5xl",
  "@6xl",
  "@7xl",
  "@min",
  "@max",
  // Max breakpoint shorthands
  "max-sm",
  "max-md",
  "max-lg",
  "max-xl",
  "max-2xl",
  // Generic prefixes used as namespaces
  "supports",
  "data",
  "aria",
];

/**
 * Patterns that recognize a variant token (e.g. `data-[state=open]`, `@[500px]`,
 * `nth-[2n+1]`, `[&_p]`). Used by variant detection helpers.
 */
const VARIANT_TOKEN_PATTERNS: RegExp[] = [
  ...VARIANT_PREFIXES.map((v) => new RegExp(`^${escapeRegex(v)}$`)),
  /^\*$/,
  /^\*\*$/,
  /^group-[\w-]+$/,
  /^peer-[\w-]+$/,
  /^has-[\w-]+$/,
  /^has-\[[^\]]+\]$/,
  /^group\/[\w-]+$/,
  /^peer\/[\w-]+$/,
  /^group-[\w-]+\/[\w-]+$/,
  /^peer-[\w-]+\/[\w-]+$/,
  /^data-[\w-]+$/,
  /^data-\[[^\]]+\]$/,
  /^group-data-[\w-]+$/,
  /^group-data-\[[^\]]+\]$/,
  /^peer-data-[\w-]+$/,
  /^peer-data-\[[^\]]+\]$/,
  /^aria-[\w-]+$/,
  /^aria-\[[^\]]+\]$/,
  /^group-aria-[\w-]+$/,
  /^group-aria-\[[^\]]+\]$/,
  /^peer-aria-[\w-]+$/,
  /^peer-aria-\[[^\]]+\]$/,
  /^supports-[\w-]+$/,
  /^supports-\[[^\]]+\]$/,
  /^supports-\(--[\w-]+\)$/,
  /^@[\w-]+$/,
  /^@\[[^\]]+\]$/,
  /^@[\w-]+\/[\w-]+$/,
  /^@\[[^\]]+\]\/[\w-]+$/,
  /^@min-[\w-]+$/,
  /^@max-[\w-]+$/,
  /^@min-\[[^\]]+\]$/,
  /^@max-\[[^\]]+\]$/,
  /^@min-[\w-]+\/[\w-]+$/,
  /^@max-[\w-]+\/[\w-]+$/,
  /^@min-\[[^\]]+\]\/[\w-]+$/,
  /^@max-\[[^\]]+\]\/[\w-]+$/,
  /^\[[^\]]+\]$/,
  /^min-[\w-]+$/,
  /^min-\[[^\]]+\]$/,
  /^max-[\w-]+$/,
  /^max-\[[^\]]+\]$/,
  /^not-[\w-]+$/,
  /^not-\[[^\]]+\]$/,
  /^in-[\w-]+$/,
  /^in-\[[^\]]+\]$/,
  /^nth-\d+$/,
  /^nth-\[[^\]]+\]$/,
  /^nth-last-\d+$/,
  /^nth-last-\[[^\]]+\]$/,
  /^nth-of-type-\d+$/,
  /^nth-of-type-\[[^\]]+\]$/,
  /^nth-last-of-type-\d+$/,
  /^nth-last-of-type-\[[^\]]+\]$/,
  /^starting$/,
  /^forced-colors$/,
  /^in-[\w-]+-\[[^\]]+\]$/,
  /^in-\[\[[^\]]+\]\]$/,
];

/**
 * Compact set of variant patterns used to recognize the *first* segment of a
 * `variant:utility` string (used by `isVariantSeparator`).
 */
const FIRST_SEGMENT_VARIANT_PATTERNS: RegExp[] = [
  /^(sm|md|lg|xl|2xl)$/,
  /^(hover|focus|active|disabled|visited|checked|indeterminate)$/,
  /^(focus-within|focus-visible|placeholder-shown|autofill|read-only)$/,
  /^(required|valid|invalid|in-range|out-of-range|default|enabled)$/,
  /^(first|last|odd|even|only|first-of-type|last-of-type|only-of-type|empty|target)$/,
  /^(dark|light)$/,
  /^group(-[\w-]+)?$/,
  /^peer(-[\w-]+)?$/,
  /^group\/[\w-]+$/,
  /^peer\/[\w-]+$/,
  /^group-[\w-]+\/[\w-]+$/,
  /^peer-[\w-]+\/[\w-]+$/,
  /^(before|after|placeholder|file|marker|selection|first-letter|first-line|backdrop)$/,
  /^(print|portrait|landscape)$/,
  /^(motion-safe|motion-reduce|contrast-more|contrast-less)$/,
  /^(rtl|ltr)$/,
  /^open$/,
  /^data-[\w-]+$/,
  /^data-\[[^\]]+\]$/,
  /^group-data-[\w-]+$/,
  /^group-data-\[[^\]]+\]$/,
  /^peer-data-[\w-]+$/,
  /^peer-data-\[[^\]]+\]$/,
  /^aria-[\w-]+$/,
  /^aria-\[[^\]]+\]$/,
  /^group-aria-[\w-]+$/,
  /^group-aria-\[[^\]]+\]$/,
  /^peer-aria-[\w-]+$/,
  /^peer-aria-\[[^\]]+\]$/,
  /^supports-[\w-]+$/,
  /^supports-\[[^\]]+\]$/,
  /^has-[\w-]+$/,
  /^has-\[[^\]]+\]$/,
  /^not-[\w-]+$/,
  /^not-\[[^\]]+\]$/,
  /^@[\w-]+$/,
  /^@\[[^\]]+\]$/,
  /^@[\w-]+\/[\w-]+$/,
  /^@\[[^\]]+\]\/[\w-]+$/,
  /^@min-[\w-]+$/,
  /^@max-[\w-]+$/,
  /^@min-\[[^\]]+\]$/,
  /^@max-\[[^\]]+\]$/,
  /^@min-[\w-]+\/[\w-]+$/,
  /^@max-[\w-]+\/[\w-]+$/,
  /^@min-\[[^\]]+\]\/[\w-]+$/,
  /^@max-\[[^\]]+\]\/[\w-]+$/,
  /^min-[\w-]+$/,
  /^min-\[[^\]]+\]$/,
  /^max-[\w-]+$/,
  /^max-\[[^\]]+\]$/,
  /^\[[^\]]+\]$/,
  /^\*$/,
  /^\*\*$/,
  /^in-[\w-]+$/,
  /^in-\[[^\]]+\]$/,
  /^in-[\w-]+-\[[^\]]+\]$/,
  /^in-\[\[[^\]]+\]\]$/,
  /^nth-\d+$/,
  /^nth-\[[^\]]+\]$/,
  /^nth-last-\d+$/,
  /^nth-last-\[[^\]]+\]$/,
  /^nth-of-type-\d+$/,
  /^nth-of-type-\[[^\]]+\]$/,
  /^nth-last-of-type-\d+$/,
  /^nth-last-of-type-\[[^\]]+\]$/,
  /^starting$/,
  /^forced-colors$/,
];

/**
 * Strip variant prefixes from a class name, returning the bare utility.
 * Iterative — handles stacked variants like `dark:hover:sm:bg-red-500`.
 */
export function normalizeClassName(className: string): string {
  let result = className;
  let prevResult = "";
  let iterations = 0;
  const maxIterations = 20;

  while (prevResult !== result && iterations < maxIterations) {
    prevResult = result;
    iterations++;
    result = result.replace(
      /^(@?(?:\*{1,2}|\[\[[^\]]+\]\]|\[[^\]]*\]|(?:[\w-]+(?:-\[\[[^\]]+\]\]|-\[[^\]]*\])?))(?:\/[\w-]+)?|\[\[[^\]]+\]\]|\[[^\]]*\]):/,
      ""
    );
  }

  return result;
}

/**
 * Returns true when the string starts with a recognized variant prefix.
 * Used to filter candidate tokens during extraction.
 */
export function hasValidVariantPrefix(str: string): boolean {
  const variantMatch = str.match(
    /^(@?(?:\*{1,2}|[\w/-]+)?(?:-?\[\[[^\]]+\]\]|-?\[[^\]]*\])?(?:\/[\w-]+)?):(.+)$/
  );
  if (!variantMatch) return false;

  const variant = variantMatch[1];
  if (!variant) return false;

  return VARIANT_TOKEN_PATTERNS.some((pattern) => pattern.test(variant));
}

/**
 * True when the colon in `str` is a Tailwind variant separator (not a CSS
 * property colon embedded in an arbitrary value).
 */
export function isVariantSeparator(str: string): boolean {
  if (str.startsWith("[")) return false;

  let bracketDepth = 0;
  let parenDepth = 0;
  let colonIndex = -1;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === "[") bracketDepth++;
    else if (ch === "]") bracketDepth--;
    else if (ch === "(") parenDepth++;
    else if (ch === ")") parenDepth--;
    else if (ch === ":" && bracketDepth === 0 && parenDepth === 0) {
      colonIndex = i;
      break;
    }
  }

  if (colonIndex === -1) return false;

  const firstPart = str.substring(0, colonIndex);
  if (VARIANT_PREFIXES.includes(firstPart)) return true;

  return FIRST_SEGMENT_VARIANT_PATTERNS.some((p) => p.test(firstPart));
}

/**
 * True when every colon in `str` lies inside `[...]` or `(...)`.
 * Distinguishes CSS variable shorthand `bg-(color:--my-bg)` from a real
 * `prop:value` CSS declaration.
 */
export function hasOnlyNestedColons(str: string): boolean {
  let bracketDepth = 0;
  let parenDepth = 0;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === "[") bracketDepth++;
    else if (ch === "]") bracketDepth--;
    else if (ch === "(") parenDepth++;
    else if (ch === ")") parenDepth--;
    else if (ch === ":" && bracketDepth === 0 && parenDepth === 0) {
      return false;
    }
  }

  return true;
}
