import React, { useState, useEffect } from 'react';
import { ChevronRight, Smartphone, Pause, Play, ChevronDown, Sparkles } from 'lucide-react';
import { BRANDS_AND_MODELS } from '../data/catalog';

export default function Hero({ 
  onShopClick, 
  onFindPhoneClick, 
  onSelectCategory,
  onSelectPhone,
  t = {}, 
  lang = 'en',
  selectedCategory = null
}) {
  // Available slides corresponding directly to flagship collections
  const SLIDES = [
    {
      id: 'audio',
      productType: 'audio',
      tabLabel: 'Audio',
      eyebrow: 'AUTHENTIC SOUND COLLECTION',
      title: 'Better sound.\nBeautifully simple.',
      titleBn: 'উন্নত সাউন্ড।\nঅনবদ্য সরলতা।',
      subtitle: 'Discover wireless earbuds, studio gaming headsets & sports neckbands with active noise cancellation.',
      subtitleBn: 'ওয়্যারলেস এয়ারবাডস, গেমিং হেডসেট ও স্পোর্টস নেকব্যান্ডের সেরা কালেকশন।',
      hasInlineForm: false,
      ctaText: 'Shop Audio Collection',
      ctaTextBn: 'অডিও কালেকশন কিনুন',
      onCtaClick: () => onSelectCategory && onSelectCategory('audio'),
      image: '/assets/hero-audio-headphones.jpg',
      imageAlt: 'Premium wireless audio headphones and crystal TWS earbuds'
    },
    {
      id: 'wearables',
      productType: 'wearables',
      tabLabel: 'Smartwatches',
      eyebrow: 'ULTRA WEARABLES',
      title: 'Smart style.\nAll-day connected.',
      titleBn: 'স্মার্ট স্টাইল।\nসারাদিনের কানেক্টিভিটি।',
      subtitle: 'Cellular SIM smartwatches, multi-strap combo editions & aerospace titanium designs.',
      subtitleBn: 'সিম সাপোর্টেড স্মার্টওয়াচ, ৮+১ স্ট্র্যাপ কম্বো ও হেলথ ট্র্যাকিং।',
      hasInlineForm: false,
      ctaText: 'Shop Smartwatches',
      ctaTextBn: 'স্মার্টওয়াচ কালেকশন কিনুন',
      onCtaClick: () => onSelectCategory && onSelectCategory('wearables'),
      image: '/assets/cat-wearables.jpg',
      imageAlt: 'Ultra smartwatch with interchangeable straps'
    },
    {
      id: 'charging',
      productType: 'charging',
      tabLabel: 'Charging',
      eyebrow: 'POWER & CABLES',
      title: 'Fast charging.\nEveryday ready.',
      titleBn: 'দ্রুত চার্জিং।\nপ্রতিদিনের প্রস্তুতি।',
      subtitle: 'High-speed braided multi-tip cables, OTG adapters & cryogenic 65W GaN turbo chargers.',
      subtitleBn: 'ব্রেইডেড ৪-ইন-১ ক্যাবল, ওটিজি অ্যাডাপ্টার ও ফাস্ট চার্জার।',
      hasInlineForm: false,
      ctaText: 'Shop Charging Gear',
      ctaTextBn: 'চার্জিং সামগ্রী কিনুন',
      onCtaClick: () => onSelectCategory && onSelectCategory('charging'),
      image: '/assets/cat-charging.jpg',
      imageAlt: 'Fast charging adapters and multi-tip braided cables'
    },
    {
      id: 'compatibility',
      productType: 'audio',
      tabLabel: 'Device Fit',
      eyebrow: 'MADE FOR YOUR PHONE',
      title: 'Your phone.\nYour perfect fit.',
      titleBn: 'আপনার ফোন।\nআপনার পারফেক্ট ফিট।',
      subtitle: 'Find verified compatible cables, chargers, and audio gear for your phone model.',
      subtitleBn: 'আপনার ফোন মডেলের জন্য সম্পূর্ণ মানানসই ক্যাবল, চার্জার ও অডিও খুঁজুন।',
      hasInlineForm: true,
      image: '/assets/hero-phone-cases-fit.jpg',
      imageAlt: 'Curated accessories matched to smartphone models'
    }
  ];

  // Active slide index
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Inline form state
  const [activeBrand, setActiveBrand] = useState('Apple');
  const [activeModel, setActiveModel] = useState('iPhone 15 Pro');

  const currentSlide = SLIDES[activeSlideIndex];
  const brandModels = BRANDS_AND_MODELS.find(b => b.brand === activeBrand)?.models || [];

  // Handle inline form submit
  const handleInlineFormSubmit = (e) => {
    e.preventDefault();
    if (activeModel && onSelectPhone) {
      onSelectPhone(activeModel);
    }
    if (onShopClick) {
      onShopClick();
    }
  };

  // Auto-rotation timer (every 8.5 seconds when not paused)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveSlideIndex(prev => (prev + 1) % SLIDES.length);
    }, 8500);

    return () => clearInterval(timer);
  }, [isPaused, SLIDES.length]);

  return (
    <section className="relative w-full max-w-[1320px] mx-auto mb-8 sm:mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-[#EAF5FF]/80 via-[#E4F2FD]/70 to-[#EDF6FF]/80 backdrop-blur-md border border-[#DCE7F0]/80 shadow-sm">
      {/* Background Specular Ambient Glow */}
      <div 
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, #C8E3FC 0%, rgba(200, 227, 252, 0) 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 px-4 sm:px-8 lg:px-16 pt-6 sm:pt-12 pb-10 sm:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          
          {/* Left Column: Typography, Eyebrow & Controls */}
          <div className="lg:col-span-5 flex flex-col items-start z-10">
            {/* Eyebrow Pill / Label */}
            <div className="flex items-center gap-2 mb-3.5">
              <span className="text-[11px] font-bold tracking-[0.14em] text-[#52677B] uppercase">
                {currentSlide.eyebrow}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100/70 text-[#145CFF] text-[10px] font-bold tracking-wider uppercase">
                Glacial Tech
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#10263D] tracking-tight leading-[1.08] mb-3.5 whitespace-pre-line">
              {lang === 'bn' && currentSlide.titleBn ? currentSlide.titleBn : currentSlide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-[17px] text-[#52677B] leading-relaxed mb-6 max-w-md">
              {lang === 'bn' && currentSlide.subtitleBn ? currentSlide.subtitleBn : currentSlide.subtitle}
            </p>

            {/* Action Area: Either Inline Phone Selector OR Primary Action Buttons */}
            {currentSlide.hasInlineForm ? (
              <form onSubmit={handleInlineFormSubmit} className="w-full max-w-sm space-y-3.5">
                <div>
                  <label htmlFor="hero-phone-brand" className="block text-xs font-semibold text-[#10263D] mb-1.5">
                    Phone brand
                  </label>
                  <div className="relative">
                    <select
                      id="hero-phone-brand"
                      value={activeBrand}
                      onChange={(e) => {
                        setActiveBrand(e.target.value);
                        const m = BRANDS_AND_MODELS.find(b => b.brand === e.target.value)?.models || [];
                        if (m.length > 0) setActiveModel(m[0]);
                      }}
                      className="w-full bg-white text-xs sm:text-sm font-medium text-[#10263D] rounded-xl border border-[#DCE7F0] px-3.5 py-2.5 outline-none focus:border-[#145CFF] shadow-2xs appearance-none cursor-pointer pr-8"
                    >
                      {BRANDS_AND_MODELS.map(b => (
                        <option key={b.brand} value={b.brand}>{b.brand}</option>
                      ))}
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label htmlFor="hero-phone-model" className="block text-xs font-semibold text-[#10263D] mb-1.5">
                    Phone model
                  </label>
                  <div className="relative">
                    <select
                      id="hero-phone-model"
                      value={activeModel}
                      onChange={(e) => setActiveModel(e.target.value)}
                      className="w-full bg-white text-xs sm:text-sm font-medium text-[#10263D] rounded-xl border border-[#DCE7F0] px-3.5 py-2.5 outline-none focus:border-[#145CFF] shadow-2xs appearance-none cursor-pointer pr-8"
                    >
                      {brandModels.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#145CFF] hover:bg-[#0D4BD9] active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span>{lang === 'bn' ? 'আমার অ্যাক্সেসরিজ খুঁজুন' : 'Find my accessories'}</span>
                    <ChevronRight size={16} className="stroke-[2.5]" />
                  </button>

                  <button
                    type="button"
                    onClick={onShopClick}
                    className="text-xs sm:text-sm font-semibold text-[#145CFF] hover:underline flex items-center gap-1 pl-1 pt-1 sm:pt-0"
                  >
                    <span>{lang === 'bn' ? 'সব অ্যাক্সেসরিজ ব্রাউজ করুন' : 'Browse all accessories'}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-wrap items-center gap-3.5">
                {/* Working Primary Shop Now Button */}
                <button
                  type="button"
                  onClick={onShopClick}
                  className="px-6 py-3 rounded-full bg-[#145CFF] hover:bg-[#0D4BD9] active:scale-[0.98] text-white font-semibold text-sm sm:text-base flex items-center gap-2 shadow-sm transition-all"
                >
                  <span>{lang === 'bn' ? 'শপ নাও • ক্যাটালগ দেখুন' : 'Shop Now'}</span>
                  <ChevronRight size={17} className="stroke-[2.5]" />
                </button>

                {/* Secondary Collection / Category Filter Button */}
                <button
                  type="button"
                  onClick={currentSlide.onCtaClick}
                  className="px-5 py-3 rounded-full bg-white/90 hover:bg-white text-[#10263D] font-semibold text-sm sm:text-base flex items-center gap-2 border border-[#DCE7F0] shadow-2xs transition-colors"
                >
                  <span>{lang === 'bn' && currentSlide.ctaTextBn ? currentSlide.ctaTextBn : currentSlide.ctaText}</span>
                  <ChevronRight size={15} className="text-[#145CFF]" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Authentic Studio Photography Presentation */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
            <div className="w-full max-w-[620px]">
              <div className="relative w-full aspect-[4/3] flex items-center justify-center p-4 sm:p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-[#DCE7F0]/80 shadow-sm transition-all">
                <img
                  key={currentSlide.image}
                  src={currentSlide.image}
                  alt={currentSlide.imageAlt}
                  className={`w-full h-full object-contain drop-shadow-md transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-90'}`}
                  loading="eager"
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Interactive Category Tabs + Pause/Play Button */}
        <div className="mt-8 pt-4 border-t border-[#DCE7F0]/60 flex flex-wrap items-center justify-between gap-5 text-xs sm:text-sm">
          {/* Subtle Live Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#52677B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#145CFF]" />
            <span>Glacial Tech Premium Electronics Bangladesh</span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-6 ml-auto overflow-x-auto max-w-full py-1">
            {SLIDES.map((slide, idx) => {
              const isActive = idx === activeSlideIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => {
                    setActiveSlideIndex(idx);
                    setIsPaused(true);
                  }}
                  className={`pb-1 transition-all font-semibold relative whitespace-nowrap shrink-0 text-xs sm:text-sm ${
                    isActive 
                      ? 'text-[#145CFF]' 
                      : 'text-[#52677B] hover:text-[#10263D]'
                  }`}
                >
                  <span>{slide.tabLabel}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#145CFF] rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Pause / Play Control */}
            <button
              onClick={() => setIsPaused(prev => !prev)}
              className="p-1.5 rounded-full text-[#52677B] hover:text-[#10263D] hover:bg-white/80 transition-colors"
              title={isPaused ? "Play auto-rotation" : "Pause auto-rotation"}
              aria-label={isPaused ? "Play slide transition" : "Pause slide transition"}
            >
              {isPaused ? <Play size={15} /> : <Pause size={15} />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
