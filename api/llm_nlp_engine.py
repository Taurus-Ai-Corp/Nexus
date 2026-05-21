# LLM-Powered NLP Command Interpreter
# Nexus Social Suite -- Replaces rule-based NLP with multi-model LLM understanding
# Default: Ollama qwen2.5-coder (falls back to OpenRouter if Ollama unavailable)

import json
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime

logger = logging.getLogger(__name__)

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

CAMPAIGN_GEN_PROMPT = """You are a senior marketing strategist and creative director at Nexus Social Suite.

Given a campaign brief, generate:
1. Ad Copy: 3 variations (headline, primary text, description) optimized for the platform
2. Visual Prompts: Detailed prompts for AI image/video generation
3. Targeting Strategy: Precise audience targeting parameters
4. Hashtag Strategy: 15-30 relevant hashtags (platform-specific)
5. Posting Schedule: Optimal times based on platform best practices
6. Budget Allocation: How to distribute budget across ad sets
7. A/B Test Plan: What to test and how

Always return valid JSON."""


class LLMNLPInterpreter:
    """LLM-powered NLP command interpreter with multi-model support.
    Default model is Ollama Cloud kimi-k2.6:cloud for admin/employee use."""
    
    def __init__(self, router, default_model: str = "kimi-k2.6:cloud"):
        self.router = router
        self.default_model = default_model
    
    async def interpret_command(
        self,
        command: str,
        model: Optional[str] = None,
        context: Optional[Dict] = None,
    ) -> Dict[str, Any]:
        """Interpret a natural language command into structured action"""
        preferred = model or self.default_model
        
        messages = [
            {"role": "system", "content": NLP_SYSTEM_PROMPT},
            {"role": "user", "content": f"Command: {command}\n\nContext: {json.dumps(context) if context else 'None'}"},
        ]
        
        # Try preferred model, then fallback chain
        models_to_try = [preferred]
        # Add Ollama Cloud fallbacks
        if preferred in ("kimi-k2.6:cloud", "gemma4", "nemotron-3-super", "llama3", "qwen2.5-coder", "llava"):
            cloud_fallbacks = ["kimi-k2.6:cloud", "gemma4", "nemotron-3-super"]
            for m in cloud_fallbacks:
                if m != preferred:
                    models_to_try.append(m)
            models_to_try.append("google/gemini-2.5-flash")  # OpenRouter fallback
        
        last_error = None
        for try_model in models_to_try:
            try:
                result = await self.router.generate_text(
                    model=try_model,
                    messages=messages,
                    temperature=0.1,
                    max_tokens=2048,
                )
                
                # Strip markdown code blocks
                raw = result["content"].strip()
                if raw.startswith("```"):
                    first_nl = raw.find("\n")
                    if first_nl != -1:
                        raw = raw[first_nl:]
                    if raw.rstrip().endswith("```"):
                        raw = raw.rstrip()[:-3].rstrip()
                
                parsed = json.loads(raw)
                parsed["_model_used"] = try_model
                parsed["_provider"] = result.get("provider", "unknown")
                return parsed
                
            except json.JSONDecodeError as e:
                last_error = f"JSON parse error: {e}"
                continue
            except Exception as e:
                last_error = f"{type(e).__name__}: {e}"
                continue
        
        logger.error(f"All models failed for NLP: {last_error}")
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
        )
        
        campaign = json.loads(result["content"])
        campaign["_model_used"] = model
        
        if include_visuals and campaign.get("content_brief", {}).get("visual_prompt"):
            try:
                images = await self.router.generate_image(
                    model="imagen-3",
                    prompt=campaign["content_brief"]["visual_prompt"],
                    size="1080x1080",
                    n=3,
                )
                campaign["generated_visuals"] = images
            except Exception as e:
                logger.warning(f"Visual generation failed: {e}")
                campaign["generated_visuals"] = []
        
        return campaign
    
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
