import React from 'react';
import { Shield, Headphones, Zap, BatteryCharging, ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '../data/catalog';

export default function CategoryNav({ 
  selectedCategory, 
  onSelectCategory, 
  t, 
  lang 
}) {
  const iconMap = {
    Shield: Shield,
    Headphones: Headphones,
    Zap: Zap,
    BatteryCharging: BatteryCharging
  };

  const categoryImages = {
    cases: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=500&q=80",
    audio: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=500&q=80",
    charging: "https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=500&q=80",
    powerbanks: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=500&q=80"
  };

  return (
    <section className="w-full my-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#112A43] tracking-tight">
            {t.categoriesTitle}
          </h3>
          <p className="text-xs sm:text-sm text-[#4B637B]">
            Optic-grade engineering across four essential pillars
          </p>
        </div>

        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline"
          >
            Show All
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {CATEGORIES.map((cat) => {
          const Icon = iconMap[cat.icon] || Shield;
          const isSelected = selectedCategory === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.id)}
              className={`group relative rounded-2xl sm:rounded-3xl p-4 sm:p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                isSelected 
                  ? 'ring-2 ring-blue-600 bg-white shadow-xl scale-[1.02]' 
                  : 'hover:scale-[1.02] bg-white/70 hover:bg-white/90 shadow-sm hover:shadow-md'
              }`}
              style={{
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: isSelected ? '1px solid #2563EB' : '1px solid rgba(37, 99, 235, 0.12)'
              }}
            >
              {/* Recessed Preview Container */}
              <div className="relative w-full h-28 sm:h-36 rounded-xl sm:rounded-2xl overflow-hidden mb-3 bg-gradient-to-br from-blue-50 to-blue-100/40 flex items-center justify-center">
                <img
                  src={categoryImages[cat.id]}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#112A43]/40 via-transparent to-transparent" />
                
                {/* Tech Badge */}
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-[#112A43] shadow-sm">
                  {cat.badge}
                </span>

                {/* Arrow Icon */}
                <div className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#112A43] group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                  <ArrowUpRight size={14} />
                </div>
              </div>

              {/* Title & Count */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={16} className={isSelected ? "text-blue-600" : "text-[#4B637B]"} />
                  <h4 className="font-bold text-base sm:text-lg text-[#112A43] leading-tight">
                    {lang === 'bn' ? cat.nameBn : cat.name}
                  </h4>
                </div>
                <p className="text-xs text-[#4B637B] line-clamp-1">
                  {cat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
