"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CTA } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { LeadCaptureForm } from "@/components/contact/LeadCaptureForm";
import { X } from "lucide-react";

export function CTASection() {
  const [showForm, setShowForm] = useState(false);

  return (
    <section
      className="theme-security relative overflow-hidden py-24 lg:py-32"
    >
      {/* Glass overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, hsla(0, 0%, 100%, 0.08), hsla(0, 0%, 100%, 0.02))",
          backdropFilter: "blur(1px)",
        }}
      />

      <Container size="md" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <h2 className="font-heading text-3xl font-bold tracking-tight text-text-inverse sm:text-4xl lg:text-5xl">
            {CTA.title}
          </h2>
          <p className="max-w-xl text-lg text-text-inverse/80">
            {CTA.subtitle}
          </p>

          {!showForm ? (
            <div className="mt-4 flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => setShowForm(true)}
                className="rounded-full bg-[#FDC420] px-8 py-3 text-base font-bold text-[#00103F] hover:bg-[#FDC420]/90 hover:shadow-lg"
                aria-label={CTA.primary}
              >
                {CTA.primary}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-text-inverse/30 px-8 py-3 text-base font-medium text-text-inverse hover:bg-text-inverse/10"
                asChild
              >
                <a href="tel:+919447080356">{CTA.secondary}</a>
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative mt-6 w-full max-w-lg"
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute -top-2 -right-2 rounded-full bg-white/10 p-1.5 text-white/60 hover:bg-white/20 hover:text-white transition-all"
                aria-label="Close form"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="rounded-2xl bg-white/95 backdrop-blur-sm p-6 shadow-2xl">
                <LeadCaptureForm source="final-full" variant="full" />
              </div>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
