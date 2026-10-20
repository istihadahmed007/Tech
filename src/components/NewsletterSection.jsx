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
    <section className="w-full my-6 sm:my-8 p-6 sm:p-8 bg-[#12141C] border border-[#1E2230] text-white rounded-2xl shadow-2xl relative overflow-hidden">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-5xl mx-auto">
        <div className="max-w-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold mb-2">
            <Sparkles size={11} />
            <span>{lang === 'bn' ? 'টেলিম্যাট্রি আপডেট' : 'TELEMETRY DISPATCH'}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-mono tracking-tight leading-tight">
            {lang === 'bn' ? 'টেক নেস্ট নিউজলেটারে যুক্ত হোন' : 'Stay Ahead With Tech Nest Upgrades'}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-mono">
            {lang === 'bn'
              ? 'নতুন প্রোডাক্ট লঞ্চ, ফ্ল্যাশ সেল ও ডিসকাউন্ট ভাউচারের আপডেট পান সবার আগে।'
              : 'Direct firmware updates, drop alerts on GaN chargers, ANC earbuds, and flash sales.'}
          </p>
        </div>

        <div className="w-full md:w-auto">
          {subscribed ? (
            <div className="flex items-center gap-2 p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-mono font-semibold">
              <Check size={16} />
              <span>{lang === 'bn' ? 'ধন্যবাদ! আপনি সফলভাবে যুক্ত হয়েছেন।' : 'Telemetry subscription confirmed.'}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md">
              <div className="relative flex-1">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={lang === 'bn' ? 'আপনার ইমেইল লিখুন...' : 'engineer@domain.com'}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0B0D14] border border-[#1E2230] text-white placeholder-zinc-500 font-mono text-xs outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(6,182,212,0.25)] transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-98 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-md"
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
