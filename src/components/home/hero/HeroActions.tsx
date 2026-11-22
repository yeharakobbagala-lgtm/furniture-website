"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, Armchair } from "lucide-react";
import { HeroConfig } from "@/data/hero-config";
import CircularText from "@/components/ui/CircularText";

interface HeroActionsProps {
  config: HeroConfig;
}

export default function HeroActions({ config }: HeroActionsProps) {
  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight * 0.9,
      behavior: "smooth",
    });
  };

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-[8]">
      {/* Living Apple Liquid Glass Orange CTA Button & CircularText Badge */}
      <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="relative min-w-full min-h-full aspect-[16/9] pointer-events-none">
          {/* Terracotta CTA Button */}
          <div className="absolute left-[4.1%] top-[73%] w-[16.5%] max-w-[250px] h-[8.5%] max-h-[62px] flex items-center pointer-events-none">
            <Link
              href={config.buttonLink || "/shop"}
              className="glass-cta-orange group pointer-events-auto w-full h-full rounded-full flex items-center justify-center gap-2.5 sm:gap-3 px-5 sm:px-6 text-white font-heading font-bold text-xs sm:text-sm md:text-[15px] tracking-wider uppercase transition-all duration-300 hover:scale-[1.03] select-none shadow-floating"
              aria-label={config.buttonText || "Show More Furniture"}
            >
              <span className="leading-none tracking-widest">{config.buttonText || "SHOW MORE"}</span>
              <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-300 group-hover:translate-x-1 shrink-0" strokeWidth={2.2} />
            </Link>
          </div>

          {/* React Bits CircularText Artisanal Living Seal (Bottom-Right) */}
            <div className="hidden md:flex absolute right-[4.2%] lg:right-[4.8%] top-[76%] -translate-y-1/2 pointer-events-auto select-none items-center justify-center z-[15]">
              <CircularText
                text="• SQUARE LIVING • ARCHITECTURAL DESIGN • EST. 2026 • "
                onHover="speedUp"
                direction="clockwise"
                spinDuration={24}
                size={175}
                fontSize={14}
                fontWeight={900}
                draggable
                hoverTilt={20}
                color="#000000"
                className="font-sans uppercase tracking-[0.15em]"
              >
                  <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md border border-black/15 shadow-[0_4px_18px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.95)] flex items-center justify-center transition-transform duration-300 hover:scale-110">
                    <Armchair className="w-6 h-6 text-terracotta" strokeWidth={2.2} />
                  </div>
              </CircularText>
            </div>
          </div>
        </div>

        {/* Interactive Mouse Scroll Indicator (Bottom Center) */}
        {config.scrollIndicator?.show && (
          <div className="flex flex-col items-center gap-1 absolute left-1/2 -translate-x-1/2 bottom-6 sm:bottom-8 pointer-events-auto select-none">
            <button
              onClick={handleScrollDown}
              className="group flex flex-col items-center gap-1 transition-all duration-300 hover:scale-105"
              aria-label="Scroll down to browse collections"
            >
              {/* Mouse Silhouette with glass border */}
              <div className="w-5 h-8 rounded-full border-2 border-forest-deep/45 flex items-start justify-center p-1 group-hover:border-forest-deep transition-colors bg-white/40 backdrop-blur-md shadow-sm">
                {/* Bouncing Mouse Wheel / Dot */}
                <span className="w-1 h-2 rounded-full bg-terracotta animate-bounce" />
              </div>
              {/* Subtle Chevron Down */}
              <ChevronDown className="w-3.5 h-3.5 text-forest-deep/60 group-hover:text-forest-deep group-hover:translate-y-0.5 transition-all" />
            </button>
          </div>
        )}
      </div>
      );
}
