import React, { useState } from 'react';
import { Plus, Heart, Check, Star, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function ProductCard({ 
  product, 
  currencySymbol = "৳", 
  onQuickAdd, 
  onOpenDetail, 
  isWishlisted, 
  onToggleWishlist,
  selectedPhone,
  t = {},
  lang = 'en'
}) {
  const [isQuickAdded, setIsQuickAdded] = useState(false);

  const isCompatible = selectedPhone 
    ? product.compatibleWith?.includes(selectedPhone)
    : true;

  const isLowStock = product.stock <= 5 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const handleCardKeyDown = (e) => {
    if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onOpenDetail(product);
    }
  };

  const handleQuickAddClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isOutOfStock) return;
    onQuickAdd(product);
    setIsQuickAdded(true);
    setTimeout(() => setIsQuickAdded(false), 1200);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleWishlist(product);
  };

  return (
    <div 
      role="article"
      tabIndex="0"
      onKeyDown={handleCardKeyDown}
      onClick={() => onOpenDetail(product)}
      className="shopee-product-card group relative p-3 flex flex-col justify-between h-full bg-white border border-[#ECECEC] hover:border-[#EE4D2D] hover:shadow-md transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#EE4D2D]"
      aria-label={`${product.title}, ${currencySymbol}${product.price}`}
    >
      {/* Top Media Showcase */}
      <div className="relative w-full aspect-square rounded-sm overflow-hidden mb-2.5 bg-white flex items-center justify-center p-2">
        <img
          src={product.image}
          alt={lang === 'bn' ? product.titleBn : product.title}
          className={`w-full h-full object-contain transition-transform duration-300 ${
            isOutOfStock ? 'opacity-60 grayscale-[20%]' : 'group-hover:scale-104'
          }`}
          loading="lazy"
        />

        {/* Top-Right: Shopee-Style Discount Badge */}
        {hasDiscount && !isOutOfStock && (
          <div className="shopee-discount-badge">
            <span>-{discountPercent}%</span>
          </div>
        )}

        {/* Top-Left: Authentic Badges */}
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 z-10">
          {product.badge && !isOutOfStock && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#10263D] text-white shadow-2xs">
              {product.badge}
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white shadow-2xs">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Sold Out Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10 pointer-events-none">
            <span className="px-2.5 py-1 rounded text-xs font-bold bg-[#10263D] text-white shadow-md border border-white/20">
              {lang === 'bn' ? 'স্টক শেষ' : 'Sold Out'}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={`absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all z-20 shadow-xs ${
            isWishlisted 
              ? 'bg-[#EE4D2D] text-white' 
              : 'bg-white/90 text-slate-400 hover:text-[#EE4D2D] hover:bg-white border border-slate-200'
          }`}
          aria-label={isWishlisted ? `Remove from wishlist` : `Add to wishlist`}
        >
          <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* Phone Compatibility Pill */}
        {selectedPhone && (
          <div className="absolute bottom-2 left-2 z-10">
            {isCompatible ? (
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded shadow-2xs">
                Fits {selectedPhone.split(' ')[0]}
              </span>
            ) : (
              <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                Check fit
              </span>
            )}
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-grow justify-between">
        <div>
          {/* Category & Verified Badge */}
          <div className="flex items-center gap-1.5 mb-1 text-[10px]">
            <span className="font-semibold text-slate-500 uppercase">
              {product.category}
            </span>
            <span className="text-slate-300">•</span>
            <span className={`font-medium ${product.stock > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>
              {product.stock > 0 ? (lang === 'bn' ? 'ইন স্টক' : 'In Stock') : (lang === 'bn' ? 'স্টক শেষ' : 'Out of Stock')}
            </span>
          </div>

          {/* Title (2-line clamp with uniform height) */}
          <h3 className="font-semibold text-xs sm:text-sm text-[#10263D] leading-snug group-hover:text-[#EE4D2D] transition-colors line-clamp-2 min-h-[2.5rem] mb-1.5">
            {lang === 'bn' ? product.titleBn : product.title}
          </h3>

          {/* Genuine Ratings & Review Count */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2 text-xs">
              <div className="flex items-center text-amber-500">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="ml-1 font-bold text-[11px] text-slate-700">{product.rating}</span>
              </div>
              {product.reviewCount && (
                <span className="text-[10px] text-slate-400">
                  ({product.reviewCount})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bottom Price & Add to Cart Button */}
        <div className="pt-2 border-t border-slate-100 mt-auto flex items-center justify-between gap-1">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-black text-[#EE4D2D]">
                {currencySymbol}{product.price.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-[10px] sm:text-[11px] text-slate-400 line-through">
                  {currencySymbol}{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 block truncate">
              {product.warranty ? product.warranty : 'Genuine Quality'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleQuickAddClick}
            disabled={isOutOfStock}
            className={`p-2 rounded-md flex items-center justify-center transition-all cursor-pointer ${
              isOutOfStock 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : isQuickAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#FFF5F1] hover:bg-[#EE4D2D] text-[#EE4D2D] hover:text-white border border-[#FFDCD4]'
            }`}
            title={isOutOfStock ? 'Sold out' : `Add ${product.title} to bag`}
            aria-label={isOutOfStock ? 'Sold out' : `Add to cart`}
          >
            {isQuickAdded ? <Check size={16} /> : <ShoppingBag size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
