import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Pause, Play, Zap, Sparkles, ArrowRight, Search, X } from 'lucide-react';

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
  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef(null);
  const searchDropdownRef = useRef(null);

  useEffect(() => {
    setLocalQuery(searchQuery || '');
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(e.target) &&
          searchInputRef.current && !searchInputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const liveSuggestions = useMemo(() => {
    if (!localQuery || localQuery.trim().length < 2 || !products || products.length === 0) return [];
    const q = localQuery.toLowerCase().trim();
    return products.filter((p) => {
      return (
        p.title?.toLowerCase().includes(q) ||
        (p.titleBn && p.titleBn.toLowerCase().includes(q)) ||
        p.category?.toLowerCase().includes(q) ||
        (p.photoRef && p.photoRef.toLowerCase().includes(q))
      );
    }).slice(0, 5);
  }, [localQuery, products]);

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (onSearchSubmit) {
      onSearchSubmit(localQuery);
    } else if (onShopClick) {
      onShopClick();
    }
  };

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
      {/* 0. Hero Agentic Search Console with Live Pulsing Cyan Indicator & Quick-Action Prompt Pills */}
      <div className="mb-4 sm:mb-6 bg-[#12141C] border border-[#1E2230] rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden group hover:border-cyan-500/40 focus-within:border-cyan-400 focus-within:shadow-[0_0_25px_rgba(6,182,212,0.2)] transition-all duration-300">
        {/* Top Status & Live Pulsing Cyan Indicator */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 shadow-[0_0_8px_#06B6D4]"></span>
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
              {lang === 'bn' ? 'এজেন্টিক হার্ডওয়্যার সার্চ' : 'AGENTIC HARDWARE SEARCH'}
            </span>
            <span className="hidden sm:inline-flex font-mono text-[10px] text-slate-400 px-2 py-0.5 rounded bg-[#161924] border border-[#1E2230]">
              LIVE INVENTORY MATCH
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
            <Zap size={13} className="text-emerald-400" />
            <span className="hidden sm:inline">{lang === 'bn' ? '২,০০০৳+ অর্ডারে সারাদেশে ফ্রি ডেলিভারি' : '৳2,000+ Unlocks Free Nationwide Shipping'}</span>
          </div>
        </div>

        {/* Search Bar Input */}
        <form onSubmit={handleHeroSearchSubmit} className="relative flex items-center gap-2">
          <div className="relative flex-grow">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={localQuery}
              onChange={(e) => {
                setLocalQuery(e.target.value);
                if (onSearchChange) onSearchChange(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (localQuery.trim().length >= 2) setShowSuggestions(true);
              }}
              placeholder={lang === 'bn' ? 'অ্যাক্সেসরিজ সার্চ করুন (যেমন: 120W কেবল, ANC ইয়ারবাড, S24 Ultra কেস)...' : "Ask Tech Nest Agent: '120W fast charging cables', 'Galaxy S24 Ultra', or 'ANC earbuds'..."}
              className="w-full pl-11 pr-24 py-3 bg-[#0B0D14] border border-[#1E2230] focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.25)] rounded-xl font-mono text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
            />
            {localQuery && (
              <button
                type="button"
                onClick={() => {
                  setLocalQuery('');
                  if (onSearchChange) onSearchChange('');
                  setShowSuggestions(false);
                }}
                className="absolute right-20 sm:right-24 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 font-mono text-[10px] text-slate-500 bg-[#161924] border border-[#1E2230] px-2 py-1 rounded-md">
              <span>ENTER ↵</span>
            </div>
          </div>

          <button
            type="submit"
            className="px-4 sm:px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <span>{lang === 'bn' ? 'সার্চ' : 'SEARCH'}</span>
            <ArrowRight size={14} className="stroke-[2.5]" />
          </button>
        </form>

        {/* Live Auto-Suggestions Dropdown */}
        {showSuggestions && liveSuggestions.length > 0 && (
          <div 
            ref={searchDropdownRef}
            className="absolute left-4 right-4 sm:left-5 sm:right-5 top-[95px] z-30 bg-[#0B0D14] border border-[#1E2230] rounded-xl shadow-2xl overflow-hidden divide-y divide-[#1E2230]"
          >
            <div className="px-3 py-1.5 bg-[#12141C] text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center justify-between">
              <span>MATCHING GEAR ({liveSuggestions.length})</span>
              <span className="text-slate-500">PRESS ENTER TO VIEW ALL</span>
            </div>
            {liveSuggestions.map((prod) => (
              <div
                key={prod.id}
                onClick={() => {
                  setShowSuggestions(false);
                  if (onSelectProduct) onSelectProduct(prod);
                }}
                className="p-2.5 hover:bg-[#161924] flex items-center justify-between gap-3 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img 
                    src={prod.image} 
                    alt={prod.title} 
                    className="w-8 h-8 rounded-lg object-contain bg-[#12141C] p-0.5 border border-[#1E2230] shrink-0" 
                  />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-white truncate">
                      {lang === 'bn' ? (prod.titleBn || prod.title) : prod.title}
                    </p>
                    <span className="font-mono text-[10px] text-cyan-400">
                      {prod.brand || 'Tech Nest'}
                    </span>
                  </div>
                </div>
                <span className="font-mono font-black text-xs text-white shrink-0">
                  ৳{prod.price.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Quick-Action Prompt Pills Underneath */}
        <div className="flex items-center flex-wrap gap-2 mt-3 pt-3 border-t border-[#1E2230]">
          <span className="font-mono text-[10px] uppercase font-bold text-slate-500 mr-1 flex items-center gap-1">
            PROMPTS:
          </span>

          {/* Pill 1: ⚡ Unlock ৳2,000 Free Delivery */}
          <button
            type="button"
            onClick={() => {
              if (onScrollToBundles) onScrollToBundles();
              else if (onShopClick) onShopClick();
            }}
            className="px-3 py-1.5 rounded-xl bg-[#161924] hover:bg-[#1E2230] text-slate-200 hover:text-cyan-400 border border-[#1E2230] hover:border-cyan-500/40 font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <span>⚡ Unlock ৳2,000 Free Delivery</span>
          </button>

          {/* Pill 2: 📱 Match My Phone */}
          <button
            type="button"
            onClick={() => {
              if (onFindPhoneClick) onFindPhoneClick();
            }}
            className="px-3 py-1.5 rounded-xl bg-[#161924] hover:bg-[#1E2230] text-slate-200 hover:text-cyan-400 border border-[#1E2230] hover:border-cyan-500/40 font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <span>📱 Match My Phone</span>
          </button>

          {/* Pill 3: 🎧 Audio Under ৳500 */}
          <button
            type="button"
            onClick={() => {
              if (onFilterAudioUnder500) {
                onFilterAudioUnder500();
              } else {
                if (onSelectCategory) onSelectCategory('audio');
                if (onShopClick) onShopClick();
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-[#161924] hover:bg-[#1E2230] text-slate-200 hover:text-cyan-400 border border-[#1E2230] hover:border-cyan-500/40 font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <span>🎧 Audio Under ৳500</span>
          </button>
        </div>
      </div>

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
