import React from 'react';

/**
 * BrandLogo — Official Vector SVG Logo for Tech Nest
 * Crisp, scalable, Retina-ready emblem with geometric circuit nest and high-tech typography.
 */
export default function BrandLogo({ 
  variant = 'horizontal', 
  className = '', 
  height = 44,
  alt = "Tech Nest — Authentic Mobile Accessories" 
}) {
  if (variant === 'icon') {
    return (
      <svg 
        viewBox="0 0 128 128" 
        height={height} 
        width={height} 
        className={className} 
        role="img" 
        aria-label={alt}
        fill="none"
      >
        <defs>
          <linearGradient id="tnFlameIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B4A" />
            <stop offset="50%" stopColor="#EE4D2D" />
            <stop offset="100%" stopColor="#D73211" />
          </linearGradient>
          <linearGradient id="tnGoldIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF275" />
            <stop offset="100%" stopColor="#FFB300" />
          </linearGradient>
          <linearGradient id="tnNavyIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A5F" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <filter id="iconGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#EE4D2D" floodOpacity="0.35" />
          </filter>
        </defs>

        <rect x="4" y="4" width="120" height="120" rx="28" fill="url(#tnNavyIcon)" />
        <rect x="5" y="5" width="118" height="118" rx="27" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />

        <g transform="translate(24, 18)" filter="url(#iconGlow)">
          <path d="M40 4 L72 22 L72 62 L40 80 L8 62 L8 22 Z" fill="url(#tnFlameIcon)" />
          <path d="M40 12 L64 26 L64 58 L40 72 L16 58 L16 26 Z" fill="url(#tnNavyIcon)" />
          <path d="M24 54 L24 30 L32 30 L48 54 L48 30 L56 30 L56 54 L48 54 L32 30 L32 54 Z" fill="#FFFFFF" opacity="0.95" />
          <path d="M42 24 L34 42 L41 42 L37 60 L48 38 L41 38 Z" fill="url(#tnGoldIcon)" />
          <circle cx="40" cy="7" r="2.5" fill="#FFFFFF" />
          <circle cx="69" cy="24" r="2.5" fill="#FFFFFF" />
          <circle cx="69" cy="60" r="2.5" fill="#FFFFFF" />
          <circle cx="40" cy="77" r="2.5" fill="#FFFFFF" />
          <circle cx="11" cy="60" r="2.5" fill="#FFFFFF" />
          <circle cx="11" cy="24" r="2.5" fill="#FFFFFF" />
        </g>
      </svg>
    );
  }

  return (
    <svg 
      viewBox="0 0 460 92" 
      height={height} 
      className={className} 
      style={{ width: 'auto', display: 'block', maxHeight: '100%' }}
      role="img" 
      aria-label={alt}
      fill="none"
    >
      <defs>
        <linearGradient id="tnFlameHeader" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B4A" />
          <stop offset="50%" stopColor="#EE4D2D" />
          <stop offset="100%" stopColor="#D73211" />
        </linearGradient>
        <linearGradient id="tnGoldHeader" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF275" />
          <stop offset="100%" stopColor="#FFB300" />
        </linearGradient>
        <linearGradient id="tnNavyHeader" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E3A5F" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <filter id="subtleGlowHeader" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#EE4D2D" floodOpacity="0.28" />
        </filter>
      </defs>

      {/* Hexagonal Nest + Spark Icon */}
      <g transform="translate(6, 4)" filter="url(#subtleGlowHeader)">
        <path d="M42 4 L74 22 L74 62 L42 80 L10 62 L10 22 Z" fill="url(#tnFlameHeader)" />
        <path d="M42 12 L66 26 L66 58 L42 72 L18 58 L18 26 Z" fill="url(#tnNavyHeader)" />
        <path d="M26 54 L26 30 L34 30 L50 54 L50 30 L58 30 L58 54 L50 54 L34 30 L34 54 Z" fill="#FFFFFF" opacity="0.95" />
        <path d="M44 24 L36 42 L43 42 L39 60 L50 38 L43 38 Z" fill="url(#tnGoldHeader)" />
        <circle cx="42" cy="7" r="2.5" fill="#FFFFFF" />
        <circle cx="71" cy="24" r="2.5" fill="#FFFFFF" />
        <circle cx="71" cy="60" r="2.5" fill="#FFFFFF" />
        <circle cx="42" cy="77" r="2.5" fill="#FFFFFF" />
        <circle cx="13" cy="60" r="2.5" fill="#FFFFFF" />
        <circle cx="13" cy="24" r="2.5" fill="#FFFFFF" />
      </g>

      {/* Typography */}
      <g transform="translate(102, 10)">
        <text 
          x="0" 
          y="44" 
          fontFamily="system-ui, -apple-system, 'Plus Jakarta Sans', 'Inter', sans-serif" 
          fontSize="46" 
          fontWeight="900" 
          letterSpacing="-1px" 
          fill="#10263D"
        >
          TECH
        </text>

        <text 
          x="142" 
          y="44" 
          fontFamily="system-ui, -apple-system, 'Plus Jakarta Sans', 'Inter', sans-serif" 
          fontSize="46" 
          fontWeight="900" 
          letterSpacing="-1px" 
          fill="url(#tnFlameHeader)"
        >
          NEST
        </text>

        {/* Pulse Dot */}
        <circle cx="282" cy="20" r="5" fill="#EE4D2D" />
        <circle cx="282" cy="20" r="2.5" fill="#FFD700" />

        {/* Subtitle */}
        <text 
          x="2" 
          y="68" 
          fontFamily="system-ui, -apple-system, 'Plus Jakarta Sans', 'Inter', sans-serif" 
          fontSize="11" 
          fontWeight="800" 
          letterSpacing="3.5px" 
          fill="#64748B"
        >
          AUTHENTIC MOBILE ACCESSORIES
        </text>
      </g>
    </svg>
  );
}
