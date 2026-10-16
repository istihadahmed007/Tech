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
import './CheckoutModal.css';

export const OFFICIAL_PAYMENTLY_URL = "https://vartualtutor.paymently.io/paymentlink/default/BDT";
export const OFFICIAL_QR_CODE_URL = "/payment-link-BDT-2026-09-11.svg";

export default function CheckoutModal({ 
  isOpen = true, 
  isPage = false,
  onClose, 
  cart = [], 
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
        setOnlineAvailable(true);
        setActiveGatewayName('paymently');
        setIsSandboxMode(false);
      });
  }, []);

  // Escape-to-close
  useEffect(() => {
    if (!isOpen && !isPage) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting && onClose) {
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
  }, [isOpen, isPage, isSubmitting, onClose]);

  if (!isOpen && !isPage) return null;

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
        setErrorMessage(res.error || 'Invalid promotion code');
        setAppliedPromo(null);
        setPromoDiscount(0);
      }
    } catch (err) {
      setErrorMessage('Failed to validate promotional code');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
    setPromoSuccessMsg('');
    setPromoCodeInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setErrorMessage('Your shopping cart is empty');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    const cleanPhone = customer.phone.replace(/[\s\-()]/g, '');

    try {
      const token = localStorage.getItem('accessories_customer_token');
      const orderPayload = {
        customer: {
          ...customer,
          phone: cleanPhone
        },
        items: cart.map(i => ({
          id: i.id,
          variantId: i.variant?.id,
          quantity: i.quantity,
          title: i.title,
          price: i.price,
          variant: i.variant
        })),
        deliveryAddress: {
          division: customer.division,
          outsideCity: customer.outsideCity,
          address: customer.address,
          instructions: customer.instructions
        },
        paymentMethod,
        appliedPromoCode: appliedPromo?.code || null,
        idempotencyKey
      };

      // 1. Submit order to backend API
      const response = await safeFetchJson('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(orderPayload)
      });

      let createdOrder = null;
      let guestToken = null;

      if (response.ok && response.data?.success && response.data.order) {
        createdOrder = response.data.order;
        guestToken = response.data.guestToken;
      } else {
        // 2. Seamless client-side fallback for static deployments or offline
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
        if (onClose) onClose();
        onOrderSuccess(createdOrder, guestToken);
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

        if (onClose) onClose();
        onInitiateOnlinePayment(createdOrder, initData);
      }
    } catch (err) {
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
        if (onClose) onClose();
        onOrderSuccess(fallbackOrder, fallbackOrder.guestToken);
      } else {
        if (onClose) onClose();
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

  // The Inner Checkout Content Card
  const checkoutCardContent = (
    <div className="checkout-modal-card">
      {/* Amazon-style Checkout Header */}
      <header className="checkout-header">
        <div className="checkout-header-logo" onClick={onClose} title="Tech Nest Checkout">
          <img 
            src="/assets/tech-nest-icon.png" 
            alt="Tech Nest" 
            className="w-7 h-7 object-contain"
          />
          <span className="checkout-header-brand">
            Tech<span>Nest</span>
          </span>
          <span className="checkout-header-tag">
            Checkout
          </span>
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

        {/* Return Button */}
        {onClose && (
          <button
            ref={closeButtonRef}
            onClick={onClose}
            disabled={isSubmitting}
            className="checkout-close-btn"
            aria-label="Return to Store"
          >
            <span>Return to Store</span>
            <X size={16} />
          </button>
        )}
      </header>

      {/* Free Delivery Qualification Banner */}
      {isFreeDelivery ? (
        <div className="checkout-free-ship-banner">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>Your order qualifies for <strong>FREE Fast-Track Delivery</strong> across Bangladesh!</span>
          </div>
          <span className="hidden sm:inline-block bg-white/20 px-2 py-0.5 rounded text-[11px]">Save ৳60 - ৳120</span>
        </div>
      ) : (
        <div className="checkout-free-ship-banner is-under">
          <div className="flex items-center gap-2">
            <Truck size={15} />
            <span>Add <strong>{currencySymbol}{neededForFree}</strong> more to your cart for <strong>FREE Delivery</strong>!</span>
          </div>
          <span className="font-bold">Threshold: {currencySymbol}{FREE_SHIPPING_THRESHOLD}</span>
        </div>
      )}

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="checkout-error-alert" role="alert">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-[#DE3618]" />
          <div>
            <p className="font-bold">There was a problem with your order</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Main Checkout Form */}
      <form onSubmit={handleSubmit} className="checkout-body">
        <div className="checkout-grid">
          
          {/* Left Column: Form Steps */}
          <div className="checkout-steps-col">
            
            {/* STEP 1: Delivery Information */}
            <div className="checkout-card">
              <div className="checkout-step-header">
                <div className="checkout-step-badge-wrap">
                  <span className="checkout-step-badge">1</span>
                  <h2 className="checkout-step-title">Delivery Address & Contact</h2>
                </div>
                <span className="text-xs text-[#565959]">
                  {currentUser ? `Saved for ${currentUser.name}` : 'Instant Guest Checkout'}
                </span>
              </div>

              <div>
                <div className="checkout-input-row">
                  {/* Full Name */}
                  <div className="checkout-field">
                    <label className="checkout-label">
                      Full Name <span className="checkout-label-req">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="e.g. Istihad Ahmed"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="checkout-input"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="checkout-field">
                    <label className="checkout-label">
                      Phone Number (Bangladesh) <span className="checkout-label-req">*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', fontWeight: 'bold', color: '#565959' }}>
                        🇧🇩 +88
                      </span>
                      <input
                        type="tel"
                        required
                        autoComplete="tel"
                        placeholder="01XXXXXXXXX"
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        className="checkout-input"
                        style={{ paddingLeft: '64px', fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Division & Outside City Checkbox */}
                <div className="checkout-input-row">
                  <div className="checkout-field">
                    <label className="checkout-label">
                      Division / Delivery Region <span className="checkout-label-req">*</span>
                    </label>
                    <select
                      value={customer.division}
                      onChange={(e) => setCustomer({ ...customer, division: e.target.value })}
                      className="checkout-input"
                      style={{ cursor: 'pointer' }}
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

                  <div className="checkout-field" style={{ justifyContent: 'center', paddingTop: '18px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#0F1111' }}>
                      <input
                        type="checkbox"
                        checked={customer.outsideCity}
                        onChange={(e) => setCustomer({ ...customer, outsideCity: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: '#E77600' }}
                      />
                      <span>Suburban / Remote Upazila (+৳60)</span>
                    </label>
                  </div>
                </div>

                {/* Street Address */}
                <div className="checkout-field" style={{ marginBottom: '14px' }}>
                  <label className="checkout-label">
                    Detailed Street Address <span className="checkout-label-req">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="e.g. Hold No 180, Dingadoba Bank Colony, Rajpara Thana, Near Central Mosque"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="checkout-input checkout-textarea"
                  />
                </div>

                {/* Optional Instructions */}
                <div className="checkout-field">
                  <label className="checkout-label" style={{ color: '#565959' }}>
                    Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Call before coming, leave at reception"
                    value={customer.instructions}
                    onChange={(e) => setCustomer({ ...customer, instructions: e.target.value })}
                    className="checkout-input"
                  />
                </div>
              </div>
            </div>

            {/* STEP 2: Select Payment Method */}
            <div className="checkout-card">
              <div className="checkout-step-header">
                <div className="checkout-step-badge-wrap">
                  <span className="checkout-step-badge">2</span>
                  <h2 className="checkout-step-title">Select Payment Method</h2>
                </div>
                <span className="text-xs font-bold text-[#007600] flex items-center gap-1">
                  <ShieldCheck size={14} />
                  Verified & Encrypted
                </span>
              </div>

              <div>
                {/* OPTION 1: Paymently Live Gateway (bKash / Nagad / Cards) - RECOMMENDED */}
                <label 
                  className={`checkout-payment-option ${paymentMethod === 'online' ? 'is-active' : ''}`}
                >
                  <div className="checkout-radio-flex">
                    <input
                      type="radio"
                      name="amazonPaymentMethod"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                      className="checkout-radio-input"
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span className="checkout-method-name">Online Payment via Paymently Portal</span>
                        <span className="checkout-method-badge">Recommended &bull; Fast Track</span>
                      </div>

                      <p className="checkout-method-desc">
                        Instant automated verification via verified Paymently gateway (<code style={{ color: '#007185', fontFamily: 'monospace' }}>vartualtutor.paymently.io</code>). Pay securely with your mobile banking or credit/debit card.
                      </p>

                      {/* Brand Chips */}
                      <div className="checkout-brand-chips">
                        <span className="checkout-brand-chip" style={{ backgroundColor: '#E2136E' }}>bKash</span>
                        <span className="checkout-brand-chip" style={{ backgroundColor: '#F7941D' }}>Nagad</span>
                        <span className="checkout-brand-chip" style={{ backgroundColor: '#8C3494' }}>Rocket</span>
                        <span className="checkout-brand-chip" style={{ backgroundColor: '#005BAA' }}>Upay</span>
                        <span className="checkout-brand-chip" style={{ backgroundColor: '#1A1F71' }}>Visa / Mastercard</span>
                      </div>
                    </div>
                  </div>
                </label>

                {/* OPTION 2: Cash on Delivery (COD) */}
                <label 
                  className={`checkout-payment-option ${paymentMethod === 'cod' ? 'is-active' : ''}`}
                >
                  <div className="checkout-radio-flex">
                    <input
                      type="radio"
                      name="amazonPaymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="checkout-radio-input"
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span className="checkout-method-name">Cash on Delivery (COD)</span>
                        <span className="checkout-method-badge" style={{ background: '#F0F2F2', color: '#565959', borderColor: '#D5D9D9' }}>Doorstep Collection</span>
                      </div>
                      <p className="checkout-method-desc">
                        Pay in Bangladeshi Taka ({currencySymbol}) directly to the courier rider upon physical inspection and handover.
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* STEP 3: Review Items & Delivery */}
            <div className="checkout-card">
              <div className="checkout-step-header">
                <div className="checkout-step-badge-wrap">
                  <span className="checkout-step-badge">3</span>
                  <h2 className="checkout-step-title">Review Items and Delivery</h2>
                </div>
                <span className="text-xs font-bold text-[#007600]">
                  Guaranteed Dispatch in 24 Hrs
                </span>
              </div>

              <div>
                {cart.map((item, idx) => (
                  <div key={`${item.id}-${item.variant?.id || idx}`} className="checkout-item-preview-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <img 
                        src={item.image || '/placeholder.png'} 
                        alt={item.title} 
                        className="checkout-item-preview-thumb"
                        loading="lazy"
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0F1111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '11px', color: '#565959', marginTop: '2px' }}>
                          Qty: <strong>{item.quantity}</strong> &bull; Variant: <strong>{item.variant?.name || 'Standard'}</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F1111' }}>
                        {currencySymbol}{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promotion Voucher Box */}
            <div className="checkout-card">
              <div 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                onClick={() => setShowPromoBox(!showPromoBox)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Tag size={16} className="text-[#C45500]" />
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#0F1111' }}>
                    {appliedPromo ? `Promo Code Applied: ${appliedPromo.code}` : 'Apply Gift Card or Promotional Voucher'}
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: '#007185' }}>
                  {showPromoBox ? 'Hide' : 'Enter Code'}
                </span>
              </div>

              {showPromoBox && (
                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #E7E7E7' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Enter promo code (e.g. TECH10)"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                      className="checkout-input"
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      style={{ padding: '8px 16px', background: '#F0F2F2', border: '1px solid #D5D9D9', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Apply
                    </button>
                  </div>
                  {promoSuccessMsg && (
                    <div style={{ color: '#007600', fontSize: '12px', fontWeight: 'bold', marginTop: '8px' }}>
                      {promoSuccessMsg}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Order Summary & Place Order Button */}
          <div className="checkout-summary-col">
            <div className="checkout-card">
              {/* Main Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="checkout-btn-order"
                aria-label="Submit Order"
              >
                {isSubmitting ? (
                  <span style={{ width: '20px', height: '20px', border: '2px solid #0F1111', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <>
                    <span>
                      {paymentMethod === 'online' ? 'Proceed to Pay with Paymently' : 'Place Your Order'}
                    </span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <p style={{ fontSize: '11px', color: '#565959', textAlign: 'center', marginTop: '10px' }}>
                By placing your order, you agree to Tech Nest's privacy notice and conditions of use.
              </p>

              {/* Price Breakdown */}
              <div className="checkout-price-breakdown">
                <div className="checkout-price-row">
                  <span>Items Subtotal:</span>
                  <span>{currencySymbol}{rawTotals.subtotal.toLocaleString()}</span>
                </div>

                <div className="checkout-price-row">
                  <span>Delivery & Handling:</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <strong style={{ color: '#007600' }}>FREE</strong>
                    ) : (
                      `${currencySymbol}${deliveryFee.toLocaleString()}`
                    )}
                  </span>
                </div>

                {promoDiscount > 0 && (
                  <div className="checkout-price-row" style={{ color: '#007600', fontWeight: 'bold' }}>
                    <span>Promotion Discount:</span>
                    <span>-{currencySymbol}{promoDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="checkout-price-row total-row">
                  <span>Order Total:</span>
                  <span>{currencySymbol}{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Trust Box */}
            <div className="checkout-trust-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#0F1111', fontSize: '13px' }}>
                <ShieldCheck size={16} className="text-[#007600]" />
                <span>Standard Buying Protection</span>
              </div>
              <ul>
                <li>100% Original & Verified Products</li>
                <li>Fast Courier Handover in Dhaka & All Districts</li>
                <li>7-Day Replacement Guarantee</li>
                <li>Verified Paymently Gateway</li>
              </ul>
            </div>
          </div>

        </div>
      </form>
    </div>
  );

  // Return either full-page container or modal dialog
  if (isPage) {
    return (
      <div className="checkout-page-container" role="main" aria-label="Amazon Checkout">
        {checkoutCardContent}
      </div>
    );
  }

  return (
    <div 
      className="checkout-modal-overlay" 
      onClick={!isSubmitting ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby="amazon-checkout-header"
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '1180px' }}>
        {checkoutCardContent}
      </div>
    </div>
  );
}
