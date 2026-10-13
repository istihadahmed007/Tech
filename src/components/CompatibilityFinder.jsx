import React, { useState } from 'react';
import { Smartphone, CheckCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { BRANDS_AND_MODELS } from '../data/catalog';

export default function CompatibilityFinder({ 
  selectedPhone, 
  onSelectPhone, 
  onClearFilter, 
  t 
}) {
  const [activeBrand, setActiveBrand] = useState('Apple');
  const [activeModel, setActiveModel] = useState('iPhone 15 Pro');

  const currentBrandModels = BRANDS_AND_MODELS.find(b => b.brand === activeBrand)?.models || [];

  const handleApply = (e) => {
    e.preventDefault();
    if (activeModel) {
      onSelectPhone(activeModel);
    }
  };

  const popularPhones = [
    "iPhone 15 Pro",
    "Galaxy S24 Ultra",
    "iPhone 15 Pro Max",
    "Pixel 8 Pro",
    "Xiaomi 14 Ultra"
  ];

  return (
    <div 
      id="compatibility-finder"
      className="w-full rounded-3xl p-6 sm:p-8 transition-all"
      style={{
        background: 'rgba(248, 252, 255, 0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(37, 99, 235, 0.16)',
        boxShadow: '0 12px 36px -4px rgba(17, 42, 67, 0.06), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)'
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-100/80 border border-blue-200/50 flex items-center justify-center text-blue-600 shadow-sm">
            <Smartphone size={22} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#112A43] tracking-tight">
              {t.finderTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#4B637B]">
              {t.finderSubtitle}
            </p>
          </div>
        </div>

        {selectedPhone && (
          <div className="flex items-center gap-3 bg-blue-50/90 border border-blue-200/70 rounded-full px-4 py-2 self-start md:self-auto">
            <CheckCircle size={16} className="text-emerald-600" />
            <span className="text-xs font-semibold text-[#112A43]">
              {t.showingCompatibleFor} <strong className="text-blue-700">{selectedPhone}</strong>
            </span>
            <button
              onClick={onClearFilter}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium ml-1"
              title="Clear Filter"
            >
              <RotateCcw size={12} />
              <span>{t.clearFilter}</span>
            </button>
          </div>
        )}
      </div>

      {/* Selector Form */}
      <form onSubmit={handleApply} className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-end">
        {/* Brand Selector */}
        <div className="sm:col-span-4">
          <label className="block text-xs font-bold text-[#112A43] uppercase tracking-wider mb-1.5">
            {t.selectBrand}
          </label>
          <select
            value={activeBrand}
            onChange={(e) => {
              setActiveBrand(e.target.value);
              const brandModels = BRANDS_AND_MODELS.find(b => b.brand === e.target.value)?.models || [];
              if (brandModels.length > 0) setActiveModel(brandModels[0]);
            }}
            className="w-full py-3 px-4 rounded-xl bg-white/80 border border-blue-200/70 text-[#112A43] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
          >
            {BRANDS_AND_MODELS.map(b => (
              <option key={b.brand} value={b.brand}>
                {b.brand}
              </option>
            ))}
          </select>
        </div>

        {/* Model Selector */}
        <div className="sm:col-span-5">
          <label className="block text-xs font-bold text-[#112A43] uppercase tracking-wider mb-1.5">
            {t.selectModel}
          </label>
          <select
            value={activeModel}
            onChange={(e) => setActiveModel(e.target.value)}
            className="w-full py-3 px-4 rounded-xl bg-white/80 border border-blue-200/70 text-[#112A43] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-sm"
          >
            {currentBrandModels.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Action Button */}
        <div className="sm:col-span-3">
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>{t.findAccessories}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </form>

      {/* Quick Select Popular Phones Chips */}
      <div className="mt-4 pt-4 border-t border-blue-100/80 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-[#4B637B]">
          {t.quickSelect}
        </span>
        {popularPhones.map(phone => {
          const isSelected = selectedPhone === phone;
          return (
            <button
              key={phone}
              type="button"
              onClick={() => {
                if (isSelected) onClearFilter();
                else onSelectPhone(phone);
              }}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                isSelected 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-white/80 text-[#112A43] border border-blue-200/50 hover:bg-blue-50 hover:border-blue-300'
              }`}
            >
              {phone}
            </button>
          );
        })}
      </div>
    </div>
  );
}
