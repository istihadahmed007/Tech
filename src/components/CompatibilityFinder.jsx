import React, { useState } from 'react';
import { Smartphone, ChevronDown, ChevronRight, X } from 'lucide-react';
import { BRANDS_AND_MODELS } from '../data/catalog';

export default function CompatibilityFinder({ 
  selectedPhone, 
  onSelectPhone, 
  onClearFilter 
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

  return (
    <div 
      id="compatibility-finder"
      className="w-full rounded-2xl p-3.5 sm:p-5 border border-[#DCE7F0] shadow-2xs mb-8"
      style={{
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}
    >
      <form 
        onSubmit={handleApply}
        className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4"
      >
        {/* Left: Section Title */}
        <div className="w-full md:w-auto shrink-0 pl-1 sm:pl-2">
          <h2 className="text-base sm:text-lg font-bold text-[#10263D] tracking-tight">
            Find the right fit
          </h2>
        </div>

        {/* Center: Brand Selector */}
        <div className="relative w-full md:flex-1 max-w-xs">
          <div className="relative flex items-center bg-white rounded-xl border border-[#DCE7F0] px-3.5 py-2.5 shadow-2xs hover:border-[#145CFF] transition-colors">
            <Smartphone size={16} className="text-slate-400 mr-2 shrink-0" />
            <select
              value={activeBrand}
              onChange={(e) => {
                setActiveBrand(e.target.value);
                const models = BRANDS_AND_MODELS.find(b => b.brand === e.target.value)?.models || [];
                if (models.length > 0) setActiveModel(models[0]);
              }}
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-700 outline-none cursor-pointer appearance-none pr-6"
            >
              {BRANDS_AND_MODELS.map(b => (
                <option key={b.brand} value={b.brand}>
                  {b.brand}
                </option>
              ))}
            </select>
            <ChevronDown size={15} className="absolute right-3 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Center: Model Selector */}
        <div className="relative w-full md:flex-1 max-w-xs">
          <div className="relative flex items-center bg-white rounded-xl border border-[#DCE7F0] px-3.5 py-2.5 shadow-2xs hover:border-[#145CFF] transition-colors">
            <Smartphone size={16} className="text-slate-400 mr-2 shrink-0" />
            <select
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-700 outline-none cursor-pointer appearance-none pr-6"
            >
              {currentBrandModels.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <ChevronDown size={15} className="absolute right-3 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Right: Submit Button */}
        <button
          type="submit"
          className="w-full md:w-auto px-6 py-2.5 rounded-full bg-[#145CFF] hover:bg-[#0D4BD9] active:scale-[0.98] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all whitespace-nowrap shrink-0"
        >
          <span>Find accessories</span>
          <ChevronRight size={16} className="stroke-[2.5]" />
        </button>
      </form>

      {/* Active Filter Notification Pill (when filtered) */}
      {selectedPhone && (
        <div className="mt-2.5 pt-2 border-t border-[#DCE7F0] flex items-center justify-between text-xs px-2">
          <span className="text-[#52677B]">
            Showing accessories tailored for: <strong className="text-[#145CFF]">{selectedPhone}</strong>
          </span>
          <button
            onClick={onClearFilter}
            className="text-slate-500 hover:text-red-600 flex items-center gap-1 font-medium transition-colors"
          >
            <X size={13} />
            <span>Clear filter</span>
          </button>
        </div>
      )}
    </div>
  );
}
