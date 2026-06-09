"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { Quote } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function DualCovenant() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".covenant-reveal", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });

      // Subtle parallax on the image
      gsap.to(".parallax-img", {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="theme-lifestyle relative py-32 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border-accent to-transparent opacity-20" />
      <div className="absolute -left-[20%] top-20 w-[40%] h-[40%] rounded-full bg-accent-soft opacity-[0.03] blur-[100px]" />
      
      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left: Typography & Story */}
          <div className="lg:col-span-7 flex flex-col gap-8 covenant-reveal">
            <div className="flex flex-col gap-4">
              <span className="text-xs tracking-[0.3em] text-accent-default uppercase font-semibold">
                The Dual-Covenant Philosophy
              </span>
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-[1.1]">
                Executive Excellence.<br />
                <span className="text-gradient-gold italic font-light">Pastoral Grace.</span>
              </h2>
            </div>

            <div className="flex flex-col gap-6 text-text-secondary text-lg leading-relaxed max-w-2xl">
              <p>
                At Mater Maria, professional rigor and spiritual mission are inseparable. We operate under a unique &quot;Dual-Covenant&quot; ensuring that every decision is both technically flawless and morally grounded.
              </p>
              <p>
                Guided by our Spiritual Patron, <strong>His Excellency Bishop Mar Jose Pulickal</strong>, and an executive board with decades of global corporate pedigree, we replace traditional &quot;assisted living&quot; with a High-Performance Wellness Ecosystem.
              </p>
            </div>

            {/* Fiduciary / Trust Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="p-6 rounded-2xl border border-border-default bg-surface glow-card-hover">
                <h4 className="font-heading text-xl font-bold text-text-primary mb-2">Fiduciary Integrity</h4>
                <p className="text-sm text-text-muted">Radical financial transparency. Trust earned through audited, disciplined management.</p>
              </div>
              <div className="p-6 rounded-2xl border border-border-default bg-surface glow-card-hover">
                <h4 className="font-heading text-xl font-bold text-text-primary mb-2">Precision Care</h4>
                <p className="text-sm text-text-muted">A closed-loop system where medical precision converges with a life of effortless vitality.</p>
              </div>
            </div>
          </div>

          {/* Right: Abstract/Editorial Visual */}
          <div className="lg:col-span-5 relative h-[500px] lg:h-[700px] w-full rounded-2xl overflow-hidden covenant-reveal">
            <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 to-transparent z-10" />
            <div className="absolute inset-0 border border-white/10 z-20 rounded-2xl pointer-events-none" />
            
            <Image 
              src="/assets-2025/images/renders/Family-time-002.png" 
              alt="Mater Maria estate gardens with tropical landscaping and walking paths"
              fill
              className="object-cover parallax-img"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />

            {/* Overlay Quote */}
            <div className="absolute bottom-8 left-8 right-8 z-30 p-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl">
              <Quote className="w-8 h-8 text-accent-default mb-4 opacity-50" />
              <p className="text-white/90 text-sm md:text-base font-medium leading-relaxed italic">
                &quot;What does a community owe to those who have given it their best years? A final chapter that is not a diminishment, but a crowning.&quot;
              </p>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
