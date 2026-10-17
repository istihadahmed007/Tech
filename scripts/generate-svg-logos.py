import os
from PIL import Image, ImageDraw, ImageFont

def create_tech_nest_assets():
    # 1. Generate master horizontal SVG
    svg_horizontal = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 100" width="460" height="100" fill="none">
  <defs>
    <linearGradient id="tnFlame" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF6B4A" />
      <stop offset="50%" stop-color="#EE4D2D" />
      <stop offset="100%" stop-color="#D73211" />
    </linearGradient>
    <linearGradient id="tnGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF275" />
      <stop offset="100%" stop-color="#FFB300" />
    </linearGradient>
    <linearGradient id="tnNavy" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A5F" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#EE4D2D" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- LOGO EMBLEM (Hexagonal Nest + Power Spark) -->
  <g transform="translate(10, 8)" filter="url(#subtleGlow)">
    <!-- Outer Shield / Hexagon -->
    <path d="M42 4 L74 22 L74 62 L42 80 L10 62 L10 22 Z" 
          fill="url(#tnFlame)" rx="4" />
    
    <!-- Inner Geometric Hex Nest Lines (Navy Core) -->
    <path d="M42 12 L66 26 L66 58 L42 72 L18 58 L18 26 Z" 
          fill="url(#tnNavy)" />

    <!-- Stylized Geometric 'N' Circuit Tracks (Orange & White) -->
    <path d="M26 54 L26 30 L34 30 L50 54 L50 30 L58 30 L58 54 L50 54 L34 30 L34 54 Z" 
          fill="#FFFFFF" opacity="0.95" />

    <!-- Central Energy Lightning Bolt / Spark -->
    <path d="M44 24 L36 42 L43 42 L39 60 L50 38 L43 38 Z" 
          fill="url(#tnGold)" />
          
    <!-- Decorative Tech Circuit Nodes -->
    <circle cx="42" cy="7" r="2.5" fill="#FFFFFF" />
    <circle cx="71" cy="24" r="2.5" fill="#FFFFFF" />
    <circle cx="71" cy="60" r="2.5" fill="#FFFFFF" />
    <circle cx="42" cy="77" r="2.5" fill="#FFFFFF" />
    <circle cx="13" cy="60" r="2.5" fill="#FFFFFF" />
    <circle cx="13" cy="24" r="2.5" fill="#FFFFFF" />
  </g>

  <!-- LOGO WORDMARK TYPOGRAPHY -->
  <g transform="translate(112, 12)">
    <!-- TECH in Premium Obsidian Navy -->
    <text x="0" y="44" 
          font-family="system-ui, -apple-system, 'Plus Jakarta Sans', 'Inter', sans-serif" 
          font-size="44" 
          font-weight="900" 
          letter-spacing="-1.2px" 
          fill="#10263D">TECH</text>

    <!-- NEST in Vibrant Brand Orange -->
    <text x="134" y="44" 
          font-family="system-ui, -apple-system, 'Plus Jakarta Sans', 'Inter', sans-serif" 
          font-size="44" 
          font-weight="900" 
          letter-spacing="-1.2px" 
          fill="url(#tnFlame)">NEST</text>

    <!-- Brand Pulse Spark Dot -->
    <circle cx="266" cy="22" r="5" fill="#EE4D2D" />
    <circle cx="266" cy="22" r="2.5" fill="#FFD700" />

    <!-- Subtitle / Tagline: AUTHENTIC MOBILE ACCESSORIES -->
    <text x="2" y="66" 
          font-family="system-ui, -apple-system, 'Plus Jakarta Sans', 'Inter', sans-serif" 
          font-size="10.5" 
          font-weight="700" 
          letter-spacing="3.2px" 
          fill="#64748B">AUTHENTIC MOBILE ACCESSORIES</text>

    <!-- Micro Tech Accents -->
    <line x1="2" y1="74" x2="258" y2="74" stroke="#EE4D2D" stroke-width="1.5" stroke-opacity="0.3" stroke-dasharray="6 3" />
  </g>
</svg>'''

    # 2. Generate square app icon SVG
    svg_icon = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128" fill="none">
  <defs>
    <linearGradient id="tnFlameIcon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF6B4A" />
      <stop offset="50%" stop-color="#EE4D2D" />
      <stop offset="100%" stop-color="#D73211" />
    </linearGradient>
    <linearGradient id="tnGoldIcon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF275" />
      <stop offset="100%" stop-color="#FFB300" />
    </linearGradient>
    <linearGradient id="tnNavyIcon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E3A5F" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <filter id="iconGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#EE4D2D" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Rounded Squircle Background -->
  <rect x="4" y="4" width="120" height="120" rx="28" fill="url(#tnNavyIcon)" />
  <rect x="5" y="5" width="118" height="118" rx="27" stroke="rgba(255,255,255,0.12)" stroke-width="2" />

  <!-- LOGO EMBLEM -->
  <g transform="translate(24, 18)" filter="url(#iconGlow)">
    <!-- Outer Shield / Hexagon -->
    <path d="M40 4 L72 22 L72 62 L40 80 L8 62 L8 22 Z" 
          fill="url(#tnFlameIcon)" />
    
    <!-- Inner Navy Hex Nest -->
    <path d="M40 12 L64 26 L64 58 L40 72 L16 58 L16 26 Z" 
          fill="url(#tnNavyIcon)" />

    <!-- Stylized 'N' Circuit -->
    <path d="M24 54 L24 30 L32 30 L48 54 L48 30 L56 30 L56 54 L48 54 L32 30 L32 54 Z" 
          fill="#FFFFFF" opacity="0.95" />

    <!-- Central Energy Lightning Bolt -->
    <path d="M42 24 L34 42 L41 42 L37 60 L48 38 L41 38 Z" 
          fill="url(#tnGoldIcon)" />
          
    <!-- Decorative Tech Nodes -->
    <circle cx="40" cy="7" r="2.5" fill="#FFFFFF" />
    <circle cx="69" cy="24" r="2.5" fill="#FFFFFF" />
    <circle cx="69" cy="60" r="2.5" fill="#FFFFFF" />
    <circle cx="40" cy="77" r="2.5" fill="#FFFFFF" />
    <circle cx="11" cy="60" r="2.5" fill="#FFFFFF" />
    <circle cx="11" cy="24" r="2.5" fill="#FFFFFF" />
  </g>
</svg>'''

    # Save SVG files
    os.makedirs('public/assets', exist_ok=True)
    with open('public/assets/tech-nest-logo-horizontal.svg', 'w', encoding='utf-8') as f:
        f.write(svg_horizontal)
    with open('public/assets/tech-nest-logo.svg', 'w', encoding='utf-8') as f:
        f.write(svg_horizontal)
    with open('public/assets/tech-nest-icon.svg', 'w', encoding='utf-8') as f:
        f.write(svg_icon)
    with open('public/favicon.svg', 'w', encoding='utf-8') as f:
        f.write(svg_icon)

    print("SVG assets generated successfully.")

create_tech_nest_assets()
