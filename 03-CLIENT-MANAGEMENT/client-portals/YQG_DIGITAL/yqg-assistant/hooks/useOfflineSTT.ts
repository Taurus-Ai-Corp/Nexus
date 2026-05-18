'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type STTStatus = 'idle' | 'loading' | 'ready' | 'transcribing' | 'error';

interface UseOfflineSTTResult {
  status: STTStatus;
  loadProgress: number;
  transcribe: (audio: Float32Array) => Promise<string>;
  preload: () => void;
}

/**
 * useOfflineSTT — browser-local speech-to-text via distil-whisper-small.en
 *
 * The model worker is lazy-loaded on first call to preload() or transcribe().
 * Audio must be Float32Array PCM at 16kHz (standard Web Audio API format).
 */
export function useOfflineSTT(): UseOfflineSTTResult {
  const workerRef = useRef<Worker | null>(null);
  const [status, setStatus] = useState<STTStatus>('idle');
  const [loadProgress, setLoadProgress] = useState(0);

  // Ref mirrors state so stable callbacks always see current status (no stale closure)
  const statusRef = useRef<STTStatus>('idle');

  // Pending transcription resolvers keyed by sequence number
  const pendingRef = useRef<
    Map<number, { resolve: (text: string) => void; reject: (e: Error) => void }>
  >(new Map());
  const seqRef = useRef(0);

  const setStatusBoth = useCallback((s: STTStatus) => {
    statusRef.current = s;
    setStatus(s);
  }, []);

  const initWorker = useCallback(() => {
    if (workerRef.current) return;

    const worker = new Worker('/yqg-stt-worker.js', { type: 'module' });
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent) => {
      const { type, progress, text, message, seq } = e.data as {
        type: string;
        progress?: number;
        text?: string;
        message?: string;
        seq?: number; // echoed back from worker for result correlation
      };

      if (type === 'loading') {
        setLoadProgress(progress ?? 0);
        setStatusBoth('loading');
      } else if (type === 'ready') {
        setStatusBoth('ready');
        setLoadProgress(100);
      } else if (type === 'result') {
        // Use the seq echoed by the worker — not seqRef.current (which is always latest)
        if (seq !== undefined) {
          const pending = pendingRef.current.get(seq);
          if (pending) {
            pending.resolve(text ?? '');
            pendingRef.current.delete(seq);
          }
        }
        setStatusBoth('ready');
      } else if (type === 'error') {
        if (seq !== undefined) {
          const pending = pendingRef.current.get(seq);
          if (pending) {
            pending.reject(new Error(message));
            pendingRef.current.delete(seq);
          }
        }
        setStatusBoth('error');
      }
    };

    worker.onerror = (e) => {
      setStatusBoth('error');
      const err = new Error(e.message);
      pendingRef.current.forEach((r) => r.reject(err));
      pendingRef.current.clear();
      console.error('[yqg-stt-worker]', e.message);
    };
  }, [setStatusBoth]);

  const preload = useCallback(() => {
    if (statusRef.current !== 'idle') return;
    initWorker();
    workerRef.current?.postMessage({ type: 'load' });
  }, [initWorker]);

  const transcribe = useCallback(
    (audio: Float32Array): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          initWorker();
          workerRef.current!.postMessage({ type: 'load' });
        }

        const seq = ++seqRef.current;
        pendingRef.current.set(seq, { resolve, reject });
        setStatusBoth('transcribing');

        const postWhenReady = () => {
          // Include seq so the worker echoes it back in its result/error message
          workerRef.current!.postMessage({ type: 'transcribe', audio, seq });
        };

        // Use statusRef (always current) — stale closure on `status` state would
        // miss the window between worker firing 'ready' and React committing the re-render
        if (statusRef.current === 'loading' || statusRef.current === 'idle') {
          workerRef.current!.addEventListener(
            'message',
            (e) => {
              if (e.data.type === 'ready') postWhenReady();
            },
            { once: true }
          );
        } else {
          postWhenReady();
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

  return { status, loadProgress, transcribe, preload };
}
