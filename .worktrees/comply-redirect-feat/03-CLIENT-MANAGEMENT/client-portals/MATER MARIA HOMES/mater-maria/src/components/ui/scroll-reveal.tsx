"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale"
  | "blur-in"
  | "parallax"
  | "stagger";

interface ScrollRevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  /** For stagger variant: selector for child elements to stagger */
  staggerSelector?: string;
  staggerAmount?: number;
  /** Parallax speed factor (only for parallax variant) */
  speed?: number;
}

const VARIANT_FROM: Record<RevealVariant, gsap.TweenVars> = {
  "fade-up": { y: 50, opacity: 0 },
  "fade-down": { y: -40, opacity: 0 },
  "fade-left": { x: -60, opacity: 0 },
  "fade-right": { x: 60, opacity: 0 },
  scale: { scale: 0.9, opacity: 0 },
  "blur-in": { opacity: 0, filter: "blur(10px)" },
  parallax: { y: 80, opacity: 0 },
  stagger: { y: 40, opacity: 0 },
};

export function ScrollReveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.8,
  className,
  staggerSelector = "[data-sr-item]",
  staggerAmount = 0.12,
  speed = 0.5,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (variant === "stagger") {
        const items = el.querySelectorAll(staggerSelector);
        if (items.length === 0) return;
        gsap.from(items, {
          ...VARIANT_FROM.stagger,
          duration,
          delay,
          stagger: staggerAmount,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        });
      } else if (variant === "parallax") {
        // Reveal + continuous parallax drift on scroll
        gsap.from(el, {
          ...VARIANT_FROM.parallax,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        });
        gsap.to(el, {
          y: -50 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      } else {
        gsap.from(el, {
          ...VARIANT_FROM[variant],
          duration,
          delay,
          ease: "power3.out",
          clearProps: variant === "blur-in" ? "filter" : undefined,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        });
      }
    }, el);

    return () => ctx.revert();
  }, [variant, delay, duration, staggerSelector, staggerAmount, speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
