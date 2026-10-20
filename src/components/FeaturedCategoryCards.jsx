import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function FeaturedCategoryCards({ 
  onSelectCategory,
  onOpenDetail,
  onNavigateSection,
  products = []
}) {
  const CARDS = [
    {
      id: 'headphones',
      bgClass: 'bg-[#f7f0eb]',
      title: 'Studio Wireless Audio',
      titleBn: 'স্টুডিও ওয়্যারলেস অডিও',
      description: 'Active noise cancelling over-ear headphones with 40mm deep bass drivers.',
      descriptionBn: 'অ্যাক্টিভ নয়েজ ক্যান্সেলেশন এবং ৪০মিমি ডিপ বেস হাই-ফাই অডিও।',
      image: '/assets/products/p16-ankeer-nk-ny200-headphones.jpg',
      alt: 'ANKEER NK-NY200 Studio Wireless Headphones',
      category: 'audio',
      featuredSku: 'P16-ANK-NY200-SLV'
    },
    {
      id: 'charging',
      bgClass: 'bg-[#eef3f1]',
      title: 'Turbo Fast Charging',
      titleBn: 'টার্বো ফাস্ট চার্জিং',
      description: '65W high-speed multi-device braided cables and GaN adapters.',
      descriptionBn: '৬৫ ওয়াট হাই-স্পিড মাল্টি-ডিভাইস ব্রেইডেড ক্যাবল ও ফাস্ট চার্জার।',
      image: '/assets/products/recrsi-4in1-65w-cable.jpg',
      alt: 'RECRSI 4-in-1 65W Fast Charging Braided Cable',
      category: 'charging',
      featuredSku: 'P20-RECRSI-4IN1'
    },
    {
      id: 'smartwatch',
      bgClass: 'bg-[#f0f2f8]',
      title: 'Ultra Smartwatches',
      titleBn: 'আল্ট্রা স্মার্টওয়াচ',
      description: 'HD infinite full display, Bluetooth calling & 24/7 fitness tracking.',
      descriptionBn: 'এইচডি ইনফিনিট ডিসপ্লে, ব্লুটুথ কলিং এবং সর্বক্ষণিক হেলথ ট্র্যাকিং।',
      image: '/assets/products/p13-t800-ultra2-smartwatch.jpg',
      alt: 'T800 Ultra 2 Smartwatch Dial & Straps',
      category: 'wearables',
      featuredSku: 'P13-T800-ULTRA2-SLV'
    }
  ];

  const handleCardAction = (card, isBuy = false) => {
    if (card.featuredSku && products && products.length > 0) {
      const prod = products.find(p => p.sku === card.featuredSku || p.category === card.category);
      if (prod && onOpenDetail) {
        onOpenDetail(prod);
        return;
      }
    }
    if (onSelectCategory) onSelectCategory(card.category);
    if (onNavigateSection) onNavigateSection('products-section');
  };

  return (
    <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6" aria-label="Featured Collections">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CARDS.map((card) => (
          <div
            key={card.id}
            className={`${card.bgClass} rounded-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden relative group cursor-pointer h-[380px] sm:h-[420px] transition-all duration-300 hover:shadow-md`}
            onClick={() => handleCardAction(card, false)}
          >
            {/* Top Text Content */}
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
                {card.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-[260px] leading-relaxed mb-4">
                {card.description}
              </p>

              {/* Compact CTA Links */}
              <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold text-slate-900">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardAction(card, true);
                  }}
                  className="flex items-center gap-0.5 hover:text-[#0066FF] transition-colors cursor-pointer"
                >
                  <span>Buy Now</span>
                  <ChevronRight size={14} className="stroke-[2.5]" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardAction(card, false);
                  }}
                  className="flex items-center gap-0.5 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <span>Learn More</span>
                  <ChevronRight size={14} className="stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Bottom Product Image Showcase */}
            <div className="relative w-full h-[200px] sm:h-[230px] flex items-end justify-center mt-2">
              <img
                src={card.image}
                alt={card.alt}
                loading="lazy"
                className="max-h-full max-w-[85%] object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-108 group-hover:-translate-y-1"
                onError={(e) => {
                  e.currentTarget.src = '/assets/product-placeholder.png';
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
