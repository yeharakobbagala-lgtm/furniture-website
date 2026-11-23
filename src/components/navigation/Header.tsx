"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  Layers,
  Sparkles,
  Scale,
  Compass,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useComparisonStore } from "@/stores/comparisonStore";
import { useUserStore } from "@/stores/userStore";
import SearchModal from "./SearchModal";
import { categories } from "@/data/categories";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [furnitureDropdownOpen, setFurnitureDropdownOpen] = useState(false);
  const [roomStudioDropdownOpen, setRoomStudioDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const furnitureRef = React.useRef<HTMLDivElement>(null);
  const roomStudioRef = React.useRef<HTMLDivElement>(null);
  const furnitureTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const roomStudioTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const cartItemCount = useCartStore((s) => s.getItemCount());
  const wishlistItems = useWishlistStore((s) => s.items);
  const comparisonItems = useComparisonStore((s) => s.items);
  const { isLoggedIn, user, customerType } = useUserStore();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (furnitureTimerRef.current) clearTimeout(furnitureTimerRef.current);
      if (roomStudioTimerRef.current) clearTimeout(roomStudioTimerRef.current);
    };
  }, []);

  // Close menus on outside click or tap
  useEffect(() => {
    const handleOutsideInteraction = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (furnitureRef.current && !furnitureRef.current.contains(target)) {
        setFurnitureDropdownOpen(false);
      }
      if (roomStudioRef.current && !roomStudioRef.current.contains(target)) {
        setRoomStudioDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideInteraction);
    document.addEventListener("touchstart", handleOutsideInteraction);
    return () => {
      document.removeEventListener("mousedown", handleOutsideInteraction);
      document.removeEventListener("touchstart", handleOutsideInteraction);
    };
  }, []);

  // Close menus on page route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setFurnitureDropdownOpen(false);
    setRoomStudioDropdownOpen(false);
  }, [pathname]);

  const handleFurnitureMouseEnter = () => {
    if (furnitureTimerRef.current) clearTimeout(furnitureTimerRef.current);
    setFurnitureDropdownOpen(true);
    setRoomStudioDropdownOpen(false);
  };

  const handleFurnitureMouseLeave = () => {
    if (furnitureTimerRef.current) clearTimeout(furnitureTimerRef.current);
    furnitureTimerRef.current = setTimeout(() => {
      setFurnitureDropdownOpen(false);
    }, 280);
  };

  const handleFurnitureToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (furnitureTimerRef.current) clearTimeout(furnitureTimerRef.current);
    setFurnitureDropdownOpen((prev) => !prev);
    setRoomStudioDropdownOpen(false);
  };

  const handleRoomStudioMouseEnter = () => {
    if (roomStudioTimerRef.current) clearTimeout(roomStudioTimerRef.current);
    setRoomStudioDropdownOpen(true);
    setFurnitureDropdownOpen(false);
  };

  const handleRoomStudioMouseLeave = () => {
    if (roomStudioTimerRef.current) clearTimeout(roomStudioTimerRef.current);
    roomStudioTimerRef.current = setTimeout(() => {
      setRoomStudioDropdownOpen(false);
    }, 280);
  };

  const handleRoomStudioToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (roomStudioTimerRef.current) clearTimeout(roomStudioTimerRef.current);
    setRoomStudioDropdownOpen((prev) => !prev);
    setFurnitureDropdownOpen(false);
  };

  const navLinks = [
    { label: "Designers", href: "/designers" },
    { label: "Trends", href: "/trends" },
    { label: "Blog", href: "/blog" },
    { label: "About Us", href: "/about" },
  ];

  const isHome = pathname === "/";
  const isStudioRoute = pathname?.startsWith("/room-studio");

  return (
    <>
      <header className={`fixed top-3 sm:top-3.5 left-0 right-0 z-40 px-3 sm:px-6 md:px-8 lg:px-10 pointer-events-none transition-all duration-500 ${isStudioRoute ? "hidden lg:block" : ""}`}>
        <div className="w-full max-w-[1260px] xl:max-w-[1320px] mx-auto pointer-events-auto">
          <div className="header-liquid-glass rounded-full py-2.5 sm:py-3 px-4 sm:px-6 xl:px-8 flex items-center justify-between transition-all duration-300">
            {/* Left: Square Brand Logo with House Icon */}
            <div className="flex items-center gap-4 sm:gap-6 shrink-0">
              <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
                <div className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-xl bg-forest-dark flex items-center justify-center text-ivory shadow-soft group-hover:bg-forest-deep transition-colors shrink-0">
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-ivory group-hover:scale-105 transition-transform"
                  >
                    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
                    <path d="M9 21V12h6v9" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-extrabold text-lg sm:text-xl tracking-wider text-forest-deep leading-none">
                    SQUARE
                  </span>
                  <span className="text-[9.5px] sm:text-[10px] uppercase tracking-[0.22em] text-forest-muted font-medium leading-tight mt-0.5">
                    Furniture & Living
                  </span>
                </div>
              </Link>
            </div>

            {/* Centre: Desktop Navigation (Refined Spacing for Compact Island) */}
            <nav className="hidden lg:flex items-center gap-3 xl:gap-5 2xl:gap-7 mx-2 xl:mx-3">
              {/* Furniture with Rich Mega Dropdown */}
              <div
                ref={furnitureRef}
                className="relative shrink-0"
                onMouseEnter={handleFurnitureMouseEnter}
                onMouseLeave={handleFurnitureMouseLeave}
              >
                <button
                  type="button"
                  onClick={handleFurnitureToggle}
                  className={`relative flex items-center gap-1.5 text-sm xl:text-[15px] font-semibold tracking-wide whitespace-nowrap transition-colors py-1 px-1.5 rounded-lg select-none ${
                    pathname.startsWith("/shop") || furnitureDropdownOpen
                      ? "text-terracotta"
                      : "text-forest-deep hover:text-terracotta"
                  }`}
                  aria-expanded={furnitureDropdownOpen}
                >
                  <span>Furniture</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      furnitureDropdownOpen ? "rotate-180 text-terracotta" : "text-forest-muted"
                    }`}
                  />
                  {pathname.startsWith("/shop") && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta rounded-full" />
                  )}
                </button>

                {/* Dropdown panel with continuous hit target */}
                {furnitureDropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 z-50">
                    <div className="w-[520px] rounded-3xl bg-white/95 backdrop-blur-3xl shadow-[0_20px_50px_rgba(20,55,35,0.18)] border border-white/80 p-5 grid grid-cols-2 gap-3 animate-fadeIn">
                      <div className="col-span-2 pb-2 mb-1 border-b border-borderSage/60 flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wider font-semibold text-forest-muted">
                          All Furniture Collections
                        </span>
                        <Link
                          href="/shop"
                          onClick={() => setFurnitureDropdownOpen(false)}
                          className="text-xs text-terracotta font-medium hover:underline"
                        >
                          Browse all {categories.length} categories →
                        </Link>
                      </div>

                      {categories.slice(0, 8).map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/shop/${cat.slug}`}
                          onClick={() => setFurnitureDropdownOpen(false)}
                          className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-white/80 border border-transparent hover:border-white/50 transition-all group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-sage-200/60 overflow-hidden relative shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-forest-deep group-hover:text-terracotta transition-colors">
                              {cat.name}
                            </p>
                            <p className="text-xs text-forest-muted">{cat.productCount} models</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Room Studio Dropdown */}
              <div
                ref={roomStudioRef}
                className="relative shrink-0"
                onMouseEnter={handleRoomStudioMouseEnter}
                onMouseLeave={handleRoomStudioMouseLeave}
              >
                <button
                  type="button"
                  onClick={handleRoomStudioToggle}
                  className={`flex items-center gap-1.5 text-sm xl:text-[15px] font-semibold tracking-wide whitespace-nowrap cursor-pointer transition-colors py-1 px-1.5 rounded-lg select-none ${
                    pathname.startsWith("/room-studio") || roomStudioDropdownOpen
                      ? "text-terracotta"
                      : "text-forest-deep hover:text-terracotta"
                  }`}
                  aria-expanded={roomStudioDropdownOpen}
                >
                  <span>Room Studio</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      roomStudioDropdownOpen ? "rotate-180 text-terracotta" : "text-forest-muted"
                    }`}
                  />
                </button>

                {roomStudioDropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 z-50">
                    <div className="w-80 rounded-3xl bg-white/95 backdrop-blur-3xl shadow-[0_20px_50px_rgba(20,55,35,0.18)] border border-white/80 p-3 space-y-1 animate-fadeIn">
                      <Link
                        href="/room-studio/planner"
                        onClick={() => setRoomStudioDropdownOpen(false)}
                        className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/80 border border-transparent hover:border-white/50 transition-all group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-forest-dark text-white flex items-center justify-center shrink-0 shadow-soft">
                          <Layers className="w-4 h-4 text-terracotta" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-forest-deep group-hover:text-terracotta transition-colors">
                            2D Room Planner
                          </p>
                          <p className="text-xs text-forest-muted leading-relaxed">
                            Interactive layout tool to configure room dimensions and arrange furniture.
                          </p>
                        </div>
                      </Link>

                      <Link
                        href="/room-studio/visualizer"
                        onClick={() => setRoomStudioDropdownOpen(false)}
                        className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/80 border border-transparent hover:border-white/50 transition-all group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-forest-dark text-white flex items-center justify-center shrink-0 shadow-soft">
                          <Sparkles className="w-4 h-4 text-terracotta" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-forest-deep group-hover:text-terracotta transition-colors">
                            Photo Room Visualizer
                          </p>
                          <p className="text-xs text-forest-muted leading-relaxed">
                            Upload your room photo and composite furniture in place.
                          </p>
                        </div>
                      </Link>

                      <Link
                        href="/style-quiz"
                        onClick={() => setRoomStudioDropdownOpen(false)}
                        className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/80 border border-transparent hover:border-white/50 transition-all group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-forest-dark text-white flex items-center justify-center shrink-0 shadow-soft">
                          <Compass className="w-4 h-4 text-terracotta" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-forest-deep group-hover:text-terracotta transition-colors">
                            Interior Style Quiz
                          </p>
                          <p className="text-xs text-forest-muted leading-relaxed">
                            Discover tailored palettes and matching furniture in 2 mins.
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative text-sm xl:text-[15px] font-semibold tracking-wide whitespace-nowrap shrink-0 transition-colors py-1 px-1.5 ${
                      isActive ? "text-terracotta" : "text-forest-deep hover:text-terracotta"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Search, Comparison, Wishlist, Cart, Account with Liquid Glass Droplet buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-2.5 shrink-0">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search furniture"
                className="w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-full flex items-center justify-center text-forest-deep transition-all duration-300 bg-white/15 hover:bg-white/30 backdrop-blur-md shadow-[0_2px_8px_rgba(20,55,35,0.03),inset_0_1px_1.5px_rgba(255,255,255,0.6)] hover:scale-105 border border-white/40 hover:border-white/60"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Compare Button */}
              {mounted && comparisonItems.length > 0 && (
                <Link
                  href="/compare"
                  aria-label="Product comparison"
                  className="relative w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-full flex items-center justify-center text-forest-deep transition-all duration-300 bg-white/15 hover:bg-white/30 backdrop-blur-md shadow-[0_2px_8px_rgba(20,55,35,0.03),inset_0_1px_1.5px_rgba(255,255,255,0.6)] hover:scale-105 border border-white/40 hover:border-white/60 hidden sm:flex"
                >
                  <Scale className="w-4 h-4" />
                  <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-forest-dark text-white text-[9px] font-bold flex items-center justify-center">
                    {comparisonItems.length}
                  </span>
                </Link>
              )}

              {/* Wishlist Button */}
              <Link
                href="/wishlist"
                aria-label="Saved products"
                className="relative w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-full flex items-center justify-center text-forest-deep transition-all duration-300 bg-white/15 hover:bg-white/30 backdrop-blur-md shadow-[0_2px_8px_rgba(20,55,35,0.03),inset_0_1px_1.5px_rgba(255,255,255,0.6)] hover:scale-105 border border-white/40 hover:border-white/60 hidden sm:flex"
              >
                <Heart className="w-4 h-4" />
                {mounted && wishlistItems.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-terracotta text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Button */}
              <Link
                href="/cart"
                aria-label="Shopping bag"
                className="relative w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-full flex items-center justify-center text-forest-deep transition-all duration-300 bg-white/15 hover:bg-white/30 backdrop-blur-md shadow-[0_2px_8px_rgba(20,55,35,0.03),inset_0_1px_1.5px_rgba(255,255,255,0.6)] hover:scale-105 border border-white/40 hover:border-white/60"
              >
                <ShoppingBag className="w-4 h-4" />
                {mounted && cartItemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#183323] text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Account / Login */}
              <Link
                href={isLoggedIn ? "/account" : "/account/login"}
                aria-label="Customer account"
                className="w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-full flex items-center justify-center text-forest-deep transition-all duration-300 bg-white/15 hover:bg-white/30 backdrop-blur-md shadow-[0_2px_8px_rgba(20,55,35,0.03),inset_0_1px_1.5px_rgba(255,255,255,0.6)] hover:scale-105 border border-white/40 hover:border-white/60 hidden sm:flex"
              >
                <User className="w-4 h-4" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
                className="p-2 rounded-full hover:bg-white/30 text-forest-deep transition-colors lg:hidden border border-white/40 bg-white/15 backdrop-blur-md"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 max-w-[1850px] mx-auto pointer-events-auto">
            <div className="glass-surface p-6 rounded-3xl border border-white/75 bg-white/85 backdrop-blur-3xl shadow-floating space-y-4 animate-fadeIn">
              <div className="space-y-1">
                <Link
                  href="/shop"
                  className="block py-2.5 text-base font-semibold text-forest-deep border-b border-borderSage/40"
                >
                  All Furniture
                </Link>
                <div className="pl-3 py-2 grid grid-cols-2 gap-2">
                  {categories.slice(0, 6).map((c) => (
                    <Link
                      key={c.id}
                      href={`/shop/${c.slug}`}
                      className="text-xs text-forest-muted hover:text-terracotta py-1"
                    >
                      • {c.name}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/room-studio/planner"
                  className="block py-2.5 text-base font-semibold text-forest-deep border-b border-borderSage/40"
                >
                  2D Room Planner
                </Link>
                <Link
                  href="/room-studio/visualizer"
                  className="block py-2.5 text-base font-semibold text-forest-deep border-b border-borderSage/40"
                >
                  Photo Room Visualizer
                </Link>
                <Link
                  href="/style-quiz"
                  className="block py-2.5 text-base font-semibold text-forest-deep border-b border-borderSage/40"
                >
                  Style Quiz
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block py-2.5 text-base font-semibold text-forest-deep border-b border-borderSage/40"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/compare"
                  className="block py-2 text-sm font-semibold text-forest-deep"
                >
                  Product Comparison ({comparisonItems.length})
                </Link>
                <Link
                  href={isLoggedIn ? "/account" : "/account/login"}
                  className="block py-2 text-sm font-semibold text-terracotta"
                >
                  {isLoggedIn ? `Account (${user?.name})` : "Sign In / Register"}
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
