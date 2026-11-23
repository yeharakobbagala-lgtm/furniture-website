"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { articles } from "@/data/articles";
import { Article } from "@/types";

export default function EditorialMobileView() {
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
    const clampedIndex = Math.max(0, Math.min(index, articles.length - 1));
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
    if (activeIndex < articles.length - 1) {
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
    <section className="relative w-full py-8 sm:py-10 bg-[#E5EDE1] border-b border-borderSage/70 select-none overflow-hidden text-[#102D25]">
      {/* Header */}
      <div className="px-6 pb-3 max-w-[440px]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-xs text-[11px] font-bold uppercase tracking-wider text-[#B85232] mb-2">
          <BookOpen className="w-3.5 h-3.5 text-[#B85232]" />
          <span>Square Journal</span>
        </div>
        <h2 className="text-[32px] sm:text-[36px] font-heading font-black tracking-tight text-[#173C2B] leading-[1.08] mt-1">
          Interior Inspiration & Trends
        </h2>
        <p className="text-xs sm:text-[13px] text-[#587763] font-normal leading-[1.48] mt-2 max-w-[310px]">
          Curated design essays, material explorations, and architectural insights.
        </p>

        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173C2B] underline underline-offset-4 decoration-[#173C2B]/50 hover:text-[#D94D1E] hover:decoration-[#D94D1E] transition-all mt-3 group"
        >
          <span>All Stories</span>
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
          {articles.map((article: Article) => (
            <div
              key={article.id}
              className="w-[80vw] min-w-[275px] max-w-[315px] snap-start shrink-0 rounded-[28px] overflow-hidden bg-white/85 backdrop-blur-md border border-white/90 shadow-md flex flex-col justify-between"
            >
              {/* Cover Image with Category Tag */}
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 640px) 80vw, 320px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#102D25]/85 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider shadow-sm border border-white/20">
                  {article.category}
                </div>
              </div>

              {/* Story Details */}
              <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3.5">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-[#587763] mb-1.5 font-medium">
                    <Clock className="w-3 h-3 text-[#B85232]" />
                    <span>{article.readTime}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>
                  <h3 className="font-heading font-extrabold text-[17px] sm:text-[18px] text-[#102D25] leading-snug line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#587763] leading-relaxed line-clamp-2 mt-1.5 font-normal">
                    {article.excerpt}
                  </p>
                </div>

                {/* Author & Read Action */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-200 shrink-0 border border-white">
                      <Image
                        src={article.author.avatar}
                        alt={article.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs font-semibold text-[#102D25] truncate max-w-[110px]">
                      {article.author.name}
                    </span>
                  </div>

                  <Link
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#D94D1E] hover:text-[#B85232] group/btn shrink-0"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
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
          aria-label="Previous story"
          className="w-11 h-11 rounded-full bg-white text-[#173C2B] shadow-md border border-white/90 flex items-center justify-center transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {articles.map((article, idx) => (
            <button
              key={article.id}
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
          aria-label="Next story"
          className="w-11 h-11 rounded-full bg-white text-[#173C2B] shadow-md border border-white/90 flex items-center justify-center transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
