import { InvestmentTiers } from "@/components/invest/InvestmentTiers";
import { ROICalculator } from "@/components/invest/ROICalculator";
import { TrustGovernance } from "@/components/invest/TrustGovernance";
import { LeadCapture } from "@/components/invest/LeadCapture";
import { InvestorChatWidget } from "@/components/invest/InvestorChatWidget";
import { InvestPageClient } from "./InvestPageClient";

export const metadata = {
  title: "Invest in Mater Maria Homes",
  description:
    "Join the founding patrons of Kerala's premier wellness estate. Investment tiers from ₹10 Lakhs with 10% annual interest and up to 153% returns over 15 years.",
};

export default function InvestorPage() {
  return (
    <main className="min-h-screen bg-[#080b14] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <img
            src="/assets-2025/images/invest/hero-estate.webp"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: 0.15 }}
          />
          <div className="absolute inset-0 bg-[#080b14]/80" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 font-heading text-sm font-medium uppercase tracking-[0.2em] text-[#C9A84C]">
            Investment Opportunity
          </p>
          <h1 className="font-heading text-4xl font-bold sm:text-5xl lg:text-6xl text-white mb-6">
            Secure a High-Yield Asset in Kerala
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            Share-deposit programmes with 10% annual interest, guest privileges, and dividend participation. Three tiers designed for NRI investors and local patrons.
          </p>
        </div>
      </section>

      {/* Investment Tiers */}
      <InvestmentTiers />

      {/* ROI Calculator */}
      <ROICalculator />

      {/* Highlights, Market Insights, Testimonials, FAQ */}
      <InvestPageClient />

      {/* Trust & Governance */}
      <TrustGovernance />

      {/* Lead Capture */}
      <LeadCapture />

      {/* Floating Chat */}
      <InvestorChatWidget />
    </main>
  );
}
