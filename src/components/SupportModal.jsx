import React from 'react';
import { X, ShieldCheck, Truck, RotateCcw, PhoneCall, HelpCircle, FileText } from 'lucide-react';

export default function SupportModal({ isOpen, onClose, t }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-white/95 backdrop-blur-2xl border border-blue-200/80 shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-blue-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <HelpCircle size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#112A43]">
                Customer Support & Policies
              </h2>
              <p className="text-xs text-[#4B637B]">
                Official warranties, returns, and delivery standards in Bangladesh
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

        <div className="space-y-6 text-xs text-[#4B637B]">
          {/* Warranty Policy */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
            <h3 className="text-sm font-bold text-[#112A43] flex items-center gap-2 mb-2">
              <ShieldCheck size={18} className="text-blue-600" />
              <span>Official Warranty Guarantee</span>
            </h3>
            <p className="leading-relaxed">
              All accessories sold through our store carry genuine serial barcodes with direct manufacturer warranty (6 to 24 months depending on model). Any manufacturing defect within the warranty period is eligible for immediate unit replacement at our Gulshan Dhaka service center.
            </p>
          </div>

          {/* Delivery & Logistics */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="text-sm font-bold text-[#112A43] flex items-center gap-2 mb-2">
              <Truck size={18} className="text-blue-600" />
              <span>Fulfillment & Dispatch</span>
            </h3>
            <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
              <li><strong>Inside Dhaka Metro:</strong> Guaranteed 24 to 48 hours delivery (৳60 delivery charge).</li>
              <li><strong>Outside Dhaka:</strong> 2 to 4 working days via Steadfast / Pathao courier network (৳120 delivery charge).</li>
              <li><strong>Free Shipping:</strong> Automatically activated on any order equal to or exceeding ৳2,000.</li>
            </ul>
          </div>

          {/* 7-Day Returns */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="text-sm font-bold text-[#112A43] flex items-center gap-2 mb-2">
              <RotateCcw size={18} className="text-blue-600" />
              <span>7-Day Hassle-Free Returns</span>
            </h3>
            <p className="leading-relaxed">
              If an accessory does not fit your device or you change your mind, return the unopened box in original condition within 7 calendar days of receipt for an instant store credit or full bank refund.
            </p>
          </div>

          {/* Direct Contact Support */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-[#112A43] block">Dedicated Helpline:</span>
              <span className="text-blue-600 font-mono font-bold">+880 1700-000000 (10:00 AM – 10:00 PM)</span>
            </div>
            <button
              onClick={onClose}
              className="btn-primary text-xs py-2 px-5 self-end sm:self-auto"
            >
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
