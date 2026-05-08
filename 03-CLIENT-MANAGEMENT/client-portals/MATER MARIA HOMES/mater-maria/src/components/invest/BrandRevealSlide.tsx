"use client";

import { motion } from "framer-motion";

/* ─────────────────────────────────────────────
   TIMING CONSTANTS (seconds)
───────────────────────────────────────────── */
const T = {
  eagleIn:     0.2,   // eagle + sky fade in
  skyFade:     2.0,   // golden sky starts fading to black
  wingsIn:     2.6,   // logo wings crossfade in
  materIn:     3.8,   // MATER text
  mariaIn:     4.2,   // MARIA large text
  homesIn:     4.7,   // H O M E S text
  taglineIn:   5.2,   // "Living Refined"
  glowStart:   5.0,   // ambient glow loop begins
};

/* ─────────────────────────────────────────────
   EAGLE SILHOUETTE SVG
   (Golden silhouette against sky — wings spread
   wide like a soaring bald eagle)
───────────────────────────────────────────── */
function EagleSVG() {
  return (
    <svg
      viewBox="0 0 600 320"
      aria-hidden="true"
      style={{ width: "min(90vw, 680px)", height: "auto", display: "block" }}
    >
      <defs>
        <linearGradient id="eagle-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B6914" />
          <stop offset="40%" stopColor="#c0a055" />
          <stop offset="100%" stopColor="#5a3d0a" />
        </linearGradient>
        <linearGradient id="eagle-body" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6b4f10" />
          <stop offset="100%" stopColor="#2a1a04" />
        </linearGradient>
      </defs>

      {/* ── Left wing — sweeping wide up-left ── */}
      <path
        d="M290,175
           C270,165 240,148 200,128
           C160,108 115,88  75,72
           C50,62  28,58  15,70
           C35,74  65,82  95,96
           C130,112 165,130 200,150
           C230,166 262,178 288,184 Z"
        fill="url(#eagle-gold)"
        opacity="0.92"
      />
      {/* Left wing secondary feathers */}
      <path
        d="M288,184
           C265,175 235,158 195,142
           C155,126 110,112 70,100
           C50,94  32,90  20,98
           C40,105 72,115 105,130
           C145,148 185,166 225,180
           C255,190 278,194 290,192 Z"
        fill="url(#eagle-gold)"
        opacity="0.55"
      />

      {/* ── Right wing — mirror ── */}
      <path
        d="M310,175
           C330,165 360,148 400,128
           C440,108 485,88  525,72
           C550,62 572,58 585,70
           C565,74 535,82 505,96
           C470,112 435,130 400,150
           C370,166 338,178 312,184 Z"
        fill="url(#eagle-gold)"
        opacity="0.92"
      />
      <path
        d="M312,184
           C335,175 365,158 405,142
           C445,126 490,112 530,100
           C550,94 568,90 580,98
           C560,105 528,115 495,130
           C455,148 415,166 375,180
           C345,190 322,194 310,192 Z"
        fill="url(#eagle-gold)"
        opacity="0.55"
      />

      {/* ── Body ── */}
      <ellipse cx="300" cy="198" rx="26" ry="46" fill="url(#eagle-body)" />

      {/* ── Head (white — bald eagle) ── */}
      <circle cx="322" cy="162" r="22" fill="rgba(240,232,210,0.85)" />
      <circle cx="328" cy="158" r="14" fill="rgba(220,210,190,0.9)" />

      {/* ── Beak ── */}
      <path d="M342,163 L358,172 L340,176 Z" fill="#c8920a" />

      {/* ── Eye ── */}
      <circle cx="332" cy="158" r="4" fill="#1a1000" />
      <circle cx="331" cy="157" r="1.5" fill="rgba(255,220,100,0.8)" />

      {/* ── Tail feathers ── */}
      <path
        d="M282,238 Q300,258 318,238
           Q312,272 300,285
           Q288,272 282,238Z"
        fill="url(#eagle-gold)"
        opacity="0.7"
      />

      {/* ── Wing tips / primary feathers (left) ── */}
      <path d="M15,70  L28,56  L38,74 Z" fill="#7a5810" opacity="0.8" />
      <path d="M28,56  L44,44  L50,65 Z" fill="#7a5810" opacity="0.7" />
      <path d="M44,44  L62,36  L64,58 Z" fill="#8a6218" opacity="0.6" />

      {/* ── Wing tips (right) ── */}
      <path d="M585,70 L572,56 L562,74 Z" fill="#7a5810" opacity="0.8" />
      <path d="M572,56 L556,44 L550,65 Z" fill="#7a5810" opacity="0.7" />
      <path d="M556,44 L538,36 L536,58 Z" fill="#8a6218" opacity="0.6" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   LOGO WINGS SVG (from MatarMariaHome_logo02.svg)
───────────────────────────────────────────── */
function LogoWings() {
  return (
    <svg
      viewBox="83 88 227 130"
      aria-hidden="true"
      style={{ width: "clamp(140px, 22vw, 240px)", height: "auto", display: "block" }}
    >
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
        fill="#d9c475"
      />
      <path
        d="M244.31,95.06
           c-34.89,0-47.43,17.32-47.74,17.07
           c-0.31,0.25-13,-17.07-47.89,-17.07
           c-49.07,0-64.85,40.29-64.85,40.29
           s58.64-45.16,112.73,8.93
           c54.09-54.09,112.58-8.93,112.58-8.93
           S293.38,95.06,244.31,95.06Z"
        fill="#c0a055"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export function BrandRevealSlide() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden select-none">

      {/* ── BASE: Deep black background ── */}
      <div className="absolute inset-0" style={{ background: "#07060e" }} />

      {/* ── PHASE 1: Golden sky — fades out as eagle departs ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0.5, 0] }}
        transition={{
          delay: T.eagleIn,
          duration: T.skyFade + 1.5,
          times: [0, 0.15, 0.5, 1],
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 30%, rgba(160,110,20,0.45) 0%, rgba(80,50,5,0.25) 45%, transparent 75%)",
        }}
      />

      {/* ── SCRIPTURE: top-right watermark ── */}
      <motion.div
        className="pointer-events-none absolute"
        style={{ top: "7%", right: "4%", maxWidth: "min(42vw, 420px)", textAlign: "right" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: T.skyFade, duration: 1.5 }}
      >
        <p
          style={{
            fontFamily: 'var(--font-heading, "Didot", Georgia, serif)',
            fontSize: "clamp(0.75rem, 2.2vw, 1.35rem)",
            fontWeight: 700,
            lineHeight: 1.35,
            color: "rgba(192,160,85,0.13)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            mixBlendMode: "overlay",
          }}
        >
          &ldquo;Those who trust in the Lord<br />
          shall renew their strength.&rdquo;
        </p>
        <p
          style={{
            fontFamily: 'var(--font-body, "Helvetica Neue", sans-serif)',
            fontSize: "clamp(0.45rem, 1vw, 0.65rem)",
            letterSpacing: "0.32em",
            color: "rgba(192,160,85,0.08)",
            marginTop: "0.4rem",
          }}
        >
          ISAIAH 40:31
        </p>
      </motion.div>

      {/* ── EAGLE PHASE ── */}
      <motion.div
        className="absolute z-10 flex items-center justify-center"
        style={{ inset: 0 }}
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1.05, 1.4], y: [40, 0, -10, -120] }}
        transition={{
          delay: T.eagleIn,
          duration: T.skyFade + 0.8,
          times: [0, 0.15, 0.6, 1],
          ease: "easeInOut",
        }}
      >
        <EagleSVG />
      </motion.div>

      {/* ── LOGO WINGS (crossfade in as eagle departs) ── */}
      <motion.div
        className="relative z-20"
        initial={{ opacity: 0, scale: 1.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: T.wingsIn, duration: 1.1, ease: [0.34, 1.1, 0.64, 1] }}
      >
        <LogoWings />
      </motion.div>

      {/* ── LOGO GLOW — pulses after wings settle ── */}
      <motion.div
        className="pointer-events-none absolute z-10"
        style={{
          width: "clamp(260px, 40vw, 400px)",
          height: "100px",
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(192,160,85,0.28), transparent 70%)",
          filter: "blur(22px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0.35, 0.8, 0.35] }}
        transition={{
          delay: T.glowStart,
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* ── BRAND TEXT STACK ── */}
      <div className="relative z-20 flex flex-col items-center" style={{ marginTop: "0.5rem" }}>

        {/* MATER — small, tracked */}
        <motion.span
          style={{
            fontFamily: 'var(--font-heading, "Didot", Georgia, serif)',
            fontSize: "clamp(0.7rem, 1.8vw, 1.05rem)",
            letterSpacing: "0.35em",
            fontWeight: 400,
            color: "#b8962e",
            display: "block",
            textAlign: "center",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: T.materIn, duration: 0.7, ease: "easeOut" }}
        >
          MATER
        </motion.span>

        {/* MARIA — hero-scale, bold */}
        <motion.span
          style={{
            fontFamily: 'var(--font-heading, "Didot", Georgia, serif)',
            fontSize: "clamp(3.5rem, 11vw, 7.5rem)",
            fontWeight: 700,
            lineHeight: 0.9,
            letterSpacing: "0.06em",
            background: "linear-gradient(135deg, #d9c475 0%, #c0a055 40%, #9a7a2a 80%, #c0a055 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            display: "block",
            textAlign: "center",
            textShadow: "none",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: T.mariaIn, duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
        >
          MARIA
        </motion.span>

        {/* H O M E S — medium, very wide tracking */}
        <motion.span
          style={{
            fontFamily: 'var(--font-heading, "Didot", Georgia, serif)',
            fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
            letterSpacing: "0.52em",
            fontWeight: 400,
            color: "#c0a055",
            display: "block",
            textAlign: "center",
            marginTop: "0.15em",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: T.homesIn, duration: 0.7, ease: "easeOut" }}
        >
          HOMES
        </motion.span>
      </div>

      {/* ── BOTTOM-LEFT: "Living Refined" italic ── */}
      <motion.div
        className="pointer-events-none absolute"
        style={{ bottom: "8%", left: "5%" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: T.taglineIn, duration: 1.2 }}
      >
        <span
          style={{
            fontFamily: 'var(--font-heading, "Didot", Georgia, serif)',
            fontStyle: "italic",
            fontSize: "clamp(1.1rem, 3vw, 2rem)",
            fontWeight: 400,
            color: "rgba(192,160,85,0.38)",
            letterSpacing: "0.04em",
          }}
        >
          Living Refined
        </span>
      </motion.div>

      {/* ── BOTTOM-RIGHT: Location ── */}
      <motion.div
        className="pointer-events-none absolute"
        style={{ bottom: "8%", right: "5%", textAlign: "right" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: T.taglineIn + 0.4, duration: 1 }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body, "Helvetica Neue", sans-serif)',
            fontSize: "clamp(0.45rem, 1vw, 0.62rem)",
            letterSpacing: "0.35em",
            color: "rgba(192,160,85,0.25)",
            fontWeight: 300,
          }}
        >
          ELANGULAM · KANJIRAPPALLY
        </span>
      </motion.div>

      {/* ── Gold ripple rings (start with eagle, continue) ── */}
      {[0.5, 1.1, 1.7, 2.3].map((delay, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute rounded-full"
          style={{
            width: 160,
            height: 160,
            border: "1px solid rgba(192,160,85,0.18)",
            top: "50%",
            left: "50%",
            marginTop: -80,
            marginLeft: -80,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 5], opacity: [0.6, 0] }}
          transition={{
            delay: T.wingsIn + delay,
            duration: 3.5,
            repeat: Infinity,
            repeatDelay: 2.5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
