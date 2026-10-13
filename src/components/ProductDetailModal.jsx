import React, { useState } from 'react';
import { X, Star, ShieldCheck, Truck, RotateCcw, Plus, Minus, ShoppingBag, Check, CheckCircle2 } from 'lucide-react';

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
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-white/95 backdrop-blur-2xl border border-blue-200/80 shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 60px -15px rgba(17, 42, 67, 0.25), inset 0 1px 2px rgba(255, 255, 255, 1)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-[#112A43] flex items-center justify-center transition-colors z-20"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative w-full aspect-square rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 flex items-center justify-center border border-blue-100">
              <img
                src={selectedImage || product.image}
                alt={product.title}
                className="w-full h-full object-contain transition-all duration-300"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex items-center gap-3">
                {product.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white ${
                      selectedImage === img ? 'border-blue-600 scale-105 shadow-sm' : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantees Strip */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs text-[#4B637B]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-600 shrink-0" />
                <span>{product.warranty || 'Official Warranty'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-blue-600 shrink-0" />
                <span>Next-day Dhaka delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={18} className="text-blue-600 shrink-0" />
                <span>7-Day Return Policy</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>100% Genuine Import</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                  {product.category}
                </span>
                <div className="flex items-center text-amber-500">
                  <Star size={14} fill="currentColor" />
                </div>
                <span className="text-xs font-bold text-[#112A43]">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-[#112A43] leading-snug mb-3">
                {lang === 'bn' ? product.titleBn : product.title}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#112A43]">
                  {currencySymbol}{product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-slate-400 line-through">
                    {currencySymbol}{product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Save {currencySymbol}{(product.originalPrice - product.price).toLocaleString()}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-[#4B637B] leading-relaxed mb-5">
                {product.description}
              </p>

              {/* Variant Finishes Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#112A43] mb-2">
                    Finish: <span className="text-blue-600 font-semibold">{selectedVariant?.name}</span>
                  </label>
                  <div className="flex items-center gap-2.5">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`group relative p-1 rounded-full border-2 transition-all ${
                          selectedVariant?.id === v.id ? 'border-blue-600 scale-110 shadow-md' : 'border-slate-200 hover:border-slate-400'
                        }`}
                        title={v.name}
                      >
                        <span
                          className="block w-6 h-6 rounded-full shadow-inner"
                          style={{ backgroundColor: v.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Compatibility Information List */}
              <div className="mb-6 bg-blue-50/70 border border-blue-200/60 rounded-2xl p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#112A43] mb-2">
                  Verified Device Compatibility
                </h4>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {product.compatibleWith.map((model) => (
                    <span 
                      key={model}
                      className="text-[11px] font-medium bg-white text-[#112A43] px-2.5 py-1 rounded-md border border-blue-200/50 shadow-2xs"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technical Specifications Sheet */}
              {product.specs && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#112A43] mb-2.5">
                    Technical Specifications
                  </h4>
                  <div className="divide-y divide-slate-100 border border-slate-200/70 rounded-xl overflow-hidden bg-white text-xs">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between py-2 px-3 hover:bg-slate-50">
                        <span className="text-[#4B637B] font-medium">{key}</span>
                        <span className="text-[#112A43] font-semibold text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions: Quantity + Add to Cart + Buy Now */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between border border-blue-200 rounded-xl bg-white px-2 py-1 w-full sm:w-auto">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <span className="w-10 text-center font-bold text-sm text-[#112A43]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAdd}
                disabled={product.stock === 0}
                className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
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
                onClick={handleBuy}
                disabled={product.stock === 0}
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#112A43] hover:bg-[#1a3857] text-white font-semibold text-sm shadow-sm transition-all"
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
