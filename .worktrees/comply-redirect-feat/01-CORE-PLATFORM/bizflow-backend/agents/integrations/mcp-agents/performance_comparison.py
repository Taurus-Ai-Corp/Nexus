#!/usr/bin/env python3
"""
Performance Comparison: Original vs Optimized MCP Integrator
Demonstrates the improvements made by Claude Code MCP Agent
"""

import asyncio
import time
from working_mcp_integrator import WorkingMCPIntegrator
from working_mcp_integrator_optimized import OptimizedMCPIntegrator

async def test_original_integrator():
    """Test the original integrator performance"""
    print("🔄 Testing Original MCP Integrator...")
    start_time = time.time()
    
    integrator = WorkingMCPIntegrator()
    
    # Test sequential execution
    result1 = await integrator.call_perplexity("Test query 1")
    result2 = await integrator.call_anthropic("Test message 1")
    result3 = await integrator.call_github("/user")
    
    end_time = time.time()
    duration = end_time - start_time
    
    print(f"  ⏱️  Sequential execution time: {duration:.2f} seconds")
    print(f"  ✅ Successful calls: {sum(1 for r in [result1, result2, result3] if r.get('success', False))}/3")
    
    return duration

async def test_optimized_integrator():
    """Test the optimized integrator performance"""
    print("\n🚀 Testing Optimized MCP Integrator...")
    start_time = time.time()
    
    async with OptimizedMCPIntegrator() as integrator:
        # Test concurrent execution
        result = await integrator.execute_workflow(
            "parallel_search",
            {
                "query": "Test query 2",
                "message": "Test message 2"
            }
        )
    
    end_time = time.time()
    duration = end_time - start_time
    
    print(f"  ⏱️  Concurrent execution time: {duration:.2f} seconds")
    print(f"  ✅ Successful APIs: {result['successful_apis']}")
    print(f"  📊 Success rate: {result['success_rate']:.2%}")
    
    return duration

async def main():
    """Run performance comparison"""
    print("🏁 MCP Integrator Performance Comparison")
    print("=" * 50)
    
    # Test original integrator
    original_time = await test_original_integrator()
    
    # Test optimized integrator
    optimized_time = await test_optimized_integrator()
    
    # Calculate improvement
    improvement = ((original_time - optimized_time) / original_time) * 100
    
    print(f"\n📈 Performance Results:")
    print(f"  Original: {original_time:.2f} seconds")
    print(f"  Optimized: {optimized_time:.2f} seconds")
    print(f"  Improvement: {improvement:.1f}% faster")
    
    if improvement > 0:
        print(f"  🎉 Optimized version is {improvement:.1f}% faster!")
    else:
        print(f"  ⚠️  Optimized version is {abs(improvement):.1f}% slower (may be due to API rate limits)")
    
    print(f"\n💡 Key Improvements in Optimized Version:")
    print(f"  • Async/await with aiohttp instead of synchronous requests")
    print(f"  • Connection pooling for better resource management")
    print(f"  • Concurrent execution of parallel workflows")
    print(f"  • Rate limiting to prevent API abuse")
    print(f"  • Enhanced error handling with retry logic")
    print(f"  • Better logging and monitoring")

if __name__ == "__main__":
    asyncio.run(main())

