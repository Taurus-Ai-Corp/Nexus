#!/usr/bin/env python3
"""
scripts/cloud_parliament_review.py — Cloud-only multi-model parliament review.
Reads git diff main...HEAD, sends to cloud LLMs, aggregates consensus.

CLOUD-ONLY: Uses NVIDIA NIM and OpenRouter. No local models.
"""
import asyncio
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import List, Tuple

ROOT = Path('/Users/taurus_ai/Documents/Nexus-Platform')
OUT_DIR = Path('/tmp')
DIFF_CMD = ['git', '-C', str(ROOT), 'diff', 'main...HEAD']

PROVIDERS: List[Tuple[str, str, str, str]] = [
    # (provider, model, api_key_env, endpoint)
    ('openrouter', 'openai/gpt-oss-20b:free', 'OPENROUTER_API_KEY', 'https://openrouter.ai/api/v1/chat/completions'),
    ('nim', 'nvidia/qwen2.5-coder-32b-instruct', 'NVIDIA_API_KEY', 'https://integrate.api.nvidia.com/v1/chat/completions'),
    ('openrouter', 'google/gemini-2.5-flash:free', 'OPENROUTER_API_KEY', 'https://openrouter.ai/api/v1/chat/completions'),
]


def load_secrets():
    env_file = Path.home() / '.env-secrets'
    if env_file.exists():
        with open(env_file) as fh:
            for line in fh:
                line = line.strip()
                if not line or line.startswith('#') or '=' not in line:
                    continue
                k, v = line.split('=', 1)
                if k not in os.environ:
                    os.environ[k] = v.strip().strip('"').strip("'")


def get_diff() -> str:
    res = subprocess.run(DIFF_CMD, capture_output=True)
    if res.returncode != 0:
        print('git diff failed:', res.stderr.decode('utf-8', errors='replace'), file=sys.stderr)
        sys.exit(1)
    diff = res.stdout.decode('utf-8', errors='replace')
    # cap size so we fit context windows
    if len(diff) > 120_000:
        diff = diff[:120_000] + '\n\n[DIFF TRUNCATED]'
    return diff


def build_prompt(diff: str) -> str:
    return f"""You are a senior security and code-quality reviewer. Review the following git diff for repository cleanup work.

Focus areas:
1. Security risks (exposed secrets, unsafe subprocess/shell, SQL injection, XSS, credential leaks).
2. Safety risks (destructive file operations without backups, data loss, rm instead of archive).
3. Correctness (tests actually verify intended behavior, no tautologies, assertions are meaningful).
4. Cloud-only compliance (no local model references like ollama run, llama.cpp, vLLM, AutoModelForCausalLM in new code).
5. Git hygiene (no secrets, API keys, or massive binaries in the diff).

The diff is from a repo cleanup branch that adds tests, a dry-run scanner, archives old .hermes plans, rebuilds NEXUS plans, and adds an agent script audit scanner/MANIFEST.

Output STRICTLY as JSON with no markdown formatting:
{{
  "overall_pass": true/false,
  "critical_flaws": ["description"],
  "warnings": ["description"],
  "suggestions": ["description"],
  "verdict_summary": "one paragraph"
}}

GIT DIFF:
```diff
{diff}
```
"""


async def call_provider(session, provider: str, model: str, api_key: str, endpoint: str, prompt: str) -> Tuple[str, str]:
    headers = {'Content-Type': 'application/json'}
    payload: dict = {
        'model': model,
        'messages': [{'role': 'user', 'content': prompt}],
        'temperature': 0.1,
        'max_tokens': 4096,
    }
    if provider == 'openrouter':
        headers['Authorization'] = f'Bearer {api_key}'
        headers['HTTP-Referer'] = 'https://taurusai.io'
    elif provider == 'nim':
        headers['Authorization'] = f'Bearer {api_key}'
    else:
        headers['Authorization'] = f'Bearer {api_key}'

    try:
        import aiohttp
        async with session.post(endpoint, json=payload, headers=headers, timeout=aiohttp.ClientTimeout(total=120)) as r:
            r.raise_for_status()
            data = await r.json()
            if provider == 'anthropic':
                text = data['content'][0]['text']
            else:
                text = data['choices'][0]['message']['content']
            return (model, text)
    except Exception as e:
        return (model, f'ERROR: {type(e).__name__}: {e}')


def extract_json(text: str) -> dict:
    # strip markdown fences if present
    text = text.strip()
    if text.startswith('```'):
        text = re.sub(r'^```(?:json)?\s*', '', text)
        text = re.sub(r'\s*```$', '', text)
    try:
        return json.loads(text)
    except Exception:
        # try to extract first JSON object
        m = re.search(r'\{.*\}', text, re.DOTALL)
        if m:
            try:
                return json.loads(m.group(0))
            except Exception:
                pass
    return {'raw': text}


async def main():
    load_secrets()
    diff = get_diff()
    if not diff.strip():
        print('No diff found. Are you on a branch ahead of main?', file=sys.stderr)
        sys.exit(0)
    prompt = build_prompt(diff)

    # write prompt for inspection
    (OUT_DIR / 'parliament-prompt.txt').write_text(prompt)

    try:
        import aiohttp
    except ImportError:
        print('aiohttp not installed. Install with: pip install aiohttp', file=sys.stderr)
        sys.exit(1)

    async with aiohttp.ClientSession() as session:
        tasks = []
        for provider, model, key_env, endpoint in PROVIDERS:
            api_key = os.environ.get(key_env)
            if not api_key:
                print(f'Skipping {model}: {key_env} not found', file=sys.stderr)
                continue
            tasks.append(call_provider(session, provider, model, api_key, endpoint, prompt))
        results = await asyncio.gather(*tasks, return_exceptions=True)

    parsed_results = []
    for item in results:
        if isinstance(item, Exception):
            parsed_results.append(('error', f'EXCEPTION: {item}'))
            continue
        model, text = item
        safe_model = re.sub(r'[^\w.-]', '_', model)
        (OUT_DIR / f'parliament-{safe_model}.md').write_text(text)
        parsed = extract_json(text)
        parsed_results.append((model, parsed))

    # aggregate consensus
    all_critical = []
    all_warnings = []
    all_suggestions = []
    passes = []
    for model, parsed in parsed_results:
        if isinstance(parsed, dict) and 'raw' not in parsed:
            passes.append(parsed.get('overall_pass', False))
            all_critical.extend(parsed.get('critical_flaws', []))
            all_warnings.extend(parsed.get('warnings', []))
            all_suggestions.extend(parsed.get('suggestions', []))
        else:
            passes.append(False)

    consensus = {
        'models_reviewed': [m for m, _ in parsed_results],
        'model_pass_votes': passes,
        'overall_pass': all(passes) and len(passes) >= 2,
        'critical_flaws': sorted(set(all_critical)),
        'warnings': sorted(set(all_warnings)),
        'suggestions': sorted(set(all_suggestions)),
    }
    consensus['verdict_summary'] = (
        f"Parliament: {len(passes)} models reviewed. "
        f"Unanimous pass: {all(passes) if passes else False}. "
        f"Pass votes: {sum(passes)}/{len(passes)}. "
        + ('No critical flaws reported.' if not consensus['critical_flaws'] else 'Critical flaws require attention.')
    )

    (OUT_DIR / 'parliament-consensus.json').write_text(json.dumps(consensus, indent=2))
    md = f"""# Cloud Parliament Consensus Report

{consensus['verdict_summary']}

## Models Reviewed

{chr(10).join(f'- {m}: {"PASS" if p else "FAIL"}' for m, p in zip(consensus['models_reviewed'], consensus['model_pass_votes']))}

## Critical Flaws

{chr(10).join(f'- {f}' for f in consensus['critical_flaws']) or 'None'}

## Warnings

{chr(10).join(f'- {w}' for w in consensus['warnings']) or 'None'}

## Suggestions

{chr(10).join(f'- {s}' for s in consensus['suggestions']) or 'None'}
"""
    (OUT_DIR / 'parliament-consensus.md').write_text(md)
    print(md)
    print(f"\nFull consensus JSON: {OUT_DIR / 'parliament-consensus.json'}")
    print(f"Per-model outputs in: {OUT_DIR}")


if __name__ == '__main__':
    asyncio.run(main())
