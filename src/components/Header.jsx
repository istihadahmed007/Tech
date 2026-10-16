import React, { useState, useEffect } from 'react';
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
  Lock,
  LogOut,
  Package
} from 'lucide-react';

export default function Header({ 
  storeName, 
  t = {}, 
  lang = 'en', 
  setLang, 
  currentUser,
  cartCount, 
  wishlistCount, 
  onOpenCart, 
  onOpenWishlist, 
  onOpenSupport,
  onOpenAccount,
  onOpenTracking,
  searchQuery, 
  setSearchQuery,
  onScrollToFinder,
  onGoHome,
  onGoToShop
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleMobileSearch = () => {
    setSearchOpen((prev) => {
      if (!prev) setMobileMenuOpen(false);
      return !prev;
    });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => {
      if (!prev) setSearchOpen(false);
      return !prev;
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all bg-white/92 backdrop-blur-md border-b border-[#DCE7F0]/80 shadow-2xs">
      <div className="container flex items-center justify-between gap-3 py-3 sm:py-3.5">
        {/* Left: Brand Name & Main Nav Links */}
        <div className="flex items-center gap-4 sm:gap-8 lg:gap-10 min-w-0">
          <a 
            href="/" 
            onClick={(e) => {
              if (onGoHome) {
                e.preventDefault();
                onGoHome();
              }
            }}
            className="flex items-center group shrink-0 select-none py-0.5"
            title="Tech Nest — Everyday Tech Upgrades"
          >
            <img 
              src="/assets/tech-nest-logo-horizontal.png" 
              alt="Tech Nest" 
              className="h-11 sm:h-13 md:h-14 lg:h-15 w-auto object-contain drop-shadow-md group-hover:scale-[1.03] transition-transform duration-200" 
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[15px] font-medium text-[#334155]">
            <a 
              href="#products-section" 
              onClick={(e) => {
                if (onGoToShop) {
                  e.preventDefault();
                  onGoToShop();
                }
              }}
              className="nav-link-btn"
            >
              {t.navShop || 'Shop'}
            </a>
            <button 
              onClick={onScrollToFinder}
              className="nav-link-btn"
            >
              {t.navFindFit || 'Find my fit'}
            </button>
            <button 
              onClick={() => onOpenTracking('')}
              className="nav-link-btn text-[#145CFF] font-semibold flex items-center gap-1"
            >
              <Package size={15} />
              <span>{t.navTrackOrder || 'Track Order'}</span>
            </button>
            <button 
              onClick={onOpenSupport}
              className="nav-link-btn"
            >
              {t.navSupport || 'Support'}
            </button>
          </nav>
        </div>

        {/* Center: Search Input */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder || "Search for cases, earbuds, chargers and more..."}
              className="w-full text-xs font-normal pl-9 pr-8 py-2 rounded-full bg-white/85 border border-slate-200/90 focus:bg-white focus:border-[#145CFF] focus:ring-2 focus:ring-blue-100 outline-none text-[#0F172A] placeholder-[#94A3B8] transition-all shadow-2xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A]"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Rightmost Action Icons */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          {/* Mobile Search Trigger */}
          <button 
            onClick={toggleMobileSearch}
            className="lg:hidden p-1.5 sm:p-2 rounded-full hover:bg-slate-100 text-[#0F172A] transition-colors focus-visible:ring-2 focus-visible:ring-[#145CFF]"
            aria-label="Toggle mobile search"
            aria-expanded={searchOpen}
          >
            <Search size={19} />
          </button>

          {/* Language Switcher Pill */}
          <button
            onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
            className="hidden md:flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200 bg-white/80 hover:bg-white text-slate-700 transition-colors"
            title="Switch Language (English / বাংলা)"
          >
            <Globe size={13} className="text-[#145CFF]" />
            <span>{lang === 'en' ? 'BN' : 'EN'}</span>
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={onOpenWishlist}
            className="relative p-1.5 sm:p-2 rounded-full hover:bg-slate-100 text-[#334155] hover:text-pink-600 transition-colors"
            aria-label="Wishlist"
            title="Saved items"
          >
            <Heart size={19} />
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Customer Account Button */}
          <button
            onClick={onOpenAccount}
            className="p-1.5 sm:p-2 rounded-full hover:bg-slate-100 text-[#334155] hover:text-[#145CFF] transition-colors flex items-center gap-1.5"
            aria-label="Customer Account"
            title={currentUser ? `Account: ${currentUser.name}` : "Sign In / Account"}
          >
            <User size={19} />
            {currentUser && (
              <span className="hidden xl:inline text-xs font-bold text-[#10263D] max-w-[80px] truncate">
                {currentUser.name.split(' ')[0]}
              </span>
            )}
          </button>


          {/* Shopping Bag Trigger Icon */}
          <button
            onClick={onOpenCart}
            className="relative p-1.5 sm:p-2 rounded-full hover:bg-slate-100 text-[#0F172A] hover:text-[#145CFF] transition-colors"
            aria-label="Shopping Bag"
            title="Shopping Bag"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4.5 h-4.5 rounded-full bg-[#145CFF] text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-1.5 sm:p-2 rounded-full hover:bg-slate-100 text-[#0F172A] focus-visible:ring-2 focus-visible:ring-[#145CFF]"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {searchOpen && (
        <div className="container lg:hidden pt-1 pb-3 animate-fadeIn">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder || "Search for cases, earbuds, chargers and more..."}
              autoFocus
              className="w-full pl-9 pr-9 py-2.5 rounded-full bg-white border border-slate-300 shadow-sm outline-none text-xs text-[#0F172A]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="container md:hidden pb-4 animate-fadeIn">
          <div className="rounded-2xl bg-white border border-[#DCE7F0] p-5 shadow-xl flex flex-col gap-3">
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
              <img 
                src="/assets/tech-nest-logo-horizontal.png" 
                alt="Tech Nest Logo" 
                className="h-10 w-auto object-contain drop-shadow-sm" 
              />
            </div>
            <nav className="flex flex-col gap-1 text-sm font-medium text-[#0F172A]">
            <a 
              href="#products-section" 
              onClick={(e) => {
                setMobileMenuOpen(false);
                if (onGoToShop) {
                  e.preventDefault();
                  onGoToShop();
                }
              }}
              className="p-2.5 rounded-xl hover:bg-slate-50 font-semibold"
            >
              {t.navShop || 'Shop'}
            </a>
            <button 
              onClick={() => { setMobileMenuOpen(false); onScrollToFinder(); }}
              className="p-2.5 rounded-xl hover:bg-slate-50 text-left"
            >
              {t.navFindFit || 'Find my fit'}
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenCart(); }}
              className="p-2.5 rounded-xl hover:bg-slate-50 text-left flex items-center justify-between font-semibold text-[#0F1111]"
            >
              <span>{lang === 'bn' ? 'শপিং কার্ট' : 'Shopping Cart'} ({cartCount})</span>
              <ShoppingBag size={16} className="text-[#145CFF]" />
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenTracking(''); }}
              className="p-2.5 rounded-xl hover:bg-slate-50 text-left text-[#145CFF] font-semibold flex items-center justify-between"
            >
              <span>{t.navTrackOrder || 'Track Order'}</span>
              <ShieldCheck size={16} />
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenAccount(); }}
              className="p-2.5 rounded-xl hover:bg-slate-50 text-left flex items-center justify-between"
            >
              <span>{currentUser ? `Account: ${currentUser.name}` : (lang === 'bn' ? 'সাইন ইন / রেজিস্টার' : 'Sign In / Register')}</span>
              <User size={16} />
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenSupport(); }}
              className="p-2.5 rounded-xl hover:bg-slate-50 text-left"
            >
              {t.navSupport || 'Support'}
            </button>
            </nav>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Currency: <strong>BDT (৳)</strong></span>
            <button
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="text-[#145CFF] font-bold"
            >
              Switch to {lang === 'en' ? 'বাংলা' : 'English'}
            </button>
          </div>
          </div>
        </div>
      )}
    </header>
  );
}
