import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight, Sparkles } from "lucide-react";
import { designers } from "@/data/designers";

export const metadata = {
  title: "Master Designers & Ateliers — Square Furniture & Living",
  description: "Meet the international architects, master joiners, and textile directors behind Square collections.",
};

export default function DesignersPage() {
  return (
    <div className="w-full bg-sage-light min-h-screen pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-forest-muted mb-2">
          <Link href="/" className="hover:text-forest-deep">Home</Link>
          <span>/</span>
          <span className="text-terracotta">Designer Directory</span>
        </div>
        <div className="max-w-2xl space-y-3">
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-forest-deep tracking-tight">
            Master Designers & Ateliers
          </h1>
          <p className="text-sm sm:text-base text-forest-muted leading-relaxed">
            Every piece at Square is the product of an intimate dialogue with masters of modern joinery, European stone quarries, and sustainable textile weaving.
          </p>
        </div>
      </div>

      {/* Designers Directory Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {designers.map((designer) => (
            <div
              key={designer.id}
              className="group bg-ivory-warm rounded-3xl border border-borderSage overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-sage-50">
                <Image
                  src={designer.coverImage}
                  alt={designer.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/85 via-forest-deep/20 to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-soft shrink-0">
                      <Image src={designer.avatar} alt={designer.name} fill sizes="48px" className="object-cover" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg text-white group-hover:text-terracotta transition-colors">
                        {designer.name}
                      </h3>
                      <p className="text-xs text-sage-200 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-terracotta" /> {designer.location}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white font-medium">
                    {designer.role}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-terracotta block mb-1">
                    Speciality: {designer.speciality}
                  </span>
                  <p className="text-sm text-forest-muted leading-relaxed line-clamp-3">
                    {designer.biography}
                  </p>
                </div>

                <div className="pt-4 border-t border-borderSage/70 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-forest-deep">Collections:</span>
                    <span className="text-xs text-forest-muted">
                      {designer.featuredCollections.join(", ")}
                    </span>
                  </div>

                  <Link
                    href={`/designers/${designer.slug}`}
                    className="px-5 py-2.5 rounded-xl bg-forest-dark hover:bg-forest-deep text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    View Atelier <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
