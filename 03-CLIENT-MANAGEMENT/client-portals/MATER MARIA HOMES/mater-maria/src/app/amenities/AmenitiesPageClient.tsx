"use client";

import Link from "next/link";
import {
  Gamepad2,
  ChevronRight,
  Check,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/components/ui/motion";
import { ImageSlideshow } from "@/components/ui/image-slideshow";
import { PageTransition } from "@/components/ui/page-transition";
import { VideoBreak } from "@/components/ui/video-break";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { AMENITIES, AMENITY_DESCRIPTIONS } from "@/lib/constants";
import {
  AIHealthIcon,
  WellnessSpaIcon,
  CommunityNodesIcon,
  OrganicKitchenIcon,
  SmartLivingIcon,
} from "@/components/icons/estate-icons";

const AMENITIES_HERO_IMAGES = [
  "/assets-2025/images/tour/ground/flux-ground-01.webp",
  "/assets-2025/images/tour/aerial/flux-aerial-01.webp",
  "/assets-2025/images/tour/aerial/flux-aerial-03.webp",
  "/assets-2025/images/tour/aerial/flux-aerial-02.webp",
  "/assets-2025/images/tour/ground/ground-04-raw.jpg",
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
} as const;

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  HeartPulse: AIHealthIcon,
  Sparkles: WellnessSpaIcon,
  Users: CommunityNodesIcon,
  UtensilsCrossed: OrganicKitchenIcon,
  Cpu: SmartLivingIcon,
  Gamepad2,
};

const VIDEO_BREAK_AFTER = 3; // Insert VideoBreak after the 3rd category

/** Maps each amenity category to a blurred background image */
const CATEGORY_BG: Record<string, string> = {
  Healthcare: "/assets-2025/images/amenities/mm-care-resident.webp",
  Wellness: "/assets-2025/images/amenities/ayurveda-spa.webp",
  Community: "/assets-2025/images/amenities/mm-poolside-community.webp",
  Dining: "/assets-2025/images/amenities/mm-chef-dining.webp",
  "Smart Living": "/assets-2025/images/invest/smart-home.webp",
  Recreation: "/assets-2025/images/amenities/mm-amphitheatre.webp",
};

export default function AmenitiesPageClient() {
  const revealRef = useGsapReveal("[data-gsap-category]", {
    y: 60,
    stagger: 0.2,
    duration: 0.8,
    start: "top 80%",
  });

  const firstHalf = AMENITIES.slice(0, VIDEO_BREAK_AFTER);
  const secondHalf = AMENITIES.slice(VIDEO_BREAK_AFTER);

  return (
    <PageTransition>
    <main id="main-content" ref={revealRef as React.RefObject<HTMLElement>}>
      {/* Slideshow Hero */}
      <ImageSlideshow
        images={AMENITIES_HERO_IMAGES}
        interval={5000}
        watermarkText="AMENITIES"
      >
        <Container size="lg" className="pb-20 pt-40">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 text-sm text-white/70"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight className="size-4" />
            <span className="font-medium text-white">Amenities</span>
          </nav>

          <SectionHeading
            badge="Everything You Need"
            title="World-Class Amenities"
            subtitle="From AI health monitoring to Ayurvedic wellness and smart home automation — every amenity is designed for comfort, safety, and joy."
            onHero
          />
        </Container>
      </ImageSlideshow>

      {/* First half of amenity categories */}
      {firstHalf.map((category, idx) => (
        <CategorySection
          key={category.category}
          category={category}
          idx={idx}
          backgroundImage={CATEGORY_BG[category.category]}
        />
      ))}

      {/* Video Break */}
      <VideoBreak
        videoSrc="/assets-2025/videos/villa-showcase.mp4"
        watermarkText="SANCTUARY"
      />

      {/* Second half of amenity categories */}
      {secondHalf.map((category, idx) => (
        <CategorySection
          key={category.category}
          category={category}
          idx={idx + VIDEO_BREAK_AFTER}
          backgroundImage={CATEGORY_BG[category.category]}
        />
      ))}

      {/* CTA */}
      <section className="py-16">
        <Container size="md">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-border-accent bg-surface p-12 text-center"
          >
            <h2 className="font-heading mb-4 text-3xl font-bold text-text-primary">
              Experience Our Amenities
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-text-secondary">
              See everything Mater Maria has to offer. Request a virtual
              presentation and explore our amenities from anywhere.
            </p>
            <Button
              asChild
              className="bg-accent-default text-text-inverse hover:bg-accent-dark transition-all duration-300 hover:shadow-lg hover:shadow-accent-default/20"
              size="lg"
            >
              <Link href="/contact">
                Enquire Now <ArrowRight className="size-4" />
              </Link>
            </Button>
          </MotionDiv>
        </Container>
      </section>
    </main>
    </PageTransition>
  );
}

/* ------------------------------------------------------------------ */
/*  Category Section (extracted for clarity)                           */
/* ------------------------------------------------------------------ */

interface CategorySectionProps {
  category: (typeof AMENITIES)[number];
  idx: number;
  backgroundImage?: string;
}

function CategorySection({ category, idx, backgroundImage }: CategorySectionProps) {
  const IconComp = ICON_MAP[category.icon];
  const description = AMENITY_DESCRIPTIONS[category.category] ?? "";

  return (
    <section
      data-gsap-category
      className={`relative overflow-hidden py-16 ${idx % 2 !== 0 ? "bg-surface/50" : ""}`}
    >
      {/* Blurred background image — low opacity, no overlay needed */}
      {backgroundImage && (
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backgroundImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: 0.08, filter: "blur(4px)", transform: "scale(1.06)" }}
          />
        </div>
      )}
      <Container size="lg" className="relative z-10">
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="grid items-start gap-12 md:grid-cols-2"
        >
          {/* Left: Heading + description */}
          <div className={idx % 2 !== 0 ? "md:order-2" : ""}>
            <div className="mb-4 flex items-center gap-3">
              {IconComp && (
                <div className="flex size-12 items-center justify-center rounded-xl bg-accent-default/10">
                  <IconComp className="size-6 text-accent-default" />
                </div>
              )}
              <h2 className="font-heading text-2xl font-bold text-text-primary">
                {category.category}
              </h2>
            </div>
            <p className="mb-6 leading-relaxed text-text-secondary">
              {description}
            </p>
          </div>

          {/* Right: Items grid */}
          <MotionDiv
            className={`grid grid-cols-2 gap-4 ${idx % 2 !== 0 ? "md:order-1" : ""}`}
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {category.items.map((item) => (
              <MotionDiv
                key={item}
                variants={fadeUp}
                transition={{ duration: 0.4 }}
                className="group/item flex items-start gap-3 rounded-lg border border-border-default bg-surface p-4 transition-all duration-300 hover:border-accent-default/30 hover:bg-accent-default/5 hover:-translate-y-0.5"
              >
                <Check className="mt-0.5 size-5 shrink-0 text-accent-default transition-transform duration-200 group-hover/item:scale-110" />
                <span className="text-sm font-medium text-text-primary">
                  {item}
                </span>
              </MotionDiv>
            ))}
          </MotionDiv>
        </MotionDiv>
      </Container>
    </section>
  );
}
