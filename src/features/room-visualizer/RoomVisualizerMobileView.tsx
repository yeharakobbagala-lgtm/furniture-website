"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Upload,
  Download,
  Sparkles,
  Plus,
  Search,
  SlidersHorizontal,
  Layers,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCw,
  FlipHorizontal,
  Trash2,
  X,
  Menu,
  ShoppingBag,
} from "lucide-react";
import { Product, VisualizerPlacedItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import { sampleVisualizerRooms } from "@/data/roomPresets";

interface RoomVisualizerMobileViewProps {
  roomImage: string | null;
  placedItems: VisualizerPlacedItem[];
  selectedItemId: string | null;
  selectedItem: VisualizerPlacedItem | undefined;
  products: Product[];
  cartItemCount: number;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDownloadPreview: () => void;
  handleAddFurniture: (p: Product) => void;
  handleUpdateItem: (id: string, updates: Partial<VisualizerPlacedItem>) => void;
  handleRemoveItem: (id: string) => void;
  handleBringForward: (id: string) => void;
  handleSendBackward: (id: string) => void;
  setSelectedItemId: (id: string | null) => void;
  activeDraggingId: string | null;
  handlePointerDown: (e: React.PointerEvent, id: string) => void;
  setRoomImage: (img: string) => void;
}

export default function RoomVisualizerMobileView({
  roomImage,
  placedItems,
  selectedItemId,
  selectedItem,
  products,
  cartItemCount,
  fileInputRef,
  handleFileUpload,
  handleDownloadPreview,
  handleAddFurniture,
  handleUpdateItem,
  handleRemoveItem,
  handleBringForward,
  handleSendBackward,
  setSelectedItemId,
  activeDraggingId,
  handlePointerDown,
  setRoomImage,
}: RoomVisualizerMobileViewProps) {
  const [activeTab, setActiveTab] = useState<"place" | "adjust" | "layer" | "more">("place");
  const [libraryCategory, setLibraryCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [placementControlsOpen, setPlacementControlsOpen] = useState(true);

  const categories = [
    { id: "all", label: "All" },
    { id: "sofas", label: "Sofas" },
    { id: "lounge-chairs", label: "Lounge Chairs" },
    { id: "dining-tables", label: "Dining Tables" },
    { id: "coffee-tables", label: "Coffee Tables" },
    { id: "beds", label: "Beds" },
    { id: "storage", label: "Storage" },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = libraryCategory === "all" || p.category.toLowerCase() === libraryCategory.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        p.categoryName.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesCat && matchesSearch;
    });
  }, [products, libraryCategory, searchQuery]);

  return (
    <div className="w-full min-h-screen bg-[#EDF3EB] text-[#173C2B] flex flex-col font-sans select-none pb-28">
      {/* ============================================================ */}
      {/* 1. MOBILE FLOATING HEADER                                    */}
      {/* ============================================================ */}
      <header className="sticky top-2 z-40 px-3 sm:px-4 pt-2">
        <div className="w-full max-w-[480px] mx-auto bg-[#E5F0E1]/90 backdrop-blur-xl rounded-full py-2 px-3.5 sm:px-4 flex items-center justify-between border border-white/70 shadow-[0_6px_20px_rgba(23,60,43,0.06)]">
          {/* Left Brand Identity */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-[#173C2B] flex items-center justify-center text-white shrink-0 shadow-sm">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
                <path d="M9 21V12h6v9" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-[15px] tracking-wider text-[#173C2B] leading-none">
                SQUARE
              </span>
              <span className="text-[8.5px] uppercase tracking-[0.2em] text-[#587763] font-medium leading-tight mt-0.5">
                Furniture & Living
              </span>
            </div>
          </Link>

          {/* Right Action Icons: Search, Bag, Menu */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              href="/shop"
              aria-label="Search catalog"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#173C2B] bg-white/60 hover:bg-white/80 backdrop-blur-md border border-white/70 transition-all active:scale-95 shadow-2xs"
            >
              <Search className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/cart"
              aria-label="Shopping bag"
              className="relative w-8 h-8 rounded-full flex items-center justify-center text-[#173C2B] bg-white/60 hover:bg-white/80 backdrop-blur-md border border-white/70 transition-all active:scale-95 shadow-2xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#D94D1E] text-white text-[8.5px] font-bold flex items-center justify-center shadow-xs">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link
              href="/shop"
              aria-label="Menu"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#173C2B] bg-white/60 hover:bg-white/80 backdrop-blur-md border border-white/70 transition-all active:scale-95 shadow-2xs"
            >
              <Menu className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="w-full max-w-[480px] mx-auto px-3 sm:px-4 pt-3 flex flex-col gap-3">
        {/* ============================================================ */}
        {/* 2. PAGE TITLE AND ACTIONS                                    */}
        {/* ============================================================ */}
        <div className="flex flex-col gap-3">
          {/* Title Row */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D94D1E] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="font-heading font-extrabold text-[16px] sm:text-[17px] text-[#173C2B] leading-tight truncate">
                Room Photo Furniture Visualizer
              </h1>
              <p className="text-[11px] text-[#587763] leading-snug mt-0.5 truncate">
                Composite real furniture models onto your uploaded room photo
              </p>
            </div>
          </div>

          {/* Action Buttons: Upload & Download */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-2.5 px-3 rounded-full border border-borderSage bg-white hover:bg-[#E5F0E1] text-[#173C2B] text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 text-[#D94D1E]" />
              <span className="truncate">Upload My Room Photo</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            <button
              onClick={handleDownloadPreview}
              className="py-2.5 px-3 rounded-full bg-[#173C2B] hover:bg-[#102D21] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="truncate">Download Composite</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. ROOM PHOTO CANVAS (HIGHEST PRIORITY)                      */}
        {/* ============================================================ */}
        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/80 shadow-md bg-[#E6ECE4] select-none">
          {roomImage ? (
            <>
              {/* Room Background Photo */}
              <Image
                src={roomImage}
                alt="Uploaded Room Photo"
                fill
                priority
                sizes="(max-width: 480px) 100vw, 480px"
                className="object-cover pointer-events-none"
              />

              {/* Placed Furniture Elements with Interactive Touch Handling */}
              {placedItems.map((item) => {
                const isSelected = selectedItemId === item.id;
                const isDraggingThis = activeDraggingId === item.id;

                return (
                  <div
                    key={item.id}
                    onPointerDown={(e) => handlePointerDown(e, item.id)}
                    style={{
                      position: "absolute",
                      left: `${item.x}px`,
                      top: `${item.y}px`,
                      transform: `rotate(${item.rotation}deg) scaleX(${item.flipX ? -1 : 1}) scale(${item.scale})`,
                      zIndex: item.zIndex,
                      cursor: isDraggingThis ? "grabbing" : "grab",
                      touchAction: "none",
                    }}
                    className="group"
                  >
                    <div className="relative w-44 h-44 sm:w-52 sm:h-52 select-none">
                      {/* Transparent Furniture Piece with Directional Contact Shadow */}
                      <Image
                        src={item.transparentImage}
                        alt={item.name}
                        fill
                        sizes="240px"
                        className="object-contain pointer-events-none select-none"
                        style={{
                          filter:
                            "drop-shadow(0 16px 20px rgba(0, 0, 0, 0.40)) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.20))",
                        }}
                      />

                      {/* Precise Studio Selection Markers */}
                      {isSelected && (
                        <>
                          <div className="absolute inset-0 border border-dashed border-[#D94D1E]/80 rounded-xl pointer-events-none" />
                          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#D94D1E] border-2 border-white rounded-full shadow-sm pointer-events-none" />
                          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#D94D1E] border-2 border-white rounded-full shadow-sm pointer-events-none" />
                          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#D94D1E] border-2 border-white rounded-full shadow-sm pointer-events-none" />
                          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#D94D1E] border-2 border-white rounded-full shadow-sm pointer-events-none" />

                          {/* Floating name badge */}
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#102D21]/95 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shadow-soft pointer-events-none flex items-center gap-1.5 border border-white/20">
                            <span>{item.name}</span>
                            <span className="text-[#D94D1E]">• {Math.round(item.scale * 100)}%</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#587763]">
              <Upload className="w-10 h-10 mb-2 text-[#D94D1E]" />
              <p className="font-heading font-bold text-sm text-[#173C2B]">No Room Photo Selected</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 px-4 py-2 rounded-xl bg-[#173C2B] text-white text-xs font-bold"
              >
                Browse Photo
              </button>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* 4. PLACEMENT CONTROLS – DIRECTLY AFTER UPLOADED PHOTO        */}
        {/* ============================================================ */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-white/80 shadow-xs overflow-hidden transition-all">
          {/* Header Toggle */}
          <button
            onClick={() => setPlacementControlsOpen(!placementControlsOpen)}
            className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-white/60 transition-colors"
          >
            <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#173C2B]">
              PLACEMENT CONTROLS
            </span>
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[#173C2B]">
              {placementControlsOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </div>
          </button>

          {/* Panel Content */}
          {placementControlsOpen && (
            <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-3.5">
              {selectedItem ? (
                <>
                  {/* Selected Furniture Name and Dimensions */}
                  <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                    <span className="font-bold text-xs text-[#173C2B] truncate">{selectedItem.name}</span>
                    <span className="text-xs font-bold text-[#173C2B]">{formatPrice(selectedItem.price)}</span>
                  </div>

                  {/* A. Nudge Position */}
                  <div>
                    <span className="text-[11px] font-bold text-[#173C2B] block mb-1.5">
                      Nudge Position
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      <button
                        onClick={() => handleUpdateItem(selectedItem.id, { x: selectedItem.x - 15 })}
                        className="py-2 rounded-xl border border-borderSage bg-white hover:bg-sage-50 text-xs font-bold text-[#173C2B] shadow-2xs transition-all active:scale-95"
                      >
                        ← Left
                      </button>
                      <button
                        onClick={() => handleUpdateItem(selectedItem.id, { x: selectedItem.x + 15 })}
                        className="py-2 rounded-xl border border-borderSage bg-white hover:bg-sage-50 text-xs font-bold text-[#173C2B] shadow-2xs transition-all active:scale-95"
                      >
                        Right →
                      </button>
                      <button
                        onClick={() => handleUpdateItem(selectedItem.id, { y: selectedItem.y - 15 })}
                        className="py-2 rounded-xl border border-borderSage bg-white hover:bg-sage-50 text-xs font-bold text-[#173C2B] shadow-2xs transition-all active:scale-95"
                      >
                        ↑ Up
                      </button>
                      <button
                        onClick={() => handleUpdateItem(selectedItem.id, { y: selectedItem.y + 15 })}
                        className="py-2 rounded-xl border border-borderSage bg-white hover:bg-sage-50 text-xs font-bold text-[#173C2B] shadow-2xs transition-all active:scale-95"
                      >
                        Down ↓
                      </button>
                    </div>
                  </div>

                  {/* B. Scale Proportion */}
                  <div>
                    <div className="flex justify-between text-[11px] font-bold mb-1">
                      <span className="text-[#173C2B]">Scale Proportion</span>
                      <span className="text-[#173C2B]">{Math.round(selectedItem.scale * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.4"
                      max="2.0"
                      step="0.05"
                      value={selectedItem.scale}
                      onChange={(e) =>
                        handleUpdateItem(selectedItem.id, { scale: parseFloat(e.target.value) })
                      }
                      className="w-full accent-[#D94D1E] cursor-pointer"
                    />
                  </div>

                  {/* C. Rotation & Mirroring */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-bold text-[#173C2B] shrink-0">
                      Rotation & Mirroring
                    </span>
                    <div className="flex items-center gap-1.5 flex-1 justify-end">
                      <button
                        onClick={() =>
                          handleUpdateItem(selectedItem.id, {
                            rotation: (selectedItem.rotation + 15) % 360,
                          })
                        }
                        className="py-2 px-3 rounded-xl border border-borderSage bg-white hover:bg-sage-50 text-xs font-bold text-[#173C2B] flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>+15°</span>
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateItem(selectedItem.id, { flipX: !selectedItem.flipX })
                        }
                        className="py-2 px-3 rounded-xl border border-borderSage bg-white hover:bg-sage-50 text-xs font-bold text-[#173C2B] flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
                      >
                        <FlipHorizontal className="w-3.5 h-3.5" />
                        <span>Mirror</span>
                      </button>
                    </div>
                  </div>

                  {/* D. Layer Ordering & Remove Action */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleBringForward(selectedItem.id)}
                        className="py-2 px-2.5 rounded-xl border border-borderSage bg-white hover:bg-sage-50 text-xs font-bold text-[#173C2B] flex items-center gap-1 shadow-2xs active:scale-95"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>Forward</span>
                      </button>
                      <button
                        onClick={() => handleSendBackward(selectedItem.id)}
                        className="py-2 px-2.5 rounded-xl border border-borderSage bg-white hover:bg-sage-50 text-xs font-bold text-[#173C2B] flex items-center gap-1 shadow-2xs active:scale-95"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                        <span>Backward</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(selectedItem.id)}
                      className="py-2 px-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1 shadow-2xs active:scale-95 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-6 text-center text-[#587763] text-xs">
                  Tap on any furniture in the room photo to adjust its position, scale, or rotation.
                </div>
              )}
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* 5. FLOATING EDITING TOOLBAR                                  */}
        {/* ============================================================ */}
        <div className="grid grid-cols-4 gap-1 p-1 rounded-full bg-white/80 backdrop-blur-md border border-white/80 shadow-2xs">
          <button
            onClick={() => setActiveTab("place")}
            className={`py-2 px-1 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "place"
                ? "bg-[#173C2B] text-white shadow-xs"
                : "text-[#173C2B]/80 hover:text-[#173C2B]"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Place</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("adjust");
              setPlacementControlsOpen(true);
            }}
            className={`py-2 px-1 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "adjust"
                ? "bg-[#173C2B] text-white shadow-xs"
                : "text-[#173C2B]/80 hover:text-[#173C2B]"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Adjust</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("layer");
              setPlacementControlsOpen(true);
            }}
            className={`py-2 px-1 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "layer"
                ? "bg-[#173C2B] text-white shadow-xs"
                : "text-[#173C2B]/80 hover:text-[#173C2B]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Layer</span>
          </button>
          <button
            onClick={() => setActiveTab("more")}
            className={`py-2 px-1 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "more"
                ? "bg-[#173C2B] text-white shadow-xs"
                : "text-[#173C2B]/80 hover:text-[#173C2B]"
            }`}
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
            <span>More</span>
          </button>
        </div>

        {/* MORE TAB DRAWER (Preset Room Switcher) */}
        {activeTab === "more" && (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white/80 shadow-xs flex flex-col gap-2.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-extrabold text-[#173C2B]">
                Choose Preset Room Photo
              </span>
              <button onClick={() => setActiveTab("place")} className="text-xs text-[#587763]">
                Close
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {sampleVisualizerRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => {
                    setRoomImage(room.image);
                    setActiveTab("place");
                  }}
                  className={`p-1.5 rounded-xl border text-left transition-all ${
                    roomImage === room.image
                      ? "border-[#173C2B] ring-2 ring-[#173C2B]/20 bg-white"
                      : "border-borderSage bg-white/70"
                  }`}
                >
                  <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden mb-1">
                    <Image src={room.image} alt={room.title} fill sizes="140px" className="object-cover" />
                  </div>
                  <span className="text-[11px] font-bold text-[#173C2B] truncate block">{room.type}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 5. FURNITURE CATALOGUE                                       */}
        {/* ============================================================ */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-white/80 shadow-xs flex flex-col gap-3">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-[#173C2B]">
              SELECT FURNITURE PIECE
            </span>
            <span className="text-[11px] text-[#587763] font-medium">Click to place</span>
          </div>

          {/* Search Field */}
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-[#587763] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search models..."
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-borderSage text-xs placeholder:text-[#587763]/70 focus:outline-none focus:border-[#173C2B]"
            />
          </div>

          {/* Category Chips (Horizontal Scroll) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setLibraryCategory(c.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
                  libraryCategory === c.id
                    ? "bg-[#173C2B] text-white shadow-2xs"
                    : "bg-white/90 text-[#173C2B] border border-borderSage hover:bg-white"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Horizontal Furniture Products Carousel */}
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
            {filteredProducts.map((product) => {
              const isSelected = selectedItem?.productId === product.id;
              return (
                <div
                  key={product.id}
                  onClick={() => handleAddFurniture(product)}
                  className={`w-[140px] shrink-0 bg-white rounded-2xl p-2.5 shadow-2xs flex flex-col justify-between group cursor-pointer transition-all ${
                    isSelected
                      ? "border-2 border-[#173C2B] ring-2 ring-[#173C2B]/15"
                      : "border border-borderSage hover:border-[#173C2B]/40"
                  }`}
                >
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-sage-50 mb-2">
                    <Image
                      src={product.images[0] || "/placeholder.png"}
                      alt={product.name}
                      fill
                      sizes="140px"
                      className="object-contain p-1.5"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddFurniture(product);
                      }}
                      aria-label={`Place ${product.name} in photo`}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-[#E5F0E1] hover:bg-[#173C2B] text-[#173C2B] hover:text-white flex items-center justify-center transition-colors shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-heading font-extrabold text-[12px] text-[#173C2B] leading-tight line-clamp-2">
                      {product.name}
                    </h4>
                    <p className="font-bold text-[11.5px] text-[#173C2B] mt-1">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
