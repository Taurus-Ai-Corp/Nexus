# LLM-Powered NLP Command Interpreter
# Nexus Social Suite — Replaces rule-based NLP with multi-model LLM understanding

import json
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime

from multi_model_router import MultiModelRouter

logger = logging.getLogger(__name__)

# System prompt for campaign intent parsing
NLP_SYSTEM_PROMPT = """You are the Nexus NLP Command Interpreter. You parse natural language commands into structured campaign actions.

You MUST respond with ONLY valid JSON matching this schema:
{
  "intent": "<action_type>",
  "confidence": 0.0-1.0,
  "entities": { ... },
  "campaign": {
    "name": "...",
    "platform": "instagram|facebook|meta|tiktok|twitter|linkedin|multi",
    "objective": "awareness|engagement|conversions|leads|sales",
    "budget_daily": number,
    "budget_total": number,
    "targeting": {
      "audience": "...",
      "age_range": "18-24|25-34|35-44|45-54|55+",
      "location": "...",
      "interests": ["...", "..."]
    },
    "ad_format": "feed|story|reel|carousel|video|collection",
    "schedule": {
      "start_date": "YYYY-MM-DD",
      "end_date": "YYYY-MM-DD",
      "optimal_times": ["HH:MM", "..."]
    }
  },
  "content_brief": {
    "copy": "...",
    "hashtags": ["#...", "#..."],
    "visual_prompt": "detailed prompt for image/video generation",
    "tone": "luxury|casual|professional|playful|urgent",
    "cta": "..."
  },
  "next_steps": ["generate_copy", "generate_visual", "set_targeting", "launch_campaign"]
}

Intent types:
- create_campaign: Create a new ad campaign
- generate_copy: Generate ad copy for existing campaign
- generate_visual: Generate image/video for campaign
- analyze_performance: Analyze campaign metrics
- optimize_campaign: Suggest optimizations
- pause_campaign: Pause a campaign
- resume_campaign: Resume a paused campaign
- delete_campaign: Delete a campaign
- list_campaigns: List all campaigns
- get_insights: Get platform insights

If the command is unclear, set confidence < 0.5 and ask for clarification in a "clarification" field.
"""

# Campaign generation system prompt
CAMPAIGN_GEN_PROMPT = """You are a senior marketing strategist and creative director at Nexus Social Suite.

Given a campaign brief, generate:
1. **Ad Copy**: 3 variations (headline, primary text, description) optimized for the platform
2. **Visual Prompts**: Detailed prompts for AI image/video generation
3. **Targeting Strategy**: Precise audience targeting parameters
4. **Hashtag Strategy**: 15-30 relevant hashtags (platform-specific)
5. **Posting Schedule**: Optimal times based on platform best practices
6. **Budget Allocation**: How to distribute budget across ad sets
7. **A/B Test Plan**: What to test and how

Platform-specific optimizations:
- Instagram: Visual-first, Stories/Reels focus, hashtag strategy
- Facebook: Detailed targeting, carousel ads, lead forms
- Meta (combined): Cross-platform optimization, Advantage+ campaigns
- TikTok: Trending sounds, UGC-style, hook in first 3 seconds
- Twitter/X: Concise, thread-friendly, trending topics
- LinkedIn: Professional tone, B2B focus, thought leadership

Always return valid JSON matching the campaign schema."""


class LLMNLPInterpreter:
    """LLM-powered NLP command interpreter with multi-model support"""
    
    def __init__(self, router: MultiModelRouter, default_model: str = "anthropic/claude-sonnet-4.6"):
        self.router = router
        self.default_model = default_model
    
    async def interpret_command(
        self,
        command: str,
        model: Optional[str] = None,
        context: Optional[Dict] = None,
    ) -> Dict[str, Any]:
        """Interpret a natural language command into structured action"""
        model = model or self.default_model
        
        messages = [
            {"role": "system", "content": NLP_SYSTEM_PROMPT},
            {"role": "user", "content": f"Command: {command}\n\nContext: {json.dumps(context) if context else 'None'}"},
        ]
        
        try:
            result = await self.router.generate_text(
                model=model,
                messages=messages,
                temperature=0.1,
                max_tokens=2048,
            )
            
            parsed = json.loads(result["content"])
            parsed["_model_used"] = model
            parsed["_provider"] = result.get("provider", "unknown")
            parsed["_processing_time_ms"] = result.get("usage", {}).get("total_tokens", 0)
            
            return parsed
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse NLP response: {e}")
            logger.error(f"Raw response: {result.get('content', '')[:500]}")
            return self._fallback_parse(command)
        except Exception as e:
            logger.error(f"NLP interpretation failed: {type(e).__name__}: {e}")
            return self._fallback_parse(command)
    
    async def generate_campaign(
        self,
        brief: Dict[str, Any],
        model: Optional[str] = None,
        include_visuals: bool = True,
    ) -> Dict[str, Any]:
        """Generate complete campaign from brief"""
        model = model or self.default_model
        
        messages = [
            {"role": "system", "content": CAMPAIGN_GEN_PROMPT},
            {"role": "user", "content": f"Generate a complete campaign for:\n{json.dumps(brief, indent=2)}"},
        ]
        
        result = await self.router.generate_text(
            model=model,
            messages=messages,
            temperature=0.7,
            max_tokens=4096,
            json_schema=self._get_campaign_schema(),
        )
        
        campaign = json.loads(result["content"])
        campaign["_model_used"] = model
        
        # Generate visuals if requested
        if include_visuals and campaign.get("content_brief", {}).get("visual_prompt"):
            try:
                visual_model = "imagen-3"  # Default to Imagen
                images = await self.router.generate_image(
                    model=visual_model,
                    prompt=campaign["content_brief"]["visual_prompt"],
                    size="1080x1080",
                    n=3,
                )
                campaign["generated_visuals"] = images
            except Exception as e:
                logger.warning(f"Visual generation failed: {e}")
                campaign["generated_visuals"] = []
        
        return campaign
    
    def _get_nlp_schema(self) -> Dict:
        return {
            "type": "object",
            "properties": {
                "intent": {"type": "string"},
                "confidence": {"type": "number"},
                "entities": {"type": "object"},
                "campaign": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "platform": {"type": "string"},
                        "objective": {"type": "string"},
                        "budget_daily": {"type": "number"},
                        "budget_total": {"type": "number"},
                        "targeting": {"type": "object"},
                        "ad_format": {"type": "string"},
                        "schedule": {"type": "object"},
                    },
                },
                "content_brief": {
                    "type": "object",
                    "properties": {
                        "copy": {"type": "string"},
                        "hashtags": {"type": "array", "items": {"type": "string"}},
                        "visual_prompt": {"type": "string"},
                        "tone": {"type": "string"},
                        "cta": {"type": "string"},
                    },
                },
                "next_steps": {"type": "array", "items": {"type": "string"}},
            },
            "required": ["intent", "confidence"],
        }
    
    def _get_campaign_schema(self) -> Dict:
        return {
            "type": "object",
            "properties": {
                "campaign_name": {"type": "string"},
                "platform": {"type": "string"},
                "ad_copy_variations": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "headline": {"type": "string"},
                            "primary_text": {"type": "string"},
                            "description": {"type": "string"},
                        },
                    },
                },
                "visual_prompts": {
                    "type": "array",
                    "items": {"type": "string"},
                },
                "targeting": {
                    "type": "object",
                    "properties": {
                        "audience": {"type": "string"},
                        "age_range": {"type": "string"},
                        "location": {"type": "string"},
                        "interests": {"type": "array", "items": {"type": "string"}},
                    },
                },
                "hashtags": {"type": "array", "items": {"type": "string"}},
                "schedule": {"type": "object"},
                "budget_allocation": {"type": "object"},
                "ab_test_plan": {"type": "object"},
            },
            "required": ["campaign_name", "platform", "ad_copy_variations"],
        }
    
    def _fallback_parse(self, command: str) -> Dict[str, Any]:
        """Fallback rule-based parsing when LLM fails"""
        text = command.lower()
        
        if any(w in text for w in ["create", "make", "build", "start"]):
            platform = "instagram" if "instagram" in text or "ig" in text else "meta"
            return {
                "intent": "create_campaign",
                "confidence": 0.6,
                "entities": {"platform": platform, "text": command},
                "campaign": {
                    "name": f"Auto-generated: {command[:50]}",
                    "platform": platform,
                    "budget_daily": 25,
                },
                "content_brief": {
                    "copy": command,
                    "visual_prompt": f"Advertisement for: {command}",
                    "tone": "professional",
                    "cta": "Learn More",
                },
                "next_steps": ["generate_copy", "generate_visual", "launch_campaign"],
                "_model_used": "fallback_rule_based",
                "_provider": "local",
            }
        
        return {
            "intent": "unknown",
            "confidence": 0.2,
            "entities": {"text": command},
            "clarification": "I didn't understand that command. Try: 'Create an Instagram ad campaign for a luxury spa'",
            "_model_used": "fallback_rule_based",
            "_provider": "local",
        }
