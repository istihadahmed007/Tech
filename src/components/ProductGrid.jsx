import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { SlidersHorizontal, SearchX, CheckCircle, ArrowUpDown } from 'lucide-react';

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
  wishlistIds,
  onToggleWishlist,
  t,
  lang 
}) {
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filter and sort items
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category filter
      if (selectedCategory && item.category !== selectedCategory) {
        return false;
      }
      // Phone compatibility filter
      if (selectedPhone && !item.compatibleWith.includes(selectedPhone)) {
        return false;
      }
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(query) || (item.titleBn && item.titleBn.includes(query));
        const matchCategory = item.category.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchCompatibility = item.compatibleWith.some(c => c.toLowerCase().includes(query));
        if (!matchTitle && !matchCategory && !matchDesc && !matchCompatibility) {
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
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default order
    });
  }, [products, selectedCategory, selectedPhone, searchQuery, inStockOnly, sortBy]);

  const categories = [
    { id: null, label: t.allProducts },
    { id: 'cases', label: t.catCases },
    { id: 'audio', label: t.catAudio },
    { id: 'charging', label: t.catCharging },
    { id: 'powerbanks', label: t.catPowerBanks }
  ];

  return (
    <section id="products-section" className="w-full my-10">
      {/* Filter and Sorting Control Bar */}
      <div 
        className="rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
        style={{
          background: 'rgba(248, 252, 255, 0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(37, 99, 235, 0.12)',
          boxShadow: '0 4px 20px -2px rgba(17, 42, 67, 0.04)'
        }}
      >
        {/* Horizontal Category Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id || 'all'}
                onClick={() => onSelectCategory(cat.id)}
                className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' 
                    : 'bg-white/60 text-[#4B637B] hover:text-[#112A43] hover:bg-white border border-blue-200/50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Secondary Filters: In-stock toggle & Sort Dropdown */}
        <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-blue-100">
          {/* In-Stock Toggle */}
          <label className="flex items-center gap-2 text-xs font-semibold text-[#4B637B] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <span>In-Stock Only</span>
          </label>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown size={14} className="text-[#8FA6BE]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold py-1.5 px-3 rounded-lg bg-white/80 border border-blue-200/60 text-[#112A43] outline-none focus:border-blue-500"
            >
              <option value="featured">{t.sortFeatured}</option>
              <option value="price-asc">{t.sortPriceAsc}</option>
              <option value="price-desc">{t.sortPriceDesc}</option>
              <option value="rating">{t.sortRating}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Indicators */}
      {(selectedPhone || searchQuery || selectedCategory) && (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-[#4B637B]">
          <span>Active Filters:</span>
          {selectedPhone && (
            <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
              Fits: {selectedPhone}
              <button onClick={onClearPhoneFilter} className="ml-1 text-blue-600 hover:text-blue-900 font-bold">×</button>
            </span>
          )}
          {searchQuery && (
            <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
              Search: "{searchQuery}"
              <button onClick={onClearSearch} className="ml-1 text-blue-600 hover:text-blue-900 font-bold">×</button>
            </span>
          )}
          {selectedCategory && (
            <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
              Category: {selectedCategory}
              <button onClick={() => onSelectCategory(null)} className="ml-1 text-blue-600 hover:text-blue-900 font-bold">×</button>
            </span>
          )}
          <button 
            onClick={() => {
              onClearPhoneFilter();
              onClearSearch();
              onSelectCategory(null);
            }}
            className="text-blue-600 font-semibold underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* 2-Column (Mobile) to 4-Column (Desktop) Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
              t={t}
              lang={lang}
            />
          ))}
        </div>
      ) : (
        /* Honest Zero-State Handling */
        <div className="rounded-3xl p-12 text-center bg-white/70 backdrop-blur-md border border-blue-200/50 shadow-sm max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 mx-auto flex items-center justify-center mb-4">
            <SearchX size={32} />
          </div>
          <h4 className="text-lg font-bold text-[#112A43] mb-1">
            No matching accessories found
          </h4>
          <p className="text-sm text-[#4B637B] mb-5">
            {selectedPhone 
              ? `We currently don't have catalog items tailored specifically for "${selectedPhone}". Try clearing the device filter to see universal accessories.`
              : 'Try broadening your search query or switching categories.'}
          </p>
          <button
            onClick={() => {
              onClearPhoneFilter();
              onClearSearch();
              onSelectCategory(null);
              setInStockOnly(false);
            }}
            className="btn-primary"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Development Seed Badge Notice */}
      <div className="mt-8 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-blue-50 border border-blue-200/50 text-[#4B637B]">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          {t.devSeedNotice}
        </span>
      </div>
    </section>
  );
}
