"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  RotateCw,
  Trash2,
  Download,
  Plus,
  ArrowRight,
  Layers,
  FlipHorizontal,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Search,
} from "lucide-react";
import { sampleVisualizerRooms } from "@/data/roomPresets";
import { products } from "@/data/products";
import { VisualizerPlacedItem, Product } from "@/types";
import { formatPrice } from "@/lib/utils";

export default function RoomVisualizerPage() {
  const [mounted, setMounted] = useState(false);
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [placedItems, setPlacedItems] = useState<VisualizerPlacedItem[]>([
    {
      id: "vis-item-1",
      productId: "prod-1",
      name: "Arcadia Curved Bouclé Sofa",
      price: 3450,
      x: 180,
      y: 220,
      scale: 1,
      rotation: 0,
      flipX: false,
      zIndex: 1,
      transparentImage: "/furniture-cutouts/prod-1.png",
    },
  ]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>("vis-item-1");
  const [libraryCategory, setLibraryCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDraggingId, setActiveDraggingId] = useState<string | null>(null);
  const dragStartPos = useRef({ mouseX: 0, mouseY: 0, itemX: 0, itemY: 0 });

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    // Set default preset room image
    setRoomImage(sampleVisualizerRooms[0].image);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setRoomImage(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setRoomImage(url);
    }
  };

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    setSelectedItemId(id);
    setActiveDraggingId(id);
    const item = placedItems.find((i) => i.id === id);
    if (item) {
      dragStartPos.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        itemX: item.x,
        itemY: item.y,
      };
    }
  };

  // Window-level smooth dragging listener - catches moves everywhere reliably
  useEffect(() => {
    if (!activeDraggingId) return;

    const handleWindowPointerMove = (e: PointerEvent) => {
      const dx = e.clientX - dragStartPos.current.mouseX;
      const dy = e.clientY - dragStartPos.current.mouseY;
      handleUpdateItem(activeDraggingId, {
        x: Math.round(dragStartPos.current.itemX + dx),
        y: Math.round(dragStartPos.current.itemY + dy),
      });
    };

    const handleWindowPointerUp = () => {
      setActiveDraggingId(null);
    };

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
    };
  }, [activeDraggingId]);

  const selectedItem = placedItems.find((i) => i.id === selectedItemId);

  const handleAddFurniture = (prod: Product) => {
    const newItem: VisualizerPlacedItem = {
      id: `vis-${Date.now()}`,
      productId: prod.id,
      name: prod.name,
      price: prod.price,
      x: 120 + Math.random() * 60,
      y: 160 + Math.random() * 60,
      scale: 0.9,
      rotation: 0,
      flipX: false,
      zIndex: placedItems.length + 1,
      transparentImage: prod.transparentImage || `/furniture-cutouts/${prod.id}.png` || prod.images[0],
    };
    setPlacedItems([...placedItems, newItem]);
    setSelectedItemId(newItem.id);
  };

  const handleUpdateItem = (id: string, updates: Partial<VisualizerPlacedItem>) => {
    setPlacedItems(
      placedItems.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    const remaining = placedItems.filter((i) => i.id !== id);
    setPlacedItems(remaining);
    if (selectedItemId === id) {
      setSelectedItemId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  };

  const handleBringForward = (id: string) => {
    const item = placedItems.find((i) => i.id === id);
    if (!item) return;
    handleUpdateItem(id, { zIndex: item.zIndex + 1 });
  };

  const handleSendBackward = (id: string) => {
    const item = placedItems.find((i) => i.id === id);
    if (!item) return;
    handleUpdateItem(id, { zIndex: Math.max(1, item.zIndex - 1) });
  };

  // Download composited image simulation
  const handleDownloadPreview = () => {
    if (!roomImage) return;
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bgImg = new window.Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.src = roomImage;
    bgImg.onload = async () => {
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      // Render placed furniture in zIndex order
      const sorted = [...placedItems].sort((a, b) => a.zIndex - b.zIndex);
      const containerW = canvasContainerRef.current?.clientWidth || 640;
      const canvasScale = 1200 / Math.min(containerW, 800);

      for (const item of sorted) {
        await new Promise<void>((resolve) => {
          const itemImg = new window.Image();
          itemImg.crossOrigin = "anonymous";
          itemImg.src = item.transparentImage;
          itemImg.onload = () => {
            ctx.save();
            const posX = item.x * canvasScale;
            const posY = item.y * canvasScale;
            const drawW = 220 * canvasScale * item.scale;
            const drawH = 220 * canvasScale * item.scale;

            ctx.translate(posX + drawW / 2, posY + drawH / 2);
            ctx.rotate((item.rotation * Math.PI) / 180);
            if (item.flipX) ctx.scale(-1, 1);

            // Realistic contact floor shadow
            ctx.shadowColor = "rgba(0, 0, 0, 0.42)";
            ctx.shadowBlur = 24 * canvasScale;
            ctx.shadowOffsetY = 16 * canvasScale;

            ctx.drawImage(itemImg, -drawW / 2, -drawH / 2, drawW, drawH);
            ctx.restore();
            resolve();
          };
          itemImg.onerror = () => resolve();
        });
      }

      // Watermark brand
      ctx.fillStyle = "rgba(16, 45, 37, 0.85)";
      ctx.fillRect(30, 30, 240, 50);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("SQUARE ROOM STUDIO", 45, 62);

      // Trigger download
      const link = document.createElement("a");
      link.download = `square-room-preview-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-sage-light py-20 text-center text-forest-deep">
        Loading Room Photo Visualizer...
      </div>
    );
  }

  const filteredProducts = products.filter((p) => {
    if (libraryCategory !== "all" && p.category !== libraryCategory) return false;
    if (searchQuery.trim()) {
      return p.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="w-full bg-sage-light min-h-screen flex flex-col">
      {/* Top Header */}
      <div className="bg-ivory-warm border-b border-borderSage px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-terracotta text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-base text-forest-deep leading-none">
              Room Photo Furniture Visualizer
            </h1>
            <p className="text-[10px] text-forest-muted">
              Composite real furniture models onto your uploaded room photo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 rounded-xl border border-borderSage bg-white hover:bg-sage-100 text-xs font-semibold text-forest-deep flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-terracotta" />
            Upload My Room Photo
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
            className="px-4 py-1.5 rounded-xl bg-forest-dark hover:bg-forest-deep text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-soft"
          >
            <Download className="w-3.5 h-3.5" /> Download Composite
          </button>
        </div>
      </div>

      {/* Main Workspace: Left Catalog (3 cols) + Center Compositor (6 cols) + Right Controls (3 cols) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        {/* Left Furniture Library (Cols 1-3) */}
        <aside className="lg:col-span-3 bg-ivory-warm border-r border-borderSage p-5 space-y-4 max-h-[calc(100vh-130px)] overflow-y-auto">
          {/* Preset Room Selector */}
          <div className="p-3.5 rounded-2xl bg-sage-50 border border-borderSage space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-forest-deep block">
              Or Choose Preset Room Photo:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {sampleVisualizerRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setRoomImage(room.image)}
                  className={`p-1 rounded-xl border transition-all text-left overflow-hidden ${
                    roomImage === room.image
                      ? "border-forest-dark ring-2 ring-forest-dark/30 shadow-sm"
                      : "border-borderSage opacity-75 hover:opacity-100"
                  }`}
                >
                  <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden mb-1">
                    <Image src={room.image} alt={room.title} fill sizes="100px" className="object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-forest-deep truncate block">
                    {room.type}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Furniture Catalog */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-forest-deep">
                Select Furniture Piece
              </span>
              <span className="text-[11px] text-forest-muted">Click to place</span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-forest-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models..."
                className="w-full bg-white border border-borderSage rounded-lg pl-8 pr-2 py-1.5 text-xs text-forest-deep focus:outline-none"
              />
            </div>

            {/* Category tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1 text-[11px]">
              {["all", "sofas", "lounge-chairs", "dining-tables", "coffee-tables", "beds", "storage"].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setLibraryCategory(cat)}
                    className={`px-2 py-1 rounded whitespace-nowrap transition-colors ${
                      libraryCategory === cat
                        ? "bg-forest-dark text-white font-semibold"
                        : "bg-white border border-borderSage text-forest-muted"
                    }`}
                  >
                    {cat === "all" ? "All" : cat.replace("-", " ")}
                  </button>
                )
              )}
            </div>

            {/* Product items list */}
            <div className="space-y-2">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleAddFurniture(p)}
                  className="p-2.5 rounded-xl bg-white border border-borderSage hover:border-forest-dark hover:shadow-soft cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-lg bg-sage-50 overflow-hidden shrink-0">
                      <Image src={p.images[0]} alt={p.name} fill sizes="48px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-forest-deep truncate group-hover:text-terracotta transition-colors">
                        {p.name}
                      </p>
                      <span className="text-xs font-bold text-forest-deep">{formatPrice(p.price)}</span>
                    </div>
                  </div>
                  <button className="p-1.5 rounded-lg bg-sage-100 group-hover:bg-terracotta group-hover:text-white text-forest-deep transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Room Photo Canvas (Cols 4-9) */}
        <main
          ref={canvasContainerRef}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="lg:col-span-6 relative bg-forest-deep/10 overflow-hidden flex items-center justify-center p-4 min-h-[500px]"
        >
          {roomImage ? (
            <div className="relative w-full max-w-2xl aspect-[4/3] rounded-2xl overflow-hidden shadow-floating border-2 border-white select-none">
              {/* Room Background Photo */}
              <Image
                src={roomImage}
                alt="Room backdrop"
                fill
                priority
                sizes="800px"
                className="object-cover pointer-events-none"
              />

              {/* Placed Furniture Elements (100% Transparent Cutouts + Realistic Contact Floor Shadow) */}
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
                    <div className="relative w-48 h-48 sm:w-60 sm:h-60 select-none">
                      {/* Transparent Furniture Piece with Directional Contact Shadow */}
                      <Image
                        src={item.transparentImage}
                        alt={item.name}
                        fill
                        sizes="260px"
                        className="object-contain pointer-events-none select-none"
                        style={{
                          filter:
                            "drop-shadow(0 18px 22px rgba(0, 0, 0, 0.42)) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.22))",
                        }}
                      />

                      {/* Subtle Studio Selection Markers (No opaque background box) */}
                      {isSelected && (
                        <>
                          <div className="absolute inset-0 border border-dashed border-terracotta/75 rounded-xl pointer-events-none" />
                          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-terracotta border-2 border-white rounded-full shadow-sm pointer-events-none" />
                          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-terracotta border-2 border-white rounded-full shadow-sm pointer-events-none" />
                          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-terracotta border-2 border-white rounded-full shadow-sm pointer-events-none" />
                          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-terracotta border-2 border-white rounded-full shadow-sm pointer-events-none" />

                          {/* Floating name badge */}
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-forest-deep/90 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shadow-soft pointer-events-none flex items-center gap-1.5">
                            <span>{item.name}</span>
                            <span className="text-terracotta">• {Math.round(item.scale * 100)}%</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-10 bg-white rounded-3xl border border-dashed border-borderSage max-w-md">
              <Upload className="w-10 h-10 text-forest-muted mx-auto mb-3" />
              <h3 className="font-heading font-bold text-forest-deep text-base mb-1">
                Upload or Drop Your Room Photo
              </h3>
              <p className="text-xs text-forest-muted mb-4">
                Supported formats: JPG, PNG, WebP up to 15MB.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 rounded-xl bg-forest-dark text-white text-xs font-bold uppercase"
              >
                Browse Photo
              </button>
            </div>
          )}
        </main>

        {/* Right Transform Controls (Cols 10-12) */}
        <aside className="lg:col-span-3 bg-ivory-warm border-l border-borderSage p-5 space-y-6 max-h-[calc(100vh-130px)] overflow-y-auto">
          <div className="pb-3 border-b border-borderSage/70">
            <span className="text-xs uppercase tracking-wider font-bold text-forest-deep block">
              Placement Controls
            </span>
          </div>

          {selectedItem ? (
            <div className="space-y-5">
              <div>
                <h3 className="font-heading font-bold text-sm text-forest-deep">
                  {selectedItem.name}
                </h3>
                <span className="text-xs font-bold text-forest-deep">
                  {formatPrice(selectedItem.price)}
                </span>
              </div>

              {/* Position controls */}
              <div>
                <label className="text-xs font-bold text-forest-deep block mb-1.5">
                  Nudge Position
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleUpdateItem(selectedItem.id, { x: selectedItem.x - 15 })}
                    className="p-1.5 rounded-lg border border-borderSage bg-white hover:bg-sage-100"
                  >
                    ← Left
                  </button>
                  <button
                    onClick={() => handleUpdateItem(selectedItem.id, { x: selectedItem.x + 15 })}
                    className="p-1.5 rounded-lg border border-borderSage bg-white hover:bg-sage-100"
                  >
                    Right →
                  </button>
                  <button
                    onClick={() => handleUpdateItem(selectedItem.id, { y: selectedItem.y - 15 })}
                    className="p-1.5 rounded-lg border border-borderSage bg-white hover:bg-sage-100"
                  >
                    ↑ Up
                  </button>
                  <button
                    onClick={() => handleUpdateItem(selectedItem.id, { y: selectedItem.y + 15 })}
                    className="p-1.5 rounded-lg border border-borderSage bg-white hover:bg-sage-100"
                  >
                    Down ↓
                  </button>
                </div>
              </div>

              {/* Scale Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-forest-deep">Scale Proportion</span>
                  <span className="text-forest-muted">{Math.round(selectedItem.scale * 100)}%</span>
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
                  className="w-full accent-terracotta cursor-pointer"
                />
              </div>

              {/* Rotation & Flip */}
              <div>
                <label className="text-xs font-bold text-forest-deep block mb-1.5">
                  Rotation & Mirroring
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleUpdateItem(selectedItem.id, {
                        rotation: (selectedItem.rotation + 15) % 360,
                      })
                    }
                    className="flex-1 py-1.5 rounded-lg border border-borderSage bg-white hover:bg-sage-100 text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <RotateCw className="w-3.5 h-3.5" /> +15°
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateItem(selectedItem.id, { flipX: !selectedItem.flipX })
                    }
                    className="flex-1 py-1.5 rounded-lg border border-borderSage bg-white hover:bg-sage-100 text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <FlipHorizontal className="w-3.5 h-3.5" /> Mirror
                  </button>
                </div>
              </div>

              {/* Layer Ordering */}
              <div>
                <label className="text-xs font-bold text-forest-deep block mb-1.5">
                  Layer Ordering
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBringForward(selectedItem.id)}
                    className="flex-1 py-1.5 rounded-lg border border-borderSage bg-white hover:bg-sage-100 text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <ChevronUp className="w-3.5 h-3.5" /> Forward
                  </button>
                  <button
                    onClick={() => handleSendBackward(selectedItem.id)}
                    className="flex-1 py-1.5 rounded-lg border border-borderSage bg-white hover:bg-sage-100 text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <ChevronDown className="w-3.5 h-3.5" /> Backward
                  </button>
                </div>
              </div>

              {/* Remove */}
              <div className="pt-4 border-t border-borderSage/70">
                <button
                  onClick={() => handleRemoveItem(selectedItem.id)}
                  className="w-full py-2.5 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove from Photo
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-forest-muted text-xs space-y-2">
              <Sparkles className="w-8 h-8 mx-auto text-forest-muted/50" />
              <p>Click on any furniture placed in the room to scale, rotate, or reorder layers.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
