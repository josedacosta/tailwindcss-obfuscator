/**
 * Tailwind class validation helpers.
 *
 * Determines whether an arbitrary string token looks like a Tailwind utility,
 * accounting for v3 and v4 syntax: variants, arbitrary values, CSS variable
 * shorthand, important and negative prefixes, etc.
 */

import { STATIC_UTILITIES, functionalUtilityPrefixes } from "./utilities.js";
import {
  hasOnlyNestedColons,
  hasValidVariantPrefix,
  isVariantSeparator,
  normalizeClassName,
} from "./variants.js";

/**
 * Tailwind utility patterns checked exhaustively. Kept as a list to allow
 * incremental extension without rewriting the validator.
 */
const TAILWIND_UTILITY_PATTERNS: RegExp[] = [
  // Spacing: p-4, px-2, mt-auto, m-[13px], etc.
  /^[mp][trblxyse]?-(?:auto|px|\d+(?:\.5)?|[\w.-]+|\[[^\]]+\]|\([^)]+\))$/,
  /^-[mp][trblxyse]?-(?:\d+(?:\.5)?|[\w.-]+|\[[^\]]+\]|\([^)]+\))$/,
  /^space-[xy]-(?:reverse|\d+(?:\.5)?|[\w.-]+|\[[^\]]+\])$/,
  /^-space-[xy]-(?:\d+(?:\.5)?|[\w.-]+|\[[^\]]+\])$/,
  /^gap(?:-[xy])?-(?:\d+(?:\.5)?|[\w.-]+|\[[^\]]+\])$/,
  // Sizing
  /^[wh]-(?:auto|full|screen|svh|lvh|dvh|min|max|fit|px|\d+(?:\.5)?|[\w./-]+|\[[^\]]+\]|\([^)]+\))$/,
  /^(?:min|max)-[wh]-(?:none|full|screen|min|max|fit|prose|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|px|\d+(?:\.5)?|[\w./-]+|\[[^\]]+\])$/,
  /^size-(?:auto|full|min|max|fit|px|\d+(?:\.5)?|[\w./-]+|\[[^\]]+\])$/,
  // Inset/Position
  /^-?(?:inset|inset-[xy]|top|right|bottom|left|start|end)-(?:auto|full|px|\d+(?:\.5)?|[\w./-]+|\[[^\]]+\]|\([^)]+\))$/,
  // Typography
  /^text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|[\w.-]+|\[[^\]]+\])$/,
  /^font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black|sans|serif|mono|[\w.-]+|\[[^\]]+\])$/,
  /^leading-(?:none|tight|snug|normal|relaxed|loose|\d+|[\w.-]+|\[[^\]]+\])$/,
  /^tracking-(?:tighter|tight|normal|wide|wider|widest|[\w.-]+|\[[^\]]+\])$/,
  /^line-clamp-(?:none|\d+|\[[^\]]+\])$/,
  /^indent-(?:px|\d+(?:\.5)?|[\w.-]+|\[[^\]]+\])$/,
  /^-indent-(?:\d+(?:\.5)?|[\w.-]+|\[[^\]]+\])$/,
  /^decoration-(?:auto|from-font|solid|double|dotted|dashed|wavy|[\w.-]+|\[[^\]]+\])$/,
  /^underline-offset-(?:auto|\d+|[\w.-]+|\[[^\]]+\])$/,
  // Colors
  /^(?:bg|text|border(?:-[trblxyse])?|outline|ring(?:-offset)?|shadow|accent|caret|fill|stroke|divide(?:-[xy])?|decoration|from|via|to)-(?:inherit|current|transparent|black|white|[\w.-]+)(?:\/(?:\d+|[\w.-]+|\[[^\]]+\]))?$/,
  /^(?:bg|text|border(?:-[trblxyse])?|outline|ring(?:-offset)?|shadow|accent|caret|fill|stroke|divide(?:-[xy])?|from|via|to)-\[[^\]]+\](?:\/(?:\d+|[\w.-]+|\[[^\]]+\]))?$/,
  /^(?:bg|text|border(?:-[trblxyse])?|outline|ring(?:-offset)?|shadow|accent|caret|fill|stroke|divide(?:-[xy])?|from|via|to)-\((?:[\w-]+:)?--[\w-]+(?:,[^)]+)?\)(?:\/(?:\d+|\[[^\]]+\]))?$/,
  // Borders
  /^border(?:-[trblxyse])?(?:-(?:\d+|[\w.-]+|\[[^\]]+\]))?$/,
  /^rounded(?:-(?:t|r|b|l|tl|tr|br|bl|s|e|ss|se|ee|es))?(?:-(?:none|sm|md|lg|xl|2xl|3xl|full|[\w.-]+|\[[^\]]+\]))?$/,
  /^outline(?:-(?:none|\d+|[\w.-]+|\[[^\]]+\]))?$/,
  /^ring(?:-(?:inset|\d+|[\w.-]+|\[[^\]]+\]))?$/,
  /^ring-offset-(?:\d+|[\w.-]+|\[[^\]]+\])$/,
  /^divide-(?:[xy]-)?\d+$/,
  /^divide-(?:solid|dashed|dotted|double|none)$/,
  // Grid/Flexbox
  /^grid-(?:cols|rows)-(?:none|subgrid|\d+|[\w.-]+|\[[^\]]+\])$/,
  /^auto-(?:cols|rows)-(?:auto|min|max|fr|[\w.-]+|\[[^\]]+\])$/,
  /^(?:col|row)-(?:auto|span-(?:\d+|full)|start-(?:\d+|auto)|end-(?:\d+|auto)|[\w.-]+|\[[^\]]+\])$/,
  /^flex-(?:1|auto|initial|none|row|row-reverse|col|col-reverse|wrap|wrap-reverse|nowrap|[\w.-]+|\[[^\]]+\])$/,
  /^basis-(?:auto|full|px|\d+(?:\.5)?|[\w./-]+|\[[^\]]+\])$/,
  /^order-(?:first|last|none|\d+|-\d+|[\w.-]+|\[[^\]]+\])$/,
  /^-order-(?:\d+|[\w.-]+|\[[^\]]+\])$/,
  /^(?:grow|shrink)(?:-(?:0|\d+|[\w.-]+|\[[^\]]+\]))?$/,
  // Transforms
  /^-?scale(?:-[xy])?-(?:\d+|[\w.-]+|\[[^\]]+\])$/,
  /^-?rotate-(?:\d+|[\w.-]+|\[[^\]]+\])$/,
  /^-?translate-[xy]-(?:full|px|\d+(?:\.5)?|[\w./-]+|\[[^\]]+\])$/,
  /^-?skew-[xy]-(?:\d+|[\w.-]+|\[[^\]]+\])$/,
  /^origin-(?:center|top|top-right|right|bottom-right|bottom|bottom-left|left|top-left|[\w.-]+|\[[^\]]+\])$/,
  // Transitions
  /^duration-(?:\d+|[\w.-]+|\[[^\]]+\])$/,
  /^delay-(?:\d+|[\w.-]+|\[[^\]]+\])$/,
  /^ease-(?:linear|in|out|in-out|[\w.-]+|\[[^\]]+\])$/,
  // Effects
  /^opacity-(?:\d+|[\w.-]+|\[[^\]]+\])$/,
  /^(?:blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia|drop-shadow)(?:-(?:none|0|sm|md|lg|xl|2xl|3xl|[\w.-]+|\[[^\]]+\]))?$/,
  /^-?hue-rotate-(?:\d+|[\w.-]+|\[[^\]]+\])$/,
  /^backdrop-(?:blur|brightness|contrast|grayscale|hue-rotate|invert|opacity|saturate|sepia)(?:-(?:none|0|sm|md|lg|xl|2xl|3xl|\d+|[\w.-]+|\[[^\]]+\]))?$/,
  // Z-index
  /^-?z-(?:auto|\d+|[\w.-]+|\[[^\]]+\])$/,
  // Aspect ratio
  /^aspect-(?:auto|square|video|[\w./-]+|\[[^\]]+\])$/,
  // Columns
  /^columns-(?:\d+|auto|3xs|2xs|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|[\w.-]+|\[[^\]]+\])$/,
  // Object position
  /^object-(?:bottom|center|left|left-bottom|left-top|right|right-bottom|right-top|top|[\w.-]+|\[[^\]]+\])$/,
  // Scroll
  /^-?scroll-[mp][trblxyse]?-(?:px|\d+(?:\.5)?|[\w.-]+|\[[^\]]+\])$/,
  // Gradient stops
  /^(?:from|via|to)-(?:\d+%|\[[^\]]+\])$/,
  // List style
  /^list-(?:none|disc|decimal|[\w.-]+|\[[^\]]+\])$/,
  // Stroke width
  /^stroke-(?:\d+|[\w.-]+|\[[^\]]+\])$/,
  // Container queries (v4)
  /^@container(?:\/[\w-]+)?$/,
  /^@(?:sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)(?:\/[\w-]+)?$/,
  /^@\[[^\]]+\](?:\/[\w-]+)?$/,
  /^@min-\[[^\]]+\](?:\/[\w-]+)?$/,
  /^@max-\[[^\]]+\](?:\/[\w-]+)?$/,
  /^@\[\d+px\]$/,
  /^@\[[\w-]+:[^\]]+\]$/,
  // Data attributes (v4)
  /^data-[\w-]+$/,
  /^data-\[[^\]]+\]$/,
  /^group-data-\[[^\]]+\]$/,
  /^peer-data-\[[^\]]+\]$/,
  // ARIA variants (v4)
  /^aria-[\w-]+$/,
  /^aria-\[[^\]]+\]$/,
  /^group-aria-[\w-]+$/,
  /^group-aria-\[[^\]]+\]$/,
  /^peer-aria-[\w-]+$/,
  /^peer-aria-\[[^\]]+\]$/,
  // Supports (v4)
  /^supports-\[[^\]]+\]$/,
  /^supports-\(--[\w-]+\)$/,
  // Has variant
  /^has-\[[^\]]+\]$/,
  // Group/Peer with named groups
  /^group\/[\w-]+$/,
  /^peer\/[\w-]+$/,
  /^group-(?:hover|focus|active|visited|focus-within|focus-visible)\/[\w-]+$/,
  /^peer-(?:hover|focus|active|checked|disabled|invalid|placeholder-shown)\/[\w-]+$/,
  // Content for before/after
  /^content-(?:none|\[[^\]]+\])$/,
  // Arbitrary properties
  /^\[[a-z-]+:[^\]]+\]$/,
  // Important modifier
  /^![\w-[\]()/-]+$/,
  /^[\w-[\]()/-]+!$/,
  // Prose (typography plugin)
  /^prose(?:-(?:sm|base|lg|xl|2xl|invert|[\w.-]+))?$/,
  // Animate with custom keyframes
  /^animate-\[[^\]]+\]$/,
  // Accent color
  /^accent-(?:inherit|current|transparent|[\w.-]+|\[[^\]]+\])(?:\/(?:\d+|\[[^\]]+\]))?$/,
  // Will-change with arbitrary
  /^will-change-\[[^\]]+\]$/,
  // Cursor with arbitrary
  /^cursor-\[[^\]]+\]$/,
];

/**
 * Heuristic check: does `str` look like a Tailwind utility class?
 *
 * Comprehensive across Tailwind v3 and v4 syntax.
 */
export function isTailwindClass(str: string): boolean {
  if (!str || !str.trim()) return false;

  if (str.includes("://")) return false;
  if (str.startsWith("/") && str.length > 1 && !str.startsWith("//")) return false;

  if (/^\d+$/.test(str)) return false;
  if (/^#[0-9a-fA-F]+$/.test(str)) return false;
  if (/^--[\w-]+$/.test(str)) return false;

  if (/^\[[a-zA-Z-]+:[^\]]+\]$/.test(str)) return true;
  if (/^\[--[\w-]+:[^\]]+\]$/.test(str)) return true;

  if (/^[\w@/-]+(?:\[[^\]]*\])?:\[[a-zA-Z-]+:[^\]]+\]$/.test(str)) return true;

  if (str.includes(":") && !isVariantSeparator(str) && !str.startsWith("[")) {
    if (!hasOnlyNestedColons(str)) {
      return false;
    }
  }

  const withoutImportant = str.replace(/^!/, "").replace(/!$/, "");
  const withoutNegative = withoutImportant.replace(/^-/, "");
  const baseClass = normalizeClassName(withoutNegative);

  if (STATIC_UTILITIES.has(baseClass)) return true;
  if (STATIC_UTILITIES.has(withoutNegative)) return true;

  if (/^\[[a-zA-Z-]+:[^\]]+\]$/.test(baseClass)) return true;
  if (/^\[--[\w-]+:[^\]]+\]$/.test(baseClass)) return true;

  if (TAILWIND_UTILITY_PATTERNS.some((pattern) => pattern.test(baseClass))) {
    return true;
  }

  for (const prefix of functionalUtilityPrefixes()) {
    if (baseClass.startsWith(prefix + "-") || baseClass.startsWith("-" + prefix + "-")) {
      return true;
    }
  }

  if (hasValidVariantPrefix(str)) {
    const utility = normalizeClassName(str);
    if (utility && isTailwindClass(utility)) {
      return true;
    }
  }

  return false;
}
