#!/usr/bin/env python3
"""
Web Scraping Agent for BizFlow™ - Powered by Firecrawl
Advanced web scraping for competitor research and market intelligence
"""

import asyncio
import json
import logging
import os
from dataclasses import asdict, dataclass
from datetime import datetime
from typing import Any

import aiohttp
import requests
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class ScrapedData:
    """Data structure for scraped website information"""
    url: str
    title: str
    content: str
    metadata: dict[str, Any]
    pricing_info: list[dict[str, str]]
    contact_info: dict[str, str]
    social_links: list[str]
    technologies: list[str]
    scraped_at: datetime
    status: str = "success"
    error_message: str | None = None

class WebScrapingAgent:
    """
    Advanced web scraping agent using Firecrawl API and custom scraping
    Specializes in competitor analysis and market research
    """

    def __init__(self, firecrawl_api_key: str | None = None):
        self.firecrawl_api_key = firecrawl_api_key or os.getenv("FIRECRAWL_API_KEY")
        self.firecrawl_base_url = "https://api.firecrawl.dev"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'BizFlow-Research-Bot/1.0 (Marketing Research)'
        })

    async def scrape_competitor_website(self, url: str, deep_scrape: bool = False) -> ScrapedData:
        """
        Scrape competitor website using Firecrawl for comprehensive analysis
        """
        try:
            logger.info(f"Scraping competitor website: {url}")

            if self.firecrawl_api_key:
                # Use Firecrawl API for advanced scraping
                return await self._firecrawl_scrape(url, deep_scrape)
            else:
                # Fallback to custom scraping
                return await self._custom_scrape(url)

        except Exception as e:
            logger.error(f"Error scraping {url}: {str(e)}")
            return ScrapedData(
                url=url,
                title="",
                content="",
                metadata={},
                pricing_info=[],
                contact_info={},
                social_links=[],
                technologies=[],
                scraped_at=datetime.now(),
                status="error",
                error_message=str(e)
            )

    async def _firecrawl_scrape(self, url: str, deep_scrape: bool = False) -> ScrapedData:
        """Use Firecrawl API for comprehensive scraping"""

        headers = {
            "Authorization": f"Bearer {self.firecrawl_api_key}",
            "Content-Type": "application/json"
        }

        # Basic scrape configuration
        scrape_config = {
            "url": url,
            "formats": ["markdown", "html"],
            "includeTags": ["title", "meta", "h1", "h2", "h3", "p", "a", "img"],
            "excludeTags": ["script", "style", "nav", "footer"],
            "onlyMainContent": True,
            "extractorOptions": {
                "mode": "llm-extraction",
                "extractionPrompt": """Extract key business information:
                - Company services and products
                - Pricing information
                - Contact details
                - Value propositions
                - Target markets
                - Technologies used"""
            }
        }

        if deep_scrape:
            # Add crawling for deeper analysis
            scrape_config.update({
                "crawl": True,
                "crawlOptions": {
                    "includes": [f"{url}/*"],
                    "limit": 10,
                    "allowBackwardCrawling": False,
                    "allowExternalContentLinks": False
                }
            })

        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.firecrawl_base_url}/v0/scrape",
                    headers=headers,
                    json=scrape_config
                ) as response:

                    if response.status == 200:
                        data = await response.json()
                        return self._process_firecrawl_response(url, data)
                    else:
                        error_data = await response.text()
                        logger.error(f"Firecrawl API error: {response.status} - {error_data}")
                        return await self._custom_scrape(url)

        except Exception as e:
            logger.error(f"Firecrawl request failed: {str(e)}")
            return await self._custom_scrape(url)

    def _process_firecrawl_response(self, url: str, data: dict[str, Any]) -> ScrapedData:
        """Process Firecrawl API response"""

        success = data.get("success", False)
        if not success:
            raise Exception(f"Firecrawl scraping failed: {data.get('error', 'Unknown error')}")

        scraped_data = data.get("data", {})
        metadata = scraped_data.get("metadata", {})
        content = scraped_data.get("markdown", "") or scraped_data.get("content", "")

        # Extract structured information
        extracted = scraped_data.get("extract", {})

        return ScrapedData(
            url=url,
            title=metadata.get("title", ""),
            content=content,
            metadata=metadata,
            pricing_info=self._extract_pricing(content, extracted),
            contact_info=self._extract_contact_info(content, extracted),
            social_links=self._extract_social_links(content, metadata),
            technologies=self._extract_technologies(metadata),
            scraped_at=datetime.now(),
            status="success"
        )

    async def _custom_scrape(self, url: str) -> ScrapedData:
        """Custom scraping fallback when Firecrawl is not available"""

        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=30) as response:
                    if response.status != 200:
                        raise Exception(f"HTTP {response.status}: {response.reason}")

                    html_content = await response.text()

                    # Basic parsing (would normally use BeautifulSoup)
                    import re

                    # Extract title
                    title_match = re.search(r'<title[^>]*>([^<]+)</title>', html_content, re.IGNORECASE)
                    title = title_match.group(1) if title_match else ""

                    # Extract meta description
                    meta_desc_match = re.search(
                        r'<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']+)["\']',
                        html_content, re.IGNORECASE
                    )
                    description = meta_desc_match.group(1) if meta_desc_match else ""

                    # Extract text content (basic)
                    text_content = re.sub(r'<[^>]+>', '', html_content)
                    text_content = ' '.join(text_content.split())[:5000]  # Limit content

                    return ScrapedData(
                        url=url,
                        title=title.strip(),
                        content=text_content,
                        metadata={"description": description},
                        pricing_info=self._extract_pricing_basic(text_content),
                        contact_info=self._extract_contact_basic(text_content),
                        social_links=self._extract_social_basic(html_content),
                        technologies=self._extract_tech_basic(html_content),
                        scraped_at=datetime.now(),
                        status="success"
                    )

        except Exception as e:
            logger.error(f"Custom scraping failed for {url}: {str(e)}")
            raise e

    def _extract_pricing(self, content: str, extracted: dict[str, Any]) -> list[dict[str, str]]:
        """Extract pricing information from content"""
        pricing_info = []

        # Look for pricing in extracted data first
        if extracted and "pricing" in extracted:
            pricing_data = extracted["pricing"]
            if isinstance(pricing_data, list):
                pricing_info.extend(pricing_data)
            elif isinstance(pricing_data, dict):
                pricing_info.append(pricing_data)

        # Fallback to regex extraction
        import re
        price_patterns = [
            r'\$(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:per|/)\s*(\w+)',
            r'(\w+)\s*plan[:\s]*\$(\d+(?:,\d{3})*(?:\.\d{2})?)',
            r'starting\s*(?:at|from)\s*\$(\d+(?:,\d{3})*(?:\.\d{2})?)',
        ]

        for pattern in price_patterns:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                pricing_info.append({
                    "plan": match.group(1) if len(match.groups()) > 1 else "Standard",
                    "price": match.group(2) if len(match.groups()) > 1 else match.group(1),
                    "period": "month"
                })

        return pricing_info[:10]  # Limit results

    def _extract_pricing_basic(self, content: str) -> list[dict[str, str]]:
        """Basic pricing extraction for custom scraping"""
        import re
        pricing_info = []

        price_patterns = [
            r'\$(\d+(?:,\d{3})*(?:\.\d{2})?)',
            r'(\d+)\s*dollars?',
            r'price[:\s]*(\d+)',
        ]

        for pattern in price_patterns:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                pricing_info.append({
                    "price": match.group(1),
                    "context": content[max(0, match.start()-50):match.end()+50]
                })

        return pricing_info[:5]

    def _extract_contact_info(self, content: str, extracted: dict[str, Any]) -> dict[str, str]:
        """Extract contact information"""
        contact_info = {}

        # Extract from structured data first
        if extracted and "contact" in extracted:
            contact_data = extracted["contact"]
            if isinstance(contact_data, dict):
                contact_info.update(contact_data)

        # Regex patterns for contact info
        import re

        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        phone_pattern = r'\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b'

        emails = re.findall(email_pattern, content)
        phones = re.findall(phone_pattern, content)

        if emails:
            contact_info["email"] = emails[0]
        if phones:
            contact_info["phone"] = f"({phones[0][0]}) {phones[0][1]}-{phones[0][2]}"

        return contact_info

    def _extract_contact_basic(self, content: str) -> dict[str, str]:
        """Basic contact extraction"""
        import re
        contact_info = {}

        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, content)

        if emails:
            contact_info["email"] = emails[0]

        return contact_info

    def _extract_social_links(self, content: str, metadata: dict[str, Any]) -> list[str]:
        """Extract social media links"""
        import re

        social_domains = [
            'facebook.com', 'twitter.com', 'x.com', 'linkedin.com',
            'instagram.com', 'youtube.com', 'tiktok.com'
        ]

        social_links = []

        for domain in social_domains:
            pattern = rf'https?://(?:www\.)?{re.escape(domain)}/[^\s<>"\']*'
            matches = re.findall(pattern, content, re.IGNORECASE)
            social_links.extend(matches)

        return list(set(social_links))  # Remove duplicates

    def _extract_social_basic(self, content: str) -> list[str]:
        """Basic social media extraction"""
        return self._extract_social_links(content, {})

    def _extract_technologies(self, metadata: dict[str, Any]) -> list[str]:
        """Extract technologies from metadata"""
        technologies = []

        # Common technology indicators
        tech_indicators = [
            'React', 'Vue', 'Angular', 'WordPress', 'Shopify',
            'Google Analytics', 'Facebook Pixel', 'Hotjar',
            'Stripe', 'PayPal', 'Cloudflare', 'AWS', 'CDN'
        ]

        content_str = str(metadata).lower()
        for tech in tech_indicators:
            if tech.lower() in content_str:
                technologies.append(tech)

        return technologies

    def _extract_tech_basic(self, content: str) -> list[str]:
        """Basic technology extraction"""
        import re
        technologies = []

        tech_patterns = [
            r'powered\s+by\s+(\w+)',
            r'built\s+with\s+(\w+)',
            r'using\s+(\w+)',
        ]

        for pattern in tech_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            technologies.extend(matches)

        return technologies[:10]

    async def scrape_multiple_competitors(self, urls: list[str], deep_scrape: bool = False) -> list[ScrapedData]:
        """Scrape multiple competitor websites concurrently"""

        logger.info(f"Scraping {len(urls)} competitor websites")

        semaphore = asyncio.Semaphore(3)  # Limit concurrent requests

        async def scrape_with_semaphore(url):
            async with semaphore:
                await asyncio.sleep(1)  # Rate limiting
                return await self.scrape_competitor_website(url, deep_scrape)

        tasks = [scrape_with_semaphore(url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Filter out exceptions
        scraped_data = []
        for result in results:
            if isinstance(result, ScrapedData):
                scraped_data.append(result)
            else:
                logger.error(f"Scraping exception: {result}")

        logger.info(f"Successfully scraped {len(scraped_data)} websites")
        return scraped_data

    def export_scraped_data(self, scraped_data: list[ScrapedData], filename: str = None) -> str:
        """Export scraped data to JSON file"""

        if filename is None:
            filename = f"scraped_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"

        export_data = {
            "scraping_session": {
                "timestamp": datetime.now().isoformat(),
                "total_scraped": len(scraped_data),
                "successful": len([d for d in scraped_data if d.status == "success"]),
                "failed": len([d for d in scraped_data if d.status == "error"])
            },
            "scraped_websites": [asdict(data) for data in scraped_data]
        }

        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(export_data, f, indent=2, default=str)

        logger.info(f"Scraped data exported to {filename}")
        return filename

# Example usage
async def main():
    """Test the web scraping agent"""

    agent = WebScrapingAgent()

    # Test URLs
    competitor_urls = [
        "https://www.hubspot.com",
        "https://www.mailchimp.com",
        "https://www.hootsuite.com"
    ]

    # Scrape competitors
    results = await agent.scrape_multiple_competitors(competitor_urls)

    # Export results
    report_file = agent.export_scraped_data(results)
    logger.info(f"Web scraping completed: {report_file}")

if __name__ == "__main__":
    asyncio.run(main())
