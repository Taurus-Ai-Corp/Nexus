"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";

const GOLD = "#C9A84C";
const GOLD_GRADIENT = "linear-gradient(135deg, #C9A84C 0%, #e8d08a 50%, #C9A84C 100%)";

/* ─────────────────────────────────────────────────────── */
/* Three flagship panels — image + stat, alternating sides */
/* ─────────────────────────────────────────────────────── */
const FLAGSHIP_PANELS = [
  {
    image: "/assets-2025/images/invest/hero-estate.webp",
    stat: "153%",
    statLabel: "15-YEAR PROJECTED ROI",
    title: "Wealth That Compounds Over Time",
    description:
      "10% guaranteed annual interest for 4 years, then your deposit converts to share capital — delivering escalating dividends from 6% to 20% through Year 15. A structure engineered for NRI investors who think in generations, not quarters.",
    imageRight: false,
  },
  {
    image: "/assets-2025/images/invest/hero-sunset.webp",
    stat: "10%",
    statLabel: "GUARANTEED ANNUAL RETURN",
    title: "Certainty Before the Market Can Touch It",
    description:
      "Your deposit earns a fixed 10% per annum for the first four years — regardless of market conditions, regardless of dividend cycles. A covenant between you and Mater Maria Homes, governed by the Diocese of Palai.",
    imageRight: true,
  },
  {
    image: "/assets-2025/images/invest/hero-aerial.webp",
    stat: "90+",
    statLabel: "PREMIUM RESIDENCES",
    title: "An Estate You Can See, Touch, and Inherit",
    description:
      "20 Independent Villas, 50 Walk-up Villas, 20 Executive Apartments — each net-zero, IoT-enabled, and surrounded by 8+ acres of tropical greenery. Real estate backed by real bricks on real soil in the heart of Kerala.",
    imageRight: false,
  },
];

/* ─────────────────── */
/* Bottom stat ribbon  */
/* ─────────────────── */
const STAT_RIBBON = [
  { stat: "100%", label: "Transparent Governance" },
  { stat: "8+", label: "Acres of Net-Zero Greenery" },
  { stat: "48", label: "Facilities for Residents" },
  { stat: "24/7", label: "Medical & Nursing Care" },
];

/* ─────────────────────────────── */
/* Single Cinematic Panel         */
/* ─────────────────────────────── */
function CinematicPanel({
  panel,
  index,
}: {
  panel: (typeof FLAGSHIP_PANELS)[0];
  index: number;
}) {
  const { image, stat, statLabel, title, description, imageRight } = panel;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full overflow-hidden"
      style={{
        borderRadius: 24,
        minHeight: 480,
        border: "1px solid rgba(201,168,76,0.12)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
      }}
    >
      {/* Background estate image at 50% opacity */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        sizes="100vw"
        priority={index === 0}
      />
      {/* Dark overlay — 50% so image reads as atmosphere */}
      <div
        className="absolute inset-0"
        style={{
          background: imageRight
            ? "linear-gradient(to left, rgba(8,11,20,0.55) 0%, rgba(8,11,20,0.88) 55%, rgba(8,11,20,0.97) 100%)"
            : "linear-gradient(to right, rgba(8,11,20,0.55) 0%, rgba(8,11,20,0.88) 55%, rgba(8,11,20,0.97) 100%)",
        }}
      />

      {/* Content — flex row, optionally reversed */}
      <div
        className={`relative z-10 flex h-full flex-col lg:flex-row lg:items-center ${
          imageRight ? "lg:flex-row-reverse" : ""
        }`}
        style={{ padding: "clamp(2.5rem, 5vw, 4.5rem)" }}
      >
        {/* Stat Block */}
        <div
          className="flex-shrink-0 lg:w-[42%]"
          style={{ paddingRight: imageRight ? 0 : "clamp(2rem, 4vw, 4rem)", paddingLeft: imageRight ? "clamp(2rem, 4vw, 4rem)" : 0 }}
        >
          {/* Gold accent rule */}
          <div
            className="mb-6 h-px"
            style={{ width: 56, background: `linear-gradient(90deg, ${GOLD}, transparent)` }}
          />

          {/* The stat */}
          <div
            className="font-heading leading-none"
            style={{
              fontSize: "clamp(5rem, 12vw, 9rem)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              background: GOLD_GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 40px rgba(201,168,76,0.35))",
            }}
          >
            {stat}
          </div>

          {/* Stat label */}
          <p
            className="mt-3 font-heading uppercase tracking-[0.2em] text-white/40"
            style={{ fontSize: "0.72rem", fontWeight: 700 }}
          >
            {statLabel}
          </p>
        </div>

        {/* Vertical divider — desktop only */}
        <div
          className="my-8 hidden h-px lg:my-0 lg:block lg:h-auto lg:w-px"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.25), transparent)", flexShrink: 0 }}
        />

        {/* Text Block */}
        <div
          className="flex-1"
          style={{ paddingLeft: imageRight ? 0 : "clamp(2rem, 4vw, 4rem)", paddingRight: imageRight ? "clamp(2rem, 4vw, 4rem)" : 0 }}
        >
          <h3
            className="font-heading mb-4 text-white"
            style={{
              fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)",
              fontWeight: 900,
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
            }}
          >
            {title}
          </h3>
          <p
            className="leading-relaxed text-white/60"
            style={{ fontSize: "clamp(0.9rem, 1.2vw, 1.05rem)", fontWeight: 400 }}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Corner index badge */}
      <div
        className="absolute right-6 top-6 font-heading text-xs font-bold uppercase tracking-widest text-white/20"
        style={{ fontSize: "0.65rem" }}
      >
        0{index + 1} / 0{FLAGSHIP_PANELS.length}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────── */
/* Stat Ribbon Item               */
/* ─────────────────────────────── */
function RibbonStat({ item, index }: { item: (typeof STAT_RIBBON)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="flex flex-col items-center gap-2 px-6 py-8"
    >
      <div
        className="font-heading leading-none"
        style={{
          fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
          fontWeight: 900,
          letterSpacing: "-0.03em",
          background: GOLD_GRADIENT,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {item.stat}
      </div>
      <p
        className="text-center font-heading uppercase tracking-[0.18em] text-white/40"
        style={{ fontSize: "0.68rem", fontWeight: 700, maxWidth: 120 }}
      >
        {item.label}
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────── */
/* Main Export                    */
/* ─────────────────────────────── */
export function InvestorPromise() {
  return (
    <section
      className="relative py-24 lg:py-36"
      style={{ background: "linear-gradient(180deg, #080b14 0%, #0a0d18 50%, #080b14 100%)" }}
    >
      {/* Ambient gold glow — top-left */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-[600px] w-[600px] opacity-[0.12]"
        style={{ background: "radial-gradient(circle, rgba(201,168,76,0.5) 0%, transparent 65%)" }}
        aria-hidden="true"
      />
      {/* Ambient gold glow — bottom-right */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] opacity-[0.10]"
        style={{ background: "radial-gradient(circle, rgba(201,168,76,0.4) 0%, transparent 65%)" }}
        aria-hidden="true"
      />

      <Container size="lg">
        {/* ── Section heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 max-w-2xl"
        >
          <p
            className="mb-4 font-heading uppercase tracking-[0.22em]"
            style={{ fontSize: "0.78rem", fontWeight: 700, color: GOLD }}
          >
            Why Invest
          </p>
          <h2
            className="font-heading text-white"
            style={{
              fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
              fontWeight: 900,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
            }}
          >
            Three Reasons the{" "}
            <span
              style={{
                background: GOLD_GRADIENT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Numbers Speak
            </span>
            <br />
            for Themselves
          </h2>
        </motion.div>

        {/* ── Cinematic panels ── */}
        <div className="flex flex-col gap-6">
          {FLAGSHIP_PANELS.map((panel, i) => (
            <CinematicPanel key={panel.title} panel={panel} index={i} />
          ))}
        </div>

        {/* ── Gold divider ── */}
        <div
          className="my-16 h-px w-full"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.5) 30%, rgba(201,168,76,0.5) 70%, transparent 100%)",
          }}
        />

        {/* ── Stat ribbon ── */}
        <div className="grid grid-cols-2 divide-x divide-y divide-white/8 overflow-hidden rounded-2xl lg:grid-cols-4 lg:divide-y-0"
          style={{ border: "1px solid rgba(201,168,76,0.1)", background: "rgba(255,255,255,0.02)" }}
        >
          {STAT_RIBBON.map((item, i) => (
            <RibbonStat key={item.label} item={item} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
