import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Package, CheckCircle2, ShieldAlert, Key, Lock, ShieldCheck, Printer } from 'lucide-react';
import { openPrintWindow } from '../utils/invoice.js';
import { safeFetchJson } from '../utils/api.js';

export default function OrderTrackingModal({ 
  isOpen, 
  onClose, 
  initialOrderId = '', 
  initialToken = '',
  currencySymbol = "৳" 
}) {
  const [orderIdInput, setOrderIdInput] = useState(initialOrderId);
  const [tokenInput, setTokenInput] = useState(initialToken);
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (initialOrderId) {
      setOrderIdInput(initialOrderId);
      setTokenInput(initialToken || '');
      fetchOrder(initialOrderId, initialToken || '');
    }
  }, [initialOrderId, initialToken]);

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

  const fetchOrder = async (id, token = '') => {
    if (!id.trim()) return;
    setLoading(true);
    setError('');

    const customerToken = localStorage.getItem('accessories_customer_token');
    const headers = customerToken ? { Authorization: `Bearer ${customerToken}` } : {};

    try {
      let url = `/api/orders/${encodeURIComponent(id.trim())}`;
      if (token.trim()) {
        url += `?token=${encodeURIComponent(token.trim())}`;
      }

      const res = await safeFetchJson(url, { headers });
      if (res.ok && res.data?.success) {
        setSearchedOrder(res.data.order);
        setIsAuthorized(Boolean(res.data.authorized));
      } else if (res.isHtml || res.isNetworkError) {
        // Fallback for static host / offline
        let found = null;
        try {
          const localOrders = JSON.parse(localStorage.getItem('accessories_orders') || '[]');
          found = localOrders.find(o => o.id === id.trim());
        } catch (e) {}

        if (found) {
          setSearchedOrder(found);
          setIsAuthorized(true);
        } else {
          setError('No matching order found');
          setSearchedOrder(null);
          setIsAuthorized(false);
        }
      } else {
        throw new Error(res.error || 'No matching order found');
      }
    } catch (err) {
      setError(err.message || 'Order lookup failed.');
      setSearchedOrder(null);
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrder(orderIdInput, tokenInput);
  };

  if (!isOpen) return null;

  const steps = [
    { label: 'Order Placed', desc: 'Received in system' },
    { label: 'Confirmed', desc: 'Order verified' },
    { label: 'Packaging', desc: 'Fulfillment queue' },
    { label: 'In Transit', desc: 'Courier dispatch' },
    { label: 'Delivered', desc: 'Delivered to customer' }
  ];

  const getStepIndex = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const currentStep = getStepIndex(searchedOrder?.status);

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tracking-dialog-title"
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-[#FFFFFF] border border-[#DCE7F0] shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 60px -15px rgba(16, 38, 61, 0.20)'
        }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#DCE7F0] mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF4FC] flex items-center justify-center text-[#EE4D2D] font-bold">
              <Package size={20} />
            </div>
            <div>
              <h2 id="tracking-dialog-title" className="text-lg sm:text-xl font-bold text-[#10263D]">
                Order Tracking & Privacy Status
              </h2>
              <p className="text-xs text-[#52677B]">
                Live status tracking protected by secure ownership checks
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-[#52677B] hover:text-[#10263D] focus-visible:ring-2 focus-visible:ring-[#EE4D2D]"
            aria-label="Close tracking dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="space-y-3 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label htmlFor="tracking-input-id" className="block text-[11px] font-bold text-[#10263D] mb-1">
                Order Reference ID *
              </label>
              <input
                id="tracking-input-id"
                type="text"
                required
                placeholder="e.g. AGY-849201"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="input-field text-xs font-mono"
              />
            </div>

            <div>
              <label htmlFor="tracking-input-token" className="block text-[11px] font-bold text-[#10263D] mb-1">
                Security Token (Optional for guest full view)
              </label>
              <div className="relative">
                <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="tracking-input-token"
                  type="text"
                  placeholder="Guest access token"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="input-field pl-9 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-full bg-[#EE4D2D] hover:bg-[#D73211] text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search size={15} />
              )}
              <span>Track Parcel</span>
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 mb-6" role="alert">
            <ShieldAlert size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {searchedOrder && (
          <div className="space-y-6">
            {/* Privacy Level Notice Banner */}
            <div className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between ${
              isAuthorized 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-blue-50/70 border-blue-200 text-blue-900'
            }`}>
              <div className="flex items-center gap-2">
                {isAuthorized ? <ShieldCheck size={17} className="text-emerald-600 shrink-0" /> : <Lock size={17} className="text-[#EE4D2D] shrink-0" />}
                <span>
                  {isAuthorized 
                    ? 'Verified Owner Access: Full delivery address and recipient details unlocked.' 
                    : 'Protected View: Personal street address and recipient details are masked to protect customer privacy.'}
                </span>
              </div>
            </div>

            {/* Order Card Overview */}
            <div className="p-4 rounded-2xl bg-[#EAF4FC] border border-[#DCE7F0] flex flex-wrap justify-between items-center gap-3 text-xs">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#52677B] block">
                  Reference ID: <strong className="font-mono text-[#EE4D2D]">{searchedOrder.id}</strong>
                </span>
                <span className="text-xs text-[#10263D]">
                  Recipient: <strong>{searchedOrder.customer?.name}</strong> ({searchedOrder.customer?.phone})
                </span>
                {isAuthorized && searchedOrder.customer?.address && (
                  <p className="text-[11px] text-[#52677B] mt-0.5">
                    Delivery Address: {searchedOrder.customer.address}, {searchedOrder.customer.division}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isAuthorized && (
                  <button
                    type="button"
                    onClick={() => openPrintWindow(searchedOrder, 'invoice')}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#DCE7F0] hover:bg-slate-50 text-[#EE4D2D] font-bold text-xs shadow-2xs transition-colors"
                    title="Print or download official invoice receipt"
                  >
                    <Printer size={13} />
                    <span>Print Invoice</span>
                  </button>
                )}
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EE4D2D] text-white capitalize shadow-xs">
                  Status: {searchedOrder.status}
                </span>
              </div>
            </div>

            {/* Visual 5-Step Timeline */}
            <div className="py-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#10263D] mb-4">
                Delivery Progress
              </h3>
              <div className="grid grid-cols-5 gap-1 relative text-center">
                {steps.map((step, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={step.label} className="flex flex-col items-center">
                      <div 
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-all ${
                          isDone 
                            ? 'bg-[#EE4D2D] text-white shadow-xs' 
                            : 'bg-slate-100 text-slate-400 border border-[#DCE7F0]'
                        } ${isCurrent ? 'ring-4 ring-orange-100' : ''}`}
                      >
                        {isDone ? <CheckCircle2 size={16} /> : idx + 1}
                      </div>
                      <span className={`text-[10px] sm:text-xs font-bold leading-tight ${isDone ? 'text-[#10263D]' : 'text-slate-400'}`}>
                        {step.label}
                      </span>
                      <span className="text-[9px] text-[#8FA6BE] hidden sm:block mt-0.5">
                        {step.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ordered Items List */}
            <div className="p-4 rounded-2xl border border-[#DCE7F0] bg-white text-xs space-y-2">
              <span className="font-bold text-[#10263D] block">Ordered Items:</span>
              <ul className="divide-y divide-slate-100">
                {searchedOrder.items?.map((item, idx) => (
                  <li key={idx} className="py-2 flex justify-between">
                    <span>{item.title} ({item.variant}) × {item.quantity}</span>
                    {item.price && (
                      <span className="font-semibold text-[#10263D]">
                        {currencySymbol}{(item.price * item.quantity).toLocaleString()}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              {searchedOrder.total && (
                <div className="pt-2 border-t border-[#DCE7F0] flex justify-between font-bold text-[#10263D]">
                  <span>Total Amount:</span>
                  <span className="text-[#EE4D2D]">{currencySymbol}{searchedOrder.total?.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
