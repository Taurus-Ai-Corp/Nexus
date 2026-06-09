"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AnimatedBackgroundProps {
  /** Image sources for slideshow (rotating backgrounds) */
  images?: string[];
  /** Video source for video background */
  video?: string;
  /** Opacity of the background (0-1) */
  opacity?: number;
  /** Speed of slideshow rotation in ms */
  slideInterval?: number;
  /** Ken Burns zoom speed */
  zoomSpeed?: number;
  /** Additional CSS classes */
  className?: string;
  /** Overlay gradient for text readability */
  overlay?: boolean;
  /** Overlay intensity */
  overlayIntensity?: "none" | "light" | "medium" | "dark";
  /** Enable subtle parallax on mouse move */
  parallax?: boolean;
}

export function AnimatedBackground({
  images,
  video,
  opacity = 0.15,
  slideInterval = 8000,
  zoomSpeed = 0.02,
  className,
  overlay = true,
  overlayIntensity = "medium",
  parallax = false,
}: AnimatedBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(1);

  // Handle image slideshow
  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % images.length);
    }, slideInterval);
    return () => clearInterval(interval);
  }, [images, slideInterval]);

  // Handle Ken Burns zoom animation
  useEffect(() => {
    if (images || video) {
      const animate = () => {
        zoomRef.current += zoomSpeed;
        if (zoomRef.current > 1.15) zoomRef.current = 1;
      };
      const interval = setInterval(animate, 50);
      return () => clearInterval(interval);
    }
  }, [images, video, zoomSpeed]);

  // Handle parallax effect
  useEffect(() => {
    if (!parallax) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [parallax]);

  const overlayStyles: Record<string, string> = {
    none: "bg-transparent",
    light: "bg-gradient-to-b from-transparent via-transparent to-black/20",
    medium: "bg-gradient-to-b from-black/30 via-black/20 to-black/40",
    dark: "bg-gradient-to-b from-black/50 via-black/40 to-black/60",
  };

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 overflow-hidden", className)}
    >
      {/* Background layer */}
      <div
        className="absolute inset-0 transition-transform duration-1000 ease-out"
        style={{
          transform: `scale(${1 + zoomRef.current * 0.1}) translate(${-mousePos.x * 10}px, ${-mousePos.y * 10}px)`,
        }}
      >
        {/* Video background */}
        {video && (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
            style={{ opacity }}
          >
            <source src={video} type="video/mp4" />
          </video>
        )}

        {/* Image slideshow background */}
        {images && images.length > 0 && (
          <>
            {images.map((src, index) => (
              <div
                key={src}
                className={cn(
                  "absolute inset-0 h-full w-full transition-opacity duration-1500",
                  index === currentIndex ? "opacity-100" : "opacity-0"
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
          </>
        )}
      </div>

      {/* Gradient overlay for text readability */}
      {overlay && (
        <div
          className={cn("absolute inset-0 pointer-events-none", overlayStyles[overlayIntensity])}
        />
      )}

      {/* Noise texture overlay for film grain effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

/* ── Preset Background Variants ─────────────────────────────────── */

interface SectionBackgroundProps {
  variant: "hero" | "features" | "amenities" | "testimonials" | "cta";
  className?: string;
}

export function SectionBackground({ variant, className }: SectionBackgroundProps) {
  const backgrounds: Record<string, {
    images?: string[];
    video?: string;
    overlayIntensity: "none" | "light" | "medium" | "dark";
    opacity: number;
  }> = {
    hero: {
      video: "/assets-2025/videos/promo-short.mp4",
      overlayIntensity: "dark",
      opacity: 0.4,
    },
    features: {
      images: [
        "/assets-2025/images/gallery/mmh-kmg-b003.webp",
        "/assets-2025/images/gallery/wayanad-mist.webp",
      ],
      overlayIntensity: "medium",
      opacity: 0.2,
    },
    amenities: {
      images: [
        "/assets-2025/images/amenities/mm-poolside-community.webp",
        "/assets-2025/images/amenities/ayurveda-spa.webp",
      ],
      overlayIntensity: "light",
      opacity: 0.15,
    },
    testimonials: {
      images: [
        "/assets-2025/images/tour/aerial/flux-aerial-01.webp",
        "/assets-2025/images/gallery/kerala-backwaters-sunset.webp",
      ],
      overlayIntensity: "medium",
      opacity: 0.25,
    },
    cta: {
      images: [
        "/assets-2025/images/invest/hero-sunset.webp",
        "/assets-2025/images/invest/hero-garden.webp",
      ],
      overlayIntensity: "dark",
      opacity: 0.35,
    },
  };

  const config = backgrounds[variant];

  return (
    <AnimatedBackground
      images={config.images}
      video={config.video}
      overlayIntensity={config.overlayIntensity}
      opacity={config.opacity}
      parallax={variant === "hero"}
      className={className}
    />
  );
}
