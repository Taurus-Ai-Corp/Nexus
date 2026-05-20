#!/usr/bin/env bash
# =============================================================================
# NeoVibe — Meta Ads CLI script (PAUSED entities only)
# =============================================================================
#
# REVIEW BEFORE RUNNING. ALL ENTITIES ARE CREATED IN PAUSED STATE.
# This script does NOT launch ads. It builds the campaign skeleton for review.
#
# Requirements:
#   - pip install meta-ads          (CLI not yet installed in this env)
#   - export ACCESS_TOKEN=...       (Meta Marketing API token, NEVER inline)
#   - export AD_ACCOUNT_ID=act_...  (use a SEPARATE ad account from Mater Maria)
#   - export PAGE_ID=...            (NeoVibe Facebook Page ID, for ad creatives)
#   - export IG_ACTOR_ID=...        (NeoVibe Instagram account ID, optional)
#   - export PIXEL_ID=...           (NeoVibe Pixel — separate from Mater Maria)
#
# Hard rules:
#   - Never inline tokens. Reference $ACCESS_TOKEN / $AD_ACCOUNT_ID only.
#   - Never remove --status PAUSED without explicit human review.
#   - Reads use --output json --limit 10.
#   - Default --time-range last_7d on insights queries.
#
# Lines marked "# VERIFY:" use a flag whose exact name in the meta-ads CLI is
# uncertain. Cross-check against `meta ads --help` and the published spec
# before running. The intent is documented inline.
# =============================================================================

set -euo pipefail

# --- Preflight ---------------------------------------------------------------

: "${ACCESS_TOKEN:?ACCESS_TOKEN env var is required}"
: "${AD_ACCOUNT_ID:?AD_ACCOUNT_ID env var is required (e.g. act_1234567890)}"
: "${PAGE_ID:?PAGE_ID env var is required (NeoVibe FB Page)}"
: "${PIXEL_ID:?PIXEL_ID env var is required (NeoVibe Pixel — separate from Mater Maria)}"

# Sanity-check we are NOT pointed at the Mater Maria ad account.
if [[ "$AD_ACCOUNT_ID" == "act_MATERMARIA"* ]]; then
  echo "ERROR: AD_ACCOUNT_ID looks like the Mater Maria account. NeoVibe must use a separate account." >&2
  exit 1
fi

echo "Using ad account: $AD_ACCOUNT_ID"
echo "All entities will be created with --status PAUSED."
echo

# --- 1. Verify CLI + account access ------------------------------------------

meta ads account get \
  --account-id "$AD_ACCOUNT_ID" \
  --output json \
  --limit 10  # VERIFY: --limit may not apply to single-resource get; safe to drop if rejected

# --- 2. Create the campaign --------------------------------------------------

CAMPAIGN_NAME="NeoVibe Designers — Lead Gen Q2 2026"

CAMPAIGN_ID=$(meta ads campaign create \
  --account-id "$AD_ACCOUNT_ID" \
  --name "$CAMPAIGN_NAME" \
  --objective LEAD_GENERATION \
  --status PAUSED \
  --special-ad-categories "[]" \
  --buying-type AUCTION \
  --output json \
  | jq -r '.id')  # VERIFY: jq path; CLI may return {"campaign_id": "..."} instead of {"id": "..."}

echo "Created campaign: $CAMPAIGN_ID (PAUSED)"

# --- 3. Create the three ad sets (all PAUSED) --------------------------------

# 3a. Kerala — Cold
ADSET_KERALA=$(meta ads adset create \
  --account-id "$AD_ACCOUNT_ID" \
  --campaign-id "$CAMPAIGN_ID" \
  --name "Kerala Designers — Cold" \
  --status PAUSED \
  --daily-budget 2000 \
  --currency USD \
  --optimization-goal LEAD_GENERATION \
  --billing-event IMPRESSIONS \
  --bid-strategy LOWEST_COST_WITHOUT_CAP \
  --destination-type ON_AD \
  --targeting-file ./targeting/kerala-cold.json \
  --start-time "2026-05-15T00:00:00+05:30" \
  --output json \
  | jq -r '.id')  # VERIFY: --daily-budget unit may be cents (2000 = $20.00) per Meta convention

echo "Created ad set: Kerala Cold ($ADSET_KERALA, PAUSED)"

# 3b. UAE — Cold
ADSET_UAE=$(meta ads adset create \
  --account-id "$AD_ACCOUNT_ID" \
  --campaign-id "$CAMPAIGN_ID" \
  --name "UAE Designers — Cold" \
  --status PAUSED \
  --daily-budget 2500 \
  --currency USD \
  --optimization-goal LEAD_GENERATION \
  --billing-event IMPRESSIONS \
  --bid-strategy LOWEST_COST_WITHOUT_CAP \
  --destination-type ON_AD \
  --targeting-file ./targeting/uae-cold.json \
  --start-time "2026-05-15T00:00:00+04:00" \
  --output json \
  | jq -r '.id')

echo "Created ad set: UAE Cold ($ADSET_UAE, PAUSED)"

# 3c. Warm — Retargeting
ADSET_WARM=$(meta ads adset create \
  --account-id "$AD_ACCOUNT_ID" \
  --campaign-id "$CAMPAIGN_ID" \
  --name "NeoVibe Warm — Retargeting 30d" \
  --status PAUSED \
  --daily-budget 1500 \
  --currency USD \
  --optimization-goal LEAD_GENERATION \
  --billing-event IMPRESSIONS \
  --bid-strategy LOWEST_COST_WITHOUT_CAP \
  --destination-type ON_AD \
  --targeting-file ./targeting/warm-retargeting.json \
  --start-time "2026-05-15T00:00:00+04:00" \
  --output json \
  | jq -r '.id')

echo "Created ad set: Warm Retargeting ($ADSET_WARM, PAUSED)"

# --- 4. Lead form (one shared form) -----------------------------------------

# Lead form lives at the page level. Create once, reference by ID in all ads.
LEAD_FORM_ID=$(meta ads leadform create \
  --page-id "$PAGE_ID" \
  --name "NeoVibe Designer Application — Q2 2026" \
  --status DRAFT \
  --questions-file ./leadforms/neovibe-application.json \
  --privacy-policy-url "https://neovibe.taurusai.io/privacy" \
  --output json \
  | jq -r '.id')  # VERIFY: leadform subcommand name; may be "lead-form" with hyphen

echo "Created lead form: $LEAD_FORM_ID (DRAFT)"

# --- 5. Create the five ads (all PAUSED) -------------------------------------
# Each ad references one creative file in ./creatives/. Variants 1, 2, 4 are
# motion-friendly; 3 and 5 are static. Each ad uses --status PAUSED.
# Ads are placed across all three ad sets initially — the algo will redistribute.

create_ad () {
  local adset_id="$1"
  local ad_name="$2"
  local creative_file="$3"

  meta ads ad create \
    --account-id "$AD_ACCOUNT_ID" \
    --adset-id "$adset_id" \
    --name "$ad_name" \
    --status PAUSED \
    --creative-file "$creative_file" \
    --tracking-specs "[{\"action.type\":[\"offsite_conversion\"],\"fb_pixel\":[\"$PIXEL_ID\"]}]" \
    --output json \
    | jq -r '.id'  # VERIFY: --tracking-specs JSON shape; may need to be passed as file via --tracking-specs-file
}

# Variant 1 — Stop Stitching 7 Tools
AD_V1_K=$(create_ad "$ADSET_KERALA" "V1 — Stop Stitching 7 Tools — Kerala" ./creatives/v1-stop-stitching.json)
AD_V1_U=$(create_ad "$ADSET_UAE"    "V1 — Stop Stitching 7 Tools — UAE"    ./creatives/v1-stop-stitching.json)
AD_V1_W=$(create_ad "$ADSET_WARM"   "V1 — Stop Stitching 7 Tools — Warm"   ./creatives/v1-stop-stitching.json)

# Variant 2 — AI That Actually Ships Code
AD_V2_K=$(create_ad "$ADSET_KERALA" "V2 — AI Ships Code — Kerala" ./creatives/v2-ships-code.json)
AD_V2_U=$(create_ad "$ADSET_UAE"    "V2 — AI Ships Code — UAE"    ./creatives/v2-ships-code.json)
AD_V2_W=$(create_ad "$ADSET_WARM"   "V2 — AI Ships Code — Warm"   ./creatives/v2-ships-code.json)

# Variant 3 — Curated, Not Crowded
AD_V3_K=$(create_ad "$ADSET_KERALA" "V3 — Curated Not Crowded — Kerala" ./creatives/v3-curated.json)
AD_V3_U=$(create_ad "$ADSET_UAE"    "V3 — Curated Not Crowded — UAE"    ./creatives/v3-curated.json)
AD_V3_W=$(create_ad "$ADSET_WARM"   "V3 — Curated Not Crowded — Warm"   ./creatives/v3-curated.json)

# Variant 4 — Brief In, Component Out
AD_V4_K=$(create_ad "$ADSET_KERALA" "V4 — Brief to Component — Kerala" ./creatives/v4-brief-to-component.json)
AD_V4_U=$(create_ad "$ADSET_UAE"    "V4 — Brief to Component — UAE"    ./creatives/v4-brief-to-component.json)
AD_V4_W=$(create_ad "$ADSET_WARM"   "V4 — Brief to Component — Warm"   ./creatives/v4-brief-to-component.json)

# Variant 5 — Built by Freelancers (peer voice)
AD_V5_K=$(create_ad "$ADSET_KERALA" "V5 — Built by Freelancers — Kerala" ./creatives/v5-by-freelancers.json)
AD_V5_U=$(create_ad "$ADSET_UAE"    "V5 — Built by Freelancers — UAE"    ./creatives/v5-by-freelancers.json)
AD_V5_W=$(create_ad "$ADSET_WARM"   "V5 — Built by Freelancers — Warm"   ./creatives/v5-by-freelancers.json)

echo "All 15 ads created (5 variants x 3 ad sets), all PAUSED."

# --- 6. Sanity-list everything we just created -------------------------------

echo
echo "--- Campaign tree (PAUSED) ---"
meta ads campaign list \
  --account-id "$AD_ACCOUNT_ID" \
  --filter "name:NeoVibe Designers" \
  --output json \
  --limit 10

meta ads adset list \
  --campaign-id "$CAMPAIGN_ID" \
  --output json \
  --limit 10

meta ads ad list \
  --campaign-id "$CAMPAIGN_ID" \
  --output json \
  --limit 10

# --- 7. Insights query template (do NOT run until ads have flighted) ---------
# Uncomment after launch and at least 24h of data.
#
# meta ads insights get \
#   --account-id "$AD_ACCOUNT_ID" \
#   --level adset \
#   --time-range last_7d \
#   --fields "campaign_name,adset_name,impressions,clicks,ctr,cpc,actions,cost_per_action_type" \
#   --output json \
#   --limit 10

echo
echo "DONE. Review in Ads Manager. Do NOT unpause until:"
echo "  1. All 4 ASSUMPTIONS in README.md are validated."
echo "  2. Conversion API server events are wired (account_approved, account_activated)."
echo "  3. Privacy URL and lead form questions are reviewed by a human."
