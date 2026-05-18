/**
 * YQG Offline LLM Worker — Qwen2.5-0.5B-Instruct (q4, ONNX)
 *
 * Browser LLM fallback when the backend is unreachable.
 * ~480MB download, 20-40 TPS on WebGPU, ~5 TPS on WASM.
 *
 * Message protocol (main → worker):
 *   { type: 'load' }
 *   { type: 'generate', messages: ChatMessage[], maxTokens?: number }
 *
 * Message protocol (worker → main):
 *   { type: 'loading', progress: number }
 *   { type: 'ready' }
 *   { type: 'token', text: string }     — streaming token
 *   { type: 'done', text: string }      — full response complete
 *   { type: 'error', message: string }
 */

import {
  pipeline,
  TextStreamer,
  env,
} from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3/dist/transformers.min.js';

env.allowLocalModels = false;
env.useBrowserCache = true;

const MODEL_ID = 'onnx-community/Qwen2.5-0.5B-Instruct-ONNX';

let generator = null;

async function loadModel() {
  const opts = {
    dtype: { embed_tokens: 'fp16', lm_head: 'fp16', default: 'q4' },
    progress_callback: (info) => {
      if (info.status === 'progress') {
        self.postMessage({ type: 'loading', progress: Math.round(info.progress) });
      }
    },
  };

  try {
    generator = await pipeline('text-generation', MODEL_ID, { ...opts, device: 'webgpu' });
  } catch {
    generator = await pipeline('text-generation', MODEL_ID, { ...opts, device: 'wasm' });
  }

  self.postMessage({ type: 'ready' });
}

async function generate(messages, maxTokens = 256) {
  if (!generator) {
    self.postMessage({ type: 'error', message: 'Model not loaded' });
    return;
  }

  let fullText = '';

  const streamer = new TextStreamer(generator.tokenizer, {
    skip_prompt: true,
    skip_special_tokens: true,
    callback_function: (token) => {
      fullText += token;
      self.postMessage({ type: 'token', text: token });
    },
  });

  await generator(messages, {
    max_new_tokens: maxTokens,
    temperature: 0.7,
    do_sample: true,
    streamer,
  });

  self.postMessage({ type: 'done', text: fullText });
}

self.addEventListener('message', async (e) => {
  const { type, messages, maxTokens } = e.data;
  try {
    if (type === 'load') await loadModel();
    else if (type === 'generate') await generate(messages, maxTokens);
  } catch (err) {
    self.postMessage({ type: 'error', message: err.message });
  }
});
