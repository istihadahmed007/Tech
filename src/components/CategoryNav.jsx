import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function CategoryNav({ 
  selectedCategory, 
  onSelectCategory 
}) {
  const categories = [
    {
      id: 'cases',
      name: 'Cases',
      image: '/assets/cat-cases.jpg',
      alt: 'Cases for iPhone, Samsung, Pixel'
    },
    {
      id: 'audio',
      name: 'Audio',
      image: '/assets/cat-audio.jpg',
      alt: 'Wireless earbuds and audio accessories'
    },
    {
      id: 'charging',
      name: 'Charging',
      image: '/assets/cat-charging.jpg',
      alt: 'USB-C fast chargers and braided cables'
    },
    {
      id: 'powerbanks',
      name: 'Power banks',
      image: '/assets/cat-powerbanks.jpg',
      alt: 'MagSafe and high-capacity portable power banks'
    }
  ];

  return (
    <section className="w-full my-8 mb-12">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 md:divide-x divide-slate-200/60 border-y border-[#DCE7F0] py-4 sm:py-6 bg-transparent">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.id)}
              className={`group flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'bg-[#EAF4FC] shadow-xs ring-1 ring-[#145CFF]/30 scale-[1.02]' 
                  : 'hover:bg-white/60 hover:scale-[1.01]'
              }`}
            >
              {/* Product Imagery Pedestal */}
              <div className="relative w-full aspect-[4/3] max-w-[210px] flex items-center justify-center mb-3 overflow-hidden rounded-xl bg-[#EAF4FC]/60 p-2">
                <img
                  src={cat.image}
                  alt={cat.alt}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Category Label with Chevron Right matching reference */}
              <div className="flex items-center gap-1 font-bold text-sm sm:text-base text-[#10263D] group-hover:text-[#145CFF] transition-colors">
                <span>{cat.name}</span>
                <ChevronRight size={16} className="stroke-[2.5] group-hover:translate-x-0.5 transition-transform text-slate-700 group-hover:text-[#145CFF]" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
