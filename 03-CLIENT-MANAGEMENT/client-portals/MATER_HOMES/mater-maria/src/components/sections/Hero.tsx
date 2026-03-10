"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { HERO } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { GradientText } from "@/components/ui/gradient-text";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Button } from "@/components/ui/button";
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-base">
      {/* Gradient mesh background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 600px 400px at 20% 30%, hsla(42, 70%, 55%, 0.06), transparent),
            radial-gradient(ellipse 500px 500px at 80% 20%, hsla(160, 30%, 45%, 0.04), transparent),
            radial-gradient(ellipse 700px 300px at 60% 80%, hsla(350, 45%, 60%, 0.04), transparent)
          `,
        }}
      />

      <Container size="md" className="relative z-10 flex flex-col items-center gap-8 pt-24 pb-16 text-center">
        {/* Badge */}
        <motion.span
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="inline-block rounded-full border border-border-accent bg-accent-default/10 px-4 py-1.5 text-sm font-medium text-accent-default"
        >
          {HERO.badge}
        </motion.span>

        {/* Title */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-heading text-4xl font-bold leading-tight tracking-tight text-text-primary sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Where Innovation Meets{" "}
          <GradientText>Serenity</GradientText>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl"
        >
          {HERO.subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Button
            className="rounded-full px-8 py-3 text-base font-medium text-text-inverse"
            style={{ background: "var(--accent-gradient)" }}
            size="lg"
            aria-label={HERO.cta.primary}
          >
            {HERO.cta.primary}
          </Button>
          <Button
            variant="outline"
            className="rounded-full px-8 py-3 text-base font-medium border-border-default text-text-primary"
            size="lg"
            aria-label={HERO.cta.secondary}
            asChild
          >
            <Link href="/tour">{HERO.cta.secondary}</Link>
          </Button>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-8 grid w-full max-w-2xl grid-cols-2 gap-6 md:grid-cols-4 md:gap-0"
        >
          {HERO.stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 md:border-r md:border-border-default md:last:border-r-0 md:px-6"
            >
              <AnimatedCounter
                target={stat.value}
                suffix={stat.suffix}
                className="font-heading text-3xl font-bold text-accent-default"
              />
              <span className="text-sm text-text-muted">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            aria-hidden="true"
          >
            <ChevronDown className="h-6 w-6 text-text-muted" />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
