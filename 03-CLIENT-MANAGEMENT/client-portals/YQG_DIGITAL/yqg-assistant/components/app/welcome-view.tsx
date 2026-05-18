'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import type { ModelId } from '@/enterprise/components/model-selector';
import { ModelSelector } from '@/enterprise/components/model-selector';
import { YqgConsolePreview } from '@/components/app/yqg-console-preview';

/* ── Animated hexagonal YQG icon ─────────────────────────────────────── */
function NexusIcon() {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ animation: 'yqg-float 5s ease-in-out infinite' }}
    >
      {/* Outer hexagonal ring — slow rotation */}
      <g
        style={{ transformOrigin: '40px 40px', animation: 'yqg-hex-rotate 24s linear infinite' }}
      >
        <path
          d="M40 4L70.31 21.5V56.5L40 74L9.69 56.5V21.5L40 4Z"
          stroke="url(#yqg-outer-grad)"
          strokeWidth="1"
          opacity="0.25"
        />
      </g>

      {/* Inner hexagonal ring */}
      <path
        d="M40 16L58.56 27V49L40 60L21.44 49V27L40 16Z"
        stroke="url(#yqg-gradient)"
        strokeWidth="2"
      />

      {/* Center N letterform */}
      <path
        d="M30 46V30L40 42V30M40 42L50 30V46"
        stroke="url(#yqg-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Pulse dots at vertices */}
      <circle cx="40" cy="16" r="2.5" fill="url(#yqg-gradient)" />
      <circle
        cx="58.56"
        cy="27"
        r="2"
        fill="url(#yqg-gradient)"
        style={{ animation: 'yqg-dot-blink 3s ease-in-out 0.5s infinite' }}
      />
      <circle
        cx="58.56"
        cy="49"
        r="2"
        fill="url(#yqg-gradient)"
        style={{ animation: 'yqg-dot-blink 3s ease-in-out 1s infinite' }}
      />
      <circle cx="40" cy="60" r="2.5" fill="url(#yqg-gradient)" />
      <circle
        cx="21.44"
        cy="49"
        r="2"
        fill="url(#yqg-gradient)"
        style={{ animation: 'yqg-dot-blink 3s ease-in-out 1.5s infinite' }}
      />
      <circle
        cx="21.44"
        cy="27"
        r="2"
        fill="url(#yqg-gradient)"
        style={{ animation: 'yqg-dot-blink 3s ease-in-out 2s infinite' }}
      />

      <defs>
        <linearGradient
          id="yqg-gradient"
          x1="20"
          y1="16"
          x2="60"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#d9b377" />
          <stop offset="1" stopColor="#b88a3d" />
        </linearGradient>
        <linearGradient
          id="yqg-outer-grad"
          x1="9"
          y1="4"
          x2="71"
          y2="74"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#d9b377" />
          <stop offset="1" stopColor="#b88a3d" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Decorative background hexagons ─────────────────────────────────────── */
function HexGrid({ light = false }: { light?: boolean }) {
  const hexes = [
    { x: 8, y: 15, size: 28, opacity: 0.04, delay: '0s' },
    { x: 85, y: 8, size: 20, opacity: 0.03, delay: '1.2s' },
    { x: 92, y: 72, size: 36, opacity: 0.035, delay: '2.4s' },
    { x: 5, y: 80, size: 24, opacity: 0.03, delay: '0.6s' },
    { x: 50, y: 4, size: 16, opacity: 0.025, delay: '1.8s' },
    { x: 15, y: 50, size: 14, opacity: 0.02, delay: '3s' },
    { x: 78, y: 42, size: 12, opacity: 0.02, delay: '0.9s' },
  ];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {hexes.map((h, i) => (
        <svg
          key={i}
          width={h.size}
          height={h.size}
          viewBox="0 0 40 40"
          fill="none"
          className="absolute"
          style={{
            left: `${h.x}%`,
            top: `${h.y}%`,
            opacity: light ? h.opacity * 4 : h.opacity,
            animation: `yqg-float ${5 + i * 0.7}s ease-in-out ${h.delay} infinite`,
          }}
        >
          <path
            d="M20 2L36.16 11V29L20 38L3.84 29V11L20 2Z"
            stroke={light ? '#b88a3d' : '#d9b377'}
            strokeWidth="1.5"
          />
        </svg>
      ))}
    </div>
  );
}

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
  selectedModel: ModelId;
  changeModel: (model: ModelId) => void;
}

export const WelcomeView = ({
  startButtonText,
  onStartCall,
  selectedModel,
  changeModel,
  ref,
}: React.ComponentProps<'div'> & WelcomeViewProps) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const { resolvedTheme } = useTheme();
  const light = mounted && resolvedTheme === 'light';

  // ── Neon palette — switches between dark obsidian and bright-neon light ──
  const c = light
    ? {
        pageBg: 'linear-gradient(160deg, #e8f4ff 0%, #f0faff 50%, #e0f0ff 100%)',
        glowBg:
          'radial-gradient(circle, rgba(184,138,61,0.22) 0%, rgba(217,179,119,0.10) 40%, transparent 70%)',
        badgeBorder: 'rgba(184, 138, 61, 0.55)',
        badgeBg: 'rgba(184, 138, 61, 0.12)',
        badgeDot: '#b88a3d',
        badgeDotGlow: '0 0 8px rgba(184, 138, 61, 0.9), 0 0 14px rgba(217, 179, 119, 0.5)',
        badgeText: '#8a6628',
        ringA: 'rgba(184, 138, 61, 0.35)',
        ringB: 'rgba(217, 179, 119, 0.28)',
        ringC: 'rgba(184, 138, 61, 0.20)',
        iconGlow:
          'radial-gradient(circle, rgba(184,138,61,0.18) 0%, rgba(217,179,119,0.08) 60%, transparent 100%)',
        headingGrad: 'linear-gradient(135deg, #5a4218 20%, #8a6628 55%, #d9b377 100%)',
        subtitle: '#0080cc',
        bodyText: '#0a2040',
        ctaBorder: '#b88a3d',
        ctaColor: '#5a4218',
        ctaBg: 'rgba(184, 138, 61, 0.13)',
        ctaShadow: '0 0 24px rgba(184, 138, 61, 0.35), 0 2px 8px rgba(138, 102, 40, 0.20)',
        ctaHoverBg: 'rgba(184, 138, 61, 0.25)',
        ctaHoverBorder: '#8a6628',
        ctaHoverShadow: '0 0 40px rgba(184, 138, 61, 0.50), inset 0 0 20px rgba(217, 179, 119, 0.12)',
        ctaHoverColor: '#2a1f0c',
        githubLink: '#0055aa',
        trustStrip: '#0077bb',
        footerText: '#004488',
        footerBrand: '#003366',
        footerLink: '#0077cc',
        divLine: 'linear-gradient(90deg, transparent, rgba(184,138,61,0.45))',
        divLineR: 'linear-gradient(90deg, rgba(184,138,61,0.45), transparent)',
        scanline:
          'linear-gradient(90deg, transparent 0%, rgba(184,138,61,0.25) 20%, rgba(217,179,119,0.45) 50%, rgba(184,138,61,0.25) 80%, transparent 100%)',
      }
    : {
        pageBg: 'transparent',
        glowBg:
          'radial-gradient(circle, rgba(217,179,119,0.10) 0%, rgba(217,179,119,0.04) 40%, transparent 70%)',
        badgeBorder: 'rgba(217, 179, 119, 0.2)',
        badgeBg: 'rgba(217, 179, 119, 0.04)',
        badgeDot: '#d9b377',
        badgeDotGlow: '0 0 6px rgba(217, 179, 119, 0.8)',
        badgeText: 'rgba(217, 179, 119, 0.7)',
        ringA: 'rgba(217, 179, 119, 0.12)',
        ringB: 'rgba(184, 138, 61, 0.10)',
        ringC: 'rgba(217, 179, 119, 0.08)',
        iconGlow: 'radial-gradient(circle, rgba(217,179,119,0.08) 0%, transparent 70%)',
        headingGrad: 'linear-gradient(135deg, #f0ece0 30%, rgba(240,236,224,0.6) 100%)',
        subtitle: 'rgba(217, 179, 119, 0.55)',
        bodyText: 'rgba(240, 236, 224, 0.62)',
        ctaBorder: '#d9b377',
        ctaColor: '#000d14',
        ctaBg: 'rgba(217, 179, 119, 0.88)',
        ctaShadow: '0 0 24px rgba(217, 179, 119, 0.35), 0 2px 8px rgba(0, 0, 0, 0.4)',
        ctaHoverBg: '#d9b377',
        ctaHoverBorder: '#d9b377',
        ctaHoverShadow: '0 0 44px rgba(217, 179, 119, 0.55), 0 2px 12px rgba(0, 0, 0, 0.4)',
        ctaHoverColor: '#000d14',
        githubLink: 'rgba(240, 236, 224, 0.3)',
        trustStrip: 'rgba(217, 179, 119, 0.35)',
        footerText: 'rgba(240, 236, 224, 0.22)',
        footerBrand: 'rgba(240, 236, 224, 0.38)',
        footerLink: 'rgba(217, 179, 119, 0.4)',
        divLine: 'linear-gradient(90deg, transparent, rgba(217,179,119,0.2))',
        divLineR: 'linear-gradient(90deg, rgba(217,179,119,0.2), transparent)',
        scanline:
          'linear-gradient(90deg, transparent 0%, rgba(217,179,119,0.08) 20%, rgba(217,179,119,0.15) 50%, rgba(217,179,119,0.08) 80%, transparent 100%)',
      };

  return (
    <div
      ref={ref}
      className="relative flex h-svh w-full flex-col"
      style={light ? { background: c.pageBg } : undefined}
    >
      {/* Background decoration */}
      <HexGrid light={light} />

      {/* Scanline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0"
        style={{ top: '50%', height: '1px', background: c.scanline }}
      />

      {/* Focused glow directly behind icon */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%]"
        style={{
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: c.glowBg,
          animation: 'yqg-glow-breathe 4s ease-in-out infinite',
        }}
      />

      {/* ── Main content — 2-column on desktop, stacked on mobile ── */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 pt-20 md:px-10 md:pt-6 lg:px-16">
       <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-10 md:flex-row md:items-center md:gap-14">
      <section className="flex flex-col items-center gap-6 text-center md:w-[44%] md:shrink-0 md:items-start md:text-left">
        {/* Status badge */}
        <div
          className="yqg-entrance-1 flex items-center gap-2 rounded-full border px-3 py-1"
          style={{ borderColor: c.badgeBorder, background: c.badgeBg }}
        >
          <span
            className="size-1.5 rounded-full"
            style={{
              background: c.badgeDot,
              boxShadow: c.badgeDotGlow,
              animation: 'yqg-dot-blink 2s ease-in-out infinite',
            }}
          />
          <span
            className="font-mono text-[10px] font-medium tracking-[0.22em] uppercase"
            style={{ color: c.badgeText }}
          >
            System Online
          </span>
        </div>

        {/* Icon + ambient voice ring */}
        <div className="yqg-entrance-2 relative flex items-center justify-center">
          {/* Ambient voice ring — 3 concentric pulse rings */}
          <div aria-hidden="true" className="absolute inset-0 -m-10">
            <div
              className="yqg-voice-ring absolute inset-0 rounded-full"
              style={{
                border: `1px solid ${c.ringA}`,
                animation: 'yqg-ring-pulse 4s ease-in-out infinite',
              }}
            />
            <div
              className="yqg-voice-ring absolute inset-2 rounded-full"
              style={{
                border: `1px solid ${c.ringB}`,
                animation: 'yqg-ring-pulse 4s ease-in-out 0.8s infinite',
              }}
            />
            <div
              className="yqg-voice-ring absolute inset-4 rounded-full"
              style={{
                border: `1px solid ${c.ringC}`,
                animation: 'yqg-ring-pulse 4s ease-in-out 1.6s infinite',
              }}
            />
          </div>
          {/* Glow ring */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -m-6 rounded-full"
            style={{
              background: c.iconGlow,
              animation: 'yqg-glow-breathe 3.5s ease-in-out 0.5s infinite',
            }}
          />
          <NexusIcon />
        </div>

        {/* Heading */}
        <div className="yqg-entrance-3 space-y-2">
          <h1
            className="font-syne text-4xl font-bold tracking-[-0.03em] md:text-5xl"
            style={{
              background: c.headingGrad,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Your agency co-pilot.
          </h1>
          <p
            className="font-mono text-xs font-medium tracking-[0.18em] uppercase"
            style={{ color: c.subtitle }}
          >
            Built for YQG Digital · Voice-first · Sub-2s latency
          </p>
        </div>

        {/* Subtitle */}
        <p className="yqg-entrance-4 max-w-xs text-sm leading-6" style={{ color: c.bodyText }}>
          Proposals · SEO · competitor teardowns · client FAQs · content briefs — all hands-free.
        </p>

        {/* CTA button — primary */}
        <button
          onClick={onStartCall}
          className="yqg-entrance-5 yqg-cta-glow group relative mt-2 overflow-hidden rounded-full px-10 py-3.5 font-mono text-xs font-bold tracking-[0.22em] uppercase transition-all duration-300"
          style={{
            border: `1px solid ${c.ctaBorder}`,
            color: c.ctaColor,
            background: c.ctaBg,
            boxShadow: c.ctaShadow,
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.background = c.ctaHoverBg;
            el.style.borderColor = c.ctaHoverBorder;
            el.style.boxShadow = c.ctaHoverShadow;
            el.style.color = c.ctaHoverColor;
            el.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.background = c.ctaBg;
            el.style.borderColor = c.ctaBorder;
            el.style.boxShadow = c.ctaShadow;
            el.style.color = c.ctaColor;
            el.style.transform = 'translateY(0)';
          }}
        >
          {startButtonText}
        </button>

        {/* Prompt seeds — tells Tim exactly what to say */}
        <div className="yqg-entrance-5 mt-3 flex w-full max-w-md flex-wrap justify-center gap-2">
          {[
            'Draft a $5K proposal for a Windsor plumber',
            'Analyze thewebmechanic.com',
            'SEO brief for a Windsor HVAC company',
          ].map((p) => (
            <span
              key={p}
              className="inline-flex items-center rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[0.05em] normal-case transition-opacity duration-200"
              style={{
                borderColor: light ? 'rgba(184,138,61,0.35)' : 'rgba(217,179,119,0.25)',
                color: light ? '#5a4218' : 'rgba(217,179,119,0.75)',
                background: light ? 'rgba(184,138,61,0.06)' : 'rgba(217,179,119,0.04)',
              }}
            >
              &ldquo;{p}&rdquo;
            </span>
          ))}
        </div>

        {/* Expectations strip — tells Tim what happens when he clicks */}
        <p
          className="yqg-entrance-5 mt-2 max-w-sm font-mono text-[9px] tracking-[0.12em] uppercase"
          style={{ color: light ? 'rgba(90,66,24,0.55)' : 'rgba(217,179,119,0.45)' }}
        >
          Click · Allow mic · Talk 30 seconds · Nothing saved
        </p>

        {/* Advanced: model selector (collapsed by default) */}
        <details className="yqg-entrance-5 mt-1">
          <summary
            className="cursor-pointer font-mono text-[9px] tracking-[0.14em] uppercase transition-opacity duration-200 hover:opacity-80"
            style={{
              color: light ? 'rgba(90,66,24,0.5)' : 'rgba(217,179,119,0.32)',
              listStyle: 'none',
            }}
          >
            Advanced model · ⌄
          </summary>
          <div className="mt-2">
            <ModelSelector
              className=""
              value={selectedModel}
              onChange={changeModel}
            />
          </div>
        </details>

        {/* Secondary CTA — GitHub */}
        <a
          href="mailto:admin@taurusai.io?subject=YQG%20AI%20Assistant%20feedback"
          target="_blank"
          rel="noopener noreferrer"
          className="yqg-entrance-5 mt-1 font-mono text-[10px] tracking-[0.15em] uppercase transition-colors duration-200"
          style={{ color: c.githubLink }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = light ? '#0044cc' : 'rgba(217, 179, 119, 0.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = c.githubLink;
          }}
        >
          Send feedback
        </a>

        {/* Trust strip */}
        <p
          className="yqg-entrance-5 mt-3 font-mono text-[10px] tracking-[0.12em] uppercase"
          style={{ color: c.trustStrip }}
        >
          For Tim &amp; Andrew @ YQG Digital · Powered by TAURUS AI
        </p>

        {/* Secondary fallback CTA — for mic-averse or later-today */}
        <a
          href="mailto:admin@taurusai.io?subject=YQG%20Assistant%20%E2%80%94%20book%20a%20walkthrough&body=Prefer%20a%20human%20walkthrough%3F%20Reply%20with%20a%20time%20window."
          className="yqg-entrance-5 mt-1 font-mono text-[10px] tracking-[0.15em] uppercase transition-opacity duration-200 hover:opacity-80"
          style={{ color: c.footerLink }}
        >
          Prefer a human? Book 15 min →
        </a>
      </section>

          {/* Right column — Agency Console preview (desktop only) */}
          <aside className="hidden md:flex md:flex-1 md:items-center md:justify-center">
            <YqgConsolePreview />
          </aside>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="relative z-10 flex w-full items-center justify-center gap-2 py-5">
        <div className="h-px w-8" style={{ background: c.divLine }} />
        <p
          className="font-mono text-[10px] tracking-[0.15em] uppercase"
          style={{ color: c.footerText }}
        >
          Powered by <span style={{ color: c.footerBrand, fontWeight: 600 }}>TAURUS AI Corp</span>
          {' · '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.livekit.io/agents/start/voice-ai/"
            style={{ color: c.footerLink }}
            className="transition-colors duration-200"
          >
            Docs
          </a>
          {' · '}
          <Link
            href="/privacy"
            style={{ color: c.footerLink }}
            className="transition-colors duration-200"
          >
            Privacy
          </Link>
          {' · '}
          <Link
            href="/terms"
            style={{ color: c.footerLink }}
            className="transition-colors duration-200"
          >
            Terms
          </Link>
        </p>
        <div className="h-px w-8" style={{ background: c.divLineR }} />
      </footer>
    </div>
  );
};
