import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export const useLoadingState = (initialState: Partial<LoadingState> = {}) => {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    error: null,
    success: false,
    ...initialState
  });

  const startLoading = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true, error: null, success: false }));
  }, []);

  const stopLoading = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: false }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, isLoading: false, error, success: false }));
  }, []);

  const setSuccess = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: false, error: null, success: true }));
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, success: false });
  }, []);

  const executeAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: Error) => void
  ): Promise<T | null> => {
    try {
      startLoading();
      const result = await asyncFn();
      setSuccess();
      onSuccess?.(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
      return null;
    }
  }, [startLoading, setSuccess, setError]);

  return {
    ...state,
    startLoading,
    stopLoading,
    setError,
    setSuccess,
    reset,
    executeAsync
  };
};
