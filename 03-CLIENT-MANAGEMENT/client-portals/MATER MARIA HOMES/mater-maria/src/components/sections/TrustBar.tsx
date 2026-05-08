"use client";

import { motion } from "framer-motion";
import { Shield, Award, Heart, BadgeCheck, Star } from "lucide-react";
import { TRUST_BADGES } from "@/lib/constants";
import { Container } from "@/components/ui/container";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Award,
  Heart,
  BadgeCheck,
  Star,
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function TrustBar() {
  return (
    <section className="border-y border-border-subtle bg-surface py-8">
      <Container size="lg">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ staggerChildren: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-0"
        >
          {TRUST_BADGES.map((badge) => {
            const Icon = iconMap[badge.icon];
            return (
              <motion.div
                key={badge.label}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="group flex items-center gap-2 px-4 md:px-6 md:border-r md:border-border-default md:last:border-r-0"
              >
                {Icon && (
                  <Icon className="h-5 w-5 text-text-muted opacity-50 transition-all duration-300 group-hover:text-accent-default group-hover:opacity-100" />
                )}
                <span className="text-sm font-medium text-text-muted opacity-50 transition-all duration-300 group-hover:text-text-primary group-hover:opacity-100">
                  {badge.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
