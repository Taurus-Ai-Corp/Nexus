"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import { HERO } from "@/lib/constants";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const image = imageRef.current;
      const overlay = overlayRef.current;
      const content = contentRef.current;
      if (!section || !image || !overlay || !content) return;

      // Zoom-out on scroll: starts at 1.18 scale, settles to 1.0
      gsap.fromTo(
        image,
        { scale: 1.18 },
        {
          scale: 1.0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        }
      );

      // Overlay darkens slightly as content scrolls away
      gsap.fromTo(
        overlay,
        { opacity: 0.45 },
        {
          opacity: 0.7,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "60% top",
            scrub: true,
          },
        }
      );

      // Content fades and rises out as user scrolls
      gsap.fromTo(
        content,
        { y: 0, opacity: 1 },
        {
          y: -60,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "20% top",
            end: "55% top",
            scrub: 1,
          },
        }
      );

      // Entrance animation for text
      gsap.from(content.querySelectorAll(".hero-anim"), {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.3,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Full-screen background image with zoom */}
      <div
        ref={imageRef}
        className="absolute inset-0 will-change-transform"
        style={{ transformOrigin: "center center" }}
      >
        <Image
          src="/assets-2025/images/invest/hero-estate.webp"
          alt="Mater Maria Homes estate aerial view"
          fill
          priority
          quality={90}
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Dark overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,12,18,0.45) 0%, rgba(10,12,18,0.3) 40%, rgba(10,12,18,0.6) 100%)",
        }}
      />

      {/* Decorative gold line */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: "linear-gradient(90deg, transparent, #C9A84C 40%, #C9A84C 60%, transparent)" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center gap-6 px-4 text-center"
      >
        {/* Badge */}
        <span className="hero-anim inline-block rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-5 py-1.5 text-sm font-medium tracking-widest uppercase text-[#C9A84C]">
          {HERO.badge}
        </span>

        {/* Main title */}
        <h1 className="hero-anim font-heading text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]" style={{ textShadow: "0 2px 40px rgba(0,0,0,0.4)" }}>
          Where Innovation<br />
          <span style={{ background: "linear-gradient(135deg, #C9A84C, #e8d08a, #C9A84C)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Meets Serenity
          </span>
        </h1>

        {/* Sub-tagline */}
        <p className="hero-anim max-w-xl text-base leading-relaxed text-white/80 md:text-lg" style={{ textShadow: "0 1px 20px rgba(0,0,0,0.5)" }}>
          Kerala&apos;s first AI-powered net-zero wellness estate — where your parents don&apos;t just live, they thrive.
        </p>

        {/* CTA row */}
        <div className="hero-anim flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            className="rounded-full px-8 py-3 text-base font-semibold text-[#0A356A]"
            style={{ background: "linear-gradient(135deg, #C9A84C, #e8d08a)", boxShadow: "0 4px 24px rgba(201,168,76,0.4)" }}
            aria-label={HERO.cta.primary}
          >
            {HERO.cta.primary}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 py-3 text-base font-medium border-white/40 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
            aria-label={HERO.cta.secondary}
            asChild
          >
            <Link href="/tour">{HERO.cta.secondary}</Link>
          </Button>
        </div>

        {/* Stats bar */}
        <div className="hero-anim mt-6 flex flex-wrap justify-center gap-8 md:gap-12">
          {HERO.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-0.5">
              <span className="font-heading text-3xl font-bold" style={{ color: "#C9A84C", textShadow: "0 2px 12px rgba(201,168,76,0.4)" }}>
                {stat.value}{stat.suffix}
              </span>
              <span className="text-xs uppercase tracking-widest text-white/60">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50" aria-hidden="true">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </div>
    </section>
  );
}
