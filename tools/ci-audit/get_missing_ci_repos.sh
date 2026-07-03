#!/bin/bash
for repo in "$@"; do
  wfs=$(gh api repos/Taurus-Ai-Corp/$repo/contents/.github/workflows --jq 'length' 2>/dev/null || echo 0)
  echo "$repo: workflows=$wfs"
done
