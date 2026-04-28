/**
 * Base extractor utilities.
 *
 * This file used to host all pattern definitions, the static-utility set, and
 * the validators. Those concerns now live under `core/patterns/*` so they can
 * be evolved independently. This module remains as a thin re-export shim to
 * preserve backward compatibility with existing imports (notably the test
 * suite, which imports from `../src/extractors/base.js`).
 */

export {
  // Regex constants
  TAILWIND_CLASS_PATTERN,
  CLASS_ATTRIBUTE_PATTERN,
  TEMPLATE_LITERAL_PATTERN,
  CLASS_FUNCTION_PATTERN,
  ARBITRARY_VALUE_PATTERN,
  CSS_VARIABLE_SHORTHAND_PATTERN,
  escapeRegex,
  createExactClassRegex,
  // Variants
  VARIANT_PREFIXES,
  normalizeClassName,
  // Utilities registry
  STATIC_UTILITIES,
  FUNCTIONAL_UTILITY_PREFIXES,
  registerStaticUtilities,
  registerFunctionalUtilityPrefixes,
  functionalUtilityPrefixes,
  // Validators
  isTailwindClass,
  // String helpers
  extractClassesFromString,
  deduplicateClasses,
  splitClassString,
} from "../core/patterns/index.js";
