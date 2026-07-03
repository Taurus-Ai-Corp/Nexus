#!/bin/bash
for repo in "$@"; do
  echo "=== $repo root ==="
  gh api repos/Taurus-Ai-Corp/$repo/contents --jq '.[] | select(.type=="file") | .name' 2>/dev/null | sort || true
  echo
done
