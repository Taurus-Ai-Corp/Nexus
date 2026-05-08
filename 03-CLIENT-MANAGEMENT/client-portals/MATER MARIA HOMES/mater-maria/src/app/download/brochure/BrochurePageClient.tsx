"use client";

import { useState, useActionState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Phone, Mail, MapPin, ArrowRight, Info, RotateCcw, FileText, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { BrandLogo } from "@/components/ui/brand-logo";
import { SITE } from "@/lib/constants";
import { submitBrochureLead, type BrochureLeadResult } from "./actions";

const GOLD = "#C9A84C";
const GOLD_GRADIENT = "linear-gradient(135deg, #C9A84C, #e8d08a, #C9A84C)";

const BROCHURE_SECTIONS = [
  {
    number: "01",
    title: "The Vision",
    body: "Mater Maria Homes is Kerala's first AI-powered net-zero wellness estate — 90 premium residences across 8+ acres in Kanjirappally, Kottayam. Built for those who believe retirement should be the most fulfilling chapter yet.",
  },
  {
    number: "02",
    title: "AI Wellness & Care",
    body: "On-site MMT Hospital Annexure with 24/7 nursing, IoT vital monitoring, fall detection, AI health dashboards, Ayurvedic Treatment Block, Yoga & Meditation Halls, and 24/7 ambulance service.",
  },
  {
    number: "03",
    title: "Sustainable Estate",
    body: "100% solar net-zero estate with rainwater harvesting, water-rechargeable wells, organic tropical fruit orchards, private fishing ponds, and a certified organic central kitchen sourcing ingredients from within the campus.",
  },
  {
    number: "04",
    title: "Location Advantage",
    body: "Nestled in the Western Ghats foothills — 10 km to MMT Medical College, 12 km to Kanjirappally Town, 35 km to Kottayam City. Greenfield International Airport proposed just 15 km away — a future asset appreciation driver.",
  },
];

/* ── Residence pricing table ─────────────────────── */
const UNIT_TYPES = [
  { category: "Apartment Villas", units: [
    { type: "1 BHK – Walk-in Apartment Villa", size: "710", price: "₹51 Lakhs" },
    { type: "2 BHK – Walk-in Apartment Villa", size: "950", price: "₹58 Lakhs" },
  ]},
  { category: "Flats", units: [
    { type: "1 BHK – Flat", size: "500", price: "₹38 Lakhs" },
    { type: "2 BHK – Flat", size: "700", price: "₹43 Lakhs" },
  ]},
  { category: "Independent Villas", units: [
    { type: "2 BHK Independent Villa", size: "1,200", price: "₹80 Lakhs" },
    { type: "2 BHK Independent Villa", size: "1,000", price: "₹70 Lakhs" },
  ]},
  { category: "Twin Villas", units: [
    { type: "2 BHK Twin Villa", size: "800", price: "₹60 Lakhs" },
    { type: "1 BHK Twin Villa", size: "600", price: "₹55 Lakhs" },
  ]},
];

export default function BrochurePageClient() {
  const [gateState, gateAction, gatePending] = useActionState<BrochureLeadResult | null, FormData>(
    submitBrochureLead,
    null,
  );
  const [downloading, setDownloading] = useState(false);
  const unlocked = gateState?.success === true;

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch("/api/brochure");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Mater-Maria-Homes-Brochure.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <main
      id="main-content"
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, #06080f 0%, #0c1020 60%, #080c18 100%)" }}
    >
      {/* Top gold rule */}
      <div
        className="h-px w-full"
        style={{ background: "linear-gradient(90deg, transparent, #C9A84C 35%, #C9A84C 65%, transparent)" }}
        aria-hidden
      />

      {/* Header */}
      <header className="py-10 px-6 text-center border-b" style={{ borderColor: "rgba(201,168,76,0.15)" }}>
        <BrandLogo />
        <p
          className="mt-4 uppercase tracking-[0.3em] font-heading"
          style={{ fontSize: "0.7rem", color: "rgba(201,168,76,0.7)", fontWeight: 600 }}
        >
          Resident Brochure · Confidential
        </p>
      </header>

      <Container size="md" className="py-20">

        {/* ── Email Gate Form ─────────────────────── */}
        <AnimatePresence mode="wait">
          {!unlocked && (
            <motion.div
              key="gate"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              transition={{ duration: 0.6 }}
              className="mx-auto mb-16 max-w-md"
            >
              <div
                className="rounded-2xl p-8 text-center"
                style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.25)" }}
              >
                <div
                  className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl"
                  style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)" }}
                >
                  <FileText className="h-6 w-6" style={{ color: GOLD }} />
                </div>
                <h2 className="font-heading font-bold text-white mb-2" style={{ fontSize: "1.2rem" }}>
                  Download Our Brochure
                </h2>
                <p className="text-white/45 mb-6" style={{ fontSize: "0.85rem" }}>
                  Enter your details to receive the full PDF brochure with pricing, floor plans, and investment details.
                </p>

                <form action={gateAction} className="space-y-3 text-left">
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="Full Name"
                    className="w-full rounded-xl border px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      borderColor: "rgba(201,168,76,0.2)",
                    }}
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email Address"
                    className="w-full rounded-xl border px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      borderColor: "rgba(201,168,76,0.2)",
                    }}
                  />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone (optional)"
                    className="w-full rounded-xl border px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      borderColor: "rgba(201,168,76,0.2)",
                    }}
                  />

                  {gateState && !gateState.success && (
                    <p className="text-red-400 text-xs px-1">{gateState.error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={gatePending}
                    className="w-full rounded-xl px-6 py-3.5 text-sm font-semibold text-[#0A0A18] transition-all hover:scale-[1.02] disabled:opacity-60"
                    style={{ background: GOLD_GRADIENT, boxShadow: "0 4px 20px rgba(201,168,76,0.3)" }}
                  >
                    {gatePending ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" /> Get Brochure
                      </span>
                    )}
                  </button>
                </form>

                <p className="mt-4 text-white/25" style={{ fontSize: "0.7rem" }}>
                  We respect your privacy. No spam, ever.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Success + Download Button ──────────── */}
        {unlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-16 max-w-md text-center"
          >
            <div
              className="rounded-2xl p-8"
              style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.3)" }}
            >
              <CheckCircle2 className="mx-auto mb-4 h-10 w-10" style={{ color: GOLD }} />
              <p className="font-heading font-bold text-white mb-2" style={{ fontSize: "1.1rem" }}>
                Your brochure is ready!
              </p>
              <p className="text-white/45 mb-6" style={{ fontSize: "0.85rem" }}>
                Click below to download your PDF brochure.
              </p>
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold text-[#0A0A18] transition-all hover:scale-105 disabled:opacity-60"
                style={{ background: GOLD_GRADIENT, boxShadow: "0 4px 28px rgba(201,168,76,0.35)" }}
              >
                {downloading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Generating PDF...</>
                ) : (
                  <><Download className="h-4 w-4" /> Download PDF Brochure</>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h1
            className="font-heading font-black text-white"
            style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", lineHeight: 1.08, letterSpacing: "-0.03em" }}
          >
            Where Nature{" "}
            <span style={{ background: GOLD_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Meets Luxury
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-white/50 leading-relaxed" style={{ fontSize: "1rem" }}>
            Kerala&apos;s first AI-powered net-zero wellness estate — a compassionate haven in the
            Western Ghats foothills offering 90 premium residences and world-class care.
          </p>
        </motion.div>

        {/* Brochure sections */}
        <div className="space-y-4 mb-16">
          {BROCHURE_SECTIONS.map((section, i) => (
            <motion.div
              key={section.number}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="flex gap-6 p-7 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(201,168,76,0.15)",
              }}
            >
              <span
                className="font-heading font-black shrink-0"
                style={{ color: "rgba(201,168,76,0.4)", fontSize: "2rem", lineHeight: 1 }}
              >
                {section.number}
              </span>
              <div>
                <h2 className="font-heading font-bold text-white mb-2" style={{ fontSize: "1.05rem" }}>
                  {section.title}
                </h2>
                <p className="text-white/55 leading-relaxed" style={{ fontSize: "0.9rem" }}>
                  {section.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Residence Pricing Table ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          {/* Section heading */}
          <div className="mb-8 text-center">
            <span
              className="mb-3 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em]"
              style={{ borderColor: "rgba(201,168,76,0.35)", color: GOLD, background: "rgba(201,168,76,0.08)" }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: GOLD }} />
              Residence Options
            </span>
            <h2
              className="mt-3 font-heading font-black text-white"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", letterSpacing: "-0.02em" }}
            >
              Indicative Buy-In Pricing
            </h2>
            <p className="mt-2 text-white/45" style={{ fontSize: "0.82rem" }}>
              All residences are leasehold — up to 15-year occupancy term. Deposit fully returnable on exit.
            </p>
          </div>

          {/* Table */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(201,168,76,0.2)" }}
          >
            {/* Table header */}
            <div
              className="grid grid-cols-3 px-5 py-3"
              style={{ background: "rgba(201,168,76,0.12)", borderBottom: "1px solid rgba(201,168,76,0.2)" }}
            >
              <span className="font-heading text-xs font-bold uppercase tracking-[0.18em]" style={{ color: GOLD }}>Unit Type</span>
              <span className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-center" style={{ color: GOLD }}>Size (sq ft)</span>
              <span className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-right" style={{ color: GOLD }}>Buy-In (INR)</span>
            </div>

            {/* Category groups */}
            {UNIT_TYPES.map((group, gi) => (
              <div key={group.category}>
                {/* Category label */}
                <div
                  className="px-5 py-2"
                  style={{
                    background: gi % 2 === 0 ? "rgba(201,168,76,0.04)" : "rgba(255,255,255,0.02)",
                    borderBottom: "1px solid rgba(201,168,76,0.08)",
                  }}
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: "rgba(201,168,76,0.55)" }}>
                    {group.category}
                  </span>
                </div>
                {group.units.map((unit, ui) => (
                  <motion.div
                    key={`${unit.type}-${unit.size}`}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (gi * 2 + ui) * 0.04 }}
                    className="grid grid-cols-3 items-center px-5 py-3.5"
                    style={{
                      background: ui % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <span className="text-white/80 text-sm pr-3">{unit.type}</span>
                    <span className="text-center font-heading font-bold text-white/60 text-sm">{unit.size}</span>
                    <span
                      className="text-right font-heading font-black text-sm"
                      style={{ color: GOLD }}
                    >
                      {unit.price}
                    </span>
                  </motion.div>
                ))}
              </div>
            ))}

            {/* Footer note */}
            <div
              className="px-5 py-3 flex items-start gap-2"
              style={{ background: "rgba(201,168,76,0.05)", borderTop: "1px solid rgba(201,168,76,0.15)" }}
            >
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "rgba(201,168,76,0.6)" }} />
              <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
                Prices are indicative and subject to final agreement. All figures in Indian Rupees (INR). NRI payment channels available.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Resident Exit & Deposit Return Terms ─────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(201,168,76,0.3)" }}
        >
          {/* Header bar */}
          <div
            className="flex items-center gap-3 px-7 py-4"
            style={{ background: "rgba(201,168,76,0.1)", borderBottom: "1px solid rgba(201,168,76,0.2)" }}
          >
            <RotateCcw className="h-4 w-4 shrink-0" style={{ color: GOLD }} />
            <p className="font-heading font-bold text-white" style={{ fontSize: "0.95rem" }}>
              Resident Exit & Deposit Return Terms
            </p>
            <span
              className="ml-auto rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em]"
              style={{ background: "rgba(201,168,76,0.15)", color: GOLD, border: "1px solid rgba(201,168,76,0.3)" }}
            >
              For Residents Only
            </span>
          </div>

          <div className="px-7 py-6 space-y-5" style={{ background: "rgba(255,255,255,0.03)" }}>

            {/* Key term — leasehold notice */}
            <div
              className="flex gap-4 p-4 rounded-xl"
              style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)" }}
            >
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-lg font-heading font-black text-sm"
                style={{ background: "rgba(201,168,76,0.15)", color: GOLD }}
              >
                !
              </div>
              <div>
                <p className="font-heading font-bold text-white text-sm mb-1">Leasehold Model — Maximum 15-Year Term</p>
                <p className="text-white/55 leading-relaxed" style={{ fontSize: "0.85rem" }}>
                  All Mater Maria residences operate on a <strong className="text-white/80">leasehold basis only</strong>.
                  Residents make a refundable buy-in deposit to secure their unit for a fixed term of up to 15 years.
                  This is a residency arrangement — not a property purchase or ownership transfer.
                </p>
              </div>
            </div>

            {/* Terms grid */}
            {[
              {
                label: "Deposit Nature",
                value: "Fully refundable buy-in deposit — not a sale consideration",
              },
              {
                label: "Maximum Occupancy Term",
                value: "15 years from the date of admission",
              },
              {
                label: "Early Exit",
                value: "Resident or family may vacate at any time with written notice. Deposit returned subject to deductions as per the occupancy agreement.",
              },
              {
                label: "Deposit Return",
                value: "100% of the buy-in deposit is returned upon exit, minus any outstanding service charges or damage assessments, within the agreed settlement period.",
              },
              {
                label: "Term Renewal",
                value: "Subject to availability and mutual agreement. Deposit may be adjusted to the prevailing rate at renewal.",
              },
            ].map((term, i) => (
              <div
                key={term.label}
                className="grid gap-1 sm:grid-cols-[180px,1fr] sm:gap-4 py-3"
                style={{
                  borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}
              >
                <span
                  className="font-heading text-xs font-bold uppercase tracking-[0.12em] shrink-0"
                  style={{ color: "rgba(201,168,76,0.75)" }}
                >
                  {term.label}
                </span>
                <span className="text-white/60 leading-relaxed" style={{ fontSize: "0.88rem" }}>
                  {term.value}
                </span>
              </div>
            ))}

            {/* Investor separation note */}
            <div
              className="flex items-start gap-3 p-4 rounded-xl mt-2"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-white/30" />
              <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
                <strong className="text-white/50">Note:</strong> The above terms apply exclusively to <strong className="text-white/50">resident occupancy</strong>.
                They are separate from and not applicable to the NRI/HNI investor share-based model.
                Investors should refer to the separate Investment Disclosure document.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Key stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16"
        >
          {[
            { value: "90", label: "Residences" },
            { value: "8+", label: "Acres Greenery" },
            { value: "24/7", label: "Medical Care" },
            { value: "15 yr", label: "Max Lease Term" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-5 rounded-xl"
              style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)" }}
            >
              <p
                className="font-heading font-black"
                style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", background: GOLD_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                {stat.value}
              </p>
              <p className="text-white/45 mt-1" style={{ fontSize: "0.72rem", letterSpacing: "0.06em" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {unlocked ? (
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="group inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold text-[#0A0A18] transition-all hover:scale-105 disabled:opacity-60"
              style={{ background: GOLD_GRADIENT, boxShadow: "0 4px 28px rgba(201,168,76,0.35)" }}
            >
              {downloading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
              ) : (
                <><Download className="h-4 w-4" /> Download PDF Brochure</>
              )}
            </button>
          ) : (
            <a
              href="#main-content"
              className="group inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-semibold text-[#0A0A18] transition-all hover:scale-105"
              style={{ background: GOLD_GRADIENT, boxShadow: "0 4px 28px rgba(201,168,76,0.35)" }}
            >
              <Download className="h-4 w-4" />
              Enter Email to Download
            </a>
          )}
          <Link
            href="/invest"
            className="inline-flex items-center gap-2 rounded-full border px-7 py-4 text-sm font-medium text-white/75 backdrop-blur-sm transition-all hover:border-white/35 hover:text-white"
            style={{ borderColor: "rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.06)" }}
          >
            Investor Information
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Contact footer */}
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)" }}
        >
          <p
            className="font-heading font-bold text-white mb-6"
            style={{ fontSize: "1rem", letterSpacing: "-0.01em" }}
          >
            Get in Touch
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/50" style={{ fontSize: "0.85rem" }}>
            <a href={`tel:${SITE.phone}`} className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone className="h-4 w-4" style={{ color: GOLD }} />
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail className="h-4 w-4" style={{ color: GOLD }} />
              {SITE.email}
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" style={{ color: GOLD }} />
              {SITE.address}
            </span>
          </div>
        </div>
      </Container>

      {/* Bottom gold rule */}
      <div
        className="h-px w-full"
        style={{ background: "linear-gradient(90deg, transparent, #C9A84C 35%, #C9A84C 65%, transparent)" }}
        aria-hidden
      />
    </main>
  );
}
