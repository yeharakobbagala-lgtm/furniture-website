"use client";

import React, { useRef, useEffect, useState } from "react";
import Konva from "konva";
import { RoomItem, RoomDoor, RoomWindow, CollisionWarning } from "@/types";
import { FloorFinishType } from "@/stores/roomDesignerStore";
import { PIXELS_PER_METER } from "./smartMeasurementEngine";
import { getFurnitureSvg } from "./furnitureAssetRenderer";

interface RoomPlannerCanvasProps {
  items: RoomItem[];
  doors: RoomDoor[];
  windows: RoomWindow[];
  roomWidth: number; // meters
  roomLength: number; // meters
  wallColor: string;
  floorType: FloorFinishType;
  gridVisible: boolean;
  gridSnap: boolean;
  gridSnapSize: number; // meters
  zoom: number;
  selectedItemId: string | null;
  selectedDoorId: string | null;
  selectedWindowId: string | null;
  warnings?: CollisionWarning[];
  onSelectItem: (id: string | null) => void;
  onSelectDoor: (id: string | null) => void;
  onSelectWindow: (id: string | null) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onUpdateRotation: (id: string, rotation: number) => void;
  onDeleteItem?: (id: string) => void;
  onDuplicateItem?: (id: string) => void;
}

export default function RoomPlannerCanvas({
  items,
  doors = [],
  windows = [],
  roomWidth,
  roomLength,
  wallColor,
  floorType,
  gridVisible,
  gridSnap,
  gridSnapSize = 0.1,
  zoom,
  selectedItemId,
  selectedDoorId,
  selectedWindowId,
  warnings = [],
  onSelectItem,
  onSelectDoor,
  onSelectWindow,
  onUpdatePosition,
  onUpdateRotation,
  onDeleteItem,
  onDuplicateItem,
}: RoomPlannerCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const isDraggingRef = useRef<boolean>(false);
  const lastSelectTimeRef = useRef<number>(0);

  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width: 360,
    height: 380,
  });

  // Architectural scale: 100 pixels per meter (1cm = 1px)
  const ppm = PIXELS_PER_METER;
  const canvasRoomW = roomWidth * ppm;
  const canvasRoomH = roomLength * ppm;
  const wallThickness = 16; // 16px thick architectural wall

  // Measure and track exact container dimensions dynamically
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const w = Math.round(rect.width) || containerRef.current.clientWidth || 360;
        const h = Math.round(rect.height) || containerRef.current.clientHeight || 380;
        setContainerSize((prev) => (prev.width !== w || prev.height !== h ? { width: w, height: h } : prev));
      }
    };
    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerSize.width;
    const height = containerSize.height;

    let stage = stageRef.current;
    Konva.dragDistance = 10;
    if (!stage) {
      stage = new Konva.Stage({
        container: containerRef.current,
        width,
        height,
      });
      stageRef.current = stage;
    } else {
      stage.width(width);
      stage.height(height);
    }

    stage.destroyChildren();

    const layer = new Konva.Layer();
    stage.add(layer);

    // Fit room inside available width and height (especially on mobile devices)
    // Margins account for exterior dimension arrows (top/left) and door swing radius (bottom)
    const marginHorizontal = 85;
    const marginVertical = 100;
    const fitScaleX = (width - marginHorizontal) / canvasRoomW;
    const fitScaleY = (height - marginVertical) / canvasRoomH;
    const autoFit = Math.min(1.0, fitScaleX, fitScaleY);
    const effectiveZoom = zoom * (autoFit > 0 ? autoFit : 1.0);

    const scaledRoomW = canvasRoomW * effectiveZoom;
    const scaledRoomH = canvasRoomH * effectiveZoom;

    // Center room horizontally with clearance for the left dimension line
    const roomOffsetX = Math.max(48, Math.round((width - scaledRoomW) / 2 + 16));
    // Move room up ("land up") so top arrows and bottom door swing are both fully visible
    const roomOffsetY = Math.max(38, Math.round((height - scaledRoomH) / 2 - 14));

    const roomGroup = new Konva.Group({
      x: roomOffsetX,
      y: roomOffsetY,
      scaleX: effectiveZoom,
      scaleY: effectiveZoom,
    });
    layer.add(roomGroup);

    // 1. Exterior Drop Shadow & Dark Architectural Wall Shell
    const wallOuter = new Konva.Rect({
      x: -wallThickness,
      y: -wallThickness,
      width: canvasRoomW + wallThickness * 2,
      height: canvasRoomH + wallThickness * 2,
      fill: "#242B28", // Dark charcoal architectural wall
      stroke: "#141A17",
      strokeWidth: 2,
      cornerRadius: 4,
      shadowColor: "rgba(0, 0, 0, 0.28)",
      shadowBlur: 28,
      shadowOffset: { x: 0, y: 14 },
      listening: false,
    });
    roomGroup.add(wallOuter);

    // 2. Realistic Floor Rendering (Light Natural Oak Wood Planks)
    const floorBaseColor =
      floorType === "dark-walnut"
        ? "#3D2B1F"
        : floorType === "concrete"
          ? "#D6D9D6"
          : floorType === "marble"
            ? "#F5F3EF"
            : floorType === "herringbone"
              ? "#E8D3B9"
              : "#F3E3CD"; // Warm light natural oak

    const floorRect = new Konva.Rect({
      name: "room-floor",
      x: 0,
      y: 0,
      width: canvasRoomW,
      height: canvasRoomH,
      fill: floorBaseColor,
      stroke: "#242B28",
      strokeWidth: 1,
      listening: true,
    });
    const handleFloorDeselect = (e: any) => {
      // Prevent ghost click from deselecting if an item was touched/clicked recently (within 450ms)
      if (Date.now() - lastSelectTimeRef.current < 450) {
        return;
      }
      if (isDraggingRef.current) {
        return;
      }
      if (e && e.target && e.target !== floorRect) {
        return;
      }
      onSelectItem(null);
      onSelectDoor(null);
      onSelectWindow(null);
    };
    floorRect.on("click tap", handleFloorDeselect);
    roomGroup.add(floorRect);

    // Realistic Wood Planks with Staggered Seams
    if (floorType === "light-oak" || floorType === "dark-walnut" || !floorType) {
      const plankHeight = 32;
      const plankLen = 160;
      let rowIndex = 0;

      for (let y = 0; y < canvasRoomH; y += plankHeight) {
        // Horizontal plank seam line
        roomGroup.add(
          new Konva.Line({
            points: [0, y, canvasRoomW, y],
            stroke: floorType === "dark-walnut" ? "rgba(0,0,0,0.3)" : "rgba(138, 107, 67, 0.22)",
            strokeWidth: 1,
            listening: false,
          })
        );

        // Staggered vertical end-grain seams
        const staggerOffset = (rowIndex % 3) * (plankLen / 3);
        for (let x = staggerOffset; x < canvasRoomW; x += plankLen) {
          if (x > 0 && x < canvasRoomW) {
            roomGroup.add(
              new Konva.Line({
                points: [x, y, x, Math.min(canvasRoomH, y + plankHeight)],
                stroke: floorType === "dark-walnut" ? "rgba(0,0,0,0.25)" : "rgba(138, 107, 67, 0.18)",
                strokeWidth: 1,
                listening: false,
              })
            );
          }
        }
        rowIndex++;
      }
    } else if (floorType === "herringbone") {
      const step = 28;
      for (let x = -canvasRoomH; x < canvasRoomW + canvasRoomH; x += step) {
        roomGroup.add(
          new Konva.Line({
            points: [x, 0, x + canvasRoomH, canvasRoomH],
            stroke: "rgba(138, 107, 67, 0.15)",
            strokeWidth: 1,
            dash: [14, 14],
            listening: false,
          })
        );
      }
    }

    // Wall Cast Shadow into the Room Edge
    const innerShadowTop = new Konva.Rect({
      x: 0,
      y: 0,
      width: canvasRoomW,
      height: 8,
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: 0, y: 8 },
      fillLinearGradientColorStops: [0, "rgba(0,0,0,0.18)", 1, "rgba(0,0,0,0)"],
      listening: false,
    });
    const innerShadowLeft = new Konva.Rect({
      x: 0,
      y: 0,
      width: 8,
      height: canvasRoomH,
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: 8, y: 0 },
      fillLinearGradientColorStops: [0, "rgba(0,0,0,0.18)", 1, "rgba(0,0,0,0)"],
      listening: false,
    });
    roomGroup.add(innerShadowTop);
    roomGroup.add(innerShadowLeft);

    // 3. Grid overlay (subtle architect grid)
    if (gridVisible) {
      const step = ppm / 2; // 50cm grid
      for (let x = step; x < canvasRoomW; x += step) {
        const isMeter = Math.abs(x % ppm) < 1;
        roomGroup.add(
          new Konva.Line({
            points: [x, 0, x, canvasRoomH],
            stroke: isMeter ? "rgba(36, 43, 40, 0.12)" : "rgba(36, 43, 40, 0.05)",
            strokeWidth: isMeter ? 1 : 0.75,
            dash: isMeter ? undefined : [3, 4],
            listening: false,
          })
        );
      }
      for (let y = step; y < canvasRoomH; y += step) {
        const isMeter = Math.abs(y % ppm) < 1;
        roomGroup.add(
          new Konva.Line({
            points: [0, y, canvasRoomW, y],
            stroke: isMeter ? "rgba(36, 43, 40, 0.12)" : "rgba(36, 43, 40, 0.05)",
            strokeWidth: isMeter ? 1 : 0.75,
            dash: isMeter ? undefined : [3, 4],
            listening: false,
          })
        );
      }
    }

    // 4. Windows with Realistic Ambient Daylight Glow Spilling onto Floor
    windows.forEach((win) => {
      const isSelected = selectedWindowId === win.id;
      const winW = win.width * ppm;
      let wx = 0;
      let wy = 0;
      let ww = winW;
      let wh = wallThickness;

      if (win.wall === "top") {
        wx = win.offset * ppm;
        wy = -wallThickness;
        ww = winW;
        wh = wallThickness;

        // Daylight reflection spilling down onto the wooden floor
        const daylightGlow = new Konva.Rect({
          x: wx,
          y: 0,
          width: ww,
          height: 38,
          fillLinearGradientStartPoint: { x: 0, y: 0 },
          fillLinearGradientEndPoint: { x: 0, y: 38 },
          fillLinearGradientColorStops: [0, "rgba(165, 218, 245, 0.45)", 1, "rgba(165, 218, 245, 0)"],
          listening: false,
        });
        roomGroup.add(daylightGlow);
      } else if (win.wall === "bottom") {
        wx = win.offset * ppm;
        wy = canvasRoomH;
        ww = winW;
        wh = wallThickness;

        const daylightGlow = new Konva.Rect({
          x: wx,
          y: canvasRoomH - 38,
          width: ww,
          height: 38,
          fillLinearGradientStartPoint: { x: 0, y: 38 },
          fillLinearGradientEndPoint: { x: 0, y: 0 },
          fillLinearGradientColorStops: [0, "rgba(165, 218, 245, 0.45)", 1, "rgba(165, 218, 245, 0)"],
          listening: false,
        });
        roomGroup.add(daylightGlow);
      } else if (win.wall === "left") {
        wx = -wallThickness;
        wy = win.offset * ppm;
        ww = wallThickness;
        wh = winW;

        const daylightGlow = new Konva.Rect({
          x: 0,
          y: wy,
          width: 38,
          height: wh,
          fillLinearGradientStartPoint: { x: 0, y: 0 },
          fillLinearGradientEndPoint: { x: 38, y: 0 },
          fillLinearGradientColorStops: [0, "rgba(165, 218, 245, 0.45)", 1, "rgba(165, 218, 245, 0)"],
          listening: false,
        });
        roomGroup.add(daylightGlow);
      } else if (win.wall === "right") {
        wx = canvasRoomW;
        wy = win.offset * ppm;
        ww = wallThickness;
        wh = winW;

        const daylightGlow = new Konva.Rect({
          x: canvasRoomW - 38,
          y: wy,
          width: 38,
          height: wh,
          fillLinearGradientStartPoint: { x: 38, y: 0 },
          fillLinearGradientEndPoint: { x: 0, y: 0 },
          fillLinearGradientColorStops: [0, "rgba(165, 218, 245, 0.45)", 1, "rgba(165, 218, 245, 0)"],
          listening: false,
        });
        roomGroup.add(daylightGlow);
      }

      const winGroup = new Konva.Group({ id: win.id, x: wx, y: wy });

      // Window casing cutout
      winGroup.add(
        new Konva.Rect({
          width: ww,
          height: wh,
          fill: "#FFFFFF",
          stroke: isSelected ? "#0D9488" : "#242B28",
          strokeWidth: isSelected ? 2.5 : 1.5,
        })
      );

      // Architectural blue-glass double panes
      if (win.wall === "top" || win.wall === "bottom") {
        winGroup.add(
          new Konva.Line({
            points: [4, wh / 2 - 2, ww - 4, wh / 2 - 2],
            stroke: "#38BDF8",
            strokeWidth: 2,
          })
        );
        winGroup.add(
          new Konva.Line({
            points: [4, wh / 2 + 2, ww - 4, wh / 2 + 2],
            stroke: "#38BDF8",
            strokeWidth: 2,
          })
        );
      } else {
        winGroup.add(
          new Konva.Line({
            points: [ww / 2 - 2, 4, ww / 2 - 2, wh - 4],
            stroke: "#38BDF8",
            strokeWidth: 2,
          })
        );
        winGroup.add(
          new Konva.Line({
            points: [ww / 2 + 2, 4, ww / 2 + 2, wh - 4],
            stroke: "#38BDF8",
            strokeWidth: 2,
          })
        );
      }

      winGroup.on("click tap", (e) => {
        e.cancelBubble = true;
        onSelectWindow(win.id);
        onSelectItem(null);
        onSelectDoor(null);
      });

      roomGroup.add(winGroup);
    });

    // 5. Doors with Architectural Swing Arcs
    doors.forEach((door) => {
      const isSelected = selectedDoorId === door.id;
      const doorW = door.width * ppm;
      let dx = 0;
      let dy = 0;
      let dw = doorW;
      let dh = wallThickness;

      if (door.wall === "top") {
        dx = door.offset * ppm;
        dy = -wallThickness;
        dw = doorW;
        dh = wallThickness;
      } else if (door.wall === "bottom") {
        dx = door.offset * ppm;
        dy = canvasRoomH;
        dw = doorW;
        dh = wallThickness;
      } else if (door.wall === "left") {
        dx = -wallThickness;
        dy = door.offset * ppm;
        dw = wallThickness;
        dh = doorW;
      } else if (door.wall === "right") {
        dx = canvasRoomW;
        dy = door.offset * ppm;
        dw = wallThickness;
        dh = doorW;
      }

      const doorGroup = new Konva.Group({ id: door.id, x: dx, y: dy });

      // Wall cutout for door opening
      doorGroup.add(
        new Konva.Rect({
          width: dw,
          height: dh,
          fill: floorBaseColor,
          stroke: isSelected ? "#0D9488" : "#242B28",
          strokeWidth: isSelected ? 2.5 : 1.5,
        })
      );

      // Door Swing Arc & Door Leaf
      if (door.wall === "bottom") {
        doorGroup.add(
          new Konva.Arc({
            x: 0,
            y: 0,
            innerRadius: 0,
            outerRadius: doorW,
            angle: 90,
            rotation: 270,
            stroke: isSelected ? "#0D9488" : "rgba(36, 43, 40, 0.45)",
            strokeWidth: 1.5,
            dash: [4, 4],
          })
        );
        doorGroup.add(
          new Konva.Line({
            points: [0, 0, 0, -doorW],
            stroke: isSelected ? "#0D9488" : "#242B28",
            strokeWidth: 3,
          })
        );
      } else if (door.wall === "top") {
        doorGroup.add(
          new Konva.Arc({
            x: 0,
            y: wallThickness,
            innerRadius: 0,
            outerRadius: doorW,
            angle: 90,
            rotation: 0,
            stroke: isSelected ? "#0D9488" : "rgba(36, 43, 40, 0.45)",
            strokeWidth: 1.5,
            dash: [4, 4],
          })
        );
        doorGroup.add(
          new Konva.Line({
            points: [0, wallThickness, 0, wallThickness + doorW],
            stroke: isSelected ? "#0D9488" : "#242B28",
            strokeWidth: 3,
          })
        );
      } else if (door.wall === "left") {
        doorGroup.add(
          new Konva.Arc({
            x: wallThickness,
            y: 0,
            innerRadius: 0,
            outerRadius: doorW,
            angle: 90,
            rotation: 0,
            stroke: isSelected ? "#0D9488" : "rgba(36, 43, 40, 0.45)",
            strokeWidth: 1.5,
            dash: [4, 4],
          })
        );
        doorGroup.add(
          new Konva.Line({
            points: [wallThickness, 0, wallThickness + doorW, 0],
            stroke: isSelected ? "#0D9488" : "#242B28",
            strokeWidth: 3,
          })
        );
      } else if (door.wall === "right") {
        doorGroup.add(
          new Konva.Arc({
            x: 0,
            y: 0,
            innerRadius: 0,
            outerRadius: doorW,
            angle: 90,
            rotation: 90,
            stroke: isSelected ? "#0D9488" : "rgba(36, 43, 40, 0.45)",
            strokeWidth: 1.5,
            dash: [4, 4],
          })
        );
        doorGroup.add(
          new Konva.Line({
            points: [0, 0, -doorW, 0],
            stroke: isSelected ? "#0D9488" : "#242B28",
            strokeWidth: 3,
          })
        );
      }

      doorGroup.on("click tap", (e) => {
        e.cancelBubble = true;
        onSelectDoor(door.id);
        onSelectItem(null);
        onSelectWindow(null);
      });

      roomGroup.add(doorGroup);
    });

    // 6. Exterior Wall Dimension Labels with Architectural Arrows
    const dimOffsetY = -28;
    // Horizontal Double-Headed Arrow: ← 5.20 m →
    roomGroup.add(
      new Konva.Arrow({
        points: [canvasRoomW / 2 + 32, dimOffsetY, canvasRoomW, dimOffsetY],
        pointerLength: 8,
        pointerWidth: 6,
        fill: "#242B28",
        stroke: "#242B28",
        strokeWidth: 1.5,
        listening: false,
      })
    );
    roomGroup.add(
      new Konva.Arrow({
        points: [canvasRoomW / 2 - 32, dimOffsetY, 0, dimOffsetY],
        pointerLength: 8,
        pointerWidth: 6,
        fill: "#242B28",
        stroke: "#242B28",
        strokeWidth: 1.5,
        listening: false,
      })
    );
    roomGroup.add(
      new Konva.Text({
        x: canvasRoomW / 2 - 38,
        y: dimOffsetY - 16,
        text: `${roomWidth.toFixed(2)} m`,
        fontSize: 12,
        fontFamily: "Inter, sans-serif",
        fontStyle: "bold",
        fill: "#242B28",
        align: "center",
        width: 76,
        listening: false,
      })
    );

    const dimOffsetX = -28;
    // Vertical Double-Headed Arrow: ↕ 4.50 m
    roomGroup.add(
      new Konva.Arrow({
        points: [dimOffsetX, canvasRoomH / 2 - 16, dimOffsetX, 0],
        pointerLength: 8,
        pointerWidth: 6,
        fill: "#242B28",
        stroke: "#242B28",
        strokeWidth: 1.5,
        listening: false,
      })
    );
    roomGroup.add(
      new Konva.Arrow({
        points: [dimOffsetX, canvasRoomH / 2 + 16, dimOffsetX, canvasRoomH],
        pointerLength: 8,
        pointerWidth: 6,
        fill: "#242B28",
        stroke: "#242B28",
        strokeWidth: 1.5,
        listening: false,
      })
    );
    roomGroup.add(
      new Konva.Text({
        x: dimOffsetX - 62,
        y: canvasRoomH / 2 - 7,
        text: `${roomLength.toFixed(2)} m`,
        fontSize: 12,
        fontFamily: "Inter, sans-serif",
        fontStyle: "bold",
        fill: "#242B28",
        align: "center",
        width: 58,
        listening: false,
      })
    );

    // 7. REALISTIC FURNITURE ITEMS RENDERING
    const snapPx = (gridSnapSize || 0.1) * ppm;

    items.forEach((item) => {
      const isSelected = selectedItemId === item.id;
      const hasIssue = warnings.some(
        (w) => w.itemIds.includes(item.id) && (w.severity === "critical" || w.severity === "warning")
      );
      const isCritical = warnings.some(
        (w) => w.itemIds.includes(item.id) && w.severity === "critical"
      );

      const itemGroup = new Konva.Group({
        id: item.id,
        x: item.x,
        y: item.y,
        rotation: item.rotation,
        draggable: true,
      });

      // Load or retrieve realistic SVG asset
      const cacheKey = `${item.id}_${item.width}_${item.height}_${item.colorHex}_${item.category}`;
      let cachedImg = imageCacheRef.current.get(cacheKey);

      if (!cachedImg) {
        cachedImg = new window.Image();
        cachedImg.src = getFurnitureSvg(item);
        cachedImg.onload = () => {
          layer.batchDraw();
        };
        imageCacheRef.current.set(cacheKey, cachedImg);
      }

      // 1. Realistic Furniture Graphic
      const furnitureImage = new Konva.Image({
        image: cachedImg,
        width: item.width,
        height: item.height,
        listening: true,
      });
      itemGroup.add(furnitureImage);

      // 2. High-Priority Interactive Hit Area Placed On Top of the Graphic
      // Guarantees 100% infallible hit detection across the entire rectangular footprint
      const hitRect = new Konva.Rect({
        name: "furniture-hit-area",
        x: 0,
        y: 0,
        width: item.width,
        height: item.height,
        fill: "rgba(0, 0, 0, 0.01)",
        listening: true,
      });
      itemGroup.add(hitRect);

      // Warning Badge if Collision or Obstruction Detected
      let badgeBg: Konva.Circle | null = null;
      let badgeExclamation: Konva.Text | null = null;
      if (hasIssue) {
        badgeBg = new Konva.Circle({
          x: item.width - 10,
          y: 10,
          radius: 9,
          fill: isCritical ? "#DC2626" : "#F59E0B",
          stroke: "#FFFFFF",
          strokeWidth: 2,
          listening: true,
        });
        badgeExclamation = new Konva.Text({
          x: item.width - 14,
          y: 3.5,
          text: "!",
          fontSize: 11,
          fontFamily: "sans-serif",
          fontStyle: "bold",
          fill: "#FFFFFF",
          listening: true,
        });
        itemGroup.add(badgeBg);
        itemGroup.add(badgeExclamation);
      }

      // ELEGANT SELECTION CONTROLS (MUTED TEAL #0D9488 — EXACT TO REFERENCE IMAGE)
      if (isSelected) {
        const tealColor = "#0D9488";

        // Bounding Selection Box
        const selectBox = new Konva.Rect({
          x: -3,
          y: -3,
          width: item.width + 6,
          height: item.height + 6,
          stroke: tealColor,
          strokeWidth: 2,
          dash: [6, 4],
          cornerRadius: 6,
          listening: false,
        });
        itemGroup.add(selectBox);

        // 4 Corner Nubs
        const cornerPoints = [
          { x: -3, y: -3 },
          { x: item.width + 3, y: -3 },
          { x: -3, y: item.height + 3 },
          { x: item.width + 3, y: item.height + 3 },
        ];
        cornerPoints.forEach((pt) => {
          itemGroup.add(
            new Konva.Circle({
              x: pt.x,
              y: pt.y,
              radius: 4.5,
              fill: tealColor,
              stroke: "#FFFFFF",
              strokeWidth: 1.5,
              listening: false,
            })
          );
        });

        // 4 Midpoint Nubs
        const midPoints = [
          { x: item.width / 2, y: -3 },
          { x: item.width / 2, y: item.height + 3 },
          { x: -3, y: item.height / 2 },
          { x: item.width + 3, y: item.height / 2 },
        ];
        midPoints.forEach((pt) => {
          itemGroup.add(
            new Konva.Circle({
              x: pt.x,
              y: pt.y,
              radius: 3.5,
              fill: tealColor,
              stroke: "#FFFFFF",
              strokeWidth: 1.2,
              listening: false,
            })
          );
        });

        // Top Stem leading to Circular Rotation Control (↻)
        const stem = new Konva.Line({
          points: [item.width / 2, -3, item.width / 2, -26],
          stroke: tealColor,
          strokeWidth: 2,
        });
        const rotateBg = new Konva.Circle({
          x: item.width / 2,
          y: -26,
          radius: 11,
          fill: tealColor,
          stroke: "#FFFFFF",
          strokeWidth: 2,
          cursor: "grab",
        });
        const rotateIcon = new Konva.Text({
          x: item.width / 2 - 6,
          y: -33,
          text: "↻",
          fontSize: 14,
          fontFamily: "sans-serif",
          fontStyle: "bold",
          fill: "#FFFFFF",
          cursor: "grab",
        });

        const rotateTrigger = (e: any) => {
          e.cancelBubble = true;
          onUpdateRotation(item.id, (item.rotation + 45) % 360);
        };
        rotateBg.on("click tap", rotateTrigger);
        rotateIcon.on("click tap", rotateTrigger);

        itemGroup.add(stem);
        itemGroup.add(rotateBg);
        itemGroup.add(rotateIcon);

        // ON-CANVAS QUICK ACTION BAR (Rotate, Duplicate, Delete)
        const actionToolbar = new Konva.Group({
          x: item.width / 2,
          y: -48,
        });

        const pillW = 116;
        const pillH = 26;
        actionToolbar.add(
          new Konva.Rect({
            x: -pillW / 2,
            y: -pillH / 2,
            width: pillW,
            height: pillH,
            cornerRadius: 13,
            fill: "#102D25",
            stroke: tealColor,
            strokeWidth: 1.5,
            shadowColor: "rgba(0, 0, 0, 0.3)",
            shadowBlur: 10,
            shadowOffset: { x: 0, y: 3 },
          })
        );

        // 1. Rotate 45°
        const btnRot = new Konva.Group({ x: -36, y: 0, cursor: "pointer" });
        btnRot.add(
          new Konva.Circle({
            radius: 10,
            fill: "rgba(255, 255, 255, 0.15)",
          })
        );
        btnRot.add(
          new Konva.Text({
            x: -5,
            y: -6,
            text: "↻",
            fontSize: 12,
            fontFamily: "Inter, sans-serif",
            fontStyle: "bold",
            fill: "#FFFFFF",
          })
        );
        btnRot.on("click tap", (e) => {
          e.cancelBubble = true;
          onUpdateRotation(item.id, (item.rotation + 45) % 360);
        });
        actionToolbar.add(btnRot);

        // 2. Duplicate Piece
        const btnDup = new Konva.Group({ x: 0, y: 0, cursor: "pointer" });
        btnDup.add(
          new Konva.Circle({
            radius: 10,
            fill: "rgba(255, 255, 255, 0.15)",
          })
        );
        btnDup.add(
          new Konva.Text({
            x: -4,
            y: -6,
            text: "+",
            fontSize: 13,
            fontFamily: "Inter, sans-serif",
            fontStyle: "bold",
            fill: "#FFFFFF",
          })
        );
        btnDup.on("click tap", (e) => {
          e.cancelBubble = true;
          if (onDuplicateItem) onDuplicateItem(item.id);
        });
        actionToolbar.add(btnDup);

        // 3. Delete Piece (Red)
        const btnDel = new Konva.Group({ x: 36, y: 0, cursor: "pointer" });
        btnDel.add(
          new Konva.Circle({
            radius: 10,
            fill: "#DC2626",
          })
        );
        btnDel.add(
          new Konva.Text({
            x: -4,
            y: -6,
            text: "✕",
            fontSize: 11,
            fontFamily: "Inter, sans-serif",
            fontStyle: "bold",
            fill: "#FFFFFF",
          })
        );
        btnDel.on("click tap", (e) => {
          e.cancelBubble = true;
          if (onDeleteItem) onDeleteItem(item.id);
        });
        actionToolbar.add(btnDel);

        itemGroup.add(actionToolbar);

        // REAL-TIME CLEARANCE MEASUREMENT CALLOUTS (EXACTLY AS IN REFERENCE)
        // Measure clearance to North wall
        const distToNorthCm = Math.round(item.y);
        if (distToNorthCm > 20 && distToNorthCm < 220) {
          const arrowGroup = new Konva.Group({ listening: false });
          arrowGroup.add(
            new Konva.Line({
              points: [item.width / 2, 0, item.width / 2, -distToNorthCm],
              stroke: "#B85232",
              strokeWidth: 1.2,
              dash: [4, 4],
            })
          );
          arrowGroup.add(
            new Konva.Rect({
              x: item.width / 2 - 24,
              y: -distToNorthCm / 2 - 9,
              width: 48,
              height: 18,
              rx: 4,
              fill: "#FAF9F5",
              stroke: "#D2DBD0",
              strokeWidth: 1,
            })
          );
          arrowGroup.add(
            new Konva.Text({
              x: item.width / 2 - 24,
              y: -distToNorthCm / 2 - 5,
              width: 48,
              text: `${distToNorthCm} cm`,
              fontSize: 9,
              fontFamily: "Inter, sans-serif",
              fontStyle: "bold",
              fill: "#B85232",
              align: "center",
            })
          );
          itemGroup.add(arrowGroup);
        }

        // Measure clearance to Left wall
        const distToWestCm = Math.round(item.x);
        if (distToWestCm > 20 && distToWestCm < 220) {
          const arrowGroup = new Konva.Group({ listening: false });
          arrowGroup.add(
            new Konva.Line({
              points: [0, item.height / 2, -distToWestCm, item.height / 2],
              stroke: "#B85232",
              strokeWidth: 1.2,
              dash: [4, 4],
            })
          );
          arrowGroup.add(
            new Konva.Rect({
              x: -distToWestCm / 2 - 24,
              y: item.height / 2 - 9,
              width: 48,
              height: 18,
              rx: 4,
              fill: "#FAF9F5",
              stroke: "#D2DBD0",
              strokeWidth: 1,
            })
          );
          arrowGroup.add(
            new Konva.Text({
              x: -distToWestCm / 2 - 24,
              y: item.height / 2 - 5,
              width: 48,
              text: `${distToWestCm} cm`,
              fontSize: 9,
              fontFamily: "Inter, sans-serif",
              fontStyle: "bold",
              fill: "#B85232",
              align: "center",
            })
          );
          itemGroup.add(arrowGroup);
        }

        // Floating On-Canvas CAD Dimension & Specification Badge
        const infoBadgeGroup = new Konva.Group({
          x: item.width / 2,
          y: item.height + 12,
          listening: false,
        });

        const infoText = `${item.name} • ${Math.round(item.width)}×${Math.round(item.height)} cm`;
        const approxBadgeWidth = Math.min(220, Math.max(120, infoText.length * 6.2 + 20));

        infoBadgeGroup.add(
          new Konva.Rect({
            x: -approxBadgeWidth / 2,
            y: 0,
            width: approxBadgeWidth,
            height: 22,
            rx: 6,
            fill: "#102D25",
            stroke: "#0D9488",
            strokeWidth: 1.5,
            shadowColor: "rgba(0,0,0,0.22)",
            shadowBlur: 8,
            shadowOffset: { x: 0, y: 3 },
          })
        );

        infoBadgeGroup.add(
          new Konva.Text({
            x: -approxBadgeWidth / 2,
            y: 5.5,
            width: approxBadgeWidth,
            text: infoText,
            fontSize: 10,
            fontFamily: "Inter, sans-serif",
            fontStyle: "bold",
            fill: "#FFFFFF",
            align: "center",
            ellipsis: true,
          })
        );

        itemGroup.add(infoBadgeGroup);
      }

      // Immediate selection handler on touch, tap, or pointerdown
      const selectThisItem = (e: any) => {
        lastSelectTimeRef.current = Date.now();
        if (e) {
          e.cancelBubble = true;
        }
        onSelectItem(item.id);
        onSelectDoor(null);
        onSelectWindow(null);
      };

      itemGroup.on("pointerdown touchstart click tap", selectThisItem);
      hitRect.on("pointerdown touchstart click tap", selectThisItem);
      furnitureImage.on("pointerdown touchstart click tap", selectThisItem);
      if (badgeBg) badgeBg.on("pointerdown touchstart click tap", selectThisItem);
      if (badgeExclamation) badgeExclamation.on("pointerdown touchstart click tap", selectThisItem);

      itemGroup.on("dragstart", (e) => {
        isDraggingRef.current = true;
        lastSelectTimeRef.current = Date.now();
        if (e) {
          e.cancelBubble = true;
        }
        onSelectItem(item.id);
        onSelectDoor(null);
        onSelectWindow(null);
        itemGroup.moveToTop();
      });

      // Drag handler with grid snapping
      itemGroup.on("dragmove", (e) => {
        if (gridSnap) {
          const snappedX = Math.round(e.target.x() / snapPx) * snapPx;
          const snappedY = Math.round(e.target.y() / snapPx) * snapPx;
          e.target.x(snappedX);
          e.target.y(snappedY);
        }
      });

      itemGroup.on("dragend", (e) => {
        lastSelectTimeRef.current = Date.now();
        if (e) {
          e.cancelBubble = true;
        }
        let finalX = e.target.x();
        let finalY = e.target.y();

        if (gridSnap) {
          finalX = Math.round(finalX / snapPx) * snapPx;
          finalY = Math.round(finalY / snapPx) * snapPx;
        }

        const clampedX = Math.max(0, Math.min(canvasRoomW - item.width, finalX));
        const clampedY = Math.max(0, Math.min(canvasRoomH - item.height, finalY));
        e.target.position({ x: clampedX, y: clampedY });
        layer.batchDraw();

        // When drag finishes, select the moved item
        onSelectItem(item.id);

        // Only update position in store if it actually moved by > 3px (prevents store re-render loop on click/tap)
        const hasMoved = Math.hypot(finalX - item.x, finalY - item.y) > 3;
        if (hasMoved) {
          onUpdatePosition(item.id, clampedX, clampedY);
        }

        setTimeout(() => {
          isDraggingRef.current = false;
        }, 120);
      });

      // Hover feedback
      itemGroup.on("mouseenter", () => {
        if (stageRef.current) stageRef.current.container().style.cursor = "move";
      });
      itemGroup.on("mouseleave", () => {
        if (stageRef.current) stageRef.current.container().style.cursor = "default";
      });

      roomGroup.add(itemGroup);
    });

    stage.on("click tap", (e) => {
      // Prevent ghost click from deselecting if an item was touched/clicked recently (within 450ms)
      if (Date.now() - lastSelectTimeRef.current < 450) {
        return;
      }
      if (isDraggingRef.current) {
        return;
      }
      if (e.target === stage) {
        onSelectItem(null);
        onSelectDoor(null);
        onSelectWindow(null);
      }
    });

    layer.draw();

    const handleResize = () => {
      if (!containerRef.current || !stageRef.current) return;
      const w = containerRef.current.clientWidth || 360;
      const h = containerRef.current.clientHeight || 360;
      stageRef.current.width(w);
      stageRef.current.height(h);
      stageRef.current.draw();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [
    items,
    doors,
    windows,
    roomWidth,
    roomLength,
    wallColor,
    floorType,
    gridVisible,
    gridSnap,
    gridSnapSize,
    zoom,
    selectedItemId,
    selectedDoorId,
    selectedWindowId,
    warnings,
    onSelectItem,
    onSelectDoor,
    onSelectWindow,
    onUpdatePosition,
    onUpdateRotation,
    onDeleteItem,
    onDuplicateItem,
    canvasRoomW,
    canvasRoomH,
    containerSize,
  ]);

  useEffect(() => {
    return () => {
      if (stageRef.current) {
        stageRef.current.destroy();
        stageRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-[#E6ECE4] relative overflow-hidden select-none flex items-center justify-center shadow-inner touch-none"
    />
  );
}
