# Glacial Tech — Production-Ready Mobile Accessories Storefront

A high-performance, polished e-commerce storefront for mobile accessories in Bangladesh (BDT `৳`). Built with **React 18**, **Vanilla CSS**, and a **Node.js** modular commerce backend, adhering to a high-contrast Glacial Glassmorphic visual identity without distracting 3D motion.

---

## 💎 Design Identity & Aesthetics

- **Static, High-Contrast Hero**: Clean, fast, and completely static hero showcase—**zero Three.js, zero WebGL, zero autoplay animations, and zero parallax or floating motion**.
- **Glacial Glassmorphic Aesthetic**:
  - **Canvas Background**: `#EAF5FF` (soft ice-blue tint)
  - **Surfaces**: `#F8FCFF` (translucent frosted panels with high background blur)
  - **Typography**: `#112A43` (Deep navy ink meeting WCAG AAA contrast guidelines)
  - **Action Triggers**: `#2563EB` (Tactile electric-blue buttons with visible `:focus-visible` focus rings)
  - **Glass Borders**: `rgba(37, 99, 235, 0.12)` with delicate specular rims
- **Honest Signals & Clear Trust**: Explicit badges for Official Warranty, 7-Day Return Policy, Genuine Import, and Next-Day Dhaka Delivery.

---

## ⚡ Key Storefront Features

### 1. Catalog & Device Compatibility Finder
- **Verified Model Fit**: Instant filtering for Apple (*iPhone 15 Pro, 14 Pro, etc.*), Samsung (*Galaxy S24 Ultra, Z Fold 5, etc.*), Google Pixel, and Xiaomi.
- **Category Browsing**: Cases, Audio, Fast Charging, and MagSafe Power Banks.
- **Search & Sort**: Real-time keyword search across titles, descriptions, and device models; price and rating sorting; in-stock toggle.
- **Zero-State Handling**: Clear guidance when a device filter produces no matching accessories, with single-click filter resets.

### 2. Product Detail Experience
- Multi-angle gallery with interactive thumbnail switcher.
- Variant finish selector (*Glacial Ice Blue, Pearl White, Titanium Slate, Navy*).
- Full technical specification sheet.
- Direct **Add to Bag** and **Buy Now** flows.

### 3. Cart & Wishlist
- Slide-over frosted drawer with live stock bounds.
- Dynamic delivery progress meter unlocking **Free Delivery at ৳2,000**.
- Wishlist with one-click transfer to shopping bag.
- Instant English / Bengali (বাংলা) localization switcher.

---

## 💳 Real & Modular Payment Architecture

The storefront replaces mock payment fields (such as manual TrxID entry or fake card forms) with a secure, server-side validated payment engine located in `server/payments/`.

```
                    ┌───────────────────────────┐
                    │  Customer Checkout Modal  │
                    └─────────────┬─────────────┘
                                  │ POST /api/orders (idempotent, stock check)
                                  ▼
                    ┌───────────────────────────┐
                    │   Server Canonical Order  │ (status: pending_payment)
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
                    │  Server-Side Verification │
                    │    POST /api/payment/verify
                    │    POST /api/payment/ipn/* │
                    └─────────────┬─────────────┘
                                  │ Signature check, amount check, tran_id check
                                  ▼
                    ┌───────────────────────────┐
                    │    Order Confirmed & Paid │ (status: confirmed, paid)
                    │    Inventory Allocated    │
                    └───────────────────────────┘
```

### Payment Gateway States & Production Setup

1. **Unconfigured Gateway Behavior (Default State)**:
   - When merchant credentials are not set in `.env`, the checkout interface **clearly labels online payments as unavailable** (`Unavailable (Setup Required)`).
   - The backend `/api/payment/initiate` and `/api/payment/verify` endpoints **strictly refuse initiation and verification**, never faking payment success or accepting simulated transaction IDs.
2. **Cash on Delivery (Demo Mode)**:
   - Visibly marked as **Demo Mode**. Orders submitted via COD are recorded in the local store database with `status: 'demo_received'` and `paymentStatus: 'unpaid'`.
   - The confirmation screen explicitly states that this is a test demonstration order without charging real money or dispatching actual warehouse stock.
3. **Live Gateway Providers (Production Ready)**:
   - **SSLCommerz**: Multi-channel gateway for Bangladesh (bKash, Nagad, Visa, Mastercard). Redirects to official hosted checkout and verifies via server-to-server API.
   - **bKash Tokenized Checkout**: Direct API v1.2.0 integration for merchant bKash payments.

### Security & Verification Guarantees
- **No Card Data in React State**: No card numbers or CVVs are collected or stored in frontend state.
- **Strict Server-Side Verification**: Orders are never marked `paid` or `confirmed` without cryptographic gateway verification. Typed transaction IDs or frontend redirects are never accepted as proof.
- **Timing-Safe Admin Auth**: Admin passcodes and session tokens are compared using `crypto.timingSafeEqual`.

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
| `ADMIN_PASSWORD` | Passcode for the Admin Operations Console |
| `ADMIN_SESSION_SECRET` | Secret used to sign admin session tokens |
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

### 3. Running Locally
Start the Vite development server with the Node.js API router:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Running Automated Tests
The repository includes automated unit and integration tests using Node.js's native test runner (`node:test`):
```bash
npm test
```
The test suite (23 tests across 4 suites) verifies:
- **Shared Pricing & Cart Totals (`test/cart.test.js`)**: Subtotal calculation, free delivery threshold (৳2,000), regional shipping rates (Dhaka ৳60 / Outside Dhaka ৳120), and item quantity bounds.
- **Checkout Customer Validation (`test/checkout-validation.test.js`)**: Bangladeshi mobile number formats (`01[3-9]\d{8}` with prefixes), required customer name/address, catalog SKU verification, and out-of-stock rejection.
- **Payment & Security Engine (`test/payment.test.js`)**: Safe fallback to sandbox when credentials are unconfigured, cryptographically secure session tokens, HMAC-SHA256 signature verification, decline/cancellation handling, and timing-safe admin authentication.
- **Product Search & Filtering (`test/product-search.test.js`)**: Multi-field search across English and Bengali names, device compatibility lookup, category filtering, and in-stock toggling.

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## 📦 Demo / Seed Catalog vs. Production Data

- **Catalog Seed Source**: Products in `src/data/catalog.js` represent demonstration seed data marked with `isDemoSeed: true`.
- **Honest Labeling**: Demo items display a neutral "Demo item" badge in the UI rather than implying verified warehouse inventory or unverified official warranties.
- **Warranties & Stock**: Product cards and detail views pull specific warranty and inventory fields (`warranty`, `stock`) directly from each item's data record rather than asserting generic or blanket guarantees.
- **Production Integration**: To replace demo seed data with live merchandise, populate `server/data-store.json` via the Admin Dashboard or swap the file-backed store in `server/db.js` for an external database (PostgreSQL, MongoDB, etc.).

---

## 📐 Shared Pricing Single Source of Truth

To ensure the Cart Drawer, Checkout Modal, and Backend Order API always agree with zero drift:
- All pricing, free-shipping thresholds, and delivery rates are governed by `src/utils/pricing.js`:
  - `FREE_SHIPPING_THRESHOLD = 2000` (Orders ৳2,000+ receive free standard shipping).
  - `SHIPPING_RATES = { INSIDE_DHAKA: 60, OUTSIDE_DHAKA: 120 }`.
  - Exported pure functions: `calculateCartSubtotal`, `calculateDeliveryFee`, and `calculateOrderTotals`.
- Both frontend components (`CartDrawer.jsx`, `CheckoutModal.jsx`) and the server endpoint (`server/api.js`) consume this shared utility, ensuring the customer is never charged a different delivery fee or total than displayed in the bag.

---

## ♿ Accessibility & Navigation

- **Accessible Dialogs**: Every modal dialog (`CartDrawer`, `CheckoutModal`, `OrderConfirmationModal`, `PaymentGatewayModal`, `ProductDetailModal`, `SupportModal`, `WishlistModal`, `AdminModal`) includes `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and an active Escape-key dismissal handler.
- **Keyboard Navigation & Event Isolation**: Nested interactive triggers inside product cards (such as the quick wishlist toggle and quick-add button) strictly isolate `click` and `keydown` (`Enter`/`Space`) event propagation to prevent accidental activation of the product detail modal.
- **Focus Rings & Motion Safety**: High-contrast `:focus-visible` styling is enforced globally, and `@media (prefers-reduced-motion: reduce)` disables nonessential transitions for users with vestibular preferences.
- **Form Controls**: All inputs are explicitly bound to `<label htmlFor="...">` with contextual `autocomplete` attributes (`name`, `tel`, `street-address`).

---

## 🧪 Testing the Checkout & Payment Flow (Sandbox Walkthrough)

1. Open the storefront in your browser at `http://localhost:3000`.
2. Browse products, filter by device model (e.g. *iPhone 15 Pro Max*), and add items to your shopping bag.
3. Open the shopping bag and click **Proceed to Checkout**.
4. In the checkout modal:
   - Enter your name (e.g. *Tanvir Ahmed*).
   - Enter a valid Bangladeshi phone number (e.g. `01712345678`).
   - Enter your delivery address.
   - Choose **Online Payment Gateway** (or test **Cash on Delivery**).
   - Click **Proceed to Payment**.
5. You will see the **Hosted Payment Gateway (Sandbox Test Mode)** modal:
   - An amber banner explains that developer test mode is active because live merchant credentials are not yet added to `.env`.
   - Select a channel (e.g. *bKash*, *Nagad*, or *Visa/Card*).
   - Click **Simulate Successful Payment** to trigger server-side HMAC validation and transition the order to `paid` and `confirmed`.
   - Or click **Simulate Decline** / **Simulate Cancel** to verify safe cancellation and rollback flows.
6. Upon successful verification, you receive the confirmation screen with the generated Order ID and real server transaction ID.
7. Click the **Admin** shield icon in the header, enter passcode `admin123`, and inspect the live order queue and real-time revenue analytics.

---

## 🌐 Webhook / IPN Setup for Production

When going live with an official payment gateway in Bangladesh:

### For SSLCommerz:
1. Log into your SSLCommerz Merchant Panel.
2. Under **My Stores > IPN Settings**, configure your IPN listener URL:
   ```
   https://yourdomain.com/api/payment/ipn/sslcommerz
   ```
3. Set HTTP method to `POST`.
4. Ensure your server environment sets `SSLCOMMERZ_IS_SANDBOX=false`.

### For bKash:
1. Set up your Tokenized URL in the bKash Merchant Portal.
2. Configure webhook notifications pointing to:
   ```
   https://yourdomain.com/api/payment/ipn/bkash
   ```
3. Ensure your server environment sets `BKASH_IS_SANDBOX=false`.

---

## 📋 Production Deployment Checklist

- [ ] Obtain live merchant account credentials from SSLCommerz or bKash.
- [ ] Set `SSLCOMMERZ_STORE_ID`, `SSLCOMMERZ_STORE_PASSWD`, and `SSLCOMMERZ_IS_SANDBOX=false` in your production hosting environment.
- [ ] Set a strong `ADMIN_PASSWORD` and random `ADMIN_SESSION_SECRET`.
- [ ] Configure IPN / Webhook URLs in your merchant gateway portal.
- [ ] Finalize physical store address, customer service telephone numbers, and live return policies.
- [ ] Connect a persistent database (e.g. PostgreSQL, MySQL, or MongoDB) by replacing the local atomic `data-store.json` adapter in `server/db.js`.
- [ ] Ensure HTTPS/TLS is terminated at your reverse proxy or CDN edge.

