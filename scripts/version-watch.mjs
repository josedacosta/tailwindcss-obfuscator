#!/usr/bin/env node
/**
 * Version watcher — surveils every package this project supports for
 * SemVer-major bumps OR explicit breaking-change keywords in the upstream
 * release notes. Designed to run weekly via .github/workflows/version-watch.yml.
 *
 * Anti-overkill carve-out
 * ───────────────────────
 * Renovate already handles minor / patch bumps as routine PRs. This script
 * is INTENTIONALLY noisy on majors / breaking changes only — those are the
 * cases that warrant human attention (audit our adapter, plan a v3 of the
 * package, update test apps). It does NOT alert on:
 *   - patch (x.y.PATCH)
 *   - minor (x.MINOR.z) when no breaking-change keyword is present
 *   - prereleases (alpha / beta / rc) on majors that are still in flight
 *
 * Output
 * ──────
 * Writes a Markdown report to stdout AND to $GITHUB_OUTPUT (multi-line) so
 * the workflow can email it via dawidd6/action-send-mail OR open a
 * GitHub issue if SMTP secrets are absent.
 *
 * Local dry-run
 * ─────────────
 *   node scripts/version-watch.mjs --dry-run
 *
 * Exit codes : 0 always (a workflow failure here would be obnoxious — the
 * report is the signal, not the exit code).
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const CONFIG_PATH = path.join(repoRoot, ".github", "version-watch-config.json");

const BREAKING_KEYWORDS = [
  "BREAKING CHANGE",
  "BREAKING:",
  "Breaking change",
  "💥",
  "BREAKING-CHANGE",
];

/**
 * Light wrapper over fetch that times out after 15s and returns null on
 * failure (so one flaky upstream API doesn't sink the whole report).
 */
async function fetchJson(url, headers = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15_000);
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "tailwindcss-obfuscator-version-watch", ...headers },
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function parseMajor(version) {
  if (typeof version !== "string") return null;
  // Strip leading "v" and any prerelease suffix, then take the first digit run.
  const cleaned = version.replace(/^v/, "");
  const match = cleaned.match(/^(\d+)\./);
  return match ? Number(match[1]) : null;
}

function isPrerelease(version) {
  return typeof version === "string" && /-(alpha|beta|rc|next|canary|nightly|pre)/i.test(version);
}

async function checkPackage(pkg, githubToken) {
  const npm = await fetchJson(`https://registry.npmjs.org/${encodeURIComponent(pkg.name)}`);
  if (!npm) return { name: pkg.name, status: "fetch-failed" };

  const latestTag = npm["dist-tags"]?.latest;
  if (!latestTag) return { name: pkg.name, status: "no-latest-tag" };

  const latestMajor = parseMajor(latestTag);
  if (latestMajor === null) {
    return { name: pkg.name, status: "unparseable-version", version: latestTag };
  }

  const result = {
    name: pkg.name,
    currentMajor: pkg.currentMajor,
    latestVersion: latestTag,
    latestMajor,
    isPrerelease: isPrerelease(latestTag),
    alerts: [],
  };

  // 1. SemVer-major detection.
  if (pkg.alertOn.includes("major") && latestMajor > pkg.currentMajor && !result.isPrerelease) {
    result.alerts.push({
      kind: "major",
      message: `New major: v${pkg.currentMajor} → v${latestMajor} (full version: ${latestTag})`,
    });
  }

  // 2. Breaking-change detection in release notes (only if requested AND a GH repo is mapped).
  if (pkg.alertOn.includes("breaking") && pkg.githubRepo && githubToken) {
    const releases = await fetchJson(
      `https://api.github.com/repos/${pkg.githubRepo}/releases?per_page=5`,
      { authorization: `Bearer ${githubToken}`, accept: "application/vnd.github+json" }
    );
    if (Array.isArray(releases)) {
      for (const release of releases) {
        const body = String(release.body ?? "");
        const tag = String(release.tag_name ?? "");
        const tagMajor = parseMajor(tag);
        if (tagMajor === null || tagMajor <= pkg.currentMajor) continue;
        const matchedKeyword = BREAKING_KEYWORDS.find((k) =>
          body.toUpperCase().includes(k.toUpperCase())
        );
        if (matchedKeyword) {
          const excerpt = body
            .split("\n")
            .filter((line) => line.toUpperCase().includes(matchedKeyword.toUpperCase()))
            .slice(0, 3)
            .join("\n");
          result.alerts.push({
            kind: "breaking",
            tag,
            url: release.html_url,
            keyword: matchedKeyword,
            excerpt: excerpt.length > 800 ? excerpt.slice(0, 800) + " …" : excerpt,
          });
        }
      }
    }
  }

  return result;
}

function renderReport(results, generatedAt) {
  const alerts = results.filter((r) => r.alerts && r.alerts.length > 0);
  const noAction = results.filter((r) => !r.alerts || r.alerts.length === 0);
  const failed = results.filter((r) => r.status && r.status !== "ok");

  const lines = [];
  lines.push(`# Version Watch Report — ${generatedAt}`);
  lines.push("");
  lines.push(
    "_The watcher only alerts on **SemVer-major** bumps OR explicit **breaking-change** keywords in upstream release notes. Patch / minor bumps are handled by Renovate and are not surfaced here._"
  );
  lines.push("");

  if (alerts.length === 0) {
    lines.push("## ✅ Nothing to flag");
    lines.push("");
    lines.push(`All ${results.length} watched packages are within their current major.`);
  } else {
    lines.push(`## 🚨 ${alerts.length} package(s) need attention`);
    lines.push("");
    for (const r of alerts) {
      lines.push(`### \`${r.name}\` (current major: v${r.currentMajor})`);
      lines.push("");
      for (const a of r.alerts) {
        if (a.kind === "major") {
          lines.push(`- **Major bump detected** : ${a.message}`);
          lines.push(`  - npm : https://www.npmjs.com/package/${r.name}`);
        } else if (a.kind === "breaking") {
          lines.push(`- **Breaking change** in \`${a.tag}\` (matched keyword \`${a.keyword}\`)`);
          if (a.url) lines.push(`  - Release notes : ${a.url}`);
          if (a.excerpt) {
            lines.push("  - Excerpt :");
            for (const ex of a.excerpt.split("\n")) {
              lines.push(`    > ${ex}`);
            }
          }
        }
      }
      lines.push("");
      lines.push(
        `_To acknowledge this alert, bump \`currentMajor\` in \`.github/version-watch-config.json\`._`
      );
      lines.push("");
    }
  }

  if (failed.length > 0) {
    lines.push("## ⚠️ Could not check");
    lines.push("");
    for (const r of failed) {
      lines.push(`- \`${r.name}\` — ${r.status}`);
    }
    lines.push("");
  }

  if (noAction.length > 0) {
    lines.push(`## ✅ ${noAction.length} package(s) on current major (no action needed)`);
    lines.push("");
    lines.push(noAction.map((r) => `\`${r.name}@${r.latestVersion ?? "?"}\``).join(" · "));
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push(
    "_Generated by `scripts/version-watch.mjs`. Edit the watchlist at `.github/version-watch-config.json`._"
  );

  return lines.join("\n");
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const githubToken = process.env.GITHUB_TOKEN ?? null;

  if (!fs.existsSync(CONFIG_PATH)) {
    console.error(`version-watch: config file not found at ${CONFIG_PATH}`);
    process.exit(0);
  }
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  if (!Array.isArray(config.packages) || config.packages.length === 0) {
    console.error("version-watch: empty packages array in config");
    process.exit(0);
  }

  const generatedAt = new Date().toISOString().slice(0, 10);
  const results = [];
  for (const pkg of config.packages) {
    const r = await checkPackage(pkg, githubToken);
    results.push(r);
  }

  const report = renderReport(results, generatedAt);
  const alertCount = results.filter((r) => r.alerts && r.alerts.length > 0).length;

  if (dryRun) {
    console.log(report);
    console.log(`\n[dry-run] alertCount=${alertCount}`);
    return;
  }

  console.log(report);

  // Multi-line GITHUB_OUTPUT — see https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#multiline-strings
  const ghOutput = process.env.GITHUB_OUTPUT;
  if (ghOutput) {
    const eof = `EOF_${Date.now()}`;
    const payload = `report<<${eof}\n${report}\n${eof}\nalertCount=${alertCount}\nalertCountIsPositive=${alertCount > 0}\n`;
    fs.appendFileSync(ghOutput, payload);
  }
}

main().catch((err) => {
  console.error(`version-watch: unexpected failure — ${err?.message ?? err}`);
  // Always exit 0 — failing the workflow because of a transient upstream
  // outage would be more annoying than missing one weekly report.
  process.exit(0);
});
