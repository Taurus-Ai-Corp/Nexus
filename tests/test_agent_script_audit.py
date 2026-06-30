import os
import subprocess
import re

import pytest

ROOT = '/Users/taurus_ai/Documents/Nexus-Platform'


def _untracked_files():
    result = subprocess.run(
        ['git', '-C', ROOT, 'status', '--short'],
        capture_output=True,
        text=True,
        check=True,
    )
    lines = result.stdout.splitlines()
    return [line[3:] for line in lines if line.startswith('??')]


def _find_numbered_files(root):
    numbered = []
    for dirpath, _, filenames in os.walk(root):
        if '/node_modules' in dirpath or '/.git' in dirpath:
            continue
        for f in filenames:
            if re.search(r' \d+\.[a-z]+$', f):
                numbered.append(os.path.join(dirpath, f))
    return numbered


def test_no_untracked_numbered_duplicates_remain():
    untracked = _untracked_files()
    numbered = [f for f in untracked if re.search(r' \d+\.[a-z]+$', f)]
    assert numbered == [], f"Untracked numbered duplicates remain: {numbered[:10]}"


def test_agent_registry_has_manifest():
    manifest = os.path.join(
        ROOT, '06-WORKFLOWS/Taurus-AI-Agent-Registry/MANIFEST.md'
    )
    assert os.path.exists(manifest), f"Missing MANIFEST.md for agent registry at {manifest}"
