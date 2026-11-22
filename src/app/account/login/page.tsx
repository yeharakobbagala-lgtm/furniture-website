"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, ArrowRight, Building2 } from "lucide-react";
import { useUserStore } from "@/stores/userStore";

export default function LoginPage() {
  const router = useRouter();
  const login = useUserStore((s) => s.login);

  const [email, setEmail] = useState("alexander.wright@studio.com");
  const [password, setPassword] = useState("••••••••");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, "Alexander Wright", undefined, false);
    router.push("/account");
  };

  const handleDemoResidential = () => {
    login("alexander.wright@studio.com", "Alexander Wright", undefined, false);
    router.push("/account");
  };

  const handleDemoCommercial = () => {
    login("m.sterling@luminaryhotels.com", "Marcus Sterling", "Luminary Hospitality Group", true);
    router.push("/commercial");
  };

  return (
    <div className="min-h-screen bg-sage-light py-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md glass-surface rounded-3xl border border-white/75 bg-white/85 backdrop-blur-3xl p-8 sm:p-10 shadow-floating space-y-6 animate-fadeIn">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl glass-pill-forest text-white flex items-center justify-center mx-auto shadow-soft border border-white/40">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-forest-deep">
            Client Sign In
          </h1>
          <p className="text-xs text-forest-muted">
            Access your order tracking, saved room layouts, and quotes.
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="p-4 rounded-2xl glass-surface-subtle border border-white/70 space-y-2 text-xs">
          <span className="font-extrabold text-forest-deep block text-center">
            Fast Demo Login Options:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDemoResidential}
              className="py-2.5 px-3 rounded-xl glass-pill-forest text-white font-bold text-[11px] transition-all hover:scale-105"
            >
              Residential Client
            </button>
            <button
              onClick={handleDemoCommercial}
              className="py-2.5 px-3 rounded-xl glass-cta-orange text-white font-bold text-[11px] transition-all hover:scale-105"
            >
              Commercial / Trade
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass-input rounded-2xl px-4 py-2.5 text-xs text-forest-deep focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full glass-input rounded-2xl px-4 py-2.5 text-xs text-forest-deep focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-full glass-cta-orange text-white text-xs font-heading font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-floating transition-all hover:scale-[1.02]"
          >
            Sign In <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-borderSage/40 text-center text-xs text-forest-muted">
          <span>Don&apos;t have an atelier account? </span>
          <Link href="/account/register" className="text-terracotta font-bold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
