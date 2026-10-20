import React from 'react';
import { MapPin, Phone, HelpCircle, Package, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ 
  storeName = "Tech Nest", 
  onOpenSupport, 
  onOpenTracking, 
  onSelectCategory, 
  t = {}, 
  lang = 'en' 
}) {
  return (
    <footer className="footer-gradient mt-16 sm:mt-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10">
          
          {/* Column 1: Categories */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-white/85">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory && onSelectCategory('audio')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  Earbuds &amp; TWS
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory && onSelectCategory('charging')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  Fast Chargers &amp; Cables
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory && onSelectCategory('wearables')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  Ultra Smartwatches
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory && onSelectCategory('cases')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  Phone Cases &amp; Covers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory && onSelectCategory(null)}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  All Verified Gear
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Assistance */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white mb-4">
              Assistance
            </h4>
            <ul className="space-y-2 text-xs text-white/85">
              <li>
                <button
                  type="button"
                  onClick={onOpenTracking}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenSupport}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  7–30 Day Warranty
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenSupport}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  Free Shipping Tier (৳2,000+)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenSupport}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  Return &amp; Exchange Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Tech Nest Brand Info */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white mb-4">
              Tech Nest BD
            </h4>
            <p className="text-xs text-white/85 leading-relaxed">
              Optic-grade phone protection, GaN fast power adapters, acoustic clarity earbuds, and ultra smartwatches. Next-day courier dispatch in Dhaka &amp; 2–4 days nationwide.
            </p>
            <p className="text-[11px] text-white/75 mt-3">
              Dhaka, Bangladesh • Official Warranty
            </p>
          </div>

          {/* Column 4: Connect & Social Icons (Matches Reference Screenshot) */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white mb-4">
              Connect &amp; Pay
            </h4>
            <div className="flex items-center gap-2.5 mb-4">
              {/* Instagram */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white transition-all hover:scale-110 shadow-xs"
                title="Instagram"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm5.25-.75a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z"/></svg>
              </a>

              {/* Facebook */}
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white transition-all hover:scale-110 shadow-xs"
                title="Facebook"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24"><path d="M13 3h4v4h-4v3h4v4h-4v7H9v-7H6v-4h3V7a4 4 0 014-4z"/></svg>
              </a>

              {/* Twitter / X */}
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white transition-all hover:scale-110 shadow-xs"
                title="Twitter"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>

              {/* YouTube */}
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white transition-all hover:scale-110 shadow-xs"
                title="YouTube"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24"><path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.2 5 12 5 12 5s-4.2 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.2.9 1.6.1 6.8.2 6.8.2s4.2 0 7-.1c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM10 15V9l5.2 3-5.2 3z"/></svg>
              </a>
            </div>

            <p className="text-[11px] font-mono text-white/90">
              COD • bKash • Nagad Accepted
            </p>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="mt-12 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between text-xs text-white/75 gap-3">
          <p>© {new Date().getFullYear()} Tech Nest BD. All rights reserved.</p>
          <p className="font-mono text-[11px]">Bangladeshi Owned &amp; Operated</p>
        </div>
      </div>
    </footer>
  );
}
