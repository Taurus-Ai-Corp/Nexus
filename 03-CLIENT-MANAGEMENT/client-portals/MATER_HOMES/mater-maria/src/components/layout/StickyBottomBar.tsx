"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Calendar, Download } from "lucide-react";

export function StickyBottomBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past 60vh
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-border-subtle bg-bg-surface/90 backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
            <span className="hidden text-sm font-medium text-text-secondary sm:block">
              Discover your sanctuary
            </span>
            <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
              <a
                href="tel:+919656463073"
                className="inline-flex items-center gap-2 rounded-full border border-border-subtle px-4 py-2 text-xs font-medium text-text-primary transition-colors hover:border-accent-default/40 hover:bg-accent-default/5"
              >
                <Phone className="size-3.5" />
                <span className="hidden sm:inline">Call Now</span>
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border-subtle px-4 py-2 text-xs font-medium text-text-primary transition-colors hover:border-accent-default/40 hover:bg-accent-default/5"
              >
                <Calendar className="size-3.5" />
                <span className="hidden sm:inline">Schedule Visit</span>
              </a>
              <a
                href="/invest"
                className="inline-flex items-center gap-2 rounded-full border border-accent-default/30 bg-accent-default/10 px-4 py-2 text-xs font-semibold text-accent-light transition-all hover:border-accent-default/60 hover:bg-accent-default/20 hover:shadow-glow"
              >
                <Download className="size-3.5" />
                Invest Now
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
