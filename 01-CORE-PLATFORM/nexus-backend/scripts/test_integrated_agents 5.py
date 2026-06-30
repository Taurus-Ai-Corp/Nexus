#!/usr/bin/env python3
"""
🧪 BIZFLOW ORCHESTRATOR - AGENT TESTING SCRIPT
Tests all integrated agents to verify they work correctly
"""

import json
import sys
from datetime import datetime
from pathlib import Path


class AgentTester:
    def __init__(self):
        self.bizflow_dir = Path("/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/BizFlow-Orchestrator")
        self.agents_dir = self.bizflow_dir / "agents"
        self.test_results = {}

    def print_header(self, title):
        print(f"\n{'='*60}")
        print(f"🧪 {title}")
        print(f"{'='*60}")

    def test_agent_category(self, category):
        """Test all agents in a category"""
        category_dir = self.agents_dir / category
        if not category_dir.exists():
            return []

        print(f"\n📁 Testing {category.title()} Agents:")
        results = []

        for agent_dir in category_dir.iterdir():
            if agent_dir.is_dir() and not agent_dir.name.startswith('__'):
                result = self.test_single_agent(agent_dir, category)
                results.append(result)

        return results

    def test_single_agent(self, agent_dir, category):
        """Test a single agent"""
        agent_name = agent_dir.name
        print(f"  🔍 Testing {agent_name}...")

        try:
            # Check if agent wrapper exists
            wrapper_file = agent_dir / f"{agent_name}_agent.py"
            if not wrapper_file.exists():
                return {
                    "name": agent_name,
                    "category": category,
                    "status": "missing_wrapper",
                    "error": "Agent wrapper not found"
                }

            # Try to import the agent
            sys.path.insert(0, str(agent_dir))
            try:
                module_name = f"{agent_name}_agent"
                agent_module = __import__(module_name)
                agent_class = getattr(agent_module, f"{agent_name.title().replace('_', '')}Agent")

                # Create agent instance
                agent = agent_class()

                # Test basic functionality
                info = agent.get_info()

                return {
                    "name": agent_name,
                    "category": category,
                    "status": "success",
                    "capabilities": info.get("capabilities", []),
                    "path": str(agent_dir)
                }

            except Exception as e:
                return {
                    "name": agent_name,
                    "category": category,
                    "status": "import_error",
                    "error": str(e)
                }
            finally:
                if str(agent_dir) in sys.path:
                    sys.path.remove(str(agent_dir))

        except Exception as e:
            return {
                "name": agent_name,
                "category": category,
                "status": "error",
                "error": str(e)
            }

    def test_all_agents(self):
        """Test all integrated agents"""
        self.print_header("TESTING ALL INTEGRATED AGENTS")

        categories = ["research", "business", "content", "rag", "automation", "mcp"]
        all_results = []

        for category in categories:
            results = self.test_agent_category(category)
            all_results.extend(results)

        # Count results
        total_agents = len(all_results)
        successful_agents = len([r for r in all_results if r["status"] == "success"])
        failed_agents = total_agents - successful_agents

        print("\n📊 TEST RESULTS SUMMARY:")
        print(f"  Total agents tested: {total_agents}")
        print(f"  ✅ Successful: {successful_agents}")
        print(f"  ❌ Failed: {failed_agents}")

        # Show detailed results
        print("\n📋 DETAILED RESULTS:")
        for result in all_results:
            status_icon = "✅" if result["status"] == "success" else "❌"
            print(f"  {status_icon} {result['category']}/{result['name']}: {result['status']}")
            if result["status"] != "success":
                print(f"      Error: {result.get('error', 'Unknown error')}")

        self.test_results = {
            "timestamp": datetime.now().isoformat(),
            "total_agents": total_agents,
            "successful_agents": successful_agents,
            "failed_agents": failed_agents,
            "results": all_results
        }

        return all_results

    def create_test_report(self):
        """Create detailed test report"""
        self.print_header("CREATING TEST REPORT")

        report_file = self.bizflow_dir / "AGENT_TEST_REPORT.json"
        with open(report_file, 'w') as f:
            json.dump(self.test_results, f, indent=2)

        print(f"✅ Test report created: {report_file}")
        return report_file

    def run_tests(self):
        """Run all agent tests"""
        print("🧪 BIZFLOW ORCHESTRATOR - AGENT TESTING")
        print("=" * 60)
        print("Testing all integrated agents...")

        # Test all agents
        results = self.test_all_agents()

        # Create test report
        self.create_test_report()

        # Final summary
        self.print_header("TESTING COMPLETE!")

        successful = len([r for r in results if r["status"] == "success"])
        total = len(results)

        print("🎉 AGENT TESTING COMPLETED!")
        print("")
        print(f"✅ Successful agents: {successful}/{total}")
        print(f"❌ Failed agents: {total - successful}/{total}")
        print("")

        if successful == total:
            print("🏆 ALL AGENTS WORKING PERFECTLY!")
        elif successful > total * 0.8:
            print("🎯 MOST AGENTS WORKING - Minor fixes needed")
        else:
            print("⚠️  SOME AGENTS NEED ATTENTION")

        print("")
        print("📊 Next: Update master orchestrator with working agents")

        return results

if __name__ == "__main__":
    tester = AgentTester()
    tester.run_tests()
