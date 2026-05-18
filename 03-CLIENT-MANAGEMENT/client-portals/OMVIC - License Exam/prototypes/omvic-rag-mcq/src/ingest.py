"""Fetch OMVIC-exam primary-law sources and write each as a clean markdown file."""
from __future__ import annotations
import json, re, sys, time
from dataclasses import dataclass
from pathlib import Path
import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md

BASE_DIR = Path.cwd()
OUT_DIR = BASE_DIR / "data" / "sources"
OUT_DIR.mkdir(parents=True, exist_ok=True)

USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"

@dataclass
class Source:
    slug: str
    title: str
    url: str
    content_selector: str | None

def fetch(url: str) -> str:
    r = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=60)
    r.raise_for_status()
    return r.text

def extract_main(html: str, selector: str | None) -> str:
    soup = BeautifulSoup(html, "lxml")
    for junk in soup(["script", "style", "noscript", "iframe"]):
        junk.decompose()
    target = soup.select_one(selector) if selector else soup.body
    return str(target or soup)

def html_to_markdown(html: str) -> str:
    text = md(html, heading_style="ATX", strip=["a"])
    text = re.sub(r"\n{3,}", "\n\n", text)
    return "\n".join(line.rstrip() for line in text.splitlines()).strip()

def word_count(text: str) -> int:
    return len(re.findall(r"\w+", text))

def first_paragraph(text: str, min_words: int = 15) -> str:
    for para in text.split("\n\n"):
        if word_count(para.strip()) >= min_words:
            return para.strip()[:400] + ("..." if len(para.strip()) > 400 else "")
    return text[:400]

SOURCES = [
    Source(slug="mvda-2002", title="Motor Vehicle Dealers Act, 2002 (MVDA)",
           url="https://www.ontario.ca/laws/statute/02m30", content_selector="#main-content"),
    Source(slug="mvda-reg-333-08-general", title="MVDA General Regulation 333/08",
           url="https://www.ontario.ca/laws/regulation/080333", content_selector="#main-content"),
    Source(slug="mvda-reg-332-08-code-of-ethics", title="MVDA Code of Ethics Regulation 332/08",
           url="https://www.ontario.ca/laws/regulation/080332", content_selector="#main-content"),
    Source(slug="cpa-2002", title="Consumer Protection Act, 2002 (CPA)",
           url="https://www.ontario.ca/laws/statute/02c30", content_selector="#main-content"),
    Source(slug="cpa-reg-17-05-general", title="CPA General Regulation 17/05",
           url="https://www.ontario.ca/laws/regulation/050017", content_selector="#main-content"),
]

def main() -> int:
    manifest = []
    total_words = 0
    for src in SOURCES:
        print(f"▶ Fetching {src.slug:38s} {src.url}", flush=True)
        try:
            html = fetch(src.url)
            body_html = extract_main(html, src.content_selector)
            markdown = html_to_markdown(body_html)
        except Exception as exc:
            print(f"  ✗ FAILED: {exc}")
            continue
        wc = word_count(markdown)
        total_words += wc
        header = f"# {src.title}\n\n**Source**: {src.url}\n\n---\n\n"
        (OUT_DIR / f"{src.slug}.md").write_text(header + markdown, encoding="utf-8")
        manifest.append({"slug": src.slug, "title": src.title, "url": src.url,
                         "path": str((OUT_DIR / f"{src.slug}.md").relative_to(BASE_DIR)),
                         "word_count": wc, "sample": first_paragraph(markdown)})
        print(f"  ✓ {wc:,} words → {src.slug}.md")
        time.sleep(1.5)
    (BASE_DIR / "data" / "sources.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"\n══ Ingest complete: {len(manifest)}/{len(SOURCES)} sources, {total_words:,} total words ══")
    return 0 if len(manifest) == len(SOURCES) else 1

if __name__ == "__main__":
    sys.exit(main())
