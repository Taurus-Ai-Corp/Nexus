#!/bin/bash
set -e
DEPLOY="nexus-creative-editorial-j9l7m1id3-taurus-s-projects.vercel.app"
OUT="/Users/taurus_ai/Documents/Nexus-Platform/04-CONTENT-MARKETING/leads-2026-06-16"
TS="20260616-1655"
echo "=== Lead Scraping via /api/research ==="
echo "Out: $OUT"
echo "Time: $TS"
echo ""
# Web agencies in MENA from a public design directory
echo "[1/3] MENA/Design agencies via awwwards directory ..."
vercel curl /api/research --deployment $DEPLOY -- \
  --request POST \
  --header "Content-Type: application/json" \
  --data '{"query":"design agencies UAE","sources":["web"],"url":"https://www.awwwards.com/directory/agencies/","limit":3000}' \
  > "$OUT/raw-awwwards-agencies-$TS.json" 2>&1
echo "  saved: $OUT/raw-awwwards-agencies-$TS.json"

# Web3 builders from HN
echo "[2/3] Web3/PQC-active builders from HN frontpage ..."
vercel curl /api/research --deployment $DEPLOY -- \
  --request POST \
  --header "Content-Type: application/json" \
  --data '{"query":"crypto web3 security","sources":["rss"],"url":"https://hnrss.org/frontpage","limit":30}' \
  > "$OUT/raw-hn-frontpage-$TS.json" 2>&1
echo "  saved: $OUT/raw-hn-frontpage-$TS.json"

# SMB marketers from Product Hunt
echo "[3/3] Active marketers from Product Hunt ..."
vercel curl /api/research --deployment $DEPLOY -- \
  --request POST \
  --header "Content-Type: application/json" \
  --data '{"query":"marketing tools","sources":["rss"],"url":"https://www.producthunt.com/feed","limit":40}' \
  > "$OUT/raw-ph-launches-$TS.json" 2>&1
echo "  saved: $OUT/raw-ph-launches-$TS.json"

echo ""
echo "=== ALL DONE ==="
ls -lh $OUT/raw-*.json
