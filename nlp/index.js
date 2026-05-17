// NeoSync™ NLP Service — Three-Tier AI Routing
// TAURUS AI CORP - FZCO
// Routes: Local Ollama → OpenRouter → HuggingFace

const express = require('express');
const http = require('http');
const app = express();
const port = 8001;

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://ollama:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'hermes-4-14b';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || '';
const HUGGINGFACE_MODEL = process.env.HUGGINGFACE_MODEL || 'meta-llama/Llama-3.1-8B-Instruct';

app.use(express.json());

async function callOllama(model, prompt, systemPrompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt || 'You are an NLP interpreter for a social media management dashboard.' },
        { role: 'user', content: prompt }
      ],
      stream: false
    });
    const url = new URL(OLLAMA_BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 11434,
      path: '/api/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      timeout: 120000
    };
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve(parsed.message?.content || '');
        } catch (e) { reject(new Error('Ollama parse error')); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Ollama timeout')); });
    req.write(data);
    req.end();
  });
}

async function callOpenRouter(model, prompt, systemPrompt) {
  return new Promise((resolve, reject) => {
    if (!OPENROUTER_API_KEY) { reject(new Error('OPENROUTER_API_KEY not set')); return; }
    const data = JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt || 'You are an NLP interpreter for a social media management dashboard.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1024
    });
    const options = {
      hostname: 'openrouter.ai',
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://neosync.taurusai.io',
        'X-OpenRouter-Title': 'NeoSync Social Suite'
      },
      timeout: 60000
    };
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve(parsed.choices?.[0]?.message?.content || '');
        } catch (e) { reject(new Error('OpenRouter parse error')); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('OpenRouter timeout')); });
    req.write(data);
    req.end();
  });
}

async function callHuggingFace(model, prompt) {
  return new Promise((resolve, reject) => {
    if (!HUGGINGFACE_API_KEY) { reject(new Error('HUGGINGFACE_API_KEY not set')); return; }
    const data = JSON.stringify({
      inputs: prompt,
      parameters: { max_new_tokens: 1024, return_full_text: false }
    });
    const options = {
      hostname: 'api-inference.huggingface.co',
      path: `/models/${model}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`
      },
      timeout: 60000
    };
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (Array.isArray(parsed) && parsed.length > 0) {
            resolve(parsed[0].generated_text || '');
          } else {
            resolve(JSON.stringify(parsed));
          }
        } catch (e) { reject(new Error('HF parse error')); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('HF timeout')); });
    req.write(data);
    req.end();
  });
}

// Three-tier routing
async function routeNLP(prompt) {
  const tiers = [
    { name: 'ollama', fn: () => callOllama(OLLAMA_MODEL, prompt, '') },
    { name: 'openrouter', fn: () => callOpenRouter('anthropic/claude-sonnet-4.6', prompt, '') },
    { name: 'huggingface', fn: () => callHuggingFace(HUGGINGFACE_MODEL, prompt) },
  ];

  for (const tier of tiers) {
    try {
      const result = await tier.fn();
      return { content: result, tier: tier.name, success: true };
    } catch (e) {
      console.log(`Tier ${tier.name} failed: ${e.message}`);
    }
  }
  throw new Error('All 3 tiers failed');
}

app.post('/interpret', async (req, res) => {
  const { text } = req.body;
  console.log(`NLP request: ${text}`);
  try {
    const result = await routeNLP(text);
    res.json({ ...result, raw: text });
  } catch (e) {
    res.json({ error: e.message, fallback: { intent: 'unknown', entities: {} } });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'nlp', tiers: ['ollama', 'openrouter', 'huggingface'], timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`NeoSync™ NLP service on :${port}`);
  console.log(`  Tier 1: Ollama (${OLLAMA_BASE_URL}/${OLLAMA_MODEL})`);
  console.log(`  Tier 2: OpenRouter (${OPENROUTER_API_KEY ? 'configured' : 'NOT configured'})`);
  console.log(`  Tier 3: HuggingFace (${HUGGINGFACE_API_KEY ? 'configured' : 'NOT configured'})`);
});
