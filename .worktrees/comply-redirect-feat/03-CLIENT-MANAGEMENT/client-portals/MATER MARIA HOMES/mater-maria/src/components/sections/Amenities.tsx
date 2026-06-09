"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";
import { AMENITIES } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import {
  AIHealthIcon,
  WellnessSpaIcon,
  CommunityNodesIcon,
  OrganicKitchenIcon,
  SmartLivingIcon,
} from "@/components/icons/estate-icons";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  HeartPulse: AIHealthIcon,
  Sparkles: WellnessSpaIcon,
  Users: CommunityNodesIcon,
  UtensilsCrossed: OrganicKitchenIcon,
  Cpu: SmartLivingIcon,
  Gamepad2,
};

/** Per-category color identity — accent + ambient glow */
const PALETTE: Record<string, { accent: string; glow: string }> = {
  Healthcare:    { accent: "#F5C842", glow: "rgba(245,200,66,0.20)" },
  Wellness:      { accent: "#86EFAC", glow: "rgba(134,239,172,0.18)" },
  Community:     { accent: "#FDB87D", glow: "rgba(253,184,125,0.18)" },
  Dining:        { accent: "#FDA4AF", glow: "rgba(253,164,175,0.18)" },
  "Smart Living":{ accent: "#7DD3FC", glow: "rgba(125,211,252,0.18)" },
  Recreation:    { accent: "#C4B5FD", glow: "rgba(196,181,253,0.18)" },
};

function AmenityCard({
  amenity,
  index,
}: {
  amenity: (typeof AMENITIES)[number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [scanY, setScanY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const palette = PALETTE[amenity.category] ?? PALETTE["Healthcare"];
  const Icon = iconMap[amenity.icon];
  const total = amenity.items.length;

  // Ring progress SVG
  const radius = 20;
  const circ = 2 * Math.PI * radius;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: ny * -5, y: nx * 5 });
    setScanY(e.clientY - rect.top);
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true, margin: "-40px" }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: hovered ? "transform 0.12s ease-out" : "transform 0.5s ease",
      }}
      className="relative overflow-hidden rounded-2xl flex flex-col gap-5 p-6 cursor-pointer"
    >
      {/* ── Glassmorphism dark background ─────────────────── */}
      <div className="absolute inset-0 rounded-2xl bg-[#070B13]/92 backdrop-blur-2xl" />

      {/* ── Animated border ───────────────────────────────── */}
      <div
        className="absolute inset-0 rounded-2xl border transition-all duration-500"
        style={{ borderColor: hovered ? `${palette.accent}55` : "rgba(255,255,255,0.08)" }}
      />

      {/* ── Ambient radial glow on hover ──────────────────── */}
      <div
        className="absolute inset-0 rounded-2xl transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${palette.glow}, transparent 65%)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* ── Corner accent geometry ────────────────────────── */}
      <div
        className="absolute top-0 right-0 h-16 w-16 rounded-bl-[40px] rounded-tr-2xl opacity-10 transition-opacity duration-400"
        style={{
          background: `linear-gradient(225deg, ${palette.accent}60, transparent)`,
          opacity: hovered ? 0.25 : 0.08,
        }}
      />

      {/* ── Cursor scan line ──────────────────────────────── */}
      {hovered && (
        <div
          className="pointer-events-none absolute left-0 right-0 h-px"
          style={{
            top: scanY,
            background: `linear-gradient(to right, transparent, ${palette.accent}90, transparent)`,
          }}
        />
      )}

      {/* ── Icon + title ──────────────────────────────────── */}
      <div className="relative z-10 flex items-center gap-4">
        {/* Orbital ring + icon */}
        <div className="relative h-12 w-12 shrink-0">
          <svg
            className="absolute inset-0 h-full w-full -rotate-90"
            viewBox="0 0 48 48"
          >
            {/* Track */}
            <circle
              cx="24" cy="24" r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1.5"
            />
            {/* Progress arc */}
            <circle
              cx="24" cy="24" r={radius}
              fill="none"
              stroke={palette.accent}
              strokeWidth="1.5"
              strokeDasharray={circ}
              strokeDashoffset={hovered ? 0 : circ * 0.42}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
            />
          </svg>
          {/* Icon bg */}
          <div
            className="absolute inset-[8px] rounded-full flex items-center justify-center transition-all duration-400"
            style={{ background: hovered ? `${palette.accent}22` : `${palette.accent}10`, color: palette.accent }}
          >
            {Icon && <Icon className="h-4 w-4" />}
          </div>
        </div>

        {/* Title + status */}
        <div>
          <h3 className="font-heading text-base font-bold leading-tight text-white/95">
            {amenity.category}
          </h3>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ background: "#22C55E" }}
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-400/70">
              {total} facilities · Active
            </span>
          </div>
        </div>
      </div>

      {/* ── Items list ────────────────────────────────────── */}
      <ul className="relative z-10 flex flex-col gap-2">
        {amenity.items.map((item, i) => (
          <motion.li
            key={item}
            animate={{ x: hovered ? 5 : 0 }}
            transition={{ delay: hovered ? i * 0.04 : 0, duration: 0.2 }}
            className="flex items-center gap-2.5"
          >
            <span
              className="h-1 w-1 shrink-0 rounded-full transition-all duration-300"
              style={{ background: hovered ? palette.accent : "rgba(255,255,255,0.25)" }}
            />
            <span
              className="text-sm font-medium transition-colors duration-300"
              style={{ color: hovered ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.50)" }}
            >
              {item}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Amenities() {
  return (
    <section
      className="theme-lifestyle relative overflow-hidden py-24 lg:py-32"
    >
      {/* ── Ambient background blobs ──────────────────────── */}
      <div
        className="pointer-events-none absolute -top-60 left-1/4 h-[500px] w-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, #C19028, transparent 60%)", filter: "blur(100px)", opacity: 0.04 }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-0 h-[400px] w-[400px] rounded-full"
        style={{ background: "radial-gradient(circle, #1B3A6B, transparent 60%)", filter: "blur(80px)", opacity: 0.05 }}
      />

      {/* ── Dot grid background ───────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(193,144,40,0.9) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <Container size="lg">
        {/* ── Section heading (hardcoded for dark bg) ───────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/8 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-amber-300 backdrop-blur-sm">
            Everything You Need
          </span>
          <h2
            className="font-heading text-4xl font-bold text-white sm:text-5xl lg:text-6xl"
            style={{ letterSpacing: "-0.03em" }}
          >
            World-Class Amenities
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-white/55">
            48 premium facilities across 6 categories — all included for Mater Maria residents.
          </p>
        </motion.div>

        {/* ── Cards grid ───────────────────────────────────── */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AMENITIES.map((amenity, index) => (
            <AmenityCard key={amenity.category} amenity={amenity} index={index} />
          ))}
        </div>

        {/* ── Footer stats ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-14 flex flex-wrap items-center justify-center gap-8 border-t border-white/8 pt-10"
        >
          {[
            { value: "48", label: "World-class facilities" },
            { value: "6", label: "Wellness categories" },
            { value: "24/7", label: "Active monitoring" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-heading text-2xl font-bold" style={{ color: "#F5C842" }}>
                {value}
              </div>
              <div className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-white/40">
                {label}
              </div>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
