import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  Lock, 
  AlertCircle, 
  ArrowRight,
  Info
} from 'lucide-react';
import { calculateOrderTotals } from '../utils/pricing';

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  cart, 
  onOrderSuccess,
  onInitiateOnlinePayment,
  currencySymbol = "৳",
  t,
  lang 
}) {
  const closeButtonRef = useRef(null);

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    division: 'Dhaka',
    outsideCity: false,
    address: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod'); // Default to COD demo mode
  const [onlineAvailable, setOnlineAvailable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [idempotencyKey] = useState(() => 'idemp_' + Math.random().toString(36).substring(2, 15) + Date.now());

  // Fetch gateway configuration status
  useEffect(() => {
    fetch('/api/payment/config')
      .then(res => res.json())
      .then(data => {
        if (data.onlinePaymentAvailable) {
          setOnlineAvailable(true);
        } else {
          setOnlineAvailable(false);
          setPaymentMethod('cod');
        }
      })
      .catch(() => {
        setOnlineAvailable(false);
        setPaymentMethod('cod');
      });
  }, []);

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

  if (!isOpen) return null;

  // Single shared pricing calculation
  const { subtotal, deliveryFee, total, isFreeDelivery } = calculateOrderTotals(cart, {
    division: customer.division,
    outsideCity: customer.outsideCity
  });

  const isInsideDhaka = customer.division === 'Dhaka' && !customer.outsideCity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Client-side input validation
    if (!customer.name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    const cleanPhone = customer.phone.replace(/[\s-]/g, '');
    if (!cleanPhone.match(/^(?:\+88|88)?01[3-9]\d{8}$/)) {
      setErrorMessage('Please provide a valid Bangladeshi mobile number (e.g. 01712345678)');
      return;
    }
    if (!customer.address.trim()) {
      setErrorMessage('Please enter your full street delivery address');
      return;
    }

    if (paymentMethod === 'online' && !onlineAvailable) {
      setErrorMessage('Online payment is currently unavailable. Please select Cash on Delivery (Demo Mode).');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit order to server backend for canonical price calculation & validation
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
            quantity: i.quantity,
            variant: i.variant?.name || 'Default'
          })),
          paymentMethod
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Server order creation failed');
      }

      const createdOrder = data.order;

      if (paymentMethod === 'cod') {
        // Cash on delivery: recorded as demo order with unpaid status
        onOrderSuccess(createdOrder);
        onClose();
      } else {
        // Online payment: initiate gateway session
        const initRes = await fetch('/api/payment/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: createdOrder.id
          })
        });

        const initData = await initRes.json();
        if (!initRes.ok || !initData.success) {
          throw new Error(initData.error || 'Failed to initiate payment session');
        }

        onClose();
        onInitiateOnlinePayment(createdOrder, initData);
      }
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during order submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-[#FFFFFF] border border-[#DCE7F0] shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 60px -15px rgba(16, 38, 61, 0.20)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#DCE7F0] mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#EAF4FC] flex items-center justify-center text-[#145CFF] font-bold">
              <Lock size={19} />
            </div>
            <div>
              <h2 id="checkout-modal-title" className="text-lg sm:text-xl font-bold text-[#10263D]">
                {t.checkoutTitle}
              </h2>
              <p className="text-xs text-[#52677B]">
                {t.guestNotice}
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-[#52677B] hover:text-[#10263D] transition-colors focus-visible:ring-2 focus-visible:ring-[#145CFF]"
            aria-label="Close checkout"
          >
            <X size={20} />
          </button>
        </div>

        {errorMessage && (
          <div 
            className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Customer Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#10263D] mb-3">
              1. Customer Information & Delivery Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="customer-name" className="block text-xs font-semibold text-[#10263D] mb-1">
                  {t.fullName} *
                </label>
                <input
                  id="customer-name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="e.g. Tanvir Ahmed"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label htmlFor="customer-phone" className="block text-xs font-semibold text-[#10263D] mb-1">
                  {t.phone} *
                </label>
                <input
                  id="customer-phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="01712345678"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label htmlFor="customer-division" className="block text-xs font-semibold text-[#10263D] mb-1">
                  {t.division}
                </label>
                <select
                  id="customer-division"
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
                  className="rounded text-[#145CFF] focus:ring-[#145CFF] h-4 w-4"
                />
                <label htmlFor="outsideCity" className="text-xs text-[#52677B] cursor-pointer">
                  Suburbs / Outside city center area
                </label>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="customer-address" className="block text-xs font-semibold text-[#10263D] mb-1">
                  {t.address} *
                </label>
                <textarea
                  id="customer-address"
                  required
                  autoComplete="street-address"
                  rows={2}
                  placeholder="House #, Road #, Sector / Area, Postcode"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className="input-field text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method Selection */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#10263D] mb-3">
              2. {t.paymentMethod}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: Cash on Delivery (Demo Mode) */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#145CFF] bg-[#EAF4FC] ring-2 ring-[#145CFF]/20'
                    : 'border-[#DCE7F0] bg-white hover:bg-[#EAF4FC]'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="pay-cod"
                      name="payment_choice"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-[#145CFF]"
                    />
                    <label htmlFor="pay-cod" className="font-bold text-xs sm:text-sm text-[#10263D] cursor-pointer">
                      Cash on Delivery
                    </label>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Demo Mode
                  </span>
                </div>
                <p className="text-[11px] text-[#52677B] pl-5">
                  Place a demo order without paying online. Recorded in demo database with unpaid status for testing.
                </p>
              </div>

              {/* Option B: Online Gateway (Unavailable if credentials unconfigured) */}
              <div
                onClick={() => {
                  if (onlineAvailable) setPaymentMethod('online');
                }}
                className={`p-4 rounded-2xl border transition-all ${
                  onlineAvailable
                    ? (paymentMethod === 'online'
                        ? 'border-[#145CFF] bg-[#EAF4FC] ring-2 ring-[#145CFF]/20 cursor-pointer'
                        : 'border-[#DCE7F0] bg-white hover:bg-[#EAF4FC] cursor-pointer')
                    : 'border-[#DCE7F0] bg-slate-50/90 opacity-75 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="pay-online"
                      name="payment_choice"
                      disabled={!onlineAvailable}
                      checked={paymentMethod === 'online'}
                      onChange={() => {
                        if (onlineAvailable) setPaymentMethod('online');
                      }}
                      className="text-[#145CFF] disabled:opacity-40"
                    />
                    <label 
                      htmlFor="pay-online" 
                      className={`font-bold text-xs sm:text-sm ${onlineAvailable ? 'text-[#10263D] cursor-pointer' : 'text-[#52677B] cursor-not-allowed'}`}
                    >
                      Online Payment Gateway
                    </label>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${onlineAvailable ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                    {onlineAvailable ? 'Active' : 'Unavailable'}
                  </span>
                </div>
                <p className="text-[11px] text-[#52677B] pl-5">
                  {onlineAvailable 
                    ? 'Redirects to official payment gateway (bKash / Nagad / Cards).'
                    : 'Online payments are currently unavailable because payment gateway credentials have not been configured by the store owner.'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Pricing Summary */}
          <div className="p-4 rounded-2xl bg-[#EAF4FC] border border-[#DCE7F0] space-y-2 text-xs">
            <div className="flex justify-between text-[#52677B]">
              <span>Subtotal ({cart.length} items):</span>
              <span className="font-semibold text-[#10263D]">{currencySymbol}{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#52677B]">
              <span>Delivery Fee ({isInsideDhaka ? 'Inside Dhaka' : 'Outside Dhaka'}):</span>
              <span className="font-semibold text-[#10263D]">
                {isFreeDelivery ? (
                  <strong className="text-emerald-700">FREE (Orders &gt;= ৳2,000)</strong>
                ) : (
                  `${currencySymbol}${deliveryFee}`
                )}
              </span>
            </div>
            <div className="pt-2 border-t border-[#DCE7F0] flex justify-between text-sm font-extrabold text-[#10263D]">
              <span>Total Payable Amount:</span>
              <span className="text-[#145CFF] text-base">{currencySymbol}{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-full bg-[#145CFF] hover:bg-[#0D4BD9] active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Recording Demo Order...</span>
              </span>
            ) : paymentMethod === 'online' ? (
              <>
                <CreditCard size={18} />
                <span>Proceed to Payment ({currencySymbol}{total.toLocaleString()})</span>
                <ArrowRight size={16} />
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>Place Demo Order — Cash on Delivery ({currencySymbol}{total.toLocaleString()})</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
