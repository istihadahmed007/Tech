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
    { id: null, label: t.allProducts || 'All Products' },
    { id: 'earbuds', label: lang === 'bn' ? 'ইয়ারবাডস' : 'Earbuds & TWS' },
    { id: 'headphones', label: lang === 'bn' ? 'হেডফোন ও নেকব্যান্ড' : 'Headphones' },
    { id: 'chargers', label: lang === 'bn' ? 'চার্জার' : 'Chargers' },
    { id: 'cables', label: lang === 'bn' ? 'ক্যাবল' : 'Cables' },
    { id: 'wearables', label: t.catWearables || 'Smartwatches' },
    { id: 'cases', label: lang === 'bn' ? 'কেস ও কভার' : 'Cases' }
  ], [t, lang]);

  // Comprehensive filter and search matching
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category filter supporting both broad and granular IDs
      if (selectedCategory) {
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
      return 0; // featured default order
    });
  }, [products, selectedCategory, selectedPhone, searchQuery, inStockOnly, sortBy]);

  const activeCategoryLabel = useMemo(() => {
    return categories.find(c => c.id === selectedCategory)?.label || selectedCategory;
  }, [categories, selectedCategory]);

  return (
    <section id="products-section" className="w-full my-6 sm:my-8">
      {/* Filter and Sorting Control Bar */}
      <div className="bg-white rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-[#ECECEC] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
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
                className={`text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#168FC2] ${
                  isActive 
                    ? 'bg-[#168FC2] text-white shadow-xs' 
                    : 'bg-white text-[#62788A] hover:text-[#168FC2] hover:bg-[#DDF4FC] border border-[#DCEAF1]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Secondary Filters: In-stock toggle & Sort Dropdown */}
        <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-[#DCEAF1]">
          {/* In-Stock Toggle */}
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[#62788A] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded text-[#168FC2] focus:ring-[#168FC2] border-[#DCEAF1] h-4 w-4"
            />
            <span>{t.inStockOnly || 'In-Stock Only'}</span>
          </label>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="catalog-sort" className="sr-only">
              {t.sortBy || 'Sort by'}
            </label>
            <ArrowUpDown size={14} className="text-[#62788A]" aria-hidden="true" />
            <select
              id="catalog-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-semibold py-1.5 px-3 rounded-md bg-white border border-[#DCEAF1] text-[#102A43] outline-none focus:border-[#168FC2] cursor-pointer"
            >
              <option value="featured">{t.sortFeatured || 'Featured'}</option>
              <option value="newest">{lang === 'bn' ? 'নতুন পণ্য' : 'Newest Arrivals'}</option>
              <option value="price-asc">{t.sortPriceAsc || 'Price: Low to High'}</option>
              <option value="price-desc">{t.sortPriceDesc || 'Price: High to Low'}</option>
              <option value="rating">{t.sortRating || 'Highest Rated'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Indicators */}
      {(selectedPhone || searchQuery || selectedCategory) && (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-[#62788A]" role="region" aria-label="Active filters">
          <span className="font-semibold text-[#102A43]">{t.activeFilters || 'Active Filters:'}</span>
          
          {selectedPhone && (
            <span className="flex items-center gap-1 bg-[#DDF4FC] text-[#102A43] border border-[#B8E7F8] px-3 py-1 rounded-full font-medium">
              <span>{t.fitsFilter || 'Fits:'}</span>
              <strong>{selectedPhone}</strong>
              <button 
                onClick={onClearPhoneFilter} 
                className="ml-1 text-[#168FC2] hover:text-[#0F7CA6] font-bold p-0.5"
                aria-label={`Remove filter for ${selectedPhone}`}
              >
                ×
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="flex items-center gap-1 bg-[#DDF4FC] text-[#102A43] border border-[#B8E7F8] px-3 py-1 rounded-full font-medium">
              <span>{t.searchFilter || 'Search:'}</span>
              <strong>"{searchQuery}"</strong>
              <button 
                onClick={onClearSearch} 
                className="ml-1 text-[#168FC2] hover:text-[#0F7CA6] font-bold p-0.5"
                aria-label="Clear search filter"
              >
                ×
              </button>
            </span>
          )}

          {selectedCategory && (
            <span className="flex items-center gap-1 bg-[#DDF4FC] text-[#102A43] border border-[#B8E7F8] px-3 py-1 rounded-full font-medium">
              <span>{t.categoryFilter || 'Category:'}</span>
              <strong>{activeCategoryLabel}</strong>
              <button 
                onClick={() => onSelectCategory(null)} 
                className="ml-1 text-[#168FC2] hover:text-[#0F7CA6] font-bold p-0.5"
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
            className="text-[#168FC2] hover:text-[#0F7CA6] font-semibold underline ml-1.5"
          >
            {t.clearAll || 'Clear all'}
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
              t={t}
              lang={lang}
            />
          ))}
        </div>
      ) : (
        /* Zero-State Handling */
        <div className="rounded-2xl p-10 sm:p-12 text-center bg-white border border-[#DCEAF1] shadow-xs max-w-lg mx-auto" role="status">
          <div className="w-16 h-16 rounded-full bg-[#DDF4FC] text-[#168FC2] mx-auto flex items-center justify-center mb-4">
            <SearchX size={32} />
          </div>
          <h4 className="text-base sm:text-lg font-bold text-[#102A43] mb-1">
            {t.noProductsFound || 'No matching accessories found'}
          </h4>
          <p className="text-xs sm:text-sm text-[#62788A] mb-5">
            {t.noProductsSub || 'Try clearing your filters or exploring different categories.'}
          </p>
          <button
            onClick={() => {
              onClearPhoneFilter();
              onClearSearch();
              onSelectCategory(null);
              setInStockOnly(false);
            }}
            className="px-6 py-2.5 rounded-md bg-[#168FC2] hover:bg-[#0F7CA6] text-white font-bold text-xs sm:text-sm shadow-xs cursor-pointer"
          >
            {t.resetFilters || 'Reset All Filters'}
          </button>
        </div>
      )}

      {/* Honest Catalog Notice */}
      <div className="mt-8 text-center">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-medium bg-[#DDF4FC] border border-[#B8E7F8] text-[#62788A]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#168FC2]" />
          {t.devSeedNotice}
        </span>
      </div>
    </section>
  );
}
