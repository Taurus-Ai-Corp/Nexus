"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function CinematicHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = {
    page4: useRef<HTMLImageElement>(null),
    page5: useRef<HTMLImageElement>(null),
    page6: useRef<HTMLImageElement>(null)
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Simple Ken Burns effect using CSS animations
    const heroElement = containerRef.current;
    
    // Create a timeline for the Ken Burns effect
    let currentImage = 0;
    const images = ['/images/catalogue-page-4.png', '/images/catalogue-page-5.png', '/images/catalogue-page-6.png'];
    
    const changeBackground = () => {
      currentImage = (currentImage + 1) % images.length;
      heroElement.style.backgroundImage = `url('${images[currentImage]}')`;
      heroElement.style.backgroundPosition = `${50 + Math.sin(Date.now() * 0.0001) * 10}% ${50 + Math.cos(Date.now() * 0.0001) * 10}%`;
      heroElement.style.backgroundSize = `${100 + Math.sin(Date.now() * 0.00005) * 5}%`;
    };
    
    // Initial setup
    heroElement.style.backgroundImage = `url('${images[0]}')`;
    heroElement.style.backgroundSize = 'cover';
    heroElement.style.backgroundPosition = 'center';
    heroElement.style.transition = 'background-image 2s ease-in-out, background-position 8s ease-in-out, background-size 8s ease-in-out';
    
    // Start the Ken Burns effect
    const interval = setInterval(changeBackground, 8000);
    
    // Subtle continuous movement
    const animate = () => {
      heroElement.style.backgroundPosition = `${50 + Math.sin(Date.now() * 0.0001) * 8}% ${50 + Math.cos(Date.now() * 0.0001) * 8}%`;
      heroElement.style.backgroundSize = `${100 + Math.sin(Date.now() * 0.00005) * 3}%`;
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[95vh] flex items-center overflow-hidden"
    >
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a]/80 via-[#1a1a1a]/50 to-[#1a1a1a]/30" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <div className="max-w-2xl">
          <span className="inline-block text-[#D4B896] text-sm tracking-[0.4em] uppercase mb-8">
            Handcrafted Excellence Since 2014
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05] mb-8">
            Where Nature{" "}
            <span className="italic text-[#D4B896]">Meets</span>{" "}
            <span className="italic">Artistry</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 mb-12 leading-relaxed max-w-lg">
            Discover our curated collection of handwoven rattan furniture, 
            crafted by master artisans in Indonesia and designed for timeless elegance.
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            <a 
              href="#bestsellers"
              className="inline-flex items-center justify-center gap-3 bg-[#C67B5C] text-white px-10 py-5 
                        text-base font-medium tracking-wide hover:bg-[#B56A4B] transition-all duration-300 group"
            >
              Explore Collection
              <span className="w-5 h-5 group-hover:translate-x-1 transition-transform inline-block">→</span>
            </a>
            <a 
              href="#story"
              className="inline-flex items-center justify-center gap-3 border border-white/30 text-white px-10 py-5 
                        text-base font-medium tracking-wide hover:bg-white/10 hover:border-white/50 transition-all duration-300"
            >
              Our Craft
            </a>
          </div>

          <div className="mt-20 flex gap-12">
            <div>
              <div className="text-4xl md:text-5xl font-serif text-[#D4B896]">500+</div>
              <p className="text-white/50 text-sm tracking-wider mt-2">HAPPY CLIENTS</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-serif text-[#D4B896]">10+</div>
              <p className="text-white/50 text-sm tracking-wider mt-2">YEARS CRAFT</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-serif text-[#D4B896]">150+</div>
              <p className="text-white/50 text-sm tracking-wider mt-2">DESIGNS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-8 h-14 border-2 border-white/30 rounded-full flex justify-center pt-3">
          <div className="w-1.5 h-4 bg-[#D4B896] rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}