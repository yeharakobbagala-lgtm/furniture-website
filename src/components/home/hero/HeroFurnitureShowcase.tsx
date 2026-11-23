"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Maximize, Minimize } from "lucide-react";
import { HeroFurnitureSet, defaultHeroFurnitureSets } from "@/data/hero-config";
import DepthParallaxViewer from "@/components/ui/DepthParallaxViewer";
import LiquidHotspot, { HotspotData } from "@/components/ui/glass/LiquidHotspot";

// Slide-specific hotspot data mapping
const slideHotspots: Record<string, HotspotData[]> = {
  "set-1-living": [
    {
      id: "hs-avery-chair",
      title: "Avery Ergonomic Lounge",
      category: "Lounge Chairs",
      price: "LKR 380",
      material: "Solid Oak Frame & Textured Bouclé",
      link: "/shop/lounge-chairs",
      top: "52%",
      left: "53%",
    },
    {
      id: "hs-avery-table",
      title: "Fluted Timber Side Table",
      category: "Side Tables",
      price: "LKR 145",
      material: "Solid Nordic White Oak Finish",
      link: "/shop/dining-tables",
      top: "56%",
      left: "83%",
    },
    {
      id: "hs-avery-lamp",
      title: "Conical Brass Pendant",
      category: "Lighting",
      price: "LKR 89",
      material: "Matte Powdercoat & Brushed Brass",
      link: "/shop",
      top: "22%",
      left: "71%",
    },
  ],
  "set-2-bedroom": [
    {
      id: "hs-koben-bed",
      title: "Koben Platform Bed",
      category: "Beds",
      price: "LKR 920",
      material: "Channel-Tufted Linen & Hardwood",
      link: "/shop/beds",
      top: "56%",
      left: "52%",
    },
    {
      id: "hs-koben-stand",
      title: "Blonde Oak Nightstand",
      category: "Storage",
      price: "LKR 195",
      material: "Dual Soft-Close Drawers",
      link: "/shop/storage",
      top: "60%",
      left: "79%",
    },
  ],
  "set-3-sofa": [
    {
      id: "hs-lounge-sofa",
      title: "Curved Living 3-Seater",
      category: "Sofas",
      price: "LKR 1,120",
      material: "Textured Linen & Olive Accents",
      link: "/shop/sofas",
      top: "58%",
      left: "54%",
    },
    {
      id: "hs-lounge-table",
      title: "Pedestal Oak Side Table",
      category: "Tables",
      price: "LKR 165",
      material: "Sculptural Conical Timber Base",
      link: "/shop/dining-tables",
      top: "56%",
      left: "86%",
    },
  ],
  "set-4-dining": [
    {
      id: "hs-dining-table",
      title: "Nordic Teak Dining Set",
      category: "Dining",
      price: "LKR 850",
      material: "Solid Teakwood & 4 Padded Chairs",
      link: "/shop/dining-tables",
      top: "54%",
      left: "55%",
    },
  ],
  "set-5-sculptural": [
    {
      id: "hs-sculptural-chair",
      title: "Ribbon Sculptural Chair",
      category: "Artisanal",
      price: "LKR 680",
      material: "Bentwood Frame & Moss Velvet",
      link: "/shop/lounge-chairs",
      top: "50%",
      left: "53%",
    },
  ],
};

interface HeroFurnitureShowcaseProps {
  sets?: HeroFurnitureSet[];
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
}

export default function HeroFurnitureShowcase({
  sets = defaultHeroFurnitureSets,
  currentIndex: externalIndex,
  onIndexChange,
}: HeroFurnitureShowcaseProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const currentIndex = externalIndex !== undefined ? externalIndex : internalIndex;

  const setCurrentIndex = useCallback(
    (updater: number | ((prev: number) => number)) => {
      const nextVal = typeof updater === "function" ? updater(currentIndex) : updater;
      if (onIndexChange) {
        onIndexChange(nextVal);
      } else {
        setInternalIndex(nextVal);
      }
    },
    [currentIndex, onIndexChange]
  );

  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const currentSet = sets[currentIndex] || sets[0];

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setCurrentIndex((prevIndex) => {
        let nextIndex = prevIndex + newDirection;
        if (nextIndex < 0) nextIndex = sets.length - 1;
        if (nextIndex >= sets.length) nextIndex = 0;
        return nextIndex;
      });
    },
    [sets.length]
  );

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  // Auto-play timer (6.5s per slide, pauses on hover)
  useEffect(() => {
    if (isHovered) return;
    timerRef.current = setInterval(() => {
      paginate(1);
    }, 6500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paginate, isHovered]);

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.97,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -90 : 90,
      opacity: 0,
      scale: 0.97,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  const furn = currentSet.furniture;
  const deco = currentSet.decorations;
  const imageSrc = furn.croppedImage || furn.image;
  const hasDepthMap = Boolean(furn.depthMapUrl);

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none z-[3]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={currentSet.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          {furn.isFullCanvas ? (
            /* FULL-CANVAS PHOTOPEA ARTWORK LAYERS:
               Renders with absolute inset-0 w-full h-full object-contain
               locking 100% pixel-perfect alignment to the 1920x1080 canvas.
            */
            <div className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Main Furniture Piece (Armchair / Bed / Sofa) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={furn.image}
                alt={furn.alt}
                className="absolute inset-0 w-full h-full object-cover pointer-events-auto z-[3]"
              />

              {/* Side Table / Nightstand / Plant */}
              {deco?.sideTableImage && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={deco.sideTableImage}
                  alt={deco.sideTableAlt || "Matching furniture side table"}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[4]"
                />
              )}

              {/* Hanging Pendant Lamp */}
              {deco?.showPendant && deco?.pendantImage && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={deco.pendantImage}
                  alt={deco.pendantAlt || "Hanging pendant light fixture"}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[5]"
                />
              )}
            </div>
          ) : (
            /* ISOLATED CUT-OUT MODE FALLBACK */
            <>
              {/* DESKTOP (>= lg) VIEW */}
              <div
                className="hidden lg:flex absolute items-center justify-center pointer-events-auto transition-all duration-500 ease-out"
                style={{
                  left: furn.position?.left || "40%",
                  top: furn.position?.top || "22%",
                  width: furn.position?.width || "44%",
                  height: furn.position?.height || "64%",
                  maxHeight: "72vh",
                  transform: furn.position?.transform || "none",
                }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt={furn.alt}
                    className="w-full h-full max-h-[70vh] object-contain transition-transform duration-500 hover:scale-[1.015]"
                  />
                </div>
              </div>

              {/* TABLET & MOBILE VIEW (< lg) */}
              <div className="lg:hidden absolute bottom-[8%] sm:bottom-[10%] right-[3%] sm:right-[6%] w-[75%] sm:w-[62%] max-w-[480px] aspect-square flex items-center justify-center pointer-events-auto">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt={furn.alt}
                    className="w-full h-full max-h-[50vh] object-contain"
                  />
                </div>
              </div>

              {/* LAYER: MATCHING SIDE TABLE / NIGHTSTAND */}
              {deco?.sideTableImage && (
                <div className="absolute inset-0 w-full h-full pointer-events-none z-[4]">
                  <div
                    className="hidden lg:block absolute transition-all duration-500"
                    style={{
                      right: deco.sideTableStyle?.right || "0px",
                      top: deco.sideTableStyle?.top || "26%",
                      width: deco.sideTableStyle?.width || "23%",
                      height: deco.sideTableStyle?.height || "42%",
                      maxHeight: "46vh",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={deco.sideTableCropped || deco.sideTableImage}
                      alt={deco.sideTableAlt || "Matching furniture side table"}
                      className="w-full h-full object-contain object-right-bottom"
                    />
                  </div>
                </div>
              )}

              {/* LAYER: HANGING PENDANT LAMP */}
              {deco?.showPendant && deco?.pendantImage && (
                <div className="absolute inset-0 w-full h-full pointer-events-none z-[5]">
                  <div
                    className="hidden lg:block absolute transition-all duration-500"
                    style={{
                      right: deco.pendantStyle?.right || "18%",
                      top: deco.pendantStyle?.top || "0px",
                      width: deco.pendantStyle?.width || "10%",
                      maxWidth: deco.pendantStyle?.maxWidth || "190px",
                      height: deco.pendantStyle?.height || "32%",
                      maxHeight: deco.pendantStyle?.maxHeight || "35vh",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={deco.pendantCropped || deco.pendantImage}
                      alt={deco.pendantAlt || "Hanging pendant light fixture"}
                      className="w-full h-full object-contain object-top"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Interactive Liquid Hotspots (VisionOS / Lumora Closer Look Feature) */}
          <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-20">
            {slideHotspots[currentSet.id]?.map((hs) => (
              <LiquidHotspot key={hs.id} hotspot={hs} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* LUXURY CAROUSEL SWITCHER PILL (Floats elegantly at bottom right with Liquid Glass) */}
      <div className="absolute bottom-6 sm:bottom-8 right-4 sm:right-8 z-30 pointer-events-auto flex items-center gap-2 select-none">
        <div className="relative inline-flex items-center gap-2 p-2 rounded-full liquid-glass-pill-dark border border-white/25 shadow-floating text-[#F8F7F0]">
          {/* Ambient Warm Backlight Glow */}
          <div className="absolute inset-0 rounded-full ambient-glow-warm opacity-40 pointer-events-none" />

          {/* Previous Arrow */}
          <button
            onClick={() => paginate(-1)}
            aria-label="Previous furniture set"
            className="p-1.5 rounded-full hover:bg-white/20 text-[#F8F7F0] transition-colors focus:outline-none relative z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Interactive Set Tabs */}
          <div className="flex items-center gap-1.5 relative z-10">
            {sets.map((set, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={set.id}
                  onClick={() => goToSlide(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs tracking-wide transition-all duration-300 ${
                    isActive
                      ? "bg-[#B85232] text-white shadow-soft font-semibold scale-105 border border-white/30"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span className="hidden sm:inline">{set.subtitle}</span>
                  <span className="sm:hidden">{idx + 1}</span>
                </button>
              );
            })}
          </div>

          {/* Next Arrow */}
          <button
            onClick={() => paginate(1)}
            aria-label="Next furniture set"
            className="p-1.5 rounded-full hover:bg-white/20 text-[#F8F7F0] transition-colors focus:outline-none relative z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Full Screen Toggle Button */}
          <div className="w-[1px] h-3 bg-white/20 mx-0.5 relative z-10" />
          <button
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Full Screen"}
            title={isFullscreen ? "Exit Fullscreen" : "Full Screen"}
            className="p-1.5 rounded-full hover:bg-white/20 text-[#F8F7F0] transition-colors focus:outline-none relative z-10"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
