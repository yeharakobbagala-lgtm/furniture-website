import React, { Suspense } from "react";
import ShopClient from "@/components/shop/ShopClient";

export const metadata = {
  title: "Shop All Furniture — Square Furniture & Living",
  description: "Browse contemporary, Scandinavian, and minimalist architectural furniture.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-sage-light py-20 text-center text-forest-deep">Loading collection...</div>}>
      <ShopClient />
    </Suspense>
  );
}
