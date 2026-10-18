import React, { useMemo } from 'react';
import { History, ArrowRight, Trash2 } from 'lucide-react';
import ProductCard from './ProductCard';

export default function RecentlyViewedSection({
  products = [],
  recentIds = [],
  onClearRecents,
  currencySymbol = "৳",
  onQuickAdd,
  onOpenDetail,
  wishlistIds = [],
  onToggleWishlist,
  onToggleCompare,
  comparisonIds = [],
  lang = 'en'
}) {
  const recentProducts = useMemo(() => {
    if (!recentIds || recentIds.length === 0) return [];
    return recentIds
      .map(id => products.find(p => p.id === id))
      .filter(Boolean)
      .slice(0, 6);
  }, [recentIds, products]);

  if (recentProducts.length === 0) return null;

  return (
    <section 
      aria-label="Recently Viewed Products"
      className="w-full my-8 sm:my-12 p-4 sm:p-6 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs"
    >
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#EFF6FF] text-[#145CFF] border border-[#BFDBFE]">
            <History size={16} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">
              {lang === 'bn' ? 'সম্প্রতি দেখা পণ্যসমূহ' : 'Recently Viewed Products'}
            </h3>
            <span className="text-[11px] text-slate-500 block">
              {lang === 'bn' ? 'আপনার ব্রাউজিং হিস্টোরির ভিত্তিতে' : 'Based on your recent showroom exploration'}
            </span>
          </div>
        </div>

        {onClearRecents && (
          <button
            type="button"
            onClick={onClearRecents}
            className="text-xs text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 size={13} />
            <span>{lang === 'bn' ? 'মুছে ফেলুন' : 'Clear History'}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {recentProducts.map(product => (
          <ProductCard
            key={`recent-${product.id}`}
            product={product}
            currencySymbol={currencySymbol}
            onQuickAdd={onQuickAdd}
            onOpenDetail={onOpenDetail}
            isWishlisted={wishlistIds.includes(product.id)}
            onToggleWishlist={onToggleWishlist}
            onToggleCompare={onToggleCompare}
            isCompared={comparisonIds.includes(product.id)}
            lang={lang}
          />
        ))}
      </div>
    </section>
  );
}
