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
  Scale
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
    if (onGoToShop) onGoToShop();
  };

  const handleSuggestionClick = (product) => {
    setShowSuggestions(false);
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  const popularKeywords = [
    { label: 'Ultrapods', query: 'Ultrapods' },
    { label: '120W Cable', query: '120W' },
    { label: 'Smartwatch', query: 'Smartwatch' },
    { label: 'Pro TWS', query: 'TWS' },
    { label: 'Neckband', query: 'Neckband' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#DCEAF1] shadow-xs">
      {/* Top Main Header Container */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Left: Tech Nest Logo */}
        <a 
          href="/" 
          onClick={(e) => {
            if (onGoHome) {
              e.preventDefault();
              onGoHome();
            }
          }}
          className="flex items-center group shrink-0 select-none py-0.5"
          title="Tech Nest — Authentic Mobile Accessories"
        >
          <BrandLogo 
            height={44} 
            className="h-9 sm:h-11 md:h-12 w-auto transition-transform duration-200 group-hover:scale-[1.02]" 
          />
        </a>

        {/* Center: Shopee-Style Large Search Bar */}
        <div ref={searchContainerRef} className="hidden lg:flex flex-col flex-1 max-w-2xl mx-2 relative">
          <form onSubmit={handleSearchSubmit} className="shopee-search-bar relative">
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
              placeholder={t.searchPlaceholder || "Search for phone cases, chargers, earbuds, cables & smartwatches..."}
              className="shopee-search-input"
            />
            
            {searchQuery && (
              <button 
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShowSuggestions(false);
                }}
                className="px-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}

            <button 
              type="submit"
              className="shopee-search-btn"
              title="Search products"
            >
              <Search size={16} />
              <span>{lang === 'bn' ? 'খুঁজুন' : 'Search'}</span>
            </button>
          </form>

          {/* Quick trending search tags below search bar (Shopee style) */}
          <div className="flex items-center gap-2 mt-1 px-1 text-[11px] text-slate-500 overflow-hidden whitespace-nowrap">
            <span className="font-semibold text-slate-400">{lang === 'bn' ? 'জনপ্রিয়:' : 'Trending:'}</span>
            {popularKeywords.map((kw) => (
              <button
                key={kw.query}
                type="button"
                onClick={() => {
                  setSearchQuery(kw.query);
                  if (onGoToShop) onGoToShop();
                }}
                className="hover:text-[#168FC2] transition-colors cursor-pointer"
              >
                {kw.label}
              </button>
            ))}
          </div>

          {/* Predictive Search Suggestions Dropdown */}
          {showSuggestions && liveSuggestions.length > 0 && (
            <div className="search-suggestions-dropdown py-2 border border-slate-200 shadow-xl bg-white">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                <span>{lang === 'bn' ? 'প্রস্তাবিত পণ্যসমূহ' : 'Suggested Products'}</span>
                <span className="text-[#168FC2] text-[10px]">{liveSuggestions.length} items</span>
              </div>
              {liveSuggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSuggestionClick(item)}
                  className="px-3 py-2 flex items-center gap-3 hover:bg-[#DDF4FC] cursor-pointer transition-colors border-b border-slate-50 last:border-b-0"
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-10 h-10 object-contain rounded bg-white p-0.5 border border-slate-200 shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#102A43] truncate">
                      {lang === 'bn' ? (item.titleBn || item.title) : item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-[#168FC2]">৳{item.price.toLocaleString()}</span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-[10px] text-slate-400 line-through">৳{item.originalPrice.toLocaleString()}</span>
                      )}
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded uppercase">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-400 group-hover:text-[#168FC2]" />
                </div>
              ))}
              <div className="p-2 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="text-xs font-bold text-[#168FC2] hover:underline cursor-pointer"
                >
                  {lang === 'bn' ? `"${searchQuery}" এর সব ফলাফল দেখুন` : `View all results for "${searchQuery}"`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Actions: Wishlist, Customer Account & Shopping Cart */}
        {/* Right Actions: Wishlist, Comparison, Customer Account & Shopping Bag */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Mobile Search Button */}
          <button 
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            aria-label="Toggle Search"
          >
            <Search size={20} />
          </button>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={onOpenWishlist}
            className="relative p-2 rounded-xl hover:bg-slate-100 text-[#0F172A] hover:text-[#145CFF] transition-colors cursor-pointer"
            aria-label="Wishlist"
            title="Saved items"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Comparison Matrix Trigger Button */}
          <button
            type="button"
            onClick={onOpenComparison}
            className="relative p-2 rounded-xl hover:bg-slate-100 text-[#0F172A] hover:text-[#145CFF] transition-colors cursor-pointer"
            aria-label="Product Comparison Matrix"
            title="Side-by-side comparison"
          >
            <Scale size={20} />
            {comparisonCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 rounded-full bg-[#145CFF] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {comparisonCount}
              </span>
            )}
          </button>

          {/* Customer Account Button */}
          <button
            type="button"
            onClick={onOpenAccount}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 text-[#0F172A] transition-colors flex items-center gap-2 cursor-pointer border border-transparent hover:border-slate-200"
            aria-label="Customer Account"
            title={currentUser ? `Account: ${currentUser.name}` : "Sign In / Register"}
          >
            <User size={19} className="text-[#0F172A]" />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-[10px] text-slate-500 leading-none">
                {currentUser ? (lang === 'bn' ? 'আমার প্রোফাইল' : 'Hello,') : (lang === 'bn' ? 'সাইন ইন' : 'Sign In')}
              </span>
              <span className="text-xs font-bold text-[#0F172A] leading-tight max-w-[95px] truncate">
                {currentUser ? currentUser.name.split(' ')[0] : (lang === 'bn' ? 'অ্যাকাউন্ট' : 'Account')}
              </span>
            </div>
          </button>

          {/* Modern Electric-Blue Shopping Bag Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-[#145CFF] hover:bg-[#0D4BD9] text-white font-bold transition-all cursor-pointer shadow-xs active:scale-95"
            aria-label="Shopping Cart"
            title="View Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-white text-[#145CFF] text-[10px] font-extrabold flex items-center justify-center shadow-xs border border-[#145CFF]/20">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-bold">
              {lang === 'bn' ? 'কার্ট' : 'Cart'}
            </span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-[#0F172A] cursor-pointer transition-colors"
            aria-label="Toggle mobile navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Subheader: Clean Tech Categories Navigation Strip */}
      <div className="border-t border-[#E2E8F0] bg-white hidden lg:block">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <nav className="flex items-center gap-1 sm:gap-1.5 py-1.5 text-xs font-semibold text-[#0F172A] overflow-x-auto scrollbar-none">
            {/* Categories */}
            <button
              type="button"
              onClick={() => {
                if (onSelectCategory) onSelectCategory(null);
                if (onGoToShop) onGoToShop();
              }}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-100 text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              {lang === 'bn' ? 'সকল পণ্য' : 'All Products'}
            </button>

            <button
              type="button"
              onClick={() => {
                if (onSelectCategory) onSelectCategory('audio');
                if (onGoToShop) onGoToShop();
              }}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-100 text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              {lang === 'bn' ? 'অডিও ও ইয়ারবাডস' : 'Audio & Earbuds'}
            </button>

            <button
              type="button"
              onClick={() => {
                if (onSelectCategory) onSelectCategory('charging');
                if (onGoToShop) onGoToShop();
              }}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-100 text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              {lang === 'bn' ? 'ফাস্ট চার্জার ও ক্যাবল' : 'Fast Chargers & Cables'}
            </button>

            <button
              type="button"
              onClick={() => {
                if (onSelectCategory) onSelectCategory('wearables');
                if (onGoToShop) onGoToShop();
              }}
              className="px-3 py-1.5 rounded-lg hover:bg-slate-100 text-[#475569] hover:text-[#0F172A] transition-colors cursor-pointer"
            >
              {lang === 'bn' ? 'স্মার্টওয়াচ' : 'Smartwatches'}
            </button>

            <span className="text-slate-300 mx-1">|</span>

            {/* Signature Shopping Features */}
            <button
              type="button"
              onClick={onScrollToFinder}
              className="px-2.5 py-1 rounded-lg text-[#145CFF] hover:bg-blue-50 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles size={13} />
              <span>{lang === 'bn' ? 'স্মার্ট টেক ফাইন্ডার' : 'Smart Tech Finder'}</span>
            </button>

            <button
              type="button"
              onClick={onScrollToKits}
              className="px-2.5 py-1 rounded-lg text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Package size={13} className="text-[#145CFF]" />
              <span>{lang === 'bn' ? 'টেক কিটস' : 'Tech Kits'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenComparison}
              className="px-2.5 py-1 rounded-lg text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Scale size={13} className="text-[#475569]" />
              <span>{lang === 'bn' ? 'প্রোডাক্ট তুলনা' : 'Compare'}</span>
              {comparisonCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#145CFF] text-white text-[10px] font-bold flex items-center justify-center">
                  {comparisonCount}
                </span>
              )}
            </button>
          </nav>

          <div className="flex items-center gap-3 text-xs font-semibold py-1">
            <span className="text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px]">
              <ShieldCheck size={13} />
              <span>{lang === 'bn' ? '১০০% অরিজিনাল গ্যাজেট' : '100% Genuine Tech'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Search Input Drawer */}
      {searchOpen && (
        <div className="lg:hidden px-4 py-2.5 bg-slate-50 border-t border-slate-200">
          <form onSubmit={handleSearchSubmit} className="shopee-search-bar">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder || "Search products..."}
              autoFocus
              className="shopee-search-input py-2 text-xs"
            />
            <button type="submit" className="shopee-search-btn py-2 px-3">
              <Search size={15} />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 py-4 bg-white border-t border-slate-200 shadow-xl animate-fadeIn space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <BrandLogo height={38} className="h-9 w-auto" />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 rounded text-slate-500"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onSelectCategory) onSelectCategory(null);
                if (onGoToShop) onGoToShop();
              }}
              className="p-2.5 rounded-xl bg-slate-50 text-left hover:bg-[#EFF6FF] hover:text-[#145CFF] text-[#0F172A] transition-colors"
            >
              {lang === 'bn' ? 'সব পণ্য' : 'All Products'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onSelectCategory) onSelectCategory('audio');
                if (onGoToShop) onGoToShop();
              }}
              className="p-2.5 rounded-xl bg-slate-50 text-left hover:bg-[#EFF6FF] hover:text-[#145CFF] text-[#0F172A] transition-colors"
            >
              {lang === 'bn' ? 'অডিও ও ইয়ারবাডস' : 'Audio & Earbuds'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onSelectCategory) onSelectCategory('charging');
                if (onGoToShop) onGoToShop();
              }}
              className="p-2.5 rounded-xl bg-slate-50 text-left hover:bg-[#EFF6FF] hover:text-[#145CFF] text-[#0F172A] transition-colors"
            >
              {lang === 'bn' ? 'চার্জার ও ক্যাবল' : 'Chargers & Cables'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onSelectCategory) onSelectCategory('wearables');
                if (onGoToShop) onGoToShop();
              }}
              className="p-2.5 rounded-xl bg-slate-50 text-left hover:bg-[#EFF6FF] hover:text-[#145CFF] text-[#0F172A] transition-colors"
            >
              {lang === 'bn' ? 'স্মার্টওয়াচ' : 'Smartwatches'}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5 text-xs font-medium text-slate-700">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenTracking) onOpenTracking('');
              }}
              className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg text-[#0F172A] transition-colors"
            >
              <Package size={15} className="text-[#145CFF]" />
              <span>{lang === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Track Order Status'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenSupport) onOpenSupport();
              }}
              className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg text-[#0F172A] transition-colors"
            >
              <HelpCircle size={15} className="text-[#145CFF]" />
              <span>{lang === 'bn' ? 'কাস্টমার সাপোর্ট' : 'Support & Warranty'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAccount) onOpenAccount();
              }}
              className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg font-semibold text-[#0F172A] transition-colors"
            >
              <User size={15} className="text-[#145CFF]" />
              <span>{currentUser ? `Profile (${currentUser.name})` : (lang === 'bn' ? 'সাইন ইন / রেজিস্টার' : 'Sign In / Register')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
