"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, CheckCircle } from "lucide-react";

export default function StyleQuizBanner() {
  return (
    <section className="py-20 bg-sage-light border-b border-borderSage/70 relative overflow-hidden w-full">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
        <div className="relative rounded-[36px] overflow-hidden glass-surface-forest text-white p-8 sm:p-12 lg:p-16 shadow-floating border border-white/20">
          {/* Subtle background ambient overlay */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-terracotta/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Column: Text & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill-forest text-xs tracking-widest font-bold uppercase text-terracotta border border-white/25">
                <Compass className="w-3.5 h-3.5" /> INTERIOR STYLE QUIZ
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white leading-tight">
                Discover Your Interior Style
              </h2>

              <p className="text-base sm:text-lg text-sage-200 leading-relaxed max-w-xl">
                Find the furniture styles, colors, and materials that suit your home in under two minutes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-sage-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-terracotta shrink-0" />
                  <span>Simple 7-question photo quiz</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-terracotta shrink-0" />
                  <span>Tailored furniture recommendations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-terracotta shrink-0" />
                  <span>Personalized color & material guide</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-terracotta shrink-0" />
                  <span>Saved to your profile & 2D room studio</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/style-quiz"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full glass-cta-orange text-white text-xs font-heading font-extrabold tracking-wider uppercase transition-all shadow-floating hover:scale-105 group"
                >
                  <span>Discover Your Style</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Column: Visual Preview Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-forest-deep shadow-floating">
                <Image
                  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80"
                  alt="Style Quiz Preview"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3 text-forest-deep flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-terracotta">
                      Quiz Match Preview
                    </p>
                    <p className="text-xs font-heading font-bold text-forest-deep">
                      Warm Minimalist & Natural Oak
                    </p>
                  </div>
                  <span className="text-[10px] bg-sage-100 text-forest-deep px-2 py-1 rounded font-bold">
                    98% Affinity
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
