import React from 'react';

/**
 * BrandLogo — Official Logo Component for Tech Vartual Tutor
 * Renders the authentic Vartual Tutor educational crest emblem
 * and "TECH VARTUAL TUTOR" typography.
 */
const LOGO_VERSION = '20261020_v1';

export default function BrandLogo({ 
  variant = 'horizontal', 
  className = '', 
  height = 44,
  alt = "Tech Vartual Tutor — Authentic Mobile Accessories" 
}) {
  let baseSrc = '/assets/tech-vartual-tutor-logo-horizontal.svg';
  let aspectRatio = '880 / 180';
  let ratioNumber = 880 / 180;

  if (variant === 'icon' || variant === 'icon-transparent') {
    baseSrc = '/assets/tech-vartual-tutor-icon.svg';
    aspectRatio = '1 / 1';
    ratioNumber = 1;
  } else if (variant === 'badge' || variant === 'dark') {
    baseSrc = '/assets/tech-vartual-tutor-logo-dark.svg';
    aspectRatio = '880 / 180';
    ratioNumber = 880 / 180;
  } else if (variant === 'vertical' || variant === 'stacked' || variant === 'raw') {
    baseSrc = '/assets/vartualtutor-logo.svg';
    aspectRatio = '1 / 1';
    ratioNumber = 1;
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


