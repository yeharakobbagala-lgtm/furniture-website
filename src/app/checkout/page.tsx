"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
  Building,
  User,
  MapPin,
  ChevronRight,
  Lock,
  Package,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useUserStore, MockOrder } from "@/stores/userStore";
import { formatPrice } from "@/lib/utils";

type CheckoutStep = 1 | 2 | 3 | 4 | 5 | 6;

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);

  // Cart Store
  const {
    items,
    deliveryMethod,
    setDeliveryMethod,
    getSubtotal,
    getDeliveryFee,
    getDiscountAmount,
    getTotal,
    clearCart,
  } = useCartStore();

  // User Store
  const { isLoggedIn, user, addresses, addOrder } = useUserStore();

  // Step 1: Customer Info
  const [email, setEmail] = useState(user?.email || "alexander.wright@studio.com");
  const [firstName, setFirstName] = useState("Alexander");
  const [lastName, setLastName] = useState("Wright");
  const [phone, setPhone] = useState("+1 (555) 349-2810");

  // Step 2: Delivery Address
  const [street, setStreet] = useState("742 Evergreen Terrace");
  const [apartment, setApartment] = useState("Suite 4B");
  const [city, setCity] = useState("New York");
  const [state, setState] = useState("NY");
  const [postalCode, setPostalCode] = useState("10001");
  const [country, setCountry] = useState("United States");

  // Step 4: Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wire" | "paypal">("card");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");

  // Confirmed Order
  const [confirmedOrder, setConfirmedOrder] = useState<MockOrder | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-sage-light py-20 text-center text-forest-deep">
        Initializing checkout session...
      </div>
    );
  }

  // If no items in cart and not on confirmation screen, redirect to cart
  if (items.length === 0 && currentStep !== 6) {
    return (
      <div className="min-h-screen bg-sage-light py-24 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-heading font-bold text-forest-deep">
          No items to checkout
        </h2>
        <p className="text-sm text-forest-muted">
          Your shopping bag is currently empty.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-dark text-white text-xs font-bold uppercase"
        >
          Browse Furniture
        </Link>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const discount = getDiscountAmount();
  const total = getTotal();

  const handlePlaceOrder = () => {
    const newOrder = addOrder({
      status: "Confirmed",
      total,
      estimatedDelivery: "In 10–14 business days",
      shippingAddress: {
        id: `addr-${Date.now()}`,
        isDefault: true,
        fullName: `${firstName} ${lastName}`,
        street,
        apartment,
        city,
        state,
        postalCode,
        country,
        phone,
      },
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.images[0],
        color: i.selectedColor.name,
      })),
    });

    setConfirmedOrder(newOrder);
    clearCart();
    setCurrentStep(6);
  };

  return (
    <div className="min-h-screen bg-sage-light py-12">
      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
        {/* Checkout Header with Progress Stepper */}
        {currentStep !== 6 && (
          <div className="mb-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-forest-muted">
                <Link href="/cart" className="hover:text-forest-deep">Shopping Bag</Link>
                <span>/</span>
                <span className="text-terracotta">Secure Checkout</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-forest-muted">
                <Lock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Simulated Frontend Checkout</span>
              </div>
            </div>

            {/* Step Indicator with Apple Glass Pills */}
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {[
                { step: 1, label: "Client Info" },
                { step: 2, label: "Delivery" },
                { step: 3, label: "Freight Tier" },
                { step: 4, label: "Payment" },
                { step: 5, label: "Review" },
              ].map((s) => (
                <div key={s.step} className="flex flex-col items-center flex-1 relative">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-soft border ${
                      currentStep === s.step
                        ? "glass-cta-orange text-white ring-4 ring-terracotta/25 border-white/60 scale-105"
                        : currentStep > s.step
                        ? "glass-pill-forest text-white border-white/50"
                        : "glass-pill text-forest-muted border-white/70"
                    }`}
                  >
                    {currentStep > s.step ? "✓" : s.step}
                  </div>
                  <span className="text-[11px] font-bold mt-1.5 text-forest-deep hidden sm:block">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Checkout Body: Steps 1-5 + Summary or Step 6 Confirmation */}
        {currentStep === 6 && confirmedOrder ? (
          /* STEP 6: Order Confirmation */
          <div className="max-w-3xl mx-auto bg-ivory-warm rounded-3xl border border-borderSage p-8 sm:p-12 shadow-floating space-y-8 animate-fadeIn">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-soft">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <span className="text-xs uppercase tracking-widest font-bold text-terracotta">
                ORDER CONFIRMED & IN QUEUE
              </span>
              <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-forest-deep">
                Thank you, {firstName}
              </h1>
              <p className="text-sm text-forest-muted max-w-md mx-auto">
                Your order reference is{" "}
                <strong className="text-forest-deep">{confirmedOrder.orderNumber}</strong>. A confirmation has been simulated to {email}.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="p-6 rounded-2xl bg-white border border-borderSage space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-borderSage/60 text-xs">
                <span className="font-semibold text-forest-muted">Estimated Delivery Window:</span>
                <span className="font-bold text-forest-deep">{confirmedOrder.estimatedDelivery}</span>
              </div>

              {/* Items summary */}
              <div className="space-y-3">
                {confirmedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg bg-sage-50 overflow-hidden shrink-0">
                        <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-forest-deep">{item.name}</p>
                        <p className="text-forest-muted">
                          {item.color} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-forest-deep">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-borderSage/60 flex justify-between items-baseline">
                <span className="text-sm font-bold text-forest-deep">Total Billed:</span>
                <span className="text-xl font-extrabold text-forest-deep">
                  {formatPrice(confirmedOrder.total)}
                </span>
              </div>
            </div>

            {/* Shipping Address Summary */}
            <div className="p-5 rounded-2xl bg-sage-100/60 border border-borderSage text-xs space-y-1">
              <span className="font-bold text-forest-deep block mb-1">
                Inside White-Glove Destination:
              </span>
              <p className="text-forest-deep font-semibold">{confirmedOrder.shippingAddress.fullName}</p>
              <p className="text-forest-muted">
                {confirmedOrder.shippingAddress.street}, {confirmedOrder.shippingAddress.apartment}
              </p>
              <p className="text-forest-muted">
                {confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.state} {confirmedOrder.shippingAddress.postalCode}
              </p>
              <p className="text-forest-muted">Contact: {confirmedOrder.shippingAddress.phone}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/account/orders"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-forest-dark hover:bg-forest-deep text-white text-xs font-bold uppercase tracking-wider text-center transition-colors"
              >
                View Order in Account
              </Link>
              <Link
                href="/shop"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-borderSage bg-white hover:bg-sage-100 text-forest-deep text-xs font-bold uppercase tracking-wider text-center transition-colors"
              >
                Continue Browsing Catalog
              </Link>
            </div>
          </div>
        ) : (
          /* STEPS 1-5 Form & Right Summary Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Steps Form (8 cols) */}
            <div className="lg:col-span-8 glass-surface rounded-3xl border border-white/70 bg-white/80 backdrop-blur-3xl p-6 sm:p-10 shadow-floating">
              {/* STEP 1: Customer Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-borderSage/70">
                    <span className="text-xs uppercase tracking-widest font-bold text-terracotta">
                      STEP 1 OF 5
                    </span>
                    <h2 className="text-2xl font-heading font-extrabold text-forest-deep mt-1">
                      Customer Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-white border border-borderSage rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-forest-deep focus:outline-none focus:border-forest-dark"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-white border border-borderSage rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-forest-deep focus:outline-none focus:border-forest-dark"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                        Email Address (for order tracking)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-borderSage rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-forest-deep focus:outline-none focus:border-forest-dark"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                        Telephone (required for freight appointment)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border border-borderSage rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-forest-deep focus:outline-none focus:border-forest-dark"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-borderSage/70 flex justify-end">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-8 py-3.5 rounded-xl bg-forest-dark hover:bg-forest-deep text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-soft"
                    >
                      Continue to Delivery Address <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Delivery Address */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-borderSage/70">
                    <span className="text-xs uppercase tracking-widest font-bold text-terracotta">
                      STEP 2 OF 5
                    </span>
                    <h2 className="text-2xl font-heading font-extrabold text-forest-deep mt-1">
                      Delivery Destination
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full bg-white border border-borderSage rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-forest-deep focus:outline-none focus:border-forest-dark"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                        Apartment, Suite, Unit (optional)
                      </label>
                      <input
                        type="text"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        className="w-full bg-white border border-borderSage rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-forest-deep focus:outline-none focus:border-forest-dark"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-white border border-borderSage rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-forest-deep focus:outline-none focus:border-forest-dark"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                          State / Region
                        </label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full bg-white border border-borderSage rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-forest-deep focus:outline-none focus:border-forest-dark"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="w-full bg-white border border-borderSage rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-forest-deep focus:outline-none focus:border-forest-dark"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-borderSage/70 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-3 rounded-xl border border-borderSage bg-white text-xs font-bold uppercase text-forest-deep"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-8 py-3.5 rounded-xl bg-forest-dark hover:bg-forest-deep text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-soft"
                    >
                      Choose Freight Tier <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Delivery Freight Tier */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-borderSage/70">
                    <span className="text-xs uppercase tracking-widest font-bold text-terracotta">
                      STEP 3 OF 5
                    </span>
                    <h2 className="text-2xl font-heading font-extrabold text-forest-deep mt-1">
                      Select Delivery Method
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <div
                      onClick={() => setDeliveryMethod("standard")}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        deliveryMethod === "standard"
                          ? "border-forest-dark bg-white shadow-soft"
                          : "border-borderSage bg-sage-50 hover:bg-white"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-heading font-bold text-sm text-forest-deep">
                          Curbside Freight (Liftgate)
                        </span>
                        <span className="font-bold text-forest-deep">
                          {subtotal >= 2000 ? "FREE" : "$75"}
                        </span>
                      </div>
                      <p className="text-xs text-forest-muted">
                        Delivered to property entrance via liftgate freight truck in 5-7 business days.
                      </p>
                    </div>

                    <div
                      onClick={() => setDeliveryMethod("white-glove")}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        deliveryMethod === "white-glove"
                          ? "border-forest-dark bg-white shadow-soft"
                          : "border-borderSage bg-sage-50 hover:bg-white"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-heading font-bold text-sm text-forest-deep">
                          White-Glove Inside Placement (Recommended)
                        </span>
                        <span className="font-bold text-forest-deep">$195</span>
                      </div>
                      <p className="text-xs text-forest-muted">
                        Specialized two-person delivery team carries pieces into designated room, provides full joinery assembly, and removes all protective timber crates.
                      </p>
                    </div>

                    <div
                      onClick={() => setDeliveryMethod("express")}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        deliveryMethod === "express"
                          ? "border-forest-dark bg-white shadow-soft"
                          : "border-borderSage bg-sage-50 hover:bg-white"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-heading font-bold text-sm text-forest-deep">
                          Express Priority Freight
                        </span>
                        <span className="font-bold text-forest-deep">$120</span>
                      </div>
                      <p className="text-xs text-forest-muted">
                        Fast-tracked warehouse priority dispatch within 48 hours.
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-borderSage/70 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-3 rounded-xl border border-borderSage bg-white text-xs font-bold uppercase text-forest-deep"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="px-8 py-3.5 rounded-xl bg-forest-dark hover:bg-forest-deep text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-soft"
                    >
                      Proceed to Payment <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Payment Simulation */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-borderSage/70">
                    <span className="text-xs uppercase tracking-widest font-bold text-terracotta">
                      STEP 4 OF 5
                    </span>
                    <h2 className="text-2xl font-heading font-extrabold text-forest-deep mt-1">
                      Payment Simulation
                    </h2>
                    <p className="text-xs text-forest-muted mt-1">
                      This is a frontend demonstration. No actual currency transaction or live banking charge will take place.
                    </p>
                  </div>

                  {/* Payment Methods */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        paymentMethod === "card"
                          ? "border-forest-dark bg-white shadow-soft"
                          : "border-borderSage bg-sage-50"
                      }`}
                    >
                      <CreditCard className="w-5 h-5 mx-auto mb-1 text-forest-deep" />
                      <span className="text-xs font-bold text-forest-deep">Credit Card</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("wire")}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        paymentMethod === "wire"
                          ? "border-forest-dark bg-white shadow-soft"
                          : "border-borderSage bg-sage-50"
                      }`}
                    >
                      <Building className="w-5 h-5 mx-auto mb-1 text-forest-deep" />
                      <span className="text-xs font-bold text-forest-deep">Bank Wire</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("paypal")}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        paymentMethod === "paypal"
                          ? "border-forest-dark bg-white shadow-soft"
                          : "border-borderSage bg-sage-50"
                      }`}
                    >
                      <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-forest-deep" />
                      <span className="text-xs font-bold text-forest-deep">Simulated PayPal</span>
                    </button>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-white border border-borderSage rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-forest-deep focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-white border border-borderSage rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-forest-deep focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                            CVC Security Code
                          </label>
                          <input
                            type="text"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full bg-white border border-borderSage rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-forest-deep focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-borderSage/70 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-6 py-3 rounded-xl border border-borderSage bg-white text-xs font-bold uppercase text-forest-deep"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(5)}
                      className="px-8 py-3.5 rounded-xl bg-forest-dark hover:bg-forest-deep text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-soft"
                    >
                      Review Order <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: Final Order Review */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="pb-4 border-b border-borderSage/70">
                    <span className="text-xs uppercase tracking-widest font-bold text-terracotta">
                      STEP 5 OF 5
                    </span>
                    <h2 className="text-2xl font-heading font-extrabold text-forest-deep mt-1">
                      Final Review & Authorization
                    </h2>
                  </div>

                  {/* Summary Blocks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-white border border-borderSage">
                      <span className="font-bold text-forest-deep block mb-1">Contact:</span>
                      <p className="text-forest-deep font-semibold">{firstName} {lastName}</p>
                      <p className="text-forest-muted">{email}</p>
                      <p className="text-forest-muted">{phone}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-borderSage">
                      <span className="font-bold text-forest-deep block mb-1">Destination:</span>
                      <p className="text-forest-muted">{street}, {apartment}</p>
                      <p className="text-forest-muted">{city}, {state} {postalCode}</p>
                      <p className="text-forest-deep font-semibold">Tier: {deliveryMethod}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-borderSage/70 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="px-6 py-3 rounded-xl border border-borderSage bg-white text-xs font-bold uppercase text-forest-deep"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="px-8 py-4 rounded-full glass-cta-orange text-white text-xs font-heading font-extrabold uppercase tracking-widest flex items-center gap-2 transition-all shadow-floating hover:scale-[1.02]"
                    >
                      Confirm Simulated Order ({formatPrice(total)}) <CheckCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Summary Column (4 cols) */}
            <div className="lg:col-span-4">
              <div className="glass-surface rounded-3xl border border-white/75 bg-white/85 backdrop-blur-3xl p-6 sm:p-8 space-y-6 shadow-floating sticky top-24">
                <h3 className="font-heading font-extrabold text-base text-forest-deep pb-3 border-b border-borderSage/40">
                  Cart Breakdown ({items.length})
                </h3>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((i) => (
                    <div key={i.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="relative w-10 h-10 rounded-lg bg-sage-50 overflow-hidden shrink-0">
                          <Image src={i.product.images[0]} alt={i.product.name} fill sizes="40px" className="object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-forest-deep line-clamp-1">{i.product.name}</p>
                          <p className="text-forest-muted">{i.selectedColor.name} • Qty {i.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-forest-deep">
                        {formatPrice(i.product.price * i.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-borderSage/70 space-y-2 text-xs">
                  <div className="flex justify-between text-forest-muted">
                    <span>Subtotal</span>
                    <span className="font-bold text-forest-deep">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-terracotta font-semibold">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-forest-muted">
                    <span>Freight Service</span>
                    <span className="font-bold text-forest-deep">
                      {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-borderSage/70 flex justify-between items-baseline text-sm">
                    <span className="font-bold text-forest-deep">Total</span>
                    <span className="font-extrabold text-xl text-forest-deep">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
