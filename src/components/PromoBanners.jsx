import React from 'react';
import { Zap, ShieldCheck, ArrowRight, Smartphone } from 'lucide-react';

export default function PromoBanners({
  onAddFreeDeliveryKit,
  onScrollToFinder,
  onOpenSupport,
  lang = 'en'
}) {
  return (
    <section id="promo-banners" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Left Promo Banner: Auto-Optimized Free Delivery Bundle (Matches Reference Left Card) */}
        <div 
          onClick={onAddFreeDeliveryKit}
          className="promo-banner-gradient rounded-3xl p-7 text-white flex items-center gap-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
          role="button"
          tabIndex="0"
          aria-label="Student and Commute Tech Kit with Free Delivery"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Zap size={32} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-widest bg-white/25 px-2.5 py-0.5 rounded-full border border-white/30 backdrop-blur-xs font-semibold">
              {lang === 'bn' ? 'ফ্রি ডেলিভারি বান্ডিল' : 'Free Delivery Bundle • Save ৳840'}
            </span>
            <h3 className="text-sm sm:text-base font-extrabold mt-2 leading-snug drop-shadow-2xs">
              {lang === 'bn' 
                ? 'স্টুডেন্ট ও অফিস টেক কিট — ফ্রি ডেলিভারি আনলকড (৳২,০১০)' 
                : 'Student & Commute Tech Kit — Auto-Optimized for Free Delivery (৳2,010)'}
            </h3>
            <p className="text-xs text-white/85 mt-1 font-medium">
              {lang === 'bn'
                ? 'টিডব্লিউএস + ৪-ইন-১ ক্যাবল + স্মার্টওয়াচ ও রিম্যাক্স ক্যাবল এক সাথে'
                : 'Click to auto-load TWS + 4-in-1 Cable + Smartwatch + REMAX Cable to bag'}
            </p>
          </div>
        </div>

        {/* Right Promo Banner: Verified Compatibility & Genuine Warranty (Matches Reference Right Card) */}
        <div 
          onClick={onScrollToFinder}
          className="promo-banner-gradient rounded-3xl p-7 text-white flex items-center justify-between gap-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
          role="button"
          tabIndex="0"
          aria-label="Verified device compatibility"
        >
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-widest bg-white/25 px-2.5 py-0.5 rounded-full border border-white/30 backdrop-blur-xs font-semibold">
              {lang === 'bn' ? '১০০% কিউসি ভেরিফায়েড' : '100% QC Inspected • Verified Fit'}
            </span>
            <h3 className="text-sm sm:text-base font-extrabold mt-2 leading-snug drop-shadow-2xs">
              {lang === 'bn'
                ? 'অ্যাপল, স্যামসাং, পিক্সেল ও শাওমি এর জন্য নিশ্চিত ফিট'
                : 'Verified Device Compatibility for Apple, Samsung, Pixel & Xiaomi'}
            </h3>
            <p className="text-xs text-white/85 mt-1 font-medium">
              {lang === 'bn'
                ? 'ক্যাশ অন ডেলিভারি, বিকাশ ও নগদ সাপোর্টেড সারা বাংলাদেশে'
                : 'Cash on Delivery, bKash & Nagad supported with 7-30 day replacement'}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Smartphone size={32} className="text-white" />
          </div>
        </div>

      </div>
    </section>
  );
}
