import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/common/Button';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

  const taxAmount = Math.round(cartTotal * 0.05);
  const isFreeShipping = cartTotal >= 999;
  const shippingFee = cartItems.length > 0 ? (isFreeShipping ? 0 : 99) : 0;
  const grandTotal = cartTotal + taxAmount + shippingFee;
  const freeShippingThreshold = 999;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
          Explore our trending catalog and discover products you'll love.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 mt-6 px-7 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl text-sm shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition-all hover:scale-105"
        >
          Explore Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review your selected products before proceeding to checkout
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Free Shipping Progress Alert */}
          <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-center gap-3">
            <Truck className="w-5 h-5 text-indigo-600 shrink-0" />
            <div className="text-xs flex-1">
              {isFreeShipping ? (
                <span className="font-bold text-indigo-900">
                  🎉 Congratulations! Your order qualifies for Free Express Shipping.
                </span>
              ) : (
                <span className="text-slate-700">
                  Add <strong className="text-indigo-600 font-bold">{formatCurrency(amountNeededForFreeShipping)}</strong> more to get <strong className="text-indigo-600">Free Express Delivery</strong>!
                </span>
              )}
            </div>
          </div>

          {cartItems.map((item) => {
            const product = item.product;
            if (!product) return null;

            return (
              <div
                key={product._id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? product.images[0].url
                        : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200'
                    }
                    alt={product.title}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-100 shrink-0"
                  />
                  <div>
                    <Link
                      to={`/products/${product.slug || product._id}`}
                      className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1"
                    >
                      {product.title}
                    </Link>
                    <p className="text-xs text-slate-400 mt-0.5">Price: {formatCurrency(item.price)}</p>
                    <p className="text-[11px] font-semibold text-emerald-600 mt-1">Cash on Delivery Available</p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 mt-2 sm:mt-0">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                    <button
                      type="button"
                      disabled={item.quantity <= 1}
                      onClick={() => updateQuantity(product._id, item.quantity - 1)}
                      className="p-2 text-slate-500 hover:text-slate-900 disabled:opacity-30 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      disabled={item.quantity >= (product.stock || 99)}
                      onClick={() => updateQuantity(product._id, item.quantity + 1)}
                      className="p-2 text-slate-500 hover:text-slate-900 disabled:opacity-30 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[80px]">
                    <span className="text-sm font-extrabold text-slate-900 block">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Order Summary Card */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6 sticky top-24">
          <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
            Order Summary
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal</span>
              <span className="font-semibold text-slate-900">{formatCurrency(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Standard Tax (5% GST)</span>
              <span className="font-semibold text-slate-900">{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Express Shipping</span>
              <span className="font-semibold text-slate-900">
                {shippingFee === 0 ? (
                  <span className="text-emerald-600 uppercase font-bold">FREE</span>
                ) : (
                  formatCurrency(shippingFee)
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Total Payable</span>
              <span className="text-xl font-extrabold text-indigo-600">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Pay on Delivery enabled. No advance online payment needed.</span>
          </div>

          <Button
            onClick={() => navigate('/checkout')}
            size="lg"
            className="w-full py-4 text-sm font-bold shadow-lg shadow-indigo-600/25"
            icon={ArrowRight}
          >
            Proceed to Checkout
          </Button>

          <Link
            to="/products"
            className="block text-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            or Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
