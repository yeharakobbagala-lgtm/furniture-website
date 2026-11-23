"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { designers } from "@/data/designers";
import { Designer } from "@/types";

export default function DesignerSpotlightMobileView() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const handleScroll = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

    const cardElement = carouselRef.current.firstElementChild as HTMLElement;
    if (!cardElement) return;

    const cardWidth = cardElement.offsetWidth + 16;
    const index = Math.round(scrollLeft / cardWidth);
    const clampedIndex = Math.max(0, Math.min(index, designers.length - 1));
    setActiveIndex(clampedIndex);

    setCanScrollPrev(scrollLeft > 10);
    setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  const scrollToIndex = (index: number) => {
    if (!carouselRef.current) return;
    const cardElement = carouselRef.current.firstElementChild as HTMLElement;
    if (!cardElement) return;

    const cardWidth = cardElement.offsetWidth + 16;
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
    if (activeIndex < designers.length - 1) {
      scrollToIndex(activeIndex + 1);
    }
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <section className="relative w-full py-8 sm:py-10 bg-sage-light border-b border-borderSage/70 select-none overflow-hidden text-[#102D25]">
      {/* Header */}
      <div className="px-6 pb-2 max-w-[440px]">
        <span className="text-[11px] uppercase tracking-[0.22em] font-extrabold text-[#D94D1E] block">
          CEYLON ATELIERS
        </span>
        <h2 className="text-[32px] sm:text-[36px] font-heading font-black tracking-tight text-[#173C2B] leading-[1.05] mt-1">
          Designer Spotlight
        </h2>
        <p className="text-xs text-[#587763] font-normal leading-normal mt-1.5 max-w-[310px]">
          Sri Lankan architects & master joiners shaping our handcrafted collection.
        </p>

        <Link
          href="/designers"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173C2B] underline underline-offset-4 decoration-[#173C2B]/50 hover:text-[#D94D1E] hover:decoration-[#D94D1E] transition-all mt-2.5 group"
        >
          <span>Meet all master craftsmen</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Horizontal Carousel */}
      <div className="relative w-full overflow-hidden pt-4 pb-2">
        <div
          ref={carouselRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory px-6"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          {designers.map((designer: Designer) => (
            <div
              key={designer.id}
              className="w-[76vw] min-w-[270px] max-w-[305px] snap-start shrink-0 rounded-[28px] overflow-hidden bg-ivory-warm border border-borderSage shadow-md flex flex-col justify-between"
            >
              {/* Portrait Image */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-sage-50">
                <Image
                  src={designer.portraitImage}
                  alt={designer.name}
                  fill
                  sizes="(max-width: 640px) 80vw, 300px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102D25]/90 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#E0A97E] block">
                    {designer.role}
                  </span>
                  <h3 className="text-xl font-heading font-bold text-white mt-0.5">
                    {designer.name}
                  </h3>
                  <p className="flex items-center gap-1 text-xs text-sage-300 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D94D1E]" />
                    <span>{designer.location}</span>
                  </p>
                </div>
              </div>

              {/* Bio & Specialty */}
              <div className="p-4 flex flex-col justify-between flex-1 space-y-2.5 bg-white/70 backdrop-blur-md">
                <p className="text-[12px] text-[#587763] leading-relaxed line-clamp-2">
                  {designer.biography}
                </p>

                <div className="pt-2 border-t border-borderSage/70 flex items-center justify-between">
                  <span className="text-[10.5px] font-semibold text-[#173C2B]/85 truncate max-w-[155px]">
                    {designer.speciality}
                  </span>
                  <Link
                    href={`/designers/${designer.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#173C2B] hover:text-[#D94D1E] group/link shrink-0"
                  >
                    <span>Portfolio</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="w-full max-w-[360px] mx-auto px-6 pt-5 pb-2 flex items-center justify-between">
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          aria-label="Previous designer"
          className="w-11 h-11 rounded-full bg-white text-[#173C2B] shadow-md border border-white/90 flex items-center justify-center transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {designers.map((designer, idx) => (
            <button
              key={designer.id}
              onClick={() => scrollToIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? "w-6 bg-[#173C2B]"
                  : "w-2 bg-[#9EBEA5]/60 hover:bg-[#173C2B]/40"
              }`}
            />
          ))}
        </div>

        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          aria-label="Next designer"
          className="w-11 h-11 rounded-full bg-white text-[#173C2B] shadow-md border border-white/90 flex items-center justify-center transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
