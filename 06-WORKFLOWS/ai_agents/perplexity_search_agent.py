#!/usr/bin/env python3
"""
Perplexity Search Agent for TAAS Canada Inc.
Main internet research agent using Perplexity AI for real-time information
"""

import json
import logging
import time
from dataclasses import dataclass
from datetime import datetime

import perplexityai

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class SearchResult:
    """Data structure for search results"""
    query: str
    content: str
    sources: list[str]
    timestamp: datetime
    market: str
    insights: list[str]

class PerplexitySearchAgent:
    """
    AI-powered search agent using Perplexity for real-time internet research
    """

    def __init__(self, perplexity_api_key: str):
        self.client = perplexityai.Perplexity(api_key=perplexity_api_key)
        self.search_history = []

    def search_market_intelligence(self, query: str, market: str) -> SearchResult:
        """
        Search for market intelligence using Perplexity
        
        Args:
            query: Search query for market research
            market: Target market (UAE, India, Canada)
            
        Returns:
            Comprehensive search results with insights
        """
        try:
            # Enhance query with market-specific context
            enhanced_query = self._enhance_query_for_market(query, market)

            # Perform search using Perplexity
            response = self.client.chat(
                model="pplx-7b-online",  # Use online model for real-time data
                messages=[{
                    "role": "user",
                    "content": enhanced_query
                }],
                max_tokens=2000
            )

            # Extract insights from response
            insights = self._extract_insights(response.content, market)

            # Create search result
            result = SearchResult(
                query=query,
                content=response.content,
                sources=response.sources if hasattr(response, 'sources') else [],
                timestamp=datetime.now(),
                market=market,
                insights=insights
            )

            # Store in history
            self.search_history.append(result)

            logger.info(f"Market intelligence search completed for {market}")
            return result

        except Exception as e:
            logger.error(f"Search failed: {e}")
            return None

    def _enhance_query_for_market(self, query: str, market: str) -> str:
        """Enhance search query with market-specific context"""
        market_contexts = {
            "UAE": """
            Focus on UAE market specifically:
            - Dubai and Abu Dhabi business environment
            - Islamic business practices and compliance
            - Local market trends and opportunities
            - Cultural considerations for marketing
            - Regulatory environment and business setup
            """,
            "India": """
            Focus on Indian market specifically:
            - Kerala and major business hubs
            - Local business practices and culture
            - Market trends and opportunities
            - Language considerations (English, Malayalam, Hindi)
            - Regulatory environment and compliance
            """,
            "Canada": """
            Focus on Canadian market specifically:
            - Toronto, Vancouver, and major business centers
            - Bilingual business environment (EN/FR)
            - Local market trends and opportunities
            - Cultural considerations for marketing
            - Regulatory environment and business setup
            """
        }

        context = market_contexts.get(market, "")
        enhanced_query = f"""
        {query}
        
        {context}
        
        Please provide:
        1. Current market trends and opportunities
        2. Local business practices and cultural considerations
        3. Regulatory requirements and compliance needs
        4. Competitive landscape and market gaps
        5. Actionable insights for business entry
        6. Recent news and developments
        7. Local partnerships and networking opportunities
        
        Make the information specific to {market} and actionable for business planning.
        """

        return enhanced_query

    def _extract_insights(self, content: str, market: str) -> list[str]:
        """Extract key insights from search results"""
        try:
            # Use Claude to extract insights (if available)
            insights_prompt = f"""
            Extract key business insights from this market research for {market}:
            
            {content}
            
            Provide 5-7 actionable insights in bullet points.
            Focus on business opportunities, market gaps, and strategic recommendations.
            """

            # For now, return basic insights
            # In full implementation, this would use Claude for analysis
            insights = [
                f"Market-specific opportunity identified in {market}",
                "Local business practices documented",
                "Regulatory requirements outlined",
                "Competitive landscape analyzed",
                "Strategic recommendations provided"
            ]

            return insights

        except Exception as e:
            logger.error(f"Insight extraction failed: {e}")
            return ["Insight extraction failed"]

    def search_competitor_analysis(self, competitor: str, market: str) -> SearchResult:
        """Search for competitor information in specific market"""
        query = f"Analyze {competitor} business operations, market presence, and competitive strategies in {market}"
        return self.search_market_intelligence(query, market)

    def search_market_trends(self, market: str, industry: str = "digital marketing") -> SearchResult:
        """Search for market trends in specific industry"""
        query = f"Current trends and opportunities in {industry} industry in {market} market"
        return self.search_market_intelligence(query, market)

    def search_local_partnerships(self, market: str) -> SearchResult:
        """Search for potential local partnerships and networking opportunities"""
        query = f"Local business networks, partnerships, and networking opportunities for digital marketing companies in {market}"
        return self.search_market_intelligence(query, market)

    def search_regulatory_requirements(self, market: str) -> SearchResult:
        """Search for regulatory requirements and compliance needs"""
        query = f"Business registration, regulatory compliance, and legal requirements for digital marketing companies in {market}"
        return self.search_market_intelligence(query, market)

    def comprehensive_market_research(self, market: str) -> dict[str, SearchResult]:
        """Perform comprehensive market research for a specific market"""
        research_areas = {
            "market_trends": f"Current market trends and opportunities in {market}",
            "competitive_landscape": f"Competitive landscape and major players in digital marketing in {market}",
            "local_partnerships": f"Local business networks and partnership opportunities in {market}",
            "regulatory_requirements": f"Business registration and compliance requirements in {market}",
            "cultural_considerations": f"Cultural considerations and local business practices in {market}",
            "market_gaps": f"Market gaps and underserved areas in digital marketing in {market}"
        }

        results = {}
        for area, query in research_areas.items():
            logger.info(f"Researching {area} for {market}...")
            result = self.search_market_intelligence(query, market)
            if result:
                results[area] = result
            time.sleep(2)  # Rate limiting

        return results

    def export_search_history(self, filename: str = "perplexity_search_history.json"):
        """Export search history to JSON file"""
        try:
            history_data = {
                "export_date": datetime.now().isoformat(),
                "total_searches": len(self.search_history),
                "searches": [
                    {
                        "query": result.query,
                        "market": result.market,
                        "timestamp": result.timestamp.isoformat(),
                        "insights": result.insights,
                        "sources": result.sources
                    }
                    for result in self.search_history
                ]
            }

            with open(filename, 'w') as f:
                json.dump(history_data, f, indent=2)

            logger.info(f"Search history exported to {filename}")
            return filename

        except Exception as e:
            logger.error(f"Export failed: {e}")
            return None

def main():
    """Main function to test Perplexity search agent"""
    # Initialize agent (you'll need to set your API key)
    api_key = "your-perplexity-api-key-here"
    agent = PerplexitySearchAgent(api_key)

    # Test market research for UAE
    logger.info("Testing UAE market research...")
    uae_result = agent.search_market_intelligence(
        "Digital marketing opportunities and trends",
        "UAE"
    )

    if uae_result:
        print("UAE Research Results:")
        print(f"Query: {uae_result.query}")
        print(f"Market: {uae_result.market}")
        print(f"Insights: {uae_result.insights}")
        print(f"Timestamp: {uae_result.timestamp}")

    # Test comprehensive market research for India
    logger.info("Testing comprehensive India market research...")
    india_research = agent.comprehensive_market_research("India")

    print("\nIndia Comprehensive Research:")
    for area, result in india_research.items():
        print(f"- {area}: {len(result.insights)} insights")

    # Export search history
    export_file = agent.export_search_history()
    if export_file:
        print(f"\nSearch history exported to {export_file}")

if __name__ == "__main__":
    main()
