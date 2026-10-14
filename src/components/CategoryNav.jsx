import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function CategoryNav({ 
  selectedCategory, 
  onSelectCategory,
  onShopAll,
  lang = 'en'
}) {
  const categories = [
    {
      id: 'cases',
      name: lang === 'bn' ? 'কেস ও কভার' : 'Cases',
      image: '/assets/cat-cases.jpg',
      alt: 'Cases for iPhone, Samsung, Pixel'
    },
    {
      id: 'audio',
      name: lang === 'bn' ? 'অডিও গিয়ার' : 'Audio',
      image: '/assets/cat-audio.jpg',
      alt: 'Wireless earbuds and audio accessories'
    },
    {
      id: 'charging',
      name: lang === 'bn' ? 'ফাস্ট চার্জিং' : 'Charging',
      image: '/assets/cat-charging.jpg',
      alt: 'USB-C fast chargers and braided cables'
    },
    {
      id: 'powerbanks',
      name: lang === 'bn' ? 'পাওয়ার ব্যাংক' : 'Power banks',
      image: '/assets/cat-powerbanks.jpg',
      alt: 'MagSafe and high-capacity portable power banks'
    }
  ];

  return (
    <section className="w-full my-8 sm:my-12">
      {/* Section Header (Exact match for Image 3) */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10263D] tracking-tight">
            {lang === 'bn' ? 'প্রতিদিনের সেরা সংগ্রহ' : 'The everyday edit'}
          </h2>
          <p className="text-xs sm:text-sm text-[#52677B] mt-1 font-medium">
            {lang === 'bn' ? 'আপনার সাথে থাকার জন্য প্রস্তুত।' : 'Made to go with you.'}
          </p>
        </div>

        <button
          onClick={onShopAll}
          className="text-xs sm:text-sm font-bold text-[#145CFF] hover:underline flex items-center gap-1 group pb-0.5"
        >
          <span>{lang === 'bn' ? 'সবগুলো দেখুন' : 'Shop all'}</span>
          <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
        </button>
      </div>

      {/* 4 Curated Category Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.id)}
              className={`group flex flex-col items-center justify-between p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-200 border ${
                isSelected 
                  ? 'bg-white border-[#145CFF] shadow-md ring-2 ring-[#145CFF]/20 -translate-y-1' 
                  : 'bg-white/90 hover:bg-white border-[#DCE7F0] hover:border-[#145CFF]/40 hover:shadow-md hover:-translate-y-1'
              }`}
            >
              {/* Product Imagery */}
              <div className="relative w-full aspect-[4/3] flex items-center justify-center mb-3 overflow-hidden rounded-xl bg-[#F7FBFF]/70 p-2">
                <img
                  src={cat.image}
                  alt={cat.alt}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Category Label with Chevron Right matching reference */}
              <div className="flex items-center gap-1 font-bold text-sm sm:text-base text-[#10263D] group-hover:text-[#145CFF] transition-colors mt-1">
                <span>{cat.name}</span>
                <ChevronRight size={16} className="stroke-[2.5] group-hover:translate-x-0.5 transition-transform text-slate-600 group-hover:text-[#145CFF]" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
