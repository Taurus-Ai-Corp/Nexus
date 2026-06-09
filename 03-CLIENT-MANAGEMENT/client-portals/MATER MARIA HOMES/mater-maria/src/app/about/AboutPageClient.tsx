"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  AIHealthIcon,
  SmartLivingIcon,
  CommunityNodesIcon,
  IoTSensorIcon,
} from "@/components/icons/estate-icons";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlowCard } from "@/components/ui/glow-card";
import { MotionDiv } from "@/components/ui/motion";
import { ImageSlideshow } from "@/components/ui/image-slideshow";
import { PageTransition } from "@/components/ui/page-transition";
import { VideoBreak } from "@/components/ui/video-break";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { LocationAdvantage } from "@/components/sections/LocationAdvantage";

const ABOUT_HERO_IMAGES = [
  "/assets-2025/images/tour/aerial/flux-aerial-01.webp",
  "/assets-2025/images/tour/ground/ground-04-raw.jpg",
  "/assets-2025/images/tour/aerial/flux-aerial-03.webp",
  "/assets-2025/images/tour/ground/flux-ground-01.webp",
  "/assets-2025/images/tour/aerial/flux-aerial-02.webp",
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
} as const;

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
} as const;

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const TIMELINE = [
  { year: "2023", title: "Concept & Land Acquisition", description: "The vision of Mater Maria was born. Five acres of lush land in Kanjirappally were acquired to lay the foundation." },
  { year: "2024", title: "Construction Begins", description: "Architectural plans finalized and construction kicked off, combining traditional Kerala aesthetics with modern comforts." },
  { year: "2025", title: "First Residents Welcome", description: "Phase 1 residences completed. Our first residents moved in, bringing the community to life." },
  { year: "2026", title: "Phase 2 Expansion", description: "Additional villas, enhanced wellness center, and expanded community spaces under construction." },
];

const VALUES = [
  {
    title: "Compassion",
    description: "Every interaction is grounded in empathy, kindness, and genuine care for the well-being of our residents.",
    Icon: AIHealthIcon,
  },
  {
    title: "Innovation",
    description: "Powered by AI health monitoring, IoT wellness sensors, and smart home automation — technology that cares.",
    Icon: SmartLivingIcon,
  },
  {
    title: "Community",
    description: "We foster belonging and connection — a family beyond blood, where every resident matters.",
    Icon: CommunityNodesIcon,
  },
  {
    title: "Excellence",
    description: "From green architecture to AI-driven wellness, we hold ourselves to the highest standards — because you deserve nothing less.",
    Icon: IoTSensorIcon,
  },
];

/* ------------------------------------------------------------------ */
/*  Client Component                                                   */
/* ------------------------------------------------------------------ */
export default function AboutPageClient() {
  const valuesRef = useGsapReveal(".gsap-reveal", {
    y: 60,
    stagger: 0.12,
    duration: 0.8,
  });

  const timelineRef = useGsapReveal(".gsap-reveal", {
    y: 60,
    stagger: 0.18,
    duration: 0.9,
    start: "top 80%",
  });

  return (
    <PageTransition>
    <main id="main-content" className="pb-24">
      {/* Hero with image slideshow background */}
      <ImageSlideshow
        images={ABOUT_HERO_IMAGES}
        interval={5000}
        watermarkText="OUR VISION"
      >
        <Container size="lg" className="pb-20 pt-40">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight className="size-4" />
            <span className="font-medium text-white">About</span>
          </nav>

          <SectionHeading
            badge="Our Story"
            title="About Mater Maria"
            subtitle="Where technology meets nature, and neighbours become family. A happening community built for people who refuse to settle for ordinary."
            onHero
          />
        </Container>
      </ImageSlideshow>

      {/* Vision / Mission */}
      <section className="relative py-16">
        <Container size="lg">
          <MotionDiv
            className="grid gap-12 md:grid-cols-2"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <MotionDiv
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="rounded-xl border border-border-default bg-surface p-8"
            >
              <h2 className="font-heading mb-4 text-2xl font-bold text-accent-default">
                Our Vision
              </h2>
              <p className="leading-relaxed text-text-secondary">
                To build Kerala&apos;s most forward-thinking wellness community — a
                place where AI keeps you healthy, solar powers your home, organic farms
                feed your table, and your neighbours actually know your name.
                A campus alive with energy, ideas, and possibility.
              </p>
            </MotionDiv>

            <MotionDiv
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="rounded-xl border border-border-default bg-surface p-8"
            >
              <h2 className="font-heading mb-4 text-2xl font-bold text-accent-default">
                Our Mission
              </h2>
              <p className="leading-relaxed text-text-secondary">
                To deliver a living experience that blends smart healthcare, sustainable
                infrastructure, and a buzzing social life — all on one world-class
                campus in the heart of Kottayam. We exist so our residents can focus on
                what matters: living fully, connecting deeply, and thriving every day.
              </p>
            </MotionDiv>
          </MotionDiv>
        </Container>
      </section>

      {/* Core Values */}
      <section className="relative py-16" ref={valuesRef as React.RefObject<HTMLElement>}>
        <Container size="lg">
          <SectionHeading badge="What We Stand For" title="Our Core Values" />

          <MotionDiv
            className="grid gap-8 sm:grid-cols-2"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {VALUES.map((v) => (
              <MotionDiv key={v.title} variants={fadeUp} transition={{ duration: 0.5 }}>
                <div className="gsap-reveal">
                  <GlowCard>
                    <v.Icon className="mb-4 size-8 text-accent-default" />
                    <h3 className="font-heading mb-2 text-xl font-semibold text-text-primary">
                      {v.title}
                    </h3>
                    <p className="text-text-secondary">{v.description}</p>
                  </GlowCard>
                </div>
              </MotionDiv>
            ))}
          </MotionDiv>
        </Container>
      </section>

      {/* Timeline */}
      <section className="relative py-16" ref={timelineRef as React.RefObject<HTMLElement>}>
        <Container size="md">
          <SectionHeading badge="Our Journey" title="Milestones" />

          <div className="relative pl-8 md:pl-0">
            {/* Vertical line */}
            <div className="absolute left-3 top-0 h-full w-px bg-border-accent md:left-1/2 md:-translate-x-px" />

            {TIMELINE.map((item, i) => (
              <MotionDiv
                key={item.year}
                className={`relative mb-12 last:mb-0 md:w-1/2 ${
                  i % 2 === 0 ? "md:pr-12" : "md:ml-auto md:pl-12"
                }`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {/* Dot */}
                <div
                  className={`absolute top-1 size-3 rounded-full bg-accent-default ring-4 ring-bg-base ${
                    i % 2 === 0
                      ? "left-[-1.125rem] md:left-auto md:right-[-0.375rem]"
                      : "left-[-1.125rem] md:left-[-0.375rem]"
                  }`}
                />

                <div className="gsap-reveal rounded-lg border border-border-default bg-surface p-6">
                  <span className="mb-1 block text-sm font-bold text-accent-default">
                    {item.year}
                  </span>
                  <h3 className="font-heading mb-2 text-lg font-semibold text-text-primary">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary">{item.description}</p>
                </div>
              </MotionDiv>
            ))}
          </div>
        </Container>
      </section>

      {/* Video Break between Timeline and Location */}
      <VideoBreak
        videoSrc="/assets-2025/videos/sanctuary-living.mp4"
        watermarkText="MATER MARIA"
      />

      {/* Kerala Advantage — rich location section */}
      <LocationAdvantage />
    </main>
    </PageTransition>
  );
}
