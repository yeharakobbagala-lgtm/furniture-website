"use client";

import React from "react";

interface FurnitureImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  style?: React.CSSProperties;
}

export default function FurnitureImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  style,
}: FurnitureImageProps) {
  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-end pointer-events-none select-none z-20 ${className}`}
      style={style}
    >
      {/* Furniture Product Image - bottom aligned to uniform baseline with smooth interactive hover lift */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`w-auto h-auto object-contain object-bottom filter drop-shadow-[0_10px_16px_rgba(0,0,0,0.22)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108 group-hover:-translate-y-3 group-hover:drop-shadow-[0_20px_28px_rgba(0,0,0,0.32)] ${imgClassName}`}
        loading="lazy"
      />
    </div>
  );
}
