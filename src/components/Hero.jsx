import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Pause, Play, Zap, Sparkles } from 'lucide-react';

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
      badge: lang === 'bn' ? 'টপ অডিও' : 'Top Audio',
      title: lang === 'bn' ? 'উন্নত সাউন্ড ও কলিং\nপ্রো-টিডব্লিউএস ইয়ারবাডস' : 'Premium Studio Sound.\nPro TWS & ANC Earbuds.',
      subtitle: lang === 'bn' 
        ? 'হাইড্রোফোবিক বিল্ড, অ্যাক্টিভ নয়েজ ক্যান্সেলেশন ও ক্রিস্টাল ক্লিয়ার কলিং মাইক্রোফোন।'
        : 'Wireless earbuds, gaming headsets & sports neckbands with real acoustic performance.',
      category: 'earbuds',
      ctaText: lang === 'bn' ? 'অডিও কালেকশন কিনুন' : 'Shop Audio Collection',
      image: '/assets/hero-audio-headphones.jpg',
      imageAlt: 'Premium studio wireless headphones and crystal TWS earbuds'
    },
    {
      id: 'charging',
      productType: 'charging',
      tabLabel: lang === 'bn' ? 'চার্জার ও ক্যাবল' : 'Fast Charging',
      eyebrow: lang === 'bn' ? 'টার্বো পাওয়ার সল্যুশন' : 'TURBO POWER & CABLES',
      badge: lang === 'bn' ? 'সুপার ফাস্ট' : 'Super Fast',
      title: lang === 'bn' ? 'ফাস্ট চার্জিং ক্যাবল\n১২০W ম্যাক্স আউটপুট' : 'Fast Charging Cables.\n120W Max High-Speed.',
      subtitle: lang === 'bn'
        ? 'ব্রেইডেড ৪-ইন-১ ক্যাবল, গোল্ড-প্লেটেড কানেক্টর ও ওটিজি অ্যাডাপ্টার।'
        : 'High-density braided cables, OTG adapters & fast wall chargers for all devices.',
      category: 'chargers',
      ctaText: lang === 'bn' ? 'চার্জিং সামগ্রী কিনুন' : 'Shop Charging Gear',
      image: '/assets/cat-charging.jpg',
      imageAlt: 'Fast charging GaN adapters and multi-tip braided cables'
    },
    {
      id: 'wearables',
      productType: 'wearables',
      tabLabel: lang === 'bn' ? 'স্মার্টওয়াচ' : 'Smartwatches',
      eyebrow: lang === 'bn' ? 'স্মার্ট ওয়েয়ারবেলস' : 'ULTRA SMARTWEAR',
      badge: lang === 'bn' ? 'ট্রেন্ডিং' : 'Trending',
      title: lang === 'bn' ? 'সিম সাপোর্টেড স্মার্টওয়াচ\n৮+১ স্ট্র্যাপ কম্বো সেট' : 'Cellular Smartwatches.\n8+1 Strap Combo Sets.',
      subtitle: lang === 'bn'
        ? 'এইচডি ডিসপ্লে, ওয়্যারলেস চার্জিং, ব্লুটুথ কলিং ও ফিটনেস ট্র্যাকিং।'
        : 'Ultra display, interchangeable strap sets, cellular SIM calling & health tracking.',
      category: 'wearables',
      ctaText: lang === 'bn' ? 'স্মার্টওয়াচ কিনুন' : 'Shop Smartwatches',
      image: '/assets/cat-wearables.jpg',
      imageAlt: 'Ultra smartwatch with interchangeable straps'
    }
  ];

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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
    <section className="hero-shopee-container" aria-label="Featured Promotions and Collections">
      <div className="hero-layout-grid">
        
        {/* Left & Center Columns: Carousel Slider Card */}
        <div 
          className="hero-slider-card group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main Slider Content (Left: Text, Center: Image) */}
          <div className="hero-slider-body">
            
            {/* Left Content Panel (approx 25-26% of overall hero) */}
            <div className="hero-text-panel">
              <div className="flex items-center gap-2 mb-2">
                <span className="hero-badge-pill">
                  {currentSlide.badge}
                </span>
                <span className="hero-eyebrow-text">
                  {currentSlide.eyebrow}
                </span>
              </div>

              <h1 className="hero-headline">
                {currentSlide.title}
              </h1>

              <p className="hero-description">
                {currentSlide.subtitle}
              </p>

              {/* CTA Buttons: Primary Action + Secondary Browse All */}
              <div className="hero-cta-group">
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectCategory && currentSlide.category) onSelectCategory(currentSlide.category);
                    if (onShopClick) onShopClick();
                  }}
                  className="hero-btn-primary"
                  title={currentSlide.ctaText}
                >
                  <span>{currentSlide.ctaText}</span>
                  <ChevronRight size={15} className="stroke-[2.5]" />
                </button>

                <button
                  type="button"
                  onClick={onShopClick}
                  className="hero-btn-secondary"
                  title={lang === 'bn' ? 'সব পণ্য ব্রাউজ করুন' : 'Browse All Gear'}
                >
                  <span>{lang === 'bn' ? 'সব পণ্য' : 'Browse All'}</span>
                </button>
              </div>
            </div>

            {/* Center Main Product Image Showcase (approx 44% of overall hero) */}
            <div className="hero-image-showcase">
              <img
                key={currentSlide.image}
                src={currentSlide.image}
                alt={currentSlide.title.replace('\n', ' ')}
                className="hero-main-img"
                loading="eager"
              />
            </div>
          </div>

          {/* Slider Bottom Control Bar: Tabs & Nav */}
          <div className="hero-slider-bottom-bar">
            {/* Category Slide Indicators */}
            <div className="flex items-center gap-1 sm:gap-2">
              {SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => {
                    setActiveSlideIndex(idx);
                    setIsPaused(true);
                  }}
                  className={`hero-slide-tab ${idx === activeSlideIndex ? 'is-active' : ''}`}
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
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-7 h-7 rounded-full bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer shadow-2xs"
                aria-label="Next Slide"
              >
                <ChevronRight size={15} />
              </button>
              <button
                type="button"
                onClick={() => setIsPaused(p => !p)}
                className="w-7 h-7 rounded-full bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer shadow-2xs ml-1"
                title={isPaused ? "Play slide rotation" : "Pause slide rotation"}
                aria-label={isPaused ? "Play slide rotation" : "Pause slide rotation"}
              >
                {isPaused ? <Play size={11} /> : <Pause size={11} />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Promotional Cards Stack (approx 30% of overall hero) */}
        <div className="hero-promo-stack">
          
          {/* Card 1: Fast Charge Hub */}
          <div 
            onClick={() => {
              if (onSelectCategory) onSelectCategory('chargers');
              if (onShopClick) onShopClick();
            }}
            className="hero-promo-card group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (onSelectCategory) onSelectCategory('chargers');
                if (onShopClick) onShopClick();
              }
            }}
          >
            <div className="hero-promo-card-info">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#EE4D2D] uppercase tracking-wider mb-1">
                <Zap size={12} className="shrink-0" />
                <span>{lang === 'bn' ? 'ফাস্ট চার্জিং' : 'Fast Charge Hub'}</span>
              </div>
              <h3 className="text-sm sm:text-[15px] font-extrabold text-[#10263D] leading-snug group-hover:text-[#EE4D2D] transition-colors line-clamp-2">
                {lang === 'bn' ? '১০০% অরিজিনাল ক্যাবল ও অ্যাডাপ্টার' : 'GaN Chargers & 120W Cables'}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                {lang === 'bn' ? 'শুরু মাত্র ৳১৫০ থেকে' : 'Starting from ৳150 with warranty'}
              </p>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-[#EE4D2D] mt-2 group-hover:underline">
                <span>{lang === 'bn' ? 'কিনুন' : 'Shop Now'}</span>
                <ChevronRight size={13} className="shrink-0" />
              </div>
            </div>
            <div className="hero-promo-card-thumb">
              <img 
                src="/assets/cat-charging.jpg" 
                alt="GaN Chargers & Cables" 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                loading="eager"
              />
            </div>
          </div>

          {/* Card 2: Ultra Gear Smartwatches */}
          <div 
            onClick={() => {
              if (onSelectCategory) onSelectCategory('wearables');
              if (onShopClick) onShopClick();
            }}
            className="hero-promo-card group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (onSelectCategory) onSelectCategory('wearables');
                if (onShopClick) onShopClick();
              }
            }}
          >
            <div className="hero-promo-card-info">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#EE4D2D] uppercase tracking-wider mb-1">
                <Sparkles size={12} className="shrink-0" />
                <span>{lang === 'bn' ? 'স্মার্ট গ্যাজেট' : 'Ultra Gear'}</span>
              </div>
              <h3 className="text-sm sm:text-[15px] font-extrabold text-[#10263D] leading-snug group-hover:text-[#EE4D2D] transition-colors line-clamp-2">
                {lang === 'bn' ? 'সিম সাপোর্টেড স্মার্টওয়াচ' : 'SIM Smartwatches & Combos'}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                {lang === 'bn' ? '৮+১ মাল্টি-স্ট্র্যাপ সংস্করণ' : '8+1 Interchangeable Straps'}
              </p>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-[#EE4D2D] mt-2 group-hover:underline">
                <span>{lang === 'bn' ? 'কিনুন' : 'Shop Now'}</span>
                <ChevronRight size={13} className="shrink-0" />
              </div>
            </div>
            <div className="hero-promo-card-thumb">
              <img 
                src="/assets/cat-wearables.jpg" 
                alt="SIM Smartwatches & Combos" 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                loading="eager"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
