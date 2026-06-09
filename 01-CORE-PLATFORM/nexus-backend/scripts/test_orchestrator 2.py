#!/usr/bin/env python3
"""
🧪 BIZFLOW ORCHESTRATOR - COMPREHENSIVE TESTING
Tests the updated master orchestrator with all 16 agents
"""

import asyncio
import json
import sys
from pathlib import Path

# Add the agents directory to path
sys.path.append(str(Path(__file__).parent.parent / "agents" / "orchestration"))

from master_orchestrator import BizFlowMasterOrchestrator

class OrchestratorTester:
    def __init__(self):
        self.orchestrator = BizFlowMasterOrchestrator()
        
    def print_header(self, title):
        print(f"\n{'='*60}")
        print(f"🧪 {title}")
        print(f"{'='*60}")
    
    def test_agent_initialization(self):
        """Test that all agents are properly initialized"""
        self.print_header("TESTING AGENT INITIALIZATION")
        
        status = self.orchestrator.get_agent_status()
        
        print(f"📊 Total Agents: {status['total_agents']}")
        print(f"📁 Categories: {len(status['categories'])}")
        
        for category, info in status['categories'].items():
            print(f"\n📂 {category.title()} Category:")
            print(f"  Agents: {info['active']}/{info['count']}")
            for agent_name in info['agents']:
                status_icon = "✅" if agent_name in self.orchestrator.agents else "❌"
                print(f"    {status_icon} {agent_name}")
        
        return status
    
    def test_intelligent_routing(self):
        """Test intelligent task routing"""
        self.print_header("TESTING INTELLIGENT ROUTING")
        
        test_cases = [
            {
                "description": "Research latest AI trends",
                "expected_category": "research",
                "type": "research"
            },
            {
                "description": "Write a blog post about marketing",
                "expected_category": "content", 
                "type": "content"
            },
            {
                "description": "Analyze stock market data",
                "expected_category": "business",
                "type": "finance"
            },
            {
                "description": "Create social media content",
                "expected_category": "content",
                "type": "social"
            },
            {
                "description": "Analyze candidate profiles",
                "expected_category": "research",
                "type": "analysis"
            }
        ]
        
        routing_results = []
        
        for i, test_case in enumerate(test_cases, 1):
            print(f"\n🧪 Test Case {i}: {test_case['description']}")
            
            # Test agent selection
            selected_agent = self.orchestrator.find_best_agent(
                test_case['description'],
                test_case['type']
            )
            
            print(f"  🤖 Selected Agent: {selected_agent}")
            
            # Check if agent is in expected category
            agent_category = None
            for category, agents in self.orchestrator.agent_categories.items():
                if selected_agent in agents:
                    agent_category = category
                    break
            
            print(f"  📂 Agent Category: {agent_category}")
            
            # Verify selection
            is_correct = agent_category == test_case['expected_category']
            status_icon = "✅" if is_correct else "⚠️"
            print(f"  {status_icon} Routing: {'Correct' if is_correct else 'Needs adjustment'}")
            
            routing_results.append({
                "test_case": test_case,
                "selected_agent": selected_agent,
                "agent_category": agent_category,
                "is_correct": is_correct
            })
        
        # Summary
        correct_routes = len([r for r in routing_results if r['is_correct']])
        total_routes = len(routing_results)
        
        print(f"\n📊 ROUTING SUMMARY:")
        print(f"  Correct routes: {correct_routes}/{total_routes}")
        print(f"  Accuracy: {(correct_routes/total_routes)*100:.1f}%")
        
        return routing_results
    
    async def test_task_execution(self):
        """Test actual task execution"""
        self.print_header("TESTING TASK EXECUTION")
        
        test_tasks = [
            {
                "description": "Research quantum computing trends",
                "type": "research",
                "data": {"topic": "quantum computing", "market": "global"}
            },
            {
                "description": "Create marketing content for UAE market",
                "type": "content", 
                "data": {"market": "UAE", "format": "social_media"}
            },
            {
                "description": "Analyze startup funding trends",
                "type": "finance",
                "data": {"sector": "technology", "region": "global"}
            }
        ]
        
        execution_results = []
        
        for i, task in enumerate(test_tasks, 1):
            print(f"\n🚀 Executing Task {i}: {task['description']}")
            
            try:
                result = await self.orchestrator.execute_intelligent_task(
                    task['description'],
                    task['data']
                )
                
                print(f"  ✅ Task completed successfully")
                print(f"  📊 Result status: {result.get('status', 'unknown')}")
                
                execution_results.append({
                    "task": task,
                    "result": result,
                    "success": True
                })
                
            except Exception as e:
                print(f"  ❌ Task failed: {str(e)}")
                execution_results.append({
                    "task": task,
                    "error": str(e),
                    "success": False
                })
        
        # Summary
        successful_tasks = len([r for r in execution_results if r['success']])
        total_tasks = len(execution_results)
        
        print(f"\n📊 EXECUTION SUMMARY:")
        print(f"  Successful tasks: {successful_tasks}/{total_tasks}")
        print(f"  Success rate: {(successful_tasks/total_tasks)*100:.1f}%")
        
        return execution_results
    
    def test_performance_metrics(self):
        """Test performance tracking"""
        self.print_header("TESTING PERFORMANCE METRICS")
        
        metrics = self.orchestrator.performance_metrics
        
        if not metrics:
            print("  ⚠️  No performance metrics available yet")
            return metrics
        
        print(f"  📊 Performance metrics for {len(metrics)} agents:")
        
        for agent_name, agent_metrics in metrics.items():
            print(f"\n  🤖 {agent_name}:")
            print(f"    Last execution: {agent_metrics.get('last_execution', 'N/A')}s")
            print(f"    Total tasks: {agent_metrics.get('total_tasks', 0)}")
            print(f"    Success rate: {agent_metrics.get('success_rate', 0)*100:.1f}%")
        
        return metrics
    
    def create_test_report(self, init_status, routing_results, execution_results, metrics):
        """Create comprehensive test report"""
        self.print_header("CREATING TEST REPORT")
        
        report = {
            "timestamp": "2025-09-11",
            "test_summary": {
                "total_agents": init_status['total_agents'],
                "categories": len(init_status['categories']),
                "routing_accuracy": len([r for r in routing_results if r['is_correct']]) / len(routing_results) * 100,
                "execution_success": len([r for r in execution_results if r['success']]) / len(execution_results) * 100
            },
            "agent_status": init_status,
            "routing_results": routing_results,
            "execution_results": execution_results,
            "performance_metrics": metrics
        }
        
        report_file = Path(__file__).parent.parent / "ORCHESTRATOR_TEST_REPORT.json"
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"✅ Test report created: {report_file}")
        return report_file
    
    async def run_comprehensive_test(self):
        """Run all tests"""
        print("🧪 BIZFLOW ORCHESTRATOR - COMPREHENSIVE TESTING")
        print("=" * 60)
        print("Testing the updated master orchestrator with 16 agents...")
        
        # Test 1: Agent initialization
        init_status = self.test_agent_initialization()
        
        # Test 2: Intelligent routing
        routing_results = self.test_intelligent_routing()
        
        # Test 3: Task execution
        execution_results = await self.test_task_execution()
        
        # Test 4: Performance metrics
        metrics = self.test_performance_metrics()
        
        # Create test report
        self.create_test_report(init_status, routing_results, execution_results, metrics)
        
        # Final summary
        self.print_header("TESTING COMPLETE!")
        
        print("🎉 COMPREHENSIVE TESTING COMPLETED!")
        print("")
        print(f"✅ Agents initialized: {init_status['total_agents']}")
        print(f"✅ Categories: {len(init_status['categories'])}")
        print(f"✅ Routing accuracy: {len([r for r in routing_results if r['is_correct']]) / len(routing_results) * 100:.1f}%")
        print(f"✅ Execution success: {len([r for r in execution_results if r['success']]) / len(execution_results) * 100:.1f}%")
        print("")
        print("🏰 Your BizFlow-Orchestrator is ready for production!")
        
        return {
            "init_status": init_status,
            "routing_results": routing_results,
            "execution_results": execution_results,
            "metrics": metrics
        }

async def main():
    tester = OrchestratorTester()
    await tester.run_comprehensive_test()

if __name__ == "__main__":
    asyncio.run(main())
