# Maintainers' Setup Checklist

Everything you need to know to clone-and-go on this repository: which GitHub settings are wired via API, which ones are UI-only, where the secrets live, and the npm publication flow.

## TL;DR — current state

| Page                                | What's set                                                                                                                                                                                    |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **General**                         | public, MIT, description + homepage = docs site, 20 topics, no wiki / no projects, discussions on, issues on                                                                                  |
| **General → Pull Requests**         | squash-only, auto-merge on, "Always suggest updating PRs", auto-delete head branches, PR title is squash commit title                                                                         |
| **Branches → `main` protection**    | linear history, no force-push, no deletions, conversation resolution required, CODEOWNERS review required, 0 reviewers (solo maintainer), required status checks (ci.yml) — admins can bypass |
| **Actions → General**               | enabled, default permissions = read, fork PR workflows = require approval                                                                                                                     |
| **Pages**                           | source = GitHub Actions, URL = <https://josedacosta.github.io/tailwindcss-obfuscator/>, HTTPS enforced                                                                                        |
| **Code security → Dependabot**      | disabled (project-wide preference, manual `pnpm update --latest -r`)                                                                                                                          |
| **Code security → Secret scanning** | enabled, push protection enabled                                                                                                                                                              |
| **Secrets and variables → Actions** | empty — `NPM_TOKEN` to be added before the first npm publish                                                                                                                                  |

## Web UI — manual settings (no API)

A handful of toggles are not exposed by the REST API. Apply these once via the web UI:

### About panel (right-hand sidebar)

Visit `https://github.com/josedacosta/tailwindcss-obfuscator` → ⚙️ next to "About" → tick / untick:

- ✅ **Releases** — keep ticked. Changesets publishes notes here when v1.x ships.
- ❌ **Packages** — untick. We publish to [npmjs.org](https://www.npmjs.com/package/tailwindcss-obfuscator), not to GitHub Packages.
- ✅ **Deployments** — keep ticked. The GitHub Pages deployment shows up here.

### Settings → Pages

- **Source**: select "GitHub Actions" (not "Deploy from a branch").
- The [`.github/workflows/docs.yml`](https://github.com/josedacosta/tailwindcss-obfuscator/blob/main/.github/workflows/docs.yml) workflow builds the VitePress site from `docs/` on every push to `main` touching `docs/**`.

### Settings → Code and automation → Tags

- No tag protection rules. Changesets-managed tags (`v1.2.3`) are created by the Release workflow.

### Settings → Webhooks / Integrations

- No webhooks. No GitHub Apps required beyond the default ones.

## Reproducible commands (gh CLI)

The settings below are wired via API and can be re-applied if they ever drift.

### General edit

```bash
gh repo edit josedacosta/tailwindcss-obfuscator \
  --description "Obfuscate Tailwind CSS class names at build time. Vite, Webpack, Rollup, esbuild, Next.js, Nuxt, SvelteKit, Astro, Solid, Qwik, React Router 7, TanStack Router. Tailwind v3 + v4." \
  --homepage "https://josedacosta.github.io/tailwindcss-obfuscator/" \
  --enable-issues --enable-discussions \
  --enable-wiki=false --enable-projects=false \
  --delete-branch-on-merge \
  --enable-merge-commit=false --enable-rebase-merge=false --enable-squash-merge \
  --add-topic tailwindcss --add-topic obfuscator --add-topic css \
  --add-topic vite --add-topic webpack --add-topic rollup \
  --add-topic nextjs --add-topic nuxt --add-topic sveltekit \
  --add-topic astro --add-topic react-router --add-topic tanstack-router \
  --add-topic mangle --add-topic minify --add-topic typescript
```

### Branch protection — `main`

```bash
gh api -X PUT repos/josedacosta/tailwindcss-obfuscator/branches/main/protection \
  --input - <<'EOF'
{
  "required_status_checks": null,
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 0,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": true,
  "required_linear_history": true
}
EOF
```

> **Why `required_approving_review_count: 0`** — solo maintainer reality. The other guardrails (CODEOWNERS, conversation resolution, required CI status checks once green, no force-push, linear history) are enough. Set this back to `1` if a co-maintainer is added.

### Actions permissions

```bash
gh api -X PUT repos/josedacosta/tailwindcss-obfuscator/actions/permissions/workflow \
  -f default_workflow_permissions=read \
  -F can_approve_pull_request_reviews=false
```

### Dependabot — explicitly OFF

```bash
gh api -X DELETE repos/josedacosta/tailwindcss-obfuscator/automated-security-fixes
gh api -X DELETE repos/josedacosta/tailwindcss-obfuscator/vulnerability-alerts
```

### GitHub Pages

```bash
gh api -X POST repos/josedacosta/tailwindcss-obfuscator/pages -f build_type=workflow
```

## npm publication

The package lives at <https://www.npmjs.com/package/tailwindcss-obfuscator>, owned by the npm account [`~josedacosta`](https://www.npmjs.com/~josedacosta).

The pipeline is fully automated **once the one-time setup is done**: every PR with a `.changeset/*.md` file produces a new published version on npm — the maintainer never touches `npm publish` directly after that.

### One-time setup (do this exactly once, ever)

#### 1. Verify the dry-run is clean

```bash
pnpm --filter tailwindcss-obfuscator build
pnpm pkg:publish:dry
```

Expected: tarball ~1.2 MB, 59 files, all under `dist/` plus `package.json` and `README.md`. If a file is missing or extra, fix the package's `files` field before going further.

#### 2. Reserve the package name on npm

The first publish has to be done locally with your own npm credentials — Changesets will take over for every subsequent version.

```bash
npm login --scope= --auth-type=web
# (opens a browser, log in as josedacosta)

pnpm pkg:publish:dry             # last sanity check
pnpm pkg:publish                 # actually publishes the bootstrap version to npm
```

After this command, <https://www.npmjs.com/package/tailwindcss-obfuscator> displays the freshly published version (the bootstrap publish was `2.0.0`; subsequent releases are batched by Changesets — see `RELEASING.md`).

#### 3. Create the npm automation token

Go to <https://www.npmjs.com/settings/josedacosta/tokens> → **Generate New Token** → **Granular access token**:

- **Token name**: `tailwindcss-obfuscator-ci`
- **Expiration**: 90 days (rotate every quarter)
- **Permissions**: Read and write
- **Packages**: `tailwindcss-obfuscator` (this package only)
- **Scopes**: leave blank
- **Allowed IP ranges**: leave blank (GitHub Actions IP space is too broad)

Copy the token (starts with `npm_`).

#### 4. Add the token as a GitHub Actions secret

```bash
gh secret set NPM_TOKEN -R josedacosta/tailwindcss-obfuscator
# Paste the npm_ token when prompted, then ENTER, Ctrl-D
```

Verify:

```bash
gh secret list -R josedacosta/tailwindcss-obfuscator | grep NPM_TOKEN
# NPM_TOKEN  Updated 2026-04-28
```

#### 5. (Optional) Verify the release workflow can authenticate

Trigger the workflow manually with a no-op:

```bash
gh workflow run release.yml -R josedacosta/tailwindcss-obfuscator
gh run watch -R josedacosta/tailwindcss-obfuscator
```

It should print "no changesets found, skipping" and exit 0.

### Subsequent releases (every version after 1.0.0)

You never run `npm publish` again. The flow is:

1. **Author the change** in a feature branch and add a changeset:

   ```bash
   pnpm changeset
   ```

   Pick `patch` / `minor` / `major` and write a one-liner. A `.changeset/<adjective>-<noun>.md` file is created.

2. **Open the PR**, get it merged into `main` (squash, as usual).

3. The **Release workflow** runs automatically and:
   - **If pending changesets exist**, opens (or updates) a PR titled `chore(release): version packages`. That PR contains:
     - the version bump in `packages/tailwindcss-obfuscator/package.json`
     - the regenerated `CHANGELOG.md` entries
     - the consumed `.changeset/*.md` files (deleted)

4. **Review and merge** the version PR. The workflow runs again on `main`:
   - It detects there are no changesets left
   - Runs `pnpm release` → builds the package and runs `changeset publish`
   - `changeset publish` calls `npm publish --access public --provenance` for every package whose version was bumped
   - Tags the release on GitHub (`v1.2.3`)
   - Creates the GitHub Release entry with the changelog excerpt

The end result on npm: a new version with a [signed provenance attestation](https://docs.npmjs.com/generating-provenance-statements) (`npm view tailwindcss-obfuscator dist-tags` will show the new version).

> [!CAUTION]
> Never edit `packages/tailwindcss-obfuscator/package.json#version` or `CHANGELOG.md` by hand. Both are owned by Changesets — manual edits will conflict with the next "Version Packages" PR and break the release pipeline.

### Token rotation

Every 90 days the `NPM_TOKEN` expires. Repeat steps 3 and 4 with a fresh granular token. The old token can be revoked from the same npm tokens page.

### Deprecating / unpublishing

- **Deprecate a bad version** (preferred):
  ```bash
  npm deprecate tailwindcss-obfuscator@1.2.3 "Critical bug — upgrade to 1.2.4"
  ```
- **Unpublish a version** (last resort, allowed within 72 h of publish only):
  ```bash
  npm unpublish tailwindcss-obfuscator@1.2.3
  ```
  Don't unpublish older versions; downstream lockfiles will break.

## Local quality gates (run before opening a PR)

```bash
pnpm lint && pnpm format:check
pnpm --filter tailwindcss-obfuscator typecheck
pnpm test
node scripts/verify-obfuscation.mjs
```

## Local dev preview of the docs site

```bash
pnpm docs:dev      # starts Vite at http://localhost:5173/tailwindcss-obfuscator/
pnpm docs:build    # static output in docs/.vitepress/dist
pnpm docs:preview  # serves the built site
```

## CI billing

> [!IMPORTANT]
> If you see "recent account payments have failed or your spending limit needs to be increased" on workflow runs, the GitHub Actions billing on the maintainer's account is blocked. Visit <https://github.com/settings/billing> and update the payment method or raise the spending limit. Workflow YAML files don't need any change — they will start running again as soon as billing is restored.
