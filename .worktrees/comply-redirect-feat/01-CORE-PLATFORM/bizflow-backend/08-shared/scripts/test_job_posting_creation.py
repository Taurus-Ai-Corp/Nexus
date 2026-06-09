#!/usr/bin/env python3
"""
LinkedIn Job Posting Creation Test Script

This script tests creating a test job posting on LinkedIn
using the Jobs API. Creates a test co-op position.

Usage:
    python test_job_posting_creation.py [--dry-run]
"""

import os
import sys
import asyncio
import argparse
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, Any

# Add parent directories to path for imports
base_path = Path(__file__).parent.parent
sys.path.insert(0, str(base_path))
sys.path.insert(0, str(base_path.parent / "subdomains" / "bizflow.taurusai.io" / "agents" / "integrations"))

# Try to import LinkedIn tools and builders
try:
    from mcp_servers.linkedin.tools.jobs import create_job_posting
    from mcp_servers.linkedin.models.job_posting import JobPostingRequest, Location, EmploymentType, WorkLocationType
    from linkedin.coop_builder import CoOpPositionBuilder
    LINKEDIN_TOOLS_AVAILABLE = True
except ImportError as e:
    LINKEDIN_TOOLS_AVAILABLE = False
    print(f"Warning: Could not import LinkedIn tools: {e}")

# Color codes for terminal output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

def print_success(message: str):
    """Print success message in green."""
    print(f"{Colors.GREEN}✓{Colors.RESET} {message}")

def print_error(message: str):
    """Print error message in red."""
    print(f"{Colors.RED}✗{Colors.RESET} {message}")

def print_warning(message: str):
    """Print warning message in yellow."""
    print(f"{Colors.YELLOW}⚠{Colors.RESET} {message}")

def print_info(message: str):
    """Print info message in blue."""
    print(f"{Colors.BLUE}ℹ{Colors.RESET} {message}")

def create_test_job_data() -> Dict[str, Any]:
    """Create test job posting data."""
    return {
        "title": "Test Co-op Position - TAURUS AI",
        "description": """# Test Co-op Position - TAURUS AI

This is a **test job posting** created to validate LinkedIn Jobs API integration.

## About This Position

This is a temporary test posting created for API validation purposes. This position is not currently accepting applications.

## Duration & Dates
- **Duration:** 4 months (test)
- **Start Date:** Test date
- **End Date:** Test date

## Responsibilities
- Test API integration
- Validate job posting workflow
- Ensure proper formatting

## Requirements
- This is a test posting
- Not a real position

## Skills
- API Testing
- Integration Validation

**Note:** This is a test posting and will be removed after validation.""",
        "location": {
            "country": "ca",
            "city": "Toronto",
            "geographicArea": "Ontario"
        },
        "employmentType": "INTERNSHIP",
        "workLocationType": "HYBRID",
        "skills": ["API Testing", "Integration", "Python"],
        "functions": ["Software Engineering", "Testing"],
        "applicationEmail": "test@taurusai.io"
    }

async def test_job_creation_direct(dry_run: bool = False) -> Dict[str, Any]:
    """Test job creation using direct API calls."""
    results = {
        "success": False,
        "message": "",
        "details": {}
    }
    
    if dry_run:
        print_info("DRY RUN MODE - No actual API calls will be made")
        results["success"] = True
        results["message"] = "Dry run completed - job data validated"
        results["details"]["job_data"] = create_test_job_data()
        return results
    
    # Check if API is enabled
    api_enabled = os.getenv("LINKEDIN_JOBS_API_ENABLED", "false").lower() == "true"
    if not api_enabled:
        results["message"] = "LinkedIn Jobs API is not enabled"
        return results
    
    # Get credentials
    access_token = os.getenv("LINKEDIN_JOBS_API_TOKEN") or os.getenv("LINKEDIN_ACCESS_TOKEN")
    company_id = os.getenv("LINKEDIN_COMPANY_ID")
    
    if not access_token or not company_id:
        results["message"] = "Missing required credentials"
        return results
    
    # This would require full API implementation
    # For now, return a placeholder
    results["message"] = "Direct API implementation requires full Jobs API access"
    results["details"]["note"] = "Use the LinkedIn tools module for full functionality"
    
    return results

async def test_job_creation_with_tools(dry_run: bool = False) -> Dict[str, Any]:
    """Test job creation using LinkedIn tools."""
    results = {
        "success": False,
        "message": "",
        "details": {}
    }
    
    if not LINKEDIN_TOOLS_AVAILABLE:
        results["message"] = "LinkedIn tools not available"
        return results
    
    if dry_run:
        print_info("DRY RUN MODE - Validating job data structure")
        job_data = create_test_job_data()
        try:
            # Validate data structure
            job_request = JobPostingRequest(**job_data)
            results["success"] = True
            results["message"] = "Job data structure is valid"
            results["details"]["validated_data"] = job_request.dict()
        except Exception as e:
            results["message"] = f"Job data validation failed: {str(e)}"
            results["details"]["error"] = str(e)
        return results
    
    try:
        job_data = create_test_job_data()
        result = await create_job_posting(job_data)
        
        if "error" in result:
            results["message"] = f"Failed to create job posting: {result.get('error')}"
            results["details"]["error"] = result
        else:
            results["success"] = True
            results["message"] = "Successfully created test job posting"
            results["details"]["job_posting"] = result
            
    except Exception as e:
        results["message"] = f"Error creating job posting: {str(e)}"
        results["details"]["error"] = str(e)
    
    return results

async def test_coop_builder() -> Dict[str, Any]:
    """Test CoOpPositionBuilder."""
    results = {
        "success": False,
        "message": "",
        "details": {}
    }
    
    try:
        builder = CoOpPositionBuilder()
        
        # Test building a BizFlow co-op position
        coop_position = await builder.build_coop_position(
            "BizFlow",
            customizations={
                "title": "Test Co-op Position",
                "description": "This is a test posting for API validation"
            }
        )
        
        # Format for LinkedIn API
        linkedin_request = builder.format_for_linkedin_api(coop_position)
        
        results["success"] = True
        results["message"] = "CoOpPositionBuilder test successful"
        results["details"]["coop_position"] = coop_position.dict()
        results["details"]["linkedin_request"] = linkedin_request.dict()
        
    except Exception as e:
        results["message"] = f"CoOpPositionBuilder test failed: {str(e)}"
        results["details"]["error"] = str(e)
    
    return results

async def main():
    """Main test function."""
    parser = argparse.ArgumentParser(description="Test LinkedIn job posting creation")
    parser.add_argument("--dry-run", action="store_true", help="Validate data without making API calls")
    args = parser.parse_args()
    
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BLUE}LinkedIn Job Posting Creation Test{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}\n")
    
    # Load environment variables
    env_path = Path(__file__).parent.parent / "secrets" / ".env"
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip().strip('"').strip("'")
        print_info(f"Loaded environment from: {env_path}\n")
    
    # Test CoOpPositionBuilder
    print_info("Testing CoOpPositionBuilder...")
    builder_results = await test_coop_builder()
    if builder_results["success"]:
        print_success(builder_results["message"])
    else:
        print_error(builder_results["message"])
    
    print()
    
    # Test job creation
    if args.dry_run:
        print_info("Running in DRY RUN mode - no API calls will be made\n")
    
    if LINKEDIN_TOOLS_AVAILABLE:
        print_info("Testing job creation with LinkedIn tools...")
        results = await test_job_creation_with_tools(dry_run=args.dry_run)
    else:
        print_info("Testing job creation with direct API calls...")
        results = await test_job_creation_direct(dry_run=args.dry_run)
    
    # Print results
    if results["success"]:
        print_success(results["message"])
        if "job_posting" in results["details"]:
            job = results["details"]["job_posting"]
            if "id" in job:
                print_info(f"Job ID: {job['id']}")
            print_info("Job posting created successfully!")
        elif "validated_data" in results["details"]:
            print_info("Job data structure validated successfully")
    else:
        print_error(results["message"])
        if "error" in results["details"]:
            error = results["details"]["error"]
            print_error(f"Error details: {error}")
    
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    
    if args.dry_run:
        print_info("Dry run completed - no actual job posting was created")
        return 0
    
    return 0 if results["success"] else 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)

