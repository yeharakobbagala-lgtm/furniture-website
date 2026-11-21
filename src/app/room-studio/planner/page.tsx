"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Save,
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
  Maximize2,
  Copy,
  DoorOpen,
  AppWindow,
  Sliders,
  PaintBucket,
  Download,
  ShieldCheck,
  ChevronRight,
  Info,
} from "lucide-react";
import { useRoomDesignerStore, FloorFinishType, WallFinishType } from "@/stores/roomDesignerStore";
import { useUserStore } from "@/stores/userStore";
import { useCartStore } from "@/stores/cartStore";
import { products } from "@/data/products";
import { roomPresets } from "@/data/roomPresets";
import { formatPrice } from "@/lib/utils";
import { Product, RoomDoor, RoomWindow, WallSide } from "@/types";
import {
  evaluateRoomPlan,
  calculateRoomMetrics,
  PIXELS_PER_METER,
} from "@/features/room-planner/smartMeasurementEngine";

// Dynamically import Konva Canvas to prevent SSR issues
const RoomPlannerCanvas = dynamic(
  () => import("@/features/room-planner/RoomPlannerCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[580px] flex flex-col items-center justify-center bg-sage-50 text-forest-muted text-sm font-semibold gap-2">
        <div className="w-8 h-8 border-3 border-terracotta border-t-transparent rounded-full animate-spin" />
        <span>Loading 2D Architectural Floor Plan...</span>
      </div>
    ),
  }
);

// Dynamically import Three.js 3D View
const RoomPlanner3D = dynamic(
  () => import("@/features/room-planner/RoomPlanner3D"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[580px] flex flex-col items-center justify-center bg-sage-50 text-forest-muted text-sm font-semibold gap-2">
        <div className="w-8 h-8 border-3 border-forest-dark border-t-transparent rounded-full animate-spin" />
        <span>Initializing 3D Interactive Room Visualizer...</span>
      </div>
    ),
  }
);

type SidebarTab = "furniture" | "elements" | "templates" | "materials";

export default function RoomPlannerPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<SidebarTab>("furniture");
  const [libraryCategory, setLibraryCategory] = useState<string>("all");
  const [librarySearch, setLibrarySearch] = useState<string>("");
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [designNameInput, setDesignNameInput] = useState("Sanctuary Living Suite");
  const [savedNotice, setSavedNotice] = useState(false);
  const [bomModalOpen, setBomModalOpen] = useState(false);

  // Store bindings
  const {
    roomName,
    roomWidth,
    roomLength,
    wallHeight,
    wallThickness,
    wallColor,
    wallFinish,
    floorType,
    gridVisible,
    gridSnap,
    gridSnapSize,
    zoom,
    viewMode,
    items,
    doors,
    windows,
    selectedItemId,
    selectedDoorId,
    selectedWindowId,
    setRoomDimensions,
    setWallHeight,
    setWallThickness,
    setWallColor,
    setWallFinish,
    setFloorType,
    setGridVisible,
    setGridSnap,
    setGridSnapSize,
    setZoom,
    setViewMode,
    selectItem,
    selectDoor,
    selectWindow,
    addItem,
    updateItemPosition,
    updateItemRotation,
    updateItemSize,
    updateItemColor,
    duplicateItem,
    removeItem,
    addDoor,
    updateDoor,
    removeDoor,
    addWindow,
    updateWindow,
    removeWindow,
    resetRoom,
    loadPreset,
    undo,
    redo,
    past,
    future,
  } = useRoomDesignerStore();

  const saveRoomDesign = useUserStore((s) => s.saveRoomDesign);
  const addItemToCart = useCartStore((s) => s.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Geometric Calculations & Safety Clearances Audit
  const warnings = useMemo(() => {
    return evaluateRoomPlan(items, doors, windows, roomWidth, roomLength);
  }, [items, doors, windows, roomWidth, roomLength]);

  const roomMetrics = useMemo(() => {
    return calculateRoomMetrics(roomWidth, roomLength, items);
  }, [roomWidth, roomLength, items]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-sage-light py-24 flex items-center justify-center text-forest-deep font-semibold">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-forest-dark border-t-terracotta rounded-full animate-spin" />
          <p className="font-heading text-lg">Initializing Square Room Studio...</p>
        </div>
      </div>
    );
  }

  // Selected item object
  const selectedItem = items.find((i) => i.id === selectedItemId);
  const selectedDoor = doors.find((d) => d.id === selectedDoorId);
  const selectedWindow = windows.find((w) => w.id === selectedWindowId);

  // Selected item's original product
  const selectedProduct = selectedItem
    ? products.find((p) => p.id === selectedItem.productId)
    : null;

  // Filtered library products
  const libraryProducts = products.filter((p) => {
    if (libraryCategory !== "all" && p.category !== libraryCategory) return false;
    if (librarySearch.trim()) {
      const q = librarySearch.toLowerCase().trim();
      return p.name.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q);
    }
    return true;
  });

  const handleAddProductToRoom = (product: Product) => {
    // 1cm = 1px on canvas (exact 100 px/meter scale)
    const exactW = Math.max(40, product.dimensions.width);
    const exactD = Math.max(40, product.dimensions.depth);

    // Initial position centered inside room
    const initialX = Math.max(20, (roomWidth * PIXELS_PER_METER - exactW) / 2 + (Math.random() * 40 - 20));
    const initialY = Math.max(20, (roomLength * PIXELS_PER_METER - exactD) / 2 + (Math.random() * 40 - 20));

    addItem({
      productId: product.id,
      name: product.name,
      category: product.category,
      x: Math.round(initialX),
      y: Math.round(initialY),
      width: exactW,
      height: exactD,
      realWidthCm: product.dimensions.width,
      realDepthCm: product.dimensions.depth,
      realHeightCm: product.dimensions.height,
      rotation: 0,
      colorHex: product.colours[0]?.hex || "#465D45",
      image: product.images[0],
      transparentImage: product.transparentImage,
    });
  };

  const handleAddDoorToWall = (wall: WallSide, type: "single" | "double" | "sliding") => {
    const defaultWidth = type === "single" ? 0.9 : type === "double" ? 1.6 : 1.4;
    const maxOffset = (wall === "top" || wall === "bottom" ? roomWidth : roomLength) - defaultWidth - 0.2;
    addDoor({
      name: type === "single" ? "Interior Passage Door" : type === "double" ? "French Double Doors" : "Sliding Terrace Door",
      type,
      wall,
      offset: Math.max(0.2, Math.min(maxOffset, 1.0)),
      width: defaultWidth,
      swing: "inside",
    });
  };

  const handleAddWindowToWall = (wall: WallSide, type: "standard" | "large" | "casement") => {
    const defaultWidth = type === "standard" ? 1.2 : type === "large" ? 2.0 : 1.5;
    const maxOffset = (wall === "top" || wall === "bottom" ? roomWidth : roomLength) - defaultWidth - 0.2;
    addWindow({
      name: type === "standard" ? "Standard Casement Window" : type === "large" ? "Panoramic Picture Window" : "Linear High Window",
      type,
      wall,
      offset: Math.max(0.2, Math.min(maxOffset, 1.2)),
      width: defaultWidth,
      height: 1.4,
    });
  };

  const handleSaveDesign = (e: React.FormEvent) => {
    e.preventDefault();
    saveRoomDesign(designNameInput, items.length, roomName);
    setSaveModalOpen(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3500);
  };

  const handleExportPlan = () => {
    const canvasElement = document.querySelector("canvas");
    if (!canvasElement) return;
    const link = document.createElement("a");
    link.download = `Square-${roomName.toLowerCase().replace(/\s+/g, "-")}-plan.png`;
    link.href = canvasElement.toDataURL("image/png");
    link.click();
  };

  // Bill of materials
  const billOfMaterials = items.map((item) => {
    const prod = products.find((p) => p.id === item.productId) || products[0];
    return { item, product: prod };
  });

  const bomTotal = billOfMaterials.reduce((acc, curr) => acc + curr.product.price, 0);

  const handleAddAllBomToBag = () => {
    billOfMaterials.forEach(({ product }) => {
      addItemToCart(product, 1);
    });
    setBomModalOpen(false);
  };

  return (
    <div className="w-full bg-sage-light min-h-screen flex flex-col font-sans">
      {/* Top Architectural Studio Bar */}
      <header className="bg-ivory-warm border-b border-borderSage px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-soft sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/room-studio"
            className="flex items-center gap-2 group"
            title="Return to Room Studio Hub"
          >
            <div className="w-8 h-8 rounded-lg bg-forest-dark text-white flex items-center justify-center group-hover:bg-terracotta transition-colors">
              <Compass className="w-4 h-4 text-sage-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-sm sm:text-base text-forest-deep leading-none">
                  Square Studio Planner
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-forest-dark/10 text-forest-dark">
                  PRO CAD
                </span>
              </div>
              <span className="text-[11px] text-forest-muted">
                {roomWidth.toFixed(1)}m × {roomLength.toFixed(1)}m ({roomMetrics.areaM2} m² / {roomMetrics.areaSqFt} sq ft) • {items.length} units
              </span>
            </div>
          </Link>
        </div>

        {/* Center: 2D / 3D Mode Toggle */}
        <div className="flex items-center bg-sage-100/90 p-1 rounded-xl border border-borderSage">
          <button
            onClick={() => setViewMode("2d")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "2d"
              ? "bg-forest-dark text-white shadow-soft"
              : "text-forest-deep hover:text-terracotta"
              }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>2D Floor Plan</span>
          </button>
          <button
            onClick={() => setViewMode("3d")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "3d"
              ? "bg-forest-dark text-white shadow-soft"
              : "text-forest-deep hover:text-terracotta"
              }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Visualizer</span>
          </button>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Undo / Redo */}
          <div className="flex items-center border border-borderSage rounded-lg bg-white overflow-hidden">
            <button
              onClick={undo}
              disabled={past.length === 0}
              className="p-2 text-forest-deep disabled:opacity-30 hover:bg-sage-100 transition-colors"
              title="Undo last action"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-borderSage" />
            <button
              onClick={redo}
              disabled={future.length === 0}
              className="p-2 text-forest-deep disabled:opacity-30 hover:bg-sage-100 transition-colors"
              title="Redo action"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Grid snapping toggle */}
          <button
            onClick={() => setGridSnap(!gridSnap)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${gridSnap
              ? "bg-forest-dark text-white border-forest-dark"
              : "bg-white border-borderSage text-forest-deep hover:bg-sage-100"
              }`}
            title="Snap to 10cm architectural grid"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Snap 10cm</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center border border-borderSage rounded-lg bg-white">
            <button
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              className="p-2 text-forest-deep hover:bg-sage-100 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-bold text-forest-muted px-1.5 min-w-[36px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(2.0, zoom + 0.1))}
              className="p-2 text-forest-deep hover:bg-sage-100 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset Room */}
          <button
            onClick={resetRoom}
            className="p-2 rounded-lg border border-borderSage bg-white text-forest-deep hover:bg-red-50 hover:text-red-700 transition-colors"
            title="Clear all furniture"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-6 bg-borderSage mx-0.5" />

          {/* Export PNG */}
          <button
            onClick={handleExportPlan}
            className="px-2.5 py-1.5 rounded-lg border border-borderSage bg-white hover:bg-sage-100 text-forest-deep text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Export Plan as high-resolution PNG"
          >
            <Download className="w-3.5 h-3.5 text-forest-muted" />
            <span className="hidden xl:inline">Export PNG</span>
          </button>

          {/* Bill of Materials Button */}
          <button
            onClick={() => setBomModalOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-borderSage bg-white hover:bg-sage-100 text-forest-deep text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-terracotta" />
            <span className="hidden sm:inline">BOM</span> ({items.length})
          </button>

          {/* Save Design */}
          <button
            onClick={() => setSaveModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-soft"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </header>

      {savedNotice && (
        <div className="bg-emerald-700 text-white text-xs py-2 px-4 text-center font-semibold animate-fadeIn flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Room layout successfully saved to your Customer Account!
        </div>
      )}

      {/* Main Studio Workspace: Left (3 cols) + Center (6 cols) + Right (3 cols) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-65px)]">
        {/* Left Sidebar (Cols 1-3) */}
        <aside className="lg:col-span-3 bg-ivory-warm border-r border-borderSage flex flex-col max-h-[calc(100vh-65px)] overflow-hidden">
          {/* Sidebar Tab Header */}
          <div className="grid grid-cols-4 bg-sage-100/70 border-b border-borderSage p-1 gap-1">
            <button
              onClick={() => setActiveTab("furniture")}
              className={`py-2 px-1 text-[11px] font-bold rounded-lg flex flex-col items-center gap-1 transition-all ${activeTab === "furniture"
                ? "bg-white text-forest-deep shadow-sm"
                : "text-forest-muted hover:text-forest-deep"
                }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </button>
            <button
              onClick={() => setActiveTab("elements")}
              className={`py-2 px-1 text-[11px] font-bold rounded-lg flex flex-col items-center gap-1 transition-all ${activeTab === "elements"
                ? "bg-white text-forest-deep shadow-sm"
                : "text-forest-muted hover:text-forest-deep"
                }`}
            >
              <DoorOpen className="w-3.5 h-3.5" />
              <span>Openings</span>
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`py-2 px-1 text-[11px] font-bold rounded-lg flex flex-col items-center gap-1 transition-all ${activeTab === "templates"
                ? "bg-white text-forest-deep shadow-sm"
                : "text-forest-muted hover:text-forest-deep"
                }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Room Size</span>
            </button>
            <button
              onClick={() => setActiveTab("materials")}
              className={`py-2 px-1 text-[11px] font-bold rounded-lg flex flex-col items-center gap-1 transition-all ${activeTab === "materials"
                ? "bg-white text-forest-deep shadow-sm"
                : "text-forest-muted hover:text-forest-deep"
                }`}
            >
              <PaintBucket className="w-3.5 h-3.5" />
              <span>Finishes</span>
            </button>
          </div>

          {/* TAB 1: FURNITURE CATALOG */}
          {activeTab === "furniture" && (
            <div className="p-4 flex-1 flex flex-col space-y-3 overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-extrabold text-forest-deep">
                  Furniture Library
                </span>
                <span className="text-[10px] text-forest-muted font-semibold">
                  {libraryProducts.length} models
                </span>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-forest-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                  placeholder="Search pieces (e.g. sofa, oak table)..."
                  className="w-full bg-white border border-borderSage rounded-xl pl-8 pr-3 py-1.5 text-xs text-forest-deep placeholder:text-forest-muted/70 focus:outline-none focus:ring-1 focus:ring-forest-dark"
                />
              </div>

              {/* Category pills */}
              <div className="flex gap-1 overflow-x-auto pb-1 text-[11px] scrollbar-none">
                {[
                  "all",
                  "sofas",
                  "lounge-chairs",
                  "dining-tables",
                  "beds",
                  "coffee-tables",
                  "storage",
                  "office-furniture",
                  "lighting",
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setLibraryCategory(cat)}
                    className={`px-2.5 py-1 rounded-full whitespace-nowrap text-xs transition-colors ${libraryCategory === cat
                      ? "bg-forest-dark text-white font-bold"
                      : "bg-white border border-borderSage text-forest-muted hover:text-forest-deep"
                      }`}
                  >
                    {cat === "all" ? "All" : cat.replace("-", " ")}
                  </button>
                ))}
              </div>

              {/* List of library pieces */}
              <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                {libraryProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleAddProductToRoom(p)}
                    className="p-2.5 rounded-xl bg-white border border-borderSage hover:border-forest-dark hover:shadow-soft cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-lg bg-sage-50 overflow-hidden shrink-0 border border-borderSage/50">
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          sizes="48px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-heading font-bold text-forest-deep truncate group-hover:text-terracotta transition-colors">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-forest-muted">
                          {p.dimensions.width}W × {p.dimensions.depth}D × {p.dimensions.height}H cm
                        </p>
                        <span className="text-xs font-bold text-forest-deep">{formatPrice(p.price)}</span>
                      </div>
                    </div>
                    <button
                      className="p-1.5 rounded-lg bg-sage-100 group-hover:bg-forest-dark group-hover:text-white text-forest-deep transition-colors shrink-0"
                      title="Add to canvas"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ARCHITECTURAL ELEMENTS (DOORS & WINDOWS) */}
          {activeTab === "elements" && (
            <div className="p-4 flex-1 flex flex-col space-y-5 overflow-y-auto">
              <div>
                <span className="text-xs uppercase tracking-wider font-extrabold text-forest-deep block mb-1">
                  Architectural Openings
                </span>
                <p className="text-[11px] text-forest-muted">
                  Insert real doors and windows into perimeter walls to evaluate clearance and daylighting.
                </p>
              </div>

              {/* Doors section */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-forest-deep flex items-center gap-1.5">
                  <DoorOpen className="w-3.5 h-3.5 text-terracotta" /> Doors
                </span>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  {[
                    { type: "single", label: "Single Interior Door (0.90 m)", desc: "Standard residential room entry" },
                    { type: "double", label: "Double French Doors (1.60 m)", desc: "Formal living & veranda access" },
                    { type: "sliding", label: "Sliding Patio Door (1.40 m)", desc: "Balcony / garden opening" },
                  ].map((doorItem) => (
                    <div
                      key={doorItem.type}
                      className="p-3 bg-white border border-borderSage rounded-xl space-y-2 hover:border-forest-dark transition-colors"
                    >
                      <div>
                        <p className="font-heading font-bold text-forest-deep text-xs">{doorItem.label}</p>
                        <p className="text-[10px] text-forest-muted">{doorItem.desc}</p>
                      </div>
                      <div className="flex gap-1 pt-1">
                        <span className="text-[9px] text-forest-muted self-center mr-1">Wall:</span>
                        {(["top", "bottom", "left", "right"] as WallSide[]).map((w) => (
                          <button
                            key={w}
                            onClick={() => handleAddDoorToWall(w, doorItem.type as any)}
                            className="px-2 py-0.5 rounded bg-sage-100 hover:bg-forest-dark hover:text-white text-[10px] font-bold text-forest-deep uppercase transition-colors"
                          >
                            {w === "top" ? "North" : w === "bottom" ? "South" : w === "left" ? "West" : "East"}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Windows section */}
              <div className="space-y-2 pt-2 border-t border-borderSage">
                <span className="text-xs font-bold text-forest-deep flex items-center gap-1.5">
                  <AppWindow className="w-3.5 h-3.5 text-terracotta" /> Windows
                </span>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  {[
                    { type: "standard", label: "Standard Casement (1.20 m)", desc: "Dual glass pane opening" },
                    { type: "large", label: "Panoramic Picture Window (2.00 m)", desc: "Generous daylight view" },
                  ].map((winItem) => (
                    <div
                      key={winItem.type}
                      className="p-3 bg-white border border-borderSage rounded-xl space-y-2 hover:border-forest-dark transition-colors"
                    >
                      <div>
                        <p className="font-heading font-bold text-forest-deep text-xs">{winItem.label}</p>
                        <p className="text-[10px] text-forest-muted">{winItem.desc}</p>
                      </div>
                      <div className="flex gap-1 pt-1">
                        <span className="text-[9px] text-forest-muted self-center mr-1">Wall:</span>
                        {(["top", "bottom", "left", "right"] as WallSide[]).map((w) => (
                          <button
                            key={w}
                            onClick={() => handleAddWindowToWall(w, winItem.type as any)}
                            className="px-2 py-0.5 rounded bg-sage-100 hover:bg-forest-dark hover:text-white text-[10px] font-bold text-forest-deep uppercase transition-colors"
                          >
                            {w === "top" ? "North" : w === "bottom" ? "South" : w === "left" ? "West" : "East"}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Placed Openings summary */}
              {(doors.length > 0 || windows.length > 0) && (
                <div className="p-3 bg-sage-50 border border-borderSage rounded-xl space-y-2 text-xs">
                  <span className="font-bold text-forest-deep block">Active Openings</span>
                  <div className="space-y-1">
                    {doors.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => {
                          selectDoor(d.id);
                          selectItem(null);
                          selectWindow(null);
                        }}
                        className={`flex items-center justify-between p-1.5 rounded cursor-pointer ${selectedDoorId === d.id ? "bg-terracotta text-white font-bold" : "hover:bg-white text-forest-deep"
                          }`}
                      >
                        <span>Door on {d.wall} ({d.width}m)</span>
                        <Trash2
                          className="w-3 h-3 hover:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeDoor(d.id);
                          }}
                        />
                      </div>
                    ))}
                    {windows.map((w) => (
                      <div
                        key={w.id}
                        onClick={() => {
                          selectWindow(w.id);
                          selectItem(null);
                          selectDoor(null);
                        }}
                        className={`flex items-center justify-between p-1.5 rounded cursor-pointer ${selectedWindowId === w.id ? "bg-terracotta text-white font-bold" : "hover:bg-white text-forest-deep"
                          }`}
                      >
                        <span>Window on {w.wall} ({w.width}m)</span>
                        <Trash2
                          className="w-3 h-3 hover:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeWindow(w.id);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ROOM SIZE & PRESETS */}
          {activeTab === "templates" && (
            <div className="p-4 flex-1 flex flex-col space-y-5 overflow-y-auto">
              <div>
                <span className="text-xs uppercase tracking-wider font-extrabold text-forest-deep block mb-1">
                  Architectural Dimensions
                </span>
                <p className="text-[11px] text-forest-muted">
                  Configure real metric measurements for walls, ceiling height, and floor area.
                </p>
              </div>

              {/* Exact room measurements inputs */}
              <div className="p-4 bg-white border border-borderSage rounded-2xl space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-forest-muted uppercase block mb-1">
                      Width (Meters)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="2.5"
                      max="14"
                      value={roomWidth}
                      onChange={(e) => setRoomDimensions(parseFloat(e.target.value) || 4, roomLength)}
                      className="w-full bg-sage-50 border border-borderSage rounded-lg px-2.5 py-1.5 text-xs font-bold text-forest-deep"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-forest-muted uppercase block mb-1">
                      Length (Meters)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="2.5"
                      max="14"
                      value={roomLength}
                      onChange={(e) => setRoomDimensions(roomWidth, parseFloat(e.target.value) || 4)}
                      className="w-full bg-sage-50 border border-borderSage rounded-lg px-2.5 py-1.5 text-xs font-bold text-forest-deep"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-forest-muted uppercase block mb-1">
                    Ceiling Height (Meters)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="2.2"
                    max="5.0"
                    value={wallHeight}
                    onChange={(e) => setWallHeight(parseFloat(e.target.value) || 2.8)}
                    className="w-full bg-sage-50 border border-borderSage rounded-lg px-2.5 py-1.5 text-xs font-bold text-forest-deep"
                  />
                </div>
              </div>

              {/* Presets List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-forest-deep block">
                  Curated Room Blueprints
                </span>
                <div className="space-y-2">
                  {roomPresets.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => loadPreset(preset)}
                      className="p-3 rounded-xl bg-white border border-borderSage hover:border-forest-dark hover:shadow-soft cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div>
                        <p className="font-heading font-bold text-xs text-forest-deep group-hover:text-terracotta transition-colors">
                          {preset.name}
                        </p>
                        <p className="text-[10px] text-forest-muted">
                          {preset.width}m × {preset.length}m • {preset.description}
                        </p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-forest-muted group-hover:text-terracotta group-hover:translate-x-0.5 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MATERIALS & FINISHES */}
          {activeTab === "materials" && (
            <div className="p-4 flex-1 flex flex-col space-y-5 overflow-y-auto">
              <div>
                <span className="text-xs uppercase tracking-wider font-extrabold text-forest-deep block mb-1">
                  Flooring & Wall Surfaces
                </span>
                <p className="text-[11px] text-forest-muted">
                  Select materials that reflect realistic interior lighting in both 2D and 3D visualizers.
                </p>
              </div>

              {/* Flooring options */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-forest-deep block">Flooring Surfaces</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: "light-oak", label: "Light Natural Oak", desc: "Scandinavian warmth" },
                    { id: "dark-walnut", label: "Smoked Walnut", desc: "Rich editorial contrast" },
                    { id: "herringbone", label: "French Herringbone", desc: "Classic chevron parquet" },
                    { id: "concrete", label: "Polished Concrete", desc: "Contemporary loft stone" },
                    { id: "marble", label: "Calacatta Marble", desc: "Polished ivory stone" },
                    { id: "terrazzo", label: "Modern Terrazzo", desc: "Venetian composite" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFloorType(f.id as FloorFinishType)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${floorType === f.id
                        ? "bg-forest-dark text-white border-forest-dark shadow-soft"
                        : "bg-white text-forest-deep border-borderSage hover:border-forest-dark"
                        }`}
                    >
                      <p className="font-bold text-xs leading-tight">{f.label}</p>
                      <p className={`text-[9px] mt-0.5 ${floorType === f.id ? "text-sage-200" : "text-forest-muted"}`}>
                        {f.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Wall Finishes */}
              <div className="space-y-2 pt-3 border-t border-borderSage">
                <span className="text-xs font-bold text-forest-deep block">Wall Paint & Plaster</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
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
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${wallFinish === w.id
                        ? "border-terracotta ring-1 ring-terracotta bg-white"
                        : "bg-white border-borderSage hover:border-forest-dark"
                        }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-borderSage shrink-0"
                        style={{ backgroundColor: w.hex }}
                      />
                      <span className="font-bold text-xs text-forest-deep">{w.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Centre Canvas (Cols 4-9) */}
        <main className="lg:col-span-6 relative flex flex-col bg-sage-50 min-h-[580px] overflow-hidden">
          {viewMode === "2d" ? (
            <RoomPlannerCanvas
              items={items}
              doors={doors}
              windows={windows}
              roomWidth={roomWidth}
              roomLength={roomLength}
              wallColor={wallColor}
              floorType={floorType}
              gridVisible={gridVisible}
              gridSnap={gridSnap}
              gridSnapSize={gridSnapSize}
              zoom={zoom}
              selectedItemId={selectedItemId}
              selectedDoorId={selectedDoorId}
              selectedWindowId={selectedWindowId}
              warnings={warnings}
              onSelectItem={(id) => {
                selectItem(id);
                if (id) {
                  selectDoor(null);
                  selectWindow(null);
                }
              }}
              onSelectDoor={(id) => {
                selectDoor(id);
                if (id) {
                  selectItem(null);
                  selectWindow(null);
                }
              }}
              onSelectWindow={(id) => {
                selectWindow(id);
                if (id) {
                  selectItem(null);
                  selectDoor(null);
                }
              }}
              onUpdatePosition={updateItemPosition}
              onUpdateRotation={updateItemRotation}
            />
          ) : (
            <RoomPlanner3D
              items={items}
              doors={doors}
              windows={windows}
              roomWidth={roomWidth}
              roomLength={roomLength}
              wallHeight={wallHeight}
              wallThickness={wallThickness}
              wallColor={wallColor}
              floorType={floorType}
              selectedItemId={selectedItemId}
              onSelectItem={selectItem}
            />
          )}

          {/* Quick Floating Status Pill */}
          <div className="absolute bottom-3 left-4 right-4 sm:right-auto bg-ivory-warm/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-borderSage text-xs text-forest-deep flex items-center justify-between sm:justify-start gap-4 shadow-soft z-10 pointer-events-none">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-[11px]">
                {viewMode === "2d" ? "Architectural Top-Down CAD" : "Real-Time 3D Engine"}
              </span>
            </div>
            <span className="text-forest-muted text-[11px]">
              Scale: 1m = 100px • Snapping: {gridSnap ? "Active (10cm)" : "Off"}
            </span>
          </div>
        </main>

        {/* Right Properties & Clearance Alerts Sidebar (Cols 10-12) */}
        <aside className="lg:col-span-3 bg-ivory-warm border-l border-borderSage p-5 space-y-5 max-h-[calc(100vh-65px)] overflow-y-auto">
          {/* 1. TOP PRIORITY: INSPECTOR FOR SELECTED FURNITURE ITEM */}
          {selectedItem && (
            <div className="space-y-4 pb-4 border-b border-borderSage">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-terracotta/10 text-terracotta">
                  Selected Piece Details
                </span>
                {selectedProduct && (
                  <span className="text-xs font-extrabold text-forest-deep">
                    {formatPrice(selectedProduct.price)}
                  </span>
                )}
              </div>

              {/* Product Header Card */}
              <div className="p-3 bg-white border border-borderSage rounded-2xl flex items-center gap-3 shadow-soft">
                <div className="relative w-14 h-14 rounded-xl bg-sage-50 overflow-hidden shrink-0 border border-borderSage/60">
                  <Image
                    src={selectedItem.image || selectedProduct?.images[0] || "/placeholder.jpg"}
                    alt={selectedItem.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[9px] uppercase font-bold text-terracotta block">
                    {selectedItem.category}
                  </span>
                  <h3 className="font-heading font-extrabold text-xs text-forest-deep truncate">
                    {selectedItem.name}
                  </h3>
                  <p className="text-[10px] text-forest-muted">
                    {Math.round(selectedItem.width)}W × {Math.round(selectedItem.height)}D cm
                  </p>
                </div>
              </div>

              {/* Specific Warnings for this Selected Item */}
              {warnings.some((w) => w.itemIds.includes(selectedItem.id)) && (
                <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl space-y-1 text-xs">
                  <span className="font-bold text-amber-900 text-[11px] flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Space Engine Alert:
                  </span>
                  {warnings
                    .filter((w) => w.itemIds.includes(selectedItem.id))
                    .map((w, i) => (
                      <p key={i} className="text-[10px] text-amber-800 leading-tight">
                        • {w.message}
                      </p>
                    ))}
                </div>
              )}

              {/* Exact metric dimensions callout */}
              <div className="p-3 bg-white border border-borderSage rounded-xl space-y-1.5 text-xs">
                <span className="text-[10px] font-bold uppercase text-forest-muted block">
                  Product Dimensions (Metric)
                </span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-1.5 bg-sage-50 rounded-lg">
                    <span className="text-[9px] text-forest-muted block">Width</span>
                    <strong className="text-xs text-forest-deep">{Math.round(selectedItem.width)} cm</strong>
                  </div>
                  <div className="p-1.5 bg-sage-50 rounded-lg">
                    <span className="text-[9px] text-forest-muted block">Depth</span>
                    <strong className="text-xs text-forest-deep">{Math.round(selectedItem.height)} cm</strong>
                  </div>
                  <div className="p-1.5 bg-sage-50 rounded-lg">
                    <span className="text-[9px] text-forest-muted block">Height</span>
                    <strong className="text-xs text-forest-deep">
                      {selectedItem.realHeightCm || 85} cm
                    </strong>
                  </div>
                </div>
              </div>

              {/* Position coordinates */}
              <div className="p-3 bg-white border border-borderSage rounded-xl space-y-1.5 text-xs">
                <span className="text-[10px] font-bold uppercase text-forest-muted block">
                  Floor Placement Coordinates
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-forest-muted block">X (from Left wall)</label>
                    <span className="font-bold text-forest-deep">
                      {(selectedItem.x / PIXELS_PER_METER).toFixed(2)} m
                    </span>
                  </div>
                  <div>
                    <label className="text-[10px] text-forest-muted block">Y (from Top wall)</label>
                    <span className="font-bold text-forest-deep">
                      {(selectedItem.y / PIXELS_PER_METER).toFixed(2)} m
                    </span>
                  </div>
                </div>
              </div>

              {/* Rotation buttons */}
              <div>
                <label className="text-xs font-bold text-forest-deep block mb-1.5">
                  Rotation Angle ({selectedItem.rotation}°)
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-xs">
                  {[0, 90, 180, 270].map((deg) => (
                    <button
                      key={deg}
                      onClick={() => updateItemRotation(selectedItem.id, deg)}
                      className={`py-1.5 rounded-lg border text-xs font-bold transition-colors ${selectedItem.rotation === deg
                        ? "bg-forest-dark text-white border-forest-dark"
                        : "bg-white border-borderSage text-forest-deep hover:bg-sage-100"
                        }`}
                    >
                      {deg}°
                    </button>
                  ))}
                </div>
              </div>

              {/* Color swatch selection */}
              {selectedProduct && selectedProduct.colours.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-forest-deep block mb-1.5">
                    Finish / Fabric Color
                  </label>
                  <div className="flex gap-2">
                    {selectedProduct.colours.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => updateItemColor(selectedItem.id, c.hex)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${selectedItem.colorHex === c.hex
                          ? "border-terracotta scale-110 shadow-sm"
                          : "border-borderSage hover:scale-105"
                          }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons: Duplicate, Add to Cart, Remove */}
              <div className="space-y-2 pt-1">
                <div className="flex gap-2">
                  <button
                    onClick={() => duplicateItem(selectedItem.id)}
                    className="flex-1 py-2 rounded-xl border border-borderSage bg-white hover:bg-sage-100 text-forest-deep text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" /> Duplicate
                  </button>
                  {selectedProduct && (
                    <button
                      onClick={() => addItemToCart(selectedProduct, 1)}
                      className="flex-1 py-2 rounded-xl bg-forest-dark hover:bg-forest-deep text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-terracotta" /> Add to Cart
                    </button>
                  )}
                </div>

                <button
                  onClick={() => removeItem(selectedItem.id)}
                  className="w-full py-2 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove from Room
                </button>
              </div>
            </div>
          )}

          {/* INSPECTOR: DOOR SELECTED */}
          {selectedDoor && (
            <div className="space-y-4 pb-4 border-b border-borderSage">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-terracotta tracking-wider">
                  Door Inspector
                </span>
                <h3 className="font-heading font-bold text-sm text-forest-deep">
                  {selectedDoor.name}
                </h3>
              </div>

              {/* Offset along wall slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-forest-muted">Offset Along Wall</span>
                  <span className="font-bold text-forest-deep">{selectedDoor.offset.toFixed(2)} m</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max={(selectedDoor.wall === "top" || selectedDoor.wall === "bottom" ? roomWidth : roomLength) - selectedDoor.width - 0.1}
                  step="0.05"
                  value={selectedDoor.offset}
                  onChange={(e) => updateDoor(selectedDoor.id, { offset: parseFloat(e.target.value) })}
                  className="w-full accent-terracotta cursor-pointer"
                />
              </div>

              {/* Door width slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-forest-muted">Door Opening Width</span>
                  <span className="font-bold text-forest-deep">{selectedDoor.width.toFixed(2)} m</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="2.4"
                  step="0.05"
                  value={selectedDoor.width}
                  onChange={(e) => updateDoor(selectedDoor.id, { width: parseFloat(e.target.value) })}
                  className="w-full accent-terracotta cursor-pointer"
                />
              </div>

              <button
                onClick={() => removeDoor(selectedDoor.id)}
                className="w-full py-2 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Door
              </button>
            </div>
          )}

          {/* INSPECTOR: WINDOW SELECTED */}
          {selectedWindow && (
            <div className="space-y-4 pb-4 border-b border-borderSage">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-terracotta tracking-wider">
                  Window Inspector
                </span>
                <h3 className="font-heading font-bold text-sm text-forest-deep">
                  {selectedWindow.name}
                </h3>
              </div>

              {/* Offset along wall slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-forest-muted">Offset Along Wall</span>
                  <span className="font-bold text-forest-deep">{selectedWindow.offset.toFixed(2)} m</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max={(selectedWindow.wall === "top" || selectedWindow.wall === "bottom" ? roomWidth : roomLength) - selectedWindow.width - 0.1}
                  step="0.05"
                  value={selectedWindow.offset}
                  onChange={(e) => updateWindow(selectedWindow.id, { offset: parseFloat(e.target.value) })}
                  className="w-full accent-terracotta cursor-pointer"
                />
              </div>

              {/* Window width slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-forest-muted">Window Width</span>
                  <span className="font-bold text-forest-deep">{selectedWindow.width.toFixed(2)} m</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="3.2"
                  step="0.1"
                  value={selectedWindow.width}
                  onChange={(e) => updateWindow(selectedWindow.id, { width: parseFloat(e.target.value) })}
                  className="w-full accent-terracotta cursor-pointer"
                />
              </div>

              <button
                onClick={() => removeWindow(selectedWindow.id)}
                className="w-full py-2 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Window
              </button>
            </div>
          )}

          {/* NO SELECTION: ROOM ARCHITECTURE OVERVIEW */}
          {!selectedItem && !selectedDoor && !selectedWindow && (
            <div className="space-y-3 pb-4 border-b border-borderSage">
              <span className="text-xs uppercase tracking-wider font-extrabold text-forest-deep block">
                Room Architecture Metrics
              </span>

              <div className="p-4 bg-white border border-borderSage rounded-2xl space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-borderSage/60">
                  <span className="text-forest-muted">Net Floor Area</span>
                  <strong className="text-forest-deep">
                    {roomMetrics.areaM2} m² ({roomMetrics.areaSqFt} sq ft)
                  </strong>
                </div>
                <div className="flex justify-between py-1 border-b border-borderSage/60">
                  <span className="text-forest-muted">Wall Perimeter</span>
                  <strong className="text-forest-deep">{roomMetrics.perimeterM} meters</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-borderSage/60">
                  <span className="text-forest-muted">Furniture Footprint</span>
                  <strong className="text-forest-deep">{roomMetrics.usedAreaM2} m²</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-borderSage/60">
                  <span className="text-forest-muted">Open Circulation Space</span>
                  <strong className="text-emerald-700">
                    {100 - roomMetrics.coverageRatio}% free
                  </strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-forest-muted">Ceiling Clearance</span>
                  <strong className="text-forest-deep">{wallHeight.toFixed(2)} m</strong>
                </div>
              </div>

              <div className="p-3 bg-sage-50 rounded-xl border border-borderSage text-center">
                <p className="text-[11px] text-forest-muted">
                  Click or touch any placed piece to inspect real dimensions, rotate, change fabric colors, or duplicate.
                </p>
              </div>
            </div>
          )}

          {/* 2. SPACE ENGINE AUDIT & CLEARANCE CORRIDOR CHECK */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs uppercase tracking-wider font-extrabold text-forest-deep flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Space Engine Audit
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${warnings.length === 0
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-900"
                  }`}
              >
                {warnings.length === 0 ? "Optimal Flow" : `${warnings.length} Alerts`}
              </span>
            </div>

            {warnings.length === 0 ? (
              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Zero Spatial Collisions</p>
                  <p className="text-[10px] text-emerald-700 mt-0.5">
                    Clearance corridors exceed the 60 cm walking minimum. Door swing paths are unobstructed.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {warnings.map((w, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (w.itemIds[0]) selectItem(w.itemIds[0]);
                    }}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2 ${w.severity === "critical"
                      ? "bg-red-50 border-red-200 text-red-900 hover:bg-red-100/80"
                      : "bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100/80"
                      }`}
                  >
                    <AlertTriangle
                      className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${w.severity === "critical" ? "text-red-600" : "text-amber-600"
                        }`}
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold leading-tight">{w.message}</p>
                      <span className="text-[9px] uppercase font-bold tracking-wider opacity-70">
                        {w.type.replace("-", " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick BOM Summary Bar */}
          <div className="p-4 rounded-2xl bg-forest-dark text-white space-y-2 text-xs shadow-soft">
            <span className="font-bold text-sage-200 block text-[10px] uppercase tracking-wider">
              Selected Furnishings
            </span>
            <div className="flex justify-between">
              <span className="text-sage-200">Total Placed:</span>
              <strong className="text-white">{items.length} units</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-sage-200">Estimated Total:</span>
              <strong className="text-terracotta text-sm font-extrabold">
                {formatPrice(bomTotal)}
              </strong>
            </div>
            <button
              onClick={() => setBomModalOpen(true)}
              className="w-full mt-2 py-2 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> View Itemized BOM
            </button>
          </div>
        </aside>
      </div>

      {/* Bill of Materials Modal */}
      {bomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-deep/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-ivory-warm rounded-3xl p-6 sm:p-8 shadow-floating border border-borderSage">
            <h3 className="text-2xl font-heading font-extrabold text-forest-deep mb-1">
              Room Bill of Materials
            </h3>
            <p className="text-xs text-forest-muted mb-6">
              Complete inventory of pieces positioned in your current &ldquo;{roomName}&rdquo; canvas.
            </p>

            <div className="space-y-3 max-h-72 overflow-y-auto mb-6 pr-1">
              {billOfMaterials.length === 0 ? (
                <div className="py-8 text-center text-forest-muted text-xs">
                  No furniture pieces placed yet. Add furniture from the library catalog!
                </div>
              ) : (
                billOfMaterials.map(({ item, product }, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-borderSage flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg bg-sage-50 overflow-hidden shrink-0 border border-borderSage/50">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-heading font-bold text-forest-deep">{product.name}</p>
                        <p className="text-forest-muted text-[10px]">
                          {product.dimensions.width}W × {product.dimensions.depth}D × {product.dimensions.height}H cm
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-forest-deep">{formatPrice(product.price)}</span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-borderSage flex justify-between items-baseline mb-6">
              <span className="font-bold text-forest-deep">Total Room Furnishings:</span>
              <span className="text-2xl font-extrabold text-forest-deep">{formatPrice(bomTotal)}</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setBomModalOpen(false)}
                className="flex-1 py-3 rounded-xl border border-borderSage bg-white text-xs font-bold uppercase hover:bg-sage-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleAddAllBomToBag}
                disabled={items.length === 0}
                className="flex-1 py-3 rounded-xl bg-terracotta hover:bg-terracotta-hover disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-soft flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Add All to Shopping Bag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Design Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-deep/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-ivory-warm rounded-3xl p-6 sm:p-8 shadow-floating border border-borderSage">
            <h3 className="text-xl font-heading font-bold text-forest-deep mb-2">
              Save Room Design Locally
            </h3>
            <p className="text-xs text-forest-muted mb-4">
              Name this layout to access it anytime in your Customer Account dashboard.
            </p>

            <form onSubmit={handleSaveDesign} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-forest-deep block mb-1">
                  Design Title
                </label>
                <input
                  type="text"
                  required
                  value={designNameInput}
                  onChange={(e) => setDesignNameInput(e.target.value)}
                  className="w-full bg-white border border-borderSage rounded-xl px-3.5 py-2.5 text-xs text-forest-deep focus:outline-none focus:ring-1 focus:ring-forest-dark"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSaveModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-borderSage bg-white text-xs font-bold uppercase hover:bg-sage-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-hover text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-soft"
                >
                  Save Design
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
