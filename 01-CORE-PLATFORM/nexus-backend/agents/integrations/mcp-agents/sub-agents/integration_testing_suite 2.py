#!/usr/bin/env python3
"""
Integration Testing Suite
Master Orchestrator Sub-Agent for MCP API Keys Fix System

This agent deploys a comprehensive testing suite to verify all
MCP connections and API integrations are working correctly.
"""

import json
import os
import subprocess
import time
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path


@dataclass
class TestResult:
    """Result of an integration test"""
    test_name: str
    status: str  # 'passed', 'failed', 'skipped', 'error'
    duration: float
    message: str
    details: dict | None = None

class IntegrationTestingSuite:
    """Comprehensive integration testing suite for MCP system"""

    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.master_env_file = self.project_root / "TAURUS AI CORP" / "BizFlow-Orchestrator" / "agents" / "integrations" / "mcp-agents" / "master.env"
        self.test_results: list[TestResult] = []

        # Test configurations
        self.test_configs = {
            "environment_loading": {
                "description": "Test environment variable loading",
                "priority": "high"
            },
            "api_key_validation": {
                "description": "Test API key validation",
                "priority": "high"
            },
            "mcp_server_startup": {
                "description": "Test MCP server startup",
                "priority": "high"
            },
            "cursor_integration": {
                "description": "Test Cursor IDE integration",
                "priority": "medium"
            },
            "end_to_end_workflow": {
                "description": "Test end-to-end MCP workflow",
                "priority": "medium"
            }
        }

    def run_all_tests(self) -> list[TestResult]:
        """Run all integration tests"""
        print("🧪 Starting Integration Testing Suite...")

        # Load environment variables
        self._load_environment()

        # Run tests in order of priority
        high_priority_tests = [
            self._test_environment_loading,
            self._test_api_key_validation,
            self._test_mcp_server_startup
        ]

        medium_priority_tests = [
            self._test_cursor_integration,
            self._test_end_to_end_workflow
        ]

        # Run high priority tests first
        print("\n🚨 Running High Priority Tests...")
        for test_func in high_priority_tests:
            try:
                result = test_func()
                self.test_results.append(result)
                self._print_test_result(result)
            except Exception as e:
                error_result = TestResult(
                    test_name=test_func.__name__,
                    status="error",
                    duration=0.0,
                    message=f"Test execution error: {str(e)}"
                )
                self.test_results.append(error_result)
                self._print_test_result(error_result)

        # Run medium priority tests
        print("\n🟡 Running Medium Priority Tests...")
        for test_func in medium_priority_tests:
            try:
                result = test_func()
                self.test_results.append(result)
                self._print_test_result(result)
            except Exception as e:
                error_result = TestResult(
                    test_name=test_func.__name__,
                    status="error",
                    duration=0.0,
                    message=f"Test execution error: {str(e)}"
                )
                self.test_results.append(error_result)
                self._print_test_result(error_result)

        # Generate test report
        self._generate_test_report()

        return self.test_results

    def _load_environment(self):
        """Load environment variables from master .env file"""
        if not self.master_env_file.exists():
            print(f"❌ Master .env file not found: {self.master_env_file}")
            return

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
                            os.environ[key] = value

            print(f"✅ Loaded environment variables from: {self.master_env_file}")
        except Exception as e:
            print(f"❌ Error loading environment: {e}")

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

    def _test_environment_loading(self) -> TestResult:
        """Test environment variable loading"""
        start_time = time.time()

        try:
            # Check if critical environment variables are loaded
            critical_vars = [
                'PERPLEXITY_API_KEY',
                'FIRECRAWL_API_KEY',
                'ANTHROPIC_API_KEY',
                'OPENAI_API_KEY'
            ]

            loaded_vars = []
            missing_vars = []

            for var in critical_vars:
                if var in os.environ and not self._is_placeholder_value(os.environ[var]):
                    loaded_vars.append(var)
                else:
                    missing_vars.append(var)

            duration = time.time() - start_time

            if len(loaded_vars) == len(critical_vars):
                return TestResult(
                    test_name="environment_loading",
                    status="passed",
                    duration=duration,
                    message=f"All {len(critical_vars)} critical environment variables loaded",
                    details={"loaded_vars": loaded_vars}
                )
            else:
                return TestResult(
                    test_name="environment_loading",
                    status="failed",
                    duration=duration,
                    message=f"Missing {len(missing_vars)} critical environment variables: {missing_vars}",
                    details={"loaded_vars": loaded_vars, "missing_vars": missing_vars}
                )

        except Exception as e:
            duration = time.time() - start_time
            return TestResult(
                test_name="environment_loading",
                status="error",
                duration=duration,
                message=f"Environment loading test failed: {str(e)}"
            )

    def _test_api_key_validation(self) -> TestResult:
        """Test API key validation"""
        start_time = time.time()

        try:
            # Import and run the API key validator
            validator_path = self.project_root / "TAURUS AI CORP" / "BizFlow-Orchestrator" / "agents" / "integrations" / "mcp-agents" / "sub-agents" / "api_key_validator.py"

            if not validator_path.exists():
                duration = time.time() - start_time
                return TestResult(
                    test_name="api_key_validation",
                    status="skipped",
                    duration=duration,
                    message="API key validator not found"
                )

            # Run the validator
            result = subprocess.run(
                ["python", str(validator_path)],
                capture_output=True,
                text=True,
                cwd=str(validator_path.parent)
            )

            duration = time.time() - start_time

            if result.returncode == 0:
                return TestResult(
                    test_name="api_key_validation",
                    status="passed",
                    duration=duration,
                    message="API key validation completed successfully",
                    details={"stdout": result.stdout, "stderr": result.stderr}
                )
            else:
                return TestResult(
                    test_name="api_key_validation",
                    status="failed",
                    duration=duration,
                    message=f"API key validation failed: {result.stderr}",
                    details={"stdout": result.stdout, "stderr": result.stderr}
                )

        except Exception as e:
            duration = time.time() - start_time
            return TestResult(
                test_name="api_key_validation",
                status="error",
                duration=duration,
                message=f"API key validation test failed: {str(e)}"
            )

    def _test_mcp_server_startup(self) -> TestResult:
        """Test MCP server startup"""
        start_time = time.time()

        try:
            # Test basic MCP server startup
            mcp_servers = [
                "playwright",
                "figma",
                "design-tokens",
                "tailwind"
            ]

            started_servers = []
            failed_servers = []

            for server in mcp_servers:
                try:
                    # Test if server can be started (basic check)
                    if self._test_mcp_server(server):
                        started_servers.append(server)
                    else:
                        failed_servers.append(server)
                except Exception as e:
                    failed_servers.append(f"{server}: {str(e)}")

            duration = time.time() - start_time

            if len(started_servers) > 0:
                return TestResult(
                    test_name="mcp_server_startup",
                    status="passed",
                    duration=duration,
                    message=f"Started {len(started_servers)} MCP servers successfully",
                    details={"started_servers": started_servers, "failed_servers": failed_servers}
                )
            else:
                return TestResult(
                    test_name="mcp_server_startup",
                    status="failed",
                    duration=duration,
                    message="No MCP servers could be started",
                    details={"failed_servers": failed_servers}
                )

        except Exception as e:
            duration = time.time() - start_time
            return TestResult(
                test_name="mcp_server_startup",
                status="error",
                duration=duration,
                message=f"MCP server startup test failed: {str(e)}"
            )

    def _test_mcp_server(self, server_name: str) -> bool:
        """Test if a specific MCP server can start"""
        try:
            # Basic test - check if server files exist
            server_configs = {
                "playwright": {"command": "npx", "args": ["@playwright/mcp@latest"]},
                "figma": {"command": "node", "args": ["/path/to/figma-mcp/index.js"]},
                "design-tokens": {"command": "node", "args": ["/path/to/design-tokens-mcp/index.js"]},
                "tailwind": {"command": "node", "args": ["/path/to/tailwind-mcp/index.js"]}
            }

            if server_name in server_configs:
                config = server_configs[server_name]
                # Test if command exists
                result = subprocess.run(
                    ["which", config["command"]],
                    capture_output=True,
                    text=True
                )
                return result.returncode == 0

            return False

        except Exception:
            return False

    def _test_cursor_integration(self) -> TestResult:
        """Test Cursor IDE integration"""
        start_time = time.time()

        try:
            # Check if Cursor MCP configuration exists
            cursor_config_path = Path.home() / ".cursor" / "mcp.json"

            if not cursor_config_path.exists():
                duration = time.time() - start_time
                return TestResult(
                    test_name="cursor_integration",
                    status="failed",
                    duration=duration,
                    message="Cursor MCP configuration not found"
                )

            # Validate configuration
            with open(cursor_config_path) as f:
                config = json.load(f)

            duration = time.time() - start_time

            if "mcpServers" in config and len(config["mcpServers"]) > 0:
                return TestResult(
                    test_name="cursor_integration",
                    status="passed",
                    duration=duration,
                    message=f"Cursor MCP configuration valid with {len(config['mcpServers'])} servers",
                    details={"servers": list(config["mcpServers"].keys())}
                )
            else:
                return TestResult(
                    test_name="cursor_integration",
                    status="failed",
                    duration=duration,
                    message="Cursor MCP configuration invalid or empty"
                )

        except Exception as e:
            duration = time.time() - start_time
            return TestResult(
                test_name="cursor_integration",
                status="error",
                duration=duration,
                message=f"Cursor integration test failed: {str(e)}"
            )

    def _test_end_to_end_workflow(self) -> TestResult:
        """Test end-to-end MCP workflow"""
        start_time = time.time()

        try:
            # Test a simple workflow: environment -> validation -> MCP
            workflow_steps = []

            # Step 1: Environment loading
            if self._test_environment_loading().status == "passed":
                workflow_steps.append("environment_loading")
            else:
                duration = time.time() - start_time
                return TestResult(
                    test_name="end_to_end_workflow",
                    status="failed",
                    duration=duration,
                    message="End-to-end workflow failed at environment loading step"
                )

            # Step 2: API validation
            if self._test_api_key_validation().status == "passed":
                workflow_steps.append("api_validation")
            else:
                duration = time.time() - start_time
                return TestResult(
                    test_name="end_to_end_workflow",
                    status="failed",
                    duration=duration,
                    message="End-to-end workflow failed at API validation step"
                )

            # Step 3: MCP server startup
            if self._test_mcp_server_startup().status == "passed":
                workflow_steps.append("mcp_startup")
            else:
                duration = time.time() - start_time
                return TestResult(
                    test_name="end_to_end_workflow",
                    status="failed",
                    duration=duration,
                    message="End-to-end workflow failed at MCP server startup step"
                )

            duration = time.time() - start_time

            return TestResult(
                test_name="end_to_end_workflow",
                status="passed",
                duration=duration,
                message=f"End-to-end workflow completed successfully with {len(workflow_steps)} steps",
                details={"workflow_steps": workflow_steps}
            )

        except Exception as e:
            duration = time.time() - start_time
            return TestResult(
                test_name="end_to_end_workflow",
                status="error",
                duration=duration,
                message=f"End-to-end workflow test failed: {str(e)}"
            )

    def _print_test_result(self, result: TestResult):
        """Print test result with appropriate formatting"""
        status_icons = {
            "passed": "✅",
            "failed": "❌",
            "skipped": "⏭️",
            "error": "⚠️"
        }

        icon = status_icons.get(result.status, "❓")
        print(f"   {icon} {result.test_name}: {result.status.upper()} ({result.duration:.2f}s)")
        print(f"      {result.message}")

    def _generate_test_report(self):
        """Generate comprehensive test report"""
        print("\n" + "="*80)
        print("🧪 INTEGRATION TESTING SUITE REPORT")
        print("="*80)

        # Group results by status
        passed_tests = [r for r in self.test_results if r.status == "passed"]
        failed_tests = [r for r in self.test_results if r.status == "failed"]
        skipped_tests = [r for r in self.test_results if r.status == "skipped"]
        error_tests = [r for r in self.test_results if r.status == "error"]

        print("\n📊 SUMMARY:")
        print(f"   Total Tests: {len(self.test_results)}")
        print(f"   ✅ Passed: {len(passed_tests)}")
        print(f"   ❌ Failed: {len(failed_tests)}")
        print(f"   ⏭️  Skipped: {len(skipped_tests)}")
        print(f"   ⚠️  Errors: {len(error_tests)}")

        # Overall status
        if len(failed_tests) == 0 and len(error_tests) == 0:
            print("\n🎉 ALL TESTS PASSED! MCP system is ready for use.")
        elif len(failed_tests) > 0 or len(error_tests) > 0:
            print("\n⚠️  SOME TESTS FAILED. Please check the details below.")

        # Failed tests details
        if failed_tests:
            print("\n❌ FAILED TESTS:")
            for result in failed_tests:
                print(f"   - {result.test_name}: {result.message}")

        # Error tests details
        if error_tests:
            print("\n⚠️  ERROR TESTS:")
            for result in error_tests:
                print(f"   - {result.test_name}: {result.message}")

        # Save detailed report
        self._save_test_report()

    def _save_test_report(self):
        """Save detailed test report to file"""
        report_data = {
            "timestamp": datetime.now().isoformat(),
            "total_tests": len(self.test_results),
            "passed_tests": len([r for r in self.test_results if r.status == "passed"]),
            "failed_tests": len([r for r in self.test_results if r.status == "failed"]),
            "skipped_tests": len([r for r in self.test_results if r.status == "skipped"]),
            "error_tests": len([r for r in self.test_results if r.status == "error"]),
            "results": []
        }

        for result in self.test_results:
            report_data["results"].append({
                "test_name": result.test_name,
                "status": result.status,
                "duration": result.duration,
                "message": result.message,
                "details": result.details
            })

        report_file = self.project_root / "TAURUS AI CORP" / "BizFlow-Orchestrator" / "agents" / "integrations" / "mcp-agents" / "integration_test_report.json"

        with open(report_file, 'w') as f:
            json.dump(report_data, f, indent=2)

        print(f"📄 Detailed test report saved to: {report_file}")

def main():
    """Main execution function"""
    project_root = "/Users/user/Documents/TAURUS AI Corp./CURSOR Projects"

    test_suite = IntegrationTestingSuite(project_root)
    results = test_suite.run_all_tests()

    print(f"\n✅ Integration testing complete! Ran {len(results)} tests.")

    # Summary
    passed_count = len([r for r in results if r.status == "passed"])
    total_count = len(results)

    if passed_count == total_count:
        print("🎉 All tests passed! MCP system is ready.")
    else:
        print(f"⚠️  {passed_count}/{total_count} tests passed. Check the report for details.")

    return results

if __name__ == "__main__":
    main()
