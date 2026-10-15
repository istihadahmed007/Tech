# Glacial Tech — Production-Ready Mobile Accessories Storefront

A high-performance, polished e-commerce platform for mobile accessories in Bangladesh (BDT `৳`). Built with **React 18**, **Vanilla CSS**, and a **Node.js** modular commerce backend, adhering to a high-contrast Glacial Glassmorphic visual identity without distracting 3D motion.

---

## 💎 Design Identity & Aesthetics

- **Subtle 3D Woven Background & Atmosphere**:
  - Calm, product-focused cybernetic wave landscape built with **Three.js** and high-performance WebGL shaders.
  - Complements storefront readability with restrained motion, soft atmospheric horizon glow, and pinpoint vertex nodes.
  - Non-blocking (`pointer-events: none`, background layer) with solid, opaque cards and reading surfaces.
  - Strict **`prefers-reduced-motion`** compliance: automatically pauses wave elevation and camera displacement, providing a static, high-contrast appearance when motion reduction is requested or WebGL is unavailable.
- **Glacial Glassmorphic Aesthetic**:
  - **Canvas Horizon**: `#020712` deep midnight with atmospheric cyan radial glow
  - **Surfaces**: Solid `#FFFFFF` card pedestals and `#FFFFFF` modal surfaces to guarantee maximum legibility
  - **Typography**: `#10263D` deep navy ink meeting WCAG AAA contrast guidelines
  - **Action Triggers**: `#145CFF` tactile electric-blue buttons with high-contrast `:focus-visible` rings and quick-add feedback
  - **Borders & Shadows**: Crisp `#DCE7F0` boundaries and soft ambient depth shadows fitting the background's retail presence
- **Honest Signals & Clear Trust**: Explicit badges for Official Warranty, 7-Day Return Policy, Genuine Import, and Courier Shipping (Dhaka ৳60 / Outside Dhaka ৳120).

---

## ⚡ Key Storefront & Commerce Features

### 1. Catalog & Device Compatibility Finder
- **Verified Model Fit**: Instant filtering for Apple (*iPhone 15 Pro, 14 Pro, etc.*), Samsung (*Galaxy S24 Ultra, Z Fold 5, etc.*), Google Pixel, and Xiaomi.
- **Category Browsing**: Cases, Audio, Fast Charging, and MagSafe Power Banks.
- **Search & Sort**: Real-time keyword search across titles, descriptions, and device models; price sorting; in-stock toggle.
- **Zero-State Handling**: Clear guidance when a device filter produces no matching accessories, with single-click filter resets.

### 2. Product Detail & Verified Reviews
- Multi-angle gallery with interactive thumbnail switcher.
- Variant finish selector (*Glacial Ice Blue, Pearl White, Titanium Slate, Navy*).
- Full technical specification sheet.
- **Verified Reviews**: Real customer review submission validated against delivered order history (prevents duplicate or fraudulent reviews; admin moderation included).

### 3. Cart & Authoritative Server Revalidation
- Slide-over frosted drawer with live stock bounds.
- Dynamic delivery progress meter unlocking **Free Delivery at ৳2,000**.
- **Server Revalidation**: `/api/cart/validate` checks real-time database stock, authoritative prices, and active promo discounts with price-change notices.
- Wishlist with one-click transfer to shopping bag.
- Instant English / Bengali (বাংলা) localization switcher.

### 4. Customer Accounts & Order Privacy
- **Customer Portal**: Register, Login, My Orders history, Saved Address management, and Wishlist.
- **Guest Order Linking**: Link previous guest orders to an account using Order ID + Guest Security Token.
- **Order Privacy Protection**: Public tracking (`/api/orders/:id`) strictly masks customer names (`T*** A***`), phones (`017****3344`), and hides street addresses unless authenticated via user session or unguessable guest token.

### 5. Administrative Console
- **Metrics Dashboard**: Calculated from real orders (total revenue, completed orders, pending shipments, low stock alerts).
- **Order Management**: Status workflow (pending → confirmed → processing → shipped → delivered → cancelled), Cash on Delivery collection tracking, and notes.
- **Product Management**: Create, edit, publish/draft products, variant management, and validated image uploads (< 5MB, JPEG/PNG/WebP/GIF).
- **Inventory Adjustments**: Stock quantity updates with immutable audit trail (`inventory_adjustments`).
- **Promotions & Moderation**: Create time-bound discount codes (percentage or fixed BDT) and moderate product reviews.

---

## 🗄️ Relational Database Architecture

The application uses an ACID-compliant transactional database engine with a dual SQLite / PostgreSQL migration path:

1. **Embedded Production Default (Node 24 `DatabaseSync`)**:
   - High-performance native SQLite engine with Write-Ahead Logging (`WAL` mode).
   - Foreign key constraints enabled (`PRAGMA foreign_keys = ON`).
   - Atomic transactions (`BEGIN IMMEDIATE; ... COMMIT; / ROLLBACK;`) preventing race conditions and overselling during checkout and inventory allocation.
   - Database location: `data/store.db`.
2. **PostgreSQL Migration Schema**:
   - Full migration schema provided at `server/db/schema.sql`.
   - Setup instructions and connection configuration documented in `server/db/postgres-setup.md`.

---

## 💳 Real & Modular Payment Architecture

The storefront replaces mock payment fields with a secure, server-side validated payment engine located in `server/payments/`.

```
                    ┌───────────────────────────┐
                    │  Customer Checkout Modal  │
                    └─────────────┬─────────────┘
                                  │ POST /api/orders (canonical server pricing & stock reservation)
                                  ▼
                    ┌───────────────────────────┐
                    │   Server Canonical Order  │ (status: pending, reservation active)
                    └─────────────┬─────────────┘
                                  │ POST /api/payment/initiate
                                  ▼
           ┌─────────────────────────────────────────────┐
           │        Payment Provider Factory             │
           │        (server/payments/index.js)           │
           └──┬───────────────────┬───────────────────┬──┘
              │                   │                   │
       Credentials set?    Credentials set?    No credentials in .env
              ▼                   ▼                   ▼
    ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────────────┐
    │   SSLCommerz     │ │      bKash       │ │  Developer Sandbox       │
    │   Hosted V4      │ │ Tokenized V1.2.0 │ │  Isolated HMAC Provider  │
    └─────────┬────────┘ └─────────┬────────┘ └────────────┬─────────────┘
              │                    │                       │
              └────────────────────┴───────────────────────┘
                                   │
                                   ▼
                    ┌───────────────────────────┐
                    │  Transactional Finalize   │ (finalizeOrderPayment)
                    │    POST /api/payment/verify
                    │    POST /api/payment/ipn/* │
                    └─────────────┬─────────────┘
                                  │ Commit reservation -> stock reduction
                                  ▼
                    ┌───────────────────────────┐
                    │    Order Confirmed & Paid │ (status: confirmed, payment_status: paid)
                    └───────────────────────────┘
```

### Payment Gateway Security
- **Configured Public HTTPS Origin**: `getPublicOrigin()` uses `process.env.APP_URL` or `PUBLIC_URL` instead of fragile host headers, ensuring payment gateways redirect to the correct domain.
- **bKash Tokenized Checkout**: Integrates `executePayment` flow for verified capture.
- **Safe Developer Sandbox**: Isolated HMAC-SHA256 test gateway with tamper protection.
- **Safe Rollback**: Cancelled or expired payments automatically release inventory reservations.

---

## 🚀 Getting Started

### 1. Installation
```bash
git clone https://github.com/istihadahmed007/Tech.git
cd Tech
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Key environment variables:
| Variable | Description |
|---|---|
| `PORT` | HTTP server port (Default: `3000`) |
| `APP_URL` | Public origin URL for payment callbacks (e.g. `http://localhost:3000`) |
| `ADMIN_PASSWORD` | Passcode for the Admin Operations Console |
| `ADMIN_SESSION_SECRET` | Secret used to sign admin session tokens (min 32 chars) |
| `PAYMENT_GATEWAY_PROVIDER` | `sslcommerz`, `bkash`, or leave blank for auto-detection |
| `SSLCOMMERZ_STORE_ID` | Merchant store ID from SSLCommerz portal |
| `SSLCOMMERZ_STORE_PASSWD` | Merchant store password from SSLCommerz portal |
| `SSLCOMMERZ_IS_SANDBOX` | `true` for sandbox, `false` for live merchant accounts |
| `BKASH_APP_KEY` | bKash merchant App Key |
| `BKASH_APP_SECRET` | bKash merchant App Secret |
| `BKASH_USERNAME` | bKash merchant API username |
| `BKASH_PASSWORD` | bKash merchant API password |
| `BKASH_IS_SANDBOX` | `true` for bKash sandbox, `false` for live production |
| `SANDBOX_SIGNING_SECRET` | HMAC signing secret for local developer sandbox |
| `TRUSTED_PROXY` | Set to `true` when behind a reverse proxy (Nginx, Cloudflare) to trust `x-forwarded-for` |
| `SQLITE_DB_PATH` | Custom path to SQLite file (defaults to `data/store.db`; used for isolated tests) |

### 3. Development Mode
Run the Vite development server with the integrated backend API middleware:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Mode (Standalone Server)
Build the optimized frontend SPA and start the standalone production Node.js server:
```bash
npm run build
npm start
```
The production server (`server/server.js`):
- Serves pre-built assets from `dist/` with HTTP caching.
- Serves uploaded product images from `public/uploads/`.
- Routes `/api/*` directly to the transactional commerce backend.
- Provides SPA fallback for client-side routing.

### 5. Running Automated Tests
The repository includes automated unit and integration tests using Node.js's native test runner (`node:test`):
```bash
npm test
```
The test suite (**48 passing tests**) verifies:
- **Pricing & Cart Totals (`test/cart.test.js`)**: Subtotal calculation, free delivery threshold (৳2,000), regional shipping rates (Dhaka ৳60 / Outside Dhaka ৳120), and quantity bounds.
- **Checkout Customer Validation (`test/checkout-validation.test.js`)**: Bangladeshi mobile number formats (`01[3-9]\d{8}`), required customer name/address, catalog SKU verification, and out-of-stock rejection.
- **Commerce Architecture & Integration (`test/commerce-integration.test.js`)**:
  - Restocking and product audits.
  - Role-based authorization & customer order privacy.
  - Canonical server price enforcement.
  - Concurrent stock race condition prevention.
  - Idempotent checkout & payment notifications.
  - Inventory reservation release on payment cancellation.
  - Verified reviews validation.
  - Expired promotion rejection.
  - Standalone production server endpoint routing.
- **Printable Invoices, QR Codes & Logistics Dispatch (`test/invoice.test.js`)**: Pure JavaScript Model 2 QR code SVG generation, Code-128 linear barcode generation, BDT amount in words converter, print-optimized commercial tax invoice HTML, warehouse packing slip with picker checklist and courier handover manifest, batch printing, and admin CSV order exports.
- **Payment & Security Engine (`test/payment.test.js`)**: Safe fallback, cryptographic session tokens, HMAC-SHA256 signature verification, decline/cancellation handling, and timing-safe admin authentication.
- **Product Search & Filtering (`test/product-search.test.js`)**: Multi-field search across English and Bengali names, device compatibility lookup, category filtering, and in-stock toggling.
- **Production Readiness & System Resilience (`test/production-readiness.test.js`)**:
  - Isolated database lifecycle and idempotent catalog/admin seeding without duplicate constraint failures (`ON CONFLICT`).
  - Strict JSON validation rejecting malformed bodies with HTTP 400 Bad Request.
  - Request payload size protection capping stream payloads at 1MB with HTTP 413.
  - Reverse proxy security gating `x-forwarded-for` header evaluation behind `TRUSTED_PROXY`.
  - Dynamic production secret validation failing fast on insecure defaults in production environments.
  - Unauthenticated customer order privacy masking with full unmasking for authorized guest tokens.

---

## ♿ Accessibility & Navigation

- **Accessible Dialogs**: Every modal dialog (`AccountModal`, `CartDrawer`, `CheckoutModal`, `OrderConfirmationModal`, `OrderTrackingModal`, `ProductDetailModal`, `SupportModal`, `AdminModal`) includes `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and an active Escape-key dismissal handler.
- **Keyboard Navigation & Event Isolation**: Nested interactive triggers inside product cards strictly isolate `click` and `keydown` (`Enter`/`Space`) event propagation to prevent accidental modal triggers.
- **Focus Rings & Motion Safety**: High-contrast `:focus-visible` styling is enforced globally, and `@media (prefers-reduced-motion: reduce)` disables nonessential transitions.
- **Form Controls**: All inputs are explicitly bound to `<label htmlFor="...">` with contextual `autocomplete` attributes (`name`, `tel`, `street-address`).

---

## 📋 Production Deployment Checklist

- [ ] Obtain live merchant account credentials from SSLCommerz or bKash.
- [ ] Set `APP_URL` to your live domain (e.g. `https://accessories.yourdomain.com`).
- [ ] Set `ADMIN_PASSWORD` and a random 32+ character `ADMIN_SESSION_SECRET`.
- [ ] Configure IPN / Webhook URLs in your merchant gateway portal:
  - SSLCommerz: `https://yourdomain.com/api/payment/ipn/sslcommerz`
  - bKash: `https://yourdomain.com/api/payment/ipn/bkash`
- [ ] Run `npm run build` and launch using `npm start` (or containerized with Node 24+).
- [ ] (Optional) Run `server/db/schema.sql` on a managed PostgreSQL cluster and set `DATABASE_URL`.
