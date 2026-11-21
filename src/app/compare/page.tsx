"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Scale,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Star,
  Check,
  Plus,
} from "lucide-react";
import { useComparisonStore } from "@/stores/comparisonStore";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";

export default function ComparePage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, clearComparison } = useComparisonStore();
  const addItemToCart = useCartStore((s) => s.addItem);
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (product: (typeof items)[0]) => {
    addItemToCart(product, 1);
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-sage-light py-20 text-center text-forest-deep">
        Loading product comparison...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-light py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 border-b border-borderSage/70 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-forest-muted mb-2">
              <Link href="/" className="hover:text-forest-deep">Home</Link>
              <span>/</span>
              <span className="text-terracotta">Product Comparison</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-forest-deep tracking-tight">
              Compare Furniture ({items.length} of 4)
            </h1>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearComparison}
              className="text-xs font-semibold text-forest-muted hover:text-terracotta transition-colors"
            >
              Clear Comparison Table
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-ivory-warm text-forest-muted flex items-center justify-center mx-auto border border-borderSage shadow-soft">
              <Scale className="w-8 h-8 text-forest-muted/50" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-forest-deep">
              No products selected for comparison
            </h2>
            <p className="text-sm text-forest-muted leading-relaxed">
              Compare dimensions, solid hardwoods, tailored upholstery, and ratings side by side. Click the scale icon on any product card in the catalog.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-forest-dark hover:bg-forest-deep text-white text-xs font-bold uppercase tracking-wider shadow-card transition-all"
              >
                Browse Furniture Catalog <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Responsive Comparison Table */
          <div className="pt-10 overflow-x-auto">
            <table className="w-full text-left border-collapse bg-ivory-warm rounded-3xl overflow-hidden shadow-soft border border-borderSage">
              <thead>
                <tr className="border-b border-borderSage/80 bg-white/60">
                  <th className="p-5 text-xs uppercase font-bold text-forest-muted w-48 shrink-0">
                    Product Specification
                  </th>
                  {items.map((prod) => (
                    <th key={prod.id} className="p-5 min-w-[240px] max-w-[280px] align-top">
                      <div className="space-y-3">
                        <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-sage-50 border border-borderSage">
                          <Image
                            src={prod.images[0]}
                            alt={prod.name}
                            fill
                            sizes="240px"
                            className="object-cover"
                          />
                          <button
                            onClick={() => removeItem(prod.id)}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 text-forest-deep hover:text-red-600 flex items-center justify-center shadow-soft"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-terracotta">
                            {prod.categoryName}
                          </span>
                          <Link href={`/product/${prod.slug}`}>
                            <h3 className="font-heading font-bold text-sm text-forest-deep hover:text-terracotta line-clamp-1">
                              {prod.name}
                            </h3>
                          </Link>
                          <span className="text-base font-bold text-forest-deep block mt-1">
                            {formatPrice(prod.price)}
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddToCart(prod)}
                          className="w-full py-2 px-3 rounded-lg bg-forest-dark hover:bg-forest-deep text-white text-xs font-bold uppercase flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-terracotta" />
                          {addedMap[prod.id] ? "Added ✓" : "Add to Bag"}
                        </button>
                      </div>
                    </th>
                  ))}
                  {items.length < 4 && (
                    <th className="p-5 min-w-[200px] align-middle text-center bg-sage-50/50">
                      <Link
                        href="/shop"
                        className="inline-flex flex-col items-center gap-2 p-6 rounded-2xl border-2 border-dashed border-borderSage text-forest-muted hover:text-forest-deep hover:border-forest-dark transition-colors"
                      >
                        <Plus className="w-6 h-6 text-terracotta" />
                        <span className="text-xs font-bold">Add Another Piece</span>
                      </Link>
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-borderSage/60 text-xs">
                <tr>
                  <td className="p-4 font-bold text-forest-deep bg-sage-50/40">Design Typology</td>
                  {items.map((p) => (
                    <td key={p.id} className="p-4 text-forest-muted font-medium">
                      {p.style}
                    </td>
                  ))}
                  {items.length < 4 && <td />}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-forest-deep bg-sage-50/40">Dimensions</td>
                  {items.map((p) => (
                    <td key={p.id} className="p-4 text-forest-deep font-semibold">
                      {p.dimensions.width}W × {p.dimensions.depth}D × {p.dimensions.height}H cm
                    </td>
                  ))}
                  {items.length < 4 && <td />}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-forest-deep bg-sage-50/40">Primary Materials</td>
                  {items.map((p) => (
                    <td key={p.id} className="p-4 text-forest-muted">
                      {p.materials.join(", ")}
                    </td>
                  ))}
                  {items.length < 4 && <td />}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-forest-deep bg-sage-50/40">Color Swatches</td>
                  {items.map((p) => (
                    <td key={p.id} className="p-4">
                      <div className="flex items-center gap-1.5">
                        {p.colours.map((c) => (
                          <span
                            key={c.name}
                            className="w-4 h-4 rounded-full border border-borderSage"
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </td>
                  ))}
                  {items.length < 4 && <td />}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-forest-deep bg-sage-50/40">Client Rating</td>
                  {items.map((p) => (
                    <td key={p.id} className="p-4">
                      <div className="flex items-center gap-1 font-bold text-forest-deep">
                        <Star className="w-3.5 h-3.5 fill-terracotta text-terracotta" />
                        <span>{p.rating}</span>
                        <span className="text-forest-muted font-normal">({p.reviewCount} reviews)</span>
                      </div>
                    </td>
                  ))}
                  {items.length < 4 && <td />}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-forest-deep bg-sage-50/40">Suitable For</td>
                  {items.map((p) => (
                    <td key={p.id} className="p-4 text-forest-muted capitalize">
                      {p.suitableFor.join(" & ")}
                    </td>
                  ))}
                  {items.length < 4 && <td />}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-forest-deep bg-sage-50/40">Lead Time & Dispatch</td>
                  {items.map((p) => (
                    <td key={p.id} className="p-4 text-forest-deep font-medium">
                      {p.availability === "in_stock" ? "In Stock (3-5 days)" : "Made to Order (3-4 weeks)"}
                    </td>
                  ))}
                  {items.length < 4 && <td />}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
