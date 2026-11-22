"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { collections } from "@/data/collections";

export default function CollectionsSection() {
  return (
    <section className="py-20 bg-ivory-warm border-b border-borderSage/70 w-full">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-terracotta mb-2">
              <Sparkles className="w-3.5 h-3.5" /> CURATED EDITIONS
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-forest-deep tracking-tight">
              Featured Design Collections
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold text-forest-deep hover:text-terracotta flex items-center gap-1.5 group"
          >
            Explore all architectural suites
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Collections Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col, idx) => (
            <Link
              key={col.id}
              href={`/shop?style=${encodeURIComponent(col.style)}`}
              className={`group relative rounded-3xl overflow-hidden border border-borderSage/80 bg-sage-50 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-end ${
                idx === 0 || idx === 3 ? "md:row-span-1" : ""
              }`}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/30 to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 text-white space-y-2">
                <div className="flex items-center justify-between text-xs text-sage-200">
                  <span className="uppercase tracking-widest font-semibold">{col.style}</span>
                  <span>{col.productCount} pieces</span>
                </div>
                <h3 className="text-2xl font-heading font-bold text-white group-hover:text-terracotta transition-colors">
                  {col.title}
                </h3>
                <p className="text-xs text-sage-200 line-clamp-2 leading-relaxed">
                  {col.description}
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-white group-hover:text-terracotta transition-colors">
                  <span>View Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
