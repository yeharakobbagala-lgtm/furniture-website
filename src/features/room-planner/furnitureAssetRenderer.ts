/**
 * Realistic Top-Down Architectural Furniture Asset Generator
 * Produces crisp, high-resolution SVG data URLs for realistic 2D interior design
 * Matching the premium editorial aesthetic of the reference floor plan.
 */

import { RoomItem } from "@/types";

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

/**
 * Generates an SVG data URI for any furniture item based on its category,
 * real dimensions (W x D), and fabric/wood finish color.
 */
export function getFurnitureSvg(item: RoomItem): string {
  const w = Math.max(30, item.width);
  const h = Math.max(30, item.height);
  const color = item.colorHex || "#465D45";
  const cat = (item.category || "").toLowerCase();
  const name = (item.name || "").toLowerCase();

  let svgContent = "";

  if (cat.includes("sofa") || name.includes("sofa") || name.includes("sectional")) {
    svgContent = renderSofaSvg(w, h, color, name);
  } else if (cat.includes("bed") || name.includes("bed")) {
    svgContent = renderBedSvg(w, h, color, name);
  } else if (cat.includes("dining-table") || (cat.includes("table") && !cat.includes("coffee") && !cat.includes("side"))) {
    svgContent = renderDiningTableSvg(w, h, color, name);
  } else if (cat.includes("coffee-table") || name.includes("coffee") || name.includes("side table") || name.includes("plinth")) {
    svgContent = renderCoffeeTableSvg(w, h, color, name);
  } else if (cat.includes("lounge-chair") || cat.includes("armchair") || name.includes("armchair") || name.includes("lounge")) {
    svgContent = renderArmchairSvg(w, h, color, name);
  } else if (cat.includes("dining-chair") || cat.includes("chair")) {
    svgContent = renderDiningChairSvg(w, h, color, name);
  } else if (cat.includes("office") || name.includes("desk") || name.includes("workstation")) {
    svgContent = renderOfficeDeskSvg(w, h, color, name);
  } else if (cat.includes("wardrobe") || cat.includes("storage") || name.includes("credenza") || name.includes("sideboard")) {
    svgContent = renderWardrobeSvg(w, h, color, name);
  } else if (name.includes("bookshelf") || name.includes("bookcase") || name.includes("shelf")) {
    svgContent = renderBookshelfSvg(w, h, color, name);
  } else if (cat.includes("plant") || name.includes("plant") || name.includes("monstera") || name.includes("fig")) {
    svgContent = renderPlantSvg(w, h);
  } else if (cat.includes("rug") || name.includes("rug") || name.includes("carpet")) {
    svgContent = renderRugSvg(w, h, color);
  } else {
    // Default elegant upholstered or wood piece
    svgContent = renderGenericFurnitureSvg(w, h, color, item.name);
  }

  const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
    <defs>
      <filter id="furniture-shadow" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#102D25" flood-opacity="0.22" />
      </filter>
      <filter id="soft-emboss" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#FFFFFF" flood-opacity="0.4" />
      </filter>
      <linearGradient id="wood-grain" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#C29B68" />
        <stop offset="25%" stop-color="#BA915D" />
        <stop offset="50%" stop-color="#CBB084" />
        <stop offset="75%" stop-color="#BA915D" />
        <stop offset="100%" stop-color="#C29B68" />
      </linearGradient>
      <linearGradient id="cushion-bevel" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.25" />
        <stop offset="85%" stop-color="#000000" stop-opacity="0.05" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.18" />
      </linearGradient>
    </defs>
    ${svgContent}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(fullSvg)}`;
}

/**
 * 1. SOFA: Realistic 3-seater / 2-seater with backrest, plump cushions,
 * rounded armrests, and 45° corner throw pillows.
 */
function renderSofaSvg(w: number, h: number, color: string, name: string): string {
  const isCurved = name.includes("curved") || name.includes("arc");
  const armWidth = Math.max(12, Math.min(22, w * 0.08));
  const backDepth = Math.max(14, Math.min(26, h * 0.28));
  const innerW = w - armWidth * 2;
  const innerH = h - backDepth - 4;
  const seatCount = w > 190 ? 3 : 2;
  const cushionW = innerW / seatCount;

  let cushions = "";
  for (let i = 0; i < seatCount; i++) {
    const cx = armWidth + i * cushionW + 1.5;
    const cy = backDepth + 2;
    const cw = cushionW - 3;
    const ch = innerH - 2;
    cushions += `
      <g>
        <rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="8" fill="${color}" stroke="#102D25" stroke-opacity="0.15" stroke-width="1.5" />
        <rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="8" fill="url(#cushion-bevel)" />
        <path d="M ${cx + 6} ${cy + ch / 2} Q ${cx + cw / 2} ${cy + ch / 2 - 2} ${cx + cw - 6} ${cy + ch / 2}" stroke="#000000" stroke-opacity="0.08" stroke-width="1" fill="none" />
      </g>
    `;
  }

  // Two 45-degree angled accent throw pillows in armrest corners
  const pillowSize = Math.min(armWidth * 1.8, 30);
  const pillow1 = `
    <g transform="translate(${armWidth + 6}, ${backDepth + 6}) rotate(45)">
      <rect x="${-pillowSize / 2}" y="${-pillowSize / 2}" width="${pillowSize}" height="${pillowSize}" rx="5" fill="#F8F7F0" stroke="#102D25" stroke-opacity="0.2" stroke-width="1.2" />
      <line x1="${-pillowSize / 2 + 2}" y1="0" x2="${pillowSize / 2 - 2}" y2="0" stroke="#000000" stroke-opacity="0.1" />
    </g>
  `;
  const pillow2 = `
    <g transform="translate(${w - armWidth - 6}, ${backDepth + 6}) rotate(-45)">
      <rect x="${-pillowSize / 2}" y="${-pillowSize / 2}" width="${pillowSize}" height="${pillowSize}" rx="5" fill="#E5EDE1" stroke="#102D25" stroke-opacity="0.2" stroke-width="1.2" />
      <line x1="${-pillowSize / 2 + 2}" y1="0" x2="${pillowSize / 2 - 2}" y2="0" stroke="#000000" stroke-opacity="0.1" />
    </g>
  `;

  return `
    <g filter="url(#furniture-shadow)">
      <!-- Main Sofa Base -->
      <rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="${isCurved ? 24 : 14}" fill="${color}" stroke="#102D25" stroke-opacity="0.25" stroke-width="2" />
      
      <!-- Backrest with soft contour -->
      <rect x="4" y="4" width="${w - 8}" height="${backDepth}" rx="10" fill="${color}" stroke="#000000" stroke-opacity="0.15" stroke-width="1" />
      <rect x="4" y="4" width="${w - 8}" height="${backDepth}" rx="10" fill="url(#cushion-bevel)" />
      
      <!-- Left Armrest -->
      <rect x="3" y="4" width="${armWidth}" height="${h - 8}" rx="8" fill="${color}" stroke="#000000" stroke-opacity="0.15" stroke-width="1" />
      <rect x="3" y="4" width="${armWidth}" height="${h - 8}" rx="8" fill="url(#cushion-bevel)" />

      <!-- Right Armrest -->
      <rect x="${w - armWidth - 3}" y="4" width="${armWidth}" height="${h - 8}" rx="8" fill="${color}" stroke="#000000" stroke-opacity="0.15" stroke-width="1" />
      <rect x="${w - armWidth - 3}" y="4" width="${armWidth}" height="${h - 8}" rx="8" fill="url(#cushion-bevel)" />

      <!-- Cushions -->
      ${cushions}

      <!-- Throw Pillows -->
      ${pillow1}
      ${pillow2}
    </g>
  `;
}

/**
 * 2. BED: Master Platform Bed with headboard, two nightstands with glowing lamps,
 * layered pillows, folded duvet, and contrast runner blanket.
 */
function renderBedSvg(w: number, h: number, color: string, name: string): string {
  const nightstandW = Math.min(26, w * 0.14);
  const nightstandH = Math.min(26, h * 0.16);
  const headboardDepth = Math.max(12, Math.min(18, h * 0.1));
  const bedW = w - nightstandW * 2 - 8;
  const bedX = nightstandW + 4;
  const bedY = headboardDepth + 2;
  const bedH = h - headboardDepth - 4;

  const pillowW = (bedW - 20) / 2;
  const pillowH = Math.min(30, bedH * 0.22);

  return `
    <g filter="url(#furniture-shadow)">
      <!-- Left Nightstand & Glowing Bedside Lamp -->
      <rect x="2" y="2" width="${nightstandW}" height="${nightstandH}" rx="4" fill="#C29B68" stroke="#8A6B43" stroke-width="1.5" />
      <circle cx="${2 + nightstandW / 2}" cy="${2 + nightstandH / 2}" r="7" fill="#FDF8E4" stroke="#D4AF37" stroke-width="1.2" />
      <circle cx="${2 + nightstandW / 2}" cy="${2 + nightstandH / 2}" r="11" fill="#FFE599" fill-opacity="0.35" />

      <!-- Right Nightstand & Glowing Bedside Lamp -->
      <rect x="${w - nightstandW - 2}" y="2" width="${nightstandW}" height="${nightstandH}" rx="4" fill="#C29B68" stroke="#8A6B43" stroke-width="1.5" />
      <circle cx="${w - nightstandW / 2 - 2}" cy="${2 + nightstandH / 2}" r="7" fill="#FDF8E4" stroke="#D4AF37" stroke-width="1.2" />
      <circle cx="${w - nightstandW / 2 - 2}" cy="${2 + nightstandH / 2}" r="11" fill="#FFE599" fill-opacity="0.35" />

      <!-- Solid Timber Headboard -->
      <rect x="${bedX - 4}" y="2" width="${bedW + 8}" height="${headboardDepth}" rx="4" fill="#997042" stroke="#684A28" stroke-width="1.8" />

      <!-- Main Mattress / Platform -->
      <rect x="${bedX}" y="${bedY}" width="${bedW}" height="${bedH}" rx="8" fill="#FBFBF8" stroke="#D2DBD0" stroke-width="1.8" />

      <!-- Dual Sleeping Pillows (Ivory/White) -->
      <rect x="${bedX + 6}" y="${bedY + 6}" width="${pillowW}" height="${pillowH}" rx="5" fill="#FFFFFF" stroke="#D2DBD0" stroke-width="1.2" />
      <rect x="${bedX + 14 + pillowW}" y="${bedY + 6}" width="${pillowW}" height="${pillowH}" rx="5" fill="#FFFFFF" stroke="#D2DBD0" stroke-width="1.2" />

      <!-- Decorative Accent Pillows -->
      <rect x="${bedX + 10}" y="${bedY + pillowH * 0.5}" width="${pillowW * 0.85}" height="${pillowH * 0.75}" rx="4" fill="${color}" stroke="#102D25" stroke-opacity="0.2" stroke-width="1" />
      <rect x="${bedX + 18 + pillowW}" y="${bedY + pillowH * 0.5}" width="${pillowW * 0.85}" height="${pillowH * 0.75}" rx="4" fill="${color}" stroke="#102D25" stroke-opacity="0.2" stroke-width="1" />

      <!-- Folded Duvet Fold -->
      <path d="M ${bedX + 2} ${bedY + bedH * 0.38} Q ${bedX + bedW / 2} ${bedY + bedH * 0.38 - 3} ${bedX + bedW - 2} ${bedY + bedH * 0.38}" stroke="#BAC5B8" stroke-width="2" fill="none" />
      <rect x="${bedX + 2}" y="${bedY + bedH * 0.38}" width="${bedW - 4}" height="${bedH * 0.6}" rx="6" fill="#F5F6F2" stroke="#D2DBD0" stroke-width="1.2" />

      <!-- Teal/Sage Bed Runner Blanket across foot -->
      <rect x="${bedX + 3}" y="${bedY + bedH * 0.7}" width="${bedW - 6}" height="${bedH * 0.26}" rx="4" fill="${color}" stroke="#102D25" stroke-opacity="0.25" stroke-width="1.2" />
      <line x1="${bedX + 6}" y1="${bedY + bedH * 0.83}" x2="${bedX + bedW - 6}" y2="${bedY + bedH * 0.83}" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="3,3" />
    </g>
  `;
}

/**
 * 3. DINING TABLE: Warm solid oak/travertine tabletop with 4 or 6 chairs
 * and a decorative fruit bowl centerpiece with green apples.
 */
function renderDiningTableSvg(w: number, h: number, color: string, name: string): string {
  const chairW = Math.min(28, w * 0.28);
  const chairD = Math.min(22, h * 0.22);
  const tableMarginY = chairD * 0.65;
  const tableX = 6;
  const tableY = tableMarginY;
  const tableW = w - 12;
  const tableH = h - tableMarginY * 2;

  // Chairs on Top & Bottom
  const chairTop1 = `
    <g transform="translate(${tableX + tableW * 0.25 - chairW / 2}, 1)">
      <path d="M 0 ${chairD} C 0 4, ${chairW} 4, ${chairW} ${chairD} Z" fill="#997042" stroke="#684A28" stroke-width="1.5" />
      <rect x="2" y="${chairD * 0.4}" width="${chairW - 4}" height="${chairD * 0.5}" rx="3" fill="#D2B48C" />
    </g>
  `;
  const chairTop2 = `
    <g transform="translate(${tableX + tableW * 0.75 - chairW / 2}, 1)">
      <path d="M 0 ${chairD} C 0 4, ${chairW} 4, ${chairW} ${chairD} Z" fill="#997042" stroke="#684A28" stroke-width="1.5" />
      <rect x="2" y="${chairD * 0.4}" width="${chairW - 4}" height="${chairD * 0.5}" rx="3" fill="#D2B48C" />
    </g>
  `;
  const chairBot1 = `
    <g transform="translate(${tableX + tableW * 0.25 - chairW / 2}, ${h - chairD - 1})">
      <path d="M 0 0 C 0 ${chairD - 4}, ${chairW} ${chairD - 4}, ${chairW} 0 Z" fill="#997042" stroke="#684A28" stroke-width="1.5" />
      <rect x="2" y="${chairD * 0.1}" width="${chairW - 4}" height="${chairD * 0.5}" rx="3" fill="#D2B48C" />
    </g>
  `;
  const chairBot2 = `
    <g transform="translate(${tableX + tableW * 0.75 - chairW / 2}, ${h - chairD - 1})">
      <path d="M 0 0 C 0 ${chairD - 4}, ${chairW} ${chairD - 4}, ${chairW} 0 Z" fill="#997042" stroke="#684A28" stroke-width="1.5" />
      <rect x="2" y="${chairD * 0.1}" width="${chairW - 4}" height="${chairD * 0.5}" rx="3" fill="#D2B48C" />
    </g>
  `;

  return `
    <g filter="url(#furniture-shadow)">
      <!-- Tucked Dining Chairs -->
      ${chairTop1}
      ${chairTop2}
      ${chairBot1}
      ${chairBot2}

      <!-- Main Solid Wood Tabletop -->
      <rect x="${tableX}" y="${tableY}" width="${tableW}" height="${tableH}" rx="6" fill="#C29B68" stroke="#8A6B43" stroke-width="2" />
      <!-- Subtle Wood Plank Joints -->
      <line x1="${tableX + 4}" y1="${tableY + tableH * 0.33}" x2="${tableX + tableW - 4}" y2="${tableY + tableH * 0.33}" stroke="#A68051" stroke-width="1" stroke-opacity="0.5" />
      <line x1="${tableX + 4}" y1="${tableY + tableH * 0.66}" x2="${tableX + tableW - 4}" y2="${tableY + tableH * 0.66}" stroke="#A68051" stroke-width="1" stroke-opacity="0.5" />

      <!-- Centerpiece: White Bowl with Green Apples -->
      <circle cx="${w / 2}" cy="${h / 2}" r="${Math.min(tableH * 0.22, 14)}" fill="#FAF9F5" stroke="#D2DBD0" stroke-width="1.5" />
      <circle cx="${w / 2 - 3}" cy="${h / 2 - 3}" r="3.5" fill="#7CB342" stroke="#558B2F" stroke-width="0.8" />
      <circle cx="${w / 2 + 3}" cy="${h / 2 - 2}" r="3.2" fill="#8BC34A" stroke="#558B2F" stroke-width="0.8" />
      <circle cx="${w / 2}" cy="${h / 2 + 3}" r="3.5" fill="#7CB342" stroke="#558B2F" stroke-width="0.8" />
    </g>
  `;
}

/**
 * 4. ARMCHAIR / LOUNGE CHAIR: Curved bouclé/leather silhouette with rounded back,
 * padded armrests, and deep cushion.
 */
function renderArmchairSvg(w: number, h: number, color: string, name: string): string {
  const armW = Math.max(8, Math.min(18, w * 0.18));
  const backD = Math.max(10, Math.min(22, h * 0.24));
  const seatW = w - armW * 2 - 4;
  const seatH = h - backD - 6;

  return `
    <g filter="url(#furniture-shadow)">
      <!-- Outer Silhouette Frame -->
      <rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="${w * 0.28}" fill="${color}" stroke="#102D25" stroke-opacity="0.25" stroke-width="2" />

      <!-- Curved Backrest Cushion -->
      <path d="M 4 ${backD + 4} C 4 4, ${w - 4} 4, ${w - 4} ${backD + 4} L ${w - armW - 2} ${backD} C ${w - armW - 2} 8, ${armW + 2} 8, ${armW + 2} ${backD} Z" fill="${color}" stroke="#000000" stroke-opacity="0.12" stroke-width="1" />
      <path d="M 4 ${backD + 4} C 4 4, ${w - 4} 4, ${w - 4} ${backD + 4}" fill="none" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="1.5" />

      <!-- Left Padded Armrest -->
      <rect x="3" y="${backD}" width="${armW}" height="${h - backD - 6}" rx="6" fill="${color}" stroke="#000000" stroke-opacity="0.15" stroke-width="1" />
      <rect x="3" y="${backD}" width="${armW}" height="${h - backD - 6}" rx="6" fill="url(#cushion-bevel)" />

      <!-- Right Padded Armrest -->
      <rect x="${w - armW - 3}" y="${backD}" width="${armW}" height="${h - backD - 6}" rx="6" fill="${color}" stroke="#000000" stroke-opacity="0.15" stroke-width="1" />
      <rect x="${w - armW - 3}" y="${backD}" width="${armW}" height="${h - backD - 6}" rx="6" fill="url(#cushion-bevel)" />

      <!-- Plump Seat Cushion -->
      <rect x="${armW + 3}" y="${backD + 2}" width="${seatW}" height="${seatH}" rx="8" fill="${color}" stroke="#102D25" stroke-opacity="0.2" stroke-width="1.5" />
      <rect x="${armW + 3}" y="${backD + 2}" width="${seatW}" height="${seatH}" rx="8" fill="url(#cushion-bevel)" />
    </g>
  `;
}

/**
 * 5. COFFEE TABLE: Warm wood or travertine table with open magazine and succulent plant.
 */
function renderCoffeeTableSvg(w: number, h: number, color: string, name: string): string {
  const isRound = Math.abs(w - h) < 15 || name.includes("round") || name.includes("monolith");
  const cx = w / 2;
  const cy = h / 2;

  let baseShape = "";
  if (isRound) {
    const r = Math.min(w, h) / 2 - 3;
    baseShape = `
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#C29B68" stroke="#8A6B43" stroke-width="2" />
      <circle cx="${cx}" cy="${cy}" r="${r - 3}" fill="none" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="1.5" />
    `;
  } else {
    baseShape = `
      <rect x="3" y="3" width="${w - 6}" height="${h - 6}" rx="12" fill="#C29B68" stroke="#8A6B43" stroke-width="2" />
      <rect x="5" y="5" width="${w - 10}" height="${h - 10}" rx="10" fill="none" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="1.5" />
    `;
  }

  // Tabletop styling: Open architectural magazine + potted succulent
  return `
    <g filter="url(#furniture-shadow)">
      ${baseShape}

      <!-- Open Magazine / Art Book -->
      <g transform="translate(${cx - 10}, ${cy - 4}) rotate(-12)">
        <rect x="-8" y="-6" width="16" height="12" rx="1.5" fill="#FAF9F5" stroke="#D2DBD0" stroke-width="0.8" />
        <line x1="0" y1="-6" x2="0" y2="6" stroke="#BAC5B8" stroke-width="0.8" />
        <line x1="-6" y1="-2" x2="-2" y2="-2" stroke="#68756B" stroke-width="0.6" />
        <line x1="2" y1="-2" x2="6" y2="-2" stroke="#68756B" stroke-width="0.6" />
      </g>

      <!-- Center Potted Succulent Plant -->
      <circle cx="${cx + 8}" cy="${cy + 6}" r="6" fill="#8FA38B" stroke="#6B8267" stroke-width="1" />
      <circle cx="${cx + 8}" cy="${cy + 6}" r="4.5" fill="#558B2F" />
      <circle cx="${cx + 8}" cy="${cy + 6}" r="2" fill="#7CB342" />
    </g>
  `;
}

/**
 * 6. OFFICE DESK: Warm wooden executive desk with laptop, mousepad,
 * succulent, and ergonomic desk chair.
 */
function renderOfficeDeskSvg(w: number, h: number, color: string, name: string): string {
  const deskH = h * 0.7;
  const chairH = h * 0.35;
  const chairW = Math.min(w * 0.45, 36);

  return `
    <g filter="url(#furniture-shadow)">
      <!-- Main Desk Surface -->
      <rect x="3" y="3" width="${w - 6}" height="${deskH}" rx="4" fill="#C29B68" stroke="#8A6B43" stroke-width="2" />

      <!-- Laptop with keyboard and trackpad -->
      <rect x="${w * 0.42}" y="${deskH * 0.25}" width="22" height="16" rx="2" fill="#CFD8DC" stroke="#78909C" stroke-width="1" />
      <rect x="${w * 0.42 + 2}" y="${deskH * 0.25 + 2}" width="18" height="8" fill="#37474F" />
      <rect x="${w * 0.42 + 6}" y="${deskH * 0.25 + 11}" width="10" height="3" fill="#B0BEC5" />

      <!-- Coffee Mug / Coaster -->
      <circle cx="${w * 0.2}" cy="${deskH * 0.35}" r="5" fill="#F8F7F0" stroke="#B85232" stroke-width="1.2" />
      <circle cx="${w * 0.2}" cy="${deskH * 0.35}" r="3" fill="#6F4E37" />

      <!-- Corner Succulent Plant -->
      <circle cx="${w * 0.2}" cy="${deskH * 0.72}" r="5.5" fill="#8FA38B" stroke="#465D45" stroke-width="1" />
      <circle cx="${w * 0.2}" cy="${deskH * 0.72}" r="3.5" fill="#558B2F" />

      <!-- Ergonomic Desk Chair Tucked Under -->
      <g transform="translate(${w / 2 - chairW / 2}, ${deskH - 4})">
        <path d="M 0 ${chairH} C 0 8, ${chairW} 8, ${chairW} ${chairH} Z" fill="${color}" stroke="#102D25" stroke-width="1.5" />
        <rect x="3" y="10" width="${chairW - 6}" height="${chairH - 12}" rx="4" fill="${color}" />
        <rect x="3" y="10" width="${chairW - 6}" height="${chairH - 12}" rx="4" fill="url(#cushion-bevel)" />
      </g>
    </g>
  `;
}

/**
 * 7. WARDROBE / CREDENZA / STORAGE: Wooden grain cabinet with handles,
 * internal division seams, and subtle surface styling.
 */
function renderWardrobeSvg(w: number, h: number, color: string, name: string): string {
  const isVertical = h > w;
  const handleLength = Math.max(16, (isVertical ? h : w) * 0.25);

  return `
    <g filter="url(#furniture-shadow)">
      <!-- Main Cabinet Body -->
      <rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="4" fill="#C29B68" stroke="#8A6B43" stroke-width="2" />
      <rect x="4" y="4" width="${w - 8}" height="${h - 8}" rx="2" fill="none" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="1.5" />

      <!-- Center Door Division Seam -->
      ${
        isVertical
          ? `<line x1="${w / 2}" y1="4" x2="${w / 2}" y2="${h - 4}" stroke="#8A6B43" stroke-width="1.5" />
             <!-- Vertical Recessed Black Handles -->
             <rect x="${w / 2 - 2.5}" y="${h / 2 - handleLength / 2}" width="2" height="${handleLength}" rx="1" fill="#102D25" />
             <rect x="${w / 2 + 0.5}" y="${h / 2 - handleLength / 2}" width="2" height="${handleLength}" rx="1" fill="#102D25" />`
          : `<line x1="4" y1="${h / 2}" x2="${w - 4}" y2="${h / 2}" stroke="#8A6B43" stroke-width="1.5" />
             <!-- Horizontal Recessed Black Handles -->
             <rect x="${w / 2 - handleLength / 2}" y="${h / 2 - 2.5}" width="${handleLength}" height="2" rx="1" fill="#102D25" />
             <rect x="${w / 2 - handleLength / 2}" y="${h / 2 + 0.5}" width="${handleLength}" height="2" rx="1" fill="#102D25" />`
      }
    </g>
  `;
}

/**
 * 8. BOOKSHELF: Wooden shelves with rows of colorful book spines.
 */
function renderBookshelfSvg(w: number, h: number, color: string, name: string): string {
  const shelfCount = Math.max(3, Math.floor(h / 24));
  const shelfGap = (h - 8) / shelfCount;

  let shelves = "";
  for (let s = 0; s < shelfCount; s++) {
    const sy = 4 + s * shelfGap;
    shelves += `
      <line x1="4" y1="${sy}" x2="${w - 4}" y2="${sy}" stroke="#8A6B43" stroke-width="1.5" />
      <!-- Books on shelf -->
      <rect x="6" y="${sy + 2}" width="${w * 0.2}" height="${shelfGap - 4}" fill="#B85232" rx="1" />
      <rect x="${6 + w * 0.22}" y="${sy + 2}" width="${w * 0.18}" height="${shelfGap - 4}" fill="#465D45" rx="1" />
      <rect x="${6 + w * 0.42}" y="${sy + 2}" width="${w * 0.25}" height="${shelfGap - 4}" fill="#C29B68" rx="1" />
      <rect x="${6 + w * 0.7}" y="${sy + 3}" width="${w * 0.15}" height="${shelfGap - 6}" fill="#2C3E50" rx="1" />
    `;
  }

  return `
    <g filter="url(#furniture-shadow)">
      <rect x="2" y="2" width="${w - 4}" height="${h - 4}" rx="4" fill="#C29B68" stroke="#8A6B43" stroke-width="2" />
      ${shelves}
    </g>
  `;
}

/**
 * 9. PLANT: Realistic top-down lush green monstera / fiddle-leaf fig with radiating leaves.
 */
function renderPlantSvg(w: number, h: number): string {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) / 2 - 4;

  let leaves = "";
  const leafCount = 10;
  for (let i = 0; i < leafCount; i++) {
    const angle = (i * 360) / leafCount;
    const leafLen = r * 0.95;
    const leafWidth = r * 0.45;
    leaves += `
      <g transform="translate(${cx}, ${cy}) rotate(${angle})">
        <path d="M 0 0 C ${-leafWidth} ${leafLen * 0.4}, ${-leafWidth * 0.6} ${leafLen}, 0 ${leafLen} C ${leafWidth * 0.6} ${leafLen}, ${leafWidth} ${leafLen * 0.4}, 0 0 Z" fill="${i % 2 === 0 ? "#43A047" : "#2E7D32"}" stroke="#1B5E20" stroke-width="0.8" />
        <line x1="0" y1="0" x2="0" y2="${leafLen * 0.85}" stroke="#81C784" stroke-width="1" />
      </g>
    `;
  }

  return `
    <g filter="url(#furniture-shadow)">
      <!-- Ceramic Terracotta Planter Base -->
      <circle cx="${cx}" cy="${cy}" r="${r * 0.4}" fill="#B85232" stroke="#8E3D24" stroke-width="1.5" />
      <circle cx="${cx}" cy="${cy}" r="${r * 0.35}" fill="#5D4037" />
      <!-- Radiating Lush Leaves -->
      ${leaves}
    </g>
  `;
}

/**
 * 10. RUG: Textured woven wool / jute rug with soft woven grid pattern and fringes.
 */
function renderRugSvg(w: number, h: number, color: string): string {
  return `
    <g filter="url(#furniture-shadow)">
      <!-- Base Woven Mat -->
      <rect x="4" y="4" width="${w - 8}" height="${h - 8}" rx="8" fill="#EAE4D9" stroke="#D2DBD0" stroke-width="1.5" />
      <!-- Subtle Texture Grid -->
      <rect x="8" y="8" width="${w - 16}" height="${h - 16}" rx="6" fill="#F4EFE6" stroke="#DACFBF" stroke-width="1" stroke-dasharray="4,4" />
      <!-- Top and Bottom Fringes -->
      <line x1="8" y1="2" x2="${w - 8}" y2="2" stroke="#DACFBF" stroke-width="2" stroke-dasharray="2,2" />
      <line x1="8" y1="${h - 2}" x2="${w - 8}" y2="${h - 2}" stroke="#DACFBF" stroke-width="2" stroke-dasharray="2,2" />
    </g>
  `;
}

/**
 * 11. DINING CHAIR: Single dining chair.
 */
function renderDiningChairSvg(w: number, h: number, color: string, name: string): string {
  return `
    <g filter="url(#furniture-shadow)">
      <path d="M 3 ${h - 3} C 3 4, ${w - 3} 4, ${w - 3} ${h - 3} Z" fill="#997042" stroke="#684A28" stroke-width="1.5" />
      <rect x="5" y="${h * 0.25}" width="${w - 10}" height="${h * 0.6}" rx="4" fill="${color}" stroke="#000000" stroke-opacity="0.12" stroke-width="1" />
      <rect x="5" y="${h * 0.25}" width="${w - 10}" height="${h * 0.6}" rx="4" fill="url(#cushion-bevel)" />
    </g>
  `;
}

/**
 * Generic elegant architectural furniture item
 */
function renderGenericFurnitureSvg(w: number, h: number, color: string, name: string): string {
  return `
    <g filter="url(#furniture-shadow)">
      <rect x="3" y="3" width="${w - 6}" height="${h - 6}" rx="8" fill="${color}" stroke="#102D25" stroke-opacity="0.25" stroke-width="2" />
      <rect x="5" y="5" width="${w - 10}" height="${h - 10}" rx="6" fill="url(#cushion-bevel)" />
      <text x="${w / 2}" y="${h / 2 + 4}" font-family="sans-serif" font-size="10" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${escapeXml(name.slice(0, 18))}</text>
    </g>
  `;
}
