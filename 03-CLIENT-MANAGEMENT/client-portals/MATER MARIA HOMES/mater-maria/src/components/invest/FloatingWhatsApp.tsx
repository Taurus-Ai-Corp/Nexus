"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/919447080356?text=Hi%20Rajeev%2C%20I%27m%20interested%20in%20investing%20in%20Mater%20Maria%20Homes.%20Please%20share%20details.";

export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const target = document.getElementById("lead-capture");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry!.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full shadow-lg transition-shadow hover:shadow-xl"
          style={{ backgroundColor: "#25D366" }}
          aria-label="Chat on WhatsApp"
        >
          {/* Pulse ring */}
          <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
          <span className="absolute inset-[-3px] animate-[pulse_2s_ease-in-out_infinite] rounded-full border-2 border-[#25D366] opacity-50" />
          <MessageCircle className="relative size-7 text-white" fill="white" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
