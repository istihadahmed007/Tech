import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from './ProductCard';
import { SearchX, ArrowUpDown, Filter, Sparkles, Check, Zap, Layers } from 'lucide-react';

export default function ProductGrid({ 
  products = [], 
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
  catalogTab: externalTab,
  onSelectCatalogTab,
  onDisplayedIdsChange,
  t = {},
  lang = 'en'
}) {
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [internalTab, setInternalTab] = useState('all');
  const [showAllProducts, setShowAllProducts] = useState(false);

  const activeTab = externalTab !== undefined ? externalTab : internalTab;
  const setActiveTab = onSelectCatalogTab || setInternalTab;

  // Reference-aligned Filter Tabs
  const QUICK_FILTERS = [
    { id: 'all', label: lang === 'bn' ? 'সব পণ্য' : 'All Gear' },
    { id: 'audio', label: lang === 'bn' ? 'ইয়ারবাডস ও টিডব্লিউএস' : 'Audio & TWS' },
    { id: 'charging', label: lang === 'bn' ? 'চার্জার ও ক্যাবল' : 'Cables & Power' },
    { id: 'wearables', label: lang === 'bn' ? 'স্মার্টওয়াচ' : 'Smartwatches' },
    { id: 'sale', label: lang === 'bn' ? 'অফার ডিল' : 'Flash Sale' },
    { id: 'under_500', label: lang === 'bn' ? '৳৫০০ এর নিচে' : 'Under ৳500' },
  ];

  useEffect(() => {
    if (selectedCategory === 'audio' && activeTab !== 'under_500' && activeTab !== 'sale') {
      setActiveTab('audio');
    } else if (selectedCategory === 'charging' && activeTab !== 'under_500' && activeTab !== 'sale') {
      setActiveTab('charging');
    } else if (selectedCategory === 'wearables' && activeTab !== 'under_500' && activeTab !== 'sale') {
      setActiveTab('wearables');
    }
  }, [selectedCategory, activeTab]);

  const handleTabClick = (filterId) => {
    setActiveTab(filterId);
    if (filterId === 'audio') {
      onSelectCategory('audio');
    } else if (filterId === 'charging') {
      onSelectCategory('charging');
    } else if (filterId === 'wearables') {
      onSelectCategory('wearables');
    } else if (filterId === 'all') {
      onSelectCategory(null);
    }
  };

  // Comprehensive filter and search matching
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Tab filter
      if (activeTab === 'sale') {
        const isSale = (item.originalPrice && item.originalPrice > item.price) || item.sale || item.isSale;
        if (!isSale) return false;
      } else if (activeTab === 'under_500') {
        if (item.price > 500) return false;
      } else if (activeTab === 'audio') {
        if (item.category !== 'audio') return false;
      } else if (activeTab === 'charging') {
        if (item.category !== 'charging') return false;
      } else if (activeTab === 'wearables') {
        if (item.category !== 'wearables') return false;
      }

      // External Category filter
      if (selectedCategory && activeTab !== 'audio' && activeTab !== 'charging' && activeTab !== 'wearables' && activeTab !== 'under_500' && activeTab !== 'sale') {
        if (item.category !== selectedCategory) return false;
      }

      // Phone compatibility filter
      if (selectedPhone && !item.compatibleWith?.includes(selectedPhone)) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = item.title?.toLowerCase().includes(query) || (item.titleBn && item.titleBn.toLowerCase().includes(query));
        const matchCategory = item.category?.toLowerCase().includes(query);
        const matchBrand = item.brand && item.brand.toLowerCase().includes(query);
        const matchCompatibility = item.compatibleWith?.some(c => c.toLowerCase().includes(query));
        if (!matchTitle && !matchCategory && !matchBrand && !matchCompatibility) {
          return false;
        }
      }

      // In-stock filter
      if (inStockOnly && item.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  }, [products, activeTab, selectedCategory, selectedPhone, searchQuery, inStockOnly, sortBy]);

  // In accordance with the reference image: show 10 items (2 rows of 5) on the initial view, or all if toggled or filtered
  const isFilteringActive = Boolean(searchQuery || selectedPhone || (activeTab !== 'all' && activeTab !== 'sale'));
  const displayedProducts = (showAllProducts || isFilteringActive || filteredProducts.length <= 10)
    ? filteredProducts 
    : filteredProducts.slice(0, 10);

  useEffect(() => {
    if (onDisplayedIdsChange) {
      const ids = displayedProducts.map(p => p.id);
      onDisplayedIdsChange(ids);
    }
  }, [displayedProducts, onDisplayedIdsChange]);

  return (
    <section id="products-section" className="product-grid-overlap max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Top Header of Section: High-Contrast Heading and Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#10263D] tracking-tight flex items-center gap-2">
            <span>{lang === 'bn' ? 'ফিচার্ড গ্যাজেট' : 'Featured Tech Gear'}</span>
          </h2>
          <p className="text-xs text-[#47617D] font-medium hidden sm:block mt-0.5">
            {lang === 'bn' ? 'আসল ও ওয়ারেন্টিযুক্ত মোবাইল এক্সেসরিজ' : 'Genuine hardware, verified compatibility & express delivery'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Filter Tabs with Strong Contrast */}
          <div className="hidden md:flex items-center gap-1 bg-white/85 p-1 rounded-full backdrop-blur-md border border-blue-200/80 text-xs shadow-xs">
            {QUICK_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => handleTabClick(f.id)}
                className={`px-3 py-1 rounded-full font-semibold transition cursor-pointer ${
                  activeTab === f.id
                    ? 'bg-[#0084FF] text-white shadow-xs font-bold'
                    : 'text-[#10263D] hover:text-[#0084FF] hover:bg-blue-50/70'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono font-bold text-[#0077E6] bg-blue-50/90 border border-blue-200 px-3 py-1.5 rounded-full shadow-xs">
            {filteredProducts.length} Verified SKUs
          </span>
        </div>
      </div>

      {/* Active Filter Indicators Bar */}
      {(selectedCategory || selectedPhone || searchQuery || activeTab !== 'all') && (
        <div className="flex flex-wrap items-center gap-2 mb-4 bg-white/80 p-2.5 rounded-xl border border-blue-100 shadow-xs backdrop-blur-sm">
          <span className="text-xs font-semibold text-slate-500">Active Filters:</span>
          {activeTab !== 'all' && (
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-0.5 rounded-full border border-blue-200">
              Filter: {QUICK_FILTERS.find(f => f.id === activeTab)?.label || activeTab}
              <button 
                type="button" 
                onClick={() => handleTabClick('all')} 
                className="hover:text-blue-900 ml-1 font-bold"
              >×</button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-0.5 rounded-full border border-blue-200">
              Search: "{searchQuery}"
              <button 
                type="button" 
                onClick={onClearSearch} 
                className="hover:text-blue-900 ml-1 font-bold"
              >×</button>
            </span>
          )}
          <button 
            type="button"
            onClick={() => {
              if (onClearSearch) onClearSearch();
              if (onClearPhoneFilter) onClearPhoneFilter();
              handleTabClick('all');
            }}
            className="text-xs text-blue-600 hover:underline font-semibold ml-auto"
          >
            Clear All
          </button>
        </div>
      )}

      {/* 5-Column Grid (Matches 2 Rows of 5 in Reference Screenshot) */}
      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {displayedProducts.map((product) => (
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
        /* Zero State */
        <div className="rounded-2xl p-10 text-center bg-white border border-blue-100 shadow-md max-w-md mx-auto my-8">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-500 mx-auto flex items-center justify-center mb-3">
            <SearchX size={28} />
          </div>
          <h4 className="text-base font-bold text-slate-800 mb-1">No matching gear found</h4>
          <p className="text-xs text-slate-500 mb-4 font-medium">Try clearing your filters or search keywords.</p>
          <button
            type="button"
            onClick={() => {
              if (onClearSearch) onClearSearch();
              if (onClearPhoneFilter) onClearPhoneFilter();
              handleTabClick('all');
            }}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Centered Browse All Categories Link (Exact Match to Reference Screenshot) */}
      {filteredProducts.length > 10 && !isFilteringActive && (
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={() => setShowAllProducts(!showAllProducts)}
            className="text-xs sm:text-sm text-slate-500 hover:text-blue-600 font-bold tracking-wide transition cursor-pointer"
          >
            {showAllProducts ? 'show less products <' : 'browse all categories >'}
          </button>
        </div>
      )}
    </section>
  );
}
