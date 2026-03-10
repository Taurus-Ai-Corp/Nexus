"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { Container } from "@/components/ui/container";
import { GhostWord } from "@/components/ui/ghost-word";
import {
  TRUST_ITEMS,
  LEADERSHIP,
  ADVISORY_BOARD,
  VISION,
  COUNTRY_COORDINATORS,
} from "@/lib/investor-constants";
import {
  IoTSensorIcon,
  SmartLivingIcon,
  CommunityNodesIcon,
  AIHealthIcon,
} from "@/components/icons/estate-icons";
import { BadgeCheck } from "lucide-react";
import { useGsapReveal } from "@/hooks/useGsapReveal";

const ICON_MAP = {
  Shield: IoTSensorIcon,
  Cpu: SmartLivingIcon,
  Users: CommunityNodesIcon,
  BadgeCheck,
  HeartPulse: AIHealthIcon,
} as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function TrustGovernance() {
  const sectionRef = useGsapReveal(".trust-item-anim", { y: 40, stagger: 0.1 });

  return (
    <SectionWatermark ref={sectionRef as React.RefObject<HTMLElement>} className="relative overflow-hidden py-20 lg:py-28">
      <GhostWord word="Trust" top="45%" />

      <Container size="lg" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="mb-2 font-heading text-sm font-medium uppercase tracking-[0.2em] text-accent-default">
            Trust & Governance
          </p>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl text-gold-gradient">
            Built on Innovation, Governed with Integrity
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-text-secondary">
            A proud initiative of the Pravasi Apostolate of the Diocese of
            Kanjirappally — operating under a Dual-Covenant of executive
            excellence and pastoral care.
          </p>
        </motion.div>

        {/* Trust Badges Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="trust-item-anim mb-16 overflow-hidden rounded-xl border border-border-default bg-surface/80 backdrop-blur-sm py-5"
        >
          <div
            className="flex w-max gap-12"
            style={{ animation: "marquee 25s linear infinite" }}
          >
            {[...TRUST_ITEMS, ...TRUST_ITEMS].map((item, i) => {
              const Icon = ICON_MAP[item.icon];
              return (
                <div
                  key={`${item.label}-${i}`}
                  className="flex shrink-0 items-center gap-2.5"
                >
                  <Icon className="size-5 text-accent-default" />
                  <span className="whitespace-nowrap text-sm font-medium text-text-primary">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Advisory Board — Spiritual Patrons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="trust-item-anim mb-14"
        >
          <h3 className="mb-6 text-center font-heading text-lg font-bold text-text-primary">
            Advisory Board
          </h3>
          <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-8">
            {ADVISORY_BOARD.map((member) => (
              <div key={member.name} className="text-center">
                <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full border border-accent-default/30 bg-gradient-to-br from-accent-default/15 to-accent-default/5">
                  <span className="font-heading text-lg font-bold text-accent-default">
                    {member.name.split(" ").slice(-1)[0]?.[0] ?? ""}
                  </span>
                </div>
                <p className="font-heading text-sm font-bold text-text-primary">
                  {member.name}
                </p>
                <p className="text-xs text-accent-default">{member.role}</p>
                <p className="text-xs text-text-muted">{member.org}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Board of Directors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="trust-item-anim mb-14"
        >
          <h3 className="mb-8 text-center font-heading text-lg font-bold text-text-primary">
            Board of Directors
          </h3>
          <motion.div
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {LEADERSHIP.map((leader) => (
              <motion.div
                key={leader.name}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="rounded-xl border border-border-default bg-surface/80 p-5 backdrop-blur-sm transition-all duration-300 hover:border-border-accent hover:shadow-[var(--shadow-gold)]"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-accent-default/30 bg-gradient-to-br from-accent-default/20 to-accent-default/5">
                    <span className="font-heading text-sm font-bold text-accent-default">
                      {leader.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-heading text-sm font-bold text-text-primary">
                      {leader.name}
                    </p>
                    <p className="text-xs text-accent-default">{leader.role}</p>
                  </div>
                </div>
                {"credentials" in leader && (
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-text-muted">
                    {leader.credentials}
                  </p>
                )}
                {"bio" in leader && (
                  <p className="text-xs leading-relaxed text-text-secondary">
                    {leader.bio}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Vision Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="trust-item-anim mx-auto mb-14 max-w-2xl text-center"
        >
          <motion.div
            className="relative rounded-2xl border border-border-accent/30 bg-surface/80 p-8 backdrop-blur-sm lg:p-12"
            whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.2), 0 0 20px rgba(212,175,55,0.1)" }}
            transition={{ duration: 0.3 }}
          >
            <Quote className="mx-auto mb-4 size-8 text-accent-default/30" />
            <p className="mb-4 font-heading text-lg italic leading-relaxed text-text-primary lg:text-xl">
              &ldquo;{VISION}&rdquo;
            </p>
            <p className="text-sm font-medium text-accent-default">
              — Mater Maria Vision
            </p>
          </motion.div>
        </motion.div>

        {/* Country Coordinators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="trust-item-anim text-center"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
            Country Coordinators
          </p>
          <p className="text-sm text-text-secondary">
            {COUNTRY_COORDINATORS.join(" · ")}
          </p>
        </motion.div>
      </Container>
    </SectionWatermark>
  );
}
