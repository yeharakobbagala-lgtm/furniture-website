"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, ArrowRight, Building2 } from "lucide-react";
import { useUserStore } from "@/stores/userStore";

export default function RegisterPage() {
  const router = useRouter();
  const login = useUserStore((s) => s.login);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCommercial, setIsCommercial] = useState(false);
  const [companyName, setCompanyName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || "client@studio.com", fullName || "New Client", companyName, isCommercial);
    router.push("/account");
  };

  return (
    <div className="min-h-screen bg-sage-light py-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md glass-surface rounded-3xl border border-white/75 bg-white/85 backdrop-blur-3xl p-8 sm:p-10 shadow-floating space-y-6 animate-fadeIn">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl glass-cta-orange text-white flex items-center justify-center mx-auto shadow-soft border border-white/40">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-forest-deep">
            Create Client Profile
          </h1>
          <p className="text-xs text-forest-muted">
            Join Square for bespoke furniture curation and trade privileges.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Elena Rostova"
              className="w-full bg-white border border-borderSage rounded-xl px-3.5 py-2.5 text-xs text-forest-deep focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full bg-white border border-borderSage rounded-xl px-3.5 py-2.5 text-xs text-forest-deep focus:outline-none"
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
              className="w-full bg-white border border-borderSage rounded-xl px-3.5 py-2.5 text-xs text-forest-deep focus:outline-none"
            />
          </div>

          {/* Account Typology */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-forest-deep">
              <input
                type="checkbox"
                checked={isCommercial}
                onChange={(e) => setIsCommercial(e.target.checked)}
                className="w-4 h-4 accent-terracotta rounded"
              />
              Register as Commercial / Contract Entity
            </label>
          </div>

          {isCommercial && (
            <div>
              <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                Company / Studio Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Sterling Architecture Ltd"
                className="w-full bg-white border border-borderSage rounded-xl px-3.5 py-2.5 text-xs text-forest-deep focus:outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-forest-dark hover:bg-forest-deep text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-soft transition-colors"
          >
            Create Profile <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-borderSage/70 text-center text-xs text-forest-muted">
          <span>Already registered? </span>
          <Link href="/account/login" className="text-terracotta font-bold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
