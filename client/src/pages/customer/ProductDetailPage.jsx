import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  Star, 
  Check, 
  Minus, 
  Plus,
  Send,
  User as UserIcon
} from 'lucide-react';
import { productService } from '../../services/productService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import Spinner from '../../components/common/Spinner';
import RatingStars from '../../components/common/RatingStars';
import Button from '../../components/common/Button';

const ProductDetailPage = () => {
  const { idOrSlug } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const loadProductData = async () => {
      setIsLoading(true);
      try {
        const prodRes = await productService.getProductByIdOrSlug(idOrSlug);
        if (prodRes.success) {
          setProduct(prodRes.data);
          const revRes = await productService.getProductReviews(prodRes.data._id);
          if (revRes.success) {
            setReviews(revRes.data);
          }
        }
      } catch (error) {
        console.error('Failed to load product details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [idOrSlug]);

  if (isLoading) {
    return <Spinner label="Loading product specifications..." className="min-h-[60vh]" />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The product you are looking for does not exist or has been removed.</p>
        <Link to="/products" className="inline-block mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold">
          Back to Store
        </Link>
      </div>
    );
  }

  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const wishlisted = isWishlisted(product._id);
  const discountPercent =
    product.discountPrice > 0 && product.price > product.discountPrice
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : null;

  const handleAddToCart = async () => {
    setIsAdding(true);
    const res = await addToCart(product, quantity);
    setIsAdding(false);
    if (res.success) {
      addToast(`Added ${quantity} item(s) to your cart!`);
    } else {
      addToast(res.message || 'Failed to add item', 'error');
    }
  };

  const handleToggleWishlist = async () => {
    const res = await toggleWishlist(product);
    addToast(res.message);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please login to write a verified customer review', 'error');
      return;
    }
    if (!reviewComment.trim()) {
      addToast('Please write your review feedback comment', 'error');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await productService.createProductReview(product._id, {
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment
      });

      if (res.success) {
        addToast('Thank you! Your verified review has been posted.');
        setReviews([res.data, ...reviews]);
        setReviewTitle('');
        setReviewComment('');
        // Update product ratings
        setProduct((prev) => ({
          ...prev,
          numReviews: prev.numReviews + 1,
          ratingsAverage:
            Math.round(
              ((prev.ratingsAverage * prev.numReviews + reviewRating) / (prev.numReviews + 1)) * 10
            ) / 10
        }));
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const activeImage =
    product.images && product.images.length > 0
      ? product.images[activeImageIndex]?.url
      : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-indigo-600 transition-colors">Catalog</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category?.slug}`} className="hover:text-indigo-600 transition-colors">
          {product.category?.name || 'Category'}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-sm flex items-center justify-center">
            <img
              src={activeImage}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
            {discountPercent && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-md shadow-rose-500/20">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === index
                      ? 'border-indigo-600 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div className="space-y-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
              {product.category?.name}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {product.title}
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <RatingStars rating={product.ratingsAverage} size="md" showValue />
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">
                {product.numReviews} Verified Reviews
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-400 font-mono">SKU: {product.sku}</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-slate-100/70 border border-slate-200/60">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                {formatCurrency(effectivePrice)}
              </span>
              {product.discountPrice > 0 && (
                <span className="text-lg text-slate-400 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              ✓ Inclusive of all taxes | Cash on Delivery (COD) Available
            </p>
          </div>

          {/* Stock Availability */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Availability:</span>
            {product.stock > 5 ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                <Check className="w-4 h-4" /> In Stock ({product.stock} units)
              </span>
            ) : product.stock > 0 ? (
              <span className="text-xs font-bold text-amber-600">
                ⚠️ Only {product.stock} left in stock - order soon!
              </span>
            ) : (
              <span className="text-xs font-bold text-rose-600">Out of Stock</span>
            )}
          </div>

          {/* Quantity Selector & Action Buttons */}
          {product.stock > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={quantity >= product.stock}
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="p-2.5 text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button
                  onClick={handleAddToCart}
                  isLoading={isAdding}
                  size="lg"
                  className="w-full sm:flex-1 py-3.5"
                  icon={ShoppingBag}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleToggleWishlist}
                  className={`w-full sm:w-auto py-3.5 px-5 ${wishlisted ? 'text-rose-600 border-rose-200 bg-rose-50' : ''}`}
                  icon={Heart}
                >
                  {wishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Product Overview</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Service Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 text-center">
            <div className="p-3 rounded-xl bg-white border border-slate-200/80">
              <Truck className="w-5 h-5 mx-auto text-indigo-600 mb-1" />
              <p className="text-[11px] font-bold text-slate-800">Free Express</p>
              <p className="text-[10px] text-slate-400">On ₹999+</p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/80">
              <ShieldCheck className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
              <p className="text-[11px] font-bold text-slate-800">COD Available</p>
              <p className="text-[10px] text-slate-400">Pay at Doorstep</p>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200/80">
              <RefreshCw className="w-5 h-5 mx-auto text-amber-600 mb-1" />
              <p className="text-[11px] font-bold text-slate-800">Easy Returns</p>
              <p className="text-[10px] text-slate-400">7 Days Guarantee</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Feedback Section */}
      <section className="pt-10 border-t border-slate-200 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Customer Feedback & Ratings
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Read authentic feedback from verified buyers
            </p>
          </div>
          <div className="flex items-center gap-3 p-3 px-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-2xl font-black text-slate-900">
              {product.ratingsAverage.toFixed(1)}
            </span>
            <div>
              <RatingStars rating={product.ratingsAverage} size="sm" />
              <p className="text-[10px] text-slate-400 mt-0.5">{reviews.length} Total Reviews</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Write a Review Card */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm h-fit">
            <h3 className="text-base font-bold text-slate-900 mb-2">Write a Review</h3>
            <p className="text-xs text-slate-500 mb-4">
              Share your experience with other shoppers
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Your Rating
                </label>
                <RatingStars
                  rating={reviewRating}
                  size="md"
                  interactive
                  onChange={setReviewRating}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Review Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Exceptional sound clarity & fit!"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Detailed Comment
                </label>
                <textarea
                  rows="4"
                  placeholder="Tell others what you loved about this product..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                  required
                />
              </div>

              <Button
                type="submit"
                isLoading={isSubmittingReview}
                className="w-full"
                icon={Send}
              >
                Submit Review
              </Button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            {reviews.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                <p className="text-sm font-semibold text-slate-700">No customer reviews yet</p>
                <p className="text-xs text-slate-400 mt-1">Be the first verified customer to share your thoughts!</p>
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                        alt={rev.user?.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <span className="text-xs font-bold text-slate-800">{rev.user?.name || 'Verified Customer'}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{formatDate(rev.createdAt)}</span>
                  </div>
                  <RatingStars rating={rev.rating} size="sm" />
                  {rev.title && <h4 className="text-xs font-bold text-slate-900">{rev.title}</h4>}
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;

