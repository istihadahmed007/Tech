import React, { useState, useEffect } from 'react';
import { X, Search, Package, CheckCircle2, Clock, Truck, ShieldAlert } from 'lucide-react';

export default function OrderTrackingModal({ 
  isOpen, 
  onClose, 
  initialOrderId = '', 
  currencySymbol = "৳" 
}) {
  const [orderIdInput, setOrderIdInput] = useState(initialOrderId);
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialOrderId) {
      setOrderIdInput(initialOrderId);
      fetchOrder(initialOrderId);
    }
  }, [initialOrderId]);

  const fetchOrder = async (id) => {
    if (!id.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(id.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No matching order found');
      }
      setSearchedOrder(data.order);
    } catch (err) {
      setError(err.message || 'Order lookup failed.');
      setSearchedOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrder(orderIdInput);
  };

  if (!isOpen) return null;

  const steps = [
    { label: 'Order Placed', desc: 'Received in system' },
    { label: 'Confirmed', desc: 'Inventory verified' },
    { label: 'Packaging', desc: 'Quality checked' },
    { label: 'In Transit', desc: 'Handed to courier' },
    { label: 'Delivered', desc: 'Received by customer' }
  ];

  // Determine current active step
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
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-white/95 backdrop-blur-2xl border border-blue-200/80 shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-blue-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              <Package size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#112A43]">
                Order Tracking & Fulfillment
              </h2>
              <p className="text-xs text-[#4B637B]">
                Real-time updates directly from our Dhaka warehouse
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter Order Reference ID (e.g. AGY-849201)"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              className="input-field text-sm font-mono pl-4 pr-10"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search size={15} />
            )}
            <span>Track</span>
          </button>
        </form>

        {error && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 mb-6">
            <ShieldAlert size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {searchedOrder ? (
          <div className="space-y-6">
            {/* Order Card Overview */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/60 flex flex-wrap justify-between items-center gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#4B637B] block">
                  Reference ID: <strong className="font-mono text-blue-700">{searchedOrder.id}</strong>
                </span>
                <span className="text-xs text-[#112A43]">
                  Recipient: <strong>{searchedOrder.customer?.name}</strong> ({searchedOrder.customer?.phone})
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white capitalize shadow-sm">
                Status: {searchedOrder.status}
              </span>
            </div>

            {/* Visual 5-Step Timeline */}
            <div className="py-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#112A43] mb-4">
                Delivery Progress
              </h4>
              <div className="grid grid-cols-5 gap-1 relative text-center">
                {steps.map((step, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={step.label} className="flex flex-col items-center">
                      <div 
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-all ${
                          isDone 
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}
                      >
                        {isDone ? <CheckCircle2 size={16} /> : idx + 1}
                      </div>
                      <span className={`text-[10px] sm:text-xs font-bold leading-tight ${isDone ? 'text-[#112A43]' : 'text-slate-400'}`}>
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

            {/* Items in this Order */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white text-xs space-y-2">
              <span className="font-bold text-[#112A43] block">Allocated Products:</span>
              <ul className="divide-y divide-slate-100">
                {searchedOrder.items?.map((item, idx) => (
                  <li key={idx} className="py-2 flex justify-between">
                    <span>{item.title} (x{item.quantity})</span>
                    <span className="font-semibold text-[#112A43]">
                      {currencySymbol}{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-[#112A43]">
                <span>Total Amount:</span>
                <span className="text-blue-600">{currencySymbol}{searchedOrder.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ) : !error && (
          <div className="text-center py-8 text-xs text-[#8FA6BE]">
            Enter your order reference above (e.g. from your order confirmation) to track live delivery status.
          </div>
        )}
      </div>
    </div>
  );
}
