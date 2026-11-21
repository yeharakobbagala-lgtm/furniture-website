"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Maximize, Minimize } from "lucide-react";
import { HeroFurnitureSet, defaultHeroFurnitureSets } from "@/data/hero-config";
import DepthParallaxViewer from "@/components/ui/DepthParallaxViewer";

interface HeroFurnitureShowcaseProps {
  sets?: HeroFurnitureSet[];
}

export default function HeroFurnitureShowcase({
  sets = defaultHeroFurnitureSets,
}: HeroFurnitureShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
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
        </motion.div>
      </AnimatePresence>

      {/* LUXURY CAROUSEL SWITCHER PILL (Floats elegantly at bottom right) */}
      <div className="absolute bottom-6 sm:bottom-8 right-4 sm:right-8 z-30 pointer-events-auto flex items-center gap-2 select-none">
        <div className="inline-flex items-center gap-2 p-1.5 rounded-full bg-[#183323]/90 backdrop-blur-md border border-white/20 shadow-floating text-[#F8F7F0]">
          {/* Previous Arrow */}
          <button
            onClick={() => paginate(-1)}
            aria-label="Previous furniture set"
            className="p-1.5 rounded-full hover:bg-white/20 text-[#F8F7F0] transition-colors focus:outline-none"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Interactive Set Tabs */}
          <div className="flex items-center gap-1">
            {sets.map((set, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={set.id}
                  onClick={() => goToSlide(idx)}
                  className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide transition-all ${
                    isActive
                      ? "bg-[#B85232] text-white shadow-sm font-semibold scale-105"
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
            className="p-1.5 rounded-full hover:bg-white/20 text-[#F8F7F0] transition-colors focus:outline-none"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Full Screen Toggle Button */}
          <div className="w-[1px] h-3 bg-white/20 mx-0.5" />
          <button
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Full Screen"}
            title={isFullscreen ? "Exit Fullscreen" : "Full Screen"}
            className="p-1.5 rounded-full hover:bg-white/20 text-[#F8F7F0] transition-colors focus:outline-none"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
