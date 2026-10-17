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
  {
    "id": "h2-anc-pro-tws",
    "sku": "P01-ANC-PRO-WHT",
    "photoRef": "P01",
    "title": "Pro-Style White Wireless Earbuds",
    "titleBn": "প্রো-স্টাইল সাদা ওয়্যারলেস ইয়ারবাড",
    "category": "audio",
    "brand": "Unbranded (Apple-Style Labelled)",
    "model": "Pro-Style TWS (H2 Sticker)",
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
      "Brand": "Unbranded (Apple-Style Labelled)",
      "Model": "Pro-Style TWS (H2 Sticker)",
      "PhotoRef": "P01",
      "Acoustic Driver": "10mm High-Excursion Dynamic Driver",
      "Active Noise Cancellation": "Packaging Sticker Claim (Unverified)",
      "Battery Life": "Up to 4.5h per charge, 24h total with MagSafe-style case",
      "Connectivity": "Bluetooth 5.3 Low-Latency",
      "Microphones": "Dual Beamforming with Environmental Noise Reduction",
      "Charging Port": "Type-C / Wireless Qi Charging Pad Support"
    },
    "image": "/assets/products/h2-anc-pro-tws.jpg",
    "gallery": [
      "/assets/products/h2-anc-pro-tws.jpg",
      "/assets/products/p01-pro-tws-white.jpg",
      "/assets/products/p01-pro-tws-box-alt.jpg",
      "/assets/products/p01-pro-tws-stem-detail.jpg"
    ],
    "compatibleWith": [
      "iPhone 15 Pro Max",
      "iPhone 15 Pro",
      "iPhone 15",
      "iPhone 14 Pro",
      "Galaxy S24 Ultra",
      "Galaxy S24+",
      "Pixel 8 Pro",
      "Xiaomi 14 Ultra"
    ],
    "variants": [
      {
        "id": "white",
        "name": "Glacier White",
        "hex": "#FFFFFF",
        "inStock": true
      }
    ]
  },
  {
    "id": "remax-rc155a-120w-cable",
    "sku": "P02-RMX-RC155A",
    "photoRef": "P02",
    "title": "REMAX-Labelled RC-155a Fast Charging Cable",
    "titleBn": "রিম্যাক্স-লেবেলযুক্ত আরসি-১৫৫এ ফাস্ট চার্জিং কেবল",
    "category": "charging",
    "brand": "REMAX",
    "model": "RC-155a",
    "badge": "Model Verified",
    "price": 150,
    "originalPrice": 220,
    "retailRange": {
      "low": 130,
      "high": 130
    },
    "rating": 4.7,
    "reviewCount": 94,
    "stock": 45,
    "isDevelopmentSeed": true,
    "warranty": "30-Day Functional Warranty",
    "description": "A one-metre charging and data cable shown with gold-coloured connectors and a USB-A to Type-C layout. Select the actual connector version supplied with your order.",
    "descriptionBn": "সোনালি রঙের কানেক্টরসহ এক মিটার চার্জিং ও ডেটা কেবল। ছবিতে USB-A থেকে Type-C সংস্করণ দেখানো আছে; অর্ডারের আগে প্রয়োজনীয় কানেক্টর মিলিয়ে নিন।",
    "verificationNotes": "120W and original REMAX status are unverified. P21 shows the same printed RC-155a model.",
    "verificationNotesBn": "১২০ ওয়াট এবং আসল রিম্যাক্স স্ট্যাটাস যাচাইহীন। P21 একই মুদ্রিত RC-155a মডেল প্রদর্শন করে।",
    "specs": {
      "Brand": "REMAX",
      "Model": "RC-155a",
      "PhotoRef": "P02, P21",
      "Connector Layout": "USB-A to Type-C (Reversible)",
      "Length": "1.0 Meter (100cm)",
      "Rated Current": "Fast Charging Support (Up to 3A)",
      "Connector Housing": "Gold-Tone Reinforced Zinc-Alloy Shell",
      "Core Shielding": "Multi-Strand Tinned Copper with Braided Jacket"
    },
    "image": "/assets/products/p02-remax-rc155a-cable.jpg",
    "gallery": [
      "/assets/products/p02-remax-rc155a-cable.jpg",
      "/assets/products/p02-remax-rc155a-pkg-p02.jpg",
      "/assets/products/p02-remax-rc155a-connector-detail.jpg"
    ],
    "compatibleWith": [
      "Galaxy S24 Ultra",
      "Galaxy S24+",
      "Galaxy S23 Ultra",
      "Pixel 8 Pro",
      "Xiaomi 14 Ultra"
    ],
    "variants": [
      {
        "id": "gold-white",
        "name": "Gold / White",
        "hex": "#F3E8D2",
        "inStock": true
      }
    ]
  },
  {
    "id": "remax-rc155a-duo-bundle",
    "sku": "P02-RMX-RC155A-DUO",
    "photoRef": "P02",
    "title": "REMAX RC-155a Cable (2-Pack Value Deal)",
    "titleBn": "রিম্যাক্স আরসি-১৫৫এ কেবল (২-প্যাক ভ্যালু ডিল)",
    "category": "charging",
    "brand": "REMAX",
    "model": "RC-155a (2-Pack)",
    "badge": "Twin Pack",
    "price": 280,
    "originalPrice": 440,
    "retailRange": {
      "low": 260,
      "high": 260
    },
    "rating": 4.9,
    "reviewCount": 46,
    "stock": 25,
    "isDevelopmentSeed": true,
    "warranty": "30-Day Functional Warranty",
    "description": "Twin pack of REMAX-labelled RC-155a fast charging cables (1m USB-A to Type-C) with gold-plated connector accents.",
    "descriptionBn": "রিম্যাক্স-লেবেলযুক্ত আরসি-১৫৫এ ফাস্ট চার্জিং কেবলের দুই প্যাকের বিশেষ অফার।",
    "verificationNotes": "Same printed RC-155a model as P02/P21.",
    "verificationNotesBn": "P02/P21-এর একই মডেল।",
    "specs": {
      "Brand": "REMAX",
      "Model": "RC-155a (2-Pack)",
      "PhotoRef": "P02, P21",
      "Quantity": "2x Individual Cables",
      "Connector Layout": "USB-A to Type-C",
      "Length": "1.0 Meter per cable"
    },
    "image": "/assets/products/p02-remax-rc155a-cable.jpg",
    "gallery": [
      "/assets/products/p02-remax-rc155a-cable.jpg",
      "/assets/products/p02-remax-rc155a-pkg-p02.jpg",
      "/assets/products/p02-remax-rc155a-connector-detail.jpg"
    ],
    "compatibleWith": [
      "Galaxy S24 Ultra",
      "Pixel 8 Pro",
      "Xiaomi 14 Ultra"
    ],
    "variants": [
      {
        "id": "twin-pack",
        "name": "Twin Pack",
        "hex": "#F3E8D2",
        "inStock": true
      }
    ]
  },
  {
    "id": "sm-neckband-007",
    "sku": "P03-SM-007",
    "photoRef": "P03",
    "title": "SM 007 Wireless Neckband Earphone",
    "titleBn": "এসএম ০০৭ ওয়্যারলেস নেকব্যান্ড ইয়ারফোন",
    "category": "audio",
    "brand": "SM",
    "model": "SM 007",
    "badge": "Neckband",
    "price": 450,
    "originalPrice": 650,
    "retailRange": {
      "low": 300,
      "high": 600
    },
    "rating": 4.6,
    "reviewCount": 78,
    "stock": 30,
    "isDevelopmentSeed": true,
    "warranty": "7-Day Replacement Warranty",
    "description": "A black neckband-style wireless earphone with in-ear tips and controls positioned along the neckband. A practical format for keeping both earpieces together between listening sessions.",
    "descriptionBn": "কালো রঙের নেকব্যান্ড ইয়ারফোন, সঙ্গে ইন-ইয়ার টিপস ও নেকব্যান্ডের পাশে কন্ট্রোল। ব্যবহার শেষে দুই ইয়ারপিস একসঙ্গে গলায় রাখার সুবিধাজনক ডিজাইন।",
    "verificationNotes": "No exact Bangladesh SM 007 listing found. Estimate uses other budget neckbands. The printed 120-hour claim has not been tested.",
    "verificationNotesBn": "এসএম ০০৭ মডেলের সুনির্দিষ্ট স্থানীয় তথ্য যাচাইাধীন। ১২০ ঘণ্টার ব্যাটারি দাবি পরীক্ষিত নয়।",
    "specs": {
      "Brand": "SM",
      "Model": "SM 007",
      "PhotoRef": "P03",
      "Form Factor": "Flexible Silicone Contour Neckband",
      "Earpieces": "Magnetic Clasp Ergonomic In-Ear Shells",
      "Controls": "Integrated 3-Button Media & Volume Remote",
      "Battery Playtime": "Packaging claim: up to 120h standby (untested)",
      "Charging Interface": "Type-C Rechargeable Port"
    },
    "image": "/assets/products/p03-sm007-neckband.jpg",
    "gallery": [
      "/assets/products/p03-sm007-neckband.jpg",
      "/assets/products/sm-neckband-007.jpg",
      "/assets/products/p03-sm007-controller.jpg"
    ],
    "compatibleWith": [
      "Galaxy S24 Ultra",
      "iPhone 15 Pro",
      "Pixel 8 Pro",
      "Xiaomi 14 Ultra"
    ],
    "variants": [
      {
        "id": "black",
        "name": "Matte Black",
        "hex": "#1E293B",
        "inStock": true
      }
    ]
  },
  {
    "id": "p04-ultrapods-pro-tws",
    "sku": "P04-ULTRA-PRO",
    "photoRef": "P04",
    "title": "Ultrapods Pro Transparent TWS Earbuds",
    "titleBn": "আল্ট্রাপডস প্রো ট্রান্সপারেন্ট TWS ইয়ারবাডস",
    "category": "audio",
    "brand": "Ultrapods",
    "model": "Ultrapods Pro",
    "badge": "Trending Crystal",
    "price": 350,
    "originalPrice": 490,
    "retailRange": {
      "low": 235,
      "high": 439
    },
    "rating": 4.7,
    "reviewCount": 164,
    "stock": 52,
    "isDevelopmentSeed": true,
    "warranty": "7-Day Replacement Warranty",
    "description": "Colourful wireless earbuds presented with a transparent-style charging case and a visible battery display. Choose the colour you prefer and check the included charging accessories before purchase.",
    "descriptionBn": "স্বচ্ছ ডিজাইনের চার্জিং কেস ও ব্যাটারি ডিসপ্লেসহ রঙিন ওয়্যারলেস ইয়ারবাড। পছন্দের রং বেছে নিন এবং প্যাকেটে চার্জিংয়ের কী কী আনুষঙ্গিক আছে তা নিশ্চিত করুন।",
    "verificationNotes": "Colours are variants, not separate models. Bluetooth 5.3, waterproofing and Hi-Res marks are packaging claims unless tested.",
    "verificationNotesBn": "রঙগুলো একই মডেলের ভিন্ন ভিন্ন ভ্যারিয়েন্ট। ব্লুটুথ ৫.৩ এবং ওয়াটারপ্রুফিং প্যাকেজিংয়ের দাবি।",
    "specs": {
      "Brand": "Ultrapods",
      "Model": "Ultrapods Pro",
      "PhotoRef": "P04",
      "Case Design": "Full Crystal-Clear Polycarbonate Transparent Shell",
      "Battery Indicator": "Digital LED Percentage Dual-Channel Display",
      "Earbud Styling": "Stemless In-Ear Capsule Acoustic Format",
      "Available Colors": "Glacier Blue, Mint Green, Baby Pink, Phantom Black"
    },
    "image": "/assets/products/p04-ultrapods-pro-all.jpg",
    "gallery": [
      "/assets/products/p04-ultrapods-pro-all.jpg",
      "/assets/products/p04-ultrapods-pro-blue.jpg",
      "/assets/products/p04-ultrapods-pro-green.jpg",
      "/assets/products/p04-ultrapods-pro-pink.jpg",
      "/assets/products/p04-ultrapods-pro-black.jpg"
    ],
    "compatibleWith": [
      "iPhone 15 Pro Max",
      "iPhone 15",
      "Galaxy S24 Ultra",
      "Pixel 8 Pro",
      "Xiaomi 14 Ultra"
    ],
    "variants": [
      {
        "id": "blue",
        "name": "Glacier Blue",
        "hex": "#38BDF8",
        "inStock": true
      },
      {
        "id": "green",
        "name": "Mint Green",
        "hex": "#4ADE80",
        "inStock": true
      },
      {
        "id": "pink",
        "name": "Sakura Pink",
        "hex": "#F472B6",
        "inStock": true
      },
      {
        "id": "black",
        "name": "Phantom Black",
        "hex": "#1E293B",
        "inStock": true
      }
    ]
  },
  {
    "id": "p05-vdenmenv-dr06-earphones",
    "sku": "P05-VDM-DR06",
    "photoRef": "P05",
    "title": "VDENMENV DR06 In-Ear 3.5mm Earphones with Mic",
    "titleBn": "ভিডেনমেনভ ডিআর০৬ ইন-ইয়ার ৩.৫ মিমি ইয়ারফোন",
    "category": "audio",
    "brand": "VDENMENV",
    "model": "DR06",
    "badge": "Everyday Audio",
    "price": 160,
    "originalPrice": 250,
    "retailRange": {
      "low": 102,
      "high": 299
    },
    "rating": 4.5,
    "reviewCount": 68,
    "stock": 40,
    "isDevelopmentSeed": true,
    "warranty": "7-Day Replacement Warranty",
    "description": "A simple wired earphone for compatible 3.5mm devices, available in white and black. The DR06 listing identifies an inline microphone and control for everyday audio and calls.",
    "descriptionBn": "৩.৫ মিমি অডিও পোর্টযুক্ত ডিভাইসের জন্য সাদা ও কালো রঙের তারযুক্ত ইয়ারফোন। DR06 মডেলের তালিকায় গান শোনা ও কলের জন্য ইনলাইন মাইক ও কন্ট্রোল উল্লেখ আছে।",
    "verificationNotes": "Confirm jack and remote operation on the actual batch. Same DR06 appears in P23. Price differences include seller/channel variation.",
    "verificationNotesBn": "৩.৫ মিমি অডিও জ্যাকযুক্ত আসল পণ্য। P23-এ একই DR06 অন্তর্ভুক্ত রয়েছে।",
    "specs": {
      "Brand": "VDENMENV",
      "Model": "DR06",
      "PhotoRef": "P05, P23",
      "Audio Connector": "Standard 3.5mm Gold-Plated TRRS Audio Jack",
      "Cable Length": "1.2 Meter Flexible TPE Tangle-Resistant Cord",
      "In-Line Controls": "High-Sensitivity Mic with Call Answer / Track Skip Button",
      "Acoustic Driver": "10mm Dynamic Bass Response Unit"
    },
    "image": "/assets/products/p05-vdenmenv-dr06-earphones.jpg",
    "gallery": [
      "/assets/products/p05-vdenmenv-dr06-earphones.jpg",
      "/assets/products/p05-vdenmenv-dr06-pkg-p05.jpg",
      "/assets/products/p23-vdenmenv-dr06.jpg",
      "/assets/products/p05-vdenmenv-dr06-inline-mic.jpg"
    ],
    "compatibleWith": [
      "Pixel 7a",
      "Galaxy S24 Ultra",
      "Xiaomi 14",
      "Redmi Note 13 Pro+"
    ],
    "variants": [
      {
        "id": "white",
        "name": "Arctic White",
        "hex": "#FFFFFF",
        "inStock": true
      },
      {
        "id": "black",
        "name": "Classic Black",
        "hex": "#1E293B",
        "inStock": true
      }
    ]
  },
  {
    "id": "p06-samsung-pro-tws",
    "sku": "P06-SAM-COPY-TWS",
    "photoRef": "P06",
    "title": "Pro-Style TWS Earbuds (Samsung-Labelled)",
    "titleBn": "প্রো-স্টাইল TWS ইয়ারবাডস (স্যামসাং-লেবেলযুক্ত)",
    "category": "audio",
    "brand": "Samsung-Labelled (Authenticity Unverified)",
    "model": "Pro-Style TWS",
    "badge": "Comparable Copy",
    "price": 590,
    "originalPrice": 850,
    "retailRange": {
      "low": 585,
      "high": 597
    },
    "rating": 4.6,
    "reviewCount": 42,
    "stock": 28,
    "isDevelopmentSeed": true,
    "warranty": "7-Day Replacement Warranty",
    "description": "White stem-style wireless earbuds in Samsung-labelled packaging. Confirm the actual model and pairing functions before sale.",
    "descriptionBn": "Samsung লেবেলের বক্সে সাদা স্টেম ডিজাইনের ইয়ারবাড। বিক্রির আগে প্রকৃত মডেল ও পেয়ারিং ফিচার নিশ্চিত করুন।",
    "verificationNotes": "Packaging carries Samsung branding but authenticity is unverified. Price reflects comparable copy product in local market.",
    "verificationNotesBn": "বক্সে স্যামসাং ব্র্যান্ডিং রয়েছে তবে আসল পণ্য হিসেবে প্রমাণিত নয়। কপি পণ্যের জন্য বাজার মূল্য প্রযোজ্য।",
    "specs": {
      "Brand": "Samsung-Labelled (Authenticity Unverified)",
      "Model": "Pro-Style TWS",
      "PhotoRef": "P06",
      "Form Factor": "In-Ear Stem Acoustic Design",
      "Charging Case": "Pocket Magnetic Flip Case",
      "Connectivity": "Bluetooth Wireless Pairing"
    },
    "image": "/assets/products/p06-samsung-tws.jpg",
    "gallery": [
      "/assets/products/p06-samsung-tws.jpg",
      "/assets/products/p06-samsung-pkg.jpg",
      "/assets/products/p06-samsung-detail.jpg"
    ],
    "compatibleWith": [
      "Galaxy S24 Ultra",
      "Galaxy S24+",
      "Galaxy S23 Ultra",
      "Pixel 8 Pro"
    ],
    "variants": [
      {
        "id": "white",
        "name": "White",
        "hex": "#FFFFFF",
        "inStock": true
      }
    ]
  },
  {
    "id": "p06-realme-pro-tws",
    "sku": "P06-RLM-COPY-TWS",
    "photoRef": "P06",
    "title": "Pro-Style TWS Earbuds (realme-Labelled)",
    "titleBn": "প্রো-স্টাইল TWS ইয়ারবাডস (রিয়েলমি-লেবেলযুক্ত)",
    "category": "audio",
    "brand": "realme-Labelled (Authenticity Unverified)",
    "model": "Pro-Style TWS",
    "badge": "Comparable Copy",
    "price": 320,
    "originalPrice": 480,
    "retailRange": {
      "low": 280,
      "high": 280
    },
    "rating": 4.5,
    "reviewCount": 35,
    "stock": 25,
    "isDevelopmentSeed": true,
    "warranty": "7-Day Replacement Warranty",
    "description": "White Pro-style wireless earbuds in a yellow-and-white box. Confirm the charging case, connector and actual brand identity.",
    "descriptionBn": "হলুদ-সাদা বক্সে সাদা Pro-style ইয়ারবাড। চার্জিং কেস, কানেক্টর ও প্রকৃত ব্র্যান্ড পরিচয় নিশ্চিত করুন।",
    "verificationNotes": "Packaging carries realme mark; authenticity unverified. Priced as comparable local copy.",
    "verificationNotesBn": "রিয়েলমি লেবেলযুক্ত বক্স; তুলনামূলক স্থানীয় কপি পণ্যের মূল্য।",
    "specs": {
      "Brand": "realme-Labelled (Authenticity Unverified)",
      "Model": "Pro-Style TWS",
      "PhotoRef": "P06",
      "Box Style": "Signature Yellow-and-White Retail Carton",
      "Connectivity": "Bluetooth Wireless Audio"
    },
    "image": "/assets/products/p06-realme-tws.jpg",
    "gallery": [
      "/assets/products/p06-realme-tws.jpg",
      "/assets/products/p06-realme-pkg.jpg"
    ],
    "compatibleWith": [
      "Xiaomi 14",
      "Pixel 8",
      "Galaxy S24"
    ],
    "variants": [
      {
        "id": "white",
        "name": "White",
        "hex": "#FFFFFF",
        "inStock": true
      }
    ]
  },
  {
    "id": "p06-oneplus-pro-tws",
    "sku": "P06-1P-COPY-TWS",
    "photoRef": "P06",
    "title": "Pro-Style TWS Earbuds (OnePlus-Labelled)",
    "titleBn": "প্রো-স্টাইল TWS ইয়ারবাডস (ওয়ানপ্লাস-লেবেলযুক্ত)",
    "category": "audio",
    "brand": "OnePlus-Labelled (Authenticity Unverified)",
    "model": "Pro-Style TWS",
    "badge": "Comparable Copy",
    "price": 650,
    "originalPrice": 900,
    "retailRange": {
      "low": 520,
      "high": 750
    },
    "rating": 4.6,
    "reviewCount": 38,
    "stock": 20,
    "isDevelopmentSeed": true,
    "warranty": "7-Day Replacement Warranty",
    "description": "Stem-style wireless earbuds with a portable charging case shown on the box. Check the actual model and supplied accessories.",
    "descriptionBn": "বক্সে বহনযোগ্য চার্জিং কেসসহ স্টেম ডিজাইনের ইয়ারবাড দেখানো আছে। প্রকৃত মডেল ও সঙ্গে দেওয়া অ্যাকসেসরি যাচাই করুন।",
    "verificationNotes": "Packaging carries OnePlus branding; authenticity unverified copy listing.",
    "verificationNotesBn": "ওয়ানপ্লাস ব্র্যান্ডিং যুক্ত বক্স; কপি পণ্যের বাজার মূল্য।",
    "specs": {
      "Brand": "OnePlus-Labelled (Authenticity Unverified)",
      "Model": "Pro-Style TWS",
      "PhotoRef": "P06",
      "Packaging": "Red-and-White Retail Box",
      "Connectivity": "Bluetooth 5.2"
    },
    "image": "/assets/products/p06-oneplus-tws.jpg",
    "gallery": [
      "/assets/products/p06-oneplus-tws.jpg",
      "/assets/products/p06-oneplus-pkg.jpg"
    ],
    "compatibleWith": [
      "Pixel 8 Pro",
      "Galaxy S24 Ultra",
      "Xiaomi 14"
    ],
    "variants": [
      {
        "id": "white",
        "name": "White",
        "hex": "#FFFFFF",
        "inStock": true
      }
    ]
  },
  {
    "id": "p06-lenovo-pro-tws",
    "sku": "P06-LNV-COPY-TWS",
    "photoRef": "P06",
    "title": "Pro-Style TWS Earbuds (Lenovo-Labelled)",
    "titleBn": "প্রো-স্টাইল TWS ইয়ারবাডস (লেনোভো-লেবেলযুক্ত)",
    "category": "audio",
    "brand": "Lenovo-Labelled (Authenticity Unverified)",
    "model": "Pro-Style TWS",
    "badge": "Comparable Copy",
    "price": 490,
    "originalPrice": 699,
    "retailRange": {
      "low": 400,
      "high": 699
    },
    "rating": 4.5,
    "reviewCount": 24,
    "stock": 22,
    "isDevelopmentSeed": true,
    "warranty": "7-Day Replacement Warranty",
    "description": "White stem-style earbuds in Lenovo-labelled packaging. Verify the model independently of the box artwork.",
    "descriptionBn": "Lenovo লেবেলের বক্সে সাদা স্টেম ডিজাইনের ইয়ারবাড। শুধু বক্সের ছবি দেখে নয়, পণ্য দেখে মডেল নিশ্চিত করুন।",
    "verificationNotes": "Packaging carries Lenovo mark; authenticity unverified.",
    "verificationNotesBn": "লেনোভো লেবেলযুক্ত বক্স; তুলনামূলক স্থানীয় কপি মূল্য।",
    "specs": {
      "Brand": "Lenovo-Labelled (Authenticity Unverified)",
      "Model": "Pro-Style TWS",
      "PhotoRef": "P06",
      "Form Factor": "Stem-style in-ear earbuds",
      "Connectivity": "Bluetooth Wireless Audio"
    },
    "image": "/assets/products/p06-lenovo-tws.jpg",
    "gallery": [
      "/assets/products/p06-lenovo-tws.jpg",
      "/assets/products/p06-lenovo-pkg.jpg"
    ],
    "compatibleWith": [
      "Galaxy S24",
      "Pixel 8",
      "Xiaomi 14"
    ],
    "variants": [
      {
        "id": "white",
        "name": "White",
        "hex": "#FFFFFF",
        "inStock": true
      }
    ]
  },
  {
    "id": "p06-oppo-pro-tws",
    "sku": "P06-OPP-COPY-TWS",
    "photoRef": "P06",
    "title": "Pro-Style TWS Earbuds (OPPO-Labelled)",
    "titleBn": "প্রো-স্টাইল TWS ইয়ারবাডস (অপ্পো-লেবেলযুক্ত)",
    "category": "audio",
    "brand": "OPPO-Labelled (Authenticity Unverified)",
    "model": "Pro-Style TWS",
    "badge": "Comparable Copy",
    "price": 450,
    "originalPrice": 650,
    "retailRange": {
      "low": 300,
      "high": 700
    },
    "rating": 4.5,
    "reviewCount": 19,
    "stock": 18,
    "isDevelopmentSeed": true,
    "warranty": "7-Day Replacement Warranty",
    "description": "White wireless earbuds shown with a charging case on green packaging. Confirm the exact model before publishing a branded listing.",
    "descriptionBn": "সবুজ বক্সে চার্জিং কেসসহ সাদা ওয়্যারলেস ইয়ারবাডের ছবি। ব্র্যান্ডের নামে তালিকা প্রকাশের আগে আসল মডেল নিশ্চিত করুন।",
    "verificationNotes": "Packaging carries OPPO branding; authenticity unverified.",
    "verificationNotesBn": "অপ্পো লেবেলযুক্ত বক্স; তুলনামূলক বাজেট কপি পণ্যের মূল্য।",
    "specs": {
      "Brand": "OPPO-Labelled (Authenticity Unverified)",
      "Model": "Pro-Style TWS",
      "PhotoRef": "P06",
      "Packaging": "Green Retail Carton",
      "Connectivity": "Bluetooth Wireless Audio"
    },
    "image": "/assets/products/p06-oppo-tws.jpg",
    "gallery": [
      "/assets/products/p06-oppo-tws.jpg",
      "/assets/products/p06-oppo-pkg.jpg"
    ],
    "compatibleWith": [
      "Galaxy S24 Ultra",
      "Pixel 8 Pro",
      "Xiaomi 14"
    ],
    "variants": [
      {
        "id": "white",
        "name": "White",
        "hex": "#FFFFFF",
        "inStock": true
      }
    ]
  },
  {
    "id": "p06-mi-pro-tws",
    "sku": "P06-MI-COPY-TWS",
    "photoRef": "P06",
    "title": "Pro-Style TWS Earbuds (Mi-Labelled)",
    "titleBn": "প্রো-স্টাইল TWS ইয়ারবাডস (মি-লেবেলযুক্ত)",
    "category": "audio",
    "brand": "Mi-Labelled (Authenticity Unverified)",
    "model": "Pro-Style TWS",
    "badge": "Comparable Copy",
    "price": 399,
    "originalPrice": 550,
    "retailRange": {
      "low": 399,
      "high": 399
    },
    "rating": 4.6,
    "reviewCount": 26,
    "stock": 24,
    "isDevelopmentSeed": true,
    "warranty": "7-Day Replacement Warranty",
    "description": "White stem-style wireless earbuds pictured on orange packaging. Verify the connector and hardware version with the supplier.",
    "descriptionBn": "কমলা বক্সে সাদা স্টেম ডিজাইনের ইয়ারবাড দেখানো আছে। সরবরাহকারীর কাছে কানেক্টর ও হার্ডওয়্যার সংস্করণ যাচাই করুন।",
    "verificationNotes": "Packaging carries Mi branding; authenticity unverified.",
    "verificationNotesBn": "মি লেবেলযুক্ত বক্স; তুলনামূলক স্থানীয় কপি পণ্যের মূল্য।",
    "specs": {
      "Brand": "Mi-Labelled (Authenticity Unverified)",
      "Model": "Pro-Style TWS",
      "PhotoRef": "P06",
      "Packaging": "Orange Signature Box",
      "Connectivity": "Bluetooth Wireless Audio"
    },
    "image": "/assets/products/p06-mi-tws.jpg",
    "gallery": [
      "/assets/products/p06-mi-tws.jpg",
      "/assets/products/p06-mi-pkg.jpg"
    ],
    "compatibleWith": [
      "Xiaomi 14 Ultra",
      "Redmi Note 13 Pro+",
      "Galaxy S24"
    ],
    "variants": [
      {
        "id": "white",
        "name": "White",
        "hex": "#FFFFFF",
        "inStock": true
      }
    ]
  },
  {
    "id": "turbo-single-wall-charger",
    "sku": "P07-OPP-27W-CHG",
    "photoRef": "P07",
    "title": "Compact 2-Pin Wall Charger (OPPO 27W Marked)",
    "titleBn": "কমপ্যাক্ট ২-পিন ওয়াল চার্জার (অপ্পো ২৭ ওয়াট চিহ্নিত)",
    "category": "charging",
    "brand": "OPPO-Marked (Authenticity Unverified)",
    "model": "27W Flash Charge (Marked)",
    "badge": "Fast Charge",
    "price": 250,
    "originalPrice": 380,
    "retailRange": {
      "low": 150,
      "high": 346
    },
    "rating": 4.5,
    "reviewCount": 54,
    "stock": 35,
    "isDevelopmentSeed": true,
    "warranty": "14-Day Replacement Warranty",
    "description": "A compact white wall adapter with a two-pin plug for charging a compatible device through the correct cable. Check the output label and port type before ordering.",
    "descriptionBn": "উপযুক্ত কেবল দিয়ে ডিভাইস চার্জ করার জন্য দুই পিনের সাদা ওয়াল অ্যাডাপ্টার। কেনার আগে আউটপুট রেটিং ও পোর্টের ধরন দেখে নিন।",
    "verificationNotes": "Neither 27W delivery, VOOC support nor original OPPO status is verified. Adapter features standard 2 round pins.",
    "verificationNotesBn": "২৭ ওয়াট ডেলিভারি ও আসল অপ্পো স্ট্যাটাস প্রমাণিত নয়। অ্যাডাপ্টারে ২টি গোলাকার পিন রয়েছে।",
    "specs": {
      "Brand": "OPPO-Marked (Authenticity Unverified)",
      "Model": "27W Flash Charge (Marked)",
      "PhotoRef": "P07",
      "Wall Plug Format": "EU Standard Dual Round Pin Plug",
      "Output Marking": "Printed 27W Flash Charge Label",
      "Color": "Gloss White Flame-Retardant Shell"
    },
    "image": "/assets/products/p07-oppo-style-27w-charger.jpg",
    "gallery": [
      "/assets/products/p07-oppo-style-27w-charger.jpg",
      "/assets/products/p07-oppo-charger-original.jpg",
      "/assets/products/p07-oppo-charger-pins.jpg"
    ],
    "compatibleWith": [
      "Galaxy S24 Ultra",
      "Pixel 8 Pro",
      "Xiaomi 14 Ultra"
    ],
    "variants": [
      {
        "id": "white",
        "name": "White",
        "hex": "#FFFFFF",
        "inStock": true
      }
    ]
  },
  {
    "id": "p08-2in1-otg-adapter",
    "sku": "P08-OTG-2IN1",
    "photoRef": "P08",
    "title": "2-in-1 Type-C & Micro-USB to USB-A OTG Adapter",
    "titleBn": "২-ইন-১ টাইপ-সি ও মাইক্রো-ইউএসবি ওটিজি অ্যাডাপ্টার",
    "category": "charging",
    "brand": "Taher Telecom (Labelled)",
    "model": "2-in-1 OTG Adapter",
    "badge": "Dual OTG",
    "price": 120,
    "originalPrice": 190,
    "retailRange": {
      "low": 70,
      "high": 200
    },
    "rating": 4.8,
    "reviewCount": 89,
    "stock": 60,
    "isDevelopmentSeed": true,
    "warranty": "7-Day Replacement Warranty",
    "description": "A pocket-sized adapter with Type-C and Micro-USB connectors for compatible OTG-enabled devices. Useful for connecting supported USB accessories once your phone's OTG support is confirmed.",
    "descriptionBn": "Type-C ও Micro-USB কানেক্টরসহ ছোট OTG অ্যাডাপ্টার। ফোনে OTG সাপোর্ট থাকলে উপযুক্ত USB অ্যাকসেসরি সংযোগে ব্যবহার করা যায়।",
    "verificationNotes": "Price is per adapter. Taher Telecom packaging is visible. USB 3.0 / 5Gbps performance is not established.",
    "verificationNotesBn": "মূল্য একক অ্যাডাপ্টারের। তাহের টেলিকম প্যাকেজিং দৃশ্যমান।",
    "specs": {
      "Brand": "Taher Telecom (Labelled)",
      "Model": "2-in-1 OTG Adapter",
      "PhotoRef": "P08",
      "Inputs": "USB Type-C Male + Micro-USB Male",
      "Output": "USB 2.0/3.0 Type-A Female Port",
      "Housing": "Anodized Aluminum Alloy Compact Shell"
    },
    "image": "/assets/products/p08-2in1-otg-adapter.jpg",
    "gallery": [
      "/assets/products/p08-2in1-otg-adapter.jpg",
      "/assets/products/p08-otg-card-pkg.jpg",
      "/assets/products/p08-otg-connectors.jpg"
    ],
    "compatibleWith": [
      "Galaxy S24 Ultra",
      "Pixel 8 Pro",
      "Xiaomi 14 Ultra"
    ],
    "variants": [
      {
        "id": "black",
        "name": "Matte Black",
        "hex": "#1E293B",
        "inStock": true
      },
      {
        "id": "silver",
        "name": "Silver Alloy",
        "hex": "#94A3B8",
        "inStock": true
      }
    ]
  },
  {
    "id": "fighter-superbass-headset",
    "sku": "P09-TUC-A5",
    "photoRef": "P09",
    "title": "TUCCI A5 Fighter Stereo Headset with Boom Mic",
    "titleBn": "টুচি এ৫ ফাইটার স্টেরিও হেডসেট বুম মাইকসহ",
    "category": "audio",
    "brand": "TUCCI",
    "model": "A5 Fighter",
    "badge": "Gaming Boom Mic",
    "price": 550,
    "originalPrice": 790,
    "retailRange": {
      "low": 900,
      "high": 900
    },
    "rating": 4.6,
    "reviewCount": 51,
    "stock": 25,
    "isDevelopmentSeed": true,
    "warranty": "30-Day Functional Warranty",
    "description": "An over-ear wired headset with padded earcups, a headband and a boom microphone. The box shows a 3.5mm connection for use with a compatible audio port.",
    "descriptionBn": "প্যাডযুক্ত ইয়ারকাপ ও বুম মাইক্রোফোনসহ ওভার-ইয়ার তারযুক্ত হেডসেট। বক্সে ৩.৫ মিমি কানেকশনের উল্লেখ আছে; ডিভাইসের অডিও পোর্টের সঙ্গে মিলিয়ে নিন।",
    "verificationNotes": "TUCCI A5 Fighter model. Keep distinct from TUCCI Q8 USB model.",
    "verificationNotesBn": "টুচি এ৫ ফাইটার মডেল। টুচি কিউ৮ ইউএসবি মডেল থেকে সম্পূর্ণ আলাদা।",
    "specs": {
      "Brand": "TUCCI",
      "Model": "A5 Fighter",
      "PhotoRef": "P09",
      "Connector": "3.5mm Audio + Mic Combo Jack",
      "Microphone": "Flexible Adjustable Boom Microphone",
      "Ear Cushion": "Padded Circumaural Foam Cushions",
      "Color Scheme": "Black with Bold Red Accents"
    },
    "image": "/assets/products/p09-tucci-a5-fighter-headset.jpg",
    "gallery": [
      "/assets/products/p09-tucci-a5-fighter-headset.jpg",
      "/assets/products/p09-tucci-a5-boom-mic.jpg",
      "/assets/products/p09-tucci-a5-earcup.jpg"
    ],
    "compatibleWith": [
      "Pixel 7a",
      "Galaxy S24 Ultra",
      "Xiaomi 14"
    ],
    "variants": [
      {
        "id": "black-red",
        "name": "Black / Red",
        "hex": "#DC2626",
        "inStock": true
      }
    ]
  },
  {
    "id": "pink-glam-smartwatch",
    "sku": "P10-KW-KW68MINI",
    "photoRef": "P10",
    "title": "KW68 Mini Smartwatch (3+1 Strap Set)",
    "titleBn": "কেডব্লিউ৬৮ মিনি স্মার্টওয়াচ (৩+১ স্ট্র্যাপ সেট)",
    "category": "wearables",
    "brand": "KW",
    "model": "KW68 Mini",
    "badge": "3+1 Straps",
    "price": 790,
    "originalPrice": 1150,
    "retailRange": {
      "low": 680,
      "high": 1061
    },
    "rating": 4.7,
    "reviewCount": 63,
    "stock": 20,
    "isDevelopmentSeed": true,
    "warranty": "30-Day Functional Warranty",
    "description": "A compact square-face smartwatch presented in a pink-themed strap set. Its smaller watch shape suits buyers who prefer a less bulky design; confirm the included straps and phone compatibility.",
    "descriptionBn": "গোলাপি থিমের স্ট্র্যাপ সেটে ছোট আকারের স্কয়ার-ফেস স্মার্টওয়াচ। হালকা ডিজাইন পছন্দ হলে দেখতে পারেন; সঙ্গে কতটি স্ট্র্যাপ আছে ও ফোনে সাপোর্ট করে কি না নিশ্চিত করুন।",
    "verificationNotes": "Box reads KW68 Mini with 3+1 strap presentation pack.",
    "verificationNotesBn": "বক্সে কেডব্লিউ৬৮ মিনি এবং ৩+১ স্ট্র্যাপ সেট প্রদর্শিত।",
    "specs": {
      "Brand": "KW",
      "Model": "KW68 Mini",
      "PhotoRef": "P10",
      "Display": "HD Color Touch Square Screen",
      "Included Straps": "3+1 Multi-Strap Styling Set",
      "Calling Support": "Bluetooth Calling & Notification Sync"
    },
    "image": "/assets/products/p10-kw68-mini-smartwatch.jpg",
    "gallery": [
      "/assets/products/p10-kw68-mini-smartwatch.jpg",
      "/assets/products/p10-kw68-mini-strap-set.jpg",
      "/assets/products/p10-kw68-mini-face.jpg"
    ],
    "compatibleWith": [
      "iPhone 15 Pro",
      "iPhone 15",
      "Galaxy S24",
      "Pixel 8"
    ],
    "variants": [
      {
        "id": "pink",
        "name": "Rose Pink",
        "hex": "#F472B6",
        "inStock": true
      }
    ]
  },
  {
    "id": "y80-ultra-smartwatch",
    "sku": "P11-ULTRA-Y80",
    "photoRef": "P11",
    "title": "Y80 Ultra Smartwatch (8+1 Strap Set)",
    "titleBn": "ওয়াই ৮০ আল্ট্রা স্মার্টওয়াচ (৮+১ স্ট্র্যাপ সেট)",
    "category": "wearables",
    "brand": "Ultra Series",
    "model": "Y80 Ultra",
    "badge": "8+1 Straps",
    "price": 890,
    "originalPrice": 1350,
    "retailRange": {
      "low": 720,
      "high": 2000
    },
    "rating": 4.8,
    "reviewCount": 142,
    "stock": 35,
    "isDevelopmentSeed": true,
    "warranty": "30-Day Functional Warranty",
    "description": "An Ultra-style smartwatch in a strap-set presentation box. A choice for buyers who want to change their watch's look; confirm the strap count and supported calling features.",
    "descriptionBn": "স্ট্র্যাপ সেটের বক্সে আল্ট্রা ডিজাইনের স্মার্টওয়াচ। ঘড়ির লুক বদলাতে পছন্দ হলে দেখতে পারেন; স্ট্র্যাপের সংখ্যা ও কলিং ফিচার আগে নিশ্চিত করুন।",
    "verificationNotes": "Box features 8+1 strap set presentation in vibrant orange box.",
    "verificationNotesBn": "কমলা রিটেইল বক্সে ৮+১ স্ট্র্যাপ সেটসহ আল্ট্রা মডেল।",
    "specs": {
      "Brand": "Ultra Series",
      "Model": "Y80 Ultra",
      "PhotoRef": "P11",
      "Dial Size": "Large 49mm Ultra Alloy Case",
      "Straps Included": "8 Interchangeable Bands + 1 Protective Watch Case",
      "Features": "Bluetooth Calling, Wireless Charging Pad Included"
    },
    "image": "/assets/products/p11-y80-ultra-smartwatch.jpg",
    "gallery": [
      "/assets/products/p11-y80-ultra-smartwatch.jpg",
      "/assets/products/y80-ultra-smartwatch.jpg",
      "/assets/products/p11-y80-ultra-straps.jpg"
    ],
    "compatibleWith": [
      "Galaxy S24 Ultra",
      "iPhone 15 Pro Max",
      "Pixel 8 Pro",
      "Xiaomi 14 Ultra"
    ],
    "variants": [
      {
        "id": "orange-multi",
        "name": "Orange Combo (8 Straps)",
        "hex": "#FB923C",
        "inStock": true
      }
    ]
  },
  {
    "id": "p12-laxasfit-k10-ultra",
    "sku": "P12-LXF-K10U",
    "photoRef": "P12",
    "title": "LAXASFIT K10 Ultra Smartwatch with 2G SIM Slot",
    "titleBn": "ল্যাক্সাসফিট কে১০ আল্ট্রা স্মার্টওয়াচ ২জি সিম স্লটসহ",
    "category": "wearables",
    "brand": "LAXASFIT",
    "model": "K10 Ultra",
    "badge": "SIM Calling",
    "price": 1350,
    "originalPrice": 1750,
    "retailRange": {
      "low": 1250,
      "high": 1682
    },
    "rating": 4.6,
    "reviewCount": 49,
    "stock": 25,
    "isDevelopmentSeed": true,
    "warranty": "30-Day Functional Warranty",
    "description": "An Ultra-style smartwatch marketed with a SIM slot for wrist-based calling. The box identifies 2G support; confirm local SIM operation, charging method and the supplied strap colour.",
    "descriptionBn": "কবজি থেকেই কল করার জন্য সিম স্লটযুক্ত বলে বাজারজাত K10 Ultra স্মার্টওয়াচ। বক্সে 2G লেখা আছে; নিজের সিমে কাজ করে কি না ও চার্জিং পদ্ধতি নিশ্চিত করুন।",
    "verificationNotes": "Package says 2.19-inch and 2G. Local network SIM operation requires manual testing.",
    "verificationNotesBn": "বক্সে ২.১৯ ইঞ্চি এবং ২জি সিম স্লটের বিবরণ মুদ্রিত।",
    "specs": {
      "Brand": "LAXASFIT",
      "Model": "K10 Ultra",
      "PhotoRef": "P12",
      "Screen": "2.19-inch Full Touch Display",
      "Cellular Support": "2G Micro-SIM Card Slot",
      "Calling": "Standalone SIM Calling & Bluetooth Handset Pairing"
    },
    "image": "/assets/products/p12-laxasfit-k10-ultra-sim-watch.jpg",
    "gallery": [
      "/assets/products/p12-laxasfit-k10-ultra-sim-watch.jpg",
      "/assets/products/p12-laxasfit-k10-sim-detail.jpg",
      "/assets/products/p12-laxasfit-k10-dial.jpg"
    ],
    "compatibleWith": [
      "Galaxy S24 Ultra",
      "iPhone 15 Pro",
      "Xiaomi 14 Ultra"
    ],
    "variants": [
      {
        "id": "black",
        "name": "Titanium Black",
        "hex": "#1E293B",
        "inStock": true
      },
      {
        "id": "orange",
        "name": "Ocean Orange",
        "hex": "#FB923C",
        "inStock": true
      }
    ]
  },
  {
    "id": "p13-t800-ultra2-smartwatch",
    "sku": "P13-ULTRA-T800U2",
    "photoRef": "P13",
    "title": "T800 Ultra 2 Smartwatch with Wireless Charging",
    "titleBn": "টি৮০০ আল্ট্রা ২ স্মার্টওয়াচ ওয়্যারলেস চার্জিংসহ",
    "category": "wearables",
    "brand": "Ultra Series",
    "model": "T800 Ultra 2",
    "badge": "Ultra Series",
    "price": 750,
    "originalPrice": 1090,
    "retailRange": {
      "low": 499,
      "high": 1090
    },
    "rating": 4.7,
    "reviewCount": 98,
    "stock": 42,
    "isDevelopmentSeed": true,
    "warranty": "30-Day Functional Warranty",
    "description": "A square-face smartwatch in an Ultra-style design, presented with a dark strap. The model is sold for everyday watch functions and connected-phone features; verify compatibility with your handset.",
    "descriptionBn": "ডার্ক স্ট্র্যাপসহ আল্ট্রা ডিজাইনের স্কয়ার-ফেস স্মার্টওয়াচ। দৈনন্দিন ঘড়ির ব্যবহার ও ফোন-সংযুক্ত ফিচারের জন্য দেখতে পারেন; নিজের ফোনে কাজ করে কি না যাচাই করুন।",
    "verificationNotes": "Complete white T800 Ultra 2 box. Do not advertise medical readings as diagnostic.",
    "verificationNotesBn": "টি৮০০ আল্ট্রা ২ হোয়াইট বক্স সংস্করণ। স্বাস্থ্য ট্র্যাকিং রেফারেন্স ভিত্তিক।",
    "specs": {
      "Brand": "Ultra Series",
      "Model": "T800 Ultra 2",
      "PhotoRef": "P13",
      "Display": "1.99-inch Infinite HD Display",
      "Charging": "Magnetic Wireless Charging Dock",
      "Bluetooth": "Dual-Mode Bluetooth Calling & App Notifications"
    },
    "image": "/assets/products/p13-t800-ultra2-smartwatch.jpg",
    "gallery": [
      "/assets/products/p13-t800-ultra2-smartwatch.jpg",
      "/assets/products/p13-t800-ultra2-dial.jpg",
      "/assets/products/p13-t800-ultra2-specs.jpg"
    ],
    "compatibleWith": [
      "Galaxy S24 Ultra",
      "iPhone 15 Pro",
      "Pixel 8 Pro"
    ],
    "variants": [
      {
        "id": "black",
        "name": "Jet Black",
        "hex": "#1E293B",
        "inStock": true
      },
      {
        "id": "orange",
        "name": "Alpine Orange",
        "hex": "#FB923C",
        "inStock": true
      }
    ]
  },
  {
    "id": "oraimo-or08-wireless-headset",
    "sku": "P14-OR-08-HDST",
    "photoRef": "P14",
    "title": "OR-08 Wireless Over-Ear Headset (Oraimo-Labelled)",
    "titleBn": "ওআর-০৮ ওয়্যারলেস ওভার-ইয়ার হেডসেট (ওরাইমো-লেবেলযুক্ত)",
    "category": "audio",
    "brand": "Oraimo-Labelled (Authenticity Unverified)",
    "model": "OR-08",
    "badge": "Over-Ear Audio",
    "price": 990,
    "originalPrice": 1450,
    "retailRange": {
      "low": 650,
      "high": 1100
    },
    "rating": 4.7,
    "reviewCount": 73,
    "stock": 32,
    "isDevelopmentSeed": true,
    "warranty": "30-Day Functional Warranty",
    "description": "A black wireless headset with cushioned earcups and an adjustable-looking headband. Its simple over-ear form is suitable for a compact everyday audio listing once the exact model is confirmed.",
    "descriptionBn": "কুশনযুক্ত ইয়ারকাপ ও হেডব্যান্ডসহ কালো রঙের ওয়্যারলেস হেডসেট। দৈনন্দিন ব্যবহারের জন্য সরল ওভার-ইয়ার ডিজাইন; কেনার আগে মডেল ও কার্যকর ফিচার নিশ্চিত করুন।",
    "verificationNotes": "P19 is a byte-identical duplicate of P14. Single consolidated listing sharing verified gallery. Authentic oraimo status and 48h claims are unverified.",
    "verificationNotesBn": "P19 এবং P14 হুবহু এক। একটি একক লিস্টিংয়ে একত্রিত করা হয়েছে।",
    "specs": {
      "Brand": "Oraimo-Labelled (Authenticity Unverified)",
      "Model": "OR-08",
      "PhotoRef": "P14, P19",
      "Acoustic Architecture": "40mm Dynamic Stereo Drivers",
      "Ear Cushions": "Memory Foam Soft Protein Leather",
      "Connectivity": "Wireless Bluetooth + 3.5mm Aux Wired Input Backup"
    },
    "image": "/assets/products/p14-oraimo-or08-headset.jpg",
    "gallery": [
      "/assets/products/p14-oraimo-or08-headset.jpg",
      "/assets/products/oraimo-or08-headset.jpg",
      "/assets/products/p14-oraimo-or08-earcup.jpg"
    ],
    "compatibleWith": [
      "Galaxy S24 Ultra",
      "iPhone 15 Pro",
      "Pixel 8 Pro",
      "Xiaomi 14"
    ],
    "variants": [
      {
        "id": "black",
        "name": "Matte Black",
        "hex": "#1E293B",
        "inStock": true
      }
    ]
  },
  {
    "id": "luminous-sa-rgb-headphones",
    "sku": "P15-LUM-SAN002",
    "photoRef": "P15",
    "title": "SAN-002 Luminous Wireless Headphones",
    "titleBn": "এসএএন-০০২ লুমিনাস ওয়্যারলেস হেডফোন",
    "category": "audio",
    "brand": "Luminous",
    "model": "SAN-002",
    "badge": "Luminous Glow",
    "price": 790,
    "originalPrice": 1100,
    "retailRange": {
      "low": 700,
      "high": 1200
    },
    "rating": 4.6,
    "reviewCount": 44,
    "stock": 25,
    "isDevelopmentSeed": true,
    "warranty": "30-Day Functional Warranty",
    "description": "Red-and-black over-ear wireless headphones with padded earcups and decorative light detailing shown on the box. Confirm the available colour and lighting behaviour on the supplied unit.",
    "descriptionBn": "প্যাডযুক্ত ইয়ারকাপসহ লাল-কালো ওভার-ইয়ার ওয়্যারলেস হেডফোন। বক্সে আলোর সাজ দেখানো আছে; পণ্যের রং ও আলো কীভাবে কাজ করে তা দেখে নিন।",
    "verificationNotes": "Model reads SAN-002 with oval red earcup padding and luminous LED effects.",
    "verificationNotesBn": "মডেল এসএএন-০০২; ডিম্বাকৃতির লাল ইয়ারপ্যাড ও এলইডি আলোকসজ্জা।",
    "specs": {
      "Brand": "Luminous",
      "Model": "SAN-002",
      "PhotoRef": "P15",
      "Lighting": "Decorative Dynamic LED Glow Ring",
      "Ear Cushion": "Oval Ergonomic Red Accent Cushioning",
      "Connectivity": "Bluetooth Wireless + TF Card MP3 Slot"
    },
    "image": "/assets/products/p15-san002-luminous-headphones.jpg",
    "gallery": [
      "/assets/products/p15-san002-luminous-headphones.jpg",
      "/assets/products/p15-san002-pkg.jpg",
      "/assets/products/p15-san002-earcup-detail.jpg"
    ],
    "compatibleWith": [
      "Galaxy S24",
      "iPhone 15",
      "Xiaomi 14"
    ],
    "variants": [
      {
        "id": "red-black",
        "name": "Red / Black",
        "hex": "#DC2626",
        "inStock": true
      }
    ]
  },
  {
    "id": "p16-ankeer-nk-ny200-headphones",
    "sku": "P16-ANK-NY200",
    "photoRef": "P16",
    "title": "ANKEER NK-NY200 Wireless Over-Ear Headphones",
    "titleBn": "আংকির এনকে-এনওয়াই২০০ ওয়্যারলেস ওভার-ইয়ার হেডফোন",
    "category": "audio",
    "brand": "ANKEER",
    "model": "NK-NY200",
    "badge": "Over-Ear Audio",
    "price": 780,
    "originalPrice": 1100,
    "retailRange": {
      "low": 680,
      "high": 1351
    },
    "rating": 4.6,
    "reviewCount": 39,
    "stock": 26,
    "isDevelopmentSeed": true,
    "warranty": "30-Day Functional Warranty",
    "description": "Black over-ear wireless headphones with cushioned earcups and a padded headband. The NK-NY200 design offers a simple everyday listening format with the model clearly identified on its box.",
    "descriptionBn": "প্যাডযুক্ত হেডব্যান্ড ও কুশন ইয়ারকাপসহ কালো ওভার-ইয়ার ওয়্যারলেস হেডফোন। NK-NY200 মডেলের সহজ ডিজাইন দৈনন্দিন গান ও ভিডিও শোনার জন্য উপযোগী।",
    "verificationNotes": "ANKEER is the printed name; preserve spelling accurately without renaming to Anker or Soundcore.",
    "verificationNotesBn": "বক্সে মুদ্রিত বানান ANKEER। অ্যাংকার বা সাউন্ডকোর নামে পরিবর্তন করা যাবে না।",
    "specs": {
      "Brand": "ANKEER",
      "Model": "NK-NY200",
      "PhotoRef": "P16",
      "Form Factor": "Padded Headband Over-Ear Headphone",
      "Connectivity": "Bluetooth Wireless Audio",
      "Controls": "Integrated Volume & Track Controls"
    },
    "image": "/assets/products/p16-ankeer-nk-ny200-headphones.jpg",
    "gallery": [
      "/assets/products/p16-ankeer-nk-ny200-headphones.jpg",
      "/assets/products/p16-ankeer-nk-ny200-pkg.jpg",
      "/assets/products/p16-ankeer-nk-ny200-earcup.jpg"
    ],
    "compatibleWith": [
      "Galaxy S24 Ultra",
      "iPhone 15 Pro",
      "Pixel 8 Pro"
    ],
    "variants": [
      {
        "id": "black",
        "name": "Classic Black",
        "hex": "#1E293B",
        "inStock": true
      }
    ]
  },
  {
    "id": "q8-usb-callcenter-headset",
    "sku": "P17-TUC-Q8USB",
    "photoRef": "P17",
    "title": "TUCCI Q8 USB PC Headset with Clear-Voice Mic",
    "titleBn": "টুচি কিউ৮ ইউএসবি পিসি হেডসেট নয়েজ-ক্যানসেলিং মাইকসহ",
    "category": "audio",
    "brand": "TUCCI",
    "model": "Q8",
    "badge": "USB Dedicated",
    "price": 750,
    "originalPrice": 990,
    "retailRange": {
      "low": 600,
      "high": 1000
    },
    "rating": 4.7,
    "reviewCount": 47,
    "stock": 24,
    "isDevelopmentSeed": true,
    "warranty": "30-Day Functional Warranty",
    "description": "A black wired headset with a boom microphone, padded earcups and USB connection stated on the box. Intended for use with a compatible computer or USB audio device.",
    "descriptionBn": "বুম মাইক ও প্যাডযুক্ত ইয়ারকাপসহ কালো তারযুক্ত হেডসেট। বক্সে USB কানেকশন লেখা আছে; উপযুক্ত কম্পিউটার বা USB অডিও ডিভাইসে ব্যবহারের আগে সাপোর্ট মিলিয়ে নিন।",
    "verificationNotes": "TUCCI Q8 USB model with dedicated USB plug. Keep separate from TUCCI A5 3.5mm headset.",
    "verificationNotesBn": "টুচি কিউ৮ ইউএসবি প্লাগযুক্ত কম্পিউটার হেডসেট। এ৫ ফাইটার মডেল থেকে পৃথক।",
    "specs": {
      "Brand": "TUCCI",
      "Model": "Q8",
      "PhotoRef": "P17",
      "Audio Interface": "Digital USB-A Plug & Play Audio",
      "Microphone": "Omnidirectional Noise-Reducing Boom Mic",
      "Inline Controller": "Volume Up/Down + Quick Mute Toggle"
    },
    "image": "/assets/products/p17-tucci-q8-usb-headset.jpg",
    "gallery": [
      "/assets/products/p17-tucci-q8-usb-headset.jpg",
      "/assets/products/p17-tucci-q8-pkg.jpg",
      "/assets/products/p17-tucci-q8-mic.jpg"
    ],
    "compatibleWith": [
      "Pixel 8 Pro",
      "Galaxy S24 Ultra",
      "Xiaomi 14 Ultra"
    ],
    "variants": [
      {
        "id": "black",
        "name": "Matte Black",
        "hex": "#1E293B",
        "inStock": true
      }
    ]
  },
  {
    "id": "p18-t9-luminous-headphones",
    "sku": "P18-LUM-T9",
    "photoRef": "P18",
    "title": "T9 Luminous Wireless Headphones (Gold Accent)",
    "titleBn": "টি৯ লুমিনাস ওয়্যারলেস হেডফোন (গোল্ড অ্যাকসেন্ট)",
    "category": "audio",
    "brand": "Luminous",
    "model": "T9",
    "badge": "Gold Accented",
    "price": 649,
    "originalPrice": 890,
    "retailRange": {
      "low": 649,
      "high": 649
    },
    "rating": 4.6,
    "reviewCount": 31,
    "stock": 20,
    "isDevelopmentSeed": true,
    "warranty": "30-Day Functional Warranty",
    "description": "Over-ear wireless headphones with padded earcups and circular decorative panels. The T9 label and illuminated-style artwork distinguish this version from the other headphones in the photos.",
    "descriptionBn": "প্যাডযুক্ত ইয়ারকাপ ও গোলাকার সাজযুক্ত ওভার-ইয়ার ওয়্যারলেস হেডফোন। T9 লেবেল ও আলোকসজ্জার ডিজাইন এই সংস্করণকে অন্য হেডফোন থেকে আলাদা করে।",
    "verificationNotes": "Model is T9 with round earcup panels and gold accents. Do not mix with SAN-002.",
    "verificationNotesBn": "মডেল টি৯; গোলাকার গোল্ড অ্যাকসেন্ট প্যানেলযুক্ত।",
    "specs": {
      "Brand": "Luminous",
      "Model": "T9",
      "PhotoRef": "P18",
      "Styling": "Circular Gold-Tone Decorative Panels",
      "Connectivity": "Bluetooth Wireless Audio + TF Card Slot",
      "Hinges": "Foldable Space-Saving Headband"
    },
    "image": "/assets/products/p18-t9-luminous-headphones.jpg",
    "gallery": [
      "/assets/products/p18-t9-luminous-headphones.jpg",
      "/assets/products/p18-t9-luminous-pkg.jpg",
      "/assets/products/p18-t9-luminous-earcup.jpg"
    ],
    "compatibleWith": [
      "Galaxy S24 Ultra",
      "iPhone 15 Pro",
      "Xiaomi 14"
    ],
    "variants": [
      {
        "id": "black-gold",
        "name": "Black / Gold",
        "hex": "#D97706",
        "inStock": true
      }
    ]
  },
  {
    "id": "recrsi-4in1-65w-cable",
    "sku": "P20-RCR-4IN1",
    "photoRef": "P20",
    "title": "RECRSI 4-in-1 Fast Charging & Data Cable",
    "titleBn": "রেকর্সি ৪-ইন-১ ফাস্ট চার্জিং ও ডেটা কেবল",
    "category": "charging",
    "brand": "RECRSI",
    "model": "4-in-1 Fast Cable",
    "badge": "4-in-1 Versatile",
    "price": 420,
    "originalPrice": 650,
    "retailRange": {
      "low": 390,
      "high": 790
    },
    "rating": 4.8,
    "reviewCount": 115,
    "stock": 48,
    "isDevelopmentSeed": true,
    "warranty": "30-Day Functional Warranty",
    "description": "A multi-connector cable shown with switchable USB-A/USB-C input and Type-C/Lightning output options. A convenient format for carrying fewer separate cables when your devices use different ports.",
    "descriptionBn": "USB-A/USB-C ইনপুট ও Type-C/Lightning আউটপুট বদলানোর সুবিধাসহ মাল্টি-কানেক্টর কেবল। ভিন্ন পোর্টের ডিভাইস ব্যবহার করলে একাধিক আলাদা কেবল বহনের প্রয়োজন কমাতে পারে।",
    "verificationNotes": "Cable features switchable modular connector combinations. It does not provide 4 simultaneous outputs.",
    "verificationNotesBn": "সুইচযোগ্য ইনপুট/আউটপুট কম্বিনেশন; একসাথে চারটি আউটপুট কেবল নয়।",
    "specs": {
      "Brand": "RECRSI",
      "Model": "4-in-1 Fast Cable",
      "PhotoRef": "P20",
      "Input Interfaces": "Convertible USB-A / Type-C Input",
      "Output Interfaces": "Convertible USB-C / Lightning Output",
      "Material": "Reinforced High-Density Nylon Braided Jacket",
      "Connectors": "Gold-Tone Metallic Housings"
    },
    "image": "/assets/products/p20-recrsi-4in1-cable.jpg",
    "gallery": [
      "/assets/products/p20-recrsi-4in1-cable.jpg",
      "/assets/products/recrsi-4in1-65w-cable.jpg",
      "/assets/products/p20-recrsi-4in1-connectors.jpg"
    ],
    "compatibleWith": [
      "iPhone 15 Pro Max",
      "iPhone 14 Pro",
      "Galaxy S24 Ultra",
      "Pixel 8 Pro",
      "Xiaomi 14 Ultra"
    ],
    "variants": [
      {
        "id": "gold-black",
        "name": "Gold / Black Braided",
        "hex": "#D97706",
        "inStock": true
      }
    ]
  },
  {
    "id": "p22-hoco-bt-diamond-700h",
    "sku": "P22-HOC-BTDIA",
    "photoRef": "P22",
    "title": "Hoco BT Diamond Wireless Neckband (700H Mark)",
    "titleBn": "হোকো বিটি ডায়মন্ড ওয়্যারলেস নেকব্যান্ড (৭০০ ঘণ্টা চিহ্নিত)",
    "category": "audio",
    "brand": "Hoco-Labelled (Authenticity Unverified)",
    "model": "BT Diamond 700H",
    "badge": "Sports Neckband",
    "price": 790,
    "originalPrice": 1100,
    "retailRange": {
      "low": 790,
      "high": 790
    },
    "rating": 4.6,
    "reviewCount": 43,
    "stock": 25,
    "isDevelopmentSeed": true,
    "warranty": "30-Day Functional Warranty",
    "description": "A neckband-style wireless earphone shown with in-ear tips and side controls. Its BT Diamond-labelled packaging identifies the version; check calling performance and the actual battery runtime.",
    "descriptionBn": "ইন-ইয়ার টিপস ও পাশে কন্ট্রোলসহ নেকব্যান্ড ওয়্যারলেস ইয়ারফোন। BT Diamond লেবেলের সংস্করণটি কেনার আগে কলের মান ও বাস্তব ব্যাটারি ব্যাকআপ পরীক্ষা করুন।",
    "verificationNotes": "700H is a packaging claim, not tested continuous playback. Authentic Hoco status unverified.",
    "verificationNotesBn": "৭০০ ঘণ্টা প্যাকেজিংয়ের দাবি; পরীক্ষিত নয়। আসল হোকো স্ট্যাটাস যাচাইাধীন।",
    "specs": {
      "Brand": "Hoco-Labelled (Authenticity Unverified)",
      "Model": "BT Diamond 700H",
      "PhotoRef": "P22",
      "Form": "Ergonomic Sports Neckband",
      "Earpieces": "Magnetic Snap Metal Shells",
      "Controls": "Side 3-Button Controller"
    },
    "image": "/assets/products/p22-hoco-bt-diamond-700h.jpg",
    "gallery": [
      "/assets/products/p22-hoco-bt-diamond-700h.jpg",
      "/assets/products/p22-hoco-bt-diamond-pkg.jpg",
      "/assets/products/p22-hoco-bt-diamond-controls.jpg"
    ],
    "compatibleWith": [
      "Galaxy S24 Ultra",
      "iPhone 15 Pro",
      "Xiaomi 14"
    ],
    "variants": [
      {
        "id": "black",
        "name": "Midnight Black",
        "hex": "#1E293B",
        "inStock": true
      }
    ]
  },
  {
    "id": "p23-vdenmenv-d50l-lightning",
    "sku": "P23-VDM-D50L",
    "photoRef": "P23",
    "title": "VDENMENV D50L 2.4A Lightning Cable (1m)",
    "titleBn": "ভিডেনমেনভ ডি৫০এল ২.৪এ লাইটনিং কেবল (১ মিটার)",
    "category": "charging",
    "brand": "VDENMENV",
    "model": "D50L",
    "badge": "Lightning 2.4A",
    "price": 150,
    "originalPrice": 220,
    "retailRange": {
      "low": 100,
      "high": 200
    },
    "rating": 4.7,
    "reviewCount": 58,
    "stock": 35,
    "isDevelopmentSeed": true,
    "warranty": "30-Day Functional Warranty",
    "description": "A one-metre USB-A to Lightning cable, marked 2.4A on the box, for compatible Lightning devices. Confirm charging and data support.",
    "descriptionBn": "উপযুক্ত Lightning ডিভাইসের জন্য এক মিটার USB-A থেকে Lightning কেবল। বক্সে 2.4A লেখা আছে; চার্জিং ও ডেটা সাপোর্ট মিলিয়ে নিন।",
    "verificationNotes": "D50L is a dedicated Lightning cable in purple packaging. Kept separate from D50T Type-C.",
    "verificationNotesBn": "D50L বেগুনি প্যাকেটের ডেডিকেটেড লাইটনিং কেবল। D50T টাইপ-সি থেকে পৃথক।",
    "specs": {
      "Brand": "VDENMENV",
      "Model": "D50L",
      "PhotoRef": "P23",
      "Connectors": "USB-A Male to Lightning (Apple 8-Pin) Male",
      "Current Rating": "2.4A Fast Charge & Data Sync",
      "Length": "1.0 Meter",
      "Packaging": "Signature Purple VDENMENV Box"
    },
    "image": "/assets/products/p23-vdenmenv-d50l-lightning.jpg",
    "gallery": [
      "/assets/products/p23-vdenmenv-d50l-lightning.jpg",
      "/assets/products/p23-vdenmenv-d50l-pkg.jpg",
      "/assets/products/p23-vdenmenv-d50l-connector.jpg"
    ],
    "compatibleWith": [
      "iPhone 14 Pro Max",
      "iPhone 14 Pro",
      "iPhone 13 Pro"
    ],
    "variants": [
      {
        "id": "white",
        "name": "White",
        "hex": "#FFFFFF",
        "inStock": true
      }
    ]
  },
  {
    "id": "p23-vdenmenv-d50t-typec",
    "sku": "P23-VDM-D50T",
    "photoRef": "P23",
    "title": "VDENMENV D50T 2.4A Type-C Cable (1m)",
    "titleBn": "ভিডেনমেনভ ডি৫০টি ২.৪এ টাইপ-সি কেবল (১ মিটার)",
    "category": "charging",
    "brand": "VDENMENV",
    "model": "D50T",
    "badge": "Type-C 2.4A",
    "price": 140,
    "originalPrice": 200,
    "retailRange": {
      "low": 140,
      "high": 140
    },
    "rating": 4.7,
    "reviewCount": 61,
    "stock": 38,
    "isDevelopmentSeed": true,
    "warranty": "30-Day Functional Warranty",
    "description": "A one-metre USB-A to Type-C cable for charging and syncing compatible devices. The box and seller listing specify a 2.4A rating.",
    "descriptionBn": "উপযুক্ত ডিভাইসে চার্জিং ও ডেটা সিঙ্কের জন্য এক মিটার USB-A থেকে Type-C কেবল। বক্স ও বিক্রেতার তালিকায় 2.4A রেটিং উল্লেখ আছে।",
    "verificationNotes": "D50T is a dedicated Type-C cable in blue packaging. Kept separate from D50L Lightning.",
    "verificationNotesBn": "D50T নীল প্যাকেটের ডেডিকেটেড টাইপ-সি কেবল। D50L লাইটনিং থেকে সম্পূর্ণ আলাদা।",
    "specs": {
      "Brand": "VDENMENV",
      "Model": "D50T",
      "PhotoRef": "P23",
      "Connectors": "USB-A Male to Type-C Male",
      "Current Rating": "2.4A Fast Charge & Data Sync",
      "Length": "1.0 Meter",
      "Packaging": "Signature Blue VDENMENV Box"
    },
    "image": "/assets/products/p23-vdenmenv-d50t-typec.jpg",
    "gallery": [
      "/assets/products/p23-vdenmenv-d50t-typec.jpg",
      "/assets/products/p23-vdenmenv-d50t-pkg.jpg",
      "/assets/products/p23-vdenmenv-d50t-connector.jpg"
    ],
    "compatibleWith": [
      "Galaxy S24 Ultra",
      "Pixel 8 Pro",
      "Xiaomi 14 Ultra",
      "iPhone 15 Pro Max"
    ],
    "variants": [
      {
        "id": "white",
        "name": "White",
        "hex": "#FFFFFF",
        "inStock": true
      }
    ]
  },
  {
    "id": "p25-pro-tws-black",
    "sku": "P25-ANC-PRO-BLK",
    "photoRef": "P25",
    "title": "Pro-Style Black Wireless Earbuds (H2 Sticker)",
    "titleBn": "প্রো-স্টাইল কালো ওয়্যারলেস ইয়ারবাড (H2 স্টিকার)",
    "category": "audio",
    "brand": "Unbranded (Apple-Style Labelled)",
    "model": "Pro-style Black TWS (H2 Sticker)",
    "badge": "Comparable Copy",
    "price": 750,
    "originalPrice": 1150,
    "retailRange": {
      "low": 650,
      "high": 1150
    },
    "rating": 4.6,
    "reviewCount": 57,
    "stock": 30,
    "isDevelopmentSeed": true,
    "warranty": "7-Day Replacement Warranty",
    "description": "Black in-ear wireless earbuds shown in a compact stem design with silicone-style tips. A dark-colour option for everyday audio; confirm the charging case and device pairing before ordering.",
    "descriptionBn": "সিলিকন ধরনের টিপস ও ছোট স্টেম ডিজাইনের কালো ওয়্যারলেস ইয়ারবাড। ডার্ক রং পছন্দ হলে দেখতে পারেন; চার্জিং কেস ও ফোনে পেয়ারিং আগে নিশ্চিত করুন।",
    "verificationNotes": "H2 and 100% ANC stickers do not verify genuine ANC chipset. Comparable copy listing; do not label as genuine Apple AirPods.",
    "verificationNotesBn": "H2 এবং ১০০% এএনসি স্টিকারযুক্ত কালো প্রো-স্টাইল কপি ইয়ারবাড।",
    "specs": {
      "Brand": "Unbranded (Apple-Style Labelled)",
      "Model": "Pro-style Black TWS (H2 Sticker)",
      "PhotoRef": "P25",
      "Finish": "Deep Midnight Matte Black Shell",
      "Tips": "Ergonomic Silicone Ear Tips Included",
      "Connectivity": "Bluetooth Wireless Audio"
    },
    "image": "/assets/products/p25-pro-tws-black.jpg",
    "gallery": [
      "/assets/products/p25-pro-tws-black.jpg",
      "/assets/products/p25-pro-tws-black-pkg.jpg",
      "/assets/products/p25-pro-tws-black-detail.jpg"
    ],
    "compatibleWith": [
      "Galaxy S24 Ultra",
      "iPhone 15 Pro",
      "Pixel 8 Pro"
    ],
    "variants": [
      {
        "id": "black",
        "name": "Midnight Black",
        "hex": "#1E293B",
        "inStock": true
      }
    ]
  },
  {
    "id": "in-ear-bass-wired-earphones",
    "sku": "P26-DON-X20",
    "photoRef": "P26",
    "title": "DON-X20 In-Ear Wired Earphones with Mic (Angled 3.5mm)",
    "titleBn": "ডন-এক্স২০ ইন-ইয়ার তারযুক্ত ইয়ারফোন মাইক্রোফোনসহ",
    "category": "audio",
    "brand": "DON",
    "model": "DON-X20",
    "badge": "Angled Jack",
    "price": 150,
    "originalPrice": 220,
    "retailRange": {
      "low": 100,
      "high": 250
    },
    "rating": 4.6,
    "reviewCount": 72,
    "stock": 45,
    "isDevelopmentSeed": true,
    "warranty": "7-Day Replacement Warranty",
    "description": "DON-X20 in-ear wired earphones are shown with silicone-style tips and an angled 3.5mm plug. Other earphone boxes on the shelf are listed separately.",
    "descriptionBn": "ছবির মূল পণ্য DON-X20 তারযুক্ত ইন-ইয়ার ইয়ারফোন, সঙ্গে সিলিকন ধরনের টিপস ও বাঁকানো ৩.৫ মিমি প্লাগ।",
    "verificationNotes": "DON-X20 model with angled 3.5mm plug. Keep distinct from other shelf boxes (SF30, SH-777, KIN).",
    "verificationNotesBn": "বাঁকানো ৩.৫ মিমি প্লাগযুক্ত DON-X20 মডেল। তাকের অন্যান্য মডেল থেকে পৃথক।",
    "specs": {
      "Brand": "DON",
      "Model": "DON-X20",
      "PhotoRef": "P26",
      "Plug Type": "90-Degree Ergonomic L-Shaped 3.5mm Audio Jack",
      "Eartips": "Soft Silicone Noise-Isolating Ear Tips",
      "Controls": "In-Line High-Def Voice Microphone"
    },
    "image": "/assets/products/p26-don-x20-earphones.jpg",
    "gallery": [
      "/assets/products/p26-don-x20-earphones.jpg",
      "/assets/products/p26-don-x20-pkg.jpg",
      "/assets/products/p26-don-x20-plug.jpg"
    ],
    "compatibleWith": [
      "Pixel 7a",
      "Galaxy S24",
      "Xiaomi 14"
    ],
    "variants": [
      {
        "id": "black",
        "name": "Black",
        "hex": "#1E293B",
        "inStock": true
      }
    ]
  },
  {
    "id": "p26-sh777-earphones",
    "sku": "P26-SH-777",
    "photoRef": "P26",
    "title": "SH-777 4-in-1 Stereo Wired Earphones",
    "titleBn": "এসএইচ-৭৭৭ ৪-ইন-১ স্টেরিও তারযুক্ত ইয়ারফোন",
    "category": "audio",
    "brand": "SH",
    "model": "SH-777",
    "badge": "Stereo Wired",
    "price": 180,
    "originalPrice": 260,
    "retailRange": {
      "low": 150,
      "high": 300
    },
    "rating": 4.5,
    "reviewCount": 28,
    "stock": 30,
    "isDevelopmentSeed": true,
    "warranty": "7-Day Replacement Warranty",
    "description": "White-and-blue wired earphones with an inline control are pictured on the SH-777 box. Confirmed model from shelf stock.",
    "descriptionBn": "SH-777 বক্সে ইনলাইন কন্ট্রোলসহ সাদা-নীল তারযুক্ত ইয়ারফোন দেখানো আছে।",
    "verificationNotes": "SH-777 4-in-1 stereo wired earphones from shelf inventory.",
    "verificationNotesBn": "তাকের ইনভেন্টরি থেকে নিশ্চিত SH-777 মডেল।",
    "specs": {
      "Brand": "SH",
      "Model": "SH-777",
      "PhotoRef": "P26",
      "Connector": "3.5mm Stereo Audio Jack",
      "Cable": "1.2m Tangle-Free Cable"
    },
    "image": "/assets/products/p26-sh777-earphones.jpg",
    "gallery": [
      "/assets/products/p26-sh777-earphones.jpg",
      "/assets/products/p26-sh777-pkg.jpg"
    ],
    "compatibleWith": [
      "Pixel 7a",
      "Galaxy S24",
      "Xiaomi 14"
    ],
    "variants": [
      {
        "id": "white-blue",
        "name": "White / Blue",
        "hex": "#0284C7",
        "inStock": true
      }
    ]
  },
  {
    "id": "p26-kin-earphones",
    "sku": "P26-KIN-BASS",
    "photoRef": "P26",
    "title": "KIN Heavy Bass Wired In-Ear Earphones",
    "titleBn": "কিন হেভি বাস তারযুক্ত ইন-ইয়ার ইয়ারফোন",
    "category": "audio",
    "brand": "KIN",
    "model": "KIN Heavy Bass",
    "badge": "Heavy Bass",
    "price": 140,
    "originalPrice": 200,
    "retailRange": {
      "low": 100,
      "high": 200
    },
    "rating": 4.5,
    "reviewCount": 32,
    "stock": 35,
    "isDevelopmentSeed": true,
    "warranty": "7-Day Replacement Warranty",
    "description": "KIN-labelled wired earphones with heavy bass tuning and inline remote.",
    "descriptionBn": "কালো ও গোলাপি প্যাকেটে KIN লেবেলের তারযুক্ত ইয়ারফোন।",
    "verificationNotes": "KIN wired earphones from shelf stock.",
    "verificationNotesBn": "তাকের স্টক থেকে কেআইএন ইয়ারফোন।",
    "specs": {
      "Brand": "KIN",
      "Model": "KIN Heavy Bass",
      "PhotoRef": "P26",
      "Connector": "3.5mm Audio Jack",
      "Features": "Enhanced Low-Frequency Bass Response"
    },
    "image": "/assets/products/p26-kin-earphones.jpg",
    "gallery": [
      "/assets/products/p26-kin-earphones.jpg",
      "/assets/products/p26-kin-pkg.jpg"
    ],
    "compatibleWith": [
      "Galaxy S24",
      "Pixel 7a",
      "Xiaomi 14"
    ],
    "variants": [
      {
        "id": "black",
        "name": "Black",
        "hex": "#1E293B",
        "inStock": true
      }
    ]
  },
  {
    "id": "p26-sf30-earphones",
    "sku": "P26-SF-SF30",
    "photoRef": "P26",
    "title": "SF30 In-Ear Wired Earphones with Mic",
    "titleBn": "এসএফ৩০ ইন-ইয়ার তারযুক্ত ইয়ারফোন মাইকসহ",
    "category": "audio",
    "brand": "SF",
    "model": "SF30",
    "badge": "Everyday Audio",
    "price": 140,
    "originalPrice": 200,
    "retailRange": {
      "low": 100,
      "high": 250
    },
    "rating": 4.5,
    "reviewCount": 21,
    "stock": 25,
    "isDevelopmentSeed": true,
    "warranty": "7-Day Replacement Warranty",
    "description": "A wired-earphone box marked SF30 on the upper shelf. Designed for everyday listening with compatible 3.5mm devices.",
    "descriptionBn": "উপরের তাকে SF30 লেখা ইয়ারফোনের বক্স। দৈনন্দিন ব্যবহারের জন্য ৩.৫ মিমি কানেক্টরযুক্ত।",
    "verificationNotes": "SF30 model identified from shelf inventory.",
    "verificationNotesBn": "তাকের স্টক থেকে চিহ্নিত এসএফ৩০ মডেল।",
    "specs": {
      "Brand": "SF",
      "Model": "SF30",
      "PhotoRef": "P26",
      "Connector": "3.5mm Audio Plug",
      "Microphone": "In-line Clear Mic"
    },
    "image": "/assets/products/p26-sf30-earphones.jpg",
    "gallery": [
      "/assets/products/p26-sf30-earphones.jpg",
      "/assets/products/p26-sf30-pkg.jpg"
    ],
    "compatibleWith": [
      "Galaxy S24",
      "Pixel 7a",
      "Xiaomi 14"
    ],
    "variants": [
      {
        "id": "white",
        "name": "White",
        "hex": "#FFFFFF",
        "inStock": true
      }
    ]
  }
];

export const FEATURED_BUNDLES = [
  {
    id: "bundle-entry-audio-charge",
    title: "Essential Audio & 65W Fast Charge Combo",
    titleBn: "অ্যাসেনশিয়াল অডিও ও ৬৫ ওয়াট ফাস্ট চার্জ কম্বো",
    subtitle: "Pro-Style White TWS + SM 007 Wireless Neckband + RECRSI 4-in-1 Cable",
    subtitleBn: "প্রো-স্টাইল সাদা TWS + এসএম ০০৭ ওয়্যারলেস নেকব্যান্ড + রেকর্সি ৪-ইন-১ ক্যাবল",
    badge: "Free Delivery Unlocked",
    badgeBn: "ফ্রি ডেলিভারি আনলকড",
    price: 2060,
    originalPrice: 2850,
    savings: 790,
    freeDelivery: true,
    image: "/assets/products/p01-pro-tws-white.jpg",
    itemIds: [
      "h2-anc-pro-tws",
      "sm-neckband-007",
      "recrsi-4in1-65w-cable"
    ],
    itemsSummary: "Pro-Style White TWS (৳1,190) + SM 007 Neckband (৳450) + RECRSI 4-in-1 Cable (৳420) = ৳2,060"
  },
  {
    id: "bundle-smartwatch-dual-audio",
    title: "Smartwatch & Dual Audio Master Pack",
    titleBn: "স্মার্টওয়াচ ও ডুয়াল অডিও মাস্টার প্যাক",
    subtitle: "Y80 Ultra Watch (8+1 Straps) + Oraimo Wireless Headset + OnePlus-Style TWS",
    subtitleBn: "ওয়াই ৮০ আল্ট্রা ওয়াচ (৮+১ স্ট্র্যাপ) + ওরাইমো ওয়্যারলেস হেডসেট + ওয়ানপ্লাস-স্টাইল TWS",
    badge: "Popular Value",
    badgeBn: "জনপ্রিয় ভ্যালু ডিল",
    price: 2530,
    originalPrice: 3700,
    savings: 1170,
    freeDelivery: true,
    image: "/assets/products/p11-y80-ultra-smartwatch.jpg",
    itemIds: [
      "y80-ultra-smartwatch",
      "oraimo-or08-wireless-headset",
      "p06-oneplus-pro-tws"
    ],
    itemsSummary: "Y80 Ultra Watch (৳890) + Oraimo Headset (৳990) + OnePlus-Style TWS (৳650) = ৳2,530"
  },
  {
    id: "bundle-executive-wearables-charge",
    title: "Executive Dual Wearables & Power Pack",
    titleBn: "এক্সিকিউটিভ ডুয়াল স্মার্টওয়াচ ও পাওয়ার প্যাক",
    subtitle: "LAXASFIT K10 Ultra SIM Watch + KW68 Mini Watch + RECRSI Cable + 20W Charger",
    subtitleBn: "ল্যাক্সাসফিট কে১০ আল্ট্রা সিম ওয়াচ + কেডব্লিউ৬৮ মিনি ওয়াচ + রেকর্সি ক্যাবল + ২০ ওয়াট চার্জার",
    badge: "Couples & Executive",
    badgeBn: "কাপলস ও এক্সিকিউটিভ স্পেশাল",
    price: 2810,
    originalPrice: 3930,
    savings: 1120,
    freeDelivery: true,
    image: "/assets/products/p12-laxasfit-k10-ultra-sim-watch.jpg",
    itemIds: [
      "p12-laxasfit-k10-ultra",
      "pink-glam-smartwatch",
      "recrsi-4in1-65w-cable",
      "turbo-single-wall-charger"
    ],
    itemsSummary: "K10 Ultra SIM Watch (৳1,350) + KW68 Mini Watch (৳790) + RECRSI Cable (৳420) + 20W Charger (৳250) = ৳2,810"
  },
  {
    id: "bundle-audiophile-studio-suite",
    title: "Audiophile Studio & Gaming Suite",
    titleBn: "অডিওফাইল স্টুডিও ও গেমিং প্রিমিয়াম স্যুট",
    subtitle: "Pro ANC TWS + Oraimo Headset + SAN-002 RGB Headphones + TUCCI A5 Fighter",
    subtitleBn: "প্রো এএনসি TWS + ওরাইমো হেডসেট + এসএএন-০০২ আরজিবি হেডফোন + টুচি এ৫ ফাইটার",
    badge: "Ultimate Sound",
    badgeBn: "আল্টিমেট সাউন্ড সেটআপ",
    price: 3520,
    originalPrice: 4890,
    savings: 1370,
    freeDelivery: true,
    image: "/assets/products/p14-oraimo-or08-headset.jpg",
    itemIds: [
      "h2-anc-pro-tws",
      "oraimo-or08-wireless-headset",
      "luminous-sa-rgb-headphones",
      "fighter-superbass-headset"
    ],
    itemsSummary: "Pro White TWS (৳1,190) + Oraimo Headset (৳990) + SAN-002 RGB Headphones (৳790) + A5 Fighter (৳550) = ৳3,520"
  }
];
