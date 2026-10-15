import React, { useState } from 'react';
import Hero3DCanvas from './3d/Hero3DCanvas';
import { ArrowRight, ShieldCheck, Zap, Sparkles, Cpu, Layers } from 'lucide-react';

export default function Interactive3DShowcase({
  onSelectProduct,
  onShopClick,
  lang = 'en'
}) {
  const [activeShowcaseKey, setActiveShowcaseKey] = useState('audio');

  const SHOWCASE_DATA = {
    audio: {
      productId: 'h2-anc-pro-tws',
      eyebrow: lang === 'bn' ? 'অ্যাকোস্টিক ইঞ্জিনিয়ারিং' : 'ACOUSTIC ENGINEERING',
      title: lang === 'bn' ? 'এইচ২ এএনসি প্রো ফ্ল্যাগশিপ টিডব্লিউএস' : 'H2 ANC Pro Active Noise Cancelling TWS',
      desc: lang === 'bn'
        ? '১৩মিমি টাইটানিয়াম ড্রাইভার, কোয়াড-মাইক এনভায়রনমেন্টাল নয়েজ ক্যান্সেলেশন এবং লো-লেটেন্সি গেমিং মোড।'
        : 'Engineered with 13mm titanium diaphragm drivers, hybrid active noise cancellation, and sub-40ms gaming latency.',
      specs: [
        { label: lang === 'bn' ? 'নয়েজ রিডাকশন' : 'Noise Reduction', val: '-35dB Hybrid ANC' },
        { label: lang === 'bn' ? 'ব্যাটারি লাইফ' : 'Playback Time', val: '32h Total' },
        { label: lang === 'bn' ? 'কানেক্টিভিটি' : 'Connectivity', val: 'Bluetooth 5.3' },
        { label: lang === 'bn' ? 'ওয়াটার রেজিস্ট্যান্স' : 'Water Resistance', val: 'IPX5 Splash' }
      ]
    },
    wearables: {
      productId: 'y80-ultra-smartwatch',
      eyebrow: lang === 'bn' ? 'অ্যারোস্পেস অ্যালয়' : 'AEROSPACE GRADE ALLOY',
      title: lang === 'bn' ? 'ওয়াই৮০ আল্ট্রা সেলুলার স্মার্টওয়াচ' : 'Y80 Ultra Cellular Smartwatch Edition',
      desc: lang === 'bn'
        ? 'ম্যাসিভ ২.০২ ইঞ্চি হাই-ব্রাইটনেস ডিসপ্লে, অরেঞ্জ অ্যাকসেন্ট রোটারি ক্রাউন ও টেকসই ওশেন লুপ স্ট্র্যাপ।'
        : 'High-contrast 2.02" edge-to-edge sapphire glass display housed in a brushed titanium chassis with optical sensor array.',
      specs: [
        { label: lang === 'bn' ? 'ডিসপ্লে' : 'Display Glass', val: '2.02" Sapphire Glass' },
        { label: lang === 'bn' ? 'বডি ম্যাটেরিয়াল' : 'Chassis Material', val: 'Titanium Finish' },
        { label: lang === 'bn' ? 'কানেক্টিভিটি' : 'Calling', val: 'HD Bluetooth Call' },
        { label: lang === 'bn' ? 'স্ট্র্যাপ' : 'Band Style', val: 'Ocean Loop Band' }
      ]
    },
    charging: {
      productId: 'recrsi-4in1-65w-cable',
      eyebrow: lang === 'bn' ? 'ক্রায়োজেনিক থার্মাল' : 'CRYOGENIC THERMAL EFFICIENCY',
      title: lang === 'bn' ? 'রেকর্সি ৬৫ওয়াট ফাস্ট চার্জিং কম্বো' : 'Recrsi 65W GaN Fast Charging Duo',
      desc: lang === 'bn'
        ? 'গ্যালিয়াম নাইট্রাইড (GaN) প্রযুক্তি, ব্রেইডেড অ্যান্টি-ট্যাঙ্গেল ৪-ইন-১ ক্যাবল এবং ওভার-ভোল্টেজ প্রটেকশন।'
        : 'Advanced Gallium Nitride semiconductors delivering cooler, 3x faster multi-device charging across Type-C and Lightning.',
      specs: [
        { label: lang === 'bn' ? 'সর্বোচ্চ পাওয়ার' : 'Max Power Output', val: '65W Power Delivery' },
        { label: lang === 'bn' ? 'ক্যাবল কোর' : 'Cable Core', val: 'High-Density Nylon' },
        { label: lang === 'bn' ? 'সেফটি গার্ড' : 'Safety Features', val: 'Smart IC Thermal Cut' },
        { label: lang === 'bn' ? 'পোর্ট সাপোর্ট' : 'Port Matrix', val: 'Dual Type-C + USB-A' }
      ]
    }
  };

  const current = SHOWCASE_DATA[activeShowcaseKey];

  return (
    <section className="relative w-full max-w-[1320px] mx-auto my-12 px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-[#DCE7F0] text-[#145CFF] text-[11px] font-bold tracking-wider uppercase mb-3 shadow-2xs">
          <Sparkles size={13} />
          <span>{lang === 'bn' ? 'গ্লেসিয়াল টেক প্রিসিশন ল্যাব' : 'Glacial Tech Precision Lab'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#10263D] tracking-tight mb-3">
          {lang === 'bn' ? 'ইন্টারেক্টিভ ৩ডি প্রযুক্তি অভিজ্ঞতা' : 'Experience Technology in 3D Space'}
        </h2>
        <p className="text-sm sm:text-base text-[#52677B]">
          {lang === 'bn'
            ? 'প্রতিটি পণ্যের ফিনিশ, পোর্ট এবং ক্রাফটসম্যানশিপ ৩৬০ ডিগ্রিতে পরীক্ষা করুন।'
            : 'Inspect brushed titanium details, acoustic chambers, and precision ports in real-time WebGL.'}
        </p>
      </div>

      {/* Main 3D Interactive Card */}
      <div className="bg-gradient-to-br from-[#F4F9FE] via-[#EBF4FD] to-[#E3EFFB] rounded-3xl border border-[#D8E6F3] p-4 sm:p-8 lg:p-10 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Column: Product Details & Specs */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              {/* Category selector pills */}
              <div className="inline-flex flex-wrap items-center gap-1.5 p-1 bg-white/90 backdrop-blur-md rounded-2xl border border-[#D0E2F2] mb-5 shadow-2xs max-w-full">
                <button
                  type="button"
                  onClick={() => setActiveShowcaseKey('audio')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeShowcaseKey === 'audio'
                      ? 'bg-[#145CFF] text-white shadow-xs'
                      : 'text-[#52677B] hover:text-[#10263D]'
                  }`}
                >
                  {lang === 'bn' ? 'অডিও' : 'Audio TWS'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveShowcaseKey('wearables')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeShowcaseKey === 'wearables'
                      ? 'bg-[#145CFF] text-white shadow-xs'
                      : 'text-[#52677B] hover:text-[#10263D]'
                  }`}
                >
                  {lang === 'bn' ? 'স্মার্টওয়াচ' : 'Ultra Watch'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveShowcaseKey('charging')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeShowcaseKey === 'charging'
                      ? 'bg-[#145CFF] text-white shadow-xs'
                      : 'text-[#52677B] hover:text-[#10263D]'
                  }`}
                >
                  {lang === 'bn' ? 'চার্জার' : '65W GaN'}
                </button>
              </div>

              {/* Eyebrow */}
              <span className="block text-[11px] font-bold tracking-[0.14em] text-[#145CFF] uppercase mb-2">
                {current.eyebrow}
              </span>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#10263D] tracking-tight leading-snug mb-3">
                {current.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#52677B] leading-relaxed mb-6">
                {current.desc}
              </p>

              {/* Hardware Specifications Grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-8">
                {current.specs.map((s, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/80 border border-[#DCE7F0] shadow-2xs">
                    <span className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1">
                      {s.label}
                    </span>
                    <span className="block text-xs sm:text-sm font-extrabold text-[#10263D]">
                      {s.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onSelectProduct && onSelectProduct(current.productId)}
                className="px-6 py-3 rounded-xl bg-[#145CFF] hover:bg-[#0D4BD9] active:scale-[0.98] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                <span>{lang === 'bn' ? 'পণ্য বিস্তারিত দেখুন' : 'View Full Details'}</span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                onClick={onShopClick}
                className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-[#10263D] font-semibold text-xs sm:text-sm border border-[#DCE7F0] shadow-2xs transition-colors"
              >
                <span>{lang === 'bn' ? 'সব পণ্য ব্রাউজ করুন' : 'Browse Catalog'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Embedded 3D Canvas */}
          <div className="lg:col-span-7">
            <Hero3DCanvas
              activeProductType={activeShowcaseKey}
              onSelectProductType={setActiveShowcaseKey}
              lang={lang}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
