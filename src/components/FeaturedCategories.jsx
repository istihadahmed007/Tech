import React from 'react';
import { ChevronRight, Layers } from 'lucide-react';

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
      name: lang === 'bn' ? 'হেডফোন ও নেকব্যান্ড' : 'Headphones',
      image: '/assets/products/p09-tucci-a5-fighter-headset.jpg',
      itemCount: 8,
      badge: 'Studio Sound'
    },
    {
      id: 'chargers',
      name: lang === 'bn' ? 'ফাস্ট চার্জার' : 'Fast Chargers',
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
      name: lang === 'bn' ? 'কানেক্টিভিটি ও ওটিজি' : 'OTG & Hubs',
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
    <section className="w-full my-6 sm:my-8 p-4 sm:p-6 bg-[#12141C] rounded-2xl border border-[#1E2230] shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1E2230]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Layers size={15} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold font-mono text-white tracking-wide uppercase">
              {lang === 'bn' ? 'ক্যাটাগরি সমূহ' : 'HARDWARE CATEGORIES'}
            </h2>
            <p className="text-[11px] text-zinc-400 font-mono">
              {lang === 'bn' ? 'আপনার প্রয়োজনীয় গ্যাজেট সিলেক্ট করুন' : 'Explore verified engineering gear by category'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onShopAll}
          className="text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>{lang === 'bn' ? 'সব পণ্য' : 'View Master Catalog'}</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Grid of Categories (Obsidian Bento Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.id)}
              className={`p-3 rounded-xl border text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-between group ${
                isSelected 
                  ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50' 
                  : 'border-[#1E2230] hover:border-cyan-500/40 bg-[#0B0D14] hover:bg-[#161924]'
              }`}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden p-1.5 bg-[#12141C] mb-2 flex items-center justify-center border border-[#1E2230] group-hover:border-cyan-500/30 transition-colors">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <span className="text-[11px] sm:text-xs font-medium text-zinc-200 group-hover:text-cyan-300 transition-colors line-clamp-1">
                {cat.name}
              </span>

              <span className="text-[10px] font-mono text-zinc-400 mt-1">
                {cat.itemCount} items
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
