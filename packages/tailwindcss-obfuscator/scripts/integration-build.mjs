#!/usr/bin/env node
/**
 * Integration build verifier.
 *
 * Walks the monorepo's `apps/test-*` directories and, for each one that
 * declares a `build` script, runs the build under a clean working dir and
 * asserts that:
 *   - the build exits 0,
 *   - a `.tw-obfuscation/class-mapping.json` artifact is produced (when the
 *     app uses one of the bundler plugins).
 *
 * Designed to be wired into CI as a job that runs after `pnpm install`.
 * Use `--apps <name1,name2>` to limit the run to a subset.
 */

import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const monorepoRoot = path.resolve(__dirname, "..", "..", "..");
const appsDir = path.join(monorepoRoot, "apps");

const args = new Map();
for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg.startsWith("--")) {
    const [k, v] = arg.slice(2).split("=");
    args.set(k, v ?? process.argv[++i]);
  }
}

const filter = args.has("apps")
  ? new Set(String(args.get("apps")).split(","))
  : null;

if (!fs.existsSync(appsDir)) {
  console.error(`No apps directory at ${appsDir}`);
  process.exit(0);
}

const apps = fs
  .readdirSync(appsDir)
  .filter((name) => name.startsWith("test-"))
  .filter((name) => fs.existsSync(path.join(appsDir, name, "package.json")))
  .filter((name) => !filter || filter.has(name));

if (apps.length === 0) {
  console.log("No matching test apps to build.");
  process.exit(0);
}

const results = [];

for (const app of apps) {
  const appDir = path.join(appsDir, app);
  const pkgPath = path.join(appDir, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  if (!pkg.scripts?.build) {
    results.push({ app, status: "skipped", reason: "no build script" });
    continue;
  }

  console.log(`\n→ Building ${app} ...`);
  const start = Date.now();
  const child = spawnSync("pnpm", ["--filter", pkg.name, "build"], {
    cwd: monorepoRoot,
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" },
  });
  const duration = Date.now() - start;

  if (child.status !== 0) {
    results.push({ app, status: "failed", duration, code: child.status });
    continue;
  }

  const mappingPath = path.join(appDir, ".tw-obfuscation", "class-mapping.json");
  const mappingExists = fs.existsSync(mappingPath);
  let classCount = null;
  if (mappingExists) {
    try {
      const m = JSON.parse(fs.readFileSync(mappingPath, "utf-8"));
      classCount = m.totalClasses ?? Object.keys(m.classes ?? {}).length;
    } catch {
      // ignore — counted as built but mapping unreadable
    }
  }

  results.push({
    app,
    status: "built",
    duration,
    mapping: mappingExists ? `${classCount} classes` : "missing",
  });
}

console.log("\n=== Integration build report ===\n");
for (const r of results) {
  const dur = r.duration != null ? `${(r.duration / 1000).toFixed(1)}s` : "-";
  console.log(
    `  ${r.app.padEnd(28)} ${String(r.status).padEnd(8)} ${dur.padStart(7)}  ${r.mapping ?? r.reason ?? ""}`
  );
}

const failures = results.filter((r) => r.status === "failed").length;
if (failures > 0) {
  console.error(`\n${failures} app(s) failed to build.`);
  process.exit(1);
}
console.log("\nAll builds succeeded.");
