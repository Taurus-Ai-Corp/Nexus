#!/usr/bin/env python3
"""
Environment Validation Script for LinkedIn Jobs API

This script validates that all required environment variables are set
and checks their format before attempting API calls.

Usage:
    python validate_environment.py
"""

import os
import sys
from pathlib import Path
from typing import Dict, List, Tuple

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

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

def load_env_file(env_path: Path) -> Dict[str, str]:
    """Load environment variables from .env file."""
    env_vars = {}
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                # Skip comments and empty lines
                if not line or line.startswith('#'):
                    continue
                # Parse KEY=VALUE format
                if '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key.strip()] = value.strip().strip('"').strip("'")
    return env_vars

def validate_linkedin_jobs_api_enabled() -> Tuple[bool, str]:
    """Check if LinkedIn Jobs API is enabled."""
    enabled = os.getenv("LINKEDIN_JOBS_API_ENABLED", "false").lower()
    if enabled == "true":
        return True, "LinkedIn Jobs API is enabled"
    return False, "LinkedIn Jobs API is disabled (set LINKEDIN_JOBS_API_ENABLED=true after approval)"

def validate_required_vars() -> List[Tuple[str, bool, str]]:
    """Validate all required environment variables."""
    results = []
    
    # Required variables
    required_vars = {
        "LINKEDIN_JOBS_API_TOKEN": {
            "required": True,
            "description": "LinkedIn Jobs API access token",
            "check_empty": True
        },
        "LINKEDIN_COMPANY_ID": {
            "required": True,
            "description": "LinkedIn Company ID (TAURUS AI CORP)",
            "check_empty": True,
            "validate_format": lambda v: v.isdigit() or v.startswith("urn:li:organization:")
        },
        "LINKEDIN_ACCESS_TOKEN": {
            "required": True,
            "description": "LinkedIn OAuth access token",
            "check_empty": True
        },
        "LINKEDIN_CLIENT_ID": {
            "required": True,
            "description": "LinkedIn OAuth Client ID",
            "check_empty": True
        },
        "LINKEDIN_CLIENT_SECRET": {
            "required": True,
            "description": "LinkedIn OAuth Client Secret",
            "check_empty": True
        },
        "LINKEDIN_PERSON_ID": {
            "required": True,
            "description": "LinkedIn Person ID (job poster)",
            "check_empty": True
        }
    }
    
    # Optional variables
    optional_vars = {
        "VERTEX_AI_PROJECT_ID": {
            "required": False,
            "description": "Vertex AI Project ID (optional, for AI descriptions)",
            "check_empty": False
        },
        "VERTEX_AI_LOCATION": {
            "required": False,
            "description": "Vertex AI Location",
            "check_empty": False,
            "default": "us-central1"
        }
    }
    
    # Check required variables
    for var_name, config in required_vars.items():
        value = os.getenv(var_name, "")
        is_set = bool(value)
        is_valid = True
        message = ""
        
        if not is_set:
            is_valid = False
            message = f"{var_name} is not set - {config['description']}"
        elif config.get("check_empty") and value == "":
            is_valid = False
            message = f"{var_name} is empty - {config['description']}"
        elif "validate_format" in config:
            if not config["validate_format"](value):
                is_valid = False
                message = f"{var_name} has invalid format - {config['description']}"
        else:
            message = f"{var_name} is set"
        
        results.append((var_name, is_valid, message))
    
    # Check optional variables
    for var_name, config in optional_vars.items():
        value = os.getenv(var_name, config.get("default", ""))
        is_set = bool(value)
        if is_set:
            results.append((var_name, True, f"{var_name} is set (optional)"))
        else:
            results.append((var_name, True, f"{var_name} is not set (optional)"))
    
    return results

def main():
    """Main validation function."""
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BLUE}LinkedIn Jobs API Environment Validation{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}\n")
    
    # Check if .env file exists
    env_path = Path(__file__).parent.parent / "secrets" / ".env"
    env_template_path = Path(__file__).parent.parent / "secrets" / ".env.linkedin-jobs-template"
    
    if not env_path.exists():
        print_warning(f".env file not found at: {env_path}")
        print_info(f"Template available at: {env_template_path}")
        print_info("Copy the template and fill in your values:")
        print(f"  cp {env_template_path} {env_path}\n")
    
    # Load environment variables from .env file if it exists
    if env_path.exists():
        env_vars = load_env_file(env_path)
        for key, value in env_vars.items():
            # Only set if not already in environment (don't override)
            if key not in os.environ:
                os.environ[key] = value
        print_success(f"Loaded environment variables from: {env_path}\n")
    
    # Check if Jobs API is enabled
    is_enabled, enabled_message = validate_linkedin_jobs_api_enabled()
    if is_enabled:
        print_success(enabled_message)
    else:
        print_warning(enabled_message)
    
    print()
    
    # Validate all required variables
    validation_results = validate_required_vars()
    
    required_passed = True
    optional_count = 0
    
    print(f"{Colors.BLUE}Required Variables:{Colors.RESET}")
    for var_name, is_valid, message in validation_results:
        if "optional" not in message.lower():
            if is_valid:
                print_success(message)
            else:
                print_error(message)
                required_passed = False
        else:
            optional_count += 1
    
    if optional_count > 0:
        print(f"\n{Colors.BLUE}Optional Variables:{Colors.RESET}")
        for var_name, is_valid, message in validation_results:
            if "optional" in message.lower():
                if is_valid:
                    print_info(message)
    
    # Summary
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    if required_passed and is_enabled:
        print_success("All required environment variables are configured!")
        print_success("Environment is ready for LinkedIn Jobs API usage.")
        return 0
    elif required_passed and not is_enabled:
        print_warning("Environment variables are configured, but Jobs API is disabled.")
        print_info("Set LINKEDIN_JOBS_API_ENABLED=true after receiving API approval.")
        return 0
    else:
        print_error("Some required environment variables are missing or invalid.")
        print_info("Please configure all required variables before using the API.")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)

