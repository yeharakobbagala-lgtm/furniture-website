"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Layers, Sparkles, Wand2 } from "lucide-react";

export default function RoomStudioMobileView() {
  const [activeTab, setActiveTab] = useState<"planner" | "visualizer">("planner");

  return (
    <section className="relative w-full py-8 sm:py-10 bg-[#DFEADA] border-b border-borderSage/70 select-none overflow-hidden text-[#102D25]">
      <div className="w-full px-5 sm:px-6 max-w-[480px] mx-auto">
        {/* Header */}
        <div className="text-center mb-6 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-extrabold text-[#C85226]">
            <Sparkles className="w-3.5 h-3.5 text-[#C85226]" />
            <span>Interactive Design Studio</span>
          </div>
          <h2 className="text-[28px] sm:text-[32px] font-heading font-black tracking-tight text-[#102D25] leading-[1.12]">
            Bring Your Dream
            <br />
            Room to Life
          </h2>
          <p className="text-xs sm:text-[13px] text-[#587763] font-normal leading-relaxed pt-0.5">
            Test furniture scale, layout proportions, and visual harmony before you order.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center justify-center p-1 rounded-full bg-white/60 backdrop-blur-md border border-white/70 shadow-xs mb-5">
          <button
            onClick={() => setActiveTab("planner")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-bold transition-all ${
              activeTab === "planner"
                ? "bg-[#102D25] text-white shadow-sm"
                : "text-[#102D25]/70 hover:text-[#102D25]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2D Planner</span>
          </button>
          <button
            onClick={() => setActiveTab("visualizer")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-bold transition-all ${
              activeTab === "visualizer"
                ? "bg-[#102D25] text-white shadow-sm"
                : "text-[#102D25]/70 hover:text-[#102D25]"
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>AI Visualizer</span>
          </button>
        </div>

        {/* Studio Cards */}
        {activeTab === "planner" ? (
          <div className="rounded-[28px] overflow-hidden bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_16px_40px_rgba(20,55,35,0.08)] transition-all">
            {/* Image Preview */}
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
                alt="2D Room Planner Preview"
                fill
                sizes="(max-width: 640px) 100vw, 400px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Floating Pill Badge */}
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-[#102D25]/85 backdrop-blur-md text-white text-[10.5px] font-bold flex items-center gap-1.5 shadow-sm border border-white/20">
                <Layers className="w-3 h-3 text-[#E0A97E]" />
                <span>2D Interactive Canvas</span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 space-y-3.5">
              <div>
                <h3 className="text-xl font-heading font-extrabold text-[#102D25]">
                  Design Your Room
                </h3>
                <p className="text-xs text-[#587763] font-normal leading-relaxed mt-1">
                  Configure room dimensions, select floor finishes, drag and rotate scaled furniture, and export your bill of materials.
                </p>
              </div>

              <Link
                href="/room-studio/planner"
                className="w-full py-3.5 rounded-full bg-[#102D25] hover:bg-[#1a4237] text-white text-xs font-heading font-extrabold tracking-wider uppercase shadow-md flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
              >
                <span>Launch 2D Planner</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-[28px] overflow-hidden bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_16px_40px_rgba(20,55,35,0.08)] transition-all">
            {/* Image Preview */}
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
                alt="Room Visualizer Preview"
                fill
                sizes="(max-width: 640px) 100vw, 400px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Floating Pill Badge */}
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-[#102D25]/85 backdrop-blur-md text-white text-[10.5px] font-bold flex items-center gap-1.5 shadow-sm border border-white/20">
                <Wand2 className="w-3 h-3 text-[#E0A97E]" />
                <span>AI Photo Visualizer</span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 space-y-3.5">
              <div>
                <h3 className="text-xl font-heading font-extrabold text-[#102D25]">
                  Visualise in Your Room
                </h3>
                <p className="text-xs text-[#587763] font-normal leading-relaxed mt-1">
                  Snap or upload a photo of your actual space, pick furniture from our catalog, and preview realistic composited placements instantly.
                </p>
              </div>

              <Link
                href="/room-studio/visualizer"
                className="w-full py-3.5 rounded-full bg-[#102D25] hover:bg-[#1a4237] text-white text-xs font-heading font-extrabold tracking-wider uppercase shadow-md flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
              >
                <span>Launch Photo Visualizer</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
