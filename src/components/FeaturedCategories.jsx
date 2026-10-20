import React from 'react';
import { Headphones, Watch, Zap, Package, ShieldCheck, ChevronRight } from 'lucide-react';

export default function FeaturedCategories({
  selectedCategory,
  onSelectCategory,
  onShopAll,
  onOpenTracking,
  onOpenSupport,
  onScrollToBundles,
  onScrollToFinder,
  lang = 'en'
}) {
  const cards = [
    {
      id: 'audio',
      title: lang === 'bn' ? 'অডিও ও বাডস' : 'Audio & TWS',
      subtext: lang === 'bn' ? 'নয়েজ ক্যান্সেলেশন ও ব্লুটুথ' : 'ANC, Hi-Fi sound & call headsets',
      icon: Headphones,
      active: selectedCategory === 'audio',
      onClick: () => {
        if (onSelectCategory) onSelectCategory('audio');
      }
    },
    {
      id: 'wearables',
      title: lang === 'bn' ? 'স্মার্টওয়াচ' : 'Smartwatches',
      subtext: lang === 'bn' ? 'আল্ট্রা ডিসপ্লে ও হেলথ ট্র্যাকিং' : 'Ultra HD display & strap combos',
      icon: Watch,
      active: selectedCategory === 'wearables',
      onClick: () => {
        if (onSelectCategory) onSelectCategory('wearables');
      }
    },
    {
      id: 'charging',
      title: lang === 'bn' ? 'চার্জার ও ক্যাবল' : 'Cables & Power',
      subtext: lang === 'bn' ? '৬৫W/১২০W ফাস্ট চার্জিং' : '65W/120W cables & wall chargers',
      icon: Zap,
      active: selectedCategory === 'charging',
      onClick: () => {
        if (onSelectCategory) onSelectCategory('charging');
      }
    },
    {
      id: 'parcel',
      title: lang === 'bn' ? 'ফ্রি ডেলিভারি' : 'Free Parcel',
      subtext: lang === 'bn' ? '৳২,০০০+ অর্ডারে সম্পূর্ণ ফ্রি' : '100% Free courier on ৳2,000+',
      icon: Package,
      active: false,
      onClick: () => {
        if (onScrollToBundles) onScrollToBundles();
        else if (onShopAll) onShopAll();
      }
    },
    {
      id: 'warranty',
      title: lang === 'bn' ? 'কিউসি ওয়ারেন্টি' : 'QC & Warranty',
      subtext: lang === 'bn' ? '১০০% টেস্টেড ও রিপ্লেসমেন্ট' : '100% Tested with replacement',
      icon: ShieldCheck,
      active: false,
      onClick: () => {
        if (onOpenSupport) onOpenSupport();
      }
    }
  ];

  return (
    <section id="services-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Section Header: Matches "Dolor Sit Amet" & "view more >" from Reference Screenshot */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#0084FF] tracking-tight">
            {lang === 'bn' ? 'স্মার্ট শপিং ও গ্যারান্টি' : 'Smart Shopping & Guarantees'}
          </h2>
          <p className="text-xs text-slate-500 font-medium hidden sm:block">
            {lang === 'bn' ? 'নির্ভরযোগ্য ডেলিভারি, ওয়্যারেন্টি ও কাস্টমার সাপোর্ট' : 'Trusted logistics, genuine hardware grading, and local support'}
          </p>
        </div>

        <button
          type="button"
          onClick={onShopAll}
          className="text-xs font-semibold text-slate-400 hover:text-[#0084FF] flex items-center gap-1 transition cursor-pointer"
        >
          <span>{lang === 'bn' ? 'আরও দেখুন >' : 'view more >'}</span>
        </button>
      </div>

      {/* 5-Column Icon Category Grid (Exact Match to Reference Screenshot) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              onClick={c.onClick}
              className="product-card-glass rounded-2xl p-6 sm:p-7 flex flex-col items-center justify-center text-center group cursor-pointer border border-white/85 hover:border-blue-300 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50/80 text-[#7B93F5] flex items-center justify-center mb-3 group-hover:scale-110 group-hover:text-[#0084FF] transition-all">
                <Icon size={24} strokeWidth={2} />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#2574D9] group-hover:text-blue-700 transition-colors">
                {c.title}
              </span>
              <p className="text-[10px] text-slate-500 mt-1 font-medium leading-tight line-clamp-2">
                {c.subtext}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
