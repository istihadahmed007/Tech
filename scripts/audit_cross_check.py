import json
import os
import sys
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

with open('docs/current_catalog.json', 'r', encoding='utf-8') as f:
    cat = json.load(f)

with open('docs/catalog_excel_dump.json', 'r', encoding='utf-8') as f:
    excel = json.load(f)

with open('docs/price_evidence.json', 'r', encoding='utf-8') as f:
    sources = json.load(f)

products = cat['products']
bundles = cat['bundles']

print(f'=== AUDIT ANALYSIS: {len(products)} PRODUCTS ===')

issues = []

for idx, p in enumerate(products):
    pid = p['id']
    pref = p.get('photoRef', 'N/A')
    brand = p.get('brand', '')
    model = p.get('model', '')
    title = p.get('title', '')
    price = p.get('price', 0)
    orig_price = p.get('originalPrice', 0)
    img = p.get('image', '')
    gallery = p.get('gallery', [])
    
    # Check image files
    img_issues = []
    main_path = os.path.join('public', img.lstrip('/'))
    if not os.path.exists(main_path):
        img_issues.append(f'Main image missing: {img}')
    else:
        with Image.open(main_path) as im:
            w, h = im.size
            ratio = w / h if h != 0 else 0
            if abs(ratio - 1.0) > 0.05:
                img_issues.append(f'Main image not square: {w}x{h} (ratio {ratio:.2f})')
            if w < 500 or h < 500:
                img_issues.append(f'Main image low resolution: {w}x{h}')
                
    for g in gallery:
        gp = os.path.join('public', g.lstrip('/'))
        if not os.path.exists(gp):
            img_issues.append(f'Gallery image missing: {g}')
        else:
            with Image.open(gp) as im:
                w, h = im.size
                ratio = w / h if h != 0 else 0
                if abs(ratio - 1.0) > 0.05:
                    img_issues.append(f'Gallery image not square: {g} ({w}x{h}, ratio {ratio:.2f})')
    
    print(f'[{idx+1:02d}] {pid} ({pref}) | {brand} - {model} | ৳{price} (orig ৳{orig_price})')
    print(f'     Title: {title}')
    print(f'     Main: {img}')
    if img_issues:
        print(f'     ⚠️ IMAGE ISSUES: {"; ".join(img_issues)}')
        issues.append((pid, img_issues))
    else:
        print(f'     ✓ Images OK ({len(gallery)} gallery items, all square & existing)')

print(f'\nTotal products with image dimension/existence issues: {len(issues)}')
