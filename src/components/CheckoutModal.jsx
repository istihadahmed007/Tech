import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Truck, 
  Lock, 
  AlertCircle, 
  CheckCircle,
  Copy,
  Sparkles
} from 'lucide-react';

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  cart, 
  onOrderSuccess,
  currencySymbol = "৳",
  t,
  lang 
}) {
  if (!isOpen) return null;

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    division: 'Dhaka',
    outsideCity: false,
    address: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'bkash', 'nagad', 'card', 'cod'
  const [transactionId, setTransactionId] = useState('');
  const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvv: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [idempotencyKey] = useState(() => 'idemp_' + Math.random().toString(36).substring(2, 15) + Date.now());
  const [copiedNumber, setCopiedNumber] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const isFreeDelivery = subtotal >= 2000;
  const isInsideDhaka = customer.division === 'Dhaka' && !customer.outsideCity;
  const deliveryFee = isFreeDelivery ? 0 : (isInsideDhaka ? 60 : 120);
  const total = subtotal + deliveryFee;

  const handleCopyNumber = (num) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Client-side quick checks
    if (!customer.name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    const cleanPhone = customer.phone.replace(/[\s-]/g, '');
    if (!cleanPhone.match(/^(?:\+88|88)?01[3-9]\d{8}$/)) {
      setErrorMessage('Please provide a valid Bangladeshi phone number (e.g. 01712345678)');
      return;
    }
    if (!customer.address.trim()) {
      setErrorMessage('Please enter your full delivery street address');
      return;
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !transactionId.trim()) {
      setErrorMessage(`Please enter your ${paymentMethod.toUpperCase()} Transaction ID (TrxID) or click Simulate`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Send to server backend with idempotency key
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idempotencyKey,
          customer: {
            ...customer,
            phone: cleanPhone
          },
          items: cart.map(i => ({
            id: i.id,
            title: i.title,
            price: i.price,
            quantity: i.quantity,
            variant: i.variant?.name || 'Default'
          })),
          subtotal,
          deliveryFee,
          total,
          paymentMethod,
          transactionId: transactionId.trim() || null
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Server validation failed');
      }

      // If online payment, perform server verification
      if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && transactionId.trim()) {
        await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gateway: paymentMethod,
            transactionId: transactionId.trim(),
            orderId: data.order.id
          })
        });
      }

      // Order genuinely saved in backend!
      onOrderSuccess(data.order);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during order processing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-white/95 backdrop-blur-2xl border border-blue-200/80 shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 60px -15px rgba(17, 42, 67, 0.25)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-blue-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              <Lock size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#112A43]">
                {t.checkoutTitle}
              </h2>
              <p className="text-xs text-[#4B637B]">
                {t.guestNotice}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
            aria-label="Close checkout"
          >
            <X size={20} />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Customer Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#112A43] mb-3 flex items-center gap-1.5">
              <span>1. Customer & Shipping Destination</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#112A43] mb-1">
                  {t.fullName} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#112A43] mb-1">
                  {t.phone} *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="01712345678"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#112A43] mb-1">
                  {t.division}
                </label>
                <select
                  value={customer.division}
                  onChange={(e) => setCustomer({ ...customer, division: e.target.value })}
                  className="input-field text-sm"
                >
                  <option value="Dhaka">Dhaka (ঢাকা)</option>
                  <option value="Chittagong">Chittagong (চট্টগ্রাম)</option>
                  <option value="Sylhet">Sylhet (সিলেট)</option>
                  <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                  <option value="Khulna">Khulna (খুলনা)</option>
                  <option value="Barishal">Barishal (বরিশাল)</option>
                  <option value="Rangpur">Rangpur (রংপুর)</option>
                  <option value="Mymensingh">Mymensingh (ময়মনসিংহ)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="outsideCity"
                  checked={customer.outsideCity}
                  onChange={(e) => setCustomer({ ...customer, outsideCity: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <label htmlFor="outsideCity" className="text-xs text-[#4B637B] cursor-pointer">
                  Suburbs / Outside city center area
                </label>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#112A43] mb-1">
                  {t.address} *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="House #, Road #, Sector / Area, Postcode"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className="input-field text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#112A43] mb-3">
              2. {t.paymentMethod}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
              {/* COD */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'cod' 
                    ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 text-blue-900 font-bold' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Truck size={20} className="mx-auto mb-1 text-slate-600" />
                <span className="text-xs block">Cash on Delivery</span>
              </button>

              {/* bKash */}
              <button
                type="button"
                onClick={() => setPaymentMethod('bkash')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'bkash' 
                    ? 'border-pink-600 bg-pink-50/80 ring-2 ring-pink-500/20 text-pink-900 font-bold' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="w-5 h-5 mx-auto mb-1 rounded bg-[#E2136E] text-white text-[10px] font-bold flex items-center justify-center">
                  b
                </div>
                <span className="text-xs block">bKash</span>
              </button>

              {/* Nagad */}
              <button
                type="button"
                onClick={() => setPaymentMethod('nagad')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'nagad' 
                    ? 'border-orange-600 bg-orange-50/80 ring-2 ring-orange-500/20 text-orange-900 font-bold' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="w-5 h-5 mx-auto mb-1 rounded bg-[#F7941D] text-white text-[10px] font-bold flex items-center justify-center">
                  ন
                </div>
                <span className="text-xs block">Nagad</span>
              </button>

              {/* Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'card' 
                    ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 text-blue-900 font-bold' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <CreditCard size={20} className="mx-auto mb-1 text-blue-600" />
                <span className="text-xs block">Debit / Card</span>
              </button>
            </div>

            {/* Sub-panels for Online Payments */}
            {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#112A43]">
                    Merchant Wallet Number:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <code className="bg-white px-2 py-0.5 rounded border border-slate-300 font-mono font-bold text-blue-700">
                      01700-000000
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopyNumber('01700000000')}
                      className="text-blue-600 hover:text-blue-800"
                      title="Copy number"
                    >
                      <Copy size={14} />
                    </button>
                    {copiedNumber && <span className="text-[10px] text-emerald-600">Copied!</span>}
                  </div>
                </div>

                <p className="text-[#4B637B]">
                  Send <strong>{currencySymbol}{total.toLocaleString()}</strong> via {paymentMethod === 'bkash' ? 'bKash Send Money / Payment' : 'Nagad Payment'}, then enter the TrxID below:
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 9J29X4LA7"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                    className="input-field text-xs font-mono py-2"
                  />
                  <button
                    type="button"
                    onClick={() => setTransactionId('MOCK_' + Math.random().toString(36).substring(2, 8).toUpperCase())}
                    className="px-3 py-2 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold text-xs whitespace-nowrap"
                  >
                    Auto-Simulate TrxID
                  </button>
                </div>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                <p className="text-[#4B637B]">
                  Enter test or sandbox card details (Visa, Mastercard, AMEX):
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Card Number (4242 4242 ...)"
                    value={cardInfo.number}
                    onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                    className="col-span-2 input-field text-xs py-2"
                  />
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardInfo.expiry}
                    onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                    className="input-field text-xs py-2"
                  />
                  <input
                    type="text"
                    placeholder="CVC / CVV"
                    value={cardInfo.cvv}
                    onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                    className="input-field text-xs py-2"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Summary & Order Button */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/60 space-y-2 text-xs">
            <div className="flex justify-between text-[#4B637B]">
              <span>Subtotal ({cart.length} items):</span>
              <span className="font-semibold text-[#112A43]">{currencySymbol}{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#4B637B]">
              <span>Delivery Charge ({isInsideDhaka ? 'Inside Dhaka' : 'Outside Dhaka'}):</span>
              <span className="font-semibold text-[#112A43]">
                {deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `${currencySymbol}${deliveryFee}`}
              </span>
            </div>
            <div className="pt-2 border-t border-blue-200 flex justify-between text-sm font-extrabold text-[#112A43]">
              <span>Total Payable Amount:</span>
              <span className="text-blue-600 text-base">{currencySymbol}{total.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying and placing order...</span>
              </span>
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>{t.placeOrder} ({currencySymbol}{total.toLocaleString()})</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
