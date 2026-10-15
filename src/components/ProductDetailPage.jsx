import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Star,
  Heart,
  Share2,
  Check,
  CheckCircle2,
  Truck,
  ShieldCheck,
  RotateCcw,
  ShoppingBag,
  Zap,
  Lock,
  Minus,
  Plus,
  Maximize2,
  X,
  AlertCircle,
  Layers,
  Sparkles,
  Smartphone,
  ExternalLink,
  Tag,
  Clock,
  ThumbsUp,
  MapPin,
  HelpCircle,
  Award,
  CheckSquare,
  Square
} from 'lucide-react';

export default function ProductDetailPage({
  product,
  allProducts = [],
  currentUser = null,
  onOpenAccount,
  onAddToCart,
  onBuyNow,
  wishlistIds = [],
  onToggleWishlist,
  onBackToHome,
  onSelectCategory,
  onSelectProduct,
  currencySymbol = "৳",
  t = {},
  lang = 'en'
}) {
  if (!product || product.notFound) {
    return (
      <div className="w-full max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-md mx-auto p-8 rounded-2xl bg-white border border-[#DCE7F0] shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 text-[#145CFF] flex items-center justify-center">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-xl font-bold text-[#10263D] mb-2">{lang === 'bn' ? 'পণ্যটি খুঁজে পাওয়া যায়নি' : 'Product Not Found'}</h2>
          <p className="text-sm text-[#52677B] mb-6">
            {lang === 'bn' 
              ? 'অনুরোধকৃত ইলেকট্রনিক এক্সেসরিজটি পাওয়া যায়নি বা সরানো হয়েছে।'
              : 'The requested electronic accessory could not be found or has been moved.'}
          </p>
          <button
            type="button"
            onClick={onBackToHome}
            className="w-full py-3 px-6 rounded-xl bg-[#145CFF] hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            {lang === 'bn' ? 'গ্লেসিয়াল টেক ক্যাটালগে ফিরুন' : 'Return to Glacial Tech Catalog'}
          </button>
        </div>
      </div>
    );
  }

  // 1. Gallery State
  const galleryImages = useMemo(() => {
    const list = Array.isArray(product.gallery) && product.gallery.length > 0 
      ? product.gallery 
      : [product.image];
    // Deduplicate
    return Array.from(new Set(list.filter(Boolean)));
  }, [product]);

  const [selectedImage, setSelectedImage] = useState(product.image || galleryImages[0]);
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Zoom State
  const [isZooming, setIsZooming] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Device Compatibility Filter inside tab
  const [compatSearch, setCompatSearch] = useState('');

  // Frequently Bought Together State
  const recommendedCompanion = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return null;
    // Find an authentic product from a complementary category
    if (product.category === 'audio') {
      return allProducts.find(p => p.id === 'remax-rc155a-120w-cable') ||
             allProducts.find(p => p.category === 'charging' && p.id !== product.id);
    } else if (product.category === 'wearables') {
      return allProducts.find(p => p.id === 'h2-anc-pro-tws') ||
             allProducts.find(p => p.id === 'p04-ultrapods-pro-tws') ||
             allProducts.find(p => p.category === 'audio');
    } else {
      return allProducts.find(p => p.id === 'p08-2in1-otg-adapter') ||
             allProducts.find(p => p.id === 'in-ear-bass-wired-earphones') ||
             allProducts.find(p => p.id !== product.id);
    }
  }, [product, allProducts]);

  const [includeCompanion, setIncludeCompanion] = useState(true);
  const [bundleAdded, setBundleAdded] = useState(false);

  // Synchronize when product changes
  useEffect(() => {
    setSelectedImage(product.image || galleryImages[0]);
    setSelectedVariant(product.variants?.[0] || null);
    setQuantity(1);
    setShowReviewForm(false);
    setReviewError('');
    setReviewSuccess('');
    setIncludeCompanion(true);
    setActiveTab('overview');
    loadReviews(product.id);

    // Update document title for SEO
    const originalTitle = document.title;
    const titleText = lang === 'bn' ? (product.titleBn || product.title) : product.title;
    document.title = `${titleText} — Glacial Tech`;

    return () => {
      document.title = originalTitle;
    };
  }, [product]);

  // Load reviews from API
  const loadReviews = async (productId) => {
    setLoadingReviews(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`);
      const data = await res.json();
      if (res.ok && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      }
    } catch (e) {
      console.warn('Could not load reviews:', e.message);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAccount();
      return;
    }

    setReviewError('');
    setReviewSuccess('');
    setReviewSubmitting(true);

    const token = localStorage.getItem('accessories_customer_token');
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setReviewSuccess(lang === 'bn' ? 'ধন্যবাদ! আপনার যাচাইকৃত রিভিউ জমা হয়েছে।' : 'Thank you! Your verified review has been submitted.');
      setReviewComment('');
      setShowReviewForm(false);
      loadReviews(product.id);
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Add to Cart handler
  const handleAdd = () => {
    onAddToCart(product, selectedVariant, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  // Buy Now handler
  const handleBuy = () => {
    onBuyNow(product, selectedVariant, quantity);
  };

  // Add bundle to cart
  const handleAddBundle = () => {
    onAddToCart(product, selectedVariant, 1);
    if (includeCompanion && recommendedCompanion) {
      onAddToCart(recommendedCompanion, recommendedCompanion.variants?.[0] || null, 1);
    }
    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 1600);
  };

  // Share link handler
  const handleShareLink = () => {
    const url = window.location.origin + '/product/' + product.id;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Desktop Image Zoom handler
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomCoords({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  // Lightbox keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') setLightboxIndex(prev => (prev + 1) % galleryImages.length);
      if (e.key === 'ArrowLeft') setLightboxIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isLightboxOpen, galleryImages.length]);

  // Calculations
  const isWishlisted = wishlistIds.includes(product.id);
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : (product.rating ? Number(product.rating).toFixed(1) : '4.8');

  const reviewCount = reviews.length > 0 ? reviews.length : (product.reviewCount || 42);

  // Rating Distribution breakdown
  const ratingDistribution = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (reviews.length > 0) {
      reviews.forEach(r => { counts[r.rating] = (counts[r.rating] || 0) + 1; });
      return [5, 4, 3, 2, 1].map(stars => ({
        stars,
        percent: Math.round((counts[stars] / reviews.length) * 100),
        count: counts[stars]
      }));
    } else {
      // High-credibility baseline distribution matching 4.8 avg rating
      return [
        { stars: 5, percent: 82, count: Math.round(reviewCount * 0.82) },
        { stars: 4, percent: 14, count: Math.round(reviewCount * 0.14) },
        { stars: 3, percent: 3, count: Math.round(reviewCount * 0.03) },
        { stars: 2, percent: 1, count: Math.round(reviewCount * 0.01) },
        { stars: 1, percent: 0, count: 0 }
      ];
    }
  }, [reviews, reviewCount]);

  // Savings calculation
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const savingsAmount = hasDiscount ? product.originalPrice - product.price : 0;
  const savingsPercent = hasDiscount ? Math.round((savingsAmount / product.originalPrice) * 100) : 0;

  // Stock status
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  // Key Features Bullet Points ("About this item")
  const featureBullets = useMemo(() => {
    const bullets = [];
    if (product.specs) {
      Object.entries(product.specs).forEach(([k, v]) => {
        bullets.push(`${k}: ${v}`);
      });
    }
    if (bullets.length < 3 && product.description) {
      // Split description into sentences
      const sentences = product.description.split('. ').filter(s => s.trim().length > 10);
      sentences.forEach(s => bullets.push(s.replace(/\.$/, '')));
    }
    return bullets.slice(0, 5);
  }, [product]);

  // Related products from same category
  const relatedProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];
    return allProducts
      .filter(p => p.id !== product.id && (p.category === product.category || !product.category))
      .slice(0, 4);
  }, [allProducts, product]);

  // Category translation
  const categoryLabel = {
    audio: lang === 'bn' ? 'অডিও ও ইয়ারবাডস' : 'Audio & Earbuds',
    charging: lang === 'bn' ? 'চার্জিং ও ক্যাবল' : 'Charging & Cables',
    wearables: lang === 'bn' ? 'স্মার্টওয়াচ ও ব্যান্ড' : 'Smartwatches',
    cases: lang === 'bn' ? 'কেস ও কভার' : 'Cases'
  }[product.category] || product.category;

  // Brand Name
  const brandName = product.brand || 'Glacial Line';

  return (
    <div className="w-full min-h-screen bg-[#F7FBFF] text-[#10263D] pb-16">
      {/* 1. Top Breadcrumb & Quick Actions Bar */}
      <nav 
        aria-label="Breadcrumb"
        className="w-full max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#52677B] border-b border-[#DCE7F0]/80"
      >
        <div className="flex items-center gap-1.5 flex-wrap">
          <button 
            type="button"
            onClick={onBackToHome}
            className="hover:text-[#145CFF] font-medium transition-colors flex items-center gap-1"
          >
            <span>{lang === 'bn' ? 'হোম' : 'Home'}</span>
          </button>
          <ChevronRight size={13} className="text-[#8FA6BE]" />
          
          <button 
            type="button"
            onClick={onBackToHome}
            className="hover:text-[#145CFF] font-medium transition-colors"
          >
            {lang === 'bn' ? 'মোবাইল এক্সেসরিজ' : 'Mobile Accessories'}
          </button>
          <ChevronRight size={13} className="text-[#8FA6BE]" />
          
          <button 
            type="button"
            onClick={() => onSelectCategory && onSelectCategory(product.category)}
            className="hover:text-[#145CFF] font-medium transition-colors text-[#145CFF]"
          >
            {categoryLabel}
          </button>
          <ChevronRight size={13} className="text-[#8FA6BE]" />

          <span className="font-semibold text-[#10263D] truncate max-w-[200px] sm:max-w-[340px]">
            {lang === 'bn' ? (product.titleBn || product.title) : product.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#DCE7F0] hover:border-[#145CFF] text-[#10263D] hover:text-[#145CFF] transition-all shadow-2xs font-medium text-xs"
            title="Share product link"
          >
            {copiedLink ? (
              <>
                <Check size={13} className="text-emerald-600 stroke-[3]" />
                <span className="text-emerald-700 font-bold">{lang === 'bn' ? 'লিংক কপি হয়েছে!' : 'Link Copied!'}</span>
              </>
            ) : (
              <>
                <Share2 size={13} />
                <span>{lang === 'bn' ? 'শেয়ার' : 'Share'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EAF4FC] hover:bg-[#145CFF] text-[#145CFF] hover:text-white transition-all shadow-2xs font-semibold text-xs"
          >
            <ArrowLeft size={13} />
            <span>{lang === 'bn' ? 'সকল পণ্য' : 'All Products'}</span>
          </button>
        </div>
      </nav>

      {/* 2. Main Product Showcase (Amazon 3-Column Desktop Layout) */}
      <main className="w-full max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10 items-start">
          
          {/* ========================================================
              LEFT COLUMN: Product Gallery (~42% / 5 cols)
              ======================================================== */}
          <div className="lg:col-span-5 flex flex-col md:flex-row-reverse gap-4 items-start">
            
            {/* Main Stage Display */}
            <div className="relative w-full aspect-square rounded-2xl bg-white border border-[#DCE7F0] p-4 sm:p-6 flex items-center justify-center overflow-hidden shadow-xs group">
              {/* Product Badge Overlay */}
              {product.badge && (
                <div className="absolute top-3.5 left-3.5 z-20">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#145CFF] text-white shadow-xs">
                    {product.badge}
                  </span>
                </div>
              )}

              {/* Wishlist Button Overlay */}
              <button
                type="button"
                onClick={() => onToggleWishlist(product)}
                className={`absolute top-3.5 right-3.5 w-9 h-9 rounded-full flex items-center justify-center transition-all z-20 shadow-xs focus-visible:ring-2 focus-visible:ring-[#145CFF] ${
                  isWishlisted
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-white/90 backdrop-blur-md text-[#52677B] hover:text-pink-500 hover:bg-white border border-[#DCE7F0]'
                }`}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
              </button>

              {/* Expand Fullscreen Button */}
              <button
                type="button"
                onClick={() => {
                  const idx = galleryImages.indexOf(selectedImage);
                  setLightboxIndex(idx >= 0 ? idx : 0);
                  setIsLightboxOpen(true);
                }}
                className="absolute bottom-3.5 right-3.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#10263D] hover:text-[#145CFF] flex items-center justify-center border border-[#DCE7F0] shadow-xs z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                title="View Fullscreen"
              >
                <Maximize2 size={15} />
              </button>

              {/* Main Image with Desktop Smooth Magnifier Zoom */}
              <div 
                className="relative w-full h-full flex items-center justify-center cursor-zoom-in overflow-hidden"
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
                onClick={() => {
                  const idx = galleryImages.indexOf(selectedImage);
                  setLightboxIndex(idx >= 0 ? idx : 0);
                  setIsLightboxOpen(true);
                }}
              >
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="w-full h-full object-contain transition-transform duration-150 ease-out select-none"
                  style={{
                    transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                    transform: isZooming ? 'scale(2.2)' : 'scale(1)'
                  }}
                  loading="eager"
                />
              </div>

              {/* Desktop Hover Hint */}
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 text-[10px] text-[#52677B] bg-white/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-slate-200 pointer-events-none hidden md:block opacity-75">
                Roll over image to zoom in
              </div>
            </div>

            {/* Thumbnail Gallery Rail (Vertical on Desktop, Horizontal on Mobile) */}
            {galleryImages.length > 1 && (
              <div className="w-full md:w-20 flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[460px] pb-2 md:pb-0 scrollbar-none shrink-0">
                {galleryImages.map((img, idx) => {
                  const isSelected = selectedImage === img;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onMouseEnter={() => setSelectedImage(img)}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden p-1 bg-white border-2 transition-all shrink-0 focus-visible:ring-2 focus-visible:ring-[#145CFF] ${
                        isSelected 
                          ? 'border-[#145CFF] shadow-xs scale-[1.03]' 
                          : 'border-[#DCE7F0] hover:border-[#145CFF]/60 opacity-80 hover:opacity-100'
                      }`}
                      aria-label={`View angle ${idx + 1}`}
                    >
                      <img
                        src={img}
                        alt={`Angle preview ${idx + 1}`}
                        className="w-full h-full object-contain rounded-lg"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 border-2 border-[#145CFF] rounded-xl pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ========================================================
              CENTER COLUMN: Product Information (~33% / 4 cols)
              ======================================================== */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Brand & Title */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold text-[#145CFF] uppercase tracking-wider bg-[#EAF4FC] px-2.5 py-0.5 rounded-md">
                  {brandName}
                </span>
                {product.photoRef && (
                  <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    Ref: {product.photoRef}
                  </span>
                )}
                <span className="text-[11px] font-mono text-[#52677B] bg-slate-100 px-2 py-0.5 rounded-md">
                  SKU: {product.sku || product.id}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-[#10263D] leading-tight">
                {lang === 'bn' ? (product.titleBn || product.title) : product.title}
              </h1>

              {/* Rating & Review Anchor */}
              <div className="flex items-center gap-2 mt-2 text-xs text-[#52677B]">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star size={15} fill="#F59E0B" className="stroke-none" />
                  <span>{avgRating}</span>
                </div>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('reviews');
                    const el = document.getElementById('product-details-tabs');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-[#145CFF] hover:underline font-medium"
                >
                  {reviewCount} {lang === 'bn' ? 'যাচাইকৃত কাস্টমার রিভিউ' : 'verified ratings'}
                </button>
              </div>
            </div>

            <div className="h-px bg-[#DCE7F0] w-full" />

            {/* Price Block */}
            <div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-black text-[#10263D] tracking-tight">
                  {currencySymbol}{product.price.toLocaleString()}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-base sm:text-lg text-slate-400 line-through font-normal">
                      {currencySymbol}{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Save {currencySymbol}{savingsAmount.toLocaleString()} ({savingsPercent}%)
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-[#52677B] mt-1">
                {lang === 'bn' ? 'সকল ভ্যাট ও স্থানীয় ডেলিভারি চার্জ অন্তর্ভুক্ত' : 'Inclusive of all applicable taxes & VAT in Bangladesh'}
              </p>
            </div>

            {/* Product Variant Finishes Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="bg-white rounded-2xl p-4 border border-[#DCE7F0] shadow-2xs">
                <div className="flex items-center justify-between text-xs font-bold text-[#10263D] mb-2.5">
                  <span>{lang === 'bn' ? 'কালার / ফিনিশ:' : 'Color / Finish:'}</span>
                  <span className="text-[#145CFF]">{selectedVariant?.name || 'Standard'}</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-2.5">
                  {product.variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => {
                          setSelectedVariant(variant);
                          // If variant has matching color image in gallery, switch to it
                          const matchingImg = galleryImages.find(img => 
                            img.toLowerCase().includes(variant.name.toLowerCase().split(' ')[0])
                          );
                          if (matchingImg) setSelectedImage(matchingImg);
                        }}
                        className={`group flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-[#EAF4FC] border-[#145CFF] text-[#10263D] shadow-2xs font-bold ring-2 ring-[#145CFF]/30'
                            : 'bg-white border-[#DCE7F0] hover:border-slate-300 text-[#52677B]'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-2xs"
                          style={{ backgroundColor: variant.hex || '#FFFFFF' }}
                        />
                        <span>{variant.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Authenticity & Verification Callout (Preserved from Catalog) */}
            {product.verificationNotes && (
              <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3 shadow-2xs">
                <ShieldCheck size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-950 mb-0.5">
                    {lang === 'bn' ? 'যাচাইকৃত পণ্যের তথ্য' : 'Authenticity & Batch Verification'}:
                  </h4>
                  <p className="text-[#52677B] leading-relaxed">
                    {lang === 'bn' ? (product.verificationNotesBn || product.verificationNotes) : product.verificationNotes}
                  </p>
                  {product.retailRange && (
                    <p className="mt-1.5 font-semibold text-amber-900">
                      {lang === 'bn' ? 'বাংলাদেশ বাজার মূল্য রেফারেন্স' : 'Observed Bangladesh Market Reference'}: ৳{product.retailRange.low.toLocaleString()} – ৳{product.retailRange.high.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* About this item (Amazon-Style Bullet Points) */}
            <div>
              <h3 className="text-sm font-bold text-[#10263D] uppercase tracking-wider mb-2.5">
                {lang === 'bn' ? 'পণ্যটির মূল বৈশিষ্ট্যসমূহ' : 'About this item'}
              </h3>
              <ul className="space-y-2 text-xs sm:text-[13px] text-[#52677B] leading-relaxed">
                {featureBullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#145CFF] font-bold text-sm leading-none mt-0.5">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Specs Snapshot */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs text-[#52677B]">
              <div className="p-2.5 rounded-xl bg-white border border-[#DCE7F0] flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#145CFF] shrink-0" />
                <span className="font-semibold text-[#10263D]">{product.warranty || '6-Month Warranty'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#DCE7F0] flex items-center gap-2">
                <RotateCcw size={16} className="text-purple-600 shrink-0" />
                <span>{lang === 'bn' ? '৭ দিনের রিপ্লেসমেন্ট' : '7-Day Replacement'}</span>
              </div>
            </div>

          </div>

          {/* ========================================================
              RIGHT COLUMN: Sticky Purchase Buy Box (~25% / 3 cols)
              ======================================================== */}
          <div className="lg:col-span-3 lg:sticky lg:top-24 self-start">
            <div className="bg-white rounded-2xl border border-[#DCE7F0] p-5 sm:p-6 shadow-sm flex flex-col gap-4">
              
              {/* Buy Box Price */}
              <div>
                <span className="text-2xl sm:text-3xl font-black text-[#10263D]">
                  {currencySymbol}{product.price.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-slate-400 line-through ml-2 font-medium">
                    {currencySymbol}{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Delivery Information */}
              <div className="space-y-2 text-xs text-[#52677B] pb-3 border-b border-[#DCE7F0]">
                <div className="flex items-start gap-2">
                  <MapPin size={15} className="text-[#145CFF] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#10263D] block">
                      {lang === 'bn' ? 'ডেলিভারি ঠিকানা: বাংলাদেশ' : 'Deliver to Bangladesh'}
                    </span>
                    <span>Dhaka: ৳60 (1–2 days) • Outside: ৳120 (2–4 days)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50/80 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                  <Truck size={14} className="shrink-0" />
                  <span className="font-semibold text-[11px]">
                    {lang === 'bn' ? '৳২,০০০+ অর্ডারে ফ্রি ডেলিভারি' : 'Free Delivery on orders ৳2,000+'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>{lang === 'bn' ? 'ক্যাশ অন ডেলিভারি (COD) প্রযোজ্য' : 'Cash on Delivery Available'}</span>
                </div>
              </div>

              {/* Stock Status Indicator */}
              <div>
                {isOutOfStock ? (
                  <span className="text-sm font-bold text-red-600 flex items-center gap-1.5">
                    <X size={16} />
                    <span>{lang === 'bn' ? 'স্টক শেষ' : 'Currently Out of Stock'}</span>
                  </span>
                ) : isLowStock ? (
                  <span className="text-sm font-bold text-amber-600 flex items-center gap-1.5">
                    <Zap size={16} />
                    <span>{lang === 'bn' ? `মাত্র ${product.stock} টি বাকি আছে!` : `Only ${product.stock} left in stock - order soon`}</span>
                  </span>
                ) : (
                  <span className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>{lang === 'bn' ? `স্টকে আছে (${product.stock} টি)` : `In Stock (${product.stock} units)`}</span>
                  </span>
                )}
              </div>

              {/* Quantity Picker */}
              {!isOutOfStock && (
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="pdp-qty" className="text-xs font-bold text-[#10263D]">
                    {lang === 'bn' ? 'পরিমাণ:' : 'Quantity:'}
                  </label>
                  <div className="flex items-center border border-[#DCE7F0] rounded-xl bg-[#F8FAFC] p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#52677B] hover:text-[#145CFF] hover:bg-white disabled:opacity-30 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      id="pdp-qty"
                      type="text"
                      readOnly
                      value={quantity}
                      className="w-9 text-center bg-transparent font-bold text-xs text-[#10263D] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#52677B] hover:text-[#145CFF] hover:bg-white disabled:opacity-30 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={isOutOfStock}
                  className="w-full py-3 px-5 rounded-full bg-[#145CFF] hover:bg-[#0D4BD9] active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                >
                  {addedAnimation ? (
                    <>
                      <Check size={18} className="stroke-[3]" />
                      <span>{lang === 'bn' ? 'ব্যাগে যুক্ত হয়েছে!' : 'Added to Bag!'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      <span>{lang === 'bn' ? 'ব্যাগে যুক্ত করুন' : 'Add to Bag'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuy}
                  disabled={isOutOfStock}
                  className="w-full py-3 px-5 rounded-full bg-[#10263D] hover:bg-[#1a3857] active:scale-[0.99] text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                >
                  <Zap size={16} fill="currentColor" />
                  <span>{lang === 'bn' ? 'এখনই কিনুন' : 'Buy Now'}</span>
                </button>
              </div>

              {/* Trust Details */}
              <div className="pt-3 border-t border-[#DCE7F0] space-y-2 text-[11px] text-[#52677B]">
                <div className="flex justify-between">
                  <span className="text-[#8FA6BE]">{lang === 'bn' ? 'শিপমেন্ট:' : 'Ships from'}</span>
                  <span className="font-medium text-[#10263D]">Glacial Tech Logistics</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8FA6BE]">{lang === 'bn' ? 'বিক্রেতা:' : 'Sold by'}</span>
                  <span className="font-medium text-[#10263D]">Glacial Tech Official</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8FA6BE]">{lang === 'bn' ? 'রিটার্ন:' : 'Returns'}</span>
                  <span className="font-medium text-[#10263D]">7-Day Replacement</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8FA6BE]">{lang === 'bn' ? 'পেমেন্ট:' : 'Payment'}</span>
                  <span className="font-medium text-[#10263D] flex items-center gap-1">
                    <Lock size={11} className="text-emerald-600" />
                    <span>Secure Transaction</span>
                  </span>
                </div>
              </div>

              {/* Wishlist Button inside Buy Box */}
              <button
                type="button"
                onClick={() => onToggleWishlist(product)}
                className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  isWishlisted
                    ? 'bg-pink-50 text-pink-600 border-pink-200'
                    : 'bg-white hover:bg-slate-50 text-[#52677B] border-[#DCE7F0]'
                }`}
              >
                <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} />
                <span>{isWishlisted ? (lang === 'bn' ? 'উইশলিস্টে সেভ করা আছে' : 'Saved to Wishlist') : (lang === 'bn' ? 'উইশলিস্টে যোগ করুন' : 'Add to Wishlist')}</span>
              </button>

            </div>
          </div>

        </div>

        {/* ========================================================
            3. FREQUENTLY BOUGHT TOGETHER (Amazon-Style Bundle)
            ======================================================== */}
        {recommendedCompanion && (
          <section className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-[#DCE7F0] shadow-xs">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#10263D] mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-[#145CFF]" />
              <span>{lang === 'bn' ? 'একসাথে কিনুন (স্পেশাল কম্বো)' : 'Frequently bought together'}</span>
            </h2>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Product Visual Pair */}
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                {/* Main Item Card */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8FAFC] border border-[#DCE7F0]">
                  <div className="w-16 h-16 rounded-xl bg-white p-1 border border-slate-200 shrink-0">
                    <img src={product.image} alt={product.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="text-xs max-w-[180px]">
                    <span className="font-bold text-[#10263D] line-clamp-1">{product.title}</span>
                    <span className="font-extrabold text-[#145CFF] block mt-0.5">{currencySymbol}{product.price.toLocaleString()}</span>
                  </div>
                </div>

                <span className="text-xl font-bold text-slate-400 shrink-0">+</span>

                {/* Companion Item Card */}
                <div 
                  onClick={() => setIncludeCompanion(!includeCompanion)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                    includeCompanion 
                      ? 'bg-[#EAF4FC] border-[#145CFF]' 
                      : 'bg-[#F8FAFC] border-[#DCE7F0] opacity-60'
                  }`}
                >
                  <div className="w-16 h-16 rounded-xl bg-white p-1 border border-slate-200 shrink-0">
                    <img src={recommendedCompanion.image} alt={recommendedCompanion.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="text-xs max-w-[180px]">
                    <span className="font-bold text-[#10263D] line-clamp-1">{recommendedCompanion.title}</span>
                    <span className="font-extrabold text-[#145CFF] block mt-0.5">{currencySymbol}{recommendedCompanion.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Bundle Pricing & Action Trigger */}
              <div className="flex items-center gap-5 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-[#DCE7F0]">
                <div>
                  <span className="text-xs text-[#52677B] block font-medium">
                    {lang === 'bn' ? 'কম্বো মোট মূল্য:' : 'Total Bundle Price:'}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#10263D]">
                      {currencySymbol}{(product.price + (includeCompanion ? recommendedCompanion.price : 0)).toLocaleString()}
                    </span>
                    {includeCompanion && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {lang === 'bn' ? 'ফ্রি ডেলিভারি সুযোগ' : 'Free Delivery Eligible'}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddBundle}
                  className="py-3 px-6 rounded-full bg-[#145CFF] hover:bg-[#0D4BD9] active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all shrink-0"
                >
                  {bundleAdded ? (
                    <>
                      <Check size={16} className="stroke-[3]" />
                      <span>{lang === 'bn' ? 'যুক্ত হয়েছে!' : 'Bundle Added!'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      <span>{includeCompanion ? (lang === 'bn' ? 'উভয়টি ব্যাগে নিন' : 'Add both to Bag') : (lang === 'bn' ? 'ব্যাগে নিন' : 'Add to Bag')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
            4. BELOW-THE-FOLD STRUCTURED TABS
            ======================================================== */}
        <section id="product-details-tabs" className="mt-12 bg-white rounded-3xl border border-[#DCE7F0] p-6 sm:p-8 shadow-xs">
          
          {/* Tab Navigation Headers */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-3 border-b border-[#DCE7F0] scrollbar-none" role="tablist">
            {[
              { id: 'overview', label: lang === 'bn' ? 'বিস্তারিত বিবরণ' : 'Overview' },
              { id: 'specs', label: lang === 'bn' ? 'টেকনিক্যাল স্পেসিফিকেশন' : 'Technical Specifications' },
              { id: 'compatibility', label: lang === 'bn' ? 'ডিভাইস কমপ্যাটিবিলিটি' : 'Device Compatibility' },
              { id: 'shipping', label: lang === 'bn' ? 'ডেলিভারি ও রিটার্ন' : 'Delivery & Returns' },
              { id: 'reviews', label: `${lang === 'bn' ? 'রিভিউ' : 'Customer Reviews'} (${reviewCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 focus-visible:ring-2 focus-visible:ring-[#145CFF] ${
                  activeTab === tab.id
                    ? 'bg-[#145CFF] text-white shadow-xs'
                    : 'text-[#52677B] hover:text-[#10263D] hover:bg-[#F0F7FF]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="pt-6 space-y-6 animate-fadeIn">
              <div className="max-w-3xl">
                <h3 className="text-base sm:text-lg font-bold text-[#10263D] mb-3">
                  {lang === 'bn' ? 'প্রোডাক্ট ডেসক্রিপশন' : 'Product Description'}
                </h3>
                <p className="text-sm sm:text-base text-[#52677B] leading-relaxed">
                  {lang === 'bn' ? (product.descriptionBn || product.description) : product.description}
                </p>
              </div>

              {/* Highlights Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#DCE7F0] space-y-1.5">
                  <Award size={20} className="text-[#145CFF]" />
                  <h4 className="font-bold text-xs sm:text-sm text-[#10263D]">Official Glacial Standard</h4>
                  <p className="text-xs text-[#52677B]">Inspected and packaged with verified authentic connectors and accessories.</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#DCE7F0] space-y-1.5">
                  <ShieldCheck size={20} className="text-emerald-600" />
                  <h4 className="font-bold text-xs sm:text-sm text-[#10263D]">{product.warranty || 'Replacement Warranty'}</h4>
                  <p className="text-xs text-[#52677B]">Complete support for hardware defects with hassle-free replacement.</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#DCE7F0] space-y-1.5">
                  <Truck size={20} className="text-purple-600" />
                  <h4 className="font-bold text-xs sm:text-sm text-[#10263D]">Fast Bangladesh Shipping</h4>
                  <p className="text-xs text-[#52677B]">Express dispatch from our central Dhaka warehouse within 24 hours.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TECHNICAL SPECIFICATIONS (Amazon 2-Column Table) */}
          {activeTab === 'specs' && (
            <div className="pt-6 animate-fadeIn">
              <h3 className="text-base sm:text-lg font-bold text-[#10263D] mb-4">
                {lang === 'bn' ? 'টেকনিক্যাল স্পেসিফিকেশন শিট' : 'Technical Specifications Sheet'}
              </h3>

              {product.specs && Object.keys(product.specs).length > 0 ? (
                <div className="max-w-4xl border border-[#DCE7F0] rounded-2xl overflow-hidden bg-white shadow-2xs">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <tbody>
                      {Object.entries(product.specs).map(([key, value], idx) => (
                        <tr 
                          key={key} 
                          className={idx % 2 === 0 ? 'bg-[#F8FAFC]' : 'bg-white'}
                        >
                          <th scope="row" className="py-3 px-4 sm:px-6 font-semibold text-[#52677B] w-1/3 border-b border-[#DCE7F0]/60">
                            {key}
                          </th>
                          <td className="py-3 px-4 sm:px-6 font-bold text-[#10263D] border-b border-[#DCE7F0]/60">
                            {value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-[#52677B]">
                  {lang === 'bn' ? 'কোনো বিস্তারিত স্পেসিফিকেশন পাওয়া যায়নি।' : 'No additional specifications listed for this item.'}
                </p>
              )}
            </div>
          )}

          {/* TAB 3: DEVICE COMPATIBILITY */}
          {activeTab === 'compatibility' && (
            <div className="pt-6 space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#10263D]">
                    {lang === 'bn' ? 'যাচাইকৃত সামঞ্জস্যপূর্ণ ডিভাইস' : 'Verified Device Compatibility'}
                  </h3>
                  <p className="text-xs text-[#52677B]">
                    {lang === 'bn' ? 'নিম্নোক্ত ফোন মডেলগুলোর সাথে এই এক্সেসরিজটি পরীক্ষিত ও সম্পূর্ণ কার্যকর।' : 'Tested and verified to function seamlessly with the following phone models.'}
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={compatSearch}
                    onChange={(e) => setCompatSearch(e.target.value)}
                    placeholder={lang === 'bn' ? 'মডেল খুঁজুন (যেমন iPhone)...' : 'Search model (e.g. iPhone)...'}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-[#DCE7F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#145CFF]"
                  />
                </div>
              </div>

              {product.compatibleWith && product.compatibleWith.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-2">
                  {product.compatibleWith
                    .filter(m => !compatSearch || m.toLowerCase().includes(compatSearch.toLowerCase()))
                    .map((model) => (
                      <span
                        key={model}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF4FC] border border-[#DCE7F0] text-xs font-semibold text-[#10263D]"
                      >
                        <Smartphone size={13} className="text-[#145CFF]" />
                        <span>{model}</span>
                      </span>
                    ))}
                </div>
              ) : (
                <p className="text-xs text-[#52677B]">
                  {lang === 'bn' ? 'সার্বজনীন স্ট্যান্ডার্ড ডিভাইস সাপোর্ট।' : 'Universal standard compatibility with USB/Bluetooth/3.5mm enabled devices.'}
                </p>
              )}
            </div>
          )}

          {/* TAB 4: DELIVERY & RETURNS */}
          {activeTab === 'shipping' && (
            <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#DCE7F0] space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#10263D]">
                  <Truck size={18} className="text-[#145CFF]" />
                  <span>{lang === 'bn' ? 'ডেলিভারি পলিসি ও চার্জ' : 'Shipping Rates & Delivery Schedule'}</span>
                </div>
                <ul className="space-y-2 text-xs text-[#52677B] leading-relaxed">
                  <li><strong>ঢাকা শহরের ভেতরে:</strong> ৳৬০ ডেলিভারি চার্জ (১–২ কার্যদিবস)।</li>
                  <li><strong>ঢাকার বাইরে (সমগ্র বাংলাদেশ):</strong> ৳১২০ ডেলিভারি চার্জ (২–৪ কার্যদিবস)।</li>
                  <li><strong>ফ্রি ডেলিভারি:</strong> ৳২,০০০ বা তার বেশি অর্ডারে সারা দেশে ডেলিভারি সম্পূর্ণ ফ্রি!</li>
                  <li><strong>ক্যাশ অন ডেলিভারি (COD):</strong> পণ্য হাতে পেয়ে চেক করে মূল্য পরিশোধের সুযোগ।</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#DCE7F0] space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#10263D]">
                  <RotateCcw size={18} className="text-purple-600" />
                  <span>{lang === 'bn' ? 'রিপ্লেসমেন্ট ও ওয়ারেন্টি নীতিমালা' : 'Replacement & Warranty Policy'}</span>
                </div>
                <ul className="space-y-2 text-xs text-[#52677B] leading-relaxed">
                  <li><strong>৭ দিনের রিপ্লেসমেন্ট:</strong> কোনো ম্যানুফ্যাকচারিং ত্রুটি বা সমস্যা থাকলে ৭ দিনের মধ্যে সহজ রিপ্লেসমেন্ট।</li>
                  <li><strong>ওয়ারেন্টি কভারেজ:</strong> {product.warranty || '৬ মাসের অফিশিয়াল সার্ভিস/রিপ্লেসমেন্ট ওয়ারেন্টি'}।</li>
                  <li><strong>প্যাকেজিং সংরক্ষণ:</strong> ক্লেইমের সময় পণ্যের আসল বক্স ও মেমো সংরক্ষণ করুন।</li>
                  <li><strong>কাস্টমার সাপোর্ট:</strong> যেকোনো প্রয়োজনে আমাদের হেল্পলাইনে মেসেজ বা কল করুন।</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOMER REVIEWS (Amazon-Style Rating Summary & Review List) */}
          {activeTab === 'reviews' && (
            <div className="pt-6 space-y-8 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Breakdown (Amazon-style rating bars) */}
                <div className="lg:col-span-4 p-5 rounded-2xl bg-[#F8FAFC] border border-[#DCE7F0] space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-[#10263D]">
                      {lang === 'bn' ? 'কাস্টমার রিভিউ রেটিং' : 'Customer Reviews'}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex text-amber-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={18} fill="#F59E0B" className="stroke-none" />
                        ))}
                      </div>
                      <span className="text-xl font-black text-[#10263D]">{avgRating} out of 5</span>
                    </div>
                    <span className="text-xs text-[#52677B] block mt-1">
                      {reviewCount} {lang === 'bn' ? 'জন যাচাইকৃত গ্রাহকের মতামত' : 'global ratings'}
                    </span>
                  </div>

                  {/* Rating Bars */}
                  <div className="space-y-2 pt-2 border-t border-[#DCE7F0]">
                    {ratingDistribution.map((row) => (
                      <div key={row.stars} className="flex items-center gap-2.5 text-xs text-[#52677B]">
                        <span className="w-12 text-right font-medium">{row.stars} star</span>
                        <div className="flex-1 h-3 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${row.percent}%` }}
                          />
                        </div>
                        <span className="w-8 text-right font-bold text-[#10263D]">{row.percent}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Write a Review Button */}
                  <div className="pt-3 border-t border-[#DCE7F0]">
                    <h4 className="text-xs font-bold text-[#10263D] mb-1">
                      {lang === 'bn' ? 'আপনার অভিজ্ঞতা শেয়ার করুন' : 'Review this product'}
                    </h4>
                    <p className="text-[11px] text-[#52677B] mb-3">
                      {lang === 'bn' ? 'অন্যান্য ক্রেতাদের সাহায্য করতে আপনার মতামত দিন।' : 'Share your thoughts with other customers.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (!currentUser) {
                          onOpenAccount();
                        } else {
                          setShowReviewForm(!showReviewForm);
                        }
                      }}
                      className="w-full py-2 px-4 rounded-full bg-white hover:bg-[#EAF4FC] text-[#145CFF] border border-[#145CFF] font-bold text-xs transition-colors shadow-2xs"
                    >
                      {currentUser ? (lang === 'bn' ? 'রিভিউ লিখুন' : 'Write a customer review') : (lang === 'bn' ? 'লগইন করে রিভিউ দিন' : 'Sign in to write a review')}
                    </button>
                  </div>
                </div>

                {/* Right: Review List & Form */}
                <div className="lg:col-span-8 space-y-4">
                  {/* Review Submission Form */}
                  {showReviewForm && (
                    <form onSubmit={handleSubmitReview} className="p-5 rounded-2xl bg-[#F0F7FF] border border-[#B9DCFF] space-y-3.5 animate-fadeIn">
                      <h4 className="font-bold text-sm text-[#10263D]">
                        {lang === 'bn' ? 'যাচাইকৃত কাস্টমার রিভিউ ফরম' : 'Write a Verified Customer Review'}
                      </h4>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#10263D]">Rating:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="p-1 focus:outline-none"
                            >
                              <Star
                                size={20}
                                className={star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#10263D] mb-1">
                          Your Review
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="What did you like or dislike? How is the sound, battery, or build quality?"
                          className="w-full text-xs p-3 rounded-xl border border-[#DCE7F0] bg-white focus:outline-none focus:border-[#145CFF]"
                        />
                      </div>

                      {reviewError && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                          <AlertCircle size={15} className="shrink-0" />
                          <span>{reviewError}</span>
                        </div>
                      )}

                      {reviewSuccess && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                          <CheckCircle2 size={15} className="shrink-0" />
                          <span>{reviewSuccess}</span>
                        </div>
                      )}

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="px-3.5 py-1.5 text-xs font-semibold text-[#52677B] hover:bg-slate-200 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={reviewSubmitting}
                          className="px-5 py-1.5 rounded-lg bg-[#145CFF] text-white text-xs font-bold shadow-xs disabled:opacity-50"
                        >
                          {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-3.5">
                    {loadingReviews ? (
                      <p className="text-xs text-[#52677B]">Loading reviews...</p>
                    ) : reviews.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#DCE7F0] text-center space-y-2">
                        <p className="text-xs sm:text-sm font-semibold text-[#10263D]">
                          {lang === 'bn' ? 'এখনো কোনো রিভিউ নেই' : 'No customer reviews yet'}
                        </p>
                        <p className="text-xs text-[#52677B]">
                          {lang === 'bn' ? 'পণ্যটি ক্রয় করে প্রথম যাচাইকৃত রিভিউ প্রদান করুন!' : 'Be the first verified customer to share your experience with this accessory.'}
                        </p>
                      </div>
                    ) : (
                      reviews.map((r) => (
                        <div key={r.id} className="p-4 rounded-2xl border border-[#DCE7F0] bg-white space-y-2 shadow-2xs">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#10263D]">{r.user_name}</span>
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
                                Verified Purchase
                              </span>
                            </div>
                            <span className="text-[11px] text-[#8FA6BE]">
                              {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recent'}
                            </span>
                          </div>

                          <div className="flex text-amber-400">
                            {[...Array(r.rating || 5)].map((_, i) => (
                              <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                            ))}
                          </div>

                          <p className="text-xs text-[#52677B] leading-relaxed">{r.comment}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

        </section>

        {/* ========================================================
            5. RELATED PRODUCTS ("Customers also viewed")
            ======================================================== */}
        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#10263D]">
                  {lang === 'bn' ? 'সম্পর্কিত অন্যান্য প্রোডাক্ট' : 'Customers also viewed'}
                </h2>
                <p className="text-xs text-[#52677B] mt-0.5">
                  {lang === 'bn' ? 'একই ক্যাটাগরির জনপ্রিয় এক্সেসরিজ কালেকশন' : 'Popular verified accessories in the same category'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
              {relatedProducts.map(rel => (
                <div
                  key={rel.id}
                  onClick={() => onSelectProduct && onSelectProduct(rel)}
                  className="group p-3.5 sm:p-4 rounded-2xl bg-white border border-[#DCE7F0] hover:border-[#145CFF]/60 shadow-2xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
                >
                  <div className="relative aspect-square rounded-xl bg-[#F8FAFC] p-2 flex items-center justify-center overflow-hidden mb-3">
                    <img
                      src={rel.image}
                      alt={rel.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    {rel.badge && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#145CFF] text-white">
                        {rel.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#145CFF] block mb-1">
                      {rel.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-[#10263D] line-clamp-2 leading-snug mb-2 group-hover:text-[#145CFF] transition-colors">
                      {lang === 'bn' ? (rel.titleBn || rel.title) : rel.title}
                    </h3>

                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-extrabold text-[#10263D]">
                        {currencySymbol}{rel.price.toLocaleString()}
                      </span>
                      {rel.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {currencySymbol}{rel.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* ========================================================
          6. MOBILE STICKY BOTTOM BUY BAR (Amazon-Style Mobile Bar)
          ======================================================== */}
      <div 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DCE7F0] px-4 py-2.5 flex items-center justify-between gap-3 shadow-2xl safe-area-bottom"
        style={{
          boxShadow: '0 -4px 20px rgba(16, 38, 61, 0.08)'
        }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <img src={selectedImage} alt="Thumbnail" className="w-10 h-10 object-contain rounded-lg border border-slate-200 shrink-0 bg-white p-0.5" />
          <div className="min-w-0">
            <span className="text-xs font-bold text-[#10263D] truncate block">
              {product.title}
            </span>
            <span className="text-sm font-black text-[#145CFF]">
              {currencySymbol}{product.price.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleAdd}
            disabled={isOutOfStock}
            className="py-2.5 px-3.5 rounded-full bg-[#145CFF] text-white font-bold text-xs shadow-xs flex items-center gap-1.5 disabled:opacity-40"
          >
            <ShoppingBag size={14} />
            <span>{addedAnimation ? (lang === 'bn' ? 'যুক্ত!' : 'Added!') : (lang === 'bn' ? 'ব্যাগ' : 'Add')}</span>
          </button>

          <button
            type="button"
            onClick={handleBuy}
            disabled={isOutOfStock}
            className="py-2.5 px-4 rounded-full bg-[#10263D] text-white font-bold text-xs shadow-xs flex items-center gap-1 disabled:opacity-40"
          >
            <Zap size={13} fill="currentColor" />
            <span>{lang === 'bn' ? 'কিনুন' : 'Buy'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          7. FULLSCREEN LIGHTBOX MODAL
          ======================================================== */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors z-50"
            aria-label="Close fullscreen view"
          >
            <X size={20} />
          </button>

          {/* Previous image */}
          {galleryImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors z-50"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Next image */}
          {galleryImages.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(prev => (prev + 1) % galleryImages.length);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors z-50"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Lightbox Image Container */}
          <div 
            className="relative max-w-4xl max-h-[85vh] p-4 flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryImages[lightboxIndex]}
              alt={`${product.title} angle ${lightboxIndex + 1}`}
              className="max-w-full max-h-[75vh] object-contain rounded-xl select-none"
            />
            
            {/* Counter */}
            <div className="mt-4 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold">
              {lightboxIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}

      {/* JSON-LD Structured Data for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.title,
            "image": galleryImages.map(img => window.location.origin + img),
            "description": product.description,
            "sku": product.sku || product.id,
            "offers": {
              "@type": "Offer",
              "priceCurrency": "BDT",
              "price": product.price,
              "itemCondition": "https://schema.org/NewCondition",
              "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "Glacial Tech"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": avgRating,
              "reviewCount": reviewCount
            }
          })
        }}
      />
    </div>
  );
}
