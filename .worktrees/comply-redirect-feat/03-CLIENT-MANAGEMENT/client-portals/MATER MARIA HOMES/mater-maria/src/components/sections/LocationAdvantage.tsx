"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Plane, Train, Heart, Thermometer, Droplets, Mountain } from "lucide-react";
import { Container } from "@/components/ui/container";

/* ── Distance data ───────────────────────────────────────── */
const DISTANCES = [
  { label: "MMT Medical College", km: "10", icon: Heart, color: "#e05a5a" },
  { label: "Kanjirappally Town", km: "12", icon: MapPin, color: "#C9A84C" },
  { label: "Kottayam City", km: "35", icon: Train, color: "#5b8dee" },
  { label: "Cochin International Airport", km: "80", icon: Plane, color: "#5b8dee" },
  { label: "Munnar Hill Station", km: "45", icon: Mountain, color: "#4caf7a" },
];

const CLIMATE = [
  { label: "Temperature", value: "22–32°C", icon: Thermometer },
  { label: "Annual Rainfall", value: "2,800 mm", icon: Droplets },
  { label: "Altitude", value: "~550 m", icon: Mountain },
];

/* ── Animation variants ─────────────────────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

export function LocationAdvantage() {
  return (
    <section className="relative overflow-hidden py-0">
      {/* ── Aerial banner ─────────────────────────────── */}
      <div className="relative h-[38vh] min-h-[260px] w-full overflow-hidden">
        <Image
          src="/assets-2025/images/tour/aerial/flux-aerial-01.webp"
          alt="Aerial view of Kanjirappally, Kerala"
          fill
          className="object-cover object-center"
          quality={85}
        />
        {/* gradient veil */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-bg-base" />

        {/* Centred label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
            <MapPin className="size-3" /> Elangulam, Kanjirappally
          </span>
          <h2
            className="font-heading text-4xl font-bold text-white sm:text-5xl md:text-6xl"
            style={{ textShadow: "0 2px 30px rgba(0,0,0,0.6)", letterSpacing: "-0.02em" }}
          >
            The Kanjirappally Advantage
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
            Nestled in the foothills of the Western Ghats — where nature, serenity, and world-class care converge.
          </p>
        </div>
      </div>

      {/* ── Main bento grid ───────────────────────────── */}
      <div className="bg-bg-base py-16">
        <Container size="lg">
          <div className="grid gap-6 lg:grid-cols-3">

            {/* ── Left: Estate photo + pin ─────────────── */}
            <motion.div
              className="relative overflow-hidden rounded-2xl"
              style={{ minHeight: "440px" }}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7 }}
            >
              <Image
                src="/assets-2025/images/lifestyle/NBMBBG_MMH_001.webp"
                alt="Mater Maria Estate Grounds"
                fill
                className="object-cover"
              />
              {/* Dark veil */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Pin badge */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                  className="relative"
                >
                  <div className="size-10 rounded-full border-2 border-[#C9A84C] bg-[#C9A84C]/20 backdrop-blur-sm flex items-center justify-center">
                    <MapPin className="size-4 text-[#C9A84C]" />
                  </div>
                  {/* Ripple */}
                  <div className="absolute inset-0 rounded-full border border-[#C9A84C]/40 animate-ping" />
                </motion.div>
              </div>

              {/* Bottom overlay card */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-heading text-xl font-bold text-white">Mater Maria Sanctuary</p>
                <p className="mt-1 text-sm text-white/60">Elangulam, Kanjirappally · 686507</p>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {["100% Solar", "Net-Zero", "8+ Acres"].map((tag) => (
                    <span key={tag} className="rounded-full border border-[#C9A84C]/40 bg-[#C9A84C]/10 px-3 py-0.5 text-xs text-[#C9A84C]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ── Center: Distances ────────────────────── */}
            <motion.div
              className="flex flex-col gap-4"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              <div className="rounded-2xl border border-border-default bg-surface p-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                  Proximity
                </p>

                <div className="flex flex-col gap-3">
                  {DISTANCES.map((d, i) => (
                    <motion.div
                      key={d.label}
                      variants={fadeUp}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      className="flex items-center gap-4"
                    >
                      {/* Icon */}
                      <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-full"
                        style={{ background: `${d.color}18`, color: d.color }}
                      >
                        <d.icon className="size-4" />
                      </div>

                      {/* Label */}
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-text-primary">{d.label}</p>
                        {/* Distance bar */}
                        <div className="mt-1.5 h-1 w-full rounded-full bg-border-default overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: d.color }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${Math.min((parseInt(d.km) / 100) * 100, 90)}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 + i * 0.06 }}
                          />
                        </div>
                      </div>

                      {/* KM badge */}
                      <span
                        className="shrink-0 text-sm font-bold tabular-nums"
                        style={{ color: d.color }}
                      >
                        {d.km} km
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Climate strip */}
              <div className="rounded-2xl border border-border-default bg-surface p-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                  Climate
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {CLIMATE.map((c) => (
                    <div key={c.label} className="flex flex-col items-center gap-1 text-center">
                      <div className="flex size-8 items-center justify-center rounded-full bg-accent-default/10">
                        <c.icon className="size-4 text-accent-default" />
                      </div>
                      <span className="text-sm font-bold text-text-primary">{c.value}</span>
                      <span className="text-[10px] uppercase tracking-wide text-text-muted">{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ── Right: 3 lifestyle photos ─────────────── */}
            <motion.div
              className="flex flex-col gap-4"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7 }}
            >
              {[
                { src: "/assets-2025/images/lifestyle/family-tea-moment.webp", label: "Tropical Greenery & Spice Estates" },
                { src: "/assets-2025/images/lifestyle/elder-couple-nurse.webp", label: "10 km to Medical College Hospital" },
                { src: "/assets-2025/images/tour/aerial/flux-aerial-02.webp", label: "Pleasant Hill Climate Year-Round" },
              ].map((img, i) => (
                <motion.div
                  key={img.label}
                  className="relative overflow-hidden rounded-xl"
                  style={{ height: "130px" }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Image src={img.src} alt={img.label} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <p className="absolute bottom-3 left-3 text-xs font-medium text-white">{img.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── Connectivity strip ────────────────────────── */}
          <motion.div
            className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            {[
              { icon: "🛣️", title: "NH-183 Highway", desc: "Direct road access to Kottayam & Kochi" },
              { icon: "🚂", title: "Railway Station", desc: "Kanjirappally station — 12 km" },
              { icon: "⛪", title: "Spiritual Heritage", desc: "Diocese of Palai spiritual surroundings" },
              { icon: "🌿", title: "Western Ghats", desc: "UNESCO Biosphere — pristine air & green" },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                transition={{ duration: 0.4 }}
                className="rounded-xl border border-border-default bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent-default/30 hover:shadow-lg"
              >
                <span className="text-2xl">{item.icon}</span>
                <p className="mt-3 font-heading text-sm font-semibold text-text-primary">{item.title}</p>
                <p className="mt-1 text-xs text-text-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </div>
    </section>
  );
}
