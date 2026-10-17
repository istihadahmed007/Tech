import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { Sparkles, ArrowDown } from 'lucide-react';

export default function DailyDiscover({
  products = [],
  currencySymbol = "৳",
  onQuickAdd,
  onOpenDetail,
  wishlistIds = [],
  onToggleWishlist,
  selectedPhone,
  t = {},
  lang = 'en'
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [visibleCount, setVisibleCount] = useState(12);

  const TABS = [
    { id: 'all', label: lang === 'bn' ? 'সব প্রস্তাবিত' : 'Daily Discover' },
    { id: 'top_rated', label: lang === 'bn' ? 'টপ রেটেড' : 'Top Rated' },
    { id: 'under_500', label: lang === 'bn' ? '৳৫০০ এর নিচে' : 'Under ৳500' },
    { id: 'under_1000', label: lang === 'bn' ? '৳১,০০০ এর নিচে' : 'Under ৳1,000' },
    { id: 'audio', label: lang === 'bn' ? 'ইয়ারবাডস ও হেডফোন' : 'Audio Gear' },
    { id: 'charging', label: lang === 'bn' ? 'চার্জার ও ক্যাবল' : 'Fast Charging' }
  ];

  const filteredItems = useMemo(() => {
    let list = [...products];

    if (activeTab === 'top_rated') {
      list = list.filter(p => p.rating && p.rating >= 4.7).sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (activeTab === 'under_500') {
      list = list.filter(p => p.price <= 500);
    } else if (activeTab === 'under_1000') {
      list = list.filter(p => p.price <= 1000);
    } else if (activeTab === 'audio') {
      list = list.filter(p => p.category === 'audio');
    } else if (activeTab === 'charging') {
      list = list.filter(p => p.category === 'charging');
    }

    return list;
  }, [products, activeTab]);

  const displayedItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  return (
    <section className="w-full my-8 sm:my-10">
      {/* Sticky-Style Header with Shopee Tabs */}
      <div className="bg-white rounded-t-xl border border-[#DCEAF1] border-b-0 shadow-2xs overflow-x-auto scrollbar-none">
        <div className="flex items-center px-4 pt-3 border-b border-[#DCEAF1]/60">
          <div className="flex items-center gap-2 pr-6 pb-3 text-[#168FC2] font-extrabold text-lg uppercase tracking-tight shrink-0">
            <Sparkles size={20} />
            <span>{lang === 'bn' ? 'আপনার জন্য নির্বাচিত' : 'DAILY DISCOVER'}</span>
          </div>
        </div>

        <div className="flex items-center px-4 overflow-x-auto scrollbar-none">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setVisibleCount(12);
                }}
                className={`daily-discover-tab text-xs sm:text-sm font-bold ${isActive ? 'is-active' : ''}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Product Cards */}
      <div className="bg-white p-4 sm:p-5 border border-[#DCEAF1] rounded-b-xl shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {displayedItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currencySymbol={currencySymbol}
              onQuickAdd={onQuickAdd}
              onOpenDetail={onOpenDetail}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              selectedPhone={selectedPhone}
              t={t}
              lang={lang}
            />
          ))}
        </div>

        {/* See More Button */}
        {hasMore && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount(prev => prev + 12)}
              className="px-8 py-3 rounded-md bg-white border border-[#DCEAF1] hover:border-[#168FC2] text-[#102A43] hover:text-[#168FC2] font-bold text-xs sm:text-sm transition-all shadow-2xs inline-flex items-center gap-2 cursor-pointer"
            >
              <span>{lang === 'bn' ? 'আরও পণ্য দেখুন' : 'See More Products'}</span>
              <ArrowDown size={15} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
