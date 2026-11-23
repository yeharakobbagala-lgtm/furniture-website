"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { designers } from "@/data/designers";
import SplitText from "@/components/ui/SplitText";
import DesignerSpotlightMobileView from "./DesignerSpotlightMobileView";

export default function DesignerSpotlight() {
  return (
    <>
      {/* ============================================================ */}
      {/* MOBILE DESIGNER SPOTLIGHT (< lg)                             */}
      {/* ============================================================ */}
      <div className="block lg:hidden w-full">
        <DesignerSpotlightMobileView />
      </div>

      {/* ============================================================ */}
      {/* DESKTOP DESIGNER SPOTLIGHT (>= lg)                           */}
      {/* ============================================================ */}
      <section className="hidden lg:block py-20 bg-sage-light border-b border-borderSage/70 w-full select-none">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-terracotta block mb-2">
              <SplitText
                text="MASTER ATELIERS"
                effect="fade"
                splitType="chars"
                delay={25}
                duration={0.7}
                trigger="view"
              />
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-forest-deep tracking-tight cursor-default">
              <SplitText
                text="Designer Spotlight"
                effect="rise"
                hoverEffect="lift"
                splitType="chars"
                delay={40}
                duration={1.1}
                trigger="view"
              />
            </h2>
          </div>
          <Link
            href="/designers"
            className="text-sm font-semibold text-forest-deep hover:text-terracotta flex items-center gap-1.5 group"
          >
            <span>Meet all master craftsmen</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Designers Grid with Staggered Entrance & Photo Zoom */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {designers.map((designer, index) => (
            <motion.div
              key={designer.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
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

              <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                <p className="text-xs text-forest-muted leading-relaxed line-clamp-3">
                  {designer.biography}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-borderSage text-xs">
                  <span className="text-forest-muted">{designer.speciality}</span>
                  <span className="font-bold text-forest-deep group-hover:text-terracotta transition-colors flex items-center gap-1">
                    Portfolio <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}
