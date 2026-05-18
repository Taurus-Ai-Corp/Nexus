'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * OfflineModelLoader — "Neural Initialization Protocol"
 *
 * Retro-terminal panel showing download + readiness of all three offline AI
 * subsystems (STT, Embeddings, LLM). Appears when offline or when user
 * preloads models for air-gap operation.
 *
 * Design: commit-mono font · scan-line backdrop · hex badges ·
 *         amber→cyan status transitions · staggered reveal animation
 */

// ── Types ──────────────────────────────────────────────────────────────────

type ModuleStatus = 'standby' | 'initializing' | 'online' | 'error';

interface OfflineModule {
  id: 'stt' | 'embed' | 'llm';
  label: string;
  model: string;
  size: string;
  status: ModuleStatus;
  progress: number; // 0-100
}

export interface OfflineModelLoaderProps {
  sttStatus?: ModuleStatus;
  sttProgress?: number;
  embedStatus?: ModuleStatus;
  embedProgress?: number;
  llmStatus?: ModuleStatus;
  llmProgress?: number;
  onPreloadAll?: () => void;
  /** If true, render as a compact corner pill instead of full panel */
  compact?: boolean;
}

// ── Sub-components ──────────────────────────────────────────────────────────

function HexBadge({ status }: { status: ModuleStatus }) {
  const colors: Record<ModuleStatus, string> = {
    standby: '#3a3a4a',
    initializing: '#ff8c00',
    online: '#d9b377',
    error: '#ff4444',
  };
  const color = colors[status];
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
      <polygon
        points="10,1 18,5.5 18,14.5 10,19 2,14.5 2,5.5"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity={status === 'standby' ? 0.3 : 1}
      />
      {status === 'online' && <circle cx="10" cy="10" r="3" fill={color} />}
      {status === 'initializing' && (
        <circle
          cx="10"
          cy="10"
          r="2.5"
          fill={color}
          style={{ animation: 'nx-pulse 0.8s ease-in-out infinite' }}
        />
      )}
      {status === 'error' && (
        <text x="10" y="14" textAnchor="middle" fontSize="10" fill={color} fontFamily="monospace">
          !
        </text>
      )}
      {status === 'standby' && <circle cx="10" cy="10" r="2" fill="#3a3a4a" />}
    </svg>
  );
}

function ProgressBar({ progress, status }: { progress: number; status: ModuleStatus }) {
  const isActive = status === 'initializing';
  const isOnline = status === 'online';
  const barColor = isOnline ? '#d9b377' : '#ff8c00';

  return (
    <div
      style={{
        height: '2px',
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '1px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${isOnline ? 100 : progress}%`,
          background: barColor,
          borderRadius: '1px',
          transition: 'width 0.3s ease, background 0.6s ease',
          boxShadow: isOnline ? `0 0 8px ${barColor}` : undefined,
        }}
      />
      {isActive && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '30%',
            background: 'linear-gradient(90deg, transparent, rgba(255,140,0,0.6), transparent)',
            animation: 'nx-scan 1.4s linear infinite',
          }}
        />
      )}
    </div>
  );
}

function ModuleRow({ mod, delay }: { mod: OfflineModule; delay: number }) {
  const statusLabel: Record<ModuleStatus, string> = {
    standby: 'STANDBY',
    initializing: 'INITIALIZING',
    online: 'ONLINE',
    error: 'FAULT',
  };
  const statusColor: Record<ModuleStatus, string> = {
    standby: 'rgba(255,255,255,0.2)',
    initializing: '#ff8c00',
    online: '#d9b377',
    error: '#ff4444',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        animation: `nx-reveal 0.4s ease forwards`,
        animationDelay: `${delay}ms`,
        opacity: 0,
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HexBadge status={mod.status} />
          <div>
            <div
              style={{
                fontFamily: "'Commit Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: statusColor[mod.status],
                fontWeight: 400,
              }}
            >
              {mod.label}
            </div>
            <div
              style={{
                fontFamily: "'Commit Mono', monospace",
                fontSize: '9px',
                color: 'rgba(255,255,255,0.25)',
                letterSpacing: '0.06em',
                marginTop: '1px',
              }}
            >
              {mod.model} · {mod.size}
            </div>
          </div>
        </div>
        <div
          style={{
            fontFamily: "'Commit Mono', monospace",
            fontSize: '9px',
            letterSpacing: '0.14em',
            color: statusColor[mod.status],
            opacity: 0.9,
          }}
        >
          {mod.status === 'initializing' ? `${mod.progress}%` : statusLabel[mod.status]}
        </div>
      </div>

      {/* Progress bar */}
      <ProgressBar progress={mod.progress} status={mod.status} />
    </div>
  );
}

// ── Scan-line grid backdrop ──────────────────────────────────────────────────

function GridBackdrop() {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        borderRadius: 'inherit',
      }}
    >
      {/* Horizontal scan lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(217,179,119,0.015) 3px, rgba(217,179,119,0.015) 4px)',
        }}
      />
      {/* Moving horizontal beam */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(217,179,119,0.15), transparent)',
          animation: 'nx-beam 4s linear infinite',
        }}
      />
    </div>
  );
}

// ── Data stream ticker ───────────────────────────────────────────────────────

const TICKER_CHARS = '0123456789ABCDEF·';
function DataTicker() {
  const [chars, setChars] = useState('');
  useEffect(() => {
    const gen = () =>
      Array.from(
        { length: 32 },
        () => TICKER_CHARS[Math.floor(Math.random() * TICKER_CHARS.length)]
      ).join(' ');
    setChars(gen());
    const id = setInterval(() => setChars(gen()), 200);
    return () => clearInterval(id);
  }, []);
  return (
    <div
      style={{
        fontFamily: "'Commit Mono', monospace",
        fontSize: '8px',
        letterSpacing: '0.1em',
        color: 'rgba(217,179,119,0.12)',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'clip',
        marginTop: '4px',
      }}
      aria-hidden
    >
      {chars}
    </div>
  );
}

// ── Keyframe injection ───────────────────────────────────────────────────────

const KEYFRAMES = `
  @keyframes nx-pulse { 0%,100%{opacity:1;r:2.5} 50%{opacity:0.4;r:1.5} }
  @keyframes nx-scan  { from{left:-30%} to{left:130%} }
  @keyframes nx-beam  { 0%{top:-2px;opacity:0} 10%{opacity:1} 90%{opacity:0.6} 100%{top:calc(100% + 2px);opacity:0} }
  @keyframes nx-reveal { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
  @keyframes nx-glow  { 0%,100%{box-shadow:0 0 12px rgba(217,179,119,0.2),inset 0 0 20px rgba(217,179,119,0.03)} 50%{box-shadow:0 0 24px rgba(217,179,119,0.35),inset 0 0 30px rgba(217,179,119,0.06)} }
`;

// ── Main component ───────────────────────────────────────────────────────────

export function OfflineModelLoader({
  sttStatus = 'standby',
  sttProgress = 0,
  embedStatus = 'standby',
  embedProgress = 0,
  llmStatus = 'standby',
  llmProgress = 0,
  onPreloadAll,
  compact = false,
}: OfflineModelLoaderProps) {
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (styleRef.current) return;
    const el = document.createElement('style');
    el.textContent = KEYFRAMES;
    document.head.appendChild(el);
    styleRef.current = el;
    return () => el.remove();
  }, []);

  const modules: OfflineModule[] = [
    {
      id: 'stt',
      label: 'Speech Recognition',
      model: 'distil-whisper-small.en',
      size: '300MB',
      status: sttStatus,
      progress: sttProgress,
    },
    {
      id: 'embed',
      label: 'Vector Embeddings',
      model: 'bge-small-en-v1.5',
      size: '66MB',
      status: embedStatus,
      progress: embedProgress,
    },
    {
      id: 'llm',
      label: 'Language Model',
      model: 'Qwen2.5-0.5B-Instruct',
      size: '480MB',
      status: llmStatus,
      progress: llmProgress,
    },
  ];

  const allOnline = modules.every((m) => m.status === 'online');
  const anyInitializing = modules.some((m) => m.status === 'initializing');
  const onlineCount = modules.filter((m) => m.status === 'online').length;

  // Compact pill for corner display
  if (compact) {
    const color = allOnline ? '#d9b377' : anyInitializing ? '#ff8c00' : 'rgba(255,255,255,0.25)';
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '999px',
          border: `1px solid ${color}`,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          fontFamily: "'Commit Mono', monospace",
          fontSize: '9px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color,
        }}
      >
        <span
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: color,
            animation: anyInitializing ? 'nx-pulse 0.8s ease-in-out infinite' : 'none',
            flexShrink: 0,
          }}
        />
        {allOnline
          ? 'AI Offline Ready'
          : anyInitializing
            ? `Loading… ${onlineCount}/3`
            : 'Offline AI'}
      </div>
    );
  }

  // Full panel
  return (
    <div
      role="status"
      aria-label="Offline AI System Status"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '340px',
        background: 'rgba(4,6,20,0.92)',
        border: '1px solid rgba(217,179,119,0.15)',
        borderRadius: '6px',
        overflow: 'hidden',
        backdropFilter: 'blur(16px)',
        animation: allOnline ? 'nx-glow 3s ease-in-out infinite' : undefined,
      }}
    >
      <GridBackdrop />

      {/* Header */}
      <div
        style={{
          padding: '14px 16px 10px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Corner bracket decoration */}
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
              <path d="M0 6V0H6" stroke="#d9b377" strokeWidth="1.5" fill="none" opacity="0.6" />
            </svg>
            <span
              style={{
                fontFamily: "'Commit Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(217,179,119,0.8)',
              }}
            >
              Neural Subsystems
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Commit Mono', monospace",
              fontSize: '9px',
              letterSpacing: '0.12em',
              color: allOnline ? '#d9b377' : 'rgba(255,255,255,0.2)',
              textTransform: 'uppercase',
            }}
          >
            {onlineCount}/{modules.length} online
          </span>
        </div>
        <DataTicker />
      </div>

      {/* Module rows */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {modules.map((mod, i) => (
          <ModuleRow key={mod.id} mod={mod} delay={i * 80} />
        ))}
      </div>

      {/* Footer CTA */}
      {!allOnline && !anyInitializing && onPreloadAll && (
        <div
          style={{
            padding: '0 16px 14px',
          }}
        >
          <button
            onClick={onPreloadAll}
            style={{
              width: '100%',
              padding: '8px',
              background: 'rgba(217,179,119,0.06)',
              border: '1px solid rgba(217,179,119,0.2)',
              borderRadius: '4px',
              fontFamily: "'Commit Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(217,179,119,0.7)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(217,179,119,0.12)';
              (e.currentTarget as HTMLButtonElement).style.color = '#d9b377';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(217,179,119,0.06)';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(217,179,119,0.7)';
            }}
          >
            Initialize Offline Mode
          </button>
        </div>
      )}

      {/* All online celebration strip */}
      {allOnline && (
        <div
          style={{
            padding: '8px 16px',
            borderTop: '1px solid rgba(217,179,119,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden>
            <circle cx="4" cy="4" r="3" fill="#d9b377" />
          </svg>
          <span
            style={{
              fontFamily: "'Commit Mono', monospace",
              fontSize: '9px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#d9b377',
            }}
          >
            Air-gap ready · All systems online
          </span>
        </div>
      )}
    </div>
  );
}
