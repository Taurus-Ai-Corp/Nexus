import { z } from "zod/v4";

/* ------------------------------------------------------------------ */
/*  Investment Tier Types                                              */
/* ------------------------------------------------------------------ */
export type TierId = "silver" | "gold" | "platinum";

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
  exitTerms: {
    lockInYears: number;
    noticePeriod: string;
    payoutMethod: string;
  };
}

/* ------------------------------------------------------------------ */
/*  Investment Tiers — Board-Approved Structure (May 2026)              */
/*  Silver: ₹10L | Gold: ₹20L | Platinum: ₹30L                      */
/* ------------------------------------------------------------------ */
export const INVESTMENT_TIERS: InvestmentTier[] = [
  {
    id: "silver",
    name: "Silver",
    investment: 10,
    investmentDisplay: "₹10 Lakhs",
    totalReturn: 150,
    annualInterest: 10,
    interestYears: "Years 1–4",
    dividendStart: "From Year 5",
    badge: "Entry",
    highlights: [
      "10% annual interest on deposit",
      "Deposit converts to share capital at Year 5 — qualifies you for dividend participation",
      "Dividend participation from Year 5",
      "1 day free guest stay yearly",
      "10% discount on guest room rent (in addition to free stay)",
      "50% discount on event hall rent (150 pax capacity)",
      "10% discount on family tour packages",
      "10% discount on wellness package yearly",
      "Quarterly financial reports",
    ],
    perks: {
      eventHall: "50% discount yearly",
      guestHouse: "1 night/year",
      patronWall: "—",
    },
    exitTerms: {
      lockInYears: 5,
      noticePeriod: "6 months",
      payoutMethod: "3 equal instalments",
    },
  },
  {
    id: "gold",
    name: "Gold",
    investment: 20,
    investmentDisplay: "₹20 Lakhs",
    totalReturn: 150,
    annualInterest: 10,
    interestYears: "Years 1–4",
    dividendStart: "From Year 5",
    badge: "Best Value",
    highlights: [
      "10% annual interest on deposit",
      "Deposit converts to share capital at Year 5 — qualifies you for dividend participation",
      "Dividend participation from Year 5",
      "3 days free guest stay yearly",
      "20% discount on guest room rent (in addition to free stay)",
      "1 day free event hall usage yearly (150 pax capacity)",
      "15% discount on family tour packages",
      "10% discount on wellness package yearly",
      "Quarterly financial reports",
    ],
    perks: {
      eventHall: "1 day/year rent-free",
      guestHouse: "3 nights/year",
      patronWall: "—",
    },
    exitTerms: {
      lockInYears: 5,
      noticePeriod: "6 months",
      payoutMethod: "3 equal instalments",
    },
  },
  {
    id: "platinum",
    name: "Platinum",
    investment: 30,
    investmentDisplay: "₹30 Lakhs",
    totalReturn: 153,
    annualInterest: 10,
    interestYears: "Years 1–4",
    dividendStart: "From Year 5",
    badge: "Premium",
    highlights: [
      "10% annual interest on deposit",
      "Deposit converts to share capital at Year 5 — qualifies you for enhanced dividend participation",
      "Enhanced dividend participation from Year 5",
      "5 days free guest stay yearly",
      "30% discount on guest room rent (in addition to free stay)",
      "1 day free event hall usage yearly (150 pax capacity)",
      "20% discount on family tour packages",
      "15% discount on wellness package yearly",
      "Director Board liaison access",
      "Quarterly financial reports",
    ],
    perks: {
      eventHall: "1 day/year rent-free",
      guestHouse: "5 nights/year",
      patronWall: "Gold",
    },
    exitTerms: {
      lockInYears: 5,
      noticePeriod: "6 months",
      payoutMethod: "3 equal instalments",
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
    description: "Nature walks through 8+ acres of curated greenery",
    image: "/assets-2025/images/invest/garden-pathway.webp",
  },
];

/* ------------------------------------------------------------------ */
/*  Investor Value Propositions (Bento grid — Section 3)               */
/* ------------------------------------------------------------------ */
export const INVESTOR_PROMISES = [
  {
    title: "Total Returns Over 15 Years",
    description: "Compound growth through 10% annual interest (years 1–4), deposit-to-share conversion, and escalating dividends from 6% to 20% — all from a single investment in Mater Maria Homes.",
    icon: "TrendingUp" as const,
    stat: { value: 153, suffix: "%", type: "number-flow" as const },
    tag: "15-YEAR PROJECTED ROI",
    span: "small" as const,
  },
  {
    title: "Annual Interest on Deposit",
    description: "Your deposit earns guaranteed 10% per annum for the first four years while your share capital appreciates — a rare combination of safety and growth.",
    icon: "Percent" as const,
    stat: { value: 10, suffix: "%", type: "number-flow" as const },
    tag: "GUARANTEED ANNUAL RETURN",
    span: "small" as const,
  },
  {
    title: "Premium Residences on Estate",
    description: "Choose from Independent Villas, Walk-up Villas, or Executive Suites — each solar-powered, IoT-enabled, and surrounded by 8+ acres of tropical greenery.",
    icon: "Shield" as const,
    stat: { value: 90, suffix: "+", type: "number-flow" as const },
    tag: "RESIDENCES AVAILABLE",
    span: "large" as const,
  },
  {
    title: "Board-Supervised Governance",
    description: "ISO 9001 certified. Led by Bishop Mar Jose Pulickal as Patron, with transparent quarterly reporting, NRI-friendly investment structure, and RERA-compliant operations.",
    icon: "Shield" as const,
    stat: { value: 100, suffix: "%", type: "number-flow" as const },
    tag: "COMPLIANCE & TRANSPARENCY",
    span: "large" as const,
  },
  {
    title: "Acres of Net-Zero Greenery",
    description: "100% solar-powered estate with rainwater harvesting, rechargeable wells, organic central kitchen, tropical fruit orchards, and private fishing ponds — your investment grows greener every year.",
    icon: "Leaf" as const,
    stat: { value: 8, suffix: "+", type: "number-flow" as const },
    tag: "NET-ZERO ESTATE",
    span: "large" as const,
  },
  {
    title: "World-Class Facilities Included",
    description: "24/7 AI IoT advanced medical care, MMT Hospital Annexure, Ayurvedic Treatment Block, yoga halls, amphitheatre, luxury home theatre, and concierge — no extra charges for residents.",
    icon: "Cpu" as const,
    stat: { value: 48, suffix: "", type: "number-flow" as const },
    tag: "FACILITIES FOR RESIDENTS",
    span: "medium" as const,
  },
];

/* ------------------------------------------------------------------ */
/*  Investor Perks (Section 6) — Updated per Board Document          */
/* ------------------------------------------------------------------ */
export const INVESTOR_PERKS = [
  {
    title: "Guest Room Stays",
    description: "Complimentary guest room nights for family visits every year — 1 day for Silver, 3 days for Gold, 5 days for Platinum.",
    icon: "Home" as const,
    detail: "1–5 nights/year",
  },
  {
    title: "Guest Room Discount",
    description: "Discounted rates on additional guest room bookings beyond your complimentary stay.",
    icon: "Key" as const,
    detail: "10–30% off",
  },
  {
    title: "Event Hall",
    description: "Access to the 150-capacity multi-purpose hall for family gatherings and celebrations.",
    icon: "Theater" as const,
    detail: "50% off to 1 day free",
  },
  {
    title: "Family Tour Packages",
    description: "Exclusive discounts on curated Kerala family tour packages for investors and their families.",
    icon: "Sparkles" as const,
    detail: "10–20% off",
  },
  {
    title: "Wellness Package",
    description: "Annual discount on Ayurvedic treatments, spa therapies, and holistic wellness programmes.",
    icon: "Award" as const,
    detail: "10–15% off",
  },
  {
    title: "Director Board Liaison",
    description: "Direct access to the Mater Maria Director Board for Platinum-tier investors.",
    icon: "FileText" as const,
    detail: "Platinum exclusive",
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
    image: "/assets-2025/images/invest/hero-estate.webp",
  },
  {
    name: "Thomas Abraham",
    role: "Managing Director",
    image: "/assets-2025/images/invest/hero-aerial.webp",
  },
  {
    name: "Paul Jose",
    role: "Director of Projects",
    image: "/assets-2025/images/invest/hero-garden.webp",
  },
  {
    name: "Jobin George",
    role: "Director – Finance",
    image: "/assets-2025/images/invest/hero-sunset.webp",
  },
  {
    name: "Charles Jose",
    role: "Director – Project Engineering",
    image: "/assets-2025/images/invest/hero-estate.webp",
  },
  {
    name: "Binoj Kurian",
    role: "Director – Risk & Compliance",
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

export interface CountryCoordinator {
  flag: string;
  country: string;
  name: string;
  phone: string;
}

export const COUNTRY_COORDINATORS: CountryCoordinator[] = [
  { flag: "🇦🇺", country: "Australia", name: "Vion Augustin", phone: "+61 495 934 654" },
  { flag: "🇦🇺", country: "Australia", name: "Aleen Jones", phone: "+61 432 898 323" },
  { flag: "🇨🇦", country: "Canada", name: "Jacob Antony", phone: "+1 403 870 8124" },
  { flag: "🇩🇪", country: "Germany", name: "Roy Joseph", phone: "+30 357 353 2646" },
  { flag: "🇮🇳", country: "India", name: "Thomas Abraham", phone: "+91 73569 27730" },
  { flag: "🇮🇳", country: "India", name: "Paul Jose", phone: "+91 9400939936" },
  { flag: "🇮🇹", country: "Italy", name: "Tony George", phone: "+39 328 368 8700" },
  { flag: "🇮🇱", country: "Israel", name: "Senna Joseph", phone: "+972 50 660 0600" },
  { flag: "🇮🇪", country: "Ireland", name: "Ashish Tomy", phone: "+353 89 262 000" },
  { flag: "🇰🇼", country: "Kuwait", name: "Ninoy George", phone: "+965 6099 8456" },
  { flag: "🇸🇦", country: "Saudi Arabia", name: "Dennis Joseph", phone: "+966 50 646 7823" },
  { flag: "🇴🇲", country: "Oman", name: "Jopin George", phone: "+91 96367 00000" },
  { flag: "🇬🇧", country: "United Kingdom", name: "Sony Chacko", phone: "+44 7722 308 974" },
  { flag: "🇦🇪", country: "UAE", name: "Rajeev Abraham", phone: "+971 50 578 6471" },
  { flag: "🇦🇪", country: "UAE", name: "Binoj Kurian", phone: "+971 552 892 841" },
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
  { code: "INR", symbol: "₹", label: "INR", rateFromINR: 1, locale: "en-IN" },
  { code: "USD", symbol: "$", label: "USD", rateFromINR: 0.01189, locale: "en-US" },
  { code: "AED", symbol: "د.إ", label: "AED", rateFromINR: 0.04367, locale: "ar-AE" },
  { code: "GBP", symbol: "£", label: "GBP", rateFromINR: 0.00943, locale: "en-GB" },
];

/* ------------------------------------------------------------------ */
/*  Hero Stats                                                         */
/* ------------------------------------------------------------------ */
export const INVESTOR_HERO_STATS = [
  { value: 8, suffix: "+", label: "Acres of Greenery" },
  { value: 90, suffix: "", label: "Premium Residences" },
  { value: 0, suffix: "Net-Zero", label: "Carbon Footprint" },
  { value: 10, suffix: "km", label: "to Mary Queens Hospital" },
];

/* ------------------------------------------------------------------ */
/*  Lead Form Schema                                                   */
/* ------------------------------------------------------------------ */
export const investorLeadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Valid email required"),
  phone: z.string().min(8, "Valid phone number required"),
  country: z.string().min(2, "Country is required"),
  tier: z.enum(["silver", "gold", "platinum"]),
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
    "Join the founding patrons of Kerala's premier wellness estate. Investment tiers from ₹10 Lakhs with 10% annual interest and up to 153% returns over 15 years.",
  ogImage: "/assets-2025/images/invest/og-invest.webp",
};
