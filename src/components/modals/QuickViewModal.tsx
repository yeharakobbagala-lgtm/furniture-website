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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-deep/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-ivory-warm rounded-3xl shadow-floating border border-borderSage overflow-hidden">
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-forest-deep flex items-center justify-center shadow-soft transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left: Product Imagery */}
          <div className="relative bg-sage-50 min-h-[320px] md:min-h-[480px]">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            {product.bestSeller && (
              <span className="absolute top-5 left-5 px-3 py-1 rounded-full bg-forest-dark text-white text-xs font-semibold tracking-wider uppercase">
                Best Seller
              </span>
            )}
            {product.newArrival && (
              <span className="absolute top-5 left-5 px-3 py-1 rounded-full bg-terracotta text-white text-xs font-semibold tracking-wider uppercase">
                New Arrival
              </span>
            )}
          </div>

          {/* Right: Product Details & Controls */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-forest-muted mb-2">
                <span className="uppercase tracking-widest font-semibold">
                  {product.categoryName}
                </span>
                <div className="flex items-center gap-1 text-forest-deep font-semibold">
                  <Star className="w-3.5 h-3.5 fill-terracotta text-terracotta" />
                  <span>{product.rating}</span>
                  <span className="text-forest-muted">({product.reviewCount})</span>
                </div>
              </div>

              {/* Title & Price */}
              <h2 className="text-2xl font-heading font-bold text-forest-deep mb-2">
                {product.name}
              </h2>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-bold text-forest-deep">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-forest-muted line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-forest-muted leading-relaxed line-clamp-3 mb-6">
                {product.description}
              </p>

              {/* Color Options */}
              <div className="space-y-2 mb-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-forest-deep block">
                  Upholstery / Finish: <strong className="font-bold">{currentColor.name}</strong>
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
                <div className="space-y-1.5 mb-6">
                  <span className="text-xs uppercase tracking-wider font-semibold text-forest-deep block">
                    Material Specification:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.materials.map((mat, idx) => (
                      <button
                        key={mat}
                        onClick={() => setSelectedMaterialIndex(idx)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                          selectedMaterialIndex === idx
                            ? "bg-forest-dark text-white border-forest-dark"
                            : "bg-white text-forest-deep border-borderSage hover:bg-sage-100"
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
            <div className="space-y-3 pt-4 border-t border-borderSage/70">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-borderSage rounded-xl bg-white px-2 py-1.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 flex items-center justify-center text-forest-deep font-bold hover:bg-sage-100 rounded"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-forest-deep">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center text-forest-deep font-bold hover:bg-sage-100 rounded"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-5 rounded-xl bg-forest-dark hover:bg-forest-deep text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-soft transition-all"
                >
                  <ShoppingBag className="w-4 h-4 text-terracotta" />
                  {addedNotice ? "Added to Bag ✓" : "Add to Bag"}
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-colors ${
                    inWishlist
                      ? "bg-terracotta/10 border-terracotta text-terracotta"
                      : "border-borderSage bg-white hover:bg-sage-100 text-forest-deep"
                  }`}
                  title={inWishlist ? "Remove from Wishlist" : "Save to Wishlist"}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? "fill-terracotta" : ""}`} />
                </button>
              </div>

              {/* Guarantees & Full Details Link */}
              <div className="flex items-center justify-between text-xs text-forest-muted pt-2">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-forest-deep" /> White-Glove Available
                </span>
                <Link
                  href={`/product/${product.slug}`}
                  onClick={closeQuickView}
                  className="text-terracotta font-semibold hover:underline flex items-center gap-1"
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
