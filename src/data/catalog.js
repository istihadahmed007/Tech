// Mobile Accessories Store Catalog
// Explicitly marked development seed with authentic compatibility relations & technical specifications

export const BRANDS_AND_MODELS = [
  {
    brand: "Apple",
    models: [
      "iPhone 15 Pro Max",
      "iPhone 15 Pro",
      "iPhone 15 Plus",
      "iPhone 15",
      "iPhone 14 Pro Max",
      "iPhone 14 Pro",
      "iPhone 13 Pro"
    ]
  },
  {
    brand: "Samsung",
    models: [
      "Galaxy S24 Ultra",
      "Galaxy S24+",
      "Galaxy S24",
      "Galaxy S23 Ultra",
      "Galaxy Z Fold 5",
      "Galaxy Z Flip 5"
    ]
  },
  {
    brand: "Google",
    models: [
      "Pixel 8 Pro",
      "Pixel 8",
      "Pixel 7 Pro",
      "Pixel 7a"
    ]
  },
  {
    brand: "Xiaomi",
    models: [
      "Xiaomi 14 Ultra",
      "Xiaomi 14",
      "Redmi Note 13 Pro+"
    ]
  }
];

export const CATEGORIES = [
  {
    id: "cases",
    name: "Cases",
    nameBn: "কেস এবং কভার",
    description: "Frosted MagSafe protection, optical-clarity polycarbonates & titanium accents.",
    itemCount: 4,
    badge: "MagSafe 15W",
    icon: "Shield"
  },
  {
    id: "audio",
    name: "Audio",
    nameBn: "অডিও গিয়ার",
    description: "Lossless acoustic fidelity, hybrid active noise cancellation & low-latency sound.",
    itemCount: 3,
    badge: "Spatial Audio",
    icon: "Headphones"
  },
  {
    id: "charging",
    name: "Charging",
    nameBn: "ফাস্ট চার্জিং",
    description: "Next-gen Gallium Nitride (GaN) high-density multi-port power delivery.",
    itemCount: 4,
    badge: "65W GaN",
    icon: "Zap"
  },
  {
    id: "powerbanks",
    name: "Power Banks",
    nameBn: "পাওয়ার ব্যাংক",
    description: "Ultra-slim magnetic power cells with high-speed bidirectional USB-C output.",
    itemCount: 3,
    badge: "Qi2 Fast",
    icon: "BatteryCharging"
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: "aura-frost-magsafe-case",
    title: "Aura Frost MagSafe Glass Case",
    titleBn: "অরা ফ্রস্ট ম্যাগসেফ গ্লাস কেস",
    category: "cases",
    badge: "Bestseller",
    price: 2450,
    originalPrice: 2850,
    rating: 4.9,
    reviewCount: 148,
    stock: 18,
    isDevelopmentSeed: true,
    warranty: "6-Month Official Replacement",
    description: "Ultra-clear frosted polycarbonate back with tactile anodized aluminum buttons and seamless MagSafe neodymium ring.",
    specs: {
      "Material": "Optical Bayer Polycarbonate & TPU",
      "Drop Protection": "Military Grade MIL-STD-810H (12ft)",
      "Wireless Charging": "MagSafe 15W & Qi Compliant",
      "Bezel Elevation": "1.5mm Screen / 2.2mm Camera Ring",
      "Weight": "32 grams"
    },
    variants: [
      { id: "v1", name: "Glacial Ice Blue", hex: "#CBE4FC", inStock: true },
      { id: "v2", name: "Pearl Frost White", hex: "#F3F7FA", inStock: true },
      { id: "v3", name: "Titanium Slate", hex: "#7E90A3", inStock: true },
      { id: "v4", name: "Deep Ocean Navy", hex: "#112A43", inStock: true }
    ],
    compatibleWith: [
      "iPhone 15 Pro Max",
      "iPhone 15 Pro",
      "iPhone 15",
      "iPhone 14 Pro Max",
      "iPhone 14 Pro"
    ],
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=700&q=80"
    ]
  },
  {
    id: "glacier-tws-anc-earbuds",
    title: "Glacier Pro Wireless Earbuds",
    titleBn: "গ্লেসিয়ার প্রো ওয়্যারলেস এয়ারবাডস",
    category: "audio",
    badge: "48dB ANC",
    price: 5890,
    originalPrice: 6500,
    rating: 4.8,
    reviewCount: 96,
    stock: 12,
    isDevelopmentSeed: true,
    warranty: "12-Month Official Warranty",
    description: "Dual titanium drivers with adaptive Hybrid ANC, LDAC lossless codec, and transparent frosted charging case.",
    specs: {
      "Driver Unit": "11mm Liquid Crystal Polymer + Planar",
      "Noise Cancellation": "Up to 48dB Active Hybrid ANC",
      "Battery Life": "8h (Buds) + 32h (Pebble Case)",
      "Connectivity": "Bluetooth 5.4 / Dual Device Multipoint",
      "Water Resistance": "IPX5 Sweat & Water Resistant"
    },
    variants: [
      { id: "v1", name: "Chilled Ice Blue", hex: "#D6ECFF", inStock: true },
      { id: "v2", name: "Pure Arctic White", hex: "#FFFFFF", inStock: true },
      { id: "v3", name: "Matte Midnight", hex: "#0E1C2D", inStock: true }
    ],
    compatibleWith: [
      "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15",
      "Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24", "Galaxy S23 Ultra",
      "Pixel 8 Pro", "Pixel 8", "Xiaomi 14 Ultra", "Xiaomi 14"
    ],
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=700&q=80"
    ]
  },
  {
    id: "aura-gan-65w-charger",
    title: "Aura GaN 65W Dual-Port Charger",
    titleBn: "অরা জিএএন ৬৫ওয়াট ডুয়াল-পোর্ট চার্জার",
    category: "charging",
    badge: "GaNFast III",
    price: 3200,
    originalPrice: 3600,
    rating: 5.0,
    reviewCount: 215,
    stock: 24,
    isDevelopmentSeed: true,
    warranty: "18-Month Official Warranty",
    description: "Next-gen Gallium Nitride tech delivers 65W fast power in a pocketable translucent frosted ice-blue shell.",
    specs: {
      "Output Power": "65W Max (USB-C1 + USB-C2 Power Split)",
      "Protocols": "PD 3.0, QC 4+, PPS (45W Samsung Super Fast 2.0)",
      "Safety": "ActiveShield 2.0 Dynamic Temp Monitoring",
      "Prongs": "Folding US/UK Pin Mechanism with EU adapter",
      "Dimensions": "48 x 40 x 30 mm (105g)"
    },
    variants: [
      { id: "v1", name: "Ice Blue Edition", hex: "#C5E2FD", inStock: true },
      { id: "v2", name: "Pearl White", hex: "#F8FCFF", inStock: true }
    ],
    compatibleWith: [
      "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15",
      "Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24", "Galaxy S23 Ultra",
      "Pixel 8 Pro", "Pixel 8", "Xiaomi 14 Ultra", "Xiaomi 14"
    ],
    image: "https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=700&q=80"
    ]
  },
  {
    id: "snapcharge-magsafe-10k-powerbank",
    title: "SnapCharge MagSafe 10,000mAh Power Bank",
    titleBn: "স্ন্যাপচার্জ ম্যাগসেফ ১০,০০০এমএএইচ পাওয়ার ব্যাংক",
    category: "powerbanks",
    badge: "Only 4 Left",
    price: 4150,
    originalPrice: 4750,
    rating: 4.9,
    reviewCount: 138,
    stock: 4,
    isDevelopmentSeed: true,
    warranty: "12-Month Official Warranty",
    description: "Ultra-slim 14mm magnetic power cell with frosted LED battery percentage display and foldable zinc kickstand.",
    specs: {
      "Capacity": "10,000 mAh / 38.5 Wh Lithium Polymer",
      "Wireless Output": "15W MagSafe Fast Charge / Qi2",
      "USB-C Bidirectional": "27W PD Rapid Input & Output",
      "Pass-through Charging": "Yes, charge phone and battery simultaneously",
      "Weight": "188g"
    },
    variants: [
      { id: "v1", name: "Glacial Frost", hex: "#D9ECFF", inStock: true },
      { id: "v2", name: "Deep Navy", hex: "#112A43", inStock: true }
    ],
    compatibleWith: [
      "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro Max", "iPhone 14 Pro"
    ],
    image: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=700&q=80"
    ]
  },
  {
    id: "s24-ultra-armor-lens-case",
    title: "Vapor Shield Case for Galaxy S24 Ultra",
    titleBn: "ভেপার শিল্ড কেস (গ্যালাক্সি এস২৪ আল্ট্রা)",
    category: "cases",
    badge: "S-Pen Ready",
    price: 2650,
    originalPrice: 3100,
    rating: 4.9,
    reviewCount: 84,
    stock: 15,
    isDevelopmentSeed: true,
    warranty: "6-Month Official Replacement",
    description: "Frosted matte smoke finish with built-in aerospace aluminum camera slider protection and precision S-Pen port.",
    specs: {
      "Material": "Composite Polycarbonate + Shock Cushion Corners",
      "Camera Guard": "0.8mm Sliding Anodized Shield",
      "S-Pen Access": "Direct ergonomic cut-out",
      "Anti-Yellowing": "UV-resistant blue tint coating",
      "Weight": "38 grams"
    },
    variants: [
      { id: "v1", name: "Ice Blue Tint", hex: "#CFE4FC", inStock: true },
      { id: "v2", name: "Matte Charcoal", hex: "#2C3946", inStock: true }
    ],
    compatibleWith: [
      "Galaxy S24 Ultra"
    ],
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=700&q=80"
    ]
  },
  {
    id: "pixel-8-pro-frost-bumper",
    title: "PureGlass Guard for Pixel 8 Pro",
    titleBn: "পিউরগ্লাস গার্ড (পিক্সেল ৮ প্রো)",
    category: "cases",
    badge: "Visor Protected",
    price: 2200,
    originalPrice: 2600,
    rating: 4.7,
    reviewCount: 52,
    stock: 9,
    isDevelopmentSeed: true,
    warranty: "6-Month Official Replacement",
    description: "Custom contoured case framing Google Pixel's iconic camera visor in precision CNC aluminum with ice-blue textured grip.",
    specs: {
      "Material": "Frosted Hybrid Polymer",
      "Grip": "Tactile micro-groove side rails",
      "Wireless Charging": "Fully compatible with Qi standard",
      "Weight": "29 grams"
    },
    variants: [
      { id: "v1", name: "Frosted Ice", hex: "#E2F0FE", inStock: true },
      { id: "v2", name: "Obsidian Slate", hex: "#1D2A38", inStock: true }
    ],
    compatibleWith: [
      "Pixel 8 Pro",
      "Pixel 8"
    ],
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=80"
    ]
  },
  {
    id: "woven-silicone-usbc-240w-cable",
    title: "Kevlar Woven 240W USB-C to USB-C Cable (2m)",
    titleBn: "কেভলার বোনা ২৪০ওয়াট ইউএসবি-সি ক্যাবল (২মি)",
    category: "charging",
    badge: "240W PD 3.1",
    price: 1450,
    originalPrice: 1750,
    rating: 4.9,
    reviewCount: 167,
    stock: 35,
    isDevelopmentSeed: true,
    warranty: "24-Month Lifetime Replacement",
    description: "Braided double-weave nylon cable rated for 240W power delivery, E-Marker chip, and reinforced aluminum strain-relief neck.",
    specs: {
      "Transfer Speed": "USB 2.0 (480 Mbps) Data / 240W Power (48V/5A)",
      "Bending Test": "35,000+ Verified 90-degree flex lifespan",
      "Cable Length": "2.0 Meters (6.6 ft)",
      "Chip": "E-Marker Smart Protocol Negotiator"
    },
    variants: [
      { id: "v1", name: "Ice Blue Weave", hex: "#A8D2F8", inStock: true },
      { id: "v2", name: "Arctic Silver", hex: "#DCE5EC", inStock: true },
      { id: "v3", name: "Deep Navy", hex: "#112A43", inStock: true }
    ],
    compatibleWith: [
      "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15",
      "Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24", "Galaxy S23 Ultra",
      "Pixel 8 Pro", "Pixel 8", "Xiaomi 14 Ultra", "Xiaomi 14"
    ],
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=700&q=80"
    ]
  },
  {
    id: "soundwave-studio-anc-headphones",
    title: "SoundWave Studio Wireless ANC Headphones",
    titleBn: "সাউন্ডওয়েভ স্টুডিও ওয়্যারলেস হেডফোন",
    category: "audio",
    badge: "Lossless Audio",
    price: 8500,
    originalPrice: 9800,
    rating: 4.9,
    reviewCount: 62,
    stock: 7,
    isDevelopmentSeed: true,
    warranty: "12-Month Official BD Warranty",
    description: "40mm custom silk diaphragm drivers with ultra-soft memory foam earcups, transparency mode, and 60-hour playtime.",
    specs: {
      "Diaphragm": "40mm Beryllium-coated dynamic drivers",
      "Playtime": "60h (ANC Off) / 45h (ANC On)",
      "Charging": "10-minute quick charge yields 5h playtime",
      "Weight": "245 grams"
    },
    variants: [
      { id: "v1", name: "Frosted Ice Blue", hex: "#CBE4FC", inStock: true },
      { id: "v2", name: "Pearl White", hex: "#F3F7FA", inStock: true }
    ],
    compatibleWith: [
      "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15",
      "Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24", "Galaxy S23 Ultra",
      "Pixel 8 Pro", "Pixel 8", "Xiaomi 14 Ultra", "Xiaomi 14"
    ],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80"
    ]
  }
];
