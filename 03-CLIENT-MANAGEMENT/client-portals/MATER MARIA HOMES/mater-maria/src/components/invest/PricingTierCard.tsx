"use client";

import { motion } from "framer-motion";

interface Tier {
  id: string;
  name: string;
  price: string;
  benefits: string[];
  cta: string;
}

interface PricingTierCardProps {
  tier: Tier;
  index: number;
}

export function PricingTierCard({ tier, index }: PricingTierCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut", delay: index * 0.2 }}
      viewport={{ once: true }}
      className="theme-security rounded-2xl p-8 flex flex-col justify-between shadow-glow-strong glow-card-hover border border-[#FDC420]/30"
    >
      <div>
        <h3 className="text-3xl font-heading font-bold mb-4">{tier.name}</h3>
        <p className="text-4xl font-bold mb-6 font-mono text-white">
          {tier.price}
        </p>
        <ul className="space-y-4 mb-8">
          {tier.benefits.map((benefit, i) => (
            <li key={i} className="flex items-start text-white/90">
              <span className="mr-3 text-[#FDC420]">✦</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
      <button className="w-full py-4 px-6 bg-[#FDC420] text-[#00103F] font-bold rounded-lg hover:bg-white transition-colors duration-300">
        {tier.cta}
      </button>
    </motion.div>
  );
}
