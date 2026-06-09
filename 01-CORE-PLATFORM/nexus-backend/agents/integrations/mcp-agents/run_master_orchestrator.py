#!/usr/bin/env python3
"""
Quick Execution Script for Master Orchestrator
MCP API Keys Fix System

This script provides a simple way to run the Master Orchestrator
and all its sub-agents to fix MCP connection issues.
"""

import os
import sys
import asyncio
from pathlib import Path

def main():
    """Main execution function"""
    print("🚀 Starting Master Orchestrator - MCP API Keys Fix System")
    print("="*80)
    
    # Ensure we're in the right directory
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # Add current directory to Python path
    sys.path.insert(0, str(script_dir))
    
    try:
        # Import and run the master orchestrator
        from master_orchestrator import main as orchestrator_main
        
        print("📋 Running Master Orchestrator...")
        results = asyncio.run(orchestrator_main())
        
        print("\n✅ Master Orchestrator execution completed!")
        return results
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Make sure all sub-agent files are in the sub-agents/ directory")
        return None
        
    except Exception as e:
        print(f"❌ Execution error: {e}")
        return None

if __name__ == "__main__":
    main()
