"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PROPERTY_SHOWCASE } from "@/lib/investor-constants";

export function PropertyShowcase() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = PROPERTY_SHOWCASE.length;

  const go = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      setCurrent((c) => (c + dir + total) % total);
    },
    [total]
  );

  // Auto-advance every 5s
  useEffect(() => {
    timerRef.current = setInterval(() => go(1), 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [go]);

  function jumpTo(i: number) {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => go(1), 5000);
  }

  // Visible indices: prev, current, next (3-up desktop layout)
  const prev = (current - 1 + total) % total;
  const next = (current + 1) % total;

  const item = PROPERTY_SHOWCASE[current]!;
  const prevItem = PROPERTY_SHOWCASE[prev]!;
  const nextItem = PROPERTY_SHOWCASE[next]!;

  return (
    <section
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0a0d18 0%, #080b14 50%, #0a0d18 100%)" }}
    >
      {/* Subtle ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <Container size="lg">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <p
            className="mb-4 font-heading uppercase tracking-[0.22em] text-[#C9A84C]"
            style={{ fontSize: "0.8rem", fontWeight: 700 }}
          >
            What Awaits You
          </p>
          <h2
            className="font-heading text-white"
            style={{
              fontSize: "clamp(2rem, 3.5vw, 3rem)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
            }}
          >
            Estate{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #C9A84C, #e8d08a, #C9A84C)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Gallery
            </span>
          </h2>
          <p className="mt-3 text-white/50" style={{ fontSize: "1rem", fontWeight: 400 }}>
            {total} properties — swipe or click to explore
          </p>
        </motion.div>

        {/* 3-panel layout: side | main | side */}
        <div className="relative flex items-center gap-4 lg:gap-6">

          {/* Left arrow */}
          <button
            onClick={() => { go(-1); if (timerRef.current) clearInterval(timerRef.current); }}
            className="relative z-20 flex-shrink-0 flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/10"
            aria-label="Previous property"
          >
            <ChevronLeft className="size-5 text-white/70" />
          </button>

          {/* Cards */}
          <div className="flex flex-1 items-center gap-4 overflow-hidden">

            {/* Side card — prev */}
            <div
              className="hidden lg:block flex-shrink-0 cursor-pointer"
              style={{ width: "22%", opacity: 0.45, transform: "scale(0.92)", transition: "all 0.4s ease" }}
              onClick={() => jumpTo(prev)}
            >
              <SideCard item={prevItem} />
            </div>

            {/* Main card */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 80, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: direction * -60, scale: 0.97 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <MainCard item={item} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Side card — next */}
            <div
              className="hidden lg:block flex-shrink-0 cursor-pointer"
              style={{ width: "22%", opacity: 0.45, transform: "scale(0.92)", transition: "all 0.4s ease" }}
              onClick={() => jumpTo(next)}
            >
              <SideCard item={nextItem} />
            </div>
          </div>

          {/* Right arrow */}
          <button
            onClick={() => { go(1); if (timerRef.current) clearInterval(timerRef.current); }}
            className="relative z-20 flex-shrink-0 flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/10"
            aria-label="Next property"
          >
            <ChevronRight className="size-5 text-white/70" />
          </button>
        </div>

        {/* Dot navigation */}
        <div className="mt-10 flex items-center justify-center gap-2">
          {PROPERTY_SHOWCASE.map((_, i) => (
            <button
              key={i}
              onClick={() => jumpTo(i)}
              className="transition-all duration-300"
              style={{
                width: i === current ? 28 : 8,
                height: 4,
                borderRadius: 9999,
                background: i === current ? "#C9A84C" : "rgba(255,255,255,0.2)",
              }}
              aria-label={`Go to property ${i + 1}`}
            />
          ))}
        </div>

        {/* Counter */}
        <p className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-white/30">
          {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
      </Container>
    </section>
  );
}

/* ── Main (featured) card ─────────────────────────────── */
function MainCard({ item }: { item: typeof PROPERTY_SHOWCASE[0] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Normalise cursor to [-1, 1] range within the card
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x: ny * -4, y: nx * 4 }); // max ±4° rotation
  }

  function handleMouseLeave() {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1200,
        transformStyle: "preserve-3d",
      }}
    >
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: 20,
        aspectRatio: "16/9",
        boxShadow: isHovered
          ? "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.3), 0 0 40px rgba(201,168,76,0.08)"
          : "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.15)",
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.02 : 1})`,
        transition: isHovered ? "transform 0.12s ease-out, box-shadow 0.3s ease" : "transform 0.6s ease, box-shadow 0.3s ease",
        willChange: "transform",
      }}
    >
      <Image
        src={item.image}
        alt={item.title}
        fill
        priority
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 56vw"
      />

      {/* 50% dark overlay so image reads clearly */}
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.50)" }} />

      {/* Bottom content */}
      <div
        className="absolute inset-x-0 bottom-0 p-8"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)" }}
      >
        {/* Gold accent line */}
        <div
          className="mb-4 h-px"
          style={{ width: 48, background: "linear-gradient(90deg, #C9A84C, transparent)" }}
        />
        <h3
          className="font-heading text-white"
          style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800, letterSpacing: "-0.01em" }}
        >
          {item.title}
        </h3>
        <p
          className="mt-2 text-white/65"
          style={{ fontSize: "0.9rem", fontWeight: 400, lineHeight: 1.6 }}
        >
          {item.description}
        </p>
      </div>

      {/* Top-right label */}
      <div className="absolute right-6 top-6">
        <span
          className="rounded-full px-3 py-1.5 font-heading text-xs font-bold uppercase tracking-widest"
          style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.35)", color: "#C9A84C", backdropFilter: "blur(8px)" }}
        >
          Estate View
        </span>
      </div>
    </div>
    </div>
  );
}

/* ── Side (dimmed) card ───────────────────────────────── */
function SideCard({ item }: { item: typeof PROPERTY_SHOWCASE[0] }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ borderRadius: 16, aspectRatio: "3/4", boxShadow: "0 10px 40px rgba(0,0,0,0.4)" }}
    >
      <Image
        src={item.image}
        alt={item.title}
        fill
        className="object-cover"
        sizes="22vw"
      />
      {/* Stronger overlay on side cards */}
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.60)" }} />
      <div
        className="absolute inset-x-0 bottom-0 p-4"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)" }}
      >
        <p className="font-heading text-xs font-bold uppercase tracking-widest text-white/70">
          {item.title}
        </p>
      </div>
    </div>
  );
}
