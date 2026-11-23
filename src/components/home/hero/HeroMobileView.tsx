"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Plus, Armchair } from "lucide-react";
import CircularText from "@/components/ui/CircularText";
import { HeroConfig, HeroFurnitureSet, defaultHeroFurnitureSets } from "@/data/hero-config";

// High-resolution original lossless multi-layer configs calibrated for dominant 75-85% furniture presence
interface MobileSuiteConfig {
  main: string;
  sideTable?: string;
  pendant?: string;
  canvasLeft: string;
  canvasTop: string;
  canvasWidth: string;
}

const mobileSuiteConfigs: Record<string, MobileSuiteConfig> = {
  "set-1-living": {
    main: "/hero 1/New Project (20).png",
    sideTable: "/hero 1/New Project (19).png",
    pendant: "/hero 1/New Project (21).png",
    canvasLeft: "-49%",
    canvasTop: "-3%",
    canvasWidth: "150%",
  },
  "set-2-bedroom": {
    main: "/hero 2/New Project (26).png",
    sideTable: "/hero 2/New Project (25).png",
    canvasLeft: "-30%",
    canvasTop: "-4%",
    canvasWidth: "132%",
  },
  "set-3-sofa": {
    main: "/hero3/New Project (30).png",
    sideTable: "/hero3/New Project (31).png",
    pendant: "/hero3/New Project (32).png",
    canvasLeft: "-40%",
    canvasTop: "-3%",
    canvasWidth: "142%",
  },
  "set-4-dining": {
    main: "/hero 4/hero4_dining.png",
    sideTable: "/hero 4/hero4_plant.png",
    pendant: "/hero 4/hero4_lamp.png",
    canvasLeft: "-34%",
    canvasTop: "-3%",
    canvasWidth: "136%",
  },
  "set-5-sculptural": {
    main: "/hero 5/hero5_composite.png",
    canvasLeft: "-48%",
    canvasTop: "-3%",
    canvasWidth: "150%",
  },
};

// Calibrated hotspot focal points for each suite in mobile view
const mobileHotspots: Record<
  string,
  {
    id: string;
    title: string;
    category: string;
    price: string;
    material: string;
    link: string;
    top: string;
    left: string;
  }
> = {
  "set-1-living": {
    id: "hs-m-living",
    title: "Nordic Lounge Armchair",
    category: "Lounge Chairs",
    price: "LKR 380",
    material: "Solid White Oak & Textured Bouclé",
    link: "/shop/lounge-chairs",
    top: "58%",
    left: "38%",
  },
  "set-2-bedroom": {
    id: "hs-m-bed",
    title: "Havn Channeled Platform Bed",
    category: "Beds & Suites",
    price: "LKR 920",
    material: "Channel-Tufted Linen & Hardwood",
    link: "/shop/beds",
    top: "56%",
    left: "42%",
  },
  "set-3-sofa": {
    id: "hs-m-sofa",
    title: "Sora Nordic 2-Seater Sofa",
    category: "Sofas & Seating",
    price: "LKR 1,120",
    material: "Textured Linen & Olive Velvet",
    link: "/shop/sofas",
    top: "56%",
    left: "39%",
  },
  "set-4-dining": {
    id: "hs-m-dining",
    title: "Elysian Oak Dining Suite",
    category: "Dining & Kitchen",
    price: "LKR 850",
    material: "Solid Teakwood & 4 Padded Chairs",
    link: "/shop/dining-tables",
    top: "56%",
    left: "42%",
  },
  "set-5-sculptural": {
    id: "hs-m-sculptural",
    title: "Zephyr Sculptural Chair",
    category: "Artisanal Chairs",
    price: "LKR 680",
    material: "Walnut Bentwood & Olive Velvet",
    link: "/shop/lounge-chairs",
    top: "58%",
    left: "35%",
  },
};

interface HeroMobileViewProps {
  config: HeroConfig;
  sets?: HeroFurnitureSet[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export default function HeroMobileView({
  config,
  sets = defaultHeroFurnitureSets,
  currentIndex,
  onIndexChange,
}: HeroMobileViewProps) {
  const [direction, setDirection] = useState(1);
  const [activeHotspot, setActiveHotspot] = useState(false);

  const currentSet = sets[currentIndex] || sets[0];
  const furn = currentSet.furniture;
  const hotspot = mobileHotspots[currentSet.id];
  const suiteConfig = mobileSuiteConfigs[currentSet.id] || mobileSuiteConfigs["set-5-sculptural"];

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setActiveHotspot(false);
      let nextIndex = currentIndex + newDirection;
      if (nextIndex < 0) nextIndex = sets.length - 1;
      if (nextIndex >= sets.length) nextIndex = 0;
      onIndexChange(nextIndex);
    },
    [currentIndex, sets.length, onIndexChange]
  );

  const goToSlide = useCallback(
    (index: number) => {
      if (index === currentIndex) return;
      setDirection(index > currentIndex ? 1 : -1);
      setActiveHotspot(false);
      onIndexChange(index);
    },
    [currentIndex, onIndexChange]
  );

  // Short label breakdown for segmented dock buttons
  const getDockLabel = (set: HeroFurnitureSet) => {
    switch (set.id) {
      case "set-1-living":
        return { line1: "Living", line2: "Room", activeText: "01 • Living Room" };
      case "set-2-bedroom":
        return { line1: "Bedroom", line2: "Suite", activeText: "02 • Bedroom Suite" };
      case "set-3-sofa":
        return { line1: "Lounge", line2: "Suite", activeText: "03 • Lounge Suite" };
      case "set-4-dining":
        return { line1: "Dining", line2: "Room", activeText: "04 • Dining Room" };
      case "set-5-sculptural":
        return { line1: "Sculptural", line2: "Suite", activeText: "05 • Sculptural Suite" };
      default:
        return {
          line1: set.title.split(" ")[0] || "Suite",
          line2: set.title.split(" ")[1] || "",
          activeText: set.subtitle || set.title,
        };
    }
  };

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col justify-between bg-[#E2ECE0] overflow-x-hidden select-none">
      {/* Subtle organic light backdrop texture */}
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0">
        <img
          src={config.backgroundImage || "/hero 1/New Project (24).png"}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* 1. TOP: Editorial Typography Stack */}
      <div className="pt-24 sm:pt-28 px-5 sm:px-7 flex flex-col items-start z-10 pointer-events-auto">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 mb-2 sm:mb-2.5">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-extrabold text-[#B85232]">
            Edition · 2026
          </span>
          <span className="w-6 h-[1.5px] bg-[#B85232]/50 rounded-full" />
          <span className="text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.18em] font-bold text-[#1A3828]/70">
            Bespoke Craft
          </span>
        </div>

        {/* Large Prominent Headline in Orange Avenue with 3 lines */}
        <h1
          className="font-orangeAvenue text-[#0F2B20] text-[36px] sm:text-[42px] leading-[1.04] tracking-[-0.015em] font-medium"
          style={{
            fontFamily: "var(--font-orange-avenue), 'OrangeAvenue', serif",
            fontFeatureSettings: '"liga" 1, "dlig" 1, "calt" 1, "swsh" 1, "ss01" 0',
            fontVariantLigatures: "common-ligatures discretionary-ligatures contextual",
            WebkitTextStroke: "0.55px currentColor",
            paintOrder: "stroke fill",
          }}
        >
          <span className="block">Furniture</span>
          <span className="block mt-0.5 sm:mt-1">Design</span>
          <span className="block mt-0.5 sm:mt-1">Made for You</span>
        </h1>
      </div>

      {/* 2. CENTER: Dominant Furniture Visual Composition (Full Photo Display) */}
      <div className="relative w-full aspect-[1.12] sm:aspect-[1.18] max-h-[480px] my-1 sm:my-2 overflow-hidden flex items-center justify-center z-10 pointer-events-none select-none">
        {/* Organic dark green backdrop shape */}
        <div
          className="absolute aspect-[1920/1080] pointer-events-none z-[1]"
          style={{
            width: suiteConfig.canvasWidth,
            left: suiteConfig.canvasLeft,
            top: suiteConfig.canvasTop,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero 1/New Project (23).png"
            alt=""
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />
        </div>

        {/* Animated active furniture suite (crystal clear lossless original layers) */}
        <div
          className="absolute aspect-[1920/1080] pointer-events-none z-[2]"
          style={{
            width: suiteConfig.canvasWidth,
            left: suiteConfig.canvasLeft,
            top: suiteConfig.canvasTop,
          }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSet.id}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              {/* Main Furniture */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={suiteConfig.main}
                alt={furn.alt}
                className="absolute inset-0 w-full h-full object-contain z-[3]"
              />

              {/* Side Table / Nightstand / Plant */}
              {suiteConfig.sideTable && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={suiteConfig.sideTable}
                  alt="Side Table"
                  className="absolute inset-0 w-full h-full object-contain z-[4]"
                />
              )}

              {/* Pendant Lamp */}
              {suiteConfig.pendant && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={suiteConfig.pendant}
                  alt="Pendant Light"
                  className="absolute inset-0 w-full h-full object-contain z-[5]"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Interactive Hotspot '+' Pin on Furniture Cushion */}
        {hotspot && (
          <div
            className="absolute z-20 pointer-events-auto"
            style={{
              top: hotspot.top,
              left: hotspot.left,
            }}
          >
            <button
              onClick={() => setActiveHotspot(!activeHotspot)}
              aria-label={`View ${hotspot.title}`}
              className="relative w-7 h-7 rounded-full bg-white/95 text-forest-deep shadow-[0_4px_16px_rgba(0,0,0,0.25)] flex items-center justify-center font-bold active:scale-90 transition-transform border border-white"
            >
              <span className="absolute inset-0 rounded-full bg-white/40 animate-ping opacity-60 pointer-events-none" />
              <Plus className={`w-3.5 h-3.5 transition-transform duration-300 ${activeHotspot ? "rotate-45" : ""}`} />
            </button>

            {/* Hotspot Floating Spatial Tooltip */}
            <AnimatePresence>
              {activeHotspot && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.94 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 p-3 rounded-2xl bg-[#1C3529]/95 backdrop-blur-xl text-white border border-white/20 shadow-2xl z-30"
                >
                  <p className="text-[10px] uppercase tracking-wider text-sage-200/80 font-bold">
                    {hotspot.category}
                  </p>
                  <h4 className="font-heading font-extrabold text-sm leading-snug text-white mt-0.5">
                    {hotspot.title}
                  </h4>
                  <p className="text-[10px] text-white/70 line-clamp-1 mt-0.5 font-normal">
                    {hotspot.material}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/15">
                    <span className="font-heading font-extrabold text-xs text-[#E0A97E]">
                      {hotspot.price}
                    </span>
                    <Link
                      href={hotspot.link}
                      className="text-[10px] uppercase font-bold text-white/90 hover:text-white flex items-center gap-1"
                    >
                      <span>View</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* 3. Circular Brand Seal Stamp (Bottom-Right, 100% Uncropped & Visible) */}
        <div className="absolute right-2 sm:right-4 bottom-1 pointer-events-auto z-20 select-none origin-bottom-right scale-[0.72] sm:scale-[0.8]">
          <CircularText
            text="• ARCHITECTURAL DESIGN • EST. 2026 • SQUARE LIVING • "
            onHover="speedUp"
            direction="clockwise"
            spinDuration={24}
            size={135}
            fontSize={11}
            fontWeight={900}
            color="#000000"
            className="font-sans uppercase tracking-[0.14em]"
          >
            <div className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-md border border-black/15 shadow-md flex items-center justify-center">
              <Armchair className="w-4.5 h-4.5 text-terracotta" strokeWidth={2.2} />
            </div>
          </CircularText>
        </div>
      </div>

      {/* 4. LOWER: Centered Terracotta CTA & Craftsmanship Features */}
      <div className="flex flex-col items-center justify-center gap-2 my-1 z-10 px-4 pointer-events-auto">
        <Link
          href={config.buttonLink || "/shop"}
          className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#B85232] text-white font-heading font-extrabold text-[12.5px] tracking-wider uppercase shadow-[0_8px_25px_rgba(184,82,50,0.38)] active:scale-98 transition-transform"
        >
          <span>{config.buttonText || "SHOW MORE"}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Brand features with circular indicators */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-[#1A3828]/85 select-none">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B85232]" />
            <span>Solid Timber</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#102D25]" />
            <span>Bespoke Atelier</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B85232]" />
            <span>10-Yr Warranty</span>
          </div>
        </div>
      </div>

      {/* 5. BOTTOM: Luxury Dark Green Suite Navigation Dock */}
      <div className="w-full px-3.5 pb-4 pt-1 z-20 pointer-events-auto">
        <div className="max-w-[420px] mx-auto rounded-full bg-[#1C382B] border border-white/20 shadow-2xl p-1.5 flex items-center justify-between text-white select-none">
          {/* Previous Suite Arrow */}
          <button
            onClick={() => paginate(-1)}
            aria-label="Previous furniture suite"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white/85 hover:text-white hover:bg-white/10 active:scale-90 transition-all shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Suites Segmented Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 px-1 flex-1 justify-center">
            {sets.map((set, idx) => {
              const isActive = idx === currentIndex;
              const label = getDockLabel(set);

              if (isActive) {
                return (
                  <button
                    key={set.id}
                    onClick={() => goToSlide(idx)}
                    className="bg-[#B85232] text-white px-3 sm:px-3.5 py-1.5 rounded-full text-[10.5px] sm:text-[11px] font-bold shadow-md whitespace-nowrap leading-tight shrink-0 transition-all duration-300"
                  >
                    {label.activeText}
                  </button>
                );
              }

              return (
                <React.Fragment key={set.id}>
                  <button
                    onClick={() => goToSlide(idx)}
                    className="text-white/75 hover:text-white px-2 sm:px-2.5 py-1 text-[9.5px] sm:text-[10px] font-medium leading-tight text-center shrink-0 transition-colors"
                  >
                    <span className="block">{label.line1}</span>
                    <span className="block">{label.line2}</span>
                  </button>
                  {idx < sets.length - 1 && (
                    <span className="w-[1px] h-3.5 bg-white/20 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Next Suite Arrow */}
          <button
            onClick={() => paginate(1)}
            aria-label="Next furniture suite"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white/85 hover:text-white hover:bg-white/10 active:scale-90 transition-all shrink-0"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
