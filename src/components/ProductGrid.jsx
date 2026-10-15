import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { SearchX, ArrowUpDown } from 'lucide-react';

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

  const categories = useMemo(() => [
    { id: null, label: t.allProducts },
    { id: 'audio', label: t.catAudio },
    { id: 'charging', label: t.catCharging },
    { id: 'wearables', label: t.catWearables || 'Smartwatches' }
  ], [t]);

  // Comprehensive filter and search matching
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category filter
      if (selectedCategory && item.category !== selectedCategory) {
        return false;
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
      return 0; // featured default order
    });
  }, [products, selectedCategory, selectedPhone, searchQuery, inStockOnly, sortBy]);

  const activeCategoryLabel = useMemo(() => {
    return categories.find(c => c.id === selectedCategory)?.label || selectedCategory;
  }, [categories, selectedCategory]);

  return (
    <section id="products-section" className="w-full my-8 sm:my-10">
      {/* Filter and Sorting Control Bar */}
      <div 
        className="rounded-2xl p-3.5 sm:p-4 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
        style={{
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(16px)',
          border: '1px solid #DCE7F0',
          boxShadow: '0 4px 18px -2px rgba(16, 38, 61, 0.04)'
        }}
      >
        {/* Horizontal Category Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none" role="tablist" aria-label="Product categories">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id || 'all'}
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectCategory(cat.id)}
                className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-[#145CFF] ${
                  isActive 
                    ? 'bg-[#145CFF] text-white shadow-xs' 
                    : 'bg-white text-[#52677B] hover:text-[#10263D] hover:bg-[#EAF4FC] border border-[#DCE7F0]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Secondary Filters: In-stock toggle & Sort Dropdown */}
        <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-[#DCE7F0]">
          {/* In-Stock Toggle */}
          <label className="flex items-center gap-2 text-xs font-semibold text-[#52677B] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded text-[#145CFF] focus:ring-[#145CFF] border-[#DCE7F0] h-4 w-4"
            />
            <span>{t.inStockOnly || 'In-Stock Only'}</span>
          </label>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="catalog-sort" className="sr-only">
              {t.sortBy || 'Sort by'}
            </label>
            <ArrowUpDown size={14} className="text-[#8FA6BE]" aria-hidden="true" />
            <select
              id="catalog-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold py-1.5 px-3 rounded-lg bg-white border border-[#DCE7F0] text-[#10263D] outline-none focus:border-[#145CFF]"
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
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-[#52677B]" role="region" aria-label="Active filters">
          <span className="font-semibold text-[#10263D]">{t.activeFilters || 'Active Filters:'}</span>
          
          {selectedPhone && (
            <span className="flex items-center gap-1 bg-[#EAF4FC] text-[#10263D] border border-[#DCE7F0] px-3 py-1 rounded-full font-medium">
              <span>{t.fitsFilter || 'Fits:'}</span>
              <strong>{selectedPhone}</strong>
              <button 
                onClick={onClearPhoneFilter} 
                className="ml-1 text-[#145CFF] hover:text-[#0D4BD9] font-bold p-0.5"
                aria-label={`Remove filter for ${selectedPhone}`}
              >
                ×
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="flex items-center gap-1 bg-[#EAF4FC] text-[#10263D] border border-[#DCE7F0] px-3 py-1 rounded-full font-medium">
              <span>{t.searchFilter || 'Search:'}</span>
              <strong>"{searchQuery}"</strong>
              <button 
                onClick={onClearSearch} 
                className="ml-1 text-[#145CFF] hover:text-[#0D4BD9] font-bold p-0.5"
                aria-label="Clear search filter"
              >
                ×
              </button>
            </span>
          )}

          {selectedCategory && (
            <span className="flex items-center gap-1 bg-[#EAF4FC] text-[#10263D] border border-[#DCE7F0] px-3 py-1 rounded-full font-medium">
              <span>{t.categoryFilter || 'Category:'}</span>
              <strong>{activeCategoryLabel}</strong>
              <button 
                onClick={() => onSelectCategory(null)} 
                className="ml-1 text-[#145CFF] hover:text-[#0D4BD9] font-bold p-0.5"
                aria-label={`Remove category filter for ${activeCategoryLabel}`}
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
            }}
            className="text-[#145CFF] hover:text-[#0D4BD9] font-semibold underline ml-1.5"
          >
            {t.clearAll || 'Clear all'}
          </button>
        </div>
      )}

      {/* Responsive Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
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
        /* Zero-State Handling */
        <div className="rounded-3xl p-10 sm:p-12 text-center bg-white border border-[#DCE7F0] shadow-xs max-w-lg mx-auto" role="status">
          <div className="w-16 h-16 rounded-full bg-[#EAF4FC] text-[#145CFF] mx-auto flex items-center justify-center mb-4">
            <SearchX size={32} />
          </div>
          <h4 className="text-base sm:text-lg font-bold text-[#10263D] mb-1">
            {t.noProductsFound || 'No matching accessories found'}
          </h4>
          <p className="text-xs sm:text-sm text-[#52677B] mb-5">
            {t.noProductsSub || 'Try clearing your filters or exploring different categories.'}
          </p>
          <button
            onClick={() => {
              onClearPhoneFilter();
              onClearSearch();
              onSelectCategory(null);
              setInStockOnly(false);
            }}
            className="px-6 py-2.5 rounded-full bg-[#145CFF] hover:bg-[#0D4BD9] text-white font-semibold text-xs sm:text-sm shadow-xs"
          >
            {t.resetFilters || 'Reset All Filters'}
          </button>
        </div>
      )}

      {/* Honest Catalog Notice */}
      <div className="mt-8 text-center">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-medium bg-[#EAF4FC] border border-[#DCE7F0] text-[#52677B]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#145CFF]" />
          {t.devSeedNotice}
        </span>
      </div>
    </section>
  );
}
