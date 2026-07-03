#!/bin/bash
for repo in "$@"; do
  echo "=== $repo recent failures ==="
  gh run list -R Taurus-Ai-Corp/$repo -L 5 --status failure 2>/dev/null || true
  echo
done
