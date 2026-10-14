import React, { useState } from 'react';
import { ChevronRight, Truck, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Hero({ onShopClick, onFindPhoneClick, t = {}, selectedCategory = null }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Internationalized customer-facing text with strict defaults matching design spec
  const title = t?.heroTitle || "The right accessories. For your phone.";
  const subtitle = t?.heroSub || "Discover cases, charging essentials and audio for everyday use.";
  const findButtonLabel = t?.findMyAccessories || "Find my accessories";
  const shopButtonLabel = t?.shopAll || "Shop all";

  return (
    <section className="hero-section" aria-label="Hero Section">
      <div className="hero-container">
        <div className="hero-grid">
          {/* Left Column (Desktop 45% / Mobile 1st): Clean Typography & Action Controls */}
          <div className="hero-content">
            {/* Curated Collection Badge */}
            <div className="hero-badge">
              <span className="hero-badge-dot" aria-hidden="true" />
              <span className="hero-badge-text">
                {t?.brandName || "Accessories"} • Bangladesh
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-title">
              {title}
            </h1>

            {/* Supporting Sentence */}
            <p className="hero-subtitle">
              {subtitle}
            </p>

            {/* Call-to-Action Buttons */}
            <div className="hero-actions">
              {/* Primary Button: Find my accessories -> Compatibility Finder */}
              <button
                type="button"
                onClick={onFindPhoneClick}
                className="hero-btn-primary"
                id="hero-find-accessories-btn"
                aria-label={findButtonLabel}
              >
                <span>{findButtonLabel}</span>
                <ChevronRight size={17} className="stroke-[2.5]" aria-hidden="true" />
              </button>

              {/* Secondary Button: Shop all -> Product Collection */}
              <button
                type="button"
                onClick={onShopClick}
                className="hero-btn-secondary group"
                id="hero-shop-all-btn"
                aria-label={shopButtonLabel}
              >
                <span>{shopButtonLabel}</span>
                <ChevronRight 
                  size={17} 
                  className="stroke-[2.5] hero-btn-secondary-icon group-hover:translate-x-0.5" 
                  aria-hidden="true" 
                />
              </button>
            </div>

            {/* Honest Store Trust Indicators (Backed by real store policies) */}
            <div className="hero-trust-bar">
              <div className="hero-trust-item">
                <Truck size={15} className="text-[#145CFF]" aria-hidden="true" />
                <span>Courier Delivery (৳60 / ৳120)</span>
              </div>
              <span className="hero-trust-divider" aria-hidden="true">•</span>
              <div className="hero-trust-item">
                <Sparkles size={15} className="text-[#145CFF]" aria-hidden="true" />
                <span>Free Delivery on ৳2,000+</span>
              </div>
              <span className="hero-trust-divider" aria-hidden="true">•</span>
              <div className="hero-trust-item">
                <ShieldCheck size={15} className="text-[#145CFF]" aria-hidden="true" />
                <span>7-Day Return Policy</span>
              </div>
            </div>
          </div>

          {/* Right Column (Desktop 55% / Mobile 2nd): Polished Static Product Composition */}
          <div className="hero-visual-wrapper">
            <div className="hero-visual-card">
              {/* Reserved Aspect-Ratio Fallback Skeleton (avoids layout shift) */}
              {!imageLoaded && !imageError && (
                <div 
                  className="hero-visual-skeleton" 
                  aria-hidden="true"
                />
              )}

              {/* Error fallback occupying same reserved space */}
              {imageError && (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#F8FCFF]">
                  <AlertCircle size={32} className="text-[#145CFF] mb-2 opacity-80" />
                  <p className="text-sm font-semibold text-[#10263D]">Accessories Lineup</p>
                  <p className="text-xs text-[#52677B] mt-1">Cases • Chargers • Audio</p>
                </div>
              )}

              {/* One Primary Static Visual Asset (No pause controls, no screenshots, no 3D) */}
              {!imageError && (
                <img
                  src="/assets/hero-products-showcase.jpg"
                  alt="Curated mobile phone accessories including protective cases, fast chargers, and wireless earbuds"
                  className={`hero-visual-img ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  width={1200}
                  height={896}
                  loading="eager"
                  fetchPriority="high"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setImageLoaded(true);
                    setImageError(true);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
