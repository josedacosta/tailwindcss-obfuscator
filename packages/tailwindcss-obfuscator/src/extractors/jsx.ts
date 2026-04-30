/**
 * JSX/TSX class extractor
 *
 * Extracts classes from React/JSX files including:
 * - className="..." string literals (React)
 * - class="..." string literals (Svelte, Qwik, Astro, Vue)
 * - className={`...`} template literals
 * - className={cn(...)} function calls
 * - clsx(), classnames(), cva(), tv() calls
 * - class:directive (Svelte)
 * - class:list={[...]} (Svelte, Astro)
 * - :class="..." (Vue)
 * - Arbitrary values [...]
 * - Container queries (@container, @lg:)
 * - Data attributes (data-[...]:)
 * - ARIA variants (aria-[...]:)
 */

import { extractClassesFromString, deduplicateClasses, isTailwindClass } from "./base.js";

/**
 * Pattern to match className or class with string literal
 * Supports: className="...", class="...", class:name="..."
 */
const CLASSNAME_STRING_PATTERN = /(?:className|class)\s*=\s*["']([^"']*)["']/g;

/**
 * Pattern to match className or class with template literal (simple cases)
 */
const CLASSNAME_TEMPLATE_PATTERN = /(?:className|class)\s*=\s*\{?\s*`([^`]*)`\s*\}?/g;

/**
 * Pattern to match Svelte class: directive
 * e.g., class:active={isActive}, class:bg-red-500={hasError}, class:flex
 * Now supports arbitrary values: class:bg-[#1da1f2]={condition}
 */
const SVELTE_CLASS_DIRECTIVE_PATTERN = /class:([\w\-[\]#%.()]+)(?:\s*=|\s*>|\s*\/|\s+|$)/g;

/**
 * Pattern to match Svelte/Astro class:list directive
 * e.g., class:list={["flex", "items-center", { "bg-red-500": isActive }]}
 */
const CLASS_LIST_PATTERN = /class:list\s*=\s*\{([^}]+)\}/g;

/**
 * Pattern to match Vue :class or v-bind:class
 * e.g., :class="{ 'bg-blue-500': isActive }", :class="['flex', active && 'bg-blue']"
 *
 * Implementation note: previous versions used a nested-quantifier pattern
 * to support stray nested quotes inside the binding (e.g. attribute strings
 * containing both ' and "). That pattern matched CodeQL's `js/redos`
 * signature — the nesting (`[^"]* (...) *`) caused catastrophic
 * backtracking on inputs like `:class="aaaa…"` with no closing quote.
 * In Vue templates, nested quotes inside the binding value are rare and
 * the build-time tool would already mis-parse such input. Switching to a
 * flat negated character class fixes the ReDoS without a real regression
 * in extraction coverage.
 */
const VUE_CLASS_BINDING_PATTERN_DOUBLE = /(?::class|v-bind:class)\s*=\s*"([^"]*)"/g;
const VUE_CLASS_BINDING_PATTERN_SINGLE = /(?::class|v-bind:class)\s*=\s*'([^']*)'/g;

/**
 * Pattern to match class utility function calls
 * Updated to include tv() for tailwind-variants
 * Now captures the entire content within parentheses for more flexible extraction
 */
const CLASS_UTIL_PATTERN = /(?:cn|clsx|classnames|classNames|twMerge)\s*\(/g;

/**
 * Pattern to match string literals within function arguments
 * Updated to handle arbitrary values with brackets
 */
const STRING_LITERAL_PATTERN = /['"`]([^'"`]+)['"`]/g;

/**
 * Pattern to match object keys in conditional class objects
 * e.g., { 'bg-red-500': isActive, hidden: !isVisible, 'bg-[#1da1f2]': custom }
 * Updated to support arbitrary values in keys.
 *
 * Security note (CodeQL `js/polynomial-redos`, CWE-1333) : the char class
 * previously included `\s` (`[\w\-[\]#%.():/\s]+`) — combined with the
 * optional `['"]?` quote and the trailing `\s*:`, this allowed multiple
 * ways to partition whitespace at the end of the captured group, with
 * polynomial backtracking on input like `{   :`. Class names cannot
 * contain whitespace anyway, so dropping `\s` from the char class
 * removes the ambiguity without changing real-world coverage. Multi-class
 * keys (the legitimate space-separated case) are still handled by the
 * caller via `extractClassesFromString(keyValue)`.
 */
const OBJECT_KEY_PATTERN = /[{,]\s*['"]?([\w\-[\]#%.():/]+)['"]?\s*:/g;

/**
 * Pattern to match array items in class arrays
 * e.g., ["flex", "items-center", condition && "bg-blue-500"]
 */
const ARRAY_ITEM_PATTERN = /['"`]([\w\-[\]#%.():/@!\s]+)['"`]/g;

/**
 * Pattern to match Qwik reactive class
 * e.g., class$={...}
 */
const QWIK_CLASS_PATTERN = /class\$\s*=\s*\{([^}]+)\}/g;

/**
 * Extract a balanced block of content between opening and closing characters
 * e.g., extract content between matching { and } or ( and )
 */
function extractBalancedBlock(
  content: string,
  startIndex: number,
  openChar: string,
  closeChar: string
): string | null {
  // Find the opening character
  let i = startIndex;
  while (i < content.length && content[i] !== openChar) {
    i++;
  }

  if (i >= content.length) return null;

  const blockStart = i;
  let depth = 0;

  while (i < content.length) {
    if (content[i] === openChar) {
      depth++;
    } else if (content[i] === closeChar) {
      depth--;
      if (depth === 0) {
        return content.substring(blockStart, i + 1);
      }
    }
    i++;
  }

  return null;
}

/**
 * Extract classes from JSX content
 */
export function extractFromJsx(content: string, _filePath: string): string[] {
  const classes: string[] = [];

  // Extract from className="..."
  let match;
  while ((match = CLASSNAME_STRING_PATTERN.exec(content)) !== null) {
    const classValue = match[1];
    classes.push(...extractClassesFromString(classValue));
  }
  CLASSNAME_STRING_PATTERN.lastIndex = 0;

  // Extract from className={`...`}
  while ((match = CLASSNAME_TEMPLATE_PATTERN.exec(content)) !== null) {
    const classValue = match[1];
    // Filter out template expressions ${...}
    const cleanedValue = classValue.replace(/\$\{[^}]*\}/g, " ");
    classes.push(...extractClassesFromString(cleanedValue));
  }
  CLASSNAME_TEMPLATE_PATTERN.lastIndex = 0;

  // Extract from cn(), clsx(), etc. - find function calls and extract strings from within
  while ((match = CLASS_UTIL_PATTERN.exec(content)) !== null) {
    // Extract the balanced content within parentheses
    const fnContent = extractBalancedBlock(content, match.index + match[0].length - 1, "(", ")");
    if (fnContent) {
      // Extract string literals from arguments
      let stringMatch;
      while ((stringMatch = STRING_LITERAL_PATTERN.exec(fnContent)) !== null) {
        const stringValue = stringMatch[1];
        // Filter out template expressions
        const cleanedValue = stringValue.replace(/\$\{[^}]*\}/g, " ");
        classes.push(...extractClassesFromString(cleanedValue));
      }
      STRING_LITERAL_PATTERN.lastIndex = 0;
    }
  }
  CLASS_UTIL_PATTERN.lastIndex = 0;

  // Extract from conditional class objects
  while ((match = OBJECT_KEY_PATTERN.exec(content)) !== null) {
    const keyValue = match[1].trim();
    // Handle space-separated classes in object keys
    const potentialClasses = extractClassesFromString(keyValue);
    classes.push(...potentialClasses.filter((cls) => isTailwindClass(cls)));
  }
  OBJECT_KEY_PATTERN.lastIndex = 0;

  // Extract from Svelte class: directives
  while ((match = SVELTE_CLASS_DIRECTIVE_PATTERN.exec(content)) !== null) {
    const className = match[1];
    if (isTailwindClass(className)) {
      classes.push(className);
    }
  }
  SVELTE_CLASS_DIRECTIVE_PATTERN.lastIndex = 0;

  // Extract from Svelte/Astro class:list
  while ((match = CLASS_LIST_PATTERN.exec(content)) !== null) {
    const listContent = match[1];
    classes.push(...extractFromClassList(listContent));
  }
  CLASS_LIST_PATTERN.lastIndex = 0;

  // Extract from Vue :class binding (double quotes)
  while ((match = VUE_CLASS_BINDING_PATTERN_DOUBLE.exec(content)) !== null) {
    const bindingContent = match[1];
    classes.push(...extractFromVueClassBinding(bindingContent));
  }
  VUE_CLASS_BINDING_PATTERN_DOUBLE.lastIndex = 0;

  // Extract from Vue :class binding (single quotes)
  while ((match = VUE_CLASS_BINDING_PATTERN_SINGLE.exec(content)) !== null) {
    const bindingContent = match[1];
    classes.push(...extractFromVueClassBinding(bindingContent));
  }
  VUE_CLASS_BINDING_PATTERN_SINGLE.lastIndex = 0;

  // Extract from Qwik class$
  while ((match = QWIK_CLASS_PATTERN.exec(content)) !== null) {
    const qwikContent = match[1];
    // Extract string literals from Qwik class binding
    let stringMatch;
    while ((stringMatch = STRING_LITERAL_PATTERN.exec(qwikContent)) !== null) {
      const stringValue = stringMatch[1];
      classes.push(...extractClassesFromString(stringValue));
    }
    STRING_LITERAL_PATTERN.lastIndex = 0;
  }
  QWIK_CLASS_PATTERN.lastIndex = 0;

  // Filter to likely Tailwind classes and deduplicate
  return deduplicateClasses(classes.filter((cls) => isTailwindClass(cls)));
}

/**
 * Extract classes from Svelte/Astro class:list content
 * Handles: class:list={["flex", "items-center", { "bg-red-500": isActive }]}
 */
function extractFromClassList(content: string): string[] {
  const classes: string[] = [];

  // Extract string literals from array
  let match;
  while ((match = ARRAY_ITEM_PATTERN.exec(content)) !== null) {
    const value = match[1].trim();
    classes.push(...extractClassesFromString(value));
  }
  ARRAY_ITEM_PATTERN.lastIndex = 0;

  // Extract object keys (for conditional classes)
  while ((match = OBJECT_KEY_PATTERN.exec(content)) !== null) {
    const keyValue = match[1].trim();
    classes.push(...extractClassesFromString(keyValue));
  }
  OBJECT_KEY_PATTERN.lastIndex = 0;

  return classes;
}

/**
 * Extract classes from Vue :class binding
 * Handles:
 * - Object syntax: :class="{ 'bg-blue-500': isActive, hidden: !show }"
 * - Array syntax: :class="['flex', isActive ? 'bg-blue-500' : 'bg-gray-500']"
 * - Mixed: :class="[baseClass, { 'bg-blue-500': isActive }]"
 */
function extractFromVueClassBinding(content: string): string[] {
  const classes: string[] = [];

  // Check if it's an object
  if (content.trim().startsWith("{")) {
    // Object syntax - extract keys
    let match;
    while ((match = OBJECT_KEY_PATTERN.exec(content)) !== null) {
      const keyValue = match[1].trim();
      classes.push(...extractClassesFromString(keyValue));
    }
    OBJECT_KEY_PATTERN.lastIndex = 0;
  } else if (content.trim().startsWith("[")) {
    // Array syntax - extract string literals
    let match;
    while ((match = ARRAY_ITEM_PATTERN.exec(content)) !== null) {
      const value = match[1].trim();
      classes.push(...extractClassesFromString(value));
    }
    ARRAY_ITEM_PATTERN.lastIndex = 0;

    // Also check for nested objects in array
    const objectMatches = content.match(/\{[^}]+\}/g);
    if (objectMatches) {
      for (const objMatch of objectMatches) {
        let keyMatch;
        while ((keyMatch = OBJECT_KEY_PATTERN.exec(objMatch)) !== null) {
          const keyValue = keyMatch[1].trim();
          classes.push(...extractClassesFromString(keyValue));
        }
        OBJECT_KEY_PATTERN.lastIndex = 0;
      }
    }
  } else {
    // Simple string or variable - try to extract string literals
    let match;
    while ((match = STRING_LITERAL_PATTERN.exec(content)) !== null) {
      const value = match[1].trim();
      classes.push(...extractClassesFromString(value));
    }
    STRING_LITERAL_PATTERN.lastIndex = 0;
  }

  return classes;
}

/**
 * Extract classes from JSX with support for cva() patterns
 */
export function extractFromJsxWithCva(content: string, _filePath: string): string[] {
  const classes: string[] = [];

  // Get base classes
  classes.push(...extractFromJsx(content, _filePath));

  // Pattern for cva base classes
  const cvaBasePattern = /cva\s*\(\s*["'`]([^"'`]+)["'`]/g;
  let match;

  while ((match = cvaBasePattern.exec(content)) !== null) {
    const baseClasses = match[1];
    classes.push(...extractClassesFromString(baseClasses));
  }
  cvaBasePattern.lastIndex = 0;

  // Pattern for cva variant classes - need to handle nested objects
  // Extract the variants block by finding balanced braces
  const variantsStart = content.indexOf("variants:");
  if (variantsStart !== -1) {
    const variantsContent = extractBalancedBlock(
      content,
      variantsStart + "variants:".length,
      "{",
      "}"
    );
    if (variantsContent) {
      // Extract all string values from the variants block
      let stringMatch;
      while ((stringMatch = STRING_LITERAL_PATTERN.exec(variantsContent)) !== null) {
        const stringValue = stringMatch[1];
        classes.push(...extractClassesFromString(stringValue));
      }
      STRING_LITERAL_PATTERN.lastIndex = 0;
    }
  }

  // cva compoundVariants — extracted via balanced-block traversal to
  // avoid the polynomial-redos shape `[\s\S]*?` previously used here
  // (CodeQL `js/polynomial-redos`, CWE-1333). Same family as the tv()
  // base fix in PR #106.
  let cvStart = content.indexOf("compoundVariants:");
  while (cvStart !== -1) {
    const cvBlock = extractBalancedBlock(content, cvStart + "compoundVariants:".length, "[", "]");
    if (cvBlock) {
      let stringMatch;
      while ((stringMatch = STRING_LITERAL_PATTERN.exec(cvBlock)) !== null) {
        classes.push(...extractClassesFromString(stringMatch[1]));
      }
      STRING_LITERAL_PATTERN.lastIndex = 0;
    }
    cvStart = content.indexOf("compoundVariants:", cvStart + 1);
  }

  // cva defaultVariants — same balanced-block pattern as compoundVariants
  // above, also fixing the `[\s\S]*?` polynomial-redos shape.
  let dvStart = content.indexOf("defaultVariants:");
  while (dvStart !== -1) {
    const dvBlock = extractBalancedBlock(content, dvStart + "defaultVariants:".length, "{", "}");
    if (dvBlock) {
      let stringMatch;
      while ((stringMatch = STRING_LITERAL_PATTERN.exec(dvBlock)) !== null) {
        const extracted = extractClassesFromString(stringMatch[1]);
        classes.push(...extracted.filter((cls) => isTailwindClass(cls)));
      }
      STRING_LITERAL_PATTERN.lastIndex = 0;
    }
    dvStart = content.indexOf("defaultVariants:", dvStart + 1);
  }

  return deduplicateClasses(classes.filter((cls) => isTailwindClass(cls)));
}

/**
 * Extract classes from tailwind-variants (tv) patterns
 *
 * Uses `extractBalancedBlock` for `variants:`, `slots:`, `compoundVariants:`,
 * `compoundSlots:`, and `defaultVariants:` because their content is a nested
 * object with inner braces (`intent: { primary: "..." }`). A naive regex with
 * `[\s\S]*?\}` closes on the first inner `}` and captures only the first key,
 * leaving the rest of the variants un-extracted (this was issue #61).
 */
export function extractFromTailwindVariants(content: string, _filePath: string): string[] {
  const classes: string[] = [];
  let match;

  // For each tv() call, find every keyword block (base, variants, slots,
  // compoundVariants, compoundSlots, defaultVariants) and extract every
  // string literal inside it via balanced-brace traversal.
  //
  // Earlier versions used a separate `/tv\s*\(\s*\{[\s\S]*?base\s*:\s*…/`
  // regex for the `base:` string. That `[\s\S]*?base` pattern is a
  // textbook polynomial-redos shape (CodeQL `js/polynomial-redos`,
  // CWE-1333) — crafted input with many `bas` runs but no `e` would
  // backtrack quadratically. The new flow extracts the balanced tv()
  // call block once, then runs a SAFE non-greedy regex on the block
  // (no `*?` over arbitrary characters before the `base` literal —
  // the search is anchored at `\bbase` directly inside the bounded block).
  const tvCallSitePattern = /tv\s*\(\s*\{/g;
  while ((match = tvCallSitePattern.exec(content)) !== null) {
    // Find the closing `}` of the tv({...}) call so we don't bleed into
    // the next tv() block in the same file.
    const callOpen = content.indexOf("{", match.index);
    const callBlock = extractBalancedBlock(content, callOpen, "{", "}");
    if (!callBlock) continue;

    // Extract the `base: "..."` string literal first. Anchored at
    // `\bbase` inside the already-bounded callBlock — no polynomial
    // backtracking risk.
    const baseRe = /\bbase\s*:\s*["'`]([^"'`]+)["'`]/g;
    let baseMatch;
    while ((baseMatch = baseRe.exec(callBlock)) !== null) {
      classes.push(...extractClassesFromString(baseMatch[1]));
    }

    for (const keyword of [
      "variants",
      "slots",
      "compoundVariants",
      "compoundSlots",
      "defaultVariants",
    ]) {
      // Find each keyword inside the tv() call. May appear once.
      const re = new RegExp(`\\b${keyword}\\s*:`, "g");
      let kMatch;
      while ((kMatch = re.exec(callBlock)) !== null) {
        // Find the next `{` or `[` after the colon and extract that balanced block.
        const afterColon = callBlock.indexOf(":", kMatch.index) + 1;
        // Skip whitespace, find the opening character.
        let i = afterColon;
        while (i < callBlock.length && /\s/.test(callBlock[i])) i++;
        const open = callBlock[i];
        const close = open === "[" ? "]" : open === "{" ? "}" : null;
        if (!close) continue;
        const block = extractBalancedBlock(callBlock, i, open, close);
        if (!block) continue;
        // Extract every string literal inside the block.
        let stringMatch;
        while ((stringMatch = STRING_LITERAL_PATTERN.exec(block)) !== null) {
          const stringValue = stringMatch[1];
          classes.push(...extractClassesFromString(stringValue));
        }
        STRING_LITERAL_PATTERN.lastIndex = 0;
      }
    }
  }
  tvCallSitePattern.lastIndex = 0;
  // (Slots are already covered by the keyword loop above — no separate pass needed.)

  return deduplicateClasses(classes.filter((cls) => isTailwindClass(cls)));
}

/**
 * Extract all classes from JSX/TSX content including all patterns
 * This is the main entry point for JSX extraction
 */
export function extractAllFromJsx(content: string, filePath: string): string[] {
  const classes: string[] = [];

  // Extract base JSX patterns
  classes.push(...extractFromJsx(content, filePath));

  // Extract CVA patterns
  classes.push(...extractFromJsxWithCva(content, filePath));

  // Extract tailwind-variants patterns
  classes.push(...extractFromTailwindVariants(content, filePath));

  return deduplicateClasses(classes);
}

/**
 * Extract from string literals that LOOK like Tailwind class lists.
 *
 * Required for the very common pattern of storing class strings inside object
 * literals or factory functions that the JSX/CVA/TV walkers don't reach :
 *
 *     const COLORS = {
 *       1: { badge: 'border-slate-400/30 bg-slate-400/10 text-slate-600',
 *            bar:   'bg-slate-400' },
 *       …
 *     };
 *
 * Without this pass, only siblings of these strings that ALSO appear inside
 * a `className=` attribute somewhere else in the codebase get extracted ;
 * the rest stay un-mapped, the CSS for them stays as-is, and at runtime the
 * className value points at non-existent rewritten selectors → broken design.
 *
 * Heuristic to avoid false positives on prose / config strings :
 *   - String must contain ≥2 whitespace-separated tokens
 *   - EVERY token must validate as a Tailwind class via `isTailwindClass`
 *
 * Single-word strings (`"red"`, `"info"`, `"flex"`) are NEVER picked up here ;
 * those would be ambiguous with JS identifiers / config values. If the user
 * wants single-word utility strings extracted, they should wrap them in a
 * recognised utility (`cn('flex')`) or add them to `safelist`.
 */
export function extractClassListLikeStrings(content: string, _filePath: string): string[] {
  const classes: string[] = [];
  let match: RegExpExecArray | null;

  STRING_LITERAL_PATTERN.lastIndex = 0;
  while ((match = STRING_LITERAL_PATTERN.exec(content)) !== null) {
    const raw = match[1];
    if (!raw || raw.length < 3) continue;
    // Strip ${…} so template-literal expressions don't poison the per-token
    // validation.
    const cleaned = raw.replace(/\$\{[^}]*\}/g, " ");
    const tokens = cleaned.split(/\s+/).filter(Boolean);
    if (tokens.length < 2) continue;
    // Every token must look like a Tailwind class — otherwise this is prose,
    // a config map, an i18n key, or some other non-class string.
    if (!tokens.every((t) => isTailwindClass(t))) continue;
    classes.push(...tokens);
  }
  STRING_LITERAL_PATTERN.lastIndex = 0;

  return deduplicateClasses(classes);
}
