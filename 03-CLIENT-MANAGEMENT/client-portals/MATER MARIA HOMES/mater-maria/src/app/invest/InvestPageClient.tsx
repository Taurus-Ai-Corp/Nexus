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
import dynamic from "next/dynamic";

const RechartsBar = dynamic(
  () => import("recharts").then((m) => ({
    default: ({ data }: { data: Array<{ name: string; appreciation: number }> }) => (
      <m.ResponsiveContainer width="100%" height="100%">
        <m.BarChart data={data} barSize={36}>
          <m.CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <m.XAxis
            dataKey="name"
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            angle={-20}
            textAnchor="end"
            height={60}
          />
          <m.YAxis
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <m.Tooltip
            contentStyle={{
              background: "rgba(8,11,20,0.95)",
              border: "1px solid rgba(201,168,76,0.3)",
              borderRadius: 12,
              color: "rgba(255,255,255,0.9)",
              fontSize: 12,
              fontWeight: 600,
            }}
            formatter={(value) => [`${value}%`, "Appreciation"]}
          />
          <m.Bar
            dataKey="appreciation"
            fill="#C9A84C"
            radius={[6, 6, 0, 0]}
          />
        </m.BarChart>
      </m.ResponsiveContainer>
    ),
  })),
  { ssr: false }
);
import { Container } from "@/components/ui/container";
import {
  INVESTMENT_HIGHLIGHTS,
  MARKET_INSIGHTS,
  INVESTOR_TESTIMONIALS,
  INVESTOR_FAQ,
} from "@/lib/constants";

const HIGHLIGHT_ICONS = {
  Receipt,
  TrendingUp,
  Banknote,
  Shield,
  Globe,
  Home,
} as const;

const GOLD = "#C9A84C";
const GOLD_GRADIENT = "linear-gradient(135deg, #C9A84C, #e8d08a, #C9A84C)";

/* ================================================================== */
/*  S1: Investment Highlights — premium 3-col cards                   */
/* ================================================================== */

function InvestmentHighlightsSection() {
  return (
    <section
      id="highlights"
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #080b14 0%, #0d1120 100%)" }}
    >
      {/* Background image at 50% opacity */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets-2025/images/invest/hero-sunset.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: 0.12 }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(8,11,20,0.75)" }} />
      </div>

      <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <p
            className="mb-4 font-heading uppercase tracking-[0.22em]"
            style={{ fontSize: "0.78rem", fontWeight: 700, color: GOLD }}
          >
            Investment Advantages
          </p>
          <h2
            className="font-heading text-white"
            style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 900, letterSpacing: "-0.02em" }}
          >
            Why NRI Investors{" "}
            <span style={{ background: GOLD_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Choose Mater Maria
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/50" style={{ fontSize: "1rem", fontWeight: 400 }}>
            Six compelling reasons to invest in Kerala&apos;s premier AI-powered wellness community.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {INVESTMENT_HIGHLIGHTS.map((item, i) => {
            const Icon = HIGHLIGHT_ICONS[item.icon as keyof typeof HIGHLIGHT_ICONS];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <div
                  className="group h-full p-7 lg:p-8 transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(201,168,76,0.15)",
                    borderRadius: 20,
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {/* Icon */}
                  <div
                    className="mb-5 flex size-12 items-center justify-center rounded-xl"
                    style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.2)" }}
                  >
                    {Icon && <Icon className="size-6" style={{ color: GOLD }} />}
                  </div>

                  {/* Gold accent line */}
                  <div
                    className="mb-4 h-px"
                    style={{ width: 36, background: `linear-gradient(90deg, ${GOLD}, transparent)` }}
                  />

                  <h3
                    className="mb-3 font-heading text-white"
                    style={{ fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.01em" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-white/55 leading-relaxed" style={{ fontSize: "0.92rem", fontWeight: 400 }}>
                    {item.description}
                  </p>

                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
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
    <section
      id="market-data"
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: "#080b14" }}
    >
      {/* Background image at 50% opacity */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets-2025/images/invest/hero-aerial.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: 0.10 }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(8,11,20,0.80)" }} />
      </div>

      <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-2">
            <BarChart3 className="size-4" style={{ color: GOLD }} />
            <p
              className="font-heading uppercase tracking-[0.22em]"
              style={{ fontSize: "0.78rem", fontWeight: 700, color: GOLD }}
            >
              Kerala Real Estate Market Data
            </p>
          </div>
          <h2
            className="font-heading text-white"
            style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 900, letterSpacing: "-0.02em" }}
          >
            Market-Backed{" "}
            <span style={{ background: GOLD_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Investment
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/50" style={{ fontSize: "1rem" }}>
            Kottayam district leads Kerala in luxury real estate appreciation, outperforming national averages by 2×.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto max-w-3xl rounded-2xl p-6 lg:p-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(201,168,76,0.15)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="h-[360px]">
            <RechartsBar data={barData} />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

/* ================================================================== */
/*  S3: Investor Testimonials — premium cards                         */
/* ================================================================== */

function InvestorTestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0d1120 0%, #080b14 100%)" }}
    >
      {/* Background image at 50% overlay */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets-2025/images/invest/hero-sunset.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: 0.08 }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(8,11,20,0.80)" }} />
      </div>

      <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <p
            className="mb-4 font-heading uppercase tracking-[0.22em]"
            style={{ fontSize: "0.78rem", fontWeight: 700, color: GOLD }}
          >
            NRI Investor Stories
          </p>
          <h2
            className="font-heading text-white"
            style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 900, letterSpacing: "-0.02em" }}
          >
            Trusted by{" "}
            <span style={{ background: GOLD_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              NRI Families
            </span>{" "}
            Worldwide
          </h2>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {INVESTOR_TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col p-7 lg:p-8"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(201,168,76,0.15)",
                borderRadius: 20,
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Quote icon */}
              <Quote className="mb-5 size-7 opacity-30" style={{ color: GOLD }} />

              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <span key={s} style={{ color: GOLD, fontSize: "0.8rem" }}>★</span>
                ))}
              </div>

              <p
                className="mb-6 flex-1 italic leading-relaxed text-white/65"
                style={{ fontSize: "0.95rem", fontWeight: 400 }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Gold divider */}
              <div
                className="mb-5 h-px"
                style={{ background: "linear-gradient(90deg, rgba(201,168,76,0.4), transparent)" }}
              />

              <div className="flex items-center gap-3">
                <span style={{ fontSize: "1.6rem" }}>{t.flag}</span>
                <div>
                  <p
                    className="font-heading text-white"
                    style={{ fontSize: "0.95rem", fontWeight: 800 }}
                  >
                    {t.name}
                  </p>
                  <p className="text-white/40" style={{ fontSize: "0.78rem", fontWeight: 500 }}>
                    {t.country} · {t.tier} Tier · {t.invested}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ================================================================== */
/*  S4: Investor FAQ                                                   */
/* ================================================================== */

function InvestorFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="investor-faq"
      className="relative py-24 lg:py-32"
      style={{ background: "#080b14" }}
    >
      <Container size="md">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <p
            className="mb-4 font-heading uppercase tracking-[0.22em]"
            style={{ fontSize: "0.78rem", fontWeight: 700, color: GOLD }}
          >
            Investor FAQ
          </p>
          <h2
            className="font-heading text-white"
            style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 900, letterSpacing: "-0.02em" }}
          >
            Common{" "}
            <span style={{ background: GOLD_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Investment Questions
            </span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {INVESTOR_FAQ.map((faq, i) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${openIndex === i ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 16,
                transition: "border-color 0.3s ease",
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
                aria-expanded={openIndex === i}
              >
                <span
                  className="pr-4 text-white"
                  style={{ fontSize: "0.95rem", fontWeight: 700 }}
                >
                  {faq.question}
                </span>
                <ChevronDown
                  className="size-5 shrink-0 transition-transform duration-300"
                  style={{
                    color: GOLD,
                    transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              <motion.div
                initial={false}
                animate={{ height: openIndex === i ? "auto" : 0, opacity: openIndex === i ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p
                  className="px-6 pb-6 leading-relaxed text-white/55"
                  style={{ fontSize: "0.92rem", fontWeight: 400 }}
                >
                  {faq.answer}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ================================================================== */
/*  Export                                                             */
/* ================================================================== */

export function InvestPageClient() {
  return (
    <>
      <InvestmentHighlightsSection />
      <MarketInsightsSection />
      <InvestorTestimonialsSection />
      <InvestorFAQSection />
    </>
  );
}
