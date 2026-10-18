import React, { useState } from 'react';
import { Heart, Check, Star, ShoppingBag, ShieldCheck, Scale, Zap } from 'lucide-react';

export default function ProductCard({ 
  product, 
  currencySymbol = "৳", 
  onQuickAdd, 
  onOpenDetail, 
  isWishlisted, 
  onToggleWishlist,
  onToggleCompare,
  isCompared = false,
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

  const handleCompareClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onToggleCompare) {
      onToggleCompare(product);
    }
  };

  return (
    <div 
      role="article"
      tabIndex="0"
      onKeyDown={handleCardKeyDown}
      onClick={() => onOpenDetail(product)}
      className="group relative p-3 sm:p-3.5 flex flex-col justify-between h-full bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#145CFF] hover:shadow-md transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#145CFF]"
      aria-label={`${product.title}, ${currencySymbol}${product.price}`}
    >
      {/* Top Media Showcase / Soft Light-Gray Pedestal */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-[#F8FAFC] border border-[#F1F5F9] flex items-center justify-center p-3">
        <img
          src={product.image}
          alt={lang === 'bn' ? product.titleBn : product.title}
          className={`w-full h-full object-contain transition-transform duration-300 ${
            isOutOfStock ? 'opacity-50 grayscale-[20%]' : 'group-hover:scale-105'
          }`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/assets/tech-nest-app-icon.png';
          }}
        />

        {/* Top-Right: High-Contrast Discount Badge */}
        {hasDiscount && !isOutOfStock && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#EFF6FF] text-[#145CFF] border border-[#BFDBFE] shadow-2xs">
            -{discountPercent}%
          </div>
        )}

        {/* Top-Left: Authentic Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.badge && !isOutOfStock && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-[#0F172A] border border-slate-200 shadow-2xs">
              {product.badge}
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow-2xs">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Sold Out Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-[#0F172A]/50 backdrop-blur-[2px] flex items-center justify-center z-10 pointer-events-none">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0F172A] text-white shadow-md border border-white/20">
              {lang === 'bn' ? 'স্টক শেষ' : 'Sold Out'}
            </span>
          </div>
        )}

        {/* Floating Quick Action Triggers (Wishlist & Compare) */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-20">
          {onToggleCompare && (
            <button
              type="button"
              onClick={handleCompareClick}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-xs ${
                isCompared 
                  ? 'bg-[#145CFF] text-white border border-[#145CFF]' 
                  : 'bg-white/95 text-slate-500 hover:text-[#145CFF] hover:bg-white border border-[#E2E8F0]'
              }`}
              title={isCompared ? 'Remove from compare' : 'Add to compare'}
              aria-label={isCompared ? 'Remove from compare' : 'Add to compare'}
            >
              <Scale size={13} />
            </button>
          )}

          <button
            type="button"
            onClick={handleWishlistClick}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-xs ${
              isWishlisted 
                ? 'bg-rose-500 text-white border border-rose-600' 
                : 'bg-white/95 text-slate-500 hover:text-rose-600 hover:bg-white border border-[#E2E8F0]'
            }`}
            title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart size={13} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Phone Compatibility Pill */}
        {selectedPhone && (
          <div className="absolute bottom-2 left-2 z-10">
            {isCompatible ? (
              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shadow-2xs">
                Fits {selectedPhone.split(' ')[0]}
              </span>
            ) : (
              <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                Check fit
              </span>
            )}
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-grow justify-between">
        <div>
          {/* Category, Brand, Model & Stock */}
          <div className="flex items-center flex-wrap gap-1 mb-1.5 text-[10px]">
            <span className="font-bold text-slate-500 uppercase tracking-wider">
              {product.category}
            </span>
            {product.brand && (
              <>
                <span className="text-slate-300">•</span>
                <span className="font-bold text-[#0F172A] truncate max-w-[90px]" title={product.brand}>
                  {product.brand}
                </span>
              </>
            )}
            {product.model && (
              <>
                <span className="text-slate-300">•</span>
                <span className="font-mono text-slate-500 truncate max-w-[80px]" title={product.model}>
                  {product.model}
                </span>
              </>
            )}
            <span className="text-slate-300">•</span>
            <span className={`font-semibold ${product.stock > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>
              {product.stock > 0 ? (lang === 'bn' ? 'স্টকে আছে' : 'In Stock') : (lang === 'bn' ? 'স্টক শেষ' : 'Out of Stock')}
            </span>
          </div>

          {/* Title in Dark Navy */}
          <h3 className="font-bold text-xs sm:text-sm text-[#0F172A] leading-snug group-hover:text-[#145CFF] transition-colors line-clamp-2 min-h-[2.5rem] mb-1.5">
            {lang === 'bn' ? product.titleBn : product.title}
          </h3>

          {/* Genuine Ratings & Review Count */}
          {product.rating && (
            <div className="flex items-center gap-1.5 mb-2.5 text-xs">
              <div className="flex items-center text-amber-500">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="ml-1 font-bold text-[11px] text-[#0F172A]">{product.rating}</span>
              </div>
              {product.reviewCount && (
                <span className="text-[10px] text-slate-500">
                  ({product.reviewCount})
                </span>
              )}
              {product.photoRef && (
                <span className="ml-auto text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-50 border border-slate-200 text-slate-500">
                  {product.photoRef}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bottom Price & Electric-Blue Add to Cart Button */}
        <div className="pt-2.5 border-t border-slate-100 mt-auto flex items-center justify-between gap-1.5">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
                {currencySymbol}{product.price.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-[11px] text-slate-400 line-through">
                  {currencySymbol}{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 block truncate">
              {product.warranty ? product.warranty : 'Verified Quality'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleQuickAddClick}
            disabled={isOutOfStock}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-1.5 font-bold text-xs transition-all cursor-pointer shadow-xs ${
              isOutOfStock 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                : isQuickAdded
                  ? 'bg-emerald-600 text-white border border-emerald-600'
                  : 'bg-[#145CFF] hover:bg-[#0D4BD9] text-white border border-[#145CFF] hover:shadow-md active:scale-95'
            }`}
            title={isOutOfStock ? 'Sold out' : `Add ${product.title} to bag`}
            aria-label={isOutOfStock ? 'Sold out' : `Add to cart`}
          >
            {isQuickAdded ? (
              <Check size={16} />
            ) : (
              <>
                <ShoppingBag size={14} />
                <span className="hidden sm:inline">{lang === 'bn' ? 'যুক্ত করুন' : 'Add'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

