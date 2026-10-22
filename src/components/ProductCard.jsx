import React, { useState } from 'react';
import { Heart, ShoppingBag, Check, Eye } from 'lucide-react';
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

  const handleQuickViewClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onOpenDetail) onOpenDetail(product);
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
      className="product-card-glass rounded-2xl overflow-hidden relative flex flex-col justify-between p-3.5 group cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-500 select-none bg-white border border-slate-200/80 hover:border-blue-400/80 hover:shadow-lg transition-all duration-200"
      aria-label={`${product.title}, ${currencySymbol}${product.price}`}
    >
      {/* Top-Left Diagonal Coral SALE Ribbon */}
      {hasDiscount && !isOutOfStock && (
        <div className="sale-ribbon">
          <span>{discountPercent > 0 ? `-${discountPercent}%` : 'SALE'}</span>
        </div>
      )}

      {/* Top Header Row Inside Card: Brand Badge & Wishlist Heart */}
      <div className="flex items-center justify-between z-10 mb-2">
        <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
          {product.brand || hardwareGrade?.shortLabel || 'VERIFIED'}
        </span>

        <button
          type="button"
          onClick={handleWishlistClick}
          className={`p-1.5 rounded-full transition-all cursor-pointer ${
            isWishlisted 
              ? 'text-rose-500 bg-rose-50 shadow-2xs scale-110' 
              : 'text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-white'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-label="Wishlist"
        >
          <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Product Photo Container (Neutral light background matching reference) */}
      <div className="relative w-full aspect-square bg-[#F8FAFC] rounded-xl flex items-center justify-center p-4 my-1 overflow-hidden border border-slate-100">
        <img
          src={product.image}
          alt={lang === 'bn' ? (product.titleBn || product.title) : product.title}
          className={`w-full h-full object-contain transition-transform duration-300 ${
            isOutOfStock ? 'opacity-40 grayscale-[40%]' : 'group-hover:scale-105'
          }`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/assets/tech-nest-app-icon.png';
          }}
        />

        {isOutOfStock && (
          <div className="absolute inset-0 m-auto flex items-center justify-center">
            <span className="bg-[#0F172A]/90 text-white font-mono text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider backdrop-blur-xs">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Details: Title & Price */}
      <div className="mt-2.5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {lang === 'bn' ? (product.titleBn || product.title) : product.title}
          </h3>
          <div className="font-mono text-sm sm:text-base font-extrabold text-slate-900 mt-1 flex items-baseline gap-2">
            <span>{currencySymbol}{product.price.toLocaleString()}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs line-through text-slate-400 font-normal">
                {currencySymbol}{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls: Quick View Pill Button (Matching Reference) + Quick Add */}
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={handleQuickViewClick}
            className="flex-1 py-2 px-3 rounded-full bg-[#0D2040] hover:bg-[#153468] text-white text-xs font-semibold text-center transition-colors shadow-xs flex items-center justify-center gap-1.5"
            title="Quick View"
          >
            <Eye size={13} />
            <span>Quick View</span>
          </button>

          <button
            type="button"
            onClick={handleQuickAddClick}
            disabled={isOutOfStock}
            className={`p-2 rounded-full border transition-all ${
              isQuickAdded 
                ? 'bg-emerald-500 border-emerald-500 text-white' 
                : 'bg-slate-100 hover:bg-blue-50 border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600'
            }`}
            title="Quick add to bag"
            aria-label="Add to bag"
          >
            {isQuickAdded ? <Check size={14} /> : <ShoppingBag size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}
