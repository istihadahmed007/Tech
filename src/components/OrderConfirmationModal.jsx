import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, Truck, Package, Copy, ArrowRight, ShieldCheck, X } from 'lucide-react';

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
        colors: ['#145CFF', '#60A5FA', '#93C5FD', '#10B981']
      });
    } catch (e) {}
  }, []);

  // Escape-to-close
  useEffect(() => {
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
  }, [onClose]);

  if (!order) return null;

  const isPaid = order.paymentStatus === 'paid';
  const isCod = order.paymentMethod === 'cod';
  const isSandbox = Boolean(order.paymentDetails?.isSandbox);
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
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-[#FFFFFF] border border-[#DCE7F0] shadow-2xl text-center animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 60px -15px rgba(16, 38, 61, 0.20)'
        }}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-[#52677B] hover:text-[#10263D] transition-colors focus-visible:ring-2 focus-visible:ring-[#145CFF]"
          aria-label="Close confirmation dialog"
        >
          <X size={20} />
        </button>

        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4 shadow-sm">
          <CheckCircle size={36} className="stroke-[2.5]" />
        </div>

        <h2 id="order-confirmed-heading" className="text-xl sm:text-2xl font-extrabold text-[#10263D] mb-1">
          {order.isDemo ? 'Demo Order Recorded' : t.orderConfirmedTitle}
        </h2>
        <p className="text-xs sm:text-sm text-[#52677B] mb-6">
          {order.isDemo ? (
            <>
              Thank you, <strong>{order.customer?.name}</strong>. Your order has been recorded in the demo database.
              <span className="block mt-1 text-[11px] text-amber-700 bg-amber-50 rounded-lg p-2 border border-amber-200 mt-2">
                Notice: This is a demonstration order for storefront preview. No real funds were charged and no warehouse parcel will be dispatched.
              </span>
            </>
          ) : (
            <>Thank you, <strong>{order.customer?.name}</strong>. Your order has been recorded in our store system.</>
          )}
        </p>

        {/* Order Reference Box */}
        <div className="bg-[#EAF4FC] border border-[#DCE7F0] rounded-2xl p-4 mb-6 text-left flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-[#52677B] block">
              {t.orderIdLabel}
            </span>
            <span className="font-mono text-base sm:text-lg font-extrabold text-[#145CFF]">
              {order.id}
            </span>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(order.id)}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-[#DCE7F0] text-[#145CFF] hover:bg-[#EAF4FC] transition-colors"
            title="Copy Order ID"
            aria-label="Copy Order ID to clipboard"
          >
            <Copy size={13} />
            <span>Copy ID</span>
          </button>
        </div>

        {/* Order Summary Details */}
        <div className="text-left divide-y divide-slate-100 border border-[#DCE7F0] rounded-2xl p-4 bg-white mb-6 text-xs space-y-2.5">
          <div className="flex justify-between pt-1">
            <span className="text-[#52677B]">Items Ordered:</span>
            <span className="font-semibold text-[#10263D] text-right max-w-xs">
              {order.items?.map(i => `${i.title} (x${i.quantity})`).join(', ')}
            </span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-[#52677B]">Delivery Destination:</span>
            <span className="font-semibold text-[#10263D] text-right max-w-xs">
              {order.customer?.address}, {order.customer?.division}
            </span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-[#52677B]">Order Status:</span>
            <span className="font-semibold text-right text-slate-700">
              {order.status === 'demo_received' ? (
                <span className="px-2 py-0.5 rounded bg-[#EAF4FC] text-[#10263D] border border-[#DCE7F0] text-[11px] font-bold">
                  Demo Order Received
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px]">
                  {order.status}
                </span>
              )}
            </span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-[#52677B]">Payment Status:</span>
            <span className="font-bold text-right flex items-center gap-1">
              {isPaid ? (
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                  Paid &amp; Verified (TxID: {order.transactionId})
                </span>
              ) : isCod ? (
                <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                  Unpaid (Cash on Delivery demo)
                </span>
              ) : (
                <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                  Payment Pending
                </span>
              )}
            </span>
          </div>

          <div className="flex justify-between pt-2">
            <span className="text-[#52677B]">Subtotal:</span>
            <span className="font-medium text-[#10263D]">
              {currencySymbol}{order.subtotal?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-[#52677B]">Delivery Fee:</span>
            <span className="font-medium text-[#10263D]">
              {order.deliveryFee === 0 ? 'FREE' : `${currencySymbol}${order.deliveryFee}`}
            </span>
          </div>

          {latestTimeline && (
            <div className="flex justify-between pt-2">
              <span className="text-[#52677B]">Timeline Note:</span>
              <span className="font-medium text-[#52677B] text-right">
                {latestTimeline.note}
              </span>
            </div>
          )}

          <div className="flex justify-between pt-2 text-sm font-extrabold">
            <span className="text-[#10263D]">Total Amount:</span>
            <span className="text-[#145CFF]">
              {currencySymbol}{order.total?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenTracking(order.id);
            }}
            className="w-full sm:flex-1 py-3 px-4 rounded-full bg-[#145CFF] hover:bg-[#0D4BD9] text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all"
          >
            <Package size={15} />
            <span>{t.trackThisOrder}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-6 rounded-full bg-slate-100 hover:bg-slate-200 text-[#10263D] font-semibold text-xs transition-colors"
          >
            {t.continueShopping}
          </button>
        </div>
      </div>
    </div>
  );
}
