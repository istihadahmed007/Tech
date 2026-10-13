import React from 'react';
import { Sparkles, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

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
    <footer className="w-full mt-20 pt-16 pb-12 border-t border-blue-200/60 bg-white/60 backdrop-blur-md">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-blue-100">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Sparkles size={16} />
              </div>
              <span className="font-extrabold text-xl text-[#112A43]">
                {storeName || t.brandName}
              </span>
            </div>
            <p className="text-xs text-[#4B637B] leading-relaxed max-w-sm">
              {t.footerAbout}
            </p>
            <div className="text-xs text-[#4B637B] space-y-1.5 pt-1">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-blue-600 shrink-0" />
                <span>Gulshan-2, Dhaka-1212, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-blue-600 shrink-0" />
                <span>+880 1700-000000 (Helpline)</span>
              </div>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#112A43]">
              Categories
            </h4>
            <ul className="text-xs text-[#4B637B] space-y-2">
              <li>
                <button onClick={() => onSelectCategory('cases')} className="hover:text-blue-600 transition-colors">
                  {t.catCases}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('audio')} className="hover:text-blue-600 transition-colors">
                  {t.catAudio}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('charging')} className="hover:text-blue-600 transition-colors">
                  {t.catCharging}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('powerbanks')} className="hover:text-blue-600 transition-colors">
                  {t.catPowerBanks}
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#112A43]">
              Assistance
            </h4>
            <ul className="text-xs text-[#4B637B] space-y-2">
              <li>
                <button onClick={onOpenTracking} className="hover:text-blue-600 transition-colors">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={onOpenSupport} className="hover:text-blue-600 transition-colors">
                  Warranty & Replacements
                </button>
              </li>
              <li>
                <button onClick={onOpenSupport} className="hover:text-blue-600 transition-colors">
                  Dhaka Shipping Times
                </button>
              </li>
              <li>
                <button onClick={onOpenSupport} className="hover:text-blue-600 transition-colors">
                  7-Day Return Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Business & Operations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#112A43]">
              Business
            </h4>
            <ul className="text-xs text-[#4B637B] space-y-2">
              <li>
                <button onClick={onOpenAdmin} className="text-slate-500 hover:text-blue-600 transition-colors font-medium">
                  Store Admin Portal
                </button>
              </li>
              <li>
                <a href="DESIGN.md" target="_blank" className="hover:text-blue-600 transition-colors">
                  Design Specifications (DESIGN.md)
                </a>
              </li>
              <li>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck size={13} />
                  SSL Secured Store
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip & Payment Methods */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#4B637B]">
          <p>{t.copyright}</p>

          {/* Payment Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-[#112A43] mr-1">Accepted in Bangladesh:</span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-pink-200 text-[#E2136E] font-bold text-[11px] shadow-2xs">
              bKash
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-orange-200 text-[#F7941D] font-bold text-[11px] shadow-2xs">
              Nagad
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-blue-700 font-bold text-[11px] shadow-2xs">
              VISA
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-red-600 font-bold text-[11px] shadow-2xs">
              Mastercard
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[#112A43] font-bold text-[11px] shadow-2xs">
              COD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
