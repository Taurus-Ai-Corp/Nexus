"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import SlotCounter from "react-slot-counter";
import { ArrowRight, Check, Crown, Gem, Medal, Star, TrendingUp, CalendarDays, Landmark } from "lucide-react";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { Container } from "@/components/ui/container";
import { GhostWord } from "@/components/ui/ghost-word";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { INVESTMENT_TIERS, type InvestmentTier, type TierId } from "@/lib/investor-constants";
import { useCurrency } from "@/lib/currency-context";
import { CurrencyToggle } from "./CurrencyToggle";

const TIER_ICONS: Record<TierId, typeof Star> = {
  silver: Medal,
  gold: Star,
  diamond: Gem,
  platinum: Crown,
};

const TIER_PALETTE: Record<TierId, { accent: string; glow: string; border: string; bg: string }> = {
  diamond: {
    accent: "#F5C842",
    glow: "rgba(245,200,66,0.20)",
    border: "rgba(245,200,66,0.35)",
    bg: "rgba(245,200,66,0.06)",
  },
  platinum: {
    accent: "#D8CBB8",
    glow: "rgba(216,203,184,0.18)",
    border: "rgba(216,203,184,0.30)",
    bg: "rgba(216,203,184,0.05)",
  },
  gold: {
    accent: "#F4B830",
    glow: "rgba(244,184,48,0.18)",
    border: "rgba(244,184,48,0.30)",
    bg: "rgba(244,184,48,0.05)",
  },
  silver: {
    accent: "#A8C8E0",
    glow: "rgba(168,200,224,0.18)",
    border: "rgba(168,200,224,0.28)",
    bg: "rgba(168,200,224,0.04)",
  },
};

export function InvestmentTiers() {
  const [active, setActive] = useState<TierId>("diamond");
  const detailRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(detailRef, { once: true });

  const tier = INVESTMENT_TIERS.find((t) => t.id === active)!;
  const palette = TIER_PALETTE[active];
  const Icon = TIER_ICONS[active] ?? Star;
  const { formatAmount } = useCurrency();

  return (
    <SectionWatermark
      className="relative overflow-hidden py-20 lg:py-28"
      id="investment-tiers"
    >
      <Container size="lg" className="relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="mb-2 font-heading text-sm font-medium uppercase tracking-[0.2em] text-accent-default">
            Investment Tiers
          </p>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl text-gold-gradient">
            Choose Your Legacy
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            Four tiers of partnership in Kerala&apos;s premier wellness estate.
            Every tier includes 10% annual interest and dividend participation.
          </p>
          <div className="mt-6 flex justify-center">
            <CurrencyToggle />
          </div>
        </motion.div>

        {/* Two-panel layout */}
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">

          {/* Left: Tier selector list */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-3"
          >
            {INVESTMENT_TIERS.map((t) => {
              const p = TIER_PALETTE[t.id];
              const TierIcon = TIER_ICONS[t.id] ?? Star;
              const isActive = t.id === active;
              return (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  className="group relative overflow-hidden rounded-2xl border text-left transition-all duration-300"
                  style={{
                    borderColor: isActive ? p.border : "rgba(255,255,255,0.16)",
                    background: isActive ? p.bg : "rgba(255,255,255,0.04)",
                    boxShadow: isActive ? `0 0 24px ${p.glow}` : "none",
                  }}
                >
                  {/* Active left accent bar */}
                  <div
                    className="absolute left-0 top-0 h-full w-0.5 rounded-l-2xl transition-all duration-300"
                    style={{ background: isActive ? p.accent : "transparent" }}
                  />

                  <div className="flex items-center gap-3 px-5 py-4">
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300"
                      style={{
                        background: isActive ? `${p.accent}22` : "rgba(255,255,255,0.05)",
                        color: isActive ? p.accent : "rgba(255,255,255,0.45)",
                      }}
                    >
                      <TierIcon className="size-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className="font-heading text-base font-bold transition-colors duration-200"
                          style={{ color: isActive ? p.accent : "rgba(255,255,255,0.75)" }}
                        >
                          {t.name}
                        </span>
                        {t.badge && (
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                            style={{
                              background: isActive ? `${p.accent}22` : "rgba(255,255,255,0.06)",
                              color: isActive ? p.accent : "rgba(255,255,255,0.4)",
                            }}
                          >
                            {t.badge}
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-baseline gap-2">
                        <span className="font-heading text-lg font-bold" style={{ color: isActive ? p.accent : "rgba(255,255,255,0.55)" }}>
                          {formatAmount(t.investment)}
                        </span>
                        <span className="text-xs text-white/55">{t.totalReturn}% ROI</span>
                      </div>
                    </div>

                    <div
                      className="ml-auto shrink-0 transition-transform duration-200"
                      style={{ color: isActive ? p.accent : "rgba(255,255,255,0.2)", transform: isActive ? "translateX(0)" : "translateX(-4px)" }}
                    >
                      <ArrowRight className="size-4" />
                    </div>
                  </div>
                </button>
              );
            })}
          </motion.div>

          {/* Right: Animated detail panel */}
          <div ref={detailRef} className="relative min-h-[480px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative h-full overflow-hidden rounded-2xl border"
                style={{
                  borderColor: palette.border,
                  background: "rgba(10,14,24,0.85)",
                  boxShadow: `0 0 60px ${palette.glow}, 0 20px 60px rgba(0,0,0,0.4)`,
                }}
              >
                {/* Corner glow */}
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl"
                  style={{ background: palette.glow }}
                />

                <div className="relative z-10 flex h-full flex-col p-8 lg:p-10">
                  {/* Tier header */}
                  <div className="mb-8 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="flex size-14 items-center justify-center rounded-2xl"
                        style={{ background: `${palette.accent}18`, color: palette.accent }}
                      >
                        <Icon className="size-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading text-2xl font-bold text-white">
                            {tier.name}
                          </h3>
                          {tier.badge && (
                            <span
                              className="rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider"
                              style={{ background: `${palette.accent}22`, color: palette.accent }}
                            >
                              {tier.badge}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-sm text-white/50">Kerala&apos;s Premier Wellness Estate</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="mb-8 grid grid-cols-3 gap-4">
                    {/* Investment */}
                    <div
                      className="rounded-xl p-4 text-center"
                      style={{ background: `${palette.accent}0C`, border: `1px solid ${palette.accent}20` }}
                    >
                      <Landmark className="mx-auto mb-2 size-4" style={{ color: palette.accent }} />
                      <div className="font-heading text-xl font-bold" style={{ color: palette.accent }}>
                        {formatAmount(tier.investment)}
                      </div>
                      <div className="mt-0.5 text-[10px] uppercase tracking-widest text-white/60">Investment</div>
                    </div>

                    {/* ROI */}
                    <div
                      className="rounded-xl p-4 text-center"
                      style={{ background: `${palette.accent}0C`, border: `1px solid ${palette.accent}20` }}
                    >
                      <TrendingUp className="mx-auto mb-2 size-4" style={{ color: palette.accent }} />
                      <div className="font-heading text-xl font-bold" style={{ color: palette.accent }}>
                        <SlotCounter
                          startValue={0}
                          value={isInView ? tier.totalReturn : 0}
                          autoAnimationStart={false}
                          duration={1.8}
                        />%
                      </div>
                      <div className="mt-0.5 text-[10px] uppercase tracking-widest text-white/60">15-Yr ROI</div>
                    </div>

                    {/* Interest */}
                    <div
                      className="rounded-xl p-4 text-center"
                      style={{ background: `${palette.accent}0C`, border: `1px solid ${palette.accent}20` }}
                    >
                      <CalendarDays className="mx-auto mb-2 size-4" style={{ color: palette.accent }} />
                      <div className="font-heading text-xl font-bold" style={{ color: palette.accent }}>
                        {tier.annualInterest}%
                      </div>
                      <div className="mt-0.5 text-[10px] uppercase tracking-widest text-white/60">Annual Interest</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-8 flex-1">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white/60">
                      What&apos;s included
                    </p>
                    <ul className="grid gap-2.5 sm:grid-cols-2">
                      {tier.highlights.map((feature, i) => (
                        <motion.li
                          key={feature}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.25 }}
                          className="flex items-start gap-2.5"
                        >
                          <div
                            className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full"
                            style={{ background: `${palette.accent}22` }}
                          >
                            <Check className="size-2.5" style={{ color: palette.accent }} />
                          </div>
                          <span className="text-sm leading-snug text-white/70">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <a href="#lead-capture">
                    <ShimmerButton className="w-full">
                      Invest in {tier.name} <ArrowRight className="size-4" />
                    </ShimmerButton>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-text-muted">
          * Returns are projected based on the 15-year financial model. Deposit converts to share capital at Year 5.
        </p>
      </Container>
    </SectionWatermark>
  );
}
