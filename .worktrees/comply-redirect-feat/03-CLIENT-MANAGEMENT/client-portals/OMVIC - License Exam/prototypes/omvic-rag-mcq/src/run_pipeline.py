import subprocess, sys, time

def run(name):
    print(f"\n=== Running {name} ===")
    result = subprocess.run([sys.executable, name], capture_output=False)
    if result.returncode != 0:
        print(f"Failed: {name}")
        sys.exit(1)
    time.sleep(2)

run("chunk_and_index.py")
run("generate_mcq.py")
print("\n✓ Pipeline complete!")
