import React, { useState, useEffect } from 'react';
import { Zap, ChevronRight, ShoppingBag, Flame } from 'lucide-react';
import { getHardwareGrade } from '../utils/hardwareGrade';

export default function FlashSale({
  products = [],
  onOpenDetail,
  onQuickAdd,
  onViewAllFlashDeals,
  currencySymbol = "৳",
  lang = 'en'
}) {
  // Filter products with genuine discount (originalPrice > price)
  const flashProducts = React.useMemo(() => {
    return products
      .filter(p => p.originalPrice && p.originalPrice > p.price && p.stock > 0)
      .slice(0, 6);
  }, [products]);

  // Live countdown timer to end of daily flash promotion window
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const diff = Math.max(0, Math.floor((endOfDay.getTime() - now.getTime()) / 1000));
    return diff;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  if (flashProducts.length === 0) return null;

  return (
    <section id="flash-sale-section" className="w-full my-6 sm:my-8 p-4 sm:p-6 bg-[#FFFFFF] border border-[#DCE8F3] rounded-2xl shadow-sm text-[#10263D]" aria-label="Limited Flash Sale Deals">
      {/* Section Header: Live Monospace Countdown Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#DCE8F3]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[#1684E8]">
            <Zap size={20} className="fill-[#1684E8] stroke-[2.5]" />
            <span className="text-lg sm:text-xl font-black tracking-tight uppercase font-mono">
              {lang === 'bn' ? 'ফ্ল্যাশ সেল' : 'LIMITED FLASH DISPATCH'}
            </span>
          </div>

          {/* Monospace Countdown Clock */}
          <div className="flex items-center gap-1 font-mono text-xs">
            <span className="px-2 py-1 rounded bg-[#EBF5FF] border border-[#DCE8F3] text-[#1684E8] font-bold">{hours}</span>
            <span className="font-bold text-[#526981]">:</span>
            <span className="px-2 py-1 rounded bg-[#EBF5FF] border border-[#DCE8F3] text-[#1684E8] font-bold">{minutes}</span>
            <span className="font-bold text-[#526981]">:</span>
            <span className="px-2 py-1 rounded bg-[#EBF5FF] border border-[#DCE8F3] text-[#1684E8] font-bold">{seconds}</span>
          </div>
        </div>

        {onViewAllFlashDeals && (
          <button
            type="button"
            onClick={onViewAllFlashDeals}
            className="font-mono text-xs font-bold text-[#1684E8] hover:text-[#1270C5] flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>{lang === 'bn' ? 'সবগুলো দেখুন' : 'VIEW ALL DEALS'}</span>
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Horizontal Carousel / Grid (6 items) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {flashProducts.map((product) => {
          const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
          const grade = getHardwareGrade(product);

          return (
            <div
              key={product.id}
              onClick={() => onOpenDetail && onOpenDetail(product)}
              className="group relative flex flex-col justify-between bg-[#FFFFFF] rounded-xl border border-[#DCE8F3] hover:border-[#1684E8]/40 p-2.5 transition-all cursor-pointer shadow-xs hover:shadow-md"
            >
              {/* Discount Tag */}
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded font-mono text-[10px] font-bold bg-[#EBF5FF] text-[#1684E8] border border-blue-200 z-10">
                -{discountPercent}%
              </div>

              {/* Hardware Grading Badge */}
              <div className="absolute top-2 left-2 z-10">
                <span className={`px-1.5 py-0.5 rounded font-mono text-[8px] font-bold uppercase tracking-wider ${grade.badgeClass}`}>
                  {grade.shortLabel}
                </span>
              </div>

              {/* Square Image 1:1 */}
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[#F5F9FD] mb-2 flex items-center justify-center p-2 border border-[#DCE8F3]">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col flex-grow justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#10263D] line-clamp-1 group-hover:text-[#1684E8] transition-colors mb-1">
                    {lang === 'bn' ? (product.titleBn || product.title) : product.title}
                  </h4>

                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="font-mono text-sm font-black text-[#1684E8]">
                      {currencySymbol}{product.price.toLocaleString()}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 line-through">
                      {currencySymbol}{product.originalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Stock Telemetry Bar */}
                <div className="w-full bg-[#EBF5FF] h-1.5 rounded-full overflow-hidden border border-[#DCE8F3] mb-1.5">
                  <div 
                    className="h-full bg-[#1684E8] rounded-full" 
                    style={{ width: `${Math.min(100, Math.max(20, (product.stock / 20) * 100))}%` }} 
                  />
                </div>
                <span className="font-mono text-[9px] text-[#526981] text-right block">
                  STOCK: {product.stock}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
