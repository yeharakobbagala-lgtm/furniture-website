"use client";

import React from "react";
import { FurnitureItemConfig } from "@/data/hero-config";
import DepthParallaxViewer from "@/components/ui/DepthParallaxViewer";

interface HeroFurnitureProps {
  furniture: FurnitureItemConfig;
}

export default function HeroFurniture({ furniture }: HeroFurnitureProps) {
  const imageSrc = furniture.croppedImage || furniture.image;
  const hasDepthMap = Boolean(furniture.depthMapUrl);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-[3]">
      {/* DESKTOP (>= lg) VIEW */}
      <div
        className="hidden lg:flex absolute items-center justify-center pointer-events-auto transition-all duration-500 ease-out"
        style={{
          left: furniture.position?.left || "42.5%",
          top: furniture.position?.top || "22%",
          width: furniture.position?.width || "41%",
          height: furniture.position?.height || "64%",
          maxHeight: "70vh",
          transform: furniture.position?.transform || "none",
        }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {hasDepthMap ? (
            <DepthParallaxViewer
              imageSrc={imageSrc}
              depthSrc={furniture.depthMapUrl!}
              alt={furniture.alt}
              className="w-full h-full max-h-[68vh] flex items-center justify-center"
              thresholdX={0.04}
              thresholdY={0.04}
              maxTiltAngle={8}
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={imageSrc}
              alt={furniture.alt}
              className="w-full h-full max-h-[68vh] object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
            />
          )}
        </div>
      </div>

      {/* TABLET & MOBILE VIEW (< lg): Responsive placement */}
      <div className="lg:hidden absolute bottom-[8%] sm:bottom-[10%] right-[3%] sm:right-[6%] w-[70%] sm:w-[58%] max-w-[440px] aspect-square flex items-center justify-center pointer-events-auto">
        <div className="relative w-full h-full flex items-center justify-center">
          {hasDepthMap ? (
            <DepthParallaxViewer
              imageSrc={imageSrc}
              depthSrc={furniture.depthMapUrl!}
              alt={furniture.alt}
              className="w-full h-full max-h-[48vh] flex items-center justify-center"
              thresholdX={0.025}
              thresholdY={0.025}
              maxTiltAngle={5}
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={imageSrc}
              alt={furniture.alt}
              className="w-full h-full max-h-[48vh] object-contain drop-shadow-xl"
            />
          )}
        </div>
      </div>
    </div>
  );
}
