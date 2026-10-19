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

  // 4 items matching Screenshot 2:
  // Card 1: Over-ear Headphones (pale warm gray) with "• Featured" badge top-right
  // Card 2: Pro Camera Drone (pale gray-blue)
  // Card 3: Action Camera with flip screen (pale peach) with "Save ৳300" badge top-left
  // Card 4: White Gaming Controller (pale light-gray)
  const newInItems = [
    {
      id: 'featured-audio-luxury',
      sku: 'P16-ANK-NY200-SLV',
      title: 'AuraLux Studio Pro Wireless Over-Ear Headphones',
      price: 2450,
      originalPrice: 3200,
      rating: 4.9,
      reviewCount: 128,
      badge: '• Featured',
      badgePos: 'right',
      badgeClass: 'bg-white text-slate-800 border border-slate-200',
      tint: 'bg-[#f5f2ee]',
      image: '/assets/featured-mclaren-headphones.jpg',
      category: 'audio'
    },
    {
      id: 'featured-drone-pro',
      sku: 'P14-VOL-DRONE-PRO',
      title: 'Volaris 4K Gimbal Pro Aerial Drone with Dual Sensors',
      price: 6850,
      originalPrice: 8500,
      rating: 4.8,
      reviewCount: 76,
      tint: 'bg-[#f0f3f6]',
      image: '/assets/featured-lavic-drone.jpg',
      category: 'drones'
    },
    {
      id: 'featured-action-cam',
      sku: 'P18-ACTION-X8-PRO',
      title: 'Action X8 Pro Dual-Screen 4K Waterproof Action Camera',
      price: 3650,
      originalPrice: 4200,
      rating: 4.7,
      reviewCount: 92,
      badge: `Save ${currencySymbol}300`,
      badgePos: 'left',
      badgeClass: 'bg-[#0066FF] text-white',
      tint: 'bg-[#faedea]',
      image: '/assets/action-camera-thumb.jpg',
      category: 'cameras'
    },
    {
      id: 'featured-game-controller',
      sku: 'P03-ORBIT-CTRL-WHT',
      title: 'Orbit Pro Wireless Ergonomic Gaming Controller',
      price: 1850,
      originalPrice: 2400,
      rating: 4.9,
      reviewCount: 145,
      tint: 'bg-[#f1f3f5]',
      image: '/assets/game-controller-thumb.jpg',
      category: 'accessories'
    }
  ];

  const handleAdd = (e, item) => {
    e.stopPropagation();
    // Find matching real product or create a clean cart object
    const realProd = products.find(p => p.sku === item.sku || p.id === item.id) || {
      id: item.id,
      sku: item.sku,
      title: item.title,
      price: item.price,
      image: item.image,
      category: item.category,
      stock: 25
    };
    if (onQuickAdd) onQuickAdd(realProd);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const handleCardClick = (item) => {
    const realProd = products.find(p => p.sku === item.sku || p.id === item.id) || {
      id: item.id,
      sku: item.sku,
      title: item.title,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      category: item.category,
      rating: item.rating,
      reviewCount: item.reviewCount,
      stock: 25,
      description: 'High-performance next-generation electronics engineered for seamless connectivity and durability.'
    };
    if (onOpenDetail) onOpenDetail(realProd);
  };

  return (
    <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" aria-label="New In Collection">
      {/* Section Header (Screenshot 2) */}
      <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            New In
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Find something that hits the right note
          </p>
        </div>

        {/* Right Action: Shop All New Button (Screenshot 2) */}
        <button
          type="button"
          onClick={onShopAll}
          className="px-5 sm:px-6 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs sm:text-sm transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer select-none"
        >
          Shop All New
        </button>
      </div>

      {/* 4-Column Product Grid (Screenshot 2) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {newInItems.map((item) => {
          const isWishlisted = wishlistIds.includes(item.id);
          const hasDiscount = item.originalPrice && item.originalPrice > item.price;

          return (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer p-3 sm:p-4 relative"
            >
              {/* Product Media Pedestal with soft tint */}
              <div className={`relative w-full aspect-square rounded-xl ${item.tint} flex items-center justify-center p-4 mb-3 overflow-hidden`}>
                
                {/* Badge if present */}
                {item.badge && (
                  <div className={`absolute top-2.5 ${item.badgePos === 'right' ? 'right-2.5' : 'left-2.5'} z-10`}>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-2xs ${item.badgeClass}`}>
                      {item.badge}
                    </span>
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleWishlist) onToggleWishlist(item);
                  }}
                  className={`absolute top-2.5 ${item.badgePos === 'right' ? 'left-2.5' : 'right-2.5'} z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-rose-600 flex items-center justify-center shadow-2xs transition-colors cursor-pointer`}
                  title="Save to wishlist"
                >
                  <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "text-rose-600" : ""} />
                </button>

                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Product Content Details */}
              <div className="flex flex-col flex-1 justify-between">
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-1.5">
                    <div className="flex items-center text-amber-400">
                      <Star size={12} className="fill-amber-400" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800">{item.rating}</span>
                    <span className="text-[10px] text-slate-400">({item.reviewCount})</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-[#0066FF] transition-colors line-clamp-2 min-h-[2.5rem] mb-2 leading-snug">
                    {item.title}
                  </h3>
                </div>

                {/* Price and Cart Action */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm sm:text-base font-extrabold text-slate-900">
                      {currencySymbol}{item.price.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-[11px] text-slate-400 line-through">
                        {currencySymbol}{item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleAdd(e, item)}
                    className={`p-2 rounded-xl flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                      addedId === item.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#0066FF] hover:bg-blue-700 text-white shadow-xs'
                    }`}
                    title={`Add ${item.title} to cart`}
                  >
                    {addedId === item.id ? <Check size={14} /> : <ShoppingBag size={14} />}
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
