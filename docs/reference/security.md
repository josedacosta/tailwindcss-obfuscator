---
outline: deep
title: Security verification systems & how we score
description: How tailwindcss-obfuscator is graded by Dependabot, OSSF Scorecard, OpenSSF Best Practices, CodeQL and others — what's actionable, what's structurally bounded, and how to interpret the badges in the README.
---

# Security verification systems

This page is the operator's manual for the security badges and dashboards on this project. If you arrived here from a Scorecard or Dependabot link wondering « why is this project graded X/10 ? », the table below is your answer.

::: info Trust the actual security posture, not the score
A 6.4/10 on Scorecard.dev for a solo-maintainer / new-repo project is **the structural ceiling**, not a security gap. Specific check scores are explained in detail below — every line that's not at 10 has a documented reason that's either temporal (auto-resolves with time) or structural (cannot improve without a co-maintainer / changing project shape).
:::

## The 6 verification systems active on this repo

| System                                                       | What it grades                                                                        | Where you see it                                                                                                                                                          |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**OSSF Scorecard**](https://scorecard.dev/)                 | 18 supply-chain hygiene checks                                                        | [scorecard.dev/viewer/?uri=github.com/josedacosta/tailwindcss-obfuscator](https://scorecard.dev/viewer/?uri=github.com/josedacosta/tailwindcss-obfuscator) + Security tab |
| [**OpenSSF Best Practices**](https://www.bestpractices.dev/) | 50+ self-attested project criteria (Passing / Silver / Gold)                          | [bestpractices.dev/projects/12705](https://www.bestpractices.dev/projects/12705)                                                                                          |
| **GitHub Dependabot**                                        | Known CVEs in the dependency tree (lockfile-aware)                                    | [Security → Dependabot](https://github.com/josedacosta/tailwindcss-obfuscator/security/dependabot)                                                                        |
| **GitHub CodeQL** (security-extended)                        | Source-code SAST findings (ReDoS, SQL injection, prototype pollution, etc.)           | [Security → Code scanning](https://github.com/josedacosta/tailwindcss-obfuscator/security/code-scanning)                                                                  |
| **GitHub Secret Scanning + Push Protection**                 | Committed credentials, tokens, API keys                                               | Security tab (no findings if all green)                                                                                                                                   |
| **npm Provenance + Sigstore**                                | Cryptographic attestation that the published tarball was built from this exact commit | [npmjs.com/package/tailwindcss-obfuscator](https://www.npmjs.com/package/tailwindcss-obfuscator) (« Provenance » badge)                                                   |

## OSSF Scorecard — per-check breakdown

Scorecard runs weekly (Monday 06:00 UTC) and on every push. Below is every check, our score, and exactly why the score is what it is.

### Checks we score 10/10 on (8/18)

| Check                      | Why it's 10                                                                                                                                                |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Binary-Artifacts**       | Zero binaries in the repo.                                                                                                                                 |
| **Dangerous-Workflow**     | All `.github/workflows/*.yml` use SHA-pinned actions, no `pull_request_target`-style untrusted-context patterns.                                           |
| **Dependency-Update-Tool** | Renovate is wired (see `renovate.json`).                                                                                                                   |
| **License**                | MIT, FSF/OSI recognised.                                                                                                                                   |
| **Security-Policy**        | `SECURITY.md` at root with disclosure timeline + contact.                                                                                                  |
| **Token-Permissions**      | Every workflow declares per-job least-privilege scopes ; top-level `permissions: {}` denies everything by default.                                         |
| **Vulnerabilities**        | Variable — sometimes 10, sometimes 1 — depends on whether dev-only test apps' transitive deps have open advisories. See « how to read this number » below. |

### Checks we score 0–8/10 on (10/18)

| Check                   | Score | Why we cannot improve it (yet)                                                                                                                                                                                                               |
| ----------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Branch-Protection**   | 8/10  | Wants `required_approving_review_count >= 2`. Solo maintainer cannot satisfy this without a co-maintainer. Score 8 is the structural floor.                                                                                                  |
| **CI-Tests**            | 8/10  | Wants 100 % of recent PRs to have CI checks. Some old Renovate lockfile-only PRs predate the full CI matrix. Self-improves as old PRs age out of the 30-PR rolling window.                                                                   |
| **CII-Best-Practices**  | 5/10  | We have the « Passing » badge but not yet « Silver » (8) or « Gold » (10). Upgrading is a self-attested questionnaire at [bestpractices.dev/projects/12705](https://www.bestpractices.dev/projects/12705). On the roadmap.                   |
| **Code-Review**         | 0/10  | Wants HUMAN approver per PR. Bot reviewers (CodeRabbit, Copilot) don't count. Solo maintainer cannot self-approve and have it count. Score 0 is the structural floor.                                                                        |
| **Contributors**        | 3/10  | Wants 3+ contributing organisations. Solo maintainer = 1. Cannot improve without external contributors signing CLA from different orgs.                                                                                                      |
| **Fuzzing**             | 0/10  | We have no fuzzer harness. Anti-overkill carve-out documented in `CLAUDE.md` — class mangler semantics are testable directly via 418+ vitest tests, golden snapshots and bench regressions ; fuzzing harness ROI low for this project shape. |
| **Maintained**          | 0/10  | Repo created 2026-01-30, less than 90 days at the time of writing. Auto-resolves as soon as the project crosses the 90-day mark.                                                                                                             |
| **Packaging**           | n/a   | Scorecard doesn't recognise our `pnpm release` (calls `changeset publish`) as a packaging workflow. The package IS published with provenance — the score is « not detected », not « failed ».                                                |
| **Pinned-Dependencies** | 8/10  | Wants 100 % of deps pinned to commit SHA / version. Our GitHub Actions are SHA-pinned ; npm deps use range specifiers (`^X.Y.Z`) which is the npm ecosystem norm and the only way Renovate can keep them up to date.                         |
| **SAST**                | 9/10  | Wants 100 % of recent commits SAST-scanned. CodeQL was enabled mid-project (PR #74) ; commits before then weren't scanned. Self-improves as new commits accumulate.                                                                          |
| **Signed-Releases**     | n/a   | Scorecard doesn't yet recognise npm provenance via Sigstore as « signing ». We DO sign every release via OIDC + Sigstore — visible on npmjs.com under the « Provenance » badge. The score is « not detected », not « failed ».               |

### Maximum achievable score for this project

Given solo-maintainer + < 90-day-old repo + no fuzzing harness, the **structural ceiling is ~8.5/10**. We currently sit at ~6.4–7.1/10, with the gap to 8.5 being :

- Maintained 0 → 10 : **auto-resolves at 90-day mark (~April 30, 2026)**, +0.5
- CII-Best-Practices 5 → 8 : **upgrade Passing → Silver** via the bestpractices.dev questionnaire, +0.2
- CI-Tests 8 → 10 : **self-improves over time** as old PRs age out, +0.1
- SAST 9 → 10 : **self-improves over time**, +0.05

Closing the gap from 8.5 → 10 would require :

- Co-maintainer + 2 reviewers : Branch-Protection 8 → 10, Code-Review 0 → 10, Contributors 3 → 10
- Adding a fuzzer harness : Fuzzing 0 → 10

Both are explicit anti-overkill carve-outs for this project — see the « Anti-overkill » block in our agent brief.

## GitHub Dependabot — known CVEs in dependencies

Dependabot reads `pnpm-lock.yaml` (and every `apps/*/package.json`) against the GitHub Advisory Database. Every dependency on a known-vulnerable version raises an alert in [Security → Dependabot](https://github.com/josedacosta/tailwindcss-obfuscator/security/dependabot).

### How to read the alert count

Most alerts on this repo are in the **`apps/test-*/` test apps**, NOT in the published package. The shipped package (`packages/tailwindcss-obfuscator/`) is the source of truth for what consumers install ; it has zero open advisories, locked down by the `pnpm.overrides` block in the root `package.json`.

When we add a test app for an EOL framework version (e.g. Astro v4), Dependabot raises alerts for that framework's known vulns. We have two options :

1. **Bump the test app to a patched version**, OR
2. **Drop the test app** if no patches exist for that version line (EOL).

Both are documented in CHANGELOG entries and PR descriptions.

### What's NEVER an alert here

- **Source code in `packages/tailwindcss-obfuscator/src/**`\*\* — the published package's own code is graded by CodeQL, not Dependabot.
- **Transitive deps with overrides** — when our `pnpm.overrides` block in the root `package.json` upgrades a vulnerable transitive to a patched version, Dependabot still might surface the original version because it reads the lockfile direct entries. Check `pnpm audit --json` for the authoritative answer.

## GitHub CodeQL — SAST on shipped src

CodeQL runs the [`security-extended` query suite](https://github.com/github/codeql/tree/main/javascript/ql/src/Security) on every push to `main` and every PR. Findings appear in [Security → Code scanning](https://github.com/josedacosta/tailwindcss-obfuscator/security/code-scanning).

### What CodeQL flags here

- `js/polynomial-redos` (CWE-1333) — regex shapes that can backtrack quadratically on crafted input. Real findings get fixed (see PRs #106, #108, #110) ; theoretical-only findings on bounded character classes get dismissed as false positive with full justification.
- `js/incomplete-sanitization` (CWE-79) — escape functions that miss a special character. Reviewed individually ; sometimes fixed, sometimes dismissed when the input domain is already constrained upstream.
- `js/file-system-race` (CWE-367) — TOCTOU file operations. Dismissed as false positive in the dev-only scripts where the threat model has no untrusted concurrent writer.

### How dismissals work

Every dismissal carries a `dismissed_comment` explaining why it's not actionable in our context. Search the [Code Scanning closed alerts](https://github.com/josedacosta/tailwindcss-obfuscator/security/code-scanning?query=is%3Aclosed) for the full reasoning per alert.

## OpenSSF Best Practices badge

Self-attested questionnaire at [bestpractices.dev/projects/12705](https://www.bestpractices.dev/projects/12705). Three levels :

- **Passing** (current) — basic OSS hygiene : license, version control, vulnerability reporting, basic test discipline.
- **Silver** (target) — adds : explicit roadmap, code-of-conduct enforcement plan, automated tests on every PR, SBOM published.
- **Gold** (stretch) — adds : reproducible builds, key signing per release, dependency provenance audited.

We satisfy most Silver requirements technically — the upgrade is mostly « click through the questionnaire to attest each item ». On the roadmap.

## npm provenance + Sigstore

Every release published to npm since v2.1.0 carries a [Sigstore attestation](https://www.sigstore.dev/) generated via OpenID Connect from the GitHub Actions runner.

To verify a release was built from a specific commit :

```bash
npm view tailwindcss-obfuscator@latest dist.signatures
# Returns the Sigstore signature ID + the public key.

# Or via the npm CLI v9+:
npm audit signatures
# Verifies every installed package's provenance.
```

The Sigstore attestation also makes the GitHub release **immutable** — no asset can be edited or replaced after publish. Hence why the SBOM ships INSIDE the npm tarball at `dist/sbom.spdx.json` rather than as a release asset (issue #101 post-mortem).

## How to triage a new alert

1. **Read the alert's rule + message** — every CodeQL finding has a CWE link explaining the threat model.
2. **Check whether the path is shipped** — `packages/tailwindcss-obfuscator/src/**` ships ; everything else (`scripts/`, `apps/test-*/`, `tests/`) is dev-only.
3. **If shipped + actionable** — open a fix PR with a changeset.
4. **If shipped + theoretical** — dismiss with a justification quoting the threat model and what bounds it (e.g. « input is constrained by `isTailwindClass()` upstream »).
5. **If dev-only** — dismiss with a justification quoting the threat model boundary (« no untrusted concurrent writer in the build pipeline »).

The agent brief in `CLAUDE.md` formalises this triage flow under the « Bot-feedback rule » section.
