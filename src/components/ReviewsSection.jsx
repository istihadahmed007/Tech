import React from 'react';
import { Truck, Award, ShieldCheck, RotateCcw, Headphones, Star } from 'lucide-react';

export default function ReviewsSection({
  onOpenSupport,
  lang = 'en',
  t = {}
}) {
  const benefits = [
    {
      icon: Truck,
      title: lang === 'bn' ? 'সারা দেশে দ্রুত ডেলিভারি' : 'Nationwide Fast Delivery',
      desc: lang === 'bn' ? 'ঢাকায় ২৪-৪৮ ঘণ্টা, ঢাকার বাইরে ২-৪ কর্মদিবসে ডেলিভারি।' : 'Within 24-48 hours in Dhaka, and 2-4 days across Bangladesh.'
    },
    {
      icon: RotateCcw,
      title: lang === 'bn' ? '৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি' : '7-Day Replacement Guarantee',
      desc: lang === 'bn' ? 'কোনো যান্ত্রিক ত্রুটি থাকলে সহজ রিপ্লেসমেন্ট সুবিধা।' : 'Hassle-free replacement for any genuine technical defect.'
    },
    {
      icon: ShieldCheck,
      title: lang === 'bn' ? '১০০% পরীক্ষিত গুণমান' : '100% Quality Inspected',
      desc: lang === 'bn' ? 'ডেলিভারির পূর্বে প্রতিটি পণ্যের পাওয়ার ও অডিও আউটপুট ভেরিফাইড।' : 'Verified output, charging speed, and audio drivers before dispatch.'
    },
    {
      icon: Headphones,
      title: lang === 'bn' ? 'ডেডিকেটেড কাস্টমার সাপোর্ট' : 'Dedicated Customer Support',
      desc: lang === 'bn' ? 'অর্ডার, ডেলিভারি বা পণ্যের তথ্যের জন্য আমাদের টিম সার্বক্ষণিক প্রস্তুত।' : 'Assistance with device compatibility, tracking, and warranty inquiries.'
    }
  ];

  return (
    <section id="benefits-section" className="w-full my-6 sm:my-8">
      {/* 4 Shopping Benefits Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-6">
        {benefits.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-xl bg-white border border-[#ECECEC] shadow-xs flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-lg bg-[#FFF5F1] text-[#EE4D2D] flex items-center justify-center shrink-0">
                <Icon size={20} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#10263D] leading-tight">
                  {b.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
