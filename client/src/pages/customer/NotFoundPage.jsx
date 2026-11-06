import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag } from 'lucide-react';
import Button from '../../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="text-7xl font-black text-indigo-600">404</div>
      <h1 className="text-2xl font-black text-slate-900">Page Not Found</h1>
      <p className="text-xs text-slate-500 leading-relaxed">
        The page you are looking for might have been moved, had its name changed, or is temporarily unavailable.
      </p>
      <div className="flex items-center justify-center gap-3 pt-2">
        <Link to="/">
          <Button icon={Home}>Return Home</Button>
        </Link>
        <Link to="/products">
          <Button variant="secondary" icon={ShoppingBag}>Browse Catalog</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

