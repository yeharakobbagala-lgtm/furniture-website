"use client";

import React from "react";
import Image from "next/image";
import { HeroConfig } from "@/data/hero-config";

interface HeroBackgroundProps {
  config: HeroConfig;
}

export default function HeroBackground({ config }: HeroBackgroundProps) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
      {/* LAYER 1: Light Sage-Green Background */}
      <div
        className="absolute inset-0 w-full h-full z-[1]"
        style={{ backgroundColor: config.backgroundColor || "#E2ECE0" }}
      >
        <Image
          src={config.backgroundImage}
          alt="Square Furniture Hero Background"
          fill
          priority
          sizes="100vw"
          className="object-cover w-full h-full opacity-100"
        />
      </div>

      {/* LAYER 2: Large Organic Dark-Green Curved Background Shape */}
      <div className="absolute inset-0 w-full h-full z-[2] overflow-hidden pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={config.organicShapeImage}
          alt="Organic Dark Green Curved Backdrop"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      </div>
    </div>
  );
}
