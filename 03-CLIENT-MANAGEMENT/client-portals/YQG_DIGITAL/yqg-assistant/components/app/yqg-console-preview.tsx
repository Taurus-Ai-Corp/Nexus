'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

/**
 * YQG Agency Console Preview
 *
 * Static "live-looking" panel that sits to the right of the hero on desktop,
 * fills dead space, and telegraphs capabilities before Tim clicks Talk.
 *
 * Pattern lifted from ElevenLabs + Deepgram — frozen transcript, staggered
 * opacity-in on mount, ambient cursor blink. No network cost, no inference.
 */

type Tab = 'proposals' | 'seo' | 'competitor';

const TABS: { key: Tab; label: string }[] = [
  { key: 'proposals', label: 'Proposals' },
  { key: 'seo', label: 'SEO audit' },
  { key: 'competitor', label: 'Competitor teardown' },
];

const TRANSCRIPT: { who: 'user' | 'agent'; t: string; body: string }[] = [
  {
    who: 'user',
    t: '0:00',
    body: 'Draft a proposal for a Windsor plumber, five-thousand budget. Two-week timeline. They are north of EC Row.',
  },
  {
    who: 'agent',
    t: '0:04',
    body: 'Got it. Five-page WordPress build, local SEO for "plumber Windsor" and "Tecumseh plumber," GBP optimization, review funnel setup. Scoping it at forty-eight hundred, delivered in ten business days. Want me to drop the draft into your Client Proposals folder?',
  },
  {
    who: 'user',
    t: '0:18',
    body: "Yeah. Also — who's ranking one and two for 'Windsor plumber' right now, and what are they doing that we aren't?",
  },
  {
    who: 'agent',
    t: '0:22',
    body: 'Pulling it live. Number one is Lakeshore Plumbing — eight-hundred GBP reviews, service pages per Essex town, schema on pricing. Number two is Aqua-Tech — lighter on reviews but running Google LSAs. Your gap: review velocity and town-specific landing pages. I can bake both in, still under budget.',
  },
];

const DETECTED_CHIPS = [
  'Competitors: 3',
  'Budget: $4,800',
  'Timeline: 10 days',
  'Windsor-local SEO',
];

export function YqgConsolePreview() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('proposals');
  useEffect(() => {
    setMounted(true);
  }, []);
  const { resolvedTheme } = useTheme();
  const light = mounted && resolvedTheme === 'light';

  const c = light
    ? {
        bg: 'rgba(250, 246, 236, 0.7)',
        border: 'rgba(184, 138, 61, 0.22)',
        barBg: 'rgba(184, 138, 61, 0.08)',
        barBorder: 'rgba(184, 138, 61, 0.18)',
        tabIdle: 'rgba(90, 66, 24, 0.55)',
        tabActive: '#5a4218',
        tabActiveBg: 'rgba(184, 138, 61, 0.18)',
        userBubbleBg: 'rgba(10, 32, 64, 0.04)',
        userBubbleBorder: 'rgba(10, 32, 64, 0.12)',
        userText: '#0a2040',
        agentBubbleBg: 'rgba(184, 138, 61, 0.10)',
        agentBubbleBorder: 'rgba(184, 138, 61, 0.22)',
        agentText: '#3a2a0e',
        timecode: 'rgba(90, 66, 24, 0.45)',
        chip: 'rgba(90, 66, 24, 0.7)',
        chipBg: 'rgba(184, 138, 61, 0.08)',
        chipBorder: 'rgba(184, 138, 61, 0.20)',
        dot: '#0099cc',
        labelDim: 'rgba(90, 66, 24, 0.5)',
        cursor: '#8a6628',
      }
    : {
        bg: 'rgba(22, 20, 17, 0.55)',
        border: 'rgba(217, 179, 119, 0.14)',
        barBg: 'rgba(217, 179, 119, 0.05)',
        barBorder: 'rgba(217, 179, 119, 0.12)',
        tabIdle: 'rgba(217, 179, 119, 0.4)',
        tabActive: '#f0cf95',
        tabActiveBg: 'rgba(217, 179, 119, 0.14)',
        userBubbleBg: 'rgba(137, 195, 255, 0.06)',
        userBubbleBorder: 'rgba(137, 195, 255, 0.18)',
        userText: 'rgba(215, 230, 250, 0.92)',
        agentBubbleBg: 'rgba(217, 179, 119, 0.06)',
        agentBubbleBorder: 'rgba(217, 179, 119, 0.18)',
        agentText: 'rgba(240, 236, 224, 0.90)',
        timecode: 'rgba(217, 179, 119, 0.45)',
        chip: 'rgba(217, 179, 119, 0.75)',
        chipBg: 'rgba(217, 179, 119, 0.06)',
        chipBorder: 'rgba(217, 179, 119, 0.18)',
        dot: '#5bc78a',
        labelDim: 'rgba(217, 179, 119, 0.38)',
        cursor: '#d9b377',
      };

  return (
    <div
      className="relative flex w-full flex-col overflow-hidden rounded-xl border backdrop-blur-sm"
      style={{
        background: c.bg,
        borderColor: c.border,
        maxWidth: '620px',
        minHeight: '560px',
      }}
      aria-label="Example call preview"
    >
      {/* Top bar — live indicator + tabs */}
      <div
        className="flex items-center justify-between border-b px-4 py-3"
        style={{ borderColor: c.barBorder, background: c.barBg }}
      >
        <div className="flex items-center gap-2">
          <span
            className="size-1.5 rounded-full"
            style={{
              background: c.dot,
              boxShadow: `0 0 6px ${c.dot}`,
              animation: 'yqg-dot-blink 1.8s ease-in-out infinite',
            }}
          />
          <span
            className="font-mono text-[9px] tracking-[0.2em] uppercase"
            style={{ color: c.labelDim }}
          >
            Example call · Preview
          </span>
        </div>
        <div className="font-mono text-[9px] tracking-[0.15em] uppercase" style={{ color: c.labelDim }}>
          agent · v0
        </div>
      </div>

      {/* Tab row */}
      <div
        className="flex gap-1 border-b px-3 py-2"
        style={{ borderColor: c.barBorder }}
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="rounded-md px-2.5 py-1.5 font-mono text-[10px] tracking-[0.08em] uppercase transition-all duration-150"
            style={{
              color: activeTab === t.key ? c.tabActive : c.tabIdle,
              background: activeTab === t.key ? c.tabActiveBg : 'transparent',
              fontWeight: activeTab === t.key ? 600 : 500,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Transcript */}
      <div className="flex flex-1 flex-col gap-3 overflow-hidden px-5 py-4">
        {TRANSCRIPT.map((msg, i) => (
          <div
            key={i}
            className="flex flex-col gap-1"
            style={{
              opacity: 0,
              animation: mounted
                ? `yqg-transcript-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.3 + i * 0.5}s both`
                : undefined,
            }}
          >
            {/* label row */}
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-[9px] tracking-[0.15em] uppercase"
                style={{
                  color: msg.who === 'user' ? c.userText : c.tabActive,
                  opacity: 0.7,
                }}
              >
                {msg.who === 'user' ? 'Caller · Tim' : 'YQG Assistant'}
              </span>
              <span
                className="font-mono text-[9px] tracking-[0.05em]"
                style={{ color: c.timecode }}
              >
                {msg.t}
              </span>
            </div>

            {/* message bubble */}
            <div
              className="rounded-lg border px-3 py-2 text-[13px] leading-[1.5]"
              style={{
                background: msg.who === 'user' ? c.userBubbleBg : c.agentBubbleBg,
                borderColor: msg.who === 'user' ? c.userBubbleBorder : c.agentBubbleBorder,
                color: msg.who === 'user' ? c.userText : c.agentText,
                maxWidth: '92%',
                alignSelf: msg.who === 'user' ? 'flex-start' : 'flex-end',
              }}
            >
              {msg.body}
              {/* cursor on final agent message */}
              {i === TRANSCRIPT.length - 1 && msg.who === 'agent' && (
                <span
                  className="ml-0.5 inline-block h-[1em] w-[2px] align-middle"
                  style={{
                    background: c.cursor,
                    animation: 'yqg-cursor-blink 1s steps(2) infinite',
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detected chips row */}
      <div
        className="flex flex-wrap gap-1.5 border-t px-4 py-3"
        style={{ borderColor: c.barBorder, background: c.barBg }}
      >
        {DETECTED_CHIPS.map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[9px] tracking-[0.08em] uppercase"
            style={{
              color: c.chip,
              background: c.chipBg,
              borderColor: c.chipBorder,
            }}
          >
            {chip}
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes yqg-transcript-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes yqg-cursor-blink {
          0%, 100% { opacity: 0.9; }
          50%      { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
