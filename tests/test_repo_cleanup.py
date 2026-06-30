import os, re, subprocess, pytest

ROOT = '/Users/taurus_ai/Documents/Nexus-Platform'

def _find_numbered_files(root):
    numbered = []
    for dirpath, _, filenames in os.walk(root):
        skip_parts = dirpath.split(os.sep)
        if any(s in skip_parts for s in ('.git', 'node_modules', '.hermes', 'venv', '__pycache__')):
            continue
        for f in filenames:
            if re.search(r' \d+\.(py|js|ts|jsx|tsx|json|yml|yaml|md|html|css|txt)$', f):
                numbered.append(os.path.join(dirpath, f))
    return numbered

def test_duplicate_numbered_files_do_not_exist():
    numbered = _find_numbered_files(ROOT)
    assert numbered == [], f"Found {len(numbered)} numbered duplicate files: {numbered[:10]}..."
