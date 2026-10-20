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
    <section className="w-full my-6 sm:my-8 p-4 sm:p-6 bg-[#12141C] rounded-2xl border border-[#1E2230] shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#1E2230]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="agent-pulse-dot" />
            <h2 className="text-sm sm:text-base font-bold font-mono text-white tracking-wide uppercase">
              {lang === 'bn' ? 'ব্র্যান্ড ও ফোন মডেল কম্প্যাটিবিলিটি' : 'VERIFIED DEVICE COMPATIBILITY MATRIX'}
            </h2>
          </div>
          <p className="text-[11px] text-zinc-400 font-mono">
            {lang === 'bn' 
              ? 'আপনার স্মার্টফোনের জন্য শতভাগ পরীক্ষিত চার্জার, ক্যাবল ও অডিও এক্সেসরিজ' 
              : 'Filter accessories with guaranteed wattage, pin-out, and protocol compatibility'}
          </p>
        </div>

        {selectedPhone && (
          <button
            type="button"
            onClick={onClearPhoneFilter}
            className="text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>{lang === 'bn' ? 'ফিল্টার মুছুন' : 'Reset Filter'}</span>
            <span className="text-zinc-500">({selectedPhone})</span>
          </button>
        )}
      </div>

      {/* Brands & Models Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {BRANDS_AND_MODELS.map((brandGroup) => (
          <div 
            key={brandGroup.brand} 
            className="p-4 rounded-xl bg-[#0B0D14] border border-[#1E2230] hover:border-cyan-500/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Smartphone size={13} />
                </div>
                <h3 className="text-xs font-mono font-bold text-white tracking-wider uppercase">{brandGroup.brand}</h3>
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
                          ? 'bg-cyan-500 text-[#090A0F] font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                          : 'bg-[#12141C] text-zinc-300 hover:text-cyan-300 hover:border-cyan-500/50 border border-[#1E2230]'
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
              className="mt-4 text-[11px] font-mono font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
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
