"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { products } from "@/data/products";

export default function NewArrivalsSection() {
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);

  return (
    <section className="py-20 bg-ivory-warm border-b border-borderSage/70 w-full">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-terracotta mb-2">
              <Sparkles className="w-3.5 h-3.5" /> RECENT RELEASES
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-forest-deep tracking-tight">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="text-sm font-semibold text-forest-deep hover:text-terracotta flex items-center gap-1.5 group"
          >
            Explore all new designs
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
