import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Zap, 
  Truck, 
  Tag, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

export default function Hero({ 
  onShopClick, 
  onSelectCategory,
  onSelectCatalogTab,
  onScrollToBundles,
  onSelectProduct,
  products = [],
  t = {}, 
  lang = 'en'
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Touch Swipe tracking
  const touchStartXRef = useRef(null);
  const touchEndXRef = useRef(null);

  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e) => setPrefersReducedMotion(e.matches);
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', listener);
        return () => mediaQuery.removeEventListener('change', listener);
      }
    } catch (e) {}
  }, []);

  // 4 Thematic Promotional Campaign Slides (Strictly using authentic catalog products & imagery)
  const slides = [
    {
      id: 'featured-accessories',
      campaignTag: lang === 'bn' ? 'নতুন কালেকশন ২০২৬' : 'NEW ARRIVALS 2026',
      tagIcon: Sparkles,
      headline: lang === 'bn' ? 'দৈনন্দিন লাইফস্টাইলের সেরা টেক এক্সেসরিজ' : 'Upgrade Your Everyday Tech',
      subtitle: lang === 'bn' 
        ? 'অরিজিনাল অডিও, মাল্টি-স্ট্র্যাপ স্মার্টওয়াচ ও ফাস্ট চার্জিং গ্যাজেট — নিখুঁত পারফরম্যান্স ও দীর্ঘ স্থায়িত্ব।' 
        : 'Discover precision ANC audio, multi-strap smartwatches, and fast charging built for modern life.',
      offerBadge: lang === 'bn' 
        ? '৳২,০০০+ অর্ডারে সারাদেশে ফ্রি হোম ডেলিভারি' 
        : 'Free Nationwide Delivery on orders ৳2,000+',
      offerIcon: Truck,
      primaryCta: lang === 'bn' ? 'সব গ্যাজেট দেখুন' : 'Shop All Gear',
      secondaryCta: lang === 'bn' ? 'অডিও ইয়ারবাডস →' : 'Explore Audio →',
      onPrimaryClick: () => onShopClick && onShopClick(),
      onSecondaryClick: () => onSelectCategory && onSelectCategory('audio'),
      bgGradient: 'from-[#F0F7FF] via-[#E6F2FE] to-[#F5F9FF]',
      primaryProduct: {
        id: 'y80-ultra-smartwatch',
        title: 'Y80 Ultra Smartwatch',
        badge: '8+1 Strap Set',
        price: '৳1,650',
        image: '/assets/products/p11-y80-ultra-smartwatch.jpg'
      },
      supportingLeft: {
        id: 'h2-anc-pro-tws',
        title: 'Pro ANC Wireless Earbuds',
        badge: '1:1 Tested',
        price: '৳1,190',
        image: '/assets/products/h2-anc-pro-tws.jpg'
      },
      supportingRight: {
        id: 'p04-ultrapods-pro-tws',
        title: 'Ultrapods Pro Crystal',
        badge: 'Trending',
        price: '৳350',
        image: '/assets/products/p04-ultrapods-pro-all.jpg'
      }
    },
    {
      id: 'power-charging',
      campaignTag: lang === 'bn' ? 'টার্বো পাওয়ার ও চার্জার' : 'POWER & CHARGING',
      tagIcon: Zap,
      headline: lang === 'bn' ? 'হাই-স্পিড টার্বো পাওয়ার • কোনো অপেক্ষাহীন' : 'High-Speed Power. Zero Waiting.',
      subtitle: lang === 'bn' 
        ? '১২০W ফাস্ট ক্যাবল ও ৬৫W ৪-ইন-১ মাল্টি-ডিভাইস চার্জার — সর্বোচ্চ গতি, টেকসই বিল্ড ও নিরাপত্তা।' 
        : 'QC & PD certified charging lines, 65W/120W multi-voltage cables, and compact wall chargers.',
      offerBadge: lang === 'bn' 
        ? 'মাত্র ১৫০৳ থেকে শুরু • ১০০% পরীক্ষিত কোয়ালিটি' 
        : 'Starting from ৳150 • 100% Quality Inspected',
      offerIcon: Zap,
      primaryCta: lang === 'bn' ? 'চার্জার ও ক্যাবল দেখুন' : 'Shop Power Gear',
      secondaryCta: lang === 'bn' ? '৪-ইন-১ ক্যাবল →' : 'View Cables →',
      onPrimaryClick: () => onSelectCategory && onSelectCategory('charging'),
      onSecondaryClick: () => onSelectCategory && onSelectCategory('charging'),
      bgGradient: 'from-[#EDF6FF] via-[#E2F0FE] to-[#F4F9FF]',
      primaryProduct: {
        id: 'recrsi-4in1-65w-cable',
        title: 'RECRSI 4-in-1 Fast Cable',
        badge: '65W Multi-Port',
        price: '৳490',
        image: '/assets/products/p20-recrsi-4in1-cable.jpg'
      },
      supportingLeft: {
        id: 'remax-rc155a-120w-cable',
        title: 'REMAX 120W Cable',
        badge: '120W Max',
        price: '৳150',
        image: '/assets/products/p02-remax-rc155a-cable.jpg'
      },
      supportingRight: {
        id: 'turbo-single-wall-charger',
        title: '27W Wall Charger',
        badge: '2-Pin QC',
        price: '৳390',
        image: '/assets/products/p07-oppo-style-27w-charger.jpg'
      }
    },
    {
      id: 'trending-wearables',
      campaignTag: lang === 'bn' ? 'স্মার্ট ওয়াচ কালেকশন' : 'TRENDING WEARABLES',
      tagIcon: Clock,
      headline: lang === 'bn' ? 'আধুনিক স্মার্টওয়াচ ও সরাসরি সিম কলিং' : 'Next-Gen Smartwatches & Calling',
      subtitle: lang === 'bn' 
        ? 'উজ্জ্বল এইচডি ডিসপ্লে, ওয়্যারলেস চার্জিং, হেলথ ট্র্যাকিং এবং স্ট্যান্ডঅ্যালোন ২জি সিম স্লট সুবিধা।' 
        : 'Brilliant HD touchscreens, wireless magnetic charging, sports tracking, and standalone SIM calling.',
      offerBadge: lang === 'bn' 
        ? 'প্রতিটি ঘড়ির সাথে বোনাস মাল্টি-কালার স্ট্র্যাপ অন্তর্ভুক্ত' 
        : 'Multi-Strap Sets & Wireless Dock Included',
      offerIcon: ShieldCheck,
      primaryCta: lang === 'bn' ? 'স্মার্টওয়াচ দেখুন' : 'Shop Smartwatches',
      secondaryCta: lang === 'bn' ? 'সিম ওয়াচ এক্সপ্লোর →' : 'Explore SIM Watches →',
      onPrimaryClick: () => onSelectCategory && onSelectCategory('wearables'),
      onSecondaryClick: () => onSelectCategory && onSelectCategory('wearables'),
      bgGradient: 'from-[#F3F8FF] via-[#E8F3FE] to-[#F5FAFF]',
      primaryProduct: {
        id: 'p12-laxasfit-k10-ultra',
        title: 'LAXASFIT K10 Ultra SIM',
        badge: '2G SIM Slot',
        price: '৳2,450',
        image: '/assets/products/p12-laxasfit-k10-ultra-sim-watch.jpg'
      },
      supportingLeft: {
        id: 'p13-t800-ultra2-smartwatch',
        title: 'T800 Ultra 2 Smartwatch',
        badge: 'Wireless Qi',
        price: '৳1,190',
        image: '/assets/products/p13-t800-ultra2-smartwatch.jpg'
      },
      supportingRight: {
        id: 'pink-glam-smartwatch',
        title: 'KW68 Mini Smartwatch',
        badge: '3+1 Strap Set',
        price: '৳1,450',
        image: '/assets/products/p10-kw68-mini-smartwatch.jpg'
      }
    },
    {
      id: 'special-offers',
      campaignTag: lang === 'bn' ? 'স্পেশাল ডিসকাউন্ট ডিল' : 'ACTIVE SALE • SAVE UP TO ৳400',
      tagIcon: Tag,
      headline: lang === 'bn' ? 'স্পেশাল অফার ও ভ্যালু বান্ডিল প্যাক' : 'Exclusive Deals & Value Bundles',
      subtitle: lang === 'bn' 
        ? 'আসল ও ওয়ারেন্টিযুক্ত গ্যাজেটে সর্বোচ্চ ছাড়। সাথে থাকছে ৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি।' 
        : 'Genuine markdowns on top-rated hardware. Verified authentic with 7-day replacement warranty.',
      offerBadge: lang === 'bn' 
        ? '৳৪০০ পর্যন্ত সাশ্রয় • ২,০০০৳ অর্ডারে ডেলিভারি ফ্রি' 
        : 'Save up to ৳400 + Automatic Free Nationwide Delivery @ ৳2,000+',
      offerIcon: Sparkles,
      primaryCta: lang === 'bn' ? 'অফার ডিল দেখুন' : 'Explore Sale Deals',
      secondaryCta: lang === 'bn' ? 'ফ্রি ডেলিভারি বান্ডিল →' : 'View Delivery Bundles →',
      onPrimaryClick: () => onSelectCatalogTab ? onSelectCatalogTab('sale') : onShopClick && onShopClick(),
      onSecondaryClick: () => onScrollToBundles ? onScrollToBundles() : onShopClick && onShopClick(),
      bgGradient: 'from-[#F0F6FF] via-[#E4F0FE] to-[#F2F8FF]',
      primaryProduct: {
        id: 'h2-anc-pro-tws',
        title: 'H2 Pro ANC Wireless Earbuds',
        badge: 'SAVE ৳360',
        price: '৳1,190',
        originalPrice: '৳1,550',
        image: '/assets/products/h2-anc-pro-tws.jpg'
      },
      supportingLeft: {
        id: 'remax-rc155a-duo-bundle',
        title: 'REMAX 2-Pack Value Duo',
        badge: 'SAVE ৳160',
        price: '৳280',
        originalPrice: '৳440',
        image: '/assets/products/p02-remax-rc155a-cable.jpg'
      },
      supportingRight: {
        id: 'fighter-superbass-headset',
        title: 'TUCCI A5 Stereo Headset',
        badge: 'SAVE ৳400',
        price: '৳1,450',
        originalPrice: '৳1,850',
        image: '/assets/products/p09-tucci-a5-fighter-headset.jpg'
      }
    }
  ];

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay timer (5 seconds), pauses on hover, focus, or when user prefers reduced motion
  useEffect(() => {
    if (prefersReducedMotion || isHovered || isFocused) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, prefersReducedMotion, isHovered, isFocused]);

  // Touch Swipe Handlers
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const deltaX = touchStartXRef.current - touchEndXRef.current;
    const swipeThreshold = 45;
    if (deltaX > swipeThreshold) {
      nextSlide();
    } else if (deltaX < -swipeThreshold) {
      prevSlide();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const active = slides[currentSlide];
  const TagIcon = active.tagIcon;
  const OfferIcon = active.offerIcon;

  return (
    <section 
      id="hero-slider"
      aria-label="Promotional Campaign Showcase"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className={`relative w-full rounded-2xl sm:rounded-3xl border border-[#DCE8F3] bg-gradient-to-r ${active.bgGradient} shadow-sm overflow-hidden min-h-[420px] lg:min-h-[440px] flex flex-col justify-center transition-colors duration-500`}
      >
        {/* Subtle Geometric Background Watermark */}
        <div 
          className="absolute -right-16 -top-16 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-40 bg-[#3686F5]/10" 
        />
        <div 
          className="absolute -left-16 -bottom-16 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-40 bg-[#1684E8]/10" 
        />

        {/* Two-Column Responsive Layout */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-6 p-6 sm:p-8 lg:p-12">
          
          {/* Left Column: Authentic Product Composition (~45% on desktop) */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] sm:aspect-[16/11] flex items-center justify-center select-none">
              
              {/* Supporting Product Left */}
              {active.supportingLeft && (
                <div 
                  onClick={() => onSelectProduct && onSelectProduct(active.supportingLeft)}
                  className="absolute left-0 bottom-2 sm:bottom-4 w-28 sm:w-36 aspect-square rounded-2xl bg-white/95 border border-[#DCE8F3] shadow-sm p-2 flex flex-col items-center justify-between cursor-pointer hover:scale-105 transition-transform duration-300 z-10 group"
                  title={active.supportingLeft.title}
                >
                  <span className="text-[9px] font-mono font-bold text-[#3686F5] bg-[#EAF4FF] px-2 py-0.5 rounded-md uppercase tracking-wider self-start">
                    {active.supportingLeft.badge}
                  </span>
                  <img 
                    src={active.supportingLeft.image} 
                    alt={active.supportingLeft.title} 
                    className="w-14 sm:w-18 h-14 sm:h-18 object-contain my-auto"
                    loading="lazy"
                  />
                  <div className="w-full flex items-center justify-between font-mono text-[10px] text-[#15243A] font-bold">
                    <span className="truncate max-w-[65px]">{active.supportingLeft.title.split(' ')[0]}</span>
                    <span className="text-[#3686F5]">{active.supportingLeft.price}</span>
                  </div>
                </div>
              )}

              {/* Main Centerpiece Product Pedestal */}
              <div 
                onClick={() => onSelectProduct && onSelectProduct(active.primaryProduct)}
                className="w-48 sm:w-56 lg:w-60 aspect-square rounded-3xl bg-white border border-[#DCE8F3] shadow-md p-4 sm:p-5 flex flex-col items-center justify-between cursor-pointer hover:scale-[1.03] transition-transform duration-300 z-20 group relative"
              >
                <div className="w-full flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-white bg-[#3686F5] px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
                    {active.primaryProduct.badge}
                  </span>
                  {active.primaryProduct.originalPrice && (
                    <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                      SALE
                    </span>
                  )}
                </div>

                <div className="relative w-full h-28 sm:h-36 flex items-center justify-center my-auto">
                  <img 
                    src={active.primaryProduct.image} 
                    alt={active.primaryProduct.title} 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="eager"
                  />
                </div>

                <div className="w-full text-center">
                  <p className="text-xs sm:text-sm font-bold text-[#15243A] truncate w-full group-hover:text-[#3686F5] transition-colors">
                    {active.primaryProduct.title}
                  </p>
                  <div className="flex items-center justify-center gap-1.5 font-mono mt-0.5">
                    <span className="text-xs sm:text-sm font-black text-[#3686F5]">
                      {active.primaryProduct.price}
                    </span>
                    {active.primaryProduct.originalPrice && (
                      <span className="text-[10px] text-slate-400 line-through">
                        {active.primaryProduct.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Supporting Product Right */}
              {active.supportingRight && (
                <div 
                  onClick={() => onSelectProduct && onSelectProduct(active.supportingRight)}
                  className="absolute right-0 bottom-2 sm:bottom-4 w-28 sm:w-36 aspect-square rounded-2xl bg-white/95 border border-[#DCE8F3] shadow-sm p-2 flex flex-col items-center justify-between cursor-pointer hover:scale-105 transition-transform duration-300 z-10 group"
                  title={active.supportingRight.title}
                >
                  <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-wider self-start">
                    {active.supportingRight.badge}
                  </span>
                  <img 
                    src={active.supportingRight.image} 
                    alt={active.supportingRight.title} 
                    className="w-14 sm:w-18 h-14 sm:h-18 object-contain my-auto"
                    loading="lazy"
                  />
                  <div className="w-full flex items-center justify-between font-mono text-[10px] text-[#15243A] font-bold">
                    <span className="truncate max-w-[65px]">{active.supportingRight.title.split(' ')[0]}</span>
                    <span className="text-[#3686F5]">{active.supportingRight.price}</span>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Commercial Headline, Offer & Action (~55% on desktop) */}
          <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col justify-center text-left lg:pl-6">
            
            {/* Small Campaign Tag Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#3686F5] border border-blue-200 text-xs font-mono font-bold mb-3 w-fit shadow-2xs">
              <TagIcon size={13} className="text-[#3686F5]" />
              <span>{active.campaignTag}</span>
            </div>

            {/* Bold Promotional Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#15243A] tracking-tight leading-[1.15] mb-3">
              {active.headline}
            </h1>

            {/* Short Supporting Sentence */}
            <p className="text-xs sm:text-base text-[#526981] font-normal leading-relaxed max-w-xl mb-4">
              {active.subtitle}
            </p>

            {/* Offer Information Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#DCE8F3] text-xs font-mono font-semibold text-[#15243A] w-fit mb-6 shadow-2xs">
              <OfferIcon size={15} className="text-[#3686F5]" />
              <span>{active.offerBadge}</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={active.onPrimaryClick}
                className="btn-soft-blue text-white text-xs sm:text-sm font-bold tracking-wider uppercase px-8 py-3.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-2 active:scale-95"
              >
                <span>{active.primaryCta}</span>
                <ArrowRight size={15} />
              </button>

              {active.secondaryCta && (
                <button
                  type="button"
                  onClick={active.onSecondaryClick}
                  className="text-xs sm:text-sm font-semibold text-[#3686F5] hover:text-[#1668E3] transition-colors flex items-center gap-1.5 cursor-pointer hover:underline"
                >
                  <span>{active.secondaryCta}</span>
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Previous / Next Arrow Controls */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous promotional slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 sm:w-11 h-9 sm:h-11 rounded-full bg-white/90 hover:bg-[#3686F5] text-[#15243A] hover:text-white border border-[#DCE8F3] shadow-sm flex items-center justify-center transition-all cursor-pointer z-30 opacity-80 hover:opacity-100"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next promotional slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 sm:w-11 h-9 sm:h-11 rounded-full bg-white/90 hover:bg-[#3686F5] text-[#15243A] hover:text-white border border-[#DCE8F3] shadow-sm flex items-center justify-center transition-all cursor-pointer z-30 opacity-80 hover:opacity-100"
        >
          <ChevronRight size={20} />
        </button>

        {/* Small Slide Indicators (Pills & Dots) */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}: ${s.campaignTag}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                currentSlide === idx 
                  ? 'w-7 sm:w-8 h-2 bg-[#3686F5] shadow-xs' 
                  : 'w-2 h-2 bg-[#DCE8F3] hover:bg-[#B5CDE4]'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
