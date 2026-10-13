import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, Truck, Package, Copy, ArrowRight, ShieldCheck } from 'lucide-react';

export default function OrderConfirmationModal({ 
  order, 
  onClose, 
  onOpenTracking, 
  currencySymbol = "৳",
  t,
  lang 
}) {
  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#60A5FA', '#93C5FD', '#10B981']
      });
    } catch (e) {
      // Ignored if confetti unavailable
    }
  }, []);

  if (!order) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-white/95 backdrop-blur-2xl border border-blue-200/80 shadow-2xl text-center animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4 shadow-sm">
          <CheckCircle size={36} className="stroke-[2.5]" />
        </div>

        <h2 className="text-2xl font-extrabold text-[#112A43] mb-1">
          {t.orderConfirmedTitle}
        </h2>
        <p className="text-xs sm:text-sm text-[#4B637B] mb-6">
          Thank you, <strong>{order.customer?.name}</strong>. Your accessories are reserved in our Dhaka fulfillment hub.
        </p>

        {/* Order Reference Box */}
        <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 mb-6 text-left flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-[#4B637B] block">
              {t.orderIdLabel}
            </span>
            <span className="font-mono text-lg font-extrabold text-blue-700">
              {order.id}
            </span>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(order.id)}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-blue-600 hover:bg-blue-50"
            title="Copy Order ID"
          >
            <Copy size={13} />
            <span>Copy ID</span>
          </button>
        </div>

        {/* Order Summary Details */}
        <div className="text-left divide-y divide-slate-100 border border-slate-200/70 rounded-2xl p-4 bg-white mb-6 text-xs space-y-2.5">
          <div className="flex justify-between pt-1">
            <span className="text-[#4B637B]">Items Ordered:</span>
            <span className="font-semibold text-[#112A43]">
              {order.items?.map(i => `${i.title} (x${i.quantity})`).join(', ')}
            </span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-[#4B637B]">Delivery Address:</span>
            <span className="font-semibold text-[#112A43] text-right max-w-xs">
              {order.customer?.address}, {order.customer?.division}
            </span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="text-[#4B637B]">Payment Method:</span>
            <span className="font-semibold text-blue-600 uppercase">
              {order.paymentMethod} {order.transactionId ? `(TrxID: ${order.transactionId})` : ''}
            </span>
          </div>
          <div className="flex justify-between pt-2 text-sm font-bold">
            <span className="text-[#112A43]">Total Amount:</span>
            <span className="text-blue-600">
              {currencySymbol}{order.total?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Next Steps Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenTracking(order.id);
            }}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
          >
            <Package size={15} />
            <span>{t.trackThisOrder}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#112A43] font-semibold text-xs"
          >
            {t.continueShopping}
          </button>
        </div>
      </div>
    </div>
  );
}
