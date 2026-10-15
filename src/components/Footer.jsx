import React from 'react';
import { Sparkles, ShieldCheck, Phone, MapPin, HelpCircle } from 'lucide-react';

export default function Footer({ 
  storeName, 
  onOpenSupport, 
  onOpenTracking, 
  onSelectCategory, 
  onOpenAdmin,
  t, 
  lang 
}) {
  return (
    <footer className="w-full mt-16 sm:mt-20 pt-12 sm:pt-16 pb-12 border-t border-[#DCE7F0] bg-white/94 backdrop-blur-md shadow-lg">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-12 lg:px-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-12 border-b border-[#DCE7F0]">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl text-[#10263D] tracking-tight">
                {storeName || 'Accessories'}
              </span>
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
                  onClick={() => onSelectCategory('cases')} 
                  className="footer-link-btn"
                >
                  {t.catCases}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('audio')} 
                  className="footer-link-btn"
                >
                  {t.catAudio}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('charging')} 
                  className="footer-link-btn"
                >
                  {t.catCharging}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('powerbanks')} 
                  className="footer-link-btn"
                >
                  {t.catPowerBanks}
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

          {/* Business & Operations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#10263D]">
              Operations
            </h4>
            <ul className="footer-nav-list">
              <li>
                <button 
                  onClick={onOpenAdmin} 
                  className="footer-link-btn font-medium"
                >
                  Store Admin Portal
                </button>
              </li>
              <li>
                <span className="text-slate-500 text-[11px]">
                  Storefront preview mode
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
            <span className="text-[11px] font-semibold text-[#10263D] mr-1">Payment Status:</span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[11px] shadow-2xs">
              Cash on Delivery (Demo Mode)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-500 font-medium text-[11px]">
              Online Gateways (Pending Configuration)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
