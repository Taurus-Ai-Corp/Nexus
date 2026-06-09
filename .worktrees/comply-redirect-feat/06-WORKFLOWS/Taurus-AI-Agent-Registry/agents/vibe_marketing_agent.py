"""
🎨 Taurus AI Corp. - Vibe Marketing Content Generation Agent
AI-powered marketing content creation with brand personality and market intelligence
"""

import os
import asyncio
import logging
from typing import Dict, List, Any, Optional, Union
from datetime import datetime
from enum import Enum
from dataclasses import dataclass
import json
import random

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from registry.base_agent import BaseAgent
from registry.agent_registry import AgentMetadata

logger = logging.getLogger(__name__)

class ContentType(Enum):
    SOCIAL_MEDIA_POST = "social_media_post"
    BLOG_ARTICLE = "blog_article"
    EMAIL_CAMPAIGN = "email_campaign"
    AD_COPY = "ad_copy"
    LANDING_PAGE_COPY = "landing_page_copy"
    PRODUCT_DESCRIPTION = "product_description"
    VIDEO_SCRIPT = "video_script"
    PODCAST_SCRIPT = "podcast_script"
    PRESS_RELEASE = "press_release"
    NEWSLETTER = "newsletter"

class VibeStyle(Enum):
    PROFESSIONAL = "professional"
    CASUAL = "casual"
    EDGY = "edgy"
    INSPIRATIONAL = "inspirational"
    HUMOROUS = "humorous"
    LUXURY = "luxury"
    TECH_SAVVY = "tech_savvy"
    COMMUNITY_FOCUSED = "community_focused"
    INNOVATIVE = "innovative"
    TRUSTWORTHY = "trustworthy"

class TargetMarket(Enum):
    UAE = "uae"
    INDIA = "india"
    CANADA = "canada"
    GLOBAL = "global"
    MENA = "mena"
    ASIA_PACIFIC = "asia_pacific"
    NORTH_AMERICA = "north_america"

@dataclass
class VibeProfile:
    brand_name: str
    industry: str
    target_audience: str
    primary_vibe: VibeStyle
    secondary_vibes: List[VibeStyle]
    tone_keywords: List[str]
    avoid_keywords: List[str]
    brand_values: List[str]
    unique_selling_points: List[str]

@dataclass
class ContentRequest:
    content_type: ContentType
    vibe_profile: VibeProfile
    target_market: TargetMarket
    topic: str
    key_messages: List[str]
    call_to_action: str
    length_requirement: str  # "short", "medium", "long"
    platform_specific: Optional[str] = None  # "instagram", "linkedin", "twitter", etc.
    include_hashtags: bool = True
    include_emojis: bool = True
    urgency_level: str = "medium"  # "low", "medium", "high"

@dataclass
class GeneratedContent:
    content: str
    headline: str
    call_to_action: str
    hashtags: List[str]
    emojis_used: List[str]
    content_type: ContentType
    vibe_style: VibeStyle
    target_market: TargetMarket
    word_count: int
    estimated_engagement_score: float
    brand_alignment_score: float
    market_relevance_score: float
    created_at: datetime

class VibeMarketingAgent(BaseAgent):
    """AI-powered vibe marketing content generation agent"""
    
    def __init__(self):
        super().__init__()  # Call BaseAgent __init__
        self.ai_router = None  # Will be injected
        self.initialized = False
        
        # Market-specific insights
        self.market_insights = {
            TargetMarket.UAE: {
                "cultural_context": ["luxury", "innovation", "tradition", "hospitality", "ambition"],
                "preferred_platforms": ["instagram", "linkedin", "tiktok", "whatsapp"],
                "peak_times": ["19:00-23:00", "12:00-14:00"],
                "language_preferences": ["english", "arabic"],
                "content_preferences": ["visual", "aspirational", "family-oriented"],
                "hashtag_style": "premium_focused"
            },
            TargetMarket.INDIA: {
                "cultural_context": ["family", "value", "innovation", "growth", "community"],
                "preferred_platforms": ["whatsapp", "instagram", "facebook", "youtube"],
                "peak_times": ["20:00-22:00", "13:00-15:00"],
                "language_preferences": ["hindi", "english", "regional"],
                "content_preferences": ["relatable", "value-driven", "educational"],
                "hashtag_style": "community_focused"
            },
            TargetMarket.CANADA: {
                "cultural_context": ["inclusivity", "sustainability", "quality", "politeness", "diversity"],
                "preferred_platforms": ["linkedin", "facebook", "instagram", "twitter"],
                "peak_times": ["18:00-21:00", "12:00-13:00"],
                "language_preferences": ["english", "french"],
                "content_preferences": ["authentic", "informative", "respectful"],
                "hashtag_style": "professional_friendly"
            }
        }
        
        # Vibe-specific templates and patterns
        self.vibe_templates = {
            VibeStyle.PROFESSIONAL: {
                "tone": "authoritative, knowledgeable, trustworthy",
                "structure": "data-driven, clear, actionable",
                "vocabulary": "industry expertise, proven results, professional excellence",
                "emoji_usage": "minimal, professional only"
            },
            VibeStyle.INNOVATIVE: {
                "tone": "forward-thinking, exciting, transformative",
                "structure": "future-focused, solution-oriented, visionary",
                "vocabulary": "cutting-edge, breakthrough, revolutionary, next-generation",
                "emoji_usage": "tech and innovation focused"
            },
            VibeStyle.COMMUNITY_FOCUSED: {
                "tone": "inclusive, warm, collaborative",
                "structure": "story-driven, relatable, engaging",
                "vocabulary": "together, community, shared success, collective growth",
                "emoji_usage": "people and connection focused"
            }
        }
        
        # Content performance patterns
        self.performance_patterns = {
            "high_engagement": ["questions", "behind_the_scenes", "user_generated_content", "tutorials"],
            "viral_potential": ["controversy", "trending_topics", "challenges", "humor"],
            "conversion_focused": ["testimonials", "case_studies", "limited_offers", "social_proof"]
        }
    
    async def initialize(self):
        """Initialize the Vibe Marketing Agent"""
        logger.info("🎨 Initializing Vibe Marketing Agent...")
        
        try:
            # Agent is ready - AI router will be injected when needed
            self.initialized = True
            logger.info("✅ Vibe Marketing Agent ready")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Vibe Marketing Agent: {e}")
            self.initialized = False
    
    def set_ai_router(self, ai_router):
        """Set the AI router for content generation"""
        self.ai_router = ai_router
    
    async def generate_content(self, request: ContentRequest) -> GeneratedContent:
        """Generate marketing content based on vibe profile and requirements"""
        
        if not self.ai_router:
            raise Exception("AI router not available")
        
        try:
            logger.info(f"🎨 Generating {request.content_type.value} for {request.target_market.value}")
            
            # Prepare context and prompt
            context = await self._build_content_context(request)
            prompt = await self._build_generation_prompt(request, context)
            
            # Generate content using AI router
            response = await self.ai_router.generate_text(
                prompt=prompt,
                max_tokens=self._get_token_limit(request.length_requirement),
                temperature=0.8  # Creative temperature
            )
            
            # Parse and structure the response
            content = await self._parse_generated_content(response, request)
            
            # Generate performance scores
            content.estimated_engagement_score = await self._calculate_engagement_score(content, request)
            content.brand_alignment_score = await self._calculate_brand_alignment_score(content, request)
            content.market_relevance_score = await self._calculate_market_relevance_score(content, request)
            
            logger.info(f"✅ Content generated: {content.word_count} words, engagement score: {content.estimated_engagement_score}")
            
            return content
            
        except Exception as e:
            logger.error(f"❌ Content generation failed: {e}")
            # Return fallback content
            return await self._generate_fallback_content(request)
    
    async def generate_campaign_suite(self, 
                                    vibe_profile: VibeProfile,
                                    target_market: TargetMarket,
                                    campaign_theme: str,
                                    content_types: List[ContentType]) -> Dict[str, GeneratedContent]:
        """Generate a complete campaign suite across multiple content types"""
        
        logger.info(f"🚀 Generating campaign suite: {campaign_theme}")
        
        campaign_content = {}
        base_messages = [
            f"Discover {vibe_profile.brand_name}'s innovative approach to {vibe_profile.industry}",
            f"Transform your experience with {vibe_profile.brand_name}",
            f"Join the {vibe_profile.brand_name} community of forward-thinkers"
        ]
        
        for content_type in content_types:
            request = ContentRequest(
                content_type=content_type,
                vibe_profile=vibe_profile,
                target_market=target_market,
                topic=campaign_theme,
                key_messages=base_messages,
                call_to_action=self._generate_cta_for_type(content_type, vibe_profile.brand_name),
                length_requirement=self._get_optimal_length(content_type),
                include_hashtags=True,
                include_emojis=content_type in [ContentType.SOCIAL_MEDIA_POST, ContentType.EMAIL_CAMPAIGN]
            )
            
            content = await self.generate_content(request)
            campaign_content[content_type.value] = content
            
            # Brief pause to avoid overwhelming the AI
            await asyncio.sleep(0.5)
        
        logger.info(f"✅ Campaign suite complete: {len(campaign_content)} pieces")
        return campaign_content
    
    async def optimize_for_platform(self, 
                                  content: GeneratedContent,
                                  platform: str) -> GeneratedContent:
        """Optimize existing content for a specific platform"""
        
        platform_specs = {
            "instagram": {"max_chars": 2200, "hashtag_limit": 30, "emoji_friendly": True},
            "twitter": {"max_chars": 280, "hashtag_limit": 2, "emoji_friendly": True},
            "linkedin": {"max_chars": 3000, "hashtag_limit": 5, "emoji_friendly": False},
            "facebook": {"max_chars": 63206, "hashtag_limit": 10, "emoji_friendly": True},
            "tiktok": {"max_chars": 150, "hashtag_limit": 5, "emoji_friendly": True}
        }
        
        specs = platform_specs.get(platform, platform_specs["instagram"])
        
        # Optimize content length
        if len(content.content) > specs["max_chars"]:
            content.content = content.content[:specs["max_chars"]-10] + "..."
        
        # Optimize hashtags
        content.hashtags = content.hashtags[:specs["hashtag_limit"]]
        
        # Adjust emoji usage
        if not specs["emoji_friendly"]:
            content.emojis_used = []
            # Remove emojis from content (basic implementation)
            content.content = ''.join(char for char in content.content if ord(char) < 0x1F600)
        
        logger.info(f"✅ Content optimized for {platform}")
        return content
    
    async def _build_content_context(self, request: ContentRequest) -> Dict[str, Any]:
        """Build comprehensive context for content generation"""
        
        market_context = self.market_insights.get(request.target_market, {})
        vibe_context = self.vibe_templates.get(request.vibe_profile.primary_vibe, {})
        
        context = {
            "brand_info": {
                "name": request.vibe_profile.brand_name,
                "industry": request.vibe_profile.industry,
                "values": request.vibe_profile.brand_values,
                "usp": request.vibe_profile.unique_selling_points
            },
            "market_context": market_context,
            "vibe_context": vibe_context,
            "content_specs": {
                "type": request.content_type.value,
                "length": request.length_requirement,
                "platform": request.platform_specific,
                "urgency": request.urgency_level
            },
            "requirements": {
                "topic": request.topic,
                "key_messages": request.key_messages,
                "cta": request.call_to_action,
                "include_hashtags": request.include_hashtags,
                "include_emojis": request.include_emojis
            }
        }
        
        return context
    
    async def _build_generation_prompt(self, request: ContentRequest, context: Dict[str, Any]) -> str:
        """Build the AI generation prompt"""
        
        prompt = f"""Create {request.content_type.value} content for {context['brand_info']['name']}, a {context['brand_info']['industry']} company.

BRAND PROFILE:
- Industry: {context['brand_info']['industry']}
- Target Market: {request.target_market.value.upper()}
- Primary Vibe: {request.vibe_profile.primary_vibe.value}
- Brand Values: {', '.join(context['brand_info']['values'])}
- Unique Selling Points: {', '.join(context['brand_info']['usp'])}

CONTENT REQUIREMENTS:
- Topic: {request.topic}
- Content Type: {request.content_type.value}
- Length: {request.length_requirement}
- Target Audience: {request.vibe_profile.target_audience}
- Tone: {context['vibe_context'].get('tone', 'engaging, authentic')}
- Key Messages to Include: {', '.join(request.key_messages)}
- Call to Action: {request.call_to_action}

MARKET CONTEXT:
- Cultural Context: {', '.join(context['market_context'].get('cultural_context', []))}
- Preferred Content Style: {', '.join(context['market_context'].get('content_preferences', []))}

FORMATTING REQUIREMENTS:
{"- Include relevant hashtags (3-8 hashtags)" if request.include_hashtags else "- No hashtags required"}
{"- Include appropriate emojis for engagement" if request.include_emojis else "- No emojis required"}
- Structure content with clear sections and flow
- Ensure content aligns with {request.vibe_profile.primary_vibe.value} vibe

AVOID:
- Generic corporate speak
- Overused marketing clichés  
- Cultural insensitivity
- {', '.join(request.vibe_profile.avoid_keywords)}

Generate compelling, authentic content that resonates with the target market and drives engagement:"""

        return prompt
    
    async def _parse_generated_content(self, 
                                     response: str, 
                                     request: ContentRequest) -> GeneratedContent:
        """Parse and structure the AI-generated content"""
        
        # Extract headline (first line or explicit headline)
        lines = response.strip().split('\n')
        headline = lines[0] if lines else request.topic
        
        # Extract main content (remove headline and formatting)
        content_lines = [line for line in lines[1:] if line.strip() and not line.startswith('#')]
        main_content = '\n'.join(content_lines).strip()
        
        # Extract hashtags
        hashtags = []
        if request.include_hashtags:
            hashtag_matches = [word for word in response.split() if word.startswith('#')]
            hashtags = hashtag_matches or self._generate_default_hashtags(request)
        
        # Extract emojis
        emojis_used = []
        if request.include_emojis:
            emojis_used = [char for char in response if ord(char) >= 0x1F600]
        
        # Calculate word count
        word_count = len(main_content.split())
        
        return GeneratedContent(
            content=main_content,
            headline=headline.replace('#', '').strip(),
            call_to_action=request.call_to_action,
            hashtags=hashtags,
            emojis_used=list(set(emojis_used)),
            content_type=request.content_type,
            vibe_style=request.vibe_profile.primary_vibe,
            target_market=request.target_market,
            word_count=word_count,
            estimated_engagement_score=0.0,  # Will be calculated
            brand_alignment_score=0.0,  # Will be calculated
            market_relevance_score=0.0,  # Will be calculated
            created_at=datetime.now()
        )
    
    def _generate_default_hashtags(self, request: ContentRequest) -> List[str]:
        """Generate default hashtags based on request"""
        
        base_tags = [
            f"#{request.vibe_profile.brand_name.replace(' ', '')}",
            f"#{request.vibe_profile.industry.replace(' ', '')}",
            f"#{request.target_market.value}Business"
        ]
        
        vibe_tags = {
            VibeStyle.INNOVATIVE: ["#Innovation", "#TechForward", "#FutureReady"],
            VibeStyle.PROFESSIONAL: ["#ExpertAdvice", "#BusinessSolutions", "#ProfessionalServices"],
            VibeStyle.COMMUNITY_FOCUSED: ["#Community", "#TogetherWeGrow", "#SharedSuccess"]
        }
        
        style_tags = vibe_tags.get(request.vibe_profile.primary_vibe, ["#Quality", "#Excellence"])
        
        return base_tags + style_tags[:3]
    
    async def _calculate_engagement_score(self, 
                                        content: GeneratedContent, 
                                        request: ContentRequest) -> float:
        """Calculate estimated engagement score (0-100)"""
        
        score = 50.0  # Base score
        
        # Content length optimization
        optimal_lengths = {
            ContentType.SOCIAL_MEDIA_POST: (50, 150),
            ContentType.EMAIL_CAMPAIGN: (200, 500),
            ContentType.BLOG_ARTICLE: (800, 2000)
        }
        
        optimal_range = optimal_lengths.get(request.content_type, (100, 300))
        if optimal_range[0] <= content.word_count <= optimal_range[1]:
            score += 10
        
        # Hashtag optimization
        if 3 <= len(content.hashtags) <= 8:
            score += 8
        
        # Emoji usage (if appropriate)
        if content.emojis_used and request.include_emojis:
            score += 5
        
        # Market alignment
        market_context = self.market_insights.get(request.target_market, {})
        if any(keyword in content.content.lower() 
               for keyword in market_context.get('cultural_context', [])):
            score += 12
        
        # Vibe alignment
        vibe_context = self.vibe_templates.get(request.vibe_profile.primary_vibe, {})
        tone_keywords = vibe_context.get('vocabulary', '').split(', ')
        if any(keyword.lower() in content.content.lower() for keyword in tone_keywords):
            score += 10
        
        # Call to action presence
        if content.call_to_action and len(content.call_to_action) > 5:
            score += 5
        
        return min(score, 100.0)
    
    async def _calculate_brand_alignment_score(self, 
                                             content: GeneratedContent, 
                                             request: ContentRequest) -> float:
        """Calculate brand alignment score (0-100)"""
        
        score = 60.0  # Base score
        
        # Brand name mention
        if request.vibe_profile.brand_name.lower() in content.content.lower():
            score += 10
        
        # Brand values alignment
        values_mentioned = sum(1 for value in request.vibe_profile.brand_values 
                             if value.lower() in content.content.lower())
        score += min(values_mentioned * 5, 20)
        
        # USP integration
        usp_mentioned = sum(1 for usp in request.vibe_profile.unique_selling_points 
                           if any(word in content.content.lower() for word in usp.lower().split()))
        score += min(usp_mentioned * 8, 15)
        
        # Avoid keywords check (penalty for using them)
        avoid_violations = sum(1 for keyword in request.vibe_profile.avoid_keywords 
                             if keyword.lower() in content.content.lower())
        score -= avoid_violations * 10
        
        return max(min(score, 100.0), 0.0)
    
    async def _calculate_market_relevance_score(self, 
                                              content: GeneratedContent, 
                                              request: ContentRequest) -> float:
        """Calculate market relevance score (0-100)"""
        
        score = 55.0  # Base score
        
        market_context = self.market_insights.get(request.target_market, {})
        
        # Cultural context alignment
        cultural_alignment = sum(1 for context in market_context.get('cultural_context', []) 
                               if context.lower() in content.content.lower())
        score += min(cultural_alignment * 8, 25)
        
        # Content preference alignment
        content_prefs = market_context.get('content_preferences', [])
        if 'visual' in content_prefs and content.emojis_used:
            score += 5
        if 'educational' in content_prefs and any(word in content.content.lower() 
                                                for word in ['learn', 'discover', 'understand', 'guide']):
            score += 8
        if 'aspirational' in content_prefs and any(word in content.content.lower() 
                                                 for word in ['achieve', 'success', 'transform', 'elevate']):
            score += 8
        
        # Platform optimization
        if request.platform_specific:
            platform_context = market_context.get('preferred_platforms', [])
            if request.platform_specific in platform_context:
                score += 7
        
        return min(score, 100.0)
    
    def _get_token_limit(self, length_requirement: str) -> int:
        """Get token limit based on length requirement"""
        limits = {
            "short": 200,
            "medium": 500,
            "long": 1000
        }
        return limits.get(length_requirement, 500)
    
    def _generate_cta_for_type(self, content_type: ContentType, brand_name: str) -> str:
        """Generate appropriate CTA for content type"""
        
        ctas = {
            ContentType.SOCIAL_MEDIA_POST: f"Follow {brand_name} for more insights!",
            ContentType.EMAIL_CAMPAIGN: f"Discover how {brand_name} can transform your business",
            ContentType.BLOG_ARTICLE: f"Learn more about {brand_name}'s innovative solutions",
            ContentType.AD_COPY: f"Get started with {brand_name} today",
            ContentType.LANDING_PAGE_COPY: f"Start your journey with {brand_name}",
            ContentType.PRODUCT_DESCRIPTION: f"Experience {brand_name} excellence"
        }
        
        return ctas.get(content_type, f"Connect with {brand_name} today")
    
    def _get_optimal_length(self, content_type: ContentType) -> str:
        """Get optimal length for content type"""
        
        lengths = {
            ContentType.SOCIAL_MEDIA_POST: "short",
            ContentType.EMAIL_CAMPAIGN: "medium",
            ContentType.BLOG_ARTICLE: "long",
            ContentType.AD_COPY: "short",
            ContentType.LANDING_PAGE_COPY: "medium",
            ContentType.PRODUCT_DESCRIPTION: "medium"
        }
        
        return lengths.get(content_type, "medium")
    
    async def _generate_fallback_content(self, request: ContentRequest) -> GeneratedContent:
        """Generate fallback content if AI generation fails"""
        
        fallback_content = f"""Discover the innovation of {request.vibe_profile.brand_name} in {request.vibe_profile.industry}.

Our commitment to excellence and {', '.join(request.vibe_profile.brand_values[:2])} drives everything we do.

{request.call_to_action}"""

        return GeneratedContent(
            content=fallback_content,
            headline=f"{request.vibe_profile.brand_name}: {request.topic}",
            call_to_action=request.call_to_action,
            hashtags=[f"#{request.vibe_profile.brand_name.replace(' ', '')}", f"#{request.vibe_profile.industry}"],
            emojis_used=[],
            content_type=request.content_type,
            vibe_style=request.vibe_profile.primary_vibe,
            target_market=request.target_market,
            word_count=len(fallback_content.split()),
            estimated_engagement_score=45.0,
            brand_alignment_score=70.0,
            market_relevance_score=50.0,
            created_at=datetime.now()
        )
    
    def get_capabilities(self) -> List[str]:
        """Return the capabilities of the Vibe Marketing Agent"""
        return [
            "vibe_based_content_generation",
            "multi_market_content_adaptation",
            "brand_personality_alignment",
            "platform_specific_optimization",
            "engagement_score_prediction",
            "campaign_suite_generation",
            "cultural_context_awareness",
            "tone_of_voice_consistency",
            "hashtag_optimization",
            "call_to_action_generation",
            "content_performance_analytics",
            "market_specific_insights",
            "brand_alignment_scoring",
            "content_type_versatility",
            "creative_brief_interpretation"
        ]
    
    def get_metadata(self) -> AgentMetadata:
        """Return agent metadata for registry"""
        return AgentMetadata(
            name="vibe_marketing",
            version="1.0.0",
            description="AI-powered vibe marketing content generation agent. Creates authentic, engaging marketing content that aligns with brand personality and resonates with target markets across UAE, India, and Canada.",
            capabilities=self.get_capabilities(),
            dependencies=[
                "asyncio",
                "pydantic>=2.0.0",
                "datetime"
            ],
            api_requirements=[
                "AI router with text generation capability",
                "Optional: Market research data access",
                "Optional: Brand guidelines database"
            ],
            business_domains=["marketing", "content", "branding", "social_media", "advertising", "universal"],
            github_repo="https://github.com/taurus-ai-corp/vibe-marketing-agent",
            author="Taurus AI Corp. Marketing Intelligence Team",
            status="active"
        )