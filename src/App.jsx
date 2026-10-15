import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CompatibilityFinder from './components/CompatibilityFinder';
import CategoryNav from './components/CategoryNav';
import ProductGrid from './components/ProductGrid';
import ProductDetailModal from './components/ProductDetailModal';
import ProductDetailPage from './components/ProductDetailPage';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import PaymentGatewayModal from './components/PaymentGatewayModal';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import OrderTrackingModal from './components/OrderTrackingModal';
import WishlistModal from './components/WishlistModal';
import AccountModal from './components/AccountModal';
import AdminModal from './components/AdminModal';
import SupportModal from './components/SupportModal';
import BundleDeals from './components/BundleDeals';
import Footer from './components/Footer';

import { INITIAL_PRODUCTS } from './data/catalog';
import { translations } from './i18n/translations';
import { ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState('en');
  const t = translations[lang] || translations.en;

  // Authoritative Database Catalog State
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Customer Authentication State
  const [currentUser, setCurrentUser] = useState(null);

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

  // Modals & Navigation Flows
  const [activeModal, setActiveModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [paymentSessionInfo, setPaymentSessionInfo] = useState(null);
  const [trackingOrderId, setTrackingOrderId] = useState('');
  const [trackingToken, setTrackingToken] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Toast Helper
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  }, []);

  // Fetch Authoritative Database Catalog
  const loadDatabaseProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (res.ok && Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);
      }
    } catch (err) {
      console.warn('Using local fallback catalog:', err.message);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // Fetch Current Logged-in Customer
  const loadCurrentCustomer = useCallback(async () => {
    const token = localStorage.getItem('accessories_customer_token');
    if (!token) return;

    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setCurrentUser(data.user);
      } else {
        localStorage.removeItem('accessories_customer_token');
        setCurrentUser(null);
      }
    } catch (e) {
      // Ignored
    }
  }, []);

  // Initial Data & Authentication Setup
  useEffect(() => {
    loadDatabaseProducts();
    loadCurrentCustomer();
  }, [loadDatabaseProducts, loadCurrentCustomer]);

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

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dedicated Product Page Navigation (Preserves back/forward and clean deep links)
  const navigateToProduct = useCallback((productOrId, pushHistory = true) => {
    const prodId = typeof productOrId === 'string' ? productOrId : productOrId?.id;
    const prod = typeof productOrId === 'object' && productOrId?.title
      ? productOrId
      : (products.find(p => p.id === prodId) || INITIAL_PRODUCTS.find(p => p.id === prodId));

    if (prod) {
      setSelectedProduct(prod);
      setActiveModal(null);
      if (pushHistory) {
        window.history.pushState({ productId: prod.id }, '', `/product/${prod.id}`);
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (prodId) {
      setSelectedProduct({ id: prodId, notFound: true, title: 'Product Not Found' });
      setActiveModal(null);
      if (pushHistory) {
        window.history.pushState({ productId: prodId }, '', `/product/${prodId}`);
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [products]);

  // Navigate back to Home / Catalog
  const navigateToHome = useCallback((pushHistory = true) => {
    setSelectedProduct(null);
    if (pushHistory) {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Navigate to category from breadcrumb or category link
  const navigateToCategory = useCallback((catId) => {
    setSelectedProduct(null);
    setSelectedCategory(catId);
    window.history.pushState(null, '', '/');
    setTimeout(() => {
      scrollToSection('products-section');
    }, 50);
  }, []);

  // Hash & URL Routing Synchronization (Direct links & browser back/forward)
  useEffect(() => {
    const handleUrlRouting = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;

      // 1. Pathname routing for dedicated product page: /product/:id
      if (pathname.startsWith('/product/')) {
        const productId = pathname.replace('/product/', '').split('/')[0].trim();
        if (productId) {
          const found = products.find(p => p.id === productId) || INITIAL_PRODUCTS.find(p => p.id === productId);
          if (found) {
            setSelectedProduct(found);
          } else {
            setSelectedProduct({ id: productId, notFound: true, title: 'Product Not Found' });
          }
        }
      } else if (hash.startsWith('#product/') || hash.startsWith('#/product/')) {
        const productId = hash.replace(/^#(?:[/])?product\//, '').trim();
        if (productId) {
          const found = products.find(p => p.id === productId) || INITIAL_PRODUCTS.find(p => p.id === productId);
          if (found) {
            setSelectedProduct(found);
          }
        }
      } else if (!hash.startsWith('#') && pathname === '/') {
        setSelectedProduct(null);
      }

      // 2. Hash modal routing
      if (hash === '#account') {
        setActiveModal('account');
      } else if (hash === '#admin') {
        setActiveModal('admin');
      } else if (hash === '#cart') {
        setActiveModal('cart');
      } else if (hash === '#checkout') {
        setActiveModal('checkout');
      } else if (hash.startsWith('#track')) {
        const params = new URLSearchParams(hash.replace('#track', '').replace('?', ''));
        const id = params.get('id');
        const token = params.get('token');
        if (id) {
          setTrackingOrderId(id);
          setTrackingToken(token || '');
        }
        setActiveModal('tracking');
      }
    };

    handleUrlRouting();
    window.addEventListener('popstate', handleUrlRouting);
    window.addEventListener('hashchange', handleUrlRouting);
    return () => {
      window.removeEventListener('popstate', handleUrlRouting);
      window.removeEventListener('hashchange', handleUrlRouting);
    };
  }, [products]);

  // Handle gateway return parameters on page mount
  useEffect(() => {
    const url = new URL(window.location.href);
    const paymentResult = url.searchParams.get('payment_result');
    const orderId = url.searchParams.get('orderId');
    const valId = url.searchParams.get('val_id');
    const sessionId = url.searchParams.get('sessionId');
    const token = url.searchParams.get('token');

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
              setConfirmedOrder({ ...data.order, guestToken: token || data.order.guestToken });
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
  }, [showToast]);

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
            sku: product.sku || product.id,
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

  const handleAddBundle = (bundle) => {
    if (!bundle?.itemIds || !Array.isArray(bundle.itemIds)) return;

    setCart((prevCart) => {
      let nextCart = [...prevCart];
      for (const itemId of bundle.itemIds) {
        const product = products.find(p => p.id === itemId) || INITIAL_PRODUCTS.find(p => p.id === itemId);
        if (!product) continue;

        const defaultVariant = product.variants ? product.variants[0] : null;
        const variantId = defaultVariant?.id || 'default';
        const existingIdx = nextCart.findIndex(
          item => item.id === product.id && (item.variant?.id || 'default') === variantId
        );

        if (existingIdx > -1) {
          nextCart[existingIdx] = {
            ...nextCart[existingIdx],
            quantity: nextCart[existingIdx].quantity + 1
          };
        } else {
          nextCart.push({
            id: product.id,
            sku: product.sku || product.id,
            title: product.title,
            titleBn: product.titleBn,
            price: product.price,
            image: product.image,
            category: product.category,
            variant: defaultVariant,
            quantity: 1
          });
        }
      }
      return nextCart;
    });

    showToast(lang === 'bn' ? '🎉 বান্ডিল যুক্ত হয়েছে! ফ্রি ডেলিভারি আনলকড!' : '🎉 Bundle added! Free Delivery Unlocked!');
    setActiveModal('cart');
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

  const handleRevalidateCart = (serverItems) => {
    setCart(serverItems);
  };

  // Wishlist Operations
  const handleToggleWishlist = async (product) => {
    let nextWishlist;
    if (wishlistIds.includes(product.id)) {
      nextWishlist = wishlistIds.filter((id) => id !== product.id);
      showToast('Removed from wishlist');
    } else {
      nextWishlist = [...wishlistIds, product.id];
      showToast('Saved to wishlist');
    }
    setWishlistIds(nextWishlist);

    // Sync to user account if signed in
    const token = localStorage.getItem('accessories_customer_token');
    if (token) {
      fetch('/api/customer/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productIds: nextWishlist })
      }).catch(() => {});
    }
  };

  // Buy Now direct trigger
  const handleBuyNow = (product, variant, quantity) => {
    handleAddToCart(product, variant, quantity);
    setActiveModal('checkout');
  };

  // Order Placed Success Handler
  const handleOrderSuccess = (order, guestToken = null) => {
    setConfirmedOrder({ ...order, guestToken: guestToken || order.guestToken });
    setCart([]);
    setActiveModal('order_success');
  };

  // Online Payment Initiated
  const handleInitiateOnlinePayment = (order, sessionData) => {
    if (sessionData.provider === 'sandbox') {
      setPaymentSessionInfo({
        orderId: order.id,
        sessionId: sessionData.sessionId,
        amount: order.total
      });
      setActiveModal('payment_gateway');
    } else if (sessionData.redirectUrl) {
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

  // Authenticated Admin Restock (Fixing previous unauthenticated instant increase bug)
  const handleRestock = async (productId, count = 10) => {
    const adminToken = localStorage.getItem('accessories_admin_token');
    if (!adminToken) {
      showToast('Admin authentication required to restock');
      setActiveModal('admin');
      return;
    }

    try {
      const res = await fetch('/api/admin/inventory/restock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ productId, count, reason: `Quick restock (+${count})` })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Server rejected restock request');
      }

      // Update stock ONLY from the successful server response
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: data.newStock } : p))
      );
      showToast(`Restocked +${count} units (Server Stock: ${data.newStock})`);
    } catch (err) {
      showToast(`Restock failed: ${err.message}`);
    }
  };

  // Customer Login Success Handler (Merges guest cart and wishlist)
  const handleCustomerLoginSuccess = (user, token) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}`);

    // Merge guest wishlist
    if (wishlistIds.length > 0) {
      fetch('/api/customer/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productIds: wishlistIds })
      }).catch(() => {});
    }
  };

  const handleCustomerLogout = () => {
    const token = localStorage.getItem('accessories_customer_token');
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }
    localStorage.removeItem('accessories_customer_token');
    setCurrentUser(null);
    showToast('Signed out of customer account');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative selection:bg-blue-600 selection:text-white bg-[#EAF5FF]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#10263D] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-2xl border border-blue-400/30 flex items-center gap-2 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Frosted Glass Header */}
      <Header
        storeName={import.meta.env.VITE_STORE_NAME || "Glacial Tech"}
        t={t}
        lang={lang}
        setLang={setLang}
        currentUser={currentUser}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setActiveModal('cart')}
        onOpenWishlist={() => setActiveModal('wishlist')}
        onOpenSupport={() => setActiveModal('support')}
        onOpenAccount={() => setActiveModal('account')}
        onOpenAdmin={() => setActiveModal('admin')}
        onOpenTracking={(id) => {
          setTrackingOrderId(id || '');
          setTrackingToken('');
          setActiveModal('tracking');
        }}
        searchQuery={searchQuery}
        setSearchQuery={(query) => {
          setSearchQuery(query);
          if (selectedProduct && query.trim()) {
            navigateToHome(false);
          }
        }}
        onScrollToFinder={() => {
          if (selectedProduct) {
            navigateToHome(false);
            setTimeout(() => scrollToSection('compatibility-finder'), 50);
          } else {
            scrollToSection('compatibility-finder');
          }
        }}
        onGoHome={() => navigateToHome(true)}
        onGoToShop={() => {
          if (selectedProduct) {
            navigateToHome(true);
            setTimeout(() => scrollToSection('products-section'), 50);
          } else {
            scrollToSection('products-section');
          }
        }}
      />

      {/* Main Content Area */}
      <main className={selectedProduct ? "flex-grow w-full" : "container flex-grow pt-4"}>
        {selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            currentUser={currentUser}
            onOpenAccount={() => setActiveModal('account')}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
            onBackToHome={() => navigateToHome(true)}
            onSelectCategory={navigateToCategory}
            onSelectProduct={(p) => navigateToProduct(p, true)}
            currencySymbol="৳"
            t={t}
            lang={lang}
          />
        ) : (
          <>
            {/* Hero Section with Interactive Story Tabs (Audio, Cases, Charging, Power) */}
            <Hero
              onShopClick={() => scrollToSection('products-section')}
              onFindPhoneClick={() => scrollToSection('compatibility-finder')}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                scrollToSection('products-section');
              }}
              onSelectPhone={(phone) => {
                setSelectedPhone(phone);
                scrollToSection('products-section');
              }}
              t={t}
              lang={lang}
              selectedCategory={selectedCategory}
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

            {/* Category Collections Strip: The Everyday Edit */}
            <CategoryNav
              selectedCategory={selectedCategory}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                scrollToSection('products-section');
              }}
              onShopAll={() => {
                setSelectedCategory(null);
                scrollToSection('products-section');
              }}
              lang={lang}
            />

            {/* Smart Free Delivery Combos (৳2,000+ Threshold Deals) */}
            <BundleDeals
              onAddBundle={handleAddBundle}
              lang={lang}
              t={t}
            />

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
              onOpenDetail={(p) => navigateToProduct(p, true)}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              t={t}
              lang={lang}
            />

            {/* Value Proposition Highlights: Delivery, Warranty & Support */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 my-8">
              <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-[#DCE7F0] shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#145CFF] flex items-center justify-center shrink-0">
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#10263D]">{t.prop1Title}</h4>
                  <p className="text-[11px] text-[#52677B] hidden sm:block">{t.prop1Sub}</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-[#DCE7F0] shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#10263D]">{t.prop2Title}</h4>
                  <p className="text-[11px] text-[#52677B] hidden sm:block">{t.prop2Sub}</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-[#DCE7F0] shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#145CFF] flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#10263D]">{t.prop3Title}</h4>
                  <p className="text-[11px] text-[#52677B] hidden sm:block">{t.prop3Sub}</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-[#DCE7F0] shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#10263D]">{t.prop4Title}</h4>
                  <p className="text-[11px] text-[#52677B] hidden sm:block">{t.prop4Sub}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Modals & Flow Components */}
      {/* 1. Product Detail Modal (Fallback) */}
      {activeModal === 'detail' && selectedProduct && !selectedProduct.notFound && (
        <ProductDetailModal
          product={selectedProduct}
          currentUser={currentUser}
          onOpenAccount={() => setActiveModal('account')}
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

      {/* 2. Slide-out Cart Drawer with Revalidation */}
      <CartDrawer
        isOpen={activeModal === 'cart'}
        onClose={() => setActiveModal(null)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onOpenCheckout={() => setActiveModal('checkout')}
        onRevalidateCart={handleRevalidateCart}
        currencySymbol="৳"
        t={t}
        lang={lang}
      />

      {/* 3. Checkout Modal */}
      <CheckoutModal
        isOpen={activeModal === 'checkout'}
        onClose={() => setActiveModal(null)}
        cart={cart}
        currentUser={currentUser}
        onOrderSuccess={handleOrderSuccess}
        onInitiateOnlinePayment={handleInitiateOnlinePayment}
        currencySymbol="৳"
        t={t}
        lang={lang}
      />

      {/* 4. Payment Gateway Modal */}
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
          onOpenTracking={(id, token) => {
            setTrackingOrderId(id);
            setTrackingToken(token || '');
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
        initialToken={trackingToken}
        currencySymbol="৳"
      />

      {/* 7. Wishlist Modal */}
      <WishlistModal
        isOpen={activeModal === 'wishlist'}
        onClose={() => setActiveModal(null)}
        wishlistProducts={products.filter((p) => wishlistIds.includes(p.id))}
        onRemoveFromWishlist={(id) => setWishlistIds((prev) => prev.filter((i) => i !== id))}
        onAddToCart={(p) => handleAddToCart(p, p.variants?.[0], 1)}
        onSelectProduct={(p) => {
          setActiveModal(null);
          navigateToProduct(p, true);
        }}
        currencySymbol="৳"
        t={t}
      />

      {/* 8. Customer Account Modal */}
      <AccountModal
        isOpen={activeModal === 'account'}
        onClose={() => setActiveModal(null)}
        currentUser={currentUser}
        onLoginSuccess={handleCustomerLoginSuccess}
        onLogout={handleCustomerLogout}
        onSelectProduct={(p) => {
          setActiveModal(null);
          navigateToProduct(p, true);
        }}
        onAddToCart={handleAddToCart}
        currencySymbol="৳"
        t={t}
        lang={lang}
      />

      {/* 9. Admin Operations Console */}
      <AdminModal
        isOpen={activeModal === 'admin'}
        onClose={() => setActiveModal(null)}
        currencySymbol="৳"
        onProductsUpdated={loadDatabaseProducts}
      />

      {/* 10. Customer Support Modal */}
      <SupportModal
        isOpen={activeModal === 'support'}
        onClose={() => setActiveModal(null)}
        t={t}
      />

      {/* Concise Footer */}
      <Footer
        storeName={import.meta.env.VITE_STORE_NAME || "Glacial Tech"}
        onOpenSupport={() => setActiveModal('support')}
        onOpenTracking={() => {
          setTrackingOrderId('');
          setTrackingToken('');
          setActiveModal('tracking');
        }}
        onSelectCategory={(catId) => {
          navigateToCategory(catId);
        }}
        onOpenAdmin={() => setActiveModal('admin')}
        t={t}
        lang={lang}
      />
    </div>
  );
}
