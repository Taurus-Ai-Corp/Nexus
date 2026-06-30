"""
Ingest OMVIC sources using Firecrawl (JS-rendering support)
Replaces original ingest.py which failed on Ontario.ca e-Laws (SPA)
"""
import json
from pathlib import Path

# Firecrawl client (using their Python SDK or API)
try:
    from firecrawl import FirecrawlApp
    HAS_FIRECRAWL = True
except ImportError:
    HAS_FIRECRAWL = False
    print("WARNING: firecrawl-py not installed. Install with: pip install firecrawl-py")

# Load sources
SOURCES_FILE = Path(__file__).parent.parent / "data" / "sources.json"
OUTPUT_DIR = Path(__file__).parent.parent / "data" / "sources"

def ingest_with_firecrawl(url: str, output_path: Path, wait_for: int = 15000) -> dict:
    """Ingest a URL using Firecrawl with JS rendering"""
    if not HAS_FIRECRAWL:
        print(f"  ✗ SKIPPED (no firecrawl): {url}")
        return {"word_count": 0, "success": False}

    try:
        app = FirecrawlApp()
        print(f"  ▶ Fetching {url.split('/')[-1]}...")

        # Scrape with waitFor for JS rendering
        result = app.scrape_url(
            url,
            params={
                "formats": ["markdown"],
                "waitFor": wait_for
            }
        )

        markdown = result.get("markdown", "")
        word_count = len(markdown.split())

        # Save to file
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(markdown, encoding="utf-8")

        print(f"  ✓ {word_count:,} words → {output_path.name}")
        return {"word_count": word_count, "success": True}

    except Exception as e:
        print(f"  ✗ FAILED: {e}")
        return {"word_count": 0, "success": False, "error": str(e)}

def main():
    with open(SOURCES_FILE) as f:
        sources = json.load(f)

    print(f"=== Ingesting {len(sources)} sources with Firecrawl ===\n")

    for source in sources:
        slug = source["slug"]
        url = source["url"]
        output_path = OUTPUT_DIR / f"{slug}.md"

        result = ingest_with_firecrawl(url, output_path)
        source["word_count"] = result["word_count"]
        source["sample"] = output_path.read_text(encoding="utf-8")[:100] if output_path.exists() else ""

    # Update sources.json
    with open(SOURCES_FILE, "w") as f:
        json.dump(sources, f, indent=2)

    print(f"\n=== Ingest complete: {sum(1 for s in sources if s['word_count'] > 100)}/{len(sources)} sources ===")

if __name__ == "__main__":
    main()
