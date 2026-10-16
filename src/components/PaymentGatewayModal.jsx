import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  X, 
  ExternalLink, 
  QrCode, 
  Copy, 
  Check, 
  CreditCard,
  Smartphone,
  Sparkles
} from 'lucide-react';

export const OFFICIAL_PAYMENTLY_URL = "https://vartualtutor.paymently.io/paymentlink/default/BDT";
export const OFFICIAL_QR_CODE_URL = "/payment-link-BDT-2026-09-11.svg";

export default function PaymentGatewayModal({
  isOpen,
  sessionInfo,
  onClose,
  onPaymentSuccess,
  onPaymentFailure,
  currencySymbol = "৳"
}) {
  const [activeTab, setActiveTab] = useState('gateway'); // 'gateway' | 'qr' | 'trxid' | 'simulate'
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // TrxID Form state
  const [trxId, setTrxId] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [trxError, setTrxError] = useState('');

  const closeButtonRef = useRef(null);
  const paymentUrl = sessionInfo?.paymentLink || sessionInfo?.redirectUrl || OFFICIAL_PAYMENTLY_URL;
  const qrUrl = sessionInfo?.qrCodeUrl || OFFICIAL_QR_CODE_URL;

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

    try {
      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: sessionInfo.orderId,
          trxId: trxId.trim(),
          senderPhone: senderPhone.trim() || undefined,
          provider: 'uddoktapay'
        })
      });

      const data = await res.json();
      if (res.ok && data.verified) {
        onPaymentSuccess(data.order);
      } else {
        setTrxError(data.error || 'Verification failed. Please check your TrxID.');
      }
    } catch (err) {
      setTrxError(err.message || 'Server verification failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimulatePayment = async (status = 'success') => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: sessionInfo.orderId,
          sessionId: sessionInfo.sessionId || `sim_${Date.now()}`,
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
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-7 bg-[#FFFFFF] border border-[#DCE7F0] shadow-2xl animate-fadeIn text-[#10263D]"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 60px -15px rgba(16, 38, 61, 0.20)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#DCE7F0] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#145CFF] text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 shrink-0">
              <Lock size={19} />
            </div>
            <div>
              <h2 id="gateway-dialog-heading" className="font-extrabold text-base text-[#10263D] leading-tight">
                Secure Online Payment
              </h2>
              <p className="text-[11px] text-[#52677B] flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-600" />
                <span>UddoktaPay & Paymently Verified Gateway</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              ref={closeButtonRef}
              onClick={onClose}
              disabled={isProcessing}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-50 transition-colors"
              aria-label="Close payment gateway"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="p-3.5 rounded-2xl bg-[#F0F7FF] border border-[#D0E4F7] mb-4 text-xs space-y-1.5">
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
          <div className="flex items-center gap-1.5 pt-1 text-[11px] text-[#52677B] border-t border-[#D0E4F7]/60">
            <span>Accepted:</span>
            <span className="font-semibold text-pink-700">bKash</span>
            <span>•</span>
            <span className="font-semibold text-orange-700">Nagad</span>
            <span>•</span>
            <span className="font-semibold text-purple-700">Rocket</span>
            <span>•</span>
            <span className="font-semibold text-blue-700">Cards</span>
          </div>
        </div>

        {/* Channel Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('gateway')}
            className={`py-2 px-1 rounded-lg text-center transition-all ${
              activeTab === 'gateway' ? 'bg-white text-[#145CFF] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Portal
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`py-2 px-1 rounded-lg text-center transition-all ${
              activeTab === 'qr' ? 'bg-white text-[#145CFF] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Scan QR
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('trxid')}
            className={`py-2 px-1 rounded-lg text-center transition-all ${
              activeTab === 'trxid' ? 'bg-white text-[#145CFF] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Submit TrxID
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('simulate')}
            className={`py-2 px-1 rounded-lg text-center transition-all ${
              activeTab === 'simulate' ? 'bg-white text-[#145CFF] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Test Mode
          </button>
        </div>

        {/* Tab 1: Paymently / UddoktaPay Portal */}
        {activeTab === 'gateway' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-white border border-[#DCE7F0] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#10263D]">
                <Smartphone size={16} className="text-[#145CFF]" />
                <span>Pay via Official Paymently Portal</span>
              </div>
              <p className="text-xs text-[#52677B] leading-relaxed">
                Click below to complete your payment on the secure Paymently / UddoktaPay portal using your bKash, Nagad, Rocket account or Bank Card.
              </p>

              <div className="flex gap-2">
                <a
                  href={paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#145CFF] hover:bg-[#0047E0] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <span>Open Payment Portal</span>
                  <ExternalLink size={14} />
                </a>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="py-3 px-3.5 rounded-xl border border-[#DCE7F0] bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  title="Copy payment link"
                >
                  {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <Sparkles size={15} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Already paid on the portal? Switch to the <strong>Submit TrxID</strong> tab above to enter your bKash/Nagad Transaction ID for instant invoice generation!
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Scan & Pay QR Code */}
        {activeTab === 'qr' && (
          <div className="space-y-4 animate-fadeIn text-center">
            <div className="p-4 rounded-2xl bg-white border border-[#DCE7F0] flex flex-col items-center">
              <div className="w-48 h-48 p-2.5 rounded-2xl bg-white border border-slate-200 shadow-inner flex items-center justify-center mb-3">
                <img
                  src={qrUrl}
                  alt="Virtual Tutor Paymently QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#10263D] mb-1">
                <QrCode size={15} className="text-[#145CFF]" />
                <span>Scan with bKash or Nagad App</span>
              </div>
              <p className="text-[11px] text-[#52677B] max-w-xs leading-relaxed">
                Open your bKash/Nagad app, select &ldquo;QR Payment&rdquo;, scan this code and pay <strong>{currencySymbol}{sessionInfo.amount?.toLocaleString()}</strong>.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('trxid')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#10263D] font-bold text-xs transition-colors"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE7F0] focus:border-[#145CFF] focus:ring-2 focus:ring-[#145CFF]/20 outline-none text-xs font-mono font-bold"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCE7F0] focus:border-[#145CFF] focus:ring-2 focus:ring-[#145CFF]/20 outline-none text-xs"
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
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-60"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Transaction...</span>
                </span>
              ) : (
                <>
                  <CheckCircle size={15} />
                  <span>Verify & Confirm Order</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Tab 4: Developer Test Mode Simulation */}
        {activeTab === 'simulate' && (
          <div className="space-y-3.5 animate-fadeIn">
            <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs space-y-1">
              <strong className="block font-bold">Developer Sandbox Mode</strong>
              <p className="text-[11px] leading-relaxed text-amber-800">
                Instantly simulate a completed or declined transaction to test order generation, invoice printing, and stock allocation without spending real money.
              </p>
            </div>

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => handleSimulatePayment('success')}
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Simulating server verification...</span>
                </span>
              ) : (
                <>
                  <CheckCircle size={16} />
                  <span>Simulate Instant Payment ({currencySymbol}{sessionInfo.amount?.toLocaleString()})</span>
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
        )}
      </div>
    </div>
  );
}
