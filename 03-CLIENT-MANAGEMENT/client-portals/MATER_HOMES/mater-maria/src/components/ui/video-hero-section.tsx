"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface VideoHeroSectionProps {
  videoSrc: string;
  posterSrc?: string;
  watermarkText: string;
  children: React.ReactNode;
  className?: string;
  overlayGradient?: string;
  id?: string;
}

export function VideoHeroSection({
  videoSrc,
  posterSrc,
  watermarkText,
  children,
  className = "",
  overlayGradient,
  id,
}: VideoHeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const watermarkRef = useRef<HTMLSpanElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Lazy-load video when section is near viewport
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !videoLoaded) {
          video.src = videoSrc;
          video.load();
          setVideoLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [videoSrc, videoLoaded]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Video parallax: scale 1.15 -> 1, translateY 0 -> 20%
      if (videoRef.current) {
        gsap.set(videoRef.current, { scale: 1.15 });
        gsap.to(videoRef.current, {
          scale: 1,
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Watermark parallax: y drift + fade
      if (watermarkRef.current) {
        gsap.to(watermarkRef.current, {
          yPercent: -40,
          xPercent: -10,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const gradient =
    overlayGradient ??
    "linear-gradient(to bottom, rgba(10,10,15,0.65) 0%, rgba(10,10,15,0.3) 40%, rgba(10,10,15,0.75) 100%)";

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative flex min-h-[80dvh] flex-col justify-end overflow-hidden ${className}`}
    >
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster={posterSrc}
          preload="none"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: gradient }} />
        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* Watermark text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] flex select-none items-center justify-center"
      >
        <span ref={watermarkRef} className="watermark-text">
          {watermarkText}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
