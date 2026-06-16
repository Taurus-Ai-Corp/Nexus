// /api/research.js — zero-config internet research endpoint for Nexus Creative
// Uses Agent-Reach pure-Python channels via child_process Python invocation.
// Channels used: web (Jina Reader), rss, v2ex, xueqiu, youtube metadata
//
// POST { query, sources: ['web','rss','v2ex','xueqiu','youtube'], url, limit }
// Returns { query, results: { source: [items] } }

const PYTHON = '/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/Agent-Reach/.venv/bin/python';
const AGENT_REACH_DIR = '/Users/taurus_ai/Documents/Nexus-Platform/SWARM SR Internal Analysis/Agent-Reach';

function pythonScript(payload) {
  return `
import json, sys
sys.path.insert(0, '${AGENT_REACH_DIR}')
from agent_reach.channels.web import WebChannel
from agent_reach.channels.v2ex import V2EXChannel
from agent_reach.channels.xueqiu import XueqiuChannel
from agent_reach.channels.rss import RSSChannel
from agent_reach.channels.youtube import YouTubeChannel

payload = json.loads(r'''${JSON.stringify(payload).replace(/'/g, "\\'")}''')
query = payload.get('query', '')
url = payload.get('url', '')
sources = payload.get('sources', ['web'])
limit = int(payload.get('limit', 10))

out = {}

if 'web' in sources and url:
    try:
        ch = WebChannel()
        out['web'] = [{'source': url, 'text': ch.read(url)[:4000]}]
    except Exception as e:
        out['web'] = [{'error': str(e)}]

if 'rss' in sources and url:
    try:
        import feedparser
        feed = feedparser.parse(url)
        out['rss'] = [
            {
                'title': e.get('title', ''),
                'link': e.get('link', ''),
                'published': e.get('published', ''),
                'summary': (e.get('summary') or '')[:500]
            }
            for e in feed.entries[:limit]
        ]
    except Exception as e:
        out['rss'] = [{'error': str(e)}]

if 'v2ex' in sources:
    try:
        ch = V2EXChannel()
        node = payload.get('v2ex_node', 'creative') or 'creative'
        topics = ch.get_node_topics(node, limit=limit)
        out['v2ex'] = topics
    except Exception as e:
        out['v2ex'] = [{'error': str(e)}]

if 'xueqiu' in sources:
    try:
        ch = XueqiuChannel()
        out['xueqiu'] = {
            'hot_posts': ch.get_hot_posts(limit=min(limit, 20)),
            'hot_stocks': ch.get_hot_stocks(limit=min(limit, 20))
        }
    except Exception as e:
        out['xueqiu'] = {'error': str(e)}

if 'youtube' in sources and url:
    try:
        import subprocess, json as _json
        cmd = ['yt-dlp', '--dump-json', '--no-download', url]
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        if res.returncode == 0 and res.stdout.strip():
            meta = _json.loads(res.stdout.strip().splitlines()[0])
            out['youtube'] = [{
                'title': meta.get('title'),
                'description': (meta.get('description') or '')[:1000],
                'channel': meta.get('channel'),
                'duration': meta.get('duration'),
                'view_count': meta.get('view_count'),
                'upload_date': meta.get('upload_date')
            }]
        else:
            out['youtube'] = [{'error': res.stderr or 'yt-dlp failed'}]
    except Exception as e:
        out['youtube'] = [{'error': str(e)}]

print(json.dumps({'query': query, 'results': out}, ensure_ascii=False, indent=2))
`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed. Use POST.' });

  const { query = '', sources = ['web'], url = '', limit = 10, v2ex_node = 'creative' } = req.body || {};

  const allowed = ['web', 'rss', 'v2ex', 'xueqiu', 'youtube'];
  const active = sources.filter(s => allowed.includes(s));
  if (active.length === 0) {
    return res.status(400).json({ error: `No valid sources. Choose from: ${allowed.join(', ')}` });
  }

  const payload = { query, sources: active, url, limit: Math.min(parseInt(limit) || 10, 50), v2ex_node };

  try {
    const { spawn } = await import('child_process');
    const proc = spawn(PYTHON, ['-c', pythonScript(payload)], {
      cwd: AGENT_REACH_DIR,
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
    });

    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', d => stdout += d.toString());
    proc.stderr.on('data', d => stderr += d.toString());

    await new Promise((resolve, reject) => {
      proc.on('error', reject);
      proc.on('close', code => {
        if (code !== 0) reject(new Error(`Python exited ${code}: ${stderr || 'unknown error'}`));
        else resolve();
      });
      setTimeout(() => reject(new Error('Research script timed out')), 25000);
    });

    let data;
    try {
      data = JSON.parse(stdout);
    } catch {
      return res.status(500).json({ error: 'Failed to parse Python output', stdout, stderr });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error('[/api/research] error:', err);
    return res.status(500).json({ error: err.message });
  }
}
