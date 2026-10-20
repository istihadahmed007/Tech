import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryIconRow from './components/CategoryIconRow';
import FeaturedCategoryCards from './components/FeaturedCategoryCards';
import LifestylePromoBanners from './components/LifestylePromoBanners';
import HotDealsSection from './components/HotDealsSection';
import NewInSection from './components/NewInSection';
import ProductGrid from './components/ProductGrid';
import ProductDetailModal from './components/ProductDetailModal';
import ProductDetailPage from './components/ProductDetailPage';
import CartPage from './components/CartPage';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import PaymentGatewayModal from './components/PaymentGatewayModal';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import OrderTrackingModal from './components/OrderTrackingModal';
import WishlistModal from './components/WishlistModal';
import AccountModal from './components/AccountModal';
import AdminDashboard from './components/AdminDashboard';
import SupportModal from './components/SupportModal';
import BundleDeals from './components/BundleDeals';
import SmartTechFinder from './components/SmartTechFinder';
import ComparisonBar from './components/ComparisonBar';
import ProductComparisonModal from './components/ProductComparisonModal';
import TechKits from './components/TechKits';
import RecentlyViewedSection from './components/RecentlyViewedSection';
import Footer from './components/Footer';

import { INITIAL_PRODUCTS } from './data/catalog';
import { translations } from './i18n/translations';
import { Truck, Award, ShieldCheck, RotateCcw } from 'lucide-react';
import { 
  initUmami, 
  trackAddToCart, 
  trackCheckoutStarted, 
  trackPurchaseCompleted 
} from './utils/analytics';

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

  // Comparison Matrix State (Persisted in localStorage)
  const [comparisonIds, setComparisonIds] = useState(() => {
    try {
      const saved = localStorage.getItem('tech_comparison_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Recently Viewed State (Persisted in localStorage)
  const [recentIds, setRecentIds] = useState(() => {
    try {
      const saved = localStorage.getItem('tech_recent_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Modals & Navigation Flows
  const [activeModal, setActiveModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isCartView, setIsCartView] = useState(false);
  const [isCheckoutView, setIsCheckoutView] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [paymentSessionInfo, setPaymentSessionInfo] = useState(null);
  const [trackingOrderId, setTrackingOrderId] = useState('');
  const [trackingToken, setTrackingToken] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const lastActiveElementRef = useRef(null);

  // Prevent background body scroll when modals are open (eliminates overlapping & bleed-through)
  useEffect(() => {
    if (activeModal) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [activeModal]);

  // Accessible focus restoration upon closing modals
  useEffect(() => {
    if (activeModal || selectedProduct || isCartView) {
      if (!lastActiveElementRef.current) {
        lastActiveElementRef.current = document.activeElement;
      }
    } else {
      if (lastActiveElementRef.current && typeof lastActiveElementRef.current.focus === 'function') {
        try {
          lastActiveElementRef.current.focus();
        } catch (e) {}
      }
      lastActiveElementRef.current = null;
    }
  }, [activeModal, selectedProduct, isCartView]);

  // Toast Helper
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  }, []);

  // Fetch Authoritative Database Catalog
  const loadDatabaseProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await safeFetchJson('/api/products');
      if (res.ok && Array.isArray(res.data?.products) && res.data.products.length > 0) {
        setProducts(res.data.products);
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
      const res = await safeFetchJson('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok && res.data?.user) {
        setCurrentUser(res.data.user);
      } else if (!res.isHtml && !res.isNetworkError) {
        localStorage.removeItem('accessories_customer_token');
        setCurrentUser(null);
      }
    } catch (e) {
      // Ignored
    }
  }, []);

  // Initial Data, Authentication & Analytics Setup
  useEffect(() => {
    initUmami();
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

  // Sync comparison to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tech_comparison_ids', JSON.stringify(comparisonIds));
    } catch (e) {}
  }, [comparisonIds]);

  // Sync recently viewed to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tech_recent_ids', JSON.stringify(recentIds));
    } catch (e) {}
  }, [recentIds]);

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

    setIsCartView(false);
    setCheckoutItems(null);
    if (prod) {
      setSelectedProduct(prod);
      setActiveModal(null);
      // Track recently viewed
      if (prod.id) {
        setRecentIds(prev => [prod.id, ...prev.filter(id => id !== prod.id)].slice(0, 10));
      }
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

  // Comparison Handlers
  const handleToggleCompare = useCallback((product) => {
    if (!product || !product.id) return;
    setComparisonIds(prev => {
      if (prev.includes(product.id)) {
        showToast(lang === 'bn' ? `${product.title} তুলনা থেকে সরানো হয়েছে` : `Removed ${product.title} from comparison`);
        return prev.filter(id => id !== product.id);
      } else {
        if (prev.length >= 4) {
          showToast(lang === 'bn' ? 'একসাথে সর্বোচ্চ ৪টি পণ্য তুলনা করা যাবে' : 'Maximum 4 products can be compared at once');
          return prev;
        }
        showToast(lang === 'bn' ? `${product.title} তুলনায় যুক্ত হয়েছে` : `Added ${product.title} to comparison`);
        return [...prev, product.id];
      }
    });
  }, [lang, showToast]);

  const handleRemoveFromCompare = useCallback((productId) => {
    setComparisonIds(prev => prev.filter(id => id !== productId));
  }, []);

  const handleClearComparison = useCallback(() => {
    setComparisonIds([]);
    showToast(lang === 'bn' ? 'তুলনা তালিকা খালি করা হয়েছে' : 'Cleared comparison list');
  }, [lang, showToast]);

  // Dedicated Amazon-Style Cart Page Navigation (Full page, zero overlapping)
  const navigateToCart = useCallback((pushHistory = true) => {
    setIsCartView(true);
    setIsCheckoutView(false);
    setIsAdminView(false);
    setSelectedProduct(null);
    setActiveModal(null);
    if (pushHistory) {
      window.history.pushState({ view: 'cart' }, '', '/cart');
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Dedicated Amazon Checkout Navigation (Full page, zero overlapping)
  const navigateToCheckout = useCallback((itemsToCheckout = null, pushHistory = true) => {
    if (itemsToCheckout && Array.isArray(itemsToCheckout) && itemsToCheckout.length > 0) {
      setCheckoutItems(itemsToCheckout);
    } else {
      setCheckoutItems(null);
    }
    setIsCheckoutView(true);
    setIsCartView(false);
    setIsAdminView(false);
    setSelectedProduct(null);
    setActiveModal(null);
    if (pushHistory) {
      window.history.pushState({ view: 'checkout' }, '', '/checkout');
    }
    trackCheckoutStarted(itemsToCheckout && itemsToCheckout.length > 0 ? itemsToCheckout : cart);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [cart]);

  const handleAddAllComparedToBag = useCallback((comparedProducts) => {
    if (!comparedProducts || comparedProducts.length === 0) return;
    setCart((prevCart) => {
      let nextCart = [...prevCart];
      for (const prod of comparedProducts) {
        const defaultVariant = prod.variants ? prod.variants[0] : null;
        const variantId = defaultVariant?.id || 'default';
        const existingIdx = nextCart.findIndex(
          item => item.id === prod.id && (item.variant?.id || 'default') === variantId
        );
        if (existingIdx > -1) {
          nextCart[existingIdx] = {
            ...nextCart[existingIdx],
            quantity: nextCart[existingIdx].quantity + 1
          };
        } else {
          nextCart.push({
            id: prod.id,
            sku: prod.sku || prod.id,
            title: prod.title,
            titleBn: prod.titleBn,
            price: prod.price,
            image: prod.image,
            category: prod.category,
            variant: defaultVariant,
            quantity: 1
          });
        }
      }
      return nextCart;
    });
    showToast(lang === 'bn' ? 'সকল তুলনা পণ্য ব্যাগে যুক্ত করা হয়েছে!' : 'All compared products added to bag!');
    setActiveModal(null);
    navigateToCart(true);
  }, [lang, navigateToCart, showToast]);

  const handleAddKitToBag = useCallback((kitProducts, kitName) => {
    if (!kitProducts || kitProducts.length === 0) return;
    setCart((prevCart) => {
      let nextCart = [...prevCart];
      for (const prod of kitProducts) {
        const defaultVariant = prod.variants ? prod.variants[0] : null;
        const variantId = defaultVariant?.id || 'default';
        const existingIdx = nextCart.findIndex(
          item => item.id === prod.id && (item.variant?.id || 'default') === variantId
        );
        if (existingIdx > -1) {
          nextCart[existingIdx] = {
            ...nextCart[existingIdx],
            quantity: nextCart[existingIdx].quantity + 1
          };
        } else {
          nextCart.push({
            id: prod.id,
            sku: prod.sku || prod.id,
            title: prod.title,
            titleBn: prod.titleBn,
            price: prod.price,
            image: prod.image,
            category: prod.category,
            variant: defaultVariant,
            quantity: 1
          });
        }
      }
      return nextCart;
    });
    showToast(lang === 'bn' ? `🎉 ${kitName} ব্যাগে যুক্ত হয়েছে!` : `🎉 ${kitName} added to bag!`);
    navigateToCart(true);
  }, [lang, navigateToCart, showToast]);

  // Navigate back to Home / Catalog
  const navigateToHome = useCallback((pushHistory = true) => {
    setSelectedProduct(null);
    setIsCartView(false);
    setIsCheckoutView(false);
    setIsAdminView(false);
    setCheckoutItems(null);
    if (pushHistory) {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Navigate to category from breadcrumb or category link
  const navigateToCategory = useCallback((catId) => {
    setSelectedProduct(null);
    setIsCartView(false);
    setIsCheckoutView(false);
    setIsAdminView(false);
    setCheckoutItems(null);
    setSelectedCategory(catId);
    window.history.pushState(null, '', '/');
    setTimeout(() => {
      scrollToSection('products-section');
    }, 50);
  }, []);

  // Hash & URL Routing Synchronization (Direct links, SPA fallback & browser back/forward)
  useEffect(() => {
    const handleUrlRouting = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;

      // 0. Dedicated Private Staff Admin Routing (/admin, #admin, or ?view=admin)
      if (pathname === '/admin' || pathname === '/admin/' || hash === '#admin' || hash.startsWith('#admin?') || search.includes('view=admin')) {
        setIsAdminView(true);
        setIsCartView(false);
        setIsCheckoutView(false);
        setSelectedProduct(null);
        setActiveModal(null);
        document.title = 'Staff Console — Tech Vartual Tutor';
        return;
      }

      // 1. Dedicated Cart Page routing (/cart, #cart, or ?view=cart)
      if (pathname === '/cart' || pathname === '/cart/' || hash === '#cart' || hash.startsWith('#cart?') || search.includes('view=cart')) {
        setIsCartView(true);
        setIsCheckoutView(false);
        setIsAdminView(false);
        setSelectedProduct(null);
        setActiveModal(null);
        document.title = 'Shopping Cart — Tech Vartual Tutor';
        return;
      }

      // 2. Dedicated Checkout routing (/checkout, #checkout, or ?view=checkout)
      if (pathname === '/checkout' || pathname === '/checkout/' || hash === '#checkout' || hash.startsWith('#checkout?') || search.includes('view=checkout')) {
        setIsCheckoutView(true);
        setIsCartView(false);
        setIsAdminView(false);
        setSelectedProduct(null);
        setActiveModal(null);
        document.title = 'Secure Checkout — Tech Vartual Tutor';
        return;
      }

      // 3. Extract target product ID from any routing convention:
      // A. Standard clean pathname: /product/:id or /product/:id/
      let targetProductId = null;
      const pathMatch = pathname.match(/\/product\/([^/?#]+)/i);
      if (pathMatch) {
        targetProductId = decodeURIComponent(pathMatch[1]).trim();
      }

      // B. Hash-based routing: #/product/:id or #product/:id
      if (!targetProductId && (hash.startsWith('#product/') || hash.startsWith('#/product/'))) {
        const hashMatch = hash.match(/^#\/?product\/([^/?#]+)/i);
        if (hashMatch) {
          targetProductId = decodeURIComponent(hashMatch[1]).trim();
        }
      }

      // C. Query param fallback: ?product=:id or ?p=/product/:id
      if (!targetProductId && search) {
        try {
          const searchParams = new URLSearchParams(search);
          const queryP = searchParams.get('product') || searchParams.get('p');
          if (queryP) {
            const cleanQueryP = queryP.replace(/^\/?(?:product\/)?/, '').split('/')[0].split('?')[0];
            if (cleanQueryP) targetProductId = decodeURIComponent(cleanQueryP).trim();
          }
        } catch (e) {}
      }

      // Process product resolution
      if (targetProductId) {
        const found = products.find(p => p.id === targetProductId) || INITIAL_PRODUCTS.find(p => p.id === targetProductId);
        setIsCartView(false);
        if (found) {
          setSelectedProduct(found);
          // If arrived via hash or query param fallback on a server with SPA rewrite support, cleanly normalize URL bar
          if ((hash.includes('product/') || search.includes('product') || search.includes('p=')) && window.history?.replaceState) {
            window.history.replaceState({ productId: found.id }, '', `/product/${found.id}`);
          }
        } else {
          setSelectedProduct({ id: targetProductId, notFound: true, title: 'Product Not Found' });
        }
      } else if (!hash.startsWith('#') && (pathname === '/' || pathname === '')) {
        setSelectedProduct(null);
        setIsCartView(false);
      }

      // Hash modal routing
      if (hash === '#account') {
        setActiveModal('account');
      } else if (hash === '#admin') {
        setActiveModal('admin');
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
        safeFetchJson('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            val_id: valId,
            sessionId,
            status: 'success'
          })
        })
          .then(res => {
            if (res.ok && res.data?.verified && res.data?.order) {
              const fullOrder = { ...res.data.order, guestToken: token || res.data.order.guestToken };
              setConfirmedOrder(fullOrder);
              setCart([]);
              setActiveModal('order_success');
              trackPurchaseCompleted(fullOrder);
            } else {
              showToast(res.error || 'Payment verification failed');
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

    trackAddToCart(product, quantity, variant);
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
    navigateToCart(true);
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
    navigateToCheckout();
  };

  // Order Placed Success Handler
  const handleOrderSuccess = (order, guestToken = null) => {
    const fullOrder = { ...order, guestToken: guestToken || order.guestToken };
    setConfirmedOrder(fullOrder);
    setCart([]);
    setActiveModal('order_success');
    trackPurchaseCompleted(fullOrder);
  };

  // Online Payment Initiated
  const handleInitiateOnlinePayment = (order, sessionData) => {
    if (sessionData.provider === 'sandbox' || sessionData.provider === 'uddoktapay' || sessionData.provider === 'paymently' || sessionData.isPaymently) {
      setPaymentSessionInfo({
        orderId: order.id,
        sessionId: sessionData.sessionId || sessionData.invoiceId,
        amount: order.total,
        paymentLink: sessionData.paymentLink,
        redirectUrl: sessionData.redirectUrl,
        qrCodeUrl: sessionData.qrCodeUrl
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
    trackPurchaseCompleted(verifiedOrder);
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
      const res = await safeFetchJson('/api/admin/inventory/restock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ productId, count, reason: `Quick restock (+${count})` })
      });

      if (!res.ok || !res.data?.success) {
        throw new Error(res.error || 'Server rejected restock request');
      }

      // Update stock ONLY from the successful server response
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: res.data.newStock } : p))
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

  // Full-Page Private Staff Console (Completely Isolated from Storefront)
  if (isAdminView) {
    return (
      <AdminDashboard
        currencySymbol="৳"
        onProductsUpdated={loadDatabaseProducts}
        onExitToStorefront={() => navigateToHome(true)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between relative selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#102A43] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-2xl border border-[#B8E7F8]/40 flex items-center gap-2 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Compact Premium Electronics Store Header (Screenshot 2) */}
      <Header
        storeName={import.meta.env.VITE_STORE_NAME || "Tech Vartual Tutor"}
        t={t}
        lang={lang}
        setLang={setLang}
        currentUser={currentUser}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlistIds.length}
        cartTotal={cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
        onOpenCart={() => navigateToCart(true)}
        onOpenWishlist={() => setActiveModal('wishlist')}
        onOpenSupport={() => setActiveModal('support')}
        onOpenAccount={() => setActiveModal('account')}
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
        onGoHome={() => navigateToHome(true)}
        onGoToShop={() => {
          if (selectedProduct || isCartView) {
            navigateToHome(true);
            setTimeout(() => scrollToSection('products-section'), 50);
          } else {
            scrollToSection('products-section');
          }
        }}
        onSelectCategory={navigateToCategory}
        onSelectProduct={(p) => navigateToProduct(p, true)}
        products={products}
      />

      {/* Main Content Area */}
      <main className={selectedProduct || isCartView || isCheckoutView ? "flex-grow w-full" : "w-full flex-grow"}>
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
            onToggleCompare={handleToggleCompare}
            comparisonIds={comparisonIds}
            onBackToHome={() => navigateToHome(true)}
            onSelectCategory={navigateToCategory}
            onSelectProduct={(p) => navigateToProduct(p, true)}
            currencySymbol="৳"
            t={t}
            lang={lang}
          />
        ) : isCartView ? (
          <CartPage
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onProceedToCheckout={(selectedItems) => navigateToCheckout(selectedItems)}
            onContinueShopping={() => navigateToHome(true)}
            onSelectProduct={(p) => navigateToProduct(p, true)}
            allProducts={products}
            onAddToCart={handleAddToCart}
            currencySymbol="৳"
            t={t}
            lang={lang}
          />
        ) : isCheckoutView ? (
          <CheckoutModal
            isPage={true}
            onClose={() => navigateToCart(true)}
            cart={checkoutItems && checkoutItems.length > 0 ? checkoutItems : cart}
            currentUser={currentUser}
            onOrderSuccess={handleOrderSuccess}
            onInitiateOnlinePayment={handleInitiateOnlinePayment}
            currencySymbol="৳"
            t={t}
            lang={lang}
          />
        ) : (
          <>
            {/* 1. Main Hero Spotlight Banner (Screenshot 1 & 2) */}
            <Hero
              onShopClick={() => {
                setSelectedCategory(null);
                scrollToSection('products-section');
              }}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                scrollToSection('products-section');
              }}
              onSelectProduct={(p) => navigateToProduct(p, true)}
              onOpenDetail={(p) => navigateToProduct(p, true)}
              products={products}
              t={t}
              lang={lang}
            />

            {/* 2. Category Icon Row (Screenshot 1 Section C) */}
            <CategoryIconRow
              onSelectCategory={navigateToCategory}
              onNavigateSection={scrollToSection}
              selectedCategory={selectedCategory}
              lang={lang}
            />

            {/* 3. Featured Category Cards - 3 Columns (Screenshot 2 Section D) */}
            <FeaturedCategoryCards
              onSelectCategory={navigateToCategory}
              onOpenDetail={(p) => navigateToProduct(p, true)}
              onNavigateSection={scrollToSection}
              products={products}
            />

            {/* 4. Lifestyle Promotional Photographic Banners (Screenshot 1 Section E) */}
            <LifestylePromoBanners
              onSelectCategory={navigateToCategory}
              onNavigateSection={scrollToSection}
            />

            {/* 5. Hot Deals Section with Countdown Timer (Screenshot 1 Section F) */}
            <HotDealsSection
              products={products}
              currencySymbol="৳"
              onQuickAdd={(p) => handleAddToCart(p, p.variants?.[0], 1)}
              onOpenDetail={(p) => navigateToProduct(p, true)}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              lang={lang}
            />

            {/* 6. New In Section with "Shop All New" Action (Screenshot 2 Section F) */}
            <NewInSection
              products={products}
              currencySymbol="৳"
              onQuickAdd={(p) => handleAddToCart(p, p.variants?.[0], 1)}
              onOpenDetail={(p) => navigateToProduct(p, true)}
              onShopAll={() => {
                setSelectedCategory(null);
                scrollToSection('products-section');
              }}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              lang={lang}
            />

            {/* 7. Product Catalog Grid for Direct Filtering & Search */}
            <div id="products-section" className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
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
                onToggleCompare={handleToggleCompare}
                comparisonIds={comparisonIds}
                t={t}
                lang={lang}
              />
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
        onOpenCheckout={() => navigateToCheckout()}
        onRevalidateCart={handleRevalidateCart}
        currencySymbol="৳"
        t={t}
        lang={lang}
      />

      {/* 3. Checkout Modal (when triggered via modal flow) */}
      {!isCheckoutView && (
        <CheckoutModal
          isOpen={activeModal === 'checkout'}
          isPage={false}
          onClose={() => {
            setActiveModal(null);
            setCheckoutItems(null);
          }}
          cart={checkoutItems && checkoutItems.length > 0 ? checkoutItems : cart}
          currentUser={currentUser}
          onOrderSuccess={handleOrderSuccess}
          onInitiateOnlinePayment={handleInitiateOnlinePayment}
          currencySymbol="৳"
          t={t}
          lang={lang}
        />
      )}

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
        lang={lang}
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

      {/* 9. Customer Support Modal */}
      <SupportModal
        isOpen={activeModal === 'support'}
        onClose={() => setActiveModal(null)}
        t={t}
        lang={lang}
      />

      {/* 10. Side-by-Side Product Comparison Modal */}
      {activeModal === 'comparison' && (
        <ProductComparisonModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          comparisonIds={comparisonIds}
          products={products}
          onRemoveItem={handleRemoveFromCompare}
          onClearAll={handleClearComparison}
          onAddToCart={(p) => handleAddToCart(p, p.variants?.[0], 1)}
          onAddAllToBag={handleAddAllComparedToBag}
          onSelectProduct={(p) => {
            setActiveModal(null);
            navigateToProduct(p, true);
          }}
          currencySymbol="৳"
          lang={lang}
          t={t}
        />
      )}

      {/* Floating Persistent Comparison Drawer */}
      <ComparisonBar
        comparisonIds={comparisonIds}
        products={products}
        onOpenModal={() => setActiveModal('comparison')}
        onRemoveItem={handleRemoveFromCompare}
        onClearAll={handleClearComparison}
        lang={lang}
        t={t}
      />

      {/* Concise Customer Footer */}
      <Footer
        storeName={import.meta.env.VITE_STORE_NAME || "Tech Vartual Tutor"}
        onOpenSupport={() => setActiveModal('support')}
        onOpenTracking={() => {
          setTrackingOrderId('');
          setTrackingToken('');
          setActiveModal('tracking');
        }}
        onSelectCategory={(catId) => {
          navigateToCategory(catId);
        }}
        t={t}
        lang={lang}
      />
    </div>
  );
}
