import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CompatibilityFinder from './components/CompatibilityFinder';
import CategoryNav from './components/CategoryNav';
import ProductGrid from './components/ProductGrid';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import PaymentGatewayModal from './components/PaymentGatewayModal';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import OrderTrackingModal from './components/OrderTrackingModal';
import WishlistModal from './components/WishlistModal';
import AdminModal from './components/AdminModal';
import SupportModal from './components/SupportModal';
import Footer from './components/Footer';

import { INITIAL_PRODUCTS } from './data/catalog';
import { translations } from './i18n/translations';
import { ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('en');
  const t = translations[lang] || translations.en;

  // Catalog State
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('accessories_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Wishlist State (Persisted in localStorage)
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const saved = localStorage.getItem('accessories_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Modals & Flows
  const [activeModal, setActiveModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [paymentSessionInfo, setPaymentSessionInfo] = useState(null);
  const [trackingOrderId, setTrackingOrderId] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('accessories_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('accessories_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {}
  }, [wishlistIds]);

  // Handle gateway return parameters on page mount
  useEffect(() => {
    const url = new URL(window.location.href);
    const paymentResult = url.searchParams.get('payment_result');
    const orderId = url.searchParams.get('orderId');
    const valId = url.searchParams.get('val_id');
    const sessionId = url.searchParams.get('sessionId');

    if (paymentResult && orderId) {
      // Clean query parameters from URL
      window.history.replaceState({}, document.title, window.location.pathname);

      if (paymentResult === 'success') {
        // Verify server-side
        fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            val_id: valId,
            sessionId,
            status: 'success'
          })
        })
          .then(res => res.json())
          .then(data => {
            if (data.verified && data.order) {
              setConfirmedOrder(data.order);
              setCart([]);
              setActiveModal('order_success');
            } else {
              showToast(data.error || 'Payment verification failed');
            }
          })
          .catch(() => showToast('Failed to verify payment with server'));
      } else if (paymentResult === 'cancel') {
        showToast('Payment was cancelled');
      } else {
        showToast('Payment transaction failed or declined');
      }
    }
  }, []);

  // Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2800);
  };

  // Cart Operations
  const handleAddToCart = (product, variant = null, quantity = 1) => {
    setCart((prevCart) => {
      const variantId = variant?.id || 'default';
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && (item.variant?.id || 'default') === variantId
      );

      if (existingIndex > -1) {
        const nextCart = [...prevCart];
        nextCart[existingIndex].quantity += quantity;
        return nextCart;
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            title: product.title,
            titleBn: product.titleBn,
            price: product.price,
            image: product.image,
            category: product.category,
            variant: variant || (product.variants ? product.variants[0] : null),
            quantity
          }
        ];
      }
    });

    showToast(`Added ${product.title} to bag`);
  };

  const handleUpdateQuantity = (productId, variantId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId, variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === productId && (item.variant?.id || 'default') === (variantId || 'default')) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const handleRemoveFromCart = (productId, variantId) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.id === productId && (item.variant?.id || 'default') === (variantId || 'default'))
      )
    );
  };

  // Wishlist Operations
  const handleToggleWishlist = (product) => {
    setWishlistIds((prev) => {
      if (prev.includes(product.id)) {
        showToast(`Removed from wishlist`);
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`Saved to wishlist`);
        return [...prev, product.id];
      }
    });
  };

  // Buy Now direct trigger
  const handleBuyNow = (product, variant, quantity) => {
    handleAddToCart(product, variant, quantity);
    setActiveModal('checkout');
  };

  // Order Placed Success Handler (COD or Verified)
  const handleOrderSuccess = (order) => {
    setConfirmedOrder(order);
    setCart([]);
    setActiveModal('order_success');
  };

  // Online Payment Initiated
  const handleInitiateOnlinePayment = (order, sessionData) => {
    if (sessionData.provider === 'sandbox') {
      // Open transparent sandbox modal
      setPaymentSessionInfo({
        orderId: order.id,
        sessionId: sessionData.sessionId,
        amount: order.total
      });
      setActiveModal('payment_gateway');
    } else if (sessionData.redirectUrl) {
      // Live gateway redirect
      window.location.href = sessionData.redirectUrl;
    }
  };

  const handlePaymentSuccess = (verifiedOrder) => {
    setConfirmedOrder(verifiedOrder);
    setCart([]);
    setActiveModal('order_success');
  };

  const handlePaymentFailure = (reason) => {
    showToast(`Payment declined: ${reason}`);
    setActiveModal(null);
  };

  // Restock for Admin
  const handleRestock = (productId, count = 10) => {
    fetch('/api/admin/inventory/restock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, count })
    }).catch(() => {});

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: p.stock + count } : p))
    );
    showToast(`Restocked +${count} units`);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featuredProduct = products.find(p => p.id === 'aura-frost-magsafe-case') || products[0];

  return (
    <div className="min-h-screen flex flex-col justify-between relative selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#112A43] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-2xl border border-blue-400/30 flex items-center gap-2 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Slim Frosted Glass Header */}
      <Header
        storeName={import.meta.env.VITE_STORE_NAME || "Accessories"}
        t={t}
        lang={lang}
        setLang={setLang}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setActiveModal('cart')}
        onOpenWishlist={() => setActiveModal('wishlist')}
        onOpenSupport={() => setActiveModal('support')}
        onOpenAdmin={() => setActiveModal('admin')}
        onOpenTracking={() => {
          setTrackingOrderId('');
          setActiveModal('tracking');
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectCategory={setSelectedCategory}
        onScrollToFinder={() => scrollToSection('compatibility-finder')}
      />

      {/* Main Content Area */}
      <main className="container flex-grow pt-4">
        {/* Static Polished Hero Section (Zero 3D/WebGL) */}
        <Hero
          onShopClick={() => scrollToSection('products-section')}
          onFindPhoneClick={() => scrollToSection('compatibility-finder')}
          t={t}
        />

        {/* Compatibility Finder directly below hero */}
        <CompatibilityFinder
          selectedPhone={selectedPhone}
          onSelectPhone={(phone) => {
            setSelectedPhone(phone);
            scrollToSection('products-section');
          }}
          onClearFilter={() => setSelectedPhone(null)}
          t={t}
        />

        {/* Four Image-led Categories Strip directly below Finder */}
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            scrollToSection('products-section');
          }}
        />

        {/* Four Value Proposition Highlights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 my-8">
          <div className="p-4 sm:p-5 rounded-2xl bg-white/75 backdrop-blur-md border border-blue-200/50 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#112A43]">{t.prop1Title}</h4>
              <p className="text-[11px] text-[#4B637B] hidden sm:block">{t.prop1Sub}</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/75 backdrop-blur-md border border-blue-200/50 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Award size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#112A43]">{t.prop2Title}</h4>
              <p className="text-[11px] text-[#4B637B] hidden sm:block">{t.prop2Sub}</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/75 backdrop-blur-md border border-blue-200/50 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#112A43]">{t.prop3Title}</h4>
              <p className="text-[11px] text-[#4B637B] hidden sm:block">{t.prop3Sub}</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/75 backdrop-blur-md border border-blue-200/50 shadow-xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <RotateCcw size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#112A43]">{t.prop4Title}</h4>
              <p className="text-[11px] text-[#4B637B] hidden sm:block">{t.prop4Sub}</p>
            </div>
          </div>
        </div>

        {/* Product Collection Grid with Filtering & Search */}
        <ProductGrid
          products={products}
          currencySymbol="৳"
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedPhone={selectedPhone}
          onClearPhoneFilter={() => setSelectedPhone(null)}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          onQuickAdd={(p) => handleAddToCart(p, p.variants?.[0], 1)}
          onOpenDetail={(p) => {
            setSelectedProduct(p);
            setActiveModal('detail');
          }}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          t={t}
          lang={lang}
        />
      </main>

      {/* Modals & Drawers */}
      {/* 1. Product Detail Modal */}
      {activeModal === 'detail' && selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => {
            setActiveModal(null);
            setSelectedProduct(null);
          }}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          currencySymbol="৳"
          t={t}
          lang={lang}
        />
      )}

      {/* 2. Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={activeModal === 'cart'}
        onClose={() => setActiveModal(null)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onOpenCheckout={() => setActiveModal('checkout')}
        currencySymbol="৳"
        t={t}
        lang={lang}
      />

      {/* 3. Checkout Modal */}
      <CheckoutModal
        isOpen={activeModal === 'checkout'}
        onClose={() => setActiveModal(null)}
        cart={cart}
        onOrderSuccess={handleOrderSuccess}
        onInitiateOnlinePayment={handleInitiateOnlinePayment}
        currencySymbol="৳"
        t={t}
        lang={lang}
      />

      {/* 4. Payment Gateway Modal (for Sandbox / Interactive Testing) */}
      {activeModal === 'payment_gateway' && paymentSessionInfo && (
        <PaymentGatewayModal
          isOpen={true}
          sessionInfo={paymentSessionInfo}
          onClose={() => setActiveModal(null)}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailure={handlePaymentFailure}
          currencySymbol="৳"
        />
      )}

      {/* 5. Order Confirmation Modal */}
      {activeModal === 'order_success' && confirmedOrder && (
        <OrderConfirmationModal
          order={confirmedOrder}
          onClose={() => {
            setActiveModal(null);
            setConfirmedOrder(null);
          }}
          onOpenTracking={(id) => {
            setTrackingOrderId(id);
            setActiveModal('tracking');
          }}
          currencySymbol="৳"
          t={t}
          lang={lang}
        />
      )}

      {/* 6. Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={activeModal === 'tracking'}
        onClose={() => setActiveModal(null)}
        initialOrderId={trackingOrderId}
        currencySymbol="৳"
      />

      {/* 7. Wishlist Modal */}
      <WishlistModal
        isOpen={activeModal === 'wishlist'}
        onClose={() => setActiveModal(null)}
        wishlistProducts={products.filter((p) => wishlistIds.includes(p.id))}
        onRemoveFromWishlist={(id) => setWishlistIds((prev) => prev.filter((i) => i !== id))}
        onAddToCart={(p) => handleAddToCart(p, p.variants?.[0], 1)}
        currencySymbol="৳"
        t={t}
      />

      {/* 8. Admin Dashboard Modal */}
      <AdminModal
        isOpen={activeModal === 'admin'}
        onClose={() => setActiveModal(null)}
        products={products}
        onRestockProduct={handleRestock}
        currencySymbol="৳"
      />

      {/* 9. Customer Support Modal */}
      <SupportModal
        isOpen={activeModal === 'support'}
        onClose={() => setActiveModal(null)}
        t={t}
      />

      {/* Concise Footer */}
      <Footer
        storeName={import.meta.env.VITE_STORE_NAME || "Accessories"}
        onOpenSupport={() => setActiveModal('support')}
        onOpenTracking={() => {
          setTrackingOrderId('');
          setActiveModal('tracking');
        }}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          scrollToSection('products-section');
        }}
        onOpenAdmin={() => setActiveModal('admin')}
        t={t}
        lang={lang}
      />
    </div>
  );
}
