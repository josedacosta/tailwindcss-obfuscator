#!/usr/bin/env bash
# Pre-release dry-run gate.
# Compares the actual `pnpm pack` file list against scripts/expected-tarball.json.
# Fails (exit 1) on any unexpected addition or removal — forcing the maintainer
# to consciously update the baseline in the same PR that changes the published
# file set. Catches accidental inclusion of secrets, test fixtures, source maps
# we forgot to ship, or a missing dist file.
#
# Hash normalisation : tsup emits shared-code chunks with a content-hash
# filename (eg. chunk-PL3IHV3V.js). The hash changes with code changes, so
# we normalise both sides to chunk-*.{js,cjs,mjs} before diffing.
#
# Run by .github/workflows/publish.yml as a pre-flight check before
# changesets/action publishes. Also runnable locally :
#   bash .github/scripts/check-tarball-contents.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PACKAGE_DIR="$REPO_ROOT/packages/tailwindcss-obfuscator"
EXPECTED_JSON="$REPO_ROOT/scripts/expected-tarball.json"
PACK_DIR="$(mktemp -d)"
trap 'rm -rf "$PACK_DIR"' EXIT

echo "──────────────────────────────────────────────────────────────"
echo " Tarball contents pre-flight gate"
echo " baseline:  scripts/expected-tarball.json"
echo " pack dir:  $PACK_DIR"
echo "──────────────────────────────────────────────────────────────"

# Pack the package as it would be uploaded to npm.
echo ""
echo "▶ 1/3 Packing tarball…"
(cd "$PACKAGE_DIR" && pnpm pack --pack-destination "$PACK_DIR" > /dev/null)
TARBALL="$(ls "$PACK_DIR"/tailwindcss-obfuscator-*.tgz | head -n1)"
if [ ! -f "$TARBALL" ]; then
  echo "❌ FAIL: pnpm pack did not produce a tarball in $PACK_DIR"
  exit 1
fi
TARBALL_SIZE_KB=$(($(wc -c < "$TARBALL") / 1024))
echo "   tarball: $(basename "$TARBALL") (${TARBALL_SIZE_KB} KB)"

# Extract the file list, normalise chunk hashes.
echo "▶ 2/3 Listing files (with hash normalisation)…"
ACTUAL="$PACK_DIR/actual-files.txt"
tar -tzf "$TARBALL" | sort \
  | sed -E 's|/chunk-[A-Za-z0-9_-]+\.(js\|cjs\|mjs)|/chunk-*.\1|g' \
  > "$ACTUAL"
ACTUAL_COUNT=$(wc -l < "$ACTUAL" | tr -d ' ')
echo "   actual file count: $ACTUAL_COUNT"

# Read the expected baseline + envelope (count + size range).
EXPECTED_COUNT=$(node -e "const j=require('$EXPECTED_JSON');console.log(j.expectedFileCount)")
SIZE_MIN_KB=$(node -e "const j=require('$EXPECTED_JSON');console.log(j.expectedSizeKBMin)")
SIZE_MAX_KB=$(node -e "const j=require('$EXPECTED_JSON');console.log(j.expectedSizeKBMax)")
EXPECTED="$PACK_DIR/expected-files.txt"
node -e "const j=require('$EXPECTED_JSON');console.log(j.files.join('\n'))" | sort > "$EXPECTED"
echo "   expected file count: $EXPECTED_COUNT (size envelope: $SIZE_MIN_KB-$SIZE_MAX_KB KB)"

# Diff the file lists.
echo "▶ 3/3 Diffing…"
ADDED=$(comm -23 "$ACTUAL" "$EXPECTED" || true)
REMOVED=$(comm -13 "$ACTUAL" "$EXPECTED" || true)
DRIFT=0

if [ -n "$ADDED" ]; then
  DRIFT=1
  echo ""
  echo "❌ Files in tarball but NOT in baseline (${ADDED:+$(echo "$ADDED" | wc -l | tr -d ' ')} files):"
  echo "$ADDED" | sed 's/^/  + /'
fi

if [ -n "$REMOVED" ]; then
  DRIFT=1
  echo ""
  echo "❌ Files in baseline but NOT in tarball (${REMOVED:+$(echo "$REMOVED" | wc -l | tr -d ' ')} files):"
  echo "$REMOVED" | sed 's/^/  - /'
fi

# Envelope check : guard against a sudden 5x bloat (eg. accidental node_modules
# inclusion would multiply the size, even if file count looks OK).
if [ "$TARBALL_SIZE_KB" -lt "$SIZE_MIN_KB" ] || [ "$TARBALL_SIZE_KB" -gt "$SIZE_MAX_KB" ]; then
  DRIFT=1
  echo ""
  echo "❌ Tarball size ${TARBALL_SIZE_KB} KB is outside the expected envelope ${SIZE_MIN_KB}-${SIZE_MAX_KB} KB."
fi

if [ "$DRIFT" -eq 1 ]; then
  echo ""
  echo "──────────────────────────────────────────────────────────────"
  echo "  ❌ DRIFT DETECTED — see additions / removals above."
  echo ""
  echo "  If the change is intentional :"
  echo "    1. Open scripts/expected-tarball.json"
  echo "    2. Update the 'files' array (add/remove entries)"
  echo "    3. Update lastUpdated + lastUpdatedFor to the new version"
  echo "    4. Update expectedFileCount + expectedSizeKBMin/Max"
  echo "    5. Commit in the SAME PR that changes the publish surface."
  echo "──────────────────────────────────────────────────────────────"
  exit 1
fi

echo ""
echo "──────────────────────────────────────────────────────────────"
echo "  ✅ Tarball contents match expected baseline."
echo "  Files: $ACTUAL_COUNT, size: ${TARBALL_SIZE_KB} KB."
echo "──────────────────────────────────────────────────────────────"
