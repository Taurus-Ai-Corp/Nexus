"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

/* ============================================================
   MATER MARIA HOMEPAGE — UPDATED UI/UX
   Generated: 2026-05-16
   Changes mapped from: RAJEEV COMMENTS + EFFIN&PRAVEEN + IMAGES
   ============================================================ */

/* ---------- DATA ---------- */

const homeBanners = [
  { src: "/images/Home_Banner_01.jpg", alt: "Mater Maria Banner 1" },
  { src: "/images/Home_Banner_02.png", alt: "Mater Maria Banner 2" },
  { src: "/images/Home_Banner_03.png", alt: "Mater Maria Banner 3" },
  { src: "/images/Home_Banner_04.jpg", alt: "Mater Maria Banner 4" },
  { src: "/images/Home_Banner_05.jpg", alt: "Mater Maria Banner 5" },
  { src: "/images/Home_Banner_07.jpg", alt: "Mater Maria Banner 7" },
  { src: "/images/Home_Banner_08.jpg", alt: "Mater Maria Banner 8" },
];

const marqueeItems = [
  "24/7 Medical Facilities",
  "AI-Powered Smart Homes",
  "Diocese of Kanjirappally",
  "NRI Concierge Service",
];

const a001Images = [
  { src: "/images/mater-maria-sunset.png", label: "Aerial View" },
  { src: "/images/mater-maria-sunset-001.png", label: "Welcome Mater Maria" },
  { src: "/images/PersonalisedHealthcare.jpg", label: "Personalised Healthcare" },
  { src: "/images/MMH-gate-004.png", label: "Gate" },
  { src: "/images/luxury-interior-005.png", label: "Luxury Interiors" },
  { src: "/images/Ayurveda-006.png", label: "Wellness spa" },
  { src: "/images/mmh-003.jpeg", label: "Medical Care" },
];

const a002Images = [
  { src: "/images/signature-living001.png", label: "Signature Living Design" },
  { src: "/images/Medical-care002.png", label: "Medical Care" },
  { src: "/images/smart-home.jpg", label: "Smart Home" },
  { src: "/images/Buggie.png", label: "Buggie" },
  { src: "/images/Medical-Campus005.jpeg", label: "Medical Campus" },
  { src: "/images/hospitality-006.jpg", label: "Hospitality" },
  { src: "/images/Health-Monitoring.png", label: "Health Monitoring" },
];

const a003Images = [
  { src: "/images/MMT-Hospital-001.png", label: "On-Campus Medical" },
  { src: "/images/Family-time-002.png", label: "Dignity Through Precision" },
  { src: "/images/Reception-003.png", label: "Fiduciary Integrity" },
  { src: "/images/Hospitality-004.png", label: "Compassionate Professionalism" },
];

const countryContacts = [
  { country: "Australia", name: "Vipin Augustine", code: "61", phone: "415934654" },
  { country: "Australia", name: "Aneesh James", code: "61", phone: "432896323" },
  { country: "Canada", name: "Jacob Antony", code: "1", phone: "4038708524" },
  { country: "Germany", name: "Roy Joseph", code: "39", phone: "3517552646" },
  { country: "India", name: "Fr Mathew Puthumana", code: "91", phone: "9447080356" },
  { country: "India", name: "Thomas Abraham", code: "91", phone: "7356927730" },
  { country: "India", name: "Paul Jose", code: "91", phone: "940939936" },
  { country: "India", name: "Rajeev Abraham", code: "91", phone: "9656463073" },
  { country: "Italy", name: "Tomy George", code: "39", phone: "3283688700" },
  { country: "Israel", name: "Beena Joseph", code: "972", phone: "556800609" },
  { country: "Ireland", name: "Ashwin Tomy", code: "353", phone: "892620965" },
  { country: "Kuwait", name: "Nixon George", code: "965", phone: "66899495" },
  { country: "KSA", name: "Denny Joseph", code: "966", phone: "506467103" },
  { country: "Oman", name: "Jobin George", code: "91", phone: "9847043715" },
  { country: "United Kingdom", name: "Sony Chacko", code: "44", phone: "7723306974" },
  { country: "United Arab Emirates", name: "Rajeev Abraham", code: "971", phone: "505786471" },
  { country: "United Arab Emirates", name: "Binoj Kurian", code: "971", phone: "558828941" },
  { country: "USA", name: "", code: "", phone: "" },
];

/* ---------- COMPONENTS ---------- */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/95 backdrop-blur-sm shadow-lg" : "bg-black"
      }`}
      style={{ backgroundColor: "#000000" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-white text-xl font-light tracking-wide">
          Mater Maria
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/about" className="text-white/80 hover:text-white text-sm tracking-wide transition-colors">
            About
          </Link>
          <Link href="#features" className="text-white/80 hover:text-white text-sm tracking-wide transition-colors">
            Features
          </Link>
          <Link href="#residences" className="text-white/80 hover:text-white text-sm tracking-wide transition-colors">
            Residences
          </Link>
          <Link href="#invest" className="text-white/80 hover:text-white text-sm tracking-wide transition-colors">
            Invest
          </Link>
          <Link href="#contact" className="text-white/80 hover:text-white text-sm tracking-wide transition-colors">
            Contact
          </Link>
          <Link
            href="#invest"
            className="px-5 py-2 text-sm text-white border border-white/30 rounded hover:bg-[#1e4f92] hover:border-[#1e4f92] transition-all"
          >
            Invest
          </Link>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % homeBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {homeBanners.map((banner, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={banner.src}
            alt={banner.alt}
            fill
            className="object-cover"
            priority={idx === 0}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
        <h1 className="text-5xl md:text-7xl font-light mb-4 tracking-tight" style={{ fontFamily: "var(--global-font)" }}>
          Living <em className="italic">Refined</em>
        </h1>
        <p className="text-lg md:text-xl font-light tracking-wide mb-10 opacity-90">
          Precision Wellness Living
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="#explore"
            className="px-8 py-3 text-sm tracking-widest border border-white rounded hover:bg-[#1e4f92] hover:border-[#1e4f92] transition-all"
          >
            EXPLORE NOW
          </Link>
          <Link
            href="#contact"
            className="px-8 py-3 text-sm tracking-widest bg-white text-black rounded hover:bg-[#1e4f92] hover:text-white transition-all"
          >
            ENQUIRE NOW
          </Link>
          <Link
            href="#invest"
            className="px-8 py-3 text-sm tracking-widest border border-white rounded hover:bg-[#1e4f92] hover:border-[#1e4f92] transition-all"
          >
            INVEST NOW
          </Link>
        </div>
      </div>
      {/* Top Right Button */}
      <div className="absolute top-24 right-6 hidden lg:block">
        <Link
          href="#explore"
          className="px-6 py-2 text-xs tracking-widest border border-white/50 text-white rounded hover:bg-[#1e4f92] hover:border-[#1e4f92] transition-all"
        >
          EXPLORE NOW
        </Link>
      </div>
    </section>
  );
}

function OurStorySection() {
  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* REMOVED: "Our Story" heading */}
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8" style={{ fontFamily: "var(--global-font)" }}>
          Nestled within the serene landscapes of Kanjirappally, Mater Maria Homes was purposefully
          conceived as a retirement living experience that holds international standards of comfort
          in one hand, and the irreplaceable warmth of faith, family, and belonging in the other.
        </p>
        {/* REMOVED: "A community where residents..." paragraph */}
        <Link
          href="/about"
          className="inline-block px-8 py-3 text-sm tracking-widest border border-gray-800 text-gray-800 rounded hover:bg-[#1e4f92] hover:text-white hover:border-[#1e4f92] transition-all"
        >
          Discover More
        </Link>
      </div>
    </section>
  );
}

function VisionMissionSection() {
  return (
    <section className="py-24 px-6 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-light text-center mb-16 section-heading">
          Vision & <em className="italic">Mission</em>
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <Image
              src="/images/Family-mmh-mission02.png"
              alt="Vision"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-2xl font-light mb-4">Vision</h3>
            <p className="text-gray-700 leading-relaxed">
              To create India&apos;s most compassionate retirement community where every resident lives
              with dignity, purpose, and joy — surrounded by world-class care, spiritual warmth, and
              the beauty of Kerala&apos;s Western Ghats.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center mt-16">
          <div className="md:order-2 relative aspect-[4/3] rounded-lg overflow-hidden">
            <Image
              src="/images/mission-image.png"
              alt="Mission"
              fill
              className="object-cover"
            />
          </div>
          <div className="md:order-1">
            <h3 className="text-2xl font-light mb-4">Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              To deliver an internationally-benchmarked wellness estate that combines medical excellence,
              sustainable living, and faith-based stewardship — ensuring every family can entrust their
              loved ones with absolute confidence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function MarqueeSection() {
  return (
    <section className="py-8 marquee-section overflow-hidden">
      <div className="flex whitespace-nowrap">
        <div className="flex animate-marquee">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
            <span
              key={idx}
              className="mx-8 text-sm md:text-base tracking-widest uppercase marquee-text flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-white/60 inline-block" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="py-16 px-6 bg-white border-y border-gray-100">
      <div className="max-w-5xl mx-auto text-center space-y-4">
        <p className="text-xl md:text-2xl font-light tracking-wide text-gray-800">
          100+ Premium Residences | 48 World-Class Facilities
        </p>
        <p className="text-xl md:text-2xl font-light tracking-wide text-gray-800">
          8+ Acres of Greenery | 7+ Nearby Hospitals
        </p>
      </div>
    </section>
  );
}

function AmenitiesSection() {
  return (
    <section id="amenities" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* REMOVED: "Estate" heading */}
        {/* REMOVED: "A Glimpse of Living Refined" */}
        <h2 className="text-4xl md:text-5xl font-light text-center mb-4 section-heading">
          World-Class <em className="italic">Amenities.</em>
        </h2>

        {/* A — 7 Block Images (A001) */}
        <div className="mt-16">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {a001Images.map((img, idx) => (
              <div
                key={idx}
                className={`amenity-card aspect-square relative ${idx === 0 ? "col-span-2 row-span-2" : ""}`}
              >
                <Image src={img.src} alt={img.label} fill className="object-cover" />
                <div className="amenity-label">
                  <p className="text-sm font-light">{img.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* B — Carousel Animation (A002) */}
        <div className="mt-20 overflow-hidden">
          <div className="flex gap-4 animate-carousel">
            {[...a002Images, ...a002Images].map((img, idx) => (
              <div key={idx} className="flex-shrink-0 w-72 h-48 relative rounded-lg overflow-hidden">
                <Image src={img.src} alt={img.label} fill className="object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white text-xs font-light">{img.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* C — 4 Block Images Only (A003) */}
        <div className="mt-20">
          {/* REMOVED: "Core Values The Mater Maria Ecosystem" copy */}
          <h3 className="text-3xl font-light text-center mb-12 section-heading">
            Mater Maria <em className="italic">Ecosystem</em>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {a003Images.map((img, idx) => (
              <div key={idx} className="amenity-card aspect-[3/4] relative rounded-lg overflow-hidden">
                <Image src={img.src} alt={img.label} fill className="object-cover" />
                <div className="amenity-label">
                  <p className="text-sm font-light">{img.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ResidenceTypesSection() {
  return (
    <section id="residences" className="py-24 px-6 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        {/* REMOVED: "Launching Soon · Phase 1" + "Six Residence Types for Every Chapter." */}
        <h2 className="text-4xl md:text-5xl font-light text-center mb-16 section-heading">
          Residence <em className="italic">Types</em>
        </h2>

        {/* REMOVED: Independent Villa block */}
        {/* REMOVED: Deluxe Villa block */}
        {/* TODO: Add residence types list per Google Sheet MMH-08.04.2026 */}
        <div className="text-center text-gray-500">
          <p>Residence types list to be updated per Google Sheet MMH-08.04.2026</p>
        </div>
      </div>
    </section>
  );
}

function StrategicLocationSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        {/* REMOVED: small heading */}
        <h2 className="text-4xl md:text-5xl font-light mb-8 section-heading">
          Strategic Location <em className="italic">|</em> Seamless Accessibility.
        </h2>
        {/* TODO: Content from Google Doc MMH WEBSITE Content 09May2026 */}
        <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
          Content to be inserted from Google Doc: MMH WEBSITE Content 09May2026
        </p>
      </div>
    </section>
  );
}

function InvestmentSection() {
  return (
    <section id="invest" className="py-24 px-6 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        {/* REMOVED: "Investment Opportunity" */}
        {/* REMOVED: "Choose Your Tier" (old) */}
        {/* REMOVED: "Board-supervised governance...." full content */}
        <h2 className="text-4xl md:text-5xl font-light text-center mb-16 section-heading">
          Investment Plan <em className="italic">|</em> Choose Your Tier
        </h2>
        {/* TODO: Content per Google Sheet MMH-08.04.2026 (Platinum | Gold | Silver) */}
        <div className="text-center text-gray-500">
          <p>Investment tiers to be updated per Google Sheet MMH-08.04.2026</p>
        </div>
      </div>
    </section>
  );
}

function HonourMessageSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-light leading-relaxed section-heading">
          Where Every Life Is Honoured, and Every Family Rests Easy....
        </h2>
      </div>
    </section>
  );
}

function GetInTouchSection() {
  return (
    <section
      id="contact"
      className="relative py-24 px-6 bg-stone-900 text-white get-in-touch"
      style={{ backgroundImage: "url(/images/Home_Banner_03.png)" }}
    >
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* REMOVED: small heading */}
        <h2 className="text-4xl md:text-5xl font-light mb-8 section-heading">
          Get In <em className="italic">Touch</em>
        </h2>
        <p className="text-lg md:text-xl font-light leading-relaxed mb-10 opacity-90">
          Whether you&apos;re securing a dignified home for your parents or exploring a faith-backed
          investment, our team will respond within 24 hours.
        </p>
        {/* REMOVED: Diocese of Kanjirappally */}
        {/* REMOVED: RERA Compliant ISO 9001 */}
        {/* REMOVED: Phone +91 96564 63073 */}
        {/* REMOVED: Email Info@matermariahomes.com */}
        <Link
          href="/contact"
          className="inline-block px-8 py-3 text-sm tracking-widest border border-white rounded hover:bg-[#1e4f92] hover:border-[#1e4f92] transition-all"
        >
          Begin Your Journey To Living Refined
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Country Coordinators Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-light mb-8 text-center section-heading">
            Country <em className="italic">Coordinators</em>
          </h3>
          <div className="country-grid">
            {countryContacts.map((contact, idx) => (
              <div key={idx} className="country-card">
                <p className="text-sm font-medium">{contact.country}</p>
                <p className="text-xs text-white/70 mt-1">{contact.name || "—"}</p>
                {contact.phone && (
                  <p className="text-xs text-white/50 mt-1">
                    +{contact.code} {contact.phone}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/50">
            © 2026 Mater Maria Homes. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-sm text-white/50 hover:text-white cursor-pointer transition-colors">Facebook</span>
            <span className="text-sm text-white/50 hover:text-white cursor-pointer transition-colors">Instagram</span>
            <span className="text-sm text-white/50 hover:text-white cursor-pointer transition-colors">LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- MAIN PAGE ---------- */

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <OurStorySection />
      <VisionMissionSection />
      <MarqueeSection />
      <StatsSection />
      <AmenitiesSection />
      <ResidenceTypesSection />
      {/* SECTION 09 BLUEPRINTS — REMOVED */}
      {/* SECTION 10 SUSTAINABILITY — REMOVED */}
      <StrategicLocationSection />
      {/* SECTION 12 CONSTRUCTION TIMELINE — REMOVED */}
      <InvestmentSection />
      {/* SECTION 14 GOVERNANCE — REMOVED (moved to About) */}
      {/* SECTION 15 FAQ — REMOVED */}
      {/* SECTION 16 "THEY GAVE YOU EVERYTHING" — REMOVED */}
      {/* SECTION 02 — Moved to before Get In Touch */}
      <HonourMessageSection />
      <GetInTouchSection />
      <Footer />
    </main>
  );
}
