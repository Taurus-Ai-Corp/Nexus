#!/bin/bash
mkdir -p workflows
for repo in "$@"; do
  mkdir -p workflows/$repo
  files=$(gh api repos/Taurus-Ai-Corp/$repo/contents/.github/workflows --jq '.[].download_url' 2>/dev/null || true)
  for url in $files; do
    fname=$(basename "$url")
    curl -sL "$url" -o "workflows/$repo/$fname" || true
    echo "$repo/$fname"
  done
done
