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
 * Updated to support arbitrary values in keys
 */
const OBJECT_KEY_PATTERN = /[{,]\s*['"]?([\w\-[\]#%.():/\s]+)['"]?\s*:/g;

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

  // Pattern for cva compoundVariants
  const compoundVariantsPattern = /compoundVariants\s*:\s*\[([\s\S]*?)\]/g;
  while ((match = compoundVariantsPattern.exec(content)) !== null) {
    const compoundVariants = match[1];

    // Extract class values from compound variants
    let stringMatch;
    while ((stringMatch = STRING_LITERAL_PATTERN.exec(compoundVariants)) !== null) {
      const stringValue = stringMatch[1];
      classes.push(...extractClassesFromString(stringValue));
    }
    STRING_LITERAL_PATTERN.lastIndex = 0;
  }
  compoundVariantsPattern.lastIndex = 0;

  // Pattern for cva defaultVariants (may contain class-like values)
  const defaultVariantsPattern = /defaultVariants\s*:\s*\{([\s\S]*?)\}/g;
  while ((match = defaultVariantsPattern.exec(content)) !== null) {
    const defaultVariants = match[1];

    // Extract string values
    let stringMatch;
    while ((stringMatch = STRING_LITERAL_PATTERN.exec(defaultVariants)) !== null) {
      const stringValue = stringMatch[1];
      // Only add if it looks like a Tailwind class
      const extracted = extractClassesFromString(stringValue);
      classes.push(...extracted.filter((cls) => isTailwindClass(cls)));
    }
    STRING_LITERAL_PATTERN.lastIndex = 0;
  }
  defaultVariantsPattern.lastIndex = 0;

  return deduplicateClasses(classes.filter((cls) => isTailwindClass(cls)));
}

/**
 * Extract classes from tailwind-variants (tv) patterns
 */
export function extractFromTailwindVariants(content: string, _filePath: string): string[] {
  const classes: string[] = [];

  // Pattern for tv() base classes
  const tvBasePattern = /tv\s*\(\s*\{[\s\S]*?base\s*:\s*["'`]([^"'`]+)["'`]/g;
  let match;

  while ((match = tvBasePattern.exec(content)) !== null) {
    const baseClasses = match[1];
    classes.push(...extractClassesFromString(baseClasses));
  }
  tvBasePattern.lastIndex = 0;

  // Pattern for tv() variants
  const tvVariantsPattern = /tv\s*\(\s*\{[\s\S]*?variants\s*:\s*\{([\s\S]*?)\}\s*(?:,|\})/g;
  while ((match = tvVariantsPattern.exec(content)) !== null) {
    const variants = match[1];

    // Extract string values from variants
    let stringMatch;
    while ((stringMatch = STRING_LITERAL_PATTERN.exec(variants)) !== null) {
      const stringValue = stringMatch[1];
      classes.push(...extractClassesFromString(stringValue));
    }
    STRING_LITERAL_PATTERN.lastIndex = 0;
  }
  tvVariantsPattern.lastIndex = 0;

  // Pattern for tv() slots
  const tvSlotsPattern = /tv\s*\(\s*\{[\s\S]*?slots\s*:\s*\{([\s\S]*?)\}\s*(?:,|\})/g;
  while ((match = tvSlotsPattern.exec(content)) !== null) {
    const slots = match[1];

    // Extract string values from slots
    let stringMatch;
    while ((stringMatch = STRING_LITERAL_PATTERN.exec(slots)) !== null) {
      const stringValue = stringMatch[1];
      classes.push(...extractClassesFromString(stringValue));
    }
    STRING_LITERAL_PATTERN.lastIndex = 0;
  }
  tvSlotsPattern.lastIndex = 0;

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
