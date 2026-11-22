"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { articles } from "@/data/articles";

export default function EditorialSection() {
  const featuredArticle = articles.find((a) => a.featured) || articles[0];
  const otherArticles = articles.filter((a) => a.id !== featuredArticle.id).slice(0, 3);

  return (
    <section className="py-20 bg-ivory-warm border-b border-borderSage/70 w-full">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-terracotta mb-2">
              <BookOpen className="w-3.5 h-3.5" /> SQUARE JOURNAL
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-forest-deep tracking-tight">
              Interior Inspiration & Trends
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-sm font-semibold text-forest-deep hover:text-terracotta flex items-center gap-1.5 group"
          >
            Read all journal stories
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Editorial Layout: Large Left Featured + Right Column Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Large Featured Article (7 cols) */}
          <div className="lg:col-span-7">
            <Link
              href={`/blog/${featuredArticle.slug}`}
              className="group block rounded-3xl overflow-hidden bg-sage-50 border border-borderSage hover:shadow-card transition-all duration-300"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-forest-dark text-white text-xs font-semibold">
                  {featuredArticle.category}
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-3">
                <div className="flex items-center gap-4 text-xs text-forest-muted">
                  <span>{featuredArticle.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {featuredArticle.readTime}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-forest-deep group-hover:text-terracotta transition-colors leading-tight">
                  {featuredArticle.title}
                </h3>

                <p className="text-sm text-forest-muted leading-relaxed line-clamp-3">
                  {featuredArticle.excerpt}
                </p>

                <div className="pt-2 flex items-center gap-2 text-xs font-bold text-forest-deep group-hover:text-terracotta transition-colors">
                  <span>Read Full Editorial</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>

          {/* Right Column Articles (5 cols) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            {otherArticles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-borderSage hover:border-forest-dark/40 hover:shadow-soft transition-all duration-200"
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-sage-50 shrink-0">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="120px"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-terracotta">
                    {article.category}
                  </span>
                  <h4 className="text-sm sm:text-base font-heading font-bold text-forest-deep line-clamp-2 group-hover:text-terracotta transition-colors">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-forest-muted">
                    <span>{article.readTime}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
