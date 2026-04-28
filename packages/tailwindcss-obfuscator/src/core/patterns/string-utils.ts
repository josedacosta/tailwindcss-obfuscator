/**
 * String-level helpers for splitting and deduplicating raw class strings
 * before per-token validation.
 */

/**
 * Split a class-attribute value into individual class tokens, respecting
 * arbitrary value brackets and CSS variable parentheses so values containing
 * spaces (e.g. `bg-[url('image.png')]`) survive intact.
 */
export function extractClassesFromString(value: string): string[] {
  const cleaned = value.replace(/^["'`]|["'`]$/g, "").trim();
  if (!cleaned) return [];

  const classes: string[] = [];
  let current = "";
  let bracketDepth = 0;
  let parenDepth = 0;

  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];

    if (ch === "[") {
      bracketDepth++;
      current += ch;
    } else if (ch === "]") {
      bracketDepth--;
      current += ch;
    } else if (ch === "(") {
      parenDepth++;
      current += ch;
    } else if (ch === ")") {
      parenDepth--;
      current += ch;
    } else if (/\s/.test(ch) && bracketDepth === 0 && parenDepth === 0) {
      if (current) {
        classes.push(current);
        current = "";
      }
    } else {
      current += ch;
    }
  }

  if (current) {
    classes.push(current);
  }

  return classes.filter((cls) => cls.length > 0 && !cls.includes("${"));
}

/**
 * Deduplicate and sort a list of class names. Sort is stable alphabetical so
 * generated mappings stay reproducible across runs.
 */
export function deduplicateClasses(classes: string[]): string[] {
  return [...new Set(classes)].sort();
}

/**
 * Alias of {@link extractClassesFromString} preserved for backward
 * compatibility with the original `splitClassString` export.
 */
export function splitClassString(classString: string): string[] {
  return extractClassesFromString(classString);
}
