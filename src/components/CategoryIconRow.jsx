import React from 'react';
import { 
  Watch, 
  Headphones, 
  Zap, 
  Smartphone, 
  Cable, 
  LayoutGrid 
} from 'lucide-react';

export default function CategoryIconRow({ 
  onSelectCategory,
  onNavigateSection,
  selectedCategory,
  lang = 'en'
}) {
  const CATEGORIES = [
    {
      id: 'wearables',
      label: 'Smart Watch',
      labelBn: 'স্মার্ট ওয়াচ',
      icon: Watch
    },
    {
      id: 'audio',
      label: 'Headphones',
      labelBn: 'হেডফোন ও অডিও',
      icon: Headphones
    },
    {
      id: 'charging',
      label: 'Fast Charging',
      labelBn: 'ফাস্ট চার্জিং',
      icon: Zap
    },
    {
      id: 'cases',
      label: 'Cases & Covers',
      labelBn: 'কেস ও কভার',
      icon: Smartphone
    },
    {
      id: 'adapters',
      label: 'Cables & OTG',
      labelBn: 'ক্যাবল ও ওটিজি',
      icon: Cable
    },
    {
      id: 'all',
      label: 'All Gear',
      labelBn: 'সব গ্যাজেট',
      icon: LayoutGrid
    }
  ];

  return (
    <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10" aria-label="Product Categories">
      <div className="flex items-center justify-between gap-3 sm:gap-6 overflow-x-auto scrollbar-none pb-2 sm:pb-0">
        {CATEGORIES.map((cat) => {
          const IconComp = cat.icon;
          const isSelected = selectedCategory === cat.id || (cat.id === 'all' && !selectedCategory);

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                if (onSelectCategory) {
                  onSelectCategory(cat.id === 'all' ? null : cat.id);
                }
                if (onNavigateSection) {
                  onNavigateSection('products-section');
                }
              }}
              className="flex flex-col items-center group cursor-pointer shrink-0 min-w-[90px] sm:min-w-[110px]"
            >
              {/* Rounded-Square Light-Gray Icon Container (matching reference) */}
              <div 
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-sm ${
                  isSelected
                    ? 'bg-blue-50 border-2 border-[#0066FF] shadow-xs'
                    : 'bg-[#f0f2f5] group-hover:bg-[#e7eaf0]'
                }`}
              >
                <IconComp 
                  size={32} 
                  strokeWidth={1.5} 
                  className={`transition-colors ${
                    isSelected ? 'text-[#0066FF]' : 'text-slate-700 group-hover:text-slate-900'
                  }`}
                />
              </div>

              {/* Small Label Beneath */}
              <span className={`mt-3 text-xs sm:text-[13px] font-medium transition-colors ${
                isSelected ? 'text-[#0066FF] font-semibold' : 'text-slate-800 group-hover:text-[#0066FF]'
              }`}>
                {lang === 'bn' ? cat.labelBn : cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
