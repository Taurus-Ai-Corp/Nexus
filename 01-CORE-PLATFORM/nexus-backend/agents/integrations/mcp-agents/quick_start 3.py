#!/usr/bin/env python3
"""
Quick Start Script for MCP Business Integration
Easy way to test and demonstrate MCP functionality
"""

from pathlib import Path


def check_environment():
    """Check if environment is properly configured"""
    print("🔍 Checking Environment Configuration...")
    print("-" * 50)

    # Check if master.env exists
    env_file = Path("master.env")
    if not env_file.exists():
        print("❌ master.env file not found!")
        print("   Please ensure master.env is in the current directory")
        return False

    # Check for required API keys
    required_keys = [
        "OPENAI_API_KEY",
        "PERPLEXITY_API_KEY",
        "ANTHROPIC_API_KEY",
        "FIRECRAWL_API_KEY"
    ]

    missing_keys = []
    with open(env_file) as f:
        content = f.read()
        for key in required_keys:
            if f"{key}=" not in content or f"{key}=your_" in content:
                missing_keys.append(key)

    if missing_keys:
        print("⚠️  Missing or placeholder API keys:")
        for key in missing_keys:
            print(f"   - {key}")
        print("\n   Please update master.env with real API keys")
        return False

    print("✅ Environment configuration looks good!")
    return True

def test_mcp_integrator():
    """Test the MCP Business Integrator"""
    print("\n🧪 Testing MCP Business Integrator...")
    print("-" * 50)

    try:
        from mcp_business_integrator import MCPBusinessIntegrator

        # Initialize integrator
        integrator = MCPBusinessIntegrator()

        # Test basic functionality
        print("📋 Available Connectors:")
        connectors = integrator.get_available_connectors()
        for name, config in connectors.items():
            print(f"   • {name}: {config['description']}")

        print("\n🔄 Available Workflows:")
        workflows = integrator.get_available_workflows()
        for name, config in workflows.items():
            print(f"   • {name}: {config['description']}")

        # Test a simple workflow
        print("\n🧪 Testing Email Management Workflow...")
        result = integrator.execute_workflow("email_management")

        if result.get('success'):
            print("✅ MCP Business Integrator is working!")
            print(f"   Tools used: {result.get('tools_used', 'N/A')}")
        else:
            print(f"❌ Test failed: {result.get('error', 'Unknown error')}")
            print("   This is expected if OAuth tokens are not configured")

        return True

    except Exception as e:
        print(f"❌ Error testing MCP integrator: {str(e)}")
        return False

def show_next_steps():
    """Show next steps for complete setup"""
    print("\n🚀 Next Steps for Complete Setup:")
    print("=" * 50)

    print("1. 🔐 Set up OAuth tokens (Required for full functionality):")
    print("   • Follow oauth_setup_guide.md")
    print("   • Google OAuth: ~15 minutes")
    print("   • Microsoft OAuth: ~20 minutes")
    print("   • Dropbox OAuth: ~10 minutes")

    print("\n2. 🧪 Test the integration:")
    print("   python mcp_examples.py")

    print("\n3. 🚀 Deploy business workflows:")
    print("   • Start with email management")
    print("   • Add document collaboration")
    print("   • Expand to team communication")

    print("\n4. 📊 Monitor and optimize:")
    print("   • Check business reports")
    print("   • Monitor API usage")
    print("   • Optimize workflows")

def main():
    """Main quick start function"""
    print("🚀 MCP Business Integration - Quick Start")
    print("=" * 50)
    print("This script will help you test and verify your MCP setup.\n")

    # Check environment
    env_ok = check_environment()

    # Test MCP integrator
    integrator_ok = test_mcp_integrator()

    # Show next steps
    show_next_steps()

    # Summary
    print("\n📋 Quick Start Summary:")
    print("-" * 30)
    print(f"Environment: {'✅ Ready' if env_ok else '❌ Needs Setup'}")
    print(f"MCP Integrator: {'✅ Working' if integrator_ok else '❌ Needs OAuth'}")

    if env_ok and integrator_ok:
        print("\n🎉 Your MCP Business Integration is ready to use!")
        print("   Follow the next steps to set up OAuth tokens for full functionality.")
    else:
        print("\n⚠️  Some setup is still needed.")
        print("   Please follow the next steps to complete the configuration.")

    print("\n📚 Documentation:")
    print("   • OPENAI_MCP_BUSINESS_INTEGRATION_PLAN.md - Business plan")
    print("   • oauth_setup_guide.md - OAuth setup instructions")
    print("   • mcp_examples.py - Usage examples")
    print("   • MCP_INTEGRATION_SUMMARY.md - Complete summary")

if __name__ == "__main__":
    main()
