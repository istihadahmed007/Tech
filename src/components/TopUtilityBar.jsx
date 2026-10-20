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
    <div className="w-full bg-[#050608] border-b border-[#1E2230] text-zinc-400 font-mono text-[11px] py-1.5 px-3 sm:px-6">
      <div className="container max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Store Care & Nationwide Delivery Notice */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 text-zinc-300">
            <ShieldCheck size={12} className="text-emerald-400" />
            <span className="tracking-wide">{lang === 'bn' ? '১০০% অরিজিনাল মোবাইল এক্সেসরিজ' : '100% AUTHENTIC GEAR'}</span>
          </div>
          <span className="hidden md:inline text-zinc-700">•</span>
          <div className="flex items-center gap-1.5 text-zinc-200">
            <Truck size={12} className="text-cyan-400" />
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
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Track delivery status"
          >
            <Package size={12} className="text-zinc-500 hover:text-cyan-400" />
            <span>{lang === 'bn' ? 'অর্ডার ট্র্যাক' : 'TRACK ORDER'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenSupport}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Customer Support & Warranty"
          >
            <HelpCircle size={12} className="text-zinc-500 hover:text-cyan-400" />
            <span>{lang === 'bn' ? 'হেল্প ও সাপোর্ট' : 'SUPPORT'}</span>
          </button>

          <span className="text-zinc-700 hidden xs:inline">|</span>

          {/* Bilingual Switcher */}
          <button
            type="button"
            onClick={() => setLang && setLang(lang === 'en' ? 'bn' : 'en')}
            className="font-mono text-[11px] font-semibold cursor-pointer bg-[#12141C] border border-[#1E2230] text-zinc-300 hover:text-cyan-400 px-2 py-0.5 rounded transition-colors flex items-center gap-1"
            title="Switch Language / ভাষা পরিবর্তন"
          >
            <Globe size={11} className="text-cyan-400" />
            <span>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
