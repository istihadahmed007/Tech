import React from 'react';
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export default function Hero({ 
  onShopClick, 
  onFindPhoneClick, 
  onSelectCategory,
  onSelectPhone,
  searchQuery = '',
  onSearchChange,
  onSearchSubmit,
  onFilterAudioUnder500,
  onScrollToBundles,
  products = [],
  onSelectProduct,
  t = {}, 
  lang = 'en',
  selectedCategory = null
}) {
  return (
    <section id="hero" className="hero-gradient pt-16 sm:pt-20 pb-36 sm:pb-44 px-4 sm:px-8 text-center relative overflow-hidden">
      {/* Luminous Curved Horizon Wave (Matches Reference Screenshot) */}
      <div className="hero-arc" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
        {/* Spaced Uppercase Subtitle */}
        <p className="text-xs sm:text-sm font-bold tracking-[0.22em] text-[#0084FF] uppercase mb-3 drop-shadow-2xs">
          TECHNOLOGY &amp; ACCESSORIES
        </p>

        {/* Main Bold Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0084FF] tracking-tight mb-4 drop-shadow-xs leading-[1.14]">
          Discover Your Next Favorite Tech
        </h1>

        {/* Supporting Copy */}
        <p className="text-xs sm:text-base text-[#1E78D6] font-medium max-w-xl mx-auto mb-7 leading-relaxed">
          Explore quality gadgets and accessories designed for your everyday life — with honest specs, verified compatibility, and free nationwide delivery on orders ৳2,000+.
        </p>

        {/* Interactive Quick Preset Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 max-w-2xl">
          <button 
            type="button"
            onClick={() => onShopClick && onShopClick()}
            className="text-[11px] sm:text-xs font-semibold bg-white/80 hover:bg-white text-[#0077E6] hover:text-[#0066CC] px-3.5 py-1.5 rounded-full shadow-xs border border-white/90 backdrop-blur-xs transition cursor-pointer"
          >
            ✨ All Verified Gear
          </button>
          <button 
            type="button"
            onClick={() => {
              if (onSelectCategory) onSelectCategory('wearables');
              if (onShopClick) onShopClick();
            }}
            className="text-[11px] sm:text-xs font-semibold bg-white/80 hover:bg-white text-[#0077E6] hover:text-[#0066CC] px-3.5 py-1.5 rounded-full shadow-xs border border-white/90 backdrop-blur-xs transition cursor-pointer"
          >
            ⌚ Smartwatches
          </button>
          <button 
            type="button"
            onClick={() => {
              if (onSelectCategory) onSelectCategory('audio');
              if (onShopClick) onShopClick();
            }}
            className="text-[11px] sm:text-xs font-semibold bg-white/80 hover:bg-white text-[#0077E6] hover:text-[#0066CC] px-3.5 py-1.5 rounded-full shadow-xs border border-white/90 backdrop-blur-xs transition cursor-pointer"
          >
            🎧 Earbuds &amp; ANC
          </button>
          <button 
            type="button"
            onClick={() => {
              if (onFilterAudioUnder500) onFilterAudioUnder500();
              else if (onShopClick) onShopClick();
            }}
            className="text-[11px] sm:text-xs font-semibold bg-white/80 hover:bg-white text-[#0077E6] hover:text-[#0066CC] px-3.5 py-1.5 rounded-full shadow-xs border border-white/90 backdrop-blur-xs transition cursor-pointer"
          >
            ⚡ Under ৳500 Deals
          </button>
          <button 
            type="button"
            onClick={() => onScrollToBundles && onScrollToBundles()}
            className="text-[11px] sm:text-xs font-semibold bg-[#0084FF]/15 hover:bg-[#0084FF]/25 text-[#0066CC] border border-[#0084FF]/30 px-3.5 py-1.5 rounded-full backdrop-blur-xs transition cursor-pointer"
          >
            🤖 ৳2,000 Free Delivery Kit
          </button>
        </div>

        {/* Primary CTA Button (Matches Reference Image) */}
        <button 
          type="button"
          onClick={onShopClick}
          className="btn-soft-blue text-white text-xs sm:text-sm font-bold tracking-[0.16em] uppercase px-10 py-3.5 rounded-xl transition-all cursor-pointer shadow-lg active:scale-95"
        >
          SHOP NOW
        </button>
      </div>
    </section>
  );
}
