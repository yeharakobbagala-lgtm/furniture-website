"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Heart, ShoppingBag, Star, Check, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { useQuickViewStore } from "@/stores/quickViewStore";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { formatPrice } from "@/lib/utils";

export default function QuickViewModal() {
  const { isOpen, product, closeQuickView } = useQuickViewStore();
  const addItemToCart = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!isOpen || !product) return null;

  const inWishlist = isInWishlist(product.id);
  const currentColor = product.colours[selectedColorIndex] || product.colours[0];
  const currentMaterial = product.materials[selectedMaterialIndex] || product.materials[0];

  const handleAddToCart = () => {
    addItemToCart(product, quantity, currentColor, currentMaterial);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-forest-deep/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-[28px] sm:rounded-[32px] shadow-[0_30px_90px_rgba(10,35,25,0.35),inset_0_1px_2px_rgba(255,255,255,0.9)] border border-white/80 bg-[#FAF9F5] backdrop-blur-3xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-forest-deep shadow-soft transition-all hover:scale-105 border border-forest-deep/10"
          aria-label="Close Quick View"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left: Product Imagery */}
          <div className="relative bg-[#ECEFEA] min-h-[320px] md:min-h-[480px]">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            {product.bestSeller && (
              <span className="absolute top-5 left-5 px-3 py-1 rounded-full glass-pill-forest text-white text-xs font-semibold tracking-wider uppercase shadow-soft">
                Best Seller
              </span>
            )}
            {product.newArrival && (
              <span className="absolute top-5 left-5 px-3.5 py-1 rounded-full glass-cta-orange text-white text-xs font-bold tracking-wider uppercase shadow-soft">
                New Arrival
              </span>
            )}
          </div>

          {/* Right: Product Details & Controls */}
          <div className="p-6 sm:p-7 md:p-8 flex flex-col justify-between space-y-6 bg-[#FAF9F5]">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="uppercase tracking-widest font-extrabold text-[11px] text-[#B85232]">
                  {product.categoryName}
                </span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#102D25] bg-white px-2.5 py-1 rounded-full border border-forest-deep/10 shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-[#B85232] text-[#B85232]" />
                  <span>{product.rating}</span>
                  <span className="text-forest-muted font-normal">({product.reviewCount})</span>
                </div>
              </div>

              {/* Title & Price */}
              <h2 className="text-2xl sm:text-[26px] font-heading font-extrabold text-[#102D25] leading-snug mb-2">
                {product.name}
              </h2>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl sm:text-[28px] font-extrabold text-[#102D25]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-forest-muted line-through font-medium">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-[#2C4A3E] leading-relaxed line-clamp-3 mb-6 font-normal">
                {product.description}
              </p>

              {/* Color Options */}
              <div className="space-y-2 mb-4">
                <span className="text-xs uppercase tracking-wider font-bold text-[#102D25] block">
                  Upholstery / Finish: <strong className="font-extrabold text-[#B85232]">{currentColor.name}</strong>
                </span>
                <div className="flex items-center gap-2">
                  {product.colours.map((color, idx) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColorIndex(idx)}
                      className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedColorIndex === idx
                          ? "border-forest-deep scale-110 shadow-sm"
                          : "border-borderSage hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColorIndex === idx && (
                        <Check
                          className={`w-3.5 h-3.5 ${
                            color.hex === "#F8F7F0" || color.hex === "#DFD7CD"
                              ? "text-forest-deep"
                              : "text-white"
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Materials */}
              {product.materials.length > 0 && (
                <div className="space-y-2 mb-6">
                  <span className="text-xs uppercase tracking-wider font-bold text-[#102D25] block">
                    Material Specification:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map((mat, idx) => (
                      <button
                        key={mat}
                        onClick={() => setSelectedMaterialIndex(idx)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                          selectedMaterialIndex === idx
                            ? "bg-[#102D25] text-white border-[#102D25] shadow-sm font-semibold"
                            : "bg-white text-[#102D25] border-forest-deep/20 hover:border-forest-deep/50 hover:bg-forest-deep/5"
                        }`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions: Quantity, Add to Cart, Wishlist */}
            <div className="space-y-3 pt-4 border-t border-forest-deep/10">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center rounded-full px-2 py-1 bg-white border border-forest-deep/15 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 flex items-center justify-center text-[#102D25] font-extrabold hover:bg-forest-deep/10 rounded-full transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-[#102D25]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center text-[#102D25] font-extrabold hover:bg-forest-deep/10 rounded-full transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 rounded-full glass-cta-orange text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-floating transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4 text-white" />
                  {addedNotice ? "Added to Bag ✓" : "Add to Bag"}
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all ${
                    inWishlist
                      ? "glass-cta-orange text-white border-white/60"
                      : "bg-white text-forest-deep border-forest-deep/20 hover:border-forest-deep/50 hover:scale-105 shadow-sm"
                  }`}
                  title={inWishlist ? "Remove from Wishlist" : "Save to Wishlist"}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? "fill-white" : ""}`} />
                </button>
              </div>

              {/* Guarantees & Full Details Link */}
              <div className="flex items-center justify-between text-xs text-[#2C4A3E] pt-2 font-medium">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#102D25]" /> White-Glove Available
                </span>
                <Link
                  href={`/product/${product.slug}`}
                  onClick={closeQuickView}
                  className="text-[#B85232] font-bold hover:underline flex items-center gap-1"
                >
                  View Full Specifications <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
