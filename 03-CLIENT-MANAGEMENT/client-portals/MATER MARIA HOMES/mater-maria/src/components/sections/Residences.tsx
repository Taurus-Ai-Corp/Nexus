"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Maximize2, BedDouble, PlayCircle } from "lucide-react";
import Link from "next/link";
import { RESIDENCES } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ResidenceCardProps {
  residence: (typeof RESIDENCES)[number];
  availabilityText: string;
  availabilityColor?: "emerald" | "amber";
  className?: string;
  imageAspect?: string;
}

function ResidenceCard({
  residence,
  availabilityText,
  availabilityColor = "emerald",
  className,
  imageAspect = "aspect-[16/10]",
}: ResidenceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [imgOffset, setImgOffset] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setImgOffset({ x: nx * -20, y: ny * -20 });
    setTilt({ x: ny * -4, y: nx * 4 });
  }

  function onLeave() {
    setHovered(false);
    setImgOffset({ x: 0, y: 0 });
    setTilt({ x: 0, y: 0 });
  }

  const dotColor = availabilityColor === "amber" ? "#F59E0B" : "#22C55E";

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: hovered ? "transform 0.12s ease-out" : "transform 0.6s ease",
      }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-surface cursor-pointer select-none",
        hovered
          ? "border-accent-default/40 shadow-[0_24px_64px_rgba(193,144,40,0.18)]"
          : "border-border-default shadow-md",
        "transition-[border-color,box-shadow] duration-400",
        className
      )}
    >
      {/* ── Image with parallax ────────────────────────────── */}
      <div className={cn("relative overflow-hidden", imageAspect)}>
        <img
          src={residence.image}
          alt={`${residence.name} — ${residence.sqft} sq ft ${residence.bedrooms} residence at Mater Maria Homes`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            transform: `translate(${imgOffset.x}px, ${imgOffset.y}px) scale(1.12)`,
            transition: hovered ? "transform 0.15s ease-out" : "transform 0.8s ease",
          }}
        />

        {/* Persistent bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Availability badge — top left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 backdrop-blur-sm">
          <span
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ background: dotColor }}
          />
          <span className="text-white text-xs font-semibold tracking-wide">{availabilityText}</span>
        </div>

        {/* Tag badge — top right */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-black/55 text-amber-300 border-amber-300/30 text-xs backdrop-blur-sm font-semibold">
            {residence.tag}
          </Badge>
        </div>

        {/* ── Spec reveal strip — slides up on hover ──────── */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center gap-4 bg-gradient-to-t from-black/95 to-black/60 px-4 py-3 backdrop-blur-[2px]"
          style={{
            transform: hovered ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.38s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          <span className="flex items-center gap-1.5 text-white text-sm font-semibold">
            <Maximize2 className="h-3.5 w-3.5 text-amber-300" />
            {residence.sqft} sq.ft
          </span>
          <span className="flex items-center gap-1.5 text-white text-sm font-semibold">
            <BedDouble className="h-3.5 w-3.5 text-amber-300" />
            {residence.bedrooms}
          </span>
          <button className="ml-auto flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider hover:text-amber-200 transition-colors">
            <PlayCircle className="h-4 w-4" />
            Virtual Tour
          </button>
        </div>
      </div>

      {/* ── Card body ────────────────────────────────────── */}
      <div className="p-5">
        <div className="mb-2">
          <h3 className="font-heading text-xl font-bold text-text-primary">{residence.name}</h3>
        </div>

        <div className="mb-3 flex items-center gap-4 text-sm font-semibold text-text-muted">
          <span className="flex items-center gap-1.5">
            <Maximize2 className="h-3.5 w-3.5" />
            {residence.sqft} sq.ft
          </span>
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-3.5 w-3.5" />
            {residence.bedrooms}
          </span>
        </div>

        <p className="text-sm font-medium leading-relaxed text-text-secondary line-clamp-2">
          {residence.description}
        </p>

        <div className="mt-4">
          <button
            className="flex items-center gap-1.5 text-sm font-bold text-accent-default transition-all duration-200 hover:gap-3"
            aria-label={`View details for ${residence.name}`}
          >
            View Details
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Residences() {
  // Independent Villa=idx2, Walk-up Villa=idx0, Executive Suite=idx1
  const [walkup, executive, independent] = RESIDENCES;

  return (
    <section className="bg-surface py-24 lg:py-32">
      <Container size="lg">
        <SectionHeading badge="Our Homes" title="Choose Your Residence" />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Independent Villa — left */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
          >
            <ResidenceCard
              residence={independent}
              availabilityText="3 villas left"
              imageAspect="aspect-[4/3]"
            />
          </motion.div>

          {/* Walk-up Villa — right */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
          >
            <ResidenceCard
              residence={walkup}
              availabilityText="Limited units"
              availabilityColor="amber"
              imageAspect="aspect-[4/3]"
            />
          </motion.div>

          {/* Executive Suite — full-width panoramic bottom card */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
          >
            <ResidenceCard
              residence={executive}
              availabilityText="Available now"
              imageAspect="aspect-[21/9]"
            />
          </motion.div>
        </div>

        {/* Explore CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Link
            href="/residences"
            className="inline-flex items-center gap-2 rounded-full border border-accent-default/40 px-7 py-3 text-sm font-bold text-accent-default transition-all duration-300 hover:bg-accent-default/8 hover:border-accent-default hover:gap-3"
          >
            Explore All Residences
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
