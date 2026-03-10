"use client";

import { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { Container } from "@/components/ui/container";
import { PROPERTY_SHOWCASE } from "@/lib/investor-constants";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

export function PropertyShowcase() {
  return (
    <SectionWatermark className="py-20 lg:py-28">
      <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-2 font-heading text-sm font-medium uppercase tracking-[0.2em] text-accent-default">
            What Awaits You
          </p>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl text-gold-gradient">
            Swipe Through Paradise
          </h2>
        </motion.div>
      </Container>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Swiper
          modules={[EffectCoverflow, Autoplay, Pagination]}
          effect="coverflow"
          grabCursor
          centeredSlides
          loop
          slidesPerView="auto"
          coverflowEffect={{
            rotate: 25,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: true,
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet !bg-accent-default/40 !w-2 !h-2",
            bulletActiveClass: "!bg-accent-default !scale-150",
          }}
          className="!pb-14"
          breakpoints={{
            0: { slidesPerView: 1.2 },
            640: { slidesPerView: 1.8 },
            1024: { slidesPerView: 2.5 },
            1400: { slidesPerView: 3 },
          }}
        >
          {PROPERTY_SHOWCASE.map((item) => (
            <SwiperSlide
              key={item.id}
              className="!w-[320px] sm:!w-[380px] lg:!w-[400px]"
            >
              <div className="group relative aspect-[5/7] overflow-hidden rounded-2xl border border-border-default">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 320px, (max-width: 1024px) 380px, 400px"
                />

                {/* Glassmorphism overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-16">
                  <h3 className="mb-1 font-heading text-lg font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/70">{item.description}</p>
                </div>

                {/* Glare effect on hover */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </SectionWatermark>
  );
}
