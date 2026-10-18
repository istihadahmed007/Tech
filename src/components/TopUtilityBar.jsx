import React from 'react';
import { Phone, Truck, Package, HelpCircle, Globe, ShieldCheck } from 'lucide-react';

export default function TopUtilityBar({
  onOpenTracking,
  onOpenSupport,
  lang = 'en',
  setLang,
  t = {}
}) {
  return (
    <div className="top-utility-bar w-full py-1.5 px-3 sm:px-6">
      <div className="container max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Store Care & Nationwide Delivery Notice */}
        <div className="flex items-center gap-4 text-[11px] sm:text-xs">
          <div className="hidden md:flex items-center gap-1.5 text-slate-300">
            <ShieldCheck size={13} className="text-[#60A5FA]" />
            <span>{lang === 'bn' ? '১০০% অরিজিনাল মোবাইল এক্সেসরিজ' : '100% Authentic Mobile Accessories'}</span>
          </div>
          <span className="hidden md:inline text-slate-600">•</span>
          <div className="flex items-center gap-1.5 text-slate-200 font-medium">
            <Truck size={13} className="text-[#60A5FA]" />
            <span>{lang === 'bn' ? '৳২,০০০+ অর্ডারে সারাদেশে ফ্রি ডেলিভারি' : 'Free Delivery Nationwide on Orders ৳2,000+'}</span>
          </div>
        </div>

        {/* Right: Order Tracking, Support & Language Switcher */}
        <div className="flex items-center gap-3 sm:gap-5 text-[11px] sm:text-xs ml-auto">
          <button
            type="button"
            onClick={() => onOpenTracking && onOpenTracking('')}
            className="top-utility-link font-medium cursor-pointer"
            title="Track delivery status"
          >
            <Package size={13} />
            <span>{lang === 'bn' ? 'অর্ডার ট্র্যাক' : 'Track Order'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenSupport}
            className="top-utility-link font-medium cursor-pointer"
            title="Customer Support & Warranty"
          >
            <HelpCircle size={13} />
            <span>{lang === 'bn' ? 'হেল্প ও সাপোর্ট' : 'Support'}</span>
          </button>

          <span className="text-slate-600 hidden xs:inline">|</span>

          {/* Bilingual Switcher */}
          <button
            type="button"
            onClick={() => setLang && setLang(lang === 'en' ? 'bn' : 'en')}
            className="top-utility-link font-semibold cursor-pointer bg-slate-800/80 px-2 py-0.5 rounded text-[11px] hover:bg-slate-700 transition-colors"
            title="Switch Language / ভাষা পরিবর্তন"
          >
            <Globe size={12} className="text-[#60A5FA]" />
            <span>{lang === 'en' ? 'বাংলা' : 'English'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
