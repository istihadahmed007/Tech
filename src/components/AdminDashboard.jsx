import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  RefreshCw, 
  Package, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Search,
  Plus,
  Edit2,
  Archive,
  Eye,
  CheckCircle2,
  Clock,
  Upload,
  Layers,
  Sparkles,
  Tag,
  Check,
  Percent,
  Printer,
  FileText,
  Download,
  CheckSquare,
  Square,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  ArrowRight,
  Filter,
  ChevronDown,
  ChevronRight,
  User,
  EyeOff,
  AlertCircle,
  Copy,
  Truck,
  CreditCard
} from 'lucide-react';
import { openPrintWindow, openBatchPrintWindow } from '../utils/invoice.js';
import { safeFetchJson } from '../utils/api.js';

export default function AdminDashboard({ 
  currencySymbol = "৳",
  onProductsUpdated,
  onExitToStorefront
}) {
  // Session Authentication State
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('accessories_admin_token') || null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Tab: 'overview' | 'orders' | 'products' | 'inventory' | 'promotions' | 'reviews'
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data Collections
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [adjustments, setAdjustments] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  // Filters: Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [orderPaymentStatusFilter, setOrderPaymentStatusFilter] = useState('');
  const [orderPaymentMethodFilter, setOrderPaymentMethodFilter] = useState('');
  const [orderDateRange, setOrderDateRange] = useState('all');
  const [selectedOrderIds, setSelectedOrderIds] = useState(new Set());
  const [focusedOrder, setFocusedOrder] = useState(null);

  // Filters: Products & Inventory
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('');
  const [productPublicationFilter, setProductPublicationFilter] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState('all'); // 'all', 'low', 'out', 'in'

  // Modals & Drawers
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [stockAdjustmentTarget, setStockAdjustmentTarget] = useState(null);
  const [stockDelta, setStockDelta] = useState(10);
  const [stockAdjustmentMode, setStockAdjustmentMode] = useState('add'); // 'add', 'deduct', 'set'
  const [stockReason, setStockReason] = useState('Restock shipment received');
  const [stockNotes, setStockNotes] = useState('');

  // Promotions Form
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [newPromo, setNewPromo] = useState({
    code: '',
    title: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 1000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  });

  // Reusable Confirmation Dialog State
  const [confirmationDialog, setConfirmationDialog] = useState(null);

  // Category & Brand Management State
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catForm, setCatForm] = useState({ id: '', name: '', nameBn: '', description: '', badge: '' });

  // Customer Management State
  const [customers, setCustomers] = useState([]);

  // Shipping & Delivery Configuration State
  const [shippingSettings, setShippingSettings] = useState({
    insideDhakaFee: 60,
    outsideDhakaFee: 120,
    freeShippingThreshold: 2000,
    insideDhakaEta: '1–2 Business Days',
    outsideDhakaEta: '2–4 Business Days',
    codAvailable: true,
    supportPhone: '+880 1700-000000',
    supportEmail: 'support@technest.com.bd'
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Auto-dismiss transient action alerts
  const showToast = useCallback((msg, type = 'success') => {
    setActionMessage({ text: msg, type });
    setTimeout(() => setActionMessage(null), 4000);
  }, []);

  // Check & load data when tab changes or auth token updates
  useEffect(() => {
    if (authToken) {
      loadTabData(activeTab);
    }
  }, [authToken, activeTab]);

  const loadTabData = async (tab) => {
    setLoading(true);
    const headers = { Authorization: `Bearer ${authToken}` };

    try {
      if (tab === 'overview') {
        const [dashRes, ordersRes, prodRes, revRes] = await Promise.all([
          safeFetchJson('/api/admin/dashboard', { headers }),
          safeFetchJson('/api/admin/orders?limit=200', { headers }),
          safeFetchJson('/api/admin/products', { headers }),
          safeFetchJson('/api/admin/reviews', { headers })
        ]);

        if (dashRes.ok && dashRes.data?.metrics) setMetrics(dashRes.data.metrics);
        if (ordersRes.ok && ordersRes.data?.orders) setOrders(ordersRes.data.orders);
        if (prodRes.ok && prodRes.data?.products) setProducts(prodRes.data.products);
        if (revRes.ok && revRes.data?.reviews) setReviews(revRes.data.reviews);
      } else if (tab === 'orders') {
        let url = '/api/admin/orders?limit=200';
        if (orderStatusFilter) url += `&status=${orderStatusFilter}`;
        if (orderSearch) url += `&search=${encodeURIComponent(orderSearch)}`;
        const res = await safeFetchJson(url, { headers });
        if (res.ok && res.data?.orders) setOrders(res.data.orders);
      } else if (tab === 'products') {
        const res = await safeFetchJson('/api/admin/products', { headers });
        if (res.ok && res.data?.products) setProducts(res.data.products);
      } else if (tab === 'inventory') {
        const [prodRes, adjRes] = await Promise.all([
          safeFetchJson('/api/admin/products', { headers }),
          safeFetchJson('/api/admin/inventory/adjustments', { headers })
        ]);
        if (prodRes.ok && prodRes.data?.products) setProducts(prodRes.data.products);
        if (adjRes.ok && adjRes.data?.adjustments) setAdjustments(adjRes.data.adjustments);
      } else if (tab === 'promotions') {
        const res = await safeFetchJson('/api/admin/promotions', { headers });
        if (res.ok && res.data?.promotions) setPromotions(res.data.promotions);
      } else if (tab === 'reviews') {
        const res = await safeFetchJson('/api/admin/reviews', { headers });
        if (res.ok && res.data?.reviews) setReviews(res.data.reviews);
      } else if (tab === 'categories') {
        const [catRes, brandRes] = await Promise.all([
          safeFetchJson('/api/admin/categories', { headers }),
          safeFetchJson('/api/admin/brands', { headers })
        ]);
        if (catRes.ok && catRes.data?.categories) setCategories(catRes.data.categories);
        if (brandRes.ok && brandRes.data?.brands) setBrands(brandRes.data.brands);
      } else if (tab === 'customers') {
        const res = await safeFetchJson('/api/admin/customers', { headers });
        if (res.ok && res.data?.customers) setCustomers(res.data.customers);
      } else if (tab === 'shipping') {
        const res = await safeFetchJson('/api/admin/shipping/config', { headers });
        if (res.ok && res.data?.settings) setShippingSettings(res.data.settings);
      }
    } catch (err) {
      console.warn('Failed to load admin tab data:', err);
      if (err.message && err.message.includes('403')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Sign in handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!username.trim() || !password.trim()) {
      setLoginError('Please enter both your staff username and password.');
      return;
    }
    setLoginLoading(true);

    try {
      const res = await safeFetchJson('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password })
      });

      if (!res.ok || !res.data?.success) {
        if (res.isHtml) {
          throw new Error('Backend route (/api/admin/login) returned an HTML page (200). The Node.js backend server is not running on this domain/host. Hostinger is currently serving only the static frontend build. Please start the Node.js application in your hosting panel (Hostinger hPanel → Node.js with entry server.js) or configure VITE_API_BASE_URL.');
        }
        throw new Error(res.error || 'Invalid admin credentials');
      }

      setAuthToken(res.data.token);
      localStorage.setItem('accessories_admin_token', res.data.token);
      setPassword('');
      setUsername('');
      setActiveTab('overview');
      showToast('Successfully signed in to Staff Console');
    } catch (err) {
      setLoginError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Sign out handler
  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('accessories_admin_token');
    setMetrics(null);
    setOrders([]);
    setProducts([]);
    showToast('Signed out of Staff Console', 'info');
  };

  // Orders Actions
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await safeFetchJson(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status: newStatus, note: `Status updated by staff to ${newStatus}` })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (focusedOrder && focusedOrder.id === orderId) {
          setFocusedOrder(prev => ({ ...prev, status: newStatus }));
        }
        showToast(`Order #${orderId} status updated to ${newStatus}`);
      }
    } catch (err) {
      showToast('Failed to update order status', 'error');
    }
  };

  const collectCod = async (orderId, amount) => {
    try {
      const res = await safeFetchJson(`/api/admin/orders/${orderId}/collect-cod`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ amount, note: `Physical COD cash of ৳${amount} collected` })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: 'paid' } : o));
        if (focusedOrder && focusedOrder.id === orderId) {
          setFocusedOrder(prev => ({ ...prev, paymentStatus: 'paid' }));
        }
        showToast(`Recorded ৳${amount.toLocaleString()} COD payment for #${orderId}`);
      }
    } catch (err) {
      showToast('Failed to record COD payment', 'error');
    }
  };

  // Stock Adjustment Action
  const handleStockAdjustmentSubmit = async (e) => {
    e.preventDefault();
    if (!stockAdjustmentTarget) return;

    let computedDelta = parseInt(stockDelta, 10);
    if (isNaN(computedDelta)) return;

    if (stockAdjustmentMode === 'deduct') {
      computedDelta = -Math.abs(computedDelta);
    } else if (stockAdjustmentMode === 'set') {
      computedDelta = computedDelta - (stockAdjustmentTarget.stock || 0);
    } else {
      computedDelta = Math.abs(computedDelta);
    }

    const newProjectedStock = Math.max(0, (stockAdjustmentTarget.stock || 0) + computedDelta);

    // Require explicit confirmation
    setConfirmationDialog({
      title: 'Confirm Stock Adjustment',
      message: `You are about to change the stock of "${stockAdjustmentTarget.title}" (SKU: ${stockAdjustmentTarget.sku}) from ${stockAdjustmentTarget.stock} to ${newProjectedStock} (change: ${computedDelta > 0 ? '+' : ''}${computedDelta}). Reason: "${stockReason}".`,
      confirmLabel: 'Apply Adjustment',
      isDestructive: false,
      onConfirm: async () => {
        try {
          const res = await safeFetchJson(`/api/admin/products/${stockAdjustmentTarget.id}/adjust-stock`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify({
              delta: computedDelta,
              reason: stockReason,
              notes: stockNotes || undefined
            })
          });

          if (res.ok && res.data?.product) {
            setProducts(prev => prev.map(p => p.id === stockAdjustmentTarget.id ? res.data.product : p));
            if (onProductsUpdated) onProductsUpdated();
            setStockAdjustmentTarget(null);
            showToast(`Stock for ${stockAdjustmentTarget.sku} updated to ${res.data.product.stock}`);
            loadTabData('inventory');
          } else {
            throw new Error(res.error || 'Failed to adjust stock');
          }
        } catch (err) {
          showToast(err.message, 'error');
        } finally {
          setConfirmationDialog(null);
        }
      }
    });
  };

  // Product Archive Action
  const toggleProductArchive = (product) => {
    const isArchived = product.status === 'archived';
    const nextStatus = isArchived ? 'active' : 'archived';
    setConfirmationDialog({
      title: isArchived ? 'Restore Product to Catalog' : 'Archive Product',
      message: isArchived 
        ? `This will make "${product.title}" visible again to customers on the storefront.`
        : `This will immediately hide "${product.title}" from the customer storefront and search results. It can be restored at any time.`,
      confirmLabel: isArchived ? 'Restore to Catalog' : 'Archive Product',
      isDestructive: !isArchived,
      onConfirm: async () => {
        try {
          const res = await safeFetchJson(`/api/admin/products/${product.id}/status`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify({ status: nextStatus })
          });
          if (res.ok) {
            setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: nextStatus } : p));
            if (onProductsUpdated) onProductsUpdated();
            showToast(`Product ${nextStatus === 'archived' ? 'archived' : 'restored'}`);
          }
        } catch (err) {
          showToast('Failed to change product status', 'error');
        } finally {
          setConfirmationDialog(null);
        }
      }
    });
  };

  // Promotion Delete Action
  const deletePromotion = (promo) => {
    setConfirmationDialog({
      title: 'Delete Promotion Code',
      message: `Are you sure you want to permanently remove discount code "${promo.code}"? Customers will no longer be able to apply it at checkout.`,
      confirmLabel: 'Delete Promotion',
      isDestructive: true,
      onConfirm: async () => {
        try {
          const res = await safeFetchJson(`/api/admin/promotions/${promo.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${authToken}` }
          });
          if (res.ok) {
            setPromotions(prev => prev.filter(p => p.id !== promo.id));
            showToast(`Promotion "${promo.code}" deleted`);
          }
        } catch (err) {
          showToast('Failed to delete promotion', 'error');
        } finally {
          setConfirmationDialog(null);
        }
      }
    });
  };

  // Review Status Action
  const updateReviewStatus = async (reviewId, newStatus) => {
    if (newStatus === 'rejected') {
      setConfirmationDialog({
        title: 'Reject Customer Review',
        message: 'Are you sure you want to reject this review? It will not be visible on the public product page.',
        confirmLabel: 'Reject Review',
        isDestructive: true,
        onConfirm: async () => {
          await submitReviewStatus(reviewId, newStatus);
          setConfirmationDialog(null);
        }
      });
    } else {
      await submitReviewStatus(reviewId, newStatus);
    }
  };

  const submitReviewStatus = async (reviewId, newStatus) => {
    try {
      const res = await safeFetchJson(`/api/admin/reviews/${reviewId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: newStatus } : r));
        showToast(`Review marked as ${newStatus}`);
      }
    } catch (err) {
      showToast('Failed to update review status', 'error');
    }
  };

  // Computed Needs Attention Metrics
  const needsAttention = useMemo(() => {
    const ordersToProcess = orders.filter(o => o.status === 'pending' || o.status === 'confirmed');
    const paymentIssues = orders.filter(o => o.paymentMethod !== 'cod' && o.paymentStatus !== 'paid' && o.status !== 'cancelled');
    const lowStockItems = products.filter(p => (p.stock ?? 0) <= 5);
    const pendingReviews = reviews.filter(r => r.status === 'pending');

    return {
      ordersToProcessCount: ordersToProcess.length,
      paymentIssuesCount: paymentIssues.length,
      lowStockCount: lowStockItems.length,
      pendingReviewsCount: pendingReviews.length,
      totalAlerts: ordersToProcess.length + paymentIssues.length + lowStockItems.length + pendingReviews.length
    };
  }, [orders, products, reviews]);

  // Filtered Orders List
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (orderStatusFilter && order.status !== orderStatusFilter) return false;
      if (orderPaymentStatusFilter && order.paymentStatus !== orderPaymentStatusFilter) return false;
      if (orderPaymentMethodFilter && order.paymentMethod !== orderPaymentMethodFilter) return false;
      if (orderSearch) {
        const q = orderSearch.toLowerCase();
        const idMatch = order.id?.toLowerCase().includes(q);
        const nameMatch = order.customer?.name?.toLowerCase().includes(q);
        const phoneMatch = order.customer?.phone?.includes(q);
        if (!idMatch && !nameMatch && !phoneMatch) return false;
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderPaymentStatusFilter, orderPaymentMethodFilter, orderSearch]);

  // Filtered Products List
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (productCategoryFilter && p.category !== productCategoryFilter) return false;
      if (productPublicationFilter === 'active' && p.status === 'archived') return false;
      if (productPublicationFilter === 'archived' && p.status !== 'archived') return false;
      if (productStockFilter === 'out' && (p.stock ?? 0) > 0) return false;
      if (productStockFilter === 'low' && ((p.stock ?? 0) <= 0 || (p.stock ?? 0) > 5)) return false;
      if (productStockFilter === 'in' && (p.stock ?? 0) <= 5) return false;
      if (productSearch) {
        const q = productSearch.toLowerCase();
        const titleMatch = p.title?.toLowerCase().includes(q);
        const skuMatch = p.sku?.toLowerCase().includes(q);
        if (!titleMatch && !skuMatch) return false;
      }
      return true;
    });
  }, [products, productCategoryFilter, productPublicationFilter, productStockFilter, productSearch]);

  const handleOpenCatModal = (cat = null) => {
    if (cat) {
      setEditingCat(cat);
      setCatForm({
        id: cat.id,
        name: cat.name,
        nameBn: cat.nameBn || '',
        description: cat.description || '',
        badge: cat.badge || ''
      });
    } else {
      setEditingCat(null);
      setCatForm({ id: '', name: '', nameBn: '', description: '', badge: '' });
    }
    setShowCatModal(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catForm.name.trim()) return;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    };
    try {
      if (editingCat) {
        const res = await safeFetchJson(`/api/admin/categories/${editingCat.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(catForm)
        });
        if (res.ok) {
          showToast(`Category "${catForm.name}" updated successfully`);
          setShowCatModal(false);
          loadTabData('categories');
        } else {
          showToast(res.error || 'Failed to update category', 'error');
        }
      } else {
        const res = await safeFetchJson('/api/admin/categories', {
          method: 'POST',
          headers,
          body: JSON.stringify(catForm)
        });
        if (res.ok) {
          showToast(`Category "${catForm.name}" created successfully`);
          setShowCatModal(false);
          loadTabData('categories');
        } else {
          showToast(res.error || 'Failed to create category', 'error');
        }
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteCategory = (cat) => {
    setConfirmationDialog({
      title: `Delete Category "${cat.name}"?`,
      message: `Are you sure you want to delete this category? Products associated with it should be reassigned.`,
      confirmLabel: 'Delete Category',
      isDestructive: true,
      onConfirm: async () => {
        setConfirmationDialog(null);
        try {
          const res = await safeFetchJson(`/api/admin/categories/${cat.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${authToken}` }
          });
          if (res.ok) {
            showToast(`Category "${cat.name}" deleted`);
            loadTabData('categories');
          } else {
            showToast(res.error || 'Failed to delete category', 'error');
          }
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
    });
  };

  const handleSaveShippingSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await safeFetchJson('/api/admin/shipping/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(shippingSettings)
      });
      if (res.ok) {
        showToast('Shipping and delivery configuration saved successfully');
      } else {
        showToast(res.error || 'Failed to save shipping settings', 'error');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 1. PRIVATE SIGN-IN SCREEN (When Unauthenticated)
  // ---------------------------------------------------------------------------
  if (!authToken) {
    return (
      <div className="min-h-screen bg-[#F7FBFF] flex flex-col items-center justify-center p-4 sm:p-6 text-[#102A43] font-sans">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#DCEAF1] shadow-sm p-6 sm:p-8 space-y-6">
          {/* Brand Emblem */}
          <div className="flex flex-col items-center text-center space-y-3">
            <img 
              src="/assets/tech-nest-logo-horizontal.png" 
              alt="Tech Nest" 
              className="h-12 w-auto object-contain"
            />
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#102A43]">
                Admin sign in
              </h1>
              <p className="text-xs sm:text-sm text-[#62788A]">
                Private staff portal. Unauthorized access attempts are monitored and recorded.
              </p>
            </div>
          </div>

          {/* Validation & Server Error State */}
          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm space-y-1.5">
              <div className="flex items-start gap-2">
                <AlertTriangle size={18} className="shrink-0 mt-0.5 text-red-600" />
                <span className="font-semibold">{loginError.includes('Backend route') ? 'Backend Server Offline' : 'Sign-In Error'}</span>
              </div>
              <p className="text-[11px] sm:text-xs text-red-800 leading-relaxed pl-6">
                {loginError}
              </p>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#102A43]">
                Staff Username or Email
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="staff@technest.com"
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#DCEAF1] bg-white text-[#102A43] placeholder-[#8FA6BE] focus:outline-none focus:border-[#145CFF] focus:ring-2 focus:ring-[#145CFF]/15 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#102A43]">
                Security Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter staff security password"
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#DCEAF1] bg-white text-[#102A43] placeholder-[#8FA6BE] focus:outline-none focus:border-[#145CFF] focus:ring-2 focus:ring-[#145CFF]/15 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#145CFF] hover:bg-[#0F4BD9] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 cursor-pointer"
            >
              {loginLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Sign In to Admin Console</span>
                </>
              )}
            </button>
          </form>

          {/* Privacy Footnote */}
          <div className="pt-4 border-t border-[#DCEAF1] flex flex-col items-center gap-2 text-center text-[11px] text-[#62788A]">
            <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <ShieldCheck size={14} />
              <span>Cryptographic HMAC Token Protection</span>
            </div>
            {onExitToStorefront && (
              <button 
                onClick={onExitToStorefront}
                className="text-[#145CFF] hover:underline pt-1 cursor-pointer font-medium"
              >
                ← Return to Public Storefront
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. AUTHENTICATED STAFF DASHBOARD (Full-Page Layout)
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F7FBFF] text-[#102A43] flex flex-col lg:flex-row font-sans">
      {/* Toast Notification Alert */}
      {actionMessage && (
        <div className={`fixed top-4 right-4 z-50 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold shadow-md flex items-center gap-2 transition-all ${
          actionMessage.type === 'error' ? 'bg-red-600 text-white' :
          actionMessage.type === 'info' ? 'bg-[#102A43] text-white' :
          'bg-emerald-600 text-white'
        }`}>
          <CheckCircle2 size={16} />
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Reusable Confirmation Dialog */}
      {confirmationDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102A43]/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#DCEAF1] shadow-lg p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                confirmationDialog.isDestructive ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-[#145CFF]'
              }`}>
                {confirmationDialog.isDestructive ? <AlertTriangle size={20} /> : <AlertCircle size={20} />}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#102A43]">{confirmationDialog.title}</h3>
                <p className="text-xs sm:text-sm text-[#62788A] mt-1 leading-relaxed">
                  {confirmationDialog.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#DCEAF1]">
              <button
                type="button"
                onClick={() => setConfirmationDialog(null)}
                className="px-4 py-2 rounded-xl border border-[#DCEAF1] text-xs font-semibold text-[#62788A] hover:bg-[#F0F7FD] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmationDialog.onConfirm}
                className={`px-4 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer ${
                  confirmationDialog.isDestructive 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-[#145CFF] hover:bg-[#0F4BD9]'
                }`}
              >
                {confirmationDialog.confirmLabel || 'Proceed'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* MOBILE TOPBAR (390px Viewport) */}
      {/* --------------------------------------------------------------------- */}
      <header className="lg:hidden bg-white border-b border-[#DCEAF1] px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-2 rounded-lg text-[#62788A] hover:bg-[#F0F7FD]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-[#102A43]">Staff Console</span>
            <span className="text-[10px] font-semibold bg-[#DDF4FC] text-[#145CFF] px-2 py-0.5 rounded-full">v1.2</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="p-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-[#102A43]/40 backdrop-blur-xs flex">
          <div className="w-64 max-w-[80vw] bg-white h-full p-4 flex flex-col justify-between border-r border-[#DCEAF1] shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#DCEAF1]">
                <span className="font-bold text-sm text-[#102A43]">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-[#62788A]">
                  <X size={18} />
                </button>
              </div>

              <nav className="space-y-1">
                {[
                  { id: 'overview', label: 'Overview', icon: TrendingUp, alertCount: needsAttention.totalAlerts },
                  { id: 'orders', label: 'Orders', icon: Package, alertCount: needsAttention.ordersToProcessCount },
                  { id: 'products', label: 'Products', icon: Layers },
                  { id: 'inventory', label: 'Inventory & Restock', icon: RefreshCw, alertCount: needsAttention.lowStockCount },
                  { id: 'categories', label: 'Categories & Brands', icon: Tag },
                  { id: 'customers', label: 'Customers', icon: User },
                  { id: 'shipping', label: 'Delivery & Shipping', icon: Truck },
                  { id: 'promotions', label: 'Promotions', icon: Percent },
                  { id: 'reviews', label: 'Reviews Moderation', icon: Sparkles, alertCount: needsAttention.pendingReviewsCount }
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive ? 'bg-[#145CFF] text-white' : 'text-[#62788A] hover:bg-[#F0F7FD] hover:text-[#102A43]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </div>
                      {item.alertCount > 0 && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                          isActive ? 'bg-white text-[#145CFF]' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.alertCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#DCEAF1] space-y-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
              {onExitToStorefront && (
                <button
                  onClick={onExitToStorefront}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#62788A] hover:bg-[#F0F7FD] rounded-xl"
                >
                  <ArrowLeft size={14} />
                  <span>Exit to Storefront</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* DESKTOP SIDEBAR (1440px Viewport) */}
      {/* --------------------------------------------------------------------- */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-[#DCEAF1] flex-col justify-between shrink-0 h-screen sticky top-0 shadow-2xs">
        <div className="p-5 space-y-6">
          {/* Brand & Console Title */}
          <div className="space-y-2">
            <img 
              src="/assets/tech-nest-logo-horizontal.png" 
              alt="Tech Nest" 
              className="h-10 w-auto object-contain"
            />
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-[#102A43] tracking-wider uppercase">
                Staff Console
              </span>
              <span className="text-[10px] font-bold bg-[#DDF4FC] text-[#145CFF] px-2 py-0.5 rounded-full">
                Protected
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp, alertCount: needsAttention.totalAlerts },
              { id: 'orders', label: 'Orders', icon: Package, alertCount: needsAttention.ordersToProcessCount },
              { id: 'products', label: 'Products', icon: Layers },
              { id: 'inventory', label: 'Inventory', icon: RefreshCw, alertCount: needsAttention.lowStockCount },
              { id: 'categories', label: 'Categories & Brands', icon: Tag },
              { id: 'customers', label: 'Customers', icon: User },
              { id: 'shipping', label: 'Delivery & Shipping', icon: Truck },
              { id: 'promotions', label: 'Promotions', icon: Percent },
              { id: 'reviews', label: 'Reviews', icon: Sparkles, alertCount: needsAttention.pendingReviewsCount }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#145CFF] text-white shadow-2xs' 
                      : 'text-[#62788A] hover:bg-[#F0F7FD] hover:text-[#102A43]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.alertCount > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-[#145CFF]' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.alertCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#DCEAF1] space-y-2">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-[#F7FBFF] text-[11px] text-[#62788A]">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate">Staff Session Active</span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>

          {onExitToStorefront && (
            <button
              onClick={onExitToStorefront}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium text-[#62788A] hover:text-[#102A43] transition-colors cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>Exit to Storefront</span>
            </button>
          )}
        </div>
      </aside>

      {/* --------------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA */}
      {/* --------------------------------------------------------------------- */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {/* Top Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#DCEAF1]">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#102A43] capitalize">
              {activeTab === 'overview' ? 'Private Overview' : activeTab}
            </h2>
            <p className="text-xs sm:text-sm text-[#62788A] mt-0.5">
              Staff-only operational management console for Tech Nest (Bangladesh).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadTabData(activeTab)}
              disabled={loading}
              className="px-3 py-2 rounded-xl border border-[#DCEAF1] bg-white text-xs font-semibold text-[#102A43] hover:bg-[#F0F7FD] flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            {activeTab === 'orders' && (
              <a
                href={`/api/admin/orders/export-csv?admin_token=${encodeURIComponent(authToken)}`}
                className="px-3 py-2 rounded-xl bg-white border border-[#DCEAF1] text-xs font-semibold text-[#102A43] hover:bg-[#F0F7FD] flex items-center gap-1.5 shadow-2xs"
                download
              >
                <Download size={14} />
                <span>Export CSV</span>
              </a>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------------- */}
        {/* TAB 1: PRIVATE OVERVIEW */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-6 pt-6">
            {/* SECTION 1: NEEDS ATTENTION (Prominently First) */}
            <section className="bg-white rounded-2xl border border-[#DCEAF1] p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <AlertTriangle size={16} />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[#102A43]">
                    Needs Attention
                  </h3>
                </div>
                <span className="text-xs font-semibold text-[#62788A]">
                  {needsAttention.totalAlerts} items require action
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Orders to Process */}
                <div className="p-4 rounded-xl bg-[#F7FBFF] border border-[#DCEAF1] flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#62788A]">Orders to Process</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        needsAttention.ordersToProcessCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {needsAttention.ordersToProcessCount}
                      </span>
                    </div>
                    <p className="text-xs text-[#62788A]">Pending & confirmed orders awaiting dispatch</p>
                  </div>
                  <button
                    onClick={() => {
                      setOrderStatusFilter('pending');
                      setActiveTab('orders');
                    }}
                    className="text-xs font-bold text-[#145CFF] hover:underline flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <span>Review Pending Orders</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* 2. Payment Issues */}
                <div className="p-4 rounded-xl bg-[#F7FBFF] border border-[#DCEAF1] flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#62788A]">Payment Issues</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        needsAttention.paymentIssuesCount > 0 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {needsAttention.paymentIssuesCount}
                      </span>
                    </div>
                    <p className="text-xs text-[#62788A]">Unpaid or failed online gateway checkout sessions</p>
                  </div>
                  <button
                    onClick={() => {
                      setOrderPaymentStatusFilter('unpaid');
                      setActiveTab('orders');
                    }}
                    className="text-xs font-bold text-[#145CFF] hover:underline flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <span>Inspect Payments</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* 3. Low / Out-of-Stock Items */}
                <div className="p-4 rounded-xl bg-[#F7FBFF] border border-[#DCEAF1] flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#62788A]">Stock Alerts</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        needsAttention.lowStockCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {needsAttention.lowStockCount}
                      </span>
                    </div>
                    <p className="text-xs text-[#62788A]">Products at or below 5 units in warehouse</p>
                  </div>
                  <button
                    onClick={() => {
                      setProductStockFilter('low');
                      setActiveTab('inventory');
                    }}
                    className="text-xs font-bold text-[#145CFF] hover:underline flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <span>Restock Inventory</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* 4. Reviews Awaiting Moderation */}
                <div className="p-4 rounded-xl bg-[#F7FBFF] border border-[#DCEAF1] flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#62788A]">Pending Reviews</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        needsAttention.pendingReviewsCount > 0 ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {needsAttention.pendingReviewsCount}
                      </span>
                    </div>
                    <p className="text-xs text-[#62788A]">Verified customer submissions awaiting approval</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-xs font-bold text-[#145CFF] hover:underline flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <span>Moderate Reviews</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </section>

            {/* SECTION 2: REVENUE METRICS (Separate Paid vs Unpaid COD) */}
            <section className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#62788A]">
                Financial Revenue Breakdown
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Paid & Verified Revenue */}
                <div className="bg-white p-5 rounded-2xl border border-[#DCEAF1] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-emerald-600">
                    <span className="text-xs font-bold uppercase tracking-wider">Paid Revenue</span>
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#102A43] tracking-tight">
                    {currencySymbol} {(metrics?.paidRevenue || 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-[#62788A]">
                    Verified online payments & collected COD cash
                  </p>
                </div>

                {/* 2. Unpaid COD Pending */}
                <div className="bg-white p-5 rounded-2xl border border-[#DCEAF1] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-amber-600">
                    <span className="text-xs font-bold uppercase tracking-wider">Pending COD</span>
                    <Truck size={18} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#102A43] tracking-tight">
                    {currencySymbol} {(metrics?.unpaidCod || 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-[#62788A]">
                    Awaiting courier delivery & cash collection
                  </p>
                </div>

                {/* 3. Total Orders */}
                <div className="bg-white p-5 rounded-2xl border border-[#DCEAF1] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-[#145CFF]">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                    <Package size={18} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#102A43] tracking-tight">
                    {metrics?.totalOrders || 0}
                  </div>
                  <p className="text-xs text-[#62788A]">
                    {metrics?.cancelledCount || 0} cancelled / refunded
                  </p>
                </div>

                {/* 4. Active Catalog Products */}
                <div className="bg-white p-5 rounded-2xl border border-[#DCEAF1] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-purple-600">
                    <span className="text-xs font-bold uppercase tracking-wider">Catalog SKUs</span>
                    <Layers size={18} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#102A43] tracking-tight">
                    {metrics?.totalProducts || 0}
                  </div>
                  <p className="text-xs text-[#62788A]">
                    {metrics?.outOfStockCount || 0} out of stock
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 3: RECENT ACTIVITY SNAPSHOT */}
            <section className="bg-white rounded-2xl border border-[#DCEAF1] p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-[#102A43]">
                  Recent Orders Quick List
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#145CFF] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View Full Orders Table</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7FBFF] text-[#62788A] font-semibold border-b border-[#DCEAF1]">
                    <tr>
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Total</th>
                      <th className="py-2.5 px-3">Payment</th>
                      <th className="py-2.5 px-3">Fulfillment</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCEAF1]">
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id} className="hover:bg-[#F0F7FD] transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-[#145CFF]">#{o.id}</td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-[#102A43]">{o.customer?.name}</div>
                          <div className="text-[11px] text-[#62788A]">
                            {o.customer?.phone ? `${o.customer.phone.slice(0, 3)}****${o.customer.phone.slice(-4)}` : 'Guest'}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-semibold">{currencySymbol} {o.total?.toLocaleString()}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            o.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {o.paymentStatus === 'paid' ? 'Paid' : 'Unpaid COD'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-[#102A43]">
                            {o.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => {
                              setFocusedOrder(o);
                              setActiveTab('orders');
                            }}
                            className="text-[#145CFF] hover:underline font-bold"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="6" className="py-6 text-center text-[#62788A]">
                          No orders recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB 2: ORDERS MANAGEMENT */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'orders' && (
          <div className="space-y-4 pt-6">
            {/* Search and Filters Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-[#DCEAF1] shadow-2xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Search Input */}
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-3 text-[#62788A]" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by ID, name, or phone..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DCEAF1] bg-[#F7FBFF] focus:bg-white focus:outline-none focus:border-[#145CFF]"
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCEAF1] bg-[#F7FBFF] focus:bg-white focus:outline-none focus:border-[#145CFF]"
                  >
                    <option value="">All Fulfillment Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Payment Status Filter */}
                <div>
                  <select
                    value={orderPaymentStatusFilter}
                    onChange={(e) => setOrderPaymentStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCEAF1] bg-[#F7FBFF] focus:bg-white focus:outline-none focus:border-[#145CFF]"
                  >
                    <option value="">All Payment States</option>
                    <option value="paid">Paid & Verified</option>
                    <option value="unpaid">Unpaid (COD Pending / Incomplete)</option>
                  </select>
                </div>

                {/* Payment Method Filter */}
                <div>
                  <select
                    value={orderPaymentMethodFilter}
                    onChange={(e) => setOrderPaymentMethodFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCEAF1] bg-[#F7FBFF] focus:bg-white focus:outline-none focus:border-[#145CFF]"
                  >
                    <option value="">All Payment Methods</option>
                    <option value="cod">Cash on Delivery (COD)</option>
                    <option value="uddoktapay">Online (UddoktaPay)</option>
                    <option value="paymently">Online (Paymently)</option>
                  </select>
                </div>
              </div>

              {/* Batch Print Actions Bar */}
              {selectedOrderIds.size > 0 && (
                <div className="pt-3 border-t border-[#DCEAF1] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="font-semibold text-[#102A43]">
                    {selectedOrderIds.size} orders selected
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openBatchPrintWindow(Array.from(selectedOrderIds), 'invoice', authToken)}
                      className="px-3 py-1.5 rounded-lg bg-[#145CFF] text-white font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer size={13} />
                      <span>Print Invoices</span>
                    </button>
                    <button
                      onClick={() => openBatchPrintWindow(Array.from(selectedOrderIds), 'packing_slip', authToken)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#DCEAF1] text-[#102A43] font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText size={13} />
                      <span>Print Packing Slips</span>
                    </button>
                    <button
                      onClick={() => setSelectedOrderIds(new Set())}
                      className="text-[#62788A] hover:underline px-2"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-[#DCEAF1] shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7FBFF] text-[#62788A] font-semibold border-b border-[#DCEAF1]">
                    <tr>
                      <th className="py-3 px-3.5 w-8">
                        <button
                          onClick={() => {
                            if (selectedOrderIds.size === filteredOrders.length) {
                              setSelectedOrderIds(new Set());
                            } else {
                              setSelectedOrderIds(new Set(filteredOrders.map(o => o.id)));
                            }
                          }}
                          className="cursor-pointer"
                        >
                          {selectedOrderIds.size > 0 && selectedOrderIds.size === filteredOrders.length ? (
                            <CheckSquare size={16} className="text-[#145CFF]" />
                          ) : (
                            <Square size={16} className="text-[#8FA6BE]" />
                          )}
                        </button>
                      </th>
                      <th className="py-3 px-3">Order ID & Date</th>
                      <th className="py-3 px-3">Customer (Privacy Preview)</th>
                      <th className="py-3 px-3">Total (৳)</th>
                      <th className="py-3 px-3">Payment</th>
                      <th className="py-3 px-3">Fulfillment</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCEAF1]">
                    {filteredOrders.map(order => {
                      const isSelected = selectedOrderIds.has(order.id);
                      return (
                        <tr key={order.id} className="hover:bg-[#F0F7FD] transition-colors">
                          <td className="py-3 px-3.5">
                            <button
                              onClick={() => {
                                const next = new Set(selectedOrderIds);
                                if (next.has(order.id)) next.delete(order.id);
                                else next.add(order.id);
                                setSelectedOrderIds(next);
                              }}
                              className="cursor-pointer"
                            >
                              {isSelected ? (
                                <CheckSquare size={16} className="text-[#145CFF]" />
                              ) : (
                                <Square size={16} className="text-[#8FA6BE]" />
                              )}
                            </button>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-mono font-bold text-[#145CFF]">#{order.id}</div>
                            <div className="text-[11px] text-[#62788A]">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-[#102A43]">{order.customer?.name}</div>
                            <div className="text-[11px] text-[#62788A]">
                              {order.customer?.phone 
                                ? `${order.customer.phone.slice(0, 3)}****${order.customer.phone.slice(-4)}` 
                                : 'Guest Phone'}
                            </div>
                          </td>
                          <td className="py-3 px-3 font-semibold text-[#102A43]">
                            {currencySymbol} {order.total?.toLocaleString()}
                          </td>
                          <td className="py-3 px-3">
                            <div className="space-y-0.5">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                order.paymentStatus === 'paid' 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid COD'}
                              </span>
                              <div className="text-[10px] text-[#62788A] uppercase">
                                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                              order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setFocusedOrder(order)}
                                className="px-2.5 py-1 rounded-lg bg-[#DDF4FC] text-[#145CFF] hover:bg-[#145CFF] hover:text-white font-bold transition-colors cursor-pointer"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => openPrintWindow(order.id, 'invoice', authToken)}
                                className="p-1 text-[#62788A] hover:text-[#102A43] cursor-pointer"
                                title="Print Invoice"
                              >
                                <Printer size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan="7" className="py-8 text-center text-[#62788A]">
                          No orders found matching the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FOCUSED ORDER DETAIL MODAL */}
            {focusedOrder && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102A43]/40 backdrop-blur-xs p-4 overflow-y-auto">
                <div className="w-full max-w-2xl bg-white rounded-2xl border border-[#DCEAF1] shadow-xl p-5 sm:p-6 space-y-5 my-8">
                  {/* Header */}
                  <div className="flex items-start justify-between pb-4 border-b border-[#DCEAF1]">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-[#102A43]">
                          Order #{focusedOrder.id}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${
                          focusedOrder.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                          focusedOrder.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {focusedOrder.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#62788A] mt-0.5">
                        Placed on {new Date(focusedOrder.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => setFocusedOrder(null)}
                      className="p-1 rounded-lg text-[#62788A] hover:bg-[#F0F7FD] cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Customer & Delivery Information (Revealed in Details) */}
                  <div className="p-4 rounded-xl bg-[#F7FBFF] border border-[#DCEAF1] space-y-2 text-xs">
                    <h4 className="font-bold text-[#102A43] uppercase tracking-wider text-[11px]">
                      Customer & Delivery Address
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#62788A]">
                      <div>
                        <span className="font-semibold text-[#102A43]">Recipient:</span> {focusedOrder.customer?.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#102A43]">Phone:</span> {focusedOrder.customer?.phone}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(focusedOrder.customer?.phone || '');
                            showToast('Phone number copied');
                          }}
                          className="text-[#145CFF] hover:underline"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="font-semibold text-[#102A43]">Delivery Address:</span> {focusedOrder.customer?.address}, {focusedOrder.customer?.division}
                      </div>
                      {focusedOrder.customer?.notes && (
                        <div className="sm:col-span-2 italic">
                          <span className="font-semibold text-[#102A43]">Delivery Note:</span> {focusedOrder.customer?.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ordered Items Table */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-[#102A43] text-xs uppercase tracking-wider">
                      Items Ordered ({focusedOrder.items?.length || 0})
                    </h4>
                    <div className="border border-[#DCEAF1] rounded-xl overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-[#F7FBFF] text-[#62788A] border-b border-[#DCEAF1]">
                          <tr>
                            <th className="py-2 px-3">Item</th>
                            <th className="py-2 px-3 text-center">Qty</th>
                            <th className="py-2 px-3 text-right">Unit Price</th>
                            <th className="py-2 px-3 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DCEAF1]">
                          {focusedOrder.items?.map((item, idx) => (
                            <tr key={idx}>
                              <td className="py-2.5 px-3">
                                <div className="font-semibold text-[#102A43]">{item.title}</div>
                                <div className="text-[10px] text-[#62788A]">{item.variant || item.sku}</div>
                              </td>
                              <td className="py-2.5 px-3 text-center">{item.quantity}</td>
                              <td className="py-2.5 px-3 text-right">{currencySymbol} {item.price?.toLocaleString()}</td>
                              <td className="py-2.5 px-3 text-right font-semibold">
                                {currencySymbol} {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Financial Breakdown & COD Collection */}
                  <div className="p-4 rounded-xl bg-[#F0F7FD] border border-[#DCEAF1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="text-sm font-bold text-[#102A43]">
                        Grand Total: {currencySymbol} {focusedOrder.total?.toLocaleString()}
                      </div>
                      <div className="text-[#62788A]">
                        Payment: <span className="font-semibold uppercase">{focusedOrder.paymentMethod}</span> ({focusedOrder.paymentStatus})
                      </div>
                    </div>

                    {focusedOrder.paymentMethod === 'cod' && focusedOrder.paymentStatus !== 'paid' && (
                      <button
                        onClick={() => {
                          setConfirmationDialog({
                            title: 'Confirm COD Cash Collection',
                            message: `Confirm physical cash receipt of ৳${focusedOrder.total?.toLocaleString()} for order #${focusedOrder.id}? This will update payment status to Paid.`,
                            confirmLabel: 'Confirm Cash Collected',
                            isDestructive: false,
                            onConfirm: () => {
                              collectCod(focusedOrder.id, focusedOrder.total);
                              setConfirmationDialog(null);
                            }
                          });
                        }}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all cursor-pointer shadow-xs"
                      >
                        Mark ৳{focusedOrder.total?.toLocaleString()} COD Collected
                      </button>
                    )}
                  </div>

                  {/* Actions & Status Workflow */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#DCEAF1]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#62788A]">Update Status:</span>
                      <select
                        value={focusedOrder.status}
                        onChange={(e) => {
                          const newSt = e.target.value;
                          if (newSt === 'cancelled') {
                            setConfirmationDialog({
                              title: 'Confirm Order Cancellation',
                              message: `Are you sure you want to cancel order #${focusedOrder.id}? Any reserved stock will be released back into inventory.`,
                              confirmLabel: 'Cancel Order',
                              isDestructive: true,
                              onConfirm: () => {
                                updateOrderStatus(focusedOrder.id, 'cancelled');
                                setConfirmationDialog(null);
                              }
                            });
                          } else {
                            updateOrderStatus(focusedOrder.id, newSt);
                          }
                        }}
                        className="px-2.5 py-1.5 text-xs rounded-xl border border-[#DCEAF1] bg-white font-semibold"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openPrintWindow(focusedOrder.id, 'invoice', authToken)}
                        className="px-3 py-1.5 rounded-xl border border-[#DCEAF1] text-xs font-semibold hover:bg-[#F7FBFF] flex items-center gap-1.5"
                      >
                        <Printer size={13} />
                        <span>Tax Invoice</span>
                      </button>
                      <button
                        onClick={() => openPrintWindow(focusedOrder.id, 'packing_slip', authToken)}
                        className="px-3 py-1.5 rounded-xl border border-[#DCEAF1] text-xs font-semibold hover:bg-[#F7FBFF] flex items-center gap-1.5"
                      >
                        <FileText size={13} />
                        <span>Packing Slip</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB 3 & 4: PRODUCTS & INVENTORY */}
        {/* ------------------------------------------------------------------- */}
        {(activeTab === 'products' || activeTab === 'inventory') && (
          <div className="space-y-4 pt-6">
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-[#DCEAF1] shadow-2xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-3 text-[#62788A]" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by product name or SKU..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DCEAF1] bg-[#F7FBFF] focus:bg-white focus:outline-none focus:border-[#145CFF]"
                  />
                </div>

                <div>
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCEAF1] bg-[#F7FBFF] focus:bg-white focus:outline-none focus:border-[#145CFF]"
                  >
                    <option value="">All Categories</option>
                    <option value="cases">Cases & Protection</option>
                    <option value="audio">Audio & Earbuds</option>
                    <option value="charging">Fast Chargers & Cables</option>
                    <option value="power">Power Banks</option>
                  </select>
                </div>

                <div>
                  <select
                    value={productStockFilter}
                    onChange={(e) => setProductStockFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCEAF1] bg-[#F7FBFF] focus:bg-white focus:outline-none focus:border-[#145CFF]"
                  >
                    <option value="all">All Stock Levels</option>
                    <option value="low">Low Stock (≤ 5 units)</option>
                    <option value="out">Out of Stock (0 units)</option>
                    <option value="in">Healthy Stock (&gt; 5 units)</option>
                  </select>
                </div>

                <div>
                  <select
                    value={productPublicationFilter}
                    onChange={(e) => setProductPublicationFilter(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCEAF1] bg-[#F7FBFF] focus:bg-white focus:outline-none focus:border-[#145CFF]"
                  >
                    <option value="all">All Products (Active & Archived)</option>
                    <option value="active">Active in Catalog Only</option>
                    <option value="archived">Archived / Hidden Only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-[#DCEAF1] shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7FBFF] text-[#62788A] font-semibold border-b border-[#DCEAF1]">
                    <tr>
                      <th className="py-3 px-3">Product</th>
                      <th className="py-3 px-3">SKU</th>
                      <th className="py-3 px-3">Price</th>
                      <th className="py-3 px-3">Stock Level (Text & Color)</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCEAF1]">
                    {filteredProducts.map(p => {
                      const stockVal = p.stock ?? 0;
                      return (
                        <tr key={p.id} className="hover:bg-[#F0F7FD] transition-colors">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={p.image || '/assets/placeholder.png'}
                                alt={p.title}
                                className="w-10 h-10 object-cover rounded-lg border border-[#DCEAF1] shrink-0 bg-slate-50"
                              />
                              <div className="min-w-0">
                                <div className="font-semibold text-[#102A43] truncate max-w-xs">{p.title}</div>
                                <div className="text-[10px] text-[#62788A] capitalize">{p.category} • {p.brand}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono text-[#62788A]">{p.sku}</td>
                          <td className="py-3 px-3 font-semibold text-[#102A43]">
                            {currencySymbol} {p.price?.toLocaleString()}
                          </td>
                          <td className="py-3 px-3">
                            {/* Explicit Text and Color Badge */}
                            {stockVal === 0 ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800">
                                <AlertTriangle size={12} />
                                <span>Out of Stock (0)</span>
                              </span>
                            ) : stockVal <= 5 ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                                <Clock size={12} />
                                <span>Low Stock ({stockVal} left)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                                <Check size={12} />
                                <span>In Stock ({stockVal})</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.status === 'archived' ? 'bg-slate-200 text-slate-700' : 'bg-blue-50 text-[#145CFF]'
                            }`}>
                              {p.status === 'archived' ? 'Archived' : 'Active'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setStockAdjustmentTarget(p);
                                  setStockDelta(10);
                                  setStockAdjustmentMode('add');
                                  setStockReason('Restock shipment received');
                                }}
                                className="px-2.5 py-1 rounded-lg bg-[#DDF4FC] text-[#145CFF] hover:bg-[#145CFF] hover:text-white font-bold transition-colors cursor-pointer"
                              >
                                Adjust Stock
                              </button>
                              <button
                                onClick={() => toggleProductArchive(p)}
                                className="p-1 text-[#62788A] hover:text-[#102A43] cursor-pointer"
                                title={p.status === 'archived' ? 'Restore product' : 'Archive product'}
                              >
                                <Archive size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-[#62788A]">
                          No products found matching the criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* STOCK ADJUSTMENT MODAL / DRAWER */}
            {stockAdjustmentTarget && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102A43]/40 backdrop-blur-xs p-4">
                <div className="w-full max-w-lg bg-white rounded-2xl border border-[#DCEAF1] shadow-xl p-6 space-y-4">
                  <div className="flex items-start justify-between pb-3 border-b border-[#DCEAF1]">
                    <div>
                      <h3 className="text-base font-bold text-[#102A43]">
                        Adjust Warehouse Stock
                      </h3>
                      <p className="text-xs text-[#62788A] mt-0.5">
                        {stockAdjustmentTarget.title} (SKU: {stockAdjustmentTarget.sku})
                      </p>
                    </div>
                    <button
                      onClick={() => setStockAdjustmentTarget(null)}
                      className="p-1 rounded-lg text-[#62788A] hover:bg-[#F0F7FD]"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Stock Metrics Card */}
                  <div className="p-3.5 rounded-xl bg-[#F7FBFF] border border-[#DCEAF1] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[#62788A]">Current Registered Stock:</span>
                      <div className="text-lg font-bold text-[#102A43]">{stockAdjustmentTarget.stock} units</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[#62788A]">Projected New Stock:</span>
                      <div className="text-lg font-bold text-[#145CFF]">
                        {stockAdjustmentMode === 'set' 
                          ? Math.max(0, parseInt(stockDelta || 0, 10)) 
                          : stockAdjustmentMode === 'deduct' 
                            ? Math.max(0, stockAdjustmentTarget.stock - Math.abs(parseInt(stockDelta || 0, 10)))
                            : stockAdjustmentTarget.stock + Math.abs(parseInt(stockDelta || 0, 10))} units
                      </div>
                    </div>
                  </div>

                  {/* Adjustment Form */}
                  <form onSubmit={handleStockAdjustmentSubmit} className="space-y-3.5 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-[#102A43]">Adjustment Mode</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'add', label: 'Add (+)' },
                          { id: 'deduct', label: 'Deduct (-)' },
                          { id: 'set', label: 'Set Exact' }
                        ].map(m => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setStockAdjustmentMode(m.id)}
                            className={`py-2 rounded-xl border text-xs font-semibold ${
                              stockAdjustmentMode === m.id 
                                ? 'bg-[#145CFF] text-white border-[#145CFF]' 
                                : 'bg-white text-[#62788A] border-[#DCEAF1]'
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-[#102A43]">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={stockDelta}
                        onChange={(e) => setStockDelta(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-[#DCEAF1] text-sm focus:outline-none focus:border-[#145CFF]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-[#102A43]">Reason for Adjustment (Mandatory)</label>
                      <select
                        value={stockReason}
                        onChange={(e) => setStockReason(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#DCEAF1] text-xs focus:outline-none focus:border-[#145CFF]"
                      >
                        <option value="Restock shipment received">Restock shipment received from supplier</option>
                        <option value="Physical inventory recount correction">Physical inventory recount correction</option>
                        <option value="Damaged goods write-off">Damaged or defective goods write-off</option>
                        <option value="Customer return accepted">Customer return accepted into warehouse</option>
                        <option value="Promotional allocation">Promotional giveaway / media sampling</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-[#102A43]">Staff Audit Note (Optional)</label>
                      <input
                        type="text"
                        value={stockNotes}
                        onChange={(e) => setStockNotes(e.target.value)}
                        placeholder="e.g. Inward consignment #BD-492"
                        className="w-full px-3 py-2 rounded-xl border border-[#DCEAF1] text-xs focus:outline-none focus:border-[#145CFF]"
                      />
                    </div>

                    <div className="pt-3 border-t border-[#DCEAF1] flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setStockAdjustmentTarget(null)}
                        className="px-4 py-2 rounded-xl border border-[#DCEAF1] text-xs font-semibold text-[#62788A]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#145CFF] hover:bg-[#0F4BD9] text-white text-xs font-semibold"
                      >
                        Review & Apply
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB 5: PROMOTIONS */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'promotions' && (
          <div className="space-y-4 pt-6">
            <div className="bg-white p-4 rounded-2xl border border-[#DCEAF1] shadow-2xs flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#102A43]">
                  Discount Coupons & Campaigns
                </h3>
                <p className="text-xs text-[#62788A]">
                  Manage active promotional coupon codes and usage rules.
                </p>
              </div>
              <button
                onClick={() => setShowPromoForm(true)}
                className="px-3.5 py-2 rounded-xl bg-[#145CFF] hover:bg-[#0F4BD9] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={15} />
                <span>Create Promotion</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#DCEAF1] shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7FBFF] text-[#62788A] font-semibold border-b border-[#DCEAF1]">
                    <tr>
                      <th className="py-3 px-3.5">Code</th>
                      <th className="py-3 px-3">Discount</th>
                      <th className="py-3 px-3">Min Spend</th>
                      <th className="py-3 px-3">Validity</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCEAF1]">
                    {promotions.map(promo => {
                      const isExpired = new Date(promo.endDate) < new Date();
                      return (
                        <tr key={promo.id} className="hover:bg-[#F0F7FD] transition-colors">
                          <td className="py-3 px-3.5">
                            <span className="font-mono font-bold text-[#145CFF] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                              {promo.code}
                            </span>
                            <div className="text-[11px] text-[#62788A] mt-0.5">{promo.title}</div>
                          </td>
                          <td className="py-3 px-3 font-semibold text-[#102A43]">
                            {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `${currencySymbol} ${promo.discountValue}`}
                          </td>
                          <td className="py-3 px-3 text-[#62788A]">
                            {currencySymbol} {promo.minOrderAmount?.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-[11px] text-[#62788A]">
                            {promo.startDate} to {promo.endDate}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isExpired ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {isExpired ? 'Expired' : 'Active'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => deletePromotion(promo)}
                              className="text-red-500 hover:text-red-700 font-semibold p-1"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {promotions.length === 0 && (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-[#62788A]">
                          No promotions created yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CREATE PROMOTION MODAL */}
            {showPromoForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102A43]/40 backdrop-blur-xs p-4">
                <div className="w-full max-w-md bg-white rounded-2xl border border-[#DCEAF1] shadow-xl p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#DCEAF1]">
                    <h3 className="text-base font-bold text-[#102A43]">Create New Promotion</h3>
                    <button onClick={() => setShowPromoForm(false)} className="p-1 text-[#62788A]">
                      <X size={18} />
                    </button>
                  </div>

                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        const res = await safeFetchJson('/api/admin/promotions', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${authToken}`
                          },
                          body: JSON.stringify(newPromo)
                        });
                        if (res.ok && res.data?.promotion) {
                          setPromotions(prev => [res.data.promotion, ...prev]);
                          setShowPromoForm(false);
                          showToast(`Promo ${newPromo.code} created`);
                        }
                      } catch (err) {
                        showToast('Failed to create promotion', 'error');
                      }
                    }}
                    className="space-y-3 text-xs"
                  >
                    <div>
                      <label className="font-semibold text-[#102A43]">Coupon Code</label>
                      <input
                        type="text"
                        value={newPromo.code}
                        onChange={(e) => setNewPromo(prev => ({ ...prev, code: e.target.value.toUpperCase().trim() }))}
                        placeholder="e.g. TECH10"
                        required
                        className="w-full px-3 py-2 rounded-xl border border-[#DCEAF1] uppercase font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-[#102A43]">Description</label>
                      <input
                        type="text"
                        value={newPromo.title}
                        onChange={(e) => setNewPromo(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. 10% Off on Audio and Chargers"
                        required
                        className="w-full px-3 py-2 rounded-xl border border-[#DCEAF1]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold text-[#102A43]">Discount Type</label>
                        <select
                          value={newPromo.discountType}
                          onChange={(e) => setNewPromo(prev => ({ ...prev, discountType: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-[#DCEAF1]"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount (৳)</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-[#102A43]">Discount Value</label>
                        <input
                          type="number"
                          value={newPromo.discountValue}
                          onChange={(e) => setNewPromo(prev => ({ ...prev, discountValue: parseFloat(e.target.value) }))}
                          required
                          className="w-full px-3 py-2 rounded-xl border border-[#DCEAF1]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-[#102A43]">Minimum Order Amount (৳)</label>
                      <input
                        type="number"
                        value={newPromo.minOrderAmount}
                        onChange={(e) => setNewPromo(prev => ({ ...prev, minOrderAmount: parseFloat(e.target.value) }))}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-[#DCEAF1]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-semibold text-[#102A43]">Start Date</label>
                        <input
                          type="date"
                          value={newPromo.startDate}
                          onChange={(e) => setNewPromo(prev => ({ ...prev, startDate: e.target.value }))}
                          required
                          className="w-full px-3 py-2 rounded-xl border border-[#DCEAF1]"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-[#102A43]">Expiry Date</label>
                        <input
                          type="date"
                          value={newPromo.endDate}
                          onChange={(e) => setNewPromo(prev => ({ ...prev, endDate: e.target.value }))}
                          required
                          className="w-full px-3 py-2 rounded-xl border border-[#DCEAF1]"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#DCEAF1] flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowPromoForm(false)}
                        className="px-4 py-2 rounded-xl border border-[#DCEAF1] text-xs font-semibold text-[#62788A]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#145CFF] text-white text-xs font-semibold"
                      >
                        Save Promotion
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB 6: REVIEWS MODERATION */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'reviews' && (
          <div className="space-y-4 pt-6">
            <div className="bg-white p-4 rounded-2xl border border-[#DCEAF1] shadow-2xs">
              <h3 className="text-sm sm:text-base font-bold text-[#102A43]">
                Customer Review Moderation
              </h3>
              <p className="text-xs text-[#62788A]">
                Approve authentic buyer feedback or reject spam/inappropriate submissions.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#DCEAF1] shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7FBFF] text-[#62788A] font-semibold border-b border-[#DCEAF1]">
                    <tr>
                      <th className="py-3 px-3.5">Reviewer & Product</th>
                      <th className="py-3 px-3">Rating</th>
                      <th className="py-3 px-3">Feedback</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCEAF1]">
                    {reviews.map(rev => (
                      <tr key={rev.id} className="hover:bg-[#F0F7FD] transition-colors">
                        <td className="py-3 px-3.5">
                          <div className="font-semibold text-[#102A43]">{rev.customerName || 'Anonymous Customer'}</div>
                          <div className="text-[11px] text-[#62788A]">{rev.productTitle || `Product #${rev.productId}`}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center text-amber-500 font-bold">
                            {'★'.repeat(rev.rating || 5)}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-[#62788A] max-w-sm">
                          <p className="line-clamp-2">{rev.comment}</p>
                          <span className="text-[10px] text-[#8FA6BE]">{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            rev.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                            rev.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {rev.status || 'pending'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {rev.status !== 'approved' && (
                              <button
                                onClick={() => updateReviewStatus(rev.id, 'approved')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold transition-colors cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                            {rev.status !== 'rejected' && (
                              <button
                                onClick={() => updateReviewStatus(rev.id, 'rejected')}
                                className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-600 hover:text-white font-bold transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {reviews.length === 0 && (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-[#62788A]">
                          No reviews currently recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB 7: CATEGORIES & BRANDS MANAGEMENT */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'categories' && (
          <div className="space-y-6 pt-6">
            <div className="bg-white p-5 rounded-2xl border border-[#DCEAF1] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#102A43]">
                  Product Categories &amp; Brand Taxonomies
                </h3>
                <p className="text-xs text-[#62788A]">
                  Manage mobile accessory catalog categories, badges, and brand device support.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleOpenCatModal()}
                className="px-4 py-2.5 rounded-xl bg-[#168FC2] hover:bg-[#0F7CA6] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
              >
                <Plus size={15} />
                <span>Add Category</span>
              </button>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-2xl border border-[#DCEAF1] shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-[#DCEAF1]">
                <h4 className="text-sm font-bold text-[#102A43]">All Active Categories ({categories.length})</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7FBFF] text-[#62788A] font-semibold border-b border-[#DCEAF1]">
                    <tr>
                      <th className="py-3 px-4">Category Slug</th>
                      <th className="py-3 px-4">English Name</th>
                      <th className="py-3 px-4">Bengali Name</th>
                      <th className="py-3 px-4">Badge / Highlight</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCEAF1]">
                    {categories.map(cat => (
                      <tr key={cat.id} className="hover:bg-[#F0F7FD] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#102A43]">{cat.id}</td>
                        <td className="py-3 px-4 font-semibold text-[#102A43]">{cat.name}</td>
                        <td className="py-3 px-4 text-[#62788A]">{cat.nameBn || '—'}</td>
                        <td className="py-3 px-4">
                          {cat.badge ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DDF4FC] text-[#168FC2]">
                              {cat.badge}
                            </span>
                          ) : '—'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenCatModal(cat)}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#145CFF] hover:bg-blue-100 font-bold transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat)}
                              className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-bold transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Brands Reference */}
            <div className="bg-white rounded-2xl border border-[#DCEAF1] shadow-2xs p-5">
              <h4 className="text-sm font-bold text-[#102A43] mb-3">Compatible Brand Ecosystems ({brands.length})</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {brands.map(b => (
                  <div key={b.id} className="p-3 rounded-xl border border-[#DCEAF1] bg-[#F7FBFF]">
                    <span className="font-bold text-sm text-[#102A43] capitalize">{b.name}</span>
                    <span className="text-[11px] text-[#62788A] block mt-1">
                      {b.models?.length || 0} registered models supported
                    </span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {b.models?.slice(0, 3).map((m, i) => (
                        <span key={i} className="text-[10px] bg-white px-2 py-0.5 rounded border border-[#DCEAF1] text-slate-700">
                          {m}
                        </span>
                      ))}
                      {b.models?.length > 3 && (
                        <span className="text-[10px] text-[#62788A] font-semibold self-center">
                          +{b.models.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB 8: CUSTOMER MANAGEMENT */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'customers' && (
          <div className="space-y-4 pt-6">
            <div className="bg-white p-5 rounded-2xl border border-[#DCEAF1] shadow-2xs">
              <h3 className="text-base font-bold text-[#102A43]">
                Customer Account Profiles ({customers.length})
              </h3>
              <p className="text-xs text-[#62788A]">
                Registered Tech Nest customer accounts, order frequency, and cumulative spend.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#DCEAF1] shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F7FBFF] text-[#62788A] font-semibold border-b border-[#DCEAF1]">
                    <tr>
                      <th className="py-3 px-4">Customer Name</th>
                      <th className="py-3 px-4">Contact Email</th>
                      <th className="py-3 px-4">Phone Number</th>
                      <th className="py-3 px-4">Orders Placed</th>
                      <th className="py-3 px-4">Total Spent</th>
                      <th className="py-3 px-4">Account Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCEAF1]">
                    {customers.map(cust => (
                      <tr key={cust.id} className="hover:bg-[#F0F7FD] transition-colors">
                        <td className="py-3 px-4 font-bold text-[#102A43]">{cust.name}</td>
                        <td className="py-3 px-4 text-[#62788A] font-mono">{cust.email}</td>
                        <td className="py-3 px-4 text-[#62788A] font-mono">{cust.phone || '—'}</td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-[#145CFF]">
                            {cust.ordersCount} orders
                          </span>
                        </td>
                        <td className="py-3 px-4 font-extrabold text-[#102A43]">
                          {currencySymbol}{cust.totalSpent.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            cust.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {cust.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {customers.length === 0 && (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-[#62788A]">
                          No registered customer accounts found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------- */}
        {/* TAB 9: SHIPPING & DELIVERY CONFIGURATION */}
        {/* ------------------------------------------------------------------- */}
        {activeTab === 'shipping' && (
          <div className="space-y-6 pt-6">
            <div className="bg-white p-5 rounded-2xl border border-[#DCEAF1] shadow-2xs">
              <h3 className="text-base font-bold text-[#102A43]">
                Shipping &amp; Delivery Configuration
              </h3>
              <p className="text-xs text-[#62788A]">
                Configure regional courier delivery fees, free delivery order thresholds, and fulfillment timeframes.
              </p>
            </div>

            <form onSubmit={handleSaveShippingSettings} className="bg-white rounded-2xl border border-[#DCEAF1] shadow-2xs p-6 space-y-5 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#102A43] mb-1">
                    Inside Dhaka Delivery Fee ({currencySymbol}) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={shippingSettings.insideDhakaFee}
                    onChange={(e) => setShippingSettings(prev => ({ ...prev, insideDhakaFee: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCEAF1] text-sm text-[#102A43] font-bold"
                  />
                  <span className="text-[11px] text-[#62788A] mt-1 block">Default: ৳60</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#102A43] mb-1">
                    Outside Dhaka Delivery Fee ({currencySymbol}) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={shippingSettings.outsideDhakaFee}
                    onChange={(e) => setShippingSettings(prev => ({ ...prev, outsideDhakaFee: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCEAF1] text-sm text-[#102A43] font-bold"
                  />
                  <span className="text-[11px] text-[#62788A] mt-1 block">Default: ৳120</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#102A43] mb-1">
                  Free Delivery Minimum Order Amount ({currencySymbol}) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={shippingSettings.freeShippingThreshold}
                  onChange={(e) => setShippingSettings(prev => ({ ...prev, freeShippingThreshold: Number(e.target.value) }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCEAF1] text-sm text-[#102A43] font-bold"
                />
                <span className="text-[11px] text-[#62788A] mt-1 block">Orders equal to or above this amount receive 100% free delivery. Default: ৳2,000.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#102A43] mb-1">
                    Dhaka Delivery ETA
                  </label>
                  <input
                    type="text"
                    value={shippingSettings.insideDhakaEta || '1–2 Business Days'}
                    onChange={(e) => setShippingSettings(prev => ({ ...prev, insideDhakaEta: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCEAF1] text-sm text-[#102A43]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#102A43] mb-1">
                    Outside Dhaka Delivery ETA
                  </label>
                  <input
                    type="text"
                    value={shippingSettings.outsideDhakaEta || '2–4 Business Days'}
                    onChange={(e) => setShippingSettings(prev => ({ ...prev, outsideDhakaEta: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCEAF1] text-sm text-[#102A43]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#DCEAF1] flex items-center justify-end">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-6 py-2.5 rounded-xl bg-[#168FC2] hover:bg-[#0F7CA6] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  {savingSettings ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                  <span>Save Delivery Rules</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Modal: Category Create/Edit */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102A43]/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#DCEAF1] shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCEAF1]">
              <h3 className="text-base font-bold text-[#102A43]">
                {editingCat ? `Edit Category: ${editingCat.name}` : 'Create New Category'}
              </h3>
              <button
                type="button"
                onClick={() => setShowCatModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#102A43] mb-1">Category Slug / ID *</label>
                <input
                  type="text"
                  required
                  disabled={Boolean(editingCat)}
                  value={catForm.id}
                  onChange={(e) => setCatForm(prev => ({ ...prev, id: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') }))}
                  placeholder="e.g. power-banks"
                  className="w-full px-3 py-2 rounded-xl border border-[#DCEAF1] font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-[#102A43] mb-1">Category Name (English) *</label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={(e) => setCatForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Power Banks &amp; Chargers"
                  className="w-full px-3 py-2 rounded-xl border border-[#DCEAF1]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#102A43] mb-1">Category Name (Bengali)</label>
                <input
                  type="text"
                  value={catForm.nameBn}
                  onChange={(e) => setCatForm(prev => ({ ...prev, nameBn: e.target.value }))}
                  placeholder="e.g. পাওয়ার ব্যাংক ও চার্জার"
                  className="w-full px-3 py-2 rounded-xl border border-[#DCEAF1]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#102A43] mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={catForm.badge}
                  onChange={(e) => setCatForm(prev => ({ ...prev, badge: e.target.value }))}
                  placeholder="e.g. Popular or Hot Deals"
                  className="w-full px-3 py-2 rounded-xl border border-[#DCEAF1]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#102A43] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={catForm.description}
                  onChange={(e) => setCatForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Short description for SEO and category headers"
                  className="w-full px-3 py-2 rounded-xl border border-[#DCEAF1]"
                />
              </div>

              <div className="pt-3 border-t border-[#DCEAF1] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#DCEAF1] font-semibold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#168FC2] hover:bg-[#0F7CA6] text-white font-bold cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
