"use client";

import { motion } from "framer-motion";
import {
  Theater,
  Home,
  Award,
  FileText,
  Key,
  Sparkles,
} from "lucide-react";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { Container } from "@/components/ui/container";
import { TiltCard, TiltCardFloat } from "@/components/ui/tilt-card";
import { INVESTOR_PERKS } from "@/lib/investor-constants";

const ICON_MAP = {
  Theater,
  Home,
  Award,
  FileText,
  Key,
  Sparkles,
} as const;

const fadeVariants = {
  hidden: { opacity: 0, x: 0 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

export function InvestorPerks() {
  return (
    <SectionWatermark className="py-20 lg:py-28">
      <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="mb-2 font-heading text-sm font-medium uppercase tracking-[0.2em] text-accent-default">
            Investor Benefits
          </p>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl text-gold-gradient">
            More Than Returns
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            Every investor becomes a patron of the estate — with tangible
            privileges that connect you to the community.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INVESTOR_PERKS.map((perk, i) => {
            const Icon = ICON_MAP[perk.icon];
            return (
              <motion.div
                key={perk.title}
                custom={i}
                variants={fadeVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.98 }}
              >
                <TiltCard className="h-full p-6 lg:p-8">
                  <TiltCardFloat depth={40}>
                    <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-accent-default/10">
                      <Icon className="size-6 text-accent-default" />
                    </div>
                  </TiltCardFloat>

                  <h3 className="mb-2 font-heading text-lg font-bold text-text-primary">
                    {perk.title}
                  </h3>
                  <p className="mb-3 text-sm leading-relaxed text-text-secondary">
                    {perk.description}
                  </p>
                  <p className="text-xs font-medium text-accent-default">
                    {perk.detail}
                  </p>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </SectionWatermark>
  );
}
