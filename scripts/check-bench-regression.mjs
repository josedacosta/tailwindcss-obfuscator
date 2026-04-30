#!/usr/bin/env node
/**
 * Performance regression gate (release-safety #6).
 *
 * Runs the vitest benches via a child process, parses the textual ops/sec
 * (hz) per benchmark from the output, then compares each against the
 * committed baseline at packages/tailwindcss-obfuscator/tests/bench/baseline.json.
 *
 * Fails (exit 1) if any benchmark drops below baseline by more than
 * `regressionThresholdPct` (currently 25%) — forcing the maintainer to
 * either revert the perf-degrading commit or consciously update the
 * baseline in the same PR (which logs the new floor in git history).
 *
 * Usage
 * ─────
 * - Verify mode (default, used in CI):
 *     node scripts/check-bench-regression.mjs
 *
 * - Update mode (after a deliberate perf change, eg. an algorithm rewrite):
 *     node scripts/check-bench-regression.mjs --update
 *
 * Why textual parsing
 * ───────────────────
 * vitest's --reporter=json emits an empty payload for `bench` (only test
 * counts, no benchmark data — confirmed against vitest 4.1.5). The
 * textual output is the only stable, parseable surface today. The
 * parser below extracts `name` + `hz` from lines like:
 *     · extractFromJsx (80 cards)      659.10  1.3708 ...
 * If this format changes upstream, the script will fail to parse and
 * the test will warn loudly.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const PACKAGE_DIR = path.join(REPO_ROOT, "packages", "tailwindcss-obfuscator");
const BASELINE_PATH = path.join(PACKAGE_DIR, "tests", "bench", "baseline.json");

const args = new Set(process.argv.slice(2));
const UPDATE = args.has("--update") || args.has("-u");

const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8"));
const THRESHOLD_PCT = baseline.regressionThresholdPct ?? 25;

console.log("");
console.log("Performance regression gate");
console.log("baseline:", path.relative(REPO_ROOT, BASELINE_PATH));
console.log("threshold:", `${THRESHOLD_PCT}% drop = fail`);
console.log("─".repeat(80));

console.log("Running vitest bench…");
let stdout;
try {
  stdout = execSync("pnpm exec vitest bench --run", {
    cwd: PACKAGE_DIR,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
    env: { ...process.env, FORCE_COLOR: "0" },
  });
} catch (e) {
  console.error("❌ vitest bench failed to run:", e.message);
  process.exit(1);
}

// Parse lines like:
//   · extractFromJsx (80 cards)      659.10  1.3708  3.9290  1.5172 ...
const benchLineRe = /^\s*·\s*(.+?)\s+([\d,]+(?:\.\d+)?)\s+\d/gm;
const observed = {};
let m;
while ((m = benchLineRe.exec(stdout)) !== null) {
  const name = m[1].trim();
  const hz = parseFloat(m[2].replace(/,/g, ""));
  observed[name] = hz;
}

if (Object.keys(observed).length === 0) {
  console.error(
    "❌ Could not parse any benchmark lines from `vitest bench` output. The textual format may have changed."
  );
  console.error("Captured stdout (first 1KB):");
  console.error(stdout.slice(0, 1024));
  process.exit(1);
}

console.log("");
console.log(
  `${"benchmark".padEnd(38)} ${"baseline hz".padStart(13)} ${"observed hz".padStart(13)} ${"delta".padStart(8)} status`
);
console.log("─".repeat(80));

let regressed = 0;
let updated = 0;
let unchanged = 0;
const newBaseline = JSON.parse(JSON.stringify(baseline));

for (const [name, expectedEntry] of Object.entries(baseline.benchmarks)) {
  const expectedHz = expectedEntry.hz;
  const observedHz = observed[name];
  if (observedHz === undefined) {
    console.error(`${name.padEnd(38)} ${"—".padStart(13)} ${"—".padStart(13)} MISSING from output`);
    regressed++;
    continue;
  }
  const deltaPct = ((observedHz - expectedHz) / expectedHz) * 100;
  const deltaStr = `${deltaPct >= 0 ? "+" : ""}${deltaPct.toFixed(1)}%`;
  let status;
  if (deltaPct < -THRESHOLD_PCT) {
    status = `❌ DROP > ${THRESHOLD_PCT}%`;
    regressed++;
  } else if (deltaPct > THRESHOLD_PCT) {
    status = `🚀 +${THRESHOLD_PCT}%+ faster`;
    if (UPDATE) {
      newBaseline.benchmarks[name].hz = observedHz;
      updated++;
    } else {
      unchanged++;
    }
  } else {
    status = "✅ within ±" + THRESHOLD_PCT + "%";
    unchanged++;
    if (UPDATE) {
      newBaseline.benchmarks[name].hz = observedHz;
      updated++;
    }
  }
  console.log(
    `${name.padEnd(38)} ${String(expectedHz).padStart(13)} ${observedHz.toFixed(2).padStart(13)} ${deltaStr.padStart(8)} ${status}`
  );
}

console.log("─".repeat(80));

if (UPDATE) {
  newBaseline.lastUpdated = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(BASELINE_PATH, JSON.stringify(newBaseline, null, 2) + "\n", "utf8");
  console.log(`✏️  baseline updated (${updated} benchmarks).`);
  process.exit(0);
}

if (regressed > 0) {
  console.error("");
  console.error(`❌ ${regressed} benchmark(s) regressed > ${THRESHOLD_PCT}% vs baseline.`);
  console.error(
    "If the regression is intentional (eg. correctness fix that costs perf), update the baseline:"
  );
  console.error(
    "  node scripts/check-bench-regression.mjs --update && git add packages/tailwindcss-obfuscator/tests/bench/baseline.json"
  );
  process.exit(1);
}

console.log(`✅ ${unchanged} benchmark(s) within ±${THRESHOLD_PCT}% of baseline.`);
