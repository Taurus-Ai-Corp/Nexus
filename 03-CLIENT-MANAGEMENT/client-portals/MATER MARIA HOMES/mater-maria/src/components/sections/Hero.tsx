"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/brand-logo";

/* ── Slides ──────────────────────────────────────────────── */
const SLIDES = [
  {
    bg: "/assets-2025/images/invest/hero-estate.webp",
    next: "/assets-2025/images/invest/hero-sunset.webp",
  },
  {
    bg: "/assets-2025/images/invest/hero-sunset.webp",
    next: "/assets-2025/images/invest/hero-garden.webp",
  },
  {
    bg: "/assets-2025/images/invest/hero-garden.webp",
    next: "/assets-2025/images/invest/hero-estate.webp",
  },
] as const;

const STATS = [
  { value: "90+",  label: "Premium Residences" },
  { value: "91%",  label: "5-Year ROI" },
  { value: "24/7", label: "On-Campus Medical" },
];

/* ── Component ───────────────────────────────────────────── */
export function Hero() {
  const [slide, setSlide] = useState(0);

  const next = useCallback(() => setSlide((s) => (s + 1) % SLIDES.length), []);
  const prev = useCallback(
    () => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length),
    [],
  );

  useEffect(() => {
    const t = setInterval(next, 6500);
    return () => clearInterval(t);
  }, [next]);

  const current = SLIDES[slide];

  return (
    <section
      className="relative flex min-h-screen flex-col overflow-hidden"
      aria-label="Hero"
    >
      {/* ── Background slides ──────────────────────────── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slide}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        >
          <Image
            src={current.bg}
            alt="Mater Maria Homes estate in Kanjirappally, Kerala — luxury wellness residences surrounded by tropical greenery"
            fill
            priority
            quality={90}
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Cinematic overlay — dark top-to-bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/75" />
          {/* Extra side vignettes */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* ── Top gold line ───────────────────────────────── */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-20"
        style={{
          background:
            "linear-gradient(90deg, transparent, #C9A84C 30%, #C9A84C 70%, transparent)",
        }}
        aria-hidden
      />

      {/* ════════════════════════════════════════════════
          TOP CONTENT — Logo + Brand + Watermark heading
          (matches reference: text sits high, near top)
          ════════════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col items-center pt-28 px-6 text-center">

        {/* Logo + coloured brand name */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <BrandLogo height={72} onDark />
        </motion.div>

        {/* ── WATERMARK — sits just below the logo ─────── */}
        <motion.div
          className="mt-6 w-full overflow-hidden"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              /* ← REDUCED from 8.6vw to 6.8vw — fits on one line */
              fontSize: "clamp(30px, 6.8vw, 108px)",
              fontWeight: 900,
              letterSpacing: "-0.025em",
              /* Dark charcoal semi-transparent — matches reference "EGYPT" style */
              color: "rgba(210, 200, 190, 0.28)",
              lineHeight: 1,
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
          >
            MATER MARIA HOMES
          </h1>
        </motion.div>

        {/* Living Refined tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            fontFamily: "var(--font-heading)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(12px, 1.5vw, 22px)",
            color: "#C9A84C",
            letterSpacing: "0.16em",
            marginTop: "10px",
          }}
        >
          Living Refined
        </motion.p>
      </div>

      {/* ════════════════════════════════════════════════
          BOTTOM STRIP — stats · description · thumbnail
          (matches reference layout exactly)
          ════════════════════════════════════════════════ */}
      <div className="relative z-10 mt-auto px-8 pb-10 md:px-14 lg:px-20">
        <div className="flex items-end justify-between gap-6">

          {/* LEFT: stats + CTA */}
          <motion.div
            className="flex flex-col gap-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            <div className="flex gap-6 md:gap-10">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span
                    className="font-heading font-bold"
                    style={{
                      fontSize: "clamp(18px, 2.2vw, 32px)",
                      color: "#C9A84C",
                      textShadow: "0 2px 16px rgba(201,168,76,0.5)",
                    }}
                  >
                    {s.value}
                  </span>
                  <span
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.45)",
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA — pill style matching reference */}
            <button
              className="flex items-center gap-2.5 self-start rounded-full px-7 py-3 text-sm font-semibold text-[#0A0A18] transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #e8d08a)",
                boxShadow: "0 4px 20px rgba(201,168,76,0.4)",
              }}
            >
              Schedule a Visit
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>

          {/* CENTER: description + location (hidden on mobile) */}
          <motion.div
            className="hidden max-w-xs flex-1 lg:block"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
          >
            <p
              style={{
                fontSize: "clamp(12px, 1vw, 15px)",
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.75,
              }}
            >
              Kerala&apos;s first AI-powered net-zero wellness estate — where compassionate care meets spiritual nourishment in the heart of the Western Ghats.
            </p>
            <p
              style={{
                fontSize: "9px",
                letterSpacing: "0.35em",
                color: "rgba(255,255,255,0.28)",
                textTransform: "uppercase",
                marginTop: "10px",
              }}
            >
              Elangulam · Kanjirappally · Kerala
            </p>
          </motion.div>

          {/* RIGHT: slide counter + thumbnail (matches reference 01/10 card) */}
          <motion.div
            className="hidden flex-col items-end gap-3 md:flex"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.72 }}
          >
            {/* Thumbnail card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`thumb-${slide}`}
                className="relative overflow-hidden rounded-xl"
                style={{
                  width: "185px",
                  height: "120px",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
                initial={{ opacity: 0, scale: 0.93 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.93 }}
                transition={{ duration: 0.35 }}
              >
                <Image
                  src={current.next}
                  alt="Preview of next estate view"
                  fill
                  className="object-cover"
                  sizes="185px"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: "#C9A84C", opacity: 0.5 }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Counter + arrows — exact reference style */}
            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-white/40 transition-all hover:border-[#C9A84C]/60 hover:text-[#C9A84C]"
                aria-label="Previous"
                style={{ fontSize: "12px" }}
              >
                ←
              </button>
              {/* Dot nav */}
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === slide ? "22px" : "6px",
                    height: "6px",
                    background: i === slide ? "#C9A84C" : "rgba(255,255,255,0.28)",
                  }}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
              <button
                onClick={next}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-white/40 transition-all hover:border-[#C9A84C]/60 hover:text-[#C9A84C]"
                aria-label="Next"
                style={{ fontSize: "12px" }}
              >
                →
              </button>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                0{slide + 1}/0{SLIDES.length}
              </span>
            </div>

            {/* Horizontal progress line — matches reference */}
            <div
              className="h-px self-stretch"
              style={{ background: "rgba(255,255,255,0.12)" }}
            >
              <motion.div
                className="h-full"
                style={{ background: "#C9A84C" }}
                animate={{ width: `${((slide + 1) / SLIDES.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <Link
              href="/tour"
              className="text-[11px] tracking-widest uppercase text-white/35 hover:text-white/60 transition-colors"
            >
              Watch Tour →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
