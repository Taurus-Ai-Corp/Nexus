"""Infographic generator for LinkedIn job postings."""

import logging
import os
from pathlib import Path
from typing import Dict, Any, Optional, List
from datetime import datetime
import json

try:
    from PIL import Image, ImageDraw, ImageFont
    PILLOW_AVAILABLE = True
except ImportError:
    PILLOW_AVAILABLE = False

# Configure logging
logger = logging.getLogger(__name__)

# Template directory
TEMPLATE_DIR = Path(__file__).parent / "infographic_templates"


class InfographicGenerator:
    """Generate infographics for LinkedIn job postings."""
    
    def __init__(self, output_dir: Optional[Path] = None):
        """
        Initialize the infographic generator.
        
        Args:
            output_dir: Optional output directory for generated infographics
        """
        self.output_dir = output_dir or Path(__file__).parent / "generated_infographics"
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Brand colors (TAURUS AI CORP branding)
        self.brand_colors = {
            "primary": "#1E3A8A",  # Deep blue
            "secondary": "#3B82F6",  # Bright blue
            "accent": "#10B981",  # Green
            "text": "#1F2937",  # Dark gray
            "background": "#FFFFFF",  # White
            "light_bg": "#F9FAFB"  # Light gray
        }
    
    async def generate_job_infographic(
        self,
        job_data: Dict[str, Any],
        platform: Optional[str] = None,
        output_format: str = "png"
    ) -> Dict[str, Any]:
        """
        Generate an infographic for a job posting.
        
        Args:
            job_data: Job posting data dictionary
            platform: Optional platform name
            output_format: Output format (png, jpg, pdf)
        
        Returns:
            Dictionary containing infographic file path and metadata
        """
        logger.info(f"Generating job infographic for: {job_data.get('title', 'Unknown')}")
        
        if not PILLOW_AVAILABLE:
            logger.warning("Pillow not available, creating text-based infographic template")
            return await self._create_text_template(job_data, platform, output_format)
        
        try:
            # Create infographic image
            image = self._create_infographic_image(job_data, platform)
            
            # Save image
            filename = self._generate_filename(job_data, platform, output_format)
            filepath = self.output_dir / filename
            
            image.save(filepath, format=output_format.upper())
            
            logger.info(f"Infographic saved to: {filepath}")
            
            return {
                "success": True,
                "filepath": str(filepath),
                "filename": filename,
                "format": output_format,
                "platform": platform,
                "dimensions": image.size
            }
            
        except Exception as e:
            logger.error(f"Error generating infographic: {e}")
            return {
                "success": False,
                "error": str(e),
                "fallback": await self._create_text_template(job_data, platform, output_format)
            }
    
    def _create_infographic_image(
        self,
        job_data: Dict[str, Any],
        platform: Optional[str] = None
    ) -> 'Image.Image':
        """Create the infographic image using Pillow."""
        # Create base image (1200x1600 for LinkedIn optimal size)
        width, height = 1200, 1600
        image = Image.new('RGB', (width, height), self.brand_colors["background"])
        draw = ImageDraw.Draw(image)
        
        # Try to load fonts, fallback to default if not available
        try:
            title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 48)
            heading_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 32)
            body_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24)
        except:
            title_font = ImageFont.load_default()
            heading_font = ImageFont.load_default()
            body_font = ImageFont.load_default()
        
        y_position = 50
        
        # Header section with platform/branding
        header_height = 150
        draw.rectangle([(0, 0), (width, header_height)], fill=self.brand_colors["primary"])
        
        # Platform name
        platform_text = platform or "TAURUS AI CORP"
        draw.text(
            (width // 2, 40),
            platform_text,
            fill=self.brand_colors["background"],
            font=heading_font,
            anchor="mm"
        )
        
        # Job title
        title = job_data.get("title", "Co-op Position")
        y_position = header_height + 40
        draw.text(
            (width // 2, y_position),
            title,
            fill=self.brand_colors["text"],
            font=title_font,
            anchor="mm"
        )
        
        y_position += 80
        
        # Key details section
        details_y = y_position
        self._draw_details_section(
            draw, job_data, details_y, width, heading_font, body_font
        )
        
        # Skills section
        if "skills" in job_data and job_data["skills"]:
            skills_y = details_y + 300
            self._draw_skills_section(
                draw, job_data["skills"], skills_y, width, heading_font, body_font
            )
        
        # Benefits section
        if "benefits" in job_data and job_data["benefits"]:
            benefits_y = details_y + 600
            self._draw_benefits_section(
                draw, job_data["benefits"], benefits_y, width, heading_font, body_font
            )
        
        return image
    
    def _draw_details_section(
        self,
        draw: 'ImageDraw.Draw',
        job_data: Dict[str, Any],
        y_start: int,
        width: int,
        heading_font: 'ImageFont.FreeTypeFont',
        body_font: 'ImageFont.FreeTypeFont'
    ):
        """Draw job details section."""
        x_margin = 60
        y = y_start
        
        # Section header
        draw.text(
            (x_margin, y),
            "Position Details",
            fill=self.brand_colors["primary"],
            font=heading_font
        )
        y += 50
        
        # Location
        if "location" in job_data:
            location = job_data["location"]
            if isinstance(location, dict):
                loc_text = location.get("city", "") + ", " + location.get("country", "")
            else:
                loc_text = str(location)
            draw.text(
                (x_margin, y),
                f"📍 Location: {loc_text}",
                fill=self.brand_colors["text"],
                font=body_font
            )
            y += 40
        
        # Employment type
        if "employmentType" in job_data:
            emp_type = job_data["employmentType"].replace("_", " ").title()
            draw.text(
                (x_margin, y),
                f"💼 Type: {emp_type}",
                fill=self.brand_colors["text"],
                font=body_font
            )
            y += 40
        
        # Duration
        if "duration" in job_data:
            draw.text(
                (x_margin, y),
                f"⏱ Duration: {job_data['duration']}",
                fill=self.brand_colors["text"],
                font=body_font
            )
            y += 40
        
        # Work location type
        if "workLocationType" in job_data:
            work_loc = job_data["workLocationType"].replace("_", " ").title()
            draw.text(
                (x_margin, y),
                f"🏠 Work Style: {work_loc}",
                fill=self.brand_colors["text"],
                font=body_font
            )
    
    def _draw_skills_section(
        self,
        draw: 'ImageDraw.Draw',
        skills: List[str],
        y_start: int,
        width: int,
        heading_font: 'ImageFont.FreeTypeFont',
        body_font: 'ImageFont.FreeTypeFont'
    ):
        """Draw skills section."""
        x_margin = 60
        y = y_start
        
        # Section header
        draw.text(
            (x_margin, y),
            "Key Skills",
            fill=self.brand_colors["primary"],
            font=heading_font
        )
        y += 50
        
        # Draw skills as badges
        x = x_margin
        for i, skill in enumerate(skills[:8]):  # Limit to 8 skills
            if x + 200 > width - x_margin:
                x = x_margin
                y += 60
            
            # Draw skill badge
            draw.rectangle(
                [(x, y), (x + 180, y + 40)],
                fill=self.brand_colors["light_bg"],
                outline=self.brand_colors["secondary"]
            )
            draw.text(
                (x + 90, y + 20),
                skill[:20],  # Truncate long skills
                fill=self.brand_colors["text"],
                font=body_font,
                anchor="mm"
            )
            x += 200
    
    def _draw_benefits_section(
        self,
        draw: 'ImageDraw.Draw',
        benefits: List[str],
        y_start: int,
        width: int,
        heading_font: 'ImageFont.FreeTypeFont',
        body_font: 'ImageFont.FreeTypeFont'
    ):
        """Draw benefits section."""
        x_margin = 60
        y = y_start
        
        # Section header
        draw.text(
            (x_margin, y),
            "Benefits & Perks",
            fill=self.brand_colors["primary"],
            font=heading_font
        )
        y += 50
        
        # Draw benefits as bullet points
        for i, benefit in enumerate(benefits[:6]):  # Limit to 6 benefits
            draw.text(
                (x_margin + 30, y),
                f"✓ {benefit}",
                fill=self.brand_colors["text"],
                font=body_font
            )
            y += 45
    
    async def _create_text_template(
        self,
        job_data: Dict[str, Any],
        platform: Optional[str] = None,
        output_format: str = "txt"
    ) -> Dict[str, Any]:
        """Create a text-based template when image generation is unavailable."""
        filename = self._generate_filename(job_data, platform, output_format)
        filepath = self.output_dir / filename
        
        template_content = f"""
╔══════════════════════════════════════════════════════════════╗
║                    {platform or 'TAURUS AI CORP':^50}                    ║
╠══════════════════════════════════════════════════════════════╣
║  {job_data.get('title', 'Co-op Position'):^58}  ║
╠══════════════════════════════════════════════════════════════╣

📍 Location: {job_data.get('location', {}).get('city', '') if isinstance(job_data.get('location'), dict) else job_data.get('location', 'N/A')}
💼 Type: {job_data.get('employmentType', 'N/A')}
⏱ Duration: {job_data.get('duration', 'N/A')}
🏠 Work Style: {job_data.get('workLocationType', 'N/A')}

Key Skills:
{chr(10).join(f'  • {skill}' for skill in job_data.get('skills', [])[:10])}

Benefits:
{chr(10).join(f'  ✓ {benefit}' for benefit in job_data.get('benefits', [])[:8])}

╚══════════════════════════════════════════════════════════════╝
"""
        
        with open(filepath, 'w') as f:
            f.write(template_content)
        
        return {
            "success": True,
            "filepath": str(filepath),
            "filename": filename,
            "format": output_format,
            "platform": platform,
            "note": "Text template (image generation unavailable)"
        }
    
    def _generate_filename(
        self,
        job_data: Dict[str, Any],
        platform: Optional[str] = None,
        extension: str = "png"
    ) -> str:
        """Generate filename for infographic."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        platform_str = platform.lower() if platform else "taurus"
        title_slug = job_data.get("title", "job").lower().replace(" ", "_")[:30]
        return f"{platform_str}_coop_{title_slug}_{timestamp}.{extension}"


async def generate_job_infographic(
    job_data: Dict[str, Any],
    platform: Optional[str] = None,
    output_format: str = "png"
) -> Dict[str, Any]:
    """
    Convenience function to generate a job infographic.
    
    Args:
        job_data: Job posting data dictionary
        platform: Optional platform name
        output_format: Output format (png, jpg, txt)
    
    Returns:
        Dictionary containing infographic file path and metadata
    """
    generator = InfographicGenerator()
    return await generator.generate_job_infographic(job_data, platform, output_format)

