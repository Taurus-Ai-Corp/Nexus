import type { Metadata } from "next";
import {
  EstateHero,
  PropertyShowcase,
  InteractiveZoom,
  InvestorPromise,
  InvestmentTiers,
  ROICalculator,
  InvestorPerks,
  TrustGovernance,
  LeadCapture,
  FloatingWhatsApp,
  StickyInvestCTA,
  TierComparisonDrawer,
  InvestorChatWidget,
} from "@/components/invest";
// ROICalculator = share-based Nivo chart (kept)
// Unit-based Recharts calculator removed from InvestPageClient
import { InvestPageClient } from "./InvestPageClient";
import { SITE, INVESTOR_FAQ } from "@/lib/constants";

/* ------------------------------------------------------------------ */
/*  Programmatic SEO Metadata                                          */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title:
    "NRI Investment Kerala | AI-Powered Wellness Community ROI | Mater Maria Homes",
  description:
    "Kerala's first AI-powered smart wellness community. IoT health monitoring, smart home automation, solar net-zero campus. 150%+ returns, 10% interest. NRI-friendly from ₹5L.",
  keywords: [
    "AI-powered wellness community Kerala",
    "smart home estate Kerala investment",
    "IoT wellness monitoring community living",
    "solar-powered net-zero estate Kerala",
    "NRI real estate investment Kerala",
    "AI health monitoring community India",
    "sustainable community living Kottayam",
    "organic living community India",
    "smart community Kanjirappally",
    "IoT smart home sensors Kerala",
    "green building estate Kerala",
    "NRI property investment India",
    "community living ROI Kerala 150 percent",
    "luxury villa Kerala investment",
    "Ayurvedic wellness community Kerala",
    "Mater Maria Homes investment",
  ],
  openGraph: {
    title: "Invest in Mater Maria Homes | 150%+ Returns | Kerala",
    description:
      "AI-powered sustainable luxury living. IoT health monitoring, solar net-zero campus, smart home automation. 150%+ projected returns. Invest from ₹5L.",
    type: "website",
    url: `https://${SITE.domain}/invest`,
    images: [
      {
        url: "/assets-2025/images/invest/hero-estate.webp",
        width: 1200,
        height: 630,
        alt: "Mater Maria Homes — Kerala Investment Opportunity",
      },
    ],
    siteName: SITE.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "NRI Investment | Mater Maria Homes Kerala",
    description:
      "Kerala's first AI-powered smart wellness community. IoT sensors, fall detection, smart homes, solar net-zero. 150%+ returns. NRI plans from ₹5L.",
  },
  alternates: {
    canonical: `https://${SITE.domain}/invest`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* ------------------------------------------------------------------ */
/*  JSON-LD Structured Data                                            */
/*  All data is static/hardcoded constants — no user input, safe.      */
/* ------------------------------------------------------------------ */

function InvestorJsonLd() {
  const realEstateListing = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: "Mater Maria Homes — Investment Opportunity",
    description:
      "Kerala's first AI-powered smart wellness community in Kanjirappally — 90 residences with IoT wellness monitoring, AI health assistants, fall detection sensors, smart home automation, 100% solar-powered net-zero campus, organic central kitchen, on-site hospital annexure, and Ayurvedic treatment block. Investment tiers from ₹5 Lakhs with 10% annual interest and 150%+ projected returns over 15 years. NRI-friendly with UAE, US, UK payment channels.",
    url: `https://${SITE.domain}/invest`,
    image: `https://${SITE.domain}/images/invest/og-invest.webp`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Elangulam",
      addressLocality: "Kanjirappally",
      addressRegion: "Kerala",
      postalCode: "686507",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "9.5690",
      longitude: "76.7900",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Silver Investment Tier",
        price: "500000",
        priceCurrency: "INR",
        description: "Entry-level stake in Kerala's AI-powered wellness estate. 10% annual interest Years 1-4, escalating dividends from Year 5. Access solar net-zero campus, IoT-monitored residences, organic living amenities.",
      },
      {
        "@type": "Offer",
        name: "Gold Investment Tier",
        price: "1000000",
        priceCurrency: "INR",
        description: "Mid-tier investment in AI-powered smart community living. 10% annual interest, guest house access, dividend participation. Includes smart home automation, AI health assistants, sustainable net-zero infrastructure.",
      },
      {
        "@type": "Offer",
        name: "Diamond Investment Tier",
        price: "2000000",
        priceCurrency: "INR",
        description: "Premium stake in Kerala's sustainable wellness ecosystem. Event hall access, guest house, patron wall recognition, enhanced dividends. IoT vital monitoring, fall detection, Ayurvedic wellness block, organic orchards.",
      },
      {
        "@type": "Offer",
        name: "Platinum Investment Tier",
        price: "3000000",
        priceCurrency: "INR",
        description: "Ultra-premium investment with 153% projected returns, VIP benefits, direct board liaison. Full access to agentic AI health platform, smart home ecosystem, solar-powered net-zero campus, on-site hospital annexure, and private wellness amenities.",
      },
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: INVESTOR_FAQ.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: `https://${SITE.domain}`,
    description: SITE.description,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phone,
      email: SITE.email,
      contactType: "investment inquiries",
      availableLanguage: ["English", "Malayalam", "Hindi"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kanjirappally",
      addressRegion: "Kerala",
      postalCode: "686507",
      addressCountry: "IN",
    },
  };

  // All JSON-LD data is from static constants — no user-supplied content
  const schemas = [realEstateListing, faqPage, organization];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Safe: all values are hardcoded constants from lib/constants.ts
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function InvestPage() {
  return (
    <main id="main-content" className="bg-bg-base">
      <InvestorJsonLd />

      {/* S1: Estate Hero — Full-viewport immersive property reveal */}
      <EstateHero />

      {/* Diagonal separator */}
      <div className="relative h-16 lg:h-24" aria-hidden="true">
        <div className="absolute inset-0 bg-bg-base" style={{ clipPath: "polygon(0 0, 100% 60%, 100% 100%, 0 100%)" }} />
      </div>

      {/* S2: Property Showcase — Swiper Coverflow carousel */}
      <PropertyShowcase />

      {/* S2.5: Interactive Zoom — Scroll-driven image zoom effect */}
      <InteractiveZoom />

      {/* S3: The Promise — Why Invest bento grid */}
      <InvestorPromise />

      {/* Diagonal separator */}
      <div className="relative h-16 lg:h-24" aria-hidden="true">
        <div className="absolute inset-0 bg-bg-base" style={{ clipPath: "polygon(0 0, 100% 60%, 100% 100%, 0 100%)" }} />
      </div>

      {/* S4: Investment Tiers — 4 tier cards with NeonGradientCard */}
      <InvestmentTiers />

      {/* Tier Comparison — "Compare All Tiers" drawer trigger */}
      <div className="flex justify-center pb-8">
        <TierComparisonDrawer />
      </div>

      {/* S5: ROI Calculator — Interactive Nivo chart (share-based model) */}
      <ROICalculator />

      {/* Diagonal separator */}
      <div className="relative h-16 lg:h-24" aria-hidden="true">
        <div className="absolute inset-0 bg-bg-base" style={{ clipPath: "polygon(0 0, 100% 60%, 100% 100%, 0 100%)" }} />
      </div>

      {/* S6: Investor Perks — 3D tilt cards */}
      <InvestorPerks />

      {/* S7: Trust & Governance — Marquee + leadership + scripture */}
      <TrustGovernance />

      {/* === Additional sections from InvestPageClient === */}

      {/* S8: Investment Highlights — 6 GlowCards with SEO keywords */}
      {/* S9: Market Insights — Kerala real estate data chart */}
      {/* S10: Investor Testimonials — NRI success stories */}
      {/* S11: Investor FAQ — 8-item accordion */}
      <InvestPageClient />

      {/* S13: Lead Capture — Form + WhatsApp funnel */}
      <LeadCapture />

      {/* Persistent overlays — client components */}
      <FloatingWhatsApp />
      <StickyInvestCTA />
      <InvestorChatWidget />
    </main>
  );
}
