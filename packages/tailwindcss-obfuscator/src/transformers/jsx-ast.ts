/**
 * AST-based JSX/TSX class transformer using Babel
 *
 * More accurate than regex-based transformation as it:
 * - Correctly identifies className props and utility function calls
 * - Handles nested expressions properly
 * - Supports preserve.functions to skip certain function calls
 * - Supports comment-based ignore directives
 */

import * as parser from "@babel/parser";
import _traverse from "@babel/traverse";
import * as t from "@babel/types";
import { transformJsx } from "./jsx.js";

// `@babel/traverse` ships a CJS module whose default export is the function
// itself; under Node ESM the namespace import lands on `{ default: fn }`.
// Bridge both shapes so the visitor callable in every runtime.
const traverse: typeof _traverse =
  // @ts-expect-error CJS interop fallback
  typeof _traverse === "function" ? _traverse : _traverse.default;
import MagicString from "magic-string";
import type { TransformResult, ResolvedObfuscatorOptions } from "../core/types.js";

/**
 * Default class utility function names to detect
 */
const DEFAULT_CLASS_UTILS = [
  "cn",
  "clsx",
  "classnames",
  "classNames",
  "twMerge",
  "cva",
  "tv", // tailwind-variants
];

/**
 * Comment directive to ignore the next line or block
 */
const IGNORE_DIRECTIVE = "tw-obfuscate-ignore";

/**
 * Tagged template literal tag to ignore
 */
const IGNORE_TAG = "twIgnore";

/**
 * Transform a space-separated class string
 */
function transformClassString(
  classValue: string,
  mapping: Map<string, string>,
  preserveClasses: Set<string>
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

    // Skip preserved classes
    if (preserveClasses.has(cls)) {
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
 * Check if a node has an ignore comment above it
 */
function hasIgnoreComment(node: t.Node, comments: t.Comment[] | null | undefined): boolean {
  if (!comments || !node.loc) return false;

  const nodeLine = node.loc.start.line;
  for (const comment of comments) {
    if (!comment.loc) continue;
    // Check if comment is on the line before or same line
    const commentLine = comment.loc.end.line;
    if (nodeLine - commentLine <= 1 && comment.value.includes(IGNORE_DIRECTIVE)) {
      return true;
    }
  }
  return false;
}

/**
 * Check if a function name is a preserved function
 */
function isPreservedFunction(name: string, preserveFunctions: Set<string>): boolean {
  return preserveFunctions.has(name);
}

/**
 * Check if a function name is a class utility function
 */
function isClassUtilFunction(name: string): boolean {
  return DEFAULT_CLASS_UTILS.includes(name);
}

/**
 * Parse TypeScript/TSX/JSX content
 */
function parseContent(content: string, filePath: string): parser.ParseResult<t.File> {
  const isTypeScript = filePath.endsWith(".ts") || filePath.endsWith(".tsx");
  const isJsx = filePath.endsWith(".jsx") || filePath.endsWith(".tsx");

  return parser.parse(content, {
    sourceType: "module",
    plugins: [
      isTypeScript ? "typescript" : null,
      isJsx || !isTypeScript ? "jsx" : null,
      "decorators-legacy",
      "classProperties",
      "classPrivateProperties",
      "classPrivateMethods",
      "dynamicImport",
      "optionalChaining",
      "nullishCoalescingOperator",
    ].filter(Boolean) as parser.ParserPlugin[],
  });
}

/**
 * Transform JSX content using Babel AST
 */
export function transformJsxAst(
  content: string,
  filePath: string,
  mapping: Map<string, string>,
  options: {
    sourcemap?: boolean;
    preserveFunctions?: string[];
    preserveClasses?: string[];
  } = {}
): TransformResult {
  const s = new MagicString(content);
  const allReplacements: string[] = [];
  let replacementCount = 0;

  const preserveFunctions = new Set(options.preserveFunctions || []);
  const preserveClasses = new Set(options.preserveClasses || []);
  // Nodes already handled by a specialized visitor — skipped by the generic
  // StringLiteral catch-all so we never double-process the same span.
  const visited = new WeakSet<t.Node>();

  try {
    const ast = parseContent(content, filePath);
    const comments = ast.comments;

    traverse(ast, {
      // Handle className="..." or className='...'
      JSXAttribute(path) {
        const node = path.node;
        const name = node.name;

        // Check for className or class attribute
        if (t.isJSXIdentifier(name) && (name.name === "className" || name.name === "class")) {
          // Check for ignore comment
          if (hasIgnoreComment(node, comments)) {
            return;
          }

          const value = node.value;

          // String literal: className="..."
          if (t.isStringLiteral(value)) {
            const { transformed, replacements, hasChanges } = transformClassString(
              value.value,
              mapping,
              preserveClasses
            );

            if (hasChanges && value.start != null && value.end != null) {
              // +1 and -1 to skip the quotes
              s.overwrite(value.start + 1, value.end - 1, transformed);
              allReplacements.push(...replacements);
              replacementCount++;
            }
            visited.add(value);
          }

          // JSX expression container: className={...}
          if (t.isJSXExpressionContainer(value)) {
            const expr = value.expression;

            // Template literal without expressions: className={`...`}
            if (t.isTemplateLiteral(expr) && expr.expressions.length === 0) {
              const quasi = expr.quasis[0];
              if (quasi && quasi.start != null && quasi.end != null) {
                const { transformed, replacements, hasChanges } = transformClassString(
                  quasi.value.raw,
                  mapping,
                  preserveClasses
                );

                if (hasChanges) {
                  // Template literal: skip the backticks
                  s.overwrite(quasi.start, quasi.end, transformed);
                  allReplacements.push(...replacements);
                  replacementCount++;
                }
              }
            }
          }
        }
      },

      // Handle string literals in class utility function calls
      CallExpression(path) {
        const node = path.node;
        const callee = node.callee;
        let funcName: string | null = null;

        // Get function name
        if (t.isIdentifier(callee)) {
          funcName = callee.name;
        } else if (t.isMemberExpression(callee) && t.isIdentifier(callee.property)) {
          funcName = callee.property.name;
        }

        if (!funcName) return;

        // Check for ignore comment
        if (hasIgnoreComment(node, comments)) {
          return;
        }

        // Skip preserved functions
        if (isPreservedFunction(funcName, preserveFunctions)) {
          return;
        }

        // Only process class utility functions
        if (!isClassUtilFunction(funcName)) {
          return;
        }

        // Process string literal arguments
        for (const arg of node.arguments) {
          if (t.isStringLiteral(arg) && arg.start != null && arg.end != null) {
            const { transformed, replacements, hasChanges } = transformClassString(
              arg.value,
              mapping,
              preserveClasses
            );

            if (hasChanges) {
              // +1 and -1 to skip the quotes
              s.overwrite(arg.start + 1, arg.end - 1, transformed);
              allReplacements.push(...replacements);
              replacementCount++;
            }
            visited.add(arg);
          }

          // Template literal in function call
          if (t.isTemplateLiteral(arg)) {
            for (const quasi of arg.quasis) {
              if (quasi.start == null || quasi.end == null) continue;
              if (!quasi.value.raw) continue;

              const { transformed, replacements, hasChanges } = transformClassString(
                quasi.value.raw,
                mapping,
                preserveClasses
              );

              if (hasChanges) {
                s.overwrite(quasi.start, quasi.end, transformed);
                allReplacements.push(...replacements);
                replacementCount++;
              }
            }
          }
        }
      },

      // Handle tagged template literals with twIgnore tag
      TaggedTemplateExpression(path) {
        const node = path.node;
        const tag = node.tag;

        // Skip expressions tagged with twIgnore
        if (t.isIdentifier(tag) && tag.name === IGNORE_TAG) {
          path.skip();
          return;
        }
      },

      // Handle object property values for compiled JSX
      ObjectProperty(path) {
        const node = path.node;
        const key = node.key;

        // Check for className or class property
        if (
          (t.isIdentifier(key) && (key.name === "className" || key.name === "class")) ||
          (t.isStringLiteral(key) && (key.value === "className" || key.value === "class"))
        ) {
          // Check for ignore comment
          if (hasIgnoreComment(node, comments)) {
            return;
          }

          const value = node.value;

          if (t.isStringLiteral(value) && value.start != null && value.end != null) {
            const { transformed, replacements, hasChanges } = transformClassString(
              value.value,
              mapping,
              preserveClasses
            );

            if (hasChanges) {
              s.overwrite(value.start + 1, value.end - 1, transformed);
              allReplacements.push(...replacements);
              replacementCount++;
            }
            visited.add(value);
          }
        }
      },

      // Generic catch-all for string literals that look like a Tailwind class
      // list (every space-separated token is in the mapping). Catches:
      //   - const x = "px-4 py-2";  // variable assignments
      //   - { primary: "bg-blue-500 ..." }  // object value not under className
      //   - return "flex items-center";  // returned literals
      // The check `every token in mapping` is the safety net: we never
      // obfuscate a string that contains a single non-mapped token.
      StringLiteral(path) {
        const node = path.node;
        if (node.start == null || node.end == null) return;

        // Skip if a parent visitor already overwrote this node.
        if (visited.has(node)) return;

        // Honour preserveFunctions: if any ancestor is a CallExpression whose
        // callee identifier matches, don't touch strings inside it.
        if (preserveFunctions.size > 0) {
          let cur: typeof path.parentPath | null = path.parentPath;
          while (cur) {
            if (cur.isCallExpression()) {
              const callee = cur.node.callee;
              const calleeName = t.isIdentifier(callee)
                ? callee.name
                : t.isMemberExpression(callee) && t.isIdentifier(callee.property)
                  ? callee.property.name
                  : null;
              if (calleeName && preserveFunctions.has(calleeName)) return;
            }
            cur = cur.parentPath;
          }
        }

        const raw = node.value;
        if (!raw || raw.length < 2 || raw.length > 65536) return;

        // Path A — string that looks like a Tailwind class list. We accept it
        // when (a) the surface only contains class-safe characters and (b) at
        // least 50 % of the tokens are present in the mapping AND there are at
        // least two matched tokens. This catches:
        //   - `const x = "px-4 py-2"`  // pure class lists
        //   - cva variant table entries: `default: "border-transparent bg-primary
        //     text-primary-foreground shadow hover:bg-primary/80"` where one
        //     token (`shadow`) is not in the mapping but the rest must still be
        //     rewritten.
        // The non-mapped tokens are left intact by `transformClassString`.
        if (/^[\s\w:[\]/.@%#&!*+()=,-]+$/.test(raw)) {
          const tokens = raw.split(/\s+/).filter(Boolean);
          if (tokens.length >= 2) {
            let matched = 0;
            for (const tok of tokens) if (mapping.has(tok)) matched++;
            const ratio = matched / tokens.length;
            if (matched >= 2 && ratio >= 0.5) {
              const { transformed, replacements, hasChanges } = transformClassString(
                raw,
                mapping,
                preserveClasses
              );
              if (hasChanges) {
                s.overwrite(node.start + 1, node.end - 1, transformed);
                allReplacements.push(...replacements);
                replacementCount++;
                visited.add(node);
                return;
              }
            }
          } else if (tokens.length === 1 && mapping.has(tokens[0])) {
            // Single-token class strings like `"flex"` — only obfuscate when
            // the token is unambiguously in the mapping.
            const { transformed, replacements, hasChanges } = transformClassString(
              raw,
              mapping,
              preserveClasses
            );
            if (hasChanges) {
              s.overwrite(node.start + 1, node.end - 1, transformed);
              allReplacements.push(...replacements);
              replacementCount++;
              visited.add(node);
              return;
            }
          }
        }

        // Path B — embedded HTML attributes: `<h3 class="text-lg font-bold">`.
        // Vue's static-VNode hoisting and other SSR frameworks emit large HTML
        // strings as plain string literals; rewrite the `class=` / `className=`
        // values without touching the surrounding markup. Operate on the
        // SOURCE substring between the quotes (escape-preserving) rather than
        // on `node.value` — Babel decodes `\n` / `\"` etc. back to literal
        // characters, and writing the decoded form back into the source
        // produces invalid JS (the very bug Rolldown / Vite 8 catches).
        const sourceContent = s.original.slice(node.start + 1, node.end - 1);
        if (/(?:^|\s)(?:class|className)\s*=\s*["']/.test(sourceContent)) {
          const attrRe = /\b(class|className)\s*=\s*(["'])([^"']*)\2/g;
          let replaced = 0;
          const replacedHere: string[] = [];
          const mutated = sourceContent.replace(attrRe, (match, attr, quote, value) => {
            const { transformed, replacements, hasChanges } = transformClassString(
              value,
              mapping,
              preserveClasses
            );
            if (!hasChanges) return match;
            replaced++;
            replacedHere.push(...replacements);
            return `${attr}=${quote}${transformed}${quote}`;
          });
          if (replaced > 0) {
            s.overwrite(node.start + 1, node.end - 1, mutated);
            allReplacements.push(...replacedHere);
            replacementCount += replaced;
            visited.add(node);
          }
        }
      },

      // Template literal text that contains embedded HTML attributes
      // (`class="..."` / `className="..."`). This is the SSR path used by
      // Nuxt/Nitro, server-rendered Vue SFCs, and any framework that emits
      // markup as a JS template string.
      TemplateElement(path) {
        const node = path.node;
        if (node.start == null || node.end == null) return;
        if (visited.has(node)) return;
        const raw = node.value.raw;
        if (!raw || !/(?:^|\s)(?:class|className)\s*=\s*["']/.test(raw)) return;

        const attrRe = /\b(class|className)\s*=\s*(["'])([^"']*)\2/g;
        let mutated = raw;
        let replaced = 0;
        const replacedHere: string[] = [];
        mutated = mutated.replace(attrRe, (match, attr, quote, value) => {
          const { transformed, replacements, hasChanges } = transformClassString(
            value,
            mapping,
            preserveClasses
          );
          if (!hasChanges) return match;
          replaced++;
          replacedHere.push(...replacements);
          return `${attr}=${quote}${transformed}${quote}`;
        });
        if (replaced === 0) return;
        s.overwrite(node.start, node.end, mutated);
        allReplacements.push(...replacedHere);
        replacementCount += replaced;
        visited.add(node);
      },
    });
  } catch (e) {
    // If AST parsing fails, fall back to the regex-based transformer rather
    // than silently shipping unobfuscated output. This matters for post-build
    // bundles (Nitro server.mjs, Vue SSR chunks) whose minified syntax often
    // exceeds what `@babel/parser` can handle.
    if (process.env.TW_OBFUSCATOR_DEBUG_AST) {
      console.warn(`[tw-obfuscator] AST parse fell back for ${filePath}:`, (e as Error).message);
    }
    return transformJsx(content, filePath, mapping, { sourcemap: options.sourcemap });
  }

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
 * Create an AST transformer with resolved options
 */
export function createAstTransformer(resolvedOptions: ResolvedObfuscatorOptions) {
  return (content: string, filePath: string, mapping: Map<string, string>): TransformResult => {
    return transformJsxAst(content, filePath, mapping, {
      sourcemap: resolvedOptions.sourcemap,
      preserveFunctions: resolvedOptions.preserve.functions,
      preserveClasses: resolvedOptions.preserve.classes,
    });
  };
}
