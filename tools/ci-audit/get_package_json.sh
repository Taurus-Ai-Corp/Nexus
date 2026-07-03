#!/bin/bash
for repo in "$@"; do
  echo "=== $repo package.json ==="
  gh api repos/Taurus-Ai-Corp/$repo/contents/package.json --jq '.content' 2>/dev/null | base64 -d | jq '{name, version, type, scripts, packageManager, dependencies_keys: (.dependencies // {} | keys), devDependencies_keys: (.devDependencies // {} | keys)}' || true
  echo
done
