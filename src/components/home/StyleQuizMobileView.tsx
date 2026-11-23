"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Compass, Check, Sparkles, ArrowRight } from "lucide-react";

interface StyleQuizMobileViewProps {
  quizHighlights?: string[];
}

const DEFAULT_HIGHLIGHTS = [
  "Simple 7-question visual quiz",
  "Tailored furniture recommendations",
  "Personalized color & material guide",
  "Saved to your profile & 2D room studio",
];

export default function StyleQuizMobileView({
  quizHighlights = DEFAULT_HIGHLIGHTS,
}: StyleQuizMobileViewProps) {
  return (
    <div className="w-full">
      {/* Premium Forest-Green Rounded Container */}
      <div
        className="relative rounded-[32px] overflow-hidden text-white p-5 sm:p-7 pt-6 pb-7 border border-white/15 shadow-[0_24px_60px_rgba(10,32,22,0.25)]"
        style={{
          background:
            "linear-gradient(180deg, #1C412F 0%, #163626 50%, #11291D 100%)",
        }}
      >
        {/* Optical Specular Glint on Top Rim */}
        <div className="absolute top-0 right-[25%] w-24 h-[2px] bg-white rounded-full blur-[0.8px] pointer-events-none shadow-[0_0_12px_4px_rgba(255,255,255,0.85)] z-20" />

        {/* Ambient Glows */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-emerald-400/15 blur-2xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-[#D9532A]/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col">
          {/* 1. Interior Style Quiz Badge */}
          <div className="self-start inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-[#DE825A]/50 text-[#DE825A] text-[11px] font-bold tracking-widest uppercase">
            <Compass className="w-3.5 h-3.5 text-[#DE825A]" />
            <span>INTERIOR STYLE QUIZ</span>
          </div>

          {/* 2. Main Heading */}
          <h2 className="text-[32px] sm:text-[36px] font-heading font-extrabold text-white leading-[1.12] tracking-tight mt-4 mb-3">
            Discover Your
            <br />
            Interior Style
          </h2>

          {/* 3. Description */}
          <p className="text-[13.5px] sm:text-[14px] text-[#D2E2D6] leading-relaxed font-normal mb-5">
            Find the furniture styles, colors, and materials that suit your sanctuary in under two minutes.
          </p>

          {/* 4. Four Feature Highlights (Stacked Vertically) */}
          <div className="flex flex-col gap-2.5">
            {quizHighlights.map((highlight) => (
              <div
                key={highlight}
                className="w-full rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3 flex items-center gap-3.5 shadow-sm"
              >
                <div className="w-5 h-5 rounded-full bg-[#D45028] flex items-center justify-center shrink-0 shadow-xs">
                  <Check className="w-3 h-3 text-white stroke-[2.5]" />
                </div>
                <span className="text-[13px] font-medium leading-snug text-white/95">
                  {highlight}
                </span>
              </div>
            ))}
          </div>

          {/* 5. Interior Room Preview with Quiz Match Overlay */}
          <div className="mt-6 relative w-full aspect-[16/11] sm:aspect-[4/3] rounded-[22px] overflow-hidden border border-white/15 shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80"
              alt="Discover Your Interior Style Room Preview"
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover"
            />
            {/* Subtle Gradient Shadow at bottom for overlay pop */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

            {/* 6. Quiz Match Overlay Floating Capsule */}
            <div className="absolute bottom-3 left-3 right-3 bg-white/92 backdrop-blur-md rounded-[16px] p-3 px-3.5 flex items-center justify-between border border-white/80 shadow-lg">
              <div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#D45028]" />
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#D45028]">
                    QUIZ MATCH PREVIEW
                  </span>
                </div>
                <p className="text-[13px] font-heading font-extrabold text-[#143424] mt-0.5">
                  Warm Minimalist & Natural Oak
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#143424] bg-white px-2.5 py-1 rounded-full border border-gray-100 shadow-xs shrink-0">
                98% Affinity
              </span>
            </div>
          </div>

          {/* 7. Call To Action Button */}
          <div className="mt-6">
            <Link
              href="/style-quiz"
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#EB5928] via-[#DE4E1E] to-[#CD4214] text-white font-heading font-extrabold text-[14px] uppercase tracking-wider shadow-[0_10px_25px_rgba(217,72,25,0.4)] flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.99] transition-all select-none"
            >
              <span>DISCOVER YOUR STYLE</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
