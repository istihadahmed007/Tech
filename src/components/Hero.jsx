import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Sun, 
  BatteryCharging, 
  ShieldCheck, 
  Camera, 
  Clock, 
  Navigation,
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
      id: 'watch-5-pro',
      theme: 'dark',
      headline: 'Watch 5 Pro',
      subtitle: 'Pro-Level Outdoor Sports | Superior hardness and durability',
      features: [
        { icon: Sun, text: '3000 nits Brightness' },
        { icon: BatteryCharging, text: 'Up to 10-Day Battery Life' },
        { icon: ShieldCheck, text: 'IP6X Water & Dustproof Rating' }
      ],
      primaryCta: 'Buy Watch 5 Pro',
      secondaryCta: 'Learn More',
      image: '/assets/hero-watch5-banner.jpg',
      targetCategory: 'wearables',
      featuredSku: 'P13-T800-ULTRA2-SLV'
    },
    {
      id: 'zypher-x1',
      theme: 'light',
      headline: 'Zypher X1',
      subtitle: 'Leading the Way in Aerial Photography and Performance',
      features: [
        { icon: Camera, text: '4K HDR Camera' },
        { icon: Clock, text: 'Extended Flight Time' },
        { icon: Navigation, text: 'Advanced Navigation' }
      ],
      primaryCta: 'Buy Zypher X1',
      secondaryCta: 'Watch Video',
      image: '/assets/hero-zypher-drone.jpg',
      targetCategory: 'drones',
      watermarkText: 'Zypher X1'
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
    if (slide.id === 'watch-5-pro') {
      const targetProd = products.find(p => p.sku === slide.featuredSku || p.category === 'wearables');
      if (targetProd && onOpenDetail) {
        onOpenDetail(targetProd);
        return;
      }
      if (onSelectCategory) onSelectCategory('wearables');
      if (onShopClick) onShopClick();
    } else {
      if (onSelectCategory) onSelectCategory(slide.targetCategory);
      if (onShopClick) onShopClick();
    }
  };

  const handleSecondaryClick = () => {
    if (slide.id === 'watch-5-pro') {
      const targetProd = products.find(p => p.sku === slide.featuredSku || p.category === 'wearables');
      if (targetProd && onOpenDetail) {
        onOpenDetail(targetProd);
        return;
      }
    }
    if (onSelectCategory) onSelectCategory(slide.targetCategory);
    if (onShopClick) onShopClick();
  };

  return (
    <section 
      className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero Spotlight Banner"
    >
      <div 
        className={`relative w-full rounded-[22px] sm:rounded-[26px] overflow-hidden transition-all duration-500 shadow-sm ${
          slide.theme === 'dark' 
            ? 'bg-[#0b1329] text-white min-h-[440px] sm:min-h-[480px] lg:min-h-[500px]' 
            : 'bg-[#f4f6fa] text-slate-900 min-h-[440px] sm:min-h-[480px] lg:min-h-[500px]'
        }`}
      >
        {/* Background Visual Elements */}
        {slide.theme === 'dark' ? (
          <>
            {/* Background Image for Watch 5 Pro */}
            <div className="absolute inset-0 z-0">
              <img 
                src={slide.image} 
                alt="Watch 5 Pro Banner"
                className="w-full h-full object-cover object-center opacity-85"
              />
              {/* Radial & Linear gradient overlays for legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b1329]/95 via-[#0b1329]/75 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1329] via-transparent to-transparent opacity-80" />
            </div>
          </>
        ) : (
          <>
            {/* Background Studio Visual for Zypher X1 */}
            <div className="absolute inset-0 z-0 flex items-center justify-end overflow-hidden">
              {/* Subtle watermark text in background (Screenshot 2) */}
              <div className="absolute left-10 bottom-6 text-[110px] lg:text-[150px] font-black text-slate-200/50 select-none pointer-events-none tracking-tighter">
                {slide.watermarkText}
              </div>
              <div className="w-full lg:w-[62%] h-full flex items-center justify-end relative pr-4 lg:pr-12">
                <img 
                  src={slide.image} 
                  alt="Zypher X1 Pro Drone"
                  className="max-h-[380px] sm:max-h-[440px] w-auto object-contain z-10 drop-shadow-2xl"
                />
              </div>
            </div>
          </>
        )}

        {/* Hero Foreground Content Overlay */}
        <div className="relative z-10 max-w-2xl px-6 sm:px-12 lg:px-16 py-12 sm:py-16 flex flex-col justify-center min-h-[440px] sm:min-h-[480px] lg:min-h-[500px]">
          
          {/* Main Headline */}
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3 leading-[1.08] ${
            slide.theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {slide.headline}
          </h1>

          {/* Supporting Subtitle */}
          <p className={`text-sm sm:text-base lg:text-lg font-normal mb-6 max-w-xl leading-relaxed ${
            slide.theme === 'dark' ? 'text-slate-200' : 'text-slate-600'
          }`}>
            {slide.subtitle}
          </p>

          {/* Feature Specs Pills Row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-8">
            {slide.features.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div 
                  key={idx}
                  className={`flex items-center gap-1.5 text-xs sm:text-[13px] font-medium px-3 py-1.5 rounded-full backdrop-blur-md ${
                    slide.theme === 'dark' 
                      ? 'bg-white/10 text-white border border-white/15' 
                      : 'bg-white/80 text-slate-800 border border-slate-200/80 shadow-2xs'
                  }`}
                >
                  <IconComp size={14} className={slide.theme === 'dark' ? 'text-blue-400' : 'text-[#0066FF]'} />
                  <span>{feat.text}</span>
                </div>
              );
            })}
          </div>

          {/* CTA Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Primary Solid Blue CTA */}
            <button
              type="button"
              onClick={handlePrimaryClick}
              className="px-6 sm:px-8 py-3 rounded-xl bg-[#0066FF] hover:bg-blue-600 active:bg-blue-700 text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5"
            >
              {slide.primaryCta}
            </button>

            {/* Secondary Outlined CTA */}
            <button
              type="button"
              onClick={handleSecondaryClick}
              className={`px-6 sm:px-7 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer border ${
                slide.theme === 'dark'
                  ? 'border-white/40 hover:border-white text-white hover:bg-white/10'
                  : 'border-slate-300 hover:border-slate-800 text-slate-800 hover:bg-slate-100'
              }`}
            >
              {slide.secondaryCta}
            </button>
          </div>
        </div>

        {/* Slide Carousel Navigation Controls */}
        <div className="absolute bottom-5 right-6 sm:right-10 z-20 flex items-center gap-2">
          {/* Previous Slide Button */}
          <button
            type="button"
            onClick={() => setActiveSlide(prev => (prev === 0 ? SLIDES.length - 1 : prev - 1))}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              slide.theme === 'dark'
                ? 'bg-white/20 hover:bg-white/30 text-white'
                : 'bg-white hover:bg-slate-100 text-slate-700 shadow-sm border border-slate-200'
            }`}
            aria-label="Previous Slide"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-1.5 px-2">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlide(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  idx === activeSlide
                    ? 'w-6 h-2 bg-[#0066FF]'
                    : slide.theme === 'dark' ? 'w-2 h-2 bg-white/40' : 'w-2 h-2 bg-slate-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next Slide Button */}
          <button
            type="button"
            onClick={() => setActiveSlide(prev => (prev + 1) % SLIDES.length)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              slide.theme === 'dark'
                ? 'bg-white/20 hover:bg-white/30 text-white'
                : 'bg-white hover:bg-slate-100 text-slate-700 shadow-sm border border-slate-200'
            }`}
            aria-label="Next Slide"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
