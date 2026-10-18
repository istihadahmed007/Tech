import React from 'react';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';

export default function ComparisonBar({
  comparisonProducts = [],
  onRemove,
  onClearAll,
  onOpenComparison,
  currencySymbol = "৳",
  lang = 'en'
}) {
  if (!comparisonProducts || comparisonProducts.length === 0) return null;

  return (
    <aside 
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl bg-[#0F172A] text-white p-3 sm:p-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-3 animate-fadeIn backdrop-blur-md"
      aria-label="Product Comparison Bar"
    >
      {/* Left: Info & Thumbnails */}
      <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto py-0.5">
        <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-lg bg-[#1E293B] text-[#60A5FA] text-xs font-bold border border-blue-500/20">
          <Scale size={14} />
          <span>{comparisonProducts.length}/4</span>
        </div>

        {/* Thumbnails */}
        <div className="flex items-center gap-2 shrink-0">
          {comparisonProducts.map(prod => (
            <div 
              key={prod.id} 
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white p-1 border border-white/20 shrink-0 group"
              title={prod.title}
            >
              <img 
                src={prod.image} 
                alt={prod.title} 
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(prod.id);
                }}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity"
                title="Remove from comparison"
                aria-label={`Remove ${prod.title} from comparison`}
              >
                <X size={10} />
              </button>
            </div>
          ))}

          {/* Empty slot placeholders up to 4 */}
          {Array.from({ length: Math.max(0, 4 - comparisonProducts.length) }).map((_, idx) => (
            <div 
              key={`empty-${idx}`} 
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-dashed border-white/20 flex items-center justify-center text-[10px] text-white/40 font-mono shrink-0 hidden sm:flex"
            >
              +Slot
            </div>
          ))}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-slate-400 hover:text-white transition-colors px-2 py-1.5 hidden sm:block cursor-pointer"
        >
          {lang === 'bn' ? 'সব মুছুন' : 'Clear'}
        </button>

        <button
          type="button"
          onClick={onOpenComparison}
          className="bg-[#145CFF] hover:bg-[#0D4BD9] text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
        >
          <span>{lang === 'bn' ? 'তুলনা দেখুন' : 'Compare Now'}</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </aside>
  );
}
