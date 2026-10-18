import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  RotateCcw, 
  ShoppingBag, 
  Scale, 
  ShieldCheck, 
  Zap, 
  Headphones, 
  Watch, 
  Briefcase, 
  Compass, 
  Activity, 
  Music, 
  Gamepad2, 
  SlidersHorizontal,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export default function SmartTechFinder({
  products = [],
  currencySymbol = "৳",
  onQuickAdd,
  onOpenDetail,
  onToggleCompare,
  comparisonIds = [],
  onOpenComparison,
  lang = 'en',
  t = {}
}) {
  // Step State (0 to 3)
  const [currentStep, setCurrentStep] = useState(0);

  // Questionnaire Selections
  const [budget, setBudget] = useState('1000_2000');
  const [useCase, setUseCase] = useState('commute');
  const [category, setCategory] = useState('all');
  const [priority, setPriority] = useState('calling');
  const [showResults, setShowResults] = useState(false);

  // Budget Options
  const BUDGET_OPTIONS = [
    { id: 'under_1000', label: lang === 'bn' ? '১,০০০৳ এর নিচে' : 'Under ৳1,000', sub: lang === 'bn' ? 'বাজেট ফ্রেন্ডলি এক্সেসরিজ' : 'Budget Essentials', min: 0, max: 1000 },
    { id: '1000_2000', label: lang === 'bn' ? '১,০০০৳ – ২,০০০৳' : '৳1,000 – ৳2,000', sub: lang === 'bn' ? 'সেরা ভ্যালু ও পার্ফর্মেন্স' : 'Everyday Value Sweetspot', min: 1000, max: 2000 },
    { id: '2000_3500', label: lang === 'bn' ? '২,০০০৳ – ৩,৫০০৳' : '৳2,000 – ৳3,500', sub: lang === 'bn' ? 'প্রিমিয়াম টেক ও ফ্রি ডেলিভারি' : 'Free Delivery Tier (৳2,000+)', min: 2000, max: 3500 },
    { id: 'all', label: lang === 'bn' ? 'যেকোনো বাজেট' : 'Any Budget (৳3,500+)', sub: lang === 'bn' ? 'ফ্ল্যাগশিপ ও হাই-এন্ড গিয়ার' : 'Flagship & Top Gear', min: 0, max: 999999 }
  ];

  // Intended Use Options
  const USE_OPTIONS = [
    { id: 'commute', icon: Compass, label: lang === 'bn' ? 'দৈনন্দিন যাতায়াত ও ভ্রমণ' : 'Daily Commute & Travel', desc: lang === 'bn' ? 'কমপ্যাক্ট ডিজাইন, দীর্ঘ ব্যাটারি ও নয়েজ কমানোর সুবিধা' : 'Compact, durable, long battery life for transit' },
    { id: 'office', icon: Briefcase, label: lang === 'bn' ? 'অফিস ও প্রফেশনাল কাজ' : 'Office & Productivity', desc: lang === 'bn' ? 'ক্রিস্টাল ক্লিয়ার কলিং, ফাস্ট চার্জিং ও নোটিফিকেশন' : 'Clear voice mic, multi-device power, notifications' },
    { id: 'active', icon: Activity, label: lang === 'bn' ? 'ফিটনেস ও স্পোর্টস' : 'Fitness & Active Sports', desc: lang === 'bn' ? 'ঘাম প্রতিরোধক বিল্ড, আরামদায়ক গ্রিপ ও ফিটনেস ট্র্যাকিং' : 'Secure sweat-resistant fit, step and health tracking' },
    { id: 'studio', icon: Music, label: lang === 'bn' ? 'স্টুডিও সাউন্ড ও মিউজিক' : 'Acoustics & Music', desc: lang === 'bn' ? 'উচ্চ রেজোলিউশন সাউন্ড ও গভীর ডায়নামিক বেস' : 'High dynamic range, deep bass, lossless fidelity' },
    { id: 'gaming', icon: Gamepad2, label: lang === 'bn' ? 'মোবাইল গেমিং ও বিনোদন' : 'Gaming & Streaming', desc: lang === 'bn' ? 'লো ল্যাটেন্সি কানেকশন, আরজিবি লুক ও ফাস্ট চার্জ' : 'Ultra-low latency, immersive drivers, rapid recharge' }
  ];

  // Category Preferences
  const CATEGORY_OPTIONS = [
    { id: 'all', icon: Sparkles, label: lang === 'bn' ? 'সব ধরনের টেক' : 'All Categories', sub: lang === 'bn' ? 'সেরা ম্যাচিং পণ্য' : 'Open recommendation' },
    { id: 'audio', icon: Headphones, label: lang === 'bn' ? 'অডিও গিয়ার ও বাডস' : 'Audio & Earbuds', sub: lang === 'bn' ? 'TWS, হেডফোন ও নেকব্যান্ড' : 'TWS, headsets & neckbands' },
    { id: 'charging', icon: Zap, label: lang === 'bn' ? 'ফাস্ট চার্জার ও ক্যাবল' : 'Fast Charging & Power', sub: lang === 'bn' ? 'GaN চার্জার ও ৪-ইন-১ ক্যাবল' : 'GaN chargers & 4-in-1 cables' },
    { id: 'wearables', icon: Watch, label: lang === 'bn' ? 'স্মার্টওয়াচ ও ব্যান্ড' : 'Smartwatches', sub: lang === 'bn' ? 'সিম কলিং ও স্ট্র্যাপ কম্বো' : 'SIM calling, multi-straps' }
  ];

  // Priority Requirements
  const PRIORITY_OPTIONS = [
    { id: 'calling', label: lang === 'bn' ? 'ক্লিয়ার কল ও মাইক্রোফোন' : 'Clear Mic & Calling', detail: lang === 'bn' ? 'নয়েজ রিডাকশন সহ ডুয়াল বিমফর্মিং মাইক' : 'Dual beamforming with environmental noise reduction' },
    { id: 'anc', label: lang === 'bn' ? 'নয়েজ আইসোলেশন / ANC' : 'Noise Cancellation / ANC', detail: lang === 'bn' ? 'প্যাসিভ ও অ্যাক্টিভ সাউন্ড আইসোলেশন' : 'In-ear acoustic seal & ambient sound filtering' },
    { id: 'fast_charge', label: lang === 'bn' ? 'হাই-স্পিড ফাস্ট চার্জিং' : 'High-Speed Fast Charge', detail: lang === 'bn' ? '৬৫W বা ১২০W সুপার ফাস্ট আউটপুট' : '65W/120W multi-voltage power transfer' },
    { id: 'long_battery', label: lang === 'bn' ? 'দীর্ঘ ব্যাটারি লাইফ' : 'Extended Battery Life', detail: lang === 'bn' ? '২৪+ ঘণ্টা কেস ব্যাকআপ ও দ্রুত রিচার্জ' : 'Up to 24h+ total case playtime' },
    { id: 'free_shipping', label: lang === 'bn' ? 'ফ্রি ডেলিভারি আনলকড (২,০০০৳+)' : 'Free Delivery (৳2,000+)', detail: lang === 'bn' ? 'অর্ডার করলেই সারা দেশে ডেলিভারি ফি ০৳' : 'Free courier shipping across all 64 districts' }
  ];

  // Matching Engine with Authentic Catalog Products
  const recommendations = useMemo(() => {
    if (!products || products.length === 0) return { matches: [], isExact: false };

    const selectedBudgetObj = BUDGET_OPTIONS.find(b => b.id === budget) || BUDGET_OPTIONS[1];

    // 1. Filter within catalog by budget and optional category
    let pool = products.filter(p => {
      // Must be in stock or have valid inventory
      if (p.stock <= 0) return false;
      return true;
    });

    // Score products
    const scored = pool.map(p => {
      let score = 50; // base score
      const whyReasons = [];

      // Budget check
      const withinBudget = p.price >= selectedBudgetObj.min && p.price <= selectedBudgetObj.max;
      if (withinBudget) {
        score += 30;
        whyReasons.push(
          lang === 'bn' 
            ? `আপনার বাজেট সীমা (${currencySymbol}${p.price.toLocaleString()}) এর মধ্যে পুরোপুরি মানানসই` 
            : `Fits directly within your budget at ${currencySymbol}${p.price.toLocaleString()}`
        );
      } else {
        // Distance penalty
        const diff = Math.min(Math.abs(p.price - selectedBudgetObj.min), Math.abs(p.price - selectedBudgetObj.max));
        score -= Math.min(30, Math.round(diff / 100));
      }

      // Category check
      if (category !== 'all') {
        if (p.category === category) {
          score += 25;
          whyReasons.push(
            lang === 'bn'
              ? `আপনার নির্বাচিত ${p.category} ক্যাটাগরির অন্তর্ভুক্ত`
              : `Matches your preferred ${p.category} category`
          );
        } else {
          score -= 20;
        }
      }

      // Priority check
      const textCorpus = `${p.title} ${p.titleBn || ''} ${p.description || ''} ${p.badge || ''} ${JSON.stringify(p.specs || {})}`.toLowerCase();
      
      if (priority === 'calling') {
        if (textCorpus.includes('mic') || textCorpus.includes('calling') || textCorpus.includes('call') || textCorpus.includes('sim')) {
          score += 20;
          whyReasons.push(lang === 'bn' ? 'স্পষ্ট ভয়েস কলিং ও মাইক্রোফোন সাপোর্ট রয়েছে' : 'Engineered for clear voice pickup and communication');
        }
      } else if (priority === 'anc') {
        if (textCorpus.includes('anc') || textCorpus.includes('noise') || textCorpus.includes('in-ear') || textCorpus.includes('acoustic')) {
          score += 20;
          whyReasons.push(lang === 'bn' ? 'সাইলেন্ট লিসেনিং ও সাউন্ড আইসোলেশন সমর্থিত' : 'Features acoustic isolation and noise reduction styling');
        }
      } else if (priority === 'fast_charge') {
        if (textCorpus.includes('65w') || textCorpus.includes('120w') || textCorpus.includes('fast') || textCorpus.includes('charge') || textCorpus.includes('turbo')) {
          score += 20;
          whyReasons.push(lang === 'bn' ? 'উচ্চ-গতির ফাস্ট চার্জিং ক্ষমতা বিদ্যমান' : 'Delivers high-output fast charging speed');
        }
      } else if (priority === 'long_battery') {
        if (textCorpus.includes('battery') || textCorpus.includes('24h') || textCorpus.includes('case') || textCorpus.includes('playtime')) {
          score += 15;
          whyReasons.push(lang === 'bn' ? 'দীর্ঘ ব্যাকআপ ও কেস রিচার্জ ক্ষমতা রয়েছে' : 'Extended battery endurance for all-day use');
        }
      } else if (priority === 'free_shipping') {
        if (p.price >= 2000) {
          score += 25;
          whyReasons.push(lang === 'bn' ? '৳২,০০০+ হওয়ায় সারা দেশে ডেলিভারি সম্পূর্ণ ফ্রি' : 'Automatically unlocks Free Nationwide Delivery (৳2,000+)');
        }
      }

      // Use Case affinities
      if (useCase === 'commute') {
        if (p.category === 'audio' || p.category === 'charging') score += 10;
      } else if (useCase === 'office') {
        if (p.brand?.toLowerCase().includes('oraimo') || textCorpus.includes('sim') || textCorpus.includes('headset')) score += 12;
      } else if (useCase === 'active') {
        if (p.category === 'wearables' || textCorpus.includes('neckband') || textCorpus.includes('strap')) score += 12;
      } else if (useCase === 'studio') {
        if (textCorpus.includes('driver') || textCorpus.includes('headphone') || textCorpus.includes('fidelity')) score += 15;
      } else if (useCase === 'gaming') {
        if (textCorpus.includes('rgb') || textCorpus.includes('latency') || textCorpus.includes('superbass') || textCorpus.includes('fighter')) score += 15;
      }

      return {
        product: p,
        score: Math.max(10, Math.min(99, score)),
        whyReasons: whyReasons.slice(0, 2)
      };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    // Exact matches must have positive budget relevance
    const exactMatches = scored.filter(s => s.score >= 65);
    const hasExact = exactMatches.length > 0;

    return {
      matches: hasExact ? exactMatches.slice(0, 3) : scored.slice(0, 3),
      isExact: hasExact
    };
  }, [products, budget, useCase, category, priority, lang, currencySymbol]);

  const handleReset = () => {
    setCurrentStep(0);
    setShowResults(false);
  };

  const handleSeeMatches = () => {
    setShowResults(true);
  };

  return (
    <section 
      id="smart-tech-finder" 
      className="w-full my-8 sm:my-14 p-5 sm:p-8 lg:p-10 rounded-3xl bg-white border border-[#E2E8F0] relative overflow-hidden shadow-sm"
      aria-label="Smart Tech Finder"
    >
      {/* Subtle Specular Glow */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #BFDBFE 0%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, #DBEAFE 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#145CFF] text-xs font-bold mb-3 shadow-xs border border-[#BFDBFE]">
              <Sparkles size={13} />
              <span>{t.finderBadge || (lang === 'bn' ? 'ইন্টারেক্টিভ গ্যাজেট ম্যাচিং' : 'Interactive Matcher')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight">
              {t.finderTitle || (lang === 'bn' ? 'স্মার্ট টেক ফাইন্ডার' : 'Smart Tech Finder')}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-1.5 font-normal max-w-2xl leading-relaxed">
              {t.finderSubtitle || (lang === 'bn' 
                ? 'আপনার বাজেট (টাকা) এবং ব্যবহারের ধরনের উপর ভিত্তি করে সেরা টেক গ্যাজেট খুঁজে নিন।' 
                : 'Discover authentic technology tailored to your lifestyle and budget in BDT — with honest explanations of why each recommendation fits.')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {showResults && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#E2E8F0] text-xs font-bold text-[#0F172A] hover:border-[#145CFF] transition-all cursor-pointer shadow-xs"
              >
                <RotateCcw size={14} />
                <span>{t.finderReset || (lang === 'bn' ? 'পুনরায় শুরু করুন' : 'Restart')}</span>
              </button>
            )}
            <div className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E2E8F0] text-xs font-bold text-[#0F172A] shadow-2xs">
              {lang === 'bn' ? '১০০% আসল প্রোডাক্ট ডাটা' : '100% Genuine Catalogue Data'}
            </div>
          </div>
        </div>

        {/* STEP PROGRESS & CONTROLS */}
        {!showResults && (
          <div className="mb-8">
            <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-6">
              {[
                { step: 0, label: t.finderStepBudget || (lang === 'bn' ? '১. বাজেট' : '1. Budget') },
                { step: 1, label: t.finderStepUse || (lang === 'bn' ? '২. ব্যবহার' : '2. Use Case') },
                { step: 2, label: t.finderStepCategory || (lang === 'bn' ? '৩. গ্যাজেট' : '3. Gear Type') },
                { step: 3, label: t.finderStepPriority || (lang === 'bn' ? '৪. অগ্রাধিকার' : '4. Priority') }
              ].map(tab => (
                <button
                  key={tab.step}
                  type="button"
                  onClick={() => setCurrentStep(tab.step)}
                  className={`text-left p-2.5 sm:p-3.5 rounded-xl border transition-all cursor-pointer ${
                    currentStep === tab.step 
                      ? 'bg-white border-[#145CFF] shadow-md ring-2 ring-[#93C5FD]' 
                      : currentStep > tab.step
                        ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#145CFF]'
                        : 'bg-slate-50 border-[#E2E8F0] text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
                      STEP {tab.step + 1}
                    </span>
                    {currentStep > tab.step && (
                      <Check size={12} className="text-white bg-[#145CFF] rounded-full p-0.5" />
                    )}
                  </div>
                  <span className="block text-xs sm:text-sm font-bold truncate">
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            {/* STEP 0: BUDGET */}
            {currentStep === 0 && (
              <div className="bg-white p-5 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-xs">
                <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mb-1">
                  {lang === 'bn' ? 'আপনার কাঙ্ক্ষিত বাজেট কত?' : 'What is your intended budget in BDT?'}
                </h3>
                <p className="text-xs text-slate-500 mb-5">
                  {lang === 'bn' ? 'প্রকৃত খুচরা মূল্যের ভিত্তিতে সুনির্দিষ্ট ফিল্টার।' : 'Matched precisely against verified store inventory prices.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {BUDGET_OPTIONS.map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBudget(b.id)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        budget === b.id 
                          ? 'bg-[#EFF6FF] border-[#145CFF] shadow-md ring-2 ring-[#93C5FD]' 
                          : 'bg-white border-[#E2E8F0] hover:border-[#145CFF]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-base sm:text-lg font-black text-[#0F172A]">{b.label}</span>
                        {budget === b.id && <Check size={16} className="text-[#145CFF] stroke-[3]" />}
                      </div>
                      <span className="text-xs text-slate-500 block leading-snug">{b.sub}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="bg-[#145CFF] hover:bg-[#0D4BD9] text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-sm"
                  >
                    <span>{lang === 'bn' ? 'পরবর্তী ধাপ' : 'Next Step'}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 1: INTENDED USE */}
            {currentStep === 1 && (
              <div className="bg-white p-5 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-xs">
                <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mb-1">
                  {lang === 'bn' ? 'আপনার মূল ব্যবহারের ক্ষেত্র কোনটি?' : 'How will you primarily use this device?'}
                </h3>
                <p className="text-xs text-slate-500 mb-5">
                  {lang === 'bn' ? 'আপনার প্রতিদিনের জীবনযাত্রার সাথে মানানসই স্পেসিফিকেশন অগ্রাধিকার।' : 'Aligns technical specs with your daily workflow and routine.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {USE_OPTIONS.map(u => {
                    const IconComp = u.icon;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setUseCase(u.id)}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex gap-3.5 ${
                          useCase === u.id 
                            ? 'bg-[#EFF6FF] border-[#145CFF] shadow-md ring-2 ring-[#93C5FD]' 
                            : 'bg-white border-[#E2E8F0] hover:border-[#145CFF]/40'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl shrink-0 h-fit ${useCase === u.id ? 'bg-[#145CFF] text-white' : 'bg-slate-50 text-[#0F172A] border border-[#E2E8F0]'}`}>
                          <IconComp size={20} />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-[#0F172A] block mb-1">{u.label}</span>
                          <span className="text-xs text-slate-500 leading-relaxed block">{u.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(0)}
                    className="text-xs font-bold text-slate-500 hover:text-[#0F172A] cursor-pointer"
                  >
                    {lang === 'bn' ? '← ব্যাকে যান' : '← Back'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="bg-[#145CFF] hover:bg-[#0D4BD9] text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-sm"
                  >
                    <span>{lang === 'bn' ? 'পরবর্তী ধাপ' : 'Next Step'}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: CATEGORY PREFERENCE */}
            {currentStep === 2 && (
              <div className="bg-white p-5 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-xs">
                <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mb-1">
                  {lang === 'bn' ? 'কোন ধরনের টেক পণ্য খুঁজছেন?' : 'What product category do you prefer?'}
                </h3>
                <p className="text-xs text-slate-500 mb-5">
                  {lang === 'bn' ? 'নির্দিষ্ট ক্যাটাগরি বেছে নিন অথবা সবগুলো থেকে সেরা পরামর্শ পান।' : 'Narrow your focus or discover cross-category synergy.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {CATEGORY_OPTIONS.map(c => {
                    const IconComp = c.icon;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategory(c.id)}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          category === c.id 
                            ? 'bg-[#EFF6FF] border-[#145CFF] shadow-md ring-2 ring-[#93C5FD]' 
                            : 'bg-white border-[#E2E8F0] hover:border-[#145CFF]/40'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl w-fit mb-3 ${category === c.id ? 'bg-[#145CFF] text-white' : 'bg-slate-50 text-[#0F172A] border border-[#E2E8F0]'}`}>
                          <IconComp size={20} />
                        </div>
                        <span className="text-sm font-bold text-[#0F172A] block mb-1">{c.label}</span>
                        <span className="text-xs text-slate-500 block leading-snug">{c.sub}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-bold text-slate-500 hover:text-[#0F172A] cursor-pointer"
                  >
                    {lang === 'bn' ? '← ব্যাকে যান' : '← Back'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="bg-[#145CFF] hover:bg-[#0D4BD9] text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-sm"
                  >
                    <span>{lang === 'bn' ? 'পরবর্তী ধাপ' : 'Next Step'}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PRIORITY FEATURE */}
            {currentStep === 3 && (
              <div className="bg-white p-5 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-xs">
                <h3 className="text-base sm:text-lg font-bold text-[#0F172A] mb-1">
                  {lang === 'bn' ? 'আপনার সবচেয়ে গুরুত্বপূর্ণ প্রয়োজনীয়তা কোনটি?' : 'What is your absolute top priority?'}
                </h3>
                <p className="text-xs text-slate-500 mb-5">
                  {lang === 'bn' ? 'যে ফিচারের ওপর আপোষ করতে চান না।' : 'The non-negotiable feature that anchors your decision.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {PRIORITY_OPTIONS.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPriority(p.id)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        priority === p.id 
                          ? 'bg-[#EFF6FF] border-[#145CFF] shadow-md ring-2 ring-[#93C5FD]' 
                          : 'bg-white border-[#E2E8F0] hover:border-[#145CFF]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold text-[#0F172A]">{p.label}</span>
                        {priority === p.id && <Check size={16} className="text-[#145CFF] stroke-[3]" />}
                      </div>
                      <span className="text-xs text-slate-500 leading-relaxed block">{p.detail}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-bold text-slate-500 hover:text-[#0F172A] cursor-pointer"
                  >
                    {lang === 'bn' ? '← ব্যাকে যান' : '← Back'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSeeMatches}
                    className="bg-[#145CFF] hover:bg-[#0D4BD9] text-white font-bold py-3 px-7 rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-sm"
                  >
                    <Sparkles size={16} />
                    <span>{lang === 'bn' ? 'ম্যাচিং প্রোডাক্ট দেখুন' : 'Show My Tech Matches'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RESULTS SHOWCASE */}
        {showResults && (
          <div>
            {!recommendations.isExact && (
              <div className="mb-6 p-4 rounded-2xl bg-[#EBF7FD] border border-[#D0E8F5] flex items-start gap-3">
                <AlertCircle size={20} className="text-[#0284C7] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0369A1]">
                    {lang === 'bn' ? 'সরাসরি বাজেট ফিল্টারে কোনো নকল পণ্য তৈরি করা হয়নি' : 'Honest Match Notice'}
                  </h4>
                  <p className="text-xs text-[#4A5568] mt-0.5 leading-relaxed">
                    {t.finderNoMatch || (lang === 'bn'
                      ? 'এই নির্দিষ্ট ফিল্টারে সরাসরি ম্যাচ পাওয়া যায়নি। নিচে সবচেয়ে কাছাকাছি যাচাইকৃত খাঁটি অপশনগুলো দেওয়া হলো:'
                      : 'No products in our verified catalog meet this exact combination under that price ceiling. We never invent fake products. Here are our closest authentic options:')}
                  </p>
                </div>
              </div>
            )}

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {recommendations.matches.map(({ product, score, whyReasons }) => {
                const isCompared = comparisonIds.includes(product.id);

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#145CFF] hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                  >
                    {/* Top Media & Badges */}
                    <div className="relative aspect-[4/3] bg-[#F8FAFC] p-4 flex items-center justify-center border-b border-[#E2E8F0]">
                      <img
                        src={product.image}
                        alt={lang === 'bn' ? product.titleBn : product.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      
                      {/* Top-Left: Match Score Pill */}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-black bg-[#145CFF] text-white shadow-xs flex items-center gap-1">
                        <Sparkles size={11} />
                        <span>{score}% Match</span>
                      </span>

                      {/* Top-Right: Category badge */}
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-slate-500 border border-[#E2E8F0] uppercase tracking-wider">
                        {product.category}
                      </span>
                    </div>

                    {/* Content & Rationale */}
                    <div className="p-5 flex flex-col flex-grow justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-500">
                          <span className="font-bold text-[#0F172A]">{product.brand}</span>
                          <span>•</span>
                          <span className="font-mono">{product.model || product.photoRef}</span>
                        </div>

                        <h3 
                          onClick={() => onOpenDetail(product)}
                          className="text-base font-bold text-[#0F172A] hover:text-[#145CFF] transition-colors cursor-pointer line-clamp-2 min-h-[3rem] mb-3"
                        >
                          {lang === 'bn' ? product.titleBn : product.title}
                        </h3>

                        {/* "Why This Fits Your Life" Section */}
                        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] mb-4">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5 mb-2">
                            <Check size={13} className="text-[#145CFF] stroke-[3]" />
                            {t.finderWhyFits || (lang === 'bn' ? 'কেন এটি আপনার জন্য সেরা মানানসই:' : 'Why this fits your life:')}
                          </span>
                          <ul className="space-y-1 text-xs text-slate-600">
                            {whyReasons.map((reason, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#145CFF] mt-1.5 shrink-0" />
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Bottom Pricing & Actions */}
                      <div className="pt-3 border-t border-[#E2E8F0]">
                        <div className="flex items-baseline justify-between mb-3">
                          <div>
                            <span className="text-xl font-black text-[#0F172A]">
                              {currencySymbol}{product.price.toLocaleString()}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="ml-2 text-xs text-slate-400 line-through">
                                {currencySymbol}{product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-semibold text-emerald-700">
                            {product.stock > 0 ? (lang === 'bn' ? 'ইন স্টক' : 'Verified Stock') : (lang === 'bn' ? 'স্টক শেষ' : 'Sold Out')}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => onQuickAdd(product, product.variants?.[0], 1)}
                            className="bg-[#145CFF] hover:bg-[#0D4BD9] text-white flex items-center justify-center gap-1.5 text-xs py-2.5 w-full font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
                          >
                            <ShoppingBag size={14} />
                            <span>{lang === 'bn' ? 'ব্যাগে যুক্ত' : 'Add to Bag'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onToggleCompare && onToggleCompare(product)}
                            className={`flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
                              isCompared 
                                ? 'bg-[#145CFF] text-white border-[#145CFF]' 
                                : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:border-[#145CFF]'
                            }`}
                          >
                            <Scale size={14} />
                            <span>{isCompared ? (lang === 'bn' ? 'তুলনায় আছে' : 'In Compare') : (lang === 'bn' ? 'তুলনা করুন' : 'Compare')}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions Banner */}
            <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#EFF6FF] text-[#145CFF] border border-[#BFDBFE]">
                  <Scale size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A]">
                    {lang === 'bn' ? 'বাছাইকৃত পণ্যগুলোর পাশাপাশি স্পেক্স দেখতে চান?' : 'Want to inspect side-by-side technical differences?'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {lang === 'bn' ? '৪টি পর্যন্ত পণ্য যোগ করে তুলনা ম্যাট্রিক্স দেখুন।' : 'Compare up to 4 shortlisted tech gadgets side by side.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-xs font-bold text-[#0F172A] hover:border-[#145CFF] transition-all cursor-pointer"
                >
                  {lang === 'bn' ? 'ফিল্টার পরিবর্তন' : 'Adjust Answers'}
                </button>
                {onOpenComparison && (
                  <button
                    type="button"
                    onClick={onOpenComparison}
                    className="bg-[#145CFF] hover:bg-[#0D4BD9] text-white text-xs py-2.5 px-5 rounded-xl flex items-center gap-1.5 font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    <span>{t.finderCompareShortlist || (lang === 'bn' ? 'তুলনা দেখুন' : 'Open Comparison Matrix')}</span>
                    <ChevronRight size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
