import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ArrowRight, Quote } from "lucide-react";
import { designers } from "@/data/designers";
import { products } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";

interface DesignerPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DesignerPageProps) {
  const { slug } = await params;
  const designer = designers.find((d) => d.slug === slug);
  if (!designer) return { title: "Designer Not Found — Square" };
  return {
    title: `${designer.name} Atelier — Square Furniture & Living`,
    description: designer.biography,
  };
}

export default async function DesignerDetailPage({ params }: DesignerPageProps) {
  const { slug } = await params;
  const designer = designers.find((d) => d.slug === slug);

  if (!designer) {
    notFound();
  }

  // Find products designed by this designer or matching style
  const designerProducts = products.filter(
    (p) => p.designerId === designer.id || designer.productIds.includes(p.id)
  );

  return (
    <div className="w-full bg-sage-light min-h-screen pb-24">
      {/* Header Banner */}
      <div className="relative bg-forest-dark text-white py-16 sm:py-24 overflow-hidden">
        <div className="absolute right-0 top-0 w-[500px] h-[500px] rounded-full bg-terracotta/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-sage-300 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/designers" className="hover:text-white">Designers</Link>
            <span>/</span>
            <span className="text-terracotta">{designer.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <span className="text-xs uppercase tracking-widest font-bold text-terracotta">
                {designer.role}
              </span>
              <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
                {designer.name}
              </h1>
              <p className="flex items-center gap-1.5 text-sm text-sage-300">
                <MapPin className="w-4 h-4 text-terracotta" /> {designer.location}
              </p>
              <p className="text-sm sm:text-base text-sage-200 leading-relaxed max-w-2xl pt-2">
                {designer.biography}
              </p>
            </div>

            <div className="md:col-span-4 flex justify-center md:justify-end">
              <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-4 border-white/40 shadow-floating">
                <Image
                  src={designer.portraitImage}
                  alt={designer.name}
                  fill
                  sizes="240px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Statement */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="p-8 rounded-3xl bg-ivory-warm border border-borderSage shadow-card text-center space-y-3">
          <Quote className="w-8 h-8 text-terracotta mx-auto opacity-70" />
          <p className="font-serif italic text-lg sm:text-xl text-forest-deep">
            &ldquo;{designer.philosophy}&rdquo;
          </p>
          <span className="text-xs uppercase tracking-wider font-bold text-forest-muted block">
            {designer.name} • {designer.speciality}
          </span>
        </div>
      </div>

      {/* Designer's Collection Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-terracotta block mb-1">
              CURATED SUITE
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-forest-deep">
              Furniture Designs by {designer.name} ({designerProducts.length})
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {designerProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </div>
  );
}
