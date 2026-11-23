"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroConfig } from "@/data/hero-config";
import SplitText from "@/components/ui/SplitText";

interface HeroContentProps {
  config: HeroConfig;
}

export default function HeroContent({ config }: HeroContentProps) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-[6] overflow-hidden flex items-center justify-center">
      <div className="relative min-w-full min-h-full aspect-[16/9] pointer-events-none">
        {/* Unified Left Editorial Typography & Action Stack */}
        <div className="absolute left-[4.2%] xl:left-[4.6%] top-[17%] lg:top-[18%] xl:top-[19%] max-w-[450px] xl:max-w-[510px] pointer-events-none select-none flex flex-col justify-start z-[8]">
          {/* Subtle Editorial Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 mb-3.5 sm:mb-4.5 pointer-events-auto">
            <span className="text-[10.5px] sm:text-[11.5px] uppercase tracking-[0.24em] font-extrabold text-[#B85232]">
              <SplitText
                text="Edition · 2026"
                effect="fade"
                splitType="chars"
                delay={25}
                duration={0.8}
                trigger="load"
              />
            </span>
            <span className="w-7 h-[1.5px] bg-[#B85232]/40 rounded-full" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold text-[#1A3828]/65">
              <SplitText
                text="Bespoke Craft"
                effect="fade"
                splitType="chars"
                delay={30}
                duration={0.8}
                trigger="load"
              />
            </span>
          </div>

          {/* Main Headline with Orange Avenue Ligatures and Generous Line Gaps */}
          <h1
            className="font-orangeAvenue text-[#0F2B20] text-[clamp(2.9rem,5.1vw,5.8rem)] leading-[1.06] tracking-[-0.015em] pointer-events-auto cursor-default font-medium"
            style={{
              fontFamily: "var(--font-orange-avenue), 'OrangeAvenue', serif",
              fontFeatureSettings: '"liga" 1, "dlig" 1, "calt" 1, "swsh" 1, "ss01" 0',
              fontVariantLigatures: "common-ligatures discretionary-ligatures contextual",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              WebkitTextStroke: "0.55px currentColor",
              paintOrder: "stroke fill",
            }}
          >
            <div className="block">
              <SplitText
                text="Furniture"
                tag="span"
                effect="rise"
                splitType="words"
                delay={45}
                duration={1.1}
                trigger="load"
                hoverEffect="lift"
                className="font-orangeAvenue font-medium"
              />
            </div>
            <div className="block mt-2.5 sm:mt-3.5 lg:mt-4">
              <SplitText
                text="Design"
                tag="span"
                effect="rise"
                splitType="words"
                delay={50}
                duration={1.1}
                trigger="load"
                hoverEffect="lift"
                className="font-orangeAvenue font-medium"
              />
            </div>
            <div className="block mt-2.5 sm:mt-3.5 lg:mt-4 whitespace-nowrap">
              <SplitText
                text="Made for You"
                tag="span"
                effect="rise"
                splitType="words"
                delay={40}
                duration={1.2}
                trigger="load"
                hoverEffect="lift"
                className="font-orangeAvenue font-medium"
              />
            </div>
          </h1>

          {/* Editorial Subtitle Bridging Down to the Button */}
          <p
            className="mt-6 sm:mt-8 lg:mt-9 xl:mt-10 text-[13px] sm:text-[14.5px] lg:text-[15.5px] xl:text-[16.5px] text-[#1A3828] max-w-[390px] xl:max-w-[440px] leading-[1.7] select-text font-medium italic tracking-[0.01em] pointer-events-auto"
            style={{
              fontFamily: "'Lora', var(--font-lora), var(--font-cormorant), Georgia, serif",
              fontWeight: 500,
            }}
          >
            <SplitText
              text="Architectural silhouettes, solid handcrafted timber, and tactile comfort designed to elevate modern living sanctuaries."
              tag="span"
              splitType="words"
              effect="fade"
              delay={35}
              duration={0.9}
              trigger="load"
            />
          </p>

          {/* Living Apple Liquid Glass Orange CTA Button */}
          <div className="mt-7 sm:mt-9 lg:mt-10 xl:mt-12 pointer-events-auto">
            <Link
              href={config.buttonLink || "/shop"}
              className="glass-cta-orange group inline-flex items-center justify-center gap-3 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-white font-heading font-extrabold text-xs sm:text-[14px] tracking-wider uppercase transition-all duration-300 hover:scale-[1.03] select-none shadow-floating"
              aria-label={config.buttonText || "Show More Furniture"}
            >
              <span className="leading-none tracking-widest">{config.buttonText || "SHOW MORE"}</span>
              <ArrowRight
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 shrink-0"
                strokeWidth={2.4}
              />
            </Link>
          </div>

          {/* Refined Craftsmanship Accolades to Gracefully Anchor the Lower Space */}
          <div className="mt-7 sm:mt-8 xl:mt-9 flex items-center gap-3 sm:gap-4.5 text-[10px] sm:text-[11px] text-[#1A3828]/70 font-bold tracking-wider uppercase select-none pointer-events-auto">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B85232]" />
              <span>Solid Timber</span>
            </div>
            <span className="text-[#1A3828]/25">•</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F2B20]" />
              <span>Bespoke Atelier</span>
            </div>
            <span className="text-[#1A3828]/25">•</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B85232]" />
              <span>10-Yr Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
