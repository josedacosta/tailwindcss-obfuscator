/**
 * Transformers for tailwindcss-obfuscator
 */

import * as fs from "fs";
import * as path from "path";
import type { TransformResult, TransformerFn, PluginContext, Logger } from "../core/types.js";
import { transformCss, transformTailwindV4Css, isCssContent } from "./css.js";
import { transformHtml } from "./html.js";
import { transformJsx, transformCompiledJsx, isCompiledOutput } from "./jsx.js";
import { transformJsxAst } from "./jsx-ast.js";
import { transformCssPostcss, transformTailwindV4CssPostcss } from "./css-postcss.js";

export { transformCss, transformTailwindV4Css, isCssContent } from "./css.js";
export { transformHtml, transformHtmlWithDataAttrs } from "./html.js";
export { transformJsx, transformCompiledJsx, isCompiledOutput } from "./jsx.js";
export { transformJsxAst, createAstTransformer } from "./jsx-ast.js";
export {
  transformCssPostcss,
  transformTailwindV4CssPostcss,
  createPostcssTransformer,
} from "./css-postcss.js";

/**
 * Get file extension without the dot
 */
function getExtension(filePath: string): string {
  return path.extname(filePath).toLowerCase().slice(1);
}

/**
 * Get the appropriate transformer for a file
 */
export function getTransformer(
  filePath: string,
  content: string,
  ctx: PluginContext
): TransformerFn | null {
  const ext = getExtension(filePath);
  const { useAst, usePostcss, sourcemap, preserve, ignoreVueScoped } = ctx.options;

  switch (ext) {
    case "css":
      return (content, filePath, mapping) => {
        // Use PostCSS-based transformer if enabled
        if (usePostcss) {
          if (ctx.detectedTailwindVersion === "4") {
            return transformTailwindV4CssPostcss(content, filePath, mapping, {
              sourcemap,
              ignoreVueScoped,
              preserveClasses: preserve.classes,
            });
          }
          return transformCssPostcss(content, filePath, mapping, {
            sourcemap,
            ignoreVueScoped,
            preserveClasses: preserve.classes,
          });
        }

        // Fallback to regex-based transformer
        if (ctx.detectedTailwindVersion === "4") {
          return transformTailwindV4Css(content, filePath, mapping, {
            sourcemap,
          });
        }
        return transformCss(content, filePath, mapping, {
          sourcemap,
        });
      };

    case "html":
    case "htm":
      return (content, filePath, mapping) => {
        return transformHtml(content, filePath, mapping, {
          sourcemap,
        });
      };

    case "js":
    case "mjs":
    case "cjs":
      // For JS files, check if it's compiled output or has CSS content
      if (isCssContent(content)) {
        return (content, filePath, mapping) => {
          if (usePostcss) {
            return transformCssPostcss(content, filePath, mapping, {
              sourcemap,
              ignoreVueScoped,
              preserveClasses: preserve.classes,
            });
          }
          return transformCss(content, filePath, mapping, {
            sourcemap,
          });
        };
      }
      return (content, filePath, mapping) => {
        // Use AST-based transformer if enabled
        if (useAst) {
          return transformJsxAst(content, filePath, mapping, {
            sourcemap,
            preserveFunctions: preserve.functions,
            preserveClasses: preserve.classes,
          });
        }

        if (isCompiledOutput(content)) {
          return transformCompiledJsx(content, filePath, mapping, {
            sourcemap,
          });
        }
        return transformJsx(content, filePath, mapping, {
          sourcemap,
        });
      };

    case "jsx":
    case "tsx":
    case "ts":
      return (content, filePath, mapping) => {
        // Use AST-based transformer if enabled
        if (useAst) {
          return transformJsxAst(content, filePath, mapping, {
            sourcemap,
            preserveFunctions: preserve.functions,
            preserveClasses: preserve.classes,
          });
        }
        return transformJsx(content, filePath, mapping, {
          sourcemap,
        });
      };

    case "vue":
    case "svelte":
    case "astro":
      // These formats have both template and script sections
      return (content, filePath, mapping) => {
        // Use AST-based transformer if enabled
        if (useAst) {
          return transformJsxAst(content, filePath, mapping, {
            sourcemap,
            preserveFunctions: preserve.functions,
            preserveClasses: preserve.classes,
          });
        }
        return transformJsx(content, filePath, mapping, {
          sourcemap,
        });
      };

    default:
      return null;
  }
}

/**
 * Transform a single file
 */
export async function transformFile(
  filePath: string,
  ctx: PluginContext,
  _logger: Logger
): Promise<TransformResult | null> {
  try {
    const content = await fs.promises.readFile(filePath, "utf-8");
    const transformer = getTransformer(filePath, content, ctx);

    if (!transformer) {
      return null;
    }

    const result = await transformer(content, filePath, ctx.classMap);
    return result;
  } catch {
    return {
      original: "",
      transformed: "",
      replacements: 0,
      replacedClasses: [],
    };
  }
}

/**
 * Transform content directly (for build plugins)
 */
export function transformContent(
  content: string,
  filePath: string,
  ctx: PluginContext
): TransformResult {
  const transformer = getTransformer(filePath, content, ctx);

  if (!transformer) {
    return {
      original: content,
      transformed: content,
      replacements: 0,
      replacedClasses: [],
    };
  }

  return transformer(content, filePath, ctx.classMap) as TransformResult;
}

/**
 * Transform multiple files in a directory
 */
export async function transformDirectory(
  dir: string,
  ctx: PluginContext,
  logger: Logger,
  extensions: string[] = ["css", "html", "js"]
): Promise<{
  filesProcessed: number;
  totalReplacements: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let filesProcessed = 0;
  let totalReplacements = 0;

  async function processDir(currentDir: string): Promise<void> {
    const entries = await fs.promises.readdir(currentDir, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        // Skip common ignored directories
        if (entry.name === "node_modules" || entry.name === ".git" || entry.name === ".next") {
          continue;
        }
        await processDir(fullPath);
      } else if (entry.isFile()) {
        const ext = getExtension(entry.name);
        if (extensions.includes(ext)) {
          try {
            const result = await transformFile(fullPath, ctx, logger);

            if (result && result.replacements > 0) {
              // Write transformed content back
              await fs.promises.writeFile(fullPath, result.transformed);

              filesProcessed++;
              totalReplacements += result.replacements;

              logger.debug(
                `  ${path.relative(dir, fullPath)}: ${result.replacements} replacements`
              );
            }
          } catch (error) {
            const message = `Error processing ${fullPath}: ${error instanceof Error ? error.message : String(error)}`;
            errors.push(message);
            logger.warn(message);
          }
        }
      }
    }
  }

  await processDir(dir);

  return { filesProcessed, totalReplacements, errors };
}

/**
 * No-op transformer for passthrough
 */
export function noopTransformer(
  content: string,
  _filePath: string,
  _mapping: Map<string, string>
): TransformResult {
  return {
    original: content,
    transformed: content,
    replacements: 0,
    replacedClasses: [],
  };
}
