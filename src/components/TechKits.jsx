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
  AlertCircle
} from 'lucide-react';
import { INITIAL_PRODUCTS, FEATURED_BUNDLES } from '../data/catalog';

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
          options: ['luminous-sa-rgb-headphones', 'cat-ear-headphone', 'fighter-superbass-headset']
        },
        {
          slotName: lang === 'bn' ? '২. প্রো TWS বাডস' : '2. Pro Wireless TWS',
          defaultId: 'h2-anc-pro-tws',
          options: ['h2-anc-pro-tws', 'oraimo-or08-wireless-headset', 'p06-oneplus-pro-tws']
        },
        {
          slotName: lang === 'bn' ? '৩. ফাস্ট চার্জার' : '3. Power Accessory',
          defaultId: 'recrsi-4in1-65w-cable',
          options: ['recrsi-4in1-65w-cable', 'turbo-single-wall-charger']
        }
      ]
    },
    {
      id: 'gamer-kit',
      icon: Gamepad2,
      badge: lang === 'bn' ? 'মোবাইল গেমার' : 'Gaming Edition',
      title: lang === 'bn' ? 'মোবাইল গেমার সুপারবাস অ্যান্ড টার্বো কিট' : 'Mobile Gamer Superbass Kit',
      description: lang === 'bn'
        ? 'লো-ল্যাটেন্সি গেম অডিও, সুপারবাস কমব্যাট হেডসেট এবং হাই-স্পিড টার্বো চার্জিং।'
        : 'Ultra-low latency combat audio, punchy tactical bass headset, and rapid fast recharging.',
      slots: [
        {
          slotName: lang === 'bn' ? '১. গেমিং অডিও' : '1. Gaming Audio',
          defaultId: 'fighter-superbass-headset',
          options: ['fighter-superbass-headset', 'luminous-sa-rgb-headphones']
        },
        {
          slotName: lang === 'bn' ? '২. ব্যাকআপ বাডস' : '2. Mobile TWS',
          defaultId: 'h2-anc-pro-tws',
          options: ['h2-anc-pro-tws', 'p06-oneplus-pro-tws']
        },
        {
          slotName: lang === 'bn' ? '৩. ৪-ইন-১ ক্যাবল' : '3. Fast Cable',
          defaultId: 'recrsi-4in1-65w-cable',
          options: ['recrsi-4in1-65w-cable', 'turbo-single-wall-charger']
        }
      ]
    }
  ];

  // Active Kit Selection
  const [activeKitId, setActiveKitId] = useState('student-kit');

  // Selected items configuration: { [kitId]: { [slotIndex]: productId } }
  const [configuredSlots, setConfiguredSlots] = useState(() => {
    const initial = {};
    KIT_PRESETS.forEach(kit => {
      initial[kit.id] = {};
      kit.slots.forEach((s, idx) => {
        initial[kit.id][idx] = s.defaultId;
      });
    });
    return initial;
  });

  const activeKit = KIT_PRESETS.find(k => k.id === activeKitId) || KIT_PRESETS[0];

  // Resolve selected products for active kit
  const selectedProducts = useMemo(() => {
    const kitConfig = configuredSlots[activeKit.id] || {};
    return activeKit.slots.map((slot, idx) => {
      const prodId = kitConfig[idx] || slot.defaultId;
      return products.find(p => p.id === prodId) || INITIAL_PRODUCTS.find(p => p.id === prodId);
    }).filter(Boolean);
  }, [activeKit, configuredSlots, products]);

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

  const handleSlotSelect = (slotIdx, newProductId) => {
    setConfiguredSlots(prev => ({
      ...prev,
      [activeKit.id]: {
        ...prev[activeKit.id],
        [slotIdx]: newProductId
      }
    }));
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
      className="w-full my-8 sm:my-14 p-5 sm:p-8 lg:p-10 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm relative overflow-hidden"
      aria-label="Configurable Tech Kits"
    >
      {/* Background Showroom Glow */}
      <div 
        className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, #BFDBFE 0%, transparent 70%)' }}
      />
      <div 
        className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, #DBEAFE 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#145CFF] text-xs font-bold mb-3 shadow-xs border border-[#BFDBFE]">
              <Package size={13} />
              <span>{t.kitsBadge || (lang === 'bn' ? 'কনফিগারযোগ্য বান্ডিল' : 'Configurable Bundles')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight">
              {t.kitsTitle || (lang === 'bn' ? 'স্মার্ট টেক কিটস' : 'Engineered Tech Kits')}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-1.5 font-normal max-w-2xl leading-relaxed">
              {t.kitsSubtitle || (lang === 'bn'
                ? 'ছাত্র, পেশাদার, ক্রিয়েটর ও গেমারদের জন্য কাস্টমাইজযোগ্য কম্বো প্যাকেজ — নিশ্চিত কম্প্যাটিবিলিটি ও সাশ্রয়।'
                : 'Configurable multi-device bundles tailored for students, professionals, creators, and gamers. Guaranteed compatibility with genuine in-stock products.')}
            </p>
          </div>

          {/* Nationwide Free Shipping Badge */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-[#E2E8F0] text-xs font-bold text-[#0F172A] shrink-0 shadow-2xs">
            <Truck size={16} className="text-emerald-700" />
            <span>{lang === 'bn' ? '২,০০০৳+ অর্ডারে ফ্রি ডেলিভারি' : 'Free Delivery on Orders ৳2,000+'}</span>
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
                    ? 'bg-[#145CFF] text-white border-[#145CFF] shadow-md ring-2 ring-[#93C5FD]' 
                    : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:border-[#145CFF]/40'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-slate-50 text-[#0F172A] border border-[#E2E8F0]'}`}>
                  <IconComp size={18} />
                </div>
                <div className="min-w-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
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

        {/* Active Kit Configuration Box */}
        <div className="bg-[#F8FAFC] rounded-3xl border border-[#E2E8F0] p-5 sm:p-7 shadow-xs">
          
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-black text-[#0F172A]">
              {activeKit.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              {activeKit.description}
            </p>
          </div>

          {/* Configurable Slots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {activeKit.slots.map((slot, slotIdx) => {
              const currentProdId = (configuredSlots[activeKit.id] && configuredSlots[activeKit.id][slotIdx]) || slot.defaultId;
              const currentProd = products.find(p => p.id === currentProdId) || INITIAL_PRODUCTS.find(p => p.id === currentProdId);

              return (
                <div 
                  key={slotIdx}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    {/* Slot Name */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                        {slot.slotName}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 px-2 py-0.5 rounded bg-[#F8FAFC] border border-[#E2E8F0]">
                        {lang === 'bn' ? 'কাস্টমাইজ করুন' : 'Configurable'}
                      </span>
                    </div>

                    {/* Current Product Showcase */}
                    {currentProd && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] mb-3">
                        <img
                          src={currentProd.image}
                          alt={currentProd.title}
                          className="w-16 h-16 object-contain rounded-lg bg-white p-1 border border-[#E2E8F0] shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 block">
                            {currentProd.brand}
                          </span>
                          <h4 className="text-xs font-bold text-[#0F172A] truncate mb-1" title={currentProd.title}>
                            {lang === 'bn' ? currentProd.titleBn : currentProd.title}
                          </h4>
                          <span className="text-xs font-black text-[#0F172A]">
                            {currencySymbol}{currentProd.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Selector Options */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                        {lang === 'bn' ? 'বিকল্প পরিবর্তন করুন:' : 'Swap Companion Gear:'}
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
                              className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#145CFF] text-white border-[#145CFF] font-bold'
                                  : isOptOutOfStock
                                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                    : 'bg-white text-slate-700 border-[#E2E8F0] hover:border-[#145CFF]'
                              }`}
                            >
                              <span className="truncate pr-2">
                                {optProd.title}
                              </span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {isOptOutOfStock ? (
                                  <span className="text-[10px] font-bold text-rose-600">{lang === 'bn' ? 'স্টক নেই' : 'Sold Out'}</span>
                                ) : (
                                  <span className={isSelected ? 'text-white' : 'font-semibold text-[#0F172A]'}>
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

          {/* Kit Summary & Add to Cart */}
          <div className="p-4 sm:p-6 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {lang === 'bn' ? 'কনফিগার করা কিট মোট:' : 'Configured Kit Total:'}
                </span>
                {kitSavings > 0 && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#145CFF] border border-[#BFDBFE]">
                    {lang === 'bn' ? `৳${kitSavings.toLocaleString()} সাশ্রয়` : `Save ৳${kitSavings.toLocaleString()}`}
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-black text-[#0F172A]">
                  {currencySymbol}{kitTotal.toLocaleString()}
                </span>
                {kitOriginalTotal > kitTotal && (
                  <span className="text-sm text-slate-400 line-through">
                    {currencySymbol}{kitOriginalTotal.toLocaleString()}
                  </span>
                )}
                {qualifiesFreeShipping && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    🎉 {lang === 'bn' ? 'ফ্রি ডেলিভারি প্রযোজ্য' : 'Free Delivery Included'}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleAddKit}
                disabled={hasOutOfStockItem}
                className={`bg-[#145CFF] hover:bg-[#0D4BD9] text-white text-sm font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm transition-all cursor-pointer ${
                  hasOutOfStockItem ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ShoppingBag size={17} />
                <span>
                  {hasOutOfStockItem 
                    ? (lang === 'bn' ? 'আইটেম স্টক শেষ' : 'Item Out of Stock')
                    : (t.kitAddAll || (lang === 'bn' ? 'সম্পূর্ণ কিট ব্যাগে যুক্ত করুন' : 'Add Configured Kit to Bag'))}
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
