# Accessories — Premium Ice-Blue Retail Design System (DESIGN.md)

*Derived from Stitch MCP Project `projects/10436377106137043740` (Design System `assets/9e29a3cb9e2742ccb3f0374cf8a3db5d`)*
*Generated Screens: Desktop 1440px (`cd35e62b8bbd44229c0a1315bb2224b6`), Mobile 390px (`cd2ae62201a94b6f84b89034f8f878a2`)*

---

## 1. Visual Direction: Premium Ice-Blue Retail

The storefront visual identity is calm, precise, spacious, and trustworthy. The aesthetic avoids aggressive neon glows, heavy blurs, and loud promotional banners, allowing excellent static product imagery, crisp typography, and restrained tactile glass surfaces to anchor the shopping experience.

### Core Design Tokens

| Token | Hex / Value | Usage & Application |
|---|---|---|
| **Main Background** | `#F7FBFF` | Canvas root background across the entire storefront |
| **Ice-Blue Section Background** | `#EAF4FC` | Alternate section tint, category pedestals, filter chips |
| **Product Surfaces** | `#FFFFFF` | Opaque product cards, modal surfaces, form inputs |
| **Primary Text** | `#10263D` | Headings, product titles, prices, high-contrast labels |
| **Secondary Text** | `#52677B` | Subtitles, descriptions, specs, metadata |
| **Tertiary / Muted Text** | `#8FA6BE` | Placeholders, inactive counts, breadcrumbs |
| **Primary Action** | `#145CFF` | Primary action buttons (`Shop accessories`, `Add to bag`, checkout) |
| **Action Hover** | `#0D4BD9` | Hover state for primary action triggers |
| **Subtle Borders** | `#DCE7F0` | Structural card borders, dividers, subtle input strokes |
| **Success / Stock** | `#059669` | In-stock indicators, verified fit badges |
| **Warning / Low Stock** | `#D97706` | Low stock badges, caution alerts |

---

## 2. Glass Treatment & Surface Architecture

- **Restrained Application**: Frosted glass is applied specifically to sticky navigation headers, active overlays, and selected badges.
- **Opaque Reading Surfaces**: Product descriptions, price blocks, spec sheets, checkout forms, and modal bodies remain sufficiently opaque (`#FFFFFF` or `#F7FBFF` at `95%+`) to guarantee high-contrast readability.
- **No Distracting Decoration**: Strictly avoid heavy blurs (`blur(40px)`), neon glowing borders, oversized drop shadows, or floating background shapes.
- **Micro-Specular Edge**: Cards feature a crisp `1px solid #DCE7F0` boundary paired with an ultra-subtle top specular highlight `inset 0 1px 0 rgba(255, 255, 255, 0.9)`.

---

## 3. Layout & Spacing System

- **Max Content Width**: `1320px` (centered with `mx-auto`).
- **Desktop Horizontal Padding**: `48px` to `64px` (`px-6 sm:px-12 lg:px-16`).
- **Mobile Horizontal Padding**: `20px` (`px-5`).
- **Spacing Scale**: Strictly adhere to `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`.
- **Corner Radii**:
  - Small badges & chips: `9999px` (fully rounded pills)
  - Inputs & action buttons: `12px` to `14px`
  - Cards & containers: `16px` to `20px`
- **Section Separation**: Separate page sections primarily through whitespace rhythm (`my-12 sm:my-16 lg:my-20`) rather than enclosing every section in heavy nested boxes.

---

## 4. Typography Hierarchy

- **Font Family**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif` (with fallback to `Noto Sans Bengali` for bilingual clarity).
- **Desktop Hero Heading**: `64px` to `72px`, font-weight `800`, line-height `1.08`, tracking `-0.03em`.
- **Mobile Hero Heading**: `36px` to `40px`, font-weight `800`, line-height `1.15`, tracking `-0.025em`.
- **Section Headings**: `28px` to `34px` desktop, `24px` to `26px` mobile, font-weight `700`, line-height `1.2`.
- **Product Titles**: `15px` to `16px`, font-weight `600`, line-height `1.35`.
- **Product Prices**: `18px` to `22px`, font-weight `800`, deep navy `#10263D`.
- **Body Text**: `15px` to `16px`, line-height `1.6`, slate `#52677B`.
- **Supporting / Micro-Labels**: `12px` to `13px`, font-weight `500` or `600`, tracking `0.02em`.

---

## 5. Homepage Structure & Content

1. **Header**:
   - Brand logo `Accessories` in `#10263D` on left.
   - Concise navigation: `Shop`, `Find my fit`, `Support` with subtle hover indicators.
   - Clean search bar with clear placeholder and keyboard shortcut dismiss (`Escape`).
   - Line icon triggers for language switcher (`BN`/`EN`), Wishlist (`Heart` + count badge), Admin profile (`User`), and Shopping Bag (`Bag` + count badge).
   - Sticky frosted glass backdrop (`backdrop-blur-md bg-[#F7FBFF]/85 border-b border-[#DCE7F0]`).

2. **Hero Section (Directed 3D Motion)**:
   - **Headline**:
     ```
     Small upgrades.
     Everyday better.
     ```
   - **Supporting Copy**: `Cases, sound and power for your everyday.`
   - **Action Buttons**:
     - Primary: `Shop accessories` (Solid `#145CFF` pill with chevron)
     - Secondary: `Find my phone` (Clean text link `#145CFF` with phone icon)
   - **3D Motion Specification (Three.js WebGL)**:
     - Floating: Slow 7–10s cycle with subtle 6–10px (~0.075 world units) displacement.
     - Gentle Rotation: Small controlled oscillation range (±2.5°), without continuous spinning.
     - Pointer Depth Tilt: Desktop mouse interaction with subtle 2–3° parallax, smoothly returning to resting origin on `mouseleave`.
     - Category Reactivity: When a category is selected (`cases`, `audio`, `charging`), the featured 3D accessory smoothly translates into central spotlight with graceful lerping and stable camera continuity.
     - Fast & Accessible: Lazy-loaded in a separate chunk (`Hero3DCanvas`), dimensions reserved (`h-[400px] sm:h-[460px] lg:h-[500px]`) to eliminate layout shift, respects `prefers-reduced-motion`, visible floating Pause/Resume control, halts rendering when offscreen or in background tabs, and renders high-fidelity static studio fallback if WebGL is unavailable.

3. **Device Compatibility Finder**:
   - Compact module immediately beneath the hero.
   - Select Phone Brand (Apple, Samsung, Google) & Model (iPhone 15 Pro, S24 Ultra, Pixel 8 Pro).
   - Direct `Find accessories` action trigger.
   - Immediate feedback banner showing filtered devices with single-click dismissal.

4. **Curated Category Pedestals**:
   - Four image-led categories: **Cases**, **Audio**, **Charging**, **Power Banks**.
   - Clean display pedestals with smooth hover lift and active selection indicator.

5. **Curated Product Collection**:
   - 4-column layout on wide desktop (≥1024px), 3-column on tablet, 2-column on mobile.
   - Cards on `#FFFFFF` with `#DCE7F0` border, generous image space, variant finishes, in-stock badge, and royal blue `Add` pill button.

6. **Service Guarantees & Genuine Trust Signals**:
   - Standard courier delivery rates: ৳60 Dhaka, ৳120 Nationwide, Free over ৳2,000.
   - 7-Day Replacement Policy.
   - Verified Authentic Devices.
   - Dedicated Local Support & Storefront in Dhaka.

7. **Concise Footer**:
   - Categorized links (Categories, Assistance, Operations).
   - Clean list items without browser bullet points or button bevels.
   - Store status, location, copyright, and payment method icons.

---

## 6. Commerce & Shopping Journey

- **Cart Drawer**: Unified slide-over drawer with transparent shipping calculation, subtotal, delivery fee, and free delivery progress tracker.
- **Checkout Modal**: Calm, single-purpose checkout flow. Honest payment options (Cash on Delivery, Verified Online Payment via Sandbox or Live gateway). Zero direct card number/CVV collection in unsecured React state.
- **Product Details Modal**: High-resolution image gallery, variant selection swatches, verified device compatibility checklist, honest stock status, delivery expectations, and prominent `Add to bag` action.
- **Order Tracking & Confirmation**: Transparent order status tracking using real order IDs with verified state models.
