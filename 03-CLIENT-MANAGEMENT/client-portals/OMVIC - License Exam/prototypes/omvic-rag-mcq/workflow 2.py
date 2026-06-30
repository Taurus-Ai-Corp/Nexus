#!/usr/bin/env python3
"""OMVIC RAG + MCQ Workflow Automation Pipeline"""

import subprocess
import sys
import time
from pathlib import Path


def run_step(name: str, cmd: str, cwd: Path = None) -> bool:
    """Run a pipeline step and report status."""
    print(f"\n{'='*60}")
    print(f"STEP: {name}")
    print(f"CMD: {cmd}")
    print(f"{'='*60}")
    try:
        result = subprocess.run(
            cmd, shell=True, cwd=cwd, text=True,
            capture_output=True
        )
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        if result.returncode != 0:
            print(f"❌ STEP FAILED: {name} (exit code {result.returncode})")
            return False
        print(f"✓ STEP COMPLETE: {name}")
        return True
    except Exception as e:
        print(f"❌ STEP ERROR: {name}: {e}")
        return False

def main():
    base_dir = Path(__file__).parent
    src_dir = base_dir / "src"
    data_dir = base_dir / "data"

    steps = [
        ("Ingest legal sources", f"{sys.executable} ingest.py", src_dir),
        ("Chunk and index", f"{sys.executable} chunk_and_index.py", src_dir),
        ("Generate MCQs", f"{sys.executable} generate_mcq.py", src_dir),
        ("Launch UI", f"{sys.executable} app.py", src_dir),
    ]

    results = []
    for name, cmd, cwd in steps:
        success = run_step(name, cmd, cwd)
        results.append((name, success))
        if not success:
            print(f"\n⚠️  Pipeline stopped at: {name}")
            sys.exit(1)
        # Be polite to servers between steps
        time.sleep(2)

    print(f"\n{'🎉' * 20}")
    print("PIPELINE COMPLETE")
    print(f"{'🎉' * 20}")
    for name, success in results:
        status = "✓" if success else "❌"
        print(f"  {status} {name}")

if __name__ == "__main__":
    main()
