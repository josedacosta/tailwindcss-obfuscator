# Changesets

This directory contains [changesets](https://github.com/changesets/changesets) used to version and publish the `tailwindcss-obfuscator` package.

## Adding a changeset

When you make a change that should appear in the changelog or trigger a release, run:

```bash
pnpm changeset
```

You will be prompted to:

1. Select the package(s) affected.
2. Pick the bump type (`patch`, `minor`, `major`).
3. Write a short summary that will end up in `CHANGELOG.md`.

Commit the resulting markdown file alongside your code change.

## Releasing

The `Release` GitHub Actions workflow consumes changesets on `main`:

- If pending changesets exist, it opens a "Version Packages" PR that bumps versions and updates the changelog.
- When that PR is merged, the workflow publishes the new version to npm.

You should never edit `package.json` versions or `CHANGELOG.md` by hand.
