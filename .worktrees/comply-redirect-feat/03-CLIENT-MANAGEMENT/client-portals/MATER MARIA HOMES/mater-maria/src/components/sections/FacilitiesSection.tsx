"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeartPulse, Leaf, Users, Cpu, UtensilsCrossed, Trees, Check } from "lucide-react";
import { FACILITIES_CATEGORIES } from "@/lib/constants";
import { Container } from "@/components/ui/container";

gsap.registerPlugin(ScrollTrigger);

const ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  HeartPulse,
  Leaf,
  Users,
  Cpu,
  UtensilsCrossed,
  Trees,
};

export function FacilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".facility-card", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
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

  const active = FACILITIES_CATEGORIES[activeCategory];

  return (
    <section ref={sectionRef} className="theme-security py-24" aria-labelledby="facilities-heading">
      <Container>
        {/* Section header */}
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full border border-border-accent bg-accent-default/10 px-4 py-1.5 text-sm font-medium text-accent-default uppercase tracking-widest mb-4">
            Infrastructure & Sustainability
          </span>
          <h2 id="facilities-heading" className="font-heading text-4xl font-bold tracking-tight text-text-primary md:text-5xl">
            Built to Last. Designed to Endure.
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-text-secondary text-lg">
            Solar gardens, EV buggies, and structural stewardship — infrastructure that works silently so residents live effortlessly.
          </p>
        </div>

        {/* Category tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {FACILITIES_CATEGORIES.map((cat, i) => {
            const Icon = ICONS[cat.icon];
            const isActive = i === activeCategory;
            return (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(i)}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300"
                style={{
                  background: isActive ? cat.color : "transparent",
                  color: isActive ? "#fff" : "var(--text-secondary)",
                  border: `1.5px solid ${isActive ? cat.color : "var(--border-default)"}`,
                  boxShadow: isActive ? `0 4px 20px ${cat.color}33` : "none",
                }}
                aria-pressed={isActive}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {cat.category}
              </button>
            );
          })}
        </div>

        {/* Active category grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {active?.items.map((item, i) => (
            <div
              key={item}
              className="facility-card flex items-start gap-3 rounded-2xl border border-border-default bg-bg-base p-5 transition-all duration-300 hover:border-accent-default/40 hover:shadow-lg"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                style={{ background: `${active.color}22` }}
              >
                <Check className="h-3.5 w-3.5" style={{ color: active.color }} />
              </span>
              <span className="text-sm font-medium text-text-primary">{item}</span>
            </div>
          ))}
        </div>

        {/* Total count strip */}
        <div className="mt-12 rounded-2xl border border-border-accent/30 bg-accent-default/5 p-6 text-center">
          <p className="text-text-secondary text-sm">
            <span className="font-heading text-2xl font-bold text-accent-default mr-2">48</span>
            world-class facilities across{" "}
            <span className="font-semibold text-text-primary">{FACILITIES_CATEGORIES.length} categories</span>
            {" "}— all included for residents of Mater Maria Homes.
          </p>
        </div>
      </Container>
    </section>
  );
}
