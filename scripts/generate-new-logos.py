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
print("Saved raw original copies.")

# 2. Extract Emblem and Wordmark precise crops
# Emblem bounds: x in [300, 728], y in [40, 429]
# Center of emblem: cx = 514, cy = 235
# Radius = 205 (box: 309, 30, 719, 440) -> 410x410
emblem_box = (304, 25, 724, 445) # 420x420
emblem_raw = raw_img.crop(emblem_box)

# Wordmark bounds: x in [285, 758], y in [463, 531]
wordmark_box = (280, 458, 764, 536) # 484x78
wordmark_raw = raw_img.crop(wordmark_box)

print(f"Emblem crop: {emblem_raw.size}, Wordmark crop: {wordmark_raw.size}")

# 3. Alpha extraction function with dual-contrast support
def extract_alpha_layer(crop_img, bg_color=(8, 20, 44), min_thresh=18, max_thresh=62, gamma=1.3):
    cw, ch = crop_img.size
    rgba = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    bg_r, bg_g, bg_b = bg_color
    
    for y in range(ch):
        for x in range(cw):
            r, g, b = crop_img.getpixel((x, y))
            # Distance from dark navy background
            diff = ((r - bg_r)**2 + (g - bg_g)**2 + (b - bg_b)**2)**0.5
            
            if diff < min_thresh:
                rgba.putpixel((x, y), (0, 0, 0, 0))
            else:
                ratio = min(1.0, max(0.0, (diff - min_thresh) / (max_thresh - min_thresh)))
                alpha = int(255 * (ratio ** gamma))
                # Slight saturation / contrast boost for neon vibrancy
                nr = min(255, int(r * 1.05))
                ng = min(255, int(g * 1.08))
                nb = min(255, int(b * 1.05))
                rgba.putpixel((x, y), (nr, ng, nb, alpha))
    return rgba

print("Extracting alpha layers...")
emblem_rgba = extract_alpha_layer(emblem_raw, bg_color=(8, 20, 45), min_thresh=18, max_thresh=65, gamma=1.2)
wordmark_rgba = extract_alpha_layer(wordmark_raw, bg_color=(8, 20, 45), min_thresh=16, max_thresh=60, gamma=1.2)

# Helper: Create soft dark outline / drop shadow behind transparent layer for light-background contrast
def add_contrast_backing(rgba_img, shadow_offset=(0, 2), shadow_blur=4, shadow_color=(6, 16, 32, 210)):
    w, h = rgba_img.size
    # Extract alpha mask
    alpha_mask = rgba_img.split()[3]
    
    # Create shadow layer
    shadow_mask = alpha_mask.filter(ImageFilter.GaussianBlur(radius=shadow_blur))
    # Dilate slightly so it rims the shapes
    shadow_mask = shadow_mask.filter(ImageFilter.MaxFilter(size=3))
    
    shadow_layer = Image.new('RGBA', (w, h), shadow_color[:3] + (0,))
    shadow_draw_mask = Image.new('L', (w, h), 0)
    shadow_draw_mask.paste(shadow_mask, shadow_offset)
    
    # Scale shadow opacity
    shadow_layer.putalpha(ImageOps.scale(shadow_draw_mask, 1.0))
    # Adjust shadow alpha
    sr, sg, sb, _ = shadow_color
    final_shadow = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    for y in range(h):
        for x in range(w):
            a = shadow_draw_mask.getpixel((x, y))
            if a > 0:
                final_a = int(a * (shadow_color[3] / 255.0))
                final_shadow.putpixel((x, y), (sr, sg, sb, final_a))
                
    # Composite: shadow under rgba
    combined = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    combined.paste(final_shadow, (0, 0), final_shadow)
    combined.paste(rgba_img, (0, 0), rgba_img)
    return combined

emblem_with_backing = add_contrast_backing(emblem_rgba, shadow_offset=(0, 1), shadow_blur=3, shadow_color=(4, 12, 26, 220))
wordmark_with_backing = add_contrast_backing(wordmark_rgba, shadow_offset=(0, 2), shadow_blur=3, shadow_color=(4, 12, 26, 230))

# 4. Generate Square App Icon (512x512)
# Squircle with cosmic navy background (#071224) and subtle cyan border glow
icon_canvas = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
icon_draw = ImageDraw.Draw(icon_canvas)

# Rounded squircle background
padding = 16
radius = 110
icon_draw.rounded_rectangle([padding, padding, 512 - padding, 512 - padding], radius=radius, fill=(8, 20, 42, 255))
# Subtle glowing cyan ring border
icon_draw.rounded_rectangle([padding, padding, 512 - padding, 512 - padding], radius=radius, outline=(34, 211, 238, 120), width=4)
icon_draw.rounded_rectangle([padding + 2, padding + 2, 512 - padding - 2, 512 - padding - 2], radius=radius - 2, outline=(56, 189, 248, 60), width=2)

# Scale emblem into icon
emblem_target_size = 400
emblem_resized = emblem_rgba.resize((emblem_target_size, emblem_target_size), Image.Resampling.LANCZOS)
offset_x = (512 - emblem_target_size) // 2
offset_y = (512 - emblem_target_size) // 2
icon_canvas.paste(emblem_resized, (offset_x, offset_y), emblem_resized)

icon_canvas.save(os.path.join(dest_dir, 'tech-nest-icon.png'), optimize=True)
icon_canvas.save(os.path.join(dest_dir, 'tech-nest-app-icon.png'), optimize=True)
print("Saved tech-nest-icon.png and tech-nest-app-icon.png (512x512)")

# Transparent icon
transparent_icon = Image.new('RGBA', (512, 512), (0, 0, 0, 0))
transparent_icon.paste(emblem_with_backing.resize((480, 480), Image.Resampling.LANCZOS), (16, 16), emblem_with_backing.resize((480, 480), Image.Resampling.LANCZOS))
transparent_icon.save(os.path.join(dest_dir, 'tech-nest-icon-transparent.png'), optimize=True)

# 5. Generate Favicons (192x192 PNG & multi-res ICO)
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
print("Saved favicon.png (192x192) and favicon.ico")

# 6. Generate High-Res Horizontal Logo (Emblem + Wordmark)
# Proportions:
# Total canvas height: 260px
# Emblem size: 240x240, positioned at left=20, top=10
# Wordmark target height: 110px. Aspect ratio: 484 / 78 = 6.205
# Wordmark width: int(110 * 6.205) = 682px
# Gap between emblem and wordmark: 36px
# Wordmark x = 20 + 240 + 36 = 296
# Wordmark y = (260 - 110) // 2 = 75
# Total width = 296 + 682 + 30 = 1008px

H_CANVAS_W = 1020
H_CANVAS_H = 260

# Version A: Transparent with dual-contrast backing (Primary horizontal logo)
h_transparent = Image.new('RGBA', (H_CANVAS_W, H_CANVAS_H), (0, 0, 0, 0))
e_res_backed = emblem_with_backing.resize((240, 240), Image.Resampling.LANCZOS)
w_res_backed = wordmark_with_backing.resize((682, 110), Image.Resampling.LANCZOS)

h_transparent.paste(e_res_backed, (20, 10), e_res_backed)
h_transparent.paste(w_res_backed, (296, 75), w_res_backed)

# Trim transparent edges tightly with small margin
bbox_h = h_transparent.getbbox()
if bbox_h:
    crop_h = (max(0, bbox_h[0] - 8), max(0, bbox_h[1] - 8), min(H_CANVAS_W, bbox_h[2] + 8), min(H_CANVAS_H, bbox_h[3] + 8))
    h_transparent_final = h_transparent.crop(crop_h)
else:
    h_transparent_final = h_transparent

h_transparent_final.save(os.path.join(dest_dir, 'tech-nest-logo-horizontal.png'), optimize=True)
h_transparent_final.save(os.path.join(dest_dir, 'tech-nest-logo.png'), optimize=True)
h_transparent_final.save(os.path.join(dest_dir, 'tech-nest-logo-transparent.png'), optimize=True)
print(f"Saved primary tech-nest-logo-horizontal.png ({h_transparent_final.size})")

# Version B: Dark Cosmic Badge Variant
# Sleek pill / badge with deep cosmic navy background (#071224), rounded border & glow
badge_w = H_CANVAS_W
badge_h = H_CANVAS_H
h_badge = Image.new('RGBA', (badge_w, badge_h), (0, 0, 0, 0))
b_draw = ImageDraw.Draw(h_badge)

# Rounded badge container
pad_b = 6
b_draw.rounded_rectangle([pad_b, pad_b, badge_w - pad_b, badge_h - pad_b], radius=48, fill=(8, 20, 42, 255))
b_draw.rounded_rectangle([pad_b, pad_b, badge_w - pad_b, badge_h - pad_b], radius=48, outline=(34, 211, 238, 140), width=4)
b_draw.rounded_rectangle([pad_b + 3, pad_b + 3, badge_w - pad_b - 3, badge_h - pad_b - 3], radius=45, outline=(56, 189, 248, 60), width=2)

# Paste pure glowing layers (without dark backing)
e_res_glow = emblem_rgba.resize((240, 240), Image.Resampling.LANCZOS)
w_res_glow = wordmark_rgba.resize((682, 110), Image.Resampling.LANCZOS)
h_badge.paste(e_res_glow, (24, 10), e_res_glow)
h_badge.paste(w_res_glow, (300, 75), w_res_glow)

h_badge.save(os.path.join(dest_dir, 'tech-nest-logo-badge.png'), optimize=True)
h_badge.save(os.path.join(dest_dir, 'tech-nest-logo-dark.png'), optimize=True)
print(f"Saved tech-nest-logo-badge.png and tech-nest-logo-dark.png ({badge_w}x{badge_h})")

# 7. Generate Full Vertical Stacked Logo (Original Layout)
# Clean crop of the original with transparent background
v_crop = raw_img.crop((260, 20, 764, 550)) # 504x530
v_rgba = extract_alpha_layer(v_crop, bg_color=(8, 20, 45), min_thresh=16, max_thresh=60, gamma=1.2)
v_backed = add_contrast_backing(v_rgba, shadow_offset=(0, 2), shadow_blur=3)
v_backed.save(os.path.join(dest_dir, 'tech-nest-logo-vertical.png'), optimize=True)
print("Saved tech-nest-logo-vertical.png")

print("All logo assets successfully generated!")
