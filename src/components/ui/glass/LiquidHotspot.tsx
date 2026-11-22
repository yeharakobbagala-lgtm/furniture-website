"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export interface HotspotData {
  id: string;
  title: string;
  category: string;
  price: string;
  material?: string;
  link: string;
  top: string;
  left: string;
}

interface LiquidHotspotProps {
  hotspot: HotspotData;
}

export default function LiquidHotspot({ hotspot }: LiquidHotspotProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="absolute z-20 pointer-events-auto select-none"
      style={{ top: hotspot.top, left: hotspot.left }}
    >
      {/* Outer Pulse Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        aria-label={`View details for ${hotspot.title}`}
        className="relative group w-8 h-8 rounded-full flex items-center justify-center focus:outline-none"
      >
        {/* Pulsing Ripple Rings */}
        <span className="absolute inset-0 rounded-full bg-white/20 animate-hotspot" />
        <span className="absolute inset-0 rounded-full border border-white/60 transition-transform duration-300 group-hover:scale-125" />

        {/* Center Frosted Bead */}
        <div className="w-5 h-5 rounded-full bg-white/85 backdrop-blur-md shadow-md flex items-center justify-center text-forest-deep border border-white transition-all duration-300 group-hover:bg-[#B85232] group-hover:text-white">
          <Plus className={`w-3 h-3 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
        </div>
      </button>

      {/* Floating Spatial Glass Tooltip Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.94 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-56 p-3.5 rounded-2xl liquid-glass-dark text-white border border-white/25 shadow-floating z-50 pointer-events-auto"
          >
            {/* Ambient Warm Backlight */}
            <div className="absolute inset-0 rounded-2xl ambient-glow-warm opacity-60 pointer-events-none" />

            <div className="relative z-10 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-terracotta flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> {hotspot.category}
                </span>
                <span className="text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
                  {hotspot.price}
                </span>
              </div>

              <h4 className="font-heading font-bold text-sm text-white leading-tight">
                {hotspot.title}
              </h4>

              {hotspot.material && (
                <p className="text-[11px] text-white/70 leading-snug">
                  {hotspot.material}
                </p>
              )}

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <Link
                  href={hotspot.link}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-terracotta hover:underline"
                >
                  <span>Explore piece</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
