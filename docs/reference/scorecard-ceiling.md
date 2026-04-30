---
outline: deep
title: Why we're not 100% on every security check
description: Per-check explanation of every Scorecard / Best-Practices / Dependabot result that is not at the maximum — what's structural, what's temporal, and what's intentionally deferred.
---

# Why we're not 100% on every security check

Honest, per-check breakdown of every score that's not at the maximum on this project. Each line below explains exactly **why the check is at its current value** and **whether it can ever reach 10/10** for a project of this shape (solo-maintainer, < 90-day-old repo, no fuzzing harness by design).

::: tip In short
**The structural ceiling for this project is ~8.5 / 10.** Reaching exactly 10/10 requires a co-maintainer (closes Branch-Protection + Code-Review + Contributors gaps) and a fuzzing harness (closes Fuzzing). Both are intentional anti-overkill carve-outs documented in our agent brief.
:::

## OSSF Scorecard — gaps explained

Live grade : [scorecard.dev/viewer/?uri=github.com/josedacosta/tailwindcss-obfuscator](https://scorecard.dev/viewer/?uri=github.com/josedacosta/tailwindcss-obfuscator).

### Branch-Protection — 8 / 10 (structural floor)

**What Scorecard wants** : `required_approving_review_count >= 2` for the maximum score.

**Why we're at 8** : we have `required_approving_review_count = 1`, because solo-maintainer = there's no second human to enforce a 2-reviewer policy against. Setting it to 2 would simply make every PR un-mergeable.

**Could it ever be 10** : only if a co-maintainer joins the project and we can require 2 distinct human approvers. **Not on the roadmap** — solo maintenance is a deliberate project shape choice.

### Code-Review — 0 / 10 (structural floor)

**What Scorecard wants** : every PR merged into `main` to carry at least one explicit human review approval.

**Why we're at 0** : every PR on this repo is admin-merged by the maintainer. Solo means no one else is around to approve. Bot reviews (CodeRabbit, Copilot Code Review) are NOT counted by Scorecard — only human approvals from a different account than the PR author count.

**Could it ever be 10** : only with a co-maintainer who reviews every PR. **Not on the roadmap.**

### Contributors — 3 / 10 (structural floor)

**What Scorecard wants** : 3+ distinct organisations contributing commits in the last 30 days.

**Why we're at 3** : the project has 1 contributing organisation (the maintainer). Renovate / Dependabot / GitHub-Actions bots count as accounts but not as separate organisations.

**Could it ever be 10** : only if 3+ external contributors from different companies / orgs land merged code. Open-source nature means this could happen organically over time, but it's not something we can engineer.

### Fuzzing — 0 / 10 (intentional carve-out)

**What Scorecard wants** : a fuzzing harness (`go-fuzz`, `cargo fuzz`, `oss-fuzz`, `jazzer.js`, `atheris`, etc.) integrated in CI.

**Why we're at 0** : we deliberately don't fuzz. The library's behaviour is testable directly via 418+ vitest unit tests + golden-file snapshot tests for every test app + bench regression baselines + CodeQL static analysis. Adding a fuzzer harness would burn CI compute for marginal incremental signal.

**Could it ever be 10** : yes, by adding `jazzer.js` (the JS fuzzer). The cost is non-trivial CI-time and ongoing harness maintenance. **Documented as anti-overkill carve-out** in `CLAUDE.md` ; not on the roadmap.

### Maintained — 0 / 10 → resolves to 10 / 10 automatically (temporal)

**What Scorecard wants** : the project to be older than 90 days.

**Why we're at 0** : repo created on 2026-01-30. Less than 90 days at the time of writing.

**Could it ever be 10** : **yes, automatically, on 2026-04-30** (90 days after creation). No code change needed.

### CI-Tests — 8 / 10 (slowly self-improves)

**What Scorecard wants** : 100 % of recent merged PRs to have CI checks attached.

**Why we're at 8** : Scorecard counts the last 30 merged PRs. Some old Renovate lockfile-only PRs predate the full CI matrix and don't have all the modern checks. As old PRs age out of the rolling window, the score climbs.

**Could it ever be 10** : **yes, naturally, in a few weeks** as we accumulate new PRs that all run the full CI matrix.

### SAST — 9 / 10 (slowly self-improves)

**What Scorecard wants** : 100 % of recent commits to be SAST-scanned.

**Why we're at 9** : CodeQL was enabled in PR #74 (mid-project). Older commits are not SAST-checked. As the rolling window of 30 commits moves forward, only post-CodeQL commits remain and the score climbs.

**Could it ever be 10** : **yes, naturally, after ~30 more commits** (which on this repo is days, not months).

### CII-Best-Practices — 5 / 10 (manual upgrade available)

**What Scorecard wants** : a Silver (8/10) or Gold (10/10) badge on [bestpractices.dev/projects/12705](https://www.bestpractices.dev/projects/12705).

**Why we're at 5** : we earned the Passing (5/10) badge by satisfying the basic OpenSSF Best Practices criteria. Silver requires additional self-attested items (explicit roadmap doc, CoC enforcement plan, automated tests on every PR, SBOM published — most of which we already do, just need to attest). Gold adds reproducible builds, signed commits, dep provenance audited.

**Could it ever be 10** : **yes**. Upgrading Passing → Silver is a 1-2h questionnaire on bestpractices.dev with no code changes. Silver → Gold needs a few infrastructure additions. **On the roadmap, soft prio.**

### Pinned-Dependencies — 8 / 10 (npm ecosystem floor)

**What Scorecard wants** : every dependency pinned to an exact version or commit SHA.

**Why we're at 8** : GitHub Actions are SHA-pinned (40-char commit hash). npm dependencies use range specifiers (`^X.Y.Z`) — the npm ecosystem norm. Strict pinning would defeat Renovate's auto-bump pipeline.

**Could it ever be 10** : technically yes by pinning every npm dep to exact versions, but we'd have to give up Renovate's auto-bump value. **Not on the roadmap** — current setup is the sane npm-ecosystem default.

### Vulnerabilities — variable (transient)

**What Scorecard wants** : 0 known vulnerabilities in the dependency tree.

**Why we sometimes drop below 10** : when we add a test app for an EOL framework version (e.g. Astro v4), Dependabot raises alerts for that framework's known vulns. We dropped Astro v4 + Astro v5 + Vite v4 + Vite v5 test apps for this reason — the v4/v5 lines have unpatched CVEs that upstream will not backport.

**Could it ever be 10** : **yes, and currently is** — we keep only test apps on framework versions with current security support.

### Packaging — n/a (Scorecard limitation)

**What Scorecard wants** : a recognised packaging workflow (npm publish, PyPI publish, etc.) detected in the repo.

**Why it's n/a** : Scorecard's heuristic doesn't detect our `pnpm release` (which calls `changeset publish`) as a packaging workflow. We DO publish to npm with provenance — visible at [npmjs.com/package/tailwindcss-obfuscator](https://www.npmjs.com/package/tailwindcss-obfuscator).

**Could it ever be 10** : not without changing our publish flow to a more standard `npm publish` invocation that Scorecard recognises. **Not on the roadmap** — the current Changesets flow is strictly better than a manual `npm publish`.

### Signed-Releases — n/a (Scorecard limitation)

**What Scorecard wants** : cryptographic signatures on release artifacts.

**Why it's n/a** : Scorecard doesn't yet recognise npm provenance via Sigstore as « signing ». We DO sign every release via OIDC + Sigstore — visible on npmjs.com under the « Provenance » badge, and verifiable with `npm audit signatures`.

**Could it ever be 10** : when Scorecard's heuristic catches up to the npm provenance standard. Not something we control.

## OpenSSF Best Practices — gap explained

Live badge : [bestpractices.dev/projects/12705](https://www.bestpractices.dev/projects/12705).

**Current level** : Passing (basic compliance).
**Achievable next** : Silver. Most criteria already satisfied technically — just need to fill the questionnaire to attest each item.
**Stretch goal** : Gold. Requires reproducible builds + signed commits + audited dep provenance.

## Dependabot — what it surfaces here

Live alerts : [github.com/josedacosta/tailwindcss-obfuscator/security/dependabot](https://github.com/josedacosta/tailwindcss-obfuscator/security/dependabot).

The shipped package (`packages/tailwindcss-obfuscator/`) is the source of truth for what consumers install ; it has zero open advisories, locked down by the `pnpm.overrides` block in the root `package.json`.

When Dependabot raises an alert, it's almost always in a `apps/test-*/` test app. Triage decision tree :

1. Is the affected version line still receiving upstream patches? **Yes** → bump to the latest patch.
2. **No** (EOL line) → drop the test app entirely. Coverage of that framework version is lost ; the vulnerability count goes back to zero.

## CodeQL — what's noise vs what's actionable

Live alerts : [github.com/josedacosta/tailwindcss-obfuscator/security/code-scanning](https://github.com/josedacosta/tailwindcss-obfuscator/security/code-scanning).

| Pattern                                                         | Shipped src ?                   | Action                                                              |
| --------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------- |
| `js/polynomial-redos`                                           | shipped                         | Real fix (refactor regex to balanced-block traversal)               |
| `js/polynomial-redos` (negated char class + literal terminator) | shipped, but linear in practice | Dismiss with structural justification                               |
| `js/incomplete-sanitization`                                    | shipped                         | Real fix OR dismiss if input domain is constrained upstream         |
| `js/file-system-race`                                           | dev-only (scripts, test apps)   | Dismiss — no untrusted concurrent writer in build pipeline          |
| `js/insecure-temporary-file`                                    | shipped                         | Investigate ; dismiss if path is consumer-controlled (not a tmpdir) |

## Summary table — actionable vs structural

| Check               | Score    | Status                | What's needed for 10                           |
| ------------------- | -------- | --------------------- | ---------------------------------------------- |
| Branch-Protection   | 8        | structural floor      | co-maintainer                                  |
| Code-Review         | 0        | structural floor      | co-maintainer (humans, not bots)               |
| Contributors        | 3        | structural floor      | 3+ contributing orgs                           |
| Fuzzing             | 0        | intentional carve-out | add fuzz harness (anti-overkill)               |
| Maintained          | 0        | temporal              | wait until 90 days post-creation               |
| CI-Tests            | 8        | temporal              | wait for old PRs to age out                    |
| SAST                | 9        | temporal              | wait for ~30 more post-CodeQL commits          |
| CII-Best-Practices  | 5        | manual                | fill Silver questionnaire on bestpractices.dev |
| Pinned-Dependencies | 8        | ecosystem floor       | abandon Renovate auto-bump (not worth it)      |
| Vulnerabilities     | variable | transient             | drop EOL test apps with unpatched CVEs         |

If you arrived here via a security-tab badge and were worried that a 6-7/10 score meant something was broken : it doesn't. The numbers above are the structural ceiling for this project shape. Real security signal lives in [Dependabot alerts](https://github.com/josedacosta/tailwindcss-obfuscator/security/dependabot) and [CodeQL findings](https://github.com/josedacosta/tailwindcss-obfuscator/security/code-scanning) — both currently at zero.
