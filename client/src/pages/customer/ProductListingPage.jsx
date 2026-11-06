import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { productService } from '../../services/productService';
import ProductGrid from '../../components/product/ProductGrid';
import ProductFilters from '../../components/product/ProductFilters';
import Spinner from '../../components/common/Spinner';

const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ totalProducts: 0, currentPage: 1, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter States
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page')) || 1;
  const [maxPrice, setMaxPrice] = useState(50000);
  const [selectedRating, setSelectedRating] = useState(null);

  // Load Categories once
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await productService.getCategories();
        if (res.success) setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch Products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = {
          page,
          limit: 12,
          sort
        };
        if (keyword) params.keyword = keyword;
        if (category && category !== 'all') params.category = category;
        if (maxPrice < 50000) params.maxPrice = maxPrice;
        if (selectedRating) params.rating = selectedRating;

        const res = await productService.getProducts(params);
        if (res.success) {
          setProducts(res.data.products);
          setPagination(res.data.pagination);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [keyword, category, sort, page, maxPrice, selectedRating]);

  // Query parameter mutators
  const handleCategorySelect = (catSlug) => {
    searchParams.set('category', catSlug);
    searchParams.set('page', '1');
    setSearchParams(searchParams);
    setIsMobileFilterOpen(false);
  };

  const handleSortChange = (newSort) => {
    searchParams.set('sort', newSort);
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  const handlePageChange = (newPage) => {
    searchParams.set('page', String(newPage));
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setMaxPrice(50000);
    setSelectedRating(null);
    setSearchParams({});
    setIsMobileFilterOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {keyword ? `Search results for "${keyword}"` : 'Browse Catalog'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {products.length} of {pagination.totalProducts} available products
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            Filters
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 text-xs font-semibold py-2.5 px-3 rounded-xl focus:outline-none focus:border-indigo-500 shadow-sm"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <ProductFilters
              categories={categories}
              selectedCategory={category}
              onSelectCategory={handleCategorySelect}
              maxPrice={maxPrice}
              onChangeMaxPrice={setMaxPrice}
              selectedRating={selectedRating}
              onSelectRating={setSelectedRating}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm lg:hidden flex justify-end">
            <div className="w-full max-w-xs bg-white min-h-screen p-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <h3 className="font-bold text-slate-900 text-base">Filters</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ProductFilters
                categories={categories}
                selectedCategory={category}
                onSelectCategory={handleCategorySelect}
                maxPrice={maxPrice}
                onChangeMaxPrice={setMaxPrice}
                selectedRating={selectedRating}
                onSelectRating={setSelectedRating}
                onResetFilters={handleResetFilters}
              />
            </div>
          </div>
        )}

        {/* Products Grid & Pagination Area */}
        <div className="lg:col-span-3 space-y-8">
          {isLoading ? (
            <Spinner label="Filtering catalog items..." className="min-h-[40vh]" />
          ) : (
            <>
              <ProductGrid products={products} />

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8 border-t border-slate-200">
                  <button
                    disabled={pagination.currentPage <= 1}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="px-4 py-2 text-xs font-semibold text-slate-700">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>

                  <button
                    disabled={pagination.currentPage >= pagination.totalPages}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
