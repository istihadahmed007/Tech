import os
from PIL import Image, ImageEnhance, ImageFilter

src_dir = 'docs/original_references'
dest_dir = 'public/assets/products'
os.makedirs(dest_dir, exist_ok=True)

def studio_export(crop_img, out_path, target_size=(1000, 1000), bg=(255, 255, 255)):
    if crop_img.mode in ('RGBA', 'P'):
        crop_img = crop_img.convert('RGB')
    cw, ch = crop_img.size
    tw, th = target_size
    pad = 40
    avail_w = tw - (pad * 2)
    avail_h = th - (pad * 2)
    
    scale = min(avail_w / cw, avail_h / ch)
    nw = max(1, int(cw * scale))
    nh = max(1, int(ch * scale))
    
    resized = crop_img.resize((nw, nh), Image.Resampling.LANCZOS)
    resized = ImageEnhance.Contrast(resized).enhance(1.04)
    resized = ImageEnhance.Sharpness(resized).enhance(1.10)
    
    canvas = Image.new("RGB", target_size, bg)
    px = (tw - nw) // 2
    py = (th - nh) // 2
    canvas.paste(resized, (px, py))
    canvas.save(out_path, "JPEG", quality=92, optimize=True)
    print(f"Exported: {os.path.basename(out_path)} ({nw}x{nh})")

def run():
    print("Generating model-matched authentic gallery images from P01-P26 references...")

    # P01: White Pro TWS
    with Image.open(os.path.join(src_dir, 'image.jpg')) as im:
        # Alt box (left box)
        crop_alt = im.crop((50, 420, 460, 850))
        studio_export(crop_alt, os.path.join(dest_dir, 'p01-pro-tws-box-alt.jpg'))
        # Earbud stem detail from packaging
        crop_stem = im.crop((520, 480, 820, 780))
        studio_export(crop_stem, os.path.join(dest_dir, 'p01-pro-tws-stem-detail.jpg'))

    # P02: REMAX RC-155a from image2.jpg (P02)
    with Image.open(os.path.join(src_dir, 'image2.jpg')) as im:
        crop_p02 = im.crop((200, 100, 1050, 1500))
        studio_export(crop_p02, os.path.join(dest_dir, 'p02-remax-rc155a-pkg-p02.jpg'))

    # P21: REMAX RC-155a connector detail
    with Image.open(os.path.join(src_dir, 'image21.jpg')) as im:
        crop_con = im.crop((350, 250, 600, 520))
        studio_export(crop_con, os.path.join(dest_dir, 'p02-remax-rc155a-connector-detail.jpg'))

    # P03: SM 007 controller & ear tips from image3.jpg
    with Image.open(os.path.join(src_dir, 'image3.jpg')) as im:
        rot = im.rotate(270, expand=True)
        crop_ctrl = rot.crop((200, 60, 800, 560))
        studio_export(crop_ctrl, os.path.join(dest_dir, 'p03-sm007-controller.jpg'))

    # P05: VDENMENV DR06 package crops
    with Image.open(os.path.join(src_dir, 'image5.jpg')) as im:
        crop_p05 = im.crop((120, 120, 1080, 1480))
        studio_export(crop_p05, os.path.join(dest_dir, 'p05-vdenmenv-dr06-pkg-p05.jpg'))
        crop_mic = im.crop((350, 400, 850, 950))
        studio_export(crop_mic, os.path.join(dest_dir, 'p05-vdenmenv-dr06-inline-mic.jpg'))

    # P06: Individual packaging crops
    with Image.open(os.path.join(src_dir, 'image6.jpg')) as im:
        # Samsung box
        crop_sam = im.crop((20, 0, 240, 350))
        studio_export(crop_sam, os.path.join(dest_dir, 'p06-samsung-pkg.jpg'))
        # realme box
        crop_rm = im.crop((230, 0, 690, 440))
        studio_export(crop_rm, os.path.join(dest_dir, 'p06-realme-pkg.jpg'))
        # OnePlus box
        crop_1p = im.crop((630, 100, 990, 510))
        studio_export(crop_1p, os.path.join(dest_dir, 'p06-oneplus-pkg.jpg'))
        # Lenovo box
        crop_len = im.crop((0, 310, 360, 890))
        studio_export(crop_len, os.path.join(dest_dir, 'p06-lenovo-pkg.jpg'))
        # OPPO box
        crop_oppo = im.crop((280, 380, 610, 890))
        studio_export(crop_oppo, os.path.join(dest_dir, 'p06-oppo-pkg.jpg'))
        # Mi box
        crop_mi = im.crop((520, 440, 820, 900))
        studio_export(crop_mi, os.path.join(dest_dir, 'p06-mi-pkg.jpg'))

    # P07: OPPO 27W wall charger
    with Image.open(os.path.join(src_dir, 'image7.jpg')) as im:
        crop_orig = im.crop((180, 380, 1020, 1280))
        studio_export(crop_orig, os.path.join(dest_dir, 'p07-oppo-charger-original.jpg'))
        crop_pins = im.crop((350, 420, 750, 800))
        studio_export(crop_pins, os.path.join(dest_dir, 'p07-oppo-charger-pins.jpg'))

    # P08: OTG Adapter
    with Image.open(os.path.join(src_dir, 'image8.jpg')) as im:
        crop_card = im.crop((160, 240, 1040, 1360))
        studio_export(crop_card, os.path.join(dest_dir, 'p08-otg-card-pkg.jpg'))
        crop_tips = im.crop((400, 500, 850, 950))
        studio_export(crop_tips, os.path.join(dest_dir, 'p08-otg-connectors.jpg'))

    # P09: TUCCI A5 Fighter
    with Image.open(os.path.join(src_dir, 'image9.jpg')) as im:
        crop_mic = im.crop((250, 450, 850, 1100))
        studio_export(crop_mic, os.path.join(dest_dir, 'p09-tucci-a5-boom-mic.jpg'))
        crop_cup = im.crop((180, 300, 700, 850))
        studio_export(crop_cup, os.path.join(dest_dir, 'p09-tucci-a5-earcup.jpg'))

    # P10: KW68 Mini
    with Image.open(os.path.join(src_dir, 'image10.jpg')) as im:
        crop_box = im.crop((200, 200, 660, 890)).rotate(90, expand=True)
        crop_straps = crop_box.crop((100, 50, 650, 400))
        studio_export(crop_straps, os.path.join(dest_dir, 'p10-kw68-mini-strap-set.jpg'))
        crop_face = crop_box.crop((300, 100, 600, 380))
        studio_export(crop_face, os.path.join(dest_dir, 'p10-kw68-mini-face.jpg'))

    # P11: Y80 Ultra
    with Image.open(os.path.join(src_dir, 'image11.jpg')) as im:
        crop_straps = im.crop((250, 400, 950, 1200))
        studio_export(crop_straps, os.path.join(dest_dir, 'p11-y80-ultra-straps.jpg'))

    # P12: LAXASFIT K10 Ultra
    with Image.open(os.path.join(src_dir, 'image12.jpg')) as im:
        crop_sim = im.crop((200, 400, 900, 1100))
        studio_export(crop_sim, os.path.join(dest_dir, 'p12-laxasfit-k10-sim-detail.jpg'))
        crop_dial = im.crop((350, 500, 800, 950))
        studio_export(crop_dial, os.path.join(dest_dir, 'p12-laxasfit-k10-dial.jpg'))

    # P13: T800 Ultra 2
    with Image.open(os.path.join(src_dir, 'image13.jpg')) as im:
        crop_dial = im.crop((250, 300, 850, 950))
        studio_export(crop_dial, os.path.join(dest_dir, 'p13-t800-ultra2-dial.jpg'))
        crop_specs = im.crop((200, 800, 900, 1300))
        studio_export(crop_specs, os.path.join(dest_dir, 'p13-t800-ultra2-specs.jpg'))

    # P14/P19: Oraimo OR-08
    with Image.open(os.path.join(src_dir, 'image14.jpg')) as im:
        crop_cup = im.crop((250, 350, 850, 950))
        studio_export(crop_cup, os.path.join(dest_dir, 'p14-oraimo-or08-earcup.jpg'))

    # P15: SAN-002 Luminous
    with Image.open(os.path.join(src_dir, 'image15.jpg')) as im:
        crop_pkg = im.crop((120, 150, 1080, 1450))
        studio_export(crop_pkg, os.path.join(dest_dir, 'p15-san002-pkg.jpg'))
        crop_glow = im.crop((250, 350, 850, 950))
        studio_export(crop_glow, os.path.join(dest_dir, 'p15-san002-earcup-detail.jpg'))

    # P16: ANKEER NK-NY200
    with Image.open(os.path.join(src_dir, 'image16.jpg')) as im:
        crop_pkg = im.crop((120, 150, 1080, 1450))
        studio_export(crop_pkg, os.path.join(dest_dir, 'p16-ankeer-nk-ny200-pkg.jpg'))
        crop_cup = im.crop((250, 350, 850, 950))
        studio_export(crop_cup, os.path.join(dest_dir, 'p16-ankeer-nk-ny200-earcup.jpg'))

    # P17: TUCCI Q8 USB
    with Image.open(os.path.join(src_dir, 'image17.jpg')) as im:
        crop_pkg = im.crop((120, 150, 1080, 1450))
        studio_export(crop_pkg, os.path.join(dest_dir, 'p17-tucci-q8-pkg.jpg'))
        crop_mic = im.crop((250, 350, 850, 950))
        studio_export(crop_mic, os.path.join(dest_dir, 'p17-tucci-q8-mic.jpg'))

    # P18: T9 Luminous
    with Image.open(os.path.join(src_dir, 'image18.jpg')) as im:
        crop_pkg = im.crop((120, 150, 1080, 1450))
        studio_export(crop_pkg, os.path.join(dest_dir, 'p18-t9-luminous-pkg.jpg'))
        crop_cup = im.crop((250, 350, 850, 950))
        studio_export(crop_cup, os.path.join(dest_dir, 'p18-t9-luminous-earcup.jpg'))

    # P20: RECRSI 4-in-1
    with Image.open(os.path.join(src_dir, 'image20.jpg')) as im:
        crop_con = im.crop((200, 200, 750, 800))
        studio_export(crop_con, os.path.join(dest_dir, 'p20-recrsi-4in1-connectors.jpg'))

    # P22: Hoco BT Diamond 700H
    with Image.open(os.path.join(src_dir, 'image22.jpg')) as im:
        crop_pkg = im.crop((80, 80, 920, 1120))
        studio_export(crop_pkg, os.path.join(dest_dir, 'p22-hoco-bt-diamond-pkg.jpg'))
        crop_ctrl = im.crop((250, 250, 750, 750))
        studio_export(crop_ctrl, os.path.join(dest_dir, 'p22-hoco-bt-diamond-controls.jpg'))

    # P23: D50L, D50T, DR06
    with Image.open(os.path.join(src_dir, 'image23.jpg')) as im:
        # D50L pkg & tip
        crop_d50l = im.crop((0, 150, 360, 1400))
        studio_export(crop_d50l, os.path.join(dest_dir, 'p23-vdenmenv-d50l-pkg.jpg'))
        crop_d50l_tip = im.crop((40, 250, 320, 550))
        studio_export(crop_d50l_tip, os.path.join(dest_dir, 'p23-vdenmenv-d50l-connector.jpg'))

        # D50T pkg & tip
        crop_d50t = im.crop((310, 150, 700, 1400))
        studio_export(crop_d50t, os.path.join(dest_dir, 'p23-vdenmenv-d50t-pkg.jpg'))
        crop_d50t_tip = im.crop((360, 250, 650, 550))
        studio_export(crop_d50t_tip, os.path.join(dest_dir, 'p23-vdenmenv-d50t-connector.jpg'))

    # P25: Pro-style Black TWS
    with Image.open(os.path.join(src_dir, 'image25.jpg')) as im:
        crop_pkg = im.crop((120, 150, 1080, 1450))
        studio_export(crop_pkg, os.path.join(dest_dir, 'p25-pro-tws-black-pkg.jpg'))
        crop_det = im.crop((250, 300, 850, 900))
        studio_export(crop_det, os.path.join(dest_dir, 'p25-pro-tws-black-detail.jpg'))

    # P26: DON-X20 & separate models
    with Image.open(os.path.join(src_dir, 'image26.jpg')) as im:
        # DON-X20 single upright package
        crop_don_pkg = im.crop((480, 400, 720, 800))
        studio_export(crop_don_pkg, os.path.join(dest_dir, 'p26-don-x20-pkg.jpg'))
        crop_don_plug = im.crop((510, 520, 690, 720))
        studio_export(crop_don_plug, os.path.join(dest_dir, 'p26-don-x20-plug.jpg'))

        # SF30 box
        crop_sf = im.crop((130, 0, 300, 230))
        studio_export(crop_sf, os.path.join(dest_dir, 'p26-sf30-pkg.jpg'))

        # SH-777 box
        crop_sh = im.crop((460, 0, 650, 210))
        studio_export(crop_sh, os.path.join(dest_dir, 'p26-sh777-pkg.jpg'))

        # KIN box
        crop_kin = im.crop((340, 750, 850, 950))
        studio_export(crop_kin, os.path.join(dest_dir, 'p26-kin-pkg.jpg'))

    print("All authentic multi-angle gallery assets successfully created!")

if __name__ == '__main__':
    run()
