"use client";

import { TestimonialsCard } from "@/components/ui/testimonials-card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const TESTIMONIAL_ITEMS = [
  {
    id: 1,
    title: "George Thomas — NRI from Dubai",
    description:
      '"Finally, a place in Kerala where I know my parents are truly cared for. The community feel and healthcare support give me complete peace of mind."',
    image: "/assets-2025/images/lifestyle/elder-couple-nurse.webp",
  },
  {
    id: 2,
    title: "Mary Kurian — Resident since 2025",
    description:
      '"Moving here was the best decision. The chapel, the gardens, the people — it feels like home, but with the care I need."',
    image: "/assets-2025/images/lifestyle/family-tea-moment.webp",
  },
  {
    id: 3,
    title: "Dr. Rajan Mathew — NRI from London",
    description:
      '"The medical facilities and the attention to detail impressed us. My mother has never been happier."',
    image: "/assets-2025/images/lifestyle/whatsapp-estate.webp",
  },
  {
    id: 4,
    title: "Leela Abraham — Resident since 2024",
    description:
      '"I love the Ayurvedic spa and the organic garden. Every day here is a blessing."',
    image: "/assets-2025/images/lifestyle/family-new045.webp",
  },
];

export function Testimonials() {
  return (
    <section className="bg-surface py-24 lg:py-32">
      <Container size="lg">
        <SectionHeading
          badge="Stories"
          title="Hear From Our Community"
          subtitle="Real families. Real moments. Real peace of mind."
        />

        <TestimonialsCard
          items={TESTIMONIAL_ITEMS}
          width={900}
          autoPlay
          autoPlayInterval={5000}
          showCounter
          showNavigation
          className="mt-8"
        />
      </Container>
    </section>
  );
}
