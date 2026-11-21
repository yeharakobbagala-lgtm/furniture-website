"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Home, ArrowRight } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { useCommercialQuoteStore } from "@/stores/commercialQuoteStore";

export default function CommercialModeBanner() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mounted, setMounted] = useState(false);
  const { customerType, setCustomerType } = useUserStore();
  const quoteItems = useCommercialQuoteStore((s) => s.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  // On homepage, only show banner if actively in commercial mode to keep hero 100% full screen
  if (isHome && customerType !== "commercial") return null;

  return (
    <div className="bg-forest-deep text-sage-50 text-xs py-2 px-4 border-b border-forest/30 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-forest-dark text-sage-200 font-medium">
            {customerType === "commercial" ? (
              <>
                <Building2 className="w-3.5 h-3.5 text-terracotta" /> Commercial / Trade Mode
              </>
            ) : (
              <>
                <Home className="w-3.5 h-3.5 text-sage-300" /> Residential Client
              </>
            )}
          </span>
          <span className="hidden md:inline text-sage-300">
            {customerType === "commercial"
              ? "Furnishing hotels, offices, restaurants & commercial developments."
              : "Bespoke furnishings and tactile comfort for private residences."}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {customerType === "commercial" && quoteItems.length > 0 && (
            <Link
              href="/commercial/quote"
              className="text-terracotta font-semibold hover:underline flex items-center gap-1"
            >
              Quote Draft ({quoteItems.length} items) <ArrowRight className="w-3 h-3" />
            </Link>
          )}

          <div className="flex items-center rounded-lg bg-forest/40 p-0.5 border border-forest/50">
            <button
              onClick={() => setCustomerType("residential")}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                customerType === "residential"
                  ? "bg-sage-light text-forest-deep shadow-sm"
                  : "text-sage-300 hover:text-white"
              }`}
            >
              Residential
            </button>
            <button
              onClick={() => setCustomerType("commercial")}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                customerType === "commercial"
                  ? "bg-terracotta text-white shadow-sm"
                  : "text-sage-300 hover:text-white"
              }`}
            >
              Commercial & Trade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
