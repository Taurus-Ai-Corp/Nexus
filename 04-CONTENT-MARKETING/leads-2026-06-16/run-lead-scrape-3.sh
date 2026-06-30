#!/bin/bash
set -e
DEPLOY="nexus-creative-editorial-j9l7m1id3-taurus-s-projects.vercel.app"
OUT="/Users/taurus_ai/Documents/Nexus-Platform/04-CONTENT-MARKETING/leads-2026-06-16"
TS="20260616-1720"

echo "=== Lead Pull #3 ==="

# A) "Ask HN: Who's Hiring" — try direct Hacker News RSS
vercel curl /api/research --deployment $DEPLOY -- \
  --request POST --header "Content-Type: application/json" \
  --data '{"query":"hiring","sources":["rss"],"url":"https://hnrss.org/newest?points=1","limit":50}' \
  > "$OUT/raw-hn-newest-$TS.json" 2>&1
echo "✓ HN newest"

# B) TechCrunch Startups RSS — for fresh funding rounds + launches
vercel curl /api/research --deployment $DEPLOY -- \
  --request POST --header "Content-Type: application/json" \
  --data '{"query":"startups funding","sources":["rss"],"url":"https://techcrunch.com/category/startups/feed/","limit":40}' \
  > "$OUT/raw-tc-startups-$TS.json" 2>&1
echo "✓ TC startups"

# C) Crunchbase News public RSS — for funding data
vercel curl /api/research --deployment $DEPLOY -- \
  --request POST --header "Content-Type: application/json" \
  --data '{"query":"funding rounds","sources":["rss"],"url":"https://news.crunchbase.com/feed/","limit":40}' \
  > "$OUT/raw-crunchbase-news-$TS.json" 2>&1
echo "✓ Crunchbase News"

# D) Y Combinator's "Work at a Startup" feed — direct intent leads
vercel curl /api/research --deployment $DEPLOY -- \
  --request POST --header "Content-Type: application/json" \
  --data '{"query":"work at startup","sources":["rss"],"url":"https://www.workatastartup.com/companies.rss","limit":50}' \
  > "$OUT/raw-yc-companies-$TS.json" 2>&1
echo "✓ YC companies"

# E) BetaList public RSS — products about to launch = active buyers
vercel curl /api/research --deployment $DEPLOY -- \
  --request POST --header "Content-Type: application/json" \
  --data '{"query":"beta launches","sources":["rss"],"url":"https://betalist.com/feed","limit":30}' \
  > "$OUT/raw-betalist-$TS.json" 2>&1
echo "✓ BetaList"

echo
echo "=== File sizes ==="
ls -lh "$OUT"/raw-*-$TS.json | awk '{print $5, $9}'
