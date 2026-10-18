import React, { useState, useEffect } from 'react';
import { Zap, ChevronRight, Flame, ShoppingBag } from 'lucide-react';

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
    <section id="flash-sale-section" className="w-full my-6 sm:my-8 flash-sale-wrapper p-4 sm:p-6 bg-white border border-[#E2E8F0] rounded-xl sm:rounded-2xl shadow-xs">
      {/* Section Header: Shopee Fire Logo + Countdown Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#145CFF]">
            <Zap size={22} className="fill-[#145CFF] stroke-[2.5]" />
            <span className="text-xl sm:text-2xl font-black tracking-tight uppercase">
              {lang === 'bn' ? 'ফ্ল্যাশ সেল' : 'FLASH SALE'}
            </span>
          </div>

          {/* Shopee-Style Countdown Clock */}
          <div className="flex items-center gap-1 text-xs">
            <span className="flash-countdown-box">{hours}</span>
            <span className="font-bold text-slate-700">:</span>
            <span className="flash-countdown-box">{minutes}</span>
            <span className="font-bold text-slate-700">:</span>
            <span className="flash-countdown-box">{seconds}</span>
          </div>
        </div>

        {onViewAllFlashDeals && (
          <button
            type="button"
            onClick={onViewAllFlashDeals}
            className="text-xs sm:text-sm font-bold text-[#145CFF] hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>{lang === 'bn' ? 'সবগুলো দেখুন' : 'See All Deals'}</span>
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Product Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {flashProducts.map((product) => {
          const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
          
          return (
            <div
              key={product.id}
              onClick={() => onOpenDetail && onOpenDetail(product)}
              className="group relative flex flex-col justify-between bg-white rounded-lg border border-[#E2E8F0] hover:border-[#145CFF] p-2.5 transition-all cursor-pointer hover:shadow-md"
            >
              {/* Discount Tag */}
              <div className="shopee-discount-badge">
                <span>-{discountPercent}%</span>
              </div>

              {/* Square Image 1:1 */}
              <div className="relative w-full aspect-square rounded-md overflow-hidden bg-white mb-2 flex items-center justify-center p-1">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Price & Progress */}
              <div className="space-y-1.5 mt-auto">
                <h4 className="text-xs font-semibold text-[#0F172A] truncate group-hover:text-[#145CFF]">
                  {lang === 'bn' ? (product.titleBn || product.title) : product.title}
                </h4>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm sm:text-base font-extrabold text-[#145CFF]">
                    {currencySymbol}{product.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 line-through">
                    {currencySymbol}{product.originalPrice.toLocaleString()}
                  </span>
                </div>

                {/* Stock Progress Bar */}
                <div className="flash-progress-bar">
                  <div 
                    className="flash-progress-fill" 
                    style={{ width: `${Math.min(100, Math.max(20, (product.stock / 60) * 100))}%` }}
                  />
                  <div className="flash-progress-text">
                    <Flame size={10} className="mr-0.5 fill-white" />
                    <span>{product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
