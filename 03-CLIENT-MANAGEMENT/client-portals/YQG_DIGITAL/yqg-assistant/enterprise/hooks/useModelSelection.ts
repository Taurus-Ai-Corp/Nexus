'use client';

import { useCallback, useEffect, useState } from 'react';
import { MODEL_IDS, ModelId } from '@/enterprise/components/model-selector';

const STORAGE_KEY = 'yqg-enterprise-model';
const DEFAULT_MODEL: ModelId = 'anthropic-sonnet';

/**
 * Persists the selected LLM model in localStorage so the user's choice
 * survives page refreshes.
 */
export function useModelSelection() {
  const [selectedModel, setSelectedModel] = useState<ModelId>(DEFAULT_MODEL);

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  // Validates against the current MODELS list so stale/unknown values fall back to default.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ModelId | null;
    if (stored && (MODEL_IDS as readonly string[]).includes(stored)) {
      setSelectedModel(stored);
    }
  }, []);

  const changeModel = useCallback((model: ModelId) => {
    setSelectedModel((prev) => {
      if (prev === model) return prev;
      localStorage.setItem(STORAGE_KEY, model);
      return model;
    });
  }, []);

  return { selectedModel, changeModel };
}
