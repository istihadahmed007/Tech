import React, { useState } from 'react';
import { HelpCircle, ChevronDown, PhoneCall, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export default function FaqSection({ onOpenSupport, lang = 'en' }) {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      icon: Truck,
      q: lang === 'bn' ? 'ডেলিভারি সময় এবং চার্জ কত?' : 'What are the delivery times and charges across Bangladesh?',
      a: lang === 'bn' 
        ? 'ঢাকা সিটির ভেতরে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি সম্পন্ন হয় (চার্জ ৬০ টাকা)। ঢাকার বাইরে জেলা সদরে ২ থেকে ৪ কার্যদিবসের মধ্যে ডেলিভারি সম্পন্ন হয় (চার্জ ১২০ টাকা)। যেকোনো ২,০০০ টাকার বেশি অর্ডারে সারা দেশে ডেলিভারি সম্পূর্ণ ফ্রি!'
        : 'Deliveries inside Dhaka city take 24–48 hours (delivery fee ৳60). Across all other districts in Bangladesh, orders arrive within 2–4 business days (delivery fee ৳120). All orders over ৳2,000 automatically qualify for 100% Free Nationwide Delivery.'
    },
    {
      icon: RotateCcw,
      q: lang === 'bn' ? 'পণ্যে কোনো সমস্যা হলে রিটার্ন বা রিপ্লেসমেন্ট পলিসি কী?' : 'What is your return and replacement policy?',
      a: lang === 'bn'
        ? 'আমরা প্রতিটি পণ্যে ৭ দিনের সহজ রিপ্লেসমেন্ট গ্যারান্টি প্রদান করি। ডেলিভারি পাওয়ার পর কোনো যান্ত্রিক বা প্রস্তুতকারক ত্রুটি পাওয়া গেলে আমাদের সাথে যোগাযোগ করলেই আমরা দ্রুত রিপ্লেসমেন্ট প্রক্রিয়া শুরু করব।'
        : 'We provide a hassle-free 7-day replacement guarantee on all eligible products. If your gadget has any manufacturer defect or hardware malfunction upon delivery, reach out to our support team for an expedited replacement.'
    },
    {
      icon: ShieldCheck,
      q: lang === 'bn' ? 'পণ্যগুলো কি ১০০% আসল এবং ব্র্যান্ড ওয়ারেন্টিযুক্ত?' : 'Are all products authentic and covered by warranty?',
      a: lang === 'bn'
        ? 'হ্যাঁ, টেক নেস্ট-এর প্রতিটি গ্যাজেট ১০০% অরিজিনাল। ডেলিভারির পূর্বে প্রতিটি পণ্যের পাওয়ার আউটপুট, ড্রাইভ স্পেসিফিকেশন ও অডিও ড্রাইভার কোয়ালিটি যাচাই করা হয়।'
        : 'Yes, every product in our catalog is 100% authentic and verified. Each item undergoes strict pre-dispatch quality checks to verify charging output, battery health, and acoustic performance.'
    },
    {
      icon: PhoneCall,
      q: lang === 'bn' ? 'পেমেন্ট কীভাবে করতে পারি? ক্যাশ অন ডেলিভারি কি আছে?' : 'What payment methods do you accept? Is Cash on Delivery available?',
      a: lang === 'bn'
        ? 'হ্যাঁ, সারা বাংলাদেশে ক্যাশ অন ডেলিভারি (COD) সুবিধা রয়েছে। এছাড়া বিকাশ (bKash), নগদ (Nagad) এবং ভিসা/মাস্টারকার্ড ডেবিট/ক্রেডিট কার্ডের মাধ্যমে নিরাপদ অনলাইন পেমেন্ট করতে পারবেন।'
        : 'Yes, Cash on Delivery (COD) is available nationwide. We also accept instant digital payments via bKash, Nagad, and all major Visa/Mastercard debit and credit cards through an encrypted 256-bit secure gateway.'
    }
  ];

  return (
    <section className="w-full my-8 sm:my-12 p-5 sm:p-8 bg-white rounded-2xl border border-blue-100 shadow-sm text-[#10263D]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-blue-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0084FF] text-xs font-mono font-bold mb-2 border border-blue-200">
            <HelpCircle size={14} />
            <span>{lang === 'bn' ? 'সাধারণ জিজ্ঞাসা' : 'FREQUENTLY ASKED QUESTIONS'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-[#10263D] tracking-tight">
            {lang === 'bn' ? 'প্রয়োজনীয় তথ্যাবলী ও পলিসি' : 'Helpful Shopping & Policy FAQs'}
          </h2>
          <p className="text-xs sm:text-sm text-[#47617D] font-mono mt-1">
            {lang === 'bn' 
              ? 'ডেলিভারি, রিপ্লেসমেন্ট এবং পেমেন্ট সংক্রান্ত আসল তথ্যাবলী।'
              : 'Clear, verified answers regarding shipping timelines, returns, and payment options.'}
          </p>
        </div>

        {onOpenSupport && (
          <button
            type="button"
            onClick={onOpenSupport}
            className="text-xs sm:text-sm font-mono font-semibold text-[#0084FF] hover:text-[#005BB3] hover:underline flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <span>{lang === 'bn' ? 'সাপোর্টে যোগাযোগ করুন' : 'Have more questions? Contact Support'}</span>
          </button>
        )}
      </div>

      <div className="space-y-3 max-w-4xl mx-auto">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const Icon = faq.icon;

          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen 
                  ? 'border-blue-300 bg-blue-50/50 shadow-xs' 
                  : 'border-slate-200 bg-[#F8FBFE] hover:border-blue-200'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isOpen ? 'bg-[#0084FF] text-white shadow-xs' : 'bg-white text-[#0084FF] border border-blue-100 shadow-2xs'
                  }`}>
                    <Icon size={16} />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#10263D]">
                    {faq.q}
                  </h3>
                </div>

                <div className={`p-1 rounded-full text-slate-400 transition-transform duration-200 shrink-0 ${
                  isOpen ? 'rotate-180 text-[#0084FF]' : ''
                }`}>
                  <ChevronDown size={18} />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 pl-14 sm:pl-16">
                  <p className="text-xs sm:text-sm text-[#47617D] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
