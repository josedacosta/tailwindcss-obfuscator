---
"tailwindcss-obfuscator": minor
---

Ship a SPDX 2.3 Software Bill of Materials inside the npm tarball at `dist/sbom.spdx.json`. The file lists every production dependency (currently 50 packages including the package itself) with its name, resolved version, download URL and `purl`. Consumers can read it via `cat node_modules/tailwindcss-obfuscator/dist/sbom.spdx.json` or feed it to GitHub Dependency Graph, OSSF Scorecard, FOSSA, GitLab Dependency Scanning or Anchore Grype — all of which consume SPDX 2.3 natively.

Why ship the SBOM inside the tarball rather than as a GitHub release asset : npm publish-with-provenance signs the tarball via Sigstore, which freezes the resulting release as immutable. Post-publish asset uploads (the previous SBOM workflow) now fail with « Cannot upload assets to an immutable release. » Putting the SBOM inside the tarball makes it covered by the npm provenance attestation chain itself — strictly stronger than a post-release asset.

Closes #101.
