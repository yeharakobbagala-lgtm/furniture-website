"use client";

import React from "react";
import { HeroConfig } from "@/data/hero-config";

interface HeroContentProps {
  config: HeroConfig;
}

export default function HeroContent({ config }: HeroContentProps) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-[6] overflow-hidden flex items-center justify-center">
      <div className="relative min-w-full min-h-full aspect-[16/9] pointer-events-none">
        {/* Large, Bold, Space-filling Luxury Editorial Typography */}
        <div className="absolute left-[4.1%] top-[29%] w-[42%] max-w-[740px] pointer-events-none select-none flex flex-col justify-start">
          {/* Main Headline with Orange Avenue Ligatures and Enhanced Bold Stroke */}
          <h1
            className="font-['OrangeAvenue',var(--font-orange-avenue),serif] text-[#0F2B20] text-[clamp(3.6rem,6.8vw,7.6rem)] leading-[0.88] tracking-[-0.015em]"
            style={{
              fontFamily: "'OrangeAvenue', var(--font-orange-avenue), serif",
              WebkitTextStroke: "1.4px #0F2B20",
              textShadow: "0 0 1px #0F2B20, 0 0 0.8px #0F2B20",
              fontFeatureSettings: '"liga" 1, "dlig" 1, "calt" 1, "swsh" 1',
            }}
          >
            <span className="block">Furniture</span>
            <span className="block mt-1 sm:mt-1.5">Design</span>
            <span className="block mt-1 sm:mt-1.5 whitespace-nowrap">Made for You</span>
          </h1>

          {/* Editorial Subtitle Bridging the Gap Down to the CTA Button - refined editorial Lora font */}
          <p
            className="mt-10 sm:mt-12 lg:mt-[50px] text-base sm:text-lg lg:text-[18px] text-[#1A3828] max-w-[490px] leading-[1.6] select-text font-medium italic tracking-[0.01em]"
            style={{
              fontFamily: "'Lora', var(--font-lora), var(--font-cormorant), Georgia, serif",
              fontWeight: 500,
            }}
          >
            Architectural silhouettes, solid handcrafted timber, and tactile comfort designed to elevate modern living sanctuaries.
          </p>
        </div>
      </div>
    </div>
  );
}
