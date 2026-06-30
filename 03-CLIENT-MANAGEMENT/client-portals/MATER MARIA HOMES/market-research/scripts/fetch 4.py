#!/usr/bin/env python3
"""
Map Your Market — Data Collection Script
Searches Reddit, HN, GitHub Issues, G2, and Google Trends for pain signals.
Outputs scored pain signals to JSON for AI clustering.

Usage:
    GITHUB_TOKEN="..." python3 fetch.py "category keyword" \
        --competitors "comp1,comp2" \
        --context "product description" \
        --output /tmp/mym-raw.json
"""

import argparse
import json
import re
import time
import urllib.parse
import urllib.request
from collections import Counter
from datetime import datetime, timedelta

# ---------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------
REDDIT_RATE_LIMIT = 10   # requests per minute (conservative)
HN_RATE_LIMIT = 30
GITHUB_RATE_LIMIT = 60   # unauthenticated; 5000 with token

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; MapYourMarket/1.0; +https://taurusai.io)"
}

# ---------------------------------------------------------------------------
# REDDIT
# ---------------------------------------------------------------------------

def reddit_search(query, subreddit=None, limit=25):
    """Search Reddit via public JSON. Returns list of posts."""
    base = "https://www.reddit.com/search.json"
    params = {"q": query, "limit": limit, "sort": "relevance", "t": "year"}
    if subreddit:
        base = f"https://www.reddit.com/r/{subreddit}/search.json"
        params["restrict_sr"] = "1"
    url = base + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={**HEADERS, "Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode())
    except Exception as e:
        print(f"[Reddit] Error searching '{query}': {e}")
        return []
    posts = []
    for child in data.get("data", {}).get("children", []):
        p = child.get("data", {})
        posts.append({
            "title": p.get("title", ""),
            "body": p.get("selftext", ""),
            "subreddit": p.get("subreddit", ""),
            "author": p.get("author", ""),
            "upvotes": p.get("ups", 0),
            "comments": p.get("num_comments", 0),
            "url": "https://reddit.com" + p.get("permalink", ""),
            "created_utc": p.get("created_utc", 0),
        })
    return posts


def reddit_discover_subreddits(category, competitors):
    """Auto-discover relevant subreddits from category + competitors."""
    candidates = []
    # Search category in popular subs
    for sub in ["technology", "business", "personalfinance", "investing",
                "startups", "SaaS", "marketing", "sales", "productivity",
                "devops", "sysadmin", "programming", "webdev", "data science",
                "healthcare", "eldercare", "retirement", "india", "kerala",
                "NRI", "dubai", "expats", "realestate", "homestead",
                "AskReddit", "LifeAdvice", "relationship_advice"]:
        candidates.append(sub)
    # Add competitor-specific subs
    for comp in competitors:
        comp_clean = re.sub(r"[^a-zA-Z0-9]", "", comp.lower())
        if comp_clean:
            candidates.append(comp_clean)
    return list(set(candidates))


# ---------------------------------------------------------------------------
# HACKER NEWS (Algolia)
# ---------------------------------------------------------------------------

def hn_search(query, limit=30):
    """Search HN via Algolia API. Returns list of stories/comments."""
    url = f"https://hn.algolia.com/api/v1/search?query={urllib.parse.quote(query)}&tags=story&numericFilters=created_at_i>{int((datetime.now() - timedelta(days=365)).timestamp())}"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode())
    except Exception as e:
        print(f"[HN] Error searching '{query}': {e}")
        return []
    hits = []
    for hit in data.get("hits", [])[:limit]:
        hits.append({
            "title": hit.get("title", ""),
            "text": hit.get("text", ""),
            "author": hit.get("author", ""),
            "points": hit.get("points", 0),
            "num_comments": hit.get("num_comments", 0),
            "url": f"https://news.ycombinator.com/item?id={hit.get('objectID', '')}",
            "created_at": hit.get("created_at", ""),
        })
    return hits


# ---------------------------------------------------------------------------
# GITHUB ISSUES
# ---------------------------------------------------------------------------

def github_search_issues(query, token=None, limit=30):
    """Search GitHub issues. Returns list of issues."""
    headers = dict(HEADERS)
    if token:
        headers["Authorization"] = f"token {token}"
    q = urllib.parse.quote(f"{query} is:issue")
    url = f"https://api.github.com/search/issues?q={q}&sort=created&order=desc&per_page={limit}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode())
    except Exception as e:
        print(f"[GitHub] Error searching '{query}': {e}")
        return []
    issues = []
    for item in data.get("items", []):
        issues.append({
            "title": item.get("title", ""),
            "body": item.get("body", "")[:500],
            "repo": item.get("repository_url", "").replace("https://api.github.com/repos/", ""),
            "state": item.get("state", ""),
            "comments": item.get("comments", 0),
            "url": item.get("html_url", ""),
            "created_at": item.get("created_at", ""),
        })
    return issues


# ---------------------------------------------------------------------------
# G2 (Simple HTML scrape — limited)
# ---------------------------------------------------------------------------

def g2_scrape_vendors(category, limit=10):
    """Scrape G2 for vendor names in a category. Returns list of vendors."""
    # G2 search URL format
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", category.lower()).strip("-")
    url = f"https://www.g2.com/categories/{slug}"
    req = urllib.request.Request(url, headers=HEADERS)
    vendors = []
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode()
        # Very basic extraction — look for product cards
        names = re.findall(r'"name":"([^"]+)","url":"/products/[^"]+"', html)
        for name in names[:limit]:
            vendors.append({"name": name, "source": "g2"})
    except Exception as e:
        print(f"[G2] Error scraping '{category}': {e}")
    return vendors


# ---------------------------------------------------------------------------
# GOOGLE TRENDS (unofficial — limited reliability)
# ---------------------------------------------------------------------------

def google_trends_direction(query):
    """Check Google Trends direction. Returns 'up', 'down', 'flat', or 'unknown'."""
    # Note: This uses an unofficial endpoint and may break.
    # For production, use the official Trends API or pyTrends.
    try:
        url = f"https://trends.google.com/trends/explore?q={urllib.parse.quote(query)}"
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode()
        # Very rough heuristic — look for trend indicators in page
        if "rising" in html.lower() or "breakout" in html.lower():
            return "up"
        elif "declining" in html.lower():
            return "down"
        return "flat"
    except Exception as e:
        print(f"[Trends] Error checking '{query}': {e}")
        return "unknown"


# ---------------------------------------------------------------------------
# PAIN SCORING
# ---------------------------------------------------------------------------

def pain_score(item, source):
    """
    Calculate pain score for a signal.
    Formula: upvotes/points * 2 + comments * 1.5 + keyword_bonus
    """
    score = 0
    text = ""
    if source == "reddit":
        score += item.get("upvotes", 0) * 2
        score += item.get("comments", 0) * 1.5
        text = item.get("title", "") + " " + item.get("body", "")
    elif source == "hn":
        score += item.get("points", 0) * 2
        score += item.get("num_comments", 0) * 1.5
        text = item.get("title", "") + " " + item.get("text", "")
    elif source == "github_issue":
        score += item.get("comments", 0) * 3
        text = item.get("title", "") + " " + item.get("body", "")

    # Keyword bonus for pain indicators
    pain_keywords = [
        "frustrated", "pain", "problem", "issue", "bug", "broken", "fail",
        "difficult", "hard", "annoying", "hate", "worst", "terrible",
        "expensive", "cost", "pricing", "overpriced", "not worth",
        "missing", "lack", "need", "want", "wish", "would be nice",
        "alternative", "switching", "left", "moved", "quit", "stopped",
        "disappointed", "regret", "warning", "avoid", "beware",
        "support", "help", "stuck", "confused", "unclear", "documentation"
    ]
    text_lower = text.lower()
    for kw in pain_keywords:
        if kw in text_lower:
            score += 5

    return int(score)


def extract_pain_signals(raw_data, source):
    """Convert raw data into scored pain signals."""
    signals = []
    for item in raw_data:
        score = pain_score(item, source)
        if score < 10:
            continue  # Skip low-signal items
        text = ""
        if source == "reddit":
            text = item.get("title", "") + " | " + item.get("body", "")[:300]
        elif source == "hn":
            text = item.get("title", "") + " | " + item.get("text", "")[:300]
        elif source == "github_issue":
            text = item.get("title", "") + " | " + item.get("body", "")[:300]

        signals.append({
            "source": source,
            "pain_score": score,
            "title": item.get("title", ""),
            "body_excerpt": text,
            "url": item.get("url", ""),
            "subreddit": item.get("subreddit", "") if source == "reddit" else "",
            "author": item.get("author", ""),
            "metadata": item,
        })
    return signals


# ---------------------------------------------------------------------------
# ICP EXTRACTION
# ---------------------------------------------------------------------------

def extract_icp_signals(raw_pains):
    """Extract ICP signals from pain data."""
    subreddits = Counter()
    authors = Counter()
    flairs = Counter()
    for p in raw_pains:
        sub = p.get("subreddit", "")
        if sub:
            subreddits[sub] += 1
        author = p.get("author", "")
        if author:
            authors[author] += 1
    return {
        "top_subreddits": dict(subreddits.most_common(10)),
        "active_authors": dict(authors.most_common(10)),
        "total_unique_authors": len(authors),
    }


# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Map Your Market — Data Collection")
    parser.add_argument("category", help="Category keyword(s)")
    parser.add_argument("--competitors", default="", help="Comma-separated competitor names")
    parser.add_argument("--context", default="", help="Product context description")
    parser.add_argument("--output", default="/tmp/mym-raw.json", help="Output JSON path")
    args = parser.parse_args()

    category = args.category
    competitors = [c.strip() for c in args.competitors.split(",") if c.strip()]
    context = args.context
    output_path = args.output
    token = os.environ.get("GITHUB_TOKEN", "")

    print("=" * 60)
    print("Map Your Market — Data Collection")
    print(f"Category: {category}")
    print(f"Competitors: {', '.join(competitors) if competitors else 'none'}")
    print(f"Context: {context[:60]}..." if len(context) > 60 else f"Context: {context}")
    print(f"GitHub Token: {'set' if token else 'not set (60 req/hr limit)'}")
    print("=" * 60)

    all_pains = []

    # --- REDDIT ---
    print("\n[1/4] Searching Reddit...")
    reddit_posts = []
    subs = reddit_discover_subreddits(category, competitors)
    print(f"      Auto-discovered subreddits: {', '.join(subs[:10])}")
    # Search category in general
    reddit_posts += reddit_search(category, limit=25)
    time.sleep(6)  # Rate limit
    # Search in specific subs
    for sub in subs[:5]:
        reddit_posts += reddit_search(category, subreddit=sub, limit=15)
        time.sleep(6)
    # Search competitors
    for comp in competitors[:3]:
        reddit_posts += reddit_search(comp, limit=15)
        time.sleep(6)
    reddit_signals = extract_pain_signals(reddit_posts, "reddit")
    all_pains += reddit_signals
    print(f"      Reddit signals found: {len(reddit_signals)}")

    # --- HACKER NEWS ---
    print("\n[2/4] Searching Hacker News...")
    hn_stories = hn_search(category, limit=30)
    time.sleep(2)
    for comp in competitors[:2]:
        hn_stories += hn_search(comp, limit=15)
        time.sleep(2)
    hn_signals = extract_pain_signals(hn_stories, "hn")
    all_pains += hn_signals
    print(f"      HN signals found: {len(hn_signals)}")

    # --- GITHUB ISSUES ---
    print("\n[3/4] Searching GitHub Issues...")
    gh_issues = github_search_issues(category, token=token, limit=30)
    time.sleep(2)
    for comp in competitors[:2]:
        gh_issues += github_search_issues(comp, token=token, limit=15)
        time.sleep(2)
    gh_signals = extract_pain_signals(gh_issues, "github_issue")
    all_pains += gh_signals
    print(f"      GitHub signals found: {len(gh_signals)}")

    # --- G2 VENDORS ---
    print("\n[4/4] Scraping G2 vendors...")
    g2_vendors = g2_scrape_vendors(category, limit=10)
    print(f"      G2 vendors found: {len(g2_vendors)}")

    # --- TRENDS ---
    print("\n[5/5] Checking Google Trends...")
    trends = google_trends_direction(category)
    print(f"      Trends direction: {trends}")

    # --- ICP ---
    icp = extract_icp_signals(all_pains)

    # --- SUMMARY ---
    total = len(all_pains)
    reddit_count = len([p for p in all_pains if p["source"] == "reddit"])
    hn_count = len([p for p in all_pains if p["source"] == "hn"])
    gh_count = len([p for p in all_pains if p["source"] == "github_issue"])

    output = {
        "input": {
            "category": category,
            "competitors": competitors,
            "product_context": context,
        },
        "raw_pains": all_pains,
        "icp_signals": icp,
        "market_signals": {
            "reddit_signals_found": reddit_count,
            "hn_signals_found": hn_count,
            "github_issue_signals": gh_count,
            "vendor_count_g2": len(g2_vendors),
            "trends_direction": trends,
            "top_vendors": g2_vendors[:5],
        },
        "summary": {
            "total_pain_signals": total,
            "collection_date": datetime.now().isoformat(),
        },
    }

    with open(output_path, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\n{'=' * 60}")
    print(f"DONE. Output saved to: {output_path}")
    print(f"Total pain signals: {total}")
    print(f"  Reddit: {reddit_count}")
    print(f"  HN: {hn_count}")
    print(f"  GitHub: {gh_count}")
    print(f"  G2 vendors: {len(g2_vendors)}")
    print(f"{'=' * 60}")

    if total < 10:
        print("\nWARNING: Fewer than 10 pain signals found.")
        print("The market may be too niche, or keywords need adjustment.")
        print("Try broader keywords or add competitor names.")


if __name__ == "__main__":
    import os
    main()
