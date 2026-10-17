import React, { useEffect, useRef, useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { calculateOrderTotals, FREE_SHIPPING_THRESHOLD } from '../utils/pricing';
import { safeFetchJson } from '../utils/api';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onOpenCheckout,
  onRevalidateCart,
  currencySymbol = "৳",
  t,
  lang 
}) {
  const closeButtonRef = useRef(null);
  const [revalidationWarnings, setRevalidationWarnings] = useState([]);
  const [isValidating, setIsValidating] = useState(false);

  // Accessible Escape-to-close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const timer = setTimeout(() => {
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  // Revalidate cart items with server whenever cart drawer opens
  useEffect(() => {
    if (isOpen && cart.length > 0) {
      revalidateWithServer();
    }
  }, [isOpen]);

  const revalidateWithServer = async () => {
    setIsValidating(true);
    try {
      const res = await safeFetchJson('/api/cart/validate', {
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
      });

      if (res.ok && res.data?.valid) {
        if (res.data.warnings && res.data.warnings.length > 0) {
          setRevalidationWarnings(res.data.warnings);
        } else {
          setRevalidationWarnings([]);
        }

        // If items were updated, notify parent
        if (onRevalidateCart && res.data.items) {
          onRevalidateCart(res.data.items);
        }
      }
    } catch (e) {
      console.warn('Cart revalidation skipped:', e?.message);
    } finally {
      setIsValidating(false);
    }
  };

  if (!isOpen) return null;

  const { 
    subtotal, 
    remainingForFreeShipping, 
    progressPercent, 
    isFreeDelivery 
  } = calculateOrderTotals(cart);

  const totalItemCount = cart.reduce((n, item) => n + item.quantity, 0);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden" 
      aria-labelledby="cart-drawer-title" 
      role="dialog" 
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#10263D]/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div 
          className="w-screen max-w-md bg-[#FFFFFF] border-l border-[#DCE7F0] shadow-2xl flex flex-col justify-between animate-slideInRight"
          style={{
            boxShadow: '-10px 0 40px rgba(16, 38, 61, 0.15)'
          }}
        >
          {/* Header */}
          <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-[#DCE7F0] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-[#EE4D2D]" />
              <h2 id="cart-drawer-title" className="text-base sm:text-lg font-bold text-[#10263D]">
                {t?.cartTitle || 'Your Shopping Bag'} ({totalItemCount})
              </h2>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-[#52677B] hover:text-[#10263D] transition-colors focus-visible:ring-2 focus-visible:ring-[#EE4D2D]"
              aria-label="Close shopping bag"
            >
              <X size={20} />
            </button>
          </div>

          {/* Revalidation Warnings Notice */}
          {revalidationWarnings.length > 0 && (
            <div className="px-5 py-3 bg-amber-50 border-b border-amber-200 text-xs text-amber-800 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle size={14} className="shrink-0" />
                <span>{lang === 'bn' ? 'স্টক ও মূল্যের আপডেট সংক্রান্ত তথ্য' : 'Inventory & Price Update Notice'}</span>
              </div>
              {revalidationWarnings.map((warn, i) => (
                <p key={i} className="text-[11px] pl-5">{warn}</p>
              ))}
            </div>
          )}

          {/* Free Shipping Progress Meter */}
          <div className="px-5 sm:px-6 py-3.5 bg-[#EAF4FC] border-b border-[#DCE7F0]" role="region" aria-label="Free delivery progress">
            <div className="flex items-center justify-between text-xs font-semibold text-[#10263D] mb-1.5">
              {isFreeDelivery ? (
                <span className="text-emerald-700 flex items-center gap-1 font-bold">
                  <Sparkles size={13} />
                  {t?.freeShippingUnlocked || 'You have unlocked Free Delivery!'}
                </span>
              ) : (
                <span>
                  {(t?.freeShippingAway || 'Add ৳{amount} more to get Free Delivery!').replace('{amount}', remainingForFreeShipping.toLocaleString())}
                </span>
              )}
              <span className="text-[#EE4D2D] font-bold">{progressPercent}%</span>
            </div>
            <div 
              className="w-full h-2 rounded-full bg-[#DCE7F0] overflow-hidden" 
              role="progressbar" 
              aria-valuenow={progressPercent} 
              aria-valuemin="0" 
              aria-valuemax="100"
            >
              <div 
                className="h-full bg-[#EE4D2D] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 divide-y divide-slate-100">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={`${item.id}-${item.variant?.id || 'def'}`} className="py-4 flex gap-3.5 sm:gap-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#EAF4FC] p-2 shrink-0 border border-[#DCE7F0] flex items-center justify-center">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-contain" 
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-xs sm:text-sm text-[#10263D] leading-tight">
                          {lang === 'bn' ? (item.titleBn || item.title) : item.title}
                        </h3>
                        <button
                          onClick={() => onRemoveItem(item.id, item.variant?.id)}
                          className="text-slate-400 hover:text-red-500 p-0.5 rounded transition-colors"
                          aria-label={`Remove ${item.title} from bag`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {item.variant && (
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#52677B]">
                          <span 
                            className="w-2.5 h-2.5 rounded-full border border-black/10" 
                            style={{ backgroundColor: item.variant.hex }} 
                          />
                          <span>{item.variant.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-[#DCE7F0] rounded-lg bg-slate-50 p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.variant?.id, item.quantity - 1)}
                          className="p-1 rounded text-[#52677B] hover:bg-white hover:text-[#10263D] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-[#10263D]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.variant?.id, item.quantity + 1)}
                          className="p-1 rounded text-[#52677B] hover:bg-white hover:text-[#10263D] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <span className="font-extrabold text-sm text-[#10263D]">
                        {currencySymbol}{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#EAF4FC] text-[#EE4D2D] flex items-center justify-center mb-4">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="font-bold text-base text-[#10263D] mb-1">
                  {t?.cartEmpty || 'Your bag is empty'}
                </h3>
                <p className="text-xs text-[#52677B] max-w-xs mb-6">
                  {t?.cartEmptySub || 'Explore our ice-blue collection and add everyday upgrades.'}
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-[#EE4D2D] text-white text-xs font-semibold hover:bg-[#D73211] transition-colors shadow-xs"
                >
                  {lang === 'bn' ? 'কেনাকাটা শুরু করুন' : 'Start Shopping'}
                </button>
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-[#DCE7F0] bg-white space-y-4">
              <div className="space-y-1.5 text-xs text-[#52677B]">
                <div className="flex justify-between">
                  <span>{t?.subtotal || 'Subtotal'}</span>
                  <span className="font-bold text-[#10263D]">{currencySymbol}{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t?.deliveryFee || 'Delivery Fee'}</span>
                  <span>{isFreeDelivery ? <strong className="text-emerald-600">{lang === 'bn' ? 'ফ্রি' : 'FREE'}</strong> : (lang === 'bn' ? 'চেকআউটে নির্ধারিত হবে' : 'Calculated at checkout')}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#10263D]">{t?.total || 'Total'}</span>
                <span className="text-xl font-extrabold text-[#EE4D2D]">
                  {currencySymbol}{subtotal.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="w-full py-3.5 px-6 rounded-md bg-[#EE4D2D] hover:bg-[#D73211] active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>{t?.checkoutBtn || 'Proceed to Checkout'}</span>
                <ArrowRight size={17} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
