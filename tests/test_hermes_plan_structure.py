import os, re
import pytest

ROOT = '/Users/taurus_ai/Documents/Nexus-Platform'
HERMES = os.path.join(ROOT, '.hermes')

def _list_md_files(path):
    out = []
    if os.path.isdir(path):
        for dirpath, _, filenames in os.walk(path):
            for f in filenames:
                if f.endswith('.md'):
                    out.append(os.path.join(dirpath, f))
    return out

def test_hermes_plan_directory_exists_with_nexus_content():
    assert os.path.isdir(HERMES), f".hermes dir missing at {HERMES}"
    md_files = _list_md_files(HERMES)
    assert len(md_files) >= 3, f"Expected >=3 .md files in .hermes, found {len(md_files)}"
    contents = ' '.join(open(f).read() for f in md_files)
    assert 'NEXUS' in contents or 'Nexus' in contents, "Plans must reference NEXUS scope"
    assert 'platform/' in contents or 'nexus.taurusai.io' in contents, "Plans must reference NEXUS marketing site"

def test_no_stale_neosync_bizflow_references():
    active_root = os.path.join(HERMES, 'nexus')
    md_files = _list_md_files(active_root)
    stale = []
    banned = re.compile(r'\bNeoSync\b|\bBizFlow\b|\bNeoVibe\b')
    allow_prefix = re.compile(
        r'(stale|avoid|leftover|deprecated|remove any)\s+(NeoSync|BizFlow|NeoVibe)|'
        r'(NeoSync|BizFlow|NeoVibe)\s+(references|naming|color|copy|era plans|era|plans)',
        re.IGNORECASE
    )
    for f in md_files:
        text = open(f).read()
        for m in banned.finditer(text):
            start = max(0, m.start() - 40)
            end = min(len(text), m.end() + 40)
            context = text[start:end]
            if not allow_prefix.search(context):
                stale.append(f)
                break
    assert stale == [], f"Stale brand references in active nexus plans: {stale}"
