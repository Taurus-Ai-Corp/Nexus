'use client';

import { useEffect, useState } from 'react';

// Brand palette — cyan for ready, amber for in-progress
const CYAN = {
  border: 'rgba(217,179,119,0.4)',
  text: 'rgba(217,179,119,0.9)',
  bg: 'rgba(217,179,119,0.06)',
};
const AMBER = {
  border: 'rgba(255,165,0,0.4)',
  text: 'rgba(255,165,0,0.9)',
  bg: 'rgba(255,165,0,0.06)',
};

interface OfflineIndicatorProps {
  /** Whether any offline AI model is currently loading */
  isLoading?: boolean;
  /** Current download progress (0-100) */
  loadProgress?: number;
  /** Which model is loading */
  modelName?: string;
}

/**
 * OfflineIndicator — shows browser AI status in the corner of the UI.
 *
 * Displays:
 *   - When online: nothing (hidden)
 *   - When offline: "OFFLINE MODE" badge with model loading progress
 *   - When model ready offline: "AI READY OFFLINE" confirmation
 */
export function OfflineIndicator({
  isLoading,
  loadProgress = 0,
  modelName,
}: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Don't show anything when online and not loading
  if (isOnline && !isLoading) return null;

  const label = isLoading
    ? `Loading${modelName ? ` ${modelName}` : ' offline AI'}…`
    : 'AI ready offline';

  return (
    <div
      className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col items-end gap-1"
      aria-live="polite"
      aria-label={label}
    >
      <div
        className="flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] tracking-widest uppercase"
        style={{
          borderColor: (isLoading ? AMBER : CYAN).border,
          color: (isLoading ? AMBER : CYAN).text,
          background: (isLoading ? AMBER : CYAN).bg,
        }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background: (isLoading ? AMBER : CYAN).text,
            animation: isLoading ? 'pulse 1s ease-in-out infinite' : 'none',
          }}
        />
        {isLoading ? `${label} ${loadProgress}%` : label}
      </div>

      {isLoading && (
        <div
          className="h-0.5 w-32 overflow-hidden rounded-full"
          style={{ background: 'rgba(255,165,0,0.15)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${loadProgress}%`,
              background: 'rgba(255,165,0,0.7)',
            }}
          />
        </div>
      )}
    </div>
  );
}
