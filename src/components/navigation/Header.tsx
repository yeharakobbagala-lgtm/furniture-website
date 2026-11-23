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
  ChevronRight,
  ArrowRight,
  Palette,
  BookOpen,
  Info,
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
            <div className="flex items-center gap-2 min-[360px]:gap-4 sm:gap-6 shrink-0">
              <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                <div className="w-7.5 h-7.5 min-[360px]:w-8.5 min-[360px]:h-8.5 sm:w-9.5 sm:h-9.5 rounded-xl bg-forest-dark flex items-center justify-center text-ivory shadow-soft group-hover:bg-forest-deep transition-colors shrink-0">
                  <svg
                    width="18"
                    height="18"
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
                  <span className="font-heading font-extrabold text-[15px] min-[360px]:text-lg sm:text-xl tracking-wider text-forest-deep leading-none">
                    SQUARE
                  </span>
                  <span className="text-[7.5px] min-[360px]:text-[9px] sm:text-[10px] uppercase tracking-[0.16em] min-[360px]:tracking-[0.22em] text-forest-muted font-medium leading-tight mt-0.5 whitespace-nowrap">
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

            {/* Right: Search, Comparison, Wishlist, Cart, Account, Mobile Menu Toggle */}
            <div className="flex items-center gap-1 sm:gap-2 xl:gap-2.5 shrink-0">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search furniture"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-forest-deep transition-all duration-300 bg-white/55 hover:bg-white/75 backdrop-blur-md shadow-[0_2px_8px_rgba(20,55,35,0.03),inset_0_1px_1.5px_rgba(255,255,255,0.7)] hover:scale-105 border border-white/60 hover:border-white/80 active:scale-95"
              >
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Compare Button */}
              {mounted && comparisonItems.length > 0 && (
                <Link
                  href="/compare"
                  aria-label="Product comparison"
                  className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-forest-deep transition-all duration-300 bg-white/55 hover:bg-white/75 backdrop-blur-md shadow-[0_2px_8px_rgba(20,55,35,0.03),inset_0_1px_1.5px_rgba(255,255,255,0.7)] hover:scale-105 border border-white/60 hover:border-white/80 hidden md:flex"
                >
                  <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-forest-dark text-white text-[9px] font-bold flex items-center justify-center">
                    {comparisonItems.length}
                  </span>
                </Link>
              )}

              {/* Wishlist Button (Always visible on mobile & desktop) */}
              <Link
                href="/wishlist"
                aria-label="Saved products"
                className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-forest-deep transition-all duration-300 bg-white/55 hover:bg-white/75 backdrop-blur-md shadow-[0_2px_8px_rgba(20,55,35,0.03),inset_0_1px_1.5px_rgba(255,255,255,0.7)] hover:scale-105 border border-white/60 hover:border-white/80 active:scale-95"
              >
                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
                className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-forest-deep transition-all duration-300 bg-white/55 hover:bg-white/75 backdrop-blur-md shadow-[0_2px_8px_rgba(20,55,35,0.03),inset_0_1px_1.5px_rgba(255,255,255,0.7)] hover:scale-105 border border-white/60 hover:border-white/80 active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {mounted && cartItemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#183323] text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Account / Login - Desktop only, available in mobile drawer */}
              <Link
                href={isLoggedIn ? "/account" : "/account/login"}
                aria-label="Customer account"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-forest-deep transition-all duration-300 bg-white/55 hover:bg-white/75 backdrop-blur-md shadow-[0_2px_8px_rgba(20,55,35,0.03),inset_0_1px_1.5px_rgba(255,255,255,0.7)] hover:scale-105 border border-white/60 hover:border-white/80 hidden lg:flex"
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center hover:bg-white/45 text-forest-deep transition-all duration-300 lg:hidden border border-white/60 bg-white/25 backdrop-blur-md active:scale-95 shadow-[0_2px_8px_rgba(20,55,35,0.03),inset_0_1px_1.5px_rgba(255,255,255,0.7)]"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer - Apple Liquid Glass Design */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 max-w-[1850px] mx-auto pointer-events-auto px-1 sm:px-2">
            <div className="relative overflow-hidden p-5 sm:p-6 rounded-[32px] bg-gradient-to-b from-white/80 via-white/60 to-white/45 backdrop-blur-3xl border border-white/85 shadow-[0_20px_50px_rgba(23,60,43,0.12),inset_0_1.5px_2px_rgba(255,255,255,0.95),inset_0_-1px_2px_rgba(0,0,0,0.03)] space-y-3.5 animate-fadeIn">
              {/* Internal Liquid Glass Ambient Refraction Orbs */}
              <div className="absolute -top-14 -right-14 w-44 h-44 rounded-full bg-[#E0A97E]/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-14 -left-14 w-44 h-44 rounded-full bg-[#8EB497]/25 blur-3xl pointer-events-none" />

              <div className="space-y-1 relative z-10">
                {/* 1. All Furniture */}
                <div className="rounded-2xl transition-all">
                  <Link
                    href="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2.5 px-3 rounded-2xl hover:bg-white/50 active:bg-white/70 active:scale-[0.99] transition-all group border-b border-borderSage/25"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/75 backdrop-blur-md border border-white/90 shadow-[0_2px_6px_rgba(23,60,43,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] flex items-center justify-center text-[#173C2B]">
                        <Layers className="w-4 h-4 text-[#173C2B]" />
                      </div>
                      <span className="text-[15px] font-bold text-[#173C2B]">All Furniture</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#587763]/70 group-hover:text-[#173C2B] group-hover:translate-x-0.5 transition-all" />
                  </Link>

                  {/* Category Frosted Glass Mini-Pills */}
                  <div className="pl-11 pr-2 py-2 flex flex-wrap gap-1.5 border-b border-borderSage/25 mb-1">
                    {categories.slice(0, 6).map((c) => (
                      <Link
                        key={c.id}
                        href={`/shop/${c.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-2.5 py-1 rounded-xl bg-white/50 hover:bg-white/80 active:scale-95 border border-white/80 text-[11px] font-semibold text-[#173C2B] backdrop-blur-md shadow-[0_1px_4px_rgba(0,0,0,0.02),inset_0_1px_1px_rgba(255,255,255,0.9)] transition-all"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* 2. 2D Room Planner */}
                <Link
                  href="/room-studio/planner"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-2xl hover:bg-white/50 active:bg-white/70 active:scale-[0.99] transition-all group border-b border-borderSage/25"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#E5F0E1] backdrop-blur-md border border-white/90 shadow-[0_2px_6px_rgba(23,60,43,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] flex items-center justify-center text-[#173C2B]">
                      <Compass className="w-4 h-4 text-[#173C2B]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-bold text-[#173C2B]">2D Room Planner</span>
                      <span className="text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-[#173C2B] text-white shadow-2xs">
                        PRO CAD
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#587763]/70 group-hover:text-[#173C2B] group-hover:translate-x-0.5 transition-all" />
                </Link>

                {/* 3. Photo Room Visualizer */}
                <Link
                  href="/room-studio/visualizer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-2xl hover:bg-white/50 active:bg-white/70 active:scale-[0.99] transition-all group border-b border-borderSage/25"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#FBF0E6] backdrop-blur-md border border-white/90 shadow-[0_2px_6px_rgba(23,60,43,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] flex items-center justify-center text-[#B85232]">
                      <Sparkles className="w-4 h-4 text-[#B85232]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-bold text-[#173C2B]">Photo Room Visualizer</span>
                      <span className="text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-[#B85232] text-white shadow-2xs">
                        AI STUDIO
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#587763]/70 group-hover:text-[#173C2B] group-hover:translate-x-0.5 transition-all" />
                </Link>

                {/* 4. Style Quiz */}
                <Link
                  href="/style-quiz"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-2xl hover:bg-white/50 active:bg-white/70 active:scale-[0.99] transition-all group border-b border-borderSage/25"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/75 backdrop-blur-md border border-white/90 shadow-[0_2px_6px_rgba(23,60,43,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] flex items-center justify-center text-[#173C2B]">
                      <Palette className="w-4 h-4 text-[#173C2B]" />
                    </div>
                    <span className="text-[15px] font-bold text-[#173C2B]">Style Quiz</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#587763]/70 group-hover:text-[#173C2B] group-hover:translate-x-0.5 transition-all" />
                </Link>

                {/* 5. Editorial & Brand Links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2.5 px-3 rounded-2xl hover:bg-white/50 active:bg-white/70 active:scale-[0.99] transition-all group border-b border-borderSage/25"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/75 backdrop-blur-md border border-white/90 shadow-[0_2px_6px_rgba(23,60,43,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] flex items-center justify-center text-[#173C2B]">
                        {link.label === "Designers" && <Compass className="w-4 h-4 text-[#173C2B]" />}
                        {link.label === "Trends" && <Sparkles className="w-4 h-4 text-[#173C2B]" />}
                        {link.label === "Blog" && <BookOpen className="w-4 h-4 text-[#173C2B]" />}
                        {link.label === "About Us" && <Info className="w-4 h-4 text-[#173C2B]" />}
                      </div>
                      <span className="text-[15px] font-bold text-[#173C2B]">{link.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#587763]/70 group-hover:text-[#173C2B] group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}

                {/* 6. Product Comparison */}
                <Link
                  href="/compare"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-2xl hover:bg-white/50 active:bg-white/70 active:scale-[0.99] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/75 backdrop-blur-md border border-white/90 shadow-[0_2px_6px_rgba(23,60,43,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] flex items-center justify-center text-[#173C2B]">
                      <Scale className="w-4 h-4 text-[#173C2B]" />
                    </div>
                    <span className="text-[14.5px] font-bold text-[#173C2B]">Product Comparison</span>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/70 text-[#173C2B] border border-white/80 shadow-2xs">
                    {comparisonItems.length}
                  </span>
                </Link>

                {/* 7. Sign In / Account Button (Apple Liquid Glass Accent Pill) */}
                <Link
                  href={isLoggedIn ? "/account" : "/account/login"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2.5 flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#D94D1E] via-[#CD4416] to-[#B83E14] text-white shadow-[0_8px_22px_rgba(217,77,30,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.45)] border border-white/30 active:scale-[0.99] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[14px] font-bold tracking-wide">
                      {isLoggedIn ? `Account (${user?.name})` : "Sign In / Register"}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/90 group-hover:translate-x-0.5 transition-transform" />
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
