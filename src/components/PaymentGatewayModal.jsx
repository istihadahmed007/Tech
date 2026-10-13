import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Lock, AlertTriangle, CheckCircle, XCircle, ArrowLeft, X } from 'lucide-react';

export default function PaymentGatewayModal({
  isOpen,
  sessionInfo,
  onClose,
  onPaymentSuccess,
  onPaymentFailure,
  currencySymbol = "৳"
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('bkash'); // 'bkash', 'nagad', 'card'
  const closeButtonRef = useRef(null);

  // Escape-to-close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isProcessing) {
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
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen || !sessionInfo) return null;

  const handleSimulatePayment = async (status = 'success') => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: sessionInfo.orderId,
          sessionId: sessionInfo.sessionId,
          status,
          provider: 'sandbox'
        })
      });

      const data = await res.json();
      if (res.ok && data.verified) {
        onPaymentSuccess(data.order);
      } else {
        onPaymentFailure(data.error || 'Payment was declined or cancelled');
      }
    } catch (err) {
      onPaymentFailure(err.message || 'Payment verification failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={!isProcessing ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gateway-dialog-heading"
    >
      <div 
        className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-[#FFFFFF] border border-[#DCE7F0] shadow-2xl animate-fadeIn text-[#10263D]"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 60px -15px rgba(16, 38, 61, 0.20)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#DCE7F0] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#145CFF] text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <Lock size={19} />
            </div>
            <div>
              <h2 id="gateway-dialog-heading" className="font-extrabold text-base text-[#10263D]">
                Hosted Payment Gateway
              </h2>
              <p className="text-[11px] text-[#52677B]">
                256-bit Encrypted Transaction
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
              Sandbox Test Mode
            </span>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              disabled={isProcessing}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-50"
              aria-label="Close payment gateway"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Notice Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs mb-5 flex items-start gap-2.5">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block font-bold">Developer Sandbox Environment</strong>
            <p className="text-[11px] leading-relaxed text-amber-800">
              Live merchant credentials are not configured in <code>.env</code>. This sandbox allows verifying genuine server HMAC signatures, stock allocation, and status transitions without real monetary transactions.
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="p-4 rounded-2xl bg-[#EAF4FC] border border-[#DCE7F0] mb-5 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-[#52677B]">Order Reference:</span>
            <span className="font-mono font-bold text-[#145CFF]">{sessionInfo.orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#52677B]">Payable Amount:</span>
            <span className="font-extrabold text-base text-[#10263D]">
              {currencySymbol}{sessionInfo.amount?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#52677B]">Currency:</span>
            <span className="font-semibold text-[#52677B]">BDT (Bangladeshi Taka)</span>
          </div>
        </div>

        {/* Test Channel Selection */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#10263D] mb-2.5">
            Select Test Payment Channel
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedMethod('bkash')}
              className={`p-3 rounded-xl border text-center transition-all ${
                selectedMethod === 'bkash'
                  ? 'border-pink-600 bg-pink-50 ring-2 ring-pink-500/20 font-bold text-pink-900'
                  : 'border-[#DCE7F0] bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="block text-xs">bKash</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('nagad')}
              className={`p-3 rounded-xl border text-center transition-all ${
                selectedMethod === 'nagad'
                  ? 'border-orange-600 bg-orange-50 ring-2 ring-orange-500/20 font-bold text-orange-900'
                  : 'border-[#DCE7F0] bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="block text-xs">Nagad</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedMethod('card')}
              className={`p-3 rounded-xl border text-center transition-all ${
                selectedMethod === 'card'
                  ? 'border-[#145CFF] bg-[#EAF4FC] ring-2 ring-[#145CFF]/20 font-bold text-[#10263D]'
                  : 'border-[#DCE7F0] bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span className="block text-xs">Visa / Card</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => handleSimulatePayment('success')}
            className="w-full py-3.5 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Simulating server verification...</span>
              </span>
            ) : (
              <>
                <CheckCircle size={16} />
                <span>Simulate Successful Payment ({currencySymbol}{sessionInfo.amount?.toLocaleString()})</span>
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleSimulatePayment('fail')}
              className="py-2.5 px-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <XCircle size={14} />
              <span>Simulate Decline</span>
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleSimulatePayment('cancel')}
              className="py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Simulate Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
