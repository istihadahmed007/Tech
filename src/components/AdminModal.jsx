import React, { useState, useEffect } from 'react';
import { X, Lock, Key, ShieldCheck, RefreshCw, Package, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

export default function AdminModal({ 
  isOpen, 
  onClose, 
  products, 
  onRestockProduct, 
  currencySymbol = "৳" 
}) {
  const [authToken, setAuthToken] = useState(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'inventory'

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
      loadAdminOrders(data.token);
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const loadAdminOrders = async (token) => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      // Ignored
    } finally {
      setLoadingOrders(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

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

  if (!isOpen) return null;

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalStockCount = products.reduce((sum, p) => sum + p.stock, 0);

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-[#FFFFFF] border border-[#DCE7F0] shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 60px -15px rgba(16, 38, 61, 0.20)'
        }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#DCE7F0] mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#10263D] text-white flex items-center justify-center font-bold">
              <Lock size={18} />
            </div>
            <div>
              <h2 id="admin-modal-title" className="text-xl font-bold text-[#10263D]">
                Admin Operations Console
              </h2>
              <p className="text-xs text-[#52677B]">
                Protected store administration & live order queue
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
          <div className="max-w-sm mx-auto py-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF4FC] text-[#145CFF] mx-auto flex items-center justify-center mb-4">
              <Key size={26} />
            </div>
            <h3 className="text-lg font-bold text-[#10263D] mb-1">
              Store Manager Access
            </h3>
            <p className="text-xs text-[#52677B] mb-5">
              Enter admin passcode (Default: <code>admin123</code>)
            </p>

            <form onSubmit={handleLogin} className="space-y-3">
              <label htmlFor="admin-passcode-input" className="sr-only">
                Admin Passcode
              </label>
              <input
                id="admin-passcode-input"
                type="password"
                required
                autoComplete="current-password"
                placeholder="Enter admin passcode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field text-center font-mono tracking-widest text-sm py-2.5"
                autoFocus
              />
              {loginError && (
                <p className="text-xs text-red-600 font-semibold" role="alert">{loginError}</p>
              )}
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#145CFF] hover:bg-[#0D4BD9] text-white font-bold text-xs shadow-md shadow-blue-500/20"
              >
                Authenticate Session
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div>
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-[#EAF4FC] border border-[#DCE7F0]">
                <span className="text-[11px] font-bold uppercase text-[#52677B] block mb-1">Total Orders</span>
                <span className="text-2xl font-extrabold text-[#10263D]">{orders.length}</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60">
                <span className="text-[11px] font-bold uppercase text-emerald-800 block mb-1">Gross Revenue</span>
                <span className="text-2xl font-extrabold text-emerald-700">{currencySymbol}{totalRevenue.toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/60">
                <span className="text-[11px] font-bold uppercase text-purple-800 block mb-1">Live Stock Units</span>
                <span className="text-2xl font-extrabold text-purple-700">{totalStockCount} items</span>
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="flex items-center gap-2 mb-4 border-b border-[#DCE7F0] pb-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                  activeTab === 'orders' ? 'bg-[#145CFF] text-white' : 'text-[#52677B] hover:bg-[#EAF4FC]'
                }`}
              >
                Customer Orders Queue ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                  activeTab === 'inventory' ? 'bg-[#145CFF] text-white' : 'text-[#52677B] hover:bg-[#EAF4FC]'
                }`}
              >
                Product Stock Levels
              </button>

              <button
                onClick={() => loadAdminOrders(authToken)}
                className="ml-auto p-2 text-[#52677B] hover:text-[#145CFF] text-xs flex items-center gap-1"
                title="Refresh queue"
              >
                <RefreshCw size={14} className={loadingOrders ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="overflow-x-auto">
                {orders.length > 0 ? (
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#DCE7F0] text-[#52677B] font-bold uppercase">
                        <th className="py-2.5 px-3">Order ID</th>
                        <th className="py-2.5 px-3">Customer & Phone</th>
                        <th className="py-2.5 px-3">Items</th>
                        <th className="py-2.5 px-3">Total</th>
                        <th className="py-2.5 px-3">Payment</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-[#EAF4FC]/60">
                          <td className="py-3 px-3 font-mono font-bold text-[#145CFF]">
                            {order.id}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-[#10263D] block">{order.customer?.name}</span>
                            <span className="text-[#8FA6BE]">{order.customer?.phone}</span>
                          </td>
                          <td className="py-3 px-3 max-w-[200px] truncate text-[#52677B]">
                            {order.items?.map(i => `${i.title} (${i.quantity})`).join(', ')}
                          </td>
                          <td className="py-3 px-3 font-extrabold text-[#10263D]">
                            {currencySymbol}{order.total?.toLocaleString()}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              order.paymentStatus === 'paid' || order.paymentStatus === 'verified'
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {order.paymentMethod} • {order.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="text-xs font-semibold py-1 px-2 rounded-lg border border-[#DCE7F0] bg-white text-[#10263D]"
                            >
                              <option value="pending_payment">Pending Payment</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8 text-xs text-[#8FA6BE]">
                    No orders placed yet. Place a test order in the storefront!
                  </div>
                )}
              </div>
            )}

            {/* Inventory Tab */}
            {activeTab === 'inventory' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#DCE7F0] text-[#52677B] font-bold uppercase">
                      <th className="py-2.5 px-3">Product</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Price</th>
                      <th className="py-2.5 px-3">Stock Units</th>
                      <th className="py-2.5 px-3">Quick Restock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#EAF4FC]/60">
                        <td className="py-3 px-3 font-bold text-[#10263D]">
                          {p.title}
                        </td>
                        <td className="py-3 px-3 capitalize text-[#52677B]">
                          {p.category}
                        </td>
                        <td className="py-3 px-3 font-bold text-[#10263D]">
                          {currencySymbol}{p.price.toLocaleString()}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`font-bold ${p.stock <= 5 ? 'text-amber-600' : 'text-emerald-700'}`}>
                            {p.stock} in stock
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => onRestockProduct(p.id, 10)}
                            className="px-2.5 py-1 rounded-lg bg-[#EAF4FC] hover:bg-[#DCE7F0] text-[#145CFF] font-semibold text-[11px]"
                          >
                            +10 Units
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
