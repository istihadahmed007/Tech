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
    <section id="compatibility-finder" className="w-full my-6 sm:my-8 p-5 sm:p-7 bg-white rounded-2xl border border-slate-200 shadow-xs text-[#0F172A]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3.5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <h2 className="text-sm sm:text-base font-bold font-mono text-[#0F172A] tracking-wide uppercase">
              {lang === 'bn' ? 'ব্র্যান্ড ও ফোন মডেল কম্প্যাটিবিলিটি' : 'VERIFIED DEVICE COMPATIBILITY MATRIX'}
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            {lang === 'bn' 
              ? 'আপনার স্মার্টফোনের জন্য শতভাগ পরীক্ষিত চার্জার, ক্যাবল ও অডিও এক্সেসরিজ' 
              : 'Filter accessories with guaranteed wattage, pin-out, and protocol compatibility'}
          </p>
        </div>

        {selectedPhone && (
          <button
            type="button"
            onClick={onClearPhoneFilter}
            className="text-xs font-mono font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>{lang === 'bn' ? 'ফিল্টার মুছুন' : 'Reset Filter'}</span>
            <span className="text-slate-500">({selectedPhone})</span>
          </button>
        )}
      </div>

      {/* Brands & Models Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {BRANDS_AND_MODELS.map((brandGroup) => (
          <div 
            key={brandGroup.brand} 
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-white transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#0084FF]">
                  <Smartphone size={13} />
                </div>
                <h3 className="text-xs font-mono font-bold text-[#10263D] tracking-wider uppercase">{brandGroup.brand}</h3>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {brandGroup.models.slice(0, 4).map((model) => {
                  const isSelected = selectedPhone === model;
                  return (
                    <button
                      key={model}
                      type="button"
                      onClick={() => onSelectPhone(isSelected ? null : model)}
                      className={`text-[11px] font-mono px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0084FF] text-white font-bold shadow-xs border border-[#0084FF]'
                          : 'bg-white text-slate-700 hover:text-blue-600 hover:border-blue-300 border border-slate-200/90'
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
              className="mt-4 text-[11px] font-mono font-bold text-[#0077E6] hover:text-[#005BB3] flex items-center gap-1 cursor-pointer transition-colors"
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
