import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  Lock, 
  AlertCircle, 
  ArrowRight,
  Info,
  Tag,
  Check
} from 'lucide-react';
import { calculateOrderTotals } from '../utils/pricing';

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  cart, 
  currentUser,
  onOrderSuccess,
  onInitiateOnlinePayment,
  currencySymbol = "৳",
  t = {},
  lang = 'en'
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

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [onlineAvailable, setOnlineAvailable] = useState(false);
  const [activeGatewayName, setActiveGatewayName] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [idempotencyKey] = useState(() => 'idemp_' + Math.random().toString(36).substring(2, 15) + Date.now());

  // Auto-populate customer from logged in user profile
  useEffect(() => {
    if (currentUser) {
      const defaultAddr = currentUser.addresses?.[0];
      setCustomer({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        division: defaultAddr?.division || 'Dhaka',
        outsideCity: Boolean(defaultAddr?.outsideCity),
        address: defaultAddr?.address || '',
        notes: ''
      });
    }
  }, [currentUser]);

  // Fetch gateway configuration status
  useEffect(() => {
    fetch('/api/payment/config')
      .then(res => res.json())
      .then(data => {
        if (data.onlinePaymentAvailable) {
          setOnlineAvailable(true);
          setActiveGatewayName(data.activeProvider);
        } else {
          setOnlineAvailable(false);
          setActiveGatewayName(null);
          setPaymentMethod('cod');
        }
      })
      .catch(() => {
        setOnlineAvailable(false);
        setActiveGatewayName(null);
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

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) return;
    setErrorMessage('');

    try {
      const res = await fetch('/api/cart/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          promoCode: promoCodeInput.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.appliedPromo) {
        setAppliedPromo(data.appliedPromo);
        setPromoDiscount(data.discount || 0);
      } else {
        setErrorMessage('Invalid or expired promotion code');
        setAppliedPromo(null);
        setPromoDiscount(0);
      }
    } catch (e) {
      setErrorMessage('Failed to validate promotion code');
    }
  };

  if (!isOpen) return null;

  // Single shared pricing calculation
  const rawTotals = calculateOrderTotals(cart, {
    division: customer.division,
    outsideCity: customer.outsideCity
  });

  const finalSubtotal = Math.max(0, rawTotals.subtotal - promoDiscount);
  const deliveryFee = rawTotals.deliveryFee;
  const grandTotal = finalSubtotal + deliveryFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Input validation
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
      setErrorMessage('Online payment is currently unavailable. Please select Cash on Delivery.');
      return;
    }

    setIsSubmitting(true);

    const token = localStorage.getItem('accessories_customer_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers,
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
          promoCode: appliedPromo?.code || null,
          paymentMethod
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Server order creation failed');
      }

      const createdOrder = data.order;
      const guestToken = data.guestToken;

      if (paymentMethod === 'cod') {
        onOrderSuccess(createdOrder, guestToken);
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
            <div className="w-10 h-10 rounded-2xl bg-[#EAF4FC] flex items-center justify-center text-[#145CFF] font-bold">
              <Lock size={19} />
            </div>
            <div>
              <h2 id="checkout-modal-title" className="text-lg sm:text-xl font-bold text-[#10263D]">
                {t?.checkoutTitle || 'Store Checkout'}
              </h2>
              <p className="text-xs text-[#52677B]">
                {currentUser ? `Signed in as ${currentUser.name}` : (t?.guestNotice || 'Guest Checkout — No account required')}
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
          {/* Customer Details Form */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#10263D]">
              1. Delivery Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#10263D] mb-1.5">
                  {t?.fullName || 'Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="e.g. Rahim Chowdhury"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="input-field text-xs py-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#10263D] mb-1.5">
                  {t?.phone || 'Phone Number'} *
                </label>
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="01XXXXXXXXX"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="input-field text-xs font-mono py-2.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#10263D] mb-1.5">
                  {t?.division || 'Division / Region'}
                </label>
                <select
                  value={customer.division}
                  onChange={(e) => setCustomer({ ...customer, division: e.target.value })}
                  className="input-field text-xs py-2.5"
                >
                  <option value="Dhaka">Dhaka (৳60 delivery)</option>
                  <option value="Chittagong">Chittagong (৳120 delivery)</option>
                  <option value="Sylhet">Sylhet (৳120 delivery)</option>
                  <option value="Rajshahi">Rajshahi (৳120 delivery)</option>
                  <option value="Khulna">Khulna (৳120 delivery)</option>
                  <option value="Barisal">Barisal (৳120 delivery)</option>
                  <option value="Rangpur">Rangpur (৳120 delivery)</option>
                  <option value="Mymensingh">Mymensingh (৳120 delivery)</option>
                </select>
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#52677B]">
                  <input
                    type="checkbox"
                    checked={customer.outsideCity}
                    onChange={(e) => setCustomer({ ...customer, outsideCity: e.target.checked })}
                    className="w-4 h-4 rounded text-[#145CFF] focus:ring-[#145CFF]"
                  />
                  <span>Suburban / Outside main city center (+৳60)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#10263D] mb-1.5">
                {t?.address || 'Detailed Street Address'} *
              </label>
              <textarea
                required
                rows={2}
                placeholder="House number, road number, area, landmarks"
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                className="input-field text-xs py-2"
              />
            </div>
          </div>

          {/* Promotion Code Bar */}
          <div className="pt-2 border-t border-[#DCE7F0]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#10263D] mb-2">
              Discount Code / Coupon
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code (e.g. GLACIAL10)"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value)}
                className="input-field text-xs font-mono py-2 flex-1 uppercase"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-4 py-2 rounded-xl bg-[#EAF4FC] text-[#145CFF] font-semibold text-xs hover:bg-[#145CFF] hover:text-white transition-colors"
              >
                Apply
              </button>
            </div>
            {appliedPromo && (
              <p className="text-xs text-emerald-700 flex items-center gap-1 font-medium mt-1.5">
                <Check size={13} />
                <span>Coupon applied: {appliedPromo.title} (-৳{promoDiscount})</span>
              </p>
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3 pt-2 border-t border-[#DCE7F0]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#10263D]">
              2. Select Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Cash on Delivery Option */}
              <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                paymentMethod === 'cod' ? 'border-[#145CFF] bg-[#EAF4FC]' : 'border-[#DCE7F0] bg-white hover:border-slate-300'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Truck size={18} className="text-[#145CFF]" />
                    <span className="font-bold text-xs text-[#10263D]">Cash on Delivery</span>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="text-[#145CFF]"
                  />
                </div>
                <p className="text-[11px] text-[#52677B]">
                  Pay in cash when your parcel is delivered to your doorstep.
                </p>
              </label>

              {/* Online Payment Option */}
              <label className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                !onlineAvailable ? 'opacity-60 bg-slate-50 border-slate-200 cursor-not-allowed' :
                paymentMethod === 'online' ? 'border-[#145CFF] bg-[#EAF4FC] cursor-pointer' :
                'border-[#DCE7F0] bg-white hover:border-slate-300 cursor-pointer'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard size={18} className="text-[#145CFF]" />
                    <span className="font-bold text-xs text-[#10263D]">
                      Online Payment (bKash / Card)
                    </span>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    disabled={!onlineAvailable}
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="text-[#145CFF]"
                  />
                </div>
                <p className="text-[11px] text-[#52677B]">
                  {onlineAvailable ? (
                    `Direct gateway via ${activeGatewayName || 'SSLCommerz/bKash'}`
                  ) : (
                    'Currently unavailable (Merchant credentials required in .env)'
                  )}
                </p>
              </label>
            </div>
          </div>

          {/* Pricing Totals Card */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#DCE7F0] space-y-2 text-xs">
            <div className="flex justify-between text-[#52677B]">
              <span>Subtotal:</span>
              <span className="font-bold text-[#10263D]">{currencySymbol}{rawTotals.subtotal.toLocaleString()}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Promotion Discount:</span>
                <span>-{currencySymbol}{promoDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-[#52677B]">
              <span>Delivery Fee ({customer.division}):</span>
              <span>{rawTotals.isFreeDelivery ? <strong className="text-emerald-600">FREE</strong> : `${currencySymbol}${deliveryFee}`}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold">
              <span className="text-sm text-[#10263D]">Total Payable:</span>
              <span className="text-xl text-[#145CFF] font-extrabold">{currencySymbol}{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-full bg-[#145CFF] hover:bg-[#0D4BD9] text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {paymentMethod === 'cod' ? 'Place Order — Cash on Delivery' : 'Proceed to Payment Gateway'}
                </span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
