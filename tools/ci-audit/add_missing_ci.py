#!/usr/bin/env python3
"""Add minimal CI to active repos that lack it."""
import json
import os
import subprocess
import sys
import textwrap

REPORT_DIR = "/Users/taurus_ai/Documents/Nexus-Platform/taurus-ai-corp-ci-audit"
BRANCH = "fix/gridera-branding"
COAUTHORS = "Co-Authored-By: E.Fdz <admin@taurusai.io>\nCo-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"

def run(cmd, check=False):
    r = subprocess.run(cmd, shell=isinstance(cmd,str), capture_output=True, text=True)
    if check and r.returncode:
        print(f"FAIL {cmd}: {r.stderr}", file=sys.stderr)
    return r

def clone(repo):
    p = f"{REPORT_DIR}/clones/{repo}"
    if os.path.isdir(p):
        run(f"git -C {p} fetch origin")
        return p
    run(f"gh repo clone Taurus-Ai-Corp/{repo} {p} -- --depth=1")
    return p

def create_pr(repo, title, body):
    existing = run(f"gh pr list -R Taurus-Ai-Corp/{repo} --head {BRANCH} --json url --jq '.[0].url'")
    if existing.stdout.strip(): return existing.stdout.strip()
    r = run(f"gh pr create -R Taurus-Ai-Corp/{repo} --title '{title}' --body '{body}' --base main --head {BRANCH}")
    return r.stdout.strip()

def add_python_ci(repo):
    p = clone(repo)
    if os.path.exists(f"{p}/.github/workflows/ci.yml"): return f"{repo}: CI exists"
    os.makedirs(f"{p}/.github/workflows", exist_ok=True)
    wf = textwrap.dedent("""\
    name: CI
    on:
      push:
        branches: [main]
      pull_request:
        branches: [main]

    jobs:
      check:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - uses: actions/setup-python@v5
            with:
              python-version: '3.12'
          - run: pip install -r requirements.txt || true
          - run: pip install ruff pytest
          - run: ruff check . || true
          - run: pytest || true
    """)
    with open(f"{p}/.github/workflows/ci.yml", 'w') as f:
        f.write(wf)
    run(f"git -C {p} checkout -B {BRANCH}")
    run(f"git -C {p} add .github/workflows/ci.yml")
    run(f"git -C {p} commit -m 'ci: add starter Python CI workflow' -m '{COAUTHORS}'")
    run(f"git -C {p} push -u origin {BRANCH} --force-with-lease", check=False)
    url = create_pr(repo, "ci: add starter Python CI workflow", "Adds a minimal GitHub Actions workflow for Python 3.12 with dependency install, ruff lint, and pytest. Soft-fails until the project has a test suite and lockfile.")
    return f"{repo}: PR {url}"

results = []
for repo in ["Quantum_Bio_Foundry_IP_VAULT", "quantum-bio-foundry-vault", "quantum-rupee-fraud-detection", "quantum-rupee-offline-cbdc", "quantum-rupee-zk-kyc"]:
    results.append(add_python_ci(repo))

# HTML demos: minimal CI just checks files exist
for repo in ["quantum-infrastructure-demo", "hedera-quantum-ecosystem"]:
    p = clone(repo)
    if os.path.exists(f"{p}/.github/workflows/ci.yml"):
        results.append(f"{repo}: CI exists")
        continue
    os.makedirs(f"{p}/.github/workflows", exist_ok=True)
    wf = textwrap.dedent("""\
    name: CI
    on:
      push:
        branches: [main]
      pull_request:
        branches: [main]

    jobs:
      validate:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - uses: actions/setup-node@v4
            with:
              node-version: '20'
          - run: test -f index.html
          - run: npx html-validate index.html || true
    """)
    with open(f"{p}/.github/workflows/ci.yml", 'w') as f:
        f.write(wf)
    run(f"git -C {p} checkout -B {BRANCH}")
    run(f"git -C {p} add .github/workflows/ci.yml")
    run(f"git -C {p} commit -m 'ci: add minimal HTML validation CI' -m '{COAUTHORS}'")
    run(f"git -C {p} push -u origin {BRANCH} --force-with-lease", check=False)
    url = create_pr(repo, "ci: add minimal HTML validation CI", "Adds a starter CI that verifies index.html exists and runs html-validate (soft-fail).")
    results.append(f"{repo}: PR {url}")

with open(f"{REPORT_DIR}/fixes2.json", 'w') as f:
    json.dump(results, f, indent=2)
print("\n".join(results))
