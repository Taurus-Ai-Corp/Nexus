"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { HeartPulse, Activity, Stethoscope, ShieldCheck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const MEDICAL_FEATURES = [
  {
    icon: HeartPulse,
    title: "24/7 Health Monitoring",
    description: "IoT sensors track vitals continuously, alerting our medical team to any anomalies before they become emergencies.",
    image: "/assets-2025/images/renders/Health-Monitoring.png",
  },
  {
    icon: Stethoscope,
    title: "On-Site Medical Care",
    description: "A fully equipped clinic with visiting specialists — cardiology, neurology, and geriatric medicine — all within the estate.",
    image: "/assets-2025/images/renders/MMT-Hospital-001.png",
  },
  {
    icon: Activity,
    title: "Preventive Wellness Programs",
    description: "Personalized health plans combining Ayurveda, physiotherapy, and modern diagnostics for proactive care.",
    image: "/assets-2025/images/renders/Medical-care002.png",
  },
  {
    icon: ShieldCheck,
    title: "Emergency Response Protocol",
    description: "Sub-3-minute response time with dedicated ambulance bay and direct hospital transfer agreements.",
    image: "/assets-2025/images/renders/MMT-Hospital-001.png",
  },
];

function MedicalCard({ feature, index }: { feature: typeof MEDICAL_FEATURES[number]; index: number }) {
  const isEven = index % 2 === 0;
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      viewport={{ once: true, margin: "-50px" }}
      className={`flex flex-col gap-6 ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center`}
    >
      {/* Image */}
      <div className="relative h-64 w-full flex-1 overflow-hidden rounded-2xl lg:h-80">
        <Image
          src={feature.image}
          alt={feature.title}
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#00103F]/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00103F]/10">
            <Icon className="h-6 w-6 text-[#00103F]" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-[#00103F]">{feature.title}</h3>
        </div>
        <p className="text-lg text-[#00103F]/70 leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  );
}

export function MedicalWellnessSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".medical-reveal", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
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
    <section ref={sectionRef} className="theme-medical py-24 lg:py-32">
      <Container size="lg">
        <SectionHeading
          badge="Divine Sanctuary"
          title="World-Class Medical Support"
          subtitle="Where clinical precision meets compassionate care — a health ecosystem designed for longevity and vitality."
        />

        <div className="mt-16 space-y-20">
          {MEDICAL_FEATURES.map((feature, index) => (
            <MedicalCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
