#!/bin/bash
for repo in "$@"; do
  echo "=== $repo workflows ==="
  gh api repos/Taurus-Ai-Corp/$repo/contents/.github/workflows --jq '.[] | "\(.name) \(.path)"' 2>/dev/null || true
  echo
done
