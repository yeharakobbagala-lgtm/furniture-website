"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Bookmark,
  Share2,
  ArrowRight,
  Armchair,
  Sofa,
  Bed,
  Archive,
  Search,
  ShoppingBag,
  Menu,
  Check,
} from "lucide-react";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";

// Custom Dining Table Icon
function DiningTableIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M4 6v12M20 6v12M7 6v6M17 6v6M7 12h10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Custom Lamp Icon
function LampIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 3h6l3 7H6l3-7zM12 10v11M8 21h8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export interface CategoryData {
  id: string;
  name: string;
  tag: string;
  subtitle: string;
  description: string;
  slug: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  pills: string[];
}

export const defaultCategories: CategoryData[] = [
  {
    id: "living-room",
    name: "Living Room",
    tag: "CATEGORY",
    subtitle: "Modular Sofas, Credenzas & Accent Tables",
    description: "Curated Scandinavian seating and solid timber cabinetry designed for serene gatherings.",
    slug: "sofas",
    image: "/categories/storage_v2.webp",
    icon: Sofa,
    pills: ["Sectionals", "Loveseats", "Ottomans", "Media Units", "Sideboards"],
  },
  {
    id: "dining-room",
    name: "Dining Room",
    tag: "CATEGORY",
    subtitle: "Solid Oak Tables, Chairs & Credenzas",
    description: "Handcrafted timber dining suites and tactile upholstered seating for shared memories.",
    slug: "dining-tables",
    image: "/categories/tables_v2.webp",
    icon: DiningTableIcon,
    pills: ["Dining Tables", "Dining Chairs", "Credenzas", "Bar Stools", "Benches"],
  },
  {
    id: "lounge-chairs",
    name: "Lounge & Chairs",
    tag: "CATEGORY",
    subtitle: "Accent Armchairs, Recliners, Ottomans & more",
    description: "Sculptural silhouette armchairs crafted with steam-bent timber, warm bouclé, and deep cushioning.",
    slug: "lounge-chairs",
    image: "/categories/chairs_v2.webp",
    icon: Armchair,
    pills: ["Lounge Chairs", "Swivel Chairs", "Ottomans", "Daybeds", "Side Tables"],
  },
  {
    id: "sofas",
    name: "Sofa Suites",
    tag: "CATEGORY",
    subtitle: "Deep-Seat Bouclé & Curved Sectionals",
    description: "Architectural proportions, feather-down fills, and durable textured linen finishes.",
    slug: "sofas",
    image: "/categories/sofas_v2.webp",
    icon: Sofa,
    pills: ["Curved Sofas", "L-Shapes", "Daybeds", "Chaises", "Modulars"],
  },
  {
    id: "bedroom",
    name: "Bedroom Suites",
    tag: "CATEGORY",
    subtitle: "Platform Beds, Nightstands & Wardrobes",
    description: "Low-profile upholstered platform beds and fluted timber joinery for restful slumber.",
    slug: "beds",
    image: "/bestsellers/dining-table-walnut.webp",
    icon: Bed,
    pills: ["Platform Beds", "Nightstands", "Wardrobes", "Dressers", "Vanities"],
  },
];

interface MobileCategoryViewProps {
  initialIndex?: number;
  initialSlug?: string;
  onExplore?: (slug: string) => void;
  showHeader?: boolean;
}

export default function MobileCategoryView({
  initialIndex,
  initialSlug,
  onExplore,
  showHeader = true,
}: MobileCategoryViewProps) {
  // Determine starting index (default to lounge-chairs / index 2 to match reference)
  const defaultIdx = useMemo(() => {
    if (initialSlug) {
      const found = defaultCategories.findIndex((c) => c.slug === initialSlug || c.id === initialSlug);
      if (found !== -1) return found;
    }
    return initialIndex !== undefined ? initialIndex : 2;
  }, [initialSlug, initialIndex]);

  const [activeIndex, setActiveIndex] = useState(defaultIdx);
  const [selectedPill, setSelectedPill] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const cartItemCount = useCartStore((s) => s.getItemCount());
  const activeCategory = defaultCategories[activeIndex] || defaultCategories[2];
  const ActiveIcon = activeCategory.icon;

  const total = defaultCategories.length;

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
    setSelectedPill(null);
  }, [total]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
    setSelectedPill(null);
  }, [total]);

  // Auto-move rotation along the orbital trajectory
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
      setSelectedPill(null);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, total]);

  const handleShare = useCallback(() => {
    if (typeof window !== "undefined") {
      if (navigator.share) {
        navigator.share({
          title: `Square — ${activeCategory.name}`,
          text: activeCategory.description,
          url: window.location.href,
        }).catch(() => { });
      } else {
        navigator.clipboard?.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  }, [activeCategory]);

  // Compute 5 relative card slots for orbital presentation around activeIndex
  const orbitalCards = useMemo(() => {
    const offsets = [-2, -1, 0, 1, 2];
    return offsets.map((offset) => {
      const idx = (activeIndex + offset + total) % total;
      return {
        item: defaultCategories[idx],
        index: idx,
        offset, // -2, -1, 0, 1, 2
      };
    });
  }, [activeIndex, total]);

  return (
    <div className="relative w-full min-h-[100dvh] bg-gradient-to-b from-[#E3ECE0] via-[#E8EFE5] to-[#DFE9DC] text-[#173C2B] overflow-x-hidden flex flex-col justify-between select-none">
      {/* ============================================================ */}
      {/* LIQUID GLASS AMBIENT LIGHT & REFRACTION ORBS (APPLE UI)     */}
      {/* ============================================================ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft organic decorative curves */}
        <div className="absolute top-0 left-0 w-40 h-28 bg-gradient-to-br from-white/50 to-transparent rounded-br-[120px] pointer-events-none opacity-80" />
        <div className="absolute top-12 right-0 w-48 h-36 bg-gradient-to-bl from-[#8EB497]/25 to-transparent rounded-bl-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-52 h-36 bg-gradient-to-tl from-[#173C2B]/12 to-transparent rounded-tl-[160px] pointer-events-none" />

        {/* Luminous Apple Spatial refraction orbs */}
        {/* Vibrant emerald/mint orb behind orbital arc */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#4CD895]/22 blur-[95px] transform-gpu" />
        {/* Warm apricot/terracotta ambient glow behind category title & pills */}
        <div className="absolute top-1/3 -right-20 w-88 h-88 rounded-full bg-[#FF9A6C]/22 blur-[100px] transform-gpu" />
        {/* Deep forest liquid glow behind featured card */}
        <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-[#173C2B]/16 blur-[85px] transform-gpu" />
        {/* Warm terracotta liquid glow behind action buttons & CTA */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-88 h-72 rounded-full bg-[#E05424]/16 blur-[90px] transform-gpu" />
        {/* Subtle mesh backdrop sheen */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/40" />
      </div>
      {/* ============================================================ */}
      {/* 1. FLOATING PALE-MINT MOBILE HEADER                          */}
      {/* ============================================================ */}
      {showHeader && (
        <header className="fixed top-3 left-3 right-3 sm:left-4 sm:right-4 z-40 pointer-events-none">
          <div className="w-full max-w-[440px] mx-auto pointer-events-auto">
            <div className="header-liquid-glass rounded-full py-2 px-3 sm:px-4 flex items-center justify-between shadow-[0_8px_25px_rgba(23,60,43,0.08)]">
              {/* Left Brand Identity */}
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-xl bg-[#173C2B] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
                    <path d="M9 21V12h6v9" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-extrabold text-[15px] tracking-wider text-[#173C2B] leading-none">
                    SQUARE
                  </span>
                  <span className="text-[8.5px] uppercase tracking-[0.2em] text-[#587763] font-medium leading-tight mt-0.5">
                    Furniture & Living
                  </span>
                </div>
              </Link>

              {/* Right Action Icons: Search, Bag, Hamburger Menu */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Link
                  href="/shop"
                  aria-label="Search"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#173C2B] bg-white/30 hover:bg-white/50 backdrop-blur-md border border-white/50 transition-all active:scale-95"
                >
                  <Search className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/cart"
                  aria-label="Shopping bag"
                  className="relative w-8 h-8 rounded-full flex items-center justify-center text-[#173C2B] bg-white/30 hover:bg-white/50 backdrop-blur-md border border-white/50 transition-all active:scale-95"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#D94D1E] text-white text-[8.5px] font-bold flex items-center justify-center shadow-xs">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/shop"
                  aria-label="Menu"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#173C2B] bg-white/30 hover:bg-white/50 backdrop-blur-md border border-white/50 transition-all active:scale-95"
                >
                  <Menu className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* ============================================================ */}
      {/* 3. ORBITAL FURNITURE IMAGE GALLERY (KEY VISUAL FEATURE)      */}
      {/* ============================================================ */}
      <div className={`relative w-full ${showHeader ? "pt-20 sm:pt-22" : "pt-8 sm:pt-10"} pb-2 z-10 flex flex-col items-center`}>
        <div className="relative w-full max-w-[420px] h-[145px] sm:h-[160px] flex items-center justify-center overflow-visible scale-[0.92] min-[390px]:scale-100 origin-center">
          {/* Subtle curved orbital connecting arc line behind cards */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox="0 0 400 160"
            fill="none"
          >
            <path
              d="M 15 125 Q 200 15 385 125"
              stroke="#8EB497"
              strokeWidth="1.5"
              strokeOpacity="0.45"
            />
          </svg>

          {/* 5 Orbital Gallery Cards with Touch Swipe & Drag */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            onDragEnd={(_, info) => {
              if (info.offset.x < -25 || info.velocity.x < -180) {
                handleNext();
              } else if (info.offset.x > 25 || info.velocity.x > 180) {
                handlePrev();
              }
            }}
            className="relative w-full h-full flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing touch-pan-y"
          >
            {orbitalCards.map(({ item, index, offset }) => {
              const isCenter = offset === 0;

              // Orbital dynamic geometric calculations: slightly smaller cards with clean gaps
              let rotateDeg = 0;
              let translateY = 0;
              let scale = 1;
              let zIndex = 10;
              let cardW = 70;
              let cardH = 70;
              let translateX = 0;

              if (offset === -2) {
                rotateDeg = -12;
                translateY = 22;
                scale = 0.88;
                zIndex = 10;
                cardW = 62;
                cardH = 62;
                translateX = -158;
              } else if (offset === -1) {
                rotateDeg = -5;
                translateY = 8;
                scale = 0.94;
                zIndex = 20;
                cardW = 70;
                cardH = 70;
                translateX = -84;
              } else if (offset === 0) {
                rotateDeg = 0;
                translateY = -2;
                scale = 1.05;
                zIndex = 30;
                cardW = 82;
                cardH = 82;
                translateX = 0;
              } else if (offset === 1) {
                rotateDeg = 5;
                translateY = 8;
                scale = 0.94;
                zIndex = 20;
                cardW = 70;
                cardH = 70;
                translateX = 84;
              } else if (offset === 2) {
                rotateDeg = 12;
                translateY = 22;
                scale = 0.88;
                zIndex = 10;
                cardW = 62;
                cardH = 62;
                translateX = 158;
              }

              return (
                <motion.div
                  key={`${item.id}-${offset}`}
                  onClick={() => {
                    setActiveIndex(index);
                    setSelectedPill(null);
                  }}
                  animate={{
                    x: translateX,
                    y: translateY,
                    rotate: rotateDeg,
                    scale,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 24,
                    mass: 0.8,
                  }}
                  style={{ zIndex }}
                  className="absolute cursor-pointer origin-center"
                >
                  <div
                    style={{ width: `${cardW}px`, height: `${cardH}px` }}
                    className={`relative rounded-[22px] overflow-hidden transition-all duration-300 ${isCenter
                      ? "border-[2.5px] border-[#43CA87] shadow-[0_0_28px_rgba(67,202,135,0.5),0_12px_28px_rgba(23,60,43,0.18),inset_0_2px_3px_rgba(255,255,255,1)]"
                      : "border-[1.5px] border-white/90 shadow-[0_8px_20px_rgba(23,60,43,0.08),inset_0_1.5px_2px_rgba(255,255,255,0.9)] opacity-90 hover:opacity-100 backdrop-blur-md"
                      }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                    {/* Top specular reflection line */}
                    <div className="absolute top-0 left-2 right-2 h-[1.5px] bg-gradient-to-r from-transparent via-white/95 to-transparent pointer-events-none" />
                    {/* Subtle bottom bevel reflection */}
                    <div className="absolute bottom-0 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent pointer-events-none" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. CATEGORY INFORMATION                                      */}
      {/* ============================================================ */}
      <div className="w-full max-w-[420px] mx-auto px-5 sm:px-6 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-start"
          >
            {/* Category Tag as Apple Liquid Glass Capsule */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/55 backdrop-blur-xl border border-white/80 border-t-white/95 text-[9.5px] uppercase tracking-[0.22em] font-extrabold text-[#234E37] shadow-[0_3px_10px_rgba(23,60,43,0.06),inset_0_1.5px_2px_rgba(255,255,255,0.95)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3D8B62] animate-pulse" />
              {activeCategory.tag}
            </span>

            {/* Headline in Orange Avenue / Serif */}
            <h1
              className="font-orangeAvenue text-[#173C2B] text-[34px] sm:text-[38px] leading-[1.06] tracking-[-0.015em] font-medium mt-1.5"
              style={{
                fontFamily: "var(--font-orange-avenue), 'OrangeAvenue', serif",
                fontFeatureSettings: '"liga" 1, "dlig" 1, "calt" 1, "swsh" 1, "ss01" 0',
                fontVariantLigatures: "common-ligatures discretionary-ligatures contextual",
                WebkitTextStroke: "0.45px currentColor",
                paintOrder: "stroke fill",
              }}
            >
              {activeCategory.name}
            </h1>

            {/* Category Description */}
            <p className="text-[12.5px] sm:text-[13px] text-[#587763] leading-[1.5] max-w-[340px] mt-2">
              {activeCategory.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ============================================================ */}
      {/* 5. CATEGORY FILTER CHIPS (APPLE LIQUID GLASS PILLS)          */}
      {/* ============================================================ */}
      <div className="w-full max-w-[420px] mx-auto px-5 sm:px-6 py-2.5 z-10">
        <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar py-0.5">
          {activeCategory.pills.map((pill) => {
            const isSelected = selectedPill === pill;
            return (
              <button
                key={pill}
                onClick={() => setSelectedPill(isSelected ? null : pill)}
                className={`group relative px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 active:scale-95 overflow-hidden ${isSelected
                  ? "bg-gradient-to-r from-[#173C2B] via-[#1E4D36] to-[#173C2B] text-white border border-white/35 shadow-[0_8px_22px_rgba(23,60,43,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.5)]"
                  : "bg-gradient-to-b from-white/70 via-white/50 to-white/35 hover:bg-white/75 backdrop-blur-2xl text-[#173C2B] border border-white/85 border-t-white/95 shadow-[0_4px_16px_rgba(23,60,43,0.06),inset_0_1.5px_2px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(0,0,0,0.03)]"
                  }`}
              >
                {/* Specular highlight glint on pill */}
                <div className={`absolute top-0 left-2 right-2 h-[1px] pointer-events-none ${isSelected
                  ? "bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  : "bg-gradient-to-r from-transparent via-white/95 to-transparent"
                  }`} />
                <span className="relative z-10">{pill}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 6. FEATURED CATEGORY CARD (APPLE LIQUID GLASS CAPSULE)       */}
      {/* ============================================================ */}
      <div className="w-full max-w-[420px] mx-auto px-5 sm:px-6 py-1.5 z-10">
        <Link
          href={`/shop/${activeCategory.slug}`}
          onClick={() => onExplore?.(activeCategory.slug)}
          className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-[28px] bg-gradient-to-b from-white/80 via-white/55 to-white/40 backdrop-blur-3xl border border-white/90 border-t-white shadow-[0_20px_50px_rgba(23,60,43,0.12),0_4px_12px_rgba(23,60,43,0.06),inset_0_2px_3px_rgba(255,255,255,0.98),inset_0_-1.5px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_24px_56px_rgba(23,60,43,0.16)] transition-all duration-300 active:scale-[0.99] overflow-hidden"
        >
          {/* Top specular reflection beam */}
          <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-white/95 to-transparent pointer-events-none" />
          {/* Soft internal liquid shimmer orb */}
          <div className="absolute -top-10 -left-6 w-36 h-36 bg-white/40 rounded-full blur-2xl pointer-events-none" />

          {/* Left Square Icon in Frosted Glass */}
          <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-b from-white/90 to-white/60 backdrop-blur-xl text-[#173C2B] flex items-center justify-center shrink-0 border border-white/95 shadow-[0_6px_18px_rgba(23,60,43,0.08),inset_0_1.5px_2px_rgba(255,255,255,1)]">
            <ActiveIcon className="w-6 h-6 stroke-[1.8]" />
            <div className="absolute top-0 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />
          </div>

          {/* Center Category Title & Subtitle */}
          <div className="flex-1 min-w-0 px-3.5 text-left">
            <h3 className="font-heading font-extrabold text-[16px] sm:text-[17px] text-[#173C2B] leading-tight truncate">
              {activeCategory.name}
            </h3>
            <p className="text-[11.5px] sm:text-xs text-[#52745D] font-medium truncate mt-0.5">
              {activeCategory.subtitle}
            </p>
          </div>

          {/* Right Dark Forest-Green Liquid Glass Circular Arrow Button */}
          <div className="w-11 h-11 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-[#1C412E] to-[#11291D] group-hover:from-[#D94D1E] group-hover:to-[#B83E14] text-white flex items-center justify-center shrink-0 border border-white/35 border-t-white/60 shadow-[0_8px_20px_rgba(17,41,29,0.38),inset_0_1.5px_2px_rgba(255,255,255,0.45)] transition-all duration-300">
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      </div>

      {/* ============================================================ */}
      {/* 7. SOCIAL ACTION BUTTONS (APPLE LIQUID GLASS FLOATING ORBS) */}
      {/* ============================================================ */}
      <div className="w-full max-w-[420px] mx-auto px-5 sm:px-6 py-2.5 z-10 flex items-center justify-center gap-4">
        {/* Wishlist / Favourite */}
        <button
          onClick={() => setLiked(!liked)}
          aria-label="Add category to wishlist"
          className={`relative w-13 h-13 rounded-full flex items-center justify-center border transition-all active:scale-90 overflow-hidden ${liked
            ? "bg-gradient-to-b from-[#E25626] to-[#B83E14] border-white/45 border-t-white/70 text-white shadow-[0_10px_28px_rgba(224,84,36,0.45),inset_0_2px_2.5px_rgba(255,255,255,0.6)]"
            : "bg-gradient-to-b from-white/80 via-white/55 to-white/40 backdrop-blur-2xl text-[#173C2B] border-white/90 border-t-white shadow-[0_10px_26px_rgba(23,60,43,0.08),inset_0_2px_2.5px_rgba(255,255,255,0.98),inset_0_-1px_1.5px_rgba(0,0,0,0.04)] hover:bg-white/90"
            }`}
        >
          <div className="absolute top-1 left-2.5 right-2.5 h-[1px] bg-white/80 rounded-full pointer-events-none" />
          <Heart className={`w-5 h-5 ${liked ? "fill-white" : ""}`} />
        </button>

        {/* Save / Bookmark */}
        <button
          onClick={() => setSaved(!saved)}
          aria-label="Bookmark collection"
          className={`relative w-13 h-13 rounded-full flex items-center justify-center border transition-all active:scale-90 overflow-hidden ${saved
            ? "bg-gradient-to-b from-[#1E4532] to-[#122A1E] border-white/45 border-t-white/70 text-white shadow-[0_10px_28px_rgba(23,60,43,0.45),inset_0_2px_2.5px_rgba(255,255,255,0.5)]"
            : "bg-gradient-to-b from-white/80 via-white/55 to-white/40 backdrop-blur-2xl text-[#173C2B] border-white/90 border-t-white shadow-[0_10px_26px_rgba(23,60,43,0.08),inset_0_2px_2.5px_rgba(255,255,255,0.98),inset_0_-1px_1.5px_rgba(0,0,0,0.04)] hover:bg-white/90"
            }`}
        >
          <div className="absolute top-1 left-2.5 right-2.5 h-[1px] bg-white/80 rounded-full pointer-events-none" />
          <Bookmark className={`w-5 h-5 ${saved ? "fill-white" : ""}`} />
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          aria-label="Share collection"
          className="relative w-13 h-13 rounded-full bg-gradient-to-b from-white/80 via-white/55 to-white/40 backdrop-blur-2xl text-[#173C2B] border border-white/90 border-t-white shadow-[0_10px_26px_rgba(23,60,43,0.08),inset_0_2px_2.5px_rgba(255,255,255,0.98),inset_0_-1px_1.5px_rgba(0,0,0,0.04)] hover:bg-white/90 flex items-center justify-center transition-all active:scale-90 overflow-hidden"
        >
          <div className="absolute top-1 left-2.5 right-2.5 h-[1px] bg-white/80 rounded-full pointer-events-none" />
          {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
          {copied && (
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#173C2B] text-white text-[9.5px] font-bold px-2 py-0.5 rounded-full shadow-md">
              Copied!
            </span>
          )}
        </button>
      </div>

      {/* ============================================================ */}
      {/* 8. PRIMARY CTA (APPLE LIQUID TERRACOTTA PILL)                */}
      {/* ============================================================ */}
      <div className="w-full max-w-[420px] mx-auto px-5 sm:px-6 py-2 z-10 flex justify-center">
        <Link
          href={`/shop/${activeCategory.slug}`}
          onClick={() => onExplore?.(activeCategory.slug)}
          className="relative w-full max-w-[340px] py-4 px-8 rounded-full bg-gradient-to-r from-[#E05424] via-[#D94D1E] to-[#BE3B12] text-white font-heading font-extrabold text-[13px] sm:text-sm uppercase tracking-wider border border-white/35 border-t-white/60 shadow-[0_16px_40px_rgba(217,77,30,0.45),inset_0_2px_2.5px_rgba(255,255,255,0.55),inset_0_-1.5px_2px_rgba(0,0,0,0.18)] hover:shadow-[0_20px_48px_rgba(217,77,30,0.55)] flex items-center justify-center gap-2 active:scale-98 transition-all select-none overflow-hidden"
        >
          {/* Top specular highlight line */}
          <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
          <span className="relative z-10">Explore Collection</span>
          <ArrowRight className="w-4 h-4 relative z-10" />
        </Link>
      </div>

      {/* ============================================================ */}
      {/* 9. BOTTOM COLLECTION NAVIGATION (APPLE LIQUID GLASS PILLS)  */}
      {/* ============================================================ */}
      <div className="w-full max-w-[420px] mx-auto px-5 sm:px-6 pt-1 pb-5 sm:pb-6 z-10 flex items-center justify-center gap-3">
        <button
          onClick={handlePrev}
          aria-label="Previous category collection"
          className="relative w-12 h-12 rounded-full bg-gradient-to-b from-white/80 via-white/55 to-white/40 backdrop-blur-2xl text-[#173C2B] border border-white/90 border-t-white shadow-[0_8px_22px_rgba(23,60,43,0.08),inset_0_2px_2.5px_rgba(255,255,255,0.98)] hover:bg-white/90 flex items-center justify-center transition-all active:scale-90 overflow-hidden"
        >
          <div className="absolute top-1 left-2.5 right-2.5 h-[1px] bg-white/80 rounded-full pointer-events-none" />
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next category collection"
          className="relative w-12 h-12 rounded-full bg-gradient-to-b from-white/80 via-white/55 to-white/40 backdrop-blur-2xl text-[#173C2B] border border-white/90 border-t-white shadow-[0_8px_22px_rgba(23,60,43,0.08),inset_0_2px_2.5px_rgba(255,255,255,0.98)] hover:bg-white/90 flex items-center justify-center transition-all active:scale-90 overflow-hidden"
        >
          <div className="absolute top-1 left-2.5 right-2.5 h-[1px] bg-white/80 rounded-full pointer-events-none" />
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
