#!/usr/bin/env python3
"""
🦙 Ollama Local Agent Registration Script
Registers the Ollama Local AI Agent in the Taurus AI Agent Registry
"""

import sys
import os
from pathlib import Path

# Add parent directory to Python path
sys.path.append(str(Path(__file__).parent.parent))

from registry.agent_registry import get_global_registry
from agents.ollama_local_agent import OllamaLocalAgent

def main():
    """Register the Ollama Local Agent in the global registry"""
    print("🦙 Registering Ollama Local AI Agent...")
    
    try:
        # Get the global registry instance
        registry = get_global_registry()
        
        # Create agent instance
        agent = OllamaLocalAgent()
        
        # Register the agent
        registry.register_agent(agent, agent.get_metadata())
        
        print("✅ Successfully registered OllamaLocalAgent!")
        
        # Display registration details
        metadata = agent.get_metadata()
        print(f"\n📊 Agent Registration Details:")
        print(f"   Name: {metadata.name}")
        print(f"   Version: {metadata.version}")
        print(f"   Capabilities: {len(metadata.capabilities)}")
        print(f"   Business Domains: {', '.join(metadata.business_domains)}")
        print(f"   GitHub Repo: {metadata.github_repo}")
        
        # Display registry stats
        stats = registry.get_registry_stats()
        print(f"\n🌟 Updated Registry Stats:")
        print(f"   Total Agents: {stats['total_agents']}")
        print(f"   Total MCPs: {stats['total_mcps']}")
        print(f"   Total Capabilities: {stats.get('total_capabilities', 'N/A')}")
        
        print("💾 Registry automatically saved!")
            
    except Exception as e:
        print(f"💥 Error during registration: {str(e)}")
        return 1
    
    print("\n🚀 Ollama Local Agent integration complete!")
    print("   🦙 Zero-cost local AI models ready!")
    print("   💰 Monthly cost: $0 for unlimited development!")
    print("   ⚡ Available models: llama3.1:8b, phi3:mini, codellama:13b, mistral:7b")
    return 0

if __name__ == "__main__":
    exit(main())