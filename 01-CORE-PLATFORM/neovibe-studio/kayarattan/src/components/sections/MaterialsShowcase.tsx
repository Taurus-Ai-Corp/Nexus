"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

export default function MaterialsShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    gsap.from(".material-card", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  return (
    <section id="materials" ref={containerRef} className="py-20 bg-[#FBF8F3]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-center font-serif text-4xl md:text-5xl text-[#3A3A3A] mb-12">
          The Art of Natural Materials
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Rattan */}
          <div className="material-card relative group">
            <div className="aspect-w-3 aspect-h-4 mb-6">
              <div className="relative h-full w-full overflow-hidden rounded-lg border border-[1px] border-[rgba(212,184,150,0.3)] bg-[url('/images/rattan-texture-detail.jpg')] bg-center bg-cover transition-all duration-500 group-hover:scale-105">
                <div className="absolute inset-0 bg-[rgba(212,184,150,0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            <h3 className="font-serif text-xl text-[#3A3A3A] mb-3">Premium Rattan</h3>
            <p className="text-[#5A5A5A] text-sm mb-4">
              Sustainably harvested, hand-selected rattan poles that mature for 3-5 years before weaving.
            </p>
            <div className="w-full h-1 bg-[rgba(212,184,150,0.2)] rounded-full overflow-hidden">
              <div className="h-full bg-[linear-gradient(to_right,#C67B5C,#8B9D83)] transition-width duration-1000 w-[85%]"></div>
            </div>
            <span className="text-xs text-[#C67B5C] font-medium">85% Renewable</span>
          </div>
          
          {/* Solid Wood */}
          <div className="material-card relative group">
            <div className="aspect-w-3 aspect-h-4 mb-6">
              <div className="relative h-full w-full overflow-hidden rounded-lg border border-[1px] border-[rgba(212,184,150,0.3)] bg-[url('/images/rattan-texture-detail.jpg')] bg-center bg-cover transition-all duration-500 group-hover:scale-105">
                <div className="absolute inset-0 bg-[rgba(212,184,150,0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            <h3 className="font-serif text-xl text-[#3A3A3A] mb-3">Solid Wood Frames</h3>
            <p className="text-[#5A5A5A] text-sm mb-4">
              Kiln-dried hardwood frames sourced from responsibly managed forests for lasting durability.
            </p>
            <div className="w-full h-1 bg-[rgba(212,184,150,0.2)] rounded-full overflow-hidden">
              <div className="h-full bg-[linear-gradient(to_right,#C67B5C,#8B9D83)] transition-width duration-1000 w-[90%]"></div>
            </div>
            <span className="text-xs text-[#C67B5C] font-medium">90% Sustainable</span>
          </div>
          
          {/* Natural Finishes */}
          <div className="material-card relative group">
            <div className="aspect-w-3 aspect-h-4 mb-6">
              <div className="relative h-full w-full overflow-hidden rounded-lg border border-[1px] border-[rgba(212,184,150,0.3)] bg-[url('/images/rattan-texture-detail.jpg')] bg-center bg-cover transition-all duration-500 group-hover:scale-105">
                <div className="absolute inset-0 bg-[rgba(212,184,150,0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            <h3 className="font-serif text-xl text-[#3A3A3A] mb-3">Natural Finishes</h3>
            <p className="text-[#5A5A5A] text-sm mb-4">
              Plant-based oils and waxes that enhance the natural beauty while protecting the material.
            </p>
            <div className="w-full h-1 bg-[rgba(212,184,150,0.2)] rounded-full overflow-hidden">
              <div className="h-full bg-[linear-gradient(to_right,#C67B5C,#8B9D83)] transition-width duration-1000 w-[95%]"></div>
            </div>
            <span className="text-xs text-[#C67B5C] font-medium">95% Eco-Friendly</span>
          </div>
          
          {/* Handcrafted */}
          <div className="material-card relative group">
            <div className="aspect-w-3 aspect-h-4 mb-6">
              <div className="relative h-full w-full overflow-hidden rounded-lg border border-[1px] border-[rgba(212,184,150,0.3)] bg-[url('/images/artisan-weaving-rattan.jpg')] bg-center bg-cover transition-all duration-500 group-hover:scale-105">
                <div className="absolute inset-0 bg-[rgba(212,184,150,0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            <h3 className="font-serif text-xl text-[#3A3A3A] mb-3">Handcrafted Excellence</h3>
            <p className="text-[#5A5A5A] text-sm mb-4">
              Each piece is individually woven by master artisans with 15+ years of experience.
            </p>
            <div className="w-full h-1 bg-[rgba(212,184,150,0.2)] rounded-full overflow-hidden">
              <div className="h-full bg-[linear-gradient(to_right,#C67B5C,#8B9D83)] transition-width duration-1000 w-[100%]"></div>
            </div>
            <span className="text-xs text-[#C67B5C] font-medium">100% Handmade</span>
          </div>
        </div>
      </div>
    </section>
  );
}