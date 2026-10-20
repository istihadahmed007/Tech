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
      className="w-full my-8 sm:my-12 p-4 sm:p-6 bg-[#12141C] rounded-2xl border border-[#1E2230] shadow-xl"
    >
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1E2230]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <History size={16} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold font-mono text-white tracking-wide uppercase">
              {lang === 'bn' ? 'সম্প্রতি দেখা পণ্যসমূহ' : 'RECENTLY INSPECTED HARDWARE'}
            </h3>
            <span className="text-[11px] font-mono text-zinc-400 block">
              {lang === 'bn' ? 'আপনার ব্রাউজিং হিস্টোরির ভিত্তিতে' : 'Preserved cache from your current session'}
            </span>
          </div>
        </div>

        {onClearRecents && (
          <button
            type="button"
            onClick={onClearRecents}
            className="text-xs font-mono text-zinc-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 size={13} />
            <span>{lang === 'bn' ? 'মুছে ফেলুন' : 'Clear Cache'}</span>
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
