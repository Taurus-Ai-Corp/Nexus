"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RevealOptions {
  y?: number;
  opacity?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  ease?: string;
  start?: string;
}

/**
 * Applies GSAP ScrollTrigger reveal animation to child elements
 * matching the given selector within the container ref.
 */
export function useGsapReveal(
  selector: string,
  options: RevealOptions = {}
) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll(selector);
    if (elements.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(elements, {
        y: options.y ?? 80,
        opacity: options.opacity ?? 0,
        duration: options.duration ?? 1,
        stagger: options.stagger ?? 0.15,
        delay: options.delay ?? 0,
        ease: options.ease ?? "power3.out",
        scrollTrigger: {
          trigger: container,
          start: options.start ?? "top 75%",
        },
      });
    }, container);

    return () => ctx.revert();
  }, [selector, options.y, options.opacity, options.duration, options.stagger, options.delay, options.ease, options.start]);

  return containerRef;
}
