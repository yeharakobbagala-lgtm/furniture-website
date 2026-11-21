"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, User, MapPin, Check, Plus, Trash2 } from "lucide-react";
import { useUserStore } from "@/stores/userStore";

export default function AccountProfilePage() {
  const [mounted, setMounted] = useState(false);
  const { user, addresses, addAddress, removeAddress } = useUserStore();

  const [name, setName] = useState(user?.name || "Alexander Wright");
  const [email, setEmail] = useState(user?.email || "alexander.wright@studio.com");
  const [phone, setPhone] = useState(user?.phone || "+1 (555) 349-2810");
  const [savedNotice, setSavedNotice] = useState(false);

  // New address state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("");
  const [newPostal, setNewPostal] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-sage-light py-20 text-center text-forest-deep">
        Loading client profile...
      </div>
    );
  }

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity) return;
    addAddress({
      fullName: name,
      isDefault: false,
      street: newStreet,
      city: newCity,
      state: newState || "NY",
      postalCode: newPostal || "10001",
      country: "United States",
      phone,
    });
    setNewStreet("");
    setNewCity("");
    setNewState("");
    setNewPostal("");
    setShowAddressForm(false);
  };

  return (
    <div className="min-h-screen bg-sage-light py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/account"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-deep hover:text-terracotta uppercase tracking-wider mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>

        <h1 className="text-3xl font-heading font-extrabold text-forest-deep mb-8">
          Personal Information & Addresses
        </h1>

        <div className="space-y-8">
          {/* Contact Details */}
          <div className="bg-ivory-warm rounded-3xl border border-borderSage p-6 sm:p-8 shadow-soft">
            <h2 className="text-xl font-heading font-bold text-forest-deep mb-4">
              Contact Profile
            </h2>

            <form onSubmit={handleSaveContact} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-borderSage rounded-xl px-3 py-2 text-xs text-forest-deep focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-borderSage rounded-xl px-3 py-2 text-xs text-forest-deep focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-borderSage rounded-xl px-3 py-2 text-xs text-forest-deep focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-forest-dark text-white text-xs font-bold uppercase tracking-wider"
                >
                  Save Profile Changes
                </button>
                {savedNotice && (
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Updated
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Saved Addresses */}
          <div className="bg-ivory-warm rounded-3xl border border-borderSage p-6 sm:p-8 shadow-soft space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold text-forest-deep">
                Saved Freight Addresses
              </h2>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="px-3.5 py-1.5 rounded-xl bg-forest-dark text-white text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add New Address
              </button>
            </div>

            {/* Address Form if open */}
            {showAddressForm && (
              <form onSubmit={handleCreateAddress} className="p-4 rounded-2xl bg-white border border-borderSage space-y-3">
                <h4 className="text-xs font-bold uppercase text-forest-deep">New Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="Street address"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      className="w-full bg-sage-50 border border-borderSage rounded-lg px-2.5 py-2"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full bg-sage-50 border border-borderSage rounded-lg px-2.5 py-2"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="State (e.g. NY)"
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      className="w-full bg-sage-50 border border-borderSage rounded-lg px-2.5 py-2"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="px-3 py-1.5 text-xs text-forest-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-terracotta text-white rounded-lg text-xs font-semibold"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-5 rounded-2xl bg-white border border-borderSage space-y-2 relative"
                >
                  {addr.isDefault && (
                    <span className="px-2 py-0.5 rounded bg-forest-dark text-white text-[10px] font-bold uppercase">
                      Default Shipping
                    </span>
                  )}
                  <h4 className="font-bold text-sm text-forest-deep">{addr.fullName}</h4>
                  <p className="text-xs text-forest-muted">
                    {addr.street} {addr.apartment && `, ${addr.apartment}`}
                  </p>
                  <p className="text-xs text-forest-muted">
                    {addr.city}, {addr.state} {addr.postalCode}
                  </p>
                  <p className="text-xs text-forest-muted">{addr.phone}</p>
                  {addresses.length > 1 && (
                    <button
                      onClick={() => removeAddress(addr.id)}
                      className="text-forest-muted hover:text-red-600 text-xs mt-2 block"
                    >
                      Delete Address
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
