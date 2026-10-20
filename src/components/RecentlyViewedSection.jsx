import React, { useMemo } from 'react';
import { History, Trash2 } from 'lucide-react';
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
    
    // Strict deduplication of product IDs and models
    const uniqueIds = Array.from(new Set(recentIds));
    const seenProductIds = new Set();
    const seenModelKeys = new Set();
    const list = [];

    for (const id of uniqueIds) {
      const p = products.find(prod => prod.id === id);
      if (!p) continue;
      
      const pId = String(p.id);
      if (seenProductIds.has(pId)) continue;

      const modelKey = `${(p.brand || '').toLowerCase()}::${(p.model || p.title || '').toLowerCase()}`;
      if (p.brand && (p.model || p.title) && seenModelKeys.has(modelKey)) continue;

      seenProductIds.add(pId);
      seenModelKeys.add(modelKey);
      list.push(p);
      if (list.length >= 6) break;
    }

    return list;
  }, [recentIds, products]);

  if (recentProducts.length === 0) return null;

  return (
    <section 
      aria-label="Recently Viewed Products"
      className="w-full my-8 sm:my-12 p-4 sm:p-6 bg-[#FFFFFF] rounded-2xl border border-[#DCE8F3] shadow-sm"
    >
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#DCE8F3]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#EBF5FF] text-[#1684E8] border border-[#DCE8F3]">
            <History size={16} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold font-mono text-[#10263D] tracking-wide uppercase">
              {lang === 'bn' ? 'সম্প্রতি দেখা পণ্যসমূহ' : 'RECENTLY INSPECTED HARDWARE'}
            </h3>
            <span className="text-[11px] font-mono text-[#526981] block">
              {lang === 'bn' ? 'আপনার ব্রাউজিং হিস্টোরির ভিত্তিতে' : 'Preserved cache from your current session'}
            </span>
          </div>
        </div>

        {onClearRecents && (
          <button
            type="button"
            onClick={onClearRecents}
            className="text-xs font-mono text-[#526981] hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
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
