"use client";

import { BillboardMockup } from "@/components/ui/billboard-mockup";
import { PosterMockup } from "@/components/ui/poster-mockup";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export function MockupsShowcase() {
  return (
    <section
      className="overflow-hidden py-24 lg:py-32"
      style={{ background: "linear-gradient(160deg, #e8f0f8 0%, #dbe6f0 40%, #e4ddd0 100%)" }}
    >
      <Container size="lg">
        <SectionHeading
          badge="Brand Presence"
          title="Everywhere You Look"
          subtitle="From Kerala's highways to your inbox — Mater Maria makes a statement."
        />

        <div className="mt-16 flex flex-col items-center gap-24 lg:flex-row lg:items-start lg:justify-center lg:gap-16">
          {/* Billboard */}
          <div className="flex flex-col items-center gap-4">
            <BillboardMockup />
            <p className="text-center text-sm font-medium uppercase tracking-widest text-text-muted">
              Highway Billboard
            </p>
          </div>

          {/* Poster */}
          <div className="flex flex-col items-center gap-4">
            <PosterMockup />
            <p className="text-center text-sm font-medium uppercase tracking-widest text-text-muted">
              A3 Presentation Poster
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
