import React, { useState, useEffect } from 'react';
import { ChevronRight, Smartphone, Pause, Play, ChevronDown, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { BRANDS_AND_MODELS } from '../data/catalog';
import BrandLogo from './BrandLogo';

export default function Hero({ 
  onShopClick, 
  onFindPhoneClick, 
  onSelectCategory,
  onSelectPhone,
  t = {}, 
  lang = 'en',
  selectedCategory = null
}) {
  // Flagship showcase slides with rich photography and curated collection links
  const SLIDES = [
    {
      id: 'audio',
      productType: 'audio',
      tabLabel: lang === 'bn' ? 'অডিও কালেকশন' : 'Audio Gear',
      eyebrow: lang === 'bn' ? 'অথেনটিক সাউন্ড কালেকশন' : 'AUTHENTIC SOUND COLLECTION',
      title: lang === 'bn' ? 'উন্নত সাউন্ড।\nঅনবদ্য সরলতা।' : 'Better sound.\nBeautifully simple.',
      subtitle: lang === 'bn' 
        ? 'ওয়্যারলেস এয়ারবাডস, স্টুডিও গেমিং হেডসেট ও স্পোর্টস নেকব্যান্ডের অথেনটিক কালেকশন।'
        : 'Discover wireless earbuds, studio gaming headsets & sports neckbands with active acoustic performance.',
      category: 'earbuds',
      hasInlineForm: false,
      ctaText: lang === 'bn' ? 'অডিও কালেকশন কিনুন' : 'Shop Audio Collection',
      image: '/assets/hero-audio-headphones.jpg',
      imageAlt: 'Premium studio wireless headphones and crystal TWS earbuds'
    },
    {
      id: 'wearables',
      productType: 'wearables',
      tabLabel: lang === 'bn' ? 'স্মার্টওয়াচ' : 'Smartwatches',
      eyebrow: lang === 'bn' ? 'আল্ট্রা স্মার্টওয়েয়ার' : 'ULTRA SMARTWEAR',
      title: lang === 'bn' ? 'স্মার্ট স্টাইল।\nসারাদিনের কানেক্টিভিটি।' : 'Smart style.\nAll-day connected.',
      subtitle: lang === 'bn'
        ? 'সেলুলার সিম স্মার্টওয়াচ, ৮+১ স্ট্র্যাপ কম্বো সংস্করণ ও টাইটানিয়াম বিল্ড কোয়ালিটি।'
        : 'Cellular SIM smartwatches, multi-strap combo editions, health monitoring & aerospace titanium designs.',
      category: 'wearables',
      hasInlineForm: false,
      ctaText: lang === 'bn' ? 'স্মার্টওয়াচ কালেকশন কিনুন' : 'Shop Smartwatches',
      image: '/assets/cat-wearables.jpg',
      imageAlt: 'Ultra smartwatch with interchangeable straps and vivid display'
    },
    {
      id: 'charging',
      productType: 'charging',
      tabLabel: lang === 'bn' ? 'টার্বো চার্জিং' : 'Turbo Charging',
      eyebrow: lang === 'bn' ? 'টার্বো পাওয়ার ও ক্যাবল' : 'POWER & 120W CABLES',
      title: lang === 'bn' ? 'দ্রুত চার্জিং।\nপ্রতিদিনের প্রস্তুতি।' : 'Fast charging.\nEveryday ready.',
      subtitle: lang === 'bn'
        ? 'হাই-স্পিড ব্রেইডেড ৪-ইন-১ ক্যাবল, ওটিজি অ্যাডাপ্টার ও ১২০W পর্যন্ত GaN টার্বো চার্জার।'
        : 'High-speed braided multi-tip cables, OTG adapters & cryogenic 120W GaN turbo chargers for all devices.',
      category: 'chargers',
      hasInlineForm: false,
      ctaText: lang === 'bn' ? 'চার্জিং সামগ্রী কিনুন' : 'Shop Charging Gear',
      image: '/assets/cat-charging.jpg',
      imageAlt: 'Fast charging GaN adapters and multi-tip braided cables'
    },
    {
      id: 'compatibility',
      productType: 'cases',
      tabLabel: lang === 'bn' ? 'ডিভাইস ফিট' : 'Device Fit',
      eyebrow: lang === 'bn' ? 'আপনার ফোনের জন্য নিশ্চিত ফিট' : 'MADE FOR YOUR PHONE',
      title: lang === 'bn' ? 'আপনার ফোন।\nআপনার পারফেক্ট ফিট।' : 'Your phone.\nYour perfect fit.',
      subtitle: lang === 'bn'
        ? 'আপনার ফোনের ব্র্যান্ড ও মডেল সিলেক্ট করে ১০০% ম্যাচিং ক্যাবল, চার্জার ও গ্যাজেট খুঁজুন।'
        : 'Find verified compatible cables, chargers, cases and audio gear engineered precisely for your phone.',
      category: 'cases',
      hasInlineForm: true,
      image: '/assets/hero-phone-cases-fit.jpg',
      imageAlt: 'Curated accessories matched to smartphone models'
    }
  ];

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);

  // Inline compatibility selector state
  const [activeBrand, setActiveBrand] = useState('Apple');
  const [activeModel, setActiveModel] = useState('iPhone 15 Pro');

  const currentSlide = SLIDES[activeSlideIndex];
  const brandModels = BRANDS_AND_MODELS.find(b => b.brand === activeBrand)?.models || [];

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
    <section 
      className="relative w-full my-4 sm:my-8 overflow-hidden rounded-3xl border border-[#ECECEC] shadow-sm"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 247, 245, 0.94) 50%, rgba(255, 255, 255, 0.98) 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient Warm Tech Specular Glow */}
      <div 
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, #FFE2DA 0%, rgba(255, 226, 218, 0) 70%)' }}
        aria-hidden="true"
      />
      <div 
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full pointer-events-none opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #FFF0EC 0%, rgba(255, 240, 236, 0) 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 px-5 sm:px-10 lg:px-14 pt-8 sm:pt-12 pb-8 sm:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Eyebrow, Main Headline, Subtitle & Interactive Action Form */}
          <div className="lg:col-span-5 flex flex-col items-start z-10 text-left">
            {/* Eyebrow Pill */}
            <div className="flex items-center gap-2 mb-3.5">
              <span className="text-[11px] font-extrabold tracking-wider text-[#EE4D2D] bg-[#FFF5F1] px-3 py-1 rounded-full border border-[#FFDCD4] uppercase">
                {currentSlide.eyebrow}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold tracking-wider uppercase">
                <BrandLogo variant="icon" height={14} className="w-3.5 h-3.5" />
                <span>Tech Nest</span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[50px] xl:text-[54px] font-extrabold text-[#10263D] tracking-tight leading-[1.1] mb-3.5 whitespace-pre-line">
              {currentSlide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 max-w-md">
              {currentSlide.subtitle}
            </p>

            {/* Action Area: Phone Selector OR Primary Action Buttons */}
            {currentSlide.hasInlineForm ? (
              <form onSubmit={handleInlineFormSubmit} className="w-full max-w-sm space-y-3">
                <div>
                  <label htmlFor="hero-phone-brand" className="block text-xs font-bold text-[#10263D] mb-1.5">
                    {lang === 'bn' ? 'ফোনের ব্র্যান্ড' : 'Phone brand'}
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
                      className="w-full bg-white text-xs sm:text-sm font-semibold text-[#10263D] rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-[#EE4D2D] shadow-2xs appearance-none cursor-pointer pr-8"
                    >
                      {BRANDS_AND_MODELS.map(b => (
                        <option key={b.brand} value={b.brand}>{b.brand}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label htmlFor="hero-phone-model" className="block text-xs font-bold text-[#10263D] mb-1.5">
                    {lang === 'bn' ? 'ফোনের মডেল' : 'Phone model'}
                  </label>
                  <div className="relative">
                    <select
                      id="hero-phone-model"
                      value={activeModel}
                      onChange={(e) => setActiveModel(e.target.value)}
                      className="w-full bg-white text-xs sm:text-sm font-semibold text-[#10263D] rounded-xl border border-slate-200 px-3.5 py-2.5 outline-none focus:border-[#EE4D2D] shadow-2xs appearance-none cursor-pointer pr-8"
                    >
                      {brandModels.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#EE4D2D] hover:bg-[#D73211] active:scale-98 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <span>{lang === 'bn' ? 'আমার অ্যাক্সেসরিজ খুঁজুন' : 'Find my accessories'}</span>
                    <ChevronRight size={16} className="stroke-[2.5]" />
                  </button>

                  <button
                    type="button"
                    onClick={onShopClick}
                    className="text-xs sm:text-sm font-bold text-[#EE4D2D] hover:underline flex items-center gap-1 pl-1 pt-1 sm:pt-0 cursor-pointer"
                  >
                    <span>{lang === 'bn' ? 'সব অ্যাক্সেসরিজ দেখুন' : 'Browse all accessories'}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => {
                    if (currentSlide.category && onSelectCategory) {
                      onSelectCategory(currentSlide.category);
                    }
                    if (onShopClick) onShopClick();
                  }}
                  className="px-6 py-3 rounded-xl bg-[#EE4D2D] hover:bg-[#D73211] active:scale-98 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>{currentSlide.ctaText}</span>
                  <ChevronRight size={17} className="stroke-[2.5]" />
                </button>

                <button
                  type="button"
                  onClick={onShopClick}
                  className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#10263D] font-bold text-sm sm:text-base flex items-center gap-2 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                >
                  <span>{lang === 'bn' ? 'সব পণ্য ব্রাউজ করুন' : 'Browse All Gear'}</span>
                  <ChevronRight size={15} className="text-[#EE4D2D]" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: LARGE Studio Photography Showcase Presentation */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative w-full">
            <div className="w-full max-w-[640px] lg:max-w-[660px]">
              <div className="relative w-full aspect-[4/3] min-h-[280px] sm:min-h-[360px] lg:min-h-[420px] flex items-center justify-center p-4 sm:p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-md transition-all group">
                <img
                  key={currentSlide.image}
                  src={currentSlide.image}
                  alt={currentSlide.imageAlt}
                  className="w-full h-full max-h-[460px] object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Interactive Category Tabs + Live Status + Auto-rotation Controls */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-[#EE4D2D] animate-pulse" />
            <span>{lang === 'bn' ? 'টেক নেস্ট • ১০০% অথেনটিক পণ্য ও ফাস্ট ডেলিভারি' : 'Tech Nest • Authentic Mobile Accessories & Fast Delivery'}</span>
          </div>

          {/* Interactive Slide Tabs */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto overflow-x-auto max-w-full py-1">
            {SLIDES.map((slide, idx) => {
              const isActive = idx === activeSlideIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => {
                    setActiveSlideIndex(idx);
                    setIsPaused(true);
                  }}
                  className={`pb-1.5 transition-all font-bold relative whitespace-nowrap shrink-0 text-xs sm:text-sm cursor-pointer ${
                    isActive 
                      ? 'text-[#EE4D2D]' 
                      : 'text-slate-500 hover:text-[#10263D]'
                  }`}
                >
                  <span>{slide.tabLabel}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#EE4D2D] rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Play/Pause Control */}
            <button
              type="button"
              onClick={() => setIsPaused(prev => !prev)}
              className="p-1.5 rounded-full text-slate-500 hover:text-[#10263D] hover:bg-white transition-colors cursor-pointer ml-1"
              title={isPaused ? "Play auto-rotation" : "Pause auto-rotation"}
              aria-label={isPaused ? "Play slide transition" : "Pause slide transition"}
            >
              {isPaused ? <Play size={14} /> : <Pause size={14} />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
