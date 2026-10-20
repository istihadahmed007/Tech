import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  X, 
  User, 
  Menu,
  Scale,
  Sparkles,
  ArrowRight,
  Headphones,
  Zap,
  PhoneCall
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchContainerRef = useRef(null);

  // Sticky header scroll opacity transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        (p.brand && p.brand.toLowerCase().includes(q))
      );
    }).slice(0, 5);
  }, [searchQuery, products]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);

    const q = searchQuery.toLowerCase().trim();
    if (q.includes('free') || q.includes('delivery') || q.includes('2000') || q.includes('kit') || q.includes('bundle')) {
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

  return (
    <header className={`sticky top-0 z-50 w-full nav-gradient text-white transition-all duration-300 ${
      isScrolled ? 'shadow-lg bg-opacity-95 backdrop-blur-md' : 'shadow-sm backdrop-blur-sm'
    }`}>
      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <a 
            href="/" 
            onClick={(e) => {
              if (onGoHome) {
                e.preventDefault();
                onGoHome();
              }
            }}
            className="flex items-center gap-2 group select-none text-white hover:opacity-95 transition"
            title="Tech Nest — Authentic Mobile Accessories"
          >
            <BrandLogo 
              variant="horizontal"
              height={38} 
              className="h-8 sm:h-9 w-auto brightness-0 invert drop-shadow-xs" 
            />
            <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full border border-white/30 backdrop-blur-xs">
              AI Store
            </span>
          </a>
        </div>

        {/* Center: Navigation Links (Reference: Home, Shop, Blog/Tech Kits, Contact Us) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold tracking-wide text-white/95">
          <button 
            type="button"
            onClick={onGoHome} 
            className="hover:text-white transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-white"
          >
            Home
          </button>
          <button 
            type="button"
            onClick={onGoToShop} 
            className="hover:text-white transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-white"
          >
            Shop
          </button>
          <button 
            type="button"
            onClick={onScrollToKits} 
            className="hover:text-white transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-white"
          >
            Bundles
          </button>
          <button 
            type="button"
            onClick={onOpenSupport} 
            className="hover:text-white transition-colors cursor-pointer py-1 border-b-2 border-transparent hover:border-white"
          >
            Contact Us
          </button>
        </nav>

        {/* Right Area: Frosted Pill Search & User Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Frosted Pill Search (Exact match to reference image) */}
          <div ref={searchContainerRef} className="relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
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
                placeholder="Search gear..."
                className="w-36 sm:w-52 lg:w-64 bg-white/30 hover:bg-white/40 focus:bg-white focus:text-slate-900 placeholder-white/85 focus:placeholder-slate-400 text-white text-xs font-medium rounded-full py-2 pl-4 pr-9 outline-none transition backdrop-blur-md border border-white/35 shadow-xs"
              />
              <button 
                type="submit"
                className="absolute right-2.5 text-white/90 hover:text-white focus:text-blue-600 transition cursor-pointer"
                aria-label="Search"
              >
                <Search size={15} />
              </button>
            </form>

            {/* Live Search Suggestions Dropdown */}
            {showSuggestions && liveSuggestions.length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 py-2 border border-blue-100 shadow-2xl bg-white rounded-2xl z-50 text-slate-800 animate-fadeIn">
                <div className="px-3.5 py-1.5 text-[11px] font-mono font-bold text-blue-600 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                  <span>Verified Catalog</span>
                  <span className="text-slate-400 font-normal">{liveSuggestions.length} matches</span>
                </div>
                {liveSuggestions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSuggestionClick(item)}
                    className="px-3.5 py-2 flex items-center gap-3 hover:bg-blue-50/70 cursor-pointer transition-colors border-b border-slate-50 last:border-b-0"
                  >
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-9 h-9 object-contain rounded-lg bg-slate-50 p-0.5 border border-slate-200 shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {lang === 'bn' ? (item.titleBn || item.title) : item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-xs font-bold text-blue-600">৳{item.price.toLocaleString()}</span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="font-mono text-[10px] text-slate-400 line-through">৳{item.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist Trigger */}
          {wishlistCount > 0 && (
            <button
              type="button"
              onClick={onOpenWishlist}
              className="relative p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
              title="Open Saved Wishlist"
              aria-label="Open Wishlist"
            >
              <Heart size={16} />
              <span className="absolute -top-1 -right-1 font-mono text-[9px] font-bold bg-rose-500 text-white w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            </button>
          )}

          {/* Sign In / Account Area */}
          <button
            type="button"
            onClick={onOpenAccount}
            className="text-xs font-semibold hover:opacity-95 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition cursor-pointer border border-white/25"
            title="Customer Account & Orders"
          >
            <User size={14} />
            <span>{currentUser ? currentUser.name.split(' ')[0] : 'Sign in'}</span>
          </button>

          {/* Shopping Bag / Cart */}
          <button
            type="button"
            onClick={onOpenCart}
            className="text-xs font-semibold hover:opacity-95 flex items-center gap-1.5 bg-white/25 hover:bg-white/35 px-3 py-1.5 rounded-full transition cursor-pointer border border-white/30 shadow-xs active:scale-95"
            title="View Bag"
            aria-label={`Shopping bag with ${cartCount} items`}
          >
            <ShoppingBag size={14} />
            <span className="hidden sm:inline">Bag</span>
            <span className="font-mono bg-white text-blue-600 px-1.5 py-0.2 rounded-full text-[11px] font-bold">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Crisp White Divider Line from Reference Image */}
      <div className="h-0.5 bg-white/80 w-full" />

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white text-slate-800 border-b border-blue-100 shadow-xl px-5 py-4 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase">Menu</span>
            <button 
              type="button"
              onClick={() => setMobileMenuOpen(false)} 
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex flex-col space-y-2 text-sm font-semibold">
            <button 
              type="button"
              onClick={() => { onGoHome(); setMobileMenuOpen(false); }}
              className="text-left py-2 hover:text-blue-600 border-b border-slate-50 flex items-center justify-between"
            >
              <span>Home</span>
              <ArrowRight size={14} className="text-slate-400" />
            </button>
            <button 
              type="button"
              onClick={() => { onGoToShop(); setMobileMenuOpen(false); }}
              className="text-left py-2 hover:text-blue-600 border-b border-slate-50 flex items-center justify-between"
            >
              <span>Shop All Products</span>
              <ArrowRight size={14} className="text-slate-400" />
            </button>
            <button 
              type="button"
              onClick={() => { onScrollToKits(); setMobileMenuOpen(false); }}
              className="text-left py-2 hover:text-blue-600 border-b border-slate-50 flex items-center justify-between"
            >
              <span>Special Bundles (Free Delivery ৳2,000+)</span>
              <Zap size={14} className="text-blue-500" />
            </button>
            <button 
              type="button"
              onClick={() => { onOpenSupport(); setMobileMenuOpen(false); }}
              className="text-left py-2 hover:text-blue-600 flex items-center justify-between"
            >
              <span>Contact Us & Warranty</span>
              <PhoneCall size={14} className="text-slate-400" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
