import os
import math
import base64
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance

source_path = r'C:/Users/Tonmoy/.gemini/antigravity-ide/brain/2ab18308-912f-4ff9-aa90-7d0bf2e99d3a/.user_uploaded/media_1792387526193.jpg'
dest_dir = r'c:/Users/Tonmoy/Documents/Tech/public/assets'
public_dir = r'c:/Users/Tonmoy/Documents/Tech/public'
os.makedirs(dest_dir, exist_ok=True)

# 1. Load original high-res image
raw_img = Image.open(source_path).convert('RGB')
w, h = raw_img.size
print(f"Original image loaded: {w}x{h}")

# Save raw original in assets
raw_img.save(os.path.join(dest_dir, 'tech-nest-logo-raw.jpg'), quality=98)
raw_img.save(os.path.join(dest_dir, 'tech-nest-user-logo-original.png'), optimize=True)

# 2. Extract Tight Crops
# Emblem: tight crop of circular circuit nest
e_crop = raw_img.crop((308, 38, 720, 430)) # ~412 x 392
# Wordmark: tight crop of 3D TECH NEST lettering
w_crop = raw_img.crop((280, 460, 764, 534)) # ~484 x 74

# Background baseline color (deep cosmic navy)
bg_r, bg_g, bg_b = 8, 20, 44

def clean_extract_alpha(img, min_diff=14, max_diff=48, gamma=1.0):
    cw, ch = img.size
    rgba = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    for y in range(ch):
        for x in range(cw):
            r, g, b = img.getpixel((x, y))
            diff = ((r - bg_r)**2 + (g - bg_g)**2 + (b - bg_b)**2)**0.5
            
            if diff < min_diff:
                rgba.putpixel((x, y), (0, 0, 0, 0))
            else:
                alpha_factor = min(1.0, (diff - min_diff) / (max_diff - min_diff))
                alpha = int(255 * (alpha_factor ** gamma))
                
                # Enhance vibrancy for neon cyan
                nr = min(255, int(r * 1.05))
                ng = min(255, int(g * 1.10))
                nb = min(255, int(b * 1.12))
                rgba.putpixel((x, y), (nr, ng, nb, alpha))
    return rgba

e_clean = clean_extract_alpha(e_crop, min_diff=16, max_diff=52)
w_clean = clean_extract_alpha(w_crop, min_diff=14, max_diff=46)

# Unsharp mask for crystal-sharp edges (removes JPEG compression softness)
e_clean = e_clean.filter(ImageFilter.UnsharpMask(radius=1.2, percent=140, threshold=1))
w_clean = w_clean.filter(ImageFilter.UnsharpMask(radius=1.0, percent=150, threshold=1))

# Helper: Add crisp drop shadow and ambient occlusion in deep navy (#051428)
# This guarantees maximum contrast and legibility on both light/white and dark backgrounds!
def add_crisp_contrast_shadow(rgba_img, shadow_blur=1.8, shadow_offset=(0, 2), shadow_opacity=0.88):
    cw, ch = rgba_img.size
    alpha = rgba_img.split()[3]
    
    # Slight expansion of mask for rim definition
    rim_mask = alpha.filter(ImageFilter.MaxFilter(size=3))
    shadow_mask = rim_mask.filter(ImageFilter.GaussianBlur(radius=shadow_blur))
    
    sr, sg, sb = 5, 20, 40
    shadow = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    for y in range(ch):
        for x in range(cw):
            a = shadow_mask.getpixel((x, y))
            if a > 0:
                shadow.putpixel((x, y), (sr, sg, sb, int(a * shadow_opacity)))
                
    result = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    result.paste(shadow, shadow_offset, shadow)
    result.paste(rgba_img, (0, 0), rgba_img)
    return result

e_final = add_crisp_contrast_shadow(e_clean, shadow_blur=1.8, shadow_offset=(0, 1), shadow_opacity=0.85)
w_final = add_crisp_contrast_shadow(w_clean, shadow_blur=1.8, shadow_offset=(0, 2), shadow_opacity=0.90)

# 3. Assemble Master Horizontal Logo (Transparent Background, High Resolution)
# Canvas Height: 320px
# Emblem: 300x300 (full height)
# Wordmark: 160px height (bold, clearly readable capital 3D lettering)
E_H = 300
E_W = int(e_final.width * (E_H / e_final.height))
e_scaled = e_final.resize((E_W, E_H), Image.Resampling.LANCZOS)

W_H = 160
W_W = int(w_final.width * (W_H / w_final.height))
w_scaled = w_final.resize((W_W, W_H), Image.Resampling.LANCZOS)

gap = 26
total_w = E_W + gap + W_W + 10
total_h = 320

h_canvas = Image.new('RGBA', (total_w, total_h), (0, 0, 0, 0))
h_canvas.paste(e_scaled, (10, 10), e_scaled)
w_y = (total_h - W_H) // 2 + 2
h_canvas.paste(w_scaled, (10 + E_W + gap, w_y), w_scaled)

# Tight crop to remove any outer empty space
bbox = h_canvas.getbbox()
pad = 2
crop_box = (
    max(0, bbox[0] - pad),
    max(0, bbox[1] - pad),
    min(total_w, bbox[2] + pad),
    min(total_h, bbox[3] + pad)
)
h_master = h_canvas.crop(crop_box)
hw, hh = h_master.size
print(f"Master horizontal logo size: {hw}x{hh} (Aspect Ratio: {hw/hh:.3f})")

# Save primary horizontal logo PNGs
h_master.save(os.path.join(dest_dir, 'tech-nest-logo-horizontal.png'), optimize=True)
h_master.save(os.path.join(dest_dir, 'tech-nest-logo.png'), optimize=True)
h_master.save(os.path.join(dest_dir, 'tech-nest-logo-transparent.png'), optimize=True)

# 4. Generate Master Horizontal SVG with exact viewBox and embedded crystal-clear asset
with open(os.path.join(dest_dir, 'tech-nest-logo-horizontal.png'), 'rb') as f:
    h_b64 = base64.b64encode(f.read()).decode('utf-8')

svg_horizontal = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {hw} {hh}" width="{hw}" height="{hh}">
  <title>Tech Nest — Authentic Mobile Accessories</title>
  <image href="data:image/png;base64,{h_b64}" width="{hw}" height="{hh}" preserveAspectRatio="xMidYMid meet" />
</svg>'''

with open(os.path.join(dest_dir, 'tech-nest-logo-horizontal.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_horizontal)
with open(os.path.join(dest_dir, 'tech-nest-logo.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_horizontal)
print("Saved tech-nest-logo-horizontal.svg and tech-nest-logo.svg")

# 5. Generate Square App Icon & Favicon (512x512)
# Square transparent icon
icon_size = 512
icon_canvas = Image.new('RGBA', (icon_size, icon_size), (0, 0, 0, 0))
e_icon = e_final.resize((480, int(480 * (e_final.height / e_final.width))), Image.Resampling.LANCZOS)
off_x = (icon_size - e_icon.width) // 2
off_y = (icon_size - e_icon.height) // 2
icon_canvas.paste(e_icon, (off_x, off_y), e_icon)
icon_canvas.save(os.path.join(dest_dir, 'tech-nest-icon-transparent.png'), optimize=True)
icon_canvas.save(os.path.join(dest_dir, 'tech-nest-icon.png'), optimize=True)

# App icon with cosmic dark squircle badge
app_icon = Image.new('RGB', (icon_size, icon_size), (8, 20, 42))
app_icon.paste(raw_img.crop((304, 25, 724, 445)).resize((460, 460), Image.Resampling.LANCZOS), (26, 26))
imask = Image.new('L', (icon_size, icon_size), 0)
draw_im = ImageDraw.Draw(imask)
draw_im.rounded_rectangle([12, 12, 500, 500], radius=110, fill=255)
final_app_icon = app_icon.convert('RGBA')
final_app_icon.putalpha(imask)
draw_app = ImageDraw.Draw(final_app_icon)
draw_app.rounded_rectangle([12, 12, 500, 500], radius=110, outline=(34, 211, 238, 160), width=5)
draw_app.rounded_rectangle([15, 15, 497, 497], radius=107, outline=(56, 189, 248, 80), width=2)
final_app_icon.save(os.path.join(dest_dir, 'tech-nest-app-icon.png'), optimize=True)

# SVG square icon
with open(os.path.join(dest_dir, 'tech-nest-icon.png'), 'rb') as f:
    icon_b64 = base64.b64encode(f.read()).decode('utf-8')

svg_icon = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {icon_size} {icon_size}" width="{icon_size}" height="{icon_size}">
  <title>Tech Nest Icon</title>
  <image href="data:image/png;base64,{icon_b64}" width="{icon_size}" height="{icon_size}" preserveAspectRatio="xMidYMid meet" />
</svg>'''

with open(os.path.join(dest_dir, 'tech-nest-icon.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_icon)
with open(os.path.join(public_dir, 'favicon.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_icon)

# 6. Generate Multi-Resolution Favicons (Crisp at 16, 32, 48, 192)
fav_192 = icon_canvas.resize((192, 192), Image.Resampling.LANCZOS)
fav_192.save(os.path.join(public_dir, 'favicon.png'), optimize=True)

fav_ico_images = [
    icon_canvas.resize((s, s), Image.Resampling.LANCZOS)
    for s in [16, 32, 48, 64]
]
fav_ico_images[1].save(
    os.path.join(public_dir, 'favicon.ico'),
    format='ICO',
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
    append_images=fav_ico_images
)
print("Saved favicon.png (192x192), favicon.ico, and favicon.svg")

# 7. Generate Full Vertical Stacked Logo (Original Layout)
v_crop = raw_img.crop((260, 20, 764, 550)) # 504x530
vw, vh = v_crop.size
v_clean = clean_extract_alpha(v_crop, min_diff=15, max_diff=50)
v_backed = add_crisp_contrast_shadow(v_clean, shadow_blur=2.0, shadow_offset=(0, 2))
v_backed.save(os.path.join(dest_dir, 'tech-nest-logo-vertical.png'), optimize=True)
print("Saved tech-nest-logo-vertical.png")

print(f"All brand assets successfully updated! Master Aspect Ratio: {hw} / {hh}")
