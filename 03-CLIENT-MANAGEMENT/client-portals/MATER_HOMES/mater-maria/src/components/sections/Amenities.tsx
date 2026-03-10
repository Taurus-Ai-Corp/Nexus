"use client";

import { motion } from "framer-motion";
import {
  Gamepad2,
  Check,
} from "lucide-react";
import { AMENITIES } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlowCard } from "@/components/ui/glow-card";
import {
  AIHealthIcon,
  WellnessSpaIcon,
  CommunityNodesIcon,
  OrganicKitchenIcon,
  SmartLivingIcon,
} from "@/components/icons/estate-icons";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  HeartPulse: AIHealthIcon,
  Sparkles: WellnessSpaIcon,
  Users: CommunityNodesIcon,
  UtensilsCrossed: OrganicKitchenIcon,
  Cpu: SmartLivingIcon,
  Gamepad2,
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

export function Amenities() {
  return (
    <section className="bg-bg-base py-24 lg:py-32">
      <Container size="lg">
        <SectionHeading
          badge="Everything You Need"
          title="World-Class Amenities"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {AMENITIES.map((amenity, index) => {
            const Icon = iconMap[amenity.icon];
            return (
              <motion.div
                key={amenity.category}
                custom={index}
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                <GlowCard className="flex h-full flex-col gap-4">
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-default/10">
                        <Icon className="h-6 w-6 text-accent-default" />
                      </div>
                    )}
                    <h3 className="font-heading text-lg font-bold text-text-primary">
                      {amenity.category}
                    </h3>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {amenity.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-text-secondary"
                      >
                        <Check className="h-3.5 w-3.5 shrink-0 text-accent-default" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </GlowCard>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
