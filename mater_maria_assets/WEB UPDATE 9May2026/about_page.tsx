"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

/* ============================================================
   ABOUT PAGE — NEW PAGE
   Governance moved from Homepage Section 14
   Generated: 2026-05-16
   ============================================================ */

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-black py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-white text-xl font-light tracking-wide">
            Mater Maria
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/about" className="text-white text-sm tracking-wide">About</Link>
            <Link href="/#features" className="text-white/80 hover:text-white text-sm tracking-wide transition-colors">Features</Link>
            <Link href="/#residences" className="text-white/80 hover:text-white text-sm tracking-wide transition-colors">Residences</Link>
            <Link href="/#invest" className="text-white/80 hover:text-white text-sm tracking-wide transition-colors">Invest</Link>
            <Link href="/#contact" className="text-white/80 hover:text-white text-sm tracking-wide transition-colors">Contact</Link>
          </div>
        </div>
      </nav>

      {/* About Section 01 */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-light text-center mb-16 section-heading">
            About <em className="italic">Us</em>
          </h1>

          {/* About Details */}
          <div className="mb-16">
            <h2 className="text-2xl font-light mb-6">About Details</h2>
            <p className="text-gray-700 leading-relaxed">
              {/* TODO: Insert content from MMH WEBSITE Content 09May2026 */}
              About content to be inserted from Google Doc: MMH WEBSITE Content 09May2026
            </p>
          </div>

          {/* About Content */}
          <div className="mb-16">
            <h2 className="text-2xl font-light mb-6">Our Story</h2>
            <p className="text-gray-700 leading-relaxed">
              {/* TODO: Insert content from MMH WEBSITE Content 09May2026 */}
              About content to be inserted from Google Doc: MMH WEBSITE Content 09May2026
            </p>
          </div>

          {/* Governance */}
          <div className="mb-16">
            <h2 className="text-2xl font-light mb-6">Governance</h2>
            <p className="text-gray-700 leading-relaxed">
              Mater Maria Homes operates under the spiritual guidance and administrative oversight
              of the Diocese of Kanjirappally, ensuring transparency, accountability, and faith-based
              stewardship in all operations.
            </p>
          </div>

          {/* REMOVED: Board-Supervised (Row 4) */}
          {/* REMOVED: Board-Supervised (Row 5) */}
          {/* REMOVED: Excellence (Row 6) */}
          {/* REMOVED: ISO 9001 certified... (Row 7) */}

          {/* Spiritual & Pastoral Leadership — KEEP */}
          <div className="mb-16">
            <h2 className="text-2xl font-light mb-6">Spiritual & Pastoral Leadership</h2>
            <p className="text-gray-700 leading-relaxed">
              Guided by the Diocese of Kanjirappally, our community maintains a vibrant spiritual life
              with daily Mass, prayer services, and pastoral care available to all residents.
            </p>
          </div>

          {/* Executive Board of Directors — KEEP */}
          <div className="mb-16">
            <h2 className="text-2xl font-light mb-6">Executive Board of Directors</h2>
            <p className="text-gray-700 leading-relaxed">
              Our experienced board brings together expertise in healthcare, real estate, finance,
              and pastoral care to ensure the highest standards of governance and service delivery.
            </p>
          </div>

          {/* Core Investors — ADD (with photos) */}
          <div className="mb-16">
            <h2 className="text-2xl font-light mb-6">Core Investors</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* TODO: Add investor photos from attached images */}
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">Investor Photo 1</span>
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">Investor Photo 2</span>
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">Investor Photo 3</span>
              </div>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">Investor Photo 4</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              {/* TODO: Insert investor details */}
              Investor details and photos to be added from attached images.
            </p>
          </div>

          {/* REMOVED: ISO 9001 certified... (Row 11) */}
        </div>
      </section>

      {/* Governance Section — Moved from Homepage Section 14 */}
      <section className="py-24 px-6 bg-stone-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-16 section-heading">
            Governance <em className="italic">&</em> Oversight
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-light mb-4">Board-Supervised Structure</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                The project operates under direct supervision of the Executive Board, with quarterly
                reporting and transparent decision-making processes.
              </p>
              <h3 className="text-xl font-light mb-4">RERA Compliance</h3>
              <p className="text-gray-700 leading-relaxed">
                Fully compliant with all Real Estate Regulatory Authority guidelines, ensuring
                investor protection and project transparency.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-light mb-4">ISO 9001 Certification</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our quality management systems are certified to international ISO 9001 standards,
                reflecting our commitment to excellence.
              </p>
              <h3 className="text-xl font-light mb-4">Diocesan Oversight</h3>
              <p className="text-gray-700 leading-relaxed">
                Led by the Diocese of Kanjirappally, ensuring spiritual integrity and ethical
                governance in all aspects of the project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-white/50">
            © 2026 Mater Maria Homes. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
