#!/usr/bin/env bash
# ============================================================================
# Mater Maria Sanctuary — Meta Ads CLI blueprint
# ----------------------------------------------------------------------------
# REVIEW BEFORE RUNNING. ALL ENTITIES CREATED IN PAUSED STATE.
#
# Requires:
#   pip install meta-ads
#   export ACCESS_TOKEN="<long-lived-system-user-token>"
#   export AD_ACCOUNT_ID="act_NNNNNNNNNN"   # act_ prefix is mandatory
#   export FB_PAGE_ID="<MaterMariaSanctuary FB Page ID>"
#   export IG_ACCOUNT_ID="<MaterMariaSanctuary IG Account ID>"
#   export PIXEL_ID="<Mater Maria Pixel ID>"
#   export LEAD_FORM_ID="<MM_Investor_LeadForm_v1 ID>"
#
# Never inline tokens in this file. Never remove --status PAUSED without
# manual review. Read commands include --output json --limit 10.
#
# The `meta-ads` Python package is NOT installed on this machine yet; flag
# names below are best-inference. Resolve every `# VERIFY:` comment before
# unpausing anything.
# ============================================================================

set -euo pipefail

# --- Pre-flight: confirm auth + account ------------------------------------
# VERIFY: exact subcommand name — could be `account get` or `accounts get`
meta ads account get \
  --account-id "$AD_ACCOUNT_ID" \
  --output json \
  --limit 10

meta ads pixel get \
  --pixel-id "$PIXEL_ID" \
  --output json \
  --limit 10


# ============================================================================
# 1. CAMPAIGN
# ============================================================================
# VERIFY: objective enum — Meta API uses OUTCOME_LEADS in newer ODAX schema,
#         legacy schema uses LEAD_GENERATION. Pick whichever the installed
#         meta-ads CLI version expects. We default to OUTCOME_LEADS (current
#         Meta API as of 2024+).
# HOUSING category CONFIRMED (2026-05-07) — Mater Maria is a residential-
# real-estate-backed share program with right of residence/use, classified by
# Meta as HOUSING. Cannot be changed after creation; if you accidentally omit
# HOUSING here, delete the campaign and recreate. See policy-compliance.md § 1.
# VERIFY: some meta-ads CLI versions expect --special-ad-category-country flag
#         for country-level declaration; if create call rejects, add:
#         --special-ad-category-country '["IN","US","GB","AU","NZ"]'
#         (v3 geo pivot 2026-05-08: Kerala homebase + global Malayali diaspora;
#          replaces prior GCC list of AE/SA/QA/KW/BH/OM)

meta ads campaign create \
  --account-id "$AD_ACCOUNT_ID" \
  --name "MaterMaria-NRI-LeadGen-Q2-2026" \
  --objective OUTCOME_LEADS \
  --special-ad-categories '["HOUSING"]' \
  --buying-type AUCTION \
  --status PAUSED \
  --output json


# Capture the returned campaign ID into an env var for the next steps.
# VERIFY: actual JSON path — likely `.id` or `.campaign.id`
export CAMPAIGN_ID="<paste returned campaign id here>"


# ============================================================================
# 2. AD SETS — three audiences (Cold / Warm / Hot)
# ============================================================================
# Targeting JSON files referenced below. Create them alongside this script:
#   ./targeting/cold_gcc_nri.json
#   ./targeting/warm_site_visitors.json
#   ./targeting/hot_lead_form_openers.json
# (Schemas in audience-targeting.md.)

# --- 2a. COLD ---------------------------------------------------------------
# VERIFY: --optimization-goal accepted values — LEAD_GENERATION is the value
#         when objective is OUTCOME_LEADS using Instant Forms; for website
#         leads use OFFSITE_CONVERSIONS with promoted_object.custom_event_type=LEAD
# VERIFY: --billing-event — IMPRESSIONS is standard for lead gen
# VERIFY: --destination-type — ON_AD for instant form, WEBSITE for /invest
# VERIFY: --promoted-object schema — for instant form pass page_id only;
#         for website pass pixel_id + custom_event_type=LEAD

meta ads adset create \
  --account-id "$AD_ACCOUNT_ID" \
  --campaign-id "$CAMPAIGN_ID" \
  --name "AdSet-Cold-Diaspora-Kerala" \
  --status PAUSED \
  --daily-budget 400000 \
  --optimization-goal LEAD_GENERATION \
  --billing-event IMPRESSIONS \
  --bid-strategy LOWEST_COST_WITHOUT_CAP \
  --destination-type ON_AD \
  --promoted-object "{\"page_id\":\"$FB_PAGE_ID\"}" \
  --targeting-file ./targeting/cold_gcc_nri.json \
  --start-time "2026-05-12T04:00:00+0000" \
  --end-time "2026-06-09T04:00:00+0000" \
  --output json
# NOTE: --daily-budget is in account-currency *minor units* (paise for INR).
#       400000 paise = ₹4,000/day. VERIFY this CLI's minor-units convention.

export ADSET_COLD_ID="<paste returned adset id>"

# --- 2b. WARM ---------------------------------------------------------------
meta ads adset create \
  --account-id "$AD_ACCOUNT_ID" \
  --campaign-id "$CAMPAIGN_ID" \
  --name "AdSet-Warm-SiteVisitors-60d" \
  --status PAUSED \
  --daily-budget 200000 \
  --optimization-goal OFFSITE_CONVERSIONS \
  --billing-event IMPRESSIONS \
  --bid-strategy LOWEST_COST_WITHOUT_CAP \
  --destination-type WEBSITE \
  --promoted-object "{\"pixel_id\":\"$PIXEL_ID\",\"custom_event_type\":\"LEAD\"}" \
  --targeting-file ./targeting/warm_site_visitors.json \
  --start-time "2026-05-12T04:00:00+0000" \
  --end-time "2026-06-09T04:00:00+0000" \
  --output json

export ADSET_WARM_ID="<paste returned adset id>"

# --- 2c. HOT ---------------------------------------------------------------
meta ads adset create \
  --account-id "$AD_ACCOUNT_ID" \
  --campaign-id "$CAMPAIGN_ID" \
  --name "AdSet-Hot-LeadFormOpeners" \
  --status PAUSED \
  --daily-budget 120000 \
  --optimization-goal LEAD_GENERATION \
  --billing-event IMPRESSIONS \
  --bid-strategy LOWEST_COST_WITHOUT_CAP \
  --destination-type ON_AD \
  --promoted-object "{\"page_id\":\"$FB_PAGE_ID\"}" \
  --targeting-file ./targeting/hot_lead_form_openers.json \
  --start-time "2026-05-12T04:00:00+0000" \
  --end-time "2026-06-09T04:00:00+0000" \
  --output json

export ADSET_HOT_ID="<paste returned adset id>"


# ============================================================================
# 3. AD CREATIVES — five variants
# ============================================================================
# Create each creative once; reuse across ad sets if A/B testing the same
# audience with different angles. For our launch we put all five in COLD.
# VERIFY: object_story_spec schema for link_data vs photo_data vs video_data.
#         For a static image lead-gen ad with a Lead Form CTA on the ad,
#         use link_data with call_to_action.type=SIGN_UP and value.lead_gen_form_id.
# VERIFY: image hashes — upload images first via `meta ads adimages upload`
#         and substitute the returned hash for IMAGE_HASH_V1..V5.

# --- 3a. Creative V1 — Legacy & Roots --------------------------------------
meta ads adcreative create \
  --account-id "$AD_ACCOUNT_ID" \
  --name "Creative-V1-LegacyAndRoots" \
  --object-story-spec '{
    "page_id": "'"$FB_PAGE_ID"'",
    "instagram_actor_id": "'"$IG_ACCOUNT_ID"'",
    "link_data": {
      "image_hash": "IMAGE_HASH_V1",
      "link": "https://matermariahomes.com/invest?utm_source=meta&utm_campaign=mm_q2_2026&utm_content=v1_legacy",
      "message": "After two decades in the Gulf, the question is no longer if you return — it is where, and with what. Mater Maria Sanctuary sits in Elangulam, overlooking the Ponkunnam-Pala valley. Ninety residences, solar-powered, with on-site medical care for the years that matter most. This is not a holiday home. It is a place built for the chapter you have been quietly planning for. Reserve a share from ₹5 lakhs and earn 10% annual interest while construction proceeds. Investments subject to risk. See offer document.",
      "name": "Your next chapter, in Kerala.",
      "description": "matermariahomes.com/invest",
      "caption": "Reserve from ₹5 lakhs",
      "call_to_action": {
        "type": "LEARN_MORE",
        "value": { "lead_gen_form_id": "'"$LEAD_FORM_ID"'" }
      }
    }
  }' \
  --output json
export CREATIVE_V1_ID="<paste returned creative id>"

# --- 3b. Creative V2 — ROI-First Investor ----------------------------------
meta ads adcreative create \
  --account-id "$AD_ACCOUNT_ID" \
  --name "Creative-V2-ROIFirstInvestor" \
  --object-story-spec '{
    "page_id": "'"$FB_PAGE_ID"'",
    "instagram_actor_id": "'"$IG_ACCOUNT_ID"'",
    "link_data": {
      "image_hash": "IMAGE_HASH_V2",
      "link": "https://matermariahomes.com/invest?utm_source=meta&utm_campaign=mm_q2_2026&utm_content=v2_roi",
      "message": "The numbers, simply: ₹5 lakhs to ₹30 lakhs deposited as a hybrid share-and-deposit instrument. Ten percent annual interest for years one through four. From year five your deposit converts to share capital, and dividends begin — escalating from 6% to 20% over years five through fifteen. Total returns model out at 150–153% over the fifteen-year horizon. Add a guest house and event hall you can use rent-free. Run the numbers yourself on the calculator — link below. Investments subject to risk. See offer document.",
      "name": "10% interest. Years 1-4.",
      "description": "matermariahomes.com/invest",
      "caption": "Run the calculator",
      "call_to_action": {
        "type": "GET_QUOTE",
        "value": { "lead_gen_form_id": "'"$LEAD_FORM_ID"'" }
      }
    }
  }' \
  --output json
export CREATIVE_V2_ID="<paste returned creative id>"

# --- 3c. Creative V3 — Faith & Community -----------------------------------
meta ads adcreative create \
  --account-id "$AD_ACCOUNT_ID" \
  --name "Creative-V3-FaithAndCommunity" \
  --object-story-spec '{
    "page_id": "'"$FB_PAGE_ID"'",
    "instagram_actor_id": "'"$IG_ACCOUNT_ID"'",
    "link_data": {
      "image_hash": "IMAGE_HASH_V3",
      "link": "https://matermariahomes.com/invest?utm_source=meta&utm_campaign=mm_q2_2026&utm_content=v3_faith",
      "message": "Mater Maria Sanctuary was conceived under the patronage of Mar Jose Pulickal and is supported by the Pravasi Apostolate under Fr. Mathew Puthumana — clergy who have walked alongside Kerala'\''s diaspora for decades. The amphitheatre, the chapel-adjacent meditation halls, the resident lounges — these are spaces designed for a community of returnees who share a faith and a history. Ninety residences, integrated medical care, ayurvedic wellness, and an organic kitchen. Investment from ₹5 lakhs. Investments subject to risk. See offer document.",
      "name": "Built on Bishop Pulickal'\''s land.",
      "description": "matermariahomes.com/invest",
      "caption": "Patron: Bp. Pulickal",
      "call_to_action": {
        "type": "LEARN_MORE",
        "value": { "lead_gen_form_id": "'"$LEAD_FORM_ID"'" }
      }
    }
  }' \
  --output json
export CREATIVE_V3_ID="<paste returned creative id>"

# --- 3d. Creative V4 — Healthcare Safety Net -------------------------------
meta ads adcreative create \
  --account-id "$AD_ACCOUNT_ID" \
  --name "Creative-V4-HealthcareSafetyNet" \
  --object-story-spec '{
    "page_id": "'"$FB_PAGE_ID"'",
    "instagram_actor_id": "'"$IG_ACCOUNT_ID"'",
    "link_data": {
      "image_hash": "IMAGE_HASH_V4",
      "link": "https://matermariahomes.com/invest?utm_source=meta&utm_campaign=mm_q2_2026&utm_content=v4_healthcare",
      "message": "Most NRI families have the same private fear: a 3 AM call from Kerala about a parent who has fallen. Mater Maria Sanctuary includes an on-site MMT Hospital Annexure, 24/7 ambulance service, specialised care units, and resident nursing. Whether you secure a residence for your parents now or for yourself in fifteen years, the medical infrastructure is permanent. The investor program lets you participate without taking on a full property purchase — share-based, from ₹5 lakhs, with 10% annual interest. Investments subject to risk. See offer document.",
      "name": "Your parents. On-site nursing.",
      "description": "matermariahomes.com/invest",
      "caption": "24/7 on-site nursing",
      "call_to_action": {
        "type": "LEARN_MORE",
        "value": { "lead_gen_form_id": "'"$LEAD_FORM_ID"'" }
      }
    }
  }' \
  --output json
export CREATIVE_V4_ID="<paste returned creative id>"

# --- 3e. Creative V5 — Exclusive 90 Residences -----------------------------
meta ads adcreative create \
  --account-id "$AD_ACCOUNT_ID" \
  --name "Creative-V5-Exclusive90Residences" \
  --object-story-spec '{
    "page_id": "'"$FB_PAGE_ID"'",
    "instagram_actor_id": "'"$IG_ACCOUNT_ID"'",
    "link_data": {
      "image_hash": "IMAGE_HASH_V5",
      "link": "https://matermariahomes.com/invest?utm_source=meta&utm_campaign=mm_q2_2026&utm_content=v5_exclusive",
      "message": "The estate is built around exactly ninety residences — twenty Independent Villas, fifty Walk-up Villas, twenty Executive Apartments. Net-zero solar power, rainwater harvesting, private fishing ponds, Ayurvedic treatment block, organic central kitchen. The investor program offers four tiers from Silver (₹5L) to Platinum (₹30L), with an event hall and guest house attached as resident perks. Most early commitments are coming from Dubai and Doha. Reserve your tier and lock the year-one entry economics before the next phase opens. Investments subject to risk. See offer document.",
      "name": "Only 90. Already moving.",
      "description": "matermariahomes.com/invest",
      "caption": "90 residences. 4 tiers.",
      "call_to_action": {
        "type": "APPLY_NOW",
        "value": { "lead_gen_form_id": "'"$LEAD_FORM_ID"'" }
      }
    }
  }' \
  --output json
export CREATIVE_V5_ID="<paste returned creative id>"


# ============================================================================
# 4. ADS — five ads, all into COLD ad set for the test phase
# ============================================================================
# Once a winning angle emerges (week 2), duplicate the top performer into
# WARM and HOT ad sets with retargeting copy edits.

for VARIANT in "V1:LegacyAndRoots:$CREATIVE_V1_ID" \
               "V2:ROIFirstInvestor:$CREATIVE_V2_ID" \
               "V3:FaithAndCommunity:$CREATIVE_V3_ID" \
               "V4:HealthcareSafetyNet:$CREATIVE_V4_ID" \
               "V5:Exclusive90Residences:$CREATIVE_V5_ID"; do
  CODE=$(echo "$VARIANT" | cut -d: -f1)
  NAME=$(echo "$VARIANT" | cut -d: -f2)
  CREATIVE=$(echo "$VARIANT" | cut -d: -f3)

  meta ads ad create \
    --account-id "$AD_ACCOUNT_ID" \
    --adset-id "$ADSET_COLD_ID" \
    --name "Ad-Cold-${CODE}-${NAME}" \
    --creative-id "$CREATIVE" \
    --status PAUSED \
    --output json
done


# ============================================================================
# 5. SANITY CHECKS (run before any unpause)
# ============================================================================
# VERIFY: insights subcommand — likely `meta ads insights get` or
#         `meta ads ad-insights` depending on CLI version.

meta ads campaign list \
  --account-id "$AD_ACCOUNT_ID" \
  --filter "id:$CAMPAIGN_ID" \
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

# Insights — only meaningful after a few hours of delivery, included for
# reference. All reads default to last_7d.
meta ads insights get \
  --campaign-id "$CAMPAIGN_ID" \
  --time-range last_7d \
  --fields "campaign_name,adset_name,ad_name,impressions,clicks,ctr,cpm,cpc,actions,cost_per_action_type" \
  --output json \
  --limit 10


# ============================================================================
# 6. UNPAUSE — DO NOT RUN UNTIL HUMAN REVIEW IS COMPLETE
# ============================================================================
# Intentionally left commented out. To go live, uncomment, run, monitor.
#
# meta ads campaign update --campaign-id "$CAMPAIGN_ID" --status ACTIVE --output json
# meta ads adset update    --adset-id    "$ADSET_COLD_ID" --status ACTIVE --output json
# meta ads adset update    --adset-id    "$ADSET_WARM_ID" --status ACTIVE --output json
# meta ads adset update    --adset-id    "$ADSET_HOT_ID"  --status ACTIVE --output json
# # Per-ad activation: do this explicitly per variant; do not loop blind.

echo "Blueprint executed in PAUSED mode. Review in Meta Ads Manager before activating."
