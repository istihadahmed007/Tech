import React from 'react';
import { 
  Sparkles, 
  Award, 
  Zap, 
  Headphones, 
  BatteryCharging, 
  Watch, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';

export default function QuickShortcuts({
  onSelectCategory,
  onNavigateSection,
  onSetSortBy,
  lang = 'en'
}) {
  const shortcuts = [
    {
      id: 'new_arrivals',
      label: lang === 'bn' ? 'নতুন কালেকশন' : 'New Arrivals',
      icon: Sparkles,
      bgColor: 'rgba(6, 182, 212, 0.12)',
      iconColor: '#22D3EE',
      borderColor: 'rgba(6, 182, 212, 0.3)',
      onClick: () => {
        if (onSetSortBy) onSetSortBy('newest');
        if (onNavigateSection) onNavigateSection('products-section');
      }
    },
    {
      id: 'best_sellers',
      label: lang === 'bn' ? 'বেস্ট সেলার' : 'Best Sellers',
      icon: Award,
      bgColor: 'rgba(245, 158, 11, 0.12)',
      iconColor: '#FBBF24',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      onClick: () => {
        if (onSetSortBy) onSetSortBy('rating');
        if (onNavigateSection) onNavigateSection('products-section');
      }
    },
    {
      id: 'flash_sale',
      label: lang === 'bn' ? 'ফ্ল্যাশ সেল' : 'Flash Sale',
      icon: Zap,
      bgColor: 'rgba(239, 68, 68, 0.12)',
      iconColor: '#F87171',
      borderColor: 'rgba(239, 68, 68, 0.3)',
      onClick: () => {
        if (onNavigateSection) onNavigateSection('flash-sale-section');
      }
    },
    {
      id: 'earbuds',
      label: lang === 'bn' ? 'ইয়ারবাডস' : 'TWS Earbuds',
      icon: Headphones,
      bgColor: 'rgba(6, 182, 212, 0.12)',
      iconColor: '#22D3EE',
      borderColor: 'rgba(6, 182, 212, 0.3)',
      onClick: () => {
        if (onSelectCategory) onSelectCategory('earbuds');
        if (onNavigateSection) onNavigateSection('products-section');
      }
    },
    {
      id: 'chargers',
      label: lang === 'bn' ? 'ফাস্ট চার্জার' : 'Fast Chargers',
      icon: BatteryCharging,
      bgColor: 'rgba(16, 185, 129, 0.12)',
      iconColor: '#34D399',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      onClick: () => {
        if (onSelectCategory) onSelectCategory('chargers');
        if (onNavigateSection) onNavigateSection('products-section');
      }
    },
    {
      id: 'smartwatches',
      label: lang === 'bn' ? 'স্মার্টওয়াচ' : 'Smartwatches',
      icon: Watch,
      bgColor: 'rgba(168, 85, 247, 0.12)',
      iconColor: '#C084FC',
      borderColor: 'rgba(168, 85, 247, 0.3)',
      onClick: () => {
        if (onSelectCategory) onSelectCategory('wearables');
        if (onNavigateSection) onNavigateSection('products-section');
      }
    },
    {
      id: 'free_delivery',
      label: lang === 'bn' ? 'ফ্রি ডেলিভারি' : 'Free Delivery',
      icon: Truck,
      bgColor: 'rgba(16, 185, 129, 0.12)',
      iconColor: '#34D399',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      onClick: () => {
        if (onNavigateSection) onNavigateSection('bundles-section');
      }
    },
    {
      id: 'authentic',
      label: lang === 'bn' ? '১০০% অরিজিনাল' : '100% Genuine',
      icon: ShieldCheck,
      bgColor: 'rgba(6, 182, 212, 0.12)',
      iconColor: '#22D3EE',
      borderColor: 'rgba(6, 182, 212, 0.3)',
      onClick: () => {
        if (onNavigateSection) onNavigateSection('benefits-section');
      }
    }
  ];

  return (
    <section className="w-full my-4 sm:my-6 p-4 sm:p-6 bg-[#12141C] rounded-xl sm:rounded-2xl border border-[#1E2230] shadow-md">
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4">
        {shortcuts.map((sc) => {
          const Icon = sc.icon;
          return (
            <div
              key={sc.id}
              onClick={sc.onClick}
              className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-[#161924] transition-all cursor-pointer group text-center"
              role="button"
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  sc.onClick();
                }
              }}
            >
              <div 
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-2 transition-transform duration-200 group-hover:scale-110 shadow-xs border"
                style={{ backgroundColor: sc.bgColor, borderColor: sc.borderColor }}
              >
                <Icon size={20} style={{ color: sc.iconColor }} />
              </div>
              <span className="text-[11px] sm:text-xs font-mono font-medium text-zinc-300 group-hover:text-cyan-400 transition-colors line-clamp-1 leading-snug">
                {sc.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
