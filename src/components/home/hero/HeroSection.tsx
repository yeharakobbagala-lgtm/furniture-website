"use client";

import React, { useState } from "react";
import HeroBackground from "./HeroBackground";
import HeroFurnitureShowcase from "./HeroFurnitureShowcase";
import HeroContent from "./HeroContent";
import HeroActions from "./HeroActions";
import { defaultHeroConfig, defaultHeroFurnitureSets, HeroConfig } from "@/data/hero-config";

interface HeroSectionProps {
  initialConfig?: HeroConfig;
}

export default function HeroSection({ initialConfig = defaultHeroConfig }: HeroSectionProps) {
  const [config, setConfig] = useState<HeroConfig>(initialConfig);

  return (
    <section
      className="relative w-full h-screen min-h-[640px] max-h-[1080px] overflow-hidden bg-[#E2ECE0]"
      aria-label="Square Furniture Hero Showcase"
    >
      {/* 
        Full-Screen Viewport Hero (100vh):
        Occupies the entire screen fold seamlessly on desktop, laptop, tablet,
        and mobile with zero letterboxing or awkward cutoffs.
      */}
      <div className="relative w-full h-full overflow-hidden select-none">
        {/* LAYER 1 & 2: Light Sage-Green Background & Dark-Green Organic Curved Backdrop (STATIONARY) */}
        <HeroBackground config={config} />

        {/* LAYER 3, 4, 5: ANIMATED FURNITURE SHOWCASE (Only Furniture Changes!) */}
        <HeroFurnitureShowcase sets={defaultHeroFurnitureSets} />

        {/* LAYER 6: Bold Headline Text (STATIONARY) */}
        <HeroContent config={config} />

        {/* LAYER 8: Terracotta SHOW MORE Button (STATIONARY) */}
        <HeroActions config={config} />
      </div>
    </section>
  );
}
