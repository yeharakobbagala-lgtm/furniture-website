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
        }).catch(() => {});
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
    <div className="relative w-full min-h-[100dvh] bg-[#E5EDE1] text-[#173C2B] overflow-x-hidden flex flex-col justify-between select-none">
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
                    className={`relative rounded-[19px] overflow-hidden transition-all duration-300 ${
                      isCenter
                        ? "border-[2.5px] border-[#65D9A0] shadow-[0_10px_24px_rgba(101,217,160,0.4),0_6px_16px_rgba(23,60,43,0.14)]"
                        : "border-[1.5px] border-white/80 shadow-[0_4px_12px_rgba(23,60,43,0.08)] opacity-90 hover:opacity-100"
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
                    <div className="absolute top-0 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
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
            {/* Category Tag */}
            <span className="text-[10px] uppercase tracking-[0.22em] font-extrabold text-[#587763]">
              {activeCategory.tag}
            </span>

            {/* Headline in Orange Avenue / Serif */}
            <h1
              className="font-orangeAvenue text-[#173C2B] text-[34px] sm:text-[38px] leading-[1.06] tracking-[-0.015em] font-medium mt-1"
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
      {/* 5. CATEGORY FILTER CHIPS (ROUNDED PILLS)                     */}
      {/* ============================================================ */}
      <div className="w-full max-w-[420px] mx-auto px-5 sm:px-6 py-2.5 z-10">
        <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar py-0.5">
          {activeCategory.pills.map((pill) => {
            const isSelected = selectedPill === pill;
            return (
              <button
                key={pill}
                onClick={() => setSelectedPill(isSelected ? null : pill)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? "bg-[#173C2B] text-white border-[#173C2B] shadow-xs"
                    : "bg-[#EAF3E7]/80 hover:bg-white text-[#173C2B] border-[#C9D9C8] shadow-2xs"
                }`}
              >
                {pill}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 6. FEATURED CATEGORY CARD (WHITE FLOATING CAPSULE)           */}
      {/* ============================================================ */}
      <div className="w-full max-w-[420px] mx-auto px-5 sm:px-6 py-1 z-10">
        <Link
          href={`/shop/${activeCategory.slug}`}
          onClick={() => onExplore?.(activeCategory.slug)}
          className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-3xl bg-white shadow-[0_8px_24px_rgba(23,60,43,0.08)] border border-white/90 hover:shadow-[0_12px_32px_rgba(23,60,43,0.12)] transition-all duration-300 active:scale-[0.99]"
        >
          {/* Left Square Icon */}
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#EAF5E7] text-[#173C2B] flex items-center justify-center shrink-0 border border-[#D5E5D1]">
            <ActiveIcon className="w-6 h-6 stroke-[1.8]" />
          </div>

          {/* Center Category Title & Subtitle */}
          <div className="flex-1 min-w-0 px-3.5 text-left">
            <h3 className="font-heading font-extrabold text-base text-[#173C2B] leading-tight truncate">
              {activeCategory.name}
            </h3>
            <p className="text-[11px] sm:text-xs text-[#587763] truncate mt-0.5">
              {activeCategory.subtitle}
            </p>
          </div>

          {/* Right Dark Forest-Green Circular Arrow Button */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#173C2B] group-hover:bg-[#D94D1E] text-white flex items-center justify-center shrink-0 shadow-md transition-colors duration-300">
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      </div>

      {/* ============================================================ */}
      {/* 7. SOCIAL INTERACTION BUTTONS (FAVOURITE, SAVE, SHARE)       */}
      {/* ============================================================ */}
      <div className="w-full max-w-[420px] mx-auto px-5 sm:px-6 py-2 z-10 flex items-center justify-center gap-4">
        {/* Wishlist / Favourite */}
        <button
          onClick={() => setLiked(!liked)}
          aria-label="Add category to wishlist"
          className={`w-11 h-11 rounded-full flex items-center justify-center border shadow-xs transition-all active:scale-95 ${
            liked
              ? "bg-[#D94D1E] border-[#D94D1E] text-white shadow-md"
              : "bg-white/80 hover:bg-white text-[#173C2B] border-white/80"
          }`}
        >
          <Heart className={`w-4.5 h-4.5 ${liked ? "fill-white" : ""}`} />
        </button>

        {/* Save / Bookmark */}
        <button
          onClick={() => setSaved(!saved)}
          aria-label="Bookmark collection"
          className={`w-11 h-11 rounded-full flex items-center justify-center border shadow-xs transition-all active:scale-95 ${
            saved
              ? "bg-[#173C2B] border-[#173C2B] text-white shadow-md"
              : "bg-white/80 hover:bg-white text-[#173C2B] border-white/80"
          }`}
        >
          <Bookmark className={`w-4.5 h-4.5 ${saved ? "fill-white" : ""}`} />
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          aria-label="Share collection"
          className="relative w-11 h-11 rounded-full bg-white/80 hover:bg-white text-[#173C2B] border border-white/80 shadow-xs flex items-center justify-center transition-all active:scale-95"
        >
          {copied ? <Check className="w-4.5 h-4.5 text-emerald-600" /> : <Share2 className="w-4.5 h-4.5" />}
          {copied && (
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#173C2B] text-white text-[9.5px] font-bold px-2 py-0.5 rounded shadow">
              Copied!
            </span>
          )}
        </button>
      </div>

      {/* ============================================================ */}
      {/* 8. PRIMARY CTA (BURNT ORANGE / TERRACOTTA PILL)              */}
      {/* ============================================================ */}
      <div className="w-full max-w-[420px] mx-auto px-5 sm:px-6 py-2 z-10 flex justify-center">
        <Link
          href={`/shop/${activeCategory.slug}`}
          onClick={() => onExplore?.(activeCategory.slug)}
          className="w-full max-w-[340px] py-3.5 sm:py-4 px-8 rounded-full bg-[#D94D1E] hover:bg-[#C23F14] text-white font-heading font-extrabold text-[13px] sm:text-sm uppercase tracking-wider shadow-[0_8px_25px_rgba(217,77,30,0.35)] flex items-center justify-center gap-2 active:scale-98 transition-all select-none"
        >
          <span>Explore Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ============================================================ */}
      {/* 9. BOTTOM COLLECTION NAVIGATION (< & >)                      */}
      {/* ============================================================ */}
      <div className="w-full max-w-[420px] mx-auto px-5 sm:px-6 pt-1 pb-5 sm:pb-6 z-10 flex items-center justify-center gap-3">
        <button
          onClick={handlePrev}
          aria-label="Previous category collection"
          className="w-11 h-11 rounded-full bg-white/80 hover:bg-white text-[#173C2B] border border-white/80 shadow-xs flex items-center justify-center transition-all active:scale-90"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Next category collection"
          className="w-11 h-11 rounded-full bg-white/80 hover:bg-white text-[#173C2B] border border-white/80 shadow-xs flex items-center justify-center transition-all active:scale-90"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
