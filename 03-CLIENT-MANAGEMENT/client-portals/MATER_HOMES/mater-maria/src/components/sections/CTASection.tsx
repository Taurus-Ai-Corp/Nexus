"use client";

import { motion } from "framer-motion";
import { CTA } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section
      className="relative overflow-hidden py-24 lg:py-32"
      style={{ background: "var(--accent-gradient)" }}
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
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              className="rounded-full bg-bg-base px-8 py-3 text-base font-medium text-text-primary hover:bg-bg-base/90"
              aria-label={CTA.primary}
            >
              {CTA.primary}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-text-inverse/30 px-8 py-3 text-base font-medium text-text-inverse hover:bg-text-inverse/10"
              aria-label={CTA.secondary}
            >
              {CTA.secondary}
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
