import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Check, 
  CheckCircle2, 
  Layers, 
  Star, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { safeFetchJson } from '../utils/api';
import { trackProductView } from '../utils/analytics';

export default function ProductDetailModal({ 
  product, 
  onClose, 
  onAddToCart, 
  onBuyNow, 
  currentUser,
  onOpenAccount,
  currencySymbol = "৳",
  t,
  lang 
}) {
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null);
  const [selectedImage, setSelectedImage] = useState(product?.image);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  
  // Real Reviews State
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const closeButtonRef = useRef(null);

  // Synchronize when product changes
  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants?.[0] || null);
      setSelectedImage(product.image);
      setQuantity(1);
      setShowReviewForm(false);
      setReviewError('');
      setReviewSuccess('');
      loadReviews(product.id);
      trackProductView(product);
    }
  }, [product]);

  const loadReviews = async (productId) => {
    setLoadingReviews(true);
    try {
      const res = await safeFetchJson(`/api/products/${productId}/reviews`);
      if (res.ok && res.data?.reviews) {
        setReviews(res.data.reviews);
      }
    } catch (e) {
      console.warn('Failed to load reviews', e);
    } finally {
      setLoadingReviews(false);
    }
  };

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
      const res = await safeFetchJson(`/api/products/${product.id}/reviews`, {
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

      if (!res.ok) {
        throw new Error(res.error || 'Review submission failed');
      }

      setReviewSuccess('Thank you! Your verified review has been submitted.');
      setReviewComment('');
      setShowReviewForm(false);
      loadReviews(product.id);
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Escape-to-close listener
  useEffect(() => {
    if (!product) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const timer = setTimeout(() => {
      if (closeButtonRef.current) closeButtonRef.current.focus();
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [product, onClose]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedVariant, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  const handleBuy = () => {
    onBuyNow(product, selectedVariant, quantity);
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : (product.rating || '0.0');

  const reviewCount = reviews.length > 0 ? reviews.length : (product.reviewCount || 0);

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-5 sm:p-8 bg-[#FFFFFF] border border-[#DCEAF1] shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 60px -15px rgba(16, 38, 61, 0.20)'
        }}
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-[#102A43] flex items-center justify-center transition-colors z-20 focus-visible:ring-2 focus-visible:ring-[#168FC2]"
          aria-label="Close product details"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column: Image Gallery & Highlights */}
          <div className="flex flex-col gap-4">
            <div className="relative w-full aspect-square rounded-2xl bg-[#DDF4FC] p-6 flex items-center justify-center border border-[#DCEAF1]">
              <img
                src={selectedImage || product.image}
                alt={product.title}
                className="w-full h-full object-contain transition-all duration-300"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-[#168FC2] text-white shadow-xs">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {product.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white shrink-0 focus-visible:ring-2 focus-visible:ring-[#168FC2] ${
                      selectedImage === img ? 'border-[#168FC2] scale-105 shadow-xs' : 'border-[#DCEAF1] hover:border-[#168FC2]'
                    }`}
                    aria-label={`View angle ${i + 1}`}
                  >
                    <img src={img} alt="Thumbnail preview" className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            )}

            {/* Authentic Specs Sheet Strip */}
            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-[#DCEAF1] text-xs text-[#62788A]">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#DDF4FC] border border-[#DCEAF1]">
                <Truck size={16} className="text-[#168FC2] shrink-0" />
                <span>Courier ৳60 (Dhaka) / ৳120</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#DDF4FC] border border-[#DCEAF1]">
                <Layers size={16} className="text-[#168FC2] shrink-0" />
                <span>Stock: {product.stock} units</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#DDF4FC] border border-[#DCEAF1]">
                <ShieldCheck size={16} className="text-[#168FC2] shrink-0" />
                <span className="font-medium text-[#102A43]">{product.warranty || '6-Month Warranty'}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#DDF4FC] border border-[#DCEAF1]">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span className="font-medium text-[#102A43]">Original Glacial Line</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#168FC2] bg-[#DDF4FC] px-2.5 py-0.5 rounded-md">
                  {product.category}
                </span>
                {product.photoRef && (
                  <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    Ref: {product.photoRef}
                  </span>
                )}
                <span className="text-[11px] font-medium text-[#62788A] bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                  SKU: {product.sku || product.id}
                </span>
              </div>

              {/* Title */}
              <h2 id="product-detail-title" className="text-lg sm:text-2xl font-bold text-[#102A43] leading-snug mb-1.5">
                {lang === 'bn' ? (product.titleBn || product.title) : product.title}
              </h2>

              {/* Verified Rating Metric */}
              <div className="flex items-center gap-2 mb-3 text-xs text-[#62788A]">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star size={14} fill="#F59E0B" className="stroke-none" />
                  <span>{avgRating}</span>
                </div>
                <span>•</span>
                <span>{reviewCount} verified {reviewCount === 1 ? 'review' : 'reviews'}</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#102A43]">
                  {currencySymbol}{(product.price || 0).toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm sm:text-base text-slate-400 line-through">
                    {currencySymbol}{(product.originalPrice || 0).toLocaleString()}
                  </span>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Save {currencySymbol}{((product.originalPrice || 0) - (product.price || 0)).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#62788A] leading-relaxed mb-4">
                {lang === 'bn' ? (product.descriptionBn || product.description) : product.description}
              </p>

              {/* Authenticity & Verification Callout */}
              {product.verificationNotes && (
                <div className="mb-5 bg-amber-50/90 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-amber-950 mb-0.5">
                      {lang === 'bn' ? 'পণ্যের পরিচয় ও যাচাইকরণ নোট' : 'Authenticity & Batch Verification'}:
                    </span>
                    <span className="leading-relaxed block">
                      {lang === 'bn' ? (product.verificationNotesBn || product.verificationNotes) : product.verificationNotes}
                    </span>
                    {product.retailRange && (
                      <span className="block mt-1 font-semibold text-amber-800">
                        {lang === 'bn' ? 'বাংলাদেশ বাজার মূল্য রেফারেন্স' : 'Observed Bangladesh Retail Reference'}: ৳{product.retailRange.low.toLocaleString()} – ৳{product.retailRange.high.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#102A43] mb-2">
                    Finish: <span className="text-[#168FC2] font-semibold">{selectedVariant?.name}</span>
                  </label>
                  <div className="flex items-center gap-2.5">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`group relative p-1 rounded-full border-2 transition-all focus-visible:ring-2 focus-visible:ring-[#168FC2] ${
                          selectedVariant?.id === v.id ? 'border-[#168FC2] scale-110 shadow-sm' : 'border-[#DCEAF1] hover:border-[#168FC2]'
                        }`}
                        title={v.name}
                        aria-label={`Select ${v.name} finish`}
                      >
                        <span
                          className="block w-6 h-6 rounded-full shadow-inner"
                          style={{ backgroundColor: v.hex }}
                          aria-hidden="true"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Verified Device Compatibility */}
              {product.compatibleWith && product.compatibleWith.length > 0 && (
                <div className="mb-5 bg-[#DDF4FC] border border-[#DCEAF1] rounded-2xl p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#102A43] mb-2">
                    Verified Device Compatibility
                  </h3>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {product.compatibleWith.map((model) => (
                      <span 
                        key={model}
                        className="text-[11px] font-medium bg-white text-[#102A43] px-2.5 py-1 rounded-md border border-[#DCEAF1] shadow-2xs"
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Specifications Sheet */}
              {product.specs && Object.keys(product.specs).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#102A43] mb-2.5">
                    Technical Specifications
                  </h3>
                  <div className="divide-y divide-slate-100 border border-[#DCEAF1] rounded-xl overflow-hidden bg-white text-xs">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between py-2 px-3 hover:bg-slate-50">
                        <span className="text-[#62788A] font-medium">{key}</span>
                        <span className="text-[#102A43] font-semibold text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions: Quantity + Add to Cart + Buy Now */}
            <div className="pt-4 border-t border-[#DCEAF1] flex flex-col sm:flex-row items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between border border-[#DCEAF1] rounded-xl bg-white px-2 py-1 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-[#62788A] hover:text-[#168FC2] rounded-lg hover:bg-[#DDF4FC]"
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <span className="w-10 text-center font-bold text-sm text-[#102A43]" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="p-1.5 text-[#62788A] hover:text-[#168FC2] rounded-lg hover:bg-[#DDF4FC]"
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                type="button"
                onClick={handleAdd}
                disabled={!product.stock || product.stock === 0}
                className="w-full sm:flex-1 py-3 px-5 rounded-full bg-[#168FC2] hover:bg-[#0F7CA6] active:scale-[0.99] text-white font-semibold text-sm shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {addedAnimation ? (
                  <>
                    <Check size={18} className="stroke-[3]" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              {/* Buy Now Button */}
              <button
                type="button"
                onClick={handleBuy}
                disabled={!product.stock || product.stock === 0}
                className="w-full sm:w-auto py-3 px-6 rounded-full bg-[#102A43] hover:bg-[#1a3857] active:scale-[0.99] text-white font-semibold text-sm shadow-xs transition-all disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Real Customer Reviews Section */}
        <div className="mt-8 pt-6 border-t border-[#DCEAF1]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-[#102A43]">Verified Customer Reviews</h3>
              <p className="text-xs text-[#62788A]">
                Only customers with delivered purchases can write verified reviews.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!currentUser) {
                  onOpenAccount();
                } else {
                  setShowReviewForm(!showReviewForm);
                }
              }}
              className="px-4 py-2 rounded-full bg-[#DDF4FC] text-[#168FC2] font-semibold text-xs hover:bg-[#168FC2] hover:text-white transition-colors"
            >
              {currentUser ? 'Write a Review' : 'Sign In to Review'}
            </button>
          </div>

          {/* Review Submission Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-6 p-4 rounded-2xl bg-[#F8FAFC] border border-[#DCEAF1] space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#102A43]">Rating:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        size={18}
                        className={star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#102A43] mb-1">Your Review</label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details about build quality, fit, drop protection..."
                  className="input-field text-xs py-2"
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
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-5 py-1.5 rounded-lg bg-[#168FC2] text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-3">
            {loadingReviews ? (
              <p className="text-xs text-[#62788A]">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#62788A] text-center">
                No customer reviews yet. Be the first verified purchaser to leave feedback!
              </div>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="p-3.5 rounded-xl border border-[#DCEAF1] bg-white space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#102A43]">{r.user_name}</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                        Verified Purchase
                      </span>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} size={13} className="fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#62788A]">{r.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
