import React, { useEffect, useRef } from 'react';
import { X, ShieldCheck, Truck, RotateCcw, HelpCircle } from 'lucide-react';

export default function SupportModal({ isOpen, onClose, t }) {
  const closeButtonRef = useRef(null);

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

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-dialog-title"
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
            <div className="w-9 h-9 rounded-xl bg-[#EAF4FC] text-[#145CFF] flex items-center justify-center font-bold">
              <HelpCircle size={18} />
            </div>
            <div>
              <h2 id="support-dialog-title" className="text-xl font-bold text-[#10263D]">
                Customer Support & Policies
              </h2>
              <p className="text-xs text-[#52677B]">
                Warranties, delivery tiers, and return inquiries in Bangladesh
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-[#52677B] hover:text-[#10263D] focus-visible:ring-2 focus-visible:ring-[#145CFF]"
            aria-label="Close support dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 text-xs text-[#52677B]">
          {/* Warranty Policy */}
          <div className="p-4 rounded-2xl bg-[#EAF4FC] border border-[#DCE7F0]">
            <h3 className="text-sm font-bold text-[#10263D] flex items-center gap-2 mb-2">
              <ShieldCheck size={18} className="text-[#145CFF]" />
              <span>Manufacturer Warranty Coverage</span>
            </h3>
            <p className="leading-relaxed">
              Accessories with declared manufacturer warranties carry product-specific coverage terms (detailed on each product specification sheet). Eligible manufacturing defects within the stated period are supported via verified dealer replacement.
            </p>
          </div>

          {/* Delivery & Logistics */}
          <div className="p-4 rounded-2xl bg-[#EAF4FC] border border-[#DCE7F0]">
            <h3 className="text-sm font-bold text-[#10263D] flex items-center gap-2 mb-2">
              <Truck size={18} className="text-[#145CFF]" />
              <span>Delivery Charges & Standards</span>
            </h3>
            <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
              <li><strong>Inside Dhaka Metro:</strong> Standard courier delivery (৳60 delivery charge).</li>
              <li><strong>Outside Dhaka:</strong> Nationwide courier network (৳120 delivery charge).</li>
              <li><strong>Free Shipping:</strong> Automatically activated on any order equal to or exceeding ৳2,000.</li>
            </ul>
          </div>

          {/* Return Guidelines */}
          <div className="p-4 rounded-2xl bg-[#EAF4FC] border border-[#DCE7F0]">
            <h3 className="text-sm font-bold text-[#10263D] flex items-center gap-2 mb-2">
              <RotateCcw size={18} className="text-[#145CFF]" />
              <span>Return Guidelines</span>
            </h3>
            <p className="leading-relaxed">
              Unused items in original packaging with intact seals may be returned within 7 calendar days of receipt. Please contact store management with your order reference ID for exchange or return verification.
            </p>
          </div>

          {/* Direct Contact Support */}
          <div className="pt-2 border-t border-[#DCE7F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-[#10263D] block">Customer Service Inquiries:</span>
              <span className="text-[#145CFF] font-medium">support@store.local • Dhaka, Bangladesh</span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#145CFF] hover:bg-[#0D4BD9] text-white font-semibold text-xs shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
