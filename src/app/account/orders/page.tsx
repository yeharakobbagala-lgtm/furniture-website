"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, ArrowLeft, ArrowRight, Truck, CheckCircle } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { formatPrice } from "@/lib/utils";

export default function OrderHistoryPage() {
  const [mounted, setMounted] = useState(false);
  const orders = useUserStore((s) => s.orders);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-sage-light py-20 text-center text-forest-deep">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-light py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/account"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-deep hover:text-terracotta uppercase tracking-wider mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Account Dashboard
        </Link>

        <div className="flex items-center justify-between pb-8 border-b border-borderSage/70 mb-8">
          <div>
            <h1 className="text-3xl font-heading font-extrabold text-forest-deep">
              Order History ({orders.length})
            </h1>
            <p className="text-xs text-forest-muted mt-1">
              Track manufacturing, crate dispatch, and white-glove arrival appointments.
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="py-20 text-center bg-ivory-warm rounded-3xl border border-borderSage p-8 space-y-4">
            <Package className="w-12 h-12 text-forest-muted mx-auto" />
            <h3 className="text-lg font-heading font-bold text-forest-deep">
              No previous orders found
            </h3>
            <p className="text-xs text-forest-muted">
              Any pieces ordered through the checkout will be tracked here.
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-2.5 rounded-xl bg-forest-dark text-white text-xs font-bold uppercase"
            >
              Explore Furniture
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-ivory-warm rounded-3xl border border-borderSage p-6 sm:p-8 shadow-soft space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-borderSage/70 gap-2">
                  <div>
                    <span className="text-xs uppercase font-bold text-terracotta">
                      {order.orderNumber}
                    </span>
                    <p className="text-xs text-forest-muted">Placed on {order.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-forest-dark text-white text-xs font-bold">
                      {order.status}
                    </span>
                    <span className="text-lg font-extrabold text-forest-deep">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-xl bg-sage-50 overflow-hidden shrink-0 border border-borderSage">
                          <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                        </div>
                        <div>
                          <p className="font-heading font-bold text-sm text-forest-deep">{item.name}</p>
                          <p className="text-forest-muted">{item.color} • Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-forest-deep">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Delivery destination */}
                <div className="pt-4 border-t border-borderSage/60 flex flex-col sm:flex-row justify-between text-xs text-forest-muted gap-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-forest-deep" />
                    <span>Estimated White-Glove Arrival: <strong className="text-forest-deep">{order.estimatedDelivery}</strong></span>
                  </div>
                  <span className="text-forest-deep font-semibold">
                    Destination: {order.shippingAddress.city}, {order.shippingAddress.state}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
