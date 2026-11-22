"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  FileText,
  Trash2,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Send,
} from "lucide-react";
import { useCommercialQuoteStore, CommercialQuoteSubmission } from "@/stores/commercialQuoteStore";
import { formatPrice } from "@/lib/utils";

export default function CommercialQuotePage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, clearItems, submitQuote } =
    useCommercialQuoteStore();

  // Form Fields
  const [companyName, setCompanyName] = useState("Luminary Hospitality Studio");
  const [contactName, setContactName] = useState("Marcus Sterling");
  const [email, setEmail] = useState("m.sterling@luminaryhotels.com");
  const [phone, setPhone] = useState("+1 (555) 789-2341");
  const [projectType, setProjectType] = useState("hotel");
  const [projectScope, setProjectScope] = useState("Boutique hotel lobby and 30 guest suites");
  const [targetTimeline, setTargetTimeline] = useState("Q2 2027");
  const [estimatedBudget, setEstimatedBudget] = useState("LKR 75,000 - LKR 120,000");
  const [notes, setNotes] = useState("");

  const [confirmedSubmission, setConfirmedSubmission] =
    useState<CommercialQuoteSubmission | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-sage-light py-20 text-center text-forest-deep">
        Loading commercial quotation portal...
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submission = submitQuote({
      companyName,
      contactName,
      email,
      phone,
      projectType,
      projectScope,
      targetTimeline,
      estimatedBudget,
      notes,
    });
    setConfirmedSubmission(submission);
  };

  return (
    <div className="min-h-screen bg-sage-light py-12">
      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
        {/* Header */}
        <div className="flex items-center justify-between pb-8 border-b border-borderSage/70">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-forest-muted mb-2">
              <Link href="/commercial" className="hover:text-forest-deep">Commercial</Link>
              <span>/</span>
              <span className="text-terracotta">RFQ Quotation Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-forest-deep tracking-tight">
              Commercial Quotation Request ({items.length} specifications)
            </h1>
          </div>
        </div>

        {confirmedSubmission ? (
          /* Confirmation Screen */
          <div className="max-w-2xl mx-auto bg-ivory-warm rounded-3xl border border-borderSage p-8 sm:p-12 shadow-floating space-y-6 mt-10 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-soft">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <span className="text-xs uppercase tracking-widest font-bold text-terracotta">
              COMMERCIAL INQUIRY REGISTERED
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-forest-deep">
              RFQ Reference: {confirmedSubmission.quoteNumber}
            </h2>
            <p className="text-sm text-forest-muted leading-relaxed">
              Thank you, <strong className="text-forest-deep">{confirmedSubmission.contactName}</strong>. Our senior commercial contract estimator will review your specification for{" "}
              <strong className="text-forest-deep">{confirmedSubmission.companyName}</strong> and prepare tiered contract volume pricing within 24 business hours.
            </p>

            <div className="p-5 rounded-2xl bg-white border border-borderSage text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-forest-muted">Project Type:</span>
                <span className="font-bold text-forest-deep capitalize">{confirmedSubmission.projectType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-forest-muted">Target Timeline:</span>
                <span className="font-bold text-forest-deep">{confirmedSubmission.targetTimeline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-forest-muted">Estimated Budget:</span>
                <span className="font-bold text-forest-deep">{confirmedSubmission.estimatedBudget}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-4">
              <Link
                href="/commercial"
                className="px-6 py-3 rounded-xl bg-forest-dark text-white text-xs font-bold uppercase"
              >
                Return to Commercial Hub
              </Link>
            </div>
          </div>
        ) : (
          /* Form & Draft Items Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10">
            {/* Left Items Column (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between pb-2">
                <h3 className="font-heading font-bold text-lg text-forest-deep">
                  Selected Pieces in Quotation Draft
                </h3>
                {items.length > 0 && (
                  <button
                    onClick={clearItems}
                    className="text-xs text-forest-muted hover:text-terracotta"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="p-8 rounded-2xl bg-ivory-warm border border-borderSage text-center space-y-3">
                  <Building2 className="w-10 h-10 text-forest-muted mx-auto" />
                  <p className="text-sm text-forest-muted">
                    No items in quotation draft. Browse our contract catalog and click &ldquo;Request Commercial Quotation&rdquo; on any piece.
                  </p>
                  <Link
                    href="/commercial"
                    className="inline-block px-5 py-2.5 rounded-xl bg-forest-dark text-white text-xs font-bold uppercase"
                  >
                    Browse Commercial Pieces
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-4 rounded-2xl bg-ivory-warm border border-borderSage flex items-center justify-between gap-4 shadow-soft"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-sage-50 border border-borderSage shrink-0">
                        <Image src={item.product.images[0]} alt={item.product.name} fill sizes="64px" className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-sm text-forest-deep">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-forest-muted">
                          Reference List Price: {formatPrice(item.product.price)}
                        </p>
                        {item.customNotes && (
                          <p className="text-[11px] text-terracotta italic">{item.customNotes}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        <label className="text-[10px] text-forest-muted block">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                          className="w-16 bg-white border border-borderSage rounded-lg px-2 py-1 text-xs font-bold text-center"
                        />
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-forest-muted hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right RFQ Submission Form (6 cols) */}
            <div className="lg:col-span-6 bg-ivory-warm rounded-3xl border border-borderSage p-6 sm:p-8 shadow-soft">
              <h3 className="font-heading font-bold text-lg text-forest-deep mb-2">
                Project & Entity Information
              </h3>
              <p className="text-xs text-forest-muted mb-6">
                Fill in your commercial project requirements to generate an official RFQ estimate.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-white border border-borderSage rounded-xl px-3 py-2 text-xs text-forest-deep focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                      Contact Lead Name
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-white border border-borderSage rounded-xl px-3 py-2 text-xs text-forest-deep focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-borderSage rounded-xl px-3 py-2 text-xs text-forest-deep focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                      Telephone
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-borderSage rounded-xl px-3 py-2 text-xs text-forest-deep focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                      Project Type
                    </label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full bg-white border border-borderSage rounded-xl px-3 py-2 text-xs text-forest-deep focus:outline-none"
                    >
                      <option value="hotel">Boutique Hotel</option>
                      <option value="office">Corporate Office</option>
                      <option value="restaurant">Restaurant / Bar</option>
                      <option value="reception">Reception & Lounge</option>
                      <option value="residential">Multi-Unit Residential</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                      Target Timeline
                    </label>
                    <input
                      type="text"
                      value={targetTimeline}
                      onChange={(e) => setTargetTimeline(e.target.value)}
                      placeholder="e.g. Q1 2027"
                      className="w-full bg-white border border-borderSage rounded-xl px-3 py-2 text-xs text-forest-deep focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                      Target Budget
                    </label>
                    <input
                      type="text"
                      value={estimatedBudget}
                      onChange={(e) => setEstimatedBudget(e.target.value)}
                      placeholder="e.g. LKR 50,000+"
                      className="w-full bg-white border border-borderSage rounded-xl px-3 py-2 text-xs text-forest-deep focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                    Project Scope & Architectural Details
                  </label>
                  <textarea
                    rows={3}
                    value={projectScope}
                    onChange={(e) => setProjectScope(e.target.value)}
                    className="w-full bg-white border border-borderSage rounded-xl px-3 py-2 text-xs text-forest-deep focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                    Special Inquiries (Custom Stains, CAD files, Freight staging)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Need Revit/BIM files for interior modeling..."
                    className="w-full bg-white border border-borderSage rounded-xl px-3 py-2 text-xs text-forest-deep focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-card transition-all"
                >
                  <Send className="w-4 h-4" /> Submit Commercial RFQ Request
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
