# 🤝 Contributing to tailwindcss-obfuscator

First — thank you for taking the time to contribute! 💖

Whether you're filing a bug, proposing a feature, improving documentation, or
adding support for a new framework, every contribution is welcome.

This document covers everything you need to know to get a productive change
landed.

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How contributions are reviewed and released](#-how-contributions-are-reviewed-and-released)
- [Ways to contribute](#-ways-to-contribute)
- [Development setup](#-development-setup)
- [Project layout](#-project-layout)
- [Coding standards](#-coding-standards)
- [Testing your changes](#-testing-your-changes)
- [Submitting a pull request](#-submitting-a-pull-request)
- [Adding a new framework adapter](#-adding-a-new-framework-adapter)
- [Releasing a new version](#-releasing-a-new-version)
- [Getting help](#-getting-help)

## 🔒 Maintainer-only actions (technically enforced)

Two actions on this repository are **reserved to the maintainer ([@josedacosta](https://github.com/josedacosta)) and cannot be performed by anyone else**, including bots, automation, and AI agents acting outside the maintainer's session :

1. **Merging a Pull Request into `main`.** Branch protection requires a CODEOWNER review approval. The CODEOWNERS file lists `@josedacosta` as the sole owner of every path, so no contributor (forker, automation, bot) can ever satisfy the gate on their own. This is the final say on whether a contribution enters the codebase.
2. **Publishing a new version to npm.** The `release.yml` workflow only runs on pushes to `main` (which means a maintainer-merged PR), and the `npm` GitHub Environment requires `@josedacosta` as a named reviewer before any deploy step can run. No contributor can trigger a release, ever — not by merging their own PR, not by adding a changeset, not by any GitHub Action.

These are not honour-system rules — they are enforced by GitHub itself at the infrastructure layer (branch protection, CODEOWNERS, environment protection rules). If you ever see a way around them, that's a bug in the repo configuration; please report it via [SECURITY.md](./SECURITY.md).

## 🧭 How contributions are reviewed and released

This project is maintained by **[@josedacosta](https://github.com/josedacosta)** as the sole owner and CODEOWNER. The review and release flow is intentionally explicit so you know what to expect when you open a PR :

### Review

- **Every PR from a fork is reviewed by the maintainer personally.** Branch protection enforces it: no PR can be merged without a CODEOWNER approval, and self-merge by contributors is blocked at the GitHub level.
- The maintainer aims to leave a first response within **a week** (often faster). If a PR sits without feedback longer than that, a polite ping in the PR comments is welcome.
- Reviews focus on : public-API stability, test coverage, docs updates, and conformance to the patterns documented here. Cosmetic / stylistic feedback comes second to substance.
- Small, focused PRs get reviewed and merged much faster than huge ones. **When in doubt, split.**

### Releases

- Releases go through [Changesets](https://github.com/changesets/changesets). Every user-facing PR includes a `.changeset/*.md` file declaring the bump (`patch` / `minor` / `major`).
- Merging a feature PR **does not publish a new version on its own**. The Changesets bot keeps a single `chore(release): version packages` PR open at all times, accumulating every pending changeset. **When the maintainer decides it's time to ship**, that PR is merged → a new npm version is published with provenance + a GitHub release is tagged.
- This means : your contribution lands on `main` quickly (and ships in the next docs deploy if it's a doc change), but the npm version bump may wait a few days or weeks until the maintainer batches it with other changes. **This is by design** — it keeps version numbers meaningful instead of bumping on every commit.
- **Please don't ask the maintainer to "do a release for my PR".** If you have a deadline pressure (e.g. blocking your own project), say so in the PR — the maintainer will consider it, but the release cadence is the maintainer's call.

### What you can expect from the maintainer

- A response on every PR within ~a week
- Honest, constructive review focused on the code, never the contributor
- Clear "needs-changes" / "approved" / "won't-merge" decisions — no PRs left hanging silently
- Credit in the changelog for every merged contribution (Changesets auto-generates this from your changeset entry)
- A friendly tone — see [Code of Conduct](./CODE_OF_CONDUCT.md)

### What the maintainer expects from contributors

- Follow this guide — especially [Submitting a pull request](#-submitting-a-pull-request) and [Coding standards](#-coding-standards)
- Run the [quality gates](#-testing-your-changes) locally **before** pushing
- Add a [changeset](#-submitting-a-pull-request) for any user-facing change (bug fix, feature, breaking change)
- Be patient — this is a side-project maintained on personal time, not a corporate-funded effort
- Be kind in discussions and reviews

## 🤲 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md).
By participating, you agree to uphold its standards. Report unacceptable
behaviour to <contact@josedacosta.info>.

## 🌟 Ways to contribute

| Type                      | Where                                                                                                                       |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 🐛 **Bug report**         | [Open an issue](https://github.com/josedacosta/tailwindcss-obfuscator/issues/new/choose) using the bug template             |
| 💡 **Feature request**    | [Open a discussion](https://github.com/josedacosta/tailwindcss-obfuscator/discussions) before sending a PR for big features |
| 📝 **Documentation**      | Edit any file under [`docs/`](./docs) or any `README.md`                                                                    |
| 🔧 **Bug fix / refactor** | Fork → branch → PR (see [submitting a pull request](#-submitting-a-pull-request))                                           |
| 🧩 **Framework adapter**  | Add an `apps/test-<framework>/` integration (see [Adding a new framework](#-adding-a-new-framework-adapter))                |
| 🌍 **Translation**        | Coming soon — open an issue if you'd like to help translate the docs                                                        |

## 🧰 Development setup

Prerequisites:

- **Node.js** ≥ 18 (we recommend the version pinned in [`.nvmrc`](./.nvmrc))
- **pnpm** ≥ 9 (`corepack enable` will install it)
- **Git** ≥ 2.40

```bash
# 1. Fork and clone
git clone https://github.com/<your-username>/tailwindcss-obfuscator.git
cd tailwindcss-obfuscator

# 2. Install all monorepo deps
pnpm install

# 3. Build the obfuscator package
pnpm --filter tailwindcss-obfuscator build

# 4. Run the test suite (360+ tests)
pnpm --filter tailwindcss-obfuscator test
```

## 📂 Project layout

```
packages/tailwindcss-obfuscator/    # 📦 Main npm package
apps/test-*                         # 🧪 Integration apps (one per framework)
apps/lab-mangle-*                   # 🧪 Reference labs comparing tailwindcss-mangle
docs/                               # 📚 VitePress documentation
.changeset/                         # 📝 Pending releases (Changesets)
.github/                            # ⚙️  CI workflows, issue/PR templates
```

See [README.md → Project Structure](./README.md#-project-structure) for the
full breakdown.

## 📐 Coding standards

- **Language**: TypeScript with strict mode. JavaScript only when interop
  requires it.
- **Format**: Prettier — runs automatically; CI enforces `pnpm format:check`.
- **Lint**: ESLint flat config — runs in CI; fix locally with `pnpm lint:fix`.
- **Comments**: Default to none. Add a comment only when the **why** is non-
  obvious. Don't restate **what** the code does.
- **Naming**: kebab-case for files, camelCase for symbols, PascalCase for
  types/classes.
- **Imports**: Always use the `.js` extension on relative imports (ESM-native).
- **Errors**: Throw the typed errors from `core/errors.ts`
  (`ExtractionError`, `TransformError`, ...) so consumers can catch precisely.
- **Public API**: Anything exported from `src/index.ts` is public and follows
  semver. Internals belong under `src/internals.ts`.

> [!IMPORTANT]
> 🇺🇸 Everything in this project — code, comments, commits, docs, output —
> is written in **American English**.

## ✅ Testing your changes

Before opening a PR, please make sure the following all pass locally:

```bash
pnpm --filter tailwindcss-obfuscator typecheck   # TypeScript clean
pnpm --filter tailwindcss-obfuscator lint        # ESLint clean
pnpm --filter tailwindcss-obfuscator test        # 360+ unit tests
pnpm --filter tailwindcss-obfuscator bench       # (Optional) perf benchmarks
```

For changes that affect bundler integration:

```bash
# Build every test app and verify obfuscation actually runs
pnpm --filter tailwindcss-obfuscator test:integration
```

If you're touching the public API, add a test in
`packages/tailwindcss-obfuscator/tests/` and document the change in your PR.

## 🚀 Submitting a pull request

> [!IMPORTANT]
> **Direct pushes to `main` are forbidden — for everyone, including the maintainer.**
> The branch is protected (linear history, no force-push, no delete, conversation
> resolution required). Every change goes through a feature branch + Pull Request,
> even one-line doc fixes. This applies equally to AI-driven contributions.

> [!WARNING]
> **Only the maintainer ([@josedacosta](https://github.com/josedacosta)) can accept and merge PRs.** Contributors fork the repo, push a branch to their fork, and open a PR — but the merge button itself is reserved to the maintainer (enforced by branch protection + CODEOWNERS). This is true for every PR, including trivial ones, and is a hard rule of the project.

### The flow at a glance

```
   👤 You (community contributor)              🛡️ @josedacosta (maintainer)
   ──────────────────────────────              ─────────────────────────────
   1. Fork github.com/josedacosta/...
   2. git clone <your fork>
   3. git checkout -b feat/my-thing
   4. ... code, test, commit ...
   5. pnpm changeset                           ──┐
   6. git push <your fork>                       │
   7. gh pr create --base main                   ├─► 8. Reviews the PR
                                                 │   9. Requests changes / approves
   10. iterate based on feedback ────────────────┤
                                                 │   11. Merges (squash) when ready
                                                 │   12. (When batch is ready)
                                                 │       merges chore(release):
                                                 │       version packages PR
                                                 │       → npm publish + GitHub release
                                                 └──────────────────────────────────
```

1. **Fork** the repo and create a topic branch:
   ```bash
   git checkout -b fix/extract-vue-class-list
   ```
   Branch prefixes: `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`, `test/`,
   `ci/`, `build/`, `perf/` — followed by a short kebab-case slug.
2. **Make** your changes, with focused commits. We use **Conventional Commits**
   for the PR title (which becomes the squash-merge commit):
   ```
   feat(extractors): support Vue v-bind:class object syntax
   fix(transformers): preserve trailing whitespace in CSS
   docs: clarify --dry-run behaviour in CLI README
   ```
3. **Run** the quality gates locally — they will block the PR otherwise:
   ```bash
   pnpm lint && pnpm format:check
   pnpm --filter tailwindcss-obfuscator typecheck
   pnpm test
   node scripts/verify-obfuscation.mjs
   ```
4. **Add a changeset** if your change is user-facing:
   ```bash
   pnpm changeset
   ```
   Pick `patch` for bug fixes, `minor` for new features, `major` for breaking
   changes. Write a one-line description; it goes into the changelog. Never
   edit `package.json` versions or `CHANGELOG.md` by hand.
5. **Push** and open a PR against `main`:
   ```bash
   git push -u origin fix/extract-vue-class-list
   gh pr create --base main --fill
   ```
   Fill in the [PR template](.github/PULL_REQUEST_TEMPLATE.md).
6. **Iterate** based on review. Force-pushes to your feature branch are fine;
   they keep history clean. Never `--no-verify` to bypass hooks.
7. **Squash-merge only** is the default once approved + CI green. Other merge
   strategies are disabled at the repo level.
8. The branch is auto-deleted after merge.

> [!TIP]
> 💚 Small focused PRs get reviewed (and merged) much faster than huge ones.
> When in doubt, split.

### Reporting bugs and asking questions

- **Bugs** — use [Issues](https://github.com/josedacosta/tailwindcss-obfuscator/issues/new/choose) with the bug template. Reproductions are golden.
- **Feature requests** — same place, with the feature template.
- **Questions / how-do-I** — use [Discussions](https://github.com/josedacosta/tailwindcss-obfuscator/discussions) instead of Issues.
- **Security** — never as a public issue. Use [GitHub Security Advisories](https://github.com/josedacosta/tailwindcss-obfuscator/security/advisories/new) or email `contact@josedacosta.info` (see [`SECURITY.md`](./SECURITY.md)).

## 🧩 Adding a new framework adapter

The shared `unplugin` core in
[`src/plugins/core.ts`](./packages/tailwindcss-obfuscator/src/plugins/core.ts)
covers most bundlers automatically. To add a new one:

1. Create a thin entry file at
   `packages/tailwindcss-obfuscator/src/plugins/<bundler>.ts` that re-exports
   `obfuscatorUnplugin.<bundler>`.
2. Wire the entry into:
   - `packages/tailwindcss-obfuscator/tsup.config.ts` (build target)
   - `packages/tailwindcss-obfuscator/package.json` (`exports` field)
3. Create a working `apps/test-<framework>/` integration that uses the new
   plugin and produces obfuscated output on `pnpm build`.
4. Add a row to the **Supported Frameworks** table in the root README.
5. Document the setup snippet in the package README.

## 🏷️ Releasing a new version

Releases are managed via [Changesets](https://github.com/changesets/changesets) and **triggered manually by the maintainer**, not by every merge :

1. Every user-facing PR includes a changeset (`pnpm changeset`).
2. The Changesets bot maintains a single open `chore(release): version packages` PR that aggregates all pending changesets.
3. **When the maintainer decides it's release time**, that PR is squash-merged. This is the only event that triggers an npm publish.
4. The `Release` workflow then runs, bumps versions, updates `CHANGELOG.md`, publishes to npm with provenance, and creates a GitHub release tag.

Contributors do **not** need to (and cannot) trigger releases. Just open your PR with a changeset — the maintainer batches everything into the next release cycle.

See [`.github/workflows/release.yml`](./.github/workflows/release.yml) for the pipeline source.

## 🆘 Getting help

- 💬 [GitHub Discussions](https://github.com/josedacosta/tailwindcss-obfuscator/discussions)
  — questions, ideas, show-and-tell
- 🐛 [GitHub Issues](https://github.com/josedacosta/tailwindcss-obfuscator/issues)
  — confirmed bugs only, please
- 📧 [contact@josedacosta.info](mailto:contact@josedacosta.info) — for sensitive matters or security reports
- 🌐 [josedacosta.info](https://www.josedacosta.info) — maintainer's website

---

Thanks again for contributing! 🚀 Every PR, every issue, every star helps.
