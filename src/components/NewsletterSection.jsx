import React, { useState } from 'react';
import { Mail, Check, Sparkles, Send } from 'lucide-react';

export default function NewsletterSection({
  lang = 'en'
}) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 2000);
  };

  return (
    <section className="w-full my-6 sm:my-8 p-6 sm:p-8 bg-[#EBF5FF] border border-[#DCE8F3] text-[#10263D] rounded-2xl shadow-sm relative overflow-hidden">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-5xl mx-auto">
        <div className="max-w-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFFFFF] text-[#1684E8] border border-blue-200 text-[10px] font-mono font-bold mb-2">
            <Sparkles size={11} />
            <span>{lang === 'bn' ? 'টেলিম্যাট্রি আপডেট' : 'TELEMETRY DISPATCH'}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-mono text-[#10263D] tracking-tight leading-tight">
            {lang === 'bn' ? 'টেক নেস্ট নিউজলেটারে যুক্ত হোন' : 'Stay Ahead With Tech Nest Upgrades'}
          </h3>
          <p className="text-xs text-[#526981] mt-1 leading-relaxed font-mono">
            {lang === 'bn'
              ? 'নতুন প্রোডাক্ট লঞ্চ, ফ্ল্যাশ সেল ও ডিসকাউন্ট ভাউচারের আপডেট পান সবার আগে।'
              : 'Direct firmware updates, drop alerts on GaN chargers, ANC earbuds, and flash sales.'}
          </p>
        </div>

        <div className="w-full md:w-auto">
          {subscribed ? (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-mono font-semibold">
              <Check size={16} />
              <span>{lang === 'bn' ? 'ধন্যবাদ! আপনি সফলভাবে যুক্ত হয়েছেন।' : 'Telemetry subscription confirmed.'}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md">
              <div className="relative flex-1">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#526981]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={lang === 'bn' ? 'আপনার ইমেইল লিখুন...' : 'engineer@domain.com'}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#DCE8F3] text-[#10263D] placeholder-[#526981]/60 font-mono text-xs outline-none focus:border-[#1684E8] focus:shadow-[0_0_12px_rgba(22,132,232,0.2)] transition-all"
                />
              </div>
              <button
                type="submit"
                className="btn-soft-blue px-5 py-2.5 rounded-xl text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm active:scale-98"
              >
                <span>{lang === 'bn' ? 'যুক্ত হোন' : 'SUBSCRIBE'}</span>
                <Send size={12} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
