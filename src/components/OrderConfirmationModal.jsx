import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, Truck, Package, Copy, ArrowRight, ShieldCheck, X, Key, Printer } from 'lucide-react';
import { openPrintWindow } from '../utils/invoice.js';
import { trackPurchaseCompleted } from '../utils/analytics.js';

export default function OrderConfirmationModal({ 
  order, 
  onClose, 
  onOpenTracking, 
  currencySymbol = "৳",
  t,
  lang 
}) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 55,
        origin: { y: 0.6 },
        colors: ['#168FC2', '#60A5FA', '#93C5FD', '#10B981']
      });
    } catch (e) {}
  }, []);

  // Track purchase completed (duplicate-safe: skips if order was already recorded)
  useEffect(() => {
    if (order && order.id) {
      trackPurchaseCompleted(order);
    }
  }, [order]);

  // Escape-to-close
  useEffect(() => {
    if (!order) return;
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
  }, [order, onClose]);

  if (!order) return null;

  const isPaid = order.paymentStatus === 'paid';
  const isCod = order.paymentMethod === 'cod';
  const latestTimeline = order.timeline && order.timeline.length > 0 
    ? order.timeline[order.timeline.length - 1]
    : null;

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-confirmed-heading"
    >
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-[#FFFFFF] border border-[#DCEAF1] shadow-2xl text-center animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 60px -15px rgba(16, 38, 61, 0.20)'
        }}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-[#62788A] hover:text-[#102A43] transition-colors focus-visible:ring-2 focus-visible:ring-[#168FC2]"
          aria-label="Close confirmation dialog"
        >
          <X size={20} />
        </button>

        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4 shadow-sm">
          <CheckCircle size={36} className="stroke-[2.5]" />
        </div>

        <h2 id="order-confirmed-heading" className="text-xl sm:text-2xl font-extrabold text-[#102A43] mb-1">
          {order.isDemo ? 'Demo Order Recorded' : (t?.orderConfirmedTitle || 'Order Placed Successfully')}
        </h2>
        <p className="text-xs sm:text-sm text-[#62788A] mb-6">
          Thank you, <strong>{order.customer?.name}</strong>. Your order has been recorded in our store system.
        </p>

        {/* Order Reference Box */}
        <div className="bg-[#DDF4FC] border border-[#DCEAF1] rounded-2xl p-4 mb-4 text-left flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-[#62788A] block">
              {t?.orderIdLabel || 'Order Reference ID:'}
            </span>
            <span className="font-mono text-base sm:text-lg font-extrabold text-[#168FC2]">
              {order.id}
            </span>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(order.id)}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-[#DCEAF1] text-[#168FC2] hover:bg-[#DDF4FC] transition-colors"
            title="Copy Order ID"
            aria-label="Copy Order ID to clipboard"
          >
            <Copy size={13} />
            <span>Copy ID</span>
          </button>
        </div>

        {/* Guest Security Token Box */}
        {order.guestToken && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 mb-6 text-left flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#102A43]">
                <Key size={13} className="text-[#168FC2]" />
                <span>Guest Order Security Token</span>
              </div>
              <span className="font-mono text-xs text-[#62788A] block truncate max-w-[280px] sm:max-w-sm mt-0.5">
                {order.guestToken}
              </span>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(order.guestToken)}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
              title="Copy Security Token"
            >
              <Copy size={13} />
              <span>Copy</span>
            </button>
          </div>
        )}

        {/* Order Summary Details */}
        <div className="text-left divide-y divide-slate-100 border border-[#DCEAF1] rounded-2xl p-4 bg-white mb-6 text-xs space-y-2.5">
          <div className="flex justify-between pt-1">
            <span className="text-[#62788A]">Items Ordered:</span>
            <span className="font-semibold text-[#102A43] text-right max-w-xs">
              {order.items?.map(i => `${i.title} (x${i.quantity})`).join(', ')}
            </span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-[#62788A]">Delivery Destination:</span>
            <span className="font-semibold text-[#102A43] text-right max-w-xs">
              {order.customer?.address}, {order.customer?.division}
            </span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-[#62788A]">Order Status:</span>
            <span className="font-semibold text-right text-slate-700 capitalize">
              {order.status}
            </span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-[#62788A]">Payment Status:</span>
            <span className="font-bold text-right flex items-center gap-1">
              {isPaid ? (
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                  Paid &amp; Verified ({order.transactionId})
                </span>
              ) : isCod ? (
                <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                  Unpaid (Cash on Delivery)
                </span>
              ) : (
                <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                  Payment Pending
                </span>
              )}
            </span>
          </div>

          <div className="flex justify-between pt-2">
            <span className="text-[#62788A]">Subtotal:</span>
            <span className="font-medium text-[#102A43]">
              {currencySymbol}{order.subtotal?.toLocaleString()}
            </span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between pt-2 text-emerald-600 font-medium">
              <span>Promotion Discount:</span>
              <span>-{currencySymbol}{order.discount?.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between pt-2">
            <span className="text-[#62788A]">Delivery Fee:</span>
            <span className="font-medium text-[#102A43]">
              {order.deliveryFee === 0 ? 'FREE' : `${currencySymbol}${order.deliveryFee}`}
            </span>
          </div>

          <div className="flex justify-between pt-2 text-sm font-extrabold">
            <span className="text-[#102A43]">Total Amount:</span>
            <span className="text-[#168FC2]">
              {currencySymbol}{order.total?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={() => {
              onClose();
              onOpenTracking(order.id, order.guestToken);
            }}
            className="w-full sm:flex-1 py-3 px-4 rounded-full bg-[#168FC2] hover:bg-[#0F7CA6] text-white font-bold text-xs shadow-md shadow-sky-500/20 flex items-center justify-center gap-1.5 transition-all"
          >
            <Package size={15} />
            <span>{t?.trackThisOrder || 'Track Parcel Status'}</span>
          </button>

          <button
            type="button"
            onClick={() => openPrintWindow(order, 'invoice')}
            className="w-full sm:w-auto py-3 px-4 rounded-full bg-white border border-[#DCEAF1] hover:bg-[#DDF4FC] text-[#168FC2] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            title="Print or download official tax invoice PDF"
          >
            <Printer size={15} />
            <span>{lang === 'bn' ? 'চালান প্রিন্ট' : 'Print Invoice'}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#102A43] font-semibold text-xs transition-colors"
          >
            {t?.continueShopping || 'Continue Shopping'}
          </button>
        </div>
      </div>
    </div>
  );
}
