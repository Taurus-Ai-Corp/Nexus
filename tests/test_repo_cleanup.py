import os, re, subprocess, pytest
from pathlib import Path
from collections import defaultdict

ROOT = '/Users/taurus_ai/Documents/Nexus-Platform'

DUPLICATE_REGEX = re.compile(r'^(.*?)(?:\s+(\d+))(\.[^.]+)?$')

KNOWN_DIFFERENT_DUPLICATES = {
    'mcp_registry/mcp_healthcheck 2.py': 'iterative mcp_healthcheck variants',
    'mcp_registry/merge_all_registries 2.py': 'iterative merge scripts',
    'mcp_registry/merge_registry 2.py': 'iterative merge scripts',
    'package 2.json': 'root package variants',
}

SKIP_DIRS = {'.git', 'node_modules', '.hermes', 'venv', '.venv', '__pycache__'}


def _find_numbered_files(root):
    numbered = []
    for dirpath, dirnames, filenames in os.walk(root):
        skip_parts = set(Path(dirpath).parts)
        if skip_parts & SKIP_DIRS:
            continue
        for f in filenames:
            path = Path(dirpath) / f
            if path.is_symlink():
                continue
            if DUPLICATE_REGEX.match(f):
                numbered.append(str(path))
    return numbered


def _sha256(path):
    import hashlib
    h = hashlib.sha256()
    with open(path, 'rb') as fh:
        while True:
            chunk = fh.read(65536)
            if not chunk:
                break
            h.update(chunk)
    return h.hexdigest()


def _group_by_base(numbered_paths):
    root_path = Path(ROOT)
    groups = defaultdict(list)
    for p in numbered_paths:
        path = Path(p)
        rel_dir = path.parent.relative_to(root_path)
        m = DUPLICATE_REGEX.match(path.name)
        base_name = m.group(1) + (m.group(3) or '')
        groups[(rel_dir, base_name)].append(path)
    return groups


def _canonical(rel_dir, base_name, paths):
    root_path = Path(ROOT)
    unnumbered = root_path / rel_dir / base_name
    if unnumbered.exists():
        return unnumbered
    nums = [(p, int(DUPLICATE_REGEX.search(p.name).group(2))) for p in paths if DUPLICATE_REGEX.search(p.name)]
    return min(nums, key=lambda x: x[1])[0] if nums else paths[0]


def test_duplicate_numbered_files_do_not_exist():
    numbered = _find_numbered_files(ROOT)
    groups = _group_by_base(numbered)
    identical_violations = []
    for (rel_dir, base_name), paths in groups.items():
        canonical = _canonical(rel_dir, base_name, paths)
        can_size = canonical.stat().st_size
        can_hash = None
        for p in paths:
            if p == canonical:
                continue
            if p.stat().st_size != can_size:
                continue
            if can_hash is None:
                can_hash = _sha256(canonical)
            if _sha256(p) == can_hash:
                identical_violations.append((str(p), str(canonical)))

    if identical_violations:
        msg = f"Found {len(identical_violations)} identical numbered copies (safe to delete):\n"
        for dup, keep in identical_violations[:20]:
            msg += f"  DELETE {dup} (keep {keep})\n"
        if len(identical_violations) > 20:
            msg += f"  ... and {len(identical_violations) - 20} more"
    assert not identical_violations, msg

def test_different_duplicates_have_triage_notes_or_are_known():
    """After manual triage, no different-content numbered duplicates should remain."""
    numbered = _find_numbered_files(ROOT)
    assert numbered == [], f"Found {len(numbered)} numbered duplicate files remaining: {numbered[:10]}..."
