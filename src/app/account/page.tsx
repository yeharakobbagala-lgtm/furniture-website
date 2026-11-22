"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  Heart,
  Layers,
  MapPin,
  Compass,
  LogOut,
  ArrowRight,
  Building2,
  Clock,
  Sparkles,
} from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";

export default function AccountDashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { isLoggedIn, user, customerType, orders, addresses, savedDesigns, styleQuizResult, logout } =
    useUserStore();
  const wishlistItems = useWishlistStore((s) => s.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-sage-light py-20 text-center text-forest-deep">
        Loading account profile...
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-sage-light py-20">
        <div className="max-w-md mx-auto px-4 text-center space-y-4 bg-ivory-warm rounded-3xl border border-borderSage p-8 shadow-soft">
          <div className="w-14 h-14 rounded-full bg-sage-100 text-forest-deep flex items-center justify-center mx-auto">
            <User className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-forest-deep">
            Client Sign In Required
          </h2>
          <p className="text-sm text-forest-muted">
            Access your order history, saved room layouts, and personalized interior quiz results.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/account/login"
              className="w-full py-3 rounded-xl bg-forest-dark hover:bg-forest-deep text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Sign In to Account
            </Link>
            <Link
              href="/account/register"
              className="w-full py-3 rounded-xl border border-borderSage bg-white hover:bg-sage-100 text-forest-deep text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Create Client Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-light py-12">
      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
        {/* Profile Header */}
        <div className="bg-ivory-warm rounded-3xl border border-borderSage p-6 sm:p-10 shadow-soft mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-forest-dark text-white flex items-center justify-center font-heading font-extrabold text-2xl shadow-soft shrink-0">
              {user?.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-heading font-extrabold text-forest-deep">
                  {user?.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-forest-deep text-white text-[10px] font-bold uppercase">
                  {customerType === "commercial" ? "Commercial Partner" : "Residential Client"}
                </span>
              </div>
              <p className="text-xs text-forest-muted mt-0.5">{user?.email}</p>
              {user?.companyName && (
                <p className="text-xs font-semibold text-terracotta mt-0.5 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" /> {user.companyName}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              router.push("/account/login");
            }}
            className="px-4 py-2 rounded-xl border border-borderSage bg-white hover:bg-sage-100 text-forest-deep text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-forest-muted" /> Sign Out
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <Link
            href="/account/orders"
            className="p-5 rounded-2xl bg-white border border-borderSage hover:border-forest-dark/40 shadow-soft transition-all space-y-1"
          >
            <Package className="w-5 h-5 text-terracotta mb-2" />
            <span className="text-2xl font-heading font-extrabold text-forest-deep block">
              {orders.length}
            </span>
            <span className="text-xs text-forest-muted font-medium">Orders in Production</span>
          </Link>

          <Link
            href="/wishlist"
            className="p-5 rounded-2xl bg-white border border-borderSage hover:border-forest-dark/40 shadow-soft transition-all space-y-1"
          >
            <Heart className="w-5 h-5 text-terracotta mb-2" />
            <span className="text-2xl font-heading font-extrabold text-forest-deep block">
              {wishlistItems.length}
            </span>
            <span className="text-xs text-forest-muted font-medium">Saved Wishlist Pieces</span>
          </Link>

          <Link
            href="/room-studio/planner"
            className="p-5 rounded-2xl bg-white border border-borderSage hover:border-forest-dark/40 shadow-soft transition-all space-y-1"
          >
            <Layers className="w-5 h-5 text-terracotta mb-2" />
            <span className="text-2xl font-heading font-extrabold text-forest-deep block">
              {savedDesigns.length}
            </span>
            <span className="text-xs text-forest-muted font-medium">Saved 2D Room Layouts</span>
          </Link>

          <Link
            href="/style-quiz"
            className="p-5 rounded-2xl bg-white border border-borderSage hover:border-forest-dark/40 shadow-soft transition-all space-y-1"
          >
            <Compass className="w-5 h-5 text-terracotta mb-2" />
            <span className="text-sm font-heading font-extrabold text-forest-deep block truncate">
              {styleQuizResult ? styleQuizResult.style : "Not Taken"}
            </span>
            <span className="text-xs text-forest-muted font-medium">Interior Style Result</span>
          </Link>
        </div>

        {/* Orders & Saved Designs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Orders (7 cols) */}
          <div className="lg:col-span-7 bg-ivory-warm rounded-3xl border border-borderSage p-6 sm:p-8 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-borderSage/70">
              <h2 className="font-heading font-extrabold text-lg text-forest-deep">
                Recent Orders
              </h2>
              <Link href="/account/orders" className="text-xs font-bold text-terracotta hover:underline">
                View all orders →
              </Link>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-forest-muted italic py-6 text-center">
                No orders placed yet.
              </p>
            ) : (
              orders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl bg-white border border-borderSage space-y-3"
                >
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-forest-deep">{order.orderNumber}</span>
                      <span className="text-forest-muted ml-2">{order.date}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-sage-100 text-forest-deep font-bold">
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-borderSage/50 text-xs">
                    <span className="text-forest-muted">
                      {order.items.length} piece(s) • Total: {formatPrice(order.total)}
                    </span>
                    <span className="text-terracotta font-semibold">
                      Est: {order.estimatedDelivery}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Saved Room Designs (5 cols) */}
          <div className="lg:col-span-5 bg-ivory-warm rounded-3xl border border-borderSage p-6 sm:p-8 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-borderSage/70">
              <h2 className="font-heading font-extrabold text-lg text-forest-deep">
                Saved 2D Room Concepts
              </h2>
              <Link href="/room-studio/planner" className="text-xs font-bold text-terracotta hover:underline">
                Open Studio →
              </Link>
            </div>

            {savedDesigns.length === 0 ? (
              <p className="text-xs text-forest-muted italic py-6 text-center">
                No designs saved yet. Launch the 2D Studio to layout furniture.
              </p>
            ) : (
              savedDesigns.map((design) => (
                <div
                  key={design.id}
                  className="p-4 rounded-2xl bg-white border border-borderSage space-y-1"
                >
                  <h4 className="font-heading font-bold text-sm text-forest-deep">
                    {design.name}
                  </h4>
                  <p className="text-[11px] text-forest-muted">
                    {design.roomType} • {design.itemCount} pieces arranged
                  </p>
                  <div className="pt-2 flex justify-between items-center text-xs">
                    <span className="text-forest-muted">{design.date}</span>
                    <Link
                      href="/room-studio/planner"
                      className="text-terracotta font-semibold hover:underline"
                    >
                      Resume Editing
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
