import React from 'react';
import { ShoppingBag, Truck, Check, Sparkles } from 'lucide-react';
import { FEATURED_BUNDLES } from '../data/catalog';

export default function BundleDeals({ onAddBundle, lang = 'en', t = {} }) {
  if (!FEATURED_BUNDLES || FEATURED_BUNDLES.length === 0) return null;

  return (
    <section 
      className="w-full my-8 sm:my-12 p-6 sm:p-8 rounded-3xl relative overflow-hidden bg-[#FFFFFF] border border-[#DCE8F3] shadow-sm"
      aria-label="Smart Free Delivery Bundles"
    >
      {/* Decorative Subtle Background Ambient Glow */}
      <div 
        className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20" 
        style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }} 
      />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF5FF] border border-blue-200 text-[#1684E8] text-xs font-mono font-bold mb-2">
            <Sparkles size={13} className="text-cyan-400" />
            <span>{lang === 'bn' ? 'স্পেশাল ভ্যালু ডিল' : 'ENGINEERED BUNDLES'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-mono text-[#10263D] tracking-tight">
            {t.bundlesTitle || (lang === 'bn' ? 'স্মার্ট ফ্রি ডেলিভারি বান্ডিল' : 'Smart Free Delivery Bundles')}
          </h2>
          <p className="text-xs sm:text-sm text-[#526981] mt-1 font-mono max-w-2xl">
            {t.bundlesSubtitle || (lang === 'bn' 
              ? '৳২,০০০+ স্পেশাল কম্বো প্যাক — সারা দেশে ডেলিভারি সম্পূর্ণ ফ্রি!' 
              : 'Engineered combo packages that automatically unlock 100% Free Nationwide Delivery (৳2,000+)')}
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#EBF5FF] border border-emerald-500/30 shadow-xs text-xs font-mono font-semibold text-emerald-700">
          <Truck size={15} />
          <span>{lang === 'bn' ? 'সারা বাংলাদেশে ফ্রি ডেলিভারি' : 'FREE NATIONWIDE DELIVERY'}</span>
        </div>
      </div>

      {/* 4 Bundle Cards */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {FEATURED_BUNDLES.map((bundle) => {
          const title = lang === 'bn' ? (bundle.titleBn || bundle.title) : bundle.title;
          const subtitle = lang === 'bn' ? (bundle.subtitleBn || bundle.subtitle) : bundle.subtitle;
          const badgeText = lang === 'bn' ? (bundle.badgeBn || bundle.badge) : bundle.badge;

          return (
            <div
              key={bundle.id}
              className="group flex flex-col justify-between bg-[#FFFFFF] rounded-2xl border border-[#DCE8F3] hover:border-[#1684E8]/40 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden hover:-translate-y-1"
            >
              <div>
                {/* Image and Badges */}
                <div className="relative aspect-[16/10] bg-[#F5F9FD] p-4 flex items-center justify-center overflow-hidden border-b border-[#DCE8F3]">
                  <img
                    src={bundle.image}
                    alt={title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Top-Left Free Shipping Badge */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <Truck size={11} />
                      {t.bundleFreeShippingBadge || (lang === 'bn' ? 'ফ্রি ডেলিভারি' : 'FREE DELIVERY')}
                    </span>
                  </div>

                  {/* Top-Right Savings Pill */}
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#EBF5FF] text-[#1684E8] border border-blue-200">
                    {(t.bundleSavings || 'Save ৳{amount}').replace('{amount}', bundle.savings.toLocaleString())}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1684E8]">
                    {badgeText}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-[#10263D] mt-1 line-clamp-1 min-h-[1.5rem] group-hover:text-[#1684E8] transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-[#526981] mt-1 leading-relaxed line-clamp-2 min-h-[2.25rem]">
                    {subtitle}
                  </p>

                  {/* Included Summary */}
                  <div className="mt-3 p-2.5 rounded-xl bg-[#F5F9FD] border border-[#DCE8F3] min-h-[3.75rem]">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#10263D] mb-0.5">
                      <Check size={12} className="text-emerald-400 stroke-[3]" />
                      <span>{t.bundleIncludes || (lang === 'bn' ? 'অন্তর্ভুক্ত রয়েছে:' : 'INCLUDES:')}</span>
                    </div>
                    <p className="text-[11px] text-[#526981] leading-snug">
                      {bundle.itemsSummary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Price & Add Button */}
              <div className="p-4 sm:p-5 pt-0 mt-auto">
                <div className="flex items-baseline justify-between mb-3 font-mono">
                  <div>
                    <span className="text-[11px] text-[#526981] mr-1.5">
                      {lang === 'bn' ? 'মোট:' : 'Total:'}
                    </span>
                    <span className="text-xl font-bold text-[#1684E8]">
                      ৳{bundle.price.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 line-through">
                    ৳{bundle.originalPrice.toLocaleString()}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onAddBundle(bundle)}
                  className="btn-soft-blue w-full py-2.5 px-3 rounded-xl text-white font-mono font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-[0.98]"
                >
                  <ShoppingBag size={14} />
                  <span>{t.addBundleToCart || (lang === 'bn' ? 'বান্ডিল ব্যাগে যুক্ত করুন' : 'Add Bundle to Bag')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
