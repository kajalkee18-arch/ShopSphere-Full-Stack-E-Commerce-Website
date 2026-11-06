import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  Banknote, 
  CheckCircle2, 
  Truck, 
  Lock,
  ArrowRight,
  Plus
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { useToast } from '../../components/common/Toast';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, addAddress } = useAuth();
  const { addToast } = useToast();

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  // New address form state
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: user?.phone || '',
    isDefault: false
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const taxAmount = Math.round(cartTotal * 0.05);
  const isFreeShipping = cartTotal >= 999;
  const shippingFee = isFreeShipping ? 0 : 99;
  const grandTotal = cartTotal + taxAmount + shippingFee;

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.postalCode || !newAddress.phone) {
      addToast('Please fill out all address fields', 'error');
      return;
    }
    const res = await addAddress(newAddress);
    if (res.success) {
      addToast('New address saved!');
      setIsAddingNewAddress(false);
      setSelectedAddressIndex((user?.addresses?.length || 1) - 1);
    }
  };

  const handlePlaceOrder = async () => {
    const currentAddress = user?.addresses?.[selectedAddressIndex];

    if (!currentAddress && !newAddress.street) {
      addToast('Please provide a valid shipping address', 'error');
      return;
    }

    const shippingAddress = currentAddress || newAddress;

    setIsPlacingOrder(true);
    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName: shippingAddress.fullName || user?.name,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country || 'India',
          phone: shippingAddress.phone || user?.phone
        },
        paymentMethod: paymentMethod // 'COD' default
      };

      const res = await orderService.createOrder(orderPayload);
      if (res.success) {
        await clearCart();
        addToast('Order confirmed successfully!');
        navigate(`/order-success/${res.data.order._id}`, {
          state: { order: res.data.order }
        });
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Page Title & Secure Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Secure Checkout
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete your order with verified Cash on Delivery protection
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-bit SSL Encrypted & Verified</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left 2 Columns: Multi-step Options */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Step 1: Shipping Address */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Select Delivery Address
                </h3>
              </div>
              {user?.addresses?.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {isAddingNewAddress ? 'Cancel' : 'Add New Address'}
                </button>
              )}
            </div>

            {/* Saved Addresses List */}
            {user?.addresses && user.addresses.length > 0 && !isAddingNewAddress && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses.map((addr, idx) => (
                  <div
                    key={addr._id || idx}
                    onClick={() => setSelectedAddressIndex(idx)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedAddressIndex === idx
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900">{addr.fullName}</span>
                      {selectedAddressIndex === idx && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-2 font-medium">📞 {addr.phone}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Address Form (if no addresses saved or toggled) */}
            {(isAddingNewAddress || !user?.addresses || user.addresses.length === 0) && (
              <form onSubmit={handleAddNewAddress} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    required
                  />
                  <Input
                    label="Mobile Number"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    required
                  />
                </div>
                <Input
                  label="Street Address / Flat / Landmark"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    required
                  />
                  <Input
                    label="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    required
                  />
                  <Input
                    label="Postal Code (PIN)"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" variant="secondary" size="sm">
                  Save Address
                </Button>
              </form>
            )}
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                Payment Option
              </h3>
            </div>

            <div className="space-y-3">
              
              {/* Cash on Delivery (ACTIVE) */}
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                  paymentMethod === 'COD'
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Banknote className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">
                      Cash on Delivery (COD)
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Pay with cash or UPI directly to our delivery courier when your package arrives at your doorstep. Zero advance payment needed.
                  </p>
                </div>
              </div>

              {/* Online Payment (Razorpay / Cards) - Modular Switch Preview */}
              <div
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 opacity-80 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">
                      Credit / Debit Card / UPI / NetBanking
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-600 text-[10px] font-bold">
                      Razorpay Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Online gateway integration enabled. Will activate seamlessly in production with your Razorpay API keys!
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right 1 Column: Sticky Order Review */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6 sticky top-24">
          <h3 className="text-base font-extrabold text-slate-900 pb-3 border-b border-slate-100">
            Order Review ({cartItems.length} items)
          </h3>

          {/* Items Mini-list */}
          <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
            {cartItems.map((item) => (
              <div key={item.product._id} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <img
                    src={item.product.images?.[0]?.url}
                    alt={item.product.title}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-100 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <p className="font-semibold text-slate-800 truncate">{item.product.title}</p>
                    <p className="text-slate-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-slate-900 shrink-0">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Total</span>
              <span className="font-semibold text-slate-900">{formatCurrency(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST (5%)</span>
              <span className="font-semibold text-slate-900">{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Express Delivery</span>
              <span className="font-semibold text-slate-900">
                {shippingFee === 0 ? (
                  <span className="text-emerald-600 font-bold uppercase">FREE</span>
                ) : (
                  formatCurrency(shippingFee)
                )}
              </span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-sm font-extrabold text-slate-900">Final Amount</span>
              <span className="text-xl font-black text-indigo-600">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>

          <Button
            onClick={handlePlaceOrder}
            isLoading={isPlacingOrder}
            size="lg"
            className="w-full py-4 text-sm font-bold shadow-lg shadow-indigo-600/25"
            icon={ArrowRight}
          >
            Confirm & Place Order
          </Button>

          <p className="text-[11px] text-center text-slate-400">
            By placing your order, you agree to ShopSphere's Terms & Conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

