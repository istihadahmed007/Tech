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
  LogOut
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
  onOpenAdmin,
  onOpenTracking,
  searchQuery, 
  setSearchQuery,
  onScrollToFinder
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
    <header className="sticky top-0 z-50 w-full px-5 sm:px-12 lg:px-14 py-3.5 transition-all bg-[#F7FBFF]/85 backdrop-blur-md border-b border-[#DCE7F0]">
      <div className="max-w-[1320px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Name & Main Nav Links */}
        <div className="flex items-center gap-8 lg:gap-10">
          <a 
            href="#" 
            className="font-extrabold text-2xl tracking-tight text-[#10263D] hover:text-[#145CFF] transition-colors leading-none"
          >
            {storeName || "Accessories"}
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-[15px] font-medium text-[#334155]">
            <a 
              href="#products-section" 
              className="nav-link-btn"
            >
              Shop
            </a>
            <button 
              onClick={onScrollToFinder}
              className="nav-link-btn"
            >
              Find my fit
            </button>
            <button 
              onClick={() => onOpenTracking('')}
              className="nav-link-btn text-[#145CFF] font-semibold flex items-center gap-1"
            >
              <Package size={15} />
              <span>Track Order</span>
            </button>
            <button 
              onClick={onOpenSupport}
              className="nav-link-btn"
            >
              Support
            </button>
          </nav>
        </div>

        {/* Center: Search Input */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for cases, earbuds, chargers and more..."
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
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Search Trigger */}
          <button 
            onClick={toggleMobileSearch}
            className="md:hidden p-2 rounded-full hover:bg-slate-100 text-[#0F172A] transition-colors focus-visible:ring-2 focus-visible:ring-[#145CFF]"
            aria-label="Toggle mobile search"
            aria-expanded={searchOpen}
          >
            <Search size={20} />
          </button>

          {/* Language Switcher Pill */}
          <button
            onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
            className="hidden sm:flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200 bg-white/80 hover:bg-white text-slate-700 transition-colors"
            title="Switch Language (English / বাংলা)"
          >
            <Globe size={13} className="text-[#145CFF]" />
            <span>{lang === 'en' ? 'BN' : 'EN'}</span>
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 rounded-full hover:bg-slate-100 text-[#334155] hover:text-pink-600 transition-colors"
            aria-label="Wishlist"
            title="Saved items"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Customer Account Button */}
          <button
            onClick={onOpenAccount}
            className="p-2 rounded-full hover:bg-slate-100 text-[#334155] hover:text-[#145CFF] transition-colors flex items-center gap-1.5"
            aria-label="Customer Account"
            title={currentUser ? `Account: ${currentUser.name}` : "Sign In / Account"}
          >
            <User size={20} />
            {currentUser && (
              <span className="hidden xl:inline text-xs font-bold text-[#10263D] max-w-[80px] truncate">
                {currentUser.name.split(' ')[0]}
              </span>
            )}
          </button>

          {/* Admin Operations Button */}
          <button
            onClick={onOpenAdmin}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#10263D] transition-colors"
            aria-label="Store Admin Console"
            title="Admin Console"
          >
            <Lock size={18} />
          </button>

          {/* Shopping Bag Trigger Icon */}
          <button
            onClick={onOpenCart}
            className="relative p-2 rounded-full hover:bg-slate-100 text-[#0F172A] hover:text-[#145CFF] transition-colors"
            aria-label="Shopping Bag"
            title="Shopping Bag"
          >
            <ShoppingBag size={21} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4.5 h-4.5 rounded-full bg-[#145CFF] text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-full hover:bg-slate-100 text-[#0F172A] focus-visible:ring-2 focus-visible:ring-[#145CFF]"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {searchOpen && (
        <div className="md:hidden mt-3 px-2 max-w-[1280px] mx-auto animate-fadeIn">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for cases, earbuds, chargers and more..."
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
        <div className="md:hidden mt-3 max-w-[1280px] mx-auto rounded-2xl bg-white border border-slate-200 p-5 shadow-xl flex flex-col gap-3 animate-fadeIn">
          <nav className="flex flex-col gap-1 text-sm font-medium text-[#0F172A]">
            <a 
              href="#products-section" 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl hover:bg-slate-50 font-semibold"
            >
              Shop
            </a>
            <button 
              onClick={() => { setMobileMenuOpen(false); onScrollToFinder(); }}
              className="p-2.5 rounded-xl hover:bg-slate-50 text-left"
            >
              Find my fit
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenTracking(''); }}
              className="p-2.5 rounded-xl hover:bg-slate-50 text-left text-[#145CFF] font-semibold flex items-center justify-between"
            >
              <span>Track Order</span>
              <ShieldCheck size={16} />
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenAccount(); }}
              className="p-2.5 rounded-xl hover:bg-slate-50 text-left flex items-center justify-between"
            >
              <span>{currentUser ? `Account: ${currentUser.name}` : 'Sign In / Register'}</span>
              <User size={16} />
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenSupport(); }}
              className="p-2.5 rounded-xl hover:bg-slate-50 text-left"
            >
              Support
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
              className="p-2.5 rounded-xl hover:bg-slate-50 text-left text-slate-500 flex items-center justify-between text-xs"
            >
              <span>Store Admin Operations</span>
              <Lock size={15} />
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
      )}
    </header>
  );
}
