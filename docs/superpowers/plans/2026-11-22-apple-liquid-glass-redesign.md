# Website-Wide Apple Liquid Glass & Glassmorphism Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the entire Square Furniture e-commerce website into a luxury, Apple-inspired Liquid Glass & Glassmorphism experience matching the provided reference designs, while strictly preserving the brand's identity, pale mint & deep forest green palette, and existing functionality.

**Architecture:** Implement a modular, layered CSS glass design system (reusable tokens in `globals.css` and Tailwind utilities) and systematically elevate each page and component: Header & Search, Hero section (with orange translucent glass CTA, bottom room switcher, and pulsating hotspots), Bento Categories, Best Sellers, Product Cards & Detail pages, Cart & Checkout, Auth, Room Studio & Style Quiz, and Footer.

**Tech Stack:** Next.js 14/15 App Router, React 18, Tailwind CSS, Framer Motion, Lucide React, Zustand state stores.

**Spec:** User prompt requirements specifying Apple Liquid Glass, backdrop blur, semi-transparent backgrounds, subtle white borders, soft inner highlights, orange translucent glass CTA, and complete website-wide application.

## Global Constraints
- Preserve existing brand name "SQUARE" and logo.
- Preserve existing color palette: pale mint/light green background (`#E5EDE1`), deep forest green (`#102D25`, `#465D45`), dark green typography, warm terracotta (`#B85232`), and warm ivory (`#F8F7F0`).
- Preserve all existing product imagery, photography paths, descriptions, routes, and business logic (Cart, Wishlist, User, Room Designer).
- No extraneous AI plant/leaf clutter; keep furniture as the prominent hero focus.
- Ensure accessible text contrast and graceful fallbacks for backdrop-filter.

## Review Focus
1. Text readability against glass surfaces: ensure high contrast labels over semi-transparent backgrounds.
2. Responsive layout integrity: verify fluid full-width padding (`px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16 2xl:px-20`) on mobile, tablet, desktop, and ultrawide.
3. Interactive state feedback: ensure hover elevation, specular reflections, and click states feel tactile and physical.
4. Hotspot accuracy on Hero: align hotspot coordinates with the active room sets without obstructing main furniture view.
5. Cart, Wishlist, and Checkout flow integrity: verify all state mutations work seamlessly through the new glass UI.

---

### Task 1: Core Design System & Liquid Glass Utility Tokens

**Files:**
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`

**Interfaces:**
- Produces: `.glass-surface`, `.glass-surface-forest`, `.glass-pill`, `.glass-pill-forest`, `.glass-cta-orange`, `.glass-input`, and `.glass-badge`.

- [ ] **Step 1: Add Apple Liquid Glass & Glassmorphism utility classes to `globals.css`**
  Implement the exact `.glass-surface` formula from the spec, plus the specialized `.glass-cta-orange` (translucent terracotta glass with specular white rim and inner glow), `.glass-surface-forest` (for dark sections), and `.glass-input`.
- [ ] **Step 2: Add extended glass shadows and border colors to `tailwind.config.ts`**
  Add `rgba(255, 255, 255, 0.55)` and refined ambient shadows.
- [ ] **Step 3: Verify TypeScript & CSS compilation**
  Run: `npx tsc --noEmit` to confirm zero syntax errors.

---

### Task 2: Header & Navigation + Search Modal Redesign

**Files:**
- Modify: `src/components/navigation/Header.tsx`
- Modify: `src/components/navigation/SearchModal.tsx`

**Interfaces:**
- Consumes: `.glass-surface`, `.glass-pill`, `useCartStore`, `useWishlistStore`, `useUserStore`.
- Produces: Floating frosted glass navigation bar with smooth blur, thin white specular border, and elegant icon droplet action buttons.

- [ ] **Step 1: Upgrade `Header.tsx` into an Apple-inspired floating glass capsule**
  Wrap navigation in a floating translucent glass pill with `backdrop-filter: blur(24px)`, subtle top specular highlight, smooth dropdown transitions, and tactile hover states.
- [ ] **Step 2: Upgrade `SearchModal.tsx` into a VisionOS frosted modal**
  Transform search overlay with a centered frosted glass panel, translucent search input, glass pill recent search chips, and live product result rows.
- [ ] **Step 3: Verify navigation interactions and responsive menu on mobile**
  Verify menu toggling, cart count badge, and search modal open/close.

---

### Task 3: Homepage Hero Section Re-creation

**Files:**
- Modify: `src/components/home/hero/HeroFurnitureShowcase.tsx`
- Modify: `src/components/home/hero/HeroContent.tsx`
- Modify: `src/components/home/hero/HeroActions.tsx`
- Modify: `src/components/home/hero/HeroSection.tsx`

**Interfaces:**
- Consumes: `heroConfig` room sets, `.glass-cta-orange`, `.glass-pill`.
- Produces: Re-created hero section matching the reference: large headline, dark-green organic background blob, terracotta translucent glass "SHOW MORE →" CTA, bottom room switcher glass pill (`01 • Living Room`, `02 • Bedroom Suite`, etc.), and interactive pulsating glass hotspots.

- [ ] **Step 1: Style the Primary CTA with Translucent Orange Glass (`HeroActions.tsx`)**
  Apply `.glass-cta-orange` with warm terracotta translucent gradient, 1px top highlight, inner ambient glow, and hover elevation.
- [ ] **Step 2: Re-create the bottom Room-Selection Glass Navigation (`HeroFurnitureShowcase.tsx`)**
  Elevate the room switcher into a floating glass capsule with active orange/forest indicator pills, room indicators, and chevron navigation.
- [ ] **Step 3: Integrate Pulsating Furniture Hotspots (`HeroFurnitureShowcase.tsx`)**
  Add interactive pulsing glass hotspots on furniture items (e.g., bed frame, nightstand, pendant lamp) with hover detail tooltips.

---

### Task 4: Bento Category Section & Best Sellers

**Files:**
- Modify: `src/components/home/CategorySection.tsx`
- Modify: `src/components/home/BestSellersSection.tsx`
- Modify: `src/components/home/BestSellerCard.tsx`

**Interfaces:**
- Consumes: `.glass-surface`, `.glass-pill`, categories data, products data.
- Produces: Edge-to-edge bento category cards with translucent corner badges and tactile glass "Explore More" button; Best Sellers carousel with floating glass price pills and ambient warm backlights.

- [ ] **Step 1: Elevate Category Bento Grid (`CategorySection.tsx`)**
  Apply frosted glass category badges, subtle inner border reflections, and tactile glass "Explore More" button.
- [ ] **Step 2: Elevate Best Seller Cards (`BestSellerCard.tsx` & `BestSellersSection.tsx`)**
  Equip product cards with top specular lines, floating glass price/rating pills, and quick-add glass droplets.

---

### Task 5: Product Card Component & Quick View Modal

**Files:**
- Modify: `src/components/products/ProductCard.tsx`
- Modify: `src/components/modals/QuickViewModal.tsx`

**Interfaces:**
- Consumes: `Product` type, `useCartStore`, `useWishlistStore`, `useQuickViewStore`.
- Produces: Universal product card with glass action overlays (Wishlist, Quick View, Add to Cart), smooth image zoom, and frosted Quick View dialog.

- [ ] **Step 1: Refactor `ProductCard.tsx` with Apple Liquid Glass surfaces**
  Add smooth translucent action buttons (heart, eye, bag) that float on hover with specular highlights, and glass badge indicators for "Best Seller" / "New".
- [ ] **Step 2: Redesign `QuickViewModal.tsx`**
  Implement frosted glass modal sheet with blurred backdrop, thumbnail navigation, and translucent color picker pills.

---

### Task 6: Shop / Catalog Page & Filter Drawers

**Files:**
- Modify: `src/components/shop/ShopClient.tsx`
- Modify: `src/app/shop/page.tsx`
- Modify: `src/app/shop/[category]/page.tsx`

**Interfaces:**
- Consumes: `ProductCard`, filter state, sorting options.
- Produces: Editorial shop interface with floating glass filter bar, translucent category filter pills, price range sliders, and active filter tags.

- [ ] **Step 1: Elevate `ShopClient.tsx` top filter & sort toolbar**
  Style filter controls into a floating glass toolbar with active filter count pills and smooth dropdown menus.
- [ ] **Step 2: Update category headers and breadcrumbs with translucent pills**
  Ensure fluid edge-to-edge layout across desktop, tablet, and mobile.

---

### Task 7: Product Detail Pages (`/product/[slug]`)

**Files:**
- Modify: `src/components/products/ProductDetailClient.tsx`
- Modify: `src/app/product/[slug]/page.tsx`

**Interfaces:**
- Consumes: `Product`, `useCartStore`, `useWishlistStore`.
- Produces: High-end editorial product presentation with glass gallery thumbnail ribbon, tactile color & material selector pills, floating glass purchase bar, and tabbed specifications.

- [ ] **Step 1: Elevate product gallery & thumbnail strip**
  Wrap thumbnails in frosted glass frames with active glowing rings.
- [ ] **Step 2: Redesign color, material, and quantity controls**
  Transform option selectors into tactile glass pills with smooth active states.
- [ ] **Step 3: Elevate specifications and reviews tabs**
  Place technical specs, dimensions, and customer reviews into elegant glass accordion/sheet surfaces.

---

### Task 8: Shopping Bag & Multi-Step Checkout

**Files:**
- Modify: `src/app/cart/page.tsx`
- Modify: `src/app/checkout/page.tsx`

**Interfaces:**
- Consumes: `useCartStore`, `useUserStore`.
- Produces: Translucent glass shopping bag cards, tactile quantity stepper pills, and a 6-step frosted glass checkout flow.

- [ ] **Step 1: Redesign `src/app/cart/page.tsx`**
  Apply `.glass-surface` to item cards, delivery option cards, promo code input, and order summary sheet.
- [ ] **Step 2: Redesign `src/app/checkout/page.tsx`**
  Elevate step indicators into floating glass numbers, style address and payment fields with `.glass-input`, and add frosted security badges.

---

### Task 9: Client Sign In & Registration (`/account/login`, `/register`)

**Files:**
- Modify: `src/app/account/login/page.tsx`
- Modify: `src/app/account/register/page.tsx`
- Modify: `src/app/account/page.tsx`

**Interfaces:**
- Consumes: `useUserStore`.
- Produces: Apple-style centered frosted authentication sheets with glass inputs and tactile demo login pills.

- [ ] **Step 1: Elevate `login/page.tsx` and `register/page.tsx`**
  Encase form in a `.glass-surface` chassis with subtle ambient lighting, frosted inputs, and clean button transitions.
- [ ] **Step 2: Elevate `account/page.tsx` client portal**
  Style user profile header, saved addresses, and order history cards in clean glass panels.

---

### Task 10: Interactive Studios & Wishlist (`/room-studio`, `/style-quiz`, `/wishlist`)

**Files:**
- Modify: `src/app/style-quiz/page.tsx`
- Modify: `src/app/wishlist/page.tsx`
- Modify: `src/app/room-studio/visualizer/page.tsx`
- Modify: `src/app/room-studio/planner/page.tsx`

**Interfaces:**
- Consumes: `useRoomDesignerStore`, `useWishlistStore`, `quizQuestions`.
- Produces: Translucent studio toolbars, floating measurement chips, and glass quiz progression cards.

- [ ] **Step 1: Redesign `style-quiz/page.tsx`**
  Build step-by-step glass cards with smooth progress indicator bar and frosted recommendation cards.
- [ ] **Step 2: Redesign `wishlist/page.tsx`**
  Apply floating glass grid with move-to-cart buttons.
- [ ] **Step 3: Elevate Room Studio Visualizer & Planner controls**
  Ensure toolbars float with translucent glass styling and clear placement controls.

---

### Task 11: Featured Collections, Designers, & Editorial Sections

**Files:**
- Modify: `src/components/home/CollectionsSection.tsx`
- Modify: `src/components/home/DesignerSpotlight.tsx`
- Modify: `src/components/home/EditorialSection.tsx`
- Modify: `src/components/home/NewArrivalsSection.tsx`
- Modify: `src/components/home/StyleQuizBanner.tsx`
- Modify: `src/components/home/RoomStudioBanner.tsx`

**Interfaces:**
- Consumes: `.glass-surface`, `.glass-pill`.
- Produces: Editorial storytelling cards with soft glass captions, designer quote badges, and sleek promo banners.

- [ ] **Step 1: Elevate homepage editorial and banner sections**
  Apply glass overlays, quote callouts, and tactile CTA pills.

---

### Task 12: Footer Section

**Files:**
- Modify: `src/components/layout/Footer.tsx`

**Interfaces:**
- Consumes: `.glass-surface-forest`.
- Produces: Deep forest green glass footer with frosted newsletter pill capsule and subtle rim glow.

- [ ] **Step 1: Redesign `Footer.tsx`**
  Apply `.glass-surface-forest` with frosted newsletter input capsule, white/glass social droplet buttons, and refined typography.

---

### Task 13: Full Build Verification, TypeScript Checks & Live Visual Auditing

**Files:**
- All modified files

- [ ] **Step 1: Run TypeScript compiler check**
  Run: `npx tsc --noEmit` to ensure 0 errors.
- [ ] **Step 2: Capture live screenshots across multiple pages**
  Capture `http://localhost:3002/` (Hero, Bento, Best Sellers), `/shop`, `/product/arcadia-curved-boucle-sofa`, `/cart`, and `/account/login` via Chrome DevTools.
- [ ] **Step 3: Verify responsive layout and interactive functionality**
  Confirm cart addition, wishlist toggling, room switcher, and search modal work without any console regressions.
