import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, Compass } from "lucide-react";
import { articles } from "@/data/articles";
import { collections } from "@/data/collections";

export const metadata = {
  title: "Interior Design Trends 2026/2027 — Square Furniture & Living",
  description: "Explore seasonal interior movements: Quiet Luxury, Warm Minimalism, Honed Travertine, and Tactile Textiles.",
};

export default function TrendsPage() {
  const trendArticles = articles.filter((a) => a.category === "Trends" || a.category === "Interior Inspiration");

  return (
    <div className="w-full bg-sage-light min-h-screen pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-forest-muted mb-2">
          <Link href="/" className="hover:text-forest-deep">Home</Link>
          <span>/</span>
          <span className="text-terracotta">Trends & Movements</span>
        </div>
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-dark text-white text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-terracotta" /> EDITORIAL FORECAST
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-forest-deep tracking-tight">
            Design Trends & Movements
          </h1>
          <p className="text-sm sm:text-base text-forest-muted leading-relaxed">
            Exploring the cultural evolution of domestic sanctuaries. From quiet luxury to organic Scandinavian warmth, discover how global architects are shaping spaces of stillness.
          </p>
        </div>
      </div>

      {/* Hero Trend Feature */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative rounded-3xl overflow-hidden bg-forest-dark text-white shadow-floating">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full">
            <Image
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80"
              alt="Quiet Luxury Movement"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/40 to-transparent" />
          </div>

          <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12 space-y-3 max-w-3xl">
            <span className="text-xs uppercase tracking-widest font-bold text-terracotta">
              THE 2026 MOVEMENT
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
              Quiet Luxury & The Rebirth of Warm Minimalism
            </h2>
            <p className="text-sm sm:text-base text-sage-200 line-clamp-2">
              Sterile white boxes are receding in favor of textured limewash, brushed travertine, and tactile Italian bouclé that invites sensory connection.
            </p>
            <div className="pt-2">
              <Link
                href="/blog/quiet-luxury-and-the-rebirth-of-warm-minimalism"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-soft"
              >
                Read Full Feature <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Design Aesthetics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-heading font-extrabold text-forest-deep mb-6">
          Featured Aesthetic Directions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.slice(0, 3).map((col) => (
            <Link
              key={col.id}
              href={`/shop?style=${encodeURIComponent(col.style)}`}
              className="group p-6 rounded-3xl bg-ivory-warm border border-borderSage hover:shadow-card transition-all space-y-4"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-sage-50">
                <Image src={col.image} alt={col.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-terracotta">{col.style}</span>
                <h3 className="font-heading font-bold text-xl text-forest-deep group-hover:text-terracotta transition-colors mt-0.5">
                  {col.title}
                </h3>
                <p className="text-xs text-forest-muted mt-1 leading-relaxed">{col.description}</p>
              </div>
              <span className="text-xs font-bold text-forest-deep group-hover:text-terracotta flex items-center gap-1">
                Explore Curation <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
