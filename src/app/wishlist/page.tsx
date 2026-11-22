"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight, Star } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addItemToCart = useCartStore((s) => s.addItem);
  const [movedId, setMovedId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMoveToCart = (product: (typeof items)[0]) => {
    addItemToCart(product, 1);
    removeItem(product.id);
    setMovedId(product.id);
    setTimeout(() => setMovedId(null), 2000);
  };

  const handleMoveAllToCart = () => {
    items.forEach((item) => addItemToCart(item, 1));
    clearWishlist();
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-sage-light py-20 text-center text-forest-deep">
        Loading your wishlist...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-light py-12">
      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 border-b border-borderSage/70 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-forest-muted mb-2">
              <Link href="/" className="hover:text-forest-deep">Home</Link>
              <span>/</span>
              <span className="text-terracotta">Wishlist</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-forest-deep tracking-tight">
              Saved Pieces ({items.length})
            </h1>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={clearWishlist}
                className="text-xs font-bold text-forest-muted hover:text-terracotta transition-colors px-3 py-1.5 rounded-full hover:bg-white/60"
              >
                Clear Wishlist
              </button>
              <button
                onClick={handleMoveAllToCart}
                className="px-6 py-3 rounded-full glass-cta-orange text-white text-xs font-heading font-extrabold uppercase tracking-wider transition-all shadow-floating hover:scale-105"
              >
                Move All to Bag
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-ivory-warm text-forest-muted flex items-center justify-center mx-auto border border-borderSage shadow-soft">
              <Heart className="w-8 h-8 text-forest-muted/50" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-forest-deep">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-forest-muted leading-relaxed">
              Explore our architectural sofas, solid timber tables, and sculptural seating. Click the heart icon on any design to save it here.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-forest-dark hover:bg-forest-deep text-white text-xs font-bold uppercase tracking-wider shadow-card transition-all"
              >
                Explore Furniture Collections <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Wishlist Items Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-10">
            {items.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col bg-ivory-warm rounded-2xl border border-borderSage/80 overflow-hidden hover:shadow-card transition-all"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full bg-sage-50 overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => removeItem(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-forest-deep hover:text-red-600 flex items-center justify-center shadow-soft transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-forest-muted">
                      {product.categoryName}
                    </span>
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="font-heading font-bold text-base text-forest-deep hover:text-terracotta transition-colors line-clamp-1 mt-0.5">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-base font-bold text-forest-deep">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-forest-muted line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-borderSage/60">
                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="w-full py-2.5 px-4 rounded-xl bg-forest-dark hover:bg-forest-deep text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-soft"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-terracotta" />
                      {movedId === product.id ? "Moved to Bag ✓" : "Move to Bag"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
