"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, Minus } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { INVESTMENT_TIERS } from "@/lib/investor-constants";

const ATTRIBUTES = [
  { key: "investment", label: "Investment" },
  { key: "annualInterest", label: "Annual Interest" },
  { key: "interestYears", label: "Interest Period" },
  { key: "dividendStart", label: "Dividends Start" },
  { key: "totalReturn", label: "Projected Return" },
  { key: "eventHall", label: "Event Hall" },
  { key: "guestHouse", label: "Guest House" },
  { key: "patronWall", label: "Patron Wall" },
] as const;

function getCellValue(
  tier: (typeof INVESTMENT_TIERS)[number],
  key: string,
): string {
  switch (key) {
    case "investment":
      return tier.investmentDisplay;
    case "annualInterest":
      return `${tier.annualInterest}%`;
    case "interestYears":
      return tier.interestYears;
    case "dividendStart":
      return tier.dividendStart;
    case "totalReturn":
      return `${tier.totalReturn}%`;
    case "eventHall":
      return tier.perks.eventHall;
    case "guestHouse":
      return tier.perks.guestHouse;
    case "patronWall":
      return tier.perks.patronWall;
    default:
      return "";
  }
}

export function TierComparisonDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mx-auto flex items-center gap-1.5 text-sm font-medium text-accent-default transition-colors hover:text-accent-hover"
      >
        Compare All Tiers <ArrowRight className="size-3.5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-border-accent bg-surface"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-default bg-surface/95 px-6 py-4 backdrop-blur-xl">
                <h3 className="font-heading text-lg font-bold text-text-primary">
                  Compare Investment Tiers
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="flex size-9 items-center justify-center rounded-lg border border-border-default text-text-muted transition-colors hover:text-text-primary"
                  aria-label="Close comparison"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto p-6">
                <table className="w-full min-w-[600px] border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="p-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                        Feature
                      </th>
                      {INVESTMENT_TIERS.map((tier) => (
                        <th
                          key={tier.id}
                          className={`p-3 text-center font-heading text-base font-bold ${
                            tier.id === "platinum"
                              ? "text-accent-default"
                              : "text-text-primary"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            {tier.name}
                            {tier.badge && (
                              <span className="rounded-full bg-accent-default/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-default">
                                {tier.badge}
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ATTRIBUTES.map((attr, i) => (
                      <tr
                        key={attr.key}
                        className={
                          i % 2 === 0 ? "bg-bg-base/30" : "bg-transparent"
                        }
                      >
                        <td className="p-3 font-medium text-text-secondary">
                          {attr.label}
                        </td>
                        {INVESTMENT_TIERS.map((tier) => {
                          const val = getCellValue(tier, attr.key);
                          const isDash = val === "\u2014";
                          return (
                            <td
                              key={tier.id}
                              className={`p-3 text-center ${
                                tier.id === "platinum"
                                  ? "bg-accent-default/[0.03]"
                                  : ""
                              }`}
                            >
                              {isDash ? (
                                <Minus className="mx-auto size-4 text-text-muted/40" />
                              ) : (
                                <span className="text-text-primary">
                                  {val}
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Per-tier CTAs */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {INVESTMENT_TIERS.map((tier) => {
                    const handleSelect = () => {
                      setOpen(false);
                      document
                        .getElementById("lead-capture")
                        ?.scrollIntoView({ behavior: "smooth" });
                    };
                    return tier.id === "platinum" ? (
                      <ShimmerButton
                        key={tier.id}
                        className="w-full text-xs"
                        onClick={handleSelect}
                      >
                        Select {tier.name} <ArrowRight className="size-3" />
                      </ShimmerButton>
                    ) : (
                      <button
                        key={tier.id}
                        onClick={handleSelect}
                        className="w-full rounded-full border border-border-default px-4 py-2.5 text-xs font-semibold text-text-primary transition-colors hover:border-accent-default hover:text-accent-default"
                      >
                        Select {tier.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
