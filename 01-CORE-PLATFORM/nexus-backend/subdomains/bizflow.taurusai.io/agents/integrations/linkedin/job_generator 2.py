"""AI-powered job description generator using Vertex AI."""

import json
import logging
import os
from pathlib import Path
from typing import Dict, Any, Optional, List
import aiohttp

# Configure logging
logger = logging.getLogger(__name__)

# Template directory
TEMPLATE_DIR = Path(__file__).parent / "job_templates"


class JobDescriptionGenerator:
    """Generate engaging, compliant job descriptions using AI."""
    
    def __init__(self, vertex_ai_endpoint: Optional[str] = None):
        """
        Initialize the job description generator.
        
        Args:
            vertex_ai_endpoint: Optional Vertex AI endpoint URL
        """
        self.vertex_ai_endpoint = vertex_ai_endpoint or os.getenv(
            "VERTEX_AI_ENDPOINT",
            "https://us-central1-aiplatform.googleapis.com/v1"
        )
        self.vertex_ai_project = os.getenv("VERTEX_AI_PROJECT_ID")
        self.vertex_ai_location = os.getenv("VERTEX_AI_LOCATION", "us-central1")
        self.vertex_ai_model = os.getenv("VERTEX_AI_MODEL", "text-bison@001")
        
    async def generate_from_template(
        self,
        platform: str,
        template_name: Optional[str] = None,
        customizations: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Generate a job description from a template with AI enhancement.
        
        Args:
            platform: Platform name (BizFlow, NeoVibe, AssetGrid, OrionGrid)
            template_name: Optional template name (defaults to {platform}_coop_template.json)
            customizations: Optional customizations to apply
        
        Returns:
            Dictionary containing generated job description and metadata
        """
        logger.info(f"Generating job description for platform: {platform}")
        
        # Load template
        if not template_name:
            template_name = f"{platform.lower()}_coop_template.json"
        
        template_path = TEMPLATE_DIR / template_name
        if not template_path.exists():
            raise FileNotFoundError(f"Template not found: {template_path}")
        
        with open(template_path, 'r') as f:
            template = json.load(f)
        
        # Apply customizations if provided
        if customizations:
            template = self._apply_customizations(template, customizations)
        
        # Generate enhanced description using AI
        base_description = template["baseTemplate"]["description"]
        enhanced_description = await self._enhance_description(
            platform=platform,
            base_description=base_description,
            requirements=template["baseTemplate"].get("requirements", []),
            benefits=template["baseTemplate"].get("benefits", [])
        )
        
        # Build final job posting data
        job_data = {
            **template["baseTemplate"],
            "description": enhanced_description,
            "platform": platform,
            "platformName": template.get("platformName", platform)
        }
        
        return {
            "job_data": job_data,
            "template_used": template_name,
            "platform": platform,
            "enhanced": True
        }
    
    async def _enhance_description(
        self,
        platform: str,
        base_description: str,
        requirements: List[str],
        benefits: List[str]
    ) -> str:
        """
        Enhance job description using Vertex AI.
        
        Args:
            platform: Platform name
            base_description: Base job description
            requirements: List of requirements
            benefits: List of benefits
        
        Returns:
            Enhanced job description
        """
        # If Vertex AI is not configured, return base description with formatting
        if not self.vertex_ai_project:
            logger.warning("Vertex AI not configured, using base description with formatting")
            return self._format_description(base_description, requirements, benefits)
        
        try:
            # Prepare prompt for Vertex AI
            prompt = self._build_enhancement_prompt(
                platform, base_description, requirements, benefits
            )
            
            # Call Vertex AI (or fallback to formatting if unavailable)
            enhanced = await self._call_vertex_ai(prompt)
            
            if enhanced and len(enhanced) > 100:
                return enhanced
            else:
                logger.warning("Vertex AI returned short response, using formatted base description")
                return self._format_description(base_description, requirements, benefits)
                
        except Exception as e:
            logger.error(f"Error enhancing description with Vertex AI: {e}")
            return self._format_description(base_description, requirements, benefits)
    
    def _build_enhancement_prompt(
        self,
        platform: str,
        base_description: str,
        requirements: List[str],
        benefits: List[str]
    ) -> str:
        """Build prompt for Vertex AI enhancement."""
        return f"""You are a professional job description writer specializing in creating engaging, compliant job postings for LinkedIn.

Platform: {platform}
Base Description:
{base_description}

Requirements:
{chr(10).join(f"- {req}" for req in requirements)}

Benefits:
{chr(10).join(f"- {ben}" for ben in benefits)}

Task: Enhance this job description to be:
1. More engaging and compelling (while remaining professional)
2. Optimized for LinkedIn search with relevant keywords
3. Compliant with LinkedIn job posting guidelines
4. Clear about expectations and opportunities
5. Professional yet approachable tone

Return ONLY the enhanced job description text, maintaining the structure and key information but making it more compelling and search-optimized. Do not include any meta-commentary or explanations."""
    
    async def _call_vertex_ai(self, prompt: str) -> Optional[str]:
        """
        Call Vertex AI to generate enhanced description.
        
        Args:
            prompt: Prompt for AI generation
        
        Returns:
            Generated text or None if unavailable
        """
        # Check if Vertex AI is available
        if not self.vertex_ai_project:
            return None
        
        try:
            # Vertex AI API endpoint
            url = (
                f"{self.vertex_ai_endpoint}/projects/{self.vertex_ai_project}/"
                f"locations/{self.vertex_ai_location}/publishers/google/models/{self.vertex_ai_model}:predict"
            )
            
            headers = {
                "Authorization": f"Bearer {os.getenv('VERTEX_AI_ACCESS_TOKEN', '')}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "instances": [{"content": prompt}],
                "parameters": {
                    "temperature": 0.7,
                    "maxOutputTokens": 2048,
                    "topP": 0.95,
                    "topK": 40
                }
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=payload, headers=headers) as response:
                    if response.status == 200:
                        result = await response.json()
                        predictions = result.get("predictions", [])
                        if predictions:
                            return predictions[0].get("content", "")
                    else:
                        logger.error(f"Vertex AI API error: {response.status}")
                        return None
                        
        except Exception as e:
            logger.error(f"Error calling Vertex AI: {e}")
            return None
    
    def _format_description(
        self,
        base_description: str,
        requirements: List[str],
        benefits: List[str]
    ) -> str:
        """
        Format base description with requirements and benefits.
        
        Args:
            base_description: Base description text
            requirements: List of requirements
            benefits: List of benefits
        
        Returns:
            Formatted description
        """
        formatted = base_description
        
        # Ensure requirements section is well-formatted
        if requirements and "**Requirements:**" not in formatted:
            req_section = "\n\n**Requirements:**\n" + "\n".join(f"- {req}" for req in requirements)
            formatted += req_section
        
        # Ensure benefits section is well-formatted
        if benefits and "**Benefits:**" not in formatted:
            ben_section = "\n\n**Benefits:**\n" + "\n".join(f"- {ben}" for ben in benefits)
            formatted += ben_section
        
        return formatted
    
    def _apply_customizations(
        self,
        template: Dict[str, Any],
        customizations: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Apply customizations to template.
        
        Args:
            template: Template dictionary
            customizations: Customization dictionary
        
        Returns:
            Updated template
        """
        updated = template.copy()
        base_template = updated.get("baseTemplate", {}).copy()
        
        # Apply customizations to base template
        for key, value in customizations.items():
            if key in base_template:
                base_template[key] = value
            elif key == "title":
                base_template["title"] = value
            elif key == "description":
                base_template["description"] = value
            elif key == "duration":
                # Add to description if not already present
                if "duration" not in base_template:
                    base_template["duration"] = value
        
        updated["baseTemplate"] = base_template
        return updated
    
    def optimize_for_linkedin(self, description: str, keywords: Optional[List[str]] = None) -> str:
        """
        Optimize job description for LinkedIn search.
        
        Args:
            description: Job description text
            keywords: Optional list of keywords to emphasize
        
        Returns:
            Optimized description
        """
        optimized = description
        
        # Add keywords naturally if provided
        if keywords:
            # Check if keywords are already present
            missing_keywords = [kw for kw in keywords if kw.lower() not in description.lower()]
            
            if missing_keywords:
                # Add missing keywords in a natural way
                keyword_section = "\n\n**Keywords:** " + ", ".join(missing_keywords[:5])
                optimized += keyword_section
        
        # Ensure minimum length (LinkedIn requires 100+ characters)
        if len(optimized) < 100:
            optimized += "\n\nWe are looking for motivated individuals who are eager to learn and contribute to our innovative team."
        
        return optimized


async def generate_job_description(
    platform: str,
    template_name: Optional[str] = None,
    customizations: Optional[Dict[str, Any]] = None,
    use_ai: bool = True
) -> Dict[str, Any]:
    """
    Convenience function to generate a job description.
    
    Args:
        platform: Platform name
        template_name: Optional template name
        customizations: Optional customizations
        use_ai: Whether to use AI enhancement (default: True)
    
    Returns:
        Dictionary containing generated job data
    """
    generator = JobDescriptionGenerator()
    
    if use_ai:
        return await generator.generate_from_template(platform, template_name, customizations)
    else:
        # Load template without AI enhancement
        if not template_name:
            template_name = f"{platform.lower()}_coop_template.json"
        
        template_path = TEMPLATE_DIR / template_name
        if not template_path.exists():
            raise FileNotFoundError(f"Template not found: {template_path}")
        
        with open(template_path, 'r') as f:
            template = json.load(f)
        
        if customizations:
            generator = JobDescriptionGenerator()
            template = generator._apply_customizations(template, customizations)
        
        return {
            "job_data": template["baseTemplate"],
            "template_used": template_name,
            "platform": platform,
            "enhanced": False
        }

