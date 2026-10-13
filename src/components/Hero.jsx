import React, { Suspense, lazy } from 'react';
import { ChevronRight, ArrowRight, ShieldCheck, Truck, Star } from 'lucide-react';

// Lazy load the 3D Canvas to prioritize core HTML/CSS painting
const Hero3DCanvas = lazy(() => import('./Hero3DCanvas'));

export default function Hero({ onShopClick, onFindPhoneClick, t = {}, selectedCategory = null }) {
  const subtitle = t?.heroSub || "Cases, sound and power for your everyday.";
  const shopLabel = t?.shopAccessories || "Shop accessories";
  const findLabel = t?.findMyPhone || "Find my phone";

  return (
    <section className="hero-section" aria-label="Hero Section">
      <div className="hero-grid">
        {/* Left Column: Bold Editorial Typography & CTAs */}
        <div className="hero-content">
          {/* Glacial Collection Tag */}
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span className="hero-badge-text">The Glacial Collection • Precision Optics</span>
          </div>

          {/* Main Headline */}
          <h1 className="hero-title">
            Small upgrades.<br />
            Everyday better.
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            {subtitle}
          </p>

          {/* Call-to-Action Buttons */}
          <div className="hero-actions">
            <button
              type="button"
              onClick={onShopClick}
              className="hero-btn-primary cursor-pointer"
              id="hero-shop-btn"
            >
              <span>{shopLabel}</span>
              <ChevronRight size={17} className="stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={onFindPhoneClick}
              className="hero-btn-secondary group cursor-pointer"
              id="hero-find-phone-btn"
            >
              <span>{findLabel}</span>
              <ChevronRight size={17} className="stroke-[2.5] hero-btn-secondary-icon group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Trust Metrics Bar */}
          <div className="hero-trust-bar">
            <div className="hero-trust-item">
              <span className="text-amber-500 font-bold flex items-center gap-1">
                <Star size={13} fill="#F59E0B" className="stroke-none" />
                4.9/5
              </span>
              <span className="text-[#52677B]">Rating (40k+ fitted)</span>
            </div>
            <span className="hero-trust-divider">•</span>
            <div className="hero-trust-item">
              <Truck size={14} className="text-[#145CFF]" />
              <span className="text-[#52677B]">Next-Day BD Delivery</span>
            </div>
            <span className="hero-trust-divider">•</span>
            <div className="hero-trust-item">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span className="text-[#52677B]">100% Genuine Imports</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 3D Hero Composition */}
        <div className="hero-media-wrapper">
          <div className="hero-media-card">
            <Suspense
              fallback={
                <div className="hero-3d-placeholder w-full h-[400px] sm:h-[460px] lg:h-[500px] flex items-center justify-center bg-white/60 rounded-2xl animate-pulse">
                  <img
                    src="/assets/hero-products-clean.jpg"
                    alt="Loading 3D Accessories..."
                    className="max-h-[300px] object-contain opacity-70"
                    loading="eager"
                  />
                </div>
              }
            >
              <Hero3DCanvas
                selectedCategory={selectedCategory}
                t={t}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
