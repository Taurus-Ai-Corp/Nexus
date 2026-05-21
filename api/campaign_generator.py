# End-to-End Campaign Generation Pipeline
# Nexus Social Suite — From NLP command to deployed campaign

import json
import logging
from typing import Dict, Any, Optional, List
from datetime import datetime

from multi_model_router import MultiModelRouter
from llm_nlp_engine import LLMNLPInterpreter

logger = logging.getLogger(__name__)


class CampaignPipeline:
    """End-to-end campaign generation: NLP → Copy → Visuals → Targeting → Launch"""
    
    def __init__(self, router: MultiModelRouter, nlp: LLMNLPInterpreter):
        self.router = router
        self.nlp = nlp
    
    async def execute_pipeline(
        self,
        command: str,
        user_id: int,
        model: Optional[str] = None,
        generate_visuals: bool = True,
        auto_launch: bool = False,
    ) -> Dict[str, Any]:
        """Execute full campaign generation pipeline"""
        pipeline = {
            "command": command,
            "user_id": user_id,
            "status": "running",
            "stages": {},
            "created_at": datetime.utcnow().isoformat(),
        }
        
        try:
            # Stage 1: NLP Interpretation
            pipeline["stages"]["nlp"] = {"status": "running"}
            nlp_result = await self.nlp.interpret_command(command, model=model)
            pipeline["stages"]["nlp"] = {
                "status": "complete",
                "result": nlp_result,
            }
            
            if nlp_result.get("confidence", 0) < 0.5:
                pipeline["status"] = "needs_clarification"
                pipeline["clarification"] = nlp_result.get("clarification", "Please clarify your command")
                return pipeline
            
            # Stage 2: Campaign Generation
            pipeline["stages"]["campaign_gen"] = {"status": "running"}
            campaign_brief = {
                "command": command,
                "platform": nlp_result.get("campaign", {}).get("platform", "instagram"),
                "objective": nlp_result.get("campaign", {}).get("objective", "engagement"),
                "budget": nlp_result.get("campaign", {}).get("budget_daily", 25),
                "targeting": nlp_result.get("campaign", {}).get("targeting", {}),
                "content_brief": nlp_result.get("content_brief", {}),
            }
            
            campaign = await self.nlp.generate_campaign(
                brief=campaign_brief,
                model=model,
                include_visuals=generate_visuals,
            )
            pipeline["stages"]["campaign_gen"] = {
                "status": "complete",
                "result": campaign,
            }
            
            # Stage 3: Visual Generation (if not done in campaign gen)
            if generate_visuals and not campaign.get("generated_visuals"):
                pipeline["stages"]["visuals"] = {"status": "running"}
                visual_prompt = campaign.get("content_brief", {}).get("visual_prompt", "")
                if visual_prompt:
                    try:
                        images = await self.router.generate_image(
                            model="imagen-3",
                            prompt=visual_prompt,
                            size="1080x1080",
                            n=3,
                        )
                        campaign["generated_visuals"] = images
                        pipeline["stages"]["visuals"] = {
                            "status": "complete",
                            "image_count": len(images),
                        }
                    except Exception as e:
                        pipeline["stages"]["visuals"] = {
                            "status": "failed",
                            "error": str(e),
                        }
                else:
                    pipeline["stages"]["visuals"] = {"status": "skipped", "reason": "no visual prompt"}
            
            # Stage 4: Ready for review or auto-launch
            pipeline["campaign"] = campaign
            pipeline["status"] = "ready_for_review" if not auto_launch else "launching"
            
            if auto_launch:
                pipeline["stages"]["launch"] = {"status": "running"}
                # TODO: Implement actual Meta/Instagram API launch
                pipeline["stages"]["launch"] = {"status": "complete", "campaign_id": "pending_api_integration"}
                pipeline["status"] = "launched"
            
            return pipeline
            
        except Exception as e:
            logger.error(f"Campaign pipeline failed: {e}")
            pipeline["status"] = "failed"
            pipeline["error"] = str(e)
            return pipeline
    
    async def generate_copy_only(
        self,
        brief: Dict[str, Any],
        model: Optional[str] = None,
    ) -> List[Dict[str, str]]:
        """Generate only ad copy variations"""
        messages = [
            {"role": "system", "content": "You are a senior copywriter. Generate 3 ad copy variations optimized for the specified platform. Return JSON array of {headline, primary_text, description, cta}."},
            {"role": "user", "content": f"Brief: {json.dumps(brief)}"},
        ]
        
        result = await self.router.generate_text(
            model=model or "anthropic/claude-sonnet-4.6",
            messages=messages,
            temperature=0.8,
            max_tokens=2048,
        )
        
        try:
            return json.loads(result["content"])
        except json.JSONDecodeError:
            return [{"headline": brief.get("topic", "Ad"), "primary_text": result["content"], "description": "", "cta": "Learn More"}]
    
    async def generate_visual_only(
        self,
        prompt: str,
        model: str = "imagen-3",
        size: str = "1080x1080",
        n: int = 3,
    ) -> List[str]:
        """Generate only visuals"""
        return await self.router.generate_image(model=model, prompt=prompt, size=size, n=n)
