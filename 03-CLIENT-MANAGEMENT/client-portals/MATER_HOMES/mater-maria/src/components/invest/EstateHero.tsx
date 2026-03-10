"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { ChevronDown } from "lucide-react";
import { INVESTOR_HERO_STATS } from "@/lib/investor-constants";
import { useCurrency } from "@/lib/currency-context";

/* ── Slide data ─────────────────────────────────────── */
const SLIDES = [
  {
    id: "sanctuary",
    image: "/assets-2025/images/invest/hero-estate.webp",
    video: "/assets-2025/videos/promo-short.mp4",
    eyebrow: "The",
    title: "Mater Maria",
    subtitle: "Sanctuary · Elangulam, Kerala",
    caption: "A compassionate haven where exceptional living standards meet spiritual nourishment.",
  },
  {
    id: "wellness",
    image: "/assets-2025/images/invest/meditation.webp",
    video: null,
    eyebrow: "Ayurvedic",
    title: "Wellness",
    subtitle: "Holistic Living · MMT Hospital On-Site",
    caption: "Traditional Kerala Ayurvedic treatments alongside modern 24/7 medical care.",
  },
  {
    id: "residences",
    image: "/assets-2025/images/invest/pool.webp",
    video: null,
    eyebrow: "Premium",
    title: "Residences",
    subtitle: "90 Units · Villas & Executive Apartments",
    caption: "Independent villas, walk-up villas, and executive apartments overlooking the valley.",
  },
  {
    id: "organic",
    image: "/assets-2025/images/invest/farm.webp",
    video: null,
    eyebrow: "Net-Zero",
    title: "Estate",
    subtitle: "100% Solar · Organic Farm · Fishing Ponds",
    caption: "A self-sustaining ecosystem powered entirely by renewable energy.",
  },
];

const UNIT_TYPES = [
  { label: "All Residences", value: "" },
  { label: "Independent Villa", value: "villa" },
  { label: "Walk-up Villa", value: "walkup" },
  { label: "Executive Apt", value: "apt" },
];

/* ── Variants ────────────────────────────────────────── */
const imgVariants: Variants = {
  enter: { opacity: 0, scale: 1.06 },
  center: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] } },
  exit:  { opacity: 0, scale: 1.02, transition: { duration: 0.8, ease: "easeIn" } },
};

const textVariants: Variants = {
  enter:  { opacity: 0, y: 28 },
  center: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.25 } },
  exit:   { opacity: 0, y: -18, transition: { duration: 0.45, ease: "easeIn" } },
};

/* ── Component ───────────────────────────────────────── */
export function EstateHero() {
  const [idx, setIdx]             = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [unitOpen, setUnitOpen]   = useState(false);
  const [tierOpen, setTierOpen]   = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedTier, setSelectedTier] = useState("");
  const barRef    = useRef<HTMLDivElement>(null);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const { formatAmount } = useCurrency();

  const advance = useCallback((dir: 1 | -1 = 1) => {
    setIdx(i => (i + dir + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => advance(1), 5500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [advance, idx]);

  useEffect(() => {
    const timer = setTimeout(() => setStatsVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  function resetTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => advance(1), 5500);
  }

  function goTo(i: number) { setIdx(i); resetTimer(); }

  function handleSearch() {
    document.querySelector("#investment-tiers")?.scrollIntoView({ behavior: "smooth" });
  }

  const slide = SLIDES[idx];

  return (
    <section id="estate-hero" className="relative flex min-h-dvh flex-col overflow-hidden">

      {/* ── Slide images ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id + "-bg"}
          className="absolute inset-0 z-0"
          variants={imgVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {slide.video && idx === 0 ? (
            <video
              autoPlay muted loop playsInline
              poster={slide.image ?? undefined}
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={slide.video} type="video/mp4" />
            </video>
          ) : slide.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/25" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 65% 50% at 50% 55%, rgba(0,0,0,0.38), transparent 80%)",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Centered headline text ── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-44 pt-32 text-center">

        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="mb-5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets-2025/images/mater-maria-logo.svg"
            alt="Mater Maria Homes"
            className="mx-auto h-14 w-auto lg:h-18"
            style={{
              filter:
                "drop-shadow(0 0 24px rgba(192,160,85,0.85)) brightness(1.1)",
            }}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id + "-text"}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col items-center"
          >
            <p className="mb-1 font-heading text-base font-light uppercase tracking-[0.55em] text-white/85 lg:text-lg">
              {slide.eyebrow}
            </p>

            <h1
              className="font-heading font-bold uppercase text-white"
              style={{
                fontSize: "clamp(3.8rem, 13vw, 11rem)",
                lineHeight: 0.95,
                letterSpacing: "0.04em",
                textShadow: "0 2px 40px rgba(0,0,0,0.4)",
              }}
            >
              {slide.title}
            </h1>

            <p
              className="mt-4 font-heading text-xs font-light uppercase tracking-[0.45em] lg:text-sm"
              style={{ color: "rgba(192,160,85,0.9)" }}
            >
              {slide.subtitle}
            </p>

            <p className="mt-5 max-w-md font-body text-sm leading-relaxed text-white/60 lg:max-w-lg lg:text-base">
              {slide.caption}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Slide dots */}
        <div className="mt-10 flex items-center gap-3">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === idx ? 28 : 8,
                background: i === idx ? "#c0a055" : "rgba(255,255,255,0.35)",
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Scroll arrow */}
        <motion.div
          className="mt-8"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="size-6 text-white/40" />
        </motion.div>
      </div>

      {/* ── Stats strip ── */}
      <div className="relative z-10 hidden justify-center gap-10 pb-5 sm:flex">
        {INVESTOR_HERO_STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="font-heading text-2xl font-bold text-white lg:text-3xl">
              {stat.suffix === "Net-Zero" ? (
                <span className="text-xl">Net-Zero</span>
              ) : (
                <>
                  <NumberFlow
                    value={statsVisible ? stat.value : 0}
                    format={{ useGrouping: false }}
                    transformTiming={{ duration: 1400, easing: "ease-out" }}
                  />
                  <span style={{ color: "#c0a055" }}>{stat.suffix}</span>
                </>
              )}
            </div>
            <p className="text-[10px] uppercase tracking-widest text-white/45">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Emaar-style filter bar pinned to bottom ── */}
      <div ref={barRef} className="relative z-20 px-4 pb-7 lg:px-8">
        <div
          className="mx-auto flex max-w-5xl items-stretch divide-x overflow-hidden rounded-full"
          style={{
            background: "rgba(255,255,255,0.11)",
            backdropFilter: "blur(22px) saturate(1.5)",
            border: "1px solid rgba(255,255,255,0.17)",
            boxShadow: "0 8px 48px rgba(0,0,0,0.4)",
          }}
        >
          {/* Investment Tier */}
          <div className="relative flex-1">
            <button
              className="flex w-full items-center justify-between gap-2 px-5 py-4 text-left sm:px-6"
              onClick={() => { setTierOpen(o => !o); setUnitOpen(false); }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80 sm:text-[11px]">
                {selectedTier
                  ? ["Diamond","Platinum","Gold","Silver"].find((_,i) => ["diamond","platinum","gold","silver"][i] === selectedTier) ?? "Tier"
                  : "Investment Tier"}
              </span>
              <ChevronDown
                className="size-3 text-white/55 transition-transform duration-200"
                style={{ transform: tierOpen ? "rotate(180deg)" : "" }}
              />
            </button>
            {tierOpen && (
              <div
                className="absolute bottom-full left-0 mb-2 w-44 overflow-hidden rounded-2xl py-1"
                style={{
                  background: "rgba(8,8,18,0.94)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {[
                  { label: "All Tiers",  value: "" },
                  { label: "Diamond — ₹30L",  value: "diamond" },
                  { label: "Platinum — ₹20L", value: "platinum" },
                  { label: "Gold — ₹10L",     value: "gold" },
                  { label: "Silver — ₹5L",    value: "silver" },
                ].map(t => (
                  <button
                    key={t.value}
                    className="w-full px-4 py-2.5 text-left text-[11px] transition-colors hover:bg-white/5"
                    style={{ color: selectedTier === t.value ? "#c0a055" : "rgba(255,255,255,0.75)" }}
                    onClick={() => { setSelectedTier(t.value); setTierOpen(false); }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px shrink-0 bg-white/14" />

          {/* Residence Type */}
          <div className="relative flex-1">
            <button
              className="flex w-full items-center justify-between gap-2 px-5 py-4 text-left sm:px-6"
              onClick={() => { setUnitOpen(o => !o); setTierOpen(false); }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80 sm:text-[11px]">
                {selectedUnit
                  ? UNIT_TYPES.find(u => u.value === selectedUnit)?.label ?? "Type"
                  : "Residence Type"}
              </span>
              <ChevronDown
                className="size-3 text-white/55 transition-transform duration-200"
                style={{ transform: unitOpen ? "rotate(180deg)" : "" }}
              />
            </button>
            {unitOpen && (
              <div
                className="absolute bottom-full left-0 mb-2 w-48 overflow-hidden rounded-2xl py-1"
                style={{
                  background: "rgba(8,8,18,0.94)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {UNIT_TYPES.map(u => (
                  <button
                    key={u.value}
                    className="w-full px-4 py-2.5 text-left text-[11px] transition-colors hover:bg-white/5"
                    style={{ color: selectedUnit === u.value ? "#c0a055" : "rgba(255,255,255,0.75)" }}
                    onClick={() => { setSelectedUnit(u.value); setUnitOpen(false); }}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px shrink-0 bg-white/14" />

          {/* Price Range */}
          <div className="hidden flex-1 items-center px-6 py-4 sm:flex">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
              {formatAmount(5)} – {formatAmount(30)}
            </span>
          </div>

          <div className="hidden w-px shrink-0 bg-white/14 sm:block" />

          {/* Location */}
          <div className="hidden flex-1 items-center px-6 py-4 lg:flex">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
              Kottayam, Kerala
            </span>
          </div>

          {/* CTA */}
          <button
            onClick={handleSearch}
            className="flex shrink-0 items-center gap-2 rounded-full px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0a0a14] transition-opacity hover:opacity-90 sm:px-8 sm:text-[11px]"
            style={{ background: "#c0a055", margin: "5px" }}
          >
            Explore Tiers
          </button>
        </div>
      </div>
    </section>
  );
}
