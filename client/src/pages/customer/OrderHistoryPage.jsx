import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, ChevronRight, Clock, CheckCircle2, Truck, AlertCircle, Printer } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getMyOrders();
        if (res.success) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return <Spinner label="Loading your order history..." className="min-h-[50vh]" />;
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <Badge variant="success">Delivered</Badge>;
      case 'Shipped':
        return <Badge variant="primary">Shipped</Badge>;
      case 'Processing':
        return <Badge variant="warning">Processing</Badge>;
      case 'Cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="slate">Pending</Badge>;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
          <Package className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">No Orders Yet</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
          You haven't placed any orders yet. Discover our collection and get your first package delivered!
        </p>
        <Link
          to="/products"
          className="inline-block mt-6 px-7 py-3 bg-indigo-600 text-white font-bold rounded-2xl text-sm shadow-md hover:bg-indigo-700 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          My Order History ({orders.length})
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Track the progress and details of your previous purchases
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6 hover:border-indigo-200 transition-colors"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-indigo-600 font-bold block">
                  ORDER #{order._id.substring(order._id.length - 8).toUpperCase()}
                </span>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Placed on {formatDate(order.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-medium">Total Payable</p>
                  <p className="text-base font-black text-slate-900">
                    {formatCurrency(order.totalPrice)}
                  </p>
                </div>
                <div>{getStatusBadge(order.orderStatus)}</div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition-colors"
                  title="Print Order Receipt"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={
                        item.image ||
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200'
                      }
                      alt={item.title}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-100 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Qty: {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer Summary */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
              <div>
                Payment: <strong className="text-slate-700">{order.paymentMethod}</strong> (
                {order.isPaid ? (
                  <span className="text-emerald-600 font-semibold">Paid</span>
                ) : (
                  <span className="text-amber-600 font-semibold">Pending Delivery</span>
                )}
                )
              </div>
              <div>
                Shipping to:{' '}
                <span className="text-slate-700 font-medium">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryPage;

