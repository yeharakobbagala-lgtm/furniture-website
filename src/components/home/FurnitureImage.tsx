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
      {/* Furniture Product Image - bottom aligned to uniform baseline */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`w-auto h-auto object-contain object-bottom filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.22)] transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-2 ${imgClassName}`}
        loading="lazy"
      />
    </div>
  );
}
