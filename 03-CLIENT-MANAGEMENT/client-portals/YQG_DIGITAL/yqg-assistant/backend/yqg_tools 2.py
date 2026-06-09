"""YQG Assistant — tool integrations.

Three tools the YQG persona can call during a voice session:

    [TOOL:competitor_scrape(url="https://thewebmechanic.com")]
    [TOOL:seo_lookup(keyword="windsor plumber", location="Windsor, ON")]
    [TOOL:draft_proposal_to_doc(client="Bob's Plumbing", scope="5-page site", budget=5000)]

Wiring status (April 2026):
  - competitor_scrape: REAL — uses Firecrawl HTTP API
  - seo_lookup: STUB — returns plausible data; wire to DataForSEO/Ahrefs next
  - draft_proposal_to_doc: STUB — logs intent; wire to gws-bridge next

Drop into the NEXUS-LOCAL backend repo at:
    backend/src/tools/yqg_tools.py

Register in backend/src/tools/router.py alongside the existing windmill_tools.
"""

from __future__ import annotations

import logging
import os
from typing import Any

import httpx

logger = logging.getLogger(__name__)


# ── competitor_scrape ─────────────────────────────────────────────────────

async def competitor_scrape(url: str, **_: Any) -> str:
    """Firecrawl-backed competitor site scrape and summary.

    Returns a short text summary the LLM can weave into a voice response.
    """
    api_key = os.getenv("FIRECRAWL_API_KEY", "").strip()
    if not api_key:
        return (
            f"I would normally run Firecrawl against {url} and summarize "
            "positioning, services, pricing signals, and SEO strengths. "
            "Firecrawl isn't wired up in this deployment yet — flag this "
            "and I'll pass the URL to the team for a manual teardown."
        )

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(
                "https://api.firecrawl.dev/v1/scrape",
                headers={"Authorization": f"Bearer {api_key}"},
                json={
                    "url": url,
                    "formats": ["markdown"],
                    "onlyMainContent": True,
                },
            )
            resp.raise_for_status()
            data = resp.json()
            markdown = (data.get("data", {}) or {}).get("markdown", "")
            if not markdown:
                return f"Scraped {url} but got no readable content — may be JS-heavy or blocking bots."
            # Return only the first ~1500 chars so the LLM can summarize downstream
            snippet = markdown[:1500]
            return (
                f"Content from {url} (first ~1500 chars):\n\n{snippet}\n\n"
                "Synthesize this into a competitor teardown: positioning, "
                "services, pricing signals, SEO strengths, gaps YQG can exploit."
            )
    except httpx.HTTPError as e:
        logger.exception("competitor_scrape failed")
        return f"Firecrawl call failed for {url}: {e}. Fall back to a general strategic read."


# ── seo_lookup (STUB) ─────────────────────────────────────────────────────

_WINDSOR_SEO_BENCHMARKS = {
    # Rough industry benchmarks for Windsor-Essex — replace with DataForSEO when wired
    "plumber": {"volume": 720, "competition": "medium", "cpc": 4.80},
    "hvac": {"volume": 590, "competition": "high", "cpc": 6.20},
    "roofing": {"volume": 480, "competition": "high", "cpc": 7.10},
    "dentist": {"volume": 1300, "competition": "very high", "cpc": 8.40},
    "restaurant": {"volume": 2900, "competition": "low", "cpc": 1.10},
    "lawyer": {"volume": 880, "competition": "very high", "cpc": 12.70},
    "real estate": {"volume": 2100, "competition": "high", "cpc": 5.30},
    "contractor": {"volume": 610, "competition": "medium", "cpc": 4.40},
}


async def seo_lookup(keyword: str, location: str = "Windsor, ON", **_: Any) -> str:
    """Stub SEO lookup — returns plausible benchmark data.

    Wire to DataForSEO or Ahrefs API in next iteration. Cost: $5/1k keywords.
    """
    kw_lower = (keyword or "").lower()
    match = None
    for base, data in _WINDSOR_SEO_BENCHMARKS.items():
        if base in kw_lower:
            match = data
            break

    if not match:
        return (
            f"For '{keyword}' in {location}, I don't have a benchmark cached. "
            f"Rough industry estimate for Windsor-Essex: 300-800 monthly searches, "
            f"medium competition, 3-7 CPC. A real lookup via DataForSEO or Ahrefs "
            f"would cost less than a penny per keyword — flag to wire that up."
        )

    return (
        f"For '{keyword}' in {location}: roughly {match['volume']} monthly searches, "
        f"{match['competition']} competition, average CPC around {match['cpc']} dollars. "
        f"Benchmark only — run a live lookup before quoting a client."
    )


# ── draft_proposal_to_doc (STUB) ──────────────────────────────────────────

async def draft_proposal_to_doc(
    client: str,
    scope: str,
    budget: float | int | str | None = None,
    timeline: str | None = None,
    **_: Any,
) -> str:
    """Stub proposal-to-Google-Doc.

    Full implementation: call gws-bridge (Google Workspace) to create a Doc
    under the YQG client-portal folder with a proposal template filled in.

    Environment needed:
      GWS_CLIENT_TRACKER_ID, GWS_YQG_FOLDER_ID, GWS_PROPOSAL_TEMPLATE_ID

    For now, logs the intent and returns a summary the LLM can read aloud.
    """
    budget_str = f"${budget}" if budget else "unspecified budget"
    timeline_str = timeline or "standard turnaround"

    logger.info(
        "draft_proposal_to_doc requested — client=%s scope=%s budget=%s timeline=%s",
        client, scope, budget, timeline,
    )

    # TODO: replace with real gws-bridge call:
    # from src.integrations.gws_bridge import create_proposal_doc
    # doc_url = await create_proposal_doc(client=client, scope=scope, budget=budget)

    return (
        f"Proposal draft queued for {client}: {scope}, {budget_str}, {timeline_str}. "
        "In the production wiring this would create a Google Doc under YQG's client "
        "portal folder with scope, deliverables, timeline, and pricing filled in "
        "from the YQG ladder. For now, I'll summarize the proposal aloud."
    )


# ── Tool registry ─────────────────────────────────────────────────────────

YQG_TOOLS = {
    "competitor_scrape": competitor_scrape,
    "seo_lookup": seo_lookup,
    "draft_proposal_to_doc": draft_proposal_to_doc,
}
