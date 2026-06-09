"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, Instagram, Facebook, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/* ── Property cards (right panel) ──────────────────────── */
const PROPERTIES = [
  {
    id: "villas",
    image: "/assets-2025/images/invest/hero-estate.webp",
    label: "Independent Villas",
    sub: "20 units · From ₹80L",
    tag: "Most Exclusive",
  },
  {
    id: "walkup",
    image: "/assets-2025/images/invest/hero-sunset.webp",
    label: "Walk-up Villas",
    sub: "50 units · From ₹38L",
    tag: "Best Value",
  },
  {
    id: "apartments",
    image: "/assets-2025/images/invest/hero-garden.webp",
    label: "Executive Apartments",
    sub: "20 units · From ₹38L",
    tag: "Entry Tier",
  },
] as const;

/* ── Editorial slides (left panel copy) ────────────────── */
const SLIDES = [
  {
    id: "sanctuary",
    badge: "Invest · Kerala",
    heading: "Where Nature\nMeets Luxury",
    subheading: "Kerala's first AI-powered net-zero wellness estate",
    desc: "A compassionate haven in the Western Ghats foothills — 90 premium residences, on-site medical care, and 8+ acres of organic greenery.",
  },
  {
    id: "returns",
    badge: "Financial Returns",
    heading: "150%+\nProjected ROI",
    subheading: "Share-based model with 10% annual interest",
    desc: "Tier-based investment from ₹10 Lakhs. 10% interest Years 1–4, escalating dividends 6%–20% Years 5–15. NRI payment channels available.",
  },
  {
    id: "wellness",
    badge: "Wellness & Care",
    heading: "Live Better,\nStay Healthier",
    subheading: "AI health monitoring · Ayurvedic treatments · MMT Hospital",
    desc: "24/7 ambulance, on-site nursing, IoT vital sensors, fall detection — holistic care woven into every corner of daily life.",
  },
];

const SOCIAL = [
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Facebook, href: "#", label: "Facebook" },
  { Icon: Youtube, href: "#", label: "YouTube" },
];

/* ── Component ─────────────────────────────────────────── */
export function EstateHero() {
  const [slide, setSlide] = useState(0);

  const next = useCallback(() => setSlide((s) => (s + 1) % SLIDES.length), []);
  const prev = useCallback(
    () => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length),
    [],
  );

  useEffect(() => {
    const t = setInterval(next, 7000);
    return () => clearInterval(t);
  }, [next]);

  const current = SLIDES[slide];

  return (
    <section
      id="estate-hero"
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{ background: "linear-gradient(135deg, #06080f 0%, #0c1020 50%, #080c18 100%)" }}
    >
      {/* Top gold accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-30"
        style={{
          background:
            "linear-gradient(90deg, transparent, #C9A84C 35%, #C9A84C 65%, transparent)",
        }}
        aria-hidden
      />

      {/* ── Main content split ────────────────────────────── */}
      <div className="relative z-10 flex flex-1 flex-col lg:flex-row">

        {/* ── LEFT PANEL — editorial text ─────────────────── */}
        <div className="flex flex-1 flex-col justify-center px-8 pb-8 pt-32 lg:px-16 lg:pb-0 lg:pt-0 lg:max-w-[52%]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              {/* Badge */}
              <div className="mb-8 flex items-center gap-3">
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.25em]"
                  style={{
                    borderColor: "rgba(201,168,76,0.35)",
                    color: "#C9A84C",
                    background: "rgba(201,168,76,0.08)",
                  }}
                >
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: "#C9A84C" }}
                  />
                  {current.badge}
                </span>
              </div>

              {/* Main heading */}
              <h1
                className="font-heading font-black text-white"
                style={{
                  fontSize: "clamp(2.8rem, 5.5vw, 5.4rem)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.03em",
                  whiteSpace: "pre-line",
                }}
              >
                {current.heading}
              </h1>

              {/* Gold italic subheading */}
              <p
                className="mt-5 font-heading"
                style={{
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: "clamp(0.95rem, 1.4vw, 1.25rem)",
                  color: "#C9A84C",
                  letterSpacing: "0.04em",
                }}
              >
                {current.subheading}
              </p>

              {/* Thin gold rule */}
              <div
                className="my-6 h-px"
                style={{
                  width: "48px",
                  background: "linear-gradient(90deg, #C9A84C, transparent)",
                }}
              />

              {/* Description */}
              <p
                className="max-w-sm leading-relaxed text-white/55"
                style={{ fontSize: "clamp(0.85rem, 1.1vw, 1rem)" }}
              >
                {current.desc}
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="#investment-tiers"
                  className="group flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold text-[#0A0A18] transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #C9A84C, #e8d08a)",
                    boxShadow: "0 4px 24px rgba(201,168,76,0.38)",
                  }}
                >
                  Explore Investment
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>

                <a
                  href={`https://wa.me/919447080356?text=I'm interested in Mater Maria investment opportunities`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-white/18 bg-white/6 px-6 py-3.5 text-sm font-medium text-white/75 backdrop-blur-sm transition-all hover:border-white/35 hover:text-white"
                >
                  WhatsApp Us
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── RIGHT PANEL — property cards ────────────────── */}
        <div className="relative flex flex-shrink-0 flex-col justify-center gap-3 px-6 pb-24 pt-8 lg:w-[48%] lg:px-10 lg:py-20">
          {/* Subtle right edge vignette */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-32 hidden lg:block"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(6,8,15,0.6))",
            }}
            aria-hidden
          />

          {PROPERTIES.map((prop, i) => (
            <motion.div
              key={prop.id}
              className="group relative overflow-hidden rounded-2xl"
              style={{ height: "clamp(120px, 16vh, 200px)" }}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.1 }}
              whileHover={{ scale: 1.012 }}
            >
              <Image
                src={prop.image}
                alt={prop.label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 90vw, 45vw"
              />

              {/* Dark veil */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-black/15" />

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-between px-5">
                {/* Left: index + name */}
                <div className="flex items-center gap-4">
                  <span
                    className="font-heading text-xl font-black"
                    style={{ color: "rgba(201,168,76,0.6)" }}
                  >
                    0{i + 1}
                  </span>
                  <div>
                    <p
                      className="font-heading font-bold text-white"
                      style={{ fontSize: "clamp(0.85rem, 1.2vw, 1.05rem)", letterSpacing: "-0.01em" }}
                    >
                      {prop.label}
                    </p>
                    <p
                      className="mt-0.5 text-white/55"
                      style={{ fontSize: "0.72rem", letterSpacing: "0.06em" }}
                    >
                      {prop.sub}
                    </p>
                  </div>
                </div>

                {/* Right: tag badge */}
                <span
                  className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em]"
                  style={{
                    background: "rgba(201,168,76,0.15)",
                    color: "#C9A84C",
                    border: "1px solid rgba(201,168,76,0.25)",
                  }}
                >
                  {prop.tag}
                </span>
              </div>

              {/* Bottom gold line on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                style={{ background: "#C9A84C" }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM NAV BAR ────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-4 lg:px-16"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(6,8,15,0.95))",
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Social icons */}
        <div className="flex items-center gap-5">
          {SOCIAL.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="text-white/30 transition-colors hover:text-[#C9A84C]"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        {/* Slide dots (center) */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === slide ? "24px" : "6px",
                height: "6px",
                background:
                  i === slide ? "#C9A84C" : "rgba(255,255,255,0.25)",
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Arrows + counter */}
        <div className="flex items-center gap-4">
          <button
            onClick={prev}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/40 transition-all hover:border-[#C9A84C]/50 hover:text-[#C9A84C]"
            aria-label="Previous"
            style={{ fontSize: "13px" }}
          >
            ←
          </button>
          <span
            className="font-heading"
            style={{
              fontSize: "11px",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.38)",
            }}
          >
            0{slide + 1}&thinsp;—&thinsp;0{SLIDES.length}
          </span>
          <button
            onClick={next}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/40 transition-all hover:border-[#C9A84C]/50 hover:text-[#C9A84C]"
            aria-label="Next"
            style={{ fontSize: "13px" }}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
