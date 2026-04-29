#!/usr/bin/env node
/**
 * Snapshot tests of the obfuscator output per test app.
 *
 * For every test app, this script reads the file
 * `<app-dir>/.tw-obfuscation/class-mapping.json` produced by the integration
 * build, extracts the sorted set of original class keys (NOT the random
 * `tw-XXX` values, which change every run), and compares byte-for-byte
 * against the snapshot in `apps/__snapshots__/<app>.classes.txt`.
 *
 * Why this exists
 * ───────────────
 * `pnpm test` covers the unit-level extractors. `verify-obfuscation.mjs`
 * checks the production-build obfuscation percentage. Neither catches
 * the case where a regex change in `extractors/jsx.ts` *silently stops
 * recognising* a class shape that a real framework exercises — the
 * percentage stays high (because Tailwind drops the un-extracted class
 * from the CSS too), but the design system loses obfuscation coverage
 * for that pattern.
 *
 * The snapshot per app is a deterministic list of every class the
 * obfuscator captured during the most recent integration build. Any
 * silent change in the extractor (a new pattern recognised, a previously
 * recognised pattern lost) produces a visible diff in CI.
 *
 * Usage
 * ─────
 * Update mode (after a deliberate extractor change):
 *   node scripts/snapshot-app-mappings.mjs --update
 *
 * Verify mode (CI default):
 *   node scripts/snapshot-app-mappings.mjs
 *
 * Pre-requisite : every test app must have been built via
 * `node scripts/verify-obfuscation.mjs` (or its underlying per-app build
 * commands) so that `.tw-obfuscation/class-mapping.json` exists. The
 * script SKIPS apps that have no mapping file (and reports them as
 * such — useful when an app was added without a build).
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const APPS_DIR = path.join(REPO_ROOT, "apps");
const SNAPSHOTS_DIR = path.join(APPS_DIR, "__snapshots__");

const args = new Set(process.argv.slice(2));
const UPDATE = args.has("--update") || args.has("-u");

function listAppDirs() {
  return fs
    .readdirSync(APPS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== "__snapshots__")
    .map((e) => e.name)
    .sort();
}

function loadMappingKeys(appName) {
  const mapPath = path.join(APPS_DIR, appName, ".tw-obfuscation", "class-mapping.json");
  if (!fs.existsSync(mapPath)) return null;
  const raw = JSON.parse(fs.readFileSync(mapPath, "utf8"));
  // The mapping file has shape { version, generatedAt, totalClasses, classes: { <orig>: { obfuscated, ... } } }
  const classes = raw.classes ? Object.keys(raw.classes) : Object.keys(raw);
  return classes.slice().sort();
}

function snapshotPath(appName) {
  return path.join(SNAPSHOTS_DIR, `${appName}.classes.txt`);
}

function snapshotContent(keys) {
  // One class per line + a trailing newline so `git diff` is clean.
  return keys.join("\n") + "\n";
}

function pad(s, n) {
  return (s + " ".repeat(n)).slice(0, n);
}

if (!fs.existsSync(SNAPSHOTS_DIR)) {
  fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
}

const apps = listAppDirs();
let updated = 0;
let unchanged = 0;
let drifted = 0;
let skipped = 0;

console.log("");
console.log("Snapshot verification — apps/__snapshots__/");
console.log("─".repeat(80));
console.log(`${pad("app", 36)} ${pad("status", 10)}  details`);
console.log("─".repeat(80));

for (const app of apps) {
  const keys = loadMappingKeys(app);
  if (keys === null) {
    console.log(`${pad(app, 36)} ${pad("SKIP", 10)}  no .tw-obfuscation/class-mapping.json`);
    skipped++;
    continue;
  }
  const expected = snapshotContent(keys);
  const snapPath = snapshotPath(app);

  if (!fs.existsSync(snapPath)) {
    if (UPDATE) {
      fs.writeFileSync(snapPath, expected, "utf8");
      console.log(`${pad(app, 36)} ${pad("CREATED", 10)}  ${keys.length} classes snapshotted`);
      updated++;
    } else {
      console.log(
        `${pad(app, 36)} ${pad("MISSING", 10)}  no snapshot yet — run with --update to create`
      );
      drifted++;
    }
    continue;
  }

  const actual = fs.readFileSync(snapPath, "utf8");
  if (actual === expected) {
    console.log(`${pad(app, 36)} ${pad("OK", 10)}  ${keys.length} classes match snapshot`);
    unchanged++;
  } else {
    if (UPDATE) {
      fs.writeFileSync(snapPath, expected, "utf8");
      const oldKeys = actual.trim().split("\n").filter(Boolean);
      const added = keys.filter((k) => !oldKeys.includes(k));
      const removed = oldKeys.filter((k) => !keys.includes(k));
      console.log(
        `${pad(app, 36)} ${pad("UPDATED", 10)}  +${added.length} added, -${removed.length} removed`
      );
      updated++;
    } else {
      const oldKeys = actual.trim().split("\n").filter(Boolean);
      const added = keys.filter((k) => !oldKeys.includes(k));
      const removed = oldKeys.filter((k) => !keys.includes(k));
      console.log(
        `${pad(app, 36)} ${pad("DRIFT", 10)}  +${added.length} added, -${removed.length} removed`
      );
      if (added.length > 0)
        console.log(
          `     added: ${added.slice(0, 6).join(", ")}${added.length > 6 ? ` (+${added.length - 6} more)` : ""}`
        );
      if (removed.length > 0)
        console.log(
          `     removed: ${removed.slice(0, 6).join(", ")}${removed.length > 6 ? ` (+${removed.length - 6} more)` : ""}`
        );
      drifted++;
    }
  }
}

console.log("─".repeat(80));
console.log(
  `summary: ${unchanged} unchanged, ${updated} updated, ${drifted} drifted, ${skipped} skipped`
);
console.log("");

if (drifted > 0) {
  console.error(
    '❌ Snapshot drift detected. If the change is intentional, run:\n   node scripts/snapshot-app-mappings.mjs --update\n   git add apps/__snapshots__\n   git commit -m "test: refresh class-mapping snapshots"'
  );
  process.exit(1);
}
console.log("✅ All snapshots match.");
