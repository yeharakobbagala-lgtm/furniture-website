"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  Star,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Ruler,
  Building2,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  Scale,
} from "lucide-react";
import { Product, ProductColor, Review } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useComparisonStore } from "@/stores/comparisonStore";
import { useRecentlyViewedStore } from "@/stores/recentlyViewedStore";
import { useCommercialQuoteStore } from "@/stores/commercialQuoteStore";
import { useUserStore } from "@/stores/userStore";
import ProductCard from "@/components/products/ProductCard";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  // State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colours[0]);
  const [selectedMaterial, setSelectedMaterial] = useState<string>(product.materials[0]);
  const [quantity, setQuantity] = useState(1);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "delivery" | "care">("specs");
  const [addedNotice, setAddedNotice] = useState(false);
  const [quoteNotice, setQuoteNotice] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteQty, setQuoteQty] = useState(10);
  const [quoteNotes, setQuoteNotes] = useState("");

  // Review submission state
  const [reviewsList, setReviewsList] = useState<Review[]>(product.reviews);
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Stores
  const addItemToCart = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const { isInComparison, addItem: addToComparison, removeItem: removeFromComparison } =
    useComparisonStore();
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addRecentlyViewed);
  const addQuoteItem = useCommercialQuoteStore((s) => s.addItem);
  const customerType = useUserStore((s) => s.customerType);

  const inWishlist = isInWishlist(product.id);
  const inComparison = isInComparison(product.id);

  // Register in recently viewed
  useEffect(() => {
    addRecentlyViewed(product);
  }, [product, addRecentlyViewed]);

  const handleAddToCart = () => {
    addItemToCart(product, quantity, selectedColor, selectedMaterial);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2400);
  };

  const handleAddCommercialQuote = () => {
    addQuoteItem(product, quoteQty, selectedColor, quoteNotes);
    setQuoteModalOpen(false);
    setQuoteNotice(true);
    setTimeout(() => setQuoteNotice(false), 3000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      rating: newReviewRating,
      title: newReviewTitle.trim() || "Exceptional piece",
      comment: newReviewComment.trim(),
      date: "Just now",
      verified: true,
    };

    setReviewsList([newRev, ...reviewsList]);
    setReviewSubmitted(true);
    setNewReviewAuthor("");
    setNewReviewTitle("");
    setNewReviewComment("");
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  return (
    <div className="w-full bg-sage-light min-h-screen pb-24">
      {/* Breadcrumb */}
      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 pt-8 pb-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-forest-muted">
          <Link href="/" className="hover:text-forest-deep">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-forest-deep">Shop</Link>
          <span>/</span>
          <Link href={`/shop/${product.category}`} className="hover:text-forest-deep">
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="text-terracotta truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-ivory-warm rounded-3xl border border-borderSage p-6 sm:p-10 shadow-soft">
          {/* Left Column: Gallery & Zoom (Cols 1-7) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-sage-50 border border-borderSage shadow-soft group">
              <Image
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-500"
              />

              {/* Zoom Trigger Button */}
              <button
                onClick={() => setIsZoomOpen(true)}
                className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/90 hover:bg-white text-forest-deep shadow-soft transition-colors"
                title="Expand Zoom View"
              >
                <ZoomIn className="w-5 h-5" />
              </button>

              {/* Prev/Next arrows on main image */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex(
                        (prev) => (prev - 1 + product.images.length) % product.images.length
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-forest-deep shadow-soft opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) => (prev + 1) % product.images.length)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-forest-deep shadow-soft opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden glass-pill border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx
                        ? "border-forest-dark scale-105 shadow-md"
                        : "border-white/60 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Room Studio Links */}
            <div className="pt-4 grid grid-cols-2 gap-3">
              <Link
                href="/room-studio/planner"
                className="p-4 rounded-2xl glass-surface-subtle hover:bg-white/80 border border-white/70 flex items-center gap-3 transition-all shadow-soft group"
              >
                <div className="w-9 h-9 rounded-xl bg-forest-dark text-white flex items-center justify-center shrink-0 shadow-soft">
                  <Ruler className="w-4 h-4 text-terracotta" />
                </div>
                <div>
                  <p className="text-xs font-heading font-bold text-forest-deep group-hover:text-terracotta transition-colors">
                    Test in 2D Floor Planner
                  </p>
                  <p className="text-[11px] text-forest-muted">Check dimensions against your room</p>
                </div>
              </Link>

              <Link
                href="/room-studio/visualizer"
                className="p-4 rounded-2xl glass-surface-subtle hover:bg-white/80 border border-white/70 flex items-center gap-3 transition-all shadow-soft group"
              >
                <div className="w-9 h-9 rounded-xl bg-terracotta text-white flex items-center justify-center shrink-0 shadow-soft">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-heading font-bold text-forest-deep group-hover:text-forest-deep transition-colors">
                    Composite in Photo
                  </p>
                  <p className="text-[11px] text-forest-muted">Preview in your room photo</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Right Column: Pricing, Options, Add to Cart (Cols 8-12) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div>
              {/* Category, Availability & Rating */}
              <div className="flex items-center justify-between text-xs text-forest-muted mb-2">
                <span className="uppercase tracking-widest font-bold text-terracotta">
                  {product.categoryName}
                </span>

                <div className="flex items-center gap-1.5 font-semibold text-forest-deep">
                  <Star className="w-4 h-4 fill-terracotta text-terracotta" />
                  <span>{product.rating}</span>
                  <a href="#reviews" className="text-forest-muted hover:underline">
                    ({reviewsList.length} reviews)
                  </a>
                </div>
              </div>

              {/* Product Title */}
              <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-forest-deep tracking-tight mb-3">
                {product.name}
              </h1>

              {/* Price & Stock Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-forest-deep">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-forest-muted line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  {product.availability === "in_stock" ? "In Stock — Ready to dispatch" : "Made to Order"}
                </span>
              </div>

              {/* Short summary */}
              <p className="text-sm text-forest-muted leading-relaxed mb-6">
                {product.shortDescription || product.description}
              </p>

              {/* Color Swatches */}
              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-xs">
                  <span className="uppercase tracking-wider font-bold text-forest-deep">
                    Selected Finish:
                  </span>
                  <strong className="text-forest-deep">{selectedColor.name}</strong>
                </div>
                <div className="flex items-center gap-2">
                  {product.colours.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedColor.name === color.name
                          ? "border-forest-deep scale-110 shadow-sm"
                          : "border-borderSage hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor.name === color.name && (
                        <Check
                          className={`w-4 h-4 ${
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
                  <span className="text-xs uppercase tracking-wider font-bold text-forest-deep block">
                    Material Specification:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map((mat) => (
                      <button
                        key={mat}
                        onClick={() => setSelectedMaterial(mat)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          selectedMaterial === mat
                            ? "bg-forest-dark text-white border-forest-dark shadow-sm"
                            : "bg-white text-forest-deep border-borderSage hover:bg-sage-100"
                        }`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dimensions callout */}
              <div className="p-3.5 rounded-xl bg-sage-50 border border-borderSage/80 flex items-center justify-between text-xs text-forest-deep mb-6">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Ruler className="w-4 h-4 text-terracotta" /> Dimensions:
                </span>
                <span>
                  {product.dimensions.width}W × {product.dimensions.depth}D × {product.dimensions.height}H {product.dimensions.unit}
                </span>
              </div>
            </div>

            {/* Shopping Actions: Quantity, Add to Cart, Wishlist, Compare */}
            <div className="space-y-4 pt-4 border-t border-borderSage/40">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center glass-pill rounded-full px-2.5 py-1.5 border border-white/80 shadow-soft">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-forest-deep font-bold hover:bg-white/60 rounded-full"
                  >
                    -
                  </button>
                  <span className="w-9 text-center text-sm font-bold text-forest-deep">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-forest-deep font-bold hover:bg-white/60 rounded-full"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 px-8 rounded-full glass-cta-orange text-white font-heading font-extrabold text-sm tracking-wider uppercase transition-all shadow-floating flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <ShoppingBag className="w-4 h-4 text-white" />
                  {addedNotice ? "Added to Cart ✓" : "Add to Cart"}
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all shadow-soft ${
                    inWishlist
                      ? "glass-cta-orange text-white border-white/60"
                      : "glass-pill text-forest-deep border-white/70 hover:scale-105"
                  }`}
                  title={inWishlist ? "Saved in Wishlist" : "Save to Wishlist"}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? "fill-white" : ""}`} />
                </button>

                {/* Compare */}
                <button
                  onClick={() =>
                    inComparison ? removeFromComparison(product.id) : addToComparison(product)
                  }
                  className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all shadow-soft ${
                    inComparison
                      ? "glass-pill-forest text-white border-white/60"
                      : "glass-pill text-forest-deep border-white/70 hover:scale-105"
                  }`}
                  title={inComparison ? "In Comparison" : "Add to Comparison"}
                >
                  <Scale className="w-5 h-5" />
                </button>
              </div>

              {/* Commercial Trade Quote Button */}
              <div className="pt-2">
                <button
                  onClick={() => setQuoteModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl border border-forest-dark/40 bg-white hover:bg-sage-100 text-forest-deep text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Building2 className="w-4 h-4 text-terracotta" />
                  Request Commercial / Trade Volume Quotation
                </button>
              </div>

              {quoteNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Added to your RFQ Quotation list. View in trade portal.
                </div>
              )}

              {/* Value props */}
              <div className="pt-4 grid grid-cols-2 gap-3 text-xs text-forest-muted">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-forest-deep" />
                  <span>White-glove placement included</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-forest-deep" />
                  <span>10-year timber joinery guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Tabs: Specifications, Delivery & Assembly, Materials Care */}
        <div className="mt-14 bg-ivory-warm rounded-3xl border border-borderSage p-8 sm:p-12 shadow-soft">
          <div className="flex items-center gap-8 border-b border-borderSage/70 pb-4 mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("specs")}
              className={`text-base font-heading font-bold pb-4 -mb-4 transition-colors ${
                activeTab === "specs"
                  ? "border-b-2 border-terracotta text-forest-deep"
                  : "text-forest-muted hover:text-forest-deep"
              }`}
            >
              Specifications & Craftsmanship
            </button>
            <button
              onClick={() => setActiveTab("delivery")}
              className={`text-base font-heading font-bold pb-4 -mb-4 transition-colors ${
                activeTab === "delivery"
                  ? "border-b-2 border-terracotta text-forest-deep"
                  : "text-forest-muted hover:text-forest-deep"
              }`}
            >
              Delivery & White-Glove Installation
            </button>
            <button
              onClick={() => setActiveTab("care")}
              className={`text-base font-heading font-bold pb-4 -mb-4 transition-colors ${
                activeTab === "care"
                  ? "border-b-2 border-terracotta text-forest-deep"
                  : "text-forest-muted hover:text-forest-deep"
              }`}
            >
              Natural Material Care
            </button>
          </div>

          {activeTab === "specs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.specifications.map((spec, i) => (
                <div key={i} className="flex justify-between py-3 border-b border-borderSage/50 text-sm">
                  <span className="font-semibold text-forest-deep">{spec.label}</span>
                  <span className="text-forest-muted text-right max-w-xs">{spec.value}</span>
                </div>
              ))}
              <div className="flex justify-between py-3 border-b border-borderSage/50 text-sm">
                <span className="font-semibold text-forest-deep">Designer</span>
                <span className="text-forest-muted">{product.designerName || "Square Atelier"}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-borderSage/50 text-sm">
                <span className="font-semibold text-forest-deep">Design Typology</span>
                <span className="text-forest-muted">{product.style}</span>
              </div>
            </div>
          )}

          {activeTab === "delivery" && (
            <div className="space-y-4 text-sm text-forest-muted leading-relaxed max-w-3xl">
              <p>
                Square furniture is transported inside specialized climatic freight crates to protect natural hardwoods and honed stones from humidity fluctuations.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-forest-deep">Inside Room Placement:</strong> Our two-person white-glove team carries the furniture to your room of choice.
                </li>
                <li>
                  <strong className="text-forest-deep">Full Unpacking & Inspection:</strong> We assemble components and remove all protective wood crates and packaging for zero waste.
                </li>
                <li>
                  <strong className="text-forest-deep">Delivery Scheduling:</strong> You will receive a direct dispatch SMS with a 2-hour appointment window 48 hours prior to delivery.
                </li>
              </ul>
            </div>
          )}

          {activeTab === "care" && (
            <div className="space-y-4 text-sm text-forest-muted leading-relaxed max-w-3xl">
              <p>
                Natural European hardwoods and honed travertine develop a magnificent heirloom patina when treated with gentle organic balms.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-forest-deep">Daily Dusting:</strong> Wipe surfaces using a soft microfiber cloth slightly dampened with clean warm water.
                </li>
                <li>
                  <strong className="text-forest-deep">Avoid Synthetic Cleaners:</strong> Never use abrasive ammonia, bleach, or silicone-based aerosol polishes.
                </li>
                <li>
                  <strong className="text-forest-deep">Seasonal Nourishment:</strong> Apply natural organic beeswax or mineral oil once every 6 months to maintain timber suppleness.
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Customer Reviews Section */}
        <section id="reviews" className="mt-14 bg-ivory-warm rounded-3xl border border-borderSage p-8 sm:p-12 shadow-soft">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-borderSage/70">
            <div>
              <h2 className="text-2xl font-heading font-extrabold text-forest-deep">
                Client Reviews ({reviewsList.length})
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center text-terracotta">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-terracotta" />
                  ))}
                </div>
                <span className="text-sm font-bold text-forest-deep">{product.rating} out of 5</span>
              </div>
            </div>
          </div>

          {/* Reviews list */}
          <div className="space-y-6 mb-12">
            {reviewsList.length === 0 ? (
              <p className="text-sm text-forest-muted italic">
                Be the first client to review this architectural design.
              </p>
            ) : (
              reviewsList.map((rev) => (
                <div key={rev.id} className="p-5 rounded-2xl bg-white border border-borderSage space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-forest-deep">
                        {rev.author}
                      </span>
                      {rev.verified && (
                        <span className="text-[10px] bg-sage-100 text-forest-deep px-2 py-0.5 rounded font-semibold">
                          Verified Owner
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-forest-muted">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-terracotta">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-terracotta" />
                    ))}
                  </div>
                  <h4 className="text-sm font-bold text-forest-deep">{rev.title}</h4>
                  <p className="text-xs sm:text-sm text-forest-muted leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Write a Review Simulation Form */}
          <div className="pt-8 border-t border-borderSage/70">
            <h3 className="text-lg font-heading font-bold text-forest-deep mb-4">
              Write an Editorial Review
            </h3>

            {reviewSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-600" />
                Thank you. Your review has been added to this product.
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase font-bold text-forest-deep block mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className="w-full bg-white border border-borderSage rounded-xl px-3 py-2 text-xs text-forest-deep focus:outline-none focus:border-forest-dark"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase font-bold text-forest-deep block mb-1">
                      Rating
                    </label>
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(parseInt(e.target.value))}
                      className="w-full bg-white border border-borderSage rounded-xl px-3 py-2 text-xs text-forest-deep focus:outline-none focus:border-forest-dark"
                    >
                      <option value="5">5 Stars — Sublime</option>
                      <option value="4">4 Stars — Exceptional</option>
                      <option value="3">3 Stars — Good</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-forest-deep block mb-1">
                    Review Headline
                  </label>
                  <input
                    type="text"
                    value={newReviewTitle}
                    onChange={(e) => setNewReviewTitle(e.target.value)}
                    placeholder="e.g. Sculptural centerpiece of our home"
                    className="w-full bg-white border border-borderSage rounded-xl px-3 py-2 text-xs text-forest-deep focus:outline-none focus:border-forest-dark"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-forest-deep block mb-1">
                    Your Experience
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="Share thoughts on tactile comfort, joinery, and aesthetic presence..."
                    className="w-full bg-white border border-borderSage rounded-xl px-3 py-2 text-xs text-forest-deep focus:outline-none focus:border-forest-dark"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-forest-dark hover:bg-forest-deep text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-forest-deep">
                Complementary Pieces
              </h2>
              <Link href={`/shop/${product.category}`} className="text-xs font-bold text-terracotta hover:underline">
                View all {product.categoryName} →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Zoom Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-forest-deep/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/20 hover:bg-white text-white hover:text-forest-deep transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-[80vh]">
            <Image
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* Commercial Quotation Modal */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-deep/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-ivory-warm rounded-3xl p-6 sm:p-8 shadow-floating border border-borderSage">
            <button
              onClick={() => setQuoteModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-forest-muted hover:text-forest-deep"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold uppercase text-terracotta mb-1">
              <Building2 className="w-4 h-4" /> Commercial RFQ System
            </div>
            <h3 className="text-xl font-heading font-bold text-forest-deep mb-2">
              Add to Commercial Quotation
            </h3>
            <p className="text-xs text-forest-muted mb-4">
              Specifying {product.name} for hotels, offices, restaurants, or residential developments.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                  Estimated Quantity Needed
                </label>
                <input
                  type="number"
                  min="1"
                  value={quoteQty}
                  onChange={(e) => setQuoteQty(parseInt(e.target.value) || 1)}
                  className="w-full bg-white border border-borderSage rounded-xl px-3 py-2 text-sm text-forest-deep focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                  Custom Specification or Flame Retardancy Notes
                </label>
                <textarea
                  rows={3}
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  placeholder="e.g. Crib 5 fire certification needed for boutique hotel lobby..."
                  className="w-full bg-white border border-borderSage rounded-xl px-3 py-2 text-xs text-forest-deep focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setQuoteModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-borderSage bg-white text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCommercialQuote}
                  className="flex-1 py-3 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold uppercase transition-colors"
                >
                  Add to Quotation Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
