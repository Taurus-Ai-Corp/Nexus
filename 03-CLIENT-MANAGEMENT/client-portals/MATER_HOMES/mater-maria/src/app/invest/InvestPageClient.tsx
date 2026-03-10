"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Receipt,
  TrendingUp,
  Banknote,
  Shield,
  Globe,
  Home,
  ChevronDown,
  Quote,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { Container } from "@/components/ui/container";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { GlowCard } from "@/components/ui/glow-card";
import { AnimatedBackground } from "@/components/ui/animated-background";
import {
  INVESTMENT_HIGHLIGHTS,
  MARKET_INSIGHTS,
  INVESTOR_TESTIMONIALS,
  INVESTOR_FAQ,
} from "@/lib/constants";

/* ------------------------------------------------------------------ */
/*  Icon Map                                                           */
/* ------------------------------------------------------------------ */

const HIGHLIGHT_ICONS = {
  Receipt,
  TrendingUp,
  Banknote,
  Shield,
  Globe,
  Home,
} as const;

/* ------------------------------------------------------------------ */
/*  Animation Variants                                                 */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ================================================================== */
/*  S1: Investment Highlights                                          */
/* ================================================================== */

function InvestmentHighlightsSection() {
  return (
    <section className="relative py-20 lg:py-28" id="highlights">
      <AnimatedBackground
        images={[
          "/assets-2025/images/invest/hero-sunset.webp",
          "/assets-2025/images/invest/hero-garden.webp",
        ]}
        opacity={0.06}
        overlayIntensity="none"
        className="absolute inset-0"
      />
      <SectionWatermark className="relative-content">
        <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="mb-2 font-heading text-sm font-medium uppercase tracking-[0.2em] text-accent-default">
            Investment Advantages
          </p>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl text-gold-gradient">
            Why NRI Investors Choose Mater Maria
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            Six compelling reasons to invest in Kerala&apos;s premier
            AI-powered wellness community.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
        >
          {INVESTMENT_HIGHLIGHTS.map((item) => {
            const Icon =
              HIGHLIGHT_ICONS[item.icon as keyof typeof HIGHLIGHT_ICONS];
            return (
              <motion.div
                key={item.title}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
              >
                <GlowCard className="h-full p-6 lg:p-8">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-accent-default/10">
                    {Icon && <Icon className="size-6 text-accent-default" />}
                  </div>
                  <h3 className="mb-2 font-heading text-lg font-bold text-text-primary">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-text-secondary">
                    {item.description}
                  </p>
                </GlowCard>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </SectionWatermark>
    </section>
  );
}

/* ================================================================== */
/*  S2: Market Insights                                                */
/* ================================================================== */

function MarketInsightsSection() {
  const barData = MARKET_INSIGHTS.map((d) => ({
    name: d.region,
    appreciation: d.appreciation,
  }));

  return (
    <section className="relative py-20 lg:py-28" id="market-data">
      <AnimatedBackground
        images={[
          "/assets-2025/images/invest/hero-aerial.webp",
          "/assets-2025/images/invest/hero-estate.webp",
        ]}
        opacity={0.05}
        overlayIntensity="none"
        className="absolute inset-0"
      />
      <SectionWatermark className="relative-content">
        <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mb-3 flex items-center justify-center gap-2">
            <BarChart3 className="size-5 text-accent-default" />
            <p className="font-heading text-sm font-medium uppercase tracking-[0.2em] text-accent-default">
              Kerala Real Estate Market Data
            </p>
          </div>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl text-gold-gradient">
            Market-Backed Investment
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-text-secondary">
            Kottayam district leads Kerala in luxury real estate appreciation,
            outperforming national averages by 2×.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto h-[350px] max-w-3xl rounded-2xl border border-border-default bg-surface p-6 lg:h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barSize={40}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(220, 10%, 20%)"
                opacity={0.3}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(220, 20%, 10%)",
                  border: "1px solid hsl(42, 72%, 55%, 0.3)",
                  borderRadius: "8px",
                  color: "hsl(40, 15%, 92%)",
                  fontSize: "12px",
                }}
                formatter={(value) => [`${value}%`, "Appreciation"]}
              />
              <Bar
                dataKey="appreciation"
                fill="hsl(42, 72%, 55%)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </Container>
    </SectionWatermark>
    </section>
  );
}

/* ================================================================== */
/*  S3: Investor Testimonials                                          */
/* ================================================================== */

function InvestorTestimonialsSection() {
  return (
    <section className="relative py-20 lg:py-28" id="testimonials">
      <AnimatedBackground
        images={[
          "/assets-2025/images/gallery/kerala-backwaters-sunset.webp",
          "/assets-2025/images/invest/hero-sunset.webp",
        ]}
        opacity={0.05}
        overlayIntensity="none"
        className="absolute inset-0"
      />
      <SectionWatermark className="relative-content">
        <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="mb-2 font-heading text-sm font-medium uppercase tracking-[0.2em] text-accent-default">
            NRI Investor Stories
          </p>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl text-gold-gradient">
            Trusted by NRI Families Worldwide
          </h2>
        </motion.div>

        <motion.div
          className="grid gap-6 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
        >
          {INVESTOR_TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
            >
              <CardSpotlight className="flex h-full flex-col p-6 lg:p-8">
                <Quote className="mb-4 size-6 text-accent-default/30" />
                <p className="mb-6 flex-1 text-sm leading-relaxed text-text-secondary italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 border-t border-border-default pt-4">
                  <span className="text-2xl">{t.flag}</span>
                  <div>
                    <p className="font-heading text-sm font-bold text-text-primary">
                      {t.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {t.country} · {t.tier} Tier · {t.invested}
                    </p>
                  </div>
                </div>
              </CardSpotlight>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </SectionWatermark>
    </section>
  );
}

/* ================================================================== */
/*  S4: Investor FAQ                                                   */
/* ================================================================== */

function InvestorFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SectionWatermark className="py-20 lg:py-28" id="investor-faq">
      <Container size="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-2 font-heading text-sm font-medium uppercase tracking-[0.2em] text-accent-default">
            Investor FAQ
          </p>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl text-gold-gradient">
            Common Investment Questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3"
        >
          {INVESTOR_FAQ.map((faq, i) => (
            <div
              key={faq.question}
              className="rounded-xl border border-border-default bg-surface/80 backdrop-blur-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
                aria-expanded={openIndex === i}
              >
                <span className="pr-4 text-sm font-medium text-text-primary">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`size-4 shrink-0 text-accent-default transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === i ? "auto" : 0,
                  opacity: openIndex === i ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-5 text-sm leading-relaxed text-text-secondary">
                  {faq.answer}
                </p>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </Container>
    </SectionWatermark>
  );
}

/* ================================================================== */
/*  Export: All new sections                                            */
/* ================================================================== */

export function InvestPageClient() {
  return (
    <>
      {/* S1: Investment Highlights — 6 GlowCards */}
      <InvestmentHighlightsSection />

      {/* S2: Market Insights — Kerala real estate data */}
      <MarketInsightsSection />

      {/* S3: Investor Testimonials — NRI success stories */}
      <InvestorTestimonialsSection />

      {/* S4: Investor FAQ — Investment-specific accordion */}
      <InvestorFAQSection />
    </>
  );
}
