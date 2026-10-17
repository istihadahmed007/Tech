import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function FeaturedCategories({
  selectedCategory,
  onSelectCategory,
  onShopAll,
  lang = 'en'
}) {
  const categories = [
    {
      id: 'earbuds',
      name: lang === 'bn' ? 'ইয়ারবাডস ও টিডব্লিউএস' : 'Earbuds & TWS',
      image: '/assets/products/p01-pro-tws-white.jpg',
      itemCount: 10,
      badge: 'ANC & Bass'
    },
    {
      id: 'headphones',
      name: lang === 'bn' ? 'হেডফোন ও নেকব্যান্ড' : 'Headphones & Headsets',
      image: '/assets/products/p09-tucci-a5-fighter-headset.jpg',
      itemCount: 8,
      badge: 'Studio Sound'
    },
    {
      id: 'chargers',
      name: lang === 'bn' ? 'ফাস্ট চার্জার ও অ্যাডাপ্টার' : 'Chargers & Adapters',
      image: '/assets/products/p07-oppo-style-27w-charger.jpg',
      itemCount: 4,
      badge: 'Fast GaN'
    },
    {
      id: 'cables',
      name: lang === 'bn' ? 'ইউএসবি ও ডেটা ক্যাবল' : 'Fast USB Cables',
      image: '/assets/products/p02-remax-rc155a-cable.jpg',
      itemCount: 6,
      badge: '120W Braided'
    },
    {
      id: 'wearables',
      name: lang === 'bn' ? 'স্মার্টওয়াচ ও ব্যান্ড' : 'Smartwatches',
      image: '/assets/products/p11-y80-ultra-smartwatch.jpg',
      itemCount: 4,
      badge: 'Cellular & HD'
    },
    {
      id: 'connectivity',
      name: lang === 'bn' ? 'কানেক্টিভিটি ও ওটিজি' : 'OTG & Connectivity',
      image: '/assets/products/p08-2in1-otg-adapter.jpg',
      itemCount: 3,
      badge: 'USB 3.0'
    },
    {
      id: 'cases',
      name: lang === 'bn' ? 'ফোন কেস ও কভার' : 'Cases & Covers',
      image: '/assets/cat-cases.jpg',
      itemCount: 4,
      badge: 'Drop Proof'
    },
    {
      id: 'power-banks',
      name: lang === 'bn' ? 'পাওয়ার ব্যাংক' : 'Power Banks',
      image: '/assets/cat-powerbanks.jpg',
      itemCount: 2,
      badge: 'Heavy Battery'
    }
  ];

  return (
    <section className="w-full my-6 sm:my-8 p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl border border-[#ECECEC] shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#10263D] tracking-tight uppercase">
            {lang === 'bn' ? 'ক্যাটাগরি সমূহ' : 'CATEGORIES'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'bn' ? 'আপনার প্রয়োজনীয় অ্যাক্সেসরিজ বেছে নিন' : 'Explore verified accessories by category'}
          </p>
        </div>

        <button
          type="button"
          onClick={onShopAll}
          className="text-xs sm:text-sm font-bold text-[#EE4D2D] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>{lang === 'bn' ? 'সব পণ্য' : 'View All'}</span>
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Grid of Categories (Shopee style compact cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.id)}
              className={`p-3 rounded-lg border text-center cursor-pointer transition-all flex flex-col items-center justify-between group ${
                isSelected 
                  ? 'border-[#EE4D2D] bg-[#FFF5F1] shadow-xs ring-1 ring-[#EE4D2D]' 
                  : 'border-slate-100 hover:border-slate-300 hover:shadow-xs bg-slate-50/50 hover:bg-white'
              }`}
            >
              <div className="w-16 h-16 rounded-md overflow-hidden p-1 bg-white mb-2 flex items-center justify-center border border-slate-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <span className="text-[11px] sm:text-xs font-bold text-[#10263D] group-hover:text-[#EE4D2D] transition-colors line-clamp-1">
                {cat.name}
              </span>

              <span className="text-[10px] text-slate-400 mt-0.5">
                {cat.itemCount} items
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
