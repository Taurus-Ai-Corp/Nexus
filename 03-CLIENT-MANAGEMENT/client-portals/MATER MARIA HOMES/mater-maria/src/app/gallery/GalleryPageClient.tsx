"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Camera } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ImageSlideshow } from "@/components/ui/image-slideshow";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { PageTransition } from "@/components/ui/page-transition";
import { VideoBreak } from "@/components/ui/video-break";
import { GALLERY_ITEMS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

const GALLERY_HERO_IMAGES = [
  "/assets-2025/images/tour/aerial/flux-aerial-01.webp",
  "/assets-2025/images/tour/aerial/flux-aerial-03.webp",
  "/assets-2025/images/tour/aerial/flux-aerial-02.webp",
  "/assets-2025/images/tour/ground/ground-04-raw.jpg",
  "/assets-2025/images/tour/ground/flux-ground-01.webp",
];

const FILTERS = ["All", "Exterior", "Interior", "Amenities", "Community"] as const;
type FilterType = (typeof FILTERS)[number];

export function GalleryPageClient() {
  const [active, setActive] = useState<FilterType>("All");
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered =
    active === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === active);

  // Split gallery items for mid-section video break
  const midpoint = Math.ceil(filtered.length / 2);
  const firstHalf = filtered.slice(0, midpoint);
  const secondHalf = filtered.slice(midpoint);

  // GSAP reveal on gallery grid items
  useEffect(() => {
    const container = gridRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const cards = container.querySelectorAll("[data-gsap-gallery]");
      if (cards.length === 0) return;

      gsap.from(cards, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
        },
      });
    }, container);

    return () => ctx.revert();
  }, [active]);

  return (
    <PageTransition>
    <main id="main-content">
      {/* Slideshow Hero */}
      <ImageSlideshow
        images={GALLERY_HERO_IMAGES}
        interval={4000}
        watermarkText="GALLERY"
        blur
      >
        <Container size="lg" className="pb-20 pt-40">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <span className="text-white/40">/</span>
            <span className="font-medium text-white">Gallery</span>
          </nav>
          <SectionHeading
            badge="Visual Tour"
            title="Explore Mater Maria"
            subtitle="Browse through our campus, residences, amenities, and community life."
            onHero
          />
        </Container>
      </ImageSlideshow>

      {/* Filter Tabs */}
      <section className="pb-4 pt-16">
        <Container size="lg">
          <div className="flex flex-wrap justify-center gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActive(filter)}
                aria-pressed={active === filter}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  active === filter
                    ? "bg-accent-default text-text-inverse"
                    : "border border-border-default bg-surface text-text-secondary hover:border-border-strong hover:text-text-primary"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* First Half — Anti-Grid Masonry Layout */}
      <section className="py-8" ref={gridRef}>
        <Container size="lg">
          <motion.div
            layout
            className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3 xl:columns-4"
          >
            <AnimatePresence mode="popLayout">
              {firstHalf.map((item, idx) => (
                <GalleryCard key={item.id} item={item} idx={idx} />
              ))}
            </AnimatePresence>
          </motion.div>
        </Container>
      </section>

      {/* Video Break */}
      <VideoBreak
        videoSrc="/assets-2025/videos/sanctuary-living.mp4"
        watermarkText="MATER MARIA HOMES"
      />

      {/* Second Half — Anti-Grid Masonry */}
      {secondHalf.length > 0 && (
        <section className="py-8 pb-24">
          <Container size="lg">
            <motion.div
              layout
              className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3 xl:columns-4"
            >
              <AnimatePresence mode="popLayout">
                {secondHalf.map((item, idx) => (
                  <GalleryCard key={item.id} item={item} idx={idx + midpoint} />
                ))}
              </AnimatePresence>
            </motion.div>

            <ScrollReveal variant="fade-up" delay={0.3}>
              <p className="mt-12 text-center text-sm text-text-muted">
                More photos coming soon. Check back as we continue to capture life at Mater Maria.
              </p>
            </ScrollReveal>
          </Container>
        </section>
      )}
    </main>
    </PageTransition>
  );
}

/* ------------------------------------------------------------------ */
/*  Gallery Card                                                       */
/* ------------------------------------------------------------------ */
const ASPECT_PATTERNS = [
  "aspect-square",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/5]",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/3]",
  "aspect-[3/4]",
];

function GalleryCard({ item, idx = 0 }: { item: { id: number; label: string; category: string }; idx?: number }) {
  const aspect = ASPECT_PATTERNS[idx % ASPECT_PATTERNS.length];

  return (
    <motion.div
      layout
      data-gsap-gallery
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className={`group relative ${aspect} break-inside-avoid overflow-hidden rounded-2xl border border-white/10 backdrop-blur-md bg-gradient-to-br from-accent-default/10 via-white/5 to-accent-default/5 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-accent-default/10 hover:-translate-y-1 hover:border-accent-default/30`}
    >
      {/* Glassmorphism inner glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />

      {/* Placeholder content */}
      <div className="flex h-full flex-col items-center justify-center p-6 text-center relative z-10">
        <Camera className="mb-3 size-10 text-accent-default/40 transition-all duration-300 group-hover:text-accent-default/70 group-hover:scale-110" />
        <p className="text-sm font-medium text-text-primary">{item.label}</p>
        <span className="mt-2 rounded-full border border-accent-default/20 bg-accent-default/10 px-3 py-0.5 text-xs text-accent-default backdrop-blur-sm">
          {item.category}
        </span>
      </div>

      {/* Hover overlay with frosted glass */}
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 opacity-0 transition-all duration-500 group-hover:opacity-100 backdrop-blur-[2px] group-hover:backdrop-blur-0">
        <p className="text-sm font-medium text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{item.label}</p>
      </div>
    </motion.div>
  );
}
