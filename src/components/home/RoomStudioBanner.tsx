"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Layers, Sparkles } from "lucide-react";

export default function RoomStudioBanner() {
  return (
    <section className="py-20 bg-ivory-warm border-b border-borderSage/70 w-full">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-terracotta block">
            INTERACTIVE DESIGN STUDIO
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-forest-deep tracking-tight">
            Bring Your Dream Room to Life
          </h2>
          <p className="text-sm sm:text-base text-forest-muted">
            Test furniture scale, layout proportions, and visual harmony before you order. Choose between our precision 2D floor planner or photograph visualizer.
          </p>
        </div>

        {/* Two Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Feature 1: Design Your Room (2D Planner) */}
          <div className="group rounded-[32px] overflow-hidden glass-surface-subtle border border-white/65 hover:border-white/90 hover:shadow-floating transition-all duration-500 flex flex-col justify-between">
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80"
                alt="2D Room Planner"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full glass-pill-forest text-white text-xs font-bold flex items-center gap-1.5 shadow-soft border border-white/30">
                <Layers className="w-3.5 h-3.5 text-terracotta" />
                2D Interactive Canvas
              </div>
            </div>

            <div className="p-8 space-y-4">
              <h3 className="text-2xl font-heading font-extrabold text-forest-deep group-hover:text-terracotta transition-colors">
                Design Your Room
              </h3>
              <p className="text-sm text-forest-muted leading-relaxed">
                Configure your exact room dimensions, select floor finishes, drag and rotate scale furniture items, and export a ready-to-order bill of materials.
              </p>
              <div className="pt-2">
                <Link
                  href="/room-studio/planner"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full glass-pill-forest text-white text-xs font-heading font-extrabold tracking-wider uppercase transition-all shadow-soft hover:scale-105"
                >
                  <span>Launch 2D Planner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Feature 2: Visualise Furniture in Your Space (Photo Visualizer) */}
          <div className="group rounded-[32px] overflow-hidden glass-surface-subtle border border-white/65 hover:border-white/90 hover:shadow-floating transition-all duration-500 flex flex-col justify-between">
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"
                alt="Room Photo Visualizer"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full glass-cta-orange text-white text-xs font-bold flex items-center gap-1.5 shadow-soft border border-white/40">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                Photo Compositor
              </div>
            </div>

            <div className="p-8 space-y-4">
              <h3 className="text-2xl font-heading font-extrabold text-forest-deep group-hover:text-terracotta transition-colors">
                Visualise Furniture in Your Space
              </h3>
              <p className="text-sm text-forest-muted leading-relaxed">
                Upload a photograph of your existing living space or bedroom, position authentic furniture cutouts, resize and reorder layers, and download preview composites.
              </p>
              <div className="pt-2">
                <Link
                  href="/room-studio/visualizer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full glass-cta-orange text-white text-xs font-heading font-extrabold tracking-wider uppercase transition-all shadow-floating hover:scale-105"
                >
                  <span>Launch Photo Visualizer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
