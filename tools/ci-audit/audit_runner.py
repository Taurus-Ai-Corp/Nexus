#!/usr/bin/env python3
import json
import re
import subprocess

with open('repos.json') as f:
    repos = json.load(f)

report = []
for r in repos:
    name = r['name']
    print(f"\n=== {name} ===")
    entry = dict(repo=name, private=r['private'], archived=r['archived'], expected_metadata=r)

    # workflows
    try:
        wfs = json.loads(subprocess.run(
            ['gh','api',f'repos/Taurus-Ai-Corp/{name}/actions/workflows','--jq','.workflows'],
            capture_output=True, text=True, timeout=30).stdout or '[]')
    except Exception:
        wfs = []
    entry['workflows'] = [{'id':w['id'],'name':w['name'],'path':w['path'],'state':w['state']} for w in wfs]

    # recent runs
    runs = []
    try:
        out = subprocess.run(
            ['gh','api',f'repos/Taurus-Ai-Corp/{name}/actions/runs?per_page=20','--jq','.workflow_runs[]|{id, name, head_branch, event, status, conclusion, run_started_at, html_url, path:.path, head_commit:.head_commit.message}'],
            capture_output=True, text=True, timeout=30).stdout.strip()
        if out:
            for line in out.split('\n'):
                runs.append(json.loads(line))
    except Exception as e:
        print('runs err', e)
    entry['runs'] = runs

    # contents root manifest
    try:
        root = json.loads(subprocess.run(
            ['gh','api',f'repos/Taurus-Ai-Corp/{name}/contents','--jq','.[] | {name, type, download_url}'],
            capture_output=True, text=True, timeout=30).stdout or '')
        root = [json.loads(l) for l in root.split('\n') if l.strip()]
    except Exception:
        root = []
    entry['root_files'] = [x['name'] for x in root if x.get('type')=='file']
    entry['has_workflows_dir'] = any(x['name']=='.github' and x['type']=='dir' for x in root)

    # README
    readme = None
    for f in root:
        if re.match(r'(?i)^readme\\.', f.get('name','')):
            try:
                readme = subprocess.run(['gh','api',f'repos/Taurus-Ai-Corp/{name}/contents/{f["name"]}','--jq','.content'],
                    capture_output=True, text=True, timeout=20).stdout.strip()
                import base64
                readme = base64.b64decode(readme).decode('utf-8', errors='ignore')[:500]
            except Exception:
                pass
            break
    entry['readme_snippet'] = readme[:200] if readme else None

    report.append(entry)

with open('raw_audit.json','w') as f:
    json.dump(report, f, indent=2)
print(f"\nWrote raw_audit.json ({len(report)} repos)")
