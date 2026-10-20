import os
import math
import base64
from PIL import Image, ImageFilter, ImageDraw, ImageFont

repo_dir = r'c:/Users/Tonmoy/Documents/Tech'
source_path = r'C:/Users/Tonmoy/.gemini/antigravity-ide/brain/2ab18308-912f-4ff9-aa90-7d0bf2e99d3a/.user_uploaded/media_1792387526193.jpg'
font_path = os.path.join(repo_dir, 'scripts', 'fonts', 'Orbitron-900.ttf')
dest_dir = os.path.join(repo_dir, 'public', 'assets')
public_dir = os.path.join(repo_dir, 'public')
dist_assets_dir = os.path.join(repo_dir, 'dist', 'assets')
dist_dir = os.path.join(repo_dir, 'dist')

os.makedirs(dest_dir, exist_ok=True)
os.makedirs(dist_assets_dir, exist_ok=True)

# 1. Load original high-res image
raw_img = Image.open(source_path).convert('RGB')
w, h = raw_img.size
print(f"Original image loaded: {w}x{h}")

# Save original reference
raw_img.save(os.path.join(dest_dir, 'tech-nest-logo-raw.jpg'), quality=98)
raw_img.save(os.path.join(dest_dir, 'tech-nest-user-logo-original.png'), optimize=True)

# 2. Extract and reconstruct clean circuit nest emblem
emblem_crop = raw_img.crop((310, 35, 715, 435))
ew, eh = emblem_crop.size
bg_r, bg_g, bg_b = 10, 30, 60

mask_e = Image.new('L', (ew, eh), 0)
for y in range(eh):
    for x in range(ew):
        r, g, b = emblem_crop.getpixel((x, y))
        diff = max(0, g - bg_g) * 1.5 + max(0, b - bg_b) * 0.8 + max(0, r - bg_r) * 0.4
        if diff > 40:
            mask_e.putpixel((x, y), min(255, int((diff - 40) * 3.5)))

clean_mask_e = mask_e.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.8))

clean_emblem = Image.new('RGBA', (ew, eh), (0, 0, 0, 0))
for y in range(eh):
    for x in range(ew):
        a = clean_mask_e.getpixel((x, y))
        if a > 0:
            r, g, b = emblem_crop.getpixel((x, y))
            lum = r * 0.299 + g * 0.587 + b * 0.114
            if lum > 170:
                cr = int(180 + (lum - 170) * 0.88)
                cg = 255
                cb = 255
            elif lum > 90:
                t = (lum - 90) / 80.0
                cr = int(0 + t * 180)
                cg = int(190 + t * 65)
                cb = 255
            else:
                t = lum / 90.0
                cr = int(0 + t * 0)
                cg = int(80 + t * 110)
                cb = int(180 + t * 75)
            clean_emblem.putpixel((x, y), (cr, cg, cb, a))

bbox_e = clean_emblem.getbbox()
clean_emblem = clean_emblem.crop(bbox_e)

# 3. Master Horizontal Logo (Light Header / Default)
# Render at 4x scale for vector-smooth anti-aliasing and downsample with Lanczos
SCALE = 4
TARGET_H = 240 * SCALE # 960px
e_h = TARGET_H
e_w = int(clean_emblem.width * (e_h / clean_emblem.height))
emblem_scaled = clean_emblem.resize((e_w, e_h), Image.Resampling.LANCZOS)

# Subtle ambient shadow for emblem
emblem_grounded = Image.new('RGBA', (e_w + 16 * SCALE, e_h + 16 * SCALE), (0, 0, 0, 0))
s_mask = emblem_scaled.split()[3].filter(ImageFilter.GaussianBlur(3.0 * SCALE))
s_color = Image.new('RGBA', (e_w, e_h), (11, 27, 54, 75))
emblem_grounded.paste(s_color, (8 * SCALE, 10 * SCALE), s_mask)
emblem_grounded.paste(emblem_scaled, (8 * SCALE, 8 * SCALE), emblem_scaled)

font = ImageFont.truetype(font_path, 135 * SCALE)
tmp_draw = ImageDraw.Draw(Image.new('RGBA', (1, 1)))
bbox_tech = tmp_draw.textbbox((0, 0), 'TECH', font=font)
w_tech = bbox_tech[2] - bbox_tech[0]
bbox_nest = tmp_draw.textbbox((0, 0), 'NEST', font=font)
w_nest = bbox_nest[2] - bbox_nest[0]

word_gap = 26 * SCALE
gap_from_emblem = 36 * SCALE

cw = emblem_grounded.width + gap_from_emblem + w_tech + word_gap + w_nest + 30 * SCALE
ch = TARGET_H + 24 * SCALE

c_light = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
c_light.paste(emblem_grounded, (0, 4 * SCALE), emblem_grounded)

draw_light = ImageDraw.Draw(c_light)
tx = emblem_grounded.width + gap_from_emblem
text_h = max(bbox_tech[3] - bbox_tech[1], bbox_nest[3] - bbox_nest[1])
ty = (ch - text_h) // 2 - bbox_tech[1] // 2

# 3D shadow layers
for offset in range(4 * SCALE, 0, -1):
    draw_light.text((tx + offset, ty + offset), 'TECH', font=font, fill=(11, 27, 54, 160))
    draw_light.text((tx + w_tech + word_gap + offset, ty + offset), 'NEST', font=font, fill=(10, 50, 140, 160))

# Cyan accent border (anti-aliased via super-sampling)
outline_r = 2 * SCALE
for dx in range(-outline_r, outline_r + 1, SCALE):
    for dy in range(-outline_r, outline_r + 1, SCALE):
        if dx != 0 or dy != 0:
            draw_light.text((tx + dx, ty + dy), 'TECH', font=font, fill=(0, 216, 255, 140))
            draw_light.text((tx + w_tech + word_gap + dx, ty + dy), 'NEST', font=font, fill=(0, 216, 255, 140))

# Main face
draw_light.text((tx, ty), 'TECH', font=font, fill=(11, 27, 54, 255))
draw_light.text((tx + w_tech + word_gap, ty), 'NEST', font=font, fill=(20, 92, 255, 255))

final_4x = c_light.crop(c_light.getbbox())
# 2x Retina master logo
master_horizontal = final_4x.resize((final_4x.width // 2, final_4x.height // 2), Image.Resampling.LANCZOS)
mw, mh = master_horizontal.size
print(f"Master horizontal logo size: {mw}x{mh} (Aspect Ratio: {mw/mh:.3f})")

# Save horizontal logos
for d in [dest_dir, dist_assets_dir]:
    master_horizontal.save(os.path.join(d, 'tech-nest-logo-horizontal.png'), optimize=True)
    master_horizontal.save(os.path.join(d, 'tech-nest-logo.png'), optimize=True)
    master_horizontal.save(os.path.join(d, 'tech-nest-logo-transparent.png'), optimize=True)

# 4. Master Dark / Badge Logo (For dark containers)
c_dark = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
# On dark, paste vibrant glowing emblem
c_dark.paste(emblem_scaled, (8 * SCALE, 8 * SCALE), emblem_scaled)

draw_dark = ImageDraw.Draw(c_dark)
# Luminous glow for dark
for offset in range(3 * SCALE, 0, -1):
    draw_dark.text((tx + offset, ty + offset), 'TECH', font=font, fill=(0, 216, 255, 80))
    draw_dark.text((tx + w_tech + word_gap + offset, ty + offset), 'NEST', font=font, fill=(0, 216, 255, 120))

for dx in range(-outline_r, outline_r + 1, SCALE):
    for dy in range(-outline_r, outline_r + 1, SCALE):
        if dx != 0 or dy != 0:
            draw_dark.text((tx + dx, ty + dy), 'TECH', font=font, fill=(0, 216, 255, 180))
            draw_dark.text((tx + w_tech + word_gap + dx, ty + dy), 'NEST', font=font, fill=(0, 216, 255, 200))

# TECH in pure white, NEST in electric cyan
draw_dark.text((tx, ty), 'TECH', font=font, fill=(255, 255, 255, 255))
draw_dark.text((tx + w_tech + word_gap, ty), 'NEST', font=font, fill=(0, 216, 255, 255))

final_dark_4x = c_dark.crop(c_dark.getbbox())
master_dark = final_dark_4x.resize((final_dark_4x.width // 2, final_dark_4x.height // 2), Image.Resampling.LANCZOS)

for d in [dest_dir, dist_assets_dir]:
    master_dark.save(os.path.join(d, 'tech-nest-logo-dark.png'), optimize=True)
    master_dark.save(os.path.join(d, 'tech-nest-logo-badge.png'), optimize=True)

# 5. Master Horizontal SVG with exact viewBox
with open(os.path.join(dest_dir, 'tech-nest-logo-horizontal.png'), 'rb') as f:
    h_b64 = base64.b64encode(f.read()).decode('utf-8')

svg_horizontal = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {mw} {mh}" width="{mw}" height="{mh}">
  <title>Tech Nest — Authentic Mobile Accessories</title>
  <image href="data:image/png;base64,{h_b64}" width="{mw}" height="{mh}" preserveAspectRatio="xMidYMid meet" />
</svg>'''

for d in [dest_dir, dist_assets_dir]:
    with open(os.path.join(d, 'tech-nest-logo-horizontal.svg'), 'w', encoding='utf-8') as f:
        f.write(svg_horizontal)
    with open(os.path.join(d, 'tech-nest-logo.svg'), 'w', encoding='utf-8') as f:
        f.write(svg_horizontal)
print("Saved tech-nest-logo-horizontal.svg and tech-nest-logo.svg")

# 6. Generate Square App Icon & Favicons (512x512)
icon_size = 512
# High-end cosmic dark squircle badge
app_icon = Image.new('RGB', (icon_size, icon_size), (8, 20, 42))
raw_emblem_sq = raw_img.crop((304, 25, 724, 445)).resize((460, 460), Image.Resampling.LANCZOS)
app_icon.paste(raw_emblem_sq, (26, 26))

imask = Image.new('L', (icon_size, icon_size), 0)
draw_im = ImageDraw.Draw(imask)
draw_im.rounded_rectangle([12, 12, 500, 500], radius=110, fill=255)
final_app_icon = app_icon.convert('RGBA')
final_app_icon.putalpha(imask)

draw_app = ImageDraw.Draw(final_app_icon)
draw_app.rounded_rectangle([12, 12, 500, 500], radius=110, outline=(34, 211, 238, 180), width=5)
draw_app.rounded_rectangle([15, 15, 497, 497], radius=107, outline=(56, 189, 248, 90), width=2)

for d in [dest_dir, dist_assets_dir]:
    final_app_icon.save(os.path.join(d, 'tech-nest-app-icon.png'), optimize=True)
    final_app_icon.save(os.path.join(d, 'tech-nest-icon.png'), optimize=True)

# Transparent icon
icon_trans = Image.new('RGBA', (icon_size, icon_size), (0, 0, 0, 0))
e_trans = clean_emblem.resize((460, int(460 * (clean_emblem.height / clean_emblem.width))), Image.Resampling.LANCZOS)
off_x = (icon_size - e_trans.width) // 2
off_y = (icon_size - e_trans.height) // 2
icon_trans.paste(e_trans, (off_x, off_y), e_trans)

for d in [dest_dir, dist_assets_dir]:
    icon_trans.save(os.path.join(d, 'tech-nest-icon-transparent.png'), optimize=True)

# SVG icon
with open(os.path.join(dest_dir, 'tech-nest-icon.png'), 'rb') as f:
    icon_b64 = base64.b64encode(f.read()).decode('utf-8')

svg_icon = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {icon_size} {icon_size}" width="{icon_size}" height="{icon_size}">
  <title>Tech Nest Icon</title>
  <image href="data:image/png;base64,{icon_b64}" width="{icon_size}" height="{icon_size}" preserveAspectRatio="xMidYMid meet" />
</svg>'''

for d in [dest_dir, dist_assets_dir]:
    with open(os.path.join(d, 'tech-nest-icon.svg'), 'w', encoding='utf-8') as f:
        f.write(svg_icon)

for p in [public_dir, dist_dir]:
    with open(os.path.join(p, 'favicon.svg'), 'w', encoding='utf-8') as f:
        f.write(svg_icon)

# 7. Generate Multi-Resolution Favicons (16, 32, 48, 64, 192)
fav_192 = final_app_icon.resize((192, 192), Image.Resampling.LANCZOS)
for p in [public_dir, dist_dir]:
    fav_192.save(os.path.join(p, 'favicon.png'), optimize=True)

fav_ico_images = [
    final_app_icon.resize((s, s), Image.Resampling.LANCZOS)
    for s in [16, 32, 48, 64]
]
for p in [public_dir, dist_dir]:
    fav_ico_images[1].save(
        os.path.join(p, 'favicon.ico'),
        format='ICO',
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
        append_images=fav_ico_images
    )

print("Saved all favicons (favicon.ico, favicon.png, favicon.svg)")
print(f"Brand assets generation complete! Master size: {mw}x{mh}, Aspect Ratio: {mw/mh:.3f}")
