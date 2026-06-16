#!/usr/bin/env python3
"""Agent-Reach cookie helper — loads cookies from Chrome and writes to config.

Run after logging into LinkedIn, Twitter/X, Reddit, and Xiaohongshu in Chrome
with dedicated test accounts.
"""

import os
import sys
from pathlib import Path

AGENT_REACH_DIR = Path("/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/Agent-Reach")
sys.path.insert(0, str(AGENT_REACH_DIR))

from agent_reach.config import Config

try:
    import browser_cookie3
except ImportError:
    print("browser_cookie3 not installed. Install: pip install browser-cookie3")
    sys.exit(1)


def cookie_string(cookies, names=None):
    """Build a semicolon-separated cookie string, optionally filtering by name."""
    if names:
        selected = [c for c in cookies if c.name in names]
    else:
        selected = cookies
    return "; ".join(f"{c.name}={c.value}" for c in selected)


def main():
    cfg = Config()

    try:
        linkedin = browser_cookie3.chrome(domain_name=".linkedin.com")
        li_str = cookie_string(linkedin)
        if li_str:
            cfg.set("linkedin_cookie", li_str)
            print("✅ LinkedIn cookie saved")
        else:
            print("⚠️  No LinkedIn cookies found")
    except Exception as e:
        print(f"❌ LinkedIn error: {e}")

    try:
        twitter = browser_cookie3.chrome(domain_name=".x.com")
        if not twitter:
            twitter = browser_cookie3.chrome(domain_name=".twitter.com")
        tw_str = cookie_string(twitter)
        if tw_str:
            cfg.set("twitter_cookie", tw_str)
            print("✅ Twitter/X cookie saved")
        else:
            print("⚠️  No Twitter/X cookies found")
    except Exception as e:
        print(f"❌ Twitter/X error: {e}")

    try:
        reddit = browser_cookie3.chrome(domain_name=".reddit.com")
        rd_str = cookie_string(reddit)
        if rd_str:
            cfg.set("reddit_cookie", rd_str)
            print("✅ Reddit cookie saved")
        else:
            print("⚠️  No Reddit cookies found")
    except Exception as e:
        print(f"❌ Reddit error: {e}")

    try:
        xhs = browser_cookie3.chrome(domain_name=".xiaohongshu.com")
        xhs_str = cookie_string(xhs)
        if xhs_str:
            cfg.set("xiaohongshu_cookie", xhs_str)
            print("✅ Xiaohongshu cookie saved")
        else:
            print("⚠️  No Xiaohongshu cookies found")
    except Exception as e:
        print(f"❌ Xiaohongshu error: {e}")

    print("\nConfig saved to:", cfg.CONFIG_FILE)
    print("Run `python -m agent_reach.cli doctor` to verify.")


if __name__ == "__main__":
    main()
