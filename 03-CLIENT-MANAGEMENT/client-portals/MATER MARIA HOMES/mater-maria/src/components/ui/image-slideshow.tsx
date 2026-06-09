"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ImageSlideshowProps {
  images: string[];
  /** Duration each slide is visible (ms) */
  interval?: number;
  /** Overlay gradient CSS */
  overlay?: string;
  /** Whether to blur the background */
  blur?: boolean;
  /** Extra class on the container */
  className?: string;
  /** Content to render on top */
  children?: React.ReactNode;
  /** Watermark text overlay */
  watermarkText?: string;
  /** Min height class */
  height?: string;
}

type KenBurnsPreset = {
  scaleFrom: number;
  scaleTo: number;
  xFrom: string;
  xTo: string;
  yFrom: string;
  yTo: string;
};

const KB_PRESETS: KenBurnsPreset[] = [
  { scaleFrom: 1.0, scaleTo: 1.15, xFrom: "0%", xTo: "-3%", yFrom: "0%", yTo: "-2%" },
  { scaleFrom: 1.15, scaleTo: 1.0, xFrom: "-2%", xTo: "2%", yFrom: "-1%", yTo: "1%" },
  { scaleFrom: 1.05, scaleTo: 1.2, xFrom: "2%", xTo: "-2%", yFrom: "1%", yTo: "-1%" },
  { scaleFrom: 1.2, scaleTo: 1.05, xFrom: "-1%", xTo: "1%", yFrom: "2%", yTo: "0%" },
  { scaleFrom: 1.0, scaleTo: 1.1, xFrom: "1%", xTo: "-1%", yFrom: "-2%", yTo: "2%" },
];

export function ImageSlideshow({
  images,
  interval = 5000,
  overlay,
  blur = false,
  className = "",
  children,
  watermarkText,
  height = "min-h-screen",
}: ImageSlideshowProps) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLSpanElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setSlideRef = useCallback(
    (idx: number) => (el: HTMLDivElement | null) => {
      slideRefs.current[idx] = el;
    },
    [],
  );

  // Cycle slides
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setPrev(current);
      setCurrent((c) => (c + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [current, images.length, interval]);

  // Ken Burns animation on current slide
  useEffect(() => {
    const el = slideRefs.current[current];
    if (!el) return;

    const preset = KB_PRESETS[current % KB_PRESETS.length]!;
    const dur = interval / 1000;

    gsap.killTweensOf(el);
    gsap.set(el, {
      scale: preset.scaleFrom,
      xPercent: parseFloat(preset.xFrom),
      yPercent: parseFloat(preset.yFrom),
      opacity: 1,
    });
    gsap.to(el, {
      scale: preset.scaleTo,
      xPercent: parseFloat(preset.xTo),
      yPercent: parseFloat(preset.yTo),
      duration: dur,
      ease: "none",
    });
  }, [current, interval]);

  // Fade out previous slide
  useEffect(() => {
    if (prev === null) return;
    const el = slideRefs.current[prev];
    if (!el) return;

    gsap.to(el, {
      opacity: 0,
      duration: 1.2,
      ease: "power2.inOut",
    });
  }, [prev]);

  // Watermark parallax on scroll
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !watermarkRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(watermarkRef.current, {
        yPercent: -40,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const gradient =
    overlay ??
    "linear-gradient(to bottom, rgba(10,10,15,0.55) 0%, rgba(10,10,15,0.2) 40%, rgba(10,10,15,0.7) 100%)";

  return (
    <div
      ref={sectionRef}
      className={`relative flex flex-col justify-end overflow-hidden ${height} ${className}`}
    >
      {/* Image layers */}
      <div className="absolute inset-0 z-0">
        {images.map((src, idx) => (
          <div
            key={src}
            ref={setSlideRef(idx)}
            className="absolute inset-0"
            style={{ opacity: idx === 0 ? 1 : 0 }}
          >
            <Image
              src={src}
              alt=""
              fill
              className={`h-full w-full object-cover ${blur ? "blur-[2px]" : ""}`}
              loading={idx === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          </div>
        ))}

        {/* Gradient overlay */}
        <div className="absolute inset-0 z-[1]" style={{ background: gradient }} />

        {/* Grain texture */}
        <div
          className="absolute inset-0 z-[2] opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* Watermark */}
      {watermarkText && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[3] flex select-none items-center justify-center"
        >
          <span ref={watermarkRef} className="watermark-text">
            {watermarkText}
          </span>
        </div>
      )}

      {/* Slide indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrev(current);
                setCurrent(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1 rounded-full transition-all duration-500 ${
                idx === current
                  ? "w-8 bg-white"
                  : "w-4 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
