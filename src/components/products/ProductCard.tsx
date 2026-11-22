"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Eye, Star, Scale, Check } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useComparisonStore } from "@/stores/comparisonStore";
import { useQuickViewStore } from "@/stores/quickViewStore";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const addItemToCart = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { isInComparison, addItem: addToComparison, removeItem: removeFromComparison } =
    useComparisonStore();
  const openQuickView = useQuickViewStore((s) => s.openQuickView);

  const inWishlist = isInWishlist(product.id);
  const inComparison = isInComparison(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItemToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleToggleComparison = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inComparison) {
      removeFromComparison(product.id);
    } else {
      addToComparison(product);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  // Second image for smooth hover flip if available
  const displayImage =
    isHovered && product.images.length > 1 ? product.images[1] : product.images[0];

  return (
    <div
      className="group relative flex flex-col glass-surface-subtle rounded-3xl border border-white/60 overflow-hidden hover:shadow-[0_20px_45px_rgba(20,55,35,0.12)] hover:border-white/90 transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Specular Rim */}
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none z-20" />

      {/* Image Container with Badges & Hover Controls */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sage-50/50">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={displayImage}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badges with Liquid Glass Pills */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.bestSeller && (
            <span className="px-3 py-1 rounded-full glass-pill-forest text-white text-[10px] font-bold tracking-wider uppercase shadow-soft">
              Best Seller
            </span>
          )}
          {product.newArrival && (
            <span className="px-3 py-1 rounded-full glass-cta-orange text-white text-[10px] font-bold tracking-wider uppercase shadow-soft">
              New
            </span>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="px-3 py-1 rounded-full glass-pill text-terracotta text-[10px] font-bold tracking-wider uppercase shadow-soft">
              Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Top Right Quick Actions: Wishlist & Compare with Glass Droplets */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleToggleWishlist}
            aria-label="Save to Wishlist"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-soft border ${
              inWishlist
                ? "glass-cta-orange text-white border-white/60"
                : "glass-pill text-forest-deep hover:scale-105 border-white/70"
            }`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? "fill-white" : ""}`} />
          </button>

          <button
            onClick={handleToggleComparison}
            aria-label="Compare Product"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-soft border ${
              inComparison
                ? "glass-pill-forest text-white border-white/60"
                : "glass-pill text-forest-deep hover:scale-105 border-white/70"
            }`}
            title={inComparison ? "In Comparison" : "Add to Comparison"}
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>

        {/* Hover Bottom Action Overlay: Quick View */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-10">
          <button
            onClick={handleQuickView}
            className="flex-1 py-2.5 rounded-2xl glass-surface text-forest-deep text-xs font-bold flex items-center justify-center gap-1.5 shadow-soft hover:bg-forest-dark hover:text-white transition-all border border-white/80"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-forest-muted mb-1">
            <span className="uppercase tracking-wider font-semibold text-[11px]">{product.categoryName}</span>
            <div className="flex items-center gap-1 font-semibold text-forest-deep">
              <Star className="w-3.5 h-3.5 fill-terracotta text-terracotta" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`} className="block group-hover:text-terracotta transition-colors">
            <h3 className="font-heading font-bold text-base text-forest-deep line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Color swatches preview */}
          <div className="flex items-center gap-1.5 mt-2">
            {product.colours.slice(0, 4).map((c) => (
              <span
                key={c.name}
                className="w-3.5 h-3.5 rounded-full border border-white/80 shadow-xs"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            {product.colours.length > 4 && (
              <span className="text-[10px] text-forest-muted font-medium">
                +{product.colours.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between pt-3 border-t border-borderSage/40">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold text-forest-deep">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-forest-muted line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all duration-300 shadow-soft border ${
              added
                ? "glass-pill-forest text-white border-white/50"
                : "glass-pill text-forest-deep hover:scale-105 border-white/70"
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 text-terracotta" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-terracotta" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
