import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function FeaturedCategories({
  selectedCategory,
  onSelectCategory,
  onShopAll,
  onOpenTracking,
  onOpenSupport,
  onScrollToBundles,
  onScrollToFinder,
  lang = 'en'
}) {
  const categories = [
    {
      id: 'wearables',
      title: lang === 'bn' ? 'স্মার্টওয়াচ' : 'Smartwatches',
      image: '/assets/categories/category-smartwatches.jpg',
      alt: 'Smartwatches category with high-definition digital displays',
      count: '4 Models'
    },
    {
      id: 'audio',
      title: lang === 'bn' ? 'ইয়ারবাডস' : 'Earbuds',
      image: '/assets/categories/category-earbuds.jpg',
      alt: 'Wireless earbuds category with active noise cancellation',
      count: '14 Models'
    },
    {
      id: 'charging',
      title: lang === 'bn' ? 'পাওয়ার ব্যাংক ও চার্জার' : 'Power Banks',
      image: '/assets/categories/category-powerbanks.jpg',
      alt: 'Fast chargers, cables and portable power banks',
      count: '6 Models'
    },
    {
      id: 'audio',
      title: lang === 'bn' ? 'হেডফোন' : 'Headphones',
      image: '/assets/categories/category-headphones.jpg',
      alt: 'Over-ear headphones and studio headsets',
      count: '6 Models'
    }
  ];

  const handleCategoryClick = (catId) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
    const productsEl = document.getElementById('products-section');
    if (productsEl) {
      productsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Centered Section Heading matching Reference Image */}
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          {lang === 'bn' ? 'ক্যাটাগরি অনুযায়ী কিনুন' : 'Shop by Category'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 max-w-lg mx-auto">
          {lang === 'bn' ? 'আপনার প্রয়োজনীয় গ্যাজেট সহজে বেছে নিন' : 'Browse authentic, tested gear organized by device category'}
        </p>
      </div>

      {/* 4-Column Image-Led Category Grid (Exact Match to Reference Layout) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
        {categories.map((c, index) => {
          const isSelected = selectedCategory === c.id;

          return (
            <div
              key={`${c.id}-${index}`}
              onClick={() => handleCategoryClick(c.id)}
              className={`bg-white rounded-2xl p-4 border transition-all duration-200 cursor-pointer flex flex-col items-center group select-none ${
                isSelected 
                  ? 'border-blue-500 shadow-md ring-2 ring-blue-400/30' 
                  : 'border-slate-200/80 hover:border-blue-400 hover:shadow-lg'
              }`}
            >
              {/* Image Container with Soft Neutral Background */}
              <div className="w-full aspect-square bg-[#F8FAFC] rounded-xl overflow-hidden p-3 flex items-center justify-center border border-slate-100 mb-3.5">
                <img
                  src={c.image}
                  alt={c.alt}
                  width={300}
                  height={300}
                  loading="lazy"
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Category Title */}
              <h3 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors text-center">
                {c.title}
              </h3>
              <span className="text-[11px] text-slate-400 font-medium mt-0.5">
                {c.count}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
