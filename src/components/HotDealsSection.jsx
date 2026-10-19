import React, { useState, useEffect } from 'react';
import { Clock, Star, ShoppingBag, Check, Heart } from 'lucide-react';

export default function HotDealsSection({ 
  products = [],
  currencySymbol = "৳",
  onQuickAdd,
  onOpenDetail,
  wishlistIds = [],
  onToggleWishlist,
  lang = 'en'
}) {
  // Live Countdown Timer matching Screenshot 1: "4 days : 23 hrs : 59 mins : 16 secs"
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 23,
    minutes: 59,
    seconds: 16
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter actual catalog products with discounts or high popularity
  const hotDeals = React.useMemo(() => {
    const discounted = products.filter(p => p.originalPrice && p.originalPrice > p.price);
    if (discounted.length >= 4) return discounted.slice(0, 4);
    // Fill with top products if fewer than 4
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
      {/* Section Header (Screenshot 1) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hot Deals
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Find something that hits the right note
          </p>
        </div>

        {/* Countdown Timer Badge */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-600 font-medium hidden sm:inline">Hurry up! Deal ends in</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-semibold text-xs shadow-2xs">
            <Clock size={14} className="stroke-[2.5]" />
            <span>
              {timeLeft.days} days : {timeLeft.hours} hrs : {timeLeft.minutes} mins : {String(timeLeft.seconds).padStart(2, '0')} secs
            </span>
          </div>
        </div>
      </div>

      {/* 4-Column Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {hotDeals.map((product, idx) => {
          const tint = cardTints[idx % cardTints.length];
          const hasDiscount = product.originalPrice && product.originalPrice > product.price;
          const savings = hasDiscount ? product.originalPrice - product.price : 300;
          const isWishlisted = wishlistIds.includes(product.id);

          return (
            <div
              key={product.id}
              onClick={() => onOpenDetail && onOpenDetail(product)}
              className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer p-3 sm:p-4 relative"
            >
              {/* Product Media Pedestal */}
              <div className={`relative w-full aspect-square rounded-xl ${tint} flex items-center justify-center p-4 mb-3 overflow-hidden`}>
                
                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  {idx === 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-800 shadow-2xs border border-slate-200">
                      • Featured
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0066FF] text-white shadow-2xs">
                      Save {currencySymbol}{savings.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleWishlist) onToggleWishlist(product);
                  }}
                  className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-rose-600 flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                  title="Save to wishlist"
                >
                  <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "text-rose-600" : ""} />
                </button>

                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col flex-1 justify-between">
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-1.5">
                    <div className="flex items-center text-amber-400">
                      <Star size={12} className="fill-amber-400" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800">{product.rating || 4.8}</span>
                    <span className="text-[10px] text-slate-400">({product.reviewCount || 94})</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-[#0066FF] transition-colors line-clamp-2 min-h-[2.5rem] mb-2 leading-snug">
                    {product.title}
                  </h3>
                </div>

                {/* Price and Cart Button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm sm:text-base font-extrabold text-slate-900">
                      {currencySymbol}{product.price.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-[11px] text-slate-400 line-through">
                        {currencySymbol}{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleAdd(e, product)}
                    className={`p-2 rounded-xl flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                      addedId === product.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#0066FF] hover:bg-blue-700 text-white shadow-xs'
                    }`}
                    title={`Add ${product.title} to cart`}
                  >
                    {addedId === product.id ? <Check size={14} /> : <ShoppingBag size={14} />}
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
