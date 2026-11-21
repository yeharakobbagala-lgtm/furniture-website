"use client";

import React from "react";
import { HeroConfig } from "@/data/hero-config";

interface HeroDecorationsProps {
  config: HeroConfig;
}

export default function HeroDecorations({ config }: HeroDecorationsProps) {
  return (
    <>
      {/* LAYER 4: Wooden Side Table with Vase and Decorative Elements (z-index 4) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-[4]">
        {/* Desktop position: Far right side, aligned beside chair */}
        <div className="hidden lg:block absolute right-0 top-[26%] w-[23%] max-w-[440px] h-[42%] max-h-[45vh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={config.sideTableCropped || config.sideTableImage}
            alt="Handcrafted solid wooden side table with ceramic vase and art books"
            className="w-full h-full object-contain object-right-bottom drop-shadow-lg"
          />
        </div>

        {/* Tablet view */}
        <div className="hidden sm:block lg:hidden absolute right-0 bottom-[10%] w-[24%] max-w-[200px] h-[34%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={config.sideTableCropped || config.sideTableImage}
            alt="Side table with vase"
            className="w-full h-full object-contain object-right-bottom"
          />
        </div>
      </div>

      {/* LAYER 5: Hanging Gold Pendant Lights (z-index 5) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-[5]">
        {/* Desktop position: Hanging gracefully from top right ceiling */}
        <div className="hidden lg:block absolute right-[18%] top-0 w-[10%] max-w-[190px] h-[32%] max-h-[35vh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={config.pendantCropped || config.pendantImage}
            alt="Hanging gold architectural pendant light fixture"
            className="w-full h-full object-contain object-top drop-shadow-md"
          />
        </div>

        {/* Tablet & Mobile view */}
        <div className="block lg:hidden absolute right-[14%] sm:right-[18%] top-0 w-[12%] sm:w-[10%] max-w-[110px] h-[26%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={config.pendantCropped || config.pendantImage}
            alt="Hanging pendant light"
            className="w-full h-full object-contain object-top"
          />
        </div>
      </div>
    </>
  );
}
