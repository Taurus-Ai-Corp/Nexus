"use client";

import { motion } from "framer-motion";
import {
  Theater,
  Home,
  Award,
  FileText,
  Key,
  Sparkles,
  Star,
} from "lucide-react";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { Container } from "@/components/ui/container";
import { INVESTOR_PERKS } from "@/lib/investor-constants";

const ICON_MAP = {
  Theater,
  Home,
  Award,
  FileText,
  Key,
  Sparkles,
} as const;

/* Which tiers get each perk */
const PERK_TIERS: Record<string, { label: string; color: string }[]> = {
  "Event Hall": [
    { label: "Platinum", color: "#D8CBB8" },
    { label: "Diamond", color: "#F5C842" },
  ],
  "Guest House": [
    { label: "Gold", color: "#F4B830" },
    { label: "Platinum", color: "#D8CBB8" },
    { label: "Diamond", color: "#F5C842" },
  ],
  "Patron Wall": [
    { label: "Platinum", color: "#D8CBB8" },
    { label: "Diamond", color: "#F5C842" },
  ],
  "Board Reports": [
    { label: "Gold", color: "#F4B830" },
    { label: "Platinum", color: "#D8CBB8" },
    { label: "Diamond", color: "#F5C842" },
  ],
  "Estate Access": [
    { label: "Silver", color: "#A8C8E0" },
    { label: "Gold", color: "#F4B830" },
    { label: "Platinum", color: "#D8CBB8" },
    { label: "Diamond", color: "#F5C842" },
  ],
  "Annual Gala": [
    { label: "Platinum", color: "#D8CBB8" },
    { label: "Diamond", color: "#F5C842" },
  ],
};

/* Bento layout area names */
const AREA_MAP = ["event", "patron", "guesthouse", "reports", "access", "gala"] as const;

const CARD_ACCENTS: string[] = [
  "rgba(245,200,66,0.12)",   // event hall — gold
  "rgba(216,203,184,0.10)",  // patron wall — platinum
  "rgba(244,184,48,0.10)",   // guest house — amber
  "rgba(168,200,224,0.10)",  // board reports — blue
  "rgba(134,239,172,0.09)",  // estate access — green
  "rgba(245,200,66,0.12)",   // annual gala — gold
];

function PerkCard({
  perk,
  index,
  className = "",
}: {
  perk: (typeof INVESTOR_PERKS)[number];
  index: number;
  className?: string;
}) {
  const Icon = ICON_MAP[perk.icon];
  const tiers = PERK_TIERS[perk.title] ?? [];
  const accentBg = CARD_ACCENTS[index] ?? "rgba(245,200,66,0.08)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4, boxShadow: "0 20px 48px rgba(0,0,0,0.35)" }}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/8 p-7 ${className}`}
      style={{ background: `linear-gradient(135deg, rgba(10,14,24,0.9), rgba(14,18,28,0.95))` }}
    >
      {/* Radial accent glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle at 30% 20%, ${accentBg}, transparent 65%)` }}
      />

      {/* Tier eligibility badges — top right */}
      <div className="absolute right-4 top-4 flex gap-1">
        {tiers.map((t) => (
          <span
            key={t.label}
            className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
            style={{ background: `${t.color}18`, color: t.color, border: `1px solid ${t.color}30` }}
          >
            {t.label}
          </span>
        ))}
      </div>

      {/* Icon */}
      <div className="relative z-10 mb-5 flex size-13 items-center justify-center rounded-2xl bg-accent-default/10 transition-all duration-300 group-hover:bg-accent-default/18">
        <Icon className="size-6 text-accent-default" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col">
        <h3 className="font-heading text-xl font-bold text-white/95 mb-2">
          {perk.title}
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-white/55 mb-4">
          {perk.description}
        </p>

        {/* Detail pill */}
        <div className="flex items-center gap-2">
          <Star className="size-3 text-accent-default/70" fill="currentColor" />
          <span className="text-xs font-semibold text-accent-default/80">
            {perk.detail}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function InvestorPerks() {
  return (
    <SectionWatermark className="py-20 lg:py-28">
      <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="mb-2 font-heading text-sm font-medium uppercase tracking-[0.2em] text-accent-default">
            Investor Benefits
          </p>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl text-gold-gradient">
            More Than Returns
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            Every investor becomes a patron of the estate — with tangible
            privileges that connect you to the community.
          </p>
        </motion.div>

        {/* Bento grid — responsive: stacked on mobile, bento on lg */}
        <div
          className="grid gap-5 lg:grid-rows-[auto_auto] lg:[grid-template-areas:'event_event_patron''guesthouse_reports_access''gala_gala_gala']"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
          }}
        >
          {/* Event Hall — spans 2 cols */}
          <div className="col-span-full lg:[grid-area:event] lg:col-span-2">
            <PerkCard perk={INVESTOR_PERKS[0]} index={0} className="h-full" />
          </div>

          {/* Patron Wall */}
          <div className="col-span-full sm:col-span-1 lg:[grid-area:patron]">
            <PerkCard perk={INVESTOR_PERKS[2]} index={1} className="h-full" />
          </div>

          {/* Guest House */}
          <div className="col-span-full sm:col-span-1 lg:[grid-area:guesthouse]">
            <PerkCard perk={INVESTOR_PERKS[1]} index={2} className="h-full" />
          </div>

          {/* Board Reports */}
          <div className="col-span-full sm:col-span-1 lg:[grid-area:reports]">
            <PerkCard perk={INVESTOR_PERKS[3]} index={3} className="h-full" />
          </div>

          {/* Estate Access */}
          <div className="col-span-full sm:col-span-1 lg:[grid-area:access]">
            <PerkCard perk={INVESTOR_PERKS[4]} index={4} className="h-full" />
          </div>

          {/* Annual Gala — full width bottom */}
          <div className="col-span-full lg:[grid-area:gala]">
            <PerkCard perk={INVESTOR_PERKS[5]} index={5} className="h-full" />
          </div>
        </div>
      </Container>
    </SectionWatermark>
  );
}
