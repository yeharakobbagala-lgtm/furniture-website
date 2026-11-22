"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, CheckCircle, Send, Clock, Building2 } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("concierge");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-sage-light min-h-screen py-16">
      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20">
        {/* Header */}
        <div className="max-w-2xl mb-12 space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-forest-muted">
            <Link href="/" className="hover:text-forest-deep">Home</Link>
            <span>/</span>
            <span className="text-terracotta">Contact & Showrooms</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-forest-deep tracking-tight">
            Client Concierge & Ateliers
          </h1>
          <p className="text-sm sm:text-base text-forest-muted">
            Our interior specialists and contract estimators are here to guide your residential layout or commercial project.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 bg-ivory-warm rounded-3xl border border-borderSage p-8 sm:p-12 shadow-soft">
            <h2 className="text-2xl font-heading font-bold text-forest-deep mb-2">
              Send a Private Inquiry
            </h2>
            <p className="text-xs text-forest-muted mb-6">
              Inquiries are answered within 12 hours by our senior furniture consultants.
            </p>

            {submitted ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-center space-y-3 animate-fadeIn">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold">Message Received</h3>
                <p className="text-xs max-w-sm mx-auto">
                  Thank you, {name}. A Square concierge specialist will reach out to {email} shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Charlotte Lind"
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
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-white border border-borderSage rounded-xl px-3.5 py-2.5 text-xs text-forest-deep focus:outline-none"
                  >
                    <option value="concierge">Residential Furniture Advice</option>
                    <option value="contract">Commercial & Hospitality RFQ</option>
                    <option value="swatches">Fabric & Stone Sample Swatches</option>
                    <option value="delivery">White-Glove Delivery Scheduling</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your room dimensions, project schedule, or specific model inquiries..."
                    className="w-full bg-white border border-borderSage rounded-xl px-3.5 py-2.5 text-xs text-forest-deep focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-forest-dark hover:bg-forest-deep text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-soft transition-colors"
                >
                  <Send className="w-4 h-4" /> Transmit Message
                </button>
              </form>
            )}
          </div>

          {/* Right Showrooms & Contacts (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-ivory-warm rounded-3xl border border-borderSage p-6 sm:p-8 shadow-soft space-y-4">
              <h3 className="font-heading font-bold text-lg text-forest-deep pb-3 border-b border-borderSage/70">
                Direct Atelier Contact
              </h3>
              <div className="space-y-3 text-xs text-forest-muted">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-terracotta" />
                  <span>+1 (800) 482-9104 (Mon–Fri 8am–7pm EST)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-terracotta" />
                  <span>concierge@squarefurniture.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-terracotta" />
                  <span>trade@squarefurniture.com (Contract Quotes)</span>
                </div>
              </div>
            </div>

            {/* Showroom Flagships */}
            <div className="bg-ivory-warm rounded-3xl border border-borderSage p-6 sm:p-8 shadow-soft space-y-5">
              <h3 className="font-heading font-bold text-lg text-forest-deep pb-3 border-b border-borderSage/70">
                Flagship Showrooms
              </h3>

              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <h4 className="font-bold text-forest-deep">New York Gallery</h4>
                  <p className="text-forest-muted">452 West Broadway, SoHo, NY 10012</p>
                  <p className="text-[11px] text-terracotta font-semibold">Open Tuesday–Sunday</p>
                </div>

                <div className="space-y-1 pt-3 border-t border-borderSage/50">
                  <h4 className="font-bold text-forest-deep">Stockholm Studio</h4>
                  <p className="text-forest-muted">Birger Jarlsgatan 24, 114 34 Stockholm</p>
                  <p className="text-[11px] text-terracotta font-semibold">By Private Appointment</p>
                </div>

                <div className="space-y-1 pt-3 border-t border-borderSage/50">
                  <h4 className="font-bold text-forest-deep">Milan Atelier</h4>
                  <p className="text-forest-muted">Via Solferino 18, Brera, 20121 Milano</p>
                  <p className="text-[11px] text-terracotta font-semibold">Open Monday–Saturday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
