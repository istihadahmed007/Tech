import os
import subprocess

def main():
    with open('public/assets/vartualtutor-logo.svg', 'r', encoding='utf-8') as f:
        vt_svg = f.read()

    defs_start = vt_svg.find('<defs>')
    defs_end = vt_svg.find('</defs>') + 7
    defs_content = vt_svg[defs_start:defs_end]

    emblem_start = vt_svg.find('<!-- EMBLEM GROUP -->')
    emblem_end = vt_svg.find('<!-- TYPOGRAPHY SECTION -->')
    emblem_content = vt_svg[emblem_start:emblem_end].strip()

    horizontal_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 180" width="880" height="180">
{defs_content}
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&amp;family=Hind+Siliguri:wght@600;700&amp;display=swap');
    .brand-title {{
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      font-weight: 800;
      font-size: 50px;
      letter-spacing: -0.5px;
    }}
    .brand-sub {{
      font-family: 'Hind Siliguri', 'Plus Jakarta Sans', system-ui, sans-serif;
      font-weight: 600;
      font-size: 19px;
      letter-spacing: 0.5px;
    }}
  </style>

  <!-- Authentic Vartual Tutor Emblem (Left) -->
  <g transform="translate(-45, -20) scale(0.72)">
    {emblem_content}
  </g>

  <!-- Typography (Right) -->
  <g transform="translate(205, 80)">
    <text class="brand-title">
      <tspan fill="#091E4A">TECH </tspan>
      <tspan fill="#0066FF">VARTUAL TUTOR</tspan>
    </text>
    <text y="38" class="brand-sub">
      <tspan fill="#091E4A">টেক ভার্চুয়াল টিউটর</tspan>
      <tspan fill="#94A3B8"> • </tspan>
      <tspan fill="#0066FF">AUTHENTIC TECH STORE</tspan>
    </text>
  </g>
</svg>"""

    with open('public/assets/tech-vartual-tutor-logo-horizontal.svg', 'w', encoding='utf-8') as f:
        f.write(horizontal_svg)
    print("Created public/assets/tech-vartual-tutor-logo-horizontal.svg")

    dark_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 180" width="880" height="180">
{defs_content}
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&amp;family=Hind+Siliguri:wght@600;700&amp;display=swap');
    .brand-title-dark {{
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      font-weight: 800;
      font-size: 50px;
      letter-spacing: -0.5px;
    }}
    .brand-sub-dark {{
      font-family: 'Hind Siliguri', 'Plus Jakarta Sans', system-ui, sans-serif;
      font-weight: 600;
      font-size: 19px;
      letter-spacing: 0.5px;
    }}
  </style>

  <!-- Authentic Vartual Tutor Emblem (Left) -->
  <g transform="translate(-45, -20) scale(0.72)">
    {emblem_content}
  </g>

  <!-- Typography (Right) -->
  <g transform="translate(205, 80)">
    <text class="brand-title-dark">
      <tspan fill="#FFFFFF">TECH </tspan>
      <tspan fill="#38BDF8">VARTUAL TUTOR</tspan>
    </text>
    <text y="38" class="brand-sub-dark">
      <tspan fill="#CBD5E1">টেক ভার্চুয়াল টিউটর</tspan>
      <tspan fill="#64748B"> • </tspan>
      <tspan fill="#38BDF8">AUTHENTIC TECH STORE</tspan>
    </text>
  </g>
</svg>"""

    with open('public/assets/tech-vartual-tutor-logo-dark.svg', 'w', encoding='utf-8') as f:
        f.write(dark_svg)
    print("Created public/assets/tech-vartual-tutor-logo-dark.svg")

    icon_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="130 75 240 240" width="512" height="512">
{defs_content}
  <rect x="130" y="75" width="240" height="240" rx="36" fill="#ffffff" />
  {emblem_content}
</svg>"""

    with open('public/assets/tech-vartual-tutor-icon.svg', 'w', encoding='utf-8') as f:
        f.write(icon_svg)
    with open('public/favicon.svg', 'w', encoding='utf-8') as f:
        f.write(icon_svg)
    print("Created public/assets/tech-vartual-tutor-icon.svg and public/favicon.svg")

    # Render PNGs using headless Chrome
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    if os.path.exists(chrome_path):
        cwd = os.path.abspath('.')
        
        # HTML wrapper for horizontal logo
        html_h = f"""<!DOCTYPE html><html><body style="margin:0;background:transparent;">
        <img src="file:///{cwd.replace('\\\\', '/')}/public/assets/tech-vartual-tutor-logo-horizontal.svg" style="width:880px;height:180px;display:block;" />
        </body></html>"""
        with open('temp_h.html', 'w', encoding='utf-8') as f:
            f.write(html_h)
            
        subprocess.run([
            chrome_path, '--headless=new', '--disable-gpu',
            '--window-size=880,180',
            '--default-background-color=00000000',
            f'--screenshot={os.path.join(cwd, "public", "assets", "tech-vartual-tutor-logo-horizontal.png")}',
            os.path.join(cwd, 'temp_h.html')
        ], check=True)
        print("Generated public/assets/tech-vartual-tutor-logo-horizontal.png")

        # HTML wrapper for dark logo
        html_d = f"""<!DOCTYPE html><html><body style="margin:0;background:transparent;">
        <img src="file:///{cwd.replace('\\\\', '/')}/public/assets/tech-vartual-tutor-logo-dark.svg" style="width:880px;height:180px;display:block;" />
        </body></html>"""
        with open('temp_d.html', 'w', encoding='utf-8') as f:
            f.write(html_d)
            
        subprocess.run([
            chrome_path, '--headless=new', '--disable-gpu',
            '--window-size=880,180',
            '--default-background-color=00000000',
            f'--screenshot={os.path.join(cwd, "public", "assets", "tech-vartual-tutor-logo-dark.png")}',
            os.path.join(cwd, 'temp_d.html')
        ], check=True)
        print("Generated public/assets/tech-vartual-tutor-logo-dark.png")

        # HTML wrapper for icon
        html_i = f"""<!DOCTYPE html><html><body style="margin:0;background:transparent;">
        <img src="file:///{cwd.replace('\\\\', '/')}/public/assets/tech-vartual-tutor-icon.svg" style="width:512px;height:512px;display:block;" />
        </body></html>"""
        with open('temp_i.html', 'w', encoding='utf-8') as f:
            f.write(html_i)
            
        subprocess.run([
            chrome_path, '--headless=new', '--disable-gpu',
            '--window-size=512,512',
            '--default-background-color=00000000',
            f'--screenshot={os.path.join(cwd, "public", "assets", "tech-vartual-tutor-icon.png")}',
            os.path.join(cwd, 'temp_i.html')
        ], check=True)
        print("Generated public/assets/tech-vartual-tutor-icon.png")

        # Cleanup temp HTML files
        for tmp in ['temp_h.html', 'temp_d.html', 'temp_i.html']:
            if os.path.exists(tmp):
                os.remove(tmp)

if __name__ == '__main__':
    main()
