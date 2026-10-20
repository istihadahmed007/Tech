import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  ExternalLink, 
  QrCode, 
  Copy, 
  Check, 
  Smartphone,
  Clock
} from 'lucide-react';

import { safeFetchJson } from '../utils/api';

export default function PaymentGatewayModal({
  isOpen,
  sessionInfo,
  onClose,
  onPaymentSuccess,
  onPaymentFailure,
  currencySymbol = "৳"
}) {
  const [activeTab, setActiveTab] = useState('gateway'); // 'gateway' | 'qr' | 'trxid'
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // TrxID Form state
  const [trxId, setTrxId] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [trxError, setTrxError] = useState('');
  const [pendingNotice, setPendingNotice] = useState(null);

  const closeButtonRef = useRef(null);
  const paymentUrl = sessionInfo?.paymentLink || sessionInfo?.redirectUrl || '';
  const qrUrl = sessionInfo?.qrCodeUrl || '';

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

  const handleCopyLink = () => {
    if (!paymentUrl) return;
    navigator.clipboard.writeText(paymentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleVerifyTrxId = async (e) => {
    e?.preventDefault();
    if (!trxId || trxId.trim().length < 6) {
      setTrxError('Please enter a valid Transaction ID (minimum 6 characters).');
      return;
    }
    setTrxError('');
    setIsProcessing(true);
    setPendingNotice(null);

    try {
      const res = await safeFetchJson('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: sessionInfo.orderId,
          trxId: trxId.trim(),
          senderPhone: senderPhone.trim() || undefined
        })
      });

      if (res.ok && res.data?.verified) {
        onPaymentSuccess(res.data.order);
      } else if (res.ok && res.data?.pendingVerification) {
        setPendingNotice({
          trxId: trxId.trim(),
          orderId: sessionInfo.orderId,
          message: res.data.message || 'Transaction reference recorded. Awaiting merchant confirmation.'
        });
      } else {
        setTrxError(res.error || 'Verification failed. Please check your Transaction ID and try again.');
      }
    } catch (err) {
      setTrxError(err.message || 'Payment verification failed. Please check your connection.');
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
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-7 bg-[#FFFFFF] border border-[#DCE8F3] shadow-2xl animate-fadeIn text-[#10263D]"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.20)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#1684E8] text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 shrink-0">
              <Lock size={19} />
            </div>
            <div>
              <h2 id="gateway-dialog-heading" className="font-extrabold text-base text-[#10263D] leading-tight">
                Secure Online Payment
              </h2>
              <p className="text-[11px] text-[#526981] flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-600" />
                <span>Authorized Merchant Gateway — Tech Nest</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              ref={closeButtonRef}
              onClick={onClose}
              disabled={isProcessing}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-50 transition-colors cursor-pointer"
              aria-label="Close payment gateway"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="p-3.5 rounded-xl bg-[#EBF5FF] border border-[#DCE8F3] mb-4 text-xs space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[#526981] font-medium">Order Number:</span>
            <span className="font-mono font-bold text-[#1684E8]">{sessionInfo.orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#526981] font-medium">Payable Total:</span>
            <span className="font-extrabold text-base text-[#10263D]">
              {currencySymbol}{sessionInfo.amount?.toLocaleString()} BDT
            </span>
          </div>
          <div className="flex items-center gap-1.5 pt-1 text-[11px] text-[#526981] border-t border-[#DCE8F3]/60">
            <span>Accepted Methods:</span>
            <span className="font-semibold text-pink-700">bKash</span>
            <span>•</span>
            <span className="font-semibold text-orange-700">Nagad</span>
            <span>•</span>
            <span className="font-semibold text-purple-700">Rocket</span>
            <span>•</span>
            <span className="font-semibold text-blue-700">Cards</span>
          </div>
        </div>

        {/* Pending Verification Notice State */}
        {pendingNotice ? (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
              <Clock size={18} className="text-[#1684E8]" />
              <span>Payment Reference Submitted</span>
            </div>
            <p className="text-[#526981] leading-relaxed text-[11px]">
              {pendingNotice.message}
            </p>
            <div className="p-3 rounded-lg bg-white border border-blue-100 font-mono text-[11px] space-y-1">
              <div>Order ID: <span className="font-bold text-[#10263D]">{pendingNotice.orderId}</span></div>
              <div>Transaction ID: <span className="font-bold text-[#1684E8]">{pendingNotice.trxId}</span></div>
            </div>
            <p className="text-[11px] text-[#526981]">
              Your order has been recorded and will be verified by Tech Nest dispatch staff. You will receive an SMS confirmation once payment is cleared.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1684E8] text-white font-bold text-xs hover:bg-[#1170C7] transition-colors cursor-pointer"
            >
              Close &amp; Return to Store
            </button>
          </div>
        ) : (
          <>
            {/* Channel Navigation Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('gateway')}
                className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer ${
                  activeTab === 'gateway' ? 'bg-white text-[#1684E8] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Payment Portal
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('qr')}
                className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer ${
                  activeTab === 'qr' ? 'bg-white text-[#1684E8] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Scan QR
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('trxid')}
                className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer ${
                  activeTab === 'trxid' ? 'bg-white text-[#1684E8] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Submit TrxID
              </button>
            </div>

            {/* Tab 1: Direct Merchant Portal */}
            {activeTab === 'gateway' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-xl bg-white border border-[#DCE8F3] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#10263D]">
                    <Smartphone size={16} className="text-[#1684E8]" />
                    <span>Pay via Authorized Checkout</span>
                  </div>
                  <p className="text-xs text-[#526981] leading-relaxed">
                    Click below to open the checkout gateway and complete your payment securely via bKash, Nagad, Rocket, or Card.
                  </p>

                  {paymentUrl ? (
                    <div className="flex gap-2">
                      <a
                        href={paymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 px-4 rounded-xl bg-[#1684E8] hover:bg-[#1170C7] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                      >
                        <span>Open Gateway Checkout</span>
                        <ExternalLink size={14} />
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="py-3 px-3.5 rounded-xl border border-[#DCE8F3] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        title="Copy payment link"
                      >
                        {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                      Payment checkout URL not provided. Please switch to the Submit TrxID tab or choose Cash on Delivery.
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
                  <Clock size={15} className="text-[#1684E8] shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    Completed payment in your banking app? Switch to <strong>Submit TrxID</strong> to record your transaction reference.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Scan & Pay QR Code */}
            {activeTab === 'qr' && (
              <div className="space-y-4 animate-fadeIn text-center">
                <div className="p-4 rounded-xl bg-white border border-[#DCE8F3] flex flex-col items-center">
                  {qrUrl ? (
                    <div className="w-48 h-48 p-2.5 rounded-xl bg-white border border-slate-200 shadow-inner flex items-center justify-center mb-3">
                      <img
                        src={qrUrl}
                        alt="Tech Nest Payment QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-48 h-48 rounded-xl bg-slate-50 border border-dashed border-slate-300 flex flex-col items-center justify-center mb-3 text-slate-400 p-4">
                      <QrCode size={36} className="mb-2 text-slate-300" />
                      <span className="text-[11px]">QR Code payment not configured</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#10263D] mb-1">
                    <QrCode size={15} className="text-[#1684E8]" />
                    <span>Scan with Mobile Banking App</span>
                  </div>
                  <p className="text-[11px] text-[#526981] max-w-xs leading-relaxed">
                    Open your bKash or Nagad app, scan QR and pay <strong>{currencySymbol}{sessionInfo.amount?.toLocaleString()} BDT</strong>.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('trxid')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#10263D] font-bold text-xs transition-colors cursor-pointer"
                >
                  I have paid — Enter TrxID
                </button>
              </div>
            )}

            {/* Tab 3: Submit Manual TrxID */}
            {activeTab === 'trxid' && (
              <form onSubmit={handleVerifyTrxId} className="space-y-3.5 animate-fadeIn">
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-xs font-bold text-[#10263D] mb-1">
                      Transaction ID (TrxID) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BK72918349 or 10-character TrxID"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F3] focus:border-[#1684E8] focus:ring-2 focus:ring-[#1684E8]/20 outline-none text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#10263D] mb-1">
                      Sender Mobile Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 017XXXXXXXX"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE8F3] focus:border-[#1684E8] focus:ring-2 focus:ring-[#1684E8]/20 outline-none text-xs"
                    />
                  </div>
                </div>

                {trxError && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
                    <AlertTriangle size={14} className="shrink-0" />
                    <span>{trxError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#1684E8] hover:bg-[#1170C7] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Reference...</span>
                    </span>
                  ) : (
                    <>
                      <CheckCircle size={15} />
                      <span>Submit Payment Reference</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
