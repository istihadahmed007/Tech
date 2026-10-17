import json
import os

manifest = {
  "metadata": {
    "version": "1.0.0",
    "lastUpdated": "2026-10-17T18:45:00+06:00",
    "description": "Image-source manifest linking every catalog product to its verified image assets, provenance, and matching status."
  },
  "images": [
    {
      "filename": "h2-anc-pro-tws.jpg",
      "path": "/assets/products/h2-anc-pro-tws.jpg",
      "productId": "h2-anc-pro-tws",
      "photoRef": "P01",
      "role": "main",
      "type": "studio_product",
      "verificationStatus": "verified",
      "notes": "Clean white in-ear wireless earbuds and charging case on light studio background."
    },
    {
      "filename": "p01-pro-tws-white.jpg",
      "path": "/assets/products/p01-pro-tws-white.jpg",
      "productId": "h2-anc-pro-tws",
      "photoRef": "P01",
      "role": "gallery",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "Authentic packaging crop from P01 reference showing H2 / ANC sticker claims."
    },
    {
      "filename": "p01-pro-tws-box-alt.jpg",
      "path": "/assets/products/p01-pro-tws-box-alt.jpg",
      "productId": "h2-anc-pro-tws",
      "photoRef": "P01",
      "role": "gallery",
      "type": "packaging_side",
      "verificationStatus": "verified",
      "notes": "Alternative package view from P01 photo."
    },
    {
      "filename": "p01-pro-tws-stem-detail.jpg",
      "path": "/assets/products/p01-pro-tws-stem-detail.jpg",
      "productId": "h2-anc-pro-tws",
      "photoRef": "P01",
      "role": "gallery",
      "type": "detail_closeup",
      "verificationStatus": "verified",
      "notes": "Close-up detail of compact stem and silicone ear-tip."
    },
    {
      "filename": "p02-remax-rc155a-cable.jpg",
      "path": "/assets/products/p02-remax-rc155a-cable.jpg",
      "productId": "remax-rc155a-120w-cable",
      "photoRef": "P02, P21",
      "role": "main",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "High-clarity packaging front from P21 reference showing REMAX RC-155a artwork."
    },
    {
      "filename": "p02-remax-rc155a-pkg-p02.jpg",
      "path": "/assets/products/p02-remax-rc155a-pkg-p02.jpg",
      "productId": "remax-rc155a-120w-cable",
      "photoRef": "P02",
      "role": "gallery",
      "type": "packaging_alternate",
      "verificationStatus": "verified",
      "notes": "Full box package photograph from P02 reference."
    },
    {
      "filename": "p02-remax-rc155a-connector-detail.jpg",
      "path": "/assets/products/p02-remax-rc155a-connector-detail.jpg",
      "productId": "remax-rc155a-120w-cable",
      "photoRef": "P21",
      "role": "gallery",
      "type": "connector_detail",
      "verificationStatus": "verified",
      "notes": "Close-up of gold-plated USB-A and Type-C connector sleeves."
    },
    {
      "filename": "p03-sm007-neckband.jpg",
      "path": "/assets/products/p03-sm007-neckband.jpg",
      "productId": "sm-neckband-007",
      "photoRef": "P03",
      "role": "main",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "Isolate green-and-white SM 007 box from P03 reference."
    },
    {
      "filename": "sm-neckband-007.jpg",
      "path": "/assets/products/sm-neckband-007.jpg",
      "productId": "sm-neckband-007",
      "photoRef": "P03",
      "role": "gallery",
      "type": "studio_product",
      "verificationStatus": "verified",
      "notes": "Studio product view of black wireless neckband."
    },
    {
      "filename": "p03-sm007-controller.jpg",
      "path": "/assets/products/p03-sm007-controller.jpg",
      "productId": "sm-neckband-007",
      "photoRef": "P03",
      "role": "gallery",
      "type": "detail_closeup",
      "verificationStatus": "verified",
      "notes": "Controller buttons and earpiece detail from P03."
    },
    {
      "filename": "p04-ultrapods-pro-all.jpg",
      "path": "/assets/products/p04-ultrapods-pro-all.jpg",
      "productId": "p04-ultrapods-pro-tws",
      "photoRef": "P04",
      "role": "main",
      "type": "variant_group",
      "verificationStatus": "verified",
      "notes": "All 4 color variants displayed in transparent charging cases."
    },
    {
      "filename": "p04-ultrapods-pro-blue.jpg",
      "path": "/assets/products/p04-ultrapods-pro-blue.jpg",
      "productId": "p04-ultrapods-pro-tws",
      "photoRef": "P04",
      "role": "gallery",
      "type": "variant_color",
      "verificationStatus": "verified",
      "notes": "Blue color variant in transparent case with LED battery indicator."
    },
    {
      "filename": "p04-ultrapods-pro-green.jpg",
      "path": "/assets/products/p04-ultrapods-pro-green.jpg",
      "productId": "p04-ultrapods-pro-tws",
      "photoRef": "P04",
      "role": "gallery",
      "type": "variant_color",
      "verificationStatus": "verified",
      "notes": "Green color variant in transparent case."
    },
    {
      "filename": "p04-ultrapods-pro-pink.jpg",
      "path": "/assets/products/p04-ultrapods-pro-pink.jpg",
      "productId": "p04-ultrapods-pro-tws",
      "photoRef": "P04",
      "role": "gallery",
      "type": "variant_color",
      "verificationStatus": "verified",
      "notes": "Pink color variant in transparent case."
    },
    {
      "filename": "p04-ultrapods-pro-black.jpg",
      "path": "/assets/products/p04-ultrapods-pro-black.jpg",
      "productId": "p04-ultrapods-pro-tws",
      "photoRef": "P04",
      "role": "gallery",
      "type": "variant_color",
      "verificationStatus": "verified",
      "notes": "Black color variant in transparent case."
    },
    {
      "filename": "p05-vdenmenv-dr06-earphones.jpg",
      "path": "/assets/products/p05-vdenmenv-dr06-earphones.jpg",
      "productId": "p05-vdenmenv-dr06-earphones",
      "photoRef": "P05, P23",
      "role": "main",
      "type": "studio_product",
      "verificationStatus": "verified",
      "sourceUrl": "https://static-01.daraz.lk/p/295f97163391f0a3d02bb4d178429abe.jpg",
      "notes": "Verified Daraz listing studio image for VDENMENV DR06."
    },
    {
      "filename": "p05-vdenmenv-dr06-pkg-p05.jpg",
      "path": "/assets/products/p05-vdenmenv-dr06-pkg-p05.jpg",
      "productId": "p05-vdenmenv-dr06-earphones",
      "photoRef": "P05",
      "role": "gallery",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "Turquoise DR06 box isolated from P05 reference."
    },
    {
      "filename": "p23-vdenmenv-dr06.jpg",
      "path": "/assets/products/p23-vdenmenv-dr06.jpg",
      "productId": "p05-vdenmenv-dr06-earphones",
      "photoRef": "P23",
      "role": "gallery",
      "type": "packaging_alternate",
      "verificationStatus": "verified",
      "notes": "Turquoise DR06 box isolated from P23 reference."
    },
    {
      "filename": "p05-vdenmenv-dr06-inline-mic.jpg",
      "path": "/assets/products/p05-vdenmenv-dr06-inline-mic.jpg",
      "productId": "p05-vdenmenv-dr06-earphones",
      "photoRef": "P05",
      "role": "gallery",
      "type": "detail_closeup",
      "verificationStatus": "verified",
      "notes": "Inline mic and call control detail."
    },
    {
      "filename": "p06-samsung-tws.jpg",
      "path": "/assets/products/p06-samsung-tws.jpg",
      "productId": "p06-samsung-pro-tws",
      "photoRef": "P06",
      "role": "main",
      "type": "studio_product",
      "verificationStatus": "verified",
      "notes": "Studio earbuds on clean white background."
    },
    {
      "filename": "p06-samsung-pkg.jpg",
      "path": "/assets/products/p06-samsung-pkg.jpg",
      "productId": "p06-samsung-pro-tws",
      "photoRef": "P06",
      "role": "gallery",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "Isolated Samsung-labelled box from P06 reference."
    },
    {
      "filename": "p06-realme-tws.jpg",
      "path": "/assets/products/p06-realme-tws.jpg",
      "productId": "p06-realme-pro-tws",
      "photoRef": "P06",
      "role": "main",
      "type": "studio_product",
      "verificationStatus": "verified",
      "sourceUrl": "https://static-01.daraz.com.bd/p/06a2466dbf6d6abdce35900bbb317d6f.png",
      "notes": "Clean studio product asset for realme-labelled earbuds."
    },
    {
      "filename": "p06-realme-pkg.jpg",
      "path": "/assets/products/p06-realme-pkg.jpg",
      "productId": "p06-realme-pro-tws",
      "photoRef": "P06",
      "role": "gallery",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "Isolated yellow/white realme-labelled box from P06 reference."
    },
    {
      "filename": "p06-oneplus-tws.jpg",
      "path": "/assets/products/p06-oneplus-tws.jpg",
      "productId": "p06-oneplus-pro-tws",
      "photoRef": "P06",
      "role": "main",
      "type": "studio_product",
      "verificationStatus": "verified",
      "sourceUrl": "https://img.drz.lazcdn.com/static/bd/p/2353b2ec0e9a9ff1fc6e9fefb71c9576.jpg",
      "notes": "Studio product asset for OnePlus-labelled copy earbuds."
    },
    {
      "filename": "p06-oneplus-pkg.jpg",
      "path": "/assets/products/p06-oneplus-pkg.jpg",
      "productId": "p06-oneplus-pro-tws",
      "photoRef": "P06",
      "role": "gallery",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "Isolated OnePlus-labelled box from P06 reference."
    },
    {
      "filename": "p06-lenovo-tws.jpg",
      "path": "/assets/products/p06-lenovo-tws.jpg",
      "productId": "p06-lenovo-pro-tws",
      "photoRef": "P06",
      "role": "main",
      "type": "studio_product",
      "verificationStatus": "verified",
      "sourceUrl": "https://static-01.daraz.com.bd/p/13f4cacbb87f4413ee48f59b0902a723.jpg",
      "notes": "Studio product asset for Lenovo-labelled TWS earbuds."
    },
    {
      "filename": "p06-lenovo-pkg.jpg",
      "path": "/assets/products/p06-lenovo-pkg.jpg",
      "productId": "p06-lenovo-pro-tws",
      "photoRef": "P06",
      "role": "gallery",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "Isolated Lenovo-labelled box from P06 reference."
    },
    {
      "filename": "p06-oppo-tws.jpg",
      "path": "/assets/products/p06-oppo-tws.jpg",
      "productId": "p06-oppo-pro-tws",
      "photoRef": "P06",
      "role": "main",
      "type": "studio_product",
      "verificationStatus": "verified",
      "notes": "Studio product asset for OPPO-labelled TWS earbuds."
    },
    {
      "filename": "p06-oppo-pkg.jpg",
      "path": "/assets/products/p06-oppo-pkg.jpg",
      "productId": "p06-oppo-pro-tws",
      "photoRef": "P06",
      "role": "gallery",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "Isolated green OPPO-labelled box from P06 reference."
    },
    {
      "filename": "p06-mi-tws.jpg",
      "path": "/assets/products/p06-mi-tws.jpg",
      "productId": "p06-mi-pro-tws",
      "photoRef": "P06",
      "role": "main",
      "type": "studio_product",
      "verificationStatus": "verified",
      "notes": "Studio product asset for Mi-labelled TWS earbuds."
    },
    {
      "filename": "p06-mi-pkg.jpg",
      "path": "/assets/products/p06-mi-pkg.jpg",
      "productId": "p06-mi-pro-tws",
      "photoRef": "P06",
      "role": "gallery",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "Isolated orange Mi-labelled box from P06 reference."
    },
    {
      "filename": "p07-oppo-style-27w-charger.jpg",
      "path": "/assets/products/p07-oppo-style-27w-charger.jpg",
      "productId": "turbo-single-wall-charger",
      "photoRef": "P07",
      "role": "main",
      "type": "studio_product",
      "verificationStatus": "verified",
      "sourceUrl": "https://bd-live-21.slatic.net/kf/S830c442af0264db4b3cd67ea154f659fb.jpg",
      "notes": "Verified studio image of 2-pin wall charger adapter."
    },
    {
      "filename": "p07-oppo-charger-original.jpg",
      "path": "/assets/products/p07-oppo-charger-original.jpg",
      "productId": "turbo-single-wall-charger",
      "photoRef": "P07",
      "role": "gallery",
      "type": "packaging_alternate",
      "verificationStatus": "verified",
      "notes": "Original adapter isolated from P07 photo."
    },
    {
      "filename": "p07-oppo-charger-pins.jpg",
      "path": "/assets/products/p07-oppo-charger-pins.jpg",
      "productId": "turbo-single-wall-charger",
      "photoRef": "P07",
      "role": "gallery",
      "type": "connector_detail",
      "verificationStatus": "verified",
      "notes": "Close-up of the two round wall pins."
    },
    {
      "filename": "p08-2in1-otg-adapter.jpg",
      "path": "/assets/products/p08-2in1-otg-adapter.jpg",
      "productId": "p08-2in1-otg-adapter",
      "photoRef": "P08",
      "role": "main",
      "type": "studio_product",
      "verificationStatus": "verified",
      "sourceUrl": "https://static-01.daraz.com.bd/p/375b017a56204f6d61d99d2bb6430617.jpg",
      "notes": "Verified 2-in-1 Type-C and Micro-USB OTG adapter."
    },
    {
      "filename": "p08-otg-card-pkg.jpg",
      "path": "/assets/products/p08-otg-card-pkg.jpg",
      "productId": "p08-2in1-otg-adapter",
      "photoRef": "P08",
      "role": "gallery",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "Taher Telecom display card from P08 photo."
    },
    {
      "filename": "p08-otg-connectors.jpg",
      "path": "/assets/products/p08-otg-connectors.jpg",
      "productId": "p08-2in1-otg-adapter",
      "photoRef": "P08",
      "role": "gallery",
      "type": "connector_detail",
      "verificationStatus": "verified",
      "notes": "Dual connector tip close-up."
    },
    {
      "filename": "p09-tucci-a5-fighter-headset.jpg",
      "path": "/assets/products/p09-tucci-a5-fighter-headset.jpg",
      "productId": "fighter-superbass-headset",
      "photoRef": "P09",
      "role": "main",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "Authentic packaging & headset from P09 reference."
    },
    {
      "filename": "p09-tucci-a5-boom-mic.jpg",
      "path": "/assets/products/p09-tucci-a5-boom-mic.jpg",
      "productId": "fighter-superbass-headset",
      "photoRef": "P09",
      "role": "gallery",
      "type": "detail_closeup",
      "verificationStatus": "verified",
      "notes": "Boom microphone and padded earcups close-up."
    },
    {
      "filename": "p09-tucci-a5-earcup.jpg",
      "path": "/assets/products/p09-tucci-a5-earcup.jpg",
      "productId": "fighter-superbass-headset",
      "photoRef": "P09",
      "role": "gallery",
      "type": "detail_closeup",
      "verificationStatus": "verified",
      "notes": "Side earcup styling and red accent detail."
    },
    {
      "filename": "p10-kw68-mini-smartwatch.jpg",
      "path": "/assets/products/p10-kw68-mini-smartwatch.jpg",
      "productId": "pink-glam-smartwatch",
      "photoRef": "P10",
      "role": "main",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "Upright KW68 Mini packaging from P10 reference."
    },
    {
      "filename": "p10-kw68-mini-strap-set.jpg",
      "path": "/assets/products/p10-kw68-mini-strap-set.jpg",
      "productId": "pink-glam-smartwatch",
      "photoRef": "P10",
      "role": "gallery",
      "type": "detail_closeup",
      "verificationStatus": "verified",
      "notes": "Close-up of 3+1 pink strap set."
    },
    {
      "filename": "p10-kw68-mini-face.jpg",
      "path": "/assets/products/p10-kw68-mini-face.jpg",
      "productId": "pink-glam-smartwatch",
      "photoRef": "P10",
      "role": "gallery",
      "type": "detail_closeup",
      "verificationStatus": "verified",
      "notes": "Square watch face and floral gift-box artwork."
    },
    {
      "filename": "p11-y80-ultra-smartwatch.jpg",
      "path": "/assets/products/p11-y80-ultra-smartwatch.jpg",
      "productId": "y80-ultra-smartwatch",
      "photoRef": "P11",
      "role": "main",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "Orange Y80 Ultra box from P11 reference."
    },
    {
      "filename": "y80-ultra-smartwatch.jpg",
      "path": "/assets/products/y80-ultra-smartwatch.jpg",
      "productId": "y80-ultra-smartwatch",
      "photoRef": "P11",
      "role": "gallery",
      "type": "studio_product",
      "verificationStatus": "verified",
      "notes": "Studio product view of Y80 Ultra watch face and orange strap."
    },
    {
      "filename": "p11-y80-ultra-straps.jpg",
      "path": "/assets/products/p11-y80-ultra-straps.jpg",
      "productId": "y80-ultra-smartwatch",
      "photoRef": "P11",
      "role": "gallery",
      "type": "detail_closeup",
      "verificationStatus": "verified",
      "notes": "8+1 strap set layout."
    },
    {
      "filename": "p12-laxasfit-k10-ultra-sim-watch.jpg",
      "path": "/assets/products/p12-laxasfit-k10-ultra-sim-watch.jpg",
      "productId": "p12-laxasfit-k10-ultra",
      "photoRef": "P12",
      "role": "main",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "LAXASFIT K10 Ultra packaging from P12 reference."
    },
    {
      "filename": "p12-laxasfit-k10-sim-detail.jpg",
      "path": "/assets/products/p12-laxasfit-k10-sim-detail.jpg",
      "productId": "p12-laxasfit-k10-ultra",
      "photoRef": "P12",
      "role": "gallery",
      "type": "detail_closeup",
      "verificationStatus": "verified",
      "notes": "SIM card calling slot detail."
    },
    {
      "filename": "p12-laxasfit-k10-dial.jpg",
      "path": "/assets/products/p12-laxasfit-k10-dial.jpg",
      "productId": "p12-laxasfit-k10-ultra",
      "photoRef": "P12",
      "role": "gallery",
      "type": "detail_closeup",
      "verificationStatus": "verified",
      "notes": "Dial and 2.19-inch screen graphic."
    },
    {
      "filename": "p13-t800-ultra2-smartwatch.jpg",
      "path": "/assets/products/p13-t800-ultra2-smartwatch.jpg",
      "productId": "p13-t800-ultra2-smartwatch",
      "photoRef": "P13",
      "role": "main",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "Complete white T800 Ultra 2 box from P13 reference."
    },
    {
      "filename": "p13-t800-ultra2-dial.jpg",
      "path": "/assets/products/p13-t800-ultra2-dial.jpg",
      "productId": "p13-t800-ultra2-smartwatch",
      "photoRef": "P13",
      "role": "gallery",
      "type": "detail_closeup",
      "verificationStatus": "verified",
      "notes": "T800 Ultra 2 watch screen and dial graphic."
    },
    {
      "filename": "p13-t800-ultra2-specs.jpg",
      "path": "/assets/products/p13-t800-ultra2-specs.jpg",
      "productId": "p13-t800-ultra2-smartwatch",
      "photoRef": "P13",
      "role": "gallery",
      "type": "detail_closeup",
      "verificationStatus": "verified",
      "notes": "Wireless charging and hardware feature marks."
    },
    {
      "filename": "p14-oraimo-or08-headset.jpg",
      "path": "/assets/products/p14-oraimo-or08-headset.jpg",
      "productId": "oraimo-or08-wireless-headset",
      "photoRef": "P14, P19",
      "role": "main",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "Green packaging from P14 / P19 (duplicate) reference."
    },
    {
      "filename": "oraimo-or08-headset.jpg",
      "path": "/assets/products/oraimo-or08-headset.jpg",
      "productId": "oraimo-or08-wireless-headset",
      "photoRef": "P14, P19",
      "role": "gallery",
      "type": "studio_product",
      "verificationStatus": "verified",
      "notes": "Black wireless over-ear headset studio shot."
    },
    {
      "filename": "p14-oraimo-or08-earcup.jpg",
      "path": "/assets/products/p14-oraimo-or08-earcup.jpg",
      "productId": "oraimo-or08-wireless-headset",
      "photoRef": "P14, P19",
      "role": "gallery",
      "type": "detail_closeup",
      "verificationStatus": "verified",
      "notes": "Close-up of cushioned earcups and side buttons."
    },
    {
      "filename": "p15-san002-luminous-headphones.jpg",
      "path": "/assets/products/p15-san002-luminous-headphones.jpg",
      "productId": "luminous-sa-rgb-headphones",
      "photoRef": "P15",
      "role": "main",
      "type": "studio_product",
      "verificationStatus": "verified",
      "sourceUrl": "https://static-01.daraz.com.bd/p/6e82b024bd24dcb097d04a5fdaf54b84.jpg",
      "notes": "Verified studio image of SAN-002 Luminous wireless headphones."
    },
    {
      "filename": "p15-san002-pkg.jpg",
      "path": "/assets/products/p15-san002-pkg.jpg",
      "productId": "luminous-sa-rgb-headphones",
      "photoRef": "P15",
      "role": "gallery",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "Isolated SAN-002 packaging from P15 reference."
    },
    {
      "filename": "p15-san002-earcup-detail.jpg",
      "path": "/assets/products/p15-san002-earcup-detail.jpg",
      "productId": "luminous-sa-rgb-headphones",
      "photoRef": "P15",
      "role": "gallery",
      "type": "detail_closeup",
      "verificationStatus": "verified",
      "notes": "Oval red padded earcup with decorative luminous lighting."
    },
    {
      "filename": "p16-ankeer-nk-ny200-headphones.jpg",
      "path": "/assets/products/p16-ankeer-nk-ny200-headphones.jpg",
      "productId": "p16-ankeer-nk-ny200-headphones",
      "photoRef": "P16",
      "role": "main",
      "type": "studio_product",
      "verificationStatus": "verified",
      "sourceUrl": "https://bd-live-21.slatic.net/kf/Sb691bb73052f4efaa89416fe1d207fdeO.jpg",
      "notes": "Verified studio image of ANKEER NK-NY200 wireless headphones."
    },
    {
      "filename": "p16-ankeer-nk-ny200-pkg.jpg",
      "path": "/assets/products/p16-ankeer-nk-ny200-pkg.jpg",
      "productId": "p16-ankeer-nk-ny200-headphones",
      "photoRef": "P16",
      "role": "gallery",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "Isolated ANKEER NK-NY200 box from P16 reference."
    },
    {
      "filename": "p16-ankeer-nk-ny200-earcup.jpg",
      "path": "/assets/products/p16-ankeer-nk-ny200-earcup.jpg",
      "productId": "p16-ankeer-nk-ny200-headphones",
      "photoRef": "P16",
      "role": "gallery",
      "type": "detail_closeup",
      "verificationStatus": "verified",
      "notes": "Padded headband and cushioned earcup detail."
    },
    {
      "filename": "p17-tucci-q8-usb-headset.jpg",
      "path": "/assets/products/p17-tucci-q8-usb-headset.jpg",
      "productId": "q8-usb-callcenter-headset",
      "photoRef": "P17",
      "role": "main",
      "type": "studio_product",
      "verificationStatus": "verified",
      "sourceUrl": "https://static-01.daraz.com.bd/p/bc468961d8d898a3d4580e0c1a7a1411.jpg",
      "notes": "Verified studio image of TUCCI Q8 USB headset with boom microphone."
    },
    {
      "filename": "p17-tucci-q8-pkg.jpg",
      "path": "/assets/products/p17-tucci-q8-pkg.jpg",
      "productId": "q8-usb-callcenter-headset",
      "photoRef": "P17",
      "role": "gallery",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "Isolated Q8 USB box from P17 reference."
    },
    {
      "filename": "p17-tucci-q8-mic.jpg",
      "path": "/assets/products/p17-tucci-q8-mic.jpg",
      "productId": "q8-usb-callcenter-headset",
      "photoRef": "P17",
      "role": "gallery",
      "type": "detail_closeup",
      "verificationStatus": "verified",
      "notes": "Microphone arm and USB connector detail."
    },
    {
      "filename": "p18-t9-luminous-headphones.jpg",
      "path": "/assets/products/p18-t9-luminous-headphones.jpg",
      "productId": "p18-t9-luminous-headphones",
      "photoRef": "P18",
      "role": "main",
      "type": "studio_product",
      "verificationStatus": "verified",
      "sourceUrl": "https://static-01.daraz.com.bd/p/d4b6075c7a99eb83b50d1cc3462ae594.png",
      "notes": "Verified studio image of T9 Luminous wireless headphones."
    },
    {
      "filename": "p18-t9-luminous-pkg.jpg",
      "path": "/assets/products/p18-t9-luminous-pkg.jpg",
      "productId": "p18-t9-luminous-headphones",
      "photoRef": "P18",
      "role": "gallery",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "Isolated T9 box from P18 reference."
    },
    {
      "filename": "p18-t9-luminous-earcup.jpg",
      "path": "/assets/products/p18-t9-luminous-earcup.jpg",
      "productId": "p18-t9-luminous-headphones",
      "photoRef": "P18",
      "role": "gallery",
      "type": "detail_closeup",
      "verificationStatus": "verified",
      "notes": "Gold circular earcup panels and folding headband."
    },
    {
      "filename": "p20-recrsi-4in1-cable.jpg",
      "path": "/assets/products/p20-recrsi-4in1-cable.jpg",
      "productId": "recrsi-4in1-65w-cable",
      "photoRef": "P20",
      "role": "main",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "RECRSI 4-in-1 cable box from P20 reference."
    },
    {
      "filename": "recrsi-4in1-65w-cable.jpg",
      "path": "/assets/products/recrsi-4in1-65w-cable.jpg",
      "productId": "recrsi-4in1-65w-cable",
      "photoRef": "P20",
      "role": "gallery",
      "type": "studio_product",
      "verificationStatus": "verified",
      "notes": "Studio product view of switchable multi-tip braided cable."
    },
    {
      "filename": "p20-recrsi-4in1-connectors.jpg",
      "path": "/assets/products/p20-recrsi-4in1-connectors.jpg",
      "productId": "recrsi-4in1-65w-cable",
      "photoRef": "P20",
      "role": "gallery",
      "type": "connector_detail",
      "verificationStatus": "verified",
      "notes": "Gold-accented USB-A, USB-C and Lightning connector sleeves."
    },
    {
      "filename": "p22-hoco-bt-diamond-700h.jpg",
      "path": "/assets/products/p22-hoco-bt-diamond-700h.jpg",
      "productId": "p22-hoco-bt-diamond-700h",
      "photoRef": "P22",
      "role": "main",
      "type": "studio_product",
      "verificationStatus": "verified",
      "sourceUrl": "https://static-01.daraz.com.bd/p/3a8e6357985094efd43d727f5719a6f7.png",
      "notes": "Verified studio image of Hoco BT Diamond wireless neckband."
    },
    {
      "filename": "p22-hoco-bt-diamond-pkg.jpg",
      "path": "/assets/products/p22-hoco-bt-diamond-pkg.jpg",
      "productId": "p22-hoco-bt-diamond-700h",
      "photoRef": "P22",
      "role": "gallery",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "Orange/white BT Diamond box from P22 reference."
    },
    {
      "filename": "p22-hoco-bt-diamond-controls.jpg",
      "path": "/assets/products/p22-hoco-bt-diamond-controls.jpg",
      "productId": "p22-hoco-bt-diamond-700h",
      "photoRef": "P22",
      "role": "gallery",
      "type": "detail_closeup",
      "verificationStatus": "verified",
      "notes": "Magnetic earbuds and neckband volume buttons."
    },
    {
      "filename": "p23-vdenmenv-d50l-lightning.jpg",
      "path": "/assets/products/p23-vdenmenv-d50l-lightning.jpg",
      "productId": "p23-vdenmenv-d50l-lightning",
      "photoRef": "P23",
      "role": "main",
      "type": "studio_product",
      "verificationStatus": "verified",
      "sourceUrl": "https://static-01.daraz.com.bd/p/9e78af6ca2450c7ee191d6028d90069f.jpg",
      "notes": "Verified studio image of VDENMENV D50L 2.4A Lightning cable."
    },
    {
      "filename": "p23-vdenmenv-d50l-pkg.jpg",
      "path": "/assets/products/p23-vdenmenv-d50l-pkg.jpg",
      "productId": "p23-vdenmenv-d50l-lightning",
      "photoRef": "P23",
      "role": "gallery",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "Purple D50L box isolated from P23 reference."
    },
    {
      "filename": "p23-vdenmenv-d50l-connector.jpg",
      "path": "/assets/products/p23-vdenmenv-d50l-connector.jpg",
      "productId": "p23-vdenmenv-d50l-lightning",
      "photoRef": "P23",
      "role": "gallery",
      "type": "connector_detail",
      "verificationStatus": "verified",
      "notes": "Lightning (Apple 8-pin) connector detail."
    },
    {
      "filename": "p23-vdenmenv-d50t-typec.jpg",
      "path": "/assets/products/p23-vdenmenv-d50t-typec.jpg",
      "productId": "p23-vdenmenv-d50t-typec",
      "photoRef": "P23",
      "role": "main",
      "type": "studio_product",
      "verificationStatus": "verified",
      "sourceUrl": "https://img.drz.lazcdn.com/static/bd/p/d9c9b7f27f23fc0db072cb2ea84b0393.png",
      "notes": "Verified studio image of VDENMENV D50T 2.4A Type-C cable."
    },
    {
      "filename": "p23-vdenmenv-d50t-pkg.jpg",
      "path": "/assets/products/p23-vdenmenv-d50t-pkg.jpg",
      "productId": "p23-vdenmenv-d50t-typec",
      "photoRef": "P23",
      "role": "gallery",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "Blue D50T box isolated from P23 reference."
    },
    {
      "filename": "p23-vdenmenv-d50t-connector.jpg",
      "path": "/assets/products/p23-vdenmenv-d50t-connector.jpg",
      "productId": "p23-vdenmenv-d50t-typec",
      "photoRef": "P23",
      "role": "gallery",
      "type": "connector_detail",
      "verificationStatus": "verified",
      "notes": "Reversible USB-C connector detail."
    },
    {
      "filename": "p25-pro-tws-black.jpg",
      "path": "/assets/products/p25-pro-tws-black.jpg",
      "productId": "p25-pro-tws-black",
      "photoRef": "P25",
      "role": "main",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "Black Pro-style TWS earbuds packaging from P25 reference."
    },
    {
      "filename": "p25-pro-tws-black-pkg.jpg",
      "path": "/assets/products/p25-pro-tws-black-pkg.jpg",
      "productId": "p25-pro-tws-black",
      "photoRef": "P25",
      "role": "gallery",
      "type": "packaging_alternate",
      "verificationStatus": "verified",
      "notes": "Black earbud packaging with H2 / 100% ANC sticker marks."
    },
    {
      "filename": "p25-pro-tws-black-detail.jpg",
      "path": "/assets/products/p25-pro-tws-black-detail.jpg",
      "productId": "p25-pro-tws-black",
      "photoRef": "P25",
      "role": "gallery",
      "type": "detail_closeup",
      "verificationStatus": "verified",
      "notes": "Black earbud silicone tips and stem detail."
    },
    {
      "filename": "p26-don-x20-earphones.jpg",
      "path": "/assets/products/p26-don-x20-earphones.jpg",
      "productId": "in-ear-bass-wired-earphones",
      "photoRef": "P26",
      "role": "main",
      "type": "studio_product",
      "verificationStatus": "verified",
      "sourceUrl": "https://bd-live-21.slatic.net/kf/Sb643eb93b06e47ccbb4cd4ff3c2ecae40.jpg",
      "notes": "Verified studio image of DON-X20 in-ear wired earphones."
    },
    {
      "filename": "p26-don-x20-pkg.jpg",
      "path": "/assets/products/p26-don-x20-pkg.jpg",
      "productId": "in-ear-bass-wired-earphones",
      "photoRef": "P26",
      "role": "gallery",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "Single DON-X20 box isolated from shelf in P26 reference."
    },
    {
      "filename": "p26-don-x20-plug.jpg",
      "path": "/assets/products/p26-don-x20-plug.jpg",
      "productId": "in-ear-bass-wired-earphones",
      "photoRef": "P26",
      "role": "gallery",
      "type": "connector_detail",
      "verificationStatus": "verified",
      "notes": "Angled 3.5mm audio jack and inline microphone detail."
    },
    {
      "filename": "p26-sh777-earphones.jpg",
      "path": "/assets/products/p26-sh777-earphones.jpg",
      "productId": "p26-sh777-earphones",
      "photoRef": "P26",
      "role": "main",
      "type": "studio_product",
      "verificationStatus": "verified",
      "sourceUrl": "https://static-01.daraz.com.bd/p/673190433111fed69f89579efe023bcd.jpg",
      "notes": "Verified studio image of SH-777 4-in-1 stereo wired earphones."
    },
    {
      "filename": "p26-sh777-pkg.jpg",
      "path": "/assets/products/p26-sh777-pkg.jpg",
      "productId": "p26-sh777-earphones",
      "photoRef": "P26",
      "role": "gallery",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "SH-777 box isolated from P26 shelf photo."
    },
    {
      "filename": "p26-kin-earphones.jpg",
      "path": "/assets/products/p26-kin-earphones.jpg",
      "productId": "p26-kin-earphones",
      "photoRef": "P26",
      "role": "main",
      "type": "studio_product",
      "verificationStatus": "verified",
      "sourceUrl": "https://static-01.daraz.com.bd/p/275d89ee4073bb3e5fef9ac84f069fe3.jpg",
      "notes": "Verified studio image of KIN wired in-ear earphones."
    },
    {
      "filename": "p26-kin-pkg.jpg",
      "path": "/assets/products/p26-kin-pkg.jpg",
      "productId": "p26-kin-earphones",
      "photoRef": "P26",
      "role": "gallery",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "KIN box isolated from P26 shelf photo."
    },
    {
      "filename": "p26-sf30-earphones.jpg",
      "path": "/assets/products/p26-sf30-earphones.jpg",
      "productId": "p26-sf30-earphones",
      "photoRef": "P26",
      "role": "main",
      "type": "studio_product",
      "verificationStatus": "verified",
      "notes": "Verified studio image of SF30 wired earphones."
    },
    {
      "filename": "p26-sf30-pkg.jpg",
      "path": "/assets/products/p26-sf30-pkg.jpg",
      "productId": "p26-sf30-earphones",
      "photoRef": "P26",
      "role": "gallery",
      "type": "packaging_front",
      "verificationStatus": "verified",
      "notes": "SF30 box isolated from P26 shelf photo."
    }
  ]
}

with open('docs/product-image-manifest.json', 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

print("Saved docs/product-image-manifest.json with", len(manifest['images']), "mapped images.")
