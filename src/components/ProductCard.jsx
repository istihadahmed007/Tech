import React from 'react';
import { Star, Plus, Heart, Check, ShieldCheck, Zap } from 'lucide-react';

export default function ProductCard({ 
  product, 
  currencySymbol = "৳", 
  onQuickAdd, 
  onOpenDetail, 
  isWishlisted, 
  onToggleWishlist,
  selectedPhone,
  t,
  lang 
}) {
  const isCompatible = selectedPhone 
    ? product.compatibleWith.includes(selectedPhone)
    : true;

  const isLowStock = product.stock <= 5 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  return (
    <div 
      className="group relative rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.015] hover:shadow-xl cursor-pointer"
      style={{
        background: 'rgba(248, 252, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(37, 99, 235, 0.12)',
        boxShadow: '0 8px 30px -4px rgba(17, 42, 67, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.9)'
      }}
      onClick={() => onOpenDetail(product)}
    >
      {/* Top Media Display Pedestal */}
      <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-blue-50/80 to-blue-100/40 p-3 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-600 text-white shadow-sm">
              {product.badge}
            </span>
          )}
          {isLowStock && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-sm">
              {t.lowStock} ({product.stock})
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
            isWishlisted 
              ? 'bg-pink-500 text-white shadow-md' 
              : 'bg-white/80 backdrop-blur-md text-[#4B637B] hover:text-pink-500 hover:bg-white'
          }`}
          aria-label="Wishlist toggle"
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* Active Phone Compatibility Indicator Pill */}
        {selectedPhone && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10">
            {isCompatible ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50/90 backdrop-blur-md border border-emerald-200/80 px-2.5 py-1 rounded-full shadow-sm w-fit">
                <Check size={12} className="text-emerald-600 stroke-[3]" />
                <span>Fits {selectedPhone}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100/90 backdrop-blur-md border border-slate-200 px-2.5 py-1 rounded-full shadow-sm w-fit">
                <span>Check model fit</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-grow justify-between">
        <div>
          {/* Rating & Review Count */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center text-amber-500">
              <Star size={13} fill="currentColor" />
            </div>
            <span className="text-xs font-bold text-[#112A43]">
              {product.rating}
            </span>
            <span className="text-xs text-[#8FA6BE]">
              ({product.reviewCount})
            </span>
            <span className="text-[10px] text-slate-300">•</span>
            <span className="text-[11px] font-medium text-emerald-600">
              {product.stock > 0 ? t.inStock : t.outOfStock}
            </span>
          </div>

          {/* Title */}
          <h4 className="font-bold text-sm sm:text-base text-[#112A43] leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
            {lang === 'bn' ? product.titleBn : product.title}
          </h4>

          {/* Color Variant Dots Preview */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              {product.variants.map((v) => (
                <span
                  key={v.id}
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-inner"
                  style={{ backgroundColor: v.hex }}
                  title={v.name}
                />
              ))}
              <span className="text-[11px] text-[#8FA6BE] ml-1">
                {product.variants.length} finishes
              </span>
            </div>
          )}
        </div>

        {/* Price & Quick Add Button */}
        <div className="flex items-center justify-between pt-3 border-t border-blue-100/80 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-[#112A43]">
                {currencySymbol}{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-[#8FA6BE] line-through">
                  {currencySymbol}{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium text-blue-600 block">
              Official Warranty
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isOutOfStock 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-blue-500/20'
            }`}
            title="Add to Shopping Bag"
            aria-label={`Quick Add ${product.title}`}
          >
            <Plus size={15} />
            <span className="hidden xs:inline">{t.quickAdd}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
