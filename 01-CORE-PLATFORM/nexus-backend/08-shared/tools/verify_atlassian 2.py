#!/usr/bin/env python3
"""
Minimal Atlassian connectivity verifier (Jira Cloud / Confluence Cloud)
Reads ATLASSIAN_EMAIL, ATLASSIAN_API_TOKEN, ATLASSIAN_BASE_URL from environment or .env beside secrets.
Usage:
  ATLASSIAN_EMAIL=you@domain ATLASSIAN_API_TOKEN=... ATLASSIAN_BASE_URL=https://your.atlassian.net \
  python3 verify_atlassian.py
"""
import os
import sys
import base64
import json
import urllib.request
from pathlib import Path

# Load .env manually (no extra deps)
ENV_FILE = Path(__file__).resolve().parents[1] / 'secrets' / '.env'
if ENV_FILE.exists():
    for line in ENV_FILE.read_text().splitlines():
        if not line or line.strip().startswith('#'):
            continue
        if '=' in line:
            k, v = line.split('=', 1)
            os.environ.setdefault(k.strip(), v.strip())

EMAIL = os.getenv('ATLASSIAN_EMAIL')
TOKEN = os.getenv('ATLASSIAN_API_TOKEN')
BASE = os.getenv('ATLASSIAN_BASE_URL')

if not (EMAIL and TOKEN and BASE):
    print('Missing env vars: ATLASSIAN_EMAIL, ATLASSIAN_API_TOKEN, ATLASSIAN_BASE_URL')
    sys.exit(2)

auth = base64.b64encode(f"{EMAIL}:{TOKEN}".encode()).decode()
req = urllib.request.Request(
    f"{BASE}/rest/api/3/myself",
    headers={'Authorization': f'Basic {auth}', 'Accept': 'application/json'}
)
try:
    with urllib.request.urlopen(req, timeout=20) as r:
        data = json.loads(r.read().decode())
        print(json.dumps({
            'ok': True,
            'accountId': data.get('accountId'),
            'displayName': data.get('displayName'),
            'email': EMAIL,
            'base': BASE
        }, indent=2))
except Exception as e:
    print(json.dumps({'ok': False, 'error': str(e)}, indent=2))
    sys.exit(1)
