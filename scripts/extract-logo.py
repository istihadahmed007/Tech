import os
import sys
from PIL import Image, ImageFilter

source_path = r'C:/Users/Tonmoy/.gemini/antigravity-ide/brain/9f89f282-a0f9-4d7f-bac5-a13915a4893b/.user_uploaded/media_1792157382295.jpg'
dest_dir = r'c:/Users/Tonmoy/Documents/Tech/public/assets'
public_dir = r'c:/Users/Tonmoy/Documents/Tech/public'

im = Image.open(source_path).convert('RGB')
width, height = im.size

# Save copy of raw original
im.save(os.path.join(dest_dir, 'tech-nest-logo-raw.jpg'), quality=95)

# Step 1: Detect background checkerboard
# Create an alpha mask (0 = background, 255 = logo)
alpha_map = bytearray(width * height)

for y in range(height):
    for x in range(width):
        r, g, b = im.getpixel((x, y))
        parity = (x // 16 + y // 16) % 2
        target = 254 if parity == 0 else 237
        # Strict checkerboard test
        if abs(r - target) <= 7 and abs(g - target) <= 7 and abs(b - target) <= 7 and max(abs(r-g), abs(g-b), abs(r-b)) <= 5:
            alpha_map[y * width + x] = 0
        else:
            alpha_map[y * width + x] = 255

# Step 2: Handle edge anti-aliasing / slight halo
# For boundary pixels where alpha_map == 0 but next to 255, keep 0
# For boundary pixels where alpha_map == 255 but very close to checkerboard color, compute alpha
mask_img = Image.frombytes('L', (width, height), bytes(alpha_map))

# Remove small isolated noise (1-2 px specks)
mask_img = mask_img.filter(ImageFilter.MedianFilter(size=3))

# Create RGBA image
rgba_im = im.convert('RGBA')
rgba_im.putalpha(mask_img)

# Trim transparent borders to tight bounding box with padding
bbox = rgba_im.getbbox()
print("Logo Bounding Box:", bbox)
if bbox:
    # Add 12px margin
    pad = 12
    crop_box = (
        max(0, bbox[0] - pad),
        max(0, bbox[1] - pad),
        min(width, bbox[2] + pad),
        min(height, bbox[3] + pad)
    )
    trimmed_logo = rgba_im.crop(crop_box)
    trimmed_logo.save(os.path.join(dest_dir, 'tech-nest-logo.png'), optimize=True)
    print("Saved tech-nest-logo.png:", trimmed_logo.size)

# Step 3: Extract Emblem Icon (House + N + Orbit)
# Emblem is from y=72 to y=765
emblem_box = (
    max(0, bbox[0] - 10),
    max(0, bbox[1] - 10),
    min(width, bbox[2] + 10),
    765
)
emblem_cropped = rgba_im.crop(emblem_box)
emblem_bbox = emblem_cropped.getbbox()
if emblem_bbox:
    emblem_final = emblem_cropped.crop(emblem_bbox)
    # Pad to make it a neat square
    max_side = max(emblem_final.width, emblem_final.height) + 20
    square_icon = Image.new('RGBA', (max_side, max_side), (0, 0, 0, 0))
    offset_x = (max_side - emblem_final.width) // 2
    offset_y = (max_side - emblem_final.height) // 2
    square_icon.paste(emblem_final, (offset_x, offset_y), emblem_final)
    
    square_icon.save(os.path.join(dest_dir, 'tech-nest-icon.png'), optimize=True)
    print("Saved tech-nest-icon.png:", square_icon.size)
    
    # Generate favicons
    fav_192 = square_icon.resize((192, 192), Image.Resampling.LANCZOS)
    fav_192.save(os.path.join(public_dir, 'favicon.png'), optimize=True)
    
    fav_32 = square_icon.resize((32, 32), Image.Resampling.LANCZOS)
    fav_32.save(os.path.join(public_dir, 'favicon.ico'), format='ICO')
    print("Saved favicon.png and favicon.ico")

# Step 4: Generate Horizontal 3D Logo (Emblem + 3D Text)
if bbox and emblem_bbox:
    text_crop = rgba_im.crop((0, int(height * 0.73), width, height))
    t_bbox = text_crop.getbbox()
    if t_bbox:
        actual_text = text_crop.crop(t_bbox)
        target_h = 180
        text_w = int(actual_text.width * (target_h / actual_text.height))
        text_resized = actual_text.resize((text_w, target_h), Image.Resampling.LANCZOS)

        emblem_h = int(target_h * 1.25)
        emblem_w = int(emblem_final.width * (emblem_h / emblem_final.height))
        emblem_resized = emblem_final.resize((emblem_w, emblem_h), Image.Resampling.LANCZOS)

        gap = 30
        total_w = emblem_w + gap + text_w
        total_h = emblem_h

        h_canvas = Image.new('RGBA', (total_w, total_h), (0, 0, 0, 0))
        h_canvas.paste(emblem_resized, (0, 0), emblem_resized)
        text_y = (total_h - text_resized.height) // 2 + 5
        h_canvas.paste(text_resized, (emblem_w + gap, text_y), text_resized)

        h_canvas.save(os.path.join(dest_dir, 'tech-nest-logo-horizontal.png'), optimize=True)
        print("Saved tech-nest-logo-horizontal.png:", h_canvas.size)

