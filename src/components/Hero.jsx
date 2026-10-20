import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Pause, Play, Zap, Sparkles, ArrowRight } from 'lucide-react';

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
      id: 'finder',
      productType: 'audio',
      tabLabel: lang === 'bn' ? 'স্মার্ট ম্যাচিং' : 'Smart Finder',
      eyebrow: lang === 'bn' ? 'টেক নেস্ট সিগনেচার এক্সপেরিয়েন্স' : 'FIND THE TECH THAT FITS YOUR LIFE',
      badge: lang === 'bn' ? 'সিগনেচার' : 'AI MATCHING',
      title: lang === 'bn' ? 'আপনার জীবনের সাথে\nমানানসই প্রযুক্তি খুঁজুন' : 'Find the Tech That\nFits Your Life.',
      subtitle: lang === 'bn' 
        ? 'বাজেট, ব্যবহার এবং অগ্রাধিকারের ভিত্তিতে যাচাইকৃত অডিও, ফাস্ট চার্জার ও স্মার্টওয়াচ ম্যাচ করুন।'
        : 'Smart discovery questionnaire, honest side-by-side spec comparison, and verified nationwide delivery.',
      category: 'earbuds',
      ctaText: lang === 'bn' ? 'টেক ফাইন্ডার শুরু করুন' : 'Launch Tech Finder',
      isFinderCta: true,
      image: '/assets/hero-audio-headphones.jpg',
      imageAlt: 'Premium studio wireless headphones and crystal TWS earbuds',
      telemetry: ['98% FIT ACCURACY', 'ACTIVE DIAGNOSTICS', 'VERIFIED STOCK']
    },
    {
      id: 'charging',
      productType: 'charging',
      tabLabel: lang === 'bn' ? 'চার্জার ও ক্যাবল' : 'Fast Charging',
      eyebrow: lang === 'bn' ? 'টার্বো পাওয়ার সল্যুশন' : 'TURBO POWER & CABLES',
      badge: lang === 'bn' ? 'সুপার ফাস্ট' : '120W TURBO',
      title: lang === 'bn' ? 'ফাস্ট চার্জিং ক্যাবল\n১২০W ম্যাক্স আউটপুট' : 'Fast Charging Cables.\n120W Max High-Speed.',
      subtitle: lang === 'bn'
        ? 'ব্রেইডেড ৪-ইন-১ ক্যাবল, গোল্ড-প্লেটেড কানেক্টর ও ওটিজি অ্যাডাপ্টার।'
        : 'High-density braided cables, OTG adapters & fast wall chargers with verified specs.',
      category: 'chargers',
      ctaText: lang === 'bn' ? 'চার্জিং সামগ্রী দেখুন' : 'Explore Charging',
      image: '/assets/cat-charging.jpg',
      imageAlt: 'Fast charging GaN adapters and multi-tip braided cables',
      telemetry: ['120W HIGH-SPEED', 'GOLD CONNECTORS', 'NATIONWIDE ৳0']
    },
    {
      id: 'wearables',
      productType: 'wearables',
      tabLabel: lang === 'bn' ? 'স্মার্টওয়াচ' : 'Smartwatches',
      eyebrow: lang === 'bn' ? 'স্মার্ট ওয়েয়ারবেলস' : 'ULTRA SMARTWEAR',
      badge: lang === 'bn' ? 'ট্রেন্ডিং' : 'CELLULAR SIM',
      title: lang === 'bn' ? 'সিম সাপোর্টেড স্মার্টওয়াচ\n৮+১ স্ট্র্যাপ কম্বো সেট' : 'Cellular Smartwatches.\n8+1 Strap Combo Sets.',
      subtitle: lang === 'bn'
        ? 'এইচডি ডিসপ্লে, ওয়্যারলেস চার্জিং, ব্লুটুথ কলিং ও ফিটনেস ট্র্যাকিং।'
        : 'Ultra display, interchangeable strap sets, cellular SIM calling & health tracking.',
      category: 'wearables',
      ctaText: lang === 'bn' ? 'স্মার্টওয়াচ দেখুন' : 'Explore Smartwatches',
      image: '/assets/cat-wearables.jpg',
      imageAlt: 'Ultra smartwatch with interchangeable straps',
      telemetry: ['8+1 STRAPS', 'SIM CALLING', 'HEALTH TELEMETRY']
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
    <section className="w-full my-4 sm:my-6" aria-label="Featured Promotions and Collections">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left & Center: 8 Cols (Hero Bento Card) */}
        <div 
          className="lg:col-span-8 bg-[#12141C] border border-[#1E2230] rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group hover:border-cyan-500/30 transition-all duration-300 relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main Slide Body */}
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 flex-grow">
            {/* Left Content Column */}
            <div className="flex-1 flex flex-col items-start z-10 text-left">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="font-mono text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  [{currentSlide.badge}]
                </span>
                <span className="font-mono text-[10px] tracking-wider text-slate-400 uppercase font-semibold">
                  {currentSlide.eyebrow}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-3 whitespace-pre-line">
                {currentSlide.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 max-w-md">
                {currentSlide.subtitle}
              </p>

              {/* Telemetry Spec Badges */}
              <div className="flex items-center flex-wrap gap-1.5 mb-5">
                {currentSlide.telemetry?.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#161924] border border-[#1E2230] text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    if (currentSlide.isFinderCta && onFindPhoneClick) {
                      onFindPhoneClick();
                    } else {
                      if (onSelectCategory && currentSlide.category) onSelectCategory(currentSlide.category);
                      if (onShopClick) onShopClick();
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.35)] cursor-pointer active:scale-95"
                >
                  <span>{currentSlide.ctaText}</span>
                  <ChevronRight size={14} className="stroke-[2.5]" />
                </button>

                <button
                  type="button"
                  onClick={onShopClick}
                  className="px-4 py-2.5 rounded-xl bg-[#161924] hover:bg-[#1E2230] text-slate-200 border border-[#1E2230] hover:border-slate-600 font-mono text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span>{lang === 'bn' ? 'সব পণ্য' : 'Browse All'}</span>
                </button>
              </div>
            </div>

            {/* Right Product Image Showcase */}
            <div className="w-full sm:w-64 md:w-72 aspect-square flex items-center justify-center p-3 relative shrink-0">
              <div className="absolute inset-0 bg-cyan-500/5 rounded-2xl blur-xl" />
              <img
                key={currentSlide.image}
                src={currentSlide.image}
                alt={currentSlide.title.replace('\n', ' ')}
                className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-105"
                loading="eager"
              />
            </div>
          </div>

          {/* Slider Bottom Control Bar: Tabs & Nav */}
          <div className="px-6 py-3 border-t border-[#1E2230] bg-[#0E1017] flex items-center justify-between gap-3">
            {/* Category Slide Indicators */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => {
                    setActiveSlideIndex(idx);
                    setIsPaused(true);
                  }}
                  className={`px-3 py-1 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer ${
                    idx === activeSlideIndex 
                      ? 'bg-cyan-500 text-slate-950 font-bold border border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                      : 'bg-[#161924] text-slate-400 hover:text-white border border-[#1E2230]'
                  }`}
                >
                  {slide.tabLabel}
                </button>
              ))}
            </div>

            {/* Prev / Next & Pause Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                className="w-7 h-7 rounded-lg bg-[#161924] border border-[#1E2230] hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Previous Slide"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-7 h-7 rounded-lg bg-[#161924] border border-[#1E2230] hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Next Slide"
              >
                <ChevronRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => setIsPaused(p => !p)}
                className="w-7 h-7 rounded-lg bg-[#161924] border border-[#1E2230] hover:border-cyan-500/40 text-slate-400 hover:text-cyan-400 flex items-center justify-center cursor-pointer transition-colors ml-1"
                title={isPaused ? "Play slide rotation" : "Pause slide rotation"}
                aria-label={isPaused ? "Play slide rotation" : "Pause slide rotation"}
              >
                {isPaused ? <Play size={10} /> : <Pause size={10} />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: 4 Cols Stacked Bento Promo Cards */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Card 1: Fast Charge Hub */}
          <div 
            onClick={() => {
              if (onSelectCategory) onSelectCategory('chargers');
              if (onShopClick) onShopClick();
            }}
            className="flex-1 bg-[#12141C] border border-[#1E2230] hover:border-cyan-500/30 rounded-2xl p-5 flex items-center justify-between gap-4 cursor-pointer group transition-all duration-300 shadow-md relative overflow-hidden"
            role="button"
            tabIndex="0"
          >
            <div className="flex flex-col items-start z-10">
              <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                FAST CHARGE HUB
              </span>
              <h3 className="font-bold text-sm text-white group-hover:text-cyan-400 transition-colors mb-1">
                GaN Chargers & 120W Cables
              </h3>
              <p className="font-mono text-[11px] text-slate-400 mb-2">
                Starting from ৳150 with warranty
              </p>
              <span className="font-mono text-[11px] font-bold text-cyan-400 flex items-center gap-1 group-hover:underline">
                <span>Shop Now</span>
                <ArrowRight size={12} />
              </span>
            </div>
            <div className="w-20 h-20 rounded-xl bg-[#0B0D14] p-1.5 border border-[#1E2230] shrink-0">
              <img 
                src="/assets/cat-charging.jpg" 
                alt="GaN Chargers" 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
              />
            </div>
          </div>

          {/* Card 2: Ultra Gear */}
          <div 
            onClick={() => {
              if (onSelectCategory) onSelectCategory('wearables');
              if (onShopClick) onShopClick();
            }}
            className="flex-1 bg-[#12141C] border border-[#1E2230] hover:border-cyan-500/30 rounded-2xl p-5 flex items-center justify-between gap-4 cursor-pointer group transition-all duration-300 shadow-md relative overflow-hidden"
            role="button"
            tabIndex="0"
          >
            <div className="flex flex-col items-start z-10">
              <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                # ULTRA GEAR
              </span>
              <h3 className="font-bold text-sm text-white group-hover:text-cyan-400 transition-colors mb-1">
                SIM Smartwatches & Combos
              </h3>
              <p className="font-mono text-[11px] text-slate-400 mb-2">
                8+1 Interchangeable Straps
              </p>
              <span className="font-mono text-[11px] font-bold text-cyan-400 flex items-center gap-1 group-hover:underline">
                <span>Shop Now</span>
                <ArrowRight size={12} />
              </span>
            </div>
            <div className="w-20 h-20 rounded-xl bg-[#0B0D14] p-1.5 border border-[#1E2230] shrink-0">
              <img 
                src="/assets/cat-wearables.jpg" 
                alt="SIM Smartwatches" 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
