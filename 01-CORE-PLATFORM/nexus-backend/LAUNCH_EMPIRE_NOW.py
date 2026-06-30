#!/usr/bin/env python3
"""
🏰 TAURUS AI CORP. - EMPIRE LAUNCHER (TERMINAL-FREE)
Bypasses all terminal issues and launches the empire directly
"""

import os
import subprocess
import sys
from pathlib import Path


class EmpireLauncher:
    def __init__(self):
        self.empire_dir = Path(__file__).parent
        self.venv_python = self.empire_dir / "venv" / "bin" / "python"
        self.venv_python_win = self.empire_dir / "venv" / "Scripts" / "python.exe"

    def print_header(self, title):
        print(f"\n{'='*60}")
        print(f"🏰 {title}")
        print(f"{'='*60}")

    def check_empire_status(self):
        """Check if empire is ready to launch"""
        self.print_header("EMPIRE STATUS CHECK")

        # Check if we're in the right directory
        if not (self.empire_dir / "agents").exists():
            print("❌ Not in empire directory!")
            return False

        print(f"✅ Empire directory: {self.empire_dir}")

        # Check virtual environment
        if self.venv_python.exists():
            print("✅ Virtual environment found (Unix)")
            self.python_exe = self.venv_python
        elif self.venv_python_win.exists():
            print("✅ Virtual environment found (Windows)")
            self.python_exe = self.venv_python_win
        else:
            print("❌ Virtual environment not found")
            print("💡 Creating virtual environment...")
            self.create_venv()
            return False

        # Check key files
        key_files = [
            "agents/orchestration/master_orchestrator.py",
            "registry/server.py",
            "README.md"
        ]

        for file_path in key_files:
            if (self.empire_dir / file_path).exists():
                print(f"✅ {file_path}")
            else:
                print(f"❌ Missing: {file_path}")
                return False

        return True

    def create_venv(self):
        """Create virtual environment"""
        print("🐍 Creating virtual environment...")

        try:
            # Use system Python to create venv
            result = subprocess.run([
                sys.executable, "-m", "venv", "venv"
            ], cwd=self.empire_dir, capture_output=True, text=True)

            if result.returncode == 0:
                print("✅ Virtual environment created")

                # Install requirements
                self.install_requirements()
                return True
            else:
                print(f"❌ Failed to create venv: {result.stderr}")
                return False

        except Exception as e:
            print(f"❌ Error creating venv: {e}")
            return False

    def install_requirements(self):
        """Install Python requirements"""
        print("📦 Installing requirements...")

        requirements_file = self.empire_dir / "requirements.txt"
        if not requirements_file.exists():
            # Create basic requirements
            requirements_content = """fastapi==0.104.1
uvicorn==0.24.0
python-dotenv==1.0.0
anthropic==0.7.8
openai==1.3.7
requests==2.31.0
asyncio
pydantic==2.5.0
"""
            with open(requirements_file, 'w') as f:
                f.write(requirements_content)
            print("✅ Created requirements.txt")

        # Install requirements
        try:
            if self.venv_python.exists():
                python_exe = self.venv_python
            else:
                python_exe = self.venv_python_win

            result = subprocess.run([
                str(python_exe), "-m", "pip", "install", "-r", "requirements.txt"
            ], cwd=self.empire_dir, capture_output=True, text=True)

            if result.returncode == 0:
                print("✅ Requirements installed")
            else:
                print(f"⚠️  Requirements installation had issues: {result.stderr}")

        except Exception as e:
            print(f"⚠️  Error installing requirements: {e}")

    def test_empire_imports(self):
        """Test if empire can be imported"""
        self.print_header("TESTING EMPIRE IMPORTS")

        try:
            # Test master orchestrator import
            result = subprocess.run([
                str(self.python_exe), "-c",
                "from agents.orchestration.master_orchestrator import BizFlowMasterOrchestrator; print('✅ Master orchestrator imports successfully')"
            ], cwd=self.empire_dir, capture_output=True, text=True)

            if result.returncode == 0:
                print(result.stdout)
                return True
            else:
                print(f"❌ Import failed: {result.stderr}")
                return False

        except Exception as e:
            print(f"❌ Error testing imports: {e}")
            return False

    def launch_empire(self):
        """Launch the empire"""
        self.print_header("LAUNCHING EMPIRE")

        print("🚀 Starting Taurus AI Empire...")
        print("🌐 Empire will be available at: http://localhost:8000")
        print("📊 Registry API: http://localhost:8000/agents")
        print("🤖 Master Orchestrator: Active")

        try:
            # Launch the registry server
            print("\n🔥 Starting registry server...")

            result = subprocess.run([
                str(self.python_exe), "-m", "uvicorn",
                "registry.server:app",
                "--host", "0.0.0.0",
                "--port", "8000",
                "--reload"
            ], cwd=self.empire_dir)

        except KeyboardInterrupt:
            print("\n🛑 Empire stopped by user")
        except Exception as e:
            print(f"❌ Error launching empire: {e}")

    def create_quick_start_script(self):
        """Create a quick start script for future use"""
        self.print_header("CREATING QUICK START SCRIPT")

        quick_start = self.empire_dir / "START_EMPIRE.sh"

        script_content = f"""#!/bin/bash
# 🏰 TAURUS AI CORP. - QUICK START SCRIPT
# This script launches your empire without terminal issues

echo "🚀 LAUNCHING TAURUS AI EMPIRE"
echo "============================="

cd "{self.empire_dir}"

# Activate virtual environment
source venv/bin/activate

# Start the empire
python -m uvicorn registry.server:app --host 0.0.0.0 --port 8000 --reload
"""

        with open(quick_start, 'w') as f:
            f.write(script_content)

        # Make executable
        os.chmod(quick_start, 0o755)
        print(f"✅ Quick start script created: {quick_start}")

    def run_empire_launch(self):
        """Run the complete empire launch process"""
        print("🏰 TAURUS AI CORP. - EMPIRE LAUNCHER")
        print("=" * 60)
        print("🚀 Bypassing terminal issues - Direct Python execution")

        # Step 1: Check empire status
        if not self.check_empire_status():
            print("❌ Empire not ready. Please check the setup.")
            return False

        # Step 2: Test imports
        if not self.test_empire_imports():
            print("❌ Empire imports failed. Please check dependencies.")
            return False

        # Step 3: Create quick start script
        self.create_quick_start_script()

        # Step 4: Launch empire
        print("\n🎉 EMPIRE IS READY TO LAUNCH!")
        print("=" * 40)
        print("Your Taurus AI Empire is ready to dominate!")
        print("")
        print("🌐 Access your empire at: http://localhost:8000")
        print("📊 View agents at: http://localhost:8000/agents")
        print("🤖 Master orchestrator is active")
        print("")
        print("Press Ctrl+C to stop the empire")
        print("")

        # Launch the empire
        self.launch_empire()

        return True

if __name__ == "__main__":
    launcher = EmpireLauncher()
    launcher.run_empire_launch()
