"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Sparkles,
  TreePine,
  Instagram,
  Compass,
} from "lucide-react";
import { categories } from "@/data/categories";

export default function Footer() {
  const pathname = usePathname();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  if (pathname?.startsWith("/room-studio")) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !/^\S+@\S+\.\S+$/.test(newsletterEmail)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setSubscribed(true);
    setNewsletterEmail("");
  };

  return (
    <footer className="glass-surface-forest bg-[#102319] text-sage-50 border-t border-white/15 pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-12 w-full relative overflow-hidden select-none">
      {/* Top Specular Rim Highlight */}
      <div className="absolute top-0 left-6 right-6 sm:left-12 sm:right-12 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />
      {/* Ambient Forest Glow */}
      <div className="absolute -top-32 left-1/4 w-[450px] sm:w-[650px] h-[300px] bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">
        {/* Main Grid: Mobile Stacks neatly, Desktop splits Left (Brand + Newsletter) / Right (Navigation Links) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pb-12 sm:pb-16 border-b border-white/15">
          {/* Brand Manifesto & Newsletter Section */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-6">
            {/* Brand Logo & Tagline */}
            <div className="space-y-3">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-white text-forest-deep flex items-center justify-center font-bold shadow-soft border border-white/80 group-hover:scale-105 transition-transform">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
                    <path d="M9 21V12h6v9" />
                  </svg>
                </div>
                <div>
                  <span className="font-heading font-extrabold text-2xl tracking-wider text-white block leading-none">
                    SQUARE
                  </span>
                  <span className="text-[10px] tracking-widest uppercase font-semibold text-terracotta">
                    Furniture & Living
                  </span>
                </div>
              </Link>

              <p className="text-sage-300 text-xs sm:text-sm leading-relaxed max-w-md">
                Creating serene heirlooms of mindful proportions. Handcrafted in partnership with master European joiners and textile artisans using sustainable FSC-certified solid timbers.
              </p>
            </div>

            {/* Atelier Value Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-sage-200">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <TreePine className="w-3.5 h-3.5 text-emerald-400" />
                100% FSC Solid Timber
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-terracotta" />
                10-Year Craft Warranty
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Direct Atelier Pricing
              </span>
            </div>

            {/* Newsletter Subscription Box */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] uppercase tracking-widest font-bold text-white">
                  Join the Private Circle
                </span>
                <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-terracotta/20 text-terracotta font-bold border border-terracotta/30">
                  Exclusive
                </span>
              </div>
              <p className="text-xs text-sage-300 mb-3 max-w-sm">
                Receive private showroom releases, architectural interviews, and bespoke trade privileges.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-sage-100 bg-white/10 p-3.5 rounded-2xl border border-white/20 backdrop-blur-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Welcome to the circle. Check your inbox for our seasonal editorial journal.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-1.5 max-w-md">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
                    <div className="relative flex-1 min-w-0">
                      <Mail className="w-4 h-4 text-sage-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={newsletterEmail}
                        onChange={(e) => {
                          setNewsletterEmail(e.target.value);
                          if (error) setError("");
                        }}
                        placeholder="Enter your email address"
                        className="w-full bg-white/10 text-white placeholder:text-sage-400 text-xs rounded-full pl-10 pr-4 py-3 border border-white/20 focus:outline-none focus:border-white/50 backdrop-blur-md transition-all shadow-inner"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-3 rounded-full bg-gradient-to-r from-terracotta to-[#e25a2b] hover:brightness-110 active:scale-95 text-white text-xs font-heading font-extrabold tracking-wider uppercase transition-all shadow-soft flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <span>Subscribe</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {error && <p className="text-xs text-red-300 pl-1">{error}</p>}
                </form>
              )}
            </div>
          </div>

          {/* Navigation Links Grid: 2 columns on mobile, 3 columns on sm/md/lg */}
          <div className="lg:col-span-7 xl:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10 pt-4 lg:pt-0">
            {/* Column 1: Collections */}
            <div>
              <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                Collections
              </h4>
              <ul className="space-y-2.5 text-xs text-sage-300">
                {categories.slice(0, 6).map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/shop/${cat.slug}`}
                      className="hover:text-white transition-colors py-1 inline-block"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
                <li className="pt-1">
                  <Link
                    href="/shop"
                    className="text-terracotta hover:text-white transition-colors font-semibold inline-flex items-center gap-1"
                  >
                    All 10 Collections <ArrowRight className="w-3 h-3" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Room Studio & Interactive CAD */}
            <div>
              <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Room Studio
              </h4>
              <ul className="space-y-2.5 text-xs text-sage-300">
                <li>
                  <Link
                    href="/room-studio/planner"
                    className="hover:text-white transition-colors py-1 inline-block"
                  >
                    2D Room Planner
                  </Link>
                </li>
                <li>
                  <Link
                    href="/room-studio/visualizer"
                    className="hover:text-white transition-colors py-1 inline-block"
                  >
                    Photo Room Visualizer
                  </Link>
                </li>
                <li>
                  <Link
                    href="/style-quiz"
                    className="hover:text-white transition-colors py-1 inline-block"
                  >
                    Interior Style Quiz
                  </Link>
                </li>
                <li>
                  <Link
                    href="/compare"
                    className="hover:text-white transition-colors py-1 inline-block"
                  >
                    Product Comparison
                  </Link>
                </li>
                <li>
                  <Link
                    href="/commercial"
                    className="hover:text-white transition-colors py-1 inline-block"
                  >
                    Commercial & Contract
                  </Link>
                </li>
                <li>
                  <Link
                    href="/commercial/quote"
                    className="hover:text-white transition-colors py-1 inline-block"
                  >
                    RFQ Quotation Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Atelier & Heritage */}
            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Square Atelier
              </h4>
              <ul className="space-y-2.5 text-xs text-sage-300">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors py-1 inline-block"
                  >
                    About Our Craft
                  </Link>
                </li>
                <li>
                  <Link
                    href="/designers"
                    className="hover:text-white transition-colors py-1 inline-block"
                  >
                    Designer Directory
                  </Link>
                </li>
                <li>
                  <Link
                    href="/trends"
                    className="hover:text-white transition-colors py-1 inline-block"
                  >
                    Seasonal Trends
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-white transition-colors py-1 inline-block"
                  >
                    Journal & Care Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors py-1 inline-block"
                  >
                    Showrooms & Concierge
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account"
                    className="hover:text-white transition-colors py-1 inline-block"
                  >
                    Customer Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-sage-400 text-center md:text-left">
          <p>© 2026 SQUARE – Furniture & Living. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-sage-300">
            <Link href="/about" className="hover:text-white transition-colors">
              Sustainability & FSC
            </Link>
            <span className="text-white/20 hidden sm:inline">•</span>
            <Link href="/contact" className="hover:text-white transition-colors">
              Care Warranty
            </Link>
            <span className="text-white/20 hidden sm:inline">•</span>
            <Link href="/about" className="hover:text-white transition-colors">
              Privacy & Cookies
            </Link>
            <span className="text-white/20 hidden sm:inline">•</span>
            <Link href="/about" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
