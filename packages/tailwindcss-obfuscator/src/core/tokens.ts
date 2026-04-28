/**
 * Token extraction with position metadata
 */

import * as fs from "fs";
import * as path from "path";
import type { TokenLocation, TokenReport, PluginContext } from "./types.js";

/**
 * Build line offsets for a content string
 * Returns an array where index i contains the character offset of line i
 */
function buildLineOffsets(content: string): number[] {
  const offsets: number[] = [0];
  for (let i = 0; i < content.length; i++) {
    if (content[i] === "\n") {
      offsets.push(i + 1);
    }
  }
  return offsets;
}

/**
 * Resolve line and column from character offset
 */
function resolveLineMeta(offset: number, lineOffsets: number[]): { line: number; column: number } {
  // Binary search for the line
  let low = 0;
  let high = lineOffsets.length - 1;

  while (low < high) {
    const mid = Math.floor((low + high + 1) / 2);
    if (lineOffsets[mid] <= offset) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }

  return {
    line: low + 1, // 1-indexed
    column: offset - lineOffsets[low] + 1, // 1-indexed
  };
}

/**
 * Get the text of a specific line
 */
function getLineText(content: string, lineOffsets: number[], line: number): string {
  const startOffset = lineOffsets[line - 1] ?? 0;
  const endOffset = lineOffsets[line] ?? content.length;
  return content.slice(startOffset, endOffset).replace(/\n$/, "");
}

/**
 * Regular expressions for finding class candidates in different contexts
 */
const CLASS_PATTERNS = [
  // class="..." or className="..."
  /(?:class|className)\s*=\s*["']([^"']+)["']/g,
  // class={`...`} or className={`...`}
  /(?:class|className)\s*=\s*\{`([^`]+)`\}/g,
  // cn(...), clsx(...), classnames(...)
  /(?:cn|clsx|classnames|classNames|twMerge|cva|tv)\s*\(([^)]+)\)/g,
  // CSS selectors
  /\.([a-zA-Z_-][\w-]*)/g,
];

/**
 * Extract class candidates from content with positions
 */
export function extractWithPositions(content: string, filePath: string): TokenLocation[] {
  const tokens: TokenLocation[] = [];
  const lineOffsets = buildLineOffsets(content);

  for (const pattern of CLASS_PATTERNS) {
    // Reset regex lastIndex
    pattern.lastIndex = 0;

    let match: RegExpExecArray | null;
    while ((match = pattern.exec(content)) !== null) {
      const matchedText = match[1] || match[0];
      const matchOffset = match.index;

      // Split by whitespace to get individual classes
      const classes = matchedText.split(/\s+/).filter((c) => c.length > 0);

      let currentOffset = matchOffset;
      for (const cls of classes) {
        // Skip non-class strings (strings with special chars, etc.)
        if (!/^[a-zA-Z_-][\w:.\-/[\]#%()]+$/.test(cls)) {
          currentOffset += cls.length + 1;
          continue;
        }

        // Remove quotes if present
        const cleanCls = cls.replace(/^["'`]|["'`]$/g, "");
        if (!cleanCls) {
          currentOffset += cls.length + 1;
          continue;
        }

        // Find the actual position in the content
        const clsOffset = content.indexOf(cleanCls, currentOffset);
        if (clsOffset === -1) {
          currentOffset += cls.length + 1;
          continue;
        }

        const { line, column } = resolveLineMeta(clsOffset, lineOffsets);
        const lineText = getLineText(content, lineOffsets, line);

        tokens.push({
          rawCandidate: cleanCls,
          file: filePath,
          line,
          column,
          lineText,
        });

        currentOffset = clsOffset + cleanCls.length;
      }
    }
  }

  // Deduplicate tokens (same class at same position)
  const seen = new Set<string>();
  return tokens.filter((token) => {
    const key = `${token.file}:${token.line}:${token.column}:${token.rawCandidate}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Extract tokens from a file
 */
export function extractTokensFromFile(filePath: string): TokenLocation[] {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return extractWithPositions(content, filePath);
  } catch {
    return [];
  }
}

/**
 * Extract tokens from multiple files
 */
export function extractTokensFromFiles(filePaths: string[], sources: string[] = []): TokenReport {
  const allTokens: TokenLocation[] = [];
  const skipped: Array<{ file: string; reason: string }> = [];
  let processedCount = 0;

  for (const filePath of filePaths) {
    try {
      if (!fs.existsSync(filePath)) {
        skipped.push({ file: filePath, reason: "File not found" });
        continue;
      }

      const stat = fs.statSync(filePath);
      if (!stat.isFile()) {
        skipped.push({ file: filePath, reason: "Not a file" });
        continue;
      }

      // Skip very large files
      if (stat.size > 1024 * 1024) {
        // 1MB
        skipped.push({ file: filePath, reason: "File too large" });
        continue;
      }

      const tokens = extractTokensFromFile(filePath);
      allTokens.push(...tokens);
      processedCount++;
    } catch (error) {
      skipped.push({
        file: filePath,
        reason: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return {
    tokens: allTokens,
    fileCount: processedCount,
    sources,
    skipped: skipped.length > 0 ? skipped : undefined,
  };
}

/**
 * Group tokens by file
 */
export function groupTokensByFile(
  report: TokenReport,
  options: { relativeTo?: string } = {}
): Map<string, TokenLocation[]> {
  const grouped = new Map<string, TokenLocation[]>();

  for (const token of report.tokens) {
    let filePath = token.file;

    if (options.relativeTo) {
      filePath = path.relative(options.relativeTo, filePath).split(path.sep).join("/");
    }

    const existing = grouped.get(filePath) || [];
    existing.push(token);
    grouped.set(filePath, existing);
  }

  return grouped;
}

/**
 * Collect tokens and add to context
 */
export function collectTokens(
  ctx: PluginContext,
  filePaths: string[],
  sources: string[] = []
): TokenReport {
  if (!ctx.options.trackPositions) {
    return {
      tokens: [],
      fileCount: 0,
      sources,
    };
  }

  const report = extractTokensFromFiles(filePaths, sources);
  ctx.tokenReport = report;
  return report;
}

/**
 * Get token locations for a specific class
 */
export function getTokenLocations(ctx: PluginContext, className: string): TokenLocation[] {
  if (!ctx.tokenReport) {
    return [];
  }

  return ctx.tokenReport.tokens.filter((token) => token.rawCandidate === className);
}
