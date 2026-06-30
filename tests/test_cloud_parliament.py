import subprocess
from pathlib import Path

ROOT = Path('/Users/taurus_ai/Documents/Nexus-Platform')
SCRIPT = ROOT / 'scripts' / 'cloud_parliament_review.py'

def test_script_exists():
    assert SCRIPT.exists(), f'{SCRIPT} missing'
    assert SCRIPT.stat().st_size > 0

def test_build_prompt_from_fake_diff():
    # import from the script without running main
    import sys
    sys.path.insert(0, str(ROOT / 'scripts'))
    import cloud_parliament_review as cpr
    diff = '--- a/file.txt\n+++ b/file.txt\n@@ -1 +1 @@\n-old\n+new\n'
    prompt = cpr.build_prompt(diff)
    assert 'old' in prompt
    assert '"overall_pass"' in prompt
    assert 'ollama' in prompt.lower()  # cloud-only compliance check is in prompt

def test_git_diff_main_head_exists():
    res = subprocess.run(['git', '-C', str(ROOT), 'diff', 'main...HEAD'], capture_output=True)
    assert res.returncode == 0
    diff = res.stdout.decode('utf-8', errors='replace')
    assert len(diff) > 0, 'no diff from main to HEAD'
