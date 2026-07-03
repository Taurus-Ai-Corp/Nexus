#!/bin/bash
for repo in "$@"; do
  echo "=== $repo open PRs ==="
  gh pr list -R Taurus-Ai-Corp/$repo --state open --json number,title,headRefName,url --jq '.[] | "#\(.number) [\(.headRefName)] \(.title) -> \(.url)"' 2>/dev/null || true
  echo
done
