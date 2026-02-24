#!/usr/bin/env python3
"""
🎨 TAURUS AI CORP. - NeoVibe Studio Setup
Automated setup script for NeoVibe Studio Core dependencies
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(command):
    """Run a command and return the result"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {command}")
            return True
        else:
            print(f"❌ {command}")
            print(f"Error: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Failed to run {command}: {e}")
        return False

def main():
    """Main setup function"""
    print("🎨 Setting up NeoVibe Studio Core...")
    
    # Get current directory
    current_dir = Path(__file__).parent
    requirements_file = current_dir / "requirements.txt"
    
    if not requirements_file.exists():
        print("❌ requirements.txt not found!")
        return False
    
    # Install dependencies
    print("📦 Installing Python dependencies...")
    if not run_command(f"pip install -r {requirements_file}"):
        print("❌ Failed to install dependencies")
        return False
    
    # Create assets directory
    assets_dir = Path("/Users/user/Documents/TAURUS AI Corp./CURSOR Projects/TAURUS AI CORP/assets/")
    assets_dir.mkdir(parents=True, exist_ok=True)
    print(f"📁 Created assets directory: {assets_dir}")
    
    print("✅ NeoVibe Studio Core setup complete!")
    print("🚀 You can now run: python neovibe_studio_core.py")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
