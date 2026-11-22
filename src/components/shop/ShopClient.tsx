"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  Grid3X3,
  List,
  X,
  Search,
  ChevronDown,
  RotateCcw,
  Star,
  Check,
} from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { FurnitureStyle, Product } from "@/types";
import { formatPrice } from "@/lib/utils";

interface ShopClientProps {
  initialCategory?: string;
  categoryBanner?: {
    name: string;
    description: string;
    bannerImage: string;
  };
}

export default function ShopClient({ initialCategory, categoryBanner }: ShopClientProps) {
  const searchParams = useSearchParams();

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "all");
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("q") || "");
  const [selectedStyle, setSelectedStyle] = useState<string>(searchParams.get("style") || "all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 6000]);
  const [selectedColor, setSelectedColor] = useState<string>("all");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("all");
  const [selectedAvailability, setSelectedAvailability] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>(searchParams.get("sort") || "featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Sync initialCategory or searchParams if they change
  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
    const q = searchParams.get("q");
    if (q) setSearchQuery(q);
    const st = searchParams.get("style");
    if (st) setSelectedStyle(st);
  }, [initialCategory, searchParams]);

  // Extract unique styles, materials, and colors from products
  const availableStyles = useMemo(() => {
    const set = new Set<FurnitureStyle>();
    products.forEach((p) => set.add(p.style));
    return Array.from(set);
  }, []);

  const availableMaterials = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.materials.forEach((m) => set.add(m)));
    return Array.from(set).slice(0, 10);
  }, []);

  const availableColors = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => p.colours.forEach((c) => map.set(c.name, c.hex)));
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex })).slice(0, 8);
  }, []);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesCat = product.categoryName.toLowerCase().includes(q);
        const matchesMat = product.materials.some((m) => m.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesCat && !matchesMat) return false;
      }
      // Style filter
      if (selectedStyle !== "all" && product.style !== selectedStyle) {
        return false;
      }
      // Price range
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      // Color filter
      if (
        selectedColor !== "all" &&
        !product.colours.some((c) => c.name.toLowerCase().includes(selectedColor.toLowerCase()))
      ) {
        return false;
      }
      // Material filter
      if (
        selectedMaterial !== "all" &&
        !product.materials.some((m) => m.toLowerCase().includes(selectedMaterial.toLowerCase()))
      ) {
        return false;
      }
      // Availability
      if (selectedAvailability !== "all" && product.availability !== selectedAvailability) {
        return false;
      }
      return true;
    });
  }, [
    selectedCategory,
    searchQuery,
    selectedStyle,
    priceRange,
    selectedColor,
    selectedMaterial,
    selectedAvailability,
  ]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      case "newest":
        return list.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
      case "popularity":
        return list.sort((a, b) => b.reviewCount - a.reviewCount);
      case "featured":
      default:
        return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [filteredProducts, sortBy]);

  // Paginated slices
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(0, currentPage * itemsPerPage);

  // Active filter checks
  const hasActiveFilters =
    selectedCategory !== (initialCategory || "all") ||
    searchQuery.trim().length > 0 ||
    selectedStyle !== "all" ||
    priceRange[0] > 0 ||
    priceRange[1] < 6000 ||
    selectedColor !== "all" ||
    selectedMaterial !== "all" ||
    selectedAvailability !== "all";

  const clearAllFilters = () => {
    setSelectedCategory(initialCategory || "all");
    setSearchQuery("");
    setSelectedStyle("all");
    setPriceRange([0, 6000]);
    setSelectedColor("all");
    setSelectedMaterial("all");
    setSelectedAvailability("all");
    setSortBy("featured");
    setCurrentPage(1);
  };

  return (
    <div className="w-full bg-sage-light min-h-screen pb-20">
      {/* Category Banner if provided */}
      {categoryBanner ? (
        <div className="relative w-full h-64 sm:h-80 overflow-hidden bg-forest-dark mb-10">
          <Image
            src={categoryBanner.bannerImage}
            alt={categoryBanner.name}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/40 to-transparent" />
          <div className="absolute inset-0 w-full max-w-[1850px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 flex flex-col justify-end pb-10 text-white">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-sage-300 mb-2">
              <Link href="/shop" className="hover:text-white">Shop</Link>
              <span>/</span>
              <span className="text-terracotta">{categoryBanner.name}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white mb-2">
              {categoryBanner.name}
            </h1>
            <p className="text-sm sm:text-base text-sage-200 max-w-2xl">
              {categoryBanner.description}
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 pt-8 pb-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-forest-muted mb-2">
            <Link href="/" className="hover:text-forest-deep">Home</Link>
            <span>/</span>
            <span className="text-terracotta">Furniture Collections</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-forest-deep tracking-tight">
                Architectural Furniture
              </h1>
              <p className="text-sm text-forest-muted mt-1">
                Handcrafted solid hardwoods, Italian bouclé, and Roman stone tailored for living and contract environments.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
        {/* Controls Bar: Search, View Switch, Sort, Mobile Filter Toggle */}
        <div className="glass-surface rounded-3xl p-4 sm:p-5 mb-8 flex flex-wrap items-center justify-between gap-4 shadow-floating border border-white/70 bg-white/75 backdrop-blur-2xl">
          {/* Search in Catalog */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-4 h-4 text-forest-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by model, timber, or silhouette..."
              className="w-full glass-input text-forest-deep placeholder:text-forest-muted/70 text-xs sm:text-sm rounded-2xl pl-9 pr-8 py-2.5 border border-white/70 focus:outline-none focus:border-forest-dark transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-forest-muted hover:text-forest-deep p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2.5 rounded-2xl glass-pill text-forest-deep text-xs font-bold flex items-center gap-2 border border-white/80 transition-all"
            >
              <SlidersHorizontal className="w-4 h-4 text-terracotta" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-terracotta" />
              )}
            </button>

            {/* Sorting Select */}
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none glass-pill rounded-2xl px-4 py-2.5 pr-8 text-xs sm:text-sm font-bold text-forest-deep focus:outline-none border border-white/80 cursor-pointer shadow-soft"
              >
                <option value="featured">Featured Curations</option>
                <option value="newest">New Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popularity">Most Popular</option>
              </select>
              <ChevronDown className="w-4 h-4 text-forest-muted absolute right-2.5 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center rounded-2xl glass-pill border border-white/80 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === "grid"
                    ? "bg-forest-dark text-white shadow-soft"
                    : "text-forest-muted hover:text-forest-deep"
                }`}
                title="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === "list"
                    ? "bg-forest-dark text-white shadow-soft"
                    : "text-forest-muted hover:text-forest-deep"
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs uppercase tracking-wider font-semibold text-forest-muted mr-1">
              Active Filters:
            </span>

            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-dark text-white text-xs font-medium">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory("all")} className="hover:text-terracotta">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-dark text-white text-xs font-medium">
                &ldquo;{searchQuery}&rdquo;
                <button onClick={() => setSearchQuery("")} className="hover:text-terracotta">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedStyle !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-dark text-white text-xs font-medium">
                Style: {selectedStyle}
                <button onClick={() => setSelectedStyle("all")} className="hover:text-terracotta">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(priceRange[0] > 0 || priceRange[1] < 6000) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-dark text-white text-xs font-medium">
                Price: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                <button onClick={() => setPriceRange([0, 6000])} className="hover:text-terracotta">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedColor !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-dark text-white text-xs font-medium">
                Color: {selectedColor}
                <button onClick={() => setSelectedColor("all")} className="hover:text-terracotta">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedMaterial !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-dark text-white text-xs font-medium">
                Material: {selectedMaterial}
                <button onClick={() => setSelectedMaterial("all")} className="hover:text-terracotta">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-terracotta hover:underline ml-2 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Clear All
            </button>
          </div>
        )}

        {/* Layout Grid: Desktop Sidebar + Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar (3 cols) */}
          <aside className="hidden lg:block lg:col-span-3 glass-surface-subtle rounded-3xl border border-white/65 p-6 space-y-6 sticky top-24 shadow-soft">
            <div className="flex items-center justify-between pb-4 border-b border-borderSage/40">
              <span className="font-heading font-extrabold text-forest-deep text-base">
                Refine Selection
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-terracotta hover:underline font-bold"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-forest-deep block mb-3">
                Furniture Categories
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left text-xs py-1.5 px-2 rounded-lg font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === "all"
                      ? "bg-forest-dark text-white"
                      : "text-forest-muted hover:text-forest-deep hover:bg-sage-100"
                  }`}
                >
                  <span>All Categories</span>
                  <span>{products.length}</span>
                </button>

                {categories.map((c) => {
                  const count = products.filter((p) => p.category === c.slug).length;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCategory(c.slug);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left text-xs py-1.5 px-2 rounded-lg font-medium transition-colors flex items-center justify-between ${
                        selectedCategory === c.slug
                          ? "bg-forest-dark text-white"
                          : "text-forest-muted hover:text-forest-deep hover:bg-sage-100"
                      }`}
                    >
                      <span>{c.name}</span>
                      <span>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div className="pt-4 border-t border-borderSage/70">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider font-bold text-forest-deep">
                  Price Limit
                </span>
                <span className="text-xs font-semibold text-terracotta">
                  Up to {formatPrice(priceRange[1])}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="6000"
                step="250"
                value={priceRange[1]}
                onChange={(e) => {
                  setPriceRange([priceRange[0], parseInt(e.target.value)]);
                  setCurrentPage(1);
                }}
                className="w-full accent-terracotta cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-forest-muted mt-1">
                <span>$0</span>
                <span>$6,000+</span>
              </div>
            </div>

            {/* Style Filters */}
            <div className="pt-4 border-t border-borderSage/70">
              <span className="text-xs uppercase tracking-wider font-bold text-forest-deep block mb-3">
                Interior Style
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => {
                    setSelectedStyle("all");
                    setCurrentPage(1);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                    selectedStyle === "all"
                      ? "bg-forest-dark text-white border-forest-dark"
                      : "bg-white text-forest-deep border-borderSage hover:bg-sage-100"
                  }`}
                >
                  All
                </button>
                {availableStyles.map((style) => (
                  <button
                    key={style}
                    onClick={() => {
                      setSelectedStyle(style);
                      setCurrentPage(1);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                      selectedStyle === style
                        ? "bg-forest-dark text-white border-forest-dark"
                        : "bg-white text-forest-deep border-borderSage hover:bg-sage-100"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Swatches */}
            <div className="pt-4 border-t border-borderSage/70">
              <span className="text-xs uppercase tracking-wider font-bold text-forest-deep block mb-3">
                Color Palette
              </span>
              <div className="grid grid-cols-4 gap-2">
                {availableColors.map((color) => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => {
                        setSelectedColor(isSelected ? "all" : color.name);
                        setCurrentPage(1);
                      }}
                      className={`h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-forest-deep scale-105 shadow-sm"
                          : "border-borderSage hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {isSelected && (
                        <Check
                          className={`w-3.5 h-3.5 ${
                            color.hex === "#F8F7F0" || color.hex === "#DFD7CD"
                              ? "text-forest-deep"
                              : "text-white"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Material */}
            <div className="pt-4 border-t border-borderSage/70">
              <span className="text-xs uppercase tracking-wider font-bold text-forest-deep block mb-3">
                Material
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableMaterials.slice(0, 6).map((mat) => (
                  <button
                    key={mat}
                    onClick={() => {
                      setSelectedMaterial(selectedMaterial === mat ? "all" : mat);
                      setCurrentPage(1);
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                      selectedMaterial === mat
                        ? "bg-forest-dark text-white border-forest-dark"
                        : "bg-white text-forest-deep border-borderSage hover:bg-sage-100"
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Listings Grid / List (9 cols) */}
          <main className="lg:col-span-9">
            <div className="flex items-center justify-between mb-4 text-xs text-forest-muted">
              <span>
                Showing <strong className="text-forest-deep">{paginatedProducts.length}</strong> of{" "}
                <strong className="text-forest-deep">{sortedProducts.length}</strong> models
              </span>
            </div>

            {sortedProducts.length === 0 ? (
              <div className="py-20 text-center bg-ivory-warm rounded-3xl border border-borderSage p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-sage-100 text-forest-muted flex items-center justify-center mx-auto">
                  <SlidersHorizontal className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-heading font-bold text-forest-deep">
                  No furniture matching current filters
                </h3>
                <p className="text-sm text-forest-muted max-w-md mx-auto">
                  Try broadening your price limit or clearing active color and style filters to discover more models.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 rounded-xl bg-forest-dark text-white text-xs font-bold tracking-wider uppercase hover:bg-forest-deep transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* List View Mode */
              <div className="space-y-4">
                {paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row gap-5 p-5 bg-ivory-warm rounded-2xl border border-borderSage hover:border-forest-dark/40 hover:shadow-card transition-all"
                  >
                    <div className="relative w-full sm:w-56 aspect-[4/3] rounded-xl overflow-hidden bg-sage-50 shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="240px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs text-forest-muted mb-1">
                          <span className="uppercase tracking-wider font-medium">
                            {product.categoryName}
                          </span>
                          <div className="flex items-center gap-1 font-semibold text-forest-deep">
                            <Star className="w-3.5 h-3.5 fill-terracotta text-terracotta" />
                            <span>{product.rating}</span>
                          </div>
                        </div>
                        <Link href={`/product/${product.slug}`}>
                          <h3 className="font-heading font-bold text-lg text-forest-deep hover:text-terracotta transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-forest-muted line-clamp-2 mt-1.5 leading-relaxed">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-xs font-semibold text-forest-deep">
                            {product.materials.join(" • ")}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-borderSage/60 mt-4">
                        <span className="text-xl font-bold text-forest-deep">
                          {formatPrice(product.price)}
                        </span>
                        <Link
                          href={`/product/${product.slug}`}
                          className="px-4 py-2 rounded-xl bg-forest-dark hover:bg-forest-deep text-white text-xs font-semibold transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Pagination */}
            {paginatedProducts.length < sortedProducts.length && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-8 py-3.5 rounded-xl bg-white hover:bg-ivory text-forest-deep border border-borderSage text-xs font-bold uppercase tracking-wider shadow-soft hover:shadow-card transition-all"
                >
                  Load More Furniture Models ({sortedProducts.length - paginatedProducts.length} remaining)
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-forest-deep/60 backdrop-blur-sm lg:hidden animate-fadeIn">
          <div className="w-full max-w-md bg-ivory-warm h-full overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-borderSage">
              <span className="font-heading font-bold text-forest-deep text-lg">
                Filter Catalog
              </span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-forest-muted hover:text-forest-deep"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-forest-deep block mb-3">
                Categories
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`text-left text-xs py-2 px-3 rounded-lg font-medium border ${
                    selectedCategory === "all"
                      ? "bg-forest-dark text-white border-forest-dark"
                      : "bg-white text-forest-deep border-borderSage"
                  }`}
                >
                  All Models
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`text-left text-xs py-2 px-3 rounded-lg font-medium border ${
                      selectedCategory === c.slug
                        ? "bg-forest-dark text-white border-forest-dark"
                        : "bg-white text-forest-deep border-borderSage"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Price */}
            <div className="pt-4 border-t border-borderSage">
              <span className="text-xs uppercase tracking-wider font-bold text-forest-deep block mb-2">
                Price Limit: {formatPrice(priceRange[1])}
              </span>
              <input
                type="range"
                min="0"
                max="6000"
                step="250"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full accent-terracotta cursor-pointer"
              />
            </div>

            {/* Mobile Styles */}
            <div className="pt-4 border-t border-borderSage">
              <span className="text-xs uppercase tracking-wider font-bold text-forest-deep block mb-3">
                Style
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableStyles.map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`text-xs px-3 py-1.5 rounded-lg border ${
                      selectedStyle === style
                        ? "bg-forest-dark text-white border-forest-dark"
                        : "bg-white text-forest-deep border-borderSage"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-borderSage flex gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-3 rounded-xl border border-borderSage bg-white text-forest-deep text-xs font-bold uppercase tracking-wider"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 rounded-xl bg-forest-dark text-white text-xs font-bold uppercase tracking-wider"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
