"use client";

import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { DualCovenant } from "@/components/sections/DualCovenant";
import { Features } from "@/components/sections/Features";
import { MedicalWellnessSection } from "@/components/sections/MedicalWellnessSection";
import { Residences } from "@/components/sections/Residences";
import { Amenities } from "@/components/sections/Amenities";
import { InfrastructureSection } from "@/components/sections/InfrastructureSection";
import { FacilitiesSection } from "@/components/sections/FacilitiesSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTASection } from "@/components/sections/CTASection";
import { MockupsShowcase } from "@/components/sections/MockupsShowcase";
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

      <div className="gsap-reveal">
        <DualCovenant />
      </div>

      <SectionDivider variant="wave" />

      <div className="gsap-reveal">
        <Features />
      </div>

      <div className="gsap-reveal">
        <MedicalWellnessSection />
      </div>

      <VideoBreak
        videoSrc="/assets-2025/videos/bg-loop-1.mp4"
        watermarkText="DIVINE SANCTUARY"
      />

      <div className="gsap-reveal">
        <Residences />
      </div>

      <SectionDivider variant="wave" />

      <div className="gsap-reveal">
        <Amenities />
      </div>

      <SectionDivider variant="fade" />

      <div className="gsap-reveal">
        <InfrastructureSection />
      </div>

      <VideoBreak
        videoSrc="/assets-2025/videos/bg-loop-2.mp4"
        watermarkText="LIVING REFINED"
      />

      <div className="gsap-reveal">
        <FacilitiesSection />
      </div>

      <SectionDivider variant="fade" />

      <div className="gsap-reveal">
        <Testimonials />
      </div>

      <SectionDivider variant="fade" />

      <div className="gsap-reveal">
        <MockupsShowcase />
      </div>

      <SectionDivider variant="wave" />

      <div className="gsap-reveal">
        <CTASection />
      </div>
    </main>
  );
}
