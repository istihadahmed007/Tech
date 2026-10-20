import React, { useState } from 'react';
import { ShoppingBag, Check, Star, Heart } from 'lucide-react';

export default function NewInSection({ 
  products = [],
  currencySymbol = "৳",
  onQuickAdd,
  onOpenDetail,
  onShopAll,
  wishlistIds = [],
  onToggleWishlist,
  lang = 'en'
}) {
  const [addedId, setAddedId] = useState(null);

  // Select 4 authentic newest products from the verified catalog:
  // 1. P16: ANKEER NK-NY200 Studio Wireless Headphones (Audio)
  // 2. P13: T800 Ultra 2 Smartwatch (Wearables)
  // 3. P04: Ultrapods Pro Crystal TWS Earbuds (Audio)
  // 4. P20: RECRSI 4-in-1 65W Fast Charging Braided Cable (Charging)
  const displayItems = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    
    const preferredSkus = [
      'P16-ANK-NY200-SLV',
      'P13-T800-ULTRA2-SLV',
      'P04-ULTRAPODS-PRO-ALL',
      'P20-RECRSI-4IN1'
    ];

    const matched = [];
    preferredSkus.forEach((sku) => {
      const p = products.find(item => item.sku === sku || item.id === sku.toLowerCase());
      if (p) matched.push(p);
    });

    // Fill up to 4 with other authentic products if any SKU is missing
    if (matched.length < 4) {
      for (const p of products) {
        if (!matched.some(m => m.id === p.id)) {
          matched.push(p);
          if (matched.length === 4) break;
        }
      }
    }

    const cardTints = ['bg-[#f5f2ee]', 'bg-[#f0f3f6]', 'bg-[#faedea]', 'bg-[#f1f3f5]'];

    return matched.slice(0, 4).map((p, idx) => ({
      ...p,
      tint: cardTints[idx % cardTints.length],
      badge: p.originalPrice && p.originalPrice > p.price
        ? `Save ${currencySymbol}${p.originalPrice - p.price}`
        : (idx === 0 ? '• Featured' : null),
      badgePos: idx === 0 ? 'right' : 'left',
      badgeClass: idx === 0 
        ? 'bg-white text-slate-800 border border-slate-200' 
        : 'bg-[#0066FF] text-white'
    }));
  }, [products, currencySymbol]);

  const handleAdd = (e, item) => {
    e.stopPropagation();
    if (onQuickAdd) onQuickAdd(item);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const handleCardClick = (item) => {
    if (onOpenDetail) onOpenDetail(item);
  };

  return (
    <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" aria-label="New In Collection">
      {/* Section Header (matching reference layout) */}
      <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'bn' ? 'নতুন কালেকশন' : 'New In'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {lang === 'bn' ? 'আমাদের সর্বশেষ অথেনটিক টেক গ্যাজেট ও আপগ্রেড' : 'Find something that hits the right note'}
          </p>
        </div>

        {/* Right Action: Shop All New Button */}
        <button
          type="button"
          onClick={onShopAll}
          className="px-5 sm:px-6 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs sm:text-sm transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer select-none"
        >
          {lang === 'bn' ? 'সব দেখুন' : 'Shop All New'}
        </button>
      </div>

      {/* 4-Column Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {displayItems.map((item) => {
          const isWishlisted = wishlistIds.includes(item.id);
          const hasDiscount = item.originalPrice && item.originalPrice > item.price;

          return (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer p-3 sm:p-4 relative"
            >
              {/* Product Media Container with Pedestal Background */}
              <div className={`relative w-full aspect-square rounded-xl ${item.tint} flex items-center justify-center p-4 mb-3 overflow-hidden`}>
                
                {/* Badges */}
                {item.badge && (
                  <div className={`absolute top-2.5 ${item.badgePos === 'right' ? 'right-2.5' : 'left-2.5'} z-10`}>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold tracking-tight shadow-2xs ${item.badgeClass}`}>
                      {item.badge}
                    </span>
                  </div>
                )}

                {/* Wishlist Heart Icon */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleWishlist) onToggleWishlist(item);
                  }}
                  className={`absolute top-2.5 ${item.badgePos === 'right' ? 'left-2.5' : 'right-2.5'} p-2 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-rose-500 transition-colors shadow-2xs z-10 cursor-pointer ${
                    isWishlisted ? '!text-rose-500 fill-rose-500' : ''
                  }`}
                  aria-label="Save to Wishlist"
                >
                  <Heart size={15} className={isWishlisted ? 'fill-rose-500 text-rose-500' : ''} />
                </button>

                {/* Product Photograph */}
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/product-placeholder.png';
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col flex-1 justify-between">
                <div>
                  {/* Category & Verified Note */}
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
                    <span className="capitalize">{item.category}</span>
                    <span className="text-emerald-700 font-semibold">{item.stock > 0 ? (lang === 'bn' ? 'স্টকে আছে' : 'In Stock') : (lang === 'bn' ? 'স্টক শেষ' : 'Sold Out')}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors line-clamp-2 leading-snug mb-2">
                    {lang === 'bn' ? (item.titleBn || item.title) : item.title}
                  </h3>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          className={i < Math.floor(item.rating || 4.5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'} 
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 ml-0.5">
                      {item.rating || '4.8'}
                    </span>
                    <span className="text-[11px] text-slate-600">
                      ({item.reviewsCount || item.reviewCount || 42})
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Price & Add to Bag Button */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-1">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm sm:text-base font-extrabold text-slate-900">
                        {currencySymbol}{item.price.toLocaleString()}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-slate-600 line-through">
                          {currencySymbol}{item.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Restrained Blue Action Button */}
                  <button
                    type="button"
                    onClick={(e) => handleAdd(e, item)}
                    className={`p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all duration-150 cursor-pointer ${
                      addedId === item.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#0066FF] hover:bg-blue-700 active:bg-blue-800 text-white shadow-2xs'
                    }`}
                    title="Add to shopping bag"
                  >
                    {addedId === item.id ? (
                      <>
                        <Check size={14} className="stroke-[3]" />
                        <span className="hidden sm:inline">Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} />
                        <span className="hidden sm:inline">Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
