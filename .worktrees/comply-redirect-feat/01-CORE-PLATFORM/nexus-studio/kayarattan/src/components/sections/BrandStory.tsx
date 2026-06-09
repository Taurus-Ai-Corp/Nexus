"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

gsap.config({ nullTargetWarn: false });

export default function BrandStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoContainerRef.current) return;

    const images = [
      "/images/catalogue-page-4.png",
      "/images/catalogue-page-5.png",
      "/images/catalogue-page-6.png",
      "/images/artisan-weaving-rattan.jpg"
    ];
    
    let currentIndex = 0;
    const container = videoContainerRef.current;
    
    // Set initial background
    container.style.backgroundImage = `url('${images[0]}')`;
    container.style.backgroundSize = 'cover';
    container.style.backgroundPosition = 'center';
    
    const changeBackground = () => {
      currentIndex = (currentIndex + 1) % images.length;
      container.style.backgroundImage = `url('${images[currentIndex]}')`;
    };

    // Change image every 5 seconds
    const interval = setInterval(changeBackground, 5000);

    // Subtle Ken Burns effect
    const animate = () => {
      const scale = 1.03 + Math.sin(Date.now() * 0.0001) * 0.01;
      const x = 50 + Math.sin(Date.now() * 0.00005) * 1;
      const y = 50 + Math.cos(Date.now() * 0.00005) * 0.5;
      
      container.style.backgroundSize = `${scale * 100}%`;
      container.style.backgroundPosition = `${x}% ${y}%`;
      requestAnimationFrame(animate);
    };

    animate();
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  useGSAP(() => {
    gsap.from(".story-content", {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
      },
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
    });
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef}
      id="story"
      className="py-24 md:py-32 bg-[#F5F1EB]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="story-content relative order-2 lg:order-1">
            <div
              ref={videoContainerRef}
              className="relative aspect-[4/5] overflow-hidden rounded-xl border border-[1px] border-[rgba(212,184,150,0.2)]"
              style={{
                transition: 'background-image 1.5s ease-in-out',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/20 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <div className="text-white text-sm tracking-wider uppercase">
                  Master Artisan Craftsmanship
                </div>
                <div className="text-white/70 text-xs">
                  Traditional Indonesian weaving techniques
                </div>
              </div>
            </div>
          </div>

          <div className="story-content space-y-8 order-1 lg:order-2">
            <div>
              <span className="inline-block text-[#C67B5C] text-sm tracking-[0.3em] uppercase mb-4">
                Our Story
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-[#3A3A3A] mb-6 leading-tight">
                The Art of <span className="italic text-[#C67B5C]">Rattan</span> Craftsmanship
              </h2>
              <p className="text-lg text-[#5A5A5A] leading-relaxed">
                For over a decade, Kaya Rattan has been dedicated to preserving the ancient art 
                of Indonesian rattan weaving. Each piece is handcrafted by skilled artisans 
                using traditional techniques passed down through generations.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-[#8B9D83]/15 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#8B9D83]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl text-[#3A3A3A]">Our Mission</h3>
                <p className="text-[#5A5A5A] leading-relaxed text-sm">
                  To bring the warmth and natural beauty of Indonesian rattan craftsmanship 
                  to homes worldwide while supporting local artisan communities.
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-14 h-14 bg-[#D4B896]/15 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#D4B896]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl text-[#3A3A3A]">Meet the Maker</h3>
                <p className="text-[#5A5A5A] leading-relaxed text-sm">
                  Our master weaver, Pak Budi, has been crafting rattan furniture for 30 years, 
                  learning from his father and now teaching his children.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}