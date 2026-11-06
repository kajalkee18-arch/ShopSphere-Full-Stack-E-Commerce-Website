import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle2, Clock, Truck, AlertCircle, ShoppingBag } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { useToast } from '../../components/common/Toast';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

const AdminOrdersPage = () => {
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Detail Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await adminService.getAllOrders(params);
      if (res.success) setOrders(res.data.orders);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await adminService.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        addToast(`Order marked as ${newStatus}`);
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.data);
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update order status', 'error');
    }
  };

  const handleTogglePayment = async (orderId, currentPaidStatus) => {
    try {
      const res = await adminService.markOrderAsPaid(orderId, !currentPaidStatus);
      if (res.success) {
        addToast(res.message);
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.data);
        }
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update payment status', 'error');
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Order Fulfillment Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review orders, update dispatch statuses, and register cash payments
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-2xl overflow-x-auto">
          {['all', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Spinner label="Loading orders..." className="min-h-[40vh]" />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-4">Customer</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Total</th>
                  <th className="py-4 px-4">Payment</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-indigo-400">
                      #{ord._id.substring(ord._id.length - 8).toUpperCase()}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-white">{ord.user?.name || 'Customer'}</p>
                      <p className="text-[10px] text-slate-500">{ord.user?.email}</p>
                    </td>
                    <td className="py-4 px-4 text-slate-400">{formatDate(ord.createdAt)}</td>
                    <td className="py-4 px-4 font-extrabold text-white">
                      {formatCurrency(ord.totalPrice)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-200 block">
                          {ord.paymentMethod}
                        </span>
                        {ord.isPaid ? (
                          <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">
                            Paid
                          </span>
                        ) : (
                          <button
                            onClick={() => handleTogglePayment(ord._id, ord.isPaid)}
                            className="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold text-[10px] hover:bg-amber-500/30 transition-colors"
                            title="Click to mark COD paid upon delivery"
                          >
                            Unpaid (Click to Pay)
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500 font-medium"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => openOrderDetails(ord)}
                        className="p-1.5 rounded-lg text-indigo-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="View Order Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Order Details #${selectedOrder?._id?.substring(selectedOrder._id.length - 8).toUpperCase()}`}
        maxWidth="max-w-xl"
      >
        {selectedOrder && (
          <div className="space-y-6 text-xs text-slate-700">
            {/* Customer & Shipping Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex justify-between font-bold text-slate-900">
                <span>Customer: {selectedOrder.user?.name}</span>
                <span>📞 {selectedOrder.shippingAddress?.phone}</span>
              </div>
              <p className="text-slate-600">
                <strong>Address:</strong> {selectedOrder.shippingAddress?.street},{' '}
                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} -{' '}
                {selectedOrder.shippingAddress?.postalCode}
              </p>
              <p className="text-slate-600">
                <strong>Payment Mode:</strong> {selectedOrder.paymentMethod} (
                {selectedOrder.isPaid ? 'Payment Complete' : 'Cash Pending at Delivery'})
              </p>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 uppercase text-[11px]">Ordered Items</h4>
              {selectedOrder.orderItems?.map((it, i) => (
                <div key={i} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-3">
                    <img src={it.image} alt={it.title} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-semibold text-slate-900 line-clamp-1">{it.title}</p>
                      <p className="text-slate-400 text-[10px]">Qty: {it.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">{formatCurrency(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatCurrency(selectedOrder.itemsPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%):</span>
                <span className="font-semibold">{formatCurrency(selectedOrder.taxPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-semibold">
                  {selectedOrder.shippingPrice === 0 ? 'FREE' : formatCurrency(selectedOrder.shippingPrice)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-indigo-600 pt-2 border-t border-slate-200">
                <span>Total Amount:</span>
                <span>{formatCurrency(selectedOrder.totalPrice)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrdersPage;

