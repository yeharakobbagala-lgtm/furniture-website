"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Grid,
  Trash2,
  Plus,
  ArrowRight,
  Ruler,
  Layers,
  ShoppingBag,
  RotateCw,
  Search,
  Check,
  AlertTriangle,
  Compass,
  Box,
  Layout,
  Copy,
  DoorOpen,
  AppWindow,
  PaintBucket,
  Download,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  X,
  Menu,
  Save,
  Sparkles,
} from "lucide-react";
import { Product, RoomItem, RoomDoor, RoomWindow, CollisionWarning, WallSide } from "@/types";
import { FloorFinishType, WallFinishType } from "@/stores/roomDesignerStore";
import { formatPrice } from "@/lib/utils";

interface RoomPlannerMobileViewProps {
  // Navigation & Header
  cartItemCount: number;
  // Room state
  roomWidth: number;
  roomLength: number;
  roomMetrics: { areaM2: number | string; areaSqFt: number | string; perimeterM: number | string };
  items: RoomItem[];
  doors: RoomDoor[];
  windows: RoomWindow[];
  warnings: CollisionWarning[];
  // View & Tool state
  viewMode: "2d" | "3d";
  setViewMode: (mode: "2d" | "3d") => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  gridSnap: boolean;
  setGridSnap: (snap: boolean) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  handleExportPlan: () => void;
  setSaveModalOpen: (open: boolean) => void;
  setBomModalOpen: (open: boolean) => void;
  // Canvas Component Renderers
  renderCanvas: () => React.ReactNode;
  // Selection
  selectedItemId: string | null;
  selectedItem: RoomItem | null | undefined;
  selectedProduct: Product | null | undefined;
  selectItem: (id: string | null) => void;
  // Item actions
  addItem: (product: Product) => void;
  updateItemRotation: (id: string, rotation: number) => void;
  updateItemColor: (id: string, color: string) => void;
  duplicateItem: (id: string) => void;
  removeItem: (id: string) => void;
  addItemToCart: (product: Product, quantity: number) => void;
  // Products & Filtering
  products: Product[];
  // Openings
  onAddDoorWall: (wall: WallSide, type: "single" | "double" | "sliding") => void;
  removeDoor: (id: string) => void;
  onAddWindowWall: (wall: WallSide, type: "standard" | "large" | "casement") => void;
  removeWindow: (id: string) => void;
  // Room Size & Presets
  setRoomDimensions: (width: number, length: number) => void;
  roomPresets: Array<{ id: string; name: string; width: number; length: number; description: string; [key: string]: any }>;
  loadPreset: (preset: any) => void;
  // Finishes
  floorType: FloorFinishType;
  setFloorType: (floor: FloorFinishType) => void;
  wallFinish: WallFinishType;
  setWallFinish: (finish: WallFinishType) => void;
  wallColor: string;
  setWallColor: (color: string) => void;
}

export default function RoomPlannerMobileView({
  cartItemCount,
  roomWidth,
  roomLength,
  roomMetrics,
  items,
  doors,
  windows,
  warnings,
  viewMode,
  setViewMode,
  undo,
  redo,
  canUndo,
  canRedo,
  gridSnap,
  setGridSnap,
  zoom,
  setZoom,
  handleExportPlan,
  setSaveModalOpen,
  setBomModalOpen,
  renderCanvas,
  selectedItemId,
  selectedItem,
  selectedProduct,
  selectItem,
  addItem,
  updateItemRotation,
  updateItemColor,
  duplicateItem,
  removeItem,
  addItemToCart,
  products,
  onAddDoorWall,
  removeDoor,
  onAddWindowWall,
  removeWindow,
  setRoomDimensions,
  roomPresets,
  loadPreset,
  floorType,
  setFloorType,
  wallFinish,
  setWallFinish,
  wallColor,
  setWallColor,
}: RoomPlannerMobileViewProps) {
  const [plannerTab, setPlannerTab] = useState<"catalog" | "openings" | "room-size" | "finishes">("catalog");
  const [libraryCategory, setLibraryCategory] = useState<string>("all");
  const [librarySearch, setLibrarySearch] = useState<string>("");
  const [isBottomSheetCollapsed, setIsBottomSheetCollapsed] = useState(false);

  // Automatically open/expand bottom sheet whenever any furniture piece is touched or selected
  useEffect(() => {
    if (selectedItemId) {
      setIsBottomSheetCollapsed(false);
    }
  }, [selectedItemId]);

  // Filter products for the catalog
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !librarySearch ||
        p.name.toLowerCase().includes(librarySearch.toLowerCase()) ||
        p.category.toLowerCase().includes(librarySearch.toLowerCase());
      const matchesCat =
        libraryCategory === "all" ||
        p.category.toLowerCase() === libraryCategory.toLowerCase();
      return matchesSearch && matchesCat;
    });
  }, [products, libraryCategory, librarySearch]);

  const categories = [
    { id: "all", label: "All" },
    { id: "living room", label: "Sofas" },
    { id: "lounge seating", label: "Lounge Chairs" },
    { id: "dining room", label: "Dining Tables" },
    { id: "bedroom", label: "Beds" },
    { id: "storage", label: "Storage" },
  ];

  const hasIssues = warnings.length > 0;

  return (
    <div className="w-full min-h-screen bg-[#EDF3EB] text-[#173C2B] flex flex-col font-sans select-none pb-28">
      {/* ============================================================ */}
      {/* 1. MOBILE FLOATING HEADER                                    */}
      {/* ============================================================ */}
      <header className="sticky top-2 z-40 px-3 sm:px-4 pt-2">
        <div className="w-full max-w-[480px] mx-auto bg-[#E5F0E1]/90 backdrop-blur-xl rounded-full py-2 px-3 sm:px-4 flex items-center justify-between border border-white/70 shadow-[0_6px_20px_rgba(23,60,43,0.06)]">
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
        {/* 2. PLANNER INFORMATION PANEL                                 */}
        {/* ============================================================ */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 px-4 border border-white/80 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#173C2B] text-[#E0A97E] flex items-center justify-center shrink-0 shadow-sm">
            <Compass className="w-4 h-4 text-[#E0A97E]" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-[15px] sm:text-base text-[#173C2B] truncate leading-tight">
                Square Studio Planner
              </h1>
              <span className="text-[9.5px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-[#E5F0E1] text-[#173C2B] border border-[#173C2B]/10 shrink-0">
                PRO CAD
              </span>
            </div>
            <span className="text-[11px] text-[#587763] font-medium leading-normal truncate mt-0.5">
              {roomWidth.toFixed(1)}m × {roomLength.toFixed(1)}m ({roomMetrics.areaM2} m² / {roomMetrics.areaSqFt} sq ft) • {items.length} units
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. PLANNER TOOLBAR (HORIZONTALLY SCROLLABLE)                 */}
        {/* ============================================================ */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 px-0.5">
          {/* 2D / 3D Toggle */}
          <div className="flex items-center bg-white/80 p-0.5 rounded-xl border border-borderSage shrink-0 shadow-2xs">
            <button
              onClick={() => setViewMode("2d")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "2d"
                  ? "bg-[#173C2B] text-white shadow-xs"
                  : "text-[#173C2B] hover:text-[#D94D1E]"
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>2D Floor Plan</span>
            </button>
            <button
              onClick={() => setViewMode("3d")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "3d"
                  ? "bg-[#173C2B] text-white shadow-xs"
                  : "text-[#173C2B] hover:text-[#D94D1E]"
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Visualizer</span>
            </button>
          </div>

          {/* Undo / Redo */}
          <div className="flex items-center border border-borderSage rounded-xl bg-white/90 overflow-hidden shrink-0 shadow-2xs">
            <button
              onClick={undo}
              disabled={!canUndo}
              aria-label="Undo"
              className="p-2 text-[#173C2B] disabled:opacity-30 hover:bg-[#E5EDE1] transition-colors"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-borderSage" />
            <button
              onClick={redo}
              disabled={!canRedo}
              aria-label="Redo"
              className="p-2 text-[#173C2B] disabled:opacity-30 hover:bg-[#E5EDE1] transition-colors"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Snap */}
          <button
            onClick={() => setGridSnap(!gridSnap)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs ${
              gridSnap
                ? "bg-[#173C2B] text-white border-[#173C2B]"
                : "bg-white/90 border-borderSage text-[#173C2B]"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Snap 10cm</span>
          </button>

          {/* Zoom */}
          <div className="flex items-center border border-borderSage rounded-xl bg-white/90 shrink-0 shadow-2xs overflow-hidden">
            <button
              onClick={() => setZoom(Math.max(0.5, Number((zoom - 0.1).toFixed(1))))}
              aria-label="Zoom out"
              className="px-2.5 py-1.5 text-[#173C2B] hover:bg-[#E5EDE1] active:scale-90 transition-all flex items-center justify-center cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-bold text-[#587763] px-1.5 select-none min-w-[38px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(2.0, Number((zoom + 0.1).toFixed(1))))}
              aria-label="Zoom in"
              className="px-2.5 py-1.5 text-[#173C2B] hover:bg-[#E5EDE1] active:scale-90 transition-all flex items-center justify-center cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Export PNG */}
          <button
            onClick={handleExportPlan}
            aria-label="Export PNG"
            className="p-2 rounded-xl border border-borderSage bg-white/90 text-[#173C2B] hover:bg-[#E5EDE1] active:scale-95 transition-all shrink-0 shadow-2xs flex items-center justify-center cursor-pointer"
            title="Export 2D Room Plan as PNG"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Bill of Materials Button */}
          <button
            onClick={() => setBomModalOpen(true)}
            className="px-3 py-1.5 rounded-xl border border-borderSage bg-white/90 hover:bg-[#E5EDE1] active:scale-95 transition-all text-[#173C2B] text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#D94D1E]" />
            <span>BOM ({items.length})</span>
          </button>

          {/* Save Button */}
          <button
            onClick={() => setSaveModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#D94D1E] hover:bg-[#c34217] active:scale-95 transition-all text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>SAVE</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* 4. MAIN ROOM CANVAS (HIGHEST PRIORITY)                       */}
        {/* ============================================================ */}
        <div className="relative w-full h-[385px] sm:h-[425px] rounded-3xl overflow-hidden border border-white/80 shadow-xs bg-[#E6ECE4]">
          {renderCanvas()}
        </div>

        {/* ============================================================ */}
        {/* 5. ROOM PLANNER TABS                                         */}
        {/* ============================================================ */}
        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 shadow-2xs">
          <button
            onClick={() => setPlannerTab("catalog")}
            className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              plannerTab === "catalog"
                ? "bg-[#173C2B] text-white shadow-xs"
                : "text-[#173C2B]/80 hover:text-[#173C2B]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Catalog</span>
          </button>
          <button
            onClick={() => setPlannerTab("openings")}
            className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              plannerTab === "openings"
                ? "bg-[#173C2B] text-white shadow-xs"
                : "text-[#173C2B]/80 hover:text-[#173C2B]"
            }`}
          >
            <DoorOpen className="w-3.5 h-3.5" />
            <span>Openings</span>
          </button>
          <button
            onClick={() => setPlannerTab("room-size")}
            className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              plannerTab === "room-size"
                ? "bg-[#173C2B] text-white shadow-xs"
                : "text-[#173C2B]/80 hover:text-[#173C2B]"
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Room Size</span>
          </button>
          <button
            onClick={() => setPlannerTab("finishes")}
            className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              plannerTab === "finishes"
                ? "bg-[#173C2B] text-white shadow-xs"
                : "text-[#173C2B]/80 hover:text-[#173C2B]"
            }`}
          >
            <PaintBucket className="w-3.5 h-3.5" />
            <span>Finishes</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* 6. TAB CONTENT PANELS                                        */}
        {/* ============================================================ */}
        {/* TAB 1: FURNITURE CATALOG */}
        {plannerTab === "catalog" && (
          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 border border-white/80 shadow-xs flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#173C2B]">
                FURNITURE LIBRARY
              </span>
              <span className="text-xs text-[#587763] font-medium">
                {filteredProducts.length} models
              </span>
            </div>

            {/* Search Input */}
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-[#587763] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                placeholder="Search pieces (e.g. sofa, oak table)..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-borderSage text-xs placeholder:text-[#587763]/70 focus:outline-none focus:border-[#173C2B]"
              />
            </div>

            {/* Category Filter Pills */}
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

            {/* Horizontal Product Cards Carousel */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
              {filteredProducts.map((product) => {
                const isSelected = selectedProduct?.id === product.id;
                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      const matchingItem = items.find((i) => i.productId === product.id);
                      if (matchingItem) {
                        selectItem(matchingItem.id);
                      } else {
                        addItem(product);
                      }
                    }}
                    className={`w-[145px] shrink-0 bg-white rounded-2xl p-2.5 shadow-2xs flex flex-col justify-between group cursor-pointer transition-all ${
                      isSelected
                        ? "border-2 border-[#0D9488] ring-2 ring-[#0D9488]/15"
                        : "border border-borderSage hover:border-[#173C2B]/40"
                    }`}
                  >
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-sage-50 mb-2">
                      <Image
                        src={product.images[0] || "/placeholder.png"}
                        alt={product.name}
                        fill
                        sizes="145px"
                        className="object-contain p-1.5"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addItem(product);
                        }}
                        aria-label={`Add ${product.name} to room`}
                        className="absolute top-1 right-1 w-6 h-6 rounded-lg bg-[#E4F0DF] hover:bg-[#173C2B] text-[#173C2B] hover:text-white flex items-center justify-center transition-colors shadow-2xs"
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
        )}

        {/* TAB 2: OPENINGS (DOORS & WINDOWS) */}
        {plannerTab === "openings" && (
          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 border border-white/80 shadow-xs flex flex-col gap-3">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#173C2B]">
              ARCHITECTURAL OPENINGS
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onAddDoorWall("bottom", "single")}
                className="p-3 rounded-xl border border-borderSage bg-white hover:border-[#173C2B] text-left transition-all shadow-2xs"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#173C2B]">
                  <DoorOpen className="w-4 h-4 text-[#D94D1E]" />
                  <span>+ Add Door (0.9m)</span>
                </div>
                <p className="text-[10px] text-[#587763] mt-0.5">Bottom wall interior entrance</p>
              </button>

              <button
                onClick={() => onAddWindowWall("top", "standard")}
                className="p-3 rounded-xl border border-borderSage bg-white hover:border-[#173C2B] text-left transition-all shadow-2xs"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#173C2B]">
                  <AppWindow className="w-4 h-4 text-[#D94D1E]" />
                  <span>+ Add Window (1.4m)</span>
                </div>
                <p className="text-[10px] text-[#587763] mt-0.5">Top wall exterior glass</p>
              </button>
            </div>

            {/* Existing Openings List */}
            {(doors.length > 0 || windows.length > 0) && (
              <div className="pt-2 border-t border-borderSage/60 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[#587763]">
                  Placed Openings ({doors.length + windows.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {doors.map((d) => (
                    <div
                      key={d.id}
                      className="px-2.5 py-1 rounded-lg bg-white border border-borderSage text-[11px] flex items-center gap-1.5"
                    >
                      <span>Door ({d.wall} wall)</span>
                      <button
                        onClick={() => removeDoor(d.id)}
                        className="text-[#D94D1E] hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {windows.map((w) => (
                    <div
                      key={w.id}
                      className="px-2.5 py-1 rounded-lg bg-white border border-borderSage text-[11px] flex items-center gap-1.5"
                    >
                      <span>Window ({w.wall} wall)</span>
                      <button
                        onClick={() => removeWindow(w.id)}
                        className="text-[#D94D1E] hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ROOM SIZE & PRESETS */}
        {plannerTab === "room-size" && (
          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 border border-white/80 shadow-xs flex flex-col gap-3">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#173C2B]">
              ROOM DIMENSIONS
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-[#173C2B] block mb-1">
                  Width: {roomWidth.toFixed(1)} m
                </label>
                <input
                  type="range"
                  min="3.0"
                  max="10.0"
                  step="0.1"
                  value={roomWidth}
                  onChange={(e) => setRoomDimensions(parseFloat(e.target.value), roomLength)}
                  className="w-full accent-[#173C2B]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#173C2B] block mb-1">
                  Length: {roomLength.toFixed(1)} m
                </label>
                <input
                  type="range"
                  min="3.0"
                  max="10.0"
                  step="0.1"
                  value={roomLength}
                  onChange={(e) => setRoomDimensions(roomWidth, parseFloat(e.target.value))}
                  className="w-full accent-[#173C2B]"
                />
              </div>
            </div>

            {/* Presets */}
            <div className="pt-2 border-t border-borderSage/60">
              <span className="text-[10px] uppercase font-bold text-[#587763] block mb-1.5">
                Standard Room Presets
              </span>
              <div className="grid grid-cols-2 gap-2">
                {roomPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => loadPreset(preset)}
                    className="p-2 rounded-xl bg-white border border-borderSage text-left hover:border-[#173C2B] transition-all"
                  >
                    <p className="font-bold text-xs text-[#173C2B]">{preset.name}</p>
                    <p className="text-[10px] text-[#587763]">
                      {preset.width}m × {preset.length}m
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FINISHES */}
        {plannerTab === "finishes" && (
          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 border border-white/80 shadow-xs flex flex-col gap-3">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#173C2B]">
              FLOORING & WALL FINISHES
            </span>

            {/* Flooring Options */}
            <div>
              <span className="text-xs font-bold text-[#173C2B] block mb-1.5">Flooring Surface</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "light-oak", label: "Natural Oak" },
                  { id: "dark-walnut", label: "Smoked Walnut" },
                  { id: "herringbone", label: "French Parquet" },
                  { id: "concrete", label: "Loft Concrete" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFloorType(f.id as FloorFinishType)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      floorType === f.id
                        ? "bg-[#173C2B] text-white border-[#173C2B] shadow-2xs"
                        : "bg-white text-[#173C2B] border-borderSage hover:border-[#173C2B]"
                    }`}
                  >
                    <p className="font-bold text-xs">{f.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Wall Finishes */}
            <div className="pt-2 border-t border-borderSage/60">
              <span className="text-xs font-bold text-[#173C2B] block mb-1.5">Wall Color</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "warm-linen", hex: "#F4F7F2", label: "Warm Linen" },
                  { id: "sage-mist", hex: "#E5EDE1", label: "Sage Mist" },
                  { id: "studio-white", hex: "#FFFFFF", label: "Studio White" },
                  { id: "smoked-forest", hex: "#465D45", label: "Smoked Forest" },
                ].map((w) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      setWallFinish(w.id as WallFinishType);
                      setWallColor(w.hex);
                    }}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      wallFinish === w.id
                        ? "border-[#D94D1E] ring-1 ring-[#D94D1E] bg-white"
                        : "bg-white border-borderSage hover:border-[#173C2B]"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-gray-300 shrink-0"
                      style={{ backgroundColor: w.hex }}
                    />
                    <span className="font-bold text-xs text-[#173C2B]">{w.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 7. SPACE ENGINE AUDIT                                        */}
        {/* ============================================================ */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 px-4 border border-white/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className={`w-4 h-4 ${hasIssues ? "text-amber-600" : "text-[#173C2B]"}`} />
            <span className="font-heading font-extrabold text-xs text-[#173C2B] uppercase tracking-wide">
              SPACE ENGINE AUDIT
            </span>
          </div>

          <div
            className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 ${
              hasIssues
                ? "bg-amber-100 text-amber-800 border border-amber-300"
                : "bg-[#E4F0DF] text-[#173C2B] border border-[#173C2B]/15"
            }`}
          >
            {hasIssues ? (
              <>
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span>{warnings.length} Clearance Alert{warnings.length > 1 ? "s" : ""}</span>
              </>
            ) : (
              <span>Optimal Flow</span>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 8. SELECTED PIECE DETAILS POPUP (FIXED BOTTOM SHEET)         */}
      {/* Pops up from bottom when ANY 2D product in room is tapped   */}
      {/* ============================================================ */}
      {selectedItem && (
        <div
          id="selected-piece-details-card"
          key={selectedItem.id}
          className="fixed inset-x-0 bottom-0 z-50 max-w-lg mx-auto bg-white/98 backdrop-blur-2xl rounded-t-[28px] border-t border-gray-200/90 shadow-[0_-12px_40px_rgba(0,0,0,0.18)] p-4 sm:p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] transition-all duration-300 animate-slideUp"
        >
          {/* Collapsible Drag Handle */}
          <div
            onClick={() => setIsBottomSheetCollapsed(!isBottomSheetCollapsed)}
            className="w-12 h-1.5 rounded-full bg-gray-300 hover:bg-gray-400 mx-auto -mt-1 mb-3.5 cursor-pointer transition-colors"
          />

          {/* Header: Product Info & Price */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl bg-sage-50 overflow-hidden shrink-0 border border-borderSage">
                {selectedProduct?.images?.[0] ? (
                  <Image
                    src={selectedProduct.images[0]}
                    alt={selectedItem.name}
                    fill
                    className="object-contain p-1"
                  />
                ) : (
                  <div className="w-full h-full bg-[#173C2B]/10 flex items-center justify-center font-bold text-xs">
                    FP
                  </div>
                )}
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D94D1E] block">
                  SELECTED PIECE DETAILS
                </span>
                <h3 className="font-heading font-extrabold text-[14px] sm:text-[15px] text-[#173C2B] leading-tight">
                  {selectedItem.name}
                </h3>
                <p className="text-[11px] text-[#587763]">
                  {Math.round(selectedItem.width)} × {Math.round(selectedItem.height)} {selectedProduct?.dimensions?.height ? `× ${selectedProduct.dimensions.height} ` : ""}cm
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedProduct && (
                <span className="font-heading font-black text-sm sm:text-base text-[#173C2B] whitespace-nowrap">
                  {formatPrice(selectedProduct.price)}
                </span>
              )}
              <button
                onClick={() => selectItem(null)}
                aria-label="Close inspector"
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-[#173C2B] flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Expanded Content (Rotation, Finishes, Actions) */}
          {!isBottomSheetCollapsed && (
            <div className="mt-4 pt-3 border-t border-gray-100 space-y-3.5">
              {/* Rotation Angle & Fabric Swatches in 2 columns */}
              <div className="grid grid-cols-2 gap-3">
                {/* Rotation Angle */}
                <div>
                  <span className="text-[11px] font-bold text-[#173C2B] block mb-1.5">
                    Rotation Angle
                  </span>
                  <div className="grid grid-cols-4 gap-1">
                    {[0, 90, 180, 270].map((angle) => (
                      <button
                        key={angle}
                        onClick={() => updateItemRotation(selectedItem.id, angle)}
                        className={`py-1 rounded-lg text-xs font-bold transition-all ${
                          Math.round(selectedItem.rotation) % 360 === angle
                            ? "bg-[#173C2B] text-white shadow-2xs"
                            : "bg-gray-100 text-[#173C2B] hover:bg-gray-200"
                        }`}
                      >
                        {angle}°
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fabric / Finish Colors */}
                <div>
                  <span className="text-[11px] font-bold text-[#173C2B] block mb-1.5">
                    Finish / Fabric Color
                  </span>
                  <div className="flex items-center gap-2 pt-0.5">
                    {(selectedProduct?.colours && selectedProduct.colours.length > 0
                      ? selectedProduct.colours
                      : [
                          { hex: "#F8F7F0", name: "Oatmeal Bouclé" },
                          { hex: "#2E5339", name: "Forest Velvet" },
                          { hex: "#B85232", name: "Terracotta" },
                          { hex: "#1C2421", name: "Smoked Noir" },
                        ]
                    ).map((c) => {
                      const isColorActive =
                        selectedItem.colorHex === c.hex ||
                        (c.hex === "#F8F7F0" && (!selectedItem.colorHex || selectedItem.colorHex === "#FFFFFF" || selectedItem.colorHex === "#F8F7F0"));
                      return (
                        <button
                          key={c.hex}
                          onClick={() => updateItemColor(selectedItem.id, c.hex)}
                          aria-label={c.name}
                          className={`w-6 h-6 rounded-full border transition-all ${
                            isColorActive
                              ? "ring-2 ring-[#B85232] ring-offset-1 scale-110 border-[#B85232]"
                              : "border-gray-300 hover:scale-105"
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Actions: Duplicate, Add to Cart, Remove */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => duplicateItem(selectedItem.id)}
                  className="py-2.5 px-2 rounded-xl border border-borderSage bg-white hover:bg-sage-50 text-[11.5px] font-bold text-[#173C2B] flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all whitespace-nowrap"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplicate</span>
                </button>

                <button
                  onClick={() => {
                    if (selectedProduct) addItemToCart(selectedProduct, 1);
                  }}
                  className="py-2.5 px-2 rounded-xl bg-[#173C2B] hover:bg-[#102D21] text-[11.5px] font-bold text-white flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all whitespace-nowrap"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#E0A97E]" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => removeItem(selectedItem.id)}
                  className="py-2.5 px-2 rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-100 text-[11.5px] font-bold text-red-700 flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all whitespace-nowrap"
                >
                  <Trash2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
