/**
 * Mater Maria — Custom Estate Icons
 *
 * Hand-crafted SVG icons with gradient fills, fine strokes, and micro-details.
 * Each icon follows the Lucide interface: { className?: string }
 * Drop-in replacements for generic Lucide icons across the estate site.
 */

interface IconProps {
  className?: string;
}

/* ------------------------------------------------------------------
 *  SmartLivingIcon
 *  A stylised brain-circuit hybrid — neural pathways flowing into a
 *  house silhouette. Represents AI-powered smart home living.
 *  Replaces the generic "Cpu" icon everywhere.
 * ------------------------------------------------------------------ */
export function SmartLivingIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="sl-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity={1} />
          <stop offset="100%" stopColor="currentColor" stopOpacity={0.6} />
        </linearGradient>
      </defs>
      {/* House roof */}
      <path
        d="M12 2L3 10h2v10h14V10h2L12 2z"
        stroke="url(#sl-grad)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Central brain/AI node */}
      <circle cx={12} cy={13} r={2.5} stroke="currentColor" strokeWidth={1.2} fill="none" />
      <circle cx={12} cy={13} r={0.8} fill="currentColor" opacity={0.7} />
      {/* Circuit traces radiating out */}
      <line x1={12} y1={10.5} x2={12} y2={8} stroke="currentColor" strokeWidth={1} strokeLinecap="round" />
      <circle cx={12} cy={7.5} r={0.5} fill="currentColor" opacity={0.5} />
      <line x1={14.2} y1={14.2} x2={16} y2={16} stroke="currentColor" strokeWidth={1} strokeLinecap="round" />
      <circle cx={16.3} cy={16.3} r={0.5} fill="currentColor" opacity={0.5} />
      <line x1={9.8} y1={14.2} x2={8} y2={16} stroke="currentColor" strokeWidth={1} strokeLinecap="round" />
      <circle cx={7.7} cy={16.3} r={0.5} fill="currentColor" opacity={0.5} />
      {/* Signal arcs — "thinking" */}
      <path d="M9.5 11.5 Q12 9 14.5 11.5" stroke="currentColor" strokeWidth={0.7} fill="none" opacity={0.35} />
      <path d="M8.5 10.5 Q12 7.5 15.5 10.5" stroke="currentColor" strokeWidth={0.5} fill="none" opacity={0.2} />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  AIHealthIcon
 *  Heart with a pulse line running through it and a small circuit node,
 *  conveying AI-monitored health. Premium feel with layered details.
 * ------------------------------------------------------------------ */
export function AIHealthIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Heart shape */}
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinejoin="round"
        fill="none"
      />
      {/* ECG / pulse line across heart */}
      <polyline
        points="4,12 8,12 9.5,9 11,15 12.5,10 14,12 20,12"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.85}
      />
      {/* AI circuit node top-right */}
      <circle cx={18} cy={6.5} r={1.2} stroke="currentColor" strokeWidth={0.8} fill="none" opacity={0.6} />
      <circle cx={18} cy={6.5} r={0.4} fill="currentColor" opacity={0.5} />
      <line x1={18} y1={5.3} x2={18} y2={4} stroke="currentColor" strokeWidth={0.6} strokeLinecap="round" opacity={0.4} />
      <line x1={19.2} y1={6.5} x2={20.5} y2={6.5} stroke="currentColor" strokeWidth={0.6} strokeLinecap="round" opacity={0.4} />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  SolarLeafIcon
 *  A leaf with solar panel grid lines inside — sustainability meets
 *  green architecture. Organic + tech fusion.
 * ------------------------------------------------------------------ */
export function SolarLeafIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Leaf outline */}
      <path
        d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66C7 18 9 14 17 12V8z"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinejoin="round"
        fill="none"
      />
      {/* Leaf tip curve */}
      <path
        d="M17 8c2-2 4-4.5 4-6.5C19 3 16.5 5 17 8z"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinejoin="round"
        fill="none"
      />
      {/* Solar grid lines inside leaf */}
      <line x1={8} y1={14} x2={14} y2={11} stroke="currentColor" strokeWidth={0.6} opacity={0.4} />
      <line x1={6.5} y1={17} x2={13} y2={13.5} stroke="currentColor" strokeWidth={0.6} opacity={0.35} />
      <line x1={10} y1={11.5} x2={8} y2={17.5} stroke="currentColor" strokeWidth={0.6} opacity={0.35} />
      <line x1={12.5} y1={10.5} x2={11} y2={16} stroke="currentColor" strokeWidth={0.6} opacity={0.3} />
      {/* Sun dot */}
      <circle cx={19.5} cy={3.5} r={1} stroke="currentColor" strokeWidth={0.7} fill="none" opacity={0.5} />
      <circle cx={19.5} cy={3.5} r={0.35} fill="currentColor" opacity={0.4} />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  IoTSensorIcon
 *  A rounded shield with radiating signal waves and a central dot —
 *  representing IoT wellness sensors and connected monitoring.
 * ------------------------------------------------------------------ */
export function IoTSensorIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Shield body */}
      <path
        d="M12 2L4 6v5c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6L12 2z"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinejoin="round"
        fill="none"
      />
      {/* Central sensor dot */}
      <circle cx={12} cy={11} r={1.5} fill="currentColor" opacity={0.7} />
      {/* Signal arcs radiating */}
      <path d="M9 9 Q12 6 15 9" stroke="currentColor" strokeWidth={1} fill="none" strokeLinecap="round" opacity={0.6} />
      <path d="M7.5 7.5 Q12 3.5 16.5 7.5" stroke="currentColor" strokeWidth={0.8} fill="none" strokeLinecap="round" opacity={0.35} />
      {/* Data lines below sensor */}
      <line x1={10} y1={14} x2={14} y2={14} stroke="currentColor" strokeWidth={0.8} strokeLinecap="round" opacity={0.5} />
      <line x1={10.5} y1={16} x2={13.5} y2={16} stroke="currentColor" strokeWidth={0.6} strokeLinecap="round" opacity={0.35} />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  CommunityNodesIcon
 *  Three people silhouettes connected by network lines — vibrant
 *  community with a tech-connected undertone.
 * ------------------------------------------------------------------ */
export function CommunityNodesIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Centre person */}
      <circle cx={12} cy={7} r={2.2} stroke="currentColor" strokeWidth={1.3} fill="none" />
      <path d="M8 20v-2a4 4 0 0 1 8 0v2" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" fill="none" />
      {/* Left person (smaller) */}
      <circle cx={5} cy={9} r={1.6} stroke="currentColor" strokeWidth={1} fill="none" opacity={0.7} />
      <path d="M2 20v-1.5a3 3 0 0 1 6 0V20" stroke="currentColor" strokeWidth={1} strokeLinecap="round" fill="none" opacity={0.7} />
      {/* Right person (smaller) */}
      <circle cx={19} cy={9} r={1.6} stroke="currentColor" strokeWidth={1} fill="none" opacity={0.7} />
      <path d="M16 20v-1.5a3 3 0 0 1 6 0V20" stroke="currentColor" strokeWidth={1} strokeLinecap="round" fill="none" opacity={0.7} />
      {/* Network connection lines */}
      <line x1={7} y1={9} x2={10} y2={8} stroke="currentColor" strokeWidth={0.7} strokeDasharray="1.5 1" opacity={0.4} />
      <line x1={17} y1={9} x2={14} y2={8} stroke="currentColor" strokeWidth={0.7} strokeDasharray="1.5 1" opacity={0.4} />
      {/* Connection dots */}
      <circle cx={7} cy={9} r={0.4} fill="currentColor" opacity={0.4} />
      <circle cx={17} cy={9} r={0.4} fill="currentColor" opacity={0.4} />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  OrganicKitchenIcon
 *  A pot/bowl with a sprouting leaf and steam wisps — farm-to-table
 *  organic dining. Warm and inviting.
 * ------------------------------------------------------------------ */
export function OrganicKitchenIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Bowl / pot */}
      <path
        d="M5 12h14a1 1 0 0 1 1 1v1c0 3.87-3.13 7-7 7H11c-3.87 0-7-3.13-7-7v-1a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinejoin="round"
        fill="none"
      />
      {/* Pot handles */}
      <path d="M5 13H3.5a1 1 0 0 1 0-2H5" stroke="currentColor" strokeWidth={1} strokeLinecap="round" fill="none" opacity={0.6} />
      <path d="M19 13h1.5a1 1 0 0 0 0-2H19" stroke="currentColor" strokeWidth={1} strokeLinecap="round" fill="none" opacity={0.6} />
      {/* Sprouting leaf from centre */}
      <path d="M12 12V8" stroke="currentColor" strokeWidth={1} strokeLinecap="round" />
      <path d="M12 8c-2-1-3.5 0-3.5 2 1.5 0 2.5-.5 3.5-2z" stroke="currentColor" strokeWidth={0.9} fill="none" opacity={0.7} />
      <path d="M12 9c2-1.5 3.5-.5 3.5 1.5-1.5 0-2.5-.3-3.5-1.5z" stroke="currentColor" strokeWidth={0.9} fill="none" opacity={0.6} />
      {/* Steam wisps */}
      <path d="M9 6c0-1.5 1-2 1-3" stroke="currentColor" strokeWidth={0.6} strokeLinecap="round" fill="none" opacity={0.3} />
      <path d="M15 5c0-1 .8-1.5.8-2.5" stroke="currentColor" strokeWidth={0.6} strokeLinecap="round" fill="none" opacity={0.25} />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  WellnessSpaIcon
 *  A lotus flower with a sparkle — Ayurvedic wellness and yoga.
 *  Delicate petal strokes with a glowing centre.
 * ------------------------------------------------------------------ */
export function WellnessSpaIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Centre petal */}
      <path d="M12 3c0 4-3 7-3 10s1.5 4 3 4 3-1 3-4S12 7 12 3z" stroke="currentColor" strokeWidth={1.2} fill="none" />
      {/* Left petals */}
      <path d="M7 8c1 3 0 6-1 8 2 0 4-1 5-4C10 10 8 9 7 8z" stroke="currentColor" strokeWidth={1} fill="none" opacity={0.7} />
      <path d="M4 12c1 2 0 4-1 6 2 0 3.5-1 4-3-.5-1.5-2-2.5-3-3z" stroke="currentColor" strokeWidth={0.8} fill="none" opacity={0.45} />
      {/* Right petals */}
      <path d="M17 8c-1 3 0 6 1 8-2 0-4-1-5-4 1-2 3-3 4-4z" stroke="currentColor" strokeWidth={1} fill="none" opacity={0.7} />
      <path d="M20 12c-1 2 0 4 1 6-2 0-3.5-1-4-3 .5-1.5 2-2.5 3-3z" stroke="currentColor" strokeWidth={0.8} fill="none" opacity={0.45} />
      {/* Glowing centre */}
      <circle cx={12} cy={13} r={1} fill="currentColor" opacity={0.6} />
      {/* Sparkle top */}
      <line x1={12} y1={1} x2={12} y2={2.2} stroke="currentColor" strokeWidth={0.7} strokeLinecap="round" opacity={0.35} />
      <line x1={11} y1={1.6} x2={13} y2={1.6} stroke="currentColor" strokeWidth={0.7} strokeLinecap="round" opacity={0.35} />
      {/* Water base */}
      <path d="M6 20c2-1 4-1 6-1s4 0 6 1" stroke="currentColor" strokeWidth={0.8} strokeLinecap="round" fill="none" opacity={0.3} />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
 *  ADDITIONAL LUXURY ICONS — For Trust Badges, Amenities, etc.
 * ═══════════════════════════════════════════════════════════════ */

/* ------------------------------------------------------------------
 *  ShieldCheckIcon
 *  Shield with checkmark — security, trust, verified
 * ------------------------------------------------------------------ */
export function ShieldCheckIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  AwardIcon
 *  Ribbon badge with star — excellence, premium status
 * ------------------------------------------------------------------ */
export function AwardIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx={12} cy={9} r={5} stroke="currentColor" strokeWidth={1.3} />
      <path
        d="M12 14v8M8 22h8"
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinecap="round"
      />
      <path
        d="M9 6l1.5-2 1.5 2M15 6l-1.5-2-1.5 2"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.6}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  StarIcon
 *  Simple elegant star — premium, NRI-friendly, special
 * ------------------------------------------------------------------ */
export function StarIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  HeartIcon
 *  Simple elegant heart — care, love, health
 * ------------------------------------------------------------------ */
export function HeartIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  SunIcon
 *  Sun with rays — solar power, energy, warmth
 * ------------------------------------------------------------------ */
export function SunIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx={12} cy={12} r={4} stroke="currentColor" strokeWidth={1.4} />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  WavesIcon
 *  Water waves — pool, backwaters, Kerala's rivers
 * ------------------------------------------------------------------ */
export function WavesIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" />
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" opacity={0.6} />
      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" opacity={0.3} />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  TreesIcon
 *  Multiple trees — nature, forests, Kerala's greenery
 * ------------------------------------------------------------------ */
export function TreesIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 22v-8M8 14l4-6 4 6" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 8H4l2-4 3 2 3-2 2 4h-4" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  HomeIcon
 *  House silhouette — residence, villas
 * ------------------------------------------------------------------ */
export function HomeIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  BuildingIcon
 *  Building silhouette — apartments, complex
 * ------------------------------------------------------------------ */
export function BuildingIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <rect x={4} y={4} width={16} height={16} rx={1} stroke="currentColor" strokeWidth={1.4} />
      <path d="M4 10h16M10 4v16M8 8h2v4H8zM14 8h2v4h-2z" stroke="currentColor" strokeWidth={1.1} />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  SparklesIcon
 *  Sparkles/stars — luxury, premium features
 * ------------------------------------------------------------------ */
export function SparklesIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1zM17 5l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" stroke="currentColor" strokeWidth={1} strokeLinejoin="round" opacity={0.5} />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  FlameIcon
 *  Flame/fire — energy, passion, power
 * ------------------------------------------------------------------ */
export function FlameIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2c0 5-4 6-4 10a4 4 0 0 0 8 0c0-4-4-5-4-10z" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M12 22c-3 0-5-2-5-5 0-3 2-4 2-6 0 2 2 3 3 3s3-1 3-3c0 2 2 3 2 6 0 3-2 5-5 5z" stroke="currentColor" strokeWidth={1.2} strokeLinejoin="round" opacity={0.6} />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  MoonIcon
 *  Moon — serenity, peaceful nights
 * ------------------------------------------------------------------ */
export function MoonIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  CompassIcon
 *  Compass — direction, Kerala exploration
 * ------------------------------------------------------------------ */
export function CompassIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={1.3} />
      <path d="M12 3l2 4-2 2 2 4-2 2-2-2-2-2 2-4-2-2z" fill="currentColor" opacity={0.8} />
      <path d="M12 21l-2-4 2-2-2-4 2-2 2 2 2 2-2 4 2 2z" stroke="currentColor" strokeWidth={0.8} opacity={0.4} />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  GlobeIcon
 *  Globe — worldwide NRI community
 * ------------------------------------------------------------------ */
export function GlobeIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={1.3} />
      <path d="M3 12h18M12 3c-2 2-3 4-3 9s1 7 3 9M12 3c2 2 3 4 3 9s-1 7-3 9" stroke="currentColor" strokeWidth={1} />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  CloudIcon
 *  Cloud — connectivity, smart home cloud
 * ------------------------------------------------------------------ */
export function CloudIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  MusicIcon
 *  Musical note — amphitheatre, cultural events
 * ------------------------------------------------------------------ */
export function MusicIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={6} cy={18} r={3} stroke="currentColor" strokeWidth={1.3} />
      <circle cx={18} cy={16} r={3} stroke="currentColor" strokeWidth={1.3} />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  UtensilsIcon
 *  Fork and knife — dining, restaurant
 * ------------------------------------------------------------------ */
export function UtensilsIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  DumbbellIcon
 *  Dumbbell — fitness, gym, workout
 * ------------------------------------------------------------------ */
export function DumbbellIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6.5 6.5h11M6.5 17.5h11M3 10v4M21 10v4M5 8v8M19 8v8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  BookOpenIcon
 *  Open book — education, learning, library
 * ------------------------------------------------------------------ */
export function BookOpenIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  CoffeeIcon
 *  Coffee cup — lounge, social, cafe
 * ------------------------------------------------------------------ */
export function CoffeeIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------
 *  FlowerIcon
 *  Flower — garden, nature, beauty
 * ------------------------------------------------------------------ */
export function FlowerIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx={12} cy={12} r={2} stroke="currentColor" strokeWidth={1.3} />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" />
    </svg>
  );
}
