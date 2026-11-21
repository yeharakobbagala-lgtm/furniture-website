"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { HeroConfig } from "@/data/hero-config";

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
      {/* LAYER 8: Terracotta SHOW MORE button image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={config.buttonImage}
        alt={config.buttonText}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Interactive clickable link overlay matching the button location */}
      <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="relative min-w-full min-h-full aspect-[16/9] pointer-events-none">
          <Link
            href={config.buttonLink || "/shop"}
            className="absolute left-[4.1%] top-[72.8%] w-[20.8%] h-[12.5%] cursor-pointer pointer-events-auto rounded-full"
            aria-label={config.buttonText || "Show More Furniture"}
          />
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
            {/* Mouse Silhouette */}
            <div className="w-5 h-8 rounded-full border-2 border-forest-deep/45 flex items-start justify-center p-1 group-hover:border-forest-deep transition-colors bg-white/30 backdrop-blur-[2px] shadow-sm">
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
