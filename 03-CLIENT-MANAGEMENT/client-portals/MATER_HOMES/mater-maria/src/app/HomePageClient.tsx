"use client";

import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Features } from "@/components/sections/Features";
import { Residences } from "@/components/sections/Residences";
import { Amenities } from "@/components/sections/Amenities";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTASection } from "@/components/sections/CTASection";
import { FacilitiesSection } from "@/components/sections/FacilitiesSection";
import { SectionDivider } from "@/components/ui/section-divider";
import { VideoBreak } from "@/components/ui/video-break";
import { useGsapReveal } from "@/hooks/useGsapReveal";

export default function HomePageClient() {
  const mainRef = useGsapReveal(".gsap-reveal", {
    y: 60,
    duration: 0.9,
    stagger: 0.12,
    ease: "power3.out",
    start: "top 80%",
  });

  return (
    <main id="main-content" ref={mainRef}>
      <div className="gsap-reveal">
        <Hero />
      </div>

      <SectionDivider variant="fade" />

      <div className="gsap-reveal">
        <TrustBar />
      </div>

      <SectionDivider variant="wave" />

      <div className="gsap-reveal">
        <Features />
      </div>

      <VideoBreak
        videoSrc="/assets-2025/videos/bg-loop-1.mp4"
        watermarkText="LIVING REFINED"
      />

      <div className="gsap-reveal">
        <Residences />
      </div>

      <SectionDivider variant="wave" />

      <div className="gsap-reveal">
        <Amenities />
      </div>

      <SectionDivider variant="fade" />

      <FacilitiesSection />

      <VideoBreak
        videoSrc="/assets-2025/videos/bg-loop-2.mp4"
        watermarkText="LIVING REFINED"
      />

      <div className="gsap-reveal">
        <Testimonials />
      </div>

      <SectionDivider variant="wave" />

      <div className="gsap-reveal">
        <CTASection />
      </div>
    </main>
  );
}
