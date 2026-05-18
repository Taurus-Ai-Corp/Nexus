import requests
from bs4 import BeautifulSoup
import re
import time
from urllib.parse import urljoin, urlparse
import json

# Headers to mimic a browser
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

# Base URLs
muthoot_url = "https://www.muthootfinance.com/"
news_sites = [
    "https://www.moneycontrol.com/news/business/muthoot-fincorp/",
    "https://economictimes.indiatimes.com/topic/Muthoot-Fincorp",
    "https://www.livemint.com/companies/news/muthoot-fincorp"
]

# Keywords to search for
keywords = [
    'AI', 'artificial intelligence', 'machine learning', 'chatbot', 'virtual assistant',
    'digital agent', 'AI agent', 'SaaS', 'software as a service', 'cloud',
    'automation', 'fintech', 'digital transformation'
]

def scrape_url(url):
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        
        text = soup.get_text()
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = '\n'.join(chunk for chunk in chunks if chunk)
        
        return text
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return ""

def find_keywords(text, keywords):
    found = set()
    text_lower = text.lower()
    for keyword in keywords:
        if keyword.lower() in text_lower:
            found.add(keyword)
    return list(found)

def main():
    print("Starting research on Muthoot FinCorp AI agents in SaaS opportunities...")
    
    results = {
        'muthoot_website': {},
        'news_articles': [],
        'key_findings': []
    }
    
    # Scrape Muthoot FinCorp website
    print("Scraping Muthoot FinCorp website...")
    muthoot_text = scrape_url(muthoot_url)
    if muthoot_text:
        found_keywords = find_keywords(muthoot_text, keywords)
        results['muthoot_website']['keywords_found'] = found_keywords
        # Extract a snippet around AI/SaaS
        lines = muthoot_text.split('\n')
        relevant_lines = [line for line in lines if any(kw.lower() in line.lower() for kw in ['ai', 'artificial intelligence', 'saas', 'cloud', 'digital'])]
        results['muthoot_website']['relevant_snippets'] = relevant_lines[:10]  # Top 10
    
    # Scrape news sites
    for news_url in news_sites:
        print(f"Scraping news site: {news_url}")
        news_text = scrape_url(news_url)
        if news_text:
            found_keywords = find_keywords(news_text, keywords)
            # Look for lines with both Muthoot and AI/SaaS
            lines = news_text.split('\n')
            relevant_lines = []
            for line in lines:
                if 'muthoot' in line.lower() and any(kw.lower() in line.lower() for kw in ['ai', 'artificial intelligence', 'saas', 'cloud', 'digital']):
                    relevant_lines.append(line.strip())
            
            results['news_articles'].append({
                'url': news_url,
                'keywords_found': found_keywords,
                'relevant_lines': relevant_lines[:5]  # Top 5
            })
        time.sleep(1)  # Be respectful
    
    # Generate key findings
    # 1. From Muthoot website
    if results['muthoot_website'].get('keywords_found'):
        results['key_findings'].append(
            f"Muthoot FinCorp website mentions: {', '.join(results['muthoot_website']['keywords_found'])}"
        )
    
    # 2. From news
    for article in results['news_articles']:
        if article['relevant_lines']:
            results['key_findings'].append(
                f"From {article['url']}: Found {len(article['relevant_lines'])} relevant lines about Muthoot and AI/SaaS."
            )
    
    # Save results to a JSON file
    with open('/Users/taurus_ai/Documents/BizFlow-NeoVibe-Platform/muthoot_research_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print("Research complete. Results saved to muthoot_research_results.json")
    
    # Print a summary
    print("\n=== SUMMARY ===")
    print(f"Muthoot Website Keywords Found: {results['muthoot_website'].get('keywords_found', [])}")
    print(f"Number of News Articles Scraped: {len(results['news_articles'])}")
    print("Key Findings:")
    for finding in results['key_findings']:
        print(f" - {finding}")

if __name__ == "__main__":
    main()
