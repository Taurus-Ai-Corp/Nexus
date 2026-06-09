"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";
import { FEATURES } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import {
  AIHealthIcon,
  SmartLivingIcon,
  CommunityNodesIcon,
  SolarLeafIcon,
} from "@/components/icons/estate-icons";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  HeartPulse: AIHealthIcon,
  Cpu: SmartLivingIcon,
  Users: CommunityNodesIcon,
  Leaf: SolarLeafIcon,
};

/** Feature images — mapped by feature icon key to match constants.ts order */
const featureImages: Record<string, string> = {
  HeartPulse: "/assets-2025/images/renders/MMT-Hospital-001.png",
  Cpu: "/assets-2025/images/renders/Health-Monitoring.png",
  Users: "/assets-2025/images/renders/Medical-care002.png",
  Leaf: "/assets-2025/images/renders/Structural-Stewardship-005.png",
};

const slideIn = (direction: "left" | "right") => ({
  hidden: { opacity: 0, x: direction === "left" ? -60 : 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
});

export function Features() {
  return (
    <section className="theme-medical py-24 lg:py-32">
      <Container size="lg">
        <SectionHeading
          badge="Divine Sanctuary"
          title="World-Class Medical Support"
        />

        <div className="flex flex-col gap-24 lg:gap-32">
          {FEATURES.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            const isEven = index % 2 === 1;

            return (
              <div
                key={feature.title}
                className={cn(
                  "flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16",
                  isEven && "lg:flex-row-reverse"
                )}
              >
                {/* Feature image */}
                <motion.div
                  variants={slideIn(isEven ? "right" : "left")}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  className="flex-1"
                >
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border-subtle">
                    <Image
                      src={featureImages[feature.icon] ?? ""}
                      alt={feature.title}
                      fill
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </motion.div>

                {/* Text content */}
                <motion.div
                  variants={slideIn(isEven ? "left" : "right")}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  className="flex flex-1 flex-col gap-4"
                >
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-default/10">
                        <Icon className="h-6 w-6 text-accent-default" />
                      </div>
                    )}
                    <h3 className="font-heading text-2xl font-bold text-text-primary lg:text-3xl">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-lg leading-relaxed text-text-secondary">
                    {feature.description}
                  </p>
                  <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {feature.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-center gap-2 text-sm text-text-secondary"
                      >
                        <Check className="h-4 w-4 shrink-0 text-accent-default" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
