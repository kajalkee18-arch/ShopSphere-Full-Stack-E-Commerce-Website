import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingBag, 
  Users, 
  ArrowLeft,
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Products Catalog', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
    { name: 'Customer Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'User Accounts', path: '/admin/users', icon: Users }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col border-r border-slate-800 shrink-0">
      {/* Admin Header */}
      <div className="p-6 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-extrabold text-white">ShopSphere</span>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              Admin Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-2">
          Management
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pt-6 pb-2">
          Shortcuts
        </div>

        <Link
          to="/"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>
      </nav>

      {/* Admin Profile & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-3 mb-3 px-2">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'}
            alt="Admin"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
          />
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{user?.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-950/40 rounded-xl transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out of Admin
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

