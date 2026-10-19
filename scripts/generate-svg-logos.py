import os
import base64
from PIL import Image

def generate_svg_logos():
    # 1. Square Icon SVG
    with open('public/assets/tech-nest-icon.png', 'rb') as f:
        icon_b64 = base64.b64encode(f.read()).decode('utf-8')

    svg_icon = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="data:image/png;base64,{icon_b64}" width="512" height="512" preserveAspectRatio="xMidYMid meet" />
</svg>'''

    with open('public/assets/tech-nest-icon.svg', 'w', encoding='utf-8') as f:
        f.write(svg_icon)
    with open('public/favicon.svg', 'w', encoding='utf-8') as f:
        f.write(svg_icon)

    # 2. Horizontal Logo SVG
    with open('public/assets/tech-nest-logo-horizontal.png', 'rb') as f:
        h_b64 = base64.b64encode(f.read()).decode('utf-8')

    h_im = Image.open('public/assets/tech-nest-logo-horizontal.png')
    hw, hh = h_im.size

    svg_h = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {hw} {hh}" width="{hw}" height="{hh}">
  <image href="data:image/png;base64,{h_b64}" width="{hw}" height="{hh}" preserveAspectRatio="xMidYMid meet" />
</svg>'''

    with open('public/assets/tech-nest-logo-horizontal.svg', 'w', encoding='utf-8') as f:
        f.write(svg_h)
    with open('public/assets/tech-nest-logo.svg', 'w', encoding='utf-8') as f:
        f.write(svg_h)

    print("SVG assets generated with high-res authentic new logo data.")

if __name__ == '__main__':
    generate_svg_logos()
