"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, TreePalm, Waves, Sun } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ImageSlideshow } from "@/components/ui/image-slideshow";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { PageTransition } from "@/components/ui/page-transition";
import { MagneticButton } from "@/components/ui/magnetic-button";

const TOUR_HERO_IMAGES = [
  "/assets-2025/images/tour/aerial/flux-aerial-01.webp",
  "/assets-2025/images/tour/ground/flux-ground-01.webp",
  "/assets-2025/images/tour/aerial/flux-aerial-02.webp",
  "/assets-2025/images/tour/ground/ground-04-raw.jpg",
  "/assets-2025/images/tour/aerial/flux-aerial-03.webp",
  "/assets-2025/images/tour/aerial/flux-aerial-02.webp",
  "/assets-2025/images/tour/aerial/flux-aerial-01.webp",
  "/assets-2025/images/tour/ground/flux-ground-01.webp",
  "/assets-2025/images/tour/aerial/flux-aerial-03.webp",
  "/assets-2025/images/tour/ground/ground-04-raw.jpg",
];

const TOUR_HIGHLIGHTS = [
  {
    icon: Home,
    title: "Villa Exteriors",
    description:
      "Mediterranean-inspired architecture with terracotta roofs, private balconies, and landscaped gardens surrounding each residence.",
  },
  {
    icon: Waves,
    title: "Pool & Recreation",
    description:
      "Community infinity pool with sundeck, garden pavilions, and dedicated spaces for morning yoga and evening gatherings.",
  },
  {
    icon: TreePalm,
    title: "Organic Orchards",
    description:
      "8+ acres of tropical fruit orchards — mango, jackfruit, coconut — with walking trails winding through the estate.",
  },
  {
    icon: Sun,
    title: "Golden Hour Views",
    description:
      "Panoramic views of the Ponkunnam-Pala corridor. Watch sunsets paint the Western Ghats from your private terrace.",
  },
];

export function TourPageClient() {
  return (
    <PageTransition>
      <main id="main-content">
        {/* Hero — Full-screen slideshow with Ken Burns motion */}
        <ImageSlideshow
          images={TOUR_HERO_IMAGES}
          interval={5000}
          watermarkText="VILLA TOUR"
          overlay="linear-gradient(to bottom, rgba(10,10,15,0.4) 0%, rgba(10,10,15,0.15) 40%, rgba(10,10,15,0.6) 100%)"
        >
          <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/80 backdrop-blur-sm">
                Immersive Experience
              </span>
            </motion.div>

            <motion.h1
              className="font-heading text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Fly Through Your
              <br />
              <span className="text-accent-default">Future Home</span>
            </motion.h1>

            <motion.p
              className="mt-4 max-w-xl text-base text-white/70 sm:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              A cinematic drone tour of Mater Maria — from aerial
              approach to villa close-ups, pool gardens, and golden-hour views.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <MagneticButton
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-accent-default px-8 py-3 font-medium text-text-inverse transition-colors hover:bg-accent-hover"
              >
                Schedule a Visit
              </MagneticButton>
              <MagneticButton
                href="/invest"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-3 font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                Invest Now
              </MagneticButton>
            </motion.div>
          </div>
        </ImageSlideshow>

        {/* Highlights Section */}
        <section className="bg-surface-primary py-20 md:py-28">
          <Container>
            <ScrollReveal variant="blur-in">
              <SectionHeading
                badge="What You'll See"
                title="Tour Highlights"
                subtitle="Each scene in the drone tour showcases a different facet of the Mater Maria lifestyle."
              />
            </ScrollReveal>

            <ScrollReveal variant="stagger" staggerSelector="[data-sr-item]" staggerAmount={0.15}>
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {TOUR_HIGHLIGHTS.map((item) => (
                  <div
                    key={item.title}
                    data-sr-item
                    className="group rounded-2xl border border-border-default bg-surface-secondary p-6 transition-all duration-300 hover:border-accent-default/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent-default/5"
                  >
                    <div className="mb-4 inline-flex rounded-xl bg-accent-default/10 p-3 transition-colors duration-300 group-hover:bg-accent-default/20">
                      <item.icon className="size-6 text-accent-default transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </Container>
        </section>

        {/* Slideshow break — ground-level images */}
        <ImageSlideshow
          images={[
            "/assets-2025/images/tour/ground/flux-ground-01.webp",
            "/assets-2025/images/tour/aerial/flux-aerial-02.webp",
            "/assets-2025/images/tour/ground/ground-04-raw.jpg",
          ]}
          interval={4000}
          watermarkText="LIVING REFINED"
          height="min-h-[50vh]"
          blur
        />

        {/* Full Video Embed Section */}
        <section className="bg-surface-secondary py-20 md:py-28">
          <Container>
            <ScrollReveal variant="fade-up">
              <SectionHeading
                badge="Full Tour"
                title="Watch the Complete Villa Tour"
                subtitle="45 seconds of cinematic flight — aerial approach, estate grounds, villa close-ups, and sunset finale."
              />
            </ScrollReveal>

            <ScrollReveal variant="scale" delay={0.2}>
              <div className="relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-border-default shadow-2xl">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster="/assets-2025/images/tour/aerial/flux-aerial-01.webp"
                  className="aspect-video w-full bg-black"
                >
                  <source src="/assets-2025/videos/villa-showcase.mp4" type="video/mp4" />
                  Your browser does not support video playback.
                </video>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delay={0.3}>
              <div className="mt-8 text-center">
                <p className="text-sm text-text-tertiary">
                  All footage is rendered from real architectural plans — no AI
                  generation, pure photorealistic visualization.
                </p>
              </div>
            </ScrollReveal>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="bg-surface-primary py-20 md:py-28">
          <Container>
            <ScrollReveal variant="blur-in">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="font-heading text-3xl font-bold text-text-primary md:text-4xl">
                  Ready to See It in Person?
                </h2>
                <p className="mt-4 text-text-secondary">
                  Schedule a visit to walk the grounds, tour model villas, and
                  experience the lifestyle firsthand.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-default px-8 py-3 font-medium text-text-inverse transition-all duration-300 hover:bg-accent-hover hover:shadow-lg hover:shadow-accent-default/20"
                  >
                    Book a Site Visit
                  </Link>
                  <Link
                    href="/gallery"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border-default px-8 py-3 font-medium text-text-primary transition-all duration-300 hover:bg-surface-secondary hover:-translate-y-0.5"
                  >
                    View Photo Gallery
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </Container>
        </section>
      </main>
    </PageTransition>
  );
}
