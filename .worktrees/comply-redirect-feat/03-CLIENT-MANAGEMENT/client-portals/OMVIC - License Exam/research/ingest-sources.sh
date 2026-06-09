#!/usr/bin/env bash
# Bulk-ingest OMVIC legal + reference sources into active NotebookLM notebook.
# Prereq: run `notebooklm login` once to refresh browser session state.
# Target notebook: NeoVibe — OMVIC License Exam  (4b9c8a70-5a61-4dab-870a-680341634de1)

set -u
export PATH="$PATH:/opt/homebrew/bin:/Users/taurus_ai/Library/Python/3.9/bin"

NOTEBOOK_ID="4b9c8a70-5a61-4dab-870a-680341634de1"

echo "▶ Ensuring active notebook is NeoVibe — OMVIC License Exam..."
notebooklm use "$NOTEBOOK_ID" >/dev/null 2>&1

# Canonical primary-law + regulator sources. All public.
SOURCES=(
  # MVDA 2002 — the governing statute
  "https://www.ontario.ca/laws/statute/02m30"
  # Regulation 333/08 — General (MVDA)
  "https://www.ontario.ca/laws/regulation/080333"
  # Regulation 332/08 — Code of Ethics (MVDA)
  "https://www.ontario.ca/laws/regulation/080332"
  # Consumer Protection Act, 2002
  "https://www.ontario.ca/laws/statute/02c30"
  # CPA General Regulation 17/05
  "https://www.ontario.ca/laws/regulation/050017"
  # OMVIC — About the regulator
  "https://www.omvic.ca/who-we-are/"
  # OMVIC — Becoming a registrant (candidate info)
  "https://www.omvic.ca/become-a-registrant/"
)

for URL in "${SOURCES[@]}"; do
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "▶ Ingesting: $URL"
  notebooklm source add "$URL" 2>&1 | tee -a ingest.log
  # Rate-limit: NotebookLM throttles rapid adds
  sleep 5
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ Done. Verifying sources in notebook:"
notebooklm source list 2>&1
