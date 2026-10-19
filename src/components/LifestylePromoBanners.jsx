import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function LifestylePromoBanners({ 
  onSelectCategory,
  onNavigateSection
}) {
  const handleAction = (category) => {
    if (onSelectCategory) onSelectCategory(category);
    if (onNavigateSection) onNavigateSection('products-section');
  };

  return (
    <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8" aria-label="Lifestyle Promotions">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Card: Sound That Moves with You (Screenshot 1) */}
        <div 
          onClick={() => handleAction('audio')}
          className="relative h-[340px] sm:h-[380px] rounded-2xl overflow-hidden group cursor-pointer shadow-sm"
        >
          {/* Background Lifestyle Image */}
          <img 
            src="/assets/lifestyle-sound-speaker.jpg" 
            alt="Sound That Moves with You" 
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />

          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent pointer-events-none" />

          {/* Lower-Left Text & CTA (Screenshot 1) */}
          <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 z-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1.5 leading-tight">
              Sound That Moves with You
            </h3>
            <p className="text-xs sm:text-sm text-white/90 max-w-sm mb-4 leading-normal">
              Powerful. Compact. Ready for any adventure.
            </p>

            {/* White Pill CTA Button */}
            <button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 text-xs sm:text-[13px] font-semibold transition-all duration-200 shadow-md group-hover:shadow-lg cursor-pointer transform group-hover:translate-x-1"
            >
              <span>Shop now</span>
              <ArrowRight size={14} className="stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Right Card: Your Perfect Travel Companion (Screenshot 1) */}
        <div 
          onClick={() => handleAction('wearables')}
          className="relative h-[340px] sm:h-[380px] rounded-2xl overflow-hidden group cursor-pointer shadow-sm"
        >
          {/* Background Lifestyle Image */}
          <img 
            src="/assets/lifestyle-travel-runner.jpg" 
            alt="Your Perfect Travel Companion" 
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />

          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent pointer-events-none" />

          {/* Lower-Left Text & CTA (Screenshot 1) */}
          <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 z-10">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1.5 leading-tight">
              Your Perfect Travel Companion
            </h3>
            <p className="text-xs sm:text-sm text-white/90 max-w-sm mb-4 leading-normal">
              Escape the noise and immerse in your journey—wirelessly.
            </p>

            {/* Outlined / Dark Translucent Pill CTA Button */}
            <button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/40 text-white text-xs sm:text-[13px] font-semibold transition-all duration-200 backdrop-blur-sm shadow-md group-hover:shadow-lg cursor-pointer transform group-hover:translate-x-1"
            >
              <span>Shop now</span>
              <ArrowRight size={14} className="stroke-[2.5]" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
