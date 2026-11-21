import { RoomItem, RoomDoor, RoomWindow, CollisionWarning } from "@/types";

export const PIXELS_PER_METER = 100; // 1 meter = 100 pixels (1 cm = 1 px)

export function metersToPixels(meters: number): number {
  return meters * PIXELS_PER_METER;
}

export function pixelsToMeters(pixels: number): number {
  return pixels / PIXELS_PER_METER;
}

export function cmToPixels(cm: number): number {
  return (cm / 100) * PIXELS_PER_METER;
}

export function pixelsToCm(pixels: number): number {
  return (pixels / PIXELS_PER_METER) * 100;
}

export interface RoomMetrics {
  areaM2: number;
  areaSqFt: number;
  perimeterM: number;
  diagonalM: number;
  usedAreaM2: number;
  coverageRatio: number; // percentage of floor covered by furniture
}

export function calculateRoomMetrics(
  widthM: number,
  lengthM: number,
  items: RoomItem[] = []
): RoomMetrics {
  const areaM2 = widthM * lengthM;
  const areaSqFt = areaM2 * 10.7639;
  const perimeterM = 2 * (widthM + lengthM);
  const diagonalM = Math.sqrt(widthM * widthM + lengthM * lengthM);

  const usedAreaM2 = items.reduce((sum, item) => {
    const itemW = pixelsToMeters(item.width);
    const itemD = pixelsToMeters(item.height);
    return sum + itemW * itemD;
  }, 0);

  const coverageRatio = areaM2 > 0 ? Math.min(100, Math.round((usedAreaM2 / areaM2) * 100)) : 0;

  return {
    areaM2: parseFloat(areaM2.toFixed(2)),
    areaSqFt: Math.round(areaSqFt),
    perimeterM: parseFloat(perimeterM.toFixed(2)),
    diagonalM: parseFloat(diagonalM.toFixed(2)),
    usedAreaM2: parseFloat(usedAreaM2.toFixed(2)),
    coverageRatio,
  };
}

interface Point {
  x: number;
  y: number;
}

/**
 * Returns 4 corners of a rotated rectangle in canvas space
 */
export function getRotatedCorners(item: RoomItem): Point[] {
  const rad = ((item.rotation || 0) * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const cx = item.x + item.width / 2;
  const cy = item.y + item.height / 2;

  const halfW = item.width / 2;
  const halfH = item.height / 2;

  const localCorners = [
    { x: -halfW, y: -halfH },
    { x: halfW, y: -halfH },
    { x: halfW, y: halfH },
    { x: -halfW, y: halfH },
  ];

  return localCorners.map((p) => ({
    x: cx + p.x * cos - p.y * sin,
    y: cy + p.x * sin + p.y * cos,
  }));
}

/**
 * Separating Axis Theorem (SAT) collision test between two rotated rectangles
 */
export function checkRotatedRectOverlap(cornersA: Point[], cornersB: Point[]): boolean {
  const polygons = [cornersA, cornersB];

  for (let i = 0; i < polygons.length; i++) {
    const polygon = polygons[i];
    for (let j = 0; j < polygon.length; j++) {
      const p1 = polygon[j];
      const p2 = polygon[(j + 1) % polygon.length];

      // Normal vector perpendicular to the edge
      const normal = { x: -(p2.y - p1.y), y: p2.x - p1.x };

      // Project all vertices onto normal
      let minA = Infinity, maxA = -Infinity;
      for (const p of cornersA) {
        const dot = p.x * normal.x + p.y * normal.y;
        minA = Math.min(minA, dot);
        maxA = Math.max(maxA, dot);
      }

      let minB = Infinity, maxB = -Infinity;
      for (const p of cornersB) {
        const dot = p.x * normal.x + p.y * normal.y;
        minB = Math.min(minB, dot);
        maxB = Math.max(maxB, dot);
      }

      // If projections don't overlap, separating axis exists -> no collision
      if (maxA < minB || maxB < minA) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Check if furniture is inside the room boundaries
 */
export function checkInsideRoom(
  item: RoomItem,
  roomWidthM: number,
  roomLengthM: number
): boolean {
  const corners = getRotatedCorners(item);
  const roomW = metersToPixels(roomWidthM);
  const roomH = metersToPixels(roomLengthM);

  const tolerance = 2; // small pixel tolerance
  return corners.every(
    (p) =>
      p.x >= -tolerance &&
      p.x <= roomW + tolerance &&
      p.y >= -tolerance &&
      p.y <= roomH + tolerance
  );
}

/**
 * Compute approximate clearance distance between centers of two items
 */
export function getDistanceBetweenItems(itemA: RoomItem, itemB: RoomItem): number {
  const cxA = itemA.x + itemA.width / 2;
  const cyA = itemA.y + itemA.height / 2;
  const cxB = itemB.x + itemB.width / 2;
  const cyB = itemB.y + itemB.height / 2;

  const dx = cxA - cxB;
  const dy = cyA - cyB;
  const centerDist = Math.sqrt(dx * dx + dy * dy);

  // Approximate edge-to-edge distance by subtracting average half-diagonals
  const radiusA = Math.sqrt(itemA.width * itemA.width + itemA.height * itemA.height) / 2;
  const radiusB = Math.sqrt(itemB.width * itemB.width + itemB.height * itemB.height) / 2;

  const edgeDistPx = Math.max(0, centerDist - (radiusA + radiusB) * 0.85);
  return pixelsToMeters(edgeDistPx);
}

/**
 * Check if an item is blocking a door's swing arc
 */
export function checkDoorBlocked(door: RoomDoor, item: RoomItem, roomWidthM: number, roomLengthM: number): boolean {
  const doorWidthPx = metersToPixels(door.width);
  const doorOffsetPx = metersToPixels(door.offset);
  const roomWPx = metersToPixels(roomWidthM);
  const roomHPx = metersToPixels(roomLengthM);

  let doorZone = { x: 0, y: 0, width: doorWidthPx, height: doorWidthPx };

  if (door.wall === "top") {
    doorZone = { x: doorOffsetPx, y: 0, width: doorWidthPx, height: doorWidthPx };
  } else if (door.wall === "bottom") {
    doorZone = { x: doorOffsetPx, y: roomHPx - doorWidthPx, width: doorWidthPx, height: doorWidthPx };
  } else if (door.wall === "left") {
    doorZone = { x: 0, y: doorOffsetPx, width: doorWidthPx, height: doorWidthPx };
  } else if (door.wall === "right") {
    doorZone = { x: roomWPx - doorWidthPx, y: doorOffsetPx, width: doorWidthPx, height: doorWidthPx };
  }

  // Check simple AABB overlap with door swing zone
  const itemRight = item.x + item.width;
  const itemBottom = item.y + item.height;
  const zoneRight = doorZone.x + doorZone.width;
  const zoneBottom = doorZone.y + doorZone.height;

  return !(
    itemRight < doorZone.x ||
    item.x > zoneRight ||
    itemBottom < doorZone.y ||
    item.y > zoneBottom
  );
}

/**
 * Full Smart Evaluation Engine
 */
export function evaluateRoomPlan(
  items: RoomItem[],
  doors: RoomDoor[] = [],
  windows: RoomWindow[] = [],
  roomWidthM: number = 5,
  roomLengthM: number = 4
): CollisionWarning[] {
  const warnings: CollisionWarning[] = [];
  const cornersMap = new Map<string, Point[]>();

  // Precalculate rotated corners
  items.forEach((item) => {
    cornersMap.set(item.id, getRotatedCorners(item));
  });

  // 1. Boundary Checks
  items.forEach((item) => {
    const isInside = checkInsideRoom(item, roomWidthM, roomLengthM);
    if (!isInside) {
      warnings.push({
        type: "boundary",
        message: `"${item.name}" extends outside room walls.`,
        itemIds: [item.id],
        severity: "critical",
      });
    }
  });

  // 2. Overlap Checks (SAT)
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const itemA = items[i];
      const itemB = items[j];

      // Rugs are allowed to overlap under furniture
      if (itemA.category === "rug" || itemB.category === "rug") continue;

      const cornersA = cornersMap.get(itemA.id)!;
      const cornersB = cornersMap.get(itemB.id)!;

      if (checkRotatedRectOverlap(cornersA, cornersB)) {
        warnings.push({
          type: "overlap",
          message: `"${itemA.name}" collides with "${itemB.name}".`,
          itemIds: [itemA.id, itemB.id],
          severity: "critical",
        });
      }
    }
  }

  // 3. Walking Clearance Checks (warn if passage between major pieces is tight, e.g. < 50cm)
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const itemA = items[i];
      const itemB = items[j];

      if (itemA.category === "rug" || itemB.category === "rug") continue;

      const distM = getDistanceBetweenItems(itemA, itemB);
      if (distM > 0.05 && distM < 0.45) {
        warnings.push({
          type: "clearance",
          message: `Tight walking passage (${Math.round(distM * 100)} cm) between "${itemA.name}" and "${itemB.name}". Recommended: ≥ 60 cm.`,
          itemIds: [itemA.id, itemB.id],
          severity: "warning",
        });
      }
    }
  }

  // 4. Door Swing Clearance
  doors.forEach((door) => {
    items.forEach((item) => {
      if (item.category === "rug") return;
      if (checkDoorBlocked(door, item, roomWidthM, roomLengthM)) {
        warnings.push({
          type: "door-blocked",
          message: `"${item.name}" obstructs the swing path of "${door.name}".`,
          itemIds: [item.id, door.id],
          severity: "critical",
        });
      }
    });
  });

  return warnings;
}
