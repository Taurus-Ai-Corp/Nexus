"use client";

"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BestsellersSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const bestsellers = products.filter(p => p.price > 0);

  useGSAP(() => {
    gsap.from(".bestseller-card", {
      scrollTrigger: {
        trigger: cardsRef.current,
        start: "top 80%",
      },
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
    });
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef}
      id="bestsellers"
      className="py-24 md:py-32 bg-[#FBF8F3]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-[#C67B5C] text-sm tracking-[0.3em] uppercase mb-4">
            Our Collection
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#3A3A3A] mb-6">
            Signature Pieces
          </h2>
          <p className="text-lg text-[#5A5A5A] max-w-2xl mx-auto leading-relaxed">
            Each piece is a unique work of art, handcrafted using techniques 
            passed down through generations of Indonesian weavers.
          </p>
        </div>
        
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product, index) => {
            // Use actual catalogue images for products
            let imageSrc = product.image;
            if (product.id === "catalogue-product-7") {
              imageSrc = "/images/product-4-1.png";
            } else if (product.id === "catalogue-product-8") {
              imageSrc = "/images/product-4-2.png";
            } else if (product.id === "catalogue-product-9") {
              imageSrc = "/images/product-5-1.png";
            } else if (product.id === "catalogue-product-10") {
              imageSrc = "/images/product-6-1.png";
            }
            
            return (
              <Link 
                href={`/product/${product.id}`}
                key={product.id}
                className="bestseller-card group block relative"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F1EB] mb-4">
                  <Image 
                    src={imageSrc} 
                    alt={product.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Material overlay on hover */}
                  <div className="absolute inset-0 bg-[url('/images/rattan-texture-detail.jpg')] bg-cover opacity-0 group-hover:opacity-15 transition-opacity duration-500" />
                  
                  {/* Subtle border glow on hover */}
                  <div className="absolute inset-0 border-2 border-[rgba(212,184,150,0)] group-hover:border-[rgba(212,184,150,0.3)] transition-colors duration-300 pointer-events-none" />
                  
                  {/* Material badge */}
                  <div className="absolute bottom-4 left-4 text-[#3A3A3A] text-xs bg-[#FBF8F3]/80 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Premium Rattan
                  </div>
                  
                  <span className="absolute top-4 left-4 px-3 py-1 bg-[#FBF8F3]/90 text-[#3A3A3A] text-xs tracking-widest uppercase font-medium">
                    {product.category}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-serif text-lg text-[#3A3A3A] group-hover:text-[#C67B5C] transition-colors duration-300">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xl font-semibold text-[#C67B5C]">
                      ${product.price}
                    </span>
                    <span className="text-xs text-[#3A3A3A] uppercase tracking-wider border-b border-transparent group-hover:border-[#C67B5C] transition-colors">
                      View
                    </span>
                  </div>
                </div>

                {/* Material details overlay - now properly positioned */}
                <div className="absolute inset-0 bg-[#FBF8F3] rounded-lg p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="flex flex-col justify-end h-full">
                    <div className="space-y-3">
                      <div className="w-full h-1 bg-[rgba(212,184,150,0.2)] rounded-full overflow-hidden">
                        <div className="h-full bg-[linear-gradient(to_right,#C67B5C,#8B9D83)] w-[85%]" />
                      </div>
                      <p className="text-[#5A5A5A] text-sm">
                        Handwoven by master artisans using sustainable rattan
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}