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
    <section className="w-full my-6 sm:my-8 p-6 sm:p-8 bg-[#0F172A] text-white rounded-xl sm:rounded-2xl shadow-sm relative overflow-hidden">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-5xl mx-auto">
        <div className="max-w-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[#60A5FA] text-[11px] font-bold mb-2">
            <Sparkles size={12} />
            <span>{lang === 'bn' ? 'এক্সক্লুসিভ অফার' : 'Exclusive Deals & Updates'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            {lang === 'bn' ? 'টেক নেস্ট নিউজলেটারে যুক্ত হোন' : 'Stay Ahead With Tech Nest Upgrades'}
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {lang === 'bn'
              ? 'নতুন প্রোডাক্ট লঞ্চ, ফ্ল্যাশ সেল ও ডিসকাউন্ট ভাউচারের আপডেট পান সবার আগে।'
              : 'Be the first to hear about new GaN chargers, ANC earbuds drops, and weekend flash sales.'}
          </p>
        </div>

        <div className="w-full md:w-auto">
          {subscribed ? (
            <div className="flex items-center gap-2 p-3 bg-emerald-900/60 border border-emerald-500/50 rounded-lg text-emerald-300 text-xs font-semibold">
              <Check size={16} />
              <span>{lang === 'bn' ? 'ধন্যবাদ! আপনি সফলভাবে যুক্ত হয়েছেন।' : 'Thank you for subscribing to Tech Nest!'}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md">
              <div className="relative flex-1">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={lang === 'bn' ? 'আপনার ইমেইল অ্যাড্রেস লিখুন...' : 'Enter your email address...'}
                  className="w-full pl-9 pr-4 py-2.5 rounded-md bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs outline-none focus:border-[#145CFF] focus:bg-white/15 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-md bg-[#145CFF] hover:bg-[#0D4BD9] active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm"
              >
                <span>{lang === 'bn' ? 'যুক্ত হোন' : 'Subscribe'}</span>
                <Send size={13} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
