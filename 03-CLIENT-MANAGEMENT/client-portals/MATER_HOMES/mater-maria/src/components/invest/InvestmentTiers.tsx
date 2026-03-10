"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SlotCounter from "react-slot-counter";
import { ArrowRight, Check, Crown, Gem, Medal, Star } from "lucide-react";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { Container } from "@/components/ui/container";
import { GhostWord } from "@/components/ui/ghost-word";
import { CardSpotlight } from "@/components/ui/card-spotlight";

import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { INVESTMENT_TIERS, type InvestmentTier, type TierId } from "@/lib/investor-constants";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { useCurrency } from "@/lib/currency-context";
import { CurrencyToggle } from "./CurrencyToggle";

const TIER_ICONS: Record<TierId, typeof Star> = {
  silver: Medal,
  gold: Star,
  diamond: Gem,
  platinum: Crown,
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

function TierCard({ tier, index }: { tier: InvestmentTier; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.5 });
  const Icon = TIER_ICONS[tier.id] ?? Star;
  const { formatAmount } = useCurrency();

  const content = (
    <div ref={cardRef} className="flex h-full flex-col p-6 lg:p-8">
      {/* Badge */}
      {tier.badge && (
        <span className="mb-4 inline-flex w-fit items-center rounded-full bg-accent-default/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-default">
          {tier.badge}
        </span>
      )}

      {/* Icon + Name */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-accent-default/10">
          <Icon className="size-5 text-accent-default" />
        </div>
        <h3 className="font-heading text-xl font-bold text-text-primary">
          {tier.name}
        </h3>
      </div>

      {/* Price — currency-aware */}
      <div className="mb-2">
        <span className="font-heading text-3xl font-bold text-accent-default lg:text-4xl">
          {formatAmount(tier.investment)}
        </span>
      </div>

      {/* ROI */}
      <div className="mb-6 flex items-baseline gap-2">
        <span className="font-heading text-2xl font-bold text-text-primary">
          <SlotCounter
            startValue={0}
            value={isInView ? tier.totalReturn : 0}
            autoAnimationStart={false}
            duration={2}
          />
          %
        </span>
        <span className="text-xs text-text-muted">total returns over 15 years</span>
      </div>

      {/* Features */}
      <ul className="mb-8 flex-1 space-y-2.5">
        {tier.highlights.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
            <Check className="mt-0.5 size-4 shrink-0 text-accent-default" />
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <motion.div whileTap={{ scale: 0.97 }}>
        <a href="#lead-capture">
          <ShimmerButton className="w-full text-sm">
            Invest Now <ArrowRight className="size-4" />
          </ShimmerButton>
        </a>
      </motion.div>
    </div>
  );

  // Diamond tier gets NeonGradientCard, others get CardSpotlight
  if (tier.id === "diamond") {
    return (
      <motion.div
        variants={fadeUp}
        whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(212,175,55,0.15)", borderColor: "rgba(212,175,55,0.3)" }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="tier-card-anim lg:scale-105"
      >
        <NeonGradientCard className="h-full">{content}</NeonGradientCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(212,175,55,0.15)", borderColor: "rgba(212,175,55,0.3)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="tier-card-anim"
    >
      <CardSpotlight className="h-full">{content}</CardSpotlight>
    </motion.div>
  );
}

export function InvestmentTiers() {
  const sectionRef = useGsapReveal(".tier-card-anim", { y: 150, stagger: 0.2 });

  return (
    <SectionWatermark
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="relative overflow-hidden py-20 lg:py-28"
      id="investment-tiers"
    >
      {/* Ghost typography behind tier cards */}
      <GhostWord word="Legacy" top="48%" />

      <Container size="lg" className="relative z-10">
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

        <motion.div
          className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {INVESTMENT_TIERS.map((tier, i) => (
            <TierCard key={tier.id} tier={tier} index={i} />
          ))}
        </motion.div>

        <p className="mt-8 text-center text-xs text-text-muted">
          * Returns are projected based on the 15-year financial model.
          Deposit converts to share capital at Year 5.
        </p>
      </Container>
    </SectionWatermark>
  );
}
