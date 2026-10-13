import React from 'react';
import { ChevronRight, Pause } from 'lucide-react';

export default function Hero({ onShopClick, onFindPhoneClick, t }) {
  const subtitle = t?.heroSub || "Cases, sound and power for your everyday.";
  const shopLabel = t?.shopAccessories || "Shop accessories";
  const findLabel = t?.findMyPhone || "Find my phone";

  return (
    <section className="hero-section">
      <div className="hero-grid">
        {/* Left Column: Bold Typography & CTAs */}
        <div className="hero-content">
          {/* Main Headline matching reference */}
          <h1 className="hero-title">
            Small upgrades.<br />
            Everyday better.
          </h1>

          {/* Subtitle matching reference */}
          <p className="hero-subtitle">
            {subtitle}
          </p>

          {/* Call-to-Action Buttons */}
          <div className="hero-actions">
            <button
              onClick={onShopClick}
              className="hero-btn-primary"
            >
              <span>{shopLabel}</span>
              <ChevronRight size={17} className="stroke-[2.5]" />
            </button>

            <button
              onClick={onFindPhoneClick}
              className="hero-btn-secondary group"
            >
              <span>{findLabel}</span>
              <ChevronRight size={17} className="stroke-[2.5] hero-btn-secondary-icon group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Hero Floating Accessories & Swirling Vortex */}
        <div className="hero-media-wrapper">
          <div className="hero-media-card">
            <img
              src="/assets/hero-floating-products.jpg"
              alt="Small upgrades. Everyday better. Cases, sound and power."
              className="hero-media-img"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
