"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen, Clock, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { articles } from "@/data/articles";
import SplitText from "@/components/ui/SplitText";

export default function EditorialSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const activeArticle = articles[selectedIndex] || articles[0];

  // Auto-advance through the editorial gallery every 7 seconds if not hovered/paused
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % articles.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setSelectedIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setSelectedIndex((prev) => (prev + 1) % articles.length);
  };

  return (
    <section
      className="relative w-full py-12 lg:py-0 lg:h-screen lg:max-h-[900px] lg:min-h-[700px] flex items-center bg-[#E5EDE1] border-b border-borderSage/70 overflow-hidden select-none"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Organic Shapes & Ambient Liquid Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep Forest Organic Background Curves */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#374C3A]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-[550px] h-[550px] rounded-full bg-[#243F33]/25 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-[#E8662B]/12 blur-3xl rounded-full" />

        {/* Subtle decorative curved architectural outline */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.07] text-[#102D25]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 900"
          fill="none"
        >
          <path
            d="M-100 450 C 300 250, 700 650, 1540 380"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray="8 8"
          />
        </svg>
      </div>

      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 relative z-10 flex flex-col justify-center h-full max-w-[1600px] mx-auto">
        {/* Section Header: Compact & Refined */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 backdrop-blur-md border border-white/70 shadow-sm text-xs font-bold uppercase tracking-wider text-[#B85232] mb-2.5">
              <BookOpen className="w-3.5 h-3.5 text-[#B85232]" />
              <span>Square Journal</span>
              <span className="w-1 h-1 rounded-full bg-[#B85232]/50" />
              <span className="text-forest-deep/75 font-semibold">Editorial Gallery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-heading font-extrabold text-[#102D25] tracking-tight leading-tight cursor-default">
              <SplitText
                text="Interior Inspiration & Trends"
                effect="rise"
                hoverEffect="lift"
                splitType="words"
                delay={45}
                duration={1.1}
                trigger="view"
              />
            </h2>
          </div>

          {/* Header Right: Navigation Controls & Link */}
          <div className="flex items-center gap-3">
            {/* Gallery Step Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-white/60 text-xs font-mono font-semibold text-forest-deep shadow-sm">
              <span className="text-[#B85232]">0{selectedIndex + 1}</span>
              <span className="text-forest-muted">/</span>
              <span className="text-forest-muted">0{articles.length}</span>
            </div>

            {/* Prev / Next Liquid Glass Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                aria-label="Previous story"
                className="w-8 h-8 rounded-full bg-white/60 backdrop-blur-md border border-white/70 hover:bg-white/90 text-forest-deep flex items-center justify-center transition-all shadow-sm active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next story"
                className="w-8 h-8 rounded-full bg-white/60 backdrop-blur-md border border-white/70 hover:bg-white/90 text-forest-deep flex items-center justify-center transition-all shadow-sm active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Read All Link Pill */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 hover:bg-white backdrop-blur-md border border-white/80 shadow-[0_4px_16px_rgba(16,45,37,0.08)] text-xs font-bold text-forest-deep hover:text-[#B85232] transition-all group"
            >
              <span>All Stories</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Gallery Showcase Grid (Fits cleanly on single screen) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
          {/* Main Spotlight Article: Dark Liquid Glass Showcase (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div
              className="relative rounded-[28px] lg:rounded-[32px] overflow-hidden p-5 sm:p-7 lg:p-8 flex flex-col justify-between h-full border border-white/20 shadow-[0_24px_50px_rgba(16,45,37,0.25),inset_0_1.5px_2px_rgba(255,255,255,0.4)]"
              style={{
                background:
                  "linear-gradient(145deg, rgba(22, 44, 34, 0.88) 0%, rgba(14, 30, 24, 0.94) 100%)",
                backdropFilter: "blur(32px) saturate(180%)",
                WebkitBackdropFilter: "blur(32px) saturate(180%)",
              }}
            >
              {/* Optical Top Rim Specular Glint */}
              <div className="absolute top-0 inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none z-20" />
              <div className="absolute top-0 left-[20%] w-24 h-[2px] bg-white rounded-full blur-[1px] pointer-events-none shadow-[0_0_12px_4px_rgba(255,255,255,0.9)] z-20" />

              {/* Ambient Underglow within Card */}
              <div className="absolute -top-16 -right-16 w-60 h-60 bg-emerald-400/15 blur-2xl rounded-full pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-[#E8662B]/20 blur-2xl rounded-full pointer-events-none" />

              {/* Animated Content Transition on Story Change */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeArticle.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex flex-col h-full justify-between gap-5 relative z-10"
                >
                  {/* Article Cinematic Preview Image */}
                  <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-lg border border-white/20 group">
                    <Image
                      src={activeArticle.image}
                      alt={activeArticle.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Category Pill Tag */}
                    <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-forest-deep/80 backdrop-blur-md border border-white/30 text-white text-[11px] font-bold tracking-wider uppercase shadow-md flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#E8662B]" />
                      <span>{activeArticle.category}</span>
                    </div>

                    {/* Author & Read Time Overlay (Bottom) */}
                    <div className="absolute bottom-3.5 inset-x-3.5 flex items-center justify-between text-white/90 text-xs backdrop-blur-md bg-black/40 px-3.5 py-2 rounded-xl border border-white/15">
                      <div className="flex items-center gap-2">
                        {activeArticle.author?.avatar && (
                          <div className="relative w-5 h-5 rounded-full overflow-hidden border border-white/40">
                            <Image
                              src={activeArticle.author.avatar}
                              alt={activeArticle.author.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span className="font-medium text-white">{activeArticle.author?.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/80">
                        <span>{activeArticle.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-[#E8662B]" />
                          {activeArticle.readTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Headline & Excerpt */}
                  <div className="space-y-2.5">
                    <Link
                      href={`/blog/${activeArticle.slug}`}
                      className="block group/title focus:outline-none"
                    >
                      <h3 className="font-heading font-extrabold text-white text-xl sm:text-2xl lg:text-[25px] leading-tight group-hover/title:text-[#E0A97E] transition-colors line-clamp-2">
                        {activeArticle.title}
                      </h3>
                    </Link>
                    <p className="text-sage-100/85 text-xs sm:text-sm leading-relaxed line-clamp-2 font-normal">
                      {activeArticle.excerpt}
                    </p>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <Link
                      href={`/blog/${activeArticle.slug}`}
                      className="group/btn relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D5521E] to-[#BD4013] text-white font-heading font-bold text-xs uppercase tracking-wider shadow-[0_8px_20px_rgba(213,82,30,0.4),inset_0_1px_1.5px_rgba(255,255,255,0.7)] border border-white/35 hover:scale-105 hover:shadow-[0_12px_24px_rgba(213,82,30,0.5)] transition-all"
                    >
                      <span>Read Full Editorial</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                    {/* Tags preview */}
                    <div className="hidden sm:flex items-center gap-1.5">
                      {activeArticle.tags?.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-medium text-white/80 border border-white/10"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Interactive Liquid Glass Gallery Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3 lg:gap-3.5">
            {articles.map((article, idx) => {
              const isSelected = selectedIndex === idx;

              return (
                <div
                  key={article.id}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setSelectedIndex(idx);
                  }}
                  className={`group relative rounded-2xl p-3 sm:p-3.5 transition-all duration-300 cursor-pointer border ${
                    isSelected
                      ? "bg-white/85 backdrop-blur-xl border-emerald-600/40 shadow-[0_12px_30px_rgba(16,45,37,0.14),inset_0_1.5px_2px_rgba(255,255,255,0.95)] translate-x-1 sm:translate-x-2"
                      : "bg-white/50 backdrop-blur-md border-white/60 hover:bg-white/75 hover:border-white/80 shadow-sm"
                  }`}
                >
                  {/* Active highlight side indicator bar */}
                  {isSelected && (
                    <div className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full bg-[#B85232] shadow-[0_0_8px_rgba(184,82,50,0.6)]" />
                  )}

                  <div className="flex items-center gap-3.5">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden shrink-0 border border-white/40 shadow-sm">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        sizes="90px"
                        className={`object-cover transition-transform duration-500 ${
                          isSelected ? "scale-105" : "group-hover:scale-105"
                        }`}
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#B85232]/10 ring-2 ring-inset ring-[#B85232]/50 rounded-xl" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#B85232]">
                          {article.category}
                        </span>
                        <span className="text-[10px] text-forest-muted font-medium flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {article.readTime}
                        </span>
                      </div>

                      <h4
                        className={`text-xs sm:text-sm font-heading font-bold leading-snug line-clamp-2 transition-colors ${
                          isSelected
                            ? "text-[#102D25]"
                            : "text-[#102D25]/85 group-hover:text-[#102D25]"
                        }`}
                      >
                        {article.title}
                      </h4>

                      <div className="flex items-center justify-between mt-1.5 text-[11px] text-forest-muted">
                        <span>{article.date}</span>
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                            isSelected
                              ? "text-[#B85232]"
                              : "text-forest-muted group-hover:text-forest-deep"
                          }`}
                        >
                          {isSelected ? "Active View" : "Preview"}
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}