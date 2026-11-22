"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { designers } from "@/data/designers";

export default function DesignerSpotlight() {
  return (
    <section className="py-20 bg-sage-light border-b border-borderSage/70 w-full">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-terracotta block mb-2">
              MASTER ATELIERS
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-forest-deep tracking-tight">
              Designer Spotlight
            </h2>
          </div>
          <Link
            href="/designers"
            className="text-sm font-semibold text-forest-deep hover:text-terracotta flex items-center gap-1.5 group"
          >
            Meet all master craftsmen
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Designers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {designers.map((designer) => (
            <div
              key={designer.id}
              className="group rounded-3xl overflow-hidden bg-ivory-warm border border-borderSage hover:border-forest-dark/40 hover:shadow-card transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-sage-50">
                <Image
                  src={designer.portraitImage}
                  alt={designer.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-sage-200">
                    {designer.role}
                  </span>
                  <h3 className="text-lg font-heading font-bold text-white group-hover:text-terracotta transition-colors">
                    {designer.name}
                  </h3>
                  <p className="flex items-center gap-1 text-xs text-sage-300 mt-0.5">
                    <MapPin className="w-3 h-3 text-terracotta" /> {designer.location}
                  </p>
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-forest-muted leading-relaxed line-clamp-3">
                  {designer.philosophy}
                </p>
                <div className="pt-2 border-t border-borderSage/50">
                  <Link
                    href={`/designers/${designer.slug}`}
                    className="text-xs font-bold text-forest-deep group-hover:text-terracotta flex items-center justify-between transition-colors"
                  >
                    <span>View Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
