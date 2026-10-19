import React from 'react';

/**
 * BrandLogo — Official Logo Component for Tech Nest
 * Renders the authentic futuristic glowing cyan Circuit Nest emblem
 * and 3D "TECH NEST" wordmark.
 */
const LOGO_VERSION = '20261019_v6';

export default function BrandLogo({ 
  variant = 'horizontal', 
  className = '', 
  height = 44,
  alt = "Tech Nest — Authentic Mobile Accessories" 
}) {
  let baseSrc = '/assets/tech-nest-logo-horizontal.png';
  let aspectRatio = '2349 / 478';
  let ratioNumber = 2349 / 478;

  if (variant === 'icon') {
    baseSrc = '/assets/tech-nest-icon.png';
    aspectRatio = '1 / 1';
    ratioNumber = 1;
  } else if (variant === 'icon-transparent') {
    baseSrc = '/assets/tech-nest-icon-transparent.png';
    aspectRatio = '1 / 1';
    ratioNumber = 1;
  } else if (variant === 'badge' || variant === 'dark') {
    baseSrc = '/assets/tech-nest-logo-dark.png';
    aspectRatio = '2349 / 478';
    ratioNumber = 2349 / 478;
  } else if (variant === 'vertical' || variant === 'stacked') {
    baseSrc = '/assets/tech-nest-logo-vertical.png';
    aspectRatio = '504 / 530';
    ratioNumber = 504 / 530;
  } else if (variant === 'raw') {
    baseSrc = '/assets/tech-nest-logo-raw.jpg';
    aspectRatio = '1024 / 571';
    ratioNumber = 1024 / 571;
  }

  const src = `${baseSrc}?v=${LOGO_VERSION}`;
  const numericHeight = typeof height === 'number' ? height : (parseInt(height, 10) || 44);
  const calculatedWidth = Math.round(numericHeight * ratioNumber);

  return (
    <img
      src={src}
      alt={alt}
      width={calculatedWidth}
      height={numericHeight}
      className={`object-contain select-none ${className}`}
      style={{ 
        height: typeof height === 'number' ? `${height}px` : height, 
        width: 'auto', 
        aspectRatio: aspectRatio,
        objectFit: 'contain',
        maxWidth: '100%' 
      }}
      loading="eager"
      fetchPriority="high"
      decoding="async"
    />
  );
}

