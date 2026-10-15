import json
import os

catalog_js_path = r'c:\Users\Tonmoy\Documents\Tech\src\data\catalog.js'
items_json_path = r'C:\Users\Tonmoy\.gemini\antigravity-ide\brain\e2ddf528-0465-4c06-a9e9-8565e1f4ee88\scratch\new_catalog_items.json'

with open(items_json_path, 'r', encoding='utf-8') as f:
    authentic_items = json.load(f)

# Read the top of catalog.js up to line 375 (the initial flagship cases & accessories)
with open(catalog_js_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find where 'y80-ultra-smartwatch' starts (line 376)
cutoff_idx = -1
for i, line in enumerate(lines):
    if 'id: "y80-ultra-smartwatch"' in line or 'id: \'y80-ultra-smartwatch\'' in line:
        # Step back to the opening brace of this object
        for j in range(i, max(0, i-5), -1):
            if lines[j].strip().startswith('{'):
                cutoff_idx = j
                break
        break

if cutoff_idx == -1:
    print("Could not find cutoff index, please check manually.")
    exit(1)

header_code = "".join(lines[:cutoff_idx])

# Format authentic items into JS objects
items_code_list = []
for item in authentic_items:
    js_str = json.dumps(item, ensure_ascii=False, indent=4)
    # indent by 4 spaces
    indented = "\n".join("    " + line for line in js_str.split("\n"))
    # remove leading 4 spaces of first line if needed, or let it format
    items_code_list.append(indented.strip())

# Bundles
bundles_code = """
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
"""

# Combine all
full_catalog = header_code + ",\n  " + ",\n  ".join(items_code_list) + "\n];\n" + bundles_code

with open(catalog_js_path, 'w', encoding='utf-8') as f:
    f.write(full_catalog)

print("catalog.js successfully updated with all 29 authentic items and bundles!")
