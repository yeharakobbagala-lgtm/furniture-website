"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, ArrowRight, Tag, Sparkles } from "lucide-react";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Curved sofa",
    "Solid oak table",
    "Travertine",
    "Bouclé",
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.style.toLowerCase().includes(q) ||
        p.materials.some((m) => m.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        (p.designerName && p.designerName.toLowerCase().includes(q))
    );
  }, [query]);

  const handleSelectRecent = (term: string) => {
    setQuery(term);
  };

  const clearRecent = () => {
    setRecentSearches([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-forest-deep/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-ivory-warm rounded-2xl shadow-floating border border-borderSage overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-borderSage bg-white/70">
          <Search className="w-5 h-5 text-forest-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sofas, travertine tables, Scandinavian lighting, designers..."
            className="flex-1 bg-transparent text-forest-deep text-lg placeholder:text-forest-muted/60 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-forest-muted hover:text-forest-deep transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs uppercase tracking-wider font-semibold text-forest-muted hover:text-forest-deep bg-sage-100 rounded-lg"
          >
            Esc
          </button>
        </div>

        {/* Content Area */}
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
          {query.trim().length === 0 ? (
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider font-semibold text-forest-muted">
                      Recent Searches
                    </span>
                    <button
                      onClick={clearRecent}
                      className="text-xs text-forest-muted hover:text-terracotta transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSelectRecent(term)}
                        className="px-3 py-1.5 rounded-full bg-sage-50 hover:bg-sage-200 text-forest-deep text-sm border border-borderSage transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Categories */}
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-forest-muted block mb-3">
                  Browse by Category
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.slice(0, 6).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop/${cat.slug}`}
                      onClick={onClose}
                      className="p-3 rounded-xl bg-white border border-borderSage/70 hover:border-forest-dark hover:shadow-soft transition-all flex items-center justify-between group"
                    >
                      <span className="text-sm font-medium text-forest-deep group-hover:text-terracotta transition-colors">
                        {cat.name}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-forest-muted group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Inspiration */}
              <div className="p-4 rounded-xl bg-sage-100 border border-borderSage flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-forest-dark text-white flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-terracotta" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-forest-deep text-sm">
                      Unsure what fits your space?
                    </h4>
                    <p className="text-xs text-forest-muted">
                      Take our 2-minute Furniture Style Quiz for custom recommendations.
                    </p>
                  </div>
                </div>
                <Link
                  href="/style-quiz"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-terracotta hover:bg-terracotta-hover text-white text-xs font-semibold transition-colors shrink-0"
                >
                  Start Quiz
                </Link>
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-forest-muted">
                <span>
                  Found <strong className="text-forest-deep">{searchResults.length}</strong> results for &ldquo;{query}&rdquo;
                </span>
                <Link
                  href={`/shop?q=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="text-terracotta font-medium hover:underline flex items-center gap-1"
                >
                  View all in Shop <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3.5 p-3 rounded-xl bg-white border border-borderSage hover:border-forest-dark hover:shadow-soft transition-all group"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-sage-50 shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="64px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-forest-muted uppercase tracking-wider font-medium truncate">
                        {product.categoryName}
                      </p>
                      <h4 className="text-sm font-heading font-semibold text-forest-deep truncate group-hover:text-terracotta transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-semibold text-forest-deep">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-forest-muted line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-sage-100 text-forest-muted flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-forest-deep">
                No products found
              </h3>
              <p className="text-sm text-forest-muted max-w-sm mx-auto">
                We couldn&apos;t find any items matching &ldquo;{query}&rdquo;. Try checking the spelling or searching for general categories like sofas, tables, or oak.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-forest-dark text-white text-xs font-semibold hover:bg-forest-deep transition-colors"
                >
                  Browse Full Catalog <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
