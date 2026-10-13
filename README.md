# Accessories — Glacial Glassmorphic Mobile Store

A high-performance mobile accessories online store designed with **Stitch MCP** and built with **React**, **Three.js**, and **Vanilla CSS**. Features an ethereal ice-blue translucent glass aesthetic, real 3D background motion with procedural models, device compatibility filtering, and full commerce flows tailored for Bangladesh (BDT `৳`).

---

## 🎨 Visual Direction & Stitch MCP Architecture

- **Stitch MCP Project**: `projects/10436377106137043740` (*Accessories - Ice Blue Storefront*)
- **Design System Asset**: `assets/9e29a3cb9e2742ccb3f0374cf8a3db5d` (*Glacial Glassmorphic*)
- **Generated Mobile Screen**: `projects/10436377106137043740/screens/8634788a773a49a981b8427b40efa3d7`
- **Full Specs**: See [DESIGN.md](./DESIGN.md) for complete design tokens, elevation levels, and typography hierarchy.

### Color Palette
- **Ice-Blue Background**: `#EAF5FF`
- **Pearl-White Surfaces**: `#F8FCFF` (Frosted glass with `backdrop-filter: blur(16px - 24px)`)
- **Dark Navy Ink**: `#112A43` (High-contrast WCAG AAA typography)
- **Electric-Blue Primary**: `#2563EB` (Tactile action triggers & CTAs)
- **Glass Borders**: `rgba(37, 99, 235, 0.12)` with specular rim `inset 0 1px 1px rgba(255, 255, 255, 0.9)`

---

## ⚡ Features

### 1. Real 3D Background Motion (`Hero3D.jsx`)
- Built using **Three.js** with procedural geometries:
  - **Frosted MagSafe Case**: Clear polycarbonate body with titanium camera bump and magnetic neodymium ring.
  - **Wireless Earbuds in Pebble Case**: Translucent case with animated pulsing LED indicator dot and dual floating titanium earbuds.
  - **Compact GaN 65W Fast Charger**: Dual USB-C ports with metallic folding prongs.
  - **Refractive Glass Ribbon Loops**: `TorusKnotGeometry` with physical glass transmission.
- **Controls & Accessibility**:
  - Accessible **Pause / Resume** toggle button directly on the hero scene.
  - Automatic `prefers-reduced-motion` compliance.
  - **IntersectionObserver** halts WebGL render loop when hero is off-screen.
  - **Page Visibility API** freezes animation on inactive browser tabs.
  - Matching static glass fallback if WebGL is unavailable.

### 2. Device Compatibility Finder
- Filter products verified for specific smartphones (Apple, Samsung, Google, Xiaomi).
- Instant model filtering (*iPhone 15 Pro, Galaxy S24 Ultra, Pixel 8 Pro, etc.*).
- Visual compatibility badges displayed directly on product cards.

### 3. Catalog & Shopping Experience
- **4 Image-Led Categories**: Cases, Audio, Charging, Power Banks.
- **Filters & Search**: Category pills, keyword search, price/rating sorting, and in-stock toggle.
- **Product Detail Modal**: Multi-angle gallery, spec sheets, color/finish switcher (*Glacial Ice Blue, Pearl White, etc.*), warranty info, and direct Buy Now.
- **Cart Drawer**: Slide-over frosted glass drawer with quantity controls and a dynamic progress meter unlocking Free Delivery at **৳2,000**.
- **Wishlist**: Save favorite items with one-tap transfer to bag.
- **Bilingual Localization**: Instant English / Bengali (বাংলা) language switcher.

### 4. Checkout & Commerce Backend
- **Guest Checkout**: Customer name, phone validation (`01XXXXXXXXX`), and Bangladesh division selection.
- **Delivery Calculation**: Inside Dhaka (৳60), Outside Dhaka (৳120), Free Delivery over ৳2,000.
- **Payment Methods**:
  - **bKash** (Merchant simulation with TrxID verification)
  - **Nagad** (Merchant simulation with TrxID verification)
  - **Debit / Credit Cards** (Visa, Mastercard, AMEX)
  - **Cash on Delivery (COD)**
- **Order Tracking**: 5-stage fulfillment timeline (*Order Placed → Confirmed → Packaging → In Transit → Delivered*).
- **Admin Operations Console**: Protected by passcode (`admin123`) to view orders queue, update order statuses, view revenue metrics, and restock items (`+10 Units`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation
```bash
git clone https://github.com/istihadahmed007/Tech.git
cd Tech
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 🛠 Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Key configuration options:
- `VITE_STORE_NAME`: Store branding name (default: `"Accessories"`)
- `ADMIN_PASSWORD_HASH`: Passcode for the Admin Operations Console (default: `"admin123"`)
- `ENABLE_BKASH`, `ENABLE_NAGAD`, `ENABLE_CARD_PAYMENT`: Toggle payment options
