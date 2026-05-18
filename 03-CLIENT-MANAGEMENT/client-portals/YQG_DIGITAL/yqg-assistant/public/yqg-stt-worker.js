/**
 * YQG Offline STT Worker — distil-whisper/distil-small.en
 *
 * Runs in a Web Worker so Whisper inference never blocks the main thread.
 * Model: 300MB, English-only, ~6× faster than whisper-base.
 *
 * Message protocol (main → worker):
 *   { type: 'load' }                                    — download & cache model
 *   { type: 'transcribe', audio: Float32Array, seq: number } — transcribe PCM audio
 *
 * Message protocol (worker → main):
 *   { type: 'loading', progress: number }       — download progress 0-100
 *   { type: 'ready' }                           — model loaded, ready to transcribe
 *   { type: 'result', text: string, seq: number } — transcription complete (seq echoed)
 *   { type: 'error', message: string, seq: number } — something went wrong (seq echoed)
 */
import {
  env,
  pipeline,
} from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3/dist/transformers.min.js';

env.allowLocalModels = false;
env.useBrowserCache = true;

const MODEL_ID = 'onnx-community/distil-whisper-distil-small.en';

let transcriber = null;

async function loadModel() {
  try {
    transcriber = await pipeline('automatic-speech-recognition', MODEL_ID, {
      dtype: 'q8',
      device: 'webgpu',
      progress_callback: (info) => {
        if (info.status === 'progress') {
          self.postMessage({ type: 'loading', progress: Math.round(info.progress) });
        }
      },
    });
  } catch {
    // WebGPU unavailable — fall back to WASM
    transcriber = await pipeline('automatic-speech-recognition', MODEL_ID, {
      dtype: 'q8',
      device: 'wasm',
      progress_callback: (info) => {
        if (info.status === 'progress') {
          self.postMessage({ type: 'loading', progress: Math.round(info.progress) });
        }
      },
    });
  }

  self.postMessage({ type: 'ready' });
}

async function transcribe(audio, seq) {
  if (!transcriber) {
    self.postMessage({ type: 'error', message: 'Model not loaded', seq });
    return;
  }

  const result = await transcriber(audio, {
    chunk_length_s: 30,
    stride_length_s: 5,
    language: 'english',
    task: 'transcribe',
  });

  const text = Array.isArray(result) ? result.map((r) => r.text).join(' ') : result.text;
  // Echo seq back so the hook can route the result to the correct pending resolver
  self.postMessage({ type: 'result', text: text.trim(), seq });
}

self.addEventListener('message', async (e) => {
  const { type, audio, seq } = e.data;
  try {
    if (type === 'load') await loadModel();
    else if (type === 'transcribe') await transcribe(audio, seq);
  } catch (err) {
    self.postMessage({ type: 'error', message: err.message, seq });
  }
});
