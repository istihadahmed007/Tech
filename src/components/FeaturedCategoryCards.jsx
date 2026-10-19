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
      title: 'B&W McLaren',
      description: 'Special edition over-ear noise cancelling headphones',
      image: '/assets/featured-mclaren-headphones.jpg',
      alt: 'B&W McLaren Premium Headphones',
      category: 'audio',
      featuredSku: 'P16-ANK-NY200-SLV'
    },
    {
      id: 'drone',
      bgClass: 'bg-[#eef3f1]',
      title: 'Lavic 3 PRO',
      description: 'Fly Longer, Sense More. Industry-leading performance.',
      image: '/assets/featured-lavic-drone.jpg',
      alt: 'Lavic 3 Pro Camera Drone',
      category: 'drones'
    },
    {
      id: 'smartwatch',
      bgClass: 'bg-[#f0f2f8]',
      title: 'Smart Watch',
      description: 'Experience the biggest screen ever on the Smart Watch.',
      image: '/assets/featured-round-smartwatch.jpg',
      alt: 'Smart Watch Sport Dial',
      category: 'wearables',
      featuredSku: 'P13-T800-ULTRA2-SLV'
    }
  ];

  const handleCardAction = (card, isBuy = false) => {
    if (card.featuredSku) {
      const prod = products.find(p => p.sku === card.featuredSku || p.category === card.category);
      if (prod && onOpenDetail) {
        onOpenDetail(prod);
        return;
      }
    }
    if (onSelectCategory) onSelectCategory(card.category === 'drones' ? 'audio' : card.category);
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
            {/* Top Text Content (Screenshot 2) */}
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
            <div className="relative w-full h-[220px] sm:h-[240px] flex items-end justify-center -mb-2 overflow-hidden">
              <img
                src={card.image}
                alt={card.alt}
                className="max-h-full w-auto object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
