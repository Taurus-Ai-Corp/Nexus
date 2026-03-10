"use client";

import { motion } from "framer-motion";
import { ArrowRight, Maximize2, BedDouble } from "lucide-react";
import { RESIDENCES } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlowCard } from "@/components/ui/glow-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export function Residences() {
  // Reorder for bento: Independent Villa first (large), then Walk-up Villa, then Executive Suite
  const ordered = [RESIDENCES[2], RESIDENCES[0], RESIDENCES[1]];

  return (
    <section className="bg-surface py-24 lg:py-32">
      <Container size="lg">
        <SectionHeading
          badge="Our Homes"
          title="Choose Your Residence"
        />

        <div className="grid gap-6 md:grid-cols-2">
          {ordered.map((residence, index) => (
            <motion.div
              key={residence.name}
              variants={scaleUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className={cn(
                index === 0 && "md:col-span-1 md:row-span-1",
                index === 1 && "md:col-span-1 md:row-span-1",
                index === 2 && "md:col-span-2"
              )}
            >
              <GlowCard className="flex h-full flex-col gap-4">
                {/* Residence image */}
                <div className="aspect-video w-full overflow-hidden rounded-xl border border-border-subtle">
                  <img
                    src={residence.image}
                    alt={residence.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>

                {/* Info */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading text-xl font-bold text-text-primary">
                    {residence.name}
                  </h3>
                  <Badge className="bg-accent-default/10 text-accent-default border-border-accent shrink-0">
                    {residence.tag}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <Maximize2 className="h-4 w-4" />
                    {residence.sqft} sq.ft
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BedDouble className="h-4 w-4" />
                    {residence.bedrooms}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-text-secondary">
                  {residence.description}
                </p>

                <button
                  className="mt-auto flex items-center gap-1.5 text-sm font-medium text-accent-default transition-colors hover:text-accent-light"
                  aria-label={`View details for ${residence.name}`}
                >
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </button>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
