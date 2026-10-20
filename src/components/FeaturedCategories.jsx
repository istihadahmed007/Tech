import React from 'react';
import { MapPin, MessageSquare, BadgePercent, Package, Clock, ChevronRight } from 'lucide-react';

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
      id: 'track',
      title: lang === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Track BD',
      subtext: lang === 'bn' ? 'ঢাকা ২৪-৪৮ঘ • সারা দেশ ২-৪ দিন' : 'Dhaka 24-48h • Nationwide 2-4 Days',
      icon: MapPin,
      onClick: () => {
        if (onOpenTracking) onOpenTracking();
        else if (onOpenSupport) onOpenSupport();
      }
    },
    {
      id: 'matcher',
      title: lang === 'bn' ? 'স্মার্ট ম্যাচিং' : 'AI Matcher',
      subtext: lang === 'bn' ? 'ফোন ও চার্জার কম্প্যাটিবিলিটি' : 'Instant phone & accessory matching',
      icon: MessageSquare,
      onClick: () => {
        if (onScrollToFinder) onScrollToFinder();
        else if (onSelectCategory) onSelectCategory('audio');
      }
    },
    {
      id: 'deals',
      title: lang === 'bn' ? 'ফ্ল্যাশ ডিলস' : 'Flash Deals',
      subtext: lang === 'bn' ? 'বিশেষ ডিসকাউন্ট ও অফার' : 'Limited-time discounts & clearance',
      icon: BadgePercent,
      onClick: () => {
        if (onSelectCategory) onSelectCategory('charging');
        else if (onShopAll) onShopAll();
      }
    },
    {
      id: 'parcel',
      title: lang === 'bn' ? 'ফ্রি ডেলিভারি' : 'Free Parcel',
      subtext: lang === 'bn' ? '৳২,০০০+ অর্ডারে সম্পূর্ণ ফ্রি' : '100% Free courier on ৳2,000+',
      icon: Package,
      onClick: () => {
        if (onScrollToBundles) onScrollToBundles();
        else if (onShopAll) onShopAll();
      }
    },
    {
      id: 'warranty',
      title: lang === 'bn' ? '৭-৩০ দিন ওয়ারেন্টি' : 'Fast Dispatch',
      subtext: lang === 'bn' ? 'কিউসি টেস্টেড ও রিপ্লেসমেন্ট' : '100% QC tested & replacement warranty',
      icon: Clock,
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
