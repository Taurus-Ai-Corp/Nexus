"use client";

import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { DualCovenant } from "@/components/sections/DualCovenant";
import { SectionDivider } from "@/components/ui/section-divider";
import { useGsapReveal } from "@/hooks/useGsapReveal";

const Features = dynamic(() => import("@/components/sections/Features").then(m => m.Features), { ssr: false });
const MedicalWellnessSection = dynamic(() => import("@/components/sections/MedicalWellnessSection").then(m => m.MedicalWellnessSection), { ssr: false });
const Residences = dynamic(() => import("@/components/sections/Residences").then(m => m.Residences), { ssr: false });
const Amenities = dynamic(() => import("@/components/sections/Amenities").then(m => m.Amenities), { ssr: false });
const InfrastructureSection = dynamic(() => import("@/components/sections/InfrastructureSection").then(m => m.InfrastructureSection), { ssr: false });
const FacilitiesSection = dynamic(() => import("@/components/sections/FacilitiesSection").then(m => m.FacilitiesSection), { ssr: false });
const Testimonials = dynamic(() => import("@/components/sections/Testimonials").then(m => m.Testimonials), { ssr: false });
const CTASection = dynamic(() => import("@/components/sections/CTASection").then(m => m.CTASection), { ssr: false });
const MockupsShowcase = dynamic(() => import("@/components/sections/MockupsShowcase").then(m => m.MockupsShowcase), { ssr: false });
const VideoBreak = dynamic(() => import("@/components/ui/video-break").then(m => m.VideoBreak), { ssr: false });

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
