import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  ShieldCheck, 
  Menu, 
  X, 
  SlidersHorizontal, 
  Globe, 
  User, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

export default function Header({ 
  storeName, 
  t, 
  lang, 
  setLang, 
  cartCount, 
  wishlistCount, 
  onOpenCart, 
  onOpenWishlist, 
  onOpenSupport,
  onOpenAdmin,
  onOpenTracking,
  searchQuery, 
  setSearchQuery,
  onSelectCategory,
  onScrollToFinder
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-3 transition-all duration-200">
      <div 
        className="max-w-[1360px] mx-auto rounded-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between"
        style={{
          background: 'rgba(248, 252, 255, 0.88)',
          backdropFilter: 'blur(20px) saturate(190%)',
          WebkitBackdropFilter: 'blur(20px) saturate(190%)',
          border: '1px solid rgba(37, 99, 235, 0.14)',
          boxShadow: '0 8px 32px -4px rgba(17, 42, 67, 0.06), inset 0 1px 1.5px rgba(255, 255, 255, 0.95)'
        }}
      >
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Sparkles size={18} />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#112A43] leading-none">
                {storeName || t.brandName}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600">
                Glacial Studio
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-[14px] font-semibold text-[#4B637B]">
            <a 
              href="#products-section" 
              className="hover:text-blue-600 transition-colors py-1"
            >
              {t.navShop}
            </a>
            <button 
              onClick={onScrollToFinder}
              className="hover:text-blue-600 transition-colors py-1 flex items-center gap-1.5"
            >
              <SlidersHorizontal size={14} />
              {t.navFindFit}
            </button>
            <button 
              onClick={onOpenSupport}
              className="hover:text-blue-600 transition-colors py-1 flex items-center gap-1"
            >
              {t.navSupport}
            </button>
            <button 
              onClick={onOpenTracking}
              className="hover:text-blue-600 transition-colors py-1 text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200/50 hover:bg-blue-100"
            >
              {t.navTrackOrder}
            </button>
          </nav>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center relative w-56 xl:w-64">
            <Search size={16} className="absolute left-3 text-[#8FA6BE]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full text-xs font-medium pl-9 pr-8 py-2 rounded-full bg-white/70 border border-blue-200/60 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-[#112A43] placeholder-[#8FA6BE] transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-[#8FA6BE] hover:text-[#112A43]"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Search Trigger for Mobile */}
          <button 
            onClick={() => setSearchOpen(!searchOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-blue-50 text-[#112A43] transition-colors"
            aria-label="Search"
          >
            <Search size={19} />
          </button>

          {/* Language Switcher (EN / বাংলা) */}
          <button
            onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
            className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-full border border-blue-200/60 bg-white/60 hover:bg-white text-[#112A43] transition-all"
            title="Switch Language (English / বাংলা)"
          >
            <Globe size={13} className="text-blue-600" />
            <span>{lang === 'en' ? 'বাংলা' : 'ENG'}</span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 rounded-full hover:bg-blue-50 text-[#112A43] transition-colors"
            aria-label="Wishlist"
          >
            <Heart size={19} />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center shadow">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Trigger Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={15} />
            <span className="hidden sm:inline">Bag</span>
            <span className="w-5 h-5 rounded-full bg-white text-blue-600 text-[11px] font-extrabold flex items-center justify-center">
              {cartCount}
            </span>
          </button>

          {/* Admin shortcut */}
          <button
            onClick={onOpenAdmin}
            className="hidden sm:flex p-2 rounded-full hover:bg-blue-50 text-[#4B637B] hover:text-blue-600 transition-colors"
            title="Admin Portal"
            aria-label="Admin Portal"
          >
            <User size={18} />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-blue-50 text-[#112A43]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {searchOpen && (
        <div className="lg:hidden mt-2 px-2 max-w-[1360px] mx-auto animate-fadeIn">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-3 text-[#8FA6BE]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              autoFocus
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-blue-200 shadow-md outline-none text-sm text-[#112A43]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-slate-400"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-[1360px] mx-auto rounded-2xl bg-white/95 backdrop-blur-2xl border border-blue-200/80 p-5 shadow-2xl flex flex-col gap-4 animate-fadeIn">
          <div className="flex flex-col gap-2 font-medium text-sm text-[#112A43]">
            <a 
              href="#products-section" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-blue-50 font-semibold"
            >
              {t.navShop}
            </a>
            <button 
              onClick={() => { setMobileMenuOpen(false); onScrollToFinder(); }}
              className="p-2 rounded-lg hover:bg-blue-50 text-left flex items-center justify-between"
            >
              <span>{t.navFindFit}</span>
              <SlidersHorizontal size={15} className="text-blue-600" />
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenSupport(); }}
              className="p-2 rounded-lg hover:bg-blue-50 text-left flex items-center justify-between"
            >
              <span>{t.navSupport}</span>
              <HelpCircle size={15} className="text-blue-600" />
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenTracking(); }}
              className="p-2 rounded-lg hover:bg-blue-50 text-left flex items-center justify-between text-blue-600 font-semibold"
            >
              <span>{t.navTrackOrder}</span>
              <ShieldCheck size={15} />
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
              className="p-2 rounded-lg hover:bg-blue-50 text-left flex items-center justify-between text-slate-600"
            >
              <span>{t.navAdmin}</span>
              <User size={15} />
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Currency: <strong>BDT (৳)</strong></span>
            <button
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
              className="text-blue-600 font-bold"
            >
              Switch to {lang === 'en' ? 'বাংলা' : 'English'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
