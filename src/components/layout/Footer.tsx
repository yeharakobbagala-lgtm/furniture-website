"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { categories } from "@/data/categories";

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

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
    <footer className="glass-surface-forest text-sage-50 border-t border-white/20 pt-20 pb-14 w-full relative overflow-hidden select-none">
      {/* Top Specular Rim Highlight */}
      <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
      {/* Ambient Glow */}
      <div className="absolute -top-40 left-1/3 w-[600px] h-[300px] bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20 relative z-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/15">
          {/* Brand & Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl glass-pill bg-white text-forest-deep flex items-center justify-center font-bold shadow-soft border border-white/80">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
                  <path d="M9 21V12h6v9" />
                </svg>
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-wider text-white">
                SQUARE
              </span>
            </div>
            <p className="text-sage-300 text-sm leading-relaxed max-w-sm">
              Square creates furniture for mindful living. We partner with master European joiners and textile weavers to build heirlooms of serene architectural proportions.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <h4 className="text-xs uppercase tracking-widest font-bold text-white mb-2">
                Join the Private Circle
              </h4>
              <p className="text-xs text-sage-300 mb-3">
                Receive private showroom releases, architectural interviews, and trade invitations.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-sage-200 glass-pill-forest p-3.5 rounded-2xl border border-white/30">
                  <CheckCircle2 className="w-4 h-4 text-terracotta" />
                  <span>Welcome. Check your inbox for our seasonal editorial journal.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 text-sage-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={newsletterEmail}
                        onChange={(e) => {
                          setNewsletterEmail(e.target.value);
                          if (error) setError("");
                        }}
                        placeholder="Enter your email address"
                        className="w-full bg-white/10 text-white placeholder:text-sage-400 text-xs rounded-full pl-10 pr-4 py-3 border border-white/20 focus:outline-none focus:border-white/50 backdrop-blur-md transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-3 rounded-full glass-cta-orange text-white text-xs font-heading font-extrabold tracking-wider uppercase transition-all shadow-soft flex items-center gap-1.5 shrink-0 hover:scale-105"
                    >
                      Subscribe <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {error && <p className="text-xs text-red-300 pl-1">{error}</p>}
                </form>
              )}
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-sage-300">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/shop/${cat.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/shop" className="text-terracotta hover:underline font-semibold">
                  All 10 Categories →
                </Link>
              </li>
            </ul>
          </div>

          {/* Room Studio & Tools */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white mb-4">
              Room Studio
            </h4>
            <ul className="space-y-2.5 text-xs text-sage-300">
              <li>
                <Link href="/room-studio/planner" className="hover:text-white transition-colors">
                  2D Room Planner
                </Link>
              </li>
              <li>
                <Link href="/room-studio/visualizer" className="hover:text-white transition-colors">
                  Photo Room Visualizer
                </Link>
              </li>
              <li>
                <Link href="/style-quiz" className="hover:text-white transition-colors">
                  Furniture Style Quiz
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  Product Comparison
                </Link>
              </li>
              <li>
                <Link href="/commercial" className="hover:text-white transition-colors">
                  Commercial & Contract
                </Link>
              </li>
              <li>
                <Link href="/commercial/quote" className="hover:text-white transition-colors">
                  RFQ Quotation Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Company */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white mb-4">
              Square Atelier
            </h4>
            <ul className="space-y-2.5 text-xs text-sage-300">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Our Craft
                </Link>
              </li>
              <li>
                <Link href="/designers" className="hover:text-white transition-colors">
                  Designer Directory
                </Link>
              </li>
              <li>
                <Link href="/trends" className="hover:text-white transition-colors">
                  Seasonal Trends
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Journal & Care Guides
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Client Concierge & Showrooms
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Customer Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sage-400">
          <p>© {new Date().getFullYear()} Square – Furniture & Living. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-sage-200 transition-colors">
              Sustainability & FSC
            </Link>
            <Link href="/contact" className="hover:text-sage-200 transition-colors">
              Care Warranty
            </Link>
            <Link href="/about" className="hover:text-sage-200 transition-colors">
              Terms & Living
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
