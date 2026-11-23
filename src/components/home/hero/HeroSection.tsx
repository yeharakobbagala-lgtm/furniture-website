"use client";

import React, { useState } from "react";
import HeroBackground from "./HeroBackground";
import HeroFurnitureShowcase from "./HeroFurnitureShowcase";
import HeroContent from "./HeroContent";
import HeroActions from "./HeroActions";
import HeroMobileView from "./HeroMobileView";
import { defaultHeroConfig, defaultHeroFurnitureSets, HeroConfig } from "@/data/hero-config";

interface HeroSectionProps {
  initialConfig?: HeroConfig;
}

export default function HeroSection({ initialConfig = defaultHeroConfig }: HeroSectionProps) {
  const [config, setConfig] = useState<HeroConfig>(initialConfig);
  // Default to 0 ("set-1-living", Nordic Lounge Armchair matching reference design)
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section
      className="relative w-full overflow-hidden bg-[#E4F0DF]"
      aria-label="Square Furniture Hero Showcase"
    >
      {/* 
        DESKTOP VIEWPORT (>= lg, 100vh):
        Occupies the entire screen fold seamlessly on desktop, laptop, and ultra-wide
        with 16:9 spatial alignment and stationary typography on the left.
      */}
      <div className="hidden lg:block relative w-full h-screen min-h-[640px] max-h-[1080px] overflow-hidden select-none">
        {/* LAYER 1 & 2: Light Sage-Green Background & Dark-Green Organic Curved Backdrop */}
        <HeroBackground config={config} />

        {/* LAYER 3, 4, 5: ANIMATED FURNITURE SHOWCASE */}
        <HeroFurnitureShowcase
          sets={defaultHeroFurnitureSets}
          currentIndex={currentIndex}
          onIndexChange={setCurrentIndex}
        />

        {/* LAYER 6: Bold Headline Text */}
        <HeroContent config={config} />

        {/* LAYER 8: CircularText Badge & Actions */}
        <HeroActions config={config} />
      </div>

      {/* 
        MOBILE VIEWPORT (< lg):
        Tailored editorial vertical mobile architecture matching the reference design:
        Floating header clearance -> Edition eyebrow -> 2-line Editorial Headline ->
        Serif italic description -> Dominant Furniture Showcase with organic backdrop & side elements ->
        Three Brand Benefits (Solid Timber, Bespoke Atelier, 10-Yr Warranty) ->
        SHOW MORE CTA button -> Segmented Room Collection selector dock.
      */}
      <div className="block lg:hidden relative w-full overflow-hidden select-none">
        <HeroMobileView
          config={config}
          sets={defaultHeroFurnitureSets}
          currentIndex={currentIndex}
          onIndexChange={setCurrentIndex}
        />
      </div>
    </section>
  );
}
