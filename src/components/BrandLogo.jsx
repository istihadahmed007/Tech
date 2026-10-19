import React from 'react';

/**
 * BrandLogo — Official Logo Component for Tech Nest
 * Renders the authentic futuristic glowing cyan Circuit Nest emblem
 * and 3D "TECH NEST" wordmark.
 */
const LOGO_VERSION = '20261019_v2';

export default function BrandLogo({ 
  variant = 'horizontal', 
  className = '', 
  height = 44,
  alt = "Tech Nest — Authentic Mobile Accessories" 
}) {
  let baseSrc = '/assets/tech-nest-logo-horizontal.png';

  if (variant === 'icon') {
    baseSrc = '/assets/tech-nest-icon.png';
  } else if (variant === 'icon-transparent') {
    baseSrc = '/assets/tech-nest-icon-transparent.png';
  } else if (variant === 'badge' || variant === 'dark') {
    baseSrc = '/assets/tech-nest-logo-badge.png';
  } else if (variant === 'vertical' || variant === 'stacked') {
    baseSrc = '/assets/tech-nest-logo-vertical.png';
  } else if (variant === 'raw') {
    baseSrc = '/assets/tech-nest-logo-raw.jpg';
  }

  const src = `${baseSrc}?v=${LOGO_VERSION}`;

  return (
    <img
      src={src}
      alt={alt}
      height={height}
      className={`object-contain select-none ${className}`}
      style={{ height: typeof height === 'number' ? `${height}px` : height, width: 'auto', maxHeight: '100%' }}
      loading="eager"
    />
  );
}
