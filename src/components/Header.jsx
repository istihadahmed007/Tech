import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  X, 
  User, 
  Globe,
  HelpCircle,
  Menu,
  ChevronDown,
  Mic,
  Camera,
  Headphones,
  Watch,
  Glasses,
  Zap,
  Radio,
  ArrowRight
} from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Header({ 
  storeName = "Tech Vartual Tutor", 
  t = {}, 
  lang = 'en', 
  setLang, 
  currentUser,
  cartCount = 0, 
  wishlistCount = 0, 
  cartTotal = 0,
  onOpenCart, 
  onOpenWishlist, 
  onOpenSupport,
  onOpenAccount,
  onOpenTracking,
  searchQuery = '', 
  setSearchQuery,
  onGoHome,
  onGoToShop,
  onSelectCategory,
  onSelectProduct,
  products = []
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [selectedCatLabel, setSelectedCatLabel] = useState('All Categories');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products for search suggestions
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

  const categoryOptions = [
    { label: 'All Categories', id: null },
    { label: 'Smart Watch', id: 'wearables' },
    { label: 'Headphones', id: 'audio' },
    { label: 'Accessories & Charging', id: 'charging' },
    { label: 'Cameras & Drones', id: 'drones' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200/80 shadow-xs">
      {/* Primary Navigation Row (Screenshot 2 Top Bar) */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between gap-4 lg:gap-8">
        
        {/* Left: Brand Logo */}
        <a 
          href="/" 
          onClick={(e) => {
            if (onGoHome) {
              e.preventDefault();
              onGoHome();
            }
          }}
          className="flex items-center gap-2 group shrink-0 select-none py-1"
          title="Tech Vartual Tutor — Authentic Mobile Accessories"
        >
          <BrandLogo variant="horizontal" height={38} className="h-8 sm:h-9 md:h-10 w-auto" alt="Tech Vartual Tutor" />
        </a>

        {/* Center: Integrated Category Selector & Search Bar */}
        <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-xl mx-auto relative">
          <form 
            onSubmit={handleSearchSubmit}
            className="w-full flex items-center h-11 bg-slate-50 hover:bg-slate-100/70 focus-within:bg-white border border-slate-200 focus-within:border-[#0066FF] rounded-full transition-all px-2 pl-3 shadow-2xs"
          >
            {/* Category Dropdown Selector */}
            <div ref={categoryDropdownRef} className="relative shrink-0 pr-3 border-r border-slate-200">
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 py-1 cursor-pointer select-none"
              >
                <span className="max-w-[105px] truncate">{selectedCatLabel}</span>
                <ChevronDown size={14} className="text-slate-400 stroke-[2.5]" />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50">
                  {categoryOptions.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => {
                        setSelectedCatLabel(opt.label);
                        setCategoryDropdownOpen(false);
                        if (onSelectCategory) onSelectCategory(opt.id);
                        if (onGoToShop) onGoToShop();
                      }}
                      className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-[#0066FF] font-medium transition-colors cursor-pointer"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Input Field */}
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
              placeholder="Bluetooth headphones, smartwatches, cables..."
              className="flex-1 bg-transparent px-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />

            {/* Clear Button */}
            {searchQuery && (
              <button 
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShowSuggestions(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}

            {/* Mic / Search Icon */}
            <button 
              type="submit"
              className="p-1.5 text-slate-500 hover:text-[#0066FF] cursor-pointer transition-colors"
              title="Search products"
            >
              <Search size={17} />
            </button>
          </form>

          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && liveSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 overflow-hidden">
              <div className="px-3.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                <span>Matching Products</span>
                <span className="text-[#0066FF] text-[10px] font-semibold">{liveSuggestions.length} found</span>
              </div>
              {liveSuggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSuggestionClick(item)}
                  className="px-3.5 py-2 flex items-center gap-3 hover:bg-blue-50/60 cursor-pointer transition-colors border-b border-slate-50 last:border-b-0"
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 border border-slate-200 shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-[#0066FF]">৳{item.price.toLocaleString()}</span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-[10px] text-slate-400 line-through">৳{item.originalPrice.toLocaleString()}</span>
                      )}
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-400 group-hover:text-[#0066FF]" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Controls: Country/Region, Account, Wishlist, Cart */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-5 shrink-0">
          
          {/* Country / Currency Control */}
          <div className="hidden lg:flex items-center gap-2 text-slate-700 py-1">
            <Globe size={18} className="text-slate-500 shrink-0" />
            <div className="text-left text-xs leading-tight">
              <span className="text-[10px] text-slate-400 block font-normal">Country/Region</span>
              <span className="font-semibold text-slate-800 text-[11px] flex items-center gap-0.5">
                Bangladesh (৳ BDT)
              </span>
            </div>
          </div>

          <span className="hidden lg:inline-block w-px h-6 bg-slate-200" />

          {/* Account Control */}
          <button
            type="button"
            onClick={onOpenAccount}
            className="flex items-center gap-2 p-1 text-slate-700 hover:text-slate-900 cursor-pointer select-none"
            title={currentUser ? `Account: ${currentUser.name}` : "Sign In / Register"}
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <User size={18} />
            </div>
            <div className="hidden sm:flex flex-col text-left text-xs leading-tight">
              <span className="text-[10px] text-slate-400 font-normal">Welcome</span>
              <span className="font-semibold text-slate-800 text-[11px] max-w-[100px] truncate">
                {currentUser ? currentUser.name.split(' ')[0] : 'Sign In / Register'}
              </span>
            </div>
          </button>

          {/* Wishlist Icon */}
          <button
            type="button"
            onClick={onOpenWishlist}
            className="relative p-2 rounded-full hover:bg-slate-100 text-slate-700 hover:text-rose-600 transition-colors cursor-pointer"
            aria-label="Wishlist"
            title="Saved items"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart with Badge */}
          <button
            type="button"
            onClick={onOpenCart}
            className="flex items-center gap-2.5 p-1 sm:pl-2 sm:pr-3 sm:py-1.5 rounded-full hover:bg-slate-100 text-slate-800 transition-all cursor-pointer group"
            aria-label="Shopping Cart"
            title="View Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag size={21} className="text-slate-800 group-hover:text-[#0066FF] transition-colors" />
              <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-[#0066FF] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            </div>
            <div className="hidden sm:flex flex-col text-left text-xs leading-tight">
              <span className="text-[10px] text-slate-400 font-normal">Cart</span>
              <span className="font-bold text-slate-900 text-[11px]">
                ৳{cartTotal.toLocaleString()}
              </span>
            </div>
          </button>

          {/* Mobile Search Toggle */}
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-slate-900 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Secondary Navigation Row (Screenshot 2 Sub-Row) */}
      <div className="border-t border-slate-100 bg-white hidden md:block">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between">
          
          {/* Left Category Shortcuts with Icons */}
          <nav className="flex items-center gap-6 text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => {
                if (onSelectCategory) onSelectCategory('drones');
                if (onGoToShop) onGoToShop();
              }}
              className="flex items-center gap-1.5 hover:text-[#0066FF] transition-colors cursor-pointer py-1"
            >
              <Radio size={14} className="text-slate-400" />
              <span>Drone</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onSelectCategory) onSelectCategory('cameras');
                if (onGoToShop) onGoToShop();
              }}
              className="flex items-center gap-1.5 hover:text-[#0066FF] transition-colors cursor-pointer py-1"
            >
              <Camera size={14} className="text-slate-400" />
              <span>Camera</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onSelectCategory) onSelectCategory('audio');
                if (onGoToShop) onGoToShop();
              }}
              className="flex items-center gap-1.5 hover:text-[#0066FF] transition-colors cursor-pointer py-1"
            >
              <Headphones size={14} className="text-slate-400" />
              <span>Headphones</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onSelectCategory) onSelectCategory('wearables');
                if (onGoToShop) onGoToShop();
              }}
              className="flex items-center gap-1.5 hover:text-[#0066FF] transition-colors cursor-pointer py-1"
            >
              <Watch size={14} className="text-slate-400" />
              <span>Smart Watch</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onSelectCategory) onSelectCategory('vr');
                if (onGoToShop) onGoToShop();
              }}
              className="flex items-center gap-1.5 hover:text-[#0066FF] transition-colors cursor-pointer py-1"
            >
              <Glasses size={14} className="text-slate-400" />
              <span>Virtual Reality</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onSelectCategory) onSelectCategory('charging');
                if (onGoToShop) onGoToShop();
              }}
              className="flex items-center gap-1.5 hover:text-[#0066FF] transition-colors cursor-pointer py-1"
            >
              <Zap size={14} className="text-slate-400" />
              <span>Accessories</span>
            </button>
          </nav>

          {/* Right Utility Navigation Links (Screenshot 2: Blog, Pages, Get help) */}
          <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
            <button
              type="button"
              onClick={() => {
                if (onOpenTracking) onOpenTracking('');
              }}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Track Order
            </button>
            <button
              type="button"
              onClick={() => {
                if (onGoToShop) onGoToShop();
              }}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Pages
            </button>
            <button
              type="button"
              onClick={onOpenSupport}
              className="hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1"
            >
              <HelpCircle size={13} className="text-slate-400" />
              <span>Get help</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-4 bg-white border-t border-slate-200 shadow-xl space-y-3">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="flex items-center h-10 bg-slate-100 rounded-full px-3">
            <Search size={16} className="text-slate-400 mr-2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-transparent text-xs text-slate-900 focus:outline-none"
            />
          </form>

          {/* Mobile Categories */}
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onSelectCategory) onSelectCategory('wearables');
                if (onGoToShop) onGoToShop();
              }}
              className="p-2.5 rounded-xl bg-slate-50 text-left hover:bg-blue-50 hover:text-[#0066FF] text-slate-800 transition-colors"
            >
              Smart Watch
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onSelectCategory) onSelectCategory('audio');
                if (onGoToShop) onGoToShop();
              }}
              className="p-2.5 rounded-xl bg-slate-50 text-left hover:bg-blue-50 hover:text-[#0066FF] text-slate-800 transition-colors"
            >
              Headphones
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onSelectCategory) onSelectCategory('charging');
                if (onGoToShop) onGoToShop();
              }}
              className="p-2.5 rounded-xl bg-slate-50 text-left hover:bg-blue-50 hover:text-[#0066FF] text-slate-800 transition-colors"
            >
              Accessories
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onSelectCategory) onSelectCategory(null);
                if (onGoToShop) onGoToShop();
              }}
              className="p-2.5 rounded-xl bg-slate-50 text-left hover:bg-blue-50 hover:text-[#0066FF] text-slate-800 transition-colors"
            >
              All Products
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5 text-xs font-medium text-slate-700">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenTracking) onOpenTracking('');
              }}
              className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg text-slate-800"
            >
              <span>Track Order Status</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenSupport) onOpenSupport();
              }}
              className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg text-slate-800"
            >
              <span>Support & Help</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAccount) onOpenAccount();
              }}
              className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg font-semibold text-slate-800"
            >
              <span>{currentUser ? `Account (${currentUser.name})` : 'Sign In / Register'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
