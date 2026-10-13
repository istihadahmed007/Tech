import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, Truck, RotateCcw, Plus, Minus, ShoppingBag, Check, CheckCircle2, Layers } from 'lucide-react';

export default function ProductDetailModal({ 
  product, 
  onClose, 
  onAddToCart, 
  onBuyNow, 
  currencySymbol = "৳",
  t,
  lang 
}) {
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null);
  const [selectedImage, setSelectedImage] = useState(product?.image);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const closeButtonRef = useRef(null);

  // Synchronize when product changes
  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants?.[0] || null);
      setSelectedImage(product.image);
      setQuantity(1);
    }
  }, [product]);

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

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-5 sm:p-8 bg-[#FFFFFF] border border-[#DCE7F0] shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 60px -15px rgba(16, 38, 61, 0.20)'
        }}
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-[#10263D] flex items-center justify-center transition-colors z-20 focus-visible:ring-2 focus-visible:ring-[#145CFF]"
          aria-label="Close product details"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative w-full aspect-square rounded-2xl bg-[#EAF4FC] p-6 flex items-center justify-center border border-[#DCE7F0]">
              <img
                src={selectedImage || product.image}
                alt={product.title}
                className="w-full h-full object-contain transition-all duration-300"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-[#145CFF] text-white shadow-xs">
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
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white shrink-0 focus-visible:ring-2 focus-visible:ring-[#145CFF] ${
                      selectedImage === img ? 'border-[#145CFF] scale-105 shadow-xs' : 'border-[#DCE7F0] hover:border-[#145CFF]'
                    }`}
                    aria-label={`View angle ${i + 1}`}
                  >
                    <img src={img} alt="Thumbnail preview" className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            )}

            {/* Verified Specifications Sheet Strip */}
            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-[#DCE7F0] text-xs text-[#52677B]">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#EAF4FC] border border-[#DCE7F0]">
                <Truck size={16} className="text-[#52677B] shrink-0" />
                <span>Standard courier (৳60 / ৳120)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#EAF4FC] border border-[#DCE7F0]">
                <Layers size={16} className="text-[#52677B] shrink-0" />
                <span>Sample Stock: {product.stock} units</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[#EAF4FC] border border-[#DCE7F0]">
                <ShieldCheck size={16} className="text-[#145CFF] shrink-0" />
                <span className="font-medium text-[#10263D]">{product.warranty ? `Spec: ${product.warranty}` : 'Sample catalog spec'}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-800">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span className="font-medium">Demo seed item</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & Demo Notice */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#145CFF] bg-[#EAF4FC] px-2.5 py-0.5 rounded-md">
                  {product.category}
                </span>
                <span className="text-[11px] font-medium text-[#52677B] bg-slate-100 px-2 py-0.5 rounded-md">
                  Demo catalog item
                </span>
              </div>

              {/* Title */}
              <h2 id="product-detail-title" className="text-lg sm:text-2xl font-bold text-[#10263D] leading-snug mb-1.5">
                {lang === 'bn' ? product.titleBn : product.title}
              </h2>

              {/* Sample Rating Notice */}
              <div className="flex items-center gap-2 mb-3 text-xs text-[#52677B]">
                <span className="font-bold text-amber-500">★ {product.rating || '4.9'}</span>
                <span>•</span>
                <span>Sample rating ({product.reviewCount || '120'} sample reviews)</span>
                <span className="text-[10px] text-[#8FA6BE] bg-slate-100 px-1.5 py-0.5 rounded">Demo data</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#10263D]">
                  {currencySymbol}{product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm sm:text-base text-slate-400 line-through">
                    {currencySymbol}{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Save {currencySymbol}{(product.originalPrice - product.price).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#52677B] leading-relaxed mb-5">
                {product.description}
              </p>

              {/* Variant Finishes Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#10263D] mb-2">
                    Finish: <span className="text-[#145CFF] font-semibold">{selectedVariant?.name}</span>
                  </label>
                  <div className="flex items-center gap-2.5">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`group relative p-1 rounded-full border-2 transition-all focus-visible:ring-2 focus-visible:ring-[#145CFF] ${
                          selectedVariant?.id === v.id ? 'border-[#145CFF] scale-110 shadow-sm' : 'border-[#DCE7F0] hover:border-[#145CFF]'
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

              {/* Compatibility Information List */}
              {product.compatibleWith && product.compatibleWith.length > 0 && (
                <div className="mb-5 bg-[#EAF4FC] border border-[#DCE7F0] rounded-2xl p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#10263D] mb-2">
                    Verified Device Compatibility
                  </h3>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {product.compatibleWith.map((model) => (
                      <span 
                        key={model}
                        className="text-[11px] font-medium bg-white text-[#10263D] px-2.5 py-1 rounded-md border border-[#DCE7F0] shadow-2xs"
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Specifications Sheet */}
              {product.specs && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#10263D] mb-2.5">
                    Technical Specifications
                  </h3>
                  <div className="divide-y divide-slate-100 border border-[#DCE7F0] rounded-xl overflow-hidden bg-white text-xs">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between py-2 px-3 hover:bg-slate-50">
                        <span className="text-[#52677B] font-medium">{key}</span>
                        <span className="text-[#10263D] font-semibold text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions: Quantity + Add to Cart + Buy Now */}
            <div className="pt-4 border-t border-[#DCE7F0] flex flex-col sm:flex-row items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between border border-[#DCE7F0] rounded-xl bg-white px-2 py-1 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-[#52677B] hover:text-[#145CFF] rounded-lg hover:bg-[#EAF4FC] focus-visible:ring-1 focus-visible:ring-[#145CFF]"
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <span className="w-10 text-center font-bold text-sm text-[#10263D]" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-1.5 text-[#52677B] hover:text-[#145CFF] rounded-lg hover:bg-[#EAF4FC] focus-visible:ring-1 focus-visible:ring-[#145CFF]"
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                type="button"
                onClick={handleAdd}
                disabled={product.stock === 0}
                className="w-full sm:flex-1 py-3 px-5 rounded-full bg-[#145CFF] hover:bg-[#0D4BD9] active:scale-[0.99] text-white font-semibold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
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
                disabled={product.stock === 0}
                className="w-full sm:w-auto py-3 px-6 rounded-full bg-[#10263D] hover:bg-[#1a3857] active:scale-[0.99] text-white font-semibold text-sm shadow-xs transition-all disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
