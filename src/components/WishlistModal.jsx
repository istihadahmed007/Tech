import React, { useEffect, useRef } from 'react';
import { X, Heart, Plus, Trash2 } from 'lucide-react';

export default function WishlistModal({ 
  isOpen, 
  onClose, 
  wishlistProducts, 
  onRemoveFromWishlist, 
  onAddToCart, 
  onSelectProduct,
  currencySymbol = "৳",
  t 
}) {
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
      aria-labelledby="wishlist-modal-title"
    >
      <div 
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-[#FFFFFF] border border-[#DCE7F0] shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 60px -15px rgba(16, 38, 61, 0.20)'
        }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#DCE7F0] mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center">
              <Heart size={18} fill="currentColor" />
            </div>
            <div>
              <h2 id="wishlist-modal-title" className="text-xl font-bold text-[#10263D]">
                Saved Favorites ({wishlistProducts.length})
              </h2>
              <p className="text-xs text-[#52677B]">
                Your personal curated shortlist
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-[#52677B] hover:text-[#10263D] focus-visible:ring-2 focus-visible:ring-[#145CFF]"
            aria-label="Close wishlist dialog"
          >
            <X size={20} />
          </button>
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="py-3.5 flex items-center justify-between gap-3">
                <div 
                  className={`flex items-center gap-3 ${onSelectProduct ? 'cursor-pointer group' : ''}`}
                  onClick={() => onSelectProduct && onSelectProduct(product)}
                >
                  <div className="w-14 h-14 rounded-xl bg-[#EAF4FC] p-2 shrink-0 border border-[#DCE7F0] flex items-center justify-center group-hover:border-[#145CFF] transition-colors">
                    <img src={product.image} alt={product.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-[#10263D] group-hover:text-[#145CFF] transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                    <span className="font-bold text-xs text-[#145CFF] block mt-0.5">
                      {currencySymbol}{product.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onAddToCart(product);
                      onRemoveFromWishlist(product.id);
                    }}
                    className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-[#145CFF] hover:bg-[#0D4BD9] text-white text-xs font-semibold flex items-center gap-1 shadow-xs focus-visible:ring-2 focus-visible:ring-[#145CFF]"
                    title="Move to bag"
                    aria-label={`Move ${product.title} to bag`}
                  >
                    <Plus size={14} />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                  <button
                    onClick={() => onRemoveFromWishlist(product.id)}
                    className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500"
                    title="Remove from wishlist"
                    aria-label={`Remove ${product.title} from wishlist`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-full bg-pink-50 text-pink-400 mx-auto flex items-center justify-center mb-3">
              <Heart size={26} />
            </div>
            <h3 className="font-bold text-sm text-[#10263D] mb-1">
              Your wishlist is empty
            </h3>
            <p className="text-xs text-[#8FA6BE] max-w-xs mx-auto mb-5">
              Click the heart icon on any accessory to save it here for later.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#145CFF] hover:bg-[#0D4BD9] text-white font-semibold text-xs shadow-xs"
            >
              Discover Accessories
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
