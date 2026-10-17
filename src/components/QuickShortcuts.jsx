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
      bgColor: '#DDF4FC',
      iconColor: '#168FC2',
      onClick: () => {
        if (onSetSortBy) onSetSortBy('newest');
        if (onNavigateSection) onNavigateSection('products-section');
      }
    },
    {
      id: 'best_sellers',
      label: lang === 'bn' ? 'বেস্ট সেলার' : 'Best Sellers',
      icon: Award,
      bgColor: '#FEF3C7',
      iconColor: '#D97706',
      onClick: () => {
        if (onSetSortBy) onSetSortBy('rating');
        if (onNavigateSection) onNavigateSection('products-section');
      }
    },
    {
      id: 'flash_sale',
      label: lang === 'bn' ? 'ফ্ল্যাশ সেল' : 'Flash Sale',
      icon: Zap,
      bgColor: '#EAF4FC',
      iconColor: '#168FC2',
      onClick: () => {
        if (onNavigateSection) onNavigateSection('flash-sale-section');
      }
    },
    {
      id: 'earbuds',
      label: lang === 'bn' ? 'ইয়ারবাডস' : 'TWS Earbuds',
      icon: Headphones,
      bgColor: '#E0F2FE',
      iconColor: '#0284C7',
      onClick: () => {
        if (onSelectCategory) onSelectCategory('earbuds');
        if (onNavigateSection) onNavigateSection('products-section');
      }
    },
    {
      id: 'chargers',
      label: lang === 'bn' ? 'ফাস্ট চার্জার' : 'Fast Chargers',
      icon: BatteryCharging,
      bgColor: '#ECFDF5',
      iconColor: '#059669',
      onClick: () => {
        if (onSelectCategory) onSelectCategory('chargers');
        if (onNavigateSection) onNavigateSection('products-section');
      }
    },
    {
      id: 'smartwatches',
      label: lang === 'bn' ? 'স্মার্টওয়াচ' : 'Smartwatches',
      icon: Watch,
      bgColor: '#F3E8FF',
      iconColor: '#7C3AED',
      onClick: () => {
        if (onSelectCategory) onSelectCategory('wearables');
        if (onNavigateSection) onNavigateSection('products-section');
      }
    },
    {
      id: 'free_delivery',
      label: lang === 'bn' ? 'ফ্রি ডেলিভারি' : 'Free Delivery',
      icon: Truck,
      bgColor: '#E0E7FF',
      iconColor: '#4338CA',
      onClick: () => {
        if (onNavigateSection) onNavigateSection('bundles-section');
      }
    },
    {
      id: 'authentic',
      label: lang === 'bn' ? '১০০% অরিজিনাল' : '100% Genuine',
      icon: ShieldCheck,
      bgColor: '#F1F5F9',
      iconColor: '#334155',
      onClick: () => {
        if (onNavigateSection) onNavigateSection('benefits-section');
      }
    }
  ];

  return (
    <section className="w-full my-4 sm:my-6 p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl border border-[#DCEAF1] shadow-xs">
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4">
        {shortcuts.map((sc) => {
          const Icon = sc.icon;
          return (
            <div
              key={sc.id}
              onClick={sc.onClick}
              className="shopee-shortcut-item group"
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
                className="shopee-shortcut-circle"
                style={{ backgroundColor: sc.bgColor }}
              >
                <Icon size={22} style={{ color: sc.iconColor }} />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-[#102A43] group-hover:text-[#168FC2] transition-colors line-clamp-1 leading-snug">
                {sc.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
