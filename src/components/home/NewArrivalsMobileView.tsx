"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { newArrivalsData, NewArrivalItem } from "@/data/new-arrivals";

export default function NewArrivalsMobileView() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  // Update active dot and boundary states during scroll
  const handleScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

    const cardElement = carouselRef.current.firstElementChild as HTMLElement;
    if (!cardElement) return;

    const cardWidth = cardElement.offsetWidth + 16; // width + gap
    const index = Math.round(scrollLeft / cardWidth);
    const clampedIndex = Math.max(0, Math.min(index, newArrivalsData.length - 1));
    setActiveIndex(clampedIndex);

    setCanScrollPrev(scrollLeft > 10);
    setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  const scrollToIndex = (index: number) => {
    if (!carouselRef.current) return;
    const cardElement = carouselRef.current.firstElementChild as HTMLElement;
    if (!cardElement) return;

    const cardWidth = cardElement.offsetWidth + 16; // width + gap
    carouselRef.current.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  const scrollPrev = () => {
    if (activeIndex > 0) {
      scrollToIndex(activeIndex - 1);
    }
  };

  const scrollNext = () => {
    if (activeIndex < newArrivalsData.length - 1) {
      scrollToIndex(activeIndex + 1);
    }
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Sizing calibration per furniture silhouette so proportions stay natural
  const getProductImageClass = (id: string) => {
    switch (id) {
      case "na-1": // Havn Channeled Platform Bed
        return "max-w-[96%] max-h-[125px]";
      case "na-2": // Sora Nordic 2-Seater Sofa
        return "max-w-[94%] max-h-[125px]";
      case "na-3": // Nordic Sculptural Armchair
        return "max-w-[78%] max-h-[125px]";
      case "na-4": // Zephyr Bentwood Lounge Chair
        return "max-w-[76%] max-h-[125px]";
      default:
        return "max-w-[85%] max-h-[125px]";
    }
  };

  return (
    <section className="relative w-full bg-[#E5EDE1] text-[#173C2B] overflow-hidden select-none">
      {/* ============================================================ */}
      {/* 1. NEW ARRIVALS EDITORIAL HEADING                            */}
      {/* ============================================================ */}
      <div className="relative z-10 px-6 pt-8 sm:pt-10 pb-3 max-w-[440px]">
        <span className="text-[11px] uppercase tracking-[0.22em] font-extrabold text-[#D94D1E] block">
          SEASONAL COLLECTION
        </span>
        <h2 className="text-[34px] sm:text-[38px] font-heading font-black tracking-tight text-[#173C2B] leading-[1.05] mt-1.5">
          NEW ARRIVALS
        </h2>
        <p className="text-xs sm:text-[13px] text-[#587763] font-normal leading-[1.48] mt-2 max-w-[310px]">
          Discover the latest architectural silhouettes and solid timber creations from our atelier.
        </p>

        <Link
          href="/shop?sort=newest"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173C2B] underline underline-offset-4 decoration-[#173C2B]/50 hover:text-[#D94D1E] hover:decoration-[#D94D1E] transition-all mt-3 group"
        >
          <span>Explore All New Designs</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* ============================================================ */}
      {/* 2. HORIZONTAL PRODUCT CAROUSEL (1.15 to 1.3 VISIBLE CARDS)  */}
      {/* ============================================================ */}
      <div className="relative z-10 w-full overflow-hidden pt-4 pb-2">
        <div
          ref={carouselRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory px-6"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          {newArrivalsData.map((item: NewArrivalItem, index: number) => (
            <NewArrivalMobileCardItem
              key={item.id}
              item={item}
              index={index}
              imgClass={getProductImageClass(item.id)}
            />
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. CAROUSEL CONTROLS (ARROWS & PAGINATION DOTS)              */}
      {/* ============================================================ */}
      <div className="relative z-10 w-full max-w-[360px] mx-auto px-6 pt-5 pb-8 sm:pb-10 flex items-center justify-between">
        {/* Previous Button */}
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          aria-label="Previous product"
          className="w-11 h-11 rounded-full bg-white text-[#173C2B] shadow-md border border-white/90 flex items-center justify-center transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dynamic Pagination Indicators */}
        <div className="flex items-center gap-2">
          {newArrivalsData.map((item, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={item.id}
                onClick={() => scrollToIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-6 bg-[#173C2B]"
                    : "w-2 bg-[#9EBEA5]/60 hover:bg-[#173C2B]/40"
                }`}
              />
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          aria-label="Next product"
          className="w-11 h-11 rounded-full bg-white text-[#173C2B] shadow-md border border-white/90 flex items-center justify-center transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}

interface NewArrivalMobileCardItemProps {
  item: NewArrivalItem;
  index: number;
  imgClass: string;
}

function NewArrivalMobileCardItem({
  item,
  index,
  imgClass,
}: NewArrivalMobileCardItemProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [touchPos, setTouchPos] = useState({ x: 50, y: 50 });
  const [isInteracting, setIsInteracting] = useState(false);

  const updatePosition = (clientX: number, clientY: number) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    setTouchPos({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updatePosition(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsInteracting(true);
    if (e.touches[0]) {
      updatePosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      updatePosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsInteracting(false);
  };

  return (
    <div className="w-[74vw] min-w-[260px] max-w-[295px] snap-start shrink-0 relative flex flex-col pt-20">
      {/* Overlapping Furniture Product Image */}
      <div className="absolute top-0 left-0 right-0 h-[145px] z-20 flex items-end justify-center pointer-events-none px-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.name}
          className={`${imgClass} object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.18)] transition-transform duration-300 ${
            isInteracting ? "scale-105 drop-shadow-[0_16px_24px_rgba(0,0,0,0.25)]" : ""
          } pointer-events-auto`}
        />
      </div>

      {/* Liquid Glass Dark Card Body with Dynamic Interactive Moving Shine */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsInteracting(true)}
        onMouseLeave={() => setIsInteracting(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className={`relative w-full rounded-[28px] sm:rounded-[32px] liquid-glass-dark p-5 sm:p-6 pt-16 flex flex-col justify-between min-h-[305px] sm:min-h-[320px] shadow-floating border transition-all duration-300 overflow-hidden cursor-pointer ${
          isInteracting
            ? "-translate-y-1.5 border-white/35 shadow-2xl scale-[1.01]"
            : "border-white/15"
        }`}
      >
        {/* Ambient Warm Backlight Glow inside card */}
        <div
          className={`absolute inset-0 rounded-[28px] sm:rounded-[32px] ambient-glow-warm pointer-events-none transition-opacity duration-300 ${
            isInteracting ? "opacity-75" : "opacity-45"
          }`}
        />

        {/* Dynamic Specular Reflection following touch/finger/cursor position */}
        <div
          className="absolute inset-0 rounded-[28px] sm:rounded-[32px] pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isInteracting ? 1 : 0,
            background: `radial-gradient(circle 220px at ${touchPos.x}% ${touchPos.y}%, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.05) 45%, transparent 70%)`,
          }}
        />

        {/* Idle Animated Glass Shine Beam (Sweeping Specular Refraction when not interacting) */}
        {!isInteracting && (
          <div
            className="absolute -inset-y-4 -left-24 w-36 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none animate-glass-shine z-10"
            style={{ animationDelay: `${index * 1.2}s` }}
          />
        )}

        {/* Top Specular Rim Line */}
        <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-10" />

        {/* Card Header: Category & Curated / Tag Label */}
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] uppercase tracking-[0.2em] font-semibold text-[#E0A97E] font-sans">
              {item.category}
            </span>
            <span className="text-[9.5px] uppercase tracking-[0.22em] font-medium text-white/50">
              {item.tag || "NEW RELEASE"}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-heading font-extrabold text-[22px] sm:text-[24px] text-white leading-[1.14] tracking-tight mt-2.5">
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

        {/* Floating Liquid Glass Bottom Price Pill */}
        <div className="relative z-10 mt-6 p-2.5 sm:p-3 pl-3.5 sm:pl-4 rounded-2xl liquid-glass-pill-dark border border-white/20 flex items-center justify-between transition-all hover:border-white/40">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-[0.18em] font-medium text-white/60 block leading-none">
              DIRECT FROM ATELIER
            </span>
            <span className="text-white font-heading font-extrabold text-sm sm:text-[15px] leading-tight block mt-1">
              Price · {item.price}
            </span>
          </div>

          <Link
            href={item.destination}
            aria-label={`View ${item.name} details`}
            className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/35 text-white flex items-center justify-center transition-all shadow-soft active:scale-95 hover:bg-[#B85232] shrink-0"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
