import React from 'react';

/**
 * BrandLogo — Official Logo Component for Tech Nest
 * Renders the authentic futuristic glowing cyan Circuit Nest emblem
 * and 3D "TECH NEST" wordmark.
 */
export default function BrandLogo({ 
  variant = 'horizontal', 
  className = '', 
  height = 44,
  alt = "Tech Nest — Authentic Mobile Accessories" 
}) {
  let src = '/assets/tech-nest-logo-horizontal.png';

  if (variant === 'icon') {
    src = '/assets/tech-nest-icon.png';
  } else if (variant === 'icon-transparent') {
    src = '/assets/tech-nest-icon-transparent.png';
  } else if (variant === 'badge' || variant === 'dark') {
    src = '/assets/tech-nest-logo-badge.png';
  } else if (variant === 'vertical' || variant === 'stacked') {
    src = '/assets/tech-nest-logo-vertical.png';
  } else if (variant === 'raw') {
    src = '/assets/tech-nest-logo-raw.jpg';
  }

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
