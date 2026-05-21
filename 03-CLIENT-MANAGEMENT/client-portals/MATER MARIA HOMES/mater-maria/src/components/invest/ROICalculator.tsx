"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import NumberFlow from "@number-flow/react";
import SlotCounter from "react-slot-counter";
import { Calculator, ArrowRight } from "lucide-react";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { Container } from "@/components/ui/container";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import {
  INVESTMENT_TIERS,
  generateProjection,
  type TierId,
} from "@/lib/investor-constants";
import { useCurrency } from "@/lib/currency-context";

// Nivo chart — client-side only
const ResponsiveLine = dynamic(
  () => import("@nivo/line").then((m) => m.ResponsiveLine),
  { ssr: false },
);

export function ROICalculator() {
  const [selectedTier, setSelectedTier] = useState<TierId>("diamond");
  const { formatAmount } = useCurrency();

  const tier = INVESTMENT_TIERS.find((t) => t.id === selectedTier)!;
  const projection = useMemo(
    () => generateProjection(tier.investment),
    [tier.investment],
  );

  const totalReturns = projection[projection.length - 1]?.cumulative ?? 0;
  const totalWithInvestment = tier.investment + totalReturns;
  const roiPercent = Math.round((totalReturns / tier.investment) * 100);

  const chartData = [
    {
      id: "returns",
      data: [
        { x: "Yr 0", y: 0 },
        ...projection.map((p) => ({
          x: `Yr ${p.year}`,
          y: Number(p.cumulative.toFixed(2)),
        })),
      ],
    },
  ];

  return (
    <SectionWatermark className="py-20 lg:py-28">
      <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mb-3 flex items-center justify-center gap-2">
            <Calculator className="size-5 text-accent-default" />
            <p className="font-heading text-sm font-medium uppercase tracking-[0.2em] text-accent-default">
              ROI Calculator
            </p>
          </div>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl text-gold-gradient">
            Watch Your Investment Grow
          </h2>
        </motion.div>

        {/* Tier Selector */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10 flex flex-wrap justify-center gap-3"
        >
          {INVESTMENT_TIERS.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTier(t.id)}
              className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                selectedTier === t.id
                  ? "border-accent-default bg-accent-default/15 text-accent-default shadow-[var(--accent-glow)]"
                  : "border-border-default bg-surface text-text-secondary hover:border-border-strong hover:text-text-primary"
              }`}
            >
              {t.name} — {formatAmount(t.investment)}
            </button>
          ))}
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mb-10 h-[350px] max-w-4xl rounded-2xl border border-border-default bg-surface p-4 lg:h-[400px]"
        >
          <ResponsiveLine
            data={chartData}
            margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: 0, max: "auto" }}
            curve="monotoneX"
            enableArea
            areaOpacity={0.15}
            colors={["hsl(42, 72%, 55%)"]}
            lineWidth={3}
            pointSize={8}
            pointColor="hsl(42, 72%, 55%)"
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            enableGridX={false}
            enableGridY={false}
            axisBottom={{
              tickSize: 0,
              tickPadding: 12,
              tickRotation: 0,
              legendOffset: 40,
              truncateTickAt: 0,
            }}
            axisLeft={{
              tickSize: 0,
              tickPadding: 12,
              format: (v) => `₹${v}L`,
            }}
            theme={{
              axis: {
                ticks: {
                  text: { fill: "hsl(220, 10%, 50%)", fontSize: 11 },
                },
              },
              crosshair: {
                line: { stroke: "hsl(42, 72%, 55%)", strokeWidth: 1 },
              },
              tooltip: {
                container: {
                  background: "hsl(220, 20%, 10%)",
                  color: "hsl(40, 15%, 92%)",
                  borderRadius: "8px",
                  border: "1px solid hsl(42, 72%, 55%, 0.3)",
                  fontSize: "12px",
                },
              },
            }}
            defs={[
              {
                id: "goldGradient",
                type: "linearGradient",
                colors: [
                  { offset: 0, color: "hsl(42, 72%, 55%)", opacity: 0.4 },
                  { offset: 100, color: "hsl(42, 72%, 55%)", opacity: 0 },
                ],
              },
            ]}
            fill={[{ match: { id: "returns" }, id: "goldGradient" }]}
            markers={[
              {
                axis: "x",
                value: "Yr 4",
                lineStyle: {
                  stroke: "hsl(42, 72%, 55%)",
                  strokeWidth: 1,
                  strokeDasharray: "6 4",
                },
                legend: "Deposit → Share Capital",
                legendPosition: "top-left",
                textStyle: {
                  fill: "hsl(42, 72%, 55%)",
                  fontSize: 10,
                },
              },
            ]}
            useMesh
            animate
            motionConfig="wobbly"
          />
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mx-auto mb-10 grid max-w-3xl grid-cols-3 gap-4"
        >
          <div className="rounded-xl border border-border-default bg-surface p-5 text-center">
            <p className="mb-1 text-xs uppercase tracking-wider text-text-muted">
              Invested
            </p>
            <p className="font-heading text-2xl font-bold text-text-primary">
              <NumberFlow
                value={tier.investment}
                format={{ useGrouping: true }}
                prefix="₹"
                suffix="L"
                transformTiming={{ duration: 800, easing: "ease-out" }}
              />
            </p>
          </div>
          <div className="rounded-xl border border-border-accent bg-surface p-5 text-center">
            <p className="mb-1 text-xs uppercase tracking-wider text-text-muted">
              Total Value
            </p>
            <p className="font-heading text-2xl font-bold text-accent-default">
              <NumberFlow
                value={Number(totalWithInvestment.toFixed(1))}
                format={{ useGrouping: true }}
                prefix="₹"
                suffix="L"
                transformTiming={{ duration: 1000, easing: "ease-out" }}
              />
            </p>
          </div>
          <div className="rounded-xl border border-border-default bg-surface p-5 text-center">
            <p className="mb-1 text-xs uppercase tracking-wider text-text-muted">
              Total ROI
            </p>
            <p className="font-heading text-2xl font-bold text-accent-default">
              <SlotCounter
                value={roiPercent}
                autoAnimationStart={false}
                duration={1.5}
              />
              %
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center">
          <a href="#lead-capture">
            <ShimmerButton>
              Get Personalized Proposal <ArrowRight className="size-4" />
            </ShimmerButton>
          </a>
        </div>
      </Container>
    </SectionWatermark>
  );
}
