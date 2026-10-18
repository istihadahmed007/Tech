import React from 'react';
import { ShoppingBag, Truck, Check, Sparkles } from 'lucide-react';
import { FEATURED_BUNDLES } from '../data/catalog';

export default function BundleDeals({ onAddBundle, lang = 'en', t = {} }) {
  if (!FEATURED_BUNDLES || FEATURED_BUNDLES.length === 0) return null;

  return (
    <section 
      className="w-full my-8 sm:my-12 p-6 sm:p-8 rounded-3xl relative overflow-hidden bg-white border border-[#E2E8F0] shadow-sm"
      aria-label="Smart Free Delivery Bundles"
    >
      {/* Decorative Subtle Background Element */}
      <div 
        className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20" 
        style={{ background: 'radial-gradient(circle, #BFDBFE 0%, transparent 70%)' }} 
      />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#145CFF] text-xs font-bold mb-2">
            <Sparkles size={13} />
            <span>{lang === 'bn' ? 'স্পেশাল ভ্যালু ডিল' : 'Special Value Deals'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            {t.bundlesTitle || (lang === 'bn' ? 'স্মার্ট ফ্রি ডেলিভারি বান্ডিল' : 'Smart Free Delivery Bundles')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium max-w-2xl">
            {t.bundlesSubtitle || (lang === 'bn' 
              ? '৳২,০০০+ স্পেশাল কম্বো প্যাক — সারা দেশে ডেলিভারি সম্পূর্ণ ফ্রি!' 
              : 'Engineered combo packages that automatically unlock 100% Free Nationwide Delivery (৳2,000+)')}
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-2xs text-xs font-semibold text-emerald-700">
          <Truck size={16} className="text-emerald-600" />
          <span>{lang === 'bn' ? 'সারা বাংলাদেশে ফ্রি ডেলিভারি' : 'Free Delivery Nationwide'}</span>
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
              className="group flex flex-col justify-between bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#145CFF]/50 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1"
            >
              <div>
                {/* Image and Badges */}
                <div className="relative aspect-[16/10] bg-[#F8FAFC] p-4 flex items-center justify-center overflow-hidden border-b border-[#E2E8F0]">
                  <img
                    src={bundle.image}
                    alt={title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Top-Left Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                      <Truck size={12} />
                      {t.bundleFreeShippingBadge || (lang === 'bn' ? 'ফ্রি ডেলিভারি' : 'Free Delivery')}
                    </span>
                  </div>

                  {/* Top-Right Savings Pill */}
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#145CFF] text-white shadow-xs">
                    {(t.bundleSavings || 'Save ৳{amount}').replace('{amount}', bundle.savings.toLocaleString())}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#145CFF]">
                    {badgeText}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mt-1 line-clamp-1 min-h-[1.75rem] group-hover:text-[#145CFF] transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                    {subtitle}
                  </p>

                  {/* Included Summary */}
                  <div className="mt-4 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] min-h-[4.25rem]">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0F172A] mb-1">
                      <Check size={13} className="text-emerald-600 stroke-[3]" />
                      <span>{t.bundleIncludes || (lang === 'bn' ? 'অন্তর্ভুক্ত রয়েছে:' : 'Includes:')}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      {bundle.itemsSummary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Price & Add Button */}
              <div className="p-5 sm:p-6 pt-0 mt-auto">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-xs text-slate-500 font-medium mr-1.5">
                      {lang === 'bn' ? 'মোট:' : 'Bundle Price:'}
                    </span>
                    <span className="text-2xl font-black text-[#0F172A]">
                      ৳{bundle.price.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 line-through">
                    ৳{bundle.originalPrice.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => onAddBundle(bundle)}
                  className="w-full py-3 px-4 rounded-xl bg-[#145CFF] hover:bg-[#0D4BD9] active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <ShoppingBag size={16} />
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
