"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    deliveryMethod,
    setDeliveryMethod,
    promoCode,
    applyPromoCode,
    removePromoCode,
    getSubtotal,
    getDeliveryFee,
    getDiscountAmount,
    getTotal,
  } = useCartStore();

  const [inputCode, setInputCode] = useState("");
  const [promoError, setPromoError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const success = applyPromoCode(inputCode);
    if (success) {
      setPromoError("");
      setInputCode("");
    } else {
      setPromoError("Invalid code. Try 'SQUARE10' or 'ARCHITECT15'.");
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-sage-light py-20 text-center text-forest-deep">
        Loading shopping bag...
      </div>
    );
  }

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const discount = getDiscountAmount();
  const total = getTotal();

  return (
    <div className="min-h-screen bg-sage-light py-12">
      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
        {/* Header */}
        <div className="flex items-center justify-between pb-8 border-b border-borderSage/70">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-forest-muted mb-2">
              <Link href="/" className="hover:text-forest-deep">Home</Link>
              <span>/</span>
              <span className="text-terracotta">Shopping Bag</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-forest-deep tracking-tight">
              Shopping Bag ({items.length} designs)
            </h1>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-forest-muted hover:text-terracotta transition-colors"
            >
              Clear Bag
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty Bag State */
          <div className="py-24 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-ivory-warm text-forest-muted flex items-center justify-center mx-auto border border-borderSage shadow-soft">
              <ShoppingBag className="w-8 h-8 text-forest-muted/50" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-forest-deep">
              Your bag is currently empty
            </h2>
            <p className="text-sm text-forest-muted leading-relaxed">
              Explore our architectural handcrafted sofas, dining suites, and bedroom sanctuaries to begin curating your space.
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
          /* Cart Content Layout: Left Table + Right Order Summary */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10">
            {/* Left Items Column (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-6 glass-surface-subtle rounded-3xl border border-white/65 shadow-soft transition-all duration-300 hover:border-white/90"
                >
                  {/* Image & Title */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-sage-50/70 shrink-0 border border-white/80 shadow-soft">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-forest-muted">
                        {item.product.categoryName}
                      </span>
                      <Link href={`/product/${item.product.slug}`}>
                        <h3 className="font-heading font-extrabold text-base text-forest-deep hover:text-terracotta transition-colors line-clamp-1">
                          {item.product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-3 text-xs text-forest-muted">
                        <span className="flex items-center gap-1.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white/80 shadow-xs"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          {item.selectedColor.name}
                        </span>
                        {item.selectedMaterial && (
                          <>
                            <span>•</span>
                            <span>{item.selectedMaterial}</span>
                          </>
                        )}
                      </div>
                      <span className="text-xs font-bold text-forest-deep block sm:hidden pt-1">
                        {formatPrice(item.product.price)} each
                      </span>
                    </div>
                  </div>

                  {/* Right side: Quantity & Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-borderSage/40">
                    {/* Quantity controls with glass pill */}
                    <div className="flex items-center glass-pill rounded-full px-2 py-1 border border-white/80 shadow-soft">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-forest-deep font-bold hover:bg-white/60 rounded-full"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-forest-deep">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-forest-deep font-bold hover:bg-white/60 rounded-full"
                      >
                        +
                      </button>
                    </div>

                    {/* Price total for item */}
                    <div className="text-right min-w-[90px]">
                      <span className="text-base font-extrabold text-forest-deep">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-forest-muted hover:text-red-600 transition-colors p-1.5 rounded-full hover:bg-white/60"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Delivery Tier Selection */}
              <div className="glass-surface-subtle rounded-3xl border border-white/65 p-6 space-y-3 mt-6 shadow-soft">
                <span className="text-xs uppercase tracking-wider font-extrabold text-forest-deep block mb-2">
                  Select Delivery Service:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setDeliveryMethod("standard")}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      deliveryMethod === "standard"
                        ? "glass-pill border-white/90 shadow-md font-bold"
                        : "glass-surface-subtle border-white/50 hover:bg-white/60"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-forest-deep mb-1">
                      <span>Curbside Freight</span>
                      <span>{subtotal >= 2000 ? "FREE" : formatPrice(75)}</span>
                    </div>
                    <p className="text-[11px] text-forest-muted">
                      Liftgate curbside delivery (5-7 business days).
                    </p>
                  </button>

                  <button
                    onClick={() => setDeliveryMethod("white-glove")}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      deliveryMethod === "white-glove"
                        ? "glass-pill border-white/90 shadow-md font-bold"
                        : "glass-surface-subtle border-white/50 hover:bg-white/60"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-forest-deep mb-1">
                      <span>White-Glove Placement</span>
                      <span>{formatPrice(195)}</span>
                    </div>
                    <p className="text-[11px] text-forest-muted">
                      In-room placement, full assembly & crate removal.
                    </p>
                  </button>

                  <button
                    onClick={() => setDeliveryMethod("express")}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      deliveryMethod === "express"
                        ? "border-forest-dark bg-white shadow-sm"
                        : "border-borderSage bg-sage-50 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-forest-deep mb-1">
                      <span>Express Priority</span>
                      <span>{formatPrice(120)}</span>
                    </div>
                    <p className="text-[11px] text-forest-muted">
                      Expedited freight dispatch (2-3 business days).
                    </p>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Link
                  href="/shop"
                  className="text-xs font-bold text-forest-deep hover:text-terracotta flex items-center gap-1.5 transition-colors"
                >
                  ← Continue Exploring Furniture
                </Link>
              </div>
            </div>

            {/* Right Summary Column (4 cols) */}
            <div className="lg:col-span-4">
              <div className="glass-surface rounded-3xl border border-white/75 bg-white/85 backdrop-blur-3xl p-6 sm:p-8 space-y-6 shadow-floating sticky top-24">
                <h3 className="font-heading font-extrabold text-lg text-forest-deep pb-4 border-b border-borderSage/40">
                  Order Summary
                </h3>

                {/* Subtotal lines */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-forest-muted">
                    <span>Furniture Subtotal</span>
                    <span className="font-bold text-forest-deep">{formatPrice(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-terracotta font-bold">
                      <span>Promo Discount ({promoCode})</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-forest-muted">
                    <span>Delivery Service ({deliveryMethod})</span>
                    <span className="font-bold text-forest-deep">
                      {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                    </span>
                  </div>

                  <div className="flex justify-between text-forest-muted text-xs">
                    <span>Estimated Sales Tax</span>
                    <span>Calculated at checkout</span>
                  </div>

                  <div className="pt-4 border-t border-borderSage/40 flex justify-between items-baseline">
                    <span className="font-heading font-bold text-base text-forest-deep">
                      Estimated Total
                    </span>
                    <span className="font-heading font-extrabold text-2xl text-forest-deep">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Promo Code Form */}
                <div className="pt-2">
                  {promoCode ? (
                    <div className="flex items-center justify-between p-3.5 rounded-2xl glass-pill text-xs">
                      <span className="font-bold text-forest-deep">
                        Code applied: <strong>{promoCode}</strong>
                      </span>
                      <button
                        onClick={removePromoCode}
                        className="text-terracotta hover:underline font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="space-y-1.5">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="w-3.5 h-3.5 text-forest-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={inputCode}
                            onChange={(e) => {
                              setInputCode(e.target.value);
                              if (promoError) setPromoError("");
                            }}
                            placeholder="Promo code (e.g. SQUARE10)"
                            className="w-full glass-input rounded-2xl pl-9 pr-3 py-2.5 text-xs text-forest-deep focus:outline-none uppercase"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-2xl glass-pill-forest text-white text-xs font-bold transition-all hover:scale-105"
                        >
                          Apply
                        </button>
                      </div>
                      {promoError && (
                        <p className="text-[11px] text-red-600 pl-1">{promoError}</p>
                      )}
                    </form>
                  )}
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full py-4 rounded-full glass-cta-orange text-white text-xs font-heading font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-floating transition-all hover:scale-[1.02]"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="pt-2 space-y-2 text-[11px] text-forest-muted">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Safe 256-bit encrypted checkout simulation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-forest-deep shrink-0" />
                    <span>Full transit insurance included on all shipments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
