"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import NumberFlow from "@number-flow/react";
import SlotCounter from "react-slot-counter";
import {
  TrendingUp,
  Percent,
} from "lucide-react";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { Container } from "@/components/ui/container";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { INVESTOR_PROMISES } from "@/lib/investor-constants";
import {
  IoTSensorIcon,
  SolarLeafIcon,
  AIHealthIcon,
  SmartLivingIcon,
} from "@/components/icons/estate-icons";
import { useGsapReveal } from "@/hooks/useGsapReveal";

const ICON_MAP = {
  Shield: IoTSensorIcon,
  TrendingUp,
  Percent,
  Leaf: SolarLeafIcon,
  HeartPulse: AIHealthIcon,
  Cpu: SmartLivingIcon,
} as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export function InvestorPromise() {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const gsapRef = useGsapReveal(".promise-item-anim", { y: 60, stagger: 0.1 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsInView(true);
      },
      { threshold: 0.3 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <SectionWatermark ref={gsapRef as React.RefObject<HTMLElement>} className="py-20 lg:py-28">
      <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="mb-2 font-heading text-sm font-medium uppercase tracking-[0.2em] text-accent-default">
            Why Invest
          </p>
          <h2 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl text-gold-gradient">
            Why Invest in Mater Maria
          </h2>
        </motion.div>

        <motion.div
          ref={sectionRef}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-4 sm:grid-cols-12"
        >
          {INVESTOR_PROMISES.map((item, i) => {
            const Icon = ICON_MAP[item.icon];
            const colSpan =
              item.span === "large"
                ? "sm:col-span-7"
                : item.span === "medium"
                  ? "sm:col-span-6"
                  : "sm:col-span-5";

            // Multi-offset: alternate cards get slight vertical shift
            const offset = i % 2 === 1 ? "sm:translate-y-4" : "";

            return (
              <motion.div
                key={item.title}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 15px rgba(212,175,55,0.1)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.5 }}
                className={`promise-item-anim ${colSpan} ${offset}`}
              >
                <CardSpotlight className="h-full p-6 lg:p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-accent-default/10">
                      <Icon className="size-5 text-accent-default" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-text-primary">
                      {item.title}
                    </h3>
                  </div>

                  {item.stat && (
                    <div className="mb-3">
                      {item.stat.type === "number-flow" ? (
                        <span className="font-heading text-4xl font-bold text-accent-default lg:text-5xl">
                          <NumberFlow
                            value={isInView ? item.stat.value : 0}
                            format={{ useGrouping: false }}
                            transformTiming={{
                              duration: 1500,
                              easing: "ease-out",
                            }}
                          />
                          {item.stat.suffix}
                        </span>
                      ) : (
                        <span className="font-heading text-4xl font-bold text-accent-default lg:text-5xl">
                          <SlotCounter
                            startValue={0}
                            value={isInView ? item.stat.value : 0}
                            autoAnimationStart={false}
                            duration={1.5}
                          />
                          {item.stat.suffix}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-sm leading-relaxed text-text-secondary">
                    {item.description}
                  </p>
                </CardSpotlight>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </SectionWatermark>
  );
}
