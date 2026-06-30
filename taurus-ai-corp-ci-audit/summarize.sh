#!/bin/bash
# Recent run status per repo (last 20) from raw_audit.json
jq -r '
  .[] |
  "\(.repo)",
  ( .runs | group_by(.conclusion) | map("  \(.[0].conclusion // .[0].status): \(length)") | join(" | ") ),
  ( .runs[:5] | map("    - \(.run_started_at) [\(.event)/\(.head_branch)] \(.conclusion // .status): \(.head_commit | split("\n")[0])") | join("\n") ),
  ""
' raw_audit.json
