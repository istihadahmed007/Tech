import os
from PIL import Image, ImageFilter, ImageEnhance, ImageOps

def create_ice_blue_canvas(size=(1000, 1000)):
    w, h = size
    canvas = Image.new('RGB', size, (244, 250, 253))
    # Radial or smooth linear soft gradient
    for y in range(h):
        factor = y / float(h)
        # Ice blue gradient #F4FAFD (244, 250, 253) to #DDF4FC (221, 244, 252)
        r = int(244 * (1 - factor*0.4) + 221 * (factor*0.4))
        g = int(250 * (1 - factor*0.3) + 244 * (factor*0.3))
        b = int(253 * (1 - factor*0.1) + 252 * (factor*0.1))
        for x in range(w):
            # subtle vignette towards edges
            dx = (x - w/2) / (w/2)
            dy = (y - h/2) / (h/2)
            dist = min(1.0, (dx*dx + dy*dy)**0.5)
            cr = max(0, int(r - dist * 8))
            cg = max(0, int(g - dist * 6))
            cb = max(0, int(b - dist * 4))
            canvas.putpixel((x, y), (cr, cg, cb))
    return canvas

print("Generating high-resolution category and showcase assets...")

# 1. CAT-CHARGING (1000x1000)
# Hero composite of verified charger (p07) and 4-in-1 cable (p20)
def generate_cat_charging():
    bg = Image.new('RGB', (1000, 1000), (244, 250, 253))
    
    # Load p07-oppo-style-27w-charger.jpg and p20-recrsi-4in1-cable.jpg
    with Image.open('public/assets/products/p20-recrsi-4in1-cable.jpg') as cable:
        cable_res = cable.resize((700, 700), Image.Resampling.LANCZOS)
        # Place cable centered slightly right
        bg.paste(cable_res, (150, 150))
        
    with Image.open('public/assets/products/p07-oppo-style-27w-charger.jpg') as chg:
        chg_res = chg.resize((480, 480), Image.Resampling.LANCZOS)
        # Add shadow
        shadow = Image.new('RGBA', (500, 500), (0, 0, 0, 0))
        s_mask = Image.new('L', (480, 480), 30)
        shadow.paste((15, 30, 45, 25), (10, 10), mask=s_mask)
        shadow = shadow.filter(ImageFilter.GaussianBlur(12))
        bg.paste(shadow, (60, 470), mask=shadow.split()[3])
        bg.paste(chg_res, (70, 480))
        
    bg.save('public/assets/cat-charging.jpg', 'JPEG', quality=94, optimize=True)
    print("Saved public/assets/cat-charging.jpg (1000x1000)")

# 2. CAT-AUDIO (1000x1000)
# Hero composite of h2 pro tws and tucci a5 / oraimo headset
def generate_cat_audio():
    bg = Image.new('RGB', (1000, 1000), (244, 250, 253))
    
    with Image.open('public/assets/products/oraimo-or08-headset.jpg') as hs:
        hs_res = hs.resize((720, 720), Image.Resampling.LANCZOS)
        bg.paste(hs_res, (220, 80))
        
    with Image.open('public/assets/products/h2-anc-pro-tws.jpg') as tws:
        tws_res = tws.resize((480, 480), Image.Resampling.LANCZOS)
        shadow = Image.new('RGBA', (500, 500), (0, 0, 0, 0))
        s_mask = Image.new('L', (480, 480), 30)
        shadow.paste((15, 30, 45, 25), (10, 10), mask=s_mask)
        shadow = shadow.filter(ImageFilter.GaussianBlur(12))
        bg.paste(shadow, (50, 470), mask=shadow.split()[3])
        bg.paste(tws_res, (60, 480))
        
    bg.save('public/assets/cat-audio.jpg', 'JPEG', quality=94, optimize=True)
    print("Saved public/assets/cat-audio.jpg (1000x1000)")

# 3. CAT-WEARABLES (1000x1000)
# Hero composite of y80 ultra (p11) and t800 ultra 2 (p13)
def generate_cat_wearables():
    bg = Image.new('RGB', (1000, 1000), (244, 250, 253))
    
    with Image.open('public/assets/products/p11-y80-ultra-smartwatch.jpg') as w1:
        w1_res = w1.resize((750, 750), Image.Resampling.LANCZOS)
        bg.paste(w1_res, (200, 80))
        
    with Image.open('public/assets/products/p13-t800-ultra2-smartwatch.jpg') as w2:
        w2_res = w2.resize((480, 480), Image.Resampling.LANCZOS)
        shadow = Image.new('RGBA', (500, 500), (0, 0, 0, 0))
        s_mask = Image.new('L', (480, 480), 30)
        shadow.paste((15, 30, 45, 25), (10, 10), mask=s_mask)
        shadow = shadow.filter(ImageFilter.GaussianBlur(12))
        bg.paste(shadow, (50, 470), mask=shadow.split()[3])
        bg.paste(w2_res, (60, 480))
        
    bg.save('public/assets/cat-wearables.jpg', 'JPEG', quality=94, optimize=True)
    print("Saved public/assets/cat-wearables.jpg (1000x1000)")

generate_cat_charging()
generate_cat_audio()
generate_cat_wearables()
