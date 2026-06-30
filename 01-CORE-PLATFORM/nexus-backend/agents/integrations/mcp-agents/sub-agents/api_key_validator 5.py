#!/usr/bin/env python3
"""
API Key Validator Agent
Master Orchestrator Sub-Agent for MCP API Keys Fix System

This agent validates all API keys by testing actual API calls
and provides detailed validation reports.
"""

import asyncio
import json
import time
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

import aiohttp


@dataclass
class ValidationResult:
    """Result of API key validation"""
    key_name: str
    status: str  # 'valid', 'invalid', 'error', 'timeout'
    response_time: float
    error_message: str | None = None
    test_data: dict | None = None

class APIKeyValidator:
    """Validates API keys by making actual API calls"""

    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.master_env_file = self.project_root / "TAURUS AI CORP" / "BizFlow-Orchestrator" / "agents" / "integrations" / "mcp-agents" / "master.env"
        self.validation_results: list[ValidationResult] = []
        self.session: aiohttp.ClientSession | None = None

        # API validation endpoints and methods
        self.validation_configs = {
            "PERPLEXITY_API_KEY": {
                "url": "https://api.perplexity.ai/chat/completions",
                "method": "POST",
                "headers": {"Authorization": "Bearer {key}"},
                "payload": {
                    "model": "sonar",
                    "messages": [{"role": "user", "content": "test"}],
                    "max_tokens": 5
                },
                "timeout": 30
            },
            "FIRECRAWL_API_KEY": {
                "url": "https://api.firecrawl.dev/v0/scrape",
                "method": "POST",
                "headers": {"Authorization": "Bearer {key}"},
                "payload": {
                    "url": "https://example.com",
                    "formats": ["markdown"]
                },
                "timeout": 30
            },
            "ANTHROPIC_API_KEY": {
                "url": "https://api.anthropic.com/v1/messages",
                "method": "POST",
                "headers": {
                    "x-api-key": "{key}",
                    "Content-Type": "application/json",
                    "anthropic-version": "2023-06-01"
                },
                "payload": {
                    "model": "claude-3-haiku-20240307",
                    "max_tokens": 10,
                    "messages": [{"role": "user", "content": "Hello"}]
                },
                "timeout": 30
            },
            "OPENAI_API_KEY": {
                "url": "https://api.openai.com/v1/chat/completions",
                "method": "POST",
                "headers": {"Authorization": "Bearer {key}"},
                "payload": {
                    "model": "gpt-3.5-turbo",
                    "messages": [{"role": "user", "content": "Hello"}],
                    "max_tokens": 10
                },
                "timeout": 30
            },
            "FIGMA_ACCESS_TOKEN": {
                "url": "https://api.figma.com/v1/me",
                "method": "GET",
                "headers": {"X-Figma-Token": "{key}"},
                "payload": None,
                "timeout": 15
            },
            "GITHUB_PERSONAL_ACCESS_TOKEN": {
                "url": "https://api.github.com/user",
                "method": "GET",
                "headers": {"Authorization": "Bearer {key}"},
                "payload": None,
                "timeout": 15
            }
        }

    async def validate_all_keys(self) -> list[ValidationResult]:
        """Validate all API keys found in environment files"""
        print("🔍 Starting API Key Validation Agent...")

        # Load environment variables
        env_vars = self._load_environment_variables()

        if not env_vars:
            print("❌ No environment variables found!")
            return []

        # Create HTTP session
        async with aiohttp.ClientSession() as session:
            self.session = session

            # Validate each key
            validation_tasks = []
            for key_name, key_value in env_vars.items():
                if key_name in self.validation_configs:
                    task = self._validate_key(key_name, key_value)
                    validation_tasks.append(task)

            # Run validations concurrently
            results = await asyncio.gather(*validation_tasks, return_exceptions=True)

            # Process results
            for result in results:
                if isinstance(result, ValidationResult):
                    self.validation_results.append(result)
                elif isinstance(result, Exception):
                    print(f"❌ Validation error: {result}")

        # Generate validation report
        self._generate_validation_report()

        return self.validation_results

    def _load_environment_variables(self) -> dict[str, str]:
        """Load environment variables from master .env file"""
        env_vars = {}

        if not self.master_env_file.exists():
            print(f"❌ Master .env file not found: {self.master_env_file}")
            return env_vars

        try:
            with open(self.master_env_file) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        key = key.strip()
                        value = value.strip()

                        # Skip placeholder values
                        if not self._is_placeholder_value(value):
                            env_vars[key] = value

            print(f"📋 Loaded {len(env_vars)} environment variables")

        except Exception as e:
            print(f"❌ Error loading environment file: {e}")

        return env_vars

    def _is_placeholder_value(self, value: str) -> bool:
        """Check if a value is a placeholder"""
        placeholder_patterns = [
            'your_',
            'sk-your-api-key-here',
            'xoxb-your-slack-bot-token-here',
            'xoxp-your-slack-user-token-here',
            'secret_your_',
            'figd_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'mm-your_actual_'
        ]

        return any(pattern in value for pattern in placeholder_patterns)

    async def _validate_key(self, key_name: str, key_value: str) -> ValidationResult:
        """Validate a specific API key"""
        print(f"🔍 Validating {key_name}...")

        if key_name not in self.validation_configs:
            return ValidationResult(
                key_name=key_name,
                status="error",
                response_time=0.0,
                error_message="No validation configuration found"
            )

        config = self.validation_configs[key_name]
        start_time = time.time()

        try:
            # Prepare request
            url = config["url"]
            method = config["method"]
            headers = {k: v.format(key=key_value) for k, v in config["headers"].items()}
            payload = config["payload"]
            timeout = aiohttp.ClientTimeout(total=config["timeout"])

            # Make API call
            async with self.session.request(
                method=method,
                url=url,
                headers=headers,
                json=payload,
                timeout=timeout
            ) as response:
                response_time = time.time() - start_time

                if response.status == 200:
                    response_data = await response.json()
                    return ValidationResult(
                        key_name=key_name,
                        status="valid",
                        response_time=response_time,
                        test_data=response_data
                    )
                else:
                    error_text = await response.text()
                    return ValidationResult(
                        key_name=key_name,
                        status="invalid",
                        response_time=response_time,
                        error_message=f"HTTP {response.status}: {error_text}"
                    )

        except asyncio.TimeoutError:
            response_time = time.time() - start_time
            return ValidationResult(
                key_name=key_name,
                status="timeout",
                response_time=response_time,
                error_message="Request timed out"
            )

        except Exception as e:
            response_time = time.time() - start_time
            return ValidationResult(
                key_name=key_name,
                status="error",
                response_time=response_time,
                error_message=str(e)
            )

    def _generate_validation_report(self):
        """Generate comprehensive validation report"""
        print("\n" + "="*80)
        print("🔍 API KEY VALIDATION REPORT")
        print("="*80)

        # Group results by status
        valid_keys = [r for r in self.validation_results if r.status == "valid"]
        invalid_keys = [r for r in self.validation_results if r.status == "invalid"]
        error_keys = [r for r in self.validation_results if r.status == "error"]
        timeout_keys = [r for r in self.validation_results if r.status == "timeout"]

        print("\n📊 SUMMARY:")
        print(f"   Total Keys Tested: {len(self.validation_results)}")
        print(f"   ✅ Valid: {len(valid_keys)}")
        print(f"   ❌ Invalid: {len(invalid_keys)}")
        print(f"   ⚠️  Errors: {len(error_keys)}")
        print(f"   ⏱️  Timeouts: {len(timeout_keys)}")

        # Valid keys
        if valid_keys:
            print("\n✅ VALID API KEYS:")
            for result in valid_keys:
                print(f"   ✅ {result.key_name} - {result.response_time:.2f}s")

        # Invalid keys
        if invalid_keys:
            print("\n❌ INVALID API KEYS:")
            for result in invalid_keys:
                print(f"   ❌ {result.key_name}")
                print(f"      Error: {result.error_message}")
                print(f"      Response Time: {result.response_time:.2f}s")

        # Error keys
        if error_keys:
            print("\n⚠️  ERROR API KEYS:")
            for result in error_keys:
                print(f"   ⚠️  {result.key_name}")
                print(f"      Error: {result.error_message}")
                print(f"      Response Time: {result.response_time:.2f}s")

        # Timeout keys
        if timeout_keys:
            print("\n⏱️  TIMEOUT API KEYS:")
            for result in timeout_keys:
                print(f"   ⏱️  {result.key_name}")
                print(f"      Error: {result.error_message}")
                print(f"      Response Time: {result.response_time:.2f}s")

        # Save detailed report
        self._save_validation_report()

    def _save_validation_report(self):
        """Save detailed validation report to file"""
        report_data = {
            "timestamp": datetime.now().isoformat(),
            "total_keys_tested": len(self.validation_results),
            "valid_keys": len([r for r in self.validation_results if r.status == "valid"]),
            "invalid_keys": len([r for r in self.validation_results if r.status == "invalid"]),
            "error_keys": len([r for r in self.validation_results if r.status == "error"]),
            "timeout_keys": len([r for r in self.validation_results if r.status == "timeout"]),
            "results": []
        }

        for result in self.validation_results:
            report_data["results"].append({
                "key_name": result.key_name,
                "status": result.status,
                "response_time": result.response_time,
                "error_message": result.error_message,
                "test_data": result.test_data
            })

        report_file = self.project_root / "TAURUS AI CORP" / "BizFlow-Orchestrator" / "agents" / "integrations" / "mcp-agents" / "api_key_validation_report.json"

        with open(report_file, 'w') as f:
            json.dump(report_data, f, indent=2)

        print(f"📄 Detailed report saved to: {report_file}")

    def validate_single_key(self, key_name: str, key_value: str) -> ValidationResult:
        """Validate a single API key (synchronous)"""
        if key_name not in self.validation_configs:
            return ValidationResult(
                key_name=key_name,
                status="error",
                response_time=0.0,
                error_message="No validation configuration found"
            )

        # Run async validation in sync context
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        try:
            return loop.run_until_complete(self._validate_key(key_name, key_value))
        finally:
            loop.close()

def main():
    """Main execution function"""
    project_root = "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects"

    validator = APIKeyValidator(project_root)

    # Run validation
    results = asyncio.run(validator.validate_all_keys())

    print(f"\n✅ Validation complete! Tested {len(results)} API keys.")

    # Summary
    valid_count = len([r for r in results if r.status == "valid"])
    total_count = len(results)

    if valid_count == total_count:
        print("🎉 All API keys are valid!")
    else:
        print(f"⚠️  {valid_count}/{total_count} API keys are valid. Check the report for details.")

    return results

if __name__ == "__main__":
    main()
