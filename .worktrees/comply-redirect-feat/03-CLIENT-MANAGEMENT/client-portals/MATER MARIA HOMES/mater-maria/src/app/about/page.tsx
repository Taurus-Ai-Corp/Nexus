"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen theme-lifestyle py-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-[#968217] mb-8">
            Our Legacy of Care
          </h1>
          <div className="space-y-6 text-lg text-[#968217]/80 text-left font-serif max-w-3xl mx-auto">
            <p>
              Mater Maria Homes is built upon a profound respect for family and the deep-rooted traditions of Kerala. Our estate is designed to provide an unparalleled living experience for our Pravasi community and local elders.
            </p>
            <p>
              Embracing the "Monsoon Luxury" aesthetic, our facilities harmoniously blend earthy, grounded elements with clean, modern conveniences. We prioritize a tranquil atmosphere, free from the excessive noise of city life, ensuring our residents feel at home.
            </p>
            <p>
              Whether it is dedicated clinical trust or community lifestyle events, our mission is to secure a world-class future for your family right here in the heart of South India.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
