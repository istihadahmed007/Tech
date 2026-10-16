import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  Heart, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Plus,
  Trash2,
  ExternalLink,
  Printer
} from 'lucide-react';
import { openPrintWindow } from '../utils/invoice.js';
import { safeFetchJson } from '../utils/api.js';

export default function AccountModal({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  onSelectProduct,
  onAddToCart,
  currencySymbol = "৳",
  t,
  lang
}) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'addresses', 'wishlist', 'link_order'
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // User Data State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // New Address Form State
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    division: 'Dhaka',
    outsideCity: false,
    address: '',
    phone: ''
  });
  const [showAddAddress, setShowAddAddress] = useState(false);

  // Link Guest Order State
  const [linkOrderId, setLinkOrderId] = useState('');
  const [linkGuestToken, setLinkGuestToken] = useState('');
  const [linkMessage, setLinkMessage] = useState({ text: '', isError: false });

  const closeButtonRef = useRef(null);

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

  // Load orders and wishlist when user logs in or tab changes
  useEffect(() => {
    if (!currentUser || !isOpen) return;

    if (activeTab === 'orders') {
      loadCustomerOrders();
    } else if (activeTab === 'wishlist') {
      loadCustomerWishlist();
    }
  }, [currentUser, activeTab, isOpen]);

  const loadCustomerOrders = async () => {
    const token = localStorage.getItem('accessories_customer_token');
    if (!token) return;

    setLoadingOrders(true);
    try {
      const res = await safeFetchJson('/api/customer/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok && res.data?.orders) {
        setOrders(res.data.orders);
      }
    } catch (e) {
      console.warn('Failed to load orders', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadCustomerWishlist = async () => {
    const token = localStorage.getItem('accessories_customer_token');
    if (!token) return;

    setLoadingWishlist(true);
    try {
      const res = await safeFetchJson('/api/customer/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok && res.data?.productIds) {
        // Fetch product details
        const prodRes = await safeFetchJson('/api/products');
        if (prodRes.ok && prodRes.data?.products) {
          const matched = prodRes.data.products.filter(p => res.data.productIds.includes(p.id));
          setWishlistProducts(matched);
        }
      }
    } catch (e) {
      console.warn('Failed to load wishlist', e);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = authMode === 'login' 
      ? { email, password }
      : { email, password, name, phone };

    try {
      const res = await safeFetchJson(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok || !res.data?.success) {
        throw new Error(res.error || 'Authentication failed');
      }

      localStorage.setItem('accessories_customer_token', res.data.token);
      onLoginSuccess(res.data.user, res.data.token);
      setActiveTab('orders');
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.address.trim()) return;

    const token = localStorage.getItem('accessories_customer_token');
    const updatedAddresses = [...(currentUser.addresses || []), { ...newAddress, id: Date.now().toString() }];

    try {
      const res = await safeFetchJson('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ addresses: updatedAddresses })
      });
      if (res.ok && res.data?.user) {
        onLoginSuccess(res.data.user, token);
        setShowAddAddress(false);
        setNewAddress({ label: 'Home', division: 'Dhaka', outsideCity: false, address: '', phone: '' });
      }
    } catch (e) {
      alert('Failed to save address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    const token = localStorage.getItem('accessories_customer_token');
    const updatedAddresses = (currentUser.addresses || []).filter(a => a.id !== addressId);

    try {
      const res = await safeFetchJson('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ addresses: updatedAddresses })
      });
      if (res.ok && res.data?.user) {
        onLoginSuccess(res.data.user, token);
      }
    } catch (e) {
      alert('Failed to delete address');
    }
  };

  const handleLinkGuestOrder = async (e) => {
    e.preventDefault();
    setLinkMessage({ text: '', isError: false });

    const token = localStorage.getItem('accessories_customer_token');
    try {
      const res = await safeFetchJson('/api/customer/orders/link-guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: linkOrderId.trim(),
          guestToken: linkGuestToken.trim()
        })
      });
      if (!res.ok) {
        throw new Error(res.error || 'Failed to link order');
      }
      setLinkMessage({ text: 'Order linked successfully to your account!', isError: false });
      setLinkOrderId('');
      setLinkGuestToken('');
      loadCustomerOrders();
    } catch (err) {
      setLinkMessage({ text: err.message, isError: true });
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="customer-account-title"
    >
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-[#FFFFFF] border border-[#DCE7F0] shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 25px 60px -15px rgba(16, 38, 61, 0.20)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#DCE7F0] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF4FC] text-[#145CFF] flex items-center justify-center font-bold">
              <User size={20} />
            </div>
            <div>
              <h2 id="customer-account-title" className="text-xl font-bold text-[#10263D]">
                {currentUser ? `Welcome, ${currentUser.name}` : 'Customer Account'}
              </h2>
              <p className="text-xs text-[#52677B]">
                {currentUser ? currentUser.email : 'Sign in to access order history, saved addresses & wishlist'}
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-[#52677B] hover:text-[#10263D] focus-visible:ring-2 focus-visible:ring-[#145CFF]"
            aria-label="Close account modal"
          >
            <X size={20} />
          </button>
        </div>

        {!currentUser ? (
          /* Authentication Gate */
          <div className="max-w-md mx-auto py-4">
            <div className="flex rounded-full bg-slate-100 p-1 mb-6">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
                  authMode === 'login' ? 'bg-white text-[#10263D] shadow-xs' : 'text-[#52677B] hover:text-[#10263D]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthError(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
                  authMode === 'register' ? 'bg-white text-[#10263D] shadow-xs' : 'text-[#52677B] hover:text-[#10263D]'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-[#10263D] mb-1">Full Name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahim Chowdhury"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field pl-10 text-xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#10263D] mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10 text-xs"
                  />
                </div>
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-[#10263D] mb-1">Mobile Number (BD)</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="017XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-field pl-10 text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#10263D] mb-1">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10 text-xs"
                  />
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 rounded-full bg-[#145CFF] hover:bg-[#0D4BD9] text-white font-semibold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {authLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{authMode === 'login' ? 'Sign In to Account' : 'Register Account'}</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Logged In Customer Dashboard */
          <div>
            {/* Tab Navigation */}
            <div className="flex border-b border-[#DCE7F0] mb-6 overflow-x-auto gap-4">
              <button
                onClick={() => setActiveTab('orders')}
                className={`pb-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all shrink-0 ${
                  activeTab === 'orders'
                    ? 'border-[#145CFF] text-[#145CFF]'
                    : 'border-transparent text-[#52677B] hover:text-[#10263D]'
                }`}
              >
                <Package size={16} />
                <span>My Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`pb-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all shrink-0 ${
                  activeTab === 'addresses'
                    ? 'border-[#145CFF] text-[#145CFF]'
                    : 'border-transparent text-[#52677B] hover:text-[#10263D]'
                }`}
              >
                <MapPin size={16} />
                <span>Saved Addresses ({currentUser.addresses?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`pb-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all shrink-0 ${
                  activeTab === 'wishlist'
                    ? 'border-[#145CFF] text-[#145CFF]'
                    : 'border-transparent text-[#52677B] hover:text-[#10263D]'
                }`}
              >
                <Heart size={16} />
                <span>Wishlist ({wishlistProducts.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('link_order')}
                className={`pb-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all shrink-0 ${
                  activeTab === 'link_order'
                    ? 'border-[#145CFF] text-[#145CFF]'
                    : 'border-transparent text-[#52677B] hover:text-[#10263D]'
                }`}
              >
                <ShieldCheck size={16} />
                <span>Link Guest Order</span>
              </button>

              <button
                onClick={onLogout}
                className="pb-3 text-xs font-bold text-red-500 hover:text-red-700 ml-auto flex items-center gap-1 shrink-0"
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Tab 1: Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {loadingOrders ? (
                  <div className="text-center py-10">
                    <span className="w-6 h-6 border-2 border-[#145CFF] border-t-transparent rounded-full animate-spin inline-block mb-2" />
                    <p className="text-xs text-[#52677B]">Loading your order history...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-10 rounded-2xl bg-[#EAF4FC] border border-[#DCE7F0] p-6">
                    <Package size={32} className="mx-auto text-[#145CFF] mb-2 opacity-60" />
                    <h3 className="text-sm font-bold text-[#10263D] mb-1">No orders placed yet</h3>
                    <p className="text-xs text-[#52677B]">Orders placed under your account will appear here with live tracking.</p>
                  </div>
                ) : (
                  orders.map((ord) => (
                    <div key={ord.id} className="p-4 rounded-2xl bg-white border border-[#DCE7F0] hover:border-[#145CFF]/30 transition-all shadow-2xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div>
                          <span className="text-[11px] font-mono font-bold text-[#145CFF] block">
                            {ord.id}
                          </span>
                          <span className="text-[10px] text-[#52677B]">
                            {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                            ord.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            ord.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200' :
                            'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {ord.status}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                            ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ord.paymentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="py-2.5 space-y-1.5 text-xs">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-[#52677B]">
                            <span>{it.title} ({it.variant}) × {it.quantity}</span>
                            <span className="font-semibold text-[#10263D]">{currencySymbol}{(it.price * it.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#10263D]">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#52677B]">Total:</span>
                          <span className="text-sm text-[#145CFF]">{currencySymbol}{ord.total.toLocaleString()}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => openPrintWindow(ord, 'invoice')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#EAF4FC] hover:text-[#145CFF] text-[#10263D] text-[11px] font-semibold transition-colors"
                          title="Print or view invoice receipt"
                        >
                          <Printer size={12} />
                          <span>Invoice</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 2: Saved Addresses */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#10263D]">Delivery Addresses</h3>
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="text-xs font-bold text-[#145CFF] hover:underline flex items-center gap-1"
                  >
                    <Plus size={14} />
                    <span>Add New Address</span>
                  </button>
                </div>

                {showAddAddress && (
                  <form onSubmit={handleSaveAddress} className="p-4 rounded-2xl bg-[#EAF4FC] border border-[#DCE7F0] space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#10263D] mb-1">Label</label>
                        <input
                          type="text"
                          required
                          value={newAddress.label}
                          onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                          placeholder="Home, Office, etc."
                          className="input-field text-xs py-1.5"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#10263D] mb-1">Division</label>
                        <select
                          value={newAddress.division}
                          onChange={(e) => setNewAddress({ ...newAddress, division: e.target.value })}
                          className="input-field text-xs py-1.5"
                        >
                          <option value="Dhaka">Dhaka</option>
                          <option value="Chittagong">Chittagong</option>
                          <option value="Sylhet">Sylhet</option>
                          <option value="Rajshahi">Rajshahi</option>
                          <option value="Khulna">Khulna</option>
                          <option value="Barisal">Barisal</option>
                          <option value="Rangpur">Rangpur</option>
                          <option value="Mymensingh">Mymensingh</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#10263D] mb-1">Street Address</label>
                      <input
                        type="text"
                        required
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                        placeholder="House, road, area details"
                        className="input-field text-xs py-1.5"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(false)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-[#145CFF] text-white text-xs font-semibold shadow-xs"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                {(!currentUser.addresses || currentUser.addresses.length === 0) ? (
                  <div className="text-center py-8 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-[#52677B]">
                    No saved addresses. Add an address to speed up checkout.
                  </div>
                ) : (
                  currentUser.addresses.map((addr) => (
                    <div key={addr.id} className="p-4 rounded-xl border border-[#DCE7F0] bg-white flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-xs text-[#10263D]">{addr.label}</span>
                          <span className="text-[10px] bg-[#EAF4FC] text-[#145CFF] px-2 py-0.5 rounded font-medium">
                            {addr.division}
                          </span>
                        </div>
                        <p className="text-xs text-[#52677B]">{addr.address}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-slate-400 hover:text-red-500 p-1"
                        title="Delete address"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 3: Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="space-y-3">
                {loadingWishlist ? (
                  <div className="text-center py-10">
                    <span className="w-6 h-6 border-2 border-[#145CFF] border-t-transparent rounded-full animate-spin inline-block mb-2" />
                    <p className="text-xs text-[#52677B]">Loading your wishlist...</p>
                  </div>
                ) : wishlistProducts.length === 0 ? (
                  <div className="text-center py-8 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-[#52677B]">
                    Your saved wishlist is empty. Tap the heart on products you love to save them.
                  </div>
                ) : (
                  wishlistProducts.map((p) => (
                    <div key={p.id} className="p-3.5 rounded-xl border border-[#DCE7F0] bg-white flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.title} className="w-12 h-12 object-contain rounded-lg bg-[#EAF4FC]" />
                        <div>
                          <h4 className="text-xs font-bold text-[#10263D]">{p.title}</h4>
                          <span className="text-xs font-bold text-[#145CFF]">{currencySymbol}{p.price.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => { onAddToCart(p); }}
                          className="px-3 py-1.5 rounded-full bg-[#145CFF] text-white text-xs font-semibold hover:bg-[#0D4BD9]"
                        >
                          Add to Bag
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 4: Link Guest Order */}
            {activeTab === 'link_order' && (
              <div className="p-5 rounded-2xl bg-[#EAF4FC] border border-[#DCE7F0]">
                <h3 className="text-sm font-bold text-[#10263D] mb-1">Link an Existing Guest Order</h3>
                <p className="text-xs text-[#52677B] mb-4">
                  Did you place an order before signing in? Enter your Order Reference ID and Access Token (from order confirmation) to link it to this account.
                </p>

                <form onSubmit={handleLinkGuestOrder} className="space-y-3 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-[#10263D] mb-1">Order Reference ID</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AGY-849201"
                      value={linkOrderId}
                      onChange={(e) => setLinkOrderId(e.target.value)}
                      className="input-field text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#10263D] mb-1">Guest Access Token</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter security token"
                      value={linkGuestToken}
                      onChange={(e) => setLinkGuestToken(e.target.value)}
                      className="input-field text-xs font-mono"
                    />
                  </div>

                  {linkMessage.text && (
                    <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      linkMessage.isError ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    }`}>
                      {linkMessage.isError ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
                      <span>{linkMessage.text}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-[#145CFF] hover:bg-[#0D4BD9] text-white text-xs font-semibold shadow-xs"
                  >
                    Verify & Link Order
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
