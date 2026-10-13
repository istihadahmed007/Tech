import React from 'react';
import { X, Heart, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function WishlistModal({ 
  isOpen, 
  onClose, 
  wishlistProducts, 
  onRemoveFromWishlist, 
  onAddToCart, 
  currencySymbol = "৳",
  t 
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-white/95 backdrop-blur-2xl border border-blue-200/80 shadow-2xl animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-blue-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center">
              <Heart size={18} fill="currentColor" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#112A43]">
                Saved Favorites ({wishlistProducts.length})
              </h2>
              <p className="text-xs text-[#4B637B]">
                Your personal curated shortlist
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
            aria-label="Close wishlist"
          >
            <X size={20} />
          </button>
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-blue-50 p-2 shrink-0 border border-blue-100 flex items-center justify-center">
                    <img src={product.image} alt={product.title} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#112A43] line-clamp-1">
                      {product.title}
                    </h4>
                    <span className="font-bold text-xs text-blue-600 block mt-0.5">
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
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
                    title="Move to bag"
                  >
                    <Plus size={14} />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                  <button
                    onClick={() => onRemoveFromWishlist(product.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50"
                    title="Remove from wishlist"
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
            <h4 className="font-bold text-sm text-[#112A43] mb-1">
              Your wishlist is empty
            </h4>
            <p className="text-xs text-[#8FA6BE] max-w-xs mx-auto mb-5">
              Click the heart icon on any accessory to save it here for later.
            </p>
            <button
              onClick={onClose}
              className="btn-primary text-xs py-2 px-4"
            >
              Discover Accessories
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
