import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { articles } from "@/data/articles";

export const metadata = {
  title: "Square Journal — Architectural Design, Living & Craft",
  description: "Read interviews with European joinery masters, interior inspiration, and timber care rituals.",
};

export default function BlogPage() {
  const featured = articles.find((a) => a.featured) || articles[0];
  const rest = articles.filter((a) => a.id !== featured.id);

  return (
    <div className="w-full bg-sage-light min-h-screen pb-24">
      {/* Header */}
      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 pt-12 pb-10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-forest-muted mb-2">
          <Link href="/" className="hover:text-forest-deep">Home</Link>
          <span>/</span>
          <span className="text-terracotta">Journal</span>
        </div>
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-dark text-white text-xs font-bold uppercase tracking-widest">
            <BookOpen className="w-3.5 h-3.5 text-terracotta" /> SQUARE EDITORIAL
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-forest-deep tracking-tight">
            The Square Journal
          </h1>
          <p className="text-sm sm:text-base text-forest-muted leading-relaxed">
            Essays on Scandinavian architecture, generational craftsmanship, natural stone maintenance, and the art of slowing down.
          </p>
        </div>
      </div>

      {/* Featured Main Story */}
      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 mb-16">
        <Link
          href={`/blog/${featured.slug}`}
          className="group block rounded-3xl overflow-hidden bg-ivory-warm border border-borderSage shadow-soft hover:shadow-card transition-all"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 relative aspect-[16/10] w-full overflow-hidden bg-sage-50">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-forest-dark text-white text-xs font-semibold">
                {featured.category}
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-10 space-y-4">
              <div className="flex items-center gap-3 text-xs text-forest-muted">
                <span>{featured.date}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {featured.readTime}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-forest-deep group-hover:text-terracotta transition-colors leading-tight">
                {featured.title}
              </h2>

              <p className="text-sm text-forest-muted leading-relaxed">
                {featured.excerpt}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-borderSage shrink-0">
                  <Image src={featured.author.avatar} alt={featured.author.name} fill sizes="36px" className="object-cover" />
                </div>
                <div>
                  <p className="text-xs font-bold text-forest-deep">{featured.author.name}</p>
                  <p className="text-[10px] text-forest-muted">{featured.author.role}</p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Other Articles Grid */}
      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rest.map((art) => (
            <Link
              key={art.id}
              href={`/blog/${art.slug}`}
              className="group flex flex-col justify-between rounded-3xl overflow-hidden bg-ivory-warm border border-borderSage shadow-soft hover:shadow-card transition-all"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-sage-50">
                <Image
                  src={art.image}
                  alt={art.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-forest-dark text-white text-[10px] font-bold uppercase">
                  {art.category}
                </div>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-forest-muted mb-1.5">
                    <span>{art.date}</span>
                    <span>•</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-forest-deep group-hover:text-terracotta transition-colors line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-forest-muted line-clamp-3 mt-1.5 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-borderSage/60 flex items-center justify-between text-xs font-bold text-forest-deep group-hover:text-terracotta transition-colors">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
