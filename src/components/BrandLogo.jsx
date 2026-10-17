import React from 'react';

/**
 * BrandLogo — Official Logo Component for Tech Nest
 * Renders the user's authentic glossy 3D House Roof + 4 Window Panes + TN Arrow emblem
 * with "Tech Nest - TECHNOLOGY BUILDS A BETTER TOMORROW"
 */
export default function BrandLogo({ 
  variant = 'horizontal', 
  className = '', 
  height = 44,
  alt = "Tech Nest — Technology Builds A Better Tomorrow" 
}) {
  if (variant === 'icon') {
    return (
      <img
        src="/assets/tech-nest-icon.png"
        alt={alt}
        height={height}
        className={`object-contain select-none ${className}`}
        style={{ height: typeof height === 'number' ? `${height}px` : height, width: 'auto' }}
        loading="eager"
      />
    );
  }

  return (
    <img
      src="/assets/tech-nest-logo-horizontal.png"
      alt={alt}
      height={height}
      className={`object-contain select-none ${className}`}
      style={{ height: typeof height === 'number' ? `${height}px` : height, width: 'auto', maxHeight: '100%' }}
      loading="eager"
    />
  );
}
