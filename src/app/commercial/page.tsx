"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
  FileText,
  Users,
  Award,
} from "lucide-react";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/products/ProductCard";

export default function CommercialHubPage() {
  const commercialProducts = products.filter(
    (p) => p.suitableFor.includes("commercial")
  );

  return (
    <div className="w-full bg-sage-light min-h-screen pb-24">
      {/* Hero Section */}
      <div className="relative bg-forest-dark text-white py-20 overflow-hidden">
        <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full bg-terracotta/10 blur-3xl pointer-events-none" />

        <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-deep border border-forest/60 text-xs tracking-widest font-bold uppercase text-terracotta">
              <Building2 className="w-4 h-4" /> SQUARE CONTRACT & TRADE
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white tracking-tight leading-[1.1]">
              Architectural Furniture for Commercial Spaces
            </h1>

            <p className="text-base sm:text-lg text-sage-200 leading-relaxed">
              We furnish luxury boutique hotels, corporate headquarters, Michelin dining establishments, and high-end residential developments with commercial-grade durability and artisanal soul.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/commercial/quote"
                className="px-8 py-4 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold uppercase tracking-wider transition-all shadow-card flex items-center gap-2"
              >
                Submit RFQ Quotation Request <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#commercial-catalog"
                className="px-6 py-4 rounded-xl border border-borderSage/40 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                Browse Contract Catalog
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Commercial Value Pillars */}
      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              icon: ShieldCheck,
              title: "BIFMA & Crib 5 Certified",
              desc: "Tested for high-traffic commercial abrasion resistance and fire safety.",
            },
            {
              icon: Award,
              title: "Tiered Contract Pricing",
              desc: "Volume pricing brackets for developers, interior architects, and hospitality groups.",
            },
            {
              icon: Truck,
              title: "Dedicated Project Freight",
              desc: "Consolidated freight staging, scheduled phased deliveries, and onsite installation.",
            },
            {
              icon: Users,
              title: "Dedicated Trade Concierge",
              desc: "Direct access to our material library, 3D CAD models, and custom joinery team.",
            },
          ].map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-ivory-warm border border-borderSage shadow-soft space-y-2"
            >
              <div className="w-10 h-10 rounded-xl bg-forest-dark text-white flex items-center justify-center mb-3">
                <pillar.icon className="w-5 h-5 text-terracotta" />
              </div>
              <h3 className="font-heading font-bold text-base text-forest-deep">{pillar.title}</h3>
              <p className="text-xs text-forest-muted leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Commercial Typologies */}
      <div id="commercial-catalog" className="w-full max-w-[1850px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 pt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-terracotta block mb-2">
              SECTOR SOLUTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-forest-deep tracking-tight">
              Contract Furniture Catalog
            </h2>
          </div>
          <Link
            href="/commercial/quote"
            className="text-sm font-semibold text-terracotta hover:underline flex items-center gap-1.5"
          >
            Review Quotation Draft →
          </Link>
        </div>

        {/* Commercial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {commercialProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
