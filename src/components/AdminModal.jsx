import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Key, 
  ShieldCheck, 
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
  Wrench,
  Check,
  Percent,
  Printer,
  FileText,
  Download,
  CheckSquare,
  Square
} from 'lucide-react';
import { openPrintWindow, openBatchPrintWindow } from '../utils/invoice.js';

export default function AdminModal({ 
  isOpen, 
  onClose, 
  currencySymbol = "৳",
  onProductsUpdated
}) {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('accessories_admin_token') || null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'orders', 'products', 'inventory', 'promotions', 'reviews', 'services'

  // Dashboard Data
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [adjustments, setAdjustments] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [selectedOrderIds, setSelectedOrderIds] = useState(new Set());
  const [productSearch, setProductSearch] = useState('');
  const [productLowStockOnly, setProductLowStockOnly] = useState(false);

  // Product Create/Edit Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productFormData, setProductFormData] = useState({
    sku: '',
    title: '',
    titleBn: '',
    category: 'cases',
    brand: 'Apple',
    price: '',
    originalPrice: '',
    stock: '',
    warranty: '6-Month Official Replacement',
    badge: '',
    description: '',
    image: '',
    specs: {},
    compatibleWith: [],
    variants: []
  });

  // Stock Adjustment Modal
  const [stockAdjustmentTarget, setStockAdjustmentTarget] = useState(null);
  const [stockDelta, setStockDelta] = useState(10);
  const [stockReason, setStockReason] = useState('Restock shipment received');

  // New Promotion State
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

  // Escape listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Load data when opened or tab changed
  useEffect(() => {
    if (isOpen && authToken) {
      loadTabData(activeTab);
    }
  }, [isOpen, authToken, activeTab]);

  const loadTabData = async (tab) => {
    setLoading(true);
    const headers = { Authorization: `Bearer ${authToken}` };

    try {
      if (tab === 'overview') {
        const res = await fetch('/api/admin/dashboard', { headers });
        const data = await res.json();
        if (res.ok) setMetrics(data.metrics);
      } else if (tab === 'orders') {
        let url = '/api/admin/orders?limit=100';
        if (orderStatusFilter) url += `&status=${orderStatusFilter}`;
        if (orderSearch) url += `&search=${encodeURIComponent(orderSearch)}`;
        const res = await fetch(url, { headers });
        const data = await res.json();
        if (res.ok) setOrders(data.orders || []);
      } else if (tab === 'products') {
        const res = await fetch('/api/admin/products', { headers });
        const data = await res.json();
        if (res.ok) setProducts(data.products || []);
      } else if (tab === 'inventory') {
        const resProd = await fetch('/api/admin/products', { headers });
        const dataProd = await resProd.json();
        if (resProd.ok) setProducts(dataProd.products || []);

        const resAdj = await fetch('/api/admin/inventory/adjustments', { headers });
        const dataAdj = await resAdj.json();
        if (resAdj.ok) setAdjustments(dataAdj.adjustments || []);
      } else if (tab === 'promotions') {
        const res = await fetch('/api/admin/promotions', { headers });
        const data = await res.json();
        if (res.ok) setPromotions(data.promotions || []);
      } else if (tab === 'reviews') {
        const res = await fetch('/api/admin/reviews', { headers });
        const data = await res.json();
        if (res.ok) setReviews(data.reviews || []);
      } else if (tab === 'services') {
        const res = await fetch('/api/admin/services/requests', { headers });
        const data = await res.json();
        if (res.ok) setServiceRequests(data.requests || []);
      }
    } catch (err) {
      console.error('Failed to load admin tab', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials');
      }
      setAuthToken(data.token);
      localStorage.setItem('accessories_admin_token', data.token);
      setPassword('');
      setActiveTab('overview');
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('accessories_admin_token');
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status: newStatus, note: `Status updated by admin to ${newStatus}` })
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleCollectCod = async (orderId) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/collect-cod`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ note: 'Cash collected by courier and remitted' })
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, paymentStatus: 'paid' } : o));
      }
    } catch (err) {
      alert('Failed to mark COD paid');
    }
  };

  const toggleProductStatus = async (productId, currentStatus) => {
    const nextStatus = currentStatus === 'published' ? 'archived' : 'published';
    try {
      const res = await fetch(`/api/admin/products/${productId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        setProducts(products.map(p => p.id === productId ? { ...p, status: nextStatus } : p));
        if (onProductsUpdated) onProductsUpdated();
      }
    } catch (err) {
      alert('Failed to update product status');
    }
  };

  const handleExecuteStockAdjustment = async (e) => {
    e.preventDefault();
    if (!stockAdjustmentTarget) return;

    try {
      const res = await fetch(`/api/admin/products/${stockAdjustmentTarget.id}/adjust-stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          delta: stockDelta,
          reason: stockReason
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Stock adjustment failed');

      setStockAdjustmentTarget(null);
      loadTabData('inventory');
      if (onProductsUpdated) onProductsUpdated();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const isEdit = Boolean(editingProduct);
    const url = isEdit ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(productFormData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save product');

      setShowProductForm(false);
      setEditingProduct(null);
      loadTabData('products');
      if (onProductsUpdated) onProductsUpdated();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(',')[1];
      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            dataBase64: base64
          })
        });
        const data = await res.json();
        if (res.ok && data.url) {
          setProductFormData(prev => ({ ...prev, image: data.url }));
        } else {
          alert(data.error || 'Upload failed');
        }
      } catch (err) {
        alert('Upload failed');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreatePromo = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(newPromo)
      });
      if (res.ok) {
        setShowPromoForm(false);
        loadTabData('promotions');
      }
    } catch (e) {
      alert('Failed to create promotion');
    }
  };

  const handleDeletePromo = async (promoId) => {
    try {
      const res = await fetch(`/api/admin/promotions/${promoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        loadTabData('promotions');
      }
    } catch (e) {
      alert('Failed to delete promotion');
    }
  };

  const handleModerateReview = async (reviewId, status) => {
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        loadTabData('reviews');
      }
    } catch (e) {
      alert('Failed to update review status');
    }
  };

  const toggleSelectOrder = (id) => {
    setSelectedOrderIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAllOrders = () => {
    if (selectedOrderIds.size === orders.length) {
      setSelectedOrderIds(new Set());
    } else {
      setSelectedOrderIds(new Set(orders.map(o => o.id)));
    }
  };

  const handleExportOrdersCsv = () => {
    const downloadUrl = `/api/admin/orders/export-csv?admin_token=${encodeURIComponent(authToken)}`;
    window.open(downloadUrl, '_blank');
  };

  const handleBatchPrint = (type) => {
    const chosen = orders.filter(o => selectedOrderIds.has(o.id));
    if (chosen.length === 0) return;
    openBatchPrintWindow(chosen, type);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
    >
      <div 
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-[#FFFFFF] border border-[#DCE7F0] shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 25px 60px -15px rgba(16, 38, 61, 0.20)' }}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#DCE7F0] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#10263D] text-white flex items-center justify-center font-bold">
              <Lock size={18} />
            </div>
            <div>
              <h2 id="admin-modal-title" className="text-xl font-bold text-[#10263D]">
                Store Operations Dashboard
              </h2>
              <p className="text-xs text-[#52677B]">
                Authoritative inventory, transactional orders, catalog & promotions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-[#52677B] hover:text-[#10263D] focus-visible:ring-2 focus-visible:ring-[#145CFF]"
            aria-label="Close admin console"
          >
            <X size={20} />
          </button>
        </div>

        {!authToken ? (
          /* Password Authentication Gate */
          <div className="max-w-sm mx-auto py-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF4FC] text-[#145CFF] mx-auto flex items-center justify-center mb-4">
              <Key size={26} />
            </div>
            <h3 className="text-lg font-bold text-[#10263D] mb-1">
              Store Manager Access
            </h3>
            <p className="text-xs text-[#52677B] mb-5">
              Enter your secure admin passcode to access operational controls.
            </p>

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                id="admin-passcode-input"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter admin passcode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field text-center font-mono text-sm tracking-wider"
              />

              {loginError && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-center gap-1.5">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#145CFF] hover:bg-[#0D4BD9] text-white font-semibold text-xs shadow-md shadow-blue-500/20"
              >
                Authenticate & Unlock
              </button>
            </form>
          </div>
        ) : (
          /* Logged In Admin Dashboard */
          <div>
            {/* Top Navigation Bar */}
            <div className="flex border-b border-[#DCE7F0] mb-6 overflow-x-auto gap-3 text-xs font-bold">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'orders', label: 'Orders', icon: Package },
                { id: 'products', label: 'Products', icon: Layers },
                { id: 'inventory', label: 'Inventory', icon: RefreshCw },
                { id: 'promotions', label: 'Promotions', icon: Percent },
                { id: 'reviews', label: 'Reviews', icon: Sparkles },
                { id: 'services', label: 'Service Requests', icon: Wrench }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 border-b-2 flex items-center gap-1.5 transition-all shrink-0 ${
                      activeTab === tab.id
                        ? 'border-[#145CFF] text-[#145CFF]'
                        : 'border-transparent text-[#52677B] hover:text-[#10263D]'
                    }`}
                  >
                    <Icon size={15} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}

              <button
                onClick={handleLogout}
                className="pb-3 text-red-500 hover:text-red-700 ml-auto flex items-center gap-1 shrink-0"
              >
                Sign Out
              </button>
            </div>

            {/* TAB 1: OVERVIEW METRICS */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-[#EAF4FC] border border-[#DCE7F0]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#52677B] block mb-1">Paid Revenue</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-[#145CFF]">
                      {currencySymbol}{(metrics?.paidRevenue || 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-600 block mt-1 font-medium">Verified electronic & COD</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">Unpaid COD Orders</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-amber-900">
                      {currencySymbol}{(metrics?.unpaidCod || 0).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-amber-700 block mt-1 font-medium">Pending courier collection</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#52677B] block mb-1">Total Orders</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-[#10263D]">
                      {metrics?.totalOrders || 0}
                    </span>
                    <span className="text-[10px] text-[#52677B] block mt-1 font-medium">{metrics?.cancelledCount || 0} cancelled</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#52677B] block mb-1">Catalog Status</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-[#10263D]">
                      {metrics?.totalProducts || 0} SKUs
                    </span>
                    <span className="text-[10px] text-amber-600 block mt-1 font-medium">{metrics?.lowStockCount || 0} low stock</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#DCE7F0]">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#10263D] mb-3">
                    Operational Status & Relational Integrity
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center gap-2.5">
                      <CheckCircle2 size={18} className="text-emerald-500" />
                      <div>
                        <strong className="block text-[#10263D]">SQLite WAL Database</strong>
                        <span className="text-[11px] text-[#52677B]">Transactional ACID guarantees</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center gap-2.5">
                      <ShieldCheck size={18} className="text-[#145CFF]" />
                      <div>
                        <strong className="block text-[#10263D]">Customer Data Protection</strong>
                        <span className="text-[11px] text-[#52677B]">Unguessable tokens & auth</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center gap-2.5">
                      <Sparkles size={18} className="text-amber-500" />
                      <div>
                        <strong className="block text-[#10263D]">Verified Reviews Only</strong>
                        <span className="text-[11px] text-[#52677B]">Delivered purchase required</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ORDERS MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {/* Search & Status Filters */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by Order ID, Customer Name or Phone..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="input-field pl-9 text-xs py-1.5"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      className="input-field text-xs py-1.5"
                    >
                      <option value="">All Statuses</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => loadTabData('orders')}
                      className="px-3 py-1.5 rounded-lg bg-[#145CFF] hover:bg-[#0D4BD9] text-white text-xs font-semibold transition-colors"
                    >
                      Filter
                    </button>

                    <button
                      type="button"
                      onClick={handleExportOrdersCsv}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                      title="Export orders to CSV format for Excel / courier dispatch"
                    >
                      <Download size={13} />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* Batch Printing Actions Bar */}
                {orders.length > 0 && (
                  <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={toggleSelectAllOrders}
                        className="flex items-center gap-1.5 font-semibold text-[#10263D] hover:text-[#145CFF] transition-colors"
                      >
                        {selectedOrderIds.size === orders.length && orders.length > 0 ? (
                          <CheckSquare size={16} className="text-[#145CFF]" />
                        ) : (
                          <Square size={16} className="text-slate-400" />
                        )}
                        <span>Select All ({orders.length})</span>
                      </button>
                      {selectedOrderIds.size > 0 && (
                        <span className="text-[11px] font-bold text-[#145CFF]">
                          • {selectedOrderIds.size} selected
                        </span>
                      )}
                    </div>

                    {selectedOrderIds.size > 0 && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleBatchPrint('invoice')}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-[#DCE7F0] hover:bg-[#EAF4FC] text-[#145CFF] font-bold text-xs shadow-xs transition-colors"
                        >
                          <Printer size={13} />
                          <span>Print Invoices ({selectedOrderIds.size})</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBatchPrint('packing-slip')}
                          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-[#DCE7F0] hover:bg-[#EAF4FC] text-[#10263D] font-bold text-xs shadow-xs transition-colors"
                        >
                          <FileText size={13} />
                          <span>Print Packing Slips ({selectedOrderIds.size})</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Orders List */}
                {loading ? (
                  <div className="text-center py-10">
                    <span className="w-6 h-6 border-2 border-[#145CFF] border-t-transparent rounded-full animate-spin inline-block mb-2" />
                    <p className="text-xs text-[#52677B]">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#52677B]">No matching orders found.</div>
                ) : (
                  orders.map((ord) => {
                    const isSelected = selectedOrderIds.has(ord.id);
                    return (
                    <div key={ord.id} className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      isSelected ? 'border-[#145CFF] bg-blue-50/20 shadow-xs' : 'border-[#DCE7F0] bg-white'
                    }`}>
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleSelectOrder(ord.id)}
                            className="text-slate-400 hover:text-[#145CFF]"
                            aria-label={`Select order ${ord.id}`}
                          >
                            {isSelected ? (
                              <CheckSquare size={16} className="text-[#145CFF]" />
                            ) : (
                              <Square size={16} />
                            )}
                          </button>
                          <span className="font-mono font-bold text-xs text-[#145CFF]">{ord.id}</span>
                          <span className="text-[11px] text-[#52677B]">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Print Invoice & Packing Slip Triggers */}
                          <button
                            type="button"
                            onClick={() => openPrintWindow(ord, 'invoice')}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#145CFF] text-[#10263D] text-xs font-semibold transition-colors"
                            title="Print Customer Tax Invoice"
                          >
                            <Printer size={13} />
                            <span>Invoice</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => openPrintWindow(ord, 'packing-slip')}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#10263D] text-xs font-semibold transition-colors"
                            title="Print Warehouse Packing & Courier Dispatch Slip"
                          >
                            <FileText size={13} />
                            <span>Slip</span>
                          </button>

                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                            className="text-xs font-bold py-1 px-2.5 rounded-lg border border-slate-300 bg-white"
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          {ord.paymentMethod === 'cod' && ord.paymentStatus === 'unpaid' && (
                            <button
                              type="button"
                              onClick={() => handleCollectCod(ord.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                              title="Mark Cash on Delivery as collected"
                            >
                              Collect COD
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Customer Info & Street Address */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <strong className="text-[#10263D]">{ord.customer?.name}</strong> ({ord.customer?.phone})
                          <p className="text-[#52677B] mt-0.5">{ord.customer?.address}, {ord.customer?.division}</p>
                        </div>
                        <div className="text-right sm:text-right">
                          <span className="text-[11px] font-semibold text-[#52677B] block">
                            Method: <strong className="uppercase">{ord.paymentMethod}</strong> • {ord.paymentStatus}
                          </span>
                          <span className="text-sm font-extrabold text-[#145CFF]">
                            Total: {currencySymbol}{ord.total?.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-100 text-xs text-[#52677B]">
                        <span className="font-bold text-[#10263D] block mb-1">Items Snapshot:</span>
                        {ord.items?.map((it, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{it.title} ({it.variant}) × {it.quantity}</span>
                            <span>{currencySymbol}{(it.price * it.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
                )}
              </div>
            )}

            {/* TAB 3: PRODUCTS CATALOG MANAGEMENT */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="input-field text-xs py-1.5 w-48"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setProductFormData({
                        sku: '',
                        title: '',
                        titleBn: '',
                        category: 'cases',
                        brand: 'Apple',
                        price: '',
                        originalPrice: '',
                        stock: '10',
                        warranty: '6-Month Official Replacement',
                        badge: 'New',
                        description: '',
                        image: '',
                        specs: { "Drop Protection": "Military Grade" },
                        compatibleWith: ["iPhone 15 Pro Max", "iPhone 15 Pro"],
                        variants: [{ id: "v1", name: "Glacial Blue", hex: "#CBE4FC", stock: 10 }]
                      });
                      setShowProductForm(true);
                    }}
                    className="px-4 py-2 rounded-full bg-[#145CFF] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus size={15} />
                    <span>Create Product</span>
                  </button>
                </div>

                {/* Products Table */}
                <div className="border border-[#DCE7F0] rounded-2xl overflow-hidden bg-white">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#F8FAFC] border-b border-[#DCE7F0] text-[#52677B] font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Product</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Stock</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="p-3 flex items-center gap-2.5">
                            <img src={p.image} alt={p.title} className="w-10 h-10 object-contain rounded-lg bg-[#EAF4FC]" />
                            <div>
                              <strong className="block text-[#10263D]">{p.title}</strong>
                              <span className="text-[10px] text-[#52677B] font-mono">{p.sku}</span>
                            </div>
                          </td>
                          <td className="p-3 uppercase font-semibold text-[#52677B]">{p.category}</td>
                          <td className="p-3 font-bold text-[#10263D]">{currencySymbol}{p.price.toLocaleString()}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              p.stock > 5 ? 'bg-emerald-50 text-emerald-700' :
                              p.stock > 0 ? 'bg-amber-50 text-amber-700' :
                              'bg-red-50 text-red-700'
                            }`}>
                              {p.stock} units
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] capitalize ${
                              p.status === 'published' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button
                              onClick={() => toggleProductStatus(p.id, p.status)}
                              className="text-[11px] font-semibold text-[#52677B] hover:text-[#10263D]"
                            >
                              {p.status === 'published' ? 'Archive' : 'Publish'}
                            </button>
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setProductFormData({
                                  ...p,
                                  stock: p.stock.toString(),
                                  price: p.price.toString()
                                });
                                setShowProductForm(true);
                              }}
                              className="text-[11px] font-semibold text-[#145CFF] hover:underline"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Create/Edit Product Form Modal */}
                {showProductForm && (
                  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-[#DCE7F0] shadow-2xl">
                      <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                        <h3 className="font-bold text-sm text-[#10263D]">
                          {editingProduct ? 'Edit Product' : 'Create New Product'}
                        </h3>
                        <button onClick={() => setShowProductForm(false)} className="text-slate-400 hover:text-slate-700">
                          <X size={18} />
                        </button>
                      </div>

                      <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="font-bold block mb-1">SKU</label>
                            <input
                              type="text"
                              required
                              value={productFormData.sku}
                              onChange={(e) => setProductFormData({ ...productFormData, sku: e.target.value })}
                              className="input-field text-xs py-1.5"
                            />
                          </div>
                          <div>
                            <label className="font-bold block mb-1">Category</label>
                            <select
                              value={productFormData.category}
                              onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                              className="input-field text-xs py-1.5"
                            >
                              <option value="cases">Cases</option>
                              <option value="audio">Audio</option>
                              <option value="charging">Charging</option>
                              <option value="powerbanks">Power Banks</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="font-bold block mb-1">Title (English)</label>
                          <input
                            type="text"
                            required
                            value={productFormData.title}
                            onChange={(e) => setProductFormData({ ...productFormData, title: e.target.value })}
                            className="input-field text-xs py-1.5"
                          />
                        </div>

                        <div>
                          <label className="font-bold block mb-1">Title (Bengali)</label>
                          <input
                            type="text"
                            value={productFormData.titleBn || ''}
                            onChange={(e) => setProductFormData({ ...productFormData, titleBn: e.target.value })}
                            className="input-field text-xs py-1.5"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="font-bold block mb-1">Price (৳)</label>
                            <input
                              type="number"
                              required
                              value={productFormData.price}
                              onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                              className="input-field text-xs py-1.5"
                            />
                          </div>
                          <div>
                            <label className="font-bold block mb-1">Original Price (৳)</label>
                            <input
                              type="number"
                              value={productFormData.originalPrice || ''}
                              onChange={(e) => setProductFormData({ ...productFormData, originalPrice: e.target.value })}
                              className="input-field text-xs py-1.5"
                            />
                          </div>
                          <div>
                            <label className="font-bold block mb-1">Stock</label>
                            <input
                              type="number"
                              required
                              value={productFormData.stock}
                              onChange={(e) => setProductFormData({ ...productFormData, stock: e.target.value })}
                              className="input-field text-xs py-1.5"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-bold block mb-1">Product Image URL or Upload</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={productFormData.image || ''}
                              onChange={(e) => setProductFormData({ ...productFormData, image: e.target.value })}
                              placeholder="https://... or upload below"
                              className="input-field text-xs py-1.5 flex-1"
                            />
                            <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#10263D] rounded-xl cursor-pointer font-semibold flex items-center gap-1">
                              <Upload size={14} />
                              <span>Upload</span>
                              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="font-bold block mb-1">Description</label>
                          <textarea
                            rows={3}
                            value={productFormData.description || ''}
                            onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                            className="input-field text-xs py-1.5"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setShowProductForm(false)}
                            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl bg-[#145CFF] text-white font-semibold shadow-xs"
                          >
                            Save Product
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: INVENTORY & STOCK ADJUSTMENTS */}
            {activeTab === 'inventory' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#10263D] mb-3">
                    Active Stock Quantities & Fast Restocking
                  </h3>
                  <div className="border border-[#DCE7F0] rounded-2xl overflow-hidden bg-white">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#F8FAFC] border-b border-[#DCE7F0] text-[#52677B] font-bold uppercase">
                        <tr>
                          <th className="p-3">Product SKU</th>
                          <th className="p-3">Title</th>
                          <th className="p-3">Current Stock</th>
                          <th className="p-3 text-right">Quick Restock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {products.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50">
                            <td className="p-3 font-mono text-[#145CFF] font-bold">{p.sku}</td>
                            <td className="p-3 text-[#10263D] font-medium">{p.title}</td>
                            <td className="p-3 font-bold">{p.stock} units</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => {
                                  setStockAdjustmentTarget(p);
                                  setStockDelta(10);
                                  setStockReason('Restock shipment');
                                }}
                                className="px-3 py-1 rounded-lg bg-[#EAF4FC] text-[#145CFF] hover:bg-[#145CFF] hover:text-white font-semibold transition-colors"
                              >
                                Adjust Stock
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Audit Log Table */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#10263D] mb-3">
                    Inventory Adjustment Audit History
                  </h3>
                  <div className="border border-[#DCE7F0] rounded-2xl overflow-hidden bg-white">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#F8FAFC] border-b border-[#DCE7F0] text-[#52677B] font-bold uppercase">
                        <tr>
                          <th className="p-3">Timestamp</th>
                          <th className="p-3">Product</th>
                          <th className="p-3">Change</th>
                          <th className="p-3">Previous → New</th>
                          <th className="p-3">Reason</th>
                          <th className="p-3">Adjusted By</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {adjustments.map(adj => (
                          <tr key={adj.id}>
                            <td className="p-3 text-[#52677B]">
                              {new Date(adj.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                            </td>
                            <td className="p-3 font-mono font-semibold">{adj.product_id}</td>
                            <td className="p-3">
                              <span className={`font-bold ${adj.quantity_change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {adj.quantity_change > 0 ? `+${adj.quantity_change}` : adj.quantity_change}
                              </span>
                            </td>
                            <td className="p-3 text-[#52677B]">{adj.previous_stock} → {adj.new_stock}</td>
                            <td className="p-3 text-[#10263D]">{adj.reason}</td>
                            <td className="p-3 text-[#52677B] font-mono">{adj.adjusted_by}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick Stock Adjustment Modal */}
                {stockAdjustmentTarget && (
                  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#DCE7F0] shadow-2xl">
                      <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                        <h3 className="font-bold text-sm text-[#10263D]">
                          Adjust Stock: {stockAdjustmentTarget.title}
                        </h3>
                        <button onClick={() => setStockAdjustmentTarget(null)} className="text-slate-400">
                          <X size={18} />
                        </button>
                      </div>

                      <form onSubmit={handleExecuteStockAdjustment} className="space-y-3 text-xs">
                        <div>
                          <label className="font-bold block mb-1">Current Stock</label>
                          <span className="font-bold text-base text-[#10263D]">{stockAdjustmentTarget.stock} units</span>
                        </div>

                        <div>
                          <label className="font-bold block mb-1">Quantity Delta (+/-)</label>
                          <input
                            type="number"
                            required
                            value={stockDelta}
                            onChange={(e) => setStockDelta(parseInt(e.target.value, 10))}
                            className="input-field text-xs py-1.5"
                          />
                          <span className="text-[10px] text-[#52677B]">Positive adds stock, negative removes stock.</span>
                        </div>

                        <div>
                          <label className="font-bold block mb-1">Reason / Reference</label>
                          <input
                            type="text"
                            required
                            value={stockReason}
                            onChange={(e) => setStockReason(e.target.value)}
                            className="input-field text-xs py-1.5"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setStockAdjustmentTarget(null)}
                            className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-lg bg-[#145CFF] text-white font-semibold"
                          >
                            Apply Adjustment
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: PROMOTIONS */}
            {activeTab === 'promotions' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#10263D]">Active Discount Promotions</h3>
                  <button
                    onClick={() => setShowPromoForm(!showPromoForm)}
                    className="px-3.5 py-1.5 rounded-full bg-[#145CFF] text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus size={14} />
                    <span>Create Promo</span>
                  </button>
                </div>

                {showPromoForm && (
                  <form onSubmit={handleCreatePromo} className="p-4 rounded-2xl bg-[#EAF4FC] border border-[#DCE7F0] space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold block mb-1">Coupon Code</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. GLACIAL10"
                          value={newPromo.code}
                          onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value })}
                          className="input-field text-xs font-mono py-1.5"
                        />
                      </div>
                      <div>
                        <label className="font-bold block mb-1">Promotion Title</label>
                        <input
                          type="text"
                          required
                          placeholder="Summer Accessories Discount"
                          value={newPromo.title}
                          onChange={(e) => setNewPromo({ ...newPromo, title: e.target.value })}
                          className="input-field text-xs py-1.5"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="font-bold block mb-1">Discount Type</label>
                        <select
                          value={newPromo.discountType}
                          onChange={(e) => setNewPromo({ ...newPromo, discountType: e.target.value })}
                          className="input-field text-xs py-1.5"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount (৳)</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-bold block mb-1">Discount Value</label>
                        <input
                          type="number"
                          required
                          value={newPromo.discountValue}
                          onChange={(e) => setNewPromo({ ...newPromo, discountValue: parseFloat(e.target.value) })}
                          className="input-field text-xs py-1.5"
                        />
                      </div>
                      <div>
                        <label className="font-bold block mb-1">Min Order (৳)</label>
                        <input
                          type="number"
                          value={newPromo.minOrderAmount}
                          onChange={(e) => setNewPromo({ ...newPromo, minOrderAmount: parseFloat(e.target.value) })}
                          className="input-field text-xs py-1.5"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button type="button" onClick={() => setShowPromoForm(false)} className="px-3 py-1.5 text-slate-600">
                        Cancel
                      </button>
                      <button type="submit" className="px-4 py-1.5 rounded-lg bg-[#145CFF] text-white font-semibold">
                        Save Promotion
                      </button>
                    </div>
                  </form>
                )}

                <div className="border border-[#DCE7F0] rounded-2xl overflow-hidden bg-white">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#F8FAFC] border-b border-[#DCE7F0] text-[#52677B] font-bold uppercase">
                      <tr>
                        <th className="p-3">Code</th>
                        <th className="p-3">Title</th>
                        <th className="p-3">Discount</th>
                        <th className="p-3">Validity</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {promotions.map(p => (
                        <tr key={p.id}>
                          <td className="p-3 font-mono font-bold text-[#145CFF]">{p.code}</td>
                          <td className="p-3 font-semibold text-[#10263D]">{p.title}</td>
                          <td className="p-3 font-bold">
                            {p.discount_type === 'percentage' ? `${p.discount_value}%` : `৳${p.discount_value}`}
                          </td>
                          <td className="p-3 text-[#52677B]">
                            {new Date(p.start_date).toLocaleDateString()} – {new Date(p.end_date).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-right">
                            <button onClick={() => handleDeletePromo(p.id)} className="text-red-500 font-semibold hover:underline">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 6: REVIEWS MODERATION */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#10263D]">Verified Customer Reviews</h3>
                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#52677B]">No reviews submitted yet.</div>
                ) : (
                  reviews.map(r => (
                    <div key={r.id} className="p-4 rounded-xl border border-[#DCE7F0] bg-white flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-xs text-[#10263D]">{r.user_name}</span>
                          <span className="text-amber-500 font-bold text-xs">★ {r.rating}/5</span>
                          <span className="text-[10px] text-[#52677B] font-mono">Product: {r.product_id}</span>
                        </div>
                        <p className="text-xs text-[#52677B]">{r.comment}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {r.status}
                        </span>
                        {r.status !== 'approved' ? (
                          <button
                            onClick={() => handleModerateReview(r.id, 'approved')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleModerateReview(r.id, 'rejected')}
                            className="px-2.5 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-semibold"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 7: SERVICE REQUESTS */}
            {activeTab === 'services' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#10263D]">Hardware & Accessory Service Requests</h3>
                {serviceRequests.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#52677B]">No service requests logged.</div>
                ) : (
                  serviceRequests.map(s => (
                    <div key={s.id} className="p-4 rounded-xl border border-[#DCE7F0] bg-white space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono font-bold text-[#145CFF]">{s.id}</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] uppercase">
                          {s.status}
                        </span>
                      </div>
                      <div className="text-xs text-[#10263D]">
                        <strong>{s.customer_name}</strong> ({s.customer_phone}) — {s.device_model}
                        <p className="text-[#52677B] mt-0.5">{s.description}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
