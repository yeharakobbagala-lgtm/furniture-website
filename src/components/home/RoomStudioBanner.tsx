"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Layers, Sparkles } from "lucide-react";

export default function RoomStudioBanner() {
  return (
    <section className="py-20 bg-ivory-warm border-b border-borderSage/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="group rounded-3xl overflow-hidden bg-sage-50 border border-borderSage hover:border-forest-dark/40 hover:shadow-card transition-all duration-300 flex flex-col justify-between">
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80"
                alt="2D Room Planner"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-forest-dark text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                <Layers className="w-3.5 h-3.5 text-terracotta" />
                2D Interactive Canvas
              </div>
            </div>

            <div className="p-8 space-y-4">
              <h3 className="text-2xl font-heading font-bold text-forest-deep group-hover:text-terracotta transition-colors">
                Design Your Room
              </h3>
              <p className="text-sm text-forest-muted leading-relaxed">
                Configure your exact room dimensions, select floor finishes, drag and rotate scale furniture items, and export a ready-to-order bill of materials.
              </p>
              <div className="pt-2">
                <Link
                  href="/room-studio/planner"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-dark hover:bg-forest-deep text-white text-xs font-bold tracking-wider uppercase transition-colors"
                >
                  Launch 2D Planner <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Feature 2: Visualise Furniture in Your Space (Photo Visualizer) */}
          <div className="group rounded-3xl overflow-hidden bg-sage-50 border border-borderSage hover:border-forest-dark/40 hover:shadow-card transition-all duration-300 flex flex-col justify-between">
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"
                alt="Room Photo Visualizer"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-terracotta text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Photo Compositor
              </div>
            </div>

            <div className="p-8 space-y-4">
              <h3 className="text-2xl font-heading font-bold text-forest-deep group-hover:text-terracotta transition-colors">
                Visualise Furniture in Your Space
              </h3>
              <p className="text-sm text-forest-muted leading-relaxed">
                Upload a photograph of your existing living space or bedroom, position authentic furniture cutouts, resize and reorder layers, and download preview composites.
              </p>
              <div className="pt-2">
                <Link
                  href="/room-studio/visualizer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold tracking-wider uppercase transition-colors"
                >
                  Launch Photo Visualizer <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
