"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Compass, CheckCircle, Sparkles } from "lucide-react";
import SplitText from "@/components/ui/SplitText";
import StyleQuizMobileView from "./StyleQuizMobileView";

export default function StyleQuizBanner() {
  const quizHighlights = [
    "Simple 7-question visual quiz",
    "Tailored furniture recommendations",
    "Personalized color & material guide",
    "Saved to your profile & 2D room studio",
  ];

  return (
    <section className="py-10 sm:py-16 lg:py-24 bg-[#E5EDE1] border-b border-borderSage/70 relative overflow-hidden w-full select-none">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
        {/* Mobile View (< lg) */}
        <div className="block lg:hidden">
          <StyleQuizMobileView quizHighlights={quizHighlights} />
        </div>

        {/* Desktop View (>= lg): Apple Liquid Glass Floating Capsule Card */}
        <div
          className="hidden lg:block relative rounded-[32px] sm:rounded-[40px] lg:rounded-[48px] overflow-hidden text-white p-7 sm:p-10 lg:p-14 xl:p-16 border-[1.5px] border-white/35 shadow-[0_30px_70px_rgba(10,32,22,0.22),inset_0_2px_3px_rgba(255,255,255,0.65),inset_0_-2px_4px_rgba(0,0,0,0.2)]"
          style={{
            background:
              "linear-gradient(135deg, rgba(22, 54, 40, 0.72) 0%, rgba(14, 38, 28, 0.84) 50%, rgba(19, 48, 35, 0.76) 100%)",
            backdropFilter: "blur(36px) saturate(190%)",
            WebkitBackdropFilter: "blur(36px) saturate(190%)",
          }}
        >
          {/* Optical Specular Glints on the Top Curved Rim */}
          <div className="absolute top-0 left-[16%] w-24 h-[3px] bg-white rounded-full blur-[1px] pointer-events-none shadow-[0_0_14px_5px_rgba(255,255,255,0.95)] z-20" />
          <div className="absolute top-0 right-[24%] w-32 h-[3px] bg-white rounded-full blur-[1px] pointer-events-none shadow-[0_0_16px_5px_rgba(255,255,255,0.95)] z-20" />

          {/* Ambient Refraction Edge Highlight */}
          <div className="absolute top-0 inset-x-8 sm:inset-x-14 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none z-20" />

          {/* Ambient Color Blooms */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-400/20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#E8662B]/25 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-64 h-64 bg-white/10 blur-2xl rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-center relative z-10">
            {/* Left Column: Text & Glass CTA */}
            <div className="lg:col-span-7 space-y-6">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-xl border border-white/35 text-xs tracking-widest font-extrabold uppercase text-[#E0A97E] shadow-[0_4px_16px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.6)]">
                <Compass className="w-3.5 h-3.5 text-[#E0A97E]" />
                <span>Interior Style Quiz</span>
              </div>

              {/* Main Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white leading-[1.12] tracking-tight cursor-default">
                <SplitText
                  text="Discover Your Interior Style"
                  effect="rise"
                  hoverEffect="lift"
                  splitType="words"
                  delay={45}
                  duration={1.1}
                  trigger="view"
                />
              </h2>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-white/85 leading-relaxed max-w-xl font-normal">
                Find the furniture styles, colors, and materials that suit your sanctuary in under two minutes.
              </p>

              {/* 4 Frosted Glass Checklist Micro-Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {quizHighlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-center gap-3 p-3 px-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-sm transition-all duration-300 hover:bg-white/15 hover:border-white/35 group cursor-default"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#B85232] flex items-center justify-center shrink-0 shadow-sm border border-white/30">
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs sm:text-[13px] font-medium leading-snug text-white/95">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>

              {/* Terracotta Liquid Glass CTA Button */}
              <div className="pt-3 relative z-10">
                {/* Warm underglow reflection */}
                <div className="absolute left-6 w-48 h-8 bg-[#E8662B]/35 blur-xl -bottom-1 pointer-events-none rounded-full" />

                <Link
                  href="/style-quiz"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-b from-[#E6632B] via-[#D5521E] to-[#BD4013] text-white font-heading font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-[0_14px_30px_rgba(216,84,32,0.45),inset_0_1.5px_2px_rgba(255,255,255,0.85),inset_0_-1.5px_2px_rgba(0,0,0,0.22)] border border-white/45 hover:scale-105 hover:shadow-[0_18px_36px_rgba(216,84,32,0.55)] hover:brightness-105 transition-all duration-300 select-none overflow-hidden"
                >
                  {/* Top Specular Edge Highlight */}
                  <span className="absolute top-0 left-4 right-4 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none" />

                  <span>Discover Your Style</span>
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={2.4}
                  />
                </Link>
              </div>
            </div>

            {/* Right Column: Visual Preview in Refractive Glass Card with Photo Animation */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative aspect-[4/3] rounded-[28px] overflow-hidden border border-white/35 shadow-[0_24px_50px_rgba(0,0,0,0.35),inset_0_1px_1.5px_rgba(255,255,255,0.6)] group"
              >
                <Image
                  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80"
                  alt="Style Quiz Preview"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Floating Translucent Liquid Glass Match Pill */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/75 backdrop-blur-2xl rounded-2xl p-3.5 border border-white/85 shadow-[0_8px_30px_rgba(0,0,0,0.22),inset_0_1px_2px_rgba(255,255,255,0.95)] text-forest-deep flex items-center justify-between transition-all group-hover:bg-white/85">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-terracotta" />
                      <p className="text-[10px] uppercase tracking-wider font-extrabold text-terracotta">
                        Quiz Match Preview
                      </p>
                    </div>
                    <p className="text-xs sm:text-[13px] font-heading font-bold text-forest-deep mt-0.5">
                      Warm Minimalist & Natural Oak
                    </p>
                  </div>
                  <span className="text-[11px] bg-white/90 text-forest-deep px-3 py-1.5 rounded-full font-extrabold border border-white/60 shadow-sm shrink-0">
                    98% Affinity
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
