#!/usr/bin/env node
/**
 * Tests-existence gate (release-safety v2).
 *
 * For every shipped source file under `packages/tailwindcss-obfuscator/src/**`,
 * verify that at least one test file under `packages/tailwindcss-obfuscator/tests/**`
 * references it (by import path, dynamic import, or path-string assertion).
 *
 * The goal is NOT to measure coverage % — that's already vitest's job
 * (PR #84). The goal is the boolean: "does this src file have at least
 * one test that talks about it?". A new feature landing without any
 * test reference is a regression of the project's "every feature ships
 * with tests" rule (CLAUDE.md ULTRA-IMPORTANT).
 *
 * Exit codes:
 *   0  every src file has at least one test reference (or is allowlisted)
 *   1  one or more src files have zero references
 *
 * Excluded by design (already covered by other gates):
 *   - src/cli/**       → exercised by .github/scripts/test-tarball.sh
 *   - src/plugins/**   → exercised by scripts/verify-obfuscation.mjs
 *   - src/**\/*.d.ts   → declaration files, no behavior
 *
 * Allowlisted (re-exports / barrels — implicitly tested via their exports):
 *   - src/index.ts
 *   - src/internals.ts
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

// Anchor on this script's location, not process.cwd(), so the gate works
// when invoked from anywhere (e.g. `cd packages/foo && node ../../scripts/...`).
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PKG = join(ROOT, "packages", "tailwindcss-obfuscator");
const SRC = join(PKG, "src");
const TESTS = join(PKG, "tests");

const EXCLUDE_DIRS = new Set(["cli", "plugins"]);

/**
 * Files that the gate intentionally lets through. Each entry needs a
 * one-line justification — "why is this transitively tested ?".
 *
 * The gate's purpose is to catch BRAND-NEW src files landing without
 * any test. It is NOT a coverage tool — vitest's threshold gate (PR
 * #84) is. So files that are exercised end-to-end by integration tests
 * but never imported by name from a test belong here.
 */
const ALLOWLIST = new Map([
  // Root barrel files — pure re-exports, exercised via every named export.
  ["index.ts", "umbrella public API re-export"],
  ["internals.ts", "internals re-export consumed by plugin adapters"],
  // Pattern files — pure data + helpers exercised by every extractor /
  // transformer integration test (see comprehensive-patterns.test.ts,
  // tailwind-v4-patterns.test.ts, jsx-transformer.test.ts). A typo in
  // any of these arrays would fail those integration tests in CI.
  ["core/patterns/regex.ts", "regex constants exercised via extractors"],
  ["core/patterns/utilities.ts", "static utility set exercised via tailwind-v4-patterns.test"],
  ["core/patterns/variants.ts", "variant prefixes exercised via comprehensive-patterns.test"],
  // Tailwind config validator — exercised via the integration suite
  // (verify-obfuscation.mjs runs each test app with this active).
  ["core/tailwind-validator.ts", "config validator exercised via verify-obfuscation.mjs"],
]);

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) {
      const rel = relative(SRC, p).split(sep)[0];
      if (EXCLUDE_DIRS.has(rel)) continue;
      out.push(...walk(p));
    } else if (entry.endsWith(".ts") && !entry.endsWith(".d.ts")) {
      out.push(p);
    }
  }
  return out;
}

const allTestSources = (function readAllTests() {
  const out = [];
  function rec(dir) {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      const s = statSync(p);
      if (s.isDirectory()) rec(p);
      else if (entry.endsWith(".ts") || entry.endsWith(".mjs") || entry.endsWith(".js")) {
        out.push(readFileSync(p, "utf8"));
      }
    }
  }
  rec(TESTS);
  return out.join("\n=====\n");
})();

const missing = [];

/**
 * Extract every `export …` symbol declared in a src file. Recognises:
 *   export const foo
 *   export function foo
 *   export class foo
 *   export interface foo
 *   export type foo
 *   export enum foo
 *   export { foo, bar as baz }
 *   export { foo, bar } from "..."
 *   export default …            (skipped — anonymous default isn't a name)
 */
function extractExports(file) {
  const src = readFileSync(file, "utf8");
  const names = new Set();
  for (const m of src.matchAll(
    /^\s*export\s+(?:async\s+)?(?:const|function|class|interface|type|enum)\s+([A-Za-z_$][\w$]*)/gm
  )) {
    names.add(m[1]);
  }
  for (const m of src.matchAll(/^\s*export\s*\{([^}]*)\}/gm)) {
    for (const piece of m[1].split(",")) {
      const id = piece
        .trim()
        .split(/\s+as\s+/)
        .pop();
      if (id && /^[A-Za-z_$][\w$]*$/.test(id)) names.add(id);
    }
  }
  return [...names];
}

for (const file of walk(SRC)) {
  const rel = relative(SRC, file); // e.g. "extractors/jsx.ts"
  const relPosix = rel.split(sep).join("/");
  const baseName = rel.split(sep).pop();
  // Allowlist by full posix path (e.g. "core/patterns/utilities.ts") OR
  // by basename when the file lives at src/ root (index.ts, internals.ts).
  if (ALLOWLIST.has(relPosix)) continue;
  if (ALLOWLIST.has(baseName) && !rel.includes(sep)) continue;

  const noExt = rel.replace(/\.ts$/, "").split(sep).join("/");
  // Strong signal — a test imports the file directly.
  const directRefPatterns = [
    `${noExt}"`, // `from "../src/extractors/jsx"`
    `${noExt}'`, // `from '../src/extractors/jsx'`
    `src/${noExt}`, // path-string assertions mentioning the src path
  ];
  if (directRefPatterns.some((p) => allTestSources.includes(p))) continue;

  // Weaker signal — at least one of the file's named exports appears
  // as a whole word in some test file. Catches transitively-tested
  // modules re-exported through src/index.ts (most of src/core/patterns/**).
  // Word boundaries are required because a substring match (e.g. "map"
  // matching "bitmap") would silently mark a genuinely untested file
  // as covered.
  const exports = extractExports(file);
  if (exports.length > 0 && exports.some((id) => new RegExp(`\\b${id}\\b`).test(allTestSources)))
    continue;

  missing.push(rel.split(sep).join("/"));
}

if (missing.length === 0) {
  console.log(
    "✓ Every src file under packages/tailwindcss-obfuscator/src/** has at least one test reference."
  );
  process.exit(0);
}

console.error("✗ The following src files have ZERO test references:\n");
for (const f of missing) console.error("  - packages/tailwindcss-obfuscator/src/" + f);
console.error("\nEvery feature must ship with tests (CLAUDE.md ULTRA-IMPORTANT rule).");
console.error("Add a test that imports the file, or — if the file is a pure re-export / barrel —");
console.error("add it to ALLOWLIST in scripts/check-tests-coverage.mjs with a justifying comment.");
process.exit(1);
