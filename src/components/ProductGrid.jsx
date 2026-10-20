import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './ProductCard';
import { SearchX, ArrowUpDown, Filter, Sparkles, Check, Zap } from 'lucide-react';

export default function ProductGrid({ 
  products, 
  currencySymbol = "৳",
  selectedCategory, 
  onSelectCategory,
  selectedPhone,
  onClearPhoneFilter,
  searchQuery,
  onClearSearch,
  onQuickAdd,
  onOpenDetail,
  wishlistIds = [],
  onToggleWishlist,
  onToggleCompare,
  comparisonIds = [],
  t = {},
  lang = 'en'
}) {
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'top_rated', 'under_500', 'under_1000', 'audio', 'charging'

  // Unified Catalog Filter Tabs
  const QUICK_FILTERS = [
    { id: 'all', label: lang === 'bn' ? 'সব গিয়ার' : 'All Gear' },
    { id: 'top_rated', label: lang === 'bn' ? 'টপ রেটেড' : 'Top Rated' },
    { id: 'under_500', label: lang === 'bn' ? '৫০০৳ এর নিচে' : 'Under ৳500' },
    { id: 'under_1000', label: lang === 'bn' ? '১,০০০৳ এর নিচে' : 'Under ৳1,000' },
    { id: 'audio', label: lang === 'bn' ? 'অডিও গিয়ার' : 'Audio Gear' },
    { id: 'charging', label: lang === 'bn' ? 'ফাস্ট চার্জিং' : 'Fast Charging' },
  ];

  // Align active tab if category is changed externally
  useEffect(() => {
    if (selectedCategory === 'audio') {
      setActiveTab('audio');
    } else if (selectedCategory === 'charging') {
      setActiveTab('charging');
    } else if (!selectedCategory && (activeTab === 'audio' || activeTab === 'charging')) {
      setActiveTab('all');
    }
  }, [selectedCategory]);

  const handleTabClick = (filterId) => {
    setActiveTab(filterId);
    if (filterId === 'audio') {
      onSelectCategory('audio');
    } else if (filterId === 'charging') {
      onSelectCategory('charging');
    } else if (filterId === 'all') {
      onSelectCategory(null);
    }
  };

  // Comprehensive filter and search matching
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Tab filter
      if (activeTab === 'top_rated') {
        if (!item.rating || item.rating < 4.7) return false;
      } else if (activeTab === 'under_500') {
        if (item.price > 500) return false;
      } else if (activeTab === 'under_1000') {
        if (item.price > 1000) return false;
      } else if (activeTab === 'audio') {
        if (item.category !== 'audio') return false;
      } else if (activeTab === 'charging') {
        if (item.category !== 'charging') return false;
      }

      // External Category filter (e.g. from nav/hero shortcuts)
      if (selectedCategory && activeTab !== 'audio' && activeTab !== 'charging') {
        if (selectedCategory === 'earbuds') {
          if (item.category !== 'audio' || item.id.includes('headphone') || item.id.includes('neckband') || item.id.includes('headset')) return false;
        } else if (selectedCategory === 'headphones') {
          if (!item.id.includes('headphone') && !item.id.includes('neckband') && !item.id.includes('headset')) return false;
        } else if (selectedCategory === 'cables') {
          if (!item.id.includes('cable')) return false;
        } else if (selectedCategory === 'chargers') {
          if (!item.id.includes('charger') && !item.id.includes('adapter')) return false;
        } else if (selectedCategory === 'wearables') {
          if (item.category !== 'wearables') return false;
        } else if (selectedCategory === 'audio') {
          if (item.category !== 'audio') return false;
        } else if (selectedCategory === 'charging') {
          if (item.category !== 'charging') return false;
        } else if (item.category !== selectedCategory) {
          return false;
        }
      }

      // Phone compatibility filter
      if (selectedPhone && !item.compatibleWith?.includes(selectedPhone)) {
        return false;
      }

      // Search filter across title, Bengali title, category, description, and compatible models
      if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = item.title?.toLowerCase().includes(query) || (item.titleBn && item.titleBn.toLowerCase().includes(query));
        const matchCategory = item.category?.toLowerCase().includes(query);
        const matchDesc = item.description?.toLowerCase().includes(query) || (item.descriptionBn && item.descriptionBn.toLowerCase().includes(query));
        const matchRef = item.photoRef && item.photoRef.toLowerCase().includes(query);
        const matchCompatibility = item.compatibleWith?.some(c => c.toLowerCase().includes(query));
        if (!matchTitle && !matchCategory && !matchDesc && !matchRef && !matchCompatibility) {
          return false;
        }
      }

      // In-stock filter
      if (inStockOnly && item.stock <= 0) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'newest') return (b.id > a.id ? 1 : -1);
      if (activeTab === 'top_rated') return (b.rating || 0) - (a.rating || 0);
      return 0; // featured default order
    });
  }, [products, selectedCategory, activeTab, selectedPhone, searchQuery, inStockOnly, sortBy]);

  return (
    <section id="products-section" className="w-full my-6 sm:my-10" aria-label="Unified Master Catalog">
      {/* Telemetry Header & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="agent-pulse-dot" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
              UNIFIED MASTER CATALOG
            </span>
            <span className="font-mono text-[10px] text-slate-400 px-2 py-0.5 rounded bg-[#161924] border border-[#1E2230]">
              {filteredProducts.length} VERIFIED ITEMS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {lang === 'bn' ? 'যাচাইকৃত মোবাইল এক্সেসরিজ কালেকশন' : 'Engineered Hardware & Daily Gear'}
          </h2>
        </div>

        {/* Telemetry Free Shipping Notice */}
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl w-fit">
          <Zap size={13} className="text-emerald-400" />
          <span>{lang === 'bn' ? '২,০০০৳+ অর্ডারে সারাদেশে ফ্রি ডেলিভারি' : '৳2,000+ Unlocks Free Nationwide Shipping'}</span>
        </div>
      </div>

      {/* Filter and Sorting Control Bar in Obsidian Glassmorphism */}
      <div className="bg-[#12141C] rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 border border-[#1E2230] shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Quick-Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none" role="tablist">
          {QUICK_FILTERS.map((f) => {
            const isActive = activeTab === f.id;

            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTabClick(f.id)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold border border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.35)]'
                    : 'bg-[#161924] text-slate-300 hover:text-white hover:bg-[#1E2230] border border-[#1E2230]'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Right Controls: In-Stock Toggle & Sort */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-[#1E2230]">
          {/* In-Stock Toggle */}
          <label className="flex items-center gap-2 font-mono text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 rounded bg-[#161924] border-[#1E2230] text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span>{lang === 'bn' ? 'স্টকে আছে' : 'In-Stock Only'}</span>
          </label>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-[#161924] border border-[#1E2230] rounded-xl px-2.5 py-1 text-xs">
            <ArrowUpDown size={13} className="text-cyan-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products"
              className="bg-transparent text-slate-200 font-mono text-xs focus:outline-none cursor-pointer border-none pr-1"
            >
              <option value="featured" className="bg-[#12141C] text-slate-200">
                {lang === 'bn' ? 'জনপ্রিয়তা' : 'Featured (Default)'}
              </option>
              <option value="rating" className="bg-[#12141C] text-slate-200">
                {lang === 'bn' ? 'সর্বোচ্চ রেটিং' : 'Top Rated'}
              </option>
              <option value="price-asc" className="bg-[#12141C] text-slate-200">
                {lang === 'bn' ? 'দাম: কম থেকে বেশি' : 'Price: Low → High'}
              </option>
              <option value="price-desc" className="bg-[#12141C] text-slate-200">
                {lang === 'bn' ? 'দাম: বেশি থেকে কম' : 'Price: High → Low'}
              </option>
              <option value="newest" className="bg-[#12141C] text-slate-200">
                {lang === 'bn' ? 'নতুন কালেকশন' : 'Newest Arrivals'}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(selectedPhone || searchQuery || (selectedCategory && activeTab !== 'audio' && activeTab !== 'charging') || activeTab !== 'all') && (
        <div className="flex items-center flex-wrap gap-2 mb-4 text-xs">
          <span className="font-mono text-slate-400 text-[11px] mr-1">ACTIVE FILTERS:</span>

          {activeTab !== 'all' && (
            <span className="flex items-center gap-1 bg-[#161924] text-cyan-400 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg font-mono text-[11px]">
              <span>TAB: {QUICK_FILTERS.find(f => f.id === activeTab)?.label.toUpperCase()}</span>
              <button 
                onClick={() => {
                  setActiveTab('all');
                  if (selectedCategory === 'audio' || selectedCategory === 'charging') {
                    onSelectCategory(null);
                  }
                }} 
                className="ml-1 text-cyan-400 hover:text-white font-bold cursor-pointer"
                aria-label="Clear tab filter"
              >
                ×
              </button>
            </span>
          )}

          {selectedPhone && (
            <span className="flex items-center gap-1 bg-[#161924] text-cyan-400 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg font-mono text-[11px]">
              <span>DEVICE: {selectedPhone}</span>
              <button 
                onClick={onClearPhoneFilter} 
                className="ml-1 text-cyan-400 hover:text-white font-bold cursor-pointer"
                aria-label={`Remove phone filter for ${selectedPhone}`}
              >
                ×
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="flex items-center gap-1 bg-[#161924] text-cyan-400 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg font-mono text-[11px]">
              <span>QUERY: "{searchQuery}"</span>
              <button 
                onClick={onClearSearch} 
                className="ml-1 text-cyan-400 hover:text-white font-bold cursor-pointer"
                aria-label="Clear search filter"
              >
                ×
              </button>
            </span>
          )}

          <button 
            onClick={() => {
              onClearPhoneFilter();
              onClearSearch();
              onSelectCategory(null);
              setActiveTab('all');
              setInStockOnly(false);
            }}
            className="font-mono text-xs text-cyan-400 hover:text-cyan-300 underline ml-2 cursor-pointer"
          >
            [CLEAR ALL]
          </button>
        </div>
      )}

      {/* Responsive Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currencySymbol={currencySymbol}
              selectedPhone={selectedPhone}
              onQuickAdd={onQuickAdd}
              onOpenDetail={onOpenDetail}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onToggleCompare={onToggleCompare}
              isCompared={comparisonIds.includes(product.id)}
              t={t}
              lang={lang}
            />
          ))}
        </div>
      ) : (
        /* Zero-State Handling */
        <div className="rounded-2xl p-10 sm:p-12 text-center bg-[#12141C] border border-[#1E2230] shadow-md max-w-lg mx-auto" role="status">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center mb-4 border border-cyan-500/20">
            <SearchX size={32} />
          </div>
          <h4 className="text-base sm:text-lg font-bold text-white mb-1">
            {t.noProductsFound || 'No matching accessories found'}
          </h4>
          <p className="text-xs sm:text-sm text-slate-400 mb-5 font-mono">
            {t.noProductsSub || 'Try clearing your filters or exploring different categories.'}
          </p>
          <button
            onClick={() => {
              onClearPhoneFilter();
              onClearSearch();
              onSelectCategory(null);
              setPriceTier('all');
              setInStockOnly(false);
            }}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs sm:text-sm shadow-md cursor-pointer transition-colors"
          >
            {t.resetFilters || 'RESET ALL FILTERS'}
          </button>
        </div>
      )}
    </section>
  );
}
