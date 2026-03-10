"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function InteractiveZoom() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    const title = titleRef.current;
    if (!section || !media || !title) return;

    const ctx = gsap.context(() => {
      // Image zooms from 30vw to full viewport
      gsap.fromTo(
        media,
        { width: "30vw", height: "40vh", borderRadius: "20px" },
        {
          width: "100vw",
          height: "100vh",
          borderRadius: "0px",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      // Title scales up and fades
      gsap.to(title, {
        scale: 2,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=60%",
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-bg-base"
      style={{ height: "200vh" }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div
          ref={mediaRef}
          className="relative overflow-hidden"
          style={{
            width: "30vw",
            height: "40vh",
            borderRadius: "20px",
            boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
          }}
        >
          <Image
            src="/assets-2025/images/invest/hero-estate.webp"
            alt="Mater Maria Estate panoramic view"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        <h2
          ref={titleRef}
          className="pointer-events-none absolute z-10 text-center font-heading text-6xl font-bold text-white md:text-[8vw]"
          style={{ mixBlendMode: "overlay" }}
        >
          Uncompromising
          <br />
          Grandeur
        </h2>
      </div>
    </section>
  );
}
