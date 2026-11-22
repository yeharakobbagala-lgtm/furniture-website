import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Sparkles, TreePine, HeartHandshake, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About Square — The Architecture of Living",
  description: "Learn about Square's sustainable Scandinavian joinery, Italian upholstery, and material ethics.",
};

export default function AboutPage() {
  return (
    <div className="w-full bg-sage-light min-h-screen pb-24">
      {/* Hero */}
      <div className="relative bg-forest-dark text-white py-20 overflow-hidden">
        <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-widest font-bold text-terracotta">
              OUR ATELIER MANIFESTO
            </span>
            <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-white tracking-tight leading-[1.08]">
              Furniture as Stillness. Spaces as Sanctuaries.
            </h1>
            <p className="text-base sm:text-lg text-sage-200 leading-relaxed pt-2">
              Founded on the belief that the objects we touch every day shape our mental clarity. Square pairs minimalist discipline with the sensory warmth of natural stone and honest hardwoods.
            </p>
          </div>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest font-bold text-terracotta">
              THE SQUARE PHILOSOPHY
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-forest-deep">
              Honest Materials Crafted to Outlive Trends
            </h2>
            <p className="text-sm sm:text-base text-forest-muted leading-relaxed">
              In an era dominated by disposable mass production and synthetic veneers, Square creates furniture meant to be handed down across generations. Every curve in our bouclé sofas and every bullnose edge on our Roman travertine dining plinths is shaped by master European artisans.
            </p>
            <p className="text-sm sm:text-base text-forest-muted leading-relaxed">
              We exclusively harvest FSC-certified European white oak, American walnut, and unbleached Belgian linen. Our furniture develops a rich patina over time—recording the quiet, joyful rituals of your life.
            </p>

            <div className="pt-2">
              <Link
                href="/designers"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-dark hover:bg-forest-deep text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Meet Our Master Designers <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-floating border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80"
                alt="Wood craftsmanship atelier"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Commitments */}
      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 pt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-ivory-warm border border-borderSage space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-dark text-white flex items-center justify-center mb-4">
              <TreePine className="w-6 h-6 text-terracotta" />
            </div>
            <h3 className="font-heading font-bold text-xl text-forest-deep">
              FSC Hardwood Stewardship
            </h3>
            <p className="text-xs text-forest-muted leading-relaxed">
              100% of our timber is certified from sustainably managed European and North American forestry programs that guarantee replanting and biodiversity.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-ivory-warm border border-borderSage space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-dark text-white flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-terracotta" />
            </div>
            <h3 className="font-heading font-bold text-xl text-forest-deep">
              10-Year Joinery Guarantee
            </h3>
            <p className="text-xs text-forest-muted leading-relaxed">
              Mortise-and-tenon joints, kiln-dried internal hardwood cores, and German soft-close dampening slides guaranteed against structural failure for a decade.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-ivory-warm border border-borderSage space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-dark text-white flex items-center justify-center mb-4">
              <HeartHandshake className="w-6 h-6 text-terracotta" />
            </div>
            <h3 className="font-heading font-bold text-xl text-forest-deep">
              Zero-Waste White Glove
            </h3>
            <p className="text-xs text-forest-muted leading-relaxed">
              Our delivery teams retrieve and recycle 100% of wooden freight crates and protective packaging materials at the moment of inside room installation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
