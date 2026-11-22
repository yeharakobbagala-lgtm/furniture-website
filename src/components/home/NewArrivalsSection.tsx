"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { newArrivalsData } from "@/data/new-arrivals";
import NewArrivalCard from "./NewArrivalCard";
import SplitText from "@/components/ui/SplitText";

export default function NewArrivalsSection() {
  return (
    <section
      className="py-16 sm:py-20 lg:py-24 bg-[#E5EDE1] border-b border-borderSage/70 relative overflow-hidden w-full select-none"
      aria-label="Square New Arrivals Showcase"
    >
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.22em] font-bold text-terracotta block">
              <SplitText
                text="SEASONAL COLLECTION"
                effect="fade"
                splitType="chars"
                delay={25}
                duration={0.7}
                trigger="view"
              />
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-forest-deep tracking-tight cursor-default">
              <SplitText
                text="NEW ARRIVALS"
                effect="rise"
                hoverEffect="lift"
                splitType="chars"
                delay={40}
                duration={1.1}
                trigger="view"
              />
            </h2>
            <p className="text-base sm:text-lg text-forest-muted max-w-xl font-normal leading-relaxed pt-1">
              Discover the latest architectural silhouettes and solid timber creations from our atelier.
            </p>
          </div>

          <Link
            href="/shop?sort=newest"
            className="inline-flex items-center gap-2 text-sm font-bold tracking-wide text-forest-deep hover:text-terracotta transition-colors group self-start md:self-end pb-1 border-b border-forest-deep/20 hover:border-terracotta"
          >
            <span>Explore All New Designs</span>
            <ArrowRight className="w-4 h-4 text-forest-deep group-hover:text-terracotta group-hover:translate-x-1.5 transition-all" />
          </Link>
        </div>

        {/* 
          Four-Card Horizontal Responsive Grid with Staggered Entrance
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-7">
          {newArrivalsData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <NewArrivalCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
