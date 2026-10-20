import React, { useState } from 'react';
import { Heart, Check, Star, ShoppingBag, ShieldCheck, Scale, Zap } from 'lucide-react';
import { getHardwareGrade, getTelemetrySpecs } from '../utils/hardwareGrade';

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

  const hardwareGrade = getHardwareGrade(product);
  const telemetrySpecs = getTelemetrySpecs(product);

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
      className="group relative p-3 sm:p-3.5 flex flex-col justify-between h-full bg-[#12141C] rounded-2xl border border-[#1E2230] hover:border-cyan-500/40 hover:shadow-[0_4px_24px_-2px_rgba(6,182,212,0.18)] transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#06B6D4] text-slate-100"
      aria-label={`${product.title}, ${currencySymbol}${product.price}`}
    >
      {/* Top Media Showcase / Dark Obsidian Pedestal */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 bg-[#0B0D14] border border-[#1E2230] flex items-center justify-center p-3">
        <img
          src={product.image}
          alt={lang === 'bn' ? product.titleBn : product.title}
          className={`w-full h-full object-contain transition-transform duration-300 ${
            isOutOfStock ? 'opacity-40 grayscale-[40%]' : 'group-hover:scale-105'
          }`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/assets/tech-nest-app-icon.png';
          }}
        />

        {/* Top-Right: High-Contrast Monospace Discount Badge */}
        {hasDiscount && !isOutOfStock && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-xs">
            -{discountPercent}%
          </div>
        )}

        {/* Top-Left: 3-Tier Hardware Grading Badge */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 max-w-[85%]">
          {!isOutOfStock && (
            <span className={`px-2 py-0.5 rounded-md font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-xs ${hardwareGrade.badgeClass}`}>
              [{hardwareGrade.shortLabel}]
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="px-2 py-0.5 rounded-md font-mono text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
              LOW STOCK: {product.stock}
            </span>
          )}
        </div>

        {/* Sold Out Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-[#090A0F]/70 backdrop-blur-[2px] flex items-center justify-center z-10 pointer-events-none">
            <span className="px-3 py-1 rounded-full font-mono text-xs font-bold bg-[#12141C] text-slate-300 shadow-md border border-[#1E2230]">
              {lang === 'bn' ? 'স্টক শেষ' : 'OUT OF STOCK'}
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
                  ? 'bg-cyan-500 text-slate-950 border border-cyan-400' 
                  : 'bg-[#12141C]/90 text-slate-400 hover:text-cyan-400 hover:bg-[#1A1D2A] border border-[#1E2230]'
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
                : 'bg-[#12141C]/90 text-slate-400 hover:text-rose-400 hover:bg-[#1A1D2A] border border-[#1E2230]'
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
              <span className="font-mono text-[10px] font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md shadow-xs">
                FITS {selectedPhone.split(' ')[0]}
              </span>
            ) : (
              <span className="font-mono text-[10px] font-medium text-slate-400 bg-[#12141C]/90 border border-[#1E2230] px-2 py-0.5 rounded-md">
                CHECK FIT
              </span>
            )}
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-grow justify-between">
        <div>
          {/* Telemetry Spec Pills replacing raw bulleted string */}
          <div className="flex items-center flex-wrap gap-1.5 mb-2">
            {telemetrySpecs.map((spec, idx) => (
              <span 
                key={idx} 
                className="font-mono text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#161924] border border-[#1E2230] text-slate-300"
              >
                [{spec}]
              </span>
            ))}
          </div>

          {/* Title in Crisp Clean White */}
          <h3 className="font-bold text-xs sm:text-sm text-white leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2 min-h-[2.5rem] mb-2">
            {lang === 'bn' ? product.titleBn : product.title}
          </h3>

          {/* Genuine Ratings & Review Count (Raw internal P01/P02 code removed completely) */}
          {product.rating && (
            <div className="flex items-center gap-1.5 mb-2.5 text-xs">
              <div className="flex items-center text-amber-400">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="ml-1 font-mono font-bold text-[11px] text-amber-300">{product.rating}</span>
              </div>
              {product.reviewCount && (
                <span className="font-mono text-[10px] text-slate-400">
                  ({product.reviewCount} reviews)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bottom Price & Cyan Agent Add to Cart Button */}
        <div className="pt-2.5 border-t border-[#1E2230] mt-auto flex items-center justify-between gap-1.5">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-base sm:text-lg font-black text-white tracking-tight">
                {currencySymbol}{product.price.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="font-mono text-[11px] text-slate-500 line-through">
                  {currencySymbol}{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {/* Engineered JetBrains Mono Warranty Pill */}
            <div className="inline-flex items-center gap-1 font-mono text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded max-w-[125px] sm:max-w-[145px] truncate">
              <ShieldCheck size={10} className="text-emerald-400 shrink-0" />
              <span className="truncate">{product.warranty ? product.warranty.toUpperCase() : 'QC TESTED'}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleQuickAddClick}
            disabled={isOutOfStock}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-1.5 font-bold font-mono text-xs transition-all cursor-pointer shadow-xs shrink-0 ${
              isOutOfStock 
                ? 'bg-[#161924] text-slate-500 cursor-not-allowed border border-[#1E2230]' 
                : isQuickAdded
                  ? 'bg-emerald-500 text-slate-950 border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border border-cyan-400/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-95'
            }`}
            title={isOutOfStock ? 'Sold out' : `Add ${product.title} to bag`}
            aria-label={isOutOfStock ? 'Sold out' : `Add to cart`}
          >
            {isQuickAdded ? (
              <Check size={16} />
            ) : (
              <>
                <ShoppingBag size={14} />
                <span className="hidden sm:inline">{lang === 'bn' ? 'যুক্ত করুন' : 'ADD'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
