import os
from PIL import Image

products_dir = r'public\assets\products'
files = sorted(os.listdir(products_dir))
print(f'Total files in {products_dir}: {len(files)}')

for f in files:
    if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
        p = os.path.join(products_dir, f)
        try:
            with Image.open(p) as img:
                w, h = img.size
                ratio = w / h if h != 0 else 0
                sz = os.path.getsize(p)
                print(f'{f:45s} | {w:4d}x{h:4d} | ratio {ratio:.2f} | {sz//1024:4d} KB')
        except Exception as e:
            print(f'{f:45s} | ERROR: {e}')
