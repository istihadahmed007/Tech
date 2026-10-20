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
  ChevronRight,
  AlertCircle,
  Terminal,
  Cpu
} from 'lucide-react';
import { getHardwareGrade, formatCleanSku } from '../utils/hardwareGrade';

export default function SmartTechFinder({
  products = [],
  excludeProductIds = [],
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

  // Agent Diagnostic Simulation State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [logStep, setLogStep] = useState(0);

  const triggerAgentAnalysis = (nextAction) => {
    setIsAnalyzing(true);
    setLogStep(1);
    setTimeout(() => setLogStep(2), 150);
    setTimeout(() => setLogStep(3), 320);
    setTimeout(() => {
      setIsAnalyzing(false);
      if (nextAction) nextAction();
    }, 480);
  };

  // Budget Options
  const BUDGET_OPTIONS = [
    { id: 'under_1000', label: lang === 'bn' ? '১,০০০৳ এর নিচে' : 'Under ৳1,000', sub: lang === 'bn' ? 'বাজেট ফ্রেন্ডলি এক্সেসরিজ' : 'Budget Essentials', min: 0, max: 1000 },
    { id: '1000_2000', label: lang === 'bn' ? '১,০০০৳ – ২,০০০৳' : '৳1,000 – ৳2,000', sub: lang === 'bn' ? 'সেরা ভ্যালু ও পার্ফর্মেন্স' : 'Everyday Sweetspot', min: 1000, max: 2000 },
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

    let pool = products.filter(p => p.stock > 0);

    // Deduplicate candidate pool by unique ID / SKU
    const seenPoolIds = new Set();
    pool = pool.filter(p => {
      const key = p.id || p.sku;
      if (!key || seenPoolIds.has(key)) return false;
      seenPoolIds.add(key);
      return true;
    });

    // Cross-section separation: prioritize eligible products not already shown in primary standalone grid
    if (excludeProductIds && excludeProductIds.length > 0) {
      const excludeSet = new Set(excludeProductIds);
      const nonExcludedPool = pool.filter(p => !excludeSet.has(p.id));
      if (nonExcludedPool.length >= 3) {
        pool = nonExcludedPool;
      }
    }

    const scored = pool.map(p => {
      let score = 55;
      const whyReasons = [];

      const withinBudget = p.price >= selectedBudgetObj.min && p.price <= selectedBudgetObj.max;
      if (withinBudget) {
        score += 30;
        whyReasons.push(
          lang === 'bn' 
            ? `বাজেট রেঞ্জ (${currencySymbol}${selectedBudgetObj.min.toLocaleString()} – ${currencySymbol}${selectedBudgetObj.max.toLocaleString()}) এর মধ্যে নির্ভরযোগ্য আউটপুট`
            : `Within your targeted budget target (${currencySymbol}${selectedBudgetObj.min.toLocaleString()} – ${currencySymbol}${selectedBudgetObj.max.toLocaleString()})`
        );
      }

      if (category !== 'all') {
        if (category === 'audio' && p.category === 'audio') score += 20;
        if (category === 'charging' && p.category === 'charging') score += 20;
        if (category === 'wearables' && p.category === 'wearables') score += 20;
      }

      const textCorpus = `${p.title || ''} ${p.description || ''} ${p.badge || ''} ${JSON.stringify(p.specs || {})}`.toLowerCase();

      if (priority === 'calling') {
        if (textCorpus.includes('mic') || textCorpus.includes('calling') || textCorpus.includes('sim') || textCorpus.includes('callcenter')) {
          score += 20;
          whyReasons.push(lang === 'bn' ? 'স্পষ্ট অডিও ও বিশ্বস্ত ভয়েস পিকআপের জন্য নির্বাচিত' : 'Selected for clear voice acoustic clarity and verified microphone fidelity');
        }
      } else if (priority === 'anc') {
        if (textCorpus.includes('anc') || textCorpus.includes('noise') || textCorpus.includes('isolation')) {
          score += 25;
          whyReasons.push(lang === 'bn' ? 'নয়েজ কমানোর জন্য ইন-ইয়ার সিলযুক্ত ডিজাইন' : 'Engineered acoustic chamber for ambient noise isolation');
        }
      } else if (priority === 'fast_charge') {
        if (textCorpus.includes('120w') || textCorpus.includes('65w') || textCorpus.includes('fast') || textCorpus.includes('turbo') || textCorpus.includes('gan')) {
          score += 25;
          whyReasons.push(lang === 'bn' ? 'হাই-স্পিড টার্বো চার্জিং আর্কিটেকচার' : 'High-density multi-voltage fast-charging circuitry');
        }
      } else if (priority === 'free_shipping') {
        if (p.price >= 2000) {
          score += 25;
          whyReasons.push(lang === 'bn' ? '৳২,০০০+ হওয়ায় সারাদেশে ডেলিভারি সম্পূর্ণ ফ্রি' : 'Automatically unlocks Free Nationwide Delivery (৳2,000+ saves ৳120 courier fee)');
        }
      }

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

      if (whyReasons.length === 0) {
        whyReasons.push(lang === 'bn' ? 'যাচাইকৃত পারফরম্যান্স ও বিল্ড কোয়ালিটি' : 'Selected for verified performance and durable daily hardware stability');
      }

      return {
        product: p,
        score: Math.max(70, Math.min(99, score)),
        whyReasons: whyReasons.slice(0, 2)
      };
    });

    scored.sort((a, b) => b.score - a.score);
    const exactMatches = scored.filter(s => s.score >= 75);
    const hasExact = exactMatches.length > 0;

    return {
      matches: hasExact ? exactMatches.slice(0, 3) : scored.slice(0, 3),
      isExact: hasExact
    };
  }, [products, excludeProductIds, budget, useCase, category, priority, lang, currencySymbol]);

  const handleReset = () => {
    setCurrentStep(0);
    setShowResults(false);
  };

  const handleStepAdvance = (nextStepIndex) => {
    triggerAgentAnalysis(() => setCurrentStep(nextStepIndex));
  };

  const handleSeeMatches = () => {
    triggerAgentAnalysis(() => setShowResults(true));
  };

  return (
    <section 
      id="smart-tech-finder" 
      className="w-full my-8 sm:my-12 p-5 sm:p-8 lg:p-10 rounded-3xl bg-[#FFFFFF] border border-[#DCE8F3] relative overflow-hidden shadow-sm text-[#10263D]"
      aria-label="Smart Tech Finder AI Diagnostic Engine"
    >
      {/* Background Cybernetic Specular Accents */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #10B981 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#DCE8F3]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold mb-3 border border-cyan-500/30">
              <span className="agent-pulse-dot" />
              <span>{t.finderBadge || (lang === 'bn' ? 'লাইভ এজেন্ট ম্যাচিং ইঞ্জিন' : 'AI Diagnostic Matcher')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#10263D] tracking-tight">
              {t.finderTitle || (lang === 'bn' ? 'স্মার্ট টেক ফাইন্ডার' : 'Smart Tech Finder')}
            </h2>
            <p className="text-xs sm:text-sm text-[#526981] mt-1.5 font-normal max-w-2xl leading-relaxed">
              {t.finderSubtitle || (lang === 'bn' 
                ? 'আপনার বাজেট (টাকা) এবং ব্যবহারের ধরনের উপর ভিত্তি করে সেরা টেক গ্যাজেট খুঁজুন।' 
                : 'Active hardware diagnosis across 26 verified SKUs in BDT — with simulated telemetry reasoning and free nationwide delivery optimization.')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {showResults && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F8FBFE] border border-[#DCE8F3] text-xs font-mono font-bold text-[#10263D] hover:text-cyan-400 hover:border-cyan-500/40 transition-all cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>{t.finderReset || (lang === 'bn' ? 'পুনরায় শুরু করুন' : 'RESTART')}</span>
              </button>
            )}
            <div className="px-3.5 py-1.5 rounded-xl bg-[#F8FBFE] border border-[#DCE8F3] font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck size={14} />
              <span>100% VERIFIED CATALOG</span>
            </div>
          </div>
        </div>

        {/* STEP PROGRESS TABS */}
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
                  onClick={() => handleStepAdvance(tab.step)}
                  className={`py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all text-center cursor-pointer ${
                    currentStep === tab.step 
                      ? 'bg-[#1684E8] text-white border border-[#1684E8] shadow-xs' 
                      : currentStep > tab.step
                        ? 'bg-[#EBF5FF] text-[#1684E8] border border-[#DCE8F3]'
                        : 'bg-[#F4F8FC] text-slate-500 border border-[#DCE8F3]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* LIVE AGENT REASONING LOG OVERLAY (350ms-500ms simulation) */}
            {isAnalyzing ? (
              <div className="p-6 sm:p-8 rounded-2xl bg-[#F8FBFE] border border-cyan-500/40 shadow-2xl my-4 text-left animate-fadeIn">
                <div className="flex items-center gap-2 mb-3">
                  <span className="agent-pulse-dot" />
                  <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal size={14} />
                    <span>Agent Diagnostic Reasoning Engine Active...</span>
                  </span>
                </div>
                <div className="font-mono text-xs space-y-1.5 bg-[#F5F9FD] p-4 rounded-xl border border-[#DCE8F3]">
                  <p className="text-cyan-400">&gt; Scanning verified catalog across active SKUs...</p>
                  {logStep >= 2 && (
                    <p className="text-emerald-400">&gt; Filtering for budget tier &amp; wattage compatibility constraints...</p>
                  )}
                  {logStep >= 3 && (
                    <p className="text-cyan-300 font-bold">&gt; Calculating ৳2,000 free nationwide delivery threshold &amp; match confidence...</p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                {/* STEP 0: BUDGET */}
                {currentStep === 0 && (
                  <div className="bg-[#F8FBFE] p-5 sm:p-7 rounded-2xl border border-[#DCE8F3]">
                    <h3 className="text-base sm:text-lg font-bold text-[#10263D] mb-1">
                      {lang === 'bn' ? 'আপনার আনুমানিক বাজেট কত?' : 'What is your target budget range?'}
                    </h3>
                    <p className="font-mono text-xs text-[#526981] mb-5">
                      {lang === 'bn' ? 'বাংলাদেশি টাকায় (৳) আপনার বাজেটের সাথে যাচাইকৃত পণ্য ম্যাচ করা হবে।' : 'Filter verified items within target price ceilings in BDT.'}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      {BUDGET_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setBudget(opt.id)}
                          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                            budget === opt.id 
                              ? 'bg-[#EBF5FF] border-2 border-[#1684E8] shadow-sm text-[#1684E8]' 
                              : 'bg-[#FFFFFF] border-[#DCE8F3] hover:bg-[#EAF5FF] text-[#10263D]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`font-mono text-sm font-black ${budget === opt.id ? 'text-[#1684E8]' : 'text-[#10263D]'}`}>{opt.label}</span>
                            {budget === opt.id && <Check size={16} className="text-[#1684E8] stroke-[3]" />}
                          </div>
                          <span className="font-mono text-xs text-[#526981] block">{opt.sub}</span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleStepAdvance(1)}
                        className="bg-[#1684E8] hover:bg-[#1270C5] text-white font-mono font-bold text-xs py-2.5 px-6 rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-sm"
                      >
                        <span>{lang === 'bn' ? 'পরবর্তী ধাপ' : 'NEXT STEP'}</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 1: USE CASE */}
                {currentStep === 1 && (
                  <div className="bg-[#F8FBFE] p-5 sm:p-7 rounded-2xl border border-[#DCE8F3]">
                    <h3 className="text-base sm:text-lg font-bold text-[#10263D] mb-1">
                      {lang === 'bn' ? 'আপনি প্রধানত কোথায় এবং কীভাবে ব্যবহার করবেন?' : 'Where and how will you use this gear?'}
                    </h3>
                    <p className="font-mono text-xs text-[#526981] mb-5">
                      {lang === 'bn' ? 'আপনার রুটিন অনুযায়ী পারফেক্ট ক্যাবল ও অডিও ম্যাচ করা হবে।' : 'Match hardware specs to your daily commute, office, or active usage.'}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {USE_OPTIONS.map((use) => {
                        const Icon = use.icon;
                        return (
                          <button
                            key={use.id}
                            type="button"
                            onClick={() => setUseCase(use.id)}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                              useCase === use.id 
                                ? 'bg-[#EBF5FF] border-2 border-[#1684E8] shadow-sm text-[#1684E8]' 
                                : 'bg-[#FFFFFF] border-[#DCE8F3] hover:bg-[#EAF5FF] text-[#10263D]'
                            }`}
                          >
                            <div className={`p-2.5 rounded-xl w-fit mb-3 ${useCase === use.id ? 'bg-[#1684E8] text-white' : 'bg-[#EBF5FF] text-[#1684E8] border border-[#DCE8F3]'}`}>
                              <Icon size={18} />
                            </div>
                            <span className={`text-sm font-bold block mb-1 ${useCase === use.id ? 'text-[#1684E8]' : 'text-[#10263D]'}`}>{use.label}</span>
                            <span className="text-xs text-[#526981] block leading-snug">{use.desc}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => handleStepAdvance(0)}
                        className="font-mono text-xs font-bold text-[#526981] hover:text-[#10263D] cursor-pointer"
                      >
                        {lang === 'bn' ? '← ব্যাকে যান' : '← BACK'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStepAdvance(2)}
                        className="bg-[#1684E8] hover:bg-[#1270C5] text-white font-mono font-bold text-xs py-2.5 px-6 rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-sm"
                      >
                        <span>{lang === 'bn' ? 'পরবর্তী ধাপ' : 'NEXT STEP'}</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: GEAR TYPE */}
                {currentStep === 2 && (
                  <div className="bg-[#F8FBFE] p-5 sm:p-7 rounded-2xl border border-[#DCE8F3]">
                    <h3 className="text-base sm:text-lg font-bold text-[#10263D] mb-1">
                      {lang === 'bn' ? 'কোন ক্যাটাগরির গ্যাজেট খুঁজছেন?' : 'Which category of gear do you need?'}
                    </h3>
                    <p className="font-mono text-xs text-[#526981] mb-5">
                      {lang === 'bn' ? 'নির্দিষ্ট ক্যাটাগরি অথবা সার্বিক ম্যাচিং নির্বাচন করুন।' : 'Narrow your focus or keep open recommendations across verified accessories.'}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      {CATEGORY_OPTIONS.map((c) => {
                        const IconComp = c.icon;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setCategory(c.id)}
                            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                              category === c.id 
                                ? 'bg-[#EBF5FF] border-2 border-[#1684E8] shadow-sm text-[#1684E8]' 
                                : 'bg-[#FFFFFF] border-[#DCE8F3] hover:bg-[#EAF5FF] text-[#10263D]'
                            }`}
                          >
                            <div className={`p-2.5 rounded-xl w-fit mb-3 ${category === c.id ? 'bg-[#1684E8] text-white' : 'bg-[#EBF5FF] text-[#1684E8] border border-[#DCE8F3]'}`}>
                              <IconComp size={18} />
                            </div>
                            <span className={`text-sm font-bold block mb-1 ${category === c.id ? 'text-[#1684E8]' : 'text-[#10263D]'}`}>{c.label}</span>
                            <span className="text-xs text-[#526981] block leading-snug">{c.sub}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => handleStepAdvance(1)}
                        className="font-mono text-xs font-bold text-[#526981] hover:text-[#10263D] cursor-pointer"
                      >
                        {lang === 'bn' ? '← ব্যাকে যান' : '← BACK'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStepAdvance(3)}
                        className="bg-[#1684E8] hover:bg-[#1270C5] text-white font-mono font-bold text-xs py-2.5 px-6 rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-sm"
                      >
                        <span>{lang === 'bn' ? 'পরবর্তী ধাপ' : 'NEXT STEP'}</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: PRIORITY */}
                {currentStep === 3 && (
                  <div className="bg-[#F8FBFE] p-5 sm:p-7 rounded-2xl border border-[#DCE8F3]">
                    <h3 className="text-base sm:text-lg font-bold text-[#10263D] mb-1">
                      {lang === 'bn' ? 'আপনার সবচেয়ে গুরুত্বপূর্ণ প্রয়োজনীয়তা কোনটি?' : 'What is your absolute top priority?'}
                    </h3>
                    <p className="font-mono text-xs text-[#526981] mb-5">
                      {lang === 'bn' ? 'যে ফিচারের ওপর আপোষ করতে চান না।' : 'The technical capability that anchors your final selection.'}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {PRIORITY_OPTIONS.map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPriority(p.id)}
                          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                            priority === p.id 
                              ? 'bg-[#EBF5FF] border-2 border-[#1684E8] shadow-sm text-[#1684E8]' 
                              : 'bg-[#FFFFFF] border-[#DCE8F3] hover:bg-[#EAF5FF] text-[#10263D]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`text-sm font-bold ${priority === p.id ? 'text-[#1684E8]' : 'text-[#10263D]'}`}>{p.label}</span>
                            {priority === p.id && <Check size={16} className="text-[#1684E8] stroke-[3]" />}
                          </div>
                          <span className="text-xs text-[#526981] leading-relaxed block">{p.detail}</span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => handleStepAdvance(2)}
                        className="font-mono text-xs font-bold text-[#526981] hover:text-[#10263D] cursor-pointer"
                      >
                        {lang === 'bn' ? '← ব্যাকে যান' : '← BACK'}
                      </button>
                      <button
                        type="button"
                        onClick={handleSeeMatches}
                        className="bg-[#1684E8] hover:bg-[#1270C5] text-white font-mono font-bold text-xs py-3 px-7 rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-sm"
                      >
                        <Cpu size={16} />
                        <span>{lang === 'bn' ? 'ম্যাচিং প্রোডাক্ট দেখুন' : 'RUN AI DIAGNOSTIC MATCH'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* RESULTS SHOWCASE */}
        {showResults && !isAnalyzing && (
          <div>
            {!recommendations.isExact && (
              <div className="mb-6 p-4 rounded-2xl bg-[#EBF5FF] border border-[#DCE8F3] flex items-start gap-3">
                <AlertCircle size={20} className="text-[#1684E8] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1684E8] font-mono">
                    {lang === 'bn' ? 'সরাসরি বাজেট ফিল্টারে কোনো নকল পণ্য তৈরি করা হয়নি' : 'VERIFIED CATALOG INTEGRITY NOTICE'}
                  </h4>
                  <p className="text-xs text-[#526981] mt-0.5 leading-relaxed">
                    {t.finderNoMatch || (lang === 'bn'
                      ? 'এই নির্দিষ্ট ফিল্টারে সরাসরি ম্যাচ পাওয়া যায়নি। নিচে সবচেয়ে কাছাকাছি যাচাইকৃত খাঁটি অপশনগুলো দেওয়া হলো:'
                      : 'No products in our verified catalog meet this exact price combination. We never invent fake products. Here are our closest verified authentic options:')}
                  </p>
                </div>
              </div>
            )}

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {recommendations.matches.map(({ product, score, whyReasons }) => {
                const isCompared = comparisonIds.includes(product.id);
                const grade = getHardwareGrade(product);

                return (
                  <div
                    key={product.id}
                    className="bg-[#FFFFFF] rounded-2xl border border-[#DCE8F3] hover:border-cyan-500/40 hover:shadow-[0_4px_24px_-2px_rgba(6,182,212,0.2)] transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                  >
                    {/* Top Media & Badges */}
                    <div className="relative aspect-[4/3] bg-[#F5F9FD] p-4 flex items-center justify-center border-b border-[#DCE8F3]">
                      <img
                        src={product.image}
                        alt={lang === 'bn' ? product.titleBn : product.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      
                      {/* Top-Left: Agent Match Score Badge */}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full font-mono text-[10px] font-black bg-[#1684E8] text-white shadow-xs flex items-center gap-1">
                        <Sparkles size={11} />
                        <span>[{score}% MATCH FOR SETUP]</span>
                      </span>

                      {/* Top-Right: Hardware Grading Badge */}
                      <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-md font-mono text-[9px] font-bold uppercase tracking-wider ${grade.badgeClass}`}>
                        {grade.shortLabel}
                      </span>
                    </div>

                    {/* Content & Diagnostic Reasoning */}
                    <div className="p-5 flex flex-col flex-grow justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-xs">
                          <span className="font-bold text-[#10263D] font-mono">{product.brand}</span>
                          <span className="text-slate-500">•</span>
                          <span className="font-mono text-[#526981]">{formatCleanSku(product)}</span>
                        </div>

                        <h3 
                          onClick={() => onOpenDetail(product)}
                          className="text-sm sm:text-base font-bold text-[#10263D] hover:text-[#1684E8] transition-colors cursor-pointer line-clamp-2 min-h-[2.8rem] mb-3"
                        >
                          {lang === 'bn' ? product.titleBn : product.title}
                        </h3>

                        {/* Agent Telemetry Reasoning Log */}
                        <div className="p-3.5 rounded-xl bg-[#F5F9FD] border border-[#DCE8F3] mb-4">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#1684E8] flex items-center gap-1.5 mb-2">
                            <Check size={13} className="text-[#1684E8] stroke-[3]" />
                            <span>AI TELEMETRY RATIONALE:</span>
                          </span>
                          <ul className="space-y-1 font-mono text-[11px] text-[#526981]">
                            {whyReasons.map((reason, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-[#1684E8] shrink-0">&gt;</span>
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Bottom Pricing & Actions */}
                      <div className="pt-3 border-t border-[#DCE8F3]">
                        <div className="flex items-baseline justify-between mb-3">
                          <div>
                            <span className="font-mono text-xl font-black text-[#1684E8]">
                              {currencySymbol}{product.price.toLocaleString()}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="ml-2 font-mono text-xs text-slate-500 line-through">
                                {currencySymbol}{product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-[11px] font-semibold text-emerald-400">
                            {product.stock > 0 ? (lang === 'bn' ? 'স্টকে আছে' : 'IN STOCK') : 'OUT OF STOCK'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => onQuickAdd(product, product.variants?.[0], 1)}
                            className="bg-[#1684E8] hover:bg-[#1270C5] text-white font-mono flex items-center justify-center gap-1.5 text-xs py-2.5 w-full font-bold rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
                          >
                            <ShoppingBag size={14} />
                            <span>{lang === 'bn' ? 'ব্যাগে যুক্ত' : 'ADD TO BAG'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onToggleCompare && onToggleCompare(product)}
                            className={`flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-xl border font-mono font-bold transition-all cursor-pointer ${
                              isCompared 
                                ? 'bg-[#EBF5FF] text-[#1684E8] border-[#1684E8]' 
                                : 'bg-[#FFFFFF] text-[#526981] border-[#DCE8F3] hover:border-[#1684E8] hover:text-[#1684E8]'
                            }`}
                          >
                            <Scale size={14} />
                            <span>{isCompared ? (lang === 'bn' ? 'তুলনায় আছে' : 'IN DOCK') : (lang === 'bn' ? 'তুলনা করুন' : 'COMPARE')}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions Banner */}
            <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-[#F8FBFE] border border-[#DCE8F3] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Scale size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#10263D]">
                    {lang === 'bn' ? 'বাছাইকৃত পণ্যগুলোর পাশাপাশি স্পেক্স দেখতে চান?' : 'Want to inspect side-by-side technical differences?'}
                  </h4>
                  <p className="font-mono text-xs text-[#526981]">
                    {lang === 'bn' ? '৪টি পর্যন্ত পণ্য যোগ করে তুলনা ম্যাট্রিক্স দেখুন।' : 'Shortlist up to 4 items and inspect chipsets, wattages, and battery specs.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#DCE8F3] font-mono text-xs font-bold text-[#526981] hover:text-[#10263D] hover:bg-[#EAF5FF] transition-all cursor-pointer"
                >
                  {lang === 'bn' ? 'ফিল্টার পরিবর্তন' : 'ADJUST ANSWERS'}
                </button>
                {onOpenComparison && (
                  <button
                    type="button"
                    onClick={onOpenComparison}
                    className="bg-[#1684E8] hover:bg-[#1270C5] text-white font-mono text-xs py-2.5 px-5 rounded-xl flex items-center gap-1.5 font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <span>{t.finderCompareShortlist || (lang === 'bn' ? 'তুলনা দেখুন' : 'OPEN SPEC MATRIX')}</span>
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
