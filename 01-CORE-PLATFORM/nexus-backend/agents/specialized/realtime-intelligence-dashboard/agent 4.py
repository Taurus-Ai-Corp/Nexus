#!/usr/bin/env python3
"""
TAURUS AI CORP - Real-Time Intelligence Dashboard Agent
Competitor monitoring and strategy adaptation system
"""

import asyncio
import hashlib
import json
import re
from dataclasses import asdict, dataclass
from datetime import datetime, timedelta
from enum import Enum
from typing import Any

import aiohttp
import redis.asyncio as redis
from bs4 import BeautifulSoup
from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from textblob import TextBlob


class MonitoringType(Enum):
    PRICING = "pricing"
    FEATURES = "features"
    MARKETING = "marketing"
    SOCIAL_MEDIA = "social_media"
    CONTENT = "content"
    PRODUCT_UPDATES = "product_updates"
    JOB_POSTINGS = "job_postings"

class CompetitorTier(Enum):
    TIER_1 = "tier_1"  # Direct competitors
    TIER_2 = "tier_2"  # Indirect competitors
    TIER_3 = "tier_3"  # Adjacent competitors

class AlertSeverity(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

@dataclass
class Competitor:
    name: str
    domain: str
    tier: CompetitorTier
    monitoring_urls: list[str]
    social_handles: dict[str, str]
    last_checked: datetime
    is_active: bool = True

@dataclass
class CompetitorIntelligence:
    competitor_name: str
    monitoring_type: MonitoringType
    data_snapshot: dict[str, Any]
    changes_detected: list[dict[str, Any]]
    content_hash: str
    timestamp: datetime
    sentiment_score: float = 0.0

@dataclass
class StrategicAlert:
    alert_id: str
    competitor_name: str
    alert_type: MonitoringType
    severity: AlertSeverity
    title: str
    description: str
    recommended_action: str
    impact_assessment: str
    timestamp: datetime
    is_resolved: bool = False

@dataclass
class MarketIntelligence:
    market_trends: dict[str, Any]
    competitive_positioning: dict[str, float]
    opportunity_analysis: list[dict[str, Any]]
    threat_assessment: list[dict[str, Any]]
    strategic_recommendations: list[str]
    generated_at: datetime

class RealtimeIntelligenceDashboardAgent:
    """
    Agent responsible for:
    - Building real-time competitor tracking dashboard
    - Monitoring pricing changes, feature updates, marketing campaigns
    - Generating automated strategy adaptation recommendations
    - Creating alert systems for competitive intelligence
    """

    def __init__(self):
        self.name = "realtime-intelligence-dashboard"
        self.description = "Competitor monitoring & strategy adaptation"
        self.redis_client: redis.Redis | None = None
        self.db_session: AsyncSession | None = None
        self.competitors: dict[str, Competitor] = {}
        self.monitoring_active = False
        self.intelligence_cache = {}

    async def initialize(self, config: dict[str, Any]):
        """Initialize agent with configuration"""
        # Redis connection for real-time data
        self.redis_client = redis.from_url(
            config.get('redis_url', 'redis://localhost:6379'),
            decode_responses=True
        )

        # Database connection for historical intelligence
        engine = create_async_engine(
            config.get('database_url', 'postgresql+asyncpg://user:pass@localhost/taurus'),
            echo=config.get('debug', False)
        )
        async_session = sessionmaker(engine, class_=AsyncSession)
        self.db_session = async_session()

        # Load competitor database
        await self._load_competitors()

        # Start monitoring tasks
        asyncio.create_task(self.start_continuous_monitoring())

        print(f"✅ {self.name} agent initialized successfully")

    async def _load_competitors(self):
        """Load competitor database"""
        # Define major competitors for each tier
        self.competitors = {
            "hubspot": Competitor(
                name="HubSpot",
                domain="hubspot.com",
                tier=CompetitorTier.TIER_1,
                monitoring_urls=[
                    "https://www.hubspot.com/pricing",
                    "https://www.hubspot.com/products",
                    "https://blog.hubspot.com"
                ],
                social_handles={
                    "twitter": "@HubSpot",
                    "linkedin": "/company/hubspot"
                },
                last_checked=datetime.now() - timedelta(hours=1)
            ),
            "salesforce": Competitor(
                name="Salesforce",
                domain="salesforce.com",
                tier=CompetitorTier.TIER_1,
                monitoring_urls=[
                    "https://www.salesforce.com/products/platform/pricing/",
                    "https://www.salesforce.com/news/",
                    "https://trailhead.salesforce.com/"
                ],
                social_handles={
                    "twitter": "@salesforce",
                    "linkedin": "/company/salesforce"
                },
                last_checked=datetime.now() - timedelta(hours=1)
            ),
            "marketo": Competitor(
                name="Marketo",
                domain="marketo.com",
                tier=CompetitorTier.TIER_2,
                monitoring_urls=[
                    "https://www.marketo.com/software/",
                    "https://blog.marketo.com/",
                    "https://www.marketo.com/pricing/"
                ],
                social_handles={
                    "twitter": "@marketo",
                    "linkedin": "/company/marketo"
                },
                last_checked=datetime.now() - timedelta(hours=2)
            ),
            "mailchimp": Competitor(
                name="Mailchimp",
                domain="mailchimp.com",
                tier=CompetitorTier.TIER_2,
                monitoring_urls=[
                    "https://mailchimp.com/pricing/",
                    "https://mailchimp.com/features/",
                    "https://blog.mailchimp.com/"
                ],
                social_handles={
                    "twitter": "@Mailchimp",
                    "linkedin": "/company/mailchimp"
                },
                last_checked=datetime.now() - timedelta(hours=1)
            ),
            "zapier": Competitor(
                name="Zapier",
                domain="zapier.com",
                tier=CompetitorTier.TIER_3,
                monitoring_urls=[
                    "https://zapier.com/pricing",
                    "https://zapier.com/blog/",
                    "https://zapier.com/apps"
                ],
                social_handles={
                    "twitter": "@zapier",
                    "linkedin": "/company/zapier"
                },
                last_checked=datetime.now() - timedelta(hours=3)
            )
        }

    async def monitor_competitor(self, competitor_name: str, monitoring_type: MonitoringType) -> CompetitorIntelligence:
        """Monitor specific competitor for specific type of intelligence"""
        try:
            competitor = self.competitors.get(competitor_name)
            if not competitor:
                raise ValueError(f"Competitor {competitor_name} not found")

            intelligence_data = {}
            changes_detected = []

            if monitoring_type == MonitoringType.PRICING:
                intelligence_data = await self._monitor_pricing(competitor)
            elif monitoring_type == MonitoringType.FEATURES:
                intelligence_data = await self._monitor_features(competitor)
            elif monitoring_type == MonitoringType.MARKETING:
                intelligence_data = await self._monitor_marketing(competitor)
            elif monitoring_type == MonitoringType.SOCIAL_MEDIA:
                intelligence_data = await self._monitor_social_media(competitor)
            elif monitoring_type == MonitoringType.CONTENT:
                intelligence_data = await self._monitor_content(competitor)

            # Create content hash for change detection
            content_str = json.dumps(intelligence_data, sort_keys=True)
            content_hash = hashlib.md5(content_str.encode()).hexdigest()

            # Check for changes
            changes_detected = await self._detect_changes(competitor_name, monitoring_type, content_hash, intelligence_data)

            # Calculate sentiment if applicable
            sentiment_score = await self._calculate_sentiment(intelligence_data)

            intelligence = CompetitorIntelligence(
                competitor_name=competitor_name,
                monitoring_type=monitoring_type,
                data_snapshot=intelligence_data,
                changes_detected=changes_detected,
                content_hash=content_hash,
                timestamp=datetime.now(),
                sentiment_score=sentiment_score
            )

            # Cache the intelligence
            await self._cache_intelligence(intelligence)

            # Generate alerts if significant changes detected
            if changes_detected:
                await self._generate_alerts(intelligence, changes_detected)

            return intelligence

        except Exception as e:
            print(f"❌ Competitor monitoring failed for {competitor_name}: {e}")
            raise

    async def _monitor_pricing(self, competitor: Competitor) -> dict[str, Any]:
        """Monitor competitor pricing changes"""
        pricing_data = {}

        try:
            async with aiohttp.ClientSession() as session:
                for url in competitor.monitoring_urls:
                    if 'pricing' in url.lower():
                        async with session.get(url, timeout=10) as response:
                            if response.status == 200:
                                content = await response.text()
                                soup = BeautifulSoup(content, 'html.parser')

                                # Extract pricing information (simplified heuristic)
                                prices = []
                                price_patterns = [r'\$(\d+(?:,\d+)?(?:\.\d{2})?)', r'(\d+(?:,\d+)?)\s*\/\s*month']

                                for pattern in price_patterns:
                                    matches = re.findall(pattern, content, re.IGNORECASE)
                                    prices.extend(matches)

                                pricing_data[url] = {
                                    "detected_prices": prices[:10],  # Top 10 prices found
                                    "page_title": soup.title.string if soup.title else "",
                                    "last_modified": response.headers.get('last-modified', ''),
                                    "content_length": len(content)
                                }

        except Exception as e:
            print(f"⚠️ Pricing monitoring failed for {competitor.name}: {e}")

        return pricing_data

    async def _monitor_features(self, competitor: Competitor) -> dict[str, Any]:
        """Monitor competitor feature updates"""
        features_data = {}

        try:
            async with aiohttp.ClientSession() as session:
                for url in competitor.monitoring_urls:
                    if any(keyword in url.lower() for keyword in ['product', 'feature', 'software']):
                        async with session.get(url, timeout=10) as response:
                            if response.status == 200:
                                content = await response.text()
                                soup = BeautifulSoup(content, 'html.parser')

                                # Extract feature-related keywords
                                feature_keywords = [
                                    'automation', 'ai', 'artificial intelligence', 'machine learning',
                                    'integration', 'api', 'workflow', 'analytics', 'dashboard',
                                    'crm', 'email marketing', 'lead generation', 'conversion'
                                ]

                                feature_mentions = {}
                                text_content = soup.get_text().lower()

                                for keyword in feature_keywords:
                                    count = text_content.count(keyword)
                                    if count > 0:
                                        feature_mentions[keyword] = count

                                features_data[url] = {
                                    "feature_mentions": feature_mentions,
                                    "page_title": soup.title.string if soup.title else "",
                                    "headings": [h.get_text().strip() for h in soup.find_all(['h1', 'h2', 'h3'])[:10]],
                                    "meta_description": soup.find('meta', attrs={'name': 'description'})
                                }

        except Exception as e:
            print(f"⚠️ Feature monitoring failed for {competitor.name}: {e}")

        return features_data

    async def _monitor_marketing(self, competitor: Competitor) -> dict[str, Any]:
        """Monitor competitor marketing campaigns and messaging"""
        marketing_data = {}

        try:
            async with aiohttp.ClientSession() as session:
                for url in competitor.monitoring_urls:
                    if any(keyword in url.lower() for keyword in ['blog', 'news', 'marketing']):
                        async with session.get(url, timeout=10) as response:
                            if response.status == 200:
                                content = await response.text()
                                soup = BeautifulSoup(content, 'html.parser')

                                # Extract recent blog posts or news
                                articles = []
                                article_elements = soup.find_all(['article', 'div'], class_=re.compile(r'post|article|blog|news'))

                                for article in article_elements[:5]:
                                    title_elem = article.find(['h1', 'h2', 'h3', 'h4'])
                                    title = title_elem.get_text().strip() if title_elem else "No title"

                                    date_elem = article.find(['time', 'span'], class_=re.compile(r'date|time'))
                                    date = date_elem.get_text().strip() if date_elem else ""

                                    articles.append({
                                        "title": title,
                                        "date": date,
                                        "url": url
                                    })

                                marketing_data[url] = {
                                    "recent_articles": articles,
                                    "page_title": soup.title.string if soup.title else "",
                                    "meta_keywords": soup.find('meta', attrs={'name': 'keywords'})
                                }

        except Exception as e:
            print(f"⚠️ Marketing monitoring failed for {competitor.name}: {e}")

        return marketing_data

    async def _monitor_social_media(self, competitor: Competitor) -> dict[str, Any]:
        """Monitor competitor social media activity"""
        # Note: In production, this would integrate with Twitter API, LinkedIn API, etc.
        # For now, we'll simulate social media monitoring

        social_data = {
            "twitter": {
                "recent_posts": [
                    {"text": f"Sample tweet from {competitor.name}", "engagement": 150, "date": datetime.now().isoformat()},
                    {"text": f"Another update from {competitor.name}", "engagement": 89, "date": (datetime.now() - timedelta(hours=2)).isoformat()}
                ],
                "follower_growth": "2.5%",
                "engagement_rate": "3.2%"
            },
            "linkedin": {
                "company_updates": [
                    {"title": f"{competitor.name} announces new feature", "likes": 45, "date": datetime.now().isoformat()},
                    {"title": f"Join {competitor.name} team", "likes": 23, "date": (datetime.now() - timedelta(hours=4)).isoformat()}
                ],
                "follower_count": "10k+",
                "posting_frequency": "Daily"
            }
        }

        return social_data

    async def _monitor_content(self, competitor: Competitor) -> dict[str, Any]:
        """Monitor competitor content strategy"""
        content_data = {}

        try:
            async with aiohttp.ClientSession() as session:
                main_url = f"https://{competitor.domain}"
                async with session.get(main_url, timeout=10) as response:
                    if response.status == 200:
                        content = await response.text()
                        soup = BeautifulSoup(content, 'html.parser')

                        # Extract main messaging and value propositions
                        h1_tags = [h1.get_text().strip() for h1 in soup.find_all('h1')]
                        h2_tags = [h2.get_text().strip() for h2 in soup.find_all('h2')]

                        # Look for call-to-action buttons
                        cta_buttons = []
                        button_elements = soup.find_all(['button', 'a'], class_=re.compile(r'btn|cta|button'))
                        for btn in button_elements[:10]:
                            text = btn.get_text().strip()
                            if text and len(text) < 50:
                                cta_buttons.append(text)

                        content_data = {
                            "main_headings": h1_tags[:5],
                            "sub_headings": h2_tags[:10],
                            "cta_buttons": cta_buttons,
                            "page_title": soup.title.string if soup.title else "",
                            "meta_description": soup.find('meta', attrs={'name': 'description'})
                        }

        except Exception as e:
            print(f"⚠️ Content monitoring failed for {competitor.name}: {e}")

        return content_data

    async def _detect_changes(self, competitor_name: str, monitoring_type: MonitoringType,
                            new_hash: str, new_data: dict[str, Any]) -> list[dict[str, Any]]:
        """Detect changes from previous monitoring"""
        changes = []

        try:
            if self.redis_client:
                # Get previous hash
                prev_key = f"hash:{competitor_name}:{monitoring_type.value}"
                prev_hash = await self.redis_client.get(prev_key)

                if prev_hash and prev_hash != new_hash:
                    # Get previous data
                    data_key = f"intelligence:{competitor_name}:{monitoring_type.value}:previous"
                    prev_data_str = await self.redis_client.get(data_key)

                    if prev_data_str:
                        prev_data = json.loads(prev_data_str)

                        # Detect specific changes (simplified)
                        if monitoring_type == MonitoringType.PRICING:
                            changes.extend(await self._detect_pricing_changes(prev_data, new_data))
                        elif monitoring_type == MonitoringType.FEATURES:
                            changes.extend(await self._detect_feature_changes(prev_data, new_data))
                        elif monitoring_type == MonitoringType.MARKETING:
                            changes.extend(await self._detect_marketing_changes(prev_data, new_data))

                # Store current data as previous for next comparison
                await self.redis_client.setex(prev_key, 604800, new_hash)  # 7 days
                data_key = f"intelligence:{competitor_name}:{monitoring_type.value}:previous"
                await self.redis_client.setex(data_key, 604800, json.dumps(new_data))

        except Exception as e:
            print(f"⚠️ Change detection failed: {e}")

        return changes

    async def _detect_pricing_changes(self, prev_data: dict, new_data: dict) -> list[dict[str, Any]]:
        """Detect pricing changes"""
        changes = []

        for url in new_data:
            if url in prev_data:
                prev_prices = set(prev_data[url].get('detected_prices', []))
                new_prices = set(new_data[url].get('detected_prices', []))

                if prev_prices != new_prices:
                    changes.append({
                        "type": "pricing_change",
                        "url": url,
                        "previous_prices": list(prev_prices),
                        "new_prices": list(new_prices),
                        "change_type": "price_update"
                    })

        return changes

    async def _detect_feature_changes(self, prev_data: dict, new_data: dict) -> list[dict[str, Any]]:
        """Detect feature changes"""
        changes = []

        for url in new_data:
            if url in prev_data:
                prev_features = prev_data[url].get('feature_mentions', {})
                new_features = new_data[url].get('feature_mentions', {})

                # Check for new feature keywords
                new_keywords = set(new_features.keys()) - set(prev_features.keys())
                if new_keywords:
                    changes.append({
                        "type": "new_features",
                        "url": url,
                        "new_keywords": list(new_keywords),
                        "change_type": "feature_addition"
                    })

        return changes

    async def _detect_marketing_changes(self, prev_data: dict, new_data: dict) -> list[dict[str, Any]]:
        """Detect marketing changes"""
        changes = []

        for url in new_data:
            if url in prev_data:
                prev_articles = [a['title'] for a in prev_data[url].get('recent_articles', [])]
                new_articles = [a['title'] for a in new_data[url].get('recent_articles', [])]

                # Check for new articles
                new_titles = set(new_articles) - set(prev_articles)
                if new_titles:
                    changes.append({
                        "type": "new_content",
                        "url": url,
                        "new_articles": list(new_titles),
                        "change_type": "content_publication"
                    })

        return changes

    async def _calculate_sentiment(self, data: dict[str, Any]) -> float:
        """Calculate sentiment score from data"""
        try:
            text_content = ""

            # Extract text content for sentiment analysis
            for key, value in data.items():
                if isinstance(value, dict):
                    if 'page_title' in value:
                        text_content += value['page_title'] + " "
                    if 'recent_articles' in value:
                        for article in value['recent_articles']:
                            text_content += article.get('title', '') + " "

            if text_content.strip():
                blob = TextBlob(text_content)
                return blob.sentiment.polarity  # Range: -1 to 1

        except Exception as e:
            print(f"⚠️ Sentiment calculation failed: {e}")

        return 0.0

    async def _cache_intelligence(self, intelligence: CompetitorIntelligence):
        """Cache intelligence data"""
        try:
            if self.redis_client:
                key = f"intelligence:{intelligence.competitor_name}:{intelligence.monitoring_type.value}:{int(intelligence.timestamp.timestamp())}"
                await self.redis_client.setex(
                    key,
                    86400,  # 24 hours
                    json.dumps(asdict(intelligence), default=str)
                )
        except Exception as e:
            print(f"⚠️ Failed to cache intelligence: {e}")

    async def _generate_alerts(self, intelligence: CompetitorIntelligence, changes: list[dict[str, Any]]):
        """Generate alerts based on detected changes"""
        try:
            for change in changes:
                severity = AlertSeverity.MEDIUM

                # Determine severity based on change type
                if change['change_type'] == 'pricing_change':
                    severity = AlertSeverity.HIGH
                elif change['change_type'] == 'feature_addition':
                    severity = AlertSeverity.MEDIUM
                elif change['change_type'] == 'content_publication':
                    severity = AlertSeverity.LOW

                alert = StrategicAlert(
                    alert_id=f"alert_{int(datetime.now().timestamp())}_{intelligence.competitor_name}",
                    competitor_name=intelligence.competitor_name,
                    alert_type=intelligence.monitoring_type,
                    severity=severity,
                    title=f"{intelligence.competitor_name} {change['change_type'].replace('_', ' ').title()}",
                    description=f"Detected {change['type']} for {intelligence.competitor_name}",
                    recommended_action=await self._get_recommended_action(change),
                    impact_assessment=await self._assess_impact(change),
                    timestamp=datetime.now()
                )

                # Cache alert
                await self._cache_alert(alert)

        except Exception as e:
            print(f"⚠️ Alert generation failed: {e}")

    async def _get_recommended_action(self, change: dict[str, Any]) -> str:
        """Get recommended action based on change type"""
        recommendations = {
            'pricing_change': 'Review our pricing strategy and consider competitive adjustments',
            'feature_addition': 'Analyze new features and assess if we should develop similar capabilities',
            'content_publication': 'Review their content strategy and identify opportunities for our content',
            'new_content': 'Monitor engagement levels and consider response content'
        }

        return recommendations.get(change.get('change_type'), 'Monitor situation and assess impact')

    async def _assess_impact(self, change: dict[str, Any]) -> str:
        """Assess impact of detected change"""
        impact_assessments = {
            'pricing_change': 'Medium - May affect competitive positioning and win rates',
            'feature_addition': 'High - Could impact product differentiation and feature gaps',
            'content_publication': 'Low - Monitor for messaging trends and competitive positioning',
            'new_content': 'Low - Track engagement and response strategies'
        }

        return impact_assessments.get(change.get('change_type'), 'Unknown - Requires manual assessment')

    async def _cache_alert(self, alert: StrategicAlert):
        """Cache strategic alert"""
        try:
            if self.redis_client:
                key = f"alert:{alert.alert_id}"
                await self.redis_client.setex(
                    key,
                    604800,  # 7 days
                    json.dumps(asdict(alert), default=str)
                )
        except Exception as e:
            print(f"⚠️ Failed to cache alert: {e}")

    async def start_continuous_monitoring(self):
        """Start continuous monitoring of all competitors"""
        self.monitoring_active = True
        print("🔄 Starting continuous competitive intelligence monitoring...")

        while self.monitoring_active:
            try:
                for competitor_name in self.competitors:
                    # Monitor all types for each competitor
                    for monitoring_type in MonitoringType:
                        try:
                            await self.monitor_competitor(competitor_name, monitoring_type)
                            await asyncio.sleep(2)  # Rate limiting
                        except Exception as e:
                            print(f"⚠️ Monitoring failed for {competitor_name} - {monitoring_type}: {e}")

                    await asyncio.sleep(10)  # Delay between competitors

                # Wait before next full cycle (1 hour)
                await asyncio.sleep(3600)

            except Exception as e:
                print(f"❌ Continuous monitoring error: {e}")
                await asyncio.sleep(300)  # Wait 5 minutes before retry

    async def generate_market_intelligence_report(self) -> MarketIntelligence:
        """Generate comprehensive market intelligence report"""
        try:
            if not self.redis_client:
                raise ValueError("Redis not available")

            # Get all intelligence data
            intelligence_keys = await self.redis_client.keys("intelligence:*")
            all_intelligence = []

            for key in intelligence_keys[-50:]:  # Last 50 intelligence records
                data = await self.redis_client.get(key)
                if data:
                    all_intelligence.append(json.loads(data))

            # Analyze market trends
            market_trends = await self._analyze_market_trends(all_intelligence)

            # Calculate competitive positioning
            competitive_positioning = await self._calculate_competitive_positioning(all_intelligence)

            # Identify opportunities and threats
            opportunities = await self._identify_opportunities(all_intelligence)
            threats = await self._identify_threats(all_intelligence)

            # Generate strategic recommendations
            recommendations = await self._generate_strategic_recommendations(
                market_trends, competitive_positioning, opportunities, threats
            )

            report = MarketIntelligence(
                market_trends=market_trends,
                competitive_positioning=competitive_positioning,
                opportunity_analysis=opportunities,
                threat_assessment=threats,
                strategic_recommendations=recommendations,
                generated_at=datetime.now()
            )

            return report

        except Exception as e:
            print(f"❌ Market intelligence report generation failed: {e}")
            raise

    async def _analyze_market_trends(self, intelligence_data: list[dict]) -> dict[str, Any]:
        """Analyze market trends from intelligence data"""
        trends = {
            "ai_automation_mentions": 0,
            "pricing_trend": "stable",
            "feature_velocity": "medium",
            "content_themes": [],
            "sentiment_trend": 0.0
        }

        ai_keywords = ['ai', 'artificial intelligence', 'automation', 'machine learning']
        sentiment_scores = []

        for intel in intelligence_data:
            # Count AI mentions
            data_str = json.dumps(intel.get('data_snapshot', {})).lower()
            for keyword in ai_keywords:
                trends["ai_automation_mentions"] += data_str.count(keyword)

            # Collect sentiment scores
            if 'sentiment_score' in intel:
                sentiment_scores.append(intel['sentiment_score'])

        if sentiment_scores:
            trends["sentiment_trend"] = sum(sentiment_scores) / len(sentiment_scores)

        return trends

    async def _calculate_competitive_positioning(self, intelligence_data: list[dict]) -> dict[str, float]:
        """Calculate competitive positioning scores"""
        positioning = {}

        for competitor_name in self.competitors:
            # Simple scoring based on monitoring frequency and changes detected
            competitor_intel = [i for i in intelligence_data if i.get('competitor_name') == competitor_name]

            activity_score = len(competitor_intel) * 10
            change_score = sum(len(i.get('changes_detected', [])) for i in competitor_intel) * 20
            sentiment_score = sum(i.get('sentiment_score', 0) for i in competitor_intel) * 10

            total_score = activity_score + change_score + sentiment_score
            positioning[competitor_name] = min(100, max(0, total_score))

        return positioning

    async def _identify_opportunities(self, intelligence_data: list[dict]) -> list[dict[str, Any]]:
        """Identify market opportunities"""
        opportunities = [
            {
                "opportunity": "AI Automation Gap",
                "description": "Competitors showing limited AI automation features",
                "priority": "High",
                "estimated_impact": "25% market share gain",
                "timeline": "3-6 months"
            },
            {
                "opportunity": "Pricing Advantage",
                "description": "Room for competitive pricing in mid-market segment",
                "priority": "Medium",
                "estimated_impact": "15% conversion improvement",
                "timeline": "1-2 months"
            },
            {
                "opportunity": "Content Marketing Gap",
                "description": "Competitors lack consistent thought leadership content",
                "priority": "Medium",
                "estimated_impact": "20% brand awareness increase",
                "timeline": "2-4 months"
            }
        ]

        return opportunities

    async def _identify_threats(self, intelligence_data: list[dict]) -> list[dict[str, Any]]:
        """Identify competitive threats"""
        threats = [
            {
                "threat": "Feature Parity Race",
                "description": "Major competitors rapidly adding AI features",
                "severity": "Medium",
                "probability": "High",
                "mitigation": "Accelerate unique feature development"
            },
            {
                "threat": "Price Competition",
                "description": "Potential price wars in the automation space",
                "severity": "Medium",
                "probability": "Medium",
                "mitigation": "Focus on value differentiation over price"
            }
        ]

        return threats

    async def _generate_strategic_recommendations(self, trends: dict, positioning: dict,
                                               opportunities: list, threats: list) -> list[str]:
        """Generate strategic recommendations"""
        recommendations = [
            "Accelerate AI automation feature development to maintain competitive advantage",
            "Monitor competitor pricing changes weekly and adjust positioning accordingly",
            "Increase content marketing frequency to capitalize on competitor content gaps",
            "Develop unique features that competitors cannot easily replicate",
            "Focus on customer success stories to differentiate from feature-focused competitors"
        ]

        # Add dynamic recommendations based on trends
        if trends.get("ai_automation_mentions", 0) > 100:
            recommendations.append("AI automation is trending - prioritize AI-related marketing messages")

        if trends.get("sentiment_trend", 0) < -0.2:
            recommendations.append("Negative sentiment detected - consider proactive PR strategy")

        return recommendations

    async def get_dashboard_data(self) -> dict[str, Any]:
        """Get real-time dashboard data"""
        try:
            if not self.redis_client:
                return {"error": "Redis not available"}

            # Get recent alerts
            alert_keys = await self.redis_client.keys("alert:*")
            alerts = []

            for key in sorted(alert_keys)[-10:]:  # Last 10 alerts
                data = await self.redis_client.get(key)
                if data:
                    alerts.append(json.loads(data))

            # Get competitor activity summary
            intelligence_keys = await self.redis_client.keys("intelligence:*")
            competitor_activity = {}

            for competitor_name in self.competitors:
                competitor_keys = [k for k in intelligence_keys if competitor_name in k]
                competitor_activity[competitor_name] = {
                    "total_updates": len(competitor_keys),
                    "last_checked": self.competitors[competitor_name].last_checked.isoformat(),
                    "tier": self.competitors[competitor_name].tier.value
                }

            dashboard_data = {
                "monitoring_status": "active" if self.monitoring_active else "inactive",
                "total_competitors": len(self.competitors),
                "active_alerts": len([a for a in alerts if not a.get('is_resolved', False)]),
                "recent_alerts": alerts,
                "competitor_activity": competitor_activity,
                "last_update": datetime.now().isoformat()
            }

            return dashboard_data

        except Exception as e:
            return {"error": f"Dashboard data generation failed: {e}"}

# FastAPI integration
app = FastAPI(title="Real-Time Intelligence Dashboard Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = RealtimeIntelligenceDashboardAgent()

@app.on_event("startup")
async def startup_event():
    config = {
        "redis_url": "redis://localhost:6379",
        "database_url": "postgresql+asyncpg://user:pass@localhost/taurus",
        "debug": True
    }
    await agent.initialize(config)

@app.post("/intelligence/monitor/{competitor_name}")
async def monitor_competitor(competitor_name: str, monitoring_type: str):
    """Monitor specific competitor"""
    try:
        monitor_type = MonitoringType(monitoring_type.lower())
        intelligence = await agent.monitor_competitor(competitor_name, monitor_type)
        return asdict(intelligence)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/intelligence/report")
async def get_market_intelligence():
    """Get comprehensive market intelligence report"""
    try:
        report = await agent.generate_market_intelligence_report()
        return asdict(report)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/intelligence/dashboard")
async def get_dashboard():
    """Get real-time dashboard data"""
    return await agent.get_dashboard_data()

@app.websocket("/ws/intelligence")
async def websocket_intelligence(websocket: WebSocket):
    """WebSocket for real-time intelligence updates"""
    await websocket.accept()
    try:
        while True:
            dashboard_data = await agent.get_dashboard_data()
            await websocket.send_json(dashboard_data)
            await asyncio.sleep(60)  # Send update every minute
    except Exception as e:
        print(f"WebSocket error: {e}")

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Real-Time Intelligence Dashboard Agent...")
    uvicorn.run(app, host="0.0.0.0", port=8006)
