#!/usr/bin/env bash
# Tarball smoke test — verify that the published tarball contains every entry
# point the package.json#exports map advertises, and that each one imports
# cleanly from a fresh node_modules. Catches `exports` map drift and missing
# dist files BEFORE the artefact ever reaches npm.
#
# Run by .github/workflows/ci.yml on every PR to main, and locally via
# `bash .github/scripts/test-tarball.sh`.
#
# Required env: none. Run from the repo root.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PACKAGE_DIR="$REPO_ROOT/packages/tailwindcss-obfuscator"
SMOKE_DIR="$(mktemp -d)"
trap 'rm -rf "$SMOKE_DIR"' EXIT

echo "──────────────────────────────────────────────────────────────"
echo " Tarball smoke test"
echo " repo:       $REPO_ROOT"
echo " smoke dir:  $SMOKE_DIR"
echo "──────────────────────────────────────────────────────────────"

# 1. Build the package fresh — `pnpm pack` will re-pack stale dist otherwise.
echo ""
echo "▶ 1/4 Building tailwindcss-obfuscator…"
(cd "$REPO_ROOT" && pnpm --filter tailwindcss-obfuscator build > /dev/null)

# 2. Pack the tarball into the smoke directory.
echo "▶ 2/4 Packing tarball…"
(cd "$PACKAGE_DIR" && pnpm pack --pack-destination "$SMOKE_DIR" > /dev/null)
TARBALL="$(ls "$SMOKE_DIR"/tailwindcss-obfuscator-*.tgz | head -n1)"
if [ ! -f "$TARBALL" ]; then
  echo "❌ FAIL: pnpm pack did not produce a tarball in $SMOKE_DIR"
  exit 1
fi
TARBALL_SIZE_KB=$(($(wc -c < "$TARBALL") / 1024))
echo "   tarball: $(basename "$TARBALL") (${TARBALL_SIZE_KB} KB)"

# 3. Install the tarball into a clean directory (no workspace, no monorepo
#    resolution — exactly what a downstream consumer would see).
echo "▶ 3/4 Installing tarball into a clean directory…"
mkdir -p "$SMOKE_DIR/consumer"
cd "$SMOKE_DIR/consumer"
npm init -y > /dev/null
# Use npm (not pnpm) on purpose — most consumers use npm or yarn, this
# catches the broadest class of install bugs.
npm install --no-save --no-audit --no-fund "$TARBALL" > /dev/null 2>&1
if [ ! -d "node_modules/tailwindcss-obfuscator" ]; then
  echo "❌ FAIL: tarball failed to install into clean consumer directory"
  exit 1
fi

# 4. For every entry in package.json#exports, verify both ESM (import) and
#    CJS (require) resolve and load without throwing. The CLI entry is
#    invoked with --version to ensure the binary is wired correctly.
echo "▶ 4/4 Verifying every package.json#exports entry…"
echo ""
ENTRIES=(
  "tailwindcss-obfuscator"
  "tailwindcss-obfuscator/vite"
  "tailwindcss-obfuscator/webpack"
  "tailwindcss-obfuscator/rollup"
  "tailwindcss-obfuscator/esbuild"
  "tailwindcss-obfuscator/rspack"
  "tailwindcss-obfuscator/farm"
  "tailwindcss-obfuscator/nuxt"
  "tailwindcss-obfuscator/internals"
  "tailwindcss-obfuscator/cli"
)

FAILED=0
for ENTRY in "${ENTRIES[@]}"; do
  # ESM import — modern bundlers + Node ≥ 22 native ESM
  if node --input-type=module -e "import('$ENTRY').then((m) => { if (Object.keys(m).length === 0) throw new Error('empty module exports'); })" 2>/tmp/esm-err; then
    ESM_OK="✅"
  else
    ESM_OK="❌  $(cat /tmp/esm-err | head -3 | tr '\n' ' ')"
    FAILED=$((FAILED + 1))
  fi

  # CJS require — older bundlers + Node CommonJS consumers
  if node --input-type=commonjs -e "const m = require('$ENTRY'); if (Object.keys(m).length === 0) throw new Error('empty module exports')" 2>/tmp/cjs-err; then
    CJS_OK="✅"
  else
    CJS_OK="❌  $(cat /tmp/cjs-err | head -3 | tr '\n' ' ')"
    FAILED=$((FAILED + 1))
  fi

  printf "  %-44s ESM: %-3s CJS: %-3s\n" "$ENTRY" "$ESM_OK" "$CJS_OK"
done

# Verify the CLI binary is wired and runs `--version`.
if [ -x "node_modules/.bin/tw-obfuscator" ]; then
  CLI_VERSION="$(node_modules/.bin/tw-obfuscator --version 2>&1 | head -1)"
  echo "  tw-obfuscator (bin) → version: $CLI_VERSION"
else
  echo "  ❌ tw-obfuscator binary not found in node_modules/.bin/"
  FAILED=$((FAILED + 1))
fi

echo ""
if [ "$FAILED" -gt 0 ]; then
  echo "──────────────────────────────────────────────────────────────"
  echo "  ❌ SMOKE TEST FAILED — $FAILED entry / binary errors above"
  echo "──────────────────────────────────────────────────────────────"
  exit 1
fi

echo "──────────────────────────────────────────────────────────────"
echo "  ✅ SMOKE TEST PASSED — every package.json#exports entry resolves"
echo "──────────────────────────────────────────────────────────────"
