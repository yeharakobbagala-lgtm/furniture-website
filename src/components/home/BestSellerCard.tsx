"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ShoppingBag, Sparkles } from "lucide-react";
import { BestSellerItem } from "@/data/best-sellers";
import FurnitureImage from "./FurnitureImage";

interface BestSellerCardProps {
  item: BestSellerItem;
}

const priceLookup: Record<string, string> = {
  "bs-1": "LKR 1,280",
  "bs-2": "LKR 890",
  "bs-3": "LKR 380",
  "bs-4": "LKR 195",
};

export default function BestSellerCard({ item }: BestSellerCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  // Proportional sizing so the sofa is grand and wide, table is balanced, and individual chairs are natural
  const getImageSizing = (id: string) => {
    switch (id) {
      case "bs-1": // Anna Bouclé Sofa (wide 3-seater couch)
        return "max-w-[96%] max-h-[135px] sm:max-h-[145px]";
      case "bs-2": // Walnut Dining Table Set (table + 4 chairs)
        return "max-w-[92%] max-h-[130px] sm:max-h-[140px]";
      case "bs-3": // Avery Lounge Chair (single wide armchair)
        return "max-w-[76%] max-h-[135px] sm:max-h-[145px]";
      case "bs-4": // Lena Dining Chair (single dining chair)
        return "max-w-[62%] max-h-[130px] sm:max-h-[140px]";
      default:
        return "max-w-[85%] max-h-[135px] sm:max-h-[145px]";
    }
  };

  const price = priceLookup[item.id] || "LKR 299";

  return (
    <div className="group relative flex flex-col pt-24 sm:pt-28">
      {/* 
        Overlapping Furniture Image Stage:
        Fixed height container (h-[148px] sm:h-[158px]) with items-end ensures
        the feet of ALL furniture pieces align on the EXACT same horizontal baseline!
      */}
      <div className="absolute top-0 left-0 right-0 h-[148px] sm:h-[158px] z-20 flex items-end justify-center pointer-events-none px-2 sm:px-3">
        <FurnitureImage
          src={item.image}
          alt={item.name}
          imgClassName={getImageSizing(item.id)}
        />
      </div>

      {/* 
        Liquid Glass Dark Card Body:
        Refractive glassmorphism with top specular bevel, ambient warm backlighting,
        and dynamic cursor reflection (Apple VisionOS / Lumora / Illume style)
      */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full rounded-[28px] sm:rounded-[34px] liquid-glass-dark p-6 sm:p-7 pt-20 sm:pt-24 flex flex-col justify-between min-h-[320px] sm:min-h-[340px] shadow-floating border border-white/15 transition-all duration-500 group-hover:-translate-y-2 group-hover:border-white/30"
      >
        {/* Ambient Warm Backlight Glow inside card */}
        <div
          className={`absolute inset-0 rounded-[28px] sm:rounded-[34px] ambient-glow-warm pointer-events-none transition-opacity duration-500 ${
            isHovered ? "opacity-70" : "opacity-35"
          }`}
        />

        {/* Dynamic Specular Reflection following mouse cursor */}
        {isHovered && (
          <div
            className="absolute inset-0 rounded-[28px] sm:rounded-[34px] pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 220px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.12), transparent 70%)`,
            }}
          />
        )}

        {/* Top Rim Specular Line */}
        <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* Card Content: Category & Two-Line Title */}
        <div className="relative z-10 space-y-2 mb-6">
          <div className="flex items-center justify-between">
            <span className="block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#E0A97E] font-sans">
              {item.category}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-white/50 font-medium">
              Curated
            </span>
          </div>

          <h3 className="font-heading font-bold text-2xl sm:text-[26px] text-white tracking-tight leading-[1.16]">
            {item.titleLines ? (
              <>
                <span className="block">{item.titleLines[0]}</span>
                <span className="block">{item.titleLines[1]}</span>
              </>
            ) : (
              item.name
            )}
          </h3>
        </div>

        {/* Floating Liquid Glass Bottom Pill (Matches Illume / Lampby reference) */}
        <div className="relative z-10 pt-2">
          <Link
            href={item.destination}
            className="group/pill w-full flex items-center justify-between p-2 pl-4 rounded-2xl liquid-glass-pill-dark border border-white/20 transition-all duration-300 hover:border-white/45 hover:bg-white/15"
          >
            {/* Price Info */}
            <div className="flex flex-col">
              <span className="text-[10px] text-white/60 uppercase tracking-wider font-medium leading-none">
                Direct From Atelier
              </span>
              <span className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight mt-0.5">
                Price · {price}
              </span>
            </div>

            {/* Droplet Glass Action Button */}
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-soft transition-all duration-300 group-hover/pill:bg-[#B85232] group-hover/pill:scale-105">
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/pill:translate-x-0.5 group-hover/pill:-translate-y-0.5" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
