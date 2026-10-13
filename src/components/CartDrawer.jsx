import React, { useEffect, useRef } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { calculateOrderTotals, FREE_SHIPPING_THRESHOLD } from '../utils/pricing';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onOpenCheckout,
  currencySymbol = "৳",
  t,
  lang 
}) {
  const closeButtonRef = useRef(null);

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
    // Focus management: initial focus on close button
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

  if (!isOpen) return null;

  // Single shared pricing calculation
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
              <ShoppingBag size={20} className="text-[#145CFF]" />
              <h2 id="cart-drawer-title" className="text-base sm:text-lg font-bold text-[#10263D]">
                {t.cartTitle} ({totalItemCount})
              </h2>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-[#52677B] hover:text-[#10263D] transition-colors focus-visible:ring-2 focus-visible:ring-[#145CFF]"
              aria-label="Close shopping bag"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-5 sm:px-6 py-3.5 bg-[#EAF4FC] border-b border-[#DCE7F0]" role="region" aria-label="Free delivery progress">
            <div className="flex items-center justify-between text-xs font-semibold text-[#10263D] mb-1.5">
              {isFreeDelivery ? (
                <span className="text-emerald-700 flex items-center gap-1 font-bold">
                  <Sparkles size={13} />
                  {t.freeShippingUnlocked}
                </span>
              ) : (
                <span>
                  {t.freeShippingAway.replace('{amount}', remainingForFreeShipping.toLocaleString())}
                </span>
              )}
              <span className="text-[#145CFF] font-bold">{progressPercent}%</span>
            </div>
            <div 
              className="w-full h-2 rounded-full bg-[#DCE7F0] overflow-hidden" 
              role="progressbar" 
              aria-valuenow={progressPercent} 
              aria-valuemin="0" 
              aria-valuemax="100"
            >
              <div 
                className="h-full bg-[#145CFF] transition-all duration-500 rounded-full"
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
                        <h3 className="font-bold text-xs sm:text-sm text-[#10263D] leading-snug line-clamp-1">
                          {lang === 'bn' ? item.titleBn : item.title}
                        </h3>
                        <button
                          onClick={() => onRemoveItem(item.id, item.variant?.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          title="Remove item"
                          aria-label={`Remove ${item.title} from bag`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {item.variant && (
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-[#52677B]">
                          <span 
                            className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block" 
                            style={{ backgroundColor: item.variant.hex }} 
                            aria-hidden="true"
                          />
                          <span>{item.variant.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-[#DCE7F0] rounded-lg bg-white px-2 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.variant?.id, item.quantity - 1)}
                          className="p-1 text-[#52677B] hover:text-[#145CFF] focus-visible:ring-1 focus-visible:ring-[#145CFF]"
                          aria-label={`Decrease quantity of ${item.title}`}
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-[#10263D]" aria-live="polite">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.variant?.id, item.quantity + 1)}
                          className="p-1 text-[#52677B] hover:text-[#145CFF] focus-visible:ring-1 focus-visible:ring-[#145CFF]"
                          aria-label={`Increase quantity of ${item.title}`}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-extrabold text-xs sm:text-sm text-[#10263D]">
                        {currencySymbol}{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Empty Bag View */
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full bg-[#EAF4FC] text-[#145CFF] flex items-center justify-center mb-4">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="font-bold text-base text-[#10263D] mb-1">
                  {t.cartEmpty}
                </h3>
                <p className="text-xs text-[#52677B] max-w-xs mb-6">
                  {t.cartEmptySub}
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-[#145CFF] hover:bg-[#0D4BD9] text-white font-semibold text-xs shadow-md shadow-blue-500/20"
                >
                  {t.shopAccessories}
                </button>
              </div>
            )}
          </div>

          {/* Bottom Checkout Shelf */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-[#DCE7F0] bg-white space-y-2.5">
              <div className="flex justify-between text-xs sm:text-sm text-[#52677B]">
                <span>{t.subtotal}</span>
                <span className="font-bold text-[#10263D]">
                  {currencySymbol}{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs text-[#52677B]">
                <span>{t.deliveryFee}</span>
                <span className="font-semibold text-emerald-700">
                  {isFreeDelivery ? 'FREE (Orders >= ৳2,000)' : '৳60 inside Dhaka / ৳120 outside'}
                </span>
              </div>

              <div className="pt-2 border-t border-[#DCE7F0] flex justify-between items-baseline text-sm sm:text-base font-extrabold text-[#10263D]">
                <div>
                  <span>{isFreeDelivery ? t.total : 'Estimated Total'}</span>
                  {!isFreeDelivery && (
                    <span className="block text-[10px] text-[#52677B] font-normal">
                      Delivery fee finalized at checkout
                    </span>
                  )}
                </div>
                <span className="text-[#145CFF] text-base sm:text-lg">
                  {currencySymbol}{subtotal.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="w-full py-3.5 px-6 rounded-full bg-[#145CFF] hover:bg-[#0D4BD9] active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all mt-2"
              >
                <span>{t.checkoutBtn}</span>
                <ArrowRight size={16} />
              </button>

              <p className="text-[11px] text-center text-[#52677B] flex items-center justify-center gap-1 pt-1">
                <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                <span>Verified checkout • Cash on Delivery or Online</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
