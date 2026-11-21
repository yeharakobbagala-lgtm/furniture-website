"use client";

import React from "react";
import { BestSellerItem } from "@/data/best-sellers";
import FurnitureImage from "./FurnitureImage";
import ExploreButton from "./ExploreButton";

interface BestSellerCardProps {
  item: BestSellerItem;
}

export default function BestSellerCard({ item }: BestSellerCardProps) {
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
        Dark Forest-Green Card Body (#263F2D):
        Rounded corners, clean spacing, housing category, title and explore button.
      */}
      <div className="relative w-full rounded-[28px] sm:rounded-[32px] bg-[#263F2D] p-6 sm:p-7 pt-20 sm:pt-24 flex flex-col justify-between min-h-[310px] sm:min-h-[330px] shadow-soft border border-[#34533d]/40 transition-all duration-300 group-hover:shadow-floating group-hover:-translate-y-1">
        {/* Subtle radial ambient gradient for tactile depth */}
        <div className="absolute inset-0 rounded-[28px] sm:rounded-[32px] bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

        {/* Card Content: Category & Two-Line Title */}
        <div className="relative z-10 space-y-2 mb-6">
          <span className="block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-white/80 font-sans">
            {item.category}
          </span>
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

        {/* Explore More Button */}
        <div className="relative z-10 pt-1">
          <ExploreButton href={item.destination} />
        </div>
      </div>
    </div>
  );
}
