import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('docs/catalog_excel_dump.json', 'r', encoding='utf-8') as f:
    excel_data = json.load(f)

with open('docs/audit_analysis_utf8.txt', 'w', encoding='utf-8') as out:
    out.write("=== EXCEL PHOTO PRICES ===\n")
    for p in excel_data['photo_prices']:
        out.write(f"{p['photo_id']}: {p['product_name']} | BDT {p['low_bdt']}-{p['high_bdt']} | Media: {p['media_file']} | File: {p['original_filename']}\n")
        out.write(f"   Notes: {p['notes']}\n")

    out.write("\n=== EXCEL DESCRIPTIONS ===\n")
    for d in excel_data['descriptions']:
        out.write(f"{d['photo_id']}: {d['title']}\n")
        out.write(f"   Image direction: {d['image_direction']}\n")

    out.write("\n=== EXCEL MIXED PICTURES ===\n")
    for m in excel_data['mixed_pictures']:
        out.write(f"{json.dumps(m, ensure_ascii=False)}\n")

