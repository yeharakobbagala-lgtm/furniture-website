"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SplitText from "@/components/ui/SplitText";
import {
  Home,
  LayoutGrid,
  Heart,
  ShoppingCart,
  User,
  Bookmark,
  Share2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Sofa,
  Bed,
  Armchair,
  Archive,
} from "lucide-react";

// Custom Dining Table Icon
function DiningTableIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 7h18" />
      <path d="M6 7v11" />
      <path d="M18 7v11" />
      <path d="M6 12h12" />
    </svg>
  );
}

// Custom Lighting / Table Lamp Icon
function LampIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 2h6l3 7H6l3-7z" />
      <path d="M12 9v11" />
      <path d="M8 20h8" />
    </svg>
  );
}

interface CategoryItem {
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

const baseCategories: CategoryItem[] = [
  {
    id: "living-room",
    name: "Living Room",
    tag: "CATEGORY",
    subtitle: "Sofas, Chairs, Coffee Tables & More",
    description:
      "Create a warm and stylish living space with our curated living room collection.",
    slug: "sofas",
    image: "/categories/sofas_v2.webp",
    icon: Sofa,
    pills: ["Sofas", "Chairs", "Coffee Tables", "TV Units", "Storage"],
  },
  {
    id: "dining-room",
    name: "Dining Room",
    tag: "CATEGORY",
    subtitle: "Dining Tables, Chairs, Credenzas & More",
    description:
      "Elevate shared meals with handcrafted solid timber dining tables and ergonomic chairs.",
    slug: "dining-tables",
    image: "/bestsellers/dining-table-walnut.webp",
    icon: DiningTableIcon,
    pills: ["Dining Tables", "Dining Chairs", "Credenzas", "Bar Stools", "Benches"],
  },
  {
    id: "bedroom",
    name: "Bedroom",
    tag: "CATEGORY",
    subtitle: "Platform Beds, Nightstands, Wardrobes & More",
    description:
      "Transform your bedroom into a restful sanctuary with low-profile timber beds and tactile bouclé.",
    slug: "beds",
    image: "/categories/beds_v2.webp",
    icon: Bed,
    pills: ["Platform Beds", "Nightstands", "Wardrobes", "Dressers", "Vanities"],
  },
  {
    id: "storage",
    name: "Storage & Sideboards",
    tag: "CATEGORY",
    subtitle: "Fluted Credenzas, Bookcases, Consoles & More",
    description:
      "Seamless modular cabinetry with fluted oak fronts, soft-close joinery, and hidden cable routing.",
    slug: "storage",
    image: "/categories/storage_v2.webp",
    icon: Archive,
    pills: ["Credenzas", "Media Units", "Bookcases", "Shelving", "Cabinets"],
  },
  {
    id: "lighting-tables",
    name: "Lighting & Tables",
    tag: "CATEGORY",
    subtitle: "Pendant Lamps, Plinths, Accent Tables & More",
    description:
      "Architectural pendant lighting and travertine plinths sculpted to illuminate focal living zones.",
    slug: "dining-tables",
    image: "/categories/tables_v2.webp",
    icon: LampIcon,
    pills: ["Pendant Lights", "Floor Lamps", "Travertine Plinths", "Console Tables", "End Tables"],
  },
  {
    id: "lounge-chairs",
    name: "Lounge & Chairs",
    tag: "CATEGORY",
    subtitle: "Accent Armchairs, Recliners, Ottomans & More",
    description:
      "Sculptural silhouette armchairs crafted with steam-bent timber, warm bouclé, and deep cushioning.",
    slug: "lounge-chairs",
    image: "/categories/chairs_v2.webp",
    icon: Armchair,
    pills: ["Lounge Chairs", "Swivel Chairs", "Ottomans", "Daybeds", "Side Tables"],
  },
];

// Double the categories for an unbroken, seamless 360-degree circular orbit
const wheelItems: CategoryItem[] = [...baseCategories, ...baseCategories];

export default function CategorySection() {
  const [wheelAngle, setWheelAngle] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalItems = wheelItems.length; // 12 items
  const stepAngle = 360 / totalItems; // 30 degrees per item

  // Continuous smooth curve rotation (always moving smoothly)
  useEffect(() => {
    let animId: number;
    const glideSpeed = 0.05; // Degrees per frame - luxury smooth glide

    const tick = () => {
      if (!isHovered) {
        setWheelAngle((prev) => (prev + glideSpeed) % 360);
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isHovered]);

  // Active item is the card closest to 0° (horizontal center of the arc)
  const activeIndex = useMemo(() => {
    let closestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < totalItems; i++) {
      const base = i * stepAngle;
      let diff = ((base + wheelAngle) % 360 + 360) % 360;
      if (diff > 180) diff -= 360;
      const absDiff = Math.abs(diff);

      if (absDiff < minDistance) {
        minDistance = absDiff;
        closestIndex = i;
      }
    }
    return closestIndex;
  }, [wheelAngle, totalItems, stepAngle]);

  const activeCategory = wheelItems[activeIndex];

  // Rotate wheel to center an item
  const rotateToCategory = (index: number) => {
    const targetBase = index * stepAngle;
    const currentNorm = ((wheelAngle % 360) + 360) % 360;
    const targetNorm = ((-targetBase % 360) + 360) % 360;
    let diff = targetNorm - currentNorm;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    setWheelAngle((prev) => prev + diff);
  };

  const handlePrev = () => {
    setWheelAngle((prev) => prev + stepAngle);
  };

  const handleNext = () => {
    setWheelAngle((prev) => prev - stepAngle);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const ActiveIcon = activeCategory.icon;

  // Geometric radius and center origin for the circular track
  const radius = 345;
  const originX = -75;
  const originY = 300;

  return (
    <section
      className="relative w-full py-12 sm:py-16 lg:py-20 bg-[#DFEADA] overflow-hidden select-none border-b border-borderSage/70"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Square Furniture Curved Category Showcase"
    >
      {/* ========================================================== */}
      {/* 1. ORGANIC CORNER CURVES (EXACT TO REFERENCE IMAGE)        */}
      {/* ========================================================== */}
      {/* Top-Left Dark-Green Curve */}
      <div className="absolute top-0 left-0 w-[160px] sm:w-[220px] h-[100px] sm:h-[140px] bg-[#22442F] rounded-br-[160px] pointer-events-none opacity-90 z-0" />

      {/* Top-Right Dark-Green Curved Organic Blob */}
      <div className="absolute top-0 right-0 w-[240px] sm:w-[340px] lg:w-[400px] h-[160px] sm:h-[220px] lg:h-[250px] bg-[#22442F] rounded-bl-[180px] pointer-events-none opacity-90 z-0" />

      {/* Bottom-Right Dark-Green Curved Wave Accent */}
      <div className="absolute bottom-0 right-0 w-[300px] sm:w-[420px] lg:w-[480px] h-[140px] sm:h-[180px] lg:h-[210px] bg-[#1E3B29] rounded-tl-[200px] pointer-events-none opacity-85 z-0" />

      {/* Bottom-Left Organic Dark-Green Curve */}
      <div className="absolute bottom-0 left-0 w-[180px] h-[90px] bg-[#22442F] rounded-tr-[160px] pointer-events-none opacity-80 z-0" />

      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14">
        {/* Main 2-Column Responsive Layout: Left Curved Wheel + Center Details vs Right Category Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center min-h-[600px] lg:min-h-[640px]">

          {/* ========================================================== */}
          {/* 2. THE CURVED MOVING WHEEL ARC & CENTER DETAILS (Cols 1-7) */}
          {/* ========================================================== */}
          <div className="lg:col-span-7 xl:col-span-7 relative flex flex-col md:flex-row items-center min-h-[540px] lg:min-h-[600px] overflow-hidden lg:overflow-visible">

            {/* A. FLOATING VERTICAL PILL DOCK (Far Left inside curve) */}
            <div className="hidden sm:flex flex-col items-center gap-5 sm:gap-6 py-6 px-3 rounded-full bg-white/70 backdrop-blur-2xl border border-white/80 shadow-[0_12px_35px_rgba(20,55,35,0.08)] z-30 shrink-0 mr-3 lg:mr-4">
              {/* 1. Home */}
              <Link href="/" title="Home" className="text-[#1F432C]/75 hover:text-[#1F432C] transition-colors">
                <Home className="w-5 h-5" />
              </Link>

              {/* 2. Categories (Active Green Circle) */}
              <div className="w-10 h-10 rounded-full bg-[#22442F] text-white flex items-center justify-center shadow-md">
                <LayoutGrid className="w-5 h-5" />
              </div>

              {/* 3. Wishlist */}
              <Link href="/wishlist" title="Wishlist" className="text-[#1F432C]/75 hover:text-[#1F432C] transition-colors">
                <Heart className="w-5 h-5" />
              </Link>

              {/* 4. Cart */}
              <Link href="/cart" title="Cart" className="text-[#1F432C]/75 hover:text-[#1F432C] transition-colors">
                <ShoppingCart className="w-5 h-5" />
              </Link>

              {/* 5. User */}
              <Link href="/account" title="Account" className="text-[#1F432C]/75 hover:text-[#1F432C] transition-colors">
                <User className="w-5 h-5" />
              </Link>
            </div>

            {/* B. THE CONTINUOUS MOVING CURVED TRACK (Circular Ribbon) */}
            <div className="relative w-full md:w-[320px] lg:w-[360px] xl:w-[400px] h-[480px] sm:h-[520px] lg:h-[600px] shrink-0 flex items-center justify-center">

              {/* Concentric Guide Rails (Inner & Outer Track Borders) */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                viewBox="0 0 400 600"
              >
                {/* Inner Border Rail of the Ribbon */}
                <circle
                  cx={originX}
                  cy={originY}
                  r={radius - 75}
                  fill="none"
                  stroke="#22442F"
                  strokeWidth="2.5"
                  strokeOpacity="0.3"
                />
                {/* Outer Border Rail of the Ribbon */}
                <circle
                  cx={originX}
                  cy={originY}
                  r={radius + 75}
                  fill="none"
                  stroke="#22442F"
                  strokeWidth="2.5"
                  strokeOpacity="0.3"
                />
              </svg>

              {/* The Moving Curved Sector Cards Track */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {wheelItems.map((cat, i) => {
                  const baseAngle = i * stepAngle;
                  let angle = ((baseAngle + wheelAngle) % 360 + 360) % 360;
                  if (angle > 180) angle -= 360;

                  // Only render visible items along the front curve [-95°, +95°]
                  const isVisible = angle >= -94 && angle <= 94;
                  if (!isVisible) return null;

                  const rad = (angle * Math.PI) / 180;
                  const x = originX + radius * Math.cos(rad);
                  const y = originY + radius * Math.sin(rad);

                  const isActive = i === activeIndex;

                  return (
                    <div
                      key={`${cat.id}-${i}`}
                      onClick={() => rotateToCategory(i)}
                      style={{
                        position: "absolute",
                        left: `${x}px`,
                        top: `${y}px`,
                        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                        transformOrigin: "center center",
                      }}
                      className={`pointer-events-auto cursor-pointer transition-transform duration-300 ${
                        isActive ? "z-30 scale-108" : "z-10 scale-95 opacity-85 hover:opacity-100"
                      }`}
                    >
                      {/* The Curved Image Card matching the reference */}
                      <div
                        className={`relative w-[130px] sm:w-[155px] lg:w-[165px] h-[95px] sm:h-[110px] lg:h-[118px] rounded-[20px] overflow-hidden transition-all duration-300 ${
                          isActive
                            ? "border-[3.5px] border-[#68D391] shadow-[0_0_28px_rgba(104,211,145,0.75),0_12px_26px_rgba(0,0,0,0.28)]"
                            : "border-2 border-white/60 shadow-md hover:border-white"
                        }`}
                      >
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          sizes="180px"
                          className="object-cover transition-transform duration-500 hover:scale-108"
                        />

                        {/* Top subtle specular reflection line */}
                        <div className="absolute top-0 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* C. THE CENTER DETAILS DISPLAY */}
            <div className="relative flex flex-col justify-center max-w-[340px] lg:max-w-[370px] pl-2 sm:pl-4 lg:pl-6 z-20 space-y-4 sm:space-y-5">
              
              {/* Explore Categories Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-sm w-fit">
                <LayoutGrid className="w-4 h-4 text-[#22442F]" />
                <span className="text-[11px] sm:text-xs uppercase font-extrabold tracking-[0.18em] text-[#1F432C]">
                  Explore Categories
                </span>
              </div>

              {/* Headline */}
              <h2
                className="font-orangeAvenue font-normal text-3xl sm:text-4xl lg:text-[46px] text-[#102D25] leading-[1.08] tracking-tight"
                style={{
                  fontFamily: "var(--font-orange-avenue), 'OrangeAvenue', serif",
                  fontFeatureSettings: '"liga" 1, "dlig" 1, "calt" 1, "swsh" 1, "ss01" 0',
                  fontVariantLigatures: "common-ligatures discretionary-ligatures contextual",
                }}
              >
                <SplitText
                  text="Furniture"
                  tag="span"
                  effect="rise"
                  splitType="words"
                  hoverEffect="lift"
                  trigger="view"
                  delay={45}
                  duration={1}
                />
                <br />
                <SplitText
                  text="Collection"
                  tag="span"
                  effect="rise"
                  splitType="words"
                  hoverEffect="lift"
                  trigger="view"
                  delay={45}
                  duration={1}
                />
              </h2>

              {/* Active Category Floating Card (with icon, name, subtext & circular button) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory.id}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 14 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="space-y-3"
                >
                  <Link
                    href={`/shop/${activeCategory.slug}`}
                    className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-[22px] bg-white/85 hover:bg-white backdrop-blur-xl border border-white/90 shadow-[0_12px_28px_rgba(20,50,35,0.08)] transition-all duration-300 hover:shadow-[0_16px_36px_rgba(20,50,35,0.14)]"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 pr-2">
                      {/* Category Icon */}
                      <div className="w-10 h-10 rounded-xl bg-[#E8EFE6] text-[#1F432C] flex items-center justify-center shrink-0 border border-[#D2E0CF]">
                        <ActiveIcon className="w-5 h-5" />
                      </div>
                      {/* Name & Subtitle */}
                      <div className="min-w-0">
                        <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#102D25] leading-snug truncate">
                          {activeCategory.name}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-[#55695A] truncate mt-0.5">
                          {activeCategory.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Dark Green Circular Arrow Button (matches reference) */}
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1F432C] group-hover:bg-[#B85232] text-white flex items-center justify-center shrink-0 shadow-soft transition-colors duration-300">
                      <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>

                  {/* Actions Row: Heart, Bookmark, Share */}
                  <div className="flex items-center gap-3 pt-1 px-1">
                    {/* Heart */}
                    <button
                      onClick={() => setLiked(!liked)}
                      className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                        liked
                          ? "bg-red-500 border-red-500 text-white shadow-soft"
                          : "bg-white/70 hover:bg-white border-white/80 text-[#1F432C] shadow-sm"
                      }`}
                      title="Favorite Category"
                      aria-label="Favorite Category"
                    >
                      <Heart className={`w-4 h-4 ${liked ? "fill-white" : ""}`} />
                    </button>

                    {/* Bookmark */}
                    <button
                      onClick={() => setSaved(!saved)}
                      className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                        saved
                          ? "bg-[#1F432C] border-[#1F432C] text-white shadow-soft"
                          : "bg-white/70 hover:bg-white border-white/80 text-[#1F432C] shadow-sm"
                      }`}
                      title="Save Collection"
                      aria-label="Save Collection"
                    >
                      <Bookmark className={`w-4 h-4 ${saved ? "fill-white" : ""}`} />
                    </button>

                    {/* Share */}
                    <button
                      onClick={handleShare}
                      className="w-9 h-9 rounded-full bg-white/70 hover:bg-white border border-white/80 text-[#1F432C] shadow-sm flex items-center justify-center transition-all relative"
                      title="Share Link"
                      aria-label="Share Link"
                    >
                      <Share2 className="w-4 h-4" />
                      {copied && (
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#102D25] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          Copied!
                        </span>
                      )}
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ========================================================== */}
          {/* 3. RIGHT SIDE: CATEGORY DETAILS, PILLS & ORANGE CTA (Cols 8-12) */}
          {/* ========================================================== */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center py-4 lg:pl-10 z-10 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="space-y-4 max-w-[480px]"
              >
                {/* Small Category Tag */}
                <span className="text-[11px] uppercase font-mono font-bold tracking-[0.2em] text-[#1F432C]/75 block">
                  {activeCategory.tag}
                </span>

                {/* Big Category Name */}
                <h3 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-[42px] text-[#102D25] leading-tight">
                  {activeCategory.name}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-[14.5px] text-[#4A5D4F] leading-relaxed">
                  {activeCategory.description}
                </p>

                {/* Subcategory Pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {activeCategory.pills.map((pill) => (
                    <Link
                      key={pill}
                      href={`/shop/${activeCategory.slug}`}
                      className="px-3.5 py-1.5 rounded-full bg-[#E5ECE3] hover:bg-white border border-[#CBD8C9] text-xs font-bold text-[#1F432C] transition-colors shadow-2xs"
                    >
                      {pill}
                    </Link>
                  ))}
                </div>

                {/* Explore Collection Orange CTA Button */}
                <div className="pt-3">
                  <Link
                    href={`/shop/${activeCategory.slug}`}
                    className="group inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#D9531E] to-[#C04312] text-white font-heading font-extrabold text-xs sm:text-[14px] tracking-wide shadow-[0_12px_26px_rgba(217,83,30,0.38)] hover:shadow-[0_16px_34px_rgba(217,83,30,0.48)] hover:brightness-105 active:scale-95 transition-all select-none"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Nav Circular Arrow Buttons (← & →) */}
            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={handlePrev}
                className="w-11 h-11 rounded-full bg-white/70 hover:bg-white text-[#1F432C] border border-white/90 shadow-soft flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
                aria-label="Previous Category"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-11 h-11 rounded-full bg-white/70 hover:bg-white text-[#1F432C] border border-white/90 shadow-soft flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
                aria-label="Next Category"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
