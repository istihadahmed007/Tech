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
  },
  {
    id: "wearables",
    name: "Smartwatches",
    nameBn: "স্মার্টওয়াচ ও ব্যান্ড",
    description: "HD AMOLED displays, multi-strap packs, health tracking & Bluetooth calling.",
    itemCount: 4,
    badge: "Bluetooth Calling",
    icon: "Watch"
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
  },
  {
    id: "y80-ultra-smartwatch",
    title: "Y80 Ultra Smartwatch (8+ Multi-Strap Edition)",
    titleBn: "ওয়াই ৮০ আল্ট্রা স্মার্টওয়াচ (৮টি মাল্টি-স্ট্র্যাপ)",
    category: "wearables",
    badge: "8-Strap Pack",
    price: 890,
    originalPrice: 1250,
    rating: 4.8,
    reviewCount: 84,
    stock: 45,
    isDevelopmentSeed: true,
    warranty: "7-Day Replacement Warranty",
    description: "2.02-inch HD edge-to-edge display smartwatch with 8 interchangeable silicone and ocean straps, wireless magnetic charging, and Bluetooth calling.",
    specs: {
      "Display": "2.02-inch HD IPS Screen",
      "Included Straps": "8 Interchangeable (Ocean, Silicone, Alpine)",
      "Calling": "Bluetooth Hands-Free Calling",
      "Battery": "Up to 5 Days Standby",
      "Charging": "Magnetic Wireless Charging Dock"
    },
    variants: [
      { id: "v1", name: "Titanium Silver Case + 8 Straps", hex: "#D6DEE6", inStock: true },
      { id: "v2", name: "Matte Black Case + 8 Straps", hex: "#1C1D1F", inStock: true }
    ],
    compatibleWith: [
      "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro Max",
      "Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24", "Pixel 8 Pro", "Xiaomi 14 Ultra"
    ],
    image: "/assets/products/y80-ultra-smartwatch.jpg",
    gallery: [
      "/assets/products/y80-ultra-smartwatch.jpg"
    ]
  },
  {
    id: "h2-anc-pro-tws",
    title: "Pro 2 ANC True Wireless Earbuds",
    titleBn: "প্রো ২ এএনসি ট্রু ওয়্যারলেস এয়ারবাডস",
    category: "audio",
    badge: "Active ANC",
    price: 1190,
    originalPrice: 1550,
    rating: 4.8,
    reviewCount: 112,
    stock: 38,
    isDevelopmentSeed: true,
    warranty: "7-Day Replacement Warranty",
    description: "Compact high-grade white wireless earbuds with active noise reduction, transparency mode, wireless charging case, and auto-pairing.",
    specs: {
      "Audio": "High-Fidelity Dynamic Bass Driver",
      "Noise Control": "Active Noise Reduction & Transparency",
      "Battery": "Up to 24h Playtime with Case",
      "Charging": "Lightning & MagSafe Wireless Support"
    },
    variants: [
      { id: "v1", name: "Arctic White", hex: "#FFFFFF", inStock: true }
    ],
    compatibleWith: [
      "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro Max",
      "Galaxy S24 Ultra", "Pixel 8 Pro", "Xiaomi 14 Ultra"
    ],
    image: "/assets/products/h2-anc-pro-tws.jpg",
    gallery: [
      "/assets/products/h2-anc-pro-tws.jpg"
    ]
  },
  {
    id: "recrsi-4in1-65w-cable",
    title: "RECRSI 65W 4-in-1 Universal Fast Cable",
    titleBn: "রেকর্সি ৬৫ওয়াট ৪-ইন-১ ফাস্ট চার্জিং ক্যাবল",
    category: "charging",
    badge: "65W 4-in-1",
    price: 420,
    originalPrice: 480,
    rating: 4.9,
    reviewCount: 76,
    stock: 60,
    isDevelopmentSeed: true,
    warranty: "6-Month Replacement Warranty",
    description: "Universal 4-in-1 dual-head braided cable supporting USB-C to USB-C (65W) and Lightning PD (27W) for all modern smartphones and laptops.",
    specs: {
      "Max Output": "65W USB-C PD / 27W Lightning PD",
      "Connectors": "USB-A & USB-C Input to Type-C & Lightning Output",
      "Length": "1.2 Meters Braided",
      "Durability": "Reinforced Zinc Alloy Connectors"
    },
    variants: [
      { id: "v1", name: "Glacial Blue & Black Weave", hex: "#8EB8D8", inStock: true }
    ],
    compatibleWith: [
      "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro Max",
      "Galaxy S24 Ultra", "Galaxy S24+", "Pixel 8 Pro", "Xiaomi 14 Ultra"
    ],
    image: "/assets/products/recrsi-4in1-65w-cable.jpg",
    gallery: [
      "/assets/products/recrsi-4in1-65w-cable.jpg"
    ]
  },
  {
    id: "oraimo-or08-wireless-headset",
    title: "Oraimo OR-08 Wireless Over-Ear Headset",
    titleBn: "ওরাইমো ওআর-০৮ ওয়্যারলেস ওভার-ইয়ার হেডসেট",
    category: "audio",
    badge: "Born for Music",
    price: 990,
    originalPrice: 1250,
    rating: 4.7,
    reviewCount: 53,
    stock: 24,
    isDevelopmentSeed: true,
    warranty: "7-Day Replacement Warranty",
    description: "Padded over-ear Bluetooth headset with rich bass response, adjustable ergonomic headband, tactile controls, and TF card slot.",
    specs: {
      "Drivers": "40mm Deep Bass Neodymium",
      "Battery": "Up to 15 Hours Playback",
      "Connectivity": "Bluetooth 5.1 & 3.5mm AUX Cable Support",
      "Design": "Foldable Soft Protein Leather Ear Cups"
    },
    variants: [
      { id: "v1", name: "Midnight Black & Silver", hex: "#22252A", inStock: true }
    ],
    compatibleWith: [
      "iPhone 15 Pro Max", "Galaxy S24 Ultra", "Pixel 8 Pro", "Xiaomi 14 Ultra"
    ],
    image: "/assets/products/oraimo-or08-headset.jpg",
    gallery: [
      "/assets/products/oraimo-or08-headset.jpg"
    ]
  },
  {
    id: "sm-neckband-007",
    title: "SM 007 Ultra-Long Battery Bluetooth Neckband",
    titleBn: "এসএম ০০৭ আল্ট্রা-লং ব্যাটারি ব্লুটুথ নেকব্যান্ড",
    category: "audio",
    badge: "120H Standby",
    price: 450,
    originalPrice: 600,
    rating: 4.6,
    reviewCount: 91,
    stock: 55,
    isDevelopmentSeed: true,
    warranty: "7-Day Replacement Warranty",
    description: "Lightweight silicone wireless neckband earphones with magnetic earbud tips, crisp calling mic, and extended battery endurance.",
    specs: {
      "Battery": "Extended High-Capacity Li-ion Battery",
      "Earbuds": "Magnetic Anti-Tangle Lock",
      "Microphone": "In-line Clear Voice Mic",
      "Charging": "Fast USB-C Charging Port"
    },
    variants: [
      { id: "v1", name: "Stealth Matte Black", hex: "#1A1A1A", inStock: true }
    ],
    compatibleWith: [
      "iPhone 15 Pro Max", "Galaxy S24 Ultra", "Pixel 8 Pro", "Xiaomi 14 Ultra"
    ],
    image: "/assets/products/sm-neckband-007.jpg",
    gallery: [
      "/assets/products/sm-neckband-007.jpg"
    ]
  },
  {
    id: "remax-rc155a-120w-cable",
    title: "REMAX RC-155a 120W Fast Charging Cable",
    titleBn: "রিম্যাক্স আরসি-১৫৫এ ১২০ওয়াট ফাস্ট ক্যাবল",
    category: "charging",
    badge: "120W Fast",
    price: 190,
    originalPrice: 250,
    rating: 4.8,
    reviewCount: 138,
    stock: 80,
    isDevelopmentSeed: true,
    warranty: "1-Month Replacement Warranty",
    description: "Durable 1-meter high-current braided USB cable designed for rapid phone charging and swift data synchronization.",
    specs: {
      "Power": "Up to 120W Max Flash Charging",
      "Length": "1.0 Meter (3.3ft)",
      "Material": "High-Density Braided Nylon",
      "Compatibility": "Type-C / Lightning / Micro-USB"
    },
    variants: [
      { id: "v1", name: "Type-C to Type-C (Black)", hex: "#222222", inStock: true },
      { id: "v2", name: "USB-A to Type-C (Blue)", hex: "#2E5B88", inStock: true }
    ],
    compatibleWith: [
      "iPhone 15 Pro Max", "Galaxy S24 Ultra", "Pixel 8 Pro", "Xiaomi 14 Ultra"
    ],
    image: "/assets/products/recrsi-4in1-65w-cable.jpg",
    gallery: [
      "/assets/products/recrsi-4in1-65w-cable.jpg"
    ]
  },
  {
    id: "remax-rc155a-duo-bundle",
    title: "REMAX RC-155a 120W Cable (2-Pack Value Deal)",
    titleBn: "রিম্যাক্স ১২০ওয়াট ক্যাবল ২-প্যাক স্পেশাল ডিল",
    category: "charging",
    badge: "Save ৳30",
    price: 350,
    originalPrice: 500,
    rating: 4.9,
    reviewCount: 64,
    stock: 40,
    isDevelopmentSeed: true,
    warranty: "1-Month Replacement Warranty",
    description: "Twin pack of REMAX RC-155a 120W braided cables for home and office convenience at an unbeatable bundle price.",
    specs: {
      "Pack Count": "2 Full Cables Included",
      "Rated Speed": "120W Fast Charge",
      "Length": "1.0m Each"
    },
    variants: [
      { id: "v1", name: "Dual Pack (2 Cables)", hex: "#1F2327", inStock: true }
    ],
    compatibleWith: [
      "iPhone 15 Pro Max", "Galaxy S24 Ultra", "Pixel 8 Pro", "Xiaomi 14 Ultra"
    ],
    image: "/assets/products/recrsi-4in1-65w-cable.jpg",
    gallery: [
      "/assets/products/recrsi-4in1-65w-cable.jpg"
    ]
  },
  {
    id: "pink-glam-smartwatch",
    title: "FitStyle Smartwatch (Rose Pink Edition)",
    titleBn: "ফিটস্টাইল স্মার্টওয়াচ (রোজ পিংক এডিশন)",
    category: "wearables",
    badge: "Popular Gift",
    price: 790,
    originalPrice: 1100,
    rating: 4.7,
    reviewCount: 42,
    stock: 25,
    isDevelopmentSeed: true,
    warranty: "7-Day Replacement Warranty",
    description: "Elegant rose pink smartwatch with soft liquid silicone strap, health activity tracker, call notifications, and HD touchscreen.",
    specs: {
      "Display": "1.85-inch Color Touchscreen",
      "Strap": "Comfort Liquid Silicone (Pink)",
      "Sensors": "Heart Rate & Step Tracker",
      "Battery": "3-4 Days Active Use"
    },
    variants: [
      { id: "v1", name: "Blush Pink Silicone", hex: "#E8A3B8", inStock: true }
    ],
    compatibleWith: [
      "iPhone 15 Pro Max", "Galaxy S24 Ultra", "Pixel 8 Pro", "Xiaomi 14 Ultra"
    ],
    image: "/assets/products/y80-ultra-smartwatch.jpg",
    gallery: [
      "/assets/products/y80-ultra-smartwatch.jpg"
    ]
  },
  {
    id: "fighter-superbass-headset",
    title: "Fighter Super-Bass Over-Ear Headset",
    titleBn: "ফাইটার সুপার-বাস ওভার-ইয়ার হেডসেট",
    category: "audio",
    badge: "Deep Bass",
    price: 550,
    originalPrice: 800,
    rating: 4.6,
    reviewCount: 37,
    stock: 30,
    isDevelopmentSeed: true,
    warranty: "7-Day Replacement Warranty",
    description: "Padded over-ear stereo headphones with reinforced bass chambers, flexible headband, and universal 3.5mm audio jack.",
    specs: {
      "Acoustics": "Super-Bass Tuned Diaphragm",
      "Connector": "Gold-plated 3.5mm Audio Pin",
      "Cord": "Tangle-resistant 1.2m Cable"
    },
    variants: [
      { id: "v1", name: "Obsidian Black", hex: "#1A1A1A", inStock: true }
    ],
    compatibleWith: [
      "Galaxy S24 Ultra", "Xiaomi 14 Ultra", "Pixel 8 Pro", "iPhone 15 Pro Max"
    ],
    image: "/assets/products/oraimo-or08-headset.jpg",
    gallery: [
      "/assets/products/oraimo-or08-headset.jpg"
    ]
  },
  {
    id: "q8-usb-callcenter-headset",
    title: "Q8 USB PC Headset with Clear-Voice Mic",
    titleBn: "কিউ৮ ইউএসবি হেডসেট উইথ ক্লিয়ার-ভয়েস মাইক",
    category: "audio",
    badge: "Work & Gaming",
    price: 850,
    originalPrice: 1200,
    rating: 4.7,
    reviewCount: 49,
    stock: 22,
    isDevelopmentSeed: true,
    warranty: "7-Day Replacement Warranty",
    description: "Professional 40mm USB headset with flexible noise-filtering boom microphone, inline volume controls, and soft ear cushions for office calls and gaming.",
    specs: {
      "Driver": "40mm Clarity Drivers",
      "Microphone": "Adjustable Noise-Cancelling Boom Mic",
      "Interface": "USB-A Plug & Play",
      "Cable": "2.0m Heavy-Duty Cord"
    },
    variants: [
      { id: "v1", name: "Pro Black", hex: "#16181B", inStock: true }
    ],
    compatibleWith: [
      "Galaxy S24 Ultra", "Xiaomi 14 Ultra", "Pixel 8 Pro"
    ],
    image: "/assets/products/oraimo-or08-headset.jpg",
    gallery: [
      "/assets/products/oraimo-or08-headset.jpg"
    ]
  },
  {
    id: "luminous-sa-rgb-headphones",
    title: "Luminous SA-D02 Breathing LED Wireless Headphones",
    titleBn: "লুমিনাস এসএ-ডি০২ এলইডি লাইট ওয়্যারলেস হেডফোন",
    category: "audio",
    badge: "RGB Light",
    price: 790,
    originalPrice: 1100,
    rating: 4.7,
    reviewCount: 31,
    stock: 20,
    isDevelopmentSeed: true,
    warranty: "7-Day Replacement Warranty",
    description: "Stylish over-ear wireless headphones with decorative breathing LED light rings, TF card reader, FM tuner, and built-in handsfree mic.",
    specs: {
      "Lighting": "Multi-Color Breathing LED Rings",
      "Playback": "Bluetooth 5.0, MicroSD Card, AUX",
      "Battery": "Up to 8h Continuous Playtime"
    },
    variants: [
      { id: "v1", name: "Cyber Black & Orange", hex: "#F26522", inStock: true }
    ],
    compatibleWith: [
      "iPhone 15 Pro Max", "Galaxy S24 Ultra", "Pixel 8 Pro", "Xiaomi 14 Ultra"
    ],
    image: "/assets/products/oraimo-or08-headset.jpg",
    gallery: [
      "/assets/products/oraimo-or08-headset.jpg"
    ]
  },
  {
    id: "turbo-single-wall-charger",
    title: "TurboCharge 20W USB Quick Wall Adapter",
    titleBn: "টার্বোচার্জ ২০ওয়াট ইউএসবি কুইক চার্জার",
    category: "charging",
    badge: "20W Quick",
    price: 250,
    originalPrice: 350,
    rating: 4.8,
    reviewCount: 88,
    stock: 75,
    isDevelopmentSeed: true,
    warranty: "1-Month Replacement Warranty",
    description: "Compact two-pin wall power adapter with surge protection, intelligent current regulation, and fast device charging.",
    specs: {
      "Output": "20W Max Quick Charge",
      "Pin Type": "Standard Bangladesh 2-Pin Round Plug",
      "Safety": "Over-voltage and short-circuit protection"
    },
    variants: [
      { id: "v1", name: "Glossy Arctic White", hex: "#FFFFFF", inStock: true }
    ],
    compatibleWith: [
      "iPhone 15 Pro Max", "Galaxy S24 Ultra", "Pixel 8 Pro", "Xiaomi 14 Ultra"
    ],
    image: "/assets/cat-charging.jpg",
    gallery: [
      "/assets/cat-charging.jpg"
    ]
  },
  {
    id: "in-ear-bass-wired-earphones",
    title: "Precision Bass In-Ear Wired Earphones with Mic",
    titleBn: "প্রিসিশন বাস ইন-ইয়ার তারযুক্ত ইয়ারফোন",
    category: "audio",
    badge: "Everyday Pick",
    price: 160,
    originalPrice: 220,
    rating: 4.5,
    reviewCount: 65,
    stock: 90,
    isDevelopmentSeed: true,
    warranty: "7-Day Replacement Warranty",
    description: "Clear vocal in-ear earphones with comfortable silicone ear tips, tangle-resistant flat cable, and handsfree calling button.",
    specs: {
      "Connector": "3.5mm Stereo Audio Jack",
      "Driver": "10mm High-Sensitivity Bass Diaphragm",
      "Cable Length": "1.2 Meters"
    },
    variants: [
      { id: "v1", name: "Glacial White", hex: "#FFFFFF", inStock: true },
      { id: "v2", name: "Pitch Black", hex: "#111111", inStock: true }
    ],
    compatibleWith: [
      "Galaxy S24 Ultra", "Xiaomi 14 Ultra", "Pixel 8 Pro", "iPhone 15 Pro Max"
    ],
    image: "/assets/products/sm-neckband-007.jpg",
    gallery: [
      "/assets/products/sm-neckband-007.jpg"
    ]
  }
];

export const FEATURED_BUNDLES = [
  {
    id: "bundle-everyday-power-audio",
    title: "The Everyday Power & Audio Combo",
    titleBn: "পাওয়ার ও অডিও অল-ইন-ওয়ান বান্ডিল",
    subtitle: "Y80 Ultra Smartwatch (8 Straps) + Pro 2 ANC Wireless Earbuds",
    subtitleBn: "ওয়াই ৮০ আল্ট্রা স্মার্টওয়াচ (৮টি স্ট্র্যাপ) + প্রো ২ এএনসি এয়ারবাডস",
    badge: "Free Delivery Unlocked",
    badgeBn: "ফ্রি ডেলিভারি আনলকড",
    price: 2080,
    originalPrice: 2800,
    savings: 720,
    freeDelivery: true,
    image: "/assets/products/y80-ultra-smartwatch.jpg",
    itemIds: ["y80-ultra-smartwatch", "h2-anc-pro-tws"],
    itemsSummary: "Y80 Ultra Smartwatch (৳890) + Pro 2 ANC Earbuds (৳1,190) = ৳2,080"
  },
  {
    id: "bundle-commuter-complete",
    title: "The Commuter Complete Tech Pack",
    titleBn: "কমিউটার কমপ্লিট টেক প্যাক",
    subtitle: "Oraimo Wireless Headset + RECRSI 4-in-1 Cable + 20W Charger + REMAX Cable + Bass Earphones",
    subtitleBn: "ওরাইমো হেডসেট + রেকর্সি ৪-ইন-১ ক্যাবল + ২০ওয়াট চার্জার + রিম্যাক্স ক্যাবল + ইয়ারফোন",
    badge: "5-in-1 Setup",
    badgeBn: "৫-ইন-১ সেটআপ",
    price: 2050,
    originalPrice: 2610,
    savings: 560,
    freeDelivery: true,
    image: "/assets/products/recrsi-4in1-65w-cable.jpg",
    itemIds: [
      "oraimo-or08-wireless-headset", 
      "recrsi-4in1-65w-cable", 
      "turbo-single-wall-charger", 
      "remax-rc155a-120w-cable", 
      "in-ear-bass-wired-earphones"
    ],
    itemsSummary: "Oraimo Headset (৳990) + 4-in-1 Cable (৳420) + 20W Adapter (৳250) + REMAX Cable (৳190) + In-Ear Earphones (৳160) = ৳2,050"
  },
  {
    id: "bundle-his-and-hers-wearables",
    title: "His & Hers Smartwatch Pack",
    titleBn: "হিজ অ্যান্ড হার্স স্মার্টওয়াচ প্যাক",
    subtitle: "Y80 Ultra Smartwatch + FitStyle Rose Pink Watch + REMAX 2-Pack Cables",
    subtitleBn: "ওয়াই ৮০ আল্ট্রা স্মার্টওয়াচ + ফিটস্টাইল রোজ পিংক ওয়াচ + রিম্যাক্স ২-প্যাক ক্যাবল",
    badge: "Couples Special",
    badgeBn: "কাপল স্পেশাল",
    price: 2030,
    originalPrice: 2600,
    savings: 570,
    freeDelivery: true,
    image: "/assets/products/y80-ultra-smartwatch.jpg",
    itemIds: ["y80-ultra-smartwatch", "pink-glam-smartwatch", "remax-rc155a-duo-bundle"],
    itemsSummary: "Y80 Ultra (৳890) + Pink Watch (৳790) + 2x REMAX Cables (৳350) = ৳2,030"
  }
];

