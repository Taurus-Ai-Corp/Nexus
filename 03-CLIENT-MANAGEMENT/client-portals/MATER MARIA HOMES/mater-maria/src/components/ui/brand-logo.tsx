"use client";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  /** Total height budget in pixels — drives all proportional sizing */
  height?: number;
  /**
   * onDark=true  → bright gold + sky-blue + text shadows (for dark hero overlays)
   * onDark=false → rich dark-gold + navy blue (for light/scrolled backgrounds)
   */
  onDark?: boolean;
}

export function BrandLogo({ className, height = 52, onDark = false }: BrandLogoProps) {
  // Color tokens — two modes
  const wingOuter = onDark ? "#FFD03A"     : "#C49228";  // outer wing layer
  const wingInner = onDark ? "#FFF090"     : "#DDB840";  // inner wing highlight
  const goldMater = onDark ? "#FFF5A0"     : "#C8961C";  // "MATER" text
  const goldMaria = onDark ? "#FFE84A"     : "#B47818";  // "MARIA" text
  const blueHomes = onDark ? "#C8E8FF"     : "#2565BE";  // "HOMES" blue
  const shadow    = onDark
    ? "0 2px 20px rgba(0,0,0,0.95), 0 0 40px rgba(255,220,60,0.5), 0 1px 2px rgba(0,0,0,1)"
    : "none";

  // Proportional sizing — MATER/HOMES bumped so they stay legible at any height
  const iconH  = Math.round(height * 0.38);
  const iconW  = Math.round((iconH / 125) * 227);
  const szMater = Math.round(height * 0.18);   // small caps label (was 0.14)
  const szMaria = Math.round(height * 0.30);   // dominant word
  const szHomes = Math.round(height * 0.17);   // blue sub-word (was 0.13)

  return (
    <div
      className={cn("flex flex-col items-center", className)}
      role="img"
      aria-label="Mater Maria Homes"
      style={{ lineHeight: 1, gap: 0 }}
    >
      {/* ── Wings ─────────────────────────────── */}
      <svg
        viewBox="83 88 227 128"
        width={iconW}
        height={iconH}
        aria-hidden="true"
        style={{ display: "block" }}
      >
        {/* Outer wings — darker gold */}
        <path
          d="M244.31,95.06
             c-34.89,0-47.43,17.32-47.74,17.07
             c-0.31,0.25-13,-17.07-47.89,-17.07
             c-49.07,0-64.85,40.29-64.85,40.29
             s58.64-45.16,112.73,8.93
             c54.09-54.09,112.58-8.93,112.58-8.93
             S293.38,95.06,244.31,95.06Z"
          fill={wingOuter}
        />
        {/* Inner wings — lighter gold */}
        <path
          d="M251.38,134.66
             c-20.51-1.01-40.78,6.67-54.81,27.65
             c-14.03-20.98-34.3-28.66-54.81-27.65
             c-30.73,1.51-45.86,22.78-45.86,22.78
             s18.23-15.89,54.88,1.63
             c26.59,12.71,42.04,43.6,45.79,51.87
             c3.75-8.28,19.19-39.16,45.79-51.87
             c36.66-17.52,54.88-1.63,54.88-1.63
             S282.11,133.15,251.38,134.66Z"
          fill={wingInner}
        />
      </svg>

      {/* ── MATER ─────────────────────────────── */}
      <span
        style={{
          fontFamily: 'var(--font-heading, "Didot", "Playfair Display", Georgia, serif)',
          fontSize: szMater,
          fontWeight: 600,
          letterSpacing: "0.30em",
          color: goldMater,
          textShadow: shadow,
          marginTop: Math.round(height * 0.02),
          whiteSpace: "nowrap",
          display: "block",
        }}
      >
        MATER
      </span>

      {/* ── MARIA ─────────────────────────────── */}
      <span
        style={{
          fontFamily: 'var(--font-heading, "Didot", "Playfair Display", Georgia, serif)',
          fontSize: szMaria,
          fontWeight: 800,
          letterSpacing: "0.08em",
          lineHeight: 1,
          color: goldMaria,
          textShadow: shadow,
          marginTop: Math.round(height * 0.005),
          whiteSpace: "nowrap",
          display: "block",
        }}
      >
        MARIA
      </span>

      {/* ── HOMES ─────────────────────────────── */}
      <span
        style={{
          fontFamily: 'var(--font-heading, "Didot", "Playfair Display", Georgia, serif)',
          fontSize: szHomes,
          fontWeight: 600,
          letterSpacing: "0.38em",
          color: blueHomes,
          textShadow: onDark ? "0 2px 16px rgba(0,0,0,0.95), 0 0 24px rgba(180,220,255,0.4), 0 1px 2px rgba(0,0,0,1)" : "none",
          marginTop: Math.round(height * 0.025),
          whiteSpace: "nowrap",
          display: "block",
        }}
      >
        HOMES
      </span>
    </div>
  );
}
