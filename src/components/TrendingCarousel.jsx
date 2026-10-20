import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Flame } from 'lucide-react';
import ProductCard from './ProductCard';

export default function TrendingCarousel({
  products = [],
  currencySymbol = "৳",
  onQuickAdd,
  onOpenDetail,
  wishlistIds = [],
  onToggleWishlist,
  onToggleCompare,
  comparisonIds = [],
  onViewAll,
  t = {},
  lang = 'en'
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Curate trending products from authoritative catalog (popular, high-demand real hardware)
  const trendingProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    // Prioritize customer favorites and top-rated accessories
    const trendingSkus = [
      'h2-anc-pro-tws',
      'y80-ultra-smartwatch',
      'p04-ultrapods-pro-tws',
      'recrsi-4in1-65w-cable',
      'p13-t800-ultra2-smartwatch',
      'remax-rc155a-120w-cable',
      'p12-laxasfit-k10-ultra',
      'oraimo-or08-wireless-headset',
      'sm-neckband-007',
      'p06-samsung-pro-tws',
      'turbo-single-wall-charger',
      'fighter-superbass-headset'
    ];

    const curated = trendingSkus
      .map(id => products.find(p => p.id === id))
      .filter(Boolean);

    // If fewer than 8, supplement with unique in-stock products
    const seen = new Set(curated.map(p => p.id));
    const extra = products.filter(p => !seen.has(p.id) && p.stock > 0);

    return [...curated, ...extra].slice(0, 12);
  }, [products]);

  // Update scroll button states
  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, trendingProducts]);

  const handleScroll = (direction) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (trendingProducts.length === 0) return null;

  return (
    <section 
      aria-label="Trending Products Carousel"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
    >
      {/* Carousel Section Header */}
      <div className="flex items-end justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAF4FF] text-[#3686F5] border border-blue-200 text-[11px] font-mono font-bold mb-1.5 shadow-2xs">
            <Flame size={13} className="text-[#3686F5] fill-[#3686F5]" />
            <span>{lang === 'bn' ? 'জনপ্রিয় গ্যাজেট' : 'TRENDING NOW'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#15243A] tracking-tight">
            {lang === 'bn' ? 'জনপ্রিয় টেক ও এক্সেসরিজ' : 'Trending Products & Popular Gear'}
          </h2>
          <p className="text-xs sm:text-sm text-[#526981] mt-0.5 max-w-xl">
            {lang === 'bn' 
              ? 'গ্রাহকদের পছন্দের তালিকার শীর্ষে থাকা সেরা স্মার্ট গ্যাজেট — ১০০% আসল ও ওয়ারেন্টিযুক্ত।'
              : 'Handpicked customer favorites and top-rated electronics with verified specs.'}
          </p>
        </div>

        {/* Header Right: View All Link & Arrow Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="text-xs sm:text-sm font-semibold text-[#3686F5] hover:text-[#1668E3] transition-colors flex items-center gap-1 cursor-pointer hover:underline"
            >
              <span>{lang === 'bn' ? 'সবগুলো দেখুন' : 'View All'}</span>
              <ArrowRight size={14} />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous products"
              className={`w-9 h-9 rounded-xl border border-[#DCE8F3] flex items-center justify-center transition-all cursor-pointer ${
                canScrollLeft
                  ? 'bg-white hover:bg-[#3686F5] hover:text-white text-[#15243A] shadow-xs hover:border-[#3686F5]'
                  : 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed opacity-60'
              }`}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label="Next products"
              className={`w-9 h-9 rounded-xl border border-[#DCE8F3] flex items-center justify-center transition-all cursor-pointer ${
                canScrollRight
                  ? 'bg-white hover:bg-[#3686F5] hover:text-white text-[#15243A] shadow-xs hover:border-[#3686F5]'
                  : 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed opacity-60'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-0.5"
        role="region"
        aria-label="Horizontal product list"
      >
        {trendingProducts.map((product) => (
          <div 
            key={`trending-${product.id}`}
            className="w-[72%] sm:w-[48%] md:w-[31%] lg:w-[calc(25%-12px)] shrink-0 snap-start flex flex-col justify-between"
          >
            <ProductCard
              product={product}
              currencySymbol={currencySymbol}
              onQuickAdd={onQuickAdd}
              onOpenDetail={onOpenDetail}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onToggleCompare={onToggleCompare}
              isCompared={comparisonIds.includes(product.id)}
              t={t}
              lang={lang}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
