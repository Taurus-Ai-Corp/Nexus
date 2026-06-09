"use client";

import Link from "next/link";
import {
  Check,
  X,
  ArrowRight,
  Globe,
  CreditCard,
  Shield,
  TrendingUp,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VideoHeroSection } from "@/components/ui/video-hero-section";
import { VideoBreak } from "@/components/ui/video-break";
import { useGsapReveal } from "@/hooks/useGsapReveal";

/* ------------------------------------------------------------------ */
/*  Pricing data                                                       */
/* ------------------------------------------------------------------ */
const PLANS = [
  {
    name: "Walk-up Villa",
    price: "From \u20B925L*",
    area: "650 sq.ft",
    highlight: false,
    roi: null,
    features: [
      "Compact studio layout",
      "1 bathroom with anti-skid flooring",
      "Modular kitchen",
      "Smart home panel & IoT sensors",
      "Emergency call system",
      "Private balcony",
      "24/7 security & CCTV",
      "All community amenities",
    ],
  },
  {
    name: "Executive Suite",
    price: "\u20B940L",
    area: "950 sq.ft",
    highlight: true,
    roi: "91.3% 5-Yr ROI",
    features: [
      "Separate living & bedroom areas",
      "1 bathroom with premium fittings",
      "Full modular kitchen",
      "AI health monitoring & smart panel",
      "Emergency call system",
      "\u20B91.8L annual rental income",
      "Board-supervised ISO 9001 governance",
      "NRI concierge & virtual tours",
    ],
  },
  {
    name: "Independent Villa",
    price: "From \u20B955L*",
    area: "1,350 sq.ft",
    highlight: false,
    roi: null,
    features: [
      "2 bedrooms + living area",
      "2 bathrooms with premium fittings",
      "Full modular kitchen with island",
      "AI health monitoring & smart panel",
      "Emergency call system",
      "Private balcony + garden",
      "Highest long-term appreciation",
      "All premium amenities included",
    ],
  },
];

const FEATURE_COMPARISON = [
  { feature: "Living Area", studio: "650 sq.ft", harmony: "950 sq.ft", villa: "1,350 sq.ft" },
  { feature: "Bedrooms", studio: "Studio", harmony: "1 BHK", villa: "2 BHK" },
  { feature: "Bathrooms", studio: "1", harmony: "1", villa: "2" },
  { feature: "Modular Kitchen", studio: true, harmony: true, villa: true },
  { feature: "Smart Home Panel", studio: true, harmony: true, villa: true },
  { feature: "Private Balcony", studio: true, harmony: true, villa: true },
  { feature: "Private Garden", studio: false, harmony: false, villa: true },
  { feature: "Separate Living Area", studio: false, harmony: true, villa: true },
  { feature: "Guest Room", studio: false, harmony: false, villa: true },
  { feature: "Premium Flooring", studio: true, harmony: true, villa: true },
];

function BoolOrText({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm text-text-primary">{value}</span>;
  }
  return value ? (
    <Check className="mx-auto size-5 text-green-500" />
  ) : (
    <X className="mx-auto size-5 text-text-muted" />
  );
}

/* ------------------------------------------------------------------ */
/*  Client Component                                                   */
/* ------------------------------------------------------------------ */
export function PricingPageClient() {
  const cardsRef = useGsapReveal("[data-gsap-card]", {
    y: 60,
    stagger: 0.15,
    duration: 0.8,
  });

  const tableRef = useGsapReveal("[data-gsap-row]", {
    y: 30,
    stagger: 0.06,
    duration: 0.6,
    start: "top 85%",
  });

  return (
    <main id="main-content">
      {/* Video Hero */}
      <VideoHeroSection
        videoSrc="/assets-2025/videos/sanctuary-living.mp4"
        watermarkText="INVESTMENT"
      >
        <Container size="lg" className="pb-20 pt-40">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <span className="text-white/40">/</span>
            <span className="font-medium text-white">Pricing</span>
          </nav>
          <SectionHeading
            badge="Transparent Pricing"
            title="Investment in Your Future"
            subtitle="Choose the residence that suits your lifestyle. Every plan includes access to all community amenities and services."
          />
        </Container>
      </VideoHeroSection>

      {/* Pricing Cards */}
      <section className="py-16" ref={cardsRef as React.RefObject<HTMLElement>}>
        <Container size="lg">
          <div className="grid items-center gap-8 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                data-gsap-card
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  plan.highlight
                    ? "border-accent-default bg-surface shadow-lg shadow-accent-default/10 lg:scale-105 lg:py-12"
                    : "border-border-default bg-surface"
                }`}
              >
                {plan.highlight && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-default text-text-inverse">
                    Best Value
                  </Badge>
                )}

                <h3 className="font-heading mb-1 text-xl font-bold text-text-primary">{plan.name}</h3>
                <p className="mb-2 text-sm text-text-muted">{plan.area}</p>
                <p className="mb-2 text-3xl font-bold text-accent-default">{plan.price}</p>

                {plan.roi && (
                  <p className="mb-6 flex items-center gap-1.5 text-sm font-semibold text-green-600">
                    <TrendingUp className="size-4" />
                    {plan.roi}
                  </p>
                )}
                {!plan.roi && <div className="mb-6" />}

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent-default" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={`w-full ${
                    plan.highlight
                      ? "bg-accent-default text-text-inverse hover:bg-accent-dark"
                      : "border border-border-default bg-transparent text-text-primary hover:bg-surface"
                  }`}
                  size="lg"
                >
                  <Link href="/contact">
                    Enquire Now <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-text-muted">
            * Starting prices. Actual pricing may vary based on floor preference and customization options.
            A monthly maintenance fee covers all community services and amenities.
          </p>
        </Container>
      </section>

      {/* Video Break */}
      <VideoBreak
        videoSrc="/assets-2025/videos/sanctuary-living.mp4"
        watermarkText="YOUR LEGACY"
      />

      {/* Feature Comparison Table */}
      <section className="py-16" ref={tableRef as React.RefObject<HTMLElement>}>
        <Container size="lg">
          <SectionHeading badge="Compare" title="Feature Comparison" />

          <div className="overflow-x-auto rounded-xl border border-border-default">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="border-b border-border-default bg-surface">
                  <th className="px-6 py-4 text-sm font-semibold text-text-primary">Feature</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-text-primary">
                    Walk-up Villa
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-accent-default">
                    Executive Suite
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-text-primary">
                    Independent Villa
                  </th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_COMPARISON.map((row, i) => (
                  <tr
                    key={row.feature}
                    data-gsap-row
                    className={`border-b border-border-subtle ${
                      i % 2 === 0 ? "bg-transparent" : "bg-surface/50"
                    }`}
                  >
                    <td className="px-6 py-3 text-sm font-medium text-text-primary">{row.feature}</td>
                    <td className="px-6 py-3 text-center"><BoolOrText value={row.studio} /></td>
                    <td className="px-6 py-3 text-center"><BoolOrText value={row.harmony} /></td>
                    <td className="px-6 py-3 text-center"><BoolOrText value={row.villa} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* NRI Section */}
      <section className="py-16">
        <Container size="md">
          <div className="rounded-2xl border border-border-accent bg-surface p-8 md:p-12">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-accent-default/10">
                <Globe className="size-6 text-accent-default" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-text-primary">
                Special NRI Packages
              </h2>
            </div>
            <p className="mb-6 leading-relaxed text-text-secondary">
              We understand the unique needs of NRI families seeking a safe and comfortable home for
              their loved ones. Our dedicated NRI concierge team helps with every step — from virtual
              tours to documentation and payment processing.
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <CreditCard className="mt-0.5 size-5 shrink-0 text-accent-default" />
                <div>
                  <p className="text-sm font-semibold text-text-primary">International Payments</p>
                  <p className="text-xs text-text-muted">Wire transfer, NRE/NRO accounts, major currencies</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="mt-0.5 size-5 shrink-0 text-accent-default" />
                <div>
                  <p className="text-sm font-semibold text-text-primary">Virtual Tours</p>
                  <p className="text-xs text-text-muted">Live video tours with our team from anywhere</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 size-5 shrink-0 text-accent-default" />
                <div>
                  <p className="text-sm font-semibold text-text-primary">ISO 9001 Certified</p>
                  <p className="text-xs text-text-muted">Quality-assured construction and transparent pricing</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-8 pb-24">
        <Container size="md">
          <div className="text-center">
            <h2 className="font-heading mb-4 text-3xl font-bold text-text-primary">
              Ready to Discuss Pricing?
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-text-secondary">
              Our team is here to help you find the perfect residence within your budget.
              No hidden fees, no surprises.
            </p>
            <Button asChild className="bg-accent-default text-text-inverse hover:bg-accent-dark" size="lg">
              <Link href="/contact">
                Discuss Pricing <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
