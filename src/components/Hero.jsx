import React from 'react';
import { ChevronRight, ShieldCheck, Truck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Hero({ onShopClick, onFindPhoneClick, t = {}, selectedCategory = null }) {
  const subtitle = t?.heroSub || "Cases, sound and power for your everyday.";
  const shopLabel = t?.shopAccessories || "Shop accessories";
  const findLabel = t?.findMyPhone || "Find my phone";

  return (
    <section className="hero-section" aria-label="Hero Section">
      <div className="hero-grid">
        {/* Left Column: Bold Typography & Action Controls */}
        <div className="hero-content">
          {/* Curated Collection Badge */}
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span className="hero-badge-text">Glacial Tech Accessories • Bangladesh</span>
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

          {/* Honest Value Indicators (No unsupported claims) */}
          <div className="hero-trust-bar">
            <div className="hero-trust-item">
              <CheckCircle2 size={14} className="text-[#145CFF]" />
              <span className="text-[#52677B]">Verified Device Fit</span>
            </div>
            <span className="hero-trust-divider">•</span>
            <div className="hero-trust-item">
              <Truck size={14} className="text-[#145CFF]" />
              <span className="text-[#52677B]">Courier Delivery (৳60 / ৳120)</span>
            </div>
            <span className="hero-trust-divider">•</span>
            <div className="hero-trust-item">
              <Sparkles size={14} className="text-[#145CFF]" />
              <span className="text-[#52677B]">Free Shipping on ৳2,000+</span>
            </div>
          </div>
        </div>

        {/* Right Column: Static Responsive Product Composition (No 3D / No Autoplay Motion) */}
        <div className="hero-media-wrapper">
          <div className="relative w-full rounded-3xl bg-white/80 backdrop-blur-md border border-[#DCE7F0] p-6 sm:p-8 shadow-xl overflow-hidden flex flex-col justify-between">
            {/* Background Ice-Blue Ambient Glow */}
            <div 
              className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none opacity-40 blur-3xl"
              style={{ background: 'radial-gradient(circle, #CBE4FC 0%, rgba(203,228,252,0) 70%)' }}
              aria-hidden="true"
            />

            {/* Showcase Header */}
            <div className="flex items-center justify-between relative z-10 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#145CFF]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#10263D]">
                  Curated Glacial Lineup
                </span>
              </div>
              <span className="text-[11px] font-semibold text-[#145CFF] bg-[#EAF4FC] px-2.5 py-0.5 rounded-full border border-[#CBE4FC]">
                Frosted Glass Aesthetics
              </span>
            </div>

            {/* Static Multi-Product Composition Grid */}
            <div className="grid grid-cols-2 gap-3.5 relative z-10">
              {/* Feature Item 1: Aura Frost Case */}
              <div className="col-span-2 sm:col-span-1 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 flex flex-col justify-between transition-colors hover:border-[#145CFF]/40">
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-white/70 mb-3 flex items-center justify-center p-2">
                  <img
                    src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=500&q=80"
                    alt="Aura Frost MagSafe Glass Case"
                    className="max-h-full object-contain"
                    loading="eager"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#145CFF] tracking-wider block">MagSafe 15W</span>
                  <h2 className="text-xs font-bold text-[#10263D] truncate">Aura Frost MagSafe Case</h2>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-xs font-bold text-[#10263D]">৳2,450</span>
                    <span className="text-[10px] text-[#52677B]">MIL-STD Drop Protection</span>
                  </div>
                </div>
              </div>

              {/* Feature Item 2: Glacier Pro Earbuds */}
              <div className="col-span-2 sm:col-span-1 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 flex flex-col justify-between transition-colors hover:border-[#145CFF]/40">
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-white/70 mb-3 flex items-center justify-center p-2">
                  <img
                    src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=500&q=80"
                    alt="Glacier Pro Wireless Earbuds"
                    className="max-h-full object-contain"
                    loading="eager"
                  />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#145CFF] tracking-wider block">48dB Active Hybrid ANC</span>
                  <h2 className="text-xs font-bold text-[#10263D] truncate">Glacier Pro Wireless Earbuds</h2>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-xs font-bold text-[#10263D]">৳5,890</span>
                    <span className="text-[10px] text-[#52677B]">Titanium Drivers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar: Everyday Reliability */}
            <div className="mt-4 pt-3.5 border-t border-[#DCE7F0] flex items-center justify-between text-xs text-[#52677B] relative z-10">
              <span className="font-medium text-[#10263D]">Tactile Materials & Precision Optics</span>
              <span className="text-[11px] text-[#145CFF] font-semibold">Cash on Delivery Available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
