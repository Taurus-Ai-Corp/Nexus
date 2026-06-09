"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Sun, Battery, Leaf, Truck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const INFRASTRUCTURE_FEATURES = [
  {
    icon: Sun,
    title: "Solar Garden",
    description: "A dedicated solar array powering common areas and reducing the estate's carbon footprint by 40%.",
    image: "/assets-2025/images/renders/Solar-Garden-007.png",
    stat: "40%",
    statLabel: "Energy Offset",
  },
  {
    icon: Truck,
    title: "EV Buggy Fleet",
    description: "Electric buggies for seamless estate-wide transport — from your villa to the clinic, dining hall, or chapel.",
    image: "/assets-2025/images/renders/Buggie.png",
    stat: "3min",
    statLabel: "Avg Response",
  },
  {
    icon: Leaf,
    title: "Sustainable Landscaping",
    description: "Native Kerala flora, rainwater harvesting, and organic composting — an estate that gives back to the earth.",
    image: "/assets-2025/images/renders/Structural-Stewardship-005.png",
    stat: "100%",
    statLabel: "Rainwater Harvest",
  },
  {
    icon: Battery,
    title: "Backup Power Grid",
    description: "Industrial-grade UPS and diesel generators ensure zero downtime — medical equipment never skips a beat.",
    image: "/assets-2025/images/renders/Solar-Garden-007.png",
    stat: "24/7",
    statLabel: "Uptime Guarantee",
  },
];

function InfraCard({ feature, index }: { feature: typeof INFRASTRUCTURE_FEATURES[number]; index: number }) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-40px" }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={feature.image}
          alt={feature.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#00103F] to-transparent opacity-80" />
      </div>

      {/* Content */}
      <div className="relative -mt-16 p-6">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#FDC420]/20 backdrop-blur-sm">
          <Icon className="h-7 w-7 text-[#FDC420]" />
        </div>
        <h3 className="font-heading text-xl font-bold text-white">{feature.title}</h3>
        <p className="mt-2 text-sm text-white/70 leading-relaxed">{feature.description}</p>
      </div>

      {/* Stat Badge */}
      <div className="absolute top-4 right-4 rounded-lg bg-[#FDC420]/90 px-3 py-1.5 text-center backdrop-blur-sm">
        <div className="font-heading text-lg font-bold text-[#00103F]">{feature.stat}</div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[#00103F]/70">{feature.statLabel}</div>
      </div>
    </motion.div>
  );
}

export function InfrastructureSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".infra-reveal", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="theme-security py-24 lg:py-32">
      <Container size="lg">
        <SectionHeading
          badge="Specialty Infrastructure"
          title="Built to Last. Designed to Endure."
          subtitle="Solar gardens, EV buggies, and structural stewardship — infrastructure that works silently so residents live effortlessly."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {INFRASTRUCTURE_FEATURES.map((feature, index) => (
            <InfraCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
