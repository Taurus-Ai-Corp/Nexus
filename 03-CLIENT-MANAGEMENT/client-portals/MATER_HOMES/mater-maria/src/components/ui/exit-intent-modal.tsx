"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download } from "lucide-react";

export function ExitIntentModal() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    // Only trigger when mouse moves toward top of viewport (tab bar)
    if (e.clientY <= 5 && !show) {
      // Check session storage to show only once
      const dismissed = sessionStorage.getItem("exit-intent-dismissed");
      if (!dismissed) {
        setShow(true);
      }
    }
  }, [show]);

  useEffect(() => {
    // Only on desktop
    if (window.innerWidth < 768) return;
    // Delay activation by 5 seconds
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 5000);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseLeave]);

  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem("exit-intent-dismissed", "true");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    sessionStorage.setItem("exit-intent-dismissed", "true");
    // TODO: Send to Firebase/Supabase
    setTimeout(() => setShow(false), 2000);
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border-subtle bg-bg-surface p-8 shadow-2xl"
          >
            <button
              onClick={handleDismiss}
              className="absolute right-4 top-4 text-text-muted transition-colors hover:text-text-primary"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>

            {!submitted ? (
              <>
                <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-accent-default/10">
                  <Download className="size-6 text-accent-default" />
                </div>
                <h3 className="mb-2 font-heading text-xl font-bold text-text-primary">
                  Before you go...
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-text-secondary">
                  Download our detailed investment brochure with floor plans,
                  pricing, and projected returns for all villa tiers.
                </p>
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 rounded-lg border border-border-default bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted input-gold-focus"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-lg bg-accent-default/90 px-5 py-2.5 text-sm font-semibold text-text-inverse transition-colors hover:bg-accent-default"
                  >
                    Send
                  </button>
                </form>
                <p className="mt-3 text-[10px] text-text-muted">
                  No spam. Unsubscribe anytime.
                </p>
              </>
            ) : (
              <div className="py-4 text-center">
                <p className="text-lg font-medium text-accent-default">
                  Check your inbox!
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  The brochure is on its way.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
