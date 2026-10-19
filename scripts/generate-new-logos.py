import os
import math
from PIL import Image, ImageFilter, ImageDraw, ImageOps

source_path = r'C:/Users/Tonmoy/.gemini/antigravity-ide/brain/2ab18308-912f-4ff9-aa90-7d0bf2e99d3a/.user_uploaded/media_1792387526193.jpg'
dest_dir = r'c:/Users/Tonmoy/Documents/Tech/public/assets'
public_dir = r'c:/Users/Tonmoy/Documents/Tech/public'
os.makedirs(dest_dir, exist_ok=True)

# 1. Load original image
raw_img = Image.open(source_path).convert('RGB')
w, h = raw_img.size
print(f"Original image loaded: {w}x{h}")

# Save raw original in assets
raw_img.save(os.path.join(dest_dir, 'tech-nest-logo-raw.jpg'), quality=98)
raw_img.save(os.path.join(dest_dir, 'tech-nest-user-logo-original.png'), optimize=True)

# 2. Extract Emblem and Wordmark precise crops
# Emblem bounds: x in [304, 724], y in [25, 445] -> 420x420
e_raw = raw_img.crop((304, 25, 724, 445))

# Wordmark bounds: x in [280, 764], y in [458, 536] -> 484x78
w_raw = raw_img.crop((280, 458, 764, 536))

# 3. Build Authentic High-Contrast Horizontal Badge (Default Master Logo)
# Proportions: 1020 x 260
# Emblem: 240x240, Wordmark: 682x110
cw, ch = 1020, 260
badge = Image.new('RGB', (cw, ch), (8, 20, 42))

e_resized = e_raw.resize((240, 240), Image.Resampling.LANCZOS)
w_resized = w_raw.resize((682, 110), Image.Resampling.LANCZOS)

badge.paste(e_resized, (20, 10))
badge.paste(w_resized, (300, 75))

# Rounded mask for pill container
mask = Image.new('L', (cw, ch), 0)
draw_mask = ImageDraw.Draw(mask)
pad = 4
draw_mask.rounded_rectangle([pad, pad, cw - pad, ch - pad], radius=44, fill=255)

# Convert badge to RGBA with mask
final_badge = badge.convert('RGBA')
final_badge.putalpha(mask)

# Draw glowing cyan border
draw_b = ImageDraw.Draw(final_badge)
draw_b.rounded_rectangle([pad, pad, cw - pad, ch - pad], radius=44, outline=(34, 211, 238, 160), width=4)
draw_b.rounded_rectangle([pad+2, pad+2, cw - pad-2, ch - pad-2], radius=42, outline=(56, 189, 248, 80), width=2)

# Save badge as default horizontal logo & badge variants
final_badge.save(os.path.join(dest_dir, 'tech-nest-logo-horizontal.png'), optimize=True)
final_badge.save(os.path.join(dest_dir, 'tech-nest-logo.png'), optimize=True)
final_badge.save(os.path.join(dest_dir, 'tech-nest-logo-badge.png'), optimize=True)
final_badge.save(os.path.join(dest_dir, 'tech-nest-logo-dark.png'), optimize=True)
print(f"Saved master tech-nest-logo-horizontal.png and badge variants ({cw}x{ch})")

# 4. Generate Square App Icon (512x512)
icon_canvas = Image.new('RGB', (512, 512), (8, 20, 42))
e_icon = e_raw.resize((460, 460), Image.Resampling.LANCZOS)
icon_canvas.paste(e_icon, (26, 26))

icon_mask = Image.new('L', (512, 512), 0)
draw_imask = ImageDraw.Draw(icon_mask)
draw_imask.rounded_rectangle([12, 12, 500, 500], radius=110, fill=255)

final_icon = icon_canvas.convert('RGBA')
final_icon.putalpha(icon_mask)

draw_icon = ImageDraw.Draw(final_icon)
draw_icon.rounded_rectangle([12, 12, 500, 500], radius=110, outline=(34, 211, 238, 160), width=5)
draw_icon.rounded_rectangle([15, 15, 497, 497], radius=107, outline=(56, 189, 248, 80), width=2)

final_icon.save(os.path.join(dest_dir, 'tech-nest-icon.png'), optimize=True)
final_icon.save(os.path.join(dest_dir, 'tech-nest-app-icon.png'), optimize=True)
print("Saved tech-nest-icon.png and tech-nest-app-icon.png (512x512)")

# 5. Generate Favicons (192x192 PNG & multi-res ICO)
fav_192 = final_icon.resize((192, 192), Image.Resampling.LANCZOS)
fav_192.save(os.path.join(public_dir, 'favicon.png'), optimize=True)

fav_ico_images = [
    final_icon.resize((s, s), Image.Resampling.LANCZOS)
    for s in [16, 32, 48, 64]
]
fav_ico_images[1].save(
    os.path.join(public_dir, 'favicon.ico'),
    format='ICO',
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
    append_images=fav_ico_images
)
print("Saved favicon.png (192x192) and favicon.ico")

# 6. Generate Clean Vertical Stacked Logo (Original Layout)
v_crop = raw_img.crop((260, 20, 764, 550)) # 504x530
vw, vh = v_crop.size
v_badge = Image.new('RGB', (vw, vh), (8, 20, 42))
v_badge.paste(v_crop, (0, 0))

v_mask = Image.new('L', (vw, vh), 0)
v_draw_mask = ImageDraw.Draw(v_mask)
v_draw_mask.rounded_rectangle([4, 4, vw - 4, vh - 4], radius=40, fill=255)

final_v = v_badge.convert('RGBA')
final_v.putalpha(v_mask)

v_draw = ImageDraw.Draw(final_v)
v_draw.rounded_rectangle([4, 4, vw - 4, vh - 4], radius=40, outline=(34, 211, 238, 140), width=4)
final_v.save(os.path.join(dest_dir, 'tech-nest-logo-vertical.png'), optimize=True)
print("Saved tech-nest-logo-vertical.png")

print("All enhanced logo assets generated successfully!")
