import React, { useState } from 'react';
import { Sparkles, Star, ShoppingBag, Check, Heart } from 'lucide-react';

export default function HotDealsSection({ 
  products = [],
  currencySymbol = "৳",
  onQuickAdd,
  onOpenDetail,
  wishlistIds = [],
  onToggleWishlist,
  lang = 'en'
}) {
  // Filter authentic catalog products that have verified originalPrice discounts
  const hotDeals = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    const discounted = products.filter(p => p.originalPrice && p.originalPrice > p.price);
    if (discounted.length >= 4) return discounted.slice(0, 4);
    // Fill with other authentic products if fewer than 4 discounted items
    const remaining = products.filter(p => !discounted.includes(p));
    return [...discounted, ...remaining].slice(0, 4);
  }, [products]);

  const [addedId, setAddedId] = useState(null);

  const handleAdd = (e, product) => {
    e.stopPropagation();
    if (onQuickAdd) onQuickAdd(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  // Predefined soft pale backgrounds for visual variety matching screenshot
  const cardTints = ['bg-[#f7f5f2]', 'bg-[#f0f3f6]', 'bg-[#faedea]', 'bg-[#f1f4f8]'];

  return (
    <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10" aria-label="Hot Deals">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'bn' ? 'হট ডিলস ও বিশেষ অফার' : 'Hot Deals'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {lang === 'bn' ? 'যাচাইকৃত ডিসকাউন্ট ও অথেনটিক পণ্যে সেরা মূল্য' : 'Verified savings on authentic audio, charging and wearables'}
          </p>
        </div>

        {/* Authentic Special Offers Badge */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] font-semibold text-xs shadow-2xs">
            <Sparkles size={14} className="stroke-[2.5]" />
            <span>
              {lang === 'bn' ? 'স্টক সীমিত • আসল গ্যাজেটে বিশেষ মূল্য' : 'Limited Stock • Authentic BD Warranty'}
            </span>
          </div>
        </div>
      </div>

      {/* 4-Column Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {hotDeals.map((product, idx) => {
          const tint = cardTints[idx % cardTints.length];
          const hasDiscount = product.originalPrice && product.originalPrice > product.price;
          const savings = hasDiscount ? product.originalPrice - product.price : 0;
          const isWishlisted = wishlistIds.includes(product.id);

          return (
            <div
              key={product.id}
              onClick={() => onOpenDetail && onOpenDetail(product)}
              className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer p-3 sm:p-4 relative"
            >
              {/* Product Media Pedestal */}
              <div className={`relative w-full aspect-square rounded-xl ${tint} flex items-center justify-center p-4 mb-3 overflow-hidden`}>
                
                {/* Genuine Savings Badge */}
                {hasDiscount && (
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-[#0066FF] text-white text-[11px] font-bold tracking-tight shadow-2xs">
                      Save {currencySymbol}{savings.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Wishlist Heart Icon */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleWishlist) onToggleWishlist(product);
                  }}
                  className={`absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-rose-500 transition-colors shadow-2xs z-10 cursor-pointer ${
                    isWishlisted ? '!text-rose-500 fill-rose-500' : ''
                  }`}
                  aria-label="Save to Wishlist"
                >
                  <Heart size={15} className={isWishlisted ? 'fill-rose-500 text-rose-500' : ''} />
                </button>

                {/* Authentic Product Photography */}
                <img
                  src={product.image}
                  alt={product.title}
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
                  {/* Category & Stock Indicator */}
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
                    <span className="capitalize">{product.category}</span>
                    <span className="text-emerald-700 font-semibold">{product.stock > 0 ? (lang === 'bn' ? 'স্টকে আছে' : 'In Stock') : (lang === 'bn' ? 'স্টক শেষ' : 'Sold Out')}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0066FF] transition-colors line-clamp-2 leading-snug mb-2">
                    {lang === 'bn' ? (product.titleBn || product.title) : product.title}
                  </h3>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          className={i < Math.floor(product.rating || 4.5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'} 
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 ml-0.5">
                      {product.rating || '4.8'}
                    </span>
                    <span className="text-[11px] text-slate-600">
                      ({product.reviewsCount || product.reviewCount || 36})
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Price & Add to Bag */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-1">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm sm:text-base font-extrabold text-slate-900">
                        {currencySymbol}{product.price.toLocaleString()}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-slate-600 line-through">
                          {currencySymbol}{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleAdd(e, product)}
                    className={`p-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all duration-150 cursor-pointer ${
                      addedId === product.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#0066FF] hover:bg-blue-700 active:bg-blue-800 text-white shadow-2xs'
                    }`}
                    title="Add to shopping bag"
                  >
                    {addedId === product.id ? (
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
