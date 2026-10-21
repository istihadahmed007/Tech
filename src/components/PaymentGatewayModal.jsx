import React, { useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  X, 
  ExternalLink 
} from 'lucide-react';

export default function PaymentGatewayModal({
  isOpen,
  sessionInfo,
  onClose,
  onPaymentSuccess,
  onPaymentFailure,
  currencySymbol = "৳"
}) {
  const closeButtonRef = useRef(null);

  // Use the verified session checkout URL returned by the backend for the current order
  const paymentUrl = sessionInfo?.redirectUrl || sessionInfo?.paymentLink || '';

  // Escape-to-close
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
      if (closeButtonRef.current) closeButtonRef.current.focus();
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !sessionInfo) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gateway-dialog-heading"
    >
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-2xl p-6 sm:p-7 bg-[#FFFFFF] border border-[#DCE8F3] shadow-2xl animate-fadeIn text-[#10263D]"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.20)'
        }}
      >
        {/* Header: Short Heading */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#145CFF] text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 shrink-0">
              <Lock size={19} />
            </div>
            <div>
              <h2 id="gateway-dialog-heading" className="font-extrabold text-base text-[#10263D] leading-tight">
                Secure Online Payment
              </h2>
              <p className="text-[11px] text-[#52677B] flex items-center gap-1">
                <ShieldCheck size={12} className="text-[#059669]" />
                <span>Authorized Merchant Gateway &bull; Tech Nest</span>
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            aria-label="Close payment modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Order Details: Actual Order ID and Payable Total */}
        <div className="p-3.5 rounded-xl bg-[#F0F8FF] border border-[#DCE8F3] mb-4 text-xs space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[#52677B] font-medium">Order Number:</span>
            <span className="font-mono font-bold text-[#145CFF]">{sessionInfo.orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#52677B] font-medium">Payable Total:</span>
            <span className="font-extrabold text-base text-[#10263D]">
              {currencySymbol}{sessionInfo.amount?.toLocaleString()} BDT
            </span>
          </div>
        </div>

        {/* Simple Payment Section */}
        <div className="p-4 rounded-xl bg-white border border-[#DCE8F3] mb-4 space-y-3">
          <div>
            <h3 className="font-bold text-sm text-[#10263D]">Secure Online Payment</h3>
            <p className="text-xs text-[#52677B] mt-1 leading-relaxed">
              Click the link below to complete your payment through our configured merchant gateway.
            </p>
          </div>

          {paymentUrl ? (
            <a
              href={paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-[#145CFF] hover:bg-[#0D4BD9] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors text-center cursor-pointer no-underline block"
              id="pay-now-link"
            >
              <span>Pay Now &rarr;</span>
              <ExternalLink size={15} />
            </a>
          ) : (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle size={16} className="shrink-0 text-red-600" />
              <span>Payment checkout URL is unavailable for this order. Please contact store support.</span>
            </div>
          )}
        </div>

        {/* Small Security Note */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#52677B] mb-4">
          <ShieldCheck size={13} className="text-[#059669] shrink-0" />
          <span>256-bit SSL encrypted &bull; Verified merchant gateway</span>
        </div>

        {/* Return to Store */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#10263D] font-bold text-xs transition-colors cursor-pointer text-center"
        >
          Return to Store
        </button>
      </div>
    </div>
  );
}
