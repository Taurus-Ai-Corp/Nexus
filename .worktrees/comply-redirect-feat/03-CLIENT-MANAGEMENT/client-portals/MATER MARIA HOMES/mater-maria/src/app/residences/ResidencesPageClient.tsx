"use client";

import Link from "next/link";
import {
  BedDouble,
  Bath,
  Maximize,
  ChevronRight,
  Check,
  X,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { GlowCard } from "@/components/ui/glow-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageSlideshow } from "@/components/ui/image-slideshow";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { PageTransition } from "@/components/ui/page-transition";
import { VideoBreak } from "@/components/ui/video-break";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { RESIDENCES } from "@/lib/constants";

const RESIDENCES_HERO_IMAGES = [
  "/assets-2025/images/tour/ground/flux-ground-01.webp",
  "/assets-2025/images/tour/aerial/flux-aerial-02.webp",
  "/assets-2025/images/tour/aerial/flux-aerial-03.webp",
  "/assets-2025/images/tour/aerial/flux-aerial-01.webp",
  "/assets-2025/images/tour/ground/ground-04-raw.jpg",
];

const STANDARD_INCLUSIONS = [
  "Modular kitchen with premium fittings",
  "Premium vitrified tile flooring",
  "Smart home control panel",
  "Emergency call system in every room",
  "Private balcony with garden view",
  "Anti-skid flooring in bathrooms",
];

const COMPARISON = [
  { feature: "Living Area", studio: "650 sq.ft", harmony: "950 sq.ft", villa: "1,350 sq.ft" },
  { feature: "Bedrooms", studio: "Studio", harmony: "1 BHK", villa: "2 BHK" },
  { feature: "Bathrooms", studio: "1", harmony: "1", villa: "2" },
  { feature: "Balcony", studio: true, harmony: true, villa: true },
  { feature: "Private Garden", studio: false, harmony: false, villa: true },
  { feature: "Modular Kitchen", studio: true, harmony: true, villa: true },
  { feature: "Smart Home Panel", studio: true, harmony: true, villa: true },
  { feature: "Separate Living Area", studio: false, harmony: true, villa: true },
  { feature: "Guest Room", studio: false, harmony: false, villa: true },
  { feature: "Starting Price", studio: "Contact Us", harmony: "Contact Us", villa: "Contact Us" },
];

function BoolOrText({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm text-text-primary">{value}</span>;
  }
  return value ? (
    <Check className="mx-auto size-5 text-green-500" />
  ) : (
    <X className="mx-auto size-5 text-text-muted" />
  );
}

export default function ResidencesPageClient() {
  const cardsRef = useGsapReveal("[data-reveal-card]", {
    y: 60,
    stagger: 0.2,
    duration: 0.8,
  });

  const tableRef = useGsapReveal("[data-reveal-row]", {
    y: 30,
    stagger: 0.06,
    duration: 0.5,
    start: "top 80%",
  });

  const ctaRef = useGsapReveal("[data-reveal-cta]", {
    y: 40,
    duration: 0.8,
  });

  return (
    <PageTransition>
    <main id="main-content" className="pb-24">
      {/* Hero with image slideshow */}
      <ImageSlideshow
        images={RESIDENCES_HERO_IMAGES}
        interval={5000}
        watermarkText="RESIDENCES"
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
            <span className="font-medium text-white">Residences</span>
          </nav>

          <SectionHeading
            badge="Our Homes"
            title="Choose Your Perfect Residence"
            subtitle="Each residence is thoughtfully designed for comfort, safety, and independence — with the warmth of a true home."
            onHero
          />
        </Container>
      </ImageSlideshow>

      {/* Residence Cards */}
      <section ref={cardsRef as React.RefObject<HTMLElement>} className="py-16">
        <Container size="lg">
          <div className="grid gap-10 lg:grid-cols-3">
            {RESIDENCES.map((r) => (
              <div key={r.name} data-reveal-card>
                <GlowCard className="flex h-full flex-col">
                  {/* Residence image */}
                  <div className="mb-6 overflow-hidden rounded-lg">
                    <img
                      src={r.image}
                      alt={r.name}
                      loading="lazy"
                      className="aspect-video w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>

                  {/* Header */}
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-heading text-xl font-bold text-text-primary">
                      {r.name}
                    </h3>
                    <Badge className="bg-accent-default/15 text-accent-default border-accent-default/30">
                      {r.tag}
                    </Badge>
                  </div>

                  {/* Specs */}
                  <div className="mb-4 grid grid-cols-3 gap-4 rounded-lg border border-border-default bg-bg-base p-4">
                    <div className="text-center">
                      <Maximize className="mx-auto mb-1 size-4 text-text-muted" />
                      <p className="text-sm font-semibold text-text-primary">
                        {r.sqft} sq.ft
                      </p>
                    </div>
                    <div className="text-center">
                      <BedDouble className="mx-auto mb-1 size-4 text-text-muted" />
                      <p className="text-sm font-semibold text-text-primary">
                        {r.bedrooms}
                      </p>
                    </div>
                    <div className="text-center">
                      <Bath className="mx-auto mb-1 size-4 text-text-muted" />
                      <p className="text-sm font-semibold text-text-primary">
                        {r.bathrooms} Bath
                      </p>
                    </div>
                  </div>

                  <p className="mb-6 text-text-secondary">{r.description}</p>

                  {/* Inclusions */}
                  <div className="mb-6">
                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
                      Standard Inclusions
                    </h4>
                    <ul className="space-y-2">
                      {STANDARD_INCLUSIONS.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-text-secondary"
                        >
                          <Check className="mt-0.5 size-4 shrink-0 text-accent-default" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto">
                    <Button className="w-full bg-accent-default text-text-inverse hover:bg-accent-dark">
                      View Floor Plan <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </GlowCard>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Video Break between cards and comparison */}
      <VideoBreak
        videoSrc="/assets-2025/videos/sanctuary-living.mp4"
        watermarkText="LIVING REFINED"
      />

      {/* Comparison Table */}
      <section ref={tableRef as React.RefObject<HTMLElement>} className="py-16">
        <Container size="lg">
          <SectionHeading badge="Compare" title="Side-by-Side Comparison" />

          <div className="overflow-x-auto rounded-xl border border-border-default">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="border-b border-border-default bg-surface">
                  <th className="px-6 py-4 text-sm font-semibold text-text-primary">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-text-primary">
                    Walk-up Villa
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-accent-default">
                    Executive Suite
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-text-primary">
                    Independent Villa
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr
                    key={row.feature}
                    data-reveal-row
                    className={`border-b border-border-subtle ${
                      i % 2 === 0 ? "bg-transparent" : "bg-surface/50"
                    }`}
                  >
                    <td className="px-6 py-3 text-sm font-medium text-text-primary">
                      {row.feature}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <BoolOrText value={row.studio} />
                    </td>
                    <td className="px-6 py-3 text-center">
                      <BoolOrText value={row.harmony} />
                    </td>
                    <td className="px-6 py-3 text-center">
                      <BoolOrText value={row.villa} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section ref={ctaRef as React.RefObject<HTMLElement>} className="py-16">
        <Container size="md">
          <ScrollReveal variant="blur-in">
            <div
              data-reveal-cta
              className="rounded-2xl border border-border-accent bg-surface p-12 text-center"
            >
              <h2 className="font-heading mb-4 text-3xl font-bold text-text-primary">
                Find Your Perfect Home
              </h2>
              <p className="mx-auto mb-8 max-w-lg text-text-secondary">
                Schedule a personal tour of our residences and discover the
                perfect space for your next chapter.
              </p>
              <Button
                asChild
                className="bg-accent-default text-text-inverse hover:bg-accent-dark transition-all duration-300 hover:shadow-lg hover:shadow-accent-default/20"
                size="lg"
              >
                <Link href="/contact">
                  Schedule a Visit <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </main>
    </PageTransition>
  );
}
