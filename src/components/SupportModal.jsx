import React, { useEffect, useRef } from 'react';
import { X, ShieldCheck, Truck, RotateCcw, HelpCircle } from 'lucide-react';

export default function SupportModal({ isOpen, onClose, t = {}, lang = 'en' }) {
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

  const isBn = lang === 'bn';

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
                {isBn ? 'কাস্টমার সাপোর্ট ও পলিসি' : 'Customer Support & Policies'}
              </h2>
              <p className="text-xs text-[#52677B]">
                {isBn 
                  ? 'ওয়ারেন্টি, ডেলিভারি চার্জ এবং রিটার্ন পলিসি সংক্রান্ত বিস্তারিত তথ্য' 
                  : 'Warranties, delivery tiers, and return inquiries in Bangladesh'}
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-[#52677B] hover:text-[#10263D] focus-visible:ring-2 focus-visible:ring-[#145CFF]"
            aria-label={isBn ? 'সাপোর্ট ডায়লগ বন্ধ করুন' : 'Close support dialog'}
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 text-xs text-[#52677B]">
          {/* Warranty Policy */}
          <div className="p-4 rounded-2xl bg-[#EAF4FC] border border-[#DCE7F0]">
            <h3 className="text-sm font-bold text-[#10263D] flex items-center gap-2 mb-2">
              <ShieldCheck size={18} className="text-[#145CFF]" />
              <span>{isBn ? 'ম্যানুফ্যাকচারার ওয়ারেন্টি পলিসি' : 'Manufacturer Warranty Coverage'}</span>
            </h3>
            <p className="leading-relaxed">
              {isBn 
                ? 'নির্দিষ্ট পণ্যের প্যাকেজে ঘোষিত ওয়ারেন্টির শর্তাবলী প্রযোজ্য (প্রতিটি পণ্যের স্পেসিফিকেশন শিটে বিস্তারিত দেওয়া আছে)। নির্ধারিত সময়ের মধ্যে যেকোনো ম্যানুফ্যাকচারিং ত্রুটির ক্ষেত্রে ডিলার রিপ্লেসমেন্ট সহায়তা প্রদান করা হয়।' 
                : 'Accessories with declared manufacturer warranties carry product-specific coverage terms (detailed on each product specification sheet). Eligible manufacturing defects within the stated period are supported via verified dealer replacement.'}
            </p>
          </div>

          {/* Delivery & Logistics */}
          <div className="p-4 rounded-2xl bg-[#EAF4FC] border border-[#DCE7F0]">
            <h3 className="text-sm font-bold text-[#10263D] flex items-center gap-2 mb-2">
              <Truck size={18} className="text-[#145CFF]" />
              <span>{isBn ? 'ডেলিভারি চার্জ ও সময়সীমা' : 'Delivery Charges & Standards'}</span>
            </h3>
            <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
              {isBn ? (
                <>
                  <li><strong>ঢাকা মেট্রো এরিয়া:</strong> স্ট্যান্ডার্ড কুরিয়ার ডেলিভারি (৬০৳ ডেলিভারি চার্জ)।</li>
                  <li><strong>ঢাকার বাইরে সারা দেশ:</strong> দেশব্যাপী নির্ভরযোগ্য কুরিয়ার নেটওয়ার্ক (১২০৳ ডেলিভারি চার্জ)।</li>
                  <li><strong>ফ্রি শিপিং:</strong> ২,০০০৳ বা তার বেশি অর্ডারে সারা দেশে ডেলিভারি সম্পূর্ণ ফ্রি!</li>
                </>
              ) : (
                <>
                  <li><strong>Inside Dhaka Metro:</strong> Standard courier delivery (৳60 delivery charge).</li>
                  <li><strong>Outside Dhaka:</strong> Nationwide courier network (৳120 delivery charge).</li>
                  <li><strong>Free Shipping:</strong> Automatically activated on any order equal to or exceeding ৳2,000.</li>
                </>
              )}
            </ul>
          </div>

          {/* Return Guidelines */}
          <div className="p-4 rounded-2xl bg-[#EAF4FC] border border-[#DCE7F0]">
            <h3 className="text-sm font-bold text-[#10263D] flex items-center gap-2 mb-2">
              <RotateCcw size={18} className="text-[#145CFF]" />
              <span>{isBn ? 'রিটার্ন ও এক্সচেঞ্জ নির্দেশিকা' : 'Return Guidelines'}</span>
            </h3>
            <p className="leading-relaxed">
              {isBn
                ? 'অব্যবহৃত এবং অক্ষত প্যাকেজিংযুক্ত পণ্য গ্রহণের ৭ দিনের মধ্যে রিটার্ন বা পরিবর্তনের জন্য আবেদন করা যাবে। এক্সচেঞ্জ বা রিফান্ড ভেরিফিকেশনের জন্য আপনার অর্ডার রেফারেন্স আইডি সহ যোগাযোগ করুন।'
                : 'Unused items in original packaging with intact seals may be returned within 7 calendar days of receipt. Please contact store management with your order reference ID for exchange or return verification.'}
            </p>
          </div>

          {/* Direct Contact Support */}
          <div className="pt-2 border-t border-[#DCE7F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-[#10263D] block">
                {isBn ? 'সরাসরি কাস্টমার সহায়তা:' : 'Customer Service Inquiries:'}
              </span>
              <span className="text-[#145CFF] font-medium">support@store.local • Dhaka, Bangladesh</span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#145CFF] hover:bg-[#0D4BD9] text-white font-semibold text-xs shadow-xs"
            >
              {isBn ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
