#!/usr/bin/env python3
"""
LinkedIn Jobs API Connection Test Script

This script tests the basic connectivity to LinkedIn Jobs API
and validates authentication credentials.

Usage:
    python test_linkedin_api_connection.py
"""

import os
import sys
import asyncio
import aiohttp
from pathlib import Path
from typing import Dict, Any

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

# Try to import LinkedIn tools
try:
    sys.path.insert(0, str(Path(__file__).parent.parent.parent / "subdomains" / "bizflow.taurusai.io" / "agents" / "integrations" / "mcp-agents" / "external-mcps" / "klavis" / "mcp_servers" / "linkedin" / "tools"))
    from base import make_linkedin_jobs_request, get_linkedin_jobs_api_token, get_linkedin_company_id
    LINKEDIN_TOOLS_AVAILABLE = True
except ImportError as e:
    LINKEDIN_TOOLS_AVAILABLE = False
    print(f"Warning: Could not import LinkedIn tools: {e}")
    print("Testing will use direct API calls instead.")

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

async def test_api_connection_direct() -> Dict[str, Any]:
    """Test LinkedIn Jobs API connection using direct HTTP calls."""
    results = {
        "success": False,
        "message": "",
        "details": {}
    }
    
    # Check if API is enabled
    api_enabled = os.getenv("LINKEDIN_JOBS_API_ENABLED", "false").lower() == "true"
    if not api_enabled:
        results["message"] = "LinkedIn Jobs API is not enabled. Set LINKEDIN_JOBS_API_ENABLED=true"
        return results
    
    # Get required credentials
    access_token = os.getenv("LINKEDIN_JOBS_API_TOKEN") or os.getenv("LINKEDIN_ACCESS_TOKEN")
    company_id = os.getenv("LINKEDIN_COMPANY_ID")
    
    if not access_token:
        results["message"] = "LinkedIn access token not found. Set LINKEDIN_JOBS_API_TOKEN or LINKEDIN_ACCESS_TOKEN"
        return results
    
    if not company_id:
        results["message"] = "LinkedIn Company ID not found. Set LINKEDIN_COMPANY_ID"
        return results
    
    # Test API endpoint (try to list job postings)
    api_url = "https://api.linkedin.com/v2/jobPostings"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0"
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(api_url, headers=headers, params={"q": "search"}) as response:
                status_code = response.status
                results["details"]["status_code"] = status_code
                
                if status_code == 200:
                    data = await response.json()
                    results["success"] = True
                    results["message"] = "Successfully connected to LinkedIn Jobs API"
                    results["details"]["response"] = data
                elif status_code == 401:
                    results["message"] = "Authentication failed. Check your access token."
                    try:
                        error_data = await response.json()
                        results["details"]["error"] = error_data
                    except:
                        results["details"]["error"] = await response.text()
                elif status_code == 403:
                    results["message"] = "Access forbidden. API may not be enabled for your account or you may need partner approval."
                    try:
                        error_data = await response.json()
                        results["details"]["error"] = error_data
                    except:
                        results["details"]["error"] = await response.text()
                else:
                    results["message"] = f"Unexpected response: {status_code}"
                    try:
                        error_data = await response.json()
                        results["details"]["error"] = error_data
                    except:
                        results["details"]["error"] = await response.text()
                        
    except aiohttp.ClientError as e:
        results["message"] = f"Network error: {str(e)}"
        results["details"]["exception"] = str(e)
    except Exception as e:
        results["message"] = f"Unexpected error: {str(e)}"
        results["details"]["exception"] = str(e)
    
    return results

async def test_api_connection_with_tools() -> Dict[str, Any]:
    """Test LinkedIn Jobs API connection using imported tools."""
    results = {
        "success": False,
        "message": "",
        "details": {}
    }
    
    try:
        # Test getting company ID
        company_id = get_linkedin_company_id()
        results["details"]["company_id"] = company_id
        
        # Test getting token
        token = get_linkedin_jobs_api_token()
        results["details"]["token_available"] = bool(token)
        
        # Try to list job postings
        response = await make_linkedin_jobs_request("GET", "?q=search")
        
        results["success"] = True
        results["message"] = "Successfully connected using LinkedIn tools"
        results["details"]["response"] = response
        
    except RuntimeError as e:
        results["message"] = f"Configuration error: {str(e)}"
        results["details"]["error"] = str(e)
    except Exception as e:
        results["message"] = f"Error: {str(e)}"
        results["details"]["error"] = str(e)
    
    return results

async def main():
    """Main test function."""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BLUE}LinkedIn Jobs API Connection Test{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}\n")
    
    # Load environment variables from .env file if it exists
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
    
    # Check if API is enabled
    api_enabled = os.getenv("LINKEDIN_JOBS_API_ENABLED", "false").lower() == "true"
    if not api_enabled:
        print_warning("LinkedIn Jobs API is not enabled.")
        print_info("Set LINKEDIN_JOBS_API_ENABLED=true in your .env file after receiving API approval.")
        print()
        return 1
    
    print_info("Testing LinkedIn Jobs API connection...\n")
    
    # Try using tools first, fall back to direct API calls
    if LINKEDIN_TOOLS_AVAILABLE:
        print_info("Using LinkedIn tools for testing...")
        results = await test_api_connection_with_tools()
    else:
        print_info("Using direct API calls for testing...")
        results = await test_api_connection_direct()
    
    # Print results
    if results["success"]:
        print_success(results["message"])
        if "company_id" in results["details"]:
            print_info(f"Company ID: {results['details']['company_id']}")
        if "response" in results["details"]:
            response = results["details"]["response"]
            if isinstance(response, dict):
                if "elements" in response:
                    count = len(response["elements"])
                    print_info(f"Found {count} job posting(s)")
                else:
                    print_info("API response received successfully")
    else:
        print_error(results["message"])
        if "error" in results["details"]:
            error = results["details"]["error"]
            if isinstance(error, dict):
                print_error(f"Error details: {error}")
            else:
                print_error(f"Error: {error}")
        if "status_code" in results["details"]:
            status = results["details"]["status_code"]
            if status == 401:
                print_info("Check your access token and ensure it's valid")
            elif status == 403:
                print_info("You may need partner approval for Jobs API access")
                print_info("See: LINKEDIN_JOBS_API_ACCESS_REQUEST.md")
    
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    
    return 0 if results["success"] else 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)

