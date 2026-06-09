"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MESSAGES = [
  { name: "Rajeev", location: "Dubai", action: "booked a site visit" },
  { name: "Thomas", location: "Kuwait", action: "downloaded the investment brochure" },
  { name: "Mary", location: "Kochi", action: "requested a callback" },
  { name: "George", location: "Bahrain", action: "invested in Gold tier" },
  { name: "Suma", location: "Bangalore", action: "scheduled a virtual tour" },
  { name: "Joseph", location: "Abu Dhabi", action: "enquired about Platinum tier" },
];

export function SocialProofToast() {
  const [current, setCurrent] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const showNext = useCallback(() => {
    if (dismissed) return;
    const idx = Math.floor(Math.random() * MESSAGES.length);
    setCurrent(idx);
    // Auto-dismiss after 4 seconds
    setTimeout(() => setCurrent(null), 4000);
  }, [dismissed]);

  useEffect(() => {
    // First toast after 15 seconds
    const initial = setTimeout(showNext, 15000);
    // Repeat every 35 seconds
    const interval = setInterval(showNext, 35000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [showNext]);

  if (dismissed) return null;

  const msg = current !== null ? MESSAGES[current] : null;

  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-6 z-40 max-w-xs rounded-xl border border-border-subtle bg-bg-surface/95 p-4 shadow-lg backdrop-blur-md"
        >
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-2 top-1 text-xs text-text-muted hover:text-text-primary"
            aria-label="Dismiss notifications"
          >
            &times;
          </button>
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/90 p-1">
              <img
                src="/assets-2025/images/mater-maria-logo.svg"
                alt="Mater Maria"
                className="h-8 w-8 object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">
                {msg.name} from {msg.location}
              </p>
              <p className="text-xs text-text-muted">
                just {msg.action}
              </p>
              <p className="mt-1 text-[10px] text-text-muted/60">
                {Math.floor(Math.random() * 5) + 1} minutes ago
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
