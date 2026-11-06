import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Truck, Home } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/common/Button';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      
      {/* Celebration Icon */}
      <div className="w-24 h-24 mx-auto rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-500/10 animate-bounce">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-3">
        <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          Order Placed Successfully
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Thank you for your purchase!
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          We have received your order and our fulfillment center is preparing your package for express dispatch.
        </p>
      </div>

      {/* Order Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 text-left shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Order Reference ID</p>
            <p className="text-sm sm:text-base font-mono font-extrabold text-indigo-600 mt-0.5">
              #{orderId || order?._id || 'SP-' + Math.random().toString(36).substring(2, 9).toUpperCase()}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Payment Mode</p>
            <p className="text-xs font-bold text-emerald-600 mt-0.5">
              Cash on Delivery (Pay at Doorstep)
            </p>
          </div>
        </div>

        {order && (
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Items Total Payable:</span>
              <span className="font-extrabold text-slate-900 text-sm">
                {formatCurrency(order.totalPrice)}
              </span>
            </div>
            {order.shippingAddress && (
              <div className="text-xs text-slate-600 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800">Delivering To:</span>{' '}
                {order.shippingAddress.fullName}, {order.shippingAddress.street},{' '}
                {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                {order.shippingAddress.postalCode}
              </div>
            )}
          </div>
        )}

        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 flex items-center gap-3">
          <Truck className="w-5 h-5 text-indigo-600 shrink-0" />
          <span>
            Estimated delivery within <strong>3-5 business days</strong>. You will receive SMS & email notifications upon shipment.
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to="/orders">
          <Button size="lg" className="w-full sm:w-auto" icon={Package}>
            View in My Orders
          </Button>
        </Link>
        <Link to="/products">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto" icon={Home}>
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

