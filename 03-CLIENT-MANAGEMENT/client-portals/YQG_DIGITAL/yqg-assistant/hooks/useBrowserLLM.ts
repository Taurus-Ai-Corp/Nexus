'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type LLMStatus = 'idle' | 'loading' | 'ready' | 'generating' | 'error';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface UseBrowserLLMResult {
  status: LLMStatus;
  loadProgress: number;
  generate: (
    messages: ChatMessage[],
    maxTokens?: number,
    onToken?: (token: string) => void
  ) => Promise<string>;
  preload: () => void;
}

const OFFLINE_SYSTEM_PROMPT = `You are an AI assistant, a concise voice assistant.
Respond in 1-3 short sentences. Be direct and helpful.
You are running offline in the user's browser.`;

/**
 * useBrowserLLM — Qwen2.5-0.5B-Instruct in-browser LLM fallback
 *
 * Used when the backend is unreachable (offline mode).
 * Streams tokens back to the caller for low-latency UX.
 */
export function useBrowserLLM(): UseBrowserLLMResult {
  const workerRef = useRef<Worker | null>(null);
  const [status, setStatus] = useState<LLMStatus>('idle');
  const [loadProgress, setLoadProgress] = useState(0);

  // Ref mirrors state — prevents stale closure in stable callbacks
  const statusRef = useRef<LLMStatus>('idle');

  type Resolver = {
    resolve: (text: string) => void;
    reject: (e: Error) => void;
    onToken?: (t: string) => void;
  };
  const pendingRef = useRef<Resolver | null>(null);

  const setStatusBoth = useCallback((s: LLMStatus) => {
    statusRef.current = s;
    setStatus(s);
  }, []);

  const initWorker = useCallback(() => {
    if (workerRef.current) return;

    const worker = new Worker('/yqg-llm-worker.js', { type: 'module' });
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent) => {
      const { type, progress, text, message } = e.data as {
        type: string;
        progress?: number;
        text?: string;
        message?: string;
      };

      if (type === 'loading') {
        setLoadProgress(progress ?? 0);
        setStatusBoth('loading');
      } else if (type === 'ready') {
        setStatusBoth('ready');
        setLoadProgress(100);
      } else if (type === 'token') {
        pendingRef.current?.onToken?.(text ?? '');
      } else if (type === 'done') {
        const resolver = pendingRef.current;
        pendingRef.current = null;
        setStatusBoth('ready');
        resolver?.resolve(text ?? '');
      } else if (type === 'error') {
        setStatusBoth('error');
        const resolver = pendingRef.current;
        pendingRef.current = null;
        resolver?.reject(new Error(message));
      }
    };

    worker.onerror = (e) => {
      setStatusBoth('error');
      const resolver = pendingRef.current;
      pendingRef.current = null;
      resolver?.reject(new Error(e.message));
      console.error('[yqg-llm-worker]', e.message);
    };
  }, [setStatusBoth]);

  const preload = useCallback(() => {
    if (statusRef.current !== 'idle') return;
    initWorker();
    workerRef.current?.postMessage({ type: 'load' });
  }, [initWorker]);

  const generate = useCallback(
    (
      messages: ChatMessage[],
      maxTokens = 256,
      onToken?: (token: string) => void
    ): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          initWorker();
          workerRef.current!.postMessage({ type: 'load' });
        }

        pendingRef.current = { resolve, reject, onToken };
        setStatusBoth('generating');

        const withSystem: ChatMessage[] = [
          { role: 'system', content: OFFLINE_SYSTEM_PROMPT },
          ...messages,
        ];

        const post = () =>
          workerRef.current!.postMessage({ type: 'generate', messages: withSystem, maxTokens });

        if (statusRef.current === 'ready') {
          post();
        } else {
          workerRef.current!.addEventListener(
            'message',
            (e) => {
              if (e.data.type === 'ready') post();
            },
            { once: true }
          );
        }
      });
    },
    [initWorker, setStatusBoth]
  );

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return { status, loadProgress, generate, preload };
}
