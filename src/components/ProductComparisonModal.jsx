import React, { useState, useMemo } from 'react';
import { 
  X, 
  Scale, 
  Check, 
  Minus, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Trash2,
  SlidersHorizontal,
  ChevronRight,
  Plus
} from 'lucide-react';
import { calculateDeliveryFee } from '../utils/pricing';

export default function ProductComparisonModal({
  isOpen,
  onClose,
  comparisonProducts = [],
  onRemoveProduct,
  onClearAll,
  onAddToCart,
  onAddAllToCart,
  onOpenDetail,
  currencySymbol = "৳",
  lang = 'en',
  t = {}
}) {
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);

  // Union of all spec keys across all compared products
  const allSpecKeys = useMemo(() => {
    const keysSet = new Set();
    comparisonProducts.forEach(prod => {
      if (prod.specs && typeof prod.specs === 'object') {
        Object.keys(prod.specs).forEach(k => keysSet.add(k));
      }
    });
    return Array.from(keysSet);
  }, [comparisonProducts]);

  // Total cost calculation
  const totalCost = useMemo(() => {
    return comparisonProducts.reduce((sum, p) => sum + (p.price || 0), 0);
  }, [comparisonProducts]);

  const deliveryFeeInsideDhaka = useMemo(() => {
    return calculateDeliveryFee(totalCost, false);
  }, [totalCost]);

  const qualifiesFreeDelivery = totalCost >= 2000;

  // Filter spec keys based on "show only differences"
  const visibleSpecKeys = useMemo(() => {
    if (!showDifferencesOnly) return allSpecKeys;

    return allSpecKeys.filter(key => {
      const firstVal = comparisonProducts[0]?.specs?.[key] || '—';
      // Check if any product has a different value
      return comparisonProducts.some(p => (p.specs?.[key] || '—') !== firstVal);
    });
  }, [allSpecKeys, comparisonProducts, showDifferencesOnly]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Product Comparison Matrix"
    >
      <div className="bg-[#F8FAFC] rounded-3xl border border-[#E2E8F0] shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-6 bg-white border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#EFF6FF] text-[#145CFF] border border-[#BFDBFE]">
              <Scale size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#0F172A] flex items-center gap-2">
                <span>{t.compareTitle || (lang === 'bn' ? 'প্রোডাক্ট তুলনা ম্যাট্রিক্স' : 'Product Comparison Matrix')}</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-50 border border-[#E2E8F0] text-slate-500">
                  {comparisonProducts.length}/4
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {t.compareSubtitle || (lang === 'bn' ? 'পাশাপাশি টেকনিক্যাল স্পেসিফিকেশন ও মোট খরচ তুলনা করুন।' : 'Side-by-side technical specs, availability, warranty and total package cost.')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Show only differences toggle */}
            {comparisonProducts.length > 1 && (
              <label className="flex items-center gap-2 text-xs font-bold text-[#0F172A] cursor-pointer select-none bg-slate-50 px-3 py-1.5 rounded-xl border border-[#E2E8F0] hover:border-[#145CFF]">
                <input
                  type="checkbox"
                  checked={showDifferencesOnly}
                  onChange={(e) => setShowDifferencesOnly(e.target.checked)}
                  className="rounded text-[#145CFF] focus:ring-[#145CFF] cursor-pointer"
                />
                <span>{t.compareDiffOnly || (lang === 'bn' ? 'শুধু অমিলগুলো দেখান' : 'Show Only Differences')}</span>
              </label>
            )}

            {comparisonProducts.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 px-2 py-1.5 cursor-pointer"
                title="Clear all comparison items"
              >
                {t.compareClearAll || (lang === 'bn' ? 'খালি করুন' : 'Clear All')}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-50 border border-[#E2E8F0] hover:border-[#145CFF] text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close comparison modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
          {comparisonProducts.length === 0 ? (
            <div className="text-center py-16 px-4 max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-slate-400">
                <Scale size={28} />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-1">
                {lang === 'bn' ? 'তুলনার জন্য কোনো পণ্য নির্বাচিত নেই' : 'No Products Selected for Comparison'}
              </h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                {t.compareEmpty || (lang === 'bn' 
                  ? 'ক্যাটালগ ঘুরে যেকোনো প্রোডাক্ট কার্ডের তুলনা আইকনে ক্লিক করে সর্বোচ্চ ৪টি পণ্য পাশাপাশি তুলনা করুন।' 
                  : 'Click the scale icon on any product card in the showroom to compare up to 4 devices side by side.')}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="bg-[#145CFF] hover:bg-[#0D4BD9] text-white text-xs font-bold py-2.5 px-6 rounded-xl mx-auto cursor-pointer transition-colors shadow-sm"
              >
                {lang === 'bn' ? 'প্রোডাক্ট দেখুন' : 'Explore Showroom'}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr>
                    <th className="p-3 w-40 sm:w-48 bg-white/70 rounded-l-2xl border-b border-[#E2E8F0] text-xs font-mono font-bold text-slate-500 uppercase tracking-wider align-bottom">
                      {lang === 'bn' ? 'পণ্য বিবরণী' : 'Product Overview'}
                    </th>
                    {comparisonProducts.map(prod => (
                      <th key={prod.id} className="p-3 bg-white border-b border-[#E2E8F0] align-top min-w-[200px] max-w-[240px]">
                        <div className="flex flex-col h-full justify-between">
                          <div>
                            <div className="relative aspect-square w-full rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3 mb-2.5 flex items-center justify-center">
                              <img
                                src={prod.image}
                                alt={prod.title}
                                className="w-full h-full object-contain"
                              />
                              <button
                                type="button"
                                onClick={() => onRemoveProduct(prod.id)}
                                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white border border-[#E2E8F0] text-slate-400 hover:text-rose-600 hover:border-rose-300 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                                title="Remove from comparison"
                              >
                                <X size={12} />
                              </button>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                              {prod.brand} • {prod.category}
                            </span>
                            <h4 
                              onClick={() => {
                                onClose();
                                if (onOpenDetail) onOpenDetail(prod);
                              }}
                              className="text-xs sm:text-sm font-bold text-[#0F172A] hover:text-[#145CFF] cursor-pointer line-clamp-2 mb-2"
                            >
                              {lang === 'bn' ? prod.titleBn : prod.title}
                            </h4>
                          </div>

                          <div className="pt-2 border-t border-[#E2E8F0] mt-auto">
                            <div className="text-base font-black text-[#0F172A] mb-2">
                              {currencySymbol}{prod.price.toLocaleString()}
                            </div>
                            <button
                              type="button"
                              onClick={() => onAddToCart(prod, prod.variants?.[0], 1)}
                              disabled={prod.stock <= 0}
                              className="bg-[#145CFF] hover:bg-[#0D4BD9] text-white font-bold w-full text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                            >
                              <ShoppingBag size={13} />
                              <span>{lang === 'bn' ? 'ব্যাগে যোগ' : 'Add to Bag'}</span>
                            </button>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E2E8F0] text-xs">
                  {/* Stock Availability Row */}
                  <tr>
                    <td className="p-3 font-bold text-[#0F172A] bg-white/50">
                      {lang === 'bn' ? 'স্টক স্থিতি' : 'Stock Availability'}
                    </td>
                    {comparisonProducts.map(prod => (
                      <td key={prod.id} className="p-3 bg-white font-semibold">
                        {prod.stock > 0 ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <Check size={12} className="stroke-[3]" />
                            <span>{lang === 'bn' ? `${prod.stock}টি স্টকে আছে` : `${prod.stock} units in stock`}</span>
                          </span>
                        ) : (
                          <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            {lang === 'bn' ? 'স্টক শেষ' : 'Sold Out'}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Warranty & Guarantee Row */}
                  <tr>
                    <td className="p-3 font-bold text-[#0F172A] bg-white/50">
                      {lang === 'bn' ? 'ওয়ারেন্টি ও নীতি' : 'Warranty & Policy'}
                    </td>
                    {comparisonProducts.map(prod => (
                      <td key={prod.id} className="p-3 bg-white text-slate-600">
                        <span className="font-semibold text-[#0F172A] block">
                          {prod.warranty || (lang === 'bn' ? '৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি' : '7-Day Replacement')}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {lang === 'bn' ? 'ঢাকা স্টোরফ্রন্টে যাচাইকৃত' : 'Dhaka Verified Quality'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Device Compatibility Row */}
                  <tr>
                    <td className="p-3 font-bold text-[#0F172A] bg-white/50">
                      {lang === 'bn' ? 'ডিভাইস কমপ্যাটিবিলিটি' : 'Device Compatibility'}
                    </td>
                    {comparisonProducts.map(prod => (
                      <td key={prod.id} className="p-3 bg-white text-slate-600">
                        {Array.isArray(prod.compatibleWith) && prod.compatibleWith.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {prod.compatibleWith.map((c, i) => (
                              <span key={i} className="text-[10px] font-medium bg-slate-50 border border-[#E2E8F0] px-1.5 py-0.5 rounded text-slate-600">
                                {c}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400">{lang === 'bn' ? 'সর্বজনীন ব্লুটুথ / টাইপ-সি' : 'Universal Bluetooth / Type-C'}</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Technical Specifications Rows */}
                  {visibleSpecKeys.map(key => (
                    <tr key={key}>
                      <td className="p-3 font-bold text-[#0F172A] bg-white/50">
                        {key}
                      </td>
                      {comparisonProducts.map(prod => {
                        const val = prod.specs?.[key] || '—';
                        return (
                          <td key={prod.id} className="p-3 bg-white text-slate-600 leading-relaxed">
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Bottom: Total-Cost Comparison & Bulk Add */}
        {comparisonProducts.length > 0 && (
          <div className="p-4 sm:p-6 bg-white border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#EFF6FF] text-[#145CFF] border border-[#BFDBFE]">
                <Truck size={20} className={qualifiesFreeDelivery ? "text-emerald-600" : "text-[#145CFF]"} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {t.compareTotalCost || (lang === 'bn' ? 'সম্মিলিত প্যাকেজ মূল্য:' : 'Combined Package Total:')}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-black text-[#0F172A]">
                    {currencySymbol}{totalCost.toLocaleString()}
                  </span>
                  {qualifiesFreeDelivery ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      🎉 {lang === 'bn' ? 'ফ্রি ডেলিভারি প্রযোজ্য' : 'Free Nationwide Delivery Unlocked'}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">
                      {lang === 'bn' ? `(ঢাকা ডেলিভারি ৳${deliveryFeeInsideDhaka})` : `(Dhaka Delivery ৳${deliveryFeeInsideDhaka})`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-xs font-bold text-[#0F172A] hover:border-[#145CFF] transition-colors cursor-pointer w-full sm:w-auto"
              >
                {lang === 'bn' ? 'তুলনা বন্ধ করুন' : 'Close Matrix'}
              </button>

              {onAddAllToCart && (
                <button
                  type="button"
                  onClick={() => onAddAllToCart(comparisonProducts)}
                  className="bg-[#145CFF] hover:bg-[#0D4BD9] text-white text-xs font-bold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto shadow-md transition-colors cursor-pointer"
                >
                  <ShoppingBag size={15} />
                  <span>{lang === 'bn' ? 'সবগুলো ব্যাগে যুক্ত করুন' : `Add All (${comparisonProducts.length}) to Bag`}</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
