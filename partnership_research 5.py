import json
import re
import time

import requests
from bs4 import BeautifulSoup

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

# Known partnerships and initiatives from earlier research
known_initiatives = [
    'Muthoot FinCorp Oracle Cloud Infrastructure',
    'Muthoot FinCorp Veefin Solutions supply chain finance',
    'Muthoot FinCorp Digital One MSME loans',
    'Muthoot FinCorp AI lending platform',
    'Muthoot FinCorp chatbot customer service',
    'Muthoot Fincorp AI/ML initiatives'
]

def search_specific_initiative(initiative):
    """Search for specific initiative information"""
    # Format for URL
    formatted = initiative.lower().replace(' ', '-').replace('/', '-')

    # Try to find press releases or news articles
    urls = [
        f'https://www.muthootfinance.com/news/{formatted}',
        f'https://www.moneycontrol.com/news/tags/{initiative.replace(" ", "+")}',
        f'https://economictimes.indiatimes.com/topic/{initiative.replace(" ", "+")}'
    ]

    results = []
    for url in urls:
        try:
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code == 200:
                # Extract relevant content
                soup = BeautifulSoup(response.content, 'html.parser')

                # Look for article content
                article = soup.find('article') or soup.find('div', class_=re.compile('article|content|story'))
                if article:
                    text = article.get_text()
                else:
                    # Get main text content
                    for script in soup(["script", "style"]):
                        script.decompose()
                    text = soup.get_text()

                # Look for lines with initiative keywords
                lines = text.split('\n')
                relevant_lines = []
                for line in lines:
                    line = line.strip()
                    if len(line) > 30:
                        line_lower = line.lower()
                        if any(word in line_lower for word in initiative.lower().split()):
                            relevant_lines.append(line)

                if relevant_lines:
                    results.append({
                        'url': url,
                        'content': relevant_lines[:5]  # Top 5 lines
                    })

        except Exception:
            pass  # Continue to next URL
        time.sleep(1)

    return results

def main():
    print("Researching specific Muthoot FinCorp AI and digital initiatives...")

    all_results = {
        'initiatives_searched': known_initiatives,
        'findings': {}
    }

    for initiative in known_initiatives:
        print(f"Researching: {initiative}")
        results = search_specific_initiative(initiative)
        if results:
            all_results['findings'][initiative] = results
        else:
            all_results['findings'][initiative] = "No specific information found"

    # Save results
    with open('/Users/taurus_ai/Documents/Nexus-Platform/initiative_research.json', 'w') as f:
        json.dump(all_results, f, indent=2)

    print("Research complete. Results saved to initiative_research.json")

    # Print summary
    print("\n=== INITIATIVE RESEARCH SUMMARY ===")
    found_count = 0
    for initiative, results in all_results['findings'].items():
        if isinstance(results, list) and results:
            found_count += 1
            print(f"\n{initiative}:")
            for result in results[:2]:  # Show first 2 results
                print(f"  Source: {result['url']}")
                for line in result['content'][:3]:
                    print(f"    - {line[:100]}...")
        else:
            print(f"\n{initiative}: {results}")

    print(f"\nTotal initiatives with specific information found: {found_count}/{len(known_initiatives)}")

if __name__ == "__main__":
    main()
