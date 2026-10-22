import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function PromoBanners({
  onAddFreeDeliveryKit,
  onScrollToFinder,
  onOpenSupport,
  lang = 'en'
}) {
  const handleAction = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    } else if (onAddFreeDeliveryKit) {
      onAddFreeDeliveryKit();
    }
  };

  return (
    <section id="promo-banners" className="w-full my-12 sm:my-16">
      {/* Full-Width Blue Promotional Band matching Reference Layout */}
      <div className="promo-banner-gradient w-full overflow-hidden text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Left Copy Column */}
            <div className="flex flex-col items-start text-left z-10 max-w-xl">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest bg-white/15 px-3 py-1 rounded-full border border-white/20 backdrop-blur-xs font-semibold mb-3">
                <Sparkles size={12} className="text-blue-300" />
                <span>{lang === 'bn' ? 'স্মার্ট গ্যাজেট ডিল' : 'Special Showcase'}</span>
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-[1.15]">
                {lang === 'bn' ? 'আপনার প্রযুক্তি জীবনকে উন্নত করুন' : 'Upgrade Your Tech Life'}
              </h2>

              <p className="text-sm sm:text-base text-blue-100/90 mt-3 font-normal leading-relaxed">
                {lang === 'bn' 
                  ? 'সর্বশেষ গ্যাজেট আবিষ্কার করুন এবং আপনার প্রতিদিনের রুটিনকে উন্নত করুন।' 
                  : 'Discover the latest gadgets and elevate your everyday routine.'}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handleAction}
                  className="bg-white hover:bg-slate-100 text-[#0F172A] font-bold text-xs sm:text-sm px-7 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 cursor-pointer transform hover:scale-102"
                >
                  <span>{lang === 'bn' ? 'এখনই কিনুন' : 'Shop Now'}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Right Media Column: Clean Gadget Lineup Visual */}
            <div className="relative flex items-center justify-center md:justify-end">
              <div className="relative w-full max-w-lg aspect-16/9 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                <img
                  src="/assets/promo-upgrade-devices.jpg"
                  alt="Modern electronics showcase with laptop, smartphone, smartwatch and headphones"
                  width={960}
                  height={540}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-black/30 pointer-events-none" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
