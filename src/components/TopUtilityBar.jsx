import React from 'react';
import { Phone, Truck, Package, HelpCircle, Globe, ShieldCheck, Zap } from 'lucide-react';

export default function TopUtilityBar({
  onOpenTracking,
  onOpenSupport,
  lang = 'en',
  setLang,
  t = {}
}) {
  return (
    <div className="w-full bg-[#06101e] border-b border-white/10 text-slate-300 font-mono text-[11px] py-1.5 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Store Care & Nationwide Delivery Notice */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 text-slate-200 font-semibold">
            <ShieldCheck size={13} className="text-blue-400" />
            <span className="tracking-wide">{lang === 'bn' ? '১০০% অরিজিনাল মোবাইল এক্সেসরিজ' : '100% AUTHENTIC GEAR'}</span>
          </div>
          <span className="hidden md:inline text-slate-600">•</span>
          <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
            <Truck size={13} className="text-blue-400" />
            <span>
              {lang === 'bn' 
                ? '৳২,০০০+ অর্ডারে সারাদেশে ফ্রি ডেলিভারি' 
                : 'FREE NATIONWIDE DELIVERY ON ORDERS ৳2,000+'}
            </span>
          </div>
        </div>

        {/* Right: Order Tracking, Support & Language Switcher */}
        <div className="flex items-center gap-3 sm:gap-5 ml-auto">
          <button
            type="button"
            onClick={() => onOpenTracking && onOpenTracking('')}
            className="hover:text-blue-300 text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
            title="Track delivery status"
          >
            <Package size={12} className="text-slate-400 hover:text-blue-300" />
            <span>{lang === 'bn' ? 'অর্ডার ট্র্যাক' : 'TRACK ORDER'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenSupport}
            className="hover:text-blue-300 text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
            title="Customer Support & Warranty"
          >
            <HelpCircle size={12} className="text-slate-400 hover:text-blue-300" />
            <span>{lang === 'bn' ? 'হেল্প ও সাপোর্ট' : 'SUPPORT'}</span>
          </button>

          <span className="text-slate-600 hidden xs:inline">|</span>

          {/* Bilingual Switcher */}
          <button
            type="button"
            onClick={() => setLang && setLang(lang === 'en' ? 'bn' : 'en')}
            className="font-mono text-[11px] font-bold cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 text-white px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 shadow-2xs"
            title="Switch Language / ভাষা পরিবর্তন"
          >
            <Globe size={11} className="text-blue-400" />
            <span>{lang === 'en' ? 'BN' : 'EN'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
