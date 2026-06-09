"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";

export function StickyInvestCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("cta-dismissed") === "1";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hero = document.getElementById("estate-hero");
    const leadCapture = document.getElementById("lead-capture");

    let heroOut = false;
    let leadIn = false;

    const heroObs = new IntersectionObserver(
      ([entry]) => {
        heroOut = !entry!.isIntersecting;
        setVisible(heroOut && !leadIn);
      },
      { threshold: 0.1 },
    );

    const leadObs = new IntersectionObserver(
      ([entry]) => {
        leadIn = entry!.isIntersecting;
        setVisible(heroOut && !leadIn);
      },
      { threshold: 0.2 },
    );

    if (hero) heroObs.observe(hero);
    if (leadCapture) leadObs.observe(leadCapture);

    return () => {
      heroObs.disconnect();
      leadObs.disconnect();
    };
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
    sessionStorage.setItem("cta-dismissed", "1");
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-border-accent bg-surface/95 backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-heading font-bold text-accent-default">
                Platinum
              </span>
              <span className="text-text-muted">·</span>
              <span className="font-medium text-text-primary">₹30L</span>
              <span className="text-text-muted">·</span>
              <span className="text-text-secondary">153% returns</span>
            </div>
            <div className="flex items-center gap-2">
              <a href="#lead-capture">
                <motion.div whileTap={{ scale: 0.97 }}>
                  <ShimmerButton className="text-xs px-4 py-2">
                    Invest Now <ArrowRight className="size-3.5" />
                  </ShimmerButton>
                </motion.div>
              </a>
              <button
                onClick={handleDismiss}
                className="flex size-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:text-text-primary"
                aria-label="Dismiss"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
