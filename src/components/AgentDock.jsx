import React from 'react';
import { ShoppingBag, Scale, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

export default function AgentDock({
  cart = [],
  comparisonIds = [],
  onOpenCart,
  onOpenCheckout,
  onOpenComparison,
  currencySymbol = "৳",
  lang = 'en'
}) {
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const comparisonCount = comparisonIds.length;

  // Only render when customer has active selections
  if (cartCount === 0 && comparisonCount === 0) {
    return null;
  }

  const FREE_DELIVERY_THRESHOLD = 2000;
  const isFreeDelivery = cartTotal >= FREE_DELIVERY_THRESHOLD;
  const shortfall = Math.max(0, FREE_DELIVERY_THRESHOLD - cartTotal);
  const progressPercent = Math.min(100, Math.round((cartTotal / FREE_DELIVERY_THRESHOLD) * 100));

  return (
    <aside
      className="fixed bottom-4 inset-x-0 mx-auto max-w-2xl w-[94%] z-40 bg-white/95 backdrop-blur-xl border border-blue-200 rounded-2xl shadow-[0_12px_40px_rgba(20,50,120,0.16)] p-3 transition-all duration-300 animate-fadeIn text-slate-800"
      aria-label="Agent Cart and Comparison Dock"
    >
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Telemetry & Free Delivery Progress */}
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-slate-700 truncate">
              {cartCount > 0 ? (
                isFreeDelivery ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} className="inline shrink-0 text-emerald-500" />
                    <span>{lang === 'bn' ? '১০০% ফ্রি ডেলিভারি আনলকড!' : '100% FREE NATIONWIDE DELIVERY'}</span>
                  </span>
                ) : (
                  <span className="text-slate-600">
                    {lang === 'bn' 
                      ? `আর ${currencySymbol}${shortfall.toLocaleString()} হলেই ফ্রি ডেলিভারি` 
                      : `Add ${currencySymbol}${shortfall.toLocaleString()} for Free Delivery`}
                  </span>
                )
              ) : (
                <span className="text-blue-600 font-medium">
                  {lang === 'bn' ? `${comparisonCount}টি পণ্য তুলনা তালিকায়` : `${comparisonCount} items in comparison matrix`}
                </span>
              )}
            </span>
          </div>

          {/* Micro Progress Bar (only if cart has items) */}
          {cartCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-24 sm:w-36 bg-blue-100 border border-blue-200/60 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${isFreeDelivery ? 'bg-emerald-500 shadow-xs' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-500 shrink-0 font-semibold">
                {progressPercent}%
              </span>
            </div>
          )}
        </div>

        {/* Center / Right: Interactive Triggers */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Compare Matrix Trigger (if any items selected) */}
          {comparisonCount > 0 && (
            <button
              type="button"
              onClick={onOpenComparison}
              className="px-2.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer hover:bg-blue-100"
              title="Open Device & Spec Comparison Matrix"
              aria-label={`Compare ${comparisonCount} items`}
            >
              <Scale size={13} className="text-blue-600" />
              <span>{comparisonCount}</span>
              <span className="hidden sm:inline">{lang === 'bn' ? 'তুলনা' : 'Compare'}</span>
            </button>
          )}

          {/* Cart / Checkout Trigger */}
          {cartCount > 0 ? (
            <button
              type="button"
              onClick={onOpenCheckout || onOpenCart}
              className="btn-soft-blue text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
              aria-label="Proceed to Checkout"
            >
              <ShoppingBag size={14} className="shrink-0" />
              <div className="flex items-center gap-1.5 font-mono">
                <span>{currencySymbol}{cartTotal.toLocaleString()}</span>
                <span className="text-blue-100 text-[10px] hidden sm:inline">({cartCount})</span>
              </div>
              <ArrowRight size={13} className="shrink-0 hidden xs:inline" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenComparison}
              className="px-3.5 py-1.5 rounded-xl btn-soft-blue text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{lang === 'bn' ? 'ম্যাট্রিক্স দেখুন' : 'View Matrix'}</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
