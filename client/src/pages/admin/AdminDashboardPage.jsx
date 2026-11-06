import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  AlertTriangle, 
  Package, 
  ArrowRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { adminService } from '../../services/adminService';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';

const AdminDashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [salesTrend, setSalesTrend] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [overviewRes, trendRes] = await Promise.all([
          adminService.getAnalytics(),
          adminService.getSalesTrend()
        ]);
        if (overviewRes.success) setAnalytics(overviewRes.data);
        if (trendRes.success) setSalesTrend(trendRes.data);
      } catch (err) {
        console.error('Failed to load admin analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <Spinner label="Aggregating store metrics..." className="min-h-[60vh]" />;
  }

  const metrics = analytics?.metrics || {
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockCount: 0
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Store Analytics & Insights
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Live overview of sales performance, active inventory, and pending fulfillments
        </p>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-4">
            {formatCurrency(metrics.totalRevenue)}
          </div>
          <p className="text-xs text-emerald-400 font-medium mt-1">✓ Lifetime store sales</p>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-4">
            {metrics.totalOrders}
          </div>
          <p className="text-xs text-slate-400 font-medium mt-1">Processed transactions</p>
        </div>

        {/* Total Customers */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Registered Users</span>
            <div className="w-10 h-10 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-4">
            {metrics.totalCustomers}
          </div>
          <p className="text-xs text-slate-400 font-medium mt-1">Active customer accounts</p>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Low Stock Items</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-4">
            {metrics.lowStockCount}
          </div>
          <p className="text-xs text-amber-400 font-medium mt-1">Stock ≤ 5 units warning</p>
        </div>
      </div>

      {/* Interactive Sales Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white">Monthly Sales Trend</h3>
            <p className="text-xs text-slate-400 mt-0.5">Revenue generated over recent months</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesTrend}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={11} 
                tickFormatter={(val) => `₹${val / 1000}k`} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                formatter={(val) => [formatCurrency(val), 'Revenue']}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#6366f1" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Section: Recent Orders & Low Stock Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Orders Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-extrabold text-white">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {analytics?.recentOrders?.length > 0 ? (
              analytics.recentOrders.map((ord) => (
                <div key={ord._id} className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">{ord.user?.name || 'Customer'}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{formatDate(ord.createdAt)} • {ord.paymentMethod}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-white">{formatCurrency(ord.totalPrice)}</p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px] font-semibold">
                      {ord.orderStatus}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No recent orders placed yet.</p>
            )}
          </div>
        </div>

        {/* Low Stock Alerts Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-extrabold text-white">Inventory Restock Watch</h3>
            <Link to="/admin/products" className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1">
              Manage Products <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {analytics?.lowStockProducts?.length > 0 ? (
              analytics.lowStockProducts.map((prod) => (
                <div key={prod._id} className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=100'}
                      alt={prod.title}
                      className="w-10 h-10 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <p className="font-bold text-white line-clamp-1">{prod.title}</p>
                      <p className="text-[11px] text-slate-400 font-mono">SKU: {prod.sku}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 font-black rounded-lg text-xs">
                      {prod.stock} left
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-emerald-400 py-4 text-center">
                ✓ All items currently have healthy stock levels!
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;
