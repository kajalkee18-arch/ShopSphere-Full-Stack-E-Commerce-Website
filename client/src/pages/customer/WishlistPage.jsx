import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../components/common/Toast';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/common/Button';

const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const handleMoveToCart = async (product) => {
    const res = await addToCart(product, 1);
    if (res.success) {
      await toggleWishlist(product);
      addToast(`Moved "${product.title}" to cart!`);
    } else {
      addToast(res.message || 'Failed to add item', 'error');
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-sm">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Your Wishlist is Empty</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
          Keep track of items you love by tapping the heart icon on any product card.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 mt-6 px-7 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl text-sm shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition-all hover:scale-105"
        >
          Discover Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          My Saved Wishlist ({wishlist.length})
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Products you have bookmarked for future purchases
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => {
          const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;

          return (
            <div
              key={product._id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col"
            >
              <div className="relative aspect-square bg-slate-100">
                <img
                  src={
                    product.images && product.images.length > 0
                      ? product.images[0].url
                      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400'
                  }
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-3 right-3 p-2 bg-white/90 text-rose-500 rounded-full shadow-md hover:bg-rose-50"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    {product.category?.name || 'Category'}
                  </span>
                  <Link
                    to={`/products/${product.slug || product._id}`}
                    className="block text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2 mt-1"
                  >
                    {product.title}
                  </Link>
                  <div className="text-base font-extrabold text-slate-900 mt-2">
                    {formatCurrency(effectivePrice)}
                  </div>
                </div>

                <Button
                  onClick={() => handleMoveToCart(product)}
                  size="sm"
                  className="w-full"
                  icon={ShoppingBag}
                >
                  Move to Cart
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistPage;
