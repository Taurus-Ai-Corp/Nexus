#!/usr/bin/env python3
"""
Basic test script for Enhanced MCP Integrator
Simple tests that don't require complex mocking
"""

import asyncio
import os
from enhanced_mcp_integrator import EnhancedMCPIntegrator, InputValidator

def test_input_validation():
    """Test input validation functions"""
    print("Testing input validation...")
    
    # Test URL validation
    try:
        valid_url = InputValidator.validate_url("https://example.com")
        print(f"✅ URL validation passed: {valid_url}")
    except Exception as e:
        print(f"❌ URL validation failed: {e}")
    
    # Test query sanitization
    try:
        malicious_query = "'; DROP TABLE users; --"
        sanitized = InputValidator.sanitize_query(malicious_query)
        print(f"✅ Query sanitization passed: '{malicious_query}' -> '{sanitized}'")
        assert "DROP TABLE" not in sanitized.upper()
    except Exception as e:
        print(f"❌ Query sanitization failed: {e}")
    
    # Test message validation
    try:
        malicious_message = "Message with \x00 null bytes"
        validated = InputValidator.validate_message(malicious_message)
        print(f"✅ Message validation passed: '{malicious_message}' -> '{validated}'")
    except Exception as e:
        print(f"❌ Message validation failed: {e}")

def test_configuration():
    """Test configuration loading"""
    print("\nTesting configuration...")
    
    try:
        # Set test environment variables
        os.environ["PERPLEXITY_API_KEY"] = "test-key"
        os.environ["FIRECRAWL_API_KEY"] = "test-key"
        os.environ["ANTHROPIC_API_KEY"] = "test-key"
        os.environ["GITHUB_PERSONAL_ACCESS_TOKEN"] = "test-key"
        
        integrator = EnhancedMCPIntegrator()
        
        # Test getting workflows
        workflows = integrator.get_available_workflows()
        print(f"✅ Available workflows: {len(workflows)}")
        
        # Test getting APIs
        apis = integrator.get_working_apis()
        print(f"✅ Working APIs: {len(apis)}")
        
        # Test performance metrics
        metrics = integrator.get_performance_metrics()
        print(f"✅ Performance metrics: {metrics}")
        
    except Exception as e:
        print(f"❌ Configuration test failed: {e}")

async def test_workflow_execution():
    """Test workflow execution (without actual API calls)"""
    print("\nTesting workflow execution...")
    
    try:
        integrator = EnhancedMCPIntegrator()
        
        # Test unknown workflow
        result = await integrator.execute_workflow("unknown_workflow", {})
        assert not result["success"]
        print("✅ Unknown workflow handling passed")
        
        # Test workflow with invalid parameters
        result = await integrator.execute_workflow("ai_search", {})
        print(f"✅ AI search workflow result: {result['success']}")
        
    except Exception as e:
        print(f"❌ Workflow execution test failed: {e}")

def test_security_features():
    """Test security features"""
    print("\nTesting security features...")
    
    try:
        from enhanced_mcp_integrator import SecureAPIClient
        
        # Test encryption
        client = SecureAPIClient()
        test_key = "test-api-key-12345"
        
        encrypted = client.encrypt_key("test_api", test_key)
        decrypted = client.decrypt_key("test_api", encrypted)
        
        assert decrypted == test_key
        assert encrypted != test_key
        print("✅ API key encryption/decryption passed")
        
    except Exception as e:
        print(f"❌ Security test failed: {e}")

def main():
    """Run all basic tests"""
    print("🚀 Running Basic Tests for Enhanced MCP Integrator")
    print("=" * 60)
    
    # Run synchronous tests
    test_input_validation()
    test_configuration()
    test_security_features()
    
    # Run asynchronous tests
    asyncio.run(test_workflow_execution())
    
    print("\n🎉 Basic tests completed!")
    print("\n💡 Note: These are basic functionality tests.")
    print("   For full API testing, configure real API keys and run the full test suite.")

if __name__ == "__main__":
    main()
