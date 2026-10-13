# DESIGN.md — Glacial Glassmorphic Design System

**Stitch MCP Project Reference**:
- **Project Name**: `projects/10436377106137043740`
- **Project Title**: `Accessories - Ice Blue Storefront`
- **Design System Asset**: `assets/9e29a3cb9e2742ccb3f0374cf8a3db5d` ("Glacial Glassmorphic")
- **Mobile Screen ID**: `projects/10436377106137043740/screens/8634788a773a49a981b8427b40efa3d7`
- **Generated Assets**:
  - Desktop Screen Screenshot: [Stitch Desktop Thumbnail](https://lh3.googleusercontent.com/aida/AEtjO1VJ6aubHBKCNwksawHJCpR-J6g0WUFgIAhvdBYirIg-Wdpvqbrfr-kTcRetnl4LjNQWKNgZwVGEyA2dglZnCYAbpuuts3WrabjL9BxLay3dp5Ws8KGWmIrjqWCGe93ZPl4Glg9p8uI7046EyLMQW0F_nlbnzVHLNfIrPEjD73a680Icl74s1Kf7yaW5tVMBXLOCBqqdxQ4K8jZj4TE8YaURUKPR3CDzfeq0dnDebs-EVJOMzRqBukEgMXZY)
  - Mobile Screen Screenshot: [Stitch Mobile Screenshot](https://lh3.googleusercontent.com/aida/AEtjO1UuFRgl0trXTcpGA6RVYt3NTZKrP4A3bA6OQSEEQ7htPxWhEBxM5ZLvc9v2GOryHa1lwJEN2CkXb-JK_P3m4ByqnO2EIsWSQuxbEzju6FYqo28Z9zE-V4ehs0PY7w1ixY0YBegfnDb-KHdbdyWX97IyV6c_1W7guvDtg2CEu0VV9fmB2IR43VwYKe5plrcH0yF5cxYXAWOmdCGuOMj8nl85DyGnA64DVl9XXY3GAhXL4JRJcIArOytXNa-l)

---

## 1. Visual Direction & Aesthetic Philosophy

The visual atmosphere balances **Architectural Minimalism** with **Luminous Tactile Glassmorphism**:
- **Atmosphere**: Cool, crystalline, and orderly. Floating optical glass lenses over chilled ice-blue mist.
- **Surfaces**: Frosted translucent glass cards with specular highlight rims and multi-tiered ambient diffusion.
- **Contrast**: AAA-compliant deep navy ink against ice-blue and pearl-white surfaces.
- **Accents**: Electric-blue `#2563EB` primary action drivers with subtle ambient glows.
- **Currency**: Bangladeshi Taka (`BDT ৳`) formatted accurately (e.g. `৳2,450`).
- **Brand Name**: Configurable (defaults to "Accessories" / "AURA GEAR").
- **Localization**: English and Bangla (বাংলা) dual-script ready typography with expandable line-heights.

---

## 2. Color Palette & Tokens

| Token Name | Hex / Value | Usage & Meaning |
| :--- | :--- | :--- |
| `--canvas-bg` | `#EAF5FF` | Base canvas background (chilled ice-blue) |
| `--canvas-gradient` | `linear-gradient(180deg, #FFFFFF 0%, #EAF5FF 40%, #DCEEFE 100%)` | Atmosphere gradient |
| `--surface-glass-l1` | `rgba(248, 252, 255, 0.75)` | Resting cards, static panels (80% frosted glass) |
| `--surface-glass-l2` | `rgba(248, 252, 255, 0.88)` | Sticky header, hover cards, slide-out drawer |
| `--surface-glass-l3` | `rgba(255, 255, 255, 0.95)` | Modals, high-priority overlays |
| `--surface-solid` | `#F8FCFF` | Pearl-white fallback / solid card fills |
| `--text-primary` | `#112A43` | Deep navy ink, headlines, primary copy |
| `--text-secondary` | `#4B637B` | Refined slate for specs, ratings, subtext |
| `--text-tertiary` | `#8FA6BE` | Muted place-holders, disabled states |
| `--brand-primary` | `#2563EB` | Electric-blue action triggers, active tabs, CTA buttons |
| `--brand-hover` | `#1D4ED8` | Deeper royal blue for hover states |
| `--brand-subtle` | `rgba(37, 99, 235, 0.08)` | Inactive chips, pill backgrounds, selection tints |
| `--border-glass` | `rgba(37, 99, 235, 0.12)` | Subtle perimeter micro-border |
| `--border-glass-specular` | `rgba(255, 255, 255, 0.85)` | Upper specular highlight edge reflection |
| `--glow-primary` | `0 0 24px 2px rgba(37, 99, 235, 0.22)` | Luminescent focus glow |
| `--success` | `#059669` | In-stock badge, verified compatibility chip |
| `--warning` | `#D97706` | Low stock notification |
| `--error` | `#DC2626` | Form validation error |

---

## 3. Typography & Hierarchy

Typeface: **Inter** (fallback: system-ui, -apple-system, sans-serif), with support for **Noto Sans Bengali** for localized strings.

- **Hero Display**: `56px` (Desktop) / `36px` (Mobile), weight: `700`, line-height: `1.15`, letter-spacing: `-0.03em`.
- **Headline Large (H1/H2)**: `32px` - `40px`, weight: `600`, line-height: `1.2`, letter-spacing: `-0.025em`.
- **Headline Medium (H3)**: `24px` - `26px`, weight: `600`, line-height: `1.3`, letter-spacing: `-0.02em`.
- **Headline Small (H4)**: `18px` - `20px`, weight: `600`, line-height: `1.4`.
- **Body Large**: `17px`, weight: `400` / `500`, line-height: `1.6`.
- **Body Regular**: `15px` - `16px`, weight: `400`, line-height: `1.55`.
- **Body Small**: `13px` - `14px`, weight: `400`, line-height: `1.5`.
- **Label / Button (Caps & Micro-copy)**: `12px` - `14px`, weight: `600`, letter-spacing: `0.02em`.

---

## 4. Elevation, Blur, and Shadow System

- **Backdrop Filter Blur**: `backdrop-filter: blur(16px) saturate(180%)` for standard glass; `blur(24px)` for navigation and drawers.
- **Glass Card Box Shadow**:
  ```css
  box-shadow: 
    0 8px 32px -4px rgba(17, 42, 67, 0.05),
    0 2px 8px -2px rgba(37, 99, 235, 0.04),
    inset 0 1px 1px 0 rgba(255, 255, 255, 0.85);
  ```
- **Elevated Hover Shadow**:
  ```css
  box-shadow: 
    0 16px 40px -6px rgba(17, 42, 67, 0.08),
    0 4px 16px -2px rgba(37, 99, 235, 0.08),
    inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.95);
  ```

---

## 5. Layout & Responsive Breakpoints

- **Mobile Narrow**: `360px` – `390px`: 1-column hero stack, 2-column compact product grid, sticky bottom nav bar, slide-out drawer cart.
- **Tablet**: `768px` – `1024px`: 2-column or 3-column product grid, semi-expanded finder.
- **Desktop**: `1280px` – `1440px`: Full 12-column grid, max-width `1380px`, hero split (left copy + right 3D canvas), sticky top glass header.

---

## 6. Real 3D Background Motion Specification

1. **Technology**: Three.js integrated via high-performance Canvas with responsive resizing and hardware acceleration.
2. **Visual Scene Composition**:
   - Ethereal transparent glass ribbons/loops twisting slowly behind the hero elements.
   - Realistic procedural 3D accessory models:
     - Sleek wireless earbuds in an open pebble charging case with glowing LED dot.
     - Ergonomic translucent MagSafe phone case with titanium camera bump ring.
     - Compact GaN dual-port fast charger with metallic prongs.
   - Translucent glass materials (`MeshPhysicalMaterial`) with `transmission: 0.88`, `roughness: 0.12`, `ior: 1.52`, `thickness: 1.2`, and soft chromatic dispersion.
3. **Motion Dynamics**:
   - Gentle floating sine-wave elevation (`y ± 0.15` over 4-6s).
   - Restrained rotational drift (`rx/ry ± 0.003` per frame).
   - Soft pointer-parallax responsiveness (`±0.05` normalized mouse offset).
4. **Controls & Accessibility**:
   - Visible **Pause / Resume** 3D animation toggle on screen.
   - Full compliance with `prefers-reduced-motion` (automatically disables drift).
   - **IntersectionObserver**: Automatically stops WebGL render loop when hero is scrolled out of viewport.
   - **Page Visibility API**: Freezes animation when tab is in background to save battery.
   - **Static Fallback**: Graceful CSS gradient + glass refraction fallback if WebGL is unsupported or errors.

---

## 7. Shopping Experience & Commerce Architecture

- **Catalog & Compatibility**:
  - Filter by Category: Cases, Audio, Charging, Power Banks.
  - Filter by Phone Brand (Apple, Samsung, Google, Xiaomi) and Model (iPhone 15 Pro, Galaxy S24 Ultra, Pixel 8 Pro, etc.).
  - Search by keywords with instant debounced search results.
  - Sorting: Price (Low to High, High to Low), Rating, Newest.
  - Product Variants: Color (Ice Blue, Matte Frost, Deep Navy, Titanium Silver) & Capacity / Port type.
- **Cart & Wishlist**:
  - LocalStorage persistence with optimistic updates.
  - Quantity controls, instant subtotal calculation, free shipping threshold indicator (over ৳2,000).
- **Checkout & Payment**:
  - Guest checkout with delivery address in Bangladesh (Dhaka / Outside Dhaka).
  - Payment Gateways:
    - **bKash** (Merchant Simulation / API integration point)
    - **Nagad** (Merchant Simulation / API integration point)
    - **Cards** (Visa / Mastercard)
    - **Cash on Delivery (COD)**
  - Server-side order validation & persistence in backend.
- **Order Tracking & Account**:
  - Order history tracking by Order ID.
- **Admin Dashboard**:
  - Protected admin panel for inventory, products, price updates, and orders overview.
