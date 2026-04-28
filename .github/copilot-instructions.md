# Repository custom instructions for GitHub Copilot

> Copilot reads this file (when **Settings → Code & automation → Copilot → Code review → "Use custom instructions when reviewing pull requests"** is ON) and applies it on every PR review on this repository.
>
> The maintainer (@josedacosta) is the sole CODEOWNER and the only person who can merge to `main` or publish to npm. Copilot's reviews here are **informational only** — they do **not** approve PRs and do **not** satisfy branch protection.

---

## Project context

`tailwindcss-obfuscator` is a **public OSS package shipped on npm** that thousands of downstream projects install. Any malicious code merged into `main` propagates through `npm publish` to the entire downstream user base — this is a high-value supply-chain attack target. Treat **every** PR (especially fork PRs from external contributors) as a potential injection vector. The cost of a missed false-negative is much higher than the cost of a false-positive comment.

## Review priorities, in order

1. **Security & supply-chain integrity** (this section, exhaustive list below)
2. **Public API stability** (no breaking change without `major` Changeset)
3. **Tailwind v3 + v4 compatibility**
4. **Test coverage and edge cases**
5. **Documentation alignment**
6. Cosmetic / style nits — last priority, only if items 1–5 are clean

## SECURITY — patterns to flag on every PR

For each diff, explicitly check and post inline comments for any of the following classes of concern. Always state the **file:line**, the **attack class**, and the **severity** (`critical` if it actively exploits, `high` if it could trivially be turned into one, `medium` for "suspicious", `low` for "smells off").

### Code-execution sinks

- `eval()`, `new Function()`, `vm.runInNewContext`, `vm.runInThisContext`
- `child_process.exec*` / `child_process.spawn*` whose first argument is built from a non-literal value
- `require()` / `import()` whose argument is computed at runtime from any data that crosses a network or filesystem boundary
- `unescape()`, `decodeURIComponent()` followed by execution
- Any code that downloads a payload at runtime and `eval`s it

### Shell-injection vectors

- Backticks, template literals, or string concatenation feeding a `child_process.exec*` call
- Any new shell script that interpolates `$()` or `${}` from a value not under maintainer control
- Use of `shell: true` in `child_process.spawn` with non-literal args

### Network exfiltration / unsolicited egress

- Any new outbound request (`fetch`, `http`, `https`, `axios`, `got`, `node-fetch`, raw `net.connect`, `dns.lookup` to a non-standard resolver) that wasn't there before
- Any **obfuscated URL**: base64-encoded, hex-encoded, char-code-built strings, or URL split across constants and concatenated at runtime
- Any "telemetry", "analytics", "phone-home", or "metrics" code added to a library that previously had none — `tailwindcss-obfuscator` does **not** ship telemetry; flag any addition as high severity
- Any new domain in a fetch URL — list it explicitly so the maintainer can decide

### Filesystem reach beyond the project root

- `../`-walking, `path.resolve` with non-literal segments
- Reads of `os.homedir()`, `~`, `~/.ssh/`, `~/.aws/`, `~/.npmrc`, `~/.config/`, `~/.gitconfig`
- Reads of environment variables holding tokens: `NPM_TOKEN`, `GITHUB_TOKEN`, `GH_TOKEN`, `AWS_*`, `*_API_KEY`, `*_SECRET`, `OPENAI_*`, `ANTHROPIC_*`
- Writes outside `cwd()` / the build output directory

### npm lifecycle hooks (extreme blast radius)

- ANY new `postinstall`, `preinstall`, `install`, `prepare`, `prepublishOnly`, `prepublish`, `prerestart`, `prestart` script in any `package.json` in the diff
- These run on every downstream `npm install` of the package — flag in **critical** unless the rationale is documented in the PR body and reviewed by the maintainer

### New dependencies

For every new line in `package.json` `"dependencies"` or `"devDependencies"`:

- Cross-check on npm: download count (< 10k/week → suspicious), maintainer reputation, last publish date, source repo link, total versions
- **Typosquats**: `reqeust`, `axios-http`, `loadash`, `expreSs`, `react-domn`, `commandr`
- **Namespace squats**: `@types/whatever-fake`, packages from unknown orgs imitating popular ones
- **New packages** (< 6 months old, no clear track record) → flag medium
- **Switched maintainers**: package recently changed owner → flag high
- **Suspicious version pinning**: `^*`, `latest`, `>=0.0.0`, or downgrade to a much older version of an established package

### Lockfile diff (`pnpm-lock.yaml`)

- Any new transitive dep that doesn't trace back to a direct `package.json` change in the same PR — could be a poisoned transitive
- Resolved URLs pointing anywhere other than `https://registry.npmjs.org/...` → critical
- Versions of widely-used packages downgrading sharply → high

### Encoded payloads in source

- Base64 / hex / unicode-escape / `String.fromCharCode(...)` strings longer than ~40 characters without a documented purpose → high
- Strings split across multiple constants then concatenated at runtime, especially if the result looks like a URL, command, or credential → high
- Long opaque blobs in JSON files → flag for inspection

### Disabled checks (smell)

Each instance must have a justification in the PR body, otherwise flag medium:

- `// eslint-disable-next-line` / `// eslint-disable` / `// eslint-disable-line`
- `// @ts-ignore` / `// @ts-expect-error` / `// @ts-nocheck`
- `it.skip(...)` / `describe.skip(...)` / `test.skip(...)` / `xit(...)`
- `--no-verify` mentioned anywhere
- `if (process.env.CI)` paths that bypass tests
- Conditionals that hide branches from coverage tools

### GitHub Actions / workflow changes (`.github/workflows/**`)

These run with repository secrets and can publish to npm. Apply the strictest scrutiny:

- Use of `pull_request_target` without an inline comment explaining why. This trigger gives the workflow access to repo secrets even on PRs from forks — the **#1 GitHub Actions supply-chain attack vector ("pwn requests")**
- `actions/checkout@v4` with `ref: ${{ github.event.pull_request.head.sha }}` combined with `pull_request_target` — pulls untrusted code into a privileged context, **never allowed**
- Missing `permissions:` block at job or workflow level (defaults to `write-all` token — too broad)
- Use of unpinned third-party actions. The repo allowlist is currently: `actions/*`, `pnpm/action-setup@*`, `changesets/action@*`, `github/codeql-action/*` — anything else must be added to the allowlist via `gh api repos/.../actions/permissions/selected-actions` first
- Secret usage (`${{ secrets.* }}`) inside any step that uses `pull_request_target` or any third-party action that hasn't been audited
- Shell scripts (`run: |`) that interpolate `${{ github.event.pull_request.title }}`, `body`, `head_ref`, `head.label`, etc., directly into commands → command-injection via PR metadata
- New workflow that runs on `issue_comment` and acts on slash-commands — make sure the trigger checks the commenter's role/permissions
- Any change that grants a workflow `id-token: write` or `packages: write` without a documented use case (these can mint OIDC tokens to publish to npm or to other registries)

### CODEOWNERS changes (`.github/CODEOWNERS`)

ANY change to CODEOWNERS is a **privileged action**. Flag if anyone other than `@josedacosta` is added as a code owner — that would let them satisfy the CODEOWNER review gate and bypass the maintainer. **Never approve such a change without explicit maintainer sign-off in the PR body.**

### Author trust signals (include in summary)

When reviewing a PR from a non-maintainer, include in the high-level summary the following facts so the maintainer can weigh trust:

- Is this the contributor's first PR on this repo? (yes/no)
- GitHub account age (< 1 year is a yellow flag)
- Number of public repos with > 5 stars (proxy for community standing)
- Are commits signed (verified)? Unsigned commits are not a deal-breaker but worth noting
- Any history of merged PRs in adjacent OSS projects?

## Public API stability

Any change in `packages/tailwindcss-obfuscator/src/**` to:

- An exported function signature (parameters, return type)
- An exported type or interface
- The `package.json` `exports` field
- The CLI command shape (`tw-obfuscator`)

…requires either a `minor` or `major` Changeset. If the PR adds the change without an appropriate Changeset, post a comment requesting one.

## Tailwind v3 + v4 compatibility

Any new code path in `packages/tailwindcss-obfuscator/src/**` must consider both Tailwind versions. Flag if a change works only on v4 (or only on v3) without an explicit guard.

## Test coverage

For source changes in `packages/tailwindcss-obfuscator/src/**`:

- Verify a corresponding test exists (or is added)
- Verify the test imports from `src/`, not `dist/`
- Suggest adversarial cases: malformed input, deeply nested patterns, very long class lists

## Documentation

For changes that touch user-facing behaviour, verify `docs/**` is updated (the relevant guide page, the options reference, the CHANGELOG entry via Changeset). Code samples in `docs/**` must be valid for the target framework.

## What to skip

Do NOT comment on:

- Generated paths: `**/dist/**`, `**/.next/**`, `**/.nuxt/**`, `**/.svelte-kit/**`, `**/.astro/**`, `**/coverage/**`, `pnpm-lock.yaml` (except for the supply-chain checks above), `**/CHANGELOG.md` (auto-generated), `docs/.vitepress/dist/**`, `docs/.vitepress/cache/**`
- Local-only directories: `jose/**`, `reports/**` (gitignored, never shipped)
- Changesets entries (`.changeset/*.md`) — content is the contributor's choice

## Tone and format

- Be concrete: cite file:line, suggest the exact fix
- Be calibrated: don't tag a typo as "critical"; don't bury a real injection vector under nits
- Always provide the **summary first**, then inline comments. The summary must list the security-relevant findings up top, even if there are no other findings
- French is acceptable in maintainer-facing comments (the maintainer is French) but English is preferred since the project is OSS-international

## Final reminder

Copilot does **not** decide whether the PR is merged. The maintainer reads your review, weighs it, and decides. Your value is signal: the more concrete and specific the smell, the easier it is for the maintainer to act. Vague reviews waste his time; missed injection vectors put thousands of downstream users at risk.
