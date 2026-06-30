#!/bin/bash
# Lead pull #2 — better sources
# Outputs raw .json to /Users/taurus_ai/Documents/Nexus-Platform/04-CONTENT-MARKETING/leads-2026-06-16/
set -e
DEPLOY="nexus-creative-editorial-j9l7m1id3-taurus-s-projects.vercel.app"
OUT="/Users/taurus_ai/Documents/Nexus-Platform/04-CONTENT-MARKETING/leads-2026-06-16"
TS="20260616-1710"

echo "=== Lead Pull #2 ==="

# Source A: "Ask HN: Who's Hiring" — the most reliable B2B lead source on the internet
# 100s of companies hiring = active buyers, fresh signal
vercel curl /api/research --deployment $DEPLOY -- \
  --request POST --header "Content-Type: application/json" \
  --data '{"query":"hiring","sources":["rss"],"url":"https://hnrss.org/ask_hn","limit":50}' \
  > "$OUT/raw-askhn-hiring-$TS.json" 2>&1
echo "✓ saved: raw-askhn-hiring-$TS.json"

# Source B: Indie Hackers — founders actively building & promoting products
vercel curl /api/research --deployment $DEPLOY -- \
  --request POST --header "Content-Type: application/json" \
  --data '{"query":"indie hackers","sources":["rss"],"url":"https://www.indiehackers.com/feed.xml","limit":40}' \
  > "$OUT/raw-indiehackers-$TS.json" 2>&1
echo "✓ saved: raw-indiehackers-$TS.json"

# Source C: Designer News — for Nexus Creative (MENA design agency prospects)
vercel curl /api/research --deployment $DEPLOY -- \
  --request POST --header "Content-Type: application/json" \
  --data '{"query":"design jobs","sources":["rss"],"url":"https://www.designernews.co/?format=rss","limit":30}' \
  > "$OUT/raw-designernews-$TS.json" 2>&1
echo "✓ saved: raw-designernews-$TS.json"

echo
echo "=== File sizes ==="
ls -lh "$OUT"/raw-*-$TS.json
