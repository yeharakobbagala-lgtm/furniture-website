"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  CreditCard,
  Truck,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

  interface CategoryCardItem {
    id: string;
    name: string;
    badge: string;
    slug: string;
    image: string;
    alt: string;
    count: number;
  }

  const bentoCategories: {
    chairs: CategoryCardItem;
    couch: CategoryCardItem;
    dressingTable: CategoryCardItem;
    sofas: CategoryCardItem;
    storage: CategoryCardItem;
    tables: CategoryCardItem;
    beds: CategoryCardItem;
  } = {
    chairs: {
      id: "bento-chairs",
      name: "Architectural Chairs",
      badge: "Chairs",
      slug: "lounge-chairs",
      image: "/categories/chairs_v2.jpg",
      alt: "Sculptural velvet accent armchair with wooden legs",
      count: 14,
    },
    couch: {
      id: "bento-couch",
      name: "Cocoon Lounge Armchair",
      badge: "Coach",
      slug: "lounge-chairs",
      image: "/categories/couch_v2.jpg",
      alt: "Soft cocoon clam shell armchair in plush textured fabric",
      count: 11,
    },
    dressingTable: {
      id: "bento-dressing",
      name: "Luxury Dressing Vanity",
      badge: "Dressing T",
      slug: "wardrobes",
      image: "/categories/dressing-table_v2.jpg",
      alt: "Minimalist modern dressing table with illuminated vanity mirror and stool",
      count: 7,
    },
    sofas: {
      id: "bento-sofas",
      name: "Curved Living Sofas",
      badge: "Sofas",
      slug: "sofas",
      image: "/categories/sofas_v2.jpg",
      alt: "Modern minimalist cream designer sofa with timber accent table",
      count: 16,
    },
    storage: {
      id: "bento-storage",
      name: "Modular Floating Storage",
      badge: "Storage",
      slug: "storage",
      image: "/categories/storage_v2.jpg",
      alt: "Wall-mounted illuminated geometric modular shelving boxes",
      count: 9,
    },
    tables: {
      id: "bento-tables",
      name: "Sculptural Pedestal Tables",
      badge: "Tables",
      slug: "dining-tables",
      image: "/categories/tables_v2.jpg",
      alt: "Sculptural spiral wooden pedestal base round dining table",
      count: 12,
    },
    beds: {
      id: "bento-beds",
      name: "Channeled Platform Beds",
      badge: "Beds",
      slug: "beds",
      image: "/categories/beds_v2.jpg",
      alt: "Upholstered channel-tufted platform bed with nightstand suite",
      count: 8,
    },
  };

  const trustFeatures = [
    {
      icon: Clock,
      title: "24/7 Support",
      subtitle: "Dedicated design advisors ready to assist",
    },
    {
      icon: CreditCard,
      title: "Flexible Payment",
      subtitle: "Zero-interest installments & secure checkout",
    },
    {
      icon: Truck,
      title: "Free Shipping",
      subtitle: "Complimentary white-glove room delivery",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const cardItemVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const textFadeInVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  interface BentoCardProps {
    item: CategoryCardItem;
    className?: string;
    aspectClass?: string;
  }

  function BentoCard({ item, className = "", aspectClass = "" }: BentoCardProps) {
    return (
                <motion.div
                  variants={cardItemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                  className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-ivory-warm shadow-soft border border-borderSage/60 hover:border-forest-dark/30 hover:shadow-card transition-all duration-300 ${className}`}
                >
                  <Link href={`/shop/${item.slug}`} className="block w-full h-full">
                    <div className={`relative w-full h-full overflow-hidden ${aspectClass}`}>
                      {/* Main Category Image with Smooth Zoom */}
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 group-hover:brightness-[1.02]"
                        priority={item.id === "bento-sofas" || item.id === "bento-chairs"}
                      />

                      {/* Subtle Ambient Vignette Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10 pointer-events-none opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                      {/* Floating Category Badge Pill (Matches Reference Image) */}
                      <div className="absolute bottom-3 left-3 sm:bottom-3.5 sm:left-3.5 z-10 pointer-events-none">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl bg-white/90 backdrop-blur-md shadow-sm border border-white/70 text-forest-deep text-xs sm:text-[13px] font-semibold tracking-wide transition-all duration-300 group-hover:bg-white group-hover:shadow-md"
                        >
                          <span>{item.badge}</span>
                        </motion.div>
                      </div>

                      {/* Hover Explore Indicator (Top-Right) */}
                      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 pointer-events-none">
                        <span className="w-7 h-7 rounded-full bg-forest-deep/85 text-white flex items-center justify-center shadow-md">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
                );
}

                          export default function CategorySection() {
  const {chairs, couch, dressingTable, sofas, storage, tables, beds} =
                        bentoCategories;

                        return (
                        <section className="py-16 sm:py-24 bg-[#EAF0E8] overflow-hidden border-b border-borderSage/70 select-none">
                          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {/* Main Grid: Left 7-card Bento Grid + Right Content Panel */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                              {/* ========================================================== */}
                              {/* LEFT SIDE: Asymmetrical Modern Bento Grid (7 Categories)    */}
                              {/* Matches the reference layout with 100% pixel harmony       */}
                              {/* ========================================================== */}
                              <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-60px" }}
                                className="lg:col-span-7 xl:col-span-8 w-full"
                              >
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 w-full">
                                  {/* SUB-COLUMN 1: Left Vertical Stack (Chairs, Coach, Dressing T) */}
                                  <div className="flex flex-col gap-3.5 sm:gap-4 sm:col-span-1">
                                    {/* 1. Chairs */}
                                    <BentoCard
                                      item={chairs}
                                      className="h-[185px] sm:h-[195px]"
                                      aspectClass="h-full"
                                    />

                                      {/* 2. Coach / Armchair */}
                                      <BentoCard
                                        item={couch}
                                        className="h-[175px] sm:h-[185px]"
                                        aspectClass="h-full"
                                      />

                                      {/* 3. Dressing Table */}
                                      <BentoCard
                                        item={dressingTable}
                                        className="h-[175px] sm:h-[185px]"
                                        aspectClass="h-full"
                                      />
                                    </div>

                                    {/* SUB-COLUMNS 2 & 3: Right Stack (Sofas, Storage+Tables, Beds) */}
                                    <div className="flex flex-col gap-3.5 sm:gap-4 sm:col-span-2">
                                      {/* 4. Sofas (Wide Horizontal Card) */}
                                      <BentoCard
                                        item={sofas}
                                        className="h-[185px] sm:h-[195px]"
                                        aspectClass="h-full"
                                      />

                                      {/* 5 & 6. Storage + Tables (Twin Square Cards Side-by-Side) */}
                                      <div className="grid grid-cols-2 gap-3.5 sm:gap-4 w-full">
                                        <BentoCard
                                          item={storage}
                                          className="h-[175px] sm:h-[185px]"
                                          aspectClass="h-full"
                                        />
                                        <BentoCard
                                          item={tables}
                                          className="h-[175px] sm:h-[185px]"
                                          aspectClass="h-full"
                                        />
                                      </div>

                                      {/* 7. Beds (Wide Horizontal Card) */}
                                      <BentoCard
                                        item={beds}
                                        className="h-[175px] sm:h-[185px]"
                                        aspectClass="h-full"
                                      />
                                    </div>
                                </div>
                              </motion.div>

                              {/* ========================================================== */}
                              {/* RIGHT SIDE: Information, Trust Perks & Explore More Button */}
                              {/* ========================================================== */}
                              <motion.div
                                variants={textFadeInVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-60px" }}
                                className="lg:col-span-5 xl:col-span-4 flex flex-col justify-center space-y-6 lg:pl-4"
                              >
                                {/* Header Titles */}
                                <div className="space-y-3">
                                  <span className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-[0.2em] text-terracotta">
                                    <Sparkles className="w-3.5 h-3.5" /> Curated Living
                                  </span>
                                  <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-heading font-extrabold text-[#193221] tracking-tight leading-[1.12]">
                                    Explore By Categories
                                  </h2>
                                  <p className="text-sm sm:text-base font-serif italic text-forest-deep/85 font-medium leading-relaxed">
                                    &ldquo;Transform Your Home with Modern Comfort&rdquo;
                                  </p>
                                  <p className="text-xs sm:text-sm text-forest-muted leading-relaxed">
                                    Clear, emotional, and reflects our architectural aesthetic —
                                    crafted for comfort, natural sustainability, and refined style.
                                  </p>
                                </div>

                                {/* Trust Features (24/7 Support, Flexible Payment, Free Shipping) */}
                                <div className="space-y-4 pt-2 border-t border-borderSage/50">
                                  {trustFeatures.map((feat, idx) => {
                                    const IconComponent = feat.icon;
                                    return (
                                      <motion.div
                                        key={feat.title}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.15 + idx * 0.1, duration: 0.5 }}
                                        whileHover={{ x: 6, transition: { duration: 0.2 } }}
                                        className="flex items-center gap-4 group cursor-default p-2 rounded-xl transition-colors hover:bg-white/40"
                                      >
                                        {/* Circle Icon Badge */}
                                        <div className="w-12 h-12 rounded-full bg-white shadow-soft border border-borderSage/80 flex items-center justify-center text-forest-deep group-hover:bg-[#233D4D] group-hover:text-white transition-all duration-300 shrink-0">
                                          <IconComponent className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                                        </div>

                                        {/* Text Label */}
                                        <div className="flex flex-col">
                                          <span className="font-heading font-bold text-base text-[#193221] group-hover:text-[#233D4D] transition-colors leading-tight">
                                            {feat.title}
                                          </span>
                                          <span className="text-xs text-forest-muted leading-tight mt-0.5">
                                            {feat.subtitle}
                                          </span>
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>

                                {/* Explore More CTA Button */}
                                <div className="pt-2">
                                  <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-block"
                                  >
                                    <Link
                                      href="/shop"
                                      className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#233D4D] hover:bg-[#1B2F3C] text-white font-heading font-bold text-base shadow-soft hover:shadow-floating transition-all duration-300"
                                    >
                                      <span>Explore More</span>
                                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                                    </Link>
                                  </motion.div>
                                </div>
                              </motion.div>
                            </div>
                          </div>
                        </section>
                        );
}
