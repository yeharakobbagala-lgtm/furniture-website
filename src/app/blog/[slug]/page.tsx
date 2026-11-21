import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowLeft, ArrowRight, Share2, Sparkles } from "lucide-react";
import { articles } from "@/data/articles";
import { products } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return { title: "Article Not Found — Square" };
  return {
    title: `${article.title} — Square Journal`,
    description: article.excerpt,
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Related products mentioned in article
  const relatedProducts = products.filter(
    (p) => article.relatedProductIds?.includes(p.id)
  );

  return (
    <div className="w-full bg-sage-light min-h-screen pb-24">
      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-deep hover:text-terracotta uppercase tracking-wider mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Journal
        </Link>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-dark text-white text-xs font-bold uppercase tracking-widest">
            {article.category}
          </div>

          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-forest-deep tracking-tight leading-[1.12]">
            {article.title}
          </h1>

          <p className="text-lg text-forest-muted leading-relaxed font-serif italic">
            &ldquo;{article.excerpt}&rdquo;
          </p>

          <div className="pt-4 flex items-center justify-between border-t border-borderSage/70">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-borderSage shrink-0">
                <Image src={article.author.avatar} alt={article.author.name} fill sizes="44px" className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold text-forest-deep">{article.author.name}</p>
                <p className="text-xs text-forest-muted">{article.author.role}</p>
              </div>
            </div>

            <div className="text-right text-xs text-forest-muted">
              <p>{article.date}</p>
              <p className="flex items-center gap-1 justify-end font-semibold text-forest-deep">
                <Clock className="w-3 h-3" /> {article.readTime}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Feature Image */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-card border border-borderSage">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Article Body Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-ivory-warm rounded-3xl border border-borderSage p-8 sm:p-12 shadow-soft prose prose-lg prose-forest max-w-none text-forest-deep leading-relaxed space-y-6">
          <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-forest-deep font-sans">
            {article.content}
          </div>

          {/* Tags */}
          <div className="pt-6 border-t border-borderSage/60 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-sage-100 text-forest-deep text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Featured Products Mentioned */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 space-y-6">
            <h3 className="text-2xl font-heading font-extrabold text-forest-deep">
              Featured Pieces from this Story
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
