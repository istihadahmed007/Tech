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
  Check,
  CheckCircle2,
  Phone,
  MapPin,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { calculateOrderTotals, FREE_SHIPPING_THRESHOLD } from '../utils/pricing';
import { safeFetchJson } from '../utils/api';

export const OFFICIAL_PAYMENTLY_URL = "https://vartualtutor.paymently.io/paymentlink/default/BDT";
export const OFFICIAL_QR_CODE_URL = "/payment-link-BDT-2026-09-11.svg";

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
    instructions: ''
  });

  // Default to online payment (Paymently: bKash/Nagad/Cards) as recommended Amazon flow
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' | 'cod'
  const [onlineAvailable, setOnlineAvailable] = useState(true);
  const [activeGatewayName, setActiveGatewayName] = useState('paymently');
  const [isSandboxMode, setIsSandboxMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Promo code state
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoSuccessMsg, setPromoSuccessMsg] = useState('');
  const [showPromoBox, setShowPromoBox] = useState(false);

  const [idempotencyKey] = useState(() => 'idemp_' + Math.random().toString(36).substring(2, 15) + Date.now());

  // Auto-populate customer from logged-in user profile
  useEffect(() => {
    if (currentUser) {
      const defaultAddr = currentUser.addresses?.[0];
      setCustomer({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        division: defaultAddr?.division || 'Dhaka',
        outsideCity: Boolean(defaultAddr?.outsideCity),
        address: defaultAddr?.address || '',
        instructions: ''
      });
    }
  }, [currentUser]);

  // Fetch gateway configuration status
  useEffect(() => {
    safeFetchJson('/api/payment/config')
      .then(res => {
        if (res.ok && res.data?.onlinePaymentAvailable) {
          setOnlineAvailable(true);
          setActiveGatewayName(res.data.activeProvider || 'paymently');
          const activeObj = res.data.activeProvider === 'sslcommerz' ? res.data.sslcommerz : res.data.bkash;
          setIsSandboxMode(Boolean(res.data.sandbox || activeObj?.sandbox || res.data.activeProvider === 'sandbox'));
        } else {
          // If offline, static host, or backend endpoint unconfigured: Paymently portal link is ALWAYS available!
          setOnlineAvailable(true);
          setActiveGatewayName('paymently');
          setIsSandboxMode(false);
        }
      })
      .catch(() => {
        // Fallback: Paymently verified portal is active
        setOnlineAvailable(true);
        setActiveGatewayName('paymently');
        setIsSandboxMode(false);
      });
  }, []);

  // Escape-to-close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) {
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
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  // Pricing calculation
  const rawTotals = calculateOrderTotals(cart, {
    division: customer.division,
    outsideCity: customer.outsideCity
  });

  const finalSubtotal = Math.max(0, rawTotals.subtotal - promoDiscount);
  const deliveryFee = rawTotals.deliveryFee;
  const grandTotal = finalSubtotal + deliveryFee;
  const isFreeDelivery = rawTotals.isFreeDelivery;
  const neededForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - rawTotals.subtotal);

  const handleApplyPromo = async (e) => {
    e?.preventDefault();
    if (!promoCodeInput.trim()) return;
    setErrorMessage('');
    setPromoSuccessMsg('');

    try {
      const res = await safeFetchJson('/api/cart/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          promoCode: promoCodeInput.trim()
        })
      });

      if (res.ok && res.data?.appliedPromo) {
        setAppliedPromo(res.data.appliedPromo);
        setPromoDiscount(res.data.discount || 0);
        setPromoSuccessMsg(`Coupon "${res.data.appliedPromo.code}" applied: ${currencySymbol}${res.data.discount} discount saved!`);
      } else if (res.isHtml || res.isNetworkError || !res.ok) {
        // Fallback for static hosts (GitHub Pages/Vercel) or offline mode
        const code = promoCodeInput.trim().toUpperCase();
        if (code === 'TECH10' || code === 'WINTER10' || code === 'GLACIAL10') {
          const discount = Math.round(rawTotals.subtotal * 0.10);
          setAppliedPromo({ code, discountPercent: 10, title: '10% Discount' });
          setPromoDiscount(discount);
          setPromoSuccessMsg(`Coupon "${code}" applied: ${currencySymbol}${discount} discount saved!`);
        } else if (code === 'TUTOR100' || code === 'FREE60') {
          const discount = code === 'FREE60' ? 60 : 100;
          setAppliedPromo({ code, discountAmount: discount, title: `${currencySymbol}${discount} Off Promotional Voucher` });
          setPromoDiscount(discount);
          setPromoSuccessMsg(`Coupon "${code}" applied: ${currencySymbol}${discount} discount saved!`);
        } else {
          setErrorMessage('Invalid or expired promotion code');
          setAppliedPromo(null);
          setPromoDiscount(0);
        }
      } else {
        setErrorMessage(res.error || 'Invalid or expired promotion code');
        setAppliedPromo(null);
        setPromoDiscount(0);
      }
    } catch (e) {
      setErrorMessage('Failed to validate promotion code');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Input validation
    if (!customer.name.trim()) {
      setErrorMessage('Please enter your full name for courier delivery.');
      return;
    }
    const cleanPhone = customer.phone.replace(/[\s-]/g, '');
    if (!cleanPhone.match(/^(?:\+88|88)?01[3-9]\d{8}$/)) {
      setErrorMessage('Please enter a valid Bangladeshi mobile number (e.g. 01712345678 or +8801338652463).');
      return;
    }
    if (!customer.address.trim()) {
      setErrorMessage('Please enter your complete street delivery address.');
      return;
    }

    setIsSubmitting(true);

    const token = localStorage.getItem('accessories_customer_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      // 1. Attempt authoritative server order creation
      const response = await safeFetchJson('/api/orders', {
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

      let createdOrder = null;
      let guestToken = null;

      if (response.ok && response.data?.success) {
        createdOrder = response.data.order;
        guestToken = response.data.guestToken;
      } else {
        // 2. Seamless client-side fallback for static deployments (Vercel, GitHub Pages, Netlify) or offline
        const clientOrderId = 'AGY-' + Math.floor(100000 + Math.random() * 900000);
        guestToken = 'gt_' + Date.now().toString(36) + Math.random().toString(36).slice(2);
        createdOrder = {
          id: clientOrderId,
          customer: { ...customer, phone: cleanPhone },
          items: cart.map(i => ({
            id: i.id,
            title: i.title,
            price: i.price,
            quantity: i.quantity,
            variant: i.variant?.name || 'Default',
            image: i.image
          })),
          subtotal: finalSubtotal,
          deliveryFee,
          total: grandTotal,
          paymentMethod,
          paymentStatus: 'unpaid',
          orderStatus: 'pending',
          createdAt: new Date().toISOString(),
          guestToken
        };

        try {
          const existing = JSON.parse(localStorage.getItem('accessories_orders') || '[]');
          existing.unshift(createdOrder);
          localStorage.setItem('accessories_orders', JSON.stringify(existing));
        } catch (e) {}
      }

      // 3. Routing based on selected payment method
      if (paymentMethod === 'cod') {
        onOrderSuccess(createdOrder, guestToken);
        onClose();
      } else {
        // Online payment: initiate gateway session with Paymently
        let initData = null;

        if (response.ok && response.data?.success) {
          const initRes = await safeFetchJson('/api/payment/initiate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: createdOrder.id
            })
          });

          if (initRes.ok && initRes.data?.success) {
            initData = initRes.data;
          }
        }

        // Guaranteed fallback to verified Paymently gateway portal
        if (!initData) {
          initData = {
            success: true,
            provider: 'paymently',
            isPaymently: true,
            paymentLink: OFFICIAL_PAYMENTLY_URL,
            redirectUrl: OFFICIAL_PAYMENTLY_URL,
            qrCodeUrl: OFFICIAL_QR_CODE_URL,
            orderId: createdOrder.id,
            amount: grandTotal
          };
        }

        onClose();
        onInitiateOnlinePayment(createdOrder, initData);
      }
    } catch (err) {
      // Guaranteed safety: If any unexpected error occurs, complete the order locally so customer never gets blocked!
      console.warn('[Checkout Fallback]', err);
      const clientOrderId = 'AGY-' + Math.floor(100000 + Math.random() * 900000);
      const fallbackOrder = {
        id: clientOrderId,
        customer: { ...customer, phone: cleanPhone },
        items: cart.map(i => ({
          id: i.id,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
          variant: i.variant?.name || 'Default'
        })),
        subtotal: finalSubtotal,
        deliveryFee,
        total: grandTotal,
        paymentMethod,
        paymentStatus: 'unpaid',
        orderStatus: 'pending',
        createdAt: new Date().toISOString(),
        guestToken: 'gt_' + Date.now().toString(36)
      };

      if (paymentMethod === 'cod') {
        onOrderSuccess(fallbackOrder, fallbackOrder.guestToken);
        onClose();
      } else {
        onClose();
        onInitiateOnlinePayment(fallbackOrder, {
          success: true,
          provider: 'paymently',
          isPaymently: true,
          paymentLink: OFFICIAL_PAYMENTLY_URL,
          redirectUrl: OFFICIAL_PAYMENTLY_URL,
          qrCodeUrl: OFFICIAL_QR_CODE_URL,
          orderId: clientOrderId,
          amount: grandTotal
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={!isSubmitting ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="amazon-checkout-header"
      style={{ zIndex: 9999 }}
    >
      <div 
        className="relative w-full max-w-5xl max-h-[94vh] overflow-y-auto rounded-2xl bg-[#EAEDED] border border-[#D5D9D9] shadow-2xl animate-fadeIn text-[#0F1111]"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 65px -15px rgba(15, 17, 17, 0.40)'
        }}
      >
        {/* Amazon-style Checkout Header */}
        <header className="sticky top-0 z-30 bg-[#FFFFFF] border-b border-[#D5D9D9] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
          {/* Brand Logo & Amazon-style Identity */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={onClose}>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0F1111]">
                Glacial<span className="text-[#FF9900]">Tech</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#F0F2F2] font-semibold text-[#565959] border border-[#D5D9D9]">
                Checkout
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#565959] pl-3 border-l border-[#D5D9D9]">
              <Lock size={13} className="text-[#007600]" />
              <span className="font-semibold text-[#007600]">100% Secure 256-Bit SSL Checkout</span>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-[#565959]">
            <span className="text-[#C45500] font-bold">1. Delivery</span>
            <ChevronRight size={14} className="text-[#888C8C]" />
            <span className="text-[#C45500] font-bold">2. Payment</span>
            <ChevronRight size={14} className="text-[#888C8C]" />
            <span className="text-[#565959]">3. Confirmation</span>
          </div>

          {/* Close / Return Button */}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#007185] hover:text-[#C45500] hover:bg-[#F7FAFA] transition-colors cursor-pointer"
            aria-label="Return to Store"
          >
            <span>Return to Store</span>
            <X size={16} />
          </button>
        </header>

        {/* Free Delivery Qualification Banner */}
        {isFreeDelivery ? (
          <div className="bg-[#007600] text-white px-4 sm:px-8 py-2 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>Your order qualifies for <strong>FREE Fast-Track Delivery</strong> across Bangladesh!</span>
            </div>
            <span className="hidden sm:inline-block bg-white/20 px-2 py-0.5 rounded text-[11px]">Save ৳60 - ৳120</span>
          </div>
        ) : (
          <div className="bg-[#FFF4E5] text-[#C45500] border-b border-[#F5D8A0] px-4 sm:px-8 py-2 text-xs font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck size={15} />
              <span>Add <strong>{currencySymbol}{neededForFree}</strong> more to your cart for <strong>FREE Delivery</strong>!</span>
            </div>
            <span className="font-bold">Threshold: {currencySymbol}{FREE_SHIPPING_THRESHOLD}</span>
          </div>
        )}

        {/* Error Alert Banner */}
        {errorMessage && (
          <div 
            className="mx-4 sm:mx-8 mt-4 p-3.5 rounded-xl bg-[#FFF4F4] border border-[#DE3618] text-[#C40000] text-xs font-medium flex items-start gap-2.5 animate-fadeIn"
            role="alert"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-[#DE3618]" />
            <div>
              <p className="font-bold text-[#DE3618]">There was a problem with your order</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Amazon-style Checkout Accordion / Steps (8 Cols) */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* STEP 1: Delivery Information */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#D5D9D9] p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E7E7E7]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#0F1111] text-white text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-[#0F1111]">
                      Delivery Address & Contact
                    </h2>
                  </div>
                  <span className="text-xs text-[#565959]">
                    {currentUser ? `Saved for ${currentUser.name}` : 'Instant Guest Checkout'}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-[#0F1111] mb-1.5">
                        Full Name <span className="text-[#DE3618]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="e.g. Istihad Ahmed"
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#888C8C] focus:border-[#E77600] focus:ring-2 focus:ring-[#E77600]/25 outline-hidden text-xs text-[#0F1111] bg-white transition-all"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-[#0F1111] mb-1.5">
                        Phone Number (Bangladesh) <span className="text-[#DE3618]">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#565959]">
                          🇧🇩 +88
                        </span>
                        <input
                          type="tel"
                          required
                          autoComplete="tel"
                          placeholder="01XXXXXXXXX"
                          value={customer.phone}
                          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                          className="w-full pl-16 pr-3.5 py-2.5 rounded-lg border border-[#888C8C] focus:border-[#E77600] focus:ring-2 focus:ring-[#E77600]/25 outline-hidden text-xs font-mono text-[#0F1111] bg-white transition-all"
                        />
                      </div>
                      <p className="text-[11px] text-[#565959] mt-1">
                        Used by courier for delivery arrival updates and SMS receipt.
                      </p>
                    </div>
                  </div>

                  {/* Division / City Region */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0F1111] mb-1.5">
                        Division / Delivery Region <span className="text-[#DE3618]">*</span>
                      </label>
                      <select
                        value={customer.division}
                        onChange={(e) => setCustomer({ ...customer, division: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#888C8C] focus:border-[#E77600] focus:ring-2 focus:ring-[#E77600]/25 outline-hidden text-xs text-[#0F1111] bg-white transition-all cursor-pointer font-medium"
                      >
                        <option value="Dhaka">Dhaka Division (৳60 delivery)</option>
                        <option value="Chittagong">Chittagong Division (৳120 delivery)</option>
                        <option value="Sylhet">Sylhet Division (৳120 delivery)</option>
                        <option value="Rajshahi">Rajshahi Division (৳120 delivery)</option>
                        <option value="Khulna">Khulna Division (৳120 delivery)</option>
                        <option value="Barisal">Barisal Division (৳120 delivery)</option>
                        <option value="Rangpur">Rangpur Division (৳120 delivery)</option>
                        <option value="Mymensingh">Mymensingh Division (৳120 delivery)</option>
                      </select>
                    </div>

                    {/* Suburban Checkbox */}
                    <div className="flex items-center sm:pt-6">
                      <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-[#0F1111] bg-[#F7FAFA] border border-[#D5D9D9] p-2.5 rounded-lg w-full hover:bg-[#F0F2F2]">
                        <input
                          type="checkbox"
                          checked={customer.outsideCity}
                          onChange={(e) => setCustomer({ ...customer, outsideCity: e.target.checked })}
                          className="w-4 h-4 rounded text-[#E77600] focus:ring-[#E77600] border-[#888C8C]"
                        />
                        <span>Suburban / Remote Upazila (+৳60)</span>
                      </label>
                    </div>
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="block text-xs font-bold text-[#0F1111] mb-1.5">
                      Detailed Street Address <span className="text-[#DE3618]">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="e.g. Hold No 180, Dingadoba Bank Colony, Rajpara Thana, Near Central Mosque"
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#888C8C] focus:border-[#E77600] focus:ring-2 focus:ring-[#E77600]/25 outline-hidden text-xs text-[#0F1111] bg-white transition-all"
                    />
                  </div>

                  {/* Optional Delivery Instructions */}
                  <div>
                    <label className="block text-xs font-semibold text-[#565959] mb-1">
                      Delivery Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Call before coming, leave at reception"
                      value={customer.instructions}
                      onChange={(e) => setCustomer({ ...customer, instructions: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg border border-[#D5D9D9] focus:border-[#E77600] outline-hidden text-xs text-[#0F1111] bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* STEP 2: Payment Method (Amazon-style clean cards) */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#D5D9D9] p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E7E7E7]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#0F1111] text-white text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-[#0F1111]">
                      Select Payment Method
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-[#007600] flex items-center gap-1">
                    <ShieldCheck size={14} />
                    Verified & Encrypted
                  </span>
                </div>

                <div className="space-y-3.5">
                  {/* OPTION 1: Paymently Live Gateway (bKash / Nagad / Cards) - RECOMMENDED */}
                  <label 
                    className={`block p-4 sm:p-5 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'online' 
                        ? 'border-[#E77600] bg-[#FDF8F3] shadow-xs' 
                        : 'border-[#D5D9D9] bg-white hover:border-[#888C8C]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="amazonPaymentMethod"
                          value="online"
                          checked={paymentMethod === 'online'}
                          onChange={() => setPaymentMethod('online')}
                          className="w-4 h-4 mt-0.5 text-[#E77600] focus:ring-[#E77600] border-[#888C8C]"
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="font-bold text-sm text-[#0F1111]">
                              Online Payment via Paymently Portal
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-[#FFF4E5] text-[#C45500] border border-[#F5D8A0]">
                              Recommended &bull; Fast Track
                            </span>
                          </div>

                          <p className="text-xs text-[#565959] leading-relaxed mb-3">
                            Instant automated verification via verified Paymently gateway (<code className="text-[#007185] font-mono">vartualtutor.paymently.io</code>).
                            Pay securely with your mobile banking or credit/debit card.
                          </p>

                          {/* Brand Chips: bKash, Nagad, Rocket, Upay, Visa, Mastercard */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#E2136E] text-white">
                              bKash
                            </span>
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#F7941D] text-white">
                              Nagad
                            </span>
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#8C3494] text-white">
                              Rocket
                            </span>
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#005BAA] text-white">
                              Upay
                            </span>
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#1A1F71] text-white">
                              Visa / Mastercard
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="hidden sm:flex flex-col items-end shrink-0">
                        <span className="text-xs font-bold text-[#007600]">Zero Surcharge</span>
                        <span className="text-[11px] text-[#565959]">Instant Receipt</span>
                      </div>
                    </div>
                  </label>

                  {/* OPTION 2: Cash on Delivery (COD) */}
                  <label 
                    className={`block p-4 sm:p-5 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'cod' 
                        ? 'border-[#E77600] bg-[#FDF8F3] shadow-xs' 
                        : 'border-[#D5D9D9] bg-white hover:border-[#888C8C]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="amazonPaymentMethod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="w-4 h-4 mt-0.5 text-[#E77600] focus:ring-[#E77600] border-[#888C8C]"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-[#0F1111]">
                              Cash on Delivery (COD)
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F0F2F2] text-[#565959] border border-[#D5D9D9]">
                              Doorstep Collection
                            </span>
                          </div>
                          <p className="text-xs text-[#565959] leading-relaxed">
                            Pay in Bangladeshi Taka ({currencySymbol}) directly to the courier rider upon physical inspection and handover.
                          </p>
                        </div>
                      </div>

                      <div className="hidden sm:flex flex-col items-end shrink-0">
                        <Truck size={18} className="text-[#565959]" />
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* STEP 3: Review Items & Delivery Details (Amazon-style Item Preview) */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#D5D9D9] p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E7E7E7]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#0F1111] text-white text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-[#0F1111]">
                      Review Items and Delivery
                    </h2>
                  </div>
                  <span className="text-xs font-bold text-[#007600]">
                    Guaranteed Dispatch in 24 Hrs
                  </span>
                </div>

                {/* Items List */}
                <div className="divide-y divide-[#E7E7E7]">
                  {cart.map((item, idx) => (
                    <div key={`${item.id}-${item.variant?.id || idx}`} className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-[#F8FAFC] border border-[#D5D9D9] overflow-hidden shrink-0 flex items-center justify-center p-1">
                        <img 
                          src={item.image || '/placeholder.png'} 
                          alt={item.title} 
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#0F1111] truncate">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#565959]">
                          <span>Variant: <strong>{item.variant?.name || 'Standard'}</strong></span>
                          <span>&bull;</span>
                          <span>Qty: <strong>{item.quantity}</strong></span>
                        </div>
                        <span className="text-xs font-bold text-[#007600] mt-1 inline-block">
                          In Stock & Ready for Shipping
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-extrabold text-[#0F1111]">
                          {currencySymbol}{(item.price * item.quantity).toLocaleString()}
                        </span>
                        <div className="text-[11px] text-[#565959]">
                          {currencySymbol}{item.price.toLocaleString()} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promotional Code / Voucher Accordion */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#D5D9D9] p-4 sm:p-5 shadow-xs">
                <div 
                  className="flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setShowPromoBox(!showPromoBox)}
                >
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-[#C45500]" />
                    <span className="text-xs font-bold text-[#007185] hover:text-[#C45500]">
                      {appliedPromo ? `Coupon Applied: ${appliedPromo.code}` : 'Add a gift card, promotion code or voucher'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#007185]">
                    {showPromoBox ? 'Hide' : 'Enter Code'}
                  </span>
                </div>

                {showPromoBox && (
                  <div className="mt-3 pt-3 border-t border-[#E7E7E7] animate-fadeIn">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. TECH10, WINTER10, TUTOR100"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-[#888C8C] focus:border-[#E77600] outline-hidden text-xs font-mono uppercase bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-4 py-2 rounded-lg bg-[#F0F2F2] hover:bg-[#E3E6E6] border border-[#D5D9D9] text-xs font-bold text-[#0F1111] transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    {promoSuccessMsg && (
                      <p className="text-xs font-bold text-[#007600] mt-2 flex items-center gap-1.5">
                        <Check size={14} />
                        {promoSuccessMsg}
                      </p>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Amazon-style Sticky Order Summary (4 Cols) */}
            <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-4">
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#D5D9D9] p-5 sm:p-6 shadow-sm">
                
                {/* Main Amazon Place Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-full bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] border border-[#FCD200] text-[#0F1111] font-bold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-[#0F1111] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {paymentMethod === 'online' ? 'Proceed to Pay with Paymently' : 'Place Your Order'}
                      </span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-[#565959] text-center mt-2.5 leading-tight">
                  By placing your order, you agree to Glacial Tech's <span className="text-[#007185] underline cursor-pointer">Privacy Notice</span> and <span className="text-[#007185] underline cursor-pointer">Conditions of Use</span>.
                </p>

                <div className="my-4 border-t border-[#E7E7E7]" />

                {/* Order Summary Breakdown */}
                <h3 className="text-sm font-bold text-[#0F1111] mb-3">
                  Order Summary
                </h3>

                <div className="space-y-2 text-xs text-[#0F1111]">
                  <div className="flex justify-between">
                    <span className="text-[#565959]">Items ({cart.reduce((s, i) => s + i.quantity, 0)}):</span>
                    <span className="font-semibold">{currencySymbol}{rawTotals.subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#565959]">Shipping & handling:</span>
                    <span>
                      {isFreeDelivery ? (
                        <span className="text-[#007600] font-bold">FREE</span>
                      ) : (
                        <span className="font-semibold">{currencySymbol}{deliveryFee}</span>
                      )}
                    </span>
                  </div>

                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-[#007600] font-bold">
                      <span>Promotion Discount:</span>
                      <span>-{currencySymbol}{promoDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#565959]">
                    <span>Estimated Tax (VAT):</span>
                    <span>Included (৳0)</span>
                  </div>

                  <div className="pt-3 border-t border-[#E7E7E7] flex justify-between items-baseline">
                    <span className="text-base font-bold text-[#B12704]">Order Total:</span>
                    <span className="text-xl font-extrabold text-[#B12704]">
                      {currencySymbol}{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Promotion Savings Callout */}
                {promoDiscount > 0 && (
                  <div className="mt-3.5 p-2 rounded-lg bg-[#E6F4EA] border border-[#CEEAD6] text-center text-xs font-bold text-[#137333]">
                    You are saving {currencySymbol}{promoDiscount.toLocaleString()} on this order!
                  </div>
                )}
              </div>

              {/* Amazon Trust Guarantee Box */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#D5D9D9] p-4 text-xs text-[#565959] space-y-2.5">
                <div className="flex items-center gap-2 font-bold text-[#0F1111]">
                  <ShieldCheck size={16} className="text-[#007600]" />
                  <span>Amazon-Standard Buying Protection</span>
                </div>
                <ul className="space-y-1.5 text-[11px] list-disc list-inside text-[#565959]">
                  <li>100% Original & Verified Products</li>
                  <li>Fast Courier Handover in Dhaka & All Districts</li>
                  <li>7-Day Replacement Guarantee</li>
                  <li>Dedicated Helpline: <strong>+880 1700-000000</strong></li>
                </ul>
              </div>

            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
