import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const redirectPath = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        addToast(`Welcome back, ${res.data.name}!`);
        if (res.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(redirectPath);
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick fill helper for testing
  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@shopsphere.com');
      setPassword('Admin@123');
    } else {
      setEmail('user@shopsphere.com');
      setPassword('User@123');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold text-slate-900">
              Shop<span className="text-indigo-600">Sphere</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign In to Your Account
          </h2>
          <p className="text-xs text-slate-500">
            Access your orders, saved wishlist, and checkout fast
          </p>
        </div>

        {/* Demo Accounts Quick-Fill Pill Bar */}
        <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-2">
          <p className="text-[11px] font-bold text-indigo-900 text-center uppercase tracking-wider">
            Quick Demo Fill:
          </p>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => fillDemoCredentials('customer')}
              className="px-3 py-1 bg-white hover:bg-indigo-600 hover:text-white text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 transition-colors shadow-sm"
            >
              👤 Customer Account
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials('admin')}
              className="px-3 py-1 bg-white hover:bg-indigo-600 hover:text-white text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-200 transition-colors shadow-sm"
            >
              🛡️ Admin Account
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            isLoading={isLoading}
            size="lg"
            className="w-full py-3.5"
            icon={ArrowRight}
          >
            Sign In
          </Button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

