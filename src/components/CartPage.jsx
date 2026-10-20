import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  Trash2, 
  Heart, 
  Share2, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  ShoppingBag, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Gift, 
  Truck,
  RotateCcw,
  Star,
  ChevronRight
} from 'lucide-react';
import { calculateOrderTotals, FREE_SHIPPING_THRESHOLD } from '../utils/pricing';
import { safeFetchJson } from '../utils/api';
import './CartPage.css';

export default function CartPage({
  cart = [],
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
  onSelectProduct,
  allProducts = [],
  onAddToCart,
  currencySymbol = "৳",
  lang = 'en',
  t = {}
}) {
  // Key for item unique identification (combining product ID and variant ID)
  const getItemKey = (item) => `${item.id}_${item.variant?.id || 'default'}`;

  // Selection state for cart items (all selected by default, just like Amazon)
  const [selectedKeys, setSelectedKeys] = useState(() => {
    return new Set(cart.map(getItemKey));
  });

  // Keep selection updated when cart changes (e.g. new item added)
  useEffect(() => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      cart.forEach((item) => {
        const key = getItemKey(item);
        if (!prev.has(key)) {
          next.add(key);
        }
      });
      // Remove keys that are no longer in cart
      const currentKeys = new Set(cart.map(getItemKey));
      for (const k of next) {
        if (!currentKeys.has(k)) {
          next.delete(k);
        }
      }
      return next;
    });
  }, [cart]);

  // Saved for later items (persisted in localStorage)
  const [savedForLater, setSavedForLater] = useState(() => {
    try {
      const saved = localStorage.getItem('accessories_saved_for_later');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Sync saved for later to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('accessories_saved_for_later', JSON.stringify(savedForLater));
    } catch (e) {}
  }, [savedForLater]);

  // Gift checkbox states
  const [isGiftOrder, setIsGiftOrder] = useState(false);
  const [itemGifts, setItemGifts] = useState({});

  // Toast / feedback message
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Revalidation state
  const [revalidationWarnings, setRevalidationWarnings] = useState([]);

  // Server revalidation on mount
  useEffect(() => {
    if (cart.length > 0) {
      safeFetchJson('/api/cart/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(i => ({
            id: i.id,
            price: i.price,
            quantity: i.quantity,
            variant: i.variant,
            title: i.title
          }))
        })
      }).then(res => {
        if (res.ok && res.data?.warnings?.length > 0) {
          setRevalidationWarnings(res.data.warnings);
        }
      }).catch(() => {});
    }
  }, []);

  // Filter items that are currently selected for checkout
  const selectedCartItems = useMemo(() => {
    return cart.filter((item) => selectedKeys.has(getItemKey(item)));
  }, [cart, selectedKeys]);

  // Pricing calculations based ONLY on selected items (matching Amazon behavior)
  const { 
    subtotal: selectedSubtotal, 
    remainingForFreeShipping, 
    progressPercent, 
    isFreeDelivery 
  } = calculateOrderTotals(selectedCartItems);

  const selectedItemCount = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const allSelected = cart.length > 0 && selectedCartItems.length === cart.length;

  // Toggle selection for all items
  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedKeys(new Set());
    } else {
      setSelectedKeys(new Set(cart.map(getItemKey)));
    }
  };

  // Toggle single item selection
  const handleToggleItemSelection = (item) => {
    const key = getItemKey(item);
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Move item to Saved For Later
  const handleSaveForLater = (item) => {
    onRemoveItem(item.id, item.variant?.id);
    setSavedForLater((prev) => {
      const key = getItemKey(item);
      const exists = prev.some((p) => getItemKey(p) === key);
      if (!exists) {
        return [item, ...prev];
      }
      return prev;
    });
    showToast(lang === 'bn' ? `"${item.title}" পরবর্তীতে ক্রয়ের জন্য সংরক্ষিত হয়েছে` : `Saved "${item.title}" for later`);
  };

  // Move saved item back to Cart
  const handleMoveToCart = (item) => {
    setSavedForLater((prev) => prev.filter((p) => getItemKey(p) !== getItemKey(item)));
    if (onAddToCart) {
      onAddToCart(item, item.variant, item.quantity || 1);
    }
    showToast(lang === 'bn' ? `"${item.title}" কার্টে যোগ করা হয়েছে` : `Moved "${item.title}" to Cart`);
  };

  // Remove item from Saved For Later
  const handleRemoveFromSaved = (item) => {
    setSavedForLater((prev) => prev.filter((p) => getItemKey(p) !== getItemKey(item)));
    showToast(lang === 'bn' ? 'সংরক্ষিত তালিকা থেকে মোছা হয়েছে' : 'Removed from Saved for Later');
  };

  // Share item link
  const handleShareItem = (item) => {
    const url = `${window.location.origin}/product/${item.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast(lang === 'bn' ? 'প্রোডাক্ট লিঙ্ক কপি করা হয়েছে!' : 'Product link copied to clipboard!');
    } else {
      showToast(url);
    }
  };

  // Curated accessories for "Customers who bought items in your cart also bought"
  const recommendedProducts = useMemo(() => {
    const cartIds = new Set(cart.map(i => i.id));
    return allProducts
      .filter(p => !cartIds.has(p.id))
      .slice(0, 4);
  }, [allProducts, cart]);

  return (
    <div className="amazon-cart-page" role="main" aria-label="Shopping Cart">
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#102A43] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-2xl border border-blue-400/30 flex items-center gap-2 animate-fadeIn"
          style={{ zIndex: 99999 }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="amazon-cart-container">
        {/* Revalidation Warnings Notice if price or stock changed */}
        {revalidationWarnings.length > 0 && (
          <div className="mb-4 p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2 shadow-xs">
            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{lang === 'bn' ? 'স্টক ও মূল্যের আপডেট নোটিশ' : 'Price & Stock Updates'}</p>
              {revalidationWarnings.map((warn, i) => (
                <p key={i} className="text-[11px] mt-0.5">{warn}</p>
              ))}
            </div>
          </div>
        )}

        {/* Amazon Top Free Shipping Progress / Qualified Banner */}
        {cart.length > 0 && (
          <div className="amazon-cart-top-banner">
            <div className="amazon-cart-banner-left">
              {isFreeDelivery ? (
                <CheckCircle2 className="amazon-free-ship-icon" />
              ) : (
                <Truck className="amazon-free-ship-icon text-[#168FC2]" />
              )}
              <div className="amazon-cart-banner-text">
                {isFreeDelivery ? (
                  <div>
                    <strong>{lang === 'bn' ? 'আপনার অর্ডার ফ্রি ডেলিভারির জন্য প্রযোজ্য!' : 'Your order qualifies for FREE Shipping.'}</strong>
                    <span className="text-[#565959] ml-1">
                      {lang === 'bn' ? 'চেকআউটে বিনামূল্যে দ্রুত ডেলিভারি উপভোগ করুন।' : 'Choose this option at checkout.'}
                    </span>
                  </div>
                ) : (
                  <div>
                    <span>
                      {lang === 'bn' 
                        ? `ফ্রি ডেলিভারি পেতে আরও ` 
                        : `Add `}
                    </span>
                    <strong className="text-[#B12704]">
                      {currencySymbol}{remainingForFreeShipping.toLocaleString()}
                    </strong>
                    <span>
                      {lang === 'bn' 
                        ? ` মূল্যের পণ্য কার্টে যোগ করুন।` 
                        : ` of eligible items to get FREE Shipping.`}
                    </span>
                    <div className="amazon-free-ship-progress-bar">
                      <div 
                        className="amazon-free-ship-progress-fill" 
                        style={{ width: `${progressPercent}%` }} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden sm:block text-right">
              <span className="text-xs font-semibold text-[#565959]">
                {lang === 'bn' ? 'ফ্রি ডেলিভারি সীমা: ৳২,০০০' : 'Free delivery threshold: ৳2,000'}
              </span>
            </div>
          </div>
        )}

        {/* 2-Column Responsive Layout */}
        <div className="amazon-cart-layout">
          {/* Left Column: Main Shopping Cart Card */}
          <div className="amazon-cart-main-col">
            <div className="amazon-cart-main-card">
              {/* Header */}
              <div className="amazon-cart-header">
                <div>
                  <h1 className="amazon-cart-title">
                    {lang === 'bn' ? 'শপিং কার্ট' : 'Shopping Cart'}
                  </h1>
                  {cart.length > 0 && (
                    <button 
                      onClick={handleToggleSelectAll} 
                      className="amazon-deselect-btn"
                    >
                      {allSelected 
                        ? (lang === 'bn' ? 'সব পণ্য বাতিল করুন' : 'Deselect all items') 
                        : (lang === 'bn' ? 'সব পণ্য নির্বাচন করুন' : 'Select all items')}
                    </button>
                  )}
                </div>
                {cart.length > 0 && (
                  <div className="amazon-cart-price-col-header">
                    {lang === 'bn' ? 'মূল্য' : 'Price'}
                  </div>
                )}
              </div>

              {/* Cart Items List */}
              {cart.length === 0 ? (
                <div className="amazon-cart-empty-state">
                  <ShoppingBag className="amazon-empty-cart-icon" />
                  <h2 className="amazon-empty-cart-heading">
                    {lang === 'bn' ? 'আপনার শপিং কার্ট খালি' : 'Your Shopping Cart is empty'}
                  </h2>
                  <p className="amazon-empty-cart-sub">
                    {lang === 'bn' 
                      ? 'অরিজিনাল হেডফোন, চার্জার, ম্যাগসেফ কেস ও গ্যাজেটের সেরা কালেকশন দেখুন।' 
                      : 'Explore authentic earbuds, fast chargers, MagSafe cases, and premium tech accessories.'}
                  </p>
                  <button 
                    onClick={onContinueShopping}
                    className="amazon-btn-proceed"
                    style={{ maxWidth: '280px', margin: '0 auto' }}
                  >
                    {lang === 'bn' ? 'আজকের অফারগুলো দেখুন' : "Shop today's deals"}
                    <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <div className="amazon-cart-items-list">
                  {cart.map((item) => {
                    const isSelected = selectedKeys.has(getItemKey(item));
                    const isGift = Boolean(itemGifts[getItemKey(item)]);

                    return (
                      <div 
                        key={getItemKey(item)} 
                        className={`amazon-cart-item-row ${!isSelected ? 'is-deselected' : ''}`}
                      >
                        {/* Checkbox */}
                        <div className="amazon-checkbox-col">
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => handleToggleItemSelection(item)}
                            className="amazon-cart-checkbox"
                            aria-label={`Select ${item.title}`}
                          />
                        </div>

                        {/* Thumbnail */}
                        <div 
                          className="amazon-cart-thumb-col"
                          onClick={() => onSelectProduct && onSelectProduct(item)}
                        >
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="amazon-cart-thumb-img"
                            loading="lazy"
                          />
                        </div>

                        {/* Details */}
                        <div className="amazon-cart-item-details">
                          <h3 
                            className="amazon-cart-item-title"
                            onClick={() => onSelectProduct && onSelectProduct(item)}
                          >
                            {lang === 'bn' && item.titleBn ? item.titleBn : item.title}
                          </h3>

                          {/* Stock Status */}
                          <div className="amazon-cart-stock-status">
                            <Check size={14} className="text-[#007600] stroke-[3]" />
                            <span>{lang === 'bn' ? 'স্টকে আছে' : 'In Stock'}</span>
                          </div>

                          {/* Free Shipping Eligible */}
                          <div className="amazon-cart-shipping-note">
                            {lang === 'bn' ? 'ফ্রি শিপিং-এর জন্য উপযুক্ত' : 'Eligible for FREE Shipping'}
                          </div>

                          {/* Variant / Style Name */}
                          {item.variant && item.variant.name && (
                            <div className="amazon-cart-variant-tag">
                              <span className="text-[#565959]">
                                {lang === 'bn' ? 'স্টাইল / কালার: ' : 'Style: '}
                              </span>
                              <span className="font-semibold">{item.variant.name}</span>
                            </div>
                          )}

                          {/* Gift Option Checkbox */}
                          <label className="amazon-cart-gift-option">
                            <input 
                              type="checkbox" 
                              checked={isGift}
                              onChange={(e) => {
                                setItemGifts(prev => ({
                                  ...prev,
                                  [getItemKey(item)]: e.target.checked
                                }));
                              }}
                              className="w-3.5 h-3.5 accent-[#007185] cursor-pointer"
                            />
                            <Gift size={13} className="text-[#565959]" />
                            <span>{lang === 'bn' ? 'এটি একটি উপহার (উপহার প্যাকেজিং)' : 'This is a gift'}</span>
                          </label>

                          {/* Controls Row: Qty Stepper, Delete, Save for later, Share */}
                          <div className="amazon-cart-actions-toolbar">
                            {/* Quantity Stepper */}
                            <div className="amazon-qty-stepper">
                              <button 
                                onClick={() => onUpdateQuantity(item.id, item.variant?.id, item.quantity - 1)}
                                className="amazon-qty-btn"
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span className="amazon-qty-value">{item.quantity}</span>
                              <button 
                                onClick={() => onUpdateQuantity(item.id, item.variant?.id, item.quantity + 1)}
                                className="amazon-qty-btn"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>

                            <span className="amazon-toolbar-sep">|</span>

                            <button 
                              onClick={() => onRemoveItem(item.id, item.variant?.id)}
                              className="amazon-action-link"
                            >
                              {lang === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                            </button>

                            <span className="amazon-toolbar-sep">|</span>

                            <button 
                              onClick={() => handleSaveForLater(item)}
                              className="amazon-action-link"
                            >
                              {lang === 'bn' ? 'পরবর্তীতে ক্রয়ের জন্য রাখুন' : 'Save for later'}
                            </button>

                            <span className="amazon-toolbar-sep hidden sm:inline">|</span>

                            <button 
                              onClick={() => handleShareItem(item)}
                              className="amazon-action-link hidden sm:inline"
                            >
                              {lang === 'bn' ? 'শেয়ার' : 'Share'}
                            </button>
                          </div>
                        </div>

                        {/* Price Column */}
                        <div className="amazon-cart-price-col">
                          <div className="amazon-item-price">
                            {currencySymbol}{(item.price * item.quantity).toLocaleString()}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-[11px] text-[#565959] mt-0.5">
                              ({currencySymbol}{item.price.toLocaleString()} {lang === 'bn' ? 'প্রতি পিস' : 'each'})
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Subtotal Footer in Main Card */}
                  <div className="amazon-cart-subtotal-footer">
                    <span>
                      {lang === 'bn' 
                        ? `মোট (${selectedItemCount} টি আইটেম):` 
                        : `Subtotal (${selectedItemCount} ${selectedItemCount === 1 ? 'item' : 'items'}):`}
                    </span>
                    <strong>
                      {currencySymbol}{selectedSubtotal.toLocaleString()}
                    </strong>
                  </div>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <p className="amazon-cart-disclaimer">
              {lang === 'bn'
                ? 'Tech Vartual Tutor-এ পণ্যের মূল্য ও স্টক পরিবর্তনশীল হতে পারে। কার্ট সাময়িক সংরক্ষণের স্থান এবং সর্বশেষ মূল্য ও প্রাপ্যতা প্রদর্শন করে।'
                : 'The price and availability of items at Tech Vartual Tutor are subject to change. The Cart is a temporary place to store a list of your items and reflects each item\'s most recent price.'}
            </p>

            {/* Saved For Later Section */}
            {savedForLater.length > 0 && (
              <div className="amazon-saved-for-later-section">
                <h2 className="amazon-saved-title">
                  {lang === 'bn' 
                    ? `পরবর্তীতে ক্রয়ের জন্য সংরক্ষিত (${savedForLater.length} টি পণ্য)` 
                    : `Saved for later (${savedForLater.length} ${savedForLater.length === 1 ? 'item' : 'items'})`}
                </h2>

                <div className="amazon-saved-grid">
                  {savedForLater.map((savedItem) => (
                    <div key={getItemKey(savedItem)} className="amazon-saved-card">
                      <div className="amazon-saved-card-top">
                        <img 
                          src={savedItem.image} 
                          alt={savedItem.title} 
                          className="amazon-saved-card-img"
                          onClick={() => onSelectProduct && onSelectProduct(savedItem)}
                        />
                        <div className="min-w-0">
                          <h4 
                            className="text-xs font-semibold text-[#0F1111] line-clamp-2 cursor-pointer hover:text-[#007185] hover:underline"
                            onClick={() => onSelectProduct && onSelectProduct(savedItem)}
                          >
                            {savedItem.title}
                          </h4>
                          <div className="text-sm font-bold text-[#0F1111] mt-1">
                            {currencySymbol}{savedItem.price.toLocaleString()}
                          </div>
                          <div className="text-[11px] text-[#007600] font-semibold mt-0.5">
                            {lang === 'bn' ? 'স্টকে আছে' : 'In Stock'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-[#E7E7E7]">
                        <button 
                          onClick={() => handleMoveToCart(savedItem)}
                          className="amazon-btn-move-to-cart flex-1"
                        >
                          {lang === 'bn' ? 'কার্টে যোগ করুন' : 'Move to cart'}
                        </button>
                        <button 
                          onClick={() => handleRemoveFromSaved(savedItem)}
                          className="text-xs text-[#007185] hover:text-[#C45500] hover:underline px-2 py-1"
                        >
                          {lang === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customers Who Bought Items in Your Cart Also Bought */}
            {recommendedProducts.length > 0 && (
              <div className="amazon-cart-recommendations">
                <h3 className="amazon-rec-header">
                  {lang === 'bn' ? 'জনপ্রিয় প্রয়োজনীয় এক্সেসরিজ' : 'Customers who bought items in your cart also bought'}
                </h3>

                <div className="amazon-rec-grid">
                  {recommendedProducts.map((rec) => (
                    <div key={rec.id} className="amazon-rec-card">
                      <img 
                        src={rec.image} 
                        alt={rec.title} 
                        className="amazon-rec-img"
                        onClick={() => onSelectProduct && onSelectProduct(rec)}
                      />
                      <div className="min-w-0">
                        <h4 
                          className="amazon-rec-title"
                          onClick={() => onSelectProduct && onSelectProduct(rec)}
                        >
                          {lang === 'bn' && rec.titleBn ? rec.titleBn : rec.title}
                        </h4>
                        
                        <div className="flex items-center gap-1 my-1 text-xs text-amber-500">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="text-[11px] text-[#007185] ml-0.5 font-semibold">
                            {rec.rating || 4.8}
                          </span>
                        </div>

                        <div className="amazon-rec-price">
                          {currencySymbol}{rec.price.toLocaleString()}
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          if (onAddToCart) {
                            onAddToCart(rec, rec.variants?.[0] || null, 1);
                          }
                        }}
                        className="amazon-btn-quick-add"
                      >
                        {lang === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Summary & Checkout Card */}
          <div className="amazon-cart-sidebar-col">
            <div className="amazon-cart-sidebar-card">
              {/* Free delivery note in sidebar */}
              {isFreeDelivery ? (
                <div className="amazon-sidebar-free-ship">
                  <CheckCircle2 size={16} className="text-[#007600] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#007600]">
                      {lang === 'bn' ? 'ফ্রি ডেলিভারি যোগ্য' : 'Your order qualifies for FREE Shipping.'}
                    </span>
                    <span className="text-[#565959] text-[11px] block mt-0.5">
                      {lang === 'bn' ? 'চেকআউটে দ্রুত ফ্রি ডেলিভারি নির্বাচন করুন।' : 'Choose this option at checkout.'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#565959] mb-3">
                  <span>{lang === 'bn' ? 'ফ্রি ডেলিভারি পেতে আর ' : 'Add '}</span>
                  <strong className="text-[#B12704]">{currencySymbol}{remainingForFreeShipping.toLocaleString()}</strong>
                  <span>{lang === 'bn' ? ' যোগ করুন।' : ' more for FREE delivery.'}</span>
                </div>
              )}

              {/* Subtotal line */}
              <div className="amazon-sidebar-subtotal-title">
                <span>
                  {lang === 'bn' 
                    ? `মোট (${selectedItemCount} টি আইটেম):` 
                    : `Subtotal (${selectedItemCount} ${selectedItemCount === 1 ? 'item' : 'items'}):`}
                </span>
                <span className="amazon-sidebar-subtotal-price">
                  {currencySymbol}{selectedSubtotal.toLocaleString()}
                </span>
              </div>

              {/* Gift Checkbox */}
              <label className="amazon-sidebar-gift-row">
                <input 
                  type="checkbox" 
                  checked={isGiftOrder}
                  onChange={(e) => setIsGiftOrder(e.target.checked)}
                  className="w-4 h-4 accent-[#007185] cursor-pointer"
                />
                <span className="text-xs text-[#0F1111]">
                  {lang === 'bn' ? 'এই অর্ডারে উপহার রয়েছে' : 'This order contains a gift'}
                </span>
              </label>

              {/* Signature Amazon Gold "Proceed to Checkout" Button */}
              <button 
                onClick={() => {
                  if (selectedCartItems.length > 0) {
                    onProceedToCheckout(selectedCartItems);
                  }
                }}
                disabled={selectedCartItems.length === 0}
                className="amazon-btn-proceed"
                aria-label="Proceed to checkout"
              >
                <span>{lang === 'bn' ? 'চেকআউটে এগিয়ে যান' : 'Proceed to checkout'}</span>
                <ChevronRight size={16} />
              </button>

              {/* Security & Payment Protection Assurances */}
              <div className="amazon-sidebar-trust-box">
                <div className="amazon-trust-line">
                  <Lock size={13} className="text-[#007600]" />
                  <span className="font-semibold text-[#007600]">
                    {lang === 'bn' ? '১০০% নিরাপদ ও এনক্রিপ্টেড চেকআউট' : '100% Secure 256-Bit SSL Checkout'}
                  </span>
                </div>

                <div className="amazon-trust-line">
                  <ShieldCheck size={13} className="text-[#168FC2]" />
                  <span>
                    {lang === 'bn' ? '৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি' : '7-Day Easy Return & Warranty'}
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-[#E7E7E7]">
                  <span className="text-[11px] text-[#565959] block mb-1">
                    {lang === 'bn' ? 'অনলাইন পেমেন্ট মেথড:' : 'Accepted payment options:'}
                  </span>
                  <div className="amazon-payment-badges-row">
                    <span className="amazon-pay-badge text-[#D12053]">bKash</span>
                    <span className="amazon-pay-badge text-[#F7941D]">Nagad</span>
                    <span className="amazon-pay-badge text-[#6B2D82]">Rocket</span>
                    <span className="amazon-pay-badge text-[#1A1F71]">Visa/Master</span>
                    <span className="amazon-pay-badge text-[#007600]">Cash on Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
