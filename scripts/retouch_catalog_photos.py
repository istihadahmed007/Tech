import os
from PIL import Image, ImageEnhance, ImageFilter

src_dir = r'C:\Users\Tonmoy\.gemini\antigravity-ide\brain\e2ddf528-0465-4c06-a9e9-8565e1f4ee88\scratch\catalog_data\images'
dest_dir = r'c:\Users\Tonmoy\Documents\Tech\public\assets\products'
os.makedirs(dest_dir, exist_ok=True)

def studio_export(crop_img, out_path, target_size=(800, 800), bg=(248, 250, 252)):
    cw, ch = crop_img.size
    tw, th = target_size
    pad = 32
    avail_w = tw - (pad * 2)
    avail_h = th - (pad * 2)
    
    scale = min(avail_w / cw, avail_h / ch)
    nw = max(1, int(cw * scale))
    nh = max(1, int(ch * scale))
    
    resized = crop_img.resize((nw, nh), Image.Resampling.LANCZOS)
    
    # Mild contrast and sharpness
    resized = ImageEnhance.Contrast(resized).enhance(1.05)
    resized = ImageEnhance.Sharpness(resized).enhance(1.12)
    
    canvas = Image.new("RGB", target_size, bg)
    px = (tw - nw) // 2
    py = (th - nh) // 2
    
    # Subtle studio shadow
    shadow = Image.new("RGBA", (nw + 24, nh + 24), (0, 0, 0, 0))
    s_mask = Image.new("L", (nw, nh), 30)
    shadow.paste((15, 30, 50, 25), (12, 16), mask=s_mask)
    shadow = shadow.filter(ImageFilter.GaussianBlur(10))
    
    canvas.paste(shadow, (px - 12, py - 8), mask=shadow.split()[3])
    canvas.paste(resized, (px, py))
    
    canvas.save(out_path, "JPEG", quality=92, optimize=True)
    print(f"Exported: {os.path.basename(out_path)} ({nw}x{nh} on {tw}x{th})")

def process_all():
    print("Starting comprehensive image processing for P01-P26...")
    
    # P01: White Pro-style TWS
    with Image.open(os.path.join(src_dir, 'image.jpg')) as im:
        # Middle right box
        crop = im.crop((450, 420, 895, 850))
        studio_export(crop, os.path.join(dest_dir, 'p01-pro-tws-white.jpg'))
    
    # P02 & P21: REMAX RC-155a
    with Image.open(os.path.join(src_dir, 'image21.jpg')) as im:
        # Crop package cleanly, remove green stand at bottom
        crop = im.crop((280, 60, 650, 1180))
        studio_export(crop, os.path.join(dest_dir, 'p02-remax-rc155a-cable.jpg'))
    
    # P03: SM 007 Neckband (Rotate 90 deg clockwise)
    with Image.open(os.path.join(src_dir, 'image3.jpg')) as im:
        rot = im.rotate(270, expand=True) # 90 deg clockwise
        # Isolate top box
        crop = rot.crop((80, 40, 1520, 580))
        studio_export(crop, os.path.join(dest_dir, 'p03-sm007-neckband.jpg'))
    
    # P04: Ultrapods Pro (Rotate 90 deg clockwise)
    with Image.open(os.path.join(src_dir, 'image4.jpg')) as im:
        rot = im.rotate(270, expand=True)
        # All
        studio_export(rot, os.path.join(dest_dir, 'p04-ultrapods-pro-all.jpg'))
        # Pink variant (top left)
        crop_pink = rot.crop((30, 20, 520, 580))
        studio_export(crop_pink, os.path.join(dest_dir, 'p04-ultrapods-pro-pink.jpg'))
        # Blue variant (top right)
        crop_blue = rot.crop((520, 20, 1100, 580))
        studio_export(crop_blue, os.path.join(dest_dir, 'p04-ultrapods-pro-blue.jpg'))
        # Green variant (bottom left)
        crop_green = rot.crop((30, 580, 560, 1160))
        studio_export(crop_green, os.path.join(dest_dir, 'p04-ultrapods-pro-green.jpg'))
        # Black variant (bottom right)
        crop_black = rot.crop((580, 580, 1180, 1160))
        studio_export(crop_black, os.path.join(dest_dir, 'p04-ultrapods-pro-black.jpg'))
    
    # P05: VDENMENV DR06
    with Image.open(os.path.join(src_dir, 'image5.jpg')) as im:
        crop = im.crop((120, 120, 1080, 1480))
        studio_export(crop, os.path.join(dest_dir, 'p05-vdenmenv-dr06-earphones.jpg'))
    
    # P06: Assorted Pro-style TWS boxes
    with Image.open(os.path.join(src_dir, 'image6.jpg')) as im:
        studio_export(im, os.path.join(dest_dir, 'p06-assorted-tws-set.jpg'))
        # Samsung
        crop_sam = im.crop((20, 0, 240, 350))
        studio_export(crop_sam, os.path.join(dest_dir, 'p06-samsung-tws.jpg'))
        # realme
        crop_rm = im.crop((230, 0, 690, 440))
        studio_export(crop_rm, os.path.join(dest_dir, 'p06-realme-tws.jpg'))
        # OnePlus
        crop_1p = im.crop((630, 100, 990, 510))
        studio_export(crop_1p, os.path.join(dest_dir, 'p06-oneplus-tws.jpg'))
        # Lenovo
        crop_len = im.crop((0, 310, 360, 890))
        studio_export(crop_len, os.path.join(dest_dir, 'p06-lenovo-tws.jpg'))
        # OPPO
        crop_oppo = im.crop((280, 380, 610, 890))
        studio_export(crop_oppo, os.path.join(dest_dir, 'p06-oppo-tws.jpg'))
        # Mi
        crop_mi = im.crop((520, 440, 820, 900))
        studio_export(crop_mi, os.path.join(dest_dir, 'p06-mi-tws.jpg'))
    
    # P07: OPPO 27W wall charger
    with Image.open(os.path.join(src_dir, 'image7.jpg')) as im:
        crop = im.crop((180, 380, 1020, 1280))
        studio_export(crop, os.path.join(dest_dir, 'p07-oppo-style-27w-charger.jpg'))
    
    # P08: 2-in-1 OTG Adapter
    with Image.open(os.path.join(src_dir, 'image8.jpg')) as im:
        crop = im.crop((160, 240, 1040, 1360))
        studio_export(crop, os.path.join(dest_dir, 'p08-2in1-otg-adapter.jpg'))
    
    # P09: TUCCI A5 Fighter Headset
    with Image.open(os.path.join(src_dir, 'image9.jpg')) as im:
        crop = im.crop((100, 180, 1100, 1420))
        studio_export(crop, os.path.join(dest_dir, 'p09-tucci-a5-fighter-headset.jpg'))
    
    # P10: KW68 Mini Smartwatch (rotate 90 counter-clockwise so watch face is upright)
    with Image.open(os.path.join(src_dir, 'image10.jpg')) as im:
        # Crop the box first
        crop_box = im.crop((200, 200, 660, 890))
        rot_box = crop_box.rotate(90, expand=True) # rotate watch face upright
        studio_export(rot_box, os.path.join(dest_dir, 'p10-kw68-mini-smartwatch.jpg'))
    
    # P11: Y80 Ultra Smartwatch
    with Image.open(os.path.join(src_dir, 'image11.jpg')) as im:
        crop = im.crop((120, 150, 1080, 1450))
        studio_export(crop, os.path.join(dest_dir, 'p11-y80-ultra-smartwatch.jpg'))
    
    # P12: LAXASFIT K10 Ultra 2G SIM Watch
    with Image.open(os.path.join(src_dir, 'image12.jpg')) as im:
        crop = im.crop((120, 150, 1080, 1450))
        studio_export(crop, os.path.join(dest_dir, 'p12-laxasfit-k10-ultra-sim-watch.jpg'))
    
    # P13: T800 Ultra 2 Smartwatch
    with Image.open(os.path.join(src_dir, 'image13.jpg')) as im:
        crop = im.crop((120, 150, 1080, 1450))
        studio_export(crop, os.path.join(dest_dir, 'p13-t800-ultra2-smartwatch.jpg'))
    
    # P14 & P19: Oraimo OR-08 Wireless Headset
    with Image.open(os.path.join(src_dir, 'image14.jpg')) as im:
        crop = im.crop((120, 150, 1080, 1450))
        studio_export(crop, os.path.join(dest_dir, 'p14-oraimo-or08-headset.jpg'))
    
    # P15: SAN-002 Luminous Wireless Headphones
    with Image.open(os.path.join(src_dir, 'image15.jpg')) as im:
        crop = im.crop((120, 150, 1080, 1450))
        studio_export(crop, os.path.join(dest_dir, 'p15-san002-luminous-headphones.jpg'))
    
    # P16: ANKEER NK-NY200 Wireless Headphones
    with Image.open(os.path.join(src_dir, 'image16.jpg')) as im:
        crop = im.crop((120, 150, 1080, 1450))
        studio_export(crop, os.path.join(dest_dir, 'p16-ankeer-nk-ny200-headphones.jpg'))
    
    # P17: TUCCI Q8 USB Headset
    with Image.open(os.path.join(src_dir, 'image17.jpg')) as im:
        crop = im.crop((120, 150, 1080, 1450))
        studio_export(crop, os.path.join(dest_dir, 'p17-tucci-q8-usb-headset.jpg'))
    
    # P18: T9 Luminous Wireless Headphones
    with Image.open(os.path.join(src_dir, 'image18.jpg')) as im:
        crop = im.crop((120, 150, 1080, 1450))
        studio_export(crop, os.path.join(dest_dir, 'p18-t9-luminous-headphones.jpg'))
    
    # P20: RECRSI 4-in-1 Fast Cable
    with Image.open(os.path.join(src_dir, 'image20.jpg')) as im:
        crop = im.crop((80, 80, 860, 1170))
        studio_export(crop, os.path.join(dest_dir, 'p20-recrsi-4in1-cable.jpg'))
    
    # P22: Hoco BT Diamond 700H Neckband
    with Image.open(os.path.join(src_dir, 'image22.jpg')) as im:
        crop = im.crop((80, 80, 920, 1120))
        studio_export(crop, os.path.join(dest_dir, 'p22-hoco-bt-diamond-700h.jpg'))
    
    # P23: VDENMENV D50L, D50T, DR06
    with Image.open(os.path.join(src_dir, 'image23.jpg')) as im:
        studio_export(im, os.path.join(dest_dir, 'p23-vdenmenv-trio.jpg'))
        # D50L Lightning (purple)
        crop_l = im.crop((0, 150, 360, 1400))
        studio_export(crop_l, os.path.join(dest_dir, 'p23-vdenmenv-d50l-lightning.jpg'))
        # D50T Type-C (blue)
        crop_t = im.crop((310, 150, 700, 1400))
        studio_export(crop_t, os.path.join(dest_dir, 'p23-vdenmenv-d50t-typec.jpg'))
        # DR06 (turquoise)
        crop_e = im.crop((660, 150, 1050, 1400))
        studio_export(crop_e, os.path.join(dest_dir, 'p23-vdenmenv-dr06.jpg'))
    
    # P25: Black Pro-style TWS
    with Image.open(os.path.join(src_dir, 'image25.jpg')) as im:
        crop = im.crop((120, 150, 1080, 1450))
        studio_export(crop, os.path.join(dest_dir, 'p25-pro-tws-black.jpg'))
    
    # P26: DON-X20 & Mixed Stock
    with Image.open(os.path.join(src_dir, 'image26.jpg')) as im:
        studio_export(im, os.path.join(dest_dir, 'p26-mixed-shelf-stock.jpg'))
        # DON-X20 single upright box
        crop_don = im.crop((510, 440, 690, 760))
        studio_export(crop_don, os.path.join(dest_dir, 'p26-don-x20-earphones.jpg'))
        # SF30 box
        crop_sf = im.crop((130, 0, 300, 230))
        studio_export(crop_sf, os.path.join(dest_dir, 'p26-sf30-earphones.jpg'))
        # SH-777 4-in-1 box
        crop_sh = im.crop((460, 0, 650, 210))
        studio_export(crop_sh, os.path.join(dest_dir, 'p26-sh777-earphones.jpg'))
        # KIN box
        crop_kin = im.crop((340, 750, 850, 950))
        studio_export(crop_kin, os.path.join(dest_dir, 'p26-kin-earphones.jpg'))

    print("All P01-P26 studio retouched assets successfully generated!")

if __name__ == '__main__':
    process_all()
