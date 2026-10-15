// scripts/purge_mock_products.js
import fs from 'fs';
import path from 'path';

const catalogPath = path.resolve('src/data/catalog.js');
let content = fs.readFileSync(catalogPath, 'utf8');

// 1. Locate start of CATEGORIES
const catStartMarker = 'export const CATEGORIES = [';
const catStartIdx = content.indexOf(catStartMarker);
if (catStartIdx === -1) {
  throw new Error('Could not find CATEGORIES in catalog.js');
}

// 2. Locate the first authentic product: h2-anc-pro-tws
const h2Idx = content.indexOf('"id": "h2-anc-pro-tws"');
if (h2Idx === -1) {
  throw new Error('Could not find h2-anc-pro-tws in catalog.js');
}

// Back up to the opening brace of h2-anc-pro-tws
const h2BraceIdx = content.lastIndexOf('{', h2Idx);
if (h2BraceIdx === -1) {
  throw new Error('Could not find opening brace for h2-anc-pro-tws');
}

// Prefix before CATEGORIES
const prefix = content.substring(0, catStartIdx);

// New CATEGORIES and start of INITIAL_PRODUCTS
const newMiddle = `export const CATEGORIES = [
  {
    id: "audio",
    name: "Audio",
    nameBn: "অডিও গিয়ার",
    description: "Lossless acoustic fidelity, hybrid active noise cancellation, studio headsets & neckbands.",
    itemCount: 18,
    badge: "Spatial Audio",
    icon: "Headphones"
  },
  {
    id: "charging",
    name: "Charging",
    nameBn: "ফাস্ট চার্জিং",
    description: "High-density fast chargers, multi-tip cables & durable charging solutions.",
    itemCount: 7,
    badge: "Fast Charge",
    icon: "Zap"
  },
  {
    id: "wearables",
    name: "Smartwatches",
    nameBn: "স্মার্টওয়াচ ও ব্যান্ড",
    description: "HD displays, multi-strap packs, cellular SIM calling & health tracking.",
    itemCount: 4,
    badge: "Bluetooth Calling",
    icon: "Watch"
  }
];

export const INITIAL_PRODUCTS = [
  `;

// Suffix starting from h2-anc-pro-tws opening brace
let suffix = content.substring(h2BraceIdx);

// Fix gallery cleanups in suffix:
// Fix turbo-single-wall-charger
suffix = suffix.replace(
  '            "/assets/products/p07-oppo-style-27w-charger.jpg",\n            "/assets/cat-charging.jpg"',
  '            "/assets/products/p07-oppo-style-27w-charger.jpg"'
);
suffix = suffix.replace(
  '            "/assets/products/p07-oppo-style-27w-charger.jpg",\r\n            "/assets/cat-charging.jpg"',
  '            "/assets/products/p07-oppo-style-27w-charger.jpg"'
);

// Fix fighter-superbass-headset
suffix = suffix.replace(
  '            "/assets/products/p09-tucci-a5-fighter-headset.jpg",\n            "/assets/products/oraimo-or08-headset.jpg"',
  '            "/assets/products/p09-tucci-a5-fighter-headset.jpg"'
);
suffix = suffix.replace(
  '            "/assets/products/p09-tucci-a5-fighter-headset.jpg",\r\n            "/assets/products/oraimo-or08-headset.jpg"',
  '            "/assets/products/p09-tucci-a5-fighter-headset.jpg"'
);

// Fix oraimo-or08-wireless-headset duplicate
suffix = suffix.replace(
  '            "/assets/products/p14-oraimo-or08-headset.jpg",\n            "/assets/products/oraimo-or08-headset.jpg"',
  '            "/assets/products/p14-oraimo-or08-headset.jpg"'
);
suffix = suffix.replace(
  '            "/assets/products/p14-oraimo-or08-headset.jpg",\r\n            "/assets/products/oraimo-or08-headset.jpg"',
  '            "/assets/products/p14-oraimo-or08-headset.jpg"'
);

const updatedContent = prefix + newMiddle + suffix;
fs.writeFileSync(catalogPath, updatedContent, 'utf8');
console.log('Successfully purged legacy mock products from catalog.js!');
