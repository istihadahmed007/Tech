import React, { useState } from 'react';
import { Heart, ShoppingBag, Check, Zap } from 'lucide-react';
import { getHardwareGrade } from '../utils/hardwareGrade';

export default function ProductCard({ 
  product, 
  currencySymbol = "৳", 
  onQuickAdd, 
  onOpenDetail, 
  isWishlisted = false, 
  onToggleWishlist,
  onToggleCompare,
  isCompared = false,
  selectedPhone,
  t = {},
  lang = 'en'
}) {
  const [isQuickAdded, setIsQuickAdded] = useState(false);

  const isLowStock = product.stock <= 5 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  const hasDiscount = (product.originalPrice && product.originalPrice > product.price) || product.sale || product.isSale;
  const discountPercent = hasDiscount && product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const hardwareGrade = getHardwareGrade(product);

  const handleCardKeyDown = (e) => {
    if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      if (onOpenDetail) onOpenDetail(product);
    }
  };

  const handleQuickAddClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isOutOfStock) return;
    if (onQuickAdd) onQuickAdd(product);
    setIsQuickAdded(true);
    setTimeout(() => setIsQuickAdded(false), 1200);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onToggleWishlist) onToggleWishlist(product);
  };

  return (
    <div 
      role="article"
      tabIndex="0"
      onKeyDown={handleCardKeyDown}
      onClick={() => onOpenDetail && onOpenDetail(product)}
      className="product-card-glass rounded-2xl overflow-hidden relative flex flex-col justify-between pt-4 group cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500 select-none"
      aria-label={`${product.title}, ${currencySymbol}${product.price}`}
    >
      {/* Top-Left Diagonal Coral SALE Ribbon (Exact match to Reference Image) */}
      {hasDiscount && !isOutOfStock && (
        <div className="sale-ribbon">
          <span>{discountPercent > 0 ? `-${discountPercent}%` : 'SALE'}</span>
        </div>
      )}

      {/* Top Header Row Inside Card: Brand/Tier Badge & Wishlist Heart */}
      <div className="px-3 flex items-center justify-between z-10">
        <span className="text-[9px] font-mono font-bold text-blue-600 bg-white/85 px-2 py-0.5 rounded-full border border-blue-100 shadow-2xs">
          {product.brand || hardwareGrade?.shortLabel || 'VERIFIED'}
        </span>

        <button
          type="button"
          onClick={handleWishlistClick}
          className={`p-1.5 rounded-full transition-all cursor-pointer ${
            isWishlisted 
              ? 'text-rose-500 bg-white shadow-2xs scale-110' 
              : 'text-slate-400 hover:text-rose-400 bg-white/50 hover:bg-white'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-label="Wishlist"
        >
          <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Real Product Photo Pedestal Area (No 3D cubes; authentic high-res products) */}
      <div className="relative w-full aspect-square flex items-center justify-center p-3 my-1 overflow-hidden">
        <img
          src={product.image}
          alt={lang === 'bn' ? (product.titleBn || product.title) : product.title}
          className={`w-full h-full object-contain transition-transform duration-300 ${
            isOutOfStock ? 'opacity-40 grayscale-[40%]' : 'group-hover:scale-104'
          }`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/assets/tech-nest-app-icon.png';
          }}
        />

        {isOutOfStock && (
          <div className="absolute inset-0 m-auto flex items-center justify-center">
            <span className="bg-slate-900/80 text-white font-mono text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider backdrop-blur-xs">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Price Showcase */}
      <div className="px-3 mb-2 text-center">
        <div className="font-mono text-xs sm:text-sm font-extrabold text-[#0077E6]">
          {currencySymbol}{product.price.toLocaleString()}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[10px] line-through text-slate-400 font-normal ml-1.5">
              {currencySymbol}{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Frosted Bottom Label Bar Strip (Exact Match to Reference Screenshot) */}
      <div 
        onClick={handleQuickAddClick}
        className="bg-white/65 group-hover:bg-white/90 border-t border-white/80 py-2.5 px-3 text-center transition-all cursor-pointer flex flex-col items-center justify-center"
      >
        <p className="text-xs font-semibold text-[#1E3A5F] line-clamp-2 min-h-[2rem] leading-snug w-full">
          {lang === 'bn' ? (product.titleBn || product.title) : product.title}
        </p>
        <p className="text-[10px] font-semibold text-[#0077E6] mt-0.5 flex items-center gap-1 group-hover:text-blue-700">
          {isQuickAdded ? (
            <>
              <Check size={11} className="text-emerald-500" />
              <span className="text-emerald-600">Added to Bag</span>
            </>
          ) : (
            <>
              <ShoppingBag size={11} />
              <span>+ Click to Add</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
