import os
from PIL import Image, ImageEnhance, ImageFilter

dest_dir = r'public\assets\products'
ref_dir = r'docs\original_references'

def make_studio_square(img, out_path, size=(1000, 1000), bg=(255, 255, 255)):
    w, h = img.size
    target_w, target_h = size
    
    # Target available space with padding
    pad = 40
    avail_w = target_w - (pad * 2)
    avail_h = target_h - (pad * 2)
    
    scale = min(avail_w / w, avail_h / h)
    nw = max(1, int(w * scale))
    nh = max(1, int(h * scale))
    
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    if resized.mode != 'RGB':
        resized = resized.convert('RGB')
        
    canvas = Image.new('RGB', size, bg)
    px = (target_w - nw) // 2
    py = (target_h - nh) // 2
    
    # Soft realistic studio shadow underneath
    shadow = Image.new('RGBA', (nw + 20, nh + 20), (0, 0, 0, 0))
    s_mask = Image.new('L', (nw, nh), 25)
    shadow.paste((20, 30, 45, 20), (10, 14), mask=s_mask)
    shadow = shadow.filter(ImageFilter.GaussianBlur(8))
    
    canvas.paste(shadow, (px - 10, py - 6), mask=shadow.split()[3])
    canvas.paste(resized, (px, py))
    
    canvas.save(out_path, 'JPEG', quality=95, optimize=True)
    print(f'Exported studio square: {os.path.basename(out_path)} ({size[0]}x{size[1]})')

# 1. Fix p07-oppo-style-27w-charger.jpg
# Use the clean studio photo of the charger from p07-oppo-charger-original.jpg
p07_orig_path = os.path.join(dest_dir, 'p07-oppo-charger-original.jpg')
with Image.open(p07_orig_path) as im:
    make_studio_square(im, os.path.join(dest_dir, 'p07-oppo-style-27w-charger.jpg'))

# 2. Fix p17-tucci-q8-usb-headset.jpg
# Use the high-res 1204x1600 original image17.jpg, crop the Q8 package cleanly
with Image.open(os.path.join(ref_dir, 'image17.jpg')) as im:
    # Package area with headset visible
    crop_q8 = im.crop((80, 120, 1120, 1480))
    make_studio_square(crop_q8, os.path.join(dest_dir, 'p17-tucci-q8-usb-headset.jpg'))

# 3. Fix p06-samsung-tws.jpg
# Replace genuine Galaxy Buds 2 Pro photo with studio-standard Samsung-labelled Pro-Style TWS package
p06_sam_pkg = os.path.join(dest_dir, 'p06-samsung-pkg.jpg')
with Image.open(p06_sam_pkg) as im:
    make_studio_square(im, os.path.join(dest_dir, 'p06-samsung-tws.jpg'))

# 4. Fix p06-oppo-tws.jpg
# Replace genuine Oppo Enco Buds 2 Pro photo with studio-standard OPPO-labelled Pro-Style TWS package
p06_oppo_pkg = os.path.join(dest_dir, 'p06-oppo-pkg.jpg')
with Image.open(p06_oppo_pkg) as im:
    make_studio_square(im, os.path.join(dest_dir, 'p06-oppo-tws.jpg'))

# 5. Fix p06-mi-tws.jpg
# Replace genuine Redmi Buds 8 photo with studio-standard Mi-labelled Pro-Style TWS package
p06_mi_pkg = os.path.join(dest_dir, 'p06-mi-pkg.jpg')
with Image.open(p06_mi_pkg) as im:
    make_studio_square(im, os.path.join(dest_dir, 'p06-mi-tws.jpg'))

print('All 5 problematic images updated to 1000x1000 square studio photoshoot standards!')
