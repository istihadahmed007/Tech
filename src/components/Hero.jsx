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
        <p className="hero-subtitle-animate text-xs sm:text-sm font-bold tracking-[0.22em] text-[#0084FF] uppercase mb-3 drop-shadow-2xs">
          TECHNOLOGY &amp; ACCESSORIES
        </p>

        {/* Main Bold Headline */}
        <h1 className="hero-title-animate text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0084FF] tracking-tight mb-4 drop-shadow-xs leading-[1.14]">
          Discover Your Next Favorite Tech
        </h1>

        {/* Supporting Copy */}
        <p className="hero-copy-animate text-xs sm:text-base text-[#1E78D6] font-medium max-w-xl mx-auto mb-8 leading-relaxed">
          Explore quality gadgets and accessories designed for your everyday life — with honest specs, verified compatibility, and free nationwide delivery on orders ৳2,000+.
        </p>

        {/* Primary CTA Button (Matches Reference Image) */}
        <button 
          type="button"
          onClick={onShopClick}
          className="hero-btn-animate btn-soft-blue text-white text-xs sm:text-sm font-bold tracking-[0.16em] uppercase px-11 py-3.5 rounded-xl transition-all cursor-pointer shadow-lg active:scale-95"
        >
          SHOP NOW
        </button>
      </div>
    </section>
  );
}
