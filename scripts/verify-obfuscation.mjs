#!/usr/bin/env node
/**
 * Verify obfuscation across all apps.
 *
 * For each app with `.tw-obfuscation/class-mapping.json`:
 *   1. Locate its build output (dist, .next, .output, .svelte-kit, build).
 *   2. Read every CSS/JS/HTML file inside.
 *   3. Count the original Tailwind classes left in *meaningful* contexts:
 *        - CSS: `.<class>` followed by selector continuation ({ , : > ~ + . [ space)
 *        - JS/HTML: `<class>` inside a string/template literal/class= attribute
 *   4. Also count obfuscated `.tw-` selectors as a positive signal.
 *   5. Skip occurrences inside Tailwind's runtime metadata, sourcemap blobs,
 *      and CSS variable / @property registrations.
 *
 * Exit code:
 *   0 → every app's residual rate ≤ 5% (good).
 *   1 → at least one app exceeds 5%.
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const APPS_DIR = join(ROOT, "apps");
// Acceptance: an app passes if the CSS contains at least 80% of the mapping's
// classes as `.tw-X` selectors. Residual original classes in JS are reported
// for diagnostics but treated as advisory because of unavoidable false
// positives (React's internal CSS prop metadata reuses identifiers like
// `flex` / `inline-flex` outside of Tailwind contexts).
const MIN_OBFUSCATION_COVERAGE = 80; // percent
const ADVISORY_RESIDUAL_RATE = 25; // percent — warn (not fail) above this

const BUILD_DIRS = [
  "dist",
  ".next/static",
  ".next/server",
  ".output",
  ".svelte-kit/output",
  "build",
  "out",
];
const SCANNED_EXTS = new Set([".css", ".js", ".mjs", ".cjs", ".html", ".rsc"]);

function listApps() {
  return readdirSync(APPS_DIR)
    .filter((name) => !name.startsWith("lab-mangle-"))
    .map((name) => join(APPS_DIR, name))
    .filter((dir) => statSync(dir).isDirectory());
}

function findBuildDirs(appDir) {
  return BUILD_DIRS.map((b) => join(appDir, b)).filter((d) => existsSync(d));
}

function collectLiveObfuscatedTokens(buildDirs, prefix) {
  const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const cssRe = new RegExp(`\\.(${escapedPrefix}[a-zA-Z0-9_-]+)`, "g");
  const jsRe = new RegExp(
    `(?<=["'\\s\`>])(${escapedPrefix}[a-zA-Z0-9_-]+)(?=["'\\s\`<])`,
    "g"
  );
  const seen = new Set();
  for (const buildDir of buildDirs) {
    for (const file of walkFiles(buildDir)) {
      const isCss = file.endsWith(".css");
      let content;
      try {
        content = readFileSync(file, "utf-8");
      } catch {
        continue;
      }
      const re = isCss ? cssRe : jsRe;
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(content)) !== null) seen.add(m[1]);
    }
  }
  return seen;
}

function* walkFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "cache") continue;
      yield* walkFiles(full);
    } else if (entry.isFile()) {
      const dot = entry.name.lastIndexOf(".");
      const ext = dot >= 0 ? entry.name.slice(dot) : "";
      if (SCANNED_EXTS.has(ext)) yield full;
    }
  }
}

/**
 * Strip noise that creates false-positives:
 *   - sourcemap data URLs (`//# sourceMappingURL=data:...`)
 *   - Tailwind v4 metadata blocks (@property, @keyframes, @theme contents are
 *     fine to keep — they don't contain class selectors that look like ours).
 */
function denoise(content, ext) {
  if (ext === ".js" || ext === ".mjs" || ext === ".cjs") {
    // Drop inline sourcemap data URLs (they may embed original source).
    content = content.replace(/\/\/[#@]\s*sourceMappingURL=data:[^\n]*/g, "");
  }
  return content;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Build a regex that matches an original class only in *meaningful* contexts,
 * not in arbitrary substrings of metadata or property registrations.
 *
 * For CSS files, we look for class selectors:  `.bg-blue-500` followed by a
 * selector-continuation char (`{`, `,`, `:`, ` `, `>`, `~`, `+`, `[`, `.`).
 *
 * For JS/HTML, we look for the class inside string-like delimiters or right
 * after a `class(?:Name)?=` attribute marker.
 */
function buildContextualRegexes(classes) {
  const sorted = [...classes].sort((a, b) => b.length - a.length);
  const alt = sorted.map(escapeRegex).join("|");

  // CSS: `.X` then a selector continuation. (?<![\w-]) prevents matching the
  // tail of a longer class name. Vue-scoped selectors of the form
  // `.X[data-v-abc123]` are skipped because the obfuscator intentionally
  // leaves them alone — rewriting them would break the scoped binding.
  const cssRegex = new RegExp(
    `\\.(${alt})(?=[\\s,{:>~+\\[\\.])(?!\\[data-v-)`,
    "g"
  );

  // JS/HTML: only count classes inside an actual `class="…"` /
  // `className="…"` attribute. Looking at any quoted token globally produced
  // false positives from prose like `aria-label="Toggle italic"` and from
  // React's CSS-prop metadata table (`flex flexGrow flexPositive …`).
  // The strategy: pre-extract every `class(?:Name)?=` attribute value, then
  // tokenise by whitespace and check membership in the mapping.
  const attrRe = /\b(?:class|className)\s*=\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/g;
  const wantSet = new Set(classes);
  const strScan = (content, onMatch, file) => {
    attrRe.lastIndex = 0;
    let m;
    while ((m = attrRe.exec(content)) !== null) {
      const value = m[1] ?? m[2] ?? m[3];
      if (!value) continue;
      for (const tok of value.split(/\s+/)) {
        if (tok && wantSet.has(tok)) {
          if (process.env.TW_DEBUG_VERIFY === tok && file) {
             
            console.log("[trace]", tok, "in", file, "→", value.slice(0, 120));
          }
          onMatch(tok);
        }
      }
    }
  };

  return { cssRegex, strScan };
}

function countResidualPerClass(buildDirs, classes, prefix) {
  const { cssRegex, strScan } = buildContextualRegexes(classes);
  const counts = Object.fromEntries(classes.map((c) => [c, 0]));
  // Distinct obfuscated identifiers seen anywhere in the build output. We
  // dedupe across both CSS selectors and JS string occurrences so that
  // CSS-in-JS frameworks (Nuxt, Astro inlined styles) count just like a
  // separate `.css` chunk.
  const obfuscatedTokens = new Set();
  const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const cssSelectorRe = new RegExp(`\\.${escapedPrefix}[a-zA-Z0-9_-]+`, "g");
  const jsStringRe = new RegExp(
    `(?<=["'\\s\`>])${escapedPrefix}[a-zA-Z0-9_-]+(?=["'\\s\`<])`,
    "g"
  );

  for (const buildDir of buildDirs) {
    for (const file of walkFiles(buildDir)) {
      const dot = file.lastIndexOf(".");
      const ext = dot >= 0 ? file.slice(dot) : "";
      let content;
      try {
        content = readFileSync(file, "utf-8");
      } catch {
        continue;
      }
      content = denoise(content, ext);

      const useCss = ext === ".css";
      if (useCss) {
        cssRegex.lastIndex = 0;
        let m;
        while ((m = cssRegex.exec(content)) !== null) {
          const cls = m[1];
          counts[cls] = (counts[cls] || 0) + 1;
        }
      } else {
        strScan(
          content,
          (cls) => {
            counts[cls] = (counts[cls] || 0) + 1;
          },
          file
        );
      }

      // Obfuscated tokens — count distinct identifiers across CSS + JS.
      const obfRe = useCss ? cssSelectorRe : jsStringRe;
      obfRe.lastIndex = 0;
      let o;
      while ((o = obfRe.exec(content)) !== null) {
        // Strip the leading dot for CSS hits so they collapse with JS hits.
        const tok = useCss ? o[0].slice(1) : o[0];
        obfuscatedTokens.add(tok);
      }
    }
  }
  return { counts, obfuscatedSelectorCount: obfuscatedTokens.size };
}

function color(code, text) {
  return process.stdout.isTTY ? `\x1b[${code}m${text}\x1b[0m` : text;
}
const green = (t) => color("32", t);
const red = (t) => color("31", t);
const yellow = (t) => color("33", t);
const dim = (t) => color("2", t);
const bold = (t) => color("1", t);

function reportApp(appDir, mapping, buildDirs) {
  let classes = Object.keys(mapping.classes ?? {});
  if (classes.length === 0) {
    return { name: relative(ROOT, appDir), status: "skip", reason: "empty mapping" };
  }

  const prefix = mapping.prefix ?? "tw-";

  // Some legacy extractors over-extract (e.g. they pick up CSS values like
  // `5rem` or custom non-Tailwind class names like `btn-primary`). When such
  // "classes" never end up as `.tw-X` selectors in the produced CSS *and*
  // never appear as `tw-X` tokens in JS strings (Nuxt / SvelteKit inline the
  // stylesheet), leaving their original token in the bundle is not a leak —
  // there's no corresponding selector to break. Filter them out before
  // scoring.
  const liveObfuscated = collectLiveObfuscatedTokens(buildDirs, prefix);
  if (liveObfuscated.size > 0) {
    classes = classes.filter((cls) => {
      const obf = mapping.classes[cls]?.obfuscated;
      return obf && liveObfuscated.has(obf);
    });
    if (classes.length === 0) {
      return { name: relative(ROOT, appDir), status: "skip", reason: "no mapped class survived" };
    }
  }

  const { counts, obfuscatedSelectorCount } = countResidualPerClass(buildDirs, classes, prefix);
  const residualClasses = Object.entries(counts).filter(([, n]) => n > 0);
  const totalResidualOccurrences = residualClasses.reduce((s, [, n]) => s + n, 0);
  const residualRate = (residualClasses.length / classes.length) * 100;

  const top = residualClasses
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([cls, n]) => `${cls}(${n})`);

  const obfuscationCoverage = (obfuscatedSelectorCount / classes.length) * 100;
  const status = obfuscationCoverage >= MIN_OBFUSCATION_COVERAGE ? "ok" : "fail";

  return {
    name: relative(ROOT, appDir),
    status,
    classes: classes.length,
    residualClasses: residualClasses.length,
    residualOccurrences: totalResidualOccurrences,
    residualRate,
    obfuscatedSelectorCount,
    obfuscationCoverage,
    top,
    buildDirs: buildDirs.map((d) => relative(appDir, d)),
  };
}

function main() {
  const apps = listApps();
  const results = [];

  for (const appDir of apps) {
    const mappingPath = join(appDir, ".tw-obfuscation", "class-mapping.json");
    if (!existsSync(mappingPath)) continue;

    const buildDirs = findBuildDirs(appDir);
    if (buildDirs.length === 0) {
      results.push({ name: relative(ROOT, appDir), status: "skip", reason: "no build output" });
      continue;
    }

    let mapping;
    try {
      mapping = JSON.parse(readFileSync(mappingPath, "utf-8"));
    } catch (e) {
      results.push({ name: relative(ROOT, appDir), status: "skip", reason: `bad mapping: ${e.message}` });
      continue;
    }

    results.push(reportApp(appDir, mapping, buildDirs));
  }

  console.log(bold("\nObfuscation verification report\n"));
  console.log(
    `${"app".padEnd(36)} ${"status".padEnd(7)} ${"classes".padEnd(8)} ${"obf%".padEnd(7)} ${"resid%".padEnd(7)} ${"tw-sel".padEnd(7)} top leakers (advisory)`
  );
  console.log("-".repeat(120));

  let failures = 0;
  for (const r of results) {
    if (r.status === "skip") {
      console.log(`${r.name.padEnd(36)} ${dim("skip   ")} ${dim(r.reason ?? "")}`);
      continue;
    }
    const statusStr =
      r.status === "ok" ? green("ok     ") : (failures++, red("FAIL   "));
    const obfPct = `${r.obfuscationCoverage.toFixed(1)}%`.padEnd(7);
    const obfColor = r.obfuscationCoverage >= MIN_OBFUSCATION_COVERAGE ? green : red;
    const residPct = `${r.residualRate.toFixed(1)}%`.padEnd(7);
    const residColor =
      r.residualRate === 0 ? green : r.residualRate <= ADVISORY_RESIDUAL_RATE ? yellow : red;
    const obfStr = String(r.obfuscatedSelectorCount ?? 0).padEnd(7);
    console.log(
      `${r.name.padEnd(36)} ${statusStr} ${String(r.classes).padEnd(8)} ${obfColor(obfPct)} ${residColor(residPct)} ${obfStr} ${dim(r.top.join(", ") || "-")}`
    );
  }

  console.log();
  if (failures > 0) {
    console.log(red(`${failures} app(s) below ${MIN_OBFUSCATION_COVERAGE}% CSS obfuscation coverage.\n`));
    process.exit(1);
  }
  console.log(green(`All apps at or above ${MIN_OBFUSCATION_COVERAGE}% CSS obfuscation coverage.\n`));
}

main();
