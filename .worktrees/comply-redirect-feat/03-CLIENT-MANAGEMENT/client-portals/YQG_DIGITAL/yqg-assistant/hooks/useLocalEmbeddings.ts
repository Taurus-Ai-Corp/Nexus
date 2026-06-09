'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type EmbedStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface SearchMatch {
  id: string;
  text: string;
  score: number;
}

export interface MemoryEntry {
  id: string;
  text: string;
  vector: number[];
  timestamp: number;
}

interface UseLocalEmbeddingsResult {
  status: EmbedStatus;
  embed: (id: string, text: string) => Promise<number[]>;
  search: (query: string, entries: MemoryEntry[], topK?: number) => Promise<SearchMatch[]>;
  preload: () => void;
}

/**
 * useLocalEmbeddings — browser-local sentence embeddings via bge-small-en-v1.5
 *
 * Used to embed and search memory entries stored in IndexedDB.
 * Returns normalized 384-dim vectors ready for cosine similarity.
 */
export function useLocalEmbeddings(): UseLocalEmbeddingsResult {
  const workerRef = useRef<Worker | null>(null);
  const [status, setStatus] = useState<EmbedStatus>('idle');

  // Ref mirrors state — prevents stale closure in stable callbacks
  const statusRef = useRef<EmbedStatus>('idle');

  type Resolver<T> = { resolve: (v: T) => void; reject: (e: Error) => void };
  const embedQueue = useRef<Map<string, Resolver<number[]>>>(new Map());
  // Use a Map keyed by seq so concurrent search() calls don't overwrite each other
  const searchQueue = useRef<Map<number, Resolver<SearchMatch[]>>>(new Map());
  const searchSeqRef = useRef(0);

  const setStatusBoth = useCallback((s: EmbedStatus) => {
    statusRef.current = s;
    setStatus(s);
  }, []);

  const initWorker = useCallback(() => {
    if (workerRef.current) return;

    const worker = new Worker('/yqg-embed-worker.js', { type: 'module' });
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent) => {
      const { type, progress, id, vector, matches, message, searchSeq } = e.data as {
        type: string;
        progress?: number;
        id?: string;
        vector?: number[];
        matches?: SearchMatch[];
        message?: string;
        searchSeq?: number; // echoed back for search result routing
      };

      if (type === 'loading') {
        setStatusBoth('loading');
        void progress;
      } else if (type === 'ready') {
        setStatusBoth('ready');
      } else if (type === 'embedded' && id) {
        const resolver = embedQueue.current.get(id);
        if (resolver) {
          resolver.resolve(vector ?? []);
          embedQueue.current.delete(id);
        }
      } else if (type === 'results' && searchSeq !== undefined) {
        const resolver = searchQueue.current.get(searchSeq);
        if (resolver) {
          resolver.resolve(matches ?? []);
          searchQueue.current.delete(searchSeq);
        }
      } else if (type === 'error') {
        setStatusBoth('error');
        const err = new Error(message);
        embedQueue.current.forEach((r) => r.reject(err));
        embedQueue.current.clear();
        searchQueue.current.forEach((r) => r.reject(err));
        searchQueue.current.clear();
      }
    };

    worker.onerror = (e) => {
      setStatusBoth('error');
      const err = new Error(e.message);
      embedQueue.current.forEach((r) => r.reject(err));
      embedQueue.current.clear();
      searchQueue.current.forEach((r) => r.reject(err));
      searchQueue.current.clear();
      console.error('[yqg-embed-worker]', e.message);
    };
  }, [setStatusBoth]);

  const preload = useCallback(() => {
    if (statusRef.current !== 'idle') return;
    initWorker();
    workerRef.current?.postMessage({ type: 'load' });
  }, [initWorker]);

  const embed = useCallback(
    (id: string, text: string): Promise<number[]> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          initWorker();
          workerRef.current!.postMessage({ type: 'load' });
        }
        embedQueue.current.set(id, { resolve, reject });
        const post = () => workerRef.current!.postMessage({ type: 'embed', id, text });
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
    [initWorker]
  );

  const search = useCallback(
    (query: string, entries: MemoryEntry[], topK = 5): Promise<SearchMatch[]> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          initWorker();
          workerRef.current!.postMessage({ type: 'load' });
        }
        const searchSeq = ++searchSeqRef.current;
        searchQueue.current.set(searchSeq, { resolve, reject });
        const post = () =>
          workerRef.current!.postMessage({ type: 'search', query, entries, topK, searchSeq });
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
    [initWorker]
  );

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return { status, embed, search, preload };
}
