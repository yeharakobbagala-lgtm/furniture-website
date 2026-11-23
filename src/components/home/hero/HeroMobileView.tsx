"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Plus,
  Armchair,
  TreePine,
  PencilRuler,
  ShieldCheck,
} from "lucide-react";
import CircularText from "@/components/ui/CircularText";
import { HeroConfig, HeroFurnitureSet, defaultHeroFurnitureSets } from "@/data/hero-config";

/* ========================================================================== */
/* LAYER COMPOSITION ENGINE                                                   */
/* Every hero asset is a 1920×1080 transparent canvas. We know the exact      */
/* pixel bounding box of the visible content in each one, so every layer can  */
/* be "virtually cropped" and placed independently inside the mobile stage.   */
/* Stage coordinates: left/width = % of stage width, top/bottom = % of height. */
/* ========================================================================== */

const CANVAS_W = 1920;
const STAGE_ASPECT = 1.47; // width / height of the furniture stage (matches reference)

type BBox = [number, number, number, number]; // x0, y0, x1, y1 in canvas px

interface LayerSpec {
  src: string;
  bbox: BBox;
  left: number;
  width: number;
  top?: number;
  bottom?: number;
  z: number;
  alt: string;
  clip?: boolean; // clip to bbox (for layers containing stray glow / neighbours)
  cord?: boolean; // extend a pendant cord upwards
  shadow?: string;
}

interface SuiteComposition {
  layers: LayerSpec[];
  floorShadow: { left: number; width: number; top: number };
  hotspot: {
    top: number;
    left: number;
    title: string;
    category: string;
    price: string;
    material: string;
    link: string;
  };
}

const BACKDROP: LayerSpec = {
  src: "/hero 1/New Project (23).webp",
  bbox: [559, 169, 1919, 957],
  left: 1,
  width: 112,
  top: 0,
  z: 1,
  alt: "",
  shadow: "drop-shadow(0 14px 28px rgba(16,45,33,0.18))",
};

const PRODUCT_SHADOW = "drop-shadow(0 14px 18px rgba(16,45,33,0.28))";
const DECOR_SHADOW = "drop-shadow(0 10px 14px rgba(16,45,33,0.22))";

const compositions: Record<string, SuiteComposition> = {
  "set-1-living": {
    layers: [
      // Pendant lamp – clipped below its ceiling canopy so only the slim brass rod rises cleanly to the right of the headline
      { src: "/hero 1/New Project (21).webp", bbox: [1402, 22, 1510, 319], left: 81, width: 12.5, bottom: 92, z: 6, alt: "Minimalist pendant lamp", clip: true, cord: true },
      // Round oak side table with vase & greenery
      { src: "/hero 1/New Project (19).webp", bbox: [1541, 269, 1831, 695], left: 67, width: 29, top: 6, z: 3, alt: "Round oak side table with ceramic vase", shadow: DECOR_SHADOW },
      // Hero product – beige lounge armchair
      { src: "/hero 1/New Project (20).webp", bbox: [863, 381, 1523, 893], left: 5, width: 66, top: 13, z: 5, alt: "Beige upholstered lounge armchair with oak frame", shadow: PRODUCT_SHADOW },
    ],
    floorShadow: { left: 8, width: 60, top: 82 },
    hotspot: {
      top: 58, left: 33,
      title: "Nordic Lounge Armchair", category: "Lounge Chairs", price: "LKR 380",
      material: "Solid White Oak & Textured Bouclé", link: "/shop/lounge-chairs",
    },
  },
  "set-2-bedroom": {
    layers: [
      { src: "/hero 2/New Project (25).webp", bbox: [1632, 317, 1918, 764], left: 76, width: 21, top: 30, z: 3, alt: "Oak nightstand", shadow: DECOR_SHADOW },
      { src: "/hero 2/New Project (26).webp", bbox: [565, 356, 1590, 887], left: 1, width: 76, top: 28, z: 5, alt: "Channel-tufted platform bed", shadow: PRODUCT_SHADOW },
    ],
    floorShadow: { left: 4, width: 70, top: 80 },
    hotspot: {
      top: 52, left: 40,
      title: "Havn Channeled Platform Bed", category: "Beds & Suites", price: "LKR 920",
      material: "Channel-Tufted Linen & Hardwood", link: "/shop/beds",
    },
  },
  "set-3-sofa": {
    layers: [
      { src: "/hero3/New Project (32).webp", bbox: [1436, 0, 1619, 372], left: 76, width: 14, bottom: 96, z: 6, alt: "Pendant lamp", cord: true },
      { src: "/hero3/New Project (31).webp", bbox: [1651, 287, 1919, 713], left: 77, width: 21, top: 32, z: 3, alt: "Side table with plant", shadow: DECOR_SHADOW },
      { src: "/hero3/New Project (30).webp", bbox: [645, 386, 1638, 855], left: 1, width: 76, top: 33, z: 5, alt: "Nordic two-seater sofa", shadow: PRODUCT_SHADOW },
    ],
    floorShadow: { left: 4, width: 70, top: 80 },
    hotspot: {
      top: 58, left: 32,
      title: "Sora Nordic 2-Seater Sofa", category: "Sofas & Seating", price: "LKR 1,120",
      material: "Textured Linen & Olive Velvet", link: "/shop/sofas",
    },
  },
  "set-4-dining": {
    layers: [
      { src: "/hero 4/hero4_lamp.webp", bbox: [1015, 0, 1183, 300], left: 77, width: 12, bottom: 96, z: 6, alt: "Pendant lamp", cord: true },
      { src: "/hero 4/hero4_plant.webp", bbox: [1711, 343, 1919, 758], left: 81, width: 17, top: 26, z: 3, alt: "Potted plant", shadow: DECOR_SHADOW },
      { src: "/hero 4/hero4_dining.webp", bbox: [583, 290, 1824, 882], left: 0, width: 83, top: 28, z: 5, alt: "Oak dining table with four chairs", shadow: PRODUCT_SHADOW },
    ],
    floorShadow: { left: 4, width: 74, top: 82 },
    hotspot: {
      top: 50, left: 30,
      title: "Elysian Oak Dining Suite", category: "Dining & Kitchen", price: "LKR 850",
      material: "Solid Teakwood & 4 Padded Chairs", link: "/shop/dining-tables",
    },
  },
  "set-5-sculptural": {
    layers: [
      { src: "/hero 5/hero5_lamp.webp", bbox: [1282, 0, 1700, 339], left: 70, width: 28, bottom: 94, z: 6, alt: "Sculptural ring pendant", clip: true },
      { src: "/hero 5/hero5_table_plant.webp", bbox: [1632, 270, 1919, 706], left: 74, width: 22, top: 30, z: 3, alt: "Side table with plant", clip: true, shadow: DECOR_SHADOW },
      { src: "/hero 5/hero5_chair.webp", bbox: [796, 268, 1507, 890], left: 4, width: 64, top: 8, z: 5, alt: "Sculptural bentwood lounge chair", shadow: PRODUCT_SHADOW },
    ],
    floorShadow: { left: 8, width: 58, top: 82 },
    hotspot: {
      top: 55, left: 46,
      title: "Zephyr Sculptural Chair", category: "Artisanal Chairs", price: "LKR 680",
      material: "Walnut Bentwood & Olive Velvet", link: "/shop/lounge-chairs",
    },
  },
};

function StageLayer({ spec }: { spec: LayerSpec }) {
  const [x0, y0, x1, y1] = spec.bbox;
  const bw = x1 - x0;
  const bh = y1 - y0;
  return (
    <div
      className="relative pointer-events-none"
      style={{
        position: "absolute",
        left: `${spec.left}%`,
        width: `${spec.width}%`,
        top: spec.top !== undefined ? `${spec.top}%` : undefined,
        bottom: spec.bottom !== undefined ? `${spec.bottom}%` : undefined,
        aspectRatio: `${bw} / ${bh}`,
        zIndex: spec.z,
        filter: spec.shadow,
      }}
    >
      {spec.cord && (
        <span className="absolute bottom-[98%] left-1/2 -translate-x-1/2 w-[1.5px] h-[60vh] bg-gradient-to-b from-[#B8925A]/40 via-[#B8925A]/80 to-[#B8925A]" />
      )}
      <div className={`relative w-full h-full ${spec.clip ? "overflow-hidden" : ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={spec.src}
          alt={spec.alt}
          draggable={false}
          className="absolute h-auto select-none"
          style={{
            maxWidth: "none",
            width: `${(CANVAS_W / bw) * 100}%`,
            left: `${(-x0 / bw) * 100}%`,
            top: `${(-y0 / bh) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}

const dockLabels: Record<string, string> = {
  "set-1-living": "Living Room",
  "set-2-bedroom": "Bedroom Suite",
  "set-3-sofa": "Lounge Suite",
  "set-4-dining": "Dining Room",
  "set-5-sculptural": "Sculptural Suite",
};

interface HeroMobileViewProps {
  config: HeroConfig;
  sets?: HeroFurnitureSet[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export default function HeroMobileView({
  config,
  sets = defaultHeroFurnitureSets,
  currentIndex,
  onIndexChange,
}: HeroMobileViewProps) {
  const [direction, setDirection] = useState(1);
  const [activeHotspot, setActiveHotspot] = useState(false);
  const [scrollThumb, setScrollThumb] = useState({ width: 38, left: 0 });
  const dockRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const updateScrollIndicator = useCallback(() => {
    const dock = dockRef.current;
    if (!dock) return;
    const { scrollLeft, scrollWidth, clientWidth } = dock;
    if (scrollWidth <= clientWidth) {
      setScrollThumb({ width: 100, left: 0 });
      return;
    }
    const widthPct = Math.max(18, Math.min(100, (clientWidth / scrollWidth) * 100));
    const maxScroll = scrollWidth - clientWidth;
    const leftPct = maxScroll > 0 ? (scrollLeft / maxScroll) * (100 - widthPct) : 0;
    setScrollThumb({ width: widthPct, left: leftPct });
  }, []);

  const currentSet = sets[currentIndex] || sets[0];
  const comp = compositions[currentSet.id] || compositions["set-1-living"];
  const hotspot = comp.hotspot;

  const paginate = useCallback(
    (dir: number) => {
      setDirection(dir);
      setActiveHotspot(false);
      onIndexChange((currentIndex + dir + sets.length) % sets.length);
    },
    [currentIndex, sets.length, onIndexChange]
  );

  const goToSlide = useCallback(
    (index: number) => {
      if (index === currentIndex) return;
      setDirection(index > currentIndex ? 1 : -1);
      setActiveHotspot(false);
      onIndexChange(index);
    },
    [currentIndex, onIndexChange]
  );

  // Keep the active collection tab centred inside the dock (horizontal only – never scrolls the page)
  useEffect(() => {
    const dock = dockRef.current;
    const tab = tabRefs.current[currentIndex];
    if (!dock || !tab) return;
    const target = tab.offsetLeft - (dock.clientWidth - tab.offsetWidth) / 2;
    dock.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [currentIndex]);

  // Measure dock scroll width immediately on mount & resize so indicator is always accurate before scrolling
  useEffect(() => {
    updateScrollIndicator();
    const dock = dockRef.current;
    if (!dock || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(updateScrollIndicator);
    ro.observe(dock);
    return () => ro.disconnect();
  }, [updateScrollIndicator]);

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col bg-[#E4F0DF] overflow-hidden select-none">
      {/* Soft ambient light wash */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/50 blur-[90px]" />
        <div className="absolute top-1/2 -right-24 w-72 h-72 rounded-full bg-[#CFE6C6]/60 blur-[90px]" />
      </div>

      <div className="relative z-10 w-full max-w-[560px] mx-auto flex flex-col flex-1">
        {/* ================================================================ */}
        {/* 1. EDITORIAL TEXT BLOCK                                          */}
        {/* ================================================================ */}
        <div className="relative z-20 pt-[74px] min-[375px]:pt-[84px] min-[390px]:pt-[92px] px-5 min-[390px]:px-6">
          {/* Edition label */}
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="text-[10px] min-[390px]:text-[11px] uppercase tracking-[0.22em] font-extrabold text-[#D94D1E] whitespace-nowrap">
              Edition · 2026
            </span>
            <span className="w-7 h-px bg-[#D94D1E]/70" />
            <span className="text-[10px] min-[390px]:text-[11px] uppercase tracking-[0.2em] font-bold text-[#587763] whitespace-nowrap">
              Bespoke Craft
            </span>
          </div>

          {/* Heading – balanced two lines */}
          <h1
            className="font-orangeAvenue text-[#102D21] leading-[1.06] tracking-[-0.01em] font-medium"
            style={{
              fontSize: "clamp(29px, 9.4vw, 46px)",
              fontFamily: "var(--font-orange-avenue), 'OrangeAvenue', serif",
              fontFeatureSettings: '"liga" 1, "dlig" 1, "calt" 1, "swsh" 1, "ss01" 0',
              fontVariantLigatures: "common-ligatures discretionary-ligatures contextual",
              WebkitTextStroke: "0.45px currentColor",
              paintOrder: "stroke fill",
            }}
          >
            <span className="block whitespace-nowrap">Furniture Design</span>
            <span className="block whitespace-nowrap">Made for You</span>
          </h1>

          {/* Description – serif italic, kept clear of the pendant lamp */}
          <p
            className="mt-3 max-w-[72%] font-serif italic text-[#173C2B]/85 leading-[1.55]"
            style={{ fontSize: "clamp(11.5px, 3.3vw, 15px)" }}
          >
            Architectural silhouettes, solid handcrafted timber, and tactile comfort designed to elevate modern living sanctuaries.
          </p>
        </div>

        {/* ================================================================ */}
        {/* 2. FURNITURE STAGE – hero product photography                    */}
        {/* ================================================================ */}
        <div
          className="relative z-10 w-full mt-3 min-[390px]:mt-4"
          style={{ aspectRatio: `${STAGE_ASPECT}` }}
        >
          {/* Organic deep-green backdrop (bleeds off the right edge) */}
          <StageLayer spec={BACKDROP} />

          {/* Animated suite layers */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSet.id}
              initial={{ opacity: 0, x: direction > 0 ? 28 : -28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -28 : 28 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 z-[2] pointer-events-none"
            >
              {/* Soft floor contact shadow */}
              <div
                className="absolute h-[7%] rounded-[50%] bg-[#0B2117]/35 blur-[10px] z-[2]"
                style={{
                  left: `${comp.floorShadow.left}%`,
                  width: `${comp.floorShadow.width}%`,
                  top: `${comp.floorShadow.top}%`,
                }}
              />
              {comp.layers.map((layer) => (
                <StageLayer key={layer.src} spec={layer} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Interactive product hotspot */}
          <div
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
            style={{ top: `${hotspot.top}%`, left: `${hotspot.left}%` }}
          >
            <button
              onClick={() => setActiveHotspot((v) => !v)}
              aria-label={`View ${hotspot.title}`}
              aria-expanded={activeHotspot}
              className="relative w-9 h-9 flex items-center justify-center rounded-full active:scale-90 transition-transform"
            >
              <span className="absolute inset-[6px] rounded-full bg-white/45 animate-ping pointer-events-none" />
              <span className="relative w-7 h-7 rounded-full bg-white text-[#173C2B] shadow-[0_4px_14px_rgba(0,0,0,0.25)] flex items-center justify-center">
                <Plus className={`w-3.5 h-3.5 transition-transform duration-300 ${activeHotspot ? "rotate-45" : ""}`} />
              </span>
            </button>

            <AnimatePresence>
              {activeHotspot && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 bottom-full mb-1 w-[200px] p-3 rounded-2xl bg-[#102D21]/90 backdrop-blur-xl text-white border border-white/20 shadow-2xl"
                >
                  <p className="text-[9.5px] uppercase tracking-wider text-[#B9D3BC] font-bold">{hotspot.category}</p>
                  <h4 className="font-heading font-extrabold text-[13px] leading-snug mt-0.5">{hotspot.title}</h4>
                  <p className="text-[10px] text-white/70 line-clamp-1 mt-0.5">{hotspot.material}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/15">
                    <span className="font-heading font-extrabold text-xs text-[#E0A97E]">{hotspot.price}</span>
                    <Link
                      href={hotspot.link}
                      className="text-[10px] uppercase font-bold text-white/90 hover:text-white flex items-center gap-1"
                    >
                      View <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Circular architectural brand seal – fully inside the viewport */}
          <div className="absolute right-[2.5%] -bottom-[11%] z-20 rounded-full bg-[#E4F0DF]/88 backdrop-blur-sm shadow-[0_4px_16px_rgba(16,45,33,0.1)] origin-bottom-right scale-[0.7] min-[375px]:scale-[0.78] min-[414px]:scale-[0.86] sm:scale-100">
            <CircularText
              text="• ARCHITECTURAL DESIGN • EST. 2026 • SQUARE LIVING "
              onHover="speedUp"
              direction="clockwise"
              spinDuration={24}
              size={108}
              fontSize={9}
              fontWeight={800}
              color="#173C2B"
              className="font-sans uppercase tracking-[0.12em]"
            >
              <div className="w-11 h-11 rounded-full bg-white shadow-[0_4px_14px_rgba(16,45,33,0.16)] flex items-center justify-center">
                <Armchair className="w-5 h-5 text-[#D94D1E]" strokeWidth={2} />
              </div>
            </CircularText>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 3. LOWER GROUP – benefits, CTA, collection dock                 */}
        {/* ================================================================ */}
        <div className="flex-1 flex flex-col justify-end gap-3 min-[390px]:gap-5 pt-5 min-[390px]:pt-9 pb-[max(12px,env(safe-area-inset-bottom))]">
          {/* Brand benefits */}
          <div className="grid grid-cols-3 px-3 min-[390px]:px-5 divide-x divide-[#173C2B]/15">
            {[
              { icon: TreePine, l1: "Solid", l2: "Timber" },
              { icon: PencilRuler, l1: "Bespoke", l2: "Atelier" },
              { icon: ShieldCheck, l1: "10-Yr", l2: "Warranty" },
            ].map(({ icon: Icon, l1, l2 }) => (
              <div key={l2} className="flex items-center justify-center gap-1.5 min-[390px]:gap-2 px-1">
                <span className="w-8 h-8 min-[390px]:w-9 min-[390px]:h-9 rounded-full bg-white/60 border border-white/80 shadow-[0_2px_8px_rgba(23,60,43,0.06)] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#173C2B]" strokeWidth={1.8} />
                </span>
                <span className="flex flex-col text-[9px] min-[375px]:text-[10px] min-[414px]:text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#173C2B] leading-[1.25]">
                  <span>{l1}</span>
                  <span>{l2}</span>
                </span>
              </div>
            ))}
          </div>

          {/* SHOW MORE CTA */}
          <div className="flex justify-center px-5">
            <Link
              href={config.buttonLink || "/shop"}
              className="group inline-flex items-center justify-center gap-3 w-[min(76%,300px)] py-3.5 min-[390px]:py-4 rounded-full bg-gradient-to-b from-[#DE5526] to-[#C2421A] text-white font-heading font-extrabold text-[13px] min-[390px]:text-sm tracking-[0.08em] uppercase shadow-[0_12px_28px_rgba(217,77,30,0.35),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:shadow-[0_16px_34px_rgba(217,77,30,0.45)] active:scale-[0.97] transition-all"
            >
              <span>Show More</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Room collection selector */}
          <div className="px-3">
            <div className="rounded-[28px] bg-[#173C2B] border border-white/15 shadow-[0_12px_30px_rgba(16,45,33,0.3)] px-1.5 pt-1.5 pb-2 text-white">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => paginate(-1)}
                  aria-label="Previous collection"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/85 hover:bg-white/10 active:scale-90 transition-all shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div
                  ref={dockRef}
                  onScroll={updateScrollIndicator}
                  className="flex-1 min-w-0 flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x"
                >
                  {sets.map((set, idx) => {
                    const isActive = idx === currentIndex;
                    return (
                      <button
                        key={set.id}
                        ref={(el) => {
                          tabRefs.current[idx] = el;
                        }}
                        onClick={() => goToSlide(idx)}
                        aria-current={isActive ? "true" : undefined}
                        className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-[11.5px] min-[390px]:text-xs transition-all duration-300 ${
                          isActive
                            ? "bg-[#D94D1E] text-white font-bold shadow-[0_4px_12px_rgba(217,77,30,0.45)]"
                            : "text-white/80 font-medium hover:text-white"
                        }`}
                      >
                        {String(idx + 1).padStart(2, "0")} • {dockLabels[set.id] || set.title}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => paginate(1)}
                  aria-label="Next collection"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white/85 hover:bg-white/10 active:scale-90 transition-all shrink-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Always-visible custom horizontal scroll-progress indicator */}
              <div className="px-9 mt-1.5">
                <div
                  role="progressbar"
                  aria-label="Room collection scroll position"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(scrollThumb.left)}
                  className="relative h-[5px] w-full rounded-full bg-[#E4F0DF]/90 overflow-hidden"
                >
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-[#245A41] border border-[#102D21]/25"
                    style={{
                      width: `${scrollThumb.width}%`,
                      left: `${scrollThumb.left}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
