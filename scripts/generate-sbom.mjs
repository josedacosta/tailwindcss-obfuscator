#!/usr/bin/env node
/**
 * Generate a minimal SPDX-JSON Software Bill of Materials for the
 * published `tailwindcss-obfuscator` package, written to
 * `packages/tailwindcss-obfuscator/dist/sbom.spdx.json`.
 *
 * Why ship the SBOM inside the npm tarball instead of attaching it to
 * the GitHub release : npm publish-with-provenance signs the tarball
 * via Sigstore, which freezes the resulting GitHub release as
 * **immutable**. Any post-publish asset upload is rejected with
 * « Cannot upload assets to an immutable release. » (see issue #101).
 * Putting the SBOM inside `dist/` makes it a covered file of the
 * Sigstore attestation chain itself — strictly stronger than a
 * post-release attachment, and discoverable via
 * `cat node_modules/tailwindcss-obfuscator/dist/sbom.spdx.json`.
 *
 * The output is a valid SPDX 2.3 JSON document : the same SPEC GitHub
 * Dependency Graph, OSSF Scorecard, FOSSA, GitLab Dependency Scanning
 * and Anchore Grype all consume natively.
 *
 * No new npm dep required — we read the resolved dep tree from
 * `pnpm list --json` and transform it to SPDX in pure Node.
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PKG_DIR = resolve(ROOT, "packages", "tailwindcss-obfuscator");
const PKG_JSON = JSON.parse(readFileSync(resolve(PKG_DIR, "package.json"), "utf8"));
const OUT = resolve(PKG_DIR, "dist", "sbom.spdx.json");

// pnpm list --json --depth=Infinity gives the full resolved tree for the
// production deps of just this package. --prod excludes devDependencies
// (which are not shipped to consumers).
const raw = execSync(`pnpm --filter ${PKG_JSON.name} list --json --depth=Infinity --prod`, {
  cwd: ROOT,
  encoding: "utf8",
  maxBuffer: 32 * 1024 * 1024,
});
const tree = JSON.parse(raw)[0];

const seen = new Set();
const packages = [];

function sha1(s) {
  return createHash("sha1").update(s).digest("hex");
}

function spdxId(name, version) {
  // SPDX requires the SPDXID to match `^SPDXRef-[A-Za-z0-9.\-]+$` ; turn
  // package names like `@babel/parser` into a safe form.
  return "SPDXRef-Package-" + (name + "-" + version).replace(/[^A-Za-z0-9.-]/g, "-");
}

function visit(name, node) {
  const key = `${name}@${node.version}`;
  if (seen.has(key)) return;
  seen.add(key);
  packages.push({
    SPDXID: spdxId(name, node.version),
    name,
    versionInfo: node.version,
    downloadLocation: node.resolved || "NOASSERTION",
    licenseConcluded: "NOASSERTION",
    licenseDeclared: "NOASSERTION",
    copyrightText: "NOASSERTION",
    supplier: "NOASSERTION",
    filesAnalyzed: false,
    checksums: [
      {
        algorithm: "SHA1",
        checksumValue: sha1(`${name}@${node.version}`),
      },
    ],
    externalRefs: [
      {
        referenceCategory: "PACKAGE-MANAGER",
        referenceType: "purl",
        // Drop a leading `@` from the scope and encode the slash.
        referenceLocator: `pkg:npm/${name.replace(/^@/, "%40")}@${node.version}`,
      },
    ],
  });
  for (const [childName, child] of Object.entries(node.dependencies || {})) {
    visit(childName, child);
  }
}

// Root package is the obfuscator itself.
visit(tree.name, { version: tree.version, dependencies: tree.dependencies });

const documentNamespace = `https://github.com/josedacosta/tailwindcss-obfuscator/sbom/${tree.version}-${Date.now()}`;

const spdx = {
  spdxVersion: "SPDX-2.3",
  dataLicense: "CC0-1.0",
  SPDXID: "SPDXRef-DOCUMENT",
  documentNamespace,
  name: `${tree.name}@${tree.version}`,
  creationInfo: {
    created: new Date().toISOString(),
    creators: ["Tool: scripts/generate-sbom.mjs", "Organization: josedacosta"],
  },
  packages,
  documentDescribes: [spdxId(tree.name, tree.version)],
};

writeFileSync(OUT, JSON.stringify(spdx, null, 2) + "\n");
console.log(
  `✓ SBOM written: ${OUT}  (${packages.length} packages, SPDX 2.3, ${(JSON.stringify(spdx).length / 1024).toFixed(1)} KB)`
);
