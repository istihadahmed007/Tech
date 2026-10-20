from PIL import Image, ImageDraw, ImageFont
import math

size = (800, 800)
img = Image.new('RGB', size, (244, 250, 253))
draw = ImageDraw.Draw(img)

# Soft gradient background
for y in range(800):
    factor = y / 800.0
    r = int(244 * (1 - factor) + 234 * factor)
    g = int(250 * (1 - factor) + 244 * factor)
    b = int(253 * (1 - factor) + 252 * factor)
    draw.line([(0, y), (800, y)], fill=(r, g, b))

# Subtle rounded border
draw.rounded_rectangle([32, 32, 768, 768], radius=24, outline=(220, 234, 241), width=2)

# Cube / Hexagon icon at center (400, 340)
cx, cy = 400, 340
radius = 70
points = []
for i in range(6):
    angle = math.radians(60 * i - 30)
    x = cx + radius * math.cos(angle)
    y = cy + radius * math.sin(angle)
    points.append((x, y))

# Draw 3D cube facets
draw.polygon([points[0], points[1], (cx, cy), points[5]], fill=(221, 244, 252), outline=(22, 143, 194), width=3)
draw.polygon([points[1], points[2], points[3], (cx, cy)], fill=(184, 231, 248), outline=(22, 143, 194), width=3)
draw.polygon([(cx, cy), points[3], points[4], points[5]], fill=(200, 238, 250), outline=(22, 143, 194), width=3)

# Center dot
draw.ellipse([cx - 10, cy - 10, cx + 10, cy + 10], fill=(16, 42, 67))

# Text
try:
    font_bold = ImageFont.truetype('arialbd.ttf', 20)
    font_sub = ImageFont.truetype('arial.ttf', 14)
    font_tiny = ImageFont.truetype('arialbd.ttf', 12)
except Exception:
    font_bold = ImageFont.load_default()
    font_sub = ImageFont.load_default()
    font_tiny = ImageFont.load_default()

draw.text((400, 460), "IMAGE PENDING VERIFICATION", fill=(16, 42, 67), font=font_bold, anchor="mm")
draw.text((400, 495), "Authentic studio photography in review", fill=(98, 120, 138), font=font_sub, anchor="mm")
draw.text((400, 720), "TECH VARTUAL TUTOR • VERIFIED CATALOG", fill=(148, 163, 184), font=font_tiny, anchor="mm")

img.save('public/assets/product-placeholder.png', 'PNG', optimize=True)
print('Generated public/assets/product-placeholder.png successfully')
