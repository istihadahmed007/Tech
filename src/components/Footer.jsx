import React from 'react';
import { Sparkles, ShieldCheck, Phone, MapPin, HelpCircle } from 'lucide-react';

export default function Footer({ 
  storeName, 
  onOpenSupport, 
  onOpenTracking, 
  onSelectCategory, 
  t, 
  lang 
}) {
  return (
    <footer className="w-full mt-16 sm:mt-24 border-t border-[#DCE7F0] bg-white/92 backdrop-blur-md shadow-xs">
      <div className="container pt-12 sm:pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-12 border-b border-[#DCE7F0]">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center">
              <img 
                src="/assets/tech-nest-logo-horizontal.png" 
                alt="Tech Nest Logo" 
                className="h-14 sm:h-16 w-auto object-contain drop-shadow-sm" 
              />
            </div>
            <p className="text-xs text-[#52677B] leading-relaxed max-w-sm">
              {t.footerAbout}
            </p>
            <div className="text-xs text-[#52677B] space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#145CFF] shrink-0" />
                <span>Dhaka, Bangladesh • Store location pending production configuration</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle size={14} className="text-[#145CFF] shrink-0" />
                <button 
                  onClick={onOpenSupport}
                  className="footer-link-btn text-[#145CFF] font-medium hover:underline"
                >
                  Contact support & store inquiries
                </button>
              </div>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#10263D]">
              Categories
            </h4>
            <ul className="footer-nav-list">
              <li>
                <button 
                  onClick={() => onSelectCategory('audio')} 
                  className="footer-link-btn"
                >
                  {t.catAudio || 'Audio'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('charging')} 
                  className="footer-link-btn"
                >
                  {t.catCharging || 'Charging'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('wearables')} 
                  className="footer-link-btn"
                >
                  {t.catWearables || 'Smartwatches'}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory(null)} 
                  className="footer-link-btn"
                >
                  {t.allProducts || 'All Products'}
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#10263D]">
              Assistance
            </h4>
            <ul className="footer-nav-list">
              <li>
                <button 
                  onClick={onOpenTracking} 
                  className="footer-link-btn"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenSupport} 
                  className="footer-link-btn"
                >
                  Warranty & Inquiries
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenSupport} 
                  className="footer-link-btn"
                >
                  Delivery Options & Tiers
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenSupport} 
                  className="footer-link-btn"
                >
                  Return & Exchange Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Trust & Logistics */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#10263D]">
              {lang === 'bn' ? 'নিরাপত্তা ও ডেলিভারি' : 'Trust & Delivery'}
            </h4>
            <ul className="footer-nav-list text-xs text-[#52677B] space-y-1.5">
              <li className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                <span>{lang === 'bn' ? '১০০% অরিজিনাল গ্যাজেট' : '100% Genuine BD Imports'}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#145CFF] shrink-0" />
                <span>{lang === 'bn' ? '৭ দিনের রিপ্লেসমেন্ট পলিসি' : '7-Day Replacement Policy'}</span>
              </li>
              <li>
                <span className="text-slate-500 text-[11px]">
                  {lang === 'bn' ? 'সারা বাংলাদেশে ক্যাশ অন ডেলিভারি' : 'Cash on Delivery Across Bangladesh'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip & Payment Methods */}
        <div className="pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#52677B]">
          <p>{t.copyright}</p>

          {/* Payment Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-[#10263D] mr-1">Accepted Payments:</span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[11px] shadow-2xs">
              Cash on Delivery
            </span>
            <span className="px-2.5 py-1 rounded-md bg-pink-50 border border-pink-200 text-pink-700 font-bold text-[11px] shadow-2xs">
              bKash
            </span>
            <span className="px-2.5 py-1 rounded-md bg-orange-50 border border-orange-200 text-orange-700 font-bold text-[11px] shadow-2xs">
              Nagad
            </span>
            <span className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-[#145CFF] font-bold text-[11px] shadow-2xs">
              Visa / Mastercard
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600 font-medium text-[11px] flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-600" />
              <span>256-bit Secure Gateway</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
