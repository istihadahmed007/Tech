import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Smartphone, Pause, Play, ChevronDown, Sparkles, Zap, ShieldCheck, Truck } from 'lucide-react';
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
  const SLIDES = [
    {
      id: 'audio',
      productType: 'audio',
      tabLabel: lang === 'bn' ? 'অডিও ও ইয়ারবাডস' : 'Audio Gear',
      eyebrow: lang === 'bn' ? 'অথেনটিক সাউন্ড কালেকশন' : 'AUTHENTIC SOUND COLLECTION',
      title: lang === 'bn' ? 'উন্নত সাউন্ড ও স্পষ্ট কলিং\nপ্রো-টিডব্লিউএস ইয়ারবাডস' : 'Premium Studio Sound.\nPro TWS & ANC Earbuds.',
      subtitle: lang === 'bn' 
        ? 'হাইড্রোফোবিক বিল্ড, অ্যাক্টিভ নয়েজ ক্যান্সেলেশন ও ক্রিস্টাল ক্লিয়ার কলিং মাইক্রোফোন।'
        : 'Wireless earbuds, gaming headsets & sports neckbands with real acoustic performance.',
      ctaText: lang === 'bn' ? 'অডিও কালেকশন কিনুন' : 'Shop Audio Collection',
      category: 'earbuds',
      image: '/assets/hero-audio-headphones.jpg',
      badge: lang === 'bn' ? 'সেরা অডিও' : 'Top Audio',
      accentColor: '#EE4D2D'
    },
    {
      id: 'charging',
      productType: 'charging',
      tabLabel: lang === 'bn' ? 'চার্জার ও ক্যাবল' : 'Fast Charging',
      eyebrow: lang === 'bn' ? 'টার্বো পাওয়ার সল্যুশন' : 'TURBO POWER & CABLES',
      title: lang === 'bn' ? 'ফাস্ট চার্জিং ক্যাবল\n১২০W ম্যাক্স আউটপুট' : 'Fast Charging Cables.\n120W Max High-Speed.',
      subtitle: lang === 'bn'
        ? 'ব্রেইডেড ৪-ইন-১ ক্যাবল, গোল্ড-প্লেটেড কানেক্টর ও ওটিজি অ্যাডাপ্টার।'
        : 'High-density braided cables, OTG adapters & fast wall chargers for all devices.',
      ctaText: lang === 'bn' ? 'চার্জিং সামগ্রী কিনুন' : 'Shop Charging Gear',
      category: 'chargers',
      image: '/assets/cat-charging.jpg',
      badge: lang === 'bn' ? 'সুপার ফাস্ট' : 'Super Fast',
      accentColor: '#EE4D2D'
    },
    {
      id: 'wearables',
      productType: 'wearables',
      tabLabel: lang === 'bn' ? 'স্মার্টওয়াচ' : 'Smartwatches',
      eyebrow: lang === 'bn' ? 'স্মার্ট ওয়েয়ারবেলস' : 'ULTRA SMARTWEAR',
      title: lang === 'bn' ? 'সিম সাপোর্টেড স্মার্টওয়াচ\n৮+১ স্ট্র্যাপ কম্বো সেট' : 'Cellular Smartwatches.\n8+1 Strap Combo Sets.',
      subtitle: lang === 'bn'
        ? 'এইচডি ডিসপ্লে, ওয়্যারলেস চার্জিং, ব্লুটুথ কলিং ও ফিটনেস ট্র্যাকিং।'
        : 'Ultra display, interchangeable strap sets, cellular SIM calling & health tracking.',
      ctaText: lang === 'bn' ? 'স্মার্টওয়াচ কিনুন' : 'Shop Smartwatches',
      category: 'wearables',
      image: '/assets/cat-wearables.jpg',
      badge: lang === 'bn' ? 'ট্রেন্ডিং' : 'Trending',
      accentColor: '#EE4D2D'
    }
  ];

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const currentSlide = SLIDES[activeSlideIndex];

  // Auto-rotation timer (every 6 seconds when not paused)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlideIndex(prev => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, SLIDES.length]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveSlideIndex(prev => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveSlideIndex(prev => (prev + 1) % SLIDES.length);
  };

  return (
    <section className="w-full my-4 sm:my-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-stretch">
        
        {/* Left Column: Shopee-Style Hero Carousel Slider (8 cols on lg) */}
        <div 
          className="lg:col-span-8 rounded-xl sm:rounded-2xl bg-white border border-[#ECECEC] shadow-xs relative overflow-hidden flex flex-col justify-between group min-h-[360px] sm:min-h-[420px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slide Content Grid */}
          <div className="p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 flex-1">
            {/* Slide Typography */}
            <div className="flex-1 max-w-md z-10 text-left">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-[11px] font-extrabold tracking-wider text-[#EE4D2D] bg-[#FFF5F1] px-2.5 py-0.5 rounded border border-[#FFDCD4]">
                  {currentSlide.badge}
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {currentSlide.eyebrow}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#10263D] tracking-tight leading-tight mb-2.5 whitespace-pre-line">
                {currentSlide.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                {currentSlide.subtitle}
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory(currentSlide.category);
                    if (onShopClick) onShopClick();
                  }}
                  className="px-6 py-2.5 sm:py-3 rounded-md bg-[#EE4D2D] hover:bg-[#D73211] active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>{currentSlide.ctaText}</span>
                  <ChevronRight size={16} className="stroke-[2.5]" />
                </button>

                <button
                  type="button"
                  onClick={onShopClick}
                  className="px-4 py-2.5 sm:py-3 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm border border-slate-200 transition-colors cursor-pointer"
                >
                  <span>{lang === 'bn' ? 'সব পণ্য' : 'Browse All'}</span>
                </button>
              </div>
            </div>

            {/* Slide Image Showcase */}
            <div className="w-full sm:w-[280px] md:w-[320px] aspect-square flex items-center justify-center p-3 relative shrink-0">
              <img
                key={currentSlide.image}
                src={currentSlide.image}
                alt={currentSlide.title}
                className="w-full h-full object-contain drop-shadow-md transition-transform duration-500 hover:scale-105"
                loading="eager"
              />
            </div>
          </div>

          {/* Navigation Controls: Arrows, Dots & Category Tabs */}
          <div className="px-4 sm:px-6 py-2.5 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between text-xs">
            {/* Category Slide Indicators */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                    idx === activeSlideIndex
                      ? 'bg-[#EE4D2D] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {slide.tabLabel}
                </button>
              ))}
            </div>

            {/* Prev / Next & Pause Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrev}
                className="w-7 h-7 rounded-full bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer shadow-2xs"
                aria-label="Previous Slide"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-7 h-7 rounded-full bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer shadow-2xs"
                aria-label="Next Slide"
              >
                <ChevronRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => setIsPaused(p => !p)}
                className="w-7 h-7 rounded-full bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer shadow-2xs ml-1"
                title={isPaused ? "Play" : "Pause"}
              >
                {isPaused ? <Play size={12} /> : <Pause size={12} />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Shopee-Style Dual Stacked Promo Highlight Banners (4 cols on lg) */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3.5 sm:gap-4">
          
          {/* Mini Banner 1: Fast Chargers & Cables */}
          <div 
            onClick={() => {
              if (onSelectCategory) onSelectCategory('chargers');
              if (onShopClick) onShopClick();
            }}
            className="flex-1 rounded-xl sm:rounded-2xl bg-white border border-[#ECECEC] p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4 group"
          >
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#EE4D2D] uppercase tracking-wider mb-1">
                <Zap size={12} />
                <span>{lang === 'bn' ? 'ফাস্ট চার্জিং' : 'Fast Charge Hub'}</span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#10263D] leading-tight group-hover:text-[#EE4D2D] transition-colors">
                {lang === 'bn' ? '১০০% অরিজিনাল ক্যাবল ও অ্যাডাপ্টার' : 'GaN Chargers & 120W Cables'}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                {lang === 'bn' ? 'শুরু মাত্র ৳১৫০ থেকে' : 'Starting from ৳150 with warranty'}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#EE4D2D] mt-2 group-hover:underline">
                <span>{lang === 'bn' ? 'কিনুন' : 'Shop Now'}</span>
                <ChevronRight size={13} />
              </span>
            </div>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-slate-50 p-2 border border-slate-100 shrink-0 flex items-center justify-center">
              <img 
                src="/assets/cat-charging.jpg" 
                alt="Chargers & Cables" 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
              />
            </div>
          </div>

          {/* Mini Banner 2: Ultra Smartwatches */}
          <div 
            onClick={() => {
              if (onSelectCategory) onSelectCategory('wearables');
              if (onShopClick) onShopClick();
            }}
            className="flex-1 rounded-xl sm:rounded-2xl bg-white border border-[#ECECEC] p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4 group"
          >
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#EE4D2D] uppercase tracking-wider mb-1">
                <Sparkles size={12} />
                <span>{lang === 'bn' ? 'স্মার্ট গ্যাজেট' : 'Ultra Gear'}</span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#10263D] leading-tight group-hover:text-[#EE4D2D] transition-colors">
                {lang === 'bn' ? 'সিম সাপোর্টেড স্মার্টওয়াচ' : 'SIM Smartwatches & Combos'}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                {lang === 'bn' ? 'মাল্টি-স্ট্র্যাপ সংস্করণ' : '8+1 Interchangeable Straps'}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#EE4D2D] mt-2 group-hover:underline">
                <span>{lang === 'bn' ? 'কিনুন' : 'Shop Now'}</span>
                <ChevronRight size={13} />
              </span>
            </div>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-slate-50 p-2 border border-slate-100 shrink-0 flex items-center justify-center">
              <img 
                src="/assets/cat-wearables.jpg" 
                alt="Smartwatches" 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
