import React, { useState, useMemo } from 'react';
import { 
  Package, 
  ShoppingBag, 
  Check, 
  Truck, 
  Sparkles, 
  Layers, 
  GraduationCap, 
  Briefcase, 
  Video, 
  Gamepad2, 
  ChevronRight, 
  RotateCw, 
  Sliders,
  AlertCircle,
  Zap,
  Plus
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data/catalog';
import { getHardwareGrade, formatCleanSku } from '../utils/hardwareGrade';

export default function TechKits({
  products = INITIAL_PRODUCTS,
  onAddKitToBag,
  currencySymbol = "৳",
  lang = 'en',
  t = {}
}) {
  // Profiles for configurable kits
  const KIT_PRESETS = [
    {
      id: 'student-kit',
      icon: GraduationCap,
      badge: lang === 'bn' ? 'ছাত্রদের সেরা পছন্দ' : 'Student Edition',
      title: lang === 'bn' ? 'স্টুডেন্ট ডেইলি স্টাডি অ্যান্ড পাওয়ার কিট' : 'Student Study & Commute Kit',
      description: lang === 'bn' 
        ? 'দৈনন্দিন ক্লাস, লাইব্রেরি স্টাডি ও যাতায়াতের জন্য নির্ভরযোগ্য ইয়ারবাড এবং ফাস্ট চার্জিং।'
        : 'Engineered for campus life, long study sessions, and reliable daily mobile charging.',
      slots: [
        {
          slotName: lang === 'bn' ? '১. অডিও বাডস' : '1. Audio Gear',
          defaultId: 'p06-oneplus-pro-tws',
          options: ['p06-oneplus-pro-tws', 'sm-neckband-007', 'h2-anc-pro-tws']
        },
        {
          slotName: lang === 'bn' ? '২. চার্জিং সল্যুশন' : '2. Charging Cable',
          defaultId: 'recrsi-4in1-65w-cable',
          options: ['recrsi-4in1-65w-cable', 'turbo-single-wall-charger']
        },
        {
          slotName: lang === 'bn' ? '৩. স্মার্ট গ্যাজেট' : '3. Smart Wearable',
          defaultId: 'pink-glam-smartwatch',
          options: ['pink-glam-smartwatch', 'y80-ultra-smartwatch']
        }
      ]
    },
    {
      id: 'professional-kit',
      icon: Briefcase,
      badge: lang === 'bn' ? 'পেশাদার ও এক্সিকিউটিভ' : 'Executive Edition',
      title: lang === 'bn' ? 'প্রফেশনাল এক্সিকিউটিভ ডুয়াল কানেক্ট কিট' : 'Executive Dual Connectivity Kit',
      description: lang === 'bn'
        ? 'সিম কলিং স্মার্টওয়াচ, ক্রিস্টাল ক্লিয়ার ওয়্যারলেস হেডসেট এবং মাল্টি-ডিভাইস পাওয়ার।'
        : 'Independent cellular smartwatch calling, noise-isolated headset, and 65W braided fast power.',
      slots: [
        {
          slotName: lang === 'bn' ? '১. সেলুলার ওয়াচ' : '1. SIM Watch',
          defaultId: 'p12-laxasfit-k10-ultra',
          options: ['p12-laxasfit-k10-ultra', 'y80-ultra-smartwatch']
        },
        {
          slotName: lang === 'bn' ? '২. প্রফেশনাল অডিও' : '2. Voice Audio',
          defaultId: 'oraimo-or08-wireless-headset',
          options: ['oraimo-or08-wireless-headset', 'h2-anc-pro-tws']
        },
        {
          slotName: lang === 'bn' ? '৩. হাই-ডেনসিটি ক্যাবল' : '3. 65W Fast Cable',
          defaultId: 'recrsi-4in1-65w-cable',
          options: ['recrsi-4in1-65w-cable', 'turbo-single-wall-charger']
        }
      ]
    },
    {
      id: 'creator-kit',
      icon: Video,
      badge: lang === 'bn' ? 'কন্টেন্ট ক্রিয়েটর' : 'Creator & Studio',
      title: lang === 'bn' ? 'ক্রিয়েটর স্টুডিও অ্যাকোস্টিক অ্যান্ড পাওয়ার স্যুট' : 'Creator Studio Acoustic Suite',
      description: lang === 'bn'
        ? 'ডায়নামিক স্টুডিও আরজিবি হেডফোন, হাই-এন্ড TWS বাডস এবং দীর্ঘস্থায়ী চার্জিং।'
        : 'Dynamic studio RGB acoustic drivers, pro earbuds, and reliable multi-plug braided cables.',
      slots: [
        {
          slotName: lang === 'bn' ? '১. স্টুডিও হেডফোন' : '1. Studio Headphones',
          defaultId: 'luminous-sa-rgb-headphones',
          options: ['luminous-sa-rgb-headphones', 'fighter-superbass-headset']
        },
        {
          slotName: lang === 'bn' ? '২. প্রো TWS বাডস' : '2. Pro Wireless TWS',
          defaultId: 'h2-anc-pro-tws',
          options: ['h2-anc-pro-tws', 'oraimo-or08-wireless-headset', 'p06-oneplus-pro-tws']
        },
        {
          slotName: lang === 'bn' ? '৩. পাওয়ার ক্যাবল' : '3. Multi-Power Cable',
          defaultId: 'recrsi-4in1-65w-cable',
          options: ['recrsi-4in1-65w-cable', 'turbo-single-wall-charger']
        }
      ]
    },
    {
      id: 'gamer-kit',
      icon: Gamepad2,
      badge: lang === 'bn' ? 'গেমিং ও স্পোর্টস' : 'Esports Edition',
      title: lang === 'bn' ? 'ই-স্পোর্টস আল্ট্রা ব্যাটল প্যাক' : 'Esports Low-Latency Battle Pack',
      description: lang === 'bn'
        ? 'লো-ল্যাটেন্সি গেমিং হেডসেট, টার্বো ফাস্ট চার্জার এবং দীর্ঘস্থায়ী ব্যাটারি ওয়াচ।'
        : 'Low-latency bass acoustics, high-output wall charger, and rugged smart tracking.',
      slots: [
        {
          slotName: lang === 'bn' ? '১. গেমিং হেডসেট' : '1. Gaming Audio',
          defaultId: 'fighter-superbass-headset',
          options: ['fighter-superbass-headset', 'luminous-sa-rgb-headphones']
        },
        {
          slotName: lang === 'bn' ? '২. ফাস্ট চার্জার' : '2. Turbo Charger',
          defaultId: 'turbo-single-wall-charger',
          options: ['turbo-single-wall-charger', 'recrsi-4in1-65w-cable']
        },
        {
          slotName: lang === 'bn' ? '৩. আল্ট্রা ট্র্যাকার' : '3. Ultra Tracker',
          defaultId: 'y80-ultra-smartwatch',
          options: ['y80-ultra-smartwatch', 'p13-t800-ultra2-smartwatch']
        }
      ]
    }
  ];

  const [activeKitId, setActiveKitId] = useState('student-kit');
  const [configuredSlots, setConfiguredSlots] = useState({});
  const [addonItems, setAddonItems] = useState({});

  const activeKit = KIT_PRESETS.find(k => k.id === activeKitId) || KIT_PRESETS[0];

  // Resolve selected products for active kit
  const selectedProducts = useMemo(() => {
    const kitConfig = configuredSlots[activeKit.id] || {};
    const base = activeKit.slots.map((slot, idx) => {
      const prodId = kitConfig[idx] || slot.defaultId;
      return products.find(p => p.id === prodId) || INITIAL_PRODUCTS.find(p => p.id === prodId);
    }).filter(Boolean);

    // Append any add-on optimized items
    const addons = addonItems[activeKit.id] || [];
    const addonProds = addons.map(id => products.find(p => p.id === id) || INITIAL_PRODUCTS.find(p => p.id === id)).filter(Boolean);

    return [...base, ...addonProds];
  }, [activeKit, configuredSlots, addonItems, products]);

  // Check if any product is out of stock
  const hasOutOfStockItem = useMemo(() => {
    return selectedProducts.some(p => p.stock <= 0);
  }, [selectedProducts]);

  // Total price of currently configured kit
  const kitTotal = useMemo(() => {
    return selectedProducts.reduce((sum, p) => sum + (p.price || 0), 0);
  }, [selectedProducts]);

  // Original retail sum
  const kitOriginalTotal = useMemo(() => {
    return selectedProducts.reduce((sum, p) => sum + (p.originalPrice || p.price || 0), 0);
  }, [selectedProducts]);

  const kitSavings = kitOriginalTotal - kitTotal;
  const qualifiesFreeShipping = kitTotal >= 2000;
  const freeShippingThreshold = 2000;
  const deliveryShortfall = Math.max(0, freeShippingThreshold - kitTotal);

  const handleSlotSelect = (slotIdx, newProductId) => {
    setConfiguredSlots(prev => ({
      ...prev,
      [activeKit.id]: {
        ...prev[activeKit.id],
        [slotIdx]: newProductId
      }
    }));
  };

  // 1-Click Auto-Optimize for Free Delivery Action
  const handleAutoOptimize = () => {
    // If under ৳2,000, add REMAX cable or upgrade wearable slot
    if (activeKit.id === 'student-kit') {
      // Add REMAX RC-155a Fast Cable (৳150) or upgrade smartwatch to y80-ultra
      setAddonItems(prev => ({
        ...prev,
        [activeKit.id]: [...(prev[activeKit.id] || []), 'remax-rc155a-120w-cable']
      }));
    } else {
      // Add lowest-cost fast cable to cross threshold
      setAddonItems(prev => ({
        ...prev,
        [activeKit.id]: [...(prev[activeKit.id] || []), 'remax-rc155a-120w-cable']
      }));
    }
  };

  const handleAddKit = () => {
    if (hasOutOfStockItem) return;
    if (onAddKitToBag) {
      onAddKitToBag(selectedProducts, activeKit.title);
    }
  };

  return (
    <section 
      id="tech-kits-section"
      className="w-full my-8 sm:my-12 p-5 sm:p-8 lg:p-10 rounded-3xl bg-[#12141C] border border-[#1E2230] shadow-2xl relative overflow-hidden text-slate-100"
      aria-label="Engineered Tech Kits"
    >
      {/* Background Cybernetic Specular Accents */}
      <div 
        className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }}
      />
      <div 
        className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-10"
        style={{ background: 'radial-gradient(circle, #10B981 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#1E2230]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-xs font-bold mb-3 border border-cyan-500/30">
              <span className="agent-pulse-dot" />
              <span>{t.kitsBadge || (lang === 'bn' ? 'কনফিগারযোগ্য বান্ডিল' : 'ENGINEERED TECH KITS')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {t.kitsTitle || (lang === 'bn' ? 'স্মার্ট টেক কিটস' : 'Engineered Tech Kits & Bundles')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 font-normal max-w-2xl leading-relaxed">
              {t.kitsSubtitle || (lang === 'bn'
                ? 'ছাত্র, পেশাদার, ক্রিয়েটর ও গেমারদের জন্য কাস্টমাইজযোগ্য কম্বো প্যাকেজ — নিশ্চিত কম্প্যাটিবিলিটি ও সাশ্রয়।'
                : 'Configurable multi-device packages with verified hardware compatibility and automated ৳2,000 Free Nationwide Delivery optimization.')}
            </p>
          </div>

          {/* Nationwide Free Shipping Telemetry Badge */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#161924] border border-emerald-500/30 font-mono text-xs font-bold text-emerald-400 shrink-0 shadow-xs">
            <Truck size={16} className="text-emerald-400" />
            <span>FREE NATIONWIDE DELIVERY @ ৳2,000+</span>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {KIT_PRESETS.map(kit => {
            const IconComp = kit.icon;
            const isActive = activeKitId === kit.id;
            return (
              <button
                key={kit.id}
                type="button"
                onClick={() => setActiveKitId(kit.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  isActive 
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                    : 'bg-[#161924] text-slate-300 border-[#1E2230] hover:border-cyan-500/30 hover:text-white'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${isActive ? 'bg-slate-950 text-cyan-400' : 'bg-[#12141C] text-slate-300'}`}>
                  <IconComp size={20} />
                </div>
                <div className="min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-wider block opacity-80">
                    {kit.badge}
                  </span>
                  <span className="text-xs sm:text-sm font-bold truncate block">
                    {kit.title.split(' ')[0]} {kit.title.split(' ')[1]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Kit Configuration Panel */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#161924] p-4 sm:p-5 rounded-2xl border border-[#1E2230]">
            <div>
              <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                ACTIVE CONFIGURATION PROFILE
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {activeKit.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {activeKit.description}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-[#12141C] px-3 py-2 rounded-xl border border-[#1E2230] shrink-0">
              <Sliders size={14} className="text-cyan-400" />
              <span>{activeKit.slots.length} CONFIGURABLE SLOTS</span>
            </div>
          </div>

          {/* Configurable Slots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {activeKit.slots.map((slot, slotIdx) => {
              const currentProdId = configuredSlots[activeKit.id]?.[slotIdx] || slot.defaultId;
              const currentProd = products.find(p => p.id === currentProdId) || INITIAL_PRODUCTS.find(p => p.id === currentProdId);
              const grade = getHardwareGrade(currentProd);

              return (
                <div 
                  key={slotIdx}
                  className="bg-[#161924] rounded-2xl border border-[#1E2230] p-4 sm:p-5 flex flex-col justify-between"
                >
                  <div>
                    {/* Slot Header */}
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1E2230]">
                      <span className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
                        {slot.slotName}
                      </span>
                      {grade && (
                        <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-wider ${grade.badgeClass}`}>
                          {grade.shortLabel}
                        </span>
                      )}
                    </div>

                    {/* Active Selected Product Display */}
                    {currentProd && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-[#12141C] border border-[#1E2230] mb-4">
                        <img 
                          src={currentProd.image} 
                          alt={currentProd.title} 
                          className="w-14 h-14 object-contain rounded-lg bg-[#090A0F] p-1 border border-[#1E2230] shrink-0" 
                        />
                        <div className="min-w-0 flex-1">
                          <span className="font-mono text-[10px] text-slate-400 block">
                            {formatCleanSku(currentProd)}
                          </span>
                          <h4 className="text-xs font-bold text-white truncate" title={currentProd.title}>
                            {currentProd.title}
                          </h4>
                          <span className="font-mono text-xs font-black text-cyan-400 mt-1 block">
                            {currencySymbol}{currentProd.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Selector Options */}
                    <div>
                      <span className="font-mono text-[11px] font-bold text-slate-400 block mb-2">
                        {lang === 'bn' ? 'বিকল্প পরিবর্তন করুন:' : 'SWAP COMPANION GEAR:'}
                      </span>
                      <div className="space-y-1.5">
                        {slot.options.map(optId => {
                          const optProd = products.find(p => p.id === optId) || INITIAL_PRODUCTS.find(p => p.id === optId);
                          if (!optProd) return null;
                          const isSelected = optProd.id === currentProdId;
                          const isOptOutOfStock = optProd.stock <= 0;

                          return (
                            <button
                              key={optId}
                              type="button"
                              onClick={() => !isOptOutOfStock && handleSlotSelect(slotIdx, optProd.id)}
                              disabled={isOptOutOfStock}
                              className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between border transition-all cursor-pointer font-mono ${
                                isSelected
                                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-xs'
                                  : isOptOutOfStock
                                    ? 'bg-[#12141C] text-slate-600 border-[#1E2230] cursor-not-allowed'
                                    : 'bg-[#12141C] text-slate-300 border-[#1E2230] hover:border-cyan-500/40 hover:text-white'
                              }`}
                            >
                              <span className="truncate pr-2 text-[11px]">
                                {optProd.title}
                              </span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {isOptOutOfStock ? (
                                  <span className="text-[10px] font-bold text-rose-500">SOLD OUT</span>
                                ) : (
                                  <span className={isSelected ? 'text-slate-950 font-bold' : 'text-cyan-400'}>
                                    {currencySymbol}{optProd.price.toLocaleString()}
                                  </span>
                                )}
                                {isSelected && <Check size={12} className="stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AGENT FREE DELIVERY OPTIMIZER BANNER (Requirement 4) */}
          {deliveryShortfall > 0 ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-md">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shrink-0">
                  <Zap size={18} />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                    <span className="agent-pulse-dot" />
                    <span>AGENT FREE DELIVERY OPTIMIZER</span>
                  </span>
                  <p className="text-slate-300 font-sans leading-relaxed text-xs sm:text-sm">
                    {lang === 'bn' 
                      ? `টিপ: আপনি ফ্রি ডেলিভারি (২,০০০৳) থেকে মাত্র ৳${deliveryShortfall.toLocaleString()} দূরে আছেন (৳১২০ কুরিয়ার ফি সাশ্রয় হবে)। REMAX RC-155a ফাস্ট ক্যাবল (৳১৫০) অটো-যুক্ত করে ফ্রি ডেলিভারি আনলক করুন।`
                      : `Agent Tip: You are ৳${deliveryShortfall.toLocaleString()} away from Free Nationwide Delivery (saves ৳120 courier fee). Auto-add a REMAX RC-155a Fast Cable (৳150) or upgrade your gear to unlock free shipping.`
                    }
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAutoOptimize}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs whitespace-nowrap transition-all shadow-[0_0_15px_rgba(6,182,212,0.35)] shrink-0 cursor-pointer active:scale-95"
              >
                [+ AUTO-OPTIMIZE FOR FREE DELIVERY]
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between gap-3 text-xs shadow-md">
              <div className="flex items-center gap-2.5 font-mono text-emerald-400 font-bold">
                <Truck size={18} />
                <span>🎉 FREE NATIONWIDE COURIER DELIVERY UNLOCKED (SAVED ৳120 COURIER FEE)</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-300 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
                THRESHOLD REACHED
              </span>
            </div>
          )}

          {/* Kit Summary & Add to Cart in Obsidian Theme */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#161924] border border-[#1E2230] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {lang === 'bn' ? 'কনফিগার করা কিট মোট:' : 'CONFIGURED KIT TOTAL:'}
                </span>
                {kitSavings > 0 && (
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    {lang === 'bn' ? `৳${kitSavings.toLocaleString()} সাশ্রয়` : `SAVE ৳${kitSavings.toLocaleString()}`}
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2.5">
                <span className="font-mono text-2xl sm:text-3xl font-black text-white">
                  {currencySymbol}{kitTotal.toLocaleString()}
                </span>
                {kitOriginalTotal > kitTotal && (
                  <span className="font-mono text-sm text-slate-500 line-through">
                    {currencySymbol}{kitOriginalTotal.toLocaleString()}
                  </span>
                )}
                {qualifiesFreeShipping && (
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    FREE NATIONWIDE DELIVERY
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleAddKit}
                disabled={hasOutOfStockItem}
                className={`bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs sm:text-sm font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all cursor-pointer active:scale-95 ${
                  hasOutOfStockItem ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ShoppingBag size={17} />
                <span>
                  {hasOutOfStockItem 
                    ? (lang === 'bn' ? 'আইটেম স্টক শেষ' : 'ITEM OUT OF STOCK')
                    : (t.kitAddAll || (lang === 'bn' ? 'সম্পূর্ণ কিট ব্যাগে যুক্ত করুন' : 'ADD CONFIGURED KIT TO BAG'))}
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
