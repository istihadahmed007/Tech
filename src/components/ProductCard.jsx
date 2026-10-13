import React from 'react';
import { Plus, Heart, Check, Zap, Info } from 'lucide-react';

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
    ? product.compatibleWith?.includes(selectedPhone)
    : true;

  const isLowStock = product.stock <= 5 && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  const handleCardKeyDown = (e) => {
    // Only trigger if key was pressed directly on the card, not on a child button
    if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onOpenDetail(product);
    }
  };

  return (
    <div 
      role="article"
      tabIndex="0"
      onKeyDown={handleCardKeyDown}
      onClick={() => onOpenDetail(product)}
      className="group relative rounded-2xl p-3.5 sm:p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer focus-visible:outline-2 focus-visible:outline-[#145CFF] focus-visible:outline-offset-2"
      style={{
        background: '#FFFFFF',
        border: '1px solid #DCE7F0',
        borderRadius: '16px',
        boxShadow: '0 4px 18px -2px rgba(16, 38, 61, 0.04)'
      }}
      aria-label={`${product.title}, ${currencySymbol}${product.price}`}
    >
      {/* Top Media Display Pedestal */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3.5 bg-[#EAF4FC] p-3 flex items-center justify-center">
        <img
          src={product.image}
          alt={lang === 'bn' ? product.titleBn : product.title}
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#145CFF] text-white shadow-xs">
              {product.badge}
            </span>
          )}
          {isLowStock && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs">
              {t.lowStock} ({product.stock})
            </span>
          )}
        </div>

        {/* Wishlist Button with event isolation */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
            }
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 focus-visible:ring-2 focus-visible:ring-pink-500 ${
            isWishlisted 
              ? 'bg-pink-500 text-white shadow-md' 
              : 'bg-white/85 backdrop-blur-md text-[#4B637B] hover:text-pink-500 hover:bg-white'
          }`}
          aria-label={isWishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* Active Phone Compatibility Indicator Pill */}
        {selectedPhone && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10">
            {isCompatible ? (
              <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-800 bg-emerald-50/95 backdrop-blur-md border border-emerald-200 px-2.5 py-1 rounded-full shadow-2xs w-fit">
                <Check size={12} className="text-emerald-600 stroke-[3]" />
                <span>Fits {selectedPhone}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-slate-600 bg-slate-100/95 backdrop-blur-md border border-slate-200 px-2.5 py-1 rounded-full shadow-2xs w-fit">
                <span>Check model fit</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-grow justify-between">
        <div>
          {/* Honest Catalog Specification Badge */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              {product.category}
            </span>
            <span className="text-[10px] text-slate-300">•</span>
            <span className={`text-[11px] font-medium ${product.stock > 0 ? 'text-emerald-700' : 'text-slate-500'}`}>
              {product.stock > 0 ? t.inStock : t.outOfStock}
            </span>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md ml-auto" title="Sample catalog item for demonstration">
              Demo item
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-xs sm:text-sm md:text-base text-[#10263D] leading-snug group-hover:text-[#145CFF] transition-colors line-clamp-2 mb-2">
            {lang === 'bn' ? product.titleBn : product.title}
          </h3>

          {/* Color Variant Dots Preview */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              {product.variants.map((v) => (
                <span
                  key={v.id}
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-black/10 shadow-inner"
                  style={{ backgroundColor: v.hex }}
                  title={v.name}
                />
              ))}
              <span className="text-[10px] sm:text-[11px] text-[#8FA6BE] ml-1">
                {product.variants.length} finishes
              </span>
            </div>
          )}
        </div>

        {/* Price & Quick Add Button */}
        <div className="flex items-center justify-between pt-3 border-t border-[#DCE7F0] mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg md:text-xl font-extrabold text-[#10263D]">
                {currencySymbol}{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[11px] sm:text-xs text-[#8FA6BE] line-through">
                  {currencySymbol}{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {/* Show sample stock count without unverified warranties */}
            <span className="text-[10px] font-medium text-slate-500 block truncate max-w-[130px]">
              {product.stock > 0 ? `Stock: ${product.stock} (Demo)` : 'Out of stock'}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
              }
            }}
            disabled={isOutOfStock}
            className={`btn-quick-add ${isOutOfStock ? 'is-disabled' : ''}`}
            title={`Add ${product.title} to bag`}
            aria-label={`Quick add ${product.title} to bag`}
          >
            <Plus size={15} />
            <span>{lang === 'bn' ? 'যোগ করুন' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
