import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Clock, ShoppingBag } from 'lucide-react';
import { productService } from '../../services/productService';
import ProductCard from '../../components/product/ProductCard';
import Spinner from '../../components/common/Spinner';
import MotionBackground from '../../components/common/MotionBackground';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productService.getFeaturedProducts(),
          productService.getCategories()
        ]);
        if (prodRes.success) setFeaturedProducts(prodRes.data);
        if (catRes.success) setCategories(catRes.data);
      } catch (error) {
        console.error('Failed to load homepage data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  if (isLoading) {
    return <Spinner label="Curating the latest arrivals..." className="min-h-[60vh]" />;
  }

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Banner Section with Motion Graphics Background */}
      <section className="relative overflow-hidden text-white py-16 sm:py-24 rounded-b-[2.5rem] shadow-2xl border-b border-indigo-500/20">
        <MotionBackground />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                Next-Gen E-Commerce Experience
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Curated Luxury for the <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-violet-300 bg-clip-text text-transparent">Modern Lifestyle</span>.
              </h1>
              
              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Explore handcrafted tech, designer fashion, and home essentials. Delivered with speed and backed by verified Cash on Delivery protection.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Explore Catalog
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <Link
                  to="/products?category=electronics"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm backdrop-blur-md border border-white/10 transition-all"
                >
                  Browse Electronics
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800 text-center lg:text-left">
                <div>
                  <p className="text-xl font-extrabold text-white">100%</p>
                  <p className="text-xs text-slate-400">Genuine Products</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-white">COD</p>
                  <p className="text-xs text-slate-400">Pay at Doorstep</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-white">7 Days</p>
                  <p className="text-xs text-slate-400">Easy Returns</p>
                </div>
              </div>
            </div>

            {/* Hero Visual Mockup */}
            <div className="relative mx-auto lg:mx-0 max-w-md lg:max-w-none group">
              {/* Dynamic Ambient Neon Aura Glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] blur-2xl opacity-40 group-hover:opacity-75 transition-all duration-700 animate-pulse pointer-events-none" />

              <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900/40 backdrop-blur-sm">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800"
                  alt="Aura Pro Headphones"
                  className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/20 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                        Trending Showcase
                      </span>
                      <h3 className="text-base font-bold text-white">Aura Pro Noise Cancelling</h3>
                      <p className="text-sm font-extrabold text-indigo-400">₹12,499</p>
                    </div>
                    <Link
                      to="/products/aura-pro-anc-headphones"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30 hover:scale-105"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills / Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Browse Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
          >
            All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/products?category=${category.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 flex flex-col justify-end p-4 border border-slate-200/80 hover:shadow-lg transition-all"
            >
              <img
                src={category.image || 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=500'}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="relative z-10">
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {category.name}
                </h3>
                <p className="text-[11px] text-slate-300 mt-0.5">Explore Drops</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Top Picks for You
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Featured Products
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
          >
            View All ({featuredProducts.length}+) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Promotion Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-700 to-indigo-900 text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-indigo-200">
              Limited Period Offer
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Get Free Shipping on all Cash on Delivery Orders!
            </h3>
            <p className="text-sm text-indigo-100 max-w-xl">
              Place your order risk-free today. Verify the merchandise when it reaches your home, and pay directly to the courier executive.
            </p>
          </div>
          <Link
            to="/products"
            className="px-8 py-4 bg-white text-indigo-900 font-extrabold text-sm rounded-2xl hover:bg-indigo-50 shadow-lg transition-transform hover:scale-105 shrink-0"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

