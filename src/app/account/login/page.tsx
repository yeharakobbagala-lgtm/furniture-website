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
    <div className="min-h-screen bg-sage-light py-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-ivory-warm rounded-3xl border border-borderSage p-8 sm:p-10 shadow-card space-y-6 animate-fadeIn">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-forest-dark text-white flex items-center justify-center mx-auto shadow-soft">
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
        <div className="p-3.5 rounded-2xl bg-sage-50 border border-borderSage space-y-2 text-xs">
          <span className="font-bold text-forest-deep block text-center">
            Fast Demo Login Options:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDemoResidential}
              className="py-2 px-2.5 rounded-xl bg-forest-dark hover:bg-forest-deep text-white font-bold text-[11px] transition-colors"
            >
              Residential Client
            </button>
            <button
              onClick={handleDemoCommercial}
              className="py-2 px-2.5 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white font-bold text-[11px] transition-colors"
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
              className="w-full bg-white border border-borderSage rounded-xl px-3.5 py-2.5 text-xs text-forest-deep focus:outline-none focus:border-forest-dark"
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
              className="w-full bg-white border border-borderSage rounded-xl px-3.5 py-2.5 text-xs text-forest-deep focus:outline-none focus:border-forest-dark"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-forest-dark hover:bg-forest-deep text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-soft transition-colors"
          >
            Sign In <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-borderSage/70 text-center text-xs text-forest-muted">
          <span>Don&apos;t have an atelier account? </span>
          <Link href="/account/register" className="text-terracotta font-bold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
