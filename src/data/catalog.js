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
        "id": "h2-anc-pro-tws",
        "photoRef": "P01",
        "title": "Pro-Style White Wireless Earbuds",
        "titleBn": "প্রো-স্টাইল সাদা ওয়্যারলেস ইয়ারবাড",
        "category": "audio",
        "badge": "Comparable Copy",
        "price": 1190,
        "originalPrice": 1550,
        "retailRange": {
            "low": 650,
            "high": 1200
        },
        "rating": 4.8,
        "reviewCount": 112,
        "stock": 38,
        "isDevelopmentSeed": true,
        "warranty": "7-Day Replacement Warranty",
        "description": "White in-ear wireless earbuds with a compact stem design for everyday listening. The exact model, charging case and supported features need confirmation from an opened unit.",
        "descriptionBn": "দৈনন্দিন গান শোনা ও ভিডিও দেখার জন্য সাদা রঙের ইন-ইয়ার ওয়্যারলেস ইয়ারবাড। কেনার আগে আসল মডেল, চার্জিং কেস ও কার্যকর ফিচারগুলো নিশ্চিত করুন।",
        "verificationNotes": "Apple-style packaging does not establish authenticity. H2 and ANC are sticker claims. This price is for comparable copy products, not genuine Apple AirPods.",
        "verificationNotesBn": "অ্যাপল-স্টাইল প্যাকেজিং আসল পণ্য প্রমাণ করে না। H2 এবং ANC স্টিকারের দাবি। এই মূল্য আসল এয়ারপডসের নয়, তুলনামূলক কপি পণ্যের জন্য প্রযোজ্য।",
        "specs": {
            "Design": "In-ear compact stem format",
            "Retail Reference": "BDT 650–1,200",
            "Sticker Claims": "H2 / 100% ANC (Unverified)",
            "Charging": "Wireless & Lightning compatible case",
            "Warranty": "7-Day Replacement Warranty"
        },
        "variants": [
            {
                "id": "v1",
                "name": "Arctic White",
                "hex": "#FFFFFF",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "iPhone 15 Pro Max",
            "iPhone 15 Pro",
            "iPhone 15",
            "iPhone 14 Pro Max",
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra"
        ],
        "image": "/assets/products/p01-pro-tws-white.jpg",
        "gallery": [
            "/assets/products/p01-pro-tws-white.jpg",
            "/assets/products/h2-anc-pro-tws.jpg"
        ]
    },
  {
        "id": "remax-rc155a-120w-cable",
        "photoRef": "P02 / P21",
        "title": "REMAX-Labelled RC-155a Fast Charging Cable",
        "titleBn": "রিম্যাক্স-লেবেলযুক্ত আরসি-১৫৫এ চার্জিং ক্যাবল",
        "category": "charging",
        "badge": "120W Label",
        "price": 150,
        "originalPrice": 220,
        "retailRange": {
            "low": 130,
            "high": 130
        },
        "rating": 4.8,
        "reviewCount": 138,
        "stock": 80,
        "isDevelopmentSeed": true,
        "warranty": "1-Month Replacement Warranty",
        "description": "A one-metre charging and data cable shown with gold-coloured connectors and a USB-A to Type-C layout. Select the actual connector version supplied with your order.",
        "descriptionBn": "সোনালি রঙের কানেক্টরসহ এক মিটার চার্জিং ও ডেটা কেবল। ছবিতে USB-A থেকে Type-C সংস্করণ দেখানো আছে; অর্ডারের আগে প্রয়োজনীয় কানেক্টর মিলিয়ে নিন।",
        "verificationNotes": "120W and original REMAX status are unverified. The seller listing conflicts on connector type, so confirm the actual cable. P21 shows the same printed RC-155a model.",
        "verificationNotesBn": "১২০ওয়াট এবং আসল রিম্যাক্স স্বীকৃতি অপ্রমাণিত। অর্ডারের আগে সঠিক কানেক্টর যাচাই করুন।",
        "specs": {
            "Length": "1.0 Meter (1000mm)",
            "Material": "TPE & Braided Wire",
            "Connector": "Gold-plated USB-A to Type-C",
            "Package Claim": "120W Max (Unverified)"
        },
        "variants": [
            {
                "id": "v1",
                "name": "USB-A to Type-C (Gold/Black)",
                "hex": "#2B2D42",
                "inStock": true
            },
            {
                "id": "v2",
                "name": "Type-C to Type-C",
                "hex": "#1E3A8A",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "iPhone 15 Pro Max",
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra"
        ],
        "image": "/assets/products/p02-remax-rc155a-cable.jpg",
        "gallery": [
            "/assets/products/p02-remax-rc155a-cable.jpg"
        ]
    },
  {
        "id": "remax-rc155a-duo-bundle",
        "photoRef": "P02-Duo",
        "title": "REMAX RC-155a 120W Cable (2-Pack Value Deal)",
        "titleBn": "রিম্যাক্স ১২০ওয়াট ক্যাবল ২-প্যাক স্পেশাল ডিল",
        "category": "charging",
        "badge": "Save ৳50",
        "price": 280,
        "originalPrice": 400,
        "retailRange": {
            "low": 260,
            "high": 300
        },
        "rating": 4.9,
        "reviewCount": 64,
        "stock": 40,
        "isDevelopmentSeed": true,
        "warranty": "1-Month Replacement Warranty",
        "description": "Twin pack of REMAX RC-155a braided fast-charging cables for home and office convenience at an unbeatable bundle price.",
        "descriptionBn": "বাসা ও অফিসের জন্য রিম্যাক্স আরসি-১৫৫এ ক্যাবলের ২-প্যাক বিশেষ সাশ্রয়ী ডিল।",
        "verificationNotes": "Twin pack of verified inventory units with 1-month replacement warranty.",
        "verificationNotesBn": "১ মাসের রিপ্লেসমেন্ট ওয়ারেন্টিসহ টুইন প্যাক ডিল।",
        "specs": {
            "Pack Count": "2 Full Cables Included",
            "Length": "1.0 Meter Each",
            "Connectors": "Gold-plated USB-A to Type-C"
        },
        "variants": [
            {
                "id": "v1",
                "name": "Dual Pack (2 Cables)",
                "hex": "#1F2327",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "iPhone 15 Pro Max",
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra"
        ],
        "image": "/assets/products/p02-remax-rc155a-cable.jpg",
        "gallery": [
            "/assets/products/p02-remax-rc155a-cable.jpg"
        ]
    },
  {
        "id": "sm-neckband-007",
        "photoRef": "P03",
        "title": "SM 007 Wireless Neckband Earphone",
        "titleBn": "এসএম ০০৭ ওয়্যারলেস নেকব্যান্ড ইয়ারফোন",
        "category": "audio",
        "badge": "120H Label",
        "price": 450,
        "originalPrice": 600,
        "retailRange": {
            "low": 300,
            "high": 600
        },
        "rating": 4.6,
        "reviewCount": 91,
        "stock": 55,
        "isDevelopmentSeed": true,
        "warranty": "7-Day Replacement Warranty",
        "description": "A black neckband-style wireless earphone with in-ear tips and controls positioned along the neckband. A practical format for keeping both earpieces together between listening sessions.",
        "descriptionBn": "কালো রঙের নেকব্যান্ড ইয়ারফোন, সঙ্গে ইন-ইয়ার টিপস ও নেকব্যান্ডের পাশে কন্ট্রোল। ব্যবহার শেষে দুই ইয়ারপিস একসঙ্গে গলায় রাখার সুবিধাজনক ডিজাইন।",
        "verificationNotes": "No exact Bangladesh SM 007 listing found. Estimate uses other budget neckbands. The printed 120-hour claim has not been tested.",
        "verificationNotesBn": "বাজেট নেকব্যান্ড ক্যাটাগরি। প্যাকেজে মুদ্রিত ১২০ ঘণ্টার ব্যাটারি দাবি পরীক্ষিত নয়। ৭ দিনের রিপ্লেসমেন্ট ওয়ারেন্টি।",
        "specs": {
            "Format": "Silicone flexible neckband",
            "Earbuds": "Magnetic in-ear lock",
            "Controls": "Inline volume & playback",
            "Battery Claim": "120h Music Time on box (Untested)"
        },
        "variants": [
            {
                "id": "v1",
                "name": "Stealth Matte Black",
                "hex": "#1A1A1A",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "iPhone 15 Pro Max",
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra"
        ],
        "image": "/assets/products/p03-sm007-neckband.jpg",
        "gallery": [
            "/assets/products/p03-sm007-neckband.jpg",
            "/assets/products/sm-neckband-007.jpg"
        ]
    },
  {
        "id": "p04-ultrapods-pro-tws",
        "photoRef": "P04",
        "title": "Ultrapods Pro Transparent TWS Earbuds",
        "titleBn": "আল্ট্রাপডস প্রো স্বচ্ছ ডিজাইনের ওয়্যারলেস ইয়ারবাড",
        "category": "audio",
        "badge": "LED Display",
        "price": 350,
        "originalPrice": 490,
        "retailRange": {
            "low": 235,
            "high": 439
        },
        "rating": 4.7,
        "reviewCount": 78,
        "stock": 60,
        "isDevelopmentSeed": true,
        "warranty": "7-Day Replacement Warranty",
        "description": "Colourful wireless earbuds presented with a transparent-style charging case and a visible battery display. Choose the colour you prefer and check the included charging accessories before purchase.",
        "descriptionBn": "স্বচ্ছ ডিজাইনের চার্জিং কেস ও ব্যাটারি ডিসপ্লেসহ রঙিন ওয়্যারলেস ইয়ারবাড। পছন্দের রং বেছে নিন এবং প্যাকেটে চার্জিংয়ের কী কী আনুষঙ্গিক আছে তা নিশ্চিত করুন।",
        "verificationNotes": "Colours are variants, not separate models. Bluetooth 5.3, waterproofing and Hi-Res marks are packaging claims unless tested.",
        "verificationNotesBn": "রংগুলো একই মডেলের ভ্যারিয়েন্ট। ব্লুটুথ ৫.৩ ও ওয়াটারপ্রুফ প্যাকেজিংয়ের দাবি। স্বচ্ছ কেস ও এলইডি ব্যাটারি ডিসপ্লে যুক্ত।",
        "specs": {
            "Case": "Crystal transparent casing with digital battery %",
            "Bluetooth": "5.3 Wireless",
            "Finishes": "Blue, Lime Green, Obsidian Black, Pastel Pink"
        },
        "variants": [
            {
                "id": "v1",
                "name": "Crystal Blue",
                "hex": "#7AB8E8",
                "inStock": true
            },
            {
                "id": "v2",
                "name": "Neon Lime Green",
                "hex": "#84CC16",
                "inStock": true
            },
            {
                "id": "v3",
                "name": "Obsidian Black",
                "hex": "#1F2937",
                "inStock": true
            },
            {
                "id": "v4",
                "name": "Pastel Pink",
                "hex": "#F472B6",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "iPhone 15 Pro Max",
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra"
        ],
        "image": "/assets/products/p04-ultrapods-pro-all.jpg",
        "gallery": [
            "/assets/products/p04-ultrapods-pro-all.jpg",
            "/assets/products/p04-ultrapods-pro-blue.jpg",
            "/assets/products/p04-ultrapods-pro-green.jpg",
            "/assets/products/p04-ultrapods-pro-pink.jpg",
            "/assets/products/p04-ultrapods-pro-black.jpg"
        ]
    },
  {
        "id": "p05-vdenmenv-dr06-earphones",
        "photoRef": "P05",
        "title": "VDENMENV DR06 In-Ear 3.5mm Earphones with Mic",
        "titleBn": "ভিডেনমেনভ ডিআর০৬ ইন-ইয়ার তারযুক্ত ইয়ারফোন",
        "category": "audio",
        "badge": "Everyday Audio",
        "price": 170,
        "originalPrice": 250,
        "retailRange": {
            "low": 102,
            "high": 299
        },
        "rating": 4.6,
        "reviewCount": 42,
        "stock": 70,
        "isDevelopmentSeed": true,
        "warranty": "7-Day Replacement Warranty",
        "description": "A simple wired earphone for compatible 3.5mm devices, available in white and black. The DR06 listing identifies an inline microphone and control for everyday audio and calls.",
        "descriptionBn": "৩.৫ মিমি অডিও পোর্টযুক্ত ডিভাইসের জন্য সাদা ও কালো রঙের তারযুক্ত ইয়ারফোন। DR06 মডেলের তালিকায় গান শোনা ও কলের জন্য ইনলাইন মাইক ও কন্ট্রোল উল্লেখ আছে।",
        "verificationNotes": "Confirm jack and remote operation on the actual batch. Same DR06 appears in P23. Price differences include seller/channel variation.",
        "verificationNotesBn": "৩.৫ মিমি পোর্টের সাথে সামঞ্জস্যপূর্ণ। ইনলাইন মাইক ও রিমোট কন্ট্রোলযুক্ত।",
        "specs": {
            "Interface": "Standard 3.5mm Stereo Audio Jack",
            "Microphone": "In-line clear voice microphone",
            "Housing": "Comfort ergonomic round tips",
            "Length": "1.2m Durable Cable"
        },
        "variants": [
            {
                "id": "v1",
                "name": "Classic White",
                "hex": "#FFFFFF",
                "inStock": true
            },
            {
                "id": "v2",
                "name": "Matte Black",
                "hex": "#111111",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra"
        ],
        "image": "/assets/products/p05-vdenmenv-dr06-earphones.jpg",
        "gallery": [
            "/assets/products/p05-vdenmenv-dr06-earphones.jpg"
        ]
    },
  {
        "id": "p06-samsung-pro-tws",
        "photoRef": "P06-Samsung",
        "title": "Pro-Style TWS Earbuds (Samsung-Labelled)",
        "titleBn": "প্রো-স্টাইল ওয়্যারলেস ইয়ারবাড (স্যামসাং-লেবেলযুক্ত)",
        "category": "audio",
        "badge": "Comparable Label",
        "price": 590,
        "originalPrice": 750,
        "retailRange": {
            "low": 585,
            "high": 597
        },
        "rating": 4.6,
        "reviewCount": 35,
        "stock": 25,
        "isDevelopmentSeed": true,
        "warranty": "7-Day Replacement Warranty",
        "description": "White stem-style wireless earbuds in Samsung-labelled packaging. Confirm the actual model and pairing functions before sale.",
        "descriptionBn": "Samsung লেবেলের বক্সে সাদা স্টেম ডিজাইনের ইয়ারবাড। বিক্রির আগে প্রকৃত মডেল ও পেয়ারিং ফিচার নিশ্চিত করুন।",
        "verificationNotes": "Comparable labels; authenticity unverified. Priced as comparable copy product.",
        "verificationNotesBn": "তুলনামূলক লেবেলযুক্ত কপি পণ্য। আসল স্যামসাং পণ্য হিসেবে দাবি করা হয়নি।",
        "specs": {
            "Form": "Stem in-ear buds with charging case",
            "Connectivity": "Bluetooth Wireless",
            "Color": "Glossy White"
        },
        "variants": [
            {
                "id": "v1",
                "name": "White",
                "hex": "#FFFFFF",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra",
            "iPhone 15 Pro Max"
        ],
        "image": "/assets/products/p06-samsung-tws.jpg",
        "gallery": [
            "/assets/products/p06-samsung-tws.jpg",
            "/assets/products/p06-assorted-tws-set.jpg"
        ]
    },
  {
        "id": "p06-realme-pro-tws",
        "photoRef": "P06-realme",
        "title": "Pro-Style TWS Earbuds (realme-Labelled)",
        "titleBn": "প্রো-স্টাইল ওয়্যারলেস ইয়ারবাড (রিয়েলমি-লেবেলযুক্ত)",
        "category": "audio",
        "badge": "Budget Pick",
        "price": 320,
        "originalPrice": 450,
        "retailRange": {
            "low": 280,
            "high": 280
        },
        "rating": 4.5,
        "reviewCount": 29,
        "stock": 30,
        "isDevelopmentSeed": true,
        "warranty": "7-Day Replacement Warranty",
        "description": "White Pro-style wireless earbuds in a yellow-and-white box. Confirm the charging case, connector and actual brand identity.",
        "descriptionBn": "হলুদ-সাদা বক্সে সাদা Pro-style ইয়ারবাড। চার্জিং কেস, কানেক্টর ও প্রকৃত ব্র্যান্ড পরিচয় নিশ্চিত করুন।",
        "verificationNotes": "Comparable label; authenticity unverified. Budget clone product.",
        "verificationNotesBn": "বাজেট ক্লোন সংস্করণ। ৭ দিনের ওয়ারেন্টি।",
        "specs": {
            "Form": "Compact stem earbuds",
            "Case": "Portable pocket charging dock"
        },
        "variants": [
            {
                "id": "v1",
                "name": "White",
                "hex": "#FFFFFF",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra",
            "iPhone 15 Pro Max"
        ],
        "image": "/assets/products/p06-realme-tws.jpg",
        "gallery": [
            "/assets/products/p06-realme-tws.jpg"
        ]
    },
  {
        "id": "p06-oneplus-pro-tws",
        "photoRef": "P06-OnePlus",
        "title": "Pro-Style TWS Earbuds (OnePlus-Labelled)",
        "titleBn": "প্রো-স্টাইল ওয়্যারলেস ইয়ারবাড (ওয়ানপ্লাস-লেবেলযুক্ত)",
        "category": "audio",
        "badge": "Comparable Copy",
        "price": 650,
        "originalPrice": 850,
        "retailRange": {
            "low": 520,
            "high": 750
        },
        "rating": 4.7,
        "reviewCount": 31,
        "stock": 20,
        "isDevelopmentSeed": true,
        "warranty": "7-Day Replacement Warranty",
        "description": "Stem-style wireless earbuds with a portable charging case shown on the box. Check the actual model and supplied accessories.",
        "descriptionBn": "বক্সে বহনযোগ্য চার্জিং কেসসহ স্টেম ডিজাইনের ইয়ারবাড দেখানো আছে। প্রকৃত মডেল ও সঙ্গে দেওয়া অ্যাকসেসরি যাচাই করুন।",
        "verificationNotes": "Comparable copy listing. Red-box packaging with 1+ logo.",
        "verificationNotesBn": "তুলনামূলক কপি পণ্য। লাল বক্সের প্যাকেজিং।",
        "specs": {
            "Form": "Wireless earbuds with charging pod",
            "Interface": "Lightning / Type-C charging"
        },
        "variants": [
            {
                "id": "v1",
                "name": "White",
                "hex": "#FFFFFF",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra",
            "iPhone 15 Pro Max"
        ],
        "image": "/assets/products/p06-oneplus-tws.jpg",
        "gallery": [
            "/assets/products/p06-oneplus-tws.jpg"
        ]
    },
  {
        "id": "turbo-single-wall-charger",
        "photoRef": "P07",
        "title": "Compact 2-Pin Wall Charger (OPPO 27W Marked)",
        "titleBn": "২-পিন ফাস্ট ওয়াল চার্জার (অপো ২৭ওয়াট মার্কড)",
        "category": "charging",
        "badge": "2-Pin BD Plug",
        "price": 250,
        "originalPrice": 350,
        "retailRange": {
            "low": 150,
            "high": 346
        },
        "rating": 4.8,
        "reviewCount": 88,
        "stock": 75,
        "isDevelopmentSeed": true,
        "warranty": "1-Month Replacement Warranty",
        "description": "A compact white wall adapter with a two-pin plug for charging a compatible device through the correct cable. Check the output label and port type before ordering.",
        "descriptionBn": "উপযুক্ত কেবল দিয়ে ডিভাইস চার্জ করার জন্য দুই পিনের সাদা ওয়াল অ্যাডাপ্টার। কেনার আগে আউটপুট রেটিং ও পোর্টের ধরন দেখে নিন।",
        "verificationNotes": "Loose adapters have no readable electrical model label in this view. Neither 27W delivery, VOOC support nor original OPPO status is verified.",
        "verificationNotesBn": "দুই পিনের আদর্শ বাংলাদেশ প্লাগ। আউটপুট রেটিং চার্জারের সাথে মানানসই। ১ মাসের ওয়ারেন্টি।",
        "specs": {
            "Plug Type": "Standard Bangladesh 2-Pin Round Pins",
            "Housing": "Flame-retardant glossy ABS",
            "Marking": "OPPO 27W on shell (Unverified OEM)",
            "Safety": "Short-circuit & voltage surge regulation"
        },
        "variants": [
            {
                "id": "v1",
                "name": "Glossy Arctic White",
                "hex": "#FFFFFF",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "iPhone 15 Pro Max",
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra"
        ],
        "image": "/assets/products/p07-oppo-style-27w-charger.jpg",
        "gallery": [
            "/assets/products/p07-oppo-style-27w-charger.jpg",
            "/assets/cat-charging.jpg"
        ]
    },
  {
        "id": "p08-2in1-otg-adapter",
        "photoRef": "P08",
        "title": "2-in-1 Type-C & Micro-USB to USB-A OTG Adapter",
        "titleBn": "২-ইন-১ টাইপ-সি ও মাইক্রো-ইউএসবি ওটিজি অ্যাডাপ্টার",
        "category": "charging",
        "badge": "Pocket OTG",
        "price": 99,
        "originalPrice": 160,
        "retailRange": {
            "low": 70,
            "high": 200
        },
        "rating": 4.7,
        "reviewCount": 67,
        "stock": 90,
        "isDevelopmentSeed": true,
        "warranty": "7-Day Replacement Warranty",
        "description": "A pocket-sized adapter with Type-C and Micro-USB connectors for compatible OTG-enabled devices. Useful for connecting supported USB accessories once your phone's OTG support is confirmed.",
        "descriptionBn": "Type-C ও Micro-USB কানেক্টরসহ ছোট OTG অ্যাডাপ্টার। ফোনে OTG সাপোর্ট থাকলে উপযুক্ত USB অ্যাকসেসরি সংযোগে ব্যবহার করা যায়।",
        "verificationNotes": "Price is per adapter, not the whole display card. Taher Telecom packaging is visible. USB 3.0 / 5Gbps performance is not established.",
        "verificationNotesBn": "মূল্য একক অ্যাডাপ্টারের জন্য। ফোনে ওটিজি সাপোর্ট সক্রিয় থাকতে হবে। ৭ দিনের রিপ্লেসমেন্ট।",
        "specs": {
            "Input Ports": "Dual Male Connectors: USB Type-C & Micro-USB",
            "Output Port": "Standard USB-A Female Socket",
            "Use Case": "Connect pendrives, mice, keyboards to smartphones"
        },
        "variants": [
            {
                "id": "v1",
                "name": "Silver Metallic",
                "hex": "#D1D5DB",
                "inStock": true
            },
            {
                "id": "v2",
                "name": "Deep Black",
                "hex": "#111827",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra",
            "iPhone 15 Pro Max"
        ],
        "image": "/assets/products/p08-2in1-otg-adapter.jpg",
        "gallery": [
            "/assets/products/p08-2in1-otg-adapter.jpg"
        ]
    },
  {
        "id": "fighter-superbass-headset",
        "photoRef": "P09",
        "title": "TUCCI A5 Fighter Stereo Headset with Boom Mic",
        "titleBn": "টুচি এ৫ ফাইটার স্টেরিও হেডসেট উইথ বুম মাইক",
        "category": "audio",
        "badge": "Boom Mic",
        "price": 550,
        "originalPrice": 800,
        "retailRange": {
            "low": 550,
            "high": 900
        },
        "rating": 4.6,
        "reviewCount": 37,
        "stock": 30,
        "isDevelopmentSeed": true,
        "warranty": "7-Day Replacement Warranty",
        "description": "An over-ear wired headset with padded earcups, a headband and a boom microphone. The box shows a 3.5mm connection for use with a compatible audio port.",
        "descriptionBn": "প্যাডযুক্ত ইয়ারকাপ ও বুম মাইক্রোফোনসহ ওভার-ইয়ার তারযুক্ত হেডসেট। বক্সে ৩.৫ মিমি কানেকশনের উল্লেখ আছে; ডিভাইসের অডিও পোর্টের সঙ্গে মিলিয়ে নিন।",
        "verificationNotes": "The only exact Bangladesh quote found is BDT 900, sold out and updated four years ago. Current retail price is estimated from comparable gaming/calling headsets.",
        "verificationNotesBn": "বুম মাইক্রোফোনসহ ওভার-ইয়ার তারযুক্ত হেডসেট। ৩.৫ মিমি অডিও পোর্টে কাজ করে। ৭ দিনের ওয়ারেন্টি।",
        "specs": {
            "Interface": "3.5mm Gold-Plated Audio Pin",
            "Microphone": "Adjustable flexible boom arm mic",
            "Ear Cushions": "Soft circumaural acoustic foam"
        },
        "variants": [
            {
                "id": "v1",
                "name": "Fighter Black & Red",
                "hex": "#EF4444",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra"
        ],
        "image": "/assets/products/p09-tucci-a5-fighter-headset.jpg",
        "gallery": [
            "/assets/products/p09-tucci-a5-fighter-headset.jpg",
            "/assets/products/oraimo-or08-headset.jpg"
        ]
    },
  {
        "id": "pink-glam-smartwatch",
        "photoRef": "P10",
        "title": "KW68 Mini Smartwatch (3+1 Strap Set)",
        "titleBn": "কেডব্লিউ৬৮ মিনি স্মার্টওয়াচ (৩+১ স্ট্র্যাপ সেট)",
        "category": "wearables",
        "badge": "3+1 Straps",
        "price": 790,
        "originalPrice": 1100,
        "retailRange": {
            "low": 680,
            "high": 1061
        },
        "rating": 4.7,
        "reviewCount": 42,
        "stock": 25,
        "isDevelopmentSeed": true,
        "warranty": "7-Day Replacement Warranty",
        "description": "A compact square-face smartwatch presented in a pink-themed strap set. Its smaller watch shape suits buyers who prefer a less bulky design; confirm the included straps and phone compatibility.",
        "descriptionBn": "গোলাপি থিমের স্ট্র্যাপ সেটে ছোট আকারের স্কয়ার-ফেস স্মার্টওয়াচ। হালকা ডিজাইন পছন্দ হলে দেখতে পারেন; সঙ্গে কতটি স্ট্র্যাপ আছে ও ফোনে সাপোর্ট করে কি না নিশ্চিত করুন।",
        "verificationNotes": "Faint box text appears to read KW68 Mini. Treat identification as probable. 3+1 contents and app support require checking. Do not claim medical accuracy.",
        "verificationNotesBn": "গোলাপি থিমের ৩+১ স্ট্র্যাপ সেট। লাইটওয়েট স্কয়ার ডিজাইন। কোনো মেডিকেল ডায়াগনস্টিক দাবি প্রযোজ্য নয়। ৭ দিনের ওয়ারেন্টি।",
        "specs": {
            "Display": "Touch Color Screen with floral dial theme",
            "Straps Included": "3 Interchangeable fashion straps",
            "Features": "Bluetooth notifications, step counter, calling support",
            "App": "Fere Fit companion app"
        },
        "variants": [
            {
                "id": "v1",
                "name": "Blush Pink & Gold",
                "hex": "#E8A3B8",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "iPhone 15 Pro Max",
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra"
        ],
        "image": "/assets/products/p10-kw68-mini-smartwatch.jpg",
        "gallery": [
            "/assets/products/p10-kw68-mini-smartwatch.jpg"
        ]
    },
  {
        "id": "y80-ultra-smartwatch",
        "photoRef": "P11",
        "title": "Y80 Ultra Smartwatch (8+1 Interchangeable Strap Set)",
        "titleBn": "ওয়াই ৮০ আল্ট্রা স্মার্টওয়াচ (৮+১ স্ট্র্যাপ কম্বো সেট)",
        "category": "wearables",
        "badge": "8+1 Straps",
        "price": 890,
        "originalPrice": 1250,
        "retailRange": {
            "low": 720,
            "high": 2000
        },
        "rating": 4.8,
        "reviewCount": 84,
        "stock": 45,
        "isDevelopmentSeed": true,
        "warranty": "7-Day Replacement Warranty",
        "description": "An Ultra-style smartwatch in a strap-set presentation box. A choice for buyers who want to change their watch's look; confirm the strap count and supported calling features.",
        "descriptionBn": "স্ট্র্যাপ সেটের বক্সে আল্ট্রা ডিজাইনের স্মার্টওয়াচ। ঘড়ির লুক বদলাতে পছন্দ হলে দেখতে পারেন; স্ট্র্যাপের সংখ্যা ও কলিং ফিচার আগে নিশ্চিত করুন।",
        "verificationNotes": "Box has inconsistent 8+1 / seven-plus-one wording. Check availability and strap count. 7-Day replacement warranty included.",
        "verificationNotesBn": "আল্ট্রা স্টাইল কেস সহ মাল্টিপল স্ট্র্যাপ প্যাক। ব্লুটুথ কলিং ও নোটিফিকেশন সাপোর্ট।",
        "specs": {
            "Screen": "2.02-inch HD edge-to-edge display",
            "Included Straps": "Ocean, Silicone & Alpine interchangeable bands",
            "Charging": "Magnetic Wireless Charging Dock",
            "Calling": "Bluetooth hands-free speaker & mic"
        },
        "variants": [
            {
                "id": "v1",
                "name": "Titanium Orange Pack",
                "hex": "#F97316",
                "inStock": true
            },
            {
                "id": "v2",
                "name": "Matte Black Pack",
                "hex": "#1C1D1F",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "iPhone 15 Pro Max",
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra"
        ],
        "image": "/assets/products/p11-y80-ultra-smartwatch.jpg",
        "gallery": [
            "/assets/products/p11-y80-ultra-smartwatch.jpg",
            "/assets/products/y80-ultra-smartwatch.jpg"
        ]
    },
  {
        "id": "p12-laxasfit-k10-ultra",
        "photoRef": "P12",
        "title": "LAXASFIT K10 Ultra Smartwatch with 2G SIM Slot",
        "titleBn": "লাক্সাসফিট কে১০ আল্ট্রা ২জি সিম স্লট স্মার্টওয়াচ",
        "category": "wearables",
        "badge": "2G SIM Slot",
        "price": 1350,
        "originalPrice": 1680,
        "retailRange": {
            "low": 1250,
            "high": 1682
        },
        "rating": 4.7,
        "reviewCount": 38,
        "stock": 20,
        "isDevelopmentSeed": true,
        "warranty": "7-Day Replacement Warranty",
        "description": "An Ultra-style smartwatch marketed with a SIM slot for wrist-based calling. The box identifies 2G support; confirm local SIM operation, charging method and the supplied strap colour.",
        "descriptionBn": "কবজি থেকেই কল করার জন্য সিম স্লটযুক্ত বলে বাজারজাত K10 Ultra স্মার্টওয়াচ। বক্সে 2G লেখা আছে; নিজের সিমে কাজ করে কি না ও চার্জিং পদ্ধতি নিশ্চিত করুন।",
        "verificationNotes": "Package says 2.19-inch and 2G. Do not copy conflicting 3G/4G wording. Actual network support and app functions need testing.",
        "verificationNotesBn": "বক্সে ২.১৯ ইঞ্চি ও ২জি লেখা আছে। স্থানীয় সিম কার্ড ব্যবহারের আগে নেটওয়ার্ক ব্যান্ড যাচাই করুন। ৭ দিনের ওয়ারেন্টি।",
        "specs": {
            "Display": "2.19-inch Full Touch Screen",
            "Connectivity": "Independent 2G GSM SIM Slot",
            "Features": "Direct Wrist Calling, Phonebook, SMS, App Sync"
        },
        "variants": [
            {
                "id": "v1",
                "name": "Orange Action Strap",
                "hex": "#EA580C",
                "inStock": true
            },
            {
                "id": "v2",
                "name": "Midnight Black",
                "hex": "#18181B",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "iPhone 15 Pro Max",
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra"
        ],
        "image": "/assets/products/p12-laxasfit-k10-ultra-sim-watch.jpg",
        "gallery": [
            "/assets/products/p12-laxasfit-k10-ultra-sim-watch.jpg"
        ]
    },
  {
        "id": "p13-t800-ultra2-smartwatch",
        "photoRef": "P13",
        "title": "T800 Ultra 2 Smartwatch with Wireless Charging",
        "titleBn": "টি৮০০ আল্ট্রা ২ স্মার্টওয়াচ উইথ ওয়্যারলেস চার্জিং",
        "category": "wearables",
        "badge": "Ultra 2",
        "price": 690,
        "originalPrice": 950,
        "retailRange": {
            "low": 499,
            "high": 1090
        },
        "rating": 4.6,
        "reviewCount": 54,
        "stock": 35,
        "isDevelopmentSeed": true,
        "warranty": "7-Day Replacement Warranty",
        "description": "A square-face smartwatch in an Ultra-style design, presented with a dark strap. The model is sold for everyday watch functions and connected-phone features; verify compatibility with your handset.",
        "descriptionBn": "ডার্ক স্ট্র্যাপসহ আল্ট্রা ডিজাইনের স্কয়ার-ফেস স্মার্টওয়াচ। দৈনন্দিন ঘড়ির ব্যবহার ও ফোন-সংযুক্ত ফিচারের জন্য দেখতে পারেন; নিজের ফোনে কাজ করে কি না যাচাই করুন।",
        "verificationNotes": "1.99-inch and wireless charging are printed claims. Do not advertise medical-grade readings. Budget copy model.",
        "verificationNotesBn": "১.৯৯ ইঞ্চি ডিসপ্লে ও ওয়্যারলেস চার্জিং বক্সের দাবি। দৈনন্দিন স্মার্টওয়াচ ফিচারের জন্য বাজেট চয়েস।",
        "specs": {
            "Display": "1.99-inch Infinite HD Touchscreen",
            "Strap": "Comfort ribbed ocean silicone strap",
            "Charging": "Magnetic induction charger"
        },
        "variants": [
            {
                "id": "v1",
                "name": "Space Gray / Dark Strap",
                "hex": "#374151",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "iPhone 15 Pro Max",
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra"
        ],
        "image": "/assets/products/p13-t800-ultra2-smartwatch.jpg",
        "gallery": [
            "/assets/products/p13-t800-ultra2-smartwatch.jpg"
        ]
    },
  {
        "id": "oraimo-or08-wireless-headset",
        "photoRef": "P14 / P19",
        "title": "OR-08 Wireless Over-Ear Headset (Oraimo-Labelled)",
        "titleBn": "ওআর-০৮ ওয়্যারলেস ওভার-ইয়ার হেডসেট (ওরাইমো-লেবেলযুক্ত)",
        "category": "audio",
        "badge": "40mm Drivers",
        "price": 990,
        "originalPrice": 1250,
        "retailRange": {
            "low": 650,
            "high": 1100
        },
        "rating": 4.7,
        "reviewCount": 53,
        "stock": 24,
        "isDevelopmentSeed": true,
        "warranty": "7-Day Replacement Warranty",
        "description": "A black wireless headset with cushioned earcups and an adjustable-looking headband. Its simple over-ear form is suitable for a compact everyday audio listing once the exact model is confirmed.",
        "descriptionBn": "কুশনযুক্ত ইয়ারকাপ ও হেডব্যান্ডসহ কালো রঙের ওয়্যারলেস হেডসেট। দৈনন্দিন ব্যবহারের জন্য সরল ওভার-ইয়ার ডিজাইন; কেনার আগে মডেল ও কার্যকর ফিচার নিশ্চিত করুন।",
        "verificationNotes": "Authentic oraimo status, 48-hour claim and 365-day warranty are not established. P14 and P19 are SHA-256 byte-identical photos.",
        "verificationNotesBn": "গ্রিন প্যাকেজিংয়ের ওআর-০৮ হেডসেট। পি১৪ ও পি১৯ একই পণ্যের ছবি। ৭ দিনের রিপ্লেসমেন্ট ওয়ারেন্টি।",
        "specs": {
            "Drivers": "40mm Deep Bass Neodymium",
            "Battery Claim": "48 Hours printed on box (Untested)",
            "Controls": "Integrated ear-cup tactile buttons",
            "Aux Support": "3.5mm line-in backup"
        },
        "variants": [
            {
                "id": "v1",
                "name": "Midnight Black & Silver",
                "hex": "#22252A",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "iPhone 15 Pro Max",
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra"
        ],
        "image": "/assets/products/p14-oraimo-or08-headset.jpg",
        "gallery": [
            "/assets/products/p14-oraimo-or08-headset.jpg",
            "/assets/products/oraimo-or08-headset.jpg"
        ]
    },
  {
        "id": "luminous-sa-rgb-headphones",
        "photoRef": "P15",
        "title": "SAN-002 Luminous Wireless Headphones",
        "titleBn": "এসএএন-০০২ লুমিনাস ওয়্যারলেস হেডফোন",
        "category": "audio",
        "badge": "Light Detailing",
        "price": 790,
        "originalPrice": 1100,
        "retailRange": {
            "low": 700,
            "high": 1200
        },
        "rating": 4.7,
        "reviewCount": 31,
        "stock": 20,
        "isDevelopmentSeed": true,
        "warranty": "7-Day Replacement Warranty",
        "description": "Red-and-black over-ear wireless headphones with padded earcups and decorative light detailing shown on the box. Confirm the available colour and lighting behaviour on the supplied unit.",
        "descriptionBn": "প্যাডযুক্ত ইয়ারকাপসহ লাল-কালো ওভার-ইয়ার ওয়্যারলেস হেডফোন। বক্সে আলোর সাজ দেখানো আছে; পণ্যের রং ও আলো কীভাবে কাজ করে তা দেখে নিন।",
        "verificationNotes": "Model appears SAN-002. Estimate uses other Luminous listings. Do not transfer other models' battery specifications.",
        "verificationNotesBn": "লাল ও কালো রঙের কম্বিনেশনসহ ওভার-ইয়ার হেডফোন। এলইডি লাইটিং ডিজাইন। ৭ দিনের ওয়ারেন্টি।",
        "specs": {
            "Design": "Circumaural padded oval earcups",
            "Lighting": "Multi-mode glowing ear panels",
            "Media": "Bluetooth wireless & TF card slot"
        },
        "variants": [
            {
                "id": "v1",
                "name": "Sport Red & Black",
                "hex": "#DC2626",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "iPhone 15 Pro Max",
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra"
        ],
        "image": "/assets/products/p15-san002-luminous-headphones.jpg",
        "gallery": [
            "/assets/products/p15-san002-luminous-headphones.jpg"
        ]
    },
  {
        "id": "p16-ankeer-nk-ny200-headphones",
        "photoRef": "P16",
        "title": "ANKEER NK-NY200 Wireless Over-Ear Headphones",
        "titleBn": "আঙ্কির এনকে-এনওয়াই২০০ ওয়্যারলেস ওভার-ইয়ার হেডফোন",
        "category": "audio",
        "badge": "Padded Headband",
        "price": 850,
        "originalPrice": 1250,
        "retailRange": {
            "low": 680,
            "high": 1351
        },
        "rating": 4.6,
        "reviewCount": 27,
        "stock": 18,
        "isDevelopmentSeed": true,
        "warranty": "7-Day Replacement Warranty",
        "description": "Black over-ear wireless headphones with cushioned earcups and a padded headband. The NK-NY200 design offers a simple everyday listening format with the model clearly identified on its box.",
        "descriptionBn": "প্যাডযুক্ত হেডব্যান্ড ও কুশন ইয়ারকাপসহ কালো ওভার-ইয়ার ওয়্যারলেস হেডফোন। NK-NY200 মডেলের সহজ ডিজাইন দৈনন্দিন গান ও ভিডিও শোনার জন্য উপযোগী।",
        "verificationNotes": "ANKEER is the printed name; do not rename it Anker or Soundcore. Box claims 40h, battery life is unverified.",
        "verificationNotesBn": "বক্সে 'ANKEER' ছাপা আছে; এটি সাউন্ডকোর বা অ্যাঙ্কার নয়। ৪০ ঘণ্টার ব্যাটারি দাবি প্যাকেজিংয়ের। ৭ দিনের রিপ্লেসমেন্ট।",
        "specs": {
            "Format": "Over-ear cushioned stereo headset",
            "Color": "Matte Jet Black",
            "Model Printed": "NK-NY200"
        },
        "variants": [
            {
                "id": "v1",
                "name": "Matte Jet Black",
                "hex": "#171717",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "iPhone 15 Pro Max",
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra"
        ],
        "image": "/assets/products/p16-ankeer-nk-ny200-headphones.jpg",
        "gallery": [
            "/assets/products/p16-ankeer-nk-ny200-headphones.jpg"
        ]
    },
  {
        "id": "q8-usb-callcenter-headset",
        "photoRef": "P17",
        "title": "TUCCI Q8 USB PC Headset with Clear-Voice Mic",
        "titleBn": "টুচি কিউ৮ ইউএসবি পিসি হেডসেট উইথ ক্লিয়ার-ভয়েস মাইক",
        "category": "audio",
        "badge": "USB Interface",
        "price": 850,
        "originalPrice": 1150,
        "retailRange": {
            "low": 600,
            "high": 1000
        },
        "rating": 4.7,
        "reviewCount": 49,
        "stock": 22,
        "isDevelopmentSeed": true,
        "warranty": "7-Day Replacement Warranty",
        "description": "A black wired headset with a boom microphone, padded earcups and USB connection stated on the box. Intended for use with a compatible computer or USB audio device.",
        "descriptionBn": "বুম মাইক ও প্যাডযুক্ত ইয়ারকাপসহ কালো তারযুক্ত হেডসেট। বক্সে USB কানেকশন লেখা আছে; উপযুক্ত কম্পিউটার বা USB অডিও ডিভাইসে ব্যবহারের আগে সাপোর্ট মিলিয়ে নিন।",
        "verificationNotes": "No exact Bangladesh Q8 price found. Estimate uses TUCCI X8/A5 references. Not Q8 TWS earbuds.",
        "verificationNotesBn": "ইউএসবি ইন্টারফেসযুক্ত কম্পিউটার ও ল্যাপটপ হেডসেট। নয়েজ ফিল্টারিং বুম মাইক।",
        "specs": {
            "Connector": "USB-A Plug & Play",
            "Microphone": "Flexible boom arm noise-filtering mic",
            "Acoustics": "40mm Stereo drivers with padded earcups"
        },
        "variants": [
            {
                "id": "v1",
                "name": "Office Black",
                "hex": "#18181B",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra"
        ],
        "image": "/assets/products/p17-tucci-q8-usb-headset.jpg",
        "gallery": [
            "/assets/products/p17-tucci-q8-usb-headset.jpg"
        ]
    },
  {
        "id": "p18-t9-luminous-headphones",
        "photoRef": "P18",
        "title": "T9 Luminous Wireless Headphones (Gold Accent)",
        "titleBn": "টি৯ লুমিনাস ওয়্যারলেস হেডফোন (গোল্ড অ্যাকসেন্ট)",
        "category": "audio",
        "badge": "Gold Accents",
        "price": 690,
        "originalPrice": 950,
        "retailRange": {
            "low": 649,
            "high": 649
        },
        "rating": 4.6,
        "reviewCount": 24,
        "stock": 19,
        "isDevelopmentSeed": true,
        "warranty": "7-Day Replacement Warranty",
        "description": "Over-ear wireless headphones with padded earcups and circular decorative panels. The T9 label and illuminated-style artwork distinguish this version from the other headphones in the photos.",
        "descriptionBn": "প্যাডযুক্ত ইয়ারকাপ ও গোলাকার সাজযুক্ত ওভার-ইয়ার ওয়্যারলেস হেডফোন। T9 লেবেল ও আলোকসজ্জার ডিজাইন এই সংস্করণকে অন্য হেডফোন থেকে আলাদা করে।",
        "verificationNotes": "BDT 649 T9 listing is out of stock. Same model code alone does not confirm the exact Luminous version. Preserves circular decorative panels.",
        "verificationNotesBn": "টি৯ লেবেলের সার্কুলার ডিজাইনের আলোকসজ্জিত ওয়্যারলেস হেডফোন। ৭ দিনের রিপ্লেসমেন্ট।",
        "specs": {
            "Panels": "Circular gold-accented illuminated cups",
            "Audio": "High-fidelity stereo audio with built-in mic",
            "Playback": "Bluetooth wireless / AUX / MicroSD"
        },
        "variants": [
            {
                "id": "v1",
                "name": "Midnight & Gold",
                "hex": "#D97706",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "iPhone 15 Pro Max",
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra"
        ],
        "image": "/assets/products/p18-t9-luminous-headphones.jpg",
        "gallery": [
            "/assets/products/p18-t9-luminous-headphones.jpg"
        ]
    },
  {
        "id": "recrsi-4in1-65w-cable",
        "photoRef": "P20",
        "title": "RECRSI 4-in-1 Fast Charging & Data Cable",
        "titleBn": "রেকর্সি ৪-ইন-১ ফাস্ট চার্জিং ও ডেটা ক্যাবল",
        "category": "charging",
        "badge": "65W 4-in-1",
        "price": 420,
        "originalPrice": 480,
        "retailRange": {
            "low": 390,
            "high": 790
        },
        "rating": 4.9,
        "reviewCount": 76,
        "stock": 60,
        "isDevelopmentSeed": true,
        "warranty": "6-Month Replacement Warranty",
        "description": "A multi-connector cable shown with switchable USB-A/USB-C input and Type-C/Lightning output options. A convenient format for carrying fewer separate cables when your devices use different ports.",
        "descriptionBn": "USB-A/USB-C ইনপুট ও Type-C/Lightning আউটপুট বদলানোর সুবিধাসহ মাল্টি-কানেক্টর কেবল। ভিন্ন পোর্টের ডিভাইস ব্যবহার করলে একাধিক আলাদা কেবল বহনের প্রয়োজন কমাতে পারে।",
        "verificationNotes": "Brand is stylised and should be confirmed. Package claims 65W and PD27W, not tested. Verified dual-switch connector design.",
        "verificationNotesBn": "সুইচযোগ্য ৪-ইন-১ কানেক্টর। গোল্ড স্লিভ অ্যালয় ডিজাইন। ৬ মাসের রিপ্লেসমেন্ট ওয়ারেন্টি।",
        "specs": {
            "Input Options": "Switchable USB-A and USB-C",
            "Output Options": "USB Type-C (65W rating) & Lightning (27W rating)",
            "Braiding": "Heavy-duty nylon braided cord",
            "Length": "1.2 Meters"
        },
        "variants": [
            {
                "id": "v1",
                "name": "Glacial Blue & Black Weave",
                "hex": "#8EB8D8",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "iPhone 15 Pro Max",
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra"
        ],
        "image": "/assets/products/p20-recrsi-4in1-cable.jpg",
        "gallery": [
            "/assets/products/p20-recrsi-4in1-cable.jpg",
            "/assets/products/recrsi-4in1-65w-cable.jpg"
        ]
    },
  {
        "id": "p22-hoco-bt-diamond-700h",
        "photoRef": "P22",
        "title": "Hoco BT Diamond Wireless Neckband (700H Mark)",
        "titleBn": "হোকো বিটি ডায়মন্ড ওয়্যারলেস নেকব্যান্ড (৭০০এইচ মার্ক)",
        "category": "audio",
        "badge": "700H Label",
        "price": 790,
        "originalPrice": 990,
        "retailRange": {
            "low": 790,
            "high": 790
        },
        "rating": 4.7,
        "reviewCount": 39,
        "stock": 25,
        "isDevelopmentSeed": true,
        "warranty": "7-Day Replacement Warranty",
        "description": "A neckband-style wireless earphone shown with in-ear tips and side controls. Its BT Diamond-labelled packaging identifies the version; check calling performance and the actual battery runtime.",
        "descriptionBn": "ইন-ইয়ার টিপস ও পাশে কন্ট্রোলসহ নেকব্যান্ড ওয়্যারলেস ইয়ারফোন। BT Diamond লেবেলের সংস্করণটি কেনার আগে কলের মান ও বাস্তব ব্যাটারি ব্যাকআপ পরীক্ষা করুন।",
        "verificationNotes": "700H is a packaging/seller claim, not verified continuous playback. Authentic Hoco status and five-voice feature need confirmation.",
        "verificationNotesBn": "৭০০ ঘণ্টা প্যাকেজিং ও বিক্রেতার দাবি, বাস্তব প্লেব্যাক আলাদা হতে পারে। ম্যাগনেটিক বাডস ও কলিং কন্ট্রোল। ৭ দিনের ওয়ারেন্টি।",
        "specs": {
            "Package": "Orange & white BT Diamond presentation box",
            "Format": "Ergonomic silicone collar with magnetic earpieces",
            "Controls": "Side tactical buttons with microphone"
        },
        "variants": [
            {
                "id": "v1",
                "name": "Diamond Black",
                "hex": "#1F2421",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "iPhone 15 Pro Max",
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra"
        ],
        "image": "/assets/products/p22-hoco-bt-diamond-700h.jpg",
        "gallery": [
            "/assets/products/p22-hoco-bt-diamond-700h.jpg"
        ]
    },
  {
        "id": "p23-vdenmenv-d50l-lightning",
        "photoRef": "P23-D50L",
        "title": "VDENMENV D50L 2.4A Lightning Cable (1m)",
        "titleBn": "ভিডেনমেনভ ডি৫০এল ২.৪এ লাইটনিং ক্যাবল (১মি.)",
        "category": "charging",
        "badge": "2.4A Fast",
        "price": 150,
        "originalPrice": 200,
        "retailRange": {
            "low": 100,
            "high": 200
        },
        "rating": 4.8,
        "reviewCount": 44,
        "stock": 50,
        "isDevelopmentSeed": true,
        "warranty": "1-Month Replacement Warranty",
        "description": "A one-metre USB-A to Lightning cable, marked 2.4A on the box, for compatible Lightning devices. Confirm charging and data support.",
        "descriptionBn": "উপযুক্ত Lightning ডিভাইসের জন্য এক মিটার USB-A থেকে Lightning কেবল। বক্সে 2.4A লেখা আছে; চার্জিং ও ডেটা সাপোর্ট মিলিয়ে নিন।",
        "verificationNotes": "Purple-box packaging. 2.4A rated charging and data sync. D50L exact BD listing estimated at BDT 100-200.",
        "verificationNotesBn": "পার্পল বক্সের প্যাকেজিং। ২.৪এ চার্জিং ও ডেটা সিঙ্ক। ১ মাসের ওয়ারেন্টি।",
        "specs": {
            "Interface": "USB-A to Apple Lightning 8-Pin",
            "Rating": "2.4A High Speed Data & Charging",
            "Length": "1.0 Meter"
        },
        "variants": [
            {
                "id": "v1",
                "name": "White & Green Accent",
                "hex": "#22C55E",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "iPhone 14 Pro Max",
            "iPhone 14 Pro",
            "iPhone 13 Pro"
        ],
        "image": "/assets/products/p23-vdenmenv-d50l-lightning.jpg",
        "gallery": [
            "/assets/products/p23-vdenmenv-d50l-lightning.jpg"
        ]
    },
  {
        "id": "p23-vdenmenv-d50t-typec",
        "photoRef": "P23-D50T",
        "title": "VDENMENV D50T 2.4A Type-C Cable (1m)",
        "titleBn": "ভিডেনমেনভ ডি৫০টি ২.৪এ টাইপ-সি ক্যাবল (১মি.)",
        "category": "charging",
        "badge": "2.4A Fast",
        "price": 140,
        "originalPrice": 190,
        "retailRange": {
            "low": 140,
            "high": 140
        },
        "rating": 4.8,
        "reviewCount": 51,
        "stock": 50,
        "isDevelopmentSeed": true,
        "warranty": "1-Month Replacement Warranty",
        "description": "A one-metre USB-A to Type-C cable for charging and syncing compatible devices. The box and seller listing specify a 2.4A rating.",
        "descriptionBn": "উপযুক্ত ডিভাইসে চার্জিং ও ডেটা সিঙ্কের জন্য এক মিটার USB-A থেকে Type-C কেবল। বক্স ও বিক্রেতার তালিকায় 2.4A রেটিং উল্লেখ আছে।",
        "verificationNotes": "Blue-box packaging. Exact-model verified listing at BDT 140.",
        "verificationNotesBn": "ব্লু বক্স প্যাকেজিং। বিডিটি ১৪০ এর ভেরিফাইড লিস্টিং। ১ মাসের রিপ্লেসমেন্ট।",
        "specs": {
            "Interface": "USB-A to USB Type-C",
            "Rating": "2.4A High Speed Fast Charging",
            "Length": "1.0 Meter"
        },
        "variants": [
            {
                "id": "v1",
                "name": "White & Green Accent",
                "hex": "#3B82F6",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra",
            "iPhone 15 Pro Max"
        ],
        "image": "/assets/products/p23-vdenmenv-d50t-typec.jpg",
        "gallery": [
            "/assets/products/p23-vdenmenv-d50t-typec.jpg"
        ]
    },
  {
        "id": "p25-pro-tws-black",
        "photoRef": "P25",
        "title": "Pro-Style Black Wireless Earbuds (H2 Sticker)",
        "titleBn": "প্রো-স্টাইল কালো ওয়্যারলেস ইয়ারবাড (এইচ২ স্টিকার)",
        "category": "audio",
        "badge": "Comparable Copy",
        "price": 890,
        "originalPrice": 1200,
        "retailRange": {
            "low": 650,
            "high": 1150
        },
        "rating": 4.7,
        "reviewCount": 46,
        "stock": 30,
        "isDevelopmentSeed": true,
        "warranty": "7-Day Replacement Warranty",
        "description": "Black in-ear wireless earbuds shown in a compact stem design with silicone-style tips. A dark-colour option for everyday audio; confirm the charging case and device pairing before ordering.",
        "descriptionBn": "সিলিকন ধরনের টিপস ও ছোট স্টেম ডিজাইনের কালো ওয়্যারলেস ইয়ারবাড। ডার্ক রং পছন্দ হলে দেখতে পারেন; চার্জিং কেস ও ফোনে পেয়ারিং আগে নিশ্চিত করুন।",
        "verificationNotes": "H2 and 100% ANC stickers do not verify the chipset or ANC. Treat as an unidentified Pro-style product; prices are for comparable black copies.",
        "verificationNotesBn": "কালো রঙের সিলিকন টিপসযুক্ত প্রো-স্টাইল সংস্করণ। তুলনামূলক কপি পণ্য। ৭ দিনের ওয়ারেন্টি।",
        "specs": {
            "Color": "Stealth Matte Black",
            "Tips": "Soft silicone acoustic noise-isolating tips",
            "Charging": "Pocket charging case with status LED"
        },
        "variants": [
            {
                "id": "v1",
                "name": "Stealth Black",
                "hex": "#111827",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "iPhone 15 Pro Max",
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra"
        ],
        "image": "/assets/products/p25-pro-tws-black.jpg",
        "gallery": [
            "/assets/products/p25-pro-tws-black.jpg"
        ]
    },
  {
        "id": "in-ear-bass-wired-earphones",
        "photoRef": "P26-DON-X20",
        "title": "DON-X20 In-Ear Wired Earphones with Mic (Angled 3.5mm)",
        "titleBn": "ডন-এক্স২০ ইন-ইয়ার তারযুক্ত ইয়ারফোন উইথ মাইক",
        "category": "audio",
        "badge": "Angled 3.5mm",
        "price": 150,
        "originalPrice": 220,
        "retailRange": {
            "low": 100,
            "high": 250
        },
        "rating": 4.5,
        "reviewCount": 65,
        "stock": 90,
        "isDevelopmentSeed": true,
        "warranty": "7-Day Replacement Warranty",
        "description": "DON-X20 in-ear wired earphones are the main product, shown with silicone-style tips and an angled 3.5mm plug. Other earphone boxes on the shelf should be listed separately once identified.",
        "descriptionBn": "ছবির মূল পণ্য DON-X20 তারযুক্ত ইন-ইয়ার ইয়ারফোন, সঙ্গে সিলিকন ধরনের টিপস ও বাঁকানো ৩.৫ মিমি প্লাগ। তাকের অন্য ইয়ারফোনগুলোর মডেল নিশ্চিত করে আলাদা তালিকা তৈরি করুন।",
        "verificationNotes": "Estimate uses similar budget wired earphones. Angled 90-degree 3.5mm plug prevents pocket cable bending.",
        "verificationNotesBn": "৯০ ডিগ্রি বাঁকানো ৩.৫ মিমি প্লাগ পকেটে থাকা অবস্থায় ক্যাবল কাটা যাওয়া রোধ করে। ৭ দিনের ওয়ারেন্টি।",
        "specs": {
            "Connector": "90° Angled 3.5mm Stereo Jack",
            "Microphone": "In-line clear voice calling mic with button",
            "Ear Tips": "Dual-color silicone seal tips"
        },
        "variants": [
            {
                "id": "v1",
                "name": "Red & Black",
                "hex": "#EF4444",
                "inStock": true
            },
            {
                "id": "v2",
                "name": "Solid Black",
                "hex": "#18181B",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra"
        ],
        "image": "/assets/products/p26-don-x20-earphones.jpg",
        "gallery": [
            "/assets/products/p26-don-x20-earphones.jpg",
            "/assets/products/p26-mixed-shelf-stock.jpg"
        ]
    },
  {
        "id": "p26-sh777-earphones",
        "photoRef": "P26-SH777",
        "title": "SH-777 4-in-1 Stereo Wired Earphones",
        "titleBn": "এসএইচ-৭৭৭ ৪-ইন-১ স্টেরিও তারযুক্ত ইয়ারফোন",
        "category": "audio",
        "badge": "Stereo Sound",
        "price": 190,
        "originalPrice": 280,
        "retailRange": {
            "low": 150,
            "high": 300
        },
        "rating": 4.6,
        "reviewCount": 22,
        "stock": 35,
        "isDevelopmentSeed": true,
        "warranty": "7-Day Replacement Warranty",
        "description": "White-and-blue wired earphones with an inline control are pictured on the SH-777 box. Confirm what the 4-in-1 label refers to.",
        "descriptionBn": "SH-777 বক্সে ইনলাইন কন্ট্রোলসহ সাদা-নীল তারযুক্ত ইয়ারফোন দেখানো আছে। 4-in-1 লেখা দিয়ে কী বোঝানো হয়েছে তা নিশ্চিত করুন।",
        "verificationNotes": "White-and-blue housing with inline remote. Budget wired audio reference.",
        "verificationNotesBn": "সাদা-নীল ডিজাইনের ইনলাইন কন্ট্রোলযুক্ত ইয়ারফোন। ৭ দিনের ওয়ারেন্টি।",
        "specs": {
            "Interface": "3.5mm Audio Plug",
            "Color": "White with Blue Ring Accents"
        },
        "variants": [
            {
                "id": "v1",
                "name": "White & Blue",
                "hex": "#3B82F6",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra"
        ],
        "image": "/assets/products/p26-sh777-earphones.jpg",
        "gallery": [
            "/assets/products/p26-sh777-earphones.jpg"
        ]
    },
  {
        "id": "p26-kin-earphones",
        "photoRef": "P26-KIN",
        "title": "KIN Heavy Bass Wired In-Ear Earphones",
        "titleBn": "কেআইএন হেভি বাস তারযুক্ত ইন-ইয়ার ইয়ারফোন",
        "category": "audio",
        "badge": "Heavy Bass",
        "price": 130,
        "originalPrice": 180,
        "retailRange": {
            "low": 100,
            "high": 200
        },
        "rating": 4.5,
        "reviewCount": 18,
        "stock": 40,
        "isDevelopmentSeed": true,
        "warranty": "7-Day Replacement Warranty",
        "description": "KIN-labelled wired earphones are visible in black and pink packs. Confirm whether these are colour variants of the same model.",
        "descriptionBn": "কালো ও গোলাপি প্যাকেটে KIN লেবেলের তারযুক্ত ইয়ারফোন দেখা যাচ্ছে। এগুলো একই মডেলের ভিন্ন রং কি না নিশ্চিত করুন।",
        "verificationNotes": "Available in pink and black packs. Budget in-ear wired earphones with 3.5mm plug.",
        "verificationNotesBn": "কালো ও গোলাপি প্যাকেজিং। দৈনন্দিন অডিওর বাজেট অপশন।",
        "specs": {
            "Interface": "3.5mm Jack",
            "Colors": "Pink or Black pack"
        },
        "variants": [
            {
                "id": "v1",
                "name": "Pink Pack",
                "hex": "#F472B6",
                "inStock": true
            },
            {
                "id": "v2",
                "name": "Black Pack",
                "hex": "#1F2937",
                "inStock": true
            }
        ],
        "compatibleWith": [
            "Galaxy S24 Ultra",
            "Pixel 8 Pro",
            "Xiaomi 14 Ultra"
        ],
        "image": "/assets/products/p26-kin-earphones.jpg",
        "gallery": [
            "/assets/products/p26-kin-earphones.jpg"
        ]
    }
];

export const FEATURED_BUNDLES = [
  {
    id: "bundle-everyday-power-audio",
    title: "The Everyday Power & Audio Combo",
    titleBn: "পাওয়ার ও অডিও অল-ইন-ওয়ান বান্ডিল",
    subtitle: "Y80 Ultra Smartwatch (8+1 Straps) + Pro-Style ANC Wireless Earbuds",
    subtitleBn: "ওয়াই ৮০ আল্ট্রা স্মার্টওয়াচ (৮+১ স্ট্র্যাপ) + প্রো-স্টাইল এএনসি এয়ারবাডস",
    badge: "Free Delivery Unlocked",
    badgeBn: "ফ্রি ডেলিভারি আনলকড",
    price: 2080,
    originalPrice: 2800,
    savings: 720,
    freeDelivery: true,
    image: "/assets/products/p11-y80-ultra-smartwatch.jpg",
    itemIds: ["y80-ultra-smartwatch", "h2-anc-pro-tws"],
    itemsSummary: "Y80 Ultra Smartwatch (৳890) + Pro 2 ANC Earbuds (৳1,190) = ৳2,080"
  },
  {
    id: "bundle-commuter-complete",
    title: "The Commuter Complete Tech Pack",
    titleBn: "কমিউটার কমপ্লিট টেক প্যাক",
    subtitle: "Oraimo Headset + RECRSI 4-in-1 Cable + 2-Pin Charger + REMAX Cable + In-Ear Earphones",
    subtitleBn: "ওরাইমো হেডসেট + রেকর্সি ৪-ইন-১ ক্যাবল + ২-পিন চার্জার + রিম্যাক্স ক্যাবল + ইয়ারফোন",
    badge: "5-in-1 Setup",
    badgeBn: "৫-ইন-১ সেটআপ",
    price: 2050,
    originalPrice: 2610,
    savings: 560,
    freeDelivery: true,
    image: "/assets/products/p20-recrsi-4in1-cable.jpg",
    itemIds: [
      "oraimo-or08-wireless-headset", 
      "recrsi-4in1-65w-cable", 
      "turbo-single-wall-charger", 
      "remax-rc155a-120w-cable", 
      "in-ear-bass-wired-earphones"
    ],
    itemsSummary: "Oraimo Headset (৳990) + 4-in-1 Cable (৳420) + 20W Adapter (৳250) + REMAX Cable (৳150) + In-Ear Earphones (৳150) = ৳1,960 + Top-up Bundle Deal"
  },
  {
    id: "bundle-his-and-hers-wearables",
    title: "His & Hers Smartwatch Pack",
    titleBn: "হিজ অ্যান্ড হার্স স্মার্টওয়াচ প্যাক",
    subtitle: "Y80 Ultra Smartwatch + KW68 Mini Pink Watch + REMAX 2-Pack Cables",
    subtitleBn: "ওয়াই ৮০ আল্ট্রা স্মার্টওয়াচ + কেডব্লিউ৬৮ মিনি পিংক ওয়াচ + রিম্যাক্স ২-প্যাক ক্যাবল",
    badge: "Couples Special",
    badgeBn: "কাপল স্পেশাল",
    price: 2030,
    originalPrice: 2600,
    savings: 570,
    freeDelivery: true,
    image: "/assets/products/p11-y80-ultra-smartwatch.jpg",
    itemIds: ["y80-ultra-smartwatch", "pink-glam-smartwatch", "remax-rc155a-duo-bundle"],
    itemsSummary: "Y80 Ultra (৳890) + Pink Watch (৳790) + 2x REMAX Cables (৳280) + Bonus OTG = ৳2,030"
  },
  {
    id: "bundle-ultrapods-audiophile-pack",
    title: "Ultrapods & Headset Audio Pack",
    titleBn: "আল্ট্রাপডস ও অডিওফাইল কম্বো প্যাক",
    subtitle: "Ultrapods Pro Transparent + Oraimo OR-08 Headset + SM 007 Neckband",
    subtitleBn: "আল্ট্রাপডস প্রো স্বচ্ছ বাডস + ওরাইমো হেডসেট + এসএম ০০৭ নেকব্যান্ড",
    badge: "Audio Trio",
    badgeBn: "অডিও ট্রায়ো",
    price: 2050,
    originalPrice: 2750,
    savings: 700,
    freeDelivery: true,
    image: "/assets/products/p04-ultrapods-pro-all.jpg",
    itemIds: ["p04-ultrapods-pro-tws", "oraimo-or08-wireless-headset", "sm-neckband-007"],
    itemsSummary: "Ultrapods Pro (৳350) + Oraimo Headset (৳990) + SM 007 Neckband (৳450) + RECRSI Cable (৳420) = ৳2,210"
  }
];
