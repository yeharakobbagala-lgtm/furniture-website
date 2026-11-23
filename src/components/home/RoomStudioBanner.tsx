"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Layers, Sparkles, Wand2 } from "lucide-react";
import SplitText from "@/components/ui/SplitText";
import RoomStudioMobileView from "./RoomStudioMobileView";

export default function RoomStudioBanner() {
  return (
    <>
      {/* ============================================================ */}
      {/* MOBILE INTERACTIVE DESIGN STUDIO (< lg)                      */}
      {/* ============================================================ */}
      <div className="block lg:hidden w-full">
        <RoomStudioMobileView />
      </div>

      {/* ============================================================ */}
      {/* DESKTOP INTERACTIVE DESIGN STUDIO (>= lg)                    */}
      {/* ============================================================ */}
      <section className="hidden lg:flex py-6 sm:py-8 lg:py-0 lg:min-h-screen lg:max-h-[960px] items-center bg-[#DFEADA] border-b border-borderSage/70 select-none w-full overflow-hidden">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-14 2xl:px-16 py-4 lg:py-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-6 lg:mb-8 space-y-1.5 sm:space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs uppercase tracking-[0.22em] font-extrabold text-[#C85226]">
            <Sparkles className="w-3.5 h-3.5 text-[#C85226]" />
            <span>Interactive Design Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-heading font-extrabold text-forest-deep tracking-tight leading-tight cursor-default">
            <SplitText
              text="Bring Your Dream Room to Life"
              effect="rise"
              hoverEffect="lift"
              splitType="words"
              delay={45}
              duration={1.1}
              trigger="view"
            />
          </h2>
          <p className="text-xs sm:text-sm text-forest-muted max-w-xl mx-auto leading-relaxed">
            Test furniture scale, layout proportions, and visual harmony before you order. Choose between our precision 2D floor planner or photograph visualizer.
          </p>
        </div>

        {/* Two Apple Liquid Glass Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Feature 1: Design Your Room (2D Planner) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="group rounded-[28px] sm:rounded-[34px] lg:rounded-[38px] overflow-hidden relative flex flex-col justify-between border-[1.5px] border-white/80 shadow-[0_20px_50px_rgba(20,55,35,0.1),inset_0_2px_3px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_rgba(20,55,35,0.16)]"
            style={{
              background:
                "linear-gradient(140deg, rgba(255, 255, 255, 0.68) 0%, rgba(234, 246, 230, 0.45) 50%, rgba(255, 255, 255, 0.58) 100%)",
              backdropFilter: "blur(30px) saturate(180%)",
              WebkitBackdropFilter: "blur(30px) saturate(180%)",
            }}
          >
            {/* Top Specular Rim & Flare */}
            <div className="absolute top-0 inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none z-20" />
            <div className="absolute top-0 right-[25%] w-24 h-[2.5px] bg-white rounded-full blur-[1px] pointer-events-none shadow-[0_0_12px_4px_rgba(255,255,255,0.95)] z-20" />

            {/* Image Banner */}
            <div className="relative h-[165px] sm:h-[185px] lg:h-[195px] xl:h-[215px] w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80"
                alt="2D Room Planner"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              {/* Floating Pill Badge */}
              <div className="absolute top-3.5 left-3.5 px-3 py-1.5 rounded-full bg-[#102D25]/85 backdrop-blur-xl text-white text-[11px] font-bold flex items-center gap-1.5 shadow-soft border border-white/30">
                <Layers className="w-3.5 h-3.5 text-terracotta" />
                <span>2D Interactive Canvas</span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4.5 sm:p-5 lg:p-6 flex flex-col justify-between flex-1 space-y-3">
              <div className="space-y-1 sm:space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-forest-deep group-hover:text-terracotta transition-colors leading-tight">
                  Design Your Room
                </h3>
                <p className="text-xs sm:text-[13px] text-forest-muted leading-relaxed line-clamp-2">
                  Configure your exact room dimensions, select floor finishes, drag and rotate scale furniture items, and export a ready-to-order bill of materials.
                </p>
              </div>

              <div className="pt-1">
                <Link
                  href="/room-studio/planner"
                  className="group/btn relative inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 rounded-full bg-forest-dark text-white text-xs font-heading font-extrabold tracking-wider uppercase transition-all duration-300 shadow-soft hover:bg-forest-deep hover:scale-105 border border-white/20 select-none"
                >
                  <span>Launch 2D Planner</span>
                  <ArrowRight
                    className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1"
                    strokeWidth={2.4}
                  />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Feature 2: Visualise Furniture in Your Space (Photo Visualizer) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="group rounded-[28px] sm:rounded-[34px] lg:rounded-[38px] overflow-hidden relative flex flex-col justify-between border-[1.5px] border-white/80 shadow-[0_20px_50px_rgba(20,55,35,0.1),inset_0_2px_3px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_rgba(20,55,35,0.16)]"
            style={{
              background:
                "linear-gradient(140deg, rgba(255, 255, 255, 0.68) 0%, rgba(234, 246, 230, 0.45) 50%, rgba(255, 255, 255, 0.58) 100%)",
              backdropFilter: "blur(30px) saturate(180%)",
              WebkitBackdropFilter: "blur(30px) saturate(180%)",
            }}
          >
            {/* Top Specular Rim & Flare */}
            <div className="absolute top-0 inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none z-20" />
            <div className="absolute top-0 right-[25%] w-24 h-[2.5px] bg-white rounded-full blur-[1px] pointer-events-none shadow-[0_0_12px_4px_rgba(255,255,255,0.95)] z-20" />

            {/* Image Banner */}
            <div className="relative h-[165px] sm:h-[185px] lg:h-[195px] xl:h-[215px] w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
                alt="Room Visualizer"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              {/* Floating Pill Badge */}
              <div className="absolute top-3.5 left-3.5 px-3 py-1.5 rounded-full bg-[#102D25]/85 backdrop-blur-xl text-white text-[11px] font-bold flex items-center gap-1.5 shadow-soft border border-white/30">
                <Wand2 className="w-3.5 h-3.5 text-terracotta" />
                <span>AI Photo Visualizer</span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4.5 sm:p-5 lg:p-6 flex flex-col justify-between flex-1 space-y-3">
              <div className="space-y-1 sm:space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-forest-deep group-hover:text-terracotta transition-colors leading-tight">
                  Visualise in Your Room
                </h3>
                <p className="text-xs sm:text-[13px] text-forest-muted leading-relaxed line-clamp-2">
                  Snap or upload a photo of your actual space, pick furniture from our catalog, and see realistic composited placements instantly.
                </p>
              </div>

              <div className="pt-1">
                <Link
                  href="/room-studio/visualizer"
                  className="group/btn relative inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 rounded-full bg-forest-dark text-white text-xs font-heading font-extrabold tracking-wider uppercase transition-all duration-300 shadow-soft hover:bg-forest-deep hover:scale-105 border border-white/20 select-none"
                >
                  <span>Launch Visualizer</span>
                  <ArrowRight
                    className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1"
                    strokeWidth={2.4}
                  />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
    </>
  );
}
