"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface VideoBreakProps {
  videoSrc: string;
  watermarkText?: string;
  height?: string;
  overlayOpacity?: number;
}

export function VideoBreak({
  videoSrc,
  watermarkText = "MATER MARIA",
  height = "min-h-[50vh]",
  overlayOpacity = 0.6,
}: VideoBreakProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Lazy-load video when near viewport
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
      { rootMargin: "300px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [videoSrc, videoLoaded]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (videoRef.current) {
        gsap.set(videoRef.current, { scale: 1.1 });
        gsap.to(videoRef.current, {
          scale: 1,
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`relative ${height} overflow-hidden`}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, rgba(10,10,15,${overlayOpacity}) 0%, rgba(10,10,15,${overlayOpacity * 0.5}) 50%, rgba(10,10,15,${overlayOpacity}) 100%)`,
        }}
      />
      {watermarkText && (
        <div className="pointer-events-none absolute inset-0 flex select-none items-center justify-center">
          <span className="watermark-text">{watermarkText}</span>
        </div>
      )}
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
