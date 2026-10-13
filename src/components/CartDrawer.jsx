import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

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
  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 2000;
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#112A43]/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          className="w-screen max-w-md bg-white/95 backdrop-blur-2xl border-l border-blue-200/80 shadow-2xl flex flex-col justify-between animate-slideInRight"
          style={{
            boxShadow: '-10px 0 40px rgba(17, 42, 67, 0.15)'
          }}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-blue-100 flex items-center justify-between bg-white/60">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-[#112A43]">
                {t.cartTitle} ({cart.reduce((n, item) => n + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-6 py-3.5 bg-blue-50/80 border-b border-blue-100">
            <div className="flex items-center justify-between text-xs font-semibold text-[#112A43] mb-1.5">
              {remainingForFreeShipping === 0 ? (
                <span className="text-emerald-700 flex items-center gap-1">
                  <Sparkles size={13} />
                  {t.freeShippingUnlocked}
                </span>
              ) : (
                <span>
                  {t.freeShippingAway.replace('{amount}', remainingForFreeShipping.toLocaleString())}
                </span>
              )}
              <span className="text-blue-600 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-blue-200/50 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={`${item.id}-${item.variant?.id || 'def'}`} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-blue-50/80 p-2 shrink-0 border border-blue-100 flex items-center justify-center">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-contain" 
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-sm text-[#112A43] leading-snug line-clamp-1">
                          {lang === 'bn' ? item.titleBn : item.title}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id, item.variant?.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {item.variant && (
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-[#4B637B]">
                          <span 
                            className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block" 
                            style={{ backgroundColor: item.variant.hex }} 
                          />
                          <span>{item.variant.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white px-2 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.variant?.id, item.quantity - 1)}
                          className="p-1 text-slate-500 hover:text-blue-600"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-[#112A43]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.variant?.id, item.quantity + 1)}
                          className="p-1 text-slate-500 hover:text-blue-600"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-extrabold text-sm text-[#112A43]">
                        {currencySymbol}{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Empty Bag View */
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="font-bold text-base text-[#112A43] mb-1">
                  {t.cartEmpty}
                </h3>
                <p className="text-xs text-[#4B637B] max-w-xs mb-6">
                  {t.cartEmptySub}
                </p>
                <button
                  onClick={onClose}
                  className="btn-primary text-xs py-2.5 px-5"
                >
                  {t.shopAccessories}
                </button>
              </div>
            )}
          </div>

          {/* Bottom Checkout Shelf */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-blue-100 bg-white/80 space-y-3">
              <div className="flex justify-between text-sm text-[#4B637B]">
                <span>{t.subtotal}</span>
                <span className="font-bold text-[#112A43]">
                  {currencySymbol}{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs text-[#4B637B]">
                <span>{t.deliveryFee}</span>
                <span className="font-semibold text-emerald-600">
                  {subtotal >= 2000 ? 'FREE' : '৳60 inside Dhaka / ৳120 outside'}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between text-base font-extrabold text-[#112A43]">
                <span>{t.total}</span>
                <span className="text-blue-600 text-lg">
                  {currencySymbol}{subtotal.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <span>{t.checkoutBtn}</span>
                <ArrowRight size={16} />
              </button>

              <p className="text-[11px] text-center text-[#8FA6BE] flex items-center justify-center gap-1">
                <ShieldCheck size={13} className="text-emerald-600" />
                <span>Verified 256-bit SSL encrypted checkout</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
