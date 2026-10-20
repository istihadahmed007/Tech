import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Sun, 
  BatteryCharging, 
  ShieldCheck, 
  Headphones, 
  Clock, 
  Zap,
  Play
} from 'lucide-react';

export default function Hero({ 
  onShopClick, 
  onSelectCategory,
  onSelectProduct,
  onOpenDetail,
  featuredWatchProduct,
  products = [],
  t = {}, 
  lang = 'en'
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const SLIDES = [
    {
      id: 't800-ultra2-smartwatch',
      theme: 'dark',
      headline: 'T800 Ultra 2',
      headlineBn: 'টি৮০০ আল্ট্রা ২ স্মার্টওয়াচ',
      subtitle: '49mm Infinite HD Display | Bluetooth Calling & Health Tracking',
      subtitleBn: '৪৯ মিমি ইনফিনিট এইচডি ডিসপ্লে • ব্লুটুথ কলিং ও ফিটনেস ট্র্যাকিং',
      features: [
        { icon: Sun, text: 'HD Vivid Color Display' },
        { icon: BatteryCharging, text: 'Multi-Day Battery Life' },
        { icon: ShieldCheck, text: 'Durable Alloy Casing' }
      ],
      primaryCta: 'Buy T800 Ultra 2',
      primaryCtaBn: 'এখনই কিনুন',
      secondaryCta: 'Explore Wearables',
      secondaryCtaBn: 'আরও দেখুন',
      image: '/assets/hero-products-showcase.jpg',
      targetCategory: 'wearables',
      featuredSku: 'P13-T800-ULTRA2-SLV'
    },
    {
      id: 'ankeer-studio-wireless',
      theme: 'light',
      headline: 'Studio Wireless ANC',
      headlineBn: 'স্টুডিও ওয়্যারলেস হেডফোন',
      subtitle: 'Active Noise Cancellation | 40mm Hi-Fi Bass & 30-Hour Playtime',
      subtitleBn: 'অ্যাক্টিভ নয়েজ ক্যান্সেলেশন • ৪০মিমি ডিপ বেস ও ৩০ ঘণ্টা প্লে-টাইম',
      features: [
        { icon: Headphones, text: 'Active Noise Cancellation' },
        { icon: Clock, text: '30-Hour Extended Battery' },
        { icon: Zap, text: 'Fast USB-C Charging' }
      ],
      primaryCta: 'Buy Studio ANC',
      primaryCtaBn: 'এখনই কিনুন',
      secondaryCta: 'Explore Audio',
      secondaryCtaBn: 'অডিও কালেকশন',
      image: '/assets/hero-audio-headphones.jpg',
      targetCategory: 'audio',
      featuredSku: 'P16-ANK-NY200-SLV',
      watermarkText: 'STUDIO ANC'
    }
  ];

  // Auto rotate slides every 7 seconds when not hovered
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused, SLIDES.length]);

  const slide = SLIDES[activeSlide];

  const handlePrimaryClick = () => {
    if (slide.featuredSku && products && products.length > 0) {
      const targetProd = products.find(p => p.sku === slide.featuredSku || p.category === slide.targetCategory);
      if (targetProd && onOpenDetail) {
        onOpenDetail(targetProd);
        return;
      }
    }
    if (onSelectCategory) onSelectCategory(slide.targetCategory);
    if (onShopClick) onShopClick();
  };

  const handleSecondaryClick = () => {
    if (onSelectCategory) onSelectCategory(slide.targetCategory);
    if (onShopClick) onShopClick();
  };

  return (
    <section 
      className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-4 sm:pb-6" 
      aria-label="Flagship Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={`relative w-full rounded-2xl sm:rounded-3xl overflow-hidden transition-colors duration-700 min-h-[460px] sm:min-h-[520px] md:min-h-[560px] flex items-center shadow-sm ${
        slide.theme === 'dark' ? 'bg-[#0B1528] text-white' : 'bg-[#eef2f5] text-slate-900'
      }`}>
        
        {/* Subtle Background Ambience */}
        {slide.theme === 'dark' ? (
          <div className="absolute inset-0 bg-radial from-blue-900/30 via-slate-950 to-[#070E1B] pointer-events-none" />
        ) : (
          <div className="absolute inset-0 bg-radial from-white/90 via-[#f0f4f8] to-[#e4e9f0] pointer-events-none" />
        )}

        {/* Watermark Branding */}
        {slide.watermarkText && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.06] text-6xl sm:text-8xl md:text-9xl font-black uppercase tracking-tighter text-slate-900 whitespace-nowrap">
            {slide.watermarkText}
          </div>
        )}

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-[1240px] mx-auto px-6 sm:px-12 md:px-16 py-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          
          {/* Left Column: Typography, Bullets, Dual CTAs */}
          <div className="w-full md:max-w-xl text-left">
            
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-3 sm:mb-4">
              {lang === 'bn' ? (slide.headlineBn || slide.headline) : slide.headline}
            </h1>

            {/* Subtitle / Product Proposition */}
            <p className={`text-sm sm:text-base md:text-lg font-normal mb-6 sm:mb-8 leading-relaxed max-w-lg ${
              slide.theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {lang === 'bn' ? (slide.subtitleBn || slide.subtitle) : slide.subtitle}
            </p>

            {/* 3 Bullet Features with Small Icons */}
            <div className="space-y-2.5 sm:space-y-3 mb-8 sm:mb-10">
              {slide.features.map((feat, i) => {
                const IconComponent = feat.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      slide.theme === 'dark' ? 'bg-white/10 text-blue-400' : 'bg-slate-200/80 text-blue-600'
                    }`}>
                      <IconComponent size={13} className="stroke-[2.5]" />
                    </div>
                    <span className={`text-xs sm:text-sm font-medium ${
                      slide.theme === 'dark' ? 'text-slate-200' : 'text-slate-700'
                    }`}>
                      {feat.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Dual Action CTAs */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              {/* Primary Blue Button */}
              <button
                type="button"
                onClick={handlePrimaryClick}
                className="px-6 sm:px-7 py-3 rounded-full bg-[#0066FF] hover:bg-blue-600 active:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer select-none"
              >
                <span>{lang === 'bn' ? (slide.primaryCtaBn || slide.primaryCta) : slide.primaryCta}</span>
                <ChevronRight size={15} className="stroke-[2.5]" />
              </button>

              {/* Secondary Button */}
              <button
                type="button"
                onClick={handleSecondaryClick}
                className={`px-5 sm:px-6 py-3 rounded-full font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer select-none ${
                  slide.theme === 'dark'
                    ? 'bg-transparent hover:bg-white/10 text-white border border-white/20'
                    : 'bg-transparent hover:bg-slate-200/60 text-slate-800 border border-slate-300'
                }`}
              >
                <span>{lang === 'bn' ? (slide.secondaryCtaBn || slide.secondaryCta) : slide.secondaryCta}</span>
                <ChevronRight size={15} className="stroke-[2]" />
              </button>
            </div>
          </div>

          {/* Right Column: High-Res Studio Showcase */}
          <div className="w-full md:flex-1 flex justify-center items-center relative">
            <div className="relative w-full max-w-[480px] sm:max-w-[540px] md:max-w-[580px] aspect-4/3 flex items-center justify-center">
              <img
                src={slide.image}
                alt={slide.headline}
                loading="eager"
                fetchPriority="high"
                className="w-full h-full object-contain rounded-2xl drop-shadow-2xl transition-transform duration-700 hover:scale-103"
                onError={(e) => {
                  e.currentTarget.src = '/assets/product-placeholder.png';
                }}
              />
            </div>
          </div>
        </div>

        {/* Left Arrow */}
        <button
          type="button"
          onClick={() => setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
          className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 z-20 cursor-pointer shadow-sm ${
            slide.theme === 'dark'
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-white/80 hover:bg-white text-slate-800'
          }`}
          aria-label="Previous Slide"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Right Arrow */}
        <button
          type="button"
          onClick={() => setActiveSlide((prev) => (prev + 1) % SLIDES.length)}
          className={`absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 z-20 cursor-pointer shadow-sm ${
            slide.theme === 'dark'
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-white/80 hover:bg-white text-slate-800'
          }`}
          aria-label="Next Slide"
        >
          <ChevronRight size={18} />
        </button>

        {/* Center Bottom Pill Indicator Dots */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeSlide === idx
                  ? 'w-7 bg-[#0066FF]'
                  : slide.theme === 'dark'
                    ? 'w-2 bg-white/30 hover:bg-white/50'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
