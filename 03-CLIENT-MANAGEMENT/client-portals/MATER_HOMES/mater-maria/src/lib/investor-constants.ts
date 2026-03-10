import { z } from "zod/v4";

/* ------------------------------------------------------------------ */
/*  Investment Tier Types                                              */
/* ------------------------------------------------------------------ */
export type TierId = "silver" | "gold" | "diamond" | "platinum";

export interface InvestmentTier {
  id: TierId;
  name: string;
  investment: number; // in lakhs
  investmentDisplay: string;
  totalReturn: number; // percentage over 15 years
  annualInterest: number; // percentage
  interestYears: string;
  dividendStart: string;
  highlights: string[];
  badge?: string;
  perks: {
    eventHall: string;
    guestHouse: string;
    patronWall: string;
  };
}

/* ------------------------------------------------------------------ */
/*  Investment Tiers — Strategic disclosure only                       */
/* ------------------------------------------------------------------ */
export const INVESTMENT_TIERS: InvestmentTier[] = [
  {
    id: "diamond",
    name: "Diamond",
    investment: 30,
    investmentDisplay: "\u20B930 Lakhs",
    totalReturn: 153,
    annualInterest: 10,
    interestYears: "Years 1–4",
    dividendStart: "From Year 5",
    badge: "Premium",
    highlights: [
      "10% annual interest on deposit",
      "Enhanced dividend participation from Year 5",
      "Event hall — rent-free 2×/year",
      "Guest house — 7 nights/year",
      "Gold patron wall recognition",
      "Direct board liaison access",
      "Annual investor appreciation gala (VIP)",
    ],
    perks: {
      eventHall: "2×/year rent-free",
      guestHouse: "7 nights/year",
      patronWall: "Gold",
    },
  },
  {
    id: "platinum",
    name: "Platinum",
    investment: 20,
    investmentDisplay: "\u20B920 Lakhs",
    totalReturn: 150,
    annualInterest: 10,
    interestYears: "Years 1–4",
    dividendStart: "From Year 5",
    badge: "Best Value",
    highlights: [
      "10% annual interest on deposit",
      "Dividend participation from Year 5",
      "Event hall — rent-free 1×/year",
      "Guest house — 4 nights/year",
      "Bronze patron wall recognition",
      "Priority board communications",
    ],
    perks: {
      eventHall: "1×/year rent-free",
      guestHouse: "4 nights/year",
      patronWall: "Bronze",
    },
  },
  {
    id: "gold",
    name: "Gold",
    investment: 10,
    investmentDisplay: "\u20B910 Lakhs",
    totalReturn: 150,
    annualInterest: 10,
    interestYears: "Years 1–4",
    dividendStart: "From Year 5",
    highlights: [
      "10% annual interest on deposit",
      "Dividend participation from Year 5",
      "Guest house — 2 nights/year",
      "Quarterly financial reports",
      "Annual investor appreciation gala",
    ],
    perks: {
      eventHall: "—",
      guestHouse: "2 nights/year",
      patronWall: "—",
    },
  },
  {
    id: "silver",
    name: "Silver",
    investment: 5,
    investmentDisplay: "\u20B95 Lakhs",
    totalReturn: 150,
    annualInterest: 10,
    interestYears: "Years 1–4",
    dividendStart: "From Year 5",
    badge: "Entry",
    highlights: [
      "10% annual interest on deposit",
      "Dividend participation from Year 5",
      "Quarterly financial reports",
      "Estate tour priority access",
    ],
    perks: {
      eventHall: "—",
      guestHouse: "—",
      patronWall: "—",
    },
  },
];

/* ------------------------------------------------------------------ */
/*  ROI Projection Data — Per tier, 15-year model                     */
/*  Interest: 10% on deposit (Yr 1-4)                                 */
/*  Deposit converts to share capital at Year 5                        */
/*  Dividends: escalating 6% → 20% (Yr 5-15)                         */
/* ------------------------------------------------------------------ */
export interface YearProjection {
  year: number;
  phase: "interest" | "dividend";
  rate: number; // percent
  annualReturn: number; // in lakhs
  cumulative: number; // in lakhs
}

const DIVIDEND_RATES = [6, 7, 8, 10, 12, 14, 15, 16, 17, 18, 20];

export function generateProjection(investmentLakhs: number): YearProjection[] {
  const projections: YearProjection[] = [];
  let cumulative = 0;

  // Years 1-4: 10% interest on deposit
  for (let yr = 1; yr <= 4; yr++) {
    const annualReturn = investmentLakhs * 0.10;
    cumulative += annualReturn;
    projections.push({
      year: yr,
      phase: "interest",
      rate: 10,
      annualReturn,
      cumulative,
    });
  }

  // Years 5-15: escalating dividends
  for (let yr = 5; yr <= 15; yr++) {
    const rate = DIVIDEND_RATES[yr - 5] ?? 20;
    const annualReturn = investmentLakhs * (rate / 100);
    cumulative += annualReturn;
    projections.push({
      year: yr,
      phase: "dividend",
      rate,
      annualReturn,
      cumulative,
    });
  }

  return projections;
}

/* ------------------------------------------------------------------ */
/*  Property Showcase Items                                            */
/* ------------------------------------------------------------------ */
export const PROPERTY_SHOWCASE = [
  {
    id: "ayurvedic-spa",
    title: "Ayurvedic Wellness Spa",
    description: "Traditional Kerala treatments in a modern setting",
    image: "/assets-2025/images/amenities/yoga-meditation.webp",
  },
  {
    id: "chapel",
    title: "Meditation & Wellness Pavilion",
    description: "A tranquil space for yoga, meditation, and mindful living",
    image: "/assets-2025/images/amenities/mm-yoga-pavilion.webp",
  },
  {
    id: "infinity-pool",
    title: "Infinity Pool",
    description: "Overlooking the valley with panoramic mountain views",
    image: "/assets-2025/images/invest/pool.webp",
  },
  {
    id: "organic-farm",
    title: "Organic Farm",
    description: "Farm-to-table dining from our own terraced gardens",
    image: "/assets-2025/images/invest/farm.webp",
  },
  {
    id: "cultural-hall",
    title: "Cultural Hall",
    description: "150-seat venue for events, performances, and gatherings",
    image: "/assets-2025/images/invest/cultural-hall.webp",
  },
  {
    id: "meditation-garden",
    title: "Meditation Garden",
    description: "Curated zen spaces for mindfulness and reflection",
    image: "/assets-2025/images/invest/meditation.webp",
  },
  {
    id: "fitness-center",
    title: "Fitness & Yoga Center",
    description: "Expert-led sessions for active living and vitality",
    image: "/assets-2025/images/invest/fitness.webp",
  },
  {
    id: "smart-homes",
    title: "Smart Residences",
    description: "IoT-enabled, barrier-free luxury apartments",
    image: "/assets-2025/images/invest/smart-home.webp",
  },
  {
    id: "walking-trails",
    title: "Landscaped Trails",
    description: "Nature walks through 5+ acres of curated greenery",
    image: "/assets-2025/images/invest/garden-pathway.webp",
  },
];

/* ------------------------------------------------------------------ */
/*  Investor Value Propositions (Bento grid — Section 3)               */
/* ------------------------------------------------------------------ */
export const INVESTOR_PROMISES = [
  {
    title: "Government-Backed Security",
    description: "Board-supervised governance, ISO 9001 certified, AI-powered operations",
    icon: "Shield" as const,
    stat: null,
    span: "large" as const,
  },
  {
    title: "Total Returns",
    description: "Over 15 years across interest + dividends",
    icon: "TrendingUp" as const,
    stat: { value: 153, suffix: "%", type: "number-flow" as const },
    span: "small" as const,
  },
  {
    title: "Annual Interest",
    description: "On your deposit for years 1–4",
    icon: "Percent" as const,
    stat: { value: 10, suffix: "%", type: "slot-counter" as const },
    span: "small" as const,
  },
  {
    title: "Net-Zero Estate",
    description: "Solar powered, rainwater harvested, organic farming",
    icon: "Leaf" as const,
    stat: null,
    span: "large" as const,
  },
  {
    title: "10km to Medical College",
    description: "Plus 24/7 on-campus nursing and emergency response",
    icon: "HeartPulse" as const,
    stat: null,
    span: "medium" as const,
  },
  {
    title: "Connected Community",
    description: "Yoga halls, meditation gardens, amphitheatre, resident lounges",
    icon: "Cpu" as const,
    stat: null,
    span: "medium" as const,
  },
];

/* ------------------------------------------------------------------ */
/*  Investor Perks (Section 6)                                         */
/* ------------------------------------------------------------------ */
export const INVESTOR_PERKS = [
  {
    title: "Event Hall",
    description: "150-seat venue, rent-free for qualifying tiers",
    icon: "Theater" as const,
    detail: "Up to 2× per year",
  },
  {
    title: "Guest House",
    description: "Premium double room for family visits",
    icon: "Home" as const,
    detail: "Up to 7 nights per year",
  },
  {
    title: "Patron Wall",
    description: "Your name immortalized at the estate entrance",
    icon: "Award" as const,
    detail: "Bronze or Gold tier",
  },
  {
    title: "Board Reports",
    description: "Quarterly financial transparency and updates",
    icon: "FileText" as const,
    detail: "Full investor communications",
  },
  {
    title: "Estate Access",
    description: "Priority tours and community event invitations",
    icon: "Key" as const,
    detail: "Year-round privileges",
  },
  {
    title: "Annual Gala",
    description: "Exclusive investor appreciation dinner",
    icon: "Sparkles" as const,
    detail: "VIP for Platinum tier",
  },
];

/* ------------------------------------------------------------------ */
/*  Trust & Governance                                                 */
/* ------------------------------------------------------------------ */
export const TRUST_ITEMS = [
  { label: "Net-Zero Solar Campus", icon: "Shield" as const },
  { label: "AI-Powered Estate", icon: "Cpu" as const },
  { label: "Board Supervised", icon: "Users" as const },
  { label: "ISO 9001", icon: "BadgeCheck" as const },
  { label: "Medical College Partner", icon: "HeartPulse" as const },
];

export const LEADERSHIP = [
  {
    name: "Rajeev Abraham",
    role: "Chairman & Global Coordinator",
    credentials: "M.A., B.Ed. | CFM | IOSH, OSHA Certified",
    bio: "37 years of global expertise in premium international educational infrastructure across Dubai and the Middle East.",
    image: "/assets-2025/images/invest/hero-estate.webp",
  },
  {
    name: "Thomas Abraham",
    role: "Managing Director",
    credentials: "B.Sc. | PG Dip. Marketing | MBA – SCM",
    bio: "35 years of distinguished leadership at Milma, Kerala's most respected institutional brand.",
    image: "/assets-2025/images/invest/hero-aerial.webp",
  },
  {
    name: "Paul Jose",
    role: "Director of Projects",
    credentials: "26+ years construction & project management",
    bio: "Managing Partner of Septa Group, delivering residential, institutional, and resort developments across Kerala.",
    image: "/assets-2025/images/invest/hero-garden.webp",
  },
  {
    name: "Jobin George",
    role: "Director – Finance",
    credentials: "B.Com | CA (India) | CIA (USA)",
    bio: "15+ years cross-sector expertise in forensic audits, financial analysis, and strategic financial management.",
    image: "/assets-2025/images/invest/hero-sunset.webp",
  },
  {
    name: "Charles Jose",
    role: "Director – Project Engineering",
    credentials: "B.E. (Civil Engineering)",
    bio: "Led complex developments across Oman, Dubai, Saudi Arabia, Mumbai, Pune, and Bangalore.",
    image: "/assets-2025/images/invest/hero-estate.webp",
  },
  {
    name: "Binoj Kurian",
    role: "Director – Risk & Compliance",
    credentials: "ACII (UK) | ARM (USA) | Company Secretary",
    bio: "20+ years at leading multinational insurance organizations. Head of Compliance at Mitsui Sumitomo Insurance, UAE.",
    image: "/assets-2025/images/invest/hero-aerial.webp",
  },
];

/* ------------------------------------------------------------------ */
/*  Advisory Board — Spiritual & Pastoral Leadership                   */
/* ------------------------------------------------------------------ */
export const ADVISORY_BOARD = [
  {
    name: "Bishop Mar Jose Pulickal",
    role: "Spiritual Patron",
    org: "Diocese of Kanjirappally",
  },
  {
    name: "Rev. Fr. Sebastian Kollamkunnel",
    role: "Vicar General",
    org: "Diocese of Kanjirappally",
  },
  {
    name: "Rev. Fr. Mathew Puthumana",
    role: "Global Director, Pravasi Apostolate",
    org: "Diocese of Kanjirappally",
  },
];

/* ------------------------------------------------------------------ */
/*  Vision, Mission & Core Values                                      */
/* ------------------------------------------------------------------ */
export const VISION =
  "A compassionate and secure haven where families can place their most precious people, confident in the knowledge that every moment of every day is devoted to their dignity, their care, and the quiet, sustaining peace of the soul.";

export const MISSION =
  "To thoughtfully design and expertly steward wellness homes where exceptional living standards, professional healthcare, rich community connection, and spiritual nourishment are not separate offerings — but a single, seamless promise.";

export const CORE_VALUES = [
  {
    title: "Dignity Through Precision",
    description: "Our commitment to operational excellence is the primary way we honor the dignity of every resident.",
  },
  {
    title: "Fiduciary Integrity",
    description: "Financial trust exercised with unwavering ethical stewardship — transparent, accountable, and absolute.",
  },
  {
    title: "Compassionate Professionalism",
    description: "Professional rigor and spiritual mission are inseparable under our Dual-Covenant of executive excellence and pastoral care.",
  },
  {
    title: "Structural Stewardship",
    description: "Every structure we build is maintained to endure — safe, compliant, and worthy of the lives it shelters.",
  },
  {
    title: "Holistic Vitality",
    description: "Body, mind, and spirit — wellness programs designed for the whole person, not just the physical.",
  },
];

export const COUNTRY_COORDINATORS = [
  "Australia", "Italy", "Germany", "United Arab Emirates", "India",
  "Oman", "Canada", "United States", "United Kingdom", "Kuwait",
];

/* ------------------------------------------------------------------ */
/*  Currency Configuration for NRI Toggle                              */
/* ------------------------------------------------------------------ */
export type CurrencyCode = "INR" | "USD" | "AED" | "GBP";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rateFromINR: number; // 1 INR = X foreign currency
  locale: string;
}

export const CURRENCIES: CurrencyConfig[] = [
  { code: "INR", symbol: "\u20B9", label: "INR", rateFromINR: 1, locale: "en-IN" },
  { code: "USD", symbol: "$", label: "USD", rateFromINR: 0.01189, locale: "en-US" },
  { code: "AED", symbol: "\u062F.\u0625", label: "AED", rateFromINR: 0.04367, locale: "ar-AE" },
  { code: "GBP", symbol: "\u00A3", label: "GBP", rateFromINR: 0.00943, locale: "en-GB" },
];

/* ------------------------------------------------------------------ */
/*  Hero Stats                                                         */
/* ------------------------------------------------------------------ */
export const INVESTOR_HERO_STATS = [
  { value: 5, suffix: "+", label: "Acres of Greenery" },
  { value: 90, suffix: "", label: "Premium Residences" },
  { value: 0, suffix: "Net-Zero", label: "Carbon Footprint" },
  { value: 10, suffix: "km", label: "to Medical College" },
];

/* ------------------------------------------------------------------ */
/*  Lead Form Schema                                                   */
/* ------------------------------------------------------------------ */
export const investorLeadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Valid email required"),
  phone: z.string().min(8, "Valid phone number required"),
  country: z.string().min(2, "Country is required"),
  tier: z.enum(["silver", "gold", "diamond", "platinum"]),
  message: z.string().optional(),
  isNRI: z.boolean().optional(),
});

export type InvestorLeadFormData = z.infer<typeof investorLeadSchema>;

/* ------------------------------------------------------------------ */
/*  Page Metadata                                                      */
/* ------------------------------------------------------------------ */
export const INVEST_PAGE = {
  title: "Invest in Mater Maria Homes",
  description:
    "Join the founding patrons of Kerala's premier wellness estate. Investment tiers from ₹5 Lakhs with 10% annual interest and up to 153% returns over 15 years.",
  ogImage: "/assets-2025/images/invest/og-invest.webp",
};
