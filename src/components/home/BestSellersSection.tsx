"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { bestSellersData } from "@/data/best-sellers";
import BestSellerCard from "./BestSellerCard";

export default function BestSellersSection() {
  return (
    <section
      className="py-16 sm:py-20 lg:py-24 bg-[#E5EDE1] border-b border-borderSage/70 relative overflow-hidden w-full"
      aria-label="Square Best Sellers Showcase"
    >
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.22em] font-bold text-terracotta block">
              OUR COLLECTION
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-forest-deep tracking-tight">
              BEST SELLERS
            </h2>
            <p className="text-base sm:text-lg text-forest-muted max-w-xl font-normal leading-relaxed pt-1">
              Discover the furniture pieces our customers love most.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-bold tracking-wide text-forest-deep hover:text-terracotta transition-colors group self-start md:self-end pb-1 border-b border-forest-deep/20 hover:border-terracotta"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 text-forest-deep group-hover:text-terracotta group-hover:translate-x-1.5 transition-all" />
          </Link>
        </div>

        {/* 
          Four-Card Horizontal Responsive Grid:
          - Desktop (lg): 4 cards in one row matching reference
          - Tablet (sm): 2 cards per row
          - Mobile: 1 card per row
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-7">
          {bestSellersData.map((item) => (
            <BestSellerCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
