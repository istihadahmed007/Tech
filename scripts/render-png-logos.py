import os
import math
from PIL import Image, ImageDraw, ImageFont

def render_png_logos():
    # 1. High-Resolution Horizontal Logo (920 x 200 scaled down for supersampled 2x antialiasing)
    width, height = 920, 200
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Let's draw the hexagon emblem
    # Center of hexagon at x=100, y=100, radius=72
    cx, cy, r = 100, 100, 72

    def get_hex_points(center_x, center_y, radius):
        pts = []
        for i in range(6):
            angle_deg = 30 + i * 60
            angle_rad = math.radians(angle_deg)
            pts.append((center_x + radius * math.cos(angle_rad), center_y + radius * math.sin(angle_rad)))
        return pts

    # Outer Hexagon (Brand Flame Orange #EE4D2D with gradient effect)
    outer_hex = get_hex_points(cx, cy, r)
    draw.polygon(outer_hex, fill=(238, 77, 45, 255))

    # Inner Hexagon (Deep Navy #10263D)
    inner_hex = get_hex_points(cx, cy, r - 12)
    draw.polygon(inner_hex, fill=(16, 38, 61, 255))

    # Geometric Stylized 'N' in White
    # N left bar, diagonal, right bar
    # Using polygon for crisp geometry
    n_pts = [
        (cx - 24, cy + 32),
        (cx - 24, cy - 32),
        (cx - 10, cy - 32),
        (cx + 12, cy + 16),
        (cx + 12, cy - 32),
        (cx + 24, cy - 32),
        (cx + 24, cy + 32),
        (cx + 10, cy + 32),
        (cx - 12, cy - 16),
        (cx - 12, cy + 32),
    ]
    draw.polygon(n_pts, fill=(255, 255, 255, 245))

    # Central Electric Spark (Gold / Bright Amber)
    spark_pts = [
        (cx + 2, cy - 26),
        (cx - 8, cy + 2),
        (cx + 1, cy + 2),
        (cx - 5, cy + 26),
        (cx + 9, cy - 4),
        (cx, cy - 4),
    ]
    draw.polygon(spark_pts, fill=(255, 193, 7, 255))

    # Corner Tech Nodes (small white dots)
    for px, py in outer_hex:
        draw.ellipse([px - 4, py - 4, px + 4, py + 4], fill=(255, 255, 255, 255))

    # Wordmark Typography
    # Try finding system font
    font_large = None
    font_small = None
    font_candidates = [
        "C:\\Windows\\Fonts\\segoeuib.ttf",
        "C:\\Windows\\Fonts\\arialbd.ttf",
        "C:\\Windows\\Fonts\\calibrib.ttf"
    ]
    small_candidates = [
        "C:\\Windows\\Fonts\\segoeui.ttf",
        "C:\\Windows\\Fonts\\arial.ttf",
        "C:\\Windows\\Fonts\\calibri.ttf"
    ]
    for fc in font_candidates:
        if os.path.exists(fc):
            try:
                font_large = ImageFont.truetype(fc, 76)
                break
            except Exception:
                pass
    for sc in small_candidates:
        if os.path.exists(sc):
            try:
                font_small = ImageFont.truetype(sc, 18)
                break
            except Exception:
                pass

    if font_large is None:
        font_large = ImageFont.load_default()
    if font_small is None:
        font_small = ImageFont.load_default()

    # Draw "TECH" in Deep Navy #10263D
    tx = 210
    ty = 44
    draw.text((tx, ty), "TECH", font=font_large, fill=(16, 38, 61, 255))

    # Measure width of "TECH "
    bbox_tech = draw.textbbox((tx, ty), "TECH ", font=font_large)
    nx = bbox_tech[2] + 4

    # Draw "NEST" in Vibrant Brand Orange #EE4D2D
    draw.text((nx, ty), "NEST", font=font_large, fill=(238, 77, 45, 255))

    # Measure width of "NEST"
    bbox_nest = draw.textbbox((nx, ty), "NEST", font=font_large)
    dot_x = bbox_nest[2] + 12
    dot_y = ty + 18
    # Spark dot accent
    draw.ellipse([dot_x - 7, dot_y - 7, dot_x + 7, dot_y + 7], fill=(238, 77, 45, 255))
    draw.ellipse([dot_x - 3, dot_y - 3, dot_x + 3, dot_y + 3], fill=(255, 215, 0, 255))

    # Draw Subtitle: "AUTHENTIC MOBILE ACCESSORIES"
    sub_text = "A U T H E N T I C   M O B I L E   A C C E S S O R I E S"
    draw.text((tx + 2, ty + 84), sub_text, font=font_small, fill=(100, 116, 139, 255))

    # Save 460x100 half-size supersampled image for ultra crisp edges
    resampled_horizontal = img.resize((460, 100), Image.Resampling.LANCZOS)
    resampled_horizontal.save('public/assets/tech-nest-logo-horizontal.png', 'PNG')
    resampled_horizontal.save('public/assets/tech-nest-logo.png', 'PNG')
    print("Horizontal logo PNG generated.")

    # 2. Square App Icon (512x512 supersampled from 1024x1024)
    size = 1024
    icon_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    icon_draw = ImageDraw.Draw(icon_img)

    # Rounded Squircle Background (Deep Obsidian Navy #0F172A)
    # Using rounded rectangle
    icon_draw.rounded_rectangle([32, 32, size - 32, size - 32], radius=220, fill=(15, 23, 42, 255))
    # Subtle inner border
    icon_draw.rounded_rectangle([34, 34, size - 34, size - 34], radius=218, outline=(255, 255, 255, 30), width=8)

    # Hexagon Emblem
    icx, icy = size // 2, size // 2
    ir = 320
    i_outer = get_hex_points(icx, icy, ir)
    icon_draw.polygon(i_outer, fill=(238, 77, 45, 255))

    i_inner = get_hex_points(icx, icy, ir - 48)
    icon_draw.polygon(i_inner, fill=(16, 38, 61, 255))

    # Scaled N
    scale = 3.6
    in_pts = [(icx + (px - cx) * scale, icy + (py - cy) * scale) for px, py in n_pts]
    icon_draw.polygon(in_pts, fill=(255, 255, 255, 250))

    # Scaled Spark
    ispark_pts = [(icx + (px - cx) * scale, icy + (py - cy) * scale) for px, py in spark_pts]
    icon_draw.polygon(ispark_pts, fill=(255, 215, 0, 255))

    # Corner dots
    for px, py in i_outer:
        icon_draw.ellipse([px - 14, py - 14, px + 14, py + 14], fill=(255, 255, 255, 255))

    resampled_icon = icon_img.resize((512, 512), Image.Resampling.LANCZOS)
    resampled_icon.save('public/assets/tech-nest-icon.png', 'PNG')

    resampled_favicon = icon_img.resize((192, 192), Image.Resampling.LANCZOS)
    resampled_favicon.save('public/favicon.png', 'PNG')
    print("Icon and favicon PNG generated.")

if __name__ == '__main__':
    render_png_logos()
