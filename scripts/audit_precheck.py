import json
import os

with open('docs/catalog_excel_dump.json', 'r', encoding='utf-8') as f:
    catalog_dump = json.load(f)

with open('docs/price_evidence.json', 'r', encoding='utf-8') as f:
    price_evidence = json.load(f)

# Build evidence map by source ID
evidence_map = {}
for row in price_evidence:
    sid = row.get('A')
    if sid and sid.startswith('S'):
        evidence_map[sid] = {
            'retailer': row.get('B', ''),
            'notes': row.get('C', ''),
            'url': row.get('D', '')
        }

print(f"Loaded {len(evidence_map)} price evidence sources.")

# Let's inspect existing public/assets/products files
existing_files = set(os.listdir('public/assets/products'))
print(f"Loaded {len(existing_files)} existing assets in public/assets/products.")

output = {
    'sources': evidence_map,
    'total_assets': len(existing_files)
}

with open('docs/audit_precheck.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2)
