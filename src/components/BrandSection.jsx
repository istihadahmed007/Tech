import React from 'react';
import { Smartphone, Check, ChevronRight } from 'lucide-react';
import { BRANDS_AND_MODELS } from '../data/catalog';

export default function BrandSection({
  selectedPhone,
  onSelectPhone,
  onClearPhoneFilter,
  lang = 'en'
}) {
  return (
    <section className="w-full my-6 sm:my-8 p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl border border-[#ECECEC] shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#10263D] tracking-tight uppercase">
            {lang === 'bn' ? 'ব্র্যান্ড ও ফোন মডেল কম্প্যাটিবিলিটি' : 'VERIFIED DEVICE COMPATIBILITY'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'bn' 
              ? 'আপনার স্মার্টফোনের জন্য শতভাগ পরীক্ষিত চার্জার, ক্যাবল ও অডিও এক্সেসরিজ' 
              : 'Select your phone model to view verified compatible accessories'}
          </p>
        </div>

        {selectedPhone && (
          <button
            type="button"
            onClick={onClearPhoneFilter}
            className="text-xs font-bold text-[#EE4D2D] hover:underline cursor-pointer"
          >
            {lang === 'bn' ? 'ফিল্টার মুছুন' : 'Clear Phone Filter'}
          </button>
        )}
      </div>

      {/* Brands & Models Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {BRANDS_AND_MODELS.map((brandGroup) => (
          <div 
            key={brandGroup.brand} 
            className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Smartphone size={16} className="text-[#EE4D2D]" />
                <h3 className="text-sm font-bold text-[#10263D]">{brandGroup.brand}</h3>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {brandGroup.models.slice(0, 4).map((model) => {
                  const isSelected = selectedPhone === model;
                  return (
                    <button
                      key={model}
                      type="button"
                      onClick={() => onSelectPhone(isSelected ? null : model)}
                      className={`text-[11px] px-2.5 py-1 rounded transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#EE4D2D] text-white font-bold shadow-xs'
                          : 'bg-white text-slate-600 hover:text-[#10263D] hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {model}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectPhone(brandGroup.models[0])}
              className="mt-3 text-[11px] font-semibold text-[#EE4D2D] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{lang === 'bn' ? `${brandGroup.brand} এক্সেসরিজ` : `View ${brandGroup.brand} Gear`}</span>
              <ChevronRight size={13} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
