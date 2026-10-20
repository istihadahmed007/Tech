import React from 'react';
import { Sparkles, ShieldCheck, Phone, MapPin, HelpCircle } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer({ 
  storeName, 
  onOpenSupport, 
  onOpenTracking, 
  onSelectCategory, 
  t, 
  lang 
}) {
  return (
    <footer className="w-full mt-16 sm:mt-24 border-t border-[#1E2230] bg-[#090A0F] text-zinc-400">
      <div className="container pt-12 sm:pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-12 border-b border-[#1E2230]">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center">
              <BrandLogo variant="dark" height={48} className="h-10 sm:h-12 w-auto" />
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm font-mono">
              {t.footerAbout || 'Tech Nest — Precision-engineered mobile accessories, GaN fast chargers, ANC acoustics, and wearable tech with 24-48h nationwide delivery.'}
            </p>
            <div className="text-xs font-mono text-zinc-400 space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <MapPin size={13} className="text-cyan-400 shrink-0" />
                <span>Dhaka, Bangladesh • Fast Nationwide Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle size={13} className="text-cyan-400 shrink-0" />
                <button 
                  type="button"
                  onClick={onOpenSupport}
                  className="text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                >
                  Contact support & warranty telemetry
                </button>
              </div>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
              Categories
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <button 
                  type="button"
                  onClick={() => onSelectCategory('audio')} 
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {t.catAudio || 'Audio & TWS'}
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => onSelectCategory('charging')} 
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {t.catCharging || 'GaN & Charging'}
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => onSelectCategory('wearables')} 
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {t.catWearables || 'Smartwatches'}
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => onSelectCategory(null)} 
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {t.allProducts || 'Master Catalog'}
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
              Assistance
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <button 
                  type="button"
                  onClick={onOpenTracking} 
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Track Dispatch Status
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={onOpenSupport} 
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Warranty & Diagnostics
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={onOpenSupport} 
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  Free Delivery Tiers (৳2,000+)
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={onOpenSupport} 
                  className="hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  7-Day Replacement Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Trust & Logistics */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
              {lang === 'bn' ? 'নিরাপত্তা ও ডেলিভারি' : 'Trust Protocol'}
            </h4>
            <ul className="text-xs font-mono space-y-2">
              <li className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck size={14} className="shrink-0" />
                <span>{lang === 'bn' ? '১০০% পরীক্ষিত আসল পণ্য' : '100% Quality Inspected'}</span>
              </li>
              <li className="flex items-center gap-1.5 text-cyan-400">
                <Sparkles size={14} className="shrink-0" />
                <span>{lang === 'bn' ? '৭ দিনের রিপ্লেসমেন্ট পলিসি' : '7-Day Replacement Policy'}</span>
              </li>
              <li>
                <span className="text-zinc-400 text-[11px]">
                  {lang === 'bn' ? 'সারা বাংলাদেশে ক্যাশ অন ডেলিভারি' : 'Nationwide Cash on Delivery (COD)'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip & Payment Methods */}
        <div className="pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
          <p>{t.copyright || '© 2026 Tech Nest. All rights reserved.'}</p>

          {/* Payment Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-zinc-400 mr-1">PAYMENTS:</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
              Cash on Delivery
            </span>
            <span className="px-2 py-0.5 rounded-md bg-pink-950/40 border border-pink-500/30 text-pink-400 font-bold text-[10px]">
              bKash
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-950/40 border border-amber-500/30 text-amber-400 font-bold text-[10px]">
              Nagad
            </span>
            <span className="px-2 py-0.5 rounded-md bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 font-bold text-[10px]">
              Visa / Mastercard
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#12141C] border border-[#1E2230] text-zinc-300 font-medium text-[10px] flex items-center gap-1">
              <ShieldCheck size={11} className="text-emerald-400" />
              <span>256-bit SSL</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
