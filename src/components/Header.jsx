import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  X, 
  User, 
  Globe,
  SlidersHorizontal,
  HelpCircle,
  Menu,
  ShieldCheck,
  Package,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Scale,
  Zap,
  Smartphone,
  Headphones,
  BatteryCharging
} from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Header({ 
  storeName = "Tech Nest", 
  t = {}, 
  lang = 'en', 
  setLang, 
  currentUser,
  cartCount = 0, 
  wishlistCount = 0, 
  comparisonCount = 0,
  onOpenCart, 
  onOpenWishlist, 
  onOpenComparison,
  onOpenSupport,
  onOpenAccount,
  onOpenTracking,
  searchQuery = '', 
  setSearchQuery,
  onScrollToFinder,
  onScrollToKits,
  onGoHome,
  onGoToShop,
  onSelectCategory,
  onSelectProduct,
  products = []
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef(null);

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setSearchOpen(false);
        setShowSuggestions(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter products for live suggestions
  const liveSuggestions = React.useMemo(() => {
    if (!searchQuery || searchQuery.trim().length < 2) return [];
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => {
      return (
        p.title?.toLowerCase().includes(q) ||
        (p.titleBn && p.titleBn.toLowerCase().includes(q)) ||
        p.category?.toLowerCase().includes(q) ||
        (p.photoRef && p.photoRef.toLowerCase().includes(q))
      );
    }).slice(0, 5);
  }, [searchQuery, products]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);

    const q = searchQuery.toLowerCase().trim();
    // Intelligent intent matching
    if (q.includes('free') || q.includes('delivery') || q.includes('2000') || q.includes('combo') || q.includes('kit') || q.includes('bundle')) {
      if (onScrollToKits) {
        onScrollToKits();
        return;
      }
    }
    if (q.includes('fit') || q.includes('phone') || q.includes('iphone') || q.includes('samsung') || q.includes('compat')) {
      if (onScrollToFinder) {
        onScrollToFinder();
        return;
      }
    }

    if (onGoToShop) onGoToShop();
  };

  const handleSuggestionClick = (product) => {
    setShowSuggestions(false);
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  // Agent Quick-Prompt Intent Pills
  const agentPromptPills = [
    { 
      label: '⚡ Unlock ৳2,000 Free Delivery', 
      action: () => {
        const el = document.getElementById('bundles-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else if (onScrollToKits) onScrollToKits();
        else if (onGoToShop) onGoToShop();
      } 
    },
    { 
      label: '📱 Match My Phone', 
      action: () => {
        const el = document.getElementById('compatibility-finder');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else if (onScrollToFinder) onScrollToFinder();
      } 
    },
    { 
      label: '🎧 Audio Under ৳500', 
      action: () => {
        setSearchQuery('');
        if (onSelectCategory) onSelectCategory('audio');
        if (onGoToShop) onGoToShop();
      } 
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#090A0F]/95 backdrop-blur-md border-b border-[#1E2230] shadow-md text-slate-100">
      {/* Top Main Header Container */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Left: Tech Nest Authentic Glowing Logo & Telemetry Status */}
        <div className="flex items-center gap-3 shrink-0">
          <a 
            href="/" 
            onClick={(e) => {
              if (onGoHome) {
                e.preventDefault();
                onGoHome();
              }
            }}
            className="flex items-center group select-none py-0.5"
            title="Tech Nest — Authentic Mobile Accessories"
          >
            <BrandLogo 
              variant="dark"
              height={44} 
              className="h-9 sm:h-11 md:h-12 w-auto transition-transform duration-200 group-hover:scale-[1.02]" 
            />
          </a>

          {/* Agent Status Telemetry Pill */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#12141C] border border-[#1E2230]">
            <span className="agent-pulse-dot" />
            <span className="font-mono text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">
              Agent Online
            </span>
          </div>
        </div>

        {/* Center: Agentic Command & Intent Bar */}
        <div ref={searchContainerRef} className="hidden lg:flex flex-col flex-1 max-w-2xl mx-2 relative">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2) setShowSuggestions(true);
                }}
                placeholder="Ask Tech Nest Agent: '120W fast charging cables', 'Galaxy S24 Ultra', or 'ANC earbuds'..."
                className="w-full pl-12 pr-24 py-2.5 bg-[#12141C] border border-[#1E2230] focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.25)] rounded-xl font-mono text-xs text-white placeholder-slate-400 focus:outline-none transition-all"
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500 shadow-[0_0_6px_#06B6D4]"></span>
                </span>
                <Search size={15} className="text-cyan-400" />
              </div>
            </div>

            {searchQuery && (
              <button 
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShowSuggestions(false);
                }}
                className="absolute right-20 text-slate-400 hover:text-white p-1 cursor-pointer"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}

            <button 
              type="submit"
              className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Execute Agent Command"
            >
              <span>COMMAND</span>
              <ArrowRight size={13} />
            </button>
          </form>

          {/* Quick Agent Prompt Pills */}
          <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto scrollbar-none pb-0.5">
            {agentPromptPills.map((pill, idx) => (
              <button
                key={idx}
                type="button"
                onClick={pill.action}
                className="font-mono text-[10px] text-slate-300 hover:text-cyan-400 bg-[#12141C] hover:bg-[#161924] border border-[#1E2230] hover:border-cyan-500/40 px-2 py-0.5 rounded-md whitespace-nowrap transition-colors cursor-pointer"
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Predictive Search Suggestions Dropdown */}
          {showSuggestions && liveSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 py-2 border border-[#1E2230] shadow-2xl bg-[#12141C] rounded-xl z-50">
              <div className="px-3 py-1 text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider border-b border-[#1E2230] flex items-center justify-between">
                <span>VERIFIED CATALOG MATCHES</span>
                <span className="text-slate-400 text-[10px]">{liveSuggestions.length} items</span>
              </div>
              {liveSuggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSuggestionClick(item)}
                  className="px-3 py-2 flex items-center gap-3 hover:bg-[#161924] cursor-pointer transition-colors border-b border-[#1E2230]/50 last:border-b-0"
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-10 h-10 object-contain rounded bg-[#090A0F] p-0.5 border border-[#1E2230] shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {lang === 'bn' ? (item.titleBn || item.title) : item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-xs font-bold text-cyan-400">৳{item.price.toLocaleString()}</span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="font-mono text-[10px] text-slate-500 line-through">৳{item.originalPrice.toLocaleString()}</span>
                      )}
                      <span className="font-mono text-[10px] text-slate-400 bg-[#161924] px-1.5 py-0.2 rounded uppercase border border-[#1E2230]">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Actions Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Compare Matrix Icon Trigger */}
          {comparisonCount > 0 && onOpenComparison && (
            <button
              type="button"
              onClick={onOpenComparison}
              className="relative p-2 rounded-xl bg-[#12141C] border border-[#1E2230] text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
              title="Open Spec Comparison Drawer"
              aria-label="Open Spec Comparison"
            >
              <Scale size={18} />
              <span className="absolute -top-1 -right-1 font-mono text-[10px] font-bold bg-cyan-500 text-slate-950 w-4 h-4 rounded-full flex items-center justify-center">
                {comparisonCount}
              </span>
            </button>
          )}

          {/* Wishlist Trigger */}
          <button
            type="button"
            onClick={onOpenWishlist}
            className="relative p-2 rounded-xl bg-[#12141C] border border-[#1E2230] text-slate-300 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
            title="Open Saved Wishlist"
            aria-label="Open Wishlist"
          >
            <Heart size={18} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 font-mono text-[10px] font-bold bg-rose-500 text-white w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Account Trigger */}
          <button
            type="button"
            onClick={onOpenAccount}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#12141C] border border-[#1E2230] text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors flex items-center gap-2"
            title="Customer Account & Orders"
          >
            <User size={18} />
            <span className="hidden sm:inline font-mono text-xs">
              {currentUser ? currentUser.name.split(' ')[0] : (lang === 'bn' ? 'অ্যাকাউন্ট' : 'Account')}
            </span>
          </button>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={onOpenCart}
            className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-95"
            title="View Shopping Bag"
          >
            <ShoppingBag size={16} />
            <span>BAG ({cartCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
}
