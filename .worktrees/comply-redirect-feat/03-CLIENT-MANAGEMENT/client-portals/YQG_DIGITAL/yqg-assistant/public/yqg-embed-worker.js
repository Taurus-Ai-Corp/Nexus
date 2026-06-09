/**
 * YQG Offline Embedding Worker — bge-small-en-v1.5
 *
 * 66MB model, MTEB score 61.7%, 25ms per encode.
 * Used for local vector search over IndexedDB memory store.
 *
 * Message protocol (main → worker):
 *   { type: 'load' }
 *   { type: 'embed', id: string, text: string }
 *   { type: 'search', query: string, topK: number, entries: Array<{id,text,vector}>, searchSeq: number }
 *
 * Message protocol (worker → main):
 *   { type: 'loading', progress: number }
 *   { type: 'ready' }
 *   { type: 'embedded', id: string, vector: number[] }
 *   { type: 'results', matches: Array<{id, text, score}>, searchSeq: number }  — searchSeq echoed
 *   { type: 'error', message: string }
 */
import {
  env,
  pipeline,
} from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3/dist/transformers.min.js';

env.allowLocalModels = false;
env.useBrowserCache = true;

const MODEL_ID = 'Xenova/bge-small-en-v1.5';

let extractor = null;

async function loadModel() {
  extractor = await pipeline('feature-extraction', MODEL_ID, {
    dtype: 'q8',
    progress_callback: (info) => {
      if (info.status === 'progress') {
        self.postMessage({ type: 'loading', progress: Math.round(info.progress) });
      }
    },
  });
  self.postMessage({ type: 'ready' });
}

async function embed(id, text) {
  if (!extractor) {
    self.postMessage({ type: 'error', message: 'Model not loaded' });
    return;
  }

  const output = await extractor(text, { pooling: 'mean', normalize: true });
  const vector = Array.from(output.data);
  self.postMessage({ type: 'embedded', id, vector });
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function search(query, topK, entries, searchSeq) {
  if (!extractor) {
    self.postMessage({ type: 'error', message: 'Model not loaded' });
    return;
  }

  const output = await extractor(query, { pooling: 'mean', normalize: true });
  const queryVector = Array.from(output.data);

  const scored = entries
    .filter((e) => e.vector && e.vector.length > 0)
    .map((e) => ({
      id: e.id,
      text: e.text,
      score: cosineSimilarity(queryVector, e.vector),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  // Echo searchSeq so the hook routes results to the correct pending resolver
  self.postMessage({ type: 'results', matches: scored, searchSeq });
}

self.addEventListener('message', async (e) => {
  const { type, id, text, query, topK, entries, searchSeq } = e.data;
  try {
    if (type === 'load') await loadModel();
    else if (type === 'embed') await embed(id, text);
    else if (type === 'search') await search(query, topK, entries, searchSeq);
  } catch (err) {
    self.postMessage({ type: 'error', message: err.message });
  }
});
