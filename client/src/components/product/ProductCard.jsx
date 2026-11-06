import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../common/Toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const discountPercent =
    product.discountPrice > 0 && product.price > product.discountPrice
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : null;

  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    const res = await addToCart(product, 1);
    setIsAdding(false);
    if (res.success) {
      addToast(`Added "${product.title}" to cart!`);
    } else {
      addToast(res.message || 'Failed to add item to cart', 'error');
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await toggleWishlist(product);
    addToast(res.message);
  };

  const imageUrl = product.images && product.images.length > 0
    ? product.images[0].url
    : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600';

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-500/30 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Product Image Container */}
      <Link to={`/products/${product.slug || product._id}`} className="relative aspect-square overflow-hidden bg-slate-100 block">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discountPercent && (
          <span className="absolute top-3 left-3 bg-rose-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md shadow-rose-500/20">
            {discountPercent}% OFF
          </span>
        )}

        {/* Out of Stock Pill */}
        {product.stock <= 0 && (
          <span className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center text-white font-bold text-sm">
            Sold Out
          </span>
        )}

        {/* Wishlist Heart Action */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 shadow-sm ${
            wishlisted
              ? 'bg-rose-500 text-white'
              : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white'
          }`}
          title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
        </button>
      </Link>

      {/* Product Info Body */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
            {product.category?.name || 'Category'}
          </span>
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{product.ratingsAverage > 0 ? product.ratingsAverage.toFixed(1) : 'New'}</span>
            {product.numReviews > 0 && (
              <span className="text-slate-400 font-normal">({product.numReviews})</span>
            )}
          </div>
        </div>

        {/* Title */}
        <Link
          to={`/products/${product.slug || product._id}`}
          className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2 text-sm leading-snug mb-3 flex-1"
          title={product.title}
        >
          {product.title}
        </Link>

        {/* Price & Add to Cart Action */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-extrabold text-slate-900">
                {formatCurrency(effectivePrice)}
              </span>
              {product.discountPrice > 0 && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold block">COD Available</span>
          </div>

          <button
            type="button"
            disabled={product.stock <= 0 || isAdding}
            onClick={handleAddToCart}
            className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed group/btn shadow-sm"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
