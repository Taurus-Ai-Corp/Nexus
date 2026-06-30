#!/usr/bin/env python3
"""Dry-run scanner for numbered duplicate files.

Groups files matching '<name> <n>.<ext>' by canonical base name '<name>.<ext>'.
Computes SHA-256 for every member, prints groups that are byte-identical
and groups whose numbered copies differ from the canonical file.
Does NOT delete anything.
"""
import os, re, hashlib, json, collections, sys

ROOT = '/Users/taurus_ai/Documents/Nexus-Platform'
RE_NUMERIC_SUFFIX = re.compile(r'^(.*?)( \d+)?(\.[^.]+)$')
EXT_RE = re.compile(r' \d+\.(py|js|ts|jsx|tsx|json|yml|yaml|md|html|css|txt)$')
SKIP_DIRS = ('.git', 'node_modules', '.hermes', 'venv', '__pycache__')

def _sha256(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(65536), b''):
            h.update(chunk)
    return h.hexdigest()

def _is_skipped(dirpath):
    parts = dirpath.split(os.sep)
    return any(skip in parts for skip in SKIP_DIRS)

def _walk_numbered(root):
    for dirpath, _, filenames in os.walk(root):
        if _is_skipped(dirpath):
            continue
        for f in filenames:
            if EXT_RE.search(f):
                yield os.path.join(dirpath, f)

def _canonical_name(numbered_path):
    # '/a/b/file 3.py' -> '/a/b/file.py'
    dirname, basename = os.path.split(numbered_path)
    m = RE_NUMERIC_SUFFIX.match(basename)
    if not m or m.group(2) is None:
        return None
    return os.path.join(dirname, m.group(1) + m.group(3))

def scan():
    numbered = sorted(_walk_numbered(ROOT))
    groups = collections.defaultdict(list)
    for path in numbered:
        canonical = _canonical_name(path)
        if not canonical:
            continue
        groups[canonical].append(path)

    identical = []
    different = []
    removable = 0

    for canonical in sorted(groups):
        members = [canonical] + sorted(groups[canonical]) if os.path.exists(canonical) else sorted(groups[canonical])
        hashes = {}
        for p in members:
            try:
                hashes[p] = _sha256(p)
            except FileNotFoundError:
                continue
        # Determine if every numbered copy is identical to the canonical file.
        if not os.path.exists(canonical):
            different.append({
                'canonical': canonical,
                'canonical_exists': False,
                'members': [{'path': p, 'sha256': hashes.get(p)} for p in sorted(groups[canonical])],
            })
            continue

        canonical_hash = hashes[canonical]
        copies = sorted(groups[canonical])
        copy_hashes = {p: hashes[p] for p in copies}
        all_identical = all(h == canonical_hash for h in copy_hashes.values())
        if all_identical:
            identical.append({
                'canonical': canonical,
                'sha256': canonical_hash,
                'count': len(copies),
                'copies': copies,
            })
            removable += len(copies)
        else:
            different.append({
                'canonical': canonical,
                'canonical_hash': canonical_hash,
                'members': [{'path': p, 'sha256': copy_hashes[p]} for p in copies],
            })

    return {
        'root': ROOT,
        'total_numbered': len(numbered),
        'identical_groups': identical,
        'different_groups': different,
        'removable_count': removable,
    }

def _print_report(report):
    print(f"Root: {report['root']}")
    print(f"Total numbered duplicate files: {report['total_numbered']}")
    print(f"Identical groups (safe to remove copies): {len(report['identical_groups'])}")
    print(f"Removable copies: {report['removable_count']}")
    print(f"Different groups (need inspection): {len(report['different_groups'])}")
    print()
    print("=" * 80)
    print("IDENTICAL GROUPS")
    print("=" * 80)
    for g in report['identical_groups']:
        print(f"\nCanonical: {g['canonical']}  ({g['sha256']})")
        for c in g['copies']:
            print(f"  [identical] {c}")
    print()
    print("=" * 80)
    print("DIFFERENT GROUPS")
    print("=" * 80)
    for g in report['different_groups']:
        exists = os.path.exists(g['canonical'])
        print(f"\nCanonical: {g['canonical']}  {'(exists)' if exists else '(MISSING)'}")
        if exists:
            print(f"  hash: {g['canonical_hash']}")
        for m in g['members']:
            short = m['sha256'][:16] if m.get('sha256') else '?' * 16
            print(f"  [{short}...] {m['path']}")

if __name__ == '__main__':
    report = scan()
    _print_report(report)
    # Persist JSON for downstream tooling.
    out_json = '/tmp/cleanup-dry-run.json'
    with open(out_json, 'w') as f:
        json.dump(report, f, indent=2)
    print(f"\nJSON report saved to {out_json}", file=sys.stderr)
