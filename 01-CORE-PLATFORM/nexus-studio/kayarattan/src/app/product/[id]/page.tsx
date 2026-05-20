"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, Check } from "lucide-react";
import ProductImageZoom from "@/components/ProductImageZoom";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { addItem } = useCart();
  const containerRef = useRef<HTMLDivElement>(null);
   
  const id = React.use(params).id;
  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  useGSAP(() => {
    gsap.from(".product-element", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  const handleAddToCart = () => {
    addItem(product);
  };

  // Determine which images to use based on product ID
  let zoomImages = [];
  let mainImage = product.image;
  
  if (product.id === "catalogue-product-4-1") {
    mainImage = "/images/product-4-1.png";
    zoomImages = [
      "/images/product-4-1.png",
      "/images/catalogue-product-4.png"
    ];
  } else if (product.id === "catalogue-product-4-2") {
    mainImage = "/images/product-4-2.png";
    zoomImages = [
      "/images/product-4-2.png",
      "/images/catalogue-product-4.png"
    ];
  } else if (product.id === "catalogue-product-5-1") {
    mainImage = "/images/product-5-1.png";
    zoomImages = [
      "/images/product-5-1.png",
      "/images/catalogue-product-5.png"
    ];
  } else if (product.id === "catalogue-product-6-1") {
    mainImage = "/images/product-6-1.png";
    zoomImages = [
      "/images/product-6-1.png",
      "/images/catalogue-page-6.png"
    ];
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FBF8F3] py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Link 
          href="/#bestsellers"
          className="product-element inline-flex items-center text-[#5A5A5A] hover:text-[#C67B5C] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="product-element relative">
            <ProductImageZoom
              mainImage={mainImage}
              zoomImages={zoomImages}
              alt={product.name}
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="product-element inline-block text-[#C67B5C] text-sm tracking-[0.2em] uppercase mb-4">
              {product.category}
            </span>
            <h1 className="product-element font-serif text-4xl md:text-5xl text-[#3A3A3A] mb-6">
              {product.name}
            </h1>
            <p className="product-element text-3xl font-semibold text-[#C67B5C] mb-8">
              ${product.price}
            </p>
            <p className="product-element text-[#5A5A5A] text-lg leading-relaxed mb-10">
              {product.description}
            </p>

            <button
              onClick={handleAddToCart}
              className="product-element w-full max-w-md py-5 bg-[#C67B5C] text-white text-lg font-medium tracking-wider uppercase hover:bg-[#B56A4B] transition-all duration-300 hover:shadow-lg"
            >
              Add to Cart
            </button>

            <div className="product-element mt-12 pt-8 border-t border-[#D4B896]/30">
              <h3 className="font-serif text-lg text-[#3A3A3A] mb-6">Features</h3>
              <ul className="space-y-4">
                {[
                  "Handwoven by master artisans",
                  "100% sustainable rattan",
                  "Ships within 5-7 business days",
                  "30-day return policy",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-[#5A5A5A]">
                    <Check className="w-5 h-5 text-[#8B9D83]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";