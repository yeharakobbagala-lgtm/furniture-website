"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  Clock,
  CreditCard,
  Truck,
  ArrowRight,
  Sparkles,
  Armchair,
  Sofa,
  Bed,
  Archive,
} from "lucide-react";

// Custom SVG Table Icon perfectly matching the reference
function TableIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 7h18" />
      <path d="M6 7v11" />
      <path d="M18 7v11" />
      <path d="M6 12h12" />
    </svg>
  );
}

interface CategoryCardItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  alt: string;
  icon: React.ComponentType<{ className?: string }>;
}

const categoriesList: {
  chairs: CategoryCardItem;
  sofas: CategoryCardItem;
  couch: CategoryCardItem;
  storage: CategoryCardItem;
  tables: CategoryCardItem;
  bedroom: CategoryCardItem;
} = {
  chairs: {
    id: "cat-chairs",
    name: "Chairs",
    slug: "lounge-chairs",
    image: "/categories/chairs_v2.webp",
    alt: "Sculptural accent armchair with wooden legs",
    icon: Armchair,
  },
  sofas: {
    id: "cat-sofas",
    name: "Sofas",
    slug: "sofas",
    image: "/categories/sofas_v2.webp",
    alt: "Modern tufted designer sofa with cushions",
    icon: Sofa,
  },
  couch: {
    id: "cat-couch",
    name: "Coach",
    slug: "lounge-chairs",
    image: "/categories/couch_v2.webp",
    alt: "Comfortable lounge armchair in textured fabric",
    icon: Armchair,
  },
  storage: {
    id: "cat-storage",
    name: "Storage",
    slug: "storage",
    image: "/categories/storage_v2.webp",
    alt: "Wall-mounted modular shelving storage boxes",
    icon: Archive,
  },
  tables: {
    id: "cat-tables",
    name: "Tables",
    slug: "dining-tables",
    image: "/categories/tables_v2.webp",
    alt: "Sculptural modern pedestal desk and tables",
    icon: TableIcon,
  },
  bedroom: {
    id: "cat-bedroom",
    name: "Bedroom",
    slug: "beds",
    image: "/categories/beds_v2.webp",
    alt: "Luxury tufted bedroom suite with platform bed",
    icon: Bed,
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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

interface CollageCardProps {
  item: CategoryCardItem;
  className?: string;
  priority?: boolean;
}

function CollageCard({ item, className = "", priority = false }: CollageCardProps) {
  const IconComponent = item.icon;

  return (
    <motion.div
      variants={cardItemVariants}
      whileHover={{ y: -3, transition: { duration: 0.25 } }}
      className={`group relative overflow-hidden rounded-[20px] sm:rounded-[24px] lg:rounded-[26px] bg-[#2A4430] border border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all duration-500 ${className}`}
    >
      <Link href={`/shop/${item.slug}`} className="block w-full h-full relative">
        {/* Category Image with Smooth Zoom */}
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106 group-hover:brightness-[1.03]"
          priority={priority}
        />

        {/* Top Specular Curved Highlight Rim (Light Refraction) */}
        <div className="absolute top-0 left-3 right-3 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none z-10" />

        {/* Delicate Corner Refraction Glows */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-white/35 to-transparent rounded-tl-[24px] pointer-events-none z-10 opacity-75" />
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/35 to-transparent rounded-tr-[24px] pointer-events-none z-10 opacity-75" />

        {/* Ambient Dark-Gradient Shadow Overlay at the Bottom for High Contrast */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 via-black/20 to-transparent pointer-events-none" />

        {/* Bottom Floating Liquid Glass Pill Label */}
        <div className="absolute bottom-3 left-3 sm:bottom-3.5 sm:left-3.5 z-20 pointer-events-none">
          <div className="inline-flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-white/45 backdrop-blur-xl border border-white/70 shadow-[0_6px_20px_rgba(0,0,0,0.16),inset_0_1px_1.5px_rgba(255,255,255,0.85)] text-white whitespace-nowrap transition-all duration-300 group-hover:bg-white/60 group-hover:border-white">
            {/* White Category Icon */}
            <IconComponent className="w-4 h-4 text-white drop-shadow-sm shrink-0" />

            {/* Category Name */}
            <span className="font-heading font-bold text-white text-xs sm:text-[13px] tracking-wide drop-shadow-sm select-none whitespace-nowrap">
              {item.name}
            </span>

            {/* Circular Arrow Button */}
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/35 border border-white/65 flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-[#102D25] transition-all duration-300 ml-0.5 shadow-sm">
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CategorySection() {
  const { chairs, sofas, couch, storage, tables, bedroom } = categoriesList;

  return (
    <section className="py-8 sm:py-12 lg:py-14 xl:py-20 bg-[#DFEADA] overflow-hidden border-b border-borderSage/70 select-none w-full">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-14 2xl:px-16">
        {/* Main 2-Column Responsive Layout matching reference */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-center">
          {/* ========================================================== */}
          {/* LEFT COLUMN (~63%): Olive-Green Frame Collage Container     */}
          {/* ========================================================== */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="lg:col-span-7 xl:col-span-8 flex flex-col w-full rounded-[28px] sm:rounded-[34px] lg:rounded-[40px] bg-[#36563D] p-3.5 sm:p-4.5 lg:p-5 border border-white/20 shadow-[0_20px_50px_rgba(20,55,35,0.16),inset_0_1px_1px_rgba(255,255,255,0.25)] relative overflow-hidden"
          >
            {/* Subtle Top Specular Rim on the Olive Frame */}
            <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

            {/* Grid of 3 Rows matching the exact layout */}
            <div className="flex flex-col gap-3.5 sm:gap-4 lg:gap-4.5 w-full h-full justify-between">
              {/* ---------------------------------------------------- */}
              {/* ROW 1: Chairs (narrower ~37%) + Sofas (wider ~63%)   */}
              {/* ---------------------------------------------------- */}
              <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 lg:gap-4.5 w-full h-[200px] sm:h-[220px] lg:h-[220px] xl:h-[270px]">
                {/* 1. Chairs */}
                <CollageCard
                  item={chairs}
                  className="w-full sm:w-[37%] h-full"
                  priority={true}
                />
                {/* 2. Sofas */}
                <CollageCard
                  item={sofas}
                  className="w-full sm:flex-1 h-full"
                  priority={true}
                />
              </div>

              {/* ---------------------------------------------------- */}
              {/* ROW 2: Coach (~31%) + Storage (~38%) + Tables (~31%) */}
              {/* ---------------------------------------------------- */}
              <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 lg:gap-4.5 w-full h-[190px] sm:h-[210px] lg:h-[205px] xl:h-[250px]">
                {/* 3. Coach */}
                <CollageCard
                  item={couch}
                  className="w-full sm:w-[31%] h-full"
                />
                {/* 4. Storage */}
                <CollageCard
                  item={storage}
                  className="w-full sm:flex-1 h-full"
                />
                {/* 5. Tables */}
                <CollageCard
                  item={tables}
                  className="w-full sm:w-[31%] h-full"
                />
              </div>

              {/* ---------------------------------------------------- */}
              {/* ROW 3: Bedroom (Full-Width Horizontal Card)          */}
              {/* ---------------------------------------------------- */}
              <div className="w-full h-[175px] sm:h-[195px] lg:h-[195px] xl:h-[240px]">
                {/* 6. Bedroom */}
                <CollageCard
                  item={bedroom}
                  className="w-full h-full"
                />
              </div>
            </div>
          </motion.div>

          {/* ========================================================== */}
          {/* RIGHT COLUMN (~37%): Translucent Liquid Glass Info Panel   */}
          {/* Matches the closeup reference with 100% optical fidelity   */}
          {/* ========================================================== */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 xl:col-span-4 relative rounded-[32px] sm:rounded-[42px] lg:rounded-[44px] xl:rounded-[48px] p-5 sm:p-7 lg:p-7 xl:p-10 flex flex-col justify-start overflow-hidden border-[1.5px] border-white/80 shadow-[0_24px_60px_rgba(18,48,32,0.1),inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(0,0,0,0.04)]"
            style={{
              background: "linear-gradient(140deg, rgba(255, 255, 255, 0.54) 0%, rgba(228, 242, 224, 0.34) 50%, rgba(255, 255, 255, 0.48) 100%)",
              backdropFilter: "blur(28px) saturate(190%)",
              WebkitBackdropFilter: "blur(28px) saturate(190%)",
            }}
          >
            {/* Optical Specular Glints on the Top Curved Rim (matching reference flares) */}
            <div className="absolute top-0 left-[20%] w-16 h-[3px] bg-white rounded-full blur-[1px] pointer-events-none shadow-[0_0_12px_4px_rgba(255,255,255,0.9)]" />
            <div className="absolute top-0 right-[25%] w-24 h-[3px] bg-white rounded-full blur-[1px] pointer-events-none shadow-[0_0_14px_5px_rgba(255,255,255,0.9)]" />

            {/* Bottom-Right Corner Specular Light Bloom (prominent in reference) */}
            <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-gradient-to-tl from-white/95 via-white/50 to-transparent blur-xl rounded-full pointer-events-none" />

            {/* Ambient Refraction Edge Highlight */}
            <div className="absolute top-0 inset-x-8 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />

            {/* Header Content */}
            <div className="space-y-2.5 sm:space-y-3 relative z-10">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-[12.5px] uppercase font-extrabold tracking-[0.22em] text-[#C85226]">
                <Sparkles className="w-3.5 h-3.5 text-[#C85226]" />
                <span>Curated Living</span>
              </div>

              {/* Main Heading */}
              <h2 className="text-2xl sm:text-[32px] lg:text-[34px] xl:text-[40px] font-heading font-extrabold text-[#0F2B20] tracking-[-0.03em] leading-[1.1]">
                Explore By Categories
              </h2>

              {/* Italic Subtitle */}
              <p className="text-[14px] sm:text-[16px] font-serif italic text-[#264433] font-medium leading-relaxed">
                &ldquo;Transform Your Home with Modern Comfort&rdquo;
              </p>

              {/* Description */}
              <p className="text-[12.5px] sm:text-[13.5px] text-[#4A5D4F] leading-[1.6]">
                Clear, emotional, and reflects our architectural aesthetic — crafted for comfort, natural sustainability, and refined style.
              </p>
            </div>

            {/* Service Features (Tactile 3D Porcelain/Glass Pebble Droplets) */}
            <div className="space-y-2.5 sm:space-y-3 xl:space-y-4 my-3.5 sm:my-4 xl:my-6 relative z-10">
              {trustFeatures.map((feat, idx) => {
                const IconComponent = feat.icon;
                return (
                  <motion.div
                    key={feat.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.12 + idx * 0.08, duration: 0.45 }}
                    className="flex items-center gap-3.5 sm:gap-4 group cursor-default"
                  >
                    {/* Tactile White Porcelain Pebble Droplet Badge */}
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border border-white/80 shadow-[0_8px_18px_-2px_rgba(20,50,35,0.11),inset_0_2px_2px_rgba(255,255,255,1),inset_0_-2px_3px_rgba(0,0,0,0.05)] flex items-center justify-center text-[#102D25] shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <IconComponent className="w-5 h-5 text-[#102D25]" strokeWidth={2.2} />
                    </div>

                    {/* Text Details */}
                    <div className="flex flex-col">
                      <span className="font-heading font-extrabold text-[15px] sm:text-[16px] text-[#102D25] leading-tight">
                        {feat.title}
                      </span>
                      <span className="text-[12.5px] sm:text-[13px] text-[#55695A] leading-tight mt-0.5">
                        {feat.subtitle}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Explore More Liquid Glass CTA Button & Warm Ambient Glow */}
            <div className="pt-1 sm:pt-2 relative z-10">
              {/* Warm Ambient Underglow reflecting onto glass surface */}
              <div className="absolute left-6 w-52 h-10 bg-[#E8662B]/35 blur-xl -bottom-1 pointer-events-none rounded-full" />

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto inline-block relative z-10"
              >
                <Link
                  href="/shop"
                  className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-b from-[#E6632B] via-[#D5521E] to-[#BD4013] text-white font-heading font-extrabold text-[15px] sm:text-[16px] tracking-wide shadow-[0_14px_30px_rgba(216,84,32,0.42),inset_0_1.5px_1.5px_rgba(255,255,255,0.85),inset_0_-1.5px_2px_rgba(0,0,0,0.22)] border border-white/40 hover:shadow-[0_18px_36px_rgba(216,84,32,0.52)] hover:brightness-105 transition-all duration-300 select-none overflow-hidden"
                >
                  {/* Top Specular Edge Highlight on Button */}
                  <span className="absolute top-0 left-4 right-4 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none" />
                  
                  <span>Explore More</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.4} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
