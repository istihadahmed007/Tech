import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Smartphone, Pause, Play, ChevronDown } from 'lucide-react';
import { BRANDS_AND_MODELS } from '../data/catalog';

export default function Hero({ 
  onShopClick, 
  onFindPhoneClick, 
  onSelectCategory,
  onSelectPhone,
  t = {}, 
  lang = 'en' 
}) {
  // Available slides corresponding directly to the three reference designs
  const SLIDES = [
    {
      id: 'audio',
      tabLabel: 'Audio',
      eyebrow: 'AUTHENTIC SOUND COLLECTION',
      title: 'Better sound.\nBeautifully simple.',
      titleBn: 'উন্নত সাউন্ড।\nঅনবদ্য সরলতা।',
      subtitle: 'Discover wireless earbuds, studio gaming headsets & sports neckbands.',
      subtitleBn: 'ওয়্যারলেস এয়ারবাডস, গেমিং হেডসেট ও স্পোর্টস নেকব্যান্ডের সেরা কালেকশন।',
      hasInlineForm: false,
      ctaText: 'Explore audio',
      ctaTextBn: 'অডিও কালেকশন দেখুন',
      onCtaClick: () => onSelectCategory && onSelectCategory('audio'),
      image: '/assets/hero-audio-headphones.jpg',
      imageAlt: 'Premium wireless audio headphones and crystal TWS earbuds'
    },
    {
      id: 'wearables',
      tabLabel: 'Smartwatches',
      eyebrow: 'ULTRA WEARABLES',
      title: 'Smart style.\nAll-day connected.',
      titleBn: 'স্মার্ট স্টাইল।\nসারাদিনের কানেক্টিভিটি।',
      subtitle: 'Cellular SIM smartwatches, multi-strap combo editions & fitness trackers.',
      subtitleBn: 'সিম সাপোর্টেড স্মার্টওয়াচ, ৮+১ স্ট্র্যাপ কম্বো ও হেলথ ট্র্যাকিং।',
      hasInlineForm: false,
      ctaText: 'Explore watches',
      ctaTextBn: 'স্মার্টওয়াচ দেখুন',
      onCtaClick: () => onSelectCategory && onSelectCategory('wearables'),
      image: '/assets/cat-wearables.jpg',
      imageAlt: 'Ultra smartwatch with interchangeable straps'
    },
    {
      id: 'charging',
      tabLabel: 'Charging',
      eyebrow: 'POWER & CABLES',
      title: 'Fast charging.\nEveryday ready.',
      titleBn: 'দ্রুত চার্জিং।\nপ্রতিদিনের প্রস্তুতি।',
      subtitle: 'Braided multi-tip cables, OTG adapters & turbo wall chargers.',
      subtitleBn: 'ব্রেইডেড ৪-ইন-১ ক্যাবল, ওটিজি অ্যাডাপ্টার ও ফাস্ট চার্জার।',
      hasInlineForm: false,
      ctaText: 'Shop charging',
      ctaTextBn: 'চার্জিং সামগ্রী দেখুন',
      onCtaClick: () => onSelectCategory && onSelectCategory('charging'),
      image: '/assets/cat-charging.jpg',
      imageAlt: 'Fast charging adapters and multi-tip braided cables'
    },
    {
      id: 'compatibility',
      tabLabel: 'Device Fit',
      eyebrow: 'MADE FOR YOUR PHONE',
      title: 'Your phone.\nYour perfect fit.',
      titleBn: 'আপনার ফোন।\nআপনার পারফেক্ট ফিট।',
      subtitle: 'Find compatible cables, chargers, and audio gear for your phone model.',
      subtitleBn: 'আপনার ফোন মডেলের জন্য সম্পূর্ণ মানানসই ক্যাবল, চার্জার ও অডিও খুঁজুন।',
      hasInlineForm: true,
      image: '/assets/hero-phone-cases-fit.jpg',
      imageAlt: 'Curated accessories matched to smartphone models'
    }
  ];

  // Active slide index (defaulting to slide 0: Cases / Made For Your Phone - Image 1)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Inline form state for Slide 0 (Cases / Fit)
  const [activeBrand, setActiveBrand] = useState('Apple');
  const [activeModel, setActiveModel] = useState('iPhone 15 Pro');

  const currentSlide = SLIDES[activeSlideIndex];
  const brandModels = BRANDS_AND_MODELS.find(b => b.brand === activeBrand)?.models || [];

  // Handle inline form submit on Slide 0
  const handleInlineFormSubmit = (e) => {
    e.preventDefault();
    if (activeModel && onSelectPhone) {
      onSelectPhone(activeModel);
    }
    if (onShopClick) {
      onShopClick();
    }
  };

  // Auto-rotation timer (every 7.5 seconds when not paused)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveSlideIndex(prev => (prev + 1) % SLIDES.length);
    }, 7500);

    return () => clearInterval(timer);
  }, [isPaused, SLIDES.length]);

  return (
    <section className="relative w-full max-w-[1320px] mx-auto mb-8 sm:mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-[#EAF5FF] via-[#E4F2FD] to-[#EDF6FF] border border-[#DCE7F0] shadow-sm">
      {/* Background Specular Ambient Glow */}
      <div 
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, #C8E3FC 0%, rgba(200, 227, 252, 0) 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 px-6 sm:px-12 lg:px-16 pt-8 sm:pt-12 pb-16 lg:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Typography, Eyebrow & Controls */}
          <div className="lg:col-span-5 flex flex-col items-start z-10">
            {/* Eyebrow Pill / Label */}
            <span className="text-[11px] font-bold tracking-[0.14em] text-[#52677B] uppercase mb-3.5">
              {currentSlide.eyebrow}
            </span>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold text-[#10263D] tracking-tight leading-[1.08] mb-3.5 whitespace-pre-line">
              {lang === 'bn' && currentSlide.titleBn ? currentSlide.titleBn : currentSlide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-[17px] text-[#52677B] leading-relaxed mb-6 max-w-md">
              {lang === 'bn' && currentSlide.subtitleBn ? currentSlide.subtitleBn : currentSlide.subtitle}
            </p>

            {/* Action Area: Either Inline Phone Selector (Image 1) OR Action Buttons (Images 2 & 3) */}
            {currentSlide.hasInlineForm ? (
              /* Inline Phone Selector Form (Exact match for Image 1) */
              <form onSubmit={handleInlineFormSubmit} className="w-full max-w-sm space-y-3.5">
                {/* Brand Selector */}
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

                {/* Model Selector */}
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

                {/* Submit & Browse Links */}
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
              /* Action Buttons (Exact match for Images 2 & 3) */
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={currentSlide.onCtaClick}
                  className="px-6 py-3 rounded-full bg-[#145CFF] hover:bg-[#0D4BD9] active:scale-[0.98] text-white font-semibold text-sm sm:text-base flex items-center gap-2 shadow-sm transition-all"
                >
                  <span>{lang === 'bn' && currentSlide.ctaTextBn ? currentSlide.ctaTextBn : currentSlide.ctaText}</span>
                  <ChevronRight size={17} className="stroke-[2.5]" />
                </button>

                {currentSlide.secondaryText && (
                  <button
                    type="button"
                    onClick={currentSlide.onSecondaryClick}
                    className="text-sm sm:text-base font-semibold text-[#145CFF] hover:underline flex items-center gap-1 pl-1"
                  >
                    <span>{lang === 'bn' && currentSlide.secondaryTextBn ? currentSlide.secondaryTextBn : currentSlide.secondaryText}</span>
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Clean Studio Product Showcase Asset */}
          <div className="lg:col-span-7 flex items-center justify-center relative">
            <div className="relative w-full aspect-[4/3] max-w-[580px] flex items-center justify-center">
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

        {/* Bottom Bar: Interactive Category Tabs + Pause/Play Button (Exact match for Image 2) */}
        <div className="mt-8 pt-4 border-t border-[#DCE7F0]/60 flex flex-wrap items-center justify-end gap-5 text-xs sm:text-sm">
          {/* Tab buttons */}
          <div className="flex items-center gap-4 sm:gap-6">
            {SLIDES.map((slide, idx) => {
              const isActive = idx === activeSlideIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => {
                    setActiveSlideIndex(idx);
                    setIsPaused(true); // User click pauses rotation for deliberate viewing
                  }}
                  className={`pb-1 transition-all font-semibold relative ${
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
          </div>

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
    </section>
  );
}
