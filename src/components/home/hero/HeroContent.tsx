"use client";

import React from "react";
import { HeroConfig } from "@/data/hero-config";

interface HeroContentProps {
  config: HeroConfig;
}

export default function HeroContent({ config }: HeroContentProps) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-[6]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={config.headlineImage}
        alt={config.headlineText}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
      />
    </div>
  );
}
