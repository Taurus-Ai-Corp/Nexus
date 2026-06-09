"""Co-op position builder for LinkedIn job postings."""

import json
import logging
from pathlib import Path
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta

from .job_generator import generate_job_description, JobDescriptionGenerator
from ...mcp-agents.external-mcps.klavis.mcp_servers.linkedin.models.job_posting import (
    CoOpJobPosting,
    Location,
    EmploymentType,
    WorkLocationType,
    JobPostingRequest
)

# Configure logging
logger = logging.getLogger(__name__)

# Template directory
TEMPLATE_DIR = Path(__file__).parent / "job_templates"


class CoOpPositionBuilder:
    """Build and customize co-op position job postings for LinkedIn."""
    
    def __init__(self):
        """Initialize the co-op position builder."""
        self.generator = JobDescriptionGenerator()
    
    async def build_from_template(
        self,
        platform: str,
        template_name: Optional[str] = None,
        customizations: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Build a co-op position from a template.
        
        Args:
            platform: Platform name (BizFlow, NeoVibe, AssetGrid, OrionGrid)
            template_name: Optional template name
            customizations: Optional customizations to apply
        
        Returns:
            Dictionary containing job posting data ready for LinkedIn API
        """
        logger.info(f"Building co-op position for platform: {platform}")
        
        # Generate job description
        result = await generate_job_description(platform, template_name, customizations)
        job_data = result["job_data"]
        
        # Build LinkedIn API format
        linkedin_format = await self.format_for_linkedin_api(job_data, platform)
        
        return {
            "platform": platform,
            "job_data": job_data,
            "linkedin_format": linkedin_format,
            "template_used": result.get("template_used"),
            "enhanced": result.get("enhanced", False)
        }
    
    async def customize_for_platform(
        self,
        platform: str,
        base_template: Dict[str, Any],
        overrides: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Customize a base template for a specific platform.
        
        Args:
            platform: Platform name
            base_template: Base template dictionary
            overrides: Optional overrides to apply
        
        Returns:
            Customized template
        """
        customized = base_template.copy()
        
        # Apply platform-specific customizations
        platform_customizations = self._get_platform_customizations(platform)
        customized.update(platform_customizations)
        
        # Apply user overrides
        if overrides:
            customized.update(overrides)
        
        return customized
    
    def validate_job_posting(self, job_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate job posting data against LinkedIn requirements.
        
        Args:
            job_data: Job posting data dictionary
        
        Returns:
            Dictionary with validation results
        """
        errors = []
        warnings = []
        
        # Required fields
        required_fields = ["title", "description", "location", "employmentType"]
        for field in required_fields:
            if field not in job_data or not job_data[field]:
                errors.append(f"Missing required field: {field}")
        
        # Description length (minimum 100 characters)
        if "description" in job_data:
            desc_len = len(job_data["description"])
            if desc_len < 100:
                errors.append(f"Description too short: {desc_len} characters (minimum 100)")
            elif desc_len > 5000:
                warnings.append(f"Description very long: {desc_len} characters (recommended < 2000)")
        
        # Title length (maximum 200 characters)
        if "title" in job_data:
            title_len = len(job_data["title"])
            if title_len > 200:
                errors.append(f"Title too long: {title_len} characters (maximum 200)")
        
        # Location validation
        if "location" in job_data:
            location = job_data["location"]
            if isinstance(location, dict):
                if "country" not in location:
                    errors.append("Location missing required 'country' field")
            else:
                errors.append("Location must be a dictionary")
        
        # Employment type validation
        if "employmentType" in job_data:
            valid_types = [e.value for e in EmploymentType]
            if job_data["employmentType"] not in valid_types:
                errors.append(
                    f"Invalid employmentType: {job_data['employmentType']}. "
                    f"Valid types: {', '.join(valid_types)}"
                )
        
        # Skills validation
        if "skills" in job_data and isinstance(job_data["skills"], list):
            if len(job_data["skills"]) > 50:
                warnings.append(f"Too many skills: {len(job_data['skills'])} (recommended < 20)")
        
        return {
            "valid": len(errors) == 0,
            "errors": errors,
            "warnings": warnings
        }
    
    async def format_for_linkedin_api(
        self,
        job_data: Dict[str, Any],
        platform: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Format job data for LinkedIn API submission.
        
        Args:
            job_data: Job posting data dictionary
            platform: Optional platform name
        
        Returns:
            Dictionary formatted for LinkedIn Jobs API
        """
        # Build location object
        location = job_data.get("location", {})
        if isinstance(location, str):
            # If location is a string, try to parse it
            location = {"country": location}
        elif not isinstance(location, dict):
            location = {"country": "US"}  # Default
        
        # Ensure location has required fields
        if "country" not in location:
            location["country"] = "US"
        
        # Format location for LinkedIn API
        linkedin_location = {
            "country": location.get("country", "US"),
        }
        if "city" in location:
            linkedin_location["city"] = location["city"]
        if "geographicArea" in location:
            linkedin_location["geographicArea"] = location["geographicArea"]
        if "postalCode" in location:
            linkedin_location["postalCode"] = location["postalCode"]
        
        # Build LinkedIn API payload
        linkedin_payload = {
            "title": job_data.get("title", ""),
            "description": job_data.get("description", ""),
            "location": linkedin_location,
            "employmentType": job_data.get("employmentType", EmploymentType.INTERNSHIP.value),
        }
        
        # Add optional fields
        if "workLocationType" in job_data:
            linkedin_payload["workLocationType"] = job_data["workLocationType"]
        
        if "skills" in job_data and job_data["skills"]:
            linkedin_payload["skills"] = job_data["skills"]
        
        if "functions" in job_data and job_data["functions"]:
            linkedin_payload["functions"] = job_data["functions"]
        
        if "industries" in job_data and job_data["industries"]:
            linkedin_payload["industries"] = job_data["industries"]
        
        if "applicationUrl" in job_data:
            linkedin_payload["applicationUrl"] = job_data["applicationUrl"]
        
        if "applicationEmail" in job_data:
            linkedin_payload["applicationEmail"] = job_data["applicationEmail"]
        
        # Add listing and expiration dates
        if "listedAt" in job_data:
            linkedin_payload["listedAt"] = job_data["listedAt"]
        else:
            # Default to now
            linkedin_payload["listedAt"] = int(datetime.now().timestamp() * 1000)
        
        if "expireAt" in job_data:
            linkedin_payload["expireAt"] = job_data["expireAt"]
        elif "duration" in job_data:
            # Calculate expiration based on duration
            duration_months = self._parse_duration(job_data["duration"])
            if duration_months:
                expire_date = datetime.now() + timedelta(days=duration_months * 30)
                linkedin_payload["expireAt"] = int(expire_date.timestamp() * 1000)
        else:
            # Default to 90 days from now
            expire_date = datetime.now() + timedelta(days=90)
            linkedin_payload["expireAt"] = int(expire_date.timestamp() * 1000)
        
        # Add external ID for tracking
        if platform:
            external_id = f"{platform.lower()}_coop_{int(datetime.now().timestamp())}"
            linkedin_payload["externalId"] = external_id
        
        return linkedin_payload
    
    def _get_platform_customizations(self, platform: str) -> Dict[str, Any]:
        """Get platform-specific customizations."""
        customizations = {
            "BizFlow": {
                "functions": ["Engineering", "Information Technology"],
                "industries": ["Technology, Information and Internet", "Software Development"]
            },
            "NeoVibe": {
                "functions": ["Marketing", "Design", "Creative"],
                "industries": ["Marketing and Advertising", "Creative Services"]
            },
            "AssetGrid": {
                "functions": ["Engineering", "Information Technology", "Finance"],
                "industries": ["Financial Services", "Technology, Information and Internet", "Cryptocurrency"]
            },
            "OrionGrid": {
                "functions": ["Engineering", "Finance", "Information Technology"],
                "industries": ["Financial Services", "Technology, Information and Internet", "Blockchain"]
            }
        }
        
        return customizations.get(platform, {})
    
    def _parse_duration(self, duration_str: str) -> Optional[int]:
        """Parse duration string to months."""
        duration_str = duration_str.lower().strip()
        
        # Try to extract number
        import re
        numbers = re.findall(r'\d+', duration_str)
        if not numbers:
            return None
        
        months = int(numbers[0])
        
        # Check for month indicators
        if 'month' in duration_str:
            return months
        elif 'week' in duration_str:
            return max(1, months // 4)  # Convert weeks to months (approximate)
        elif 'year' in duration_str:
            return months * 12
        
        # Default to months
        return months


async def build_coop_position(
    platform: str,
    customizations: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Convenience function to build a co-op position.
    
    Args:
        platform: Platform name
        customizations: Optional customizations
    
    Returns:
        Dictionary containing built job posting
    """
    builder = CoOpPositionBuilder()
    return await builder.build_from_template(platform, customizations=customizations)

