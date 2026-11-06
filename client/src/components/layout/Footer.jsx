import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Headphones, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm mt-20 border-t border-slate-900">
      {/* Value Proposition Highlights */}
      <div className="border-b border-slate-900 py-10 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Free Express Shipping</h4>
                <p className="text-xs text-slate-400 mt-0.5">On all orders above ₹999 across India</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Cash on Delivery</h4>
                <p className="text-xs text-slate-400 mt-0.5">Inspect & pay at your doorstep with 100% safety</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Easy 7-Day Returns</h4>
                <p className="text-xs text-slate-400 mt-0.5">Hassle-free replacement or quick refund</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">24/7 Dedicated Support</h4>
                <p className="text-xs text-slate-400 mt-0.5">Live expert assistance whenever you need it</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Shop<span className="text-indigo-400">Sphere</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Discover a curated universe of premium electronics, bespoke fashion, artisanal home living, and wellness essentials. Designed for effortless discovery and fast delivery.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-500">
              <span>COD Enabled</span>
              <span>•</span>
              <span>Verified Merchant</span>
              <span>•</span>
              <span>SSL Encrypted</span>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4">Shop Categories</h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/products?category=electronics" className="hover:text-white transition-colors">
                  Electronics & Audio
                </Link>
              </li>
              <li>
                <Link to="/products?category=fashion" className="hover:text-white transition-colors">
                  Fashion & Streetwear
                </Link>
              </li>
              <li>
                <Link to="/products?category=home-kitchen" className="hover:text-white transition-colors">
                  Home & Kitchen
                </Link>
              </li>
              <li>
                <Link to="/products?category=sports-fitness" className="hover:text-white transition-colors">
                  Sports & Fitness
                </Link>
              </li>
              <li>
                <Link to="/products?category=books-stationery" className="hover:text-white transition-colors">
                  Books & Stationery
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4">Customer Care</h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Track My Order
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  Account Settings
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Payment Modes: Cash on Delivery / UPI</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-4">Stay in the Loop</h5>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe to get exclusive drops, secret discount vouchers, and seasonal catalogues.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3.5 py-2 font-medium rounded-xl transition-colors shrink-0"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ShopSphere Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>using React, Tailwind CSS & Node.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
